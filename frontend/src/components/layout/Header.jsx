import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomIcon from '@/components/CustomIcon';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
	{ name: 'Home', path: '/' },
	{ name: 'Partner With Us', path: '/partner' },
	{ name: 'Blog', path: '/blog' },
	{ name: 'About Us', path: '/about' },
	{ name: 'Refer & Earn', path: '/refer' },
	{ name: 'FAQ', path: '/faq' },
];

export const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [theme, setTheme] = useState('light');
	const location = useLocation();

	/* SCROLL EFFECT */
	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 8);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	/* THEME INIT */
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') || 'light';
		setTheme(savedTheme);
		document.documentElement.classList.toggle('dark', savedTheme === 'dark');
	}, []);

	/* TOGGLE THEME */
	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
		document.documentElement.classList.toggle('dark', newTheme === 'dark');
	};

	const isActive = (path) => location.pathname === path;

	return (
		<header
			className={cn(
				'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
				isScrolled
					? 'bg-white/90 dark:bg-[#0b1220]/85 backdrop-blur-xl shadow-sm'
					: 'bg-white/80 dark:bg-[#0b1220]/70 backdrop-blur-lg'
			)}
		>
			<div className="container-custom">
				<div className="flex items-center h-14">
					{/* LOGO */}
					<Link to="/" className="flex items-center gap-2">
						<CustomIcon
							src="/images/orglogo.png"
							className="h-8 w-8"
							alt="InstaMakaan Logo"
						/>
						<div className="leading-tight">
							<div className="text-sm font-bold text-slate-900 dark:text-teal-400">
								Insta
							</div>
							<div className="text-sm font-bold text-slate-900 dark:text-yellow-400 -mt-1">
								Makaan
							</div>
						</div>
					</Link>

					{/* RIGHT SIDE */}
					<div className="ml-auto flex items-center gap-7">
						{/* NAV */}
						<nav className="hidden lg:flex items-center gap-10">
							{navLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className={cn(
										'text-sm font-medium transition-colors',
										isActive(link.path)
											? 'text-teal-600 dark:text-teal-400'
											: 'text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
									)}
								>
									{link.name}
								</Link>
							))}
						</nav>

						{/* ACTIONS */}
						<div className="hidden lg:flex items-center gap-4">
							<Button variant="yellow" size="sm" asChild>
								<Link to="/partner">Get Owners</Link>
							</Button>

							<Button variant="teal" size="sm" asChild>
								<Link to="/properties">Find a Verified Home</Link>
							</Button>

							{/* THEME TOGGLE */}
							<button
								onClick={toggleTheme}
								className="
									w-9 h-9 flex items-center justify-center rounded-full
									border border-slate-300 dark:border-white/10
									text-slate-700 dark:text-slate-200
									bg-white/70 dark:bg-white/5
									hover:scale-105 transition-all
								"
							>
								{theme === 'light' ? (
									<Moon className="w-4 h-4" />
								) : (
									<Sun className="w-4 h-4" />
								)}
							</button>

							{/* LOGIN */}
							<Link
								to="/auth/login"
								className="
									flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full
									border border-slate-300 dark:border-white/10
									text-slate-700 dark:text-slate-200
									hover:border-teal-500 hover:text-teal-600
									dark:hover:text-teal-400
									transition
								"
							>
								<User className="w-4 h-4" />
								Login
							</Link>
						</div>
					</div>

					{/* MOBILE */}
					<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
						<SheetTrigger asChild className="lg:hidden ml-auto">
							<Button variant="ghost" size="icon">
								<Menu className="w-5 h-5 text-slate-900 dark:text-slate-200" />
							</Button>
						</SheetTrigger>

						<SheetContent
							side="right"
							className="w-[300px] p-4 bg-white dark:bg-[#0b1220]"
						>
							<nav className="space-y-2">
								{navLinks.map((link) => (
									<Link
										key={link.path}
										to={link.path}
										onClick={() => setIsMobileMenuOpen(false)}
										className="
											block px-4 py-2 rounded-lg
											text-slate-700 dark:text-slate-200
											hover:bg-slate-100 dark:hover:bg-white/10
										"
									>
										{link.name}
									</Link>
								))}

								<button
									onClick={toggleTheme}
									className="
										w-full mt-3 px-4 py-2 rounded-lg border
										text-sm flex items-center justify-center gap-2
										text-slate-700 dark:text-slate-200
										border-slate-300 dark:border-white/10
									"
								>
									{theme === 'light' ? (
										<Moon className="w-4 h-4" />
									) : (
										<Sun className="w-4 h-4" />
									)}
									Toggle Theme
								</button>

								<Link
									to="/auth/login"
									className="
										block mt-3 px-4 py-2 rounded-lg border text-center
										text-slate-700 dark:text-slate-200
										border-slate-300 dark:border-white/10
									"
								>
									Login
								</Link>

								<div className="pt-4 space-y-2">
									<Button variant="yellow" size="sm" className="w-full" asChild>
										<Link to="/partner">Get Owners</Link>
									</Button>
									<Button variant="teal" size="sm" className="w-full" asChild>
										<Link to="/properties">Find a Verified Home</Link>
									</Button>
								</div>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
};
