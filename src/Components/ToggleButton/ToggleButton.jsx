import './ToggleButton.css';
import { useState } from 'react';

export const ToggleButton = ({ textLeft, textRight }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className="toggle-container" onClick={handleToggle}>
            <div className={`toggle-text-container`}>
                <span className={`toggle-text ${!isChecked ? "text-active" : "text-inactive"}`}>
                    {textLeft}
                </span>
                <span className={`toggle-text ${isChecked ? "text-active" : "text-inactive"}`}>
                    {textRight}
                </span>
            </div>
            <div className={`toggle-button ${isChecked ? "active" : ""}`} />
        </div>
    );
};
