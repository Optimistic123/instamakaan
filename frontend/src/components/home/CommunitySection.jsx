import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Bell, Gift, Users, Zap } from 'lucide-react';

export const CommunitySection = () => {
	const benefits = [
		{ icon: TrendingUp, label: 'Market Trends' },
		{ icon: Bell, label: 'New Listings' },
		{ icon: Gift, label: 'Exclusive Offers' },
		{ icon: Users, label: 'Connections' },
	];

	return (
		<section className="py-16 bg-slate-50 dark:bg-[#0b1220]">
			<div className="max-w-7xl mx-auto px-5">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* LEFT : VISUAL */}
					<div className="flex justify-center">
						<div className="rounded-3xl p-12 bg-gradient-to-br from-teal-500/10 to-yellow-400/10">
							<div className="relative w-[320px] h-[320px] max-sm:w-[260px] max-sm:h-[260px]">
								{/* Radiating lines */}
								<svg className="absolute inset-0" viewBox="0 0 400 400">
									{benefits.map((_, index) => {
										const angle = (index * 90 - 45) * (Math.PI / 180);
										const x2 = 200 + 150 * Math.cos(angle);
										const y2 = 200 + 150 * Math.sin(angle);
										return (
											<line
												key={index}
												x1="200"
												y1="200"
												x2={x2}
												y2={y2}
												stroke="rgb(20 184 166)"
												strokeWidth="2"
												strokeDasharray="5,5"
												opacity="0.25"
											/>
										);
									})}
								</svg>

								{/* Center logo */}
								<div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 max-sm:w-24 max-sm:h-24 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-3xl font-bold shadow-xl z-10">
									IM
								</div>

								{/* Floating icons */}
								{benefits.map((benefit, index) => {
									const angle = (index * 90 - 45) * (Math.PI / 180);
									const x = 50 + 35 * Math.cos(angle);
									const y = 50 + 35 * Math.sin(angle);
									const Icon = benefit.icon;

									return (
										<div
											key={benefit.label}
											style={{ left: `${x}%`, top: `${y}%` }}
											className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-xl bg-white dark:bg-neutral-900 shadow-lg flex flex-col items-center justify-center"
										>
											<Icon className="w-5 h-5 text-teal-600" />
											<span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
												{benefit.label.split(' ')[0]}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>

					{/* RIGHT : CONTENT */}
					<div>
						<h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Get the Insider Advantage
						</h3>
						<p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
							Be the first to know. Get early alerts on properties, deals, and
							market shifts.
						</p>

						<div className="space-y-6">
							<div>
								<Button variant="teal" size="lg" className="w-full sm:w-auto">
									<Users className="mr-2" />
									Click to Join Buying Community
								</Button>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
									Get market insights & investment deals.
								</p>
							</div>

							<div>
								<Button variant="yellow" size="lg" className="w-full sm:w-auto">
									<Zap className="mr-2" />
									Click to Join Tenant Community
								</Button>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
									Get new rental alerts & local offers.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
