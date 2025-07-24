// 📦 ایمپورت‌ها
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Shield, Users, MessageCircle } from 'lucide-react';
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
        console.log('Raw response:', responseText);

        setLoading(false);
        setIsConnected(true);

        if (!responseText.trim()) {
          console.log('Empty response received');
          return;
        }

        try {
          const parsed = JSON.parse(responseText);
          console.log('Parsed response:', parsed);

          let json;
          if (parsed.response) {
            json = parsed.response
              .replace(/^```json/, '')
              .replace(/```$/, '')
              .trim();
          } else {
            json = responseText;
          }

          const data = JSON.parse(json);
          console.log('Final data:', data);
          handleAiResponse(data);
        } catch (parseError) {
          console.error('Parse error:', parseError);
          console.log('Trying to parse as direct JSON...');

          const cleanJson = responseText
            .replace(/^```json\n/, '')
            .replace(/\n```$/, '')
            .trim();

          const data = JSON.parse(cleanJson);
          console.log('Cleaned data:', data);
          handleAiResponse(data);
        }
      } catch (error) {
        console.error('Error starting assessment:', error);
        toast.error("خطا در شروع ارزیابی. لطفاً دوباره تلاش کنید.");
        setLoading(false);
        navigate('/');
      }
    };

    startAssessment();
  }, [user, navigate]);

  const handleAiResponse = (data: any) => {
    console.log('Processing AI response:', data);

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

      console.log('Messages to add:', tempMessages);

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
      console.log('Raw response:', responseText);

      if (!responseText.trim()) {
        console.log('Empty response received');
        return;
      }

      try {
        const parsed = JSON.parse(responseText);
        console.log('Parsed response:', parsed);

        let json;
        if (parsed.response) {
          json = parsed.response
            .replace(/^```json/, '')
            .replace(/```$/, '')
            .trim();
        } else {
          json = responseText;
        }

        const data = JSON.parse(json);
        console.log('Final data:', data);
        handleAiResponse(data);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.log('Trying to parse as direct JSON...');

        const cleanJson = responseText
          .replace(/^```json\n/, '')
          .replace(/\n```$/, '')
          .trim();

        const data = JSON.parse(cleanJson);
        console.log('Cleaned data:', data);
        handleAiResponse(data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-executive-pearl via-white to-executive-silver/30 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-luxury border border-white/20 text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-executive-navy to-executive-navy-light rounded-3xl flex items-center justify-center animate-pulse shadow-2xl">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-executive-charcoal mb-6">در حال اتصال به سرور...</h2>
          <p className="text-lg text-executive-ash mb-8">لطفاً کمی صبر کنید</p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-executive-navy rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-executive-navy rounded-full animate-bounce delay-150" />
            <div className="w-3 h-3 bg-executive-navy rounded-full animate-bounce delay-300" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-executive-pearl via-white to-executive-silver/20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-executive-ash-light/30 p-3 sticky top-0 z-50 shadow-subtle">
        <div className="flex items-center justify-between max-w-full mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-8 h-8 bg-executive-ash-light/50 rounded-lg flex items-center justify-center hover:bg-executive-navy/10 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 text-executive-ash group-hover:text-executive-navy" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-executive-navy to-executive-navy-light rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-executive-charcoal">جلسه تعاملی</h1>
                <div className="flex items-center gap-2 text-xs">
                  {aiCharacters.map((char, i) => (
                    <div key={i} className={`flex items-center gap-1 ${i === 0 ? 'text-blue-600' : 'text-green-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${isConnected ? (i === 0 ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-400'} animate-pulse`} />
                      <span className="font-medium">{char}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-executive-gold-light/20 px-3 py-1 rounded-lg border border-executive-gold/20">
            <Shield className="w-3 h-3 text-executive-gold" />
            <span className="text-xs font-bold text-executive-charcoal">امن</span>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-3">
        <div className="max-w-full mx-auto space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              {/* AI Character Layout */}
              {msg.type !== 'user' ? (
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="flex-shrink-0 mt-1">
                    {/* ✅ ریسپانسیو آواتار: کوچیک در موبایل */}
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-executive-navy flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {msg.character?.charAt(0).toUpperCase() ?? 'A'}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {msg.character && (
                      <span className="text-xs font-semibold text-executive-charcoal bg-white/80 px-2 py-0.5 rounded-full border border-executive-ash-light/40 mb-1 self-start">
                        {msg.character}
                      </span>
                    )}
                    <div className={`rounded-2xl p-3 shadow-sm ${msg.type === 'ai1'
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200/60 rounded-bl-md'
                        : 'bg-gradient-to-br from-green-50 to-green-100/60 border border-green-200/60 rounded-bl-md'
                      }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line text-executive-charcoal">
                        {msg.content}
                      </p>
                      <p className="text-xs mt-1 text-executive-ash/70">
                        {msg.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // User Message Layout
                <div className="max-w-[85%] bg-gradient-to-br from-executive-gold/15 to-executive-gold-light/25 border border-executive-gold/30 rounded-2xl rounded-br-md p-3 shadow-sm">
                  <p className="text-sm leading-relaxed whitespace-pre-line text-executive-charcoal">
                    {msg.content}
                  </p>
                  <p className="text-xs mt-1 text-executive-ash/70">
                    {msg.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-4 h-4 flex-shrink-0 mt-1">
                  <ChatCharacter type="ai" isTyping={true} isSpeaking={false} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-executive-charcoal bg-white/80 px-2 py-0.5 rounded-full border border-executive-ash-light/40 mb-1 self-start">
                    در حال تایپ...
                  </span>
                  <div className="bg-white/95 border border-executive-ash-light/40 rounded-2xl rounded-bl-md p-3 shadow-sm animate-pulse">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce delay-150" />
                      <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-3 bg-white/95 backdrop-blur-xl border-t border-executive-ash-light/30">
        <div className="max-w-full mx-auto">
          <div className="flex gap-2 items-end mb-3">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="پاسخ خود را بنویسید..."
              className="flex-1 min-h-[60px] max-h-[120px] text-sm p-3 rounded-2xl border border-executive-ash-light/50 focus:border-executive-navy resize-none bg-white/90 backdrop-blur-sm shadow-md transition-all duration-300"
              disabled={isTyping || !isConnected}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isTyping || !isConnected}
              className="w-12 h-12 bg-gradient-to-br from-executive-navy to-executive-navy-light hover:from-executive-navy-dark hover:to-executive-navy rounded-2xl p-0 shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
          <div className="text-center">
            <p className="text-xs text-executive-ash bg-executive-ash-light/20 px-3 py-2 rounded-lg inline-block">
              💬 جلسه ارزیابی زنده
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Assessment;
