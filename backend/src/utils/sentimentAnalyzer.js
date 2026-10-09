/**
 * Explainable rule-based sentiment analyzer for student feedback.
 * Determines whether comments express Positive, Neutral, or Negative sentiment.
 * Accounts for word capitalization and negations (e.g. "not good" -> Negative).
 */

const POSITIVE_WORDS = new Set([
  'excellent', 'helpful', 'good', 'great', 'amazing', 'fantastic', 'wonderful',
  'effective', 'love', 'awesome', 'supportive', 'outstanding', 'brilliant', 
  'superb', 'best', 'enjoyed', 'clear', 'clarity', 'engaging', 'valuable',
  'interactive', 'informative', 'thorough', 'encouraging', 'satisfied', 'well'
]);

const NEGATIVE_WORDS = new Set([
  'poor', 'confusing', 'difficult', 'bad', 'disappointing', 'terrible', 'awful',
  'horrible', 'useless', 'waste', 'disorganized', 'slow', 'boring', 'worst',
  'unhelpful', 'hard', 'harsh', 'strict', 'unclear', 'frustrating', 'rushed',
  'inadequate', 'lacking', 'unfair', 'unprepared', 'dull', 'annoying'
]);

const NEGATION_WORDS = new Set([
  'not', 'no', 'never', 'hardly', 'barely', 'scarcely', 'neither', 'nor',
  'cannot', "can't", "don't", "dont", "doesn't", "doesnt", "wasn't", "wasnt",
  "isn't", "isnt", "aren't", "arent", "won't", "wont", "wouldn't", "wouldnt",
  "couldn't", "couldnt", "without"
]);

function analyzeSentiment(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return 'Neutral';
  }

  const cleanText = text.toLowerCase().replace(/[^a-z0-9'\s]/g, ' ');
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);

  let positiveScore = 0;
  let negativeScore = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    let isNegated = false;
    if (i > 0 && NEGATION_WORDS.has(words[i - 1])) {
      isNegated = true;
    } else if (i > 1 && NEGATION_WORDS.has(words[i - 2])) {
      isNegated = true;
    }

    if (POSITIVE_WORDS.has(word)) {
      if (isNegated) {
        negativeScore += 1.5;
      } else {
        positiveScore += 1.0;
      }
    } else if (NEGATIVE_WORDS.has(word)) {
      if (isNegated) {
        positiveScore += 0.5;
      } else {
        negativeScore += 1.0;
      }
    }
  }

  if (positiveScore > negativeScore) {
    return 'Positive';
  } else if (negativeScore > positiveScore) {
    return 'Negative';
  } else {
    return 'Neutral';
  }
}

module.exports = {
  analyzeSentiment
};
