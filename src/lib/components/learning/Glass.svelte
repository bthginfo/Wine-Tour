<script lang="ts">
 import {wineGlassSvg} from '#lib/illustration-art.ts';
 let{color='#df9b98',bubbles=0}:{color?:string;bubbles?:number}=$props();const id=$props.id();
</script>
{@html wineGlassSvg(color,bubbles,id)}
