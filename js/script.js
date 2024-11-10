const url ="https://japceibal.github.io/japflix_api/movies-data.json"
let listadoBusqueda = []
let listado

// Función para mostrar la lista de productos
function ListaPeliculas() {
    let AgregarLista = "";
    let AgregarContenedorSup="";

    for (let pelicula of listadoBusqueda) {
        let calificacion=""
        let estrellasCompletas = Math.floor(pelicula.vote_average / 2);
        let estrellasVacias = 5 - estrellasCompletas; // Para un total de 5 estrellas

        // Generar estrellas llenas
        for (let i = 0; i < estrellasCompletas; i++) {
        calificacion += `<span class="fa fa-star checked"></span>`;
        }

        // Generar estrellas vacías
        for (let i = 0; i < estrellasVacias; i++) {
         calificacion += `<span class="fa fa-star"></span>`;
        }
       
        AgregarLista += `
          <li class="list-group-item d-flex justify-content-between align-items-start"  data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
            <div class="ms-2 me-auto">
             <div class="fw-bold">${pelicula.title}</div>
             ${pelicula.tagline}
           </div>${calificacion}
           </li>`

        
    }
    document.getElementById("lista").innerHTML = AgregarLista;

    // Agregar evento de clic a cada elemento de la lista
    document.querySelectorAll("#lista .list-group-item").forEach(item => {
      item.addEventListener("click", function() {

      });
  });
}

 

function ListaPeliculas() {
    let AgregarLista = "";

    for (let pelicula of listadoBusqueda) {
        let calificacion = "";
        let estrellasCompletas = Math.floor(pelicula.vote_average / 2);
        let estrellasVacias = 5 - estrellasCompletas;

        // Generar estrellas llenas
        for (let i = 0; i < estrellasCompletas; i++) {
            calificacion += `<span class="fa fa-star checked"></span>`;
        }

        // Generar estrellas vacías
        for (let i = 0; i < estrellasVacias; i++) {
            calificacion += `<span class="fa fa-star"></span>`;
        }
       
        AgregarLista += `
          <li class="list-group-item d-flex justify-content-between align-items-start" data-index="${listadoBusqueda.indexOf(pelicula)}">
            <div class="ms-2 me-auto">
              <div class="fw-bold">${pelicula.title}</div>
              ${pelicula.tagline}
            </div>${calificacion}
          </li>`;
    }

    document.getElementById("lista").innerHTML = AgregarLista;

    // Agregar evento de clic a cada elemento de la lista
    document.querySelectorAll("#lista .list-group-item").forEach((item, index) => {
      item.addEventListener("click", function() {
          mostrarDetallesPelicula(listadoBusqueda[index]);
      });
  });
}


function mostrarDetallesPelicula(pelicula) {
    let generos = pelicula.genres.map(genero => genero.name).join(' - ');
    const anio=pelicula.release_date.split("-")[0]
    let contenedorSup = `
        <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasTopLabel">${pelicula.title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              ${pelicula.overview}
              <hr>
             <div class="d-flex justify-content-between align-items-center">
             <div>
              Géneros: ${generos}
             </div>
             <div class="dropdown">
               <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                 Opciones
               </button>
               <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                 <li><a class="dropdown-item" href="#">Year: ${anio}</a></li>
                 <li><a class="dropdown-item" href="#">Runtime: ${pelicula.runtime}</a></li>
                 <li><a class="dropdown-item" href="#">Budget: $${pelicula.budget}</a></li>
                 <li><a class="dropdown-item" href="#">Revenue: $${pelicula.revenue}</a></li>
               </ul>
             </div>
           </div>
           </div>
          </div>
          `;
    
    document.getElementById("contenedorSup").innerHTML = contenedorSup;
    // Muestra el contenedor offcanvas
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasTop'));
    offcanvas.show();
}

let getJSONData = function(url){
    let result = {};

    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
       
        return result;
    });
}

document.addEventListener("DOMContentLoaded", function(){
    const btn=document.getElementById("btnBuscar")
    const inputbuscar=document.getElementById("inputBuscar")

    getJSONData(url).then(function(resultObj) {
     if (resultObj.status === "ok") {
         listado = resultObj.data;
     }
    });
      
    btn.addEventListener("click", () => {
        const busqueda = inputbuscar.value.toLowerCase();

        // Filtrar los productos basados en el término de búsqueda
        listadoBusqueda = listado.filter((pelicula) => {
          let generos = "";
          for (let genero of pelicula.genres) {
              generos += `${genero.name}-`;
          }
            return pelicula.title.toLowerCase().includes(busqueda) || generos.toLowerCase().includes(busqueda) 
            || pelicula.tagline.toLowerCase().includes(busqueda) || pelicula.overview.toLowerCase().includes(busqueda);
        });

        ListaPeliculas();  
    });

})
