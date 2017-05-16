window.onload = function () {
    
    let word = document.querySelector(".word"),
        vocabularyBox = document.querySelector(".vocabularyBox"),
        add = document.querySelector(".addWordIcon"),
        original = document.getElementById("original"),
        translated = document.getElementById("translated"),
        addBut = document.getElementById("add"),
        addCover = document.querySelector(".addCover"),
        lang = document.getElementById("lang");

    let x = document.querySelectorAll(".x");
    updateX();

    function updateX() {
        x = document.querySelectorAll(".x");
        for (let i = 0; i < x.length; i++) {
            
            x[i].onclick = function () {
               // console.log("x clicked")
                let data = JSON.stringify({
                    id: x[i].parentElement.getAttribute("data-id")
                });
                let xhr = new XMLHttpRequest();
                xhr.open("POST", "/vocabulary/deleteOne", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(data);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState != 4) return;
                    if (xhr.status != 200) {
                        console.log(xhr.status + ': ' + xhr.statusText);
                    } else {
                       //  console.log(xhr.responseText+": deleted");
                        vocabularyBox.removeChild(x[i].parentElement);
                    }
                }
            }
        }

        add.onclick = function () {
           // addCover.style.visibility = "visible";
            addCover.classList.toggle("visible");
        }

        addBut.onclick = function () {
            
            let data = JSON.stringify({
                original: original.value,
                translated: translated.value,
                lang: lang.value
            });
            
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "/vocabulary/add", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(data);
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;
                if (xhr.status != 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {
                    //id from mongodb
                    let dataId = xhr.responseText;
                    dataId = dataId.substring(1,dataId.length-1);
                    //console.log(dataId);
                    let div = document.createElement("div"),
                        orig = document.createElement("div"),
                        tr = document.createElement("div"),
                        x = document.createElement("div");

                    div.classList.add("word");
                    div.setAttribute("data-id", dataId);

                    orig.classList.add("original");
                    tr.classList.add("translated");
                    x.classList.add("x");

                    orig.innerHTML = original.value;
                    tr.innerHTML = translated.value;
                    x.innerHTML = "x";

                    div.appendChild(orig);
                    div.appendChild(tr);
                    div.appendChild(x);

                    vocabularyBox.appendChild(div);

                    // hide adding form after add word
                    setTimeout(function () {
                        addCover.style.visibility = "hidden";
                    }, 500); // with 500ms delay

                    // update close icons (x)
                    updateX();
                }
            }

        }

    }
}