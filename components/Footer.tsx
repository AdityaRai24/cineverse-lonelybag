import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start border-b border-gray-700 pb-6">
          
          {/* Logo & About */}
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-white">CineVerse</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-sm">
              Your ultimate destination for movie magic. Explore top-rated films and timeless classics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li><a href="#" className="hover:text-yellow-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Trending</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Genres</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4 mt-3">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-xl">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition text-xl">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} CineVerse. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
