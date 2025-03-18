export function convertDateFormat(date) {
    if (!date) return ""; // Evita errores si la fecha es null o undefined
    if (typeof date === "string" && date.includes("-")) return date; // Si ya está en formato YYYY-MM-DD, lo deja igual

    if (!(date instanceof Date)) {
        console.error("convertDateFormat recibió un valor inválido:", date);
        return "";
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() es base 0
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`; // Se mantiene sin hora
}
