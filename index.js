import express from 'express';
import pg from 'pg';
import cors from 'cors';

const { Pool } = pg;
const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allow React to connect
app.use(express.json()); // Parse JSON bodies

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Bobo1!PG',
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});