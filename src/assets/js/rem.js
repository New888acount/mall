;(function flexible(window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  // adjust body font size 这个是动态给body赋值font-size 目前用不到
  //   function setBodyFontSize() {
  //     if (document.body) {
  //       document.body.style.fontSize = 12 * dpr + "px";
  //     } else {
  //       document.addEventListener("DOMContentLoaded", setBodyFontSize);
  //     }
  //   }
  //setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit() {
    // 这个是其他方案
    // var rem =  (docEl.clientWidth * 13.65) / 375
    // if(docEl.clientWidth > 650){
    //   rem = 160/10
    // }
    // 这个是竞品方案 设计稿是440
    //var rem =  16*(docEl.clientWidth<=650 ? docEl.clientWidth/440 : 1)
    // 这个是竞品方案 设计稿是375
    var rem = 16 * (docEl.clientWidth <= 650 ? docEl.clientWidth / 375 : 1)
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
})(window, document)
