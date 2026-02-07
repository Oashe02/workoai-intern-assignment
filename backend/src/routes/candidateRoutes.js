import express from 'express';
import {
  newCandidate,
  getAlCandidates,
  getCandidate,
  updateCandidateStatus,
  deleteCandidate,
  getStats,
} from '../controllers/candidateController.js';

const router = express.Router();

router.get('/stats', getStats);

// crud
router.post('/', newCandidate);
router.get('/', getAlCandidates);
router.get('/:id', getCandidate);
router.put('/:id/status', updateCandidateStatus);
router.delete('/:id', deleteCandidate);

export default router;
