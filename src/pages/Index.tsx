
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Target, TrendingUp, Shield, Users, BarChart3, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { skillsApi, Skill } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedSkillId } = useAuth();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await skillsApi.getAll();
        setSkills(skillsData);
      } catch (error) {
        console.error('خطا در دریافت مهارت‌ها:', error);
        // Fallback skills in case of API error
        setSkills([
          { id: 1, name: 'مهارت‌های ارتباطی', description: 'ارتباط مؤثر با همکاران و مشتریان' },
          { id: 2, name: 'مهارت‌های رهبری', description: 'رهبری تیم و مدیریت پروژه' },
          { id: 3, name: 'کار تیمی', description: 'همکاری مؤثر در تیم‌های کاری' },
          { id: 4, name: 'حل مسئله', description: 'تحلیل و حل مسائل پیچیده' },
          { id: 5, name: 'مدیریت زمان', description: 'برنامه‌ریزی و اولویت‌بندی وظایف' },
          { id: 6, name: 'هوش عاطفی', description: 'درک و مدیریت احساسات خود و دیگران' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleSkillSelect = (skillId: number) => {
    setSelectedSkill(skillId);
  };

  const handleStartTest = () => {
    if (selectedSkill) {
      setSelectedSkillId(selectedSkill);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Status Bar */}
      <div className="h-6 bg-gradient-to-r from-blue-600 to-slate-700"></div>
      
      {/* Header */}
      <div className="px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">سامانه ارزیابی مهارت‌های ارتباطی</h1>
              <p className="text-xs text-slate-500">نسخه پیشرفته 2.0</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Main Hero Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-slate-700 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              ارزیابی جامع
              <br />
              <span className="text-blue-600">
                مهارت‌های ارتباطی سازمانی
              </span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed max-w-sm mx-auto">
              سامانه پیشرفته ارزیابی مهارت‌های بین‌فردی با روش‌های علمی و استاندارد
            </p>
          </div>
        </div>

        {/* Skills Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 text-center">
            مهارت مورد نظر خود را انتخاب کنید
          </h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-600 mt-2">در حال بارگذاری...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => handleSkillSelect(skill.id)}
                  className={`bg-white rounded-2xl p-4 shadow-sm border-2 cursor-pointer transition-all ${
                    selectedSkill === skill.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      selectedSkill === skill.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300'
                    }`}>
                      {selectedSkill === skill.id && (
                        <CheckCircle className="w-4 h-4 text-white fill-current" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">{skill.name}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">ارزیابی تخصصی</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  بررسی دقیق مهارت‌های ارتباطی بر اساس استانداردهای سازمانی
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">گزارش تحلیلی</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  ارائه گزارش جامع و راهکارهای بهبود عملکرد
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">ارزیابی تیمی</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  امکان ارزیابی مهارت‌های کار تیمی و رهبری
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-slate-700 rounded-2xl p-6 text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">مطابق</div>
              <div className="text-xs opacity-90">استاندارد</div>
            </div>
            <div>
              <div className="text-2xl font-bold">15</div>
              <div className="text-xs opacity-90">دقیقه</div>
            </div>
            <div>
              <div className="text-2xl font-bold">98%</div>
              <div className="text-xs opacity-90">دقت</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <Button 
            onClick={handleStartTest}
            disabled={!selectedSkill}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-2xl shadow-lg btn-press"
          >
            <span>شروع ارزیابی</span>
            <ArrowRight className="w-5 h-5 mr-2" />
          </Button>
          
          <p className="text-center text-sm text-slate-500">
            🔒 ارزیابی محرمانه و ایمن
          </p>
        </div>
      </div>

      {/* Bottom safe area */}
      <div className="h-8"></div>
    </div>
  );
};

export default Index;
