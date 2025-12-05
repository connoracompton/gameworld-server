const express = require('express');
const cors = require('cors');
const path = require('path');
const Joi = require('joi');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gameworld';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ============================================
// MONGOOSE SCHEMAS
// ============================================

const gameSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^[a-z0-9-]+$/
  },
  name: { 
    type: String, 
    required: true,
    minlength: 2,
    maxlength: 100
  },
  price: { 
    type: Number, 
    required: true,
    min: 0,
    max: 999.99
  },
  genre: { 
    type: String, 
    required: true,
    minlength: 2,
    maxlength: 50
  },
  platform: { 
    type: String, 
    required: true,
    minlength: 2,
    maxlength: 100
  },
  rating: { 
    type: String, 
    required: true,
    enum: ['E', 'E10+', 'T', 'M', 'AO']
  },
  image: { 
    type: String, 
    required: true
  },
  description: { 
    type: String, 
    required: true,
    minlength: 10,
    maxlength: 500
  }
}, { timestamps: true });

const consoleSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^[a-z0-9-]+$/
  },
  name: { 
    type: String, 
    required: true,
    minlength: 2,
    maxlength: 100
  },
  price: { 
    type: Number, 
    required: true,
    min: 0,
    max: 9999.99
  },
  image: { 
    type: String, 
    required: true
  },
  description: { 
    type: String, 
    required: true,
    minlength: 10,
    maxlength: 500
  },
  manufacturer: { 
    type: String, 
    required: true,
    minlength: 2,
    maxlength: 50
  },
  release_year: { 
    type: Number, 
    required: true,
    min: 1970,
    max: new Date().getFullYear() + 2
  }
}, { timestamps: true });

const collectibleSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^[a-z0-9-]+$/
  },
  name: { 
    type: String, 
    required: true,
    minlength: 2,
    maxlength: 100
  },
  price: { 
    type: Number, 
    required: true,
    min: 0,
    max: 9999.99
  },
  image: { 
    type: String, 
    required: true
  },
  description: { 
    type: String, 
    required: true,
    minlength: 10,
    maxlength: 500
  },
  rarity: { 
    type: String, 
    required: true,
    enum: ['Common', 'Uncommon', 'Rare', 'Limited Edition', 'Reproduction']
  },
  height: { 
    type: String,
    maxlength: 50
  },
  size: { 
    type: String,
    maxlength: 50
  },
  condition: { 
    type: String,
    maxlength: 50
  }
}, { timestamps: true });

// Create Models
const Game = mongoose.model('Game', gameSchema);
const Console = mongoose.model('Console', consoleSchema);
const Collectible = mongoose.model('Collectible', collectibleSchema);

// ============================================
// JOI VALIDATION SCHEMAS
// ============================================

const gameJoiSchema = Joi.object({
  id: Joi.string().required().lowercase().pattern(/^[a-z0-9-]+$/),
  name: Joi.string().required().min(2).max(100),
  price: Joi.number().required().min(0).max(999.99),
  genre: Joi.string().required().min(2).max(50),
  platform: Joi.string().required().min(2).max(100),
  rating: Joi.string().required().valid('E', 'E10+', 'T', 'M', 'AO'),
  image: Joi.string().uri().required(),
  description: Joi.string().required().min(10).max(500)
});

const gameUpdateJoiSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().min(0).max(999.99).required(),
  genre: Joi.string().min(2).max(50).required(),
  platform: Joi.string().min(2).max(100).required(),
  rating: Joi.string().valid('E', 'E10+', 'T', 'M', 'AO').required(),
  image: Joi.string().uri().required(),
  description: Joi.string().min(10).max(500).required()
});

const consoleJoiSchema = Joi.object({
  id: Joi.string().required().lowercase().pattern(/^[a-z0-9-]+$/),
  name: Joi.string().required().min(2).max(100),
  price: Joi.number().required().min(0).max(9999.99),
  image: Joi.string().uri().required(),
  description: Joi.string().required().min(10).max(500),
  manufacturer: Joi.string().required().min(2).max(50),
  release_year: Joi.number().integer().min(1970).max(new Date().getFullYear() + 2)
});

const consoleUpdateJoiSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().min(0).max(9999.99).required(),
  image: Joi.string().uri().required(),
  description: Joi.string().min(10).max(500).required(),
  manufacturer: Joi.string().min(2).max(50).required(),
  release_year: Joi.number().integer().min(1970).max(new Date().getFullYear() + 2).required()
});

const collectibleJoiSchema = Joi.object({
  id: Joi.string().required().lowercase().pattern(/^[a-z0-9-]+$/),
  name: Joi.string().required().min(2).max(100),
  price: Joi.number().required().min(0).max(9999.99),
  image: Joi.string().uri().required(),
  description: Joi.string().required().min(10).max(500),
  rarity: Joi.string().required().valid('Common', 'Uncommon', 'Rare', 'Limited Edition', 'Reproduction'),
  height: Joi.string().optional().max(50).allow(''),
  size: Joi.string().optional().max(50).allow(''),
  condition: Joi.string().optional().max(50).allow('')
});

const collectibleUpdateJoiSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().min(0).max(9999.99).required(),
  image: Joi.string().uri().required(),
  description: Joi.string().min(10).max(500).required(),
  rarity: Joi.string().valid('Common', 'Uncommon', 'Rare', 'Limited Edition', 'Reproduction').required(),
  height: Joi.string().optional().max(50).allow(''),
  size: Joi.string().optional().max(50).allow(''),
  condition: Joi.string().optional().max(50).allow('')
});

// ============================================
// IMAGE UPLOAD ROUTE
// ============================================

app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }
    
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// GAMES ROUTES
// ============================================

// GET all games
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single game
app.get('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.id });
    if (game) {
      res.json(game);
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new game
app.post('/api/games', async (req, res) => {
  const { error, value } = gameJoiSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  try {
    const existingGame = await Game.findOne({ id: value.id });
    if (existingGame) {
      return res.status(400).json({ 
        success: false, 
        error: 'A game with this ID already exists' 
      });
    }

    const newGame = new Game(value);
    await newGame.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Game added successfully',
      data: newGame 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT - Update a game
app.put('/api/games/:id', async (req, res) => {
  const { error, value } = gameUpdateJoiSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false,
      error: error.details[0].message 
    });
  }
  
  try {
    const updatedGame = await Game.findOneAndUpdate(
      { id: req.params.id },
      value,
      { new: true, runValidators: true }
    );
    
    if (!updatedGame) {
      return res.status(404).json({ 
        success: false,
        error: 'Game not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Game updated successfully',
      data: updatedGame 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE - Remove a game
app.delete('/api/games/:id', async (req, res) => {
  try {
    const deletedGame = await Game.findOneAndDelete({ id: req.params.id });
    
    if (!deletedGame) {
      return res.status(404).json({ 
        success: false,
        error: 'Game not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Game deleted successfully',
      data: deletedGame 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// CONSOLES ROUTES
// ============================================

// GET all consoles
app.get('/api/consoles', async (req, res) => {
  try {
    const consoles = await Console.find().sort({ createdAt: -1 });
    res.json(consoles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single console
app.get('/api/consoles/:id', async (req, res) => {
  try {
    const console = await Console.findOne({ id: req.params.id });
    if (console) {
      res.json(console);
    } else {
      res.status(404).json({ error: 'Console not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new console
app.post('/api/consoles', async (req, res) => {
  const { error, value } = consoleJoiSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  try {
    const existingConsole = await Console.findOne({ id: value.id });
    if (existingConsole) {
      return res.status(400).json({ 
        success: false, 
        error: 'A console with this ID already exists' 
      });
    }

    const newConsole = new Console(value);
    await newConsole.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Console added successfully',
      data: newConsole 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT - Update a console
app.put('/api/consoles/:id', async (req, res) => {
  const { error, value } = consoleUpdateJoiSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false,
      error: error.details[0].message 
    });
  }
  
  try {
    const updatedConsole = await Console.findOneAndUpdate(
      { id: req.params.id },
      value,
      { new: true, runValidators: true }
    );
    
    if (!updatedConsole) {
      return res.status(404).json({ 
        success: false,
        error: 'Console not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Console updated successfully',
      data: updatedConsole 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE - Remove a console
app.delete('/api/consoles/:id', async (req, res) => {
  try {
    const deletedConsole = await Console.findOneAndDelete({ id: req.params.id });
    
    if (!deletedConsole) {
      return res.status(404).json({ 
        success: false,
        error: 'Console not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Console deleted successfully',
      data: deletedConsole 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// COLLECTIBLES ROUTES
// ============================================

// GET all collectibles
app.get('/api/collectibles', async (req, res) => {
  try {
    const collectibles = await Collectible.find().sort({ createdAt: -1 });
    res.json(collectibles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single collectible
app.get('/api/collectibles/:id', async (req, res) => {
  try {
    const collectible = await Collectible.findOne({ id: req.params.id });
    if (collectible) {
      res.json(collectible);
    } else {
      res.status(404).json({ error: 'Collectible not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new collectible
app.post('/api/collectibles', async (req, res) => {
  const { error, value } = collectibleJoiSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  try {
    const existingCollectible = await Collectible.findOne({ id: value.id });
    if (existingCollectible) {
      return res.status(400).json({ 
        success: false, 
        error: 'A collectible with this ID already exists' 
      });
    }

    const newCollectible = new Collectible(value);
    await newCollectible.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Collectible added successfully',
      data: newCollectible 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT - Update a collectible
app.put('/api/collectibles/:id', async (req, res) => {
  const { error, value } = collectibleUpdateJoiSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false,
      error: error.details[0].message 
    });
  }
  
  try {
    const updatedCollectible = await Collectible.findOneAndUpdate(
      { id: req.params.id },
      value,
      { new: true, runValidators: true }
    );
    
    if (!updatedCollectible) {
      return res.status(404).json({ 
        success: false,
        error: 'Collectible not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Collectible updated successfully',
      data: updatedCollectible 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE - Remove a collectible
app.delete('/api/collectibles/:id', async (req, res) => {
  try {
    const deletedCollectible = await Collectible.findOneAndDelete({ id: req.params.id });
    
    if (!deletedCollectible) {
      return res.status(404).json({ 
        success: false,
        error: 'Collectible not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Collectible deleted successfully',
      data: deletedCollectible 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// SEED DATABASE (Development only)
// ============================================

app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await Game.deleteMany({});
    await Console.deleteMany({});
    await Collectible.deleteMany({});

    // Seed games
    const games = [
      {
        id: 'mystic-realms',
        name: 'Mystic Realms',
        price: 49.99,
        genre: 'RPG',
        platform: 'PS5, Xbox, PC',
        rating: 'E10+',
        image: 'https://gameworld-server.onrender.com/images/mystic-realms.png',
        description: 'Step into the enchanted world of Mystic Realms, where mystery and adventure collide.'
      },
      {
        id: 'arcade-legends',
        name: 'Arcade Legends',
        price: 29.99,
        genre: 'Arcade',
        platform: 'Switch, PC',
        rating: 'E',
        image: 'https://gameworld-server.onrender.com/images/arcade-legends.png',
        description: 'Relive the golden age of gaming with Arcade Legends.'
      }
    ];

    const consoles = [
      {
        id: 'next-gen',
        name: 'Next-Gen Console',
        price: 499.99,
        image: 'https://gameworld-server.onrender.com/images/next-gen.jpg',
        description: 'Experience the future of gaming with the Next Gen Console.',
        manufacturer: 'Sony',
        release_year: 2024
      }
    ];

    const collectibles = [
      {
        id: 'limited-figure',
        name: 'Limited Edition Figure',
        price: 89.99,
        image: 'https://gameworld-server.onrender.com/images/limited-edition-figurine.png',
        description: 'Own a piece of gaming history.',
        rarity: 'Limited Edition',
        height: '12 inches'
      }
    ];

    await Game.insertMany(games);
    await Console.insertMany(consoles);
    await Collectible.insertMany(collectibles);

    res.json({ 
      success: true, 
      message: 'Database seeded successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// DOCUMENTATION ROUTES
// ============================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});