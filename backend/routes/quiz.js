import express from "express";
import Quiz from "../models/Quiz.js";
import { Courses } from "../models/Courses.js";
import mongoose from "mongoose";
const router = express.Router();


router.post("/quiz/:id", async (req, res) => {
  
  try {
    
    const { questions } = req.body;
    const courseId = req.params.id;

    // Check if the course exists
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create a new quiz
    const quiz = new Quiz({
      courseId,
      questions,
    });

    await quiz.save();
    res.status(201).json({ message: "Quiz added successfully", quiz });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/quiz-details/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const quizzes = await Quiz.find({ courseId }); // Get all quizzes for the course

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found for this course" });
    }

    // Extract all questions from quizzes
    let allQuestions = quizzes.flatMap(quiz =>
      quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex
      }))
    );

    // Shuffle and pick 10 unique questions
    allQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);

    res.status(200).json({ questions: allQuestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get quiz for a course
router.get("/quiz/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const quizzes = await Quiz.find({ courseId }); // ✅ Get all quizzes for the course

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found for this course" });
    }

    // ✅ Extract only the necessary fields
    const allQuestions = quizzes.flatMap(quiz =>
      quiz.questions.map(q => ({
        question: q.question,
        options: q.options
      }))
    );

    res.status(200).json({ questions: allQuestions }); // ✅ Send formatted response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Submit quiz answers
router.post("/quiz/submit/:id", async (req, res) => {
  try {
    const { answers } = req.body;
    const courseId = req.params.id;
    const quiz = await Quiz.findOne({ courseId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found for this course" });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.options[question.correctAnswerIndex] === answers[index]) {
          score++;
      }
  });

    res.status(200).json({ score, total: quiz.questions.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Add this route to your existing backend routes
router.delete("/quiz/:courseId/questions/:questionId", async (req, res) => {
  try {
    console.log("🔹 Full req.params:", req.params);

    const { courseId, questionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      console.log("❌ Invalid courseId format");
      return res.status(400).json({ success: false, message: "Invalid course ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      console.log("❌ Invalid questionId format");
      return res.status(400).json({ success: false, message: "Invalid question ID format" });
    }

    // Find the quiz
    const quiz = await Quiz.findOne({ courseId });

    if (!quiz) {
      console.log("❌ Quiz not found for this course.");
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    console.log("✅ Quiz found with questions:", quiz.questions.map(q => q._id.toString()));

    // Find the index of the question
    const questionIndex = quiz.questions.findIndex(q => q._id.toString() === questionId);

    if (questionIndex === -1) {
      console.log("❌ Question not found.");
      return res.status(404).json({ success: false, message: "Question not found in quiz" });
    }

    console.log("✅ Deleting question at index:", questionIndex);

    // Remove the question
    quiz.questions.splice(questionIndex, 1);
    quiz.markModified("questions");
    await quiz.save();

    console.log("✅ Question deleted successfully.");
    
    res.status(200).json({ success: true, message: "Question deleted successfully", quiz });

  } catch (error) {
    console.error("❌ Error deleting question:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// Update the GET /quiz/:id route
router.get("/quizz/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const quizzes = await Quiz.find({ courseId });

    if (!quizzes.length) {
      return res.status(404).json({ 
        success: false, 
        message: "No quizzes found for this course" 
      });
    }

    // Include correctAnswerIndex in the response
    const allQuestions = quizzes.flatMap(quiz =>
      quiz.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex
      }))
    );

    res.status(200).json({ 
      success: true,
      quiz: {
        questions: allQuestions,
        // Include any other required quiz properties
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

export default router;
