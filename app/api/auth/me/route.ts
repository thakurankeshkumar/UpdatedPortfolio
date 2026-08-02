import { getSession } from '@/lib/auth';
import { noStoreJson } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = getSession();
  if (!session) return noStoreJson({ authenticated: false }, { status: 401 });
  return noStoreJson({ authenticated: true, ...session });
}
