const express = require('express');
const router = express.Router();
const { Item } = require('../models/Item');
const { Sequelize } = require('sequelize');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new item
router.post('/', async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search items
router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const items = await Item.findAll({
      where: {
        [Sequelize.Op.or]: [
          { name: { [Sequelize.Op.like]: `%${query}%` } },
          { description: { [Sequelize.Op.like]: `%${query}%` } },
          { tags: { [Sequelize.Op.like]: `%${query}%` } }
        ]
      }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 