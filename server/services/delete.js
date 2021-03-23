var S3 = require("aws-sdk/clients/s3");

var config = require("../config");

var TrackFeedbackPrompts = require("../db/models").TrackFeedbackPrompts;
var Tracks = require("../db/models").Tracks;
var TrackCredits = require("../db/models").TrackCredits;

const trackUploadFolder = "track-uploads";

async function Delete(trackSlug) {
  const track = await Tracks.getTrackBySlug(trackSlug);
  const path = track.path;
  
  const s3 = new S3({
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsAccessKeySecret,
    region: config.awsRegion,
  });
  
  const fileName = path.split("/").pop();
  const key = `${trackUploadFolder}/${fileName}`;
  const params = {
    Bucket: config.awsS3BucketName,
    Key: key
  };

  try {
    var hrstart = process.hrtime();
    const res = await s3.deleteObject(params).promise();
    var hrend = process.hrtime(hrstart);
    console.info(
      "END Delete time (hr): %ds %dms",
      hrend[0],
      hrend[1] / 1000000
    );
    
    const deletedTrack = await Tracks.deleteTrack(track);
    return deletedTrack;
  } catch(e) {
    console.error("error delete", e);
  }
}

module.exports = {
  Delete,
}