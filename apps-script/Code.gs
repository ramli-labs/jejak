/**
 * JEJAK · Penerima jawaban murid ke Google Sheet
 * Modul 3 Informatika & KKA Kelas IX · SMP Labschool Jakarta
 *
 * 1. Ganti KUNCI_GURU di bawah dengan kata sandi pilihan Bapak/Ibu (jangan dibagikan ke murid).
 * 2. Terapkan sebagai Aplikasi Web (lihat README.md).
 */
const KUNCI_GURU = 'ganti-dengan-kunci-rahasia';
const NAMA_SHEET = 'Jawaban';
const KOLOM = ['Waktu', 'Nama', 'Kelas', 'Absen', 'Kelompok', 'Pertemuan', 'Kegiatan', 'Judul Kegiatan', 'Skor', 'Skor Maks', 'Ringkasan', 'Jawaban (JSON)'];
const KUNCI_JSON = ['waktu', 'nama', 'kelas', 'absen', 'kelompok', 'pertemuan', 'kegiatan', 'judul', 'skor', 'maks', 'ringkasan', 'jawaban'];

function ambilSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(NAMA_SHEET);
  if (!sh) sh = ss.insertSheet(NAMA_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(KOLOM);
    sh.getRange(1, 1, 1, KOLOM.length).setFontWeight('bold').setBackground('#0F3D3E').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
    sh.setColumnWidth(11, 420);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Menerima kiriman jawaban dari web murid. */
function doPost(e) {
  const kunci = LockService.getScriptLock();
  try {
    kunci.waitLock(20000);
    const d = JSON.parse(e.postData.contents);
    if (!d.nama || !d.kelas || !d.pertemuan || !d.kegiatan) return json_({ ok: false, pesan: 'Data tidak lengkap' });
    const baris = KUNCI_JSON.map(k => {
      let v = d[k] === undefined ? '' : d[k];
      if (k === 'waktu') v = new Date(v || Date.now());
      if (typeof v === 'string' && /^[=+\-@]/.test(v)) v = "'" + v; // cegah rumus disisipkan murid
      return v;
    });
    ambilSheet_().appendRow(baris);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, pesan: String(err) });
  } finally {
    kunci.releaseLock();
  }
}

/** Rekap untuk mode guru: ?aksi=rekap&kunci=...&kelas=IX-A&pertemuan=P1&kegiatan=sortir */
function doGet(e) {
  const p = e.parameter || {};
  if (p.aksi !== 'rekap') return json_({ ok: true, pesan: 'JEJAK aktif' });
  if (p.kunci !== KUNCI_GURU) return json_({ ok: false, pesan: 'Kunci guru salah' });
  const sh = ambilSheet_();
  const nilai = sh.getDataRange().getValues();
  nilai.shift();
  const data = nilai.map(r => {
    const o = {};
    KUNCI_JSON.forEach((k, i) => { o[k] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
    delete o.jawaban;
    return o;
  }).filter(o => (!p.kelas || o.kelas === p.kelas) && (!p.pertemuan || o.pertemuan === p.pertemuan) && (!p.kegiatan || o.kegiatan === p.kegiatan));
  return json_({ ok: true, data: data });
}

/** Jalankan sekali dari editor untuk membuat sheet dan memberi izin. */
function siapkan() {
  ambilSheet_();
}
