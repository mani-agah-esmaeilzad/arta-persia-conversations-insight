// 📦 ایمپورت‌ها
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Bot, MessageCircle, Shield } from 'lucide-react';
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

        const data = JSON.parse(responseText);
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
    if (data.type === 'ai_turn' && Array.isArray(data.messages)) {
      if (aiCharacters.length === 0) {
        const uniqueCharacters = [...new Set<string>(data.messages.map((msg: any) => msg.character))];
        setAiCharacters(uniqueCharacters.slice(0, 2));

      }

      data.messages.forEach((msg: any, index: number) => {
        setTimeout(() => {
          let messageType: 'ai1' | 'ai2' = 'ai1';
          if (aiCharacters[1] && msg.character === aiCharacters[1]) messageType = 'ai2';

          const aiMessage: LocalChatMessage = {
            type: messageType,
            content: msg.content,
            timestamp: new Date(),
            character: msg.character
          };
          setMessages(prev => [...prev, aiMessage]);
        }, index * 2000);
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
      setIsTyping(false);
      if (!responseText.trim()) return;

      const data = JSON.parse(responseText);
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
    return <div className="flex items-center justify-center min-h-screen">در حال اتصال...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b bg-white shadow">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')}><ArrowLeft /></button>
          <h1 className="font-bold">جلسه تعاملی سه‌نفره</h1>
        </div>
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`my-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
            {msg.character && <div className="text-xs text-gray-500">{msg.character}</div>}
            <div className="inline-block p-3 rounded bg-gray-100">{msg.content}</div>
          </div>
        ))}
        {isTyping && <div className="text-gray-400">...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white flex gap-2">
        <Textarea
          value={currentMessage}
          onChange={e => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="پاسخ خود را بنویسید..."
          className="flex-1"
          disabled={isTyping || !isConnected}
        />
        <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isTyping || !isConnected}>
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default Assessment;
