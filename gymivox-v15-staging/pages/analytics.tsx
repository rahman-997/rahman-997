import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, BarChart3, Flame, Timer, Trophy } from "lucide-react";
import { GymivoxAppShell } from "../components/GymivoxAppShell";
import { gymivoxSupabase } from "../helpers/gymivoxSupabase";
import { useGymivoxI18n } from "../helpers/i18n";

type Analytics={window_days:number;workouts:number;active_workouts:number;sets:number;volume_kg:number;avg_duration_minutes:number;current_streak:number;daily:Array<{date:string;sessions:number;sets:number;volume_kg:number}>;exercise_stats:Array<{exercise:string;sets:number;estimated_1rm:number|null;max_weight:number|null}>};

export default function AnalyticsPage(){
  const {t}=useGymivoxI18n();
  const a7=useQuery({queryKey:["analytics",7],queryFn:()=>gymivoxSupabase.rpc<Analytics>("get_workout_analytics",{p_days:7}),retry:false});
  const a30=useQuery({queryKey:["analytics",30],queryFn:()=>gymivoxSupabase.rpc<Analytics>("get_workout_analytics",{p_days:30}),retry:false});
  const a=a30.data;
  const maxVol=Math.max(1,...(a?.daily||[]).map(d=>Number(d.volume_kg||0)));
  return <GymivoxAppShell title={t("analytics.title","Performance Analytics")} eyebrow="GYMIVOX v15">
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
      {[["Workouts",a?.workouts,Activity],["Sets",a?.sets,BarChart3],["Volume kg",Math.round(a?.volume_kg||0),Trophy],["Streak",a?.current_streak,Flame]].map(([label,value,Icon]:any)=><div key={label} style={{padding:18,border:"1px solid var(--border)",borderRadius:18}}><Icon size={18}/><strong style={{display:"block",fontSize:28}}>{value??0}</strong><span>{label}</span></div>)}
    </div>
    <section style={{marginTop:18,padding:18,border:"1px solid var(--border)",borderRadius:18}}>
      <h3>{t("analytics.last_30_days","Last 30 days")}</h3>
      <div style={{display:"flex",alignItems:"end",gap:5,height:180}}>
        {(a?.daily||[]).map(d=><div key={d.date} title={d.date+" · "+d.volume_kg+" kg"} style={{flex:1,minWidth:4,height:Math.max(4,(Number(d.volume_kg||0)/maxVol)*160),background:"linear-gradient(var(--secondary),var(--primary))",borderRadius:"6px 6px 2px 2px"}}/>)}
      </div>
    </section>
    <section style={{marginTop:18,padding:18,border:"1px solid var(--border)",borderRadius:18}}>
      <h3>Exercise bests</h3>
      {(a?.exercise_stats||[]).map(e=><div key={e.exercise} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:12,padding:10,borderBottom:"1px solid var(--border)"}}><b>{e.exercise}</b><span>{e.max_weight??"—"} kg</span><span>{e.estimated_1rm??"—"} est. 1RM</span></div>)}
    </section>
    <small style={{display:"block",marginTop:12}}>7-day workouts: {a7.data?.workouts??0} · Average duration: {a?.avg_duration_minutes??0} min</small>
  </GymivoxAppShell>
}
