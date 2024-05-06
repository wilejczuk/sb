const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db'); 

const app = express();
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    next();
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, user.hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.json({ userId: user.id, userName: user.name, token: 'mockedToken' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/servers/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const servers = await db.getUserServers(userId);
    res.json(servers);
  } catch (error) {
    console.error('Server list error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/updates', async (req, res) => {
    try {
        const updates = await db.getUpdates();
        res.json(updates);
    } catch (error) {
        console.error('Updates list error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/installations/:serverGUID', async (req, res) => {
    const serverGUID = req.params.serverGUID;
    try {
        const installations = await db.getInstallations(serverGUID);
        res.json(installations);
    } catch (error) {
        console.error('Installations list error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/installation', async (req, res) => {
    const { serverGUID, updateId, time } = req.body;
    try {
      const installation = await db.addInstallation(serverGUID, updateId, time);  
      res.json({ response: installation });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.post('/installationCancel', async (req, res) => {
    const { installationId } = req.body;
    try {
      const installation = await db.cancelInstallation(installationId);  
      res.json({ response: installation });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });  

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});