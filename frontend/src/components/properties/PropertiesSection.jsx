import React, { useEffect, useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const PropertiesSection = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchProperties = async () => {
			try {
				const res = await fetch(`${BACKEND_URL}/api/properties/`);

				if (!res.ok) {
					throw new Error('Failed to load properties');
				}

				const data = await res.json();
				setProperties(data || []);
			} catch (err) {
				console.error(err);
				setError('No properties found');
			} finally {
				setLoading(false);
			}
		};

		fetchProperties();
	}, []);

	if (loading) {
		return (
			<section className="py-20 text-center bg-white dark:bg-neutral-950">
				<p className="text-gray-600 dark:text-gray-400">
					Loading properties...
				</p>
			</section>
		);
	}

	if (error || properties.length === 0) {
		return (
			<section className="py-20 text-center bg-white dark:bg-neutral-950">
				<p className="text-gray-600 dark:text-gray-400">
					No properties available
				</p>
			</section>
		);
	}

	return (
		<section className="py-20 bg-white dark:bg-neutral-950">
			<div className="container-custom">
				<div className="flex items-center justify-between mb-10">
					<div>
						<h2 className="text-2xl font-semibold text-teal-700 dark:text-teal-400">
							Last Search / Recommended
						</h2>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
							Properties matching your preferences
						</p>
					</div>

					<Link
						to="/all-properties"
						className="
							border border-teal-600
							text-teal-600 dark:text-teal-400
							px-4 py-2 rounded-lg text-sm
							hover:bg-teal-50 dark:hover:bg-white/10
							transition
						"
					>
						View All Properties
					</Link>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{properties.slice(0, 4).map((property) => (
						<PropertyCard key={property.id} property={property} />
					))}
				</div>
			</div>
		</section>
	);
};
