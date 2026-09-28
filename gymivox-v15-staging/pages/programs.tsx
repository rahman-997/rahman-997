import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Dumbbell, Play, Search } from "lucide-react";
import { GymivoxAppShell } from "../components/GymivoxAppShell";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { gymivoxSupabase } from "../helpers/gymivoxSupabase";
import { useGymivoxI18n } from "../helpers/i18n";

type L10n={ar:string;tr:string;en:string};
type Program={id:string;title:L10n;summary:L10n;level:string;duration_weeks:number;days_per_week:number;tags:string[];featured:boolean};
type Workout={id:string;program_id:string;day_index:number;title:L10n;focus:L10n;notes:L10n;sort_order:number};
type Exercise={id:string;workout_id:string;exercise_name:L10n;sets:number;reps:string;rir:string|null;rest_seconds:number|null;sort_order:number};

async function loadPrograms(){
  const [programs,workouts,exercises]=await Promise.all([
    gymivoxSupabase.request<Program[]>("/rest/v1/program_catalog?select=id,title,summary,level,duration_weeks,days_per_week,tags,featured&item_type=eq.program&active=eq.true&order=sort_order.asc",{auth:false}),
    gymivoxSupabase.request<Workout[]>("/rest/v1/program_workouts?select=*&order=program_id.asc,sort_order.asc",{auth:false}),
    gymivoxSupabase.request<Exercise[]>("/rest/v1/program_exercises?select=*&order=sort_order.asc",{auth:false})
  ]);
  return {programs,workouts,exercises};
}

export default function ProgramsPage(){
  const {lang,t}=useGymivoxI18n();
  const query=useQuery({queryKey:["v15-programs"],queryFn:loadPrograms});
  const qc=useQueryClient();
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState<string|null>(null);
  const start=useMutation({
    mutationFn:(programId:string)=>gymivoxSupabase.rpc("start_program_plan",{p_program_id:programId,p_start_date:new Date().toISOString().slice(0,10)}),
    onSuccess:()=>qc.invalidateQueries()
  });
  const text=(v:L10n)=>v?.[lang]||v?.en||"";
  const filtered=useMemo(()=>query.data?.programs.filter(p=>text(p.title).toLowerCase().includes(search.toLowerCase()))||[],[query.data,search,lang]);
  const active=query.data?.programs.find(p=>p.id===selected)||filtered[0];
  const days=query.data?.workouts.filter(w=>w.program_id===active?.id)||[];
  const exercisesByWorkout=new Map((query.data?.exercises||[]).map(e=>[e.workout_id,[] as Exercise[]]));
  for(const e of query.data?.exercises||[]){const arr=exercisesByWorkout.get(e.workout_id)||[];arr.push(e);exercisesByWorkout.set(e.workout_id,arr)}

  return <GymivoxAppShell title={t("programs.title","Training Programs")} eyebrow="GYMIVOX v15">
    <div style={{display:"grid",gap:16}}>
      <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("common.search","Search")} />
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
        {filtered.map(p=><button key={p.id} onClick={()=>setSelected(p.id)} style={{textAlign:"start",padding:18,border:"1px solid var(--border)",borderRadius:18,background:selected===p.id?"rgba(124,92,255,.12)":"rgba(18,26,50,.76)",color:"inherit"}}>
          <Badge variant={p.featured?"primary":"secondary"}>{p.level}</Badge>
          <h3>{text(p.title)}</h3><p>{text(p.summary)}</p>
          <small>{p.duration_weeks} {t("programs.weeks","weeks")} · {p.days_per_week} {t("programs.days_week","days/week")}</small>
        </button>)}
      </div>
      {active&&<section style={{padding:22,border:"1px solid var(--border)",borderRadius:22,background:"rgba(18,26,50,.76)"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
          <div><h2>{text(active.title)}</h2><p>{text(active.summary)}</p></div>
          <Button onClick={()=>start.mutate(active.id)} disabled={start.isPending}><Play size={16}/>{t("programs.enroll","Start program")}</Button>
        </div>
        <div style={{display:"grid",gap:14,marginTop:18}}>
          {days.map(day=><article key={day.id} style={{padding:16,border:"1px solid var(--border)",borderRadius:16}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><CalendarDays size={18}/><strong>{text(day.title)}</strong><span>{text(day.focus)}</span></div>
            <div style={{display:"grid",gap:7,marginTop:12}}>
              {(exercisesByWorkout.get(day.id)||[]).map(e=><div key={e.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:12,padding:"8px 0",borderTop:"1px solid var(--border)"}}>
                <span><Dumbbell size={13}/> {text(e.exercise_name)}</span><b>{e.sets} sets</b><span>{e.reps}</span><span>{e.rir||"—"} RIR</span>
              </div>)}
            </div>
          </article>)}
        </div>
      </section>}
    </div>
  </GymivoxAppShell>
}
