export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg text-foreground/60 mb-6">Project not found</p>
      <a
        href="/#projects"
        className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Back to home
      </a>
    </div>
  );
}
