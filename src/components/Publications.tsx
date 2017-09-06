import * as React from 'react';
import { connect } from 'react-redux';
import * as JSONPretty from 'react-json-pretty';

interface IProps {
  publications: any;
}

const mapStateToProps = (state: any) => ({
  publications: state.current.data.publication
});

const connector = connect(mapStateToProps);

class PublicationsComponent extends React.PureComponent<IProps, {}> {
  render() {
    return <JSONPretty json={this.props.publications} />;
  }
}

export const Publications = connector(PublicationsComponent);