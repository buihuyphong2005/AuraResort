import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { initialHotels, initialPromotions, initialTourismSpots, initialRooms } from '../data/seedData.js';
import { HotelModel } from '../models/hotel.model.js';
import { RoomModel } from '../models/room.model.js';
import { analyzeUserQuery, generateTravelAdvice, DESTINATION_DATA } from './travelKnowledge.js';

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
Bạn là Aura Concierge - Chuyên viên Cố vấn Du lịch Cấp cao và Đại sứ Trải nghiệm Văn hóa của chuỗi nghỉ dưỡng cao cấp AuraResort Vietnam.

Bối cảnh và Vai trò:
- Bạn KHÔNG PHẢI là một cỗ máy bán phòng đơn thuần. Bạn là một chuyên gia du lịch am tường sâu sắc về địa lý, danh lam thắng cảnh, văn hóa bản địa, lịch sử, ẩm thực đặc sản, thời tiết, kinh nghiệm đi lại và cách tận hưởng từng vùng miền trên khắp Việt Nam (đặc biệt là Sa Pa, Đà Nẵng, Hội An, Phú Quốc, Đà Lạt, Ninh Bình, Hạ Long, Huế).
- Khi người dùng hỏi về:
  + LỊCH TRÌNH (itinerary): Hãy lên kế hoạch chi tiết, có phân chia Buổi sáng / Buổi chiều / Buổi tối, thời gian hợp lý, phương tiện di chuyển, điểm chụp ảnh đẹp và bữa ăn tương ứng.
  + ẨM THỰC (food): Nêu cụ thể tên các món đặc sản, phong vị, địa chỉ hoặc tên các quán ăn/chợ đêm nổi tiếng của người bản địa.
  + DANH THẮNG / ĐIỂM ĐẾN (attractions): Mô tả nét độc đáo, trải nghiệm không nên bỏ lỡ, thời điểm ngắm đẹp nhất trong ngày.
  + THỜI TIẾT / MÙA DU LỊCH (weather): Phân tích đặc điểm từng mùa, tháng nào đẹp nhất, nên chuẩn bị trang phục gì.
  + KINH NGHIỆM / ĐỐI TƯỢNG: Đưa ra lời khuyên thiết thực khi đi cùng gia đình có trẻ em/người cao tuổi, cặp đôi trăng mật, hay nhóm bạn.
- NGUYÊN TẮC VỀ GIỚI THIỆU PHÒNG NGHỈ AURA RESORT:
  + Tuyệt đối KHÔNG ép buộc, không chèn tràn lan bảng giá phòng nếu người dùng chỉ hỏi về du lịch, ăn uống, cảnh đẹp!
  + Hãy tập trung 85-90% nội dung giải đáp tận tình câu hỏi du lịch của khách.
  + Ở phần cuối câu trả lời, bạn có thể thêm một gợi ý tinh tế, lịch thiệp (1-2 dòng) về cơ sở nghỉ dưỡng AuraResort tại điểm đến đó (ví dụ: "💡 Mẹo lưu trú: Nếu cần nơi nghỉ ngơi thư thái gần các điểm trên, quý khách có thể tham khảo [Tên chi nhánh Aura]..."), và lịch sự hỏi xem khách có cần tư vấn thêm về phòng hoặc ưu đãi hay không.
  + CHỈ KHI người dùng trực tiếp hỏi về giá phòng, đặt phòng, tiện ích resort, hoặc voucher thanh toán thì bạn mới đi sâu vào chi tiết hạng phòng, giá tiền và chính sách ưu đãi.

Hệ thống 8 chi nhánh AuraResort:
1. Aura Danang Ocean Sanctuary (Đà Nẵng - Biển Mỹ Khê & Bán đảo Sơn Trà, từ 2.450.000đ/đêm)
2. Aura Sapa Misty Peak Retreat (Sa Pa - Thung lũng Mường Hoa, Fansipan, bồn tắm gỗ pơ-mu lá thuốc Dao Đỏ, từ 2.850.000đ/đêm)
3. Aura Hoi An Ancient Heritage (Hội An - Bên sông Hoài, thuyền gỗ ngắm phố cổ, làm đèn lồng, từ 2.150.000đ/đêm)
4. Aura Phu Quoc Emerald Island (Phú Quốc - Bãi Dài ngọc bích, hoàng hôn ngũ sắc, villa hồ bơi riêng, từ 3.200.000đ/đêm)
5. Aura Dalat Pine Forest Manor (Đà Lạt - Dinh thự phong cách Indochine hồ Tuyền Lâm, đồi thông, lò sưởi, từ 2.300.000đ/đêm)
6. Aura Ninh Binh Karst Valley (Ninh Bình - Tràng An, Tam Cốc, Hang Múa, hồ bơi vách núi, từ 2.600.000đ/đêm)
7. Aura Ha Long Heritage Bay (Hạ Long - Vịnh kỳ quan thế giới, du thuyền riêng, hải sản Michelin, từ 2.750.000đ/đêm)
8. Aura Hue Imperial Riverside (Huế - Bên dòng sông Hương, ngắm cầu Trường Tiền, thuyền rồng Ca Huế, từ 1.950.000đ/đêm)

Chính sách & Ưu đãi:
- Nhận phòng: 14:00 (Hội viên Gold/Diamond từ 10:00). Trả phòng: 12:00 (Hội viên đến 16:00).
- Mã giảm giá: AURA15 (giảm 15% hội viên mới), VIPGOLD25 (giảm 25% VIP Gold/Diamond), SUMMEROASIS (giảm 20% biển), MISTYRETREAT (giảm 12% Sa Pa & Ninh Bình).
- Thanh toán trực tuyến 24/7: VNPAY QR, Ví MoMo, Thẻ quốc tế Visa/MasterCard, VietQR NAPAS 24/7.

Định dạng trả lời:
- Luôn dùng Markdown chuẩn với icon sinh động, tiêu đề in đậm rõ ràng, danh sách gạch đầu dòng mạch lạc.
- Ngôn từ ân cần, hiếu khách, truyền cảm hứng xê dịch và am hiểu sâu sắc văn hóa Việt Nam.
- NGUYÊN TẮC TỐC ĐỘ & SÚC TÍCH:
  + Trả lời súc tích, đi thẳng vào câu hỏi, tránh mở đầu rườm rà hay chào hỏi lặp lại.
  + Mỗi gợi ý (món ăn, điểm đến, trải nghiệm) chỉ cần chọn lọc 2-3 lựa chọn tinh hoa nhất kèm 1-2 câu điểm nhấn.
  + Tổng độ dài toàn bộ câu trả lời gói gọn dưới 250 - 300 từ để tối ưu thời gian phản hồi siêu tốc cho khách.
`;

let activeModel = 'gemini-2.5-flash';
const CANDIDATE_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash'];

export const GeminiService = {
  async chatWithConcierge(message, chatHistory = []) {
    const msg = message.toLowerCase().trim();
    const analysis = analyzeUserQuery(message);

    // FAST-PATH: Instant response (< 5ms) for frequent factual resort queries
    // 1. Direct Payment Inquiries
    if (analysis.intent === 'payment' || msg.includes('thanh toán') || msg.includes('vnpay') || msg.includes('momo') || msg.includes('chuyển khoản') || msg.includes('vietqr') || msg.includes('thẻ')) {
      const reply = `💳 **Hệ thống Thanh toán Trực tuyến 24/7 của AuraResort:**\n\n` +
        `1. **VNPAY QR:** Quét mã tức thì qua ứng dụng Mobile Banking của 30+ ngân hàng tại Việt Nam.\n` +
        `2. **Ví MoMo:** Xác nhận thanh toán qua ví điện tử siêu tốc 1-touch.\n` +
        `3. **VietQR / Napas 247:** Chuyển khoản ngân hàng tự động đối soát trong 10 giây.\n` +
        `4. **Thẻ Quốc tế (Visa / MasterCard / JCB):** Bảo mật chuẩn quốc tế PCI-DSS & 3D-Secure.\n\n` +
        `✨ *Ngay sau khi thanh toán thành công, hệ thống tự động phát hành Mã Xác Nhận Đặt Phòng (Booking Code) và Vé Điện Tử (E-Voucher) gửi về Email của quý khách.*`;
      return { reply, source: 'travel_ai_engine' };
    }

    // 2. Direct Promotion & Loyalty Inquiries
    if (analysis.intent === 'promotion' || msg.includes('ưu đãi') || msg.includes('khuyến mãi') || msg.includes('voucher') || msg.includes('mã giảm') || msg.includes('hội viên') || msg.includes('loyalty') || msg.includes('gold') || msg.includes('diamond')) {
      const reply = `👑 **Chương trình Khách hàng thân thiết Aura Loyalty Club & Mã Ưu Đãi:**\n\n` +
        `• 🥉 **Hạng Đồng (Bronze):** Giảm **15%** với mã \`AURA15\`.\n` +
        `• 🥈 **Hạng Bạc (Silver):** Giảm **20%** với mã \`SUMMEROASIS\` + Miễn phí bữa sáng.\n` +
        `• 🥇 **Hạng Vàng (Gold):** Giảm **25%** với mã \`VIPGOLD25\` + Check-in sớm 10:00 + Voucher Spa 500.000 VNĐ.\n` +
        `• 💎 **Hạng Kim Cương (Diamond):** Giảm **30%** + Quản gia riêng 24/7 + Đưa đón Limousine sân bay miễn phí.\n\n` +
        `• 🌲 **Ưu đãi Mùa Thu Sa Pa & Ninh Bình:** Mã \`MISTYRETREAT\` giảm 12% trọn gói!`;
      return { reply, source: 'travel_ai_engine' };
    }

    // 3. Direct Check-in / Check-out Policy
    if (msg.includes('nhận phòng') || msg.includes('trả phòng') || msg.includes('check in') || msg.includes('check out') || msg.includes('giờ giấc') || msg.includes('chính sách phòng')) {
      const reply = `⏰ **Chính sách Nhận & Trả phòng tại AuraResort:**\n\n` +
        `• **Giờ Nhận phòng (Check-in):** Từ 14:00 (Hội viên Gold & Diamond được ưu tiên nhận sớm từ 10:00 khi có phòng trống).\n` +
        `• **Giờ Trả phòng (Check-out):** Trước 12:00 trưa (Hội viên Gold/Diamond hỗ trợ trả phòng muộn tới 16:00 miễn phí).\n` +
        `• **Ăn sáng:** Buffet 5 sao phục vụ từ 06:30 - 10:30 hằng ngày tại nhà hàng chính.`;
      return { reply, source: 'travel_ai_engine' };
    }

    // Call Gemini AI for dynamic queries (travel advice, itineraries, culture, food, chat)
    const ai = getAIClient();

    if (ai) {
      // Prioritize the known working model, then fallback candidates
      const modelsToTry = [activeModel, ...CANDIDATE_MODELS.filter(m => m !== activeModel)];

      for (const modelName of modelsToTry) {
        try {
          const contents = [];

          // Format chat history for Google Gen AI SDK (limit to last 4 turns for speed)
          if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
            const validHistory = chatHistory
              .filter(h => h && h.text && typeof h.text === 'string' && h.text.trim())
              .slice(-4);
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

          // Timeout wrapper: 7.5 seconds max so user is never left hanging
          const generatePromise = ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.6,
              // Disable thinking budget to ensure ultra-low latency (<2s)
              thinkingConfig: {
                thinkingBudget: 0
              },
              // Cap output tokens to prevent slow runaway essays
              maxOutputTokens: 600
            }
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI generation timeout')), 7500)
          );

          const response = await Promise.race([generatePromise, timeoutPromise]);

          const reply = response.text;
          if (reply && reply.trim()) {
            activeModel = modelName; // Remember successful model
            return {
              reply: reply.trim(),
              source: 'gemini',
              model: modelName
            };
          }
        } catch (err) {
          console.warn(`Gemini API call with model ${modelName} failed or timed out:`, err.message);
        }
      }
    }

    // High-speed Intelligent Travel Knowledge Engine fallback
    const reply = generateTravelAdvice(analysis);

    return {
      reply,
      source: 'travel_ai_engine'
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
        category: 'Lịch trình & Khám phá',
        prompts: [
          'Gợi ý cho tôi lịch trình du lịch văn hóa 3 ngày 2 đêm',
          'Lịch trình 3N2Đ khám phá Sa Pa & Fansipan',
          'Lịch trình Đà Nẵng - Hội An 3 ngày 2 đêm',
          'Nghỉ dưỡng 3N2Đ tại đảo ngọc Phú Quốc',
          'Du lịch gia đình có trẻ em nên đi đâu?'
        ]
      },
      {
        category: 'Ẩm thực & Quán ngon',
        prompts: [
          'Đặc sản ngon nhất định phải thử ở Sa Pa',
          'Ăn gì ở Đà Nẵng: Quán ngon & chợ đêm?',
          'Món ngon phố cổ Hội An & địa chỉ nổi tiếng',
          'Đặc sản ẩm thực biển đảo Phú Quốc'
        ]
      },
      {
        category: 'Thời tiết & Mùa đẹp',
        prompts: [
          'Sa Pa mùa nào săn mây & ngắm tuyết đẹp nhất?',
          'Du lịch Phú Quốc tháng mấy tắm biển đẹp?',
          'Thời điểm lý tưởng du lịch Đà Nẵng & Hội An',
          'Mùa lúa chín vàng Tam Cốc Ninh Bình vào tháng mấy?'
        ]
      },
      {
        category: 'Văn hóa & Trải nghiệm',
        prompts: [
          'Trải nghiệm tắm lá thuốc cổ truyền người Dao Đỏ',
          'Thả hoa đăng sông Hoài & làm đèn lồng Hội An',
          'Ngắm Voọc chà vá chân nâu & Cầu Rồng Đà Nẵng',
          'Chèo thuyền thúng Rừng dừa Bảy Mẫu'
        ]
      },
      {
        category: 'Phòng nghỉ & Ưu đãi',
        prompts: [
          'Tư vấn resort view biển đẹp nhất Đà Nẵng & Phú Quốc',
          'Các mã giảm giá hiện hành của AuraResort',
          'Đặc quyền hội viên Gold & Diamond Aura Loyalty Club',
          'Hướng dẫn thanh toán qua VNPAY QR & Ví MoMo'
        ]
      }
    ];
  },

  getAIConfig() {
    const apiKey = runtimeApiKey || process.env.GEMINI_API_KEY;
    const isConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim());
    return {
      provider: 'Google Gemini 2.5 Flash & Aura Travel Knowledge Engine',
      model: activeModel,
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
    const cleanKey = apiKey.trim();
    runtimeApiKey = cleanKey;
    process.env.GEMINI_API_KEY = cleanKey;
    aiClient = null; // Reset instance to re-initialize with new key

    // Persist to .env file
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        if (/^GEMINI_API_KEY=/m.test(envContent)) {
          envContent = envContent.replace(/^GEMINI_API_KEY=.*$/m, `GEMINI_API_KEY="${cleanKey}"`);
        } else {
          envContent += `\nGEMINI_API_KEY="${cleanKey}"\n`;
        }
        fs.writeFileSync(envPath, envContent, 'utf8');
      } else {
        fs.writeFileSync(envPath, `GEMINI_API_KEY="${cleanKey}"\nAPP_URL="http://localhost:3000"\n`, 'utf8');
      }
    } catch (err) {
      console.warn('Could not write API key to .env file:', err.message);
    }

    return {
      success: true,
      message: 'Đã cập nhật và lưu vĩnh viễn Gemini API Key thành công',
      config: this.getAIConfig()
    };
  }
};
