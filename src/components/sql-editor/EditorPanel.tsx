import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Save, 
  Copy, 
  Download, 
  Maximize2, 
  Type,
  Zap,
  FileText,
  Settings
} from 'lucide-react';

interface EditorPanelProps {
  isDarkMode: boolean;
  onQueryRun: (query: string, limit: number) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ 
  isDarkMode, 
  onQueryRun 
}) => {
  const [query, setQuery] = useState(`-- Welcome to SQL Editor
-- Use Ctrl/Cmd + Enter to run queries

SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at,
    d.name as department_name
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
WHERE u.status = 'active'
ORDER BY u.created_at DESC
LIMIT 100;`);

  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Add keyboard shortcut for running queries
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunQuery();
    });

    // Configure SQL language features
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions = [
          {
            label: 'SELECT',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'SELECT ',
          },
          {
            label: 'FROM',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'FROM ',
          },
          {
            label: 'WHERE',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'WHERE ',
          },
          {
            label: 'users',
            kind: monaco.languages.CompletionItemKind.Table,
            insertText: 'users',
          },
          {
            label: 'orders',
            kind: monaco.languages.CompletionItemKind.Table,
            insertText: 'orders',
          },
        ];
        return { suggestions };
      },
    });
  };

  const handleRunQuery = () => {
    const selectedText = editorRef.current?.getModel()?.getValueInRange(
      editorRef.current?.getSelection()
    );
    const queryToRun = selectedText || query;
    onQueryRun(queryToRun, 1000);
  };

  const handleSaveQuery = () => {
    const blob = new Blob([query], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-${new Date().toISOString().slice(0, 19)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query);
  };

  const formatQuery = () => {
    // Simple SQL formatting - in a real app, you'd use a proper SQL formatter
    const formatted = query
      .replace(/\s+/g, ' ')
      .replace(/,/g, ',\n    ')
      .replace(/FROM/gi, '\nFROM')
      .replace(/WHERE/gi, '\nWHERE')
      .replace(/ORDER BY/gi, '\nORDER BY')
      .replace(/GROUP BY/gi, '\nGROUP BY')
      .replace(/HAVING/gi, '\nHAVING')
      .replace(/LIMIT/gi, '\nLIMIT');
    
    setQuery(formatted);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunQuery}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>Run</span>
          </button>
          
          <button
            onClick={formatQuery}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            <Zap className="w-3 h-3" />
            <span>Format</span>
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

          <button
            onClick={handleSaveQuery}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Save Query"
          >
            <Save className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyQuery}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Copy Query"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => {}}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Font Size Control */}
          <div className="flex items-center space-x-1">
            <Type className="w-4 h-4 text-gray-500" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs text-gray-900 dark:text-white"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>

          {/* Word Wrap Toggle */}
          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={`p-1.5 rounded transition-colors ${
              wordWrap 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            title="Toggle Word Wrap"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Editor Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={query}
          onChange={(value) => setQuery(value || '')}
          onMount={handleEditorDidMount}
          theme={isDarkMode ? 'vs-dark' : 'vs'}
          options={{
            fontSize,
            wordWrap: wordWrap ? 'on' : 'off',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            glyphMargin: true,
            folding: true,
            lineNumbers: 'on',
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderWhitespace: 'selection',
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'blink',
            cursorSmoothCaretAnimation: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: true,
            parameterHints: {
              enabled: true,
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>SQL</span>
          <span>UTF-8</span>
          <span>Line {editorRef.current?.getPosition()?.lineNumber || 1}</span>
          <span>Column {editorRef.current?.getPosition()?.column || 1}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Ctrl+Enter to run</span>
        </div>
      </div>
    </div>
  );
};