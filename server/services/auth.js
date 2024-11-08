var jwt = require("jsonwebtoken");

var config = require("../config");
var User = require("../db/models").User;
var Invites = require("../db/models").Invites;
var Tracks = require("../db/models").Tracks;
var TrackCredits = require("../db/models").TrackCredits;

const AUTH_TOKEN_COOKIE = "ravelPlatform";
const adminInviteCount = 1000;
const betaArtistInviteCount = 10;
const betaUserInviteCount = 0;

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

// TODO: We should key this off of role name rather than id.
function getInvitesRemaining(roleId) {
  switch (roleId) {
    case 0:
      return adminInviteCount;
    case 1:
      return betaArtistInviteCount;
    case 2:
      return betaUserInviteCount;
    default:
      return 0;
  }
}

async function Signup(userInfo, code) {
  const codeInfo = await Invites.getInviteCodeInfo(code);
  if (!codeInfo) {
    throw Error("Invalid invite code.");
  }

  const { roleId, referrerId, isClaimed } = codeInfo;
  if (isClaimed) {
    throw Error("Invite code has already been claimed");
  }

  const { email, password, username, displayName } = userInfo;
  try {
    const invitesRemaining = getInvitesRemaining(roleId);
    const user = await User.create(
      email,
      password,
      roleId,
      referrerId,
      invitesRemaining,
      { username, displayName, name: displayName }
    );
    await Invites.claimInvite(code, user.id);
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
  const isPrivate = await Tracks.getPrivacyBySlug(trackSlug);
  if (!isPrivate) {
    return { hasAccess: true, error: null };
  }

  const trackId = await Tracks.getIdBySlug(trackSlug);
  const trackUserId = await TrackCredits.getUserIdbyTrackId(trackId);
  if (listenerUserId === trackUserId) {
    return { hasAccess: true, error: null };
  }

  const check = Invites.checkInviteCodeForUserId(listenerUserId, trackUserId);
  if (check) {
    return { hasAccess: true, error: null };
  }

  const roleId = User.getRoleIdbyUserId(listenerUserId);
  if (roleId === User.ROLES.admin) {
    return { hasAccess: true, error: null };
  } else {
    return { hasAccess: false, error: null };
  }
}

module.exports = {
  Login,
  Signup,
  Validate,
  validateAccess,
  AUTH_TOKEN_COOKIE,
};
