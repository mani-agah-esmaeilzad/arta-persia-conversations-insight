
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSkills = location.state?.selectedSkills || [];
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    province: '',
    city: '',
    phone: '',
    email: '',
    organization: '',
    position: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // فعلاً فقط به صفحه ارزیابی می‌رود
    navigate('/assessment', { state: { selectedSkills, userInfo: formData } });
  };

  const isFormValid = () => {
    if (isLogin) {
      return formData.phone;
    }
    return formData.firstName && formData.lastName && formData.province && 
           formData.city && formData.phone;
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
          {/* Selected Skills Display */}
          {selectedSkills.length > 0 && (
            <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="text-sm font-medium text-blue-900 mb-2">مهارت‌های انتخاب شده:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill: string, index: number) => (
                  <span key={index} className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {isLogin ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری'}
            </h2>
            <p className="text-slate-600">
              {isLogin ? 'شماره موبایل خود را وارد کنید' : 'اطلاعات خود را وارد کنید'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                {/* Required Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">نام *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="mt-1 border-slate-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">نام خانوادگی *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="mt-1 border-slate-300 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="province" className="text-slate-700 font-medium">استان *</Label>
                    <Input
                      id="province"
                      value={formData.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      className="mt-1 border-slate-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-slate-700 font-medium">شهر *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="mt-1 border-slate-300 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">اطلاعات تکمیلی (اختیاری)</h3>
                  
                  <div>
                    <Label htmlFor="email" className="text-slate-600">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1 border-slate-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-3">
                    <Label htmlFor="organization" className="text-slate-600">سازمان یا شرکت</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      className="mt-1 border-slate-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-3">
                    <Label htmlFor="position" className="text-slate-600">سمت یا نقش شغلی</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="mt-1 border-slate-300 focus:border-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Phone Number - Main field */}
            <div className={!isLogin ? 'pt-4 border-t border-slate-200' : ''}>
              <div>
                <Label htmlFor="phone" className="text-slate-700 font-medium">شماره موبایل *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1 border-slate-300 focus:border-blue-500"
                  placeholder="09123456789"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid()}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl mt-6 btn-press"
            >
              {isLogin ? 'ورود' : 'ایجاد حساب کاربری'}
            </Button>
          </form>

          {/* Toggle between login/signup */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : 'حساب کاربری دارید؟ وارد شوید'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
