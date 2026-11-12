import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import noFillIcon from '../color-button/no-fill.svg';
import styles from './draggable.css';
import { colorIsTransparent } from '../../lib/tw-color-utils';

const Draggable = props => (
    <div
        className={styles.draggable}
        onPointerDown={props.onMoveStopPointerDown}
        style={{
            "--draggable-offset": props.stop.offset
        }}
    >
        <div className={styles.draggableTip} />
        <div
            className={classNames(styles.draggableButton, {
                [styles.activeButton]: props.active
            })}
            onClick={props.onSelectColor}
        >
            {colorIsTransparent(props.stop.color) ? (
                <div
                    className={styles.draggableButtonSwatch}
                    style={{backgroundColor: 'white'}}
                >
                    <img
                        className={styles.swatchIcon}
                        draggable={false}
                        src={noFillIcon}
                    />
                </div>
            ) : (
                <div
                    className={styles.draggableButtonSwatch}
                    style={{backgroundColor: props.stop.color}}
                />
            )}
        </div>
    </div>
);

Draggable.propTypes = {
    active: PropTypes.bool,
    onMoveStopPointerDown: PropTypes.func.isRequired,
    onSelectColor: PropTypes.func.isRequired,
    stop: PropTypes.shape({
        color: PropTypes.string,
        offset: PropTypes.number
    })
};

export default Draggable;