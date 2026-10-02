/* =========================================================
   SKEMA UNINDRA — SCRIPT UTAMA
   ========================================================= */


/* =========================================================
   HELPER
========================================================= */

function escapeHTML(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function inisial(nama) {
  if (!nama) return "?";

  return String(nama)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(kata =>
      kata.charAt(0).toUpperCase()
    )
    .join("");
}


/* =========================================================
   KARTU PENGURUS
========================================================= */

function kartuOrang(o) {

  const card = document.createElement("div");
  card.className = "person";

  const nama = escapeHTML(o.nama || "Tanpa nama");
  const jabatan = escapeHTML(o.jabatan || "");
  const divisi = escapeHTML(o.divisi || "");
  const prodi = escapeHTML(o.prodi || "");
  const angkatan = escapeHTML(o.angkatan || "");

  const foto =
    o.foto &&
    String(o.foto).trim()
      ? String(o.foto).trim()
      : "";

  const avatar = document.createElement("div");

  avatar.className = "avatar";
  avatar.textContent = inisial(o.nama);

  if (foto) {

    const img = document.createElement("img");

    img.className = "person-photo";
    img.src = foto;
    img.alt = `Foto ${nama}`;

    img.onload = function () {
      avatar.style.display = "none";
      img.style.display = "block";
    };

    img.onerror = function () {

      console.error(
        "Foto pengurus gagal dimuat:",
        foto
      );

      img.remove();

      avatar.style.display = "flex";
    };

    card.insertBefore(img, avatar);
  }

  const info = document.createElement("div");

  info.className = "info";

  info.innerHTML = `
    <strong>${nama}</strong>

    ${
      jabatan
        ? `<span class="role">${jabatan}</span>`
        : ""
    }

    ${
      divisi
        ? `<span class="meta">${divisi}</span>`
        : ""
    }

    ${
      prodi || angkatan
        ? `
          <span class="meta">
            ${prodi}
            ${
              prodi && angkatan
                ? " • "
                : ""
            }
            ${
              angkatan
                ? `Angkatan ${angkatan}`
                : ""
            }
          </span>
        `
        : ""
    }
  `;

  card.appendChild(info);

  return card;
}


/* =========================================================
   PENGURUS
========================================================= */

function renderPengurus(data) {

  const inti =
    document.getElementById("inti");

  const filter =
    document.getElementById("filter-divisi");

  const divisiBox =
    document.getElementById("divisi");

  if (!inti || !filter || !divisiBox) {

    console.error(
      "Element pengurus tidak ditemukan."
    );

    return;
  }

  inti.innerHTML = "";
  filter.innerHTML = "";
  divisiBox.innerHTML = "";

  const pengurus =
    Array.isArray(data)
      ? data
      : [];


  /* PENGURUS INTI */

  const pengurusInti =
    pengurus.filter(
      orang =>
        !String(
          orang.divisi || ""
        ).trim()
    );


  if (pengurusInti.length === 0) {

    inti.innerHTML = `
      <p class="lead">
        Belum ada data pengurus inti.
      </p>
    `;

  } else {

    pengurusInti.forEach(
      orang => {

        inti.appendChild(
          kartuOrang(orang)
        );

      }
    );
  }


  /* DAFTAR DIVISI */

  const daftarDivisi = [
    ...new Set(
      pengurus
        .map(
          orang =>
            String(
              orang.divisi || ""
            ).trim()
        )
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


  /* BUTTON SEMUA */

  const semuaBtn =
    document.createElement("button");

  semuaBtn.type = "button";
  semuaBtn.textContent = "Semua";

  semuaBtn.setAttribute(
    "aria-pressed",
    "true"
  );

  filter.appendChild(semuaBtn);


  /* TAMPILKAN DIVISI */

  function tampilkan(namaDivisi) {

    divisiBox.innerHTML = "";

    const dataTampil =
      namaDivisi === "Semua"

        ? pengurus.filter(
            orang =>
              String(
                orang.divisi || ""
              ).trim()
          )

        : pengurus.filter(
            orang =>
              String(
                orang.divisi || ""
              ).trim() === namaDivisi
          );


    if (dataTampil.length === 0) {

      divisiBox.innerHTML = `
        <p class="lead">
          Belum ada anggota di divisi ini.
        </p>
      `;

      return;
    }


    const people =
      document.createElement("div");

    people.className = "people";


    dataTampil.forEach(
      orang => {

        people.appendChild(
          kartuOrang(orang)
        );

      }
    );


    divisiBox.appendChild(
      people
    );
  }


  /* CLICK SEMUA */

  semuaBtn.addEventListener(
    "click",
    () => {

      filter
        .querySelectorAll("button")
        .forEach(
          button => {

            button.setAttribute(
              "aria-pressed",
              "false"
            );

          }
        );


      semuaBtn.setAttribute(
        "aria-pressed",
        "true"
      );


      tampilkan("Semua");
    }
  );


  /* BUTTON DIVISI */

  daftarDivisi.forEach(
    namaDivisi => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.textContent =
        namaDivisi;

      button.setAttribute(
        "aria-pressed",
        "false"
      );


      button.addEventListener(
        "click",
        () => {

          filter
            .querySelectorAll("button")
            .forEach(
              btn => {

                btn.setAttribute(
                  "aria-pressed",
                  "false"
                );

              }
            );


          button.setAttribute(
            "aria-pressed",
            "true"
          );


          tampilkan(
            namaDivisi
          );
        }
      );


      filter.appendChild(
        button
      );
    }
  );


  tampilkan("Semua");
}


/* =========================================================
   AGENDA
   PERBAIKAN UTAMA
   index.html menggunakan:
   <tbody id="agenda-body"></tbody>
========================================================= */

function renderAgenda(data) {

  const tbody =
    document.getElementById(
      "agenda-body"
    );


  if (!tbody) {

    console.error(
      "Element #agenda-body tidak ditemukan."
    );

    return;
  }


  const agenda =
    Array.isArray(data)
      ? data
      : [];


  tbody.innerHTML = "";


  /* BELUM ADA DATA */

  if (agenda.length === 0) {

    const tr =
      document.createElement("tr");

    const td =
      document.createElement("td");

    td.colSpan = 3;

    td.textContent =
      "Belum ada agenda.";

    tr.appendChild(td);

    tbody.appendChild(tr);

    return;
  }


  /* TAMPILKAN AGENDA */

  agenda.forEach(
    item => {

      const tr =
        document.createElement("tr");


      /* KEGIATAN */

      const tdKegiatan =
        document.createElement("td");

      const strong =
        document.createElement("strong");

      strong.textContent =
        item.kegiatan ||
        "-";

      tdKegiatan.appendChild(
        strong
      );


      /* WAKTU */

      const tdWaktu =
        document.createElement("td");

      tdWaktu.textContent =
        item.waktu ||
        "-";


      /* JENIS */

      const tdJenis =
        document.createElement("td");


      if (
        item.jenis &&
        String(item.jenis).trim()
      ) {

        const tag =
          document.createElement("span");

        tag.className = "tag";

        tag.textContent =
          item.jenis;

        tdJenis.appendChild(
          tag
        );

      } else {

        tdJenis.textContent =
          "-";
      }


      tr.appendChild(
        tdKegiatan
      );

      tr.appendChild(
        tdWaktu
      );

      tr.appendChild(
        tdJenis
      );


      tbody.appendChild(
        tr
      );
    }
  );


  console.log(
    "AGENDA BERHASIL DIMUAT:",
    agenda
  );
}


/* =========================================================
   KARYA
========================================================= */

function renderKarya(data) {

  const filter =
    document.getElementById(
      "filter-karya"
    );

  const pub =
    document.getElementById(
      "pub"
    );


  if (!filter || !pub) {

    console.error(
      "Element karya tidak ditemukan."
    );

    return;
  }


  const karya =
    Array.isArray(data)
      ? data
      : [];


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
        .map(
          item =>
            String(
              item.jenis || ""
            ).trim()
        )
        .filter(Boolean)
    )
  ];


  const semuaBtn =
    document.createElement("button");

  semuaBtn.type = "button";
  semuaBtn.textContent = "Semua";

  semuaBtn.setAttribute(
    "aria-pressed",
    "true"
  );

  filter.appendChild(
    semuaBtn
  );


  function tampilkan(jenisAktif) {

    pub.innerHTML = "";


    const dataTampil =
      jenisAktif === "Semua"

        ? karya

        : karya.filter(
            item =>
              String(
                item.jenis || ""
              ).trim() === jenisAktif
          );


    dataTampil.forEach(
      item => {

        const article =
          document.createElement(
            "article"
          );


        /* FOTO KARYA */

        if (
          item.foto &&
          String(
            item.foto
          ).trim()
        ) {

          const img =
            document.createElement(
              "img"
            );

          img.src =
            String(
              item.foto
            ).trim();

          img.alt =
            `Foto ${
              item.judul ||
              "Karya"
            }`;

          img.style.width =
            "100%";

          img.style.maxHeight =
            "220px";

          img.style.objectFit =
            "cover";

          img.style.borderRadius =
            "12px";

          img.style.display =
            "block";

          img.style.marginBottom =
            "16px";


          img.onerror =
            function () {

              console.error(
                "Foto karya gagal dimuat:",
                item.foto
              );

              img.remove();
            };


          article.appendChild(
            img
          );
        }


        /* JUDUL */

        const judul =
          document.createElement(
            "h3"
          );

        judul.textContent =
          item.judul ||
          "Tanpa judul";

        article.appendChild(
          judul
        );


        /* JENIS + TAHUN */

        const info =
          document.createElement(
            "p"
          );

        info.textContent =
          `${item.jenis || "Karya"}${
            item.tahun
              ? ` • ${item.tahun}`
              : ""
          }`;

        article.appendChild(
          info
        );


        /* PENULIS */

        if (item.penulis) {

          const penulis =
            document.createElement(
              "p"
            );

          penulis.style.marginTop =
            "8px";

          penulis.textContent =
            `Oleh ${item.penulis}`;

          article.appendChild(
            penulis
          );
        }


        pub.appendChild(
          article
        );
      }
    );
  }


  /* BUTTON SEMUA */

  semuaBtn.addEventListener(
    "click",
    () => {

      filter
        .querySelectorAll("button")
        .forEach(
          button =>
            button.setAttribute(
              "aria-pressed",
              "false"
            )
        );


      semuaBtn.setAttribute(
        "aria-pressed",
        "true"
      );


      tampilkan("Semua");
    }
  );


  /* BUTTON JENIS */

  jenis.forEach(
    namaJenis => {

      const button =
        document.createElement(
          "button"
        );

      button.type = "button";

      button.textContent =
        namaJenis;

      button.setAttribute(
        "aria-pressed",
        "false"
      );


      button.addEventListener(
        "click",
        () => {

          filter
            .querySelectorAll("button")
            .forEach(
              btn =>
                btn.setAttribute(
                  "aria-pressed",
                  "false"
                )
            );


          button.setAttribute(
            "aria-pressed",
            "true"
          );


          tampilkan(
            namaJenis
          );
        }
      );


      filter.appendChild(
        button
      );
    }
  );


  tampilkan("Semua");
}


/* =========================================================
   STATISTIK DASHBOARD
========================================================= */

function renderStatistik(
  pengurus,
  agenda,
  karya
) {

  const sPengurus =
    document.getElementById(
      "s-pengurus"
    );

  const sDivisi =
    document.getElementById(
      "s-divisi"
    );

  const sAgenda =
    document.getElementById(
      "s-agenda"
    );

  const sKarya =
    document.getElementById(
      "s-karya"
    );

  const barKarya =
    document.getElementById(
      "bar-karya"
    );


  const dataPengurus =
    Array.isArray(pengurus)
      ? pengurus
      : [];

  const dataAgenda =
    Array.isArray(agenda)
      ? agenda
      : [];

  const dataKarya =
    Array.isArray(karya)
      ? karya
      : [];


  /* PENGURUS */

  if (sPengurus) {

    sPengurus.textContent =
      dataPengurus.length;
  }


  /* DIVISI */

  if (sDivisi) {

    const divisi =
      new Set(
        dataPengurus
          .map(
            item =>
              String(
                item.divisi || ""
              ).trim()
          )
          .filter(Boolean)
      );


    sDivisi.textContent =
      divisi.size;
  }


  /* AGENDA */

  if (sAgenda) {

    sAgenda.textContent =
      dataAgenda.length;
  }


  /* KARYA */

  if (sKarya) {

    sKarya.textContent =
      dataKarya.length;
  }


  /* BAR KARYA */

  if (!barKarya) return;

  barKarya.innerHTML = "";


  const jenisMap = {};


  dataKarya.forEach(
    item => {

      const jenis =
        String(
          item.jenis ||
          "Lainnya"
        ).trim();


      jenisMap[jenis] =
        (jenisMap[jenis] || 0) + 1;
    }
  );


  const daftarJenis =
    Object.entries(
      jenisMap
    );


  if (
    daftarJenis.length === 0
  ) {

    barKarya.innerHTML = `
      <p class="lead">
        Belum ada data karya.
      </p>
    `;

    return;
  }


  const total =
    dataKarya.length;


  daftarJenis.forEach(
    ([jenis, jumlah]) => {

      const persen =
        Math.round(
          (jumlah / total) * 100
        );


      const row =
        document.createElement(
          "div"
        );

      row.className =
        "bar";


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


      barKarya.appendChild(
        row
      );
    }
  );
}


/* =========================================================
   KAJIAN
========================================================= */

function renderKajian(data) {

  const fields =
    document.querySelector(
      ".fields"
    );


  if (!fields) return;


  const kajian =
    Array.isArray(data)
      ? data
      : [];


  /*
     Kalau tabel kajian belum ada / kosong,
     biarkan 4 bidang bawaan dari index.html.
  */

  if (
    kajian.length === 0
  ) {
    return;
  }


  const aktif =
    kajian.filter(
      item => {

        const status =
          String(
            item.status ||
            "Aktif"
          )
            .trim()
            .toLowerCase();


        return status ===
          "aktif";
      }
    );


  if (
    aktif.length === 0
  ) {
    return;
  }


  fields.innerHTML = "";


  aktif.forEach(
    item => {

      const field =
        document.createElement(
          "div"
        );

      field.className =
        "field";


      field.innerHTML = `
        <h3>
          ${escapeHTML(
            item.judul ||
            item.bidang ||
            "Bidang Kajian"
          )}
        </h3>

        <p>
          ${escapeHTML(
            item.deskripsi || ""
          )}
        </p>
      `;


      fields.appendChild(
        field
      );
    }
  );
}


/* =========================================================
   MULAI
========================================================= */

async function mulai() {

  try {

    console.log(
      "SKEMA: mulai memuat data..."
    );


    const [
      pengurus,
      agenda,
      karya,
      kajian
    ] = await Promise.all([

      ambil(
        "pengurus",
        "urutan"
      ),

      ambil(
        "agenda",
        "id"
      ),

      ambil(
        "karya",
        "tahun"
      ),

      ambil(
        "kajian",
        "urutan"
      )

    ]);


    console.log(
      "DATA PENGURUS:",
      pengurus
    );

    console.log(
      "DATA AGENDA:",
      agenda
    );

    console.log(
      "DATA KARYA:",
      karya
    );

    console.log(
      "DATA KAJIAN:",
      kajian
    );


    /* =====================================================
       RENDER SEMUA DATA
    ===================================================== */

    renderPengurus(
      pengurus
    );


    renderAgenda(
      agenda
    );


    renderKarya(
      karya
    );


    renderStatistik(
      pengurus,
      agenda,
      karya
    );


    renderKajian(
      kajian
    );


    console.log(
      "SKEMA: semua data berhasil diproses."
    );


  } catch (error) {

    console.error(
      "Gagal memuat data SKEMA:",
      error
    );


    /* Kalau terjadi error pada proses utama,
       tetap tampilkan pesan pada agenda. */

    const agendaBody =
      document.getElementById(
        "agenda-body"
      );


    if (agendaBody) {

      agendaBody.innerHTML = `
        <tr>
          <td colspan="3">
            Gagal memuat agenda.
          </td>
        </tr>
      `;
    }
  }
}


/* =========================================================
   JALANKAN SETELAH HTML SELESAI
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    mulai
  );

} else {

  mulai();

}

