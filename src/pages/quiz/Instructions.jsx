import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

export default function Instructions() {
    const { materialId } = useParams();
    const navigate = useNavigate();

    const start = async () => {
        const res = await api.post("/exercise/start", {
            material_id: materialId,
        });

        const attempt = res.data.attempt;
        navigate(`/quiz/questions/${attempt.id}`);
    };

    return (
        <div className="text-black">
            <h1 className="text-xl font-bold">Instruksi</h1>
            <p className="mt-3">Kerjakan soal latihan dengan teliti.</p>

            <button onClick={start} className="btn btn-primary mt-5">
                Mulai Latihan
            </button>
        </div>
    );
}
