import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import api from '@/lib/api';
import { PropertyCard } from '@/components/properties/PropertyCard';

const AllPropertiesPage = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchProperties = async () => {
			try {
				const res = await api.get('/properties/');
				setProperties(res.data);
			} catch (err) {
				setError('Failed to load properties');
			} finally {
				setLoading(false);
			}
		};

		fetchProperties();
	}, []);

	return (
		<Layout>
			<div className="container-custom py-10">
				<h1 className="text-2xl font-semibold mb-6">All Properties</h1>

				{loading && <p>Loading properties...</p>}
				{error && <p className="text-red-500">{error}</p>}

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{properties.map((property) => (
						<PropertyCard key={property.id} property={property} />
					))}
				</div>
			</div>
		</Layout>
	);
};

export default AllPropertiesPage;
