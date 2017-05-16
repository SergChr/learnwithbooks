window.onload = function () {

    let height = document.documentElement.clientHeight,
        width = document.documentElement.clientWidth,
        book = document.querySelectorAll(".book"),
        img = document.querySelectorAll("img"),
        booksBox = document.querySelectorAll(".booksBox"),
        readBut = document.querySelectorAll(".read"),
        menubar = document.querySelector(".menubar"),
        barIcon = document.querySelector(".bars");
    
    for (let i = 0; i < readBut.length; i++) {
        readBut[i].onclick = function () {
            let url = readBut[i].getAttribute("data-value");
            window.location.href = "/read/" + encodeURIComponent(url);
        }
        
        img[i].style.width = book[i].clientWidth +"px";
        img[i].style.height = img[i].clientWidth +100 + "px";
    }
    
    barIcon.onclick = function() {
        menubar.classList.toggle("display");
    }
    
}