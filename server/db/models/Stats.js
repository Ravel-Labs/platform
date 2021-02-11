var db = require('../knex');

async function getFeedbackStatsByTrackId(trackId) {
	try {
    const feedbackStats = await db.raw('SELECT f."promptId", \
                                        fp.prompt,\
                                        COUNT(*) as "numberOfResponses", \
                                        AVG(f.value)::numeric(10,1) as "averageScore", \
                                        AVG(fp.scale)::numeric(10,0) as scale \
                                        FROM "feedbackPrompts" as fp \
                                        LEFT JOIN feedback as f \
                                        ON fp.id = f."promptId" \
                                        WHERE f."trackId" = ? \
                                        GROUP BY f."promptId", fp.prompt;', trackId)
                                        .then((res) => res.rows);
    console.log(feedbackStats);
    return feedbackStats;
	} catch(e) {
		console.error(e);
	}
}

async function getPlaybackStatsByTrackId(trackId) {
  try {
    const playbackStats = await db.raw('WITH cte AS (SELECT \
                                        "trackId", \
                                        "eventType", \
                                        "sessionId", \
                                        type, \
                                        CASE \
                                          WHEN "eventType" = 5 THEN ("eventData"::jsonb -> \'duration\')::float / 1000.00 \
                                          ELSE ("eventData"::jsonb -> \'currentTime\')::float \
                                        END as "trackTime", \
                                        "createdAt" \
                                        FROM events \
                                        JOIN "eventTypes" \
                                        ON events."eventType" = "eventTypes".id \
                                        WHERE "sessionId" IS NOT NULL AND "trackId" IS NOT NULL)  \
                                        SELECT \
                                          COUNT(*) FILTER (WHERE t1.sum > 30) as plays, \
                                          AVG(t1.sum)::numeric(10,2) as "averageListeningTime" \
                                        FROM \
                                          (SELECT \
                                            t."sessionId", \
                                            t."lastEventType", \
                                            SUM(ABS(t."timeDiff")) \
                                          FROM \
                                            (SELECT \
                                              "trackId", \
                                              "sessionId", \
                                              LAG(type, 1) OVER(PARTITION BY "sessionId" ORDER BY "createdAt") as "lastEventType", \
                                              "trackTime", \
                                              "trackTime" - LAG("trackTime", 1) OVER (PARTITION BY "sessionId" ORDER BY "createdAt") as "timeDiff" \
                                            FROM cte) as t \
                                          WHERE "lastEventType" = \'PLAY\' AND "trackId" = ? \
                                          GROUP BY "sessionId", "lastEventType") as t1 \
                                        GROUP BY "lastEventType";', trackId)
                                        .then((res) => res.rows);
    console.log(playbackStats);
    return playbackStats;
  } catch(e) {
    console.error(e);
  }
}

module.exports = {
  getFeedbackStatsByTrackId,
  getPlaybackStatsByTrackId,
}