import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerProfile } from "@/components/customer/profile"
import { CustomerOrders } from "@/components/customer/order"
import { CustomerSettings } from "@/components/customer/setting"

export default function CustomerDetailPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Customer Details</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <CustomerProfile />
        </TabsContent>
        <TabsContent value="orders">
          <CustomerOrders />
        </TabsContent>
        <TabsContent value="settings">
          <CustomerSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

