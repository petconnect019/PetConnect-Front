import * as yup from "yup";

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Correo electrónico inválido")
    .required("Este campo es obligatorio")
    .matches(/@dominio\.com$|@gmail\.com$/, "El correo debe ser @dominio.com o @gmail.com"),
  password: yup
    .string()
    .min(6, "Debe tener al menos 6 caracteres")
    .matches(/[A-Z]/, "Debe incluir una letra mayúscula")
    .matches(/[a-z]/, "Debe incluir una letra minúscula")
    .matches(/[0-9]/, "Debe incluir un número")
    .required("Este campo es obligatorio"),
});
