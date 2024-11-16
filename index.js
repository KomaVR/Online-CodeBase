import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (like CSS, images)
app.use(express.static(path.join(__dirname)));

// Route for the main compiler page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for the embed page (embed.html)
app.get('/embed', (req, res) => {
  res.sendFile(path.join(__dirname, 'embed.html'));
});

// API routes
app.use('/api/compile', express.json(), (req, res) => {
  // Your compile.js logic here
  res.send({ output: 'Compile Output Here' });
});

app.use('/api/log', express.json(), (req, res) => {
  // Your log.js logic here
  res.send({ status: 'Log successful' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
