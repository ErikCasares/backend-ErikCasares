import fs from 'fs'
import {
    Blob
} from 'buffer'
import {
    stringify
} from 'querystring';
import express from "express";
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {ProductManager} from './src/index.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
const manager = new ProductManager();

const app = express()
const port = 8080
const PATH = "./src/products.json"

function readFilesync(PATH, utf8) {
    return new Promise((resolve, reject) => {
        const manager = new ProductManager();
        const products = manager.getProduct();
        console.log(products)
        });
    };

app.get("/products", (req,res) => {
    // Obtén el valor del parámetro "limit" de la consulta
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    // Leer el archivo JSON
    const manager = new ProductManager();
    const products = manager.getProduct();
    
    console.log(products)


    // Si se proporciona un límite, devuelve solo los primeros "limit" productos
    const limitedProducts = limit ? products.slice(0, limit) : products;

    // Envía los productos limitados como respuesta
    res.send(limitedProducts);
})

app.get("/", (req,res) => {

    res.send("Bienvenido")

})

app.get("/products/:productId", (req,res) =>{ 
    if (fs.existsSync(PATH)) {
        let id =parseInt(req.params.productId)
        // Lee el contenido del archivo.json
        const data = fs.readFileSync(PATH, 'utf8');
    
        // Parsea el contenido a un objeto javascript
        let products = JSON.parse(data);
        const product = products.find(p => p.id == id);
        if (product) {
            
            console.log(`Producto encontrado:`);
            res.send(product)
        } else {
            console.log(`No se encontró ningún producto con el ID.`);
            throw new Error('El archivo no existe.');
        }

        
    }

})

app.get("/productos", (req,res) =>{ 
    res.sendFile(path.resolve(__dirname,"./src/index,js"))

})

app.listen(port, ()=> console.log(`server corriendo en ${port}`))