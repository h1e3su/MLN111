const fs = require('fs');
const path = require('path');

const dirPath = __dirname;
const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.md') && file.startsWith('MLN111'));

let allQuestions = [];
let currentQuestion = null;

for (const file of files) {
  const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.match(/^\*\*Câu \d+:\*\*/)) {
      if (currentQuestion && currentQuestion.question) {
        allQuestions.push(currentQuestion);
      }
      currentQuestion = {
        question: line.replace(/^\*\*Câu \d+:\*\*\s*/, ''),
        options: [],
        answer: null,
        alternativeQuestion: null
      };
    } else if (currentQuestion && line.match(/^[A-D]\./)) {
      currentQuestion.options.push(line);
    } else if (currentQuestion && line.match(/^\*\*Đáp án:\s*(.*?)\*\*/)) {
      const ansStr = line.match(/^\*\*Đáp án:\s*(.*?)\*\*/)[1];
      currentQuestion.answer = ansStr.match(/[A-D]/g) || [];
    } else if (currentQuestion && line.match(/^>\s*\*Kiểu hỏi khác:\*\s*(.*)/)) {
      currentQuestion.alternativeQuestion = line.match(/^>\s*\*Kiểu hỏi khác:\*\s*(.*)/)[1];
    } else if (currentQuestion && line !== '' && !line.match(/^---/) && !line.match(/^# /)) {
      if (currentQuestion.options.length === 0 && !currentQuestion.answer) {
        currentQuestion.question += '\n' + line;
      }
    }
  }
}

if (currentQuestion && currentQuestion.question) {
  allQuestions.push(currentQuestion);
}

fs.writeFileSync(path.join(dirPath, 'questions.json'), JSON.stringify(allQuestions, null, 2));
console.log(`Successfully parsed ${allQuestions.length} questions.`);
