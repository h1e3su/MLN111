document.addEventListener('DOMContentLoaded', () => {
    // quizData is loaded globally from questions.js

    const state = {
        questions: [],
        currentIndex: 0,
        score: 0,
        answered: false
    };

    const elements = {
        loading: document.getElementById('loading'),
        quizContent: document.getElementById('quiz-content'),
        resultContainer: document.getElementById('result-container'),
        questionText: document.getElementById('question-text'),
        alternativeQuestion: document.getElementById('alternative-question'),
        optionsContainer: document.getElementById('options-container'),
        progressBar: document.getElementById('progress-bar'),
        questionCount: document.getElementById('question-count'),
        scoreCount: document.getElementById('score-count'),
        jumpInput: document.getElementById('jump-input'),
        jumpBtn: document.getElementById('jump-btn'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        checkBtn: document.getElementById('check-btn'),
        showAnswerBtn: document.getElementById('show-answer-btn'),
        restartBtn: document.getElementById('restart-btn'),
        finalScore: document.getElementById('final-score')
    };

    function init() {
        if (typeof quizData !== 'undefined' && Array.isArray(quizData)) {
            state.questions = quizData;
            elements.loading.classList.add('hidden');
            elements.quizContent.classList.remove('hidden');
            loadQuestion(0);
        } else {
            elements.loading.textContent = 'Lỗi tải dữ liệu. Vui lòng kiểm tra lại.';
        }
        
        setupEventListeners();
    }

    function setupEventListeners() {
        elements.nextBtn.addEventListener('click', () => {
            if (state.currentIndex < state.questions.length - 1) {
                loadQuestion(state.currentIndex + 1);
            } else {
                showResults();
            }
        });

        elements.prevBtn.addEventListener('click', () => {
            if (state.currentIndex > 0) {
                loadQuestion(state.currentIndex - 1);
            }
        });

        elements.checkBtn.addEventListener('click', () => {
            if (!state.answered) {
                checkAnswer();
            }
        });

        elements.showAnswerBtn.addEventListener('click', () => {
            if (!state.answered) {
                showAnswer();
            }
        });

        elements.jumpBtn.addEventListener('click', jumpToQuestion);
        
        elements.jumpInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                jumpToQuestion();
            }
        });

        elements.restartBtn.addEventListener('click', () => {
            state.currentIndex = 0;
            state.score = 0;
            elements.resultContainer.classList.add('hidden');
            elements.quizContent.classList.remove('hidden');
            loadQuestion(0);
        });
    }

    function jumpToQuestion() {
        let val = parseInt(elements.jumpInput.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > state.questions.length) val = state.questions.length;
        
        // Reset score logic? Usually jumping around means score might be inconsistent,
        // but we'll just keep the score as is to allow free navigation.
        
        elements.resultContainer.classList.add('hidden');
        elements.quizContent.classList.remove('hidden');
        loadQuestion(val - 1);
        elements.jumpInput.value = '';
    }

    function loadQuestion(index) {
        state.currentIndex = index;
        state.answered = false;
        const q = state.questions[index];

        // Update UI Text
        elements.questionText.textContent = q.question;
        
        if (q.alternativeQuestion) {
            elements.alternativeQuestion.textContent = q.alternativeQuestion;
            elements.alternativeQuestion.classList.remove('hidden');
        } else {
            elements.alternativeQuestion.classList.add('hidden');
        }

        // Render Options
        elements.optionsContainer.innerHTML = '';
        q.options.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'option';
            btn.textContent = opt;
            btn.dataset.letter = opt.charAt(0);
            
            btn.addEventListener('click', () => handleOptionClick(btn, q));
            elements.optionsContainer.appendChild(btn);
        });

        // Update Buttons and Progress
        elements.prevBtn.disabled = index === 0;
        elements.nextBtn.textContent = index === state.questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp';
        elements.checkBtn.disabled = true;
        elements.showAnswerBtn.disabled = false;
        
        updateProgress();
    }

    function handleOptionClick(selectedBtn, q) {
        if (state.answered) return;
        
        selectedBtn.classList.toggle('selected');
        
        const selectedOptions = elements.optionsContainer.querySelectorAll('.option.selected');
        elements.checkBtn.disabled = selectedOptions.length === 0;
    }

    function checkAnswer() {
        if (state.answered) return;
        state.answered = true;

        const q = state.questions[state.currentIndex];
        const correctLetters = q.answer || [];

        const options = elements.optionsContainer.querySelectorAll('.option');
        let allCorrect = true;
        let anyWrong = false;
        let selectedCount = 0;

        options.forEach(opt => {
            opt.classList.add('disabled');
            const letter = opt.dataset.letter;
            const isSelected = opt.classList.contains('selected');
            const isCorrect = correctLetters.includes(letter);

            if (isSelected) selectedCount++;

            if (isCorrect) {
                opt.classList.add('correct');
                if (!isSelected) allCorrect = false;
            }
            if (isSelected && !isCorrect) {
                opt.classList.add('wrong');
                anyWrong = true;
            }
        });

        if (allCorrect && !anyWrong && selectedCount === correctLetters.length && correctLetters.length > 0) {
            state.score++;
        }

        elements.checkBtn.disabled = true;
        elements.showAnswerBtn.disabled = true;
        updateProgress();
    }

    function showAnswer() {
        if (state.answered) return;
        state.answered = true;
        
        const q = state.questions[state.currentIndex];
        const correctLetters = q.answer || [];

        const options = elements.optionsContainer.querySelectorAll('.option');
        options.forEach(opt => {
            opt.classList.add('disabled');
            if (correctLetters.includes(opt.dataset.letter)) {
                opt.classList.add('correct');
            }
        });

        elements.checkBtn.disabled = true;
        elements.showAnswerBtn.disabled = true;
    }

    function updateProgress() {
        const total = state.questions.length;
        const current = state.currentIndex + 1;
        const percent = (current / total) * 100;

        elements.progressBar.style.width = `${percent}%`;
        elements.questionCount.textContent = `Câu hỏi: ${current}/${total}`;
        elements.scoreCount.textContent = `Điểm: ${state.score}`;
    }

    function showResults() {
        elements.quizContent.classList.add('hidden');
        elements.resultContainer.classList.remove('hidden');
        elements.finalScore.textContent = `${state.score} / ${state.questions.length}`;
        
        // Hide header elements that don't make sense on result page
        elements.progressBar.style.width = '100%';
    }

    // Start App
    init();
});
