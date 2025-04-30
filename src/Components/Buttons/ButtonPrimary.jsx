import { useNavigate } from "react-router-dom"

export const ButtonPrimary = ({path, text, disabled}) => {
  const navigate = useNavigate();
  return (
    <button
    disabled={disabled?disabled:false}
    onClick={() => navigate(path)}
    className="block mx-auto w-full max-w-md bg-brand text-white py-3 xs:py-3.5 sm:py-4 md:py-4.5 lg:py-5 xl:py-5 2xl:py-5.5 3xl:py-6 4xl:py-6 rounded-full mt-5 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl 3xl:text-3xl 4xl:text-4xl font-medium shadow-md"
    >
      {text}
    </button>
  )
}