import DiscList from './_components/DiscList';
import { fetchLatestUpdatedDiscs } from './api.server';

export const revalidate = 60;

export default async function Home() {
  const latestDiscs = await fetchLatestUpdatedDiscs();

  return (
    <main>
      <DiscList discs={latestDiscs} />
    </main>
  );
}
