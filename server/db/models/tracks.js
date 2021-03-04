var db = require("../knex");

const tableName = "tracks";

const defaultReturnColumns = [
  "id",
  "trackName",
  "createdAt",
  "genre",
  "path",
  "slug",
  "isPrivate",
];

async function create(trackName, genre, path, slug, isPrivate, fields = {}) {
  try {
    const track = await db(tableName).insert(
      {
        trackName,
        genre,
        path,
        slug,
        isPrivate,
        ...fields,
      },
      defaultReturnColumns
    );
    const newTrack = tracks.pop();
    console.log(newTrack);
    return newTrack;
  } catch (e) {
    console.error(e);
  }
}

async function getTrackBySlug(trackSlug) {
  try {
    const track = await db(tableName).where({ slug: trackSlug }).first();
    console.log(track);
    return track;
  } catch (e) {
    console.error(e);
  }
}

async function getIdBySlug(trackSlug) {
  try {
    const id = await db(tableName)
      .where({ slug: trackSlug })
      .select("id")
      .first()
      .then((row) => row["id"]);
    return id;
  } catch (e) {
    console.error(e);
  }
}

async function getUserIdBySlug(trackSlug) {
  try {
    const userId = await db(tableName)
      .where({ slug: trackSlug })
      .select("userId")
      .first()
      .then((row) => row["userId"]);
    return userId;
  } catch (e) {
    console.error(e);
  }
}

async function getPrivacyBySlug(trackSlug) {
  try {
    const isPrivate = await db(tableName)
      .where({ slug: trackSlug })
      .select("isPrivate")
      .first()
      .then((row) => row["isPrivate"]);
    return isPrivate;
  } catch (e) {
    console.error(e);
  }
}

async function updateTrackPrivacy(trackSlug, privacyBool) {
  try {
    const track = await db(tableName)
      .where({ slug: trackSlug })
      .update({ isPrivate: privacyBool });
    return track;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getIdBySlug,
  create,
  getTrackBySlug,
  getUserIdBySlug,
  getPrivacyBySlug,
  updateTrackPrivacy,
};
