import { NextResponse } from 'nextserver';
import Papa from 'papaparse';

export const revalidate = false;

export async function GET() {
  try {
    const urls = {
      pencacah process.env.SECURE_PENCACAH_CSV_URL  httpsse-2026-palembang.vercel.appProgress_Pencacah.csv,
      pengawas process.env.SECURE_PENGAWAS_CSV_URL  httpsse-2026-palembang.vercel.appProgress_Pengawas.csv
    };

    const [resPencacah, resPengawas] = await Promise.all([
      fetch(urls.pencacah, { next { tags ['census-data'] }, cache 'force-cache' }),
      fetch(urls.pengawas, { next { tags ['census-data'] }, cache 'force-cache' })
    ]);

    const txtPencacah = await resPencacah.text();
    const txtPengawas = await resPengawas.text();

    const dataPencacah = Papa.parse(txtPencacah, { header true, delimiter ';' }).data;
    const dataPengawas = Papa.parse(txtPengawas, { header true, delimiter ';' }).data;

     Fungsi untuk membuang kolom email tetapi mempertahankan data lainnya
    const filterData = (dataset) = {
      return dataset
        .filter(row = row['FirstOfNama Lengkap'])  Hanya ambil baris yang valid
        .map(row = {
          const safeRow = { ...row };
           Hapus variasi nama kolom email yang mungkin ada di CSV
          delete safeRow['Email'];
          delete safeRow['petugas email'];
          delete safeRow['Alamat Email'];
          return safeRow;
        });
    };

    return NextResponse.json({
      success true,
      lastUpdated new Date().toISOString(),
      pencacah filterData(dataPencacah),
      pengawas filterData(dataPengawas)
    });
  } catch (error) {
    return NextResponse.json({ success false, error error.message }, { status 500 });
  }
}