export const GetQrId = (link) => {
    let size = link.length;
    return link.slice(size - 16);
};