import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Menu from '../components/Menu';
import { IStoreState } from '../rootReducer';

const mapStateToProps = (state: IStoreState) => ({
  jwt:       state.jwt,
  schema:    state.schema,
  data:      state.data,
  settings:  state.settings
});

const dispatchToProps = {
  push
};

export default connect(mapStateToProps, dispatchToProps)(Menu);
