import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Bot, MessageCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ChatCharacter from '@/components/ChatCharacter';

// ساختار پیام
interface LocalChatMessage {
  type: 'user' | 'ai1' | 'ai2';
  content: string;
  timestamp: Date;
  character?: string;
  id: string;
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

  // این تابع با useCallback ساخته شده تا در هر رندر مجدد، دوباره ساخته نشود
  const addAiMessage = useCallback((msg: any) => {
    let messageType: 'ai1' | 'ai2' = 'ai1';
    if (msg.character && msg.character.includes('رضا')) {
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
  }, []);

  // شروع ارزیابی
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    setLoading(true);
    toast.success('در حال شروع سناریو...');

    fetch('https://cofe-code.com/webhook/moshaver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "شروع کنیم" })
    })
    .then(res => res.ok ? res.text() : Promise.reject('Network response was not ok'))
    .then(text => {
      setLoading(false);
      setIsConnected(true);
      if (!text.trim()) return;

      const data = JSON.parse(text);
      if (data.type === 'ai_turn' && Array.isArray(data.messages)) {
        // استفاده از یک تابع async داخلی برای مدیریت تاخیر
        const processWithDelay = async () => {
          for (const msg of data.messages) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            addAiMessage(msg);
          }
        };
        processWithDelay();
      }
    })
    .catch(error => {
      console.error("Error starting assessment:", error);
      toast.error("خطا در شروع ارزیابی.");
      setLoading(false);
      navigate('/');
    });
  }, [user, navigate, addAiMessage]); // addAiMessage به لیست وابستگی‌ها اضافه شد


  // ارسال پیام کاربر
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping || !isConnected) return;

    const userMessage: LocalChatMessage = {
      type: 'user',
      content: currentMessage,
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };

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
      setIsTyping(false);

      if (!responseText.trim()) return;
      const data = JSON.parse(responseText);
      
      if (data.analysis) {
        toast.info('ارزیابی تکمیل شد!');
        navigate('/results', { state: { analysis: data.analysis } });
        return;
      }

      if (data.type === 'ai_turn' && Array.isArray(data.messages)) {
        for (const msg of data.messages) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          addAiMessage(msg);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("خطا در ارسال پیام.");
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // اسکرول به آخرین پیام
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // JSX بدون تغییر زیاد
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-executive-pearl via-white to-executive-silver/30 flex items-center justify-center">
        {/* ... محتوای لودینگ ... */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-executive-pearl via-white to-executive-silver/20 flex flex-col">
       <header> 
        {/* ... JSX هدر شما ... */}
       </header>
       <div className="flex-1 overflow-y-auto p-6">
         <div className="max-w-4xl mx-auto space-y-6">
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
         <div className="max-w-4xl mx-auto flex gap-4 items-end">
           <div className="flex-1">
             <Textarea
               value={currentMessage}
               onChange={(e) => setCurrentMessage(e.target.value)}
               onKeyDown={handleKeyPress}
               // ... بقیه props ...
             />
           </div>
           <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isTyping || !isConnected}>
             {/* ... */}
           </Button>
         </div>
         {/* ... */}
       </div>
    </div>
  );
};

export default Assessment;
