import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Activity, BookOpen, Dumbbell, Flame, Salad, Target } from "lucide-react";
import { GymivoxAppShell } from "../components/GymivoxAppShell";
import { Button } from "../components/Button";
import { gymivoxSupabase } from "../helpers/gymivoxSupabase";
import { useGymivoxI18n } from "../helpers/i18n";

export default function SmartDashboardV15(){
  const {t,lang}=useGymivoxI18n();
  const q=useQuery({queryKey:["smart-dashboard-v15"],queryFn:()=>gymivoxSupabase.rpc<any>("get_smart_dashboard"),retry:false});
  const d=q.data||{};
  const title=d.active_enrollment?.title?.[lang]||d.active_enrollment?.title?.en;
  return <GymivoxAppShell title={t("dashboard.title","Today Dashboard")} eyebrow="GYMIVOX v15">
    <section style={{padding:24,border:"1px solid var(--border)",borderRadius:24,background:"rgba(18,26,50,.76)"}}>
      <h2>{t("dashboard.greeting","Welcome back")}{d.profile?.display_name?", "+d.profile.display_name.split(" ")[0]:""}</h2>
      <p>{title?"Active: "+title:"Choose a program to generate your training week."}</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <Button asChild><Link to="/programs"><BookOpen size={15}/>Programs</Link></Button>
        <Button asChild variant="outline"><Link to="/workout"><Dumbbell size={15}/>Workout</Link></Button>
      </div>
    </section>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:16}}>
      <Link to="/analytics" style={{padding:16,border:"1px solid var(--border)",borderRadius:16,color:"inherit",textDecoration:"none"}}><Activity/><strong style={{display:"block",fontSize:26}}>{d.workout_7d?.workouts||0}</strong>7d workouts</Link>
      <Link to="/nutrition" style={{padding:16,border:"1px solid var(--border)",borderRadius:16,color:"inherit",textDecoration:"none"}}><Salad/><strong style={{display:"block",fontSize:26}}>{d.nutrition_today?.totals?.calories||0}</strong>kcal today</Link>
      <div style={{padding:16,border:"1px solid var(--border)",borderRadius:16}}><Target/><strong style={{display:"block",fontSize:26}}>{d.active_price_alerts||0}</strong>price alerts</div>
      <div style={{padding:16,border:"1px solid var(--border)",borderRadius:16}}><Flame/><strong style={{display:"block",fontSize:26}}>{d.workout_30d?.current_streak||0}</strong>streak</div>
    </div>
    <section style={{marginTop:16,padding:18,border:"1px solid var(--border)",borderRadius:18}}>
      <h3>{t("dashboard.today_training","Today’s training")}</h3>
      {(d.training_today||[]).map((x:any)=><div key={x.id} style={{padding:12,borderTop:"1px solid var(--border)"}}><b>{x.title}</b><p>{x.notes}</p></div>)}
      {!(d.training_today||[]).length&&<p>{t("dashboard.no_workout","No workout logged today")}</p>}
    </section>
  </GymivoxAppShell>
}
