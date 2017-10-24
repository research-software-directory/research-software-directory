import { getNewProjects, getNewPublications, getNewSoftware } from './actions';
import { connect } from 'react-redux';
import { createNewItem } from '../shared/resource/actions';
import { ZoteroImporter } from '../../components/zotero_import/ZoteroImporter';

const dispatchToProps = ({
  getNewProjects,
  getNewPublications,
  getNewSoftware,
  createNewItem
});

const mapStateToProps = (state: any) => ({
  projects: state.zotero.projects,
  publications: state.zotero.publications,
  software: state.zotero.software
});

const connector = connect(mapStateToProps, dispatchToProps);
export const ZoteroImporterContainer = connector(ZoteroImporter);
