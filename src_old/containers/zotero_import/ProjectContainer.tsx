import { connect } from 'react-redux';
import { createNewItem } from '../shared/resource/actions';
import { IStoreState } from '../../interfaces/misc';
import { Project } from '../../components/zotero_import/Project';

const mapDispatchToProps = ({
  createNewItem
});

const mapStateToProps = (state: IStoreState) => ({
  projects: state.current.data.project
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export const ProjectContainer = connector(Project);
