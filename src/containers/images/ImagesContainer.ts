import { connect } from 'react-redux';
import { imageUpload, loadImages } from './actions';
import { Images } from '../../components/images/Images';
import { IStoreState } from '../../interfaces/misc';

const mapStateToProps = (state: IStoreState) => ({
  images: state.images
});

const dispatchToProps = {
  imageUpload,
  loadImages
};

const connector = connect(mapStateToProps, dispatchToProps);

export const ImagesContainer = connector(Images);
