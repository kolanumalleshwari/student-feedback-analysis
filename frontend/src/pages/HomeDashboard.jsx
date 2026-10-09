import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import SentimentBadge from '../components/SentimentBadge';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { 
  Users, Star, ThumbsUp, ThumbsDown, MessageSquare, ArrowRight, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DEMO_SUMMARY = {
  totalSubmissions: 8,
  avgOverallRating: 4.25,
  avgTeachingRating: 4.4,
  avgCourseContentRating: 4.1,
  avgCommunicationRating: 4.2,
  positiveCount: 5,
  neutralCount: 2,
  negativeCount: 1,
  ratingDistribution: [
    { star: '1 Star', ratingValue: 1, count: 1 },
    { star: '2 Stars', ratingValue: 2, count: 0 },
    { star: '3 Stars', ratingValue: 3, count: 2 },
    { star: '4 Stars', ratingValue: 4, count: 2 },
    { star: '5 Stars', ratingValue: 5, count: 3 }
  ],
  recentFeedback: [
    { id: 1, student_name: 'Alex Johnson', student_id: 'STU1001', department: 'Computer Science', subject: 'Data Structures & Algorithms', faculty_name: 'Dr. Alan Turing', overall_rating: 5, sentiment: 'Positive', created_at: new Date().toISOString() },
    { id: 2, student_name: 'Sophia Martinez', student_id: 'STU1002', department: 'Computer Science', subject: 'Web Development', faculty_name: 'Prof. Ada Lovelace', overall_rating: 5, sentiment: 'Positive', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, student_name: 'Ethan Brown', student_id: 'STU1003', department: 'Electrical Engineering', subject: 'Circuit Theory', faculty_name: 'Dr. Nikola Tesla', overall_rating: 2, sentiment: 'Negative', created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: 4, student_name: 'Emma Watson', student_id: 'STU1004', department: 'Mechanical Engineering', subject: 'Thermodynamics', faculty_name: 'Prof. James Watt', overall_rating: 3, sentiment: 'Neutral', created_at: new Date(Date.now() - 259200000).toISOString() },
    { id: 5, student_name: 'Ava Taylor', student_id: 'STU1007', department: 'Information Technology', subject: 'Cloud Computing', faculty_name: 'Dr. Werner Vogels', overall_rating: 5, sentiment: 'Positive', created_at: new Date(Date.now() - 345600000).toISOString() }
  ]
};

export default function HomeDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsDemoMode(false);
      const res = await api.get('/analytics/summary');
      if (res.data && res.data.success) {
        setSummary(res.data.data);
      } else {
        setSummary(DEMO_SUMMARY);
        setIsDemoMode(true);
      }
    } catch (err) {
      console.warn('Backend server unavailable, falling back to demo client data:', err.message);
      setSummary(DEMO_SUMMARY);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching dashboard analytics..." />;

  const sentimentData = [
    { name: 'Positive', value: summary?.positiveCount || 0, color: '#10B981' },
    { name: 'Neutral', value: summary?.neutralCount || 0, color: '#6B7280' },
    { name: 'Negative', value: summary?.negativeCount || 0, color: '#EF4444' }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Student Feedback Analysis System</h1>
        <p className="page-subtitle">Real-time college course, faculty, and facility feedback insights</p>
      </div>

      {isDemoMode && (
        <div className="alert" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', marginBottom: '20px' }}>
          <Info size={18} />
          <span>Showing live mobile preview data. To sync with your database, host the backend on Render.</span>
        </div>
      )}

      {/* Stats Overview Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Submissions</span>
            <span className="stat-value">{summary?.totalSubmissions || 0}</span>
            <span className="stat-sub">Student Responses</span>
          </div>
          <div className="stat-icon-wrapper blue">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Average Rating</span>
            <span className="stat-value">
              {summary?.avgOverallRating ? summary.avgOverallRating.toFixed(1) : '0.0'} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 5</span>
            </span>
            <div style={{ marginTop: '4px' }}>
              <StarRating rating={Math.round(summary?.avgOverallRating || 0)} readOnly size={14} />
            </div>
          </div>
          <div className="stat-icon-wrapper blue">
            <Star size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Positive Feedback</span>
            <span className="stat-value" style={{ color: '#059669' }}>{summary?.positiveCount || 0}</span>
            <span className="stat-sub">Satisfied Students</span>
          </div>
          <div className="stat-icon-wrapper emerald">
            <ThumbsUp size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Neutral / Negative</span>
            <span className="stat-value">
              {(summary?.neutralCount || 0) + (summary?.negativeCount || 0)}
            </span>
            <span className="stat-sub">{summary?.neutralCount || 0} Neutral • {summary?.negativeCount || 0} Negative</span>
          </div>
          <div className="stat-icon-wrapper rose">
            <ThumbsDown size={24} />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2">
        {/* Rating Breakdown Chart */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Rating Distribution</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1 to 5 Star Breakdown</span>
          </div>
          <div className="chart-box">
            {summary?.totalSubmissions > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary?.ratingDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="star" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <MessageSquare className="empty-icon" />
                <p className="empty-title">No rating data yet</p>
                <p className="empty-desc">Submit feedback to populate the rating distribution chart.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Distribution Chart */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Sentiment Distribution</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI Rule-Based Analysis</span>
          </div>
          <div className="chart-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {summary?.totalSubmissions > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <MessageSquare className="empty-icon" />
                <p className="empty-title">No sentiment data</p>
                <p className="empty-desc">Submit feedback to see positive, neutral, and negative metrics.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Feedback Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Feedback Submissions</h2>
          <Link to="/view" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            View All Feedback <ArrowRight size={14} />
          </Link>
        </div>

        {summary?.recentFeedback && summary.recentFeedback.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Department</th>
                  <th>Subject</th>
                  <th>Faculty</th>
                  <th>Rating</th>
                  <th>Sentiment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentFeedback.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.student_name}</td>
                    <td>{item.student_id}</td>
                    <td>{item.department}</td>
                    <td>{item.subject}</td>
                    <td>{item.faculty_name}</td>
                    <td>
                      <StarRating rating={item.overall_rating} readOnly size={14} />
                    </td>
                    <td>
                      <SentimentBadge sentiment={item.sentiment} />
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <MessageSquare className="empty-icon" />
            <p className="empty-title">No feedback records found</p>
            <p className="empty-desc">Click "Submit Feedback" in the navigation sidebar to add your first student record.</p>
          </div>
        )}
      </div>
    </div>
  );
}
