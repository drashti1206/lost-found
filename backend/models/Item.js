const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  location: DataTypes.STRING,
  date: DataTypes.DATE,
  images: DataTypes.TEXT,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  contactInfo: DataTypes.STRING,
  category: DataTypes.STRING,
  reward: DataTypes.DECIMAL,
  tags: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('tags');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value));
    }
  },
  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT
});

module.exports = { Item }; 