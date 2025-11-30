import MateriCard from "../../components/MaterialCard";
import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

function SimpleAudioPlayer({ src }) {
    return (
        <div>
            <h3>Audio Player Sederhana</h3>
            <audio
                controls // Menampilkan kontrol bawaan browser (play, pause, volume)
                src={src} // Sumber file audio (URL atau path lokal)
            >
                Browser Anda tidak mendukung elemen <code>audio</code>.
            </audio>
        </div>
    );
}

export default function ListeningList() {
    const [materials, setMaterials] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const res = await api.get("/material?category=listening");
            setMaterials(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const openMaterial = (id) => {
        navigate(`/listening/${id}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 flex-col">
            <div className="border-b-2 border-gray-400 flex pl-8 pt-8 pb-8 items-center text-gray-800 gap-2">
                <h1 className="text-3xl font-bold text-gray-800">
                    Listening Materials
                </h1>
            </div>
            <main className="flex-grow p-8">
                <div className="space-y-4">
                    {" "}
                    {materials.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => openMaterial(item.id)}
                            className="p-4 border rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-100 transition duration-150"
                        >
                            <MateriCard
                                title={item.title}
                                description={item.content_text}
                                progress={item.progress}
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
