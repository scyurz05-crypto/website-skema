-- Jalankan di Supabase: menu SQL Editor -> New query -> tempel -> Run
create table pengurus(id bigint generated always as identity primary key, nama text not null, jabatan text not null, divisi text not null default '', prodi text, angkatan int, urutan int default 0);
create table agenda(id bigint generated always as identity primary key, kegiatan text not null, waktu text, jenis text);
create table karya(id bigint generated always as identity primary key, judul text not null, jenis text, penulis text, tahun int);

-- Semua orang boleh MEMBACA; hanya user yang login (admin) boleh menulis
do $$ declare t text; begin
  foreach t in array array['pengurus','agenda','karya'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "baca publik" on %I for select using (true)', t);
    execute format('create policy "admin tulis" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;
