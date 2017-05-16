var express = require('express');
var router = express.Router();
var path = require("path");
var bodyParser = require('body-parser');
var user = require("../controllers/user");
var book = require("../controllers/book");
var vocabulary = require("../controllers/vocabulary");
var mongoose = require("mongoose");
mongoose.Promise = Promise;

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

router.use(session({
    secret: "session",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true
}));


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/* GET home page. */
router.get('/auth', function(req, res, next) {
    if(req.session.user) {
        res.redirect("books");
    }
  res.render('auth', { title: 'Auth' });
});

router.post("/login", function(req, res, next){
    
    function userCheck(req){
        return new Promise(function(resolve, reject){
            user.check(req, resolve, reject);
        });
    }
    
    userCheck(req).then(result => {
       // console.log("promise result");
        req.session.user = req.body.login;
        res.send(result);
        res.send(req.session.user);
    }, error => {
      //  console.log("promise error");
        res.send(error);
    });
});

router.get("/addbook", function(req, res, next){
    if(req.session.user){
        res.render("addbook", { title: "Add book to DB", login: req.session.user });
    } else {
        res.render("error", { title: "Error", error: "Please, login to see this page" });
    }
    
});

router.post("/addbook", function(req, res, next){
    function addBook(req){
        return new Promise(function(resolve, reject){
            book.add(req, resolve, reject);
        });
    }
    
    addBook(req).then(result => {
       // console.log("promise result");
        res.send(result);
    }, error => {
      //  console.log("promise error");
        res.send(error);
    });
});

router.get("/books", function(req, res, next){
   if(req.session.user) {
       function getBook(){
           return new Promise(function(resolve, reject){
               book.get(resolve, reject);
           });
       }
       
       getBook().then(result => {
           res.render("books", { title: "Books", books: result, login: req.session.user });
       });
      // res.render("books", { title: "Books", books: books });
   } else {
       res.render("error", { title: "Errror", error: "Please, login to see this page" });
   }
});


router.get("/read/:url", function(req, res, next){
    var url = decodeURIComponent(req.params.url);
    getBook(url).then(result =>{
        res.render("read", { title: "Read", login: req.session.user, url: req.params.url, book: result});
    })
   // res.render("read", { title: "Read", login: req.session.user, url: req.params.url, book: result});
    
    function getBook(bookUrl){
           return new Promise(function(resolve, reject){
               book.getOne(bookUrl, resolve, reject);
           });
       }
});

router.post("/vocabulary/add", function(req, res, next){
    function add(data){
           return new Promise(function(resolve, reject){
               vocabulary.add(data, resolve, reject);
           });
       }
    var or = req.body.original,
        tr = req.body.translated,
        lang = req.body.lang,
        owner = req.session.user,
        data = JSON.stringify({ original: or, translated: tr,
                              lang: lang, owner: owner});
    
    add(data).then(result => {
        res.send(result);
    }, error => {
        res.send(error);
    });
});

router.get("/vocabulary", function(req, res, next){
    if(req.session.user) {
        getWords(req.session.user).then(result =>{
            res.render("vocabulary", { title: req.session.user+"'s vocabulary", words: result, login: req.session.user });
        }, error =>{
            res.send(error);
        });
        
        function getWords(userLogin){
            return new Promise(function(resolve, reject){
                vocabulary.get(userLogin, resolve, reject);
            }); 
        }
    } else {
        res.render("error", { title: "Error", error: "Please, login to see this page." });
    }
});

router.post("/vocabulary/deleteOne", function(req, res, next){
    if(req.session.user){
        deleteOne(req).then(result => {
            res.send(result);
        }, error =>{
            res.send(error);
        });
        
        function deleteOne(request){
            return new Promise(function(resolve, reject){
                vocabulary.deleteOne(request, resolve, reject);
            });
        }
    } else {
        res.send("Error. Need to login.");
    }
});

router.get("/books/search/:string", function(req, res, next){
    var string = req.params.string;
    
    getBy(string).then(result =>{
        res.render("books", { title: string, login: req.session.user, books: result });
    }, err =>{
        res.send("Not matched books.");
    })
    
    function getBy(string){
        return new Promise(function(resolve, reject){
            book.getBy(string, resolve, reject);
        })
    }
});

// sort books by category
router.get("/books/:category", function(req, res, next){
  // just render `books` page with other books, mathed by selected category
    getByCategory(req.params.category).then(result => {
        res.render("books", { title: req.params.category, login: req.session.user, books:result });
    }, err => {
        res.send(err);
    });
    
    function getByCategory(category){
        return new Promise(function(resolve, reject){
            book.getByCategory(category, resolve, reject);
        })
    }
});

router.get("/books/lang/:lang", function(req, res, next){
    
    getByLang(req.params.lang).then(result => {
        res.render("books", { title: req.params.lang+" books", login: req.session.user, books: result });
    }, err => {
        // if we don't have any books in this lang
        res.send("Not mathed books in this language.");
    });
    
    function getByLang(lang){
        return new Promise(function(resolve, reject){
           book.getByLang(lang, resolve, reject); 
        });
    }
});

router.get("/session/destroy", function(req, res, next){
    req.session.destroy();
   // console.log("POST to session/destroy");
    res.redirect("/login");
});

module.exports = router;
