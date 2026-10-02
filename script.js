/* =========================================================
   SKEMA UNINDRA
   SCRIPT UTAMA
   ========================================================= */


/* =========================================================
   HELPER
========================================================= */

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


function inisial(nama) {
  if (!nama) {
    return "?";
  }

  return String(nama)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(kata => kata.charAt(0).toUpperCase())
    .join("");
}


/* =========================================================
   KARTU PENGURUS
========================================================= */

function kartuOrang(data) {

  const card = document.createElement("div");
  card.className = "person";

  const nama = data.nama || "Tanpa nama";
  const jabatan = data.jabatan || "";
  const divisi = data.divisi || "";
  const prodi = data.prodi || "";
  const angkatan = data.angkatan || "";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = inisial(nama);

  card.appendChild(avatar);

  const info = document.createElement("div");
  info.className = "info";

  const namaEl = document.createElement("strong");
  namaEl.textContent = nama;

  info.appendChild(namaEl);

  if (jabatan) {
    const role = document.createElement("span");
    role.className = "role";
    role.textContent = jabatan;

    info.appendChild(role);
  }

  if (divisi) {
    const metaDivisi = document.createElement("span");
    metaDivisi.className = "meta";
    metaDivisi.textContent = divisi;

    info.appendChild(metaDivisi);
  }

  if (prodi || angkatan) {

    const meta = document.createElement("span");
    meta.className = "meta";

    let teks = "";

    if (prodi) {
      teks += prodi;
    }

    if (prodi && angkatan) {
      teks += " • ";
    }

    if (angkatan) {
      teks += "Angkatan " + angkatan;
    }

    meta.textContent = teks;

    info.appendChild(meta);
  }

  card.appendChild(info);

  return card;
}


/* =========================================================
   PENGURUS
========================================================= */

function renderPengurus(data) {

  const inti = document.getElementById("inti");
  const filter = document.getElementById("filter-divisi");
  const divisiBox = document.getElementById("divisi");

  if (!inti || !filter || !divisiBox) {
    return;
  }

  inti.innerHTML = "";
  filter.innerHTML = "";
  divisiBox.innerHTML = "";

  const pengurus = Array.isArray(data) ? data : [];


  /* =====================================================
     PENGURUS INTI
  ===================================================== */

  const intiData = pengurus.filter(item => {
    return !String(item.divisi || "").trim();
  });


  if (intiData.length === 0) {

    inti.innerHTML = `
      <p class="lead">
        Belum ada data pengurus inti.
      </p>
    `;

  } else {

    intiData.forEach(item => {
      inti.appendChild(
        kartuOrang(item)
      );
    });
  }


  /* =====================================================
     DAFTAR DIVISI
  ===================================================== */

  const daftarDivisi = [
    ...new Set(
      pengurus
        .map(item =>
          String(item.divisi || "").trim()
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


  /* =====================================================
     TAMPILKAN DATA DIVISI
  ===================================================== */

  function tampilkanDivisi(namaDivisi) {

    divisiBox.innerHTML = "";

    let dataTampil;

    if (namaDivisi === "Semua") {

      dataTampil = pengurus.filter(item => {
        return String(item.divisi || "").trim();
      });

    } else {

      dataTampil = pengurus.filter(item => {
        return String(item.divisi || "").trim() === namaDivisi;
      });
    }


    if (dataTampil.length === 0) {

      divisiBox.innerHTML = `
        <p class="lead">
          Belum ada anggota di divisi ini.
        </p>
      `;

      return;
    }


    const people = document.createElement("div");
    people.className = "people";

    dataTampil.forEach(item => {
      people.appendChild(
        kartuOrang(item)
      );
    });

    divisiBox.appendChild(people);
  }


  /* =====================================================
     BUTTON SEMUA
  ===================================================== */

  const semua = document.createElement("button");

  semua.type = "button";
  semua.textContent = "Semua";
  semua.setAttribute("aria-pressed", "true");

  semua.addEventListener("click", function () {

    filter
      .querySelectorAll("button")
      .forEach(button => {
        button.setAttribute(
          "aria-pressed",
          "false"
        );
      });

    semua.setAttribute(
      "aria-pressed",
      "true"
    );

    tampilkanDivisi("Semua");
  });

  filter.appendChild(semua);


  /* =====================================================
     BUTTON SETIAP DIVISI
  ===================================================== */

  daftarDivisi.forEach(namaDivisi => {

    const button =
      document.createElement("button");

    button.type = "button";
    button.textContent = namaDivisi;
    button.setAttribute(
      "aria-pressed",
      "false"
    );


    button.addEventListener(
      "click",
      function () {

        filter
          .querySelectorAll("button")
          .forEach(btn => {
            btn.setAttribute(
              "aria-pressed",
              "false"
            );
          });


        button.setAttribute(
          "aria-pressed",
          "true"
        );


        tampilkanDivisi(
          namaDivisi
        );
      }
    );


    filter.appendChild(button);
  });


  tampilkanDivisi("Semua");
}


/* =========================================================
   AGENDA
========================================================= */

function renderAgenda(data) {

  const tbody =
    document.getElementById("agenda-body");


  if (!tbody) {

    console.error(
      "agenda-body tidak ditemukan."
    );

    return;
  }


  tbody.innerHTML = "";


  const agenda =
    Array.isArray(data)
      ? data
      : [];


  /* =====================================================
     KALAU KOSONG
  ===================================================== */

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


  /* =====================================================
     TAMPILKAN AGENDA
  ===================================================== */

  agenda.forEach(item => {

    const tr =
      document.createElement("tr");


    /* -----------------------------------------------------
       KEGIATAN
    ----------------------------------------------------- */

    const tdKegiatan =
      document.createElement("td");


    /* FOTO */

    if (
      item.foto &&
      String(item.foto).trim()
    ) {

      const img =
        document.createElement("img");

      img.src =
        String(item.foto).trim();

      img.alt =
        item.kegiatan || "Agenda";

      img.width = 90;
      img.height = 60;

      img.style.width = "90px";
      img.style.height = "60px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "8px";
      img.style.display = "block";
      img.style.marginBottom = "8px";


      img.onerror = function () {

        console.error(
          "Foto agenda gagal:",
          item.foto
        );

        this.remove();
      };


      tdKegiatan.appendChild(img);
    }


    const namaKegiatan =
      document.createElement("strong");

    namaKegiatan.textContent =
      item.kegiatan || "-";


    tdKegiatan.appendChild(
      namaKegiatan
    );


    /* -----------------------------------------------------
       WAKTU
    ----------------------------------------------------- */

    const tdWaktu =
      document.createElement("td");

    tdWaktu.textContent =
      item.waktu || "-";


    /* -----------------------------------------------------
       JENIS
    ----------------------------------------------------- */

    const tdJenis =
      document.createElement("td");


    if (
      item.jenis &&
      String(item.jenis).trim()
    ) {

      const tag =
        document.createElement("span");

      tag.className = "tag";
      tag.textContent = item.jenis;

      tdJenis.appendChild(tag);

    } else {

      tdJenis.textContent = "-";
    }


    /* -----------------------------------------------------
       MASUKKAN KE TABLE
    ----------------------------------------------------- */

    tr.appendChild(tdKegiatan);
    tr.appendChild(tdWaktu);
    tr.appendChild(tdJenis);

    tbody.appendChild(tr);
  });


  console.log(
    "Agenda berhasil ditampilkan:",
    agenda
  );
}


/* =========================================================
   KARYA
========================================================= */

function renderKarya(data) {

  const filter =
    document.getElementById("filter-karya");

  const pub =
    document.getElementById("pub");


  if (!filter || !pub) {
    return;
  }


  filter.innerHTML = "";
  pub.innerHTML = "";


  const karya =
    Array.isArray(data)
      ? data
      : [];


  if (karya.length === 0) {

    pub.innerHTML = `
      <p class="lead">
        Belum ada karya.
      </p>
    `;

    return;
  }


  /* =====================================================
     JENIS KARYA
  ===================================================== */

  const daftarJenis = [
    ...new Set(
      karya
        .map(item =>
          String(item.jenis || "").trim()
        )
        .filter(Boolean)
    )
  ];


  /* =====================================================
     FUNGSI TAMPIL
  ===================================================== */

  function tampilkanKarya(jenisAktif) {

    pub.innerHTML = "";


    const dataTampil =
      jenisAktif === "Semua"
        ? karya
        : karya.filter(item => {
            return String(
              item.jenis || ""
            ).trim() === jenisAktif;
          });


    dataTampil.forEach(item => {

      const article =
        document.createElement("article");


      /* FOTO */

      if (
        item.foto &&
        String(item.foto).trim()
      ) {

        const img =
          document.createElement("img");

        img.src =
          String(item.foto).trim();

        img.alt =
          item.judul || "Karya";

        img.style.width = "100%";
        img.style.maxHeight = "220px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "12px";
        img.style.display = "block";
        img.style.marginBottom = "16px";


        img.onerror = function () {
          this.remove();
        };


        article.appendChild(img);
      }


      /* JUDUL */

      const judul =
        document.createElement("h3");

      judul.textContent =
        item.judul || "Tanpa judul";

      article.appendChild(judul);


      /* JENIS + TAHUN */

      const info =
        document.createElement("p");

      let infoText =
        item.jenis || "Karya";

      if (item.tahun) {
        infoText +=
          " • " + item.tahun;
      }

      info.textContent =
        infoText;

      article.appendChild(info);


      /* PENULIS */

      if (item.penulis) {

        const penulis =
          document.createElement("p");

        penulis.textContent =
          "Oleh " + item.penulis;

        penulis.style.marginTop =
          "8px";

        article.appendChild(
          penulis
        );
      }


      pub.appendChild(article);
    });
  }


  /* =====================================================
     BUTTON SEMUA
  ===================================================== */

  const semua =
    document.createElement("button");

  semua.type = "button";
  semua.textContent = "Semua";
  semua.setAttribute(
    "aria-pressed",
    "true"
  );


  semua.addEventListener(
    "click",
    function () {

      filter
        .querySelectorAll("button")
        .forEach(button => {

          button.setAttribute(
            "aria-pressed",
            "false"
          );
        });


      semua.setAttribute(
        "aria-pressed",
        "true"
      );


      tampilkanKarya("Semua");
    }
  );


  filter.appendChild(semua);


  /* =====================================================
     BUTTON JENIS
  ===================================================== */

  daftarJenis.forEach(jenis => {

    const button =
      document.createElement("button");

    button.type = "button";
    button.textContent = jenis;

    button.setAttribute(
      "aria-pressed",
      "false"
    );


    button.addEventListener(
      "click",
      function () {

        filter
          .querySelectorAll("button")
          .forEach(btn => {

            btn.setAttribute(
              "aria-pressed",
              "false"
            );
          });


        button.setAttribute(
          "aria-pressed",
          "true"
        );


        tampilkanKarya(jenis);
      }
    );


    filter.appendChild(button);
  });


  tampilkanKarya("Semua");
}


/* =========================================================
   DASHBOARD STATISTIK
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


  /* =====================================================
     JUMLAH PENGURUS
  ===================================================== */

  if (sPengurus) {

    sPengurus.textContent =
      dataPengurus.length;
  }


  /* =====================================================
     JUMLAH DIVISI
  ===================================================== */

  if (sDivisi) {

    const daftarDivisi = [
      ...new Set(
        dataPengurus
          .map(item =>
            String(
              item.divisi || ""
            ).trim()
          )
          .filter(Boolean)
      )
    ];


    sDivisi.textContent =
      daftarDivisi.length;
  }


  /* =====================================================
     JUMLAH AGENDA
  ===================================================== */

  if (sAgenda) {

    sAgenda.textContent =
      dataAgenda.length;
  }


  /* =====================================================
     JUMLAH KARYA
  ===================================================== */

  if (sKarya) {

    sKarya.textContent =
      dataKarya.length;
  }


  /* =====================================================
     GRAFIK KARYA
  ===================================================== */

  if (!barKarya) {
    return;
  }


  barKarya.innerHTML = "";


  if (dataKarya.length === 0) {

    barKarya.innerHTML = `
      <p class="lead">
        Belum ada data karya.
      </p>
    `;

    return;
  }


  const hitung = {};


  dataKarya.forEach(item => {

    const jenis =
      String(
        item.jenis || "Lainnya"
      ).trim();


    if (!hitung[jenis]) {
      hitung[jenis] = 0;
    }

    hitung[jenis]++;
  });


  const total =
    dataKarya.length;


  Object.entries(hitung)
    .forEach(
      ([jenis, jumlah]) => {

        const persen =
          Math.round(
            (jumlah / total) * 100
          );


        const row =
          document.createElement("div");

        row.className =
          "bar";


        const nama =
          document.createElement("span");

        nama.textContent =
          jenis;


        const track =
          document.createElement("div");

        track.className =
          "track";


        const fill =
          document.createElement("div");

        fill.className =
          "fill";

        fill.style.width =
          persen + "%";


        track.appendChild(fill);


        const jumlahEl =
          document.createElement("b");

        jumlahEl.textContent =
          jumlah;


        row.appendChild(nama);
        row.appendChild(track);
        row.appendChild(jumlahEl);


        barKarya.appendChild(row);
      }
    );
}


/* =========================================================
   KAJIAN
========================================================= */

function renderKajian(data) {

  /*
     Bagian bidang kajian di index.html
     sudah punya 4 bidang bawaan.

     Jadi kalau tabel kajian belum ada,
     tidak perlu menghapus apa pun.
  */

  const fields =
    document.querySelector(".fields");


  if (!fields) {
    return;
  }


  const kajian =
    Array.isArray(data)
      ? data
      : [];


  /*
     Kalau tidak ada data dari database,
     biarkan tampilan bawaan index.html.
  */

  if (kajian.length === 0) {
    return;
  }


  /*
     Kalau database kajian punya data,
     coba gunakan data tersebut.
  */

  const aktif =
    kajian.filter(item => {

      const status =
        String(
          item.status || "aktif"
        )
          .trim()
          .toLowerCase();

      return (
        status === "aktif" ||
        status === "active"
      );
    });


  if (aktif.length === 0) {
    return;
  }


  fields.innerHTML = "";


  aktif.forEach(item => {

    const field =
      document.createElement("div");

    field.className =
      "field";


    const judul =
      document.createElement("h3");

    judul.textContent =
      item.judul ||
      item.bidang ||
      item.nama ||
      "Bidang Kajian";


    const deskripsi =
      document.createElement("p");

    deskripsi.textContent =
      item.deskripsi ||
      item.keterangan ||
      "";


    field.appendChild(judul);
    field.appendChild(deskripsi);

    fields.appendChild(field);
  });
}


/* =========================================================
   MULAI APLIKASI
========================================================= */

async function mulai() {

  console.log(
    "SKEMA: mulai..."
  );


  try {

    const hasil =
      await Promise.all([

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
        )

      ]);


    const pengurus =
      Array.isArray(hasil[0])
        ? hasil[0]
        : [];

    const agenda =
      Array.isArray(hasil[1])
        ? hasil[1]
        : [];

    const karya =
      Array.isArray(hasil[2])
        ? hasil[2]
        : [];


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


    /* =====================================================
       RENDER
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


    /*
       Kajian tidak lagi dipanggil dari Supabase.
       Bidang kajian di index.html tetap menggunakan
       4 bidang bawaan.
    */


    console.log(
      "SKEMA: selesai."
    );


  } catch (error) {

    console.error(
      "SKEMA ERROR:",
      error
    );


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
   JALANKAN
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    mulai
  );

} else {

  mulai();

}
