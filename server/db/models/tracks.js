var db = require("../knex");

const tableName = "tracks";

const defaultReturnColumns = [
  "id",
  "title",
  "createdAt",
  "genre",
  "path",
  "slug",
  "isPrivate",
];

async function create(title, path, genre, additionalFields = {}) {
  try {
    const tracks = await db(tableName).insert(
      {
        title,
        genre,
        path,
        ...additionalFields,
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

async function getFeaturedTracks() {
  const fields = {
    artist: "users.displayName",
  };
  defaultReturnColumns.forEach((name) => (fields[name] = `tracks.${name}`));
  try {
    const tracks = await db(tableName)
      .select(fields)
      .join("trackCredits", { "trackCredits.trackId": "tracks.id" })
      .join("users", { "users.id": "trackCredits.userId" })
      .where({ isPrivate: false })
      .orderBy("createdAt", "desc")
      .limit(20);
    return tracks;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  create,
  getFeaturedTracks,
  getIdBySlug,
  getPrivacyBySlug,
  getTrackBySlug,
  getUserIdBySlug,
  updateTrackPrivacy,
};
