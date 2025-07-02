import { useNavigate } from "react-router-dom";
import { NavButton } from "../../Components/NavButton/NavButton";

export const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <NavButton onClick={() => navigate(-1)} />
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Términos y Condiciones de PetConnect</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Introducción</h2>
            <p>
              Bienvenido a PetConnect. Al acceder y utilizar nuestra aplicación, usted acepta estos términos y condiciones en su totalidad.
              No continúe usando PetConnect si no acepta todos los términos y condiciones establecidos en esta página.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Licencia de Uso</h2>
            <p>
              PetConnect otorga una licencia personal, no transferible y no exclusiva para utilizar la aplicación de acuerdo con estos términos y condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Registro y Seguridad</h2>
            <p>
              Para utilizar PetConnect, debe registrarse proporcionando información precisa y actualizada. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.
              La información proporcionada está protegida según la Ley 1581 de 2012 de Protección de Datos Personales de Colombia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Uso del Sistema QR</h2>
            <p>
              Los códigos QR proporcionados por PetConnect son para uso exclusivo dentro de nuestra plataforma. Usted es responsable de la vinculación y uso apropiado de los códigos QR con sus mascotas.
              PetConnect no se hace responsable por el uso indebido o no autorizado de los códigos QR.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Responsabilidades del Usuario</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar información veraz sobre sus mascotas</li>
              <li>Mantener actualizada la información de contacto</li>
              <li>Usar la plataforma de manera ética y legal</li>
              <li>No compartir información falsa o engañosa</li>
              <li>Respetar los derechos de otros usuarios</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Privacidad y Datos Personales</h2>
            <p>
              De acuerdo con la legislación colombiana (Ley 1581 de 2012), protegemos sus datos personales y los de sus mascotas.
              Consulte nuestra Política de Privacidad para más detalles sobre cómo recopilamos, usamos y protegemos su información.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Limitación de Responsabilidad</h2>
            <p>
              PetConnect no se hace responsable por:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pérdida o extravío de mascotas</li>
              <li>Información incorrecta proporcionada por los usuarios</li>
              <li>Uso indebido de la plataforma</li>
              <li>Interrupciones temporales del servicio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">8. Modificaciones</h2>
            <p>
              PetConnect se reserva el derecho de modificar estos términos y condiciones en cualquier momento.
              Los cambios serán efectivos inmediatamente después de su publicación en la aplicación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">9. Ley Aplicable</h2>
            <p>
              Estos términos y condiciones se rigen por las leyes de la República de Colombia.
              Cualquier disputa será resuelta en los tribunales competentes de Colombia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">10. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre estos términos y condiciones, puede contactarnos a través de los canales oficiales de PetConnect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}; 