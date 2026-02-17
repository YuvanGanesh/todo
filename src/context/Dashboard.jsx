import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee' }}>
        <h3>Task Manager</h3>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <div style={{ padding: '2rem' }}>
        <h1>Welcome, {currentUser.email}</h1>
      </div>
    </div>
  );
}