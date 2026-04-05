import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const PostJob = () => {
  const { user, isRecruiter } = useAuth();
  const navigate              = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    skills: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!user || !isRecruiter) {
    navigate('/login');
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const skillsArray = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
      await api.post('/api/jobs', {
        ...form,
        salary: Number(form.salary),
        skills: skillsArray,
      });
      setMessage('Job posted successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>

      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem' }}>
        ← Back to Dashboard
      </button>

      <h2>Post a Job</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Frontend Developer"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Company</label>
          <input
            type="text"
            name="company"
            placeholder="e.g. Tech Corp"
            value={form.company}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Bangalore"
            value={form.location}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Salary (₹)</label>
          <input
            type="number"
            name="salary"
            placeholder="e.g. 800000"
            value={form.salary}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Required Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            placeholder="e.g. React, Node.js, MongoDB"
            value={form.skills}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Job Description</label>
          <textarea
            name="description"
            placeholder="Describe the role..."
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            style={{ width: '100%', padding: '0.5rem', marginTop: '4px' }}
          />
        </div>

        {message && (
          <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
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
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default PostJob;