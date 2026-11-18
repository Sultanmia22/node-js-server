import type { IncomingMessage, ServerResponse } from "http";
import productService, { createProduct } from "../service/product.service";
import type { IProduct } from "../types/product";
import { bodyParse } from "../Utils/parseBody";
import { sendResponse } from "../Utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
  const products = productService() as IProduct[];

  // Add Product
  if (req.method === "POST" && pathname === "/products") {
    const body = await bodyParse(req);

    const newProduct = {
      id: Date.now(),
      ...body,
    };

    products.push(newProduct);

    createProduct(products);

    console.log(products);

    res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        message: "Products Created successfully!",
        data: products,
      }),
    );
    return;
  }

  // Update Product
  if (req.method === "PUT") {
    const productId = pathname.match(/^\/products\/(\d+)$/);
    const body = await bodyParse(req);

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

    products[productIndex] = { id: products[productIndex]?.id, ...body };

    createProduct(products);

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        message: "Product Update Successfully!!",
        data: products[productIndex],
      }),
    );
    return;
  }

  if (req.method === "DELETE") {
    const productId = pathname.match(/^\/products\/(\d+)$/);

    if (!productId) {
      res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ message: "Product Id Not Avaialable" }));
      return;
    }

    const products = productService() as IProduct[];
    const id = Number(productId[1]);
    const productIndex = products.findIndex((item) => item.id === id);

    if (productIndex < 0) {
      sendResponse(res, false, 404, "Product Not Found");
      return;
    }

    products.splice(productIndex, 1);

    createProduct(products);

    sendResponse(res, true, 200, "Product Delete Successfully!");
    return;
  }

  if (req.method !== "GET") {
    sendResponse(res, false, 405, "Method not allowed");
    return;
  }

  // Get All Products
  if (pathname === "/products") {
    try {
      sendResponse(res, true, 200, "Products Retrived Successfully", products);
    } catch (er) {
      sendResponse(res, false, 500, "Internal Server Error", products);
    }
    return;
  }

  const productId = pathname.match(/^\/products\/(\d+)$/);

  if (!productId) {
    sendResponse(res, false, 404, "Product route not found");
    return;
  }

  // Get Specific Products
  const id = Number(productId[1]);
  const product = products.find((item) => item.id === id);

  if (!product) {
    sendResponse(res, false, 404, "Product not found");
    return;
  }

  sendResponse(res, true, 200, "Product retrieved successfully!", product);
  return;
};

export default productController;
