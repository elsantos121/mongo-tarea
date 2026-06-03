import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

// ToDo 1: Configurar la URI de conexión local por defecto de MongoDB
const uri = "mongodb://localhost:27017"; // Nombre de la conexión local
const client = new MongoClient(uri);

app.get('/api/reporte-ventas', async (req, res) => {
    try {
        await client.connect();
        
        // ToDo 2: Conectar a la base de datos y colección correctas
        const database = client.db("hardware_db"); // Nombre de la DB
        const ventas = database.collection("ventas"); // Nombre de la coleccion

        // ToDo 3: Reemplazar este arreglo vacío con el Pipeline exportado desde Compass (Los 5 stages)
        const pipeline = [
            {
                '$match': {
                    'precio': {
                        '$gt': 0
                    }
                }
            }, {
                '$project': {
                    'categoria': 1, 
                    'cantidad': 1, 
                    'recaudacionVenta': {
                        '$multiply': [
                            '$precio', '$cantidad'
                        ]
                    }
                }
            }, {
                '$group': {
                    '_id': '$categoria', 
                    'totalRecaudado': {
                        '$sum': '$recaudacionVenta'
                    }, 
                    'cantidadItems': {
                        '$sum': '$cantidad'
                    }, 
                    'ventaPromedio': {
                        '$avg': '$recaudacionVenta'
                    }
                }
            }, {
                '$match': {
                    'totalRecaudado': {
                        '$gt': 315
                    }
                }
            }, {
                '$sort': {
                    'totalRecaudado': -1
                }
            }
        ];

        // Ejecutamos la agregación nativa
        const reporte = await ventas.aggregate(pipeline).toArray();
        res.status(200).json(reporte);
        
    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        await client.close();
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Datos activo en http://localhost:${PORT}`);
});
