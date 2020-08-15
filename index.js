 document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("main")
    //const host = document.getElementById("host")

    // hide the chatroom initially
    const chatroom = document.getElementById("host-container")
    chatroom.style.display = "none";
    const joinroom = document.getElementById("join-container")
    joinroom.style.display = "none";

    //main on-click listener
     document.addEventListener("click", e => {
    // note: can use switch cases as well
       if(e.target.matches("#host")){
            //hide main div
            main.style.display = "none";
            joinroom.style.display = "block";
            //chatroom.style.display = "block";
            //server()
       }else if(e.target.matches("#join")){
            //hide main div
            main.style.display = "none";
            joinroom.style.display = "block";

       }else if(e.target.matches("#create")){
            //hide main div
            main.style.display = "none";

       }
    }) 


    //main form submit




//Server below
const server = () => {
    const socket = io("http://localhost:3000")
    const messageContainer = document.getElementById("chatroom-container")
    const messageForm = document.getElementById("send-container")
    const messageInput = document.getElementById("message-input")
    const name = prompt("what is your name?")


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
        //new div created above and we want to append it to the message container
        messageContainer.append(messageElement)
    }
}
})