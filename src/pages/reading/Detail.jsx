export default function ReadingDetail() {

    return (
        <div className="flex min-h-screen bg-gray-50 flex-col">
            <div className="border-b-2 border-gray-400 flex pl-8 pt-8 pb-8 items-center text-gray-800 gap-2">
                <h1 className="text-3xl font-bold text-gray-800">
                    Reading Materials
                </h1>
            </div>
            <main className="flex-grow p-8">
            <iframe src="/pdf.pdf" style={{ width: '100%', height: '500px' }} />
            </main>
        </div>
    );
}