import {
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "@shared/schema";
import { randomUUID } from "crypto";

// Image paths for products
const vitaminImg = "/attached_assets/generated_images/vitamin_supplement_product.png";
const painMedImg = "/attached_assets/generated_images/pain_medication_product.png";
const sanitizerImg = "/attached_assets/generated_images/hand_sanitizer_product.png";
const omega3Img = "/attached_assets/generated_images/omega-3_supplement_product.png";
const allergyImg = "/attached_assets/generated_images/allergy_medication_product.png";
const bandagesImg = "/attached_assets/generated_images/bandages_product.png";
const probioticImg = "/attached_assets/generated_images/probiotic_supplement_product.png";
const faceCreamImg = "/attached_assets/generated_images/face_cream_product.png";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;

  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.initializeProducts();
  }

  private initializeProducts() {
    const initialProducts: Omit<Product, "id">[] = [
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

    initialProducts.forEach((product) => {
      const id = randomUUID();
      this.products.set(id, { ...product, id });
    });
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      id,
      customerName: insertOrder.customerName,
      customerEmail: insertOrder.customerEmail,
      customerPhone: insertOrder.customerPhone,
      deliveryAddress: insertOrder.deliveryAddress,
      deliveryCity: insertOrder.deliveryCity,
      deliveryPostalCode: insertOrder.deliveryPostalCode,
      total: insertOrder.total,
      status: "pending",
      createdAt: new Date(),
    };
    this.orders.set(id, order);

    // Create order items
    if (insertOrder.items && insertOrder.items.length > 0) {
      for (const item of insertOrder.items) {
        await this.createOrderItem({
          orderId: id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        });
      }
    }

    return order;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
}

export const storage = new MemStorage();
