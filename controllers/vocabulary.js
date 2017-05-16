let mongo = require("./mongo");

exports.add = function (data, resolve, reject) {
    // I need to parse JSON, because it not `req` param
    let arr = JSON.parse(data),
        id;

    let newWord = new mongo.Word({
        original: arr["original"],
        translated: arr["translated"],
        lang: arr["lang"],
        owner: arr["owner"]
    });

    // I must find word `id` to send this to `vocabulary.js`
    // for add and delete words, they must contain `data-id`
    // because without `data-id` they'll not be able to deleting
    function findID() {
        return new Promise(function (resolve, reject) {
            resolve(mongo.Word.findOne({
                "original": arr["original"],
                "owner": arr["owner"]
            }));
        });
    }


    newWord.save(function (err) {
        if (err) {
            reject(err);
        } else {            
            findID().then(result => {
                id = result["_id"];
                resolve(id);
            });
        }
    });
}

// get all words in vocabulary
exports.get = function (login, resolve, reject) {
    let result = mongo.Word.find({
        owner: login
    });
    resolve(result);
}

exports.deleteOne = function (data, resolve, reject) {
    mongo.Word.remove({
        "_id": data.body.id,
        "owner": data.session.user
    }, function (err) {
        if (err) {
            reject(err);
        } else {
            resolve("OK");
        }
    });

}