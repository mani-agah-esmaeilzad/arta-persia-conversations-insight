import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== passwordConfirmation) {
            setError('رمزهای عبور یکسان نیستند.');
            return;
        }
        setLoading(true);
        try {
            await register({ name, email, password, password_confirmation: passwordConfirmation });
            navigate('/');
        } catch (err: any) {
            if (err.response && err.response.status === 422) {
                // Handle validation errors from Laravel
                const validationErrors = err.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat().join('\n');
                setError(errorMessages);
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">ثبت‌نام</CardTitle>
                    <CardDescription>برای ساخت حساب کاربری جدید، اطلاعات زیر را وارد کنید</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">نام</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">ایمیل</Label>
                                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">رمز عبور</Label>
                                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="password-confirm">تکرار رمز عبور</Label>
                                <Input id="password-confirm" type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} required />
                            </div>
                            {error && <p className="text-red-500 text-sm whitespace-pre-line">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'در حال ساخت حساب...' : 'ثبت‌نام'}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        حساب کاربری دارید؟{" "}
                        <Link to="/login" className="underline">
                            وارد شوید
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

