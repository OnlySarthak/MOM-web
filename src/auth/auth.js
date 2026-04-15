/**
 * TeamSync Auth Module
 * Mock authentication using localStorage — demo only.
 */

export const DEMO_USERS = [
  {
    email: 'admin@teamsync.app',
    password: 'admin123',
    name: 'Julian Thorne',
    role: 'admin',
    title: 'System Administrator',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0m2UdKSN5hIlGNpSPXhq6mlPYuWUPIVZHOpiTXdN1f-xSwM5mus5R2pYzhFw17yOMa08CDnLsF4wc5b2YYDo0eWLS-5umjUWdJ_2sdcEolA30MaBhPgIomEx-jEIqtvN6XAPJ7QXiEWSDOMHKF9jUeFpV4c83KcEoiYbEIgLozV6OnpUOZawPd_lz_wwQsPSi2NVZ0gHgnIdhCdLEzsVAli_m6osD9YbeADRQc8oVrJ2zkfuK4lwemp8bVk1yWWAVQZyKzUTjkQw'
  },
  {
    email: 'leader@teamsync.app',
    password: 'leader123',
    name: 'Elena Vance',
    role: 'leader',
    title: 'Team Leader',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0ZdqahlmziGZY2vIHTJCLDg_UX3EuZMiAEQxhuDtEwMuD_EUIQb3ONrP75kkKNC97hJ9255u7GUoX6rWKBZxIOg4TxTegp4zCOL3XNbJ0pynD0JVyojVX9LeI5_YPPSuOXVosqV_i3EtAK2pcFfu6KfksC1nw9lrHb0MqSC4N8sh7GAnrdjbFGH2KcbLjG5NyHHkLngq7BfZSwlcfQoWyWcwLPUD-xOfqUSwNGUwqIcc0wIcouLP-04LLR0ZbIof-ZwGmKmwVgIo'
  },
  {
    email: 'member@teamsync.app',
    password: 'member123',
    name: 'Marcus Chen',
    role: 'member',
    title: 'Product Manager',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB84s6oilar736DoSmdevvHUct5DL6XThWUSidfYo_oqw1LKFbBrPXDVOMvh_oeKFp4vPRPw39jmwWvMtnh7c9phq9x8a3qXmoDM3o7BJ7mDWhEvbdSbxXGHEl6RzKmjp0v3Rjo1_3ePHKxSeTFKahq_nl1NDyFvPKzk641KJWLwhirZtg35yh419uz9-dldvO5t8DYAo9bpkrxYSGeXpTAeIq0SIF7Fmf1U5UxkrrqqADgmCPIVTtAU8vL__Rj73dmfT7jiLuTPZQ'
  }
];

const STORAGE_KEY = 'teamsync_session';

/**
 * Attempt login. Returns {success, user, error}.
 */
export function login(email, password) {
  const user = DEMO_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    return { success: false, error: 'Invalid email or password.' };
  }
  const session = { email: user.email, name: user.name, role: user.role, title: user.title, avatar: user.avatar };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

/**
 * Get the current logged-in user or null.
 */
export function getUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Log out — clears session from localStorage.
 */
export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Return dashboard path per role.
 */
export function dashboardForRole(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'leader') return '/leader/dashboard';
  return '/member/dashboard';
}
