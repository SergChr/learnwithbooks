setTimeout(function () {

    let search = document.getElementById("search"),
        searchBut = document.querySelector(".searchBut");

    searchBut.onclick = function () {
        console.log("search clicked.");
        window.location.href = "/books/search/" + search.value;
    }
    


}, 500);