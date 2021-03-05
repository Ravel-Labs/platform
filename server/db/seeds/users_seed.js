var bcrypt = require('bcrypt');
var config = require('../../config')

function createPasswordHash(password) {
  return bcrypt.hashSync(password, 10);
}

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          // id: 0,
          name: 'Garrett', 
          email: "garrett@ravelmusic.io",
          // passwordHash: createPasswordHash(config.ADMIN_PASSWORD),
          passwordHash: createPasswordHash("admin"),
          username: 'g2ransom', 
          displayName: 'Garrett',
          createdAt: new Date().toISOString(), 
          roleId: 0,
          referrerId: null,
          invitesRemaining: 1000  
        },
        {
          // id: 1,
          name: 'Mark', 
          email: "mark@ravelmusic.io",
          // passwordHash: createPasswordHash(config.ADMIN_PASSWORD),
          passwordHash: createPasswordHash("admin"),
          username: 'mark', 
          displayName: 'Mark',
          createdAt: new Date().toISOString(), 
          roleId: 0,
          referrerId: null,
          invitesRemaining: 1000  
        },
        {
          // id: 2,
          name: 'Gaelen', 
          email: "gaelen@ravelmusic.io",
          // passwordHash: createPasswordHash(config.ADMIN_PASSWORD),
          passwordHash: createPasswordHash("admin"),
          username: 'gaelen', 
          displayName: 'Gaelen',
          createdAt: new Date().toISOString(), 
          roleId: 0,
          referrerId: null,
          invitesRemaining: 1000  
        }
      ]);
    });
};
