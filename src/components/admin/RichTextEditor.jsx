import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

function ToolbarButton({ onClick, active, children, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`rounded px-2 py-1 text-sm font-semibold ${
        active ? 'bg-brand-blue text-white' : 'text-brand-ink/70 hover:bg-brand-ink/10'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose-content px-4 py-3',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML() && document.activeElement?.closest('.ProseMirror') === null) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-brand-ink/15 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-brand-ink/10 p-2">
        <ToolbarButton
          label="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &ldquo;&rdquo;
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
