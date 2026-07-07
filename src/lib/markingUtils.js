/**
 * IELTS Listening Auto-Marker
 * Handles all 6 question types
 */

// Normalize text for comparison — lowercase, trim, remove extra spaces, strip articles
function normalize(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^(a|an|the)\s+/i, "")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

// Check if student answer matches correct answer (with flexibility)
function isCorrect(studentAnswer, correctAnswer) {
  if (!studentAnswer || !correctAnswer) return false;
  const s = normalize(String(studentAnswer));
  const c = normalize(String(correctAnswer));
  if (s === c) return true;
  // Also accept if correct answer is contained in student answer (for slight variations)
  if (s.includes(c) || c.includes(s)) return true;
  return false;
}

/**
 * Mark a single question block
 * Returns { scored: number, total: number, breakdown: [] }
 */
export function markQuestion(question, studentAnswers) {
  const { type, content } = question;
  const qId = question.id;
  const results = [];

  switch (type) {
    case "mcq": {
      // studentAnswers[qId] = selected option string
      const correct = isCorrect(studentAnswers[qId], content.correctAnswer);
      results.push({
        key: qId,
        correct,
        studentAnswer: studentAnswers[qId],
        correctAnswer: content.correctAnswer,
      });
      break;
    }

    case "form-completion": {
      // studentAnswers[`${qId}-field-${i}`] = typed answer
      content.fields.forEach((field, i) => {
        const key = `${qId}-field-${i}`;
        const correct = isCorrect(studentAnswers[key], field.answer);
        results.push({
          key,
          correct,
          studentAnswer: studentAnswers[key],
          correctAnswer: field.answer,
          label: field.label,
        });
      });
      break;
    }

    case "sentence-completion": {
      // studentAnswers[`${qId}-sent-${i}`] = typed answer
      content.sentences.forEach((sent, i) => {
        const key = `${qId}-sent-${i}`;
        const correct = isCorrect(studentAnswers[key], sent.answer);
        results.push({
          key,
          correct,
          studentAnswer: studentAnswers[key],
          correctAnswer: sent.answer,
        });
      });
      break;
    }

    case "short-answer": {
      // studentAnswers[`${qId}-q-${i}`] = typed answer
      content.questions.forEach((q, i) => {
        const key = `${qId}-q-${i}`;
        const correct = isCorrect(studentAnswers[key], q.answer);
        results.push({
          key,
          correct,
          studentAnswer: studentAnswers[key],
          correctAnswer: q.answer,
          question: q.text,
        });
      });
      break;
    }

    case "matching": {
      // studentAnswers[`${qId}-match-${i}`] = selected option label (A, B, C...)
      content.items.forEach((item, i) => {
        const key = `${qId}-match-${i}`;
        const correctLabel = content.answers[i];
        const correct = isCorrect(studentAnswers[key], correctLabel);
        results.push({
          key,
          correct,
          studentAnswer: studentAnswers[key],
          correctAnswer: correctLabel,
          item: item.text,
        });
      });
      break;
    }

    case "map-labelling": {
      // studentAnswers[`${qId}-label-${i}`] = typed or selected answer
      content.labels.forEach((label, i) => {
        const key = `${qId}-label-${i}`;
        const correct = isCorrect(studentAnswers[key], label.answer);
        results.push({
          key,
          correct,
          studentAnswer: studentAnswers[key],
          correctAnswer: label.answer,
          number: label.number,
        });
      });
      break;
    }

    default:
      break;
  }

  const scored = results.filter((r) => r.correct).length;
  return { scored, total: results.length, breakdown: results };
}

/**
 * Mark all listening questions for a submission
 * Returns { totalScore, totalQuestions, bandScore, questionResults }
 */
export function markListening(questions, studentAnswers) {
  let totalScore = 0;
  let totalQuestions = 0;
  const questionResults = [];

  for (const question of questions) {
    const result = markQuestion(question, studentAnswers);
    totalScore += result.scored;
    totalQuestions += result.total;
    questionResults.push({ questionId: question.id, ...result });
  }

  const bandScore = getBandFromRaw(totalScore);

  return { totalScore, totalQuestions, bandScore, questionResults };
}

// Official IELTS Listening band conversion table
export function getBandFromRaw(raw) {
  if (raw >= 39) return 9.0;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8.0;
  if (raw >= 32) return 7.5;
  if (raw >= 30) return 7.0;
  if (raw >= 26) return 6.5;
  if (raw >= 23) return 6.0;
  if (raw >= 18) return 5.5;
  if (raw >= 16) return 5.0;
  if (raw >= 13) return 4.5;
  if (raw >= 11) return 4.0;
  if (raw >= 8) return 3.5;
  if (raw >= 6) return 3.0;
  if (raw >= 4) return 2.5;
  return 0;
}
