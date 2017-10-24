import * as React from 'react';
import * as Dropzone from 'react-dropzone';
import { Button, Icon, Modal, Segment } from 'semantic-ui-react';
import { BACKEND_URL } from '../../settings';
import './Images.css';

interface IProps {
  images: string[];
  imageUpload(image: File): any;
  loadImages(): any;
}

interface IState {
  openImage: string | null;
}

export class Images extends React.PureComponent<IProps, IState> {
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
      <div
        className="img_container"
        onClick={this.onImageClick(image)}
        role="img"
      >
        <img
          alt="thumbnail"
          src={`${BACKEND_URL}/thumbnail/${image}`}
        />
      </div>
    );
  }

  thumbnails = (images: string[]) => (
    <div className="thumbnails">
      {images.map(this.thumbnail)}
    </div>
  )

  dropzoneContent = (props: any) => (
    <div style={{ border: `2px solid ${props.isDragActive ? 'green' : 'white'}` }}>
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
      <Segment className="dropzone">
        <Modal
          open={!!this.state.openImage}
          basic={true}
          onClose={this.closeModal}
          onClick={this.closeModal}
          style={{textAlign: 'center'}}
        >
          <img src={`${BACKEND_URL}/image/${this.state.openImage}`} alt="zoomed" />
        </Modal>
        <Button onClick={this.openFileDialog}>Add <Icon name="image" /></Button>
        <Dropzone
          ref={this.setDropzoneRef}
          disableClick={true}
          onDrop={this.onDrop}
          style={{}}
          accept="image/jpeg, image/png"
        >
          {this.dropzoneContent}
        </Dropzone>
      </Segment>
    );
  }
}