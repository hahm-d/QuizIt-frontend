document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("main")
    const chatroom = document.getElementById("join_container")
    const takequiz = document.getElementById("take_container")
    const createquiz = document.getElementById("create_container")
    const quizFormContainer = document.getElementById("quiz_form_container")
    const questionFormContainer = document.getElementById("question_form_container")
    const confirmQuizBox = document.getElementById("confirm_quiz")
    const questionContainer = document.getElementById("questions_container")
    let divCount = 1
    let quizObj = {}

    //main on-click listener
     document.addEventListener("click", e => {
       if(e.target.matches("#join")){
            //hide main div
            switchHiddenDiv(main)
            switchHiddenDiv(chatroom)
            //server start here after fix
        }else if(e.target.matches("#take")){
            //hide main div
            switchHiddenDiv(main)
            switchHiddenDiv(takequiz)
        }else if(e.target.matches("#create")){
            //hide main div
            switchHiddenDiv(main)
            switchHiddenDiv(createquiz)
        }else if(e.target.matches("#add_more")){
            const newdiv = document.createElement("div")
            divCount++
            newdiv.id = divCount.toString() 
            newdiv.innerHTML = `<label for="question">Question ${newdiv.id}:</label>
            <input type="text" name="question"><br>
            <label for="answer">Answer:</label>
            <input type="text" name="answer"><br>
            <label for="incorrect1">Incorrect answer 1:</label>
            <input type="text" name="incorrect1"><br>
            <label for="incorrect2">Incorrect answer 2:</label>
            <input type="text" name="incorrect2"><br>
            <label for="incorrect3">Incorrect answer 3:</label>
            <input type="text" name="incorrect3"><br>
            `
            const addButton = document.getElementById("add_more")
            const questionParent = document.getElementById("question_quiz")
            questionParent.insertBefore(newdiv, addButton)

        }else if (e.target.matches("#btn_confirm_quiz")){
        switchHiddenDiv(confirmQuizBox)
        renderQuestion(quizObj)
        }
    }) 


    //main form submit
    document.addEventListener("submit", e => {
        e.preventDefault()
        if(e.target.matches("#main_quiz")){
            //create the object and send to backend API 
            postQuiz(e.target)
            switchHiddenDiv(quizFormContainer)
            switchHiddenDiv(questionFormContainer)
        } else if(e.target.matches("#find_quiz")){
            const uniq_code = e.target.unique_code.value
            getQuiz(uniq_code)
            .then(quiz => {
                if(quiz !== null){
                    quizObj = quiz
                    switchHiddenDiv(takequiz)
                    confirmQuiz(quiz)
                } else {
                    alert("This quiz does not exist")
                }
            })
        }else if(e.target.matches("#finish_form")){
            //e.target is question_quiz
            //for each div, create objs then send to post question
        }
    })

// render the quiz
const confirmQuiz = (quiz) => {
    switchHiddenDiv(confirmQuizBox)
    const quizTitle = document.createElement("h2")
    const quizTeacher = document.createElement("p")
    
    quizTitle.innerText = `${quiz.title}`
    quizTeacher.innerText = `Teacher Name: ${quiz.teacher_name}`

    confirmQuizBox.prepend(quizTitle, quizTeacher)
}

const renderQuestion = (quizObj) => {
    switchHiddenDiv(questionContainer)
    for (question of quizObj.questions){
        console.log(question)
        
    }
}

//helper function
function switchHiddenDiv(div){
   return div.className == "hidden_div" ? div.className = "seen_div" : div.className = "hidden_div" 
}

function randomizer(){
    return Math.floor((Math.random() * 100) + 1000);
}


//fetch request
const QUIZ_URL = "http://localhost:3000/quizzes/"
const QUESTION_URL = "http://localhost:3000/questions/"

const getQuiz = (uniq_code) => {
    return fetch(`${QUIZ_URL}${uniq_code}`)
    .then(resp => resp.json())
};


const postQuiz = (quiz_obj) => {
    const rando = randomizer()
   // console.log(quiz_obj.teacher_email.value)
    const setting = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "quizzes": {
            "unique_code": rando,
            "teacher_name": quiz_obj.teacher_name.value,
            "teacher_email": quiz_obj.teacher_email.value,
            "title": quiz_obj.quiz_title.value,
            "time_limit": quiz_obj.timer.value
            }
        })
    }
    // return fetch(QUIZ_URL, setting)
    // .then(resp => resp.json())
    // .then((quiz_obj) => {
    //     let createdQuiz = quiz_obj
    // })
 
}

const postQuestion = (question_obj) =>{


}


})