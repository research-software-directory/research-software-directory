import * as React from 'react';

import { Image, Menu } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';

import { IJWT, ISettings } from '../../rootReducer';
import { ISchema } from '../../interfaces/json-schema';
import { IData } from '../../interfaces/misc';

import '../../style/Menu.css';

interface IProps {
  jwt: IJWT;
  schema: { [key: string]: ISchema };
  data: IData;
  settings: ISettings;
  push(location: any): any;
}

export default class extends React.PureComponent<IProps, {}> {
  render() {
    const resourceMenus = Object.keys(this.props.settings.resources).map((type: string) => (
      <Menu.Item>{this.props.settings.resources[type].name}</Menu.Item>
    ));

    return (
      <Menu
        id="main_menu"
        vertical={true}
        inverted={true}
        className="main_menu"
      >
        <Menu.Item>
          <Image avatar={true} src={this.props.jwt.claims.user.image} />&nbsp;
          {this.props.jwt.claims.user.name}
        </Menu.Item>
        {resourceMenus}
      </Menu>
    );
  }
}
