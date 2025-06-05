
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface LocationState {
  answers: string[];
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showResults, setShowResults] = useState(false);
  
  const state = location.state as LocationState;
  const answers = state?.answers || [];

  useEffect(() => {
    if (answers.length === 0) {
      navigate('/');
      return;
    }

    // Simulate analysis time
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setTimeout(() => setShowResults(true), 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [answers, navigate]);

  // Simple analysis based on answer length and content
  const analyzeAnswers = () => {
    let totalScore = 0;
    const questionAnalysis = answers.map((answer, index) => {
      let score = 1;
      
      if (answer.length > 100) score += 1;
      if (answer.length > 200) score += 1;
      if (answer.includes('خوب') || answer.includes('بله') || answer.includes('می‌توانم')) score += 1;
      if (answer.includes('مثال') || answer.includes('تجربه') || answer.includes('موقعیت')) score += 1;
      
      score = Math.min(score, 5);
      totalScore += score;
      
      return {
        question: index + 1,
        score,
        reasoning: score >= 4 ? 'پاسخ شما نشان‌دهنده آگاهی و تجربه خوبی در این زمینه است.' : 
                  score >= 3 ? 'در این زمینه مهارت متوسطی دارید.' :
                  'در این زمینه فضای بهبود وجود دارد.'
      };
    });

    return { totalScore, questionAnalysis };
  };

  const { totalScore, questionAnalysis } = analyzeAnswers();

  const getOverallAssessment = (score: number) => {
    if (score >= 66) return {
      level: 'فرد توانمند',
      description: 'این امتیاز نشان می‌دهد که شما مهارت‌های ارتباطی بین فردی خوبی دارید و در بیشتر موقعیت‌ها می‌توانید به طور موثری ارتباط برقرار کنید.',
      color: 'from-green-500 to-emerald-600',
      emoji: '🌟'
    };
    
    if (score >= 46) return {
      level: 'قابل بهبود',
      description: 'این امتیاز نشان می‌دهد که در برخی جنبه‌های مهارت‌های ارتباطی جای پیشرفت وجود دارد. شناسایی این زمینه‌ها اولین قدم برای تقویت آنهاست.',
      color: 'from-yellow-500 to-orange-600',
      emoji: '📈'
    };
    
    return {
      level: 'نیازمند توجه ویژه',
      description: 'در حال حاضر در مهارت‌های ارتباطی به تمرین و تقویت بیشتری نیاز دارید. این شناخت، شروع مسیر بهبود شماست.',
      color: 'from-blue-500 to-purple-600',
      emoji: '🎯'
    };
  };

  const assessment = getOverallAssessment(totalScore);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-spin">🧠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">در حال تحلیل پاسخ‌های شما...</h2>
          <p className="text-gray-600">لطفاً صبر کنید 💭</p>
          <div className="mt-8">
            <div className="flex justify-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className={`text-center mb-8 ${showResults ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="text-6xl mb-4">{assessment.emoji}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            خیلی ممنونم که وقت گذاشتی! 😊
          </h1>
          <p className="text-lg text-gray-700">
            حالا بر اساس پاسخ‌های شما، یک تحلیل آماده کردم:
          </p>
        </div>

        {/* Overall Results */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8 ${showResults ? 'animate-scale-in' : 'opacity-0'}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔸 پروفایل کلی مهارت‌های ارتباطی</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">۱. امتیاز کل:</h3>
            <div className="bg-gray-100 rounded-2xl p-4">
              <p className="text-lg">
                مجموع امتیازات شما برای ۱۹ عبارت: <strong className="text-2xl">{totalScore}</strong> (از حداکثر ۹۵ امتیاز ممکن)
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">۲. تفسیر امتیاز کل:</h3>
            <div className={`bg-gradient-to-r ${assessment.color} text-white rounded-2xl p-6`}>
              <h4 className="text-xl font-bold mb-3">سطح مهارت ارتباطی شما: {assessment.level}</h4>
              <p className="leading-relaxed">{assessment.description}</p>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8 ${showResults ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🔹 تحلیل جزء به جزء پاسخ‌ها</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questionAnalysis.map((analysis, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  سوال {analysis.question}: امتیاز {analysis.score} از ۵
                </h4>
                <p className="text-gray-700 text-sm">{analysis.reasoning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Message */}
        <div className={`text-center ${showResults ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              امیدوارم این تحلیل برات مفید بوده باشه. یادت باشه که این فقط یک نگاه کلی بر اساس این پرسشنامه بود و مهمترین چیز تلاش مستمر برای بهتر شدن در ارتباطاتمون هست. 😊
            </p>
          </div>

          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-6 py-3 rounded-xl"
          >
            <ArrowLeft className="ml-2 h-5 w-5" />
            بازگشت به صفحه اصلی
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
