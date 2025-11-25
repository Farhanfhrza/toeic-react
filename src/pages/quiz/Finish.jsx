import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";

export default function Finish() {
    const { attemptId } = useParams();
    const [score, setScore] = useState(null);

    useEffect(() => {
        api.post("/exercise/finish", { attempt_id: attemptId }).then((res) => {
            setScore(res.data.score);
        });
    }, [attemptId]);

    if (score === null) return <p>Memproses...</p>;

    return (
        <div className="text-black">
            <h1 className="text-2xl font-bold">Quiz Selesai!</h1>
            <p className="text-xl mt-4">
                Skor: <b>{score}</b>
            </p>
        </div>
    );
}
