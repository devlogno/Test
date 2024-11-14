import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface TrialUser {
  id: number;
  name: string;
  startDate: string;
}

export default function AdminPage() {
  const [trialUsers, setTrialUsers] = useState<TrialUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedTrialUsers = localStorage.getItem('trialUsers');
    if (storedTrialUsers) {
      setTrialUsers(JSON.parse(storedTrialUsers));
    }
  }, []);

  return (
    <main style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: 'black', color: 'white', minHeight: '100vh'
    }}>
      <h2>Admin - New Users with Trial</h2>
      <button onClick={() => router.push('/')} style={{ marginBottom: '20px' }}>Go Back</button>

      <div style={{ maxHeight: '300px', overflowY: 'auto', width: '80%' }}>
        <h3>Trial Users</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {trialUsers.map((user) => {
            const startDate = new Date(user.startDate);
            const daysSinceStart = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const daysLeft = 3 - daysSinceStart;
            return (
              <li key={user.id} style={{ marginBottom: '10px' }}>
                {user.name} (ID: {user.id}) - {daysLeft > 0 ? `Trial active (${daysLeft} days left)` : 'Trial ended'}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
