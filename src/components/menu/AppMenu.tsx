import * as React from 'react';
import { connect } from 'react-redux';

import { Button, Icon, Image, Loader, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { resourceTypes } from '../../settings';
import { saveChanges } from './actions';
import { ResourceTypeMenu } from './ResourceTypeMenu';
import { UploadStatus } from './UploadStatus';

import './AppMenu.css';
import 'semantic-ui-css/semantic.min.css';

const resourceTypesMenu = [ ...resourceTypes, 'publication' ];

const mapStateToProps = (state: any) => ({
  numAsyncs: state.async.filter((asyncAction: any) => asyncAction.status !== 'DONE').length,
  schema:  state.schema,
  user:    state.auth.user,
  dataDirty: state.current.data !== state.data
});

const dispatchToProps = {
  saveChanges
};

const connector = connect(mapStateToProps, dispatchToProps, null, { pure: false} );

interface IProps {
  dataDirty: boolean;
  numAsyncs: number;
  schema: any;
  user: any;
  saveChanges: any;
}
class AppMenuComponent extends React.PureComponent<IProps, {}> {
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
            disabled={!this.props.dataDirty}
            onClick={this.save}
          >
            Save
          </Button>
        </Menu.Item>
        <Menu.Item>
          <UploadStatus />
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
