import React, { useState } from "react";
import { event } from "@site/src/utils/gtags.client";

// Default export function component
export default function FeedbackFaces() {
    const [clickedFace, setClickedFace] = useState<string | null>(null);

    const faces = [
        { label: "Sad", emoji: "😞" },
        { label: "Neutral", emoji: "😐" },
        { label: "Happy", emoji: "😊" },
    ];

    const handleFeedbackClick = (feedbackType: string) => {
        setClickedFace(feedbackType);

        const label = `${feedbackType}`;

        event({
            action: "feedback_click",
            category: "feedback",
            label: label,
            location: true,
        });

        // Reset the clicked state after a brief delay
        setTimeout(() => setClickedFace(null), 300);
    };

    return (
        <div className="flex justify-left items-center gap-1">
            {faces.map((face) => (
                <button
                    key={face.label}
                    onClick={() => handleFeedbackClick(face.label)}
                    className={`text-4xl cursor-pointer p-2 bg-transparent border-none transition-transform duration-200 focus:outline-none ${clickedFace === face.label ? "scale-110 opacity-70" : "scale-100 opacity-100"
                        }`}
                    aria-label={face.label}
                >
                    {face.emoji}
                </button>
            ))}
        </div>
    );
}
