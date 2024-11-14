'use client'

import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';

// Define the interface for user data
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

interface TrialUser {
  id: number;
  name: string;
  startDate: string;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [trialUsers, setTrialUsers] = useState<TrialUser[]>([]);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [newUserId, setNewUserId] = useState<string>('');
  const [validUserIds, setValidUserIds] = useState<number[]>([]);
  const adminId = 5459502292;

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      const user = WebApp.initDataUnsafe.user as UserData;
      setUserData(user);

      // Load trial users and valid user IDs from local storage
      const storedTrialUsers = localStorage.getItem('trialUsers');
      const storedValidIds = localStorage.getItem('validUserIds');
      setTrialUsers(storedTrialUsers ? JSON.parse(storedTrialUsers) : []);
      setValidUserIds(storedValidIds ? JSON.parse(storedValidIds) : []);

      // Check if the user is in trial period
      const existingTrialUser = trialUsers.find(trialUser => trialUser.id === user.id);
      if (existingTrialUser) {
        const daysLeft = calculateTrialDays(existingTrialUser.startDate);
        if (daysLeft > 0) {
          setIsTrialActive(true);
          setWelcomeMessage(`Welcome ${user.first_name}! You have ${daysLeft} days of trial left.`);
        } else {
          setIsTrialActive(false);
        }
      } else if (!validUserIds.includes(user.id)) {
        startTrial(user.id, user.first_name);
      }
    }
  }, [trialUsers, validUserIds]);

  const calculateTrialDays = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    return 3 - Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const startTrial = (id: number, name: string) => {
    const newTrialUser: TrialUser = { id, name, startDate: new Date().toISOString() };
    const updatedTrialUsers = [...trialUsers, newTrialUser];
    setTrialUsers(updatedTrialUsers);
    localStorage.setItem('trialUsers', JSON.stringify(updatedTrialUsers));
    setIsTrialActive(true);
    setWelcomeMessage(`Welcome ${name}! You have 3 days of trial.`);
  };

  const handleAddUserId = () => {
    const newId = parseInt(newUserId);
    if (!isNaN(newId) && !validUserIds.includes(newId)) {
      const updatedValidIds = [...validUserIds, newId];
      setValidUserIds(updatedValidIds);
      localStorage.setItem('validUserIds', JSON.stringify(updatedValidIds));
      setNewUserId('');
    }
  };

  const handleRemoveUserId = (id: number) => {
    const updatedValidIds = validUserIds.filter((userId) => userId !== id);
    setValidUserIds(updatedValidIds);
    localStorage.setItem('validUserIds', JSON.stringify(updatedValidIds));
  };

  return (
    <main style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
      color: "white",
      overflowY: "auto",
      padding: "20px"
    }}>
      {userData && userData.id === adminId ? (
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <h2 style={{ textAlign: "center" }}>Admin Panel</h2>

          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Enter User ID"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                width: "70%",
                marginRight: "10px"
              }}
            />
            <button onClick={handleAddUserId} style={{
              padding: "10px", backgroundColor: "green", color: "white", borderRadius: "5px"
            }}>
              Add ID
            </button>
          </div>

          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <h3>Valid User IDs</h3>
            <ul>
              {validUserIds.map((id) => (
                <li key={id}>
                  {id}{' '}
                  <button onClick={() => handleRemoveUserId(id)} style={{
                    background: "red", color: "white", borderRadius: "5px", padding: "5px", marginLeft: "10px"
                  }}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ maxHeight: "200px", overflowY: "auto", marginTop: "20px" }}>
            <h3>New Trial Users</h3>
            <ul>
              {trialUsers.map((user) => {
                const daysLeft = calculateTrialDays(user.startDate);
                return (
                  <li key={user.id}>
                    {user.name} (ID: {user.id}) - {daysLeft > 0 ? `Trial active (${daysLeft} days left)` : 'Trial ended'}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <>
          {isTrialActive ? (
            <div style={{ textAlign: 'center' }}>
              <h2>{welcomeMessage}</h2>
              <p>You have full access for the trial period.</p>
            </div>
          ) : validUserIds.includes(userData?.id ?? 0) ? (
            <div style={{ textAlign: 'center' }}>
              <h2>Welcome back, {userData?.first_name}!</h2>
              <p>You have full access.</p>
            </div>
          ) : (
            <div style={{ color: 'red', textAlign: 'center' }}>
              <p>Your trial has ended. Please subscribe to continue using the service.</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
