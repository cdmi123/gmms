const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
    roundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Round', required: true },
    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    goldWeight: { type: Number, required: true }, // Weight in grams or whatever unit
    drawDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Draw', drawSchema);
