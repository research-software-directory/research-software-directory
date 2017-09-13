// import * as React from 'react';
// import { connect } from 'react-redux';
//
// interface IOwnProps {
//   ownProp: any;
// }
//
// interface IStateProps {
//   stateProp: any;
// }
//
// const mapStateToProps = (state: any) => {
//   return { stateProp: state.someProp };
// };
//
// class App extends React.Component<IOwnProps & IStateProps, {}> {
//   render() {
//     return <div>App {this.props.stateProp}</div>;
//   }
// }
//
// const connector = connect<IStateProps, {}, IOwnProps>(mapStateToProps);
// const ConnectedApp = connector(App);
//
// const cError = <ConnectedApp ownProp="test" />;
// const cOK = <ConnectedApp ownProp="test" stateProp="bla" />;
