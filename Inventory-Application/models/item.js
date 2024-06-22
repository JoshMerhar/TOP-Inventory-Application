const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    brand: { 
        type: Schema.Types.ObjectId, 
        ref: "Brand", 
        required: true 
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    price: {
        type: String,
        required: true
    },
    numInStock: {
        type: Number,
        required: true
    }
});

ItemSchema.virtual('url').get(function() {
    return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);