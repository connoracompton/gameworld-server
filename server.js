const express = require('express');
const cors = require('cors');
const path = require('path');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Joi Schemas
const gameSchema = Joi.object({
  id: Joi.string().required().lowercase().pattern(/^[a-z0-9-]+$/),
  name: Joi.string().required().min(2).max(100),
  price: Joi.number().required().min(0).max(999.99),
  genre: Joi.string().required().min(2).max(50),
  platform: Joi.string().required().min(2).max(100),
  rating: Joi.string().required().valid('E', 'E10+', 'T', 'M', 'AO'),
  image: Joi.string().uri().required(),
  description: Joi.string().required().min(10).max(500)
});

const gameUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().min(0).max(999.99).required(),
  genre: Joi.string().min(2).max(50).required(),
  platform: Joi.string().min(2).max(100).required(),
  rating: Joi.string().valid('E', 'E10+', 'T', 'M', 'AO').required(),
  image: Joi.string().uri().required(),
  description: Joi.string().min(10).max(500).required()
});

const consoleSchema = Joi.object({
  id: Joi.string().required().lowercase().pattern(/^[a-z0-9-]+$/),
  name: Joi.string().required().min(2).max(100),
  price: Joi.number().required().min(0).max(9999.99),
  image: Joi.string().uri().required(),
  description: Joi.string().required().min(10).max(500),
  manufacturer: Joi.string().required().min(2).max(50),
  release_year: Joi.number().integer().min(1970).max(new Date().getFullYear() + 2)
});

const consoleUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().min(0).max(9999.99).required(),
  image: Joi.string().uri().required(),
  description: Joi.string().min(10).max(500).required(),
  manufacturer: Joi.string().min(2).max(50).required(),
  release_year: Joi.number().integer().min(1970).max(new Date().getFullYear() + 2).required()
});

const collectibleSchema = Joi.object({
  id: Joi.string().required().lowercase().pattern(/^[a-z0-9-]+$/),
  name: Joi.string().required().min(2).max(100),
  price: Joi.number().required().min(0).max(9999.99),
  image: Joi.string().uri().required(),
  description: Joi.string().required().min(10).max(500),
  rarity: Joi.string().required().valid('Common', 'Uncommon', 'Rare', 'Limited Edition', 'Reproduction'),
  height: Joi.string().optional().max(50),
  size: Joi.string().optional().max(50),
  condition: Joi.string().optional().max(50)
});

const collectibleUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().min(0).max(9999.99).required(),
  image: Joi.string().uri().required(),
  description: Joi.string().min(10).max(500).required(),
  rarity: Joi.string().valid('Common', 'Uncommon', 'Rare', 'Limited Edition', 'Reproduction').required(),
  height: Joi.string().optional().max(50),
  size: Joi.string().optional().max(50),
  condition: Joi.string().optional().max(50)
});

// Data arrays
const games = [
  {
    id: 'mystic-realms',
    name: 'Mystic Realms',
    price: 49.99,
    genre: 'RPG',
    platform: 'PS5, Xbox, PC',
    rating: 'E10+',
    image: 'https://gameworld-server.onrender.com/images/mystic-realms.png',
    description: 'Step into the enchanted world of Mystic Realms, where mystery and adventure collide. Explore vast kingdoms filled with mythical creatures, hidden treasures, and powerful spells waiting to be mastered.'
  },
  {
    id: 'arcade-legends',
    name: 'Arcade Legends',
    price: 29.99,
    genre: 'Arcade',
    platform: 'Switch, PC',
    rating: 'E',
    image: 'https://gameworld-server.onrender.com/images/arcade-legends.png',
    description: 'Relive the golden age of gaming with Arcade Legends, a collection of classic arcade games reimagined for modern platforms.'
  },
  {
    id: 'steel-vanguard',
    name: 'Steel Vanguard',
    price: 59.99,
    genre: 'Action',
    platform: 'PS5, Xbox, PC',
    rating: 'M',
    image: 'https://gameworld-server.onrender.com/images/steel-vanguard.png',
    description: 'Intense action-packed warfare in a dystopian future. Lead your squad to victory in this explosive shooter.'
  },
  {
    id: 'lost-horizon',
    name: 'Lost Horizon',
    price: 49.99,
    genre: 'Adventure',
    platform: 'PS5, PC',
    rating: 'T',
    image: 'https://gameworld-server.onrender.com/images/lost-horizon.png',
    description: 'Embark on an epic journey to discover ancient civilizations and uncover long-lost secrets.'
  },
  {
    id: 'pixel-quest',
    name: 'Pixel Quest',
    price: 29.99,
    genre: 'Platformer',
    platform: 'All Platforms',
    rating: 'E',
    image: 'https://gameworld-server.onrender.com/images/pixel-quest.png',
    description: 'Dive into the retro-inspired adventure of Pixel Quest, a fast-paced platformer bursting with charm and challenge.'
  },
  {
    id: 'shadow-strike',
    name: 'Shadow Strike',
    price: 59.99,
    genre: 'Stealth',
    platform: 'PS5, Xbox, PC',
    rating: 'M',
    image: 'https://gameworld-server.onrender.com/images/shadow-strike.png',
    description: 'Master the art of stealth in this gripping tactical espionage game. Every shadow is your ally.'
  }
];

const consoles = [
  {
    id: 'next-gen',
    name: 'Next-Gen Console',
    price: 499.99,
    image: 'https://gameworld-server.onrender.com/images/next-gen.jpg',
    description: 'Experience the future of gaming with the Next Gen Console, built for lightning-fast performance, stunning 4K visuals, and ultra-smooth gameplay.',
    manufacturer: 'Sony',
    release_year: 2024
  },
  {
    id: 'wii',
    name: 'Wii',
    price: 199.99,
    image: 'https://gameworld-server.onrender.com/images/wii.jpg',
    description: 'Classic motion-controlled gaming console that revolutionized family entertainment.',
    manufacturer: 'Nintendo',
    release_year: 2006
  },
  {
    id: 'switch',
    name: 'Switch',
    price: 299.99,
    image: 'https://gameworld-server.onrender.com/images/switch.jpg',
    description: 'Versatile hybrid console that seamlessly transitions between handheld and TV modes.',
    manufacturer: 'Nintendo',
    release_year: 2017
  },
  {
    id: 'controller',
    name: 'Wireless Controller',
    price: 69.99,
    image: 'https://gameworld-server.onrender.com/images/controller.jpg',
    description: 'Premium wireless gaming controller with advanced haptic feedback and responsive controls.',
    manufacturer: 'Various',
    release_year: 2023
  }
];

const collectibles = [
  {
    id: 'limited-figure',
    name: 'Limited Edition Figure',
    price: 89.99,
    image: 'https://gameworld-server.onrender.com/images/limited-edition-figurine.png',
    description: 'Own a piece of gaming history with the Limited Edition Figurine, crafted with premium detail and made exclusively for true collectors.',
    rarity: 'Limited Edition',
    height: '12 inches'
  },
  {
    id: 'poster',
    name: 'Vintage Gaming Poster',
    price: 19.99,
    image: 'https://gameworld-server.onrender.com/images/vintage-gaming-poster.png',
    description: 'Bring the golden age of gaming to your walls with the Vintage Gaming Poster, a high-quality print that captures the bold colors and iconic style of classic arcades.',
    size: '24x36 inches',
    rarity: 'Reproduction'
  },
  {
    id: 'rare-cartridge',
    name: 'Rare Game Cartridge',
    price: 149.99,
    image: 'https://gameworld-server.onrender.com/images/rare-game-cartridge.png',
    description: 'Authentic rare game cartridge from the golden era of gaming. A must-have for serious collectors.',
    condition: 'Good',
    rarity: 'Rare'
  }
];

// ============================================
// GAMES ROUTES
// ============================================

// GET all games
app.get('/api/games', (req, res) => {
  res.json(games);
});

// GET single game
app.get('/api/games/:id', (req, res) => {
  const game = games.find(g => g.id === req.params.id);
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ error: 'Game not found' });
  }
});

// POST new game
app.post('/api/games', (req, res) => {
  const { error, value } = gameSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  if (games.find(g => g.id === value.id)) {
    return res.status(400).json({ 
      success: false, 
      error: 'A game with this ID already exists' 
    });
  }

  games.push(value);
  res.status(201).json({ 
    success: true, 
    message: 'Game added successfully',
    data: value 
  });
});

// PUT - Update a game
app.put('/api/games/:id', (req, res) => {
  const gameId = req.params.id;
  
  const { error, value } = gameUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false,
      error: error.details[0].message 
    });
  }
  
  const gameIndex = games.findIndex(g => g.id === gameId);
  if (gameIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Game not found' 
    });
  }
  
  games[gameIndex] = {
    id: gameId,
    ...value
  };
  
  res.json({ 
    success: true, 
    message: 'Game updated successfully',
    data: games[gameIndex] 
  });
});

// DELETE - Remove a game
app.delete('/api/games/:id', (req, res) => {
  const gameId = req.params.id;
  
  const gameIndex = games.findIndex(g => g.id === gameId);
  if (gameIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Game not found' 
    });
  }
  
  const deletedGame = games.splice(gameIndex, 1)[0];
  res.json({ 
    success: true, 
    message: 'Game deleted successfully',
    data: deletedGame 
  });
});

// ============================================
// CONSOLES ROUTES
// ============================================

// GET all consoles
app.get('/api/consoles', (req, res) => {
  res.json(consoles);
});

// GET single console
app.get('/api/consoles/:id', (req, res) => {
  const console = consoles.find(c => c.id === req.params.id);
  if (console) {
    res.json(console);
  } else {
    res.status(404).json({ error: 'Console not found' });
  }
});

// POST new console
app.post('/api/consoles', (req, res) => {
  const { error, value } = consoleSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  if (consoles.find(c => c.id === value.id)) {
    return res.status(400).json({ 
      success: false, 
      error: 'A console with this ID already exists' 
    });
  }

  consoles.push(value);
  res.status(201).json({ 
    success: true, 
    message: 'Console added successfully',
    data: value 
  });
});

// PUT - Update a console
app.put('/api/consoles/:id', (req, res) => {
  const consoleId = req.params.id;
  
  const { error, value } = consoleUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false,
      error: error.details[0].message 
    });
  }
  
  const consoleIndex = consoles.findIndex(c => c.id === consoleId);
  if (consoleIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Console not found' 
    });
  }
  
  consoles[consoleIndex] = {
    id: consoleId,
    ...value
  };
  
  res.json({ 
    success: true, 
    message: 'Console updated successfully',
    data: consoles[consoleIndex] 
  });
});

// DELETE - Remove a console
app.delete('/api/consoles/:id', (req, res) => {
  const consoleId = req.params.id;
  
  const consoleIndex = consoles.findIndex(c => c.id === consoleId);
  if (consoleIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Console not found' 
    });
  }
  
  const deletedConsole = consoles.splice(consoleIndex, 1)[0];
  res.json({ 
    success: true, 
    message: 'Console deleted successfully',
    data: deletedConsole 
  });
});

// ============================================
// COLLECTIBLES ROUTES
// ============================================

// GET all collectibles
app.get('/api/collectibles', (req, res) => {
  res.json(collectibles);
});

// GET single collectible
app.get('/api/collectibles/:id', (req, res) => {
  const collectible = collectibles.find(c => c.id === req.params.id);
  if (collectible) {
    res.json(collectible);
  } else {
    res.status(404).json({ error: 'Collectible not found' });
  }
});

// POST new collectible
app.post('/api/collectibles', (req, res) => {
  const { error, value } = collectibleSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  if (collectibles.find(c => c.id === value.id)) {
    return res.status(400).json({ 
      success: false, 
      error: 'A collectible with this ID already exists' 
    });
  }

  collectibles.push(value);
  res.status(201).json({ 
    success: true, 
    message: 'Collectible added successfully',
    data: value 
  });
});

// PUT - Update a collectible
app.put('/api/collectibles/:id', (req, res) => {
  const collectibleId = req.params.id;
  
  const { error, value } = collectibleUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false,
      error: error.details[0].message 
    });
  }
  
  const collectibleIndex = collectibles.findIndex(c => c.id === collectibleId);
  if (collectibleIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Collectible not found' 
    });
  }
  
  collectibles[collectibleIndex] = {
    id: collectibleId,
    ...value
  };
  
  res.json({ 
    success: true, 
    message: 'Collectible updated successfully',
    data: collectibles[collectibleIndex] 
  });
});

// DELETE - Remove a collectible
app.delete('/api/collectibles/:id', (req, res) => {
  const collectibleId = req.params.id;
  
  const collectibleIndex = collectibles.findIndex(c => c.id === collectibleId);
  if (collectibleIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Collectible not found' 
    });
  }
  
  const deletedCollectible = collectibles.splice(collectibleIndex, 1)[0];
  res.json({ 
    success: true, 
    message: 'Collectible deleted successfully',
    data: deletedCollectible 
  });
});

// ============================================
// DOCUMENTATION ROUTES
// ============================================

// Serve index.html with API documentation
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve CSS for the API documentation page
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});