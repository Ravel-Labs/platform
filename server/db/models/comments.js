var db = require("../knex");

var Tracks = require("./tracks");


const tableName = "comments";

const defaultReturnColumns = [
  "id",
  "userId",
  "trackId",
  "createdAt",
  "text",
];

async function create(userId, trackId, text) {
  try {
    const comment = await db(tableName).insert(
      {
        userId,
        trackId,
        text,
      },
      defaultReturnColumns
    );
    console.log(comment);
    return comment;
  } catch (e) {
    console.error(e);
  }
};

async function getByTrackSlug(trackSlug) {
  try {
    const trackId = await Tracks.getIdBySlug(trackSlug);
    const comments = await db(tableName).where({ trackId: trackId });
    console.log(comments);
    return comments;
  } catch (e) {
    console.error(e);
  }
};

async function updateById(commentId, commentObject) {
  const returnFields = ["id", ...Object.keys(commentObject)];
  try {
    const comments = await db(tableName)
      .where({ id: commentId })
      .update(commentObject, returnFields);
    return comments.pop()
  } catch (e) {
    console.error(e);
  }
};

async function deleteById(commentId) {
  try {
    const deletedComment = await db(tableName).where({ id: commentId }).del();
    return deletedComment;
  } catch (e) {
    console.error(e);
  }
};

export default comments;