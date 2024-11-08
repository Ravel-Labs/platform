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
  "imagePath",
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

async function deleteById(trackId) {
  try {
    await db("trackCredits").where({ trackId: trackId }).del();
    await db("trackFeedbackPrompts").where({ trackId: trackId }).del();
    await db("events").where({ trackId: trackId }).del();
    await db("sessions").where({ trackId: trackId }).del();
    const deletedTrack = await db(tableName).where({ id: trackId }).del();
    return deletedTrack;
  } catch (e) {
    console.error(e);
  }
}

async function getTrackBySlug(trackSlug) {
  try {
    const track = await db(tableName).where({ slug: trackSlug }).first();
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

async function getFeaturedTracks(privateTracksAllowedUserIds) {
  // TODO: We should return a nested 'artist' object within each track with these
  // properties rather than adding these fields at the top-level.
  const fields = {
    artist: "users.displayName",
    username: "users.username",
    userId: "users.id",
  };
  defaultReturnColumns.forEach((name) => (fields[name] = `tracks.${name}`));
  try {
    let tracks = await db(tableName)
      .select(fields)
      .join("trackCredits", { "trackCredits.trackId": "tracks.id" })
      .join("users", { "users.id": "trackCredits.userId" })
      .where({ isPrivate: false })
      .orderBy("createdAt", "desc")
      .limit(20);

    // Add private tracks from privateTracksAllowedUserIds.
    // TODO: could probably find a way to combine this with above query so we only hit the DB once.
    if (privateTracksAllowedUserIds.length) {
      const viewablePrivateTracks = await db(tableName)
        .select(fields)
        .join("trackCredits", { "trackCredits.trackId": "tracks.id" })
        .join("users", { "users.id": "trackCredits.userId" })
        .where({ isPrivate: true })
        .whereIn("userId", privateTracksAllowedUserIds)
        .orderBy("createdAt", "desc")
        .limit(20);

      tracks = tracks.concat(viewablePrivateTracks);
    }

    return tracks;
  } catch (e) {
    console.error(e);
  }
}

async function filterByUsername(username) {
  const fields = {
    artist: "users.displayName",
    userId: "users.id",
    username: "users.username",
  };
  defaultReturnColumns.forEach((name) => (fields[name] = `tracks.${name}`));
  try {
    const tracks = await db(tableName)
      .select(fields)
      .join("trackCredits", { "trackCredits.trackId": "tracks.id" })
      .join("users", { "users.id": "trackCredits.userId" })
      .where({ "users.username": username })
      .orderBy("createdAt", "desc");
    return tracks;
  } catch (e) {
    console.error(e);
  }
}

async function updateTrackImage(trackSlug, trackImagePath) {
  try {
    const tracks = await db(tableName)
      .where({ slug: trackSlug })
      .update({ imagePath: trackImagePath });
    return tracks;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  create,
  deleteById,
  filterByUsername,
  getFeaturedTracks,
  getIdBySlug,
  getPrivacyBySlug,
  getTrackBySlug,
  getUserIdBySlug,
  updateTrackImage,
  updateTrackPrivacy,
};
