import { connect } from 'react-redux';
import { createNewItem } from '../shared/resource/actions';
import { NewItem } from '../../components/menu/NewItem';

interface IOwnProps {
  resourceType: string;
}

const mapStateToProps = (state: any, ownProps: IOwnProps) => ({
    data:   state.data[ownProps.resourceType]
  });

const dispatchToProps = {
  createNewItem
};

const connector = connect(mapStateToProps, dispatchToProps);

export const NewItemContainer = connector(NewItem);
