const Brand = require("../models/brand");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  res.render("brand_form", { title: "Create New Brand" });
});

// Handle Brand create on POST.
exports.brand_create_post = [
  // Validate and sanitize the name field.
  body("name", "Brand name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const brand = new Brand({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("brand_form", {
        title: "Create New Brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Brand with same name already exists.
      const brandExists = await Brand.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (brandExists) {
        // Brand exists, redirect to its detail page.
        res.redirect(brandExists.url);
      } else {
        await brand.save();
        // New brand saved. Redirect to brand detail page.
        res.redirect(brand.url);
      }
    }
  }),
];

// Display Brand delete form on GET.
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
  const [brand, brandItems] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Item.find({ brand: req.params.id }).exec(),
  ]);

  if (brand === null) {
    // No results
    res.redirect('/inventory/brands');
  }

  res.render("brand_delete", { 
    title: "Delete Brand",
    brand: brand,
    brand_items: brandItems,
  });
});

// Handle Brand delete on POST.
exports.brand_delete_post = asyncHandler(async (req, res, next) => {
  const [brand, brandItems] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Item.find({ brand: req.params.id }).exec(),
  ]);

  if (brandItems.length > 0) {
    // Brand has items. Render in same way as for GET route.
    res.render("brand_delete", {
      title: "Delete Brand",
      brand: brand,
      brand_items: brandItems,
    });
    return;
  } else {
    // Brand has no items. Delete object and redirect to the list of brands.
    await Brand.findByIdAndDelete(req.body.brandid);
    res.redirect("/inventory/brands");
  }
});

// Display Brand update form on GET.
exports.brand_update_get = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id).exec();

  res.render("brand_form", {
    title: "Update Brand",
    brand: brand,
  });
});

// Handle Brand update on POST.
exports.brand_update_post = [
  body("name", "Brand name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const brand = new Brand({ 
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("brand_form", {
        title: "Create New Brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Brand with same name already exists.
      const brandExists = await Brand.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (brandExists) {
        // Brand exists, redirect to its detail page.
        res.redirect(brandExists.url);
      } else {
        const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, brand, {});
        res.redirect(updatedBrand.url);
      }
    }
  }),
];
