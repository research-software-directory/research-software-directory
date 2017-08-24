import * as React from 'react';

import { connect } from 'react-redux';

export const dummy = 3;

interface IOwnProps {
  id: string;
}

interface IMappedProps {
  reports: any[];
}

const mapStateToProps = (state: any, ownProps: IOwnProps): IMappedProps => (
  {
    reports: state.reports.find((report: any) => report.software_id === ownProps.id)
  }
);

const mapDispatchToProps = {
  createReport: (id: string) => id && null // todo
};

const connector = connect(mapStateToProps, mapDispatchToProps);

class ImpactReportsComponent extends React.Component<any, any> {
  render() {
    return (
      <div>
        {JSON.stringify(this.props)}
      </div>
    );
  }
}

export const ImpactReports = connector(ImpactReportsComponent);
