require("leaked-handles").set({
  fullStack: true, // use full stack traces
  // timeout: 30000, // run every 30 seconds instead of 5.
  debugSockets: true, // pretty print tcp thrown exceptions.
});
var User = require("./users");
const db = require("../knex");

describe("users model", () => {
  const newUser = {
    name: "new new",
    email: "new@gmail.com",
    username: "newnew",
    password: "password",
    roleId: null,
    referrerId: null,
    invitesRemaining: 10,
  };
  describe("create", () => {
    test("should create new users", async (done) => {
      const user = await User.create(
        newUser.email,
        newUser.password,
        newUser.roleId,
        newUser.referrerId,
        newUser.invitesRemaining,
        { username: newUser.username }
      );
      expect(user).not.toBe(undefined);
      expect(user.email).toBe(newUser.email);
      expect(user.username).toBe(newUser.username);
      expect(user.roleId).toBe(newUser.roleId);
      expect(user.invitesRemaining).toBe(newUser.invitesRemaining);
      done();
    });
  });

  afterAll(async (done) => {
    await db.destroy();
    done();
  });
});
