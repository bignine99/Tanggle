import { getProcedureById } from "@/lib/dataFetcher";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

import ProcedureHero from "@/components/procedures/ProcedureHero";
import SpecialPointCard from "@/components/procedures/SpecialPointCard";
import QnaAccordion from "@/components/procedures/QnaAccordion";
import RelatedMediaSection from "@/components/procedures/RelatedMediaSection";
import StickyToc from "@/components/procedures/StickyToc";

interface DetailPageProps {
  params: Promise<{ category: string; slug: string }>;
}

// SEO Metadata Generation dynamically based on JSON
export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = getProcedureById(resolvedParams.slug);
  
  if (!data) return { title: '정보를 찾을 수 없습니다 | 탱글성형외과' };
  
  return {
    title: `${data.title} | 탱글성형외과`,
    description: data.summary,
  };
}

export default async function ProcedureDetailPage({ params }: DetailPageProps) {
  const resolvedParams = await params;
  const data = getProcedureById(resolvedParams.slug);

  if (!data) {
    notFound();
  }

  // Determine what list formats to pass to SpecialPointCards
  const advantages = data.advantages && data.advantages.length > 0 ? data.advantages : null;
  
  let methodItems = null;
  if (data.how_it_is_performed && Array.isArray(data.how_it_is_performed)) {
    methodItems = data.how_it_is_performed;
  } else if (data.face_lifting_methods && Array.isArray(data.face_lifting_methods)) {
    methodItems = data.face_lifting_methods;
  } else if (data.neck_lifting && Array.isArray(data.neck_lifting)) {
    methodItems = data.neck_lifting;
  }

  // Dynamically build the Table of Contents based on available data
  const tocItems = [];
  if (data.content?.summary && data.content.summary !== data.summary) tocItems.push({ id: "section-context", label: "주요 안내 사항" });
  if (advantages || methodItems) tocItems.push({ id: "section-points", label: "특장점 및 수술 방법" });
  if (data.content?.qa_pairs && data.content.qa_pairs.length > 0) tocItems.push({ id: "section-qna", label: "핵심 Q&A" });
  if (data.video_id) tocItems.push({ id: "section-media", label: "원장님 심층 가이드" });

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* 1. Hero Section (Full width above grid) */}
      <ProcedureHero data={data} />

      {/* 2. Grid Layout with Context & TOC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-16">
          
          {/* Core Description / Extra details */}
          {data.content?.summary && data.content.summary !== data.summary && (
            <div id="section-context" className="scroll-mt-32">
              <div className="bg-white rounded-lg p-8 border border-neutral-100 shadow-sm leading-loose text-neutral-600">
                {data.content.summary}
              </div>
            </div>
          )}

          {/* Dynamic Cards */}
          {(advantages || methodItems) && (
            <div id="section-points" className="scroll-mt-32">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {advantages && (
                  <SpecialPointCard title="기대 효과 및 특장점" items={advantages} />
                )}
                {methodItems && (
                  <SpecialPointCard title="수술 진행 방법" items={methodItems} />
                )}
              </div>
            </div>
          )}

          {/* Q&A Accordion */}
          {data.content?.qa_pairs && data.content.qa_pairs.length > 0 && (
            <div id="section-qna" className="scroll-mt-32">
              <QnaAccordion qnaList={data.content.qa_pairs} />
            </div>
          )}

          {/* Media / Video Embed */}
          {data.video_id && (
            <div id="section-media" className="scroll-mt-32">
              <RelatedMediaSection videoId={data.video_id} />
            </div>
          )}
        </div>

        {/* Floating Sidebar (TOC) */}
        <div className="lg:col-span-4 relative">
          <StickyToc items={tocItems} />
        </div>
        
      </div>
    </div>
  );
}
