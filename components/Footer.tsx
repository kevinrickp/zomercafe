export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-gray-300 py-8 px-6 mt-16 animate-fade-in-up">
      <div className="max-w-7xl mx-auto text-center space-y-2">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-orange-400">Zomer Cafe</span>. All rights reserved.
        </p>
        <p className="text-xs text-zinc-400">Crafted with ☕ and ❤️ for your perfect hangout experience.</p>
      </div>
    </footer>
  );
}
