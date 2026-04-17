export function LandingPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 gap-4">
      <h1 className="font-daruma text-6xl text-indigo-400 tracking-wider">
        LENTERA
      </h1>
      <p className="font-poppins text-zinc-400">
        Sistem Pelaporan Infrastruktur Kota Bandung.
      </p>

      <a
        href="/app"
        className="mt-4 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors"
      >
        Masuk ke Peta
      </a>
    </div>
  );
}
