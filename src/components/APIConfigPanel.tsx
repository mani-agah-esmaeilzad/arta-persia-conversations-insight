import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Database, Code, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const APIConfigPanel = () => {
  const [apiBaseUrl, setApiBaseUrl] = useState('https://your-api-domain.com/api');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setConnectionStatus('success');
      toast.success('اتصال با موفقیت برقرار شد');
    } catch (error) {
      setConnectionStatus('error');
      toast.error('خطا در برقراری اتصال');
    }
  };

  const endpoints = [
    {
      category: 'Authentication',
      items: [
        { method: 'POST', path: '/auth/login', description: 'ورود کاربر با username/password' },
        { method: 'POST', path: '/auth/register', description: 'ثبت نام کاربر جدید' },
        { method: 'POST', path: '/auth/refresh', description: 'تجدید توکن احراز هویت' }
      ]
    },
    {
      category: 'Skills',
      items: [
        { method: 'GET', path: '/skills', description: 'دریافت لیست تمام مهارت‌ها' },
        { method: 'GET', path: '/skills/{id}', description: 'دریافت جزئیات یک مهارت' }
      ]
    },
    {
      category: 'Assessments',
      items: [
        { method: 'POST', path: '/assessments/start', description: 'شروع ارزیابی جدید' },
        { method: 'POST', path: '/assessments/{id}/chat', description: 'ارسال پیام چت' },
        { method: 'GET', path: '/assessments/{id}/messages', description: 'دریافت پیام‌های چت' },
        { method: 'PUT', path: '/assessments/{id}/complete', description: 'تکمیل ارزیابی' }
      ]
    },
    {
      category: 'Results',
      items: [
        { method: 'GET', path: '/results/assessment/{assessmentId}', description: 'نتایج یک ارزیابی' },
        { method: 'GET', path: '/results/user/{userId}', description: 'تمام نتایج کاربر' }
      ]
    }
  ];

  const dbTables = [
    {
      name: 'Users',
      description: 'جدول کاربران',
      fields: [
        'Id (int, PK, Auto)',
        'Username (nvarchar(50), Unique)',
        'PasswordHash (nvarchar(255))',
        'FirstName (nvarchar(100))',
        'LastName (nvarchar(100))',
        'Email (nvarchar(255))',
        'CreatedAt (datetime)',
        'UpdatedAt (datetime)'
      ]
    },
    {
      name: 'Skills',
      description: 'جدول مهارت‌ها',
      fields: [
        'Id (int, PK, Auto)',
        'Name (nvarchar(100))',
        'Description (nvarchar(500))',
        'Category (nvarchar(50))',
        'IsActive (bit)',
        'CreatedAt (datetime)'
      ]
    },
    {
      name: 'Assessments',
      description: 'جدول ارزیابی‌ها',
      fields: [
        'Id (int, PK, Auto)',
        'UserId (int, FK to Users)',
        'SkillId (int, FK to Skills)',
        'Status (nvarchar(20))', // started, in_progress, completed
        'StartedAt (datetime)',
        'CompletedAt (datetime, nullable)',
        'CreatedAt (datetime)'
      ]
    },
    {
      name: 'ChatMessages',
      description: 'جدول پیام‌های چت',
      fields: [
        'Id (int, PK, Auto)',
        'AssessmentId (int, FK to Assessments)',
        'MessageType (nvarchar(10))', // user, bot
        'Content (ntext)',
        'Timestamp (datetime)',
        'CreatedAt (datetime)'
      ]
    },
    {
      name: 'Results',
      description: 'جدول نتایج ارزیابی',
      fields: [
        'Id (int, PK, Auto)',
        'AssessmentId (int, FK to Assessments)',
        'Score (decimal(5,2), nullable)',
        'Analysis (ntext)',
        'Strengths (ntext)',
        'Weaknesses (ntext)',
        'Recommendations (ntext)',
        'CreatedAt (datetime)'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-executive-pearl via-white to-executive-silver/20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-executive-navy to-executive-navy-light rounded-2xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-executive-charcoal">تنظیمات API و دیتابیس</h1>
            <p className="text-executive-ash">پیکربندی بک‌اند .NET Core و MySQL</p>
          </div>
        </div>

        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">پیکربندی API</TabsTrigger>
            <TabsTrigger value="endpoints">مستندات API</TabsTrigger>
            <TabsTrigger value="database">ساختار دیتابیس</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  تنظیمات اتصال API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">آدرس پایه API</label>
                  <Input
                    value={apiBaseUrl}
                    onChange={(e) => setApiBaseUrl(e.target.value)}
                    placeholder="https://your-api-domain.com/api"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <Button onClick={testConnection} disabled={connectionStatus === 'testing'}>
                    {connectionStatus === 'testing' ? 'در حال تست...' : 'تست اتصال'}
                  </Button>
                  
                  {connectionStatus === 'success' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">اتصال موفق</span>
                    </div>
                  )}
                  
                  {connectionStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">خطا در اتصال</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints">
            <div className="grid gap-6">
              {endpoints.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.items.map((endpoint, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-executive-pearl/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm text-executive-navy font-mono">
                              {endpoint.path}
                            </code>
                          </div>
                          <span className="text-sm text-executive-ash">
                            {endpoint.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="database">
            <div className="grid gap-6">
              {dbTables.map((table) => (
                <Card key={table.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      {table.name}
                    </CardTitle>
                    <p className="text-executive-ash">{table.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {table.fields.map((field, index) => (
                        <div key={index} className="p-2 bg-executive-pearl/20 rounded font-mono text-sm">
                          {field}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default APIConfigPanel;