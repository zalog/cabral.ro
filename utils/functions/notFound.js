import { createError } from '#imports';

// the browser shows the error page only for a fatal error; the server shows it for every error and logs the fatal ones
const notFound = () => createError({ statusCode: 404, message: 'Nu am găsit pagina', fatal: import.meta.client });

export default notFound;
