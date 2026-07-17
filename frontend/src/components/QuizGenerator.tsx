import React, { useState } from 'react';
import { quizService } from '../services/quizService';
import type { QuizQuestion } from '../services/quizService';

export const QuizGenerator: React.FC = () => {
  // Input states
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');

  // Generation states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Quiz execution states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<{
    score: number;
    percentage: number;
    correct: number;
    wrong: number;
    submitted: boolean;
  } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setSelectedAnswers({});

    // Input validation
    if (!topic || !topic.trim()) {
      setError('Please enter a topic before generating the quiz.');
      return;
    }

    setLoading(true);
    try {
      const data = await quizService.generateQuiz(topic.trim(), difficulty);
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions received from AI.');
      }
      setQuestions(data.questions);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to generate quiz. Please check your connection and Gemini API key.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIndex: number, option: string) => {
    if (results?.submitted) return; // Prevent change after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  const handleSubmitQuiz = () => {
    // Check that all questions have been answered
    if (Object.keys(selectedAnswers).length < questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }
    setError(null);

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const wrongCount = questions.length - correctCount;
    const pct = Math.round((correctCount / questions.length) * 100);

    setResults({
      score: correctCount,
      percentage: pct,
      correct: correctCount,
      wrong: wrongCount,
      submitted: true,
    });
  };

  const handleResetQuiz = () => {
    setTopic('');
    setDifficulty('Beginner');
    setQuestions([]);
    setSelectedAnswers({});
    setResults(null);
    setError(null);
  };

  return (
    <main className="p-8 h-[calc(100vh-64px)] overflow-y-auto w-full">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <section className="mb-6 text-left">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
            AI Quiz Generator
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Enter a topic to generate a custom 5-question multiple choice test instantly.
          </p>
        </section>

        {/* Inputs Panel */}
        {questions.length === 0 && !loading && (
          <section className="p-6 bg-white border border-outline-variant rounded-2xl shadow-sm">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Topic Input */}
                <div className="flex-1 flex flex-col gap-2 text-left">
                  <label htmlFor="topic-input" className="text-label-md font-bold text-on-surface tracking-wider">
                    TOPIC
                  </label>
                  <input
                    id="topic-input"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter any topic"
                    className="w-full bg-white border border-outline-variant focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-3 text-body-md outline-none transition-all"
                  />
                </div>

                {/* Difficulty Select */}
                <div className="w-full md:w-64 flex flex-col gap-2 text-left">
                  <label htmlFor="difficulty-select" className="text-label-md font-bold text-on-surface tracking-wider">
                    DIFFICULTY
                  </label>
                  <select
                    id="difficulty-select"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-white border border-outline-variant focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl px-4 py-3 text-body-md outline-none transition-all cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-error-container text-on-error-container rounded-xl flex items-center gap-3 font-medium text-body-md border border-error/25">
                  <span className="material-symbols-outlined text-error">error</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                  Generate Quiz
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Loading Spinner */}
        {loading && (
          <section className="flex flex-col items-center justify-center p-12 border border-outline-variant rounded-2xl bg-white shadow-sm min-h-[300px]">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
            <h3 className="font-headline-md text-on-surface mb-2">Generating Quiz...</h3>
            <p className="text-body-md text-on-surface-variant max-w-sm text-center">
              Our AI agent is formulating exactly 5 questions tailored to the topic "{topic}" at a {difficulty} level.
            </p>
          </section>
        )}

        {/* Active Quiz View */}
        {questions.length > 0 && !results?.submitted && (
          <section className="space-y-6">
            {error && (
              <div className="p-4 bg-error-container text-on-error-container rounded-xl flex items-center gap-3 font-medium text-body-md border border-error/25">
                <span className="material-symbols-outlined text-error">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={idx} className="p-6 bg-white border border-outline-variant rounded-2xl shadow-sm text-left space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-secondary-container text-primary rounded-lg text-label-md font-bold uppercase tracking-wider">
                      Question {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-on-surface font-semibold">
                    {q.question}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {q.options.map((option, oIdx) => {
                      const isSelected = selectedAnswers[idx] === option;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleOptionSelect(idx, option)}
                          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all active:scale-98 ${
                            isSelected
                              ? 'border-primary bg-primary/5 text-primary font-semibold ring-2 ring-primary/10'
                              : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                          </span>
                          <span className="text-body-md">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handleResetQuiz}
                className="px-6 py-3 border border-outline-variant text-on-surface-variant hover:bg-surface-container-low rounded-xl font-bold transition-all active:scale-95"
              >
                Cancel Quiz
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined">send</span>
                Submit Quiz
              </button>
            </div>
          </section>
        )}

        {/* Completion Result Card */}
        {results?.submitted && (
          <section className="space-y-6">
            <div className="p-8 bg-white border border-outline-variant rounded-3xl shadow-sm text-center max-w-xl mx-auto space-y-6">
              {/* Completed Header */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-primary text-4xl block">emoji_events</span>
                </div>
                <h3 className="font-headline-lg text-on-surface font-bold text-2xl">Quiz Completed</h3>
                <p className="text-body-lg text-primary font-bold text-lg">
                  {results.percentage >= 80 ? 'Great Job!' : results.percentage >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-outline-variant/50 py-6 my-4">
                <div className="flex flex-col items-center">
                  <span className="text-label-sm text-on-surface-variant font-medium uppercase tracking-wider">Score</span>
                  <span className="text-headline-xl font-bold text-on-surface my-1">
                    {results.score} / {questions.length}
                  </span>
                  <span className="px-2 py-0.5 bg-secondary-container text-primary rounded-md text-[10px] font-bold">
                    {results.percentage}%
                  </span>
                </div>
                <div className="flex flex-col justify-center gap-2 pl-4 border-l border-outline-variant/30 text-left">
                  <div className="flex items-center gap-2 text-body-md text-on-surface">
                    <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                    <span>Correct Answers: <strong>{results.correct}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-body-md text-on-surface">
                    <span className="material-symbols-outlined text-error text-[18px]">cancel</span>
                    <span>Wrong Answers: <strong>{results.wrong}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={handleResetQuiz}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">replay</span>
                  Try Again
                </button>
              </div>
            </div>

            {/* Answer Key Walkthrough */}
            <div className="space-y-4 max-w-2xl mx-auto pt-6 text-left">
              <h4 className="font-headline-md text-on-surface font-semibold text-center mb-4">
                Review Your Answers
              </h4>
              {questions.map((q, idx) => {
                const selected = selectedAnswers[idx];
                const isCorrect = selected === q.correctAnswer;
                return (
                  <div key={idx} className="p-5 bg-white border border-outline-variant rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 bg-surface-container-high rounded text-label-sm font-bold text-on-surface-variant">
                        Q{idx + 1} Review
                      </span>
                      <span className={`px-2 py-1 rounded-full text-label-sm font-bold flex items-center gap-1 ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {isCorrect ? 'check' : 'close'}
                        </span>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="font-body-lg text-on-surface font-medium">{q.question}</p>
                    <div className="space-y-2 pt-1 text-body-md">
                      <p className="text-on-surface-variant">
                        Your Answer:{' '}
                        <span className={isCorrect ? 'text-green-600 font-semibold' : 'text-error font-semibold'}>
                          {selected}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-on-surface-variant">
                          Correct Answer:{' '}
                          <span className="text-green-600 font-semibold">{q.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};
