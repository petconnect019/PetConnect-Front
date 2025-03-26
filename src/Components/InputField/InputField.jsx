import React from "react";

export const InputField = ({
  label,
  icon,
  register,
  name,
  placeholder,
  validation,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="font-semibold text-[1.2rem]">
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
          type="text"
          placeholder={placeholder}
          className="bg-gray-100 rounded-md p-2 pl-10 w-full h-14 focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
    </div>
  );
};
