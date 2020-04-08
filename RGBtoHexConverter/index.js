(function () {
  const sliderR = $("#sliderR")
  const sliderG = $("#sliderG")
  const sliderB = $("#sliderB")

  const numberR = document.getElementById("numberR")
  const numberG = document.getElementById("numberG")
  const numberB = document.getElementById("numberB")
  let body = document.getElementsByTagName('body')[0]
  let rgbStr = document.getElementById("rgbStr")

  let valueR = 0, valueG = 0, valueB = 0

  //轉16進制並補0
  function rgbToHex(rgb) {
    let hex = Number(rgb).toString(16)
    if (hex.length < 2) {
      hex = "0" + hex
    }
    return hex
  }

  function ModifyBG() {
    let hexR = rgbToHex(valueR)
    let hexG = rgbToHex(valueG)
    let hexB = rgbToHex(valueB)
    rgbStr.innerHTML = `#${hexR}${hexG}${hexB}`
    let color_tmp = `#${hexR}${hexG}${hexB}`
    body.style.backgroundColor = color_tmp
  }

  sliderR.on("input change", function (e) {
    numberR.innerHTML = $(this).val()
    valueR = $(this).val()
    ModifyBG()
  })

  sliderG.on("input change", function (e) {
    numberG.innerHTML = $(this).val()
    valueG = $(this).val()
    ModifyBG()
  })

  sliderB.on("input change", function (e) {
    numberB.innerHTML = $(this).val()
    valueB = $(this).val()
    ModifyBG()
  })
})()