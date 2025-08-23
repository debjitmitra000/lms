const { body, param } = require("express-validator");

const createLeadValidation = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name must be less than 50 characters"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name must be less than 50 characters"),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email")
    .isLength({ max: 100 })
    .withMessage("Email must be less than 100 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone must be between 10 and 15 characters"),

  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company is required")
    .isLength({ max: 100 })
    .withMessage("Company name must be less than 100 characters"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ max: 50 })
    .withMessage("City must be less than 50 characters"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ max: 50 })
    .withMessage("State must be less than 50 characters"),

  body("source")
    .isIn([
      "website",
      "facebook_ads",
      "google_ads",
      "referral",
      "events",
      "other",
    ])
    .withMessage(
      "Invalid source. Must be one of: website, facebook_ads, google_ads, referral, events, other"
    ),

  body("status")
    .optional()
    .isIn(["new", "contacted", "qualified", "lost", "won"])
    .withMessage(
      "Invalid status. Must be one of: new, contacted, qualified, lost, won"
    ),

  body("score")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Score must be an integer between 0 and 100"),

  body("lead_value")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Lead value must be a positive number"),

  body("is_qualified")
    .optional()
    .isBoolean()
    .withMessage("is_qualified must be a boolean value"),
];

const updateLeadValidation = [
  param("id").isMongoId().withMessage("Invalid lead ID"),

  body("first_name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty")
    .isLength({ max: 50 })
    .withMessage("First name must be less than 50 characters"),

  body("last_name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Last name must be less than 50 characters"),

  body("email")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email")
    .isLength({ max: 100 })
    .withMessage("Email must be less than 100 characters"),

  body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone cannot be empty")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone must be between 10 and 15 characters"),

  body("company")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Company cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Company name must be less than 100 characters"),

  body("city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty")
    .isLength({ max: 50 })
    .withMessage("City must be less than 50 characters"),

  body("state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty")
    .isLength({ max: 50 })
    .withMessage("State must be less than 50 characters"),

  body("source")
    .optional()
    .isIn([
      "website",
      "facebook_ads",
      "google_ads",
      "referral",
      "events",
      "other",
    ])
    .withMessage(
      "Invalid source. Must be one of: website, facebook_ads, google_ads, referral, events, other"
    ),

  body("status")
    .optional()
    .isIn(["new", "contacted", "qualified", "lost", "won"])
    .withMessage(
      "Invalid status. Must be one of: new, contacted, qualified, lost, won"
    ),

  body("score")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Score must be an integer between 0 and 100"),

  body("lead_value")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Lead value must be a positive number"),

  body("is_qualified")
    .optional()
    .isBoolean()
    .withMessage("is_qualified must be a boolean value"),
];

module.exports = {
  createLeadValidation,
  updateLeadValidation,
};
