// Fungsi bersama untuk index.html dan admin.html

const $ = id => document.getElementById(id);

function el(tag, cls, text) {
  const e = document.createElement(tag);

  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;

  return e;
}

// Koneksi ke Supabase
const sb =
  (typeof SUPABASE_URL !== "undefined" &&
   typeof SUPABASE_ANON_KEY !== "undefined" &&
   !SUPABASE_URL.includes("ISI_"))
    ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Ambil semua baris dari satu tabel
async function ambil(tabel, urut) {
  if (!sb) return DEMO[tabel];

  const { data, error } = await sb
    .from(tabel)
    .select("*")
    .order(urut, { ascending: true });

  if (error) {
    console.error(tabel, error.message);
    return [];
  }

  return data;
}