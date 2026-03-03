import { Router } from 'express';
import { handleException } from '#root/services/error.js';
import getRules from '#root/services/rules.js';
import studentProfile from '#root/services/student-profile.js';
import { evaluateTitleEligibility } from '#root/services/evaluateTitleEligibility.js';
import User from '#root/models/user.js';
const router = Router();
const getRequestUser = (req) => req.session?.user || req.user || null;
router.get('/rules', async (_req, res) => {
  try {
    const data = await getRules();
    return res.json({ success: true, data });
  } catch (error) {
    return handleException(res, error);
  }
});
router.post('/rewards/evaluate-title', async (req, res) => {
  try {
    const requestUser = getRequestUser(req);
    const studentId = requestUser?.id ? Number(requestUser.id) : null;

    if (!Number.isInteger(studentId) || studentId < 1) {
      return res.status(401).json({ success: false, error: 'Not logged in' });
    }
    const result = await studentProfile({ studentId });
    const eligibility = await evaluateTitleEligibility({
      profileData: result.data,
      studentId,
    });

    if (eligibility.eligible) {
      await User.update(
        { titleId: eligibility.newTitle.id },
        { where: { id: studentId } }
      );
    }
    const titleChanged =
      eligibility.eligible &&
      result.data.title?.name !== eligibility.newTitle.name;
    return res.json({
      success: true,
      eligible: eligibility.eligible,
      titleChanged,
      title: eligibility.eligible
        ? {
            ...eligibility.newTitle,
          }
        : null,
    });
  } catch (error) {
    handleException(res, error);
  }
});

export default router;
