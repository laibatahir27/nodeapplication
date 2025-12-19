const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_FILE_PATH = path.join(__dirname,'products.json'); // JSON file path

// Read products from file safely
function readProductsData() {
    try {
        if (!fs.existsSync(DATA_FILE_PATH)) return [];
        const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading or parsing data file:", error.message);
        return [];
    }
}

// Write products to file safely
function writeProductsData(data) {
    try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing data file:", error.message);
        throw error;
    }
}

// GET all products
app.get('/products', (req, res) => {
    const products = readProductsData();
    res.json(products);
});

// POST a new product
app.post('/products', (req, res) => {
    const products = readProductsData();

    const { name, price, category, stock } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Product name and price are required.' });
    }

    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 101;

    const newProduct = {
        id: newId,
        name: name,
        price: price,
        category: category || "General",
        stock: stock || 0
    };


    products.push(newProduct);

    try {
        writeProductsData(products);
    }
     catch (error) {
        return res.status(500).json({ error: "Failed to save product" });
    }

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
});


app.listen(PORT, () => {
    console.log(`Product API is running on http://localhost:${PORT}`);
    console.log(`GET API Endpoint: http://localhost:${PORT}/products`);
});

