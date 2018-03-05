import { connect } from 'react-redux';
import { createNewItem, updateField } from '../shared/resource/actions';
import { IStoreState } from '../../interfaces/misc';
import { Software } from '../../components/zotero_import/Software';

const mapDispatchToProps = ({
  createNewItem,
  updateField
});

const mapStateToProps = (state: IStoreState) => ({
  software: state.current.data.software
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export const SoftwareContainer = connector(Software);
