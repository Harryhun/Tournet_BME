var DataTypes = require("sequelize").DataTypes;
var _domain = require("./domain");
var _picture = require("./picture");
var _place = require("./place");
var _placedomainconnector = require("./placedomainconnector");
var _rating = require("./rating");
var _role = require("./role");
var _suggestion = require("./suggestion");
var _user = require("./user");
var _userplaceconnector = require("./userplaceconnector");

function initModels(sequelize) {
  var domain = _domain(sequelize, DataTypes);
  var picture = _picture(sequelize, DataTypes);
  var place = _place(sequelize, DataTypes);
  var placedomainconnector = _placedomainconnector(sequelize, DataTypes);
  var rating = _rating(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var suggestion = _suggestion(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var userplaceconnector = _userplaceconnector(sequelize, DataTypes);

  placedomainconnector.belongsTo(domain, { as: "domain", foreignKey: "domainId"});
  domain.hasMany(placedomainconnector, { as: "placedomainconnectors", foreignKey: "domainId"});
  suggestion.belongsTo(domain, { as: "domain", foreignKey: "domainId"});
  domain.hasMany(suggestion, { as: "suggestions", foreignKey: "domainId"});
  domain.belongsTo(picture, { as: "picture", foreignKey: "pictureId"});
  picture.hasMany(domain, { as: "domains", foreignKey: "pictureId"});
  place.belongsTo(picture, { as: "picture", foreignKey: "pictureId"});
  picture.hasMany(place, { as: "places", foreignKey: "pictureId"});
  placedomainconnector.belongsTo(place, { as: "place", foreignKey: "placeId"});
  place.hasMany(placedomainconnector, { as: "placedomainconnectors", foreignKey: "placeId"});
  userplaceconnector.belongsTo(place, { as: "place", foreignKey: "placeId"});
  place.hasMany(userplaceconnector, { as: "userplaceconnectors", foreignKey: "placeId"});
  place.belongsTo(rating, { as: "rating", foreignKey: "ratingId"});
  rating.hasMany(place, { as: "places", foreignKey: "ratingId"});
  user.belongsTo(role, { as: "role", foreignKey: "roleId"});
  role.hasMany(user, { as: "users", foreignKey: "roleId"});
  suggestion.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(suggestion, { as: "suggestions", foreignKey: "userId"});
  userplaceconnector.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(userplaceconnector, { as: "userplaceconnectors", foreignKey: "userId"});

  return {
    domain,
    picture,
    place,
    placedomainconnector,
    rating,
    role,
    suggestion,
    user,
    userplaceconnector,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
