import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import "./lecture.css";

// Helper Components
const ProgressBar = ({ completedLec, lectLength, completed }) => (
  <div className="progress">
    <div className="progress-text">
      <span className="progress-completed">
        Lecture completed - {completedLec} out of {lectLength}
      </span>
    </div>
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${completed || 0}%` }}
      ></div>
    </div>
    <div className="progress-percentage">
      {completed ? completed.toFixed(2) : 0}%
    </div>
  </div>
);

const QuizQuestion = ({ question, index, handleAnswerChange }) => (
  <div className="quiz-question">
    <h3>{question.question}</h3>
    {question.options.map((option, optIndex) => (
      <label key={optIndex}>
        <input
          type="radio"
          name={`question-${index}`}
          value={optIndex}
          onChange={() => handleAnswerChange(index, optIndex)}
        />
        {option}
      </label>
    ))}
  </div>
);

const LectureForm = ({ 
  show, 
  title, 
  description, 
  videoPrev, 
  btnLoading,
  setTitle,
  setDescription,
  changeVideoHandler,
  submitHandler,
  setShow
}) => (
  show && (
    <div className="lecture-form">
      <h2>Add Lecture</h2>
      <form onSubmit={submitHandler}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          placeholder="Choose Video"
          onChange={changeVideoHandler}
          required
        />
        {videoPrev && <video src={videoPrev} width={300} controls></video>}
        <button
          disabled={btnLoading}
          type="submit"
          className="common-btn"
        >
          {btnLoading ? "Please Wait..." : "Add"}
        </button>
      </form>
    </div>
  )
);

const LectureItem = ({ 
  e, 
  i, 
  lecture, 
  progress, 
  fetchLecture, 
  user, 
  deleteHandler 
}) => (
  <div key={e._id}>
    <div
      onClick={() => fetchLecture(e._id)}
      className={`lecture-number ${lecture._id === e._id ? "active" : ""}`}
    >
      {i + 1}. {e.title}
      {progress[0]?.completedLectures.includes(e._id) && (
        <span className="completed-tick">
          <TiTick />
        </span>
      )}
    </div>
    {user?.role === "admin" && (
      <button
        className="common-btn delete-btn"
        onClick={() => deleteHandler(e._id)}
      >
        Delete {e.title}
      </button>
    )}
  </div>
);

// Main Component
const Lecture = ({ user }) => {
  // State Management
  const [state, setState] = useState({
    selectedQuiz: null,
    quiz: null,
    userAnswers: [],
    quizResult: null,
    showQuizForm: false,
    lectures: [],
    lecture: [],
    loading: true,
    lecLoading: false,
    show: false,
    title: "",
    description: "",
    video: "",
    videoPrev: "",
    btnLoading: false,
    completed: "",
    completedLec: "",
    lectLength: "",
    progress: []
  });

  const params = useParams();
  const navigate = useNavigate();

  // Authentication Check
  if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
    navigate("/");
    return null;
  }

  // API Functions
  const api = {
    fetchLectures: async () => {
      try {
        const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
          headers: { token: localStorage.getItem("token") }
        });
        setState(prev => ({ ...prev, lectures: data.lectures, loading: false }));
      } catch (error) {
        console.error(error);
        setState(prev => ({ ...prev, loading: false }));
      }
    },

    fetchLecture: async (id) => {
      setState(prev => ({ ...prev, lecLoading: true, selectedQuiz: null }));
      try {
        const { data } = await axios.get(`${server}/api/lecture/${id}`, {
          headers: { token: localStorage.getItem("token") }
        });
        setState(prev => ({ ...prev, lecture: data.lecture, lecLoading: false }));
      } catch (error) {
        console.error(error);
        setState(prev => ({ ...prev, lecLoading: false }));
      }
    },

    fetchQuiz: async (lectureId) => {
      try {
        const { data } = await axios.get(`${server}/api/quiz/${params.id}`, {
          headers: { token: localStorage.getItem("token") }
        });
        setState(prev => ({ ...prev, quiz: data }));
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    },

    fetchProgress: async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/user/progress?course=${params.id}`,
          { headers: { token: localStorage.getItem("token") } }
        );
        setState(prev => ({
          ...prev,
          completed: data.courseProgressPercentage,
          completedLec: data.completedLectures,
          lectLength: data.allLectures,
          progress: data.progress
        }));
      } catch (error) {
        console.error(error);
      }
    },

    submitLecture: async (formData) => {
      setState(prev => ({ ...prev, btnLoading: true }));
      try {
        const { data } = await axios.post(
          `${server}/api/course/${params.id}`,
          formData,
          { headers: { token: localStorage.getItem("token") } }
        );
        toast.success(data.message);
        setState(prev => ({
          ...prev,
          btnLoading: false,
          show: false,
          title: "",
          description: "",
          video: "",
          videoPrev: ""
        }));
        api.fetchLectures();
      } catch (error) {
        toast.error(error.response.data.message);
        setState(prev => ({ ...prev, btnLoading: false }));
      }
    },

    deleteLecture: async (id) => {
      if (confirm("Are you sure you want to delete this lecture")) {
        try {
          const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
            headers: { token: localStorage.getItem("token") }
          });
          toast.success(data.message);
          api.fetchLectures();
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    },

    submitQuiz: async () => {
      try {
        const { data } = await axios.post(
          `${server}/api/quiz/submit/${params.id}`,
          { answers: state.userAnswers },
          { headers: { token: localStorage.getItem("token") } }
        );
        setState(prev => ({ ...prev, quizResult: data }));
        toast.success("Quiz submitted successfully!");
        if (data.score < data.total) {
          toast.error("Review your answers. The correct answers will be shown below.");
        }
      } catch (error) {
        toast.error("Failed to submit quiz.");
        console.error(error);
      }
    },

    addProgress: async (id) => {
      try {
        await axios.post(
          `${server}/api/user/progress?course=${params.id}&lectureId=${id}`,
          {},
          { headers: { token: localStorage.getItem("token") } }
        );
        api.fetchProgress();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Event Handlers
  const handlers = {
    changeVideo: (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setState(prev => ({ ...prev, videoPrev: reader.result, video: file }));
      };
    },

    handleAnswerChange: (questionIndex, answerIndex) => {
      const newAnswers = [...state.userAnswers];
      newAnswers[questionIndex] = answerIndex;
      setState(prev => ({ ...prev, userAnswers: newAnswers }));
    },

    submitForm: (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("title", state.title);
      formData.append("description", state.description);
      formData.append("file", state.video);
      api.submitLecture(formData);
    },

    toggleForm: () => {
      setState(prev => ({ ...prev, show: !prev.show }));
    }
  };

  // Effects
  useEffect(() => {
    api.fetchLectures();
    api.fetchProgress();
  }, []);

  useEffect(() => {
    if (state.lecture?._id) {
      api.fetchQuiz(state.lecture._id);
    }
  }, [state.lecture]);

  // Render Functions
  const renderMainContent = () => {
    if (state.lecLoading) return <Loading />;
    if (state.selectedQuiz) return renderQuiz();
    if (state.lecture.video) return renderVideoContent();
    return <h1>Please Select a Lecture or Quiz</h1>;
  };

  const renderQuiz = () => (
    <div className="quiz-section">
      <h2>Quiz</h2>
      {state.selectedQuiz.questions.map((question, index) => (
        <QuizQuestion
          key={index}
          question={question}
          index={index}
          handleAnswerChange={handlers.handleAnswerChange}
        />
      ))}
      <button onClick={api.submitQuiz}>Submit Quiz</button>
    </div>
  );

  const renderVideoContent = () => (
    <>
      <video
        src={`${server}/${state.lecture.video}`}
        width={"100%"}
        controls
        autoPlay
        onEnded={() => api.addProgress(state.lecture._id)}
      ></video>
      <h1>{state.lecture.title}</h1>
      <h3>{state.lecture.description}</h3>
    </>
  );

  const renderLectureList = () => (
    <>
      {user?.role === "admin" && (
        <button className="common-btn" onClick={handlers.toggleForm}>
          {state.show ? "Close" : "Add Lecture +"}
        </button>
      )}
      <LectureForm
        show={state.show}
        title={state.title}
        description={state.description}
        videoPrev={state.videoPrev}
        btnLoading={state.btnLoading}
        setTitle={(val) => setState(prev => ({ ...prev, title: val }))}
        setDescription={(val) => setState(prev => ({ ...prev, description: val }))}
        changeVideoHandler={handlers.changeVideo}
        submitHandler={handlers.submitForm}
        setShow={(val) => setState(prev => ({ ...prev, show: val }))}
      />
      {state.lectures?.length > 0 ? (
        state.lectures.map((e, i) => (
          <LectureItem
            key={e._id}
            e={e}
            i={i}
            lecture={state.lecture}
            progress={state.progress}
            fetchLecture={api.fetchLecture}
            user={user}
            deleteHandler={api.deleteLecture}
          />
        ))
      ) : (
        <p>No Lectures Yet!</p>
      )}
    </>
  );

  return (
    <>
      {state.loading ? (
        <Loading />
      ) : (
        <>
        <div style={{ marginTop: "30px" }}></div>
          <ProgressBar
            completedLec={state.completedLec}
            lectLength={state.lectLength}
            completed={state.completed}
          />
          <div className="lecture-page">
            <div className="left">{renderMainContent()}</div>
            <div className="right">{renderLectureList()}</div>
          </div>
          <button
  className="test-btn"
  onClick={() => navigate(user?.role === "admin" ? `/testpage/${params.id}` : `/test/${params.id}`)}
>
  Test
</button>

        </>
      )}
    </>
  );
};

export default Lecture;