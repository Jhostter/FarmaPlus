import { supabase } from "./supabase";
import type { Product, InsertProduct, Order, InsertOrder, OrderItem, InsertOrderItem } from "@shared/schema";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  updateProductStock(id: string, newStock: number): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;

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

export class SupabaseStorage implements IStorage {
  // Helper method to map Supabase data to Product type
  private mapProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      imageUrl: row.image_url,
      imageUrls: row.image_urls || [],
      requiresPrescription: row.requires_prescription,
      stock: row.stock,
    };
  }

  private mapProducts(rows: any[]): Product[] {
    return rows.map((row) => this.mapProduct(row));
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    return data ? this.mapProducts(data) : [];
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching product:", error);
      return undefined;
    }
    return data ? this.mapProduct(data) : undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    // Ensure imageUrls contains at least the main imageUrl
    const allUrls = product.imageUrls && product.imageUrls.length > 0
      ? [product.imageUrl, ...product.imageUrls.filter(url => url !== product.imageUrl)]
      : [product.imageUrl];

    const { data, error } = await supabase
      .from("products")
      .insert([{
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image_url: product.imageUrl,
        image_urls: allUrls,
        requires_prescription: product.requiresPrescription,
        stock: product.stock,
      }])
      .select()
      .single();
    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
    return this.mapProduct(data);
  }

  async updateProduct(
    id: string,
    updates: Partial<InsertProduct>
  ): Promise<Product | undefined> {
    const mappedUpdates: any = {};
    if (updates.name) mappedUpdates.name = updates.name;
    if (updates.description) mappedUpdates.description = updates.description;
    if (updates.price) mappedUpdates.price = updates.price;
    if (updates.category) mappedUpdates.category = updates.category;
    if (updates.imageUrl) mappedUpdates.image_url = updates.imageUrl;
    
    // Handle imageUrls: ensure it always includes imageUrl + additional URLs
    if (updates.imageUrls !== undefined || updates.imageUrl !== undefined) {
      const imageUrl = updates.imageUrl;
      const imageUrls = updates.imageUrls;
      
      if (imageUrls && imageUrls.length > 0) {
        // If we have additional URLs, combine with main imageUrl
        const allUrls = imageUrl
          ? [imageUrl, ...imageUrls.filter(url => url !== imageUrl)]
          : imageUrls;
        mappedUpdates.image_urls = allUrls;
      } else if (imageUrl) {
        // If only imageUrl is updated, use it as the only image
        mappedUpdates.image_urls = [imageUrl];
      }
    }
    
    if (updates.requiresPrescription !== undefined) mappedUpdates.requires_prescription = updates.requiresPrescription;
    if (updates.stock !== undefined) mappedUpdates.stock = updates.stock;

    const { data, error } = await supabase
      .from("products")
      .update(mappedUpdates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating product:", error);
      return undefined;
    }
    return data ? this.mapProduct(data) : undefined;
  }

  async updateProductStock(id: string, newStock: number): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating product stock:", error);
      return undefined;
    }
    return data ? this.mapProduct(data) : undefined;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  // Helper method to map Supabase order data to Order type
  private mapOrder(row: any): Order {
    return {
      id: row.id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      deliveryAddress: row.delivery_address,
      deliveryCity: row.delivery_city,
      deliveryPostalCode: row.delivery_postal_code,
      total: row.total,
      status: row.status,
      createdAt: row.created_at,
    };
  }

  private mapOrders(rows: any[]): Order[] {
    return rows.map((row) => this.mapOrder(row));
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
    return data ? this.mapOrders(data) : [];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching order:", error);
      return undefined;
    }
    return data ? this.mapOrder(data) : undefined;
  }

  async getOrdersByCustomer(email: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", email);
    if (error) {
      console.error("Error fetching customer orders:", error);
      return [];
    }
    return data ? this.mapOrders(data) : [];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .insert([{
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        delivery_address: order.deliveryAddress,
        delivery_city: order.deliveryCity,
        delivery_postal_code: order.deliveryPostalCode,
        total: parseFloat(order.total),
        status: "pending",
      }])
      .select()
      .single();
    if (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }

    const newOrder = this.mapOrder(data);

    // Create order items and update stock
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await this.createOrderItem({
          orderId: newOrder.id,
          productId: item.productId,
          productName: item.productName,
          quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
          price: typeof item.price === 'string' ? item.price : String(item.price),
        });

        // Reduce product stock
        const product = await this.getProduct(item.productId);
        if (product) {
          const quantityNum = typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity;
          const newStock = Math.max(0, product.stock - quantityNum);
          await this.updateProductStock(item.productId, newStock);
        }
      }
    }

    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating order status:", error);
      return undefined;
    }
    return data ? this.mapOrder(data) : undefined;
  }

  // Helper method to map Supabase order item data to OrderItem type
  private mapOrderItem(row: any): OrderItem {
    return {
      id: row.id,
      orderId: row.order_id,
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      price: row.price,
    };
  }

  private mapOrderItems(rows: any[]): OrderItem[] {
    return rows.map((row) => this.mapOrderItem(row));
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);
    if (error) {
      console.error("Error fetching order items:", error);
      return [];
    }
    return data ? this.mapOrderItems(data) : [];
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const { data, error } = await supabase
      .from("order_items")
      .insert([{
        order_id: item.orderId,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        price: parseFloat(typeof item.price === 'string' ? item.price : String(item.price)),
      }])
      .select()
      .single();
    if (error) {
      throw new Error(`Failed to create order item: ${error.message}`);
    }
    return this.mapOrderItem(data);
  }

  // Initialization
  async seedInitialProducts(): Promise<void> {
    const existing = await this.getAllProducts();
    if (existing.length > 0) {
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

export const storage = new SupabaseStorage();
