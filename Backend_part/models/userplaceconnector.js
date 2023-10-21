const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userplaceconnector', {
    placeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'place',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'userplaceconnector',
    timestamps: false,
    indexes: [
      {
        name: "placeId_idx",
        using: "BTREE",
        fields: [
          { name: "placeId" },
        ]
      },
      {
        name: "userId_idx",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
