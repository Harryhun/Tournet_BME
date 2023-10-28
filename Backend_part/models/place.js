const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('place', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ratingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rating',
        key: 'id'
      }
    },
    visitors: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pictureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'picture',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    website: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'place',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "pictureId_idx",
        using: "BTREE",
        fields: [
          { name: "pictureId" },
        ]
      },
      {
        name: "ratingId_idx",
        using: "BTREE",
        fields: [
          { name: "ratingId" },
        ]
      },
    ]
  });
};
