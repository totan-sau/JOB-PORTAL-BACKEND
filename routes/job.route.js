import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getAllJobs, getJobById, getJobsByAdminId, postJob } from '../controllers/job.controller.js';

const jobRouter = express.Router();

jobRouter.route("/post").post(isAuthenticated, postJob);
jobRouter.route("/get").get(isAuthenticated, getAllJobs);
jobRouter.route("/getadminjobs").get(isAuthenticated, getJobsByAdminId);
jobRouter.route("/get/:id").get(isAuthenticated, getJobById);

export default jobRouter;

