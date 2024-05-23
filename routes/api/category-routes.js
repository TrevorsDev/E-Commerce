const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const categoryData = await Category.findOne({
      where: { id: req.params.id },
      include: [{ model: Product }]
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(
      { category_name: req.body.category_name },
      { where: { id: req.params.id } }
    );

    if (!updatedCategory[0]) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Tag updated successfully!' });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Category.destroy({
      where: { id: req.params.id }
    });

    if (!result) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted successfully!' });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

module.exports = router;