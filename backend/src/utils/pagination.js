const getPaginationData = (page, limit) => {
  const pageNum = Number.parseInt(page) || 1;
  const limitNum = Number.parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  return {
    skip,
    limitNum,
    pageNum,
  };
};

module.exports = { getPaginationData };
