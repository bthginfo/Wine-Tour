<script lang="ts">
 let {latitude,longitude,label,compact=false}:{latitude:number;longitude:number;label:string;compact?:boolean}=$props();
 const x=$derived(longitude+180);const y=$derived(90-latitude);const span=$derived(compact?70:48);
 const view=$derived(`${x-span/2} ${Math.max(0,Math.min(180-span*.64,y-span*.32))} ${span} ${span*.64}`);
</script>
<div class="atlas-map" class:compact>
 <svg viewBox={view} role="img" aria-label={'Lage von '+label+' im geografischen Überblick'}>
  <g class="atlas-land">{#each [-360,0,360] as offset}<use href="/images/atlas/world-land.svg#world-land" transform={'translate('+offset+' 0)'} vector-effect="non-scaling-stroke"/>{/each}</g>
  <circle cx={x} cy={y} r={span*.055} class="atlas-map-halo"/>
  <circle cx={x} cy={y} r={span*.014} class="atlas-map-pin"/>
  <circle cx={x} cy={y} r={span*.006} fill="var(--visual-surface)"/>
 </svg>
</div>
