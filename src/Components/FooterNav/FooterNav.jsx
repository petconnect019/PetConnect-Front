export const FooterNav = ({ navigate, petList }) => {
    return (
        <footer className="fixed bottom-0 w-full bg-white p-4 flex justify-around shadow-md border-t">
            <button className="text-blue-500 flex flex-col items-center">
                🏠<span className="text-xs">Home</span>
            </button>
            <button onClick={() => console.log(petList)} className="text-gray-500 flex flex-col items-center hover:text-blue-500">
                💬<span className="text-xs">Mensajes</span>
            </button>
            <button onClick={() => navigate("/settings")} className="text-gray-500 flex flex-col items-center hover:text-blue-500">
                ⚙️<span className="text-xs">Configuración</span>
            </button>
        </footer>
    );
};
