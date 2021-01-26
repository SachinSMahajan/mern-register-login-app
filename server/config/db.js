const mongooes = require('mongoose')

const dbConnection = async () => {
    const connection = await mongooes.connect(process.env.MONGO_CONNECTION, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    })

    console.log(`MongoDB connected : ${connection.connection.host}`)
}

module.exports = dbConnection;