'use client';

import styles from '../page.module.scss';
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/ObjectsDataTable/ObjectsDataTable'),
  { ssr: false }
);

export default function Constituents() {

  return (
    <div className={ styles['data-table-holder'] }>
      <DynamicComponentWithNoSSR tableName='constituents' />
    </div>
  );
}

