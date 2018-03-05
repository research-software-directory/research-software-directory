import * as React from 'react';
import { Provider } from 'react-redux';
import { storeMock } from './testHelpers';
import { BrowserRouter } from 'react-router-dom';
import { mount, configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { ResourceFormContainer } from '../containers/form/ResourceFormContainer';

describe('<ResourceFormContainer />', () => {
  it('renders without crashing', () => {
    mount(
      <Provider store={storeMock()}>
        <BrowserRouter>
          <ResourceFormContainer
            resourceType="software"
            id="/software/3d-e-chem-vm"
          />
        </BrowserRouter>
      </Provider>
    );
  });
});
