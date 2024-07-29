document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById("question-container");
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const nextButton = document.getElementById("next-btn");
    const questionCounter = document.getElementById("question-counter");
  
    let currentQuestionIndex = 0;
    let questions = [];
    let score = 0;
    let batchIndex = 0;
  
    nextButton.addEventListener("click", () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < 10) {
        showQuestion(questions[currentQuestionIndex]);
      } else {
        showResults();
      }
    });
  
    function fetchQuestions() {
      fetch("https://opentdb.com/api.php?amount=30&category=18")
        .then(response => response.json())
        .then(data => {
          questions = data.results;
          loadBatch();
        });
    }
  
    function loadBatch() {
      currentQuestionIndex = 0;
      score = 0;
      const startIndex = batchIndex * 10;
      const endIndex = startIndex + 10;
      const batchQuestions = questions.slice(startIndex, endIndex);
      if (batchQuestions.length === 0) {
        batchIndex = 0;
        loadBatch();
      } else {
        questions = batchQuestions;
        showQuestion(questions[currentQuestionIndex]);
      }
    }
  
    function showQuestion(question) {
      questionElement.innerHTML = question.question;
      answersElement.innerHTML = "";
  
      let answers = [...question.incorrect_answers, question.correct_answer];
      answers = shuffle(answers);
  
      answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer;
        button.addEventListener("click", () => selectAnswer(button, question.correct_answer));
        answersElement.appendChild(button);
      });
  
      nextButton.style.display = "none";
      updateQuestionCounter();
    }
  
    function selectAnswer(selectedButton, correctAnswer) {
      const allButtons = answersElement.querySelectorAll("button");
      allButtons.forEach(button => {
        button.disabled = true;
        if (button.innerHTML === correctAnswer) {
          button.style.backgroundColor = "green";
          if (button === selectedButton) {
            score++;
          }
        } else if (button === selectedButton) {
          button.style.backgroundColor = "red";
        }
      });
      nextButton.style.display = "block";
    }
  
    function showResults() {
      questionContainer.innerHTML = `
        <h2>Congratulations, you answered ${score} / 10 questions correctly.</h2>
        <button id="restart-btn">Play 1 more time</button>
      `;
      const restartButton = document.getElementById("restart-btn");
      restartButton.addEventListener("click", restartQuiz);
      nextButton.style.display = "none";
    }
  
    function restartQuiz() {
      batchIndex++;
      questionContainer.innerHTML = `
        <div id="question"></div>
        <div id="answers" class="answers-container"></div>
      `;
      loadBatch();
    }
  
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    function updateQuestionCounter() {
      questionCounter.innerHTML = `${currentQuestionIndex + 1} / 10`;
    }
  
    fetchQuestions();
  });
  
  