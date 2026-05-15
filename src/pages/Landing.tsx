import React from 'react';
import { Box, ArrowRight, ShieldCheck, Database, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/core';

interface LandingProps {
  onLoginClick: () => void;
}

export function Landing({ onLoginClick }: LandingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600">
          <Box className="w-8 h-8" />
          <span className="font-bold text-xl text-gray-900">SSDI Aset</span>
        </div>
        <div>
          <Button onClick={onLoginClick} className="gap-2">
            Login <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1 text-sm font-medium rounded-full">
          Platform Manajemen Aset Modern
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight max-w-3xl mb-6">
          Kelola Aset Perusahaan Anda dengan Cerdas dan Aman.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
          SSDI Aset memberikan kemudahan dalam manajemen, pelacakan, dan audit aset bisnis Anda secara real-time. Didesain untuk skala enterprise dengan keamanan tingkat tinggi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={onLoginClick} size="lg" className="h-14 px-8 text-lg w-full sm:w-auto">
            Mulai Sekarang
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manajemen Terpusat</h3>
            <p className="text-gray-600">
              Catat, kelola, dan akses seluruh data aset IT hingga kendaraan dalam satu platform yang terintegrasi.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Keamanan & Audit Log</h3>
            <p className="text-gray-600">
              Keamanan akses berbasis role (RBAC) dan riwayat aktivitas sistem yang transparan dan dapat diaudit.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Notifikasi & Laporan</h3>
            <p className="text-gray-600">
              Dapatkan peringatan status aset dan laporan otomatis untuk mendukung pengambilan keputusan.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} SSDI Asset Management. All rights reserved.</p>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={className}>{children}</span>;
}
