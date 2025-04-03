import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CertificateButton from './CertificateButton.jsx';
import {
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaListUl,
  FaClock,
  FaTrophy,
  FaRedo,
  FaHome
} from "react-icons/fa";
import Confetti from "react-confetti";
import "./Test.css";
import { server } from "../../main.jsx";

const QuizTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [showAnswers, setShowAnswers] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [user, setUser] = useState(null);

// Add this to your useEffect that runs on component mount
useEffect(() => {
    const fetchUser = async () => {
        try {
            const { data } = await axios.get(`${server}/api/user`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };
    
    fetchUser();
    fetchQuiz(); // Your existing quiz fetch
}, [id]);

  // Fetch quiz data
  const fetchQuiz = async () => {
    try {
      const { data } = await axios.get(`${server}/api/quiz-details/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      if (data && data.questions) {
        setQuiz(data);
        setQuestions(data.questions.slice(0, 10));
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load quiz. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizCompletion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    
    setUserAnswers([
      ...userAnswers,
      {
        questionId: currentQuestion._id,
        selectedOption,
        isCorrect,
      },
    ]);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      handleQuizCompletion();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevAnswer = userAnswers.find(
        (a) => a.questionId === questions[currentIndex - 1]._id
      );
      setSelectedOption(prevAnswer ? prevAnswer.selectedOption : null);
    }
  };

  const handleQuizCompletion = () => {
    setTimerActive(false);
    let finalAnswers = [...userAnswers];
    const currentQuestion = questions[currentIndex];
    
    // Include current question if answered
    if (selectedOption !== null && !finalAnswers.some(a => a.questionId === currentQuestion._id)) {
      const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
      finalAnswers = [
        ...finalAnswers,
        {
          questionId: currentQuestion._id,
          selectedOption,
          isCorrect,
        },
      ];
      setUserAnswers(finalAnswers);
    }
    
    const correctCount = finalAnswers.filter((answer) => answer.isCorrect).length;
    setScore((correctCount / questions.length) * 100);
    setQuizCompleted(true);
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setTimeLeft(600);
    setTimerActive(true);
    setShowAnswers(false);
  };

  const handleExitQuiz = () => {
    navigate(`/course/${id}`);
  };

  if (loading) {
    return (
      <div className="quiz-container quiz-loading">
        <div className="quiz-loader"></div>
        <p>Loading quiz questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-no-quiz">
          <h2>No Quiz Available</h2>
          <p>There are no questions available for this quiz.</p>
          <button onClick={() => navigate(-1)} className="quiz-btn quiz-btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;

  return (
    <div className="quiz-container">
      {quizCompleted && score >= 80 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {!quizCompleted ? (
        <div className="quiz-in-progress">
          <div className="quiz-header">
            <h2>{quiz.title || "Quiz Test"}</h2>
            <div className="quiz-meta">
              <div className="quiz-timer">
                <FaClock /> {formatTime(timeLeft)}
              </div>
              <div className="quiz-progress">
                Question {currentIndex + 1} of {questions.length}
              </div>
            </div>
          </div>

          <div className="quiz-question-card">
            <div className="quiz-question-text">
              <h3>{currentQuestion.question}</h3>
            </div>

            <div className="quiz-options-container">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`quiz-option ${selectedOption === index ? "quiz-selected" : ""}`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="quiz-option-letter">{String.fromCharCode(65 + index)}</div>
                  <div className="quiz-option-text">{option}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="quiz-navigation-buttons">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentIndex === 0}
              className="quiz-btn quiz-btn-secondary"
            >
              <FaArrowLeft /> Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="quiz-btn quiz-btn-primary"
            >
              {currentIndex === questions.length - 1 ? "Submit Quiz" : "Next"}{" "}
              <FaArrowRight />
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <div className="quiz-result-header">
            <h2>
              <FaTrophy /> Quiz Results
            </h2>
            <div className="quiz-score-display">
              <div 
                className="quiz-score-circle"
                style={{
                  background: `conic-gradient(#4CAF50 ${score}%, #f0f0f0 ${score}% 100%)`
                }}
              >
                <span>{Math.round(score)}%</span>
              </div>
              <p className="quiz-score-message">
                {score >= 80
                  ? "Excellent work! You've mastered this material."
                  : score >= 60
                  ? "Good job! You're on the right track."
                  : "Keep practicing! Review the material and try again."}
              </p>
              <p className="quiz-score-detail">
                You answered {correctCount} out of {questions.length} questions correctly.
              </p>
            </div>
          </div>
          {user && (
            <div className="certificate-section">
                <CertificateButton 
                    user={"hifsadafasf"}
                    quizId={id}
                    score={score}
                    courseName={quiz.title || "Course"}
                />
            </div>
        )}

          <div className="quiz-result-actions">
            <button onClick={handleRestartQuiz} className="quiz-btn quiz-btn-secondary">
              <FaRedo /> Retake Quiz
            </button>
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="quiz-btn quiz-btn-primary"
            >
              {showAnswers ? "Hide Answers" : "View Answers"}
            </button>
            <button onClick={handleExitQuiz} className="quiz-btn quiz-btn-exit">
              <FaHome /> Exit to Course
            </button>
          </div>

          {showAnswers && (
            <div className="quiz-answers-review">
              <h3>
                <FaListUl /> Question Review
              </h3>
              {questions.map((question, index) => {
                const userAnswer = userAnswers.find(
                  (a) => a.questionId === question._id
                );
                return (
                  <div key={index} className="quiz-answer-item">
                    <div className="quiz-question-review">
                      <p className="quiz-question-text">
                        <strong>Q{index + 1}:</strong> {question.question}
                      </p>
                      <div
                        className={`quiz-answer-status ${
                          userAnswer?.isCorrect ? "quiz-correct" : "quiz-incorrect"
                        }`}
                      >
                        {userAnswer?.isCorrect ? <FaCheck /> : <FaTimes />}
                        {userAnswer?.isCorrect ? "Correct" : "Incorrect"}
                      </div>
                    </div>
                    <div className="quiz-options-review">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`quiz-option-review
                            ${optIndex === question.correctAnswerIndex ? "quiz-correct-option" : ""}
                            ${
                              optIndex === userAnswer?.selectedOption &&
                              !userAnswer?.isCorrect
                                ? "quiz-wrong-selection"
                                : ""
                            }
                          `}
                        >
                          <span className="quiz-option-letter">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          {option}
                          {optIndex === question.correctAnswerIndex && (
                            <span className="quiz-correct-tag">Correct Answer</span>
                          )}
                          {optIndex === userAnswer?.selectedOption &&
                            !userAnswer?.isCorrect && (
                              <span className="quiz-your-answer-tag">Your Answer</span>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizTest;