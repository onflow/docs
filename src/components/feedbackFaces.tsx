import React, { useState } from "react";
import { event } from "@site/src/utils/gtags.client";

export default function FeedbackFaces() {
    const [clickedFace, setClickedFace] = useState<string | null>(null);

    const faces = [
        { label: "sad", emoji: "😞" },
        { label: "neutral", emoji: "😐" },
        { label: "happy", emoji: "😊" },
    ];

    const handleFeedbackClick = (feedbackType: string) => {
        setClickedFace(feedbackType);

        event({
            action: "feedback_click",
            category: "feedback",
            label: feedbackType,
            value: feedbackType === "happy" ? 2 : feedbackType === "neutral" ? -1 : -2,
            location: true
        });

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
