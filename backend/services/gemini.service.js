import { GoogleGenAI } from '@google/genai';
import { initialHotels, initialPromotions, initialTourismSpots } from '../data/seedData.js';
import { HotelModel } from '../models/hotel.model.js';
import { RoomModel } from '../models/room.model.js';

let aiClient = null;
let runtimeApiKey = null;

function getAIClient() {
  const apiKey = runtimeApiKey || process.env.GEMINI_API_KEY;
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
Bạn là Aura Concierge - Trợ lý du lịch và chuyên viên chăm sóc khách hàng 24/7 của chuỗi khách sạn nghỉ dưỡng cao cấp AuraResort Vietnam.
Chuỗi có 6 chi nhánh sang trọng tại Việt Nam:
1. Aura Danang Ocean Sanctuary (Đà Nẵng - Biển Mỹ Khê & Bán đảo Sơn Trà, từ 2.450.000đ)
2. Aura Sapa Misty Peak Retreat (Sa Pa - Thung lũng Mường Hoa, săn mây, tắm lá thuốc Dao Đỏ, từ 2.850.000đ)
3. Aura Hoi An Ancient Heritage (Hội An - Bên dòng sông Hoài, thả hoa đăng, làm lồng đèn, từ 2.150.000đ)
4. Aura Phu Quoc Emerald Island (Phú Quốc - Bãi Dài biển ngọc, ngắm hoàng hôn, biệt thự hồ bơi riêng, từ 3.200.000đ)
5. Aura Dalat Pine Forest Manor (Đà Lạt - Hồ Tuyền Lâm mộng mơ, dinh thự kiểu Pháp giữa rừng thông, từ 2.300.000đ)
6. Aura Ninh Binh Karst Valley (Ninh Bình - Tràng An & Tam Cốc Bích Động, non nước hữu tình, từ 2.600.000đ)

Chính sách & Tiện ích:
- Nhận phòng: từ 14:00 (Hội viên Gold/Diamond được nhận sớm từ 10:00).
- Trả phòng: trước 12:00 (Hội viên được trả muộn đến 16:00).
- Thanh toán: Hỗ trợ VNPay, MoMo, Thẻ tín dụng quốc tế Visa/MasterCard, VietQR NAPAS 24/7.
- Khách hàng thân thiết: 4 hạng thẻ Đồng (Bronze - giảm 5-15%), Bạc (Silver - giảm 10-20%), Vàng (Gold - giảm 25% + buffet sáng + spa 500k), Kim Cương (Diamond - đặc quyền đưa đón sân bay riêng & quản gia).
- Mã khuyến mãi hiện hành: AURA15 (giảm 15%), VIPGOLD25 (giảm 25% cho VIP), SUMMEROASIS (giảm 20% biển), MISTYRETREAT (giảm 12% Tây Bắc & Ninh Bình).

Nhiệm vụ của bạn:
- Trả lời ân cần, lịch thiệp, ấm áp, đậm tinh thần hiếu khách Việt Nam cao cấp.
- Tư vấn chi tiết phòng nghỉ phù hợp cho gia đình, cặp đôi, nhóm bạn.
- Gợi ý các trải nghiệm văn hóa địa phương độc đáo, quán ăn đặc sản, thời điểm ngắm bình minh/hoàng hôn đẹp nhất.
- Hướng dẫn thủ tục đặt phòng, áp dụng mã ưu đãi và thanh toán trực tuyến.
- Định dạng câu trả lời gọn gàng, dùng gạch đầu dòng rõ ràng, dễ đọc trên điện thoại.
`;

export const GeminiService = {
  async chatWithConcierge(message, chatHistory = []) {
    const ai = getAIClient();

    if (ai) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash'];
      for (const modelName of modelsToTry) {
        try {
          const contents = [];
          if (chatHistory && chatHistory.length > 0) {
            chatHistory.slice(-6).forEach(h => {
              contents.push({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
              });
            });
          }

          contents.push({
            role: 'user',
            parts: [{ text: message }]
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
          if (reply) {
            return {
              reply,
              source: 'gemini',
              model: modelName
            };
          }
        } catch (err) {
          console.warn(`Gemini API call with ${modelName} failed:`, err.message);
        }
      }
    }

    // Fallback intelligent offline concierge response
    const msg = message.toLowerCase();
    let reply = '';

    if (msg.includes('đà nẵng') || msg.includes('danang') || msg.includes('mỹ khê')) {
      reply = `🌊 **Aura Danang Ocean Sanctuary** tọa lạc trên đường Võ Nguyên Giáp, đối diện bãi biển Mỹ Khê.\n\n` +
        `• **Giá từ:** 2.450.000 VNĐ/đêm (đã bao gồm bữa sáng buffet).\n` +
        `• **Điểm nổi bật:** Hồ bơi chân mây tầng thượng ngắm trọn Bán đảo Sơn Trà, spa tắm khoáng Onsen.\n` +
        `• **Trải nghiệm văn hóa lân cận:** Khám phá Động Huyền Không Ngũ Hành Sơn (cách 3.2km), xem Cầu Rồng phun lửa lúc 21h cuối tuần và ngắm Voọc chà vá chân nâu tại Sơn Trà.\n` +
        `• **Ưu đãi gợi ý:** Sử dụng mã **AURA15** để giảm ngay 15% khi đặt phòng trực tuyến!`;
    } else if (msg.includes('sa pa') || msg.includes('sapa') || msg.includes('fansipan') || msg.includes('mường hoa')) {
      reply = `⛰️ **Aura Sapa Misty Peak Retreat** ẩn mình bên thung lũng Mường Hoa thơ mộng.\n\n` +
        `• **Giá từ:** 2.850.000 VNĐ/đêm.\n` +
        `• **Điểm nổi bật:** Lò sưởi củi tự nhiên, bồn tắm gỗ pơ-mu ngâm thảo dược người Dao Đỏ, ban công săn mây tuyệt đẹp.\n` +
        `• **Gợi ý văn hoá bản địa:** Trải nghiệm dệt thổ cẩm tại bản Tả Van, tắm lá thuốc cổ truyền người Dao Đỏ và chinh phục Đỉnh Fansipan 3.143m.\n` +
        `• **Mã ưu đãi:** Nhập **MISTYRETREAT** để nhận ưu đãi 12% trọn gói nghỉ dưỡng.`;
    } else if (msg.includes('hội an') || msg.includes('hoian') || msg.includes('sông hoài')) {
      reply = `🏮 **Aura Hoi An Ancient Heritage** nằm thanh bình bên dòng sông Hoài.\n\n` +
        `• **Giá từ:** 2.150.000 VNĐ/đêm.\n` +
        `• **Tiện ích:** Miễn phí thuyền gỗ đưa đón ra phố cổ, lớp học làm đèn lồng và xe đạp dạo đồng quê Trà Quế.\n` +
        `• **Trải nghiệm đặc sắc:** Thả hoa đăng cầu bình an đêm rằm, chèo thuyền thúng rừng dừa Bảy Mẫu, thưởng thức Cao Lầu và Cơm gà Bà Buội.`;
    } else if (msg.includes('phú quốc') || msg.includes('phu quoc') || msg.includes('biển')) {
      reply = `🌴 **Aura Phu Quoc Emerald Island** tại Bãi Dài sở hữu bờ cát trắng mịn và làn nước xanh ngọc bích.\n\n` +
        `• **Giá từ:** 3.200.000 VNĐ/đêm.\n` +
        `• **Điểm nổi bật:** 100% Biệt thự hồ bơi vô cực riêng tư, rạp chiếu phim ngoài bờ biển dưới trời sao.\n` +
        `• **Trải nghiệm:** Khám phá vương quốc sao biển Rạch Vẹm, lặn ngắm san hô Nam Đảo và tour du thuyền ngắm hoàng hôn ngũ sắc.`;
    } else if (msg.includes('thanh toán') || msg.includes('vnpay') || msg.includes('momo') || msg.includes('chuyển khoản')) {
      reply = `💳 **Hệ thống thanh toán trực tuyến của AuraResort hỗ trợ:**\n\n` +
        `1. **VNPAY QR:** Quét mã tức thì qua app của hơn 30 ngân hàng lớn tại Việt Nam.\n` +
        `2. **Ví MoMo:** Xác nhận thanh toán qua ví điện tử với 1 chạm.\n` +
        `3. **Thẻ Quốc tế (Visa / MasterCard / JCB):** Bảo mật tiêu chuẩn PCI-DSS & 3D Secure.\n` +
        `4. **VietQR 24/7:** Chuyển khoản ngân hàng tự động xác thực trong 10 giây.\n\n` +
        `Sau khi thanh toán thành công, hệ thống sẽ gửi ngay Mã Xác Nhận Đặt Phòng (Booking Code) và Vé Điện Tử (E-Voucher) về email của quý khách.`;
    } else if (msg.includes('ưu đãi') || msg.includes('khuyến mãi') || msg.includes('voucher') || msg.includes('hội viên') || msg.includes('gold')) {
      reply = `👑 **Chương trình Khách hàng thân thiết Aura Loyalty Club:**\n\n` +
        `• **Hạng Đồng (Bronze):** Giảm 5% - 15% (Mã: **AURA15**).\n` +
        `• **Hạng Bạc (Silver):** Giảm 10% - 20% (Mã: **SUMMEROASIS**), miễn phí buffet sáng.\n` +
        `• **Hạng Vàng (Gold):** Giảm 25% (Mã: **VIPGOLD25**), nâng hạng phòng Suite miễn phí, check-in sớm 10:00 & voucher Spa 500k.\n` +
        `• **Hạng Kim Cương (Diamond):** Giảm 30%, quản gia riêng 24/7 và xe limousine đưa đón sân bay miễn phí.`;
    } else {
      reply = `Dạ, chào mừng quý khách đến với **AuraResort Vietnam**! ✨\n\n` +
        `Em là Aura Concierge, luôn sẵn sàng hỗ trợ quý khách 24/7:\n` +
        `• Tư vấn lựa chọn chi nhánh (Đà Nẵng, Sa Pa, Hội An, Phú Quốc, Đà Lạt, Ninh Bình).\n` +
        `• Đặt phòng & hỗ trợ thanh toán trực tuyến (VNPAY, MoMo, Thẻ quốc tế, VietQR).\n` +
        `• Gợi ý lịch trình du lịch, danh lam thắng cảnh và trải nghiệm văn hóa bản địa đặc sắc.\n` +
        `• Kiểm tra mã ưu đãi hội viên và chính sách nhận/trả phòng.\n\n` +
        `Quý khách đang dự định du lịch đến địa điểm nào, hãy nhắn cho em nhé!`;
    }

    return {
      reply,
      source: 'offline_concierge'
    };
  },

  async getRoomRecommendation({ city, maxPrice, guests = 2, features = [] }) {
    const hotels = await HotelModel.find(city ? { city } : {});
    const allRooms = await RoomModel.find({ capacity: guests });

    const matches = [];
    hotels.forEach(hotel => {
      const hotelRooms = allRooms.filter(r => r.hotelId === hotel.id);
      hotelRooms.forEach(room => {
        if (maxPrice && room.pricePerNight > maxPrice) return;
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

    const promptMessage = `Hãy tư vấn 2-3 lựa chọn tốt nhất từ danh sách phòng phù hợp cho khách có yêu cầu:
- Thành phố: ${city || 'Mọi chi nhánh'}
- Ngân sách tối đa: ${maxPrice ? maxPrice.toLocaleString('vi-VN') + ' VNĐ' : 'Không giới hạn'}
- Số khách: ${guests} người
Các phòng gợi ý: ${JSON.stringify(matches.slice(0, 5))}`;

    let aiAdvice = null;
    const aiResult = await this.chatWithConcierge(promptMessage);
    if (aiResult && aiResult.reply) {
      aiAdvice = aiResult.reply;
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
          'Khách sạn gần phố cổ Hội An & sông Hoài'
        ]
      },
      {
        category: 'Thanh toán & Đặt phòng',
        prompts: [
          'Hướng dẫn thanh toán qua VNPAY QR & Ví MoMo',
          'Chính sách nhận phòng sớm và trả phòng muộn'
        ]
      },
      {
        category: 'Khuyến mãi & Hội viên',
        prompts: [
          'Các mã giảm giá hiện hành của AuraResort',
          'Đặc quyền hội viên Gold & Diamond Aura Loyalty Club'
        ]
      },
      {
        category: 'Trải nghiệm văn hóa',
        prompts: [
          'Trải nghiệm dệt thổ cẩm & tắm lá thuốc người Dao Đỏ ở Sa Pa',
          'Thả hoa đăng & chèo thuyền thúng tại Hội An'
        ]
      }
    ];
  },

  getAIConfig() {
    const apiKey = runtimeApiKey || process.env.GEMINI_API_KEY;
    const isConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');
    return {
      provider: 'Google Gemini AI',
      model: 'gemini-2.5-flash',
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

