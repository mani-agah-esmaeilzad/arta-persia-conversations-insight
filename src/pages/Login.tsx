
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { selectedSkillId, setUser } = useAuth();
  
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    otp: '',
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    educationLevel: '',
    workExperience: ''
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phoneNumber.trim()) return;
    
    setLoading(true);
    try {
      await authApi.sendOtp(formData.phoneNumber);
      setStep('otp');
      toast.success('کد تأیید ارسال شد');
    } catch (error) {
      toast.error('خطا در ارسال کد تأیید');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp.trim()) return;
    
    setLoading(true);
    try {
      const result = await authApi.verifyOtp(formData.phoneNumber, formData.otp);
      if (result.userExists) {
        setUser(result.user);
        navigate('/assessment');
      } else {
        setStep('register');
      }
    } catch (error) {
      toast.error('کد تأیید نادرست است');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) return;
    
    setLoading(true);
    try {
      const result = await authApi.register({
        phoneNumber: formData.phoneNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        educationLevel: formData.educationLevel || undefined,
        workExperience: formData.workExperience || undefined
      });
      
      setUser(result.user);
      navigate('/assessment');
    } catch (error) {
      toast.error('خطا در ثبت‌نام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Status Bar */}
      <div className="h-6 bg-gradient-to-r from-blue-600 to-slate-700"></div>
      
      {/* Header */}
      <div className="px-6 py-4 bg-white/90 backdrop-blur-lg border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">سامانه ارزیابی مهارت‌های ارتباطی</h1>
            <p className="text-sm text-slate-600">ورود به حساب کاربری</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Selected Skill Display */}
          {selectedSkillId && (
            <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="text-sm font-medium text-blue-900 mb-2">مهارت انتخاب شده</h3>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                مهارت #{selectedSkillId}
              </span>
            </div>
          )}

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {step === 'phone' ? 'ورود با شماره موبایل' : 
               step === 'otp' ? 'تأیید شماره موبایل' : 
               'تکمیل اطلاعات'}
            </h2>
            <p className="text-slate-600">
              {step === 'phone' ? 'شماره موبایل خود را وارد کنید' : 
               step === 'otp' ? 'کد تأیید ارسال شده را وارد کنید' : 
               'اطلاعات خود را تکمیل کنید'}
            </p>
          </div>

          {/* Phone Step */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-slate-700 font-medium">شماره موبایل *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="mt-1 border-slate-300 focus:border-blue-500"
                  placeholder="09123456789"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={!formData.phoneNumber.trim() || loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl mt-6 btn-press"
              >
                {loading ? 'در حال ارسال...' : 'ارسال کد تأیید'}
              </Button>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <Label htmlFor="otp" className="text-slate-700 font-medium">کد تأیید *</Label>
                <Input
                  id="otp"
                  type="text"
                  value={formData.otp}
                  onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value }))}
                  className="mt-1 border-slate-300 focus:border-blue-500"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={!formData.otp.trim() || loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl mt-6 btn-press"
              >
                {loading ? 'در حال تأیید...' : 'تأیید کد'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('phone')}
                className="w-full h-12 rounded-xl"
              >
                بازگشت
              </Button>
            </form>
          )}

          {/* Registration Step */}
          {step === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-slate-700 font-medium">نام *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="mt-1 border-slate-300 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-slate-700 font-medium">نام خانوادگی *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="mt-1 border-slate-300 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-medium text-slate-700 mb-3">اطلاعات تکمیلی (اختیاری)</h3>
                
                <div>
                  <Label htmlFor="email" className="text-slate-600">ایمیل</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="mt-3">
                  <Label htmlFor="age" className="text-slate-600">سن</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="mt-1 border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="mt-3">
                  <Label htmlFor="education" className="text-slate-600">سطح تحصیلات</Label>
                  <Input
                    id="education"
                    value={formData.educationLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, educationLevel: e.target.value }))}
                    className="mt-1 border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="mt-3">
                  <Label htmlFor="experience" className="text-slate-600">سابقه کاری</Label>
                  <Input
                    id="experience"
                    value={formData.workExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, workExperience: e.target.value }))}
                    className="mt-1 border-slate-300 focus:border-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!formData.firstName.trim() || !formData.lastName.trim() || loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl mt-6 btn-press"
              >
                {loading ? 'در حال ثبت‌نام...' : 'تکمیل ثبت‌نام'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
