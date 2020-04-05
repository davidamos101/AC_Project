(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const movieType = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama",
    "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction",
    "TV Movie", "Thriller", "War", "Western"]

  const ITEM_PER_PAGE = 8
  const typePanel = document.getElementById('type-panel')
  const showPanel = document.getElementById('show-panel')
  const pagination = document.getElementById('pagination')

  axios.get(INDEX_URL).then(response => {
    //console.log(response.data.results[0])
    data.push(...response.data.results)
    displayMovieType()
    displayMovie(0)
  }).catch(err => console.log(err))

  typePanel.addEventListener('click', event => {
    if (event.target.dataset.id !== undefined) {
      const test = document.querySelectorAll('.list-group-item')
      //console.log(event.target.dataset.id)
      test.forEach(item => { item.classList.remove('active') })
      for (let i = 0; i < test.length; i++) {
        if (i === Number(event.target.dataset.id)) {
          test[i].classList.add('active')
        }
      }
      displayMovie(Number(event.target.dataset.id))
    }
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    //console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  function displayMovieType() {
    let htmlContent = '<ul class="list-group">'
    for (let i = 0; i < movieType.length; i++) {
      let count = countType(i)
      if (i === 0) {
        htmlContent += `<li class="d-flex justify-content-between align-items-center list-group-item list-group-item-action active" data-id=${i}>${movieType[i]}
        <span class="badge badge-success badge-pill">${count}</span>
        </li>`
      }
      else {
        htmlContent += `<li class="d-flex justify-content-between align-items-center list-group-item list-group-item-action" data-id=${i}>${movieType[i]}
        <span class="badge badge-success badge-pill">${count}</span>
        </li>`
      }
    }
    htmlContent += '</ul>'
    typePanel.innerHTML = htmlContent
  }

  function countType(index) {
    let count = 0
    data.forEach(item => {
      item.genres.forEach(typeID => {
        if (typeID === Number(index) + 1) { count++ }
      })
    })
    return count
  }

  function getTotalPages(dataLength) {
    let totalPages = Math.ceil(dataLength / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    let htmlContent = '<div class="container-fluid"><div class="row">'
    pageData.forEach(item => {
      let genresStr = ''
      for (let i = 0; i < item.genres.length; i++) {
        const id = item.genres[i] - 1
        genresStr += `<small class="d-inline bg-light mr-2">${movieType[id]}</small>`
      }
      htmlContent += `
            <div class="col-3">
              <div class="card my-2">
                <img class="card-img-top" src="${POSTER_URL}${item.image}" alt="Card image cap">
                <div class="card-body movie-item-body">
                  <h6 class="card-title">${item.title}</h6>
                  ${genresStr}
                </div>
              </div>
            </div>
          `
    })
    htmlContent += '</div></div>'
    showPanel.innerHTML = htmlContent
  }

  function displayMovie(index) {
    let dataGenres = []
    data.forEach(item => {
      item.genres.forEach(typeID => {
        if (typeID === Number(index) + 1) {
          dataGenres.push(item)
        }
      })
    })

    //顯示分頁
    const count = countType(index)
    getTotalPages(count)
    getPageData(1, dataGenres)
  }
})()