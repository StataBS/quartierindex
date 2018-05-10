import * as React from 'react';
import { connect } from 'react-redux';
import { Rootstate } from '../../state';
import { getLineRanking } from '../../state/observation/selectors';
import ParallelLinePlot from '../parallelLinePlot/ParallelLinePlot';
import DistrictRanking from '../ranking/DistrictRanking';

// import { Observation } from '../../state/observation/types'

export interface Props {
}

const All: React.StatelessComponent<Props> = ({}) => {
  return (
      <div className="App">
        <ParallelLinePlot/>
        <DistrictRanking title={'Rangliste'}/>
      </div>
  );
};

const mapStateToProps = (state: Rootstate): Props => ({
  rankings: getLineRanking(state),
});

export default connect<Props>(mapStateToProps)(All);
