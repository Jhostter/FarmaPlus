import { db } from "./db";
import { products, orders, orderItems, type Product, type InsertProduct, type Order, type InsertOrder, type OrderItem, type InsertOrderItem } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  updateProductStock(id: string, newStock: number): Promise<Product | undefined>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByCustomer(email: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Initialization
  seedInitialProducts(): Promise<void>;
}

export class DrizzleStorage implements IStorage {
  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return result[0];
  }

  async updateProductStock(id: string, newStock: number): Promise<Product | undefined> {
    const result = await db.update(products).set({ stock: newStock }).where(eq(products.id, id)).returning();
    return result[0];
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getOrdersByCustomer(email: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.customerEmail, email));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      deliveryCity: order.deliveryCity,
      deliveryPostalCode: order.deliveryPostalCode,
      total: order.total,
    }).returning();

    const newOrder = result[0];

    // Create order items and update stock
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await this.createOrderItem({
          orderId: newOrder.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        });

        // Reduce product stock
        const product = await this.getProduct(item.productId);
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          await this.updateProductStock(item.productId, newStock);
        }
      }
    }

    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const result = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return result[0];
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(orderItems).values(item).returning();
    return result[0];
  }

  // Initialization
  async seedInitialProducts(): Promise<void> {
    const existingProducts = await this.getAllProducts();
    if (existingProducts.length > 0) {
      return; // Already seeded
    }

    const vitaminImg = "/attached_assets/generated_images/vitamin_supplement_product.png";
    const painMedImg = "/attached_assets/generated_images/pain_medication_product.png";
    const sanitizerImg = "/attached_assets/generated_images/hand_sanitizer_product.png";
    const omega3Img = "/attached_assets/generated_images/omega-3_supplement_product.png";
    const allergyImg = "/attached_assets/generated_images/allergy_medication_product.png";
    const bandagesImg = "/attached_assets/generated_images/bandages_product.png";
    const probioticImg = "/attached_assets/generated_images/probiotic_supplement_product.png";
    const faceCreamImg = "/attached_assets/generated_images/face_cream_product.png";

    const initialProducts: InsertProduct[] = [
      {
        name: "Vitamina C 1000mg",
        description: "Suplemento de vitamina C de alta potencia para fortalecer el sistema inmunológico. 60 comprimidos.",
        price: "24.99",
        category: "Suplementos",
        imageUrl: vitaminImg,
        requiresPrescription: 0,
        stock: 150,
      },
      {
        name: "Ibuprofeno 400mg",
        description: "Analgésico y antiinflamatorio para el alivio del dolor y la fiebre. 20 comprimidos.",
        price: "8.50",
        category: "Medicamentos",
        imageUrl: painMedImg,
        requiresPrescription: 0,
        stock: 200,
      },
      {
        name: "Gel Antibacterial 500ml",
        description: "Gel desinfectante para manos con 70% de alcohol. Elimina el 99.9% de gérmenes.",
        price: "6.99",
        category: "Cuidado Personal",
        imageUrl: sanitizerImg,
        requiresPrescription: 0,
        stock: 180,
      },
      {
        name: "Omega-3 Fish Oil",
        description: "Suplemento de aceite de pescado rico en EPA y DHA para la salud cardiovascular. 90 cápsulas.",
        price: "32.99",
        category: "Suplementos",
        imageUrl: omega3Img,
        requiresPrescription: 0,
        stock: 120,
      },
      {
        name: "Antihistamínico Loratadina 10mg",
        description: "Tratamiento para alergias estacionales y rinitis alérgica. 30 comprimidos.",
        price: "12.99",
        category: "Medicamentos",
        imageUrl: allergyImg,
        requiresPrescription: 0,
        stock: 100,
      },
      {
        name: "Vendas Adhesivas Surtidas",
        description: "Caja con 40 vendas adhesivas de diferentes tamaños para primeros auxilios.",
        price: "5.99",
        category: "Cuidado Personal",
        imageUrl: bandagesImg,
        requiresPrescription: 0,
        stock: 250,
      },
      {
        name: "Probiótico Multi-Cepa",
        description: "10 mil millones de CFU con 8 cepas probióticas diferentes para la salud digestiva. 30 cápsulas.",
        price: "29.99",
        category: "Suplementos",
        imageUrl: probioticImg,
        requiresPrescription: 0,
        stock: 90,
      },
      {
        name: "Crema Hidratante Facial SPF 30",
        description: "Crema facial con protección solar para hidratación y cuidado diario de la piel. 50ml.",
        price: "18.99",
        category: "Cuidado Personal",
        imageUrl: faceCreamImg,
        requiresPrescription: 0,
        stock: 140,
      },
      {
        name: "Paracetamol 500mg",
        description: "Analgésico y antipirético para el alivio del dolor leve a moderado y fiebre. 30 comprimidos.",
        price: "6.99",
        category: "Medicamentos",
        imageUrl: painMedImg,
        requiresPrescription: 0,
        stock: 220,
      },
      {
        name: "Multivitamínico Completo",
        description: "Fórmula completa con vitaminas A, C, D, E, B y minerales esenciales. 60 comprimidos.",
        price: "21.99",
        category: "Suplementos",
        imageUrl: vitaminImg,
        requiresPrescription: 0,
        stock: 160,
      },
      {
        name: "Jarabe para la Tos",
        description: "Jarabe expectorante para aliviar la tos y congestión. 120ml.",
        price: "9.99",
        category: "Medicamentos",
        imageUrl: painMedImg,
        requiresPrescription: 0,
        stock: 85,
      },
      {
        name: "Termómetro Digital",
        description: "Termómetro digital de lectura rápida con pantalla LCD. Precisión de 0.1°C.",
        price: "14.99",
        category: "Cuidado Personal",
        imageUrl: bandagesImg,
        requiresPrescription: 0,
        stock: 75,
      },
    ];

    for (const product of initialProducts) {
      await this.createProduct(product);
    }
  }
}

export const storage = new DrizzleStorage();
