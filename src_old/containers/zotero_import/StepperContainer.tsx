import { connect } from 'react-redux';
import { getNewPublications } from './actions';
import { createNewItem } from '../shared/resource/actions';
import { Stepper } from '../../components/zotero_import/Stepper';
import { IStoreState } from '../../interfaces/misc';

const dispatchToProps = { getNewPublications, createNewItem };

const mapStateToProps = (state: IStoreState) => ({
    zoteroPublications: state.zotero.publications.items,
    publications: state.current.data.publication
});

const connector = connect(mapStateToProps, dispatchToProps);
export const StepperContainer = connector(Stepper);
