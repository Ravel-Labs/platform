var db = require("../knex");

const tableName = "links";
const defaultReturnColumns = ["id", "url", "name", "type", "userId"];

async function getByUsername(username, fields = defaultReturnColumns) {
  try {
    const links = await db(tableName)
      .select(fields)
      .join("users", { "users.id": `${tableName}.userId` })
      .where({ "users.username": username });
    console.log(links);
    return links;
  } catch (e) {
    console.error(e);
  }
}

async function bulkCreate(toCreate) {
  try {
    const links = await db(tableName).insert(toCreate, defaultReturnColumns);
    return links;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getByUsername,
  bulkCreate,
};
