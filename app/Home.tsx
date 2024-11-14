'use client'

import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
  const adminId = 5459502292;
  const router = useRouter();

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      const user = WebApp.initDataUnsafe.user as UserData;
      setUserData(user);

      // Load trial users from local storage
      const storedTrialUsers = localStorage.getItem('trialUsers');
      const trialList: TrialUser[] = storedTrialUsers ? JSON.parse(storedTrialUsers) : [];

      // Check if the user is in trial
      const existingTrialUser = trialList.find(trialUser => trialUser.id === user.id);
      if (existingTrialUser) {
        const startDate = new Date(existingTrialUser.startDate);
        const currentDate = new Date();
        const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceStart <= 3) {
          setIsTrialActive(true);
          setWelcomeMessage(`Welcome ${user.first_name}! You have ${3 - daysSinceStart} days of trial left.`);
        } else {
          setIsTrialActive(false);
        }
      } else {
        // If the user is new, add to trial list
        const newTrialUser: TrialUser = { id: user.id, name: user.first_name, startDate: new Date().toISOString() };
        trialList.push(newTrialUser);
        localStorage.setItem('trialUsers', JSON.stringify(trialList));
        setTrialUsers(trialList);
        setIsTrialActive(true);
        setWelcomeMessage(`Welcome ${user.first_name}! You have 3 days of trial.`);
      }
    }
  }, []);

  return (
    <main style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black"
    }}>
      {userData && userData.id === adminId ? (
        <>
          <button onClick={() => router.push('/admin')} style={{
            position: 'absolute', top: '20px', right: '20px', padding: '10px', background: 'blue', color: 'white', borderRadius: '5px'
          }}>
            Go to Admin Page
          </button>
        </>
      ) : (
        <>
          {isTrialActive ? (
            <div style={{ color: 'white', textAlign: 'center' }}>
              <h2>{welcomeMessage}</h2>
              <p>You have full access for the trial period.</p>
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
