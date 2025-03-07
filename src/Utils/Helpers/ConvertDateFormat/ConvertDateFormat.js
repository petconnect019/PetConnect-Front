export function convertDateFormat(dateStr) {
    let [year, month, day] = dateStr.split('/');
    return `${day}/${month}/${year}`;
}