import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { VapourTrails } from '../components/vapourTrails';

export default function LandingLayout({ children }) {
  return (
    <section className="min-h-screen flex flex-col justify-between bg-gradient-to-t from-rose-100 to-blue-400 to-70%">
      <Header></Header>
      <VapourTrails></VapourTrails>
      <div className="backdrop-blur-[1px] w-full h-full z-10 flex flex-col flex-1 grow justify-center items-center">
        <div className="flex flex-1 flex-col place-content-center pt-16 pb-2">{children}</div>
      </div>
      <div className="relative z-[5]">
        <Footer></Footer>
      </div>
    </section>
  );
}
