# Quick Setup Guide

## ✅ Setup Checklist

Follow these steps to get your 3D Models Showcase website running:

### 1. MongoDB Atlas Setup (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new project (e.g., "3D Models Project")
4. Build a database:
   - Choose **FREE** (M0) tier
   - Select your preferred cloud provider and region
   - Click "Create"
5. Create a database user:
   - Click "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"
6. Whitelist your IP:
   - Click "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
7. Get your connection string:
   - Go back to "Database" (Deployment → Database)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)

### 2. Environment Configuration (2 minutes)

1. Open the `.env.local` file in your project root
2. Replace the `MONGODB_URI` value with your connection string from step 1.7
3. Make sure to replace `<username>` and `<password>` with your actual credentials
4. Example:
   ```
   MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/3d-models?retryWrites=true&w=majority
   ```

### 3. Install Dependencies (1 minute)

Open a terminal in the project directory and run:
```bash
npm install
```

### 4. Start Development Server (1 minute)

```bash
npm run dev
```

### 5. Open Your Browser

Navigate to: http://localhost:3000

You should see your 3D Models Showcase website! 🎉

## 🧪 Testing the Site

1. **Homepage**: Should display the gallery (empty initially)
2. **Upload Page**: Click "Upload Model" to test the upload functionality
3. **Search**: Try the search bar to test filtering

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check your connection string in `.env.local`
- Verify your database user credentials
- Make sure your IP is whitelisted (or use 0.0.0.0/0)
- Check if your cluster is active in MongoDB Atlas

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then run `npm install`

### Port 3000 is already in use
- Change the port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

### 3D Model not displaying
- Check the file format (supported: .glb, .gltf, .obj, .fbx, .stl)
- Check browser console for errors
- Try a different 3D model file

## 📚 Next Steps

1. Upload some test 3D models
2. Customize the styling in `src/app/globals.css`
3. Add authentication (optional)
4. Deploy to Vercel or another hosting platform

## 🔗 Useful Links

- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)

## 🆘 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review the [MongoDB Atlas getting started guide](https://www.mongodb.com/docs/atlas/getting-started/)
- Check Next.js [troubleshooting guide](https://nextjs.org/docs/app/building-your-application/configuring/error-handling)
