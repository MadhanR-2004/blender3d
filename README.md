# 3D Models Showcase Website

A modern 3D model showcase platform built with Next.js, Three.js, and MongoDB Atlas. Upload, view, and share 3D models with interactive 3D previews.

## 🚀 Features

- **3D Model Gallery**: Browse through a collection of 3D models
- **Interactive 3D Viewer**: View models with Three.js/React Three Fiber
- **Upload System**: Upload your own 3D models (GLB, GLTF, OBJ, FBX, STL)
- **Search & Filter**: Find models by title, description, or tags
- **MongoDB Atlas Integration**: Secure cloud database storage
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- npm or yarn package manager

## 🛠️ Installation

1. **Install Dependencies**:
```bash
npm install
```

2. **Set Up Environment Variables**:

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/3d-models?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

**To get your MongoDB URI**:
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Click "Connect" → "Connect your application"
- Copy the connection string and replace `<username>` and `<password>`

3. **Generate NextAuth Secret**:
```bash
npx auth secret
```
Or use: `openssl rand -base64 32`

## 🚀 Running the Project

### Development Mode:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Build:
```bash
npm run build
npm start
```

## 📁 Project Structure

```
3d models/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── models/        # Model CRUD endpoints
│   │   │   └── upload/        # File upload endpoint
│   │   ├── model/[id]/        # Model detail page
│   │   ├── upload/            # Upload page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ModelGallery.tsx   # Gallery grid
│   │   ├── ModelCard.tsx      # Model card
│   │   └── ModelViewer.tsx    # 3D viewer
│   ├── lib/                   # Utilities
│   │   └── mongodb.ts         # Database connection
│   ├── models/                # Mongoose models
│   │   ├── Model.ts           # 3D Model schema
│   │   └── User.ts            # User schema
│   └── types/                 # TypeScript types
├── public/                    # Static files
│   └── uploads/              # Uploaded models
├── .env.example              # Environment template
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind config
└── package.json              # Dependencies
```

## 🎮 Usage

### Uploading a Model:
1. Click "Upload Model" button
2. Fill in title and description
3. Add tags (optional)
4. Select your 3D model file
5. Click "Upload Model"

### Viewing Models:
- Browse the gallery on the home page
- Click on any model card to view in 3D
- Use mouse to rotate, zoom, and pan the 3D view

### Supported 3D Formats:
- **GLB/GLTF** - Full 3D preview support
- **OBJ** - Limited support (requires MTL)
- **FBX** - Stored but preview limited
- **STL** - Stored but preview limited

## 🔧 API Endpoints

### Models
- `GET /api/models` - Get all models (with pagination & search)
- `POST /api/models` - Create new model
- `GET /api/models/[id]` - Get single model
- `PUT /api/models/[id]` - Update model
- `DELETE /api/models/[id]` - Delete model

### Upload
- `POST /api/upload` - Upload 3D model file

## 🎨 Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Tailwind CSS** - Styling
- **NextAuth** - Authentication (ready to implement)

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Your app URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth | Yes |
| `CLOUDINARY_*` | Cloudinary config (optional) | No |

## 🚧 Future Enhancements

- [ ] User authentication with NextAuth
- [ ] User profiles and dashboards
- [ ] Like and comment system
- [ ] Model categories
- [ ] Advanced search filters
- [ ] Download functionality
- [ ] Model collections/playlists
- [ ] Social sharing
- [ ] Admin dashboard

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, please open an issue in the repository.

---

Built with ❤️ using Next.js and Three.js
