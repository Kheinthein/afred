import { redirect } from 'next/navigation';

export default function LegacyDocumentsRedirect(): never {
  redirect('/documents');
}

