// QuizResult.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";
import { getQuizResult } from "../../services/quizService";
import { toast } from "react-toastify";
import FeedbackModal from "../Feedback/FeedbackModal";

function QuizResult() {

  const { quizId } = useParams();

  const navigate = useNavigate();

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);

  const [openFeedback, setOpenFeedback] = useState(false);

  // Fetch Result
  useEffect(() => {

    const fetchResult = async () => {

      try {

        const res = await getQuizResult(quizId);

        setResult(res.data.data);

      } catch (error) {

        toast.error("Failed to load quiz result");

        navigate(-1);

      } finally {

        setLoading(false);
      }
    };

    fetchResult();

  }, [quizId, navigate]);

  // Feedback Modal Open
  useEffect(() => {

    if (loading) return;

    const alreadyShown = localStorage.getItem(
      `feedback_modal_${quizId}`
    );

    if (alreadyShown) return;

    const timer = setTimeout(() => {

      setOpenFeedback(true);

    }, 2000);

    return () => clearTimeout(timer);

  }, [loading, quizId]);

  // Close Modal
  const handleFeedbackClose = () => {

    localStorage.setItem(
      `feedback_modal_${quizId}`,
      "true"
    );

    setOpenFeedback(false);
  };

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">
          Loading result...
        </p>
      </div>
    );
  }

  if (!result) {

    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <p className="text-gray-600 text-lg font-medium">
          No result found!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 px-4 py-8 pt-24">

      <div className="max-w-md mx-auto">

        {/* Result Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">

          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6">

            <FaTrophy className="text-amber-600 text-3xl" />

            <h2 className="text-2xl font-bold text-gray-800">
              Quiz Result
            </h2>

          </div>

          {/* Score */}
          <div className="bg-amber-50 rounded-xl py-5 mb-6">

            <p className="text-sm text-gray-600 mb-1">
              Latest Score
            </p>

            <p className="text-4xl font-bold text-amber-700">
              {result.score}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              out of {result.total_questions}
            </p>

          </div>

          {/* Details */}
          <div className="space-y-3 text-gray-700 mb-6">

            <div className="flex justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span>Total Questions</span>

              <span className="font-semibold">
                {result.total_questions}
              </span>
            </div>

            <div className="flex justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span>Correct Answers</span>

              <span className="font-semibold text-green-600">
                {result.correct_answers}
              </span>
            </div>

            <div className="flex justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span>Wrong Answers</span>

              <span className="font-semibold text-red-500">
                {result.wrong_answers}
              </span>
            </div>

            <div className="flex justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span>Not Attempted</span>

              <span className="font-semibold text-yellow-600">
                {result.skipped_questions}
              </span>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              onClick={() => navigate(-2)}
              className="w-1/2 border border-amber-500 text-amber-700 hover:bg-amber-50 font-semibold py-2.5 rounded-xl transition-all"
            >
              Back
            </button>

            <button
              onClick={() =>
                navigate(`/quiz-result/${quizId}/result-review`)
              }
              className="w-1/2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-xl transition-all"
            >
              Review
            </button>

          </div>
        </div>

        {/* Previous Attempts */}
        {result.previous_attempts?.length > 0 && (

          <div className="bg-white shadow-md rounded-2xl p-5 mt-5">

            <div className="flex items-center justify-between mb-4">

              <h3 className="text-base font-semibold text-gray-800">
                Recent Attempts
              </h3>

              <span className="text-xs text-gray-400">
                Last {result.previous_attempts.length} attempts
              </span>

            </div>

            <div className="space-y-3">

              {result.previous_attempts.map((attempt) => (

                <div
                  key={attempt.id}
                  className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
                >

                  <div>

                    <p className="text-sm font-medium text-gray-800">
                      Attempt #{attempt.attempt_number}
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {attempt.date}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm font-bold text-amber-600">
                      {attempt.score}/{attempt.total_questions}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        open={openFeedback}
        handleClose={handleFeedbackClose}
      />

    </div>
  );
}

export default QuizResult;