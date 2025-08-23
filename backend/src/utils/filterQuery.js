const buildFilterQuery = (filters) => {
  const query = {};

  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (!value) return;

    if (key.includes("_contains")) {
      const field = key.replace("_contains", "");
      query[field] = { $regex: value, $options: "i" };
    } else if (key.includes("_gt")) {
      const field = key.replace("_gt", "");
      query[field] = { $gt: Number(value) };
    } else if (key.includes("_lt")) {
      const field = key.replace("_lt", "");
      query[field] = { $lt: Number(value) };
    } else if (key.includes("_gte")) {
      const field = key.replace("_gte", "");
      query[field] = { $gte: Number(value) };
    } else if (key.includes("_lte")) {
      const field = key.replace("_lte", "");
      query[field] = { $lte: Number(value) };
    } else if (key.includes("_in")) {
      const field = key.replace("_in", "");
      query[field] = { $in: value.split(",") };
    } else if (key.includes("_before")) {
      const field = key.replace("_before", "");
      query[field] = { $lt: new Date(value) };
    } else if (key.includes("_after")) {
      const field = key.replace("_after", "");
      query[field] = { $gt: new Date(value) };
    } else if (key.includes("_between")) {
      const field = key.replace("_between", "");
      const [start, end] = value.split(",");
      query[field] = {
        $gte: isNaN(start) ? new Date(start) : Number(start),
        $lte: isNaN(end) ? new Date(end) : Number(end),
      };
    } else {
      query[key] = value;
    }
  });

  return query;
};

module.exports = { buildFilterQuery };
