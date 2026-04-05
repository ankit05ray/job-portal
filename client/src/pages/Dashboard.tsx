import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface Application {
  _id: string;
  status: string;
  matchScore: number;
  createdAt: string;
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  createdAt: string;
}

const statusColors: Record<string, string> = {
  applied:   '#0070f3',
  reviewing: '#f5a623',
  accepted:  '#27ae60',
  rejected:  '#e74c3c',
};

const Dashboard = () => {
  const { user, logout, isRecruiter } = useAuth();
  const navigate                      = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs]                 = useState<Job[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (isRecruiter) {
        const res = await api.get('/api/jobs');
        const myJobs = res.data.jobs.filter(
          (job: any) => job.postedBy._id === user!.id || job.postedBy === user!.id
        );
        setJobs(myJobs);
      } else {
        const res = await api.get('/api/applications/my');
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/jobs')}>Browse Jobs</button>
          {!isRecruiter && <button onClick={() => navigate('/resume')}>My Resume</button>}
          {isRecruiter  && <button onClick={() => navigate('/post-job')}>Post a Job</button>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <p>Welcome, <strong>{user?.name}</strong> ({user?.role})</p>

      {loading ? (
        <p>Loading...</p>
      ) : isRecruiter ? (
        <>
          <h3>Your Posted Jobs</h3>
          {jobs.length === 0 ? (
            <p>You haven't posted any jobs yet. <span style={{ color: '#0070f3', cursor: 'pointer' }} onClick={() => navigate('/post-job')}>Post one now</span></p>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}
              >
                <h4>{job.title}</h4>
                <p>{job.company} — {job.location}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {job.skills.map((skill) => (
                    <span key={skill} style={{ background: '#e0f0ff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
                <button onClick={() => navigate(`/applicants/${job._id}`)}>
                  View Applicants
                </button>
              </div>
            ))
          )}
        </>
      ) : (
        <>
          <h3>Your Applications</h3>
          {applications.length === 0 ? (
            <p>You haven't applied to any jobs yet. <span style={{ color: '#0070f3', cursor: 'pointer' }} onClick={() => navigate('/jobs')}>Browse jobs</span></p>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}
              >
                <h4>{app.jobId?.title}</h4>
                <p>{app.jobId?.company} — {app.jobId?.location}</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span
                    style={{
                      background: statusColors[app.status],
                      color: 'white',
                      padding: '2px 10px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                    }}
                  >
                    {app.status}
                  </span>
                  <span style={{ color: '#888', fontSize: '0.85rem' }}>
                    Match Score: {app.matchScore}%
                  </span>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;