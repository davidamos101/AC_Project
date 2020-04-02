(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  let pageNow = 1     //紀錄目前在哪一頁
  let mode = 'card'   //紀錄目前是哪個mode
  let results         //拉到全域變數, 當目前是搜尋狀態時也可以正常切換顯示模式

  const dataPanel = document.getElementById('data-panel')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const modeSel = document.getElementById('mode-select')

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    document.getElementById('mode-card').style.color = "Mediumslateblue"
    document.getElementById('mode-list').style.color = "black"
    getTotalPages(data)
    // displayDataList(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      //console.log(event.target.dataset.id)
      addFavoriteItem(event.target.dataset.id)
    }
  })

  // listen to search form submit event
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    results = data.filter(
      movie => movie.title.toLowerCase().includes(input)
    )
    //console.log(results)
    // displayDataList(results)
    pageNow = 1
    getTotalPages(results)
    getPageData(1, results)
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    //console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      pageNow = event.target.dataset.page
      getPageData(event.target.dataset.page)
    }
  })

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
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
    if (mode === 'card') {
      displayDataList_card(pageData)
    }
    else {
      displayDataList_list(pageData)
    }
  }

  function displayDataList_card(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button --> 
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    //console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      //console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  //在list模式下的UI
  function displayDataList_list(data) {
    let htmlContent = '<ul class="list-group list-group-flush col-12">'
    data.forEach(function (item, index) {
      htmlContent += `
        <li class="list-group-item d-flex justify-content-between align-items-center">${item.title}
          <div>
              <!-- "More" button -->
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button --> 
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </li>
      `
    })
    htmlContent += '</ul>'
    dataPanel.innerHTML = htmlContent
  }

  //新增切換模式時的event
  modeSel.addEventListener('click', event => {
    //console.log(event.target)
    //console.log(pageNow)
    if (event.target.matches('#mode-card')) {
      mode = 'card'
      document.getElementById('mode-card').style.color = "Mediumslateblue"
      document.getElementById('mode-list').style.color = "black"
    }
    else if (event.target.matches('#mode-list')) {
      mode = 'list'
      document.getElementById('mode-list').style.color = "Mediumslateblue"
      document.getElementById('mode-card').style.color = "black"
    }
    if (searchInput.value !== '') {
      getTotalPages(results)
      getPageData(pageNow, results)
    }
    else {
      getTotalPages(data)
      getPageData(pageNow, data)
    }
    //console.log(mode)
  })
})()