const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '..', 'public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    
    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({ id:socket.id, username, room })

        if (error) {
           return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })


    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        const user = getUser(socket.id)

        if( filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })

    socket.on('sendLocation', ({latitude,longitude}, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, latitude,longitude))
        callback()    
    })


})


server.listen(port, () => {
    console.log(`server is up and running on port: ${port}`)
})


// socket.emit  for a specific client
// io.emit  for all clients
// socket.broadcast.emit for all clients except the one who sent it
//  rooms
// io.to.emit  emits events to everybody in a specific chatroom
// socket.broadcast.to.emit  limited to a specific chatroom 