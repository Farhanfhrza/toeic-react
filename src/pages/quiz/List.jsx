import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";

export default function List() {
    const { category } = useParams();
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        api.get(`/material?category=${category}`).then((res) => {
            setMaterials(res.data);
        });
    }, [category]);

    return (
        <div>
            <h2 className="text-xl font-bold capitalize mb-4">
                Daftar Materi {category}
            </h2>

            {materials.map((m) => (
                <div key={m.id} className="p-4 border rounded mb-3 text-black">
                    <h3 className="font-semibold">{m.title}</h3>
                    <Link
                        to={`/quiz/instructions/${m.id}`}
                        className="btn btn-primary mt-2"
                    >
                        Lihat Materi & Latihan
                    </Link>
                </div>
            ))}
        </div>
    );
}
