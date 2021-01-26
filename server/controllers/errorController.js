module.exports = (err, req, res, next) => {
    try {
        //console.log("error handling middleware")
        if (err.name === 'ValidationError')
            return err = handleValidationError(err, res);
        if (err.code && err.code == 11000)
            return err = handleDuplicateKeyError(err, res);
        if (err.name === 'dataValidationError')
            return err = handleDataValidationError(err.error, res);

        res.status(err.code).send(err)
    } catch (error) {
        res.status(500).send('An unknown error occurred.')
    }
}
//Handle duplicate key e.g duplicate email error
const handleDuplicateKeyError = (err, res) => {
    const field = Object.keys(err.keyValue);

    const code = 409;
    const errMessage = `An account with ${field} already exists.`
    res.status(code).send({ message: errMessage, fields: field })
}
//Handle field validation error
const handleValidationError = (err, res) => {
    let errMessages = Object.values(err.errors).map(el => el.message);
    let fields = Object.values(err.errors).map(el => el.path);

    let code = 400;
    if (errMessages.length > 1) {
        const formattedErrors = errMessages.join(' ')
        res.status(code).send({ messages: formattedErrors, fields: fields })
    }
    else {
        res.status(code).send({ message: errMessages, fields: fields })
    }
}

const handleDataValidationError = (err, res) => {
    let errMessages = Object.values(err.errors).map(e => e.msg)
    let fields = Object.values(err.errors).map(e => e.param)

    res.status(422).send({ message: errMessages[0], fields: fields[0] })
}