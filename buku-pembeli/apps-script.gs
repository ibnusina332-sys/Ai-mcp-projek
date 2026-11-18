/**
 * Buku Pembeli — backend Google Sheets
 * Tampal kod ini dalam Extensions > Apps Script pada Google Sheet anda.
 * Lihat PANDUAN.md untuk langkah penuh.
 */

// 1) TUKAR kata laluan ini. Semua orang yang guna website perlu masukkan kata laluan ini.
const KATA_LALUAN = "tukar-kata-laluan-ini";

const NAMA_SHEET = "Pembeli";
const LAJUR = ["id", "name", "phone", "address", "purchaseDate", "note", "createdAt", "updatedAt"];
const MEDAN = ["name", "phone", "address", "purchaseDate", "note"];

function doGet() {
  return out_({ ok: true, message: "Buku Pembeli API sedang berjalan." });
}

function doPost(e) {
  let req;
  try {
    req = JSON.parse(e.postData.contents);
  } catch (err) {
    return out_({ ok: false, error: "bad_request" });
  }
  if (!req || req.pass !== KATA_LALUAN) return out_({ ok: false, error: "wrong_password" });

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_();
    const now = new Date().toISOString();

    if (req.action === "add") {
      const d = clean_(req.data);
      const id = Utilities.getUuid();
      const vals = LAJUR.map(function (k) {
        if (k === "id") return id;
        if (k === "createdAt" || k === "updatedAt") return now;
        return safe_(d[k]);
      });
      sh.getRange(sh.getLastRow() + 1, 1, 1, LAJUR.length).setValues([vals]);
    } else if (req.action === "update" || req.action === "delete") {
      const r = findRow_(sh, req.id);
      if (r < 0) return out_({ ok: false, error: "not_found", rows: rows_(sh) });
      if (req.action === "delete") {
        sh.deleteRow(r);
      } else {
        const d = clean_(req.data);
        const cur = sh.getRange(r, 1, 1, LAJUR.length).getDisplayValues()[0];
        const vals = LAJUR.map(function (k, j) {
          if (MEDAN.indexOf(k) >= 0) return safe_(d[k]);
          if (k === "updatedAt") return now;
          return safe_(cur[j]);
        });
        sh.getRange(r, 1, 1, LAJUR.length).setValues([vals]);
      }
    } else if (req.action !== "list") {
      return out_({ ok: false, error: "bad_action" });
    }
    return out_({ ok: true, rows: rows_(sh) });
  } finally {
    lock.releaseLock();
  }
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(NAMA_SHEET);
  if (!sh) sh = ss.insertSheet(NAMA_SHEET);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, LAJUR.length).setValues([LAJUR]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  // Simpan semua sebagai teks supaya "0" depan no. telefon tak hilang.
  sh.getRange(1, 1, sh.getMaxRows(), LAJUR.length).setNumberFormat("@");
  return sh;
}

function rows_(sh) {
  const n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, LAJUR.length).getDisplayValues()
    .map(function (v) {
      const o = {};
      LAJUR.forEach(function (k, i) { o[k] = v[i]; });
      return o;
    })
    .filter(function (o) { return o.id; });
}

function findRow_(sh, id) {
  const n = sh.getLastRow();
  if (n < 2 || !id) return -1;
  const ids = sh.getRange(2, 1, n - 1, 1).getDisplayValues();
  for (let i = 0; i < ids.length; i++) if (ids[i][0] === String(id)) return i + 2;
  return -1;
}

function clean_(d) {
  const o = {};
  MEDAN.forEach(function (k) { o[k] = String((d && d[k]) || "").trim().slice(0, 600); });
  return o;
}

// Elak teks dibaca sebagai formula (cth. bermula dengan "=").
function safe_(s) {
  s = String(s == null ? "" : s);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
