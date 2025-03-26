
import { AiFillHome, AiFillMessage, AiFillSetting } from "react-icons/ai"


export const FooterNav = ({ navigate }) => {
    return (
        <footer className="bg-white flex justify-around fixed bottom-0 w-full mt-4 mb-14">
            <button>
                <AiFillHome className="text-2xl text-brand" />
            </button>
            <button onClick={() => navigate("/messages")}>
                <AiFillMessage className="text-2xl text-gray-400" />
            </button>
            <button onClick={() => navigate("/settings")}>
                <AiFillSetting className="text-2xl text-gray-400" />
            </button>
        </footer>
    );
};