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
    <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-2 2xl:gap-8">
      {label && (
        <label 
          htmlFor={name} 
          className="font-semibold text-gray-700 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-xl 2xl:text-3xl 3xl:text-3xl 4xl:text-3xl"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 xs:pl-4 sm:pl-5 md:pl-6 lg:pl-7 xl:pl-8 2xl:pl-9 4xl:pl-8 pointer-events-none">
            <img src={icon} alt="Icono" className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:h-8 4xl:w-8 text-gray-500" />
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
            p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-4 2xl:p-8 4xl:p-8
            pl-8 xs:pl-10 sm:pl-12 md:pl-14 lg:pl-16 xl:pl-18 2xl:pl-18 4xl:pl-18
            w-full 
            h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-12 2xl:h-18 4xl:h-18
            text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl 4xl:text-2xl
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