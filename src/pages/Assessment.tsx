import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Bot, MessageCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ChatCharacter from '@/components/ChatCharacter';

// ساختار پیام‌های محلی در استیت کامپوننت
interface LocalChatMessage {
  type: 'user' | 'ai1' | 'ai2';
  content: string;
  timestamp: Date;
  character?: string;
}

const Assessment = () => {
  const navigate = useNavigate();
  const { user, selectedSkillId } = useAuth();
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // اسکرول به آخرین پیام
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // مدیریت اتصال وب‌سوکت
  useEffect(() => {
    if (!user || !selectedSkillId) {
      navigate('/');
      return;
    }

    // ===================================================================
    // آدرس وب‌سوکت N8N خود را در اینجا قرار دهید
    // ===================================================================
    const N8N_WEBSOCKET_URL = 'https://cofe-code.com/webhook/moshaver';

    ws.current = new WebSocket(N8N_WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      setLoading(false);
      toast.success('اتصال برقرار شد. منتظر پیام اولیه باشید.');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // اگر پیام از نوع تحلیل نهایی بود، به صفحه نتایج برو
        if (data.analysis) {
          toast.info('ارزیابی تکمیل شد! در حال انتقال به صفحه نتایج...');
          navigate('/results', { state: { analysis: data.analysis } });
          return;
        }

        // اگر پیام از نوع نوبت AI بود و حاوی آرایه پیام‌ها بود
        if (data.type === 'ai_turn' && Array.isArray(data.messages)) {
          // پیام‌ها را با کمی تاخیر نمایش می‌دهیم تا طبیعی‌تر به نظر برسد
          data.messages.forEach((msg: any, index: number) => {
            setTimeout(() => {
              const aiMessage: LocalChatMessage = {
                type: msg.character.includes('سارا') ? 'ai1' : 'ai2',
                content: msg.content,
                timestamp: new Date(),
                character: msg.character,
              };
              setMessages((prev) => [...prev, aiMessage]);
            }, index * 1500); // 1.5 ثانیه تاخیر بین هر پیام
          });
        }
        
        // پس از نمایش آخرین پیام، نشانگر تایپ را غیرفعال کن
        setTimeout(() => {
            setIsTyping(false);
        }, data.messages.length * 1500);

      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        toast.error("پیام دریافتی از سرور معتبر نبود.");
        setIsTyping(false);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      if (messages.length > 0) {
        toast.error('ارتباط با سرور قطع شد.');
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('خطا در ارتباط با سرور.');
      setLoading(false);
    };

    return () => {
      ws.current?.close();
    };
  }, [user, selectedSkillId, navigate]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const userMessage: LocalChatMessage = {
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    ws.current.send(JSON.stringify({
      type: 'user_message',
      content: currentMessage
    }));
    
    setCurrentMessage('');
    setIsTyping(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-executive-pearl via-white to-executive-silver/30 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-luxury border border-white/20 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-executive-navy to-executive-navy-light rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-executive-charcoal mb-4">در حال راه‌اندازی سیستم</h2>
          <p className="text-executive-ash">لطفاً کمی صبر کنید تا ارزیابی آماده شود</p>
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-executive-pearl via-white to-executive-silver/20 flex flex-col">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-executive-ash-light/30 p-6 sticky top-0 z-50 shadow-subtle">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="w-12 h-12 bg-executive-ash-light/50 rounded-xl flex items-center justify-center hover:bg-executive-navy/10 transition-all duration-300 group"
            >
              <ArrowLeft className="w-6 h-6 text-executive-ash group-hover:text-executive-navy" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-executive-navy to-executive-navy-light rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-executive-charcoal">جلسه تعاملی سه‌نفره</h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    سارا (مربی)
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    علی (تحلیلگر)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-executive-gold-light/20 px-4 py-2 rounded-xl border border-executive-gold/20">
            <Shield className="w-5 h-5 text-executive-gold" />
            <span className="text-sm font-semibold text-executive-charcoal">ارزیابی امن</span>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} items-end gap-6 mb-8`}>
              <div className={`flex items-end gap-6 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex-shrink-0">
                  <ChatCharacter 
                    type={message.type === 'user' ? 'user' : 'ai'} 
                    isSpeaking={index === messages.length - 1 && message.type !== 'user'}
                  />
                </div>
                
                <div className={`rounded-3xl p-6 shadow-subtle backdrop-blur-sm relative ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-executive-gold/10 to-executive-gold-light/20 border border-executive-gold/20 rounded-br-lg'
                    : message.type === 'ai1'
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-bl-lg'
                    : 'bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50 rounded-bl-lg'
                }`}>
                  <div className={`absolute bottom-4 w-4 h-4 transform rotate-45 ${
                    message.type === 'user' 
                      ? 'right-[-8px] bg-gradient-to-br from-executive-gold/10 to-executive-gold-light/20 border-r border-b border-executive-gold/20'
                      : message.type === 'ai1'
                      ? 'left-[-8px] bg-gradient-to-br from-blue-50 to-blue-100/50 border-l border-b border-blue-200/50'
                      : 'left-[-8px] bg-gradient-to-br from-green-50 to-green-100/50 border-l border-b border-green-200/50'
                  }`}></div>
                  
                  {message.character && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        message.type === 'ai1' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-xs font-semibold text-executive-charcoal">{message.character}</span>
                    </div>
                  )}
                  
                  <p className="leading-relaxed whitespace-pre-line text-executive-charcoal text-lg">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-3 ${
                    message.type === 'user' ? 'text-executive-ash' : 'text-executive-ash/70'
                  }`}>
                    {message.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start items-end gap-6 mb-8">
              <div className="flex items-end gap-4">
                <div className="flex-shrink-0">
                  <ChatCharacter type="ai" isTyping={true} isSpeaking={false} />
                </div>
                <div className="bg-white/90 border border-executive-ash-light/30 rounded-3xl rounded-bl-lg p-6 shadow-subtle backdrop-blur-sm relative">
                  <div className="absolute left-[-8px] bottom-4 w-4 h-4 bg-white/90 border-l border-b border-executive-ash-light/30 transform rotate-45"></div>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-executive-navy rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-executive-navy rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-executive-navy rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/95 backdrop-blur-xl border-t border-executive-ash-light/30 p-6 shadow-subtle">
        <div className="max-w-4xl mx-auto flex gap-4 items-end">
          <div className="flex-1">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="پاسخ خود را اینجا بنویسید..."
              className="min-h-[60px] max-h-[150px] text-base p-6 rounded-2xl border-2 border-executive-ash-light/50 focus:border-executive-navy resize-none bg-white/80 backdrop-blur-sm shadow-subtle transition-all duration-300"
              disabled={isTyping || !isConnected}
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isTyping || !isConnected}
            className="w-14 h-14 bg-gradient-to-br from-executive-navy to-executive-navy-light hover:from-executive-navy-dark hover:to-executive-navy rounded-2xl p-0 shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            <Send className="w-6 h-6 text-white" />
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto mt-4">
          <p className="text-center text-sm text-executive-ash">
            💬 این یک جلسه ارزیابی زنده است. پاسخ‌های شما توسط هوش مصنوعی تحلیل می‌شوند
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assessment;