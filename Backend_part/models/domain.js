const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('domain', {
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
    pictureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'picture',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'domain',
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
    ]
  });
};
