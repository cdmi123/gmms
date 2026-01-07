const mongoose = require('mongoose');
const Round = require('./models/Round');
const Member = require('./models/Member');
const Payment = require('./models/Payment');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const activeRound = await Round.findOne({ status: 'collecting' });
        if (activeRound && activeRound.perMemberAmount === 0) {
            console.log('Found corrupted round:', activeRound._id);

            const members = await Member.find({ status: 'active' });
            const memberCount = members.length;
            const PER_MEMBER_AMOUNT = 5000; // Defaulting to 5000 as per common example
            const TOTAL_COLLECTION = PER_MEMBER_AMOUNT * memberCount;

            activeRound.perMemberAmount = PER_MEMBER_AMOUNT;
            activeRound.totalCollection = TOTAL_COLLECTION;
            await activeRound.save();

            console.log('Updated Round:', activeRound);

            // Update Payments too
            await Payment.updateMany(
                { roundId: activeRound._id },
                { amount: PER_MEMBER_AMOUNT }
            );
            console.log('Updated associated payments.');
        } else {
            console.log('No corrupted round found or round is valid.');
        }

        mongoose.connection.close();
    })
    .catch(err => console.error(err));
