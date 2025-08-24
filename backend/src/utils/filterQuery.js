const buildFilterQuery = (filters) => {
  const query = {};
  
  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (!value && value !== 0 && value !== false) return; 
    
    //for search
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

    //stings case insensitive
    else if (key.endsWith("_equals")) {
      const fieldName = key.replace("_equals", "");
      query[fieldName] = { $regex: `^${value}$`, $options: "i" };
    }
    else if (key.endsWith("_contains")) {
      const fieldName = key.replace("_contains", "");
      query[fieldName] = { $regex: value, $options: "i" };
    }

    //enum operators
    else if (key === "status_in") {
      const values = value.split(",").map(v => v.trim());
      query.status = { $in: values.map(v => new RegExp(`^${v}$`, "i")) };
    }
    else if (key === "source_in") {
      const values = value.split(",").map(v => v.trim());
      query.source = { $in: values.map(v => new RegExp(`^${v}$`, "i")) };
    }
    else if (key === "city_in") {
      const values = value.split(",").map(v => v.trim());
      query.city = { $in: values.map(v => new RegExp(`^${v}$`, "i")) };
    }
    else if (key === "state_in") {
      const values = value.split(",").map(v => v.trim());
      query.state = { $in: values.map(v => new RegExp(`^${v}$`, "i")) };
    }

    //number operators 
    else if (key.endsWith("_gt")) {
      const fieldName = key.replace("_gt", "");
      if (!query[fieldName]) query[fieldName] = {};
      query[fieldName].$gt = Number(value);
    }
    else if (key.endsWith("_lt")) {
      const fieldName = key.replace("_lt", "");
      if (!query[fieldName]) query[fieldName] = {};
      query[fieldName].$lt = Number(value);
    }
    else if (key.endsWith("_gte")) {
      const fieldName = key.replace("_gte", "");
      if (!query[fieldName]) query[fieldName] = {};
      query[fieldName].$gte = Number(value);
    }
    else if (key.endsWith("_lte")) {
      const fieldName = key.replace("_lte", "");
      if (!query[fieldName]) query[fieldName] = {};
      query[fieldName].$lte = Number(value);
    }
    else if (key.endsWith("_between")) {
      const fieldName = key.replace("_between", "");
      const [min, max] = value.split(",").map(Number);
      if (min !== undefined && max !== undefined) {
        query[fieldName] = { $gte: min, $lte: max };
      }
    }

    //date operators
    else if (key === "created_on") {
      const startOfDay = new Date(value);
      const endOfDay = new Date(value);
      endOfDay.setDate(endOfDay.getDate() + 1);
      query.createdAt = { $gte: startOfDay, $lt: endOfDay };
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
    else if (key === "created_between") {
      const [startDate, endDate] = value.split(",");
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1); 
        query.createdAt = { $gte: start, $lt: end };
      }
    }

    //last activity date operators
    else if (key === "last_activity_on") {
      const startOfDay = new Date(value);
      const endOfDay = new Date(value);
      endOfDay.setDate(endOfDay.getDate() + 1);
      query.last_activity_at = { $gte: startOfDay, $lt: endOfDay };
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
    else if (key === "last_activity_between") {
      const [startDate, endDate] = value.split(",");
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1); 
        query.last_activity_at = { $gte: start, $lt: end };
      }
    }

    //boolean operator
    else if (key === "is_qualified") {
      query.is_qualified = value === "true" || value === true;
    }

    //direct field matching 
    else {
      if (typeof value === 'string' && 
          (key === 'status' || key === 'source' || key === 'city' || key === 'state' || 
           key === 'email' || key === 'company' || key === 'first_name' || key === 'last_name')) {
        query[key] = { $regex: `^${value}$`, $options: "i" };
      } else {
        query[key] = value;
      }
    }
  });
  
  return query;
};

module.exports = { buildFilterQuery };