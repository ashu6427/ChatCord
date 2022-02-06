const users = [];

//user joining chat
function userJoin(id, username, room) {
  const user = { id: id, username: username, room: room };

  users.push(user);
  return user;
}

//getting current user from chat
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//when user leaves chat
function userLeave(id) {
  const index = users.find((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
