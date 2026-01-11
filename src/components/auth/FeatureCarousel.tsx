"use client"

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const features = [
    {
        id: 1,
        title: "Team Collaboration",
        description: "Invite your staff and accountants to manage books together.",
        image: "https://illustrations.popsy.co/blue/work-from-home.svg" // Placeholder illustration
    },
    {
        id: 2,
        title: "Download Reports",
        description: "Get detailed PDF and Excel reports for your business.",
        image: "https://illustrations.popsy.co/blue/presentation.svg"
    },
    {
        id: 3,
        title: "Multiple HISABs",
        description: "Create separate books for different projects or branches.",
        image: "https://illustrations.popsy.co/blue/finance.svg"
    }
];

export function FeatureCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center p-8 bg-blue-50/50">
            <div className="w-full max-w-md text-center space-y-8">
                <div className="relative aspect-square w-full max-w-[320px] mx-auto overflow-hidden rounded-full bg-white shadow-xl dark:bg-gray-800 p-8 flex items-center justify-center">
                    {/* Using simple img tags for now, next/image requires domain config */}
                    <img
                        src={features[current].image}
                        alt={features[current].title}
                        className="w-full h-full object-contain transition-all duration-500 ease-in-out transform hover:scale-105"
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 transition-all duration-300">
                        {features[current].title}
                    </h2>
                    <p className="text-muted-foreground transition-all duration-300">
                        {features[current].description}
                    </p>
                </div>

                <div className="flex justify-center gap-2 pt-4">
                    {features.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                current === idx ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                            )}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
