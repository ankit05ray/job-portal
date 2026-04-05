import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  skills: string[];
  createdAt: string;
}

const Jobs = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const [jobs, setJobs]         = useState<Job[]>([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/jobs?search=${search}`);
      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      
      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Job Portal</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <span>Hi, {user.name}</span>
              <button onClick={() => navigate('/dashboard')}>Dashboard</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/register')}>Register</button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button type="submit">Search</button>
      </form>

      {/* Job Cards */}
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/jobs/${job._id}`)}
          >
            <h3>{job.title}</h3>
            <p>{job.company} — {job.location}</p>
            <p>Salary: ₹{job.salary?.toLocaleString()}</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: '#e0f0ff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Jobs;''