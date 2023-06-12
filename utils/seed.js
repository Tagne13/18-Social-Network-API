const mongoose = require('mongoose');
const { User, Thought } = require('../models');
const { faker } = require('@faker-js/faker');

async function seedFakeUsers() {
    try {
        const userData = [];

        for (let i = 0; i < 10; i++) {
            const username = faker.internet.userName();
            const email = faker.internet.email();

            const user = new User({
                username, 
                email
            });

            userData.push(user);
        }

        const savedUsers = await User.create(userData);
        console.log(`${savedUsers.length} users created`);

        for (const user of savedUsers) {
            const thoughtCount = 5; 
            const thoughts = [];

            for (let i = 0; i < thoughtCount; i++) {
                const thoughtText = faker.lorem.sentence();
                const username = user.username;

                const thought = new Thought({
                    thoughtText,
                    username
                });

                thoughts.push(thought);
            };

            await Thought.create(thoughts);
            console.log(`${thoughts.length} thoughts created for ${user.username}`);

            user.thoughts = thoughts.map((thought) => thought._id);
            await user.save();
        };
    } catch (err) {
        console.log('Error seeding fake users', err);
    }
};

async function connectAndSeed() {
    try {
        await mongoose.connect('mongodb://localhost:27017/social-network-api', {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });

        console.log('Connected to the db');

        await User.createIndexes();
        await seedFakeUsers();
    } catch (err) {
        console.error('Error connecting to the db', err);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from the db');
    }
};

connectAndSeed();