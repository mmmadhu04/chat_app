const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const {genMsg, genLocMsg} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/utils')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const pubDirPath = path.join(__dirname, '../public')

app.use(express.static(pubDirPath))

io.on('connection', (socket) => {

    socket.on('join', ({username, room}, cb) => {
        const {error, user} = addUser({
            id: socket.id,
            username,
            room
        })

        if(error) {
            return cb(error)
        }

        socket.join(user.room)

        socket.emit('message', genMsg('Admin', 'Welcome !'))
        socket.broadcast.to(user.room).emit('message', genMsg('Admin', user.username + ' joined !'))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        cb()
    })

    socket.on('sendMessage', (msg, cb) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('message', genMsg(user.username, msg))
        cb()
    })

    socket.on('sendLocation', (loc, cb) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', genLocMsg(user.username, 'https://google.com/maps?q=' + loc.latitude + ',' + loc.longitude))
        
        cb()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', genMsg('Admin', user.username + ' left !'))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log('Server up on ' + port)
})