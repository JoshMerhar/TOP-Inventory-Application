#! /usr/bin/env node

console.log(
    'This script populates some items, brands, and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Item = require("./models/item");
  const Category = require("./models/category");
  const Brand = require("./models/brand");
  
  const items = [];
  const categories = [];
  const brands = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createBrands();
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // brand[0] will always be the first brand submitted, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function brandCreate(index, name) {
    const brand = new Brand({ name: name });
    await brand.save();
    brands[index] = brand;
    console.log(`Added brand: ${name}`);
  }
  
  async function categoryCreate(index, name, description) {
    const categoryDetail = { name: name, description: description };
  
    const category = new Category(categoryDetail);
  
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }
  
  async function itemCreate(index, name, brand, description, category, price, numInStock) {
    const itemDetail = {
      name: name,
      brand: brand,
      description: description,
      category: category,
      price: price,
      numInStock: numInStock
    };
  
    const item = new Item(itemDetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
  }
  
  async function createBrands() {
    console.log("Adding brands");
    await Promise.all([
      brandCreate(0, "Vater"),
      brandCreate(1, "Pearl"),
      brandCreate(2, "Evans"),
      brandCreate(3, "Istanbul")
    ]);
  }
  
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate(0, "Sticks", "A variety of drum stick models for any style of playing."),
      categoryCreate(1, "Drum Sets", "Complete shell packs consisting of a bass drum, snare drum, and some number of toms."),
      categoryCreate(2, "Cymbals", "A selection of hihats, crash cymbals, ride cymbals, and beyond."),
      categoryCreate(3, "Drum Heads", "Heads for all standard drum sizes. Single-ply, 2-ply, clear, coated, and more."),
    ]);
  }
  
  async function createItems() {
    console.log("Adding items");
    await Promise.all([
      itemCreate(0,
        '5A Hickory drum sticks',
        brands[0],
        'Length: 16", Diameter: 0.57"',
        categories[0],
        "$11.99",
        24
      ),
      itemCreate(1,
        '18" Om crash cymbal',
        brands[3],
        'Diameter: 18", super thin with a dark finish, complex sound, and quick decay.',
        categories[2],
        "$425.62",
        3
      ),
      itemCreate(2,
        "Pearl Decade Maple 5-Piece Shell Pack",
        brands[1],
        '5-piece maple shell pack in Satin Brownburst finish with 10" and 12" rack toms, 16" floor tom, 22" bass drum, and 14" snare drum. Pedals and hardware not included.',
        categories[1],
        "$1,099.99",
        2
      ),
      itemCreate(3,
        '20" EMAD Bass Drum Head - Batter',
        brands[2],
        '20" 10-mil single-ply bass drum head with built-in interchangeable muffling ring.',
        categories[3],
        "$54.99",
        7
      ),
    ]);
  }
  