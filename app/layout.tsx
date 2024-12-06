
import type { Metadata } from 'next';
import { SettingsProvider } from './SettingsProvider';
import 'rsuite/dist/rsuite-no-reset.min.css';
import './styles/base.scss';
import './styles/datatables.min.css';


export const metadata: Metadata = {
  title: "Prints and Photographs Discovery tool",
  description: "Tool to aid in the discovery of items from the Prints and Photographs collection"
};


export default function RootLayout({ children }: Readonly<ContainsChildren>) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          { children }
        </SettingsProvider>
      </body>
    </html>
  );
};

