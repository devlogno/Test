'use client'

import WebApp from '@twa-dev/sdk'
import { useEffect, useState } from 'react'

// Define the interface for user data
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isInputVisible, setIsInputVisible] = useState(true)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showChannelMessage, setShowChannelMessage] = useState(true) // State for showing the main channel message
  const [isOutsideTelegram, setIsOutsideTelegram] = useState(false) // State to detect if outside Telegram

  useEffect(() => {
    // Check if the app is opened inside Telegram
    const isTelegram = navigator.userAgent.includes('Telegram');
    setIsOutsideTelegram(!isTelegram);

    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }

    // Set a timer to hide the main channel message after 6 seconds
    const channelMessageTimer = setTimeout(() => {
      setShowChannelMessage(false);
    }, 6000);

    return () => clearTimeout(channelMessageTimer); // Cleanup timer on unmount
  }, []);

  const extractIdFromUrl = (url: string) => {
    const regex = /\/s\/1([^/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    const id = extractIdFromUrl(url);

    if (id) {
      const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
      const embedUrl = `https://www.terabox.com/sharing/embed?surl=${id}`;
      iframe.src = embedUrl;
      setErrorMessage(null); // Clear error message if the URL is valid

      resetFadeOut();
    } else {
      setErrorMessage('Invalid link. Please enter a valid Terabox URL.'); // Set error message if the URL is invalid
    }
  };

  const resetFadeOut = () => {
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      setIsInputVisible(false);
      const inputElement = document.getElementById('urlInput') as HTMLInputElement;
      inputElement.value = ''; // Clear the URL
      inputElement.blur();
    }, 5000);

    setTimer(newTimer);
  };

  const handleInputFocus = () => {
    setIsInputVisible(true);
    resetFadeOut();
  };

  if (isOutsideTelegram) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
          color: 'white',
          fontSize: '20px',
          textAlign: 'center',
        }}
      >
        <div>
          This app works best in Telegram. Please open it using the Telegram app.<br />
          <a
            href="https://t.me/CocoBotz"
            style={{ color: 'lightblue', textDecoration: 'underline' }}
          >
            Open in Telegram
          </a>
        </div>
      </div>
    );
  }

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        margin: 0,
        padding: 0,
      }}
    >
      {showChannelMessage && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            zIndex: 20,
          }}
        >
          Join<br /> <a href="https://t.me/CocoBotz" style={{ color: "lightblue" }}>@CocoBotz</a>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: "9px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
          transition: "opacity 0.5s ease",
          opacity: isInputVisible ? 1 : 0,
        }}
      >
        <input
          id="urlInput"
          type="text"
          placeholder="Paste URL"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          style={{
            width: "30%",
            padding: "8px",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            outline: "none",
          }}
        />
      </div>

      {errorMessage && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            color: "red",
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {errorMessage}
        </div>
      )}

      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <iframe
          id="myIframe"
          frameBorder="0"
          allowFullScreen
          style={{
            width: "100vw",
            height: "100vh",
            border: "none",
            overflow: "hidden",
          }}
        ></iframe>
      </div>
    </main>
  );
}
