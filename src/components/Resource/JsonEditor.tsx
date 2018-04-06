import AceEditor from "react-ace";
import * as React from "react";

import "brace/mode/json";
import "brace/theme/monokai";
import "../../style/jsonEditor.css";

interface IProps {
  onChange: (s: string) => any;
  value: string;
}

export default class extends React.Component<IProps> {
  ace: AceEditor | null = null;

  getValue() {
    return (this.ace as any).editor.getValue();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <AceEditor
        ref={ace => {
          this.ace = ace;
        }}
        onChange={this.props.onChange}
        mode="json"
        width="100%"
        height="100%"
        theme="monokai"
        name="test"
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        value={this.props.value}
        editorProps={{ $blockScrolling: Infinity }}
        setOptions={{
          wrap: true,
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2
        }}
      />
    );
  }
}
