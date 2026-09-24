import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { gymivoxSupabase } from "./gymivoxSupabase";

export type GymivoxLanguage = "ar" | "tr" | "en";

type TranslationRow = { key:string; ar:string; tr:string; en:string };
type I18nContextValue = {
  lang: GymivoxLanguage;
  dir: "rtl" | "ltr";
  setLang: (lang: GymivoxLanguage) => void;
  t: (key:string, fallback?:string) => string;
  ready: boolean;
};

const I18nContext=createContext<I18nContextValue>({
  lang:"en",dir:"ltr",setLang:()=>undefined,t:(k,f)=>f||k,ready:false
});

function normalize(value:unknown):GymivoxLanguage{
  return value==="ar"||value==="tr"||value==="en"?value:"en";
}

export function GymivoxI18nProvider({children}:{children:React.ReactNode}){
  const [lang,setLangState]=useState<GymivoxLanguage>(()=>normalize(localStorage.getItem("gymivox-v15-lang")));
  const [rows,setRows]=useState<TranslationRow[]>([]);
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    let mounted=true;
    (async()=>{
      try{
        const session=await gymivoxSupabase.getSession();
        if(session){
          const profile=await gymivoxSupabase.request<Array<{preferred_language:string|null}>>(
            "/rest/v1/profiles?select=preferred_language&user_id=eq."+encodeURIComponent(session.user.id)+"&limit=1"
          );
          if(mounted&&profile[0]?.preferred_language)setLangState(normalize(profile[0].preferred_language));
        }
        const data=await gymivoxSupabase.request<TranslationRow[]>(
          "/rest/v1/ui_translations?select=key,ar,tr,en&order=namespace.asc,key.asc",
          {auth:false}
        );
        if(mounted)setRows(data);
      }finally{if(mounted)setReady(true)}
    })();
    return()=>{mounted=false};
  },[]);

  const map=useMemo(()=>new Map(rows.map(row=>[row.key,row])),[rows]);
  const setLang=(next:GymivoxLanguage)=>{
    setLangState(next);
    localStorage.setItem("gymivox-v15-lang",next);
    document.documentElement.lang=next;
    document.documentElement.dir=next==="ar"?"rtl":"ltr";
  };
  useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr"},[lang]);

  const value=useMemo<I18nContextValue>(()=>({
    lang,
    dir:lang==="ar"?"rtl":"ltr",
    setLang,
    ready,
    t:(key,fallback)=>{
      const row=map.get(key);
      return row?.[lang]||row?.en||fallback||key;
    }
  }),[lang,map,ready]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useGymivoxI18n(){return useContext(I18nContext)}
