import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

export default function Questions() {
    const { attemptId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [idx, setIdx] = useState(0);
    // const [selected, setSelected] = useState(null);
    const [answers, setAnswers] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/exercise/attempt/${attemptId}/questions`).then((res) => {
            setQuestions(res.data.questions);
        });
    }, [attemptId]);

    if (!questions || questions.length === 0) {
        return <p className="text-black">Loading...</p>;
    }

    const q = questions[idx];
    if (!q) return <p className="text-black">Loading soal...</p>;

    const selected = answers[q.id] ?? null;

    const handleSelect = (optionId) => {
        setAnswers({
            ...answers,
            [q.id]: optionId,
        });
    };

    // Tombol Previous
    const goPrev = () => {
        if (idx > 0) setIdx(idx - 1);
    };

    // Tombol Next
    const goNext = () => {
        if (idx < questions.length - 1) setIdx(idx + 1);
    };

    // Submit seluruh jawaban
    const finishExercise = async () => {
        for (let question of questions) {
            const option_id = answers[question.id] || null; // bisa null

            await api.post("/exercise/submit", {
                attempt_id: attemptId,
                question_id: question.id,
                option_id,
            });
        }

        // Finish
        navigate(`/quiz/finish/${attemptId}`);
    };

    // const submitAnswer = async () => {
    //     if (!selected) return alert("Pilih jawaban dulu");

    //     await api.post("/exercise/submit", {
    //         attempt_id: attemptId,
    //         question_id: q.id,
    //         option_id: selected,
    //     });

    //     if (idx + 1 < questions.length) {
    //         setSelected(null);
    //         setIdx(idx + 1);
    //     } else {
    //         navigate(`/quiz/finish/${attemptId}`);
    //     }
    // };

    return (
        <div className="text-black">
            <h2 className="text-lg font-bold">
                Soal {idx + 1}/{questions.length}
            </h2>

            <p className="mt-4">{q.text}</p>

            <div className="mt-4">
                {q.Options.map((o) => (
                    <label key={o.id} className="block cursor-pointer">
                        <input
                            type="radio"
                            checked={selected === o.id}
                            onChange={() => handleSelect(o.id)}
                        />
                        <span className="ml-2">{o.text}</span>
                    </label>
                ))}
            </div>

            <div className="mt-6 flex justify-between">
                <button
                    className="btn btn-secondary"
                    disabled={idx === 0}
                    onClick={goPrev}
                >
                    Previous
                </button>

                {idx + 1 < questions.length ? (
                    <button className="btn btn-primary" onClick={goNext}>
                        Next
                    </button>
                ) : (
                    <button
                        className="btn btn-success"
                        onClick={finishExercise}
                    >
                        Submit Exercise
                    </button>
                )}
            </div>
        </div>
    );
}
