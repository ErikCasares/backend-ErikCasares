import fs from 'fs'
import {
    Blob
} from 'buffer'
import {
    stringify
} from 'querystring';
import path from 'path';
const INFO = "./package.json"


class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;

    }
    getInfo() {
        return `ID: ${this.id}, Código: ${this.code}, Nombre: ${this.title}`;
    }
}

class ProductManager {

    constructor() {
        this.products = [];
        this.idCounter = this.products.length + 1;
        this.PATH = "./products.json"
    }
    getProduct() {
        try {
            //comprueba que exista el archivo
            if (fs.existsSync(this.PATH)) {
                // Lee el contenido del archivo.json
                const data = fs.readFileSync(this.PATH, 'utf8');
    
                // Parsea el contenido a un objeto javascript
                this.products = JSON.parse(data);
    
                console.log('Productos cargados:', this.products);
    
                return this.products;
            } else {
                // si el archivo no existe, lo crea con un array vacio 
                console.log('No existe el archivo de productos. Inicializando con un array vacío.');
                fs.writeFileSync(this.PATH, JSON.stringify(this.products), 'utf8');
                console.log(this.products)
                return this.products;
            }
        } catch (error) {
            // Log any errors that occur during file read/write
            console.error('Error al cargar o inicializar productos:', error);
            throw error; // Optionally, you can choose to throw the error here to indicate failure.
        }
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Validar que todos los campos sean obligatorios
        if (![title, description, price, thumbnail, code, stock]) {
            console.log("Todos los campos son obligatorios.");
            return;
        }
        if (this.products.some(product => product.code === code)) {
            console.log(`Ya existe un producto con el código ${code}.`);
            return;
        }

        // ID autoincrementable
        const newProduct = new Product(title, description, price, thumbnail, code, stock);
        newProduct.id = this.idCounter++;
        //Agregar producto al arreglo
        this.products.push(newProduct);
        this.saveProductsToFile()
        console.log(`Producto agregado: ${newProduct.title} (ID: ${newProduct.id})`)

    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            // Actualizar solo los campos proporcionados en updatedFields
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updatedFields
            };
            const productoactualizado = this.products[productIndex]
            this.saveProductsToFile()
            console.log(`Producto actualizado: { ID: ${productoactualizado.id}, Código: ${productoactualizado.code}, Nombre: ${productoactualizado.title} }`);

        } else {
            console.log(`No se encontró ningún producto con el ID ${id}.`);
        }
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            const deletedProduct = this.products.splice(productIndex, 1)[0];
            this.saveProductsToFile()
            console.log(`Producto eliminado: { ID: ${deletedProduct.id}, Código: ${deletedProduct.code}, Nombre: ${deletedProduct.title} }`);
        } else {
            console.log(`No se encontró ningún producto con el ID ${id}.`);
        }
    }
    // Buscar el producto por ID

    getProductById(id) {

        const product = this.products.find(p => p.id === id);
        if (product) {
            ;
            console.log(`Producto encontrado: { ID: ${product.id}, Código: ${product.code}, Nombre: ${product.title} }`);
        } else {
            console.log(`No se encontró ningún producto con el ID ${id}.`);
        }

        return product;
    }

    saveProductsToFile() {
        return new Promise((resolve, reject) => {
            const productsJSON = JSON.stringify(this.products, null, 2);

            fs.writeFileSync(this.PATH, productsJSON, 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(`Productos guardados en ${this.PATH}`);
                }
            });
        });
    }
}

//Uso
const manager = new ProductManager();

manager.getProduct();
//agregando muchos productos sin repetir

manager.addProduct("papa", "una simple papa", 10, "foto-de-una-papa,jpg", "P001", 7);
manager.addProduct("cebolla", "es como un ogro, pero es una cebolla", 5, "foto-de-un-ogro-con-una-cebolla.jpg", "P002", 5);
manager.addProduct("piedra", "buena herramienta primogenita de todo hombre", 1, "foto-de-hombre-tirando-piedra.jpg", "P003", 100);
manager.addProduct("escoba", "escoba nueva barre bien", 5, "foto-de-nimbus2000.jpg", "P004", 50);
manager.addProduct("Producto 5", "Descripción 2", 12, "img5.jpg", "P005", 30);
manager.addProduct("Producto 6", "Descripción 3", 30, "img6.jpg", "P006", 20);
manager.addProduct("Producto 7", "Descripción 1", 19, "img7.jpg", "P007", 50);
manager.addProduct("Producto 8", "Descripción 2", 29, "img8.jpg", "P008", 30);
manager.addProduct("Producto 9", "Descripción 3", 39, "img9.jpg", "P009", 20);

//producto repitiendo codigo

manager.addProduct("Producto 10", "item con error", 12, "img9.jpg", "P005", 20);

//mostrar lista completa

console.log("lista actualizada", manager.products)

//buscando producto, acierto- error

var productIdToSearch = 7;
var foundProduct = manager.getProductById(productIdToSearch);

productIdToSearch = 20;
foundProduct = manager.getProductById(productIdToSearch);

// Modificar un producto por ID
var productToModify = 2
manager.updateProduct(productToModify, {
    price: 39.99,
    stock: 40
});

// Eliminar un producto por ID
manager.deleteProduct(1);

//mostrar la lista despues de aplicar los cambios 

console.log("lista actualizada", manager.products)

// agregando un item extra

manager.addProduct("Producto 10", "Descripción 3", 29, "img10.jpg", "P010", 39);

// actualizando un json de items

manager.saveProductsToFile()
    .then((message) => {
        console.log(message);
    })
    .catch((error) => {
        console.error('Error al guardar los productos:', error);
    });

//leyendo productos desde el json 
manager.getProduct()

//agregando despues del json

manager.addProduct("Producto 11", "agregado despues del json", 29, "img10.jpg", "P011", 39);

//volviendo a guardar el json
manager.saveProductsToFile()
    .then((message) => {
        console.log(message);
    })
    .catch((error) => {
        console.error('Error al guardar los productos:', error);
    });
