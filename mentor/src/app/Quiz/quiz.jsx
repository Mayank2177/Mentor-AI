import React, { useRef, useEffect } from "react";

const Quiz = () => {
  const loadingScreenRef = useRef(null);
  // Quiz Application - Enhanced Version
  class QuizApp {
    constructor() {
      // Application state
      this.state = {
        questions: [],
        currentQuestion: 0,
        answers: [],
        marked: [],
        timeLeft: 15 * 60,
        totalTime: 15 * 60,
        timerInterval: null,
        isQuizActive: false,
      };

      // DOM elements cache
      this.elements = {};

      // Configuration
      this.config = {
        loadingDelay: 1500,
        transitionDelay: 500,
        autoSaveInterval: 30000, // Auto-save every 30 seconds
      };

      // Subject and topic suggestions
      this.suggestions = {
        subjects: [
          "Mathematics",
          "Physics",
          "Chemistry",
          "Biology",
          "Computer Science",
          "English",
          "History",
          "Geography",
          "Economics",
          "Political Science",
          "Psychology",
          "Philosophy",
          "Sociology",
          "Anthropology",
          "Literature",
          "Statistics",
          "Calculus",
          "Algebra",
          "Geometry",
          "Trigonometry",
          "Data Science",
          "Machine Learning",
          "Artificial Intelligence",
          "Software Engineering",
          "Database Systems",
          "Operating Systems",
          "Discrete Mathematics",
          "Linear Algebra",
          "Probability Theory",
        ],
        topics: {
          Mathematics: [
            "Algebra",
            "Geometry",
            "Calculus",
            "Trigonometry",
            "Statistics",
            "Probability",
            "Linear Equations",
            "Quadratic Equations",
            "Matrices",
            "Differential Equations",
            "Integration",
            "Limits",
            "Number Theory",
            "Set Theory",
            "Complex Numbers",
            "Logarithms",
            "Coordinate Geometry",
          ],
          Physics: [
            "Mechanics",
            "Thermodynamics",
            "Electromagnetism",
            "Optics",
            "Waves",
            "Modern Physics",
            "Quantum Physics",
            "Relativity",
            "Nuclear Physics",
            "Atomic Structure",
            "Motion",
            "Energy",
            "Force",
            "Gravitation",
            "Fluid Mechanics",
            "Oscillations",
            "Sound Waves",
            "Light",
          ],
          Chemistry: [
            "Organic Chemistry",
            "Inorganic Chemistry",
            "Physical Chemistry",
            "Atomic Structure",
            "Chemical Bonding",
            "Acids and Bases",
            "Electrochemistry",
            "Thermochemistry",
            "Chemical Kinetics",
            "Periodic Table",
            "Solutions",
            "Chemical Equilibrium",
            "Redox Reactions",
          ],
          Biology: [
            "Cell Biology",
            "Genetics",
            "Evolution",
            "Ecology",
            "Human Anatomy",
            "Plant Biology",
            "Microbiology",
            "Molecular Biology",
            "Biotechnology",
            "Physiology",
            "Taxonomy",
            "Reproduction",
            "Photosynthesis",
            "Respiration",
          ],
          "Computer Science": [
            "Programming",
            "Data Structures",
            "Algorithms",
            "Database Systems",
            "Operating Systems",
            "Computer Networks",
            "Software Engineering",
            "Web Development",
            "Machine Learning",
            "Artificial Intelligence",
            "Cybersecurity",
            "Object Oriented Programming",
            "System Design",
          ],
          English: [
            "Grammar",
            "Literature",
            "Poetry",
            "Shakespeare",
            "Writing Skills",
            "Vocabulary",
            "Reading Comprehension",
            "Essay Writing",
            "Phonics",
            "Sentence Structure",
            "Punctuation",
            "Creative Writing",
            "Literary Analysis",
          ],
        },
      };

      // Initialize application
      this.init();
    }

    // Initialize the application
    init() {
      try {
        this.cacheElements();
        this.bindEvents();
        this.hideLoadingScreen();
        this.setupSuggestions();
        this.addEnhancedInteractions();
        console.log("QuizApp initialized successfully");
      } catch (error) {
        console.error("Failed to initialize QuizApp:", error);
        this.forceHideLoading();
      }
    }
    // Cache DOM elements for better performance
    cacheElements() {
      const elementIds = [
        "loading-screen",
        "setup-page",
        "quiz-page",
        "quiz-setup-form",
        "subject",
        "topic",
        "subject-suggestions",
        "topic-suggestions",
        "start-quiz-btn",
        "nav-buttons",
        "question-title",
        "question-options",
        "time",
        "timer-progress",
        "progress-fill",
        "progress-percentage",
        "current-q-num",
        "current-q-display",
        "total-questions",
        "info-subject",
        "info-topic",
        "info-questions",
        "info-difficulty",
        "prev-btn",
        "next-btn",
        "clear-btn",
        "mark-btn",
        "submit-btn",
      ];

      elementIds.forEach((id) => {
        this.elements[id] = document.getElementById(id);
      });

      // Additional element queries
      this.elements.form = document.getElementById("quiz-setup-form");
      this.elements.questionArea = document.querySelector(".question-area");
      this.elements.quizInterface = document.querySelector(".quiz-interface");
    }

    // Bind event listeners
    bindEvents() {
      // Form submission
      if (this.elements.form) {
        this.elements.form.addEventListener("submit", (e) =>
          this.handleFormSubmission(e)
        );
      }

      // Control buttons
      this.bindControlButtons();

      // Keyboard shortcuts
      document.addEventListener("keydown", (e) =>
        this.handleKeyboardShortcuts(e)
      );

      // Window events
      window.addEventListener("beforeunload", (e) =>
        this.handleBeforeUnload(e)
      );
      window.addEventListener("resize", () => this.handleResize());

      // Visibility change (tab switching)
      document.addEventListener("visibilitychange", () =>
        this.handleVisibilityChange()
      );
    }

    // Hide loading screen
    hideLoadingScreen = () => {
      const config = {
        loadingDelay: 1500, // or whatever value you want
      };
      const timeout1 = setTimeout(() => {
        if (loadingScreenRef.current) {
          loadingScreenRef.current.classList.add("hidden");
          loadingScreenRef.current.style.display = "none";
        }
      }, config.loadingDelay);

      // Fallback timeout
      const timeout2 = setTimeout(() => {
        if (loadingScreenRef.current) {
          loadingScreenRef.current.style.display = "none";
        }
      }, config.loadingDelay + 1000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    };

    // Force hide loading screen
    forceHideLoading() {
      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen) {
        loadingScreen.classList.add("hidden");
        loadingScreen.style.display = "none";
        loadingScreen.style.opacity = "0";
        loadingScreen.style.visibility = "hidden";
        loadingScreen.style.pointerEvents = "none";
      }
    }

    // Handle form submission
    async handleFormSubmission(e) {
      e.preventDefault();

      try {
        this.showLoadingState();

        const formData = this.collectFormData();
        if (!this.validateFormData(formData)) {
          this.hideLoadingState();
          return;
        }

        await this.generateQuizQuestions(formData);
        await this.transitionToQuiz(formData);
      } catch (error) {
        console.error("Quiz generation failed:", error);
        this.showNotification(
          "Failed to generate quiz. Please try again.",
          "error"
        );
        this.hideLoadingState();
      }
    }

    // Collect form data
    collectFormData() {
      const formData = new FormData(this.elements.form);
      const questionTypes = [];

      document
        .querySelectorAll('input[name="qtype"]:checked')
        .forEach((input) => {
          questionTypes.push(input.value);
        });

      return {
        subject: this.elements.subject?.value.trim() || "",
        topic: this.elements.topic?.value.trim() || "",
        questions: parseInt(formData.get("questions")) || 0,
        difficulty: formData.get("difficulty") || "",
        questionTypes: questionTypes,
      };
    }

    // Validate form data
    validateFormData(data) {
      const errors = [];

      if (!data.subject) errors.push("Please enter a subject");
      if (!data.topic) errors.push("Please enter a topic");
      if (!data.questions) errors.push("Please select number of questions");
      if (!data.difficulty) errors.push("Please select difficulty level");
      if (data.questionTypes.length === 0)
        errors.push("Please select at least one question type");

      if (errors.length > 0) {
        this.showNotification(errors.join(", "), "error");
        return false;
      }

      return true;
    }

    // Generate quiz questions
    async generateQuizQuestions(formData) {
      // Calculate time based on questions and difficulty
      this.state.totalTime = this.calculateQuizTime(
        formData.questions,
        formData.difficulty
      );
      this.state.timeLeft = this.state.totalTime;

      // Generate sample questions (replace with actual API call)
      this.state.questions = this.generateSampleQuestions(formData);

      // Initialize arrays
      this.state.answers = Array(this.state.questions.length).fill(null);
      this.state.marked = Array(this.state.questions.length).fill(false);
      this.state.currentQuestion = 0;

      // Simulate loading time
      await this.sleep(1500);
    }

    // Calculate quiz time
    calculateQuizTime(questionCount, difficulty) {
      const baseTimePerQuestion = {
        Beginner: 60, // 1 minute per question
        Intermediate: 90, // 1.5 minutes per question
        Advanced: 120, // 2 minutes per question
        Expert: 150, // 2.5 minutes per question
      };

      return questionCount * (baseTimePerQuestion[difficulty] || 90);
    }

    // Generate sample questions
    generateSampleQuestions(formData) {
      const questions = [];

      for (let i = 0; i < formData.questions; i++) {
        const questionType =
          formData.questionTypes[i % formData.questionTypes.length];
        questions.push(
          this.createSampleQuestion(formData, questionType, i + 1)
        );
      }

      return questions;
    }

    // Create sample question
    createSampleQuestion(formData, type, number) {
      const templates = {
        MCQ: {
          question: `${formData.difficulty} level MCQ question ${number} about ${formData.topic} in ${formData.subject}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          answer: Math.floor(Math.random() * 4),
          marks: 1,
        },
        MSQ: {
          question: `Multiple select question ${number} about ${formData.topic}`,
          options: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
          answer: [0, 2],
          marks: 1,
        },
        Numerical: {
          question: `Calculate the numerical value for this ${formData.topic} problem`,
          options: null,
          answer: Math.floor(Math.random() * 100),
          marks: 2,
        },
        "True/False": {
          question: `True or False: This statement about ${formData.topic} is correct`,
          options: ["True", "False"],
          answer: Math.floor(Math.random() * 2),
          marks: 1,
        },
        "Fill in the blanks": {
          question: `Fill in the blank: ${formData.topic} is _____ in ${formData.subject}`,
          options: null,
          answer: "important",
          marks: 2,
        },
      };

      return {
        type: type,
        ...(templates[type] || templates["MCQ"]),
      };
    }

    // Transition to quiz
    async transitionToQuiz(formData) {
      this.updateQuizInfo(formData);

      // Animate transition
      if (this.elements["setup-page"]) {
        this.elements["setup-page"].style.transform = "translateX(-100%)";
        this.elements["setup-page"].style.opacity = "0";
      }

      await this.sleep(this.config.transitionDelay);

      // Switch pages
      if (this.elements["setup-page"])
        this.elements["setup-page"].classList.add("hidden");
      if (this.elements["quiz-page"])
        this.elements["quiz-page"].classList.remove("hidden");

      // Initialize quiz interface
      this.initializeQuizInterface();

      // Start timer
      this.startTimer();

      // Mark quiz as active
      this.state.isQuizActive = true;

      // Hide loading
      this.hideLoadingState();
    }

    // Update quiz info
    updateQuizInfo(formData) {
      if (this.elements["info-subject"])
        this.elements["info-subject"].textContent = formData.subject;
      if (this.elements["info-topic"])
        this.elements["info-topic"].textContent = formData.topic;
      if (this.elements["info-questions"])
        this.elements["info-questions"].textContent = formData.questions;
      if (this.elements["info-difficulty"])
        this.elements["info-difficulty"].textContent = formData.difficulty;
    }

    // Initialize quiz interface
    initializeQuizInterface() {
      if (this.elements["total-questions"]) {
        this.elements["total-questions"].textContent =
          this.state.questions.length;
      }

      this.renderQuiz();
      this.updateProgress();

      // Add entrance animations
      if (this.elements.quizInterface) {
        this.elements.quizInterface.style.animation = "slideInUp 0.8s ease-out";
      }
    }

    // Render quiz
    renderQuiz() {
      this.renderNavigationButtons();
      this.renderCurrentQuestion();
      this.updateQuestionNumbers();
      this.updateProgress();
      this.updateSubmitButtonVisibility();
    }

    // Render navigation buttons
    renderNavigationButtons() {
      if (!this.elements["nav-buttons"]) return;

      this.elements["nav-buttons"].innerHTML = "";

      this.state.questions.forEach((_, index) => {
        const btn = document.createElement("button");
        btn.textContent = index + 1;
        btn.classNameName = "nav-btn";

        // Add state classNamees
        if (index === this.state.currentQuestion)
          btn.classList.add("current");
        if (
          this.state.answers[index] !== null &&
          this.state.answers[index] !== ""
        ) {
          btn.classList.add("answered");
        }
        if (this.state.marked[index]) btn.classList.add("marked");
        if (
          this.state.answers[index] === null ||
          this.state.answers[index] === ""
        ) {
          btn.classList.add("unanswered");
        }

        // Add click handler
        btn.addEventListener("click", () => this.navigateToQuestion(index));

        // Add entrance animation
        btn.style.animationDelay = `${index * 50}ms`;
        btn.classList.add("animate-fadeIn");

        this.elements["nav-buttons"].appendChild(btn);
      });
    }

    // Render current question
    renderCurrentQuestion() {
      if (!this.elements["question-title"] || this.state.questions.length === 0)
        return;

      const question = this.state.questions[this.state.currentQuestion];

      // Update question text with animation
      this.elements["question-title"].style.opacity = "0";
      this.elements["question-title"].style.transform = "translateY(20px)";

      setTimeout(() => {
        this.elements["question-title"].textContent = question.question;
        this.elements["question-title"].style.opacity = "1";
        this.elements["question-title"].style.transform = "translateY(0)";
      }, 200);

      // Render options
      this.renderQuestionOptions(question);
    }

    // Render question options
    renderQuestionOptions(question) {
      if (!this.elements["question-options"]) return;

      this.elements["question-options"].innerHTML = "";

      switch (question.type) {
        case "MCQ":
        case "True/False":
          this.renderRadioOptions(question);
          break;
        case "MSQ":
          this.renderCheckboxOptions(question);
          break;
        case "Numerical":
          this.renderNumericalInput();
          break;
        case "Fill in the blanks":
          this.renderTextInput();
          break;
        default:
          this.renderRadioOptions(question);
      }
    }

    // Render radio options
    renderRadioOptions(question) {
      question.options.forEach((option, index) => {
        const label = this.createOptionElement(
          "radio",
          option,
          index,
          this.state.answers[this.state.currentQuestion] === index
        );
        this.elements["question-options"].appendChild(label);
      });
    }

    // Render checkbox options
    renderCheckboxOptions(question) {
      question.options.forEach((option, index) => {
        const isChecked =
          Array.isArray(this.state.answers[this.state.currentQuestion]) &&
          this.state.answers[this.state.currentQuestion].includes(index);
        const label = this.createOptionElement(
          "checkbox",
          option,
          index,
          isChecked
        );
        this.elements["question-options"].appendChild(label);
      });
    }

    // Create option element
    createOptionElement(type, text, index, isChecked) {
      const label = document.createElement("label");
      label.classNameName = "option-label";

      const input = document.createElement("input");
      input.type = type;
      input.name = "option";
      input.value = index;
      input.checked = isChecked;
      input.style.display = "none";
      input.addEventListener("change", () =>
        this.handleOptionChange(type, index, input.checked)
      );

      const indicator = document.createElement("span");
      indicator.classNameName = "option-indicator";
      indicator.textContent = type === "radio" ? "○" : "☐";

      const textSpan = document.createElement("span");
      textSpan.textContent = text;

      label.appendChild(input);
      label.appendChild(indicator);
      label.appendChild(textSpan);

      // Add entrance animation
      label.style.animationDelay = `${index * 100}ms`;
      label.classList.add("animate-fadeIn");

      return label;
    }

    // Render numerical input
    renderNumericalInput() {
      const container = document.createElement("div");
      container.classNameName = "input-container";

      const input = document.createElement("input");
      input.type = "number";
      input.step = "any";
      input.placeholder = "Enter your numerical answer";
      input.value = this.state.answers[this.state.currentQuestion] || "";
      input.classNameName = "numerical-input";

      input.addEventListener("input", (e) => {
        this.state.answers[this.state.currentQuestion] =
          parseFloat(e.target.value) || null;
        this.renderNavigationButtons();
        this.updateProgress();
      });

      container.appendChild(input);
      this.elements["question-options"].appendChild(container);

      // Focus the input
      setTimeout(() => input.focus(), 100);
    }

    // Render text input
    renderTextInput() {
      const container = document.createElement("div");
      container.classNameName = "input-container";

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Enter your answer";
      input.value = this.state.answers[this.state.currentQuestion] || "";
      input.classNameName = "text-input";

      input.addEventListener("input", (e) => {
        this.state.answers[this.state.currentQuestion] =
          e.target.value.trim() || null;
        this.renderNavigationButtons();
        this.updateProgress();
      });

      container.appendChild(input);
      this.elements["question-options"].appendChild(container);

      // Focus the input
      setTimeout(() => input.focus(), 100);
    }

    // Handle option change
    handleOptionChange(type, index, checked) {
      if (type === "radio") {
        this.state.answers[this.state.currentQuestion] = index;
      } else if (type === "checkbox") {
        if (!Array.isArray(this.state.answers[this.state.currentQuestion])) {
          this.state.answers[this.state.currentQuestion] = [];
        }
        if (checked) {
          this.state.answers[this.state.currentQuestion].push(index);
        } else {
          this.state.answers[this.state.currentQuestion] = this.state.answers[
            this.state.currentQuestion
          ].filter((i) => i !== index);
        }
      }

      this.renderNavigationButtons();
      this.updateProgress();
    }

    // Navigate to question
    navigateToQuestion(index) {
      if (
        index === this.state.currentQuestion ||
        index < 0 ||
        index >= this.state.questions.length
      ) {
        return;
      }

      if (this.elements.questionArea) {
        this.elements.questionArea.style.transform = "translateY(20px)";
        this.elements.questionArea.style.opacity = "0.7";
      }

      setTimeout(() => {
        this.state.currentQuestion = index;
        this.renderQuiz();

        if (this.elements.questionArea) {
          this.elements.questionArea.style.transform = "translateY(0)";
          this.elements.questionArea.style.opacity = "1";
        }
      }, 200);
    }

    // Bind control buttons
    bindControlButtons() {
      const buttons = {
        "prev-btn": () => this.navigateQuestion(-1),
        "next-btn": () => this.navigateQuestion(1),
        "clear-btn": () => this.clearCurrentAnswer(),
        "mark-btn": () => this.toggleMarkForReview(),
        "submit-btn": () => this.submitQuiz(),
      };

      Object.entries(buttons).forEach(([id, handler]) => {
        if (this.elements[id]) {
          this.elements[id].addEventListener("click", handler);
        }
      });
    }

    // Navigate question
    navigateQuestion(direction) {
      const newIndex = this.state.currentQuestion + direction;
      if (newIndex >= 0 && newIndex < this.state.questions.length) {
        this.navigateToQuestion(newIndex);
      }
    }

    // Clear current answer
    clearCurrentAnswer() {
      const questionType =
        this.state.questions[this.state.currentQuestion].type;
      this.state.answers[this.state.currentQuestion] =
        questionType === "MSQ" ? [] : null;
      this.renderQuiz();

      // Visual feedback
      if (this.elements["clear-btn"]) {
        this.elements["clear-btn"].style.transform = "scale(0.95)";
        setTimeout(() => {
          this.elements["clear-btn"].style.transform = "scale(1)";
        }, 150);
      }
    }

    // Toggle mark for review
    toggleMarkForReview() {
      this.state.marked[this.state.currentQuestion] =
        !this.state.marked[this.state.currentQuestion];
      this.renderNavigationButtons();

      // Visual feedback
      if (this.elements["mark-btn"]) {
        this.elements["mark-btn"].style.transform = "scale(0.95)";
        setTimeout(() => {
          this.elements["mark-btn"].style.transform = "scale(1)";
        }, 150);

        // Update button text
        this.elements["mark-btn"].innerHTML = this.state.marked[
          this.state.currentQuestion
        ]
          ? '<i className="fas fa-bookmark"></i> Marked'
          : '<i className="fas fa-bookmark"></i> Mark';
      }
    }

    // Update question numbers
    updateQuestionNumbers() {
      if (this.elements["current-q-num"]) {
        this.elements["current-q-num"].textContent =
          this.state.currentQuestion + 1;
      }
      if (this.elements["current-q-display"]) {
        this.elements["current-q-display"].textContent =
          this.state.currentQuestion + 1;
      }
    }

    // Update progress
    updateProgress() {
      const answeredCount = this.state.answers.filter(
        (answer) =>
          answer !== null &&
          answer !== "" &&
          !(Array.isArray(answer) && answer.length === 0)
      ).length;

      const percentage = Math.round(
        (answeredCount / this.state.questions.length) * 100
      );

      if (this.elements["progress-fill"]) {
        this.elements["progress-fill"].style.width = `${percentage}%`;
      }
      if (this.elements["progress-percentage"]) {
        this.elements["progress-percentage"].textContent = `${percentage}%`;
      }
    }

    // Update submit button visibility
    updateSubmitButtonVisibility() {
      const isLastQuestion =
        this.state.currentQuestion === this.state.questions.length - 1;

      if (this.elements["submit-btn"]) {
        this.elements["submit-btn"].classList.toggle(
          "hidden",
          !isLastQuestion
        );
      }
      if (this.elements["next-btn"]) {
        this.elements["next-btn"].classList.toggle(
          "hidden",
          isLastQuestion
        );
      }
    }

    // Timer functionality
    startTimer() {
      this.updateTimerDisplay();
      this.state.timerInterval = setInterval(() => {
        this.state.timeLeft--;
        this.updateTimerDisplay();
        this.updateTimerProgress();

        if (this.state.timeLeft <= 0) {
          this.handleTimeUp();
        }
      }, 1000);
    }

    // Update timer display
    updateTimerDisplay() {
      const minutes = Math.floor(this.state.timeLeft / 60);
      const seconds = this.state.timeLeft % 60;

      if (this.elements.time) {
        this.elements.time.textContent = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }

      // Add warning styles when time is low
      if (this.state.timeLeft <= 300) {
        // 5 minutes
        const timerCircle = document.querySelector(".timer-circle");
        if (timerCircle) {
          timerCircle.style.background = "var(--gradient-secondary)";
          timerCircle.classList.add("animate-pulse");
        }
      }
    }

    // Update timer progress
    updateTimerProgress() {
      const progressAngle =
        ((this.state.totalTime - this.state.timeLeft) / this.state.totalTime) *
        360;
      if (this.elements["timer-progress"]) {
        this.elements[
          "timer-progress"
        ].style.background = `conic-gradient(#4facfe ${progressAngle}deg, transparent ${progressAngle}deg)`;
      }
    }

    // Handle time up
    handleTimeUp() {
      clearInterval(this.state.timerInterval);
      this.showNotification("Time is up! Submitting your quiz...", "warning");
      setTimeout(() => this.submitQuiz(), 2000);
    }

    // Submit quiz
    submitQuiz() {
      if (!this.state.isQuizActive) return;

      this.state.isQuizActive = false;
      clearInterval(this.state.timerInterval);

      const results = this.calculateResults();
      this.showResults(results);
    }

    // Calculate results
    calculateResults() {
      let correct = 0;
      let attempted = 0;
      let totalMarks = 0;
      let earnedMarks = 0;

      this.state.answers.forEach((answer, index) => {
        const question = this.state.questions[index];
        const questionMarks = question.marks || 1;
        totalMarks += questionMarks;

        if (
          answer !== null &&
          answer !== "" &&
          !(Array.isArray(answer) && answer.length === 0)
        ) {
          attempted++;

          // Simple comparison for demo
          if (JSON.stringify(answer) === JSON.stringify(question.answer)) {
            correct++;
            earnedMarks += questionMarks;
          }
        }
      });

      const percentage =
        totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;

      return {
        total: this.state.questions.length,
        attempted,
        correct,
        percentage,
        earnedMarks,
        totalMarks,
        timeTaken: this.state.totalTime - this.state.timeLeft,
      };
    }

    // Show results
    showResults(results) {
      const modal = document.createElement("div");
      modal.classNameName = "results-modal";
      modal.innerHTML = `
      <div className="modal-content">
        <div className="results-header">
          <i className="fas fa-trophy"></i>
          <h2>Quiz Completed!</h2>
        </div>
        <div className="results-stats">
          <div className="stat">
            <span className="stat-value">${results.correct}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat">
            <span className="stat-value">${results.attempted}</span>
            <span className="stat-label">Attempted</span>
          </div>
          <div className="stat">
            <span className="stat-value">${results.earnedMarks}/${results.totalMarks}</span>
            <span className="stat-label">Marks</span>
          </div>
          <div className="stat">
            <span className="stat-value">${results.percentage}%</span>
            <span className="stat-label">Score</span>
          </div>
        </div>
        <div className="results-actions">
          <button onclick="location.reload()" className="btn-restart">
            <i className="fas fa-redo"></i>
            Start New Quiz
          </button>
        </div>
      </div>
    `;

      modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.5s ease;
    `;

      document.body.appendChild(modal);
    }

    // Setup suggestions
    setupSuggestions() {
      if (this.elements.subject) {
        this.elements.subject.addEventListener("input", (e) =>
          this.handleSubjectInput(e)
        );
        this.elements.subject.addEventListener("focus", () =>
          this.showSubjectSuggestions()
        );
      }

      if (this.elements.topic) {
        this.elements.topic.addEventListener("input", (e) =>
          this.handleTopicInput(e)
        );
        this.elements.topic.addEventListener("focus", () => {
          const subject = this.elements.subject?.value.trim();
          if (subject && this.suggestions.topics[subject]) {
            this.showTopicSuggestions(subject);
          }
        });
      }

      // Hide suggestions when clicking outside
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".subject-input-container")) {
          this.hideSubjectSuggestions();
        }
        if (!e.target.closest(".input-group")) {
          this.hideTopicSuggestions();
        }
      });
    }

    // Handle subject input
    handleSubjectInput(e) {
      const value = e.target.value.toLowerCase();
      const filteredSuggestions = this.suggestions.subjects.filter((subject) =>
        subject.toLowerCase().includes(value)
      );

      if (filteredSuggestions.length > 0 && value.length > 0) {
        this.renderSubjectSuggestions(filteredSuggestions);
      } else {
        this.hideSubjectSuggestions();
      }
    }

    // Handle topic input
    handleTopicInput(e) {
      const subject = this.elements.subject?.value.trim();
      if (subject && this.suggestions.topics[subject]) {
        this.showTopicSuggestions(subject);
      }
    }

    // Show subject suggestions
    showSubjectSuggestions() {
      const value = this.elements.subject?.value.toLowerCase() || "";
      if (value.length > 0) {
        const filteredSuggestions = this.suggestions.subjects.filter(
          (subject) => subject.toLowerCase().includes(value)
        );
        this.renderSubjectSuggestions(filteredSuggestions);
      }
    }

    // Render subject suggestions
    renderSubjectSuggestions(suggestions) {
      if (!this.elements["subject-suggestions"]) return;

      this.elements["subject-suggestions"].innerHTML = "";

      suggestions.slice(0, 8).forEach((suggestion) => {
        const item = document.createElement("div");
        item.classNameName = "suggestion-item";
        item.textContent = suggestion;
        item.addEventListener("click", () => {
          if (this.elements.subject) this.elements.subject.value = suggestion;
          this.hideSubjectSuggestions();
          if (this.elements.topic) this.elements.topic.focus();
        });
        this.elements["subject-suggestions"].appendChild(item);
      });

      this.elements["subject-suggestions"].style.display = "block";
    }

    // Hide subject suggestions
    hideSubjectSuggestions() {
      if (this.elements["subject-suggestions"]) {
        this.elements["subject-suggestions"].style.display = "none";
      }
    }

    // Show topic suggestions
    showTopicSuggestions(subject) {
      const suggestions = this.suggestions.topics[subject] || [];
      const currentValue = this.elements.topic?.value.toLowerCase() || "";

      const filteredSuggestions = suggestions.filter((topic) =>
        topic.toLowerCase().includes(currentValue)
      );

      if (filteredSuggestions.length > 0) {
        this.renderTopicSuggestions(filteredSuggestions);
      } else {
        this.hideTopicSuggestions();
      }
    }

    // Render topic suggestions
    renderTopicSuggestions(suggestions) {
      if (!this.elements["topic-suggestions"]) return;

      this.elements["topic-suggestions"].innerHTML = "";

      suggestions.slice(0, 8).forEach((suggestion) => {
        const item = document.createElement("div");
        item.classNameName = "suggestion-item";
        item.textContent = suggestion;
        item.addEventListener("click", () => {
          if (this.elements.topic) this.elements.topic.value = suggestion;
          this.hideTopicSuggestions();
        });
        this.elements["topic-suggestions"].appendChild(item);
      });

      this.elements["topic-suggestions"].style.display = "block";
    }

    // Hide topic suggestions
    hideTopicSuggestions() {
      if (this.elements["topic-suggestions"]) {
        this.elements["topic-suggestions"].style.display = "none";
      }
    }

    // Add enhanced interactions
    addEnhancedInteractions() {
      this.addCardSelectionEffects();
      this.addFormValidation();
      this.addMobileSupport();
    }

    // Add card selection effects
    addCardSelectionEffects() {
      const cards = document.querySelectorAll(
        ".questions-option, .difficulty-card"
      );

      cards.forEach((card) => {
        card.addEventListener("click", (e) => {
          const siblings = card.parentElement.querySelectorAll(card.tagName);
          siblings.forEach((sibling) =>
            sibling.classList.remove("selected")
          );

          card.classList.add("selected");
          this.createRippleEffect(card, e);
        });
      });
    }

    // Create ripple effect
    createRippleEffect(element, event) {
      const ripple = document.createElement("div");
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

      element.style.position = "relative";
      element.style.overflow = "hidden";
      element.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    }

    // Add form validation
    addFormValidation() {
      const inputs = document.querySelectorAll(
        'input[type="text"], input[type="number"]'
      );

      inputs.forEach((input) => {
        input.addEventListener("blur", (e) => this.validateField(e));
        input.addEventListener("input", (e) => this.clearFieldError(e));
      });
    }

    // Validate field
    validateField(e) {
      const field = e.target;
      const value = field.value.trim();

      this.clearFieldError(e);

      if (field.hasAttribute("required") && !value) {
        this.showFieldError(field, "This field is required");
      }
    }

    // Clear field error
    clearFieldError(e) {
      const field = e.target;
      field.classList.remove("error");

      const errorMsg = field.parentElement.querySelector(".error-message");
      if (errorMsg) {
        errorMsg.remove();
      }
    }

    // Show field error
    showFieldError(field, message) {
      field.classList.add("error");

      const errorDiv = document.createElement("div");
      errorDiv.classNameName = "error-message";
      errorDiv.textContent = message;
      errorDiv.style.cssText = `
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 0.25rem;
      animation: fadeIn 0.3s ease;
    `;

      field.parentElement.appendChild(errorDiv);
    }

    // Add mobile support
    addMobileSupport() {
      let touchStartX = null;
      let touchStartY = null;

      document.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      });

      document.addEventListener("touchend", (e) => {
        if (touchStartX === null || touchStartY === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchStartX - touchEndX;
        const deltaY = touchStartY - touchEndY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            this.navigateQuestion(1);
          } else {
            this.navigateQuestion(-1);
          }
        }

        touchStartX = null;
        touchStartY = null;
      });
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
      if (this.elements["quiz-page"]?.classList.contains("hidden")) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          this.navigateQuestion(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          this.navigateQuestion(1);
          break;
        case "Delete":
        case "Backspace":
          if (e.ctrlKey) {
            e.preventDefault();
            this.clearCurrentAnswer();
          }
          break;
        case "m":
        case "M":
          if (e.ctrlKey) {
            e.preventDefault();
            this.toggleMarkForReview();
          }
          break;
        case "Enter":
          if (
            e.ctrlKey &&
            this.state.currentQuestion === this.state.questions.length - 1
          ) {
            e.preventDefault();
            this.submitQuiz();
          }
          break;
      }
    }

    // Handle before unload
    handleBeforeUnload(e) {
      if (this.state.isQuizActive) {
        e.preventDefault();
        e.returnValue =
          "You have an active quiz. Are you sure you want to leave?";
      }
    }

    // Handle resize
    handleResize() {
      // Responsive adjustments if needed
    }

    // Handle visibility change
    handleVisibilityChange() {
      if (document.visibilityState === "hidden" && this.state.isQuizActive) {
        // Optionally pause timer or log tab switching
        console.log("User switched tabs during quiz");
      }
    }

    // Show loading state
    showLoadingState() {
      if (this.elements["start-quiz-btn"]) {
        const btn = this.elements["start-quiz-btn"];
        const originalContent = btn.querySelector(".btn-content")?.innerHTML;

        btn.disabled = true;
        if (btn.querySelector(".btn-content")) {
          btn.querySelector(".btn-content").innerHTML = `
          <span className="btn-icon">
            <i className="fas fa-spinner fa-spin"></i>
          </span>
          <span className="btn-text">Generating Quiz...</span>
        `;
        }

        btn.dataset.originalContent = originalContent;
      }
    }

    // Hide loading state
    hideLoadingState() {
      if (this.elements["start-quiz-btn"]) {
        const btn = this.elements["start-quiz-btn"];

        if (btn.dataset.originalContent && btn.querySelector(".btn-content")) {
          btn.disabled = false;
          btn.querySelector(".btn-content").innerHTML =
            btn.dataset.originalContent;
          delete btn.dataset.originalContent;
        }
      }
    }

    // Show notification
    showNotification(message, type = "info") {
      const notification = document.createElement("div");
      notification.classNameName = `notification notification-${type}`;
      notification.innerHTML = `
      <i className="fas fa-${this.getNotificationIcon(type)}"></i>
      <span>${message}</span>
      <button className="notification-close">&times;</button>
    `;

      notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 320px;
      max-width: 500px;
      animation: slideInRight 0.5s ease-out;
      backdrop-filter: blur(10px);
    `;

      notification
        .querySelector(".notification-close")
        .addEventListener("click", () => {
          notification.style.animation = "slideOutRight 0.3s ease-in";
          setTimeout(() => notification.remove(), 300);
        });

      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = "slideOutRight 0.3s ease-in";
          setTimeout(() => notification.remove(), 300);
        }
      }, 5000);

      document.body.appendChild(notification);
    }

    // Get notification icon
    getNotificationIcon(type) {
      const icons = {
        info: "info-circle",
        success: "check-circle",
        warning: "exclamation-triangle",
        error: "times-circle",
      };
      return icons[type] || "info-circle";
    }

    // Get notification color
    getNotificationColor(type) {
      const colors = {
        info: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        success: "linear-gradient(135deg, #10b981, #059669)",
        warning: "linear-gradient(135deg, #f59e0b, #d97706)",
        error: "linear-gradient(135deg, #ef4444, #dc2626)",
      };
      return colors[type] || colors.info;
    }

    // Utility function for delays
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  }

  // Additional CSS for notifications and ripple effects
  useEffect(() => {
    const additionalStyles = document.createElement("style");
    additionalStyles.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        transition: opacity 0.2s ease;
      }

      .notification-close:hover {
        opacity: 0.7;
      }

      .results-modal .modal-content {
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-2xl);
        padding: 3rem;
        text-align: center;
        color: white;
        max-width: 500px;
        width: 90%;
        animation: scaleIn 0.5s ease-out;
      }

      .results-header {
        margin-bottom: 2rem;
      }

      .results-header i {
        font-size: 4rem;
        color: #f59e0b;
        margin-bottom: 1rem;
        animation: bounce 1s ease-in-out infinite;
      }

      .results-header h2 {
        font-size: 2rem;
        font-weight: var(--font-weight-bold);
        margin-bottom: 0.5rem;
      }

      .results-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat {
        text-align: center;
      }

      .stat-value {
        display: block;
        font-size: 2rem;
        font-weight: var(--font-weight-bold);
        background: var(--gradient-success);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-label {
        font-size: 0.9rem;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .btn-restart {
        background: var(--gradient-success);
        border: none;
        padding: 1rem 2rem;
        border-radius: var(--radius-full);
        color: white;
        font-size: 1.1rem;
        font-weight: var(--font-weight-semibold);
        cursor: pointer;
        transition: all var(--transition-normal);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 auto;
        font-family: var(--font-family);
      }

      .btn-restart:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(79, 172, 254, 0.4);
      }

      @keyframes scaleIn {
        from {
          transform: scale(0.8);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(additionalStyles);

    return () => {
      document.head.removeChild(additionalStyles);
    };
  }, []);

  // Initialize the application when DOM is loaded
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.quizApp = new QuizApp();
    }
  }, []);

  // Export for potential use in other scripts
  if (typeof module !== "undefined" && module.exports) {
    module.exports = QuizApp;
  }

  return (
    <>
      <head>
        <title>Quiz.AI - Ultimate Quiz Platform</title>
      </head>
      <main>
        {/* Animated Background */}
        <div className="animated-background">
          <div className="floating-elements">
            <div className="element element-1">📚</div>
            <div className="element element-2">🧮</div>
            <div className="element element-3">⚛️</div>
            <div className="element element-4">🌍</div>
            <div className="element element-5">💡</div>
            <div className="element element-6">🎯</div>
          </div>
          <div className="geometric-shapes">
            <div className="shape triangle"></div>
            <div className="shape circle"></div>
            <div className="shape square"></div>
            <div className="shape hexagon"></div>
          </div>
        </div>

        {/* Loading Screen */}
        <div
          ref={loadingScreenRef}
          id="loading-screen"
          className="loading-screen"
        >
          <div className="loader-container">
            <div className="modern-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <h3 className="loading-title">Quiz.AI</h3>
            <p className="loading-text">
              Crafting your perfect quiz experience...
            </p>
            <div className="loading-progress">
              <div className="progress-bar-loading"></div>
            </div>
          </div>
        </div>

        {/* Page 1: Quiz Setup Section */}
        <div id="setup-page" className="page-container">
          <header className="main-header">
            <div className="logo-container">
              <div className="logo-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="logo-text">
                <h1>Quiz.AI</h1>
                <p>Master Every Subject, Ace Every Quiz</p>
              </div>
            </div>
          </header>

          <main className="setup-main">
            <div className="setup-container">
              <div className="setup-header">
                <h2 className="setup-title">
                  <span className="title-icon">🎯</span>
                  Quiz configuration
                </h2>
                <p className="setup-subtitle">
                  Choose your subject, set your challenge level, and let's begin
                  your learning adventure!
                </p>
              </div>

              {/* Instructions Panel  */}
              <div className="instructions-panel">
                <div className="instructions-header">
                  <i className="fas fa-info-circle"></i>
                  <h3>Quiz Instructions & Marking System</h3>
                </div>
                <div className="instructions-content">
                  <div className="instruction-item">
                    <div className="instruction-icon">📊</div>
                    <div className="instruction-text">
                      <strong>Marking System:</strong> Each question carries
                      equal marks. Multiple choice questions = 1 mark each.
                      Numerical/Fill-in-the-blank = 2 marks each.
                    </div>
                  </div>
                  <div className="instruction-item">
                    <div className="instruction-icon">🎯</div>
                    <div className="instruction-text">
                      <strong>Difficulty Levels:</strong>
                      <div className="difficulty-info">
                        <span className="diff-badge beginner">Beginner</span> -
                        Basic concepts and simple questions
                        <span className="diff-badge intermediate">
                          Intermediate
                        </span>{" "}
                        - Moderate complexity with analytical thinking
                        <span className="diff-badge advanced">Advanced</span> -
                        Complex problems requiring deep understanding
                        <span className="diff-badge expert">Expert</span> -
                        Challenging questions for mastery assessment
                      </div>
                    </div>
                  </div>
                  <div className="instruction-item">
                    <div className="instruction-icon">⏱️</div>
                    <div className="instruction-text">
                      <strong>Time Allocation:</strong> You get approximately
                      1-2 minutes per question depending on difficulty level and
                      question type.
                    </div>
                  </div>
                </div>
              </div>

              <form id="quiz-setup-form" className="setup-form">
                {/* Subject Input  */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-book-open"></i>
                    Enter Your Subject
                  </h3>
                  <div className="subject-input-container">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="subject"
                        placeholder="e.g., Mathematics, Physics, Computer Science, History..."
                        required
                        autocomplete="off"
                      ></input>
                      <div className="input-highlight"></div>
                    </div>
                    <div
                      className="subject-suggestions"
                      id="subject-suggestions"
                    ></div>
                  </div>
                </div>

                {/* Topic Input  */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-lightbulb"></i>
                    Specify Your Topic
                  </h3>
                  <div className="input-group">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="topic"
                        placeholder="e.g., Quadratic Equations, Newton's Laws, Data Structures..."
                        required
                        autocomplete="off"
                      ></input>
                      <div className="input-highlight"></div>
                    </div>
                    <div
                      className="topic-suggestions"
                      id="topic-suggestions"
                    ></div>
                  </div>
                </div>

                {/* Number of Questions Selection  */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-hashtag"></i>
                    Number of Questions
                  </h3>
                  <div className="questions-selector">
                    <label className="questions-option" data-questions="5">
                      <input
                        type="radio"
                        name="questions"
                        value="5"
                        required
                      ></input>
                      <div className="questions-content">
                        <div className="questions-number">5</div>
                        <div className="questions-label">Quick Test</div>
                        <div className="questions-time">~5-8 minutes</div>
                      </div>
                    </label>

                    <label className="questions-option" data-questions="10">
                      <input
                        type="radio"
                        name="questions"
                        value="10"
                        required
                      ></input>
                      <div className="questions-content">
                        <div className="questions-number">10</div>
                        <div className="questions-label">Short Quiz</div>
                        <div className="questions-time">~10-15 minutes</div>
                      </div>
                    </label>

                    <label className="questions-option" data-questions="20">
                      <input
                        type="radio"
                        name="questions"
                        value="20"
                        required
                      ></input>
                      <div className="questions-content">
                        <div className="questions-number">20</div>
                        <div className="questions-label">Standard Test</div>
                        <div className="questions-time">~20-30 minutes</div>
                      </div>
                    </label>

                    <label className="questions-option" data-questions="30">
                      <input
                        type="radio"
                        name="questions"
                        value="30"
                        required
                      ></input>
                      <div className="questions-content">
                        <div className="questions-number">30</div>
                        <div className="questions-label">Full Exam</div>
                        <div className="questions-time">~40-60 minutes</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Question Types  */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-list-check"></i>
                    Question Types
                  </h3>
                  <div className="question-types">
                    <label className="type-checkbox">
                      <input type="checkbox" name="qtype" value="MCQ"></input>
                      <div className="checkbox-design">
                        <div className="checkbox-icon">
                          <i className="fas fa-list-ul"></i>
                        </div>
                        <div className="checkbox-content">
                          <div className="checkbox-title">Multiple Choice</div>
                          <div className="checkbox-desc">
                            Pick one correct answer (1 mark)
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="type-checkbox">
                      <input type="checkbox" name="qtype" value="MSQ"></input>
                      <div className="checkbox-design">
                        <div className="checkbox-icon">
                          <i className="fas fa-check-double"></i>
                        </div>
                        <div className="checkbox-content">
                          <div className="checkbox-title">Multiple Select</div>
                          <div className="checkbox-desc">
                            Choose multiple answers (1 mark)
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="type-checkbox">
                      <input
                        type="checkbox"
                        name="qtype"
                        value="Numerical"
                      ></input>
                      <div className="checkbox-design">
                        <div className="checkbox-icon">
                          <i className="fas fa-calculator"></i>
                        </div>
                        <div className="checkbox-content">
                          <div className="checkbox-title">Numerical</div>
                          <div className="checkbox-desc">
                            Enter exact numbers (2 marks)
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="type-checkbox">
                      <input
                        type="checkbox"
                        name="qtype"
                        value="True/False"
                      ></input>
                      <div className="checkbox-design">
                        <div className="checkbox-icon">
                          <i className="fas fa-balance-scale"></i>
                        </div>
                        <div className="checkbox-content">
                          <div className="checkbox-title">True/False</div>
                          <div className="checkbox-desc">
                            Simple true or false (1 mark)
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="type-checkbox">
                      <input
                        type="checkbox"
                        name="qtype"
                        value="Fill in the blanks"
                      ></input>
                      <div className="checkbox-design">
                        <div className="checkbox-icon">
                          <i className="fas fa-pen"></i>
                        </div>
                        <div className="checkbox-content">
                          <div className="checkbox-title">Fill Blanks</div>
                          <div className="checkbox-desc">
                            Complete the sentence (2 marks)
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="type-checkbox">
                      <input type="checkbox" name="qtype" value="Mixed"></input>
                      <div className="checkbox-design">
                        <div className="checkbox-icon">
                          <i className="fas fa-random"></i>
                        </div>
                        <div className="checkbox-content">
                          <div className="checkbox-title">Mixed Types</div>
                          <div className="checkbox-desc">
                            Variety of questions (variable marks)
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Difficulty Level  */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-chart-line"></i>
                    Difficulty Level
                  </h3>
                  <div className="difficulty-selector">
                    <label className="difficulty-card" data-level="beginner">
                      <input
                        type="radio"
                        name="difficulty"
                        value="Beginner"
                        required
                      ></input>
                      <div className="difficulty-content">
                        <div className="difficulty-icon">🟢</div>
                        <div className="difficulty-title">Beginner</div>
                        <div className="difficulty-desc">
                          Perfect for learning basics
                        </div>
                        <div className="difficulty-bar">
                          <div
                            className="bar-fill"
                            style={{ width: "30%" }}
                          ></div>
                        </div>
                      </div>
                    </label>

                    <label
                      className="difficulty-card"
                      data-level="intermediate"
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value="Intermediate"
                        required
                      ></input>
                      <div className="difficulty-content">
                        <div className="difficulty-icon">🟡</div>
                        <div className="difficulty-title">Intermediate</div>
                        <div className="difficulty-desc">
                          For solid understanding
                        </div>
                        <div className="difficulty-bar">
                          <div
                            className="bar-fill"
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                      </div>
                    </label>

                    <label className="difficulty-card" data-level="advanced">
                      <input
                        type="radio"
                        name="difficulty"
                        value="Advanced"
                        required
                      ></input>
                      <div className="difficulty-content">
                        <div className="difficulty-icon">🟠</div>
                        <div className="difficulty-title">Advanced</div>
                        <div className="difficulty-desc">
                          Challenge your expertise
                        </div>
                        <div className="difficulty-bar">
                          <div
                            className="bar-fill"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </div>
                    </label>

                    <label className="difficulty-card" data-level="expert">
                      <input
                        type="radio"
                        name="difficulty"
                        value="Expert"
                        required
                      ></input>
                      <div className="difficulty-content">
                        <div className="difficulty-icon">🔴</div>
                        <div className="difficulty-title">Expert</div>
                        <div className="difficulty-desc">
                          Ultimate mastery test
                        </div>
                        <div className="difficulty-bar">
                          <div
                            className="bar-fill"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button  */}
                <div className="form-section">
                  <button
                    type="submit"
                    className="start-quiz-btn"
                    id="start-quiz-btn"
                  >
                    <div className="btn-content">
                      <span className="btn-icon">
                        <i className="fas fa-rocket"></i>
                      </span>
                      <span className="btn-text">Launch Quiz</span>
                      <span className="btn-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </span>
                    </div>
                    <div className="btn-glow"></div>
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>

        {/* Page 2: Quiz Interface Section  */}
        <div id="quiz-page" className="page-container hidden">
          <div className="quiz-interface">
            {/* Quiz Header  */}
            <header className="quiz-header">
              <div className="quiz-info-panel">
                <div className="quiz-brand">
                  <i className="fas fa-graduation-cap"></i>
                  <span>QuizMaster Pro</span>
                </div>
                <div className="quiz-metadata">
                  <div className="meta-chip">
                    <i className="fas fa-book"></i>
                    <span id="info-subject">-</span>
                  </div>
                  <div className="meta-chip">
                    <i className="fas fa-lightbulb"></i>
                    <span id="info-topic">-</span>
                  </div>
                  <div className="meta-chip">
                    <i className="fas fa-hashtag"></i>
                    <span id="info-questions">-</span> Questions
                  </div>
                  <div className="meta-chip">
                    <i className="fas fa-chart-line"></i>
                    <span id="info-difficulty">-</span>
                  </div>
                </div>
              </div>

              <div className="timer-panel">
                <div className="timer-display">
                  <div className="timer-circle">
                    <div className="timer-progress" id="timer-progress"></div>
                    <div className="timer-content">
                      <i className="fas fa-clock"></i>
                      <span id="time">--:--</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Quiz Content  */}
            <main className="quiz-content">
              {/* Question Navigation Sidebar  */}
              <aside className="question-sidebar">
                <div className="sidebar-header">
                  <h3>
                    <i className="fas fa-list-ol"></i>
                    Questions
                  </h3>
                  <div className="question-counter">
                    <span id="current-q-display">1</span> /{" "}
                    <span id="total-questions">0</span>
                  </div>
                </div>

                <div className="question-grid" id="nav-buttons"></div>

                <div className="sidebar-legend">
                  <div className="legend-item">
                    <div className="legend-color answered"></div>
                    <span>Answered</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color marked"></div>
                    <span>Marked</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color current"></div>
                    <span>Current</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color unanswered"></div>
                    <span>Unanswered</span>
                  </div>
                </div>
              </aside>

              {/* Main Question Area  */}
              <section className="question-area">
                <div className="question-header">
                  <div className="progress-container">
                    <div className="progress-track">
                      <div className="progress-fill" id="progress-fill"></div>
                    </div>
                    <div className="progress-text">
                      <span id="progress-percentage">0%</span> Complete
                    </div>
                  </div>
                </div>

                <div className="question-content">
                  <div className="question-number-badge">
                    Question <span id="current-q-num">1</span>
                  </div>
                  <div id="question-title" className="question-text">
                    Loading question...
                  </div>
                  <div
                    id="question-options"
                    className="options-container"
                  ></div>
                </div>

                <div className="question-controls">
                  <div className="control-group left">
                    <button id="prev-btn" className="control-btn secondary">
                      <i className="fas fa-chevron-left"></i>
                      Previous
                    </button>
                  </div>

                  <div className="control-group center">
                    <button id="clear-btn" className="control-btn warning">
                      <i className="fas fa-eraser"></i>
                      Clear
                    </button>
                    <button id="mark-btn" className="control-btn info">
                      <i className="fas fa-bookmark"></i>
                      Mark
                    </button>
                  </div>

                  <div className="control-group right">
                    <button id="next-btn" className="control-btn primary">
                      Next
                      <i className="fas fa-chevron-right"></i>
                    </button>
                    <button
                      id="submit-btn"
                      className="control-btn success hidden"
                    >
                      <i className="fas fa-check"></i>
                      Submit Quiz
                    </button>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </main>
    </>
  );
};

export default Quiz;
