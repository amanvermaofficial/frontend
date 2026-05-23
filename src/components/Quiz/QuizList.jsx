import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getQuizzes, startQuizAttempt } from "../../services/quizService";
import { setQuizzes } from "../../store/quizSlice";
import Skeleton from "@mui/material/Skeleton";
import { FaClipboardList, FaPlay } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import Swal from "sweetalert2";

function QuizList() {
  const { courseId, tradeId } = useParams();
  const dispatch = useDispatch();
  const quizzes = useSelector((state) => state.quiz.quizzes);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickedQuizId, setClickedQuizId] = useState(null); // Track which quiz is being started

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setLoading(true);
        const res = await getQuizzes(courseId, tradeId);
        dispatch(setQuizzes(res.data?.data?.quizzes || []));
      } catch (err) {
        console.error("Failed to load quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
        toast.error("Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, [courseId, tradeId, dispatch]);

  // Handle Start Quiz Click
  const handleStartQuiz = async (quizId, attempts) => {
    if (clickedQuizId === quizId) return;

    const isReattempt = attempts > 0;

    const result = await Swal.fire({
      title: isReattempt
        ? "Reattempt Quiz?"
        : "Start Quiz?",
      text: isReattempt
        ? "Your previous score will still remain saved."
        : "Once started, timer will begin immediately.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: isReattempt
        ? "Yes, Reattempt"
        : "Start Now",
    });

    if (!result.isConfirmed) return;

    setClickedQuizId(quizId);

    try {
      navigate(
        `/courses/${courseId}/trades/${tradeId}/quizzes/${quizId}/attempt`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to start quiz");
      setClickedQuizId(null);
    }
  };

  // 🟡 Loading State
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-20 p-4">
        <h2 className="text-3xl font-bold mb-8 text-amber-700 flex items-center gap-2 justify-center">
          <FaClipboardList /> Quizzes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-amber-100 rounded-xl shadow-sm p-6 bg-white"
            >
              <Skeleton variant="text" width="70%" height={30} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton
                variant="rectangular"
                width="50%"
                height={36}
                className="mt-4 rounded"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-24 text-center">
        <MdErrorOutline className="mx-auto text-5xl text-red-500 mb-4" />
        <p className="text-lg text-gray-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  // 🟠 Empty State
  if (!quizzes.length) {
    return (
      <div className="max-w-2xl mx-auto mt-24 text-center">
        <FaClipboardList className="mx-auto text-5xl text-amber-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          No Quizzes Available
        </h2>
        <p className="text-gray-500">
          There are no quizzes under this trade right now.
        </p>
      </div>
    );
  }



  // 🟢 Quizzes Grid
  return (
    <div className="min-h-screen bg-[#f8fafc] px-3 sm:px-4 py-6 pt-22">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            My Quizzes
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Practice, test and improve your skills
          </p>
        </div>

        {/* Quiz List */}
        <div className="space-y-4">
          {quizzes.map((quiz) => {
            const attempts = quiz.attempts_count || 0;
            const isFirstAttempt = attempts === 0;

            return (
              <div
                key={quiz.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  {/* Left */}
                  <div className="flex-1">

                    {/* Title + Badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                        {quiz.title}
                      </h2>

                      <span
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${isFirstAttempt
                          ? "bg-green-50 text-green-600 border border-green-100"
                          : "bg-orange-50 text-orange-600 border border-orange-100"
                          }`}
                      >
                        {isFirstAttempt
                          ? "New Quiz"
                          : `Attempted ${attempts} Time${attempts > 1 ? "s" : ""}`}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 mb-3">
                      <span>{quiz.questions_count || 10} Questions</span>

                      <span className="h-1 w-1 rounded-full bg-slate-300"></span>

                      <span>{quiz.duration / 60 || 5} Min</span>

                      <span className="h-1 w-1 rounded-full bg-slate-300"></span>

                      <span>{attempts} Attempts</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-500 leading-relaxed text-left">
                      {quiz.description ||
                        "Test your knowledge and improve your preparation."}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 w-full lg:w-auto">

                    {/* Result Button */}
                    <button
                      disabled={attempts === 0}
                      onClick={() => navigate(`/quiz-result/${quiz.id}`)}
                      className={`flex-1 lg:flex-none px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${attempts === 0
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border border-slate-200 hover:border-amber-500 hover:text-amber-600 text-slate-600"
                        }`}
                    >
                      Result
                    </button>

                    {/* Start/Reattempt */}
                    <button
                      onClick={() => handleStartQuiz(quiz.id, attempts)}
                      disabled={clickedQuizId === quiz.id}
                      className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${clickedQuizId === quiz.id
                        ? "bg-slate-300 text-white cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600 text-white"
                        }`}
                    >
                      {clickedQuizId === quiz.id
                        ? "Starting..."
                        : isFirstAttempt
                          ? "Start Quiz"
                          : "Reattempt Quiz"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuizList;