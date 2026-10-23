<script lang="ts">
 import {t} from '#lib/i18n.ts';
 import {onMount,onDestroy} from 'svelte';import Icon from './Icon.svelte';import {aromaChoices} from '#lib/content.ts';import {session,refreshSession,saveNoteDraft,syncPendingNotes,noteSync} from '#lib/client.svelte.ts';
 let {room,wine,hint,onEdit}:{room:string;wine:string;hint:string;onEdit?:()=>void}=$props();
 let form=$state({text:'',aromas:[] as string[],rating:0,sweetness:0,acidity:0});let ready=$state(false);let edited=$state(false);let timer:ReturnType<typeof setTimeout>;let destroyed=false;let initializing=$state(false);
 const pending=$derived(!!session.notes.find(n=>n.room===room&&n.wine===wine)?.pending);
 const status=$derived(!ready?t('notes.loading'):pending?(noteSync.syncing?t('notes.saving'):noteSync.error?t('notes.retryLater'):t('notes.local')):edited?t('notes.saved'):t('notes.autosave'));
 function changed(){if(!ready)return;onEdit?.();edited=true;saveNoteDraft(room,wine,$state.snapshot(form));clearTimeout(timer);timer=setTimeout(syncPendingNotes,650);}
 function aroma(a:string){form.aromas=form.aromas.includes(a)?form.aromas.filter(x=>x!==a):[...form.aromas,a];changed();}
 async function initialize(){if(initializing||ready)return;initializing=true;try{if(!session.loaded||!session.draftOwner)await refreshSession();if(destroyed||!session.draftOwner)return;const existing=session.notes.find(n=>n.room===room&&n.wine===wine);if(existing){form={...form,...existing.data};edited=true;}ready=true;if(pending)void syncPendingNotes();}finally{initializing=false;}}
 onMount(()=>{void initialize();});
 $effect(()=>{if(session.draftOwner&&!ready)void initialize();});
 onDestroy(()=>{destroyed=true;clearTimeout(timer);if(typeof window!=='undefined')void syncPendingNotes();});
</script>
<form class="note-form" aria-busy={!ready&&!session.error} onsubmit={(e)=>{e.preventDefault();void syncPendingNotes();}}>{#if !ready&&session.error}<div class="note-load-error"><p class="error" role="alert">{t('notes.loadError')}</p><button class="button outline" type="button" disabled={initializing} onclick={()=>initialize()}>{t('notes.reload')}</button></div>{/if}{#if !ready&&!session.error}<p class="muted" role="status">{t('notes.loading')}</p>{/if}<fieldset class="note-fields" style:display={!ready?'none':undefined} aria-label="Deine Tasting Notes" disabled={!ready}>
 <p>{hint} {t('m_8c0cfe4922')}</p>
 <div><span class="field-heading">{t('m_71a871c6d8')}<small>{t('m_103167e885')}</small></span><div class="rating-buttons" role="group" aria-label={t('m_4b07f34152')}>{#each [1,2,3,4,5] as rating}<button type="button" class:selected={form.rating>=rating} aria-label={rating+' von 5 Sternen'} aria-pressed={form.rating===rating} onclick={()=>{form.rating=form.rating===rating?0:rating;changed();}}><Icon name="star" size={23}/></button>{/each}</div></div>
 <div><span class="field-heading">{t('m_22f8ead030')}<small>{t('m_0794742dc4')}</small></span><div class="aroma-options">{#each aromaChoices as a}<button type="button" class:selected={form.aromas.includes(a)} aria-pressed={form.aromas.includes(a)} onclick={()=>aroma(a)}>{a}{#if form.aromas.includes(a)} <span aria-hidden="true">✓</span>{/if}</button>{/each}</div></div>
 <label>{t('m_fc15b01dce')}<textarea bind:value={form.text} oninput={changed} rows="4" maxlength="6000" placeholder={t('m_864876a9c8')}></textarea></label>
 <div class="form-grid"><div><label for={'sweet-'+wine}>{t('m_4d850fca5f')}</label><input id={'sweet-'+wine} type="range" min="0" max="5" bind:value={form.sweetness} oninput={changed} aria-valuetext={form.sweetness===0?'Noch nicht eingeschätzt':form.sweetness+' von 5'}/><div class="range-labels"><span>{t('m_3d131180b6')}</span><span>{t('m_747287ef57')}</span></div></div><div><label for={'acid-'+wine}>{t('m_7f5c273874')}</label><input id={'acid-'+wine} type="range" min="0" max="5" bind:value={form.acidity} oninput={changed} aria-valuetext={form.acidity===0?'Noch nicht eingeschätzt':form.acidity+' von 5'}/><div class="range-labels"><span>{t('m_e98e330b35')}</span><span>{t('m_0ae82d177d')}</span></div></div></div>
 <div class="save-status" aria-live="polite"><Icon name={status===t('notes.saved')?'check':'notes'} size={13}/>{status}</div>
 {#if pending&&noteSync.error}<button class="button outline" type="submit">{t('m_9568d7aa34')}</button>{/if}
</fieldset></form>
