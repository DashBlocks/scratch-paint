import log from '../log/log';

const CHANGE_PEN_SMOOTHING_SIZE = 'scratch-paint/pen-mode/CHANGE_PEN_SMOOTHING_SIZE';
const CHANGE_PEN_SIMPLIFY_SIZE = 'scratch-paint/pen-mode/CHANGE_PEN_SIMPLIFY_SIZE';
const initialState = {smoothingSize: 2, simplifySize: 2};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_PEN_SMOOTHING_SIZE:
        if (isNaN(action.smoothingSize)) {
            log.warn(`Invalid smoothing setting: ${action.smoothingSize}`);
            return state;
        }
        return {smoothingSize: Math.max(0, action.smoothingSize), simplifySize: Math.max(0, action.smoothingSize)};
    case CHANGE_PEN_SIMPLIFY_SIZE:
        if (isNaN(action.simplifySize)) {
            log.warn(`Invalid simplify setting: ${action.simplifySize}`);
            return state;
        }
        return {smoothingSize: Math.max(0, action.simplifySize), simplifySize: Math.max(0, action.simplifySize)};
    default:
        return state;
    }
};

const changeSmoothingSize = function (smoothingSize) {
    return {
        type: CHANGE_PEN_SMOOTHING_SIZE,
        smoothingSize: smoothingSize
    };
};

const changeSimplifySize = function (simplifySize) {
    return {
        type: CHANGE_PEN_SIMPLIFY_SIZE,
        simplifySize: simplifySize
    };
};

export {
    reducer as default,
    changeSmoothingSize,
    changeSimplifySize
};
