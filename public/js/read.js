window.onload = function () {

    let height = document.documentElement.clientHeight,
        width = document.documentElement.clientWidth,
        frame = document.querySelector(".frame"),
        translator = document.querySelector(".translator"),
        fromSelect = document.querySelector(".from"),
        toSelect = document.querySelector(".to"),
        text = document.querySelector(".text"),
        translateBut = document.querySelector(".translate"),
        resultDiv = document.querySelector(".result"),
        clearBut = document.querySelector(".clear"),
        addToVocBut = document.querySelector(".addToVoc"),
        bookinfoDiv = document.querySelector(".bookinfo"),
        imgDiv = document.querySelector(".img"),
        contentDiv = document.querySelector(".content"),
        embed = document.querySelector("embed"),
        ok =  document.querySelector(".ok"),
        google = document.querySelector(".googletranslate");
    
    embed.style.height = height*1.2 + "px";
    // some style magic
    document.body.style.overflowX = "hidden";
    frame.style.width = width - 100 + "px";
    frame.style.height = height*1.2 + "px";
   
    translator.style.width = width + "px";
    
    bookinfoDiv.style.width = width/1.5 + "px";
    imgDiv.style.width = bookinfoDiv.clientWidth/2.15 + "px";
    contentDiv.style.width = bookinfoDiv.clientWidth/2.15 + "px";
    document.querySelector("img").style.width = bookinfoDiv.clientWidth/3 + "px"; //img in imgDiv
    
    //

    window.onscroll = function () { // stick translator element on top
        let scrolled = window.pageYOffset || document.documentElement.scrollTop;
        if (scrolled > 0) {
            translator.style.position = "fixed";
            translator.style.top = "0px";
        } else if (scrolled == 0) {
            translator.style.position = "relative";
        }
    }

    translateBut.onclick = function () { //translate
        
        let xhr = new XMLHttpRequest(),
            fromTo = fromSelect.value + "-" + toSelect.value;
        
        xhr.open("POST", "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170514T074856Z.859a610ce471b0d8.88b5b81e38de6ef27fb0cd386c03c1a6bf2c3439", "true");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                let answer = xhr.responseText;
                answer = JSON.parse(answer);
                resultDiv.innerHTML = answer['text'].join("");

            }
        }


        xhr.send('text=' + text.value + '&lang=' + fromTo + '&format=plain');
    }
    clearBut.onclick = function() {
        text.value = "";
        resultDiv.innerHTML = "";
    }
    
    addToVocBut.onclick = function() {
        if(text.value == "") {
            return;
        }
        if(resultDiv.innerHTML == "") {
            return;
        }
        let original = text.value,
            translated = resultDiv.innerHTML,
            xhr = new XMLHttpRequest(),
            data = JSON.stringify({ original: original, translated: translated, lang: fromSelect.value });
        xhr.open("POST", "/vocabulary/add", true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
         xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                ok.style.visibility = "visible";
                setTimeout(function() {
                    ok.style.visibility = "hidden";
                }, 1000);
                
            }
        }
        // console.log(data);
         xhr.send(data);
    }
    
    google.onclick = function() {
        window.open("https://translate.google.ru/#"+ fromSelect.value +"/"+ toSelect.value +"/"+ text.value);
    }
    

}