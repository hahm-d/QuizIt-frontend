document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("#main");
    const createQuizButton = document.querySelector(".btn-create-quiz");
    const joinClassButton = document.querySelector(".btn-join-classrom");
    const hostClassButton = document.querySelector(".btn-host-classrom");

    const clickHandler = () => {
        document.addEventListener("click", e => {
            if (e.target.matches(".btn-create-quiz")){
                const createContainer = document.querySelector("#create-container")
                createContainer.style.display = "block"
                const quizForm = document.createElement("form")
                console.log(quizForm)
            } else if (e.target.matches(".btn-join-classrom")) {

            } else if (e.target.matches(".btn-host-classrom")) {

            }
        })
    }
    clickHandler();




})