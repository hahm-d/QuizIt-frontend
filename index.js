document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("main")
    const chatroom = document.getElementById("join_container")
    const takequiz = document.getElementById("take_container")
    const createquiz = document.getElementById("create_container")
    const quizFormContainer = document.getElementById("quiz_form_container")
    const questionFormContainer = document.getElementById("question_form_container")
    const confirmQuizBox = document.getElementById("confirm_quiz")
    const quizContainer = document.getElementById("quiz_container")
    const questionContainer = document.getElementById("questions_container")
    let formCount = 1
    let quizObj = {}
    let newUniqCode;

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
            const newForm = document.createElement("form")
            formCount++
            newForm.classList = "each_question"
            newForm.id = formCount.toString() 
            newForm.innerHTML = `
            <input type="hidden" name="quiz_id" value=${newUniqCode}>
            <label for="statement">Question ${newForm.id}:</label>
            <input type="text" name="statement"><br>
            <label for="image">Upload image:</label>
            <input type="file" name="image"/><br>
            <label for="answer">Answer:</label>
            <input type="text" name="answer"><br>
            <label for="incorrect1">Incorrect answer 1:</label>
            <input type="text" name="incorrect1"><br>
            <label for="incorrect2">Incorrect answer 2:</label>
            <input type="text" name="incorrect2"><br>
            <label for="incorrect3">Incorrect answer 3:</label>
            <input type="text" name="incorrect3"><br>
            `
            const submitButton = document.getElementById("submit_questions")
            questionFormContainer.insertBefore(newForm, submitButton)
        }else if (e.target.matches("#btn_confirm_quiz")){
            switchHiddenDiv(confirmQuizBox)
            renderQuestion(quizObj)
        }else if (e.target.matches("#submit_questions")){
            submitQuestions()
            switchHiddenDiv(confirmQuizBox)
            renderQuestion(quizObj)
        }else if (e.target.matches("#submit")){
            scoring()
        //switch to next div with results
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
            const originalForm = document.getElementById("orginalForm")
            originalForm.value = newUniqCode
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
        }
    })

    function submitQuestions(){
        const questionForms = document.querySelectorAll(".each_question")
        for (let form of questionForms){
            const formData = new FormData(form)
            postQuestion(formData)
        }
    };

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
        switchHiddenDiv(quizContainer)
        switchHiddenDiv(questionContainer)
        const output = []
        const questions = quizObj.questions 
        const previousButton = document.getElementById("previous");
        const nextButton = document.getElementById("next");
        const submitButton = document.getElementById('submit');
        questions.forEach(
            (currentQuestion, questionNumber) => {
                const choices = [];
                for (choice of currentQuestion.choices){
                    choices.push(
                        `<div class="choices">
                        <input type="radio" name="question${questionNumber}", value="${choice}">
                        <label for="${choice}">${choice}</label>
                        </div>`
                    )
                }
            }
        )
            
        questions_container.innerHTML = output.join('');
        const slides = document.querySelectorAll(".slide")
        let currentSlide = 0;

        function showSlide(n) {
            slides[currentSlide].classList.remove('active-slide');
            slides[n].classList.add('active-slide');
            currentSlide = n;
            if(currentSlide === 0){
            previousButton.style.display = 'none';
            }
            else{
            previousButton.style.display = 'inline-block';
            }
            if(currentSlide === slides.length-1){
            nextButton.style.display = 'none';
            submitButton.style.display = 'inline-block';
            }
            else{
            nextButton.style.display = 'inline-block';
            submitButton.style.display = 'none';
            }
        }

        showSlide(currentSlide);

        function showNextSlide() {
            showSlide(currentSlide + 1);
        }
        
        function showPreviousSlide() {
            showSlide(currentSlide - 1);
        }

        previousButton.addEventListener("click", showPreviousSlide);
        nextButton.addEventListener("click", showNextSlide);
    }


    //helper function
    function switchHiddenDiv(div){
        return div.className == "hidden_div" ? div.className = "seen_div" : div.className = "hidden_div" 
    }

    function randomizer(){
        return Math.floor((Math.random() * 100) + 1000);
    }

    function scoring(){
        let correctAnswers = quizObj.questions.map(question => question.answer) 
        let numCorrect = 0;
        
        quizObj.questions.forEach((currentQuestion, questionNumber) => {
            const answerCon = correctAnswers[questionNumber];
            const selector = `input[name=question${questionNumber}]:checked`
            const userAns = (document.querySelector(selector) || {}).value

            if(userAns === answerCon){
                numCorrect++
                // color the answers green
                //answerContainers[questionNumber].style.color = 'lightgreen';
            }else{
                // color the answers red
                //answerContainers[questionNumber].style.color = 'red';
            }
            
        })
        console.log(`You got ${numCorrect}/${correctAnswers.length}`)   
        //maybe return the entire slider div with .red / .green style colors with score on next page
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
        newUniqCode = rando
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
        // comment out so I don't send post to create quiz 
    };

    const postQuestion = formData => {
        const config = {
        method: "POST",
        headers: {
            "Accept": "application/json"
        },
        body: formData
        }
        return fetch(QUESTION_URL, config)
        .then(res => res.json())
    }
});