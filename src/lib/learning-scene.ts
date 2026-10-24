import scenes from './locales/de/learning-scenes.json' with {type:'json'};
import styles from './locales/de/atlas/style-visuals.json' with {type:'json'};

export type LearningScene={kind:string;eyebrow:string;title:string;caption:string;items:{label:string;title:string;body:string;months?:number}[];layout?:'choices'|'process';color?:string};
export function learningScene(visual:string|undefined,slug:string):LearningScene|undefined{
 if(visual&&visual in scenes)return structuredClone(scenes[visual as keyof typeof scenes]);
 if(visual==='wine-style'){
  const style=styles[slug as keyof typeof styles];if(!style)return;
  const choices='layout'in style&&style.layout==='choices';
  return{kind:'wine-style',eyebrow:choices?'WEINSTILE VERGLEICHEN':'HERSTELLUNG VERSTEHEN',title:style.title,caption:choices?'Die Beispiele zeigen verschiedene Wege, keine aufeinanderfolgenden Schritte.':'Der Ablauf, vereinfacht.',layout:choices?'choices':'process',color:style.color,items:style.stages.map(s=>({label:s.title,...s}))};
 }
}
