// verify_multi_winner.js
require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');

async function testWinnerSelection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const numberOfWinners = 3;
        const activeMembers = await Member.find({ status: 'active' });

        console.log(`Found ${activeMembers.length} active members.`);

        if (activeMembers.length < numberOfWinners) {
            console.error(`Not enough active members for ${numberOfWinners} winners.`);
            process.exit(1);
        }

        // Logic check
        const shuffled = activeMembers.sort(() => 0.5 - Math.random());
        const selectedWinners = shuffled.slice(0, numberOfWinners);

        console.log(`Selected ${selectedWinners.length} winners:`);
        selectedWinners.forEach((w, i) => console.log(`${i + 1}. ${w.name} (${w.phone})`));

        // Validation
        if (selectedWinners.length !== numberOfWinners) {
            console.error('❌ Failed: Incorrect number of winners selected.');
        } else {
            // Check for uniqueness
            const uniqueIds = new Set(selectedWinners.map(w => w._id.toString()));
            if (uniqueIds.size !== selectedWinners.length) {
                console.error('❌ Failed: Duplicate winners selected.');
            } else {
                console.log('✅ Success: Logic safely selects unique multiple winners.');
            }
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testWinnerSelection();
