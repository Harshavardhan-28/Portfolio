export default function Footer() {
  return (
    <footer className="bg-[#050505] text-white relative overflow-hidden pt-20 pb-10 z-20">

      {/* 1. The Massive Slogan Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none opacity-20 md:opacity-90">
        <h1 className="text-[15vw] leading-[0.8] font-black uppercase text-[#1a1a1a] whitespace-nowrap">
          Always <span className="text-[#00ff41] glow-text">Building</span>
        </h1>
        <h1 className="text-[15vw] leading-[0.8] font-black uppercase text-[#1a1a1a] whitespace-nowrap pl-[20vw]">
          The Future
        </h1>
      </div>

      {/* Gradient vignette to fade out sides */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#050505]/60 via-transparent via-40% to-[#050505]"></div>

      {/* 2. The Content Layer (On top of text) */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center h-[60vh]">

        {/* Left Links */}
        <div className="flex flex-col space-y-4 text-center md:text-left order-2 md:order-1">
          <a href="#" className="text-2xl font-black uppercase hover:text-[#00ff41] transition-colors">Home</a>
          <a href="#" className="text-2xl font-black uppercase hover:text-[#00ff41] transition-colors">Work</a>
          <a href="#" className="text-2xl font-black uppercase hover:text-[#00ff41] transition-colors">About</a>
          <a href="#" className="text-2xl font-black uppercase hover:text-[#00ff41] transition-colors">Contact</a>
        </div>

        {/* Centerpiece (The Helmet/Object) */}
        {/* You can put a static image of your 3D object here */}
        <div className="order-1 md:order-2 mb-10 md:mb-0 relative group cursor-pointer">
            <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-b from-[#00ff41]/20 to-transparent blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:bg-[#00ff41]/40 transition-all duration-500"></div>
            {/* Replace this div with an <Image /> of your helmet/logo */}
            <div className="w-[200px] h-[200px] bg-black border border-[#00ff41] rounded-full flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(0,255,65,0.2)]">
                <span className="text-4xl">🚀</span>
            </div>
        </div>

        {/* Right Socials */}
        <div className="flex flex-col space-y-4 text-center md:text-right order-3">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-4 font-bold">Socials</p>
          <a href="https://www.linkedin.com/in/harshavardhan-khamkar/" className="text-xl font-black uppercase hover:text-[#00ff41] transition-colors text-white">LinkedIn</a>
          <a href="#" className="text-xl font-black uppercase hover:text-[#00ff41] transition-colors text-white">Twitter</a>
          <a href="#" className="text-xl font-black uppercase hover:text-[#00ff41] transition-colors text-white">Instagram</a>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="container mx-auto px-6 mt-20 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-widest">
        <p>&copy; 2026 Creative Developer.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
        </div>
      </div>
    </footer>
  );
}
