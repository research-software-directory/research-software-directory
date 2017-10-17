import * as React from 'react';
import { Provider } from 'react-redux';
import { storeMock } from '../../testHelpers';
import { BrowserRouter } from 'react-router-dom';
import { mount, configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { ResourceForm } from './ResourceForm';

describe('<ResourceForm />', () => {
  it('renders without crashing', () => {
    mount(
      <Provider store={storeMock()}>
        <BrowserRouter>
          <ResourceForm
            resourceType="software"
            id="/software/3d-e-chem-vm"
          />
        </BrowserRouter>
      </Provider>
    );
  });
});
