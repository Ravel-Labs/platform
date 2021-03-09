var db = require("../knex");

const tableName = "feedbackPrompts";
const defaultReturnColumns = ["id", "prompt", "type", "scale"];

// Return all prompts
async function list() {
  try {
    const prompts = await db(tableName).select(defaultReturnColumns);
    return prompts;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  list,
};
