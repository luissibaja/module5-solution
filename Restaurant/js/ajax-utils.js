(function (global) { //Imnediatly invoque function expresion  IIFE, 

// Set up a namespace for our utility
var ajaxUtils = {}; // empty object que se usa para exponer los metodos, namespace


// Returns an HTTP request object
function getRequestObject() { //esta funcion no se expone, es privada
  if (window.XMLHttpRequest) {   //chequea el tipo de objeto disponible para usar, 
    return (new XMLHttpRequest()); // el Ajax mas comun y estandar
  } 
  else if (window.ActiveXObject) {// For very old IE browsers (optional)
    return (new ActiveXObject("Microsoft.XMLHTTP"));
  } 
  else {
    global.alert("Ajax is not supported!");
    return(null); 
  } 
}

//var request = getRequestObject(); se podrian hacer las variables globales para no pasarlas a las funciones, pero hay que recordar que es ASYNC, mas de una cosa se ejecuta a la vez. 
//es decir este metodo podria llamarse mas de una vez y se produciria un race condition en donde compiten por el recurso y solo uno gana, lo que produce un demadre.
// Makes an Ajax GET request to 'requestUrl'
ajaxUtils.sendGetRequest =  //esta funcion es publica, pues se agrega a ajaxUtils
  function(requestUrl, responseHandler,isJsonResponse) { //requestURL es el server que le voy a pedir data, responseHandler es un puntero a quien va a manjejar la respuesta del server, se le agrega un parametro isJsonresponse para saber si se pide o no JSON
    var request = getRequestObject(); //Funcion descrita anteriormente new XMLHttpRequest()
    request.onreadystatechange =  //se crea una funcion que revisa el estado de la comunicacion entre el browser y el server, se llama cada vez que pasa algo en la comunicacion
      function() { //cuando server envia la respuesta, esta es la funcion que se llama
        handleResponse(request, responseHandler,isJsonResponse); // se llama la funcion que procesa la respuesta
      };
    request.open("GET", requestUrl, true); // que metodo, en este caso GET, se le pasa el URL, y true, si se pasa false, se vuelve syncrono, es decir espera hasta que le responda el server
    request.send(null); //  ejecuta el request, null para GET, cuando es post los parametros del resquestURL deben ser pasados aqui en string o como objeto
  }; //tiene un punto y comoa y no un (), pues es solo la definicion de la funcion


// Only calls user provided 'responseHandler'
// function if response is ready
// and not an error
function handleResponse(request, responseHandler,isJsonResponse) //recibe por parametro el request y una funcion que es la que va a trabajar con la respuesta
{
  if ((request.readyState == 4) && //esta listo?
     (request.status == 200)) { //el estatus es OK?
    //Default to isJsonresponse to true
     if (isJsonResponse==undefined) {
       responseHandler(JSON.parse(request.responseText));
     }
     else {
      responseHandler(request.responseText); //se llama la funcion que procesa la respuesta con el request.
    }
  }
}

// Expose utility to the global object
global.$ajaxUtils = ajaxUtils; //se expone las utilities para global, se le pone $ solo para fancy.


})(window); // se pasa el window object para hacerlog global

