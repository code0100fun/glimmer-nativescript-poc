import { getViewMeta, ViewClassMeta } from './element-registry';
import { insertChild, removeChild } from './utils';
import { Simple } from '@glimmer/interfaces';
import { View } from 'tns-core-modules/ui/core/view';

export default class BaseNode {

  public parentNode: Simple.Node | null = null;
  public previousSibling: Simple.Node | null = null;
  public nextSibling: Simple.Node | null = null;
  public namespaceURI: string | null = null;
  public nodeValue: string | null = null;

  protected _meta: ViewClassMeta = null;
  protected _nativeView: View = null;

  private _childNodes: Simple.Node[] = [];

  constructor(
    public readonly ownerDocument: Simple.Document,
    public readonly tagName: string | null) {

    this._meta = null;

    // this.hasAttribute = this.removeAttribute = () => false;
  }

  get childNodes(): Simple.Node[] {
    return this._childNodes;
  }

  toString() {
    return `${this.constructor.name}(${this.tagName})`;
  }

  get firstChild(): Simple.Node {
    return this._childNodes.length ? this._childNodes[0] : null;
  }

  get lastChild(): Simple.Node {
    return this._childNodes.length
      ? this._childNodes[this._childNodes.length - 1]
      : null;
  }

  get nativeView() {
    return this._nativeView;
  }

  set nativeView(view) {
    if (this._nativeView) {
      throw new Error(`Can't override native view.`);
    }

    this._nativeView = view;
  }

  get meta() {
    if (this._meta) {
      return this._meta;
    }

    return (this._meta = getViewMeta(this.tagName));
  }

  get _node(): Simple.Node {
    // @ts-ignore
    return this as Simple.Node;
  }

  setStyle(property, value) {
    throw new Error(`setStyle not implemented`);
  }

  addEventListener(event, handler) {
    this.nativeView.on(event, handler);
  }

  removeEventListener(event) {
    this.nativeView.off(event);
  }

  insertBefore(childNode: Simple.Node, referenceNode: Simple.Node): Simple.Node {
    if (!childNode) {
      throw new Error(`Can't insert child: ${childNode}`);
    }

    if (referenceNode && referenceNode.parentNode !== this._node) {
      throw new Error(
        `Can't insert child, because the reference node has a different parent.`
      );
    }

    if (childNode.parentNode && childNode.parentNode !== this._node) {
      throw new Error(
        `Can't insert child, because it already has a different parent.`
      );
    }

    if (childNode.parentNode === this._node) {
      throw new Error(`Can't insert child, because it is already a child.`);
    }

    let index;
    if (referenceNode) {
      index = this.childNodes.indexOf(referenceNode);
      referenceNode.previousSibling = childNode;
    } else {
      index = this._childNodes.length;
      referenceNode = null;
    }

    childNode.parentNode = this._node;
    childNode.nextSibling = referenceNode;
    childNode.previousSibling = this._childNodes[index - 1];

    this._childNodes.splice(index, 0, childNode);

    insertChild(this, childNode, index);

    return childNode;
  }

  appendChild(childNode: Simple.Node): Simple.Node {
    if (!childNode) {
      throw new Error(`Can't append child: ${childNode}`);
    }

    if (childNode.parentNode && childNode.parentNode !== this._node) {
      throw new Error(
        `Can't append child, because it already has a different parent`
      );
    }

    if (childNode.parentNode === this._node) {
      throw new Error(`Can't append child, because it is already a child`);
    }

    childNode.parentNode = this._node

    if (this.lastChild) {
      childNode.previousSibling = this.lastChild;
      this.lastChild.nextSibling = childNode;
    }

    this._childNodes.push(childNode);

    insertChild(this, childNode, this._childNodes.length - 1);

    return childNode;
  }

  removeChild(childNode: Simple.Node): Simple.Node {
    if (!childNode) {
      throw new Error(`Can't remove child: ${childNode}`);
    }

    if (!childNode.parentNode) {
      throw new Error(`Can't remove child, because it has no parent.`);
    }

    if (childNode.parentNode !== this._node) {
      throw new Error(`Can't remove child, because it has a different parent.`);
    }

    childNode.parentNode = null;

    if (childNode.previousSibling) {
      childNode.previousSibling.nextSibling = childNode.nextSibling;
    }

    if (childNode.nextSibling) {
      childNode.nextSibling.previousSibling = childNode.previousSibling;
    }

    this._childNodes = this.childNodes.filter(node => node !== childNode);

    removeChild(this, childNode);

    return childNode;
  }
}
