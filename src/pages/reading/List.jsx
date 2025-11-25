import MateriCard from "../../components/MaterialCard";
import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function ReadingList() {
    const [materials, setMaterials] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const res = await api.get("/material?category=reading");
            setMaterials(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const openMaterial = (id) => {
        navigate(`/reading/${id}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 flex-col">
            <div className="border-b-2 border-gray-400 flex pl-8 pt-8 pb-8 items-center text-gray-800 gap-2">
                <h1 className="text-3xl font-bold text-gray-800">
                    Reading Materials
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
                            // isDone={materi.isDone}
                        />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
