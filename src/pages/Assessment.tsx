
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, CheckCircle, Brain, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const questions = [
  "من می توانم احساساتم را دقیقا شناسائی کنم.",
  "من می توانم احساسات دیگران را درک کنم.",
  "من می توانم احساساتم را کنترل کنم.",
  "من می توانم با دیگران همدردی کنم.",
  "من می توانم به خوبی گوش دهم.",
  "من می توانم نظرات خود را به وضوح بیان کنم.",
  "من می توانم انتقاد سازنده ارائه دهم.",
  "من می توانم از انتقاد سازنده استقبال کنم.",
  "من می توانم تعارض را مدیریت کنم.",
  "من می توانم با افراد مختلف ارتباط برقرار کنم.",
  "من می توانم اعتماد ایجاد کنم.",
  "من می توانم در تیم کار کنم.",
  "من می توانم رهبری کنم.",
  "من می توانم از دیگران حمایت کنم.",
  "من می توانم نیازهای خود را بیان کنم.",
  "من می توانم مرزهای شخصی خود را تعیین کنم.",
  "من می توانم با استرس ارتباطی مقابله کنم.",
  "من می توانم روابط سالم برقرار کنم.",
  "من می توانم در موقعیت‌های اجتماعی راحت باشم."
];

const Assessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(19).fill(''));
  const [isStarted, setIsStarted] = useState(false);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate('/results', { state: { answers } });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Status Bar */}
        <div className="h-6 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        {/* Header */}
        <div className="px-6 py-4 bg-white/70 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center btn-press"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">شروع ارزیابی</h1>
              <p className="text-xs text-gray-500">آماده‌سازی</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 space-y-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center animate-bounce-gentle">
              <span className="text-3xl">😊</span>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">
                سلام! خوش آمدید 👋
              </h2>
              <p className="text-gray-600 leading-relaxed">
                برای شناخت بهتر مهارت‌های ارتباطی‌تان آماده هستیم. این فرآیند شامل ۱۹ سوال است که در قالب گفتگویی دوستانه طرح می‌شود.
              </p>
            </div>
          </div>

          {/* Process Steps */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">پاسخ به سوالات</h3>
                  <p className="text-sm text-gray-600">۱۹ سوال کوتاه درباره تجربیات شما</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">تحلیل هوشمند</h3>
                  <p className="text-sm text-gray-600">بررسی پاسخ‌ها توسط سیستم تحلیل</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-emerald-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">دریافت گزارش</h3>
                  <p className="text-sm text-gray-600">نتایج جامع و راهکارهای بهبود</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-white">!</span>
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">نکته مهم</h4>
                <p className="text-sm text-amber-700 leading-relaxed">
                  پاسخ درست یا غلطی وجود ندارد. صادقانه و بر اساس تجربیات واقعی‌تان پاسخ دهید.
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleStart}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-semibold rounded-2xl shadow-lg btn-press"
          >
            <MessageSquare className="w-5 h-5 ml-2" />
            شروع گفتگو
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Status Bar */}
      <div className="h-6 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      
      {/* Header */}
      <div className="px-6 py-4 bg-white/70 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsStarted(false)}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center btn-press"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">سوال {currentQuestion + 1}</h1>
              <p className="text-xs text-gray-500">{Math.round(progress)}% تکمیل شده</p>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600">
            {currentQuestion + 1}/{questions.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Question Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">عبارت پرسشنامه</h3>
                <p className="text-xs text-gray-500">نظرتان را بیان کنید</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-gray-800 font-medium leading-relaxed">
                "{questions[currentQuestion]}"
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                نظر و تجربه شما:
              </label>
              <Textarea
                value={answers[currentQuestion]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="تجربه‌تان در این زمینه را شرح دهید..."
                className="min-h-[100px] text-base p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex-1 h-12 rounded-xl font-medium btn-press"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            قبلی
          </Button>

          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion]?.trim()}
            className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-medium btn-press"
          >
            {currentQuestion === questions.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4 ml-2" />
                مشاهده نتایج
              </>
            ) : (
              <>
                بعدی
                <ArrowRight className="w-4 h-4 mr-2" />
              </>
            )}
          </Button>
        </div>

        {/* Tip */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            💡 هیچ پاسخ درست یا غلطی وجود ندارد
          </p>
        </div>
      </div>

      {/* Bottom safe area */}
      <div className="h-8"></div>
    </div>
  );
};

export default Assessment;
