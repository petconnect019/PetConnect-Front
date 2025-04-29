import React from 'react';

export const ModalResponseEpayco = ({ 
    path, 
    setModalOpen, 
    textTitle,
    textResponse, 
    navigate, 
    imgProfile, 
    buttonText,
    onClick,
    buttonText2,
    onClick2
}) => {
    const handleClick = async () => {
        if (onClick) {
            await onClick();
        } else {
            setModalOpen(false);
            navigate(path);
        }
    };

    const handleClick2 = async () => {
        if (onClick2) {
            await onClick2();
        } else {
            setModalOpen(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
                <img src={imgProfile} alt="Éxito" className="mx-auto object-cover mb-4 w-28 h-28 rounded-full" />
                <h2 className="text-2xl font-bold text-gray-800">{textTitle}</h2>
                <p className="text-gray-600">{textResponse}</p>
                <div className="flex flex-col gap-2 mt-4">
                    <button
                        onClick={handleClick}
                        className="w-full bg-orange-400 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-all"
                    >
                        {buttonText}
                    </button>
                    {buttonText2 && (
                        <button
                            onClick={handleClick2}
                            className="w-full bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-all"
                        >
                            {buttonText2}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};