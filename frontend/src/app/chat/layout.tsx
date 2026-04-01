'use client';

// Chat uses a position:fixed overlay — lock body scroll so the Footer
// (rendered by the root layout) can't be scrolled into view.
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`body { overflow: hidden; }`}</style>
      {children}
    </>
  );
}
