import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Droplets, Plus, Utensils } from "lucide-react";
import { GymivoxAppShell } from "../components/GymivoxAppShell";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { gymivoxSupabase } from "../helpers/gymivoxSupabase";
import { useGymivoxI18n } from "../helpers/i18n";

type Day={date:string;profile:any;totals:any;remaining:any;entries:any[]};
const today=()=>new Date().toISOString().slice(0,10);

export default function NutritionPage(){
  const {t}=useGymivoxI18n();
  const qc=useQueryClient();
  const q=useQuery({queryKey:["v15-nutrition",today()],queryFn:()=>gymivoxSupabase.rpc<Day>("get_nutrition_day",{p_date:today()}),retry:false});
  const [target,setTarget]=useState({goal:"maintain",calories:"",protein:"",carbs:"",fat:"",water:""});
  const [entry,setEntry]=useState({meal:"meal",name:"",calories:"",protein:"",carbs:"",fat:""});

  useEffect(()=>{if(q.data?.profile)setTarget({
    goal:q.data.profile.goal||"maintain",calories:String(q.data.profile.calorie_target||""),protein:String(q.data.profile.protein_target_g||""),carbs:String(q.data.profile.carbs_target_g||""),fat:String(q.data.profile.fat_target_g||""),water:String(q.data.profile.water_target_ml||"")
  })},[q.data]);

  const saveTargets=useMutation({
    mutationFn:async()=>{
      const s=await gymivoxSupabase.getSession();if(!s)throw new Error("AUTH_REQUIRED");
      await gymivoxSupabase.request("/rest/v1/nutrition_profiles?on_conflict=user_id",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({user_id:s.user.id,goal:target.goal,calorie_target:+target.calories||null,protein_target_g:+target.protein||null,carbs_target_g:+target.carbs||null,fat_target_g:+target.fat||null,water_target_ml:+target.water||null,updated_at:new Date().toISOString()})});
    },onSuccess:()=>qc.invalidateQueries({queryKey:["v15-nutrition"]})
  });
  const log=useMutation({
    mutationFn:async()=>{
      const s=await gymivoxSupabase.getSession();if(!s)throw new Error("AUTH_REQUIRED");
      await gymivoxSupabase.request("/rest/v1/nutrition_entries",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({user_id:s.user.id,logged_on:today(),meal:entry.meal,name:entry.name,calories:+entry.calories||0,protein_g:+entry.protein||0,carbs_g:+entry.carbs||0,fat_g:+entry.fat||0})});
    },onSuccess:()=>{setEntry({meal:"meal",name:"",calories:"",protein:"",carbs:"",fat:""});qc.invalidateQueries({queryKey:["v15-nutrition"]})}
  });

  const metric=(label:string,total:any,targetValue:any)=><div style={{padding:16,border:"1px solid var(--border)",borderRadius:16}}><strong style={{fontSize:24}}>{total??0}</strong><div>{label}</div><small>{targetValue?"/ "+targetValue:""}</small></div>;
  return <GymivoxAppShell title={t("nutrition.title","Nutrition")} eyebrow="GYMIVOX v15">
    <p>{t("nutrition.manual_note","Values are manually entered estimates, not medical advice.")}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
      {metric(t("nutrition.calories","Calories"),q.data?.totals?.calories,q.data?.profile?.calorie_target)}
      {metric(t("nutrition.protein","Protein"),q.data?.totals?.protein_g,q.data?.profile?.protein_target_g)}
      {metric(t("nutrition.carbs","Carbs"),q.data?.totals?.carbs_g,q.data?.profile?.carbs_target_g)}
      {metric(t("nutrition.fat","Fat"),q.data?.totals?.fat_g,q.data?.profile?.fat_target_g)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginTop:18}}>
      <section style={{padding:18,border:"1px solid var(--border)",borderRadius:18}}>
        <h3>Targets</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {(["calories","protein","carbs","fat","water"] as const).map(k=><Input key={k} value={target[k]} onChange={e=>setTarget({...target,[k]:e.target.value})} placeholder={k}/>)}
        </div>
        <Button style={{marginTop:12}} onClick={()=>saveTargets.mutate()}>Save targets</Button>
      </section>
      <section style={{padding:18,border:"1px solid var(--border)",borderRadius:18}}>
        <h3><Utensils size={18}/> {t("nutrition.log_food","Log food")}</h3>
        <Input value={entry.name} onChange={e=>setEntry({...entry,name:e.target.value})} placeholder="Meal / food"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginTop:10}}>
          {(["calories","protein","carbs","fat"] as const).map(k=><Input key={k} value={entry[k]} onChange={e=>setEntry({...entry,[k]:e.target.value})} placeholder={k}/>)}
        </div>
        <Button style={{marginTop:12}} onClick={()=>log.mutate()} disabled={!entry.name.trim()}><Plus size={15}/>Add</Button>
      </section>
    </div>
    <section style={{marginTop:18}}><h3>Today</h3>{q.data?.entries?.map(e=><div key={e.id} style={{padding:12,borderBottom:"1px solid var(--border)"}}><b>{e.name}</b> — {e.calories} kcal · {e.protein_g}g protein</div>)}</section>
  </GymivoxAppShell>
}
