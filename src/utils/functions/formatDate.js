export function formatDate(string) {
    if (!string || typeof string !== 'string') return;

    const date = new Date(string);

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}
