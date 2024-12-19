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

        const pagePath = window.location.pathname;
        const label = `${feedbackType} - ${pagePath}`;

        event({
            action: "feedback_click",
            category: "Feedback",
            label: label,
            location: pagePath,
        });

        // Reset the clicked state after a brief delay
        setTimeout(() => setClickedFace(null), 300);
    };

    return (
        <div style={styles.container}>
            {faces.map((face) => (
                <button
                    key={face.label}
                    onClick={() => handleFeedbackClick(face.label)}
                    style={{
                        ...styles.button,
                        transform: clickedFace === face.label ? "scale(1.2)" : "scale(1)",
                        opacity: clickedFace === face.label ? 0.7 : 1,
                    }}
                    aria-label={face.label}
                >
                    {face.emoji}
                </button>
            ))}
        </div>
    );
}

// Inline CSS styles
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    } as React.CSSProperties,
    button: {
        fontSize: "30px",
        background: "none",
        border: "none",
        cursor: "pointer",
        transition: "transform 0.2s, opacity 0.2s",
        padding: "10px",
    } as React.CSSProperties,
};
