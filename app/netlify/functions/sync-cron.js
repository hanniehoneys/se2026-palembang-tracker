const { schedule } = require('@netlify/functions');

// Jadwal: Menit 0, Jam 0 & 12 UTC (sama dengan 07:00 & 19:00 WIB)
exports.handler = schedule('0 0,12 * * *', async (event) => {
  // Netlify akan otomatis menyediakan environment variable "URL" untuk domain kamu
  const baseUrl = process.env.URL; 
  
  try {
    const response = await fetch(`${baseUrl}/api/cron/revalidate`, {
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`
      }
    });

    const data = await response.json();
    console.log("Cron berhasil dijalankan:", data);
    
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    console.error("Cron gagal:", error);
    return { statusCode: 500, body: error.toString() };
  }
});