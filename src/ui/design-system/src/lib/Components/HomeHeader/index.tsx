import React from 'react';
import { NewsCarousel } from '../NewsCarousel';
import { GoldStarPanel } from '../GoldStarPanel';

export const HomeHeader: React.FC = () => {
    return (
        <div className="relative p-8">
            <div className="relative pl-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-2/3">
                        <NewsCarousel />
                    </div>
                    <div className="w-full md:w-1/3">
                        <GoldStarPanel />
                    </div>
                </div>
            </div>
        </div>
    );
};
