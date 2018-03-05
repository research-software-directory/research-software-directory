import { connect } from 'react-redux';
import { undoChanges } from '../shared/resource/actions';
import { ISchema } from '../../interfaces/json-schema';
import { IData, IStoreState } from '../../interfaces/misc';
import { MenuItems } from '../../components/menu/MenuItems';

interface IMappedProps {
  data: IData;
  oldData: IData;
  schema: { [key: string]: ISchema };
  location: Location;
}

interface IDispatchProps {
  undoChanges: any;
}

const dispatchToProps = { undoChanges };

const mapStateToProps = (state: IStoreState) => ({
  data:    state.current.data,
  oldData: state.data,
  schema:  state.schema,
  location: state.route.location
});

const connector = connect<IMappedProps, IDispatchProps> (mapStateToProps, dispatchToProps);
export const MenuItemsContainer = connector(MenuItems);
