import * as React from 'react';
import { connect } from 'react-redux';
import { resourceTypes } from '../../settings';
import { saveChanges } from './actions';

import { Button, Icon, Image, Loader, Menu, Progress } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { ResourceTypeMenu } from './ResourceTypeMenu';

import './AppMenu.css';
import 'semantic-ui-css/semantic.min.css';

const resourceTypesMenu = [ ...resourceTypes, 'publication' ];

const mapStateToProps: (state: any, ownProps: {routeParams: any}) => any = (state: any) => ({
  data:    state.current.data,
  numAsyncs: state.async.filter((asyncAction: any) => asyncAction.status !== 'DONE').length,
  oldData: state.data,
  schema:  state.schema,
  uploads: state.async.filter((asyncAction: any) =>
    asyncAction.type === 'UPLOAD_IMAGE' && asyncAction.progress < 100),
  user:    state.auth.user
});

const dispatchToProps = {
  saveChanges: () => saveChanges
};

const connector = connect(mapStateToProps, dispatchToProps );

interface IProps {
  data: any;
  numAsyncs: number;
  uploads: any[];
  oldData: any;
  schema: any;
  user: any;
  routeParams: any;
  saveChanges(): void;
}
class AppMenuComponent extends React.Component<IProps, {}> {
  save = () => {
    this.props.saveChanges();
  }

  avatarClick = () => {
    // tslint:disable-next-line
    new Function('z=function(n,t,e){void 0===e&&(e=1),e>1&&t(n,e);for(var r=0;r<n.children.length;r++)z(n.children[r],t,e+1)},z(document.body,function(n,t){!function(n){var t=1;setInterval(function(){t+=1,n.style.transform="rotateZ("+t+"deg)"},10)}(n)})')();
  }

  render() {
    const resourceMenus = resourceTypesMenu.map((type: string) => (
      <ResourceTypeMenu
        key={type}
        type={type}
        routeParams={this.props.routeParams}
      />
    ));

    return (
      <Menu
        id="main_menu"
        vertical={true}
        inverted={true}
        className="main_menu"
      >
        <Menu.Item>
          <Image onClick={this.avatarClick} avatar={true} src={this.props.user.avatar_url} />&nbsp;
          {this.props.user.name}
          <Loader inline={true} active={this.props.numAsyncs > 0} />
          <Button
            floated="right"
            inverted={true}
            color="red"
            size="tiny"
            disabled={this.props.data === this.props.oldData}
            onClick={this.save}
          >
            Save
          </Button>
        </Menu.Item>
        <Menu.Item>
          <UploadStatus progress={this.props.uploads.length > 0 && this.props.uploads[0].progress || 0} />
        </Menu.Item>
        <Menu.Item name="home" as={Link} to="/" >
          <Icon name="home" />
          Home
        </Menu.Item>
        {resourceMenus}
        <Menu.Item name="image" as={Link} to="/images">
          <Icon name="image" />
          Images
        </Menu.Item>
      </Menu>
    );
  }
}

export const AppMenu = connector(AppMenuComponent);

const UploadStatus = (props: any) => props.progress === 0 ? null : (
  <Progress
    percent={props.progress}
    indicating={true}
    size="small"
    style={{margin: 0, padding: 0}}
    progress={true}
    inverted={true}
  />
);
