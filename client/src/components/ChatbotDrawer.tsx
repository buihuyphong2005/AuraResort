import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  Sparkles,
  Compass,
  CreditCard,
  Tag,
  BedDouble,
  Loader2,
  MessageSquare,
  ChevronDown,
  Settings,
  Key,
  CheckCircle2,
  AlertCircle,
  Sliders
} from 'lucide-react';
import { api } from '../services/api.ts';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  time: string;
}

interface SuggestionCategory {
  category: string;
  prompts: string[];
}

interface AIConfig {
  provider: string;
  model: string;
  configured: boolean;
  hasRuntimeKey: boolean;
  status: string;
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  initialTopic
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'model',
      text: 'Kính chào quý khách! Em là **Aura Concierge** — Trợ lý du lịch và chăm sóc khách hàng 24/7 của chuỗi AuraResort Vietnam.\n\nEm luôn sẵn sàng hỗ trợ quý khách:\n• Tư vấn lựa chọn chi nhánh nghỉ dưỡng lý tưởng.\n• Hướng dẫn đặt phòng & thanh toán trực tuyến (VNPAY, MoMo, VietQR, Thẻ quốc tế).\n• Gợi ý các danh thắng và trải nghiệm văn hóa địa phương đặc sắc.\n• Tra cứu mã ưu đãi hội viên Aura Loyalty Club.\n\nQuý khách muốn lên kế hoạch cho kỳ nghỉ sắp tới như thế nào ạ?',
      time: 'Vừa xong'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionCategories, setSuggestionCategories] = useState<SuggestionCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [configStatus, setConfigStatus] = useState<AIConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [configMessage, setConfigMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [recCity, setRecCity] = useState('');
  const [recMaxPrice, setRecMaxPrice] = useState('');
  const [recGuests, setRecGuests] = useState('2');
  const [isRecommending, setIsRecommending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
      loadSuggestions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialTopic) {
      handleSendMessage(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConfig = async () => {
    try {
      const cfg = await api.getChatbotConfig();
      setConfigStatus(cfg);
    } catch (err) {
      console.warn('Failed to load chatbot config:', err);
    }
  };

  const loadSuggestions = async () => {
    try {
      const data = await api.getChatbotSuggestions();
      if (Array.isArray(data) && data.length > 0) {
        setSuggestionCategories(data);
        setSelectedCategory(data[0].category);
      }
    } catch (err) {
      console.warn('Failed to load chatbot suggestions:', err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await api.sendChatMessage(text.trim(), history);

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'model',
        text: res.data?.reply || 'Dạ, em đã ghi nhận thông tin và đang xử lý.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'model',
        text: 'Dạ, hiện tại đường truyền đang bận một chút. Quý khách vui lòng gọi hotline 24/7 **1900 8899** hoặc gửi tin nhắn lại giúp em nhé!',
        time: 'Vừa xong'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    try {
      const res = await api.updateChatbotConfig(apiKeyInput.trim());
      setConfigMessage({ type: 'success', text: res.message || 'Cập nhật API Key thành công!' });
      setApiKeyInput('');
      loadConfig();
      setTimeout(() => setConfigMessage(null), 3000);
    } catch (err: any) {
      setConfigMessage({ type: 'error', text: err.message || 'Lỗi cập nhật API Key' });
    }
  };

  const handleGetRoomRecommendation = async () => {
    setIsRecommending(true);
    setShowRecommendModal(false);

    const userPrompt = `Tư vấn phòng nghỉ cho ${recGuests} người${recCity ? ` tại ${recCity}` : ''}${recMaxPrice ? ` ngân sách dưới ${Number(recMaxPrice).toLocaleString('vi-VN')}đ` : ''}`;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: `✨ [Yêu cầu tư vấn tự động]: ${userPrompt}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await api.getChatbotRecommend({
        city: recCity || undefined,
        maxPrice: recMaxPrice ? Number(recMaxPrice) : undefined,
        guests: Number(recGuests) || 2
      });

      let responseText = res.aiSummary;
      if (!responseText && res.recommendations && res.recommendations.length > 0) {
        responseText = `🏰 **Danh sách phòng gợi ý phù hợp nhất:**\n\n` +
          res.recommendations.map((r: any, idx: number) =>
            `**${idx + 1}. ${r.hotelName} (${r.city})**\n` +
            `• **Hạng phòng:** ${r.room.name}\n` +
            `• **Giá từ:** ${r.room.pricePerNight.toLocaleString('vi-VN')} VNĐ/đêm\n` +
            `• **Sức chứa:** ${r.room.capacity} khách | ${r.room.size}\n` +
            `• **Tiện ích:** ${r.room.amenities.slice(0, 3).join(', ')}`
          ).join('\n\n');
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'model',
        text: responseText || 'Dạ không tìm thấy phòng phù hợp ngân sách, quý khách thử chọn mức ngân sách khác xem sao nhé!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      handleSendMessage(userPrompt);
    } finally {
      setIsLoading(false);
      setIsRecommending(false);
    }
  };

  const defaultPrompts = [
    'Tư vấn resort view biển đẹp nhất',
    'Nghỉ dưỡng Sa Pa mùa này có gì?',
    'Cách thanh toán VNPAY / MoMo?',
    'Mã giảm giá hội viên VIP?'
  ];

  const activePrompts = suggestionCategories.find(c => c.category === selectedCategory)?.prompts || defaultPrompts;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col text-stone-100 animate-slideLeft">

      {/* Drawer Header */}
      <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-500/20">
              <Bot className="w-5 h-5 text-stone-950" />
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-stone-950 ${configStatus?.configured ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-stone-100 flex items-center gap-1.5">
              Aura Concierge AI
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${configStatus?.configured
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                {configStatus?.configured ? 'Gemini 2.5 Active' : 'Offline Mode'}
              </span>
            </h3>
            <p className="text-[11px] text-stone-400">Trợ lý du lịch & Nghỉ dưỡng thông minh</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowRecommendModal(!showRecommendModal)}
            title="Tư vấn phòng theo ngân sách (API)"
            className="p-2 rounded-xl text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowConfigModal(!showConfigModal)}
            title="Cấu hình API Key Gemini"
            className="p-2 rounded-xl text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Config Modal Popup */}
      {showConfigModal && (
        <div className="p-4 bg-stone-950 border-b border-stone-800 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Key className="w-4 h-4" /> Cấu hình Gemini API Key (Backend API)
            </h4>
            <button onClick={() => setShowConfigModal(false)} className="text-stone-400 hover:text-stone-200">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-stone-400">
            Trạng thái hiện tại: <span className="font-mono text-stone-200">{configStatus?.configured ? '✅ Đã cấu hình GEMINI_API_KEY' : '⚠️ Đang chạy chế độ quy tắc nội bộ (Offline Rule Mode)'}</span>
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Nhập GEMINI_API_KEY mới..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Lưu Key
            </button>
          </div>
          {configMessage && (
            <div className={`p-2 rounded-lg text-[11px] flex items-center gap-1.5 ${configMessage.type === 'success' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
              }`}>
              {configMessage.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{configMessage.text}</span>
            </div>
          )}
        </div>
      )}

      {/* Room Recommendation Filter Popup */}
      {showRecommendModal && (
        <div className="p-4 bg-stone-950 border-b border-stone-800 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Recommendation Engine (Tư vấn tự động)
            </h4>
            <button onClick={() => setShowRecommendModal(false)} className="text-stone-400 hover:text-stone-200">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Điểm đến:</label>
              <select
                value={recCity}
                onChange={(e) => setRecCity(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-2.5 py-1.5 text-stone-200 text-xs focus:outline-none"
              >
                <option value="">Tất cả chi nhánh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Sa Pa">Sa Pa</option>
                <option value="Hội An">Hội An</option>
                <option value="Phú Quốc">Phú Quốc</option>
                <option value="Đà Lạt">Đà Lạt</option>
                <option value="Ninh Bình">Ninh Bình</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Số khách:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={recGuests}
                onChange={(e) => setRecGuests(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-2.5 py-1.5 text-stone-200 text-xs focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-stone-400 block mb-1">Ngân sách tối đa/đêm (VNĐ):</label>
            <input
              type="number"
              step="500000"
              placeholder="VD: 3000000"
              value={recMaxPrice}
              onChange={(e) => setRecMaxPrice(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-1.5 text-stone-200 text-xs focus:outline-none"
            />
          </div>
          <button
            onClick={handleGetRoomRecommendation}
            disabled={isRecommending}
            className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
          >
            {isRecommending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Tìm phòng tối ưu qua API Recommend</span>
          </button>
        </div>
      )}

      {/* Category Tabs */}
      {suggestionCategories.length > 0 && (
        <div className="px-3 py-2 bg-stone-950/80 border-b border-stone-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          {suggestionCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer border ${selectedCategory === cat.category
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                  : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${m.sender === 'user'
                  ? 'bg-amber-600 text-white rounded-br-none shadow-md'
                  : 'bg-stone-950 text-stone-200 border border-stone-800 rounded-bl-none shadow-sm whitespace-pre-line'
                }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-stone-500 mt-1 px-1">{m.time}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-stone-950 p-3 rounded-2xl border border-stone-800 w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Aura Concierge đang soạn câu trả lời...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions pills */}
      <div className="px-4 py-2 border-t border-stone-800/80 bg-stone-950/60 overflow-x-auto flex gap-2 scrollbar-none">
        {activePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer border border-stone-700/60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Hỏi về phòng, văn hóa địa phương, ưu đãi..."
          className="flex-1 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none placeholder-stone-500"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 rounded-xl transition-all cursor-pointer font-bold shadow-md shadow-amber-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
