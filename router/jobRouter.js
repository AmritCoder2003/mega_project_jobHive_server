import express from "express";
import {check} from "express-validator"
import {isAuthorized} from "../middleware/check-auth.js"
const jobRouter = express.Router();
import {
  createJob,
  getAllJobs,
  getAllJobsByUser,
  getAllJobsByEmployer,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

jobRouter.get("/", getAllJobs);

jobRouter.get("/user/",isAuthorized, getAllJobsByUser);

jobRouter.get("/employer",isAuthorized, getAllJobsByEmployer);

jobRouter.post("/create", [
  check('title').not().isEmpty().withMessage('Title is required'),
  check('description').isLength({ min: 20 }).withMessage('Description should be at least 20 characters'),
  check('company').not().isEmpty().withMessage('Company is required'),
  check('category').not().isEmpty().withMessage('Category is required'),
  check('country').not().isEmpty().withMessage('Country is required'),
  check('city').not().isEmpty().withMessage('City is required'),
  check('location').not().isEmpty().withMessage('Location is required'),
  check('salaryFrom').not().isEmpty().isNumeric().withMessage('Salary Range is required'),
  check('salaryTo').not().isEmpty().isNumeric().withMessage('Salary Range is required'),
  check('salaryPeriod').optional().isIn(['monthly', 'annual']).withMessage('Salary Period should be either monthly or annual'),
  check('type').optional().isIn(['fulltime', 'parttime',, 'internship']).withMessage('Type should be either fulltime, parttime or internshipship'),
  check('workstation').optional().isIn(['remote', 'onsite', 'hybrid']).withMessage('Workstation should be either remote , onsite or hybrid' ),
 
], isAuthorized, createJob);

jobRouter.get("/getJob/:id", getJob);
jobRouter.patch("/update/:id",[
  check('title').not().isEmpty().withMessage('Title is required'),
  check('description').isLength({ min: 20 }).withMessage('Description should be at least 20 characters'),
  check('category').not().isEmpty().withMessage('Category is required'),
  check('country').not().isEmpty().withMessage('Country is required'),
  check('city').not().isEmpty().withMessage('City is required'),
  check('location').not().isEmpty().withMessage('Location is required'),
  check('expired').not().isEmpty().withMessage('Expired is required'),
  check('salaryFrom').not().isEmpty().isNumeric().withMessage('Salary Range is required'),
  check('salaryTo').not().isEmpty().isNumeric().withMessage('Salary Range is required'),
  check('salaryPeriod').optional().isIn(['monthly', 'annual']).withMessage('Salary Period should be either monthly or annual'),
  check('type').optional().isIn(['fulltime', 'parttime',, 'internship']).withMessage('Type should be either fulltime, parttime or Internship'),
  check('workstation').optional().isIn(['remote', 'onsite', 'hybrid']).withMessage('Workstation should be either remote , onsite or hybrid' ),
], isAuthorized,updateJob);
jobRouter.delete("/delete/:id",isAuthorized, deleteJob);

export default jobRouter;
