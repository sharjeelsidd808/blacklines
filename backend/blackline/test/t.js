//Import the mongoose module
var mongoose = require('mongoose');
const t = async () => {
    const mongodbOptions = {
        useNewUrlParser: true,
        
        
        useUnifiedTopology: true
    }
    var mongoDB = 'mongodb://127.0.0.1/my_database';
    var db = mongoose.connection;
    db.on('disconnected', () => {
        // tries += 1
        console.error('MongoDB disconnected!')
        mongoose.connect(mongoDB, mongodbOptions)
        // if (tries > 3) {
        //     process.exit(1)
        // }
    })
await mongoose.connect(mongoDB,mongodbOptions);

//Get the default connection

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

t()
//Set up default mongoose connection
