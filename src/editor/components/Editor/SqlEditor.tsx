import React, { useRef, useEffect } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { useTheme } from "../../hooks/useTheme";

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRunQuery: () => void;
}

export function SqlEditor({ value, onChange, onRunQuery }: SqlEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onRunQuery();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [onRunQuery]);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Add custom keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunQuery();
    });
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800">
      <Editor
        height="100%"
        language="sql"
        theme={theme === "dark" ? "vs-dark" : "vs"}
        value={value}
        onChange={(value) => onChange(value || "")}
        // onMount={handleEditorDidMount}
        onMount={(editor, monaco) => handleEditorDidMount(editor, monaco)}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
          lineNumbers: "on",
          rulers: [80, 120],
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "blink",
          cursorSmoothCaretAnimation: true,
          contextmenu: true,
          selectOnLineNumbers: true,
          lineHeight: 22,
          padding: { top: 16, bottom: 16 },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          snippetSuggestions: "top",
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
        }}
      />
    </div>
  );
}
