require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Member = require('./models/Member');

const members = [
    { name: 'Arjun Mehta', phone: '9898012345', address: 'Navrangpura, Ahmedabad' },
    { name: 'Sanjay Patel', phone: '9898012346', address: 'Satellite, Ahmedabad' },
    { name: 'Ramesh Shah', phone: '9898012347', address: 'Bopal, Ahmedabad' },
    { name: 'Mira Joshi', phone: '9898012348', address: 'Vastrapur, Ahmedabad' },
    { name: 'Vikram Solanki', phone: '9898012349', address: 'Gota, Ahmedabad' },
    { name: 'Pooja Desai', phone: '9898012350', address: 'Maninagar, Ahmedabad' },
    { name: 'Anil Rathod', phone: '9898012351', address: 'Naroda, Ahmedabad' },
    { name: 'Sneha Gupta', phone: '9898012352', address: 'Paldi, Ahmedabad' },
    { name: 'Karan Malhotra', phone: '9898012353', address: 'Thaltej, Ahmedabad' },
    { name: 'Divya Nair', phone: '9898012354', address: 'Bodakdev, Ahmedabad' }
];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Seed Admin
        await Admin.deleteMany({}); // Clear existing admins
        const admin = new Admin({
            username: 'admin',
            password: 'admin123' // Updated password
        });
        await admin.save();
        console.log('✅ Admin created: username="admin", password="admin123"');

        // 2. Seed Members
        await Member.deleteMany({}); // Clear existing members
        const insertedMembers = await Member.insertMany(members);
        console.log(`✅ Successfully inserted ${insertedMembers.length} members.`);

        console.log('\nMember List:');
        insertedMembers.forEach((m, i) => console.log(`${i + 1}. ${m.name} (${m.phone})`));

        mongoose.connection.close();
        console.log('\n✅ Database seeding completed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
