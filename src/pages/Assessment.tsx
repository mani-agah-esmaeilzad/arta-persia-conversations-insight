
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, CheckCircle, Brain, MessageSquare, Send, Sparkles, User, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const questions = [
  "سلام! خوشحالم که قراره باهم وقت بگذرونیم 😊 اول بگو ببینم، وقتی عصبانی یا ناراحت هستی، چقدر می‌تونی احساساتت رو تشخیص بدی؟",
  "عالیه! حالا بگو ببینم، تو چقدر می‌تونی بفهمی که دوستات چه حالی دارن؟ مثلاً وقتی کسی ناراحته، متوجه میشی؟",
  "خیلی جالبه! درباره کنترل احساسات چطوره؟ مثلاً وقتی عصبانی هستی، چقدر می‌تونی خودت رو کنترل کنی؟",
  "آفرین! حالا بگو ببینم، چقدر می‌تونی با دردهای دیگران همدردی کنی؟ وقتی کسی مشکل داره، چه احساسی پیدا می‌کنی؟",
  "فوق‌العادست! یکی از مهم‌ترین مهارت‌ها گوش دادنه. تو چقدر می‌تونی واقعاً گوش بدی؟ نه اینکه فقط منتظر باشی تا نوبت حرف زدنت برسه!",
  "عالی! حالا نوبت بیان کردن نظراته. چقدر می‌تونی حرفاتو واضح و مفهوم بزنی؟",
  "خیلی خوبه! گاهی باید انتقاد سازنده بدیم. تو چقدر می‌تونی به شکل مؤدبانه و مفید نظرت رو بگی؟",
  "آفرین! از طرف دیگه، وقتی کسی نظری درباره تو میده، چقدر آماده‌ای که گوش بدی و ازش یاد بگیری؟",
  "عالیه! یکی از چالش‌های بزرگ زندگی، تعارض و اختلاف نظره. تو چقدر می‌تونی این موقعیت‌ها رو حل کنی؟",
  "فوق‌العادست! هر کسی شخصیت متفاوتی داره. تو چقدر می‌تونی با انواع مختلف آدم‌ها ارتباط برقرار کنی؟",
  "خیلی خوبه! اعتماد پایه تمام روابط خوبه. تو چقدر می‌تونی باعث بشی دیگران بهت اعتماد کنن؟",
  "آفرین! کار تیمی خیلی مهمه. تو چقدر می‌تونی تو یه تیم نقش مؤثری داشته باشی؟",
  "عالی! گاهی باید رهبری کنیم. تو چقدر می‌تونی دیگران رو هدایت کنی؟",
  "فوق‌العادست! حمایت از دیگران یه هنره. تو چقدر می‌تونی در زمان سختی کنار دوستات باشی؟",
  "خیلی خوبه! گفتن نیازهامون گاهی سخته. تو چقدر می‌تونی صراحت داشته باشی؟",
  "آفرین! مرزهای شخصی خیلی مهمن. تو چقدر می‌تونی بگی نه یا حریم شخصیت رو حفظ کنی؟",
  "عالیه! استرس تو روابط طبیعیه. تو چقدر می‌تونی با فشارهای ارتباطی کنار بیای؟",
  "فوق‌العادست! روابط سالم زندگی رو زیبا می‌کنه. تو چقدر می‌تونی روابط پایدار و سالم بسازی؟",
  "آخرین سوالمونه! 🎉 تو محیط‌های اجتماعی چقدر راحت هستی؟ مثلاً تو یه مهمونی یا جمع جدید چطوری؟"
];

const Assessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(19).fill(''));
  const [isStarted, setIsStarted] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [messages, setMessages] = useState<Array<{type: 'bot' | 'user', content: string, timestamp: Date}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAnswerSubmit = () => {
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
    newAnswers[currentQuestion] = currentAnswer;
    setAnswers(newAnswers);
    setCurrentAnswer('');

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      setIsTyping(false);
      
      if (currentQuestion < questions.length - 1) {
        // Add next question
        const botMessage = {
          type: 'bot' as const,
          content: questions[currentQuestion + 1],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Final message
        const finalMessage = {
          type: 'bot' as const,
          content: "عالی بود! 🎉 تمام سوالات رو جواب دادی. حالا بیا ببینیم نتایج چی میگه...",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, finalMessage]);
        
        setTimeout(() => {
          navigate('/results', { state: { answers: newAnswers } });
        }, 2000);
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleStart = () => {
    setIsStarted(true);
    // Add first question
    const firstMessage = {
      type: 'bot' as const,
      content: questions[0],
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

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        {/* Status Bar */}
        <div className="h-6 bg-gradient-to-r from-emerald-500 to-blue-600"></div>
        
        {/* Header */}
        <div className="px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-100/50">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="w-11 h-11 bg-gray-100 rounded-2xl flex items-center justify-center btn-press shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">گفتگوی هوشمند</h1>
              <p className="text-sm text-gray-500">شروع ارزیابی تعاملی</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 space-y-8">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce-gentle shadow-xl">
                <MessageSquare className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-3 -right-8 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                آماده یه گفتگوی
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600">
                  جالب هستی؟ 💬
                </span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                قراره با هم یه گفتگوی دوستانه داشته باشیم و مهارت‌های ارتباطی‌ت رو کشف کنیم!
              </p>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100/50 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">دستیار هوشمند</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  آنلاین
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 animate-slide-up">
              <p className="text-gray-800 leading-relaxed">
                سلام! 👋 خوشحالم که میخوای مهارت‌های ارتباطی‌ت رو بهتر بشناسی. قراره یه گفتگوی دوستانه داشته باشیم...
              </p>
            </div>

            <div className="flex justify-end">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-2xl rounded-br-md p-4 max-w-xs animate-scale-in">
                <p>سلام! آره خیلی علاقه‌مندم که شروع کنیم 😊</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-100/50">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">گفتگوی طبیعی</h3>
              <p className="text-sm text-gray-600">مثل چت با دوست</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-100/50">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">تحلیل هوشمند</h3>
              <p className="text-sm text-gray-600">نتایج دقیق و کاربردی</p>
            </div>
          </div>

          <Button 
            onClick={handleStart}
            className="w-full h-16 bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 hover:from-emerald-600 hover:via-blue-700 hover:to-purple-700 text-white text-xl font-bold rounded-3xl shadow-xl btn-press animate-scale-in"
          >
            <MessageSquare className="w-6 h-6 ml-3" />
            بیا شروع کنیم! 🚀
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Status Bar */}
      <div className="h-6 bg-gradient-to-r from-emerald-500 to-blue-600"></div>
      
      {/* Header */}
      <div className="px-6 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-100/50 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsStarted(false)}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center btn-press"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">دستیار هوشمند</h1>
                <div className="flex items-center gap-2 text-xs text-emerald-500">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  در حال نوشتن...
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {currentQuestion + 1}/{questions.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-blue-600 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 py-4 pb-32 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`flex items-end gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-br from-emerald-500 to-blue-600' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`rounded-2xl p-4 shadow-sm ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-br-md'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md'
              }`}>
                <p className="leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-emerald-100' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md p-4 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100/50 p-6">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="پاسخت رو اینجا بنویس..."
              className="min-h-[50px] max-h-[120px] text-base p-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 resize-none bg-white/70 backdrop-blur-sm"
              disabled={isTyping}
            />
          </div>
          
          <Button
            onClick={handleAnswerSubmit}
            disabled={!currentAnswer.trim() || isTyping}
            className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 rounded-2xl p-0 btn-press shadow-lg"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
        
        {currentQuestion === questions.length - 1 && currentAnswer && (
          <p className="text-center text-sm text-gray-500 mt-3 animate-fade-in">
            ⭐ این آخرین سواله! آماده دیدن نتایج؟
          </p>
        )}
      </div>
    </div>
  );
};

export default Assessment;
