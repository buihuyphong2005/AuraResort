import React from 'react';
import { Compass, Phone, Mail, MapPin, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-stone-950 font-bold">
                <Compass className="w-5 h-5 text-stone-950" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-stone-100">
                AURA<span className="text-amber-400 font-light italic">Resort</span>
              </span>
            </div>
            
            <p className="text-stone-400 leading-relaxed max-w-sm">
              Hệ thống chuỗi 6 khu nghỉ dưỡng thượng lưu trải dọc chiều dài Việt Nam. Tôn vinh vẻ đẹp thiên nhiên kỳ vĩ, kiến trúc bản địa tinh tế và dịch vụ hiếu khách chuẩn mực 5 sao quốc tế.
            </p>

            <div className="pt-2 flex items-center gap-4 text-stone-500 text-xs">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Chuẩn 5 Sao Quốc Tế</span>
              <span className="flex items-center gap-1"><CreditCard className="w-4 h-4 text-amber-500" /> PCI-DSS Bảo Mật</span>
            </div>
          </div>

          {/* Col 2: 6 Branches */}
          <div>
            <h4 className="font-bold text-stone-100 uppercase tracking-wider mb-4 text-[11px]">
              Chi Nhánh Nghỉ Dưỡng
            </h4>
            <ul className="space-y-2.5">
              <li><span className="hover:text-amber-400 transition-colors">Aura Danang Ocean Sanctuary</span></li>
              <li><span className="hover:text-amber-400 transition-colors">Aura Sapa Misty Peak Retreat</span></li>
              <li><span className="hover:text-amber-400 transition-colors">Aura Hoi An Ancient Heritage</span></li>
              <li><span className="hover:text-amber-400 transition-colors">Aura Phu Quoc Emerald Island</span></li>
              <li><span className="hover:text-amber-400 transition-colors">Aura Dalat Pine Forest Manor</span></li>
              <li><span className="hover:text-amber-400 transition-colors">Aura Ninh Binh Karst Valley</span></li>
            </ul>
          </div>

          {/* Col 3: Dịch vụ & Trải nghiệm */}
          <div>
            <h4 className="font-bold text-stone-100 uppercase tracking-wider mb-4 text-[11px]">
              Dịch Vụ & Trải Nghiệm
            </h4>
            <ul className="space-y-2.5">
              <li><span className="hover:text-amber-400 transition-colors">Đặt phòng trực tuyến 24/7</span></li>
              <li><span className="hover:text-amber-400 transition-colors">Aura Loyalty Club & Tích điểm</span></li>
              <li><span className="hover:text-amber-400 transition-colors">Tour di sản & trải nghiệm văn hoá</span></li>
              <li><span className="hover:text-amber-400 transition-colors">Onsen & Spa Thảo dược cổ truyền</span></li>
              <li><span className="hover:text-amber-400 transition-colors">Đưa đón sân bay hạng thương gia</span></li>
              <li><span className="hover:text-amber-400 transition-colors">Trợ lý du lịch ảo Aura Concierge</span></li>
            </ul>
          </div>

          {/* Col 4: Liên hệ & Hỗ trợ 24/7 */}
          <div>
            <h4 className="font-bold text-stone-100 uppercase tracking-wider mb-4 text-[11px]">
              Tổng Đài Chăm Sóc 24/7
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span className="text-stone-200 font-bold text-sm">1900 8899</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>concierge@auraresort.vn</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed pt-1">
                Trụ sở chính: Tầng 28, Tòa tháp Aura Landmark, Võ Nguyên Giáp, Đà Nẵng, Việt Nam.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500">
          <p>© {new Date().getFullYear()} AuraResort Hospitality Group. Bản quyền thuộc về AuraResort Việt Nam.</p>
          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <span className="hover:text-stone-400 cursor-pointer">Điều khoản dịch vụ</span>
            <span className="hover:text-stone-400 cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:text-stone-400 cursor-pointer">Quy định nhận trả phòng</span>
            {onNavigate && (
              <button
                onClick={() => onNavigate('admin')}
                className="text-amber-400/80 hover:text-amber-400 cursor-pointer flex items-center gap-1 font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cổng Quản Trị Hệ Thống</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
