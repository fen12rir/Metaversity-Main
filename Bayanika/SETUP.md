# Bayanika Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up MongoDB

### Option A: Local MongoDB Installation

1. **Install MongoDB Community Edition**
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB Service**
   - Windows: MongoDB should start automatically as a service
   - macOS/Linux: `mongod --dbpath ~/data/db` (or your preferred path)

3. **Verify MongoDB is Running**
   ```bash
   mongosh
   ```
   If you see the MongoDB shell, you're good to go!

### Option B: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create a Free Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the free tier (M0)
   - Select your preferred region
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP address
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `bayanika` (or your preferred database name)

   Example connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bayanika?retryWrites=true&w=majority
   ```

### Option C: Docker (Quick Setup)

1. **Install Docker Desktop**
   - Download from [Docker Desktop](https://www.docker.com/products/docker-desktop)

2. **Run MongoDB Container**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Verify it's Running**
   ```bash
   docker ps
   ```

## Step 3: Configure Environment Variables

1. **Copy the example environment file**
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file with your configuration**

   For **Local MongoDB**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bayanika
   ```

   For **MongoDB Atlas**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bayanika?retryWrites=true&w=majority
   ```

   **Generate secure secrets:**
   ```bash
   # Generate JWT secret (use any method you prefer)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Generate session secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Update your `.env`:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-generated-jwt-secret
   SESSION_SECRET=your-generated-session-secret
   BASE_RPC_URL=https://mainnet.base.org
   PORT=3000
   NODE_ENV=development
   ```

## Step 4: Run the Application

1. **Development Mode**
   ```bash
   npm run dev
   ```

2. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

3. **Access the Application**
   - Open your browser to `http://localhost:3000`

## Step 5: Verify MongoDB Connection

The application will automatically connect to MongoDB on startup. You should see:
```
Connected to MongoDB
```

If you see an error, check:
- MongoDB is running (for local installation)
- Connection string is correct
- Network access is configured (for Atlas)
- Credentials are correct

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Check your username and password in the connection string
- Verify database user has proper permissions

**Error: "MongoNetworkError: connect ECONNREFUSED"**
- Ensure MongoDB is running: `mongosh` (local) or check Atlas cluster status
- Check if port 27017 is not blocked by firewall
- Verify connection string is correct

**Error: "MongoServerSelectionError"**
- For Atlas: Check network access settings (IP whitelist)
- For local: Ensure MongoDB service is running

### Port Already in Use

If port 3000 is already in use:
```bash
# Change PORT in .env file
PORT=3001
```

### Missing Dependencies

If you encounter module errors:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Create your first user account by registering
2. Set up a barangay admin account (manually in database or via API)
3. Create your first activity
4. Start participating and earning Bayanihan Points!

## Production Deployment

For production:
1. Use MongoDB Atlas or a managed MongoDB service
2. Set strong, unique secrets for JWT_SECRET and SESSION_SECRET
3. Set NODE_ENV=production
4. Configure proper CORS settings
5. Use environment variables from your hosting platform
6. Enable HTTPS
7. Set up proper backup and monitoring

