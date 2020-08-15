const socket = io("http://localhost:3000")
const messageContainer = document.getElementById("host-container")
const messageForm = document.getElementById("send-container")
const messageInput = document.getElementById("message-input")
//student name
const name = prompt("what is your name?")
appendMessage("you joined the class!")

socket.emit('new-user', name)

socket.on("intro-message", data => {
    appendMessage(data)
   
})

socket.on("chat-message", data => {
     appendMessage(`${data.name}: ${data.message}`)
})
socket.on("user-connected", name => {
    appendMessage(`${name} joined the class!`)
})
socket.on("user-disconnected", name => {
    appendMessage(`${name} left the class.`)
})

messageForm.addEventListener("submit", e => {
    e.preventDefault()
    //get message
    const message = messageInput.value
    //emit the message
    socket.emit("send-chat-message", message)
    //after emitting, clear out the value of this variable
    messageInput.value = ''
    //users sees his/her own message
    appendMessage(`${name}: ${message}`)
})

//function for appending messages
function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    console.log(messageElement)
    //new div created above and we want to append it to the message container
    messageContainer.append(messageElement)
}