import * as React from 'react';
import { Button, Input, Modal, Segment, TextArea } from 'semantic-ui-react';

import * as showdown from 'showdown';

import './markdown.css';

// tslint:disable-next-line:no-require-imports no-var-requires
const showdownEscape = require('showdown-htmlescape');

interface IProps {
  value: any;
  label: string;
  className?: string;
  onChange?(value: any): void;
}

interface IState {
  markdownContent: { __html: string };
}

export class MarkDownInput extends React.Component<IProps, IState> {
  converter = new showdown.Converter({extensions: [showdownEscape]});
  componentWillMount() {
    this.setState({markdownContent: {__html: ''}});
    this.converter.setFlavor('github');
  }
  onChange = (e: any) => this.props.onChange && this.props.onChange(e.target.value);
  showModal = () => {
    this.setState({markdownContent : {__html: this.converter.makeHtml(this.props.value) } } );
  }

  // tslint:disable:react-no-dangerous-html
  render() {
    return (
        <Segment>
          <p>{this.props.label}</p>
          <Input name="asd"/>
          <TextArea
            autoHeight={true}
            className={this.props.className || ''}
            value={this.props.value}
            onChange={this.onChange}
          />
          <Modal
            trigger={<Button onClick={this.showModal}>Preview</Button>}
            basic={true}
          >
            <Segment inverted={true}>
              <div className="markdown" dangerouslySetInnerHTML={this.state.markdownContent}/>
            </Segment>
          </Modal>
        </Segment>
  ); }
}
