export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span className="material-icons text-neutral-light text-5xl mb-2">toc</span>
      <h2 className="text-lg font-medium text-neutral-medium mb-1">No headings found</h2>
      <p className="text-sm text-neutral-medium">This page doesn't have any H1-H4 heading elements to create an outline.</p>
    </div>
  );
}
