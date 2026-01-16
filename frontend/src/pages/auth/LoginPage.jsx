import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import CustomIcon from '@/components/CustomIcon';

const LoginPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { login, isAuthenticated, loading: authLoading } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const from = location.state?.from?.pathname || '/admin';

	useEffect(() => {
		if (isAuthenticated && !authLoading) {
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, authLoading, navigate, from]);

	/* ================= LOGIN HANDLER ================= */
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		if (!email || !password) {
			setError('Please enter email and password');
			setLoading(false);
			return;
		}

		// ✅ NORMAL LOGIN – ADMIN ROLE BACKEND SE AAYEGA
		const result = await login(email, password);

		if (result.success) {
			toast.success(`Welcome back, ${result.user.name}`);
			navigate(from, { replace: true });
		} else {
			setError(result.error || 'Invalid credentials');
		}

		setLoading(false);
	};

	if (authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-teal-600" />
			</div>
		);
	}

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Background */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: "url('/images/hero-rent.jpg')" }}
			/>
			<div className="absolute inset-0 bg-white/80 backdrop-blur-md" />

			{/* Card */}
			<div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
				{/* Logo */}
				<div className="text-center mb-6">
					<Link to="/" className="inline-flex items-center gap-3">
						<CustomIcon
							src="/images/orglogo.png"
							className="h-12 w-12"
							alt="InstaMakaan"
						/>
						<div className="text-left leading-tight">
							<p className="text-lg font-bold text-teal-600">Insta</p>
							<p className="text-lg font-bold text-yellow-500 -mt-1">
								Makaan
							</p>
						</div>
					</Link>
				</div>

				<Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl font-bold">
							Welcome Back
						</CardTitle>
						<CardDescription>
							Sign in to access your dashboard
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<div className="flex items-center gap-2 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
									<AlertCircle className="w-4 h-4" />
									{error}
								</div>
							)}

							{/* Email */}
							<div>
								<Label>Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<Input
										type="email"
										className="pl-10"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
							</div>

							{/* Password */}
							<div>
								<Label>Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<Input
										type={showPassword ? 'text' : 'password'}
										className="pl-10 pr-10"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2"
									>
										{showPassword ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
										)}
									</button>
								</div>
							</div>

							<Button
								type="submit"
								variant="teal"
								className="w-full"
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Signing in...
									</>
								) : (
									'Sign In'
								)}
							</Button>
						</form>

						<div className="mt-6 text-center text-sm">
							Don’t have an account?{' '}
							<Link
								to="/auth/register"
								className="text-teal-600 font-medium"
							>
								Sign up
							</Link>
						</div>

						<div className="mt-3 text-center">
							<Link to="/" className="text-xs text-gray-500">
								← Back to Home
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default LoginPage;