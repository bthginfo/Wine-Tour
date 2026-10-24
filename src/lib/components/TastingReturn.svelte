<script lang="ts">
 import Icon from './Icon.svelte';
 import WineBottle from './WineBottle.svelte';
 import {steps} from '../content';
 import {getWines} from '../editorial.svelte';
 import {tastingWine} from '../tasting-wine';
 import {t} from '../i18n';
 import type {JoinedTasting} from '../tasting-return';
 let {room,otherRooms=[],openJoin}:{room:JoinedTasting;otherRooms?:JoinedTasting[];openJoin:()=>void}=$props();
 const step=$derived(steps[Math.max(0,Math.min(steps.length-1,room.step))]);
 const wines=$derived(getWines());
 const wine=$derived(tastingWine(wines[step.wine],room.settings||{}));
 const destination=(r:JoinedTasting)=>(r.isHost?'/host/':'/tasting/')+r.code;
</script>

<section class="tasting-return" aria-labelledby="tasting-return-title">
 <div class="return-copy">
  <div class="return-status"><span class="return-live"><span></span>{t('home.tastingLive')}</span><span>{t('home.alreadyJoined')}</span></div>
  <h2 id="tasting-return-title">{room.name}</h2>
  <p>{t('home.returnExplanation')}</p>
  <div class="return-wine"><span>{t('home.currentWine')} {step.wine+1} / {wines.length}</span><strong>{wine.name}</strong></div>
  <a href={destination(room)} class="button primary return-primary">{t(room.isHost?'home.returnHost':'home.returnTasting')}<Icon name="right" size={19}/></a>
  <button type="button" class="text-button return-other" onclick={openJoin}><Icon name="qr" size={15}/>{t('home.otherTasting')}</button>
 </div>
 <div class="return-visual" aria-hidden="true"><span class="return-orbit"></span><span class="return-orbit second"></span><WineBottle {wine}/><div class="return-wine-sequence">{#each wines as _,i}<span class:current={i===step.wine}>{String(i+1).padStart(2,'0')}</span>{/each}</div></div>
</section>
{#if otherRooms.length}<details class="return-alternatives"><summary>{otherRooms.length} {t('home.otherOngoingTastings')}<Icon name="next" size={16}/></summary><div>{#each otherRooms as other}<a href={destination(other)}><span>{other.name}</span><Icon name="right" size={17}/></a>{/each}</div></details>{/if}

<style>
 .tasting-return{display:grid;grid-template-columns:minmax(0,1fr) 230px;gap:18px;position:relative;overflow:hidden;border:1px solid var(--line);border-radius:18px;background:var(--visual-surface);margin-bottom:20px}.return-copy{padding:32px 0 30px 34px;position:relative;z-index:1}.return-status{display:flex;align-items:center;flex-wrap:wrap;gap:13px;font-size:10px;color:var(--muted);margin-bottom:15px}.return-live{display:flex;align-items:center;gap:7px;font-weight:700;font-size:9px;letter-spacing:1.1px;color:var(--ink)}.return-live>span{width:6px;height:6px;flex-shrink:0;border-radius:50%;background:#7a9a59;box-shadow:0 0 0 4px #8fa96c19}.tasting-return h2{font-size:28px;line-height:1.35;letter-spacing:-1px;overflow-wrap:anywhere;max-width:24ch}.return-copy>p{font-size:13px;line-height:1.8;color:var(--muted);margin:12px 0 20px;max-width:43ch}.return-wine{display:grid;gap:5px;margin-bottom:24px}.return-wine>span{font-size:10px;letter-spacing:.4px;color:var(--muted)}.return-wine>strong{font-size:14px;line-height:1.6;font-weight:550}.return-primary{min-height:48px;gap:17px}.return-other{display:flex;gap:7px;font-size:11px;min-height:44px;margin-top:6px;color:var(--muted)}.return-visual{display:grid;place-items:center;position:relative;isolation:isolate;align-self:stretch;background:linear-gradient(135deg,transparent,#8ca47712)}.return-visual :global(.product-bottle){width:115px;height:245px;position:relative;z-index:1;border-radius:14px;padding:10px 7px;background:#f8f9f4;filter:drop-shadow(13px 18px 12px #15251a14)}.return-orbit{position:absolute;width:230px;height:230px;border:1px solid var(--line);border-radius:50%;transform:rotate(-25deg) scaleX(.7)}.return-orbit.second{width:290px;height:290px;transform:rotate(25deg) scaleX(.7);opacity:.5}.return-wine-sequence{display:flex;gap:8px;position:absolute;bottom:24px;left:0;right:0;justify-content:center}.return-wine-sequence>span{width:25px;height:25px;display:grid;place-items:center;border-radius:50%;font-size:9px;color:var(--muted)}.return-wine-sequence>.current{background:var(--green);color:#29332d;font-weight:650}.return-alternatives{margin:-3px 0 24px;font-size:12px;color:var(--muted)}.return-alternatives summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:9px;min-height:44px}.return-alternatives summary::-webkit-details-marker{display:none}.return-alternatives[open] summary>:global(svg){transform:rotate(90deg)}.return-alternatives>div{display:grid;gap:7px}.return-alternatives a{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:13px 16px;border:1px solid var(--line);border-radius:9px;color:var(--ink);min-height:48px}.return-alternatives a:hover{background:var(--visual-surface)}
 @media(max-width:1000px){.tasting-return{grid-template-columns:minmax(0,1fr) 150px;gap:0}.return-copy{padding:27px 0 24px 26px}.tasting-return h2{font-size:25px}.return-visual :global(.product-bottle){width:95px;height:218px}.return-orbit{width:190px;height:190px}.return-orbit.second{width:240px;height:240px}}
 @media(max-width:600px){.tasting-return{display:block;border-radius:14px}.return-copy{padding:24px 20px 13px}.return-status{padding-right:35px;gap:9px;font-size:9px}.tasting-return h2{font-size:24px;max-width:19ch;padding-right:28px}.return-copy>p{padding-right:53px;font-size:12px;max-width:none}.return-wine{padding-right:68px;margin-bottom:22px}.return-wine strong{font-size:13px}.return-primary{width:100%;justify-content:space-between;padding:14px 16px;font-size:12px}.return-other{margin-top:6px;font-size:11px;justify-content:center;width:100%}.return-visual{position:absolute;inset:0;display:block;pointer-events:none;background:none;z-index:0}.return-visual :global(.product-bottle){position:absolute;top:93px;right:12px;width:61px;height:136px;padding:6px 5px;opacity:.95}.return-orbit{top:49px;right:-110px;width:235px;height:235px;opacity:.55}.return-orbit.second{top:19px;right:-143px;width:290px;height:290px}.return-wine-sequence{display:none}.return-alternatives{font-size:11px}}
</style>
