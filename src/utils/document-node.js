// import CommentNode from './CommentNode';
import ElementNode from './element-node';
import ViewNode from './view-node';
import TextNode from './text-node';
import CommentNode from './comment-node';

export default class DocumentNode extends ViewNode {
  constructor() {
    super();

    this.nodeType = 9;
    this.documentElement = new ElementNode('document');

    this.createComment = this.constructor.createComment;
    this.createElement = this.constructor.createElement;
    // this.createElementNS = this.constructor.createElementNS;
    this.createTextNode = this.constructor.createTextNode;
  }

  static createComment(text) {
    return new CommentNode(text);
  }

  static createElement(tagName) {
    return new ElementNode(tagName);
  }

  // static createElementNS(namespace, tagName) {
  //   return new ElementNode(namespace + ':' + tagName);
  // }

  static createTextNode(text) {
    return new TextNode(text);
  }
}
