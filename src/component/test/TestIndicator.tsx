import * as React from 'react';
import { connect } from 'react-redux';
import { Rootstate } from '../../state/index';
import { allIndicators } from '../../state/indicator/selectors';
import { Indicator } from '../../state/indicator/types';
import {
  selectIndicator, deselectIndicator,
} from '../../state/indicator/actions';

export interface Props {
    indicators: Indicator[],
  select(id: string): void
  deselect(id: string): void
}

function TestIndicators({ indicators, select, deselect }: Props) {
    return (
      <div>
        <h1>Alle Indikatoren</h1>
        {
                // Create an element per indicator item
                indicators.map(indicator => {
                    return (
                      <p key={indicator.id}>
                        {indicator.id} {indicator.name}
                        (selected: {indicator.selected ? 'true' : 'false'},
                          weight: {indicator.weight} )
                        { indicator.selected ?
                          (<button onClick={() => deselect(indicator.id)}>DeSelect</button>) :
                          (<button onClick={() => select(indicator.id)}>Select</button>)
                        }
                      </p>
                    );
                })
            }
     </div>
    );
}

const mapStateToProps = (state: Rootstate) => ({
    indicators: allIndicators(state)
});

const mapDispatchToProps = ({
  select: selectIndicator,
  deselect: deselectIndicator
});

export default connect(mapStateToProps, mapDispatchToProps)(TestIndicators);
