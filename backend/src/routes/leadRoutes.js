const express = require("express");
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  handleValidationErrors,
} = require("../middlewares/validationMiddleware");
const {
  createLeadValidation,
  updateLeadValidation,
} = require("../validators/leadValidator");

const router = express.Router();

//must be authenticated
router.use(authMiddleware);

router
  .route("/")
  .get(getLeads)
  .post(createLeadValidation, handleValidationErrors, createLead);

router
  .route("/:id")
  .get(getLead)
  .put(updateLeadValidation, handleValidationErrors, updateLead)
  .delete(deleteLead);

module.exports = router;
