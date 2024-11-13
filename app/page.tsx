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

interface ValidUser {
  id: number;
  addedAt: number; // Timestamp for when the user was added
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isInputVisible, setIsInputVisible] = useState(true)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const adminId = 5459502292;
  const [validUsers, setValidUsers] = useState<ValidUser[]>([]); // List of valid users with timestamps
  const [newUserId, setNewUserId] = useState<string>('');

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData)
    }

    const storedUsers = localStorage.getItem('validUsers');
    if (storedUsers) {
      setValidUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('validUsers', JSON.stringify(validUsers));
  }, [validUsers]);

  const isAccessExpired = (addedAt: number) => {
    const currentTime = Date.now();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    return currentTime - addedAt > threeDaysInMs;
  };

  const hasAccess = () => {
    return (
      userData &&
      validUsers.some(
        (user) => user.id === userData.id && !isAccessExpired(user.addedAt)
      )
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    const id = extractIdFromUrl(url);

    if (id) {
      const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
      const embedUrl = `https://www.terabox.com/sharing/embed?surl=${id}`;
      iframe.src = embedUrl;

      resetFadeOut();
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
    }, 2000);

    setTimer(newTimer);
  };

  const handleInputFocus = () => {
    setIsInputVisible(true);
    resetFadeOut();
  };

  const handleAddUserId = () => {
    const newId = parseInt(newUserId);
    if (!isNaN(newId) && !validUsers.some((user) => user.id === newId)) {
      setValidUsers((prevUsers) => [
        ...prevUsers,
        { id: newId, addedAt: Date.now() },
      ]);
      setNewUserId('');
    }
  };

  const handleRemoveUserId = (id: number) => {
    setValidUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

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
      {userData && userData.id === adminId ? (
        <>
          <div>
            <h2 style={{ color: 'white', textAlign: 'center' }}>Admin Actions</h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Enter User ID"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "5px",
                  background: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  outline: "none",
                  width: "30%",
                }}
              />
              <button
                onClick={handleAddUserId}
                style={{
                  marginLeft: "10px",
                  padding: "10px 15px",
                  fontSize: "16px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Add ID
              </button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'white' }}>Valid User IDs</h3>
              <ul>
                {validUsers.map((user) => (
                  <li key={user.id} style={{ color: 'white' }}>
                    {user.id} - {isAccessExpired(user.addedAt) ? 'Expired' : 'Active'}{' '}
                    <button
                      onClick={() => handleRemoveUserId(user.id)}
                      style={{
                        marginLeft: "10px",
                        padding: "5px",
                        fontSize: "12px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : hasAccess() ? (
        <>
          <div
            style={{
              position: "absolute",
              top: "20px",
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
              placeholder="Paste URL here"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              style={{
                width: "30%",
                padding: "10px",
                fontSize: "16px",
                border: "none",
                borderRadius: "5px",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                outline: "none",
              }}
            />
          </div>
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
        </>
      ) : (
        <div
          style={{ color: 'red', cursor: 'pointer' }}
          onClick={() => window.open('https://youtube.com')}
        >
          This Bot is paid. Subscribe Now
        </div>
      )}
    </main>
  );
}

const extractIdFromUrl = (url: string) => {
  const regex = /\/s\/1([^/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
