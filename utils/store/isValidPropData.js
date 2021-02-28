const isValidPropData = (currentPage, prop, bypass = false, expireMinutes = 5) => {
    const isInvalid = !currentPage || !currentPage[prop] || !currentPage.timestamp[prop] || !prop;

    if (isInvalid || bypass) return false;

    const timestampNow = new Date().getTime();
    const dataExpired = (currentPage.timestamp[prop] + (expireMinutes * 60 * 1000)) < timestampNow;

    const isValid = !dataExpired;

    return isValid;
};

export { isValidPropData as default };
