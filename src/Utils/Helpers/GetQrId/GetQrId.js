export const getQrId = (link) => {
    console.log('=== DEBUG getQrId ===');
    console.log('Link recibido:', link);
    console.log('Longitud del link:', link.length);
    
    let size = link.length;
    const qrId = link.slice(size - 24);
    
    console.log('QR ID extraído:', qrId);
    console.log('Longitud del QR ID:', qrId.length);
    
    return qrId;
};