/**
 * merges non-empty values of `b` that are not in `a` with `a`
 *
 * @param {string[]} a enum1
 * @param {(string[] | null)} b
 * @returns merge of a and b
 */
const mergeEnums = (a: string[], b: string[] | null) => {
  return a.concat(b && b.filter(
    (lang: string) => lang !== '' && a.indexOf(lang) === -1
  ) || []);
};



        
        // <Dropdown text={props.resourceType} icon="filter" floating={true} labeled={true} button={true} className="icon">
        //     <Dropdown.Menu >
        //       <Input
        //         value={this.state.search}
        //         icon="search"
        //         iconPosition="left"
        //         className="search"
        //         onChange={this.onSearchChange}
        //         onClick={stopPropagation}
        //       />
        //       <Dropdown.Divider />
        //       <Dropdown.Header icon="tags" content="Tag Label" />
        //       <Dropdown.Menu scrolling={true}>
        //         {props.resources.map((option) => <Dropdown.Item
        //           key={option.id} value={option.id}
        //           label={option.name} />)}
        //       </Dropdown.Menu>
        //     </Dropdown.Menu>
        //   </Dropdown>
