import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  CheckCircle2, AlertCircle, TrendingUp, BookOpen, Building2, HeartHandshake
} from 'lucide-react';

const DEMO_DEPT_DATA = [
  { department: 'Computer Science', feedbackCount: 4, avgRating: 4.5, positiveCount: 3, neutralCount: 0, negativeCount: 1 },
  { department: 'Information Technology', feedbackCount: 2, avgRating: 4.8, positiveCount: 2, neutralCount: 0, negativeCount: 0 },
  { department: 'Electrical Engineering', feedbackCount: 1, avgRating: 2.0, positiveCount: 0, neutralCount: 0, negativeCount: 1 },
  { department: 'Mechanical Engineering', feedbackCount: 1, avgRating: 3.0, positiveCount: 0, neutralCount: 1, negativeCount: 0 }
];

const DEMO_SUBJECT_DATA = [
  { subject: 'Cloud Computing', faculty_name: 'Dr. Werner Vogels', department: 'Information Technology', feedbackCount: 1, avgOverallRating: 5.0, avgTeachingRating: 5.0 },
  { subject: 'Data Structures', faculty_name: 'Dr. Alan Turing', department: 'Computer Science', feedbackCount: 1, avgOverallRating: 5.0, avgTeachingRating: 5.0 },
  { subject: 'Web Development', faculty_name: 'Prof. Ada Lovelace', department: 'Computer Science', feedbackCount: 1, avgOverallRating: 5.0, avgTeachingRating: 5.0 },
  { subject: 'Thermodynamics', faculty_name: 'Prof. James Watt', department: 'Mechanical Engineering', feedbackCount: 1, avgOverallRating: 3.0, avgTeachingRating: 3.0 },
  { subject: 'Circuit Theory', faculty_name: 'Dr. Nikola Tesla', department: 'Electrical Engineering', feedbackCount: 1, avgOverallRating: 2.0, avgTeachingRating: 2.0 }
];

const DEMO_SENTIMENT_DATA = {
  totalSubmissions: 8,
  chartData: [
    { name: 'Positive', count: 5, percentage: 62.5, color: '#10B981' },
    { name: 'Neutral', count: 2, percentage: 25.0, color: '#6B7280' },
    { name: 'Negative', count: 1, percentage: 12.5, color: '#EF4444' }
  ],
  appreciatedAspects: [
    'Interactive and clear teaching explanations',
    'Extensive hands-on practical lab sessions',
    'Supportive faculty members and mentorship',
    'Well-structured learning materials and presentations'
  ],
  areasNeedingImprovement: [
    'Pacing of introductory theory lectures',
    'Lab session time management and hardware access',
    'Clarity in assignment guidelines'
  ]
};

export default function Analytics() {
  const [loading, setLoading] = useState(true);

  const [deptData, setDeptData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [sentimentData, setSentimentData] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

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
        setDeptData(DEMO_DEPT_DATA);
        setSubjectData(DEMO_SUBJECT_DATA);
        setSentimentData(DEMO_SENTIMENT_DATA);
      }
    } catch (err) {
      setDeptData(DEMO_DEPT_DATA);
      setSubjectData(DEMO_SUBJECT_DATA);
      setSentimentData(DEMO_SENTIMENT_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating college feedback analytics..." />;

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
