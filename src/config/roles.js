const allRoles = {
  user: [],
  admin: ['getUserFromToken', 'getUsers', 'manageUsers' , 'sellersForAdmin' , 'getProducts'],
  seller: ['seller', 'getUserFromToken' , 'getProducts' , 'manageProducts' ],

};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};