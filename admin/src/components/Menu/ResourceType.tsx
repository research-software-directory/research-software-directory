import * as React from "react";
import { Divider, Icon, Input, Menu } from "semantic-ui-react";
import AnimateHeight from "react-animate-height";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs";
import { Link } from "react-router-dom";

import ResourceList from "../../containers/Menu/ResourceList";

interface IState {
  open: boolean;
  search: string;
}

interface IProps {
  defaultOpen: boolean;
  type: string;
  icon: SemanticICONS;
  readonly?: boolean;
}

export default class ResourceType extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { open: props.defaultOpen, search: "" };
  }

  onSubmenuSearch = (e: any) => {
    this.setState({ search: e.target.value });
  };

  toggleMenu = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    return (
      <Menu.Item
        key={this.props.type}
        className={"resource_menu " + this.state.open ? "active" : ""}
      >
        <Menu.Header
          style={{ cursor: "pointer", textTransform: "capitalize" }}
          onClick={this.toggleMenu}
        >
          <Icon name={this.props.icon} inverted={true} />
          &nbsp;
          {this.props.type}
          <Icon
            name={this.state.open ? "chevron down" : "chevron up"}
            style={{ float: "right" }}
          />
        </Menu.Header>
        <AnimateHeight duration={1000} height={this.state.open ? "auto" : 0}>
          <Menu className="submenu" inverted={true} vertical={true}>
            {!this.props.readonly && (
              <Link to={`/${this.props.type}`} title="Add">
                <Icon name="add" />
              </Link>
            )}
            <Input
              className="submenu-search inverted"
              icon={<Icon name="search" inverted={true} />}
              value={this.state.search}
              onChange={this.onSubmenuSearch}
            />
            <Divider />
            <ResourceList type={this.props.type} search={this.state.search} />
          </Menu>
        </AnimateHeight>
      </Menu.Item>
    );
  }
}
