var options = {year: 'numeric', month: 'long', day: 'numeric' }; //Para formatear las fechas

fetch('http://localhost:3000/posts')
    .then(response => {
        if(response.ok) {
            return response.json();   
        }
        return Promise.reject(response)
    })
    .then( posts =>{
        let postList = document.getElementById("listPost");
        for(let i of posts) {
            fetch(`http://localhost:3000/users?id=${i.authorId}`)
                .then(response => {
                    if(response.ok) {
                        return response.json();   
                    }
                    return Promise.reject(response)
                })
                .then( user =>{
                    let AuthorName = user[0].name;
                    let postDate = new Date(i.date);
                    let row = `<ul><a href="./post.html?id=${i.id}"><li id="title">${i.title} </li><li> Fecha: ${postDate.toLocaleDateString("es-ES", options)}</li><li> Autor: ${AuthorName} </li></a></ul>`;
                    postList.innerHTML += row;
                    console.log("Petición acabada");
                })
                .catch(err => {
                    console.log("Error en la petición HTTP: " + err.message);
                })
        }
    })
    .catch(err => {
        console.log("Error en la petición HTTP: " + err.message);
    })