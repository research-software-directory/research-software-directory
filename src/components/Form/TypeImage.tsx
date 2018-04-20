import * as React from "react";
import { IProps } from "./IProps";
import { IStringSchema } from "../../interfaces/json-schema";
import styled, { StyledComponentClass } from "styled-components";
import Cropper from "react-cropper";
import Dropzone from "react-dropzone";
import "cropperjs/dist/cropper.css";
import { Modal, ModalProps, Button, Icon } from "semantic-ui-react";

type IState = {
  fileDataUrl: string | null;
};

type Dimensions = { width: number; height: number };
type ResizeFunction = (resolution: Dimensions) => Dimensions;

const resizeBoundingBox = ({
  maxWidth,
  maxHeight
}: {
  maxWidth: number;
  maxHeight: number;
}): ResizeFunction => ({ width, height }: Dimensions) => {
  let [newWidth, newHeight] = [width, height];
  if (maxWidth < newWidth) {
    newHeight = maxWidth / width * newHeight;
    newWidth = maxWidth;
  }
  if (maxHeight < newHeight) {
    newWidth = maxHeight / newHeight * newWidth;
    newHeight = maxHeight;
  }
  return { width: newWidth, height: newHeight };
};

function resizedataURL(
  dataURL: string,
  resizeFunction: ResizeFunction
): PromiseLike<string> {
  return new Promise(resolve => {
    const img = document.createElement("img");
    img.onload = function() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d") as any;

      let { width, height } = resizeFunction({
        width: img.width,
        height: img.height
      });
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL());
    };

    img.src = dataURL;
  });
}

export default class TypeImage extends React.Component<
  IProps<IStringSchema>,
  IState
> {
  _cropper: JSX.Element | null = null;

  constructor(props: any) {
    super(props);
    this.state = {
      fileDataUrl: null
    };
  }

  onDrop = (files: any) => {
    console.log(files[0]);
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.setState({ fileDataUrl: e.target.result });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  onCancel = () => {
    this.setState({ fileDataUrl: null });
  };

  onCrop = async () => {
    const canvas = (this._cropper as any).cropper.getCroppedCanvas();
    const dataURL: string = await resizedataURL(
      canvas.toDataURL(),
      resizeBoundingBox({ maxWidth: 300, maxHeight: 200 })
    );
    const matches = dataURL.match(/^data:(.*?);base64,(.*)/);
    this.props.onChange({
      data: matches![2],
      mimeType: matches![1]
    });
    this.setState({ fileDataUrl: null });
  };

  render() {
    return (
      <Horizontal>
        {this.props.showLabel !== false && (
          <div style={{ minWidth: "150px" }}>
            {(this.props.settings && this.props.settings.label) ||
              this.props.label}
          </div>
        )}
        <Dropzone
          style={{
            height: "200px",
            minWidth: "300px",
            border: "1px dashed black",
            overflow: "hidden"
          }}
          onDrop={this.onDrop}
          accept="image/*"
        >
          <p>Drop image or click to select file.</p>
          {this.props.value && (
            <img
              src={`data:${this.props.value.mimeType};base64,${
                this.props.value.data
              }`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                border: "1px dashed red"
              }}
            />
          )}
        </Dropzone>
        {(this.state as any).fileDataUrl && (
          <div>
            <ImageModal id="imageModal" open={true} basic={true}>
              <Cropper
                src={(this.state as any).fileDataUrl}
                style={{ height: "50%", minHeight: "400px", width: "90%" }}
                ref={(ref: any) => (this._cropper = ref)}
                onChange={console.log}
              />
              <Buttons>
                <Button
                  basic={true}
                  color="red"
                  inverted={true}
                  onClick={this.onCancel}
                >
                  <Icon name="remove" /> Cancel
                </Button>
                <Button color="green" inverted={true} onClick={this.onCrop}>
                  <Icon name="checkmark" /> OK
                </Button>
              </Buttons>
            </ImageModal>
          </div>
        )}
      </Horizontal>
    );
  }
}

const ImageModal = styled(Modal)`
  &#imageModal {
    width: 100%;
    height: 100%;
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 0 !important;
  }
` as StyledComponentClass<ModalProps, {}>;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 2em;
  & > .ui.button {
    margin-left: 1em;
    margin-right: 1em;
  }
`;

const Horizontal = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`;
