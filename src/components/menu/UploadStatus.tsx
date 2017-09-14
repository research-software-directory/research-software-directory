import * as React from 'react';
import {Progress} from 'semantic-ui-react';
import {connect} from 'react-redux';

interface IUploadStatusProps {
  progress: number;
}

const uploadStatusStateToProps = (state: any) => {
  const uploads = state.async.filter((asyncAction: any) =>
    asyncAction.type === 'UPLOAD_IMAGE' && asyncAction.progress < 100);

  return {
    progress: uploads.length > 0 && uploads[0].progress || 0
  };
};

export const UploadStatus = connect(uploadStatusStateToProps)((props: IUploadStatusProps) => (
  <Progress
    percent={props.progress}
    indicating={true}
    size="small"
    style={{margin: 0, padding: 0}}
    progress={true}
    inverted={true}
  />
));
