const mongoose = require('mongoose');
const Round = require('./models/Round');
const Payment = require('./models/Payment');
const Draw = require('./models/Draw');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gmms');

        console.log("Clearing data...");

        const r = await Round.deleteMany({});
        console.log(`Deleted ${r.deletedCount} Rounds`);

        const p = await Payment.deleteMany({});
        console.log(`Deleted ${p.deletedCount} Payments`);

        const d = await Draw.deleteMany({});
        console.log(`Deleted ${d.deletedCount} Draws`);

        console.log("SUCCESS: Database cleared (Members and Admin retained).");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
