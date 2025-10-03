import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

// Company Information
const COMPANY_INFO = {
  name: "ESIM MYANMAR COMPANY LIMITED",
  address: "Parami Road, No-70/A, Ward (16), Hlaing Township, Yangon, Myanmar",
  phone: "(+95) 96 50000172",
  website: "https://www.esim.com.mm",
  email: "info@esim.com.mm"
};

const Home = () => {
  const checkApiHealth = async () => {
    try {
      const response = await axios.get(`${API}/health`);
      console.log('API Health:', response.data);
    } catch (e) {
      console.error('API Health Check Failed:', e);
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">eSIM Myanmar</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-indigo-600">Home</a>
              <a href="#services" className="text-gray-700 hover:text-indigo-600">Services</a>
              <a href="#about" className="text-gray-700 hover:text-indigo-600">About</a>
              <a href="#contact" className="text-gray-700 hover:text-indigo-600">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Digital SIM Cards for Myanmar
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant mobile connectivity in Myanmar with our eSIM technology. 
            No physical SIM card needed - activate in minutes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Get eSIM Now
            </button>
            <button className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
              Check Compatibility
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Our eSIM Plans</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-4">Tourist Plan</h4>
              <p className="text-3xl font-bold text-indigo-600 mb-4">$15 <span className="text-sm text-gray-500">/7 days</span></p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ 5GB High-Speed Data</li>
                <li>✓ Nationwide Coverage</li>
                <li>✓ Instant Activation</li>
              </ul>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-200">
              <h4 className="text-xl font-semibold mb-4">Business Plan</h4>
              <p className="text-3xl font-bold text-indigo-600 mb-4">$35 <span className="text-sm text-gray-500">/30 days</span></p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ 20GB High-Speed Data</li>
                <li>✓ Premium Network</li>
                <li>✓ 24/7 Support</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-4">Extended Stay</h4>
              <p className="text-3xl font-bold text-indigo-600 mb-4">$85 <span className="text-sm text-gray-500">/90 days</span></p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ 50GB High-Speed Data</li>
                <li>✓ Renewable</li>
                <li>✓ Best Value</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">About {COMPANY_INFO.name}</h3>
              <p className="text-gray-600 mb-4">
                We are Myanmar's leading eSIM provider, offering digital SIM card solutions 
                for travelers, businesses, and locals. Our mission is to provide seamless 
                mobile connectivity across Myanmar.
              </p>
              <p className="text-gray-600">
                With nationwide coverage and instant activation, we make staying connected 
                in Myanmar easier than ever before.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-semibold mb-4">Contact Information</h4>
              <div className="space-y-3 text-gray-600">
                <p><strong>Address:</strong> {COMPANY_INFO.address}</p>
                <p><strong>Phone:</strong> {COMPANY_INFO.phone}</p>
                <p><strong>Email:</strong> {COMPANY_INFO.email}</p>
                <p><strong>Website:</strong> {COMPANY_INFO.website}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">eSIM Myanmar</h5>
              <p className="text-gray-400 text-sm">
                Digital SIM cards for seamless connectivity in Myanmar.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Tourist eSIM Plans</li>
                <li>Business Solutions</li>
                <li>Device Compatibility</li>
                <li>24/7 Support</li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibent mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Installation Guide</li>
                <li>FAQ</li>
                <li>Contact Support</li>
                <li>Troubleshooting</li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
                <li>Regulatory Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 {COMPANY_INFO.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
