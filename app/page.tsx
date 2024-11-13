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

  // Admin ID and initial valid user IDs
  const adminId = 5459502292;
  const [validUserIds, setValidUserIds] = useState<number[]>([]);

  const [newUserId, setNewUserId] = useState<string>('');

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData)
    }

    // Load valid user IDs from local storage on component mount
    const storedIds = localStorage.getItem('validUserIds');
    if (storedIds) {
      setValidUserIds(JSON.parse(storedIds));
    }
  }, []);

  useEffect(() => {
    // Save valid user IDs to local storage whenever they change
    localStorage.setItem('validUserIds', JSON.stringify(validUserIds));
  }, [validUserIds]);

  // Function to extract the 'id' from the given URL
  const extractIdFromUrl = (url: string) => {
    const regex = /\/s\/1([^/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Event handler for input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    const id = extractIdFromUrl(url);

    if (id) {
      const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
      const embedUrl = `https://www.terabox.com/sharing/embed?surl=${id}`;
      iframe.src = embedUrl;

      // Hide the input bar after 2 seconds and clear URL
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
      inputElement.value = ''; // Clear the URL
      inputElement.blur();
    }, 2000);

    setTimer(newTimer);
  };

  const handleInputFocus = () => {
    setIsInputVisible(true);
    resetFadeOut();
  };

  // Function to add a new user ID
  const handleAddUserId = () => {
    const newId = parseInt(newUserId);
    if (!isNaN(newId) && !validUserIds.includes(newId)) {
      setValidUserIds((prevIds) => [...prevIds, newId]);
      setNewUserId(''); // Clear input field
    }
  };

  // Function to remove a user ID
  const handleRemoveUserId = (id: number) => {
    setValidUserIds((prevIds) => prevIds.filter((userId) => userId !== id));
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
                {validUserIds.map((id) => (
                  <li key={id} style={{ color: 'white' }}>
                    {id}{' '}
                    <button
                      onClick={() => handleRemoveUserId(id)}
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
      ) : userData && validUserIds.includes(userData.id) ? (
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
        <div>Loading...</div>
      )}
    </main>
  );
}
