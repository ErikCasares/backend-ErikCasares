import express from "express";
import productRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express()
const port = 8080


//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/public`))

//Routes
app.use("/api/products",productRouter)
app.use("/api/cart",cartRouter)


app.listen(port, ()=> console.log(`server corriendo en ${port}`))