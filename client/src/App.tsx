import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: any }) {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    window.location.href = "/admin/login";
    return null;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/productos" component={Catalog} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/confirmacion/:id" component={OrderConfirmation} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
