var jwt = require("jsonwebtoken");

var config = require("../config");
var User = require("../db/models").User;
var Invites = require("../db/models").Invites;
var Tracks = require("../db/models").Tracks;

const AUTH_TOKEN_COOKIE = "ravelPlatform";

function createToken(email, userId) {
  try {
    return jwt.sign({ email, userId }, config.jwtSecret, { expiresIn: "30d" });
  } catch (e) {
    console.error(e);
  }
}

async function Login(email, password) {
  const { isValid, user } = await User.validateCredentials(email, password);
  if (!isValid) {
    throw Error("Invalid login credentials.");
  }
  const userId = user.id;
  const token = createToken(email, userId);
  return {
    token,
    user,
  };
}

function createInvitesRemaining(roleId) {
  try {
    let invitesRemaining;
    if (roleId == 0) {
      invitesRemaining = 1000;
    } else if (roleId == 1) {
      invitesRemaining = 10;
    } else {
      invitesRemaining = 0;
    }
    return invitesRemaining;
  } catch (e) {
    console.error(e);
  }
}

async function Signup(email, username, password, code) {
  try {
    // MB TODO: Uncomment once frontend support is added.
    // const {roleId, referrerId, isClaimed} = await Invites.getInviteCodeInfo(code);
    // if (isClaimed) {
    //   throw Error('Invite code has already been claimed');
    // }
    // const invitesRemaining = createInvitesRemaining(roleId);
    const invitesRemaining = 10;
    const roleId = 1;
    const referrerId = 1;
    const user = await User.create(
      email,
      password,
      roleId,
      referrerId,
      invitesRemaining,
      { username }
    );
    // MB TODO: Uncomment once frontend support is added.
    // const claimedInvite = await Invites.claimInvite(code, user.id);
    const token = createToken(email, user.id);
    return {
      token,
      user,
    };
  } catch (e) {
    return console.error(e);
  }
}

function Validate(token) {
  try {
    var decoded = jwt.verify(token, config.jwtSecret);
    return {
      isValid: true,
      error: null,
      userEmail: decoded.email,
      userId: decoded.userId,
    };
  } catch (err) {
    return { isValid: false, error: err };
  }
}

async function validateAccess(listenerUserId, trackSlug) {
  try {
    const isPrivate = await Tracks.getPrivacyBySlug(trackSlug);
    if (!isPrivate) {
      return { hasAccess: true, error: null };
    }
    const trackUserId = await Tracks.getUserIdBySlug(trackSlug);
    const check = Invites.checkInviteCodeForUserId(listenerUserId, trackUserId);
    const roleId = User.getRoleIdbyUserId(listenerUserId);
    if (!check && roleId !== User.ROLES.admin) {
      return { hasAccess: false, error: null };
    } else {
      return { hasAccess: true, error: null };
    }
  } catch (err) {
    return { hasAccess: false, error: err };
  }
}

module.exports = {
  Login,
  Signup,
  Validate,
  validateAccess,
  AUTH_TOKEN_COOKIE,
};
