import { useEffect, useRef, useState } from 'react';

type FieldType = 'text' | 'number' | 'date' | 'select';

export function EditableCell({
  value,
  type,
  options,
  editable,
  displayValue,
  displayNode,
  onSave,
}: {
  value: string | number;
  type: FieldType;
  options?: { value: string; label: string }[];
  editable: boolean;
  displayValue?: string;
  displayNode?: React.ReactNode;
  onSave: (value: string | number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (inputRef.current instanceof HTMLInputElement) inputRef.current.select();
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  if (!editable) {
    return <span>{displayNode ?? displayValue ?? value}</span>;
  }

  const openEditor = () => {
    setDraft(value);
    setOpen(true);
  };

  const save = () => {
    onSave(type === 'number' ? Number(draft) : draft);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className="editable-cell" ref={wrapRef}>
      <button className="cell-trigger" onClick={openEditor}>
        {displayNode ?? displayValue ?? value}
      </button>
      {open && (
        <div className="cell-popover">
          {type === 'select' ? (
            <select
              ref={inputRef as React.RefObject<HTMLSelectElement>}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
            >
              {options?.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
            />
          )}
          <div className="cell-popover-actions">
            <button className="btn-save" onClick={save}>Сохранить</button>
            <button className="btn-cancel" onClick={() => setOpen(false)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
}
