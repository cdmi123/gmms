const mongoose = require('mongoose');

const goldStockSchema = new mongoose.Schema({
    itemName: { type: String, default: 'Gold Biscuit' },
    weight: { type: Number, required: true },
    quantity: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GoldStock', goldStockSchema);
