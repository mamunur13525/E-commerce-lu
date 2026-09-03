import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  LexicalComposer,
  type InitialConfigType,
} from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  EditorState,
  LexicalEditor,
} from 'lexical';
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { ListNode, ListItemNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type,
} from 'lucide-react';
import { Button } from '../ui/button';

interface LexicalRichTextEditorProps {
  value: string;
  onChange: (htmlOrText: string) => void;
  placeholder?: string;
  className?: string;
}

const editorTheme = {
  paragraph: 'mb-2 text-xs leading-relaxed text-slate-700',
  heading: {
    h2: 'text-sm font-bold text-slate-900 mb-2 mt-3',
    h3: 'text-xs font-bold text-slate-900 mb-1.5 mt-2 uppercase tracking-wide',
  },
  list: {
    ul: 'list-disc pl-5 mb-2 space-y-1 text-xs text-slate-700',
    ol: 'list-decimal pl-5 mb-2 space-y-1 text-xs text-slate-700',
    listitem: 'text-xs text-slate-700',
  },
  quote: 'border-l-2 border-slate-300 pl-3 italic my-2 text-slate-600 text-xs bg-slate-50/70 py-1 rounded-r',
  text: {
    bold: 'font-bold text-slate-950',
    italic: 'italic',
    underline: 'underline underline-offset-2',
    strikethrough: 'line-through',
    code: 'font-mono bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-[11px]',
  },
};

// Toolbar Component inside the Lexical Context
const Toolbar: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState<string>('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        const type = element.getType();
        if (type === 'heading') {
          const tag = (element as HeadingNode).getTag();
          setBlockType(tag);
        } else if (type === 'list') {
          const tag = (element as ListNode).getListType();
          setBlockType(tag === 'bullet' ? 'ul' : 'ol');
        } else if (type === 'quote') {
          setBlockType('quote');
        } else {
          setBlockType('paragraph');
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
      setBlockType('paragraph');
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
      setBlockType(headingSize);
    } else {
      formatParagraph();
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      setBlockType('ul');
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType('paragraph');
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      setBlockType('ol');
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType('paragraph');
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
      setBlockType('quote');
    } else {
      formatParagraph();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100/90 border-b border-slate-200 text-slate-700 select-none">
      {/* Undo & Redo */}
      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-300/80">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          className="w-7 h-7 rounded hover:bg-slate-200"
          title="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          className="w-7 h-7 rounded hover:bg-slate-200"
          title="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Block Formats */}
      <div className="flex items-center gap-0.5 px-1 border-r border-slate-300/80">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={formatParagraph}
          className={`w-7 h-7 rounded text-xs font-bold ${
            blockType === 'paragraph' ? 'bg-white shadow-xs text-slate-950 font-black' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Normal Paragraph"
        >
          <Type className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => formatHeading('h2')}
          className={`w-7 h-7 rounded ${
            blockType === 'h2' ? 'bg-white shadow-xs text-slate-950 font-bold' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => formatHeading('h3')}
          className={`w-7 h-7 rounded ${
            blockType === 'h3' ? 'bg-white shadow-xs text-slate-950 font-bold' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={formatBulletList}
          className={`w-7 h-7 rounded ${
            blockType === 'ul' ? 'bg-white shadow-xs text-slate-950' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={formatNumberedList}
          className={`w-7 h-7 rounded ${
            blockType === 'ol' ? 'bg-white shadow-xs text-slate-950' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={formatQuote}
          className={`w-7 h-7 rounded ${
            blockType === 'quote' ? 'bg-white shadow-xs text-slate-950' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Quote Block"
        >
          <Quote className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Inline Formatting */}
      <div className="flex items-center gap-0.5 px-1 border-r border-slate-300/80">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          className={`w-7 h-7 rounded ${
            isBold ? 'bg-white shadow-xs text-slate-950 font-bold' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          className={`w-7 h-7 rounded ${
            isItalic ? 'bg-white shadow-xs text-slate-950' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
          className={`w-7 h-7 rounded ${
            isUnderline ? 'bg-white shadow-xs text-slate-950' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
          className={`w-7 h-7 rounded ${
            isStrikethrough ? 'bg-white shadow-xs text-slate-950' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          className={`w-7 h-7 rounded ${
            isCode ? 'bg-white shadow-xs text-slate-950' : 'hover:bg-slate-200 text-slate-600'
          }`}
          title="Inline Code"
        >
          <Code className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 pl-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
          className="w-7 h-7 rounded hover:bg-slate-200 text-slate-600"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
          className="w-7 h-7 rounded hover:bg-slate-200 text-slate-600"
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
          className="w-7 h-7 rounded hover:bg-slate-200 text-slate-600"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

// Initial Content Synchronizer Plugin
const InitialContentPlugin: React.FC<{ initialValue: string }> = ({ initialValue }) => {
  const [editor] = useLexicalComposerContext();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    if (!initialValue || !initialValue.trim()) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      const trimmed = initialValue.trim();
      const hasHtmlTags = /<[a-z][\s\S]*>/i.test(trimmed);

      if (hasHtmlTags) {
        try {
          const parser = new DOMParser();
          const dom = parser.parseFromString(trimmed, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          root.append(...nodes);
        } catch {
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(trimmed));
          root.append(paragraph);
        }
      } else {
        // Plain text paragraphs
        const paragraphs = trimmed.split(/\n\n+/);
        paragraphs.forEach(pText => {
          const paragraph = $createParagraphNode();
          const lines = pText.split('\n');
          lines.forEach((line, index) => {
            if (index > 0) {
              paragraph.append($createTextNode('\n'));
            }
            paragraph.append($createTextNode(line));
          });
          root.append(paragraph);
        });
      }
    });
  }, [editor, initialValue]);

  return null;
};

export const LexicalRichTextEditor: React.FC<LexicalRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write craftsmanship story, fabric details, care guidelines...',
  className = '',
}) => {
  const lastEmittedValueRef = useRef<string>(value);

  const initialConfig: InitialConfigType = {
    namespace: 'LuminaProductDescriptionEditor',
    theme: editorTheme,
    onError(error) {
      console.error('Lexical error:', error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  };

  const handleEditorChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      lastEmittedValueRef.current = htmlString;
      onChange(htmlString);
    });
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs focus-within:border-slate-400 transition-colors ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <div className="relative min-h-[140px] p-3 text-xs">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="outline-none min-h-[130px] prose prose-slate max-w-none focus:outline-none"
              />
            }
            placeholder={
              <div className="pointer-events-none absolute top-3 left-3 text-slate-400 text-xs italic select-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <InitialContentPlugin initialValue={value} />
          <OnChangePlugin onChange={handleEditorChange} />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default LexicalRichTextEditor;
