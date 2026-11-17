import path from "node:path";
import fs from "fs"
import type { IProduct } from "../types/product";
const filePath = path.join(process.cwd(),"./src/database/db.json")

const productService = () => {
    const result = fs.readFileSync(filePath,"utf-8")
    return JSON.parse(result)
}

export default productService

export const createProduct = (payload: IProduct[]) => {
    fs.writeFileSync(filePath,JSON.stringify(payload))
}