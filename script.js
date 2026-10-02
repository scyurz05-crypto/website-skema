/* =========================================================
   SKEMA UNINDRA — SCRIPT UTAMA
   ========================================================= */

/* ---------------------------------------------------------
   HELPER
--------------------------------------------------------- */

function $(selector) {
  return document.querySelector(selector);
}

function el(tag, className = "", html = "") {
  const node = document.createElement(tag);

  if (className) {
    node.className = className;
  }

  if (html) {
    node.innerHTML = html;
  }

  return node;
}

/* ---------------------------------------------------------
   ESCAPE HTML
--------------------------------------------------------- */

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

/* ---------------------------------------------------------
   INISIAL NAMA
--------------------------------------------------------- */

function inisial(nama) {
  if (!nama) return "?";

  return String(nama)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(kata => kata.charAt(0).toUpperCase())
    .join("");
}

/* ---------------------------------------------------------
   KARTU PENGURUS
--------------------------------------------------------- */

function kartuOrang(o) {
  const nama = escapeHTML(o.nama || "Tanpa nama");
  const jabatan = escapeHTML(o.jabatan || "");
  const divisi = escapeHTML(o.divisi || "");
  const prodi = escapeHTML(o.prodi || "");
  const angkatan = escapeHTML(o.angkatan || "");
  const foto = o.foto ? String(o.foto).trim() : "";

  const card = el("div", "person");

  /* FOTO DARI SUPABASE */
  if (foto) {
    const img = document.createElement("img");

    img.className = "person-photo";
    img.src = foto;
    img.alt = `Foto ${nama}`;

    img.onerror = function () {
      this.style.display = "none";
      avatar.style.display = "flex";
    };

    card.appendChild(img);
  }

  /* AVATAR FALLBACK */
  const avatar = el("div", "avatar");
  avatar.textContent = inisial(o.nama);

  if (foto) {
    avatar.style.display = "none";
  }

  card.appendChild(avatar);

  /* INFORMASI */
  const info = el("div", "info");

  info.innerHTML = `
    <strong>${nama}</strong>
    ${jabatan ? `<span class="role">${jabatan}</span>` : ""}
    ${
      divisi
        ? `<span class="meta">${divisi}</span>`
        : ""
    }
    ${
      prodi || angkatan
        ? `<span class="meta">
            ${prodi}${prodi && angkatan ? " • " : ""}${angkatan ? `Angkatan ${angkatan}` : ""}
          </span>`
        : ""
    }
  `;

  card.appendChild(info);

  return card;
}

/* ---------------------------------------------------------
   RENDER PENGURUS
--------------------------------------------------------- */

function renderPengurus(data) {
  const inti = $("#inti");
  const filter = $("#filter-divisi");
  const divisiBox = $("#divisi");

  if (!inti || !filter || !divisiBox) {
    return;
  }

  inti.innerHTML = "";
  filter.innerHTML = "";
  divisiBox.innerHTML = "";

  const pengurus = Array.isArray(data) ? data : [];

  /* -----------------------------------------------
     PENGURUS INTI
  ------------------------------------------------ */

  const pengurusInti = pengurus.filter(
    orang => !String(orang.divisi || "").trim()
  );

  if (pengurusInti.length === 0) {
    inti.innerHTML = `
      <p class="lead">
        Belum ada data pengurus inti.
      </p>
    `;
  } else {
    pengurusInti.forEach(orang => {
      inti.appendChild(kartuOrang(orang));
    });
  }

  /* -----------------------------------------------
     DAFTAR DIVISI
  ------------------------------------------------ */

  const daftarDivisi = [
    ...new Set(
      pengurus
        .map(orang => String(orang.divisi || "").trim())
        .filter(Boolean)
    )
  ];

  if (daftarDivisi.length === 0) {
    divisiBox.innerHTML = `
      <p class="lead">
        Belum ada data divisi.
      </p>
    `;
    return;
  }

  /* -----------------------------------------------
     TOMBOL SEMUA
  ------------------------------------------------ */

  const semuaBtn = document.createElement("button");

  semuaBtn.type = "button";
  semuaBtn.textContent = "Semua";
  semuaBtn.setAttribute("aria-pressed", "true");

  filter.appendChild(semuaBtn);

  /* -----------------------------------------------
     ISI DIVISI
  ------------------------------------------------ */

  const tampilkan = namaDivisi => {
    divisiBox.innerHTML = "";

    const dataTampil =
      namaDivisi === "Semua"
        ? pengurus.filter(
            orang => String(orang.divisi || "").trim()
          )
        : pengurus.filter(
            orang =>
              String(orang.divisi || "").trim() === namaDivisi
          );

    if (dataTampil.length === 0) {
      divisiBox.innerHTML = `
        <p class="lead">
          Belum ada anggota di divisi ini.
        </p>
      `;
      return;
    }

    const people = el("div", "people");

    dataTampil.forEach(orang => {
      people.appendChild(kartuOrang(orang));
    });

    divisiBox.appendChild(people);
  };

  semuaBtn.addEventListener("click", () => {
    filter
      .querySelectorAll("button")
      .forEach(button =>
        button.setAttribute("aria-pressed", "false")
      );

    semuaBtn.setAttribute("aria-pressed", "true");

    tampilkan("Semua");
  });

  daftarDivisi.forEach(namaDivisi => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = namaDivisi;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      filter
        .querySelectorAll("button")
        .forEach(btn =>
          btn.setAttribute("aria-pressed", "false")
        );

      button.setAttribute("aria-pressed", "true");

      tampilkan(namaDivisi);
    });

    filter.appendChild(button);
  });

  tampilkan("Semua");
}

/* ---------------------------------------------------------
   RENDER AGENDA
--------------------------------------------------------- */

function renderAgenda(data) {
  const box = $("#agenda-list");

  if (!box) return;

  const agenda = Array.isArray(data) ? data : [];

  if (agenda.length === 0) {
    box.innerHTML = `
      <p class="lead">
        Belum ada agenda.
      </p>
    `;
    return;
  }

  const wrap = el("div", "wrap-x");

  const table = document.createElement("table");
  table.className = "agenda";

  table.innerHTML = `
    <thead>
      <tr>
        <th>Kegiatan</th>
        <th>Waktu</th>
        <th>Jenis</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");

  agenda.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <strong>${escapeHTML(item.kegiatan || "-")}</strong>
      </td>

      <td>
        ${escapeHTML(item.waktu || "-")}
      </td>

      <td>
        ${
          item.jenis
            ? `<span class="tag">${escapeHTML(item.jenis)}</span>`
            : "-"
        }
      </td>
    `;

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrap.appendChild(table);
  box.appendChild(wrap);
}

/* ---------------------------------------------------------
   RENDER KARYA
--------------------------------------------------------- */

function renderKarya(data) {
  const filter = $("#filter-karya");
  const pub = $("#pub");

  if (!filter || !pub) return;

  const karya = Array.isArray(data) ? data : [];

  filter.innerHTML = "";
  pub.innerHTML = "";

  if (karya.length === 0) {
    pub.innerHTML = `
      <p class="lead">
        Belum ada karya.
      </p>
    `;
    return;
  }

  const jenis = [
    ...new Set(
      karya
        .map(item => String(item.jenis || "").trim())
        .filter(Boolean)
    )
  ];

  const semuaBtn = document.createElement("button");

  semuaBtn.type = "button";
  semuaBtn.textContent = "Semua";
  semuaBtn.setAttribute("aria-pressed", "true");

  filter.appendChild(semuaBtn);

  const tampilkan = jenisAktif => {
    pub.innerHTML = "";

    const dataTampil =
      jenisAktif === "Semua"
        ? karya
        : karya.filter(
            item =>
              String(item.jenis || "").trim() === jenisAktif
          );

    dataTampil.forEach(item => {
      const article = document.createElement("article");

      article.innerHTML = `
        <h3>
          ${escapeHTML(item.judul || "Tanpa judul")}
        </h3>

        <p>
          ${escapeHTML(item.jenis || "Karya")}
          ${
            item.tahun
              ? ` • ${escapeHTML(item.tahun)}`
              : ""
          }
        </p>

        ${
          item.penulis
            ? `
              <p style="margin-top:8px;">
                Oleh ${escapeHTML(item.penulis)}
              </p>
            `
            : ""
        }
      `;

      pub.appendChild(article);
    });
  };

  semuaBtn.addEventListener("click", () => {
    filter
      .querySelectorAll("button")
      .forEach(button =>
        button.setAttribute("aria-pressed", "false")
      );

    semuaBtn.setAttribute("aria-pressed", "true");

    tampilkan("Semua");
  });

  jenis.forEach(namaJenis => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = namaJenis;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      filter
        .querySelectorAll("button")
        .forEach(btn =>
          btn.setAttribute("aria-pressed", "false")
        );

      button.setAttribute("aria-pressed", "true");

      tampilkan(namaJenis);
    });

    filter.appendChild(button);
  });

  tampilkan("Semua");
}

/* ---------------------------------------------------------
   STATISTIK DASHBOARD
--------------------------------------------------------- */

function renderStatistik(pengurus, agenda, karya) {
  const sPengurus = $("#s-pengurus");
  const sDivisi = $("#s-divisi");
  const sAgenda = $("#s-agenda");
  const sKarya = $("#s-karya");
  const barKarya = $("#bar-karya");

  const dataPengurus = Array.isArray(pengurus)
    ? pengurus
    : [];

  const dataAgenda = Array.isArray(agenda)
    ? agenda
    : [];

  const dataKarya = Array.isArray(karya)
    ? karya
    : [];

  /* JUMLAH PENGURUS */
  if (sPengurus) {
    sPengurus.textContent = dataPengurus.length;
  }

  /* JUMLAH DIVISI */
  if (sDivisi) {
    const divisi = new Set(
      dataPengurus
        .map(item => String(item.divisi || "").trim())
        .filter(Boolean)
    );

    sDivisi.textContent = divisi.size;
  }

  /* JUMLAH KEGIATAN */
  if (sAgenda) {
    sAgenda.textContent = dataAgenda.length;
  }

  /* JUMLAH KARYA */
  if (sKarya) {
    sKarya.textContent = dataKarya.length;
  }

  /* BAR KARYA */
  if (barKarya) {
    barKarya.innerHTML = "";

    const jenisMap = {};

    dataKarya.forEach(item => {
      const jenis = String(item.jenis || "Lainnya").trim();

      if (!jenisMap[jenis]) {
        jenisMap[jenis] = 0;
      }

      jenisMap[jenis]++;
    });

    const daftarJenis = Object.entries(jenisMap);

    if (daftarJenis.length === 0) {
      barKarya.innerHTML = `
        <p class="lead">
          Belum ada data karya.
        </p>
      `;
      return;
    }

    const total = dataKarya.length;

    daftarJenis.forEach(([jenis, jumlah]) => {
      const persen = Math.round(
        (jumlah / total) * 100
      );

      const row = document.createElement("div");
      row.className = "bar";

      row.innerHTML = `
        <span>
          ${escapeHTML(jenis)}
        </span>

        <div class="track">
          <div
            class="fill"
            style="width:${persen}%">
          </div>
        </div>

        <b>
          ${jumlah}
        </b>
      `;

      barKarya.appendChild(row);
    });
  }
}

/* ---------------------------------------------------------
   BIDANG KAJIAN
--------------------------------------------------------- */

function renderKajian(data) {
  const fields = document.querySelector(".fields");

  if (!fields) return;

  const kajian = Array.isArray(data) ? data : [];

  /*
    Kalau tabel kajian kosong, desain awal tetap dipakai.
  */
  if (kajian.length === 0) {
    return;
  }

  /*
    Hanya tampilkan kajian yang statusnya Aktif.
  */
  const aktif = kajian.filter(item => {
    const status = String(item.status || "Aktif")
      .trim()
      .toLowerCase();

    return status === "aktif";
  });

  if (aktif.length === 0) {
    return;
  }

  fields.innerHTML = "";

  aktif.forEach(item => {
    const field = document.createElement("div");

    field.className = "field";

    field.innerHTML = `
      <h3>
        ${escapeHTML(item.judul || item.bidang || "Bidang Kajian")}
      </h3>

      <p>
        ${escapeHTML(item.deskripsi || "")}
      </p>
    `;

    fields.appendChild(field);
  });
}

/* ---------------------------------------------------------
   MULAI
--------------------------------------------------------- */

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

    renderPengurus(pengurus);
    renderAgenda(agenda);
    renderKarya(karya);
    renderStatistik(
      pengurus,
      agenda,
      karya
    );
    renderKajian(kajian);

  } catch (error) {
    console.error(
      "Gagal memuat data SKEMA:",
      error
    );
  }
}

/* ---------------------------------------------------------
   JALANKAN SETELAH HTML SELESAI
--------------------------------------------------------- */

document.addEventListener(
  "DOMContentLoaded",
  mulai
);
