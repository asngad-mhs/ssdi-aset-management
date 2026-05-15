import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/core';
import { Download, FileText, FileSpreadsheet, FileBarChart } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '../lib/utils';

export function Reports() {
  const { assets } = useAppStore();

  const handleExportCSV = () => {
    // Generate simple CSV
    const headers = ['ID', 'Name', 'Category', 'Status', 'Purchase Date', 'Value', 'Location', 'Owner'];
    const csvContent = [
      headers.join(','),
      ...assets.map(a => 
        [a.id, `"${a.name}"`, `"${a.category}"`, a.status, a.purchaseDate, a.value, `"${a.location}"`, `"${a.owner}"`].join(',')
      )
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Aset_SSDI_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportMonthlyPDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    doc.setFontSize(18);
    doc.text(`Laporan Aset Bulanan - ${currentMonth}`, 14, 22);

    const tableData = assets.map(a => [
      a.id,
      a.name,
      a.category,
      a.status,
      a.purchaseDate,
      formatCurrency(a.value),
      a.location
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['ID Aset', 'Nama', 'Kategori', 'Status', 'Tanggal Pembelian', 'Nilai', 'Lokasi']],
      body: tableData,
    });

    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const finalY = (doc as any).lastAutoTable.finalY || 30;
    
    doc.setFontSize(12);
    doc.text(`Total Nilai Aset: ${formatCurrency(totalValue)}`, 14, finalY + 10);
    doc.text(`Total Item: ${assets.length}`, 14, finalY + 18);

    doc.save(`Laporan_Aset_Bulanan_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Laporan & Ekspor Data</h1>
        <p className="text-sm text-gray-500 mt-1">Hasilkan laporan mendalam dan unduh dalam berbagai format.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="w-5 h-5 text-green-600" /> Ekspor Total (CSV)</CardTitle>
            <CardDescription>Unduh semua data aset mentah ke dalam format CSV yang dapat dibuka di Excel.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full gap-2" variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4" /> Unduh Data Aset (CSV)
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Laporan Bulanan (PDF)</CardTitle>
            <CardDescription>Unduh laporan status dan nilai aset bulanan dalam format dokumen PDF.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">Menghasilkan laporan aset bulan ini dengan ringkasan nilai.</div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" onClick={handleExportMonthlyPDF}>
              <Download className="w-4 h-4" /> Unduh PDF
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-red-600" /> Laporan Ringkasan (PDF)</CardTitle>
            <CardDescription>Brosur laporan eksekutif lengkap dengan grafik dan ringkasan nilai komprehensif.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">Fitur ini tersedia pada versi Enterprise.</div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" variant="outline" disabled>
              <Download className="w-4 h-4" /> Unduh Laporan (PDF)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
