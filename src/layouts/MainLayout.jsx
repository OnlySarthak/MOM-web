import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopNav from './TopNav.jsx';

export default function MainLayout() {
  return (
    <div className="ts-shell">
      <Sidebar />
      <div className="ts-main">
        <TopNav />
        <main className="ts-content fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
