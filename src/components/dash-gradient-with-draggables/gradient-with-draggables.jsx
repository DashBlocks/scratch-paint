import React from 'react';
import PropTypes from 'prop-types';
import Draggable from './draggable.jsx';
import GradientTypes from '../../lib/gradient-types';

import styles from './gradient-with-draggables.css';
import log from '../../log/log';

const stopsToFill = (stops, gradientType, gradientAngle) => {
    switch (gradientType) {
    case GradientTypes.LINEAR:
        return `url(` +
            `"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'>` +
                `<linearGradient id='gradient' gradientTransform='rotate(${gradientAngle})'>` +
                    stops.map(stop => `<stop offset='${stop.offset}' stop-color='${stop.color}' />`).join('') +
                `</linearGradient>` +
            `</svg>#gradient"` +
        `)`;
    case GradientTypes.RADIAL:
        return `url(` +
            `"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'>` +
                `<radialGradient id='gradient' gradientTransform='rotate(${gradientAngle})'>` +
                    stops.map(stop => `<stop offset='${stop.offset}' stop-color='${stop.color}' />`).join('') +
                `</radialGradient>` +
            `</svg>#gradient"` +
        `)`;
    default:
        log.error(`Unrecognized gradient type: ${gradientType}`);
        return null;
    }
};

const GradientWithDraggablesComponent = props => (
    <div>
        <svg
            className={styles.gradientSwatch}
            viewBox="0,0,192,80"
        >
            <rect
                width="192"
                height="80"
                fill={stopsToFill(props.stops, props.gradientType, props.gradientAngle)}
            />
        </svg>
        <div
            ref={props.draggablesBoxRef}
            className={styles.draggablesBox}
        >
            {props.stops.map((stop, index) => (
                <Draggable
                    active={index === props.colorIndex}
                    key={index}
                    onMoveStopPointerDown={e => props.onMoveStopPointerDown(e, index)}
                    onSelectColor={() => props.onSelectColor(index)}
                    stop={stop}
                />
            ))}
        </div>
    </div>
);

GradientWithDraggablesComponent.propTypes = {
    colorIndex: PropTypes.number.isRequired,
    draggablesBoxRef: PropTypes.func.isRequired,
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    gradientAngle: PropTypes.number,
    onMoveStopPointerDown: PropTypes.func.isRequired,
    onSelectColor: PropTypes.func.isRequired,
    stops: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    }))
};

export default GradientWithDraggablesComponent;