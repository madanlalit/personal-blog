import { permanentRedirect } from 'next/navigation';

export default function ArchivePage() {
    permanentRedirect('/posts');
}
