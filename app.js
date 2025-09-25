// 1. Cargar variables de entorno (PRIMERO)
require('dotenv').config();

// 2. Importar módulos
const debug = require('debug')('app:inicio');
const express = require('express');
const config = require('config');
const morgan = require('morgan');
const { conectarDB } = require('./config/db');

// 3. Inicializar Express
const app = express();

// 4. Conexión a MongoDB Atlas
conectarDB().then(() => {
    console.log('✅ Conectado a MongoDB Atlas correctamente');
}).catch(error => {
    console.error('❌ Error en conexión BD:', error.message);
});

// 5. Middlewares (DESPUÉS de app = express())
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// 6. Rutas (DESPUÉS de los middlewares)
app.use('/api/productos', require('./routes/productos'));

// 7. Configuración de entornos
console.log('Aplicación: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));

// 8. Middleware Morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan esta habilitado.');
}

// 9. Rutas adicionales
app.get('/api/test-db', async (req, res) => {
    try {
        const { getDB } = require('./config/db');
        const db = getDB();
        const coleccion = db.collection('test');
        
        const resultado = await coleccion.insertOne({
            mensaje: 'Conexión exitosa a MongoDB Atlas',
            fecha: new Date(),
            aplicacion: config.get('nombre')
        });
        
        res.json({
            status: 'success',
            message: '✅ Conexión a MongoDB Atlas exitosa',
            insertedId: resultado.insertedId,
            fecha: new Date()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: '❌ Error: ' + error.message
        });
    }
});

app.get('/', (req, res) => {
    res.send(`
        <h1>Hola Mundo desde Express con MongoDB Atlas</h1>
        <p>✅ Base de datos conectada</p>
        <a href="/api/test-db">Probar conexión a BD</a><br>
        <a href="/api/productos">Ver productos</a>
    `);
});

// 10. Iniciar servidor (AL FINAL)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en puerto ${port}...`);
    console.log(`📊 MongoDB Atlas: CONECTADO`);
    console.log(`🔗 Prueba: http://localhost:${port}/api/productos`);
});