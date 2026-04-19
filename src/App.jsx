import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import MainLayout from './layouts/MainLayout.jsx';

// Common pages
import LandingPage from './components/common/LandingPage.jsx';
import LoginPage from './components/common/LoginPage.jsx';
import RegisterPage from './components/common/RegisterPage.jsx';

// Admin pages
import AdminDashboard from './components/admin/Dashboard.jsx';
import AdminTeams from './components/admin/Teams.jsx';
import AdminTeamInfo from './components/admin/TeamInfo.jsx';
import AdminUsers from './components/admin/Users.jsx';
import AdminMeetings from './components/admin/Meetings.jsx';
import AdminMeetingDetail from './components/admin/MeetingDetail.jsx';
import AdminMomList from './components/admin/MomList.jsx';
import AdminMomDetail from './components/admin/MomDetail.jsx';
import AdminTasks from './components/admin/Tasks.jsx';
import AdminProfile from './components/admin/Profile.jsx';

// Leader pages
import LeaderDashboard from './components/leader/Dashboard.jsx';
import LeaderTeams from './components/leader/Teams.jsx';
import LeaderMeetings from './components/leader/Meetings.jsx';
import LeaderMeetingDetail from './components/leader/MeetingDetail.jsx';
import LeaderMomList from './components/leader/MomList.jsx';
import LeaderMomDetail from './components/leader/MomDetail.jsx';
import LeaderTasks from './components/leader/Tasks.jsx';
import LeaderProfile from './components/leader/Profile.jsx';

// Member pages
import MemberDashboard from './components/member/Dashboard.jsx';
import MemberMeetings from './components/member/Meetings.jsx';
import MemberMeetingDetail from './components/member/MeetingDetail.jsx';
import MemberMomList from './components/member/MomList.jsx';
import MemberMomDetail from './components/member/MomDetail.jsx';
import MemberTasks from './components/member/Tasks.jsx';
import MemberProfile from './components/member/Profile.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="teams" element={<AdminTeams />} />
              <Route path="team-info" element={<AdminTeamInfo />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="meetings" element={<AdminMeetings />} />
              <Route path="meeting-detail" element={<AdminMeetingDetail />} />
              <Route path="mom-list" element={<AdminMomList />} />
              <Route path="mom-detail" element={<AdminMomDetail />} />
              <Route path="tasks" element={<AdminTasks />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
          </Route>

          {/* Leader routes */}
          <Route element={<ProtectedRoute allowedRole="leader" />}>
            <Route path="/leader" element={<MainLayout />}>
              <Route index element={<Navigate to="/leader/dashboard" replace />} />
              <Route path="dashboard" element={<LeaderDashboard />} />
              <Route path="teams" element={<LeaderTeams />} />
              <Route path="meetings" element={<LeaderMeetings />} />
              <Route path="meeting-detail" element={<LeaderMeetingDetail />} />
              <Route path="mom-list" element={<LeaderMomList />} />
              <Route path="mom-detail" element={<LeaderMomDetail />} />
              <Route path="tasks" element={<LeaderTasks />} />
              <Route path="profile" element={<LeaderProfile />} />
            </Route>
          </Route>

          {/* Member routes */}
          <Route element={<ProtectedRoute allowedRole="member" />}>
            <Route path="/member" element={<MainLayout />}>
              <Route index element={<Navigate to="/member/dashboard" replace />} />
              <Route path="dashboard" element={<MemberDashboard />} />
              <Route path="meetings" element={<MemberMeetings />} />
              <Route path="meeting-detail" element={<MemberMeetingDetail />} />
              <Route path="mom-list" element={<MemberMomList />} />
              <Route path="mom-detail" element={<MemberMomDetail />} />
              <Route path="tasks" element={<MemberTasks />} />
              <Route path="profile" element={<MemberProfile />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
