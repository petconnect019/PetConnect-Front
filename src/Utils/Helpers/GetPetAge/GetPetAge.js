export const GetPetAge = (fechaNacimiento) => {
    const fechaIngresada = new Date(fechaNacimiento); // Convertimos la fecha a un objeto Date
    const fechaActual = new Date(); // Obtenemos la fecha actual

    // Calculamos la diferencia en años y meses
    let diferenciaAnios = fechaActual.getFullYear() - fechaIngresada.getFullYear();
    let diferenciaMeses = fechaActual.getMonth() - fechaIngresada.getMonth();

    // Si los meses son negativos, significa que el año aún no ha terminado completamente
    if (diferenciaMeses < 0) {
        diferenciaAnios--; // Restamos 1 año
        diferenciaMeses += 12; // Ajustamos los meses
    }

    // Si tiene menos de un año, devolver los meses
    if (diferenciaAnios === 0) {
        return `${diferenciaMeses} meses`;
    }

    // Si tiene un año o más, aproximar al año más cercano
    if (diferenciaMeses >= 6) {
        diferenciaAnios++; // Redondear hacia arriba si tiene 6 meses o más
    }

    return `${diferenciaAnios} años`;
};
