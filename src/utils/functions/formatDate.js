export function formatDate(string) {
    if (!string || typeof string !== 'string') return;

    const date = new Date(string);
    const dd = getDD(date.getDate());
    const mm = getMM(date.getMonth());
    const yy = date.getFullYear();

    return `${dd}.${mm}.${yy}`;
}

const getDD = (number) => number < 10 ? `0${number}` : number;
const getMM = (number) => number + 1;
