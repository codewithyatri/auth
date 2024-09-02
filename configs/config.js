require('dotenv').config()

module.exports = {
    JWT_SECRET: process.env.SECRET,
    PORT: process.env.PORT,
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
}