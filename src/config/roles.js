const allRoles = {
  user: [],
  admin: ['getUserFromToken', 'getUsers', 'manageUsers'],
  seller: ['getUserFromToken'],

};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
