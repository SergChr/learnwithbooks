let mongo = require("./mongo"); //connect mongo controller

// add book
exports.add = function (req, resolve, reject) {
    let title = req.body.title,
        description = req.body.description,
        author = req.body.author,
        category = req.body.category,
        bookSource = req.body.bookSource,
        imageSource = req.body.imageSource,
        lang = req.body.lang;
    
// create model
    let newBook = new mongo.Book({
        title: title,
        description: description,
        author: author,
        category: category,
        bookSource: bookSource,
        imageSource: imageSource,
        lang: lang
    });
// save book
    newBook.save(function (err) {
        if (err) {
            reject(err);
        } else {
            resolve("OK");
        }
    });
}

// get all books
exports.get = function(resolve, reject) {
    let result = mongo.Book.find();
    resolve(result);
}

// get only one book (for `read` page)
exports.getOne = function(bookUrl, resolve, reject){
    // seacrh by bookSource parameter
    let result = mongo.Book.findOne({ bookSource: bookUrl });
    resolve(result);
}

// get books by searching filter (for seacrh in header)
exports.getBy = function(string, resolve, reject){
    mongo.Book.find({ "title": { "$regex": string, "$options": "i" } }, function(err,docs) { 
        if(err) {
            reject(err);
        } else {
           // resolve(docs);
            if(docs.length == 0) {
                reject(err);
            } else {
                resolve(docs);
            }
        }
    } 
);
}

exports.getByCategory = function(category, resolve, reject){
    let result = mongo.Book.find({ "category": category });
    resolve(result);
}

exports.getByLang = function(lang, resolve, reject){
    let result = mongo.Book.find({ "lang": lang });
    resolve(result);
}


