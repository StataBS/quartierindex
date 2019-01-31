import * as React from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { round } from 'lodash'
import { Rank } from '../../state/observation/types'
import { Rootstate } from '../../state'
import { makeGetIndicatorRanking } from '../../state/observation/selectors'
import { District } from '../../state/district/types'
import { Indicator, NegativePositive } from '../../state/indicator/types'
import { allDistrictsById } from '../../state/district/selectors'
import { getColor } from '../../helpers'
export interface IndicatorPlotPublicProps {
  // indicator id
  indicator: Indicator
}

interface IndicatorProps {
  indicator: Indicator
  districts: { [key: string]: District }
  ranks: Rank[]
}

const IndicatorPlot: React.SFC<IndicatorProps> = ({ districts, indicator, ranks }) => {
  const data = ranks.map(rank => {
    return {
      name: districts[rank.districtId].name,
      value: round(rank.value, 2),
    }
  })

  const color = getColor(indicator.valuation === NegativePositive.Positive)

  const ticks = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="bar-plot" key={indicator.id}>
      <BarChart data={data} layout="vertical" width={190} height={530}>
        <CartesianGrid />
        // TODO: Check color of bar
        <XAxis
          axisLine={false}
          domain={[0, 1]}
          type="number"
          tickLine={false}
          ticks={ticks}
          tickFormatter={tick => (ticks.indexOf(tick) % 2 === 0 ? tick : '')}
        />
        {
          <YAxis
            dataKey="name"
            type="category"
            orientation="right"
            axisLine={false}
            hide={true}
            tickLine={false}
          />
        }
        <Bar dataKey="value" fill={color.backgroundColor} />
      </BarChart>
    </div>
  )
}

// Each IndicatorPlot receives their own selector, only updates when something relevant changes
const makeMapStateToProps = () => {
  const getIndicatorRanking = makeGetIndicatorRanking()
  const mapStateToProps = (state: Rootstate, props: IndicatorPlotPublicProps): IndicatorProps => ({
    ranks: getIndicatorRanking(state, { id: props.indicator.id }),
    districts: allDistrictsById(state),
    ...props,
  })
  return mapStateToProps
}

export default compose<IndicatorProps, IndicatorPlotPublicProps>(
  connect(
    makeMapStateToProps,
    undefined
  )
)(IndicatorPlot)
