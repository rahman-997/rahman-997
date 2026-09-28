import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import { GymivoxAppShell } from "../components/GymivoxAppShell";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { gymivoxSupabase } from "../helpers/gymivoxSupabase";
import { useGymivoxI18n } from "../helpers/i18n";

type L10n={ar:string;tr:string;en:string};
type Course={id:string;title:L10n;summary:L10n;level:string;duration_weeks:number;featured:boolean};
type Lesson={id:string;course_id:string;lesson_index:number;title:L10n;summary:L10n;content:{ar?:{bullets:string[]};tr?:{bullets:string[]};en?:{bullets:string[]}};duration_minutes:number|null};
type Progress={lesson_id:string;progress_pct:number;completed_at:string|null};

async function loadCourses(){
  const session=await gymivoxSupabase.getSession();
  const [courses,lessons,progress]=await Promise.all([
    gymivoxSupabase.request<Course[]>("/rest/v1/program_catalog?select=id,title,summary,level,duration_weeks,featured&item_type=eq.course&active=eq.true&order=sort_order.asc",{auth:false}),
    gymivoxSupabase.request<Lesson[]>("/rest/v1/course_lessons?select=*&order=course_id.asc,sort_order.asc",{auth:false}),
    session?gymivoxSupabase.request<Progress[]>("/rest/v1/course_lesson_progress?select=lesson_id,progress_pct,completed_at&user_id=eq."+encodeURIComponent(session.user.id)):Promise.resolve([])
  ]);
  return {session,courses,lessons,progress};
}

export default function CoursesPage(){
  const {lang,t}=useGymivoxI18n();
  const qc=useQueryClient();
  const q=useQuery({queryKey:["v15-courses"],queryFn:loadCourses});
  const [selected,setSelected]=useState<string|null>(null);
  const text=(v:L10n)=>v?.[lang]||v?.en||"";
  const active=q.data?.courses.find(c=>c.id===selected)||q.data?.courses[0];
  const lessons=useMemo(()=>q.data?.lessons.filter(l=>l.course_id===active?.id)||[],[q.data,active?.id]);
  const done=new Map(q.data?.progress.map(p=>[p.lesson_id,p])||[]);
  const complete=useMutation({
    mutationFn:(lessonId:string)=>gymivoxSupabase.rpc("complete_course_lesson",{p_lesson_id:lessonId}),
    onSuccess:()=>qc.invalidateQueries({queryKey:["v15-courses"]})
  });

  return <GymivoxAppShell title={t("courses.title","GYMIVOX Courses")} eyebrow="GYMIVOX v15">
    <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:18}}>
      <aside style={{display:"grid",gap:10,alignContent:"start"}}>
        {q.data?.courses.map(c=><button key={c.id} onClick={()=>setSelected(c.id)} style={{padding:14,border:"1px solid var(--border)",borderRadius:14,background:active?.id===c.id?"rgba(124,92,255,.12)":"rgba(18,26,50,.76)",color:"inherit",textAlign:"start"}}>
          <Badge variant={c.featured?"primary":"secondary"}>{c.level}</Badge><h3>{text(c.title)}</h3><small>{c.duration_weeks} weeks</small>
        </button>)}
      </aside>
      <main style={{display:"grid",gap:14}}>
        {active&&<header><h2>{text(active.title)}</h2><p>{text(active.summary)}</p></header>}
        {lessons.map(l=><article key={l.id} style={{padding:18,border:"1px solid var(--border)",borderRadius:18,background:"rgba(18,26,50,.76)"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}><div><small>{t("courses.lesson","Lesson")} {l.lesson_index}</small><h3>{text(l.title)}</h3></div>{done.get(l.id)?.progress_pct===100?<Badge variant="success"><CheckCircle2 size={13}/>100%</Badge>:<Badge variant="outline">{l.duration_minutes||"—"} min</Badge>}</div>
          <p>{text(l.summary)}</p>
          <ul>{(l.content?.[lang]?.bullets||l.content?.en?.bullets||[]).map((b,i)=><li key={i}>{b}</li>)}</ul>
          {q.data?.session&&done.get(l.id)?.progress_pct!==100&&<Button size="sm" onClick={()=>complete.mutate(l.id)} disabled={complete.isPending}><PlayCircle size={15}/>{t("courses.complete_lesson","Complete lesson")}</Button>}
        </article>)}
      </main>
    </div>
  </GymivoxAppShell>
}
