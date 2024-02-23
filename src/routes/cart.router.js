import { Router } from "express";
import fs from 'fs';
import {ProductManager} from '../index.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { randomUUID }  from "node:crypto";

const router = Router();
const PATH = "./src/products.json"
const manager = new ProductManager();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
let products = []
let productcart = []
let carts = []
const pathCart ="./src/cart.json"
router.get( '/', (req,res) => {

    
    try {
        //comprueba que exista el archivo
        if (fs.existsSync(pathCart)) {
            // Lee el contenido del archivo.json
            const data = fs.readFileSync(pathCart, 'utf8');

            // Parsea el contenido a un objeto javascript
            carts = JSON.parse(data);
            console.log('Carrito cargado:', carts);
            res.send("Bienvenido al CART")

            return carts;
        } else {
            // si el archivo no existe, lo crea con un array vacio 
            console.log('No existe el archivo de productos. Inicializando con un array vacío.');
            fs.writeFileSync(pathCart, JSON.stringify(carts), 'utf8');
            res.send('No existe el archivo de productos. Inicializando con un array vacío.')
            return carts;
        }
    } catch (error) {
        // mostando posibles errores
        console.error('Error al cargar o inicializar productos:', error);
        res.send('Error al cargar o inicializar productos:', error)
        throw error;
    }
    
})

router.post('/', (req, res) => {
    const manager = new ProductManager();
    const products = manager.getProduct();
        let ID = randomUUID()
        let carrito = fs.readFileSync(pathCart, "utf-8")
        let parsedCart = JSON.parse(carrito)

        let cart = {
        
            id: ID,
            productcart: {}
    
        }
    const productId = req.body.productId;
    console.log(productId)
    // cart.productcart = products.find(prod => prod.id == productId);
    
    productId.forEach(productId => {
        // Utilizamos find() para buscar el producto con el ID actual
        const foundProduct = products.find(prod => prod.id === productId);
        
        // Si encontramos un producto con el ID actual, lo agregamos a la lista de productos encontrados

        if (foundProduct) {
            // Verificamos si ya existe en el carrito
            if (cart.productcart[productId]) {
                // Si existe, simplemente aumentamos la cantidad
                cart.productcart[productId].quantity++;
            } else {
                // Si no existe, lo agregamos al carrito con cantidad 1
                cart.productcart[productId] = {
                    ...foundProduct,
                    quantity: 1
                };
            }
        }
    });
        console.log("productito en cart",productcart)


        if (productcart) {
        parsedCart.push(cart)
        let data = JSON.stringify(parsedCart)
        fs.writeFileSync(pathCart, data, null)
        res.send(`Carrito creado, ID: ${cart.id}`)
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

// Ruta para ver el carrito
router.get('/:cartId', (req, res) => {
    if (fs.existsSync(pathCart)) {
        let id =req.params.cartId
        // Lee el contenido del archivo.json
        const data = fs.readFileSync(pathCart, 'utf8');
    
        // Parsea el contenido a un objeto javascript
        let carts = JSON.parse(data);
        const cart = carts.find(p => p.id == id);
        
        if (cart) {
            
            console.log(`carrito ${id} encontrado:`);
            res.send(cart)
        } else {
            console.log(`No se encontró ningún producto con el ID.`);
            throw new  Error('El archivo no existe.');
        }
    }
});



router.post('/:cartId', (req, res) => {
    const manager = new ProductManager();
    const products = manager.getProduct();
    
    let id =req.params.cartId
    const productId = req.body.productId
        // Lee el contenido del archivo.json
        const data = fs.readFileSync(pathCart, 'utf8');
    
        // Parsea el contenido a un objeto javascript
        let parsedCart = JSON.parse(data);
        const cart = parsedCart.find(p => p.id == id);
        console.log(productId)
        productId.forEach(productId => {
            // Utilizamos find() para buscar el producto con el ID actual
            const foundProduct = products.find(prod => prod.id == productId);
            
            // Si encontramos un producto con el ID actual, lo agregamos a la lista de productos encontrados
    
            if (foundProduct) {
                // Verificamos si ya existe en el carrito
                if (cart.productcart[productId]) {
                    // Si existe, simplemente aumentamos la cantidad
                    cart.productcart[productId].quantity++;
                } else {
                    // Si no existe, lo agregamos al carrito con cantidad 1
                    cart.productcart[productId] = {
                        ...foundProduct,
                        quantity: 1
                    };
                }
            }
        
        
    });
    const filteredCart = {
        id: cart.id,
        productcart: {}
    };
    for (const productId in cart.productcart) {
        if (Object.hasOwnProperty.call(cart.productcart, productId)) {
            filteredCart.productcart[productId] = {
                id: cart.productcart[productId].id,
                quantity: cart.productcart[productId].quantity
            };
        }
    }

        if (cart) {
        parsedCart.push(cart)
        let data = JSON.stringify(parsedCart)
        fs.writeFileSync(pathCart, data, null)
        res.send(filteredCart)
    } else {
        res.status(404).send('Producto no encontrado');
    }
})


export default router;