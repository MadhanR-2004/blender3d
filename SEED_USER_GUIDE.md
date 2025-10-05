# How to Seed a Test User

## Quick Start

### 1. Make sure you have a `.env.local` file with your MongoDB connection string:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/3d-models?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
```

### 2. Run the seed script:

```bash
npm run seed:user
```

## What Gets Created

The seed script creates a test user with these credentials:

- **Email:** `test@example.com`
- **Password:** `password123`
- **Name:** `Test User`

## Login to Your Application

After seeding, you can:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3000/login

3. Login with:
   - Email: `test@example.com`
   - Password: `password123`

## Creating Additional Users

You can create more users by:

1. **Using the Signup Page:**
   - Go to http://localhost:3000/signup
   - Fill in the registration form
   - Submit to create a new user

2. **Modifying the seed script:**
   - Edit `scripts/seed-user.js`
   - Change the `testUser` object with new credentials
   - Run `npm run seed:user` again

3. **Using MongoDB Atlas:**
   - Go to your MongoDB Atlas dashboard
   - Browse Collections
   - Add documents manually to the `users` collection
   - **Important:** Passwords must be bcrypt hashed!

## Troubleshooting

### "User already exists"
If you see this message, the user is already in your database. You can either:
- Use the existing credentials
- Delete the user from MongoDB Atlas
- Modify the seed script to create a different user

### "Cannot connect to MongoDB"
Make sure:
- Your `.env.local` file exists and has the correct `MONGODB_URI`
- Your MongoDB Atlas cluster is running
- Your IP address is whitelisted in MongoDB Atlas
- Your credentials in the connection string are correct

### "Module not found"
Run:
```bash
npm install
```

## Security Notes

⚠️ **Important:** 
- Never commit `.env.local` to git
- Change `JWT_SECRET` in production
- Use strong passwords for production users
- The seed script is for development only

## Next Steps

After creating a user:

1. ✅ Login to the application
2. ✅ Go to Dashboard (http://localhost:3000/dashboard)
3. ✅ Upload your first 3D model
4. ✅ View your models in the gallery
