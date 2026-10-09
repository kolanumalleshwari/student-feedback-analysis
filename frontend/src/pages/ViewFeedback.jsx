import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import SentimentBadge from '../components/SentimentBadge';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, Filter, RefreshCw, X, MessageSquare 
} from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Information Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics & Communication',
  'Chemical Engineering',
  'Biotechnology',
  'Business Administration'
];

const YEARS = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year', 'Post Graduate'];
const SENTIMENTS = ['All', 'Positive', 'Neutral', 'Negative'];

const DEMO_FEEDBACK_LIST = [
  { id: 1, student_name: 'Alex Johnson', student_id: 'STU1001', department: 'Computer Science', year_of_study: '3rd Year', subject: 'Data Structures & Algorithms', faculty_name: 'Dr. Alan Turing', teaching_rating: 5, course_content_rating: 5, communication_rating: 4, overall_rating: 5, comments: 'The course materials were excellent and explanations were extremely clear and helpful!', sentiment: 'Positive', created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 2, student_name: 'Sophia Martinez', student_id: 'STU1002', department: 'Computer Science', year_of_study: '3rd Year', subject: 'Web Development', faculty_name: 'Prof. Ada Lovelace', teaching_rating: 5, course_content_rating: 4, communication_rating: 5, overall_rating: 5, comments: 'Amazing hands-on projects and great mentorship throughout the semester.', sentiment: 'Positive', created_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 3, student_name: 'Ethan Brown', student_id: 'STU1003', department: 'Electrical Engineering', year_of_study: '2nd Year', subject: 'Circuit Theory', faculty_name: 'Dr. Nikola Tesla', teaching_rating: 2, course_content_rating: 3, communication_rating: 2, overall_rating: 2, comments: 'The lectures were confusing and the lab sessions felt very rushed and difficult.', sentiment: 'Negative', created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 4, student_name: 'Emma Watson', student_id: 'STU1004', department: 'Mechanical Engineering', year_of_study: '4th Year', subject: 'Thermodynamics', faculty_name: 'Prof. James Watt', teaching_rating: 3, course_content_rating: 3, communication_rating: 3, overall_rating: 3, comments: 'Average experience. The textbook covered most topics adequately.', sentiment: 'Neutral', created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 5, student_name: 'Liam Wilson', student_id: 'STU1005', department: 'Civil Engineering', year_of_study: '1st Year', subject: 'Structural Analysis', faculty_name: 'Dr. Isambard Brunel', teaching_rating: 4, course_content_rating: 5, communication_rating: 4, overall_rating: 4, comments: 'Very solid explanations and supportive faculty members.', sentiment: 'Positive', created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: 6, student_name: 'Noah Davis', student_id: 'STU1006', department: 'Computer Science', year_of_study: '2nd Year', subject: 'Database Management Systems', faculty_name: 'Prof. Edgar Codd', teaching_rating: 1, course_content_rating: 2, communication_rating: 1, overall_rating: 1, comments: 'Poor organization of lectures and disappointing feedback on assignments.', sentiment: 'Negative', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 7, student_name: 'Ava Taylor', student_id: 'STU1007', department: 'Information Technology', year_of_study: '3rd Year', subject: 'Cloud Computing', faculty_name: 'Dr. Werner Vogels', teaching_rating: 5, course_content_rating: 5, communication_rating: 5, overall_rating: 5, comments: 'Fantastic practical insights, helpful exercises, and outstanding guidance.', sentiment: 'Positive', created_at: new Date(Date.now() - 2 * 86400000).toISOString() }
];

export default function ViewFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSentiment, setSelectedSentiment] = useState('All');

  // Modal Detail View
  const [activeItem, setActiveItem] = useState(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedDept !== 'All') params.department = selectedDept;
      if (selectedYear !== 'All') params.year = selectedYear;
      if (selectedSentiment !== 'All') params.sentiment = selectedSentiment;

      const res = await api.get('/feedback', { params });
      if (res.data && res.data.success) {
        setFeedbackList(res.data.data);
      } else {
        applyClientFilters(DEMO_FEEDBACK_LIST);
      }
    } catch (err) {
      applyClientFilters(DEMO_FEEDBACK_LIST);
    } finally {
      setLoading(false);
    }
  };

  const applyClientFilters = (baseList) => {
    let list = [...baseList];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(i => 
        i.student_name.toLowerCase().includes(q) ||
        i.subject.toLowerCase().includes(q) ||
        i.faculty_name.toLowerCase().includes(q) ||
        i.student_id.toLowerCase().includes(q)
      );
    }
    if (selectedDept !== 'All') list = list.filter(i => i.department === selectedDept);
    if (selectedYear !== 'All') list = list.filter(i => i.year_of_study === selectedYear);
    if (selectedSentiment !== 'All') list = list.filter(i => i.sentiment === selectedSentiment);
    setFeedbackList(list);
  };

  useEffect(() => {
    fetchFeedback();
  }, [selectedDept, selectedYear, selectedSentiment]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFeedback();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedDept('All');
    setSelectedYear('All');
    setSelectedSentiment('All');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">View All Student Feedbacks</h1>
        <p className="page-subtitle">Search, filter, and inspect detailed student responses and sentiments</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search student, subject, faculty, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '150px' }}
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option disabled>Department</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
              ))}
            </select>
          </div>

          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '120px' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option disabled>Year</option>
            {YEARS.map(y => (
              <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
          >
            <option disabled>Sentiment</option>
            {SENTIMENTS.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Sentiments' : s}</option>
            ))}
          </select>

          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleResetFilters}
            title="Reset Filters"
            style={{ padding: '9px 14px' }}
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Filtering and loading student feedback records..." />
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Feedback Records ({feedbackList.length})</h2>
          </div>

          {feedbackList.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Dept & Year</th>
                    <th>Subject</th>
                    <th>Faculty</th>
                    <th>Overall Rating</th>
                    <th>Sentiment</th>
                    <th>Comments</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.student_name}</td>
                      <td>{item.student_id}</td>
                      <td>
                        <div>{item.department}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.year_of_study}</div>
                      </td>
                      <td>{item.subject}</td>
                      <td>{item.faculty_name}</td>
                      <td>
                        <StarRating rating={item.overall_rating} readOnly size={14} />
                      </td>
                      <td>
                        <SentimentBadge sentiment={item.sentiment} />
                      </td>
                      <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.comments || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No comment</span>}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                          onClick={() => setActiveItem(item)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <MessageSquare className="empty-icon" />
              <p className="empty-title">No matching feedback records found</p>
              <p className="empty-desc">Try clearing your search query or adjusting your department/sentiment filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Detail View */}
      {activeItem && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
          onClick={() => setActiveItem(null)}
        >
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '650px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <SentimentBadge sentiment={activeItem.sentiment} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Submitted on {new Date(activeItem.created_at).toLocaleString()}
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
              {activeItem.subject}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.92rem' }}>
              Faculty: <strong>{activeItem.faculty_name}</strong> • Dept: <strong>{activeItem.department} ({activeItem.year_of_study})</strong>
            </p>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Teaching Quality</span>
                <div><StarRating rating={activeItem.teaching_rating} readOnly size={16} /></div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Course Content</span>
                <div><StarRating rating={activeItem.course_content_rating} readOnly size={16} /></div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Communication</span>
                <div><StarRating rating={activeItem.communication_rating} readOnly size={16} /></div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overall Rating</span>
                <div><StarRating rating={activeItem.overall_rating} readOnly size={16} /></div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                Written Comments:
              </div>
              <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', fontSize: '0.92rem', minHeight: '80px' }}>
                {activeItem.comments || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No detailed written comments provided by student.</span>}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Student: <strong>{activeItem.student_name}</strong> ({activeItem.student_id})
              </div>
              <button className="btn btn-secondary" onClick={() => setActiveItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
