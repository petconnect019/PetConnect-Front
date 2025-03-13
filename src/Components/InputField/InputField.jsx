import React from "react";

export const InputField = ({ label, icon, register, name, placeholder, validation }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[1.4rem] font-semibold">{label}</label>}
      <div className="relative w-full">
        {icon && (
          <img
            src={icon}
            alt="Icono"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        )}
        <input
          {...register(name, validation)}
          type="text"
          placeholder={placeholder}
          className="bg-gray-100 rounded-md p-2 pl-10 w-full h-14 focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
    </div>
  );
};
