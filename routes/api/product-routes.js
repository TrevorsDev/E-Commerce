const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [
        { model: Category },
        {
          model: Tag,
          through: ProductTag
        },
      ]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get one product
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

// create new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(200).json(newProduct);
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});
// update product
// router.put('/:id', (req, res) => {
//   // update product data
//   Product.update(req.body, {
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((product) => {
//       if (req.body.tagIds && req.body.tagIds.length) {

//         ProductTag.findAll({
//           where: { product_id: req.params.id }
//         }).then((productTags) => {
//           // create filtered list of new tag_ids
//           const productTagIds = productTags.map(({ tag_id }) => tag_id);
//           const newProductTags = req.body.tagIds
//             .filter((tag_id) => !productTagIds.includes(tag_id))
//             .map((tag_id) => {
//               return {
//                 product_id: req.params.id,
//                 tag_id,
//               };
//             });

//           // figure out which ones to remove
//           const productTagsToRemove = productTags
//             .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
//             .map(({ id }) => id);
//           // run both actions
//           return Promise.all([
//             ProductTag.destroy({ where: { id: productTagsToRemove } }),
//             ProductTag.bulkCreate(newProductTags),
//           ]);
//         });
//       }

//       return res.json(product);
//     })
//     .catch((err) => {
//       // console.log(err);
//       res.status(400).json(err);
//     });
// });

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(
      { product_name: req.body.product_name },
      { where: { id: req.params.id } }
    );

    if (!updatedProduct[0]) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Tag updated successfully!' });
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: 'Internal server error', error: err });
  }
});
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedTag = await Tag.update(
//       { tag_name: req.body.tag_name },
//       { where: { id: req.params.id } }
//     );

//     if (!updatedTag[0]) {
//       res.status(404).json({ message: 'No tag found with this id!' });
//       return;
//     }

//     res.status(200).json({ message: 'Tag updated successfully!' });
//   } catch (err) {
//     console.error(err);  // Log the error for debugging
//     res.status(500).json({ message: 'Internal server error', error: err });
//   }
// });
router.delete('/:id', async (req, res) => {
  try {
    const deleteData = await Product.findOne({
      where: {
        id: req.params.id,
      }
    });
    if (deleteData) {
      await deleteData.destroy();
      res.status(200).json(deleteData);
      return;
    }

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
