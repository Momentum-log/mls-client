"use client";

import NotFoundView from "@/components/ui/not-found-view";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function GlobalNotFound() {
  return (
    <>
      <Header />
      <NotFoundView isApp={false} />
      <Footer />
    </>
  );
}
