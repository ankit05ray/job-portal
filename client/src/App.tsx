import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import PostJob from './pages/PostJob';
import Applicants from './pages/Applicants';

function App() {
  return (
    <Routes>
      <Route path="/"                    element={<Navigate to="/jobs" />} />
      <Route path="/login"               element={<Login />} />
      <Route path="/register"            element={<Register />} />
      <Route path="/jobs"                element={<Jobs />} />
      <Route path="/jobs/:id"            element={<JobDetail />} />
      <Route path="/dashboard"           element={<Dashboard />} />
      <Route path="/resume"              element={<Resume />} />
      <Route path="/post-job"            element={<PostJob />} />
      <Route path="/applicants/:jobId"   element={<Applicants />} />
    </Routes>
  );
}

export default App;