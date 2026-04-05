import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface Applicant {
  _id: string;
  status: string;
  matchScore: number;
  createdAt: string;
  userId: {
    name: string;
    email: string;
  };
  resumeId: {
    fileUrl: string;
    skills: string[];
  };
}

const statusColors: Record<string, string> = {
  applied:   '#0070f3',
  reviewing: '#f5a623',
  accepted:  '#27ae60',
  rejected:  '#e74c3c',
};

const Applicants = () => {
  const { jobId }          = useParams();
  const { user }           = useAuth();
  const navigate           = useNavigate();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading]       = useState(true);
  const [updating, setUpdating]     = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/api/applications/job/${jobId}`);
      setApplicants(res.data.applicants);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, status: string) => {
    try {
      setUpdating(applicationId);
      await api.patch(`/api/applications/${applicationId}/status`, { status });
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem' }}>
        ← Back to Dashboard
      </button>

      <h2>Applicants</h2>
      <p style={{ color: '#888' }}>Sorted by match score (highest first)</p>

      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        applicants.map((app) => (
          <div
            key={app._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            {/* Applicant Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 4px' }}>{app.userId?.name}</h4>
                <p style={{ margin: '0', color: '#888', fontSize: '0.9rem' }}>{app.userId?.email}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    background: '#e0f0ff',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  {app.matchScore}% match
                </div>
              </div>
            </div>

            {/* Skills */}
            {app.resumeId?.skills?.length > 0 && (
              <div style={{ margin: '1rem 0' }}>
                <strong style={{ fontSize: '0.85rem' }}>Skills:</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '4px' }}>
                  {app.resumeId.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        background: '#f0f0f0',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Status + Update */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
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

              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                disabled={updating === app._id}
                style={{ padding: '4px 8px', borderRadius: '4px' }}
              >
                <option value="applied">Applied</option>
                <option value="reviewing">Reviewing</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>

              {updating === app._id && (
                <span style={{ fontSize: '0.85rem', color: '#888' }}>Updating...</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Applicants;