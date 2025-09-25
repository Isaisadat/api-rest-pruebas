const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://innovalatinos:innovalatinos@cluster0.cinpcmb.mongodb.net/mi_app?retryWrites=true&w=majority&appName=Cluster0";

async function agregarProductos() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db("mi_app");
        const productos = db.collection("productos");
        
        const productosEjemplo = [
            {
                nombre: "Crema Facial Hidratante",
                descripcion: "Crema hidratante para rostro con ácido hialurónico",
                precio: 25.99,
                categoria: "facial",
                stock: 50,
                activo: true,
                fechaCreacion: new Date(),
                codigo: "PROD-FAC-001"
            },
            {
                nombre: "Gel de Baño Relajante",
                descripcion: "Gel de baño con aroma a lavanda para relajación",
                precio: 12.50,
                categoria: "corporal", 
                stock: 30,
                activo: true,
                fechaCreacion: new Date(),
                codigo: "PROD-CORP-002"
            },
            {
                nombre: "Shampoo Fortalecedor",
                descripcion: "Shampoo para cabello débil y quebradizo",
                precio: 18.75,
                categoria: "capilar",
                stock: 25,
                activo: true,
                fechaCreacion: new Date(),
                codigo: "PROD-CAP-003"
            },
            {
                nombre: "Base de Maquillaje",
                descripcion: "Base de larga duración para todo tipo de piel",
                precio: 32.00,
                categoria: "maquillaje",
                stock: 15,
                activo: true,
                fechaCreacion: new Date(),
                codigo: "PROD-MAQ-004"
            },
            {
                nombre: "Kit de Regalo Premium",
                descripcion: "Kit completo con productos faciales y corporales",
                precio: 45.99,
                categoria: "otros",
                stock: 10,
                activo: true,
                fechaCreacion: new Date(),
                codigo: "PROD-OTR-005"
            }
        ];
        
        const resultado = await productos.insertMany(productosEjemplo);
        console.log(`✅ ${resultado.insertedCount} productos agregados exitosamente`);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

agregarProductos();