/**
 * TeamSync Shared Components
 * Injects Tailwind config, sidebar, and topnav into each page.
 */

// ─── Tailwind Config (Single Source of Truth) ───────────────────────────────
(function() {
  const script = document.createElement('script');
  script.textContent = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "surface-container-highest": "#e3e2df",
            "secondary-fixed": "#dce1ff",
            "secondary": "#4d5b94",
            "on-secondary-fixed-variant": "#35437b",
            "surface-dim": "#dbdad7",
            "on-background": "#1b1c1a",
            "tertiary-container": "#a73400",
            "primary-fixed-dim": "#b7c4ff",
            "surface-container-lowest": "#ffffff",
            "surface-bright": "#faf9f6",
            "on-tertiary-container": "#ffc9b7",
            "secondary-container": "#b0befe",
            "outline-variant": "#c4c5d7",
            "tertiary-fixed": "#ffdbcf",
            "surface-container-low": "#f4f3f0",
            "primary-container": "#1d4ed8",
            "inverse-primary": "#b7c4ff",
            "secondary-fixed-dim": "#b7c4ff",
            "on-tertiary-fixed-variant": "#832700",
            "on-tertiary": "#ffffff",
            "primary": "#0037b0",
            "surface-variant": "#e3e2df",
            "inverse-on-surface": "#f2f1ee",
            "outline": "#747686",
            "on-surface-variant": "#434655",
            "on-primary": "#ffffff",
            "tertiary-fixed-dim": "#ffb59c",
            "background": "#faf9f6",
            "surface": "#faf9f6",
            "on-secondary": "#ffffff",
            "on-primary-container": "#cad3ff",
            "on-primary-fixed": "#001551",
            "error-container": "#ffdad6",
            "surface-container-high": "#e9e8e5",
            "on-secondary-container": "#3d4c83",
            "on-secondary-fixed": "#03164d",
            "on-surface": "#1b1c1a",
            "surface-container": "#efeeeb",
            "on-error": "#ffffff",
            "primary-fixed": "#dce1ff",
            "surface-tint": "#2151da",
            "on-primary-fixed-variant": "#0039b5",
            "error": "#ba1a1a",
            "inverse-surface": "#2f312f",
            "tertiary": "#7f2500",
            "on-tertiary-fixed": "#390c00",
            "on-error-container": "#93000a"
          },
          fontFamily: {
            "headline": ["Newsreader", "serif"],
            "body": ["Inter", "sans-serif"],
            "label": ["Inter", "sans-serif"],
            "mono": ["JetBrains Mono", "monospace"]
          },
          borderRadius: { "DEFAULT": "0.5rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }
        }
      }
    }
  `;
  // Insert right after tailwind CDN loads
  document.head.appendChild(script);
})();


// ─── Nav Config per Role ─────────────────────────────────────────────────────
const NAV_ITEMS = {
  admin: [
    { icon: 'dashboard', label: 'Dashboard', href: 'app/dashboard-admin.html', key: 'dashboard' },
    { icon: 'calendar_today', label: 'Meetings', href: 'app/meetings.html', key: 'meetings' },
    { icon: 'description', label: 'MOMs', href: 'app/mom-list.html', key: 'moms' },
    { icon: 'assignment', label: 'Tasks', href: 'app/tasks.html', key: 'tasks' },
    { icon: 'group', label: 'Users', href: 'app/users.html', key: 'users' },
    { icon: 'hub', label: 'Teams', href: 'app/teams.html', key: 'teams' },
    { icon: 'person', label: 'Profile', href: 'app/profile.html', key: 'profile' },
  ],
  leader: [
    { icon: 'dashboard', label: 'Dashboard', href: 'app/dashboard-leader.html', key: 'dashboard' },
    { icon: 'calendar_today', label: 'Meetings', href: 'app/meetings.html', key: 'meetings' },
    { icon: 'description', label: 'MOMs', href: 'app/mom-list.html', key: 'moms' },
    { icon: 'assignment', label: 'Tasks', href: 'app/tasks.html', key: 'tasks' },
    { icon: 'hub', label: 'Teams', href: 'app/teams.html', key: 'teams' },
    { icon: 'person', label: 'Profile', href: 'app/profile.html', key: 'profile' },
  ],
  member: [
    { icon: 'dashboard', label: 'Dashboard', href: 'app/dashboard-member.html', key: 'dashboard' },
    { icon: 'calendar_today', label: 'Meetings', href: 'app/meetings.html', key: 'meetings' },
    { icon: 'description', label: 'MOMs', href: 'app/mom-list.html', key: 'moms' },
    { icon: 'assignment', label: 'Tasks', href: 'app/tasks.html', key: 'tasks' },
    { icon: 'person', label: 'Profile', href: 'app/profile.html', key: 'profile' },
  ]
};

/**
 * Render the sidebar into #ts-sidebar.
 */
function renderSidebar(user, activeKey) {
  const el = document.getElementById('ts-sidebar');
  if (!el) return;
  const items = NAV_ITEMS[user.role] || NAV_ITEMS.member;
  const isInApp = window.location.pathname.includes('/app/');
  const prefix = isInApp ? '../' : '';
  const roleLabel = user.role === 'admin' ? 'Administrator' : user.role === 'leader' ? 'Team Leader' : 'Member';

  const links = items.map(item => {
    const href = prefix + item.href;
    const isActive = item.key === activeKey;
    const base = 'flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200';
    const cls = isActive
      ? `${base} text-white border-l-2 border-[#dce1ff] bg-white/5 font-medium`
      : `${base} text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg`;
    return `<a class="${cls}" href="${href}">
      <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
      <span>${item.label}</span>
    </a>`;
  }).join('\n');

  el.innerHTML = `
    <div class="px-6 mb-10">
      <h1 class="font-headline text-xl italic text-white">TeamSync</h1>
      <p class="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">${roleLabel}</p>
    </div>
    <nav class="flex-1 space-y-1 px-2">
      ${links}
    </nav>
    <div class="mt-auto px-4 pt-6 border-t border-white/5 space-y-1">
      <div class="flex items-center gap-3 px-2 py-3 mb-2">
        <img src="${user.avatar}" class="w-8 h-8 rounded-full object-cover" alt="${user.name}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1d4ed8&color=fff'" />
        <div class="overflow-hidden">
          <p class="text-xs font-semibold text-white truncate">${user.name}</p>
          <p class="text-[10px] text-zinc-500 truncate">${user.title}</p>
        </div>
      </div>
      <a class="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 rounded-lg" href="${prefix}app/profile.html">
        <span class="material-symbols-outlined text-[18px]">manage_accounts</span>
        <span class="text-xs font-medium">My Account</span>
      </a>
      <button onclick="logout()" class="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 rounded-lg">
        <span class="material-symbols-outlined text-[18px]">logout</span>
        <span class="text-xs font-medium">Logout</span>
      </button>
    </div>
  `;
}

/**
 * Render the top navigation bar into #ts-topnav.
 */
function renderTopNav(pageTitle, user, extraContent) {
  const el = document.getElementById('ts-topnav');
  if (!el) return;
  const isInApp = window.location.pathname.includes('/app/');
  const prefix = isInApp ? '../' : '';

  el.innerHTML = `
    <div class="flex items-center gap-4">
      <h2 class="font-headline text-2xl font-medium text-on-surface tracking-tight">${pageTitle}</h2>
      ${extraContent || ''}
    </div>
    <div class="flex items-center gap-4">
      <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
        <span class="material-symbols-outlined">search</span>
      </button>
      <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
        <span class="material-symbols-outlined">notifications</span>
      </button>
      <div class="h-6 w-px bg-outline-variant/30 mx-1"></div>
      <a href="${prefix}app/profile.html" class="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors">
        <img src="${user.avatar}" class="w-8 h-8 rounded-full object-cover" alt="${user.name}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1d4ed8&color=fff'" />
        <span class="text-sm font-medium text-on-surface hidden md:block">${user.name}</span>
      </a>
    </div>
  `;
}
