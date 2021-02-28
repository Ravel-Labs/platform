var bcrypt = require('bcrypt');

var db = require('../knex');

const tableName = 'users';
const ROLES = {
  "admin": 0,
  "betaArtist": 1,
  "betaUser" : 2
};
const defaultReturnColumns = [
  'id',
  'name',
  'email',
  'username',
  'displayName',
  'createdAt',
  'roleId',
  'referrerId',
  'invitesRemaining'
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
async function create(email, password, roleId, referrerId, invitesRemaining, fields={}) {
  const passwordHash = bcrypt.hashSync(password, 10);
  const { username } = fields;
  try {
    const users = await db(tableName).insert({
      email,
      passwordHash,
      username,
      displayName: username,
      roleId,
      referrerId,
      invitesRemaining,
      ...fields,
    }, defaultReturnColumns);
    console.log(users)
    return users.pop();
  } catch(e) {
    console.error(e)
  }
}

async function getRoleIdbyUserId(userId) {
  try {
    const roleId = await db(tableName).where({id:userId}).select('roleId').first().then((row) => row['roleId']);
    return roleId;
  } catch(e) {
    console.error(e);
  }
}

async function decrementInvitesRemaining(userId) {
  try {
    const user = await db(tableName).where({id:userId}).decrement({invitesRemaining: 1});
    return user;
  } catch(e) {
    console.error(e);
  }
}

async function getUserInvitesRemaining(userId) {
  try {
    const invitesRemaining = await db(tableName).where({id:userId}).select('invitesRemaining').first().then((row) => row['invitesRemaining']);
    return invitesRemaining;
  } catch(e) {
    console.error(e);
  }
}

module.exports = {
  create,
  getByEmail,
  validateCredentials,
  getRoleIdbyUserId,
  decrementInvitesRemaining,
  getUserInvitesRemaining,
  ROLES,
};
