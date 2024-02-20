
module.exports = (objPagination, query, countTasks) => {
  
  if(query.page) {
    objPagination.currentPage = parseInt(query.page)
  }

  if(query.limit) {
    objPagination.limitPage = parseInt(query.limit)
  }

  objPagination.skip = (objPagination.currentPage - 1) * objPagination.limitPage
  objPagination.totalPage = Math.ceil(countTasks / objPagination.limitPage)

  return objPagination
}
