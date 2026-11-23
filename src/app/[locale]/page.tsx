import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import About from "@/components/About";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PageMotion from "@/components/PageMotion";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const nav = await getTranslations("nav");

  return (
    <>
      <a className="skip" href="#main">
        {nav("skip")}
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Projects />
        <Banner />
        <Services />
        <About />
      </main>
      <Footer />
      <PageMotion />
    </>
  );
}
