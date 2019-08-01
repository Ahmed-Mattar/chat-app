const socket = io()

// server (emit) -> Client (receive) -- acknowledgement --> server

// client (emit) -> server (recieve) -- acknowledgement --> client

socket.on('message', (message) => {
    console.log(message)
})

const form = document.querySelector('#message-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message , (error) => {
        if(error){
            return console.log(error)
        }
        console.log('message deliverd!')
    })

})

document.querySelector('#send-location').addEventListener('click', () => {
   if (!navigator.geolocation){
       return alert('Geolocation is not supported by your browser.')
   }

   navigator.geolocation.getCurrentPosition((position) => {
        const {coords: {latitude}, coords:{longitude}} = position
        socket.emit('sendLocation', {latitude,longitude}, () => {
            console.log('Location shared!')
        })
   })

})
