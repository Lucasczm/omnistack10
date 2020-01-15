module.exports = function parseStirngAsArray(arrayAsString) {
  return arrayAsString.split(',').map(tech => tech.trim());
};
