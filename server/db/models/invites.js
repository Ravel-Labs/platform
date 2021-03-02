var db = require('../knex');
var util = require('../../util/utils.js');

const defaultReturnColumns = [
  'id',
  'userId',
  'code',
  'createdAt',
  'grantedRoleId',
  'claimed',
  'invitedUserId'
]

const tableName = 'inviteCodes'

async function create(userId, grantedRoleId, fields={}) {
  try {
    const code = await util.generateCode()
    const inviteCode = await db(tableName).insert({
      userId,
      grantedRoleId,
      code,
      ...fields,
    }, defaultReturnColumns);
    return inviteCode;
  } catch(e) {
    console.error(e);
  }
}

async function update(code, invitedUserId) {
  try {
    const inviteCode = await db(tableName).where({code:code}).update({
      claimed: true,
      invitedUserId: invitedUserId
    })
    return inviteCode;
  } catch(e) {
    console.error(e);
  }
}

async function getReferrerIdByCode(code) {
  try {
    const referrerId = await db(tableName).where({code: code}).select('userId').first().then((row) => row['userId']);
    return referrerId;
  } catch(e) {
    console.error(e);
  }
}

async function getRoleIdByCode(code) {
  try {
    const roleId = await db(tableName).where({code: code}).select('roleId').first().then((row) => row['roleId']);
    return roleId;
  } catch(e) {
    console.error(e);
  }
}

async function getInviteCodesByUserId(userId) {
  try {
    const inviteCodes = await db(tableName).where({userId: userId});
    return inviteCodes;
  } catch(e) {
    console.error(e);
  }
}

async function checkInviteCodeForUserId(invitedUserId, userId) {
  try {
    const check = await db(tableName).where({userId: userId, invitedUserId:invitedUserId});
    if (!check) {
      return false;
    }
    return true;
  } catch(e) {
    console.error(e);
  }
}

module.exports = {
  create,
  update,
  getReferrerIdByCode,
  getRoleIdByCode,
  getInviteCodesByUserId,
  checkInviteCodeForUserId,
}