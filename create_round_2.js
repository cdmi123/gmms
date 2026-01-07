const mongoose = require('mongoose');
const Round = require('./models/Round');
const Member = require('./models/Member');
const Payment = require('./models/Payment');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gmms');

        // Check if Round 2 exists
        const existingRound2 = await Round.findOne({ roundNumber: 2 });
        if (existingRound2) {
            console.log("Round 2 already exists!");
            process.exit(0);
        }

        const members = await Member.find({ status: 'active' });

        // Create Round 2
        const newRound = await Round.create({
            roundNumber: 2,
            totalCollection: 5000,
            perMemberAmount: 100,
            status: 'collecting'
        });
        console.log("Created Round 2 with ID:", newRound._id);

        // Payments (Optional for this test, but good for consistency)
        const payments = members.map(m => ({
            memberId: m._id,
            roundId: newRound._id,
            amount: 100,
            status: 'pending'
        }));
        await Payment.insertMany(payments);
        console.log("Created payments for Round 2");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
