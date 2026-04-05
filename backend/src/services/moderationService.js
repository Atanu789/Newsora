const { processArticleWithAi } = require('./aiService');

async function moderateSubmission(content) {
  const ai = await processArticleWithAi(content);
  const flaggedTerms = ['hate', 'violence'];
  const hasFlag = flaggedTerms.some((term) => content.toLowerCase().includes(term));

  return {
    category: ai.category,
    status: hasFlag ? 'rejected' : 'pending',
    moderationNotes: hasFlag
      ? 'Auto-flagged for manual review due to policy terms.'
      : 'Passed AI pre-check.'
  };
}

module.exports = {
  moderateSubmission
};
