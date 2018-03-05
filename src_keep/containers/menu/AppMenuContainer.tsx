import { connect } from 'react-redux';
import { saveChanges } from './actions';
import { push } from 'react-router-redux';
import { AppMenu } from '../../components/menu/AppMenu';
import { IStoreState } from '../../interfaces/misc';

const mapStateToProps = (state: IStoreState) => ({
  numAsyncs: state.async.filter((asyncAction: any) =>
    asyncAction.status !== 'DONE' && asyncAction.status !== 'FAILED'
  ).length,
  user:      state.auth.user,
  dataDirty: state.current.data !== state.data
});

const dispatchToProps = {
  saveChanges,
  push
};

const connector = connect(mapStateToProps, dispatchToProps, null, { pure: false} );

export const AppMenuContainer = connector(AppMenu);
