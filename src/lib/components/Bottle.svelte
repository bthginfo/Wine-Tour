<script lang="ts">
 import {t} from '#lib/i18n.ts';let {color='#e5afae',label='ROSÉ',small=false}:{color?:string;label?:string;small?:boolean}=$props();</script>
<div class:small class="bottle-art" aria-label={t('m_fa45d4a43e')}>
 <svg viewBox="0 0 100 260" fill="none" aria-hidden="true"><defs><linearGradient id={'glass'+label} x1="20" x2="78"><stop stop-color="#254c3a"/><stop offset=".4" stop-color="#59725a"/><stop offset="1" stop-color="#213d30"/></linearGradient></defs><path d="M39 14h22v65c0 18 20 24 20 45v115q0 10-10 10H29q-10 0-10-10V124c0-21 20-27 20-45z" fill={'url(#glass'+label+')'}/><path d="M38 12q0-4 4-4h16q4 0 4 4v39H38z" fill={color}/><path d="M26 132h48v75H26z" fill="#f3f0e6"/><path d="M30 138h40v3H30z" fill={color}/><path d="M30 197h40v3H30z" fill={color}/><path d="M27 118v-5c0-12 18-22 18-34V59" stroke="#fff" stroke-opacity=".18" stroke-width="3" stroke-linecap="round"/><ellipse cx="50" cy="246" rx="27" ry="3" fill="#10271d" fill-opacity=".5"/></svg>
 <div class="bottle-label"><span class="bottle-flower">✳</span><strong>{label}</strong><span>{t('m_0abf16acd0')}</span></div>
</div>
