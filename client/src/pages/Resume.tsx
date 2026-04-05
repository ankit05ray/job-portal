import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Resume = () => {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [resume, setResume]         = useState<any>(null);
  const [skills, setSkills]         = useState<string[]>([]);
  const [newSkill, setNewSkill]     = useState('');
  const [file, setFile]             = useState<File | null>(null);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [message, setMessage]       = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchResume();
  }, [user]);

  const fetchResume = async () => {
    try {
      const res = await api.get('/api/resumes/my');
      setResume(res.data.resume);
      setSkills(res.data.resume.skills || []);
    } catch (err) {
      // No resume yet — that's fine
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    try {
      setUploading(true);
      const res = await api.post('/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(res.data.resume);
      setMessage('Resume uploaded successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSaveSkills = async () => {
    try {
      setSaving(true);
      await api.put('/api/resumes/skills', { skills });
      setMessage('Skills saved successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to save skills');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>

      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem' }}>
        ← Back to Dashboard
      </button>

      <h2>My Resume</h2>

      {/* Upload Section */}
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>Resume File</h3>
        {resume?.fileName && (
          <p>Current file: <strong>{resume.fileName}</strong></p>
        )}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {/* Skills Section */}
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
        <h3>My Skills</h3>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          Add your skills to get a match score when you apply to jobs.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {skills.map((skill) => (
            <span
              key={skill}
              style={{
                background: '#e0f0ff',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {skill}
              <span
                onClick={() => handleRemoveSkill(skill)}
                style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
              >
                ×
              </span>
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Add a skill e.g. React"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            style={{ flex: 1, padding: '0.5rem' }}
          />
          <button onClick={handleAddSkill}>Add</button>
        </div>

        <button
          onClick={handleSaveSkills}
          disabled={saving}
          style={{
            padding: '0.5rem 1.5rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {saving ? 'Saving...' : 'Save Skills'}
        </button>
      </div>

      {message && (
        <p style={{ marginTop: '1rem', color: message.includes('successfully') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Resume;