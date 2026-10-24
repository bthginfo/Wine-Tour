<script lang="ts">
 import Illustration from './Illustration.svelte';
 import {fade} from 'svelte/transition';
 import {prefersReducedMotion} from 'svelte/motion';
 import type {LearningScene} from '#lib/learning-scene.ts';
 let {scene}:{scene:LearningScene}=$props();
 let selected=$state(0);
 const item=$derived(scene.items[selected]);

</script>

<section class="learning-visual learning-scene visual-visible" data-visual={scene.kind} aria-label={scene.title}>
 <div class="visual-heading"><span class="eyebrow">{scene.eyebrow}</span><h3>{scene.title}</h3></div>
 {#if scene.kind==='riesling-season'}
  <Illustration kind="riesling-season" stage={selected}/>
  <div class="season-steps" role="group" aria-label="Phase im Weinberg auswählen">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}><span class="season-dot"></span>{option.label}</button>{/each}</div>
 {:else if scene.kind==='rose-methods'}
  <Illustration kind="rose-methods" stage={selected}/><div class="art-process-labels" aria-hidden="true"><span>Dunkle Trauben</span><span>{selected===0?'Presse':'Maische'}</span><span>Rosa Most</span></div>
  <div class="scene-choices" role="group" aria-label="Roséverfahren auswählen">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}>{option.label}</button>{/each}</div>
 {:else if scene.kind==='sekt-bottle'}
  <Illustration kind="sekt-bottle" stage={selected}/>
  <div class="bottle-phases" role="group" aria-label="Flaschengärung erkunden">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}><span>0{i+1}</span>{option.label}</button>{/each}</div>
 {:else if scene.kind==='champagne-blend'}
  <Illustration kind="champagne-blend" stage={selected}/>
  <div class="scene-choices" role="group" aria-label="Baustein der Assemblage auswählen">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}>{option.label}</button>{/each}</div>
 {:else if scene.kind==='cava-age'}
  <Illustration kind="cava-age" stage={selected}/>
  <div class="age-readout"><strong>{item.months}</strong><span>Monate<br/>mindestens auf der Hefe</span></div>
 <label class="age-slider"><span>Cava-Reifekategorie</span><input type="range" min="0" max="3" step="1" bind:value={selected} aria-valuetext={item.label+': mindestens '+item.months+' Monate'}/></label>
  <div class="age-labels" role="group" aria-label="Reifekategorie auswählen">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}><span>{option.months} Monate</span>{option.label}</button>{/each}</div>
 {:else if scene.kind==='port-styles'}
  <Illustration kind="port-styles" stage={selected}/><div class="port-grid" role="group" aria-label="Portweinstil auswählen">{#each scene.items as option,i}<button type="button" aria-pressed={selected===i} class:active={selected===i} onclick={()=>selected=i}><strong>{option.label}</strong><small>{i<2?'Stilfamilie':'Jahrgangskategorie'}</small></button>{/each}</div>
 {/if}
 {#key selected}<div class="visual-explanation" in:fade={{duration:prefersReducedMotion.current?0:130}}><h4>{item.title}</h4><p>{item.body}</p></div>{/key}
 <small class="visual-caption">{scene.caption}</small>
</section>

<style>
 .art-process-labels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));text-align:center;font-size:10px;line-height:1.6;color:var(--muted);margin:-7px 0 18px}
 .learning-scene{overflow:hidden}.learning-scene .visual-heading h3{max-width:30ch}.learning-scene .visual-explanation{min-height:140px}.learning-scene .visual-explanation h4{font-size:16px;line-height:1.5;margin-bottom:8px}.learning-scene .visual-caption{display:block;line-height:1.7;margin-top:15px}.scene-choices{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}.learning-scene button{border:1px solid var(--line);border-radius:9px;min-height:44px;line-height:1.5;padding:10px 13px;text-align:left;background:var(--visual-surface);transition:background .16s,border-color .16s}.learning-scene button:hover{border-color:var(--muted)}.learning-scene button.active{background:var(--green);border-color:#617347;color:#29332d}.learning-scene button:focus-visible,.age-slider input:focus-visible{outline:2px solid var(--ink);outline-offset:4px}.season-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:10px 0 22px}.season-steps button{text-align:center;padding:12px 4px;font-size:12px}.season-dot{display:block;width:6px;height:6px;border-radius:50%;background:var(--muted);margin:0 auto 8px}.active .season-dot{background:currentColor}.bottle-phases{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:18px 0}.bottle-phases button{display:flex;gap:14px;align-items:center}.bottle-phases button>span{font-size:10px;color:inherit}.age-readout{display:flex;gap:16px;align-items:center;padding:24px 0 16px}.age-readout strong{font:600 58px/1 Manrope,sans-serif;letter-spacing:-3px}.age-readout span{font-size:12px;line-height:1.6;color:var(--muted)}.age-slider{display:block;padding:8px 0}.age-slider>span{font-size:12px;font-weight:600}.age-slider input{width:100%;accent-color:var(--dark);min-height:44px;margin:0}.age-labels{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:8px 0 22px}.age-labels button{font-size:10px;padding:10px 7px;overflow-wrap:anywhere}.age-labels span{display:block;font-size:11px;font-weight:700;margin-bottom:4px}.port-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:22px 0}.port-grid button{text-align:center;padding:12px 7px}.port-grid strong,.port-grid small{display:block}.port-grid small{font-size:9px;margin-top:4px}.learning-scene p{overflow-wrap:anywhere}
 @media(max-width:520px){.learning-scene .visual-explanation{min-height:190px}.season-steps{gap:4px}.season-steps button{font-size:11px}.scene-choices{gap:6px}.scene-choices button{font-size:12px;padding:10px}.bottle-phases button{font-size:12px;padding:10px;gap:10px}.age-labels,.port-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.age-labels button{font-size:12px;padding:11px}.port-grid small{font-size:10px}.learning-scene .visual-caption{font-size:11px}}
 @media(prefers-reduced-motion:reduce){.learning-scene *{animation:none!important;transition:none!important}}
</style>
