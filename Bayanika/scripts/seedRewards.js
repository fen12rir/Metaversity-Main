import dotenv from 'dotenv';
import connectDb from '../app/config/db.js';
import Reward from '../app/models/rewardModel.js';

dotenv.config();

const sampleRewards = [
  {
    name: "Jollibee Gift Card - ₱100",
    description: "Enjoy your favorite Chickenjoy and Jolly Spaghetti with this ₱100 Jollibee gift card!",
    pointsCost: 100,
    category: "Food & Drinks",
    stock: 50,
    isAvailable: true,
  },
  {
    name: "Bayanika T-Shirt",
    description: "Exclusive Bayanika volunteer t-shirt. Show your Bayanihan spirit!",
    pointsCost: 150,
    category: "Merchandise",
    stock: 30,
    isAvailable: true,
  },
  {
    name: "SM Gift Certificate - ₱200",
    description: "Shop at any SM store nationwide with this ₱200 gift certificate.",
    pointsCost: 200,
    category: "Gift Cards",
    stock: 25,
    isAvailable: true,
  },
  {
    name: "National Bookstore Voucher - ₱150",
    description: "Get school supplies, books, or office materials with this voucher.",
    pointsCost: 150,
    category: "Books",
    stock: 40,
    isAvailable: true,
  },
  {
    name: "Starbucks Gift Card - ₱250",
    description: "Treat yourself to your favorite coffee and pastries at Starbucks.",
    pointsCost: 250,
    category: "Food & Drinks",
    stock: 20,
    isAvailable: true,
  },
  {
    name: "Wireless Earbuds",
    description: "Bluetooth wireless earbuds with premium sound quality.",
    pointsCost: 500,
    category: "Electronics",
    stock: 10,
    isAvailable: true,
  },
  {
    name: "Lazada Voucher - ₱300",
    description: "Shop online at Lazada with this ₱300 voucher.",
    pointsCost: 300,
    category: "Vouchers",
    stock: 30,
    isAvailable: true,
  },
  {
    name: "Reusable Eco Bag Set",
    description: "Set of 3 durable eco-friendly bags for your daily needs.",
    pointsCost: 75,
    category: "Merchandise",
    stock: 60,
    isAvailable: true,
  },
  {
    name: "Free Haircut Voucher",
    description: "Get a free haircut at participating salons in your barangay.",
    pointsCost: 120,
    category: "Services",
    stock: 15,
    isAvailable: true,
  },
  {
    name: "Power Bank 10000mAh",
    description: "Portable power bank to keep your devices charged on the go.",
    pointsCost: 400,
    category: "Electronics",
    stock: 12,
    isAvailable: true,
  },
];

const seedRewards = async () => {
  try {
    console.log('🌱 Starting rewards seeder...');
    
    await connectDb();
    console.log('✅ Connected to database');

    // Clear existing rewards
    await Reward.deleteMany({});
    console.log('🗑️  Cleared existing rewards');

    // Create new rewards
    const rewards = await Reward.insertMany(sampleRewards);

    console.log('\n✅ Rewards seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎁 Created ${rewards.length} rewards:`);
    rewards.forEach((reward, index) => {
      console.log(`   ${index + 1}. ${reward.name} (${reward.pointsCost} BP)`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding rewards:', error);
    process.exit(1);
  }
};

seedRewards();

