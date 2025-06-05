
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Target, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Status Bar Simulation */}
      <div className="h-6 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      
      {/* Header */}
      <div className="px-6 py-4 bg-white/70 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">تحلیلگر ارتباط</h1>
              <p className="text-xs text-gray-500">نسخه 1.0</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Main Hero Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 animate-bounce-gentle shadow-lg">
              <span className="text-4xl">🧠</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              مهارت‌های ارتباطی خود را
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                کشف کنید
              </span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">
              یک ارزیابی هوشمند ۱۹ سوالی که نقاط قوت و قابل بهبود شما را شناسایی می‌کند
            </p>
          </div>
        </div>

        {/* Features Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">ارزیابی دقیق</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  شناسایی دقیق نقاط قوت و ضعف در ارتباطات بین‌فردی شما
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">راهکار بهبود</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  دریافت پیشنهادات عملی برای تقویت مهارت‌های ارتباطی
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">تحلیل هوشمند</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  گزارش جامع بر اساس روش‌های علمی و معتبر روان‌شناسی
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">19</div>
              <div className="text-xs opacity-90">سوال</div>
            </div>
            <div>
              <div className="text-2xl font-bold">10</div>
              <div className="text-xs opacity-90">دقیقه</div>
            </div>
            <div>
              <div className="text-2xl font-bold">95%</div>
              <div className="text-xs opacity-90">دقت</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <Button 
            onClick={handleStartTest}
            className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg font-semibold rounded-2xl shadow-lg btn-press"
          >
            <span>شروع ارزیابی</span>
            <ArrowRight className="w-5 h-5 mr-2" />
          </Button>
          
          <p className="text-center text-sm text-gray-500">
            ⏱️ حدود ۱۰-۱۵ دقیقه زمان می‌برد
          </p>
        </div>
      </div>

      {/* Bottom safe area */}
      <div className="h-8"></div>
    </div>
  );
};

export default Index;
