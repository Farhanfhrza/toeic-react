import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Send,
  AlertCircle,
} from "lucide-react";

export default function Questions() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Helper untuk localStorage
  const storageKey = `quiz_${attemptId}_answers`;
  const indexKey = `quiz_${attemptId}_index`;

  // Load answers dari localStorage
  const loadSavedAnswers = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      const savedIndex = localStorage.getItem(indexKey);
      if (saved) {
        setAnswers(JSON.parse(saved));
      }
      if (savedIndex) {
        setCurrentIndex(parseInt(savedIndex, 10));
      }
    } catch (err) {
      console.error("Error loading saved answers:", err);
    }
  };

  // Save answers ke localStorage
  const saveAnswers = (newAnswers) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newAnswers));
    } catch (err) {
      console.error("Error saving answers:", err);
    }
  };

  // Clear localStorage
  const clearStorage = () => {
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(indexKey);
    } catch (err) {
      console.error("Error clearing storage:", err);
    }
  };

  // Load questions saat mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Cek apakah attempt sudah finished
        try {
          const reviewRes = await api.get(`/exercise/attempt/${attemptId}/review`);
          if (reviewRes.data?.attempt?.finished_at) {
            clearStorage();
            window.location.href = `/quiz/finish/${attemptId}`;
            return;
          }
        } catch (err) {
          // Jika review gagal, lanjutkan load questions
          console.log("Review check failed, continuing...");
        }

        // Load questions
        const res = await api.get(`/exercise/attempt/${attemptId}/questions`);
        if (res.data.success && res.data.questions) {
          setQuestions(res.data.questions);
          
          // Load saved answers
          loadSavedAnswers();
        } else {
          console.error("Failed to load questions");
        }
      } catch (err) {
        console.error("Error loading questions:", err);
        // Jika error 403 (finished), redirect
        if (err.response?.status === 403) {
          clearStorage();
          window.location.href = `/quiz/finish/${attemptId}`;
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [attemptId]);

  // Handle select answer
  const handleSelectAnswer = (optionId) => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: optionId,
    };
    setAnswers(newAnswers);
    saveAnswers(newAnswers);
  };

  // Navigate questions
  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      localStorage.setItem(indexKey, newIndex.toString());
    }
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      localStorage.setItem(indexKey, newIndex.toString());
    }
  };

  const goToQuestion = (index) => {
    setCurrentIndex(index);
    localStorage.setItem(indexKey, index.toString());
  };

  // Submit answers
  const handleSubmit = async () => {
    if (submitting) return;

    // Check unanswered questions
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      const proceed = window.confirm(
        `Anda belum menjawab ${unansweredCount} dari ${questions.length} soal.\n\nApakah Anda yakin ingin menyelesaikan latihan? Soal yang tidak dijawab akan dianggap salah.`
      );
      if (!proceed) return;
    }

    setSubmitting(true);

    try {
      // Prepare all answers
      const allAnswers = questions.map((q) => ({
        question_id: q.id,
        option_id: answers[q.id] || null,
      }));

      // Submit all answers
      await api.post("/exercise/submit-all", {
        attempt_id: attemptId,
        answers: allAnswers,
      });

      // Finish attempt
      await api.post("/exercise/finish", {
        attempt_id: attemptId,
      });

      // Clear storage and navigate
      clearStorage();
      window.location.href = `/quiz/finish/${attemptId}`;
    } catch (err) {
      console.error("Error submitting:", err);
      setSubmitting(false);
      alert(`Gagal menyimpan jawaban: ${err.response?.data?.error || err.message || "Silakan coba lagi."}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat soal...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-gray-600">Tidak ada soal yang tersedia</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const selectedAnswer = answers[currentQuestion.id] || null;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header dengan Progress Bar */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800">
              Soal {currentIndex + 1} dari {questions.length}
            </h2>
            <div className="text-sm text-gray-600">
              Terjawab: {answeredCount}/{questions.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {currentIndex + 1}
              </div>
              <div className="flex-1">
                {/* Image */}
                {currentQuestion.question_image && (
                  <div className="mb-4">
                    <img
                      src={currentQuestion.question_image}
                      alt="Question illustration"
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-md border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Audio Player */}
                {currentQuestion.question_audio && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.617a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <audio controls className="w-full" style={{ maxHeight: "40px" }}>
                          <source src={currentQuestion.question_audio} type="audio/mpeg" />
                          <source src={currentQuestion.question_audio} type="audio/wav" />
                          <source src={currentQuestion.question_audio} type="audio/ogg" />
                          Browser Anda tidak mendukung audio.
                        </audio>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-lg text-gray-800 leading-relaxed mb-4">
                  {currentQuestion.text}
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.Options.map((option, optionIdx) => {
              const isSelected = selectedAnswer === option.id;
              const optionLabel = String.fromCharCode(65 + optionIdx); // A, B, C, D

              return (
                <label
                  key={option.id}
                  className={`block cursor-pointer transition-all duration-200 ${
                    isSelected ? "transform scale-[1.02]" : "hover:scale-[1.01]"
                  }`}
                >
                  <div
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 size={20} className="text-white" />
                        ) : (
                          optionLabel
                        )}
                      </div>
                      <div className="flex-1">
                        <span
                          className={`text-gray-800 ${
                            isSelected ? "font-semibold" : ""
                          }`}
                        >
                          {option.text}
                        </span>
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={isSelected}
                    onChange={() => handleSelectAnswer(option.id)}
                    className="hidden"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
            }`}
          >
            <ChevronLeft size={20} />
            Sebelumnya
          </button>

          {/* Question Navigation Dots */}
          <div className="flex-1 flex items-center justify-center gap-2 flex-wrap max-w-md">
            {questions.map((_, questionIdx) => {
              const isAnswered = answers[questions[questionIdx].id] !== undefined;
              const isCurrent = questionIdx === currentIndex;

              return (
                <button
                  key={questionIdx}
                  onClick={() => goToQuestion(questionIdx)}
                  className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : isAnswered
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                  title={`Soal ${questionIdx + 1}`}
                >
                  {questionIdx + 1}
                </button>
              );
            })}
          </div>

          {!isLastQuestion ? (
            <button
              onClick={goToNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all hover:from-blue-700 hover:to-purple-700"
            >
              Selanjutnya
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Selesai
                </>
              )}
            </button>
          )}
        </div>

        {/* Info jika belum semua dijawab */}
        {answeredCount < questions.length && isLastQuestion && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Informasi</p>
              <p>
                Anda belum menjawab {questions.length - answeredCount} dari {questions.length} soal.
                Anda tetap dapat menyelesaikan latihan, namun soal yang tidak dijawab akan dianggap salah.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
