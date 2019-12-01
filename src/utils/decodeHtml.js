export default (string) => {
    return string.replace(
        /&#(\d+);/g,
        (match, dec) => String.fromCharCode(dec)
    );
};
