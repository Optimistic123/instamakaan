import React from 'react';
import { Button } from '@/components/ui/button';
import { Instagram, Play } from 'lucide-react';

const instagramPosts = [
	{
		id: 1,
		image:
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop',
		hasVideo: true,
	},
	{
		id: 2,
		image:
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=300&fit=crop',
		hasVideo: false,
	},
	{
		id: 3,
		image:
			'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=300&h=300&fit=crop',
		hasVideo: true,
	},
	{
		id: 4,
		image:
			'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&h=300&fit=crop',
		hasVideo: false,
	},
	{
		id: 5,
		image:
			'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=300&fit=crop',
		hasVideo: true,
	},
	{
		id: 6,
		image:
			'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=300&fit=crop',
		hasVideo: false,
	},
];

export const InstagramSection = () => {
	return (
		<section className="py-16 md:py-24 bg-white dark:bg-neutral-950">
			<div className="container-custom">
				{/* HEADER */}
				<div className="text-center mb-12 md:mb-16">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
						VISIT OUR INSTAGRAM
					</h2>
					<p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
						Follow our journey, see behind-the-scenes content, and get a
						real-time look at our newest properties.
					</p>
				</div>

				{/* INSTAGRAM GRID */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
					{instagramPosts.map((post) => (
						<a
							key={post.id}
							href="https://instagram.com/instamakaan"
							target="_blank"
							rel="noopener noreferrer"
							className="
								relative aspect-square rounded-xl overflow-hidden
								group cursor-pointer
								bg-gray-100 dark:bg-neutral-900
							"
						>
							<img
								src={post.image}
								alt="Instagram post"
								className="
									w-full h-full object-cover
									transition-transform duration-300
									group-hover:scale-110
								"
							/>

							{/* Overlay */}
							<div
								className="
									absolute inset-0
									bg-black/0 group-hover:bg-black/40
									transition-colors
									flex items-center justify-center
								"
							>
								{/* Video Icon */}
								{post.hasVideo && (
									<div className="absolute top-2 right-2 w-6 h-6 rounded bg-black/60 flex items-center justify-center">
										<Play className="w-3 h-3 text-white" fill="currentColor" />
									</div>
								)}

								{/* Instagram Icon */}
								<Instagram
									className="
										w-8 h-8 text-white
										opacity-0 group-hover:opacity-100
										transition-opacity
									"
								/>
							</div>
						</a>
					))}
				</div>

				{/* CTA */}
				<div className="text-center mt-10">
					<Button variant="yellow" size="lg" asChild>
						<a
							href="https://instagram.com/instamakaan"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center"
						>
							<Instagram className="w-5 h-5 mr-2" />
							Follow us on Instagram @InstaMakaan
						</a>
					</Button>
				</div>
			</div>
		</section>
	);
};
