export default function ListeningDetail() {
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

    return (
        <div className="flex min-h-screen bg-gray-50 flex-col">
            <div className="border-b-2 border-gray-400 flex pl-8 pt-8 pb-8 items-center text-gray-800 gap-2">
                <h1 className="text-3xl font-bold text-gray-800">
                    Listening Materials
                </h1>
            </div>
            <main className="flex-grow p-8">
                <SimpleAudioPlayer src="/01.mp3" />
            </main>
        </div>
    );
}
