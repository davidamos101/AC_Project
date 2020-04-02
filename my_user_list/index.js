(function () {
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const DETAIL_URL = BASE_URL + '/api/v1/users/'
  const data = []
  let pageNow = 1     //紀錄目前在哪一頁
  let mode = 'card'   //紀錄目前是哪個mode
  let results         //拉到全域變數, 當目前是搜尋狀態時也可以正常切換顯示模式
  const dataPanel = document.getElementById('data-panel')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const closeBtn = document.getElementById('close')
  const pagination = document.getElementById('pagination')
  const modeSel = document.getElementById('mode-select')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  axios.get(`${DETAIL_URL}`)
    .then(response => {
      //console.log(response.data)
      console.log(response.data.results[0])
      data.push(...response.data.results)
      document.getElementById('mode-card').style.color = "Mediumslateblue"
      document.getElementById('mode-list').style.color = "black"
      getTotalPages(data)
      getPageData(1, data)
    }).catch(error => {
      console.log(error)
    })

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    //console.log(event.target)
    if (event.target.matches('.card-title') || event.target.matches('.card-body') || event.target.matches('.card-footer') || event.target.matches('.card-text') || event.target.matches('.list-group-item')) {
      //console.log(event.target.dataset.id)
      showUserInfo(event.target.dataset.id)
    }
  })

  // listen to search form submit event
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    //console.log(input)
    results = data.filter(function (item) {
      const fullName = `${item.name} ${item.surname}`
      return fullName.toLowerCase().includes(input)
    })
    //console.log(results)
    pageNow = 1
    getTotalPages(results)
    getPageData(1, results)
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
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
      const fullName = `${item.name} ${item.surname}`
      htmlContent += `
        <div class="col-2">
          <div class="image-flip">
            <div class="mainflip my-2">
              <div class="frontside">
                <div class="card shadow align-items-center pt-4">
                  <img class="card-img-top rounded-circle w-75" src="${item.avatar}" alt="Card image cap">
                  <div class="card-body user-item-body">
                    <h5 class="card-title">${fullName}</h5>
                    <h5 class="card-title">age: ${item.age}</h5>
                  </div>
                </div>
              </div>
              <div class="backside" data-toggle="modal" data-target="#show-user-modal">
                <div class="card shadow align-items-center pt-4">
                  <div class="card-body user-item-body" data-id="${item.id}">
                    <h5 class="card-title" data-id="${item.id}">${fullName}</h5>
                    <p class="card-text" data-id="${item.id}">birthday: ${item.birthday}</p>
                  </div>
                  <ul class="list-inline card-footer" data-id="${item.id}">
                      <li class="list-inline-item">
                        <i class="fa fa-facebook"></i>
                      </li>
                      <li class="list-inline-item">
                        <i class="fa fa-twitter"></i>
                      </li>
                      <li class="list-inline-item">
                        <i class="fa fa-skype"></i>
                      </li>
                      <li class="list-inline-item">
                        <i class="fa fa-google"></i>
                      </li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showUserInfo(id) {
    // get elements
    const userTitle = document.getElementById('show-user-title')
    const usermbody = document.getElementById('show-user-body')

    // set request url
    const url = DETAIL_URL + id
    //console.log(url)

    // send request to show api
    axios.get(url)
      .then(response => {
        const data = response.data
        console.log(data)

        // insert data into modal
        const fullName = `${data.name} ${data.surname}`
        userTitle.textContent = fullName
        const mbhtmlStr = `<div class="d-flex row no-gutters">
            <div class="col-md-6 mx-auto my-auto" id="show-user-image">
              <img src=${data.avatar} class="rounded mx-auto d-block" alt="Responsive image">
            </div>
            <div class="col-md-6">
              <ul class="list-group list-group-flush">
                <li class="list-group-item" id="show-user-age">Age: ${data.age}</li>
                <li class="list-group-item" id="show-user-birthday">Birthday: ${data.birthday}</li>
                <li class="list-group-item" id="show-user-gender">Gender: ${data.gender}</li>
                <li class="list-group-item" id="show-user-region">Region: ${data.region}</li>
                <li class="list-group-item" id="show-user-email">Email: ${data.email}</li>
              </ul>
            </div>
          </div>`
        usermbody.innerHTML = mbhtmlStr
      }).catch(error => {
        console.log(error)
      })
  }

  //在list模式下的UI
  function displayDataList_list(data) {
    let htmlContent = '<ul class="list-group list-group-flush col-12 m-2">'
    data.forEach(function (item, index) {
      const fullName = `${item.name} ${item.surname}`
      htmlContent += `
        <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${item.id}" data-toggle="modal" data-target="#show-user-modal">${fullName}
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

  //清除彈窗原資料
  $(".modal").on("hidden.bs.modal", function () {
    $(".modal-body").html("");
  });
})()