const pantalla = document.getElementById("pantalla");

let entrada = "0";
let acumulado = null;
let operador = null;
let esperando = false;
let error = false;

function mostrar(valor = entrada) {
  pantalla.textContent = valor;
}

function formatear(numero) {
  if (!Number.isFinite(numero)) return "Error";
  return String(parseFloat(numero.toPrecision(12)));
}

function reiniciar() {
  entrada = "0";
  acumulado = null;
  operador = null;
  esperando = false;
  error = false;
}

function mostrarError() {
  reiniciar();
  error = true;
  mostrar("Error");
}

function aplicar(a, b, op) {
  let resultado;

  switch (op) {
    case "+":
      resultado = a + b;
      break;
    case "−":
      resultado = a - b;
      break;
    case "×":
      resultado = a * b;
      break;
    case "÷":
      if (b === 0) return null;
      resultado = a / b;
      break;
    default:
      return null;
  }

  return Number.isFinite(resultado) ? resultado : null;
}

function ingresarDigito(digito) {
  if (error) reiniciar();

  if (esperando) {
    entrada = digito;
    esperando = false;
  } else {
    entrada = entrada === "0" ? digito : entrada + digito;
  }

  mostrar();
}

function ingresarDecimal() {
  if (error) reiniciar();

  if (esperando) {
    entrada = "0.";
    esperando = false;
  } else if (!entrada.includes(".")) {
    entrada += ".";
  }

  mostrar();
}

function elegirOperador(op) {
  if (error) return;

  if (operador !== null && !esperando) {
    const resultado = aplicar(acumulado, parseFloat(entrada), operador);
    if (resultado === null) {
      mostrarError();
      return;
    }
    acumulado = resultado;
    entrada = formatear(resultado);
    mostrar();
  } else if (acumulado === null) {
    acumulado = parseFloat(entrada);
  }

  operador = op;
  esperando = true;
}

function calcularIgual() {
  if (error || operador === null) return;

  const resultado = aplicar(acumulado, parseFloat(entrada), operador);
  if (resultado === null) {
    mostrarError();
    return;
  }

  entrada = formatear(resultado);
  acumulado = null;
  operador = null;
  esperando = true;
  mostrar();
}

function borrarTodo() {
  reiniciar();
  mostrar();
}

function borrarDigito() {
  if (error) {
    borrarTodo();
    return;
  }

  if (esperando) return;

  if (entrada.length <= 1 || (entrada.length === 2 && entrada.startsWith("-"))) {
    entrada = "0";
  } else {
    entrada = entrada.slice(0, -1);
  }

  mostrar();
}

function ejecutarBoton(boton) {
  if (boton.dataset.accion) {
    switch (boton.dataset.accion) {
      case "limpiar":
        borrarTodo();
        break;
      case "decimal":
        ingresarDecimal();
        break;
      case "igual":
        calcularIgual();
        break;
    }
    return;
  }

  const valor = boton.dataset.valor;
  if (!valor) return;

  if (/^[0-9]$/.test(valor)) {
    ingresarDigito(valor);
  } else {
    elegirOperador(valor);
  }
}

document.querySelectorAll(".teclado button").forEach((boton) => {
  boton.addEventListener("click", () => ejecutarBoton(boton));
});

function botonParaTecla(evento) {
  const tecla = evento.key;

  if (/^[0-9]$/.test(tecla)) {
    return document.querySelector(`[data-valor="${tecla}"]`);
  }

  if (tecla === "." || tecla === ",") {
    return document.querySelector('[data-accion="decimal"]');
  }

  if (tecla === "+") {
    return document.querySelector('[data-valor="+"]');
  }

  if (tecla === "-") {
    return document.querySelector('[data-valor="−"]');
  }

  if (tecla === "*" || tecla === "x" || tecla === "X") {
    return document.querySelector('[data-valor="×"]');
  }

  if (tecla === "/") {
    return document.querySelector('[data-valor="÷"]');
  }

  if (tecla === "Enter" || tecla === "=") {
    return document.querySelector('[data-accion="igual"]');
  }

  if (tecla === "Escape" || tecla === "Delete") {
    return document.querySelector('[data-accion="limpiar"]');
  }

  return null;
}

function resaltar(boton) {
  if (!boton) return;
  boton.classList.add("pulsado");
  setTimeout(() => boton.classList.remove("pulsado"), 120);
}

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Backspace") {
    evento.preventDefault();
    if (error) {
      borrarTodo();
    } else {
      borrarDigito();
    }

    return;
  }

  const boton = botonParaTecla(evento);
  if (!boton) return;

  evento.preventDefault();
  resaltar(boton);
  ejecutarBoton(boton);
});
