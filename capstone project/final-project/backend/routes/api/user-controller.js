import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '#root/models/user.js';
import { getUserInfo } from '#root/services/session.js';

const router = Router();

router.get('/userinfo', async (req, res) => {
  try {
    if (!req.session.user) return res.json({ isLoggedIn: false });
    const userInfo = await getUserInfo(req, req.session.user.id);
    if (!userInfo?.user) return res.json({ isLoggedIn: false });
    return res.json({
      isLoggedIn: true,
      ...userInfo,
    });
  } catch (error) {
    console.error('User info error', error);
    return res.status(500).json({
      isLoggedIn: false,
      success: false,
      message: 'Unable to fetch user info',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail =
      typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({
      where: { email: normalizedEmail },
      attributes: ['id', 'username', 'email', 'password', 'role'],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Regenerate session to avoid fixation
    await new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    req.session.user = safeUser;

    return res.json({
      success: true,
      isLoggedIn: true,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to login right now. Please try again.',
    });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error', err);
      return res.status(500).json({ success: false });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true });
  });
});

export default router;
