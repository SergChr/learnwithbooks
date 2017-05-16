window.onload = function () {

    let loginInp = document.querySelector(".login"),
        passInp = document.querySelector(".password"),
        submitBut = document.querySelector(".submit");

    submitBut.style.width = passInp.clientWidth + "px"; // make button width equal to other inputs width
    
    submitBut.onclick = function () {
        //check inputs
        if (loginInp.value.length < 5 || passInp.value.length < 6) {
            loginInp.style.border = "1px solid red";
            passInp.style.border = "1px solid red";
            setTimeout(function () {
                loginInp.style.border = "1px solid #fff";
                passInp.style.border = "1px solid #fff";
            }, 500);
            return null;
        }
        
        let data = JSON.stringify({
            login: loginInp.value,
            password: passInp.value
        });
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/login", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                // console.log(xhr.responseText);
                if (xhr.responseText == "Login" || xhr.responseText == "Signup") {
                    window.location.href = "books";
                }
            }

        }
    }

}