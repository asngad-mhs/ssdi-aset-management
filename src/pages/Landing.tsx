import React from 'react';
import { Box, ArrowRight, ShieldCheck, Database, BarChart3, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/core';

interface LandingProps {
  onLoginClick: () => void;
}

export function Landing({ onLoginClick }: LandingProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-blue-600">
          <img src="/ssdi-logo.jfif" alt="SSDI Logo" className="w-10 h-10 object-cover rounded-xl shadow-sm border border-blue-100" />
          <span className="font-semibold text-xl tracking-tight text-gray-900">SSDI Aset</span>
        </div>
        <div>
          <Button onClick={onLoginClick} variant="outline" className="gap-2 rounded-full px-6 font-medium border-gray-200 hover:bg-gray-50">
            Masuk <ArrowRight className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          Platform Manajemen Aset Modern
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight max-w-4xl mb-8 leading-[1.1]">
          Kelola Aset Perusahaan Anda dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Cerdas dan Aman.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mb-12 leading-relaxed font-light">
          SSDI memberikan kemudahan dalam manajemen, pelacakan, dan audit aset bisnis Anda secara real-time. Skala enterprise tanpa kompromi.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button onClick={onLoginClick} size="lg" className="h-14 px-8 text-lg w-full sm:w-auto rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]">
            Mulai Sekarang
          </Button>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 font-medium">
             <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Akses admin instan
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full text-left">
          {[
            {
              icon: Database,
              color: "text-blue-600",
              bg: "bg-blue-50",
              title: "Manajemen Terpusat",
              desc: "Catat, kelola, dan akses seluruh data aset IT hingga kendaraan dalam satu platform yang terintegrasi penuh."
            },
            {
              icon: ShieldCheck,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              title: "Keamanan & Audit",
              desc: "Keamanan akses berbasis role (RBAC) dan riwayat aktivitas sistem yang transparan dan dapat diaudit kapan saja."
            },
            {
              icon: BarChart3,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
              title: "Laporan Cerdas",
              desc: "Dapatkan peringatan status aset dan laporan otomatis untuk mendukung pengambilan keputusan strategis."
            }
          ].map((feat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 ${feat.bg} ${feat.color} rounded-2xl flex items-center justify-center mb-6`}>
                <feat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10 mt-auto text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} SSDI Asset Management. Excellence built-in.</p>
      </footer>
    </div>
  );
}
