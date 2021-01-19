var S3 = require('aws-sdk/clients/s3');

var config = require('../config')

// TODO: Move these constants.
const trackUploadFolder = "track-uploads";
const mimetypeToExtension = {
  "audio/adpcm": "adp",
  "audio/basic": "au",
  "audio/midi": "mid",
  "audio/mp4": "mp4a",
  "audio/mpeg": "mpga",
  "audio/ogg": "oga",
  "audio/vnd.dece.audio": "uva",
  "audio/vnd.digital-winds": "eol",
  "audio/vnd.dra": "dra",
  "audio/vnd.dts": "dts",
  "audio/vnd.dts.hd": "dtshd",
  "audio/vnd.lucent.voice": "lvp",
  "audio/vnd.ms-playready.media.pya": "pya",
  "audio/vnd.nuera.ecelp4800": "ecelp4800",
  "audio/vnd.nuera.ecelp7470": "ecelp7470",
  "audio/vnd.nuera.ecelp9600": "ecelp9600",
  "audio/vnd.rip": "rip",
  "audio/wav": "wav",
  "audio/webm": "weba",
  "audio/x-aac": "aac",
  "audio/x-aiff": "aif",
  "audio/x-mpegurl": "m3u",
  "audio/x-m4a": "m4a",
  "audio/x-ms-wax": "wax",
  "audio/x-ms-wma": "wma",
  "audio/x-pn-realaudio": "ram",
  "audio/x-pn-realaudio-plugin": "rmp",
  "audio/x-wav": "wav",
}

/**
 * createBucket is a helper for creating a new AWS S3 bucket.
 * @param  {aws S3} s3
 * @param  {string} bucketName
 */
const createBucket = async (s3, bucketName) => {
  try {
    const params = {
      Bucket: bucketName,
      CreateBucketConfiguration: {
        LocationConstraint: config.awsRegion,
      },
    };
    const createBucketRes = await s3.createBucket(params).promise();
    console.log("bucket created successfully", createBucketRes)
  } catch(e) {
    // Only throw an error if it's something other than the bucket already existing.
    if (e.code !== "BucketAlreadyOwnedByYou") {
      throw e
    }
    console.log("bucket already exists, moving on...")
  }
}

async function Upload(trackName, fileContent) {
  const s3 = new S3({
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsAccessKeySecret,
    region: config.awsRegion,
  });

  const allBucketData = await s3.listBuckets().promise();
  const hasTrackUploadBucket = allBucketData.Buckets.reduce((accum, { Name: name }) => {
    return (accum || name === config.awsS3BucketName)
  }, false)

  if (!hasTrackUploadBucket) {
    console.info("Creating bucket with name ", config.awsS3BucketName)
    await createBucket(s3, config.awsS3BucketName);
  }

  const extension = mimetypeToExtension[fileContent.mimetype];
  if (!extension) {
    const msg = `No extension found for mimetype ${fileContent.mimetype}`;
    console.error(msg)
    throw Error(msg)
  }

  const key = `${trackUploadFolder}/${trackName.replace(" ", "_")}-${Date.now().toString()}.${extension}`;
  const base64data = Buffer.from(fileContent.buffer, 'binary');
  const params = {
    ACL: "public-read",
    Body: base64data,
    Bucket: config.awsS3BucketName,
    Key: key,
  };

  try {
    var hrstart = process.hrtime()
    const res = await s3.upload(params).promise();
    var hrend = process.hrtime(hrstart)

    // TODO: This upload is taking quite a long time (40-80s) every so often. Why?
    console.info('END Upload time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

    // TODO: create track DB record w/ path to file

    // TODO: return new track DB record instead
    return res
  } catch(e) {
    console.error("error upload", e)
    throw e
  }
}

module.exports = {
  Upload,
};