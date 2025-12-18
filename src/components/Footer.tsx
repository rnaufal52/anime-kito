export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-black py-8">
      <div className="container mx-auto px-4 text-center">
        <h3 className="mb-2 text-lg font-bold text-primary">ANIMEKITO</h3>
        <p className="mb-4 text-sm text-gray-500">
            All the posts on this website are the property of their respective owners.
        </p>
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} AnimeKito. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
