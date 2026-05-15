import React, { useState } from 'react';
import { UserRole } from '../store/useAppStore';
import { Button, Input } from '../components/ui/core';
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
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
        try {
          if (activeTab === 'admin' && !email.endsWith('@ssdi.com')) {
             setErrorMsg("Admin harus menggunakan email berakhiran @ssdi.com");
             setLoading(false);
             return;
          }

          const userCred = await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, 'users', userCred.user.uid), {
            uid: userCred.user.uid,
            name: email.split('@')[0],
            email: email,
            role: activeTab
          });
        } catch (createError: any) {
          setErrorMsg("Gagal login atau membuat akun. (Pastikan Authentication Email/Password diaktifkan di Firebase Console).");
        }
      } else if (error.code === 'auth/operation-not-allowed') {
        setErrorMsg("Email/Password login belum diaktifkan di Firebase. Silakan ke Firebase Console > Authentication > Sign-in method > aktifkan Email/Password.");
      } else {
        setErrorMsg("Gagal login: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Left Pane - Brand / Decor */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#0A0A0A] text-white p-12 relative overflow-hidden">
        {/* Abstract decor */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-2.5 font-bold text-2xl tracking-tight mb-auto">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span>SSDI</span>
          </div>

          <div className="mb-auto mt-24">
             <h1 className="text-[64px] leading-[0.9] tracking-tight font-semibold mb-6">
               Kelola<br />
               Aset<br />
               Presisi.
             </h1>
             <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
               Sistem manajemen aset berbasis cloud untuk efisiensi operasional dan audit yang tak tertandingi.
             </p>
          </div>

          <div className="mt-auto text-sm text-gray-500 flex justify-between items-end">
            <p>&copy; {new Date().getFullYear()} SSDI Asset Management.</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <button 
            type="button" 
            onClick={() => onBack ? onBack() : window.location.href = '/'} 
            className="flex w-fit items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Selamat Datang</h2>
          <p className="text-slate-500 mb-8 font-light">Masuk ke akun Anda untuk melanjutkan</p>

          <div className="flex p-1 bg-slate-100/80 rounded-xl mb-8">
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'admin' 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Lock className="w-4 h-4" /> Admin
            </button>
            <button
              onClick={() => setActiveTab('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'user' 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserIcon className="w-4 h-4" /> Pengguna
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-start gap-3">
               <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
               <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Alamat Email</label>
              <Input 
                type="email" 
                placeholder={activeTab === 'admin' ? "admin@ssdi.com" : "user@perusahaan.com"} 
                className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-700">Kata Sandi</label>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {activeTab === 'admin' && (
              <div className="flex items-start gap-3 p-4 bg-blue-50/50 text-blue-800 text-sm rounded-xl border border-blue-100/50">
                <ShieldAlert className="w-5 h-5 shrink-0 text-blue-600" />
                <p className="leading-relaxed font-light">Login Admin memberikan Anda akses penuh ke Pengaturan, Audit Trail, dan Manajemen Karyawan.</p>
              </div>
            )}

            <Button disabled={loading} type="submit" className="w-full gap-2 mt-4 text-base bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 h-12 rounded-xl transition-all hover:scale-[1.02]">
              {loading ? "Memproses..." : "Masuk ke Sistem"} <ArrowRight className="w-4 h-4 opacity-70" />
            </Button>
          </form>

          {/* Mobile Footer */}
          <div className="mt-12 text-center text-sm text-slate-400 lg:hidden font-light">
            &copy; {new Date().getFullYear()} SSDI Asset Management.
          </div>
        </div>
      </div>
    </div>
  );
}
