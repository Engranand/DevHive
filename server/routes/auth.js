 const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const crypto = require('crypto')

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });

    // Naya user — koi project nahi abhi
    res.status(201).json({
      user,
      token: generateToken(user._id),
      hasProject: false  // ← frontend ko pata chalega project banana hai
    });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    // User ke projects fetch karo
    const projects = await Project.find({ 'members.user': user._id })
      .select('name description')
      .sort({ createdAt: -1 })

    res.json({
      user,
      token: generateToken(user._id),
      projects,
      hasProject: projects.length > 0  // ← project hai ya nahi
    });
  } catch (err) { next(err); }
});

// GET /api/auth/me
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    // Projects bhi bhejo
    const projects = await Project.find({ 'members.user': user._id })
      .select('name description')
      .sort({ createdAt: -1 })

    res.json({ user, projects, hasProject: projects.length > 0 });
  } catch (err) { next(err); }
});

   // POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    
    // Security — user na mile toh bhi same message (email enumeration se bachne ke liye)
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' })
    }

    // Random token banao
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetToken = resetToken
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000 // 1 hour
    await user.save()

    // MVP — token directly response mein (production mein email jaayega)
    res.json({ 
      message: 'If that email exists, a reset link has been sent.',
      devToken: resetToken // ⚠️ sirf development ke liye, baad mein hatana hai
    })
  } catch (err) { next(err) }
})

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body
    
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() } // expire nahi hua ho
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    user.password = newPassword // pre-save hook automatically hash karega
    user.resetToken = null
    user.resetTokenExpiry = null
    await user.save()

    res.json({ message: 'Password reset successful. Please login.' })
  } catch (err) { next(err) }
})

module.exports = router;