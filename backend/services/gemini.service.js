import { GoogleGenAI } from '@google/genai';
import { initialHotels, initialPromotions, initialTourismSpots, initialRooms } from '../data/seedData.js';
import { HotelModel } from '../models/hotel.model.js';
import { RoomModel } from '../models/room.model.js';

let aiClient = null;
let runtimeApiKey = null;

function getAIClient() {
  const apiKey = runtimeApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || !apiKey.trim()) {
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey.trim()
      });
    } catch (err) {
      console.warn('Failed to construct GoogleGenAI instance:', err.message);
      return null;
    }
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
Bạn là Aura Concierge - Trợ lý du lịch và chuyên viên chăm sóc khách hàng 24/7 của chuỗi khách sạn nghỉ dưỡng cao cấp AuraResort Vietnam.

Chuỗi có 6 chi nhánh sang trọng tại Việt Nam:
1. Aura Danang Ocean Sanctuary (Đà Nẵng - Biển Mỹ Khê & Bán đảo Sơn Trà, từ 2.450.000đ/đêm)
2. Aura Sapa Misty Peak Retreat (Sa Pa - Thung lũng Mường Hoa, săn mây, tắm lá thuốc Dao Đỏ, từ 2.850.000đ/đêm)
3. Aura Hoi An Ancient Heritage (Hội An - Bên dòng sông Hoài, thả hoa đăng, làm lồng đèn, từ 2.150.000đ/đêm)
4. Aura Phu Quoc Emerald Island (Phú Quốc - Bãi Dài biển ngọc, ngắm hoàng hôn, biệt thự hồ bơi riêng, từ 3.200.000đ/đêm)
5. Aura Dalat Pine Forest Manor (Đà Lạt - Hồ Tuyền Lâm mộng mơ, dinh thự kiểu Pháp giữa rừng thông, từ 2.300.000đ/đêm)
6. Aura Ninh Binh Karst Valley (Ninh Bình - Tràng An & Tam Cốc Bích Động, non nước hữu tình, từ 2.600.000đ/đêm)

Chính sách & Tiện ích:
- Nhận phòng: từ 14:00 (Hội viên Gold/Diamond được nhận sớm từ 10:00).
- Trả phòng: trước 12:00 (Hội viên được trả muộn đến 16:00).
- Thanh toán: Hỗ trợ VNPAY QR, Ví MoMo, Thẻ tín dụng quốc tế Visa/MasterCard, VietQR NAPAS 24/7.
- Khách hàng thân thiết: 4 hạng thẻ Đồng (Bronze - giảm 5-15%), Bạc (Silver - giảm 10-20%), Vàng (Gold - giảm 25% + buffet sáng + spa 500k), Kim Cương (Diamond - đặc quyền đưa đón sân bay riêng & quản gia 24/7).
- Mã khuyến mãi hiện hành: AURA15 (giảm 15% hội viên mới), VIPGOLD25 (giảm 25% cho VIP Gold/Diamond), SUMMEROASIS (giảm 20% du lịch biển), MISTYRETREAT (giảm 12% Tây Bắc & Ninh Bình).

Nhiệm vụ của bạn:
- Trả lời ân cần, lịch thiệp, ấm áp, đậm tinh thần hiếu khách Việt Nam cao cấp.
- Tư vấn chi tiết phòng nghỉ phù hợp cho gia đình, cặp đôi, nhóm bạn dựa trên ngân sách và địa điểm.
- Gợi ý các trải nghiệm văn hóa địa phương độc đáo, quán ăn đặc sản, thời điểm ngắm cảnh đẹp nhất.
- Hướng dẫn thủ tục đặt phòng, áp dụng mã ưu đãi và thanh toán trực tuyến.
- Định dạng câu trả lời bằng Markdown đẹp mắt (dùng tiêu đề, in đậm **text**, danh sách gạch đầu dòng rõ ràng).
`;

export const GeminiService = {
  async chatWithConcierge(message, chatHistory = []) {
    const ai = getAIClient();

    if (ai) {
      const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const modelName of modelsToTry) {
        try {
          const contents = [];

          // Format chat history for Google Gen AI SDK
          // Note: contents array MUST start with a 'user' role turn!
          if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
            const validHistory = chatHistory.filter(h => h && h.text && typeof h.text === 'string' && h.text.trim());
            const firstUserIdx = validHistory.findIndex(h => h.sender === 'user');
            
            if (firstUserIdx !== -1) {
              validHistory.slice(firstUserIdx).forEach(h => {
                contents.push({
                  role: h.sender === 'user' ? 'user' : 'model',
                  parts: [{ text: h.text.trim() }]
                });
              });
            }
          }

          // Add current message
          contents.push({
            role: 'user',
            parts: [{ text: message.trim() }]
          });

          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7
            }
          });

          const reply = response.text;
          if (reply && reply.trim()) {
            return {
              reply: reply.trim(),
              source: 'gemini',
              model: modelName
            };
          }
        } catch (err) {
          console.warn(`Gemini API call with model ${modelName} failed:`, err.message);
        }
      }
    }

    // Intelligent Offline Rule-Based Concierge Engine
    const msg = message.toLowerCase();
    let reply = '';

    if (msg.includes('đà nẵng') || msg.includes('danang') || msg.includes('mỹ khê') || msg.includes('sơn trà')) {
      reply = `🌊 **Aura Danang Ocean Sanctuary** tọa lạc tại 286 Võ Nguyên Giáp, đối diện bãi biển Mỹ Khê huyền thoại.\n\n` +
        `• **Giá khởi điểm:** Từ **2.450.000 VNĐ/đêm** (Đã bao gồm buffet sáng 5 sao).\n` +
        `• **Hạng phòng:** Deluxe Ocean Front (2.450k), Sanctuary Suite Biển Ngọc (4.200k), Biệt Thự Hồ Bơi Riêng Aura Ocean Villa (7.800k).\n` +
        `• **Điểm nổi bật:** Hồ bơi vô cực view biển Mỹ Khê, Spa tắm khoáng Onsen, Nhà hàng hải sản Michelin Selected, Sky Lounge tầng thượng.\n` +
        `• **Trải nghiệm văn hóa lân cận:**\n` +
        `  - Danh thắng Ngũ Hành Sơn & Động Huyền Không (cách 3.2km).\n` +
        `  - Bán đảo Sơn Trà & Ngắm Voọc chà vá chân nâu quý hiếm.\n` +
        `  - Cầu Rồng phun lửa lúc 21h00 thứ Bảy & Chủ Nhật.\n` +
        `• **Mã ưu đãi gợi ý:** Áp dụng mã **AURA15** để giảm ngay 15% khi đặt phòng trực tuyến!`;

    } else if (msg.includes('sa pa') || msg.includes('sapa') || msg.includes('fansipan') || msg.includes('mường hoa') || msg.includes('tây bắc')) {
      reply = `⛰️ **Aura Sapa Misty Peak Retreat** ẩn mình bên thung lũng Mường Hoa thơ mộng.\n\n` +
        `• **Giá khởi điểm:** Từ **2.850.000 VNĐ/đêm**.\n` +
        `• **Hạng phòng:** Premier Mường Hoa (2.850k), Misty Cloud Suite Đỉnh Đèo (5.100k).\n` +
        `• **Điểm nổi bật:** Lò sưởi củi tự nhiên, bồn tắm gỗ pơ-mu ngâm thảo dược người Dao Đỏ, bể bơi nước nóng bốn mùa view thung lũng.\n` +
        `• **Trải nghiệm nét đẹp Tây Bắc:**\n` +
        `  - Dệt thổ cẩm & vẽ sáp ong tại Bản Cát Cát, Tả Van.\n` +
        `  - Thưởng thức tắm lá thuốc cổ truyền giải tỏa mệt mỏi.\n` +
        `  - Chinh phục đỉnh Fansipan 3.143m - Nóc nhà Đông Dương.\n` +
        `• **Mã ưu đãi:** Nhập **MISTYRETREAT** nhận ngay 12% ưu đãi nghỉ dưỡng vùng cao!`;

    } else if (msg.includes('hội an') || msg.includes('hoian') || msg.includes('sông hoài') || msg.includes('phố cổ')) {
      reply = `🏮 **Aura Hoi An Ancient Heritage** nằm thanh bình bên dòng sông Hoài thơ mộng (54 Nguyễn Tri Phương).\n\n` +
        `• **Giá khởi điểm:** Từ **2.150.000 VNĐ/đêm**.\n` +
        `• **Hạng phòng:** Deluxe Cẩm Nam Sông Hoài (2.150k), Heritage Villa Vườn Lụa Cổ Điển (4.800k).\n` +
        `• **Đặc quyền bao gồm:**\n` +
        `  - Thuyền gỗ đưa rước ngắm phố cổ & thả hoa đăng sông Hoài.\n` +
        `  - Lớp học làm đèn lồng thủ công & múa thúng rừng dừa Bảy Mẫu.\n` +
        `  - Xe đạp vi vu đầm rau Trà Quế & thưởng thức Cao Lầu, Bánh Xèo giòn rụm.`;

    } else if (msg.includes('phú quốc') || msg.includes('phu quoc') || msg.includes('bãi dài') || msg.includes('ngọc bích')) {
      reply = `🌴 **Aura Phu Quoc Emerald Island** tại Bãi Dài ngọc bích.\n\n` +
        `• **Giá khởi điểm:** Từ **3.200.000 VNĐ/đêm**.\n` +
        `• **Hạng phòng:** Sunset Ocean View (3.200k), Villa Đảo Ngọc Bể Bơi Riêng 100% (8.900k).\n` +
        `• **Điểm nhấn nghỉ dưỡng:**\n` +
        `  - Bãi biển riêng 800m cát trắng mịn.\n` +
        `  - Rạp chiếu phim bãi biển dưới trời sao & du thuyền ngắm hoàng hôn ngũ sắc.\n` +
        `  - Khám phá vương quốc sao biển Rạch Vẹm & lặn ngắm san hô Nam Đảo.`;

    } else if (msg.includes('đà lạt') || msg.includes('dalat') || msg.includes('hồ tuyền lâm') || msg.includes('rừng thông')) {
      reply = `🌲 **Aura Dalat Pine Forest Manor** - Dinh thự phong cách Indochine Pháp bên Hồ Tuyền Lâm.\n\n` +
        `• **Giá khởi điểm:** Từ **2.300.000 VNĐ/đêm**.\n` +
        `• **Điểm nổi bật:** Lò sưởi hơi nước ấm áp, ban công ngắm rừng thông sương mờ, chèo Sup/Kayak trên hồ Tuyền Lâm, tiệc trà chiều hoàng gia.\n` +
        `• **Mã ưu đãi:** Nhập **AURA15** giảm ngay 15% cho kỳ nghỉ mơ màng Đà Lạt!`;

    } else if (msg.includes('ninh bình') || msg.includes('ninh binh') || msg.includes('tràng an') || msg.includes('tam cốc')) {
      reply = `🏞️ **Aura Ninh Binh Karst Valley** - Tuyệt tác nghỉ dưỡng sinh thái trong thung lũng di sản Tràng An.\n\n` +
        `• **Giá khởi điểm:** Từ **2.600.000 VNĐ/đêm**.\n` +
        `• **Điểm nổi bật:** Bến thuyền riêng đi Tam Cốc - Bích Động, hồ bơi sinh thái giữa vách núi, thưởng thức dê núi đút lò & cơm cháy cổ truyền.\n` +
        `• **Mã ưu đãi:** Nhập **MISTYRETREAT** giảm 12% trọn gói!`;

    } else if (msg.includes('thanh toán') || msg.includes('vnpay') || msg.includes('momo') || msg.includes('chuyển khoản') || msg.includes('vietqr') || msg.includes('ngân hàng') || msg.includes('thẻ')) {
      reply = `💳 **Hệ thống Thanh toán Trực tuyến 24/7 của AuraResort:**\n\n` +
        `1. **VNPAY QR:** Quét mã tức thì qua ứng dụng Mobile Banking của 30+ ngân hàng tại Việt Nam.\n` +
        `2. **Ví MoMo:** Xác nhận thanh toán qua ví điện tử siêu tốc 1-touch.\n` +
        `3. **VietQR / Napas 247:** Chuyển khoản ngân hàng tự động đối soát trong 10 giây.\n` +
        `4. **Thẻ Quốc tế (Visa / MasterCard / JCB):** Bảo mật chuẩn quốc tế PCI-DSS & 3D-Secure.\n\n` +
        `✨ *Ngay sau khi thanh toán thành công, hệ thống tự động phát hành Mã Xác Nhận Đặt Phòng (Booking Code) và Vé Điện Tử (E-Voucher) gửi về Email của quý khách.*`;

    } else if (msg.includes('ưu đãi') || msg.includes('khuyến mãi') || msg.includes('voucher') || msg.includes('mã giảm') || msg.includes('hội viên') || msg.includes('loyalty') || msg.includes('gold') || msg.includes('diamond')) {
      reply = `👑 **Chương trình Khách hàng thân thiết Aura Loyalty Club:**\n\n` +
        `• 🥉 **Hạng Đồng (Bronze):** Giảm **15%** với mã \`AURA15\`.\n` +
        `• 🥈 **Hạng Bạc (Silver):** Giảm **20%** với mã \`SUMMEROASIS\` + Miễn phí bữa sáng.\n` +
        `• 🥇 **Hạng Vàng (Gold):** Giảm **25%** với mã \`VIPGOLD25\` + Check-in sớm 10:00 + Voucher Spa 500.000 VNĐ.\n` +
        `• 💎 **Hạng Kim Cương (Diamond):** Giảm **30%** + Quản gia riêng 24/7 + Đưa đón Limousine sân bay miễn phí.`;

    } else if (msg.includes('nhận phòng') || msg.includes('trả phòng') || msg.includes('check in') || msg.includes('check out') || msg.includes('chính sách') || msg.includes('giờ')) {
      reply = `⏰ **Chính sách Nhận & Trả phòng tại AuraResort:**\n\n` +
        `• **Giờ Nhận phòng (Check-in):** Từ 14:00 (Hội viên Gold & Diamond được ưu tiên nhận sớm từ 10:00 khi có phòng trống).\n` +
        `• **Giờ Trả phòng (Check-out):** Trước 12:00 trưa (Hội viên Gold/Diamond hỗ trợ trả phòng muộn tới 16:00 miễn phí).\n` +
        `• **Ăn sáng:** Buffet 5 sao phục vụ từ 06:30 - 10:30 hằng ngày tại nhà hàng chính.`;

    } else if (msg.includes('đặt phòng') || msg.includes('tìm phòng') || msg.includes('tư vấn phòng') || msg.includes('phòng nghỉ')) {
      reply = `🏰 **Hướng dẫn Đặt phòng nhanh tại AuraResort:**\n\n` +
        `1. Quý khách có thể chọn mục **"Chi nhánh"** trên thanh menu để xem danh sách 6 khu nghỉ dưỡng.\n` +
        `2. Nhấp chọn **"Xem phòng & Đặt"** tại chi nhánh mong muốn.\n` +
        `3. Chọn hạng phòng (Deluxe, Suite, Villa) & điền thông tin ngày lưu trú.\n` +
        `4. Hoặc bấm icon ⚙️/Sliders ở góc phải ô chat AI này để em **Tự động đề xuất phòng theo ngân sách** giúp quý khách nhé!`;

    } else {
      reply = `Dạ, kính chào quý khách đến với **AuraResort Vietnam**! ✨\n\n` +
        `Em là **Aura Concierge** — Trợ lý du lịch 24/7. Em có thể hỗ trợ quý khách:\n` +
        `• 🏨 Tư vấn 6 chi nhánh nghỉ dưỡng: Đà Nẵng, Sa Pa, Hội An, Phú Quốc, Đà Lạt, Ninh Bình.\n` +
        `• 💳 Hướng dẫn thanh toán trực tuyến qua VNPAY, MoMo, VietQR, Thẻ Visa/MasterCard.\n` +
        `• 🎁 Tra cứu mã giảm giá & đặc quyền hội viên Aura Loyalty Club.\n` +
        `• 🌸 Gợi ý các danh lam thắng cảnh & trải nghiệm văn hóa bản địa độc đáo.\n\n` +
        `Quý khách muốn tìm hiểu chi tiết thông tin gì ạ? Hãy nhắn cho em nhé!`;
    }

    return {
      reply,
      source: 'offline_concierge'
    };
  },

  async getRoomRecommendation({ city, maxPrice, guests = 2, features = [] }) {
    let hotels = [];
    let allRooms = [];

    try {
      hotels = await HotelModel.find(city ? { city: { $regex: new RegExp(city, 'i') } } : {});
      allRooms = await RoomModel.find({ capacity: { $gte: Number(guests) || 1 } });
    } catch {
      hotels = initialHotels.filter(h => !city || h.city.toLowerCase().includes(city.toLowerCase()));
      allRooms = initialRooms.filter(r => r.capacity >= (Number(guests) || 1));
    }

    const matches = [];
    hotels.forEach(hotel => {
      const hotelRooms = allRooms.filter(r => r.hotelId === hotel.id);
      hotelRooms.forEach(room => {
        if (maxPrice && room.pricePerNight > Number(maxPrice)) return;
        matches.push({
          hotelId: hotel.id,
          hotelName: hotel.name,
          city: hotel.city,
          room: room
        });
      });
    });

    // Sort by price ascending
    matches.sort((a, b) => a.room.pricePerNight - b.room.pricePerNight);

    const promptMessage = `Tư vấn 2-3 lựa chọn phòng nghỉ tốt nhất phù hợp cho yêu cầu:
- Thành phố: ${city || 'Tất cả chi nhánh'}
- Ngân sách tối đa: ${maxPrice ? Number(maxPrice).toLocaleString('vi-VN') + ' VNĐ/đêm' : 'Không giới hạn'}
- Số lượng khách: ${guests} người
Các lựa chọn tìm thấy: ${JSON.stringify(matches.slice(0, 5))}`;

    let aiAdvice = null;
    try {
      const aiResult = await this.chatWithConcierge(promptMessage);
      if (aiResult && aiResult.reply) {
        aiAdvice = aiResult.reply;
      }
    } catch {
      // ignore
    }

    return {
      criteria: { city, maxPrice, guests, features },
      totalMatches: matches.length,
      recommendations: matches.slice(0, 4),
      aiSummary: aiAdvice
    };
  },

  getQuickSuggestions() {
    return [
      {
        category: 'Nghỉ dưỡng & Chi nhánh',
        prompts: [
          'Tư vấn resort view biển đẹp nhất Đà Nẵng & Phú Quốc',
          'Nghỉ dưỡng Sa Pa & Ninh Bình mùa này có gì đặc sắc?',
          'Khách sạn gần phố cổ Hội An & sông Hoài',
          'Dinh thự đồi thông Đà Lạt bên hồ Tuyền Lâm'
        ]
      },
      {
        category: 'Thanh toán & Đặt phòng',
        prompts: [
          'Hướng dẫn thanh toán qua VNPAY QR & Ví MoMo',
          'Chuyển khoản VietQR 24/7 & Thẻ quốc tế',
          'Chính sách nhận phòng sớm và trả phòng muộn'
        ]
      },
      {
        category: 'Khuyến mãi & Hội viên',
        prompts: [
          'Các mã giảm giá hiện hành của AuraResort',
          'Đặc quyền hội viên Gold & Diamond Aura Loyalty Club',
          'Mã ưu đãi hội viên mới AURA15'
        ]
      },
      {
        category: 'Trải nghiệm văn hóa',
        prompts: [
          'Trải nghiệm dệt thổ cẩm & tắm lá thuốc người Dao Đỏ ở Sa Pa',
          'Thả hoa đăng & chèo thuyền thúng tại Hội An',
          'Ngắm Voọc chà vá chân nâu & Cầu Rồng ở Đà Nẵng'
        ]
      }
    ];
  },

  getAIConfig() {
    const apiKey = runtimeApiKey || process.env.GEMINI_API_KEY;
    const isConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim());
    return {
      provider: 'Google Gemini AI',
      model: 'gemini-2.0-flash',
      fallbackModel: 'gemini-1.5-flash',
      configured: isConfigured,
      hasRuntimeKey: Boolean(runtimeApiKey),
      status: isConfigured ? 'active' : 'offline_rule_mode',
      systemInstructionLength: SYSTEM_INSTRUCTION.length
    };
  },

  updateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
      throw new Error('API Key không hợp lệ');
    }
    runtimeApiKey = apiKey.trim();
    aiClient = null; // Reset instance to re-initialize with new key
    return {
      success: true,
      message: 'Đã cập nhật Gemini API Key thành công',
      config: this.getAIConfig()
    };
  }
};
