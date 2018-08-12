import Component, { tracked } from "@glimmer/component";

export default class ActionBar extends Component {
  didInsertElement() {
    if(this.args.page) {
      this.args.page.actionBar = this;
    }
  }
}
