import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertProductSchema, type Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, LogOut, Edit, Trash2, X } from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: products = [] as Product[], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
      category: "Medicamentos",
      imageUrl: "",
      imageUrls: [] as any,
      requiresPrescription: 0,
      stock: 100,
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast({ title: "Sesión cerrada" });
    setLocation("/");
  };

  const onSubmit = async (values: any) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (editingProduct) {
        await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        toast({ title: "Producto actualizado" });
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        toast({ title: "Producto creado" });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("¿Estás seguro que deseas eliminar este producto?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Producto eliminado" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      imageUrls: (product.imageUrls || []) as any,
      requiresPrescription: product.requiresPrescription,
      stock: product.stock,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Panel Admin</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de Productos</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingProduct(null);
                form.reset();
              }} data-testid="button-create-product">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input data-testid="input-product-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Input data-testid="input-product-description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="0.00" data-testid="input-product-price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <FormControl>
                          <select
                            data-testid="select-category"
                            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
                            {...field}
                          >
                            <option>Medicamentos</option>
                            <option>Suplementos</option>
                            <option>Cuidado Personal</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de Imagen Principal</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            data-testid="input-product-imageUrl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrls"
                    render={({ field }) => {
                      const [newUrl, setNewUrl] = useState("");
                      return (
                        <FormItem>
                          <FormLabel>URLs de Imágenes Adicionales</FormLabel>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                placeholder="https://ejemplo.com/imagen2.jpg"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                data-testid="input-additional-imageUrl"
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  if (newUrl.trim()) {
                                    const updated = [...(field.value || []), newUrl];
                                    field.onChange(updated);
                                    setNewUrl("");
                                  }
                                }}
                                data-testid="button-add-image"
                              >
                                Agregar
                              </Button>
                            </div>
                            {field.value && field.value.length > 0 && (
                              <div className="space-y-2">
                                {field.value.map((url: string, index: number) => (
                                  <div key={index} className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-2 rounded">
                                    <span className="text-sm truncate text-slate-600 dark:text-slate-400">{url}</span>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        const updated = field.value!.filter((_: string, i: number) => i !== index);
                                        field.onChange(updated);
                                      }}
                                      data-testid={`button-remove-image-${index}`}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" data-testid="input-product-stock" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" data-testid="button-save-product">
                    {editingProduct ? "Actualizar" : "Crear"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Cargando productos...</div>
        ) : (
          <div className="grid gap-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Precio</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Stock</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Categoría</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(products as Product[]).map((product: Product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                      data-testid={`row-product-${product.id}`}
                    >
                      <td className="py-3 px-4 text-slate-900 dark:text-white">{product.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">${product.price}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{product.stock}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{product.category}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          data-testid={`button-edit-${product.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                          data-testid={`button-delete-${product.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
