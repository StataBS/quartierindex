import * as React from 'react';
import { LineRank } from '../../state/observation/types';

export interface Props {
  rank: LineRank;
  rankIndex: number;
}

const y = (yPos: number): string => {
  const yy = ( 1 - yPos ) * 100;
  return yy.toString() + '%';
};

const color = (rank: LineRank): string =>
    'hsl(' + rank.color.h.toString() + ', '
    + rank.color.s.toString() + '%,'
    + rank.color.v.toString() + '%)';

const labelPos = (rankIndex: number): string =>
    ((1 - 0.9 * (1 - rankIndex / 21)) * 100).toString() + '%';

const LineRankItem: React.StatelessComponent<Props> = ({rank, rankIndex}) => {
  return (
      <g>
        <line x1="10%" x2="18%" y1={y(rank.rankValue)} y2={y(rank.rankValue)} stroke={color(rank)}/>
        <line x1="18%" x2="40%" y1={y(rank.rankValue)} y2={labelPos(rankIndex)} stroke={color(rank)} strokeWidth="1"/>
        <circle cx="10%" cy={y(rank.rankValue)} r={10} fill={color(rank)}/>
        <text x="40%" y={labelPos(rankIndex)} fill={color(rank)}>{rank.labelText}</text>
      </g>
  );

};

export default LineRankItem;
