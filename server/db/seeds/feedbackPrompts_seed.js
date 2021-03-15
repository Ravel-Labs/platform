const defaultScale = 10;
const defaultType = "numeric";
const prompts = [
  "How likely would you be to share this track with a friend?",
  "How excited are you to hear another track from me?",
  "How close is this song to sounding professional quality?",
  "How likely would you be to pre-save this track?",
  "How unique does this track sound compared to other tracks in the genre?",
  "How would you rate this track?",
  "How likely are you to listen to this track again?",
];

const allPrompts = prompts.map((prompt, i) => ({
  id: i + 1,
  type: defaultType,
  prompt,
  scale: defaultScale,
}));

exports.seed = function (knex) {
  return knex("feedbackPrompts").insert(allPrompts).onConflict("id").ignore();
};
