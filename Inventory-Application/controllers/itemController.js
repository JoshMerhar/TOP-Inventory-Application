const Item = require('../models/item');
const Category = require('../models/category');
const Brand = require('../models/brand');
const asyncHandler = require("express-async-handler");

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
  res.send("NOT IMPLEMENTED: Item create GET");
});

// Handle Item create on POST.
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item create POST");
});

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update GET");
});

// Handle Item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update POST");
});