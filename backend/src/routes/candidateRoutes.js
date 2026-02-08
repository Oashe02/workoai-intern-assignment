import express from 'express';
import {
  newCandidate,
  getAlCandidates,
  getCandidate,
  updateCandidateStatus,
  deleteCandidate,
  getStats,
  getResume,
} from '../controllers/candidateController.js';
import protect from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/stats', getStats);

// crud
router.post('/', newCandidate);
router.get('/', getAlCandidates);
router.get('/:id', getCandidate);
router.get('/:id/resume', getResume);
router.put('/:id/status', updateCandidateStatus);
router.delete('/:id', deleteCandidate);

export default router;
