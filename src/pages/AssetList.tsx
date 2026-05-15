import React, { useState, useMemo } from 'react';
import { useAppStore, Asset, AssetStatus } from '../store/useAppStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button, Input, Badge } from '../components/ui/core';
import { Select } from '../components/ui/select';
import { formatCurrency } from '../lib/utils';
import { Search, Plus, Filter, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui/modal';

export function AssetList({ defaultFilter = 'All', pageTitle = 'Manajemen Aset', lockFilter = false }: { defaultFilter?: string | string[], pageTitle?: string, lockFilter?: boolean }) {
  const { assets, deleteAsset, addAsset, updateAsset, currentUser } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | string[]>(defaultFilter);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const isAdmin = currentUser?.role === 'admin';
  
  // Form State
  const [formData, setFormData] = useState<Partial<Asset>>({});

  const categories = useMemo(() => {
    return Array.from(new Set(assets.map(a => a.category)));
  }, [assets]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            asset.owner.toLowerCase().includes(searchTerm.toLowerCase());
      
      const isStatusMatch = () => {
        if (filterStatus === 'All') return true;
        if (Array.isArray(filterStatus)) {
          return filterStatus.includes(asset.status);
        }
        return asset.status === filterStatus;
      };

      const matchesTags = selectedTags.length === 0 || selectedTags.includes(asset.category);
      return matchesSearch && isStatusMatch() && matchesTags;
    });
  }, [assets, searchTerm, filterStatus, selectedTags]);

  const handleOpenModal = (asset?: Asset) => {
    if (asset) {
      setEditingAsset(asset);
      setFormData(asset);
    } else {
      setEditingAsset(null);
      setFormData({
        name: '',
        category: '',
        status: 'Active',
        purchaseDate: new Date().toISOString().split('T')[0],
        value: 0,
        location: '',
        owner: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingAsset) {
      updateAsset(editingAsset.id, formData);
    } else {
      addAsset(formData as Omit<Asset, 'id' | 'lastUpdated'>);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data aset, siklus hidup, dan lokasi inventaris.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenModal()} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Aset
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Cari berdasarkan nama, ID, atau pemilik..." 
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</span>
            <Select 
              className="w-full md:w-40"
              value={Array.isArray(filterStatus) ? filterStatus.join(',') : filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              disabled={lockFilter}
              options={
                lockFilter ? [
                  { label: Array.isArray(filterStatus) ? 'Beberapa Status' : filterStatus, value: Array.isArray(filterStatus) ? filterStatus.join(',') : filterStatus }
                ] : [
                  { label: 'Semua Status', value: 'All' },
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Active', value: 'Active' },
                  { label: 'Maintenance', value: 'Maintenance' },
                  { label: 'Deprecated', value: 'Deprecated' },
                  { label: 'Disposed', value: 'Disposed' },
                ]
              }
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500 mr-1">Kategori:</span>
          {categories.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTags.includes(tag) 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button 
              onClick={() => setSelectedTags([])}
              className="px-3 py-1 rounded-full text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Reset Tag
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Aset</TableHead>
              <TableHead>Nama Aset</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Nilai (IDR)</TableHead>
              {isAdmin && <TableHead className="text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-8 text-gray-500">
                  Tidak ada aset yang ditemukan dengan filter saat ini.
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map(asset => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium text-gray-900">{asset.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{asset.name}</div>
                    <div className="text-xs text-gray-500">{asset.owner}</div>
                  </TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>
                    <Badge variant={
                      asset.status === 'Active' ? 'success' :
                      asset.status === 'Maintenance' ? 'warning' :
                      asset.status === 'Pending' ? 'secondary' :
                      asset.status === 'Deprecated' ? 'secondary' : 'destructive'
                    }>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{asset.location}</TableCell>
                  <TableCell className="text-gray-900 font-medium">{formatCurrency(asset.value)}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 text-gray-400">
                        <button onClick={() => handleOpenModal(asset)} className="p-1 hover:text-blue-600 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteAsset(asset.id)} className="p-1 hover:text-red-600 transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingAsset ? "Edit Aset" : "Tambah Aset Baru"}
        description={editingAsset ? `Perbarui informasi untuk ${editingAsset.id}` : "Masukkan detail aset baru ke dalam sistem."}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan Data</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Aset</label>
              <Input 
                value={formData.name || ''} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ex. MacBook Pro M2" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kategori</label>
              <Input 
                value={formData.category || ''} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                placeholder="Ex. Elektronik" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select 
                value={formData.status || 'Active'} 
                onChange={e => setFormData({...formData, status: e.target.value as AssetStatus})}
                options={[
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Active', value: 'Active' },
                  { label: 'Maintenance', value: 'Maintenance' },
                  { label: 'Deprecated', value: 'Deprecated' },
                  { label: 'Disposed', value: 'Disposed' },
                ]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nilai (IDR)</label>
              <Input 
                type="number" 
                value={formData.value || 0} 
                onChange={e => setFormData({...formData, value: Number(e.target.value)})} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Lokasi</label>
            <Input 
              value={formData.location || ''} 
              onChange={e => setFormData({...formData, location: e.target.value})} 
              placeholder="Ex. Ruang Server Lt 2" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Pemilik / Penanggung Jawab</label>
              <Input 
                value={formData.owner || ''} 
                onChange={e => setFormData({...formData, owner: e.target.value})} 
                placeholder="Ex. John Doe / IT Dept" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tanggal Pembelian</label>
              <Input 
                type="date" 
                value={formData.purchaseDate || ''} 
                onChange={e => setFormData({...formData, purchaseDate: e.target.value})} 
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
