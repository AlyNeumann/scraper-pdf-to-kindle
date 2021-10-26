const validator = require('validator')

module.exports.isValidData = async (url, email) => {
    let urlValidation = validator.isURL(url)
    let emailValidation = validator.isEmail(email)
    if(!urlValidation || !emailValidation){
        return false
    }
    return true
}