import Crypto from "../models/Crypto.js"

// Create a crypto

export const createCrypto = async (req, res) => {
    try {
        const { name, symbol, price, image, change24h, change, change_24h,"24hChange": raw24hChange } = req.body;

        const normalizedName = typeof name === "string" ? name.trim() : "";
        const normalizedSymbol = typeof symbol === "string" ? symbol.trim().toUpperCase() : "";
        const normalizedImage = typeof image === "string" ? image.trim() : "";
        const resolvedChange = change24h ?? change ?? change_24h ?? raw24hChange;
        const numericPrice = Number(price);
        const numericChange = Number(resolvedChange);

        if (!normalizedName || !normalizedSymbol || !normalizedImage || isNaN(numericPrice) || isNaN(numericChange)) {
            return res.status(400).json({ error: "Invalid input data. Please provide valid name, symbol, price, and change values." });
        }

        // Create a new crypto 
        const newCrypto = new Crypto({
            name: normalizedName,
            symbol: normalizedSymbol,
            price: numericPrice,
            image: normalizedImage,
            change24h: numericChange
        });
        await newCrypto.save();

        res.status(201).json({ message: "Crypto created successfully.", crypto: newCrypto });
    } catch (error) {
        console.error("Error creating crypto:", error);
        res.status(500).json({ error: "An error occurred while creating the crypto." });
    }
};

// Get all cryptos
export const getAllCryptos = async (req, res) => {
    try {
        const cryptos = await Crypto.find().sort;
        res.status(200).json({ cryptos });
    } catch (error) {
        console.error("Error fetching cryptos:", error);
        res.status(500).json({ error: "An error occurred while fetching the cryptos." });
    }
};

// Get top gainers
export const getTopGainers = async (req, res) => {
    try {
        const topGainers = await Crypto.find({ change24h: { $gt: 0 } }).sort({ change24h: -1 }).limit(10);
        res.status(200).json({ topGainers });
    } catch (error) {
        console.error("Error fetching top gainers:", error);
        res.status(500).json({ error: "An error occurred while fetching the top gainers." });
    }
};

// Get new listings
export const getNewListings = async (req, res) => {
    try {
        const newListings = await Crypto.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json({ newListings });
    } catch (error) {
        console.error("Error fetching new listings:", error);
        res.status(500).json({ error: "An error occurred while fetching the new listings." });
    }
};
