
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// سوالات پرسشنامه مهارت‌های ارتباطی
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
      // Navigate to results with answers
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

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <div className="text-6xl mb-6 animate-bounce">😊</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              سلام! خیلی خوش اومدی! 
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              خیلی هم عالی که برای شناخت بهتر مهارت‌هات اینجا هستی! اینجا قرار نیست آزمون رسمی بدیم، بلکه یک گفتگوی خودمونی خواهیم داشت تا جنبه‌های مختلف مهارت‌های ارتباطی خودت رو بهتر ببینی.
            </p>
            <p className="text-gray-600 mb-8">
              من ۱۹ عبارت از یک پرسشنامه معتبر رو باهات در میون میذارم و ازت میخوام نظرت و تجربه‌ات رو در مورد هر کدوم بگی. 
            </p>
            <Button 
              onClick={handleStart}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 text-xl rounded-2xl"
            >
              آماده‌ام، بریم شروع کنیم! 💬
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              سوال {currentQuestion + 1} از {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% تکمیل شده
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8 animate-fade-in">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">💭</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              سوال {currentQuestion + 1} از {questions.length}:
            </h2>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              عبارت پرسشنامه این هست: <strong>"{questions[currentQuestion]}"</strong>
            </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              نظرت در مورد این عبارت چیه؟ چقدر در مورد خودت صادق می‌دونیش و چطور در تجربیاتت دیدیش؟
            </p>
            <Textarea
              value={answers[currentQuestion]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="لطفاً تجربه و نظرت رو در مورد این عبارت بنویس..."
              className="min-h-[120px] text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="px-6 py-3 rounded-xl"
            >
              <ArrowLeft className="ml-2 h-5 w-5" />
              سوال قبلی
            </Button>

            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion]?.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl"
            >
              {currentQuestion === questions.length - 1 ? 'مشاهده نتایج' : 'سوال بعدی'}
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="text-center text-gray-600 text-sm">
          💡 نکته: جواب درست یا غلطی وجود نداره، فقط نظرات و تجربیات تو مهمه
        </div>
      </div>
    </div>
  );
};

export default Assessment;
