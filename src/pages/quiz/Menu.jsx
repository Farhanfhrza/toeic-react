import { Link } from "react-router-dom";

export default function QuizMenu() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Pilih Jenis Quiz</h1>

            <div className="flex flex-col gap-4">
                <Link to="/quiz/list/reading" className="btn btn-primary text-black">
                    Reading
                </Link>

                <Link to="/quiz/list/listening" className="btn btn-primary text-black">
                    Listening
                </Link>
            </div>
        </div>
    );
}
