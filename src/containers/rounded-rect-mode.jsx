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
import {changeRoundedRectCornerSize} from '../reducers/rounded-rect-mode';

import {clearSelection, getSelectedLeafItems} from '../helper/selection';
import RoundedRectTool from '../helper/tools/rounded-rect-tool';
import RoundedRectModeComponent from '../components/rounded-rect-mode/rounded-rect-mode.jsx';

class RoundedRectMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isRoundedRectModeActive) {
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

        if (nextProps.isRoundedRectModeActive && !this.props.isRoundedRectModeActive) {
            this.activateTool();
        } else if (!nextProps.isRoundedRectModeActive && this.props.isRoundedRectModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isRoundedRectModeActive !== this.props.isRoundedRectModeActive;
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

        this.tool = new RoundedRectTool(
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
            <RoundedRectModeComponent
                isSelected={this.props.isRoundedRectModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

RoundedRectMode.propTypes = {
    clearFillGradient: PropTypes.func.isRequired,
    clearStrokeGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillColor: ColorStyleProptype,
        strokeColor: ColorStyleProptype,
        strokeWidth: PropTypes.number
    }).isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isRoundedRectModeActive: PropTypes.bool.isRequired,
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
    isRoundedRectModeActive: state.scratchPaint.mode === Modes.ROUNDED_RECT,
    selectedItems: state.scratchPaint.selectedItems,
    roundedCornerSize: state.scratchPaint.roundedRectMode.roundedCornerSize,
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
        dispatch(changeMode(Modes.ROUNDED_RECT));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor, 0));
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor, 0));
    },
    onChangeRoundedCornerSize: roundedCornerSize => {
        dispatch(changeRoundedRectCornerSize(roundedCornerSize));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoundedRectMode);
