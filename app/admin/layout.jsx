// Route segment config to prevent static generation of admin pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminLayout({ children }) {
  return children;
}

