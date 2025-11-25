import React from "react";
import { CheckCircle, Bookmark } from "lucide-react";

const MaterialCard = ({ title, description, 
    // isDone, 
    // imageSrc
 }) => {
    return (
        <div className="flex items-start bg-white p-4 mb-4 rounded-xl shadow-sm border border-gray-100">
            {/* Gambar Materi */}
            {/* <img
                src={imageSrc}
                alt={title}
                className="w-40 h-24 object-cover rounded-lg mr-4 flex-shrink-0"
            /> */}

            {/* Detail Materi */}
            <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500 mt-1 mb-2">{description}</p>

                {/* Status Penyelesaian */}
                <div className="flex items-center text-sm">
                    {/* {isDone ? (
                        <span className="flex items-center text-green-600 font-medium">
                            <CheckCircle size={16} className="mr-1" />
                            Done
                        </span>
                    ) : (
                        <span className="text-blue-600 text-xs font-medium bg-blue-50 py-1 px-2 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                            Mark as done
                        </span>
                    )} */}
                </div>
            </div>

            {/* Aksi/Tombol */}
            <div className="flex flex-col items-end space-y-2 ml-4 flex-shrink-0">
                <div className="flex space-x-2">
                    <button className="py-1 px-4 text-sm font-medium rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors bg-white">
                        Pelajari
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MaterialCard;
