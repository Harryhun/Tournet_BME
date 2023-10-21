const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rating', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    oneStar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    twoStar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    threeStar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fourStar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fiveStar: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'rating',
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
    ]
  });
};
