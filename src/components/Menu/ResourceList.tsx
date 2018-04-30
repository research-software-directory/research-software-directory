import * as React from "react";
import { ISchema } from "../../interfaces/json-schema";
import { IResource } from "../../interfaces/resource";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import resourceToString from "../../custom/resourceToString";
import { ISettings } from "../../rootReducer";

export interface IOwnProps {
  search: string;
  type: string;
}

interface IProps {
  data: IResource[];
  schema: ISchema;
  location: Location;
  settings: ISettings;
}

const label = (item: any): string => resourceToString(item);
const sortByLabel = (a: any, b: any) => label(a).localeCompare(label(b));

export default class ResourceList extends React.PureComponent<
  IProps & IOwnProps,
  {}
> {
  searchFilter = (search: string) => (item: IResource) => {
    const lowerCase = search.toLowerCase();

    return (
      label(item)
        .toLowerCase()
        .indexOf(lowerCase) !== -1 ||
      ("description" in item &&
        (item as any).description.toLowerCase().indexOf(lowerCase) !== -1)
    );
  };

  render() {
    return (
      <div>
        {this.props.data
          .filter(this.searchFilter(this.props.search))
          .sort(sortByLabel)
          .map((item, index) => (
            <Menu.Item key={index} draggable="true">
              <Link
                draggable={false}
                to={`/${this.props.type}/${item.primaryKey.id}`}
                style={{ display: "block" }}
              >
                {resourceToString(item)}
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
