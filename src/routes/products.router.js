import { Router } from "express";
import fs from 'fs';
import {ProductManager} from '../index.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';


const router = Router();
const PATH = "./src/products.json"
const manager = new ProductManager();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);



router.get("/bienvenido", (req,res) =>{ 
    res.sendFile(path.resolve(__dirname,"../index.html"))

})
router.get("/", (req,res) => {
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
router.get("/:productId", (req,res) =>{ 
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
            throw new  Error('El archivo no existe.');
        }

        
    }
    function readFilesync(PATH, utf8) {
        return new Promise((resolve, reject) => {
            const manager = new ProductManager();
            const products = manager.getProduct();
            console.log(products)
            });
        };

})
router.post("/", (req,res) => {

    const products = manager.getProduct();

    const { title, description, price, thumbnail, code, stock } = req.body;

    // Validar si se proporcionaron todos los campos necesarios
    if (!title || !description || !price || !code || !stock) {
        return res.status(400).json({ error: 'Se requieren todos los campos: nombre, precio y descripción.' });
    }

    // Crear un nuevo objeto de producto con los datos proporcionados
    const newProduct = {
    
    title: title,
    description: description,
    price: price,
    thumbnail: thumbnail,
    code: code,
    stock: stock

    };
    
    manager.addProduct(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock)
    res.json({status: "succes"})

})
router.put("/:productId", (req,res)=>{
    const products = manager.getProduct();
    const productId = req.params.productId;

//    const { title, description, price, thumbnail, code, stock } = req.body;
    const updatedFields = req.body
    console.log("productos desde el router put", products[1].id)
    const productIndex = products.findIndex(product => product.id == productId);
        if (productIndex !== -1) {
            // Actualizar solo los campos proporcionados en updatedFields
            console.log(productIndex)
            products[productIndex.id] = {
                ...products[productIndex.id],
                ...updatedFields
            };
            const productoactualizado = products[productIndex.id]
            console.log(productoactualizado,"esto le mando para subir")
            return new Promise((resolve, reject) => {
                const productsJSON = JSON.stringify(products, null, 2);
    
                fs.writeFileSync(PATH , productsJSON, 'utf8', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`Productos guardados en ${PATH}`);
                    }
                });
            });
//            manager.saveProductsToFile(products)                        
            res.send(products[productIndex])
            console.log(`Producto actualizado: { ID: ${productoactualizado.id}, Código: ${productoactualizado.code}, Nombre: ${productoactualizado.title} }`);
            
        } else {
            console.log(`No se encontró ningún producto con el ID ${productId}.`);
        }

})
router.delete("/:productId", (req,res)=>{
    const products = manager.getProduct();
    const productId = req.params.productId;

    console.log("productos desde el router delete", productId)
    const productIndex = products.findIndex(product => product.id == productId);
    console.log(products)
    console.log(products[productId])
        if (productIndex !== -1) {
            const deletedProduct = products.splice(productIndex, 1)[0];
            
            console.log(`Producto eliminado: { ID: ${deletedProduct.id}, Código: ${deletedProduct.code}, Nombre: ${deletedProduct.title} }`);
            return new Promise((resolve, reject) => {
                const productsJSON = JSON.stringify(products, null, 2);
    
                fs.writeFileSync(PATH , productsJSON, 'utf8', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`Productos guardados en ${PATH}`);
                    }
                });
            });
            res.json(`Producto eliminado: { ID: ${deletedProduct.id}, Código: ${deletedProduct.code}, Nombre: ${deletedProduct.title} }`)
        } else {
            console.log(`No se encontró ningún producto con el ID ${productId}.`);
            res.json({status: `No se encontró ningún producto con el ID ${productId}.`})

        }
})
export default router;