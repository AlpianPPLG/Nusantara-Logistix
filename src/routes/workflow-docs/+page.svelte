<script lang="ts">
	import {
		Workflow,
		Boxes,
		ShieldCheck,
		Layers,
		CheckCircle2,
		ArrowRight,
		FileCode,
		Database,
		Zap
	} from '@lucide/svelte';
</script>

<div class="space-y-8 animate-in fade-in duration-300 max-w-5xl">
	<!-- Page Header -->
	<div>
		<div class="flex items-center gap-2">
			<h2 class="text-2xl font-extrabold text-white tracking-tight">
				Dokumentasi Arsitektur & Alur Sistem
			</h2>
			<span class="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20">
				Spesifikasi Analisis UML
			</span>
		</div>
		<p class="text-xs text-slate-400 mt-1">
			Referensi rancangan sistem terintegrasi berdasarkan dokumen analisis di <code>docs/Analisis_Sistem_Gudang/</code>.
		</p>
	</div>

	<!-- Trend 2026 Tech Stack Highlights -->
	<div class="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl space-y-4">
		<div class="flex items-center gap-3 pb-3 border-b border-slate-800">
			<div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black">
				<Zap class="w-5 h-5 text-slate-950" />
			</div>
			<div>
				<h3 class="text-base font-bold text-white">Trend Tech Stack 2026: Svelte 5 + Drizzle + SQLite</h3>
				<p class="text-xs text-slate-400">Solusi super ringan pengganti framework monolithic yang berat</p>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
			<div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
				<span class="text-xs font-bold text-amber-400 font-mono">1. Svelte 5 Runes</span>
				<p class="text-xs text-slate-300">
					Menggunakan <code>$state</code>, <code>$derived</code>, dan <code>$props</code> tanpa Virtual DOM. Sangat cepat, ukuran bundle sangat kecil, dan bebas overhead Server Components.
				</p>
			</div>

			<div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
				<span class="text-xs font-bold text-emerald-400 font-mono">2. Drizzle ORM + LibSQL</span>
				<p class="text-xs text-slate-300">
					Type-safe query builder tanpa binary berat Prisma. Database SQLite lokal tersimpan rapi di <code>local.db</code>, membuat prototipe dinamis dan persisten tanpa perlu install database server berat.
				</p>
			</div>

			<div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
				<span class="text-xs font-bold text-cyan-400 font-mono">3. Tailwind v4 & Bits UI</span>
				<p class="text-xs text-slate-300">
					Engine styling terbaru yang terkompilasi secepat kilat dengan palet warna enterprise (dark-mode glassmorphism, badge status presisi).
				</p>
			</div>
		</div>
	</div>

	<!-- 4 Pilar Aktor / Role Sistem -->
	<div class="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl space-y-5">
		<div class="flex items-center gap-2.5 pb-3 border-b border-slate-800">
			<ShieldCheck class="w-5 h-5 text-indigo-400" />
			<h3 class="text-base font-bold text-white">Matriks Hak Akses & Pembagian Role (4 Pilar)</h3>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div class="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold text-amber-400">📦 Staf / Kepala Gudang (Warehouse)</span>
					<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">Operasional</span>
				</div>
				<ul class="text-xs text-slate-300 space-y-1 list-disc list-inside">
					<li>Memantau saldo stok & lokasi rak barang</li>
					<li>Menerima notifikasi otomatis saat stok mencapai Safety Stock</li>
					<li>Menerbitkan <strong>Purchase Requisition (PR)</strong></li>
					<li>Memeriksa kiriman vendor & menginput <strong>Goods Receipt (GR)</strong></li>
				</ul>
			</div>

			<div class="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold text-blue-400">🛒 Staf Pengadaan (Purchasing)</span>
					<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">Procurement</span>
				</div>
				<ul class="text-xs text-slate-300 space-y-1 list-disc list-inside">
					<li>Menerima dan mereview PR dari staf gudang</li>
					<li>Memilih vendor rekanan berdasarkan rating & penawaran</li>
					<li>Mengonversi PR menjadi <strong>Purchase Order (PO)</strong></li>
					<li>Meneruskan PO ke Finance Manager untuk persetujuan</li>
				</ul>
			</div>

			<div class="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold text-emerald-400">💳 Manager Keuangan (Finance)</span>
					<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Approval & Audit</span>
				</div>
				<ul class="text-xs text-slate-300 space-y-1 list-disc list-inside">
					<li>Menyetujui / menolak Purchase Order (Approval Workflow)</li>
					<li>Menjalankan <strong>3-Way Matching Engine</strong> (PO vs GR vs Faktur)</li>
					<li>Mencegah pembayaran faktur palsu atau barang yang belum tiba</li>
					<li>Otorisasi pembayaran invoice vendor</li>
				</ul>
			</div>

			<div class="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold text-purple-400">⚡ Super Administrator (Admin)</span>
					<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">Sistem</span>
				</div>
				<ul class="text-xs text-slate-300 space-y-1 list-disc list-inside">
					<li>Kelola akun pengguna, master kategori, dan master vendor</li>
					<li>Akses menyeluruh terhadap seluruh modul</li>
					<li>Reset database demo / re-seed data transaksional</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- Alur End-to-End Siklus Transaksi (Interactive Timeline) -->
	<div class="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl space-y-5">
		<div class="flex items-center gap-2.5 pb-3 border-b border-slate-800">
			<Workflow class="w-5 h-5 text-emerald-400" />
			<h3 class="text-base font-bold text-white">Siklus Alur Lengkap Transaksi (End-to-End Workflow)</h3>
		</div>

		<div class="space-y-4">
			<div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-850">
				<span class="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
				<div>
					<h4 class="text-xs font-bold text-white">Stok Gudang Menipis $\rightarrow$ Terbit Notifikasi & PR</h4>
					<p class="text-xs text-slate-400 mt-0.5">
						Saat saldo inventori melewati batas minimum, staf gudang membuat pengajuan <em>Purchase Requisition (PR)</em>.
					</p>
				</div>
			</div>

			<div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-850">
				<span class="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
				<div>
					<h4 class="text-xs font-bold text-white">Purchasing Review PR $\rightarrow$ Dikonversi ke PO</h4>
					<p class="text-xs text-slate-400 mt-0.5">
						Staf Purchasing meninjau PR, memilih vendor rekanan berperingkat tinggi, dan menerbitkan <em>Purchase Order (PO)</em>.
					</p>
				</div>
			</div>

			<div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-850">
				<span class="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
				<div>
					<h4 class="text-xs font-bold text-white">Finance Manager Melakukan Approval PO</h4>
					<p class="text-xs text-slate-400 mt-0.5">
						Finance memeriksa kesesuaian anggaran belanja. Jika disetujui, PO berstatus <code>APPROVED</code> dan dikirim ke vendor.
					</p>
				</div>
			</div>

			<div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-850">
				<span class="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
				<div>
					<h4 class="text-xs font-bold text-white">Vendor Kirim Barang $\rightarrow$ Input Goods Receipt di Gudang</h4>
					<p class="text-xs text-slate-400 mt-0.5">
						Truk tiba membawa Surat Jalan. Staf gudang menghitung fisik barang dan menginput <em>Goods Receipt (GR)</em>. Saldo inventori <strong>otomatis bertambah</strong> secara riil.
					</p>
				</div>
			</div>

			<div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-850">
				<span class="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">5</span>
				<div>
					<h4 class="text-xs font-bold text-white">Finance Verifikasi 3-Way Match & Otorisasi Bayar</h4>
					<p class="text-xs text-slate-400 mt-0.5">
						Sistem mencocokkan PO vs GR vs Faktur Vendor. Jika cocok 100%, pembayaran dicairkan dan transaksi selesai tuntas.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
