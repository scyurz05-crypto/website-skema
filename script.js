/* =========================
HELPER
========================= */

function inisial(nama = ""){

return nama
  .split(" ")
  .filter(Boolean)
  .slice(0,2)
  .map(k => k[0].toUpperCase())
  .join("");

}


/* =========================
KARTU PENGURUS
========================= */

function kartuOrang(o){

const c = el("article","person");

const avatar = el("div","avatar");


if(o.foto && o.foto.trim()){

const img =
  document.createElement("img");

img.src = o.foto;

img.alt =
  "Foto " + o.nama;

img.onerror = () => {

  avatar.innerHTML = "";

  avatar.textContent =
    inisial(o.nama);

};

avatar.appendChild(img);

}else{

avatar.textContent =
  inisial(o.nama);

}


c.appendChild(avatar);


const info =
  el("div","info");


info.appendChild(
  el(
    "strong",
    "",
    o.nama
  )
);


info.appendChild(
  el(
    "span",
    "role",
    o.jabatan || ""
  )
);


const meta = [
  o.prodi,
  o.angkatan
    ? "(" + o.angkatan + ")"
    : ""
]
.filter(Boolean)
.join(" ");


if(meta){

info.appendChild(
  el(
    "span",
    "meta",
    meta
  )
);

}


c.appendChild(info);


/* SOCIAL MEDIA */

const socials =
  el("div","socials");


if(o.instagram){

const a =
  document.createElement("a");

a.href =
  o.instagram;

a.target =
  "_blank";

a.rel =
  "noopener noreferrer";

a.textContent =
  "IG";

a.title =
  "Instagram";

socials.appendChild(a);

}


if(o.tiktok){

const a =
  document.createElement("a");

a.href =
  o.tiktok;

a.target =
  "_blank";

a.rel =
  "noopener noreferrer";

a.textContent =
  "TT";

a.title =
  "TikTok";

socials.appendChild(a);

}


if(o.linkedin){

const a =
  document.createElement("a");

a.href =
  o.linkedin;

a.target =
  "_blank";

a.rel =
  "noopener noreferrer";

a.textContent =
  "IN";

a.title =
  "LinkedIn";

socials.appendChild(a);

}


if(socials.children.length){

c.appendChild(socials);

}


return c;

}


/* =========================
FILTER BUTTON
========================= */

function filterBar(id,names,onPick){

const bar =
  $(id);

if(!bar) return;

bar.innerHTML = "";


["all",...names].forEach(n => {

const b =
  el(
    "button",
    "",
    n === "all"
      ? "Semua"
      : n
  );


b.setAttribute(
  "aria-pressed",
  n === "all"
);


b.onclick = () => {

bar
  .querySelectorAll("button")
  .forEach(x =>
    x.setAttribute(
      "aria-pressed",
      x === b
    )
  );


onPick(n);

};


bar.appendChild(b);

});

}


/* =========================
DIVISI
========================= */

function renderDivisi(
pengurus,
names,
f
){

const box =
  $("divisi");

if(!box) return;

box.innerHTML = "";


names
.filter(
  n =>
    f === "all" ||
    n === f
)
.forEach(n => {


const g =
  el(
    "div",
    "divisi"
  );


g.appendChild(
  el(
    "h3",
    "",
    n
  )
);


const tugas =
  el(
    "p",
    "tugas",
    "Anggota divisi " + n
  );


g.appendChild(tugas);


const l =
  el(
    "div",
    "people"
  );


pengurus
  .filter(
    o =>
      o.divisi === n
  )
  .forEach(o =>
    l.appendChild(
      kartuOrang(o)
    )
  );


g.appendChild(l);


box.appendChild(g);

});

}


/* =========================
KARYA
========================= */

function renderKarya(
karya,
f
){

const box =
  $("pub");

if(!box) return;

box.innerHTML = "";


const list =
  karya.filter(
    k =>
      f === "all" ||
      k.jenis === f
  );


if(!list.length){

box.appendChild(
  el(
    "p",
    "lead",
    "Belum ada karya."
  )
);

return;

}


list.forEach(k => {


const article =
  el("article");


const jenis =
  el(
    "span",
    "eyebrow blue",
    k.jenis || "Karya"
  );


article.appendChild(jenis);


article.appendChild(
  el(
    "h3",
    "",
    k.judul
  )
);


const info = [
  k.penulis,
  k.tahun
]
.filter(Boolean)
.join(" · ");


article.appendChild(
  el(
    "p",
    "",
    info ||
    "Informasi karya belum tersedia."
  )
);


box.appendChild(article);

});

}


/* =========================
STATISTIK
========================= */

function statistik(
pengurus,
agenda,
karya,
divisi
){

const setText =
  (id,value) => {

    const e =
      $(id);

    if(e){
      e.textContent =
        value;
    }

  };


setText(
  "s-pengurus",
  pengurus.length
);


setText(
  "s-divisi",
  divisi.length
);


setText(
  "s-agenda",
  agenda.length
);


setText(
  "s-karya",
  karya.length
);


/* STATISTIK HERO */

setText(
  "hero-pengurus",
  pengurus.length
);


setText(
  "hero-karya",
  karya.length
);


/* BAR KARYA */

const box =
  $("bar-karya");

if(!box) return;

box.innerHTML = "";


if(!karya.length){

box.appendChild(
  el(
    "p",
    "lead",
    "Belum ada data karya."
  )
);

return;

}


const per = {};


karya.forEach(k => {

const jenis =
  k.jenis ||
  "Lainnya";

per[jenis] =
  (per[jenis] || 0) +
  1;

});


const total =
  karya.length;


Object.entries(per)
.forEach(
([nama,jumlah]) => {

const r =
  el(
    "div",
    "bar"
  );


const track =
  el(
    "div",
    "track"
  );


const fill =
  el(
    "div",
    "fill"
  );


fill.style.width =
  (jumlah / total * 100) +
  "%";


track.appendChild(fill);


r.appendChild(
  el(
    "span",
    "",
    nama
  )
);


r.appendChild(track);


r.appendChild(
  el(
    "b",
    "",
    jumlah
  )
);


box.appendChild(r);

});

}


/* =========================
AGENDA
========================= */

function renderAgenda(agenda){

const box =
  $("agenda-list");

if(!box) return;

box.innerHTML = "";


if(!agenda.length){

box.appendChild(
  el(
    "p",
    "lead",
    "Belum ada agenda."
  )
);

return;

}


agenda.forEach(a => {


const card =
  el(
    "article",
    "agenda-card"
  );


/* =========================
FOTO AGENDA
========================= */

if(
  a.foto &&
  a.foto.trim()
){

const img =
  document.createElement("img");


img.src =
  a.foto;


img.alt =
  "Foto " +
  (a.kegiatan || "Kegiatan");


img.loading =
  "lazy";


/*
  Ukuran foto langsung diatur
  di sini supaya tidak wajib
  mengubah CSS.
*/

img.style.width =
  "100%";

img.style.maxHeight =
  "240px";

img.style.objectFit =
  "cover";

img.style.borderRadius =
  "12px";

img.style.display =
  "block";

img.style.marginBottom =
  "16px";


img.onerror = () => {

  img.style.display =
    "none";

};


card.appendChild(img);

}


/* =========================
JENIS
========================= */

card.appendChild(
  el(
    "span",
    "agenda-type",
    a.jenis ||
    "Kegiatan"
  )
);


/* =========================
KEGIATAN
========================= */

card.appendChild(
  el(
    "h3",
    "",
    a.kegiatan ||
    "Kegiatan"
  )
);


/* =========================
WAKTU
========================= */

card.appendChild(
  el(
    "div",
    "agenda-time",
    a.waktu ||
    "Waktu belum ditentukan"
  )
);


box.appendChild(card);

});

}


/* =========================
MULAI WEBSITE
========================= */

async function mulai(){

try{


const [
  pengurus,
  agenda,
  karya
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
    "id"
  )

]);


/* =========================
DIVISI
========================= */

const divisi = [

  ...new Set(

    pengurus
      .filter(
        o =>
          o.divisi
      )
      .map(
        o =>
          o.divisi
      )

  )

];


/* =========================
STATISTIK
========================= */

statistik(
  pengurus,
  agenda,
  karya,
  divisi
);


/* =========================
PENGURUS INTI
========================= */

const inti =
  $("inti");


if(inti){

inti.innerHTML = "";


pengurus
  .filter(
    o =>
      !o.divisi
  )
  .forEach(o => {

    inti.appendChild(
      kartuOrang(o)
    );

  });

}


/* =========================
FILTER DIVISI
========================= */

filterBar(
  "filter-divisi",
  divisi,
  f =>
    renderDivisi(
      pengurus,
      divisi,
      f
    )
);


renderDivisi(
  pengurus,
  divisi,
  "all"
);


/* =========================
AGENDA
========================= */

renderAgenda(
  agenda
);


/* =========================
KARYA
========================= */

const jenis = [

  ...new Set(

    karya
      .map(
        k =>
          k.jenis
      )
      .filter(Boolean)

  )

];


filterBar(
  "filter-karya",
  jenis,
  f =>
    renderKarya(
      karya,
      f
    )
);


renderKarya(
  karya,
  "all"
);


}catch(error){

console.error(
  "Gagal memuat website:",
  error
);

}

}


/* =========================
JALANKAN WEBSITE
========================= */

mulai();
