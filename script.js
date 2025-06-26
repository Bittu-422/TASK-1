const questions = [
  {
    category: "Programming",
    question: "What does CSS stand for?",
    answers: [
      { text: "Computer Style Sheets", correct: false },
      { text: "Creative Style Sheets", correct: false },
      { text: "Cascading Style Sheets", correct: true },
      { text: "Colorful Style Sheets", correct: false },
    ],
  },
  {
    category: "Programming",
    question: "What does HTML stand for?",
    answers: [
      { text: "Hyperlink Makeup Language", correct: false },
      { text: "Hypolink Markup Language", correct: false },
      { text: "HyperText Markup Language", correct: true },
      { text: "Colorful Style Sheets", correct: false },
    ],
  },
  {
    category: "Programming",
    question: "What does JS stand for?",
    answers: [
      { text: "Java Single Language", correct: false },
      { text: "JavaScript", correct: true },
      { text: "Java Script Language", correct: false },
      { text: "Java", correct: false },
    ],
  },
  {
    category: "Programming",
    question: "Which language runs in a web browser?",
    answers: [
      { text: "Java", correct: false },
      { text: "C", correct: false },
      { text: "Python", correct: false },
      { text: "JavaScript", correct: true },
    ],
  },
  {
    category: "General Knowledge",
    question: "Which city is known as the Pink City of India?",
    answers: [
      { text: "New Delhi", correct: false },
      { text: "Jaipur", correct: true },
      { text: "Agra", correct: false },
      { text: "Chennai", correct: false },
    ],
  },
  {
    category: "General Knowledge",
    question: "Who is the Prime Minister of India?",
    answers: [
      { text: "Lalu Prasad Yadav", correct: false },
      { text: "Rahul Gandhi", correct: false },
      { text: "Arbind Kejariwal", correct: false },
      { text: "Narendra Modi", correct: true },
    ],
  },
  {
    category: "General Knowledge",
    question: "Who is the President of India?",
    answers: [
      { text: "Akhilesh Yadav", correct: false },
      { text: "Soniya Gandhi", correct: false },
      { text: "Droupadi Murmu", correct: true },
      { text: "Narendra Modi", correct: false },
    ],
  },
  {
    category: "General Knowledge",
    question: "Who is the Home Minister of India?",
    answers: [
      { text: "Amit Shah", correct: true },
      { text: "Jay Shah", correct: false },
      { text: "Arun Jaitely", correct: false },
      { text: "Suresh Ray", correct: false },
    ],
  },
  {
    category: "General Knowledge",
    question: "Who is the Defence Minister of India?",
    answers: [
      { text: "Amit Shah", correct: false },
      { text: "Jay Shah", correct: false },
      { text: "Arun Jaitely", correct: false },
      { text: "Rajanath Singh", correct: true },
    ],
  }
];

let allQuestions = [];
let currentIndex = 0;
let score = 0;
let timeLeft = 10;
let timerInterval;
let selectedCategory = "";

// DOM Elements
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("next-btn");
const timerEl = document.getElementById("timer");
const startScreen = document.querySelector(".start-screen");
const startBtn = document.getElementById("start-btn");
const categorySelect = document.getElementById("category-select");

// Sounds
const correctSound = new Audio("sounds/correct-answer.mp3");
const wrongSound = new Audio("sounds/wrong-answer.mp3");

startBtn.addEventListener("click", () => {
  selectedCategory = categorySelect.value;
  if (!selectedCategory) return;

  allQuestions = questions.filter(q => q.category === selectedCategory);
  if (allQuestions.length === 0) {
    alert("No questions found for this category!");
    return;
  }

  // Hide Start, Show Quiz
  startScreen.style.display = "none";
  document.querySelector(".quiz-container").style.display = "block";
  currentIndex = 0;
  score = 0;
  nextBtn.innerText = "Next Question";
  loadQuestion();
});

function startTimer() {
  timeLeft = 10;
  timerEl.innerText = `Time Left: ${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      disableAnswers();
      nextBtn.style.display = "block";
    }
  }, 1000);
}

function loadQuestion() {
  resetState();
  const current = allQuestions[currentIndex];
  questionEl.innerText = current.question;

  current.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.addEventListener("click", () => selectAnswer(button, answer.correct));
    answersEl.appendChild(button);
  });

  startTimer();
}

function selectAnswer(button, isCorrect) {
  clearInterval(timerInterval);

  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = true);

  if (isCorrect) {
    button.classList.add("correct");
    correctSound.play();
    score++;
  } else {
    button.classList.add("wrong");
    wrongSound.play();
  }

  nextBtn.style.display = "block";
}

function disableAnswers() {
  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
    const isCorrect = allQuestions[currentIndex].answers.find(a => a.text === btn.innerText).correct;
    if (isCorrect) btn.classList.add("correct");
  });
}

function resetState() {
  clearInterval(timerInterval);
  answersEl.innerHTML = "";
  nextBtn.style.display = "none";
  timerEl.innerText = "";
}

function showScore() {
  questionEl.innerText = "🎉 Congratulations! You have completed the quiz!";
  answersEl.innerHTML = "";
  timerEl.innerText = "";
  scoreEl.innerText = `Your score: ${score} out of ${allQuestions.length}`;
  nextBtn.innerText = "Restart Quiz";
  nextBtn.style.display = "block";

  // Save to localStorage
  localStorage.setItem("lastScore", `${score} / ${allQuestions.length}`);
  localStorage.setItem("lastCategory", selectedCategory);
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < allQuestions.length) {
    loadQuestion();
  } else {
    showScore();
    currentIndex = 0;
    score = 0;
  }
});

// Load last score on page load
window.addEventListener("DOMContentLoaded", () => {
  const lastScore = localStorage.getItem("lastScore");
  const lastCategory = localStorage.getItem("lastCategory");
  const lastScoreEl = document.getElementById("last-score");

  if (lastScore && lastCategory) {
    lastScoreEl.innerText = `Your last score in "${lastCategory}" was: ${lastScore}`;
  }
});
