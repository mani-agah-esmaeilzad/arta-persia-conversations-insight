
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Building2, User, Bot, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scenarios } from '@/data/scenarios';

const Assessment = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(19).fill(''));
  const [isStarted, setIsStarted] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [messages, setMessages] = useState<Array<{type: 'bot' | 'user', content: string, timestamp: Date}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const webhookUrl = 'https://cofe-code.com/webhook-test/ravanshenasi';

  const sendToWebhook = async (message: string, scenarioIndex: number) => {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          scenario: scenarios[scenarioIndex].scenario,
          question: scenarios[scenarioIndex].question,
          scenarioIndex: scenarioIndex,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();
      return data.response || 'پاسخ شما دریافت شد. با تشکر از همکاری شما.';
    } catch (error) {
      console.error('خطا در ارسال به webhook:', error);
      return 'پاسخ شما ثبت شد. برای ادامه منتظر بمانید...';
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user' as const,
      content: currentAnswer,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentScenario] = currentAnswer;
    setAnswers(newAnswers);
    setCurrentAnswer('');

    // Show typing indicator
    setIsTyping(true);

    try {
      // Send to webhook and get response
      const webhookResponse = await sendToWebhook(currentAnswer, currentScenario);
      
      setIsTyping(false);
      
      if (currentScenario < scenarios.length - 1) {
        // Add bot response
        const botResponseMessage = {
          type: 'bot' as const,
          content: webhookResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponseMessage]);

        // Wait a moment then add next scenario
        setTimeout(() => {
          const nextScenario = scenarios[currentScenario + 1];
          const nextScenarioMessage = {
            type: 'bot' as const,
            content: nextScenario.scenario,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, nextScenarioMessage]);
          setCurrentScenario(currentScenario + 1);
        }, 1000);
      } else {
        // Final response from webhook
        const finalBotMessage = {
          type: 'bot' as const,
          content: webhookResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, finalBotMessage]);
        
        // Final completion message
        setTimeout(() => {
          const completionMessage = {
            type: 'bot' as const,
            content: "ممنون از همکاری شما! ارزیابی کامل شد. در حال تحلیل نهایی پاسخ‌هایتان...",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, completionMessage]);
          
          setTimeout(() => {
            navigate('/results', { state: { answers: newAnswers } });
          }, 2000);
        }, 1000);
      }
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        type: 'bot' as const,
        content: "متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    // Add first scenario
    const firstScenario = scenarios[0];
    const firstMessage = {
      type: 'bot' as const,
      content: `سلام! به ارزیابی مهارت‌های ارتباطی خوش آمدید. 

${firstScenario.scenario}

حالا نوبت شماست که واکنش خود را نشان دهید...`,
      timestamp: new Date()
    };
    setMessages([firstMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnswerSubmit();
    }
  };

  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Status Bar */}
        <div className="h-6 bg-gradient-to-r from-blue-600 to-slate-700"></div>
        
        {/* Header */}
        <div className="px-6 py-4 bg-white/90 backdrop-blur-lg border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center btn-press shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">ارزیابی تعاملی</h1>
              <p className="text-sm text-slate-500">سناریوهای کاری</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 space-y-8">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-600 to-slate-700 rounded-full flex items-center justify-center shadow-xl">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-3 -right-8 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                آماده بررسی
                <br />
                <span className="text-blue-600">
                  سناریوهای کاری؟ 💼
                </span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
                قراره با هم موقعیت‌های مختلف کاری رو بررسی کنیم و ببینیم شما چطور واکنش نشان می‌دهید.
              </p>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">ارزیاب تخصصی</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  آماده ارزیابی
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-slate-800 leading-relaxed">
                سلام! قراره چند سناریو کاری براتون بگم و ببینم در این موقعیت‌ها چطور واکنش نشان می‌دهید...
              </p>
            </div>

            <div className="flex justify-end">
              <div className="bg-blue-600 text-white rounded-2xl rounded-br-md p-4 max-w-xs">
                <p>سلام! آماده‌ام که شروع کنیم 👍</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleStart}
            className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-3xl shadow-xl btn-press"
          >
            <Building2 className="w-6 h-6 ml-3" />
            شروع ارزیابی سناریومحور 🚀
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Status Bar */}
      <div className="h-6 bg-gradient-to-r from-blue-600 to-slate-700"></div>
      
      {/* Header */}
      <div className="px-6 py-4 bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsStarted(false)}
              className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center btn-press"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">ارزیاب تخصصی</h1>
                <div className="flex items-center gap-2 text-xs text-blue-500">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  در حال بررسی...
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {currentScenario + 1}/{scenarios.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 py-4 pb-32 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-professional`}>
            <div className={`flex items-end gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-slate-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`rounded-2xl p-4 shadow-sm ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'
              }`}>
                <p className="leading-relaxed whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {message.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in-corporate">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md p-4 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 p-6">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="پاسخ خود را در این موقعیت بنویسید..."
              className="min-h-[50px] max-h-[120px] text-base p-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 resize-none bg-white/70 backdrop-blur-sm"
              disabled={isTyping}
            />
          </div>
          
          <Button
            onClick={handleAnswerSubmit}
            disabled={!currentAnswer.trim() || isTyping}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-2xl p-0 btn-press shadow-lg"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
        
        {currentScenario === scenarios.length - 1 && currentAnswer && (
          <p className="text-center text-sm text-slate-500 mt-3 animate-fade-in-corporate">
            📊 این آخرین سناریو است! آماده دریافت گزارش تحلیلی؟
          </p>
        )}
      </div>
    </div>
  );
};

export default Assessment;
