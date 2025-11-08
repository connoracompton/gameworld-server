const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Data arrays
const houses = [
  {
    id: 1,
    name: "Farmhouse",
    size: 2000,
    bedrooms: 3,
    bathrooms: 2.5,
    main_image: "images/farm.webp",
    description: "Charming farmhouse with rustic appeal and modern amenities. Features a spacious wraparound porch and beautiful countryside views.",
    price: 450000,
    year_built: 1985,
    lot_size: "5 acres"
  },
  {
    id: 2,
    name: "Mountain House",
    size: 1700,
    bedrooms: 3,
    bathrooms: 2,
    main_image: "images/mountain-house.webp",
    description: "Stunning mountain retreat with panoramic views. Perfect for those seeking peace and tranquility in nature.",
    price: 525000,
    year_built: 2010,
    lot_size: "2 acres"
  },
  {
    id: 3,
    name: "Lake House",
    size: 3000,
    bedrooms: 4,
    bathrooms: 3,
    main_image: "images/farm.webp",
    description: "Luxurious lakefront property with private dock and beach access. Ideal for water enthusiasts and families.",
    price: 750000,
    year_built: 2015,
    lot_size: "1.5 acres"
  }
];

const games = [
  {
    id: 'mystic-realms',
    name: 'Mystic Realms',
    price: 49.99,
    genre: 'RPG',
    platform: 'PS5, Xbox, PC',
    rating: 'E10+',
    image: 'images/mystic-realms.png',
    description: 'Step into the enchanted world of Mystic Realms, where mystery and adventure collide. Explore vast kingdoms filled with mythical creatures, hidden treasures, and powerful spells waiting to be mastered.'
  },
  {
    id: 'arcade-legends',
    name: 'Arcade Legends',
    price: 29.99,
    genre: 'Arcade',
    platform: 'Switch, PC',
    rating: 'E',
    image: 'images/arcade-legends.png',
    description: 'Relive the golden age of gaming with Arcade Legends, a collection of classic arcade games reimagined for modern platforms.'
  },
  {
    id: 'steel-vanguard',
    name: 'Steel Vanguard',
    price: 59.99,
    genre: 'Action',
    platform: 'PS5, Xbox, PC',
    rating: 'M',
    image: 'images/steel-vanguard.png',
    description: 'Intense action-packed warfare in a dystopian future. Lead your squad to victory in this explosive shooter.'
  },
  {
    id: 'lost-horizon',
    name: 'Lost Horizon',
    price: 49.99,
    genre: 'Adventure',
    platform: 'PS5, PC',
    rating: 'T',
    image: 'images/lost-horizon.png',
    description: 'Embark on an epic journey to discover ancient civilizations and uncover long-lost secrets.'
  },
  {
    id: 'pixel-quest',
    name: 'Pixel Quest',
    price: 29.99,
    genre: 'Platformer',
    platform: 'All Platforms',
    rating: 'E',
    image: 'images/pixel-quest.png',
    description: 'Dive into the retro-inspired adventure of Pixel Quest, a fast-paced platformer bursting with charm and challenge.'
  },
  {
    id: 'shadow-strike',
    name: 'Shadow Strike',
    price: 59.99,
    genre: 'Stealth',
    platform: 'PS5, Xbox, PC',
    rating: 'M',
    image: 'images/shadow-strike.png',
    description: 'Master the art of stealth in this gripping tactical espionage game. Every shadow is your ally.'
  }
];

const consoles = [
  {
    id: 'next-gen',
    name: 'Next-Gen Console',
    price: 499.99,
    image: 'images/next-gen.jpg',
    description: 'Experience the future of gaming with the Next Gen Console, built for lightning-fast performance, stunning 4K visuals, and ultra-smooth gameplay.',
    manufacturer: 'Sony',
    release_year: 2024
  },
  {
    id: 'wii',
    name: 'Wii',
    price: 199.99,
    image: 'images/wii.jpg',
    description: 'Classic motion-controlled gaming console that revolutionized family entertainment.',
    manufacturer: 'Nintendo',
    release_year: 2006
  },
  {
    id: 'switch',
    name: 'Switch',
    price: 299.99,
    image: 'images/switch.jpg',
    description: 'Versatile hybrid console that seamlessly transitions between handheld and TV modes.',
    manufacturer: 'Nintendo',
    release_year: 2017
  }
];

const collectibles = [
  {
    id: 'limited-figure',
    name: 'Limited Edition Figure',
    price: 89.99,
    image: 'images/limited-edition-figurine.png',
    description: 'Own a piece of gaming history with the Limited Edition Figurine, crafted with premium detail and made exclusively for true collectors.',
    rarity: 'Limited Edition',
    height: '12 inches'
  },
  {
    id: 'poster',
    name: 'Vintage Gaming Poster',
    price: 19.99,
    image: 'images/vintage-gaming-poster.png',
    description: 'Bring the golden age of gaming to your walls with the Vintage Gaming Poster, a high-quality print that captures the bold colors and iconic style of classic arcades.',
    size: '24x36 inches',
    rarity: 'Reproduction'
  },
  {
    id: 'rare-cartridge',
    name: 'Rare Game Cartridge',
    price: 149.99,
    image: 'images/rare-game-cartridge.png',
    description: 'Authentic rare game cartridge from the golden era of gaming. A must-have for serious collectors.',
    condition: 'Good',
    rarity: 'Rare'
  }
];

// API Routes
app.get('/api/houses', (req, res) => {
  res.json(houses);
});

app.get('/api/houses/:id', (req, res) => {
  const house = houses.find(h => h.id === parseInt(req.params.id));
  if (house) {
    res.json(house);
  } else {
    res.status(404).json({ error: 'House not found' });
  }
});

app.get('/api/games', (req, res) => {
  res.json(games);
});

app.get('/api/games/:id', (req, res) => {
  const game = games.find(g => g.id === req.params.id);
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ error: 'Game not found' });
  }
});

app.get('/api/consoles', (req, res) => {
  res.json(consoles);
});

app.get('/api/consoles/:id', (req, res) => {
  const console = consoles.find(c => c.id === req.params.id);
  if (console) {
    res.json(console);
  } else {
    res.status(404).json({ error: 'Console not found' });
  }
});

app.get('/api/collectibles', (req, res) => {
  res.json(collectibles);
});

app.get('/api/collectibles/:id', (req, res) => {
  const collectible = collectibles.find(c => c.id === req.params.id);
  if (collectible) {
    res.json(collectible);
  } else {
    res.status(404).json({ error: 'Collectible not found' });
  }
});

// Serve index.html with API documentation
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve CSS for the API documentation page
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});