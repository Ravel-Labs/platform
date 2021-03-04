exports.seed = function (knex) {
  return knex("tracks").insert([
    {
      trackName: "My Amazing Track",
      genre: "RnB",
      path:
        "https://ravel-platform-dev.s3.us-west-1.amazonaws.com/track-uploads/test_track-1611689045558.mpga",
      slug: "testSlug",
    },
  ]).onConflict("path").ignore();
};
