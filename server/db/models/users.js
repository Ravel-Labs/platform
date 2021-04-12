var bcrypt = require("bcrypt");

var db = require("../knex");
var Links = require("./links");

const tableName = "users";
const ROLES = {
  admin: 0,
  betaArtist: 1,
  betaUser: 2,
};
const defaultReturnColumns = [
  "id",
  "name",
  "email",
  "username",
  "displayName",
  "createdAt",
  "roleId",
  "referrerId",
  "invitesRemaining",
  "imagePath",
  "bio",
  "city",
  "country",
];

async function getUserPrivileges(roleId) {
  return await db("privileges")
    .select("type")
    .join("privilegeRoles", {
      "privilegeRoles.privilegeId": "privileges.id",
    })
    .where("privilegeRoles.roleId", roleId);
}

/**
 * Return the user with the provided email, if exists.
 * @param  {string} email
 * @return {db/User}
 */
async function getByEmail(email, fields = defaultReturnColumns) {
  const user = await db(tableName).where({ email }).select(fields).first();
  if (!user) {
    return null;
  }

  user.privileges = await getUserPrivileges(user.roleId);
  return user;
}
/**
 * Return the user with the provided id, if exists.
 * @param  {int} id
 * @param  {array} fields=defaultReturnColumns
 */
async function getById(id, fields = defaultReturnColumns) {
  return await db(tableName).where({ id }).select(fields).first();
}

/**
 * Return the user with the provided username, if exists.
 * @param  {string} username
 * @param  {array} fields=defaultReturnColumns
 */
async function getByUsername(username, fields = defaultReturnColumns) {
  return await db(tableName).where({ username }).select(fields).first();
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
  const user = await getByEmail(
    email,
    ["passwordHash"].concat(defaultReturnColumns)
  );
  if (!user) {
    return {
      user,
      isValid: false,
    };
  }
  const isValid = bcrypt.compareSync(password, user.passwordHash);
  // Remove the password hash before returning
  delete user.passwordHash;
  return { isValid, user };
}

/**
 * Creates a new user record.
 * @param  {string} email
 * @param  {string} password
 * @param  {object} fields={} Additional fields to write when creating the model record.
 * @return {db/User}
 */
async function create(
  email,
  password,
  roleId,
  referrerId,
  invitesRemaining,
  fields = {}
) {
  const passwordHash = bcrypt.hashSync(password, 10);
  const { username } = fields;
  try {
    const [user] = await db(tableName).insert(
      {
        email,
        passwordHash,
        username,
        displayName: username,
        roleId,
        referrerId,
        invitesRemaining,
        ...fields,
      },
      defaultReturnColumns
    );
    user.privileges = await getUserPrivileges(user.roleId);
    return user;
  } catch (e) {
    console.error(e);
  }
}

async function getRoleIdbyUserId(userId) {
  try {
    const roleId = await db(tableName)
      .where({ id: userId })
      .select("roleId")
      .first()
      .then((row) => row["roleId"]);
    return roleId;
  } catch (e) {
    console.error(e);
  }
}

async function decrementInvitesRemaining(userId) {
  try {
    const user = await db(tableName)
      .where({ id: userId })
      .decrement({ invitesRemaining: 1 });
    return user;
  } catch (e) {
    console.error(e);
  }
}

async function getUserInvitesRemaining(userId) {
  try {
    const invitesRemaining = await db(tableName)
      .where({ id: userId })
      .select("invitesRemaining")
      .first()
      .then((row) => row["invitesRemaining"]);
    return invitesRemaining;
  } catch (e) {
    console.error(e);
  }
}

async function updateUser(userId, userObject) {
  const returnFields = ["id", ...Object.keys(userObject)];
  try {
    const users = await db(tableName)
      .where({ id: userId })
      .update(userObject, returnFields);
    return users.pop();
  } catch (e) {
    console.error(e);
  }
}

// async function updateUserProfileField(userId, fieldName, fieldValue) {
//   try {
//     const user = await db(tableName)
//       .where({id: userId})
//       .update(fieldName, fieldValue);
//     return user;
//   } catch(e) {
//     console.error(e);
//   }
// }

module.exports = {
  create,
  decrementInvitesRemaining,
  getByEmail,
  getById,
  getByUsername,
  getRoleIdbyUserId,
  getUserInvitesRemaining,
  updateUser,
  validateCredentials,
  ROLES,
};
