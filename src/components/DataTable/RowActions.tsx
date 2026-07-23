type Props = {
  editing: boolean;
  canUndo: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUndo: () => void;
};

export function RowActions({
  editing,
  canUndo,
  onEdit,
  onSave,
  onCancel,
  onUndo,
}: Props) {
  return (
    <div className="row-actions">
      {editing ? (
        <>
          <button className="primary" onClick={onSave}>
            Save
          </button>
          <button onClick={onCancel}>Cancel</button>
        </>
      ) : (
        <>
          <button onClick={onEdit}>Edit</button>
          <button disabled={!canUndo} onClick={onUndo}>
            Undo
          </button>
        </>
      )}
    </div>
  );
}
