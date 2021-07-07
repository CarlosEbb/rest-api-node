//librerias
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const fetch = require("node-fetch");
const FormData = require('form-data');
const base64 = require('base-64');

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
const postPeticion = async (tipo_respuesta, tipo_doc, iddoc, nombre_apellido, ciudad, fecha, clave, valorClave, token, campo) => {
  try {
    const formulario = new FormData();
    formulario.append("tipo_respuesta", 'PDF');
    formulario.append("tipo_doc", '1');
    formulario.append("iddoc", 'test1');
    formulario.append("nombre_apellido", 'Este es un nombre de prueba');
    formulario.append("ciudad", 'HUNCAYO');

    const res = await fetch(
      url,
      {
        headers: new fetch.Headers({
          "Authorization": `Basic ${base64.encode(`${login}:${password}`)}`
        }),
        method: "POST",
        body: JSON.stringify(
          {"tipo_respuesta":tipo_respuesta,"tipo_doc":tipo_doc,"iddoc":iddoc,"nombre_apellido":nombre_apellido,"ciudad":ciudad,"fecha":fecha, "clave":clave,"valorClave":valorClave,"token":token,"campo":campo}
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

//Rutas
app.post('/', async(req, res)=>{
  const data = req.body;
  const info = await postPeticion(data.tipo_respuesta,data.tipo_doc,data.iddoc,data.nombre_apellido,data.ciudad,data.fecha,data.clave,data.valorClave,data.token,data.campo);
  res.json(info)
})

app.listen(port, () => {
  console.log(`Server on port http://localhost:${port}`);
})
