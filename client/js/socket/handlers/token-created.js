module.exports = function tokenCreated(token) {
  document.cookie = `token=${token};path=/`;
};
