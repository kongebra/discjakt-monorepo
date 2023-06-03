import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <>
      <footer className='footer bg-base-200 text-base-content p-10'>
        <div className='lg:mx-auto lg:max-w-7xl'>
          <span className='footer-title'>Merker</span>
          <Link href='/brands/discmania' className='link link-hover'>
            Discmania
          </Link>
          <Link href='/brands/prodigy' className='link link-hover'>
            Discraft
          </Link>
          <Link href='/brands/innova' className='link link-hover'>
            Innova
          </Link>
          <Link href='/brands/latitude-64' className='link link-hover'>
            Latitude 64
          </Link>
        </div>
        <div>
          <span className='footer-title'>Disktyper</span>
          <Link href='/discs/types/putters' className='link link-hover'>
            Putters
          </Link>
          <Link href='/discs/types/midranges' className='link link-hover'>
            Midranges
          </Link>
          <Link href='/discs/types/fairway-drivers' className='link link-hover'>
            Fairway Drivers
          </Link>
          <Link href='/discs/types/distance-drivers' className='link link-hover'>
            Distance Drivers
          </Link>
        </div>
        <div>
          <span className='footer-title'>Legal</span>
          <Link href='/legal/privacy-policy' className='link link-hover'>
            Personvern
          </Link>
          <Link href='/legal/terms-of-service' className='link link-hover'>
            Brukervilkår
          </Link>
          <Link href='/legal/cookie-policy' className='link link-hover'>
            Informasjonskapsler
          </Link>
        </div>
      </footer>
      <footer className='bg-base-200 text-base-content border-base-300 border-t px-10 py-4'>
        <div className='footer lg:mx-auto lg:max-w-7xl'>
          <div className='grid-flow-col items-center'>
            <p>
              <strong>DiscJakt &copy; {copyrightYear(2022)}</strong>
            </p>
          </div>
          <div className='md:place-self-center md:justify-self-end'>
            <div className='grid grid-flow-col gap-4'>
              <Link
                href='https://facebook.com/discjakt'
                target='_blank'
                className='hover:text-facebook transition-colors'
              >
                <FaFacebook className='h-6 w-6' />
              </Link>
              <Link
                href='https://twitter.com/discjakt'
                target='_blank'
                className='hover:text-twitter transition-colors'
              >
                <FaTwitter className='h-6 w-6' />
              </Link>
              <Link
                href='https://instagram.com/discjakt'
                target='_blank'
                className='hover:text-instagram transition-colors'
              >
                <FaInstagram className='h-6 w-6' />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function copyrightYear(since: number = 2023) {
  const today = new Date();

  if (today.getFullYear() > since) {
    return `${since} - ${today.getFullYear()}`;
  }

  return `${since}`;
}
