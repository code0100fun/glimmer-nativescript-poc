// import CommentNode from './CommentNode';
import ElementNode from './element-node';
import ElementBaseNode from './element-base-node';
import TextNode from './text-node';
import CommentNode from './comment-node';
import { Simple } from '@glimmer/interfaces';

export default class DocumentNode extends ElementBaseNode implements Simple.Document {

  nodeType: Simple.NodeType.Document;
  public readonly documentElement: Simple.Element;
  public readonly tagName: string | null

  constructor() {
    super(null, 'Document');
    this.documentElement = this.createElement('#document');
  }

  createComment(text: string): Simple.Comment {
    return new CommentNode(this as Simple.Document, text);
  }

  createElement(tagName: string): Simple.Element {
    return new ElementNode(this as Simple.Document, tagName);
  }

  createElementNS(namespace: Simple.Namespace, tagName: string): Simple.Element {
    // TODO: handle namespaces
    return new ElementNode(this as Simple.Document, tagName);
  }

  createTextNode(text: string): Simple.Text {
    return new TextNode(this as Simple.Document, text);
  }
}
