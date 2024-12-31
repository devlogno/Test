'use client';

import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';
import Head from 'next/head'; // Import Head for managing the <head> section

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showChannelMessage, setShowChannelMessage] = useState(true); // State for showing the main channel message
  const [isAllowed, setIsAllowed] = useState(false); // To determine if the app runs in Telegram
  const [isLoading, setIsLoading] = useState(true); // Loading state to avoid flickering

  useEffect(() => {
    if (WebApp.initData) {
      setIsAllowed(true);
      setUserData(WebApp.initDataUnsafe.user as UserData);
    } else {
      setIsAllowed(false);
    }

    setIsLoading(false);

    const channelMessageTimer = setTimeout(() => {
      setShowChannelMessage(false);
    }, 6000);

    return () => clearTimeout(channelMessageTimer);
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
      setErrorMessage(null);

      resetFadeOut();
    } else {
      setErrorMessage('Invalid link. Please enter a valid Terabox URL.');
    }
  };

  const resetFadeOut = () => {
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      setIsInputVisible(false);
      const inputElement = document.getElementById('urlInput') as HTMLInputElement;
      inputElement.value = '';
      inputElement.blur();
    }, 5000);

    setTimer(newTimer);
  };

  const handleInputFocus = () => {
    setIsInputVisible(true);
    resetFadeOut();
  };

  if (isLoading) {
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
        Loading...
      </div>
    );
  }

  if (!isAllowed) {
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
          This app works only inside Telegram. Please open it in the Telegram app.<br />
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
    <>
      <Head>
        {/* Google Tag Manager Script */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FN46S3XWG5"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FN46S3XWG5');
            `,
          }}
        />
      </Head>
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
            width: "80%",
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
              width: "35%",
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
    </>
  );
}
