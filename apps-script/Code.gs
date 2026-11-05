/**
 * JEJAK · Penerima jawaban murid ke Google Sheet (v2)
 * Modul 3 Informatika & KKA Kelas IX · SMP Labschool Jakarta
 *
 * 1. Ganti KUNCI_GURU di bawah dengan kata sandi pilihan Bapak/Ibu (jangan dibagikan ke murid).
 * 2. Isi tab "Murid" (Kelas | Absen | Nama) lalu jalankan fungsi siapkan() sekali.
 * 3. Terapkan sebagai Aplikasi Web (lihat README.md).
 */
const KUNCI_GURU = 'ganti-dengan-kunci-rahasia';
const NAMA_SHEET = 'Jawaban';
const KOLOM = ['Waktu', 'Nama', 'Kelas', 'Absen', 'Kelompok', 'Pertemuan', 'Kegiatan', 'Judul Kegiatan', 'Skor', 'Skor Maks', 'Ringkasan', 'Jawaban (JSON)', 'Dikirim oleh'];
const KUNCI_JSON = ['waktu', 'nama', 'kelas', 'absen', 'kelompok', 'pertemuan', 'kegiatan', 'judul', 'skor', 'maks', 'ringkasan', 'jawaban', 'oleh'];
// Hanya untuk pengisian awal tab Murid. Biarkan kosong di repo publik.
const MURID_AWAL = [];

function tab_(nama, kolom) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(nama);
  if (!sh) sh = ss.insertSheet(nama);
  if (sh.getLastRow() === 0) {
    sh.appendRow(kolom);
    sh.getRange(1, 1, 1, kolom.length).setFontWeight('bold').setBackground('#0F3D3E').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  }
  return sh;
}

function ambilSheet_() {
  const sh = tab_(NAMA_SHEET, KOLOM);
  if (sh.getLastColumn() < KOLOM.length) {
    sh.getRange(1, 1, 1, KOLOM.length).setValues([KOLOM]).setFontWeight('bold').setBackground('#0F3D3E').setFontColor('#FFFFFF');
  }
  return sh;
}

function murid_(kelas) {
  const nilai = tab_('Murid', ['Kelas', 'Absen', 'Nama']).getDataRange().getValues();
  nilai.shift();
  return nilai.filter(r => String(r[0]).trim() === kelas && r[2])
    .map(r => ({ absen: String(r[1]).trim(), nama: String(r[2]).trim() }))
    .sort((a, b) => Number(a.absen) - Number(b.absen));
}

function kodeKelas_() {
  const sh = tab_('KodeKelas', ['Kelas', 'Kode']);
  const nilai = sh.getDataRange().getValues();
  nilai.shift();
  const o = {};
  nilai.forEach(r => { if (r[0]) o[String(r[0]).trim()] = String(r[1]).trim().toUpperCase(); });
  return o;
}

function kodeBenar_(kelas, kode) {
  const k = kodeKelas_()[kelas];
  return !!k && k === String(kode || '').trim().toUpperCase();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function aman_(v) {
  return (typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : v; // cegah rumus disisipkan murid
}

/** Menerima kiriman jawaban dari web murid. Kegiatan kelompok dicatat untuk setiap anggota. */
function doPost(e) {
  const kunci = LockService.getScriptLock();
  try {
    kunci.waitLock(20000);
    const d = JSON.parse(e.postData.contents);
    if (!d.nama || !d.kelas || !d.pertemuan || !d.kegiatan) return json_({ ok: false, pesan: 'Data tidak lengkap' });
    const baris = (data) => KUNCI_JSON.map(k => {
      let v = data[k] === undefined ? '' : data[k];
      if (k === 'waktu') v = new Date(v || Date.now());
      return aman_(v);
    });
    const sh = ambilSheet_();
    const anggota = Array.isArray(d.anggota) ? d.anggota.map(String) : [];
    if (anggota.length) {
      const daftar = murid_(d.kelas);
      const rows = [...new Set([String(d.absen), ...anggota])].map(ab => {
        const m = daftar.find(x => x.absen === ab);
        return baris(Object.assign({}, d, { absen: ab, nama: m ? m.nama : (ab === String(d.absen) ? d.nama : 'Absen ' + ab), oleh: d.nama }));
      });
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, KOLOM.length).setValues(rows);
      return json_({ ok: true, jumlah: rows.length });
    }
    sh.appendRow(baris(Object.assign({}, d, { oleh: d.nama })));
    return json_({ ok: true, jumlah: 1 });
  } catch (err) {
    return json_({ ok: false, pesan: String(err) });
  } finally {
    kunci.releaseLock();
  }
}

function baca_() {
  const nilai = ambilSheet_().getDataRange().getValues();
  nilai.shift();
  return nilai.map(r => {
    const o = {};
    KUNCI_JSON.forEach((k, i) => { o[k] = r[i] instanceof Date ? r[i].toISOString() : (r[i] === undefined ? '' : r[i]); });
    o.absen = String(o.absen);
    delete o.jawaban;
    return o;
  });
}

/**
 * aksi=murid&kelas=IX-A&kode=XXXX           → daftar nama satu kelas (perlu kode kelas)
 * aksi=status&kelas&kode&absen&pertemuan&kegiatan → apakah kegiatan sudah tercatat untuk murid ini
 * aksi=rekap&kunci&kelas&pertemuan&kegiatan → rekap untuk guru + daftar murid kelas
 * aksi=kode&kunci                           → daftar kode kelas untuk guru
 */
function doGet(e) {
  const p = e.parameter || {};
  if (p.aksi === 'murid') {
    if (!kodeBenar_(p.kelas, p.kode)) return json_({ ok: false, pesan: 'Kode kelas salah' });
    return json_({ ok: true, data: murid_(p.kelas) });
  }
  if (p.aksi === 'status') {
    if (!kodeBenar_(p.kelas, p.kode)) return json_({ ok: false, pesan: 'Kode kelas salah' });
    const r = baca_().filter(o => o.kelas === p.kelas && o.absen === String(p.absen) && o.pertemuan === p.pertemuan && o.kegiatan === p.kegiatan).pop();
    return json_({ ok: true, ada: !!r, oleh: r ? r.oleh : '', waktu: r ? r.waktu : '' });
  }
  if (p.aksi === 'rekap') {
    if (p.kunci !== KUNCI_GURU) return json_({ ok: false, pesan: 'Kunci guru salah' });
    const data = baca_().filter(o => (!p.kelas || o.kelas === p.kelas) && (!p.pertemuan || o.pertemuan === p.pertemuan) && (!p.kegiatan || o.kegiatan === p.kegiatan));
    return json_({ ok: true, data: data, murid: p.kelas ? murid_(p.kelas) : [] });
  }
  if (p.aksi === 'kode') {
    if (p.kunci !== KUNCI_GURU) return json_({ ok: false, pesan: 'Kunci guru salah' });
    return json_({ ok: true, data: kodeKelas_() });
  }
  return json_({ ok: true, pesan: 'JEJAK aktif', versi: 2 });
}

/** Jalankan sekali dari editor: membuat tab, mengisi Murid dari MURID_AWAL (jika ada), dan membuat kode kelas. */
function siapkan() {
  ambilSheet_();
  const sm = tab_('Murid', ['Kelas', 'Absen', 'Nama']);
  if (MURID_AWAL.length && sm.getLastRow() < 2) sm.getRange(2, 1, MURID_AWAL.length, 3).setValues(MURID_AWAL);
  const sk = tab_('KodeKelas', ['Kelas', 'Kode']);
  const ada = kodeKelas_();
  const kelas = [...new Set(sm.getDataRange().getValues().slice(1).map(r => String(r[0]).trim()).filter(Boolean))].sort();
  const huruf = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  kelas.filter(k => !ada[k]).forEach(k => {
    let kode = '';
    for (let i = 0; i < 4; i++) kode += huruf[Math.floor(Math.random() * huruf.length)];
    sk.appendRow([k, kode]);
  });
}
