// ======================================================
// SKEMA UNINDRA - SCRIPT UTAMA
// Cocok dengan index.html versi lama
// ======================================================


// ======================================================
// PENGURUS
// ======================================================

function inisial(nama) {
  if (!nama) return "?";

  return nama
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(kata => kata[0])
    .join("")
    .toUpperCase();
}


function kartuOrang(o) {
  const nama = o.nama || "Nama belum diisi";
  const jabatan = o.jabatan || "";
  const prodi = o.prodi || "";
  const angkatan = o.angkatan || "";

  let foto = "";

  if (o.foto) {
    foto = `
      <img
        src="${o.foto}"
        alt="${nama}"
        class="person-photo"
        onerror="this.style.display='none'"
      >
    `;
  } else {
    foto = `
      <div class="avatar">
        ${inisial(nama)}
      </div>
    `;
  }

  return `
    <article class="person-card">

      ${foto}

      <div class="person-content">

        <h3>${nama}</h3>

        <p class="role">
          ${jabatan}
        </p>

        ${
          prodi || angkatan
            ? `
              <p class="muted">
                ${prodi}${prodi && angkatan ? " · " : ""}${angkatan}
              </p>
            `
            : ""
        }

        <div class="socials">

          ${
            o.instagram
              ? `<a href="${o.instagram}" target="_blank" rel="noopener">Instagram</a>`
              : ""
          }

          ${
            o.tiktok
              ? `<a href="${o.tiktok}" target="_blank" rel="noopener">TikTok</a>`
              : ""
          }

          ${
            o.linkedin
              ? `<a href="${o.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`
              : ""
          }

        </div>

      </div>

    </article>
  `;
}


function renderPengurus(data) {

  const inti = $("#inti");
  const divisi = $("#divisi");
  const filter = $("#filter-divisi");

  if (!inti || !divisi || !filter) return;

  const semua = Array.isArray(data) ? data : [];

  // ----------------------------------------------
  // PENGURUS INTI
  // ----------------------------------------------

  const dataInti = semua.filter(o => {
    return !o.divisi || String(o.divisi).trim() === "";
  });

  inti.innerHTML = dataInti.length
    ? dataInti.map(kartuOrang).join("")
    : `<p class="muted">Belum ada data pengurus inti.</p>`;


  // ----------------------------------------------
  // DATA DIVISI
  // ----------------------------------------------

  const dataDivisi = semua.filter(o => {
    return o.divisi && String(o.divisi).trim() !== "";
  });


  if (!dataDivisi.length) {

    filter.innerHTML = "";

    divisi.innerHTML = `
      <p class="muted">
        Belum ada data divisi.
      </p>
    `;

    return;
  }


  // Ambil nama divisi unik
  const daftarDivisi = [
    ...new Set(
      dataDivisi.map(o => String(o.divisi).trim())
    )
  ];


  // ----------------------------------------------
  // BUTTON FILTER DIVISI
  // ----------------------------------------------

  filter.innerHTML = `
    <button
      type="button"
      class="active"
      data-divisi="Semua">
      Semua
    </button>

    ${daftarDivisi
      .map(div => `
        <button
          type="button"
          data-divisi="${escapeHTML(div)}">
          ${escapeHTML(div)}
        </button>
      `)
      .join("")
    }
  `;


  // ----------------------------------------------
  // TAMPILKAN SEMUA DIVISI
  // ----------------------------------------------

  function tampilkanDivisi(namaDivisi) {

    let hasil;

    if (namaDivisi === "Semua") {
      hasil = dataDivisi;
    } else {
      hasil = dataDivisi.filter(o =>
        String(o.divisi).trim() === namaDivisi
      );
    }

    divisi.innerHTML = hasil.length
      ? hasil.map(kartuOrang).join("")
      : `<p class="muted">Belum ada pengurus di divisi ini.</p>`;
  }


  tampilkanDivisi("Semua");


  // ----------------------------------------------
  // EVENT FILTER
  // ----------------------------------------------

  filter.querySelectorAll("button").forEach(button => {

    button.addEventListener("click", () => {

      filter
        .querySelectorAll("button")
        .forEach(b => b.classList.remove("active"));

      button.classList.add("active");

      tampilkanDivisi(
        button.dataset.divisi
      );

    });

  });

}


// ======================================================
// AGENDA
// ======================================================

function renderAgenda(data) {

  const target = $("#agenda-list");

  if (!target) return;

  const agenda = Array.isArray(data) ? data : [];


  if (!agenda.length) {

    target.innerHTML = `
      <p class="muted">
        Belum ada agenda.
      </p>
    `;

    return;
  }


  target.innerHTML = agenda.map(a => {

    const kegiatan = a.kegiatan || "Kegiatan SKEMA";
    const waktu = a.waktu || "";
    const jenis = a.jenis || "";

    const foto = a.foto
      ? `
        <img
          src="${a.foto}"
          alt="${kegiatan}"
          class="agenda-photo"
          onerror="this.style.display='none'"
        >
      `
      : "";


    return `
      <article class="agenda-card">

        ${foto}

        <div>

          ${
            jenis
              ? `<span class="agenda-type">${jenis}</span>`
              : ""
          }

          <h3>
            ${kegiatan}
          </h3>

          ${
            waktu
              ? `<p class="muted">${waktu}</p>`
              : ""
          }

        </div>

      </article>
    `;

  }).join("");

}


// ======================================================
// KARYA
// ======================================================

function renderKarya(data) {

  const target = $("#pub");
  const filter = $("#filter-karya");

  if (!target || !filter) return;

  const karya = Array.isArray(data) ? data : [];


  if (!karya.length) {

    filter.innerHTML = "";

    target.innerHTML = `
      <p class="muted">
        Belum ada karya.
      </p>
    `;

    return;
  }


  // ----------------------------------------------
  // JENIS KARYA UNIK
  // ----------------------------------------------

  const jenisKarya = [
    ...new Set(
      karya
        .map(k => k.jenis)
        .filter(Boolean)
        .map(j => String(j).trim())
    )
  ];


  // ----------------------------------------------
  // FILTER
  // ----------------------------------------------

  filter.innerHTML = `
    <button
      type="button"
      class="active"
      data-karya="Semua">
      Semua
    </button>

    ${jenisKarya
      .map(jenis => `
        <button
          type="button"
          data-karya="${escapeHTML(jenis)}">
          ${escapeHTML(jenis)}
        </button>
      `)
      .join("")
    }
  `;


  function tampilkanKarya(jenis) {

    let hasil;

    if (jenis === "Semua") {
      hasil = karya;
    } else {
      hasil = karya.filter(k =>
        String(k.jenis || "").trim() === jenis
      );
    }


    target.innerHTML = hasil.length
      ? hasil.map(k => {

          const judul = k.judul || "Tanpa judul";
          const penulis = k.penulis || "";
          const tahun = k.tahun || "";
          const tipe = k.jenis || "";


          return `
            <article class="pub-card">

              ${
                tipe
                  ? `<span class="pub-type">${tipe}</span>`
                  : ""
              }

              <h3>
                ${judul}
              </h3>

              ${
                penulis
                  ? `<p class="muted">${penulis}</p>`
                  : ""
              }

              ${
                tahun
                  ? `<p class="muted">${tahun}</p>`
                  : ""
              }

            </article>
          `;

        }).join("")
      : `
        <p class="muted">
          Belum ada karya dengan jenis tersebut.
        </p>
      `;
  }


  tampilkanKarya("Semua");


  // ----------------------------------------------
  // EVENT FILTER
  // ----------------------------------------------

  filter.querySelectorAll("button").forEach(button => {

    button.addEventListener("click", () => {

      filter
        .querySelectorAll("button")
        .forEach(b => b.classList.remove("active"));

      button.classList.add("active");

      tampilkanKarya(
        button.dataset.karya
      );

    });

  });

}


// ======================================================
// STATISTIK DASHBOARD
// ======================================================

function renderStatistik(pengurus, agenda, karya) {

  const sPengurus = $("#s-pengurus");
  const sDivisi = $("#s-divisi");
  const sAgenda = $("#s-agenda");
  const sKarya = $("#s-karya");


  const dataPengurus = Array.isArray(pengurus)
    ? pengurus
    : [];

  const dataAgenda = Array.isArray(agenda)
    ? agenda
    : [];

  const dataKarya = Array.isArray(karya)
    ? karya
    : [];


  // Jumlah pengurus
  if (sPengurus) {
    sPengurus.textContent =
      dataPengurus.length;
  }


  // Jumlah divisi unik
  const jumlahDivisi = new Set(
    dataPengurus
      .map(o => o.divisi)
      .filter(Boolean)
      .map(d => String(d).trim())
  ).size;


  if (sDivisi) {
    sDivisi.textContent =
      jumlahDivisi;
  }


  // Jumlah agenda
  if (sAgenda) {
    sAgenda.textContent =
      dataAgenda.length;
  }


  // Jumlah karya
  if (sKarya) {
    sKarya.textContent =
      dataKarya.length;
  }


  // ----------------------------------------------
  // BAR KARYA
  // ----------------------------------------------

  const barTarget = $("#bar-karya");

  if (!barTarget) return;


  if (!dataKarya.length) {

    barTarget.innerHTML = `
      <p class="muted">
        Belum ada data karya.
      </p>
    `;

    return;
  }


  const jumlahJenis = {};

  dataKarya.forEach(k => {

    const jenis =
      k.jenis || "Lainnya";

    jumlahJenis[jenis] =
      (jumlahJenis[jenis] || 0) + 1;

  });


  const total = dataKarya.length;


  barTarget.innerHTML = Object.entries(jumlahJenis)
    .map(([jenis, jumlah]) => {

      const persen =
        Math.round((jumlah / total) * 100);

      return `
        <div style="margin-bottom:14px">

          <div
            style="
              display:flex;
              justify-content:space-between;
              margin-bottom:5px;
            ">

            <span>
              ${escapeHTML(jenis)}
            </span>

            <span>
              ${jumlah}
            </span>

          </div>

          <div
            style="
              width:100%;
              height:8px;
              background:#eee;
              border-radius:20px;
              overflow:hidden;
            ">

            <div
              style="
                width:${persen}%;
                height:100%;
                background:currentColor;
                border-radius:20px;
              ">
            </div>

          </div>

        </div>
      `;

    })
    .join("");

}


// ======================================================
// KAJIAN
// ======================================================

function renderKajian(data) {

  const container =
    document.querySelector(".fields");

  if (!container) return;


  const kajian =
    Array.isArray(data) ? data : [];


  // Kalau tabel kajian kosong,
  // biarkan 4 bidang bawaan dari index.html.
  if (!kajian.length) {
    return;
  }


  // Hanya tampilkan data yang statusnya aktif
  const aktif = kajian.filter(k => {

    const status =
      String(k.status || "Aktif")
        .toLowerCase()
        .trim();

    return status === "aktif";

  });


  if (!aktif.length) {
    return;
  }


  // Kelompokkan berdasarkan bidang
  const kelompok = {};


  aktif.forEach(k => {

    const bidang =
      k.bidang || "Bidang Kajian";

    if (!kelompok[bidang]) {
      kelompok[bidang] = [];
    }

    kelompok[bidang].push(k);

  });


  container.innerHTML =
    Object.entries(kelompok)
      .map(([bidang, daftar]) => {

        const deskripsi =
          daftar
            .map(k => k.deskripsi)
            .filter(Boolean)
            .join(" ");

        return `
          <div class="field">

            <h3>
              ${escapeHTML(bidang)}
            </h3>

            <p>
              ${
                escapeHTML(
                  deskripsi ||
                  "Kajian dan riset mahasiswa SKEMA."
                )
              }
            </p>

          </div>
        `;

      })
      .join("");

}


// ======================================================
// ESCAPE HTML
// Supaya data dari database aman ditampilkan
// ======================================================

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ======================================================
// MULAI
// ======================================================

async function mulai() {

  try {

    const [
      pengurus,
      agenda,
      karya,
      kajian
    ] = await Promise.all([

      ambil("pengurus", "urutan"),

      ambil("agenda", "id"),

      ambil("karya", "tahun"),

      ambil("kajian", "urutan")

    ]);


    // Dashboard
    renderStatistik(
      pengurus,
      agenda,
      karya
    );


    // Pengurus
    renderPengurus(
      pengurus
    );


    // Agenda
    renderAgenda(
      agenda
    );


    // Karya
    renderKarya(
      karya
    );


    // Kajian
    renderKajian(
      kajian
    );


  } catch (error) {

    console.error(
      "Gagal memuat data SKEMA:",
      error
    );

  }

}


// ======================================================
// JALANKAN SAAT HALAMAN SELESAI DIMUAT
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  mulai
);
