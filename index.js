var express = require('express');
var wagner = require('wagner-core');

//Arrancar el servidor.

require('./models/models')(wagner);

var app = express();

// Añadir los encabezados.

//Establece un middleware para las peticiones que se reciban.

app.use(function (req, res, next){
	
	// Permitir la conexión.
	
	res.setHeader('Acess-Control-Allow-Origin', '*');
	
	// Peticiones Permitidas.
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	
	// Encabezados de peticiones que se permitirán
	
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	
	// Una instrucción opcional, que aún no se si implementaremos, si la api permitirá manejar sesiones
	// Pudieran implementarse medidas de seguridad usando cookies. En caso de que lo decida, descomentar.
	
	//res.setHeader('Access-Control-Allow-Credentials', true);
	
	//Pasamos a la siguiente capa del middleware	
	next();
});

// Al tener una petición con la ruta de la api, la redirige a lo que se encuentra
// dentro de la carpeta ./api y se pone a disposición el contenido de esa carpeta (modelos y db) de todo mundo, mediante wagner.

app.use('/api/v1', require('./api')(wagner));

var port = 8080;
app.listen(port);

console.log('Servidor corriendo en el puerto'+ port);