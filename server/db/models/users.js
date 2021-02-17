var bcrypt = require('bcrypt');

var db = require('../knex');

const tableName = 'users';
const defaultReturnColumns = [
  'id',
  'name',
  'email',
  'username',
  'displayName',
  'createdAt',
];

/**
 * Return the user with the provided email, if exists.
 * @param  {string} email
 * @return {db/User}  
 */
async function getByEmail(email) {
  const user = await db(tableName).where({email}).first()
  return user;
}

/**
 * Validates login credentials against the users in our DB.
 * @param  {string}   email
 * @param  {string}   password
 * @return {object}   resp
 * @return {bool}     resp.isValid
 * @return {db/User}  resp.user
 */
async function validateCredentials(email, password) {
  const user = await getByEmail(email);
  const isValid = bcrypt.compareSync(password, user.passwordHash);
  return { isValid, user };
}

/**
 * Creates a new user record.
 * @param  {string} email
 * @param  {string} password
 * @param  {object} fields={} Additional fields to write when creating the model record. 
 * @return {db/User}
 */
async function create(email, password, fields={}) {
  const passwordHash = bcrypt.hashSync(password, 10);
  const { username } = fields;
  try {
    const newUser = await db(tableName).insert({
      email,
      passwordHash,
      username,
      displayName: username,
      ...fields,
    }, defaultReturnColumns);
    console.log(newUser)
    return newUser;
  } catch(e) {
    console.error(e)
  }
}

module.exports = {
  create,
  getByEmail,
  validateCredentials,
};
