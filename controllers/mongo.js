let mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/engbooks');
// because mongoose don't have own Promise library
mongoose.Promise = Promise;

let User = mongoose.model('User', {
    login: String,
    password: String
});

let Book = mongoose.model("Book", {
    title: String,
    description: String,
    author: String,
    category: String,
    bookSource: String,
    imageSource: String,
    lang: String
});

let Word = mongoose.model("Word", {
    original: String,
    translated: String,
    lang: String,
    owner: String
});

exports.User = User;
exports.Book = Book;
exports.Word = Word;