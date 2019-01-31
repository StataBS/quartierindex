import * as React from 'react'
import { connect } from 'react-redux'
import { Rootstate } from '../state/index'
import DistrictRanking from '../component/barplot/DistrictRanking'
import AppNavigation from '../component/navigation/MainNavigation'
import IndicatorRanking from '../component/parallelLinePlot/IndicatorRanking'
import { compose } from 'recompose'
import Disclaimer from '../component/disclaimer/Disclaimer';
// import { Observation } from '../../state/observation/types'

export interface Props {}

const MainView: React.StatelessComponent<Props> = ({}) => {
  return (
    <div className="App main-view">
      <div className="left-grid information">
      Weitere Anpassungen können entweder direkt an den Knöpfen und Reglern oberhalb der Grafiken
      oder über den entsprechenden Arbeistsschritt vorgenommen werden.
      </div>
      <div className="left-grid title">
        <h2 className="district-ranking-title">Rangliste</h2>
      </div>
      <AppNavigation />
      <div className="right-grid indicator-ranking">
        <IndicatorRanking />
      </div>
      <DistrictRanking />
      <Disclaimer/>
    </div>
  )
}

const mapStateToProps = (state: Rootstate): Props => ({})

export default compose<Props, {}>(connect(mapStateToProps))(MainView)
