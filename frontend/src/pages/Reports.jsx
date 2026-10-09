import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import SentimentBadge from '../components/SentimentBadge';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Download, Calendar, Filter, FileText, RefreshCw 
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

const DEMO_REPORT_DATA = [
  { id: 1, student_name: 'Alex Johnson', student_id: 'STU1001', department: 'Computer Science', year_of_study: '3rd Year', subject: 'Data Structures & Algorithms', faculty_name: 'Dr. Alan Turing', teaching_rating: 5, course_content_rating: 5, communication_rating: 4, overall_rating: 5, comments: 'The course materials were excellent and explanations were extremely clear and helpful!', sentiment: 'Positive', created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 2, student_name: 'Sophia Martinez', student_id: 'STU1002', department: 'Computer Science', year_of_study: '3rd Year', subject: 'Web Development', faculty_name: 'Prof. Ada Lovelace', teaching_rating: 5, course_content_rating: 4, communication_rating: 5, overall_rating: 5, comments: 'Amazing hands-on projects and great mentorship throughout the semester.', sentiment: 'Positive', created_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 3, student_name: 'Ethan Brown', student_id: 'STU1003', department: 'Electrical Engineering', year_of_study: '2nd Year', subject: 'Circuit Theory', faculty_name: 'Dr. Nikola Tesla', teaching_rating: 2, course_content_rating: 3, communication_rating: 2, overall_rating: 2, comments: 'The lectures were confusing and the lab sessions felt very rushed and difficult.', sentiment: 'Negative', created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 4, student_name: 'Emma Watson', student_id: 'STU1004', department: 'Mechanical Engineering', year_of_study: '4th Year', subject: 'Thermodynamics', faculty_name: 'Prof. James Watt', teaching_rating: 3, course_content_rating: 3, communication_rating: 3, overall_rating: 3, comments: 'Average experience. The textbook covered most topics adequately.', sentiment: 'Neutral', created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 5, student_name: 'Ava Taylor', student_id: 'STU1007', department: 'Information Technology', year_of_study: '3rd Year', subject: 'Cloud Computing', faculty_name: 'Dr. Werner Vogels', teaching_rating: 5, course_content_rating: 5, communication_rating: 5, overall_rating: 5, comments: 'Fantastic practical insights, helpful exercises, and outstanding guidance.', sentiment: 'Positive', created_at: new Date(Date.now() - 2 * 86400000).toISOString() }
];

export default function Reports() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Calculated Metrics for Filtered Data
  const [metrics, setMetrics] = useState({
    total: 0,
    avgOverall: 0,
    avgTeaching: 0,
    avgContent: 0,
    avgComm: 0,
    positiveCount: 0,
    neutralCount: 0,
    negativeCount: 0
  });

  const fetchReports = async () => {
    try {
      setLoading(true);

      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (selectedDept !== 'All') params.department = selectedDept;

      const res = await api.get('/feedback', { params });
      if (res.data && res.data.success) {
        processRows(res.data.data || []);
      } else {
        filterAndProcessDemoData(DEMO_REPORT_DATA);
      }
    } catch (err) {
      filterAndProcessDemoData(DEMO_REPORT_DATA);
    } finally {
      setLoading(false);
    }
  };

  const filterAndProcessDemoData = (baseRows) => {
    let rows = [...baseRows];
    if (selectedDept !== 'All') rows = rows.filter(r => r.department === selectedDept);
    if (startDate) rows = rows.filter(r => new Date(r.created_at) >= new Date(startDate));
    if (endDate) rows = rows.filter(r => new Date(r.created_at) <= new Date(endDate + 'T23:59:59'));
    processRows(rows);
  };

  const processRows = (rows) => {
    setReportData(rows);
    if (rows.length > 0) {
      const total = rows.length;
      const sumOverall = rows.reduce((acc, r) => acc + Number(r.overall_rating), 0);
      const sumTeaching = rows.reduce((acc, r) => acc + Number(r.teaching_rating), 0);
      const sumContent = rows.reduce((acc, r) => acc + Number(r.course_content_rating), 0);
      const sumComm = rows.reduce((acc, r) => acc + Number(r.communication_rating), 0);

      let pos = 0, neu = 0, neg = 0;
      rows.forEach(r => {
        if (r.sentiment === 'Positive') pos++;
        else if (r.sentiment === 'Negative') neg++;
        else neu++;
      });

      setMetrics({
        total,
        avgOverall: Number((sumOverall / total).toFixed(2)),
        avgTeaching: Number((sumTeaching / total).toFixed(2)),
        avgContent: Number((sumContent / total).toFixed(2)),
        avgComm: Number((sumComm / total).toFixed(2)),
        positiveCount: pos,
        neutralCount: neu,
        negativeCount: neg
      });
    } else {
      setMetrics({
        total: 0,
        avgOverall: 0,
        avgTeaching: 0,
        avgContent: 0,
        avgComm: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0
      });
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate, selectedDept]);

  const handleExportCSV = () => {
    if (reportData.length === 0) return;

    const headers = [
      'ID',
      'Student Name',
      'Student ID',
      'Department',
      'Year of Study',
      'Subject',
      'Faculty Name',
      'Teaching Rating',
      'Course Content Rating',
      'Communication Rating',
      'Overall Rating',
      'Sentiment',
      'Comments',
      'Submission Date'
    ];

    const csvRows = [headers.join(',')];

    reportData.forEach(item => {
      const row = [
        item.id,
        `"${(item.student_name || '').replace(/"/g, '""')}"`,
        `"${(item.student_id || '').replace(/"/g, '""')}"`,
        `"${(item.department || '').replace(/"/g, '""')}"`,
        `"${(item.year_of_study || '').replace(/"/g, '""')}"`,
        `"${(item.subject || '').replace(/"/g, '""')}"`,
        `"${(item.faculty_name || '').replace(/"/g, '""')}"`,
        item.teaching_rating,
        item.course_content_rating,
        item.communication_rating,
        item.overall_rating,
        item.sentiment,
        `"${(item.comments || '').replace(/"/g, '""')}"`,
        `"${new Date(item.created_at).toISOString()}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_feedback_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedDept('All');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Executive Reports & CSV Export</h1>
        <p className="page-subtitle">Filter feedback summaries by date range and department, then download official reports</p>
      </div>

      {/* Filter Control Box */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--primary)" /> Filter Parameters
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Calendar size={14} /> Start Date
            </label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Calendar size={14} /> End Date
            </label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Department</label>
            <select
              className="form-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={handleResetFilters} style={{ flex: 1 }}>
              <RefreshCw size={14} /> Reset
            </button>
            <button 
              className="btn btn-success" 
              onClick={handleExportCSV} 
              disabled={reportData.length === 0}
              style={{ flex: 1 }}
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Generating report data..." />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Filtered Records</span>
                <span className="stat-value">{metrics.total}</span>
                <span className="stat-sub">Submissions</span>
              </div>
              <div className="stat-icon-wrapper blue"><FileText size={24} /></div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Average Rating</span>
                <span className="stat-value">{metrics.avgOverall} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 5</span></span>
                <div style={{ marginTop: '4px' }}><StarRating rating={Math.round(metrics.avgOverall)} readOnly size={14} /></div>
              </div>
              <div className="stat-icon-wrapper blue"><FileText size={24} /></div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Teaching Avg</span>
                <span className="stat-value">{metrics.avgTeaching}</span>
                <span className="stat-sub">Out of 5 Stars</span>
              </div>
              <div className="stat-icon-wrapper emerald"><FileText size={24} /></div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="stat-label">Sentiment Ratio</span>
                <span className="stat-value" style={{ fontSize: '1.2rem' }}>
                  <span style={{ color: '#10B981' }}>{metrics.positiveCount} Pos</span> • <span style={{ color: '#EF4444' }}>{metrics.negativeCount} Neg</span>
                </span>
                <span className="stat-sub">{metrics.neutralCount} Neutral</span>
              </div>
              <div className="stat-icon-wrapper gray"><FileText size={24} /></div>
            </div>
          </div>

          {/* Detailed Report Table */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Generated Report Summary</h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Showing {reportData.length} entries
              </span>
            </div>

            {reportData.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th># ID</th>
                      <th>Student</th>
                      <th>Dept / Year</th>
                      <th>Subject & Faculty</th>
                      <th>Ratings (Teach / Content / Comm / Overall)</th>
                      <th>Sentiment</th>
                      <th>Comments</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map(item => (
                      <tr key={item.id}>
                        <td>#{item.id}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{item.student_name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.student_id}</div>
                        </td>
                        <td>
                          <div>{item.department}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.year_of_study}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{item.subject}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.faculty_name}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>
                            <strong>{item.teaching_rating}</strong> / <strong>{item.course_content_rating}</strong> / <strong>{item.communication_rating}</strong> / <strong style={{ color: 'var(--primary)' }}>{item.overall_rating}</strong>
                          </div>
                        </td>
                        <td><SentimentBadge sentiment={item.sentiment} /></td>
                        <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.comments || '-'}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <FileText className="empty-icon" />
                <p className="empty-title">No report data for selected range</p>
                <p className="empty-desc">Try clearing your date range or selecting a different department filter.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
