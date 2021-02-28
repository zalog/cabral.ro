const spa = (req, res, next) => {
    const ua = req.headers['user-agent'];
    const isBot = ua.includes('bot');

    if (!isBot) res.spa = true;

    next();
};

export { spa as default };
