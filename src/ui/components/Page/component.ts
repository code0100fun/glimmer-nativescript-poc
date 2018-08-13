import Component, { tracked } from "@glimmer/component";
import ElementNode from '../../../utils/element-node';
import { Page as TNSPage } from 'tns-core-modules/ui/page';
import { View } from 'tns-core-modules/ui/core/view';
import { ActionBar } from 'tns-core-modules/ui/action-bar';

export default class Page extends Component {
  get page() {
    return this.extractView(this) as TNSPage;
  }

  set actionBar(component: Component) {
    const componentView = this.extractView(component) as ActionBar;
    if (componentView && this.page) {
      this.page.actionBar = componentView;
    }
  }

  extractView(component: Component): View {
    return (component.element as any as ElementNode).nativeView;
  }

}
