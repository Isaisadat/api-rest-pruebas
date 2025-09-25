const { MongoClient } = require('mongodb');
const debug = require('debug')('app:db');

// Debuggear variables de entorno
console.log('🔍 Variables de entorno:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Presente' : '❌ Faltante');
console.log('DB_NAME:', process.env.DB_NAME || '❌ Faltante');

const connectionString = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

// Si no hay connection string, usar uno por defecto para testing
const connectionStringFinal = connectionString || "mongodb://localhost:27017/mi_app";

let client;
let db;

async function conectarDB() {
    try {
        console.log('🔗 Intentando conectar a MongoDB...');
        console.log('URL:', connectionStringFinal);
        
        client = new MongoClient(connectionStringFinal);
        await client.connect();
        db = client.db(dbName || "mi_app");
        console.log('✅ Conectado a MongoDB correctamente');
        return db;
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error('Debes conectar a la base de datos primero');
    }
    return db;
}

module.exports = {
    conectarDB,
    getDB
};