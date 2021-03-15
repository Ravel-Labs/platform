var db = require("../knex");

const tableName = "trackCredits";
const defaultReturnColumns = ["id", "trackId", "userId"];

async function create(trackId, userId) {
  try {
    const trackCredit = await db(tableName).insert(
      {
        trackId: trackId,
        userId: userId,
      },
      defaultReturnColumns
    );
    return trackCredit;
  } catch (e) {
    console.error(e);
  }
}

async function getUserIdbyTrackId(trackId) {
  try {
    const userId = await db(tableName)
      .where({ trackId: trackId })
      .select("userId")
      .first()
      .then((row) => (row ? row["userId"] : null));
    return userId;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  create,
  getUserIdbyTrackId,
};
