'use client';

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Users, History, Share2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { FamilySelector } from "@/components/features/family/FamilySelector";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const { user, isAuthChecked, checkAuth } = useStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    checkAuth();
  }, []);

  if (!isClient || !isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // If logged in, show Dashboard
  if (user) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-400/10 rounded-full blur-[100px]" />
        </div>
        <Header />
        <main className="flex-1 pt-28">
          <FamilySelector />
        </main>
      </div>
    );
  }

  // Landing Page
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[120px]" />
      </div>

      <Header />

      <main className="flex-1 flex flex-col pt-24 pb-12">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Kỹ nguyên mới của gia phả số
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight max-w-4xl cursor-default">
            Kết nối các thế hệ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Gìn giữ cội nguồn
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
            Nền tảng xây dựng cây gia phả trực quan, hiện đại và bảo mật.
            Lưu giữ những câu chuyện, hình ảnh và ký ức của dòng họ mãi mãi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/register" className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group">
              Bắt đầu miễn phí
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 rounded-full bg-white border border-gray-200 text-gray-700 font-medium text-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              Xem demo
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Trực quan hóa",
                desc: "Xây dựng cây gia phả với giao diện kéo thả mượt mà, dễ sử dụng."
              },
              {
                icon: <History className="w-8 h-8 text-purple-600" />,
                title: "Lịch sử dòng họ",
                desc: "Lưu trữ tiểu sử, sự kiện quan trọng và hình ảnh của từng thành viên."
              },
              {
                icon: <Share2 className="w-8 h-8 text-orange-600" />,
                title: "Chia sẻ an toàn",
                desc: "Mời người thân cùng đóng góp và xem cây gia phả với quyền riêng tư cao."
              }
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl hover:translate-y-[-5px] transition-transform duration-300">
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
