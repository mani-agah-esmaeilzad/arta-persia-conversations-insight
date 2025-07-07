import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, User, Bot, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { assessmentApi, ChatMessage } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Assessment = () => {
  const navigate = useNavigate();
  const { user, selectedSkillId, currentAssessmentId, setCurrentAssessmentId } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user || !selectedSkillId) {
      navigate('/');
      return;
    }
    
    const initializeAssessment = async () => {
      try {
        const assessment = await assessmentApi.start(user.id, selectedSkillId);
        setCurrentAssessmentId(assessment.id);
        const existingMessages = await assessmentApi.getMessages(assessment.id);
        setMessages(existingMessages);
      } catch (error) {
        console.error('خطا در شروع ارزیابی:', error);
        toast.error('خطا در شروع ارزیابی');
      } finally {
        setLoading(false);
      }
    };

    initializeAssessment();
  }, [user, selectedSkillId]);

  const handleInitialConnection = async () => {
    setIsTyping(true);
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "سلام! کاربر جدید وارد چت شد",
          type: "initial_connection",
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();
      
      if (data.response) {
        const botMessage = {
          type: 'bot' as const,
          content: data.response,
          timestamp: new Date()
        };
        setMessages([botMessage]);
        setIsConnected(true);
      } else {
        throw new Error('No response from webhook');
      }
    } catch (error) {
      console.error('خطا در اتصال به سرور:', error);
      const errorMessage = {
        type: 'bot' as const,
        content: 'سلام! به سیستم ارزیابی خوش آمدید. من آماده صحبت با شما هستم.',
        timestamp: new Date()
      };
      setMessages([errorMessage]);
      setIsConnected(true);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async (message: string): Promise<any> => {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          type: "user_message",
          timestamp: new Date().toISOString(),
          conversation_history: messages.slice(-10) 
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('خطا در ارسال پیام:', error);
      return { response: 'خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.' };
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return;

    const userMessage = {
      type: 'user' as const,
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);

    const data = await sendMessage(messageToSend);

    // اگر دیتا ساختار گزارش نهایی را داشت، به صفحه نتایج برو
    if (data.assessmentComplete && data.analysis) {
      navigate('/results', { state: { analysis: data.analysis } });
      return; // اجرای تابع در اینجا متوقف می‌شود
    }

    // اگر پیام عادی بود، آن را به لیست پیام‌ها اضافه کن
    const botMessage = {
      type: 'bot' as const,
      content: data.response || 'متأسفانه پاسخی دریافت نشد. لطفاً دوباره تلاش کنید.',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isConnected && messages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-corporate-blue rounded-full flex items-center justify-center animate-pulse">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-corporate-dark mb-2">در حال اتصال...</h2>
          <p className="text-gray-600">لطفاً کمی صبر کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-gray-200 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-corporate-blue rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-corporate-dark">مشاور تخصصی</h1>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  آنلاین و آماده پاسخگویی
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            گفتگوی زنده
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-corporate-blue' 
                    : 'bg-corporate-accent'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className={`rounded-2xl p-4 shadow-sm ${
                  message.type === 'user'
                    ? 'bg-corporate-blue text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-corporate-dark rounded-bl-md'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 bg-corporate-accent rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="پیام خود را بنویسید..."
              className="min-h-[50px] max-h-[120px] text-base p-4 rounded-2xl border-2 border-gray-200 focus:border-corporate-blue resize-none bg-white/70 backdrop-blur-sm"
              disabled={isTyping}
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isTyping}
            className="w-12 h-12 bg-corporate-blue hover:bg-corporate-blue/90 rounded-2xl p-0 shadow-lg"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-gray-500 mt-3">
            💬 این یک گفتگوی زنده است. پیام‌های شما مستقیماً پردازش می‌شوند
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
