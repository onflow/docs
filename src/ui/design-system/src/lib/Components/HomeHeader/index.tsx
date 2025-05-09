import React from 'react';
import { NewsCarousel } from '../NewsCarousel';
import { GoldStarPanel } from '../GoldStarPanel';

export const HomeHeader: React.FC = () => {
    return (
        <div className="relative p-8">
            <div className="relative pl-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-8">
                    <div className="lg:col-span-3">
                        <NewsCarousel />
                    </div>
                        {/* TODO: Add back in after iteration */}
                    {/* <div>
                        <GoldStarPanel />
                    </div> */}
                </div>
            </div>
        </div>
    );
};
