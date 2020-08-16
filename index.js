 document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("main")
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
            //server start here after fix
       }else if(e.target.matches("#take")){
            //hide main div
            switchHiddenDiv(main)
            switchHiddenDiv(takequiz)
            main.style.display = "none";
            takequiz.style.display = "block";
       }else if(e.target.matches("#create")){
            //hide main div
            switchHiddenDiv(main)
            switchHiddenDiv(createquiz)
       }else if(e.target.matches("#finishform")){
            //switchHiddenDiv(main)
            //switchHiddenDiv(questionFormContainer)
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
                debugger
            })
        }else if(e.target.matches("add question")){
            //reset form after submitting to backend 
            
        }
    })

// render the quiz
const renderQuiz = (quiz) => {
    
}

const renderQuestion = (question) => {

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

const getQuiz = (uniq_code) => {
    return fetch(`${QUIZ_URL}${uniq_code}`)
    .then(resp => resp.json())
};


const postQuiz = (quiz_obj) => {
    const rando = randomizer()
    console.log(quiz_obj)
    const setting = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: "application/json"
        },
        body: JSON.stringify({
            "uniqueCode": rando,
            "teacher_name": quiz_obj.teacher_name.value,
            "teacher_email": quiz_obj.teacher_name.value,
            "title": quiz_obj.quiz_title.value, 
        })
    }
    return fetch(QUIZ_URL, setting)
    .then(resp => resp.json())
    .then((quiz_obj) => {
        let createdQuiz = quiz_obj
    })
 
}
})