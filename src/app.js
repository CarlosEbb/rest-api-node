//librerias
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const fetch = require("node-fetch");
const FormData = require('form-data');
const base64 = require('base-64');
const basicAuth = require('express-basic-auth');

//Basic Auth Y Rutas de acceso
const login = 'GrupoMuya';
const password = 'GrupoMuya.2021';
//const url = 'https://digitaldocsgrupomuya.sybven.com/muya/muya'; //produccion
const url = 'https://localhost/muya/muya'; //testLocal
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' //solo local

//Servidor
const app = express();
const port = 3000;

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

//peticiones
const postPeticion = async (data) => {
  try {
    const res = await fetch(
      url,
      {
        headers: new fetch.Headers({
          "Authorization": `Basic ${base64.encode(`${login}:${password}`)}`
        }),
        method: "POST",
        body: JSON.stringify(
          data
        ),
      }
    );

    const response = await res.json();

    return response;
  } catch (error) {
    console.log(
      "Error",
      error
    );
  }
};

//peticion de Basic Auth
app.use(basicAuth({
  users: { 'GrupoMuya' : 'GrupoMuya.2021' },
  unauthorizedResponse: getUnauthorizedResponse
}))

function getUnauthorizedResponse(req) {
  return req.auth
      ? ('No autorizado')
      : 'No se proporcionaron credenciales o Access denied'
}

const parametros = ["tipo_respuesta", "tipo_doc", "iddoc", "nombre_apellido", "ciudad", "fecha", "clave", "valorClave", "token", "campo"];


//Rutas
app.post('/', async(req, res)=>{
  const data = new Object();
  let verificar = true;

  parametros.forEach(function(element) {
    if (req.body[element] !== undefined) {
      data[element] = req.body[element];
    }else{
      verificar = false;
      error = {error: 'No se recibio el valor '+element};
      res.json(error);
    }
    
  });
  //console.log(JSON.stringify(data));

  if(verificar){
    const info = await postPeticion(data);
    res.json(info)
  }
})

app.get('/', function(req, res) {
  res.send('Access denied');
});

app.listen(port, () => {
  console.log(`Server on port http://localhost:${port}`);
})
