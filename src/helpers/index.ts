import { LineRank } from '../state/observation/types';
import { Indicator, NegativePositive, WeightNumber } from '../state/indicator/types';
import { District } from '../state/district/types';

export const getRankingColor = (rank: LineRank): string => {

  if (rank.highlighted && rank.hover) {
    return '#4d00ff';
  } else if (rank.highlighted || rank.hover) {
    return 'black';
  } else {
    return 'rgb(160, 160, 160)';
  }
};

export const getClassNameSelectedUnselected = (indicator: Indicator, buttonType: string): string => {

  if (indicator.valuation === -1 && buttonType === 'negative') {
    return ' negative-selected'
  } else if (indicator.valuation === 1 && buttonType === 'negative') {
    return ' negative-unselected'
  } else if (indicator.valuation === 1 && buttonType === 'positive') {
    return ' positive-selected'
  } else if (indicator.valuation === -1 && buttonType === 'positive') {
    return ' positive-unselected'
  }
  return '';
};

export const getClassNameNegPosBorder = (indicator: Indicator): string => {
  switch (indicator.valuation) {
    case NegativePositive.Negative:
      return ' negative-border ';
    case NegativePositive.Positive:
      return ' positive-border ';
    default:
      return '';
  }
};

export const getClassNameNegPos = (indicator: Indicator): string => {
  switch (indicator.valuation) {
    case NegativePositive.Negative:
      return ' negative ';
    case NegativePositive.Positive:
      return ' positive ';
    default:
      return '';
  }
};

export const labels = ['sehr unwichtig', 'eher unwichtig', 'eher wichtig', 'sehr wichtig'];

export const getLabelBy = (weight: WeightNumber): string => {
  switch (weight) {
    case WeightNumber.ONE:
      return labels[0];
    case WeightNumber.TWO:
      return labels[1];
    case WeightNumber.THREE:
      return labels[2];
    case WeightNumber.FOUR:
      return labels[3];
    default:
      return '';
  }
};

export const anyUserSelection = (districts: District[]): boolean =>
    districts
    .map(d => d.viewOptions.highlight)
    .reduce((a, b) => a || b);
