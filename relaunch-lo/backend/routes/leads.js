import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../config/upload.js';
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
  getLeadActivities,
  uploadAttachment,
  downloadAttachment,
  deleteAttachment,
  getRecentActivities
} from '../controllers/leads.js';

const router = express.Router();

// Public route for creating leads from forms
router.post('/create', createLead);

// Protected routes
router.use(protect);

// Lead management routes
router.route('/')
  .get(getLeads)
  .post(authorize('admin', 'vertrieb'), createLead);

router.route('/my-leads')
  .get(getMyLeads);

router.route('/stats')
  .get(authorize('admin', 'vertrieb', 'kunde'), getLeadStats);

router.route('/activities')
  .get(authorize('admin', 'vertrieb', 'kunde'), getRecentActivities);

router.route('/by-status')
  .get(authorize('admin', 'vertrieb', 'kunde'), getLeadsByStatus);

router.route('/export')
  .get(authorize('admin', 'vertrieb'), exportLeads);

router.route('/bulk-update')
  .patch(authorize('admin', 'vertrieb'), bulkUpdateLeads);

router.route('/:id')
  .get(getLead)
  .put(authorize('admin', 'vertrieb'), updateLead)
  .delete(authorize('admin'), deleteLead);

router.route('/:id/status')
  .patch(authorize('admin', 'vertrieb'), updateLeadStatus);

router.route('/:id/assign')
  .patch(authorize('admin'), assignLead);

router.route('/:id/communication')
  .post(authorize('admin', 'vertrieb', 'kunde'), addCommunication);

router.route('/:id/task')
  .post(authorize('admin', 'vertrieb', 'kunde'), addTask);

router.route('/:id/attachments')
  .post(authorize('admin', 'vertrieb', 'kunde'), upload.single('file'), uploadAttachment);

router.route('/:id/attachments/:attachmentId/download')
  .get(authorize('admin', 'vertrieb', 'kunde'), downloadAttachment);

router.route('/:id/attachments/:attachmentId')
  .delete(authorize('admin'), deleteAttachment);

router.route('/:id/activities')
  .get(authorize('admin', 'vertrieb', 'kunde'), getLeadActivities);

export default router;
