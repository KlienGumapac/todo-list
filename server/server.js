const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://kliengumapac5512:eWq6F9EVhM9ksxVo@todo.ywejoho.mongodb.net/?retryWrites=true&w=majority&appName=todo';
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Todo Schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/logout', authMiddleware, async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Todo Routes
app.get('/api/todos', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: todos });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/todos', authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const todo = new Todo({
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.user._id,
    });

    await todo.save();
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        title,
        description,
        completed,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.patch('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const { completed } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { completed },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/todos/:id', authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 