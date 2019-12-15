export default (string) => {
    if (!string || typeof string !== 'string') return;

    return string.replace(
        /&#(\d+);/g,
        (match, dec) => String.fromCharCode(dec)
    );
};
