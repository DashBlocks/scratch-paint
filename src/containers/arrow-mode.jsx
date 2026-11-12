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

import { clearSelection, getSelectedLeafItems } from '../helper/selection';
import ArrowTool from '../helper/tools/arrow-tool';
import ArrowModeComponent from '../components/arrow-mode/arrow-mode.jsx';

class ArrowMode extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount() {
        if (this.props.isArrowModeActive) {
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

        if (nextProps.isArrowModeActive && !this.props.isArrowModeActive) {
            this.activateTool();
        } else if (!nextProps.isArrowModeActive && this.props.isArrowModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.isArrowModeActive !== this.props.isArrowModeActive;
    }
    componentWillUnmount() {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool() {
        clearSelection(this.props.clearSelectedItems);
        validateColorState(this.props);

        this.tool = new ArrowTool(
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage
        );
        this.tool.setColorState(this.props.colorState);
        this.tool.activate();
    }
    deactivateTool() {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render() {
        return (
            <ArrowModeComponent
                isSelected={this.props.isArrowModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

ArrowMode.propTypes = {
    clearFillGradient: PropTypes.func.isRequired,
    clearStrokeGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillColor: ColorStyleProptype,
        strokeColor: ColorStyleProptype,
        strokeWidth: PropTypes.number
    }).isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isArrowModeActive: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onChangeStrokeColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item)),
    setCursor: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    colorState: state.scratchPaint.color,
    isArrowModeActive: state.scratchPaint.mode === Modes.ARROW,
    selectedItems: state.scratchPaint.selectedItems
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
        dispatch(changeMode(Modes.ARROW));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArrowMode);
