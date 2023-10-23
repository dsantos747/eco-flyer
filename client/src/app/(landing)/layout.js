import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { VapourTrails } from "../components/vapourTrails";

export default function LandingLayout({ children }) {
  return (
    <section className="min-h-screen flex flex-col justify-between overflow-x-hidden bg-gradient-to-t from-rose-100 via-sky-100 to-blue-400">
      <Header></Header>
      <VapourTrails></VapourTrails>
      <div className="backdrop-blur-sm w-full h-full flex flex-col flex-1 grow justify-center items-center">
        <div className="flex flex-1 flex-col place-content-center py-20">{children}</div>
      </div>
      <Footer></Footer>
    </section>
  );
}
