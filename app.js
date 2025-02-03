const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 4444;
const MONGO_URI = 'mongodb://127.0.0.1:27017';
const DATABASE_NAME = 'animedb';

let db;
let collection;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
async function main() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    db = client.db(DATABASE_NAME);
    collection = db.collection('anime');
}

main()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });

// Get all anime
app.get('/anime', async (req, res) => {
    try {
        const animes = await collection.find().toArray();
        res.json(animes);
    } catch (error) {
        res.status(500).send('Error fetching animes');
    }
});

// Add new anime
app.post('/anime', async (req, res) => {
    try {
        const newAnime = req.body;
        await collection.insertOne(newAnime);
        res.json({ message: 'Anime added successfully' });
    } catch (error) {
        res.status(500).send('Error adding anime');
    }
});

// Update anime
app.put('/anime/:id', async (req, res) => {
    try {
        const animeId = req.params.id;
        const updatedAnime = req.body;
        await collection.updateOne({ _id: new ObjectId(animeId) }, { $set: updatedAnime });
        res.json({ message: 'Anime updated successfully' });
    } catch (error) {
        res.status(500).send('Error updating anime');
    }
});

// Delete anime
app.delete('/anime/:id', async (req, res) => {
    try {
        const animeId = req.params.id;
        await collection.deleteOne({ _id: new ObjectId(animeId) });
        res.json({ message: 'Anime deleted successfully' });
    } catch (error) {
        res.status(500).send('Error deleting anime');
    }
});
