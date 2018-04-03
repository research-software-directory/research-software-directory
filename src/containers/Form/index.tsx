import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { IStoreState } from '../../rootReducer';
import Form from '../../components/Form';

const mapStateToProps = (state: IStoreState) => ({
  data:      state.data,
  schema:    state.schema,
  settings:  state.settings
});

const dispatchToProps = {
  push
};

export default connect(mapStateToProps, dispatchToProps)(Form);
