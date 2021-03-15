var db = require("../knex");
var util = require("../../util/utils.js");

const defaultReturnColumns = [
  "id",
  "userId",
  "code",
  "createdAt",
  "grantedRoleId",
  "isClaimed",
  "invitedUserId",
];

const tableName = "inviteCodes";

async function create(userId, grantedRoleId, fields = {}) {
  try {
    const code = await util.generateCode();
    const inviteCode = await db(tableName).insert(
      {
        userId,
        grantedRoleId,
        code,
        ...fields,
      },
      defaultReturnColumns
    );
    return inviteCode[0];
  } catch (e) {
    console.error(e);
  }
}

async function claimInvite(code, invitedUserId) {
  try {
    const inviteCode = await db(tableName).where({ code: code }).update({
      isClaimed: true,
      invitedUserId: invitedUserId,
    });
    return inviteCode;
  } catch (e) {
    console.error(e);
  }
}

async function getInviteCodeInfo(code) {
  try {
    const codeInfo = await db(tableName)
      .where({ code: code })
      .select("grantedRoleId", "userId", "isClaimed")
      .first();

    if (!codeInfo) {
      return null;
    }

    const res = {
      roleId: codeInfo.grantedRoleId,
      referrerId: codeInfo.userId,
      isClaimed: codeInfo.isClaimed,
    };
    console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
}

async function getInviteCodesByUserId(userId) {
  try {
    const inviteCodes = await db(tableName).where({ userId: userId });
    return inviteCodes;
  } catch (e) {
    console.error(e);
  }
}

async function checkInviteCodeForUserId(invitedUserId, userId) {
  try {
    const check = await db(tableName).where({
      userId: userId,
      invitedUserId: invitedUserId,
    });
    if (check.length > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  create,
  claimInvite,
  getInviteCodeInfo,
  getInviteCodesByUserId,
  checkInviteCodeForUserId,
};
