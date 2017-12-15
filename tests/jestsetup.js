import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'raf/polyfill';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
