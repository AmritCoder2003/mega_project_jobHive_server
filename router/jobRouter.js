import express from "express";
import {check} from "express-validator"
import {isAuthorized} from "../middleware/check-auth.js"
const jobRouter = express.Router();
import {
  createJob,
  getAllJobs,
  getAllJobsByUser,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

jobRouter.get("/", getAllJobs);

jobRouter.get("/user/",isAuthorized, getAllJobsByUser);

jobRouter.post("/create/", [
  check('title').not().isEmpty().withMessage('Title is required'),
  check('description').isLength({ min: 20 }).withMessage('Description should be at least 20 characters'),
  check('company').not().isEmpty().withMessage('Company is required'),
  check('category').not().isEmpty().withMessage('Category is required'),
  check('country').not().isEmpty().withMessage('Country is required'),
  check('city').not().isEmpty().withMessage('City is required'),
  check('location').not().isEmpty().withMessage('Location is required'),
  check('fixedSalary').optional().isNumeric().withMessage('Fixed Salary should be a number'),
  check('salaryForm').optional().isNumeric().withMessage('Salary Form should be a number'),
  check('salaryTo').optional().isNumeric().withMessage('Salary To should be a number'),
], isAuthorized, createJob);
jobRouter.get("/getJob/:id", getJob);
jobRouter.patch("/update/:id",[
  check('title').not().isEmpty().withMessage('Title is required'),
  check('description').isLength({ min: 20 }).withMessage('Description should be at least 20 characters'),
  check('company').not().isEmpty().withMessage('Company is required'),
  check('category').not().isEmpty().withMessage('Category is required'),
  check('country').not().isEmpty().withMessage('Country is required'),
  check('city').not().isEmpty().withMessage('City is required'),
  check('location').not().isEmpty().withMessage('Location is required'),
  check('fixedSalary').optional().isNumeric().withMessage('Fixed Salary should be a number'),
  check('salaryForm').optional().isNumeric().withMessage('Salary Form should be a number'),
  check('salaryTo').optional().isNumeric().withMessage('Salary To should be a number'),
], isAuthorized,updateJob);
jobRouter.delete("/delete/:id",isAuthorized, deleteJob);

export default jobRouter;
