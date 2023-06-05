import DiscList from './_components/DiscList';
import { fetchLatestUpdatedDiscs } from './api.server';

export default async function Home() {
  const latestDiscs = await fetchLatestUpdatedDiscs();

  return (
    <main>
      <div className='mx-auto max-w-7xl'>
        <DiscList discs={latestDiscs} />
      </div>
    </main>
  );
}
