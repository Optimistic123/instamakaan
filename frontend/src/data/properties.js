// 🔥 SINGLE SOURCE OF TRUTH
// 👉 Aaj dummy data
// 👉 Kal API se replace ho jaayega (same structure)

export const properties = [
	{
		id: 1,
		type: 'pre-occupied',
		cardType: 'PRE-OCCUPIED',
		rating: 4.8,

		title: 'Pre-Occupied Flat in Green Valley Society',
		location: 'Sector 62, Noida',

		images: [
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
		],

		price: 15000,

		pricing: {
			rent: '₹15,000 / month',
			deposit: '2 Months',
			service: '₹5,000',
		},

		// BASIC DETAILS (FILTERS)
		beds: 1,
		baths: 1,
		area: 450, // sqft

		floor: 2,
		totalFloors: 10,

		// FURNISHING FILTER
		furnishing: 'full', // full | semi | none

		// PROPERTY TYPE FILTER
		propertyCategory: 'apartment', // apartment | villa | independent | gated

		// AMENITIES FILTERS
		parking: true,
		gym: true,
		swimmingPool: false,
		lift: true,

		// DISTANCE FILTERS (KM)
		distanceFromMetro: 0.5,
		distanceFromAirport: 28,

		amenities: {
			House: [
				'Tv',
				'Light',
				'Fan',
				'Washing machine',
				'Power backup',
				'Ventilation',
				'House keeping',
				'Supply water',
				'Lift',
				'Wifi',
			],
			'Living Room': ['Television', 'Wifi', 'Light', 'Fan'],
			Kitchen: ['Fridge', 'Microwave', 'Ro system'],
			Bedroom: ['Light', 'Fan', 'Cot'],
		},
	},

	{
		id: 2,
		type: 'rent',
		cardType: 'RENT',
		rating: 4.6,

		title: '2 BHK in Pearl Residency',
		location: 'Sector 76, Noida',

		images: [
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
		],

		price: 22000,

		pricing: {
			rent: '₹22,000 / month',
			deposit: '1 Month',
			service: '₹0',
		},

		beds: 2,
		baths: 2,
		area: 1100,

		floor: 5,
		totalFloors: 12,

		furnishing: 'semi',
		propertyCategory: 'gated',

		parking: true,
		gym: false,
		swimmingPool: true,
		lift: true,

		distanceFromMetro: 1.2,
		distanceFromAirport: 35,

		amenities: {
			House: ['Tv', 'Wifi', 'Lift', 'Power backup'],
			Kitchen: ['Fridge', 'Microwave'],
			Bedroom: ['Fan', 'Light', 'Cot'],
		},
	},

	{
		id: 3,
		type: 'buy',
		cardType: 'BUY',
		rating: 4.9,

		title: '3 BHK in ATS Greens',
		location: 'Sector 150, Noida',

		images: [
			'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
		],

		price: 35000,

		pricing: {
			rent: '₹35,000 / month',
			deposit: '2 Months',
			service: '₹0',
		},

		beds: 3,
		baths: 2,
		area: 1500,

		floor: 8,
		totalFloors: 20,

		furnishing: 'full',
		propertyCategory: 'apartment',

		parking: true,
		gym: true,
		swimmingPool: true,
		lift: true,

		distanceFromMetro: 2.5,
		distanceFromAirport: 40,

		amenities: {
			House: ['Lift', 'Wifi', 'Power backup'],
			Kitchen: ['Fridge', 'Microwave'],
			Bedroom: ['Cot', 'Fan', 'Light'],
		},
	},

	{
		id: 4,
		type: 'buy',
		cardType: 'BUY',
		rating: 4.7,

		title: 'Studio Near Metro',
		location: 'Sector 62, Noida',

		images: [
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
			'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
		],

		price: 18000,

		pricing: {
			rent: '₹18,000 / month',
			deposit: '1 Month',
			service: '₹0',
		},

		beds: 1,
		baths: 1,
		area: 550,

		floor: 1,
		totalFloors: 5,

		furnishing: 'none',
		propertyCategory: 'independent',

		parking: false,
		gym: false,
		swimmingPool: false,
		lift: false,

		distanceFromMetro: 0.2,
		distanceFromAirport: 25,

		amenities: {
			House: ['Wifi'],
			Bedroom: ['Fan', 'Light'],
		},
	},
];
