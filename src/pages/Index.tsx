import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user, setCurrentQuestionnaire } = useAuth();

  const handleStartAssessment = () => {
    if (!user) {
      navigate('/login');
    } else {
      // همیشه با پرسشنامه شماره ۱ شروع می‌شود
      setCurrentQuestionnaire(1);
      navigate('/assessment');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-executive-pearl via-white to-executive-silver/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-executive-navy rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-executive-gold rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-4 bg-white/90 backdrop-blur-xl border-b border-executive-ash-light/30">
        <div className="max-w-full mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-executive-navy to-executive-navy-light rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-executive-charcoal leading-tight">سامانه ارزیابی مهارت‌های حرفه‌ای</h1>
              <p className="text-executive-ash text-xs">تحلیل دقیق و علمی مهارت‌های شما</p>
            </div>
          </div>
          
          {!user ? (
            <Button 
              onClick={handleLogin}
              className="bg-gradient-to-r from-executive-navy to-executive-navy-light text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              ورود به سیستم
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
          ) : (
            <div className="flex items-center gap-3 bg-executive-gold-light/20 px-4 py-2 rounded-xl border border-executive-gold/20">
              <div className="w-8 h-8 bg-gradient-to-br from-executive-gold to-executive-gold-light rounded-lg flex items-center justify-center">
                <span className="text-executive-charcoal font-bold text-sm">{user.firstName.charAt(0)}</span>
              </div>
              <span className="text-executive-charcoal font-medium">خوش آمدید، {user.firstName}</span>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-executive-gold-light/30 text-executive-charcoal px-4 py-2 rounded-full border border-executive-gold/30 mb-6">
            <Sparkles className="w-4 h-4 text-executive-gold" />
            <span className="text-sm font-semibold">پلتفرم ارزیابی هوشمند</span>
          </div>
          
          <h2 className="text-5xl font-bold text-executive-charcoal mb-6 leading-tight">
            مهارت‌های خود را
            <span className="text-transparent bg-gradient-to-r from-executive-navy to-executive-gold bg-clip-text"> دقیق بسنجید</span>
          </h2>
          
          <p className="text-xl text-executive-ash max-w-3xl mx-auto leading-relaxed mb-8">
            با استفاده از سناریوهای تعاملی و هوش مصنوعی، سطح مهارت‌های حرفه‌ای خود را ارزیابی کرده و گزارش جامع دریافت کنید.
          </p>
          
          <Button
              onClick={handleStartAssessment}
              className="bg-gradient-to-r from-executive-navy to-executive-navy-light text-white px-16 py-6 text-xl font-bold rounded-2xl shadow-luxury hover:shadow-executive transition-all duration-300 transform hover:scale-105"
            >
              شروع ارزیابی هوشمند
              <ArrowRight className="w-8 h-8 mr-4" />
            </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
