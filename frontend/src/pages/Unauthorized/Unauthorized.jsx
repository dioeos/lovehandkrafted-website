export default function Unauthorized({
  code = 404,
  title = "SORRY, THERE'S NOTHING HERE",
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#f4f0ea] overflow-hidden text-[#0a0a0a]">
      {/* Subtle vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 20%, rgba(230,57,70,0.05), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="flex items-center gap-3 md:gap-6 select-none">
          <BigDigit>4</BigDigit>
          <BigDigit>0</BigDigit>
          <BigDigit>4</BigDigit>
        </div>

        <h2 className="mt-6 uppercase tracking-[0.15em] text-xl md:text-2xl satoshi">
          SORRY, THERE'S <span className="text-[#e63946]">NOTHING HERE</span>
        </h2>

        <a href="/">
          <button className="mt-8 px-6 py-2 rounded-xl uppercase text-xs tracking-widest bg-[#0a0a0a] text-[#f4f0ea] hover:bg-[#2e2e2e] transition">
            Go Home
          </button>
        </a>

        <p className="mt-4 text-[11px] text-[#0a0a0a]/60 tracking-wider">
          If you think this is a mistake, contact support and mention code{" "}
          {code}.
        </p>
      </div>
    </section>
  );
}

function BigDigit({ children }) {
  return (
    <span className="font-extrabold text-[9rem] leading-none md:text-[14rem] text-[#0a0a0a] drop-shadow-[0_0_8px_rgba(0,0,0,0.05)]">
      {children}
    </span>
  );
}
