
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-50 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200 rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute bottom-40 right-32 w-12 h-12 bg-yellow-200 rounded-full opacity-60 animate-bounce"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              🧠 تحلیلگر مهارت‌های ارتباطی
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              مهارت‌های ارتباطی خود را کشف کنید و بهبود دهید
            </p>
          </div>

          {/* Main Character/Icon */}
          <div className="mb-12 animate-scale-in">
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-6xl md:text-7xl mb-6 shadow-2xl hover-scale">
              💬
            </div>
          </div>

          {/* Description */}
          <div className="mb-12 animate-fade-in">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-white/30">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                یک گفتگوی ۱۹ سوالی دوستانه که به شما کمک می‌کند:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-2xl p-6 hover-scale">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-semibold text-blue-800 mb-2">شناخت دقیق</h3>
                  <p className="text-blue-700 text-sm">نقاط قوت و ضعف ارتباطی خود را بشناسید</p>
                </div>
                
                <div className="bg-purple-50 rounded-2xl p-6 hover-scale">
                  <div className="text-3xl mb-3">📈</div>
                  <h3 className="font-semibold text-purple-800 mb-2">رشد مهارت</h3>
                  <p className="text-purple-700 text-sm">راه‌های بهبود ارتباطات خود را یاد بگیرید</p>
                </div>
                
                <div className="bg-pink-50 rounded-2xl p-6 hover-scale">
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="font-semibold text-pink-800 mb-2">تحلیل هوشمند</h3>
                  <p className="text-pink-700 text-sm">گزارش جامع و کاربردی دریافت کنید</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in">
            <Button 
              onClick={handleStartTest}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-xl rounded-2xl shadow-xl hover-scale transition-all duration-300"
            >
              شروع گفتگو
              <ArrowRight className="mr-2 h-6 w-6" />
            </Button>
            
            <p className="text-gray-600 mt-4 text-sm">
              ⏱️ حدود ۱۰-۱۵ دقیقه زمان می‌برد
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
