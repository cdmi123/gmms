require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');

const newMembers = [
    { name: 'New Member 1', phone: '9000000001', address: 'City 1' },
    { name: 'New Member 2', phone: '9000000002', address: 'City 2' },
    { name: 'New Member 3', phone: '9000000003', address: 'City 3' },
    { name: 'New Member 4', phone: '9000000004', address: 'City 4' },
    { name: 'New Member 5', phone: '9000000005', address: 'City 5' },
    { name: 'New Member 6', phone: '9000000006', address: 'City 6' },
    { name: 'New Member 7', phone: '9000000007', address: 'City 7' },
    { name: 'New Member 8', phone: '9000000008', address: 'City 8' },
    { name: 'New Member 9', phone: '9000000009', address: 'City 9' },
    { name: 'New Member 10', phone: '9000000010', address: 'City 10' }
];

async function addMembers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Insert new members
        const insertedMembers = await Member.insertMany(newMembers);
        console.log(`✅ Successfully inserted ${insertedMembers.length} members`);

        // Display the inserted members
        console.log('\nInserted Members:');
        insertedMembers.forEach((member, index) => {
            console.log(`${index + 1}. ${member.name} - ${member.phone}`);
        });

        mongoose.connection.close();
        console.log('\n✅ Database update completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding members:', error);
        process.exit(1);
    }
}

addMembers();
