import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardHome } from '@/components/admin/DashboardHome';

export const metadata: Metadata = {
  title: 'Dashboard — Admin',
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <DashboardHome />;
}
