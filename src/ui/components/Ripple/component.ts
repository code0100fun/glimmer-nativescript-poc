import Component from '@glimmer/component';
import { registerElement } from '../../../utils/element-registry';

export default class Ripple extends Component {

}

registerElement('native_ripple', () => require('nativescript-ripple').Ripple);
