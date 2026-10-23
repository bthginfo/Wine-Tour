<script lang="ts">
 let{color='#df9b98',bubbles=0}:{color?:string;bubbles?:number}=$props();const id=$props.id();
</script>
<svg viewBox="0 0 140 205" fill="none" class="diagram-glass" aria-hidden="true">
 <defs><clipPath id={id}><path d="M37 17H103L100 84C99 113 88 129 70 129S41 113 40 84Z"/></clipPath></defs>
 <g clip-path={'url(#'+id+')'}><path d="M32 75Q51 70 70 75T109 75V132H32Z" fill={color} class="glass-liquid"/>{#each Array.from({length:bubbles}) as _,i}<circle class="glass-bubble" cx={50+(i*17)%40} cy={91+(i*13)%28} r={1.3+(i%3)*.4} fill="currentColor" style={'--bubble-x:'+(i%2?2:-2)+'px;--bubble-delay:'+(i*80)+'ms'}/>{/each}</g>
 <path d="M37 17H103L100 84C99 113 88 129 70 129S41 113 40 84Z" stroke="currentColor" stroke-width="2"/><path d="M70 130V188M45 189H95" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M47 30L49 69" stroke="currentColor" stroke-width="1.5" stroke-opacity=".2" stroke-linecap="round"/>
</svg>
