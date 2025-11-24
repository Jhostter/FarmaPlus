import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertProductSchema, adminLoginSchema } from "@shared/schema";
import { z } from "zod";
import { supabase } from "./supabase";
import jwt from "jsonwebtoken";

// Middleware de autenticación
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key");
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database on first request
  let dbInitialized = false;
  const initializeDB = async () => {
    if (!dbInitialized) {
      try {
        await storage.seedInitialProducts();
        dbInitialized = true;
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    }
  };

  // Get all products
  app.get("/api/products", async (_req, res) => {
    await initializeDB();
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      console.log("Order request body:", JSON.stringify(req.body, null, 2));
      
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", error.errors);
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      console.error("Order creation error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Get single order
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Get order items
  app.get("/api/orders/:id/items", async (req, res) => {
    try {
      const orderItems = await storage.getOrderItems(req.params.id);
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order items" });
    }
  });

  // Get all orders
  app.get("/api/orders", async (_req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Admin routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = adminLoginSchema.parse(req.body);

      // Autenticar con Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        return res.status(401).json({ error: "Email o contraseña incorrectos" });
      }

      // Crear JWT local para la sesión
      const token = jwt.sign(
        { email, userId: data.user?.id },
        process.env.JWT_SECRET || "secret-key",
        { expiresIn: "24h" }
      );

      res.json({ token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Datos inválidos" });
      }
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  // Create product (admin only)
  app.post("/api/admin/products", authMiddleware, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Datos inválidos" });
      }
      res.status(500).json({ error: "Error al crear producto" });
    }
  });

  // Update product (admin only)
  app.patch("/api/admin/products/:id", authMiddleware, async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Datos inválidos" });
      }
      res.status(500).json({ error: "Error al actualizar producto" });
    }
  });

  // Delete product (admin only)
  app.delete("/api/admin/products/:id", authMiddleware, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar producto" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
