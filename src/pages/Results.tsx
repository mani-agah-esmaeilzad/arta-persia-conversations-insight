
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Download, Star, TrendingUp, Award, Brain, LucideIcon } from 'lucide-react';

// A map to resolve icon names from the N8N agent to actual components
const iconMap: { [key: string]: LucideIcon } = {
  Award,
  TrendingUp,
  Star,
};

interface Analysis {
  totalScore: number;
  questionAnalysis: Array<{
    question: number;
    score: number;
    reasoning: string;
  }>;
  assessment: {
    level: string;
    description: string;
    color: string;
    bgColor: string;
    icon: string; // The name of the icon as a string
  };
}

interface LocationState {
  analysis: Analysis;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showResults, setShowResults] = useState(false);
  
  const state = location.state as LocationState;
  const analysis = state?.analysis;

  useEffect(() => {
    if (!analysis) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setTimeout(() => setShowResults(true), 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [analysis, navigate]);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Status Bar */}
        <div className="h-6 bg-gradient-to-r from-purple-600 to-blue-600"></div>
        
        <div className="flex items-center justify-center min-h-[calc(100vh-24px)]">
          <div className="text-center px-6 space-y-8">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center animate-pulse">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-300 to-blue-300 rounded-3xl blur opacity-50 animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                در حال تحلیل پاسخ‌ها...
              </h2>
              <p className="text-gray-600">
                هوش مصنوعی در حال بررسی دقیق پاسخ‌های شماست
              </p>
            </div>

            <div className="flex justify-center items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This check is important for type safety after the loading state
  if (!analysis) {
    return null;
  }

  const { totalScore, questionAnalysis, assessment } = analysis;
  const AssessmentIcon = iconMap[assessment.icon] || Star; // Fallback to Star icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Status Bar */}
      <div className="h-6 bg-gradient-to-r from-purple-600 to-blue-600"></div>
      
      {/* Header */}
      <div className="px-6 py-4 bg-white/70 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center btn-press"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">نتایج ارزیابی</h1>
              <p className="text-xs text-gray-500">گزارش کامل</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center btn-press">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center btn-press">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Success Message */}
        <div className={`text-center space-y-4 ${showResults ? 'animate-scale-in' : 'opacity-0'}`}>
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">تبریک! ارزیابی تکمیل شد</h2>
            <p className="text-gray-600 text-sm">نتایج کامل شما آماده است</p>
          </div>
        </div>

        {/* Main Result Card */}
        <div className={`bg-gradient-to-br ${assessment.bgColor} rounded-2xl p-6 border border-gray-100 shadow-sm ${showResults ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="text-center space-y-4">
            <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${assessment.color} rounded-2xl flex items-center justify-center`}>
              <AssessmentIcon className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {assessment.level}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {assessment.description}
              </p>
            </div>

            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-3xl font-bold text-gray-900">{totalScore}</div>
              <div className="text-sm text-gray-600">از ۹۵ امتیاز کل</div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${showResults ? 'animate-slide-up' : 'opacity-0'}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            تحلیل تفصیلی
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {questionAnalysis.slice(0, 5).map((analysis, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    سوال {analysis.question}
                  </div>
                  <div className="text-xs text-gray-600">
                    {analysis.reasoning}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-gray-900">
                    {analysis.score}
                  </div>
                  <div className="text-xs text-gray-500">/۵</div>
                </div>
              </div>
            ))}
            
            {questionAnalysis.length > 5 && (
              <div className="text-center py-2">
                <button className="text-sm text-blue-600 font-medium">
                  مشاهده همه ({questionAnalysis.length - 5} مورد دیگر)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className={`bg-blue-50 rounded-2xl p-6 border border-blue-100 ${showResults ? 'animate-slide-up' : 'opacity-0'}`}>
          <h3 className="text-lg font-bold text-blue-900 mb-3">💡 پیشنهادات بهبود</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• تمرین گوش دادن فعال در گفتگوهای روزانه</p>
            <p>• شرکت در کارگاه‌های مهارت‌های ارتباطی</p>
            <p>• تمرین بیان احساسات به شکل سازنده</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`space-y-3 ${showResults ? 'animate-slide-up' : 'opacity-0'}`}>
          <Button
            onClick={() => navigate('/assessment')}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl btn-press"
          >
            ارزیابی مجدد
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full h-12 rounded-xl font-medium btn-press"
          >
            بازگشت به صفحه اصلی
          </Button>
        </div>
      </div>

      {/* Bottom safe area */}
      <div className="h-8"></div>
    </div>
  );
};

export default Results;
