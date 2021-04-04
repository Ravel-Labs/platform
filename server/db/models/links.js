var db = require("../knex");

const tableName = "links";
const defaultReturnColumns = [
  "links.id AS linkId",
  "url",
  "links.name AS linkName",
  "userId"
];

async function getLinksByUsername(username, fields=defaultReturnColumns) {
  try {
    const links = await db(tableName)
      .select(fields)
      .join("users", {"users.id": `${tableName}.userId`})
      .where({"users.username": username});
    console.log(links);
    return links;
  } catch(e) {
    console.error(e);
  }
}

module.exports = {
  getLinksByUsername,
};