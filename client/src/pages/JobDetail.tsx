import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  skills: string[];
  description: string;
  postedBy: { name: string; email: string };
}

const JobDetail = () => {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();

  const [job, setJob]         = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setApplying(true);
      const res = await api.post(`/api/applications/${id}`);
      setMessage(`Applied successfully! Match score: ${res.data.matchScore}%`);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (!job)    return <p style={{ padding: '2rem' }}>Job not found.</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      
      <button onClick={() => navigate('/jobs')} style={{ marginBottom: '1rem' }}>
        ← Back to Jobs
      </button>

      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> ₹{job.salary?.toLocaleString()}</p>

      <div style={{ margin: '1rem 0' }}>
        <strong>Required Skills:</strong>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
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

      <div style={{ margin: '1rem 0' }}>
        <strong>Description:</strong>
        <p>{job.description}</p>
      </div>

      <p style={{ color: '#888' }}>Posted by: {job.postedBy?.name}</p>

      {message && (
        <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>
          {message}
        </p>
      )}

      {user?.role === 'jobseeker' && (
        <button
          onClick={handleApply}
          disabled={applying}
          style={{
            padding: '0.75rem 2rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {applying ? 'Applying...' : 'Apply Now'}
        </button>
      )}

      {!user && (
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '0.75rem 2rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Login to Apply
        </button>
      )}
    </div>
  );
};

export default JobDetail;