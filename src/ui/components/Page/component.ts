import Component, { tracked } from "@glimmer/component";

export default class Page extends Component {
  set actionBar(component) {
    if (component && component.element.nativeView && this.element.nativeView) {
      this.element.nativeView.actionBar = component.element.nativeView;
    }
  }
}
