class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.idCounter = this.products.length+1;
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


        const newProduct = new Product(title, description, price, thumbnail, code, stock);
        newProduct.id = this.idCounter;
        this.idCounter++;

        this.products.push(newProduct);
        console.log(`Producto agregado: ${newProduct.title} (ID: ${newProduct.id})`)
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
}

    //Uso
const manager = new ProductManager();

manager.addProduct("papa", "una simple papa", 10,"foto-de-una-papa,jpg", "P001", 7);
manager.addProduct("cebolla", "es como un ogro, pero es una cebolla", 5, "foto-de-un-ogro-con-una-cebolla.jpg", "P002", 5);
manager.addProduct("piedra", "buena herramienta primogenita de todo hombre", 1, "foto-de-hombre-tirando-piedra.jpg", "P003", 100);
manager.addProduct("escoba", "escoba nueva barre bien", 5, "foto-de-nimbus2000.jpg", "P004", 50);
manager.addProduct("Producto 5", "Descripción 2", 12, "img5.jpg", "P005", 30);
manager.addProduct("Producto 6", "Descripción 3", 30, "img6.jpg", "P006", 20); 
manager.addProduct("Producto 7", "Descripción 1", 19, "img7.jpg", "P007", 50);
manager.addProduct("Producto 8", "Descripción 2", 29, "img8.jpg", "P008", 30);
manager.addProduct("Producto 9", "Descripción 3", 39, "img9.jpg", "P009", 20); 
console.log("lista actualizada", manager.products)

var productIdToSearch = 7;
var foundProduct = manager.getProductById(productIdToSearch);
productIdToSearch = 20;
foundProduct = manager.getProductById(productIdToSearch);
