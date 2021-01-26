var db = require('../knex');

const tableName = 'feedback';
const promptTableName = 'feedbackPrompts';
const trackPromptTableName = 'trackFeedbackPrompts';

defaultReturnColumns = [
	'id',
  'trackId',
  'listenerUserId',
  'value',
  'createdAt',
  'promptId'
]

async function getFeedbackPromptsbyTrackId(id) {
	try {
		const feedbackPromptIds = await db(trackPromptTableName).where({trackId:id}).select('promptId');
		const ids = feedbackPromptIds.map(x => x.promptId);
		const feedbackPrompts = await db(promptTableName).whereIn('id', ids);
		console.log(feedbackPrompts);
		return feedbackPrompts;
	} catch(e) {
		console.error(e);
	}
}

async function create(trackId, listenerUserId, value, promptId, fields={}) {
  try {
    const newFeedback = await db(tableName).insert({
      trackId,
      listenerUserId,
      value,
      promptId,
      ...fields
    }, defaultReturnColumns);
    console.log(newFeedback);
    return newFeedback;
  } catch(e) {
    console.error(e);
  }
}

module.exports = {
	getFeedbackPromptsbyTrackId,
  create,
}
