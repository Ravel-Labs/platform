var db = require("../knex");

var Tracks = require("./tracks");

const tableName = "comments";

const defaultReturnColumns = [
  "id",
  "userId",
  "trackId",
  "createdAt",
  "message",
];

async function create(userId, trackId, message) {
  try {
    const comments = await db(tableName).insert(
      {
        userId,
        trackId,
        message,
      },
      defaultReturnColumns
    );
    return comments.pop();
  } catch (e) {
    console.error(e);
  }
}

async function getByTrackSlug(trackSlug) {
  try {
    const trackId = await Tracks.getIdBySlug(trackSlug);
    const comments = await db(tableName)
      .join("users", { "users.id": "comments.userId" })
      .where({ trackId: trackId })
      .select([
        "comments.*",
        "users.username",
        "users.imagePath",
        "users.displayName",
      ])
      .orderBy("createdAt", "desc");
    return comments.map((comment) => {
      comment.user = {
        id: comment.userId,
        username: comment.username,
        imagePath: comment.imagePath,
        displayName: comment.displayName,
      };
      return comment;
    });
  } catch (e) {
    console.error(e);
  }
}

async function updateById(commentId, commentObject) {
  const returnFields = ["id", ...Object.keys(commentObject)];
  try {
    const comments = await db(tableName)
      .where({ id: commentId })
      .update(commentObject, returnFields);
    return comments.pop();
  } catch (e) {
    console.error(e);
  }
}

async function deleteById(commentId) {
  try {
    const deletedComment = await db(tableName).where({ id: commentId }).del();
    return deletedComment;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  create,
  deleteById,
  getByTrackSlug,
  updateById,
};
