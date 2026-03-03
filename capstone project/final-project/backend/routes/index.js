import { Router } from 'express';
import userRouter from '#root/routes/api/user-controller.js';
import configRouter from '#root/routes/api/config-controller.js';
import challengeRouter from '#root/routes/rest/challenge-controller.js';
import matchSettingRouter from '#root/routes/rest/match-setting-controller.js';
import schemaRouter from '#root/routes/rest/schema-controller.js';
import submissionRouter from '#root/routes/rest/submission-controller.js';
import runRouter from '#root/routes/rest/run-controller.js';
import eventsRouter from '#root/routes/rest/events-controller.js';
import peerReviewController from '#root/routes/rest/peer-review-controller.js';
import rulesRouter from '#root/routes/rest/reward-controller.js';
import profileRouter from '#root/routes/rest/profile-controller.js';
const router = Router();

router.use('/api', userRouter);
router.use('/api', configRouter);

const restApiPrefix = '/api/rest';
router.use(restApiPrefix, challengeRouter);
router.use(restApiPrefix, matchSettingRouter);
router.use(restApiPrefix, schemaRouter);
router.use(restApiPrefix, submissionRouter);
router.use(restApiPrefix, runRouter);
router.use(restApiPrefix, eventsRouter);
router.use(restApiPrefix, peerReviewController);
router.use(restApiPrefix, rulesRouter);
router.use(restApiPrefix, profileRouter);
router.all(/\/api\/(.*)/, (_req, res) => {
  res.status(404);
  res.json({ status: 404, message: 'Not Found' });
});
export default router;
