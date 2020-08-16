 document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("main")
    switchHiddenDiv(main)
    const chatroom = document.getElementById("join_container")
    const takequiz = document.getElementById("take_container")
    const createquiz = document.getElementById("create_container")
    const startquiz = document.getElementById("start_quiz_container")
    const quizFormContainer = document.getElementById("quiz_form_container")
    const questionFormContainer = document.getElementById("question_form_container")

    //main on-click listener
     document.addEventListener("click", e => {
       if(e.target.matches("#join")){
            //hide main div
            switchHiddenDiv(main)
            switchHiddenDiv(chatroom)
            //start the server !
            server()
       }else if(e.target.matches("#take")){
            //hide main div
            switchHiddenDiv(main)
            switchHiddenDiv(takequiz)
       }else if(e.target.matches("#create")){
            //hide main div
            switchHiddenDiv(main)
            switchHiddenDiv(createquiz)
       }else if(e.target.matches("#finishform")){
            switchHiddenDiv(main)
            switchHiddenDiv(questionFormContainer)
       }
    }) 


    //main form submit
    document.addEventListener("submit", e => {
        e.preventDefault()
        //console.log(e.target)
        if(e.target.matches("#main_quiz")){
            console.log(e.target)
        } else if(e.target.matches("#find_quiz")){
            const uniq_code = e.target.unique_code.value
            getQuiz(uniq_code)
            .then(quiz => {
                if(quiz !== null){
                    switchHiddenDiv(takequiz)
                    confirmQuiz(quiz)
                } else {
                    alert("This quiz does not exist")
                }
            })
        }else if(e.target.matches("add question")){
            //reset form after submitting to backend 
            
        }
    })

// render the quiz
const confirmQuiz = (quiz) => {
    const confirmQuizBox = document.getElementById("confirm_quiz")
    switchHiddenDiv(confirmQuizBox)
    const quizTitle = document.createElement("h2")
    const quizTeacher = document.createElement("p")
    
    quizTitle.innerText = `${quiz.title}`
    quizTeacher.innerText = `Teacher Name: ${quiz.teacher_name}`

    confirmQuizBox.prepend(quizTitle, quizTeacher)
}

const renderQuestion = (question) => {

}

//helper function
function switchHiddenDiv(div){
    //var must be defined lexically
   return div.className == "hidden_div" ? div.className = "seen_div" : div.className = "hidden_div" 
}

//Server below
const server = () => {
    const socket = io("http://localhost:3000")
    const messageContainer = document.getElementById("chatroom_container")
    const messageForm = document.getElementById("send_container")
    const messageInput = document.getElementById("message_input")
    const name = prompt("what is your name?")
    appendMessage('You joined')

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

//fetch request
const QUIZ_URL = "http://localhost:3000/quizzes/"

const getQuiz = (uniq_code) => {
    return fetch(`${QUIZ_URL}${uniq_code}`)
    .then(resp => resp.json())
};

})