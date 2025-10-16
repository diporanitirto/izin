import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface TelegramPayload {
  nama: string;
  absen: string;
  kelas: string;
  sangga: string;
  pkKelas: string;
  alasan: string;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<TelegramPayload>;

    const requiredFields: Array<keyof TelegramPayload> = [
      'nama',
      'absen',
      'kelas',
      'sangga',
      'pkKelas',
      'alasan',
    ];

    const missingField = requiredFields.find((field) => !payload[field]);

    if (missingField) {
      return NextResponse.json(
        { error: `Field "${missingField}" wajib diisi.` },
        { status: 400 },
      );
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json(
        { error: 'Konfigurasi Telegram belum lengkap.' },
        { status: 500 },
      );
    }

    const messageLines = [
      '📬 Izin Diporani Baru',
      '',
      `Nama: ${payload.nama}`,
      `Nomor Absen: ${payload.absen}`,
      `Kelas: ${payload.kelas}`,
      `Sangga: ${payload.sangga}`,
      `Pembina Kelas: ${payload.pkKelas}`,
      '',
      'Alasan:',
      payload.alasan ?? '-',
    ];

    const message = messageLines.join('\n');

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      },
    );

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error('Telegram API error:', errorText);
      return NextResponse.json(
        { error: 'Gagal mengirim data ke Telegram.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram notify error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses permintaan.' },
      { status: 500 },
    );
  }
}
