const mongoose = require('mongoose');
const Round = require('./models/Round');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gmms'); // Fallback execution
        console.log("Connected to DB");

        const rounds = await Round.find().sort({ roundNumber: 1 });
        console.log("--- EXISTING ROUNDS ---");
        rounds.forEach(r => {
            console.log(`ID: ${r._id}, Round #: ${r.roundNumber}, Status: ${r.status}`);
        });
        console.log("-----------------------");

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
