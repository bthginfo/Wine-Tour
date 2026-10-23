<script lang="ts">
 import{tick}from'svelte';import Icon from'./Icon.svelte';import{t}from'../i18n';import{session}from'../client.svelte';import{steps}from'../content';import{getWines,getArticles,imageSrc,creditFor}from'../editorial.svelte';import{makeTastingBook,bookFilename}from'../pdf/model';
 let{room,participant}:{room:{code:string;name:string;settings:Record<string,any>};participant:string}=$props();let busy=$state(false);let progress=$state('');let error=$state('');let finished=$state(false);
 async function download(){if(busy)return;busy=true;error='';finished=false;progress=t('pdf.preparing');await tick();try{
  const renderer=await import('../pdf/render');let notes=session.notes;let draftOwner=session.draftOwner;
  try{const r=await fetch('/api/me',{signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error('Notizen konnten nicht geladen werden.');const latest=await r.json();notes=latest.notes;draftOwner=latest.draftOwner;}catch{if(!session.loaded)throw Error(t('pdf.notesError'));}
  const book=makeTastingBook({room,participant,wines:getWines(),articles:getArticles(),steps,notes,draftOwner,readDraft:key=>localStorage.getItem(key),imageSrc,creditFor});const result=await renderer.renderTastingPdf(book,message=>progress=message);
  const url=URL.createObjectURL(new Blob([result.bytes as BlobPart],{type:'application/pdf'}));const a=document.createElement('a');a.href=url;a.download=bookFilename(book);document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);finished=true;progress=result.missingImages?t('pdf.imageWarning'):t('pdf.ready');
 }catch(e){error=e instanceof Error&&e.message.startsWith('Diese PDF ist zu umfangreich')?e.message:t('pdf.errorHelp');progress='';}finally{busy=false;}}
</script>
<section class="tasting-pdf" aria-labelledby="tasting-pdf-title">
 <div class="pdf-book-preview" aria-hidden="true"><span>sip happens.</span><strong>Dein<br/>Weinabend.</strong><small>WEINE · WISSEN · NOTIZEN</small><div><i></i><i></i><i></i></div></div>
 <div class="pdf-download-copy"><span class="eyebrow">{t('pdf.eyebrow')}</span><h3 id="tasting-pdf-title">{t('pdf.title')}</h3><p>{t('pdf.description')}</p><button type="button" class="button primary" disabled={busy} aria-busy={busy} onclick={download}><Icon name={busy?'loader':finished?'check':'download'} size={18}/>{busy?t('pdf.preparing'):t('pdf.download')}</button><p class="pdf-download-status" role="status" aria-live="polite">{progress||t('pdf.noAccount')}</p>{#if error}<p class="error" role="alert">{t('pdf.error')} {error}</p>{/if}</div>
</section>
