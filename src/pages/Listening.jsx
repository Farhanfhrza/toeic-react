import React from "react";
import Sidebar from "../components/Sidebar";
import MateriCard from "../components/MaterialCard";

const materiData = [
    {
        title: "Listening Strategies",
        description:
            "Tips memahami percakapan, mengenali aksen, dan menjawab cepat tanpa panik.",
        isDone: true,
        imageSrc: "https://via.placeholder.com/150x96?text=Listening",
    },
    {
        title: "Reading Strategies",
        description:
            "Membaca cepat, memahami konteks, dan menemukan jawaban secara efisien.",
        isDone: true,
        imageSrc: "https://via.placeholder.com/150x96?text=Reading",
    },
    {
        title: "Writing Skills",
        description:
            "Cara menulis kalimat dan paragraf yang jelas, efektif, dan sesuai konteks.",
        isDone: false,
        imageSrc: "https://via.placeholder.com/150x96?text=Writing",
    },
    {
        title: "Grammar & Structure",
        description:
            "Penjelasan dasar grammar TOEIC, tenses, preposition, dan sentence structure.",
        isDone: false,
        imageSrc: "https://via.placeholder.com/150x96?text=Grammar",
    },
    {
        title: "Vocabulary & Expressions",
        description:
            "Kumpulan kosakata penting dan frasa bisnis yang sering muncul di TOEIC.",
        isDone: false,
        imageSrc: "https://via.placeholder.com/150x96?text=Vocabulary",
    },
    {
        title: "Judul Materi/Buku yang Dilampirkan",
        description: "Deskripsi singkat materi.",
        isDone: false,
        imageSrc: "https://via.placeholder.com/150x96?text=Materi+Tambahan",
    },
];

const Reading = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - Navigasi Kiri */}
            <Sidebar />

            {/* Konten Utama */}
            <main className="flex-grow p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Materi
                </h1>

                {/* Daftar Materi */}
                <div className="space-y-4">
                    {materiData.map((materi, index) => (
                        <MateriCard
                            key={index}
                            title={materi.title}
                            description={materi.description}
                            isDone={materi.isDone}
                            imageSrc={materi.imageSrc}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Reading;
