# AI Traffic System - MongoDB Setup Guide

## Prerequisites

### Option 1: Local MongoDB (Recommended for Development)

**Windows:**
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will run as a Windows Service on `localhost:27017`
4. Verify: Open PowerShell and run `mongosh` (MongoDB shell)

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud - No Installation Needed)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai_traffic_system`
5. Set the environment variable: `MONGO_URI=your_connection_string`

---

## Installation & Running

### Step 1: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Set Environment Variables (Optional)

Create a `.env` file in the `backend` folder:
```env
MONGO_URI=mongodb://localhost:27017/
DB_NAME=ai_traffic_system
FLASK_ENV=development
FLASK_DEBUG=true
```

If using MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
DB_NAME=ai_traffic_system
```

### Step 3: Run the Backend

```bash
cd backend
python app.py
```

**Expected Output:**
```
✅ MongoDB connected successfully
✅ Created gps_locations collection
✅ Created gps_history collection
✅ Created vehicles collection
✅ Synced 12 seed vehicles to MongoDB
Warning: This is a development server. Do not use it in production.
```

### Step 4: Run the Frontend

```bash
cd frontend
npm start
```

Open http://localhost:3001 in your browser.

---

## API Endpoints

### Live Locations
- **GET** `/api/locations` - Get all current vehicle locations
- **Response:**
```json
[
  {
    "vehicle_id": "VH-001",
    "lat": 17.3695,
    "long": 78.4867,
    "speed": 35,
    "timestamp": "2026-02-10T23:52:18.841294",
    "driver_name": "Rajesh Kumar",
    "destination": "Madhapur"
  }
]
```

### Store GPS Data
- **POST** `/api/location` - Send GPS location from mobile device
- **Request Body:**
```json
{
  "vehicle_id": "MOBILE-GPS-1",
  "lat": 17.3695,
  "long": 78.4867,
  "speed": 5.2
}
```

### GPS History
- **GET** `/api/history` - Get all GPS records (paginated)
  - Query params: `limit=50` (default)
- **GET** `/api/history/<vehicle_id>` - Get history for specific vehicle
  - Query params: `limit=100` (default)

### Database Status
- **GET** `/api/status` - Check backend and database status

---

## MongoDB Data Structure

### Collections Created

**1. gps_locations** (Latest position per vehicle)
```json
{
  "vehicle_id": "VH-001",
  "lat": 17.3695,
  "long": 78.4867,
  "speed": 35,
  "road_id": "RD-001",
  "driver_name": "Rajesh Kumar",
  "destination": "Madhapur",
  "timestamp": "2026-02-10T23:52:18.841294",
  "updated_at": "2026-02-10T23:52:18.841294"
}
```

**2. gps_history** (All GPS records)
```json
{
  "vehicle_id": "VH-001",
  "lat": 17.3695,
  "long": 78.4867,
  "speed": 35,
  "road_id": "RD-001",
  "driver_name": "Rajesh Kumar",
  "destination": "Madhapur",
  "timestamp": "2026-02-10T23:52:18.841294",
  "source": "gps_tracker",
  "created_at": "2026-02-10T23:52:18.841294"
}
```

**3. vehicles** (Vehicle metadata)
```json
{
  "vehicle_id": "VH-001",
  "driver_name": "Rajesh Kumar",
  "vehicle_type": "truck",
  "registration": "AP01AB1234"
}
```

---

## Features

✅ Real-time GPS tracking with persistent storage
✅ MongoDB integration for data persistence
✅ GPS history tracking and analytics
✅ Browser geolocation support (mobile)
✅ ngrok tunnel for remote access
✅ Fallback to in-memory storage if MongoDB unavailable
✅ Automatic data indexing for performance

---

## Troubleshooting

### "MongoDB not available" Warning
**Solution:** 
1. Verify MongoDB is running: `mongosh` (should connect)
2. Check connection string in `.env`
3. Backend will fallback to in-memory storage (data lost on restart)

### Port Already in Use
- Flask (5000): `netstat -ano | findstr :5000` (Windows)
- Change in `app.py`: `app.run(port=5001)`

### pymongo Import Error
```bash
pip install pymongo==4.5.0
```

---

## Next Steps

- [ ] Add database backups
- [ ] Add data export (CSV/JSON)
- [ ] Add analytics dashboard
- [ ] Set up data retention policies
- [ ] Add user authentication for API

