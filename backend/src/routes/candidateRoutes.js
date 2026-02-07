import express from 'express';
import {
  newCandidate,
  getAlCandidates,
  getCandidate,
  updateCandidateStatus,
  deleteCandidate,
  getStats,
} from '../controllers/candidateController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/stats', getStats);

// crud
router.post('/', upload.single('resume'), newCandidate);
router.get('/', getAlCandidates);
router.get('/:id', getCandidate);
router.put('/:id/status', updateCandidateStatus);
router.delete('/:id', deleteCandidate);

export default router;
