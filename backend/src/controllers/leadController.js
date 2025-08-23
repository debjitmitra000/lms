const Lead = require("../models/Lead");
const { buildFilterQuery } = require("../utils/filterQuery");
const { getPaginationData } = require("../utils/pagination");

//createlead
const createLead = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      user: req.user.userId,
    };

    const lead = await Lead.create(leadData);
    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

//getallleads
const getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;

    const filterQuery = buildFilterQuery(filters);
    filterQuery.user = req.user.userId;

    const { skip, limitNum } = getPaginationData(page, limit);

    const leads = await Lead.find(filterQuery)
      .skip(skip)
      .limit(limitNum)
      .sort({ created_at: -1 });

    const total = await Lead.countDocuments(filterQuery);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: leads,
      page: Number.parseInt(page),
      limit: limitNum,
      total,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//getsinglelead
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//updatelead
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { ...req.body, last_activity_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

//deletelead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
};
