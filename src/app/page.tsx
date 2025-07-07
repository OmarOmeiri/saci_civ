'use client';

import {
  Card,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useState } from 'react';
import styles from './page.module.css';
import SaciTable from '../lib/home/saciTable';
import CivTable from '../lib/home/civTable';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('saci');
  const [saciData, setSaciData] = useState<SACIData[] | null>(null);
  const [typeData, setTypeData] = useState<ACFTTypes[] | null>(null);

  return (
    <div className={styles.container}>
      {/* <div style={{ backgroundColor: 'red' }}></div> */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.TabContainer}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saci">SACI</TabsTrigger>
          <TabsTrigger value="civ" disabled={!saciData}>CIV</TabsTrigger>
        </TabsList>
        <TabsContent value="saci" forceMount hidden={activeTab !== 'saci'}>
          <Card className={styles.TabContent}>
            <SaciTable saciData={saciData} setSaciData={setSaciData} setTypeData={setTypeData}/>
          </Card>
        </TabsContent>
        <TabsContent value="civ" forceMount hidden={activeTab !== 'civ'}>
          <Card className={styles.TabContent}>
            <CivTable saciData={saciData} typeData={typeData} isMounted={activeTab === 'civ'}/>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
