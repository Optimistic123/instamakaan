import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Search,
	MapPin,
	Bed,
	Bath,
	Square,
	Heart,
	Calendar,
	Phone,
	Filter,
	SlidersHorizontal,
	Home,
	Building2,
	Key,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useSearchParams } from 'react-router-dom';

/* ---------------- TAB CONTENT ---------------- */

const tabContent = {
	'pre-occupied': {
		usps: [
			'Welcome to a Managed Home. Renting, redefined.',
			'24/7 Service. 100% Verified. Total Sukoon.',
			'Your Home, Your Vibe, Our Responsibility.',
		],
		resultText: 'Pre-Occupied',
	},
	rent: {
		usps: [
			'Find Your Verified Home. Fast.',
			'No Fakes. No Scams. Just Real, Quality Flats.',
			'Your Next Home is Just a Click Away.',
		],
		resultText: 'Rent',
	},
	buy: {
		usps: [
			'Buy Your Dream Home. Move in Today.',
			'100% Verified, Ready-to-Move Properties.',
			'Your Partner in Ownership. Buy with Confidence.',
		],
		resultText: 'Buy',
	},
};

/* ---------------- DUMMY PROPERTIES ---------------- */

import { Properties } from '@/data/properties';

/* ---------------- PAGE ---------------- */

const PropertiesPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const initialType = searchParams.get('type') || 'rent';

	const [activeTab, setActiveTab] = useState(initialType);
	const [searchQuery, setSearchQuery] = useState('');
	const [favorites, setFavorites] = useState([]);

	const content = tabContent[activeTab];

	const filteredProperties = properties.filter(
		(p) =>
			p.type === activeTab &&
			(p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.location.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const toggleFavorite = (id) => {
		setFavorites((prev) =>
			prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
		);
	};

	const handleTabChange = (value) => {
		setActiveTab(value);
		setSearchParams({ type: value });
	};

	return (
		<Layout>
			{/* HERO */}
			<section className="py-8 hero-gradient">
				<div className="container-custom">
					<div className="flex justify-center mb-6">
						<Tabs value={activeTab} onValueChange={handleTabChange}>
							<TabsList>
								<TabsTrigger value="buy">
									<Building2 className="w-4 h-4 mr-2" /> BUY
								</TabsTrigger>
								<TabsTrigger value="pre-occupied">
									<Home className="w-4 h-4 mr-2" /> PRE-OCCUPIED
								</TabsTrigger>
								<TabsTrigger value="rent">
									<Key className="w-4 h-4 mr-2" /> RENT
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<h1 className="text-center text-xl font-bold text-primary mb-6">
						{content.usps[0]}
					</h1>

					<div className="max-w-3xl mx-auto bg-card p-3 rounded-xl">
						<div className="flex gap-2">
							<Input
								placeholder="Search by location or society..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<Button variant="teal">
								<Search className="w-4 h-4 mr-2" /> Search
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* LIST */}
			<section className="py-10">
				<div className="container-custom grid md:grid-cols-3 gap-6">
					{filteredProperties.map((property) => (
						<Card key={property.id}>
							<img
								src={property.image}
								alt={property.title}
								className="h-48 w-full object-cover"
							/>

							<CardContent className="p-4">
								<h3 className="font-semibold">{property.title}</h3>
								<p className="text-sm text-muted-foreground flex items-center">
									<MapPin className="w-4 h-4 mr-1" />
									{property.location}
								</p>

								<div className="flex gap-4 my-3 text-sm">
									<span>
										<Bed className="inline w-4 h-4" /> {property.beds}
									</span>
									<span>
										<Bath className="inline w-4 h-4" /> {property.baths}
									</span>
									<span>
										<Square className="inline w-4 h-4" /> {property.area}
									</span>
								</div>

								<div className="flex justify-between items-center">
									<div>
										<p className="text-xs">{property.price_label}</p>
										<p className="font-bold text-primary">₹{property.price}</p>
									</div>

									<Button asChild size="sm">
										<Link to={`/property/${property.id}`}>View Details</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</Layout>
	);
};

export default PropertiesPage;
