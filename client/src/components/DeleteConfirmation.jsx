export const DeleteConfirmation = ({ handleDelete, book }) => {
  return (
    <dialog id={`delete-dialog-${book.id}`}>
      <p>
        Are you sure you want to delete <strong>{book.title}</strong>?
      </p>
      <button commandfor={`delete-dialog-${book.id}`} command="close">
        Cancel
      </button>
      <button commandfor={`delete-dialog-${book.id}`} onClick={handleDelete}>
        Delete
      </button>
    </dialog>
  );
};
