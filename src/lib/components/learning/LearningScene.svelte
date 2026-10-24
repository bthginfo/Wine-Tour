<script lang="ts">
 import {fade} from 'svelte/transition';
 import {prefersReducedMotion} from 'svelte/motion';
 import type {LearningScene} from '#lib/learning-scene.ts';
 let {scene}:{scene:LearningScene}=$props();
 let selected=$state(0);
 const item=$derived(scene.items[selected]);
 const berryPositions=[[171,63],[190,62],[210,64],[180,80],[201,81],[190,98]];
</script>

<section class="learning-visual learning-scene visual-visible" data-visual={scene.kind} aria-label={scene.title}>
 <div class="visual-heading"><span class="eyebrow">{scene.eyebrow}</span><h3>{scene.title}</h3></div>
 {#if scene.kind==='riesling-season'}
  <div class="season-art" aria-hidden="true">
   <svg viewBox="0 0 380 156"><path class="ground" d="M26 136H354"/><path class="wood" d="M185 136V58M185 89Q149 79 117 51M185 83Q221 73 254 44"/>
    {#each [[119,48,-30],[249,43,30],[185,57,0]] as [x,y,r]}
     <g transform={'translate('+x+' '+y+') rotate('+r+')'}><path d={selected===0?'M0 4Q-18-24 0-25Q18-24 0 4':'M0 4Q-36-26-12-36L0-27L12-36Q36-26 0 4'} fill={selected===0?'#a8b58a':'#6e8e64'}/><path d="M0 4V-22" fill="none" stroke="#e9efda" stroke-width="1.2"/></g>
    {/each}
    {#if selected>0}{#each berryPositions as [x,y],i}<circle cx={x+57} cy={y+12} r={selected===1?2.8:8} fill={selected===1?'#e6d79c':selected===2?'#91a776':'#c3bd79'} stroke={selected===1?'#b79f59':'#fbfbf0'} stroke-width="1"/>{/each}{/if}
    {#if selected===3}<path d="M239 118l13-10m-20 7 13 10" stroke="#6b7568" stroke-width="2"/><circle cx="230" cy="113" r="4" fill="none" stroke="#6b7568"/><circle cx="240" cy="128" r="4" fill="none" stroke="#6b7568"/>{/if}
    <circle cx="316" cy="30" r="12" fill="#dbc785"/><path d="M310 136l12-7 12 7" class="ground"/>
   </svg>
   <span class="art-label">{item.label}</span>
  </div>
  <div class="season-steps" role="group" aria-label="Phase im Weinberg auswählen">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}><span class="season-dot"></span>{option.label}</button>{/each}</div>
 {:else if scene.kind==='rose-methods'}
  <div class="rose-process-art" aria-hidden="true"><svg viewBox="0 0 380 156">
   <g transform="translate(44 21)">{#each [[10,13],[29,13],[48,13],[20,31],[39,31],[30,49]] as [x,y]}<circle cx={x} cy={y} r="10" fill="#8d596b" stroke="var(--visual-surface)" stroke-width="2"/>{/each}</g>
   {#if selected===0}<path d="M156 24h50m-25-8v64m-34-37h68m-59 9v35h50V52m-53 41h56" fill="none" stroke="var(--muted)" stroke-width="3"/><path d="M157 64h48v20h-48z" fill="#d9a09c"/>
   {:else}<path d="M146 27h70v84h-70z" fill="none" stroke="var(--muted)" stroke-width="2"/><path d="M148 52h66v56h-66z" fill={selected===1?'#d9a09c':'#94586b'}/>{#each [0,1,2,3,4] as n}<circle cx={154+n*12} cy="59" r="4" fill="#845166"/>{/each}{#if selected===2}<path d="M215 83h30v22" fill="none" stroke="#d9a09c" stroke-width="4"/>{/if}{/if}
   <path d="M107 73h23m-6-5 6 5-6 5M231 73h23m-6-5 6 5-6 5" fill="none" stroke="var(--muted)" stroke-width="1.5"/>
   <path d="M284 32h45v65q-22 17-45 0z" fill="none" stroke="var(--muted)" stroke-width="2"/><path d="M286 70h41v26q-20 14-41 0z" fill="#dda5a1"/>
   <text x="76" y="141" text-anchor="middle">Dunkle Trauben</text><text x="181" y="141" text-anchor="middle">{selected===0?'Presse':'Maische'}</text><text x="307" y="141" text-anchor="middle">Rosa Most</text>
  </svg></div>
  <div class="scene-choices" role="group" aria-label="Roséverfahren auswählen">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}>{option.label}</button>{/each}</div>
 {:else if scene.kind==='sekt-bottle'}
  <div class="bottle-lesson"><svg viewBox="0 0 150 200" aria-hidden="true"><path d="M58 15h34v46q0 14 18 28v86q0 12-12 12H52q-12 0-12-12V89q18-14 18-28z" fill="none" stroke="var(--muted)" stroke-width="2"/><path d="M43 101h64v72q0 11-10 11H53q-10 0-10-11z" fill="#d9cb99" opacity=".8"/>{#if selected===1}{#each [0,1,2,3,4,5] as n}<circle class="lesson-bubble" style={'--delay:'+n*180+'ms'} cx={56+n%3*18} cy={116+Math.floor(n/3)*30} r="2.5" fill="#fdfcf4"/>{/each}{/if}{#if selected===2}<path d="M43 174h64v6q0 4-10 4H53q-10 0-10-4z" fill="#a6946d"/>{/if}{#if selected===3}<path d="M61 20h28v13H61z" fill="#a6946d"/><path d="M76 14V2m-5 5 5-5 5 5" stroke="var(--muted)" fill="none"/>{:else}<path d="M56 12h38v7H56z" fill="#6d8271"/>{/if}</svg>
   <div class="bottle-phases" role="group" aria-label="Flaschengärung erkunden">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}><span>0{i+1}</span>{option.label}</button>{/each}</div>
  </div>
 {:else if scene.kind==='champagne-blend'}
  <div class="blend-art" aria-hidden="true"><svg viewBox="0 0 380 160">{#each ['Sorten','Weinberge','Jahrgänge'] as label,i}<g opacity={selected===i?1:.35}><circle cx={70+i*120} cy="36" r="22" fill={['#9d6e80','#8a9d7b','#d3bc82'][i]}/><path d={'M'+(70+i*120)+' 60Q'+(70+i*120)+' 109 190 112'} fill="none" stroke={['#9d6e80','#8a9d7b','#d3bc82'][i]} stroke-width="3"/><text x={70+i*120} y="41" text-anchor="middle" class="blend-number">{i+1}</text></g>{/each}<rect x="135" y="111" width="110" height="33" rx="16" fill="var(--visual-surface)" stroke="var(--line)"/><text x="190" y="132" text-anchor="middle">Assemblage</text></svg></div>
  <div class="scene-choices" role="group" aria-label="Baustein der Assemblage auswählen">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}>{option.label}</button>{/each}</div>
 {:else if scene.kind==='cava-age'}
  <div class="age-readout"><strong>{item.months}</strong><span>Monate<br/>mindestens auf der Hefe</span></div>
 <label class="age-slider"><span>Cava-Reifekategorie</span><input type="range" min="0" max="3" step="1" bind:value={selected} aria-valuetext={item.label+': mindestens '+item.months+' Monate'}/></label>
  <div class="age-labels" role="group" aria-label="Reifekategorie auswählen">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}><span>{option.months} Monate</span>{option.label}</button>{/each}</div>
 {:else if scene.kind==='port-styles'}
  <div class="port-grid" role="group" aria-label="Portweinstil auswählen">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}><svg viewBox="0 0 70 70" aria-hidden="true">{#if i===1||i===3}<path d="M17 12q-12 23 0 46h36q12-23 0-46z" fill={i===1?'#b78b68':'#8e6674'} opacity=".8"/><path d="M13 23h44M13 47h44M27 13q-5 22 0 44m16-44q5 22 0 44" stroke="var(--visual-surface)" fill="none"/>{:else}<path d="M29 7h12v14l7 9v29H22V30l7-9z" fill={i===0?'#965469':'#6b455b'}/><rect x="24" y="35" width="22" height="15" rx="1" fill="#e7e3d5"/>{/if}</svg><strong>{option.label}</strong><small>{i<2?'Stilfamilie':'Jahrgangskategorie'}</small></button>{/each}</div>
 {/if}
 {#key selected}<div class="visual-explanation" in:fade={{duration:prefersReducedMotion.current?0:130}}><h4>{item.title}</h4><p>{item.body}</p></div>{/key}
 <small class="visual-caption">{scene.caption}</small>
</section>

<style>
 .learning-scene{overflow:hidden}.learning-scene .visual-heading h3{max-width:30ch}.learning-scene svg{display:block;width:100%;height:160px}.learning-scene svg text{font:12px 'DM Sans',sans-serif;fill:var(--ink)}.learning-scene .visual-explanation{min-height:140px}.learning-scene .visual-explanation h4{font-size:16px;line-height:1.5;margin-bottom:8px}.learning-scene .visual-caption{display:block;line-height:1.7;margin-top:15px}.scene-choices{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}.learning-scene button{border:1px solid var(--line);border-radius:9px;min-height:44px;line-height:1.5;padding:10px 13px;text-align:left;background:var(--visual-surface);transition:background .16s,border-color .16s}.learning-scene button:hover{border-color:var(--muted)}.learning-scene button.active{background:var(--green);border-color:#617347;color:#29332d}.learning-scene button:focus-visible,.age-slider input:focus-visible{outline:2px solid var(--ink);outline-offset:4px}.season-art{position:relative;margin-top:18px}.season-art .wood{fill:none;stroke:#94745e;stroke-width:5;stroke-linecap:round}.season-art .ground{fill:none;stroke:var(--line);stroke-width:1.5}.art-label{position:absolute;left:18px;top:14px;font-size:11px;color:var(--muted)}.season-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:10px 0 22px}.season-steps button{text-align:center;padding:12px 4px;font-size:12px}.season-dot{display:block;width:6px;height:6px;border-radius:50%;background:var(--muted);margin:0 auto 8px}.active .season-dot{background:currentColor}.rose-process-art{margin-top:18px}.bottle-lesson{display:grid;grid-template-columns:120px minmax(0,1fr);gap:26px;align-items:center;margin:22px 0}.bottle-lesson svg{height:210px}.bottle-phases{display:grid;gap:8px}.bottle-phases button{display:flex;gap:14px;align-items:center}.bottle-phases button>span{font-size:10px;color:inherit}.lesson-bubble{animation:rise 2.8s var(--delay) ease-in-out infinite}@keyframes rise{50%{transform:translateY(-13px);opacity:.35}}.blend-art{margin-top:18px}.learning-scene svg .blend-number{fill:#fff;font-size:14px;font-weight:600}.age-readout{display:flex;gap:16px;align-items:center;padding:24px 0 16px}.age-readout strong{font:600 58px/1 Manrope,sans-serif;letter-spacing:-3px}.age-readout span{font-size:12px;line-height:1.6;color:var(--muted)}.age-slider{display:block;padding:8px 0}.age-slider>span{font-size:12px;font-weight:600}.age-slider input{width:100%;accent-color:var(--dark);min-height:44px;margin:0}.age-labels{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:8px 0 22px}.age-labels button{font-size:10px;padding:10px 7px;overflow-wrap:anywhere}.age-labels span{display:block;font-size:11px;font-weight:700;margin-bottom:4px}.port-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:22px 0}.port-grid button{text-align:center;padding:12px 7px}.port-grid svg{height:70px}.port-grid strong,.port-grid small{display:block}.port-grid small{font-size:9px;margin-top:4px}.learning-scene p{overflow-wrap:anywhere}
 @media(max-width:520px){.learning-scene .visual-explanation{min-height:190px}.learning-scene svg{height:145px}.season-steps{gap:4px}.season-steps button{font-size:11px}.scene-choices{gap:6px}.scene-choices button{font-size:12px;padding:10px}.bottle-lesson{grid-template-columns:85px minmax(0,1fr);gap:14px}.bottle-phases button{font-size:12px;padding:10px;gap:10px}.age-labels,.port-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.age-labels button{font-size:12px;padding:11px}.port-grid svg{height:58px}.port-grid small{font-size:10px}.learning-scene .visual-caption{font-size:11px}}
 @media(prefers-reduced-motion:reduce){.learning-scene *{animation:none!important;transition:none!important}}
</style>
