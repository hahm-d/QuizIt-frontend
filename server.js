const io= require('socket.io')(3001)

//list of students
const users = {}

io.on('connection', socket => {

    //socket.emit('intro-message', `Welcome! Session will begin once the host starts the quiz`)
    socket.on('new-user', name => {
        //each socket has a unique id thus can use to set with users
        users[socket.id] = name
        socket.broadcast.emit("user-connected", name)
    })
    socket.on('send-chat-message', message => {
       
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id]})
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})
