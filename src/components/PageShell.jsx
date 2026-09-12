/**
 * PageShell — keeps children mounted in the DOM but hides them when inactive.
 *
 * - `display: contents` when active  → wrapper is invisible to layout
 * - `display: none`     when inactive → hidden but still in the React tree
 */
function PageShell({ active, children }) {
  return (
    <div
      className="page-shell"
      style={{ display: active ? "contents" : "none" }}
    >
      {children}
    </div>
  );
}

export default PageShell;
