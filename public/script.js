document.addEventListener('DOMContentLoaded', async function(){
    await obtenerDatosRickAndMorty();

    document.querySelector('#siguientePagina').addEventListener('click', async function() {
        await obtenerSiguientePagina();
        // Desplazar la página al principio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelector('#buscarPersonaje').addEventListener('click', function() {
        const searchTerm = document.querySelector('#searchTerm').value.trim();
        if (searchTerm) {
            buscarPersonaje(searchTerm);
        } else {
            alert('Ingrese un nombre para buscar.');
        }
    });
    document.querySelector('#searchTerm').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const searchTerm = document.querySelector('#searchTerm').value.trim();
            if (searchTerm) {
                buscarPersonaje(searchTerm);
            } else {
                alert('Ingrese un nombre para buscar.');
            }
        }
    });
});

let urlSiguiente = null;

async function obtenerDatosRickAndMorty(url = 'http://localhost:3000/personajes') {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('Error al obtener datos de personajes:', data.error);
            return;
        }

        console.log('Datos de personajes:', data);
        mostrarDatosEnResultado(data);

        // Actualizar la URL de la siguiente página
        urlSiguiente = data.info.next;
    } catch (error) {
        console.error('Error al obtener datos de personajes:', error);
    }
}

async function buscarPersonaje(searchTerm) {
    try {
        const apiUrl = `http://localhost:3000/buscar?q=${searchTerm}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            console.error('Error en la búsqueda:', data.error);
            alert('No se encontraron resultados para el personaje.');
        } else {
            console.log('Resultado de búsqueda:', data);
            mostrarDatosEnResultado(data);
        }
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        alert('Error en la búsqueda. Por favor, inténtelo de nuevo.');
    }
}

function traducirValor(valor) {
    const traducciones = {
        'Male': 'Masculino',
        'Female': 'Femenino',
        'unknown': 'Desconocido',
        'Alive': 'Vivo',
        'Dead': 'Muerto',
        'unknown': 'Desconocido',
        'Human' :'Humano',
        'Gender' :'Genero',
        'Species':'Especie'
    };

    return traducciones[valor] || valor;
}

function mostrarDatosEnResultado(dataArray) {
    let resultado = document.querySelector('#resultado');
    resultado.innerHTML = '';

    if (dataArray.results && Array.isArray(dataArray.results) && dataArray.results.length > 0) {
        dataArray.results.forEach(character => {
            const episodiosHTML = character.episode.map(episode => {
                // Extraer el número del episodio de la URL
                const numeroEpisodio = episode.split('/').pop();
                return `<li><a href="${episode}">${numeroEpisodio}</a></li>`;
            }).join('');

            resultado.innerHTML += `
                <div class="character">
                    <h3>${character.name}</h3>
                    <p>Status: ${traducirValor(character.status)}</p>
                    <p>Species: ${traducirValor(character.species)}</p>
                    <p>Gender: ${traducirValor(character.gender)}</p>
                    <img src="${character.image}" alt="${character.name}">
                    <p>Episodes:</p>
                    <button class="mostrar-episodios">Mostrar Episodios</button>
                    <ul class="episodios" style="display: none;">
                        ${episodiosHTML}
                    </ul>
                </div>
                <hr>
            `;
        });

        // Agregar manejador de eventos para cada botón "Mostrar Episodios"
        document.querySelectorAll('.mostrar-episodios').forEach(btn => {
            btn.addEventListener('click', function() {
                const episodiosContainer = this.nextElementSibling;
                episodiosContainer.style.display = episodiosContainer.style.display === 'none' ? 'block' : 'none';
            });
        });
    } else {
        console.error('No se encontraron resultados para la búsqueda.');
    }
}

async function obtenerSiguientePagina() {
    if (urlSiguiente) {
        await obtenerDatosRickAndMorty(urlSiguiente);
    } else {
        console.log('No hay más páginas disponibles.');
    }
}
