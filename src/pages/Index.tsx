import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Users, Award, TrendingUp, Shield, Sparkles, ChevronRight, Star, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { skillsApi, Skill } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const { user, setSelectedSkillId } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await skillsApi.getAll();
        setSkills(skillsData);
      } catch (error) {
        console.error('خطا در دریافت مهارت‌ها:', error);
        // Mock data برای نمایش
        setSkills([
          { id: 1, name: 'مهارت‌های ارتباطی', description: 'ارزیابی توانایی برقراری ارتباط مؤثر', category: 'soft-skills', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 2, name: 'رهبری و مدیریت', description: 'سنجش قابلیت‌های رهبری و مدیریت تیم', category: 'leadership', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 3, name: 'حل مسئله', description: 'ارزیابی توانایی تحلیل و حل مسائل پیچیده', category: 'analytical', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 4, name: 'کار تیمی', description: 'سنجش مهارت همکاری و کار گروهی', category: 'collaboration', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleSkillSelect = (skillId: number) => {
    setSelectedSkill(skillId);
    setSelectedSkillId(skillId);
  };

  const handleStartAssessment = () => {
    if (!selectedSkill) {
      toast.error('لطفاً یک مهارت انتخاب کنید');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    navigate('/assessment');
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
      <header className="relative z-10 px-8 py-6 bg-white/90 backdrop-blur-xl border-b border-executive-ash-light/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-executive-navy to-executive-navy-light rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-executive-charcoal">سامانه ارزیابی مهارت‌های حرفه‌ای</h1>
              <p className="text-executive-ash text-sm">تحلیل دقیق و علمی مهارت‌های شما</p>
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
            <span className="text-sm font-semibold">سیستم ارزیابی هوشمند</span>
          </div>
          
          <h2 className="text-5xl font-bold text-executive-charcoal mb-6 leading-tight">
            مهارت‌های خود را
            <span className="text-transparent bg-gradient-to-r from-executive-navy to-executive-gold bg-clip-text"> دقیق بسنجید</span>
          </h2>
          
          <p className="text-xl text-executive-ash max-w-3xl mx-auto leading-relaxed mb-8">
            با استفاده از روش‌های علمی و هوش مصنوعی، سطح مهارت‌های حرفه‌ای خود را ارزیابی کرده و گزارش جامع دریافت کنید
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-executive-ash-light/30 shadow-subtle">
              <div className="w-12 h-12 bg-executive-navy/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-executive-navy" />
              </div>
              <h3 className="text-2xl font-bold text-executive-charcoal mb-2">+۱۰,۰۰۰</h3>
              <p className="text-executive-ash">کاربر فعال</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-executive-ash-light/30 shadow-subtle">
              <div className="w-12 h-12 bg-executive-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-executive-gold" />
              </div>
              <h3 className="text-2xl font-bold text-executive-charcoal mb-2">۹۸٪</h3>
              <p className="text-executive-ash">دقت ارزیابی</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-executive-ash-light/30 shadow-subtle">
              <div className="w-12 h-12 bg-executive-navy/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-executive-navy" />
              </div>
              <h3 className="text-2xl font-bold text-executive-charcoal mb-2">+۵۰</h3>
              <p className="text-executive-ash">مهارت قابل ارزیابی</p>
            </div>
          </div>
        </div>

        {/* Skills Selection */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-executive-charcoal mb-4">مهارت مورد نظر خود را انتخاب کنید</h3>
            <p className="text-executive-ash text-lg">برای شروع ارزیابی، یکی از مهارت‌های زیر را انتخاب نمایید</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-executive-ash-light/30 animate-pulse">
                  <div className="w-12 h-12 bg-executive-ash-light rounded-xl mb-4"></div>
                  <div className="h-6 bg-executive-ash-light rounded mb-2"></div>
                  <div className="h-4 bg-executive-ash-light rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => handleSkillSelect(skill.id)}
                  className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] shadow-subtle hover:shadow-executive ${
                    selectedSkill === skill.id
                      ? 'border-executive-navy bg-gradient-to-br from-executive-navy/5 to-executive-gold/5 shadow-executive'
                      : 'border-executive-ash-light/50 hover:border-executive-navy/30'
                  }`}
                >
                  {selectedSkill === skill.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-executive-gold rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-3 h-3 text-executive-charcoal" fill="currentColor" />
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      selectedSkill === skill.id 
                        ? 'bg-gradient-to-br from-executive-navy to-executive-navy-light text-white' 
                        : 'bg-executive-ash-light/50 text-executive-ash group-hover:bg-executive-navy/10 group-hover:text-executive-navy'
                    }`}>
                      <Target className="w-7 h-7" />
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                      selectedSkill === skill.id ? 'text-executive-navy' : 'text-executive-ash group-hover:text-executive-navy'
                    }`} />
                  </div>
                  
                  <h4 className="text-xl font-bold text-executive-charcoal mb-3 group-hover:text-executive-navy transition-colors">
                    {skill.name}
                  </h4>
                  <p className="text-executive-ash leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Start Button */}
        <div className="text-center">
          <Button
            onClick={handleStartAssessment}
            disabled={!selectedSkill}
            className="bg-gradient-to-r from-executive-navy to-executive-navy-light text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-luxury hover:shadow-executive transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            شروع ارزیابی
            <ArrowRight className="w-6 h-6 mr-3" />
          </Button>
          
          {!selectedSkill && (
            <p className="text-executive-ash text-sm mt-4">
              برای شروع ارزیابی، ابتدا یک مهارت انتخاب کنید
            </p>
          )}
        </div>

        {/* Features */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-executive-navy/10 to-executive-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-executive-navy/20 group-hover:to-executive-navy/10 transition-all duration-300">
              <TrendingUp className="w-8 h-8 text-executive-navy" />
            </div>
            <h4 className="text-xl font-bold text-executive-charcoal mb-3">ارزیابی دقیق</h4>
            <p className="text-executive-ash leading-relaxed">
              با استفاده از الگوریتم‌های پیشرفته و روش‌های علمی، دقیق‌ترین ارزیابی را دریافت کنید
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-executive-gold/10 to-executive-gold/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-executive-gold/20 group-hover:to-executive-gold/10 transition-all duration-300">
              <Award className="w-8 h-8 text-executive-gold" />
            </div>
            <h4 className="text-xl font-bold text-executive-charcoal mb-3">گزارش جامع</h4>
            <p className="text-executive-ash leading-relaxed">
              گزارش کاملی از نقاط قوت، ضعف و راهکارهای بهبود مهارت‌های خود دریافت کنید
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-executive-charcoal/10 to-executive-charcoal/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-executive-charcoal/20 group-hover:to-executive-charcoal/10 transition-all duration-300">
              <Shield className="w-8 h-8 text-executive-charcoal" />
            </div>
            <h4 className="text-xl font-bold text-executive-charcoal mb-3">امنیت بالا</h4>
            <p className="text-executive-ash leading-relaxed">
              اطلاعات شما با بالاترین استانداردهای امنیتی محافظت و نگهداری می‌شود
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;