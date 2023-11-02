console.log('Loaded chrome extension')

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    const element = document.getElementsByClassName('css-sgdghx')
    element.innerHTML = 'Now I have been modified!'
  }
}