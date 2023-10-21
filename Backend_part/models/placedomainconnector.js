const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('placedomainconnector', {
    domainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'domain',
        key: 'id'
      }
    },
    placeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'place',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'placedomainconnector',
    timestamps: false,
    indexes: [
      {
        name: "domainId_idx",
        using: "BTREE",
        fields: [
          { name: "domainId" },
        ]
      },
      {
        name: "placeId_idx",
        using: "BTREE",
        fields: [
          { name: "placeId" },
        ]
      },
    ]
  });
};
