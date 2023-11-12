import { HeaderSmall } from '../components/header';
import { BasicFooter } from '../components/footer';

export default function ResultLayout({ children }) {
  return (
    <section className="min-h-screen flex flex-col justify-between overflow-x-hidden bg-gradient-to-t from-sky-300 to-blue-400">
      <HeaderSmall></HeaderSmall>
      {children}
      <BasicFooter></BasicFooter>
    </section>
  );
}
