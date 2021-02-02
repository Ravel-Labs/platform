var db = require('../knex');

const tracksTable = 'tracks';
const eventsTable = 'events';
const eventTypesTable = 'eventTypes';
const feedbackTable = 'feedback';
const feedbackPromptsTable = 'feedbackPrompts';
const trackFeedbackPromptsTable = 'trackFeedbackPrompts';

// async function getEventStatsbyTrackId(trackId) {
// 	try {
// 		return eventStats;
// 	} catch(e) {
// 		console.error(e);
// 	}

// }

async function getFeedbackStatsbyTrackId(trackId) {
	try {
		const feedbackStats = await db(feedbackTable)
                                  .join(feedbackPromptsTable, feedbackTable.promptId, feedbackPromptsTable.id)
                                  .select(feedbackPromptsTable.prompt, knex.raw('SUM(*)'), knex.raw('AVG(feedback.value)'))
                                  .groupby('promptId')
                                  .where({trackId: trackId})
    return feedbackStats;
	} catch(e) {
		console.error(e);
	}

}

module.exports = {
  getFeedbackStatsbyTrackId,
}

// trackId, feedback, feedbackPrompts
// feedback where trackId = feedback.trackId
// group by feedbackPromptId
// get the average value after each grouping
// join feedbackPromptId on prompt.FeedbackPrompts
// return object with feedbackPrompt, number of responses, and average response for each prompt