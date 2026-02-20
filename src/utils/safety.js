// Small helper utilities
const ensure = (v, msg) => {
  if (!v) throw new Error(msg);
};

module.exports = { ensure };
