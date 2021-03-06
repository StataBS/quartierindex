import * as React from 'react'
import { isEqual, round } from 'lodash'
import { connect } from 'react-redux'
import { Bar, BarChart, CartesianGrid, Cell, Label, Tooltip, XAxis, YAxis } from 'recharts'
import { Rootstate } from '../../state'
import { getSortedGlobalRanking } from '../../state/observation/selectors'
import { Rank } from '../../state/observation/types'
import { Indicator } from '../../state/indicator/types'
import { allDistrictsById } from '../../state/district/selectors'
import { getSelectedIndicators } from '../../state/indicator/selectors'
import { District } from '../../state/district/types'
import DistrictLabel from './DistrictLabel'
import AnimatePosition from './AnimatePosition'
import { getRankPosition, convertDecimalPoint } from '../../helpers'
import DistrictRankingTooltip from './DistricRankingTooltip'
import './districtRanking.css'
import { asDomain, getTicks } from './util';

export interface PublicProps {
  className?: string
}

interface InjectedProps {
  ranks: Rank[]
  districts: { [key: string]: District }
  indicators: Indicator[]
}

export type Positions = {
  [id: string]: number
}

interface StateProps {
  positions: Positions
}


class DistrictRanking extends React.Component<PublicProps & InjectedProps, StateProps> {
  constructor(props: any) {
    super(props)
    this.state = {positions: {}}
  }

  render() {
    const {districts, ranks, indicators} = this.props
    let rankNum = 0
    const data = ranks.map((rank, i) => {
      if (rank.districtId !== '99') {
        rankNum = rankNum + 1
        return {
          name: `${rankNum < 10 ? ' ' : ''}${rankNum}. ${districts[rank.districtId].name}`,
          value: round(rank.value, 2),
          id: rank.districtId,
        }
      }
      // Basel-Stadt without rank (number), see handling in DistrictLabel
      return {
        name: `X ${districts[rank.districtId].name}`,
        value: round(rank.value, 2),
        id: rank.districtId,
      }
    })

    const positions = getRankPosition(data)
    const positionsBefore = this.state.positions
    const ticks = getTicks(data)
    const domain = asDomain(ticks)
    return (
      <div className="left-grid district-ranking">
        <div className="container" >
          {/* District ranking bar plot */}
          <AnimatePosition
            from={positionsBefore ? positionsBefore : positions}
            to={positions}
            onRest={() =>
              !isEqual(positionsBefore, positions) ? this.setState({positions: positions}) : {}
            }
          >
            {props => {
              return (
                <BarChart data={data} width={285} height={530} layout="vertical">
                  <CartesianGrid/>
                  {/* TODO: Check color of bar*/}
                  <XAxis
                    axisLine={false}
                    domain={domain}
                    interval="preserveStart"
                    type="number"
                    tickLine={false}
                    ticks={ticks}
                    tickFormatter={tick =>
                      tick > 0 ? convertDecimalPoint(tick.toString().substr(0, 4)) : convertDecimalPoint(tick.toString().substr(0, 5))
                    }
                  />
                  <Tooltip offsetX={-195} offsetY={-37} content={<DistrictRankingTooltip/>} />
                  <YAxis
                    width={135}
                    dataKey="name"
                    type="category"
                    orientation="right"
                    axisLine={false}
                    tick={false}
                    tickLine={false}
                  >
                    {data.map(entry => {
                      return (
                        <Label
                          content={DistrictLabel}
                          key={entry.id}
                          x={150}
                          y={props[entry.id]}
                          value={entry.name}
                        />
                      )
                    })}
                  </YAxis>
                  <Bar dataKey="value">
                    {data.map((entry, index) =>
                      entry.id === '99' ? (
                        <Cell key={`cell-${index}`} fill={'black'} y={props[entry.id]}/>
                      ) : (
                        <Cell key={`cell-${index}`} fill={'#FFD300'} y={props[entry.id]}/>
                      )
                    )}
                  </Bar>
                </BarChart>
              )
            }}
          </AnimatePosition>
          <div className="districtRankingExplanation">
            Berechnungsergebnis aus:
            <ul>
              {indicators.map(indicator => {
                return (
                  <React.Fragment key={indicator.id}>
                    <li>
                      {indicator.name} mit Gewicht {convertDecimalPoint(indicator.weight * indicator.valuation)}
                    </li>
                  </React.Fragment>
                )
              })} 
            </ul>
            <div className="method-explanation-header">Methodischer Hinweis</div>
            <div className="method-explanation-content"> Die Länge der Balken entspricht nicht dem Wert, der im Tooltip angezeigt wird, sondern ergibt sich durch Min-Max-Normalisierung der einzelnen Indikatoren. Der höchste Wert pro Indikator wird auf 1 skaliert, der niedrigste Wert auf 0.</div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: Rootstate) => ({
  ranks: getSortedGlobalRanking(state),
  districts: allDistrictsById(state),
  indicators: getSelectedIndicators(state),
})

export default connect(mapStateToProps)(DistrictRanking)
