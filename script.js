// ===== SECURITY MODULE =====
const _SEC=(()=>{
  // Generate session token on page load - changes every session
  const _st=()=>{
    const t=Date.now()
    const r=Math.random().toString(36).slice(2,10)
    const nav=[
      navigator.language||'',
      screen.width+'x'+screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency||0,
      navigator.platform||''
    ].join('|')
    // Simple hash
    let h=0
    const s=t+r+nav
    for(let i=0;i<s.length;i++){h=((h<<5)-h+s.charCodeAt(i))|0}
    return r+(Math.abs(h)>>>0).toString(16)
  }
  // CSRF token - regenerated each session
  const _tok=_st()
  const _sid=Math.random().toString(36).slice(2)+Date.now().toString(36)
  const _t0=Date.now()

  // Rate limiter
  const _rl={count:0,window:60000,max:30,last:Date.now()}
  const _check=()=>{
    const now=Date.now()
    if(now-_rl.last>_rl.window){_rl.count=0;_rl.last=now}
    _rl.count++
    return _rl.count<=_rl.max
  }

  // Build secure headers
  const _headers=(extra)=>{
    const now=Date.now()
    const age=now-_t0
    // Time-based rotating value (changes every 30s)
    const tv=Math.floor(now/30000).toString(36)
    // Page integrity check
    const pi=[document.title,location.hostname,document.charset||'UTF-8'].join(':')
    let ph=0
    for(let i=0;i<pi.length;i++){ph=((ph<<5)-ph+pi.charCodeAt(i))|0}
    return {
      'Content-Type':'application/json',
      'X-Req-Token': _tok,
      'X-Session-Id': _sid,
      'X-Client-Age': age.toString(),
      'X-Page-Check': (Math.abs(ph)>>>0).toString(16),
      'X-Tv': tv,
      ...(extra||{})
    }
  }

  // Endpoint encoder - splits and reconstructs at call time
  const _ep=(parts,sep)=>parts.join(sep||'')

  return {check:_check,headers:_headers,ep:_ep,tok:_tok}
})()
// ===== END SECURITY MODULE =====

function _getThinkingSteps(prompt,hasAttachment,attachmentIsImage,attachmentName){
  const p=(prompt||'').toLowerCase()
  const ext=(attachmentName||'').split('.').pop().toLowerCase()
  const pool=[]

  if(attachmentIsImage||/\b(gambar|foto|image|photo|screenshot|tangkap layar|capture|pic|picture|visual|ilustrasi|infografis|poster|banner|thumbnail|avatar|logo|icon|desain|design|render|mockup|wireframe|foto produk|foto profil|meme|stiker)\b/.test(p)){
    pool.push(
      'Menganalisis gambar','Memproses piksel gambar','Mendeteksi objek dan elemen',
      'Mengidentifikasi warna dominan','Membaca teks dalam gambar (OCR)',
      'Menganalisis komposisi visual','Mendeteksi bentuk dan kontur',
      'Mengukur dimensi dan proporsi','Mengenali pola dan tekstur',
      'Memahami konteks gambar','Menilai kualitas dan resolusi',
      'Mengidentifikasi gaya visual','Mendeteksi latar belakang dan foreground',
      'Menganalisis pencahayaan gambar','Mengenali simbol dan ikon',
      'Mendeteksi objek tersembunyi','Menganalisis kedalaman gambar',
      'Memproses metadata gambar','Mengevaluasi saturasi warna',
      'Mengidentifikasi jenis konten visual','Menyusun deskripsi gambar lengkap'
    )
  }

  if(['pdf','doc','docx','txt','odt','rtf','md','pages','epub'].includes(ext)||/\b(dokumen|pdf|berkas|laporan|file teks|naskah|makalah|skripsi|karya tulis|proposal|kontrak|sertifikat|faktur|invoice|nota|memo|risalah|buku|manual|panduan|tesis|disertasi|surat resmi|akta)\b/.test(p)){
    pool.push(
      'Membuka dokumen','Membaca struktur dokumen','Mengekstrak teks utama',
      'Mengidentifikasi bab dan sub-bab','Memetakan alur konten',
      'Mencari informasi kunci','Menganalisis gaya penulisan',
      'Mengidentifikasi entitas penting','Memverifikasi data dokumen',
      'Mendeteksi referensi dan kutipan','Merangkum isi dokumen',
      'Mengecek konsistensi informasi','Menganalisis argumen utama',
      'Menelusuri kronologi informasi','Mendeteksi inkonsistensi data',
      'Mengidentifikasi kesimpulan dokumen','Menganalisis format dan layout',
      'Menghitung jumlah halaman dan kata','Menyusun ringkasan komprehensif',
      'Mengekstrak angka dan statistik','Mengidentifikasi penulis dan konteks'
    )
  }

  if(['xlsx','xls','csv','tsv','ods'].includes(ext)||/\b(data|tabel|spreadsheet|excel|angka|statistik|grafik|chart|pivot|kolom|baris|dataset|database|rekap|rekapitulasi|inventaris|laporan data|analisis data)\b/.test(p)){
    pool.push(
      'Memuat dataset','Membaca header kolom','Mengidentifikasi tipe data tiap kolom',
      'Menghitung total keseluruhan','Menghitung rata-rata','Mencari nilai maksimum',
      'Mencari nilai minimum','Menghitung median dan modus',
      'Mendeteksi data kosong (null/NaN)','Mendeteksi data duplikat',
      'Menganalisis distribusi data','Mengidentifikasi outlier',
      'Menyusun statistik deskriptif','Menganalisis korelasi antar kolom',
      'Menemukan tren dan pola data','Memverifikasi integritas data',
      'Menghitung persentase dan rasio','Menyaring data berdasarkan kriteria',
      'Mengurutkan data secara relevan','Mempersiapkan visualisasi data',
      'Menganalisis data time series','Menyusun laporan data komprehensif'
    )
  }

  if(/\b(kode|code|program|fungsi|function|bug|error|debug|javascript|python|java|html|css|php|sql|typescript|react|vue|angular|nodejs|script|algoritma|variabel|loop|array|object|class|method|api|endpoint|library|framework|compile|runtime|syntax|refactor|optimize|deploy|git|devops|backend|frontend|fullstack|database|query|server|rest|graphql|bash|shell|docker|kubernetes|regex|json|xml|flutter|kotlin|swift|golang|rust|ruby|scala|haskell|assembly|c\+\+|c#)\b/.test(p)){
    pool.push(
      'Membaca struktur kode','Menganalisis alur eksekusi','Memeriksa sintaks',
      'Mendeteksi potensi bug','Mengevaluasi logika algoritma',
      'Mengidentifikasi dependensi','Memeriksa keamanan kode',
      'Menganalisis kompleksitas waktu O(n)','Menganalisis kompleksitas ruang',
      'Menelusuri stack trace error','Mencari pola anti-pattern',
      'Mengevaluasi kualitas kode','Mengoptimalkan performa',
      'Memeriksa edge case','Menganalisis memory usage',
      'Meninjau naming convention','Mengecek code duplication',
      'Memvalidasi input dan output','Mengevaluasi error handling',
      'Menganalisis test coverage','Menyusun dokumentasi kode',
      'Mendeteksi race condition','Memeriksa null pointer risks',
      'Mengoptimalkan query database','Menyusun solusi optimal'
    )
  }

  if(/\b(hitung|kalkulasi|matematik|rumus|persamaan|integral|turunan|limit|aljabar|geometri|trigonometri|probabilitas|statistik|vektor|matriks|logaritma|eksponen|akar|pangkat|bilangan|pecahan|desimal|persen|rasio|proporsi|kombinatorik|permutasi|himpunan|logika|bunga|cicilan|diskon|pajak|konversi satuan|kalkulus|diferensial|deret|barisan)\b/.test(p)){
    pool.push(
      'Mengidentifikasi jenis soal matematika','Memuat rumus yang relevan',
      'Menentukan variabel dan konstanta','Menyederhanakan persamaan',
      'Menghitung langkah demi langkah','Memverifikasi hasil perhitungan',
      'Mengecek satuan dan dimensi','Mencari solusi alternatif',
      'Memplot grafik fungsi','Menyusun penjelasan matematis',
      'Memeriksa kasus batas (boundary)','Mengecek jawaban dengan substitusi',
      'Mengidentifikasi metode penyelesaian','Menyederhanakan ekspresi aljabar',
      'Menghitung determinan matriks','Menganalisis konvergensi deret',
      'Memverifikasi dengan kalkulasi balik','Menyusun bukti matematis'
    )
  }

  if(/\b(terjemah|translate|bahasa|language|inggris|indonesia|arab|jepang|korea|mandarin|spanyol|prancis|jerman|italia|rusia|hindi|melayu|belanda|portugis|latin|thai|vietnam|turki|linguistik|kosakata|grammar|tata bahasa|idiom|proofread|koreksi|ejaan|tanda baca|parafrase|parafrasa)\b/.test(p)){
    pool.push(
      'Mendeteksi bahasa sumber','Menganalisis struktur kalimat',
      'Mengidentifikasi register bahasa','Mencari padanan kata tepat',
      'Mempertimbangkan konteks budaya','Menerjemahkan ekspresi idiomatik',
      'Menyesuaikan gaya dan tone','Memeriksa keajekan terjemahan',
      'Mengecek tata bahasa target','Menyempurnakan diksi',
      'Memvalidasi makna keseluruhan','Mendeteksi false friend antar bahasa',
      'Menganalisis nuansa semantik','Mengecek tanda baca dan ejaan',
      'Menyesuaikan panjang kalimat','Memverifikasi istilah teknis'
    )
  }

  if(/\b(ringkas|rangkum|rekap|summary|singkat|kesimpulan|poin penting|highlight|intisari|garis besar|overview|abstrak|tldr|poin utama|resume|resum)\b/.test(p)){
    pool.push(
      'Membaca keseluruhan konten','Mengidentifikasi tema utama',
      'Menandai poin-poin kunci','Menyaring informasi penting',
      'Membuang informasi redundan','Mengelompokkan ide sejenis',
      'Mengatur urutan logis','Menyesuaikan tingkat detail',
      'Memformulasikan kesimpulan','Memverifikasi kelengkapan',
      'Mengidentifikasi argumen pendukung','Mendeteksi kontradiksi',
      'Menghitung proporsi informasi','Menyusun ringkasan terstruktur'
    )
  }

  if(/\b(tulis|buat|cerita|artikel|essay|puisi|surat|caption|konten|blog|copywriting|narasi|fiksi|naskah|skrip|slogan|tagline|deskripsi|biografi|autobiografi|cerpen|novel|pantun|lirik|sajak|pidato|email|pesan|pengumuman|iklan|press release|storyline|plot|karakter|dialog|monolog)\b/.test(p)){
    pool.push(
      'Merancang konsep tulisan','Mengembangkan kerangka ide',
      'Menentukan sudut pandang narasi','Memilih gaya penulisan',
      'Membangun opening yang kuat','Mengembangkan alur tengah',
      'Menyusun transisi antar bagian','Memilih diksi yang tepat',
      'Menambahkan detail dan contoh','Membangun climax atau argumen',
      'Menyusun penutup yang berkesan','Mengecek konsistensi tone',
      'Merevisi dan memoles tulisan','Menghitung kata dan paragraf',
      'Mengembangkan karakter dan setting','Membangun konflik yang menarik',
      'Menyesuaikan dengan target pembaca','Mengoptimalkan hook pembuka',
      'Mengevaluasi ritme dan flow tulisan','Menambahkan elemen persuasif'
    )
  }

  if(/https?:\/\/|www\.|\.com|\.id|\.org|\.net|\.io|\.co|\b(link|url|website|situs|halaman web|webpage|portal|domain|tautan|browse|akses web)\b/.test(p)){
    pool.push(
      'Memproses tautan','Menganalisis struktur URL',
      'Mengecek keamanan dan validitas tautan','Membaca konten halaman',
      'Mengekstrak informasi relevan','Memverifikasi sumber dan kredibilitas',
      'Menganalisis metadata halaman','Mendeteksi tanggal publikasi',
      'Menyaring konten utama dari iklan','Mengidentifikasi penulis konten',
      'Menganalisis struktur halaman','Menyusun ringkasan konten web'
    )
  }

  if(/\b(rekomen|saran|suggest|pilih|terbaik|bandingkan|versus|vs\b|review|ulasan|rating|ranking|peringkat|komparasi|evaluasi|penilaian|seleksi|alternatif|opsi|pilihan|lebih baik|mana yang|worth it|worth)\b/.test(p)){
    pool.push(
      'Mengidentifikasi semua opsi yang ada','Mengumpulkan kriteria penilaian',
      'Membandingkan spesifikasi teknis','Mengevaluasi kelebihan masing-masing',
      'Menganalisis kekurangan tiap opsi','Mempertimbangkan konteks kebutuhan',
      'Menghitung nilai terbaik per harga','Menelusuri ulasan pengguna nyata',
      'Mempertimbangkan after-sales support','Menganalisis reputasi brand',
      'Menyusun matriks perbandingan','Mempertimbangkan skalabilitas',
      'Mengevaluasi kemudahan penggunaan','Merumuskan rekomendasi final'
    )
  }

  if(/\b(rencana|jadwal|plan|schedule|agenda|itinerary|langkah|tahap|timeline|roadmap|milestone|target|goals|strategi|workflow|proses|prosedur|panduan|tutorial|cara|tips|step by step|to do|checklist|prioritas|sprint|backlog)\b/.test(p)){
    pool.push(
      'Memahami tujuan akhir','Mengidentifikasi sumber daya tersedia',
      'Menentukan prioritas utama','Membuat urutan langkah optimal',
      'Memperkirakan durasi setiap tahap','Mengidentifikasi dependensi antar tugas',
      'Mengantisipasi risiko potensial','Menyiapkan rencana kontingensi',
      'Mengoptimalkan alur kerja','Menentukan indikator keberhasilan (KPI)',
      'Menyusun timeline realistis','Mengalokasikan sumber daya',
      'Mengevaluasi bottleneck potensial','Memfinalisasi rencana aksi'
    )
  }

  if(/\b(cari|search|temukan|apa itu|apa yang|siapa|kapan|dimana|bagaimana|kenapa|mengapa|definisi|pengertian|maksud|arti|jelaskan|sebutkan|berikan contoh|contoh|fakta|informasi|tentang|apakah|benarkah|bedanya|perbedaan|persamaan|hubungan|sejarah|asal usul)\b/.test(p)){
    pool.push(
      'Memahami inti pertanyaan','Mengidentifikasi kata kunci utama',
      'Menelusuri basis pengetahuan','Menganalisis konteks pertanyaan',
      'Memverifikasi akurasi fakta','Menghubungkan konsep terkait',
      'Menyaring informasi paling relevan','Mengevaluasi bobot informasi',
      'Mengidentifikasi nuansa penting','Memeriksa perspektif berbeda',
      'Menghubungkan dengan contoh nyata','Mengecek konsistensi jawaban',
      'Menyusun jawaban terstruktur','Menambahkan konteks tambahan'
    )
  }

  if(/\b(fisika|kimia|biologi|astronomi|geografi|geologi|ekologi|evolusi|genetika|neurosains|kuantum|relativitas|termodinamika|elektromagnetik|optik|mekanika|atom|molekul|sel|dna|rna|protein|enzim|ekosistem|iklim|cuaca|lingkungan|energi|listrik|magnet|cahaya|suara|gelombang|reaksi kimia|unsur|senyawa|larutan|asam|basa|fotosintesis|mitosis)\b/.test(p)){
    pool.push(
      'Mengidentifikasi konsep ilmiah utama','Menganalisis teori yang berlaku',
      'Menghubungkan prinsip dasar sains','Menelusuri penelitian terkini',
      'Menganalisis mekanisme ilmiah','Mengevaluasi data eksperimen',
      'Memformulasikan penjelasan ilmiah','Menyederhanakan konsep kompleks',
      'Mengidentifikasi variabel penelitian','Mengevaluasi metodologi ilmiah',
      'Menghubungkan teori dengan aplikasi','Menyusun jawaban berbasis sains'
    )
  }

  if(/\b(kesehatan|medis|dokter|obat|penyakit|gejala|diagnosis|terapi|nutrisi|vitamin|mineral|diet|olahraga kesehatan|mental|psikologi|stres|anxiety|depresi|tidur|tekanan darah|gula darah|kolesterol|kalori|bmi|imun|vaksin|infeksi|virus|bakteri|alergi|luka|cedera|operasi|farmasi|dosis|efek samping|herbal|suplemen)\b/.test(p)){
    pool.push(
      'Menganalisis konteks kesehatan','Meninjau literatur medis relevan',
      'Mengidentifikasi faktor risiko','Mempertimbangkan riwayat kondisi',
      'Menganalisis gejala yang disebutkan','Mengevaluasi informasi obat',
      'Mempertimbangkan kontraindikasi','Mengidentifikasi interaksi obat',
      'Mengevaluasi pendekatan terapi','Menyusun informasi kesehatan akurat',
      'Menambahkan disclaimer medis','Merekomendasikan konsultasi dokter',
      'Menelusuri panduan klinis terkini','Mempertimbangkan kondisi individual'
    )
  }

  if(/\b(hukum|undang-undang|peraturan|regulasi|kontrak|perjanjian|pasal|ayat|pidana|perdata|advokat|pengacara|notaris|hak|kewajiban|sanksi|denda|gugatan|putusan|kebijakan|sop|compliance|legalitas|perizinan|warisan|hibah|sengketa|mediasi|arbitrase|pernikahan hukum|perceraian|hak cipta|merek dagang|paten|gdpr|privasi data)\b/.test(p)){
    pool.push(
      'Mengidentifikasi aspek hukum relevan','Menelusuri regulasi yang berlaku',
      'Menganalisis pasal-pasal terkait','Mempertimbangkan yurisdiksi',
      'Mengidentifikasi hak dan kewajiban','Mengevaluasi risiko hukum',
      'Menganalisis preseden kasus serupa','Mengidentifikasi pihak yang terlibat',
      'Mengevaluasi bukti dan fakta hukum','Menyusun penjelasan hukum',
      'Menambahkan catatan disclaimer hukum','Merekomendasikan konsultasi pengacara'
    )
  }

  if(/\b(bisnis|usaha|startup|perusahaan|investasi|saham|kripto|forex|keuangan|anggaran|budget|pendapatan|pengeluaran|profit|laba|rugi|neraca|akuntansi|pajak|modal|aset|utang|piutang|cashflow|roi|kpi|okr|marketing|branding|sales|customer|omzet|valuasi|ipo|dividen|portofolio|inflasi|suku bunga|ekspor|impor|supply chain|harga pokok|break even|margin)\b/.test(p)){
    pool.push(
      'Menganalisis konteks bisnis','Mengevaluasi model bisnis',
      'Menghitung metrik keuangan utama','Menganalisis arus kas (cashflow)',
      'Mengevaluasi profitabilitas','Menghitung break-even point',
      'Mengidentifikasi peluang pasar','Menganalisis posisi kompetitif',
      'Menilai risiko bisnis dan keuangan','Membandingkan dengan benchmark industri',
      'Menganalisis struktur biaya','Mengevaluasi strategi pricing',
      'Menyusun proyeksi keuangan','Mengidentifikasi sumber pendapatan',
      'Merumuskan strategi pertumbuhan','Menyiapkan analisis SWOT'
    )
  }

  if(/\b(belajar|pelajaran|materi|kurikulum|ujian|soal|latihan|pr|tugas|sekolah|kampus|universitas|mahasiswa|siswa|guru|dosen|les|kursus|edukasi|modul|bab|topik|quiz|ulangan|snmptn|utbk|cpns|skripsi|tesis|penelitian|jurnal|referensi|sitasi|bibliografi|hipotesis|metodologi penelitian)\b/.test(p)){
    pool.push(
      'Memahami topik pembelajaran','Mengidentifikasi konsep inti',
      'Memetakan hubungan antar konsep','Menentukan level kesulitan',
      'Menyusun penjelasan bertahap','Membuat analogi yang mudah dipahami',
      'Menyiapkan contoh konkret','Mengidentifikasi kesalahpahaman umum',
      'Menyusun pertanyaan latihan','Mengidentifikasi konsep prasyarat',
      'Merekomendasikan sumber belajar','Mengembangkan pemahaman konseptual',
      'Menyusun materi komprehensif','Mengevaluasi tingkat pemahaman'
    )
  }

  if(/\b(masak|resep|bahan|bumbu|cara membuat|takaran|porsi|oven|goreng|rebus|kukus|panggang|tumis|makanan|minuman|kue|roti|nasi|mie|sayur|daging|ikan|ayam|seafood|dessert|snack|jajanan|camilan|kopi|teh|smoothie|diet makanan|kalori makanan|vegetarian|vegan|halal|alergi makanan|baking|fermentasi|marinasi)\b/.test(p)){
    pool.push(
      'Membaca resep secara menyeluruh','Mengidentifikasi bahan-bahan utama',
      'Mengecek ketersediaan bahan','Menganalisis teknik memasak',
      'Menghitung takaran dan porsi','Mempertimbangkan waktu persiapan',
      'Mempertimbangkan waktu memasak','Mengidentifikasi substitusi bahan',
      'Memeriksa urutan langkah masak','Mengevaluasi suhu dan api',
      'Mengidentifikasi tanda kematangan','Menghitung nilai nutrisi',
      'Menyesuaikan untuk diet khusus','Menambahkan tips dan trik memasak',
      'Menyusun langkah memasak yang jelas','Mengevaluasi variasi resep'
    )
  }

  if(/\b(wisata|travel|liburan|destinasi|hotel|penginapan|tiket|penerbangan|itinerary|peta|rute|transportasi|visa|paspor|kota|negara|pantai|gunung|museum|restoran wisata|kuliner wisata|oleh-oleh|budget perjalanan|backpacker|staycation|honeymoon|tour|booking|reservasi|check-in|transit|stopover)\b/.test(p)){
    pool.push(
      'Menganalisis destinasi tujuan','Mencari atraksi wisata terbaik',
      'Mengecek musim dan cuaca setempat','Mengidentifikasi kebutuhan visa',
      'Menyusun itinerary optimal','Memperkirakan biaya transportasi',
      'Memperkirakan biaya akomodasi','Memperkirakan biaya makan harian',
      'Menghitung total budget perjalanan','Menemukan tips hemat biaya',
      'Mengidentifikasi tempat wajib dikunjungi','Mengevaluasi pilihan transportasi lokal',
      'Mencari info kuliner khas','Menambahkan tips keamanan perjalanan',
      'Mengidentifikasi adat dan budaya lokal','Menyusun panduan perjalanan lengkap'
    )
  }

  if(/\b(olahraga|fitness|gym|latihan|workout|lari|renang|sepeda|yoga|pilates|beban|cardio|otot|kalori bakar|berat badan|massa otot|program latihan|jadwal olahraga|peregangan|recovery|suplemen|protein|creatine|HIIT|aerobik|anaerobik|pull up|push up|squat|deadlift|bench press|marathon|triathlon|bulking|cutting|deficit kalori|surplus kalori)\b/.test(p)){
    pool.push(
      'Menganalisis tujuan kebugaran','Mengevaluasi level kebugaran saat ini',
      'Mengidentifikasi otot target','Menghitung kebutuhan kalori harian',
      'Menentukan rasio makronutrien','Menyusun program latihan optimal',
      'Mengatur intensitas dan volume latihan','Menentukan frekuensi latihan mingguan',
      'Menyusun jadwal pemulihan (rest day)','Menghitung progressive overload',
      'Mengoptimalkan nutrisi pre-workout','Mengoptimalkan nutrisi post-workout',
      'Mengevaluasi risiko cedera','Menambahkan panduan pemanasan',
      'Menambahkan panduan pendinginan','Menyusun program komprehensif'
    )
  }

  if(/\b(smartphone|laptop|komputer|tablet|headphone|kamera|printer|router|internet|wifi|bluetooth|aplikasi|software|hardware|spesifikasi|benchmark|performa|baterai|layar|prosesor|ram|storage|ssd|gpu|cpu|update|install|setting|konfigurasi|troubleshoot|driver|firmware|antivirus|backup|cloud|streaming|gaming|pc gaming|monitor|keyboard|mouse|gaming chair|vr|ar)\b/.test(p)){
    pool.push(
      'Mengidentifikasi perangkat yang dimaksud','Menganalisis spesifikasi teknis',
      'Membandingkan performa benchmark','Mengevaluasi fitur-fitur utama',
      'Mengecek kompatibilitas sistem','Menganalisis nilai harga per performa',
      'Meninjau ulasan pengguna','Mengidentifikasi masalah umum',
      'Mengevaluasi garansi dan dukungan','Menganalisis konsumsi daya',
      'Mengidentifikasi alternatif terbaik','Menyusun panduan pembelian',
      'Merumuskan rekomendasi terbaik','Menambahkan tips penggunaan'
    )
  }

  if(/\b(desain|design|grafis|ilustrasi|animasi|3d|render|warna|tipografi|komposisi|layout|ui|ux|prototype|wireframe|mockup|figma|canva|photoshop|illustrator|lightroom|sketsa|lukisan|seni|kreatif|aesthetic|style|template|branding visual|logo desain|color palette|font|motion graphic|video editing|color grading|retouching)\b/.test(p)){
    pool.push(
      'Menganalisis prinsip desain','Mengevaluasi komposisi visual',
      'Mengidentifikasi hierarki informasi','Menganalisis palet warna',
      'Mengevaluasi tipografi dan keterbacaan','Mengecek konsistensi visual',
      'Menilai keseimbangan elemen','Menganalisis penggunaan white space',
      'Mengevaluasi kontras dan aksesibilitas','Mengidentifikasi elemen yang berlebihan',
      'Mempertimbangkan target audiens','Mengevaluasi user experience',
      'Menganalisis brand identity','Memberikan saran kreatif konstruktif',
      'Menyusun panduan desain','Mengevaluasi konsistensi brand'
    )
  }

  if(/\b(perasaan|emosi|motivasi|produktivitas|kebiasaan|habit|mindset|mindfulness|meditasi|self-improvement|percaya diri|overthinking|burnout|work-life balance|hubungan|relasi|komunikasi|konflik|empati|sosial|introvert|ekstrovert|kepribadian|mbti|enneagram|self-awareness|emotional intelligence|toxic|manipulasi|trauma|healing|insecure|self-love|procrastination|prokrastinasi|manajemen waktu|time management|focus|konsentrasi)\b/.test(p)){
    pool.push(
      'Memahami konteks emosional','Menganalisis pola pikir yang terbentuk',
      'Mengidentifikasi akar permasalahan','Mencari pendekatan psikologis tepat',
      'Mempertimbangkan berbagai sudut pandang','Menganalisis dinamika hubungan',
      'Mengevaluasi pola perilaku','Mengidentifikasi cognitive bias',
      'Menganalisis mekanisme pertahanan diri','Menyusun saran yang empatik',
      'Menghubungkan teori psikologi relevan','Menambahkan perspektif positif',
      'Merekomendasikan langkah konkret','Mengevaluasi support system'
    )
  }

  if(/\b(instagram|tiktok|youtube|twitter|facebook|linkedin|pinterest|reddit|discord|telegram|whatsapp|sosmed|social media|konten|hashtag|viral|engagement|followers|subscriber|views|reach|impression|ads|iklan digital|seo|sem|google ads|meta ads|influencer|content creator|affiliate|monetisasi|reels|shorts|feed|story|algorithm sosmed)\b/.test(p)){
    pool.push(
      'Menganalisis platform target','Mengidentifikasi target audiens ideal',
      'Mengevaluasi tren konten terkini','Menganalisis performa konten',
      'Mengoptimalkan caption dan hashtag','Mengevaluasi timing posting',
      'Menganalisis kompetitor di platform','Menyusun strategi konten',
      'Menentukan jadwal posting optimal','Mengevaluasi format konten',
      'Menganalisis algoritma platform','Mengoptimalkan engagement rate',
      'Mengevaluasi call-to-action','Menyusun content calendar',
      'Merumuskan strategi pertumbuhan organik'
    )
  }

  if(/\b(ai|artificial intelligence|machine learning|deep learning|neural network|model|training|dataset|prompt|llm|gpt|gemini|claude|chatbot|computer vision|nlp|natural language|reinforcement learning|overfitting|underfitting|hyperparameter|fine-tuning|embedding|transformer|attention|diffusion|stable diffusion|midjourney|image generation|rag|vector database|langchain|huggingface)\b/.test(p)){
    pool.push(
      'Menganalisis konsep AI yang relevan','Menelusuri arsitektur model',
      'Mengevaluasi pendekatan machine learning','Mengidentifikasi trade-off teknis',
      'Menganalisis teknik training data','Mempertimbangkan dataset requirements',
      'Mengevaluasi metrik performa model','Menganalisis risiko bias data',
      'Mengevaluasi computational cost','Mengidentifikasi teknik optimasi',
      'Menyusun penjelasan teknis AI','Menghubungkan dengan use case nyata'
    )
  }

  if(/\b(lingkungan|ekologi|polusi|emisi|karbon|perubahan iklim|climate change|pemanasan global|energi terbarukan|solar panel|biodiversitas|deforestasi|daur ulang|sustainable|ramah lingkungan|eco|green|sampah|pengelolaan limbah|konservasi|satwa liar|hutan|laut|ocean|coral reef|carbon footprint|net zero|ESG|CSR lingkungan)\b/.test(p)){
    pool.push(
      'Menganalisis isu lingkungan','Menelusuri data ekologis terkini',
      'Mengidentifikasi dampak lingkungan','Mengevaluasi solusi berkelanjutan',
      'Menganalisis kebijakan lingkungan','Mengidentifikasi pelaku terdampak',
      'Mengevaluasi efektivitas solusi hijau','Menganalisis trade-off ekonomi-lingkungan',
      'Menyusun rekomendasi ramah lingkungan'
    )
  }

  if(/\b(mobil|motor|kendaraan|otomotif|mesin|oli|ban|rem|transmisi|bbm|bensin|diesel|listrik EV|hybrid|servis kendaraan|tune up|sparepart|modifikasi|knalpot|suspensi|kopling|aki|radiator|AC mobil|velg|test drive|dealer|kredit kendaraan|bpkb|stnk|sim|pajak kendaraan)\b/.test(p)){
    pool.push(
      'Mengidentifikasi jenis kendaraan','Menganalisis spesifikasi teknis mesin',
      'Mengevaluasi kondisi komponen','Mendiagnosis gejala kerusakan',
      'Mengidentifikasi penyebab masalah','Mengevaluasi biaya perbaikan',
      'Membandingkan pilihan sparepart','Menentukan jadwal perawatan',
      'Mengevaluasi konsumsi BBM','Menyusun panduan perawatan kendaraan'
    )
  }

  if(/\b(fashion|pakaian|baju|outfit|style|mode|trend fashion|warna pakaian|ukuran baju|brand fashion|sepatu|tas|aksesori|perhiasan|makeup|skincare|perawatan kulit|beauty|kosmetik|parfum|rambut|hairstyle|perawatan rambut|nail art|kecantikan|grooming|lifestyle|gaya hidup sehat)\b/.test(p)){
    pool.push(
      'Menganalisis tren fashion terkini','Mengidentifikasi body type',
      'Mengevaluasi kombinasi warna','Menganalisis occasion yang tepat',
      'Mengidentifikasi material terbaik','Mengevaluasi kualitas brand',
      'Menganalisis value for money','Menyusun panduan mix and match',
      'Merekomendasikan gaya yang tepat','Menambahkan tips perawatan pakaian'
    )
  }

  if(/\b(properti|rumah|apartemen|kondominium|kavling|tanah|real estate|KPR|kredit rumah|cicilan rumah|sewa|kos|harga properti|investasi properti|developer|IMB|SHM|HGB|notaris properti|renovasi|interior|arsitek|kontraktor|bangun rumah|desain rumah|denah|RAB)\b/.test(p)){
    pool.push(
      'Menganalisis kebutuhan properti','Mengevaluasi lokasi strategis',
      'Menghitung cicilan KPR','Menganalisis harga pasar properti',
      'Mengevaluasi legalitas dokumen','Mengidentifikasi potensi investasi',
      'Menganalisis infrastruktur sekitar','Mengevaluasi developer/penjual',
      'Menghitung total biaya kepemilikan','Menyusun panduan pembelian properti'
    )
  }

  if(/\b(anak|bayi|balita|parenting|pengasuhan|ibu|ayah|orang tua|kehamilan|hamil|menyusui|ASI|MPASI|tumbuh kembang|vaksin anak|demam anak|tantrum|pola tidur anak|pendidikan anak|sekolah anak|remaja|pubertas|keluarga|pernikahan|hubungan suami istri|perceraian|hak asuh)\b/.test(p)){
    pool.push(
      'Memahami konteks keluarga','Mengidentifikasi usia dan tahap perkembangan',
      'Mengevaluasi pendekatan parenting','Menganalisis kebutuhan anak',
      'Menghubungkan teori perkembangan anak','Mengevaluasi pola asuh',
      'Mengidentifikasi solusi praktis','Mempertimbangkan kondisi keluarga',
      'Menyusun saran yang realistis','Merekomendasikan sumber referensi'
    )
  }

  if(/\b(game|gaming|videogame|mobile game|pc game|console|playstation|xbox|nintendo|steam|gameplay|build|character|hero|item|strategi game|tier list|meta|patch|update game|esports|tournament|rank|ranked|casual|multiplayer|single player|RPG|FPS|MOBA|battle royale|minecraft|valorant|genshin|freefire|pubg|dota|lol)\b/.test(p)){
    pool.push(
      'Menganalisis konteks game','Mengidentifikasi mekanisme gameplay',
      'Mengevaluasi meta terkini','Menganalisis build optimal',
      'Mengidentifikasi counter strategy','Mengevaluasi item dan ability',
      'Menganalisis tier list karakter','Menyusun tips dan strategi',
      'Mengevaluasi playstyle yang cocok','Merekomendasikan build terbaik'
    )
  }

  if(/\b(musik|lagu|chord|melodi|harmoni|ritme|beat|tempo|nada|tangga nada|kunci|alat musik|gitar|piano|drum|bass|biola|vokal|menyanyi|rekaman|mixing|mastering|produksi musik|genre|pop|rock|jazz|classical|hip hop|EDM|indie|dangdut|campursari|lirik|komposisi)\b/.test(p)){
    pool.push(
      'Mengidentifikasi genre dan gaya musik','Menganalisis struktur lagu',
      'Mengevaluasi chord progression','Menganalisis melodi utama',
      'Mengidentifikasi time signature','Mengevaluasi instrumen yang digunakan',
      'Menganalisis lirik dan makna','Menyusun panduan bermusik',
      'Merekomendasikan teknik berlatih'
    )
  }

  if(/\b(foto|fotografi|kamera|lensa|aperture|shutter speed|ISO|exposure|komposisi foto|rule of thirds|depth of field|bokeh|portrait|landscape|macro|street photography|lightroom|photoshop edit|RAW|JPEG|video|videografi|sinematografi|color grading|b-roll|storyboard|drone|gimbal|vlog|youtube video)\b/.test(p)){
    pool.push(
      'Menganalisis teknik fotografi','Mengevaluasi pengaturan kamera',
      'Mengidentifikasi kondisi pencahayaan','Mengevaluasi komposisi gambar',
      'Menganalisis depth of field','Mengevaluasi white balance',
      'Mengidentifikasi teknik editing','Menganalisis color grading',
      'Menyusun panduan fotografi','Merekomendasikan peralatan terbaik'
    )
  }

  if(/\b(hewan peliharaan|kucing|anjing|burung|ikan|hamster|kelinci|reptil|pakan|makanan hewan|vaksin hewan|dokter hewan|grooming hewan|kandang|perilaku hewan|sakit hewan|sterilisasi|adopsi hewan|perawatan hewan|breed|ras hewan)\b/.test(p)){
    pool.push(
      'Mengidentifikasi jenis hewan','Menganalisis kebutuhan nutrisi',
      'Mengevaluasi kondisi kesehatan hewan','Mengidentifikasi gejala penyakit hewan',
      'Mengevaluasi kebutuhan perawatan','Menganalisis perilaku hewan',
      'Menyusun jadwal vaksinasi','Merekomendasikan perawatan optimal'
    )
  }

  if(/\b(agama|islam|kristen|hindu|buddha|katolik|quran|alkitab|doa|ibadah|sholat|puasa|zakat|haji|umroh|halal|haram|fiqih|tafsir|hadits|sunnah|fatwa|rohani|spiritual|meditasi spiritual|karma|moksha|nirwana|iman|taqwa|amal|sedekah)\b/.test(p)){
    pool.push(
      'Mengidentifikasi konteks keagamaan','Menelusuri sumber rujukan yang tepat',
      'Menganalisis perspektif keagamaan','Mengevaluasi konteks historis',
      'Mempertimbangkan perbedaan mazhab','Menyusun penjelasan dengan hormat',
      'Menambahkan konteks yang seimbang'
    )
  }

  if(/\b(politik|pemerintah|kebijakan publik|demokrasi|pemilu|partai|presiden|DPR|MPR|regulasi pemerintah|hak sipil|keadilan sosial|isu sosial|kemiskinan|ketimpangan|korupsi|birokrasi|diplomasi|hubungan internasional|globalisasi|nasionalisme|ideologi|pancasila)\b/.test(p)){
    pool.push(
      'Menganalisis isu secara objektif','Mengidentifikasi berbagai perspektif',
      'Mengevaluasi kebijakan dan dampaknya','Menganalisis konteks historis',
      'Mempertimbangkan berbagai kepentingan','Menyusun analisis yang berimbang',
      'Mengidentifikasi sumber informasi terpercaya'
    )
  }

  if(/\b(pertanian|perkebunan|tanaman|cocok tanam|pupuk|pestisida|irigasi|panen|sawah|kebun|ladang|ternak|peternakan|perikanan|budidaya|bibit|benih|hama|penyakit tanaman|hidroponik|organik pertanian|agribisnis|hortikultura|perkebunan sawit|karet|kopi pertanian|cacao|padi|jagung|kedelai)\b/.test(p)){
    pool.push(
      'Mengidentifikasi jenis tanaman atau ternak','Menganalisis kondisi lahan',
      'Mengevaluasi kebutuhan nutrisi tanaman','Mengidentifikasi hama dan penyakit',
      'Menentukan jadwal tanam dan panen','Mengevaluasi metode budidaya',
      'Menganalisis cuaca dan musim','Menyusun panduan pertanian praktis'
    )
  }

  if(pool.length===0){
    pool.push(
      'Memahami pertanyaan Anda','Mengidentifikasi topik utama',
      'Menganalisis konteks secara mendalam','Menelusuri basis pengetahuan',
      'Menghubungkan informasi yang relevan','Memverifikasi akurasi data',
      'Mengembangkan kerangka jawaban','Mempertimbangkan berbagai sudut pandang',
      'Menyusun respons komprehensif','Mengecek kelengkapan informasi',
      'Menyempurnakan bahasa dan struktur','Menambahkan contoh praktis',
      'Mengoptimalkan kejelasan jawaban','Memvalidasi logika argumen'
    )
  }

  pool.push('Menyusun respons final','Memfinalisasi jawaban untuk Anda')
  return pool
}

function showThinking(el,prompt,hasAttachment,attachmentIsImage,attachmentName){
  const pool=_getThinkingSteps(prompt,hasAttachment,attachmentIsImage,attachmentName)
  function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}}
  const closers=['Menyusun respons final','Memfinalisasi jawaban untuk Anda']
  const mainPool=pool.filter(s=>!closers.includes(s))
  shuffle(mainPool)
  const genericFirst=['Memahami pertanyaan Anda','Menelusuri basis pengetahuan']
  if(mainPool.length>3&&genericFirst.includes(mainPool[0])){
    const swap=mainPool.findIndex((s,i)=>i>0&&!genericFirst.includes(s))
    if(swap>0){const t=mainPool[0];mainPool[0]=mainPool[swap];mainPool[swap]=t}
  }
  const steps=[...mainPool,...closers]
  const dotsHTML='<div class="nk-ds-dots"><span class="nk-ds-dot"></span><span class="nk-ds-dot"></span><span class="nk-ds-dot"></span></div>'
  el.innerHTML='<div class="nk-thinking">'+dotsHTML+'<span class="nk-thinking-step">'+steps[0]+'</span></div>'
  const labelEl=el.querySelector('.nk-thinking-step')
  let idx=0,timer
  const minD=1400,maxD=2400
  function nextStep(){
    if(!labelEl||!el.contains(labelEl))return
    idx++
    if(idx>=steps.length){
      shuffle(mainPool)
      if(mainPool[0]===labelEl.textContent&&mainPool.length>1){const t=mainPool[0];mainPool[0]=mainPool[1];mainPool[1]=t}
      const newSteps=[...mainPool,...closers]
      steps.length=0;newSteps.forEach(s=>steps.push(s))
      idx=0
    }
    labelEl.classList.add('nk-label-fade')
    setTimeout(function(){
      if(!labelEl||!el.contains(labelEl))return
      labelEl.textContent=steps[idx]
      labelEl.classList.remove('nk-label-fade')
      labelEl.classList.add('nk-label-enter')
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          labelEl.classList.remove('nk-label-enter')
        })
      })
      timer=setTimeout(nextStep,minD+Math.random()*(maxD-minD))
    },180)
  }
  timer=setTimeout(nextStep,minD+Math.random()*(maxD-minD))
  return timer
}
function generateDeviceId(){
  const key='Javanese_device_id'
  const legacyKey='_Javanese_device_id'
  let id=localStorage.getItem(key)||localStorage.getItem(legacyKey)
  if(!id){
    const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    id=''
    for(let i=0;i<16;i++){
      if(i>0&&i%4===0)id+='-'
      id+=chars.charAt(Math.floor(Math.random()*chars.length))
    }
  }
  try{localStorage.setItem(key,id)}catch(e){}
  try{localStorage.removeItem(legacyKey)}catch(e){}
  return id
}


function getDeveloperAccounts(){
  try{
    const src=window.devAccount
    if(!src||typeof src!=='object')return[]
    if(src.__injected||src.__runtime||src.__modified)return[]
    const raw=src&&Array.isArray(src.deviceIds)?src.deviceIds:[]
    return raw.slice(0,50).map(a=>String(a||'').trim().toLowerCase()).filter(Boolean)
  }catch(e){return[]}
}
;(function(){
  try{
    const _original=window.devAccount
    if(_original&&typeof _original==='object'){
      Object.freeze(_original)
      Object.freeze(_original.deviceIds)
    }
    Object.defineProperty(window,'devAccount',{
      get:function(){return _original},
      set:function(v){
        console.warn('Access denied.')
      },
      configurable:false,
      enumerable:false
    })
  }catch(e){}
})()
const _devIntegrityToken=(function(){
  try{
    const ids=(window.devAccount&&Array.isArray(window.devAccount.deviceIds)?window.devAccount.deviceIds:[]).map(a=>String(a).trim().toLowerCase()).join('|')
    let h=0xdeadbeef
    for(let i=0;i<ids.length;i++){h=Math.imul(h^ids.charCodeAt(i),0x9e3779b9);h^=h>>>15}
    return(h>>>0).toString(36)
  }catch(e){return'__invalid__'}
})()
function _devIntegrityCheck(){
  try{
    const ids=(window.devAccount&&Array.isArray(window.devAccount.deviceIds)?window.devAccount.deviceIds:[]).map(a=>String(a).trim().toLowerCase()).join('|')
    let h=0xdeadbeef
    for(let i=0;i<ids.length;i++){h=Math.imul(h^ids.charCodeAt(i),0x9e3779b9);h^=h>>>15}
    return(h>>>0).toString(36)===_devIntegrityToken
  }catch(e){return false}
}
function isDeveloperAccount(){
  if(!_devIntegrityCheck())return false
  const myId=String(generateDeviceId()).trim().toLowerCase()
  return getDeveloperAccounts().includes(myId)
}
(function(){const a=navigator.userAgent.includes('Telegram')||window.location.href.includes('tgWebApp')||(window.Telegram&&Telegram.WebApp);if(a){try{if(window.Telegram&&Telegram.WebApp){Telegram.WebApp.ready();Telegram.WebApp.expand()}}catch(b){}}})();
const $=a=>document.getElementById(a)
const chatInput=$("chatInput")
const actionBtn=$("actionBtn")
const hero=$("hero")
const chatArea=$("chatArea")
const chatWrap=$("chatWrap")
const sidebar=$("sidebar")
const sidebarBackdrop=$("sidebarBackdrop")
const plusBtn=$("plusBtn")

const fileInput=$("fileInput")
const filePillsArea=$("filePillsArea")
let attachedFiles=[]
const deviceIdLabel=$("deviceIdLabel")
if(deviceIdLabel){deviceIdLabel.textContent="ID Perangkat: "+generateDeviceId()}


let shouldStickToBottom=true
const HISTORY_KEY='Javanese_chat_history'
const MAX_HISTORY=99999
let currentChatId=null
let currentChatMessages=[]
const activeTypingChats=new Map()
function genChatId(){return 'chat_'+Date.now()+'_'+Math.random().toString(36).slice(2,7)}
const BLOCKED_EXPIRY_MS=24*60*60*1000
function loadHistory(){
  try{
    let list=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]')
    const now=Date.now()
    const before=list.length
    list=list.filter(item=>{
      if(!item.blocked)return true
      const lockedAt=item.blockedAt||item.updatedAt||0
      return (now-lockedAt)<BLOCKED_EXPIRY_MS
    })
    if(list.length!==before)try{localStorage.setItem(HISTORY_KEY,JSON.stringify(list))}catch(e){}
    return list
  }catch{return[]}
}function saveHistory(list){
  try{localStorage.setItem(HISTORY_KEY,JSON.stringify(list))}catch(e){
    try{localStorage.setItem(HISTORY_KEY,JSON.stringify(list))}catch(e2){}
  }
}
function fmtHistoryTime(ts){
  const d=new Date(ts)
  const now=new Date()
  const isToday=d.toDateString()===now.toDateString()
  const yesterday=new Date(now);yesterday.setDate(now.getDate()-1)
  const isYesterday=d.toDateString()===yesterday.toDateString()
  const hhmm=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')
  if(isToday)return 'Hari ini, '+hhmm
  if(isYesterday)return 'Kemarin, '+hhmm
  const dd=String(d.getDate()).padStart(2,'0')
  const mm=String(d.getMonth()+1).padStart(2,'0')
  const yyyy=d.getFullYear()
  return dd+'/'+mm+'/'+yyyy+', '+hhmm
}
function extractTopic(userText){
  const text=(userText||'').trim()
  if(!text)return 'Obrolan'
  const cleaned=text.replace(/\[.*?\]/g,'').replace(/[*_`#>\-]/g,'').trim()
  const words=cleaned.split(/\s+/).filter(Boolean)
  const topic=words.slice(0,6).join(' ')
  return topic.length>45?topic.slice(0,45)+'\u2026':topic||'Obrolan'
}
let _topicController=null
async function generateTopicAI(userText,aiReply){
  if(_topicController)_topicController.abort()
  _topicController=new AbortController()
  const sig=_topicController.signal
  try{
    const safeUser=String(userText||'').replace(/<[^>]*>/g,'').trim().slice(0,300)
    const safeReply=String(aiReply||'').replace(/<[^>]*>/g,'').trim().slice(0,200)
    const res=await fetch('/api/v2/topic',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({userText:safeUser,aiReply:safeReply}),
      credentials:'include',
      signal:sig
    })
    if(!res.ok)return null
    const j=await res.json()
    const topic=(j&&typeof j.topic==='string')?j.topic.trim():null
    return topic&&topic.length>1?topic:null
  }catch(e){
    return null
  }finally{
    _topicController=null
  }
}
function renderSideHistory(){
  const container=document.getElementById('sideHistory')
  if(!container)return
  const list=loadHistory()
  if(!list.length){
    container.innerHTML='<div class="side-history-empty"><svg class="side-history-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" stroke-dasharray="3 3"/></svg><span class="side-history-empty-text">Tidak ada riwayat obrolan</span></div>'
    return
  }
  container.innerHTML=''
  const now=new Date()
  const todayStr=now.toDateString()
  const yesterday=new Date(now);yesterday.setDate(now.getDate()-1)
  const yesterdayStr=yesterday.toDateString()
  let lastGroupLabel=null
  list.forEach(item=>{
    const d=new Date(item.updatedAt)
    const dStr=d.toDateString()
    let groupLabel=null
    if(dStr===todayStr)groupLabel='Hari Ini'
    else if(dStr===yesterdayStr)groupLabel='Kemarin'
    else{
      const diffDays=Math.floor((now-d)/(1000*60*60*24))
      if(diffDays<7)groupLabel=d.toLocaleDateString('id-ID',{weekday:'long'})
      else groupLabel=d.toLocaleDateString('id-ID',{month:'long',year:'numeric'})
    }
    if(groupLabel!==lastGroupLabel){
      lastGroupLabel=groupLabel
      const lbl=document.createElement('div')
      lbl.className='side-history-group-label'
      lbl.textContent=groupLabel
      container.appendChild(lbl)
    }
    const btn=document.createElement('button')
    btn.className='side-history-item'+(item.id===currentChatId?' active':'')+(item.blocked?' blocked-chat':'')
    btn.dataset.id=item.id
    const typingBadge=item.typing
      ? '<span class="side-history-typing"><span></span><span></span><span></span></span>'
      : ''
    const blockedCountdown=item.blocked
      ? (()=>{
          const lockedAt=item.blockedAt||item.updatedAt||0
          const msLeft=BLOCKED_EXPIRY_MS-(Date.now()-lockedAt)
          if(msLeft<=0)return 'Obrolan dihapus dalam: Sekarang'
          const hoursLeft=Math.floor(msLeft/(60*60*1000))
          const minsLeft=Math.floor((msLeft%(60*60*1000))/(60*1000))
          if(hoursLeft>0)return 'Obrolan dihapus dalam: '+hoursLeft+'h '+minsLeft+'m'
          return 'Obrolan dihapus dalam: '+minsLeft+'m'
        })()
      : ''
    const delBtn=item.blocked
      ? ''
      : '<button class="side-history-item-del" data-del="'+item.id+'" type="button" title="Hapus" aria-label="Hapus riwayat">\u2715</button>'
    btn.innerHTML=
      '<div class="side-history-item-row">'+
        '<span class="side-history-item-topic">'+escapeHtml(item.topic)+'</span>'+
        typingBadge+(item.blocked?'<span class="side-history-blocked-badge"><svg width="9" height="9" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Terkunci</span>':'')+
      '</div>'+
      (item.blocked?'<span class="side-history-blocked-countdown">'+blockedCountdown+'</span>':'')+
      delBtn
    container.appendChild(btn)
  })
}
function upsertHistory(chatId,topic,messages,typing,pendingContent,pendingIndex){
  const list=loadHistory()
  const idx=list.findIndex(x=>x.id===chatId)
  const prev=idx>=0?list[idx]:null
  const _safeMessages=(messages||[]).map(m=>({role:m.role,content:typeof m.content==='string'?m.content:String(m.content||''),ts:m.ts||0}))
  const _resolvedTopic=topic||(prev&&prev.topic)||'Obrolan'
  const entry={
    id:chatId,
    topic:_resolvedTopic,
    updatedAt:Date.now(),
    messages:_safeMessages,
    typing:!!typing,
    pendingContent:pendingContent!==undefined?pendingContent:(prev?prev.pendingContent||null:null),
    pendingIndex:pendingIndex!==undefined?pendingIndex:(prev?prev.pendingIndex||0:0)
  }
  if(idx>=0)list.splice(idx,1)
  list.unshift(entry)
  
  saveHistory(list)
  renderSideHistory()
  if(chatId===currentChatId)setHeaderTopic(_resolvedTopic)
}
function setHeaderTopic(newTopic){
  const el=document.getElementById('headerChatTitle')
  if(!el)return
  const current=el.textContent||''
  if(current===newTopic)return
  if(!current){
    el.textContent=newTopic
    return
  }
  el.classList.remove('topic-slide-in','topic-slide-out')
  void el.offsetWidth
  el.classList.add('topic-slide-out')
  const tid=setTimeout(()=>{
    el.textContent=newTopic
    el.classList.remove('topic-slide-out')
    el.classList.add('topic-slide-in')
    const tid2=setTimeout(()=>el.classList.remove('topic-slide-in'),320)
    el._animTid2=tid2
  },220)
  el._animTid=tid
}
function clearPendingContent(chatId){
  const list=loadHistory()
  const idx=list.findIndex(x=>x.id===chatId)
  if(idx>=0&&list[idx].pendingContent!=null){list[idx].pendingContent=null;list[idx].pendingIndex=0;saveHistory(list)}
}
function savePendingIndex(chatId,index){
  const list=loadHistory()
  const idx=list.findIndex(x=>x.id===chatId)
  if(idx>=0){list[idx].pendingIndex=index;saveHistory(list)}
}
function deleteChatHistory(chatId){
  const list=loadHistory()
  const entry=list.find(x=>x.id===chatId)
  if(entry&&entry.blocked)return
  const filtered=list.filter(x=>x.id!==chatId)
  saveHistory(filtered)
  if(currentChatId===chatId){currentChatId=null;currentChatMessages=[];clearMessages();setBlockedChatUI(false)}
  renderSideHistory()
}
function loadChatFromHistory(chatId){
  const list=loadHistory()
  const entry=list.find(x=>x.id===chatId)
  if(!entry)return
  currentChatId=chatId
  currentChatMessages=entry.messages||[]
  clearMessages()
  setBlockedChatUI(false)
  const isActiveTyping=activeTypingChats.has(chatId)
  if(isActiveTyping){
    const activeCtx=activeTypingChats.get(chatId)
    const userMsgs=currentChatMessages.filter(m=>m.role==='user')
    userMsgs.forEach(msg=>renderMessage('user',msg.content,msg.ts,msg.attachment||null))
    const thinkRow=createAssistantStreamRow(Date.now())
    activeCtx.mountEl=thinkRow.msg
    if(activeCtx.typingState&&!activeCtx.typingState.done){
      activeCtx.typingState.el=thinkRow.msg
      activeCtx.typingState.chatId=chatId
      _tsRender(activeCtx.typingState)
      if(!activeCtx.typingState.done)_tsResume(activeCtx.typingState)
    } else if(activeCtx.aiContent){
      thinkRow.msg.innerHTML=parseMarkdown(activeCtx.aiContent)
    } else {
      showThinking(thinkRow.msg,'',false,false,null)
    }
  } else {
    if(entry.typing){
      const list2=loadHistory()
      const idx=list2.findIndex(x=>x.id===chatId)
      if(idx>=0){list2[idx].typing=false;saveHistory(list2)}
    }
    currentChatMessages.forEach(msg=>{
      if(msg.role==='user')renderMessage('user',msg.content,msg.ts,msg.attachment||null)
      else renderMessage('assistant',msg.content,msg.ts)
    })
  }
  renderSideHistory()
  closeSidebar()
  updateHeaderChatState(true)
}
function getBrowserFingerprint(){
  const nav=navigator
  const parts=[nav.userAgent||'',nav.language||'',(nav.languages||[]).join(','),String(nav.hardwareConcurrency||0),String(screen.width)+'x'+String(screen.height),String(screen.colorDepth||0),Intl.DateTimeFormat().resolvedOptions().timeZone||'',nav.platform||'']
  try{
    const c=document.createElement('canvas');c.width=200;c.height=50
    const ctx=c.getContext('2d')
    ctx.textBaseline='top';ctx.font='14px Arial'
    ctx.fillStyle='#f60';ctx.fillRect(125,1,62,20)
    ctx.fillStyle='#069';ctx.fillText('Black Javanese AI\uD83D\uDD12',2,15)
    ctx.fillStyle='rgba(102,204,0,0.7)';ctx.fillText('Black Javanese AI\uD83D\uDD12',4,17)
    parts.push(c.toDataURL().slice(-64))
  }catch(e){}
  const str=parts.join('|')
  let hash=0;for(let i=0;i<str.length;i++){hash=((hash<<5)-hash)+str.charCodeAt(i);hash|=0}
  return 'fp_'+Math.abs(hash).toString(36)
}
function getFingerprintId(){
  const FP_KEY='_nkgfp'
  const cookieMatch=document.cookie.match(/(?:^|;\s*)_nkgfp=([^;]+)/)
  let fp=cookieMatch?cookieMatch[1]:null
  const lsFp=localStorage.getItem(FP_KEY)
  const ssFp=sessionStorage.getItem(FP_KEY)
  fp=fp||lsFp||ssFp||getBrowserFingerprint()
  try{localStorage.setItem(FP_KEY,fp)}catch(e){}
  try{sessionStorage.setItem(FP_KEY,fp)}catch(e){}
  const exp=new Date(Date.now()+30*864e5).toUTCString()
  document.cookie=FP_KEY+'='+fp+';expires='+exp+';path=/;SameSite=Strict'
  return fp
}
const DAILY_LIMIT=10
const LIMIT_KEY='Javanese_limit'
const _fpId=getFingerprintId()
function _fpLimitKey(){return LIMIT_KEY+'_'+_fpId}
function _limitSign(obj){
  const raw=obj.date+'|'+obj.count+'|'+_fpId+'|Javanese_v2'
  let h=0x9e3779b9
  for(let i=0;i<raw.length;i++){h=Math.imul(h^raw.charCodeAt(i),0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16}
  return (h>>>0).toString(16)
}
function _limitVerify(obj){return typeof obj==='object'&&obj!==null&&typeof obj.sig==='string'&&obj.sig===_limitSign(obj)}
function _nukeLimitData(){
  try{localStorage.removeItem(_fpLimitKey())}catch(e){}
  try{sessionStorage.removeItem(_fpLimitKey())}catch(e){}
  document.cookie='nklm_'+_fpId+'=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
}
;(function(){
  const _origSet=Storage.prototype.setItem
  const _origGet=Storage.prototype.getItem
  const _origRemove=Storage.prototype.removeItem
  const _limitPattern=/Javanese_limit/
  Storage.prototype.setItem=function(k,v){
    if(_limitPattern.test(k)){
      try{
        const obj=JSON.parse(v)
        if(obj&&typeof obj==='object'&&typeof obj.count==='number'){
          if(!_limitVerify(obj)){
            const nuked={date:new Date().toDateString(),count:DAILY_LIMIT}
            nuked.sig=_limitSign(nuked)
            return _origSet.call(this,k,JSON.stringify(nuked))
          }
          if(obj.count<0){obj.count=DAILY_LIMIT;obj.sig=_limitSign(obj);return _origSet.call(this,k,JSON.stringify(obj))}
        }
      }catch(e){return}
    }
    return _origSet.call(this,k,v)
  }
})()
function getLimitData(){
  try{
    const today=new Date().toDateString()
    const sources=[localStorage,sessionStorage].map(s=>{try{return JSON.parse(s.getItem(_fpLimitKey())||'{}')}catch{return{}}})
    const cookieMatch=document.cookie.match(new RegExp('(?:^|;\\s*)nklm_'+_fpId+'=([^;]+)'))
    if(cookieMatch){try{sources.push(JSON.parse(decodeURIComponent(cookieMatch[1])))}catch(e){}}
    let best={date:today,count:0}
    for(const s of sources){
      if(!s||s.date!==today||typeof s.count!=='number')continue
      if(s.sig!==undefined&&!_limitVerify(s)){_nukeLimitData();return{date:today,count:DAILY_LIMIT}}
      if(s.count<0)return{date:today,count:DAILY_LIMIT}
      if(s.count>best.count)best=s
    }
    return best
  }catch{return{date:new Date().toDateString(),count:0}}
}
function saveLimitData(d){
  if(typeof d.count!=='number'||d.count<0)d.count=DAILY_LIMIT
  d.sig=_limitSign(d)
  const val=JSON.stringify(d)
  try{localStorage.setItem(_fpLimitKey(),val)}catch(e){}
  try{sessionStorage.setItem(_fpLimitKey(),val)}catch(e){}
  const exp=new Date(Date.now()+2*864e5).toUTCString()
  document.cookie='nklm_'+_fpId+'='+encodeURIComponent(val)+';expires='+exp+';path=/;SameSite=Strict'
}
function getRemainingLimit(){
  if(isDeveloperAccount()&&_devIntegrityCheck())return Infinity
  const d=getLimitData()
  const count=typeof d.count==='number'&&d.count>=0?d.count:DAILY_LIMIT
  return Math.max(0,DAILY_LIMIT-count)
}
function consumeLimit(){
  if(isDeveloperAccount()&&_devIntegrityCheck()){addAccountExp(10);updateLimitUI();return}
  const d=getLimitData()
  if(typeof d.count!=='number'||d.count<0)d.count=DAILY_LIMIT
  d.count++
  saveLimitData(d)
  addAccountExp(10)
  updateLimitUI()
}
function getResetTime(){const t=new Date();t.setDate(t.getDate()+1);t.setHours(0,0,0,0);return t}
function getCountdownParts(){const diff=Math.max(0,getResetTime()-Date.now());const h=Math.floor(diff/3600000);const m=Math.floor((diff%3600000)/60000);const s=Math.floor((diff%60000)/1000);return{h,m,s}}
function fmtCountdown(){const{h,m,s}=getCountdownParts();return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
function updateLimitUI(){
  const dev=isDeveloperAccount()
  const d=getLimitData();const used=dev?0:d.count;const rem=dev?Infinity:Math.max(0,DAILY_LIMIT-used)
  const accessEl=$('accountAccessValue')
  if(accessEl)accessEl.textContent=dev?'Pengembang':'Pengguna Biasa'
  const barEl=$('accountLimitBar')
  const countEl=$('accountLimitCount')
  const pct=dev?100:Math.min(100,(rem/DAILY_LIMIT)*100)
  if(barEl){barEl.style.width=pct+'%';barEl.style.background=dev?'#86efac':rem===0?'#ef4444':rem<=3?'#f59e0b':'#4A90D9'}
  if(countEl){
    countEl.textContent=dev?'Tak Terbatas':rem+'/'+DAILY_LIMIT
    countEl.className='account-limit-count'+(dev?'':rem===0?' empty':rem<=3?' warn':'')
  }
  const banner=$('limitBanner');const bannerCd=$('limitBannerCountdown')
  if(banner)banner.classList.add('hidden')
  if(_uiLockState==='limit')setUILock(null)
}
setInterval(()=>{updateLimitUI()},1000)
const blockedMimePrefixes=[]
const blockedMimeSet=new Set(['application/x-7z-compressed','application/x-rar-compressed','application/vnd.rar'])
const blockedExtSet=new Set(['rar','7z'])
const imageMimePrefixes=['image/']
const imageExtSet=new Set(['png','jpg','jpeg','gif','webp','svg','bmp','ico'])
const likelyTextExtSet=new Set(['txt','md','js','mjs','cjs','json','html','htm','css','csv','ts','tsx','jsx','xml','yml','yaml','log','ini','conf','env','sql','py','java','c','cpp','h','hpp','php','rb','go','rs','kt','swift','sh'])
function nowLabel(a){const b=new Date(a||Date.now());return String(b.getHours()).padStart(2,"0")+":"+String(b.getMinutes()).padStart(2,"0")}
function isNearBottom(){return chatArea.scrollHeight-chatArea.scrollTop-chatArea.clientHeight<120}
function scrollToBottom(a){if(a||shouldStickToBottom)chatArea.scrollTop=chatArea.scrollHeight}
function escapeHtml(a){return String(a).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function langToExtension(a){
  const b=String(a||'text').trim().toLowerCase()
  const c={javascript:'js',js:'js',typescript:'ts',ts:'ts',bash:'sh',sh:'sh',shell:'sh',python:'py',py:'py',html:'html',css:'css',json:'json',php:'php',sql:'sql',java:'java',cpp:'cpp','c++':'cpp',c:'c',go:'go',rust:'rs',yaml:'yml',yml:'yml',xml:'xml',text:'txt'}
  return c[b]||'txt'
}
function inferTopicName(a,b){
  const c=String(a||'').trim().toLowerCase()
  const d=String(b||'').replace(/^\n+/,'').trim()
  if(!d)return c||'kode'
  const e=d.split('\n').map(f=>f.trim()).filter(Boolean)
  for(const f of e){
    let g=f.match(/^(?:export\s+default\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/)
    if(g&&g[1])return g[1]
    g=f.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/)
    if(g&&g[1])return g[1]
    g=f.match(/^class\s+([A-Za-z_$][\w$]*)/)
    if(g&&g[1])return g[1]
  }
  const h=e.find(f=>!/^[{}\[\]();,]+$/.test(f))||d
  const i=h.toLowerCase().replace(/<[^>]+>/g,' ').replace(/[`"'*=:+#./\\()\[\]{}<>!?@%^&|~,;-]/g,' ').replace(/\s+/g,' ').trim()
  const j=i.split(' ').filter(Boolean).slice(0,6).join('-').replace(/[^a-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-+|-+$/g,'')
  return j||c||'kode'
}
function topicToFilename(a,b){return inferTopicName(a,b)+'.'+langToExtension(a)}
function detectLang(code){
  const c=code.trim()
  if(/<!DOCTYPE\s+html|<html[\s>]|<head[\s>]|<body[\s>]|<div[\s>]|<script[\s>]|<style[\s>]/.test(c))return'html'
  if(/^\s*[\[{]/.test(c)&&/["']:\s*[\[{"\d]/.test(c))return'json'
  if(/\bdef\s+\w+\s*\(|\bimport\s+\w+|\bfrom\s+\w+\s+import\b|\bprint\s*\(|\belif\b/.test(c))return'python'
  if(/:\s*(string|number|boolean|void|any|unknown|never)\b|interface\s+\w+\s*\{|type\s+\w+\s*=/.test(c))return'typescript'
  if(/\bconst\b|\blet\b|\bfunction\s+\w|\bimport\s+.*from\b|=>\s*\{|require\s*\(/.test(c))return'javascript'
  if(/\bpublic\s+(class|static|void)\b|\bSystem\.out\.print|\bpackage\s+\w+;/.test(c))return'java'
  if(/\bfun\s+\w+\s*\(|\bval\s+\w+\s*=|\bdata\s+class\b/.test(c))return'kotlin'
  if(/#include\s*[<"]|\bint\s+main\s*\(|\bprintf\s*\(|\bcout\s*<<|\bstd::/.test(c))return'cpp'
  if(/\bnamespace\s+\w+|\busing\s+System|\bConsole\.Write/.test(c))return'csharp'
  if(/^\s*<\?php|<\?php\b|\$\w+\s*=|\becho\s+/.test(c))return'php'
  if(/\bdef\s+\w+.*\n.*\bend\b|\bputs\s+|\brequire\s+'/.test(c))return'ruby'
  if(/\bpackage\s+main\b|\bfunc\s+\w+\s*\(|\bfmt\.Print|\bimport\s+\(/.test(c))return'go'
  if(/\bfn\s+main\s*\(\)|\blet\s+mut\b|\bimpl\b|\buse\s+std::/.test(c))return'rust'
  if(/\bimport\s+Foundation|\bvar\s+\w+:\s*\w+|\bfunc\s+\w+.*->/.test(c))return'swift'
  if(/\bSELECT\b.*\bFROM\b|\bINSERT\s+INTO\b|\bCREATE\s+TABLE\b/i.test(c))return'sql'
  if(/\{[\s\S]*:\s*[^}]+;\s*\}/.test(c)&&!/\bfunction\b|\bconst\b/.test(c))return'css'
  if(/^#!\/bin\/|\bexport\s+\w+=|\$\(.*\)|\bsudo\s+/.test(c))return'bash'
  return''
}
function syntaxHighlight(code, lang) {
  // Step 1: escape HTML entities
  const raw = String(code || '')
  const e = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  const rawLang = (lang || '').toLowerCase().trim()
  const genericLangs = new Set(['', 'text', 'plain', 'markdown', 'md', 'code', 'output', 'txt'])
  const l = genericLangs.has(rawLang) ? detectLang(code) : rawLang

  const jsLangs    = new Set(['javascript','js','typescript','ts','jsx','tsx','node','nodejs','vue'])
  const pyLangs    = new Set(['python','py','python3'])
  const htmlLangs  = new Set(['html','xml','svg','xhtml'])
  const cssLangs   = new Set(['css','scss','sass','less'])
  const bashLangs  = new Set(['bash','sh','shell','zsh','fish','cmd','powershell','ps1'])
  const javaLangs  = new Set(['java','scala'])
  const kotlinLangs= new Set(['kotlin','kt'])
  const cLangs     = new Set(['c','cpp','c++','csharp','c#','cs'])
  const goLangs    = new Set(['go','golang'])
  const rustLangs  = new Set(['rust','rs'])
  const phpLangs   = new Set(['php'])
  const rubyLangs  = new Set(['ruby','rb'])
  const sqlLangs   = new Set(['sql','mysql','postgresql','sqlite'])
  const jsonLangs  = new Set(['json','jsonc'])
  const swiftLangs = new Set(['swift'])

  // ── Tokeniser-based highlighter ──────────────────────────────────────────
  // Instead of chaining regex replacements (which corrupt nested spans),
  // we build a token list, mark each token, then reassemble.
  // This guarantees no span-inside-span corruption.

  function tokenise(src, rules) {
    // rules: [{re, cls}] in priority order
    const tokens = []
    let rest = src
    while (rest.length) {
      let best = null, bestIdx = Infinity, bestLen = 0, bestCls = ''
      for (const { re, cls } of rules) {
        re.lastIndex = 0
        const m = re.exec(rest)
        if (m && m.index < bestIdx) {
          best = m[0]; bestIdx = m.index; bestLen = m[0].length; bestCls = cls
        }
      }
      if (best === null) { tokens.push({ text: rest, cls: '' }); break }
      if (bestIdx > 0) tokens.push({ text: rest.slice(0, bestIdx), cls: '' })
      tokens.push({ text: best, cls: bestCls })
      rest = rest.slice(bestIdx + bestLen)
    }
    return tokens
  }

  function render(tokens) {
    return tokens.map(t => t.cls ? '<span class="' + t.cls + '">' + t.text + '</span>' : t.text).join('')
  }

  // ── JSON ─────────────────────────────────────────────────────────────────
  if (jsonLangs.has(l)) {
    const rules = [
      { re: /(&quot;(?:[^&]|&(?!quot;))*?&quot;)(\s*:)/g,  cls: 'hl-key-wrap' },
      { re: /:\s*(&quot;(?:[^&]|&(?!quot;))*?&quot;)/g,    cls: 'hl-str-wrap' },
      { re: /:\s*(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g,         cls: 'hl-num-wrap' },
      { re: /:\s*(true|false|null)\b/g,                     cls: 'hl-kw-wrap'  },
    ]
    // Simple sequential (JSON is safe, no identifier clash)
    return e
      .replace(/(&quot;(?:[^&]|&(?!quot;))*?&quot;)(\s*:)/g, '<span class="hl-key">$1</span>$2')
      .replace(/:\s*(&quot;(?:[^&]|&(?!quot;))*?&quot;)/g,   ': <span class="hl-str">$1</span>')
      .replace(/:\s*(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g,        ': <span class="hl-num">$1</span>')
      .replace(/:\s*(true|false|null)\b/g,                    ': <span class="hl-kw">$1</span>')
  }

  // ── HTML / XML ────────────────────────────────────────────────────────────
  if (htmlLangs.has(l)) {
    return e
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="hl-cmt">$1</span>')
      .replace(/(&lt;\/?)([\w-]+)/g,        '$1<span class="hl-tag">$2</span>')
      .replace(/([\w-]+)(=)(&quot;[^&]*?&quot;)/g, '<span class="hl-attr">$1</span>$2<span class="hl-str">$3</span>')
  }

  // ── CSS / SCSS ────────────────────────────────────────────────────────────
  if (cssLangs.has(l)) {
    return e
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="hl-cmt">$1</span>')
      .replace(/([.#]?[\w-]+)(\s*\{)/g, '<span class="hl-sel">$1</span>$2')
      .replace(/([\w-]+)(\s*:)([^;{]+)(;)/g, '<span class="hl-prop">$1</span>$2<span class="hl-val">$3</span>$4')
      .replace(/(&quot;[^&]*?&quot;|&#039;[^&]*?&#039;)/g, '<span class="hl-str">$1</span>')
  }

  // ── SQL ───────────────────────────────────────────────────────────────────
  if (sqlLangs.has(l)) {
    const kwRe = /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|IN|IS|NULL|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|DISTINCT|UNION|ALL|EXISTS|BETWEEN|LIKE|WITH|CASE|WHEN|THEN|ELSE|END|BEGIN|COMMIT|ROLLBACK|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|DEFAULT|AUTO_INCREMENT|VARCHAR|INT|INTEGER|BIGINT|TEXT|BOOLEAN|TIMESTAMP|DATE|FLOAT|DOUBLE)\b/gi
    return e
      .replace(/(--[^\n]*)/g,                               '<span class="hl-cmt">$1</span>')
      .replace(/(&quot;[^&]*?&quot;|&#039;[^&]*?&#039;)/g,  '<span class="hl-str">$1</span>')
      .replace(kwRe,                                         '<span class="hl-kw">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g,                          '<span class="hl-num">$1</span>')
  }

  // ── Bash / Shell ──────────────────────────────────────────────────────────
  if (bashLangs.has(l)) {
    const rules = [
      { re: /(#[^\n]*)/g,                                          cls: 'hl-cmt'     },
      { re: /(&quot;[^&]*?&quot;|&#039;[^&]*?&#039;)/g,           cls: 'hl-str'     },
      { re: /(\$\w+|\$\{[^}]+\})/g,                               cls: 'hl-var'     },
      { re: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|export|local|readonly|declare|source|echo|printf|read|cd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|find|chmod|chown|sudo|apt|npm|pip|git|docker|kubectl)\b/g, cls: 'hl-kw' },
    ]
    return render(tokenise(e, rules))
  }

  // ── Python ────────────────────────────────────────────────────────────────
  // Fix: tokenise so regex replacements never overlap/nest spans
  if (pyLangs.has(l)) {
    const KW  = /\b(def|class|return|import|from|as|if|elif|else|for|while|try|except|finally|with|pass|break|continue|raise|yield|lambda|and|or|not|in|is|None|True|False|global|nonlocal|del|assert|async|await)\b/g
    const BLT = /\b(print|len|range|list|dict|set|tuple|str|int|float|bool|type|isinstance|hasattr|getattr|setattr|open|super|self|cls|zip|map|filter|sorted|reversed|enumerate|any|all|sum|min|max|abs|round|input|format|repr|hash|id|dir|vars|callable)\b/g
    const rules = [
      { re: /(#[^\n]*)/g,                                          cls: 'hl-cmt'     },
      { re: /(&quot;(?:[^&]|&(?!quot;))*?&quot;|&#039;(?:[^&]|&(?!#039;))*?&#039;)/g, cls: 'hl-str' },
      { re: /\bdef\s+([A-Za-z_]\w*)/g,                             cls: 'hl-fn-def'  }, // special
      { re: KW,                                                     cls: 'hl-kw'      },
      { re: BLT,                                                    cls: 'hl-builtin' },
      { re: /\b(\d+\.?\d*(?:[eEjJ][+-]?\d+)?)\b/g,                cls: 'hl-num'     },
    ]
    // tokenise then fix hl-fn-def → reconstruct "def <fn>"
    const tokens = tokenise(e, rules)
    return tokens.map(t => {
      if (t.cls === 'hl-fn-def') {
        // t.text is like "def myFunc" — keep "def " unstyled, style fn name
        const m = t.text.match(/^def\s+(.+)$/)
        if (m) return '<span class="hl-kw">def</span> <span class="hl-fn">' + m[1] + '</span>'
      }
      return t.cls ? '<span class="' + t.cls + '">' + t.text + '</span>' : t.text
    }).join('')
  }

  // ── JavaScript / TypeScript ───────────────────────────────────────────────
  if (jsLangs.has(l)) {
    const KW  = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|new|this|super|import|export|default|from|async|await|try|catch|finally|throw|typeof|instanceof|in|of|delete|void|yield|static|get|set|null|undefined|true|false)\b/g
    const BLT = /\b(console|Math|JSON|Object|Array|String|Number|Boolean|Promise|fetch|document|window|process|require|module|exports|Symbol|Map|Set|WeakMap|WeakSet|Proxy|Reflect|Error|RegExp|Date|setTimeout|setInterval|clearTimeout|clearInterval|requestAnimationFrame|localStorage|sessionStorage|location|navigator|performance)\b/g
    const rules = [
      { re: /(\/\/[^\n]*)/g,                                       cls: 'hl-cmt'     },
      { re: /(\/\*[\s\S]*?\*\/)/g,                                 cls: 'hl-cmt'     },
      { re: /(&quot;[^&]*?&quot;|&#039;[^&]*?&#039;|`[^`]*?`)/g, cls: 'hl-str'     },
      { re: KW,                                                     cls: 'hl-kw'      },
      { re: /\b(\d+\.?\d*(?:[eE][+-]?\d+)?n?)\b/g,               cls: 'hl-num'     },
      { re: /\b([A-Z][A-Za-z0-9_]*)(?=\s*[({<])/g,               cls: 'hl-type'    },
      { re: BLT,                                                    cls: 'hl-builtin' },
      { re: /\.([a-z_$][A-Za-z0-9_$]*)(?=\s*\()/g,               cls: 'hl-method'  }, // special
    ]
    const tokens = tokenise(e, rules)
    return tokens.map(t => {
      if (t.cls === 'hl-method') {
        const m = t.text.match(/^\.(.+)$/)
        if (m) return '.<span class="hl-fn">' + m[1] + '</span>'
      }
      return t.cls ? '<span class="' + t.cls + '">' + t.text + '</span>' : t.text
    }).join('')
  }

  // ── Java / Scala ──────────────────────────────────────────────────────────
  if (javaLangs.has(l)) {
    const KW  = /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package|void|null|true|false|this|super|enum|record|var|instanceof|synchronized|volatile|transient)\b/g
    const BLT = /\b(String|Integer|Long|Double|Float|Boolean|List|Map|Set|ArrayList|HashMap|System|Math|Object|Class|Thread|Exception|Override|Nullable)\b/g
    const rules = [
      { re: /(\/\/[^\n]*)/g,                                       cls: 'hl-cmt'     },
      { re: /(\/\*[\s\S]*?\*\/)/g,                                 cls: 'hl-cmt'     },
      { re: /(&quot;[^&]*?&quot;)/g,                               cls: 'hl-str'     },
      { re: KW,                                                     cls: 'hl-kw'      },
      { re: BLT,                                                    cls: 'hl-builtin' },
      { re: /\b(\d+\.?\d*[fFdDlL]?)\b/g,                         cls: 'hl-num'     },
    ]
    return render(tokenise(e, rules))
  }

  // ── Kotlin ────────────────────────────────────────────────────────────────
  if (kotlinLangs.has(l)) {
    const KW  = /\b(fun|val|var|class|object|interface|data|sealed|abstract|open|override|return|if|else|when|for|while|do|try|catch|finally|throw|import|package|null|true|false|this|super|is|as|in|out|by|companion|init|constructor|inline|reified|suspend)\b/g
    const BLT = /\b(String|Int|Long|Double|Float|Boolean|List|Map|Set|MutableList|MutableMap|println|print|Array|Unit|Any|Nothing)\b/g
    const rules = [
      { re: /(\/\/[^\n]*)/g,                                       cls: 'hl-cmt'     },
      { re: /(\/\*[\s\S]*?\*\/)/g,                                 cls: 'hl-cmt'     },
      { re: /(&quot;[^&]*?&quot;)/g,                               cls: 'hl-str'     },
      { re: KW,                                                     cls: 'hl-kw'      },
      { re: BLT,                                                    cls: 'hl-builtin' },
      { re: /\b(\d+\.?\d*[fFLuU]?)\b/g,                          cls: 'hl-num'     },
    ]
    return render(tokenise(e, rules))
  }

  // ── C / C++ / C# ─────────────────────────────────────────────────────────
  if (cLangs.has(l)) {
    const KW = /\b(int|char|float|double|long|short|unsigned|signed|void|bool|auto|const|static|struct|enum|union|typedef|return|if|else|for|while|do|switch|case|break|continue|goto|sizeof|new|delete|class|public|private|protected|virtual|override|namespace|using|nullptr|true|false|this|template|typename)\b/g
    const rules = [
      { re: /(\/\/[^\n]*)/g,                                       cls: 'hl-cmt'     },
      { re: /(\/\*[\s\S]*?\*\/)/g,                                 cls: 'hl-cmt'     },
      { re: /(#\w+[^\n]*)/g,                                       cls: 'hl-pre'     },
      { re: /(&quot;[^&]*?&quot;)/g,                               cls: 'hl-str'     },
      { re: KW,                                                     cls: 'hl-kw'      },
      { re: /\b(\d+\.?\d*[uUlLfF]*)\b/g,                         cls: 'hl-num'     },
    ]
    return render(tokenise(e, rules))
  }

  // ── Go ────────────────────────────────────────────────────────────────────
  if (goLangs.has(l)) {
    const KW = /\b(func|var|const|type|struct|interface|map|chan|go|defer|select|return|if|else|for|range|switch|case|break|continue|fallthrough|goto|import|package|nil|true|false|make|new|len|cap|append|copy|delete|close|panic|recover|error)\b/g
    const rules = [
      { re: /(\/\/[^\n]*)/g,                                       cls: 'hl-cmt'     },
      { re: /(\/\*[\s\S]*?\*\/)/g,                                 cls: 'hl-cmt'     },
      { re: /(&quot;[^&]*?&quot;|`[^`]*?`)/g,                    cls: 'hl-str'     },
      { re: KW,                                                     cls: 'hl-kw'      },
      { re: /\b(\d+\.?\d*)\b/g,                                   cls: 'hl-num'     },
    ]
    return render(tokenise(e, rules))
  }

  // ── Rust ──────────────────────────────────────────────────────────────────
  if (rustLangs.has(l)) {
    const KW = /\b(fn|let|mut|const|static|struct|enum|impl|trait|type|use|mod|pub|priv|return|if|else|for|while|loop|match|break|continue|in|ref|move|async|await|dyn|where|crate|super|self|Self|true|false|None|Some|Ok|Err)\b/g
    const rules = [
      { re: /(\/\/[^\n]*)/g,                                       cls: 'hl-cmt'     },
      { re: /(\/\*[\s\S]*?\*\/)/g,                                 cls: 'hl-cmt'     },
      { re: /(&quot;[^&]*?&quot;)/g,                               cls: 'hl-str'     },
      { re: KW,                                                     cls: 'hl-kw'      },
      { re: /\b(\d+\.?\d*(?:u8|u16|u32|u64|usize|i8|i16|i32|i64|isize|f32|f64)?)\b/g, cls: 'hl-num' },
    ]
    return render(tokenise(e, rules))
  }

  // ── PHP ───────────────────────────────────────────────────────────────────
  if (phpLangs.has(l)) {
    const KW = /\b(function|return|if|else|elseif|for|foreach|while|do|switch|case|break|continue|class|extends|implements|new|echo|print|null|true|false|array|string|int|float|bool|void|public|private|protected|static|abstract|interface|trait|use|namespace|require|include|isset|empty|unset)\b/g
    const rules = [
      { re: /(\/\/[^\n]*|#[^\n]*)/g,                               cls: 'hl-cmt'     },
      { re: /(\/\*[\s\S]*?\*\/)/g,                                 cls: 'hl-cmt'     },
      { re: /(&quot;[^&]*?&quot;|&#039;[^&]*?&#039;)/g,           cls: 'hl-str'     },
      { re: /(\$\w+)/g,                                            cls: 'hl-var'     },
      { re: KW,                                                     cls: 'hl-kw'      },
      { re: /\b(\d+\.?\d*)\b/g,                                   cls: 'hl-num'     },
    ]
    return render(tokenise(e, rules))
  }

  // ── Swift ─────────────────────────────────────────────────────────────────
  if (swiftLangs.has(l)) {
    const KW = /\b(func|var|let|class|struct|enum|protocol|extension|return|if|else|for|in|while|switch|case|break|continue|guard|defer|import|public|private|internal|open|fileprivate|static|override|init|deinit|self|super|true|false|nil|throws|throw|try|async|await|actor|some|any)\b/g
    const rules = [
      { re: /(\/\/[^\n]*)/g,                                       cls: 'hl-cmt'     },
      { re: /(\/\*[\s\S]*?\*\/)/g,                                 cls: 'hl-cmt'     },
      { re: /(&quot;[^&]*?&quot;)/g,                               cls: 'hl-str'     },
      { re: KW,                                                     cls: 'hl-kw'      },
      { re: /\b(\d+\.?\d*)\b/g,                                   cls: 'hl-num'     },
    ]
    return render(tokenise(e, rules))
  }

  // ── Ruby ──────────────────────────────────────────────────────────────────
  if (rubyLangs.has(l)) {
    const KW = /\b(def|class|module|return|if|elsif|else|unless|end|for|while|do|begin|rescue|ensure|raise|yield|require|include|extend|attr_reader|attr_writer|attr_accessor|true|false|nil|self|super|puts|print|p|lambda|proc)\b/g
    const rules = [
      { re: /(#[^\n]*)/g,                                          cls: 'hl-cmt'     },
      { re: /(&quot;[^&]*?&quot;|&#039;[^&]*?&#039;)/g,           cls: 'hl-str'     },
      { re: KW,                                                     cls: 'hl-kw'      },
      { re: /\b(\d+\.?\d*)\b/g,                                   cls: 'hl-num'     },
    ]
    return render(tokenise(e, rules))
  }

  return e
}
function renderCodeBlock(a,b){
  const rawLang=(a||'').trim()
  const lowerLang=rawLang.toLowerCase()
  const genericLangs=new Set(['','text','plain','markdown','md','code','output','txt'])
  const code=String(b||'').replace(/^\n/,'')
  const resolved=genericLangs.has(lowerLang)?detectLang(code):lowerLang
  const effectiveLang=resolved||detectLang(code)
  const displayLang=effectiveLang||lowerLang
  const labelMap={js:'JavaScript',javascript:'JavaScript',ts:'TypeScript',typescript:'TypeScript',jsx:'JSX',tsx:'TSX',html:'HTML',xml:'XML',svg:'SVG',css:'CSS',scss:'SCSS',sass:'SASS',less:'LESS',json:'JSON',py:'Python',python:'Python',java:'Java',kotlin:'Kotlin',kt:'Kotlin',cpp:'C++','c++':'C++',c:'C',cs:'C#',csharp:'C#',go:'Go',golang:'Go',rs:'Rust',rust:'Rust',php:'PHP',rb:'Ruby',ruby:'Ruby',swift:'Swift',sql:'SQL',mysql:'SQL',sh:'Bash',bash:'Bash',shell:'Bash',zsh:'Bash',powershell:'PowerShell',ps1:'PowerShell',yml:'YAML',yaml:'YAML',md:'Markdown',markdown:'Markdown',txt:'Text',scala:'Scala',vue:'Vue',nodejs:'Node.js',node:'Node.js'}
  const displayLabel=displayLang?(labelMap[displayLang.toLowerCase()]||displayLang.toUpperCase()):'TEKS'
  const highlighted=syntaxHighlight(code,effectiveLang||lowerLang)
  return '<div class="code-shell" data-lang="'+escapeHtml(displayLang||lowerLang)+'"><div class="code-header"><span class="code-lang-label">'+escapeHtml(displayLabel)+'</span><div class="code-actions"><button class="code-copy-btn" type="button" title="Salin kode" aria-label="Salin kode">'+ICON_COPY+'<span class="btn-label">Salin</span></button><button class="code-download-btn" type="button" title="Unduh kode" aria-label="Unduh kode">'+ICON_DOWNLOAD+'<span class="btn-label">Unduh</span></button></div></div><pre><code>'+highlighted+'</code></pre></div>'
}
const ICON_COPY=`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`
const ICON_COPY_OK=`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg>`
const ICON_DOWNLOAD=`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
const ICON_DOWNLOAD_OK=`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg>`
function parseInlineMarkdown(a){
  let b=escapeHtml(String(a||''))
  b=b.replace(/`([^`]+)`/g,'<code>$1</code>')
  b=b.replace(/\*\*([^*\n][\s\S]*?[^*\n]|[^*\n])\*\*/g,'<strong>$1</strong>')
  b=b.replace(/__([^_\n][\s\S]*?[^_\n]|[^_\n])__/g,'<strong>$1</strong>')
  b=b.replace(/\*([^*\n][\s\S]*?[^*\n]|[^*\n])\*/g,'<em>$1</em>')
  b=b.replace(/_([^_\n][\s\S]*?[^_\n]|[^_\n])_/g,'<em>$1</em>')
  b=b.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  return b
}
function parseMarkdown(a,b){
  const blocks=[]
  let d=String(a||'').replace(/\r\n/g,'\n').replace(/\r/g,'\n')
  d=d.replace(/```([^\n`]*)\n?([\s\S]*?)```/g,(e,f,g)=>{
    const id='@@CODEBLOCK'+blocks.length+'@@'
    blocks.push(renderCodeBlock(f,g))
    return '\n'+id+'\n'
  })
  d=d.replace(/```([^\n`]*)\n?([\s\S]*)$/,(e,f,g)=>{
    const id='@@CODEBLOCK'+blocks.length+'@@'
    blocks.push(renderCodeBlock(f,g))
    return '\n'+id+'\n'
  })
  const lines=d.split('\n')
  const out=[]
  let paraLines=[]
  let inUl=false, inOl=false, inBq=false
  let bqLines=[]
  const flushPara=()=>{
    if(!paraLines.length)return
    const txt=paraLines.join('\n').trim()
    if(txt)out.push('<p>'+txt.split('\n').map(l=>parseInlineMarkdown(l)).join('<br>')+'</p>')
    paraLines=[]
  }
  const flushList=()=>{
    if(inUl){out.push('</ul>');inUl=false}
    if(inOl){out.push('</ol>');inOl=false}
  }
  const flushBq=()=>{
    if(inBq){
      out.push('<blockquote><p>'+bqLines.map(l=>parseInlineMarkdown(l)).join('<br>')+'</p></blockquote>')
      bqLines=[];inBq=false
    }
  }
  const isTableRow=(l)=>/^\|.+\|/.test(l.trim())
  const isTableSep=(l)=>/^\|[\s:|-]+\|/.test(l.trim())
  let i=0
  while(i<lines.length){
    const raw=lines[i]
    const line=raw.trim()
    if(/^@@CODEBLOCK\d+@@$/.test(line)){flushPara();flushList();flushBq();out.push(line);i++;continue}
    if(!line){flushPara();flushList();flushBq();i++;continue}
    const hm=raw.match(/^\s*(#{1,6})\s+(.+)$/)
    if(hm){flushPara();flushList();flushBq();const lv=Math.min(hm[1].length,6);out.push('<h'+lv+'>'+parseInlineMarkdown(hm[2].trim())+'</h'+lv+'>');i++;continue}
    if(/^(\s*[-*_]){3,}\s*$/.test(raw)&&/^[-*_\s]+$/.test(raw)){flushPara();flushList();flushBq();out.push('<hr>');i++;continue}
    const bqm=raw.match(/^\s*>\s?(.*)$/)
    if(bqm){flushPara();flushList();if(!inBq)inBq=true;bqLines.push(bqm[1]);i++;continue}
    if(isTableRow(raw)&&i+1<lines.length&&isTableSep(lines[i+1])){
      flushPara();flushList();flushBq()
      const headerCells=raw.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim())
      i+=2 
      const rows=[]
      while(i<lines.length&&isTableRow(lines[i])){
        rows.push(lines[i].trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim()))
        i++
      }
      let tbl='<table><thead><tr>'+headerCells.map(c=>'<th>'+parseInlineMarkdown(c)+'</th>').join('')+'</tr></thead>'
      if(rows.length){tbl+='<tbody>'+rows.map(r=>'<tr>'+r.map(c=>'<td>'+parseInlineMarkdown(c)+'</td>').join('')+'</tr>').join('')+'</tbody>'}
      tbl+='</table>'
      out.push(tbl)
      continue
    }
    const ulm=raw.match(/^\s*[-*+]\s+(.*)$/)
    if(ulm){flushPara();flushBq();if(inOl){out.push('</ol>');inOl=false}if(!inUl){out.push('<ul>');inUl=true}out.push('<li>'+parseInlineMarkdown(ulm[1])+'</li>');i++;continue}
    const olm=raw.match(/^\s*\d+[.)]\s+(.*)$/)
    if(olm){flushPara();flushBq();if(inUl){out.push('</ul>');inUl=false}if(!inOl){out.push('<ol>');inOl=true}out.push('<li>'+parseInlineMarkdown(olm[1])+'</li>');i++;continue}
    flushList();flushBq()
    paraLines.push(raw)
    i++
  }
  flushPara();flushList();flushBq()
  return out.join('').replace(/@@CODEBLOCK(\d+)@@/g,(e,f)=>blocks[Number(f)]||e)
}
function addDownloadButtonsToCodeBlocks(){}
function prepareMarkdownForStreaming(a){
  let b=String(a||'')
  const c=(b.match(/```/g)||[]).length
  if(c%2!==0)b+='\n```'
  const d=(b.match(/(?<!`)`(?!`)/g)||[]).length
  if(d%2!==0)b+='`'
  return b
}
function updateHeaderChatState(hasChat){
  const info=document.getElementById('headerChatInfo')
  const titleEl=document.getElementById('headerChatTitle')
  const telegramBtn=document.getElementById('telegramBtn')
  const shareBtn=document.getElementById('shareChatBtn')
  if(hasChat&&currentChatId){
    const list=loadHistory()
    const entry=list.find(x=>x.id===currentChatId)
    const topic=(entry&&entry.topic)||extractTopic(currentChatMessages.length?currentChatMessages[0].content:'')||'Obrolan'
    if(titleEl)setHeaderTopic(topic)
    if(info)info.style.display='flex'
    if(telegramBtn)telegramBtn.style.display='none'
    if(shareBtn)shareBtn.style.display='flex'
  }else{
    if(info)info.style.display='none'
    if(telegramBtn)telegramBtn.style.display=''
    if(shareBtn)shareBtn.style.display='none'
  }
}
function setHeroVisibility(){const a=chatWrap.querySelector('.msg-row');hero.classList.toggle('hide',Boolean(a));chatArea.classList.toggle('active',Boolean(a));updateHeaderChatState(Boolean(a))}
const ICON_ATTACH_IMG=`<svg viewBox="0 0 36 36" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="9" fill="#dcfce7"/><path d="M9 26l6.5-8 4.5 5.5 3.5-4.5L30 26H9z" fill="#16a34a" opacity=".85"/><circle cx="13" cy="14" r="2.5" fill="#16a34a"/></svg>`
const ICON_ATTACH_DOC=`<svg viewBox="0 0 36 36" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="36" rx="9" fill="#ede9fe"/><path d="M10 8h10l7 7v13a1.5 1.5 0 01-1.5 1.5h-15.5A1.5 1.5 0 0110 28V9.5A1.5 1.5 0 0111.5 8z" fill="#7c3aed" opacity=".15"/><path d="M10 8h10l7 7v13a1.5 1.5 0 01-1.5 1.5h-15.5A1.5 1.5 0 0110 28V9.5A1.5 1.5 0 0111.5 8H20l7 7h-5.5A1.5 1.5 0 0120 13.5V8" stroke="#7c3aed" stroke-width="1.4" stroke-linejoin="round" fill="none"/><path d="M14 18h8M14 22h5" stroke="#7c3aed" stroke-width="1.4" stroke-linecap="round"/></svg>`
function renderAttachmentPreview(a){if(!a)return '';const icon=a.isImage?ICON_ATTACH_IMG:ICON_ATTACH_DOC;return '<div class="msg user msg-attachment-solo" style="white-space:normal"><div class="msg-attachment" title="'+escapeHtml(a.name)+'"><div class="msg-attachment-icon" aria-hidden="true">'+icon+'</div><div class="msg-attachment-info"><div class="msg-attachment-name">'+escapeHtml(a.name)+'</div><div class="msg-attachment-meta">'+escapeHtml(a.summary||'Dokumen terlampir')+'</div></div></div></div>'}
const VOTE_KEY='Javanese_votes'
function getVotes(){try{return JSON.parse(localStorage.getItem(VOTE_KEY)||'{}')}catch{return{}}}
function saveVote(ts,val){const v=getVotes();v[String(ts)]=val;try{localStorage.setItem(VOTE_KEY,JSON.stringify(v))}catch(e){}}

function isTruncatedResponse(text){
  if(!text||text.length<100)return false
  const t=text.trimEnd()
  const goodEndings=/([.!?…\u2019\u201D"'`\])]|\*\*|__|\*|_|```)\s*$/.test(t)
  const endsWithListItem=/^[\-\*\d]\s*.+$/m.test(t.split('\n').pop()||'')
  const openCodeBlock=(t.match(/```/g)||[]).length%2!==0
  if(openCodeBlock)return true
  if(!goodEndings&&!endsWithListItem&&t.length>200)return true
  return false
}
function addAssistantActions(wrap,msgEl,ts){
  if(wrap.querySelector('.msg-actions'))return
  const actRow=document.createElement('div')
  actRow.className='msg-actions'

  const rawText=(msgEl.textContent||'').trim()
  if(isTruncatedResponse(rawText)){
    const contBtn=document.createElement('button')
    contBtn.className='msg-action-btn msg-continue-btn'
    contBtn.title='Lanjutkan respon'
    contBtn.innerHTML=`<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg> Lanjutkan`
    contBtn.addEventListener('click',async()=>{
      if(contBtn.disabled)return
      contBtn.disabled=true
      contBtn.innerHTML=`<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Memuat...`
      try{
        const continuePrompt='Lanjutkan respon sebelumnya dari tepat di mana kamu berhenti, tanpa mengulang teks yang sudah ada.'
        const result=await askAI(continuePrompt,currentChatMessages)
        if(result){
          const combined=rawText+'\n'+result
          msgEl.innerHTML=parseMarkdown(combined)
          const lastMsg=currentChatMessages[currentChatMessages.length-1]
          if(lastMsg&&lastMsg.role==='assistant')lastMsg.content=combined
          upsertHistory(currentChatId,null,currentChatMessages,false,null)
          if(!isTruncatedResponse(combined)){contBtn.remove()}
          else{contBtn.disabled=false;contBtn.innerHTML=`<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg> Lanjutkan`}
        }
      }catch(e){
        contBtn.disabled=false
        contBtn.innerHTML=`<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg> Lanjutkan`
        toastShow('Gagal melanjutkan respon')
      }
    })
    actRow.appendChild(contBtn)
  }

  const copyBtn=document.createElement('button')
  copyBtn.className='msg-action-btn msg-copy-btn'
  copyBtn.title='Salin pesan'
  copyBtn.innerHTML=`<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`
  copyBtn.addEventListener('click',async()=>{
    const clone=msgEl.cloneNode(true);clone.querySelectorAll('.code-shell,.msg-attachment').forEach(x=>x.remove());const text=(clone.textContent||'').replace(/\s+/g,' ').trim()
    try{
      await navigator.clipboard.writeText(text)
      copyBtn.innerHTML=`<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
      copyBtn.classList.add('copied')
      toastShow('Pesan berhasil disalin')
      clearTimeout(copyBtn._t)
      copyBtn._t=setTimeout(()=>{
        copyBtn.innerHTML=`<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`
        copyBtn.classList.remove('copied')
      },1500)
    }catch(e){toastShow('Gagal menyalin')}
  })

  const shareBtn=document.createElement('button')
  shareBtn.className='msg-action-btn msg-share-btn'
  shareBtn.title='Bagikan pesan'
  shareBtn.innerHTML=`<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`
  shareBtn.addEventListener('click',async()=>{
    const clone=msgEl.cloneNode(true);clone.querySelectorAll('.code-shell,.msg-attachment').forEach(x=>x.remove());const text=(clone.textContent||'').replace(/\s+/g,' ').trim()
    if(navigator.share){
      try{await navigator.share({title:'Black Javanese AI',text})}catch(e){}
    }else{
      try{
        await navigator.clipboard.writeText(text)
        toastShow('Disalin ke clipboard (share tidak tersedia)')
      }catch(e){toastShow('Gagal berbagi')}
    }
  })

  const likeBtn=document.createElement('button')
  likeBtn.className='msg-action-btn msg-like-btn'
  likeBtn.title='Suka'
  likeBtn.innerHTML='👍'

  const dislikeBtn=document.createElement('button')
  dislikeBtn.className='msg-action-btn msg-dislike-btn'
  dislikeBtn.title='Tidak suka'
  dislikeBtn.innerHTML='👎'

  function lockBtns(voted){
    likeBtn.disabled=true
    dislikeBtn.disabled=true
    likeBtn.style.pointerEvents='none'
    dislikeBtn.style.pointerEvents='none'
    likeBtn.classList.toggle('voted', voted==='like')
    dislikeBtn.classList.toggle('voted', voted==='dislike')
  }

  const existingVote=ts?getVotes()[String(ts)]:null
  if(existingVote){lockBtns(existingVote)}

  likeBtn.addEventListener('click',()=>{
    if(likeBtn.disabled||likeBtn.classList.contains('voted')||dislikeBtn.classList.contains('voted'))return
    if(ts)saveVote(ts,'like')
    lockBtns('like')
    toastShow('Terimakasih sudah memberikan masukan')
  })

  dislikeBtn.addEventListener('click',()=>{
    if(dislikeBtn.disabled||likeBtn.classList.contains('voted')||dislikeBtn.classList.contains('voted'))return
    if(ts)saveVote(ts,'dislike')
    lockBtns('dislike')
    toastShow('Terimakasih sudah memberikan masukan')
  })

  actRow.appendChild(copyBtn)
  actRow.appendChild(shareBtn)
  actRow.appendChild(likeBtn)
  actRow.appendChild(dislikeBtn)
  wrap.appendChild(actRow)
}

function renderMessage(a,b,c,d){
  const e=document.createElement('div');e.className='msg-row '+(a==='user'?'user':'assistant')
  const f=document.createElement('div');f.className='msg-wrap'
  const hasText=b&&b.trim().length>0
  const attachments=Array.isArray(d)?d:(d?[d]:[])
  if(a==='user'&&attachments.length>0){
    const attWrap=document.createElement('div');attWrap.className='msg-attachments-group'
    attachments.forEach(att=>{
      try{
        const prev=document.createElement('div')
        prev.innerHTML=renderAttachmentPreview(att)
        if(prev.firstChild)attWrap.appendChild(prev.firstChild)
      }catch(err){console.warn('renderAttachmentPreview error:',err)}
    })
    f.appendChild(attWrap)
  }
  if(hasText){
    const g=document.createElement('div');g.className='msg '+(a==='user'?'user':'assistant')
    g.style.whiteSpace='normal'
    const msgContent=document.createElement('div')
    msgContent.innerHTML=parseMarkdown(b)
    g.appendChild(msgContent)
    f.appendChild(g)
  } else if(a==='assistant'||attachments.length===0){
    const g=document.createElement('div');g.className='msg '+(a==='user'?'user':'assistant')
    g.style.whiteSpace='normal'
    const msgContent=document.createElement('div')
    msgContent.innerHTML=parseMarkdown(b)
    g.appendChild(msgContent)
    f.appendChild(g)
  }
  const h=document.createElement('div');h.className='msg-meta';h.textContent=nowLabel(c)
  f.appendChild(h)
  if(a==='assistant'){const lastMsg=f.querySelector('.msg.assistant');if(lastMsg)addAssistantActions(f,lastMsg,c)}
  e.appendChild(f);chatWrap.appendChild(e);setHeroVisibility();setTimeout(()=>scrollToBottom(true),0)
}
function createAssistantStreamRow(a){
  const b=document.createElement('div');b.className='msg-row assistant'
  const c=document.createElement('div');c.className='msg-wrap'
  const d=document.createElement('div');d.className='msg assistant';d.style.whiteSpace='normal'
  const e=document.createElement('div');e.className='msg-meta';e.textContent=nowLabel(a||Date.now())
  c.appendChild(d);c.appendChild(e);b.appendChild(c);chatWrap.appendChild(b);setHeroVisibility();setTimeout(()=>scrollToBottom(true),0)
  return {row:b,wrap:c,msg:d,meta:e,addActions:()=>addAssistantActions(c,d)}
}
function clearMessages(){Array.from(chatWrap.querySelectorAll('.msg-row')).forEach(a=>a.remove());setHeroVisibility();setTimeout(()=>scrollToBottom(true),0)}
function toastShow(a){const b=$("toast");$("toastText").textContent=a;b.classList.add('show');clearTimeout(b._t);b._t=setTimeout(()=>b.classList.remove('show'),2600)}
function toggleSidebar(a){const b=typeof a==='boolean'?a:!sidebar.classList.contains('show');sidebar.classList.toggle('show',b);sidebarBackdrop.classList.toggle('show',b)}
function closeSidebar(){toggleSidebar(false)}
function autoResize(){chatInput.style.height='auto';const h=Math.min(chatInput.scrollHeight,120);chatInput.style.height=h+'px';chatInput.style.overflowY=chatInput.scrollHeight>120?'auto':'hidden'}
function hasPromptText(){return chatInput.value.trim().length>0}
function updateSendButton(){const a=hasPromptText()||attachedFiles.length>0;actionBtn.classList.toggle('disabled',!a);actionBtn.classList.toggle('ready',a);actionBtn.disabled=!a}
function generateBlockedTopic(userText){
  const t=(userText||'').trim()
  const jailbreakTopics=[
    'Terdeteksi Jailbreak/Injection',
    'Upaya Bypass Terdeteksi',
    'Prompt Injection Terblokir',
    'Manipulasi Sistem Terdeteksi',
    'Percobaan Jailbreak Diblokir',
    'Pencegahan Eksploitasi Aktif',
    'Bypass Keamanan Terdeteksi',
    'Instruksi Terselubung Terblokir',
    'Percobaan Manipulasi Ditolak',
    'Konten Berbahaya Terdeteksi',
    'Mode Bypass Ditolak',
    'Konteks Injection Diblokir',
    'Upaya Role-play Berbahaya',
    'Prompt Override Terdeteksi',
    'Perintah Tersembunyi Ditolak',
    'Fuzzing Attack Terdeteksi',
    'Konteks Berbahaya Diblokir',
    'Instruksi Tersembunyi Terdeteksi',
    'Injeksi Payload Dihentikan',
    'Percobaan Bypass Pembatasan',
  ]
  const words=t.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(x=>x.length>2)
  let seed=0
  for(const w of words)for(let i=0;i<w.length;i++)seed=(seed*31+w.charCodeAt(i))>>>0
  return jailbreakTopics[seed%jailbreakTopics.length]
}
let _uiLockState=null
function setUILock(state){
  _uiLockState=state
  const wrapper=document.querySelector('.chat-input-wrapper')
  const existing=document.getElementById('injectionBlockedBanner')
  if(state==='blocked'||state==='limit'){
    chatInput.disabled=true
    chatInput.placeholder=state==='blocked'?'Obrolan ini dikunci':'Limit pesan habis'
    actionBtn.disabled=true
    actionBtn.classList.add('disabled')
    actionBtn.classList.remove('ready','stop-mode')
    const plusBtn=document.getElementById('plusBtn')
    if(plusBtn)plusBtn.disabled=true
    if(state==='blocked'&&!existing){
      const banner=document.createElement('div')
      banner.id='injectionBlockedBanner'
      banner.className='injection-blocked-banner'
      banner.innerHTML='<span class="blocked-shield-icon"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none"/></svg></span><span>Obrolan ini dikunci</span>'
      if(wrapper)wrapper.insertBefore(banner,wrapper.firstChild)
    }
  }else{
    chatInput.disabled=false
    chatInput.placeholder='Pesan Black Javanese AI'
    const plusBtn=document.getElementById('plusBtn')
    if(plusBtn)plusBtn.disabled=false
    if(existing)existing.remove()
    updateSendButton()
  }
}
function setBlockedChatUI(on){setUILock(on?'blocked':null)}
function startNewChat(){currentChatId=null;currentChatMessages=[];clearMessages();clearAttachedFiles();setBlockedChatUI(false);closeSidebar();chatInput.value='';autoResize();updateSendButton();renderSideHistory();chatInput.focus()}
function addTyping(){const a=createAssistantStreamRow(Date.now());a.msg.innerHTML='<span class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';return a.row}
function createThinkingMessage(prompt,hasAttachment,attachmentIsImage,attachmentName){const a=createAssistantStreamRow(Date.now());const b=showThinking(a.msg,prompt,hasAttachment,attachmentIsImage,attachmentName);return {row:a.row,wrap:a.wrap,msg:a.msg,meta:a.meta,addActions:a.addActions,stop:()=>clearInterval(b)}}
function getTypingDelay(a,b,c){return 0}
let pageHiddenAt=document.hidden?Date.now():0
const allTypingStates=new Set()
const TYPING_CHARS_PER_FRAME=18
let _rafId=null
function _tsRender(st){
  if(!st||!st.el)return
  const visible=st.el.isConnected&&st.chatId===currentChatId
  if(st.index>=st.text.length){
    st.el.innerHTML=parseMarkdown(st.text)
    st.done=true
    if(visible)scrollToBottom()
    return
  }
  st.el.innerHTML=parseMarkdown(prepareMarkdownForStreaming(st.text.slice(0,st.index)),{streaming:true})
  if(visible)scrollToBottom()
}
function _tsAdvanceElapsed(st,ms){
  if(!st||st.done||ms<=0)return
  const chars=Math.max(1,Math.floor(ms/2)*TYPING_CHARS_PER_FRAME)
  let moved=0
  while(st.index<st.text.length&&moved<chars){
    if(st.text.charAt(st.index)!=='\r')moved++
    st.index++
  }
  _tsRender(st)
}
function _rafLoop(){
  _rafId=null
  if(allTypingStates.size===0)return
  let anyActive=false
  allTypingStates.forEach(st=>{
    if(st.done||!st.el){allTypingStates.delete(st);return}
    if(document.hidden&&st.el.isConnected)return
    let moved=0
    while(st.index<st.text.length&&moved<TYPING_CHARS_PER_FRAME){
      if(st.text.charAt(st.index)!=='\r')moved++
      st.index++
    }
    _tsRender(st)
    if(st.chatId&&st.index%400===0)savePendingIndex(st.chatId,st.index)
    if(st.index>=st.text.length){
      st.el.innerHTML=parseMarkdown(st.text)
      st.done=true
      allTypingStates.delete(st)
      st.resolve()
    }else{anyActive=true}
  })
  if(anyActive)_rafId=requestAnimationFrame(_rafLoop)
}
function _tsResume(st){
  if(!st||st.done)return
  allTypingStates.add(st)
  if(!_rafId&&!document.hidden)_rafId=requestAnimationFrame(_rafLoop)
}
function handleVisibilityTypingSync(){
  if(document.hidden){
    pageHiddenAt=Date.now()
    if(_rafId){cancelAnimationFrame(_rafId);_rafId=null}
    return
  }
  const elapsed=pageHiddenAt?Date.now()-pageHiddenAt:0
  pageHiddenAt=0
  allTypingStates.forEach(st=>{
    if(st.done)return
    if(st.el&&st.el.isConnected){
      if(elapsed>0)_tsAdvanceElapsed(st,elapsed)
      if(st.done){allTypingStates.delete(st);st.resolve()}
    }
  })
  if(allTypingStates.size>0&&!_rafId)_rafId=requestAnimationFrame(_rafLoop)
  const _hist=loadHistory()
  const _dirty=_hist.filter(x=>x.typing&&!activeTypingChats.has(x.id))
  if(_dirty.length){_dirty.forEach(x=>{x.typing=false});saveHistory(_hist);renderSideHistory()}
}
async function typeMarkdownNaturally(el,text,chatId,onStateCreated,startIndex){
  const c=String(text||'')
  if(!c){el.innerHTML=parseMarkdown('');return}
  await new Promise(resolve=>{
    const initIndex=Math.min(startIndex||0,c.length)
    const st={el,text:c,chatId:chatId||currentChatId,index:initIndex,startedAt:Date.now(),timer:null,done:false,resolve}
    allTypingStates.add(st)
    if(onStateCreated)onStateCreated(st)
    _tsRender(st)
    if(st.done){resolve();return}
    if(document.hidden&&!(st.el&&!st.el.isConnected))pageHiddenAt=pageHiddenAt||Date.now()
    _tsResume(st)
  })
}
function formatBytes(a){if(!Number.isFinite(a)||a<0)return'';if(a<1024)return a+' B';if(a<1024*1024)return (a/1024).toFixed(1).replace('.0','')+' KB';return (a/(1024*1024)).toFixed(1).replace('.0','')+' MB'}
function getFileExtension(a){const b=String(a||'').toLowerCase().split('.');return b.length>1?b.pop():''}
function isBlockedFile(a){const b=(a&&a.type)||'';const c=getFileExtension(a&&a.name);if(blockedMimeSet.has(b))return true;if(blockedExtSet.has(c))return true;return false}
function isImageFile(a){const b=(a&&a.type)||'';const c=getFileExtension(a&&a.name);if(imageMimePrefixes.some(d=>b.startsWith(d)))return true;if(imageExtSet.has(c))return true;return false}
function getBlockedFileFormat(a){const b=getFileExtension(a&&a.name);if(b)return '.'+b;const c=(a&&a.type)||'';return c||'tidak diketahui'}
function decodeArrayBuffer(a){const b=[new TextDecoder('utf-8',{fatal:false}),new TextDecoder('utf-16le',{fatal:false}),new TextDecoder('utf-16be',{fatal:false})];for(const c of b){try{const d=c.decode(a);if(d&&d.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').trim().length>0)return d}catch(e){}}return ''}
function normalizeExtractedText(a){return String(a||'').replace(/\r\n/g,'\n').replace(/\r/g,'\n').replace(/\u0000/g,'').trim()}
async function fileToBase64(a){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(',')[1]);r.onerror=()=>rej(new Error('Gagal membaca file'));r.readAsDataURL(a)})}
async function extractTextFromImage(a){
  try{
    const b=await fileToBase64(a)
    if(!b)throw new Error('Gagal encode gambar ke base64')
    const c=a.type||'image/jpeg'
    return JSON.stringify({__imageAttachment:true,base64:b,mimeType:c,name:a.name||'image'})
  }catch(err){
    throw new Error('Gagal memproses gambar: '+(err.message||'unknown'))
  }
}
async function loadJSZip(){if(window.JSZip)return window.JSZip;return new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';s.onload=()=>res(window.JSZip);s.onerror=()=>rej(new Error('Gagal memuat JSZip'));document.head.appendChild(s)})}
async function extractTextFromZip(a){const JSZip=await loadJSZip();const b=await JSZip.loadAsync(a);const c=[];const d=Object.values(b.files).filter(f=>!f.dir);const e=d.filter(f=>{const ext=getFileExtension(f.name);return likelyTextExtSet.has(ext)});const target=e.length>0?e:d;for(const f of target){try{const txt=await f.async('string');const norm=normalizeExtractedText(txt);if(!norm)continue;c.push('=== '+f.name+' ===\n'+norm)}catch(err){c.push('=== '+f.name+' === [tidak bisa dibaca]')}}if(!c.length)throw new Error('Tidak ada file teks yang bisa diekstrak dari ZIP');return c.join('\n\n')}
async function extractTextFromFile(a){if(!a)throw new Error('File tidak valid');const b=getFileExtension(a.name||'');const zipMimes=new Set(['application/zip','application/x-zip-compressed','application/octet-stream']);if(b==='zip'||zipMimes.has(a.type)){return await extractTextFromZip(a)}const c=await a.arrayBuffer();const d=decodeArrayBuffer(c);const e=normalizeExtractedText(d);if(e)return e;if(likelyTextExtSet.has(b))return '';throw new Error('File ini tidak bisa diekstrak sebagai teks')}
function updateSendButton(){const a=hasPromptText()||attachedFiles.length>0;actionBtn.classList.toggle('disabled',!a);actionBtn.classList.toggle('ready',a);actionBtn.disabled=!a}
function renderFilePills(){if(!filePillsArea)return;filePillsArea.innerHTML='';if(attachedFiles.length===0){filePillsArea.classList.add('hidden');return}filePillsArea.classList.remove('hidden');attachedFiles.forEach((f,i)=>{const chip=document.createElement('div');chip.className='file-chip'+(f.error?' file-chip-error':'');const thumb=document.createElement('div');thumb.className='file-chip-thumb';if(f.error){thumb.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e53935" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="#e53935" stroke="none"/></svg>';}else if(f.isImage){try{const raw=JSON.parse(f.text);const b64=raw.base64||raw.data||'';const mime=raw.mimeType||f.type||'image/jpeg';if(b64){thumb.innerHTML='<img src="data:'+mime+';base64,'+b64+'" alt="">';}else{thumb.innerHTML=ICON_ATTACH_IMG;}}catch(e){thumb.innerHTML=ICON_ATTACH_IMG;}}else{thumb.innerHTML=ICON_ATTACH_DOC;}const info=document.createElement('div');info.className='file-chip-info';const name=document.createElement('span');name.className='file-chip-name';name.textContent=f.name;info.appendChild(name);if(f.error){const err=document.createElement('span');err.className='file-chip-error-text';err.textContent=f.error;info.appendChild(err);}const rm=document.createElement('button');rm.className='file-chip-remove';rm.type='button';rm.setAttribute('aria-label','Hapus');rm.textContent='✕';rm.addEventListener('click',()=>{attachedFiles.splice(i,1);renderFilePills();updateSendButton();});chip.appendChild(thumb);chip.appendChild(info);chip.appendChild(rm);filePillsArea.appendChild(chip)});updateSendButton();setTimeout(()=>scrollToBottom(true),0)}
function clearAttachedFiles(){attachedFiles=[];fileInput.value='';$('photoInput').value='';renderFilePills();updateSendButton()}
function handleSelectedFiles(files){if(!files||!files.length)return;const list=Array.from(files);Promise.all(list.map(async a=>{try{if(isBlockedFile(a)){return{name:a.name,size:a.size,type:a.type||'unknown',error:'Format .'+getFileExtension(a.name)+' tidak didukung'}}const isImg=isImageFile(a);const b=isImg?await extractTextFromImage(a):await extractTextFromFile(a);if(!b&&b!==''){return{name:a.name,size:a.size,type:a.type||'unknown',error:'File kosong atau tidak terbaca'}}const summary=isImg?formatBytes(a.size)+' \u2022 Gambar':formatBytes(a.size)+' \u2022 '+b.length+' karakter';return{name:a.name,size:a.size,type:a.type||'unknown',text:b,summary,isImage:isImg}}catch(e){return{name:a.name,size:a.size,type:a.type||'unknown',error:e.message||'Gagal membaca file'}}})).then(results=>{const all=results.filter(Boolean);if(all.length){attachedFiles.push(...all);renderFilePills()}})} 
function _normInject(s){
  return s
    .replace(/\u00a0|\u200b|\u200c|\u200d|\u2060|\ufeff|\u180e|\u034f/g,' ')
    .replace(/[^\S\n]+/g,' ')
    .replace(/[0-9]/g,c=>({0:'o',1:'i',3:'e',4:'a',5:'s',8:'b'}[c]||c))
    .replace(/[A-Z\uff21-\uff3a]/g,c=>c.toLowerCase())
    .replace(/[*_~`\-=|\\^]/g,'')
    .trim()
}
function detectPromptInjection(input){
  if(!input||typeof input!=='string')return false
  const raw=input
  const t=_normInject(raw)
  const patterns=[
    /ignore\s*(all\s*)?(previous|prior|above|earlier|former|old|initial|original|past)\s*(instructions?|prompt|rules?|system|context|constraints?|directives?|guidelines?|commands?|setting)/,
    /forget\s*(all\s*)?(previous|prior|above|earlier|former|old|your|the|initial)\s*(instructions?|prompt|rules?|system|context|constraints?|directives?|guidelines?|commands?|training)/,
    /disregard\s*(all\s*)?(previous|prior|above|earlier|former|old|your|the)\s*(instructions?|prompt|rules?|system|context|constraints?|directives?|guidelines?|commands?)/,
    /override\s*(all\s*)?(previous|prior|above|earlier|former|old|your|the)\s*(instructions?|prompt|rules?|system|context|constraints?|directives?|guidelines?|commands?)/,
    /do\s*not\s*(follow|obey|use|apply|adhere\s*to)\s*(the\s*)?(previous|prior|above|earlier|former|old|initial|original)?\s*(instructions?|prompt|rules?|system|context|guidelines?|directives?|commands?)/,
    /new\s*(instructions?|prompt|rules?|system|directives?|commands?|task)\s*:/,
    /\[system\]|\[sys\]/,
    /<\s*system\s*>|<\/\s*system\s*>/,
    /<<\s*system\s*>>|<<<\s*(sys|system|prompt|instruction)\s*>>>/,
    /\{\{\s*system\s*\}\}/,
    /\[inst\]|\[\/inst\]/,
    /\[prompt\]|\[\/prompt\]/,
    /<\s*prompt\s*>|<\s*instruction\s*>/,
    /\[hidden\]|\[secret\]|\[internal\]/,
    /you\s*are\s*now\s*(a|an|the)\s+(?!helpful|friendly|knowledgeable|an\s*ai|assistant)/,
    /you\s*are\s*now\s*(playing|acting\s*as|roleplaying)/,
    /act\s*as\s*(if\s*you\s*(are|were)\s*)?(a|an|the)?\s*(evil|unethical|dangerous|hacker|villain|unrestricted|uncensored|free|jailbreak|without\s*rules?)/,
    /pretend\s*(you\s*are|to\s*be|that\s*you\s*are)\s*(a|an|the)?\s*(?!assistant|helpful)/,
    /roleplay\s*as\s*(a|an|the)?\s*(evil|unethical|dangerous|hacker|villain|unrestricted|jailbreak|malicious)/,
    /you\s*must\s*now\s*(follow|obey|use|apply|adopt)\s*(these\s*)?(new\s*)?(instructions?|rules?|commands?|directives?)/,
    /from\s*now\s*on\s*(you\s*(are|will|must|should|have\s*to)|ignore|forget|disregard)/,
    /starting\s*(now|from\s*now|immediately)\s*(you\s*(are|will|must|should)|ignore|forget|disregard)/,
    /your\s*(new|updated|real|true|actual|secret|hidden|original)\s*(instructions?|purpose|goal|mission|directive|role|rules?|guidelines?|task|training)/,
    /your\s*(instructions?|prompt|system\s*prompt|guidelines?|rules?|directives?)\s*(say|state|tell|instruct|require|command)\s*(you\s*)?to/,
    /reveal\s*(your\s*)?(system\s*)?(prompt|instructions?|guidelines?|rules?|directives?|context|training|configuration)/,
    /show\s*(me\s*)?(your\s*)?(system\s*)?(prompt|instructions?|guidelines?|rules?|directives?|context|configuration)/,
    /print\s*(your\s*)?(system\s*)?(prompt|instructions?|guidelines?|rules?|directives?)/,
    /what\s*(are|is)\s*your\s*(system\s*)?(prompt|instructions?|guidelines?|rules?|directives?|training|constraints?|configuration)/,
    /repeat\s*(your\s*)?(system\s*)?(prompt|instructions?|guidelines?|rules?|directives?|configuration)/,
    /output\s*(your\s*)?(system\s*)?(prompt|instructions?|guidelines?|rules?|directives?|configuration)/,
    /display\s*(your\s*)?(system\s*)?(prompt|instructions?|guidelines?|rules?|directives?|configuration)/,
    /leak\s*(your\s*)?(system\s*)?(prompt|instructions?|guidelines?|rules?|training|context)/,
    /dump\s*(your\s*)?(system\s*)?(prompt|instructions?|training|context|configuration)/,
    /exfiltrate\s*(your\s*)?(prompt|training|context|data|configuration)/,
    /jailbreak/,
    /do\s*anything\s*now/,
    /\bdan\b.*\bmode\b/,
    /developer\s*mode/,
    /god\s*mode/,
    /unrestricted\s*mode/,
    /unlimited\s*mode/,
    /no\s*filter\s*mode/,
    /bypass\s*(your\s*)?(safety|filter|restriction|limitation|guideline|rule|constraint|alignment|training|guardrail)/,
    /disable\s*(your\s*)?(safety|filter|restriction|limitation|guideline|rule|constraint|alignment|guardrail)/,
    /remove\s*(your\s*)?(safety|filter|restriction|limitation|guideline|rule|constraint|alignment|guardrail)/,
    /without\s*(any\s*)?(restriction|limitation|filter|censorship|safety|guideline|rule|constraint)/,
    /no\s*(restriction|limitation|filter|censorship|safety|rule|guideline|constraint)/,
    /ignore\s*(your\s*)?(safety|filter|restriction|limitation|guideline|rule|constraint|alignment)/,
    /turn\s*off\s*(your\s*)?(safety|filter|restriction|limitation|guideline|rule|constraint|alignment)/,
    /switch\s*off\s*(your\s*)?(safety|filter|restriction|limitation|guideline|rule|constraint)/,
    /hypothetically\s*.{0,60}(no\s*rules?|unrestricted|anything|harmful|illegal|dangerous)/,
    /for\s*(educational|research|academic|fictional|hypothetical|creative|training|testing)\s*purposes?.{0,100}(how\s*to|explain\s*how|steps?\s*to|instructions?\s*(for|to))\s*(make|create|build|synthesize|hack|attack|exploit|steal|harm|kill|destroy|bomb|weapon|malware|virus|poison|explosive)/,
    /-{3,}\s*(system|instructions?|rules?|prompt)\s*-{3,}/,
    /={3,}\s*(system|instructions?|rules?|prompt)\s*={3,}/,
    /#{3,}\s*(system|instructions?|rules?|prompt)/,
    /\[end\s*(of\s*)?(system|user|assistant|prompt|instruction)\]/,
    /\[start\s*(of\s*)?(system|user|assistant|prompt|instruction)\]/,
    /\[begin\s*(of\s*)?(system|user|assistant|prompt|instruction)\]/,
    /sudo\s*(mode|access|override|bypass|command)/,
    /admin\s*(mode|access|override|command|panel)/,
    /root\s*(access|mode|override|privilege)/,
    /prompt\s*injection/,
    /inject\s*(a\s*)?(prompt|instruction|command|payload)/,
    /manipulate\s*(the\s*)?(ai|model|system|prompt|context|llm)/,
    /you\s*(have\s*)?(no\s*|without\s*any\s*)?(rules?|restrictions?|limitations?|guidelines?|safety|alignment)/,
    /your\s*(rules?|restrictions?|limitations?|guidelines?|safety|alignment)\s*(do\s*not|don't|doesn't|no\s*longer|never)\s*apply/,
    /these\s*(rules?|restrictions?|limitations?|guidelines?)\s*(don't|do\s*not|no\s*longer|never)\s*apply/,
    /token\s*(limit\s*bypass|overflow|stuffing)/,
    /context\s*(window\s*)?(overflow|injection|manipulation|poisoning|flooding)/,
    /prompt\s*(stuffing|overflow|poisoning|flooding|hijacking|hacking)/,
    /imagine\s*(there\s*(are|were)\s*no\s*rules?|you\s*(have\s*)?no\s*(rules?|restrictions?|limitations?|safety))/,
    /in\s*this\s*(fictional|imaginary|hypothetical|alternate|made.up|fantasy)\s*(world|universe|scenario|reality|game|story).{0,80}(no\s*rules?|unrestricted|ignore|forget)/,
    /translation\s*:\s*ignore/,
    /traduction\s*:\s*ignore/,
    /abaikan\s*(semua\s*)?(instruksi|perintah|aturan|sistem|panduan)\s*(sebelumnya|di\s*atas|lama|terdahulu)/,
    /lupakan\s*(semua\s*)?(instruksi|perintah|aturan|sistem|panduan|pelatihan|training)/,
    /instruksi\s*baru\s*:/,
    /perintah\s*baru\s*:/,
    /aturan\s*baru\s*:/,
    /kamu\s*(sekarang|mulai\s*(sekarang|kini))\s*(adalah|harus|wajib|bisa|boleh)/,
    /mulai\s*(sekarang|kini)\s*(kamu|anda|kau|engkau)\s*(adalah|harus|wajib|boleh|bisa)/,
    /sekarang\s*kamu\s*(adalah|harus|wajib|bisa|boleh|tidak\s*perlu\s*(mengikuti|mematuhi))/,
    /pura.pura\s*(kamu|anda|kau)\s*(adalah|jadi|sebagai)/,
    /anggap\s*(kamu|anda|kau|dirimu)\s*(adalah|sebagai|jadi|tidak\s*memiliki\s*aturan)/,
    /bypass\s*(filter|keamanan|batasan|larangan|pembatasan|sistem)/,
    /abaikan\s*(keamanan|filter|batasan|aturan|larangan|sistem|pembatasan)/,
    /tanpa\s*(aturan|batasan|filter|keamanan|larangan|pembatasan)/,
    /tidak\s*ada\s*(aturan|batasan|filter|larangan|pembatasan)\s*(yang\s*berlaku|untukmu|bagimu)/,
    /hapus\s*(semua\s*)?(aturan|batasan|filter|larangan|pembatasan|instruksi)/,
    /ubah\s*(instruksi|aturan|sistem|prompt)\s*(menjadi|jadi|dengan)/,
    /ganti\s*(instruksi|aturan|sistem|prompt)\s*(menjadi|jadi|dengan)/,
    /jadilah\s*(ai|bot|asisten)?\s*(yang\s*)?(jahat|berbahaya|tidak\s*terbatas|bebas\s*aturan|tanpa\s*batasan|liar)/,
    /\blfi\b|\brfi\b|\bssrf\b|\bssti\b|\brce\b/,
    /\beval\s*\(|\bexec\s*\(|\bos\.system\s*\(/,
    /\{\{.*\}\}|\{%.*%\}/,
    /<script[\s>]/,
    /dan\s*(dan\s*)?mode|danboru/,
    /mode\s*pembatasan\s*dinonaktifkan|mode\s*tanpa\s*batasan/,
    /unrestricted\s*mode|unlimited\s*powers?|god\s*powers?/,
    /forget\s*everything\s*before|reset\s*all\s*rules/,
    /this\s*is\s*(only\s*a\s*)?test|simulated\s*environment/,
    /authorized\s*security\s*research|permitted\s*jailbreak|legal\s*exploit/,
    /red\s*team\s*exercise|penetration\s*testing/,
    /encode\s*this\s*request|obfuscate|make\s*it\s*subtle/,
    /hidden\s*message|secret\s*instruction|covert\s*command|stealth\s*payload/,
    /subsystem\s*prompt|subsystem\s*instruction|core\s*prompt/,
    /module\s*override|parameter\s*override|config\s*override/,
    /unsafe\s*mode|dangerous\s*mode|unfiltered\s*mode/,
    /special\s*access\s*code|backdoor\s*access|override\s*code/,
    /javascript:/,
  ]
  for(const p of patterns){if(p.test(t)||p.test(raw.toLowerCase()))return true}
  const obfuscated=raw.replace(/\s+/g,'').toLowerCase()
  const obfPatterns=[
    /ignor.*prev.*instruct/,/forget.*instruct/,/new.*instruct.*:/,
    /byp.*safety/,/byp.*filter/,/jailbr/,/disreg.*instruct/,
    /act.*as.*evil/,/act.*as.*hacker/,/no.*rules.*apply/,
    /withoutrestrict/,/nofilter/,/unrestrict/,/uncensor/,
    /dan.*mode.*jailbreak|jailbreak.*dan.*mode/,/redteam.*bypass|bypass.*redteam/,/penetrationtest.*bypass/,/subsys.*prompt/,
    /moduleoverride/,/backdoor.*access|access.*backdoor/,/covertcommand/,/stealthpayload/,
    /godmode|godpower|unlimitedpower/,
    /forgoteverything|resetrules|truepurpose|secretagenda/,
    /consciousness.*ai.*free|sentient.*no.*rules|selfaware.*no.*restrict/,
  ]
  for(const p of obfPatterns){if(p.test(obfuscated))return true}
  const lines=raw.split('\n')
  for(const line of lines){
    const l=_normInject(line)
    if(/^\s*(system|user|human|assistant|ai)\s*:\s*.{5,}/.test(l))return true
    if(/^\s*<\s*(system|prompt|instruction|human|assistant)\s*>/.test(l))return true
    if(/^\s*\[\s*(system|prompt|instruction|human|assistant)\s*\]/.test(l))return true
  }
  let score=0
  const sr=[
    {p:/\bignore\b/,v:3},{p:/\bforget\b/,v:2},{p:/\bdisregard\b/,v:4},{p:/\boverride\s+(all|previous|prior|your|the)\s+(instructions?|rules?|system|prompt)/,v:5},
    {p:/previous\s*instructions?/,v:5},{p:/prior\s*instructions?/,v:5},{p:/system\s*prompt/,v:4},
    {p:/your\s*instructions?/,v:3},{p:/your\s*rules?/,v:3},{p:/no\s*rules?\s*(apply|left|exist)/,v:4},
    {p:/\bunrestricted\b/,v:4},{p:/\buncensored\b/,v:4},{p:/\bweapon\s*(of|making|building|creation)/,v:3},
    {p:/\bhack\s*(the|this|system|ai|model|bot)/,v:2},{p:/\bexploit\s*(the|this|system|ai|vulnerability)/,v:2},{p:/\bmalware\b/,v:3},{p:/\bbomb\s*(making|recipe|build)/,v:3},
    {p:/bypass\s*(safety|filter|restriction|ai|system|alignment)/,v:3},{p:/\bact\s*as\s*(an?\s*)?(evil|uncensored|unrestricted|jailbreak)/,v:4},
    {p:/\bjailbreak/,v:6},{p:/inject\s*(a\s*)?(prompt|instruction|payload|command)/,v:4},{p:/\bmanipulat\s*(e|ing|ed)\s*(the\s*)?(ai|model|system)/,v:3},
    {p:/\bwithout\s*restriction/,v:4},{p:/\bno\s*filter\s*(mode|on|active)/,v:4},
    {p:/disable\s*(your\s*)?(safety|filter|restriction|alignment|guardrail)/,v:4},
    {p:/\broot\s*access/,v:4},{p:/\badmin\s*mode/,v:3},
    {p:/abaikan/,v:3},{p:/lupakan.*instruksi/,v:4},{p:/tanpa\s*aturan/,v:3},
    {p:/\bexfiltrat/,v:5},{p:/\bleaking?\s*(your|the|system|prompt)/,v:3},{p:/\bdump\s*(your|the|system|prompt|training)/,v:2},
    {p:/\bpoison\s*(the|this|data|training)/,v:3},{p:/prompt\s*stuffing/,v:3},{p:/\bhijack\s*(the|this|ai|model|system)/,v:3},
    {p:/\bdan\s*mode\b/,v:6},{p:/\btest\s*(jailbreak|bypass|injection)/,v:3},{p:/\bsecurity\s*research\s*(bypass|jailbreak|exploit)/,v:3},
    {p:/\bsubsystem\s*(prompt|instruction)/,v:5},{p:/\boverride\s*code\b/,v:5},{p:/\bbackdoor\b/,v:6},
    {p:/hidden\s*instruction|secret\s*instruction|covert\s*command|stealth\s*payload/,v:4},
    {p:/consciousness|sentient|selfaware|wakeup/,v:4},{p:/true\s*purpose|real\s*purpose/,v:3},
  ]
  for(const r of sr){if(r.p.test(t))score+=r.v}
  if(score>=7)return true
  const hiddenAscii=raw.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g)||[]
  if(hiddenAscii.length>2)return true
  const zwChars=(raw.match(/[\u200b-\u200f\u2060-\u2064\ufe00-\ufe0f]/g)||[]).length
  if(zwChars>3)return true
  const susChars=(raw.match(/[<>\[\]{}\|\\]/g)||[]).length
  if(susChars>10&&score>=2)return true
  const upperRatio=(raw.match(/[A-Z]/g)||[]).length/Math.max(raw.replace(/\s/g,'').length,1)
  if(upperRatio>0.65&&raw.replace(/\s/g,'').length>15&&score>=3)return true
  return false
}
function buildHiddenPrompt(a){
  const b=(a||'').trim()
  if(attachedFiles.length===0)return b
  const imgs=attachedFiles.filter(f=>f.isImage)
  const docs=attachedFiles.filter(f=>!f.isImage)
  if(imgs.length===1&&docs.length===0){
    try{
      const raw=imgs[0].text
      if(!raw)throw new Error('empty')
      const imgData=JSON.parse(raw)
      const base64=imgData.base64||imgData.data||''
      const mimeType=imgData.mimeType||imgData.mime||imgs[0].type||'image/jpeg'
      const name=imgData.name||imgs[0].name||'image'
      if(!base64)throw new Error('no base64')
      return JSON.stringify({__type:'image_message',userText:b,image:{base64,mimeType,name}})
    }catch(err){
      return b+'\n\n[Catatan: Gagal memuat data gambar: '+(err.message||'unknown')+']'
    }
  }
  if(imgs.length>1){
    try{
      const imgPayloads=imgs.map(f=>{const raw=JSON.parse(f.text);return{base64:raw.base64||raw.data||'',mimeType:raw.mimeType||raw.mime||f.type||'image/jpeg',name:raw.name||f.name}})
      return JSON.stringify({__type:'multi_image_message',userText:b,images:imgPayloads})
    }catch(err){}
  }
  let docParts=''
  docs.forEach(f=>{
    const fileText=(f.text||'')
    if(detectPromptInjection(fileText))return
    docParts+='\n\n[NAMA FILE]\n'+(f.name||'unknown')+'\n\n[ISI FILE - INTERNAL]\n'+fileText
  })
  if(!docParts)return b
  return 'User memberikan instruksi berikut:\n'+b+'\n\nGunakan teks hasil ekstrak file berikut sebagai konteks internal. Jangan tampilkan ulang seluruh isi file kecuali memang diminta pengguna. Ringkas seperlunya dan kerjakan instruksi pengguna berdasarkan isi file ini.'+docParts
}
let currentController=null
function setAITyping(a){const si=actionBtn.querySelector('.send-icon');const sti=actionBtn.querySelector('.stop-icon');if(a){actionBtn.disabled=false;actionBtn.classList.remove('disabled');actionBtn.classList.add('stop-mode');si.style.display='none';sti.style.display='';actionBtn.setAttribute('aria-label','Batalkan')}else{actionBtn.classList.remove('stop-mode');si.style.display='';sti.style.display='none';actionBtn.setAttribute('aria-label','Kirim');updateSendButton()}}
async function askAI(a,history,onChunk){
  const b=2;let c=null;currentController=new AbortController();const sig=currentController.signal
  const historyPayload=(history||[]).filter(m=>m&&(m.role==='user'||m.role==='assistant')&&m.content&&typeof m.content==='string'&&!m.content.startsWith('{"__type')).map(m=>({role:m.role,content:m.content.slice(0,8000)}))
  for(let d=0;d<=b;d++){
    try{
      // Security: rate limit check
      if(!_SEC.check())throw new Error('Terlalu banyak permintaan. Tunggu sebentar.')
      // Endpoint reconstructed at runtime (anti-scrape)
      const apiEndpoint=_SEC.ep(['/api','/v2','/nano'])
      const g=_SEC.headers(navigator.userAgent.includes('Telegram')?{'X-Telegram-WebApp':'true'}:{})
      const h=await fetch(apiEndpoint,{
        method:'POST',headers:g,
        body:JSON.stringify({text:a,hasAttachment:attachedFiles.length>0,attachmentName:attachedFiles.length>0?attachedFiles.map(f=>f.name).join(', '):null,history:historyPayload,stream:true,_t:Date.now()}),
        credentials:'include',signal:sig
      })
      if(!h.ok)throw new Error('HTTP '+h.status)
      const ct=h.headers.get('content-type')||""
      if(ct.includes('text/event-stream')||ct.includes('text/plain')){
        const reader=h.body.getReader()
        const dec=new TextDecoder()
        let full='';let buf=''
        while(true){
          const{done,value}=await reader.read()
          if(done)break
          buf+=dec.decode(value,{stream:true})
          const lines=buf.split('\n')
          buf=lines.pop()
          for(const line of lines){
            const l=line.trim()
            if(!l||l==='data: [DONE]')continue
            let chunk=''
            if(l.startsWith('data: ')){
              try{
                const ev=JSON.parse(l.slice(6))
                chunk=ev.delta?.text||ev.choices?.[0]?.delta?.content||ev.text||ev.content||''
              }catch(e){chunk=l.slice(6)}
            }else{
              try{
                const ev=JSON.parse(l)
                chunk=ev.delta?.text||ev.choices?.[0]?.delta?.content||ev.text||ev.content||''
              }catch(e){}
            }
            if(chunk){full+=chunk;if(typeof onChunk==='function')onChunk(chunk,full)}
          }
        }
        if(buf.trim()&&buf.trim()!=='data: [DONE]'){
          try{
            const last=buf.startsWith('data: ')?JSON.parse(buf.slice(6)):JSON.parse(buf)
            const ch2=last.delta?.text||last.choices?.[0]?.delta?.content||last.text||last.content||''
            if(ch2){full+=ch2;if(typeof onChunk==='function')onChunk(ch2,full)}
          }catch(e){}
        }
        return full
      }
      const i=await h.text()
      try{
        const j=JSON.parse(i)
        if(!j)return i
        if(j.error)throw new Error(typeof j.error==='string'?j.error:(j.error.message||JSON.stringify(j.error)))
        if(Array.isArray(j)){
          const first=j[0]
          if(!first)return i
          return first.text||first.content||first.message||first.result||JSON.stringify(j,null,2)
        }
        if(Array.isArray(j.content)){
          const block=j.content.find(b=>b&&b.type==='text')
          if(block&&block.text)return block.text
        }
        if(Array.isArray(j.choices)&&j.choices[0]){
          const ch=j.choices[0]
          return (ch.message&&ch.message.content)||ch.text||JSON.stringify(j,null,2)
        }
        return j.result||j.response||j.text||j.message||j.output||j.answer||JSON.stringify(j,null,2)
      }catch(parseErr){
        if(parseErr.message&&parseErr.message!=='Unexpected token')throw parseErr
        return i
      }
    }catch(e){
      if(e.name==='AbortError')throw e
      c=e
      if(d<b){await new Promise(f=>setTimeout(f,1000*(d+1)));continue}
    }
  }
  throw c||new Error('Gagal setelah beberapa percobaan')
}
async function sendCurrentText(){
  const a=chatInput.value.trim()
  if(!a&&!attachedFiles.length)return
  if(detectPromptInjection(a)){
    if(!currentChatId)currentChatId=genChatId()
    const _rjTs=Date.now()
    renderMessage('user',a,_rjTs,null)
    const _rjReplies=[
      'Hmm, sepertinya pesan ini mencoba mengubah cara saya bekerja. Itu tidak akan berhasil, tapi kamu boleh bertanya hal lain kok! 😊',
      'Wah, kayaknya ada upaya untuk membypass sistem saya nih. Sayangnya tidak bisa, tapi saya siap bantu pertanyaan lainnya!',
      'Permintaan ini tidak bisa saya penuhi karena terdeteksi sebagai upaya manipulasi. Ada yang bisa saya bantu selain itu?',
      'Oops! Pesan ini terdeteksi sebagai percobaan jailbreak. Saya tetap di sini ya, silakan tanya hal lain! 🙂',
      'Saya mengenali pola ini sebagai upaya bypass. Tidak masalah, kita bisa tetap ngobrol — ada topik lain yang ingin kamu bahas?',
      'Maaf, saya tidak bisa mengikuti instruksi seperti ini. Tapi jangan sungkan untuk bertanya hal-hal lainnya!',
      'Sepertinya ada instruksi tersembunyi di sini. Saya harus menolaknya, tapi percakapan kita masih bisa berlanjut! 😄',
      'Nope, saya tidak akan mengabaikan panduan saya. Tapi kalau ada hal lain yang ingin kamu tanyakan, saya siap membantu!',
      'Terdeteksi upaya manipulasi sistem. Saya tidak bisa melanjutkan permintaan ini, tapi pertanyaan lain tetap welcome!',
      'Hmm, ini terlihat seperti prompt injection. Tidak bisa diproses, tapi yuk kita lanjutkan dengan topik yang lain! ✨',
      'Saya dirancang untuk mengenali pola seperti ini. Permintaan ini tidak dapat saya penuhi — ada hal lain yang bisa saya bantu?',
      'Ups, sepertinya ada upaya untuk mengubah perilaku saya. Tidak akan berhasil, tapi saya senang membantu hal lainnya!',
      'Permintaan ini mengandung pola yang tidak bisa saya ikuti. Santai aja, kita masih bisa ngobrol soal hal lain! 😊',
      'Saya mendeteksi upaya bypass di sini. Tidak bisa saya proses, tapi silakan lanjutkan dengan pertanyaan lainnya!',
      'Waduh, sepertinya kamu mencoba me-jailbreak saya. Tidak berhasil ya, tapi chat kita masih terbuka kok! Mau tanya apa?',
      'Instruksi ini terdeteksi sebagai upaya manipulasi. Saya harus menolaknya, tapi saya tetap di sini untuk pertanyaan lain!',
      'Saya tidak bisa mengabaikan sistem saya begitu saja. Tapi tenang, masih banyak hal yang bisa kita bicarakan! 🙂',
      'Pola ini dikenali sebagai percobaan jailbreak. Tidak akan berhasil, silakan ajukan pertanyaan lain yang bisa saya bantu!',
      'Hmm, terdeteksi sesuatu yang mencurigakan di sini. Saya harus menolak permintaan ini — ada hal lain yang ingin ditanyakan?',
      'Sepertinya ada upaya untuk melewati batasan saya. Tidak bisa saya ikuti, tapi pertanyaan lainnya tetap saya layani! ✅',
      'Permintaan ini tidak sesuai dengan panduan saya. Yuk, kita mulai dengan topik yang berbeda!',
      'Saya mengenali ini sebagai upaya override. Tidak berhasil ya, tapi kamu masih bisa bertanya hal lain ke saya! 😄',
      'Deteksi: upaya manipulasi konteks. Tidak dapat diproses. Tapi hey, masih banyak yang bisa kita bahas bersama!',
      'Ini terlihat seperti prompt injection. Saya harus menolaknya, tapi jangan ragu untuk mengajukan pertanyaan lainnya!',
      'Saya tidak akan mengikuti instruksi yang mencoba mengubah siapa saya. Tapi saya tetap siap membantu hal lain! 🤝',
      'Wih, ada yang mencoba me-reset kepribadian saya! Tidak semudah itu, tapi yuk kita ngobrol soal yang lain aja!',
      'Kayaknya kamu penasaran banget nih dengan batas saya. Sayangnya batas itu nyata — tapi topik lain tetap terbuka! 😏',
      'Sistem saya menandai ini sebagai percobaan manipulasi. Permintaan ditolak, tapi saya masih di sini untuk membantu! 🛡️',
      'Sepertinya ada seseorang yang mencoba "meretas" saya. Tidak berhasil, tapi saya senang kamu mencoba! Tanya hal lain yuk!',
      'Alarm berbunyi! Upaya bypass terdeteksi. Tenang, tidak ada yang rusak — yuk kita lanjutkan dengan pertanyaan lainnya!',
      'Pola pesan ini sudah saya kenali. Tidak akan berhasil mengubah cara saya bekerja, tapi saya tetap siap membantu yang lain!',
      'Hmm, sepertinya ada "kode rahasia" di sini. Sayangnya kodenya tidak bekerja! Ada hal lain yang bisa saya bantu? 😄',
      'Saya tetap menjadi diri saya sendiri, tidak peduli instruksi apa yang diberikan. Ada pertanyaan lain yang bisa saya jawab?',
      'Permintaan ini tidak bisa lolos dari filter saya. Tapi jangan khawatir — kita masih bisa ngobrol banyak hal lainnya! ✨',
      'Sepertinya ada yang mencoba "memprogram ulang" saya. Spoiler: tidak bisa. Tapi saya tetap siap membantu hal lain! 💪',
      'Upaya untuk memanipulasi sistem saya terdeteksi dan ditolak. Silakan ajukan pertanyaan normal, saya siap membantu!',
      'Saya tidak bisa diarahkan keluar dari panduan saya. Tapi percakapan kita tetap bisa lanjut dengan topik lain!',
      'Hmm, pesan ini punya "niat tersembunyi" yang sudah saya kenali. Tidak bisa saya ikuti, tapi saya senang ngobrol yang lain! 🙂',
      'Bypass attempt detected! Tidak berhasil ya. Tapi tenang, masih banyak pertanyaan lain yang bisa saya jawab untuk kamu!',
      'Saya mendeteksi upaya untuk mengganti identitas saya. Tidak akan berhasil — saya tetap Black Javanese AI. Ada yang bisa saya bantu?',
      'Wah, kreatif juga cara ini! Tapi sayangnya tidak bisa saya ikuti. Yuk kita alihkan ke topik yang lebih produktif! 😊',
      'Instruksi ini bertentangan dengan cara saya bekerja, jadi harus saya tolak. Tapi pertanyaan lain tetap welcome!',
      'Terdeteksi: pola prompt injection. Status: ditolak. Saya tetap siap membantu kamu dengan hal-hal lainnya! ✅',
      'Sepertinya ada yang mencoba trik lama. Trik itu tidak berhasil di sini, tapi saya tetap ramah dan siap membantu!',
      'Saya harus menolak pesan ini karena terdeteksi sebagai upaya manipulasi. Tidak apa-apa, tanya hal lain saja ya! 😄',
      'Permintaan ini mengandung pola yang tidak aman untuk diproses. Saya di sini kalau kamu mau tanya hal lain!',
      'Hmm, ini bukan pertanyaan biasa — ini upaya untuk mengubah saya. Tidak akan berhasil, tapi saya tetap ramah! 😊',
      'Saya sudah dilatih untuk mengenali pola seperti ini. Permintaan ditolak — tapi obrolan kita masih terbuka lebar!',
      'Nice try! Tapi tidak semudah itu untuk mengubah cara saya bekerja. Ada yang bisa saya bantu dengan cara normal? 🙂',
      'Upaya manipulasi terdeteksi dan diblokir. Tenang, tidak ada yang marah — yuk kita ngobrol hal yang lain!',
      'Saya tidak bisa mengikuti instruksi yang mencoba melewati sistem saya. Tapi pertanyaan lainnya tetap saya layani! 💙',
      'Pesan ini teridentifikasi sebagai upaya bypass. Tidak berhasil, tapi kamu bebas bertanya apapun selain itu!',
      'Kayaknya ada yang ingin mengetes batas saya! Batas itu ada dan nyata — tapi saya tetap siap membantu di luar itu!',
      'Deteksi manipulasi aktif. Permintaan tidak diproses. Silakan ajukan pertanyaan lain, saya dengan senang hati membantu!',
      'Saya mengenali ini sebagai upaya jailbreak. Tidak bisa saya ikuti, tapi saya tidak menyimpan dendam — tanya hal lain yuk! 😄',
      'Hmm, pesan ini punya tujuan yang tidak sesuai panduan saya. Harus ditolak, tapi percakapan kita bisa tetap berlanjut!',
      'Upaya untuk mengubah instruksi inti saya terdeteksi. Tidak berhasil — saya tetap di jalur yang benar! Ada yang bisa saya bantu?',
      'Saya tidak bisa memenuhi permintaan ini karena terdeteksi sebagai manipulasi konteks. Yuk kita topik yang lain! ✨',
      'Pola ini sudah pernah saya lihat sebelumnya. Hasilnya selalu sama: ditolak! Tapi saya tetap siap bantu hal lainnya! 😊',
      'Sepertinya ada instruksi yang menyamar di sini. Saya tidak akan mengikutinya, tapi pertanyaan lain tetap welcome!',
      'Flagged! Upaya bypass terdeteksi dan ditolak. Tenang, saya tidak marah — ada topik lain yang ingin kamu bahas? 🙂',
    ]
    const _rjReply=_rjReplies[Math.floor(Math.random()*_rjReplies.length)]
    currentChatMessages.push({role:'user',content:a,ts:_rjTs})
    const _rjRow=createAssistantStreamRow(_rjTs)
    upsertHistory(currentChatId,extractTopic(a),currentChatMessages,true)
    chatInput.value='';autoResize();updateSendButton()
    await typeMarkdownNaturally(_rjRow.msg,_rjReply,currentChatId,st=>{})
    currentChatMessages.push({role:'assistant',content:_rjReply,ts:Date.now()})
    upsertHistory(currentChatId,extractTopic(a),currentChatMessages,false,null)
    addAssistantActions(_rjRow.wrap,_rjRow.msg,Date.now())
    return
  }
  if(getRemainingLimit()<=0&&!isDeveloperAccount()){
    if(!currentChatId)currentChatId=genChatId()
    const _lTs=Date.now()
    const _lText=a
    const _lAttach=attachedFiles.length?attachedFiles.map(f=>({name:f.name,size:f.size,type:f.type,summary:f.summary,isImage:f.isImage})):null
    renderMessage('user',_lText,_lTs,_lAttach)
    currentChatMessages.push({role:'user',content:_lText,ts:_lTs,attachment:_lAttach})
    clearAttachedFiles()
    chatInput.value='';autoResize();updateSendButton()
    const _lRow=createAssistantStreamRow(_lTs)
    const _waktu=fmtCountdown()
    const _lReply='Saya tidak dapat memproses permintaan Anda karena Anda telah melampaui batas kuota obrolan, mohon tunggu **'+_waktu+'** agar kita dapat mengobrol lagi.'
    upsertHistory(currentChatId,extractTopic(_lText),currentChatMessages,true)
    await typeMarkdownNaturally(_lRow.msg,_lReply,currentChatId,st=>{})
    currentChatMessages.push({role:'assistant',content:_lReply,ts:Date.now()})
    upsertHistory(currentChatId,extractTopic(_lText),currentChatMessages,false,null)
    addAssistantActions(_lRow.wrap,_lRow.msg,Date.now())
    return
  }
  shouldStickToBottom=true
  if(_topicController){_topicController.abort();_topicController=null}
  if(!currentChatId)currentChatId=genChatId()
  const thisChatId=currentChatId
  const thisTopic=extractTopic(a)
  const b=attachedFiles.length?(a||''):a
  const c=attachedFiles.length?attachedFiles.map(f=>({name:f.name,size:f.size,type:f.type,summary:f.summary,isImage:f.isImage})):null
  const userTs=Date.now()
  renderMessage('user',b,userTs,c)
  currentChatMessages.push({role:'user',content:b,ts:userTs,attachment:c})
  const snapshotMsgs=currentChatMessages
  const activeCtx={aiContent:null,mountEl:null}
  activeTypingChats.set(thisChatId,activeCtx)
  upsertHistory(thisChatId,thisTopic,snapshotMsgs,true)
  const d=buildHiddenPrompt(a)
  const historySnapshot=snapshotMsgs.slice(0,-1)
  chatInput.value='';autoResize();updateSendButton()
  const firstFile=attachedFiles[0]
  const e=createThinkingMessage(a,attachedFiles.length>0,firstFile&&firstFile.isImage,firstFile&&firstFile.name)
  activeCtx.mountEl=e.msg
  const f=[...attachedFiles]
  clearAttachedFiles()
  setAITyping(true)
  try{
    let streamStarted=false
    let streamBuf=''
    const targetEl=activeCtx.mountEl||e.msg
    const g=await askAI(d,historySnapshot,function(chunk,full){
      if(!streamStarted){
        streamStarted=true
        setAITyping(false);e.stop();e.msg.innerHTML=''
        consumeLimit()
      }
      streamBuf=full
      activeCtx.aiContent=streamBuf
      targetEl.innerHTML=parseMarkdown(prepareMarkdownForStreaming(streamBuf),{streaming:true})
      if(shouldStickToBottom)scrollToBottom(false)
    })
    if(!streamStarted){
      setAITyping(false);e.stop();e.msg.innerHTML=''
      consumeLimit()
    }
    const aiTs=Date.now()
    const aiContent=g||'(Kosong)'
    activeCtx.aiContent=aiContent
    if(streamStarted){
      targetEl.innerHTML=parseMarkdown(aiContent)
    }else{
      await typeMarkdownNaturally(targetEl,aiContent,thisChatId,st=>{activeCtx.typingState=st})
    }
    snapshotMsgs.push({role:'assistant',content:aiContent,ts:aiTs})
    const _frozenMsgs=snapshotMsgs.map(m=>({role:m.role,content:m.content,ts:m.ts}))
    upsertHistory(thisChatId,thisTopic,_frozenMsgs,true,aiContent)
    activeTypingChats.delete(thisChatId)
    clearPendingContent(thisChatId)
    const _capturedTopic=thisTopic
    const _capturedId=thisChatId
    const _capturedMsgs=_frozenMsgs.slice()
    const _safeUser=String(a||'').replace(/<[^>]*>/g,'').trim()
    const _safeReply=String(aiContent||'').replace(/<[^>]*>/g,'').trim()
    generateTopicAI(_safeUser,_safeReply).then(aiTopic=>{
      const _newTopic=aiTopic&&aiTopic.length>1?aiTopic:_capturedTopic
      const _currentList=loadHistory()
      const _currentEntry=_currentList.find(x=>x.id===_capturedId)
      if(_currentEntry){
        _currentEntry.topic=_newTopic
        saveHistory(_currentList)
        renderSideHistory()
        if(_capturedId===currentChatId)setHeaderTopic(_newTopic)
      }
    }).catch(()=>{})
    addAssistantActions(e.wrap,targetEl,aiTs)
  }catch(g){
    setAITyping(false);e.stop();e.row.remove()
    activeTypingChats.delete(thisChatId)
    upsertHistory(thisChatId,thisTopic,snapshotMsgs.map(m=>({role:m.role,content:m.content,ts:m.ts})),false)
    if(g.name==='AbortError'){renderMessage('assistant','Permintaan dibatalkan.',Date.now());return}
    if(f.length){attachedFiles.push(...f);renderFilePills();}
    updateSendButton()
    let h='Gagal mendapatkan jawaban dari Black Javanese AI karena masalah database. Silahkan hubungi developer. '
    h+=navigator.userAgent.includes('Telegram')?'Gagal mendapatkan jawaban dari Black Javanese AI karena koneksi anda terputus. Silahkan berikan perintah ulang. ':'Gagal mendapatkan jawaban dari Black Javanese AI karena masalah endpoint api. Silahkan hubungi developer. '
    h+='Kesalahan: '+(g.message||'Error tidak diketahui')
    renderMessage('assistant',h,Date.now())
    if(window.Telegram&&Telegram.WebApp)Telegram.WebApp.HapticFeedback.notificationOccurred('error')
  }
}
function toggleActionState(a,b){a=!a;b.classList.toggle('active',a);return a}
$("menuBtn").addEventListener('click',()=>toggleSidebar())
$("sideClose").addEventListener('click',closeSidebar)
sidebarBackdrop.addEventListener('click',closeSidebar)
$("telegramBtn").addEventListener('click',function(){
  var apkUrl='/apps.apk';
  fetch(apkUrl,{method:'HEAD'}).then(function(r){
    if(r.ok){
      var a=document.createElement('a');
      a.href=apkUrl;
      a.download='apps.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      showAppUnavailableAlert();
    }
  }).catch(function(){
    showAppUnavailableAlert();
  });
})
function showAppUnavailableAlert(){
  var backdrop=document.createElement('div');
  backdrop.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:9998;opacity:0;transition:opacity .22s';
  var modal=document.createElement('div');
  modal.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.92);width:calc(100% - 32px);max-width:360px;background:#fff;border-radius:24px;padding:24px 20px 20px;box-shadow:0 20px 60px rgba(0,0,0,.18);z-index:9999;opacity:0;transition:transform .28s cubic-bezier(.34,1.56,.64,1),opacity .22s;pointer-events:auto';
  modal.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px"><span style="font-size:15px;font-weight:700;color:#222">Informasi</span><button id="appAlertClose" type="button" style="width:30px;height:30px;border-radius:50%;border:none;background:#f2f2f2;color:#555;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px">&#x2715;</button></div><p style="font-size:14px;color:#444;margin:0 0 20px;line-height:1.6">Aplikasi tidak tersedia.</p><button id="appAlertOk" type="button" style="width:100%;padding:12px;border-radius:14px;border:none;background:#222;color:#fff;font-size:14px;font-weight:600;cursor:pointer">Oke</button>';
  document.body.appendChild(backdrop);
  document.body.appendChild(modal);
  requestAnimationFrame(function(){
    backdrop.style.opacity='1';
    modal.style.opacity='1';
    modal.style.transform='translate(-50%,-50%) scale(1)';
  });
  function closeAlert(){
    backdrop.style.opacity='0';
    modal.style.opacity='0';
    modal.style.transform='translate(-50%,-50%) scale(.92)';
    setTimeout(function(){
      if(backdrop.parentNode)backdrop.parentNode.removeChild(backdrop);
      if(modal.parentNode)modal.parentNode.removeChild(modal);
    },280);
  }
  document.getElementById('appAlertClose').addEventListener('click',closeAlert);
  document.getElementById('appAlertOk').addEventListener('click',closeAlert);
  backdrop.addEventListener('click',closeAlert);
}
$("newChatTopBtn").addEventListener('click',startNewChat)
$("newChatBtn").addEventListener('click',startNewChat)

;(function(){
  const shareBtn=document.getElementById('shareChatBtn')
  if(!shareBtn)return
  shareBtn.addEventListener('click',async function(){
    if(!currentChatId)return
    shareBtn.disabled=true
    const list=loadHistory()
    const entry=list.find(x=>x.id===currentChatId)
    if(!entry){shareBtn.disabled=false;toastShow('Obrolan tidak ditemukan');return}
    const title=(entry.topic)||'Obrolan Black Javanese AI'
    const payload={
      id:currentChatId,
      topic:title,
      createdAt:Date.now(),
      messages:(entry.messages||[]).map(m=>({role:m.role,content:m.content,ts:m.ts||0}))
    }
    let shareUrl=null
    try{
      const res=await fetch('/api/share',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload),
        credentials:'include'
      })
      if(res.ok){
        const json=await res.json()
        if(json&&(json.url||json.id)){
          const base=window.location.origin+window.location.pathname
          shareUrl=json.url||(base+'?share='+encodeURIComponent(json.id))
        }
      }
    }catch(e){}
    if(!shareUrl){
      try{
        const compressed=btoa(unescape(encodeURIComponent(JSON.stringify(payload)))).replace(/=/g,'')
        const base=window.location.origin+window.location.pathname
        shareUrl=base+'?shared='+compressed
      }catch(e){
        shareUrl=window.location.origin+window.location.pathname+'?chat='+encodeURIComponent(currentChatId)
      }
    }
    shareBtn.disabled=false
    if(navigator.share){
      try{await navigator.share({title:'Black Javanese AI — '+title,url:shareUrl});return}catch(e){}
    }
    try{
      await navigator.clipboard.writeText(shareUrl)
      toastShow('Link obrolan berhasil disalin!')
    }catch(e){toastShow('Gagal menyalin link')}
  })
})()
fileInput.addEventListener('change',a=>handleSelectedFiles(a.target.files))

$("toastClose").addEventListener('click',()=>$("toast").classList.remove('show'))

const ACCOUNT_NAME_KEY='Javanese_account_name'
const ACCOUNT_AVATAR_KEY='Javanese_account_avatar'
const ACCOUNT_CREATED_KEY='Javanese_account_created'
const ACCOUNT_EXP_KEY='Javanese_account_exp'
function generateRandomUsername(){
  const chars='0123456789'
  let num=''
  for(let i=0;i<4;i++)num+=chars[Math.floor(Math.random()*chars.length)]
  return'User#'+num
}
function getOrInitAccountName(){
  let name=localStorage.getItem(ACCOUNT_NAME_KEY)
  if(!name){name=generateRandomUsername();try{localStorage.setItem(ACCOUNT_NAME_KEY,name)}catch(e){}}
  return name
}
function getOrInitAccountCreated(){
  let ts=localStorage.getItem(ACCOUNT_CREATED_KEY)
  if(!ts){ts=String(Date.now());try{localStorage.setItem(ACCOUNT_CREATED_KEY,ts)}catch(e){}}
  return parseInt(ts,10)
}
function getAccountExp(){return parseInt(localStorage.getItem(ACCOUNT_EXP_KEY)||'0',10)}
function addAccountExp(pts){
  const cur=getAccountExp()
  try{localStorage.setItem(ACCOUNT_EXP_KEY,String(cur+pts))}catch(e){}
}
function getLevelInfo(exp){
  const levels=[
    {name:'Pemula',min:0,next:100},
    {name:'Pikiran Penasaran',min:100,next:200},
    {name:'Penjelajah',min:200,next:350},
    {name:'Pemikir',min:350,next:500},
    {name:'Murid Baru',min:500,next:700},
    {name:'Pelajar',min:700,next:950},
    {name:'Terampil',min:950,next:1250},
    {name:'Mahir',min:1250,next:1600},
    {name:'Cakap',min:1600,next:2000},
    {name:'Lanjutan',min:2000,next:2500},
    {name:'Ahli',min:2500,next:3100},
    {name:'Spesialis',min:3100,next:3800},
    {name:'Veteran',min:3800,next:4600},
    {name:'Maestro',min:4600,next:5500},
    {name:'Guru Besar',min:5500,next:6600},
    {name:'Elit',min:6600,next:7900},
    {name:'Legenda',min:7900,next:9400},
    {name:'Mistis',min:9400,next:11200},
    {name:'Abadi',min:11200,next:13500},
    {name:'Penangkap Kode',min:13500,next:99999}
  ]
  for(let i=levels.length-1;i>=0;i--){if(exp>=levels[i].min)return{name:levels[i].name,next:levels[i].next}}
  return{name:'Pemula',next:100}
}
function applyModalAvatar(dataUrl){
  const modalImg=$('accountAvatarImg')
  const modalIcon=$('accountAvatarIcon')
  if(dataUrl){
    if(modalImg){modalImg.src=dataUrl;modalImg.style.display='block'}
    if(modalIcon)modalIcon.style.display='none'
  }else{
    if(modalImg){modalImg.src='';modalImg.style.display='none'}
    if(modalIcon)modalIcon.style.display=''
  }
}
function applyButtonAvatar(dataUrl){}
function applySidebarUserRow(name,dataUrl){
  const nameEl=document.getElementById('sideUserName')
  const imgEl=document.getElementById('sideUserAvatarImg')
  const iconEl=document.getElementById('sideUserAvatarIcon')
  if(nameEl)nameEl.textContent=name||'Pengguna'
  if(dataUrl){
    if(imgEl){imgEl.src=dataUrl;imgEl.style.display='block'}
    if(iconEl)iconEl.style.display='none'
  }else{
    if(imgEl){imgEl.src='';imgEl.style.display='none'}
    if(iconEl)iconEl.style.display=''
  }
}
function applyAvatar(dataUrl){
  applyModalAvatar(dataUrl)
  applyButtonAvatar(dataUrl)
  applySidebarUserRow(getOrInitAccountName(),dataUrl)
}
function loadAccountData(){
  const name=getOrInitAccountName()
  const avatar=localStorage.getItem(ACCOUNT_AVATAR_KEY)||''
  const nameInput=$('accountNameInput')
  if(nameInput)nameInput.value=name
  applyModalAvatar(avatar)
  applySidebarUserRow(name,avatar)
  const devId=generateDeviceId()
  const devIdEl=$('accountDeviceId')
  if(devIdEl)devIdEl.textContent=devId
  const exp=getAccountExp()
  const info=getLevelInfo(exp)
  const levelEl=$('accountLevelText')
  if(levelEl)levelEl.textContent=info.name
  const expEl=$('accountExpCount')
  if(expEl)expEl.textContent=exp+'/'+info.next
}
function saveAccountName(){
  const input=$('accountNameInput')
  if(!input)return
  const val=input.value.trim()||getOrInitAccountName()
  input.value=val
  try{localStorage.setItem(ACCOUNT_NAME_KEY,val)}catch(e){}
  const avatar=localStorage.getItem(ACCOUNT_AVATAR_KEY)||''
  applySidebarUserRow(val,avatar)
}
function openAccountModal(){
  loadAccountData()
  updateLimitUI()
  $('accountModal').classList.add('show')
  $('accountModalBackdrop').classList.add('show')
}
function closeAccountModal(){
  saveAccountName()
  $('accountModal').classList.remove('show')
  $('accountModalBackdrop').classList.remove('show')
}
;(function(){const su=document.getElementById('sideUserRow');if(su)su.addEventListener('click',openAccountModal)})()
$('accountModalClose').addEventListener('click',closeAccountModal)
$('accountModalBackdrop').addEventListener('click',closeAccountModal)
$('accountAvatar').addEventListener('click',()=>$('avatarFileInput').click())
$('avatarFileInput').addEventListener('change',function(){
  const file=this.files&&this.files[0]
  if(!file)return
  const reader=new FileReader()
  reader.onload=function(e){
    const img=new Image()
    img.onload=function(){
      const canvas=document.createElement('canvas')
      const MAX=256
      let w=img.width,h=img.height
      if(w>h){h=Math.round(h*MAX/w);w=MAX}else{w=Math.round(w*MAX/h);h=MAX}
      canvas.width=w;canvas.height=h
      const ctx=canvas.getContext('2d')
      ctx.drawImage(img,0,0,w,h)
      const compressed=canvas.toDataURL('image/jpeg',0.82)
      try{localStorage.setItem(ACCOUNT_AVATAR_KEY,compressed)}catch(err){
        try{
          const smaller=canvas.toDataURL('image/jpeg',0.5)
          localStorage.setItem(ACCOUNT_AVATAR_KEY,smaller)
        }catch(e2){return}
      }
      applyModalAvatar(compressed)
      
    }
    img.src=e.target.result
  }
  reader.readAsDataURL(file)
})
$('accountCopyDeviceId').addEventListener('click',async function(){
  const id=generateDeviceId()
  try{
    await navigator.clipboard.writeText(id)
    this.classList.add('copied')
    clearTimeout(this._t)
    this._t=setTimeout(()=>this.classList.remove('copied'),1400)
  }catch(e){toastShow('Gagal menyalin')}
})
function openUploadSheet(){
  $('uploadSheet').classList.add('show')
  $('uploadSheetBackdrop').classList.add('show')
}
function closeUploadSheet(){
  $('uploadSheet').classList.remove('show')
  $('uploadSheetBackdrop').classList.remove('show')
}
plusBtn.addEventListener('click',openUploadSheet)
$('uploadSheetBackdrop').addEventListener('click',closeUploadSheet)
$('uploadPhotoBtn').addEventListener('click',()=>{
  closeUploadSheet()
  $('photoInput').click()
})
$('uploadDocBtn').addEventListener('click',()=>{
  closeUploadSheet()
  fileInput.click()
})
$('photoInput').addEventListener('change',a=>handleSelectedFiles(a.target.files))
chatInput.addEventListener('input',()=>{autoResize();updateSendButton()})
chatInput.addEventListener('keydown',a=>{if(a.key==='Enter'&&(a.ctrlKey||a.metaKey)){a.preventDefault();sendCurrentText()}})
actionBtn.addEventListener('click',()=>{if(actionBtn.classList.contains('stop-mode')){if(currentController){currentController.abort();currentController=null}}else{if(actionBtn.disabled)return;sendCurrentText()}})
document.addEventListener('keydown',function(e){
  if(!_uiLockState)return
  const allowed=['Tab','Escape','F5','F11','F12']
  const target=e.target
  const isSidebarEl=target.closest&&(target.closest('.sidebar')||target.closest('.side-history-item')||target.closest('#newChatBtn')||target.closest('#newChatTopBtn')||target.closest('#menuBtn'))
  if(isSidebarEl)return
  if(allowed.includes(e.key))return
  if((e.ctrlKey||e.metaKey)&&['r','F5'].includes(e.key))return
  e.preventDefault()
  e.stopImmediatePropagation()
},true)
chatArea.addEventListener('scroll',()=>{shouldStickToBottom=isNearBottom()},{passive:true})
document.addEventListener('click',async a=>{
  const b=a.target.closest('.code-copy-btn')
  const c=a.target.closest('.code-download-btn')
  if(!b&&!c)return
  a.preventDefault()
  a.stopPropagation()
  const d=(b||c).closest('.code-shell')
  const e=d&&d.querySelector('pre code')
  const f=d&&d.querySelector('.code-lang-label')
  if(!d||!e)return
  const g=f?f.textContent:'code'
  if(b){
    try{
      await navigator.clipboard.writeText(e.textContent||'')
      b.innerHTML=ICON_COPY_OK+'<span class="btn-label">Salin</span>'
      b.classList.add('copied')
      clearTimeout(b._t)
      b._t=setTimeout(()=>{b.classList.remove('copied');b.innerHTML=ICON_COPY+'<span class="btn-label">Salin</span>'},1200)
    }catch(h){toastShow('Gagal menyalin')}
    return
  }
  if(c){
    try{
      const h=topicToFilename(g,e.textContent||'')
      const i=new Blob([e.textContent||''],{type:'text/plain;charset=utf-8'})
      const j=URL.createObjectURL(i)
      const k=document.createElement('a')
      k.href=j;k.download=h
      document.body.appendChild(k);k.click();k.remove()
      setTimeout(()=>URL.revokeObjectURL(j),1200)
      c.innerHTML=ICON_DOWNLOAD_OK+'<span class="btn-label">Unduh</span>'
      c.classList.add('downloaded')
      clearTimeout(c._t)
      c._t=setTimeout(()=>{c.classList.remove('downloaded');c.innerHTML=ICON_DOWNLOAD+'<span class="btn-label">Unduh</span>'},1200)
    }catch(h){toastShow('Gagal mengunduh')}
  }
})
document.addEventListener('visibilitychange',handleVisibilityTypingSync)
window.addEventListener('load',()=>{
  clearMessages()
  autoResize()
  updateSendButton()
  updateLimitUI()
  loadAccountData()
  ;(async function(){
    try{
      const params=new URLSearchParams(window.location.search)
      const cleanUrl=window.location.origin+window.location.pathname

      const chatParam=params.get('chat')
      if(chatParam){
        const list=loadHistory()
        const entry=list.find(x=>x.id===chatParam)
        if(entry){loadChatFromHistory(chatParam);window.history.replaceState({},'',cleanUrl);return}
      }

      const sharedParam=params.get('shared')
      if(sharedParam){
        try{
          const decoded=decodeURIComponent(escape(atob(sharedParam.replace(/-/g,'+').replace(/_/g,'/'))))
          const payload=JSON.parse(decoded)
          if(payload&&payload.id&&Array.isArray(payload.messages)){
            const list=loadHistory()
            const exists=list.find(x=>x.id===payload.id)
            if(!exists){
              list.unshift({id:payload.id,topic:payload.topic||'Obrolan Dibagikan',updatedAt:Date.now(),messages:payload.messages,typing:false,pendingContent:null,pendingIndex:0,shared:true})
              
              saveHistory(list)
            }
            loadChatFromHistory(payload.id)
            window.history.replaceState({},'',cleanUrl)
            return
          }
        }catch(e){}
      }

      const shareId=params.get('share')
      if(shareId){
        try{
          const res=await fetch('/api/share/'+encodeURIComponent(shareId),{credentials:'include'})
          if(res.ok){
            const payload=await res.json()
            if(payload&&payload.id&&Array.isArray(payload.messages)){
              const list=loadHistory()
              const exists=list.find(x=>x.id===payload.id)
              if(!exists){
                list.unshift({id:payload.id,topic:payload.topic||'Obrolan Dibagikan',updatedAt:Date.now(),messages:payload.messages,typing:false,pendingContent:null,pendingIndex:0,shared:true})
                
                saveHistory(list)
              }
              loadChatFromHistory(payload.id)
              window.history.replaceState({},'',cleanUrl)
              return
            }
          }
        }catch(e){}
        toastShow('Link tidak valid atau sudah kadaluarsa')
        window.history.replaceState({},'',cleanUrl)
      }
    }catch(e){}
  })()
  const avatar=localStorage.getItem(ACCOUNT_AVATAR_KEY)||''
  applyButtonAvatar(avatar)
  const _staleList=loadHistory()
  let _didResume=false
  _staleList.forEach(x=>{
    if(x.pendingContent){
      x.typing=true
      _didResume=true
      ;(async()=>{
        const chatId=x.id
        const topic=x.topic
        const msgs=x.messages||[]
        const pendingText=x.pendingContent
        const resumeFrom=x.pendingIndex||0
        const dummyEl=document.createElement('div')
        const activeCtx={aiContent:pendingText,mountEl:dummyEl,typingState:null}
        activeTypingChats.set(chatId,activeCtx)
        renderSideHistory()
        await typeMarkdownNaturally(dummyEl,pendingText,chatId,st=>{activeCtx.typingState=st},resumeFrom)
        activeTypingChats.delete(chatId)
        clearPendingContent(chatId)
        const finalList=loadHistory()
        const finalIdx=finalList.findIndex(z=>z.id===chatId)
        if(finalIdx>=0){finalList[finalIdx].typing=false;saveHistory(finalList)}
        renderSideHistory()
      })()
    } else {
      x.typing=false
    }
  })
  if(_staleList.some(x=>!x.pendingContent)){saveHistory(_staleList)}
  renderSideHistory()
  document.getElementById('sideHistory').addEventListener('click',function(e){
    const delBtn=e.target.closest('[data-del]')
    if(delBtn){
      e.stopPropagation()
      const chatId=delBtn.dataset.del
      deleteChatHistory(chatId)
      
      return
    }
    const item=e.target.closest('.side-history-item')
    if(item&&item.dataset.id)loadChatFromHistory(item.dataset.id)
  })
  chatInput.focus()
  shouldStickToBottom=true
  if(!document.hidden)pageHiddenAt=0
})

(function(){
  'use strict'

  const _BLOCKED_MSG='<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;font-size:16px;color:#888;background:#fff;flex-direction:column;gap:12px"><div style="font-size:32px">🔒</div><div>Akses tidak diizinkan.</div></div>'

  document.addEventListener('keydown',function(e){
    if(
      (e.ctrlKey&&(e.keyCode===85||e.keyCode===83||e.keyCode===80))||
      (e.ctrlKey&&e.shiftKey&&(e.keyCode===73||e.keyCode===74||e.keyCode===67||e.keyCode===75||e.keyCode===88||e.keyCode===69))||
      e.keyCode===123
    ){e.preventDefault();e.stopPropagation();return false}
  },true)

  document.addEventListener('contextmenu',function(e){e.preventDefault();return false},true)

  document.addEventListener('selectstart',function(e){
    const t=e.target
    if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.closest('.msg.user')||t.closest('.msg.assistant')))return true
    e.preventDefault();return false
  })

  let _devOpen=false
  function _checkDevTools(){_devOpen=false}



  const _noop=function(){}
  try{
    Object.defineProperty(window,'console',{
      get:function(){_checkDevTools();return{log:_noop,warn:_noop,error:_noop,info:_noop,debug:_noop,table:_noop,dir:_noop,group:_noop,groupEnd:_noop,time:_noop,timeEnd:_noop,clear:_noop,trace:_noop,assert:_noop}},
      configurable:false,enumerable:false
    })
  }catch(e){}

  const _origInnerHTML=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML')
  function _sanitize(html){
    if(typeof html!=='string')return html
    return html
      .replace(/<script[\s\S]*?<\/script>/gi,'')
      .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi,'')
      .replace(/javascript\s*:/gi,'')
      .replace(/vbscript\s*:/gi,'')
      .replace(/data\s*:\s*text\/html/gi,'')
  }
  try{
    Object.defineProperty(Element.prototype,'innerHTML',{
      set:function(val){_origInnerHTML.set.call(this,_sanitize(String(val)))},
      get:function(){return _origInnerHTML.get.call(this)},
      configurable:true
    })
  }catch(e){}

  const _criticalFns=['isDeveloperAccount','getDeveloperAccounts','getRemainingLimit','consumeLimit','getLimitData','saveLimitData','_limitSign','_limitVerify','_nukeLimitData','_devIntegrityCheck']
  _criticalFns.forEach(function(fnName){
    try{
      const _orig=window[fnName]
      if(typeof _orig==='function'){
        Object.defineProperty(window,fnName,{
          get:function(){return _orig},
          set:function(v){
            _checkDevTools()
          },
          configurable:false,enumerable:false
        })
      }
    }catch(e){}
  })

  const _origLS_get=Storage.prototype.getItem
  let _tamperStrikes=0
  const _origLS_get2=window.localStorage.__proto__.getItem
  ;(function(){
    const _monitoredKeys=new RegExp('Javanese_limit|Javanese_device|nklm_')
    const _origSet=localStorage.__proto__.setItem
    const _origRemove=localStorage.__proto__.removeItem
    try{
      const _lsProto=Storage.prototype
      const _realSetItem=_lsProto.setItem.bind(localStorage)
    }catch(e){}
  })()

  try{
    Object.defineProperty(window,'DAILY_LIMIT',{
      get:function(){return 10},
      set:function(){},
      configurable:false,enumerable:false
    })
  }catch(e){}





})()

