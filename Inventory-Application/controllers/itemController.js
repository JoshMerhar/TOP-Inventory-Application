const Item = require('../models/item');
const Category = require('../models/category');
const Brand = require('../models/brand');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
    // Get details of items, categories, and brand counts (in parallel)
    const [
      itemCount,
      categoryCount,
      brandCount,
    ] = await Promise.all([
      Item.countDocuments({}).exec(),
      Category.countDocuments({}).exec(),
      Brand.countDocuments({}).exec(),
    ]);
  
    res.render("index", {
      title: "Micro Drum Shop",
      item_count: itemCount,
      category_count: categoryCount,
      brand_count: brandCount,
    });
  });

// Display list of all Items.
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().sort({ name: 1 }).populate("brand").exec();
  res.render("item_list", {
    title: "Item List",
    item_list: allItems,
  });
});

// Display detail page for a specific Item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("brand").populate("category").exec();

  if (item === null) {
    // No results.
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    title: item.name,
    item: item,
  });
});

// Display Item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const [allBrands, allCategories] = await Promise.all([
    Brand.find().sort({ name: 1 }).exec(),
    Category.find().sort({ name: 1 }).exec(),
  ])
  res.render("item_form", { 
    title: "Create New Item", 
    brands: allBrands,
    categories: allCategories,
  });
});

// Handle Item create on POST.
exports.item_create_post = [
  body("name", "Name must be at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("brand", "Pick a brand.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Pick a category.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("numInStock", "Stock amount must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      numInStock: req.body.numInStock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all brands and categories for form.
      const [allBrands, allCategories] = await Promise.all([
        Brand.find().sort({ name: 1 }).exec(),
        Category.find().sort({ name: 1 }).exec(),
      ]);

      res.render("item_form", {
        title: "Create New Item",
        brands: allBrands,
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await item.save();
      res.redirect(item.url);
    }
  }),
];

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  res.render("item_delete", {
    title: "Delete Item",
    item: item,
  });
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemid).exec();
  res.redirect('/inventory/items');
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allBrands, allCategories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Brand.find().sort({ name: 1 }).exec(),
    Category.find().sort({ name: 1 }),
  ]);

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_form", {
    title: "Update Item",
    item: item,
    brands: allBrands,
    categories: allCategories,
  });
});

// Handle Item update on POST.
exports.item_update_post = [
  body("name", "Name must be at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("brand", "Pick a brand.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Pick a category.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("numInStock", "Stock amount must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      numInStock: req.body.numInStock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all brands and categories for form.
      const [allBrands, allCategories] = await Promise.all([
        Brand.find().sort({ name: 1 }).exec(),
        Category.find().sort({ name: 1 }).exec(),
      ]);

      res.render("item_form", {
        title: "Create New Item",
        brands: allBrands,
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save updated item.
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  }),
];