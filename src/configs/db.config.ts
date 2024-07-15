import {connect, ConnectOptions} from 'mongoose';

export const dbConnect = () => {
    if(process.env.MONGO_URI) {
        connect(process.env.MONGO_URI, {} as ConnectOptions)
        .then(() => {
            console.log("Successfully connected");
        })
        .catch((error) => {
            console.log(error);
        });
    }
    else {
        console.log("Mongo Uri not set");
    }
}