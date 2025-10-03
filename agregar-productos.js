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
                imagenUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop",
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
                imagenUrl: "https://images.unsplash.com/photo-1599345266884-ec10aaca2aeb?w=300&h=300&fit=crop",
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
                imagenUrl: "https://images.unsplash.com/photo-1556228577-7a3d02f3e50b?w=300&h=300&fit=crop",
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
                imagenUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
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
                imagenUrl: "https://images.unsplash.com/photo-1556228578-7bcf6f986d0a?w=300&h=300&fit=crop",
                activo: true,
                fechaCreacion: new Date(),
                codigo: "PROD-OTR-005"
            }
        ];
        
        const resultado = await productos.insertMany(productosEjemplo);
        console.log(`✅ ${resultado.insertedCount} productos con imágenes agregados exitosamente`);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

agregarProductos();