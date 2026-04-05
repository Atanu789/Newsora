function parsePagination(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize) || 12, 1), 50);
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
}

module.exports = { parsePagination };
