const Draw = require('../models/Draw');
const Member = require('../models/Member');
const Round = require('../models/Round');
const Payment = require('../models/Payment');

exports.getDraws = async (req, res) => {
    try {
        const draws = await Draw.find().populate('roundId').populate('winnerId').sort({ drawDate: -1 });
        const rounds = await Round.find().sort({ roundNumber: -1 });
        const activeRound = await Round.findOne({ status: 'collecting' });

        let canStartDraw = false;
        if (activeRound) {
            const pendingPayments = await Payment.countDocuments({ roundId: activeRound._id, status: 'pending' });
            if (pendingPayments === 0) {
                canStartDraw = true;
            }
        }

        res.render('admin/draws', {
            title: 'Lucky Draws',
            draws,
            rounds,
            activeRound,
            canStartDraw
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.postStartDraw = async (req, res) => {
    try {
        const { roundId, goldWeight, numberOfWinners } = req.body;
        const winnersCount = parseInt(numberOfWinners) || 1;

        // Ensure all payments are done
        const pendingPayments = await Payment.countDocuments({ roundId, status: 'pending' });
        if (pendingPayments > 0) {
            return res.status(400).send('Cannot start draw: Payments pending.');
        }

        // Logic to pick winners
        const activeMembers = await Member.find({ status: 'active' });

        if (activeMembers.length < winnersCount) {
            return res.status(400).send(`Cannot start draw: Not enough active members (${activeMembers.length}) for ${winnersCount} winners.`);
        }

        // Shuffle array to pick random winners
        const shuffled = activeMembers.sort(() => 0.5 - Math.random());
        const selectedWinners = shuffled.slice(0, winnersCount);

        const drawPromises = selectedWinners.map(winner => {
            return Draw.create({
                roundId,
                winnerId: winner._id,
                goldWeight: parseFloat(goldWeight)
            });
        });

        const savedDraws = await Promise.all(drawPromises);

        // Mark the round as COMPLETED now that the draw is done
        await Round.findByIdAndUpdate(roundId, { status: 'completed' });

        // Populate winner names for the response
        const successfulDraws = await Draw.find({ _id: { $in: savedDraws.map(d => d._id) } }).populate('winnerId');

        req.io.emit('drawReveal', { winners: successfulDraws });

        // Return JSON for the frontend to handle the animation
        res.json({ success: true, winners: successfulDraws });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
