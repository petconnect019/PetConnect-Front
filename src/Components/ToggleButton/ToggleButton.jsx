import './ToggleButton.css';
import { useEffect, useState } from 'react';

export const ToggleButton = ({ textLeft, textRight, setProtectionRender }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    useEffect(()=> {
        isChecked ? setProtectionRender('scan') : setProtectionRender('tag');

    }, [isChecked])

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
