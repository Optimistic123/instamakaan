import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Ruler, MapPin } from 'lucide-react';

export const PropertyCard = ({ property }) => {
	const image =
		property.images && property.images.length > 0
			? property.images[0]
			: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c';

	return (
		<div
			className="
			bg-white dark:bg-neutral-900
			rounded-2xl shadow-md overflow-hidden
			border border-gray-200 dark:border-white/10
		"
		>
			{/* IMAGE */}
			<div className="relative h-48">
				<img
					src={image}
					alt={property.title}
					className="w-full h-full object-cover"
				/>

				{/* ✅ FIXED BUY / RENT BADGE */}
				<span
					className="
						absolute top-3 left-3
						bg-white/90 dark:bg-black/60
						text-gray-900 dark:text-white
						text-xs px-3 py-1 rounded-full
						backdrop-blur
					"
				>
					{property.property_type?.toUpperCase()}
				</span>
			</div>

			{/* CONTENT */}
			<div className="p-4 bg-white dark:bg-neutral-900">
				<h3 className="font-semibold text-gray-900 dark:text-white">
					{property.title}
				</h3>

				<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
					<MapPin className="w-4 h-4 text-teal-500" />
					{property.location}
				</p>

				<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
					<span className="flex items-center gap-1">
						<BedDouble className="w-4 h-4" /> {property.beds} Beds
					</span>
					<span className="flex items-center gap-1">
						<Bath className="w-4 h-4" /> {property.baths} Baths
					</span>
					<span className="flex items-center gap-1">
						<Ruler className="w-4 h-4" /> {property.area} sqft
					</span>
				</div>

				<div className="flex justify-between items-center mt-4">
					<p className="text-lg font-semibold text-gray-900 dark:text-white">
						₹ {property.price}
					</p>

					<Link to={`/property/${property.id}`}>
						<button
							className="
							bg-teal-600 hover:bg-teal-700
							text-white px-4 py-2
							rounded-lg text-sm
							transition
						"
						>
							View Details
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
