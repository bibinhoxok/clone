import type React from "react"
import {
  Home,
  Package,
  List,
  FileText,
  Users,
  Gift,
  BarChart,
  Wallet,
  Code,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react"

export default function Sidebar() {
  return (
    <div className="w-64 bg-indigo-900 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <Package className="w-8 h-8" />
        <span className="text-xl font-bold">eBazar</span>
      </div>

      <nav className="space-y-1">
        <NavItem icon={<Home />} label="Dashboard" />
        <NavItem icon={<Package />} label="Products" active />
        <NavItem icon={<List />} label="Categories" />
        <NavItem icon={<FileText />} label="Orders" />
        <NavItem icon={<Users />} label="Customers" />
        <NavItem icon={<Gift />} label="Sales Promotion" />
        <NavItem icon={<BarChart />} label="Inventory" />
        <NavItem icon={<Wallet />} label="Accounts" />
        <NavItem icon={<Code />} label="App" />
        <NavItem icon={<MapPin />} label="Store Locator" />
        <NavItem icon={<Settings />} label="UI Components" />
        <NavItem icon={<LogOut />} label="Other Pages" />
      </nav>
    </div>
  )
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        active ? "bg-indigo-800" : "hover:bg-indigo-800/50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  )
}

