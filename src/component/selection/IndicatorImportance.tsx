import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Rootstate } from '../../state';
import { getSelectedIndicators } from '../../state/indicator/selectors';
import { Indicator } from '../../state/indicator/types';
import Grid from 'material-ui/Grid';
import { Theme, WithStyles, withStyles } from 'material-ui/styles';
import NavButton from '../customElements/NavButton';
import IndicatorImportanceLine from './IndicatorImportanceLine';
import { Redirect } from 'react-router';

export interface Props {
  selectedIndicators: Indicator[]

  positiveValuation(id: string): void

  negativeValuation(id: string): void

  toggleVisibility(visibility: boolean): void
}

type ClassNames = WithStyles<'root' | 'title' | 'leftIcon'>

export const styles = (theme: Theme) => ({
  root: {
    flexGrow: 1,
  } as React.CSSProperties,
  title: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
  } as React.CSSProperties,
  leftIcon: {
    marginRight: theme.spacing.unit,
  } as React.CSSProperties,
});

const IndicatorImportance: React.SFC<Props & ClassNames> = (props) => {
  const {classes, selectedIndicators} = props;
  if (selectedIndicators.length === 0) {
    return <Redirect to="/"/>
  }
  return (
      <div className="floating-container">
        <Grid item xs={12}>
          <h2 className={classes.title}>
            Schritt 3: Geben Sie an, wie wichtig der Indikator für Sie ist
          </h2>
          <p>
            Mit der Wichtigkeit wird festgelegt mit welchen Gewichten ein ausgewähtler Indikator
            in die Index-Berechnung einfliesst.<br/>
            Folgende Gewichts-Einstellungen sind beim Quartier-Index mögllich:<br/>
          </p>
          <p>
            positiv: sehr unwichtig = Gewicht von 0.25, eher unwichtig = Gewicht von 0.5, eher
            wichtig = Gewicht von 0.75,
            sehr wichtig = Gewicht von 1.0<br/>

            negativ: sehr unwichtig = Gewicht von -0.25, eher unwichtig = Gewicht von -0.5, eher
            wichtig = Gewicht von -0.75,
            sehr wichtig = Gewicht von -1.0
          </p>
          <Grid container direction="row">
            {
              selectedIndicators.map(indicator => {
                return <IndicatorImportanceLine key={indicator.id} indicator={indicator}/>
              })}
          </Grid>
          <Grid container justify="space-between">
            <Grid item xs={1}>
              <NavButton variant="raised" to={'/ranking'}>Zurück</NavButton>
            </Grid>
            <Grid item xs={2}>
              <NavButton variant="raised" to={'plot'}>Weiter</NavButton>
            </Grid>
          </Grid>
        </Grid>
      </div>
  );
}

const mapStateToProps = (state: Rootstate) => ({
  selectedIndicators: getSelectedIndicators(state)
});

const mapDispatchToProps = ({});

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps))
(IndicatorImportance);