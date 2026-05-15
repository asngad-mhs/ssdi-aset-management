import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Badge } from '../components/ui/core';
import { useAppStore, User, UserRole } from '../store/useAppStore';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

export function Settings() {
  const currentUser = useAppStore((state) => state.currentUser);
  const users = useAppStore((state) => state.users);
  const createUser = useAppStore((state) => state.createUser);
  const updateUser = useAppStore((state) => state.updateUser);
  const deleteUser = useAppStore((state) => state.deleteUser);

  const [isEditing, setIsEditing] = useState(false);
  const [currentUserEdit, setCurrentUserEdit] = useState<Partial<User>>({});

  const handleSaveUser = async () => {
    if (!currentUserEdit.email || !currentUserEdit.name) return;
    
    const role: UserRole = currentUserEdit.email.endsWith('@ssdi.com') ? 'admin' : 'user';

    try {
      if (currentUserEdit.id) {
        await updateUser(currentUserEdit.id, { 
          name: currentUserEdit.name, 
          email: currentUserEdit.email,
          role 
        });
      } else {
        await createUser({ 
          name: currentUserEdit.name, 
          email: currentUserEdit.email, 
          role 
        });
      }
      setIsEditing(false);
      setCurrentUserEdit({});
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan pengguna.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      await deleteUser(id);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pengaturan Sistem</h1>
        <p className="text-sm text-gray-500 mt-1">Konfigurasi pengaturan aplikasi, kustomisasi alur kerja, dan manajemen pengguna.</p>
      </div>

      <div className="grid gap-6">
        {currentUser?.role === 'admin' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Manajemen Pengguna</CardTitle>
                <CardDescription>Tambah, ubah, dan hapus akses karyawan/pengguna sistem.</CardDescription>
              </div>
              <Button 
                onClick={() => { setIsEditing(true); setCurrentUserEdit({}); }}
                className="gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" /> Tambah User
              </Button>
            </CardHeader>
            <CardContent>
              {isEditing && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{currentUserEdit.id ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h4>
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-900">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <Input 
                        placeholder="John Doe" 
                        value={currentUserEdit.name || ''}
                        onChange={(e) => setCurrentUserEdit({...currentUserEdit, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <Input 
                        placeholder="john@example.com" 
                        type="email"
                        value={currentUserEdit.email || ''}
                        onChange={(e) => setCurrentUserEdit({...currentUserEdit, email: e.target.value})}
                      />
                      <p className="text-xs text-gray-500">Gunakan @ssdi.com untuk hak akses Admin.</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSaveUser}>Simpan Pengguna</Button>
                  </div>
                </div>
              )}

              <div className="border border-gray-200 rounded-md overflow-x-auto">
                <table className="w-full text-sm text-left min-w-max">
                  <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nama</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                        <td className="px-4 py-3 text-gray-500">{user.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-500 hover:text-blue-600"
                              onClick={() => {
                                setIsEditing(true);
                                setCurrentUserEdit(user);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-500 hover:text-red-600"
                              disabled={currentUser?.id === user.id}
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                          Memuat data pengguna...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Keamanan & Auditing</CardTitle>
            <CardDescription>Pengaturan level keamanan aplikasi dan log aktivitas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="font-medium">Force Rekam Audit Trail</div>
                <div className="text-sm text-gray-500">Mewajibkan rekam histori pada setiap operasi CRUD.</div>
              </div>
              <div className="bg-blue-600 w-11 h-6 rounded-full relative cursor-pointer">
                <div className="bg-white w-4 h-4 rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="font-medium">Autentikasi Dua Faktor (2FA)</div>
                <div className="text-sm text-gray-500">Gunakan Authenticator App untuk login.</div>
              </div>
              <div className="bg-gray-200 w-11 h-6 rounded-full relative cursor-pointer">
                <div className="bg-white w-4 h-4 rounded-full absolute left-1 top-1"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrasi Sistem Existing</CardTitle>
            <CardDescription>Manajemen Webhooks & API Keys untuk menyambung ke ERP / Manajemen Aset lainnya.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Webhook URL Sinkronisasi</label>
              <div className="flex gap-2">
                <Input defaultValue="https://api.perusahaananda.com/v1/sync" className="font-mono text-sm" />
                <Button variant="outline">Test</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Client API Key</label>
              <div className="flex gap-2">
                <Input defaultValue="sk_live_XXXXXXXXXXXXXXXXXXXXXXX" type="password" />
                <Button variant="outline">Regenerate</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kustomisasi Alur Kerja</CardTitle>
            <CardDescription>Atur status kustom dan alur persetujuan peminjaman aset.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md border border-gray-200">
              Pengaturan modul alur kerja persetujuan (Approval Workflow) sedang dalam mode Beta. Hubungi admin sistem.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
