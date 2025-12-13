import App from './App';
import './index.css';
import {AppRegistry} from 'react-native';

AppRegistry.registerComponent('linkap', () => App);
AppRegistry.runApplication('linkap', {
  rootTag: document.getElementById('root'),
});
