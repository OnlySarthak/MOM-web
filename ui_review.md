# TeamSync — UI & Code Review

> Full review of all 13 pages: `index.html`, `login.html`, and 11 app pages.

---

## 1. Color System Inconsistencies

### Hardcoded colors that bypass the design token system

| Colour | Raw value | Where used | Should be |
|---|---|---|---|
| Dark accent | `#2f312f` | Sidebar panel, team card Δ, user avatars | Token: `inverse-surface` |
| Burnt orange | `#7f2500` | Team card Γ, avatar bubbles, MOM category label | No token defined — arbitrary |
| Blue 50 | `bg-blue-50/40` | Meetings insight card | Should use `bg-primary/5` or `bg-primary-fixed/30` |
| `bg-blue-500/10` | Login panel background blob | Should use `bg-primary/10` |
| `text-zinc-400`, `text-zinc-300`, `text-zinc-500` | Login left panel | Should use `text-on-surface-variant` or Tailwind white alpha |

The `#7f2500` and `#2f312f` colours appear **24 times across 9 files** with no named token, making them impossible to retheme.

---

## 2. Typography Inconsistencies

### Page hero subtitles — two different font/style patterns
- **Admin, Users, Teams, Tasks, Meetings, MOM List**: `font-headline italic text-xl text-outline` ✅ consistent
- **Member dashboard**: `font-headline italic text-xl text-outline` ✅ same — correct
- **Leader dashboard**: Same — correct
- **Meeting detail**: No italic subtitle below `<h1>`, jumps straight to mono metadata — **missing the pattern**

### Stat card number sizes
- Admin dashboard, Users: `text-4xl font-bold` (Newsreader)
- Member dashboard: `text-3xl font-bold` — **one size smaller for no reason**
- Tasks page: `text-2xl font-bold` (Inter, not Newsreader!) — **wrong font family entirely**

### Role labels capitalization
- `users.html`: Elena Vance listed as "**Team Lead**"
- `dashboard-admin.html` table: Elena Vance listed as "**Team Leader**"  
- `index.html` roles section: "**Team Leader**" ✅
- Should be consistent everywhere — pick one.

---

## 3. Badge Usage Inconsistencies

### Status badge for "Active" users
- `dashboard-admin.html`: Uses `badge-scheduled` (the blue "Scheduled" badge) + pulsing dot for Active users
- `users.html`: Same pattern — using `badge-scheduled` semantically as "Active"
- **Problem**: A badge named `badge-scheduled` (for meeting state) is being repurposed for user status. These should be separate tokens/classes.

### "Deactivated" user badge
- Uses `badge-completed` (the green task-done badge) for deactivated users — **wrong semantic colour**. A deactivated user should use a neutral or error-tinted badge, not the "success" colour.

### Priority badge casing
- `dashboard-leader.html` tasks table: `HIGH`, `MEDIUM`, `LOW` (all caps) 
- `tasks.html`: `Critical` (Title case), `Medium` (Title case), `High` (Title case), `Low` (Title case)
- `meeting-detail.html`: `CRITICAL`, `MEDIUM` (all caps again)
- **Three different casing conventions across three pages for the same badges.**

### "In Progress" status — two different visual treatments
- `dashboard-leader.html`: Plain text `In Progress`
- `tasks.html`: Pulsing `animate-ping` dot + "In Progress" text
- `meeting-detail.html` Tasks tab: Plain "In Progress" text (no dot)
- Should be one standard component.

---

## 4. Avatar/User Bubble Inconsistencies

### Avatar sizes in stacked groups
- `index.html` bento: `w-7 h-7`
- `meetings.html` table: `w-7 h-7` ✅
- `dashboard-leader.html` meeting row: `w-7 h-7` ✅
- `teams.html` member stacks: `w-8 h-8` — **one size up**
- `mom-list.html` card footers: `w-7 h-7` ✅
- `dashboard-member.html` MOMs: `w-6 h-6` — **even smaller**
- Result: 3 different sizes for the same "avatar stack" component.

### Avatar background colours
The burnt-orange `#7f2500` is used as an avatar background colour on some users (e.g. JD in meetings, MV in tasks) but not others. There is no consistent colour-per-person mapping — the same person "JD" appears with different backgrounds in different pages:
- `tasks.html`: JD → `bg-primary` (blue)
- `dashboard-leader.html` tasks table: JD → `bg-primary` (blue)  
- `meetings.html`: JD → `bg-surface-container-high` (grey)

---

## 5. Unnecessary / Redundant UI Components

### `meetings.html` — "Insight cards" at the bottom
Three cards below the meetings table: **Meeting Pulse**, **Summary Recap**, **Schedule Assistant**. These are completely non-functional placeholder tiles. "Meeting Pulse" and "Schedule Assistant" have no destination link and no real utility. **Remove or replace with something functional.**

### `mom-list.html` — Duplicate "Add" entry points
There's both:
1. A **Floating Action Button (FAB)** in the bottom-right corner (`+`)
2. A **"Sync a New Moment" dashed placeholder card** in the grid itself

Two separate create-new entry points on the same screen for the same action is redundant. The FAB alone is sufficient.

### `dashboard-leader.html` — "Team Progress" pill in the header
The header contains an inline `ts-card` with a progress bar and "% Schedule Meeting" button. This is a lot of visual weight for a secondary element. The same data (team progress %) is duplicated in the "Progress Metrics" tab. One of these should be removed.

### `meetings.html` — "Schedule Meeting" button has an empty `onclick=""`
The primary action button on the meetings page does nothing:
```html
<button class="btn-primary gap-2 text-sm" onclick="">Schedule Meeting</button>
```
**Either wire it up or remove it.** It's the main CTA on the page.

### `profile.html` — "Share Profile" button
A "Share Profile" button exists in the profile header. There is no sharing functionality anywhere in the app. **Remove.**

### `dashboard-admin.html` — Quick Admin Links duplicate sidebar navigation
The 2×2 grid of quick-links (User Management, Teams, Meetings, Tasks) replicates exactly what's already in the sidebar. Since the sidebar is always visible on desktop, these cards add zero navigational value and take up significant space on the dashboard. **Consider replacing with genuinely admin-specific shortcuts** (e.g. "Users pending activation", "Teams with no leader").

---

## 6. Tailwind Config — Duplicated in `index.html` and `login.html`

`index.html` and `login.html` both declare a full inline `tailwind.config` block with identical color tokens. The app pages (inside `/app/`) rely on `teamsync.css` instead. This means:
- Two separate sources of truth for color tokens
- The landing page/login page can drift from the app pages visually
- `index.html` is missing `error`, `error-container`, `on-error-container` colors that exist in login.html

**These configs should be in a shared JS file rather than duplicated inline.**

---

## 7. Page-Level Header Pattern Inconsistencies

| Page | Has `<h1>` | Has italic subtitle | Has Header action button |
|---|---|---|---|
| dashboard-admin | ✅ | ✅ | ❌ |
| dashboard-leader | ✅ | ✅ | ✅ ("+ Schedule Meeting" in pill) |
| dashboard-member | ✅ | ✅ | ❌ |
| users | ✅ | ✅ | ✅ (Import CSV, Invite User) |
| teams | ✅ | ✅ | ✅ (Create Team) |
| meetings | ❌ **No `<h1>` at all** — page starts with filter bar | — | ✅ |
| tasks | ✅ | ✅ | ✅ (New Task) |
| mom-list | ✅ | ✅ | ❌ (button is injected into topnav instead) |
| meeting-detail | ✅ | ❌ (jumps to mono metadata) | ✅ (Upload MOM) |
| profile | ✅ | ❌ | ✅ (Share, Save) |

> [!WARNING]
> `meetings.html` has **no page heading** — it jumps straight into the filter bar. This is the only page that breaks the established pattern. A `<h1>Meetings</h1>` with subtitle should be added above the filter bar.

---

## 8. Navigation & Auth Inconsistencies

### `teams.html` is admin-only but sidebar shows it for all roles
- `teams.html`: `requireAuth(['admin'])` — only admins can access
- However, the sidebar (rendered by `components.js`) appears to always show a "Teams" nav item. Members and leaders who click it will get redirected back to login. The nav item should be hidden for non-admin roles.

### `meeting-detail.html` and `mom-detail.html` are accessible by all roles
This is fine, but they have no "back" link from `mom-detail.html` — the user has no way to navigate back to the MOM list without using the browser back button.

---

## 9. Minor Inconsistencies

| Issue | Location |
|---|---|
| Footer copyright says `© 2024` | `index.html` — should be current or dynamic year |
| Meetings table dates are all in Oct 2023 (3 years stale) | `meetings.html` |
| MOM card dates are all Oct 2023 | `mom-list.html`, `dashboard-member.html` |
| "Virtual Atelier" hardcoded as meeting location everywhere | `meeting-detail.html`, `dashboard-member.html` |
| Tasks table in `meeting-detail.html` says status "Pending" | Inconsistent — the rest of the app uses "To Do" not "Pending" |
| `dashboard-member.html` MOM "View All" card uses a `+` icon and says "Add" visually | It actually navigates to the MOM list, not creates one — misleading icon |
| `meetings.html` pagination says "1 to 4 of 24" but filter chips aren't wired to update this | Static copy |
| `tasks.html` pagination says "Showing 5 of 28 tasks" but filter chips can hide rows — count never updates | Static copy |
