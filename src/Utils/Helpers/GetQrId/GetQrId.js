export const getQrId = (link) => {
    let size = link.length;
    return link.slice(size - 24);
};