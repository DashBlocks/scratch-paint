import paper from '@turbowarp/paper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import ColorStyleProptype from '../lib/color-style-proptype';
import validateColorState from '../lib/validate-color-state.js';

import { changeFillColor, clearFillGradient } from '../reducers/fill-style';
import { changeStrokeColor, clearStrokeGradient } from '../reducers/stroke-style';
import { changeMode } from '../reducers/modes';
import { clearSelectedItems, setSelectedItems } from '../reducers/selected-items';
import { setCursor } from '../reducers/cursor';
import { changeCurrentlySelectedShape } from '../reducers/sussy-mode';

import { clearSelection, getSelectedLeafItems } from '../helper/selection';
import SussyTool from '../helper/tools/sussy-tool';
import SussyModeComponent from '../components/sussy-mode/sussy-mode.jsx';

class SussyMode extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount() {
        if (this.props.isSussyModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.tool && nextProps.colorState !== this.props.colorState) {
            this.tool.setColorState(nextProps.colorState);
        }
        if (this.tool && nextProps.selectedItems !== this.props.selectedItems) {
            this.tool.onSelectionChanged(nextProps.selectedItems);
        }
        if (this.tool && nextProps.shape !== this.props.shape) {
            this.tool.setShape(nextProps.shape);
        }

        if (nextProps.isSussyModeActive && !this.props.isSussyModeActive) {
            this.activateTool();
        } else if (!nextProps.isSussyModeActive && this.props.isSussyModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.isSussyModeActive !== this.props.isSussyModeActive;
    }
    componentWillUnmount() {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool() {
        clearSelection(this.props.clearSelectedItems);
        validateColorState(this.props);

        if (!this.props.shape) {
            this.props.onSetSelectedShape("smile");
        }

        this.tool = new SussyTool(
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage
        );
        this.tool.setColorState(this.props.colorState);
        this.tool.setShape(this.props.shape);
        this.tool.activate();
    }
    deactivateTool() {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render() {
        return (
            <SussyModeComponent
                isSelected={this.props.isSussyModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

SussyMode.propTypes = {
    clearFillGradient: PropTypes.func.isRequired,
    clearStrokeGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillColor: ColorStyleProptype,
        strokeColor: ColorStyleProptype,
        strokeWidth: PropTypes.number
    }).isRequired,
    shape: PropTypes.string.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isSussyModeActive: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onChangeStrokeColor: PropTypes.func.isRequired,
    onSetSelectedShape: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item)),
    setCursor: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    colorState: state.scratchPaint.color,
    isSussyModeActive: state.scratchPaint.mode === Modes.SUSSY,
    selectedItems: state.scratchPaint.selectedItems,
    shape: state.scratchPaint.sussyMode.shape,
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
        dispatch(changeMode(Modes.SUSSY));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor, 0));
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor, 0));
    },
    onSetSelectedShape: shape => {
        dispatch(changeCurrentlySelectedShape(shape));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SussyMode);
