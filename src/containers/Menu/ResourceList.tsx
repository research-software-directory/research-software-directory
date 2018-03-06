import { connect } from 'react-redux';
import { IStoreState } from '../../rootReducer';
import ResourceList, { IOwnProps } from '../../components/Menu/ResourceList';

const mapStateToProps = (state: IStoreState, ownProps: IOwnProps) => ({
  data:      state.data[ownProps.type],
  schema:    state.schema[ownProps.type],
  location:  state.route.location
});

const dispatchToProps = {
};

export default connect(mapStateToProps, dispatchToProps)(ResourceList);
