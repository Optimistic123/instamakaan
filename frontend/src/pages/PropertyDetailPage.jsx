import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

import {
	Tv,
	Lightbulb,
	Fan,
	WashingMachine,
	Wifi,
	Refrigerator,
	Microwave,
	Bed,
	Power,
	Wind,
	Droplets,
	Utensils,
	Dumbbell,
	Building2,
	ShowerHead,
	Home,
	CheckCircle2,
	MapPin,
	ChevronLeft,
	ChevronRight,
	IndianRupee,
	Wallet,
	BadgeCheck,
	CalendarDays,
} from 'lucide-react';

/* ---------------- ICON MAP ---------------- */

const amenityIconMap = {
	Tv,
	Television: Tv,
	Light: Lightbulb,
	Fan,
	Wifi,
	'Washing machine': WashingMachine,
	'Power backup': Power,
	Ventilation: Wind,
	'House keeping': Home,
	'Supply water': Droplets,
	'Water supply': Droplets,
	'Table tennis': Dumbbell,
	Lift: Building2,
	'Common dining area': Utensils,
	Fridge: Refrigerator,
	Microwave,
	'Ro system': ShowerHead,
	'Common kitchen with gas': Utensils,
	Mat: Bed,
	Cot: Bed,
};

/* ---------------- COMPONENT ---------------- */

const PropertyDetailPage = () => {
	const { id } = useParams();

	const [property, setProperty] = useState(null);
	const [related, setRelated] = useState([]);
	const [loading, setLoading] = useState(true);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// 👉 Current property
				const res = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/api/properties/${id}`
				);
				const data = await res.json();
				setProperty(data);

				// 👉 People also searched
				const listRes = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/api/properties/`
				);
				const list = await listRes.json();

				const filtered = list
					.filter((p) => p.id !== data.id)
					.slice(0, 3);

				setRelated(filtered);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	if (loading || !property) {
		return (
			<Layout>
				<div className="min-h-[60vh] flex items-center justify-center">
					Loading property...
				</div>
			</Layout>
		);
	}

	const images =
		property.images?.length > 0
			? property.images
			: ['/images/default-property.jpg'];

	return (
		<Layout>
			<div className="container-custom py-10 grid lg:grid-cols-3 gap-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
				{/* LEFT */}
				<div className="lg:col-span-2 space-y-10">
					<div>
						<h1 className="text-3xl font-bold">{property.title}</h1>
						<p className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
							<MapPin className="w-4 h-4 mr-1 text-teal-600" />
							{property.location}
						</p>
					</div>

					{/* IMAGE SLIDER */}
					<div className="relative rounded-2xl overflow-hidden h-[420px] shadow-lg">
						<img
							src={images[index]}
							className="w-full h-full object-cover"
							alt={property.title}
						/>

						<button
							onClick={() =>
								setIndex(index === 0 ? images.length - 1 : index - 1)
							}
							className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow"
						>
							<ChevronLeft />
						</button>

						<button
							onClick={() => setIndex((index + 1) % images.length)}
							className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow"
						>
							<ChevronRight />
						</button>
					</div>

					{/* PRICE */}
					<div className="grid sm:grid-cols-3 gap-6">
						<div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
							<IndianRupee className="text-teal-600 mb-1" />
							<p className="font-bold">
								₹ {property.monthly_rent_amount || property.price}
							</p>
						</div>

						<div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
							<Wallet className="text-teal-600 mb-1" />
							<p className="font-bold">{property.deposit || 'N/A'}</p>
						</div>

						<div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
							<BadgeCheck className="text-teal-600 mb-1" />
							<p className="font-bold">{property.brokerage || 'No Brokerage'}</p>
						</div>
					</div>

					{/* AMENITIES */}
					<div className="rounded-xl p-5 bg-gray-100 dark:bg-gray-800">
						<h3 className="font-semibold mb-4">Amenities</h3>
						<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
							{property.amenities?.map((a, i) => {
								const Icon = amenityIconMap[a] || CheckCircle2;
								return (
									<div key={i} className="flex items-center gap-3 text-sm">
										<Icon className="w-4 h-4 text-teal-600" />
										{a}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* RIGHT */}
				<div className="space-y-6 sticky top-24 h-fit">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
						<h3 className="flex items-center gap-2 font-semibold mb-4">
							<CalendarDays className="text-teal-600" />
							Schedule Visit
						</h3>
						<input className="w-full mb-3 p-2 rounded bg-gray-100 dark:bg-gray-700" placeholder="Name" />
						<input className="w-full mb-4 p-2 rounded bg-gray-100 dark:bg-gray-700" placeholder="Phone" />
						<button className="w-full bg-teal-600 text-white py-2 rounded">
							Schedule Visit
						</button>
					</div>

					{/* PEOPLE ALSO SEARCHED */}
					<div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl">
						<h4 className="font-semibold mb-4">People also searched</h4>

						{related.map((p) => (
							<Link
								key={p.id}
								to={`/property/${p.id}`}
								className="block bg-white dark:bg-gray-700 p-3 rounded shadow mb-3 hover:scale-[1.02] transition"
							>
								<p className="font-medium">{p.title}</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{p.location}
								</p>
								<p className="text-teal-600 font-semibold">
									₹ {p.monthly_rent_amount || p.price}
								</p>
							</Link>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default PropertyDetailPage;