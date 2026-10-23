<script lang="ts">
 let{src,alt='',position=$bindable('center center'),positionMobile=$bindable('center center'),fit=$bindable('cover')}:{src:string;alt?:string;position:string;positionMobile:string;fit?:string}=$props();
 let device=$state('desktop');
 const points=[['left top','Oben links'],['center top','Oben mittig'],['right top','Oben rechts'],['left center','Mitte links'],['center center','Mitte'],['right center','Mitte rechts'],['left bottom','Unten links'],['center bottom','Unten mittig'],['right bottom','Unten rechts']];
 const normalize=(p:string)=>p==='top'?'center top':p==='bottom'?'center bottom':p==='center'?'center center':p;
 const active=$derived(normalize(device==='desktop'?position:positionMobile));
 function choose(value:string){if(device==='desktop')position=value;else positionMobile=value;}
</script>
<div class="image-focus">
 <div class="focus-tabs" role="group" aria-label="Vorschaugröße"><button type="button" class:active={device==='desktop'} aria-pressed={device==='desktop'} onclick={()=>device='desktop'}>Desktop</button><button type="button" class:active={device==='mobile'} aria-pressed={device==='mobile'} onclick={()=>device='mobile'}>Mobil</button></div>
 <div class="focus-preview" class:mobile={device==='mobile'}><img {src} {alt} style:object-position={active} style:object-fit={fit}/></div>
 <div class="focus-controls"><div class="focus-grid" role="group" aria-label={'Bildausrichtung für '+(device==='desktop'?'Desktop':'Mobil')}>{#each points as [value,label]}<button type="button" aria-label={label} title={label} class:active={active===value} aria-pressed={active===value} onclick={()=>choose(value)}><span></span></button>{/each}</div><div><strong>{device==='desktop'?'Desktop-Ausschnitt':'Mobiler Ausschnitt'}</strong><p>Wähle den Bereich, der im Bild bleiben soll.</p><label>Darstellung<select bind:value={fit}><option value="cover">Rahmen ausfüllen</option><option value="contain">Bild vollständig zeigen</option></select></label></div></div>
</div>
