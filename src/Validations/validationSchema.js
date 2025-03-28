import * as yup from "yup";

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .required('Este campo es obligatorio')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Correo electrónico inválido'
    ),
  password: yup
    .string()
    .required('Este campo es obligatorio')
    .min(8, 'Debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
      'Debe contener mayúscula, minúscula y número'
    ),
  confirmPassword: yup
    .string()
    .required('Este campo es obligatorio')
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
  terms: yup
    .boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
});
