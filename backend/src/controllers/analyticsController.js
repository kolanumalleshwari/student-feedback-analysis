const { pool } = require('../config/db');
const { inMemoryFeedback } = require('./feedbackController');

// GET /api/analytics/summary
async function getSummaryAnalytics(req, res) {
  try {
    const [totalRows] = await pool.query(`
      SELECT 
        COUNT(*) as totalSubmissions,
        ROUND(AVG(overall_rating), 2) as avgOverallRating,
        ROUND(AVG(teaching_rating), 2) as avgTeachingRating,
        ROUND(AVG(course_content_rating), 2) as avgCourseContentRating,
        ROUND(AVG(communication_rating), 2) as avgCommunicationRating
      FROM feedback
    `);

    const stats = totalRows[0] || {
      totalSubmissions: 0,
      avgOverallRating: 0,
      avgTeachingRating: 0,
      avgCourseContentRating: 0,
      avgCommunicationRating: 0
    };

    const [sentimentRows] = await pool.query(`
      SELECT sentiment, COUNT(*) as count FROM feedback GROUP BY sentiment
    `);

    const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
    sentimentRows.forEach(row => {
      sentimentCounts[row.sentiment] = Number(row.count);
    });

    const [ratingDistRows] = await pool.query(`
      SELECT overall_rating as star, COUNT(*) as count FROM feedback GROUP BY overall_rating ORDER BY overall_rating ASC
    `);

    const ratingDistribution = [1, 2, 3, 4, 5].map(star => {
      const match = ratingDistRows.find(r => Number(r.star) === star);
      return {
        star: `${star} Star${star > 1 ? 's' : ''}`,
        ratingValue: star,
        count: match ? Number(match.count) : 0
      };
    });

    const [recentFeedback] = await pool.query(`
      SELECT id, student_name, student_id, department, subject, faculty_name, overall_rating, sentiment, created_at
      FROM feedback ORDER BY created_at DESC LIMIT 5
    `);

    return res.status(200).json({
      success: true,
      data: {
        totalSubmissions: Number(stats.totalSubmissions || 0),
        avgOverallRating: Number(stats.avgOverallRating || 0),
        avgTeachingRating: Number(stats.avgTeachingRating || 0),
        avgCourseContentRating: Number(stats.avgCourseContentRating || 0),
        avgCommunicationRating: Number(stats.avgCommunicationRating || 0),
        positiveCount: sentimentCounts.Positive,
        neutralCount: sentimentCounts.Neutral,
        negativeCount: sentimentCounts.Negative,
        ratingDistribution,
        recentFeedback
      }
    });
  } catch (error) {
    console.warn('[Analytics Fallback] MySQL unavailable, calculating summary from memory store:', error.message);
    const list = inMemoryFeedback;
    const totalSubmissions = list.length;

    let sumOverall = 0, sumTeaching = 0, sumContent = 0, sumComm = 0;
    const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
    const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    list.forEach(item => {
      sumOverall += Number(item.overall_rating);
      sumTeaching += Number(item.teaching_rating);
      sumContent += Number(item.course_content_rating);
      sumComm += Number(item.communication_rating);

      if (sentimentCounts[item.sentiment] !== undefined) sentimentCounts[item.sentiment]++;
      if (starCounts[item.overall_rating] !== undefined) starCounts[item.overall_rating]++;
    });

    const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
      star: `${star} Star${star > 1 ? 's' : ''}`,
      ratingValue: star,
      count: starCounts[star]
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalSubmissions,
        avgOverallRating: totalSubmissions > 0 ? Number((sumOverall / totalSubmissions).toFixed(2)) : 0,
        avgTeachingRating: totalSubmissions > 0 ? Number((sumTeaching / totalSubmissions).toFixed(2)) : 0,
        avgCourseContentRating: totalSubmissions > 0 ? Number((sumContent / totalSubmissions).toFixed(2)) : 0,
        avgCommunicationRating: totalSubmissions > 0 ? Number((sumComm / totalSubmissions).toFixed(2)) : 0,
        positiveCount: sentimentCounts.Positive,
        neutralCount: sentimentCounts.Neutral,
        negativeCount: sentimentCounts.Negative,
        ratingDistribution,
        recentFeedback: list.slice(0, 5)
      },
      fallbackMode: true
    });
  }
}

// GET /api/analytics/departments
async function getDepartmentAnalytics(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        department,
        COUNT(*) as feedbackCount,
        ROUND(AVG(overall_rating), 2) as avgRating,
        SUM(CASE WHEN sentiment = 'Positive' THEN 1 ELSE 0 END) as positiveCount,
        SUM(CASE WHEN sentiment = 'Neutral' THEN 1 ELSE 0 END) as neutralCount,
        SUM(CASE WHEN sentiment = 'Negative' THEN 1 ELSE 0 END) as negativeCount
      FROM feedback
      GROUP BY department
      ORDER BY feedbackCount DESC
    `);

    const data = rows.map(r => ({
      department: r.department,
      feedbackCount: Number(r.feedbackCount),
      avgRating: Number(r.avgRating),
      positiveCount: Number(r.positiveCount),
      neutralCount: Number(r.neutralCount),
      negativeCount: Number(r.negativeCount)
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    const deptMap = {};
    inMemoryFeedback.forEach(item => {
      if (!deptMap[item.department]) {
        deptMap[item.department] = { department: item.department, feedbackCount: 0, sumRating: 0, positiveCount: 0, neutralCount: 0, negativeCount: 0 };
      }
      const d = deptMap[item.department];
      d.feedbackCount++;
      d.sumRating += item.overall_rating;
      if (item.sentiment === 'Positive') d.positiveCount++;
      else if (item.sentiment === 'Negative') d.negativeCount++;
      else d.neutralCount++;
    });

    const data = Object.values(deptMap).map(d => ({
      ...d,
      avgRating: Number((d.sumRating / d.feedbackCount).toFixed(2))
    }));

    return res.status(200).json({ success: true, data, fallbackMode: true });
  }
}

// GET /api/analytics/subjects
async function getSubjectAnalytics(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        subject,
        faculty_name,
        department,
        COUNT(*) as feedbackCount,
        ROUND(AVG(overall_rating), 2) as avgOverallRating,
        ROUND(AVG(teaching_rating), 2) as avgTeachingRating,
        ROUND(AVG(course_content_rating), 2) as avgCourseContentRating,
        ROUND(AVG(communication_rating), 2) as avgCommunicationRating
      FROM feedback
      GROUP BY subject, faculty_name, department
      ORDER BY avgOverallRating DESC
    `);

    const data = rows.map(r => ({
      subject: r.subject,
      faculty_name: r.faculty_name,
      department: r.department,
      feedbackCount: Number(r.feedbackCount),
      avgOverallRating: Number(r.avgOverallRating),
      avgTeachingRating: Number(r.avgTeachingRating),
      avgCourseContentRating: Number(r.avgCourseContentRating),
      avgCommunicationRating: Number(r.avgCommunicationRating)
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    const subMap = {};
    inMemoryFeedback.forEach(item => {
      const key = `${item.subject}__${item.faculty_name}`;
      if (!subMap[key]) {
        subMap[key] = {
          subject: item.subject,
          faculty_name: item.faculty_name,
          department: item.department,
          feedbackCount: 0,
          sumOverall: 0,
          sumTeaching: 0,
          sumContent: 0,
          sumComm: 0
        };
      }
      const s = subMap[key];
      s.feedbackCount++;
      s.sumOverall += item.overall_rating;
      s.sumTeaching += item.teaching_rating;
      s.sumContent += item.course_content_rating;
      s.sumComm += item.communication_rating;
    });

    const data = Object.values(subMap).map(s => ({
      subject: s.subject,
      faculty_name: s.faculty_name,
      department: s.department,
      feedbackCount: s.feedbackCount,
      avgOverallRating: Number((s.sumOverall / s.feedbackCount).toFixed(2)),
      avgTeachingRating: Number((s.sumTeaching / s.feedbackCount).toFixed(2)),
      avgCourseContentRating: Number((s.sumContent / s.feedbackCount).toFixed(2)),
      avgCommunicationRating: Number((s.sumComm / s.feedbackCount).toFixed(2))
    }));

    return res.status(200).json({ success: true, data, fallbackMode: true });
  }
}

// GET /api/analytics/sentiment
async function getSentimentAnalytics(req, res) {
  try {
    const [counts] = await pool.query(`
      SELECT sentiment, COUNT(*) as count FROM feedback GROUP BY sentiment
    `);

    let total = 0;
    const breakdown = { Positive: 0, Neutral: 0, Negative: 0 };
    counts.forEach(r => {
      breakdown[r.sentiment] = Number(r.count);
      total += Number(r.count);
    });

    const chartData = [
      { name: 'Positive', count: breakdown.Positive, percentage: total > 0 ? Number(((breakdown.Positive / total) * 100).toFixed(1)) : 0, color: '#10B981' },
      { name: 'Neutral', count: breakdown.Neutral, percentage: total > 0 ? Number(((breakdown.Neutral / total) * 100).toFixed(1)) : 0, color: '#6B7280' },
      { name: 'Negative', count: breakdown.Negative, percentage: total > 0 ? Number(((breakdown.Negative / total) * 100).toFixed(1)) : 0, color: '#EF4444' }
    ];

    const appreciatedAspects = [
      'Interactive and clear teaching explanations',
      'Extensive hands-on practical lab sessions',
      'Supportive faculty members and mentorship',
      'Well-structured learning materials and presentations'
    ];

    const areasNeedingImprovement = [
      'Pacing of introductory theory lectures',
      'Lab session time management and hardware access',
      'Clarity in assignment guidelines'
    ];

    return res.status(200).json({
      success: true,
      data: { totalSubmissions: total, chartData, appreciatedAspects, areasNeedingImprovement }
    });
  } catch (error) {
    let total = inMemoryFeedback.length;
    const breakdown = { Positive: 0, Neutral: 0, Negative: 0 };
    inMemoryFeedback.forEach(r => {
      if (breakdown[r.sentiment] !== undefined) breakdown[r.sentiment]++;
    });

    const chartData = [
      { name: 'Positive', count: breakdown.Positive, percentage: total > 0 ? Number(((breakdown.Positive / total) * 100).toFixed(1)) : 0, color: '#10B981' },
      { name: 'Neutral', count: breakdown.Neutral, percentage: total > 0 ? Number(((breakdown.Neutral / total) * 100).toFixed(1)) : 0, color: '#6B7280' },
      { name: 'Negative', count: breakdown.Negative, percentage: total > 0 ? Number(((breakdown.Negative / total) * 100).toFixed(1)) : 0, color: '#EF4444' }
    ];

    const appreciatedAspects = [
      'Interactive and clear teaching explanations',
      'Extensive hands-on practical lab sessions',
      'Supportive faculty members and mentorship',
      'Well-structured learning materials and presentations'
    ];

    const areasNeedingImprovement = [
      'Pacing of introductory theory lectures',
      'Lab session time management and hardware access',
      'Clarity in assignment guidelines'
    ];

    return res.status(200).json({
      success: true,
      data: { totalSubmissions: total, chartData, appreciatedAspects, areasNeedingImprovement },
      fallbackMode: true
    });
  }
}

module.exports = {
  getSummaryAnalytics,
  getDepartmentAnalytics,
  getSubjectAnalytics,
  getSentimentAnalytics
};
