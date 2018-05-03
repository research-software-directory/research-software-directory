import * as React from "react";
import { ISchema } from "../../interfaces/json-schema";
import { IResource } from "../../interfaces/resource";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import resourceToString from "../../custom/resourceToString";
import { ISettingResource } from "../../rootReducer";

export interface IOwnProps {
  search: string;
  type: string;
}

interface IProps {
  data: IResource[];
  schema: ISchema;
  location: Location;
  settings: ISettingResource;
}

const label = (item: any, template: string): string =>
  resourceToString(item, template);
const sortByLabel = (template: string) => (a: any, b: any) =>
  label(a, template).localeCompare(label(b, template));

export default class ResourceList extends React.PureComponent<
  IProps & IOwnProps,
  {}
> {
  searchFilter = (search: string) => (item: IResource) => {
    const lowerCase = search.toLowerCase();

    return (
      label(item, this.template)
        .toLowerCase()
        .indexOf(lowerCase) !== -1 ||
      ("description" in item &&
        (item as any).description.toLowerCase().indexOf(lowerCase) !== -1)
    );
  };

  get template() {
    return this.props.settings.itemLabelTemplate;
  }

  render() {
    return (
      <div>
        {this.props.data
          .filter(this.searchFilter(this.props.search))
          .sort(sortByLabel(this.template))
          .map((item, index) => (
            <Menu.Item key={index} draggable="true">
              <Link
                draggable={false}
                to={`/${this.props.type}/${item.primaryKey.id}`}
                style={{ display: "block" }}
              >
                {resourceToString(item, this.template)}
              </Link>
            </Menu.Item>
          ))}
      </div>
    );
  }
}

/*
<MenuItem
            key={item.id}
            item={item}
            label={label(this.props.type)(item)}
            type={this.props.type}
            active={this.props.location.pathname === item.id}
            hasChanged={hasChanged}
            onUndo={this.undoChanges(item.id)}
          />
 */
