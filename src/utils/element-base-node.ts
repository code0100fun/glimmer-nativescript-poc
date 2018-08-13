import { getViewClass } from './element-registry';
import BaseNode from './base-node';
import TextNode from './text-node';
import { Simple } from '@glimmer/interfaces';

export const GLIMMER_ELEMENT_REF = '__glimmer_element_ref__';

export default class ElementBaseNode extends BaseNode {

  public attributes: Simple.Attributes = [];

  constructor(
    ownerDocument: Simple.Document,
    tagName: string) {

    super(ownerDocument, tagName);

    const viewClass = getViewClass(tagName);
    this._nativeView = new viewClass();
    this._nativeView[GLIMMER_ELEMENT_REF] = this;
  }

  appendChild(childNode: Simple.Node): Simple.Node {
    super.appendChild(childNode);

    if (childNode.nodeType === Simple.NodeType.Text) {
      this.setText((childNode as TextNode).text);
    }

    return childNode;
  }

  insertBefore(childNode: Simple.Node, referenceNode: Simple.Node): Simple.Node {
    super.insertBefore(childNode, referenceNode);

    if (childNode.nodeType === Simple.NodeType.Text) {
      this.setText((childNode as TextNode).text);
    }

    return childNode;
  }

  removeChild(childNode) {
    super.removeChild(childNode);

    if (childNode.nodeType === Simple.NodeType.Text) {
      this.setText('');
    }

    return childNode;
  }

  setAttribute(name: string, value: string): void {
    if (typeof(value) === 'function') {
      this.addEventListener(name, value);
    } else {
      this.nativeView[name] = value;
    }
  }

  setAttributeNS(
    namespaceURI: Simple.Namespace | null,
    qualifiedName: string,
    value: string,
  ) {
    this.nativeView._applyXmlAttribute(qualifiedName, value);
  }

  removeAttribute(this: ElementBaseNode, name: string): void {
    this.removeEventListener(name);
    delete this.nativeView[name];
  }

  removeAttributeNS(
    namespaceURI: Simple.Namespace | null,
    qualifiedName: string) {
    throw new Error("Not implemented!")
  }

  setText(text) {
    if (text && text.trim() === '') {
      return;
    }
    if (this._node.nodeType === Simple.NodeType.Text) {
      // TODO: fix text nodes
      // this.parentNode.setText(text);
    } else {
      this.setAttribute('text', text);
    }
  }

}
