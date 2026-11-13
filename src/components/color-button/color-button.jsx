import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {MIXED} from '../../helper/style-path';

import noFillIcon from './no-fill.svg';
import mixedFillIcon from './mixed-fill.svg';
import styles from './color-button.css';
import GradientTypes from '../../lib/gradient-types';
import { colorIsTransparent } from '../../lib/tw-color-utils';
import log from '../../log/log';

const stopsToFill = (stops, gradientType, gradientAngle) => {
    switch (gradientType) {
    case GradientTypes.SOLID:
        return stops[0].color;
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
