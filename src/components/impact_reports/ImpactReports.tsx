import * as React from 'react';
import { connect } from 'react-redux';
import { generateReport, getReports } from './actions';
import * as JSONPretty from 'react-json-pretty';
import {Button, Icon} from 'semantic-ui-react';

import 'react-json-pretty/src/JSONPretty.monikai.css';
import {IStoreState} from '../../containers/store';

interface IOwnProps {
  id: string;
}

interface IMappedProps {
  reports: any[];
}

interface IDispatchProps {
  generateReport: typeof generateReport;
  getReports: typeof getReports;
}

interface IState {
  refreshing: boolean;
}

const sortByField = (field: string, desc: boolean = false) => (a: any, b: any) => {
  if (a[field] < b[field]) { return desc ? 1 : -1; }
  if (a[field] > b[field]) { return desc ? -1 : 1; }

  return 0;
};

const mapStateToProps = (state: IStoreState): IMappedProps => (
  {
    reports: state.reports.sort(sortByField('time_start', true))
  }
);

const mapDispatchToProps = { generateReport, getReports };

const connector = connect<IMappedProps, IDispatchProps, IOwnProps>(mapStateToProps, mapDispatchToProps);

class ImpactReportsComponent extends React.PureComponent<IOwnProps & IMappedProps & IDispatchProps, IState> {
  refresh = () => {
    this.setState({refreshing: true});
    this.props.getReports(this.props.id);
  }
  componentWillMount() {
    this.state = {refreshing: true};
    this.refresh();
  }
  componentWillReceiveProps() {
    this.setState({refreshing: false});
  }
  newReportClick = () => {
    this.setState({refreshing: true});
    this.props.generateReport(this.props.id);
    setTimeout(() =>
      this.props.getReports(this.props.id),
      500
    );
  }
  generateButtonIsDisabled = () => {
    return this.state.refreshing ||
      (this.props.reports && this.props.reports.length > 0 &&  this.props.reports[0].status === 'generating');
  }

  render() {
    return (
      <div>
        <Button disabled={this.generateButtonIsDisabled()} onClick={this.newReportClick}>Generate new report</Button>
        <Button onClick={this.refresh} icon={true}>
          <Icon name="refresh" />
        </Button>
        <div style={{width: '100%'}}>
          <JSONPretty json={this.props.reports} />
        </div>
      </div>
    );
  }
}

export const ImpactReports = connector(ImpactReportsComponent);
