import { NextResponse } from 'next/server';
import Papa from 'papaparse';

export const revalidate = false; // Forces compliance data caching until explicit cron invalidation tags are invoked

export async function GET() {
  try {
    const urls = {
      pencacah: process.env.SECURE_PENCACAH_CSV_URL || "https://se-2026-palembang.vercel.app/Progress_Pencacah.csv",
      pengawas: process.env.SECURE_PENGAWAS_CSV_URL || "https://se-2026-palembang.vercel.app/Progress_Pengawas.csv"
    };

    const [resPencacah, resPengawas] = await Promise.all([
      fetch(urls.pencacah, { next: { tags: ['census-data'] }, cache: 'force-cache' }),
      fetch(urls.pengawas, { next: { tags: ['census-data'] }, cache: 'force-cache' })
    ]);

    const txtPencacah = await resPencacah.text();
    const txtPengawas = await resPengawas.text();

    const dataPencacah = Papa.parse(txtPencacah, { header: true, delimiter: ';' }).data;
    const dataPengawas = Papa.parse(txtPengawas, { header: true, delimiter: ';' }).data;

    const processAggregate = (dataset) => {
      const summaryMap = {};
      
      dataset.forEach(row => {
        const kec = row['FirstOfnmkec'];
        const rawProgress = row['Persentase Progress'];
        if (!kec) return;

        const progressNum = parseFloat(String(rawProgress).replace('%', '').trim()) || 0;

        if (!summaryMap[kec]) {
          summaryMap[kec] = { totalWorkers: 0, cumulativeProgress: 0 };
        }
        summaryMap[kec].totalWorkers += 1;
        summaryMap[kec].cumulativeProgress += progressNum;
      });

      return Object.entries(summaryMap).map(([name, stats]) => ({
        kecamatan: name,
        workerCount: stats.totalWorkers,
        averageProgress: Math.round((stats.cumulativeProgress / stats.totalWorkers) * 100) / 100
      }));
    };

    return NextResponse.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      pencacah: processAggregate(dataPencacah),
      pengawas: processAggregate(dataPengawas)
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}