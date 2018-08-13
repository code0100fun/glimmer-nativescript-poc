import Node from './node'
import { Simple } from '@glimmer/interfaces';

export default class TextNode extends Node implements Simple.Text {

  public text: string | null = null;

  nodeType: Simple.NodeType.Text;

  constructor(
    ownerDocument: Simple.Document,
    text: string) {

    super(ownerDocument, null);

    this.text = text;

    this._meta = {
      skipAddToDom: true
    };
  }

  setText(text: string) {
    this.text = text;
    // TODO: fix text nodes
    // this.parentNode.setText(text);
  }
}
