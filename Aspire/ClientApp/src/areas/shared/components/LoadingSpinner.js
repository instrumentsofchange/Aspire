import React from 'react';
import BounceLoader from 'react-spinners/BounceLoader';

const LoadingSpinner = (props) => {
    const { color } = props;

    let loadingColor = colorsMap.get('primary');

    if(color) {
        const tryGetColor = colorsMap.get(color);

        loadingColor = tryGetColor ? tryGetColor : loadingColor;
    }

    return (
        <div className="container">
            <div className="row justify-content-center" style={{'marginTop': '300px'}}>
                <BounceLoader
                    color={loadingColor}
                    size={150}
                />
            </div>
            <div className="row justify-content-center mt-3">
                <h3 className={props.color ? `text-${props.color}` : 'text-primary'}>{props.text || 'Loading...'}</h3>
            </div>
        </div>
    );
}

const colorsMap = new Map([
    ['success', '#d4edda'],
    ['primary', '#007bff']
]);

export default LoadingSpinner;