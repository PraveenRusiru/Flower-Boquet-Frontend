import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductsTab from '@/components/dashboard/ProductsTab';
import CustomersTab from '@/components/dashboard/CustomersTab';
import OrdersTab from '@/components/dashboard/OrdersTab';
import LibraryTab from '@/components/dashboard/LibraryTab';
import { Package, Users, ShoppingBag, Image, TrendingUp, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';



const Dashboard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const { data } = useQuery({
  queryKey: ["dashboard-stats"],
  queryFn: () => dashboardApi.getStats(), // implement this
  refetchInterval: 5000, // every 5s
  refetchOnWindowFocus: true,
});
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero">
        <div className="animate-pulse text-xl font-display">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const stats = [
    { label: 'Total Products', value: data?.totalProducts, icon: Package, color: 'bg-primary' },
    { label: 'Active Orders', value: data?.totalActiveOrders, icon: ShoppingBag, color: 'bg-accent' },
    { label: 'Customers', value: data?.totalCustomers, icon: Users, color: 'bg-lavender-medium' },
    { label: 'Revenue', value: `Rs. ${data?.totalRevenue}`, icon: DollarSign, color: 'bg-mint' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Welcome back, {user?.name}
            </h1>
            <p className="text-muted-foreground">
              Manage your flower shop from one place
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="gradient-card border-0 shadow-soft hover:shadow-card transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                      <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card/80 p-1 rounded-xl shadow-soft h-auto flex-wrap">
              <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 py-3">
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="customers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 py-3">
                <Users className="w-4 h-4 mr-2" />
                Customers
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 py-3">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="library" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 py-3">
                <Image className="w-4 h-4 mr-2" />
                Library
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="animate-fade-in">
              <ProductsTab />
            </TabsContent>

            <TabsContent value="customers" className="animate-fade-in">
              <CustomersTab />
            </TabsContent>

            <TabsContent value="orders" className="animate-fade-in">
              <OrdersTab />
            </TabsContent>

            <TabsContent value="library" className="animate-fade-in">
              <LibraryTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
