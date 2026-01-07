const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    roundNumber: { type: Number, required: true, unique: true },
    totalCollection: { type: Number, required: true },
    perMemberAmount: { type: Number, required: true },
    extraAmount: { type: Number, default: 0 },
    carryForwardFromPrevious: { type: Number, default: 0 },
    status: { type: String, enum: ['collecting', 'completed'], default: 'collecting' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Round', roundSchema);
