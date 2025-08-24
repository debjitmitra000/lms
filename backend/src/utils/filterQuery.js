const buildFilterQuery = (filters) => {
  const query = {};
  
  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (!value) return;
    
    if (key === "search") {
      query.$or = [
        { first_name: { $regex: value, $options: "i" } },
        { last_name: { $regex: value, $options: "i" } },
        { email: { $regex: value, $options: "i" } },
        { company: { $regex: value, $options: "i" } },
        { phone: { $regex: value, $options: "i" } },
        { city: { $regex: value, $options: "i" } },
        { state: { $regex: value, $options: "i" } }
      ];
    }

    else if (key === "created_after") {
      if (!query.createdAt) query.createdAt = {};
      query.createdAt.$gte = new Date(value);
    }
    else if (key === "created_before") {
      if (!query.createdAt) query.createdAt = {};

      const beforeDate = new Date(value);
      beforeDate.setDate(beforeDate.getDate() + 1);
      query.createdAt.$lt = beforeDate;
    }

    else if (key === "last_activity_after") {
      if (!query.last_activity_at) query.last_activity_at = {};
      query.last_activity_at.$gte = new Date(value);
    }
    else if (key === "last_activity_before") {
      if (!query.last_activity_at) query.last_activity_at = {};

      const beforeDate = new Date(value);
      beforeDate.setDate(beforeDate.getDate() + 1);
      query.last_activity_at.$lt = beforeDate;
    }
    
    else if (key === "status_in") {
      query.status = { $in: value.split(",") };
    }
    else if (key === "source_in") {
      query.source = { $in: value.split(",") };
    }
    else if (key === "city_in") {
      query.city = { $in: value.split(",") };
    }
    else if (key === "state_in") {
      query.state = { $in: value.split(",") };
    }
    else if (key === "is_qualified") {
      query.is_qualified = value === "true";
    }
    else {
      query[key] = value;
    }
  });
  
  return query;
};

module.exports = { buildFilterQuery };