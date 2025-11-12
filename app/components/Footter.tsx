import React from "react";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  ChevronRight,
  Users,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#743C1D] text-white relative overflow-hidden">
      {/* Partnership Section */}
      <div className="bg-[#5E2F15]">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Users className="w-6 h-6 text-[#F9E3C3]" />
            <h3 className="text-xl font-bold text-[#F9E3C3]">
              Research Partnership
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <img
                src="/logos/seal-4c-600x600-min.jpg"
                className="w-16 h-16 rounded-full bg-white p-2"
              />
              <h4 className="font-semibold mt-3 text-[#F9E3C3]">
                Carnegie Mellon University
              </h4>
              <p className="text-xs text-[#EBC9A1]">Pittsburgh, USA</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/logos/cmu-africa-logo.png"
                className="w-16 h-16 rounded-full bg-white p-2"
              />
              <h4 className="font-semibold mt-3 text-[#F9E3C3]">
                Carnegie Mellon Africa
              </h4>
              <p className="text-xs text-[#EBC9A1]">Kigali, Rwanda</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/logos/FintechHubLogo.png"
                className="w-16 h-16 rounded-full bg-white p-2"
              />
              <h4 className="font-semibold mt-3 text-[#F9E3C3]">
                University of the Witwatersrand
              </h4>
              <p className="text-xs text-[#EBC9A1]">
                Johannesburg, South Africa
              </p>
            </div>
          </div>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#8C5632] rounded-lg">
            <img src="/logos/06-18-afretec.png" className="w-6 h-6" />
            <span className="text-sm font-medium">
              Proudly Funded by AFRETEC NETWORK
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#5E2F15] text-[#EBC9A1] border-t border-[#8C5632]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm">
          <p>&copy; 2025 African Fintech Index — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
