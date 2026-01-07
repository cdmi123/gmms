const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    roundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Round', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
    paidAt: { type: Date }
});

module.exports = mongoose.model('Payment', paymentSchema);
