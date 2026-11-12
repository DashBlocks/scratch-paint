import { MIXED } from '../helper/style-path';
import { DEFAULT_COLOR } from '../reducers/fill-style';
import { colorIsTransparent } from './tw-color-utils';
import GradientTypes from './gradient-types';

export default function validateColorState(props) {
    const { strokeWidth } = props.colorState;
    const fillColor1 = props.colorState.fillColor.stops[0].color;
    const fillGradient = props.colorState.fillColor.gradientType;
    const strokeColor1 = props.colorState.strokeColor.stops[0].color;
    const strokeGradient = props.colorState.strokeColor.gradientType;

    const fillColorMissing = fillColor1 === MIXED ||
        (fillGradient === GradientTypes.SOLID && colorIsTransparent(fillColor1));
    const strokeColorMissing = strokeColor1 === MIXED ||
        (strokeGradient === GradientTypes.SOLID && colorIsTransparent(strokeColor1)) ||
        strokeWidth === null ||
        strokeWidth === 0;

    if (fillColorMissing && strokeColorMissing) {
        props.onChangeFillColor(DEFAULT_COLOR);
        props.clearFillGradient();
        props.onChangeStrokeColor('#00000000');
        props.clearStrokeGradient();
    } else if (fillColorMissing && !strokeColorMissing) {
        props.onChangeFillColor('#00000000');
        props.clearFillGradient();
    } else if (!fillColorMissing && strokeColorMissing) {
        props.onChangeStrokeColor('#00000000');
        props.clearStrokeGradient();
    }
}