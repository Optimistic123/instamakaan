import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';

/* ---------- CUSTOM DROPDOWN ---------- */
const Dropdown = ({ icon: Icon, label, value, setValue, options }) => {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const handler = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	return (
		<div ref={ref} className="relative w-full">
			<button
				onClick={() => setOpen(!open)}
				className="
					w-full h-11 px-3 flex items-center justify-between
					rounded-xl border
					bg-white dark:bg-[#0b1220]
					border-slate-300/50 dark:border-white/10
					text-slate-900 dark:text-slate-100
					text-sm transition-all
					hover:shadow-md
				"
			>
				<div className="flex items-center gap-2">
					{Icon && <Icon className="w-4 h-4 text-slate-400" />}
					<span className={value ? '' : 'text-slate-400'}>
						{value || label}
					</span>
				</div>
				<ChevronDown
					className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
				/>
			</button>

			<div
				className={`
					absolute left-0 right-0 mt-2 z-50
					rounded-xl overflow-hidden
					bg-white dark:bg-[#0b1220]
					border border-slate-200 dark:border-white/10
					shadow-xl
					transition-all duration-200
					${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
				`}
			>
				{options.map((opt) => (
					<div
						key={opt}
						onClick={() => {
							setValue(opt);
							setOpen(false);
						}}
						className="
							px-4 py-3 cursor-pointer text-sm
							text-slate-800 dark:text-slate-200
							hover:bg-slate-100 dark:hover:bg-white/10
						"
					>
						{opt}
					</div>
				))}
			</div>
		</div>
	);
};

/* ---------- HERO SECTION ---------- */
export const HeroSection = () => {
	const [activeTab, setActiveTab] = useState('rent');

	const [city, setCity] = useState('');
	const [budget, setBudget] = useState('');
	const [bhk, setBhk] = useState('');

	// NEW STATES (added only)
	const [searchText, setSearchText] = useState('');
	const [rentType, setRentType] = useState('Full House');
	const [buyType, setBuyType] = useState('Full House');
	const [propertyStatus, setPropertyStatus] = useState('');
	const [preType, setPreType] = useState('Rent');
	const [commercialType, setCommercialType] = useState('');

	const tabText = {
		rent: {
			title: 'Find Your Rental ',
			highlight: 'Sukoon.',
			subtitle: 'Calm, friendly, aspirational living spaces for your comfort.',
		},
		buy: {
			title: 'Discover Your Future ',
			highlight: 'Property.',
			subtitle: 'Verified listings and expert guidance for buyers.',
		},
		pre: {
			title: 'Managed Homes for ',
			highlight: 'Living.',
			subtitle: 'Premium pre-occupied homes with full service.',
		},
	};

	const bgImages = {
		rent: '/images/hero-rent.jpg',
		buy: '/images/hero-buy.jpg',
		pre: '/images/hero-pre.jpg',
	};

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-14">
			<div
				className="absolute inset-0 bg-cover bg-center scale-105"
				style={{ backgroundImage: `url('${bgImages[activeTab]}')` }}
			/>

			<div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/80 dark:from-[#0b1220]/90 dark:via-[#0b1220]/85 dark:to-[#0b1220]/95" />

			{/* TABS */}
			<div className="absolute top-28 left-1/2 -translate-x-1/2 z-20">
				<div className="flex bg-white/90 dark:bg-[#0b1220]/80 backdrop-blur-xl rounded-full p-1 border border-slate-200/50 dark:border-white/10 shadow-lg">
					{['rent', 'pre', 'buy'].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-5 py-2 rounded-full text-sm font-medium transition-all
								${
									activeTab === tab
										? 'bg-teal-600 text-white shadow'
										: 'text-slate-700 dark:text-slate-300'
								}`}
						>
							{tab === 'rent' ? 'Rent' : tab === 'pre' ? 'Pre-Occupied' : 'Buy'}
						</button>
					))}
				</div>
			</div>

			{/* CONTENT */}
			<div className="relative z-10 text-center max-w-6xl px-4">
				<h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
					{tabText[activeTab].title}
					<span className="text-teal-600 dark:text-teal-400">
						{tabText[activeTab].highlight}
					</span>
				</h1>

				<p className="mt-4 text-slate-600 dark:text-slate-300">
					{tabText[activeTab].subtitle}
				</p>

				{/* SEARCH BAR */}
				<div className="mt-10 bg-white/90 dark:bg-[#0b1220]/85 backdrop-blur-xl shadow-2xl rounded-2xl px-6 py-6 flex flex-wrap md:flex-nowrap gap-4 items-center border border-slate-200/50 dark:border-white/10 max-w-6xl mx-auto">
					{/* RADIO BUTTONS (SEARCH SE PEHLE) */}
					{activeTab === 'rent' && (
						<div className="flex gap-4 text-sm text-slate-700 dark:text-slate-200">
							{['Full House', 'Flatmate'].map((o) => (
								<label key={o} className="flex items-center gap-1">
									<input
										type="radio"
										checked={rentType === o}
										onChange={() => setRentType(o)}
									/>
									{o}
								</label>
							))}
						</div>
					)}

					{activeTab === 'buy' && (
						<div className="flex gap-4 text-sm text-slate-700 dark:text-slate-200">
							{['Full House', 'Land / Plot'].map((o) => (
								<label key={o} className="flex items-center gap-1">
									<input
										type="radio"
										checked={buyType === o}
										onChange={() => setBuyType(o)}
									/>
									{o}
								</label>
							))}
						</div>
					)}

					{activeTab === 'pre' && (
						<div className="flex gap-4 text-sm text-slate-700 dark:text-slate-200">
							{['Rent', 'Buy'].map((o) => (
								<label key={o} className="flex items-center gap-1">
									<input
										type="radio"
										checked={preType === o}
										onChange={() => setPreType(o)}
									/>
									{o}
								</label>
							))}
						</div>
					)}

					{/* CITY */}
					<Dropdown
						icon={MapPin}
						label="City"
						value={city}
						setValue={setCity}
						options={['Noida', 'Greater Noida']}
					/>

					{/* SEARCH INPUT */}
					<input
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder="Search localities or landmarks"
						className="h-11 px-4 rounded-xl border bg-white dark:bg-[#0b1220] text-sm w-full md:w-72"
					/>

					{/* DROPDOWNS */}
					{activeTab === 'rent' && (
						<Dropdown
							label="BHK Type"
							value={bhk}
							setValue={setBhk}
							options={['1 BHK', '2 BHK', '3 BHK', '4 BHK']}
						/>
					)}

					{activeTab === 'buy' && (
						<Dropdown
							label="Property Status"
							value={propertyStatus}
							setValue={setPropertyStatus}
							options={['Ready to Move', 'Under Construction']}
						/>
					)}

					{activeTab === 'pre' && (
						<Dropdown
							label="Property Type"
							value={commercialType}
							setValue={setCommercialType}
							options={[
								'Office Space',
								'Co-Working',
								'Shop',
								'Showroom',
								'Industrial Building',
								'Industrial Shed',
								'Godown / Warehouse',
								'Other Business',
							]}
						/>
					)}

					<button className="h-11 px-8 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-semibold flex items-center gap-2 shadow-md">
						<Search className="w-4 h-4" />
						Search
					</button>
				</div>
			</div>
		</section>
	);
};
