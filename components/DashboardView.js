'use client';

import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DashboardView() {
  const [selectedRole, setSelectedRole] = useState(null);
  const { data, error, isLoading } = useSWR('/api/stats', fetcher, {
    refreshInterval: 60000 * 5 
  });

  // Halaman Loading Awal
  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-emerald-200 rounded-full mb-4"></div>
          <div className="text-slate-500 font-medium">Menyinkronkan Data BPS...</div>
        </div>
      </div>
    );
  }

  // Layar Pemilihan (Landing Screen)
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Portal Data SE2026 Palembang
            </h1>
            <p className="text-lg text-slate-600">
              Silakan pilih kategori operasional yang ingin Anda pantau.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <button 
              onClick={() => setSelectedRole('pencacah')}
              className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 transition-all text-left"
            >
              <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Pencacah Petugas PPL</h2>
              <p className="text-sm text-slate-500">Tampilkan data progres lapangan dan identitas petugas pencacah.</p>
            </button>

            <button 
              onClick={() => setSelectedRole('pengawas')}
              className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 transition-all text-left"
            >
              <div className="h-14 w-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Pengawas Lapangan</h2>
              <p className="text-sm text-slate-500">Tampilkan data rekapitulasi dan kendali mutu dari supervisor.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const dataset = data?.success ? data[selectedRole] : [];
  
  // Mengekstrak nama-nama kolom secara dinamis dari baris pertama data
  const tableHeaders = dataset.length > 0 ? Object.keys(dataset[0]) : [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Navigasi */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 capitalize">
              Data {selectedRole.replace('-', ' ')}
            </h1>
            <p className="text-sm text-slate-500">Menampilkan {dataset.length} baris data (Email disembunyikan)</p>
          </div>
          <button 
            onClick={() => setSelectedRole(null)}
            className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
          >
            ← Kembali ke Menu
          </button>
        </div>

        {/* Tabel Data Dinamis */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    No
                  </th>
                  {tableHeaders.map((header, idx) => (
                    <th 
                      key={idx} 
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {dataset.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                      {rowIndex + 1}
                    </td>
                    {tableHeaders.map((header, colIndex) => (
                      <td 
                        key={colIndex} 
                        className="px-6 py-4 whitespace-nowrap text-sm text-slate-700"
                      >
                        {row[header] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {dataset.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                Tidak ada data yang tersedia untuk ditampilkan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}