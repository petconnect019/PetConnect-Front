import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavButton } from '../../Components/NavButton/NavButton';
import { FooterNav } from '../../Components/FooterNav/FooterNav';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from '@emailjs/browser';
import { ImSpinner2 } from "react-icons/im";

// Inicializar EmailJS
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

// Log para verificar las variables de entorno (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('EmailJS Config:', {
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  });
}

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-4 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base font-medium text-gray-900">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 text-sm text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
};

const ContactButton = ({ icon, text, action, bgColor }) => (
  <button
    onClick={action}
    className={`${bgColor} w-full flex items-center justify-center space-x-2 p-4 rounded-lg text-white transition-transform transform hover:scale-105`}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </button>
);

export const Support = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const faqData = [
    {
      question: "¿Cómo funciona el sistema de códigos QR?",
      answer: "Los códigos QR de PetConnect son únicos para cada mascota. Al escanear el código, se muestra el perfil público de tu mascota con la información de contacto que hayas configurado."
    },
    {
      question: "¿Qué hago si pierdo mi contraseña?",
      answer: "Puedes restablecer tu contraseña haciendo clic en '¿Olvidaste tu contraseña?' en la pantalla de inicio de sesión. Te enviaremos un enlace a tu correo electrónico para crear una nueva contraseña."
    },
    {
      question: "¿Cómo actualizo la información de mi mascota?",
      answer: "Ve a la sección 'Mis Mascotas', selecciona la mascota que deseas actualizar y haz clic en el botón de edición. Podrás modificar toda la información, incluyendo fotos y datos de contacto."
    },
    {
      question: "¿Los códigos QR tienen fecha de vencimiento?",
      answer: "No, los códigos QR de PetConnect no vencen. Puedes usarlos indefinidamente mientras mantengas activa tu cuenta."
    }
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/573103901579', '_blank');
  };

  const handleEmail = () => {
    window.location.href = 'mailto:petconnect019@gmail.com';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'Equipo PetConnect',
      };

      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (result.status === 200) {
        toast.success('¡Mensaje enviado correctamente! Te contactaremos pronto.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      toast.error('Error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <NavButton onClick={() => navigate(-1)} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Centro de Ayuda</h1>

        {/* Preguntas Frecuentes */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preguntas Frecuentes</h2>
          <div className="bg-white rounded-lg shadow">
            {faqData.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </section>

        {/* Botones de Contacto Directo */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contacto Directo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactButton
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              }
              text="WhatsApp"
              action={handleWhatsApp}
              bgColor="bg-green-600 hover:bg-green-700"
            />
            <ContactButton
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              }
              text="Correo Electrónico"
              action={handleEmail}
              bgColor="bg-blue-600 hover:bg-blue-700"
            />
          </div>
        </section>

        {/* Formulario de Contacto */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Envíanos un Mensaje</h2>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand focus:border-brand"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand focus:border-brand"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand focus:border-brand"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand focus:border-brand"
                  required
                ></textarea>
              </div>

              <ButtonPrimary
                text={
                  isLoading ? (
                    <div className="flex items-center justify-center">
                      <ImSpinner2 className="animate-spin mr-2" />
                      Enviando...
                    </div>
                  ) : (
                    "Enviar Mensaje"
                  )
                }
                type="submit"
                className="w-full"
                disabled={isLoading}
              />
            </div>
          </form>
        </section>
      </div>

      <FooterNav navigate={navigate} />
      <ToastContainer position="top-right" />
    </div>
  );
}; 