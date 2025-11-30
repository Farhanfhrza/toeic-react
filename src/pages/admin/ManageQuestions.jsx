import { useEffect, useState } from "react";
import api from "../../api";
import { Plus, Edit, Trash2, FileQuestion, X, Check, Upload, Image, Music } from "lucide-react";

export default function ManageQuestions() {
    const [questions, setQuestions] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingAudio, setUploadingAudio] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [formData, setFormData] = useState({
        entity_type: "material",
        entity_id: "",
        question_type: "reading",
        question_text: "",
        question_image: "",
        question_audio: "",
        options: [
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
        ],
    });
    const [filterEntityType, setFilterEntityType] = useState("");
    const [filterEntityId, setFilterEntityId] = useState("");

    useEffect(() => {
        fetchMaterials();
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (filterEntityType && filterEntityId) {
            fetchQuestions();
        } else {
            fetchQuestions();
        }
    }, [filterEntityType, filterEntityId]);

    const fetchMaterials = async () => {
        try {
            const res = await api.get("/admin/materials");
            if (res.data.success) {
                setMaterials(res.data.materials);
            }
        } catch (err) {
            console.error("Error fetching materials:", err);
        }
    };

    const fetchQuestions = async () => {
        try {
            let url = "/admin/questions";
            if (filterEntityType && filterEntityId) {
                url += `?entity_type=${filterEntityType}&entity_id=${filterEntityId}`;
            }
            const res = await api.get(url);
            if (res.data.success) {
                setQuestions(res.data.questions);
            }
        } catch (err) {
            console.error("Error fetching questions:", err);
            alert("Gagal memuat data soal");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi
        if (!formData.entity_id) {
            alert("Pilih materi terlebih dahulu");
            return;
        }

        const filledOptions = formData.options.filter(
            (opt) => opt.option_text.trim() !== ""
        );
        if (filledOptions.length < 2) {
            alert("Minimal 2 opsi harus diisi");
            return;
        }

        const correctCount = filledOptions.filter((opt) => opt.is_correct).length;
        if (correctCount !== 1) {
            alert("Harus ada tepat 1 jawaban yang benar");
            return;
        }

        try {
            const submitData = {
                ...formData,
                entity_id: parseInt(formData.entity_id),
                options: filledOptions,
            };

            if (editingQuestion) {
                await api.put(`/admin/questions/${editingQuestion.id}`, submitData);
                alert("Soal berhasil diperbarui");
            } else {
                await api.post("/admin/questions", submitData);
                alert("Soal berhasil ditambahkan");
            }
            setShowModal(false);
            setEditingQuestion(null);
            resetForm();
            fetchQuestions();
        } catch (err) {
            console.error("Error saving question:", err);
            alert(err.response?.data?.message || "Gagal menyimpan soal");
        }
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setImageFile(null);
        setAudioFile(null);
        const options = question.Options || [];
        const formOptions = [
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
        ];
        options.forEach((opt, idx) => {
            if (idx < 4) {
                formOptions[idx] = {
                    option_text: opt.option_text,
                    is_correct: opt.is_correct,
                };
            }
        });

        setFormData({
            entity_type: question.entity_type,
            entity_id: question.entity_id.toString(),
            question_type: question.question_type,
            question_text: question.question_text,
            question_image: question.question_image || "",
            question_audio: question.question_audio || "",
            options: formOptions,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
            return;
        }
        try {
            await api.delete(`/admin/questions/${id}`);
            alert("Soal berhasil dihapus");
            fetchQuestions();
        } catch (err) {
            console.error("Error deleting question:", err);
            alert(err.response?.data?.message || "Gagal menghapus soal");
        }
    };

    const resetForm = () => {
        setImageFile(null);
        setAudioFile(null);
        setFormData({
            entity_type: "material",
            entity_id: "",
            question_type: "reading",
            question_text: "",
            question_image: "",
            question_audio: "",
            options: [
                { option_text: "", is_correct: false },
                { option_text: "", is_correct: false },
                { option_text: "", is_correct: false },
                { option_text: "", is_correct: false },
            ],
        });
    };

    // Ensure formData.options always exists
    if (!formData.options || !Array.isArray(formData.options)) {
        formData.options = [
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
            { option_text: "", is_correct: false },
        ];
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
            alert("Hanya file gambar (JPEG, PNG, GIF, WebP) yang diizinkan");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Ukuran file maksimal 5MB");
            return;
        }

        setUploadingImage(true);
        setImageFile(file);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("image", file);

            const res = await api.post("/upload/image", uploadFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                const baseURL = (api.defaults.baseURL || "http://localhost:5000/api").replace("/api", "");
                const fullUrl = baseURL + res.data.url;
                setFormData((prev) => ({ ...prev, question_image: fullUrl }));
                alert("Gambar berhasil diupload");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert(error.response?.data?.message || "Gagal mengupload gambar");
            setImageFile(null);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAudioUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/webm"];
        if (!validTypes.includes(file.type)) {
            alert("Hanya file audio (MP3, WAV, OGG, WebM) yang diizinkan");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("Ukuran file maksimal 10MB");
            return;
        }

        setUploadingAudio(true);
        setAudioFile(file);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("audio", file);

            const res = await api.post("/upload/audio", uploadFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                const baseURL = (api.defaults.baseURL || "http://localhost:5000/api").replace("/api", "");
                const fullUrl = baseURL + res.data.url;
                setFormData((prev) => ({ ...prev, question_audio: fullUrl }));
                alert("Audio berhasil diupload");
            }
        } catch (error) {
            console.error("Error uploading audio:", error);
            alert(error.response?.data?.message || "Gagal mengupload audio");
            setAudioFile(null);
        } finally {
            setUploadingAudio(false);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setFormData((prev) => ({ ...prev, question_image: "" }));
    };

    const removeAudio = () => {
        setAudioFile(null);
        setFormData((prev) => ({ ...prev, question_audio: "" }));
    };

    const openModal = () => {
        setEditingQuestion(null);
        resetForm();
        setShowModal(true);
    };

    const updateOption = (index, field, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = {
            ...newOptions[index],
            [field]: value,
        };
        setFormData({ ...formData, options: newOptions });
    };

    const toggleCorrect = (index) => {
        const newOptions = formData.options.map((opt, idx) => ({
            ...opt,
            is_correct: idx === index,
        }));
        setFormData({ ...formData, options: newOptions });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-600 rounded-lg">
                                <FileQuestion className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Kelola Soal Exercise
                                </h1>
                                <p className="text-gray-600">
                                    Tambah, edit, atau hapus soal latihan
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus size={20} />
                            Tambah Soal
                        </button>
                    </div>

                    {/* Filter */}
                    <div className="flex gap-4">
                        <select
                            value={filterEntityType}
                            onChange={(e) => {
                                setFilterEntityType(e.target.value);
                                setFilterEntityId("");
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                        >
                            <option value="">Semua Tipe</option>
                            <option value="material">Material</option>
                            <option value="quiz">Quiz</option>
                        </select>
                        {filterEntityType === "material" && (
                            <select
                                value={filterEntityId}
                                onChange={(e) => setFilterEntityId(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg flex-1"
                            >
                                <option value="">Semua Materi</option>
                                {materials.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.title}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Soal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipe
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Opsi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {questions.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            Belum ada data soal
                                        </td>
                                    </tr>
                                ) : (
                                    questions.map((question, index) => (
                                        <tr
                                            key={question.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                                                <div className="line-clamp-2">
                                                    {question.question_text}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        question.question_type === "reading"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-purple-100 text-purple-800"
                                                    }`}
                                                >
                                                    {question.question_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {question.Options?.length || 0} opsi
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(question)
                                                        }
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(question.id)
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingQuestion ? "Edit Soal" : "Tambah Soal"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipe Entity
                                    </label>
                                    <select
                                        required
                                        value={formData.entity_type}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                entity_type: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="material">Material</option>
                                        <option value="quiz">Quiz</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Materi
                                    </label>
                                    <select
                                        required
                                        value={formData.entity_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                entity_id: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Pilih Materi</option>
                                        {materials.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipe Soal
                                </label>
                                <select
                                    required
                                    value={formData.question_type}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            question_type: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="reading">Reading</option>
                                    <option value="listening">Listening</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pertanyaan
                                </label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.question_text}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            question_text: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            {/* Options */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Opsi Jawaban
                                </label>
                                {formData.options && formData.options.length > 0 ? formData.options.map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 mb-2"
                                    >
                                        <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded font-semibold">
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <input
                                            type="text"
                                            value={option.option_text}
                                            onChange={(e) =>
                                                updateOption(
                                                    index,
                                                    "option_text",
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleCorrect(index)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all ${
                                                option.is_correct
                                                    ? "bg-green-500 border-green-600 text-white"
                                                    : "bg-white border-gray-300 text-gray-400 hover:border-green-400"
                                            }`}
                                            title="Tandai sebagai jawaban benar"
                                        >
                                            {option.is_correct ? (
                                                <Check size={20} />
                                            ) : (
                                                <X size={20} />
                                            )}
                                        </button>
                                    </div>
                                )) : (
                                    <p className="text-sm text-gray-500">Tidak ada opsi</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gambar (Opsional)
                                    </label>
                                    <div className="space-y-2">
                                        {formData.question_image ? (
                                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Image className="text-green-600" size={20} />
                                                    <span className="text-sm text-gray-700">
                                                        {imageFile
                                                            ? imageFile.name
                                                            : "Gambar sudah diupload"}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Upload className="text-gray-400 mb-1" size={20} />
                                                        <p className="text-xs text-gray-500">
                                                            Upload Gambar
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            MAX. 5MB
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        disabled={uploadingImage}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {uploadingImage && (
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        Mengupload...
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Atau masukkan URL:
                                        </p>
                                        <input
                                            type="text"
                                            value={formData.question_image}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    question_image: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Audio (Opsional)
                                    </label>
                                    <div className="space-y-2">
                                        {formData.question_audio ? (
                                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Music className="text-green-600" size={20} />
                                                    <span className="text-sm text-gray-700">
                                                        {audioFile
                                                            ? audioFile.name
                                                            : "Audio sudah diupload"}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeAudio}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Upload className="text-gray-400 mb-1" size={20} />
                                                        <p className="text-xs text-gray-500">
                                                            Upload Audio
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            MAX. 10MB
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="audio/*"
                                                        onChange={handleAudioUpload}
                                                        disabled={uploadingAudio}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {uploadingAudio && (
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        Mengupload...
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Atau masukkan URL:
                                        </p>
                                        <input
                                            type="text"
                                            value={formData.question_audio}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    question_audio: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="https://example.com/audio.mp3"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingQuestion(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    {editingQuestion ? "Update" : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

