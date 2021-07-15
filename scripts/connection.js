const mongoose = require('mongoose');
let uri;
if (process.env.NODE_ENV === 'production') {
    uri = 'mongodb+srv://yamamz:Maimai011385@cluster0.b4ksj.mongodb.net/draw?retryWrites=true&w=majority'
} else {
    uri = 'mongodb+srv://yamamz:Maimai011385@cluster0.b4ksj.mongodb.net/draw_test?retryWrites=true&w=majority'
}
try {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
        console.log("connected"));
} catch (error) {
    console.log("could not connect");
}