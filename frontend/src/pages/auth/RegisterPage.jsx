import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import {
	Mail,
	Lock,
	User,
	Loader2,
	Eye,
	EyeOff,
	AlertCircle,
	CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import CustomIcon from '@/components/CustomIcon';

const RegisterPage = () => {
	const navigate = useNavigate();
	const { register, isAuthenticated, loading: authLoading } = useAuth();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (isAuthenticated && !authLoading) {
			navigate('/admin', { replace: true });
		}
	}, [isAuthenticated, authLoading, navigate]);

	const passwordRequirements = [
		{ label: 'At least 6 characters', met: password.length >= 6 },
		{ label: 'Contains a number', met: /\d/.test(password) },
		{
			label: 'Passwords match',
			met: password === confirmPassword && password.length > 0,
		},
	];

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!name || !email || !password || !confirmPassword) {
			setError('Please fill in all fields');
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setLoading(true);
		const result = await register(name, email, password, 'admin');

		if (result.success) {
			toast.success('Account created successfully!');
			navigate('/admin', { replace: true });
		} else {
			setError(result.error);
		}

		setLoading(false);
	};

	if (authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Background Image */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: "url('/images/hero-rent.jpg')" }}
			/>
			<div className="absolute inset-0 bg-white/25 backdrop-blur-md" />

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
							<p className="text-lg font-bold text-primary">Insta</p>
							<p className="text-lg font-bold text-accent -mt-1">Makaan</p>
						</div>
					</Link>
				</div>

				<Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl font-bold">Create Account</CardTitle>
						<CardDescription>Sign up to manage your properties</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<div className="flex items-center gap-2 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
									<AlertCircle className="w-4 h-4" />
									{error}
								</div>
							)}

							{/* Name */}
							<div>
								<Label>Full Name</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<Input
										className="pl-10"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
							</div>

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

							{/* Confirm Password */}
							<div>
								<Label>Confirm Password</Label>
								<Input
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
							</div>

							{/* Password Rules */}
							<div className="space-y-1 text-xs">
								{passwordRequirements.map((req, i) => (
									<div
										key={i}
										className={`flex items-center gap-2 ${
											req.met ? 'text-green-600' : 'text-gray-400'
										}`}
									>
										<CheckCircle2 className="w-3 h-3" />
										{req.label}
									</div>
								))}
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
										Creating account...
									</>
								) : (
									'Create Account'
								)}
							</Button>
						</form>

						<div className="mt-6 text-center text-sm">
							Already have an account?{' '}
							<Link to="/auth/login" className="text-primary font-medium">
								Sign in
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

export default RegisterPage;
