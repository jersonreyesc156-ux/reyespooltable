const http = require("http");
const fs = require("fs");
const net = require("net");
const path = require("path");
const url = require("url");
const crypto = require("crypto");

// Simple admin password (in production, use environment variables)
const ADMIN_PASSWORD = "reyes2024!"; // Change this to a secure password
const JWT_SECRET = "reyes-pool-tables-secret-key-2024"; // Change this to a secure secret

// Store valid tokens (in production, use Redis or database)
const validTokens = new Set();

const DEFAULT_PORT = Number(process.env.PORT) || 10000;
const ROOT_DIR = __dirname;
const PRODUCTS_FILE = path.join(ROOT_DIR, "products.json");
const ORDERS_FILE = path.join(ROOT_DIR, "orders.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": MIME_TYPES[".json"] });
  res.end(JSON.stringify(payload, null, 2));
}

function safeReadProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    const products = JSON.parse(raw);
    if (!Array.isArray(products)) {
      return [];
    }
    return products;
  } catch (error) {
    return [];
  }
}

function safeReadOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
    const orders = JSON.parse(raw);
    if (!Array.isArray(orders)) {
      return [];
    }
    return orders;
  } catch (error) {
    return [];
  }
}

function generateToken() {
  const token = crypto.randomBytes(32).toString('hex');
  validTokens.add(token);
  // Set token to expire after 24 hours
  setTimeout(() => {
    validTokens.delete(token);
  }, 24 * 60 * 60 * 1000);
  return token;
}

function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  return validTokens.has(token);
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => resolve(body));
    req.on("error", (error) => reject(error));
  });
}

function serveStaticFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("File not found.");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname || "/";
  let decodedPathname = pathname;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch (error) {
    decodedPathname = pathname;
  }

  if (decodedPathname === "/api/products" && req.method === "GET") {
    return sendJson(res, 200, safeReadProducts());
  }

  if (decodedPathname === "/api/business-info" && req.method === "GET") {
    return sendJson(res, 200, {
      businessName: "Reyes Pool Tables",
      tagline: "",
      phone: "0907-744-9122",
      email: "",
      facebook: "https://www.facebook.com/people/Reyes-Pool-Table/100094387630000/",
      location: "Paniqui, Tarlac"
    });
  }

  if (decodedPathname === "/api/orders" && req.method === "POST") {
    readBody(req)
      .then((body) => {
        let payload;
        try {
          payload = JSON.parse(body || "{}");
        } catch (error) {
          return sendJson(res, 400, { message: "Invalid JSON request body." });
        }

        const requiredFields = [
          "firstName",
          "lastName",
          "phone",
          "province",
          "city",
          "barangay",
          "product",
          "size"
        ];
        const missingField = requiredFields.find(
          (field) => !payload[field] || String(payload[field]).trim() === ""
        );
        if (missingField) {
          return sendJson(res, 400, { message: `Missing required field: ${missingField}` });
        }

        if (payload.size === "Custom" && (!payload.customSize || !String(payload.customSize).trim())) {
          return sendJson(res, 400, { message: "Custom size is required when size is Custom." });
        }

        const orders = safeReadOrders();
        const newOrder = {
          id: Date.now(),
          createdAt: new Date().toISOString(),
          firstName: String(payload.firstName).trim(),
          middleName: payload.middleName ? String(payload.middleName).trim() : "",
          lastName: String(payload.lastName).trim(),
          phone: String(payload.phone).trim(),
          houseNumber: payload.houseNumber ? String(payload.houseNumber).trim() : "",
          islandGroup: String(payload.islandGroup).trim(),
          province: String(payload.province).trim(),
          city: String(payload.city).trim(),
          barangay: String(payload.barangay).trim(),
          product: String(payload.product).trim(),
          size: String(payload.size).trim(),
          productDetails: payload.productDetails ? String(payload.productDetails).trim() : "",
          customSize: payload.size === "Custom" ? String(payload.customSize).trim() : "",
          notes: payload.notes ? String(payload.notes).trim() : "",
          manualAddress: payload.manualAddress || false
        };
        newOrder.customerName = `${newOrder.firstName} ${newOrder.middleName} ${newOrder.lastName}`
          .replace(/\s+/g, " ")
          .trim();
        // Always use manual address format without region
        newOrder.customerAddress = newOrder.houseNumber ? 
          `${newOrder.houseNumber}, ${newOrder.barangay}, ${newOrder.city}, ${newOrder.province}` :
          `${newOrder.barangay}, ${newOrder.city}, ${newOrder.province}`;

        orders.push(newOrder);
        saveOrders(orders);
        return sendJson(res, 201, { message: "Order submitted successfully.", order: newOrder });
      })
      .catch(() => {
        return sendJson(res, 500, { message: "Failed to process order." });
      });
    return;
  }

  if (decodedPathname === "/api/admin/login" && req.method === "POST") {
    readBody(req)
      .then((body) => {
        let payload;
        try {
          payload = JSON.parse(body || "{}");
        } catch (error) {
          return sendJson(res, 400, { message: "Invalid JSON request body." });
        }

        if (!payload.password || payload.password !== ADMIN_PASSWORD) {
          return sendJson(res, 401, { message: "Invalid password." });
        }

        const token = generateToken();
        return sendJson(res, 200, { 
          message: "Login successful.", 
          token: token,
          expiresIn: "24h"
        });
      })
      .catch(() => {
        return sendJson(res, 500, { message: "Login failed." });
      });
    return;
  }

  if (decodedPathname === "/api/orders" && req.method === "GET") {
    if (!verifyAuth(req)) {
      return sendJson(res, 401, { message: "Authentication required." });
    }
    return sendJson(res, 200, safeReadOrders().reverse());
  }

  // Handle DELETE request for specific order
  if (decodedPathname.startsWith("/api/orders/") && req.method === "DELETE") {
    if (!verifyAuth(req)) {
      return sendJson(res, 401, { message: "Authentication required." });
    }
    
    const orderId = parseInt(decodedPathname.split("/").pop());
    if (isNaN(orderId)) {
      return sendJson(res, 400, { message: "Invalid order ID." });
    }
    
    const orders = safeReadOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return sendJson(res, 404, { message: "Order not found." });
    }
    
    orders.splice(orderIndex, 1);
    saveOrders(orders);
    return sendJson(res, 200, { message: "Order deleted successfully." });
  }

  let filePath = path.join(ROOT_DIR, decodedPathname === "/" ? "index.html" : decodedPathname);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  serveStaticFile(filePath, res);
});

function findAvailablePort(startPort, onFound) {
  const tester = net.createServer();
  tester.once("error", (error) => {
    if (error.code === "EADDRINUSE") {
      findAvailablePort(startPort + 1, onFound);
      return;
    }
    throw error;
  });
  tester.once("listening", () => {
    tester.close(() => onFound(startPort));
  });
  tester.listen(startPort);
}

findAvailablePort(DEFAULT_PORT, (port) => {
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
