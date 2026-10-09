import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  CheckCircle2, AlertCircle, TrendingUp, BookOpen, Building2, HeartHandshake
} from 'lucide-react';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deptData, setDeptData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [sentimentData, setSentimentData] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [deptRes, subRes, sentRes] = await Promise.all([
        api.get('/analytics/departments'),
        api.get('/analytics/subjects'),
        api.get('/analytics/sentiment')
      ]);

      if (deptRes.data?.success && subRes.data?.success && sentRes.data?.success) {
        setDeptData(deptRes.data.data);
        setSubjectData(subRes.data.data);
        setSentimentData(sentRes.data.data);
      } else {
        setError('Failed to fetch full analytics metrics');
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Unable to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating college feedback analytics..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAnalytics} />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics & Intelligence</h1>
        <p className="page-subtitle">In-depth statistical insights into subjects, departments, and qualitative sentiment</p>
      </div>

      {/* Top Row: Average Rating by Subject */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <BookOpen size={20} color="var(--primary)" /> Average Rating by Subject
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comparison across academic courses</span>
        </div>
        <div className="chart-box" style={{ height: '360px' }}>
          {subjectData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                <XAxis 
                  dataKey="subject" 
                  angle={-15} 
                  textAnchor="end" 
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(val) => [`${val} / 5`, 'Avg Overall Rating']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="avgOverallRating" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                  {subjectData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.avgOverallRating >= 4 ? '#10B981' : entry.avgOverallRating >= 3 ? '#F59E0B' : '#EF4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <p className="empty-title">No subject data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Feedback Count by Department & Sentiment Breakdown */}
      <div className="grid-2">
        {/* Department Volume */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Building2 size={20} color="var(--primary)" /> Feedback Count by Department
            </h2>
          </div>
          <div className="chart-box">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="department" type="category" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="feedbackCount" fill="#2563EB" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p className="empty-title">No department data</p>
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Chart */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <TrendingUp size={20} color="var(--primary)" /> Overall Sentiment Ratio
            </h2>
          </div>
          <div className="chart-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {sentimentData?.totalSubmissions > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData?.chartData || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {sentimentData?.chartData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p className="empty-title">No sentiment records</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Qualitative Aspects: Most Appreciated vs Areas Needing Improvement */}
      <div className="grid-2">
        <div className="card" style={{ borderColor: '#a7f3d0', backgroundColor: '#f0fdf4' }}>
          <div className="card-header">
            <h2 className="card-title" style={{ color: '#065f46' }}>
              <HeartHandshake size={20} color="#10B981" /> Most Appreciated Aspects
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#047857', marginBottom: '16px' }}>
            Key highlights extracted from positive student comments & high rating trends:
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sentimentData?.appreciatedAspects?.map((aspect, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#064e3b' }}>
                <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{aspect}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ borderColor: '#fca5a5', backgroundColor: '#fff5f5' }}>
          <div className="card-header">
            <h2 className="card-title" style={{ color: '#991b1b' }}>
              <AlertCircle size={20} color="#EF4444" /> Areas Needing Improvement
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#b91c1c', marginBottom: '16px' }}>
            Focus areas identified from neutral/negative comments & lower rating spikes:
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sentimentData?.areasNeedingImprovement?.map((area, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#7f1d1d' }}>
                <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
