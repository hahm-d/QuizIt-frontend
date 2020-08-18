
//function for timer
const timerDisplay = document.querySelector('.display_time_left');
const endTime = document.querySelector('.display_end_time');

function timer(seconds) {
    clearInterval(countdown);
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then);
  
    countdown = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);
      if(secondsLeft < 0) {
        clearInterval(countdown);
        return;
      }
      displayTimeLeft(secondsLeft);
    }, 1000);
  }

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    document.title = display;
    timerDisplay.textContent = display;
  }
  
  function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const adjustedHour = hour > 12 ? hour - 12 : hour;
    const minutes = end.getMinutes();
    endTime.textContent = `Quiz Ends at ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
  }



