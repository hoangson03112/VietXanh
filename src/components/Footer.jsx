import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Leaf,
  Recycle,
  Award,
} from "lucide-react";

// TikTok Icon Component
const TikTokIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative pt-16 md:pt-20 pb-8 overflow-hidden bg-gradient-to-b from-[#E8F5A8] via-[#B8D9C4] to-[#7FB996]">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-36 xl:gap-24 mb-10 md:mb-12">
          {/* Logo và mô tả */}
          <div className="lg:col-span-4">
            <img
              src="/logo.png"
              alt="Việt Xanh"
              className="h-20 md:h-40 w-auto mb-4"
            />
            <p
              className="text-sm md:text-base leading-relaxed mb-6"
              style={{ color: "rgba(49, 87, 44, 0.85)" }}
            >
              Việt Xanh cung cấp các sản phẩm túi, bao bì và đồ dùng phân hủy
              sinh học từ tinh bột ngô, thân thiện với môi trường.
            </p>
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#5A9A7A] flex items-center justify-center cursor-pointer hover:bg-[#4B9D7E] transition-all hover:scale-110">
                <Facebook size={18} className="text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#5A9A7A] flex items-center justify-center cursor-pointer hover:bg-[#4B9D7E] transition-all hover:scale-110">
                <Instagram size={18} className="text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#5A9A7A] flex items-center justify-center cursor-pointer hover:bg-[#4B9D7E] transition-all hover:scale-110">
                <TikTokIcon size={18} className="text-white" />
              </div>
            </div>
            {/* Eco Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full">
              <Leaf
                className="w-4 h-4"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                100% Eco-Friendly
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 lg:mt-16 xl:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 lg:gap-32">
            {/* Về chúng tôi */}
            <div className="">
              <h4
                className="font-bold mb-5 text-lg flex items-center gap-2"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                Về chúng tôi
              </h4>
              <ul
                className="space-y-3 text-sm md:text-base"
                style={{ color: "rgba(49, 87, 44, 0.85)" }}
              >
                <li className="hover:text-[#4B9D7E] transition-colors cursor-pointer hover:translate-x-1 transition-transform">
                  <Link to="/">Giới thiệu công ty</Link>
                </li>
                <li className="hover:text-[#4B9D7E] transition-colors cursor-pointer hover:translate-x-1 transition-transform">
                  <Link to="/">Tầm nhìn & Sứ mệnh</Link>
                </li>
                <li className="hover:text-[#4B9D7E] transition-colors cursor-pointer hover:translate-x-1 transition-transform">
                  <Link to="/">Đội ngũ của chúng tôi</Link>
                </li>
                <li className="hover:text-[#4B9D7E] transition-colors cursor-pointer hover:translate-x-1 transition-transform">
                  <Link to="/">Chứng nhận & Giải thưởng</Link>
                </li>
                <li className="hover:text-[#4B9D7E] transition-colors cursor-pointer hover:translate-x-1 transition-transform">
                  <Link to="/">Tuyển dụng</Link>
                </li>
              </ul>
            </div>

            {/* Sản phẩm & Dịch vụ */}
            <div>
              <h4
                className="font-bold mb-5 text-lg"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                Sản phẩm & Dịch vụ
              </h4>
              <ul
                className="space-y-3 text-sm md:text-base"
                style={{ color: "rgba(49, 87, 44, 0.85)" }}
              >
                <li className="hover:text-[#4B9D7E] transition-colors cursor-pointer hover:translate-x-1 transition-transform">
                  <Link to="/">Túi phân hủy sinh học</Link>
                </li>
                <li className="hover:text-[#4B9D7E] transition-colors cursor-pointer hover:translate-x-1 transition-transform">
                  <Link to="/">Bao bì thân thiện</Link>
                </li>
                <li className="hover:text-[#4B9D7E] transition-colors cursor-pointer hover:translate-x-1 transition-transform">
                  <Link to="/">Đồ dùng sinh học</Link>
                </li>
                <li className="hover:text-[#4B9D7E] transition-colors cursor-pointer hover:translate-x-1 transition-transform">
                  <Link to="/">Giải pháp doanh nghiệp</Link>
                </li>
                <li className="hover:text-[#4B9D7E] transition-colors cursor-pointer hover:translate-x-1 transition-transform">
                  <Link to="/">Tư vấn môi trường</Link>
                </li>
              </ul>
            </div>

            {/* Liên hệ */}
            <div>
              <h4
                className="font-bold mb-5 text-lg"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                Liên hệ
              </h4>
              <ul
                className="space-y-4 text-sm md:text-base"
                style={{ color: "rgba(49, 87, 44, 0.85)" }}
              >
                <li className="flex items-start gap-3">
                  <MapPin
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: "rgba(49, 87, 44, 1)" }}
                  />
                  <span>Huyện Tam Nông, Tỉnh Phú Thọ, Vietnam</span>
                </li>
                <li className="flex items-center gap-3 hover:text-[#4B9D7E] transition-colors cursor-pointer">
                  <Phone
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "rgba(49, 87, 44, 1)" }}
                  />
                  <span>0399 557 326</span>
                </li>
                <li className="flex items-center gap-3 hover:text-[#4B9D7E] transition-colors cursor-pointer">
                  <Mail
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "rgba(49, 87, 44, 1)" }}
                  />
                  <span>vietxanh662025@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: "rgba(49, 87, 44, 0.25)" }}
        >
          <p
            className="text-sm text-center md:text-left"
            style={{ color: "rgba(49, 87, 44, 0.75)" }}
          >
            Copyright © 2025 Viet Xanh. All Rights Reserved
          </p>
          <div
            className="flex gap-6 text-sm"
            style={{ color: "rgba(49, 87, 44, 0.75)" }}
          >
            <Link to="/" className="hover:text-[#4B9D7E] transition-colors">
              Chính sách bảo mật
            </Link>
            <Link to="/" className="hover:text-[#4B9D7E] transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link to="/" className="hover:text-[#4B9D7E] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
