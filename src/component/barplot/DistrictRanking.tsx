import * as React from 'react'
import { round, isEqual } from 'lodash'
import { connect } from 'react-redux'
import { BarChart, Bar, CartesianGrid, Cell, XAxis, YAxis, Label } from 'recharts'
import { Rootstate } from '../../state'
import { getSortedGlobalRanking } from '../../state/observation/selectors'
import { Rank } from '../../state/observation/types'
import { Indicator } from '../../state/indicator/types'
import { allDistrictsById } from '../../state/district/selectors'
import { getSelectedIndicators } from '../../state/indicator/selectors'
import { District } from '../../state/district/types'
import DistrictLabel from './DistrictLabel'
import AnimatePosition from './AnimatePosition'
import { getRankPosition } from '../../helpers'

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
    this.state = { positions: {} }
  }

  render() {
    const { districts, ranks, indicators } = this.props
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

      //    rankNum = rankNum - 1
      // Basel-Stadt without rank (number), see handling in DistrictLabel
      return {
        name: `X ${districts[rank.districtId].name}`,
        value: round(rank.value, 2),
        id: rank.districtId,
      }
    })
    const ticks = [-1, -0.5, 0, 0.5, 1]

    const positions = getRankPosition(data)

    const positionsBefore = this.state.positions

    return (
      <div className="left-grid district-ranking">
        <div className="container">
          {/* District ranking bar plot */}
          <AnimatePosition
            from={positionsBefore ? positionsBefore : positions}
            to={positions}
            onRest={() =>
              !isEqual(positionsBefore, positions) ? this.setState({ positions: positions }) : {}
            }
          >
            {props => {
              return (
                <BarChart data={data} width={280} height={530} layout="vertical">
                  <CartesianGrid />
                  {/* TODO: Check color of bar*/}
                  <XAxis
                    axisLine={false}
                    domain={[-1, 1]}
                    interval="preserveStart"
                    type="number"
                    tickLine={false}
                    ticks={ticks}
                    tickFormatter={tick => (ticks.indexOf(tick) % 2 === 0 ? tick : '')}
                  />
                  <YAxis
                    width={130}
                    type="category"
                    orientation="right"
                    axisLine={false}
                    tick={false}
                    tickLine={false}
                  >
                    {data.map((entry, index) => {
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
                        <Cell key={`cell-${index}`} fill={'black'} y={props[entry.id]} />
                      ) : (
                        <Cell key={`cell-${index}`} fill={'#FFD300'} y={props[entry.id]} />
                      )
                    )}
                  </Bar>
                  )
                </BarChart>
              )
            }}
          </AnimatePosition>
          <div className="districtRankingExplanation">
            <p>
              Berechnungsergebnis aus: <br />
              {indicators.map(indicator => {
                return (
                  <React.Fragment key={indicator.id}>
                    <span className="districtRankingExplanationEntry">
                      - {indicator.name} mit einer Gewichtung von{' '}
                      {indicator.weight * indicator.valuation}
                    </span>
                    <br />
                  </React.Fragment>
                )
              })}
            </p>
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
