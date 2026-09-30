function inisial(n){return n.split(" ").filter(Boolean).slice(0,2).map(k=>k[0].toUpperCase()).join("")}

function kartuOrang(o){
  const c=el("article","person"), i=el("div","info");
  c.appendChild(el("div","avatar",inisial(o.nama)));
  i.appendChild(el("strong","",o.nama));
  i.appendChild(el("span","role",o.jabatan));
  i.appendChild(el("span","meta",(o.prodi||"")+(o.angkatan?" ("+o.angkatan+")":"")));
  c.appendChild(i); return c;
}

// Tombol filter: "Semua" + tiap nama. onPick dipanggil saat diklik.
function filterBar(id,names,onPick){
  const bar=$(id); bar.innerHTML="";
  ["all",...names].forEach(n=>{
    const b=el("button","",n==="all"?"Semua":n);
    b.setAttribute("aria-pressed",n==="all");
    b.onclick=()=>{bar.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));onPick(n)};
    bar.appendChild(b);
  });
}

function renderDivisi(pengurus,names,f){
  const box=$("divisi"); box.innerHTML="";
  names.filter(n=>f==="all"||n===f).forEach(n=>{
    const g=el("div","divisi"), l=el("div","people");
    g.appendChild(el("h3","","Divisi "+n));
    pengurus.filter(o=>o.divisi===n).forEach(o=>l.appendChild(kartuOrang(o)));
    g.appendChild(l); box.appendChild(g);
  });
}

function renderKarya(karya,f){
  const box=$("pub"); box.innerHTML="";
  const list=karya.filter(k=>f==="all"||k.jenis===f);
  if(!list.length) box.appendChild(el("p","lead","Belum ada karya."));
  list.forEach(k=>{
    const a=el("article"); a.appendChild(el("h3","",k.judul));
    a.appendChild(el("p","",[k.penulis,k.jenis,k.tahun].filter(Boolean).join(" · ")));
    box.appendChild(a);
  });
}

function statistik(pengurus,agenda,karya,divisi){
  $("s-pengurus").textContent=pengurus.length;
  $("s-divisi").textContent=divisi.length;
  $("s-agenda").textContent=agenda.length;
  $("s-karya").textContent=karya.length;
  const per={}; karya.forEach(k=>{per[k.jenis||"Lainnya"]=(per[k.jenis||"Lainnya"]||0)+1});
  const box=$("bar-karya"); box.innerHTML="";
  Object.entries(per).forEach(([n,j])=>{
    const r=el("div","bar"), t=el("div","track"), f=el("div","fill");
    f.style.width=(j/karya.length*100)+"%"; t.appendChild(f);
    r.append(el("span","",n),t,el("b","",j)); box.appendChild(r);
  });
}

async function mulai(){
  const [pengurus,agenda,karya]=await Promise.all([ambil("pengurus","urutan"),ambil("agenda","id"),ambil("karya","id")]);
  const divisi=[...new Set(pengurus.filter(o=>o.divisi).map(o=>o.divisi))];
  statistik(pengurus,agenda,karya,divisi);

  pengurus.filter(o=>!o.divisi).forEach(o=>$("inti").appendChild(kartuOrang(o)));
  filterBar("filter-divisi",divisi,f=>renderDivisi(pengurus,divisi,f));
  renderDivisi(pengurus,divisi,"all");

  agenda.forEach(a=>{
    const tr=el("tr"), td=el("td"), tag=el("span","tag",a.jenis||"");
    tr.appendChild(el("td","",a.kegiatan)); tr.appendChild(el("td","",a.waktu||""));
    td.appendChild(tag); tr.appendChild(td); $("agenda-body").appendChild(tr);
  });

  const jenis=[...new Set(karya.map(k=>k.jenis).filter(Boolean))];
  filterBar("filter-karya",jenis,f=>renderKarya(karya,f));
  renderKarya(karya,"all");
}
mulai();