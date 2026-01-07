require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');

const members = [
    { name: 'Rajesh Kumar', phone: '9876543210', address: 'Mumbai, Maharashtra' },
    { name: 'Priya Sharma', phone: '9876543211', address: 'Delhi, India' },
    { name: 'Amit Patel', phone: '9876543212', address: 'Ahmedabad, Gujarat' },
    { name: 'Sneha Desai', phone: '9876543213', address: 'Pune, Maharashtra' },
    { name: 'Vikram Singh', phone: '9876543214', address: 'Jaipur, Rajasthan' },
    { name: 'Kavita Reddy', phone: '9876543215', address: 'Hyderabad, Telangana' },
    { name: 'Rahul Mehta', phone: '9876543216', address: 'Surat, Gujarat' },
    { name: 'Anjali Gupta', phone: '9876543217', address: 'Bangalore, Karnataka' },
    { name: 'Suresh Rao', phone: '9876543218', address: 'Chennai, Tamil Nadu' },
    { name: 'Pooja Joshi', phone: '9876543219', address: 'Vadodara, Gujarat' },
    { name: 'Manish Verma', phone: '9876543220', address: 'Lucknow, Uttar Pradesh' },
    { name: 'Deepa Nair', phone: '9876543221', address: 'Kochi, Kerala' },
    { name: 'Karan Shah', phone: '9876543222', address: 'Rajkot, Gujarat' },
    { name: 'Ritu Kapoor', phone: '9876543223', address: 'Chandigarh, India' },
    { name: 'Anil Pandey', phone: '9876543224', address: 'Indore, Madhya Pradesh' },
    { name: 'Meera Iyer', phone: '9876543225', address: 'Coimbatore, Tamil Nadu' },
    { name: 'Sanjay Thakur', phone: '9876543226', address: 'Bhopal, Madhya Pradesh' },
    { name: 'Neha Kulkarni', phone: '9876543227', address: 'Nagpur, Maharashtra' },
    { name: 'Vishal Agarwal', phone: '9876543228', address: 'Kolkata, West Bengal' },
    { name: 'Divya Menon', phone: '9876543229', address: 'Trivandrum, Kerala' },
    { name: 'Rohit Malhotra', phone: '9876543230', address: 'Ludhiana, Punjab' },
    { name: 'Swati Bhatt', phone: '9876543231', address: 'Dehradun, Uttarakhand' },
    { name: 'Arjun Pillai', phone: '9876543232', address: 'Mangalore, Karnataka' }
];

async function seedMembers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing members
        await Member.deleteMany({});
        console.log('Cleared existing members');

        // Insert new members
        const insertedMembers = await Member.insertMany(members);
        console.log(`✅ Successfully inserted ${insertedMembers.length} members`);

        // Display the inserted members
        console.log('\nInserted Members:');
        insertedMembers.forEach((member, index) => {
            console.log(`${index + 1}. ${member.name} - ${member.phone}`);
        });

        mongoose.connection.close();
        console.log('\n✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedMembers();
