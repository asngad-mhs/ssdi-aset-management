import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/core';
import { formatCurrency } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Monitor, Server, Car, PackageCheck, AlertCircle, Wrench } from 'lucide-react';

export function Dashboard() {
  const { assets, auditLogs } = useAppStore();

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const activeAssets = assets.filter(a => a.status === 'Active').length;
  const maintenanceAssets = assets.filter(a => a.status === 'Maintenance').length;
  
  // Chart Data
  const categoriesMap = assets.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const pieData = Object.entries(categoriesMap).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const statusData = [
    { name: 'Active', count: activeAssets, fill: '#10b981' },
    { name: 'Maintenance', count: maintenanceAssets, fill: '#f59e0b' },
    { name: 'Deprecated', count: assets.filter(a => a.status === 'Deprecated').length, fill: '#6b7280' },
    { name: 'Disposed', count: assets.filter(a => a.status === 'Disposed').length, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Aset</h1>
          <p className="text-sm text-gray-500 mt-1">Ringkasan kondisi aset perusahaan Anda saat ini.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-gray-500">Total Nilai Aset</p>
              <PackageCheck className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-gray-500 mt-1">Dari {assets.length} total item</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-gray-500">Aset Aktif</p>
              <Monitor className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{activeAssets}</div>
            <p className="text-xs text-green-600 mt-1">+2% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-gray-500">Dalam Perbaikan</p>
              <Wrench className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{maintenanceAssets}</div>
            <p className="text-xs text-yellow-600 mt-1">Perlu perhatian segera</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-gray-500">Aktivitas Terkini</p>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{auditLogs.length}</div>
            <p className="text-xs text-gray-500 mt-1">Tercatat di audit log</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Distribusi Status Aset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Kategori Aset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
