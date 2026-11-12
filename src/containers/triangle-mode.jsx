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
import { changeTrianglePolyCount, changeTrianglePointCount } from '../reducers/triangle-mode';

import { clearSelection, getSelectedLeafItems } from '../helper/selection';
import TriangleTool from '../helper/tools/triangle-tool';
import TriangleModeComponent from '../components/triangle-mode/triangle-mode.jsx';

class TriangleMode extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount() {
        if (this.props.isTriangleModeActive) {
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
        if (this.tool && nextProps.sideCount !== this.props.sideCount) {
            this.tool.setSideCount(nextProps.sideCount);
        }
        if (this.tool && nextProps.pointCount !== this.props.pointCount) {
            this.tool.setPointCount(nextProps.pointCount);
        }

        if (nextProps.isTriangleModeActive && !this.props.isTriangleModeActive) {
            this.activateTool();
        } else if (!nextProps.isTriangleModeActive && this.props.isTriangleModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.isTriangleModeActive !== this.props.isTriangleModeActive;
    }
    componentWillUnmount() {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool() {
        clearSelection(this.props.clearSelectedItems);
        validateColorState(this.props);

        if (typeof this.props.sideCount !== "number") {
            this.props.onSetSideCount(3);
        }
        if (typeof this.props.pointCount !== "number") {
            this.props.onSetPointCount(1);
        }

        this.tool = new TriangleTool(
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage
        );
        this.tool.setSideCount(this.props.sideCount);
        this.tool.setPointCount(this.props.pointCount);
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
            <TriangleModeComponent
                isSelected={this.props.isTriangleModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

TriangleMode.propTypes = {
    clearFillGradient: PropTypes.func.isRequired,
    clearStrokeGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillColor: ColorStyleProptype,
        strokeColor: ColorStyleProptype,
        strokeWidth: PropTypes.number
    }).isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isTriangleModeActive: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onChangeStrokeColor: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item)),
    setCursor: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired,
    sideCount: PropTypes.number.isRequired,
    pointCount: PropTypes.number.isRequired,
    onSetSideCount: PropTypes.func.isRequired,
    onSetPointCount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    colorState: state.scratchPaint.color,
    isTriangleModeActive: state.scratchPaint.mode === Modes.TRIANGLE,
    selectedItems: state.scratchPaint.selectedItems,
    sideCount: state.scratchPaint.triangleMode.trianglePolyCount,
    pointCount: state.scratchPaint.triangleMode.trianglePointCount,
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
        dispatch(changeMode(Modes.TRIANGLE));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor, 0));
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor, 0));
    },
    onSetSideCount: sideCount => {
        dispatch(changeTrianglePolyCount(sideCount));
    },
    onSetPointCount: pointCount => {
        dispatch(changeTrianglePointCount(pointCount));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TriangleMode);
