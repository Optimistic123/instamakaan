import React from 'react';
import { Link } from 'react-router-dom';
import {
	Facebook,
	Instagram,
	Linkedin,
	Phone,
	Mail,
	MapPin,
} from 'lucide-react';

const navigationLinks = [
	{ name: 'Home', path: '/' },
	{ name: 'Partner with us', path: '/partner' },
	{ name: 'Explore Property', path: '/properties' },
	{ name: 'About Us', path: '/about' },
	{ name: 'Contact Us', path: '/contact' },
];

const serviceLinks = [
	{ name: 'Managed Rental Service', path: '/properties?type=pre-occupied' },
	{ name: '15-Day Brokerage', path: '/properties?type=rent' },
	{ name: 'Buy Property', path: '/properties?type=buy' },
	{ name: 'Blog', path: '/blog' },
	{ name: 'FAQs', path: '/faq' },
];

const socialLinks = [
	{ name: 'Facebook', icon: Facebook, url: '#' },
	{ name: 'Instagram', icon: Instagram, url: '#' },
	{ name: 'LinkedIn', icon: Linkedin, url: '#' },
];

export const Footer = () => {
	return (
		<footer className="bg-green-100 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 transition-colors">
			<div className="container-custom py-14 md:py-18">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<Link to="/" className="flex items-center gap-3 mb-5">
							<div className="w-12 h-12 rounded-xl bg-slate-200/70 dark:bg-white/10 flex items-center justify-center">
								<span className="text-xl font-bold">
									<span className="text-slate-900 dark:text-teal-400">I</span>
									<span className="text-slate-900 dark:text-yellow-400">M</span>
								</span>
							</div>

							<div>
								<span className="text-xl font-bold text-teal-600">Insta</span>
								<span className="text-xl font-bold text-yellow-500">
									Makaan
								</span>
							</div>
						</Link>

						<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
							Delivering rental Sukoon to property owners and tenants. Our
							mission is to be the most trusted, professional, and reliable name
							in real estate.
						</p>

						<div className="flex items-center gap-3">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.url}
									aria-label={social.name}
									className="
										w-10 h-10 rounded-xl flex items-center justify-center
										bg-slate-200/70 dark:bg-white/10
										text-slate-700 dark:text-slate-300
										hover:bg-teal-600 hover:text-white
										transition-all duration-300
									"
								>
									<social.icon className="w-5 h-5" />
								</a>
							))}
						</div>
					</div>

					{/* Navigation */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Navigation</h3>
						<ul className="space-y-3">
							{navigationLinks.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 transition"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Services */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Services</h3>
						<ul className="space-y-3">
							{serviceLinks.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 transition"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Contact</h3>
						<ul className="space-y-4">
							<li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
								<Phone className="w-4 h-4" />
								+91 99999 00000
							</li>
							<li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
								<Mail className="w-4 h-4" />
								contact@instamakaan.com
							</li>
							<li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
								<MapPin className="w-4 h-4 mt-0.5" />
								<span>
									Office Address, Sector 62,
									<br />
									Noida, UP
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom */}
			<div className="border-t border-slate-200 dark:border-white/10">
				<div className="container-custom py-6">
					<div className="flex flex-col sm:flex-row justify-between gap-4 text-sm text-slate-600 dark:text-slate-400">
						<p>©️ 2025 InstaMakaan. All Rights Reserved.</p>
						<div className="flex gap-4">
							<Link to="/privacy" className="hover:text-teal-600 transition">
								Privacy Policy
							</Link>
							<span>|</span>
							<Link to="/terms" className="hover:text-teal-600 transition">
								Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
