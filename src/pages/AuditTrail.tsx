import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { format } from 'date-fns';

export function AuditTrail() {
  const { auditLogs } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Audit Trail</h1>
        <p className="text-sm text-gray-500 mt-1">Lacak semua aktivitas pengguna untuk keamanan dan kepatuhan.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Log ID</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Pengguna</TableHead>
              <TableHead>Aksi</TableHead>
              <TableHead className="w-1/2">Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Belum ada log aktivitas.
                </TableCell>
              </TableRow>
            ) : (
              auditLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs text-gray-500">{log.id}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {log.user.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{log.details}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
