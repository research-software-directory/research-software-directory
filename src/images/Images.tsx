import * as React from 'react';

import { connect } from 'react-redux';

import * as Dropzone from 'react-dropzone';

import { imageUpload, loadImages } from './actions';

import { Button, Modal, Segment } from 'semantic-ui-react';

import { BACKEND_URL } from '../constants';

import './Images.css';

const mapStateToProps = (state: any) => ({
  images: state.images
});

const dispatchToProps = {
  imageUpload,
  loadImages
};

const connector = connect(mapStateToProps, dispatchToProps);

interface IProps {
  images: string[];
  imageUpload(image: File): any;
  loadImages(): any;
}

interface IState {
  openImage: string | null;
}

class ImagesComponent extends React.Component<IProps, IState> {
  dropzoneElm: Dropzone;

  componentWillMount() {
    this.setState({openImage: null});
    this.props.loadImages();
  }

  onDrop = (files: File[]) => {
    this.props.imageUpload(files[0]);
  }

  onImageClick = (image: string) => () => this.setState({openImage: image});

  thumbnail = (image: string) => {
    return (
      <div className="img_container">
        <img
          alt="thumbnail"
          src={`${BACKEND_URL}/thumbnail/${image}`}
          onClick={this.onImageClick(image)}
        />
      </div>
    );
  }

  thumbnails = (images: string[]) => (
    <Segment className="thumbnails">
      {images.map(this.thumbnail)}
    </Segment>
  )

  dropzoneContent = (props: any) => (
    <div style={{ border: `2px solid ${props.isDragActive ? 'green' : 'black'}` }}>
      <p>dropzone</p>
      {JSON.stringify(props)}
      {this.thumbnails(this.props.images)}
    </div>
  )

  closeModal = () => {
    this.setState({openImage: null});
  }

  setDropzoneRef = (node: any) => { this.dropzoneElm = node; };

  openFileDialog = () => {
    this.dropzoneElm.open();
  }

  render() {
    return (
      <div className="dropzone">
        <Modal
          open={!!this.state.openImage}
          basic={true}
          onClose={this.closeModal}
          onClick={this.closeModal}
          style={{textAlign: 'center'}}
        >
          <img src={`${BACKEND_URL}/image/${this.state.openImage}`} alt="zoomed" />
        </Modal>
        <Button onClick={this.openFileDialog}>Add</Button>
        <Dropzone
          ref={this.setDropzoneRef}
          disableClick={true}
          onDrop={this.onDrop}
          style={{}}
          accept="image/jpeg, image/png"
        >
          {this.dropzoneContent}
        </Dropzone>
      </div>
    );
  }
}

export const Images = connector(ImagesComponent);
