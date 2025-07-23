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
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-xl">در حال اتصال...</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="p-4 border-b bg-white shadow flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')}
                  className="p-2 rounded bg-gray-100 hover:bg-gray-200">
            <ArrowLeft />
          </button>
          <h1 className="text-lg font-bold">جلسه تعاملی سه‌نفره</h1>
          {aiCharacters.length > 0 && (
            <div className="text-sm text-gray-500 flex gap-4">
              <span>{aiCharacters[0]}</span>
              <span>{aiCharacters[1]}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-yellow-700">
          <Shield className="w-4 h-4" /> ارزیابی امن
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-sm px-4 py-3 rounded-2xl shadow ${
                msg.type === 'user'
                  ? 'bg-yellow-100 text-right'
                  : msg.type === 'ai1'
                  ? 'bg-blue-100'
                  : 'bg-green-100'
              }`}>
                {msg.character && <div className="text-xs text-gray-600 mb-1">{msg.character}</div>}
                <div className="whitespace-pre-line text-sm">{msg.content}</div>
                <div className="text-xs text-gray-400 mt-1 text-left">
                  {msg.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl shadow bg-white border text-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 border-t bg-white">
        <div className="max-w-3xl mx-auto flex gap-2 items-end">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="پاسخ خود را بنویسید..."
            className="flex-1 min-h-[50px] max-h-[150px] resize-none"
            disabled={isTyping || !isConnected}
          />
          <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isTyping || !isConnected}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Assessment;