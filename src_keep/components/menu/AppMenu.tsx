import * as React from 'react';

import { Button, Icon, Image, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { IUser } from '../../containers/auth/reducer';
import { ResourceTypeMenu } from './ResourceTypeMenu';
import { UploadStatus } from '../../containers/menu/UploadStatus';

import './AppMenu.css';

const resourceTypesMenu = ['software', 'person', 'organization'];

interface IProps {
  dataDirty: boolean;
  numAsyncs: number;
  user: IUser;
  push(url: string): any;
  saveChanges(): any;
}

export class AppMenu extends React.PureComponent<IProps, {}> {
  save = () => {
    this.props.saveChanges();
  }

  avatarClick = () => {
    // tslint:disable-next-line
    new Function('z=function(n,t,e){void 0===e&&(e=1),e>1&&t(n,e);for(var r=0;r<n.children.length;r++)z(n.children[r],t,e+1)},z(document.body,function(n,t){!function(n){var t=1;setInterval(function(){t+=1,n.style.transformPublication="rotateZ("+t+"deg)"},10)}(n)})')();
  }

  zoteroSyncClick = () => {
    this.props.push('/zotero_import');
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
          <Button
            disabled={true}
            floated="right"
            inverted={true}
            color="orange"
            size="tiny"
            onClick={this.zoteroSyncClick}
          >
            Zotero import
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
        {/*<Menu.Item name="image" as={Link} to="/images">*/}
          {/*<Icon name="image" />*/}
          {/*Images*/}
        {/*</Menu.Item>*/}
      </Menu>
    );
  }
}
