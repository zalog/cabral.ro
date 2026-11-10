// WordPress sends `false` for missing image fields, and Vue renders a `false` attribute as the text "false"
const media = (payload) => payload && Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== false),
);

export default media;
