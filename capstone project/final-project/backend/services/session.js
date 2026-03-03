import User from '#root/models/user.js';

export async function getUserInfo(req, id, refresh = false /*, transaction*/) {
  const userId = id || req.session?.user?.id;
  if (!userId) return null;

  // Reuse cached session data unless a refresh is requested
  if (!refresh && req.session?.user?.id === userId) {
    return { user: req.session.user };
  }

  const user = await User.findByPk(userId, {
    attributes: ['id', 'username', 'email', 'role'],
  });

  if (!user) {
    req.session.user = null;
    return null;
  }

  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  req.session.user = safeUser;
  return { user: safeUser };
}
