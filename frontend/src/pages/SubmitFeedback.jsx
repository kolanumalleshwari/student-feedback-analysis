import React, { useState } from 'react';
import api from '../api/axiosConfig';
import StarRating from '../components/StarRating';
import SentimentBadge from '../components/SentimentBadge';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEPARTMENTS = [
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

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Post Graduate'];

export default function SubmitFeedback() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    student_name: '',
    student_id: '',
    department: 'Computer Science',
    year_of_study: '3rd Year',
    subject: '',
    faculty_name: '',
    teaching_rating: 4,
    course_content_rating: 4,
    communication_rating: 4,
    overall_rating: 4,
    comments: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleRatingChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.student_name.trim()) newErrors.student_name = 'Student Name is required';
    if (!formData.student_id.trim()) newErrors.student_id = 'Student ID is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.year_of_study.trim()) newErrors.year_of_study = 'Year of Study is required';
    if (!formData.subject.trim()) newErrors.subject = 'Course/Subject name is required';
    if (!formData.faculty_name.trim()) newErrors.faculty_name = 'Faculty Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      const res = await api.post('/feedback', formData);
      if (res.data && res.data.success) {
        setSuccessResult(res.data.data);
      } else {
        setSubmitError(res.data?.message || 'Failed to submit feedback');
      }
    } catch (err) {
      console.error('Submit feedback error:', err);
      setSubmitError(err.response?.data?.message || err.message || 'Error communicating with server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      student_name: '',
      student_id: '',
      department: 'Computer Science',
      year_of_study: '3rd Year',
      subject: '',
      faculty_name: '',
      teaching_rating: 4,
      course_content_rating: 4,
      communication_rating: 4,
      overall_rating: 4,
      comments: ''
    });
    setErrors({});
    setSuccessResult(null);
    setSubmitError(null);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Submit Course & Faculty Feedback</h1>
        <p className="page-subtitle">Provide your honest ratings and suggestions to help improve educational quality</p>
      </div>

      {successResult ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <CheckCircle2 size={54} color="#10B981" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
            Feedback Submitted Successfully!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Thank you, <strong>{successResult.student_name}</strong>. Your feedback for <strong>{successResult.subject}</strong> has been logged.
          </p>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>AI Sentiment Classification:</div>
            <SentimentBadge sentiment={successResult.sentiment} />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/view')}>
              View All Feedbacks
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              <RefreshCw size={16} /> Submit Another Response
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          {submitError && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
              1. Student Details
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Student Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="student_name"
                  className={`form-input ${errors.student_name ? 'error' : ''}`}
                  placeholder="e.g. Alex Johnson"
                  value={formData.student_name}
                  onChange={handleChange}
                />
                {errors.student_name && <span className="error-text">{errors.student_name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Student Roll / ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="student_id"
                  className={`form-input ${errors.student_id ? 'error' : ''}`}
                  placeholder="e.g. STU202401"
                  value={formData.student_id}
                  onChange={handleChange}
                />
                {errors.student_id && <span className="error-text">{errors.student_id}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Department <span className="required">*</span>
                </label>
                <select
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Year of Study <span className="required">*</span>
                </label>
                <select
                  name="year_of_study"
                  className="form-select"
                  value={formData.year_of_study}
                  onChange={handleChange}
                >
                  {YEARS.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
              2. Course & Faculty Information
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Course or Subject Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  className={`form-input ${errors.subject ? 'error' : ''}`}
                  placeholder="e.g. Data Structures & Algorithms"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && <span className="error-text">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Faculty Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="faculty_name"
                  className={`form-input ${errors.faculty_name ? 'error' : ''}`}
                  placeholder="e.g. Dr. Alan Turing"
                  value={formData.faculty_name}
                  onChange={handleChange}
                />
                {errors.faculty_name && <span className="error-text">{errors.faculty_name}</span>}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
              3. Ratings & Feedback
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div className="rating-picker-card">
                <div>
                  <div style={{ fontWeight: 600 }}>Teaching Quality</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Clarity of concepts, domain knowledge & teaching methodology</div>
                </div>
                <StarRating 
                  rating={formData.teaching_rating} 
                  onChange={(val) => handleRatingChange('teaching_rating', val)} 
                  size={24}
                />
              </div>

              <div className="rating-picker-card">
                <div>
                  <div style={{ fontWeight: 600 }}>Course Content & Material</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Relevance of syllabus, labs, and study resources</div>
                </div>
                <StarRating 
                  rating={formData.course_content_rating} 
                  onChange={(val) => handleRatingChange('course_content_rating', val)} 
                  size={24}
                />
              </div>

              <div className="rating-picker-card">
                <div>
                  <div style={{ fontWeight: 600 }}>Communication & Support</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approachability, doubt clearing & responsiveness</div>
                </div>
                <StarRating 
                  rating={formData.communication_rating} 
                  onChange={(val) => handleRatingChange('communication_rating', val)} 
                  size={24}
                />
              </div>

              <div className="rating-picker-card" style={{ borderColor: '#bfdbfe', backgroundColor: '#eff6ff' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Overall Rating</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overall assessment of course and learning experience</div>
                </div>
                <StarRating 
                  rating={formData.overall_rating} 
                  onChange={(val) => handleRatingChange('overall_rating', val)} 
                  size={26}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Written Feedback Comments
              </label>
              <textarea
                name="comments"
                rows={4}
                className="form-textarea"
                placeholder="Share your detailed feedback, appreciated aspects, or suggestions for improvement (e.g. Excellent explanations during lab sessions...)"
                value={formData.comments}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Note: Our rule-based sentiment analyzer will analyze keywords like "excellent", "confusing", "helpful", etc.
              </span>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={submitting}>
                Clear Form
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send size={16} /> Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
