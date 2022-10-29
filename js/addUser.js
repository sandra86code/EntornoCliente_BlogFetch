

const usernameEl = document.querySelector('#username');
const nicknameEl = document.querySelector('#nickname');
const form = document.querySelector('#addUser');


const checkUsername = () => {

    let valid = false;

    const min = 3,
        max = 25;

    const username = usernameEl.value.trim();

    if (!isRequired(username)) {
        showError(usernameEl, 'El nombre de usuario no puede estar vacío.');
    } else if (!isBetween(username.length, min, max)) {
        showError(usernameEl, `El nombre de usuario debe tener entre ${min} y ${max} caracteres.`)
    } else {
        showSuccess(usernameEl);
        valid = true;
    }
    return valid;
};

const checkNickName = () => {

    let valid = false;

    const min = 3,
        max = 25;

    const nickname = nicknameEl.value.trim();

    if (!isRequired(nickname)) {
        showError(nicknameEl, 'El nombre de usuario no puede estar vacío.');
    } else if (!isBetween(nickname.length, min, max)) {
        showError(nicknameEl, `El nombre de usuario debe tener entre ${min} y ${max} caracteres.`)
    } else {
        showSuccess(nicknameEl);
        valid = true;
    }
    return valid;
};

const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;


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
    let isUsernameValid = checkUsername(),
        isNicknameValid = checkNickName();

    let isFormValid = isUsernameValid &&
        isNicknameValid;

    // submit to the server if the form is valid
    if (isFormValid) {
        let username = usernameEl.value;
        let nickname = nicknameEl.value;
        let user = {name: username, nick: nickname};
        fetch('http://localhost:3000/users', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(response.ok) {
                console.log("Usuario añadido");
                usernameEl.value=''
                nicknameEl.value=''
                return response.json();
            }
            return Promise.reject(response)
        })
        .then(datos => datosServidor = datos)
        .catch(err => {
            console.log("Error al añadir usuario");
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
        case 'username':
            checkUsername();
            break;
        case 'nickname':
            checkNickName();
            break;
    }
}));