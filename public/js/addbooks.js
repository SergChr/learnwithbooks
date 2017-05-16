window.onload = function () {
    let submit = document.querySelector(".submit"),
        title = document.querySelector(".title"),
        description = document.querySelector(".description"),
        author = document.querySelector(".author"),
        bookSource = document.querySelector(".bookSource"),
        category = document.querySelector(".category"),
        imageSource = document.querySelector(".imageSource"),
        lang = document.querySelector(".lang");



    submit.onclick = function () {
        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/addbook", true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        let data = JSON.stringify({
            title: title.value,
            description: description.value,
            author: author.value,
            category: category.value,
            bookSource: bookSource.value,
            imageSource: imageSource.value,
            lang: lang.value
        });

        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                if (xhr.responseText == "OK") {
                   // window.location.href = "books";
                    console.log("Book added.");
                    title.value = '';
                    description.value = '';
                    author.value = '';
                    imageSource.value = '';
                    bookSource.value = '';
                }
            }
        }
        
    }

}