import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#2C241E] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image src="/logo-t.png" alt="Südpfote" width={140} height={46} />
            </div>
            <p className="text-[#A89888] max-w-sm mb-6">
              Premium Produkte für Linkshänder. Weil 10% der Welt auch 100% verdienen.
            </p>
            <div className="flex gap-3">
              <span className="px-3 py-1 bg-[#3D3329] rounded text-xs text-[#A89888]">Visa</span>
              <span className="px-3 py-1 bg-[#3D3329] rounded text-xs text-[#A89888]">Mastercard</span>
              <span className="px-3 py-1 bg-[#3D3329] rounded text-xs text-[#A89888]">PayPal</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-[#A89888]">
              <li><Link href="/#produkte" className="hover:text-white transition">Alle Produkte</Link></li>
              <li><Link href="/#produkte" className="hover:text-white transition">Bestseller</Link></li>
              <li><Link href="/#produkte" className="hover:text-white transition">Neu eingetroffen</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Über uns</h4>
            <ul className="space-y-2 text-[#A89888]">
              <li><Link href="/story" className="hover:text-white transition">Unsere Story</Link></li>
              <li><Link href="/#faq" className="hover:text-white transition">FAQ</Link></li>
              <li><a href="mailto:hallo@suedpfote.de" className="hover:text-white transition">Kontakt</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-[#A89888]">
              <li><Link href="/impressum" className="hover:text-white transition">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-white transition">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-white transition">AGB</Link></li>
              <li><Link href="/widerruf" className="hover:text-white transition">Widerruf</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-[#3D3329] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#8B7E74]">
            © 2026 Südpfote. Alle Rechte vorbehalten.
          </p>
          <p className="text-sm text-[#8B7E74]">
            Made with 💜 by Fabian & Nyx 🦞
          </p>
        </div>
      </div>
    </footer>
  );
}
