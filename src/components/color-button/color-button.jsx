import React from 'react';
import parseColor from 'parse-color';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {MIXED} from '../../helper/style-path';

import noFillIcon from './no-fill.svg';
import mixedFillIcon from './mixed-fill.svg';
import styles from './color-button.css';
import GradientTypes from '../../lib/gradient-types';
import log from '../../log/log';

const colorIsTransparent = colorString => {
    if (colorString === null) return true;
    if (colorString.startsWith('#') && colorString.length === 9) {
        // parseColor does not properly parse alpha of hex colors
        return parseInt(colorString.substr(colorString.length - 2), 16) === 0;
    } else {
        return parseColor(colorString).hsva[3] === 0;
    }
};

const stopsToFill = (stops, gradientType, gradientAngle) => {
    switch (gradientType) {
    case GradientTypes.SOLID:
        return stops[0].color;
    case GradientTypes.LINEAR:
        return `url(
            "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'>
                <linearGradient id='gradient' gradientTransform='rotate(${gradientAngle})'>
                    ${stops.map(stop => `<stop offset=${stop.offset} stopColor=${stop.color} />`)}
                </linearGradient>
            </svg>#gradient"
        )`;
    case GradientTypes.RADIAL:
        return `url(
            "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'>
                <radialGradient id='gradient'>
                    ${stops.map(stop => `<stop offset=${stop.offset} stopColor=${stop.color} />`)}
                </radialGradient>
            </svg>#gradient"
        )`;
    default:
        log.error(`Unrecognized gradient type: ${gradientType}`);
        return null;
    }
};

const ColorButtonComponent = props => (
    <div
        className={styles.colorButton}
        onClick={props.onClick}
    >
        <div
            className={classNames(styles.colorButtonSwatch, {
                [styles.outlineSwatch]: props.outline && props.stops[0].color !== MIXED
            })}
        >
            {props.stops[0].color === MIXED ? (
                <img
                    className={styles.swatchIcon}
                    draggable={false}
                    src={mixedFillIcon}
                />
            ) : props.gradientType === GradientTypes.SOLID && colorIsTransparent(props.stops[0].color) ? (
                <img
                    className={styles.swatchIcon}
                    draggable={false}
                    src={noFillIcon}
                />
            ) : (
                <svg viewBox="0,0,32,32">
                    <rect
                        width="32"
                        height="32"
                        fill={stopsToFill(props.stops, props.gradientType, props.gradientAngle)}
                    />
                </svg>
            )}
        </div>
        <div className={styles.colorButtonArrow}>▾</div>
    </div>
);

ColorButtonComponent.propTypes = {
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    gradientAngle: PropTypes.number,
    onClick: PropTypes.func.isRequired,
    outline: PropTypes.bool.isRequired,
    stops: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    }))
};

ColorButtonComponent.defaultProps = {
    outline: false
};

export default ColorButtonComponent;
