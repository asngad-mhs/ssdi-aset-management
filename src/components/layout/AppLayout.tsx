import React from "react";
import { 
  LayoutDashboard, 
  Box, 
  History, 
  Settings, 
  Bell, 
  Search, 
  Menu,
  X,
  PieChart,
  LogOut
} from "lucide-react";
import { Button, Input, Badge } from "../ui/core";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

export function AppLayout({ children, activePath, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const { notifications, markAllNotificationsRead, markNotificationRead, currentUser, logout } = useAppStore();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const allNavItems = [
    { name: "Dashboard", path: "dashboard", icon: LayoutDashboard },
    { name: "Semua Aset", path: "assets", icon: Box },
    { name: "Aset Pengajuan", path: "assets-pengajuan", icon: Box },
    { name: "Aset Terpakai", path: "assets-terpakai", icon: Box },
    { name: "Aset Tidak Dipakai", path: "assets-tidak-dipakai", icon: Box },
    { name: "Aset Rusak", path: "assets-rusak", icon: Box },
    { name: "Laporan & Ekspor", path: "reports", icon: PieChart },
    { name: "Audit Trail", path: "audit", icon: History, adminOnly: true },
    { name: "Pengaturan", path: "settings", icon: Settings, adminOnly: true },
  ];

  const navItems = allNavItems.filter(item => !item.adminOnly || currentUser?.role === 'admin');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl tracking-tight">
            <Box className="w-6 h-6" />
            <span>SSDI Aset</span>
          </div>
          <button 
            className="ml-auto lg:hidden text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                onNavigate(item.path);
                setSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activePath === item.path 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", activePath === item.path ? "text-blue-600" : "text-gray-400")} />
              {item.name}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentUser?.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
              {currentUser?.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col text-left flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 truncate">{currentUser?.name}</span>
              <span className="text-xs text-gray-500 truncate">{currentUser?.email}</span>
            </div>
            <button 
              onClick={() => logout()}
              title="Logout"
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors ml-auto"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center relative w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />
              <Input placeholder="Pencarian global..." className="pl-9 bg-gray-50 border-transparent focus:bg-white" />
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <button 
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notifOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-semibold text-sm">Notifikasi Real-time</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">Tidak ada notifikasi</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={cn(
                          "px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
                          !n.isRead && "bg-blue-50/30"
                        )}
                        onClick={() => markNotificationRead(n.id)}
                      >
                        <div className="flex gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-1.5 shrink-0",
                            n.type === 'alert' ? "bg-red-500" :
                            n.type === 'warning' ? "bg-yellow-500" :
                            n.type === 'success' ? "bg-green-500" : "bg-blue-500"
                          )} />
                          <div>
                            <p className={cn("text-sm transition-colors", !n.isRead ? "text-gray-900 font-medium" : "text-gray-600")}>
                              {n.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(n.timestamp).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
