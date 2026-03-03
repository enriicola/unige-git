import { Router } from 'express';
import { handleException } from '#root/services/error.js';
import studentProfile from '#root/services/student-profile.js';

const router = Router();
const getRequestUser = (req) => req.session?.user || req.user || null;

router.get('/students/me/profile', async (req, res) => {
  try {
    const requestUser = getRequestUser(req);
    const studentId = requestUser?.id ? Number(requestUser.id) : null;

    if (!Number.isInteger(studentId) || studentId < 1) {
      return res.status(401).json({ success: false, error: 'Not logged in' });
    }

    const result = await studentProfile({ studentId });

    if (result.status === 'user_not_found') {
      return res
        .status(404)
        .json({ success: false, error: 'Student not found' });
    }

    return res.json({ success: true, data: result.data });
  } catch (error) {
    handleException(res, error);
  }
});
export default router;
