import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

const { Pool } = pg;
const app = express();
const port = 3000;
dotenv.config();

// Middleware
app.use(cors()); // Allow React to connect
app.use(express.json()); // Parse JSON bodies

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Test route
app.get('/', (req, res) => {
  res.send('server is running');
});

// POST route to receive data from React login
app.post('/api/data', async (req, res) => {
  try {
    const { username, email, password } = req.body; // Adjust fields to match your data
    
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post('/api/data/lb', async (req, res) => {
  try {
    const { info, name, joincode} = req.body; // Adjust fields to match your data
    
    const result = await pool.query(
      'INSERT INTO leaderboards (board_info, name, joincode) VALUES ($1, $2, $3) RETURNING *',
      [info, name, joincode]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// GET route to retrieve data
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/data/lb', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leaderboards');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});
app.put('/api/data/lb', async (req, res) => {
  try {
    const { memberKey, username,name2 } = req.body; // e.g., memberKey: "member2", username: "bob"
    
    const result = await pool.query(
      `UPDATE leaderboards 
       SET board_info = jsonb_set(board_info, $1, $2)
       WHERE name = $3
       RETURNING *`,
      [`{${memberKey}}`, username, name2]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});