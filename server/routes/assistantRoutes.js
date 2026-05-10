import { Router } from 'express';

export default function createAssistantRoutes({ assistantEngine, loadContext }) {
  const router = Router();

  router.post('/assistant/message', async (req, res, next) => {
    try {
      const { message, studentId } = req.body;

      if (!message || !studentId) {
        return res.status(400).json({ error: 'studentId and message are required' });
      }

      const context = await loadContext();
      const response = await assistantEngine.buildReply(message, context);

      res.json({
        id: `msg_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...response
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
