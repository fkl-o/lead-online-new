import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  getLeadsByStatus,
  getLeadStats,
  addCommunication,
  addTask,
  updateLeadStatus,
  getMyLeads,
  assignLead,
  bulkUpdateLeads,
  exportLeads,
  getLeadActivities
} from '../controllers/leads.js';

const router = express.Router();

// Public route for creating leads from forms
router.post('/create', createLead);

// Protected routes
router.use(protect);

// Lead management routes
router.route('/')
  .get(getLeads)
  .post(authorize('admin', 'user'), createLead);

router.route('/my-leads')
  .get(getMyLeads);

router.route('/stats')
  .get(authorize('admin', 'user'), getLeadStats);

router.route('/by-status')
  .get(authorize('admin', 'user'), getLeadsByStatus);

router.route('/export')
  .get(authorize('admin', 'user'), exportLeads);

router.route('/bulk-update')
  .patch(authorize('admin', 'user'), bulkUpdateLeads);

router.route('/:id')
  .get(getLead)
  .put(authorize('admin', 'user'), updateLead)
  .delete(authorize('admin'), deleteLead);

router.route('/:id/status')
  .patch(authorize('admin', 'user'), updateLeadStatus);

router.route('/:id/assign')
  .patch(authorize('admin'), assignLead);

router.route('/:id/communication')
  .post(authorize('admin', 'user'), addCommunication);

router.route('/:id/task')
  .post(authorize('admin', 'user'), addTask);

router.route('/:id/activities')
  .get(authorize('admin', 'user'), getLeadActivities);

export default router;
