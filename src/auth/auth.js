/**
 * TeamSync Auth Module
 * Wired to real backend API. Falls back to demo-mode localStorage for dev.
 */

const API_BASE = 'http://localhost:5000/api';

/**
 * Attempt login via real backend. Returns {success, user, error}.
 * Backend: POST /api/auth/login → { user: { name, email, systemRole, workspaceId } }
 * Role field: backend uses `systemRole` (admin / leader / member)
 */
export async function loginApi(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || 'Login failed.' };
    }
    // Backend returns systemRole — map to role for frontend consistency
    const user = {
      name: data.user.name,
      email: data.user.email,
      role: data.user.systemRole, // admin | leader | member
      workspaceId: data.user.workspaceId,
      title: data.user.title || '',
    };
    // Cache session in localStorage for AuthContext
    localStorage.setItem('teamsync_session', JSON.stringify(user));
    return { success: true, user };
  } catch (err) {
    return { success: false, error: 'Network error. Is the server running?' };
  }
}

/**
 * Register a new workspace (admin). 
 * Backend: POST /api/auth/register → workspace + admin user created
 */
export async function registerApi(name, email, workspaceName, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, workspaceName, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || 'Registration failed.' };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Network error. Is the server running?' };
  }
}

/**
 * Logout via real backend.
 */
export async function logoutApi() {
  try {
    await fetch(`${API_BASE}/auth/logout`, { credentials: 'include' });
  } catch { /* ignore */ }
  localStorage.removeItem('teamsync_session');
}

/**
 * Get the current session user from localStorage cache.
 */
export function getUser() {
  try {
    const raw = localStorage.getItem('teamsync_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Legacy sync login — kept for AuthContext compatibility.
 * Only used as fallback if API call is in progress.
 */
export function login(email, password) {
  // This sync version is only used internally by AuthContext.
  // Actual login goes through loginApi().
  return { success: false, error: 'Use loginApi() for real auth.' };
}

export function logout() {
  localStorage.removeItem('teamsync_session');
}

/**
 * Return dashboard path per role.
 */
export function dashboardForRole(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'leader') return '/leader/dashboard';
  return '/member/dashboard';
}
