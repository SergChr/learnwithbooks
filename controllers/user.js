let mongo = require("./mongo");
let md5 = require("md5");

// `sign up` and `log in` function
exports.check = function (req, resolve, reject) {
    let res;
    let login = req.body.login,
        password = req.body.password;
    //console.log(login+" : "+password);

    //check if exist user
    mongo.User.findOne({ login: login }, function(err, user){
        if(err){
            // error in query
            reject(err);
        } else {
            // doesn't have error
            // user found
            if(user) {
                if(md5(password) == user["password"]) {
                    resolve("Login"); // say `it's ok, log in this guy`
                } else {
                    reject("Incorrect login/password");
                }
            } else {
                // if user doesn't exist, I register him
                // new model
            let newUser = new mongo.User({ login: login, password: md5(password) });
            newUser.save(function(err){
                if(err) {
                    reject(err);
                    console.log("error with saving");
                } else {
                    resolve("Signup"); // say `ok, I register him`
                }
            });
            }
        }
    });
}