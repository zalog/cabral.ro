const getLeadingZero = (number) => (number < 10 ? `0${number}` : number);
const getMM = (number) => getLeadingZero(number + 1);

const formatDate = (string) => {
    if (!string || typeof string !== 'string') return undefined;

    const date = new Date(string);
    const dd = getLeadingZero(date.getDate());
    const mm = getMM(date.getMonth());
    const yy = date.getFullYear();

    return `${dd}.${mm}.${yy}`;
};

export { formatDate as default };
