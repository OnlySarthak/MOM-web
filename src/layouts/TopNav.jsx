import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Avatar from 'react-avatar';

export default function TopNav({ pageTitle, extraContent }) {
  const { user } = useAuth();
  const rolePrefix = `/${user.role}`;

  return (
    <header id="ts-topnav">
      <div className="flex items-center gap-4">
        <h2 className="font-headline text-2xl font-medium text-on-surface tracking-tight">{pageTitle}</h2>
        {extraContent || null}
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="h-6 w-px bg-outline-variant/30 mx-1"></div>
        <Link to={`${rolePrefix}/profile`} className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors">
          <Avatar name={user.name} size="32" round={true} />
          <span className="text-sm font-medium text-on-surface hidden md:block">{user.name}</span>
        </Link>
      </div>
    </header>
  );
}
