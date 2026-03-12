const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const { Department, Complaint } = require('./models');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT']
  }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/complaints', require('./routes/complaints'));
app.use('/analytics', require('./routes/analytics'));

// Socket.io injection for controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    // Sync models (auto-migrate for local SQLite)
    await sequelize.sync({ alter: true, force: false }); // Change to true if you need to reset

    // Safety net: ensure newer columns exist in SQLite even if alter didn't apply
    try {
      const [columns] = await sequelize.query('PRAGMA table_info(Complaints)');
      const colNames = (columns || []).map(c => c.name);
      if (!colNames.includes('latitude')) {
        await sequelize.query('ALTER TABLE Complaints ADD COLUMN latitude FLOAT');
      }
      if (!colNames.includes('longitude')) {
        await sequelize.query('ALTER TABLE Complaints ADD COLUMN longitude FLOAT');
      }
      if (!colNames.includes('priority')) {
        await sequelize.query("ALTER TABLE Complaints ADD COLUMN priority TEXT DEFAULT 'normal'");
      }
    } catch (err) {
      console.warn('SQLite migration check failed:', err.message);
    }
    
    // Seed Departments if empty
    const count = await Department.count();
    if (count === 0) {
      await Department.bulkCreate([
        { name: 'Road Maintenance Department', code: 'ROAD' },
        { name: 'Sanitation Department', code: 'GARBAGE' },
        { name: 'Electricity Department', code: 'ELECTRICITY' },
        { name: 'Water Supply Department', code: 'WATER' },
        { name: 'Drainage Department', code: 'DRAINAGE' }
      ]);
      console.log('Departments seeded.');
    }

    const deptRecords = await Department.findAll();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    // Seed some sample complaints with coordinates if none exist
    const complaintCount = await Complaint.count();
    if (complaintCount === 0) {
      const sampleCoords = [
        { lat: 12.9716, lng: 77.5946, cat: 'Roads & Infrastructure' },
        { lat: 12.9352, lng: 77.6245, cat: 'Water Supply' },
        { lat: 12.9279, lng: 77.6271, cat: 'Electricity' },
        { lat: 12.9562, lng: 77.7013, cat: 'Sanitation' },
        { lat: 13.0285, lng: 77.5896, cat: 'Public Safety' },
      ];

      for (let i = 0; i < sampleCoords.length; i++) {
        const coord = sampleCoords[i];
        const dept = deptRecords.find(d => d.name.includes(coord.cat.split(' ')[0]));
        await Complaint.create({
          id: `C-INIT-${i}`,
          title: `Initial Sample: ${coord.cat}`,
          description: 'Automatically generated sample for heatmap visualization.',
          category: coord.cat,
          department_id: dept?.id,
          latitude: coord.lat,
          longitude: coord.lng,
          created_by: '00000000-0000-0000-0000-000000000000', // Mock Admin
          status: 'Pending'
        });
      }
      console.log('Sample geospatial data seeded.');
    }
  } catch (err) {
    console.error('Unable to start server:', err);
  }
};

startServer();
