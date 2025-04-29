import { useNavigate } from "react-router-dom"

export const ButtonPrimary = ({path, text, disabled}) => {
  const navigate = useNavigate();
  return (
    <button
    disabled={disabled?disabled:false}
    onClick={() => navigate(path)}
    className="block mx-auto w-full max-w-md bg-brand text-white py-3 rounded-full mt-5 text-lg font-medium shadow-md"
    >
      {text}
    </button>
  )
}