import * as _ from 'lodash';
import { Rootstate } from '../index';
import { Indicator } from './types'

const select = (state: Rootstate) => {
    return state.indicator;
};

/**
 * Selects all existing indicator
 */
export const allIndicators = (state: Rootstate): Indicator[] => {
    return _.values(select(state).byId);
};

export const getIndicator = (state: Rootstate, props: { id: string }): Indicator => {
  return select(state).byId[props.id];
};

export const getGroupedIndicators = (state: Rootstate): { [key: string]: Indicator[]} => {
    return _.groupBy(allIndicators(state), (indicator) => indicator.subject); 
};

/**
 * SelectIndicator all selected indicator
 */
export const getSelectedIndicators = (state: Rootstate): Indicator[] => {
    return _.filter(allIndicators(state), (indicator) => {
        return indicator.selected;
    })
}
