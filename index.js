document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("main")
    const chatroom = document.getElementById("join_container")
    const takequiz = document.getElementById("take_container")
    const createquiz = document.getElementById("create_container")
    const quizResult = document.getElementById("quiz_result_container")
    const quizFormContainer = document.getElementById("quiz_form_container")
    const questionFormContainer = document.getElementById("question_form_container")
    const confirmQuizBox = document.getElementById("confirm_quiz")
    const quizTakerInfoBox = document.getElementById("quiz_taker_info")
    const quizContainer = document.getElementById("quiz_container")
    const questionContainer = document.getElementById("questions_container")
    const newQuizInfo = document.getElementById("new_quiz_info")
    const messageContainer = document.getElementById("chatroom_container")
    const timerDiv = document.getElementById("display")
    let formCount = 1
    let newQuizObj = {}
    let quizObj = {}
    let testTakerName = "";
    let emailFlag = false;

    //main on-click listener
    document.addEventListener("click", e => {
        if(e.target.matches("#join")){
            switchHiddenDiv(main)
            switchHiddenDiv(chatroom)
            server()
        }else if(e.target.matches("#take")){
            switchHiddenDiv(main)
            switchHiddenDiv(takequiz)
        }else if(e.target.matches("#create")){
            switchHiddenDiv(main)
            switchHiddenDiv(createquiz)
        }else if (e.target.matches("#btn_confirm_quiz")){
            switchHiddenDiv(confirmQuizBox)
            switchHiddenDiv(quizTakerInfoBox)
        }else if (e.target.matches("#submit_questions")){
            submitQuestions()
            renderNewQuizInfo()
            switchHiddenDiv(questionFormContainer)
            switchHiddenDiv(newQuizInfo)
        }else if (e.target.matches("#submit")){
            scoring()
            switchHiddenDiv(timerDiv)
            switchHiddenDiv(quizResult)
            switchHiddenDiv(quizContainer)
        }
    }) 

    //main form submit
    document.addEventListener("submit", e => {
        e.preventDefault()
        if(e.target.matches("#main_quiz")){
            //create the object and send to backend API 
            postQuiz(e.target)
            .then(quiz => {
                newQuizObj = quiz
                const originalForm = document.getElementById("orginalForm")
                originalForm.value = newQuizObj.id
            })
            switchHiddenDiv(quizFormContainer)
            switchHiddenDiv(questionFormContainer)
            createQuestionsHandler();
        }else if(e.target.matches("#find_quiz")){
            const uniq_code = e.target.unique_code.value
            getQuiz(uniq_code)
            .then(quiz => {
                if(quiz !== null){
                    quizObj = quiz
                    switchHiddenDiv(takequiz)
                    confirmQuiz(quiz)
                } else {
                    modalPopUp("This quiz does not exist");
                }
            })
        }else if(e.target.matches("#email_user")){
            sendEmail()
        }else if(e.target.matches("#quiz_taker_form")){
            testTakerName = document.getElementById("student_name").value
            if(testTakerName == null || testTakerName == ""){
                modalPopUp("Please input a name.");
            }else{
                switchHiddenDiv(quizTakerInfoBox)
                switchHiddenDiv(timerDiv)
                getQuestions(quizObj.id).then(renderQuestion) 
            }
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
        const quizTitle = document.createElement("h3")
        const quizTeacher = document.createElement("p")
        
        quizTitle.innerText = `Quiz: ${quiz.title}`
        quizTeacher.innerText = `Teacher Name: ${quiz.teacher_name}`

        confirmQuizBox.prepend(quizTitle, quizTeacher)
    }

    const createQuestionsHandler = () => {
        const parent = document.getElementById("forms")
        let slides = parent.children
        const addQuestionButton = document.getElementById("add_more")
        const previousButton = document.getElementById("previous_question");
        const nextButton = document.getElementById("next_question");
        let currentSlide = 0;
        function showSlide(n) {
            slides[currentSlide].classList.remove("active-slide");
            slides[n].classList.add("active-slide");
            currentSlide = n;
            if(currentSlide === 0){
            previousButton.style.display = "none";
            }
            else{
            previousButton.style.display = "inline-block";
            }
            if(currentSlide === slides.length-1){
            nextButton.style.display = "none";
            }
            else{
            nextButton.style.display = "inline-block";
            }
        }

        showSlide(currentSlide);

        function addQuestion() {
            slides[currentSlide].classList.remove("active-slide");
            previousButton.style.display = "inline-block";
            nextButton.style.display = "none";

            const newForm = document.createElement("form")
            formCount++
            newForm.classList = "each_question active-slide"
            newForm.id = formCount.toString() 
            newForm.innerHTML = `
            <input type="hidden" name="quiz_id" value=${newQuizObj.id}>
            <label for="statement">Question ${newForm.id}:</label><br>
            <input type="text" name="statement"><br>
            <label for="answer">Answer:</label><br>
            <input type="text" name="answer"><br>
            <label for="incorrect1">Incorrect answer 1:</label><br>
            <input type="text" name="incorrect1"><br>
            <label for="incorrect2">Incorrect answer 2:</label><br>
            <input type="text" name="incorrect2"><br>
            <label for="incorrect3">Incorrect answer 3:</label><br>
            <input type="text" name="incorrect3"><br>
            <label for="image">Upload image:</label><br>
            <input type="file" name="image"/><br>
            `
            parent.append(newForm)
            currentSlide = parseInt(newForm.id) - 1
        }

        function showNextSlide() {
            showSlide(currentSlide + 1);
        }
        
        function showPreviousSlide() {
            showSlide(currentSlide - 1);
        }

        addQuestionButton.addEventListener("click", addQuestion);
        previousButton.addEventListener("click", showPreviousSlide);
        nextButton.addEventListener("click", showNextSlide);
    }
    
    const renderNewQuizInfo = () => {
        const newQuizTitle = document.getElementById("new_quiz_title")
        const newQuizCode = document.getElementById("new_quiz_code")
        newQuizTitle.innerText = `Title: ${newQuizObj.title}`
        newQuizCode.innerText = `Code: ${newQuizObj.unique_code}`
    }

    const renderQuestion = (questionObj) => {
        // display timer
        timer(quizObj.time_limit * 60)
        switchHiddenDiv(quizContainer)
        switchHiddenDiv(questionContainer)
        const output = []
        const previousButton = document.getElementById("previous");
        const nextButton = document.getElementById("next");
        const submitButton = document.getElementById("submit");
        questionObj.forEach(
            (currentQuestion, questionNumber) => {
                const choices = [];
                const options = [currentQuestion.answer, currentQuestion.incorrect1, currentQuestion.incorrect2, currentQuestion.incorrect3] 
                shuffle(options)
                for (let choice of options){
                    choices.push(
                        `<div class="choices">
                        <input type="radio" name="question${questionNumber}", value="${choice}">
                        <label for="${choice}">${choice}</label>
                        </div>`
                    )
                }
                if(currentQuestion.image !== undefined){
                output.push(
                    `
                    <div class="slide">
                        <div id="image_container">
                            <img id="question_image" src=${currentQuestion.image}">
                        </div>
                        <div id="singel_question_container">
                            <div class="question"> ${currentQuestion.statement} </div>
                            ${choices.join("")}
                        </div>
                    </div>`
                )
                }else{
                    output.push(
                        `
                        <div class="slide">
                            <div id="singel_question_container">
                                <div class="question"> ${currentQuestion.statement} </div>
                                ${choices.join("")}
                            </div>
                        </div>`
                    )                    
                }
            }
        )
            
        questions_container.innerHTML = output.join("");

        const slides = document.querySelectorAll(".slide")
        let currentSlide = 0;

        function showSlide(n) {
            slides[currentSlide].classList.remove("active-slide");
            slides[n].classList.add("active-slide");
            currentSlide = n;
            if(currentSlide === 0){
            previousButton.style.display = "none";
            }
            else{
            previousButton.style.display = "inline-block";
            }
            if(currentSlide === slides.length-1){
            nextButton.style.display = "none";
            submitButton.style.display = "inline-block";
            }
            else{
            nextButton.style.display = "inline-block";
            submitButton.style.display = "none";
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

    function randomizer(name){
        const nameArr = name.split(" ")
        let initials = []
        nameArr.forEach(returnInitial)
        function returnInitial(name){
            initials.push(name[0].toUpperCase())
        }
        return initials.join("") + Math.floor((Math.random() * 100) * 222)
    }


    function scoring(){
        let correctAnswers = quizObj.questions.map(question => question.answer) 

        let numCorrect = 0;
        const findTable = document.getElementById("resultTable")
        //quizResult
        quizObj.questions.forEach((currentQuestion, questionNumber) => {
            const answerCon = correctAnswers[questionNumber];
            const selector = `input[name=question${questionNumber}]:checked`
            const userAns = (document.querySelector(selector) || {}).value
            let row = findTable.insertRow(questionNumber + 1)
            row.insertCell(0).innerHTML = questionNumber + 1
            row.insertCell(1).innerHTML = currentQuestion.statement
            row.insertCell(2).innerHTML = userAns
            row.insertCell(3).innerHTML = answerCon
            if(userAns === answerCon){
                numCorrect++
            }

        })
        const percentage = Math.floor((numCorrect / correctAnswers.length) * 100)
        let resultValue = document.createElement("div")
        resultValue.className = "resultValueTable"
        resultValue.innerHTML = `
        <h3 id="user_score_value">Score: ${numCorrect}/${correctAnswers.length}</h3>
        <h1 id="user_percent_value">${percentage}%</h1>`
        quizResult.append(resultValue)
        //email results
        sendResult(percentage)
        emailFlag = true
    }

    const shuffle = (array) => {

        let currentIndex = array.length;
        let temporaryValue, randomIndex;
    
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
    
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    
        return array;
    
    };

    const modalPopUp = (string) => {
        let modal = document.getElementById("myModal");
        let span = document.getElementsByClassName("close_modal")[0];
        let alertSentence = document.getElementsByClassName("alert_message")[0];
        modal.style.display = "block";
        span.onclick = function() {
            modal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
        }
        alertSentence.innerHTML = string
    }

    //fetch request
    const QUIZ_URL = "http://localhost:3000/quizzes/"
    const QUESTION_URL = "http://localhost:3000/questions/"

    const getQuiz = (uniq_code) => {
        return fetch(`${QUIZ_URL}${uniq_code}`)
        .then(resp => resp.json())
    };

    const getQuestions = (quiz_id) => {
        return fetch(`${QUESTION_URL}${quiz_id}`)
        .then(resp => resp.json())
    };

    const postQuiz = (quiz_obj) => {
        const rando = randomizer(quiz_obj.teacher_name.value)
        let setting = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "quizzes":{
                "unique_code": rando,
                "teacher_name": quiz_obj.teacher_name.value,
                "teacher_email": quiz_obj.teacher_email.value,
                "title": quiz_obj.quiz_title.value,
                "time_limit": quiz_obj.timer.value
                }
            })
        }
        return fetch(QUIZ_URL, setting)
        .then(resp => resp.json())
    };

    const postQuestion = formData => {
        const config = {
        method: "POST",
        body: formData
        }
        return fetch(QUESTION_URL, config)
        .then(res => res.json())
    }
    
    //timer
    let countdown;
    const timerDisplay = document.querySelector(".display_time");
    const endTime = document.querySelector(".display_end");
    function timer(seconds) {
        clearInterval(countdown);
        const now = Date.now();
        const then = now + seconds * 1000;
        displayTimeLeft(seconds);
        displayEndTime(then);
        countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if(secondsLeft < 0) {
            modalPopUp("Times up!")
            clearInterval(countdown);
            if(emailFlag == false){
                scoring()
                switchHiddenDiv(quizResult)
                switchHiddenDiv(quizContainer)
                switchHiddenDiv(timerDiv)
            }
        }
        displayTimeLeft(secondsLeft);
        }, 1000);
    }
    function displayTimeLeft(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        const display = `Time Left: ${minutes}:${remainderSeconds < 10 ? "0" : "" }${remainderSeconds}`;
        timerDisplay.innerText = display;
    }
    function displayEndTime(timestamp) {
        const end = new Date(timestamp);
        const hour = end.getHours();
        const adjustedHour = hour > 12 ? hour - 12 : hour;
        const minutes = end.getMinutes();
        endTime.textContent = `Quiz Ends at ${adjustedHour}:${minutes < 10 ? "0" : ""}${minutes}`;
    }

    function server(){
        const messageForm = document.getElementById("send_container")
        const messageInput = document.getElementById("message_input")
        const socket = io("http://localhost:3003")

        const name = prompt("What is your name?")
        socket.emit("new-user", name)

        socket.on("chat-message", data => {
            appendUserMessage(data)
        })
    
        socket.on("user-connected", name => {
            appendMessage(`${name} connected`)
        })
    
        socket.on("user-disconnected", name => {
            appendMessage(`${name} disconnected`)
        })
        function appendMessage(message) {
            const messageElement = document.createElement("li")
            messageElement.className = "alert_chat"
            messageElement.innerText = message
            messageContainer.append(messageElement)
        }
        function appendUserMessage(userObj) {
            const messageElement = document.createElement("li")
            messageElement.className = userObj.class
            messageElement.innerText = `${userObj.name}: ${userObj.message}`
            messageContainer.append(messageElement)
            messageElement.scrollTop = messageElement.scrollHeight - messageElement.clientHeight;
        }
        messageForm.addEventListener("submit", e => {
            e.preventDefault()
                const message = messageInput.value
                appendUserMessage({message: message, name: name, class: "even_message"})
                socket.emit("send-chat-message", message)
                messageInput.value = ""
        })
    }

    function sendEmail() {
        Email.send({
            Host: "smtp.gmail.com",
            Username : "quizit2020@gmail.com",
            Password : "quizit123!",
            To : `${newQuizObj.teacher_email}`,
            From : "quizit2020@gmail.com",
            Subject : "Your Quizit Quiz Code",
            Body : `Thank you for using Quizit! \n 
                Here is your code! \n
            quiz code: ${newQuizObj.unique_code}`,
        }).then(
            message => modalPopUp("mail sent successfully")
        );
    }
    function sendResult(score) {
        Email.send({
            Host: "smtp.gmail.com",
            Username : "quizit2020@gmail.com",
            Password : "quizit123!",
            To : `${quizObj.teacher_email}`,
            From : "quizit2020@gmail.com",
            Subject : `${quizObj.title}, Student: ${testTakerName}'s results `,
            Body : `${testTakerName} scored: ${score}% on quiz: ${quizObj.unique_code}`,
        }).then(
            message => modalPopUp("Results Submitted")
        );
    }
});



