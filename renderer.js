const { ipcRenderer } = require('electron')

let inputText = document.getElementById('url')
inputText.addEventListener('keypress', (event) => {
  if (event.key == 'Enter') {
    ipcRenderer.send('update', {
      url: inputText.value
    })
  }
})

const initApp = () => {

}


  




window.addEventListener('load', initApp, false)

// Response
ipcRenderer.on('reply', (event, args) => {
  console.log(args.message)
})
