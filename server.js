const io= require('socket.io')(3000)

//list of students
const users = {}
//list of groupChat
const chatGroupList = []

io.on('connection', socket => {
    //console.log(new user)
    socket.emit('intro-message', 'Hello Class! Session will begin once the host starts the quiz')
    //display the messages after host has emitted message
    socket.on('new-user', name => {
        //each socket has a unique id thus can use to set with users
        users[socket.id] = name
        socket.broadcast.emit("user-connected", name) //handle this back on client
    })
    socket.on('send-chat-message', message => {
       
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id]})
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})
