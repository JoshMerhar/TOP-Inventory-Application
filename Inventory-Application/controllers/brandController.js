const Brand = require("../models/brand");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

// Display list of all Brands.
exports.brand_list = asyncHandler(async (req, res, next) => {
  const allBrands = await Brand.find().sort({ name: 1 }).exec();
  res.render("brand_list", {
    title: "Brand List",
    brand_list: allBrands,
  });
});

// Display each item from a specific Brand.
exports.brand_detail = asyncHandler(async (req, res, next) => {
  const [brand, itemsInBrand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Item.find({ brand: req.params.id }, "name description category").populate("category").exec(),
  ]);
  if (brand === null) {
    // No results.
    const err = new Error("Brand not found");
    err.status = 404;
    return next(err);
  }

  res.render("brand_detail", {
    title: "Brand Detail",
    brand: brand,
    brand_items: itemsInBrand,
  });
});

// Display Brand create form on GET.
exports.brand_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Brand create GET");
});

// Handle Brand create on POST.
exports.brand_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Brand create POST");
});

// Display Brand delete form on GET.
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Brand delete GET");
});

// Handle Brand delete on POST.
exports.brand_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Brand delete POST");
});

// Display Brand update form on GET.
exports.brand_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Brand update GET");
});

// Handle Brand update on POST.
exports.brand_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Brand update POST");
});
