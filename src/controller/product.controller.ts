import type { IncomingMessage, ServerResponse } from "http";
import productService, { createProduct } from "../service/product.service";
import type { IProduct } from "../types/product";
import { bodyParse } from "../Utils/parseBody";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
    const products = productService() as IProduct[];

    // Add Product
    if (req.method === "POST" && pathname === "/products") {
        const body = await bodyParse(req)

        const newProduct = {
            id: Date.now(),
            ...body
        }

        products.push(newProduct)

        createProduct(products)

        console.log(products)

        res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "Products Created successfully!", data: products }));
        return;
    }

    // Update Product
    if (req.method === "PUT") {
        const productId = pathname.match(/^\/products\/(\d+)$/);
        const body = await bodyParse(req)

        if (!productId) {
            res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ message: "Product route not found" }));
            return;
        }

        const id = Number(productId[1]);
        const productIndex = products.findIndex((item) => item.id === id);

        if (productIndex < 0) {
            res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ message: "Product Not Found!" }));
            return;
        }

        products[productIndex] = { id: products[productIndex]?.id, ...body }

        createProduct(products)

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "Product Update Successfully!!", data: products[productIndex] }));
        return;
    }

    if (req.method !== "GET") {
        res.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "Method not allowed" }));
        return;
    }


    // Get All Products
    if (pathname === "/products") {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "Products retrieved successfully!", data: products }));
        return;
    }

    const productId = pathname.match(/^\/products\/(\d+)$/);

    if (!productId) {
        res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "Product route not found" }));
        return;
    }

    // Get Specific Products
    const id = Number(productId[1]);
    const product = products.find((item) => item.id === id);

    if (!product) {
        res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "Product not found" }));
        return;
    }

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ message: "Product retrieved successfully!", data: product }));


};

export default productController


