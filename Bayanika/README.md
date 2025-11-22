# Bayanika 🇵🇭

Gamifying Bayanihan into Real Proof of Work on Base Blockchain

## Overview

Bayanika transforms community volunteer work (Bayanihan) into verifiable, on-chain credentials. Users can join community activities, earn Bayanihan Points, and mint NFTs on Base blockchain as proof of their contributions.

## Features

- 🎯 **Join Community Activities** - Participate in barangay events and volunteer work
- ⛓️ **On-Chain Proof of Work** - Mint NFTs on Base blockchain as verifiable credentials
- 🏆 **Gamification** - Earn Bayanihan Points, unlock badges, and level up
- 📊 **Leaderboard** - Compete with other community members
- ✅ **Verification System** - Barangay admins verify participation

## Tech Stack

- **Framework**: Remix v2 (React Router v7)
- **Database**: MongoDB with Mongoose
- **Blockchain**: Base (via viem)
- **Styling**: Tailwind CSS
- **Authentication**: JWT with cookie sessions

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up MongoDB** (see [SETUP.md](./SETUP.md) for detailed instructions):
   - Option A: Install MongoDB locally
   - Option B: Use MongoDB Atlas (cloud)
   - Option C: Use Docker

3. **Configure environment variables:**
```bash
cp env.example .env
```
   Edit `.env` with your MongoDB connection string and secrets.

4. **Run development server:**
```bash
npm run dev
```

5. **Build for production:**
```bash
npm run build
npm start
```

For detailed setup instructions, including MongoDB installation and configuration, see [SETUP.md](./SETUP.md).

## Project Structure

```
Bayanika/
├── app/
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB models
│   ├── routes/          # Remix routes (pages + API)
│   ├── utils/           # Utilities (auth, blockchain, gamification)
│   └── styles/          # Global styles
├── server.js            # Express server with Remix
└── vite.config.js      # Vite configuration
```

## Key Routes

- `/` - Homepage
- `/login` - Login page
- `/register` - Registration
- `/dashboard` - User dashboard
- `/activities` - Browse activities
- `/activities/:id` - Activity details
- `/proof-of-work` - View proof of work
- `/leaderboard` - Community leaderboard
- `/profile` - User profile

## API Routes

- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/activities/create` - Create activity (barangay admin)
- `/api/activities/verify` - Verify participation
- `/api/proof-of-work/mint` - Mint NFT on Base

## Models

- **User** - User accounts with Bayanihan Points, level, badges
- **Activity** - Community activities/events
- **ProofOfWork** - Verifiable proof of work records
- **Badge** - Achievement badges

## Blockchain Integration

The app integrates with Base blockchain to mint NFTs as proof of work. Users can connect their wallet and mint verifiable credentials for completed activities.

## License

MIT

