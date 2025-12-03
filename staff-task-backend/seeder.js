// backend/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import the User model

dotenv.config({ path: './backend/.env' }); // Make sure it finds the .env file

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

// --- MODIFIED DATA: We now use an array for scalability ---
const usersToSeed = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // The User model will automatically hash this
        role: 'admin',
    },
    {
        name: 'Kyrian Admin',
        email: 'kyrian@example.com',
        password: 'password123',
        role: 'admin',
    }
];

// Function to import data
const importData = async () => {
    await connectDB();
    try {
        const newUsers = [];
        for (const user of usersToSeed) {
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) {
                console.log(`User '${user.email}' already exists. Skipping.`);
            } else {
                newUsers.push(user);
            }
        }

        if (newUsers.length > 0) {
            // Use insertMany for efficiency if there are new users to add
            const createdUsers = await User.insertMany(newUsers);
            console.log('Data Imported! New users created:');
            createdUsers.forEach(u => console.log(`- ${u.email}`));
        } else {
            console.log('All seed users already exist in the database. Nothing to import.');
        }

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
        // Be careful: this will delete ALL users
        await User.deleteMany({});
        console.log('Data Destroyed! All users have been removed.');
        process.exit();
    } catch (error) {
        console.error(`Error destroying data: ${error.message}`);
        process.exit(1);
    }
};

// Check for command-line arguments (-d for destroy)
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}