import { useNavigate } from "react-router-dom"

export const ButtonPrimary = ({path, text, disabled}) => {
  const navigate = useNavigate();
  return (
    <button
    disabled={disabled?disabled:false}
    onClick={() => navigate(path)}
    className="w-full max-w-xs bg-brand text-white py-3 rounded-full mt-8 text-lg font-medium shadow-md"
    >
      {text}
    </button>
  )
}