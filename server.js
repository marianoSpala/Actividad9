const dotenv = require ('dotenv');
const express = require ('express');
const bodyParser = require ('body-parser');
const app = express();
const {leerFrutas, guardarFrutas} = require ('./src/frutasManager');
const PORT = process.env.PORT || 3000;
let DB = [];



// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
dotenv.config();
app.use(express.json());
app.use(bodyParser.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next)=> {
    DB = leerFrutas();
    next();
});


// Ruta principal que devuelve los datos de las frutas (agrege el metodo sort() para ordenar el array antes de mostrarlo)
app.get("/", (req, res) => {
    DB.sort((x, y) => x.id - y.id);
    guardarFrutas(DB);
    res.send(DB);
 });
 
//Ruta para agregar una fruta al arreglo
app.post('/', (req, res) => {
    try{
        const nuevaFruta = req.body;
        DB.push(nuevaFruta);
        guardarFrutas(DB);
        res.status(201).send('Fruta agregada!');
    }
    catch{
        res.status(404).send('Ha ocurrido un error!'); 
    }
});

//----------------------------------------------------------------------------------
//Ruta para modificar fruta con id
app.put("/:id", (req, res) => {
    try{
        let parametro = parseInt(req.params.id.trim(), 10);
        const modFruta = req.body;
       DB.splice(parametro - 1, 1, modFruta);
        guardarFrutas(DB);
        res.status(200).send('Fruta modificada!');
    }
    catch{
        res.status(404).send('Ha ocurrido un error!'); 
    }
 });
//Ruta para eliminar fruta con id........ agrego un objeto vacio en splice() para 
// poder eliminar 2 frutas seguidas sin alterar los indices del array,
// luego con el metodo put se  modifica el arreglo vacio, agregando una fruta
 app.delete("/:id", (req, res) => {
    try{
        let parametro = parseInt(req.params.id.trim(), 10);
        DB.splice(parametro - 1, 1, {});
        guardarFrutas(DB);
        res.status(200).send('Fruta eliminada!');      
    }
    catch{
        res.status(404).send('Ha ocurrido un error!'); 
    }
   
 });
//Ruta para buscar fruta con id.........listo
app.get("/:id", (req, res) => {
    try{
        let parametro = parseInt(req.params.id.trim(), 10);
        let respuesta = [];
        respuesta = DB.find(elemento => elemento.id == parametro);
        respuesta.length>0
        ? res.json([{id:"Error", descripcion:"No existen coincidencias"}])
        : res.json(respuesta);      
    }
    catch{
        res.status(404).send('No se han encontrado coincidencias.'); 
    }
 });

//----------------------------------------------------------------------------------

 app.get('*', (req, res) => {
   res.status(404).send('Ups! El sitio que buscas no existe.')
 });

 
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});