import * as yup from "yup";

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Correo electrónico inválido")
    .required("Este campo es obligatorio")
    .matches(
      /@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|aol\.com|icloud\.com|protonmail\.com|mail\.com|zoho\.com|yandex\.com|gmx\.com|live\.com|qq\.com|163\.com|126\.com|sina\.com|naver\.com|daum\.net|rediffmail\.com|rocketmail\.com|tutanota\.com|fastmail\.com|hushmail\.com|lycos\.com|mail\.ru|inbox\.com|earthlink\.net|att\.net|verizon\.net|comcast\.net|microsoft\.com|apple\.com|amazon\.com|facebook\.com|twitter\.com|linkedin\.com|ibm\.com|oracle\.com|intel\.com|hp\.com)$/,
      "El correo debe ser un dominio válido"
    ),
  password: yup
    .string()
    .min(6, "Debe tener al menos 6 caracteres")
    .matches(/[A-Z]/, "Debe incluir una letra mayúscula")
    .matches(/[a-z]/, "Debe incluir una letra minúscula")
    .matches(/[0-9]/, "Debe incluir un número")
    .required("Este campo es obligatorio"),
});
