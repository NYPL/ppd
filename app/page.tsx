'use client';

// import styles from './page.module.scss';
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('./components/MyDataTable/MyDataTable'),
  { ssr: false }
);

export default function Home() {

  return (
    <>
      <DynamicComponentWithNoSSR tableName='main' />
    </>
  );
}

