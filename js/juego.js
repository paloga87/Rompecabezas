// VARIABLES 

// Arreglo que contiene las intrucciones del juego 
var instrucciones = ['Has click en  "Iniciar Juego"', 'Usando las flechas del teclado ↑ ↓ → ← mueve las fichas hasta conseguir organizar la figura', 'Trata de hacerlo en el menor tiempo y con la menor cantidad de movimeintos posibles'];

// Grilla
var grilla = [
[1, 2, 3],
[4, 5, 6],
[7, 8, 9]
];

// Posicion fila/columna Vacia
var filaVacia = 2;
var columnaVacia = 2;

//Registro de movimientos
var codigosDireccion = {
  IZQUIERDA: 37,
  ARRIBA: 38,
  DERECHA: 39,
  ABAJO: 40
}

var movimientos = [];

//FUNCIONES

//Instrucciones
function mostrarInstrucciones(instrucciones) {
  idLista = 'lista-instrucciones';
  for (var i = 0; i < instrucciones.length; i++){
    instruccion = instrucciones[i];
    mostrarInstruccionEnLista(instruccion, idLista);
  }
}

//Mostrar Instrucciones
function mostrarInstruccionEnLista(instruccion, idLista) {
  var ul = document.getElementById(idLista);
  var li = document.createElement("li");
  li.textContent = instruccion;
  ul.appendChild(li);
}

//Mezclar piezas
function mezclarPiezas(veces) {
  if (veces <= 0) {
    return;
  }
  
  var direcciones = [codigosDireccion.ABAJO, codigosDireccion.ARRIBA,
  codigosDireccion.DERECHA, codigosDireccion.IZQUIERDA
  ];

  var direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
  moverEnDireccion(direccion);

  setTimeout(function() {
    mezclarPiezas(veces - 1);
  }, 100);
}

//Cronometro
var cronometro;

function detenerse(){
  clearInterval(cronometro);
}
function carga() {
  var close = document.getElementById("botonInicio");
  close.classList.add("open");

  contador_s =0;
  contador_m =0;
  s = document.getElementById("segundos");
  m = document.getElementById("minutos");

  cronometro = setInterval(
    function(){
      if(contador_s==60)
      {
        contador_s=0;
        contador_m++;
        m.innerHTML = contador_m;

        if(contador_m==60)
        {
          contador_m=0;
        }
      }
      s.innerHTML = contador_s;
      contador_s++;
    }
    ,1000);  
}

//Registro de teclas
function capturarTeclas() {
  document.body.onkeydown = (function(evento) {
    if (evento.which === codigosDireccion.ABAJO ||
      evento.which === codigosDireccion.ARRIBA ||
      evento.which === codigosDireccion.DERECHA ||
      evento.which === codigosDireccion.IZQUIERDA) {

       // console.log(evento.which);
      moverEnDireccion(evento.which);
      ultimoMovimiento(evento.which);

      var gano = chequearSiGano();
      if (gano) {
        setTimeout(function() {
          mostrarCartelGanador();
        }, 500);
      }
      evento.preventDefault();
    }        
  })
}

//Registro de movimientos
function moverEnDireccion(direccion) {
  var nuevaFilaPiezaVacia;
  var nuevaColumnaPiezaVacia;

  // Mueve pieza hacia la abajo, reemplazandola con la blanca
  if (direccion === codigosDireccion.ABAJO) {
    nuevaFilaPiezaVacia = filaVacia - 1;
    nuevaColumnaPiezaVacia = columnaVacia;
  }

  // Mueve pieza hacia arriba, reemplazandola con la blanca
  else if (direccion === codigosDireccion.ARRIBA) {
    nuevaFilaPiezaVacia = filaVacia + 1;
    nuevaColumnaPiezaVacia = columnaVacia;
  }

  // Mueve pieza hacia la derecha, reemplazandola con la blanca
  else if (direccion === codigosDireccion.DERECHA) {
    nuevaColumnaPiezaVacia = columnaVacia  - 1;
    nuevaFilaPiezaVacia = filaVacia;
  }

  // Mueve pieza hacia la izquierda, reemplazandola con la blanca
  else if (direccion === codigosDireccion.IZQUIERDA) {

    nuevaColumnaPiezaVacia = columnaVacia  + 1;
    nuevaFilaPiezaVacia = filaVacia;
  }
  
  // console.log(nuevaColumnaPiezaVacia + ' ' + nuevaFilaPiezaVacia );
  
  
  if (posicionValida(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia) === true) {

    // console.log('posicion valida');

    intercambiarPosiciones(filaVacia, columnaVacia, nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
    actualizarPosicionVacia(nuevaFilaPiezaVacia, nuevaColumnaPiezaVacia);
  }
}


// Para chequear si la posicón está dentro de la grilla.
function posicionValida(fila, columna) {
  if (fila < 3 && columna < 3 && fila >= 0 && columna >= 0){
    return true;
  }
}

//Intercambio de Posiciones
function intercambiarPosiciones(fila1, columna1, fila2, columna2) {
  // Intercambio posiciones en la grilla
  var pieza1 = grilla[fila1][columna1];
  var pieza2 = grilla[fila2][columna2];

  intercambiarPosicionesGrilla(fila1, columna1, fila2, columna2);
  intercambiarPosicionesDOM('pieza' + pieza1, 'pieza' + pieza2);
}

function intercambiarPosicionesGrilla(filaPos1, columnaPos1, filaPos2, columnaPos2) {
  var grillaTemporal =  grilla[filaPos1][columnaPos1];
  grilla[filaPos1][columnaPos1] = grilla[filaPos2][columnaPos2];
  grilla[filaPos2][columnaPos2] = grillaTemporal;
}

// Actualiza la posición de la pieza vacía
function actualizarPosicionVacia(nuevaFila, nuevaColumna) {
  filaVacia = nuevaFila;
  columnaVacia = nuevaColumna;
}

//Actualizacion de ultimo movimiento en variable
function ultimoMovimiento(direccion){
  movimientos.push(direccion);         
  actualizarUltimoMovimiento(direccion);
}

/* Intercambio de posiciones de los elementos del DOM que representan
las fichas en la pantalla */
function intercambiarPosicionesDOM(idPieza1, idPieza2) {
  // Intercambio posiciones en el DOM
  var elementoPieza1 = document.getElementById(idPieza1);
  var elementoPieza2 = document.getElementById(idPieza2);

  var padre = elementoPieza1.parentNode;

  var clonElemento1 = elementoPieza1.cloneNode(true);
  var clonElemento2 = elementoPieza2.cloneNode(true);

  padre.replaceChild(clonElemento1, elementoPieza2);
  padre.replaceChild(clonElemento2, elementoPieza1);
}

//Actualizacion de ultimo movimiento en html
function actualizarUltimoMovimiento(direccion) {
  ultimoMov = document.getElementById('flecha');
  switch (direccion) {
    case codigosDireccion.ARRIBA:
    ultimoMov.textContent = '↑';
    break;
    case codigosDireccion.ABAJO:
    ultimoMov.textContent = '↓';
    break;
    case codigosDireccion.DERECHA:
    ultimoMov.textContent = '→';
    break;
    case codigosDireccion.IZQUIERDA:
    ultimoMov.textContent = '←';
    break;
  }
}

//Función para verificar si gano
function ordenado(numero, nume){
  return actual === nume--
}
function chequearSiGano() {
  var actual = 0;
  for (var i = 0; i < grilla.length; i++){
    for (var j = 0; j < grilla.length; j++){
      if ( grilla[i][j] === (actual + 1)) {
        actual++;   
      } if (grilla[i][j] === 9 & actual === 9){
        // console.log('ganaste');
        mostrarCartelGanador();
      }
    }
  }
}

// Alerta de juego ganado
function mostrarCartelGanador() {
  var element = document.getElementById("modal");
  detenerse();
  element.classList.add("in");
  var conteo = document.getElementById("cantidadMovimientos");
  conteo.textContent = movimientos.length;

}
function closeAlert() {
  var element = document.getElementById("modal");
  element.classList.remove("in");
}

// Funciones de inicio
function iniciar() {
  mostrarInstrucciones(instrucciones);
  mezclarPiezas(40);
  capturarTeclas(); 
}

// Ejecutamos la función iniciar
iniciar();


