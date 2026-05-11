import { WeddingNav } from '@/components/navigation/WeddingNav';
import { WeddingFooter } from '@/components/navigation/WeddingFooter';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <WeddingNav />
      <main className="flex-1">{children}</main>
      <WeddingFooter />
    </div>
  );
}
