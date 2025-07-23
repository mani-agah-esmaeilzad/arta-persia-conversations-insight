// 📦 ایمپورت‌ها
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ChatCharacter from '@/components/ChatCharacter';

interface LocalChatMessage {
  type: 'user' | 'ai1' | 'ai2';
  content: string;
  timestamp: Date;
  character?: string;
}

const Assessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [aiCharacters, setAiCharacters] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const startAssessment = async () => {
      try {
        setLoading(true);
        toast.success('در حال شروع سناریو...');

        const response = await fetch('https://cofe-code.com/webhook/moshaver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'شروع کنیم' })
        });

        const responseText = await response.text();
        setLoading(false);
        setIsConnected(true);
        if (!responseText.trim()) return;

        const parsed = JSON.parse(responseText);
        const json = parsed.response
          .replace(/^```json/, '')
          .replace(/```$/, '')
          .trim();

        const data = JSON.parse(json);
        handleAiResponse(data);
      } catch (error) {
        toast.error("خطا در شروع ارزیابی. لطفاً دوباره تلاش کنید.");
        setLoading(false);
        navigate('/');
      }
    };

    startAssessment();
  }, [user, navigate]);

  const handleAiResponse = (data: any) => {
    if (Array.isArray(data.messages)) {
      const incomingCharacters = [...new Set(data.messages.map((msg: any) => msg.character))] as string[];
      const [char1, char2] = aiCharacters.length > 0 ? aiCharacters : incomingCharacters.slice(0, 2);

      if (aiCharacters.length === 0 && incomingCharacters.length >= 2) {
        setAiCharacters(incomingCharacters.slice(0, 2));
      }

      let tempMessages: LocalChatMessage[] = [];

      data.messages.forEach((msg: any) => {
        let messageType: 'ai1' | 'ai2' = msg.character === char2 ? 'ai2' : 'ai1';

        const aiMessage: LocalChatMessage = {
          type: messageType,
          content: msg.content,
          timestamp: new Date(),
          character: msg.character
        };

        tempMessages.push(aiMessage);
      });

      let delay = 0;
      tempMessages.forEach((msg, i) => {
        setTimeout(() => {
          setMessages((prev) => [...prev, msg]);
          if (i === tempMessages.length - 1) setIsTyping(false);
        }, delay);
        delay += 2000;
      });
    } else if (data.analysis) {
      toast.info('ارزیابی تکمیل شد!');
      navigate('/results', { state: { analysis: data.analysis } });
    }
  };

  const sendMessageToN8N = async (message: string) => {
    try {
      const response = await fetch('https://cofe-code.com/webhook/moshaver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const responseText = await response.text();
      if (!responseText.trim()) return;

      const parsed = JSON.parse(responseText);
      const json = parsed.response
        .replace(/^```json/, '')
        .replace(/```$/, '')
        .trim();

      const data = JSON.parse(json);
      handleAiResponse(data);
    } catch (error) {
      toast.error("خطا در ارسال پیام. لطفاً دوباره تلاش کنید.");
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping || !isConnected) return;
    const userMessage: LocalChatMessage = {
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    await sendMessageToN8N(currentMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-executive-pearl via-white to-executive-silver/30 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-luxury border border-white/20 text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-executive-navy to-executive-navy-light rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
          ...
        </div>
        <h2 className="text-2xl font-bold text-executive-charcoal mb-4">در حال اتصال به سرور...</h2>
        <p className="text-executive-ash">لطفاً کمی صبر کنید</p>
        <div className="mt-6 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce delay-150" />
          <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce delay-300" />
        </div>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-executive-pearl via-white to-executive-silver/20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-executive-ash-light/30 p-6 sticky top-0 z-50 shadow-subtle">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="w-12 h-12 bg-executive-ash-light/50 rounded-xl flex items-center justify-center hover:bg-executive-navy/10 transition-all duration-300 group">
              <ArrowLeft className="w-6 h-6 text-executive-ash group-hover:text-executive-navy" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-executive-navy to-executive-navy-light rounded-2xl flex items-center justify-center shadow-lg">
                ...
              </div>
              <div>
                <h1 className="text-xl font-bold text-executive-charcoal">جلسه تعاملی سه‌نفره</h1>
                <div className="flex items-center gap-4 text-sm">
                  {aiCharacters.map((char, i) => (
                    <div key={i} className={`flex items-center gap-2 ${i === 0 ? 'text-blue-600' : 'text-green-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${isConnected ? (i === 0 ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-400'} animate-pulse`} />
                      {char}
                    </div>
                  ))}
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
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} items-end gap-6 mb-8`}>
              <div className={`flex items-end gap-6 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex-shrink-0">
                  <ChatCharacter type={msg.type === 'user' ? 'user' : 'ai'} isSpeaking={i === messages.length - 1 && msg.type !== 'user'} />
                </div>
                <div className={`rounded-3xl p-6 shadow-subtle backdrop-blur-sm relative ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-br from-executive-gold/10 to-executive-gold-light/20 border border-executive-gold/20 rounded-br-lg'
                    : msg.type === 'ai1'
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-bl-lg'
                    : 'bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50 rounded-bl-lg'
                }`}>
                  {msg.character && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        msg.type === 'ai1' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      <span className="text-xs font-semibold text-executive-charcoal">{msg.character}</span>
                    </div>
                  )}
                  <p className="leading-relaxed whitespace-pre-line text-executive-charcoal text-lg">{msg.content}</p>
                  <p className="text-xs mt-3 text-executive-ash/70">
                    {msg.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
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
                  <div className="absolute left-[-8px] bottom-4 w-4 h-4 bg-white/90 border-l border-b border-executive-ash-light/30 transform rotate-45" />
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-executive-navy rounded-full animate-bounce" />
                    <div className="w-3 h-3 bg-executive-navy rounded-full animate-bounce delay-150" />
                    <div className="w-3 h-3 bg-executive-navy rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-6 bg-white/95 backdrop-blur-xl border-t border-executive-ash-light/30">
        <div className="max-w-4xl mx-auto flex gap-4 items-end">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="پاسخ خود را بنویسید..."
            className="flex-1 min-h-[60px] max-h-[150px] text-base p-6 rounded-2xl border-2 border-executive-ash-light/50 focus:border-executive-navy resize-none bg-white/80 backdrop-blur-sm shadow-subtle transition-all duration-300"
            disabled={isTyping || !isConnected}
          />
          <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isTyping || !isConnected} className="w-14 h-14 bg-gradient-to-br from-executive-navy to-executive-navy-light hover:from-executive-navy-dark hover:to-executive-navy rounded-2xl p-0 shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none">
            <Send className="w-6 h-6 text-white" />
          </Button>
        </div>
        <div className="max-w-4xl mx-auto mt-4">
          <p className="text-center text-sm text-executive-ash">💬 این یک جلسه ارزیابی زنده است. پاسخ‌های شما توسط هوش مصنوعی تحلیل می‌شوند</p>
        </div>
      </footer>
    </div>
  );
};

export default Assessment;