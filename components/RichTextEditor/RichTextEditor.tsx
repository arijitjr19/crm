import assets from "@/json/assets";
import styled from "@emotion/styled";
import { Stack } from "@mui/system";
import {
  BubbleMenu,
  EditorProvider,
  FloatingMenu,
  useCurrentEditor
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import Underline from "@tiptap/extension-underline";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

// define your extension array
const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  //   TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    }
  }),
  Underline
];

const StyledButton = styled.button`
  padding: 10px 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: none;
  border-radius: 4px;
  cursor: pointer;
  &.is-active {
    border-color: #008d8d;
    background: #008d8d;
    img {
      filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%)
        hue-rotate(290deg) brightness(102%) contrast(101%);
    }
  }
`;

const Toolbar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="center" gap={0.2}>
      <StyledButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <Image src={assets.bold_icon} alt="Bold" width={20} height={20} />
      </StyledButton>
      <StyledButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <Image src={assets.italic_icon} alt="Italic" width={20} height={20} />
      </StyledButton>
      <StyledButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        <Image
          src={assets.underline_icon}
          alt="Underline"
          width={20}
          height={20}
        />
      </StyledButton>
      <StyledButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        <Image src={assets.h1_icon} alt="H1" width={20} height={20} />
      </StyledButton>
      <StyledButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        <Image src={assets.h2_icon} alt="H2" width={20} height={20} />
      </StyledButton>
      <StyledButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        <Image src={assets.h3_icon} alt="H3" width={20} height={20} />
      </StyledButton>
      <StyledButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <Image
          src={assets.list_unordered_icon}
          alt="List unordered"
          width={20}
          height={20}
        />
      </StyledButton>
      <StyledButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Image src={assets.undo_icon} alt="Undo" width={20} height={20} />
      </StyledButton>
    </Stack>
  );
};


const EditorWrapper = styled("div")`
  padding: 4px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: #fff;
  min-height: 250px;
  font-family: "Inter", "Roboto", sans-serif;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #00a0a0;
    box-shadow: 0 0 0 2px rgba(0, 160, 160, 0.2);
  }

  .ProseMirror {
    padding: 16px;
    min-height: 220px;
    outline: none;
    font-size: 15px;
    line-height: 1.7;
    color: #333;

    /* Paragraphs */
    p {
      margin: 0 0 12px;
    }

    /* Headings */
    h1, h2, h3 {
      font-weight: 600;
      margin: 1em 0 0.4em;
      line-height: 1.3;
    }

    h1 { font-size: 1.8rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }

    /* Lists */
    ul, ol {
      padding-left: 1.5rem;
      margin: 0.5rem 0;
    }

    li {
      margin: 4px 0;
    }

    /* Bold, Italic, Underline */
    strong { color: #111; font-weight: 600; }
    em { color: #555; font-style: italic; }
    u { text-decoration: underline; }

    /* Blockquotes */
    blockquote {
      border-left: 3px solid #00a0a0;
      padding-left: 10px;
      color: #666;
      font-style: italic;
      margin: 10px 0;
    }

    /* Code blocks */
    pre {
      background: #f6f8fa;
      color: #333;
      padding: 10px;
      border-radius: 6px;
      font-family: "Fira Code", monospace;
      font-size: 0.9rem;
      overflow-x: auto;
    }

    code {
      background: #f2f2f2;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 0.9rem;
      color: #d63384;
    }

    /* Links */
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  }
`;

const RichTextEditor = ({
  value = "",
  onChange
}: {
  value?: string;
  onChange: (value: string) => void;
}) => {
  const content = value;
  return (
    <EditorWrapper>

      <EditorProvider
        extensions={extensions}
        content={content}
        slotBefore={<Toolbar />}
        onUpdate={({ editor }) => {
          onChange(editor.getHTML().toString());
        }}
      ></EditorProvider>
    </EditorWrapper>
  );
};

export default RichTextEditor;
