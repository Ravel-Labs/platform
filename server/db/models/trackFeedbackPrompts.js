var db = require("../knex");

const tableName = "trackFeedbackPrompts";
const defaultReturnColumns = ["id", "trackId", "promptId"];

// Create track prompts
async function bulkCreate(toCreate) {
  try {
    const trackPrompts = await db(tableName).insert(
      toCreate,
      defaultReturnColumns
    );
    return trackPrompts;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  bulkCreate,
};
