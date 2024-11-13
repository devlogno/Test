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
  name: string;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isInputVisible, setIsInputVisible] = useState(true)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const adminId = 5459502292;
  const [validUsers, setValidUsers] = useState<ValidUser[]>([]);
  const [newUserId, setNewUserId] = useState<string>('');
  const [newUserName, setNewUserName] = useState<string>('');

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

    if (userData && validUsers.some(user => user.id === userData.id)) {
      setUserData({ ...userData });
    }
  }, [validUsers, userData]);

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

  const handleAddUser = () => {
    const newId = parseInt(newUserId);
    if (!isNaN(newId) && newUserName.trim() && !validUsers.some(user => user.id === newId)) {
      setValidUsers((prevUsers) => [...prevUsers, { id: newId, name: newUserName.trim() }]);
      setNewUserId('');
      setNewUserName('');
    }
  };

  const handleRemoveUser = (id: number) => {
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
                  width: "20%",
                  marginRight: "10px"
                }}
              />
              <input
                type="text"
                placeholder="Enter User Name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "5px",
                  background: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  outline: "none",
                  width: "20%"
                }}
              />
              <button
                onClick={handleAddUser}
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
                Add User
              </button>
            </div>
            <div
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: 'white' }}>Valid Users</h3>
              <ul style={{ padding: 0, listStyle: 'none' }}>
                {validUsers.map((user) => (
                  <li key={user.id} style={{ color: 'white', marginBottom: '10px' }}>
                    {user.name} (ID: {user.id})
                    <button
                      onClick={() => handleRemoveUser(user.id)}
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
      ) : userData && validUsers.some(user => user.id === userData.id) ? (
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
          onClick={() => window.open('https://yourlink.com',)}
        >
          This Bot is paid. Subscribe Now
        </div>
      )}
    </main>
  );
}
