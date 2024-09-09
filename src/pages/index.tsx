import Head from "next/head";
import { useRouter } from "next/router";
import SEO from "@/config/SEO.json";
import SwiperSection from "@/components/homepage/SwiperSection";
import Particles from "@/components/Particles";
import CardSection from "@/components/homepage/CardSection";
import TitleSection from "@/components/homepage/TitleSection";

const Index = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{SEO.Index.title}</title>
        <meta name="description" content={SEO.Index.description} />
        <meta property="og:title" content={SEO.Index.title} />
        <meta property="og:description" content={SEO.Index.description} />
        <meta property="og:image" content={SEO.Index.image} />
        {/* <meta property="og:url" content={`https://yourdomain.com/post/${post.frontMatter.id}`} /> */}
        <meta property="og:type" content={SEO.Index.type} />
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:title" content={SEO.Index.title} />
        <meta name="twitter:description" content={SEO.Index.description} />
        <meta name="twitter:image" content={SEO.Index.image} />
      </Head>

      <div className="relative w-full h-[80vh]">
        {/* 例子效果 */}
        <Particles
          className="absolute z-10 animate-fade-in w-full h-[90%]"
          quantity={100}
        />
        {/* 背後swiper */}
        <SwiperSection />

        {/* 文字內容 */}
        <TitleSection />
      </div >

      {/* 底下部分 */}
      <div className="container mx-auto pt-5 pl-5 pr-5">
        <CardSection />
      </div>
    </>
  );
}
export default Index;