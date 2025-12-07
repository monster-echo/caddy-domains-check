import { DomainManager } from "@/components/DomainManager";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-bold">Caddy Domain Manager</h1>
        <DomainManager />
      </main>
    </div>
  );
}
