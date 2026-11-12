import paper from '@turbowarp/paper';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import ColorStyleProptype from '../lib/color-style-proptype';
import validateColorState from '../lib/validate-color-state.js';

import {changeFillColor, clearFillGradient} from '../reducers/fill-style';
import {changeStrokeColor, clearStrokeGradient} from '../reducers/stroke-style';
import {changeMode} from '../reducers/modes';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';
import {setCursor} from '../reducers/cursor';
import {changeRoundedCornerSize} from '../reducers/rect-mode';

import {clearSelection, getSelectedLeafItems} from '../helper/selection';
import RectTool from '../helper/tools/rect-tool';
import RectModeComponent from '../components/rect-mode/rect-mode.jsx';

class RectMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isRectModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool && nextProps.colorState !== this.props.colorState) {
            this.tool.setColorState(nextProps.colorState);
        }
        if (this.tool && nextProps.selectedItems !== this.props.selectedItems) {
            this.tool.onSelectionChanged(nextProps.selectedItems);
        }
        if (this.tool && nextProps.roundedCornerSize !== this.props.roundedCornerSize) {
            this.tool.setRoundedCornerSize(nextProps.roundedCornerSize);
        }

        if (nextProps.isRectModeActive && !this.props.isRectModeActive) {
            this.activateTool();
        } else if (!nextProps.isRectModeActive && this.props.isRectModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isRectModeActive !== this.props.isRectModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        validateColorState(this.props);

        if (typeof this.props.roundedCornerSize !== "number") {
            this.props.onChangeRoundedCornerSize(0);
        }

        this.tool = new RectTool(
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage
        );
        this.tool.setRoundedCornerSize(this.props.roundedCornerSize);
        this.tool.setColorState(this.props.colorState);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <RectModeComponent
                isSelected={this.props.isRectModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

RectMode.propTypes = {
    clearFillGradient: PropTypes.func.isRequired,
    clearStrokeGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillColor: ColorStyleProptype,
        strokeColor: ColorStyleProptype,
        strokeWidth: PropTypes.number
    }).isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isRectModeActive: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onChangeStrokeColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item)),
    setCursor: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired,
    roundedCornerSize: PropTypes.number.isRequired,
    onChangeRoundedCornerSize: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    colorState: state.scratchPaint.color,
    isRectModeActive: state.scratchPaint.mode === Modes.RECT,
    selectedItems: state.scratchPaint.selectedItems,
    roundedCornerSize: state.scratchPaint.rectMode.roundedCornerSize,
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    clearFillGradient: () => {
        dispatch(clearFillGradient());
    },
    clearStrokeGradient: () => {
        dispatch(clearStrokeGradient());
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems(), false /* bitmapMode */));
    },
    setCursor: cursorString => {
        dispatch(setCursor(cursorString));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.RECT));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor, 0));
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor, 0));
    },
    onChangeRoundedCornerSize: roundedCornerSize => {
        dispatch(changeRoundedCornerSize(roundedCornerSize));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RectMode);
