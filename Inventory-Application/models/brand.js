const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
});

BrandSchema.virtual('url').get(function() {
    return `/inventory/brand/${this._id}`;
});

module.exports = mongoose.model('Brand', BrandSchema);