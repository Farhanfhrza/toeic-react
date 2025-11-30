import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";

export default function Finish() {
    const { attemptId } = useParams();
    const [loading, setLoading] = useState(true);
    const [attemptData, setAttemptData] = useState(null);

    useEffect(() => {
        const finishAndGetReview = async () => {
            try {
                // Finish attempt terlebih dahulu
                await api.post("/exercise/finish", { attempt_id: attemptId });
                
                // Ambil review dengan soal dan jawaban
                const reviewRes = await api.get(`/exercise/attempt/${attemptId}/review`);
                setAttemptData(reviewRes.data);
            } catch (err) {
                console.error("Error finishing exercise:", err);
            } finally {
                setLoading(false);
            }
        };

        finishAndGetReview();
    }, [attemptId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Memproses hasil...</p>
            </div>
        );
    }

    if (!attemptData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-600">Gagal memuat hasil</p>
            </div>
        );
    }

    const { attempt, questions } = attemptData;
    const score = attempt.score || 0;
    const totalQuestions = attempt.total_questions || questions.length;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header dengan Score */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Quiz Selesai!
                    </h1>
                    <div className="mt-4">
                        <p className="text-lg text-gray-600">
                            Materi: <span className="font-semibold">{attempt.material?.title || "N/A"}</span>
                        </p>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="bg-blue-100 rounded-lg p-4">
                                <p className="text-sm text-gray-600">Skor Anda</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {score} / {totalQuestions}
                                </p>
                            </div>
                            <div className="bg-green-100 rounded-lg p-4">
                                <p className="text-sm text-gray-600">Persentase</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Soal dan Jawaban */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Review Jawaban
                    </h2>
                    <div className="space-y-6">
                        {questions.map((question, index) => {
                            const userAnswer = question.user_answer;
                            // Debug: Log answer details
                            console.log("Question review:", {
                                question_id: question.id,
                                userAnswer: userAnswer,
                                is_correct: userAnswer?.is_correct,
                                is_correct_type: typeof userAnswer?.is_correct,
                                selected_option_id: userAnswer?.selected_option_id
                            });
                            
                            // Handle both boolean and integer/0-1 values
                            const isCorrectValue = userAnswer?.is_correct;
                            const isCorrect = isCorrectValue === true || isCorrectValue === 1 || isCorrectValue === "1";
                            const hasAnswer = userAnswer !== null;

                            console.log("Calculated isCorrect:", {
                                question_id: question.id,
                                isCorrectValue,
                                isCorrect,
                                hasAnswer
                            });

                            return (
                                <div
                                    key={question.id}
                                    className={`border-2 rounded-lg p-4 ${
                                        isCorrect
                                            ? "border-green-500 bg-green-50"
                                            : "border-red-500 bg-red-50"
                                    }`}
                                >
                                    {/* Nomor Soal dan Status */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-gray-800">
                                                Soal {index + 1}
                                            </span>
                                            {isCorrect ? (
                                                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                                                    ✓ Benar
                                                </span>
                                            ) : (
                                                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                                                    ✗ Salah
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Pertanyaan */}
                                    <p className="text-gray-800 font-medium mb-4">
                                        {question.text}
                                    </p>

                                    {/* Jawaban User yang Dipilih */}
                                    {hasAnswer && userAnswer.selected_option ? (
                                        <div className={`mb-4 p-4 rounded-lg border-2 ${
                                            isCorrect 
                                                ? "bg-green-50 border-green-400" 
                                                : "bg-red-50 border-red-400"
                                        }`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`font-semibold ${
                                                    isCorrect ? "text-green-800" : "text-red-800"
                                                }`}>
                                                    Jawaban Anda:
                                                </span>
                                                {isCorrect ? (
                                                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded font-semibold">
                                                        ✓ Benar
                                                    </span>
                                                ) : (
                                                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-semibold">
                                                        ✗ Salah
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`flex items-center gap-2 p-2 rounded ${
                                                isCorrect ? "bg-green-100" : "bg-red-100"
                                            }`}>
                                                <span className={`font-bold text-lg ${
                                                    isCorrect ? "text-green-700" : "text-red-700"
                                                }`}>
                                                    {userAnswer.selected_option.label}.
                                                </span>
                                                <span className={`${
                                                    isCorrect ? "text-green-800" : "text-red-800"
                                                }`}>
                                                    {userAnswer.selected_option.text}
                                                </span>
                                            </div>
                                        </div>
                                    ) : hasAnswer && userAnswer.selected_option_id ? (
                                        // Fallback jika selected_option tidak ada tapi selected_option_id ada
                                        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-blue-800">Jawaban Anda:</span>
                                                <span className={`text-xs px-2 py-1 rounded font-semibold ${
                                                    isCorrect 
                                                        ? "bg-green-500 text-white" 
                                                        : "bg-red-500 text-white"
                                                }`}>
                                                    {isCorrect ? "✓ Benar" : "✗ Salah"}
                                                </span>
                                            </div>
                                            <p className="text-blue-800">
                                                Option ID: {userAnswer.selected_option_id}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                                            <p className="text-yellow-800 font-semibold">
                                                ⚠ Anda tidak menjawab soal ini
                                            </p>
                                        </div>
                                    )}

                                    {/* Opsi Jawaban */}
                                    <div className="space-y-2">
                                        {question.options.map((option) => {
                                            const isUserSelected =
                                                hasAnswer &&
                                                userAnswer.selected_option_id === option.id;
                                            const isCorrectOption = option.is_correct;

                                            let bgColor = "bg-gray-100";
                                            let textColor = "text-gray-800";
                                            let borderColor = "border-gray-300";

                                            if (isCorrectOption) {
                                                bgColor = "bg-green-100";
                                                textColor = "text-green-800";
                                                borderColor = "border-green-500";
                                            }

                                            if (isUserSelected && !isCorrectOption) {
                                                bgColor = "bg-red-100";
                                                textColor = "text-red-800";
                                                borderColor = "border-red-500";
                                            }

                                            return (
                                                <div
                                                    key={option.id}
                                                    className={`p-3 rounded border-2 ${bgColor} ${textColor} ${borderColor}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">
                                                            {option.label}.
                                                        </span>
                                                        <span>{option.text}</span>
                                                        {isCorrectOption && (
                                                            <span className="ml-auto text-xs font-semibold bg-green-500 text-white px-2 py-1 rounded">
                                                                Jawaban Benar
                                                            </span>
                                                        )}
                                                        {isUserSelected && !isCorrectOption && (
                                                            <span className="ml-auto text-xs font-semibold bg-red-500 text-white px-2 py-1 rounded">
                                                                Jawaban Anda
                                                            </span>
                                                        )}
                                                        {isUserSelected && isCorrectOption && (
                                                            <span className="ml-auto text-xs font-semibold bg-blue-500 text-white px-2 py-1 rounded">
                                                                Jawaban Anda (Benar)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
