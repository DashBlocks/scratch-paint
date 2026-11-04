import log from '../log/log';

const CHANGE_TRIANGLE_SIDE_COUNT = 'scratch-paint/triangle-mode/CHANGE_TRIANGLE_SIDE_COUNT';
const CHANGE_TRIANGLE_SPOKE_RATIO = 'scratch-paint/triangle-mode/CHANGE_TRIANGLE_SPOKE_RATIO';
const CHANGE_TRIANGLE_POINT_COUNT = 'scratch-paint/triangle-mode/CHANGE_TRIANGLE_POINT_COUNT';
const initialState = {
    sideCount: 3,
    spokeRatio: 1,
    trianglePolyCount: 3,
    trianglePointCount: 1
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_TRIANGLE_SIDE_COUNT: {
        const sideCount = action.trianglePolyCount === undefined ? action.sideCount : action.trianglePolyCount;
        if (isNaN(sideCount)) {
            log.warn(`Invalid side count: ${sideCount}`);
            return state;
        }
        const count = Math.floor(Math.max(3, sideCount));
        return {...state, sideCount: count, trianglePolyCount: count};
    }
    case CHANGE_TRIANGLE_SPOKE_RATIO:
    case CHANGE_TRIANGLE_POINT_COUNT: {
        const ratio = action.trianglePointCount === undefined ? action.spokeRatio : action.trianglePointCount;
        if (isNaN(ratio)) {
            log.warn(`Invalid spoke ratio: ${ratio}`);
            return state;
        }
        const pointCount = Math.max(0.01, ratio);
        return {...state, spokeRatio: pointCount, trianglePointCount: pointCount};
    }
    default:
        return state;
    }
};

const changeSideCount = function (sideCount) {
    return {
        type: CHANGE_TRIANGLE_SIDE_COUNT,
        sideCount: sideCount
    };
};

const changeSpokeRatio = function (spokeRatio) {
    return {
        type: CHANGE_TRIANGLE_SPOKE_RATIO,
        spokeRatio: spokeRatio
    };
};

const changeTrianglePolyCount = function (trianglePolyCount) {
    return {
        type: CHANGE_TRIANGLE_SIDE_COUNT,
        trianglePolyCount: trianglePolyCount
    };
};

const changeTrianglePointCount = function (trianglePointCount) {
    return {
        type: CHANGE_TRIANGLE_POINT_COUNT,
        trianglePointCount: trianglePointCount
    };
};

export {
    reducer as default,
    changeSideCount,
    changeSpokeRatio,
    changeTrianglePolyCount,
    changeTrianglePointCount
};
