const router = require('express').Router();
const { Tag, Product, Category, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: {
        model: Product,
        through: ProductTag,
      }
    });
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err);
  }
});
// Getting a 500 internal server error
router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Product, // Include the Product model
          through: ProductTag, // Specify the join table to use for the many-to-many relationship
          include: [Category] // Also include the Category model for each product
        }
      ]
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route to create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(
      { tag_name: req.body.tag_name },
      { where: { id: req.params.id } }
    );

    if (!updatedTag[0]) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Tag updated successfully!' });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});

// DELETE route to delete a tag by its `id`
router.delete('/:id', async (req, res) => {
  try {
    const result = await Tag.destroy({
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
