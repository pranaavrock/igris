import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AddQuizForm from "../../components/addquiz/Addquiz";
import { server } from "../../main";
import "./TestPage.css";

const TestPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const quizListRef = useRef(null);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${server}/api/quizz/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      
      if (data.success && data.quiz) {
        setQuiz(data.quiz);
      } else {
        setQuiz(null);
        toast.error("No quiz available for this subject.");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setError(error.response?.data?.message || "Failed to load quiz. Please try again.");
      toast.error(error.response?.data?.message || "Error loading quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (quizListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = quizListRef.current;
        const scrollPosition = scrollTop + clientHeight;
        
        // Add fade effect at the bottom
        if (scrollHeight - scrollPosition < 100) {
          quizListRef.current.style.maskImage = "linear-gradient(to bottom, black 80%, transparent 100%)";
        } else {
          quizListRef.current.style.maskImage = "linear-gradient(to bottom, black 0%, black 90%, transparent 100%)";
        }
      }
    };

    if (quizListRef.current) {
      quizListRef.current.addEventListener('scroll', handleScroll);
      return () => {
        if (quizListRef.current) {
          quizListRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [quiz]);

  const toggleAddQuiz = () => {
    setShowAddQuiz(prev => !prev);
    setActiveQuestion(null);
  };

  const handleQuestionClick = (questionId) => {
    setActiveQuestion(activeQuestion === questionId ? null : questionId);
  };

  const deleteQuestion = async (questionId) => {
    if (!questionId) {
      console.error("❌ Question ID is missing!");
      toast.error("Question ID is undefined");
      return;
    }
  
    console.log(`🚀 Sending DELETE request for questionId: ${questionId}`);
  
    try {
      await axios.delete(`${server}/api/quiz/${id}/questions/${questionId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success("✅ Question deleted successfully");
      fetchQuiz();
    } catch (error) {
      console.error("❌ Error deleting question:", error);
      toast.error(error.response?.data?.message || "Failed to delete question");
    }
  };
  

  return (
    <div className="test-page">
      <header className="test-page-header">
        <h1>Course Quiz</h1>
        <button 
          className={`toggle-form-btn ${showAddQuiz ? 'active' : ''}`}
          onClick={toggleAddQuiz}
          aria-expanded={showAddQuiz}
        >
          {showAddQuiz ? (
            <>
              <span className="icon">←</span> View Quiz
            </>
          ) : (
            <>
              <span className="icon">+</span> Add New Question
            </>
          )}
        </button>
      </header>

      <div className="test-page-content">
        {showAddQuiz ? (
          <div className="add-quiz-section">
            <AddQuizForm 
              server={server} 
              courseId={id} 
              fetchQuiz={fetchQuiz} 
              onSuccess={() => {
                setShowAddQuiz(false);
                toast.success("Question added successfully!");
              }}
            />
          </div>
        ) : (
          <div className="quiz-list-section">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading quiz questions...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchQuiz} className="retry-btn">
                  Retry
                </button>
              </div>
            ) : !quiz || !quiz.questions || quiz.questions.length === 0 ? (
              <div className="empty-state">
                <p>No quiz available for this subject.</p>
                <button 
                  onClick={toggleAddQuiz}
                  className="add-first-question-btn"
                >
                  Add First Question
                </button>
              </div>
            ) : (
              <>
                <div className="quiz-list-header">
                  <h2>{quiz.questions.length} Questions</h2>
                  <div className="quiz-stats">
                    <span>Total: {quiz.questions.length}</span>
                  </div>
                </div>
                <div className="quiz-list" ref={quizListRef}>
                  {quiz.questions.map((question, index) => (
                    <div 
                      key={question._id} 
                      className={`quiz-card ${activeQuestion === question._id ? 'active' : ''}`}
                      onClick={() => handleQuestionClick(question._id)}
                    >
                      <div className="quiz-card-header">
                        <span className="question-number">Q{index + 1}</span>
                        <h3 className="question-text">{question.question}</h3>
                        <button 
                          className="delete-question-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!question._id) {
                              console.error("❌ Question ID is undefined!", question);
                              toast.error("Question ID is missing!");
                              return;
                            }
                            console.log("🛠️ Trying to delete question:", question._id);
                            deleteQuestion(question._id);
                          }}
                          title="Delete question"
                        >
                          ×
                        </button>
                      </div>
                      {activeQuestion === question._id && (
                        <div className="question-details">
                          <ul className="options-list">
                            {question.options.map((option, oIndex) => (
                              <li 
                                key={oIndex} 
                                className={`option-item ${oIndex === question.correctAnswerIndex ? 'correct-answer' : ''}`}
                              >
                                <span className="option-letter">
                                  {String.fromCharCode(65 + oIndex)}.
                                </span>
                                {option}
                                {oIndex === question.correctAnswerIndex && (
                                  <span className="correct-badge">Correct</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;