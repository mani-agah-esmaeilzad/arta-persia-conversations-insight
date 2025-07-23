import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Bot, MessageCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ChatCharacter from '@/components/ChatCharacter';

// ساختار پیام‌های محلی
interface LocalChatMessage {
  type: 'user' | 'ai1' | 'ai2';
  content: string;
  timestamp: Date;
  character?: string;
  id: string; // ✅ یک شناسه منحصر به فرد برای هر پیام اضافه کردیم
}

const Assessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // اسکرول به آخرین پیام
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // شروع خودکار ارزیابی با درخواست HTTP
  useEffect(() => {
    // ✅ این شرط برای جلوگیری از اجرای چندباره در StrictMode است
    let isMounted = true; 

    const startAssessment = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      setLoading(true);
      toast.success('در حال شروع سناریو...');
      
      try {
        const response = await fetch('https://cofe-code.com/webhook/moshaver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: "شروع کنیم" })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const responseText = await response.text();
        if (!responseText.trim()) {
          if (isMounted) {
            setLoading(false);
            setIsConnected(true);
          }
          return;
        }

        const data = JSON.parse(responseText);

        if (isMounted) {
          setLoading(false);
          setIsConnected(true);

          if (data.type === 'ai_turn' && Array.isArray(data.messages)) {
            for (const msg of data.messages) {
              await new Promise(resolve => setTimeout(resolve, 1500));

              let messageType: 'ai1' | 'ai2' = 'ai1';
              if (msg.character.includes('رضا')) {
                messageType = 'ai2';
              }
              
              const aiMessage: LocalChatMessage = {
                type: messageType,
                content: msg.content,
                timestamp: new Date(),
                character: msg.character,
                id: `ai-${Date.now()}-${Math.random()}`
              };
              
              setMessages(prevMessages => [...prevMessages, aiMessage]);
            }
          }
        }
      } catch (error) {
        console.error("Error starting assessment:", error);
        toast.error("خطا در شروع ارزیابی. لطفاً دوباره تلاش کنید.");
        if (isMounted) {
          setLoading(false);
          navigate('/');
        }
      }
    };

    startAssessment();

    // ✅ تابع Cleanup برای جلوگیری از به‌روزرسانی state روی کامپوننت حذف شده
    return () => {
      isMounted = false;
    };
  }, [user, navigate]);


  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping || !isConnected) return;

    const userMessage: LocalChatMessage = {
      type: 'user',
      content: currentMessage,
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };
    
    // ۱. ابتدا پیام کاربر را به لیست اضافه می‌کنیم
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('https://cofe-code.com/webhook/moshaver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const responseText = await response.text();

      // ۲. انیمیشن تایپ را متوقف می‌کنیم
      setIsTyping(false);

      if (!responseText.trim()) return;
      const data = JSON.parse(responseText);
      
      if (data.analysis) {
        toast.info('ارزیابی تکمیل شد! در حال انتقال به صفحه نتایج...');
        navigate('/results', { state: { analysis: data.analysis } });
        return;
      }

      // ۳. پیام‌های AI را به لیست اضافه می‌کنیم
      if (data.type === 'ai_turn' && Array.isArray(data.messages)) {
        for (const msg of data.messages) {
          await new Promise(resolve => setTimeout(resolve, 1500));

          let messageType: 'ai1' | 'ai2' = 'ai1';
          if (msg.character.includes('رضا')) {
            messageType = 'ai2';
          }
          
          const aiMessage: LocalChatMessage = {
            type: messageType,
            content: msg.content,
            timestamp: new Date(),
            character: msg.character,
            id: `ai-${Date.now()}-${Math.random()}`
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("خطا در ارسال پیام. لطفاً دوباره تلاش کنید.");
      setIsTyping(false);
    }
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
        {/* ... محتوای لودینگ ... */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-executive-pearl via-white to-executive-silver/20 flex flex-col">
      <header className="bg-white/95 backdrop-blur-xl border-b border-executive-ash-light/30 p-6 sticky top-0 z-50 shadow-subtle">
        {/* ... JSX هدر ... */}
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ✅ از شناسه منحصر به فرد به عنوان key استفاده می‌کنیم */}
          {messages.map((message) => ( 
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} items-end gap-6 mb-8`}>
              {/* ... بقیه JSX پیام‌ها ... */}
            </div>
          ))}
          {isTyping && (
            // ... JSX انیمیشن تایپینگ ...
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl border-t border-executive-ash-light/30 p-6 shadow-subtle">
        {/* ... JSX بخش ورودی ... */}
      </div>
    </div>
  );
};

export default Assessment;
