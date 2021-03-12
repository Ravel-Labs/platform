var db = require("../knex");

const tableName = "feedback";
const promptTableName = "feedbackPrompts";
const trackPromptTableName = "trackFeedbackPrompts";

defaultReturnColumns = [
  "id",
  "trackId",
  "listenerUserId",
  "value",
  "createdAt",
  "promptId",
];

async function filterForTrackIdUserId(trackId, userId) {
  // For each combination of promptId, trackId, listenerUserId,
  // return the most recent row based on createdAt.
  return await db
    .raw(
      'SELECT f.id, f."createdAt", f."trackId", f."promptId", f."listenerUserId", f.value \
    FROM feedback f \
    INNER JOIN ( \
	    SELECT "trackId", "listenerUserId", "promptId", max("createdAt") as "maxCreatedAt" from feedback group by "trackId", "listenerUserId", "promptId" \
    ) ms \
    ON f."trackId" = ms."trackId" \
    AND f."createdAt" = ms."maxCreatedAt" \
    AND f."listenerUserId" = ms."listenerUserId" \
    AND f."promptId" = ms."promptId"\
    WHERE f."listenerUserId" = ? \
    AND f."trackId" = ?;',
      [userId, trackId]
    )
    .then((res) => res.rows);
}

async function getFeedbackPromptsbyTrackId(id) {
  try {
    const feedbackPromptIds = await db(trackPromptTableName)
      .where({ trackId: id })
      .select("promptId");
    const ids = feedbackPromptIds.map((x) => x.promptId);
    const feedbackPrompts = await db(promptTableName).whereIn("id", ids);
    console.log(feedbackPrompts);
    return feedbackPrompts;
  } catch (e) {
    console.error(e);
  }
}

async function create(trackId, listenerUserId, value, promptId, fields = {}) {
  try {
    const newFeedback = await db(tableName).insert(
      {
        trackId,
        listenerUserId,
        value,
        promptId,
        ...fields,
      },
      defaultReturnColumns
    );
    console.log(newFeedback);
    return newFeedback;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  create,
  filterForTrackIdUserId,
  getFeedbackPromptsbyTrackId,
};
