function $(selector) {
return document.querySelector(selector);
}

function el(tag, className, text) {
const node = document.createElement(tag);

if (className) node.className = className;
if (text !== undefined) node.textContent = text;

return node;
}

/* =========================
INISIAL
========================= */

function inisial(nama) {
if (!nama) return "?";

return nama
.trim()
.split(/\s+/)
.slice(0, 2)
.map(x => x[0])
.join("")
.toUpperCase();
}

/* =========================
KARTU PENGURUS
========================= */

function kartuOrang(o) {
const card = el("article", "person-card");

if (o.foto && o.foto.trim()) {
const img = document.createElement("img");


img.src = o.foto;
img.alt = "Foto " + (o.nama || "Pengurus");
img.loading = "lazy";

img.onerror = () => {
  img.style.display = "none";
};

card.appendChild(img);


} else {
card.appendChild(
el("div", "avatar", inisial(o.nama))
);
}

const content = el("div", "person-content");

content.appendChild(
el("h3", "", o.nama || "Tanpa nama")
);

content.appendChild(
el("div", "role", o.jabatan || "")
);

const info = [];

if (o.prodi) info.push(o.prodi);
if (o.angkatan) info.push("Angkatan " + o.angkatan);

if (info.length) {
content.appendChild(
el("p", "muted", info.join(" • "))
);
}

const socials = el("div", "socials");

if (o.instagram) {
const a = document.createElement("a");


a.href = o.instagram;
a.target = "_blank";
a.rel = "noopener noreferrer";
a.textContent = "Instagram";

socials.appendChild(a);

}

if (o.tiktok) {
const a = document.createElement("a");

a.href = o.tiktok;
a.target = "_blank";
a.rel = "noopener noreferrer";
a.textContent = "TikTok";

socials.appendChild(a);


}

if (o.linkedin) {
const a = document.createElement("a");


a.href = o.linkedin;
a.target = "_blank";
a.rel = "noopener noreferrer";
a.textContent = "LinkedIn";

socials.appendChild(a);


}

if (socials.children.length) {
content.appendChild(socials);
}

card.appendChild(content);

return card;
}

/* =========================
FILTER PENGURUS
========================= */

function filterBar(data) {
const wrap = $("#filter-divisi");
const target = $("#divisi");

if (!wrap || !target) return;

const divisi = [
"Semua",
...new Set(
data
.map(x => x.divisi)
.filter(Boolean)
)
];

wrap.innerHTML = "";

function tampil(nama) {
target.innerHTML = "";


const filtered =
  nama === "Semua"
    ? data
    : data.filter(x => x.divisi === nama);

if (!filtered.length) {
  target.appendChild(
    el("p", "muted", "Belum ada pengurus.")
  );
  return;
}

filtered.forEach(x => {
  target.appendChild(
    kartuOrang(x)
  );
});


}

divisi.forEach((nama, index) => {
const button = document.createElement("button");


button.type = "button";
button.textContent = nama;

if (index === 0) {
  button.classList.add("active");
}

button.addEventListener("click", () => {
  wrap
    .querySelectorAll("button")
    .forEach(x => x.classList.remove("active"));

  button.classList.add("active");

  tampil(nama);
});

wrap.appendChild(button);

});

tampil("Semua");
}

/* =========================
KAJIAN
========================= */

function renderKajian(data) {
const target = $("#kajian-list");
const filter = $("#filter-kajian");

if (!target) return;

/*
Hanya tampilkan kajian dengan status Aktif.
Kajian Nonaktif tidak akan muncul
di halaman utama.
*/

const aktif = data.filter(k => {
const status = String(k.status || "Aktif")
.trim()
.toLowerCase();


return status === "aktif";


});

function tampil(items) {
target.innerHTML = "";


if (!items.length) {
  target.innerHTML =
    '<p class="muted">Belum ada kajian.</p>';

  return;
}


items.forEach(k => {
  const card = el("article", "topic-card");

  card.appendChild(
    el(
      "span",
      "",
      String(k.urutan || "")
    )
  );

  card.appendChild(
    el(
      "h3",
      "",
      k.judul || "Tanpa judul"
    )
  );


  if (k.bidang) {
    card.appendChild(
      el(
        "div",
        "kajian-bidang",
        k.bidang
      )
    );
  }


  if (k.deskripsi) {
    card.appendChild(
      el(
        "p",
        "",
        k.deskripsi
      )
    );
  }


  const meta = [];

  if (k.penulis) {
    meta.push(k.penulis);
  }

  if (k.tahun) {
    meta.push(k.tahun);
  }

  if (meta.length) {
    card.appendChild(
      el(
        "small",
        "muted",
        meta.join(" • ")
      )
    );
  }


  target.appendChild(card);
});


}

if (filter) {
filter.innerHTML = "";


const bidang = [
  "Semua",
  ...new Set(
    aktif
      .map(k => k.bidang)
      .filter(Boolean)
  )
];


bidang.forEach((nama, index) => {
  const button =
    document.createElement("button");

  button.type = "button";
  button.textContent = nama;

  if (index === 0) {
    button.classList.add("active");
  }


  button.addEventListener("click", () => {
    filter
      .querySelectorAll("button")
      .forEach(x =>
        x.classList.remove("active")
      );

    button.classList.add("active");


    tampil(
      nama === "Semua"
        ? aktif
        : aktif.filter(
            k => k.bidang === nama
          )
    );
  });


  filter.appendChild(button);
});


}

tampil(aktif);
}

/* =========================
AGENDA
========================= */

function renderAgenda(agenda) {
const wrap = $("#agenda-list");

if (!wrap) return;

wrap.innerHTML = "";

if (!agenda.length) {
wrap.innerHTML =
'<p class="muted">Belum ada agenda.</p>';


return;


}

agenda.forEach(a => {
const card =
el("article", "agenda-card");

if (a.foto && a.foto.trim()) {
  const img =
    document.createElement("img");

  img.src = a.foto;

  img.alt =
    "Foto " +
    (a.kegiatan || "Kegiatan");

  img.loading = "lazy";

  img.style.width = "100%";
  img.style.maxHeight = "240px";
  img.style.objectFit = "cover";
  img.style.borderRadius = "12px";
  img.style.display = "block";
  img.style.marginBottom = "16px";

  img.onerror = () => {
    img.style.display = "none";
  };

  card.appendChild(img);
}


card.appendChild(
  el(
    "div",
    "agenda-type",
    a.jenis || "Agenda"
  )
);


card.appendChild(
  el(
    "h3",
    "",
    a.kegiatan || "Tanpa nama kegiatan"
  )
);


if (a.waktu) {
  card.appendChild(
    el(
      "p",
      "muted",
      a.waktu
    )
  );
}


wrap.appendChild(card);


});
}

/* =========================
KARYA
========================= */

function renderKarya(data) {
const wrap = $("#pub");
const filter = $("#filter-karya");

if (!wrap) return;

function tampil(items) {
wrap.innerHTML = "";

if (!items.length) {
  wrap.innerHTML =
    '<p class="muted">Belum ada karya.</p>';

  return;
}


items.forEach(k => {
  const card =
    el("article", "pub-card");


  card.appendChild(
    el(
      "div",
      "pub-type",
      k.jenis || "Karya"
    )
  );


  card.appendChild(
    el(
      "h3",
      "",
      k.judul || "Tanpa judul"
    )
  );


  const meta = [];

  if (k.penulis) {
    meta.push(k.penulis);
  }

  if (k.tahun) {
    meta.push(k.tahun);
  }


  if (meta.length) {
    card.appendChild(
      el(
        "p",
        "muted",
        meta.join(" • ")
      )
    );
  }


  wrap.appendChild(card);
});


}

if (filter) {
filter.innerHTML = "";


const jenis = [
  "Semua",
  ...new Set(
    data
      .map(x => x.jenis)
      .filter(Boolean)
  )
];


jenis.forEach((nama, index) => {
  const button =
    document.createElement("button");

  button.type = "button";
  button.textContent = nama;


  if (index === 0) {
    button.classList.add("active");
  }


  button.addEventListener("click", () => {
    filter
      .querySelectorAll("button")
      .forEach(x =>
        x.classList.remove("active")
      );

    button.classList.add("active");


    tampil(
      nama === "Semua"
        ? data
        : data.filter(
            x => x.jenis === nama
          )
    );
  });


  filter.appendChild(button);
});


}

tampil(data);
}

/* =========================
STATISTIK
========================= */

function statistik(
pengurus,
agenda,
karya
) {
const sPengurus = $("#s-pengurus");
const sDivisi = $("#s-divisi");
const sAgenda = $("#s-agenda");
const sKarya = $("#s-karya");
const bar = $("#bar-karya");

const jumlahDivisi =
new Set(
pengurus
.map(x => x.divisi)
.filter(Boolean)
).size;

if (sPengurus) {
sPengurus.textContent =
pengurus.length;
}

if (sDivisi) {
sDivisi.textContent =
jumlahDivisi;
}

if (sAgenda) {
sAgenda.textContent =
agenda.length;
}

if (sKarya) {
sKarya.textContent =
karya.length;
}

if (bar) {
const persen =
Math.min(
100,
karya.length * 10
);


bar.style.width =
  persen + "%";


}
}

/* =========================
MULAI
========================= */

async function mulai() {

try {


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


statistik(
  pengurus,
  agenda,
  karya
);


filterBar(
  pengurus
);


renderKajian(
  kajian
);


renderAgenda(
  agenda
);


renderKarya(
  karya
);


console.log(
  "SKEMA berhasil memuat data:",
  {
    pengurus: pengurus.length,
    agenda: agenda.length,
    karya: karya.length,
    kajian: kajian.length
  }
);


} catch (error) {


console.error(
  "Gagal memuat data SKEMA:",
  error
);


}
}

/* =========================
JALANKAN
========================= */

document.addEventListener(
"DOMContentLoaded",
mulai
);
