import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export const PasswordField = ({
  label,
  icon,
  register,
  name,
  placeholder,
  validation,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label 
          htmlFor={name} 
          className="font-semibold text-gray-700 text-base"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <img src={icon} alt="Icono" className="w-5 h-5 text-gray-500" />
          </div>
        )}
        <input
          {...register(name, validation)}
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            bg-gray-100 
            rounded-2xl
            p-3
            pl-10
            w-full 
            h-12
            text-base
            focus:outline-none 
            focus:ring-2 
            focus:ring-brand
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <AiFillEyeInvisible className="w-6 h-6" />
          ) : (
            <AiFillEye className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};
