contenidoError = '';
contenidoError += "<tbody><tr>";
contenidoError += "<td scope='col'>Inicie sesión para ver los resultados...</td>";
contenidoError += "</tr></tbody>";

function login(email, password) {
    data = {email, password}

    var settings = {
        url: "/login",
        method: "POST",
        timeout: 0,
        contentType: "application/x-www-form-urlencoded",
        data
      };
      
      $.ajax(settings).done( async function(res) {
        usuario = res.usuario;
        if (res.ok) {
            $(mensaje).html("Bienvenido: "+res.usuario.nombre);
        }
        localStorage.setItem('token', res.token);

        setTimeout(() => {
            $(signIn).modal('hide');
        }, 3000);
      })
      .fail(function(err) {
        console.log(err.responseJSON);
        if (err.responseJSON.ok == false) {
            $(mensaje).html('Usuario o contraseña incorrectos');          
        }
      })
}

function listarUsuarios() {
    var token = localStorage.getItem('token');
    var settings = {
        url: "/usuario",
        method: "GET",
        timeout: 0,
        headers: {
            Authorization: token
          }
      };
      
    $.ajax(settings).done( function(res) {
        usuarios = res.usuarios;

        var contenido = '';
        contenido += "<thead><tr>";
        contenido += "<th scope='col'>nombre</th>";
        contenido += "<th scope='col'>email</th>";
        contenido += "</tr></thead>";
        
        contenido += "<tbody>";

        usuarios.forEach(usuario => {
            contenido += "<tr>";
    
            contenido += "<td>";
            contenido += usuario.nombre;
            contenido += "</td>";
            contenido += "<td>";
            contenido += usuario.email;
            contenido += "</td>";
    
            contenido = contenido + "</tr>";
        });
        contenido += "</tbody>";
        $(contenidoRespuesta).html(contenido);
    })
    .fail(function(err) {
        $(contenidoRespuesta).html(contenidoError);
    });
}

function listarProductos() {

    var token = localStorage.getItem('token');
    var settings = {
        url: "/producto",
        method: "GET",
        timeout: 0,
        headers: {
            Authorization: token
          }
      };
      
    $.ajax(settings).done( function(res) {
        productos = res.productos;
        contenido = '';

        contenido += "<thead><tr>";
        contenido += "<th scope='col'>nombre</th>";
        contenido += "<th scope='col'>Precio unitario</th>";
        contenido += "<th scope='col'>disponibilidad</th>";
        contenido += "</tr></thead>";
        
        contenido += "<tbody>";

        productos.forEach(producto => {
            contenido += "<tr>";
    
            contenido += "<td>";
            contenido += producto.nombre;
            contenido += "</td>";
            contenido += "<td>";
            contenido += producto.precioUni;
            contenido += "</td>";
            contenido += "<td>";
            contenido += producto.disponible;
            contenido += "</td>";
    
            contenido += "</tr>";
        });
        contenido += "</tbody>";
        $(contenidoRespuesta).html(contenido);

    })
    .fail(function(err) {
        $(contenidoRespuesta).html(contenidoError);
    });
}

function listarCategorias() {

    var token = localStorage.getItem('token');
    var settings = {
        url: "/categoria",
        method: "GET",
        timeout: 0,
        headers: {
            Authorization: token
          }
      };
      
    $.ajax(settings).done( function(res) {
        categorias = res.categorias;
        contenido = "";

        contenido += "<thead><tr>";
        contenido += "<th scope='col'>nombre</th>";
        contenido += "<th scope='col'>Usuario creador</th>";
        contenido += "</tr></thead>";

        contenido += "<tbody>";

        categorias.forEach(categoria => {
            contenido += "<tr>";
    
            contenido += "<td>";
            contenido += categoria.nombre;
            contenido += "</td>";
            contenido += "<td>";
            contenido += categoria.usuario.nombre;
            contenido += "</td>";
    
            contenido += "</tr>";
        });
        contenido += "</tbody>";
        $(contenidoRespuesta).html(contenido);
    })
    .fail(function(err) {
        $(contenidoRespuesta).html(contenidoError);
    });
}