import React, { useMemo } from 'react';
import { createEditor, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

interface SlateTextEditorProps {
  value: Node[];
  setValue: (value: Node[]) => void;
}

export const SlateTextEditor: React.SFC<SlateTextEditorProps> = ({
  value,
  setValue,
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable placeholder="Enter some plain text..." />
    </Slate>
  );
};
