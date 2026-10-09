const { pool } = require('../config/db');
const { analyzeSentiment } = require('../utils/sentimentAnalyzer');

// In-Memory fallback store for when MySQL is not connected or initialized
let inMemoryFeedback = [
  {
    id: 1,
    student_name: 'Alex Johnson',
    student_id: 'STU1001',
    department: 'Computer Science',
    year_of_study: '3rd Year',
    subject: 'Data Structures & Algorithms',
    faculty_name: 'Dr. Alan Turing',
    teaching_rating: 5,
    course_content_rating: 5,
    communication_rating: 4,
    overall_rating: 5,
    comments: 'The course materials were excellent and explanations were extremely clear and helpful!',
    sentiment: 'Positive',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 2,
    student_name: 'Sophia Martinez',
    student_id: 'STU1002',
    department: 'Computer Science',
    year_of_study: '3rd Year',
    subject: 'Web Development',
    faculty_name: 'Prof. Ada Lovelace',
    teaching_rating: 5,
    course_content_rating: 4,
    communication_rating: 5,
    overall_rating: 5,
    comments: 'Amazing hands-on projects and great mentorship throughout the semester.',
    sentiment: 'Positive',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    id: 3,
    student_name: 'Ethan Brown',
    student_id: 'STU1003',
    department: 'Electrical Engineering',
    year_of_study: '2nd Year',
    subject: 'Circuit Theory',
    faculty_name: 'Dr. Nikola Tesla',
    teaching_rating: 2,
    course_content_rating: 3,
    communication_rating: 2,
    overall_rating: 2,
    comments: 'The lectures were confusing and the lab sessions felt very rushed and difficult.',
    sentiment: 'Negative',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 4,
    student_name: 'Emma Watson',
    student_id: 'STU1004',
    department: 'Mechanical Engineering',
    year_of_study: '4th Year',
    subject: 'Thermodynamics',
    faculty_name: 'Prof. James Watt',
    teaching_rating: 3,
    course_content_rating: 3,
    communication_rating: 3,
    overall_rating: 3,
    comments: 'Average experience. The textbook covered most topics adequately.',
    sentiment: 'Neutral',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 5,
    student_name: 'Ava Taylor',
    student_id: 'STU1007',
    department: 'Information Technology',
    year_of_study: '3rd Year',
    subject: 'Cloud Computing',
    faculty_name: 'Dr. Werner Vogels',
    teaching_rating: 5,
    course_content_rating: 5,
    communication_rating: 5,
    overall_rating: 5,
    comments: 'Fantastic practical insights, helpful exercises, and outstanding guidance.',
    sentiment: 'Positive',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

// Helper to filter in-memory data
function filterInMemory(queryObj) {
  let list = [...inMemoryFeedback];
  const { search, department, year, sentiment, startDate, endDate } = queryObj;

  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    list = list.filter(item => 
      item.student_name.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q) ||
      item.faculty_name.toLowerCase().includes(q) ||
      item.student_id.toLowerCase().includes(q)
    );
  }

  if (department && department.trim() !== '' && department !== 'All') {
    list = list.filter(item => item.department === department.trim());
  }

  if (year && year.trim() !== '' && year !== 'All') {
    list = list.filter(item => item.year_of_study === year.trim());
  }

  if (sentiment && sentiment.trim() !== '' && sentiment !== 'All') {
    list = list.filter(item => item.sentiment === sentiment.trim());
  }

  if (startDate) {
    list = list.filter(item => new Date(item.created_at) >= new Date(startDate));
  }

  if (endDate) {
    list = list.filter(item => new Date(item.created_at) <= new Date(endDate + 'T23:59:59'));
  }

  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

// GET /api/feedback
async function getAllFeedback(req, res) {
  try {
    const { search, department, year, sentiment, startDate, endDate, limit } = req.query;

    let query = 'SELECT * FROM feedback WHERE 1=1';
    const params = [];

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      query += ' AND (student_name LIKE ? OR subject LIKE ? OR faculty_name LIKE ? OR student_id LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (department && department.trim() !== '' && department !== 'All') {
      query += ' AND department = ?';
      params.push(department.trim());
    }

    if (year && year.trim() !== '' && year !== 'All') {
      query += ' AND year_of_study = ?';
      params.push(year.trim());
    }

    if (sentiment && sentiment.trim() !== '' && sentiment !== 'All') {
      query += ' AND sentiment = ?';
      params.push(sentiment.trim());
    }

    if (startDate && startDate.trim() !== '') {
      query += ' AND DATE(created_at) >= ?';
      params.push(startDate.trim());
    }

    if (endDate && endDate.trim() !== '') {
      query += ' AND DATE(created_at) <= ?';
      params.push(endDate.trim());
    }

    query += ' ORDER BY created_at DESC';

    if (limit && !isNaN(parseInt(limit, 10))) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const [rows] = await pool.query(query, params);
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.warn('[Database Fallback] Serving feedback from in-memory fallback store:', error.message);
    const fallbackList = filterInMemory(req.query);
    const result = req.query.limit ? fallbackList.slice(0, parseInt(req.query.limit, 10)) : fallbackList;

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
      fallbackMode: true,
      notice: 'Running on in-memory store because MySQL connection is not configured or offline'
    });
  }
}

// GET /api/feedback/:id
async function getFeedbackById(req, res) {
  try {
    const { id } = req.params;
    const numId = parseInt(id, 10);
    if (!id || isNaN(numId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID provided'
      });
    }

    try {
      const [rows] = await pool.query('SELECT * FROM feedback WHERE id = ?', [numId]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: `Feedback record with ID ${id} not found` });
      }
      return res.status(200).json({ success: true, data: rows[0] });
    } catch (mysqlErr) {
      const item = inMemoryFeedback.find(r => r.id === numId);
      if (!item) {
        return res.status(404).json({ success: false, message: `Feedback record with ID ${id} not found` });
      }
      return res.status(200).json({ success: true, data: item, fallbackMode: true });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving feedback record', error: error.message });
  }
}

// POST /api/feedback
async function createFeedback(req, res) {
  try {
    const {
      student_name,
      student_id,
      department,
      year_of_study,
      subject,
      faculty_name,
      teaching_rating,
      course_content_rating,
      communication_rating,
      overall_rating,
      comments
    } = req.body;

    const errors = [];

    if (!student_name || typeof student_name !== 'string' || !student_name.trim()) errors.push('Student name is required');
    if (!student_id || typeof student_id !== 'string' || !student_id.trim()) errors.push('Student ID is required');
    if (!department || typeof department !== 'string' || !department.trim()) errors.push('Department is required');
    if (!year_of_study || typeof year_of_study !== 'string' || !year_of_study.trim()) errors.push('Year of study is required');
    if (!subject || typeof subject !== 'string' || !subject.trim()) errors.push('Course / Subject is required');
    if (!faculty_name || typeof faculty_name !== 'string' || !faculty_name.trim()) errors.push('Faculty name is required');

    const ratings = {
      teaching_rating: Number(teaching_rating),
      course_content_rating: Number(course_content_rating),
      communication_rating: Number(communication_rating),
      overall_rating: Number(overall_rating)
    };

    for (const [key, val] of Object.entries(ratings)) {
      if (isNaN(val) || val < 1 || val > 5) {
        errors.push(`${key.replace('_', ' ')} must be an integer rating between 1 and 5`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const cleanComments = comments ? String(comments).trim() : '';
    const sentiment = analyzeSentiment(cleanComments);

    const newRecord = {
      id: Date.now(),
      student_name: student_name.trim(),
      student_id: student_id.trim(),
      department: department.trim(),
      year_of_study: year_of_study.trim(),
      subject: subject.trim(),
      faculty_name: faculty_name.trim(),
      teaching_rating: ratings.teaching_rating,
      course_content_rating: ratings.course_content_rating,
      communication_rating: ratings.communication_rating,
      overall_rating: ratings.overall_rating,
      comments: cleanComments,
      sentiment,
      created_at: new Date().toISOString()
    };

    try {
      const insertQuery = `
        INSERT INTO feedback 
        (student_name, student_id, department, year_of_study, subject, faculty_name, teaching_rating, course_content_rating, communication_rating, overall_rating, comments, sentiment) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        newRecord.student_name,
        newRecord.student_id,
        newRecord.department,
        newRecord.year_of_study,
        newRecord.subject,
        newRecord.faculty_name,
        newRecord.teaching_rating,
        newRecord.course_content_rating,
        newRecord.communication_rating,
        newRecord.overall_rating,
        newRecord.comments,
        newRecord.sentiment
      ];

      const [result] = await pool.query(insertQuery, values);
      newRecord.id = result.insertId;

      // Keep in-memory store in sync as well
      inMemoryFeedback.unshift(newRecord);

      return res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully to MySQL database',
        data: newRecord
      });
    } catch (dbError) {
      console.warn('[Database Notice] MySQL insert failed, saving to in-memory store:', dbError.message);
      inMemoryFeedback.unshift(newRecord);
      return res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully (Saved in memory - MySQL offline)',
        data: newRecord,
        fallbackMode: true
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process feedback submission',
      error: error.message
    });
  }
}

module.exports = {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  inMemoryFeedback
};
