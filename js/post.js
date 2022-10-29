var url_string = window.location.href;
var url = new URL(url_string);
var postId = url.searchParams.get("id");

var options = {year: 'numeric', month: 'long', day: 'numeric' }; //Para formatear las fechas

fetch(`http://localhost:3000/posts/?id=${postId}`)
    .then(response => {
        if(response.ok) {
            return response.json();   
        }
        return Promise.reject(response)
    })
    .then( post => {
        let postTitle = post[0].title;              //Título del post
        document.getElementById("title").innerHTML = postTitle;
        let postDate = new Date(post[0].date);      //Fecha del post
        document.getElementById("postDate").innerHTML = postDate.toLocaleDateString("es-ES", options);
        let postContent = post[0].content;          //Contenido del post
        document.getElementById("postContent").innerHTML = postContent;
        let authorId = post[0].authorId;            //Id del autor del post para usarlo en la siguiente peticion
        return fetch(`http://localhost:3000/users?id=${authorId}`) 
    })
    .then(response => {
        if(response.ok) {
            return response.json();   
        }
        return Promise.reject(response)
    })
    .then( user =>{
        let authorName = user[0].name;      //Nombre del autor del post
        document.getElementById("authorName").innerHTML = authorName;
        return fetch(`http://localhost:3000/users`) 
    })
    .then(response => {
        if(response.ok) {
            return response.json();   
        }
        return Promise.reject(response)
    })
    .then( users =>{
        var sel = document.getElementById('usersSelect');
        console.log("entra");
        for(let j of users) {
            var opt = document.createElement('option');
            let username = j.name; //Nombre de cada usuario
            opt.innerHTML = username;
            opt.value = j.id;
            sel.appendChild(opt);
        }
        console.log(postId)
        return fetch(`http://localhost:3000/comments/?postId=${postId}`)
    })
    .then(response => {
        if(response.ok) {
            return response.json();   
        }
        return Promise.reject(response)
    })
    .then( comments =>{
        for(let j of comments) {
            fetch(`http://localhost:3000/users?id=${j.authorId}`)
                .then(response => {
                    if(response.ok) {
                        return response.json();   
                    }
                    return Promise.reject(response)
                })
                .then( userComment =>{
                    let authorCommentName = userComment[0].name;
                    let postDate = new Date(j.date);
                    let bodyComment = j.body;
                    
                    let row = `<div class="comment"><p>Autor: ${authorCommentName}</p><p>Fecha de publicación: ${postDate.toLocaleDateString("es-ES", options)}</p><p>${bodyComment}</p></div>`;
                    document.getElementById("comments").innerHTML += row;
                })
                .catch(err => {
                    console.log("Error en la petición HTTP: " + err.message);
                })
        }
    })
    .catch(err => {
        console.log("Error en la petición HTTP: " + err.message)
    })







//Validación formulario

const form = document.querySelector('#addComment');
const authorIdEl = document.querySelector('#usersSelect');
const bodyComment = document.getElementById('bodyComment');






const checkBodyComment = () => {
    let valid = false;

    let body = bodyComment.value;
    if (!isRequired(body)) {
        showError(bodyComment, 'Texto requerido.');
    } else {
        showSuccess(bodyComment);
        valid = true;
    }
    return valid;
};

const isRequired = value => value === '' ? false : true;

const showError = (input, message) => {
    // get the form-field element
    const formField = input.parentElement;
    // add the error class
    formField.classList.remove('success');
    formField.classList.add('error');

    // show the error message
    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    // get the form-field element
    const formField = input.parentElement;

    // remove the error class
    formField.classList.remove('error');
    formField.classList.add('success');

    // hide the error message
    const error = formField.querySelector('small');
    error.textContent = '';
}

form.addEventListener('submit', function (e) {
    // prevent the form from submitting
    e.preventDefault();

    // validate fields
    let isBodyCommentValid = checkBodyComment();

    let isFormValid = isBodyCommentValid;

    // submit to the server if the form is valid
    if (isFormValid) {
        let body = bodyComment.value;
        let authorId = authorIdEl.value;
        let newPostId = postId;
        const today = new Date().toISOString().slice(0, 10);

        let newComment = {body: body, authorId: authorId, postId: newPostId, date: today};
        
        fetch('http://localhost:3000/comments', {
            method: 'POST',
            body: JSON.stringify(newComment),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(response.ok) {
                console.log("Comentario añadido");
                bodyComment.value = '';
                return response.json();
            }
            return Promise.reject(response)
        })
        .then(datos => datosServidor = datos)
        .catch(err => {
            console.log("Error al añadir el comentario");
            console.log("Error en la petición HTTP: " + err.message);
        })
    }      
});


const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

form.addEventListener('input', debounce(function (e) {
    switch (e.target.id) {
        case 'body':
            checkBodyComment();
            break;
    }
}));


