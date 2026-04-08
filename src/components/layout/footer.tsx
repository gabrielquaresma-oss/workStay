export function Footer() {
  return (
    <footer className="bg-[#E0E8F0] text-[#1D6FA4] text-[11px] py-[18px] px-6 flex items-center justify-between">
      <span>&copy; 2025 Onfly. Todos os direitos reservados.</span>
      <div className="flex gap-4">
        <a href="#" className="text-[#1D6FA4] font-medium hover:text-[#0057C2] transition-colors">
          Politica de privacidade
        </a>
        <a href="#" className="text-[#1D6FA4] font-medium hover:text-[#0057C2] transition-colors">
          Termos de uso
        </a>
      </div>
    </footer>
  );
}
