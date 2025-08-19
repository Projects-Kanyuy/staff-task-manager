// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import the User model

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

// Define the data to be seeded
const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123', // The User model will automatically hash this
    role: 'admin',
};

// Function to import data
const importData = async () => {
    await connectDB();
    try {
        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: adminUser.email });

        if (existingAdmin) {
            console.log('Admin user already exists. Skipping import.');
            return process.exit();
        }

        // Create the admin user
        const createdAdmin = await User.create(adminUser);

        console.log('Data imported! Admin user created:', createdAdmin.email);
        process.exit();
    } catch (error) {
        console.error(`Error importing data: ${error.message}`);
        process.exit(1);
    }
};

// Function to destroy data (useful for resetting)
const destroyData = async () => {
    await connectDB();
    try {
        await User.deleteMany({});
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error destroying data: ${error.message}`);
        process.exit(1);
    }
};

// Check for command-line arguments (-i for import, -d for destroy)
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}