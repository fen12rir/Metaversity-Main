# 🔧 Troubleshooting Guide

## Routes Not Loading / 404 Errors

### Problem
When clicking on navigation links like "Proof of Work" or "Verify", you get a 404 error or the page doesn't load.

### Solution
**Restart the development server:**

1. Stop the current server (press `Ctrl+C` in the terminal)
2. Start it again:
```bash
npm run dev
```

**Why this happens:**
- Remix uses file-based routing
- New route files need the server to restart to be discovered
- Hot Module Replacement (HMR) doesn't always pick up new route files

### Quick Check
After restarting, verify these routes work:
- ✅ `/dashboard` - User dashboard
- ✅ `/activities` - Browse activities
- ✅ `/shop` - Rewards shop
- ✅ `/proof-of-work` - Your proof of work
- ✅ `/leaderboard` - Rankings
- ✅ `/profile` - Your profile
- ✅ `/admin/dashboard` - Admin dashboard (admin only)
- ✅ `/admin/verify-proof` - Verify submissions (admin only)

## Database Connection Issues

### Problem
Error: "Database connection failed" or MongoDB connection errors

### Solutions

1. **Check MongoDB URI format:**
```env
# Correct format for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bayanika?appName=Metaversity

# Make sure there's only ONE "MONGODB_URI=" prefix
# Include "/bayanika" database name before the "?"
```

2. **Verify MongoDB Atlas Network Access:**
- Go to MongoDB Atlas → Network Access
- Add your IP address or use `0.0.0.0/0` for development
- Save and wait a few minutes for it to take effect

3. **Test connection:**
```bash
npm run seed:admin
```
If this works, your connection is good!

## Registration/Login Hanging

### Problem
Form keeps loading but never completes

### Solutions

1. **Check server logs** - Look for error messages in the terminal
2. **Verify database connection** - See "Database Connection Issues" above
3. **Clear browser cache** - Sometimes cached data causes issues
4. **Check console** - Open browser DevTools (F12) → Console tab for errors

## Shop/Rewards Not Showing

### Problem
Shop page is empty or rewards don't appear

### Solution
Run the rewards seeder:
```bash
npm run seed:rewards
```

## Activities Not Showing

### Problem
Activities page is empty

### Solution
Run the activities seeder:
```bash
npm run seed:activities
```

## Admin Features Not Visible

### Problem
Can't see "Admin" or "Verify" links in navigation

### Solution
Make sure you're logged in as admin:
- Email: `admin@bayanika.com`
- Password: `admin123`

If admin doesn't exist:
```bash
npm run seed:admin
```

## NFT Minting Not Working

### Problem
Proof is verified but no NFT is minted

### This is Normal!
NFT minting is **optional** and requires:
1. A Base wallet with ETH for gas fees
2. Private key configured in `.env`
3. User must have a wallet address set

**The app works fully without NFT minting.** It's an enhancement, not a requirement.

To enable NFT minting:
```env
PRIVATE_KEY=your-wallet-private-key-here
BASE_RPC_URL=https://mainnet.base.org
```

## Points Not Awarded

### Problem
Proof is approved but user didn't receive points

### Check
1. Proof must be **verified** (green checkmark)
2. Admin must click "Approve & Award Points"
3. Refresh the page to see updated points

### Verify
- Go to `/profile` to see current points
- Check `/leaderboard` to confirm

## Shop Redemption Not Working

### Problem
Can't redeem rewards even with enough points

### Solutions
1. **Check stock** - Reward might be out of stock
2. **Verify points** - Make sure you have enough Bayanihan Points
3. **Refresh page** - Sometimes UI needs to update
4. **Check console** - Look for error messages in browser console

## Server Won't Start

### Problem
`npm run dev` fails or shows errors

### Solutions

1. **Delete node_modules and reinstall:**
```bash
Remove-Item -Recurse -Force node_modules
npm install
```

2. **Check for port conflicts:**
```bash
# If port 3000 is in use, change in .env:
PORT=3001
```

3. **Verify all dependencies:**
```bash
npm install
```

## Styling Issues / CSS Not Loading

### Problem
Page looks broken or unstyled

### Solutions

1. **Restart dev server** - Tailwind needs to rebuild
2. **Clear browser cache** - Hard refresh with `Ctrl+Shift+R`
3. **Check console** - Look for CSS loading errors

## Session/Login Issues

### Problem
Keeps redirecting to login or session expires quickly

### Solutions

1. **Check .env secrets:**
```env
JWT_SECRET=your-jwt-secret-here
SESSION_SECRET=your-session-secret-here
```

2. **Clear cookies:**
- Open DevTools (F12)
- Application → Cookies
- Clear all cookies for localhost

3. **Restart server** after changing .env

## Common Error Messages

### "Cannot overwrite model once compiled"
**Solution:** Restart the dev server

### "Path `type` is required"
**Solution:** Run `npm run seed:activities` to create activities with all required fields

### "User already exists"
**Solution:** Use a different email/username or login with existing account

### "Activity is full"
**Solution:** Activity has reached max participants. Admin can create a new one.

### "Insufficient Bayanihan Points"
**Solution:** Complete more activities to earn points

## Still Having Issues?

### Debug Steps
1. **Check server terminal** - Look for error messages
2. **Check browser console** (F12) - Look for JavaScript errors
3. **Verify .env file** - Make sure all variables are set
4. **Restart everything:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```
5. **Re-seed database:**
   ```bash
   npm run seed:all
   ```

### Clean Start
If all else fails, do a complete reset:
```bash
# 1. Stop server
# 2. Delete node_modules
Remove-Item -Recurse -Force node_modules

# 3. Reinstall
npm install

# 4. Re-seed database
npm run seed:all

# 5. Restart server
npm run dev
```

## Need Help?
Check the following files for more info:
- `README.md` - Setup instructions
- `DEMO.md` - Demo walkthrough
- `PROJECT_SUMMARY.md` - Complete overview
- `SETUP.md` - MongoDB setup guide

---

**Pro Tip:** Most issues are solved by restarting the dev server! 🔄

