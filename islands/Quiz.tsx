// Interactive quiz component

import { useSignal } from "@preact/signals";
import type { QuizQuestion } from "../models/lesson.ts";

interface QuizProps {
  quizId: number;
  questions: QuizQuestion[];
}

export default function Quiz({ quizId, questions }: QuizProps) {
  const currentQuestionIndex = useSignal(0);
  const answers = useSignal<Record<number, string>>({});
  const showResults = useSignal(false);
  const results = useSignal<any>(null);

  const currentQuestion = questions[currentQuestionIndex.value];
  const isLastQuestion = currentQuestionIndex.value === questions.length - 1;

  const handleAnswer = (answer: string) => {
    answers.value = {
      ...answers.value,
      [currentQuestion.id]: answer,
    };
  };

  const nextQuestion = () => {
    if (!isLastQuestion) {
      currentQuestionIndex.value++;
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  };

  const submitQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answers.value }),
      });

      const result = await response.json();
      results.value = result;
      showResults.value = true;
    } catch (error) {
      console.error("Quiz submission error:", error);
      alert("Error submitting quiz. Please try again.");
    }
  };

  if (showResults.value && results.value) {
    return (
      <div class="quiz-results">
        <h2>Quiz Results</h2>
        <div class="score-summary">
          <h3>
            Score: {results.value.score} / {results.value.totalPoints}
          </h3>
          <p>
            Percentage: {Math.round(results.value.percentage)}%
          </p>
          <p>
            {results.value.passed ? (
              <span class="badge" style="background: var(--success)">
                ✓ Passed!
              </span>
            ) : (
              <span class="badge" style="background: var(--error)">
                ✗ Not Passed
              </span>
            )}
          </p>
        </div>

        <button onClick={() => {
          showResults.value = false;
          currentQuestionIndex.value = 0;
          answers.value = {};
          results.value = null;
        }}>
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div class="quiz-container">
      <div class="quiz-progress">
        Question {currentQuestionIndex.value + 1} of {questions.length}
      </div>

      <div class="quiz-question">
        <h3>{currentQuestion.question}</h3>

        {currentQuestion.question_type === "multiple_choice" && (
          <div class="quiz-options">
            {JSON.parse(currentQuestion.options || "[]").map((option: string) => (
              <label key={option}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={answers.value[currentQuestion.id] === option}
                  onChange={() => handleAnswer(option)}
                />
                {option}
              </label>
            ))}
          </div>
        )}

        {currentQuestion.question_type === "true_false" && (
          <div class="quiz-options">
            <label>
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value="true"
                checked={answers.value[currentQuestion.id] === "true"}
                onChange={() => handleAnswer("true")}
              />
              True
            </label>
            <label>
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value="false"
                checked={answers.value[currentQuestion.id] === "false"}
                onChange={() => handleAnswer("false")}
              />
              False
            </label>
          </div>
        )}

        {currentQuestion.question_type === "numeric" && (
          <input
            type="number"
            value={answers.value[currentQuestion.id] || ""}
            onInput={(e) => handleAnswer((e.target as HTMLInputElement).value)}
            placeholder="Enter your answer"
          />
        )}
      </div>

      <div class="quiz-navigation">
        <button
          onClick={previousQuestion}
          disabled={currentQuestionIndex.value === 0}
        >
          ← Previous
        </button>

        {!isLastQuestion ? (
          <button onClick={nextQuestion}>
            Next →
          </button>
        ) : (
          <button
            onClick={submitQuiz}
            disabled={Object.keys(answers.value).length !== questions.length}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}
