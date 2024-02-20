
module.exports = (query) => {
  let objSearch = {
    keyWord: '',
    regex: ''
  }

  if (query.keyWord) {
    objSearch.keyWord = query.keyWord
    const regex = new RegExp(objSearch.keyWord, 'i')

    objSearch.regex = regex
  }

  return objSearch

}


