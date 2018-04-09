import * as React from "react";
import { ISchema } from "../../interfaces/json-schema";
import { IResource } from "../../interfaces/resource";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

export interface IOwnProps {
  search: string;
  type: string;
}

interface IProps {
  data: IResource[];
  schema: ISchema;
  location: Location;
}

const label = (item: any): string => JSON.stringify(item).substr(0, 10);
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
    console.log(this.props);
    return (
      <div>
        {this.props.data
          .filter(this.searchFilter(this.props.search))
          .sort(sortByLabel)
          .map((item, index) => (
            <Menu.Item key={index} draggable="true">
              {item.primaryKey ? (
                <Link
                  draggable={false}
                  to={`/${this.props.type}/${item.primaryKey.id}`}
                  style={{ display: "block" }}
                >
                  {item.primaryKey.id}
                </Link>
              ) : (
                <div>no PrimaryKey</div>
              )}
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
