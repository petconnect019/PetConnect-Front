
export const InputField = ({
  label,
  icon,
  register,
  name,
  placeholder,
  validation,
  type = "text",
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label 
          htmlFor={name} 
          className="font-semibold text-gray-700 text-md"
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
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            bg-gray-100 
            rounded-2xl
            p-3 
            pl-10 
            w-full 
            h-14 
            focus:outline-none 
            focus:ring-2 
            focus:ring-brand
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>
    </div>
  );
};