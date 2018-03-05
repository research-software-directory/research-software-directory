import { connect } from 'react-redux';
import { generateReport, getReports } from './actions';
import { ImpactReports } from '../../components/ImpactReports';
import { IStoreState } from '../../interfaces/misc';

interface IMappedProps {
  reports: any[];
}

interface IDispatchProps {
  generateReport: typeof generateReport;
  getReports: typeof getReports;
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

const connector = connect<IMappedProps, IDispatchProps>(mapStateToProps, mapDispatchToProps);

export const ImpactReportsContainer = connector(ImpactReports);
