const mongoose = require('mongoose');
const Round = require('./models/Round');
const Payment = require('./models/Payment');
const Member = require('./models/Member');
require('dotenv').config();

async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const activeRound = await Round.findOne({ status: 'collecting' });
        console.log("Active Round:", activeRound);

        if (activeRound) {
            const payments = await Payment.find({ roundId: activeRound._id });
            console.log(`Payments count for active round: ${payments.length}`);
            if (payments.length === 0) {
                console.log("WARNING: Zero payments found for active round!");
            }
        } else {
            console.log("No active round found.");
            // Check most recent round
            const recentRound = await Round.findOne().sort({ createdAt: -1 });
            console.log("Most recent round:", recentRound);
        }

        const activeMembers = await Member.find({ status: 'active' });
        console.log(`Active Members count: ${activeMembers.length}`);

        const allMembers = await Member.find({});
        console.log(`Total Members count: ${allMembers.length}`);

        if (activeMembers.length === 0 && allMembers.length > 0) {
            console.log("All members are inactive. This explains why no payments were generated.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
}

verify();
