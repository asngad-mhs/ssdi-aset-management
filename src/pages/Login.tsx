import React, { useState } from 'react';
import { UserRole } from '../store/useAppStore';
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '../components/ui/core';
import { Box, Lock, User as UserIcon, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export function Login({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setErrorMsg('');

    try {
      // First try to sign in
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // If user not found, create them (for prototyping convenience)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
        try {
          if (activeTab === 'admin' && !email.endsWith('@ssdi.com')) {
             setErrorMsg("Admin harus menggunakan email berakhiran @ssdi.com");
             setLoading(false);
             return;
          }

          const userCred = await createUserWithEmailAndPassword(auth, email, password);
          // create user doc with role from activeTab
          await setDoc(doc(db, 'users', userCred.user.uid), {
            uid: userCred.user.uid,
            name: email.split('@')[0],
            email: email,
            role: activeTab
          });
        } catch (createError: any) {
          console.error("Error creating user", createError);
          setErrorMsg("Gagal login atau membuat akun. (Pastikan Authentication Email/Password diaktifkan di Firebase Console).");
        }
      } else if (error.code === 'auth/operation-not-allowed') {
        console.error("Login error", error);
        setErrorMsg("Email/Password login belum diaktifkan di Firebase. Silakan ke Firebase Console > Authentication > Sign-in method > aktifkan Email/Password.");
      } else {
        console.error("Login error", error);
        setErrorMsg("Gagal login: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Left Side - Brand/Info */}
        <div className="bg-blue-600 p-8 md:p-12 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-8">
              <Box className="w-8 h-8" />
              <span>SSDI Aset</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Mulai Kelola Aset Anda</h1>
            <p className="text-blue-100 text-lg">
              Sistem Manajemen Aset SSDI memberikan kendali penuh, monitoring real-time, dan pelaporan yang fleksibel untuk bisnis Anda.
            </p>
          </div>
          <div className="mt-12 hidden md:block text-sm text-blue-200">
            &copy; {new Date().getFullYear()} SSDI Asset Management. All rights reserved.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative">
          <div className="mb-8">
            <button 
              type="button" 
              onClick={() => onBack ? onBack() : window.location.href = '/'} 
              className="flex w-fit items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
            <p className="text-gray-500">Pilih role Anda untuk masuk ke sistem</p>
          </div>

          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'admin' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Admin
              </div>
            </button>
            <button
              onClick={() => setActiveTab('user')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'user' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserIcon className="w-4 h-4" /> Pengguna
              </div>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <Input 
                type="email" 
                placeholder={activeTab === 'admin' ? "admin@ssdi.com" : "user@perusahaan.com"} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {activeTab === 'admin' && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Login sebagai Admin memberikan Anda akses penuh ke Pengaturan, Audit Trail, dan Manajemen Karyawan/Pengguna.</p>
              </div>
            )}

            <Button disabled={loading} type="submit" className="w-full gap-2 mt-2 h-11 text-base">
              {loading ? "Memproses..." : "Masuk ke Sistem"} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 md:hidden">
            &copy; {new Date().getFullYear()} SSDI Asset Management.
          </div>
        </div>
      </div>
    </div>
  );
}
