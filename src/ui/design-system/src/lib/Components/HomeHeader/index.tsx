import React from 'react';
import { NewsCarousel } from '../NewsCarousel';
import { GoldStarPanel } from '../GoldStarPanel';

export const HomeHeader: React.FC = () => {
    return (
        <div className="relative p-8">
            <div className="relative pl-8">
                <div className="flex gap-8">
                    <div className="flex-1 basis-2/3">
                        <NewsCarousel />
                    </div>
                    <div className="flex-1 basis-1/3">
                        <GoldStarPanel />
                    </div>
                </div>
            </div>
        </div>
    );
};
