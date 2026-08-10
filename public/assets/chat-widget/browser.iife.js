// "use strict";var ChatWidget=(()=>{var qe=Object.defineProperty;var Sn=Object.getOwnPropertyDescriptor;var Tn=Object.getOwnPropertyNames;var En=Object.prototype.hasOwnProperty;var In=(e,t)=>{for(var a in t)qe(e,a,{get:t[a],enumerable:!0})},Rn=(e,t,a,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Tn(t))!En.call(e,r)&&r!==a&&qe(e,r,{get:()=>t[r],enumerable:!(n=Sn(t,r))||n.enumerable});return e};var zn=e=>Rn(qe({},"__esModule",{value:!0}),e);var aa={};In(aa,{browserGlobal:()=>Xt,createChatWidget:()=>Ie,init:()=>Yt,version:()=>Kt});function It(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function Ve(e,t){let a={...e};for(let n of Object.keys(t)){let r=t[n],p=a[n];if(It(p)&&It(r)){a[n]=Ve(p,r);continue}r!==void 0&&(a[n]=r)}return a}function Rt(e){return e instanceof Error?e:typeof e=="string"?new Error(e):new Error("Unexpected widget error")}function ue(e,t){return`${e.replace(/\/$/,"")}/${t.replace(/^\//,"")}`}function Z(e,t,a){return{"Content-Type":"application/json",...e.customHeaders,...a?{"X-Chat-User-Context":a}:{},...t?{Authorization:`Bearer ${t}`}:{}}}async function _(e){if(!e.getUserContext)return null;let t=await e.getUserContext();return t?JSON.stringify(t):null}function Q(e,t,a={}){let n=t.replace(/\{chatId\}/g,encodeURIComponent(a.chatId??"")).replace(/:chatId\b/g,encodeURIComponent(a.chatId??""));return ue(e.apiBaseUrl,n)}async function $(e,t){let a=`Failed to ${t}. Please try again.`;e.status===400?a="Invalid request. Please check your input and try again.":e.status===401?a="Authentication failed. Please log in again.":e.status===403?a="You do not have permission to perform this action.":e.status===404?a="The requested resource was not found.":e.status===429?a="Too many requests. Please wait a moment and try again.":e.status>=500&&(a="The server is currently experiencing issues. Please try again later.");try{let n=await e.json();n&&typeof n=="object"&&(typeof n.message=="string"?a=n.message:typeof n.error=="string"&&(a=n.error))}catch{}throw new Error(a)}async function zt(e,t){let a=e.getAccessToken?await e.getAccessToken():null,n=await _(e),r=Q(e,e.endpoints.ask,{chatId:t.chatId}),p={message:t.message,query:t.message,chat_id:t.chatId,knowledgeNames:t.knowledgeNames,knowledge_names:t.knowledgeNames,editLastQa:t.editLastQa??!1,edit_last_qa:t.editLastQa??!1,enableReferences:t.enableReferences??!0,enable_references:t.enableReferences??!0},s=await fetch(r,{method:"POST",headers:Z(e,a,n),body:JSON.stringify(p)});s.ok||await $(s,"send message");let d=s.body?.getReader(),u="";if(d)for(;;){let{done:T,value:E}=await d.read();if(T)break;E&&(u+=new TextDecoder("utf-8").decode(E,{stream:!0}))}else u=await s.text();let c;try{c=JSON.parse(u)}catch{return{chatId:t.chatId,answer:u,suggestions:[],citations:[]}}if(!Array.isArray(c)){if(!c.answer||typeof c.answer!="string")throw new Error("Chat backend response is missing a valid answer.");return{chatId:c.chatId??t.chatId,answer:c.answer,suggestions:c.suggestions??[],citations:c.citations??[]}}let g=c[0];if(!g?.answer||typeof g.answer!="string")throw new Error("Chat backend response is missing a valid answer.");let f=g.content,m=f?.source_documents??[],A=f?.scores??[],S=f?.page_numbers??[],y=f?.sheet_names??[],L=f?.row_numbers??[],w=f?.knowledge_names??[],V=m.map((T,E)=>({sourceDocument:T,score:A[E]??null,pageNumber:S[E]??null,sheetName:y[E]??null,rowNumber:L[E]??null,knowledgeName:w[E]??null}));return{chatId:t.chatId,answer:g.answer,suggestions:[],citations:V}}async function Ht(e,t){if(!e.endpoints.history)return[];let a=e.getAccessToken?await e.getAccessToken():null,n=await _(e),p=/(\{chatId\}|:chatId\b)/.test(e.endpoints.history)?Q(e,e.endpoints.history,{chatId:t}):(()=>{let c=new URL(ue(e.apiBaseUrl,e.endpoints.history));return c.searchParams.set("chat_id",t),c.toString()})(),s=await fetch(p,{method:"GET",headers:Z(e,a,n)});s.ok||await $(s,"fetch chat history");let d=await s.json(),u=Array.isArray(d)?d:d&&typeof d=="object"?d.history??d.messages??d.data??[]:[];return Array.isArray(u)?u.map(c=>{if(!c||typeof c!="object")return null;let g=c;if(typeof g.question=="string"&&typeof g.answer=="string")return[{role:"user",text:g.question},{role:"assistant",text:g.answer}];let f=g.role??g.type??g.sender??g.author,m=g.text??g.message??g.content??g.answer;if(typeof m!="string")return null;let A=typeof f=="string"?f.toLowerCase():"assistant";return[{role:A==="user"||A==="human"?"user":"assistant",text:m,...Array.isArray(g.citations)?{citations:g.citations}:{},...typeof g.isLike=="boolean"?{isLike:g.isLike}:{}}]}).flat().filter(c=>!!c):[]}async function Mt(e){if(!e.endpoints.listChats)return[];let t=e.getAccessToken?await e.getAccessToken():null,a=await _(e),n=await fetch(ue(e.apiBaseUrl,e.endpoints.listChats),{method:"GET",headers:Z(e,t,a)});n.ok||await $(n,"fetch chats");let r=await n.json(),p=Array.isArray(r)?r:r&&typeof r=="object"?r.chats??r.data??r.items??[]:[];return Array.isArray(p)?p.map(s=>{if(!s||typeof s!="object")return null;let d=s,u=d.chatId??d.chat_id??d.id,c=d.title??d.name??d.chatId;if(typeof u!="string"||typeof c!="string")return null;let g=typeof d.createdAt=="string"?d.createdAt:typeof d.created_at=="string"?d.created_at:null,f=typeof d.updatedAt=="string"?d.updatedAt:typeof d.updated_at=="string"?d.updated_at:null,m={chatId:u,title:c,pinned:typeof d.pinned=="boolean"?d.pinned:!1};return g&&(m.createdAt=g),f&&(m.updatedAt=f),m}).filter(s=>!!s):[]}async function Ut(e,t,a){let n=e.endpoints.createChat??e.endpoints.listChats;if(!n)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await _(e),s=await fetch(ue(e.apiBaseUrl,n),{method:"POST",headers:Z(e,r,p),body:JSON.stringify({chatId:t,chat_id:t,...a?{title:a}:{}})});s.ok||await $(s,"create chat")}async function Ke(e,t,a){if(!e.endpoints.updateChat)return;let n=e.getAccessToken?await e.getAccessToken():null,r=await _(e),p=Q(e,e.endpoints.updateChat,{chatId:t}),s=await fetch(p,{method:"PUT",headers:Z(e,n,r),body:JSON.stringify(a)});s.ok||await $(s,"update chat")}async function $t(e,t){if(!e.endpoints.deleteChat)return;let a=e.getAccessToken?await e.getAccessToken():null,n=await _(e),r=Q(e,e.endpoints.deleteChat,{chatId:t}),p=await fetch(r,{method:"DELETE",headers:Z(e,a,n)});p.ok||await $(p,"delete chat")}function F(e,t){let a=Rt(t);return e.onError?.(a),a}async function ge(e,t,a,n){if(!e.endpoints.feedback)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await _(e),s=Q(e,e.endpoints.feedback,{chatId:t}),d=await fetch(s,{method:"POST",headers:Z(e,r,p),body:JSON.stringify({message:a,isLike:n})});d.ok||await $(d,"submit feedback")}async function Nt(e,t){if(!e.endpoints.upload)throw new Error("Upload endpoint is not configured.");let a=e.getAccessToken?await e.getAccessToken():null,n=await _(e),r=Q(e,e.endpoints.upload),p=typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`kp-src-${Date.now()}-${Math.random().toString(36).slice(2,10)}`,s=new FormData;s.append("source_uuid",p),s.append("file",t),s.append("organizations","string"),s.append("functional_topics","string"),s.append("content_type","string"),s.append("publication_date","string"),s.append("arabic_title","string"),s.append("confidentiality","Secret"),s.append("english_title","string"),s.append("external_document_id","string"),s.append("external_organizations","string"),s.append("external_contributors","string"),s.append("geographic_classification","string"),s.append("validity_period","0"),s.append("primary_contact_person","string"),s.append("arabic_summary","string"),s.append("callback_url","string"),s.append("vision_2030_alignment","string"),s.append("english_summary","string"),s.append("contributors","string"),s.append("tags","string"),s.append("thematic_topics","string"),s.append("file_language","string");let d={...e.customHeaders,...n?{"X-Chat-User-Context":n}:{},...a?{Authorization:`Bearer ${a}`}:{}},u=await fetch(r,{method:"POST",headers:d,body:s});if(u.ok||await $(u,"upload file"),p&&e.endpoints.index){let g=Q(e,e.endpoints.index),f=await fetch(g,{method:"POST",headers:{...d,"Content-Type":"application/json"},body:JSON.stringify({callback_url:"https://example.com/",source_uuid:p,force_reindex:!1})});f.ok||await $(f,"index file")}let c={source_uuid:p};try{c={...c,...await u.json()}}catch{}return c}var Ye={accent:"#0f766e",accentSoft:"#ecfeff",panelBackground:"#ffffff",surfaceBackground:"#f8fafc",text:"#1f2937",mutedText:"#64748b",borderColor:"#dbe4ee",shadow:"0 24px 64px rgba(15, 23, 42, 0.20)",zIndex:2147483e3,fontFamily:'"Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif'},C={displayMode:"widget",position:"bottom-right",title:"Knowledge Assistant",subtitle:"Answers are generated based on your access permissions",welcomeMessage:"How can I assist you today?",inputPlaceholder:"Ask your question...",launcherAriaLabel:"Open chat assistant",closeAriaLabel:"Close chat assistant",initialSuggestions:["Which indicators reflect the achievements of Vision KSA goals?","Case studies of real estate initiatives for economic growth","Study of UX for the ministry external portal"],sourceApp:"knowledge-platform",locale:"en",customHeaders:{},assistantPageUrl:"/knowledge-assistant",embedded:{showHeader:!1},rag:{knowledgeNames:[],enableReferences:!0,loadHistoryOnOpen:!1},theme:Ye,getAccessToken:void 0,getUserContext:void 0,onOpen:void 0,onClose:void 0,onError:void 0,onOpenAssistantPage:void 0,assistantAvatarUrl:""};function Bt(e){if(!e.apiBaseUrl?.trim())throw new Error("Chat widget config requires a non-empty apiBaseUrl.");if(!e.endpoints?.ask?.trim())throw new Error("Chat widget config requires endpoints.ask to be provided.");let t=e.mount??document.body,a=Ve(Ye,e.theme??{});return{apiBaseUrl:e.apiBaseUrl,endpoints:{...e.endpoints},mount:t,assistantAvatarUrl:e.assistantAvatarUrl??C.assistantAvatarUrl,displayMode:e.displayMode??C.displayMode,position:e.position??C.position,title:e.title??C.title,subtitle:e.subtitle??C.subtitle,welcomeMessage:e.welcomeMessage??C.welcomeMessage,inputPlaceholder:e.inputPlaceholder??C.inputPlaceholder,launcherAriaLabel:e.launcherAriaLabel??C.launcherAriaLabel,closeAriaLabel:e.closeAriaLabel??C.closeAriaLabel,initialSuggestions:e.initialSuggestions??C.initialSuggestions,sourceApp:e.sourceApp??C.sourceApp,locale:e.locale??C.locale,customHeaders:e.customHeaders??C.customHeaders,embedded:{...C.embedded,...e.embedded??{}},rag:{...C.rag,...e.rag??{}},assistantPageUrl:e.assistantPageUrl??C.assistantPageUrl,theme:a,getAccessToken:e.getAccessToken,getUserContext:e.getUserContext,onOpen:e.onOpen,onClose:e.onClose,onError:e.onError,onOpenAssistantPage:e.onOpenAssistantPage}}function o(e,t,a){let n=document.createElement(e);return t&&(n.className=t),a!==void 0&&(n.textContent=a),n}var Ot="kp-chat-widget-styles";function Dt(e,t){if(e.getElementById(Ot))return;let a=document.createElement("style");a.id=Ot,a.textContent=Hn(t),e.appendChild(a)}function Hn(e){return`
//     :host {
//       all: initial;
//     }

//     .kp-chat-widget {
//       --kp-accent: ${e.accent};
//       --kp-accent-soft: ${e.accentSoft};
//       --kp-panel-background: ${e.panelBackground};
//       --kp-surface-background: ${e.surfaceBackground};
//       --kp-text: ${e.text};
//       --kp-muted-text: ${e.mutedText};
//       --kp-border-color: ${e.borderColor};
//       --kp-shadow: ${e.shadow};
//       --kp-z-index: ${e.zIndex};
//       --kp-font-family: ${e.fontFamily};
//       --kp-card-background: rgba(255, 255, 255, 0.92);
//       --kp-soft-highlight: rgba(236, 254, 255, 0.82);
//       position: fixed;
//       bottom: 24px;
//       right: 24px;
//       z-index: var(--kp-z-index);
//       font-family: var(--kp-font-family);
//       color: var(--kp-text);
//       box-sizing: border-box;
//     }

//     .kp-chat-widget.kp-chat-widget-embedded {
//       position: relative;
//       inset: auto;
//       width: 100%;
//       height: 100%;
//       min-height: 640px;
//       display: block;
//     }

//     *,
//     *::before,
//     *::after {
//       box-sizing: border-box;
//       font-family: inherit;
//     }

//     .kp-chat-widget.bottom-left {
//       left: 24px;
//       right: auto;
//     }

//     .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
//       left: auto;
//       right: auto;
//     }

//     .kp-rtl .kp-dropdown-item,
//     .kp-rtl .kp-suggestion,
//     .kp-rtl .kp-input,
//     .kp-rtl .kp-full-page-search-input,
//     .kp-rtl .kp-bubble-content,
//     .kp-rtl .kp-source-card,
//     .kp-rtl .kp-source-panel {
//       text-align: right;
//     }

//     .kp-launcher {
//       width: 72px;
//       height: 72px;
//       border: none;
//       border-radius: 999px;
//       cursor: pointer;
//       background: radial-gradient(circle at 30% 30%, #f8fffe 0%, #ecfdf5 52%, #d6f4ef 100%);
//       box-shadow: 0 16px 32px rgba(15, 118, 110, 0.18);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease;
//       color: var(--kp-accent);
//       position: relative;
//       overflow: hidden;
//     }

//     .kp-launcher:hover {
//       transform: translateY(-1px);
//       box-shadow: 0 20px 36px rgba(15, 118, 110, 0.22);
//     }

//     .kp-launcher:focus-visible,
//     .kp-close:focus-visible,
//     .kp-send:focus-visible,
//     .kp-suggestion:focus-visible,
//     .kp-input:focus-visible,
//     .kp-full-page-new-chat:focus-visible,
//     .kp-full-page-close:focus-visible,
//     .kp-full-page-chat-item:focus-visible,
//     .kp-chat-pin:focus-visible,
//     .kp-message-action:focus-visible,
//     .kp-source-chip:focus-visible,
//     .kp-source-panel-close:focus-visible {
//       outline: 2px solid var(--kp-accent);
//       outline-offset: 2px;
//     }

//     .kp-launcher.hidden {
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(8px) scale(0.96);
//     }

//     .kp-star-cluster {
//       position: relative;
//       width: 50px;
//       height: 50px;
//       animation: kp-cluster-rotate 8.5s linear infinite;
//     }

//     .kp-star {
//       position: absolute;
//       color: #08384c;
//       line-height: 1;
//       transform-origin: center;
//     }

//     .kp-star.main {
//       top: 50%;
//       left: 50%;
//       font-size: 30px;
//       transform: translate(-50%, -50%) scale(0.96);
//       animation: kp-main-pulse 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-a {
//       top: -3px;
//       left: 50%;
//       font-size: 18px;
//       transform: translateX(-50%);
//       animation: kp-orbit-a 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-b {
//       right: -3px;
//       bottom: 5px;
//       font-size: 18px;
//       animation: kp-orbit-b 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-c {
//       left: -1px;
//       bottom: 5px;
//       font-size: 18px;
//       animation: kp-orbit-c 3s ease-in-out infinite;
//     }

//     .kp-overlay {
//       position: fixed;
//       inset: 0;
//       background: rgba(15, 23, 42, 0.18);
//       opacity: 0;
//       pointer-events: none;
//       transition: opacity 220ms ease;
//     }

//     .kp-overlay.visible {
//       opacity: 1;
//       pointer-events: auto;
//     }

//     .kp-panel {
//       position: fixed;
//       bottom: 88px;
//       right: 24px;
//       width: min(480px, calc(100vw - 48px));
//       height: min(730px, calc(100vh - 118px));
//       background: var(--kp-panel-background);
//       border: 1px solid rgba(255, 255, 255, 0.35);
//       border-radius: 24px;
//       box-shadow: var(--kp-shadow);
//       overflow: hidden;
//       display: flex;
//       flex-direction: column;
//       opacity: 0;
//       transform: translateX(112px) scale(0.97);
//       transform-origin: bottom right;
//       pointer-events: none;
//       transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
//         transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
//     }

//     .kp-chat-widget.bottom-left .kp-panel {
//       left: 24px;
//       right: auto;
//       transform: translateX(-112px) scale(0.97);
//       transform-origin: bottom left;
//     }

//     .kp-chat-widget .kp-panel.open,
//     .kp-chat-widget.bottom-left .kp-panel.open {
//       opacity: 1;
//       transform: translateX(0) scale(1);
//       pointer-events: auto;
//     }

//     .kp-full-page {
//       position: fixed;
//       inset: 0;
//       background: #ffffff;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(18px);
//       transition: opacity 260ms ease, transform 320ms ease;
//       z-index: calc(var(--kp-z-index) + 2);
//       overflow: hidden;
//     }

//     .kp-full-page.kp-full-page-embedded {
//       position: relative;
//       inset: auto;
//       opacity: 1;
//       pointer-events: auto;
//       transform: none;
//       min-height: 100%;
//       height: 100%;
//       z-index: auto;
//       background: transparent;
//     }

//     .kp-full-page.open {
//       opacity: 1;
//       pointer-events: auto;
//       transform: translateY(0);
//     }

//     .kp-full-page-shell {
//       height: 100vh;
//       display: flex;
//       flex-direction: column;
//       padding: 22px 28px 26px;
//       gap: 16px;
//       overflow: hidden;
//     }

//     .kp-full-page-embedded .kp-full-page-shell {
//       height: 100%;
//       min-height: 100%;
//       padding: 0;
//       gap: 12px;
//     }

//     .kp-full-page-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 16px;
//       padding: 8px 4px 0;
//       flex: none;
//     }

//     .kp-hidden {
//       display: none !important;
//     }

//     .kp-full-page-brand {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       color: #08384c;
//     }

//     .kp-full-page-brand-mark {
//       width: 44px;
//       height: 44px;
//       border-radius: 14px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: linear-gradient(135deg, rgba(37, 181, 192, 0.14), rgba(15, 118, 110, 0.08));
//       font-size: 26px;
//       box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
//     }

//     .kp-full-page-brand-text {
//       font-size: 20px;
//       font-weight: 700;
//       letter-spacing: -0.02em;
//       color: #16394b;
//     }

//     .kp-full-page-header-actions {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//     }

//     .kp-full-page-badge {
//       padding: 10px 14px;
//       border-radius: 999px;
//       font-size: 13px;
//       line-height: 1;
//       color: #0b556c;
//       background: rgba(255, 255, 255, 0.82);
//       border: 1px solid rgba(15, 118, 110, 0.12);
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//     }

//     .kp-full-page-close,
//     .kp-source-panel-close {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 14px;
//       background: rgba(255, 255, 255, 0.82);
//       color: #61788a;
//       font-size: 24px;
//       line-height: 1;
//       cursor: pointer;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//     }

//     .kp-full-page-content {
//       display: grid;
//       grid-template-columns: 290px minmax(0, 1fr) minmax(0, 0);
//       gap: 16px;
//       flex: 1;
//       min-height: 0;
//       overflow: hidden;
//       align-items: stretch;
//     }

//     .kp-full-page-embedded .kp-full-page-content {
//       height: 100%;
//     }

//     .kp-full-page-sidebar,
//     .kp-full-page-panel,
//     .kp-source-panel {
//       border-radius: 24px;
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       background: rgba(255, 255, 255, 0.88);
//       box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
//       backdrop-filter: blur(12px);
//     }

//     .kp-full-page-sidebar {
//       padding: 18px;
//       display: flex;
//       flex-direction: column;
//       gap: 16px;
//       min-height: 0;
//       overflow: auto;
//     }

//     .kp-full-page-new-chat {
//       width: 100%;
//       height: 48px;
//       border: none;
//       border-radius: 12px;
//       background: linear-gradient(135deg, #0a465d 0%, #0f6a75 100%);
//       color: #ffffff;
//       font-size: 16px;
//       font-weight: 600;
//       cursor: pointer;
//       box-shadow: 0 14px 30px rgba(10, 70, 93, 0.18);
//     }

//     .kp-full-page-search {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       height: 44px;
//       border-radius: 12px;
//       border: 1px solid rgba(203, 213, 225, 0.95);
//       background: #ffffff;
//       padding: 0 12px;
//     }

//     .kp-full-page-search-input {
//       flex: 1;
//       border: none;
//       outline: none;
//       background: transparent;
//       color: #334155;
//       font-size: 14px;
//       min-width: 0;
//       box-shadow: none;
//     }

//     .kp-full-page-search-input:focus,
//     .kp-full-page-search-input:focus-visible,
//     .kp-full-page-search-input:active {
//       outline: none;
//       box-shadow: none;
//       border: none;
//     }

//     .kp-full-page-search-icon {
//       color: #607082;
//       font-size: 20px;
//       line-height: 1;
//     }

//     .kp-full-page-section-label {
//       font-size: 12px;
//       line-height: 1.4;
//       text-transform: uppercase;
//       letter-spacing: 0.08em;
//       color: #8a98a6;
//       margin-top: 4px;
//     }

//     .kp-full-page-recent-list,
//     .kp-full-page-pinned-list {
//       display: flex;
//       flex-direction: column;
//       gap: 8px;
//     }

//     .kp-full-page-item {
//       padding: 12px 12px 13px;
//       border-radius: 14px;
//       color: #293845;
//       font-size: 15px;
//       line-height: 1.5;
//       background: rgba(247, 250, 252, 0.9);
//       border: 1px solid rgba(219, 228, 238, 0.88);
//     }

//     .kp-full-page-chat-item {
//       position: relative;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 10px;
//       cursor: pointer;
//       transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;
//       overflow: visible;
//     }

//     .kp-full-page-chat-item:hover {
//       border-color: rgba(15, 118, 110, 0.34);
//       background: rgba(240, 253, 250, 0.95);
//       transform: translateY(-1px);
//     }

//     .kp-full-page-chat-item.active {
//       border-color: rgba(15, 118, 110, 0.5);
//       background: rgba(220, 252, 231, 0.72);
//     }

//     .kp-full-page-chat-item.menu-open {
//       z-index: 4;
//     }

//     .kp-full-page-item-title {
//       min-width: 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       flex: 1;
//     }

//     .kp-chat-pin {
//       flex: none;
//       border: none;
//       background: transparent;
//       color: #0f6a75;
//       font-size: 16px;
//       line-height: 1;
//       padding: 0;
//       cursor: pointer;
//     }

//     .kp-full-page-empty {
//       padding: 8px 4px 0;
//       color: #7a8a99;
//       font-size: 14px;
//       line-height: 1.5;
//     }

//     .kp-full-page-main {
//       min-width: 0;
//       min-height: 0;
//       display: flex;
//     }

//     .kp-full-page-panel {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       min-height: 0;
//       overflow: hidden;
//     }

//     .kp-source-panel {
//       min-width: 0;
//       min-height: 0;
//       overflow: hidden;
//       display: none;
//       flex-direction: column;
//     }

//     .kp-source-panel.open {
//       display: flex;
//     }

//     .kp-full-page-content:has(.kp-source-panel.open) {
//       grid-template-columns: 290px minmax(0, 1fr) 320px;
//     }

//     .kp-source-panel-header {
//       display: flex;
//       align-items: flex-start;
//       justify-content: space-between;
//       gap: 12px;
//       padding: 18px 18px 12px;
//       border-bottom: 1px solid rgba(219, 228, 238, 0.7);
//     }

//     .kp-source-panel-title {
//       font-size: 17px;
//       font-weight: 700;
//       color: #16394b;
//     }

//     .kp-source-panel-subtitle {
//       margin-top: 4px;
//       font-size: 12px;
//       color: #7a8a99;
//     }

//     .kp-source-panel-list {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       padding: 16px;
//       overflow: auto;
//     }

//     .kp-source-panel-empty {
//       color: #7a8a99;
//       font-size: 14px;
//       line-height: 1.5;
//     }

//     .kp-source-card {
//       width: 100%;
//       text-align: left;
//       cursor: pointer;
//       appearance: none;
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       border-radius: 16px;
//       background: #ffffff;
//       padding: 14px;
//     }

//     .kp-source-card-media {
//       display: flex;
//       align-items: center;
//       margin-bottom: 10px;
//     }

//     .kp-source-thumb,
//     .kp-source-thumb-large {
//       flex: none;
//       width: 32px;
//       height: 32px;
//       border-radius: 999px;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       background: linear-gradient(180deg, #eefcf8 0%, #dff7f2 100%);
//       border: 1px solid rgba(15, 118, 110, 0.18);
//       color: #0f6a75;
//       font-size: 14px;
//       line-height: 1;
//       box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
//     }

//     .kp-source-thumb-large {
//       width: 42px;
//       height: 42px;
//       font-size: 18px;
//     }

//     .kp-source-card-title {
//       font-size: 14px;
//       font-weight: 700;
//       color: #16394b;
//       word-break: break-word;
//     }

//     .kp-source-card-meta {
//       margin-top: 8px;
//       font-size: 12px;
//       line-height: 1.5;
//       color: #667a8d;
//       word-break: break-word;
//     }

//     .kp-full-page-body {
//       flex: 1;
//       overflow: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 14px;
//       padding: 42px 28px 18px;
//       background: #ffffff;
//       scroll-behavior: smooth;
//     }

//     .kp-full-page-body.kp-conversation-active {
//       padding-top: 24px;
//     }

//     .kp-full-page-hero {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       text-align: center;
//       gap: 22px;
//       padding: 18px 18px 12px;
//       max-width: 880px;
//       width: 100%;
//       margin: 0 auto;
//     }

//     .kp-full-page-hero-badge {
//       width: 140px;
//       height: 140px;
//       border-radius: 999px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: radial-gradient(circle at 30% 30%, #f8fdff 0%, #edf8ff 50%, #e4eef8 100%);
//       box-shadow:
//         inset 0 2px 0 rgba(255, 255, 255, 0.9),
//         0 22px 40px rgba(15, 23, 42, 0.08);
//     }

//     .kp-star-cluster-static {
//       animation: none;
//     }

//     .kp-full-page-hero-text {
//       max-width: 760px;
//       font-size: 26px;
//       line-height: 1.5;
//       font-weight: 700;
//       letter-spacing: -0.03em;
//       color: #374151;
//     }

//     .kp-full-page-suggestions {
//       width: min(520px, 100%);
//       margin: auto auto 0;
//     }

//     .kp-full-page-footer {
//       flex: none;
//       padding: 0 16px 18px;
//       background: rgba(255, 255, 255, 0.72);
//       border-top: 1px solid rgba(219, 228, 238, 0.75);
//     }

//     .kp-full-page-form {
//       max-width: none;
//       min-height: 56px;
//       border-radius: 16px;
//     }

//     .kp-full-page-note {
//       font-size: 13px;
//       margin-top: 10px;
//     }

//     .kp-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       gap: 12px;
//       padding: 18px 18px 8px;
//       background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
//     }

//     .kp-toolbar {
//       position: relative;
//       display: flex;
//       align-items: center;
//       gap: 8px;
//     }

//     .kp-tool-button {
//       width: 36px;
//       height: 36px;
//       border: none;
//       border-radius: 12px;
//       background: transparent;
//       color: #0f4f68;
//       cursor: pointer;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       padding: 0;
//       transition: background 140ms ease;
//     }

//     .kp-tool-button:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-pencil-icon {
//       width: 22px;
//       height: 22px;
//       position: relative;
//       display: inline-block;
//     }

//     .kp-pencil-icon::before {
//       content: "";
//       position: absolute;
//       width: 14px;
//       height: 2.5px;
//       background: currentColor;
//       border-radius: 999px;
//       transform: rotate(-45deg);
//       top: 3px;
//       right: 1px;
//     }

//     .kp-pencil-icon::after {
//       content: "";
//       position: absolute;
//       left: 2px;
//       bottom: 2px;
//       width: 11px;
//       height: 11px;
//       border: 2px solid currentColor;
//       border-radius: 4px;
//     }

//     .kp-chevron {
//       font-size: 13px;
//       color: #66839a;
//       transition: transform 160ms ease;
//       margin-left: -2px;
//     }

//     .kp-menu-trigger.open .kp-chevron {
//       transform: rotate(180deg);
//     }

//     .kp-dropdown {
//       position: absolute;
//       top: 44px;
//       left: 0;
//       width: 184px;
//       background: #ffffff;
//       border: 1px solid rgba(15, 79, 104, 0.12);
//       border-radius: 10px;
//       box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
//       padding: 8px;
//       opacity: 0;
//       transform: translateY(-6px);
//       pointer-events: none;
//       transition: opacity 180ms ease, transform 180ms ease;
//       z-index: 2;
//     }

//     .kp-rtl .kp-dropdown {
//       left: auto;
//       right: 0;
//     }

//     .kp-dropdown.open {
//       opacity: 1;
//       transform: translateY(0);
//       pointer-events: auto;
//     }

//     .kp-dropdown-item {
//       width: 100%;
//       border: none;
//       background: transparent;
//       text-align: left;
//       padding: 10px 12px;
//       border-radius: 8px;
//       font-size: 14px;
//       color: var(--kp-text);
//       cursor: pointer;
//     }

//     .kp-dropdown-item:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-title-wrap {
//       display: none;
//     }

//     .kp-close {
//       border: none;
//       background: transparent;
//       font-size: 24px;
//       line-height: 1;
//       color: var(--kp-muted-text);
//       cursor: pointer;
//       padding: 0;
//     }

//     .kp-body {
//       flex: 1;
//       overflow: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       padding: 10px 16px 16px;
//       background: linear-gradient(180deg, #ffffff 0%, var(--kp-surface-background) 100%);
//       scroll-behavior: smooth;
//     }

//     .kp-body.kp-conversation-active {
//       padding-top: 16px;
//     }

//     .kp-panel.kp-sheet-open .kp-body,
//     .kp-panel.kp-sheet-open .kp-footer,
//     .kp-panel.kp-sheet-open .kp-header {
//       opacity: 0;
//       pointer-events: none;
//     }

//     .kp-my-chats-sheet {
//       position: absolute;
//       inset: 0;
//       border-radius: inherit;
//       border: none;
//       background: #ffffff;
//       box-shadow: none;
//       display: none;
//       flex-direction: column;
//       z-index: 3;
//       overflow: hidden;
//     }

//     .kp-my-chats-sheet.open {
//       display: flex;
//     }

//     .kp-my-chats-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       padding: 18px 18px 10px;
//       flex: none;
//       background: #ffffff;
//     }

//     .kp-my-chats-nav {
//       width: 36px;
//       height: 36px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: #61788a;
//       font-size: 22px;
//       line-height: 1;
//       cursor: pointer;
//     }

//     .kp-my-chats-body {
//       flex: 1;
//       overflow: auto;
//       padding: 8px 18px 18px;
//       background: #ffffff;
//     }

//     .kp-my-chats-section-label {
//       font-size: 14px;
//       line-height: 1.5;
//       color: #7a8a99;
//       margin: 14px 0 10px;
//     }

//     .kp-my-chats-list {
//       display: flex;
//       flex-direction: column;
//       gap: 10px;
//     }

//     .kp-chat-actions {
//       position: relative;
//       flex: none;
//     }

//     .kp-chat-actions-trigger {
//       width: 28px;
//       height: 28px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: #526678;
//       font-size: 20px;
//       line-height: 1;
//       cursor: pointer;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//     }

//     .kp-chat-actions-menu {
//       position: absolute;
//       top: 30px;
//       inset-inline-end: 0;
//       width: 120px;
//       padding: 8px;
//       border-radius: 10px;
//       border: 1px solid rgba(219, 228, 238, 0.95);
//       background: #ffffff;
//       box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14);
//       display: none;
//       flex-direction: column;
//       gap: 2px;
//       z-index: 20;
//     }

//     .kp-chat-actions.open .kp-chat-actions-menu {
//       display: flex;
//     }

//     .kp-chat-actions-item {
//       width: 100%;
//       border: none;
//       background: transparent;
//       color: #1f2937;
//       text-align: left;
//       padding: 10px 12px;
//       border-radius: 8px;
//       font-size: 14px;
//       cursor: pointer;
//     }

//     .kp-chat-actions-item:hover {
//       background: rgba(241, 245, 249, 0.95);
//     }

//     .kp-hero {
//       display: flex;
//       gap: 10px;
//       padding: 4px 2px 8px;
//       align-items: flex-start;
//     }

//     .kp-hero-icon {
//       color: #0ea5b7;
//       font-size: 28px;
//       line-height: 1;
//       margin-top: 2px;
//     }

//     .kp-hero-text {
//       font-size: 20px;
//       line-height: 1.45;
//       font-weight: 700;
//       color: #374151;
//     }

//     .kp-message-row {
//       display: flex;
//       align-items: flex-start;
//       gap: 10px;
//       width: 100%;
//     }

//     .kp-message-row.user {
//       justify-content: flex-end;
//     }

//     .kp-avatar {
//       flex: none;
//       width: 36px;
//       height: 36px;
//       border-radius: 999px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 13px;
//       font-weight: 700;
//       box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
//     }

//     .kp-avatar.bot {
//       background: linear-gradient(180deg, #e8fbff 0%, #dff7f2 100%);
//       color: #0f6a75;
//       border: 1px solid rgba(15, 118, 110, 0.16);
//     }

//     .kp-avatar.user {
//       background: linear-gradient(180deg, #fff4ee 0%, #fbe3d5 100%);
//       color: #8c4b1f;
//       border: 1px solid rgba(180, 102, 43, 0.16);
//     }

//     .kp-bubble {
//       max-width: min(85%, 720px);
//       padding: 14px 16px;
//       border-radius: 20px;
//       font-size: 14px;
//       line-height: 1.65;
//       border: 1px solid var(--kp-border-color);
//       background: #ffffff;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
//     }

//     .kp-bubble.user {
//       background: linear-gradient(180deg, #fff8f3 0%, #fdf1e8 100%);
//       border-color: rgba(222, 184, 135, 0.34);
//     }

//     .kp-bubble.bot {
//       background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
//     }

//     .kp-bubble-content {
//       color: var(--kp-text);
//       white-space: normal;
//       word-break: break-word;
//     }

//     .kp-bubble-content p,
//     .kp-bubble-content ul,
//     .kp-bubble-content ol,
//     .kp-bubble-content table,
//     .kp-bubble-content blockquote {
//       margin: 0;
//     }

//     .kp-bubble-content p + p,
//     .kp-bubble-content p + ul,
//     .kp-bubble-content p + ol,
//     .kp-bubble-content ul + p,
//     .kp-bubble-content ol + p,
//     .kp-bubble-content .kp-table-wrap + p,
//     .kp-bubble-content p + .kp-table-wrap,
//     .kp-bubble-content h1 + p,
//     .kp-bubble-content h2 + p,
//     .kp-bubble-content h3 + p {
//       margin-top: 12px;
//     }

//     .kp-bubble-content h1,
//     .kp-bubble-content h2,
//     .kp-bubble-content h3,
//     .kp-bubble-content h4,
//     .kp-bubble-content h5,
//     .kp-bubble-content h6 {
//       margin: 0 0 10px;
//       font-size: 16px;
//       line-height: 1.4;
//       color: #16394b;
//     }

//     .kp-bubble-content ul,
//     .kp-bubble-content ol {
//       padding-inline-start: 20px;
//     }

//     .kp-bubble-content code {
//       padding: 2px 6px;
//       border-radius: 8px;
//       background: rgba(226, 232, 240, 0.66);
//       font-size: 0.92em;
//     }

//     .kp-bubble-content a {
//       color: #0f6a75;
//       text-decoration: underline;
//     }

//     .kp-table-wrap {
//       overflow-x: auto;
//       margin-top: 8px;
//     }

//     .kp-bubble-content table {
//       width: 100%;
//       border-collapse: collapse;
//       border: 1px solid rgba(203, 213, 225, 0.95);
//       border-radius: 14px;
//       overflow: hidden;
//       background: #ffffff;
//     }

//     .kp-bubble-content th,
//     .kp-bubble-content td {
//       padding: 10px 12px;
//       border-bottom: 1px solid rgba(226, 232, 240, 0.95);
//       border-inline-end: 1px solid rgba(226, 232, 240, 0.95);
//       vertical-align: top;
//       text-align: start;
//     }

//     .kp-bubble-content tr:last-child td {
//       border-bottom: none;
//     }

//     .kp-bubble-content th:last-child,
//     .kp-bubble-content td:last-child {
//       border-inline-end: none;
//     }

//     .kp-bubble-content th {
//       background: #f4fbfc;
//       color: #16394b;
//       font-weight: 700;
//     }

//     .kp-meta {
//       font-size: 11px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//       margin-top: 10px;
//     }

//     .kp-source-preview {
//       margin-top: 10px;
//       padding: 12px;
//       border-radius: 16px;
//       border: 1px solid rgba(219, 228, 238, 0.88);
//       background: #ffffff;
//     }

//     .kp-source-preview-title {
//       font-size: 12px;
//       font-weight: 700;
//       color: #16394b;
//       margin-bottom: 8px;
//     }

//     .kp-source-preview-list {
//       display: flex;
//       flex-wrap: nowrap;
//       gap: 8px;
//       overflow-x: auto;
//     }

//     .kp-source-chip {
//       display: inline-flex;
//       align-items: center;
//       gap: 10px;
//       border: 1px solid rgba(15, 118, 110, 0.16);
//       background: #ffffff;
//       color: #0f4f68;
//       border-radius: 999px;
//       padding: 8px 12px;
//       cursor: pointer;
//       font-size: 12px;
//       line-height: 1.3;
//       max-width: 100%;
//       min-width: 0;
//     }

//     .kp-source-chip-more {
//       background: rgba(236, 254, 255, 0.9);
//     }

//     .kp-source-chip-label {
//       min-width: 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//     }

//     .kp-source-thumb-stack {
//       display: inline-flex;
//       align-items: center;
//       margin-inline-end: 2px;
//     }

//     .kp-source-thumb.stacked {
//       margin-inline-end: -10px;
//       background: #ffffff;
//     }

//     .kp-message-actions {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       margin-top: 10px;
//     }

//     .kp-message-action {
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       background: #ffffff;
//       color: #4b6478;
//       border-radius: 999px;
//       padding: 7px 10px;
//       cursor: pointer;
//       font-size: 12px;
//       line-height: 1;
//     }

//     .kp-message-action.active {
//       color: #0f6a75;
//       border-color: rgba(15, 118, 110, 0.3);
//       background: rgba(236, 254, 255, 0.92);
//     }

//     .kp-suggestions {
//       display: flex;
//       flex-direction: column;
//       gap: 10px;
//       margin-top: auto;
//     }

//     .kp-suggestion {
//       border: 1px solid rgba(15, 118, 110, 0.18);
//       background: rgba(247, 251, 255, 0.92);
//       color: var(--kp-text);
//       border-radius: 999px;
//       padding: 11px 14px;
//       cursor: pointer;
//       text-align: left;
//       font-size: 14px;
//       line-height: 1.35;
//     }

//     .kp-footer {
//       padding: 10px 16px 12px;
//       border-top: 1px solid rgba(219, 228, 238, 0.85);
//       background: #ffffff;
//     }

//     .kp-form {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       border: 1px solid var(--kp-border-color);
//       border-radius: 16px;
//       padding: 10px 12px;
//       background: #ffffff;
//     }


//     .kp-input {
//       flex: 1;
//       border: none;
//       outline: none;
//       box-shadow: none;
//       background: transparent;
//       color: var(--kp-text);
//       font-size: 14px;
//       line-height: 1.5;
//       min-width: 0;
//       appearance: none;
//     }

//     .kp-input:focus,
//     .kp-input:focus-visible,
//     .kp-input:active {
//       border: none;
//       outline: none;
//       box-shadow: none;
//     }

//     .kp-send {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 999px;
//       background: #e4f1f8;
//       color: var(--kp-accent);
//       cursor: pointer;
//       font-size: 20px;
//       line-height: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex: none;
//     }
//     .kp-rtl .kp-send {
//       transform: none; /* remove mirroring for RTL, keep button orientation */
//     }

//     .kp-attach {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: var(--kp-accent);
//       cursor: pointer;
//       font-size: 20px;
//       line-height: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex: none;
//       transition: background 140ms ease;
//     }

//     .kp-attach:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-attachment-badge {
//       display: inline-flex;
//       align-items: center;
//       padding: 4px 10px;
//       margin-bottom: 8px;
//       border-radius: 12px;
//       background: rgba(228, 241, 248, 0.8);
//       color: var(--kp-accent);
//       font-size: 12px;
//       font-weight: 500;
//       border: 1px solid rgba(15, 118, 110, 0.2);
//     }


//     .kp-note {
//       margin-top: 8px;
//       text-align: center;
//       font-size: 11px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//     }

//     .kp-loading {
//       font-size: 13px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//       padding: 4px 2px;
//     }

//     @media (max-width: 1100px) {
//       .kp-full-page-content:has(.kp-source-panel.open) {
//         grid-template-columns: 260px minmax(0, 1fr);
//       }

//       .kp-source-panel.open {
//         position: absolute;
//         inset-inline-end: 28px;
//         top: 92px;
//         bottom: 26px;
//         width: min(320px, calc(100vw - 56px));
//         z-index: 3;
//       }
//     }

//     .kp-full-page-menu-btn {
//       display: none;
//       background: none;
//       border: none;
//       font-size: 24px;
//       color: #374151;
//       cursor: pointer;
//       margin-inline-end: 12px;
//       padding: 4px;
//       line-height: 1;
//     }

//     @media (max-width: 860px) {
//       .kp-full-page-menu-btn {
//         display: block;
//       }

//       .kp-full-page-content {
//         display: flex;
//         flex-direction: column;
//       }

//       .kp-full-page-content:has(.kp-source-panel.open) {
//         display: grid;
//         grid-template-columns: 1fr;
//         grid-template-rows: 1fr auto;
//       }

//       .kp-full-page-sidebar {
//         position: fixed;
//         top: 0;
//         left: -100%;
//         width: 280px;
//         height: 100%;
//         max-height: 100vh !important;
//         z-index: 1000;
//         background: #ffffff;
//         box-shadow: 4px 0 24px rgba(0,0,0,0.1);
//         transition: left 0.3s ease;
//         flex: none;
//       }

//       .kp-full-page-sidebar.open {
//         left: 0;
//       }

//       .kp-rtl .kp-full-page-sidebar {
//         left: auto;
//         right: -100%;
//         transition: right 0.3s ease;
//         box-shadow: -4px 0 24px rgba(0,0,0,0.1);
//       }

//       .kp-rtl .kp-full-page-sidebar.open {
//         right: 0;
//       }

//       .kp-full-page-embedded .kp-full-page-sidebar {
//         /* max-height: none; handled by !important above */
//       }

//       .kp-source-panel.open {
//         position: static;
//         inset: auto;
//         width: auto;
//         max-height: 280px;
//       }
//     }

//     @media (max-width: 640px) {
//       .kp-chat-widget,
//       .kp-chat-widget.bottom-left {
//         left: auto;
//         right: 16px;
//         bottom: 16px;
//       }

//       .kp-chat-widget.kp-chat-widget-embedded,
//       .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
//         left: auto;
//         right: auto;
//         bottom: auto;
//       }

//       .kp-panel,
//       .kp-chat-widget.bottom-left .kp-panel {
//         inset: 0;
//         width: 100vw;
//         height: 100vh;
//         border-radius: 0;
//         transform: translateX(72px) scale(0.985);
//         transform-origin: center right;
//       }

//       .kp-panel.open {
//         transform: translateX(0) scale(1);
//       }

//       .kp-full-page-shell {
//         padding: 14px;
//       }

//       .kp-full-page-embedded .kp-full-page-shell {
//         padding: 0;
//       }

//       .kp-full-page-header {
//         padding: 0;
//       }

//       .kp-full-page-body {
//         padding: 24px 16px 16px;
//       }

//       .kp-full-page-hero-badge {
//         width: 112px;
//         height: 112px;
//       }

//       .kp-full-page-hero-text {
//         font-size: 22px;
//       }

//       .kp-message-row {
//         gap: 8px;
//       }

//       .kp-avatar {
//         width: 32px;
//         height: 32px;
//       }

//       .kp-bubble {
//         max-width: calc(100% - 40px);
//       }
//     }

//     @keyframes kp-cluster-rotate {
//       from { transform: rotate(0deg); }
//       to { transform: rotate(360deg); }
//     }

//     @keyframes kp-main-pulse {
//       0%, 100% { transform: translate(-50%, -50%) scale(0.82); opacity: 0.45; }
//       38% { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
//       60% { transform: translate(-50%, -50%) scale(0.94); opacity: 0.88; }
//     }

//     @keyframes kp-orbit-a {
//       0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
//       40% { transform: translate(-50%, 17px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(-50%, 2px) scale(1); opacity: 0.98; }
//     }

//     @keyframes kp-orbit-b {
//       0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
//       40% { transform: translate(-16px, -13px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(-2px, -2px) scale(1); opacity: 0.98; }
//     }

//     @keyframes kp-orbit-c {
//       0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
//       40% { transform: translate(16px, -13px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(2px, -2px) scale(1); opacity: 0.98; }
//     }

//     /* In-Widget Premium Document Preview Overlay Styles */
//     .kp-citation-overlay {
//       position: fixed;
//       inset: 0;
//       background: #f8fafc;
//       color: #1f2937;
//       display: flex;
//       flex-direction: column;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(18px);
//       transition: opacity 260ms ease, transform 320ms ease;
//       z-index: 100000;
//       overflow: hidden;
//       box-sizing: border-box;
//     }

//     .kp-chat-widget-embedded .kp-citation-overlay {
//       position: absolute;
//       inset: 0;
//       z-index: 100000;
//     }

//     .kp-citation-overlay.open {
//       opacity: 1;
//       pointer-events: auto;
//       transform: translateY(0);
//     }

//     .kp-citation-overlay-header {
//       background: #ffffff;
//       border-bottom: 1px solid rgba(226, 232, 240, 0.8);
//       height: 64px;
//       display: flex;
//       align-items: center;
//       padding: 0 24px;
//       justify-content: space-between;
//       flex: none;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-brand {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       font-weight: 600;
//       font-size: 16px;
//       color: #0f766e;
//     }

//     .kp-citation-overlay-brand-logo {
//       font-size: 20px;
//     }

//     .kp-citation-overlay-close {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 14px;
//       background: rgba(255, 255, 255, 0.82);
//       color: #61788a;
//       font-size: 24px;
//       line-height: 1;
//       cursor: pointer;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: background 140ms ease;
//     }

//     .kp-citation-overlay-close:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-citation-overlay-content {
//       display: grid;
//       grid-template-columns: 380px minmax(0, 1fr);
//       flex: 1;
//       overflow: hidden;
//       align-items: stretch;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-metadata-panel {
//       background: #ffffff;
//       border-right: 1px solid #e2e8f0;
//       padding: 32px 24px;
//       overflow-y: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 24px;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-viewer-panel {
//       flex: 1;
//       background: #f1f5f9;
//       display: flex;
//       flex-direction: column;
//       overflow: hidden;
//       box-sizing: border-box;
//     }

//     .doc-badge-wrapper {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }

//     .doc-icon {
//       background: #ecfeff;
//       color: #0f766e;
//       width: 48px;
//       height: 48px;
//       border-radius: 12px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 20px;
//       font-weight: bold;
//     }

//     .doc-badge-info h2 {
//       font-size: 11px;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: #64748b;
//       font-weight: 600;
//       margin: 0;
//     }

//     .doc-title-section h1 {
//       font-size: 18px;
//       font-weight: 700;
//       line-height: 1.4;
//       color: #0f172a;
//       margin: 8px 0 0;
//     }

//     .doc-source-type {
//       font-size: 12px;
//       color: #64748b;
//       margin-top: 4px;
//     }

//     .section-divider {
//       height: 1px;
//       background: #e2e8f0;
//     }

//     .meta-section-title {
//       font-size: 11px;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: #0f766e;
//       font-weight: 600;
//       margin-bottom: 12px;
//     }

//     .summary-box {
//       background: #f8fafc;
//       border: 1px solid #e2e8f0;
//       border-radius: 12px;
//       padding: 16px;
//       font-size: 13.5px;
//       line-height: 1.6;
//       color: #374151;
//       white-space: pre-wrap;
//     }

//     .meta-list {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//     }

//     .meta-item {
//       display: flex;
//       justify-content: space-between;
//       font-size: 13px;
//       line-height: 1.5;
//       border-bottom: 1px dashed #f1f5f9;
//       padding-bottom: 8px;
//     }

//     .meta-label {
//       color: #64748b;
//       font-weight: 500;
//     }

//     .meta-value {
//       color: #1f2937;
//       font-weight: 600;
//       text-align: right;
//       max-width: 200px;
//       word-wrap: break-word;
//     }

//     .viewer-toolbar {
//       background: #0f172a;
//       color: #ffffff;
//       height: 48px;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       padding: 0 20px;
//       font-size: 13px;
//       flex: none;
//       box-sizing: border-box;
//     }

//     .toolbar-left {
//       font-weight: 500;
//       max-width: 300px;
//       white-space: nowrap;
//       overflow: hidden;
//       text-overflow: ellipsis;
//     }

//     .toolbar-center {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }

//     .page-indicator {
//       background: rgba(255, 255, 255, 0.15);
//       padding: 4px 10px;
//       border-radius: 6px;
//       font-weight: 500;
//     }

//     .toolbar-btn {
//       background: transparent;
//       border: none;
//       color: #e2e8f0;
//       cursor: pointer;
//       padding: 4px 12px;
//       border-radius: 6px;
//       font-size: 13px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: all 0.2s;
//       font-weight: 500;
//     }

//     .toolbar-btn:hover {
//       background: rgba(255, 255, 255, 0.1);
//       color: #ffffff;
//     }

//     .toolbar-right {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//     }

//     .viewer-body {
//       flex: 1;
//       overflow: auto;
//       padding: 40px;
//       display: flex;
//       justify-content: center;
//       align-items: flex-start;
//       box-sizing: border-box;
//     }

//     .document-sheet {
//       background: #ffffff;
//       width: 100%;
//       max-width: 800px;
//       min-height: 1000px;
//       box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
//       border-radius: 4px;
//       padding: 60px 50px;
//       display: flex;
//       flex-direction: column;
//       position: relative;
//       transition: transform 0.2s ease;
//       transform-origin: top center;
//       box-sizing: border-box;
//     }

//     .sheet-header {
//       border-bottom: 2px solid #0f766e;
//       padding-bottom: 15px;
//       margin-bottom: 30px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 11px;
//       color: #64748b;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       font-weight: 600;
//     }

//     .sheet-content {
//       font-size: 14.5px;
//       line-height: 1.8;
//       color: #27272a;
//       white-space: pre-wrap;
//       flex: 1;
//       font-family: 'Inter', sans-serif;
//       text-align: left;
//     }

//     .sheet-footer {
//       border-top: 1px solid #e2e8f0;
//       padding-top: 15px;
//       margin-top: 40px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 11px;
//       color: #64748b;
//     }

//     .kp-citation-overlay iframe {
//       width: 100%;
//       height: 100%;
//       border: none;
//     }

//     @media (max-width: 860px) {
//       .kp-citation-overlay-content {
//         grid-template-columns: 1fr;
//         overflow-y: auto;
//       }
      
//       .kp-citation-overlay-metadata-panel {
//         border-right: none;
//         border-bottom: 1px solid #e2e8f0;
//         padding: 20px 16px;
//       }

//       .viewer-body {
//         padding: 20px;
//       }

//       .document-sheet {
//         padding: 30px 20px;
//         min-height: auto;
//       }
//     }
    
//     .kp-floating-menu-wrap {
//       display: none;
//     }
//     .kp-floating-menu-btn {
//       background: none;
//       border: none;
//       color: #374151;
//       cursor: pointer;
//       padding: 8px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       border-radius: 8px;
//     }
//     .kp-floating-menu-btn:hover {
//       background: rgba(0,0,0,0.05);
//     }
//     @media (max-width: 860px) {
//       .kp-floating-menu-wrap {
//         display: flex;
//         padding: 12px 16px 0;
//         flex: none;
//         background: #ffffff;
//       }
//       .kp-full-page-embedded .kp-full-page-shell {
//         gap: 0;
//       }
//       .kp-full-page-body {
//         padding-top: 12px;
//       }
//     }
//   `}var jt={en:{openChatActions:"Open chat actions",newChat:"New Chat",myChats:"My Chats",openAssistant:"Open Knowledge Assistant",back:"Back",close:"Close",assistantBadge:"Knowledge Assistant",closeAssistantPage:"Close knowledge assistant page",searchChat:"Search Chat",recentActivity:"Recent Activity",pinnedCollections:"Pinned Collections",answersBasedOnPermissions:"Answers are generated based on your access permissions",authTokenForwarded:"Auth token is forwarded from the host app when configured.",thinking:"Thinking...",unableToCreateChat:"Unable to create chat",requestFailed:"Request failed",noRecentChats:"No recent chats yet.",noPinnedChats:"No pinned chats yet.",noChats:"No chats yet.",loadingChats:"Loading chats...",pinChat:"Pin chat",unpinChat:"Unpin chat",renameChat:"Rename",deleteChat:"Delete",chatActions:"Chat actions",renamePrompt:"Enter a new chat name",citationsAttached:e=>`${e} citation${e>1?"s":""} attached`,sourcesUsed:"Sources Used",allSourcesUsed:"All Sources Used",documentsAndReferences:"AI documents and references",showAll:"Show All",noSources:"No sources were returned for this answer.",closeSourcesPanel:"Close sources panel",openSource:"Open source",sourceScore:"Score",sourcePage:"Page",sourceSheet:"Sheet",sourceRow:"Row",sourceKnowledge:"Knowledge Base",untitledSource:"Untitled Source",copy:"Copy",copied:"Copied",helpful:"Helpful",notHelpful:"Needs work",send:"Send message",assistantAvatar:"Assistant",userAvatar:"User"},ar:{openChatActions:"\u0641\u062A\u062D \u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",newChat:"\u0645\u062D\u0627\u062F\u062B\u0629 \u062C\u062F\u064A\u062F\u0629",myChats:"\u0645\u062D\u0627\u062F\u062B\u0627\u062A\u064A",openAssistant:"\u0641\u062A\u062D \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",back:"\u0631\u062C\u0648\u0639",close:"\u0625\u063A\u0644\u0627\u0642",assistantBadge:"\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",closeAssistantPage:"\u0625\u063A\u0644\u0627\u0642 \u0635\u0641\u062D\u0629 \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",searchChat:"\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A",recentActivity:"\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0623\u062E\u064A\u0631",pinnedCollections:"\u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0627\u0644\u0645\u062B\u0628\u062A\u0629",answersBasedOnPermissions:"\u064A\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0625\u062C\u0627\u0628\u0627\u062A \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643",authTokenForwarded:"\u064A\u062A\u0645 \u062A\u0645\u0631\u064A\u0631 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0645\u0636\u064A\u0641 \u0639\u0646\u062F \u0627\u0644\u0625\u0639\u062F\u0627\u062F.",thinking:"\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u0641\u0643\u064A\u0631...",unableToCreateChat:"\u062A\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",requestFailed:"\u0641\u0634\u0644 \u0627\u0644\u0637\u0644\u0628",noRecentChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u062D\u062F\u064A\u062B\u0629 \u0628\u0639\u062F.",noPinnedChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0645\u062B\u0628\u062A\u0629 \u0628\u0639\u062F.",noChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0628\u0639\u062F.",loadingChats:"\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A...",pinChat:"\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",unpinChat:"\u0625\u0644\u063A\u0627\u0621 \u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renameChat:"\u0625\u0639\u0627\u062F\u0629 \u062A\u0633\u0645\u064A\u0629",deleteChat:"\u062D\u0630\u0641",chatActions:"\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renamePrompt:"\u0623\u062F\u062E\u0644 \u0627\u0633\u0645\u064B\u0627 \u062C\u062F\u064A\u062F\u064B\u0627 \u0644\u0644\u0645\u062D\u0627\u062F\u062B\u0629",citationsAttached:e=>`\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 ${e} \u0645\u0631\u062C\u0639${e>1?"\u0627\u062A":""}`,sourcesUsed:"\u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",allSourcesUsed:"\u0643\u0644 \u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",documentsAndReferences:"\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0648\u0645\u0631\u0627\u062C\u0639 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",showAll:"\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",noSources:"\u0644\u0645 \u064A\u062A\u0645 \u0625\u0631\u062C\u0627\u0639 \u0645\u0635\u0627\u062F\u0631 \u0644\u0647\u0630\u0647 \u0627\u0644\u0625\u062C\u0627\u0628\u0629.",closeSourcesPanel:"\u0625\u063A\u0644\u0627\u0642 \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0635\u0627\u062F\u0631",openSource:"\u0641\u062A\u062D \u0627\u0644\u0645\u0635\u062F\u0631",sourceScore:"\u0627\u0644\u062F\u0631\u062C\u0629",sourcePage:"\u0627\u0644\u0635\u0641\u062D\u0629",sourceSheet:"\u0627\u0644\u0648\u0631\u0642\u0629",sourceRow:"\u0627\u0644\u0635\u0641",sourceKnowledge:"\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0645\u0639\u0631\u0641\u0629",untitledSource:"\u0645\u0635\u062F\u0631 \u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646",copy:"\u0646\u0633\u062E",copied:"\u062A\u0645 \u0627\u0644\u0646\u0633\u062E",helpful:"\u0645\u0641\u064A\u062F",notHelpful:"\u064A\u062D\u062A\u0627\u062C \u062A\u062D\u0633\u064A\u0646",send:"\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629",assistantAvatar:"\u0627\u0644\u0645\u0633\u0627\u0639\u062F",userAvatar:"\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645"}};function Ie(e){if(typeof document>"u")throw new Error("Chat widget can only be initialized in a browser.");let t=Bt(e),a=Je(t.locale),n=Dn(t.locale),r=jn(a),p=t.displayMode==="embedded",s={chatId:Ee(t),open:!1,fullPageOpen:p,myChatsOpen:!1,accessTokenProvider:t.getAccessToken,historyLoadedChatId:null,menuOpen:!1,chats:[],chatSearchTerm:"",loadingChats:!1,sourcePanelOpen:!1,sourcePanelTitle:null,attachedFile:null},d=document.createElement("div");d.dataset.chatWidgetHost="true",t.mount.appendChild(d);let u=d.attachShadow({mode:"open"});Dt(u,t.theme);let c=o("div",`kp-chat-widget ${t.position}`);c.lang=a,c.dir=r?"rtl":"ltr",p&&(c.classList.add("kp-chat-widget-embedded"),Ft(!0)),r&&c.classList.add("kp-rtl");let g=o("div","kp-overlay"),f=o("button","kp-launcher");f.type="button",f.setAttribute("aria-label",t.launcherAriaLabel),f.innerHTML=['<span class="kp-star-cluster" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let m=o("section","kp-panel");m.setAttribute("role","dialog"),m.setAttribute("aria-modal","true"),m.setAttribute("aria-label",t.title);let A=o("div","kp-header"),S=o("div","kp-toolbar"),y=o("button","kp-tool-button kp-menu-trigger");y.type="button",y.setAttribute("aria-label",n.openChatActions),y.innerHTML=['<span class="kp-pencil-icon" aria-hidden="true"></span>','<span class="kp-chevron" aria-hidden="true">\u2304</span>'].join("");let L=o("div","kp-dropdown"),w=o("button","kp-dropdown-item",n.newChat);w.type="button";let V=o("button","kp-dropdown-item",n.myChats);V.type="button";let T=o("button","kp-dropdown-item",n.openAssistant);T.type="button",L.append(w,V,T),S.append(y,L);let E=o("div","kp-title-wrap"),Jt=o("h2","kp-title",t.title),Gt=o("div","kp-subtitle",t.subtitle);E.append(Jt,Gt);let me=o("button","kp-close","\xD7");me.type="button",me.setAttribute("aria-label",t.closeAriaLabel),A.append(S,E,me);let be=o("div","kp-body"),Re=o("div","kp-hero"),Qt=o("div","kp-hero-icon","\u2726"),Zt=o("div","kp-hero-text",t.welcomeMessage);Re.append(Qt,Zt);let Qe=o("div","kp-footer"),ze=o("form","kp-form"),H=o("input","kp-input");H.type="text",H.autocomplete="off",H.placeholder=t.inputPlaceholder,H.setAttribute("aria-label",t.inputPlaceholder);let ke=o("button","kp-attach","\u{1F4CE}");ke.type="button",ke.setAttribute("aria-label","Attach file");let K=o("input","kp-file-input");K.type="file",K.style.display="none";let He=o("div","kp-attachment-badge");He.style.display="none";let Me=o("button","kp-send","\u279C");Me.type="submit",Me.setAttribute("aria-label",n.send);let en=o("div","kp-note",n.authTokenForwarded);ze.append(ke,K,H,Me),Qe.append(He,ze,en),m.append(A,be,Qe),p||c.append(g,f,m),u.appendChild(c),be.appendChild(Re);let Ze=o("div","kp-suggestions");be.appendChild(Ze);let xe=o("section","kp-my-chats-sheet"),et=o("div","kp-my-chats-header"),ye=o("button","kp-my-chats-nav","\u2190");ye.type="button",ye.setAttribute("aria-label",n.back);let ve=o("button","kp-my-chats-nav kp-my-chats-close","\xD7");ve.type="button",ve.setAttribute("aria-label",n.close),et.append(ye,ve);let tt=o("div","kp-my-chats-body"),tn=o("div","kp-my-chats-section-label",n.recentActivity),nt=o("div","kp-my-chats-list"),nn=o("div","kp-my-chats-section-label",n.pinnedCollections),at=o("div","kp-my-chats-list");tt.append(tn,nt,nn,at),xe.append(et,tt),m.appendChild(xe);let M={body:be,input:H,suggestions:Ze,hero:Re,kind:"panel"},I=o("section","kp-full-page");p&&I.classList.add("kp-full-page-embedded","open"),I.setAttribute("role","dialog"),p||I.setAttribute("aria-modal","true"),I.setAttribute("aria-label",`${t.title} page`);let Ue=o("div","kp-full-page-shell"),we=o("div","kp-full-page-header"),ot=o("div","kp-full-page-brand"),an=o("div","kp-full-page-brand-mark","\u2726"),on=o("div","kp-full-page-brand-text",t.title),ie=o("button","kp-full-page-menu-btn");ie.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',ie.type="button",ie.setAttribute("aria-label","Toggle sidebar"),ie.addEventListener("click",()=>{re.classList.toggle("open")}),ot.append(ie,an,on);let st=o("div","kp-full-page-header-actions"),sn=o("div","kp-full-page-badge",n.assistantBadge),Ce=o("button","kp-full-page-close","\xD7");if(Ce.type="button",Ce.setAttribute("aria-label",n.closeAssistantPage),st.append(sn,Ce),we.append(ot,st),!t.embedded.showHeader){we.classList.add("kp-hidden");let i=o("div","kp-floating-menu-wrap"),l=o("button","kp-floating-menu-btn");l.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',l.type="button",l.setAttribute("aria-label","Toggle sidebar"),l.addEventListener("click",()=>{re.classList.toggle("open")}),i.append(l),Ue.insertBefore(i,we.nextSibling)}let it=o("div","kp-full-page-content"),re=o("aside","kp-full-page-sidebar"),$e=o("button","kp-full-page-new-chat",`+ ${n.newChat}`);$e.type="button";let rt=o("div","kp-full-page-search"),le=o("input","kp-full-page-search-input");le.type="search",le.placeholder=n.searchChat;let rn=o("span","kp-full-page-search-icon","\u2315");rt.append(le,rn);let ln=o("div","kp-full-page-section-label",n.recentActivity),lt=o("div","kp-full-page-recent-list"),pn=o("div","kp-full-page-section-label",n.pinnedCollections),pt=o("div","kp-full-page-pinned-list");re.append($e,rt,ln,lt,pn,pt);let dt=o("main","kp-full-page-main"),ct=o("section","kp-full-page-panel"),Ne=o("div","kp-full-page-body"),Be=o("div","kp-full-page-hero"),ut=o("div","kp-full-page-hero-badge");ut.innerHTML=['<span class="kp-star-cluster kp-star-cluster-static" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let dn=o("div","kp-full-page-hero-text",t.welcomeMessage);Be.append(ut,dn);let gt=o("div","kp-suggestions kp-full-page-suggestions");Ne.append(Be,gt);let ft=o("div","kp-full-page-footer"),Oe=o("form","kp-form kp-full-page-form"),R=o("input","kp-input kp-full-page-input");R.type="text",R.autocomplete="off",R.placeholder=t.inputPlaceholder,R.setAttribute("aria-label",t.inputPlaceholder);let Le=o("button","kp-attach kp-full-page-attach","\u{1F4CE}");Le.type="button",Le.setAttribute("aria-label","Attach file");let Y=o("input","kp-file-input");Y.type="file",Y.style.display="none";let De=o("div","kp-attachment-badge kp-full-page-attachment-badge");De.style.display="none";let je=o("button","kp-send kp-full-page-send","\u279C");je.type="submit",je.setAttribute("aria-label",n.send);let cn=o("div","kp-note kp-full-page-note",n.answersBasedOnPermissions);Oe.append(Le,Y,R,je),ft.append(De,Oe,cn),ct.append(Ne,ft),dt.appendChild(ct);let Ae=o("aside","kp-source-panel"),ht=o("div","kp-source-panel-header"),mt=o("div","kp-source-panel-title-wrap"),bt=o("div","kp-source-panel-title",n.allSourcesUsed),un=o("div","kp-source-panel-subtitle",n.documentsAndReferences);mt.append(bt,un);let Pe=o("button","kp-source-panel-close","\xD7");Pe.type="button",Pe.setAttribute("aria-label",n.closeSourcesPanel),ht.append(mt,Pe);let pe=o("div","kp-source-panel-list"),gn=o("div","kp-source-panel-empty",n.noSources);pe.appendChild(gn),Ae.append(ht,pe),it.append(re,dt,Ae),Ue.append(we,it),I.appendChild(Ue),c.appendChild(I);let de=o("div","kp-citation-overlay");c.appendChild(de);let P={body:Ne,input:R,suggestions:gt,hero:Be,kind:"full-page"},N=()=>({...t,getAccessToken:s.accessTokenProvider}),kt=async()=>{if(!t.getUserContext)return{displayName:null,avatarUrl:null};try{let i=await t.getUserContext();return i?{displayName:[i.firstName,i.lastName].filter(Boolean).join(" ")||i.displayName?.trim()||i.email?.trim()||i.userId?.trim()||null,avatarUrl:i.avatarUrl??null}:{displayName:null,avatarUrl:null}}catch{return{displayName:null,avatarUrl:null}}},ee=i=>{let l=Ge(i)??n.untitledSource,h=(i.text||"").trim(),k=h,x=h.split(`
// `);if(x.length>1&&x[0]){let W=x[0].trim().replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();W&&(W===l||l.indexOf(W)!==-1||W.indexOf(l)!==-1)&&(k=x.slice(1).join(`
// `).trim())}let b=Gn(i.sourceDocument),v=[];(i.pageNumber||i.pageNumber===0)&&v.push(`
//         <div class="meta-item">
//           <span class="meta-label">Page Number</span>
//           <span class="meta-value">${i.pageNumber}</span>
//         </div>
//       `),typeof i.score=="number"&&v.push(`
//         <div class="meta-item">
//           <span class="meta-label">Relevance Score</span>
//           <span class="meta-value">${i.score.toFixed(2)}</span>
//         </div>
//       `),i.sheetName&&v.push(`
//         <div class="meta-item">
//           <span class="meta-label">Sheet Name</span>
//           <span class="meta-value">${q(i.sheetName)}</span>
//         </div>
//       `),(i.rowNumber||i.rowNumber===0)&&v.push(`
//         <div class="meta-item">
//           <span class="meta-label">Row Number</span>
//           <span class="meta-value">${i.rowNumber}</span>
//         </div>
//       `),i.knowledgeName&&v.push(`
//         <div class="meta-item">
//           <span class="meta-label">Database Source</span>
//           <span class="meta-value">${q(i.knowledgeName)}</span>
//         </div>
//       `),v.push(`
//       <div class="meta-item">
//         <span class="meta-label">Classification</span>
//         <span class="meta-value">Uploaded Knowledge</span>
//       </div>
//       <div class="meta-item">
//         <span class="meta-label">Confidentiality</span>
//         <span class="meta-value" style="color: #0f766e;">Public</span>
//       </div>
//       <div class="meta-item">
//         <span class="meta-label">Language</span>
//         <span class="meta-value">English</span>
//       </div>
//     `);let z=v.join(""),j=k?q(k):"No text snippet available for this citation.",Cn=`
//       <div class="doc-badge-wrapper">
//         <div class="doc-icon">\u{1F4C4}</div>
//         <div class="doc-badge-info">
//           <h2>Document Citation</h2>
//         </div>
//       </div>
      
//       <div class="doc-title-section">
//         <h1>${q(l)}</h1>
//         <div class="doc-source-type">Uploaded Knowledge Resource</div>
//       </div>
      
//       <div class="section-divider"></div>
      
//       <div>
//         <h3 class="meta-section-title">Retrieved Passage Snippet</h3>
//         <div class="summary-box">${j}</div>
//       </div>
      
//       <div class="section-divider"></div>
      
//       <div>
//         <h3 class="meta-section-title">Metadata & Classification</h3>
//         <div class="meta-list">
//           ${z}
//         </div>
//       </div>
//     `,Fe="";b?Fe=`<iframe src="${b}" title="Document Viewer"></iframe>`:Fe=`
//         <div class="viewer-toolbar">
//           <div class="toolbar-left">${q(l)}</div>
//           <div class="toolbar-center">
//             <button class="toolbar-btn zoom-out-btn">\u2212</button>
//             <span class="page-indicator">Page ${i.pageNumber||1}</span>
//             <button class="toolbar-btn zoom-in-btn">+</button>
//           </div>
//           <div class="toolbar-right">
//             <button class="toolbar-btn print-btn">\u{1F5A8}\uFE0F Print</button>
//           </div>
//         </div>
//         <div class="viewer-body">
//           <div class="document-sheet">
//             <div class="sheet-header">
//               <span>${q(l)}</span>
//               <span>Page ${i.pageNumber||1}</span>
//             </div>
//             <div class="sheet-content">${q(h||"No document content retrieved.")}</div>
//             <div class="sheet-footer">
//               <span>Confidentiality: Public</span>
//               <span>Knowledge Platform CB</span>
//             </div>
//           </div>
//         </div>
//       `,de.textContent="";let Pt=o("header","kp-citation-overlay-header"),St=o("div","kp-citation-overlay-brand");St.innerHTML=`
//       <span class="kp-citation-overlay-brand-logo">\u2726</span>
//       <span>Knowledge Assistant Document Viewer</span>
//     `;let Te=o("button","kp-citation-overlay-close","\xD7");Te.type="button",Te.setAttribute("aria-label","Close document preview"),Te.addEventListener("click",()=>{de.classList.remove("open")}),Pt.append(St,Te);let Tt=o("div","kp-citation-overlay-content"),Et=o("aside","kp-citation-overlay-metadata-panel");Et.innerHTML=Cn;let ae=o("main","kp-citation-overlay-viewer-panel");if(ae.innerHTML=Fe,Tt.append(Et,ae),de.append(Pt,Tt),!b){let G=1,W=ae.querySelector(".document-sheet"),Ln=ae.querySelector(".zoom-in-btn"),An=ae.querySelector(".zoom-out-btn"),Pn=ae.querySelector(".print-btn");W&&(Ln?.addEventListener("click",()=>{G<1.5&&(G+=.1,W.style.transform=`scale(${G})`)}),An?.addEventListener("click",()=>{G>.6&&(G-=.1,W.style.transform=`scale(${G})`)}),Pn?.addEventListener("click",()=>{window.print()}))}de.classList.add("open")},ce=(i,l)=>{if(s.sourcePanelOpen=!0,s.sourcePanelTitle=l??n.allSourcesUsed,bt.textContent=s.sourcePanelTitle,Ae.classList.add("open"),pe.textContent="",i.length===0){pe.appendChild(o("div","kp-source-panel-empty",n.noSources));return}for(let h of i)pe.appendChild(Jn(h,n,()=>{ee(h)}))},te=()=>{s.sourcePanelOpen=!1,s.sourcePanelTitle=null,Ae.classList.remove("open")};oe(M,t.initialSuggestions,async i=>{await B(i,M)}),oe(P,t.initialSuggestions,async i=>{await B(i,P)}),J(),Se(),p&&(U(),t.rag.loadHistoryOnOpen&&ne(P,s.chatId));function xt(i,l,h){l.textContent=`Uploading ${i.name}...`,l.style.display="block",h.disabled=!0,Nt(N(),i).then(k=>{s.attachedFile={name:i.name,sourceUuid:k.source_uuid},l.textContent=`\u{1F4CE} ${i.name} (Attached)`}).catch(k=>{let x=F(t,k);l.textContent=`Failed to upload: ${x.message}`,setTimeout(()=>{l.style.display="none",l.textContent=""},3e3)}).finally(()=>{h.disabled=!1,K.value="",Y.value=""})}ke.addEventListener("click",()=>{K.click()}),K.addEventListener("change",()=>{let i=K.files?.[0];i&&xt(i,He,H)}),Le.addEventListener("click",()=>{Y.click()}),Y.addEventListener("change",()=>{let i=Y.files?.[0];i&&xt(i,De,R)});function We(){if(p){s.fullPageOpen=!0,I.classList.add("open");return}s.open||(s.open=!0,s.fullPageOpen=!1,D(),I.classList.remove("open"),f.classList.add("hidden"),g.classList.add("visible"),m.classList.add("open"),t.onOpen?.(),t.rag.loadHistoryOnOpen&&_e.loadHistory(),queueMicrotask(()=>H.focus()))}function X(){if(p){te();return}s.open&&(O(),D(),s.open=!1,f.classList.remove("hidden"),g.classList.remove("visible"),m.classList.remove("open"),t.onClose?.())}async function B(i,l){let h=i.trim();if(!h)return;l.input.value="";try{await kn(h)}catch(b){let v=F(t,b);he(l.body,"bot",`${n.unableToCreateChat}: ${v.message}`,{strings:n,view:l,userName:null,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:ce,onShowCitation:ee,onLike:()=>{},onDislike:()=>{}});return}Xe(l);let k=await kt();he(l.body,"user",h,{strings:n,view:l,userName:k.displayName,userAvatarUrl:k.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:ce,onShowCitation:ee,onLike:()=>{},onDislike:()=>{}}),l.body.scrollTop=l.body.scrollHeight;let x=o("div","kp-loading",n.thinking);l.body.appendChild(x),l.body.scrollTop=l.body.scrollHeight;try{let b=await Mn(t),v=s.attachedFile?[s.attachedFile.sourceUuid,...b]:b,z=await zt(N(),{message:h,chatId:s.chatId,knowledgeNames:v,...t.rag.enableReferences!==void 0?{enableReferences:t.rag.enableReferences}:{}});x.isConnected&&x.remove(),he(l.body,"bot",z.answer,{strings:n,view:l,userName:k.displayName,userAvatarUrl:k.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,citations:z.citations??[],onShowSources:ce,onShowCitation:ee,onLike:()=>{ge(t,s.chatId,z.answer,!0).catch(console.error)},onDislike:()=>{ge(t,s.chatId,z.answer,!1).catch(console.error)}}),s.historyLoadedChatId=null,await U(),z.suggestions?.length&&oe(l,z.suggestions,async j=>{await B(j,l)})}catch(b){let v=F(t,b);x.isConnected&&x.remove(),he(l.body,"bot",`${n.requestFailed}: ${v.message}`,{strings:n,view:l,userName:k.displayName,userAvatarUrl:k.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:ce,onShowCitation:ee,onLike:()=>{},onDislike:()=>{}})}}async function yt(i){let l=s.fullPageOpen?P:M;await B(i,l)}async function fn(){if(p){s.fullPageOpen=!0,I.classList.add("open"),await U(),await ne(P,s.chatId),queueMicrotask(()=>R.focus());return}s.fullPageOpen=!0,s.open=!1,O(),D(),m.classList.remove("open"),g.classList.remove("visible"),f.classList.add("hidden"),I.classList.add("open"),await U(),await ne(P,s.chatId),queueMicrotask(()=>R.focus())}function vt(){if(p){te();return}s.fullPageOpen&&(s.fullPageOpen=!1,I.classList.remove("open"),f.classList.remove("hidden"),te())}function hn(){s.menuOpen=!0,y.classList.add("open"),L.classList.add("open")}function O(){s.menuOpen=!1,y.classList.remove("open"),L.classList.remove("open")}function mn(){s.chatId=Ee(t),s.historyLoadedChatId=null,D(),fe(M),oe(M,t.initialSuggestions,async i=>{await B(i,M)}),O()}async function bn(){s.chatId=Ee(t),s.historyLoadedChatId=null,fe(P),te(),oe(P,t.initialSuggestions,async i=>{await B(i,P)}),J()}async function U(){if(!t.endpoints.listChats)return J(),Se(),[];s.loadingChats=!0,J(),Se();try{let i=await Mt(N());return s.chats=i,i}catch(i){return F(t,i),s.chats}finally{s.loadingChats=!1,J(),Se()}}async function kn(i){!t.endpoints.listChats&&!t.endpoints.createChat||s.chats.some(l=>l.chatId===s.chatId)||await Ut(N(),s.chatId,i?On(i,n.newChat):void 0)}async function xn(i){s.chatId=i,s.historyLoadedChatId=null,await ne(P,i),J()}async function yn(i){s.chatId=i,s.historyLoadedChatId=null,D(),await ne(M,i)}async function vn(){O(),await U(),s.myChatsOpen=!0,m.classList.add("kp-sheet-open"),xe.classList.add("open")}function D(){s.myChatsOpen=!1,m.classList.remove("kp-sheet-open"),xe.classList.remove("open")}function wn(i,l){let h=o("div","kp-overlay visible"),k=o("div","kp-rename-dialog");k.style.cssText="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:320px; background:var(--kp-panel-background); box-shadow:var(--kp-shadow); padding:24px; border-radius:16px; opacity:1; pointer-events:auto; z-index: 10000; display:flex; flex-direction:column; height:min-content; box-sizing:border-box;";let x=o("h3","kp-source-preview-title");x.textContent=n.renamePrompt,x.style.marginBottom="16px",x.style.fontSize="16px";let b=o("input","kp-input");b.type="text",b.value=i.title,b.style.border="1px solid var(--kp-border-color)",b.style.padding="10px",b.style.borderRadius="8px",b.style.width="100%",b.style.marginBottom="20px",b.style.flex="none",b.style.height="40px";let v=o("div","kp-message-actions");v.style.justifyContent="flex-end",v.style.gap="8px";let z=o("button","kp-message-action",n.close);z.addEventListener("click",()=>h.remove());let j=o("button","kp-message-action active","Save");j.addEventListener("click",async()=>{j.disabled=!0,j.textContent="...",await l(b.value),h.remove()}),v.append(z,j),k.append(x,b,v),h.appendChild(k),c.appendChild(h),b.focus()}async function wt(i){t.endpoints.updateChat&&wn(i,async l=>{let h=l.trim();if(!(!h||h===i.title))try{await Ke(N(),i.chatId,{title:h}),await U()}catch(k){F(t,k)}})}async function Ct(i){if(t.endpoints.deleteChat)try{await $t(N(),i.chatId),s.chatId===i.chatId&&(s.chatId=Ee(t),s.historyLoadedChatId=null,fe(M),fe(P)),await U()}catch(l){F(t,l)}}function J(){Wt(lt,pt,s,n,async i=>{await xn(i.chatId),re.classList.remove("open")},async i=>{await Lt(i)},async i=>{await wt(i)},async i=>{await Ct(i)})}function Se(){Wt(nt,at,s,n,async i=>{await yn(i.chatId)},async i=>{await Lt(i)},async i=>{await wt(i)},async i=>{await Ct(i)})}async function Lt(i){if(t.endpoints.updateChat)try{await Ke(N(),i.chatId,{pinned:!i.pinned}),await U()}catch(l){F(t,l)}}async function ne(i,l){fe(i),oe(i,t.initialSuggestions,async x=>{await B(x,i)});let h=o("div","kp-message kp-message-ai");h.innerHTML='<div class="kp-message-bubble"><div class="kp-typing-indicator"><span></span><span></span><span></span></div></div>',Xe(i),i.body.appendChild(h);let k=await Ht(N(),l);if(h.remove(),k.length>0){Xe(i),qt(i.body,i.hero,i.suggestions);let x=await kt();Bn(i.body,k,{strings:n,view:i,userName:x.displayName,userAvatarUrl:x.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:ce,onShowCitation:ee,onLike:b=>{ge(t,l,b,!0).catch(console.error)},onDislike:b=>{ge(t,l,b,!1).catch(console.error)}})}return s.historyLoadedChatId=l,k}let _e={open:We,close:X,toggle(){if(p){We();return}if(s.open){X();return}We()},destroy(){if(document.removeEventListener("keydown",At),d.remove(),p){let i=!1;document.querySelectorAll("[data-chat-widget-host]").forEach(l=>{let h=l.shadowRoot;h&&h.querySelector(".kp-chat-widget-embedded")&&(i=!0)}),i||Ft(!1)}},sendMessage:yt,setAccessTokenProvider(i){s.accessTokenProvider=i},getChatId(){return s.chatId},loadChats(){return U()},async loadHistory(){let i=s.fullPageOpen?P:M;return ne(i,s.chatId)}};f.addEventListener("click",()=>_e.toggle()),me.addEventListener("click",X),g.addEventListener("click",X),Pe.addEventListener("click",te),ye.addEventListener("click",D),ve.addEventListener("click",D),y.addEventListener("click",i=>{if(i.stopPropagation(),!s.menuOpen){hn();return}O()}),w.addEventListener("click",mn),V.addEventListener("click",async()=>{await vn()}),T.addEventListener("click",()=>{if(O(),t.onOpenAssistantPage){X(),t.onOpenAssistantPage();return}if(t.assistantPageUrl){X(),window.location.href=t.assistantPageUrl;return}fn()}),Ce.addEventListener("click",vt),$e.addEventListener("click",()=>{bn(),queueMicrotask(()=>R.focus())}),le.addEventListener("input",()=>{s.chatSearchTerm=le.value.trim().toLowerCase(),J()}),m.addEventListener("click",i=>{let l=i.target;if(!(l instanceof Element)||!l.closest(".kp-chat-actions")){for(let h of Array.from(u.querySelectorAll(".kp-chat-actions.open")))h.classList.remove("open");for(let h of Array.from(u.querySelectorAll(".kp-full-page-chat-item.menu-open")))h.classList.remove("menu-open")}s.menuOpen&&!L.contains(l)&&!y.contains(l)&&O(),i.stopPropagation()}),u.addEventListener("click",i=>{let l=i.target;if(s.menuOpen&&l instanceof Node&&!L.contains(l)&&!y.contains(l)&&O(),l instanceof Element&&!l.closest(".kp-chat-actions")){for(let h of Array.from(u.querySelectorAll(".kp-chat-actions.open")))h.classList.remove("open");for(let h of Array.from(u.querySelectorAll(".kp-full-page-chat-item.menu-open")))h.classList.remove("menu-open")}}),ze.addEventListener("submit",async i=>{i.preventDefault(),await yt(H.value)}),Oe.addEventListener("submit",async i=>{i.preventDefault(),await B(R.value,P)});function At(i){if(i.key==="Escape"){if(s.sourcePanelOpen){te();return}if(s.myChatsOpen){D();return}if(s.fullPageOpen){if(p)return;vt();return}s.open&&X()}}return document.addEventListener("keydown",At),_e}async function Mn(e){if(e.rag.getKnowledgeNames){let t=await e.rag.getKnowledgeNames();return Array.isArray(t)?t.filter(Boolean):[]}return(e.rag.knowledgeNames??[]).filter(Boolean)}function Ee(e){return e.rag.chatId?.trim()?e.rag.chatId:e.rag.chatIdFactory?e.rag.chatIdFactory():typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`kp-chat-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function he(e,t,a,n){let r=t==="bot"?_n(a,n.citations??[]):{displayText:a,citations:n.citations??[]},p=o("div",`kp-message-row ${t}`),s=$n(t==="bot"?n.strings.assistantAvatar:n.userName??n.strings.userAvatar,t,t==="bot"?n.assistantAvatarUrl:n.userAvatarUrl),d=o("div",`kp-bubble ${t}`),u=o("div","kp-bubble-content");Qn(u,r.displayText),d.appendChild(u);let c=r.citations;if(c.length){let g=o("div","kp-meta",n.strings.citationsAttached(c.length));d.appendChild(g);let f=o("div","kp-source-preview"),m=o("div","kp-source-preview-title",n.strings.sourcesUsed),A=o("div","kp-source-preview-list");for(let y of c.slice(0,2)){let L=Yn(y,n.strings);L.addEventListener("click",async()=>{n.onShowCitation(y)}),A.appendChild(L)}let S=Xn(n.strings);S.addEventListener("click",async()=>{n.onShowSources(c,n.strings.allSourcesUsed)}),A.appendChild(S),f.append(m,A),d.appendChild(f)}return t==="bot"&&d.appendChild(Un(r.displayText,n.strings,n.onLike,n.onDislike,n.initialFeedback)),t==="user"?p.append(d,s):p.append(s,d),e.appendChild(p),e.scrollTop=e.scrollHeight,p}function Un(e,t,a,n,r){let p=o("div","kp-message-actions"),s='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',d='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',u='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',c='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>',g=o("button","kp-message-action");g.innerHTML=s,g.type="button",g.setAttribute("title",t.copy),g.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),g.innerHTML=d,window.setTimeout(()=>{g.innerHTML=s},1200)}catch{g.innerHTML=s}});let f=o("button","kp-message-action");f.innerHTML=u,f.type="button",f.setAttribute("aria-label",t.helpful),r===!0&&f.classList.add("active"),f.addEventListener("click",()=>{f.classList.toggle("active"),m.classList.remove("active"),f.classList.contains("active")&&a&&a()});let m=o("button","kp-message-action");return m.innerHTML=c,m.type="button",m.setAttribute("aria-label",t.notHelpful),r===!1&&m.classList.add("active"),m.addEventListener("click",()=>{m.classList.toggle("active"),f.classList.remove("active"),m.classList.contains("active")&&n&&n()}),p.append(g,f,m),p}function $n(e,t,a){let n=o("div",`kp-avatar ${t}`);if(a){let r=o("img","kp-avatar-img");r.src=a,r.alt=e,r.style.width="100%",r.style.height="100%",r.style.objectFit="cover",r.style.borderRadius="50%",n.appendChild(r)}else{let r=t==="bot"?"\u2726":Wn(e);n.textContent=r}return n.setAttribute("aria-hidden","true"),n}function Nn(e,t,a){e.textContent="";for(let n of t){let r=o("button","kp-suggestion",n);r.type="button",r.addEventListener("click",async()=>{await a(n)}),e.appendChild(r)}}function oe(e,t,a){Nn(e.suggestions,t,async n=>{e.input.value=n,await a(n)})}function qt(e,t,a){let n=new Set([t,a]);for(let r of Array.from(e.children))n.has(r)||r.remove()}function Xe(e){e.body.classList.add("kp-conversation-active"),e.hero.remove(),e.suggestions.remove()}function fe(e){e.body.classList.remove("kp-conversation-active"),e.hero.isConnected||e.body.prepend(e.hero),e.suggestions.isConnected||e.body.appendChild(e.suggestions),qt(e.body,e.hero,e.suggestions),e.input.value=""}function Bn(e,t,a){for(let n of t)he(e,n.role==="assistant"?"bot":"user",n.text,{...a,...n.citations!==void 0?{citations:n.citations}:{},...n.isLike!==void 0?{initialFeedback:n.isLike}:{},onLike:()=>{a.onLike&&a.onLike(n.text)},onDislike:()=>{a.onDislike&&a.onDislike(n.text)}})}function Wt(e,t,a,n,r,p,s,d){if(e.textContent="",t.textContent="",a.loadingChats){e.appendChild(o("div","kp-full-page-empty",n.loadingChats));return}let u=a.chats.filter(c=>a.chatSearchTerm?c.title.toLowerCase().includes(a.chatSearchTerm):!0);if(u.length>0){let c=u.filter(f=>f.pinned),g=u.filter(f=>!f.pinned).slice(0,8);_t(e,g,a.chatId,n,r,p,s,d),_t(t,c,a.chatId,n,r,p,s,d),g.length===0&&e.appendChild(o("div","kp-full-page-empty",n.noRecentChats)),c.length===0&&t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats));return}e.appendChild(o("div","kp-full-page-empty",n.noChats)),t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats))}function _t(e,t,a,n,r,p,s,d){for(let u of t){let c=o("div",`kp-full-page-item kp-full-page-chat-item${u.chatId===a?" active":""}`),g=o("span","kp-full-page-item-title",u.title),f=o("div","kp-chat-actions"),m=o("button","kp-chat-actions-trigger","\u22EF");m.type="button",m.setAttribute("aria-label",n.chatActions);let A=o("div","kp-chat-actions-menu"),S=o("button","kp-chat-actions-item",u.pinned?n.unpinChat:n.pinChat);S.type="button",S.addEventListener("click",async w=>{w.stopPropagation(),await p(u)});let y=o("button","kp-chat-actions-item",n.renameChat);y.type="button",y.addEventListener("click",async w=>{w.stopPropagation(),await s(u)});let L=o("button","kp-chat-actions-item",n.deleteChat);L.type="button",L.addEventListener("click",async w=>{w.stopPropagation(),await d(u)}),A.append(S,y,L),f.append(m,A),m.addEventListener("click",w=>{w.stopPropagation();let V=f.classList.contains("open");for(let T of Array.from(e.querySelectorAll(".kp-chat-actions.open")))T.classList.remove("open");for(let T of Array.from(e.querySelectorAll(".kp-full-page-chat-item.menu-open")))T.classList.remove("menu-open");V||(f.classList.add("open"),c.classList.add("menu-open"))}),c.append(g,f),c.setAttribute("role","button"),c.tabIndex=0,c.addEventListener("click",async()=>{await r(u)}),c.addEventListener("keydown",async w=>{(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),await r(u))}),c.addEventListener("blur",()=>{f.classList.remove("open"),c.classList.remove("menu-open")}),e.appendChild(c)}}function On(e,t){return e.trim().slice(0,60)||t}function Je(e){return e.toLowerCase().split("-")[0]||"en"}function Dn(e){let t=jt.en;return jt[Je(e)]??t}function jn(e){return["ar","fa","he","ur"].includes(Je(e))}function Wn(e){let t=e.split(/\s+/).filter(Boolean).slice(0,2);return t.length===0?"U":t.map(a=>a[0]?.toUpperCase()??"").join("")}function Ge(e){if(e.knowledgeName?.trim())return e.knowledgeName.trim();if(e.text){let t=e.text.split(`
// `)[0]?.trim();if(t){let a=t.replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();if(a)return a}}if(e.sourceDocument&&/^https?:\/\//i.test(e.sourceDocument)){try{let t=new URL(e.sourceDocument),a=decodeURIComponent(t.pathname),n=a.substring(a.lastIndexOf("/")+1);if(n)return n}catch{}return e.sourceDocument}return e.sourceDocument?.trim()&&!/^c\d+$/i.test(e.sourceDocument)?e.sourceDocument.trim():null}function _n(e,t){let a=Fn(e);return{displayText:a.displayText,citations:t.length>0?Kn(t,a.citations):a.citations}}function Fn(e){let a=Vt(e).split(`
// `),n=-1;for(let u=0;u<a.length;u+=1)/^#{0,6}\s*References\s*$/i.test(a[u]?.trim()??"")&&(n=u);if(n===-1)return{displayText:e,citations:[]};let r=a.slice(0,n).join(`
// `).trimEnd(),p=a.slice(n+1).join(`
// `).trim(),d=qn(p).map(u=>Vn(u)).filter(u=>!!u);return{displayText:r,citations:d}}function qn(e){let t=[],a="";for(let n of e.split(`
// `)){let r=n.trim();if(r){if(/^\d+\.\s+/.test(r)){a&&t.push(a.trim()),a=r.replace(/^\d+\.\s+/,"");continue}a&&(a=`${a} ${r}`)}}return a&&t.push(a.trim()),t}function Vn(e){let t=e.match(/https?:\/\/\S+/i);if(!t)return null;let a=t[0],n=e.slice(0,t.index).replace(/[.\s]+$/,"").trim();return{sourceDocument:a,knowledgeName:n||a}}function Kn(e,t){let a=[],n=new Set;for(let r of[...e,...t]){let p=`${r.knowledgeName??""}::${r.sourceDocument??""}`;n.has(p)||(n.add(p),a.push(r))}return a}function Yn(e,t){let a=o("button","kp-source-chip");a.type="button",a.setAttribute("aria-label",t.openSource);let n=o("span","kp-source-thumb");n.textContent="\u2726";let r=o("span","kp-source-chip-label",Ge(e)??t.untitledSource);return a.append(n,r),a}function Xn(e){let t=o("button","kp-source-chip kp-source-chip-more");t.type="button";let a=o("span","kp-source-thumb-stack");for(let r=0;r<3;r+=1){let p=o("span","kp-source-thumb stacked");p.textContent="\u2726",a.appendChild(p)}let n=o("span","kp-source-chip-label",e.showAll);return t.append(a,n),t}function Jn(e,t,a){let n=o("button","kp-source-card");n.type="button",n.setAttribute("aria-label",t.openSource),n.addEventListener("click",a);let r=o("div","kp-source-card-media"),p=o("span","kp-source-thumb kp-source-thumb-large");p.textContent="\u2726";let s=o("div","kp-source-card-title",Ge(e)??t.untitledSource),d=o("div","kp-source-card-meta"),u=[];return typeof e.score=="number"&&u.push(`${t.sourceScore}: ${e.score.toFixed(2)}`),typeof e.pageNumber=="number"&&u.push(`${t.sourcePage}: ${e.pageNumber}`),e.sheetName&&u.push(`${t.sourceSheet}: ${e.sheetName}`),typeof e.rowNumber=="number"&&u.push(`${t.sourceRow}: ${e.rowNumber}`),e.knowledgeName&&u.push(`${t.sourceKnowledge}: ${e.knowledgeName}`),d.textContent=u.join(" \u2022 "),r.appendChild(p),n.append(r,s,d),n}function Gn(e){if(!e)return null;let t=e.trim();return/^https?:\/\//i.test(t)?t:null}function Qn(e,t){e.innerHTML=Zn(Vt(t))}function Vt(e){return e.replace(/\r\n/g,`
// `)}function Zn(e){return e.split(/\n{2,}/).map(a=>a.trim()).filter(Boolean).map(ea).join("")}function ea(e){let t=e.split(`
// `).map(n=>n.trimEnd());if(t.every(n=>/^\s*\|.*\|\s*$/.test(n))&&t.length>=2)return ta(t);if(t.every(n=>/^\d+\.\s+/.test(n)))return`<ol>${t.map(n=>`<li>${se(n.replace(/^\d+\.\s+/,""))}</li>`).join("")}</ol>`;if(t.every(n=>/^[-*]\s+/.test(n)))return`<ul>${t.map(n=>`<li>${se(n.replace(/^[-*]\s+/,""))}</li>`).join("")}</ul>`;let a=t[0]?.match(/^(#{1,6})\s+(.*)$/);if(a){let n=a[1]??"#",r=a[2]??"",p=n.length;return`<h${p}>${se(r)}</h${p}>`}return`<p>${t.map(n=>se(n)).join("<br>")}</p>`}function ta(e){let t=e.filter((s,d)=>!(d===1&&/^\s*\|?(\s*:?-{3,}:?\s*\|)+\s*$/.test(s))).map(s=>na(s));if(t.length===0)return"";let a=t[0]??[],n=t.slice(1),r=`<thead><tr>${a.map(s=>`<th>${se(s)}</th>`).join("")}</tr></thead>`,p=n.length?`<tbody>${n.map(s=>`<tr>${s.map(d=>`<td>${se(d)}</td>`).join("")}</tr>`).join("")}</tbody>`:"";return`<div class="kp-table-wrap"><table>${r}${p}</table></div>`}function na(e){return e.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(t=>t.trim())}function se(e){let t=q(e);return t=t.replace(/&lt;br\s*\/?&gt;/gi,"<br>"),t=t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>'),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*([^*]+)\*/g,"<em>$1</em>"),t}function q(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ft(e){typeof document>"u"||document.querySelectorAll("[data-chat-widget-host]").forEach(t=>{let a=t.shadowRoot;if(a){let n=a.querySelector(".kp-chat-widget");n&&!n.classList.contains("kp-chat-widget-embedded")&&(t.style.display=e?"none":"")}})}var Kt="0.1.0",Yt=Ie,Xt={init:Yt,createChatWidget:Ie,version:Kt};typeof window<"u"&&(window.ChatWidget=Xt);return zn(aa);})();
// //# sourceMappingURL=browser.iife.js.map

// "use strict";var ChatWidget=(()=>{var Oe=Object.defineProperty;var xn=Object.getOwnPropertyDescriptor;var yn=Object.getOwnPropertyNames;var vn=Object.prototype.hasOwnProperty;var wn=(e,t)=>{for(var a in t)Oe(e,a,{get:t[a],enumerable:!0})},Cn=(e,t,a,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of yn(t))!vn.call(e,r)&&r!==a&&Oe(e,r,{get:()=>t[r],enumerable:!(n=xn(t,r))||n.enumerable});return e};var Ln=e=>Cn(Oe({},"__esModule",{value:!0}),e);var Xn={};wn(Xn,{browserGlobal:()=>jt,createChatWidget:()=>Pe,init:()=>Dt,version:()=>Ot});function Ct(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function De(e,t){let a={...e};for(let n of Object.keys(t)){let r=t[n],p=a[n];if(Ct(p)&&Ct(r)){a[n]=De(p,r);continue}r!==void 0&&(a[n]=r)}return a}function Lt(e){return e instanceof Error?e:typeof e=="string"?new Error(e):new Error("Unexpected widget error")}function pe(e,t){return`${e.replace(/\/$/,"")}/${t.replace(/^\//,"")}`}function q(e,t,a){return{"Content-Type":"application/json",...e.customHeaders,...a?{"X-Chat-User-Context":a}:{},...t?{Authorization:`Bearer ${t}`}:{}}}async function V(e){if(!e.getUserContext)return null;let t=await e.getUserContext();return t?JSON.stringify(t):null}function de(e,t,a={}){let n=t.replace(/\{chatId\}/g,encodeURIComponent(a.chatId??"")).replace(/:chatId\b/g,encodeURIComponent(a.chatId??""));return pe(e.apiBaseUrl,n)}async function K(e,t){let a=`Failed to ${t}. Please try again.`;e.status===400?a="Invalid request. Please check your input and try again.":e.status===401?a="Authentication failed. Please log in again.":e.status===403?a="You do not have permission to perform this action.":e.status===404?a="The requested resource was not found.":e.status===429?a="Too many requests. Please wait a moment and try again.":e.status>=500&&(a="The server is currently experiencing issues. Please try again later.");try{let n=await e.json();n&&typeof n=="object"&&(typeof n.message=="string"?a=n.message:typeof n.error=="string"&&(a=n.error))}catch{}throw new Error(a)}async function At(e,t){let a=e.getAccessToken?await e.getAccessToken():null,n=await V(e),r=de(e,e.endpoints.ask,{chatId:t.chatId}),p={message:t.message,query:t.message,chat_id:t.chatId,knowledgeNames:t.knowledgeNames,knowledge_names:t.knowledgeNames,editLastQa:t.editLastQa??!1,edit_last_qa:t.editLastQa??!1,enableReferences:t.enableReferences??!0,enable_references:t.enableReferences??!0},i=await fetch(r,{method:"POST",headers:q(e,a,n),body:JSON.stringify(p)});i.ok||await K(i,"send message");let d=i.body?.getReader(),u="";if(d)for(;;){let{done:T,value:E}=await d.read();if(T)break;E&&(u+=new TextDecoder("utf-8").decode(E,{stream:!0}))}else u=await i.text();let c;try{c=JSON.parse(u)}catch{return{chatId:t.chatId,answer:u,suggestions:[],citations:[]}}if(!Array.isArray(c)){if(!c.answer||typeof c.answer!="string")throw new Error("Chat backend response is missing a valid answer.");return{chatId:c.chatId??t.chatId,answer:c.answer,suggestions:c.suggestions??[],citations:c.citations??[]}}let g=c[0];if(!g?.answer||typeof g.answer!="string")throw new Error("Chat backend response is missing a valid answer.");let f=g.content,h=f?.source_documents??[],A=f?.scores??[],S=f?.page_numbers??[],v=f?.sheet_names??[],L=f?.row_numbers??[],w=f?.knowledge_names??[],D=h.map((T,E)=>({sourceDocument:T,score:A[E]??null,pageNumber:S[E]??null,sheetName:v[E]??null,rowNumber:L[E]??null,knowledgeName:w[E]??null}));return{chatId:t.chatId,answer:g.answer,suggestions:[],citations:D}}async function Pt(e,t){if(!e.endpoints.history)return[];let a=e.getAccessToken?await e.getAccessToken():null,n=await V(e),p=/(\{chatId\}|:chatId\b)/.test(e.endpoints.history)?de(e,e.endpoints.history,{chatId:t}):(()=>{let c=new URL(pe(e.apiBaseUrl,e.endpoints.history));return c.searchParams.set("chat_id",t),c.toString()})(),i=await fetch(p,{method:"GET",headers:q(e,a,n)});i.ok||await K(i,"fetch chat history");let d=await i.json(),u=Array.isArray(d)?d:d&&typeof d=="object"?d.history??d.messages??d.data??[]:[];return Array.isArray(u)?u.map(c=>{if(!c||typeof c!="object")return null;let g=c;if(typeof g.question=="string"&&typeof g.answer=="string")return[{role:"user",text:g.question},{role:"assistant",text:g.answer}];let f=g.role??g.type??g.sender??g.author,h=g.text??g.message??g.content??g.answer;if(typeof h!="string")return null;let A=typeof f=="string"?f.toLowerCase():"assistant";return[{role:A==="user"||A==="human"?"user":"assistant",text:h,...Array.isArray(g.citations)?{citations:g.citations}:{},...typeof g.isLike=="boolean"?{isLike:g.isLike}:{}}]}).flat().filter(c=>!!c):[]}async function St(e){if(!e.endpoints.listChats)return[];let t=e.getAccessToken?await e.getAccessToken():null,a=await V(e),n=await fetch(pe(e.apiBaseUrl,e.endpoints.listChats),{method:"GET",headers:q(e,t,a)});n.ok||await K(n,"fetch chats");let r=await n.json(),p=Array.isArray(r)?r:r&&typeof r=="object"?r.chats??r.data??r.items??[]:[];return Array.isArray(p)?p.map(i=>{if(!i||typeof i!="object")return null;let d=i,u=d.chatId??d.chat_id??d.id,c=d.title??d.name??d.chatId;if(typeof u!="string"||typeof c!="string")return null;let g=typeof d.createdAt=="string"?d.createdAt:typeof d.created_at=="string"?d.created_at:null,f=typeof d.updatedAt=="string"?d.updatedAt:typeof d.updated_at=="string"?d.updated_at:null,h={chatId:u,title:c,pinned:typeof d.pinned=="boolean"?d.pinned:!1};return g&&(h.createdAt=g),f&&(h.updatedAt=f),h}).filter(i=>!!i):[]}async function Tt(e,t,a){let n=e.endpoints.createChat??e.endpoints.listChats;if(!n)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await V(e),i=await fetch(pe(e.apiBaseUrl,n),{method:"POST",headers:q(e,r,p),body:JSON.stringify({chatId:t,chat_id:t,...a?{title:a}:{}})});i.ok||await K(i,"create chat")}async function je(e,t,a){if(!e.endpoints.updateChat)return;let n=e.getAccessToken?await e.getAccessToken():null,r=await V(e),p=de(e,e.endpoints.updateChat,{chatId:t}),i=await fetch(p,{method:"PUT",headers:q(e,n,r),body:JSON.stringify(a)});i.ok||await K(i,"update chat")}async function Et(e,t){if(!e.endpoints.deleteChat)return;let a=e.getAccessToken?await e.getAccessToken():null,n=await V(e),r=de(e,e.endpoints.deleteChat,{chatId:t}),p=await fetch(r,{method:"DELETE",headers:q(e,a,n)});p.ok||await K(p,"delete chat")}function Y(e,t){let a=Lt(t);return e.onError?.(a),a}async function ce(e,t,a,n){if(!e.endpoints.feedback)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await V(e),i=de(e,e.endpoints.feedback,{chatId:t}),d=await fetch(i,{method:"POST",headers:q(e,r,p),body:JSON.stringify({message:a,isLike:n})});d.ok||await K(d,"submit feedback")}var We={accent:"#0f766e",accentSoft:"#ecfeff",panelBackground:"#ffffff",surfaceBackground:"#f8fafc",text:"#1f2937",mutedText:"#64748b",borderColor:"#dbe4ee",shadow:"0 24px 64px rgba(15, 23, 42, 0.20)",zIndex:2147483e3,fontFamily:'"Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif'},C={displayMode:"widget",position:"bottom-right",title:"Knowledge Assistant",subtitle:"Answers are generated based on your access permissions",welcomeMessage:"How can I assist you today?",inputPlaceholder:"Ask your question...",launcherAriaLabel:"Open chat assistant",closeAriaLabel:"Close chat assistant",initialSuggestions:["Which indicators reflect the achievements of Vision KSA goals?","Case studies of real estate initiatives for economic growth","Study of UX for the ministry external portal"],sourceApp:"knowledge-platform",locale:"en",customHeaders:{},assistantPageUrl:"/knowledge-assistant",embedded:{showHeader:!1},rag:{knowledgeNames:[],enableReferences:!0,loadHistoryOnOpen:!1},theme:We,getAccessToken:void 0,getUserContext:void 0,onOpen:void 0,onClose:void 0,onError:void 0,onOpenAssistantPage:void 0,assistantAvatarUrl:""};function Rt(e){if(!e.apiBaseUrl?.trim())throw new Error("Chat widget config requires a non-empty apiBaseUrl.");if(!e.endpoints?.ask?.trim())throw new Error("Chat widget config requires endpoints.ask to be provided.");let t=e.mount??document.body,a=De(We,e.theme??{});return{apiBaseUrl:e.apiBaseUrl,endpoints:{...e.endpoints},mount:t,assistantAvatarUrl:e.assistantAvatarUrl??C.assistantAvatarUrl,displayMode:e.displayMode??C.displayMode,position:e.position??C.position,title:e.title??C.title,subtitle:e.subtitle??C.subtitle,welcomeMessage:e.welcomeMessage??C.welcomeMessage,inputPlaceholder:e.inputPlaceholder??C.inputPlaceholder,launcherAriaLabel:e.launcherAriaLabel??C.launcherAriaLabel,closeAriaLabel:e.closeAriaLabel??C.closeAriaLabel,initialSuggestions:e.initialSuggestions??C.initialSuggestions,sourceApp:e.sourceApp??C.sourceApp,locale:e.locale??C.locale,customHeaders:e.customHeaders??C.customHeaders,embedded:{...C.embedded,...e.embedded??{}},rag:{...C.rag,...e.rag??{}},assistantPageUrl:e.assistantPageUrl??C.assistantPageUrl,theme:a,getAccessToken:e.getAccessToken,getUserContext:e.getUserContext,onOpen:e.onOpen,onClose:e.onClose,onError:e.onError,onOpenAssistantPage:e.onOpenAssistantPage}}function o(e,t,a){let n=document.createElement(e);return t&&(n.className=t),a!==void 0&&(n.textContent=a),n}var It="kp-chat-widget-styles";function zt(e,t){if(e.getElementById(It))return;let a=document.createElement("style");a.id=It,a.textContent=An(t),e.appendChild(a)}function An(e){return`
//     :host {
//       all: initial;
//     }

//     .kp-chat-widget {
//       --kp-accent: ${e.accent};
//       --kp-accent-soft: ${e.accentSoft};
//       --kp-panel-background: ${e.panelBackground};
//       --kp-surface-background: ${e.surfaceBackground};
//       --kp-text: ${e.text};
//       --kp-muted-text: ${e.mutedText};
//       --kp-border-color: ${e.borderColor};
//       --kp-shadow: ${e.shadow};
//       --kp-z-index: ${e.zIndex};
//       --kp-font-family: ${e.fontFamily};
//       --kp-card-background: rgba(255, 255, 255, 0.92);
//       --kp-soft-highlight: rgba(236, 254, 255, 0.82);
//       position: fixed;
//       bottom: 24px;
//       right: 24px;
//       z-index: var(--kp-z-index);
//       font-family: var(--kp-font-family);
//       color: var(--kp-text);
//       box-sizing: border-box;
//     }

//     .kp-chat-widget.kp-chat-widget-embedded {
//       position: relative;
//       inset: auto;
//       width: 100%;
//       height: 100%;
//       min-height: 640px;
//       display: block;
//     }

//     *,
//     *::before,
//     *::after {
//       box-sizing: border-box;
//       font-family: inherit;
//     }

//     .kp-chat-widget.bottom-left {
//       left: 24px;
//       right: auto;
//     }

//     .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
//       left: auto;
//       right: auto;
//     }

//     .kp-rtl .kp-dropdown-item,
//     .kp-rtl .kp-suggestion,
//     .kp-rtl .kp-input,
//     .kp-rtl .kp-full-page-search-input,
//     .kp-rtl .kp-bubble-content,
//     .kp-rtl .kp-source-card,
//     .kp-rtl .kp-source-panel {
//       text-align: right;
//     }

//     .kp-launcher {
//       width: 72px;
//       height: 72px;
//       border: none;
//       border-radius: 999px;
//       cursor: pointer;
//       background: radial-gradient(circle at 30% 30%, #f8fffe 0%, #ecfdf5 52%, #d6f4ef 100%);
//       box-shadow: 0 16px 32px rgba(15, 118, 110, 0.18);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease;
//       color: var(--kp-accent);
//       position: relative;
//       overflow: hidden;
//     }

//     .kp-launcher:hover {
//       transform: translateY(-1px);
//       box-shadow: 0 20px 36px rgba(15, 118, 110, 0.22);
//     }

//     .kp-launcher:focus-visible,
//     .kp-close:focus-visible,
//     .kp-send:focus-visible,
//     .kp-suggestion:focus-visible,
//     .kp-input:focus-visible,
//     .kp-full-page-new-chat:focus-visible,
//     .kp-full-page-close:focus-visible,
//     .kp-full-page-chat-item:focus-visible,
//     .kp-chat-pin:focus-visible,
//     .kp-message-action:focus-visible,
//     .kp-source-chip:focus-visible,
//     .kp-source-panel-close:focus-visible {
//       outline: 2px solid var(--kp-accent);
//       outline-offset: 2px;
//     }

//     .kp-launcher.hidden {
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(8px) scale(0.96);
//     }

//     .kp-star-cluster {
//       position: relative;
//       width: 50px;
//       height: 50px;
//       animation: kp-cluster-rotate 8.5s linear infinite;
//     }

//     .kp-star {
//       position: absolute;
//       color: #08384c;
//       line-height: 1;
//       transform-origin: center;
//     }

//     .kp-star.main {
//       top: 50%;
//       left: 50%;
//       font-size: 30px;
//       transform: translate(-50%, -50%) scale(0.96);
//       animation: kp-main-pulse 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-a {
//       top: -3px;
//       left: 50%;
//       font-size: 18px;
//       transform: translateX(-50%);
//       animation: kp-orbit-a 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-b {
//       right: -3px;
//       bottom: 5px;
//       font-size: 18px;
//       animation: kp-orbit-b 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-c {
//       left: -1px;
//       bottom: 5px;
//       font-size: 18px;
//       animation: kp-orbit-c 3s ease-in-out infinite;
//     }

//     .kp-overlay {
//       position: fixed;
//       inset: 0;
//       background: rgba(15, 23, 42, 0.18);
//       opacity: 0;
//       pointer-events: none;
//       transition: opacity 220ms ease;
//     }

//     .kp-overlay.visible {
//       opacity: 1;
//       pointer-events: auto;
//     }

//     .kp-panel {
//       position: fixed;
//       bottom: 88px;
//       right: 24px;
//       width: min(480px, calc(100vw - 48px));
//       height: min(730px, calc(100vh - 118px));
//       background: var(--kp-panel-background);
//       border: 1px solid rgba(255, 255, 255, 0.35);
//       border-radius: 24px;
//       box-shadow: var(--kp-shadow);
//       overflow: hidden;
//       display: flex;
//       flex-direction: column;
//       opacity: 0;
//       transform: translateX(112px) scale(0.97);
//       transform-origin: bottom right;
//       pointer-events: none;
//       transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
//         transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
//     }

//     .kp-chat-widget.bottom-left .kp-panel {
//       left: 24px;
//       right: auto;
//       transform: translateX(-112px) scale(0.97);
//       transform-origin: bottom left;
//     }

//     .kp-chat-widget .kp-panel.open,
//     .kp-chat-widget.bottom-left .kp-panel.open {
//       opacity: 1;
//       transform: translateX(0) scale(1);
//       pointer-events: auto;
//     }

//     .kp-full-page {
//       position: fixed;
//       inset: 0;
//       background: #ffffff;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(18px);
//       transition: opacity 260ms ease, transform 320ms ease;
//       z-index: calc(var(--kp-z-index) + 2);
//       overflow: hidden;
//     }

//     .kp-full-page.kp-full-page-embedded {
//       position: relative;
//       inset: auto;
//       opacity: 1;
//       pointer-events: auto;
//       transform: none;
//       min-height: 100%;
//       height: 100%;
//       z-index: auto;
//       background: transparent;
//     }

//     .kp-full-page.open {
//       opacity: 1;
//       pointer-events: auto;
//       transform: translateY(0);
//     }

//     .kp-full-page-shell {
//       height: 100vh;
//       display: flex;
//       flex-direction: column;
//       padding: 22px 28px 26px;
//       gap: 16px;
//       overflow: hidden;
//     }

//     .kp-full-page-embedded .kp-full-page-shell {
//       height: 100%;
//       min-height: 100%;
//       padding: 0;
//       gap: 12px;
//     }

//     .kp-full-page-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 16px;
//       padding: 8px 4px 0;
//       flex: none;
//     }

//     .kp-hidden {
//       display: none !important;
//     }

//     .kp-full-page-brand {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       color: #08384c;
//     }

//     .kp-full-page-brand-mark {
//       width: 44px;
//       height: 44px;
//       border-radius: 14px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: linear-gradient(135deg, rgba(37, 181, 192, 0.14), rgba(15, 118, 110, 0.08));
//       font-size: 26px;
//       box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
//     }

//     .kp-full-page-brand-text {
//       font-size: 20px;
//       font-weight: 700;
//       letter-spacing: -0.02em;
//       color: #16394b;
//     }

//     .kp-full-page-header-actions {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//     }

//     .kp-full-page-badge {
//       padding: 10px 14px;
//       border-radius: 999px;
//       font-size: 13px;
//       line-height: 1;
//       color: #0b556c;
//       background: rgba(255, 255, 255, 0.82);
//       border: 1px solid rgba(15, 118, 110, 0.12);
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//     }

//     .kp-full-page-close,
//     .kp-source-panel-close {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 14px;
//       background: rgba(255, 255, 255, 0.82);
//       color: #61788a;
//       font-size: 24px;
//       line-height: 1;
//       cursor: pointer;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//     }

//     .kp-full-page-content {
//       display: grid;
//       grid-template-columns: 290px minmax(0, 1fr) minmax(0, 0);
//       gap: 16px;
//       flex: 1;
//       min-height: 0;
//       overflow: hidden;
//       align-items: stretch;
//     }

//     .kp-full-page-embedded .kp-full-page-content {
//       height: 100%;
//     }

//     .kp-full-page-sidebar,
//     .kp-full-page-panel,
//     .kp-source-panel {
//       border-radius: 24px;
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       background: rgba(255, 255, 255, 0.88);
//       box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
//       backdrop-filter: blur(12px);
//     }

//     .kp-full-page-sidebar {
//       padding: 18px;
//       display: flex;
//       flex-direction: column;
//       gap: 16px;
//       min-height: 0;
//       overflow: auto;
//     }

//     .kp-full-page-new-chat {
//       width: 100%;
//       height: 48px;
//       border: none;
//       border-radius: 12px;
//       background: linear-gradient(135deg, #0a465d 0%, #0f6a75 100%);
//       color: #ffffff;
//       font-size: 16px;
//       font-weight: 600;
//       cursor: pointer;
//       box-shadow: 0 14px 30px rgba(10, 70, 93, 0.18);
//     }

//     .kp-full-page-search {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       height: 44px;
//       border-radius: 12px;
//       border: 1px solid rgba(203, 213, 225, 0.95);
//       background: #ffffff;
//       padding: 0 12px;
//     }

//     .kp-full-page-search-input {
//       flex: 1;
//       border: none;
//       outline: none;
//       background: transparent;
//       color: #334155;
//       font-size: 14px;
//       min-width: 0;
//       box-shadow: none;
//     }

//     .kp-full-page-search-input:focus,
//     .kp-full-page-search-input:focus-visible,
//     .kp-full-page-search-input:active {
//       outline: none;
//       box-shadow: none;
//       border: none;
//     }

//     .kp-full-page-search-icon {
//       color: #607082;
//       font-size: 20px;
//       line-height: 1;
//     }

//     .kp-full-page-section-label {
//       font-size: 12px;
//       line-height: 1.4;
//       text-transform: uppercase;
//       letter-spacing: 0.08em;
//       color: #8a98a6;
//       margin-top: 4px;
//     }

//     .kp-full-page-recent-list,
//     .kp-full-page-pinned-list {
//       display: flex;
//       flex-direction: column;
//       gap: 8px;
//     }

//     .kp-full-page-item {
//       padding: 12px 12px 13px;
//       border-radius: 14px;
//       color: #293845;
//       font-size: 15px;
//       line-height: 1.5;
//       background: rgba(247, 250, 252, 0.9);
//       border: 1px solid rgba(219, 228, 238, 0.88);
//     }

//     .kp-full-page-chat-item {
//       position: relative;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 10px;
//       cursor: pointer;
//       transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;
//       overflow: visible;
//     }

//     .kp-full-page-chat-item:hover {
//       border-color: rgba(15, 118, 110, 0.34);
//       background: rgba(240, 253, 250, 0.95);
//       transform: translateY(-1px);
//     }

//     .kp-full-page-chat-item.active {
//       border-color: rgba(15, 118, 110, 0.5);
//       background: rgba(220, 252, 231, 0.72);
//     }

//     .kp-full-page-chat-item.menu-open {
//       z-index: 4;
//     }

//     .kp-full-page-item-title {
//       min-width: 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       flex: 1;
//     }

//     .kp-chat-pin {
//       flex: none;
//       border: none;
//       background: transparent;
//       color: #0f6a75;
//       font-size: 16px;
//       line-height: 1;
//       padding: 0;
//       cursor: pointer;
//     }

//     .kp-full-page-empty {
//       padding: 8px 4px 0;
//       color: #7a8a99;
//       font-size: 14px;
//       line-height: 1.5;
//     }

//     .kp-full-page-main {
//       min-width: 0;
//       min-height: 0;
//       display: flex;
//     }

//     .kp-full-page-panel {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       min-height: 0;
//       overflow: hidden;
//     }

//     .kp-source-panel {
//       min-width: 0;
//       min-height: 0;
//       overflow: hidden;
//       display: none;
//       flex-direction: column;
//     }

//     .kp-source-panel.open {
//       display: flex;
//     }

//     .kp-full-page-content:has(.kp-source-panel.open) {
//       grid-template-columns: 290px minmax(0, 1fr) 320px;
//     }

//     .kp-source-panel-header {
//       display: flex;
//       align-items: flex-start;
//       justify-content: space-between;
//       gap: 12px;
//       padding: 18px 18px 12px;
//       border-bottom: 1px solid rgba(219, 228, 238, 0.7);
//     }

//     .kp-source-panel-title {
//       font-size: 17px;
//       font-weight: 700;
//       color: #16394b;
//     }

//     .kp-source-panel-subtitle {
//       margin-top: 4px;
//       font-size: 12px;
//       color: #7a8a99;
//     }

//     .kp-source-panel-list {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       padding: 16px;
//       overflow: auto;
//     }

//     .kp-source-panel-empty {
//       color: #7a8a99;
//       font-size: 14px;
//       line-height: 1.5;
//     }

//     .kp-source-card {
//       width: 100%;
//       text-align: left;
//       cursor: pointer;
//       appearance: none;
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       border-radius: 16px;
//       background: #ffffff;
//       padding: 14px;
//     }

//     .kp-source-card-media {
//       display: flex;
//       align-items: center;
//       margin-bottom: 10px;
//     }

//     .kp-source-thumb,
//     .kp-source-thumb-large {
//       flex: none;
//       width: 32px;
//       height: 32px;
//       border-radius: 999px;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       background: linear-gradient(180deg, #eefcf8 0%, #dff7f2 100%);
//       border: 1px solid rgba(15, 118, 110, 0.18);
//       color: #0f6a75;
//       font-size: 14px;
//       line-height: 1;
//       box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
//     }

//     .kp-source-thumb-large {
//       width: 42px;
//       height: 42px;
//       font-size: 18px;
//     }

//     .kp-source-card-title {
//       font-size: 14px;
//       font-weight: 700;
//       color: #16394b;
//       word-break: break-word;
//     }

//     .kp-source-card-meta {
//       margin-top: 8px;
//       font-size: 12px;
//       line-height: 1.5;
//       color: #667a8d;
//       word-break: break-word;
//     }

//     .kp-full-page-body {
//       flex: 1;
//       overflow: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 14px;
//       padding: 42px 28px 18px;
//       background: #ffffff;
//       scroll-behavior: smooth;
//     }

//     .kp-full-page-body.kp-conversation-active {
//       padding-top: 24px;
//     }

//     .kp-full-page-hero {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       text-align: center;
//       gap: 22px;
//       padding: 18px 18px 12px;
//       max-width: 880px;
//       width: 100%;
//       margin: 0 auto;
//     }

//     .kp-full-page-hero-badge {
//       width: 140px;
//       height: 140px;
//       border-radius: 999px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: radial-gradient(circle at 30% 30%, #f8fdff 0%, #edf8ff 50%, #e4eef8 100%);
//       box-shadow:
//         inset 0 2px 0 rgba(255, 255, 255, 0.9),
//         0 22px 40px rgba(15, 23, 42, 0.08);
//     }

//     .kp-star-cluster-static {
//       animation: none;
//     }

//     .kp-full-page-hero-text {
//       max-width: 760px;
//       font-size: 26px;
//       line-height: 1.5;
//       font-weight: 700;
//       letter-spacing: -0.03em;
//       color: #374151;
//     }

//     .kp-full-page-suggestions {
//       width: min(520px, 100%);
//       margin: auto auto 0;
//     }

//     .kp-full-page-footer {
//       flex: none;
//       padding: 0 16px 18px;
//       background: rgba(255, 255, 255, 0.72);
//       border-top: 1px solid rgba(219, 228, 238, 0.75);
//     }

//     .kp-full-page-form {
//       max-width: none;
//       min-height: 56px;
//       border-radius: 16px;
//     }

//     .kp-full-page-note {
//       font-size: 13px;
//       margin-top: 10px;
//     }

//     .kp-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       gap: 12px;
//       padding: 18px 18px 8px;
//       background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
//     }

//     .kp-toolbar {
//       position: relative;
//       display: flex;
//       align-items: center;
//       gap: 8px;
//     }

//     .kp-tool-button {
//       width: 36px;
//       height: 36px;
//       border: none;
//       border-radius: 12px;
//       background: transparent;
//       color: #0f4f68;
//       cursor: pointer;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       padding: 0;
//       transition: background 140ms ease;
//     }

//     .kp-tool-button:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-pencil-icon {
//       width: 22px;
//       height: 22px;
//       position: relative;
//       display: inline-block;
//     }

//     .kp-pencil-icon::before {
//       content: "";
//       position: absolute;
//       width: 14px;
//       height: 2.5px;
//       background: currentColor;
//       border-radius: 999px;
//       transform: rotate(-45deg);
//       top: 3px;
//       right: 1px;
//     }

//     .kp-pencil-icon::after {
//       content: "";
//       position: absolute;
//       left: 2px;
//       bottom: 2px;
//       width: 11px;
//       height: 11px;
//       border: 2px solid currentColor;
//       border-radius: 4px;
//     }

//     .kp-chevron {
//       font-size: 13px;
//       color: #66839a;
//       transition: transform 160ms ease;
//       margin-left: -2px;
//     }

//     .kp-menu-trigger.open .kp-chevron {
//       transform: rotate(180deg);
//     }

//     .kp-dropdown {
//       position: absolute;
//       top: 44px;
//       left: 0;
//       width: 184px;
//       background: #ffffff;
//       border: 1px solid rgba(15, 79, 104, 0.12);
//       border-radius: 10px;
//       box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
//       padding: 8px;
//       opacity: 0;
//       transform: translateY(-6px);
//       pointer-events: none;
//       transition: opacity 180ms ease, transform 180ms ease;
//       z-index: 2;
//     }

//     .kp-rtl .kp-dropdown {
//       left: auto;
//       right: 0;
//     }

//     .kp-dropdown.open {
//       opacity: 1;
//       transform: translateY(0);
//       pointer-events: auto;
//     }

//     .kp-dropdown-item {
//       width: 100%;
//       border: none;
//       background: transparent;
//       text-align: left;
//       padding: 10px 12px;
//       border-radius: 8px;
//       font-size: 14px;
//       color: var(--kp-text);
//       cursor: pointer;
//     }

//     .kp-dropdown-item:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-title-wrap {
//       display: none;
//     }

//     .kp-close {
//       border: none;
//       background: transparent;
//       font-size: 24px;
//       line-height: 1;
//       color: var(--kp-muted-text);
//       cursor: pointer;
//       padding: 0;
//     }

//     .kp-body {
//       flex: 1;
//       overflow: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       padding: 10px 16px 16px;
//       background: linear-gradient(180deg, #ffffff 0%, var(--kp-surface-background) 100%);
//       scroll-behavior: smooth;
//     }

//     .kp-body.kp-conversation-active {
//       padding-top: 16px;
//     }

//     .kp-panel.kp-sheet-open .kp-body,
//     .kp-panel.kp-sheet-open .kp-footer,
//     .kp-panel.kp-sheet-open .kp-header {
//       opacity: 0;
//       pointer-events: none;
//     }

//     .kp-my-chats-sheet {
//       position: absolute;
//       inset: 0;
//       border-radius: inherit;
//       border: none;
//       background: #ffffff;
//       box-shadow: none;
//       display: none;
//       flex-direction: column;
//       z-index: 3;
//       overflow: hidden;
//     }

//     .kp-my-chats-sheet.open {
//       display: flex;
//     }

//     .kp-my-chats-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       padding: 18px 18px 10px;
//       flex: none;
//       background: #ffffff;
//     }

//     .kp-my-chats-nav {
//       width: 36px;
//       height: 36px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: #61788a;
//       font-size: 22px;
//       line-height: 1;
//       cursor: pointer;
//     }

//     .kp-my-chats-body {
//       flex: 1;
//       overflow: auto;
//       padding: 8px 18px 18px;
//       background: #ffffff;
//     }

//     .kp-my-chats-section-label {
//       font-size: 14px;
//       line-height: 1.5;
//       color: #7a8a99;
//       margin: 14px 0 10px;
//     }

//     .kp-my-chats-list {
//       display: flex;
//       flex-direction: column;
//       gap: 10px;
//     }

//     .kp-chat-actions {
//       position: relative;
//       flex: none;
//     }

//     .kp-chat-actions-trigger {
//       width: 28px;
//       height: 28px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: #526678;
//       font-size: 20px;
//       line-height: 1;
//       cursor: pointer;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//     }

//     .kp-chat-actions-menu {
//       position: absolute;
//       top: 30px;
//       inset-inline-end: 0;
//       width: 120px;
//       padding: 8px;
//       border-radius: 10px;
//       border: 1px solid rgba(219, 228, 238, 0.95);
//       background: #ffffff;
//       box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14);
//       display: none;
//       flex-direction: column;
//       gap: 2px;
//       z-index: 20;
//     }

//     .kp-chat-actions.open .kp-chat-actions-menu {
//       display: flex;
//     }

//     .kp-chat-actions-item {
//       width: 100%;
//       border: none;
//       background: transparent;
//       color: #1f2937;
//       text-align: left;
//       padding: 10px 12px;
//       border-radius: 8px;
//       font-size: 14px;
//       cursor: pointer;
//     }

//     .kp-chat-actions-item:hover {
//       background: rgba(241, 245, 249, 0.95);
//     }

//     .kp-hero {
//       display: flex;
//       gap: 10px;
//       padding: 4px 2px 8px;
//       align-items: flex-start;
//     }

//     .kp-hero-icon {
//       color: #0ea5b7;
//       font-size: 28px;
//       line-height: 1;
//       margin-top: 2px;
//     }

//     .kp-hero-text {
//       font-size: 20px;
//       line-height: 1.45;
//       font-weight: 700;
//       color: #374151;
//     }

//     .kp-message-row {
//       display: flex;
//       align-items: flex-start;
//       gap: 10px;
//       width: 100%;
//     }

//     .kp-message-row.user {
//       justify-content: flex-end;
//     }

//     .kp-avatar {
//       flex: none;
//       width: 36px;
//       height: 36px;
//       border-radius: 999px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 13px;
//       font-weight: 700;
//       box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
//     }

//     .kp-avatar.bot {
//       background: linear-gradient(180deg, #e8fbff 0%, #dff7f2 100%);
//       color: #0f6a75;
//       border: 1px solid rgba(15, 118, 110, 0.16);
//     }

//     .kp-avatar.user {
//       background: linear-gradient(180deg, #fff4ee 0%, #fbe3d5 100%);
//       color: #8c4b1f;
//       border: 1px solid rgba(180, 102, 43, 0.16);
//     }

//     .kp-bubble {
//       max-width: min(85%, 720px);
//       padding: 14px 16px;
//       border-radius: 20px;
//       font-size: 14px;
//       line-height: 1.65;
//       border: 1px solid var(--kp-border-color);
//       background: #ffffff;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
//     }

//     .kp-bubble.user {
//       background: linear-gradient(180deg, #fff8f3 0%, #fdf1e8 100%);
//       border-color: rgba(222, 184, 135, 0.34);
//     }

//     .kp-bubble.bot {
//       background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
//     }

//     .kp-bubble-content {
//       color: var(--kp-text);
//       white-space: normal;
//       word-break: break-word;
//     }

//     .kp-bubble-content p,
//     .kp-bubble-content ul,
//     .kp-bubble-content ol,
//     .kp-bubble-content table,
//     .kp-bubble-content blockquote {
//       margin: 0;
//     }

//     .kp-bubble-content p + p,
//     .kp-bubble-content p + ul,
//     .kp-bubble-content p + ol,
//     .kp-bubble-content ul + p,
//     .kp-bubble-content ol + p,
//     .kp-bubble-content .kp-table-wrap + p,
//     .kp-bubble-content p + .kp-table-wrap,
//     .kp-bubble-content h1 + p,
//     .kp-bubble-content h2 + p,
//     .kp-bubble-content h3 + p {
//       margin-top: 12px;
//     }

//     .kp-bubble-content h1,
//     .kp-bubble-content h2,
//     .kp-bubble-content h3,
//     .kp-bubble-content h4,
//     .kp-bubble-content h5,
//     .kp-bubble-content h6 {
//       margin: 0 0 10px;
//       font-size: 16px;
//       line-height: 1.4;
//       color: #16394b;
//     }

//     .kp-bubble-content ul,
//     .kp-bubble-content ol {
//       padding-inline-start: 20px;
//     }

//     .kp-bubble-content code {
//       padding: 2px 6px;
//       border-radius: 8px;
//       background: rgba(226, 232, 240, 0.66);
//       font-size: 0.92em;
//     }

//     .kp-bubble-content a {
//       color: #0f6a75;
//       text-decoration: underline;
//     }

//     .kp-table-wrap {
//       overflow-x: auto;
//       margin-top: 8px;
//     }

//     .kp-bubble-content table {
//       width: 100%;
//       border-collapse: collapse;
//       border: 1px solid rgba(203, 213, 225, 0.95);
//       border-radius: 14px;
//       overflow: hidden;
//       background: #ffffff;
//     }

//     .kp-bubble-content th,
//     .kp-bubble-content td {
//       padding: 10px 12px;
//       border-bottom: 1px solid rgba(226, 232, 240, 0.95);
//       border-inline-end: 1px solid rgba(226, 232, 240, 0.95);
//       vertical-align: top;
//       text-align: start;
//     }

//     .kp-bubble-content tr:last-child td {
//       border-bottom: none;
//     }

//     .kp-bubble-content th:last-child,
//     .kp-bubble-content td:last-child {
//       border-inline-end: none;
//     }

//     .kp-bubble-content th {
//       background: #f4fbfc;
//       color: #16394b;
//       font-weight: 700;
//     }

//     .kp-meta {
//       font-size: 11px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//       margin-top: 10px;
//     }

//     .kp-source-preview {
//       margin-top: 10px;
//       padding: 12px;
//       border-radius: 16px;
//       border: 1px solid rgba(219, 228, 238, 0.88);
//       background: #ffffff;
//     }

//     .kp-source-preview-title {
//       font-size: 12px;
//       font-weight: 700;
//       color: #16394b;
//       margin-bottom: 8px;
//     }

//     .kp-source-preview-list {
//       display: flex;
//       flex-wrap: nowrap;
//       gap: 8px;
//       overflow-x: auto;
//     }

//     .kp-source-chip {
//       display: inline-flex;
//       align-items: center;
//       gap: 10px;
//       border: 1px solid rgba(15, 118, 110, 0.16);
//       background: #ffffff;
//       color: #0f4f68;
//       border-radius: 999px;
//       padding: 8px 12px;
//       cursor: pointer;
//       font-size: 12px;
//       line-height: 1.3;
//       max-width: 100%;
//       min-width: 0;
//     }

//     .kp-source-chip-more {
//       background: rgba(236, 254, 255, 0.9);
//     }

//     .kp-source-chip-label {
//       min-width: 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//     }

//     .kp-source-thumb-stack {
//       display: inline-flex;
//       align-items: center;
//       margin-inline-end: 2px;
//     }

//     .kp-source-thumb.stacked {
//       margin-inline-end: -10px;
//       background: #ffffff;
//     }

//     .kp-message-actions {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       margin-top: 10px;
//     }

//     .kp-message-action {
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       background: #ffffff;
//       color: #4b6478;
//       border-radius: 999px;
//       padding: 7px 10px;
//       cursor: pointer;
//       font-size: 12px;
//       line-height: 1;
//     }

//     .kp-message-action.active {
//       color: #0f6a75;
//       border-color: rgba(15, 118, 110, 0.3);
//       background: rgba(236, 254, 255, 0.92);
//     }

//     .kp-suggestions {
//       display: flex;
//       flex-direction: column;
//       gap: 10px;
//       margin-top: auto;
//     }

//     .kp-suggestion {
//       border: 1px solid rgba(15, 118, 110, 0.18);
//       background: rgba(247, 251, 255, 0.92);
//       color: var(--kp-text);
//       border-radius: 999px;
//       padding: 11px 14px;
//       cursor: pointer;
//       text-align: left;
//       font-size: 14px;
//       line-height: 1.35;
//     }

//     .kp-footer {
//       padding: 10px 16px 12px;
//       border-top: 1px solid rgba(219, 228, 238, 0.85);
//       background: #ffffff;
//     }

//     .kp-form {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       border: 1px solid var(--kp-border-color);
//       border-radius: 16px;
//       padding: 10px 12px;
//       background: #ffffff;
//     }


//     .kp-input {
//       flex: 1;
//       border: none;
//       outline: none;
//       box-shadow: none;
//       background: transparent;
//       color: var(--kp-text);
//       font-size: 14px;
//       line-height: 1.5;
//       min-width: 0;
//       appearance: none;
//     }

//     .kp-input:focus,
//     .kp-input:focus-visible,
//     .kp-input:active {
//       border: none;
//       outline: none;
//       box-shadow: none;
//     }

//     .kp-send {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 999px;
//       background: #e4f1f8;
//       color: var(--kp-accent);
//       cursor: pointer;
//       font-size: 20px;
//       line-height: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex: none;
//     }
//     .kp-rtl .kp-send {
//       transform: none; /* remove mirroring for RTL, keep button orientation */
//     }

//     .kp-attach {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: var(--kp-accent);
//       cursor: pointer;
//       font-size: 20px;
//       line-height: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex: none;
//       transition: background 140ms ease;
//     }

//     .kp-attach:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-attachment-badge {
//       display: inline-flex;
//       align-items: center;
//       padding: 4px 10px;
//       margin-bottom: 8px;
//       border-radius: 12px;
//       background: rgba(228, 241, 248, 0.8);
//       color: var(--kp-accent);
//       font-size: 12px;
//       font-weight: 500;
//       border: 1px solid rgba(15, 118, 110, 0.2);
//     }


//     .kp-note {
//       margin-top: 8px;
//       text-align: center;
//       font-size: 11px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//     }

//     .kp-loading {
//       font-size: 13px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//       padding: 4px 2px;
//     }

//     @media (max-width: 1100px) {
//       .kp-full-page-content:has(.kp-source-panel.open) {
//         grid-template-columns: 260px minmax(0, 1fr);
//       }

//       .kp-source-panel.open {
//         position: absolute;
//         inset-inline-end: 28px;
//         top: 92px;
//         bottom: 26px;
//         width: min(320px, calc(100vw - 56px));
//         z-index: 3;
//       }
//     }

//     .kp-full-page-menu-btn {
//       display: none;
//       background: none;
//       border: none;
//       font-size: 24px;
//       color: #374151;
//       cursor: pointer;
//       margin-inline-end: 12px;
//       padding: 4px;
//       line-height: 1;
//     }

//     @media (max-width: 860px) {
//       .kp-full-page-menu-btn {
//         display: block;
//       }

//       .kp-full-page-content {
//         display: flex;
//         flex-direction: column;
//       }

//       .kp-full-page-content:has(.kp-source-panel.open) {
//         display: grid;
//         grid-template-columns: 1fr;
//         grid-template-rows: 1fr auto;
//       }

//       .kp-full-page-sidebar {
//         position: fixed;
//         top: 0;
//         left: -100%;
//         width: 280px;
//         height: 100%;
//         max-height: 100vh !important;
//         z-index: 1000;
//         background: #ffffff;
//         box-shadow: 4px 0 24px rgba(0,0,0,0.1);
//         transition: left 0.3s ease;
//         flex: none;
//       }

//       .kp-full-page-sidebar.open {
//         left: 0;
//       }

//       .kp-rtl .kp-full-page-sidebar {
//         left: auto;
//         right: -100%;
//         transition: right 0.3s ease;
//         box-shadow: -4px 0 24px rgba(0,0,0,0.1);
//       }

//       .kp-rtl .kp-full-page-sidebar.open {
//         right: 0;
//       }

//       .kp-full-page-embedded .kp-full-page-sidebar {
//         /* max-height: none; handled by !important above */
//       }

//       .kp-source-panel.open {
//         position: static;
//         inset: auto;
//         width: auto;
//         max-height: 280px;
//       }
//     }

//     @media (max-width: 640px) {
//       .kp-chat-widget,
//       .kp-chat-widget.bottom-left {
//         left: auto;
//         right: 16px;
//         bottom: 16px;
//       }

//       .kp-chat-widget.kp-chat-widget-embedded,
//       .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
//         left: auto;
//         right: auto;
//         bottom: auto;
//       }

//       .kp-panel,
//       .kp-chat-widget.bottom-left .kp-panel {
//         inset: 0;
//         width: 100vw;
//         height: 100vh;
//         border-radius: 0;
//         transform: translateX(72px) scale(0.985);
//         transform-origin: center right;
//       }

//       .kp-panel.open {
//         transform: translateX(0) scale(1);
//       }

//       .kp-full-page-shell {
//         padding: 14px;
//       }

//       .kp-full-page-embedded .kp-full-page-shell {
//         padding: 0;
//       }

//       .kp-full-page-header {
//         padding: 0;
//       }

//       .kp-full-page-body {
//         padding: 24px 16px 16px;
//       }

//       .kp-full-page-hero-badge {
//         width: 112px;
//         height: 112px;
//       }

//       .kp-full-page-hero-text {
//         font-size: 22px;
//       }

//       .kp-message-row {
//         gap: 8px;
//       }

//       .kp-avatar {
//         width: 32px;
//         height: 32px;
//       }

//       .kp-bubble {
//         max-width: calc(100% - 40px);
//       }
//     }

//     @keyframes kp-cluster-rotate {
//       from { transform: rotate(0deg); }
//       to { transform: rotate(360deg); }
//     }

//     @keyframes kp-main-pulse {
//       0%, 100% { transform: translate(-50%, -50%) scale(0.82); opacity: 0.45; }
//       38% { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
//       60% { transform: translate(-50%, -50%) scale(0.94); opacity: 0.88; }
//     }

//     @keyframes kp-orbit-a {
//       0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
//       40% { transform: translate(-50%, 17px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(-50%, 2px) scale(1); opacity: 0.98; }
//     }

//     @keyframes kp-orbit-b {
//       0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
//       40% { transform: translate(-16px, -13px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(-2px, -2px) scale(1); opacity: 0.98; }
//     }

//     @keyframes kp-orbit-c {
//       0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
//       40% { transform: translate(16px, -13px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(2px, -2px) scale(1); opacity: 0.98; }
//     }

//     /* In-Widget Premium Document Preview Overlay Styles */
//     .kp-citation-overlay {
//       position: fixed;
//       inset: 0;
//       background: #f8fafc;
//       color: #1f2937;
//       display: flex;
//       flex-direction: column;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(18px);
//       transition: opacity 260ms ease, transform 320ms ease;
//       z-index: 100000;
//       overflow: hidden;
//       box-sizing: border-box;
//     }

//     .kp-chat-widget-embedded .kp-citation-overlay {
//       position: absolute;
//       inset: 0;
//       z-index: 100000;
//     }

//     .kp-citation-overlay.open {
//       opacity: 1;
//       pointer-events: auto;
//       transform: translateY(0);
//     }

//     .kp-citation-overlay-header {
//       background: #ffffff;
//       border-bottom: 1px solid rgba(226, 232, 240, 0.8);
//       height: 64px;
//       display: flex;
//       align-items: center;
//       padding: 0 24px;
//       justify-content: space-between;
//       flex: none;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-brand {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       font-weight: 600;
//       font-size: 16px;
//       color: #0f766e;
//     }

//     .kp-citation-overlay-brand-logo {
//       font-size: 20px;
//     }

//     .kp-citation-overlay-close {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 14px;
//       background: rgba(255, 255, 255, 0.82);
//       color: #61788a;
//       font-size: 24px;
//       line-height: 1;
//       cursor: pointer;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: background 140ms ease;
//     }

//     .kp-citation-overlay-close:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-citation-overlay-content {
//       display: grid;
//       grid-template-columns: 380px minmax(0, 1fr);
//       flex: 1;
//       overflow: hidden;
//       align-items: stretch;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-metadata-panel {
//       background: #ffffff;
//       border-right: 1px solid #e2e8f0;
//       padding: 32px 24px;
//       overflow-y: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 24px;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-viewer-panel {
//       flex: 1;
//       background: #f1f5f9;
//       display: flex;
//       flex-direction: column;
//       overflow: hidden;
//       box-sizing: border-box;
//     }

//     .doc-badge-wrapper {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }

//     .doc-icon {
//       background: #ecfeff;
//       color: #0f766e;
//       width: 48px;
//       height: 48px;
//       border-radius: 12px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 20px;
//       font-weight: bold;
//     }

//     .doc-badge-info h2 {
//       font-size: 11px;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: #64748b;
//       font-weight: 600;
//       margin: 0;
//     }

//     .doc-title-section h1 {
//       font-size: 18px;
//       font-weight: 700;
//       line-height: 1.4;
//       color: #0f172a;
//       margin: 8px 0 0;
//     }

//     .doc-source-type {
//       font-size: 12px;
//       color: #64748b;
//       margin-top: 4px;
//     }

//     .section-divider {
//       height: 1px;
//       background: #e2e8f0;
//     }

//     .meta-section-title {
//       font-size: 11px;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: #0f766e;
//       font-weight: 600;
//       margin-bottom: 12px;
//     }

//     .summary-box {
//       background: #f8fafc;
//       border: 1px solid #e2e8f0;
//       border-radius: 12px;
//       padding: 16px;
//       font-size: 13.5px;
//       line-height: 1.6;
//       color: #374151;
//       white-space: pre-wrap;
//     }

//     .meta-list {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//     }

//     .meta-item {
//       display: flex;
//       justify-content: space-between;
//       font-size: 13px;
//       line-height: 1.5;
//       border-bottom: 1px dashed #f1f5f9;
//       padding-bottom: 8px;
//     }

//     .meta-label {
//       color: #64748b;
//       font-weight: 500;
//     }

//     .meta-value {
//       color: #1f2937;
//       font-weight: 600;
//       text-align: right;
//       max-width: 200px;
//       word-wrap: break-word;
//     }

//     .viewer-toolbar {
//       background: #0f172a;
//       color: #ffffff;
//       height: 48px;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       padding: 0 20px;
//       font-size: 13px;
//       flex: none;
//       box-sizing: border-box;
//     }

//     .toolbar-left {
//       font-weight: 500;
//       max-width: 300px;
//       white-space: nowrap;
//       overflow: hidden;
//       text-overflow: ellipsis;
//     }

//     .toolbar-center {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }

//     .page-indicator {
//       background: rgba(255, 255, 255, 0.15);
//       padding: 4px 10px;
//       border-radius: 6px;
//       font-weight: 500;
//     }

//     .toolbar-btn {
//       background: transparent;
//       border: none;
//       color: #e2e8f0;
//       cursor: pointer;
//       padding: 4px 12px;
//       border-radius: 6px;
//       font-size: 13px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: all 0.2s;
//       font-weight: 500;
//     }

//     .toolbar-btn:hover {
//       background: rgba(255, 255, 255, 0.1);
//       color: #ffffff;
//     }

//     .toolbar-right {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//     }

//     .viewer-body {
//       flex: 1;
//       overflow: auto;
//       padding: 40px;
//       display: flex;
//       justify-content: center;
//       align-items: flex-start;
//       box-sizing: border-box;
//     }

//     .document-sheet {
//       background: #ffffff;
//       width: 100%;
//       max-width: 800px;
//       min-height: 1000px;
//       box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
//       border-radius: 4px;
//       padding: 60px 50px;
//       display: flex;
//       flex-direction: column;
//       position: relative;
//       transition: transform 0.2s ease;
//       transform-origin: top center;
//       box-sizing: border-box;
//     }

//     .sheet-header {
//       border-bottom: 2px solid #0f766e;
//       padding-bottom: 15px;
//       margin-bottom: 30px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 11px;
//       color: #64748b;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       font-weight: 600;
//     }

//     .sheet-content {
//       font-size: 14.5px;
//       line-height: 1.8;
//       color: #27272a;
//       white-space: pre-wrap;
//       flex: 1;
//       font-family: 'Inter', sans-serif;
//       text-align: left;
//     }

//     .sheet-footer {
//       border-top: 1px solid #e2e8f0;
//       padding-top: 15px;
//       margin-top: 40px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 11px;
//       color: #64748b;
//     }

//     .kp-citation-overlay iframe {
//       width: 100%;
//       height: 100%;
//       border: none;
//     }

//     @media (max-width: 860px) {
//       .kp-citation-overlay-content {
//         grid-template-columns: 1fr;
//         overflow-y: auto;
//       }
      
//       .kp-citation-overlay-metadata-panel {
//         border-right: none;
//         border-bottom: 1px solid #e2e8f0;
//         padding: 20px 16px;
//       }

//       .viewer-body {
//         padding: 20px;
//       }

//       .document-sheet {
//         padding: 30px 20px;
//         min-height: auto;
//       }
//     }
    
//     .kp-floating-menu-wrap {
//       display: none;
//     }
//     .kp-floating-menu-btn {
//       background: none;
//       border: none;
//       color: #374151;
//       cursor: pointer;
//       padding: 8px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       border-radius: 8px;
//     }
//     .kp-floating-menu-btn:hover {
//       background: rgba(0,0,0,0.05);
//     }
//     @media (max-width: 860px) {
//       .kp-floating-menu-wrap {
//         display: flex;
//         padding: 12px 16px 0;
//         flex: none;
//         background: #ffffff;
//       }
//       .kp-full-page-embedded .kp-full-page-shell {
//         gap: 0;
//       }
//       .kp-full-page-body {
//         padding-top: 12px;
//       }
//     }
//   `}var Ht={en:{openChatActions:"Open chat actions",newChat:"New Chat",myChats:"My Chats",openAssistant:"Open Knowledge Assistant",back:"Back",close:"Close",assistantBadge:"Knowledge Assistant",closeAssistantPage:"Close knowledge assistant page",searchChat:"Search Chat",recentActivity:"Recent Activity",pinnedCollections:"Pinned Collections",answersBasedOnPermissions:"Answers are generated based on your access permissions",authTokenForwarded:"Auth token is forwarded from the host app when configured.",thinking:"Thinking...",unableToCreateChat:"Unable to create chat",requestFailed:"Request failed",noRecentChats:"No recent chats yet.",noPinnedChats:"No pinned chats yet.",noChats:"No chats yet.",loadingChats:"Loading chats...",pinChat:"Pin chat",unpinChat:"Unpin chat",renameChat:"Rename",deleteChat:"Delete",chatActions:"Chat actions",renamePrompt:"Enter a new chat name",citationsAttached:e=>`${e} citation${e>1?"s":""} attached`,sourcesUsed:"Sources Used",allSourcesUsed:"All Sources Used",documentsAndReferences:"AI documents and references",showAll:"Show All",noSources:"No sources were returned for this answer.",closeSourcesPanel:"Close sources panel",openSource:"Open source",sourceScore:"Score",sourcePage:"Page",sourceSheet:"Sheet",sourceRow:"Row",sourceKnowledge:"Knowledge Base",untitledSource:"Untitled Source",copy:"Copy",copied:"Copied",helpful:"Helpful",notHelpful:"Needs work",send:"Send message",assistantAvatar:"Assistant",userAvatar:"User"},ar:{openChatActions:"\u0641\u062A\u062D \u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",newChat:"\u0645\u062D\u0627\u062F\u062B\u0629 \u062C\u062F\u064A\u062F\u0629",myChats:"\u0645\u062D\u0627\u062F\u062B\u0627\u062A\u064A",openAssistant:"\u0641\u062A\u062D \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",back:"\u0631\u062C\u0648\u0639",close:"\u0625\u063A\u0644\u0627\u0642",assistantBadge:"\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",closeAssistantPage:"\u0625\u063A\u0644\u0627\u0642 \u0635\u0641\u062D\u0629 \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",searchChat:"\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A",recentActivity:"\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0623\u062E\u064A\u0631",pinnedCollections:"\u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0627\u0644\u0645\u062B\u0628\u062A\u0629",answersBasedOnPermissions:"\u064A\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0625\u062C\u0627\u0628\u0627\u062A \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643",authTokenForwarded:"\u064A\u062A\u0645 \u062A\u0645\u0631\u064A\u0631 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0645\u0636\u064A\u0641 \u0639\u0646\u062F \u0627\u0644\u0625\u0639\u062F\u0627\u062F.",thinking:"\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u0641\u0643\u064A\u0631...",unableToCreateChat:"\u062A\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",requestFailed:"\u0641\u0634\u0644 \u0627\u0644\u0637\u0644\u0628",noRecentChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u062D\u062F\u064A\u062B\u0629 \u0628\u0639\u062F.",noPinnedChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0645\u062B\u0628\u062A\u0629 \u0628\u0639\u062F.",noChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0628\u0639\u062F.",loadingChats:"\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A...",pinChat:"\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",unpinChat:"\u0625\u0644\u063A\u0627\u0621 \u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renameChat:"\u0625\u0639\u0627\u062F\u0629 \u062A\u0633\u0645\u064A\u0629",deleteChat:"\u062D\u0630\u0641",chatActions:"\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renamePrompt:"\u0623\u062F\u062E\u0644 \u0627\u0633\u0645\u064B\u0627 \u062C\u062F\u064A\u062F\u064B\u0627 \u0644\u0644\u0645\u062D\u0627\u062F\u062B\u0629",citationsAttached:e=>`\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 ${e} \u0645\u0631\u062C\u0639${e>1?"\u0627\u062A":""}`,sourcesUsed:"\u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",allSourcesUsed:"\u0643\u0644 \u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",documentsAndReferences:"\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0648\u0645\u0631\u0627\u062C\u0639 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",showAll:"\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",noSources:"\u0644\u0645 \u064A\u062A\u0645 \u0625\u0631\u062C\u0627\u0639 \u0645\u0635\u0627\u062F\u0631 \u0644\u0647\u0630\u0647 \u0627\u0644\u0625\u062C\u0627\u0628\u0629.",closeSourcesPanel:"\u0625\u063A\u0644\u0627\u0642 \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0635\u0627\u062F\u0631",openSource:"\u0641\u062A\u062D \u0627\u0644\u0645\u0635\u062F\u0631",sourceScore:"\u0627\u0644\u062F\u0631\u062C\u0629",sourcePage:"\u0627\u0644\u0635\u0641\u062D\u0629",sourceSheet:"\u0627\u0644\u0648\u0631\u0642\u0629",sourceRow:"\u0627\u0644\u0635\u0641",sourceKnowledge:"\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0645\u0639\u0631\u0641\u0629",untitledSource:"\u0645\u0635\u062F\u0631 \u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646",copy:"\u0646\u0633\u062E",copied:"\u062A\u0645 \u0627\u0644\u0646\u0633\u062E",helpful:"\u0645\u0641\u064A\u062F",notHelpful:"\u064A\u062D\u062A\u0627\u062C \u062A\u062D\u0633\u064A\u0646",send:"\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629",assistantAvatar:"\u0627\u0644\u0645\u0633\u0627\u0639\u062F",userAvatar:"\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645"}};function Pe(e){if(typeof document>"u")throw new Error("Chat widget can only be initialized in a browser.");let t=Rt(e),a=Fe(t.locale),n=zn(t.locale),r=Hn(a),p=t.displayMode==="embedded",i={chatId:Ae(t),open:!1,fullPageOpen:p,myChatsOpen:!1,accessTokenProvider:t.getAccessToken,historyLoadedChatId:null,menuOpen:!1,chats:[],chatSearchTerm:"",loadingChats:!1,sourcePanelOpen:!1,sourcePanelTitle:null},d=document.createElement("div");d.dataset.chatWidgetHost="true",t.mount.appendChild(d);let u=d.attachShadow({mode:"open"});zt(u,t.theme);let c=o("div",`kp-chat-widget ${t.position}`);c.lang=a,c.dir=r?"rtl":"ltr",p&&(c.classList.add("kp-chat-widget-embedded"),$t(!0)),r&&c.classList.add("kp-rtl");let g=o("div","kp-overlay"),f=o("button","kp-launcher");f.type="button",f.setAttribute("aria-label",t.launcherAriaLabel),f.innerHTML=['<span class="kp-star-cluster" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let h=o("section","kp-panel");h.setAttribute("role","dialog"),h.setAttribute("aria-modal","true"),h.setAttribute("aria-label",t.title);let A=o("div","kp-header"),S=o("div","kp-toolbar"),v=o("button","kp-tool-button kp-menu-trigger");v.type="button",v.setAttribute("aria-label",n.openChatActions),v.innerHTML=['<span class="kp-pencil-icon" aria-hidden="true"></span>','<span class="kp-chevron" aria-hidden="true">\u2304</span>'].join("");let L=o("div","kp-dropdown"),w=o("button","kp-dropdown-item",n.newChat);w.type="button";let D=o("button","kp-dropdown-item",n.myChats);D.type="button";let T=o("button","kp-dropdown-item",n.openAssistant);T.type="button",L.append(w,D,T),S.append(v,L);let E=o("div","kp-title-wrap"),Wt=o("h2","kp-title",t.title),_t=o("div","kp-subtitle",t.subtitle);E.append(Wt,_t);let fe=o("button","kp-close","\xD7");fe.type="button",fe.setAttribute("aria-label",t.closeAriaLabel),A.append(S,E,fe);let he=o("div","kp-body"),Se=o("div","kp-hero"),Ft=o("div","kp-hero-icon","\u2726"),qt=o("div","kp-hero-text",t.welcomeMessage);Se.append(Ft,qt);let Ve=o("div","kp-footer"),Te=o("form","kp-form"),M=o("input","kp-input");M.type="text",M.autocomplete="off",M.placeholder=t.inputPlaceholder,M.setAttribute("aria-label",t.inputPlaceholder);let Ee=o("button","kp-send","\u279C");Ee.type="submit",Ee.setAttribute("aria-label",n.send);let Vt=o("div","kp-note",n.authTokenForwarded);Te.append(M,Ee),Ve.append(Te,Vt),h.append(A,he,Ve),p||c.append(g,f,h),u.appendChild(c),he.appendChild(Se);let Ke=o("div","kp-suggestions");he.appendChild(Ke);let me=o("section","kp-my-chats-sheet"),Ye=o("div","kp-my-chats-header"),be=o("button","kp-my-chats-nav","\u2190");be.type="button",be.setAttribute("aria-label",n.back);let ke=o("button","kp-my-chats-nav kp-my-chats-close","\xD7");ke.type="button",ke.setAttribute("aria-label",n.close),Ye.append(be,ke);let Xe=o("div","kp-my-chats-body"),Kt=o("div","kp-my-chats-section-label",n.recentActivity),Je=o("div","kp-my-chats-list"),Yt=o("div","kp-my-chats-section-label",n.pinnedCollections),Ge=o("div","kp-my-chats-list");Xe.append(Kt,Je,Yt,Ge),me.append(Ye,Xe),h.appendChild(me);let z={body:he,input:M,suggestions:Ke,hero:Se,kind:"panel"},R=o("section","kp-full-page");p&&R.classList.add("kp-full-page-embedded","open"),R.setAttribute("role","dialog"),p||R.setAttribute("aria-modal","true"),R.setAttribute("aria-label",`${t.title} page`);let Re=o("div","kp-full-page-shell"),xe=o("div","kp-full-page-header"),Qe=o("div","kp-full-page-brand"),Xt=o("div","kp-full-page-brand-mark","\u2726"),Jt=o("div","kp-full-page-brand-text",t.title),ae=o("button","kp-full-page-menu-btn");ae.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',ae.type="button",ae.setAttribute("aria-label","Toggle sidebar"),ae.addEventListener("click",()=>{oe.classList.toggle("open")}),Qe.append(ae,Xt,Jt);let Ze=o("div","kp-full-page-header-actions"),Gt=o("div","kp-full-page-badge",n.assistantBadge),ye=o("button","kp-full-page-close","\xD7");if(ye.type="button",ye.setAttribute("aria-label",n.closeAssistantPage),Ze.append(Gt,ye),xe.append(Qe,Ze),!t.embedded.showHeader){xe.classList.add("kp-hidden");let s=o("div","kp-floating-menu-wrap"),l=o("button","kp-floating-menu-btn");l.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',l.type="button",l.setAttribute("aria-label","Toggle sidebar"),l.addEventListener("click",()=>{oe.classList.toggle("open")}),s.append(l),Re.insertBefore(s,xe.nextSibling)}let et=o("div","kp-full-page-content"),oe=o("aside","kp-full-page-sidebar"),Ie=o("button","kp-full-page-new-chat",`+ ${n.newChat}`);Ie.type="button";let tt=o("div","kp-full-page-search"),se=o("input","kp-full-page-search-input");se.type="search",se.placeholder=n.searchChat;let Qt=o("span","kp-full-page-search-icon","\u2315");tt.append(se,Qt);let Zt=o("div","kp-full-page-section-label",n.recentActivity),nt=o("div","kp-full-page-recent-list"),en=o("div","kp-full-page-section-label",n.pinnedCollections),at=o("div","kp-full-page-pinned-list");oe.append(Ie,tt,Zt,nt,en,at);let ot=o("main","kp-full-page-main"),st=o("section","kp-full-page-panel"),ze=o("div","kp-full-page-body"),He=o("div","kp-full-page-hero"),it=o("div","kp-full-page-hero-badge");it.innerHTML=['<span class="kp-star-cluster kp-star-cluster-static" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let tn=o("div","kp-full-page-hero-text",t.welcomeMessage);He.append(it,tn);let rt=o("div","kp-suggestions kp-full-page-suggestions");ze.append(He,rt);let lt=o("div","kp-full-page-footer"),Me=o("form","kp-form kp-full-page-form"),I=o("input","kp-input kp-full-page-input");I.type="text",I.autocomplete="off",I.placeholder=t.inputPlaceholder,I.setAttribute("aria-label",t.inputPlaceholder);let Ue=o("button","kp-send kp-full-page-send","\u279C");Ue.type="submit",Ue.setAttribute("aria-label",n.send);let nn=o("div","kp-note kp-full-page-note",n.answersBasedOnPermissions);Me.append(I,Ue),lt.append(Me,nn),st.append(ze,lt),ot.appendChild(st);let ve=o("aside","kp-source-panel"),pt=o("div","kp-source-panel-header"),dt=o("div","kp-source-panel-title-wrap"),ct=o("div","kp-source-panel-title",n.allSourcesUsed),an=o("div","kp-source-panel-subtitle",n.documentsAndReferences);dt.append(ct,an);let we=o("button","kp-source-panel-close","\xD7");we.type="button",we.setAttribute("aria-label",n.closeSourcesPanel),pt.append(dt,we);let ie=o("div","kp-source-panel-list"),on=o("div","kp-source-panel-empty",n.noSources);ie.appendChild(on),ve.append(pt,ie),et.append(oe,ot,ve),Re.append(xe,et),R.appendChild(Re),c.appendChild(R);let re=o("div","kp-citation-overlay");c.appendChild(re);let P={body:ze,input:I,suggestions:rt,hero:He,kind:"full-page"},j=()=>({...t,getAccessToken:i.accessTokenProvider}),ut=async()=>{if(!t.getUserContext)return{displayName:null,avatarUrl:null};try{let s=await t.getUserContext();return s?{displayName:[s.firstName,s.lastName].filter(Boolean).join(" ")||s.displayName?.trim()||s.email?.trim()||s.userId?.trim()||null,avatarUrl:s.avatarUrl??null}:{displayName:null,avatarUrl:null}}catch{return{displayName:null,avatarUrl:null}}},X=s=>{let l=qe(s)??n.untitledSource,m=(s.text||"").trim(),x=m,y=m.split(`
// `);if(y.length>1&&y[0]){let B=y[0].trim().replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();B&&(B===l||l.indexOf(B)!==-1||B.indexOf(l)!==-1)&&(x=y.slice(1).join(`
// `).trim())}let b=_n(s.sourceDocument),k=[];(s.pageNumber||s.pageNumber===0)&&k.push(`
//         <div class="meta-item">
//           <span class="meta-label">Page Number</span>
//           <span class="meta-value">${s.pageNumber}</span>
//         </div>
//       `),typeof s.score=="number"&&k.push(`
//         <div class="meta-item">
//           <span class="meta-label">Relevance Score</span>
//           <span class="meta-value">${s.score.toFixed(2)}</span>
//         </div>
//       `),s.sheetName&&k.push(`
//         <div class="meta-item">
//           <span class="meta-label">Sheet Name</span>
//           <span class="meta-value">${O(s.sheetName)}</span>
//         </div>
//       `),(s.rowNumber||s.rowNumber===0)&&k.push(`
//         <div class="meta-item">
//           <span class="meta-label">Row Number</span>
//           <span class="meta-value">${s.rowNumber}</span>
//         </div>
//       `),s.knowledgeName&&k.push(`
//         <div class="meta-item">
//           <span class="meta-label">Database Source</span>
//           <span class="meta-value">${O(s.knowledgeName)}</span>
//         </div>
//       `),k.push(`
//       <div class="meta-item">
//         <span class="meta-label">Classification</span>
//         <span class="meta-value">Uploaded Knowledge</span>
//       </div>
//       <div class="meta-item">
//         <span class="meta-label">Confidentiality</span>
//         <span class="meta-value" style="color: #0f766e;">Public</span>
//       </div>
//       <div class="meta-item">
//         <span class="meta-label">Language</span>
//         <span class="meta-value">English</span>
//       </div>
//     `);let Q=k.join(""),Z=x?O(x):"No text snippet available for this citation.",hn=`
//       <div class="doc-badge-wrapper">
//         <div class="doc-icon">\u{1F4C4}</div>
//         <div class="doc-badge-info">
//           <h2>Document Citation</h2>
//         </div>
//       </div>
      
//       <div class="doc-title-section">
//         <h1>${O(l)}</h1>
//         <div class="doc-source-type">Uploaded Knowledge Resource</div>
//       </div>
      
//       <div class="section-divider"></div>
      
//       <div>
//         <h3 class="meta-section-title">Retrieved Passage Snippet</h3>
//         <div class="summary-box">${Z}</div>
//       </div>
      
//       <div class="section-divider"></div>
      
//       <div>
//         <h3 class="meta-section-title">Metadata & Classification</h3>
//         <div class="meta-list">
//           ${Q}
//         </div>
//       </div>
//     `,Be="";b?Be=`<iframe src="${b}" title="Document Viewer"></iframe>`:Be=`
//         <div class="viewer-toolbar">
//           <div class="toolbar-left">${O(l)}</div>
//           <div class="toolbar-center">
//             <button class="toolbar-btn zoom-out-btn">\u2212</button>
//             <span class="page-indicator">Page ${s.pageNumber||1}</span>
//             <button class="toolbar-btn zoom-in-btn">+</button>
//           </div>
//           <div class="toolbar-right">
//             <button class="toolbar-btn print-btn">\u{1F5A8}\uFE0F Print</button>
//           </div>
//         </div>
//         <div class="viewer-body">
//           <div class="document-sheet">
//             <div class="sheet-header">
//               <span>${O(l)}</span>
//               <span>Page ${s.pageNumber||1}</span>
//             </div>
//             <div class="sheet-content">${O(m||"No document content retrieved.")}</div>
//             <div class="sheet-footer">
//               <span>Confidentiality: Public</span>
//               <span>Knowledge Platform CB</span>
//             </div>
//           </div>
//         </div>
//       `,re.textContent="";let xt=o("header","kp-citation-overlay-header"),yt=o("div","kp-citation-overlay-brand");yt.innerHTML=`
//       <span class="kp-citation-overlay-brand-logo">\u2726</span>
//       <span>Knowledge Assistant Document Viewer</span>
//     `;let Le=o("button","kp-citation-overlay-close","\xD7");Le.type="button",Le.setAttribute("aria-label","Close document preview"),Le.addEventListener("click",()=>{re.classList.remove("open")}),xt.append(yt,Le);let vt=o("div","kp-citation-overlay-content"),wt=o("aside","kp-citation-overlay-metadata-panel");wt.innerHTML=hn;let ee=o("main","kp-citation-overlay-viewer-panel");if(ee.innerHTML=Be,vt.append(wt,ee),re.append(xt,vt),!b){let F=1,B=ee.querySelector(".document-sheet"),mn=ee.querySelector(".zoom-in-btn"),bn=ee.querySelector(".zoom-out-btn"),kn=ee.querySelector(".print-btn");B&&(mn?.addEventListener("click",()=>{F<1.5&&(F+=.1,B.style.transform=`scale(${F})`)}),bn?.addEventListener("click",()=>{F>.6&&(F-=.1,B.style.transform=`scale(${F})`)}),kn?.addEventListener("click",()=>{window.print()}))}re.classList.add("open")},le=(s,l)=>{if(i.sourcePanelOpen=!0,i.sourcePanelTitle=l??n.allSourcesUsed,ct.textContent=i.sourcePanelTitle,ve.classList.add("open"),ie.textContent="",s.length===0){ie.appendChild(o("div","kp-source-panel-empty",n.noSources));return}for(let m of s)ie.appendChild(Wn(m,n,()=>{X(m)}))},J=()=>{i.sourcePanelOpen=!1,i.sourcePanelTitle=null,ve.classList.remove("open")};te(z,t.initialSuggestions,async s=>{await U(s,z)}),te(P,t.initialSuggestions,async s=>{await U(s,P)}),_(),Ce(),p&&(H(),t.rag.loadHistoryOnOpen&&G(P,i.chatId));function $e(){if(p){i.fullPageOpen=!0,R.classList.add("open");return}i.open||(i.open=!0,i.fullPageOpen=!1,N(),R.classList.remove("open"),f.classList.add("hidden"),g.classList.add("visible"),h.classList.add("open"),t.onOpen?.(),t.rag.loadHistoryOnOpen&&Ne.loadHistory(),queueMicrotask(()=>M.focus()))}function W(){if(p){J();return}i.open&&($(),N(),i.open=!1,f.classList.remove("hidden"),g.classList.remove("visible"),h.classList.remove("open"),t.onClose?.())}async function U(s,l){let m=s.trim();if(!m)return;l.input.value="";try{await dn(m)}catch(b){let k=Y(t,b);ge(l.body,"bot",`${n.unableToCreateChat}: ${k.message}`,{strings:n,view:l,userName:null,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:le,onShowCitation:X,onLike:()=>{},onDislike:()=>{}});return}_e(l);let x=await ut();ge(l.body,"user",m,{strings:n,view:l,userName:x.displayName,userAvatarUrl:x.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:le,onShowCitation:X,onLike:()=>{},onDislike:()=>{}}),l.body.scrollTop=l.body.scrollHeight;let y=o("div","kp-loading",n.thinking);l.body.appendChild(y),l.body.scrollTop=l.body.scrollHeight;try{let b=await Pn(t),k=await At(j(),{message:m,chatId:i.chatId,knowledgeNames:b,...t.rag.enableReferences!==void 0?{enableReferences:t.rag.enableReferences}:{}});y.isConnected&&y.remove(),ge(l.body,"bot",k.answer,{strings:n,view:l,userName:x.displayName,userAvatarUrl:x.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,citations:k.citations??[],onShowSources:le,onShowCitation:X,onLike:()=>{ce(t,i.chatId,k.answer,!0).catch(console.error)},onDislike:()=>{ce(t,i.chatId,k.answer,!1).catch(console.error)}}),i.historyLoadedChatId=null,await H(),k.suggestions?.length&&te(l,k.suggestions,async Q=>{await U(Q,l)})}catch(b){let k=Y(t,b);y.isConnected&&y.remove(),ge(l.body,"bot",`${n.requestFailed}: ${k.message}`,{strings:n,view:l,userName:x.displayName,userAvatarUrl:x.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:le,onShowCitation:X,onLike:()=>{},onDislike:()=>{}})}}async function gt(s){let l=i.fullPageOpen?P:z;await U(s,l)}async function sn(){if(p){i.fullPageOpen=!0,R.classList.add("open"),await H(),await G(P,i.chatId),queueMicrotask(()=>I.focus());return}i.fullPageOpen=!0,i.open=!1,$(),N(),h.classList.remove("open"),g.classList.remove("visible"),f.classList.add("hidden"),R.classList.add("open"),await H(),await G(P,i.chatId),queueMicrotask(()=>I.focus())}function ft(){if(p){J();return}i.fullPageOpen&&(i.fullPageOpen=!1,R.classList.remove("open"),f.classList.remove("hidden"),J())}function rn(){i.menuOpen=!0,v.classList.add("open"),L.classList.add("open")}function $(){i.menuOpen=!1,v.classList.remove("open"),L.classList.remove("open")}function ln(){i.chatId=Ae(t),i.historyLoadedChatId=null,N(),ue(z),te(z,t.initialSuggestions,async s=>{await U(s,z)}),$()}async function pn(){i.chatId=Ae(t),i.historyLoadedChatId=null,ue(P),J(),te(P,t.initialSuggestions,async s=>{await U(s,P)}),_()}async function H(){if(!t.endpoints.listChats)return _(),Ce(),[];i.loadingChats=!0,_(),Ce();try{let s=await St(j());return i.chats=s,s}catch(s){return Y(t,s),i.chats}finally{i.loadingChats=!1,_(),Ce()}}async function dn(s){!t.endpoints.listChats&&!t.endpoints.createChat||i.chats.some(l=>l.chatId===i.chatId)||await Tt(j(),i.chatId,s?In(s,n.newChat):void 0)}async function cn(s){i.chatId=s,i.historyLoadedChatId=null,await G(P,s),_()}async function un(s){i.chatId=s,i.historyLoadedChatId=null,N(),await G(z,s)}async function gn(){$(),await H(),i.myChatsOpen=!0,h.classList.add("kp-sheet-open"),me.classList.add("open")}function N(){i.myChatsOpen=!1,h.classList.remove("kp-sheet-open"),me.classList.remove("open")}function fn(s,l){let m=o("div","kp-overlay visible"),x=o("div","kp-rename-dialog");x.style.cssText="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:320px; background:var(--kp-panel-background); box-shadow:var(--kp-shadow); padding:24px; border-radius:16px; opacity:1; pointer-events:auto; z-index: 10000; display:flex; flex-direction:column; height:min-content; box-sizing:border-box;";let y=o("h3","kp-source-preview-title");y.textContent=n.renamePrompt,y.style.marginBottom="16px",y.style.fontSize="16px";let b=o("input","kp-input");b.type="text",b.value=s.title,b.style.border="1px solid var(--kp-border-color)",b.style.padding="10px",b.style.borderRadius="8px",b.style.width="100%",b.style.marginBottom="20px",b.style.flex="none",b.style.height="40px";let k=o("div","kp-message-actions");k.style.justifyContent="flex-end",k.style.gap="8px";let Q=o("button","kp-message-action",n.close);Q.addEventListener("click",()=>m.remove());let Z=o("button","kp-message-action active","Save");Z.addEventListener("click",async()=>{Z.disabled=!0,Z.textContent="...",await l(b.value),m.remove()}),k.append(Q,Z),x.append(y,b,k),m.appendChild(x),c.appendChild(m),b.focus()}async function ht(s){t.endpoints.updateChat&&fn(s,async l=>{let m=l.trim();if(!(!m||m===s.title))try{await je(j(),s.chatId,{title:m}),await H()}catch(x){Y(t,x)}})}async function mt(s){if(t.endpoints.deleteChat)try{await Et(j(),s.chatId),i.chatId===s.chatId&&(i.chatId=Ae(t),i.historyLoadedChatId=null,ue(z),ue(P)),await H()}catch(l){Y(t,l)}}function _(){Mt(nt,at,i,n,async s=>{await cn(s.chatId),oe.classList.remove("open")},async s=>{await bt(s)},async s=>{await ht(s)},async s=>{await mt(s)})}function Ce(){Mt(Je,Ge,i,n,async s=>{await un(s.chatId)},async s=>{await bt(s)},async s=>{await ht(s)},async s=>{await mt(s)})}async function bt(s){if(t.endpoints.updateChat)try{await je(j(),s.chatId,{pinned:!s.pinned}),await H()}catch(l){Y(t,l)}}async function G(s,l){ue(s),te(s,t.initialSuggestions,async y=>{await U(y,s)});let m=o("div","kp-message kp-message-ai");m.innerHTML='<div class="kp-message-bubble"><div class="kp-typing-indicator"><span></span><span></span><span></span></div></div>',_e(s),s.body.appendChild(m);let x=await Pt(j(),l);if(m.remove(),x.length>0){_e(s),Nt(s.body,s.hero,s.suggestions);let y=await ut();Rn(s.body,x,{strings:n,view:s,userName:y.displayName,userAvatarUrl:y.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:le,onShowCitation:X,onLike:b=>{ce(t,l,b,!0).catch(console.error)},onDislike:b=>{ce(t,l,b,!1).catch(console.error)}})}return i.historyLoadedChatId=l,x}let Ne={open:$e,close:W,toggle(){if(p){$e();return}if(i.open){W();return}$e()},destroy(){if(document.removeEventListener("keydown",kt),d.remove(),p){let s=!1;document.querySelectorAll("[data-chat-widget-host]").forEach(l=>{let m=l.shadowRoot;m&&m.querySelector(".kp-chat-widget-embedded")&&(s=!0)}),s||$t(!1)}},sendMessage:gt,setAccessTokenProvider(s){i.accessTokenProvider=s},getChatId(){return i.chatId},loadChats(){return H()},async loadHistory(){let s=i.fullPageOpen?P:z;return G(s,i.chatId)}};f.addEventListener("click",()=>Ne.toggle()),fe.addEventListener("click",W),g.addEventListener("click",W),we.addEventListener("click",J),be.addEventListener("click",N),ke.addEventListener("click",N),v.addEventListener("click",s=>{if(s.stopPropagation(),!i.menuOpen){rn();return}$()}),w.addEventListener("click",ln),D.addEventListener("click",async()=>{await gn()}),T.addEventListener("click",()=>{if($(),t.onOpenAssistantPage){W(),t.onOpenAssistantPage();return}if(t.assistantPageUrl){W(),window.location.href=t.assistantPageUrl;return}sn()}),ye.addEventListener("click",ft),Ie.addEventListener("click",()=>{pn(),queueMicrotask(()=>I.focus())}),se.addEventListener("input",()=>{i.chatSearchTerm=se.value.trim().toLowerCase(),_()}),h.addEventListener("click",s=>{let l=s.target;if(!(l instanceof Element)||!l.closest(".kp-chat-actions")){for(let m of Array.from(u.querySelectorAll(".kp-chat-actions.open")))m.classList.remove("open");for(let m of Array.from(u.querySelectorAll(".kp-full-page-chat-item.menu-open")))m.classList.remove("menu-open")}i.menuOpen&&!L.contains(l)&&!v.contains(l)&&$(),s.stopPropagation()}),u.addEventListener("click",s=>{let l=s.target;if(i.menuOpen&&l instanceof Node&&!L.contains(l)&&!v.contains(l)&&$(),l instanceof Element&&!l.closest(".kp-chat-actions")){for(let m of Array.from(u.querySelectorAll(".kp-chat-actions.open")))m.classList.remove("open");for(let m of Array.from(u.querySelectorAll(".kp-full-page-chat-item.menu-open")))m.classList.remove("menu-open")}}),Te.addEventListener("submit",async s=>{s.preventDefault(),await gt(M.value)}),Me.addEventListener("submit",async s=>{s.preventDefault(),await U(I.value,P)});function kt(s){if(s.key==="Escape"){if(i.sourcePanelOpen){J();return}if(i.myChatsOpen){N();return}if(i.fullPageOpen){if(p)return;ft();return}i.open&&W()}}return document.addEventListener("keydown",kt),Ne}async function Pn(e){if(e.rag.getKnowledgeNames){let t=await e.rag.getKnowledgeNames();return Array.isArray(t)?t.filter(Boolean):[]}return(e.rag.knowledgeNames??[]).filter(Boolean)}function Ae(e){return e.rag.chatId?.trim()?e.rag.chatId:e.rag.chatIdFactory?e.rag.chatIdFactory():typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`kp-chat-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function ge(e,t,a,n){let r=t==="bot"?Un(a,n.citations??[]):{displayText:a,citations:n.citations??[]},p=o("div",`kp-message-row ${t}`),i=Tn(t==="bot"?n.strings.assistantAvatar:n.userName??n.strings.userAvatar,t,t==="bot"?n.assistantAvatarUrl:n.userAvatarUrl),d=o("div",`kp-bubble ${t}`),u=o("div","kp-bubble-content");Fn(u,r.displayText),d.appendChild(u);let c=r.citations;if(c.length){let g=o("div","kp-meta",n.strings.citationsAttached(c.length));d.appendChild(g);let f=o("div","kp-source-preview"),h=o("div","kp-source-preview-title",n.strings.sourcesUsed),A=o("div","kp-source-preview-list");for(let v of c.slice(0,2)){let L=Dn(v,n.strings);L.addEventListener("click",async()=>{n.onShowCitation(v)}),A.appendChild(L)}let S=jn(n.strings);S.addEventListener("click",async()=>{n.onShowSources(c,n.strings.allSourcesUsed)}),A.appendChild(S),f.append(h,A),d.appendChild(f)}return t==="bot"&&d.appendChild(Sn(r.displayText,n.strings,n.onLike,n.onDislike,n.initialFeedback)),t==="user"?p.append(d,i):p.append(i,d),e.appendChild(p),e.scrollTop=e.scrollHeight,p}function Sn(e,t,a,n,r){let p=o("div","kp-message-actions"),i='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',d='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',u='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',c='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>',g=o("button","kp-message-action");g.innerHTML=i,g.type="button",g.setAttribute("title",t.copy),g.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),g.innerHTML=d,window.setTimeout(()=>{g.innerHTML=i},1200)}catch{g.innerHTML=i}});let f=o("button","kp-message-action");f.innerHTML=u,f.type="button",f.setAttribute("aria-label",t.helpful),r===!0&&f.classList.add("active"),f.addEventListener("click",()=>{f.classList.toggle("active"),h.classList.remove("active"),f.classList.contains("active")&&a&&a()});let h=o("button","kp-message-action");return h.innerHTML=c,h.type="button",h.setAttribute("aria-label",t.notHelpful),r===!1&&h.classList.add("active"),h.addEventListener("click",()=>{h.classList.toggle("active"),f.classList.remove("active"),h.classList.contains("active")&&n&&n()}),p.append(g,f,h),p}function Tn(e,t,a){let n=o("div",`kp-avatar ${t}`);if(a){let r=o("img","kp-avatar-img");r.src=a,r.alt=e,r.style.width="100%",r.style.height="100%",r.style.objectFit="cover",r.style.borderRadius="50%",n.appendChild(r)}else{let r=t==="bot"?"\u2726":Mn(e);n.textContent=r}return n.setAttribute("aria-hidden","true"),n}function En(e,t,a){e.textContent="";for(let n of t){let r=o("button","kp-suggestion",n);r.type="button",r.addEventListener("click",async()=>{await a(n)}),e.appendChild(r)}}function te(e,t,a){En(e.suggestions,t,async n=>{e.input.value=n,await a(n)})}function Nt(e,t,a){let n=new Set([t,a]);for(let r of Array.from(e.children))n.has(r)||r.remove()}function _e(e){e.body.classList.add("kp-conversation-active"),e.hero.remove(),e.suggestions.remove()}function ue(e){e.body.classList.remove("kp-conversation-active"),e.hero.isConnected||e.body.prepend(e.hero),e.suggestions.isConnected||e.body.appendChild(e.suggestions),Nt(e.body,e.hero,e.suggestions),e.input.value=""}function Rn(e,t,a){for(let n of t)ge(e,n.role==="assistant"?"bot":"user",n.text,{...a,...n.citations!==void 0?{citations:n.citations}:{},...n.isLike!==void 0?{initialFeedback:n.isLike}:{},onLike:()=>{a.onLike&&a.onLike(n.text)},onDislike:()=>{a.onDislike&&a.onDislike(n.text)}})}function Mt(e,t,a,n,r,p,i,d){if(e.textContent="",t.textContent="",a.loadingChats){e.appendChild(o("div","kp-full-page-empty",n.loadingChats));return}let u=a.chats.filter(c=>a.chatSearchTerm?c.title.toLowerCase().includes(a.chatSearchTerm):!0);if(u.length>0){let c=u.filter(f=>f.pinned),g=u.filter(f=>!f.pinned).slice(0,8);Ut(e,g,a.chatId,n,r,p,i,d),Ut(t,c,a.chatId,n,r,p,i,d),g.length===0&&e.appendChild(o("div","kp-full-page-empty",n.noRecentChats)),c.length===0&&t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats));return}e.appendChild(o("div","kp-full-page-empty",n.noChats)),t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats))}function Ut(e,t,a,n,r,p,i,d){for(let u of t){let c=o("div",`kp-full-page-item kp-full-page-chat-item${u.chatId===a?" active":""}`),g=o("span","kp-full-page-item-title",u.title),f=o("div","kp-chat-actions"),h=o("button","kp-chat-actions-trigger","\u22EF");h.type="button",h.setAttribute("aria-label",n.chatActions);let A=o("div","kp-chat-actions-menu"),S=o("button","kp-chat-actions-item",u.pinned?n.unpinChat:n.pinChat);S.type="button",S.addEventListener("click",async w=>{w.stopPropagation(),await p(u)});let v=o("button","kp-chat-actions-item",n.renameChat);v.type="button",v.addEventListener("click",async w=>{w.stopPropagation(),await i(u)});let L=o("button","kp-chat-actions-item",n.deleteChat);L.type="button",L.addEventListener("click",async w=>{w.stopPropagation(),await d(u)}),A.append(S,v,L),f.append(h,A),h.addEventListener("click",w=>{w.stopPropagation();let D=f.classList.contains("open");for(let T of Array.from(e.querySelectorAll(".kp-chat-actions.open")))T.classList.remove("open");for(let T of Array.from(e.querySelectorAll(".kp-full-page-chat-item.menu-open")))T.classList.remove("menu-open");D||(f.classList.add("open"),c.classList.add("menu-open"))}),c.append(g,f),c.setAttribute("role","button"),c.tabIndex=0,c.addEventListener("click",async()=>{await r(u)}),c.addEventListener("keydown",async w=>{(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),await r(u))}),c.addEventListener("blur",()=>{f.classList.remove("open"),c.classList.remove("menu-open")}),e.appendChild(c)}}function In(e,t){return e.trim().slice(0,60)||t}function Fe(e){return e.toLowerCase().split("-")[0]||"en"}function zn(e){let t=Ht.en;return Ht[Fe(e)]??t}function Hn(e){return["ar","fa","he","ur"].includes(Fe(e))}function Mn(e){let t=e.split(/\s+/).filter(Boolean).slice(0,2);return t.length===0?"U":t.map(a=>a[0]?.toUpperCase()??"").join("")}function qe(e){if(e.knowledgeName?.trim())return e.knowledgeName.trim();if(e.text){let t=e.text.split(`
// `)[0]?.trim();if(t){let a=t.replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();if(a)return a}}if(e.sourceDocument&&/^https?:\/\//i.test(e.sourceDocument)){try{let t=new URL(e.sourceDocument),a=decodeURIComponent(t.pathname),n=a.substring(a.lastIndexOf("/")+1);if(n)return n}catch{}return e.sourceDocument}return e.sourceDocument?.trim()&&!/^c\d+$/i.test(e.sourceDocument)?e.sourceDocument.trim():null}function Un(e,t){let a=$n(e);return{displayText:a.displayText,citations:t.length>0?On(t,a.citations):a.citations}}function $n(e){let a=Bt(e).split(`
// `),n=-1;for(let u=0;u<a.length;u+=1)/^#{0,6}\s*References\s*$/i.test(a[u]?.trim()??"")&&(n=u);if(n===-1)return{displayText:e,citations:[]};let r=a.slice(0,n).join(`
// `).trimEnd(),p=a.slice(n+1).join(`
// `).trim(),d=Nn(p).map(u=>Bn(u)).filter(u=>!!u);return{displayText:r,citations:d}}function Nn(e){let t=[],a="";for(let n of e.split(`
// `)){let r=n.trim();if(r){if(/^\d+\.\s+/.test(r)){a&&t.push(a.trim()),a=r.replace(/^\d+\.\s+/,"");continue}a&&(a=`${a} ${r}`)}}return a&&t.push(a.trim()),t}function Bn(e){let t=e.match(/https?:\/\/\S+/i);if(!t)return null;let a=t[0],n=e.slice(0,t.index).replace(/[.\s]+$/,"").trim();return{sourceDocument:a,knowledgeName:n||a}}function On(e,t){let a=[],n=new Set;for(let r of[...e,...t]){let p=`${r.knowledgeName??""}::${r.sourceDocument??""}`;n.has(p)||(n.add(p),a.push(r))}return a}function Dn(e,t){let a=o("button","kp-source-chip");a.type="button",a.setAttribute("aria-label",t.openSource);let n=o("span","kp-source-thumb");n.textContent="\u2726";let r=o("span","kp-source-chip-label",qe(e)??t.untitledSource);return a.append(n,r),a}function jn(e){let t=o("button","kp-source-chip kp-source-chip-more");t.type="button";let a=o("span","kp-source-thumb-stack");for(let r=0;r<3;r+=1){let p=o("span","kp-source-thumb stacked");p.textContent="\u2726",a.appendChild(p)}let n=o("span","kp-source-chip-label",e.showAll);return t.append(a,n),t}function Wn(e,t,a){let n=o("button","kp-source-card");n.type="button",n.setAttribute("aria-label",t.openSource),n.addEventListener("click",a);let r=o("div","kp-source-card-media"),p=o("span","kp-source-thumb kp-source-thumb-large");p.textContent="\u2726";let i=o("div","kp-source-card-title",qe(e)??t.untitledSource),d=o("div","kp-source-card-meta"),u=[];return typeof e.score=="number"&&u.push(`${t.sourceScore}: ${e.score.toFixed(2)}`),typeof e.pageNumber=="number"&&u.push(`${t.sourcePage}: ${e.pageNumber}`),e.sheetName&&u.push(`${t.sourceSheet}: ${e.sheetName}`),typeof e.rowNumber=="number"&&u.push(`${t.sourceRow}: ${e.rowNumber}`),e.knowledgeName&&u.push(`${t.sourceKnowledge}: ${e.knowledgeName}`),d.textContent=u.join(" \u2022 "),r.appendChild(p),n.append(r,i,d),n}function _n(e){if(!e)return null;let t=e.trim();return/^https?:\/\//i.test(t)?t:null}function Fn(e,t){e.innerHTML=qn(Bt(t))}function Bt(e){return e.replace(/\r\n/g,`
// `)}function qn(e){return e.split(/\n{2,}/).map(a=>a.trim()).filter(Boolean).map(Vn).join("")}function Vn(e){let t=e.split(`
// `).map(n=>n.trimEnd());if(t.every(n=>/^\s*\|.*\|\s*$/.test(n))&&t.length>=2)return Kn(t);if(t.every(n=>/^\d+\.\s+/.test(n)))return`<ol>${t.map(n=>`<li>${ne(n.replace(/^\d+\.\s+/,""))}</li>`).join("")}</ol>`;if(t.every(n=>/^[-*]\s+/.test(n)))return`<ul>${t.map(n=>`<li>${ne(n.replace(/^[-*]\s+/,""))}</li>`).join("")}</ul>`;let a=t[0]?.match(/^(#{1,6})\s+(.*)$/);if(a){let n=a[1]??"#",r=a[2]??"",p=n.length;return`<h${p}>${ne(r)}</h${p}>`}return`<p>${t.map(n=>ne(n)).join("<br>")}</p>`}function Kn(e){let t=e.filter((i,d)=>!(d===1&&/^\s*\|?(\s*:?-{3,}:?\s*\|)+\s*$/.test(i))).map(i=>Yn(i));if(t.length===0)return"";let a=t[0]??[],n=t.slice(1),r=`<thead><tr>${a.map(i=>`<th>${ne(i)}</th>`).join("")}</tr></thead>`,p=n.length?`<tbody>${n.map(i=>`<tr>${i.map(d=>`<td>${ne(d)}</td>`).join("")}</tr>`).join("")}</tbody>`:"";return`<div class="kp-table-wrap"><table>${r}${p}</table></div>`}function Yn(e){return e.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(t=>t.trim())}function ne(e){let t=O(e);return t=t.replace(/&lt;br\s*\/?&gt;/gi,"<br>"),t=t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>'),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*([^*]+)\*/g,"<em>$1</em>"),t}function O(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function $t(e){typeof document>"u"||document.querySelectorAll("[data-chat-widget-host]").forEach(t=>{let a=t.shadowRoot;if(a){let n=a.querySelector(".kp-chat-widget");n&&!n.classList.contains("kp-chat-widget-embedded")&&(t.style.display=e?"none":"")}})}var Ot="0.1.0",Dt=Pe,jt={init:Dt,createChatWidget:Pe,version:Ot};typeof window<"u"&&(window.ChatWidget=jt);return Ln(Xn);})();
// //# sourceMappingURL=browser.iife.js.map

// "use strict";var ChatWidget=(()=>{var Oe=Object.defineProperty;var xn=Object.getOwnPropertyDescriptor;var yn=Object.getOwnPropertyNames;var vn=Object.prototype.hasOwnProperty;var wn=(e,t)=>{for(var a in t)Oe(e,a,{get:t[a],enumerable:!0})},Cn=(e,t,a,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of yn(t))!vn.call(e,r)&&r!==a&&Oe(e,r,{get:()=>t[r],enumerable:!(n=xn(t,r))||n.enumerable});return e};var Ln=e=>Cn(Oe({},"__esModule",{value:!0}),e);var Xn={};wn(Xn,{browserGlobal:()=>Dt,createChatWidget:()=>Pe,init:()=>jt,version:()=>Ot});function Ct(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function je(e,t){let a={...e};for(let n of Object.keys(t)){let r=t[n],p=a[n];if(Ct(p)&&Ct(r)){a[n]=je(p,r);continue}r!==void 0&&(a[n]=r)}return a}function Lt(e){return e instanceof Error?e:typeof e=="string"?new Error(e):new Error("Unexpected widget error")}function pe(e,t){return`${e.replace(/\/$/,"")}/${t.replace(/^\//,"")}`}function q(e,t,a){return{"Content-Type":"application/json",...e.customHeaders,...a?{"X-Chat-User-Context":a}:{},...t?{Authorization:`Bearer ${t}`}:{}}}async function V(e){if(!e.getUserContext)return null;let t=await e.getUserContext();return t?JSON.stringify(t):null}function de(e,t,a={}){let n=t.replace(/\{chatId\}/g,encodeURIComponent(a.chatId??"")).replace(/:chatId\b/g,encodeURIComponent(a.chatId??""));return pe(e.apiBaseUrl,n)}async function K(e,t){let a=`Failed to ${t}. Please try again.`;e.status===400?a="Invalid request. Please check your input and try again.":e.status===401?a="Authentication failed. Please log in again.":e.status===403?a="You do not have permission to perform this action.":e.status===404?a="The requested resource was not found.":e.status===429?a="Too many requests. Please wait a moment and try again.":e.status>=500&&(a="The server is currently experiencing issues. Please try again later.");try{let n=await e.json();n&&typeof n=="object"&&(typeof n.message=="string"?a=n.message:typeof n.error=="string"&&(a=n.error))}catch{}throw new Error(a)}async function At(e,t){let a=e.getAccessToken?await e.getAccessToken():null,n=await V(e),r=de(e,e.endpoints.ask,{chatId:t.chatId}),p={message:t.message,query:t.message,chat_id:t.chatId,knowledgeNames:t.knowledgeNames,knowledge_names:t.knowledgeNames,editLastQa:t.editLastQa??!1,edit_last_qa:t.editLastQa??!1,enableReferences:t.enableReferences??!0,enable_references:t.enableReferences??!0},i=await fetch(r,{method:"POST",headers:q(e,a,n),body:JSON.stringify(p)});i.ok||await K(i,"send message");let d=i.body?.getReader(),u="";if(d)for(;;){let{done:T,value:E}=await d.read();if(T)break;E&&(u+=new TextDecoder("utf-8").decode(E,{stream:!0}))}else u=await i.text();let c;try{c=JSON.parse(u)}catch{return{chatId:t.chatId,answer:u,suggestions:[],citations:[]}}if(!Array.isArray(c)){if(!c.answer||typeof c.answer!="string")throw new Error("Chat backend response is missing a valid answer.");return{chatId:c.chatId??t.chatId,answer:c.answer,suggestions:c.suggestions??[],citations:c.citations??[]}}let f=c[0];if(!f?.answer||typeof f.answer!="string")throw new Error("Chat backend response is missing a valid answer.");let h=f.content,m=h?.source_documents??[],A=h?.scores??[],S=h?.page_numbers??[],v=h?.sheet_names??[],L=h?.row_numbers??[],w=h?.knowledge_names??[],j=m.map((T,E)=>({sourceDocument:T,score:A[E]??null,pageNumber:S[E]??null,sheetName:v[E]??null,rowNumber:L[E]??null,knowledgeName:w[E]??null}));return{chatId:t.chatId,answer:f.answer,suggestions:[],citations:j}}async function Pt(e,t){if(!e.endpoints.history)return[];let a=e.getAccessToken?await e.getAccessToken():null,n=await V(e),p=/(\{chatId\}|:chatId\b)/.test(e.endpoints.history)?de(e,e.endpoints.history,{chatId:t}):(()=>{let c=new URL(pe(e.apiBaseUrl,e.endpoints.history));return c.searchParams.set("chat_id",t),c.toString()})(),i=await fetch(p,{method:"GET",headers:q(e,a,n)});i.ok||await K(i,"fetch chat history");let d=await i.json(),u=Array.isArray(d)?d:d&&typeof d=="object"?d.history??d.messages??d.data??[]:[];return Array.isArray(u)?u.map(c=>{if(!c||typeof c!="object")return null;let f=c;if(typeof f.question=="string"&&typeof f.answer=="string")return[{role:"user",text:f.question},{role:"assistant",text:f.answer}];let h=f.role??f.type??f.sender??f.author,m=f.text??f.message??f.content??f.answer;if(typeof m!="string")return null;let A=typeof h=="string"?h.toLowerCase():"assistant";return[{role:A==="user"||A==="human"?"user":"assistant",text:m,...Array.isArray(f.citations)?{citations:f.citations}:{},...typeof f.isLike=="boolean"?{isLike:f.isLike}:{}}]}).flat().filter(c=>!!c):[]}async function St(e){if(!e.endpoints.listChats)return[];let t=e.getAccessToken?await e.getAccessToken():null,a=await V(e),n=await fetch(pe(e.apiBaseUrl,e.endpoints.listChats),{method:"GET",headers:q(e,t,a)});n.ok||await K(n,"fetch chats");let r=await n.json(),p=Array.isArray(r)?r:r&&typeof r=="object"?r.chats??r.data??r.items??[]:[];return Array.isArray(p)?p.map(i=>{if(!i||typeof i!="object")return null;let d=i,u=d.chatId??d.chat_id??d.id,c=d.title??d.name??d.chatId;if(typeof u!="string"||typeof c!="string")return null;let f=typeof d.createdAt=="string"?d.createdAt:typeof d.created_at=="string"?d.created_at:null,h=typeof d.updatedAt=="string"?d.updatedAt:typeof d.updated_at=="string"?d.updated_at:null,m={chatId:u,title:c,pinned:typeof d.pinned=="boolean"?d.pinned:!1};return f&&(m.createdAt=f),h&&(m.updatedAt=h),m}).filter(i=>!!i):[]}async function Tt(e,t,a){let n=e.endpoints.createChat??e.endpoints.listChats;if(!n)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await V(e),i=await fetch(pe(e.apiBaseUrl,n),{method:"POST",headers:q(e,r,p),body:JSON.stringify({chatId:t,chat_id:t,...a?{title:a}:{}})});i.ok||await K(i,"create chat")}async function De(e,t,a){if(!e.endpoints.updateChat)return;let n=e.getAccessToken?await e.getAccessToken():null,r=await V(e),p=de(e,e.endpoints.updateChat,{chatId:t}),i=await fetch(p,{method:"PUT",headers:q(e,n,r),body:JSON.stringify(a)});i.ok||await K(i,"update chat")}async function Et(e,t){if(!e.endpoints.deleteChat)return;let a=e.getAccessToken?await e.getAccessToken():null,n=await V(e),r=de(e,e.endpoints.deleteChat,{chatId:t}),p=await fetch(r,{method:"DELETE",headers:q(e,a,n)});p.ok||await K(p,"delete chat")}function Y(e,t){let a=Lt(t);return e.onError?.(a),a}async function ce(e,t,a,n){if(!e.endpoints.feedback)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await V(e),i=de(e,e.endpoints.feedback,{chatId:t}),d=await fetch(i,{method:"POST",headers:q(e,r,p),body:JSON.stringify({message:a,isLike:n})});d.ok||await K(d,"submit feedback")}var We={accent:"#0f766e",accentSoft:"#ecfeff",panelBackground:"#ffffff",surfaceBackground:"#f8fafc",text:"#1f2937",mutedText:"#64748b",borderColor:"#dbe4ee",shadow:"0 24px 64px rgba(15, 23, 42, 0.20)",zIndex:2147483e3,fontFamily:'"Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif'},C={displayMode:"widget",position:"bottom-right",title:"Knowledge Assistant",subtitle:"Answers are generated based on your access permissions",welcomeMessage:"How can I assist you today?",inputPlaceholder:"Ask your question...",launcherAriaLabel:"Open chat assistant",closeAriaLabel:"Close chat assistant",initialSuggestions:["Which indicators reflect the achievements of Vision KSA goals?","Case studies of real estate initiatives for economic growth","Study of UX for the ministry external portal"],sourceApp:"knowledge-platform",locale:"en",customHeaders:{},assistantPageUrl:"/knowledge-assistant",embedded:{showHeader:!1},rag:{knowledgeNames:[],enableReferences:!0,loadHistoryOnOpen:!1},theme:We,getAccessToken:void 0,getUserContext:void 0,onOpen:void 0,onClose:void 0,onError:void 0,onOpenAssistantPage:void 0,assistantAvatarUrl:""};function It(e){if(!e.apiBaseUrl?.trim())throw new Error("Chat widget config requires a non-empty apiBaseUrl.");if(!e.endpoints?.ask?.trim())throw new Error("Chat widget config requires endpoints.ask to be provided.");let t=e.mount??document.body,a=je(We,e.theme??{});return{apiBaseUrl:e.apiBaseUrl,endpoints:{...e.endpoints},mount:t,assistantAvatarUrl:e.assistantAvatarUrl??C.assistantAvatarUrl,displayMode:e.displayMode??C.displayMode,position:e.position??C.position,title:e.title??C.title,subtitle:e.subtitle??C.subtitle,welcomeMessage:e.welcomeMessage??C.welcomeMessage,inputPlaceholder:e.inputPlaceholder??C.inputPlaceholder,launcherAriaLabel:e.launcherAriaLabel??C.launcherAriaLabel,closeAriaLabel:e.closeAriaLabel??C.closeAriaLabel,initialSuggestions:e.initialSuggestions??C.initialSuggestions,sourceApp:e.sourceApp??C.sourceApp,locale:e.locale??C.locale,customHeaders:e.customHeaders??C.customHeaders,embedded:{...C.embedded,...e.embedded??{}},rag:{...C.rag,...e.rag??{}},assistantPageUrl:e.assistantPageUrl??C.assistantPageUrl,theme:a,getAccessToken:e.getAccessToken,getUserContext:e.getUserContext,userInfo:e.userInfo,onOpen:e.onOpen,onClose:e.onClose,onError:e.onError,onOpenAssistantPage:e.onOpenAssistantPage}}function o(e,t,a){let n=document.createElement(e);return t&&(n.className=t),a!==void 0&&(n.textContent=a),n}var Rt="kp-chat-widget-styles";function zt(e,t){if(e.getElementById(Rt))return;let a=document.createElement("style");a.id=Rt,a.textContent=An(t),e.appendChild(a)}function An(e){return`
//     :host {
//       all: initial;
//     }

//     .kp-chat-widget {
//       --kp-accent: ${e.accent};
//       --kp-accent-soft: ${e.accentSoft};
//       --kp-panel-background: ${e.panelBackground};
//       --kp-surface-background: ${e.surfaceBackground};
//       --kp-text: ${e.text};
//       --kp-muted-text: ${e.mutedText};
//       --kp-border-color: ${e.borderColor};
//       --kp-shadow: ${e.shadow};
//       --kp-z-index: ${e.zIndex};
//       --kp-font-family: ${e.fontFamily};
//       --kp-card-background: rgba(255, 255, 255, 0.92);
//       --kp-soft-highlight: rgba(236, 254, 255, 0.82);
//       position: fixed;
//       bottom: 24px;
//       right: 24px;
//       z-index: var(--kp-z-index);
//       font-family: var(--kp-font-family);
//       color: var(--kp-text);
//       box-sizing: border-box;
//     }

//     .kp-chat-widget.kp-chat-widget-embedded {
//       position: relative;
//       inset: auto;
//       width: 100%;
//       height: 100%;
//       min-height: 640px;
//       display: block;
//     }

//     *,
//     *::before,
//     *::after {
//       box-sizing: border-box;
//       font-family: inherit;
//     }

//     .kp-chat-widget.bottom-left {
//       left: 24px;
//       right: auto;
//     }

//     .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
//       left: auto;
//       right: auto;
//     }

//     .kp-rtl .kp-dropdown-item,
//     .kp-rtl .kp-suggestion,
//     .kp-rtl .kp-input,
//     .kp-rtl .kp-full-page-search-input,
//     .kp-rtl .kp-bubble-content,
//     .kp-rtl .kp-source-card,
//     .kp-rtl .kp-source-panel {
//       text-align: right;
//     }

//     .kp-launcher {
//       width: 72px;
//       height: 72px;
//       border: none;
//       border-radius: 999px;
//       cursor: pointer;
//       background: radial-gradient(circle at 30% 30%, #f8fffe 0%, #ecfdf5 52%, #d6f4ef 100%);
//       box-shadow: 0 16px 32px rgba(15, 118, 110, 0.18);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease;
//       color: var(--kp-accent);
//       position: relative;
//       overflow: hidden;
//     }

//     .kp-launcher:hover {
//       transform: translateY(-1px);
//       box-shadow: 0 20px 36px rgba(15, 118, 110, 0.22);
//     }

//     .kp-launcher:focus-visible,
//     .kp-close:focus-visible,
//     .kp-send:focus-visible,
//     .kp-suggestion:focus-visible,
//     .kp-input:focus-visible,
//     .kp-full-page-new-chat:focus-visible,
//     .kp-full-page-close:focus-visible,
//     .kp-full-page-chat-item:focus-visible,
//     .kp-chat-pin:focus-visible,
//     .kp-message-action:focus-visible,
//     .kp-source-chip:focus-visible,
//     .kp-source-panel-close:focus-visible {
//       outline: 2px solid var(--kp-accent);
//       outline-offset: 2px;
//     }

//     .kp-launcher.hidden {
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(8px) scale(0.96);
//     }

//     .kp-star-cluster {
//       position: relative;
//       width: 50px;
//       height: 50px;
//       animation: kp-cluster-rotate 8.5s linear infinite;
//     }

//     .kp-star {
//       position: absolute;
//       color: #08384c;
//       line-height: 1;
//       transform-origin: center;
//     }

//     .kp-star.main {
//       top: 50%;
//       left: 50%;
//       font-size: 30px;
//       transform: translate(-50%, -50%) scale(0.96);
//       animation: kp-main-pulse 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-a {
//       top: -3px;
//       left: 50%;
//       font-size: 18px;
//       transform: translateX(-50%);
//       animation: kp-orbit-a 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-b {
//       right: -3px;
//       bottom: 5px;
//       font-size: 18px;
//       animation: kp-orbit-b 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-c {
//       left: -1px;
//       bottom: 5px;
//       font-size: 18px;
//       animation: kp-orbit-c 3s ease-in-out infinite;
//     }

//     .kp-overlay {
//       position: fixed;
//       inset: 0;
//       background: rgba(15, 23, 42, 0.18);
//       opacity: 0;
//       pointer-events: none;
//       transition: opacity 220ms ease;
//     }

//     .kp-overlay.visible {
//       opacity: 1;
//       pointer-events: auto;
//     }

//     .kp-panel {
//       position: fixed;
//       bottom: 88px;
//       right: 24px;
//       width: min(480px, calc(100vw - 48px));
//       height: min(730px, calc(100vh - 118px));
//       background: var(--kp-panel-background);
//       border: 1px solid rgba(255, 255, 255, 0.35);
//       border-radius: 24px;
//       box-shadow: var(--kp-shadow);
//       overflow: hidden;
//       display: flex;
//       flex-direction: column;
//       opacity: 0;
//       transform: translateX(112px) scale(0.97);
//       transform-origin: bottom right;
//       pointer-events: none;
//       transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
//         transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
//     }

//     .kp-chat-widget.bottom-left .kp-panel {
//       left: 24px;
//       right: auto;
//       transform: translateX(-112px) scale(0.97);
//       transform-origin: bottom left;
//     }

//     .kp-chat-widget .kp-panel.open,
//     .kp-chat-widget.bottom-left .kp-panel.open {
//       opacity: 1;
//       transform: translateX(0) scale(1);
//       pointer-events: auto;
//     }

//     .kp-full-page {
//       position: fixed;
//       inset: 0;
//       background: #ffffff;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(18px);
//       transition: opacity 260ms ease, transform 320ms ease;
//       z-index: calc(var(--kp-z-index) + 2);
//       overflow: hidden;
//     }

//     .kp-full-page.kp-full-page-embedded {
//       position: relative;
//       inset: auto;
//       opacity: 1;
//       pointer-events: auto;
//       transform: none;
//       min-height: 100%;
//       height: 100%;
//       z-index: auto;
//       background: transparent;
//     }

//     .kp-full-page.open {
//       opacity: 1;
//       pointer-events: auto;
//       transform: translateY(0);
//     }

//     .kp-full-page-shell {
//       height: 100vh;
//       display: flex;
//       flex-direction: column;
//       padding: 22px 28px 26px;
//       gap: 16px;
//       overflow: hidden;
//     }

//     .kp-full-page-embedded .kp-full-page-shell {
//       height: 100%;
//       min-height: 100%;
//       padding: 0;
//       gap: 12px;
//     }

//     .kp-full-page-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 16px;
//       padding: 8px 4px 0;
//       flex: none;
//     }

//     .kp-hidden {
//       display: none !important;
//     }

//     .kp-full-page-brand {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       color: #08384c;
//     }

//     .kp-full-page-brand-mark {
//       width: 44px;
//       height: 44px;
//       border-radius: 14px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: linear-gradient(135deg, rgba(37, 181, 192, 0.14), rgba(15, 118, 110, 0.08));
//       font-size: 26px;
//       box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
//     }

//     .kp-full-page-brand-text {
//       font-size: 20px;
//       font-weight: 700;
//       letter-spacing: -0.02em;
//       color: #16394b;
//     }

//     .kp-full-page-header-actions {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//     }

//     .kp-full-page-badge {
//       padding: 10px 14px;
//       border-radius: 999px;
//       font-size: 13px;
//       line-height: 1;
//       color: #0b556c;
//       background: rgba(255, 255, 255, 0.82);
//       border: 1px solid rgba(15, 118, 110, 0.12);
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//     }

//     .kp-full-page-close,
//     .kp-source-panel-close {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 14px;
//       background: rgba(255, 255, 255, 0.82);
//       color: #61788a;
//       font-size: 24px;
//       line-height: 1;
//       cursor: pointer;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//     }

//     .kp-full-page-content {
//       display: grid;
//       grid-template-columns: 290px minmax(0, 1fr) minmax(0, 0);
//       gap: 16px;
//       flex: 1;
//       min-height: 0;
//       overflow: hidden;
//       align-items: stretch;
//     }

//     .kp-full-page-embedded .kp-full-page-content {
//       height: 100%;
//     }

//     .kp-full-page-sidebar,
//     .kp-full-page-panel,
//     .kp-source-panel {
//       border-radius: 24px;
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       background: rgba(255, 255, 255, 0.88);
//       box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
//       backdrop-filter: blur(12px);
//     }

//     .kp-full-page-sidebar {
//       padding: 18px;
//       display: flex;
//       flex-direction: column;
//       gap: 16px;
//       min-height: 0;
//       overflow: auto;
//     }

//     .kp-full-page-new-chat {
//       width: 100%;
//       height: 48px;
//       border: none;
//       border-radius: 12px;
//       background: linear-gradient(135deg, #0a465d 0%, #0f6a75 100%);
//       color: #ffffff;
//       font-size: 16px;
//       font-weight: 600;
//       cursor: pointer;
//       box-shadow: 0 14px 30px rgba(10, 70, 93, 0.18);
//     }

//     .kp-full-page-search {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       height: 44px;
//       border-radius: 12px;
//       border: 1px solid rgba(203, 213, 225, 0.95);
//       background: #ffffff;
//       padding: 0 12px;
//     }

//     .kp-full-page-search-input {
//       flex: 1;
//       border: none;
//       outline: none;
//       background: transparent;
//       color: #334155;
//       font-size: 14px;
//       min-width: 0;
//       box-shadow: none;
//     }

//     .kp-full-page-search-input:focus,
//     .kp-full-page-search-input:focus-visible,
//     .kp-full-page-search-input:active {
//       outline: none;
//       box-shadow: none;
//       border: none;
//     }

//     .kp-full-page-search-icon {
//       color: #607082;
//       font-size: 20px;
//       line-height: 1;
//     }

//     .kp-full-page-section-label {
//       font-size: 12px;
//       line-height: 1.4;
//       text-transform: uppercase;
//       letter-spacing: 0.08em;
//       color: #8a98a6;
//       margin-top: 4px;
//     }

//     .kp-full-page-recent-list,
//     .kp-full-page-pinned-list {
//       display: flex;
//       flex-direction: column;
//       gap: 8px;
//     }

//     .kp-full-page-item {
//       padding: 12px 12px 13px;
//       border-radius: 14px;
//       color: #293845;
//       font-size: 15px;
//       line-height: 1.5;
//       background: rgba(247, 250, 252, 0.9);
//       border: 1px solid rgba(219, 228, 238, 0.88);
//     }

//     .kp-full-page-chat-item {
//       position: relative;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 10px;
//       cursor: pointer;
//       transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;
//       overflow: visible;
//     }

//     .kp-full-page-chat-item:hover {
//       border-color: rgba(15, 118, 110, 0.34);
//       background: rgba(240, 253, 250, 0.95);
//       transform: translateY(-1px);
//     }

//     .kp-full-page-chat-item.active {
//       border-color: rgba(15, 118, 110, 0.5);
//       background: rgba(220, 252, 231, 0.72);
//     }

//     .kp-full-page-chat-item.menu-open {
//       z-index: 4;
//     }

//     .kp-full-page-item-title {
//       min-width: 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       flex: 1;
//     }

//     .kp-chat-pin {
//       flex: none;
//       border: none;
//       background: transparent;
//       color: #0f6a75;
//       font-size: 16px;
//       line-height: 1;
//       padding: 0;
//       cursor: pointer;
//     }

//     .kp-full-page-empty {
//       padding: 8px 4px 0;
//       color: #7a8a99;
//       font-size: 14px;
//       line-height: 1.5;
//     }

//     .kp-full-page-main {
//       min-width: 0;
//       min-height: 0;
//       display: flex;
//     }

//     .kp-full-page-panel {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       min-height: 0;
//       overflow: hidden;
//     }

//     .kp-source-panel {
//       min-width: 0;
//       min-height: 0;
//       overflow: hidden;
//       display: none;
//       flex-direction: column;
//     }

//     .kp-source-panel.open {
//       display: flex;
//     }

//     .kp-full-page-content:has(.kp-source-panel.open) {
//       grid-template-columns: 290px minmax(0, 1fr) 320px;
//     }

//     .kp-source-panel-header {
//       display: flex;
//       align-items: flex-start;
//       justify-content: space-between;
//       gap: 12px;
//       padding: 18px 18px 12px;
//       border-bottom: 1px solid rgba(219, 228, 238, 0.7);
//     }

//     .kp-source-panel-title {
//       font-size: 17px;
//       font-weight: 700;
//       color: #16394b;
//     }

//     .kp-source-panel-subtitle {
//       margin-top: 4px;
//       font-size: 12px;
//       color: #7a8a99;
//     }

//     .kp-source-panel-list {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       padding: 16px;
//       overflow: auto;
//     }

//     .kp-source-panel-empty {
//       color: #7a8a99;
//       font-size: 14px;
//       line-height: 1.5;
//     }

//     .kp-source-card {
//       width: 100%;
//       text-align: left;
//       cursor: pointer;
//       appearance: none;
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       border-radius: 16px;
//       background: #ffffff;
//       padding: 14px;
//     }

//     .kp-source-card-media {
//       display: flex;
//       align-items: center;
//       margin-bottom: 10px;
//     }

//     .kp-source-thumb,
//     .kp-source-thumb-large {
//       flex: none;
//       width: 32px;
//       height: 32px;
//       border-radius: 999px;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       background: linear-gradient(180deg, #eefcf8 0%, #dff7f2 100%);
//       border: 1px solid rgba(15, 118, 110, 0.18);
//       color: #0f6a75;
//       font-size: 14px;
//       line-height: 1;
//       box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
//     }

//     .kp-source-thumb-large {
//       width: 42px;
//       height: 42px;
//       font-size: 18px;
//     }

//     .kp-source-card-title {
//       font-size: 14px;
//       font-weight: 700;
//       color: #16394b;
//       word-break: break-word;
//     }

//     .kp-source-card-meta {
//       margin-top: 8px;
//       font-size: 12px;
//       line-height: 1.5;
//       color: #667a8d;
//       word-break: break-word;
//     }

//     .kp-full-page-body {
//       flex: 1;
//       overflow: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 14px;
//       padding: 42px 28px 18px;
//       background: #ffffff;
//       scroll-behavior: smooth;
//     }

//     .kp-full-page-body.kp-conversation-active {
//       padding-top: 24px;
//     }

//     .kp-full-page-hero {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       text-align: center;
//       gap: 22px;
//       padding: 18px 18px 12px;
//       max-width: 880px;
//       width: 100%;
//       margin: 0 auto;
//     }

//     .kp-full-page-hero-badge {
//       width: 140px;
//       height: 140px;
//       border-radius: 999px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: radial-gradient(circle at 30% 30%, #f8fdff 0%, #edf8ff 50%, #e4eef8 100%);
//       box-shadow:
//         inset 0 2px 0 rgba(255, 255, 255, 0.9),
//         0 22px 40px rgba(15, 23, 42, 0.08);
//     }

//     .kp-star-cluster-static {
//       animation: none;
//     }

//     .kp-full-page-hero-text {
//       max-width: 760px;
//       font-size: 26px;
//       line-height: 1.5;
//       font-weight: 700;
//       letter-spacing: -0.03em;
//       color: #374151;
//     }

//     .kp-full-page-suggestions {
//       width: min(520px, 100%);
//       margin: auto auto 0;
//     }

//     .kp-full-page-footer {
//       flex: none;
//       padding: 0 16px 18px;
//       background: rgba(255, 255, 255, 0.72);
//       border-top: 1px solid rgba(219, 228, 238, 0.75);
//     }

//     .kp-full-page-form {
//       max-width: none;
//       min-height: 56px;
//       border-radius: 16px;
//     }

//     .kp-full-page-note {
//       font-size: 13px;
//       margin-top: 10px;
//     }

//     .kp-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       gap: 12px;
//       padding: 18px 18px 8px;
//       background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
//     }

//     .kp-toolbar {
//       position: relative;
//       display: flex;
//       align-items: center;
//       gap: 8px;
//     }

//     .kp-tool-button {
//       width: 36px;
//       height: 36px;
//       border: none;
//       border-radius: 12px;
//       background: transparent;
//       color: #0f4f68;
//       cursor: pointer;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       padding: 0;
//       transition: background 140ms ease;
//     }

//     .kp-tool-button:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-pencil-icon {
//       width: 22px;
//       height: 22px;
//       position: relative;
//       display: inline-block;
//     }

//     .kp-pencil-icon::before {
//       content: "";
//       position: absolute;
//       width: 14px;
//       height: 2.5px;
//       background: currentColor;
//       border-radius: 999px;
//       transform: rotate(-45deg);
//       top: 3px;
//       right: 1px;
//     }

//     .kp-pencil-icon::after {
//       content: "";
//       position: absolute;
//       left: 2px;
//       bottom: 2px;
//       width: 11px;
//       height: 11px;
//       border: 2px solid currentColor;
//       border-radius: 4px;
//     }

//     .kp-chevron {
//       font-size: 13px;
//       color: #66839a;
//       transition: transform 160ms ease;
//       margin-left: -2px;
//     }

//     .kp-menu-trigger.open .kp-chevron {
//       transform: rotate(180deg);
//     }

//     .kp-dropdown {
//       position: absolute;
//       top: 44px;
//       left: 0;
//       width: 184px;
//       background: #ffffff;
//       border: 1px solid rgba(15, 79, 104, 0.12);
//       border-radius: 10px;
//       box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
//       padding: 8px;
//       opacity: 0;
//       transform: translateY(-6px);
//       pointer-events: none;
//       transition: opacity 180ms ease, transform 180ms ease;
//       z-index: 2;
//     }

//     .kp-rtl .kp-dropdown {
//       left: auto;
//       right: 0;
//     }

//     .kp-dropdown.open {
//       opacity: 1;
//       transform: translateY(0);
//       pointer-events: auto;
//     }

//     .kp-dropdown-item {
//       width: 100%;
//       border: none;
//       background: transparent;
//       text-align: left;
//       padding: 10px 12px;
//       border-radius: 8px;
//       font-size: 14px;
//       color: var(--kp-text);
//       cursor: pointer;
//     }

//     .kp-dropdown-item:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-title-wrap {
//       display: none;
//     }

//     .kp-close {
//       border: none;
//       background: transparent;
//       font-size: 24px;
//       line-height: 1;
//       color: var(--kp-muted-text);
//       cursor: pointer;
//       padding: 0;
//     }

//     .kp-body {
//       flex: 1;
//       overflow: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       padding: 10px 16px 16px;
//       background: linear-gradient(180deg, #ffffff 0%, var(--kp-surface-background) 100%);
//       scroll-behavior: smooth;
//     }

//     .kp-body.kp-conversation-active {
//       padding-top: 16px;
//     }

//     .kp-panel.kp-sheet-open .kp-body,
//     .kp-panel.kp-sheet-open .kp-footer,
//     .kp-panel.kp-sheet-open .kp-header {
//       opacity: 0;
//       pointer-events: none;
//     }

//     .kp-my-chats-sheet {
//       position: absolute;
//       inset: 0;
//       border-radius: inherit;
//       border: none;
//       background: #ffffff;
//       box-shadow: none;
//       display: none;
//       flex-direction: column;
//       z-index: 3;
//       overflow: hidden;
//     }

//     .kp-my-chats-sheet.open {
//       display: flex;
//     }

//     .kp-my-chats-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       padding: 18px 18px 10px;
//       flex: none;
//       background: #ffffff;
//     }

//     .kp-my-chats-nav {
//       width: 36px;
//       height: 36px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: #61788a;
//       font-size: 22px;
//       line-height: 1;
//       cursor: pointer;
//     }

//     .kp-my-chats-body {
//       flex: 1;
//       overflow: auto;
//       padding: 8px 18px 18px;
//       background: #ffffff;
//     }

//     .kp-my-chats-section-label {
//       font-size: 14px;
//       line-height: 1.5;
//       color: #7a8a99;
//       margin: 14px 0 10px;
//     }

//     .kp-my-chats-list {
//       display: flex;
//       flex-direction: column;
//       gap: 10px;
//     }

//     .kp-chat-actions {
//       position: relative;
//       flex: none;
//     }

//     .kp-chat-actions-trigger {
//       width: 28px;
//       height: 28px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: #526678;
//       font-size: 20px;
//       line-height: 1;
//       cursor: pointer;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//     }

//     .kp-chat-actions-menu {
//       position: absolute;
//       top: 30px;
//       inset-inline-end: 0;
//       width: 120px;
//       padding: 8px;
//       border-radius: 10px;
//       border: 1px solid rgba(219, 228, 238, 0.95);
//       background: #ffffff;
//       box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14);
//       display: none;
//       flex-direction: column;
//       gap: 2px;
//       z-index: 20;
//     }

//     .kp-chat-actions.open .kp-chat-actions-menu {
//       display: flex;
//     }

//     .kp-chat-actions-item {
//       width: 100%;
//       border: none;
//       background: transparent;
//       color: #1f2937;
//       text-align: left;
//       padding: 10px 12px;
//       border-radius: 8px;
//       font-size: 14px;
//       cursor: pointer;
//     }

//     .kp-chat-actions-item:hover {
//       background: rgba(241, 245, 249, 0.95);
//     }

//     .kp-hero {
//       display: flex;
//       gap: 10px;
//       padding: 4px 2px 8px;
//       align-items: flex-start;
//     }

//     .kp-hero-icon {
//       color: #0ea5b7;
//       font-size: 28px;
//       line-height: 1;
//       margin-top: 2px;
//     }

//     .kp-hero-text {
//       font-size: 20px;
//       line-height: 1.45;
//       font-weight: 700;
//       color: #374151;
//     }

//     .kp-message-row {
//       display: flex;
//       align-items: flex-start;
//       gap: 10px;
//       width: 100%;
//     }

//     .kp-message-row.user {
//       justify-content: flex-end;
//     }

//     .kp-avatar {
//       flex: none;
//       width: 36px;
//       height: 36px;
//       border-radius: 999px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 13px;
//       font-weight: 700;
//       box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
//     }

//     .kp-avatar.bot {
//       background: linear-gradient(180deg, #e8fbff 0%, #dff7f2 100%);
//       color: #0f6a75;
//       border: 1px solid rgba(15, 118, 110, 0.16);
//     }

//     .kp-avatar.user {
//       background: linear-gradient(180deg, #fff4ee 0%, #fbe3d5 100%);
//       color: #8c4b1f;
//       border: 1px solid rgba(180, 102, 43, 0.16);
//     }

//     .kp-bubble {
//       max-width: min(85%, 720px);
//       padding: 14px 16px;
//       border-radius: 20px;
//       font-size: 14px;
//       line-height: 1.65;
//       border: 1px solid var(--kp-border-color);
//       background: #ffffff;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
//     }

//     .kp-bubble.user {
//       background: linear-gradient(180deg, #fff8f3 0%, #fdf1e8 100%);
//       border-color: rgba(222, 184, 135, 0.34);
//     }

//     .kp-bubble.bot {
//       background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
//     }

//     .kp-bubble-content {
//       color: var(--kp-text);
//       white-space: normal;
//       word-break: break-word;
//     }

//     .kp-bubble-content p,
//     .kp-bubble-content ul,
//     .kp-bubble-content ol,
//     .kp-bubble-content table,
//     .kp-bubble-content blockquote {
//       margin: 0;
//     }

//     .kp-bubble-content p + p,
//     .kp-bubble-content p + ul,
//     .kp-bubble-content p + ol,
//     .kp-bubble-content ul + p,
//     .kp-bubble-content ol + p,
//     .kp-bubble-content .kp-table-wrap + p,
//     .kp-bubble-content p + .kp-table-wrap,
//     .kp-bubble-content h1 + p,
//     .kp-bubble-content h2 + p,
//     .kp-bubble-content h3 + p {
//       margin-top: 12px;
//     }

//     .kp-bubble-content h1,
//     .kp-bubble-content h2,
//     .kp-bubble-content h3,
//     .kp-bubble-content h4,
//     .kp-bubble-content h5,
//     .kp-bubble-content h6 {
//       margin: 0 0 10px;
//       font-size: 16px;
//       line-height: 1.4;
//       color: #16394b;
//     }

//     .kp-bubble-content ul,
//     .kp-bubble-content ol {
//       padding-inline-start: 20px;
//     }

//     .kp-bubble-content code {
//       padding: 2px 6px;
//       border-radius: 8px;
//       background: rgba(226, 232, 240, 0.66);
//       font-size: 0.92em;
//     }

//     .kp-bubble-content a {
//       color: #0f6a75;
//       text-decoration: underline;
//     }

//     .kp-table-wrap {
//       overflow-x: auto;
//       margin-top: 8px;
//     }

//     .kp-bubble-content table {
//       width: 100%;
//       border-collapse: collapse;
//       border: 1px solid rgba(203, 213, 225, 0.95);
//       border-radius: 14px;
//       overflow: hidden;
//       background: #ffffff;
//     }

//     .kp-bubble-content th,
//     .kp-bubble-content td {
//       padding: 10px 12px;
//       border-bottom: 1px solid rgba(226, 232, 240, 0.95);
//       border-inline-end: 1px solid rgba(226, 232, 240, 0.95);
//       vertical-align: top;
//       text-align: start;
//     }

//     .kp-bubble-content tr:last-child td {
//       border-bottom: none;
//     }

//     .kp-bubble-content th:last-child,
//     .kp-bubble-content td:last-child {
//       border-inline-end: none;
//     }

//     .kp-bubble-content th {
//       background: #f4fbfc;
//       color: #16394b;
//       font-weight: 700;
//     }

//     .kp-meta {
//       font-size: 11px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//       margin-top: 10px;
//     }

//     .kp-source-preview {
//       margin-top: 10px;
//       padding: 12px;
//       border-radius: 16px;
//       border: 1px solid rgba(219, 228, 238, 0.88);
//       background: #ffffff;
//     }

//     .kp-source-preview-title {
//       font-size: 12px;
//       font-weight: 700;
//       color: #16394b;
//       margin-bottom: 8px;
//     }

//     .kp-source-preview-list {
//       display: flex;
//       flex-wrap: nowrap;
//       gap: 8px;
//       overflow-x: auto;
//     }

//     .kp-source-chip {
//       display: inline-flex;
//       align-items: center;
//       gap: 10px;
//       border: 1px solid rgba(15, 118, 110, 0.16);
//       background: #ffffff;
//       color: #0f4f68;
//       border-radius: 999px;
//       padding: 8px 12px;
//       cursor: pointer;
//       font-size: 12px;
//       line-height: 1.3;
//       max-width: 100%;
//       min-width: 0;
//     }

//     .kp-source-chip-more {
//       background: rgba(236, 254, 255, 0.9);
//     }

//     .kp-source-chip-label {
//       min-width: 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//     }

//     .kp-source-thumb-stack {
//       display: inline-flex;
//       align-items: center;
//       margin-inline-end: 2px;
//     }

//     .kp-source-thumb.stacked {
//       margin-inline-end: -10px;
//       background: #ffffff;
//     }

//     .kp-message-actions {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       margin-top: 10px;
//     }

//     .kp-message-action {
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       background: #ffffff;
//       color: #4b6478;
//       border-radius: 999px;
//       padding: 7px 10px;
//       cursor: pointer;
//       font-size: 12px;
//       line-height: 1;
//     }

//     .kp-message-action.active {
//       color: #0f6a75;
//       border-color: rgba(15, 118, 110, 0.3);
//       background: rgba(236, 254, 255, 0.92);
//     }

//     .kp-suggestions {
//       display: flex;
//       flex-direction: column;
//       gap: 10px;
//       margin-top: auto;
//     }

//     .kp-suggestion {
//       border: 1px solid rgba(15, 118, 110, 0.18);
//       background: rgba(247, 251, 255, 0.92);
//       color: var(--kp-text);
//       border-radius: 999px;
//       padding: 11px 14px;
//       cursor: pointer;
//       text-align: left;
//       font-size: 14px;
//       line-height: 1.35;
//     }

//     .kp-footer {
//       padding: 10px 16px 12px;
//       border-top: 1px solid rgba(219, 228, 238, 0.85);
//       background: #ffffff;
//     }

//     .kp-form {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       border: 1px solid var(--kp-border-color);
//       border-radius: 16px;
//       padding: 10px 12px;
//       background: #ffffff;
//     }


//     .kp-input {
//       flex: 1;
//       border: none;
//       outline: none;
//       box-shadow: none;
//       background: transparent;
//       color: var(--kp-text);
//       font-size: 14px;
//       line-height: 1.5;
//       min-width: 0;
//       appearance: none;
//     }

//     .kp-input:focus,
//     .kp-input:focus-visible,
//     .kp-input:active {
//       border: none;
//       outline: none;
//       box-shadow: none;
//     }

//     .kp-send {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 999px;
//       background: #e4f1f8;
//       color: var(--kp-accent);
//       cursor: pointer;
//       font-size: 20px;
//       line-height: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex: none;
//     }
//     .kp-rtl .kp-send {
//       transform: none; /* remove mirroring for RTL, keep button orientation */
//     }

//     .kp-attach {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: var(--kp-accent);
//       cursor: pointer;
//       font-size: 20px;
//       line-height: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex: none;
//       transition: background 140ms ease;
//     }

//     .kp-attach:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-attachment-badge {
//       display: inline-flex;
//       align-items: center;
//       padding: 4px 10px;
//       margin-bottom: 8px;
//       border-radius: 12px;
//       background: rgba(228, 241, 248, 0.8);
//       color: var(--kp-accent);
//       font-size: 12px;
//       font-weight: 500;
//       border: 1px solid rgba(15, 118, 110, 0.2);
//     }


//     .kp-note {
//       margin-top: 8px;
//       text-align: center;
//       font-size: 11px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//     }

//     .kp-loading {
//       font-size: 13px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//       padding: 4px 2px;
//     }

//     @media (max-width: 1100px) {
//       .kp-full-page-content:has(.kp-source-panel.open) {
//         grid-template-columns: 260px minmax(0, 1fr);
//       }

//       .kp-source-panel.open {
//         position: absolute;
//         inset-inline-end: 28px;
//         top: 92px;
//         bottom: 26px;
//         width: min(320px, calc(100vw - 56px));
//         z-index: 3;
//       }
//     }

//     .kp-full-page-menu-btn {
//       display: none;
//       background: none;
//       border: none;
//       font-size: 24px;
//       color: #374151;
//       cursor: pointer;
//       margin-inline-end: 12px;
//       padding: 4px;
//       line-height: 1;
//     }

//     @media (max-width: 860px) {
//       .kp-full-page-menu-btn {
//         display: block;
//       }

//       .kp-full-page-content {
//         display: flex;
//         flex-direction: column;
//       }

//       .kp-full-page-content:has(.kp-source-panel.open) {
//         display: grid;
//         grid-template-columns: 1fr;
//         grid-template-rows: 1fr auto;
//       }

//       .kp-full-page-sidebar {
//         position: fixed;
//         top: 0;
//         left: -100%;
//         width: 280px;
//         height: 100%;
//         max-height: 100vh !important;
//         z-index: 1000;
//         background: #ffffff;
//         box-shadow: 4px 0 24px rgba(0,0,0,0.1);
//         transition: left 0.3s ease;
//         flex: none;
//       }

//       .kp-full-page-sidebar.open {
//         left: 0;
//       }

//       .kp-rtl .kp-full-page-sidebar {
//         left: auto;
//         right: -100%;
//         transition: right 0.3s ease;
//         box-shadow: -4px 0 24px rgba(0,0,0,0.1);
//       }

//       .kp-rtl .kp-full-page-sidebar.open {
//         right: 0;
//       }

//       .kp-full-page-embedded .kp-full-page-sidebar {
//         /* max-height: none; handled by !important above */
//       }

//       .kp-source-panel.open {
//         position: static;
//         inset: auto;
//         width: auto;
//         max-height: 280px;
//       }
//     }

//     @media (max-width: 640px) {
//       .kp-chat-widget,
//       .kp-chat-widget.bottom-left {
//         left: auto;
//         right: 16px;
//         bottom: 16px;
//       }

//       .kp-chat-widget.kp-chat-widget-embedded,
//       .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
//         left: auto;
//         right: auto;
//         bottom: auto;
//       }

//       .kp-panel,
//       .kp-chat-widget.bottom-left .kp-panel {
//         inset: 0;
//         width: 100vw;
//         height: 100vh;
//         border-radius: 0;
//         transform: translateX(72px) scale(0.985);
//         transform-origin: center right;
//       }

//       .kp-panel.open {
//         transform: translateX(0) scale(1);
//       }

//       .kp-full-page-shell {
//         padding: 14px;
//       }

//       .kp-full-page-embedded .kp-full-page-shell {
//         padding: 0;
//       }

//       .kp-full-page-header {
//         padding: 0;
//       }

//       .kp-full-page-body {
//         padding: 24px 16px 16px;
//       }

//       .kp-full-page-hero-badge {
//         width: 112px;
//         height: 112px;
//       }

//       .kp-full-page-hero-text {
//         font-size: 22px;
//       }

//       .kp-message-row {
//         gap: 8px;
//       }

//       .kp-avatar {
//         width: 32px;
//         height: 32px;
//       }

//       .kp-bubble {
//         max-width: calc(100% - 40px);
//       }
//     }

//     @keyframes kp-cluster-rotate {
//       from { transform: rotate(0deg); }
//       to { transform: rotate(360deg); }
//     }

//     @keyframes kp-main-pulse {
//       0%, 100% { transform: translate(-50%, -50%) scale(0.82); opacity: 0.45; }
//       38% { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
//       60% { transform: translate(-50%, -50%) scale(0.94); opacity: 0.88; }
//     }

//     @keyframes kp-orbit-a {
//       0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
//       40% { transform: translate(-50%, 17px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(-50%, 2px) scale(1); opacity: 0.98; }
//     }

//     @keyframes kp-orbit-b {
//       0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
//       40% { transform: translate(-16px, -13px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(-2px, -2px) scale(1); opacity: 0.98; }
//     }

//     @keyframes kp-orbit-c {
//       0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
//       40% { transform: translate(16px, -13px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(2px, -2px) scale(1); opacity: 0.98; }
//     }

//     /* In-Widget Premium Document Preview Overlay Styles */
//     .kp-citation-overlay {
//       position: fixed;
//       inset: 0;
//       background: #f8fafc;
//       color: #1f2937;
//       display: flex;
//       flex-direction: column;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(18px);
//       transition: opacity 260ms ease, transform 320ms ease;
//       z-index: 100000;
//       overflow: hidden;
//       box-sizing: border-box;
//     }

//     .kp-chat-widget-embedded .kp-citation-overlay {
//       position: absolute;
//       inset: 0;
//       z-index: 100000;
//     }

//     .kp-citation-overlay.open {
//       opacity: 1;
//       pointer-events: auto;
//       transform: translateY(0);
//     }

//     .kp-citation-overlay-header {
//       background: #ffffff;
//       border-bottom: 1px solid rgba(226, 232, 240, 0.8);
//       height: 64px;
//       display: flex;
//       align-items: center;
//       padding: 0 24px;
//       justify-content: space-between;
//       flex: none;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-brand {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       font-weight: 600;
//       font-size: 16px;
//       color: #0f766e;
//     }

//     .kp-citation-overlay-brand-logo {
//       font-size: 20px;
//     }

//     .kp-citation-overlay-close {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 14px;
//       background: rgba(255, 255, 255, 0.82);
//       color: #61788a;
//       font-size: 24px;
//       line-height: 1;
//       cursor: pointer;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: background 140ms ease;
//     }

//     .kp-citation-overlay-close:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-citation-overlay-content {
//       display: grid;
//       grid-template-columns: 380px minmax(0, 1fr);
//       flex: 1;
//       overflow: hidden;
//       align-items: stretch;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-metadata-panel {
//       background: #ffffff;
//       border-right: 1px solid #e2e8f0;
//       padding: 32px 24px;
//       overflow-y: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 24px;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-viewer-panel {
//       flex: 1;
//       background: #f1f5f9;
//       display: flex;
//       flex-direction: column;
//       overflow: hidden;
//       box-sizing: border-box;
//     }

//     .doc-badge-wrapper {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }

//     .doc-icon {
//       background: #ecfeff;
//       color: #0f766e;
//       width: 48px;
//       height: 48px;
//       border-radius: 12px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 20px;
//       font-weight: bold;
//     }

//     .doc-badge-info h2 {
//       font-size: 11px;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: #64748b;
//       font-weight: 600;
//       margin: 0;
//     }

//     .doc-title-section h1 {
//       font-size: 18px;
//       font-weight: 700;
//       line-height: 1.4;
//       color: #0f172a;
//       margin: 8px 0 0;
//     }

//     .doc-source-type {
//       font-size: 12px;
//       color: #64748b;
//       margin-top: 4px;
//     }

//     .section-divider {
//       height: 1px;
//       background: #e2e8f0;
//     }

//     .meta-section-title {
//       font-size: 11px;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: #0f766e;
//       font-weight: 600;
//       margin-bottom: 12px;
//     }

//     .summary-box {
//       background: #f8fafc;
//       border: 1px solid #e2e8f0;
//       border-radius: 12px;
//       padding: 16px;
//       font-size: 13.5px;
//       line-height: 1.6;
//       color: #374151;
//       white-space: pre-wrap;
//     }

//     .meta-list {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//     }

//     .meta-item {
//       display: flex;
//       justify-content: space-between;
//       font-size: 13px;
//       line-height: 1.5;
//       border-bottom: 1px dashed #f1f5f9;
//       padding-bottom: 8px;
//     }

//     .meta-label {
//       color: #64748b;
//       font-weight: 500;
//     }

//     .meta-value {
//       color: #1f2937;
//       font-weight: 600;
//       text-align: right;
//       max-width: 200px;
//       word-wrap: break-word;
//     }

//     .viewer-toolbar {
//       background: #0f172a;
//       color: #ffffff;
//       height: 48px;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       padding: 0 20px;
//       font-size: 13px;
//       flex: none;
//       box-sizing: border-box;
//     }

//     .toolbar-left {
//       font-weight: 500;
//       max-width: 300px;
//       white-space: nowrap;
//       overflow: hidden;
//       text-overflow: ellipsis;
//     }

//     .toolbar-center {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }

//     .page-indicator {
//       background: rgba(255, 255, 255, 0.15);
//       padding: 4px 10px;
//       border-radius: 6px;
//       font-weight: 500;
//     }

//     .toolbar-btn {
//       background: transparent;
//       border: none;
//       color: #e2e8f0;
//       cursor: pointer;
//       padding: 4px 12px;
//       border-radius: 6px;
//       font-size: 13px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: all 0.2s;
//       font-weight: 500;
//     }

//     .toolbar-btn:hover {
//       background: rgba(255, 255, 255, 0.1);
//       color: #ffffff;
//     }

//     .toolbar-right {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//     }

//     .viewer-body {
//       flex: 1;
//       overflow: auto;
//       padding: 40px;
//       display: flex;
//       justify-content: center;
//       align-items: flex-start;
//       box-sizing: border-box;
//     }

//     .document-sheet {
//       background: #ffffff;
//       width: 100%;
//       max-width: 800px;
//       min-height: 1000px;
//       box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
//       border-radius: 4px;
//       padding: 60px 50px;
//       display: flex;
//       flex-direction: column;
//       position: relative;
//       transition: transform 0.2s ease;
//       transform-origin: top center;
//       box-sizing: border-box;
//     }

//     .sheet-header {
//       border-bottom: 2px solid #0f766e;
//       padding-bottom: 15px;
//       margin-bottom: 30px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 11px;
//       color: #64748b;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       font-weight: 600;
//     }

//     .sheet-content {
//       font-size: 14.5px;
//       line-height: 1.8;
//       color: #27272a;
//       white-space: pre-wrap;
//       flex: 1;
//       font-family: 'Inter', sans-serif;
//       text-align: left;
//     }

//     .sheet-footer {
//       border-top: 1px solid #e2e8f0;
//       padding-top: 15px;
//       margin-top: 40px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 11px;
//       color: #64748b;
//     }

//     .kp-citation-overlay iframe {
//       width: 100%;
//       height: 100%;
//       border: none;
//     }

//     @media (max-width: 860px) {
//       .kp-citation-overlay-content {
//         grid-template-columns: 1fr;
//         overflow-y: auto;
//       }
      
//       .kp-citation-overlay-metadata-panel {
//         border-right: none;
//         border-bottom: 1px solid #e2e8f0;
//         padding: 20px 16px;
//       }

//       .viewer-body {
//         padding: 20px;
//       }

//       .document-sheet {
//         padding: 30px 20px;
//         min-height: auto;
//       }
//     }
    
//     .kp-floating-menu-wrap {
//       display: none;
//     }
//     .kp-floating-menu-btn {
//       background: none;
//       border: none;
//       color: #374151;
//       cursor: pointer;
//       padding: 8px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       border-radius: 8px;
//     }
//     .kp-floating-menu-btn:hover {
//       background: rgba(0,0,0,0.05);
//     }
//     @media (max-width: 860px) {
//       .kp-floating-menu-wrap {
//         display: flex;
//         padding: 12px 16px 0;
//         flex: none;
//         background: #ffffff;
//       }
//       .kp-full-page-embedded .kp-full-page-shell {
//         gap: 0;
//       }
//       .kp-full-page-body {
//         padding-top: 12px;
//       }
//     }
//   `}var Ht={en:{openChatActions:"Open chat actions",newChat:"New Chat",myChats:"My Chats",openAssistant:"Open Knowledge Assistant",back:"Back",close:"Close",assistantBadge:"Knowledge Assistant",closeAssistantPage:"Close knowledge assistant page",searchChat:"Search Chat",recentActivity:"Recent Activity",pinnedCollections:"Pinned Collections",answersBasedOnPermissions:"Answers are generated based on your access permissions",authTokenForwarded:"Auth token is forwarded from the host app when configured.",thinking:"Thinking...",unableToCreateChat:"Unable to create chat",requestFailed:"Request failed",noRecentChats:"No recent chats yet.",noPinnedChats:"No pinned chats yet.",noChats:"No chats yet.",loadingChats:"Loading chats...",pinChat:"Pin chat",unpinChat:"Unpin chat",renameChat:"Rename",deleteChat:"Delete",chatActions:"Chat actions",renamePrompt:"Enter a new chat name",citationsAttached:e=>`${e} citation${e>1?"s":""} attached`,sourcesUsed:"Sources Used",allSourcesUsed:"All Sources Used",documentsAndReferences:"AI documents and references",showAll:"Show All",noSources:"No sources were returned for this answer.",closeSourcesPanel:"Close sources panel",openSource:"Open source",sourceScore:"Score",sourcePage:"Page",sourceSheet:"Sheet",sourceRow:"Row",sourceKnowledge:"Knowledge Base",untitledSource:"Untitled Source",copy:"Copy",copied:"Copied",helpful:"Helpful",notHelpful:"Needs work",send:"Send message",assistantAvatar:"Assistant",userAvatar:"User"},ar:{openChatActions:"\u0641\u062A\u062D \u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",newChat:"\u0645\u062D\u0627\u062F\u062B\u0629 \u062C\u062F\u064A\u062F\u0629",myChats:"\u0645\u062D\u0627\u062F\u062B\u0627\u062A\u064A",openAssistant:"\u0641\u062A\u062D \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",back:"\u0631\u062C\u0648\u0639",close:"\u0625\u063A\u0644\u0627\u0642",assistantBadge:"\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",closeAssistantPage:"\u0625\u063A\u0644\u0627\u0642 \u0635\u0641\u062D\u0629 \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",searchChat:"\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A",recentActivity:"\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0623\u062E\u064A\u0631",pinnedCollections:"\u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0627\u0644\u0645\u062B\u0628\u062A\u0629",answersBasedOnPermissions:"\u064A\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0625\u062C\u0627\u0628\u0627\u062A \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643",authTokenForwarded:"\u064A\u062A\u0645 \u062A\u0645\u0631\u064A\u0631 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0645\u0636\u064A\u0641 \u0639\u0646\u062F \u0627\u0644\u0625\u0639\u062F\u0627\u062F.",thinking:"\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u0641\u0643\u064A\u0631...",unableToCreateChat:"\u062A\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",requestFailed:"\u0641\u0634\u0644 \u0627\u0644\u0637\u0644\u0628",noRecentChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u062D\u062F\u064A\u062B\u0629 \u0628\u0639\u062F.",noPinnedChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0645\u062B\u0628\u062A\u0629 \u0628\u0639\u062F.",noChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0628\u0639\u062F.",loadingChats:"\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A...",pinChat:"\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",unpinChat:"\u0625\u0644\u063A\u0627\u0621 \u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renameChat:"\u0625\u0639\u0627\u062F\u0629 \u062A\u0633\u0645\u064A\u0629",deleteChat:"\u062D\u0630\u0641",chatActions:"\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renamePrompt:"\u0623\u062F\u062E\u0644 \u0627\u0633\u0645\u064B\u0627 \u062C\u062F\u064A\u062F\u064B\u0627 \u0644\u0644\u0645\u062D\u0627\u062F\u062B\u0629",citationsAttached:e=>`\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 ${e} \u0645\u0631\u062C\u0639${e>1?"\u0627\u062A":""}`,sourcesUsed:"\u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",allSourcesUsed:"\u0643\u0644 \u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",documentsAndReferences:"\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0648\u0645\u0631\u0627\u062C\u0639 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",showAll:"\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",noSources:"\u0644\u0645 \u064A\u062A\u0645 \u0625\u0631\u062C\u0627\u0639 \u0645\u0635\u0627\u062F\u0631 \u0644\u0647\u0630\u0647 \u0627\u0644\u0625\u062C\u0627\u0628\u0629.",closeSourcesPanel:"\u0625\u063A\u0644\u0627\u0642 \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0635\u0627\u062F\u0631",openSource:"\u0641\u062A\u062D \u0627\u0644\u0645\u0635\u062F\u0631",sourceScore:"\u0627\u0644\u062F\u0631\u062C\u0629",sourcePage:"\u0627\u0644\u0635\u0641\u062D\u0629",sourceSheet:"\u0627\u0644\u0648\u0631\u0642\u0629",sourceRow:"\u0627\u0644\u0635\u0641",sourceKnowledge:"\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0645\u0639\u0631\u0641\u0629",untitledSource:"\u0645\u0635\u062F\u0631 \u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646",copy:"\u0646\u0633\u062E",copied:"\u062A\u0645 \u0627\u0644\u0646\u0633\u062E",helpful:"\u0645\u0641\u064A\u062F",notHelpful:"\u064A\u062D\u062A\u0627\u062C \u062A\u062D\u0633\u064A\u0646",send:"\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629",assistantAvatar:"\u0627\u0644\u0645\u0633\u0627\u0639\u062F",userAvatar:"\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645"}};function Pe(e){if(typeof document>"u")throw new Error("Chat widget can only be initialized in a browser.");let t=It(e),a=Fe(t.locale),n=zn(t.locale),r=Hn(a),p=t.displayMode==="embedded",i={chatId:Ae(t),open:!1,fullPageOpen:p,myChatsOpen:!1,accessTokenProvider:t.getAccessToken,historyLoadedChatId:null,menuOpen:!1,chats:[],chatSearchTerm:"",loadingChats:!1,sourcePanelOpen:!1,sourcePanelTitle:null},d=document.createElement("div");d.dataset.chatWidgetHost="true",t.mount.appendChild(d);let u=d.attachShadow({mode:"open"});zt(u,t.theme);let c=o("div",`kp-chat-widget ${t.position}`);c.lang=a,c.dir=r?"rtl":"ltr",p&&(c.classList.add("kp-chat-widget-embedded"),Ut(!0)),r&&c.classList.add("kp-rtl");let f=o("div","kp-overlay"),h=o("button","kp-launcher");h.type="button",h.setAttribute("aria-label",t.launcherAriaLabel),h.innerHTML=['<span class="kp-star-cluster" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let m=o("section","kp-panel");m.setAttribute("role","dialog"),m.setAttribute("aria-modal","true"),m.setAttribute("aria-label",t.title);let A=o("div","kp-header"),S=o("div","kp-toolbar"),v=o("button","kp-tool-button kp-menu-trigger");v.type="button",v.setAttribute("aria-label",n.openChatActions),v.innerHTML=['<span class="kp-pencil-icon" aria-hidden="true"></span>','<span class="kp-chevron" aria-hidden="true">\u2304</span>'].join("");let L=o("div","kp-dropdown"),w=o("button","kp-dropdown-item",n.newChat);w.type="button";let j=o("button","kp-dropdown-item",n.myChats);j.type="button";let T=o("button","kp-dropdown-item",n.openAssistant);T.type="button",L.append(w,j,T),S.append(v,L);let E=o("div","kp-title-wrap"),Wt=o("h2","kp-title",t.title),_t=o("div","kp-subtitle",t.subtitle);E.append(Wt,_t);let fe=o("button","kp-close","\xD7");fe.type="button",fe.setAttribute("aria-label",t.closeAriaLabel),A.append(S,E,fe);let he=o("div","kp-body"),Se=o("div","kp-hero"),Ft=o("div","kp-hero-icon","\u2726"),qt=o("div","kp-hero-text",t.welcomeMessage);Se.append(Ft,qt);let Ve=o("div","kp-footer"),Te=o("form","kp-form"),M=o("input","kp-input");M.type="text",M.autocomplete="off",M.placeholder=t.inputPlaceholder,M.setAttribute("aria-label",t.inputPlaceholder);let Ee=o("button","kp-send","\u279C");Ee.type="submit",Ee.setAttribute("aria-label",n.send);let Vt=o("div","kp-note",n.authTokenForwarded);Te.append(M,Ee),Ve.append(Te,Vt),m.append(A,he,Ve),p||c.append(f,h,m),u.appendChild(c),he.appendChild(Se);let Ke=o("div","kp-suggestions");he.appendChild(Ke);let me=o("section","kp-my-chats-sheet"),Ye=o("div","kp-my-chats-header"),be=o("button","kp-my-chats-nav","\u2190");be.type="button",be.setAttribute("aria-label",n.back);let ke=o("button","kp-my-chats-nav kp-my-chats-close","\xD7");ke.type="button",ke.setAttribute("aria-label",n.close),Ye.append(be,ke);let Xe=o("div","kp-my-chats-body"),Kt=o("div","kp-my-chats-section-label",n.recentActivity),Je=o("div","kp-my-chats-list"),Yt=o("div","kp-my-chats-section-label",n.pinnedCollections),Ge=o("div","kp-my-chats-list");Xe.append(Kt,Je,Yt,Ge),me.append(Ye,Xe),m.appendChild(me);let z={body:he,input:M,suggestions:Ke,hero:Se,kind:"panel"},I=o("section","kp-full-page");p&&I.classList.add("kp-full-page-embedded","open"),I.setAttribute("role","dialog"),p||I.setAttribute("aria-modal","true"),I.setAttribute("aria-label",`${t.title} page`);let Ie=o("div","kp-full-page-shell"),xe=o("div","kp-full-page-header"),Qe=o("div","kp-full-page-brand"),Xt=o("div","kp-full-page-brand-mark","\u2726"),Jt=o("div","kp-full-page-brand-text",t.title),ae=o("button","kp-full-page-menu-btn");ae.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',ae.type="button",ae.setAttribute("aria-label","Toggle sidebar"),ae.addEventListener("click",()=>{oe.classList.toggle("open")}),Qe.append(ae,Xt,Jt);let Ze=o("div","kp-full-page-header-actions"),Gt=o("div","kp-full-page-badge",n.assistantBadge),ye=o("button","kp-full-page-close","\xD7");if(ye.type="button",ye.setAttribute("aria-label",n.closeAssistantPage),Ze.append(Gt,ye),xe.append(Qe,Ze),!t.embedded.showHeader){xe.classList.add("kp-hidden");let s=o("div","kp-floating-menu-wrap"),l=o("button","kp-floating-menu-btn");l.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',l.type="button",l.setAttribute("aria-label","Toggle sidebar"),l.addEventListener("click",()=>{oe.classList.toggle("open")}),s.append(l),Ie.insertBefore(s,xe.nextSibling)}let et=o("div","kp-full-page-content"),oe=o("aside","kp-full-page-sidebar"),Re=o("button","kp-full-page-new-chat",`+ ${n.newChat}`);Re.type="button";let tt=o("div","kp-full-page-search"),se=o("input","kp-full-page-search-input");se.type="search",se.placeholder=n.searchChat;let Qt=o("span","kp-full-page-search-icon","\u2315");tt.append(se,Qt);let Zt=o("div","kp-full-page-section-label",n.recentActivity),nt=o("div","kp-full-page-recent-list"),en=o("div","kp-full-page-section-label",n.pinnedCollections),at=o("div","kp-full-page-pinned-list");oe.append(Re,tt,Zt,nt,en,at);let ot=o("main","kp-full-page-main"),st=o("section","kp-full-page-panel"),ze=o("div","kp-full-page-body"),He=o("div","kp-full-page-hero"),it=o("div","kp-full-page-hero-badge");it.innerHTML=['<span class="kp-star-cluster kp-star-cluster-static" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let tn=o("div","kp-full-page-hero-text",t.welcomeMessage);He.append(it,tn);let rt=o("div","kp-suggestions kp-full-page-suggestions");ze.append(He,rt);let lt=o("div","kp-full-page-footer"),Me=o("form","kp-form kp-full-page-form"),R=o("input","kp-input kp-full-page-input");R.type="text",R.autocomplete="off",R.placeholder=t.inputPlaceholder,R.setAttribute("aria-label",t.inputPlaceholder);let $e=o("button","kp-send kp-full-page-send","\u279C");$e.type="submit",$e.setAttribute("aria-label",n.send);let nn=o("div","kp-note kp-full-page-note",n.answersBasedOnPermissions);Me.append(R,$e),lt.append(Me,nn),st.append(ze,lt),ot.appendChild(st);let ve=o("aside","kp-source-panel"),pt=o("div","kp-source-panel-header"),dt=o("div","kp-source-panel-title-wrap"),ct=o("div","kp-source-panel-title",n.allSourcesUsed),an=o("div","kp-source-panel-subtitle",n.documentsAndReferences);dt.append(ct,an);let we=o("button","kp-source-panel-close","\xD7");we.type="button",we.setAttribute("aria-label",n.closeSourcesPanel),pt.append(dt,we);let ie=o("div","kp-source-panel-list"),on=o("div","kp-source-panel-empty",n.noSources);ie.appendChild(on),ve.append(pt,ie),et.append(oe,ot,ve),Ie.append(xe,et),I.appendChild(Ie),c.appendChild(I);let re=o("div","kp-citation-overlay");c.appendChild(re);let P={body:ze,input:R,suggestions:rt,hero:He,kind:"full-page"},D=()=>({...t,getAccessToken:i.accessTokenProvider}),ut=async()=>{let s=null,l=null;if(t.userInfo)try{let g=await t.userInfo();g&&(s=[g.firstName,g.lastName].filter(Boolean).join(" ")||null,l=g.avatar??null)}catch{}if((!s||!l)&&t.getUserContext)try{let g=await t.getUserContext();g&&(s||(s=[g.firstName,g.lastName].filter(Boolean).join(" ")||g.displayName?.trim()||g.email?.trim()||g.userId?.trim()||null),l||(l=g.avatarUrl??null))}catch{}return{displayName:s,avatarUrl:l}},X=s=>{let l=qe(s)??n.untitledSource,g=(s.text||"").trim(),x=g,y=g.split(`
// `);if(y.length>1&&y[0]){let B=y[0].trim().replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();B&&(B===l||l.indexOf(B)!==-1||B.indexOf(l)!==-1)&&(x=y.slice(1).join(`
// `).trim())}let b=_n(s.sourceDocument),k=[];(s.pageNumber||s.pageNumber===0)&&k.push(`
//         <div class="meta-item">
//           <span class="meta-label">Page Number</span>
//           <span class="meta-value">${s.pageNumber}</span>
//         </div>
//       `),typeof s.score=="number"&&k.push(`
//         <div class="meta-item">
//           <span class="meta-label">Relevance Score</span>
//           <span class="meta-value">${s.score.toFixed(2)}</span>
//         </div>
//       `),s.sheetName&&k.push(`
//         <div class="meta-item">
//           <span class="meta-label">Sheet Name</span>
//           <span class="meta-value">${O(s.sheetName)}</span>
//         </div>
//       `),(s.rowNumber||s.rowNumber===0)&&k.push(`
//         <div class="meta-item">
//           <span class="meta-label">Row Number</span>
//           <span class="meta-value">${s.rowNumber}</span>
//         </div>
//       `),s.knowledgeName&&k.push(`
//         <div class="meta-item">
//           <span class="meta-label">Database Source</span>
//           <span class="meta-value">${O(s.knowledgeName)}</span>
//         </div>
//       `),k.push(`
//       <div class="meta-item">
//         <span class="meta-label">Classification</span>
//         <span class="meta-value">Uploaded Knowledge</span>
//       </div>
//       <div class="meta-item">
//         <span class="meta-label">Confidentiality</span>
//         <span class="meta-value" style="color: #0f766e;">Public</span>
//       </div>
//       <div class="meta-item">
//         <span class="meta-label">Language</span>
//         <span class="meta-value">English</span>
//       </div>
//     `);let Q=k.join(""),Z=x?O(x):"No text snippet available for this citation.",hn=`
//       <div class="doc-badge-wrapper">
//         <div class="doc-icon">\u{1F4C4}</div>
//         <div class="doc-badge-info">
//           <h2>Document Citation</h2>
//         </div>
//       </div>
      
//       <div class="doc-title-section">
//         <h1>${O(l)}</h1>
//         <div class="doc-source-type">Uploaded Knowledge Resource</div>
//       </div>
      
//       <div class="section-divider"></div>
      
//       <div>
//         <h3 class="meta-section-title">Retrieved Passage Snippet</h3>
//         <div class="summary-box">${Z}</div>
//       </div>
      
//       <div class="section-divider"></div>
      
//       <div>
//         <h3 class="meta-section-title">Metadata & Classification</h3>
//         <div class="meta-list">
//           ${Q}
//         </div>
//       </div>
//     `,Be="";b?Be=`<iframe src="${b}" title="Document Viewer"></iframe>`:Be=`
//         <div class="viewer-toolbar">
//           <div class="toolbar-left">${O(l)}</div>
//           <div class="toolbar-center">
//             <button class="toolbar-btn zoom-out-btn">\u2212</button>
//             <span class="page-indicator">Page ${s.pageNumber||1}</span>
//             <button class="toolbar-btn zoom-in-btn">+</button>
//           </div>
//           <div class="toolbar-right">
//             <button class="toolbar-btn print-btn">\u{1F5A8}\uFE0F Print</button>
//           </div>
//         </div>
//         <div class="viewer-body">
//           <div class="document-sheet">
//             <div class="sheet-header">
//               <span>${O(l)}</span>
//               <span>Page ${s.pageNumber||1}</span>
//             </div>
//             <div class="sheet-content">${O(g||"No document content retrieved.")}</div>
//             <div class="sheet-footer">
//               <span>Confidentiality: Public</span>
//               <span>Knowledge Platform CB</span>
//             </div>
//           </div>
//         </div>
//       `,re.textContent="";let xt=o("header","kp-citation-overlay-header"),yt=o("div","kp-citation-overlay-brand");yt.innerHTML=`
//       <span class="kp-citation-overlay-brand-logo">\u2726</span>
//       <span>Knowledge Assistant Document Viewer</span>
//     `;let Le=o("button","kp-citation-overlay-close","\xD7");Le.type="button",Le.setAttribute("aria-label","Close document preview"),Le.addEventListener("click",()=>{re.classList.remove("open")}),xt.append(yt,Le);let vt=o("div","kp-citation-overlay-content"),wt=o("aside","kp-citation-overlay-metadata-panel");wt.innerHTML=hn;let ee=o("main","kp-citation-overlay-viewer-panel");if(ee.innerHTML=Be,vt.append(wt,ee),re.append(xt,vt),!b){let F=1,B=ee.querySelector(".document-sheet"),mn=ee.querySelector(".zoom-in-btn"),bn=ee.querySelector(".zoom-out-btn"),kn=ee.querySelector(".print-btn");B&&(mn?.addEventListener("click",()=>{F<1.5&&(F+=.1,B.style.transform=`scale(${F})`)}),bn?.addEventListener("click",()=>{F>.6&&(F-=.1,B.style.transform=`scale(${F})`)}),kn?.addEventListener("click",()=>{window.print()}))}re.classList.add("open")},le=(s,l)=>{if(i.sourcePanelOpen=!0,i.sourcePanelTitle=l??n.allSourcesUsed,ct.textContent=i.sourcePanelTitle,ve.classList.add("open"),ie.textContent="",s.length===0){ie.appendChild(o("div","kp-source-panel-empty",n.noSources));return}for(let g of s)ie.appendChild(Wn(g,n,()=>{X(g)}))},J=()=>{i.sourcePanelOpen=!1,i.sourcePanelTitle=null,ve.classList.remove("open")};te(z,t.initialSuggestions,async s=>{await $(s,z)}),te(P,t.initialSuggestions,async s=>{await $(s,P)}),_(),Ce(),p&&(H(),t.rag.loadHistoryOnOpen&&G(P,i.chatId));function Ue(){if(p){i.fullPageOpen=!0,I.classList.add("open");return}i.open||(i.open=!0,i.fullPageOpen=!1,N(),I.classList.remove("open"),h.classList.add("hidden"),f.classList.add("visible"),m.classList.add("open"),t.onOpen?.(),t.rag.loadHistoryOnOpen&&Ne.loadHistory(),queueMicrotask(()=>M.focus()))}function W(){if(p){J();return}i.open&&(U(),N(),i.open=!1,h.classList.remove("hidden"),f.classList.remove("visible"),m.classList.remove("open"),t.onClose?.())}async function $(s,l){let g=s.trim();if(!g)return;l.input.value="";try{await dn(g)}catch(b){let k=Y(t,b);ge(l.body,"bot",`${n.unableToCreateChat}: ${k.message}`,{strings:n,view:l,userName:null,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:le,onShowCitation:X,onLike:()=>{},onDislike:()=>{}});return}_e(l);let x=await ut();ge(l.body,"user",g,{strings:n,view:l,userName:x.displayName,userAvatarUrl:x.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:le,onShowCitation:X,onLike:()=>{},onDislike:()=>{}}),l.body.scrollTop=l.body.scrollHeight;let y=o("div","kp-loading",n.thinking);l.body.appendChild(y),l.body.scrollTop=l.body.scrollHeight;try{let b=await Pn(t),k=await At(D(),{message:g,chatId:i.chatId,knowledgeNames:b,...t.rag.enableReferences!==void 0?{enableReferences:t.rag.enableReferences}:{}});y.isConnected&&y.remove(),ge(l.body,"bot",k.answer,{strings:n,view:l,userName:x.displayName,userAvatarUrl:x.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,citations:k.citations??[],onShowSources:le,onShowCitation:X,onLike:()=>{ce(t,i.chatId,k.answer,!0).catch(console.error)},onDislike:()=>{ce(t,i.chatId,k.answer,!1).catch(console.error)}}),i.historyLoadedChatId=null,await H(),k.suggestions?.length&&te(l,k.suggestions,async Q=>{await $(Q,l)})}catch(b){let k=Y(t,b);y.isConnected&&y.remove(),ge(l.body,"bot",`${n.requestFailed}: ${k.message}`,{strings:n,view:l,userName:x.displayName,userAvatarUrl:x.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:le,onShowCitation:X,onLike:()=>{},onDislike:()=>{}})}}async function gt(s){let l=i.fullPageOpen?P:z;await $(s,l)}async function sn(){if(p){i.fullPageOpen=!0,I.classList.add("open"),await H(),await G(P,i.chatId),queueMicrotask(()=>R.focus());return}i.fullPageOpen=!0,i.open=!1,U(),N(),m.classList.remove("open"),f.classList.remove("visible"),h.classList.add("hidden"),I.classList.add("open"),await H(),await G(P,i.chatId),queueMicrotask(()=>R.focus())}function ft(){if(p){J();return}i.fullPageOpen&&(i.fullPageOpen=!1,I.classList.remove("open"),h.classList.remove("hidden"),J())}function rn(){i.menuOpen=!0,v.classList.add("open"),L.classList.add("open")}function U(){i.menuOpen=!1,v.classList.remove("open"),L.classList.remove("open")}function ln(){i.chatId=Ae(t),i.historyLoadedChatId=null,N(),ue(z),te(z,t.initialSuggestions,async s=>{await $(s,z)}),U()}async function pn(){i.chatId=Ae(t),i.historyLoadedChatId=null,ue(P),J(),te(P,t.initialSuggestions,async s=>{await $(s,P)}),_()}async function H(){if(!t.endpoints.listChats)return _(),Ce(),[];i.loadingChats=!0,_(),Ce();try{let s=await St(D());return i.chats=s,s}catch(s){return Y(t,s),i.chats}finally{i.loadingChats=!1,_(),Ce()}}async function dn(s){!t.endpoints.listChats&&!t.endpoints.createChat||i.chats.some(l=>l.chatId===i.chatId)||await Tt(D(),i.chatId,s?Rn(s,n.newChat):void 0)}async function cn(s){i.chatId=s,i.historyLoadedChatId=null,await G(P,s),_()}async function un(s){i.chatId=s,i.historyLoadedChatId=null,N(),await G(z,s)}async function gn(){U(),await H(),i.myChatsOpen=!0,m.classList.add("kp-sheet-open"),me.classList.add("open")}function N(){i.myChatsOpen=!1,m.classList.remove("kp-sheet-open"),me.classList.remove("open")}function fn(s,l){let g=o("div","kp-overlay visible"),x=o("div","kp-rename-dialog");x.style.cssText="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:320px; background:var(--kp-panel-background); box-shadow:var(--kp-shadow); padding:24px; border-radius:16px; opacity:1; pointer-events:auto; z-index: 10000; display:flex; flex-direction:column; height:min-content; box-sizing:border-box;";let y=o("h3","kp-source-preview-title");y.textContent=n.renamePrompt,y.style.marginBottom="16px",y.style.fontSize="16px";let b=o("input","kp-input");b.type="text",b.value=s.title,b.style.border="1px solid var(--kp-border-color)",b.style.padding="10px",b.style.borderRadius="8px",b.style.width="100%",b.style.marginBottom="20px",b.style.flex="none",b.style.height="40px";let k=o("div","kp-message-actions");k.style.justifyContent="flex-end",k.style.gap="8px";let Q=o("button","kp-message-action",n.close);Q.addEventListener("click",()=>g.remove());let Z=o("button","kp-message-action active","Save");Z.addEventListener("click",async()=>{Z.disabled=!0,Z.textContent="...",await l(b.value),g.remove()}),k.append(Q,Z),x.append(y,b,k),g.appendChild(x),c.appendChild(g),b.focus()}async function ht(s){t.endpoints.updateChat&&fn(s,async l=>{let g=l.trim();if(!(!g||g===s.title))try{await De(D(),s.chatId,{title:g}),await H()}catch(x){Y(t,x)}})}async function mt(s){if(t.endpoints.deleteChat)try{await Et(D(),s.chatId),i.chatId===s.chatId&&(i.chatId=Ae(t),i.historyLoadedChatId=null,ue(z),ue(P)),await H()}catch(l){Y(t,l)}}function _(){Mt(nt,at,i,n,async s=>{await cn(s.chatId),oe.classList.remove("open")},async s=>{await bt(s)},async s=>{await ht(s)},async s=>{await mt(s)})}function Ce(){Mt(Je,Ge,i,n,async s=>{await un(s.chatId)},async s=>{await bt(s)},async s=>{await ht(s)},async s=>{await mt(s)})}async function bt(s){if(t.endpoints.updateChat)try{await De(D(),s.chatId,{pinned:!s.pinned}),await H()}catch(l){Y(t,l)}}async function G(s,l){ue(s),te(s,t.initialSuggestions,async y=>{await $(y,s)});let g=o("div","kp-message kp-message-ai");g.innerHTML='<div class="kp-message-bubble"><div class="kp-typing-indicator"><span></span><span></span><span></span></div></div>',_e(s),s.body.appendChild(g);let x=await Pt(D(),l);if(g.remove(),x.length>0){_e(s),Nt(s.body,s.hero,s.suggestions);let y=await ut();In(s.body,x,{strings:n,view:s,userName:y.displayName,userAvatarUrl:y.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:le,onShowCitation:X,onLike:b=>{ce(t,l,b,!0).catch(console.error)},onDislike:b=>{ce(t,l,b,!1).catch(console.error)}})}return i.historyLoadedChatId=l,x}let Ne={open:Ue,close:W,toggle(){if(p){Ue();return}if(i.open){W();return}Ue()},destroy(){if(document.removeEventListener("keydown",kt),d.remove(),p){let s=!1;document.querySelectorAll("[data-chat-widget-host]").forEach(l=>{let g=l.shadowRoot;g&&g.querySelector(".kp-chat-widget-embedded")&&(s=!0)}),s||Ut(!1)}},sendMessage:gt,setAccessTokenProvider(s){i.accessTokenProvider=s},getChatId(){return i.chatId},loadChats(){return H()},async loadHistory(){let s=i.fullPageOpen?P:z;return G(s,i.chatId)}};h.addEventListener("click",()=>Ne.toggle()),fe.addEventListener("click",W),f.addEventListener("click",W),we.addEventListener("click",J),be.addEventListener("click",N),ke.addEventListener("click",N),v.addEventListener("click",s=>{if(s.stopPropagation(),!i.menuOpen){rn();return}U()}),w.addEventListener("click",ln),j.addEventListener("click",async()=>{await gn()}),T.addEventListener("click",()=>{if(U(),t.onOpenAssistantPage){W(),t.onOpenAssistantPage();return}if(t.assistantPageUrl){W(),window.location.href=t.assistantPageUrl;return}sn()}),ye.addEventListener("click",ft),Re.addEventListener("click",()=>{pn(),queueMicrotask(()=>R.focus())}),se.addEventListener("input",()=>{i.chatSearchTerm=se.value.trim().toLowerCase(),_()}),m.addEventListener("click",s=>{let l=s.target;if(!(l instanceof Element)||!l.closest(".kp-chat-actions")){for(let g of Array.from(u.querySelectorAll(".kp-chat-actions.open")))g.classList.remove("open");for(let g of Array.from(u.querySelectorAll(".kp-full-page-chat-item.menu-open")))g.classList.remove("menu-open")}i.menuOpen&&!L.contains(l)&&!v.contains(l)&&U(),s.stopPropagation()}),u.addEventListener("click",s=>{let l=s.target;if(i.menuOpen&&l instanceof Node&&!L.contains(l)&&!v.contains(l)&&U(),l instanceof Element&&!l.closest(".kp-chat-actions")){for(let g of Array.from(u.querySelectorAll(".kp-chat-actions.open")))g.classList.remove("open");for(let g of Array.from(u.querySelectorAll(".kp-full-page-chat-item.menu-open")))g.classList.remove("menu-open")}}),Te.addEventListener("submit",async s=>{s.preventDefault(),await gt(M.value)}),Me.addEventListener("submit",async s=>{s.preventDefault(),await $(R.value,P)});function kt(s){if(s.key==="Escape"){if(i.sourcePanelOpen){J();return}if(i.myChatsOpen){N();return}if(i.fullPageOpen){if(p)return;ft();return}i.open&&W()}}return document.addEventListener("keydown",kt),Ne}async function Pn(e){if(e.rag.getKnowledgeNames){let t=await e.rag.getKnowledgeNames();return Array.isArray(t)?t.filter(Boolean):[]}return(e.rag.knowledgeNames??[]).filter(Boolean)}function Ae(e){return e.rag.chatId?.trim()?e.rag.chatId:e.rag.chatIdFactory?e.rag.chatIdFactory():typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`kp-chat-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function ge(e,t,a,n){let r=t==="bot"?$n(a,n.citations??[]):{displayText:a,citations:n.citations??[]},p=o("div",`kp-message-row ${t}`),i=Tn(t==="bot"?n.strings.assistantAvatar:n.userName??n.strings.userAvatar,t,t==="bot"?n.assistantAvatarUrl:n.userAvatarUrl),d=o("div",`kp-bubble ${t}`),u=o("div","kp-bubble-content");Fn(u,r.displayText),d.appendChild(u);let c=r.citations;if(c.length){let f=o("div","kp-meta",n.strings.citationsAttached(c.length));d.appendChild(f);let h=o("div","kp-source-preview"),m=o("div","kp-source-preview-title",n.strings.sourcesUsed),A=o("div","kp-source-preview-list");for(let v of c.slice(0,2)){let L=jn(v,n.strings);L.addEventListener("click",async()=>{n.onShowCitation(v)}),A.appendChild(L)}let S=Dn(n.strings);S.addEventListener("click",async()=>{n.onShowSources(c,n.strings.allSourcesUsed)}),A.appendChild(S),h.append(m,A),d.appendChild(h)}return t==="bot"&&d.appendChild(Sn(r.displayText,n.strings,n.onLike,n.onDislike,n.initialFeedback)),t==="user"?p.append(d,i):p.append(i,d),e.appendChild(p),e.scrollTop=e.scrollHeight,p}function Sn(e,t,a,n,r){let p=o("div","kp-message-actions"),i='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',d='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',u='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',c='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>',f=o("button","kp-message-action");f.innerHTML=i,f.type="button",f.setAttribute("title",t.copy),f.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),f.innerHTML=d,window.setTimeout(()=>{f.innerHTML=i},1200)}catch{f.innerHTML=i}});let h=o("button","kp-message-action");h.innerHTML=u,h.type="button",h.setAttribute("aria-label",t.helpful),r===!0&&h.classList.add("active"),h.addEventListener("click",()=>{h.classList.toggle("active"),m.classList.remove("active"),h.classList.contains("active")&&a&&a()});let m=o("button","kp-message-action");return m.innerHTML=c,m.type="button",m.setAttribute("aria-label",t.notHelpful),r===!1&&m.classList.add("active"),m.addEventListener("click",()=>{m.classList.toggle("active"),h.classList.remove("active"),m.classList.contains("active")&&n&&n()}),p.append(f,h,m),p}function Tn(e,t,a){let n=o("div",`kp-avatar ${t}`);if(a){let r=o("img","kp-avatar-img");r.src=a,r.alt=e,r.style.width="100%",r.style.height="100%",r.style.objectFit="cover",r.style.borderRadius="50%",n.appendChild(r)}else{let r=t==="bot"?"\u2726":Mn(e);n.textContent=r}return n.setAttribute("aria-hidden","true"),n}function En(e,t,a){e.textContent="";for(let n of t){let r=o("button","kp-suggestion",n);r.type="button",r.addEventListener("click",async()=>{await a(n)}),e.appendChild(r)}}function te(e,t,a){En(e.suggestions,t,async n=>{e.input.value=n,await a(n)})}function Nt(e,t,a){let n=new Set([t,a]);for(let r of Array.from(e.children))n.has(r)||r.remove()}function _e(e){e.body.classList.add("kp-conversation-active"),e.hero.remove(),e.suggestions.remove()}function ue(e){e.body.classList.remove("kp-conversation-active"),e.hero.isConnected||e.body.prepend(e.hero),e.suggestions.isConnected||e.body.appendChild(e.suggestions),Nt(e.body,e.hero,e.suggestions),e.input.value=""}function In(e,t,a){for(let n of t)ge(e,n.role==="assistant"?"bot":"user",n.text,{...a,...n.citations!==void 0?{citations:n.citations}:{},...n.isLike!==void 0?{initialFeedback:n.isLike}:{},onLike:()=>{a.onLike&&a.onLike(n.text)},onDislike:()=>{a.onDislike&&a.onDislike(n.text)}})}function Mt(e,t,a,n,r,p,i,d){if(e.textContent="",t.textContent="",a.loadingChats){e.appendChild(o("div","kp-full-page-empty",n.loadingChats));return}let u=a.chats.filter(c=>a.chatSearchTerm?c.title.toLowerCase().includes(a.chatSearchTerm):!0);if(u.length>0){let c=u.filter(h=>h.pinned),f=u.filter(h=>!h.pinned).slice(0,8);$t(e,f,a.chatId,n,r,p,i,d),$t(t,c,a.chatId,n,r,p,i,d),f.length===0&&e.appendChild(o("div","kp-full-page-empty",n.noRecentChats)),c.length===0&&t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats));return}e.appendChild(o("div","kp-full-page-empty",n.noChats)),t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats))}function $t(e,t,a,n,r,p,i,d){for(let u of t){let c=o("div",`kp-full-page-item kp-full-page-chat-item${u.chatId===a?" active":""}`),f=o("span","kp-full-page-item-title",u.title),h=o("div","kp-chat-actions"),m=o("button","kp-chat-actions-trigger","\u22EF");m.type="button",m.setAttribute("aria-label",n.chatActions);let A=o("div","kp-chat-actions-menu"),S=o("button","kp-chat-actions-item",u.pinned?n.unpinChat:n.pinChat);S.type="button",S.addEventListener("click",async w=>{w.stopPropagation(),await p(u)});let v=o("button","kp-chat-actions-item",n.renameChat);v.type="button",v.addEventListener("click",async w=>{w.stopPropagation(),await i(u)});let L=o("button","kp-chat-actions-item",n.deleteChat);L.type="button",L.addEventListener("click",async w=>{w.stopPropagation(),await d(u)}),A.append(S,v,L),h.append(m,A),m.addEventListener("click",w=>{w.stopPropagation();let j=h.classList.contains("open");for(let T of Array.from(e.querySelectorAll(".kp-chat-actions.open")))T.classList.remove("open");for(let T of Array.from(e.querySelectorAll(".kp-full-page-chat-item.menu-open")))T.classList.remove("menu-open");j||(h.classList.add("open"),c.classList.add("menu-open"))}),c.append(f,h),c.setAttribute("role","button"),c.tabIndex=0,c.addEventListener("click",async()=>{await r(u)}),c.addEventListener("keydown",async w=>{(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),await r(u))}),c.addEventListener("blur",()=>{h.classList.remove("open"),c.classList.remove("menu-open")}),e.appendChild(c)}}function Rn(e,t){return e.trim().slice(0,60)||t}function Fe(e){return e.toLowerCase().split("-")[0]||"en"}function zn(e){let t=Ht.en;return Ht[Fe(e)]??t}function Hn(e){return["ar","fa","he","ur"].includes(Fe(e))}function Mn(e){let t=e.split(/\s+/).filter(Boolean).slice(0,2);return t.length===0?"U":t.map(a=>a[0]?.toUpperCase()??"").join("")}function qe(e){if(e.knowledgeName?.trim())return e.knowledgeName.trim();if(e.text){let t=e.text.split(`
// `)[0]?.trim();if(t){let a=t.replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();if(a)return a}}if(e.sourceDocument&&/^https?:\/\//i.test(e.sourceDocument)){try{let t=new URL(e.sourceDocument),a=decodeURIComponent(t.pathname),n=a.substring(a.lastIndexOf("/")+1);if(n)return n}catch{}return e.sourceDocument}return e.sourceDocument?.trim()&&!/^c\d+$/i.test(e.sourceDocument)?e.sourceDocument.trim():null}function $n(e,t){let a=Un(e);return{displayText:a.displayText,citations:t.length>0?On(t,a.citations):a.citations}}function Un(e){let a=Bt(e).split(`
// `),n=-1;for(let u=0;u<a.length;u+=1)/^#{0,6}\s*References\s*$/i.test(a[u]?.trim()??"")&&(n=u);if(n===-1)return{displayText:e,citations:[]};let r=a.slice(0,n).join(`
// `).trimEnd(),p=a.slice(n+1).join(`
// `).trim(),d=Nn(p).map(u=>Bn(u)).filter(u=>!!u);return{displayText:r,citations:d}}function Nn(e){let t=[],a="";for(let n of e.split(`
// `)){let r=n.trim();if(r){if(/^\d+\.\s+/.test(r)){a&&t.push(a.trim()),a=r.replace(/^\d+\.\s+/,"");continue}a&&(a=`${a} ${r}`)}}return a&&t.push(a.trim()),t}function Bn(e){let t=e.match(/https?:\/\/\S+/i);if(!t)return null;let a=t[0],n=e.slice(0,t.index).replace(/[.\s]+$/,"").trim();return{sourceDocument:a,knowledgeName:n||a}}function On(e,t){let a=[],n=new Set;for(let r of[...e,...t]){let p=`${r.knowledgeName??""}::${r.sourceDocument??""}`;n.has(p)||(n.add(p),a.push(r))}return a}function jn(e,t){let a=o("button","kp-source-chip");a.type="button",a.setAttribute("aria-label",t.openSource);let n=o("span","kp-source-thumb");n.textContent="\u2726";let r=o("span","kp-source-chip-label",qe(e)??t.untitledSource);return a.append(n,r),a}function Dn(e){let t=o("button","kp-source-chip kp-source-chip-more");t.type="button";let a=o("span","kp-source-thumb-stack");for(let r=0;r<3;r+=1){let p=o("span","kp-source-thumb stacked");p.textContent="\u2726",a.appendChild(p)}let n=o("span","kp-source-chip-label",e.showAll);return t.append(a,n),t}function Wn(e,t,a){let n=o("button","kp-source-card");n.type="button",n.setAttribute("aria-label",t.openSource),n.addEventListener("click",a);let r=o("div","kp-source-card-media"),p=o("span","kp-source-thumb kp-source-thumb-large");p.textContent="\u2726";let i=o("div","kp-source-card-title",qe(e)??t.untitledSource),d=o("div","kp-source-card-meta"),u=[];return typeof e.score=="number"&&u.push(`${t.sourceScore}: ${e.score.toFixed(2)}`),typeof e.pageNumber=="number"&&u.push(`${t.sourcePage}: ${e.pageNumber}`),e.sheetName&&u.push(`${t.sourceSheet}: ${e.sheetName}`),typeof e.rowNumber=="number"&&u.push(`${t.sourceRow}: ${e.rowNumber}`),e.knowledgeName&&u.push(`${t.sourceKnowledge}: ${e.knowledgeName}`),d.textContent=u.join(" \u2022 "),r.appendChild(p),n.append(r,i,d),n}function _n(e){if(!e)return null;let t=e.trim();return/^https?:\/\//i.test(t)?t:null}function Fn(e,t){e.innerHTML=qn(Bt(t))}function Bt(e){return e.replace(/\r\n/g,`
// `)}function qn(e){return e.split(/\n{2,}/).map(a=>a.trim()).filter(Boolean).map(Vn).join("")}function Vn(e){let t=e.split(`
// `).map(n=>n.trimEnd());if(t.every(n=>/^\s*\|.*\|\s*$/.test(n))&&t.length>=2)return Kn(t);if(t.every(n=>/^\d+\.\s+/.test(n)))return`<ol>${t.map(n=>`<li>${ne(n.replace(/^\d+\.\s+/,""))}</li>`).join("")}</ol>`;if(t.every(n=>/^[-*]\s+/.test(n)))return`<ul>${t.map(n=>`<li>${ne(n.replace(/^[-*]\s+/,""))}</li>`).join("")}</ul>`;let a=t[0]?.match(/^(#{1,6})\s+(.*)$/);if(a){let n=a[1]??"#",r=a[2]??"",p=n.length;return`<h${p}>${ne(r)}</h${p}>`}return`<p>${t.map(n=>ne(n)).join("<br>")}</p>`}function Kn(e){let t=e.filter((i,d)=>!(d===1&&/^\s*\|?(\s*:?-{3,}:?\s*\|)+\s*$/.test(i))).map(i=>Yn(i));if(t.length===0)return"";let a=t[0]??[],n=t.slice(1),r=`<thead><tr>${a.map(i=>`<th>${ne(i)}</th>`).join("")}</tr></thead>`,p=n.length?`<tbody>${n.map(i=>`<tr>${i.map(d=>`<td>${ne(d)}</td>`).join("")}</tr>`).join("")}</tbody>`:"";return`<div class="kp-table-wrap"><table>${r}${p}</table></div>`}function Yn(e){return e.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(t=>t.trim())}function ne(e){let t=O(e);return t=t.replace(/&lt;br\s*\/?&gt;/gi,"<br>"),t=t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>'),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*([^*]+)\*/g,"<em>$1</em>"),t}function O(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ut(e){typeof document>"u"||document.querySelectorAll("[data-chat-widget-host]").forEach(t=>{let a=t.shadowRoot;if(a){let n=a.querySelector(".kp-chat-widget");n&&!n.classList.contains("kp-chat-widget-embedded")&&(t.style.display=e?"none":"")}})}var Ot="0.1.0",jt=Pe,Dt={init:jt,createChatWidget:Pe,version:Ot};typeof window<"u"&&(window.ChatWidget=Dt);return Ln(Xn);})();
// //# sourceMappingURL=browser.iife.js.map

// "use strict";var ChatWidget=(()=>{var De=Object.defineProperty;var xn=Object.getOwnPropertyDescriptor;var yn=Object.getOwnPropertyNames;var vn=Object.prototype.hasOwnProperty;var wn=(e,t)=>{for(var a in t)De(e,a,{get:t[a],enumerable:!0})},Cn=(e,t,a,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of yn(t))!vn.call(e,r)&&r!==a&&De(e,r,{get:()=>t[r],enumerable:!(n=xn(t,r))||n.enumerable});return e};var Ln=e=>Cn(De({},"__esModule",{value:!0}),e);var Xn={};wn(Xn,{browserGlobal:()=>Wt,createChatWidget:()=>Se,init:()=>jt,version:()=>Dt});function Lt(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function je(e,t){let a={...e};for(let n of Object.keys(t)){let r=t[n],p=a[n];if(Lt(p)&&Lt(r)){a[n]=je(p,r);continue}r!==void 0&&(a[n]=r)}return a}function At(e){return e instanceof Error?e:typeof e=="string"?new Error(e):new Error("Unexpected widget error")}function q(e,t){return`${e.replace(/\/$/,"")}/${t.replace(/^\//,"")}`}function V(e,t,a){return{"Content-Type":"application/json",...e.customHeaders,...a?{"X-Chat-User-Context":a}:{},...t?{Authorization:`Bearer ${t}`}:{}}}async function K(e){if(!e.getUserContext)return null;let t=await e.getUserContext();return t?JSON.stringify(t):null}function ce(e,t,a={}){let n=t.replace(/\{chatId\}/g,encodeURIComponent(a.chatId??"")).replace(/:chatId\b/g,encodeURIComponent(a.chatId??""));return q(e.apiBaseUrl,n)}async function Y(e,t){let a=`Failed to ${t}. Please try again.`;e.status===400?a="Invalid request. Please check your input and try again.":e.status===401?a="Authentication failed. Please log in again.":e.status===403?a="You do not have permission to perform this action.":e.status===404?a="The requested resource was not found.":e.status===429?a="Too many requests. Please wait a moment and try again.":e.status>=500&&(a="The server is currently experiencing issues. Please try again later.");try{let n=await e.json();n&&typeof n=="object"&&(typeof n.message=="string"?a=n.message:typeof n.error=="string"&&(a=n.error))}catch{}throw new Error(a)}async function Pt(e,t){let a=e.getAccessToken?await e.getAccessToken():null,n=await K(e),r=ce(e,e.endpoints.ask,{chatId:t.chatId}),p={message:t.message,query:t.message,chat_id:t.chatId,knowledgeNames:t.knowledgeNames,knowledge_names:t.knowledgeNames,editLastQa:t.editLastQa??!1,edit_last_qa:t.editLastQa??!1,enableReferences:t.enableReferences??!0,enable_references:t.enableReferences??!0},i=await fetch(r,{method:"POST",headers:V(e,a,n),body:JSON.stringify(p)});i.ok||await Y(i,"send message");let d=i.body?.getReader(),g="";if(d)for(;;){let{done:u,value:f}=await d.read();if(u)break;f&&(g+=new TextDecoder("utf-8").decode(f,{stream:!0}))}else g=await i.text();let c;try{c=JSON.parse(g)}catch{return{chatId:t.chatId,answer:g,suggestions:[],citations:[]}}if(!Array.isArray(c)){if(!c.answer||typeof c.answer!="string")throw new Error("Chat backend response is missing a valid answer.");return{chatId:c.chatId??t.chatId,answer:c.answer,suggestions:c.suggestions??[],citations:c.citations??[]}}if(c.some(u=>u&&typeof u=="object"&&u.type==="answer")){let u="",f=[];for(let k of c)!k||typeof k!="object"||(k.type==="answer"&&typeof k.content=="string"?u=k.content:k.type==="references"&&k.content&&Array.isArray(k.content.citations)&&(f=k.content.citations.map(C=>{let y=C.id,v=C.text||"",A=C.page??null,T="",E=v.split(`
// `)[0];E&&(T=E.split("|")[0].trim());let J=T?q(e.apiBaseUrl,`/my-chats/docs/${encodeURIComponent(T)}`):null;return{knowledgeName:T,text:v,pageNumber:A,sourceDocument:J,score:null,sheetName:null,rowNumber:null}})));if(!u)throw new Error("Chat backend response is missing a valid answer.");return{chatId:t.chatId,answer:u,suggestions:[],citations:f}}else{let u=c[0];if(!u?.answer||typeof u.answer!="string")throw new Error("Chat backend response is missing a valid answer.");let f=u.content,k=f?.source_documents??[],C=f?.scores??[],y=f?.page_numbers??[],v=f?.sheet_names??[],A=f?.row_numbers??[],T=f?.knowledge_names??[],E=k.map((J,D)=>({sourceDocument:J,score:C[D]??null,pageNumber:y[D]??null,sheetName:v[D]??null,rowNumber:A[D]??null,knowledgeName:T[D]??null}));return{chatId:t.chatId,answer:u.answer,suggestions:[],citations:E}}}async function St(e,t){if(!e.endpoints.history)return[];let a=e.getAccessToken?await e.getAccessToken():null,n=await K(e),p=/(\{chatId\}|:chatId\b)/.test(e.endpoints.history)?ce(e,e.endpoints.history,{chatId:t}):(()=>{let c=new URL(q(e.apiBaseUrl,e.endpoints.history));return c.searchParams.set("chat_id",t),c.toString()})(),i=await fetch(p,{method:"GET",headers:V(e,a,n)});i.ok||await Y(i,"fetch chat history");let d=await i.json(),g=Array.isArray(d)?d:d&&typeof d=="object"?d.history??d.messages??d.data??[]:[];return Array.isArray(g)?g.map(c=>{if(!c||typeof c!="object")return null;let m=c;if(typeof m.question=="string"&&typeof m.answer=="string")return[{role:"user",text:m.question},{role:"assistant",text:m.answer}];let u=m.role??m.type??m.sender??m.author,f=m.text??m.message??m.content??m.answer;if(typeof f!="string")return null;let k=typeof u=="string"?u.toLowerCase():"assistant";return[{role:k==="user"||k==="human"?"user":"assistant",text:f,...Array.isArray(m.citations)?{citations:m.citations.map(C=>{if(!C.sourceDocument&&C.text){let y=C.text.split(`
// `)[0],v=y?y.split("|")[0].trim():"";return{...C,knowledgeName:v,sourceDocument:v?q(e.apiBaseUrl,`/my-chats/docs/${encodeURIComponent(v)}`):null}}return C})}:{},...typeof m.isLike=="boolean"?{isLike:m.isLike}:{}}]}).flat().filter(c=>!!c):[]}async function Tt(e){if(!e.endpoints.listChats)return[];let t=e.getAccessToken?await e.getAccessToken():null,a=await K(e),n=await fetch(q(e.apiBaseUrl,e.endpoints.listChats),{method:"GET",headers:V(e,t,a)});n.ok||await Y(n,"fetch chats");let r=await n.json(),p=Array.isArray(r)?r:r&&typeof r=="object"?r.chats??r.data??r.items??[]:[];return Array.isArray(p)?p.map(i=>{if(!i||typeof i!="object")return null;let d=i,g=d.chatId??d.chat_id??d.id,c=d.title??d.name??d.chatId;if(typeof g!="string"||typeof c!="string")return null;let m=typeof d.createdAt=="string"?d.createdAt:typeof d.created_at=="string"?d.created_at:null,u=typeof d.updatedAt=="string"?d.updatedAt:typeof d.updated_at=="string"?d.updated_at:null,f={chatId:g,title:c,pinned:typeof d.pinned=="boolean"?d.pinned:!1};return m&&(f.createdAt=m),u&&(f.updatedAt=u),f}).filter(i=>!!i):[]}async function Et(e,t,a){let n=e.endpoints.createChat??e.endpoints.listChats;if(!n)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await K(e),i=await fetch(q(e.apiBaseUrl,n),{method:"POST",headers:V(e,r,p),body:JSON.stringify({chatId:t,chat_id:t,...a?{title:a}:{}})});i.ok||await Y(i,"create chat")}async function We(e,t,a){if(!e.endpoints.updateChat)return;let n=e.getAccessToken?await e.getAccessToken():null,r=await K(e),p=ce(e,e.endpoints.updateChat,{chatId:t}),i=await fetch(p,{method:"PUT",headers:V(e,n,r),body:JSON.stringify(a)});i.ok||await Y(i,"update chat")}async function It(e,t){if(!e.endpoints.deleteChat)return;let a=e.getAccessToken?await e.getAccessToken():null,n=await K(e),r=ce(e,e.endpoints.deleteChat,{chatId:t}),p=await fetch(r,{method:"DELETE",headers:V(e,a,n)});p.ok||await Y(p,"delete chat")}function X(e,t){let a=At(t);return e.onError?.(a),a}async function ue(e,t,a,n){if(!e.endpoints.feedback)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await K(e),i=ce(e,e.endpoints.feedback,{chatId:t}),d=await fetch(i,{method:"POST",headers:V(e,r,p),body:JSON.stringify({message:a,isLike:n})});d.ok||await Y(d,"submit feedback")}var _e={accent:"#0f766e",accentSoft:"#ecfeff",panelBackground:"#ffffff",surfaceBackground:"#f8fafc",text:"#1f2937",mutedText:"#64748b",borderColor:"#dbe4ee",shadow:"0 24px 64px rgba(15, 23, 42, 0.20)",zIndex:2147483e3,fontFamily:'"Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif'},P={displayMode:"widget",position:"bottom-right",title:"Knowledge Assistant",subtitle:"Answers are generated based on your access permissions",welcomeMessage:"How can I assist you today?",inputPlaceholder:"Ask your question...",launcherAriaLabel:"Open chat assistant",closeAriaLabel:"Close chat assistant",initialSuggestions:["Which indicators reflect the achievements of Vision KSA goals?","Case studies of real estate initiatives for economic growth","Study of UX for the ministry external portal"],sourceApp:"knowledge-platform",locale:"en",customHeaders:{},assistantPageUrl:"/knowledge-assistant",embedded:{showHeader:!1},rag:{knowledgeNames:[],enableReferences:!0,loadHistoryOnOpen:!1},theme:_e,getAccessToken:void 0,getUserContext:void 0,onOpen:void 0,onClose:void 0,onError:void 0,onOpenAssistantPage:void 0,assistantAvatarUrl:""};function Rt(e){if(!e.apiBaseUrl?.trim())throw new Error("Chat widget config requires a non-empty apiBaseUrl.");if(!e.endpoints?.ask?.trim())throw new Error("Chat widget config requires endpoints.ask to be provided.");let t=e.mount??document.body,a=je(_e,e.theme??{});return{apiBaseUrl:e.apiBaseUrl,endpoints:{...e.endpoints},mount:t,assistantAvatarUrl:e.assistantAvatarUrl??P.assistantAvatarUrl,displayMode:e.displayMode??P.displayMode,position:e.position??P.position,title:e.title??P.title,subtitle:e.subtitle??P.subtitle,welcomeMessage:e.welcomeMessage??P.welcomeMessage,inputPlaceholder:e.inputPlaceholder??P.inputPlaceholder,launcherAriaLabel:e.launcherAriaLabel??P.launcherAriaLabel,closeAriaLabel:e.closeAriaLabel??P.closeAriaLabel,initialSuggestions:e.initialSuggestions??P.initialSuggestions,sourceApp:e.sourceApp??P.sourceApp,locale:e.locale??P.locale,customHeaders:e.customHeaders??P.customHeaders,embedded:{...P.embedded,...e.embedded??{}},rag:{...P.rag,...e.rag??{}},assistantPageUrl:e.assistantPageUrl??P.assistantPageUrl,theme:a,getAccessToken:e.getAccessToken,getUserContext:e.getUserContext,userInfo:e.userInfo,onOpen:e.onOpen,onClose:e.onClose,onError:e.onError,onOpenAssistantPage:e.onOpenAssistantPage}}function o(e,t,a){let n=document.createElement(e);return t&&(n.className=t),a!==void 0&&(n.textContent=a),n}var zt="kp-chat-widget-styles";function Ut(e,t){if(e.getElementById(zt))return;let a=document.createElement("style");a.id=zt,a.textContent=An(t),e.appendChild(a)}function An(e){return`
//     :host {
//       all: initial;
//     }

//     .kp-chat-widget {
//       --kp-accent: ${e.accent};
//       --kp-accent-soft: ${e.accentSoft};
//       --kp-panel-background: ${e.panelBackground};
//       --kp-surface-background: ${e.surfaceBackground};
//       --kp-text: ${e.text};
//       --kp-muted-text: ${e.mutedText};
//       --kp-border-color: ${e.borderColor};
//       --kp-shadow: ${e.shadow};
//       --kp-z-index: ${e.zIndex};
//       --kp-font-family: ${e.fontFamily};
//       --kp-card-background: rgba(255, 255, 255, 0.92);
//       --kp-soft-highlight: rgba(236, 254, 255, 0.82);
//       position: fixed;
//       bottom: 24px;
//       right: 24px;
//       z-index: var(--kp-z-index);
//       font-family: var(--kp-font-family);
//       color: var(--kp-text);
//       box-sizing: border-box;
//     }

//     .kp-chat-widget.kp-chat-widget-embedded {
//       position: relative;
//       inset: auto;
//       width: 100%;
//       height: 100%;
//       min-height: 640px;
//       display: block;
//     }

//     *,
//     *::before,
//     *::after {
//       box-sizing: border-box;
//       font-family: inherit;
//     }

//     .kp-chat-widget.bottom-left {
//       left: 24px;
//       right: auto;
//     }

//     .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
//       left: auto;
//       right: auto;
//     }

//     .kp-rtl .kp-dropdown-item,
//     .kp-rtl .kp-suggestion,
//     .kp-rtl .kp-input,
//     .kp-rtl .kp-full-page-search-input,
//     .kp-rtl .kp-bubble-content,
//     .kp-rtl .kp-source-card,
//     .kp-rtl .kp-source-panel {
//       text-align: right;
//     }

//     .kp-launcher {
//       width: 72px;
//       height: 72px;
//       border: none;
//       border-radius: 999px;
//       cursor: pointer;
//       background: radial-gradient(circle at 30% 30%, #f8fffe 0%, #ecfdf5 52%, #d6f4ef 100%);
//       box-shadow: 0 16px 32px rgba(15, 118, 110, 0.18);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease;
//       color: var(--kp-accent);
//       position: relative;
//       overflow: hidden;
//     }

//     .kp-launcher:hover {
//       transform: translateY(-1px);
//       box-shadow: 0 20px 36px rgba(15, 118, 110, 0.22);
//     }

//     .kp-launcher:focus-visible,
//     .kp-close:focus-visible,
//     .kp-send:focus-visible,
//     .kp-suggestion:focus-visible,
//     .kp-input:focus-visible,
//     .kp-full-page-new-chat:focus-visible,
//     .kp-full-page-close:focus-visible,
//     .kp-full-page-chat-item:focus-visible,
//     .kp-chat-pin:focus-visible,
//     .kp-message-action:focus-visible,
//     .kp-source-chip:focus-visible,
//     .kp-source-panel-close:focus-visible {
//       outline: 2px solid var(--kp-accent);
//       outline-offset: 2px;
//     }

//     .kp-launcher.hidden {
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(8px) scale(0.96);
//     }

//     .kp-star-cluster {
//       position: relative;
//       width: 50px;
//       height: 50px;
//       animation: kp-cluster-rotate 8.5s linear infinite;
//     }

//     .kp-star {
//       position: absolute;
//       color: #08384c;
//       line-height: 1;
//       transform-origin: center;
//     }

//     .kp-star.main {
//       top: 50%;
//       left: 50%;
//       font-size: 30px;
//       transform: translate(-50%, -50%) scale(0.96);
//       animation: kp-main-pulse 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-a {
//       top: -3px;
//       left: 50%;
//       font-size: 18px;
//       transform: translateX(-50%);
//       animation: kp-orbit-a 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-b {
//       right: -3px;
//       bottom: 5px;
//       font-size: 18px;
//       animation: kp-orbit-b 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-c {
//       left: -1px;
//       bottom: 5px;
//       font-size: 18px;
//       animation: kp-orbit-c 3s ease-in-out infinite;
//     }

//     .kp-overlay {
//       position: fixed;
//       inset: 0;
//       background: rgba(15, 23, 42, 0.18);
//       opacity: 0;
//       pointer-events: none;
//       transition: opacity 220ms ease;
//     }

//     .kp-overlay.visible {
//       opacity: 1;
//       pointer-events: auto;
//     }

//     .kp-panel {
//       position: fixed;
//       bottom: 88px;
//       right: 24px;
//       width: min(480px, calc(100vw - 48px));
//       height: min(730px, calc(100vh - 118px));
//       background: var(--kp-panel-background);
//       border: 1px solid rgba(255, 255, 255, 0.35);
//       border-radius: 24px;
//       box-shadow: var(--kp-shadow);
//       overflow: hidden;
//       display: flex;
//       flex-direction: column;
//       opacity: 0;
//       transform: translateX(112px) scale(0.97);
//       transform-origin: bottom right;
//       pointer-events: none;
//       transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
//         transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
//     }

//     .kp-chat-widget.bottom-left .kp-panel {
//       left: 24px;
//       right: auto;
//       transform: translateX(-112px) scale(0.97);
//       transform-origin: bottom left;
//     }

//     .kp-chat-widget .kp-panel.open,
//     .kp-chat-widget.bottom-left .kp-panel.open {
//       opacity: 1;
//       transform: translateX(0) scale(1);
//       pointer-events: auto;
//     }

//     .kp-full-page {
//       position: fixed;
//       inset: 0;
//       background: #ffffff;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(18px);
//       transition: opacity 260ms ease, transform 320ms ease;
//       z-index: calc(var(--kp-z-index) + 2);
//       overflow: hidden;
//     }

//     .kp-full-page.kp-full-page-embedded {
//       position: relative;
//       inset: auto;
//       opacity: 1;
//       pointer-events: auto;
//       transform: none;
//       min-height: 100%;
//       height: 100%;
//       z-index: auto;
//       background: transparent;
//     }

//     .kp-full-page.open {
//       opacity: 1;
//       pointer-events: auto;
//       transform: translateY(0);
//     }

//     .kp-full-page-shell {
//       height: 100vh;
//       display: flex;
//       flex-direction: column;
//       padding: 22px 28px 26px;
//       gap: 16px;
//       overflow: hidden;
//     }

//     .kp-full-page-embedded .kp-full-page-shell {
//       height: 100%;
//       min-height: 100%;
//       padding: 0;
//       gap: 12px;
//     }

//     .kp-full-page-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 16px;
//       padding: 8px 4px 0;
//       flex: none;
//     }

//     .kp-hidden {
//       display: none !important;
//     }

//     .kp-full-page-brand {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       color: #08384c;
//     }

//     .kp-full-page-brand-mark {
//       width: 44px;
//       height: 44px;
//       border-radius: 14px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: linear-gradient(135deg, rgba(37, 181, 192, 0.14), rgba(15, 118, 110, 0.08));
//       font-size: 26px;
//       box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
//     }

//     .kp-full-page-brand-text {
//       font-size: 20px;
//       font-weight: 700;
//       letter-spacing: -0.02em;
//       color: #16394b;
//     }

//     .kp-full-page-header-actions {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//     }

//     .kp-full-page-badge {
//       padding: 10px 14px;
//       border-radius: 999px;
//       font-size: 13px;
//       line-height: 1;
//       color: #0b556c;
//       background: rgba(255, 255, 255, 0.82);
//       border: 1px solid rgba(15, 118, 110, 0.12);
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//     }

//     .kp-full-page-close,
//     .kp-source-panel-close {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 14px;
//       background: rgba(255, 255, 255, 0.82);
//       color: #61788a;
//       font-size: 24px;
//       line-height: 1;
//       cursor: pointer;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//     }

//     .kp-full-page-content {
//       display: grid;
//       grid-template-columns: 290px minmax(0, 1fr) minmax(0, 0);
//       gap: 16px;
//       flex: 1;
//       min-height: 0;
//       overflow: hidden;
//       align-items: stretch;
//     }

//     .kp-full-page-embedded .kp-full-page-content {
//       height: 100%;
//     }

//     .kp-full-page-sidebar,
//     .kp-full-page-panel,
//     .kp-source-panel {
//       border-radius: 24px;
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       background: rgba(255, 255, 255, 0.88);
//       box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
//       backdrop-filter: blur(12px);
//     }

//     .kp-full-page-sidebar {
//       padding: 18px;
//       display: flex;
//       flex-direction: column;
//       gap: 16px;
//       min-height: 0;
//       overflow: auto;
//     }

//     .kp-full-page-new-chat {
//       width: 100%;
//       height: 48px;
//       border: none;
//       border-radius: 12px;
//       background: linear-gradient(135deg, #0a465d 0%, #0f6a75 100%);
//       color: #ffffff;
//       font-size: 16px;
//       font-weight: 600;
//       cursor: pointer;
//       box-shadow: 0 14px 30px rgba(10, 70, 93, 0.18);
//     }

//     .kp-full-page-search {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       height: 44px;
//       border-radius: 12px;
//       border: 1px solid rgba(203, 213, 225, 0.95);
//       background: #ffffff;
//       padding: 0 12px;
//     }

//     .kp-full-page-search-input {
//       flex: 1;
//       border: none;
//       outline: none;
//       background: transparent;
//       color: #334155;
//       font-size: 14px;
//       min-width: 0;
//       box-shadow: none;
//     }

//     .kp-full-page-search-input:focus,
//     .kp-full-page-search-input:focus-visible,
//     .kp-full-page-search-input:active {
//       outline: none;
//       box-shadow: none;
//       border: none;
//     }

//     .kp-full-page-search-icon {
//       color: #607082;
//       font-size: 20px;
//       line-height: 1;
//     }

//     .kp-full-page-section-label {
//       font-size: 12px;
//       line-height: 1.4;
//       text-transform: uppercase;
//       letter-spacing: 0.08em;
//       color: #8a98a6;
//       margin-top: 4px;
//     }

//     .kp-full-page-recent-list,
//     .kp-full-page-pinned-list {
//       display: flex;
//       flex-direction: column;
//       gap: 8px;
//     }

//     .kp-full-page-item {
//       padding: 12px 12px 13px;
//       border-radius: 14px;
//       color: #293845;
//       font-size: 15px;
//       line-height: 1.5;
//       background: rgba(247, 250, 252, 0.9);
//       border: 1px solid rgba(219, 228, 238, 0.88);
//     }

//     .kp-full-page-chat-item {
//       position: relative;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 10px;
//       cursor: pointer;
//       transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;
//       overflow: visible;
//     }

//     .kp-full-page-chat-item:hover {
//       border-color: rgba(15, 118, 110, 0.34);
//       background: rgba(240, 253, 250, 0.95);
//       transform: translateY(-1px);
//     }

//     .kp-full-page-chat-item.active {
//       border-color: rgba(15, 118, 110, 0.5);
//       background: rgba(220, 252, 231, 0.72);
//     }

//     .kp-full-page-chat-item.menu-open {
//       z-index: 4;
//     }

//     .kp-full-page-item-title {
//       min-width: 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       flex: 1;
//     }

//     .kp-chat-pin {
//       flex: none;
//       border: none;
//       background: transparent;
//       color: #0f6a75;
//       font-size: 16px;
//       line-height: 1;
//       padding: 0;
//       cursor: pointer;
//     }

//     .kp-full-page-empty {
//       padding: 8px 4px 0;
//       color: #7a8a99;
//       font-size: 14px;
//       line-height: 1.5;
//     }

//     .kp-full-page-main {
//       min-width: 0;
//       min-height: 0;
//       display: flex;
//     }

//     .kp-full-page-panel {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       min-height: 0;
//       overflow: hidden;
//     }

//     .kp-source-panel {
//       min-width: 0;
//       min-height: 0;
//       overflow: hidden;
//       display: none;
//       flex-direction: column;
//     }

//     .kp-source-panel.open {
//       display: flex;
//     }

//     .kp-full-page-content:has(.kp-source-panel.open) {
//       grid-template-columns: 290px minmax(0, 1fr) 320px;
//     }

//     .kp-source-panel-header {
//       display: flex;
//       align-items: flex-start;
//       justify-content: space-between;
//       gap: 12px;
//       padding: 18px 18px 12px;
//       border-bottom: 1px solid rgba(219, 228, 238, 0.7);
//     }

//     .kp-source-panel-title {
//       font-size: 17px;
//       font-weight: 700;
//       color: #16394b;
//     }

//     .kp-source-panel-subtitle {
//       margin-top: 4px;
//       font-size: 12px;
//       color: #7a8a99;
//     }

//     .kp-source-panel-list {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       padding: 16px;
//       overflow: auto;
//     }

//     .kp-source-panel-empty {
//       color: #7a8a99;
//       font-size: 14px;
//       line-height: 1.5;
//     }

//     .kp-source-card {
//       width: 100%;
//       text-align: left;
//       cursor: pointer;
//       appearance: none;
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       border-radius: 16px;
//       background: #ffffff;
//       padding: 14px;
//     }

//     .kp-source-card-media {
//       display: flex;
//       align-items: center;
//       margin-bottom: 10px;
//     }

//     .kp-source-thumb,
//     .kp-source-thumb-large {
//       flex: none;
//       width: 32px;
//       height: 32px;
//       border-radius: 999px;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       background: linear-gradient(180deg, #eefcf8 0%, #dff7f2 100%);
//       border: 1px solid rgba(15, 118, 110, 0.18);
//       color: #0f6a75;
//       font-size: 14px;
//       line-height: 1;
//       box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
//     }

//     .kp-source-thumb-large {
//       width: 42px;
//       height: 42px;
//       font-size: 18px;
//     }

//     .kp-source-card-title {
//       font-size: 14px;
//       font-weight: 700;
//       color: #16394b;
//       word-break: break-word;
//     }

//     .kp-source-card-meta {
//       margin-top: 8px;
//       font-size: 12px;
//       line-height: 1.5;
//       color: #667a8d;
//       word-break: break-word;
//     }

//     .kp-full-page-body {
//       flex: 1;
//       overflow: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 14px;
//       padding: 42px 28px 18px;
//       background: #ffffff;
//       scroll-behavior: smooth;
//     }

//     .kp-full-page-body.kp-conversation-active {
//       padding-top: 24px;
//     }

//     .kp-full-page-hero {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       text-align: center;
//       gap: 22px;
//       padding: 18px 18px 12px;
//       max-width: 880px;
//       width: 100%;
//       margin: 0 auto;
//     }

//     .kp-full-page-hero-badge {
//       width: 140px;
//       height: 140px;
//       border-radius: 999px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: radial-gradient(circle at 30% 30%, #f8fdff 0%, #edf8ff 50%, #e4eef8 100%);
//       box-shadow:
//         inset 0 2px 0 rgba(255, 255, 255, 0.9),
//         0 22px 40px rgba(15, 23, 42, 0.08);
//     }

//     .kp-star-cluster-static {
//       animation: none;
//     }

//     .kp-full-page-hero-text {
//       max-width: 760px;
//       font-size: 26px;
//       line-height: 1.5;
//       font-weight: 700;
//       letter-spacing: -0.03em;
//       color: #374151;
//     }

//     .kp-full-page-suggestions {
//       width: min(520px, 100%);
//       margin: auto auto 0;
//     }

//     .kp-full-page-footer {
//       flex: none;
//       padding: 0 16px 18px;
//       background: rgba(255, 255, 255, 0.72);
//       border-top: 1px solid rgba(219, 228, 238, 0.75);
//     }

//     .kp-full-page-form {
//       max-width: none;
//       min-height: 56px;
//       border-radius: 16px;
//     }

//     .kp-full-page-note {
//       font-size: 13px;
//       margin-top: 10px;
//     }

//     .kp-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       gap: 12px;
//       padding: 18px 18px 8px;
//       background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
//     }

//     .kp-toolbar {
//       position: relative;
//       display: flex;
//       align-items: center;
//       gap: 8px;
//     }

//     .kp-tool-button {
//       width: 36px;
//       height: 36px;
//       border: none;
//       border-radius: 12px;
//       background: transparent;
//       color: #0f4f68;
//       cursor: pointer;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       padding: 0;
//       transition: background 140ms ease;
//     }

//     .kp-tool-button:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-pencil-icon {
//       width: 22px;
//       height: 22px;
//       position: relative;
//       display: inline-block;
//     }

//     .kp-pencil-icon::before {
//       content: "";
//       position: absolute;
//       width: 14px;
//       height: 2.5px;
//       background: currentColor;
//       border-radius: 999px;
//       transform: rotate(-45deg);
//       top: 3px;
//       right: 1px;
//     }

//     .kp-pencil-icon::after {
//       content: "";
//       position: absolute;
//       left: 2px;
//       bottom: 2px;
//       width: 11px;
//       height: 11px;
//       border: 2px solid currentColor;
//       border-radius: 4px;
//     }

//     .kp-chevron {
//       font-size: 13px;
//       color: #66839a;
//       transition: transform 160ms ease;
//       margin-left: -2px;
//     }

//     .kp-menu-trigger.open .kp-chevron {
//       transform: rotate(180deg);
//     }

//     .kp-dropdown {
//       position: absolute;
//       top: 44px;
//       left: 0;
//       width: 184px;
//       background: #ffffff;
//       border: 1px solid rgba(15, 79, 104, 0.12);
//       border-radius: 10px;
//       box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
//       padding: 8px;
//       opacity: 0;
//       transform: translateY(-6px);
//       pointer-events: none;
//       transition: opacity 180ms ease, transform 180ms ease;
//       z-index: 2;
//     }

//     .kp-rtl .kp-dropdown {
//       left: auto;
//       right: 0;
//     }

//     .kp-dropdown.open {
//       opacity: 1;
//       transform: translateY(0);
//       pointer-events: auto;
//     }

//     .kp-dropdown-item {
//       width: 100%;
//       border: none;
//       background: transparent;
//       text-align: left;
//       padding: 10px 12px;
//       border-radius: 8px;
//       font-size: 14px;
//       color: var(--kp-text);
//       cursor: pointer;
//     }

//     .kp-dropdown-item:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-title-wrap {
//       display: none;
//     }

//     .kp-close {
//       border: none;
//       background: transparent;
//       font-size: 24px;
//       line-height: 1;
//       color: var(--kp-muted-text);
//       cursor: pointer;
//       padding: 0;
//     }

//     .kp-body {
//       flex: 1;
//       overflow: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       padding: 10px 16px 16px;
//       background: linear-gradient(180deg, #ffffff 0%, var(--kp-surface-background) 100%);
//       scroll-behavior: smooth;
//     }

//     .kp-body.kp-conversation-active {
//       padding-top: 16px;
//     }

//     .kp-panel.kp-sheet-open .kp-body,
//     .kp-panel.kp-sheet-open .kp-footer,
//     .kp-panel.kp-sheet-open .kp-header {
//       opacity: 0;
//       pointer-events: none;
//     }

//     .kp-my-chats-sheet {
//       position: absolute;
//       inset: 0;
//       border-radius: inherit;
//       border: none;
//       background: #ffffff;
//       box-shadow: none;
//       display: none;
//       flex-direction: column;
//       z-index: 3;
//       overflow: hidden;
//     }

//     .kp-my-chats-sheet.open {
//       display: flex;
//     }

//     .kp-my-chats-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       padding: 18px 18px 10px;
//       flex: none;
//       background: #ffffff;
//     }

//     .kp-my-chats-nav {
//       width: 36px;
//       height: 36px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: #61788a;
//       font-size: 22px;
//       line-height: 1;
//       cursor: pointer;
//     }

//     .kp-my-chats-body {
//       flex: 1;
//       overflow: auto;
//       padding: 8px 18px 18px;
//       background: #ffffff;
//     }

//     .kp-my-chats-section-label {
//       font-size: 14px;
//       line-height: 1.5;
//       color: #7a8a99;
//       margin: 14px 0 10px;
//     }

//     .kp-my-chats-list {
//       display: flex;
//       flex-direction: column;
//       gap: 10px;
//     }

//     .kp-chat-actions {
//       position: relative;
//       flex: none;
//     }

//     .kp-chat-actions-trigger {
//       width: 28px;
//       height: 28px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: #526678;
//       font-size: 20px;
//       line-height: 1;
//       cursor: pointer;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//     }

//     .kp-chat-actions-menu {
//       position: absolute;
//       top: 30px;
//       inset-inline-end: 0;
//       width: 120px;
//       padding: 8px;
//       border-radius: 10px;
//       border: 1px solid rgba(219, 228, 238, 0.95);
//       background: #ffffff;
//       box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14);
//       display: none;
//       flex-direction: column;
//       gap: 2px;
//       z-index: 20;
//     }

//     .kp-chat-actions.open .kp-chat-actions-menu {
//       display: flex;
//     }

//     .kp-chat-actions-item {
//       width: 100%;
//       border: none;
//       background: transparent;
//       color: #1f2937;
//       text-align: left;
//       padding: 10px 12px;
//       border-radius: 8px;
//       font-size: 14px;
//       cursor: pointer;
//     }

//     .kp-chat-actions-item:hover {
//       background: rgba(241, 245, 249, 0.95);
//     }

//     .kp-hero {
//       display: flex;
//       gap: 10px;
//       padding: 4px 2px 8px;
//       align-items: flex-start;
//     }

//     .kp-hero-icon {
//       color: #0ea5b7;
//       font-size: 28px;
//       line-height: 1;
//       margin-top: 2px;
//     }

//     .kp-hero-text {
//       font-size: 20px;
//       line-height: 1.45;
//       font-weight: 700;
//       color: #374151;
//     }

//     .kp-message-row {
//       display: flex;
//       align-items: flex-start;
//       gap: 10px;
//       width: 100%;
//     }

//     .kp-message-row.user {
//       justify-content: flex-end;
//     }

//     .kp-avatar {
//       flex: none;
//       width: 36px;
//       height: 36px;
//       border-radius: 999px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 13px;
//       font-weight: 700;
//       box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
//     }

//     .kp-avatar.bot {
//       background: linear-gradient(180deg, #e8fbff 0%, #dff7f2 100%);
//       color: #0f6a75;
//       border: 1px solid rgba(15, 118, 110, 0.16);
//     }

//     .kp-avatar.user {
//       background: linear-gradient(180deg, #fff4ee 0%, #fbe3d5 100%);
//       color: #8c4b1f;
//       border: 1px solid rgba(180, 102, 43, 0.16);
//     }

//     .kp-bubble {
//       max-width: min(85%, 720px);
//       padding: 14px 16px;
//       border-radius: 20px;
//       font-size: 14px;
//       line-height: 1.65;
//       border: 1px solid var(--kp-border-color);
//       background: #ffffff;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
//     }

//     .kp-bubble.user {
//       background: linear-gradient(180deg, #fff8f3 0%, #fdf1e8 100%);
//       border-color: rgba(222, 184, 135, 0.34);
//     }

//     .kp-bubble.bot {
//       background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
//     }

//     .kp-bubble-content {
//       color: var(--kp-text);
//       white-space: normal;
//       word-break: break-word;
//     }

//     .kp-bubble-content p,
//     .kp-bubble-content ul,
//     .kp-bubble-content ol,
//     .kp-bubble-content table,
//     .kp-bubble-content blockquote {
//       margin: 0;
//     }

//     .kp-bubble-content p + p,
//     .kp-bubble-content p + ul,
//     .kp-bubble-content p + ol,
//     .kp-bubble-content ul + p,
//     .kp-bubble-content ol + p,
//     .kp-bubble-content .kp-table-wrap + p,
//     .kp-bubble-content p + .kp-table-wrap,
//     .kp-bubble-content h1 + p,
//     .kp-bubble-content h2 + p,
//     .kp-bubble-content h3 + p {
//       margin-top: 12px;
//     }

//     .kp-bubble-content h1,
//     .kp-bubble-content h2,
//     .kp-bubble-content h3,
//     .kp-bubble-content h4,
//     .kp-bubble-content h5,
//     .kp-bubble-content h6 {
//       margin: 0 0 10px;
//       font-size: 16px;
//       line-height: 1.4;
//       color: #16394b;
//     }

//     .kp-bubble-content ul,
//     .kp-bubble-content ol {
//       padding-inline-start: 20px;
//     }

//     .kp-bubble-content code {
//       padding: 2px 6px;
//       border-radius: 8px;
//       background: rgba(226, 232, 240, 0.66);
//       font-size: 0.92em;
//     }

//     .kp-bubble-content a {
//       color: #0f6a75;
//       text-decoration: underline;
//     }

//     .kp-table-wrap {
//       overflow-x: auto;
//       margin-top: 8px;
//     }

//     .kp-bubble-content table {
//       width: 100%;
//       border-collapse: collapse;
//       border: 1px solid rgba(203, 213, 225, 0.95);
//       border-radius: 14px;
//       overflow: hidden;
//       background: #ffffff;
//     }

//     .kp-bubble-content th,
//     .kp-bubble-content td {
//       padding: 10px 12px;
//       border-bottom: 1px solid rgba(226, 232, 240, 0.95);
//       border-inline-end: 1px solid rgba(226, 232, 240, 0.95);
//       vertical-align: top;
//       text-align: start;
//     }

//     .kp-bubble-content tr:last-child td {
//       border-bottom: none;
//     }

//     .kp-bubble-content th:last-child,
//     .kp-bubble-content td:last-child {
//       border-inline-end: none;
//     }

//     .kp-bubble-content th {
//       background: #f4fbfc;
//       color: #16394b;
//       font-weight: 700;
//     }

//     .kp-meta {
//       font-size: 11px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//       margin-top: 10px;
//     }

//     .kp-source-preview {
//       margin-top: 10px;
//       padding: 12px;
//       border-radius: 16px;
//       border: 1px solid rgba(219, 228, 238, 0.88);
//       background: #ffffff;
//     }

//     .kp-source-preview-title {
//       font-size: 12px;
//       font-weight: 700;
//       color: #16394b;
//       margin-bottom: 8px;
//     }

//     .kp-source-preview-list {
//       display: flex;
//       flex-wrap: nowrap;
//       gap: 8px;
//       overflow-x: auto;
//     }

//     .kp-source-chip {
//       display: inline-flex;
//       align-items: center;
//       gap: 10px;
//       border: 1px solid rgba(15, 118, 110, 0.16);
//       background: #ffffff;
//       color: #0f4f68;
//       border-radius: 999px;
//       padding: 8px 12px;
//       cursor: pointer;
//       font-size: 12px;
//       line-height: 1.3;
//       max-width: 100%;
//       min-width: 0;
//     }

//     .kp-source-chip-more {
//       background: rgba(236, 254, 255, 0.9);
//     }

//     .kp-source-chip-label {
//       min-width: 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//     }

//     .kp-source-thumb-stack {
//       display: inline-flex;
//       align-items: center;
//       margin-inline-end: 2px;
//     }

//     .kp-source-thumb.stacked {
//       margin-inline-end: -10px;
//       background: #ffffff;
//     }

//     .kp-message-actions {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       margin-top: 10px;
//     }

//     .kp-message-action {
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       background: #ffffff;
//       color: #4b6478;
//       border-radius: 999px;
//       padding: 7px 10px;
//       cursor: pointer;
//       font-size: 12px;
//       line-height: 1;
//     }

//     .kp-message-action.active {
//       color: #0f6a75;
//       border-color: rgba(15, 118, 110, 0.3);
//       background: rgba(236, 254, 255, 0.92);
//     }

//     .kp-suggestions {
//       display: flex;
//       flex-direction: column;
//       gap: 10px;
//       margin-top: auto;
//     }

//     .kp-suggestion {
//       border: 1px solid rgba(15, 118, 110, 0.18);
//       background: rgba(247, 251, 255, 0.92);
//       color: var(--kp-text);
//       border-radius: 999px;
//       padding: 11px 14px;
//       cursor: pointer;
//       text-align: left;
//       font-size: 14px;
//       line-height: 1.35;
//     }

//     .kp-footer {
//       padding: 10px 16px 12px;
//       border-top: 1px solid rgba(219, 228, 238, 0.85);
//       background: #ffffff;
//     }

//     .kp-form {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       border: 1px solid var(--kp-border-color);
//       border-radius: 16px;
//       padding: 10px 12px;
//       background: #ffffff;
//     }


//     .kp-input {
//       flex: 1;
//       border: none;
//       outline: none;
//       box-shadow: none;
//       background: transparent;
//       color: var(--kp-text);
//       font-size: 14px;
//       line-height: 1.5;
//       min-width: 0;
//       appearance: none;
//     }

//     .kp-input:focus,
//     .kp-input:focus-visible,
//     .kp-input:active {
//       border: none;
//       outline: none;
//       box-shadow: none;
//     }

//     .kp-send {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 999px;
//       background: #e4f1f8;
//       color: var(--kp-accent);
//       cursor: pointer;
//       font-size: 20px;
//       line-height: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex: none;
//     }
//     .kp-rtl .kp-send {
//       transform: none; /* remove mirroring for RTL, keep button orientation */
//     }

//     .kp-attach {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: var(--kp-accent);
//       cursor: pointer;
//       font-size: 20px;
//       line-height: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex: none;
//       transition: background 140ms ease;
//     }

//     .kp-attach:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-attachment-badge {
//       display: inline-flex;
//       align-items: center;
//       padding: 4px 10px;
//       margin-bottom: 8px;
//       border-radius: 12px;
//       background: rgba(228, 241, 248, 0.8);
//       color: var(--kp-accent);
//       font-size: 12px;
//       font-weight: 500;
//       border: 1px solid rgba(15, 118, 110, 0.2);
//     }


//     .kp-note {
//       margin-top: 8px;
//       text-align: center;
//       font-size: 11px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//     }

//     .kp-loading {
//       font-size: 13px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//       padding: 4px 2px;
//     }

//     @media (max-width: 1100px) {
//       .kp-full-page-content:has(.kp-source-panel.open) {
//         grid-template-columns: 260px minmax(0, 1fr);
//       }

//       .kp-source-panel.open {
//         position: absolute;
//         inset-inline-end: 28px;
//         top: 92px;
//         bottom: 26px;
//         width: min(320px, calc(100vw - 56px));
//         z-index: 3;
//       }
//     }

//     .kp-full-page-menu-btn {
//       display: none;
//       background: none;
//       border: none;
//       font-size: 24px;
//       color: #374151;
//       cursor: pointer;
//       margin-inline-end: 12px;
//       padding: 4px;
//       line-height: 1;
//     }

//     @media (max-width: 860px) {
//       .kp-full-page-menu-btn {
//         display: block;
//       }

//       .kp-full-page-content {
//         display: flex;
//         flex-direction: column;
//       }

//       .kp-full-page-content:has(.kp-source-panel.open) {
//         display: grid;
//         grid-template-columns: 1fr;
//         grid-template-rows: 1fr auto;
//       }

//       .kp-full-page-sidebar {
//         position: fixed;
//         top: 0;
//         left: -100%;
//         width: 280px;
//         height: 100%;
//         max-height: 100vh !important;
//         z-index: 1000;
//         background: #ffffff;
//         box-shadow: 4px 0 24px rgba(0,0,0,0.1);
//         transition: left 0.3s ease;
//         flex: none;
//       }

//       .kp-full-page-sidebar.open {
//         left: 0;
//       }

//       .kp-rtl .kp-full-page-sidebar {
//         left: auto;
//         right: -100%;
//         transition: right 0.3s ease;
//         box-shadow: -4px 0 24px rgba(0,0,0,0.1);
//       }

//       .kp-rtl .kp-full-page-sidebar.open {
//         right: 0;
//       }

//       .kp-full-page-embedded .kp-full-page-sidebar {
//         /* max-height: none; handled by !important above */
//       }

//       .kp-source-panel.open {
//         position: static;
//         inset: auto;
//         width: auto;
//         max-height: 280px;
//       }
//     }

//     @media (max-width: 640px) {
//       .kp-chat-widget,
//       .kp-chat-widget.bottom-left {
//         left: auto;
//         right: 16px;
//         bottom: 16px;
//       }

//       .kp-chat-widget.kp-chat-widget-embedded,
//       .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
//         left: auto;
//         right: auto;
//         bottom: auto;
//       }

//       .kp-panel,
//       .kp-chat-widget.bottom-left .kp-panel {
//         inset: 0;
//         width: 100vw;
//         height: 100vh;
//         border-radius: 0;
//         transform: translateX(72px) scale(0.985);
//         transform-origin: center right;
//       }

//       .kp-panel.open {
//         transform: translateX(0) scale(1);
//       }

//       .kp-full-page-shell {
//         padding: 14px;
//       }

//       .kp-full-page-embedded .kp-full-page-shell {
//         padding: 0;
//       }

//       .kp-full-page-header {
//         padding: 0;
//       }

//       .kp-full-page-body {
//         padding: 24px 16px 16px;
//       }

//       .kp-full-page-hero-badge {
//         width: 112px;
//         height: 112px;
//       }

//       .kp-full-page-hero-text {
//         font-size: 22px;
//       }

//       .kp-message-row {
//         gap: 8px;
//       }

//       .kp-avatar {
//         width: 32px;
//         height: 32px;
//       }

//       .kp-bubble {
//         max-width: calc(100% - 40px);
//       }
//     }

//     @keyframes kp-cluster-rotate {
//       from { transform: rotate(0deg); }
//       to { transform: rotate(360deg); }
//     }

//     @keyframes kp-main-pulse {
//       0%, 100% { transform: translate(-50%, -50%) scale(0.82); opacity: 0.45; }
//       38% { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
//       60% { transform: translate(-50%, -50%) scale(0.94); opacity: 0.88; }
//     }

//     @keyframes kp-orbit-a {
//       0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
//       40% { transform: translate(-50%, 17px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(-50%, 2px) scale(1); opacity: 0.98; }
//     }

//     @keyframes kp-orbit-b {
//       0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
//       40% { transform: translate(-16px, -13px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(-2px, -2px) scale(1); opacity: 0.98; }
//     }

//     @keyframes kp-orbit-c {
//       0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
//       40% { transform: translate(16px, -13px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(2px, -2px) scale(1); opacity: 0.98; }
//     }

//     /* In-Widget Premium Document Preview Overlay Styles */
//     .kp-citation-overlay {
//       position: fixed;
//       inset: 0;
//       background: #f8fafc;
//       color: #1f2937;
//       display: flex;
//       flex-direction: column;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(18px);
//       transition: opacity 260ms ease, transform 320ms ease;
//       z-index: 100000;
//       overflow: hidden;
//       box-sizing: border-box;
//     }

//     .kp-chat-widget-embedded .kp-citation-overlay {
//       position: absolute;
//       inset: 0;
//       z-index: 100000;
//     }

//     .kp-citation-overlay.open {
//       opacity: 1;
//       pointer-events: auto;
//       transform: translateY(0);
//     }

//     .kp-citation-overlay-header {
//       background: #ffffff;
//       border-bottom: 1px solid rgba(226, 232, 240, 0.8);
//       height: 64px;
//       display: flex;
//       align-items: center;
//       padding: 0 24px;
//       justify-content: space-between;
//       flex: none;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-brand {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       font-weight: 600;
//       font-size: 16px;
//       color: #0f766e;
//     }

//     .kp-citation-overlay-brand-logo {
//       font-size: 20px;
//     }

//     .kp-citation-overlay-close {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 14px;
//       background: rgba(255, 255, 255, 0.82);
//       color: #61788a;
//       font-size: 24px;
//       line-height: 1;
//       cursor: pointer;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: background 140ms ease;
//     }

//     .kp-citation-overlay-close:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-citation-overlay-content {
//       display: grid;
//       grid-template-columns: 380px minmax(0, 1fr);
//       flex: 1;
//       overflow: hidden;
//       align-items: stretch;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-metadata-panel {
//       background: #ffffff;
//       border-right: 1px solid #e2e8f0;
//       padding: 32px 24px;
//       overflow-y: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 24px;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-viewer-panel {
//       flex: 1;
//       background: #f1f5f9;
//       display: flex;
//       flex-direction: column;
//       overflow: hidden;
//       box-sizing: border-box;
//     }

//     .doc-badge-wrapper {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }

//     .doc-icon {
//       background: #ecfeff;
//       color: #0f766e;
//       width: 48px;
//       height: 48px;
//       border-radius: 12px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 20px;
//       font-weight: bold;
//     }

//     .doc-badge-info h2 {
//       font-size: 11px;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: #64748b;
//       font-weight: 600;
//       margin: 0;
//     }

//     .doc-title-section h1 {
//       font-size: 18px;
//       font-weight: 700;
//       line-height: 1.4;
//       color: #0f172a;
//       margin: 8px 0 0;
//     }

//     .doc-source-type {
//       font-size: 12px;
//       color: #64748b;
//       margin-top: 4px;
//     }

//     .section-divider {
//       height: 1px;
//       background: #e2e8f0;
//     }

//     .meta-section-title {
//       font-size: 11px;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: #0f766e;
//       font-weight: 600;
//       margin-bottom: 12px;
//     }

//     .summary-box {
//       background: #f8fafc;
//       border: 1px solid #e2e8f0;
//       border-radius: 12px;
//       padding: 16px;
//       font-size: 13.5px;
//       line-height: 1.6;
//       color: #374151;
//       white-space: pre-wrap;
//     }

//     .meta-list {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//     }

//     .meta-item {
//       display: flex;
//       justify-content: space-between;
//       font-size: 13px;
//       line-height: 1.5;
//       border-bottom: 1px dashed #f1f5f9;
//       padding-bottom: 8px;
//     }

//     .meta-label {
//       color: #64748b;
//       font-weight: 500;
//     }

//     .meta-value {
//       color: #1f2937;
//       font-weight: 600;
//       text-align: right;
//       max-width: 200px;
//       word-wrap: break-word;
//     }

//     .viewer-toolbar {
//       background: #0f172a;
//       color: #ffffff;
//       height: 48px;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       padding: 0 20px;
//       font-size: 13px;
//       flex: none;
//       box-sizing: border-box;
//     }

//     .toolbar-left {
//       font-weight: 500;
//       max-width: 300px;
//       white-space: nowrap;
//       overflow: hidden;
//       text-overflow: ellipsis;
//     }

//     .toolbar-center {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }

//     .page-indicator {
//       background: rgba(255, 255, 255, 0.15);
//       padding: 4px 10px;
//       border-radius: 6px;
//       font-weight: 500;
//     }

//     .toolbar-btn {
//       background: transparent;
//       border: none;
//       color: #e2e8f0;
//       cursor: pointer;
//       padding: 4px 12px;
//       border-radius: 6px;
//       font-size: 13px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: all 0.2s;
//       font-weight: 500;
//     }

//     .toolbar-btn:hover {
//       background: rgba(255, 255, 255, 0.1);
//       color: #ffffff;
//     }

//     .toolbar-right {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//     }

//     .viewer-body {
//       flex: 1;
//       overflow: auto;
//       padding: 40px;
//       display: flex;
//       justify-content: center;
//       align-items: flex-start;
//       box-sizing: border-box;
//     }

//     .document-sheet {
//       background: #ffffff;
//       width: 100%;
//       max-width: 800px;
//       min-height: 1000px;
//       box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
//       border-radius: 4px;
//       padding: 60px 50px;
//       display: flex;
//       flex-direction: column;
//       position: relative;
//       transition: transform 0.2s ease;
//       transform-origin: top center;
//       box-sizing: border-box;
//     }

//     .sheet-header {
//       border-bottom: 2px solid #0f766e;
//       padding-bottom: 15px;
//       margin-bottom: 30px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 11px;
//       color: #64748b;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       font-weight: 600;
//     }

//     .sheet-content {
//       font-size: 14.5px;
//       line-height: 1.8;
//       color: #27272a;
//       white-space: pre-wrap;
//       flex: 1;
//       font-family: 'Inter', sans-serif;
//       text-align: left;
//     }

//     .sheet-footer {
//       border-top: 1px solid #e2e8f0;
//       padding-top: 15px;
//       margin-top: 40px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 11px;
//       color: #64748b;
//     }

//     .kp-citation-overlay iframe {
//       width: 100%;
//       height: 100%;
//       border: none;
//     }

//     @media (max-width: 860px) {
//       .kp-citation-overlay-content {
//         grid-template-columns: 1fr;
//         overflow-y: auto;
//       }
      
//       .kp-citation-overlay-metadata-panel {
//         border-right: none;
//         border-bottom: 1px solid #e2e8f0;
//         padding: 20px 16px;
//       }

//       .viewer-body {
//         padding: 20px;
//       }

//       .document-sheet {
//         padding: 30px 20px;
//         min-height: auto;
//       }
//     }
    
//     .kp-floating-menu-wrap {
//       display: none;
//     }
//     .kp-floating-menu-btn {
//       background: none;
//       border: none;
//       color: #374151;
//       cursor: pointer;
//       padding: 8px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       border-radius: 8px;
//     }
//     .kp-floating-menu-btn:hover {
//       background: rgba(0,0,0,0.05);
//     }
//     @media (max-width: 860px) {
//       .kp-floating-menu-wrap {
//         display: flex;
//         padding: 12px 16px 0;
//         flex: none;
//         background: #ffffff;
//       }
//       .kp-full-page-embedded .kp-full-page-shell {
//         gap: 0;
//       }
//       .kp-full-page-body {
//         padding-top: 12px;
//       }
//     }
//   `}var $t={en:{openChatActions:"Open chat actions",newChat:"New Chat",myChats:"My Chats",openAssistant:"Open Knowledge Assistant",back:"Back",close:"Close",assistantBadge:"Knowledge Assistant",closeAssistantPage:"Close knowledge assistant page",searchChat:"Search Chat",recentActivity:"Recent Activity",pinnedCollections:"Pinned Collections",answersBasedOnPermissions:"Answers are generated based on your access permissions",authTokenForwarded:"Auth token is forwarded from the host app when configured.",thinking:"Thinking...",unableToCreateChat:"Unable to create chat",requestFailed:"Request failed",noRecentChats:"No recent chats yet.",noPinnedChats:"No pinned chats yet.",noChats:"No chats yet.",loadingChats:"Loading chats...",pinChat:"Pin chat",unpinChat:"Unpin chat",renameChat:"Rename",deleteChat:"Delete",chatActions:"Chat actions",renamePrompt:"Enter a new chat name",citationsAttached:e=>`${e} citation${e>1?"s":""} attached`,sourcesUsed:"Sources Used",allSourcesUsed:"All Sources Used",documentsAndReferences:"AI documents and references",showAll:"Show All",noSources:"No sources were returned for this answer.",closeSourcesPanel:"Close sources panel",openSource:"Open source",sourceScore:"Score",sourcePage:"Page",sourceSheet:"Sheet",sourceRow:"Row",sourceKnowledge:"Knowledge Base",untitledSource:"Untitled Source",copy:"Copy",copied:"Copied",helpful:"Helpful",notHelpful:"Needs work",send:"Send message",assistantAvatar:"Assistant",userAvatar:"User"},ar:{openChatActions:"\u0641\u062A\u062D \u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",newChat:"\u0645\u062D\u0627\u062F\u062B\u0629 \u062C\u062F\u064A\u062F\u0629",myChats:"\u0645\u062D\u0627\u062F\u062B\u0627\u062A\u064A",openAssistant:"\u0641\u062A\u062D \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",back:"\u0631\u062C\u0648\u0639",close:"\u0625\u063A\u0644\u0627\u0642",assistantBadge:"\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",closeAssistantPage:"\u0625\u063A\u0644\u0627\u0642 \u0635\u0641\u062D\u0629 \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",searchChat:"\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A",recentActivity:"\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0623\u062E\u064A\u0631",pinnedCollections:"\u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0627\u0644\u0645\u062B\u0628\u062A\u0629",answersBasedOnPermissions:"\u064A\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0625\u062C\u0627\u0628\u0627\u062A \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643",authTokenForwarded:"\u064A\u062A\u0645 \u062A\u0645\u0631\u064A\u0631 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0645\u0636\u064A\u0641 \u0639\u0646\u062F \u0627\u0644\u0625\u0639\u062F\u0627\u062F.",thinking:"\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u0641\u0643\u064A\u0631...",unableToCreateChat:"\u062A\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",requestFailed:"\u0641\u0634\u0644 \u0627\u0644\u0637\u0644\u0628",noRecentChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u062D\u062F\u064A\u062B\u0629 \u0628\u0639\u062F.",noPinnedChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0645\u062B\u0628\u062A\u0629 \u0628\u0639\u062F.",noChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0628\u0639\u062F.",loadingChats:"\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A...",pinChat:"\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",unpinChat:"\u0625\u0644\u063A\u0627\u0621 \u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renameChat:"\u0625\u0639\u0627\u062F\u0629 \u062A\u0633\u0645\u064A\u0629",deleteChat:"\u062D\u0630\u0641",chatActions:"\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renamePrompt:"\u0623\u062F\u062E\u0644 \u0627\u0633\u0645\u064B\u0627 \u062C\u062F\u064A\u062F\u064B\u0627 \u0644\u0644\u0645\u062D\u0627\u062F\u062B\u0629",citationsAttached:e=>`\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 ${e} \u0645\u0631\u062C\u0639${e>1?"\u0627\u062A":""}`,sourcesUsed:"\u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",allSourcesUsed:"\u0643\u0644 \u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",documentsAndReferences:"\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0648\u0645\u0631\u0627\u062C\u0639 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",showAll:"\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",noSources:"\u0644\u0645 \u064A\u062A\u0645 \u0625\u0631\u062C\u0627\u0639 \u0645\u0635\u0627\u062F\u0631 \u0644\u0647\u0630\u0647 \u0627\u0644\u0625\u062C\u0627\u0628\u0629.",closeSourcesPanel:"\u0625\u063A\u0644\u0627\u0642 \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0635\u0627\u062F\u0631",openSource:"\u0641\u062A\u062D \u0627\u0644\u0645\u0635\u062F\u0631",sourceScore:"\u0627\u0644\u062F\u0631\u062C\u0629",sourcePage:"\u0627\u0644\u0635\u0641\u062D\u0629",sourceSheet:"\u0627\u0644\u0648\u0631\u0642\u0629",sourceRow:"\u0627\u0644\u0635\u0641",sourceKnowledge:"\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0645\u0639\u0631\u0641\u0629",untitledSource:"\u0645\u0635\u062F\u0631 \u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646",copy:"\u0646\u0633\u062E",copied:"\u062A\u0645 \u0627\u0644\u0646\u0633\u062E",helpful:"\u0645\u0641\u064A\u062F",notHelpful:"\u064A\u062D\u062A\u0627\u062C \u062A\u062D\u0633\u064A\u0646",send:"\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629",assistantAvatar:"\u0627\u0644\u0645\u0633\u0627\u0639\u062F",userAvatar:"\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645"}};function Se(e){if(typeof document>"u")throw new Error("Chat widget can only be initialized in a browser.");let t=Rt(e),a=qe(t.locale),n=zn(t.locale),r=Un(a),p=t.displayMode==="embedded",i={chatId:Pe(t),open:!1,fullPageOpen:p,myChatsOpen:!1,accessTokenProvider:t.getAccessToken,historyLoadedChatId:null,menuOpen:!1,chats:[],chatSearchTerm:"",loadingChats:!1,sourcePanelOpen:!1,sourcePanelTitle:null},d=document.createElement("div");d.dataset.chatWidgetHost="true",t.mount.appendChild(d);let g=d.attachShadow({mode:"open"});Ut(g,t.theme);let c=o("div",`kp-chat-widget ${t.position}`);c.lang=a,c.dir=r?"rtl":"ltr",p&&(c.classList.add("kp-chat-widget-embedded"),Nt(!0)),r&&c.classList.add("kp-rtl");let m=o("div","kp-overlay"),u=o("button","kp-launcher");u.type="button",u.setAttribute("aria-label",t.launcherAriaLabel),u.innerHTML=['<span class="kp-star-cluster" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let f=o("section","kp-panel");f.setAttribute("role","dialog"),f.setAttribute("aria-modal","true"),f.setAttribute("aria-label",t.title);let k=o("div","kp-header"),C=o("div","kp-toolbar"),y=o("button","kp-tool-button kp-menu-trigger");y.type="button",y.setAttribute("aria-label",n.openChatActions),y.innerHTML=['<span class="kp-pencil-icon" aria-hidden="true"></span>','<span class="kp-chevron" aria-hidden="true">\u2304</span>'].join("");let v=o("div","kp-dropdown"),A=o("button","kp-dropdown-item",n.newChat);A.type="button";let T=o("button","kp-dropdown-item",n.myChats);T.type="button";let E=o("button","kp-dropdown-item",n.openAssistant);E.type="button",v.append(A,T,E),C.append(y,v);let J=o("div","kp-title-wrap"),D=o("h2","kp-title",t.title),_t=o("div","kp-subtitle",t.subtitle);J.append(D,_t);let he=o("button","kp-close","\xD7");he.type="button",he.setAttribute("aria-label",t.closeAriaLabel),k.append(C,J,he);let me=o("div","kp-body"),Te=o("div","kp-hero"),Ft=o("div","kp-hero-icon","\u2726"),qt=o("div","kp-hero-text",t.welcomeMessage);Te.append(Ft,qt);let Ke=o("div","kp-footer"),Ee=o("form","kp-form"),$=o("input","kp-input");$.type="text",$.autocomplete="off",$.placeholder=t.inputPlaceholder,$.setAttribute("aria-label",t.inputPlaceholder);let Ie=o("button","kp-send","\u279C");Ie.type="submit",Ie.setAttribute("aria-label",n.send);let Vt=o("div","kp-note",n.authTokenForwarded);Ee.append($,Ie),Ke.append(Ee,Vt),f.append(k,me,Ke),p||c.append(m,u,f),g.appendChild(c),me.appendChild(Te);let Ye=o("div","kp-suggestions");me.appendChild(Ye);let be=o("section","kp-my-chats-sheet"),Xe=o("div","kp-my-chats-header"),ke=o("button","kp-my-chats-nav","\u2190");ke.type="button",ke.setAttribute("aria-label",n.back);let xe=o("button","kp-my-chats-nav kp-my-chats-close","\xD7");xe.type="button",xe.setAttribute("aria-label",n.close),Xe.append(ke,xe);let Je=o("div","kp-my-chats-body"),Kt=o("div","kp-my-chats-section-label",n.recentActivity),Ge=o("div","kp-my-chats-list"),Yt=o("div","kp-my-chats-section-label",n.pinnedCollections),Qe=o("div","kp-my-chats-list");Je.append(Kt,Ge,Yt,Qe),be.append(Xe,Je),f.appendChild(be);let z={body:me,input:$,suggestions:Ye,hero:Te,kind:"panel"},I=o("section","kp-full-page");p&&I.classList.add("kp-full-page-embedded","open"),I.setAttribute("role","dialog"),p||I.setAttribute("aria-modal","true"),I.setAttribute("aria-label",`${t.title} page`);let Re=o("div","kp-full-page-shell"),ye=o("div","kp-full-page-header"),Ze=o("div","kp-full-page-brand"),Xt=o("div","kp-full-page-brand-mark","\u2726"),Jt=o("div","kp-full-page-brand-text",t.title),se=o("button","kp-full-page-menu-btn");se.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',se.type="button",se.setAttribute("aria-label","Toggle sidebar"),se.addEventListener("click",()=>{ie.classList.toggle("open")}),Ze.append(se,Xt,Jt);let et=o("div","kp-full-page-header-actions"),Gt=o("div","kp-full-page-badge",n.assistantBadge),ve=o("button","kp-full-page-close","\xD7");if(ve.type="button",ve.setAttribute("aria-label",n.closeAssistantPage),et.append(Gt,ve),ye.append(Ze,et),!t.embedded.showHeader){ye.classList.add("kp-hidden");let s=o("div","kp-floating-menu-wrap"),l=o("button","kp-floating-menu-btn");l.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',l.type="button",l.setAttribute("aria-label","Toggle sidebar"),l.addEventListener("click",()=>{ie.classList.toggle("open")}),s.append(l),Re.insertBefore(s,ye.nextSibling)}let tt=o("div","kp-full-page-content"),ie=o("aside","kp-full-page-sidebar"),ze=o("button","kp-full-page-new-chat",`+ ${n.newChat}`);ze.type="button";let nt=o("div","kp-full-page-search"),re=o("input","kp-full-page-search-input");re.type="search",re.placeholder=n.searchChat;let Qt=o("span","kp-full-page-search-icon","\u2315");nt.append(re,Qt);let Zt=o("div","kp-full-page-section-label",n.recentActivity),at=o("div","kp-full-page-recent-list"),en=o("div","kp-full-page-section-label",n.pinnedCollections),ot=o("div","kp-full-page-pinned-list");ie.append(ze,nt,Zt,at,en,ot);let st=o("main","kp-full-page-main"),it=o("section","kp-full-page-panel"),Ue=o("div","kp-full-page-body"),$e=o("div","kp-full-page-hero"),rt=o("div","kp-full-page-hero-badge");rt.innerHTML=['<span class="kp-star-cluster kp-star-cluster-static" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let tn=o("div","kp-full-page-hero-text",t.welcomeMessage);$e.append(rt,tn);let lt=o("div","kp-suggestions kp-full-page-suggestions");Ue.append($e,lt);let pt=o("div","kp-full-page-footer"),He=o("form","kp-form kp-full-page-form"),R=o("input","kp-input kp-full-page-input");R.type="text",R.autocomplete="off",R.placeholder=t.inputPlaceholder,R.setAttribute("aria-label",t.inputPlaceholder);let Me=o("button","kp-send kp-full-page-send","\u279C");Me.type="submit",Me.setAttribute("aria-label",n.send);let nn=o("div","kp-note kp-full-page-note",n.answersBasedOnPermissions);He.append(R,Me),pt.append(He,nn),it.append(Ue,pt),st.appendChild(it);let we=o("aside","kp-source-panel"),dt=o("div","kp-source-panel-header"),ct=o("div","kp-source-panel-title-wrap"),ut=o("div","kp-source-panel-title",n.allSourcesUsed),an=o("div","kp-source-panel-subtitle",n.documentsAndReferences);ct.append(ut,an);let Ce=o("button","kp-source-panel-close","\xD7");Ce.type="button",Ce.setAttribute("aria-label",n.closeSourcesPanel),dt.append(ct,Ce);let le=o("div","kp-source-panel-list"),on=o("div","kp-source-panel-empty",n.noSources);le.appendChild(on),we.append(dt,le),tt.append(ie,st,we),Re.append(ye,tt),I.appendChild(Re),c.appendChild(I);let pe=o("div","kp-citation-overlay");c.appendChild(pe);let S={body:Ue,input:R,suggestions:lt,hero:$e,kind:"full-page"},j=()=>({...t,getAccessToken:i.accessTokenProvider}),gt=async()=>{let s=null,l=null;if(t.userInfo)try{let h=await t.userInfo();h&&(s=[h.firstName,h.lastName].filter(Boolean).join(" ")||null,l=h.avatar??null)}catch{}if((!s||!l)&&t.getUserContext)try{let h=await t.getUserContext();h&&(s||(s=[h.firstName,h.lastName].filter(Boolean).join(" ")||h.displayName?.trim()||h.email?.trim()||h.userId?.trim()||null),l||(l=h.avatarUrl??null))}catch{}return{displayName:s,avatarUrl:l}},G=s=>{let l=Ve(s)??n.untitledSource,h=(s.text||"").trim(),w=h,L=h.split(`
// `);if(L.length>1&&L[0]){let B=L[0].trim().replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();B&&(B===l||l.indexOf(B)!==-1||B.indexOf(l)!==-1)&&(w=L.slice(1).join(`
// `).trim())}let b=_n(s.sourceDocument),x=[];(s.pageNumber||s.pageNumber===0)&&x.push(`
//         <div class="meta-item">
//           <span class="meta-label">Page Number</span>
//           <span class="meta-value">${s.pageNumber}</span>
//         </div>
//       `),typeof s.score=="number"&&x.push(`
//         <div class="meta-item">
//           <span class="meta-label">Relevance Score</span>
//           <span class="meta-value">${s.score.toFixed(2)}</span>
//         </div>
//       `),s.sheetName&&x.push(`
//         <div class="meta-item">
//           <span class="meta-label">Sheet Name</span>
//           <span class="meta-value">${O(s.sheetName)}</span>
//         </div>
//       `),(s.rowNumber||s.rowNumber===0)&&x.push(`
//         <div class="meta-item">
//           <span class="meta-label">Row Number</span>
//           <span class="meta-value">${s.rowNumber}</span>
//         </div>
//       `),s.knowledgeName&&x.push(`
//         <div class="meta-item">
//           <span class="meta-label">Database Source</span>
//           <span class="meta-value">${O(s.knowledgeName)}</span>
//         </div>
//       `),x.push(`
//       <div class="meta-item">
//         <span class="meta-label">Classification</span>
//         <span class="meta-value">Uploaded Knowledge</span>
//       </div>
//       <div class="meta-item">
//         <span class="meta-label">Confidentiality</span>
//         <span class="meta-value" style="color: #0f766e;">Public</span>
//       </div>
//       <div class="meta-item">
//         <span class="meta-label">Language</span>
//         <span class="meta-value">English</span>
//       </div>
//     `);let ee=x.join(""),te=w?O(w):"No text snippet available for this citation.",hn=`
//       <div class="doc-badge-wrapper">
//         <div class="doc-icon">\u{1F4C4}</div>
//         <div class="doc-badge-info">
//           <h2>Document Citation</h2>
//         </div>
//       </div>
      
//       <div class="doc-title-section">
//         <h1>${O(l)}</h1>
//         <div class="doc-source-type">Uploaded Knowledge Resource</div>
//       </div>
      
//       <div class="section-divider"></div>
      
//       <div>
//         <h3 class="meta-section-title">Retrieved Passage Snippet</h3>
//         <div class="summary-box">${te}</div>
//       </div>
      
//       <div class="section-divider"></div>
      
//       <div>
//         <h3 class="meta-section-title">Metadata & Classification</h3>
//         <div class="meta-list">
//           ${ee}
//         </div>
//       </div>
//     `,Oe="";b?Oe=`<iframe src="${b}" title="Document Viewer"></iframe>`:Oe=`
//         <div class="viewer-toolbar">
//           <div class="toolbar-left">${O(l)}</div>
//           <div class="toolbar-center">
//             <button class="toolbar-btn zoom-out-btn">\u2212</button>
//             <span class="page-indicator">Page ${s.pageNumber||1}</span>
//             <button class="toolbar-btn zoom-in-btn">+</button>
//           </div>
//           <div class="toolbar-right">
//             <button class="toolbar-btn print-btn">\u{1F5A8}\uFE0F Print</button>
//           </div>
//         </div>
//         <div class="viewer-body">
//           <div class="document-sheet">
//             <div class="sheet-header">
//               <span>${O(l)}</span>
//               <span>Page ${s.pageNumber||1}</span>
//             </div>
//             <div class="sheet-content">${O(h||"No document content retrieved.")}</div>
//             <div class="sheet-footer">
//               <span>Confidentiality: Public</span>
//               <span>Knowledge Platform CB</span>
//             </div>
//           </div>
//         </div>
//       `,pe.textContent="";let yt=o("header","kp-citation-overlay-header"),vt=o("div","kp-citation-overlay-brand");vt.innerHTML=`
//       <span class="kp-citation-overlay-brand-logo">\u2726</span>
//       <span>Knowledge Assistant Document Viewer</span>
//     `;let Ae=o("button","kp-citation-overlay-close","\xD7");Ae.type="button",Ae.setAttribute("aria-label","Close document preview"),Ae.addEventListener("click",()=>{pe.classList.remove("open")}),yt.append(vt,Ae);let wt=o("div","kp-citation-overlay-content"),Ct=o("aside","kp-citation-overlay-metadata-panel");Ct.innerHTML=hn;let ne=o("main","kp-citation-overlay-viewer-panel");if(ne.innerHTML=Oe,wt.append(Ct,ne),pe.append(yt,wt),!b){let F=1,B=ne.querySelector(".document-sheet"),mn=ne.querySelector(".zoom-in-btn"),bn=ne.querySelector(".zoom-out-btn"),kn=ne.querySelector(".print-btn");B&&(mn?.addEventListener("click",()=>{F<1.5&&(F+=.1,B.style.transform=`scale(${F})`)}),bn?.addEventListener("click",()=>{F>.6&&(F-=.1,B.style.transform=`scale(${F})`)}),kn?.addEventListener("click",()=>{window.print()}))}pe.classList.add("open")},de=(s,l)=>{if(i.sourcePanelOpen=!0,i.sourcePanelTitle=l??n.allSourcesUsed,ut.textContent=i.sourcePanelTitle,we.classList.add("open"),le.textContent="",s.length===0){le.appendChild(o("div","kp-source-panel-empty",n.noSources));return}for(let h of s)le.appendChild(Wn(h,n,()=>{G(h)}))},Q=()=>{i.sourcePanelOpen=!1,i.sourcePanelTitle=null,we.classList.remove("open")};ae(z,t.initialSuggestions,async s=>{await H(s,z)}),ae(S,t.initialSuggestions,async s=>{await H(s,S)}),_(),Le(),p&&(U(),t.rag.loadHistoryOnOpen&&Z(S,i.chatId));function Ne(){if(p){i.fullPageOpen=!0,I.classList.add("open");return}i.open||(i.open=!0,i.fullPageOpen=!1,N(),I.classList.remove("open"),u.classList.add("hidden"),m.classList.add("visible"),f.classList.add("open"),t.onOpen?.(),t.rag.loadHistoryOnOpen&&Be.loadHistory(),queueMicrotask(()=>$.focus()))}function W(){if(p){Q();return}i.open&&(M(),N(),i.open=!1,u.classList.remove("hidden"),m.classList.remove("visible"),f.classList.remove("open"),t.onClose?.())}async function H(s,l){let h=s.trim();if(!h)return;l.input.value="";try{await dn(h)}catch(b){let x=X(t,b);fe(l.body,"bot",`${n.unableToCreateChat}: ${x.message}`,{strings:n,view:l,userName:null,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:()=>{},onDislike:()=>{}});return}Fe(l);let w=await gt();fe(l.body,"user",h,{strings:n,view:l,userName:w.displayName,userAvatarUrl:w.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:()=>{},onDislike:()=>{}}),l.body.scrollTop=l.body.scrollHeight;let L=o("div","kp-loading",n.thinking);l.body.appendChild(L),l.body.scrollTop=l.body.scrollHeight;try{let b=await Pn(t),x=await Pt(j(),{message:h,chatId:i.chatId,knowledgeNames:b,...t.rag.enableReferences!==void 0?{enableReferences:t.rag.enableReferences}:{}});L.isConnected&&L.remove(),fe(l.body,"bot",x.answer,{strings:n,view:l,userName:w.displayName,userAvatarUrl:w.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,citations:x.citations??[],onShowSources:de,onShowCitation:G,onLike:()=>{ue(t,i.chatId,x.answer,!0).catch(console.error)},onDislike:()=>{ue(t,i.chatId,x.answer,!1).catch(console.error)}}),i.historyLoadedChatId=null,await U(),x.suggestions?.length&&ae(l,x.suggestions,async ee=>{await H(ee,l)})}catch(b){let x=X(t,b);L.isConnected&&L.remove(),fe(l.body,"bot",`${n.requestFailed}: ${x.message}`,{strings:n,view:l,userName:w.displayName,userAvatarUrl:w.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:()=>{},onDislike:()=>{}})}}async function ft(s){let l=i.fullPageOpen?S:z;await H(s,l)}async function sn(){if(p){i.fullPageOpen=!0,I.classList.add("open"),await U(),await Z(S,i.chatId),queueMicrotask(()=>R.focus());return}i.fullPageOpen=!0,i.open=!1,M(),N(),f.classList.remove("open"),m.classList.remove("visible"),u.classList.add("hidden"),I.classList.add("open"),await U(),await Z(S,i.chatId),queueMicrotask(()=>R.focus())}function ht(){if(p){Q();return}i.fullPageOpen&&(i.fullPageOpen=!1,I.classList.remove("open"),u.classList.remove("hidden"),Q())}function rn(){i.menuOpen=!0,y.classList.add("open"),v.classList.add("open")}function M(){i.menuOpen=!1,y.classList.remove("open"),v.classList.remove("open")}function ln(){i.chatId=Pe(t),i.historyLoadedChatId=null,N(),ge(z),ae(z,t.initialSuggestions,async s=>{await H(s,z)}),M()}async function pn(){i.chatId=Pe(t),i.historyLoadedChatId=null,ge(S),Q(),ae(S,t.initialSuggestions,async s=>{await H(s,S)}),_()}async function U(){if(!t.endpoints.listChats)return _(),Le(),[];i.loadingChats=!0,_(),Le();try{let s=await Tt(j());return i.chats=s,s}catch(s){return X(t,s),i.chats}finally{i.loadingChats=!1,_(),Le()}}async function dn(s){!t.endpoints.listChats&&!t.endpoints.createChat||i.chats.some(l=>l.chatId===i.chatId)||await Et(j(),i.chatId,s?Rn(s,n.newChat):void 0)}async function cn(s){i.chatId=s,i.historyLoadedChatId=null,await Z(S,s),_()}async function un(s){i.chatId=s,i.historyLoadedChatId=null,N(),await Z(z,s)}async function gn(){M(),await U(),i.myChatsOpen=!0,f.classList.add("kp-sheet-open"),be.classList.add("open")}function N(){i.myChatsOpen=!1,f.classList.remove("kp-sheet-open"),be.classList.remove("open")}function fn(s,l){let h=o("div","kp-overlay visible"),w=o("div","kp-rename-dialog");w.style.cssText="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:320px; background:var(--kp-panel-background); box-shadow:var(--kp-shadow); padding:24px; border-radius:16px; opacity:1; pointer-events:auto; z-index: 10000; display:flex; flex-direction:column; height:min-content; box-sizing:border-box;";let L=o("h3","kp-source-preview-title");L.textContent=n.renamePrompt,L.style.marginBottom="16px",L.style.fontSize="16px";let b=o("input","kp-input");b.type="text",b.value=s.title,b.style.border="1px solid var(--kp-border-color)",b.style.padding="10px",b.style.borderRadius="8px",b.style.width="100%",b.style.marginBottom="20px",b.style.flex="none",b.style.height="40px";let x=o("div","kp-message-actions");x.style.justifyContent="flex-end",x.style.gap="8px";let ee=o("button","kp-message-action",n.close);ee.addEventListener("click",()=>h.remove());let te=o("button","kp-message-action active","Save");te.addEventListener("click",async()=>{te.disabled=!0,te.textContent="...",await l(b.value),h.remove()}),x.append(ee,te),w.append(L,b,x),h.appendChild(w),c.appendChild(h),b.focus()}async function mt(s){t.endpoints.updateChat&&fn(s,async l=>{let h=l.trim();if(!(!h||h===s.title))try{await We(j(),s.chatId,{title:h}),await U()}catch(w){X(t,w)}})}async function bt(s){if(t.endpoints.deleteChat)try{await It(j(),s.chatId),i.chatId===s.chatId&&(i.chatId=Pe(t),i.historyLoadedChatId=null,ge(z),ge(S)),await U()}catch(l){X(t,l)}}function _(){Ht(at,ot,i,n,async s=>{await cn(s.chatId),ie.classList.remove("open")},async s=>{await kt(s)},async s=>{await mt(s)},async s=>{await bt(s)})}function Le(){Ht(Ge,Qe,i,n,async s=>{await un(s.chatId)},async s=>{await kt(s)},async s=>{await mt(s)},async s=>{await bt(s)})}async function kt(s){if(t.endpoints.updateChat)try{await We(j(),s.chatId,{pinned:!s.pinned}),await U()}catch(l){X(t,l)}}async function Z(s,l){ge(s),ae(s,t.initialSuggestions,async L=>{await H(L,s)});let h=o("div","kp-message kp-message-ai");h.innerHTML='<div class="kp-message-bubble"><div class="kp-typing-indicator"><span></span><span></span><span></span></div></div>',Fe(s),s.body.appendChild(h);let w=await St(j(),l);if(h.remove(),w.length>0){Fe(s),Bt(s.body,s.hero,s.suggestions);let L=await gt();In(s.body,w,{strings:n,view:s,userName:L.displayName,userAvatarUrl:L.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:b=>{ue(t,l,b,!0).catch(console.error)},onDislike:b=>{ue(t,l,b,!1).catch(console.error)}})}return i.historyLoadedChatId=l,w}let Be={open:Ne,close:W,toggle(){if(p){Ne();return}if(i.open){W();return}Ne()},destroy(){if(document.removeEventListener("keydown",xt),d.remove(),p){let s=!1;document.querySelectorAll("[data-chat-widget-host]").forEach(l=>{let h=l.shadowRoot;h&&h.querySelector(".kp-chat-widget-embedded")&&(s=!0)}),s||Nt(!1)}},sendMessage:ft,setAccessTokenProvider(s){i.accessTokenProvider=s},getChatId(){return i.chatId},loadChats(){return U()},async loadHistory(){let s=i.fullPageOpen?S:z;return Z(s,i.chatId)}};u.addEventListener("click",()=>Be.toggle()),he.addEventListener("click",W),m.addEventListener("click",W),Ce.addEventListener("click",Q),ke.addEventListener("click",N),xe.addEventListener("click",N),y.addEventListener("click",s=>{if(s.stopPropagation(),!i.menuOpen){rn();return}M()}),A.addEventListener("click",ln),T.addEventListener("click",async()=>{await gn()}),E.addEventListener("click",()=>{if(M(),t.onOpenAssistantPage){W(),t.onOpenAssistantPage();return}if(t.assistantPageUrl){W(),window.location.href=t.assistantPageUrl;return}sn()}),ve.addEventListener("click",ht),ze.addEventListener("click",()=>{pn(),queueMicrotask(()=>R.focus())}),re.addEventListener("input",()=>{i.chatSearchTerm=re.value.trim().toLowerCase(),_()}),f.addEventListener("click",s=>{let l=s.target;if(!(l instanceof Element)||!l.closest(".kp-chat-actions")){for(let h of Array.from(g.querySelectorAll(".kp-chat-actions.open")))h.classList.remove("open");for(let h of Array.from(g.querySelectorAll(".kp-full-page-chat-item.menu-open")))h.classList.remove("menu-open")}i.menuOpen&&!v.contains(l)&&!y.contains(l)&&M(),s.stopPropagation()}),g.addEventListener("click",s=>{let l=s.target;if(i.menuOpen&&l instanceof Node&&!v.contains(l)&&!y.contains(l)&&M(),l instanceof Element&&!l.closest(".kp-chat-actions")){for(let h of Array.from(g.querySelectorAll(".kp-chat-actions.open")))h.classList.remove("open");for(let h of Array.from(g.querySelectorAll(".kp-full-page-chat-item.menu-open")))h.classList.remove("menu-open")}}),Ee.addEventListener("submit",async s=>{s.preventDefault(),await ft($.value)}),He.addEventListener("submit",async s=>{s.preventDefault(),await H(R.value,S)});function xt(s){if(s.key==="Escape"){if(i.sourcePanelOpen){Q();return}if(i.myChatsOpen){N();return}if(i.fullPageOpen){if(p)return;ht();return}i.open&&W()}}return document.addEventListener("keydown",xt),Be}async function Pn(e){if(e.rag.getKnowledgeNames){let t=await e.rag.getKnowledgeNames();return Array.isArray(t)?t.filter(Boolean):[]}return(e.rag.knowledgeNames??[]).filter(Boolean)}function Pe(e){return e.rag.chatId?.trim()?e.rag.chatId:e.rag.chatIdFactory?e.rag.chatIdFactory():typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`kp-chat-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function fe(e,t,a,n){let r=t==="bot"?Hn(a,n.citations??[]):{displayText:a,citations:n.citations??[]},p=o("div",`kp-message-row ${t}`),i=Tn(t==="bot"?n.strings.assistantAvatar:n.userName??n.strings.userAvatar,t,t==="bot"?n.assistantAvatarUrl:n.userAvatarUrl),d=o("div",`kp-bubble ${t}`),g=o("div","kp-bubble-content");Fn(g,r.displayText),d.appendChild(g);let c=r.citations;if(c.length){let m=o("div","kp-meta",n.strings.citationsAttached(c.length));d.appendChild(m);let u=o("div","kp-source-preview"),f=o("div","kp-source-preview-title",n.strings.sourcesUsed),k=o("div","kp-source-preview-list");for(let y of c.slice(0,2)){let v=Dn(y,n.strings);v.addEventListener("click",async()=>{n.onShowCitation(y)}),k.appendChild(v)}let C=jn(n.strings);C.addEventListener("click",async()=>{n.onShowSources(c,n.strings.allSourcesUsed)}),k.appendChild(C),u.append(f,k),d.appendChild(u)}return t==="bot"&&d.appendChild(Sn(r.displayText,n.strings,n.onLike,n.onDislike,n.initialFeedback)),t==="user"?p.append(d,i):p.append(i,d),e.appendChild(p),e.scrollTop=e.scrollHeight,p}function Sn(e,t,a,n,r){let p=o("div","kp-message-actions"),i='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',d='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',g='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',c='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>',m=o("button","kp-message-action");m.innerHTML=i,m.type="button",m.setAttribute("title",t.copy),m.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),m.innerHTML=d,window.setTimeout(()=>{m.innerHTML=i},1200)}catch{m.innerHTML=i}});let u=o("button","kp-message-action");u.innerHTML=g,u.type="button",u.setAttribute("aria-label",t.helpful),r===!0&&u.classList.add("active"),u.addEventListener("click",()=>{u.classList.toggle("active"),f.classList.remove("active"),u.classList.contains("active")&&a&&a()});let f=o("button","kp-message-action");return f.innerHTML=c,f.type="button",f.setAttribute("aria-label",t.notHelpful),r===!1&&f.classList.add("active"),f.addEventListener("click",()=>{f.classList.toggle("active"),u.classList.remove("active"),f.classList.contains("active")&&n&&n()}),p.append(m,u,f),p}function Tn(e,t,a){let n=o("div",`kp-avatar ${t}`);if(a){let r=o("img","kp-avatar-img");r.src=a,r.alt=e,r.style.width="100%",r.style.height="100%",r.style.objectFit="cover",r.style.borderRadius="50%",n.appendChild(r)}else{let r=t==="bot"?"\u2726":$n(e);n.textContent=r}return n.setAttribute("aria-hidden","true"),n}function En(e,t,a){e.textContent="";for(let n of t){let r=o("button","kp-suggestion",n);r.type="button",r.addEventListener("click",async()=>{await a(n)}),e.appendChild(r)}}function ae(e,t,a){En(e.suggestions,t,async n=>{e.input.value=n,await a(n)})}function Bt(e,t,a){let n=new Set([t,a]);for(let r of Array.from(e.children))n.has(r)||r.remove()}function Fe(e){e.body.classList.add("kp-conversation-active"),e.hero.remove(),e.suggestions.remove()}function ge(e){e.body.classList.remove("kp-conversation-active"),e.hero.isConnected||e.body.prepend(e.hero),e.suggestions.isConnected||e.body.appendChild(e.suggestions),Bt(e.body,e.hero,e.suggestions),e.input.value=""}function In(e,t,a){for(let n of t)fe(e,n.role==="assistant"?"bot":"user",n.text,{...a,...n.citations!==void 0?{citations:n.citations}:{},...n.isLike!==void 0?{initialFeedback:n.isLike}:{},onLike:()=>{a.onLike&&a.onLike(n.text)},onDislike:()=>{a.onDislike&&a.onDislike(n.text)}})}function Ht(e,t,a,n,r,p,i,d){if(e.textContent="",t.textContent="",a.loadingChats){e.appendChild(o("div","kp-full-page-empty",n.loadingChats));return}let g=a.chats.filter(c=>a.chatSearchTerm?c.title.toLowerCase().includes(a.chatSearchTerm):!0);if(g.length>0){let c=g.filter(u=>u.pinned),m=g.filter(u=>!u.pinned).slice(0,8);Mt(e,m,a.chatId,n,r,p,i,d),Mt(t,c,a.chatId,n,r,p,i,d),m.length===0&&e.appendChild(o("div","kp-full-page-empty",n.noRecentChats)),c.length===0&&t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats));return}e.appendChild(o("div","kp-full-page-empty",n.noChats)),t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats))}function Mt(e,t,a,n,r,p,i,d){for(let g of t){let c=o("div",`kp-full-page-item kp-full-page-chat-item${g.chatId===a?" active":""}`),m=o("span","kp-full-page-item-title",g.title),u=o("div","kp-chat-actions"),f=o("button","kp-chat-actions-trigger","\u22EF");f.type="button",f.setAttribute("aria-label",n.chatActions);let k=o("div","kp-chat-actions-menu"),C=o("button","kp-chat-actions-item",g.pinned?n.unpinChat:n.pinChat);C.type="button",C.addEventListener("click",async A=>{A.stopPropagation(),await p(g)});let y=o("button","kp-chat-actions-item",n.renameChat);y.type="button",y.addEventListener("click",async A=>{A.stopPropagation(),await i(g)});let v=o("button","kp-chat-actions-item",n.deleteChat);v.type="button",v.addEventListener("click",async A=>{A.stopPropagation(),await d(g)}),k.append(C,y,v),u.append(f,k),f.addEventListener("click",A=>{A.stopPropagation();let T=u.classList.contains("open");for(let E of Array.from(e.querySelectorAll(".kp-chat-actions.open")))E.classList.remove("open");for(let E of Array.from(e.querySelectorAll(".kp-full-page-chat-item.menu-open")))E.classList.remove("menu-open");T||(u.classList.add("open"),c.classList.add("menu-open"))}),c.append(m,u),c.setAttribute("role","button"),c.tabIndex=0,c.addEventListener("click",async()=>{await r(g)}),c.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await r(g))}),c.addEventListener("blur",()=>{u.classList.remove("open"),c.classList.remove("menu-open")}),e.appendChild(c)}}function Rn(e,t){return e.trim().slice(0,60)||t}function qe(e){return e.toLowerCase().split("-")[0]||"en"}function zn(e){let t=$t.en;return $t[qe(e)]??t}function Un(e){return["ar","fa","he","ur"].includes(qe(e))}function $n(e){let t=e.split(/\s+/).filter(Boolean).slice(0,2);return t.length===0?"U":t.map(a=>a[0]?.toUpperCase()??"").join("")}function Ve(e){if(e.knowledgeName?.trim())return e.knowledgeName.trim();if(e.text){let t=e.text.split(`
// `)[0]?.trim();if(t){let a=t.replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();if(a)return a}}if(e.sourceDocument&&/^https?:\/\//i.test(e.sourceDocument)){try{let t=new URL(e.sourceDocument),a=decodeURIComponent(t.pathname),n=a.substring(a.lastIndexOf("/")+1);if(n)return n}catch{}return e.sourceDocument}return e.sourceDocument?.trim()&&!/^c\d+$/i.test(e.sourceDocument)?e.sourceDocument.trim():null}function Hn(e,t){let a=Mn(e);return{displayText:a.displayText,citations:t.length>0?On(t,a.citations):a.citations}}function Mn(e){let a=Ot(e).split(`
// `),n=-1;for(let g=0;g<a.length;g+=1)/^#{0,6}\s*References\s*$/i.test(a[g]?.trim()??"")&&(n=g);if(n===-1)return{displayText:e,citations:[]};let r=a.slice(0,n).join(`
// `).trimEnd(),p=a.slice(n+1).join(`
// `).trim(),d=Nn(p).map(g=>Bn(g)).filter(g=>!!g);return{displayText:r,citations:d}}function Nn(e){let t=[],a="";for(let n of e.split(`
// `)){let r=n.trim();if(r){if(/^\d+\.\s+/.test(r)){a&&t.push(a.trim()),a=r.replace(/^\d+\.\s+/,"");continue}a&&(a=`${a} ${r}`)}}return a&&t.push(a.trim()),t}function Bn(e){let t=e.match(/https?:\/\/\S+/i);if(!t)return null;let a=t[0],n=e.slice(0,t.index).replace(/[.\s]+$/,"").trim();return{sourceDocument:a,knowledgeName:n||a}}function On(e,t){let a=[],n=new Set;for(let r of[...e,...t]){let p=`${r.knowledgeName??""}::${r.sourceDocument??""}`;n.has(p)||(n.add(p),a.push(r))}return a}function Dn(e,t){let a=o("button","kp-source-chip");a.type="button",a.setAttribute("aria-label",t.openSource);let n=o("span","kp-source-thumb");n.textContent="\u2726";let r=o("span","kp-source-chip-label",Ve(e)??t.untitledSource);return a.append(n,r),a}function jn(e){let t=o("button","kp-source-chip kp-source-chip-more");t.type="button";let a=o("span","kp-source-thumb-stack");for(let r=0;r<3;r+=1){let p=o("span","kp-source-thumb stacked");p.textContent="\u2726",a.appendChild(p)}let n=o("span","kp-source-chip-label",e.showAll);return t.append(a,n),t}function Wn(e,t,a){let n=o("button","kp-source-card");n.type="button",n.setAttribute("aria-label",t.openSource),n.addEventListener("click",a);let r=o("div","kp-source-card-media"),p=o("span","kp-source-thumb kp-source-thumb-large");p.textContent="\u2726";let i=o("div","kp-source-card-title",Ve(e)??t.untitledSource),d=o("div","kp-source-card-meta"),g=[];return typeof e.score=="number"&&g.push(`${t.sourceScore}: ${e.score.toFixed(2)}`),typeof e.pageNumber=="number"&&g.push(`${t.sourcePage}: ${e.pageNumber}`),e.sheetName&&g.push(`${t.sourceSheet}: ${e.sheetName}`),typeof e.rowNumber=="number"&&g.push(`${t.sourceRow}: ${e.rowNumber}`),e.knowledgeName&&g.push(`${t.sourceKnowledge}: ${e.knowledgeName}`),d.textContent=g.join(" \u2022 "),r.appendChild(p),n.append(r,i,d),n}function _n(e){if(!e)return null;let t=e.trim();return/^https?:\/\//i.test(t)?t:null}function Fn(e,t){e.innerHTML=qn(Ot(t))}function Ot(e){return e.replace(/\r\n/g,`
// `)}function qn(e){return e.split(/\n{2,}/).map(a=>a.trim()).filter(Boolean).map(Vn).join("")}function Vn(e){let t=e.split(`
// `).map(n=>n.trimEnd());if(t.every(n=>/^\s*\|.*\|\s*$/.test(n))&&t.length>=2)return Kn(t);if(t.every(n=>/^\d+\.\s+/.test(n)))return`<ol>${t.map(n=>`<li>${oe(n.replace(/^\d+\.\s+/,""))}</li>`).join("")}</ol>`;if(t.every(n=>/^[-*]\s+/.test(n)))return`<ul>${t.map(n=>`<li>${oe(n.replace(/^[-*]\s+/,""))}</li>`).join("")}</ul>`;let a=t[0]?.match(/^(#{1,6})\s+(.*)$/);if(a){let n=a[1]??"#",r=a[2]??"",p=n.length;return`<h${p}>${oe(r)}</h${p}>`}return`<p>${t.map(n=>oe(n)).join("<br>")}</p>`}function Kn(e){let t=e.filter((i,d)=>!(d===1&&/^\s*\|?(\s*:?-{3,}:?\s*\|)+\s*$/.test(i))).map(i=>Yn(i));if(t.length===0)return"";let a=t[0]??[],n=t.slice(1),r=`<thead><tr>${a.map(i=>`<th>${oe(i)}</th>`).join("")}</tr></thead>`,p=n.length?`<tbody>${n.map(i=>`<tr>${i.map(d=>`<td>${oe(d)}</td>`).join("")}</tr>`).join("")}</tbody>`:"";return`<div class="kp-table-wrap"><table>${r}${p}</table></div>`}function Yn(e){return e.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(t=>t.trim())}function oe(e){let t=O(e);return t=t.replace(/&lt;br\s*\/?&gt;/gi,"<br>"),t=t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>'),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*([^*]+)\*/g,"<em>$1</em>"),t}function O(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Nt(e){typeof document>"u"||document.querySelectorAll("[data-chat-widget-host]").forEach(t=>{let a=t.shadowRoot;if(a){let n=a.querySelector(".kp-chat-widget");n&&!n.classList.contains("kp-chat-widget-embedded")&&(t.style.display=e?"none":"")}})}var Dt="0.1.0",jt=Se,Wt={init:jt,createChatWidget:Se,version:Dt};typeof window<"u"&&(window.ChatWidget=Wt);return Ln(Xn);})();
// //# sourceMappingURL=browser.iife.js.map

// "use strict";var ChatWidget=(()=>{var De=Object.defineProperty;var xn=Object.getOwnPropertyDescriptor;var yn=Object.getOwnPropertyNames;var vn=Object.prototype.hasOwnProperty;var wn=(e,t)=>{for(var a in t)De(e,a,{get:t[a],enumerable:!0})},Cn=(e,t,a,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of yn(t))!vn.call(e,r)&&r!==a&&De(e,r,{get:()=>t[r],enumerable:!(n=xn(t,r))||n.enumerable});return e};var Ln=e=>Cn(De({},"__esModule",{value:!0}),e);var Xn={};wn(Xn,{browserGlobal:()=>Wt,createChatWidget:()=>Se,init:()=>jt,version:()=>Dt});function Lt(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function je(e,t){let a={...e};for(let n of Object.keys(t)){let r=t[n],p=a[n];if(Lt(p)&&Lt(r)){a[n]=je(p,r);continue}r!==void 0&&(a[n]=r)}return a}function At(e){return e instanceof Error?e:typeof e=="string"?new Error(e):new Error("Unexpected widget error")}function q(e,t){return`${e.replace(/\/$/,"")}/${t.replace(/^\//,"")}`}function V(e,t,a){return{"Content-Type":"application/json",...e.customHeaders,...a?{"X-Chat-User-Context":a}:{},...t?{Authorization:`Bearer ${t}`}:{}}}async function K(e){if(!e.getUserContext)return null;let t=await e.getUserContext();return t?JSON.stringify(t):null}function ce(e,t,a={}){let n=t.replace(/\{chatId\}/g,encodeURIComponent(a.chatId??"")).replace(/:chatId\b/g,encodeURIComponent(a.chatId??""));return q(e.apiBaseUrl,n)}async function Y(e,t){let a=`Failed to ${t}. Please try again.`;e.status===400?a="Invalid request. Please check your input and try again.":e.status===401?a="Authentication failed. Please log in again.":e.status===403?a="You do not have permission to perform this action.":e.status===404?a="The requested resource was not found.":e.status===429?a="Too many requests. Please wait a moment and try again.":e.status>=500&&(a="The server is currently experiencing issues. Please try again later.");try{let n=await e.json();n&&typeof n=="object"&&(typeof n.message=="string"?a=n.message:typeof n.error=="string"&&(a=n.error))}catch{}throw new Error(a)}async function Pt(e,t){let a=e.getAccessToken?await e.getAccessToken():null,n=await K(e),r=ce(e,e.endpoints.ask,{chatId:t.chatId}),p={message:t.message,query:t.message,chat_id:t.chatId,knowledgeNames:t.knowledgeNames,knowledge_names:t.knowledgeNames,editLastQa:t.editLastQa??!1,edit_last_qa:t.editLastQa??!1,enableReferences:t.enableReferences??!0,enable_references:t.enableReferences??!0},i=await fetch(r,{method:"POST",headers:V(e,a,n),body:JSON.stringify(p)});i.ok||await Y(i,"send message");let d=i.body?.getReader(),g="";if(d)for(;;){let{done:u,value:f}=await d.read();if(u)break;f&&(g+=new TextDecoder("utf-8").decode(f,{stream:!0}))}else g=await i.text();let c;try{c=JSON.parse(g)}catch{return{chatId:t.chatId,answer:g,suggestions:[],citations:[]}}if(!Array.isArray(c)){if(!c.answer||typeof c.answer!="string")throw new Error("Chat backend response is missing a valid answer.");return{chatId:c.chatId??t.chatId,answer:c.answer,suggestions:c.suggestions??[],citations:c.citations??[]}}if(c.some(u=>u&&typeof u=="object"&&u.type==="answer")){let u="",f=[];for(let k of c)!k||typeof k!="object"||(k.type==="answer"&&typeof k.content=="string"?u=k.content:k.type==="references"&&k.content&&Array.isArray(k.content.citations)&&(f=k.content.citations.map(C=>{let y=C.id,v=C.text||"",A=C.page??null,T="",E=v.split(`
// `)[0];E&&(T=E.split("|")[0].trim());let J=T?q(e.apiBaseUrl,`/my-chats/docs/${encodeURIComponent(T)}`):null;return{knowledgeName:T,text:v,pageNumber:A,sourceDocument:J,score:null,sheetName:null,rowNumber:null}})));if(!u)throw new Error("Chat backend response is missing a valid answer.");return{chatId:t.chatId,answer:u,suggestions:[],citations:f}}else{let u=c[0];if(!u?.answer||typeof u.answer!="string")throw new Error("Chat backend response is missing a valid answer.");let f=u.content,k=f?.source_documents??[],C=f?.scores??[],y=f?.page_numbers??[],v=f?.sheet_names??[],A=f?.row_numbers??[],T=f?.knowledge_names??[],E=k.map((J,D)=>({sourceDocument:J,score:C[D]??null,pageNumber:y[D]??null,sheetName:v[D]??null,rowNumber:A[D]??null,knowledgeName:T[D]??null}));return{chatId:t.chatId,answer:u.answer,suggestions:[],citations:E}}}async function St(e,t){if(!e.endpoints.history)return[];let a=e.getAccessToken?await e.getAccessToken():null,n=await K(e),p=/(\{chatId\}|:chatId\b)/.test(e.endpoints.history)?ce(e,e.endpoints.history,{chatId:t}):(()=>{let c=new URL(q(e.apiBaseUrl,e.endpoints.history));return c.searchParams.set("chat_id",t),c.toString()})(),i=await fetch(p,{method:"GET",headers:V(e,a,n)});i.ok||await Y(i,"fetch chat history");let d=await i.json(),g=Array.isArray(d)?d:d&&typeof d=="object"?d.history??d.messages??d.data??[]:[];return Array.isArray(g)?g.map(c=>{if(!c||typeof c!="object")return null;let m=c;if(typeof m.question=="string"&&typeof m.answer=="string")return[{role:"user",text:m.question},{role:"assistant",text:m.answer}];let u=m.role??m.type??m.sender??m.author,f=m.text??m.message??m.content??m.answer;if(typeof f!="string")return null;let k=typeof u=="string"?u.toLowerCase():"assistant";return[{role:k==="user"||k==="human"?"user":"assistant",text:f,...Array.isArray(m.citations)?{citations:m.citations.map(C=>{if(!C.sourceDocument&&C.text){let y=C.text.split(`
// `)[0],v=y?y.split("|")[0].trim():"";return{...C,knowledgeName:v,sourceDocument:v?q(e.apiBaseUrl,`/my-chats/docs/${encodeURIComponent(v)}`):null}}return C})}:{},...typeof m.isLike=="boolean"?{isLike:m.isLike}:{}}]}).flat().filter(c=>!!c):[]}async function Tt(e){if(!e.endpoints.listChats)return[];let t=e.getAccessToken?await e.getAccessToken():null,a=await K(e),n=await fetch(q(e.apiBaseUrl,e.endpoints.listChats),{method:"GET",headers:V(e,t,a)});n.ok||await Y(n,"fetch chats");let r=await n.json(),p=Array.isArray(r)?r:r&&typeof r=="object"?r.chats??r.data??r.items??[]:[];return Array.isArray(p)?p.map(i=>{if(!i||typeof i!="object")return null;let d=i,g=d.chatId??d.chat_id??d.id,c=d.title??d.name??d.chatId;if(typeof g!="string"||typeof c!="string")return null;let m=typeof d.createdAt=="string"?d.createdAt:typeof d.created_at=="string"?d.created_at:null,u=typeof d.updatedAt=="string"?d.updatedAt:typeof d.updated_at=="string"?d.updated_at:null,f={chatId:g,title:c,pinned:typeof d.pinned=="boolean"?d.pinned:!1};return m&&(f.createdAt=m),u&&(f.updatedAt=u),f}).filter(i=>!!i):[]}async function Et(e,t,a){let n=e.endpoints.createChat??e.endpoints.listChats;if(!n)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await K(e),i=await fetch(q(e.apiBaseUrl,n),{method:"POST",headers:V(e,r,p),body:JSON.stringify({chatId:t,chat_id:t,...a?{title:a}:{}})});i.ok||await Y(i,"create chat")}async function We(e,t,a){if(!e.endpoints.updateChat)return;let n=e.getAccessToken?await e.getAccessToken():null,r=await K(e),p=ce(e,e.endpoints.updateChat,{chatId:t}),i=await fetch(p,{method:"PUT",headers:V(e,n,r),body:JSON.stringify(a)});i.ok||await Y(i,"update chat")}async function It(e,t){if(!e.endpoints.deleteChat)return;let a=e.getAccessToken?await e.getAccessToken():null,n=await K(e),r=ce(e,e.endpoints.deleteChat,{chatId:t}),p=await fetch(r,{method:"DELETE",headers:V(e,a,n)});p.ok||await Y(p,"delete chat")}function X(e,t){let a=At(t);return e.onError?.(a),a}async function ue(e,t,a,n){if(!e.endpoints.feedback)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await K(e),i=ce(e,e.endpoints.feedback,{chatId:t}),d=await fetch(i,{method:"POST",headers:V(e,r,p),body:JSON.stringify({message:a,isLike:n})});d.ok||await Y(d,"submit feedback")}var _e={accent:"#0f766e",accentSoft:"#ecfeff",panelBackground:"#ffffff",surfaceBackground:"#f8fafc",text:"#1f2937",mutedText:"#64748b",borderColor:"#dbe4ee",shadow:"0 24px 64px rgba(15, 23, 42, 0.20)",zIndex:2147483e3,fontFamily:'"Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif'},P={displayMode:"widget",position:"bottom-right",title:"Knowledge Assistant",subtitle:"Answers are generated based on your access permissions",welcomeMessage:"How can I assist you today?",inputPlaceholder:"Ask your question...",launcherAriaLabel:"Open chat assistant",closeAriaLabel:"Close chat assistant",initialSuggestions:["Which indicators reflect the achievements of Vision KSA goals?","Case studies of real estate initiatives for economic growth","Study of UX for the ministry external portal"],sourceApp:"knowledge-platform",locale:"en",customHeaders:{},assistantPageUrl:"/knowledge-assistant",embedded:{showHeader:!1},rag:{knowledgeNames:[],enableReferences:!0,loadHistoryOnOpen:!1},theme:_e,getAccessToken:void 0,getUserContext:void 0,onOpen:void 0,onClose:void 0,onError:void 0,onOpenAssistantPage:void 0,assistantAvatarUrl:""};function Rt(e){if(!e.apiBaseUrl?.trim())throw new Error("Chat widget config requires a non-empty apiBaseUrl.");if(!e.endpoints?.ask?.trim())throw new Error("Chat widget config requires endpoints.ask to be provided.");let t=e.mount??document.body,a=je(_e,e.theme??{});return{apiBaseUrl:e.apiBaseUrl,endpoints:{...e.endpoints},mount:t,assistantAvatarUrl:e.assistantAvatarUrl??P.assistantAvatarUrl,displayMode:e.displayMode??P.displayMode,position:e.position??P.position,title:e.title??P.title,subtitle:e.subtitle??P.subtitle,welcomeMessage:e.welcomeMessage??P.welcomeMessage,inputPlaceholder:e.inputPlaceholder??P.inputPlaceholder,launcherAriaLabel:e.launcherAriaLabel??P.launcherAriaLabel,closeAriaLabel:e.closeAriaLabel??P.closeAriaLabel,initialSuggestions:e.initialSuggestions??P.initialSuggestions,sourceApp:e.sourceApp??P.sourceApp,locale:e.locale??P.locale,customHeaders:e.customHeaders??P.customHeaders,embedded:{...P.embedded,...e.embedded??{}},rag:{...P.rag,...e.rag??{}},assistantPageUrl:e.assistantPageUrl??P.assistantPageUrl,theme:a,getAccessToken:e.getAccessToken,getUserContext:e.getUserContext,userInfo:e.userInfo,onOpen:e.onOpen,onClose:e.onClose,onError:e.onError,onOpenAssistantPage:e.onOpenAssistantPage}}function o(e,t,a){let n=document.createElement(e);return t&&(n.className=t),a!==void 0&&(n.textContent=a),n}var zt="kp-chat-widget-styles";function Ut(e,t){if(e.getElementById(zt))return;let a=document.createElement("style");a.id=zt,a.textContent=An(t),e.appendChild(a)}function An(e){return`
//     :host {
//       all: initial;
//     }

//     .kp-chat-widget {
//       --kp-accent: ${e.accent};
//       --kp-accent-soft: ${e.accentSoft};
//       --kp-panel-background: ${e.panelBackground};
//       --kp-surface-background: ${e.surfaceBackground};
//       --kp-text: ${e.text};
//       --kp-muted-text: ${e.mutedText};
//       --kp-border-color: ${e.borderColor};
//       --kp-shadow: ${e.shadow};
//       --kp-z-index: ${e.zIndex};
//       --kp-font-family: ${e.fontFamily};
//       --kp-card-background: rgba(255, 255, 255, 0.92);
//       --kp-soft-highlight: rgba(236, 254, 255, 0.82);
//       position: fixed;
//       bottom: 24px;
//       right: 24px;
//       z-index: var(--kp-z-index);
//       font-family: var(--kp-font-family);
//       color: var(--kp-text);
//       box-sizing: border-box;
//     }

//     .kp-chat-widget.kp-chat-widget-embedded {
//       position: relative;
//       inset: auto;
//       width: 100%;
//       height: 100%;
//       min-height: 640px;
//       display: block;
//     }

//     *,
//     *::before,
//     *::after {
//       box-sizing: border-box;
//       font-family: inherit;
//     }

//     .kp-chat-widget.bottom-left {
//       left: 24px;
//       right: auto;
//     }

//     .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
//       left: auto;
//       right: auto;
//     }

//     .kp-rtl .kp-dropdown-item,
//     .kp-rtl .kp-suggestion,
//     .kp-rtl .kp-input,
//     .kp-rtl .kp-full-page-search-input,
//     .kp-rtl .kp-bubble-content,
//     .kp-rtl .kp-source-card,
//     .kp-rtl .kp-source-panel {
//       text-align: right;
//     }

//     .kp-launcher {
//       width: 72px;
//       height: 72px;
//       border: none;
//       border-radius: 999px;
//       cursor: pointer;
//       background: radial-gradient(circle at 30% 30%, #f8fffe 0%, #ecfdf5 52%, #d6f4ef 100%);
//       box-shadow: 0 16px 32px rgba(15, 118, 110, 0.18);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease;
//       color: var(--kp-accent);
//       position: relative;
//       overflow: hidden;
//     }

//     .kp-launcher:hover {
//       transform: translateY(-1px);
//       box-shadow: 0 20px 36px rgba(15, 118, 110, 0.22);
//     }

//     .kp-launcher:focus-visible,
//     .kp-close:focus-visible,
//     .kp-send:focus-visible,
//     .kp-suggestion:focus-visible,
//     .kp-input:focus-visible,
//     .kp-full-page-new-chat:focus-visible,
//     .kp-full-page-close:focus-visible,
//     .kp-full-page-chat-item:focus-visible,
//     .kp-chat-pin:focus-visible,
//     .kp-message-action:focus-visible,
//     .kp-source-chip:focus-visible,
//     .kp-source-panel-close:focus-visible {
//       outline: 2px solid var(--kp-accent);
//       outline-offset: 2px;
//     }

//     .kp-launcher.hidden {
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(8px) scale(0.96);
//     }

//     .kp-star-cluster {
//       position: relative;
//       width: 50px;
//       height: 50px;
//       animation: kp-cluster-rotate 8.5s linear infinite;
//     }

//     .kp-star {
//       position: absolute;
//       color: #08384c;
//       line-height: 1;
//       transform-origin: center;
//     }

//     .kp-star.main {
//       top: 50%;
//       left: 50%;
//       font-size: 30px;
//       transform: translate(-50%, -50%) scale(0.96);
//       animation: kp-main-pulse 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-a {
//       top: -3px;
//       left: 50%;
//       font-size: 18px;
//       transform: translateX(-50%);
//       animation: kp-orbit-a 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-b {
//       right: -3px;
//       bottom: 5px;
//       font-size: 18px;
//       animation: kp-orbit-b 3s ease-in-out infinite;
//     }

//     .kp-star.orbit-c {
//       left: -1px;
//       bottom: 5px;
//       font-size: 18px;
//       animation: kp-orbit-c 3s ease-in-out infinite;
//     }

//     .kp-overlay {
//       position: fixed;
//       inset: 0;
//       background: rgba(15, 23, 42, 0.18);
//       opacity: 0;
//       pointer-events: none;
//       transition: opacity 220ms ease;
//     }

//     .kp-overlay.visible {
//       opacity: 1;
//       pointer-events: auto;
//     }

//     .kp-panel {
//       position: fixed;
//       bottom: 88px;
//       right: 24px;
//       width: min(480px, calc(100vw - 48px));
//       height: min(730px, calc(100vh - 118px));
//       background: var(--kp-panel-background);
//       border: 1px solid rgba(255, 255, 255, 0.35);
//       border-radius: 24px;
//       box-shadow: var(--kp-shadow);
//       overflow: hidden;
//       display: flex;
//       flex-direction: column;
//       opacity: 0;
//       transform: translateX(112px) scale(0.97);
//       transform-origin: bottom right;
//       pointer-events: none;
//       transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
//         transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
//     }

//     .kp-chat-widget.bottom-left .kp-panel {
//       left: 24px;
//       right: auto;
//       transform: translateX(-112px) scale(0.97);
//       transform-origin: bottom left;
//     }

//     .kp-chat-widget .kp-panel.open,
//     .kp-chat-widget.bottom-left .kp-panel.open {
//       opacity: 1;
//       transform: translateX(0) scale(1);
//       pointer-events: auto;
//     }

//     .kp-full-page {
//       position: fixed;
//       inset: 0;
//       background: #ffffff;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(18px);
//       transition: opacity 260ms ease, transform 320ms ease;
//       z-index: calc(var(--kp-z-index) + 2);
//       overflow: hidden;
//     }

//     .kp-full-page.kp-full-page-embedded {
//       position: relative;
//       inset: auto;
//       opacity: 1;
//       pointer-events: auto;
//       transform: none;
//       min-height: 100%;
//       height: 100%;
//       z-index: auto;
//       background: transparent;
//     }

//     .kp-full-page.open {
//       opacity: 1;
//       pointer-events: auto;
//       transform: translateY(0);
//     }

//     .kp-full-page-shell {
//       height: 100vh;
//       display: flex;
//       flex-direction: column;
//       padding: 22px 28px 26px;
//       gap: 16px;
//       overflow: hidden;
//     }

//     .kp-full-page-embedded .kp-full-page-shell {
//       height: 100%;
//       min-height: 100%;
//       padding: 0;
//       gap: 12px;
//     }

//     .kp-full-page-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 16px;
//       padding: 8px 4px 0;
//       flex: none;
//     }

//     .kp-hidden {
//       display: none !important;
//     }

//     .kp-full-page-brand {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       color: #08384c;
//     }

//     .kp-full-page-brand-mark {
//       width: 44px;
//       height: 44px;
//       border-radius: 14px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: linear-gradient(135deg, rgba(37, 181, 192, 0.14), rgba(15, 118, 110, 0.08));
//       font-size: 26px;
//       box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
//     }

//     .kp-full-page-brand-text {
//       font-size: 20px;
//       font-weight: 700;
//       letter-spacing: -0.02em;
//       color: #16394b;
//     }

//     .kp-full-page-header-actions {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//     }

//     .kp-full-page-badge {
//       padding: 10px 14px;
//       border-radius: 999px;
//       font-size: 13px;
//       line-height: 1;
//       color: #0b556c;
//       background: rgba(255, 255, 255, 0.82);
//       border: 1px solid rgba(15, 118, 110, 0.12);
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//     }

//     .kp-full-page-close,
//     .kp-source-panel-close {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 14px;
//       background: rgba(255, 255, 255, 0.82);
//       color: #61788a;
//       font-size: 24px;
//       line-height: 1;
//       cursor: pointer;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//     }

//     .kp-full-page-content {
//       display: grid;
//       grid-template-columns: 290px minmax(0, 1fr) minmax(0, 0);
//       gap: 16px;
//       flex: 1;
//       min-height: 0;
//       overflow: hidden;
//       align-items: stretch;
//     }

//     .kp-full-page-embedded .kp-full-page-content {
//       height: 100%;
//     }

//     .kp-full-page-sidebar,
//     .kp-full-page-panel,
//     .kp-source-panel {
//       border-radius: 24px;
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       background: rgba(255, 255, 255, 0.88);
//       box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
//       backdrop-filter: blur(12px);
//     }

//     .kp-full-page-sidebar {
//       padding: 18px;
//       display: flex;
//       flex-direction: column;
//       gap: 16px;
//       min-height: 0;
//       overflow: auto;
//     }

//     .kp-full-page-new-chat {
//       width: 100%;
//       height: 48px;
//       border: none;
//       border-radius: 12px;
//       background: linear-gradient(135deg, #0a465d 0%, #0f6a75 100%);
//       color: #ffffff;
//       font-size: 16px;
//       font-weight: 600;
//       cursor: pointer;
//       box-shadow: 0 14px 30px rgba(10, 70, 93, 0.18);
//     }

//     .kp-full-page-search {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       height: 44px;
//       border-radius: 12px;
//       border: 1px solid rgba(203, 213, 225, 0.95);
//       background: #ffffff;
//       padding: 0 12px;
//     }

//     .kp-full-page-search-input {
//       flex: 1;
//       border: none;
//       outline: none;
//       background: transparent;
//       color: #334155;
//       font-size: 14px;
//       min-width: 0;
//       box-shadow: none;
//     }

//     .kp-full-page-search-input:focus,
//     .kp-full-page-search-input:focus-visible,
//     .kp-full-page-search-input:active {
//       outline: none;
//       box-shadow: none;
//       border: none;
//     }

//     .kp-full-page-search-icon {
//       color: #607082;
//       font-size: 20px;
//       line-height: 1;
//     }

//     .kp-full-page-section-label {
//       font-size: 12px;
//       line-height: 1.4;
//       text-transform: uppercase;
//       letter-spacing: 0.08em;
//       color: #8a98a6;
//       margin-top: 4px;
//     }

//     .kp-full-page-recent-list,
//     .kp-full-page-pinned-list {
//       display: flex;
//       flex-direction: column;
//       gap: 8px;
//     }

//     .kp-full-page-item {
//       padding: 12px 12px 13px;
//       border-radius: 14px;
//       color: #293845;
//       font-size: 15px;
//       line-height: 1.5;
//       background: rgba(247, 250, 252, 0.9);
//       border: 1px solid rgba(219, 228, 238, 0.88);
//     }

//     .kp-full-page-chat-item {
//       position: relative;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 10px;
//       cursor: pointer;
//       transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;
//       overflow: visible;
//     }

//     .kp-full-page-chat-item:hover {
//       border-color: rgba(15, 118, 110, 0.34);
//       background: rgba(240, 253, 250, 0.95);
//       transform: translateY(-1px);
//     }

//     .kp-full-page-chat-item.active {
//       border-color: rgba(15, 118, 110, 0.5);
//       background: rgba(220, 252, 231, 0.72);
//     }

//     .kp-full-page-chat-item.menu-open {
//       z-index: 4;
//     }

//     .kp-full-page-item-title {
//       min-width: 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       flex: 1;
//     }

//     .kp-chat-pin {
//       flex: none;
//       border: none;
//       background: transparent;
//       color: #0f6a75;
//       font-size: 16px;
//       line-height: 1;
//       padding: 0;
//       cursor: pointer;
//     }

//     .kp-full-page-empty {
//       padding: 8px 4px 0;
//       color: #7a8a99;
//       font-size: 14px;
//       line-height: 1.5;
//     }

//     .kp-full-page-main {
//       min-width: 0;
//       min-height: 0;
//       display: flex;
//     }

//     .kp-full-page-panel {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       min-height: 0;
//       overflow: hidden;
//     }

//     .kp-source-panel {
//       min-width: 0;
//       min-height: 0;
//       overflow: hidden;
//       display: none;
//       flex-direction: column;
//     }

//     .kp-source-panel.open {
//       display: flex;
//     }

//     .kp-full-page-content:has(.kp-source-panel.open) {
//       grid-template-columns: 290px minmax(0, 1fr) 320px;
//     }

//     .kp-source-panel-header {
//       display: flex;
//       align-items: flex-start;
//       justify-content: space-between;
//       gap: 12px;
//       padding: 18px 18px 12px;
//       border-bottom: 1px solid rgba(219, 228, 238, 0.7);
//     }

//     .kp-source-panel-title {
//       font-size: 17px;
//       font-weight: 700;
//       color: #16394b;
//     }

//     .kp-source-panel-subtitle {
//       margin-top: 4px;
//       font-size: 12px;
//       color: #7a8a99;
//     }

//     .kp-source-panel-list {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       padding: 16px;
//       overflow: auto;
//     }

//     .kp-source-panel-empty {
//       color: #7a8a99;
//       font-size: 14px;
//       line-height: 1.5;
//     }

//     .kp-source-card {
//       width: 100%;
//       text-align: left;
//       cursor: pointer;
//       appearance: none;
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       border-radius: 16px;
//       background: #ffffff;
//       padding: 14px;
//     }

//     .kp-source-card-media {
//       display: flex;
//       align-items: center;
//       margin-bottom: 10px;
//     }

//     .kp-source-thumb,
//     .kp-source-thumb-large {
//       flex: none;
//       width: 32px;
//       height: 32px;
//       border-radius: 999px;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       background: linear-gradient(180deg, #eefcf8 0%, #dff7f2 100%);
//       border: 1px solid rgba(15, 118, 110, 0.18);
//       color: #0f6a75;
//       font-size: 14px;
//       line-height: 1;
//       box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
//     }

//     .kp-source-thumb-large {
//       width: 42px;
//       height: 42px;
//       font-size: 18px;
//     }

//     .kp-source-card-title {
//       font-size: 14px;
//       font-weight: 700;
//       color: #16394b;
//       word-break: break-word;
//     }

//     .kp-source-card-meta {
//       margin-top: 8px;
//       font-size: 12px;
//       line-height: 1.5;
//       color: #667a8d;
//       word-break: break-word;
//     }

//     .kp-full-page-body {
//       flex: 1;
//       overflow: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 14px;
//       padding: 42px 28px 18px;
//       background: #ffffff;
//       scroll-behavior: smooth;
//     }

//     .kp-full-page-body.kp-conversation-active {
//       padding-top: 24px;
//     }

//     .kp-full-page-hero {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       text-align: center;
//       gap: 22px;
//       padding: 18px 18px 12px;
//       max-width: 880px;
//       width: 100%;
//       margin: 0 auto;
//     }

//     .kp-full-page-hero-badge {
//       width: 140px;
//       height: 140px;
//       border-radius: 999px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: radial-gradient(circle at 30% 30%, #f8fdff 0%, #edf8ff 50%, #e4eef8 100%);
//       box-shadow:
//         inset 0 2px 0 rgba(255, 255, 255, 0.9),
//         0 22px 40px rgba(15, 23, 42, 0.08);
//     }

//     .kp-star-cluster-static {
//       animation: none;
//     }

//     .kp-full-page-hero-text {
//       max-width: 760px;
//       font-size: 26px;
//       line-height: 1.5;
//       font-weight: 700;
//       letter-spacing: -0.03em;
//       color: #374151;
//     }

//     .kp-full-page-suggestions {
//       width: min(520px, 100%);
//       margin: auto auto 0;
//     }

//     .kp-full-page-footer {
//       flex: none;
//       padding: 0 16px 18px;
//       background: rgba(255, 255, 255, 0.72);
//       border-top: 1px solid rgba(219, 228, 238, 0.75);
//     }

//     .kp-full-page-form {
//       max-width: none;
//       min-height: 56px;
//       border-radius: 16px;
//     }

//     .kp-full-page-note {
//       font-size: 13px;
//       margin-top: 10px;
//     }

//     .kp-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       gap: 12px;
//       padding: 18px 18px 8px;
//       background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
//     }

//     .kp-toolbar {
//       position: relative;
//       display: flex;
//       align-items: center;
//       gap: 8px;
//     }

//     .kp-tool-button {
//       width: 36px;
//       height: 36px;
//       border: none;
//       border-radius: 12px;
//       background: transparent;
//       color: #0f4f68;
//       cursor: pointer;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//       padding: 0;
//       transition: background 140ms ease;
//     }

//     .kp-tool-button:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-pencil-icon {
//       width: 22px;
//       height: 22px;
//       position: relative;
//       display: inline-block;
//     }

//     .kp-pencil-icon::before {
//       content: "";
//       position: absolute;
//       width: 14px;
//       height: 2.5px;
//       background: currentColor;
//       border-radius: 999px;
//       transform: rotate(-45deg);
//       top: 3px;
//       right: 1px;
//     }

//     .kp-pencil-icon::after {
//       content: "";
//       position: absolute;
//       left: 2px;
//       bottom: 2px;
//       width: 11px;
//       height: 11px;
//       border: 2px solid currentColor;
//       border-radius: 4px;
//     }

//     .kp-chevron {
//       font-size: 13px;
//       color: #66839a;
//       transition: transform 160ms ease;
//       margin-left: -2px;
//     }

//     .kp-menu-trigger.open .kp-chevron {
//       transform: rotate(180deg);
//     }

//     .kp-dropdown {
//       position: absolute;
//       top: 44px;
//       left: 0;
//       width: 184px;
//       background: #ffffff;
//       border: 1px solid rgba(15, 79, 104, 0.12);
//       border-radius: 10px;
//       box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
//       padding: 8px;
//       opacity: 0;
//       transform: translateY(-6px);
//       pointer-events: none;
//       transition: opacity 180ms ease, transform 180ms ease;
//       z-index: 2;
//     }

//     .kp-rtl .kp-dropdown {
//       left: auto;
//       right: 0;
//     }

//     .kp-dropdown.open {
//       opacity: 1;
//       transform: translateY(0);
//       pointer-events: auto;
//     }

//     .kp-dropdown-item {
//       width: 100%;
//       border: none;
//       background: transparent;
//       text-align: left;
//       padding: 10px 12px;
//       border-radius: 8px;
//       font-size: 14px;
//       color: var(--kp-text);
//       cursor: pointer;
//     }

//     .kp-dropdown-item:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-title-wrap {
//       display: none;
//     }

//     .kp-close {
//       border: none;
//       background: transparent;
//       font-size: 24px;
//       line-height: 1;
//       color: var(--kp-muted-text);
//       cursor: pointer;
//       padding: 0;
//     }

//     .kp-body {
//       flex: 1;
//       overflow: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       padding: 10px 16px 16px;
//       background: linear-gradient(180deg, #ffffff 0%, var(--kp-surface-background) 100%);
//       scroll-behavior: smooth;
//     }

//     .kp-body.kp-conversation-active {
//       padding-top: 16px;
//     }

//     .kp-panel.kp-sheet-open .kp-body,
//     .kp-panel.kp-sheet-open .kp-footer,
//     .kp-panel.kp-sheet-open .kp-header {
//       opacity: 0;
//       pointer-events: none;
//     }

//     .kp-my-chats-sheet {
//       position: absolute;
//       inset: 0;
//       border-radius: inherit;
//       border: none;
//       background: #ffffff;
//       box-shadow: none;
//       display: none;
//       flex-direction: column;
//       z-index: 3;
//       overflow: hidden;
//     }

//     .kp-my-chats-sheet.open {
//       display: flex;
//     }

//     .kp-my-chats-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       padding: 18px 18px 10px;
//       flex: none;
//       background: #ffffff;
//     }

//     .kp-my-chats-nav {
//       width: 36px;
//       height: 36px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: #61788a;
//       font-size: 22px;
//       line-height: 1;
//       cursor: pointer;
//     }

//     .kp-my-chats-body {
//       flex: 1;
//       overflow: auto;
//       padding: 8px 18px 18px;
//       background: #ffffff;
//     }

//     .kp-my-chats-section-label {
//       font-size: 14px;
//       line-height: 1.5;
//       color: #7a8a99;
//       margin: 14px 0 10px;
//     }

//     .kp-my-chats-list {
//       display: flex;
//       flex-direction: column;
//       gap: 10px;
//     }

//     .kp-chat-actions {
//       position: relative;
//       flex: none;
//     }

//     .kp-chat-actions-trigger {
//       width: 28px;
//       height: 28px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: #526678;
//       font-size: 20px;
//       line-height: 1;
//       cursor: pointer;
//       display: inline-flex;
//       align-items: center;
//       justify-content: center;
//     }

//     .kp-chat-actions-menu {
//       position: absolute;
//       top: 30px;
//       inset-inline-end: 0;
//       width: 120px;
//       padding: 8px;
//       border-radius: 10px;
//       border: 1px solid rgba(219, 228, 238, 0.95);
//       background: #ffffff;
//       box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14);
//       display: none;
//       flex-direction: column;
//       gap: 2px;
//       z-index: 20;
//     }

//     .kp-chat-actions.open .kp-chat-actions-menu {
//       display: flex;
//     }

//     .kp-chat-actions-item {
//       width: 100%;
//       border: none;
//       background: transparent;
//       color: #1f2937;
//       text-align: left;
//       padding: 10px 12px;
//       border-radius: 8px;
//       font-size: 14px;
//       cursor: pointer;
//     }

//     .kp-chat-actions-item:hover {
//       background: rgba(241, 245, 249, 0.95);
//     }

//     .kp-hero {
//       display: flex;
//       gap: 10px;
//       padding: 4px 2px 8px;
//       align-items: flex-start;
//     }

//     .kp-hero-icon {
//       color: #0ea5b7;
//       font-size: 28px;
//       line-height: 1;
//       margin-top: 2px;
//     }

//     .kp-hero-text {
//       font-size: 20px;
//       line-height: 1.45;
//       font-weight: 700;
//       color: #374151;
//     }

//     .kp-message-row {
//       display: flex;
//       align-items: flex-start;
//       gap: 10px;
//       width: 100%;
//     }

//     .kp-message-row.user {
//       justify-content: flex-end;
//     }

//     .kp-avatar {
//       flex: none;
//       width: 36px;
//       height: 36px;
//       border-radius: 999px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 13px;
//       font-weight: 700;
//       box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
//     }

//     .kp-avatar.bot {
//       background: linear-gradient(180deg, #e8fbff 0%, #dff7f2 100%);
//       color: #0f6a75;
//       border: 1px solid rgba(15, 118, 110, 0.16);
//     }

//     .kp-avatar.user {
//       background: linear-gradient(180deg, #fff4ee 0%, #fbe3d5 100%);
//       color: #8c4b1f;
//       border: 1px solid rgba(180, 102, 43, 0.16);
//     }

//     .kp-bubble {
//       max-width: min(85%, 720px);
//       padding: 14px 16px;
//       border-radius: 20px;
//       font-size: 14px;
//       line-height: 1.65;
//       border: 1px solid var(--kp-border-color);
//       background: #ffffff;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
//     }

//     .kp-bubble.user {
//       background: linear-gradient(180deg, #fff8f3 0%, #fdf1e8 100%);
//       border-color: rgba(222, 184, 135, 0.34);
//     }

//     .kp-bubble.bot {
//       background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
//     }

//     .kp-bubble-content {
//       color: var(--kp-text);
//       white-space: normal;
//       word-break: break-word;
//     }

//     .kp-bubble-content p,
//     .kp-bubble-content ul,
//     .kp-bubble-content ol,
//     .kp-bubble-content table,
//     .kp-bubble-content blockquote {
//       margin: 0;
//     }

//     .kp-bubble-content p + p,
//     .kp-bubble-content p + ul,
//     .kp-bubble-content p + ol,
//     .kp-bubble-content ul + p,
//     .kp-bubble-content ol + p,
//     .kp-bubble-content .kp-table-wrap + p,
//     .kp-bubble-content p + .kp-table-wrap,
//     .kp-bubble-content h1 + p,
//     .kp-bubble-content h2 + p,
//     .kp-bubble-content h3 + p {
//       margin-top: 12px;
//     }

//     .kp-bubble-content h1,
//     .kp-bubble-content h2,
//     .kp-bubble-content h3,
//     .kp-bubble-content h4,
//     .kp-bubble-content h5,
//     .kp-bubble-content h6 {
//       margin: 0 0 10px;
//       font-size: 16px;
//       line-height: 1.4;
//       color: #16394b;
//     }

//     .kp-bubble-content ul,
//     .kp-bubble-content ol {
//       padding-inline-start: 20px;
//     }

//     .kp-bubble-content code {
//       padding: 2px 6px;
//       border-radius: 8px;
//       background: rgba(226, 232, 240, 0.66);
//       font-size: 0.92em;
//     }

//     .kp-bubble-content a {
//       color: #0f6a75;
//       text-decoration: underline;
//     }

//     .kp-table-wrap {
//       overflow-x: auto;
//       margin-top: 8px;
//     }

//     .kp-bubble-content table {
//       width: 100%;
//       border-collapse: collapse;
//       border: 1px solid rgba(203, 213, 225, 0.95);
//       border-radius: 14px;
//       overflow: hidden;
//       background: #ffffff;
//     }

//     .kp-bubble-content th,
//     .kp-bubble-content td {
//       padding: 10px 12px;
//       border-bottom: 1px solid rgba(226, 232, 240, 0.95);
//       border-inline-end: 1px solid rgba(226, 232, 240, 0.95);
//       vertical-align: top;
//       text-align: start;
//     }

//     .kp-bubble-content tr:last-child td {
//       border-bottom: none;
//     }

//     .kp-bubble-content th:last-child,
//     .kp-bubble-content td:last-child {
//       border-inline-end: none;
//     }

//     .kp-bubble-content th {
//       background: #f4fbfc;
//       color: #16394b;
//       font-weight: 700;
//     }

//     .kp-meta {
//       font-size: 11px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//       margin-top: 10px;
//     }

//     .kp-source-preview {
//       margin-top: 10px;
//       padding: 12px;
//       border-radius: 16px;
//       border: 1px solid rgba(219, 228, 238, 0.88);
//       background: #ffffff;
//     }

//     .kp-source-preview-title {
//       font-size: 12px;
//       font-weight: 700;
//       color: #16394b;
//       margin-bottom: 8px;
//     }

//     .kp-source-preview-list {
//       display: flex;
//       flex-wrap: nowrap;
//       gap: 8px;
//       overflow-x: auto;
//     }

//     .kp-source-chip {
//       display: inline-flex;
//       align-items: center;
//       gap: 10px;
//       border: 1px solid rgba(15, 118, 110, 0.16);
//       background: #ffffff;
//       color: #0f4f68;
//       border-radius: 999px;
//       padding: 8px 12px;
//       cursor: pointer;
//       font-size: 12px;
//       line-height: 1.3;
//       max-width: 100%;
//       min-width: 0;
//     }

//     .kp-source-chip-more {
//       background: rgba(236, 254, 255, 0.9);
//     }

//     .kp-source-chip-label {
//       min-width: 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//     }

//     .kp-source-thumb-stack {
//       display: inline-flex;
//       align-items: center;
//       margin-inline-end: 2px;
//     }

//     .kp-source-thumb.stacked {
//       margin-inline-end: -10px;
//       background: #ffffff;
//     }

//     .kp-message-actions {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       margin-top: 10px;
//     }

//     .kp-message-action {
//       border: 1px solid rgba(219, 228, 238, 0.9);
//       background: #ffffff;
//       color: #4b6478;
//       border-radius: 999px;
//       padding: 7px 10px;
//       cursor: pointer;
//       font-size: 12px;
//       line-height: 1;
//     }

//     .kp-message-action.active {
//       color: #0f6a75;
//       border-color: rgba(15, 118, 110, 0.3);
//       background: rgba(236, 254, 255, 0.92);
//     }

//     .kp-suggestions {
//       display: flex;
//       flex-direction: column;
//       gap: 10px;
//       margin-top: auto;
//     }

//     .kp-suggestion {
//       border: 1px solid rgba(15, 118, 110, 0.18);
//       background: rgba(247, 251, 255, 0.92);
//       color: var(--kp-text);
//       border-radius: 999px;
//       padding: 11px 14px;
//       cursor: pointer;
//       text-align: left;
//       font-size: 14px;
//       line-height: 1.35;
//     }

//     .kp-footer {
//       padding: 10px 16px 12px;
//       border-top: 1px solid rgba(219, 228, 238, 0.85);
//       background: #ffffff;
//     }

//     .kp-form {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       border: 1px solid var(--kp-border-color);
//       border-radius: 16px;
//       padding: 10px 12px;
//       background: #ffffff;
//     }


//     .kp-input {
//       flex: 1;
//       border: none;
//       outline: none;
//       box-shadow: none;
//       background: transparent;
//       color: var(--kp-text);
//       font-size: 14px;
//       line-height: 1.5;
//       min-width: 0;
//       appearance: none;
//     }

//     .kp-input:focus,
//     .kp-input:focus-visible,
//     .kp-input:active {
//       border: none;
//       outline: none;
//       box-shadow: none;
//     }

//     .kp-send {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 999px;
//       background: #e4f1f8;
//       color: var(--kp-accent);
//       cursor: pointer;
//       font-size: 20px;
//       line-height: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex: none;
//     }
//     .kp-rtl .kp-send {
//       transform: none; /* remove mirroring for RTL, keep button orientation */
//     }

//     .kp-attach {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 999px;
//       background: transparent;
//       color: var(--kp-accent);
//       cursor: pointer;
//       font-size: 20px;
//       line-height: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex: none;
//       transition: background 140ms ease;
//     }

//     .kp-attach:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-attachment-badge {
//       display: inline-flex;
//       align-items: center;
//       padding: 4px 10px;
//       margin-bottom: 8px;
//       border-radius: 12px;
//       background: rgba(228, 241, 248, 0.8);
//       color: var(--kp-accent);
//       font-size: 12px;
//       font-weight: 500;
//       border: 1px solid rgba(15, 118, 110, 0.2);
//     }


//     .kp-note {
//       margin-top: 8px;
//       text-align: center;
//       font-size: 11px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//     }

//     .kp-loading {
//       font-size: 13px;
//       line-height: 1.4;
//       color: var(--kp-muted-text);
//       padding: 4px 2px;
//     }

//     @media (max-width: 1100px) {
//       .kp-full-page-content:has(.kp-source-panel.open) {
//         grid-template-columns: 260px minmax(0, 1fr);
//       }

//       .kp-source-panel.open {
//         position: absolute;
//         inset-inline-end: 28px;
//         top: 92px;
//         bottom: 26px;
//         width: min(320px, calc(100vw - 56px));
//         z-index: 3;
//       }
//     }

//     .kp-full-page-menu-btn {
//       display: none;
//       background: none;
//       border: none;
//       font-size: 24px;
//       color: #374151;
//       cursor: pointer;
//       margin-inline-end: 12px;
//       padding: 4px;
//       line-height: 1;
//     }

//     @media (max-width: 860px) {
//       .kp-full-page-menu-btn {
//         display: block;
//       }

//       .kp-full-page-content {
//         display: flex;
//         flex-direction: column;
//       }

//       .kp-full-page-content:has(.kp-source-panel.open) {
//         display: grid;
//         grid-template-columns: 1fr;
//         grid-template-rows: 1fr auto;
//       }

//       .kp-full-page-sidebar {
//         position: fixed;
//         top: 0;
//         left: -100%;
//         width: 280px;
//         height: 100%;
//         max-height: 100vh !important;
//         z-index: 1000;
//         background: #ffffff;
//         box-shadow: 4px 0 24px rgba(0,0,0,0.1);
//         transition: left 0.3s ease;
//         flex: none;
//       }

//       .kp-full-page-sidebar.open {
//         left: 0;
//       }

//       .kp-rtl .kp-full-page-sidebar {
//         left: auto;
//         right: -100%;
//         transition: right 0.3s ease;
//         box-shadow: -4px 0 24px rgba(0,0,0,0.1);
//       }

//       .kp-rtl .kp-full-page-sidebar.open {
//         right: 0;
//       }

//       .kp-full-page-embedded .kp-full-page-sidebar {
//         /* max-height: none; handled by !important above */
//       }

//       .kp-source-panel.open {
//         position: static;
//         inset: auto;
//         width: auto;
//         max-height: 280px;
//       }
//     }

//     @media (max-width: 640px) {
//       .kp-chat-widget,
//       .kp-chat-widget.bottom-left {
//         left: auto;
//         right: 16px;
//         bottom: 16px;
//       }

//       .kp-chat-widget.kp-chat-widget-embedded,
//       .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
//         left: auto;
//         right: auto;
//         bottom: auto;
//       }

//       .kp-panel,
//       .kp-chat-widget.bottom-left .kp-panel {
//         inset: 0;
//         width: 100vw;
//         height: 100vh;
//         border-radius: 0;
//         transform: translateX(72px) scale(0.985);
//         transform-origin: center right;
//       }

//       .kp-panel.open {
//         transform: translateX(0) scale(1);
//       }

//       .kp-full-page-shell {
//         padding: 14px;
//       }

//       .kp-full-page-embedded .kp-full-page-shell {
//         padding: 0;
//       }

//       .kp-full-page-header {
//         padding: 0;
//       }

//       .kp-full-page-body {
//         padding: 24px 16px 16px;
//       }

//       .kp-full-page-hero-badge {
//         width: 112px;
//         height: 112px;
//       }

//       .kp-full-page-hero-text {
//         font-size: 22px;
//       }

//       .kp-message-row {
//         gap: 8px;
//       }

//       .kp-avatar {
//         width: 32px;
//         height: 32px;
//       }

//       .kp-bubble {
//         max-width: calc(100% - 40px);
//       }
//     }

//     @keyframes kp-cluster-rotate {
//       from { transform: rotate(0deg); }
//       to { transform: rotate(360deg); }
//     }

//     @keyframes kp-main-pulse {
//       0%, 100% { transform: translate(-50%, -50%) scale(0.82); opacity: 0.45; }
//       38% { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
//       60% { transform: translate(-50%, -50%) scale(0.94); opacity: 0.88; }
//     }

//     @keyframes kp-orbit-a {
//       0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
//       40% { transform: translate(-50%, 17px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(-50%, 2px) scale(1); opacity: 0.98; }
//     }

//     @keyframes kp-orbit-b {
//       0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
//       40% { transform: translate(-16px, -13px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(-2px, -2px) scale(1); opacity: 0.98; }
//     }

//     @keyframes kp-orbit-c {
//       0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
//       40% { transform: translate(16px, -13px) scale(0.92); opacity: 0.96; }
//       62% { transform: translate(2px, -2px) scale(1); opacity: 0.98; }
//     }

//     /* In-Widget Premium Document Preview Overlay Styles */
//     .kp-citation-overlay {
//       position: fixed;
//       inset: 0;
//       background: #f8fafc;
//       color: #1f2937;
//       display: flex;
//       flex-direction: column;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(18px);
//       transition: opacity 260ms ease, transform 320ms ease;
//       z-index: 100000;
//       overflow: hidden;
//       box-sizing: border-box;
//     }

//     .kp-chat-widget-embedded .kp-citation-overlay {
//       position: absolute;
//       inset: 0;
//       z-index: 100000;
//     }

//     .kp-citation-overlay.open {
//       opacity: 1;
//       pointer-events: auto;
//       transform: translateY(0);
//     }

//     .kp-citation-overlay-header {
//       background: #ffffff;
//       border-bottom: 1px solid rgba(226, 232, 240, 0.8);
//       height: 64px;
//       display: flex;
//       align-items: center;
//       padding: 0 24px;
//       justify-content: space-between;
//       flex: none;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-brand {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//       font-weight: 600;
//       font-size: 16px;
//       color: #0f766e;
//     }

//     .kp-citation-overlay-brand-logo {
//       font-size: 20px;
//     }

//     .kp-citation-overlay-close {
//       width: 40px;
//       height: 40px;
//       border: none;
//       border-radius: 14px;
//       background: rgba(255, 255, 255, 0.82);
//       color: #61788a;
//       font-size: 24px;
//       line-height: 1;
//       cursor: pointer;
//       box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: background 140ms ease;
//     }

//     .kp-citation-overlay-close:hover {
//       background: rgba(15, 118, 110, 0.08);
//     }

//     .kp-citation-overlay-content {
//       display: grid;
//       grid-template-columns: 380px minmax(0, 1fr);
//       flex: 1;
//       overflow: hidden;
//       align-items: stretch;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-metadata-panel {
//       background: #ffffff;
//       border-right: 1px solid #e2e8f0;
//       padding: 32px 24px;
//       overflow-y: auto;
//       display: flex;
//       flex-direction: column;
//       gap: 24px;
//       box-sizing: border-box;
//     }

//     .kp-citation-overlay-viewer-panel {
//       flex: 1;
//       background: #f1f5f9;
//       display: flex;
//       flex-direction: column;
//       overflow: hidden;
//       box-sizing: border-box;
//     }

//     .doc-badge-wrapper {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }

//     .doc-icon {
//       background: #ecfeff;
//       color: #0f766e;
//       width: 48px;
//       height: 48px;
//       border-radius: 12px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 20px;
//       font-weight: bold;
//     }

//     .doc-badge-info h2 {
//       font-size: 11px;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: #64748b;
//       font-weight: 600;
//       margin: 0;
//     }

//     .doc-title-section h1 {
//       font-size: 18px;
//       font-weight: 700;
//       line-height: 1.4;
//       color: #0f172a;
//       margin: 8px 0 0;
//     }

//     .doc-source-type {
//       font-size: 12px;
//       color: #64748b;
//       margin-top: 4px;
//     }

//     .section-divider {
//       height: 1px;
//       background: #e2e8f0;
//     }

//     .meta-section-title {
//       font-size: 11px;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: #0f766e;
//       font-weight: 600;
//       margin-bottom: 12px;
//     }

//     .summary-box {
//       background: #f8fafc;
//       border: 1px solid #e2e8f0;
//       border-radius: 12px;
//       padding: 16px;
//       font-size: 13.5px;
//       line-height: 1.6;
//       color: #374151;
//       white-space: pre-wrap;
//     }

//     .meta-list {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//     }

//     .meta-item {
//       display: flex;
//       justify-content: space-between;
//       font-size: 13px;
//       line-height: 1.5;
//       border-bottom: 1px dashed #f1f5f9;
//       padding-bottom: 8px;
//     }

//     .meta-label {
//       color: #64748b;
//       font-weight: 500;
//     }

//     .meta-value {
//       color: #1f2937;
//       font-weight: 600;
//       text-align: right;
//       max-width: 200px;
//       word-wrap: break-word;
//     }

//     .viewer-toolbar {
//       background: #0f172a;
//       color: #ffffff;
//       height: 48px;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       padding: 0 20px;
//       font-size: 13px;
//       flex: none;
//       box-sizing: border-box;
//     }

//     .toolbar-left {
//       font-weight: 500;
//       max-width: 300px;
//       white-space: nowrap;
//       overflow: hidden;
//       text-overflow: ellipsis;
//     }

//     .toolbar-center {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }

//     .page-indicator {
//       background: rgba(255, 255, 255, 0.15);
//       padding: 4px 10px;
//       border-radius: 6px;
//       font-weight: 500;
//     }

//     .toolbar-btn {
//       background: transparent;
//       border: none;
//       color: #e2e8f0;
//       cursor: pointer;
//       padding: 4px 12px;
//       border-radius: 6px;
//       font-size: 13px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: all 0.2s;
//       font-weight: 500;
//     }

//     .toolbar-btn:hover {
//       background: rgba(255, 255, 255, 0.1);
//       color: #ffffff;
//     }

//     .toolbar-right {
//       display: flex;
//       align-items: center;
//       gap: 12px;
//     }

//     .viewer-body {
//       flex: 1;
//       overflow: auto;
//       padding: 40px;
//       display: flex;
//       justify-content: center;
//       align-items: flex-start;
//       box-sizing: border-box;
//     }

//     .document-sheet {
//       background: #ffffff;
//       width: 100%;
//       max-width: 800px;
//       min-height: 1000px;
//       box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
//       border-radius: 4px;
//       padding: 60px 50px;
//       display: flex;
//       flex-direction: column;
//       position: relative;
//       transition: transform 0.2s ease;
//       transform-origin: top center;
//       box-sizing: border-box;
//     }

//     .sheet-header {
//       border-bottom: 2px solid #0f766e;
//       padding-bottom: 15px;
//       margin-bottom: 30px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 11px;
//       color: #64748b;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       font-weight: 600;
//     }

//     .sheet-content {
//       font-size: 14.5px;
//       line-height: 1.8;
//       color: #27272a;
//       white-space: pre-wrap;
//       flex: 1;
//       font-family: 'Inter', sans-serif;
//       text-align: left;
//     }

//     .sheet-footer {
//       border-top: 1px solid #e2e8f0;
//       padding-top: 15px;
//       margin-top: 40px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 11px;
//       color: #64748b;
//     }

//     .kp-citation-overlay iframe {
//       width: 100%;
//       height: 100%;
//       border: none;
//     }

//     @media (max-width: 860px) {
//       .kp-citation-overlay-content {
//         grid-template-columns: 1fr;
//         overflow-y: auto;
//       }
      
//       .kp-citation-overlay-metadata-panel {
//         border-right: none;
//         border-bottom: 1px solid #e2e8f0;
//         padding: 20px 16px;
//       }

//       .viewer-body {
//         padding: 20px;
//       }

//       .document-sheet {
//         padding: 30px 20px;
//         min-height: auto;
//       }
//     }
    
//     .kp-floating-menu-wrap {
//       display: none;
//     }
//     .kp-floating-menu-btn {
//       background: none;
//       border: none;
//       color: #374151;
//       cursor: pointer;
//       padding: 8px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       border-radius: 8px;
//     }
//     .kp-floating-menu-btn:hover {
//       background: rgba(0,0,0,0.05);
//     }
//     @media (max-width: 860px) {
//       .kp-floating-menu-wrap {
//         display: flex;
//         padding: 12px 16px 0;
//         flex: none;
//         background: #ffffff;
//       }
//       .kp-full-page-embedded .kp-full-page-shell {
//         gap: 0;
//       }
//       .kp-full-page-body {
//         padding-top: 12px;
//       }
//     }
//   `}var $t={en:{openChatActions:"Open chat actions",newChat:"New Chat",myChats:"My Chats",openAssistant:"Open Knowledge Assistant",back:"Back",close:"Close",assistantBadge:"Knowledge Assistant",closeAssistantPage:"Close knowledge assistant page",searchChat:"Search Chat",recentActivity:"Recent Activity",pinnedCollections:"Pinned Collections",answersBasedOnPermissions:"Answers are generated based on your access permissions",authTokenForwarded:"Auth token is forwarded from the host app when configured.",thinking:"Thinking...",unableToCreateChat:"Unable to create chat",requestFailed:"Request failed",noRecentChats:"No recent chats yet.",noPinnedChats:"No pinned chats yet.",noChats:"No chats yet.",loadingChats:"Loading chats...",pinChat:"Pin chat",unpinChat:"Unpin chat",renameChat:"Rename",deleteChat:"Delete",chatActions:"Chat actions",renamePrompt:"Enter a new chat name",citationsAttached:e=>`${e} citation${e>1?"s":""} attached`,sourcesUsed:"Sources Used",allSourcesUsed:"All Sources Used",documentsAndReferences:"AI documents and references",showAll:"Show All",noSources:"No sources were returned for this answer.",closeSourcesPanel:"Close sources panel",openSource:"Open source",sourceScore:"Score",sourcePage:"Page",sourceSheet:"Sheet",sourceRow:"Row",sourceKnowledge:"Knowledge Base",untitledSource:"Untitled Source",copy:"Copy",copied:"Copied",helpful:"Helpful",notHelpful:"Needs work",send:"Send message",assistantAvatar:"Assistant",userAvatar:"User"},ar:{openChatActions:"\u0641\u062A\u062D \u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",newChat:"\u0645\u062D\u0627\u062F\u062B\u0629 \u062C\u062F\u064A\u062F\u0629",myChats:"\u0645\u062D\u0627\u062F\u062B\u0627\u062A\u064A",openAssistant:"\u0641\u062A\u062D \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",back:"\u0631\u062C\u0648\u0639",close:"\u0625\u063A\u0644\u0627\u0642",assistantBadge:"\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",closeAssistantPage:"\u0625\u063A\u0644\u0627\u0642 \u0635\u0641\u062D\u0629 \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",searchChat:"\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A",recentActivity:"\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0623\u062E\u064A\u0631",pinnedCollections:"\u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0627\u0644\u0645\u062B\u0628\u062A\u0629",answersBasedOnPermissions:"\u064A\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0625\u062C\u0627\u0628\u0627\u062A \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643",authTokenForwarded:"\u064A\u062A\u0645 \u062A\u0645\u0631\u064A\u0631 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0645\u0636\u064A\u0641 \u0639\u0646\u062F \u0627\u0644\u0625\u0639\u062F\u0627\u062F.",thinking:"\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u0641\u0643\u064A\u0631...",unableToCreateChat:"\u062A\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",requestFailed:"\u0641\u0634\u0644 \u0627\u0644\u0637\u0644\u0628",noRecentChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u062D\u062F\u064A\u062B\u0629 \u0628\u0639\u062F.",noPinnedChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0645\u062B\u0628\u062A\u0629 \u0628\u0639\u062F.",noChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0628\u0639\u062F.",loadingChats:"\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A...",pinChat:"\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",unpinChat:"\u0625\u0644\u063A\u0627\u0621 \u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renameChat:"\u0625\u0639\u0627\u062F\u0629 \u062A\u0633\u0645\u064A\u0629",deleteChat:"\u062D\u0630\u0641",chatActions:"\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renamePrompt:"\u0623\u062F\u062E\u0644 \u0627\u0633\u0645\u064B\u0627 \u062C\u062F\u064A\u062F\u064B\u0627 \u0644\u0644\u0645\u062D\u0627\u062F\u062B\u0629",citationsAttached:e=>`\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 ${e} \u0645\u0631\u062C\u0639${e>1?"\u0627\u062A":""}`,sourcesUsed:"\u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",allSourcesUsed:"\u0643\u0644 \u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",documentsAndReferences:"\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0648\u0645\u0631\u0627\u062C\u0639 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",showAll:"\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",noSources:"\u0644\u0645 \u064A\u062A\u0645 \u0625\u0631\u062C\u0627\u0639 \u0645\u0635\u0627\u062F\u0631 \u0644\u0647\u0630\u0647 \u0627\u0644\u0625\u062C\u0627\u0628\u0629.",closeSourcesPanel:"\u0625\u063A\u0644\u0627\u0642 \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0635\u0627\u062F\u0631",openSource:"\u0641\u062A\u062D \u0627\u0644\u0645\u0635\u062F\u0631",sourceScore:"\u0627\u0644\u062F\u0631\u062C\u0629",sourcePage:"\u0627\u0644\u0635\u0641\u062D\u0629",sourceSheet:"\u0627\u0644\u0648\u0631\u0642\u0629",sourceRow:"\u0627\u0644\u0635\u0641",sourceKnowledge:"\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0645\u0639\u0631\u0641\u0629",untitledSource:"\u0645\u0635\u062F\u0631 \u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646",copy:"\u0646\u0633\u062E",copied:"\u062A\u0645 \u0627\u0644\u0646\u0633\u062E",helpful:"\u0645\u0641\u064A\u062F",notHelpful:"\u064A\u062D\u062A\u0627\u062C \u062A\u062D\u0633\u064A\u0646",send:"\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629",assistantAvatar:"\u0627\u0644\u0645\u0633\u0627\u0639\u062F",userAvatar:"\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645"}};function Se(e){if(typeof document>"u")throw new Error("Chat widget can only be initialized in a browser.");let t=Rt(e),a=qe(t.locale),n=zn(t.locale),r=Un(a),p=t.displayMode==="embedded",i={chatId:Pe(t),open:!1,fullPageOpen:p,myChatsOpen:!1,accessTokenProvider:t.getAccessToken,historyLoadedChatId:null,menuOpen:!1,chats:[],chatSearchTerm:"",loadingChats:!1,sourcePanelOpen:!1,sourcePanelTitle:null},d=document.createElement("div");d.dataset.chatWidgetHost="true",t.mount.appendChild(d);let g=d.attachShadow({mode:"open"});Ut(g,t.theme);let c=o("div",`kp-chat-widget ${t.position}`);c.lang=a,c.dir=r?"rtl":"ltr",p&&(c.classList.add("kp-chat-widget-embedded"),Nt(!0)),r&&c.classList.add("kp-rtl");let m=o("div","kp-overlay"),u=o("button","kp-launcher");u.type="button",u.setAttribute("aria-label",t.launcherAriaLabel),u.innerHTML=['<span class="kp-star-cluster" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let f=o("section","kp-panel");f.setAttribute("role","dialog"),f.setAttribute("aria-modal","true"),f.setAttribute("aria-label",t.title);let k=o("div","kp-header"),C=o("div","kp-toolbar"),y=o("button","kp-tool-button kp-menu-trigger");y.type="button",y.setAttribute("aria-label",n.openChatActions),y.innerHTML=['<span class="kp-pencil-icon" aria-hidden="true"></span>','<span class="kp-chevron" aria-hidden="true">\u2304</span>'].join("");let v=o("div","kp-dropdown"),A=o("button","kp-dropdown-item",n.newChat);A.type="button";let T=o("button","kp-dropdown-item",n.myChats);T.type="button";let E=o("button","kp-dropdown-item",n.openAssistant);E.type="button",v.append(A,T,E),C.append(y,v);let J=o("div","kp-title-wrap"),D=o("h2","kp-title",t.title),_t=o("div","kp-subtitle",t.subtitle);J.append(D,_t);let he=o("button","kp-close","\xD7");he.type="button",he.setAttribute("aria-label",t.closeAriaLabel),k.append(C,J,he);let me=o("div","kp-body"),Te=o("div","kp-hero"),Ft=o("div","kp-hero-icon","\u2726"),qt=o("div","kp-hero-text",t.welcomeMessage);Te.append(Ft,qt);let Ke=o("div","kp-footer"),Ee=o("form","kp-form"),$=o("input","kp-input");$.type="text",$.autocomplete="off",$.placeholder=t.inputPlaceholder,$.setAttribute("aria-label",t.inputPlaceholder);let Ie=o("button","kp-send","\u279C");Ie.type="submit",Ie.setAttribute("aria-label",n.send);let Vt=o("div","kp-note",n.authTokenForwarded);Ee.append($,Ie),Ke.append(Ee,Vt),f.append(k,me,Ke),p||c.append(m,u,f),g.appendChild(c),me.appendChild(Te);let Ye=o("div","kp-suggestions");me.appendChild(Ye);let be=o("section","kp-my-chats-sheet"),Xe=o("div","kp-my-chats-header"),ke=o("button","kp-my-chats-nav","\u2190");ke.type="button",ke.setAttribute("aria-label",n.back);let xe=o("button","kp-my-chats-nav kp-my-chats-close","\xD7");xe.type="button",xe.setAttribute("aria-label",n.close),Xe.append(ke,xe);let Je=o("div","kp-my-chats-body"),Kt=o("div","kp-my-chats-section-label",n.recentActivity),Ge=o("div","kp-my-chats-list"),Yt=o("div","kp-my-chats-section-label",n.pinnedCollections),Qe=o("div","kp-my-chats-list");Je.append(Kt,Ge,Yt,Qe),be.append(Xe,Je),f.appendChild(be);let z={body:me,input:$,suggestions:Ye,hero:Te,kind:"panel"},I=o("section","kp-full-page");p&&I.classList.add("kp-full-page-embedded","open"),I.setAttribute("role","dialog"),p||I.setAttribute("aria-modal","true"),I.setAttribute("aria-label",`${t.title} page`);let Re=o("div","kp-full-page-shell"),ye=o("div","kp-full-page-header"),Ze=o("div","kp-full-page-brand"),Xt=o("div","kp-full-page-brand-mark","\u2726"),Jt=o("div","kp-full-page-brand-text",t.title),se=o("button","kp-full-page-menu-btn");se.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',se.type="button",se.setAttribute("aria-label","Toggle sidebar"),se.addEventListener("click",()=>{ie.classList.toggle("open")}),Ze.append(se,Xt,Jt);let et=o("div","kp-full-page-header-actions"),Gt=o("div","kp-full-page-badge",n.assistantBadge),ve=o("button","kp-full-page-close","\xD7");if(ve.type="button",ve.setAttribute("aria-label",n.closeAssistantPage),et.append(Gt,ve),ye.append(Ze,et),!t.embedded.showHeader){ye.classList.add("kp-hidden");let s=o("div","kp-floating-menu-wrap"),l=o("button","kp-floating-menu-btn");l.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',l.type="button",l.setAttribute("aria-label","Toggle sidebar"),l.addEventListener("click",()=>{ie.classList.toggle("open")}),s.append(l),Re.insertBefore(s,ye.nextSibling)}let tt=o("div","kp-full-page-content"),ie=o("aside","kp-full-page-sidebar"),ze=o("button","kp-full-page-new-chat",`+ ${n.newChat}`);ze.type="button";let nt=o("div","kp-full-page-search"),re=o("input","kp-full-page-search-input");re.type="search",re.placeholder=n.searchChat;let Qt=o("span","kp-full-page-search-icon","\u2315");nt.append(re,Qt);let Zt=o("div","kp-full-page-section-label",n.recentActivity),at=o("div","kp-full-page-recent-list"),en=o("div","kp-full-page-section-label",n.pinnedCollections),ot=o("div","kp-full-page-pinned-list");ie.append(ze,nt,Zt,at,en,ot);let st=o("main","kp-full-page-main"),it=o("section","kp-full-page-panel"),Ue=o("div","kp-full-page-body"),$e=o("div","kp-full-page-hero"),rt=o("div","kp-full-page-hero-badge");rt.innerHTML=['<span class="kp-star-cluster kp-star-cluster-static" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let tn=o("div","kp-full-page-hero-text",t.welcomeMessage);$e.append(rt,tn);let lt=o("div","kp-suggestions kp-full-page-suggestions");Ue.append($e,lt);let pt=o("div","kp-full-page-footer"),He=o("form","kp-form kp-full-page-form"),R=o("input","kp-input kp-full-page-input");R.type="text",R.autocomplete="off",R.placeholder=t.inputPlaceholder,R.setAttribute("aria-label",t.inputPlaceholder);let Me=o("button","kp-send kp-full-page-send","\u279C");Me.type="submit",Me.setAttribute("aria-label",n.send);let nn=o("div","kp-note kp-full-page-note",n.answersBasedOnPermissions);He.append(R,Me),pt.append(He,nn),it.append(Ue,pt),st.appendChild(it);let we=o("aside","kp-source-panel"),dt=o("div","kp-source-panel-header"),ct=o("div","kp-source-panel-title-wrap"),ut=o("div","kp-source-panel-title",n.allSourcesUsed),an=o("div","kp-source-panel-subtitle",n.documentsAndReferences);ct.append(ut,an);let Ce=o("button","kp-source-panel-close","\xD7");Ce.type="button",Ce.setAttribute("aria-label",n.closeSourcesPanel),dt.append(ct,Ce);let le=o("div","kp-source-panel-list"),on=o("div","kp-source-panel-empty",n.noSources);le.appendChild(on),we.append(dt,le),tt.append(ie,st,we),Re.append(ye,tt),I.appendChild(Re),c.appendChild(I);let pe=o("div","kp-citation-overlay");c.appendChild(pe);let S={body:Ue,input:R,suggestions:lt,hero:$e,kind:"full-page"},j=()=>({...t,getAccessToken:i.accessTokenProvider}),gt=async()=>{let s=null,l=null;if(t.userInfo)try{let h=await t.userInfo();h&&(s=[h.firstName,h.lastName].filter(Boolean).join(" ")||null,l=h.avatar??null)}catch{}if((!s||!l)&&t.getUserContext)try{let h=await t.getUserContext();h&&(s||(s=[h.firstName,h.lastName].filter(Boolean).join(" ")||h.displayName?.trim()||h.email?.trim()||h.userId?.trim()||null),l||(l=h.avatarUrl??null))}catch{}return{displayName:s,avatarUrl:l}},G=s=>{let l=Ve(s)??n.untitledSource,h=(s.text||"").trim(),w=h,L=h.split(`
// `);if(L.length>1&&L[0]){let B=L[0].trim().replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();B&&(B===l||l.indexOf(B)!==-1||B.indexOf(l)!==-1)&&(w=L.slice(1).join(`
// `).trim())}let b=_n(s.sourceDocument),x=[];(s.pageNumber||s.pageNumber===0)&&x.push(`
//         <div class="meta-item">
//           <span class="meta-label">Page Number</span>
//           <span class="meta-value">${s.pageNumber}</span>
//         </div>
//       `),typeof s.score=="number"&&x.push(`
//         <div class="meta-item">
//           <span class="meta-label">Relevance Score</span>
//           <span class="meta-value">${s.score.toFixed(2)}</span>
//         </div>
//       `),s.sheetName&&x.push(`
//         <div class="meta-item">
//           <span class="meta-label">Sheet Name</span>
//           <span class="meta-value">${O(s.sheetName)}</span>
//         </div>
//       `),(s.rowNumber||s.rowNumber===0)&&x.push(`
//         <div class="meta-item">
//           <span class="meta-label">Row Number</span>
//           <span class="meta-value">${s.rowNumber}</span>
//         </div>
//       `),s.knowledgeName&&x.push(`
//         <div class="meta-item">
//           <span class="meta-label">Database Source</span>
//           <span class="meta-value">${O(s.knowledgeName)}</span>
//         </div>
//       `),x.push(`
//       <div class="meta-item">
//         <span class="meta-label">Classification</span>
//         <span class="meta-value">Uploaded Knowledge</span>
//       </div>
//       <div class="meta-item">
//         <span class="meta-label">Confidentiality</span>
//         <span class="meta-value" style="color: #0f766e;">Public</span>
//       </div>
//       <div class="meta-item">
//         <span class="meta-label">Language</span>
//         <span class="meta-value">English</span>
//       </div>
//     `);let ee=x.join(""),te=w?O(w):"No text snippet available for this citation.",hn=`
//       <div class="doc-badge-wrapper">
//         <div class="doc-icon">\u{1F4C4}</div>
//         <div class="doc-badge-info">
//           <h2>Document Citation</h2>
//         </div>
//       </div>
      
//       <div class="doc-title-section">
//         <h1>${O(l)}</h1>
//         <div class="doc-source-type">Uploaded Knowledge Resource</div>
//       </div>
      
//       <div class="section-divider"></div>
      
//       <div>
//         <h3 class="meta-section-title">Retrieved Passage Snippet</h3>
//         <div class="summary-box">${te}</div>
//       </div>
      
//       <div class="section-divider"></div>
      
//       <div>
//         <h3 class="meta-section-title">Metadata & Classification</h3>
//         <div class="meta-list">
//           ${ee}
//         </div>
//       </div>
//     `,Oe="";b?Oe=`<iframe src="${b}" title="Document Viewer"></iframe>`:Oe=`
//         <div class="viewer-toolbar">
//           <div class="toolbar-left">${O(l)}</div>
//           <div class="toolbar-center">
//             <button class="toolbar-btn zoom-out-btn">\u2212</button>
//             <span class="page-indicator">Page ${s.pageNumber||1}</span>
//             <button class="toolbar-btn zoom-in-btn">+</button>
//           </div>
//           <div class="toolbar-right">
//             <button class="toolbar-btn print-btn">\u{1F5A8}\uFE0F Print</button>
//           </div>
//         </div>
//         <div class="viewer-body">
//           <div class="document-sheet">
//             <div class="sheet-header">
//               <span>${O(l)}</span>
//               <span>Page ${s.pageNumber||1}</span>
//             </div>
//             <div class="sheet-content">${O(h||"No document content retrieved.")}</div>
//             <div class="sheet-footer">
//               <span>Confidentiality: Public</span>
//               <span>Knowledge Platform CB</span>
//             </div>
//           </div>
//         </div>
//       `,pe.textContent="";let yt=o("header","kp-citation-overlay-header"),vt=o("div","kp-citation-overlay-brand");vt.innerHTML=`
//       <span class="kp-citation-overlay-brand-logo">\u2726</span>
//       <span>Knowledge Assistant Document Viewer</span>
//     `;let Ae=o("button","kp-citation-overlay-close","\xD7");Ae.type="button",Ae.setAttribute("aria-label","Close document preview"),Ae.addEventListener("click",()=>{pe.classList.remove("open")}),yt.append(vt,Ae);let wt=o("div","kp-citation-overlay-content"),Ct=o("aside","kp-citation-overlay-metadata-panel");Ct.innerHTML=hn;let ne=o("main","kp-citation-overlay-viewer-panel");if(ne.innerHTML=Oe,wt.append(Ct,ne),pe.append(yt,wt),!b){let F=1,B=ne.querySelector(".document-sheet"),mn=ne.querySelector(".zoom-in-btn"),bn=ne.querySelector(".zoom-out-btn"),kn=ne.querySelector(".print-btn");B&&(mn?.addEventListener("click",()=>{F<1.5&&(F+=.1,B.style.transform=`scale(${F})`)}),bn?.addEventListener("click",()=>{F>.6&&(F-=.1,B.style.transform=`scale(${F})`)}),kn?.addEventListener("click",()=>{window.print()}))}pe.classList.add("open")},de=(s,l)=>{if(i.sourcePanelOpen=!0,i.sourcePanelTitle=l??n.allSourcesUsed,ut.textContent=i.sourcePanelTitle,we.classList.add("open"),le.textContent="",s.length===0){le.appendChild(o("div","kp-source-panel-empty",n.noSources));return}for(let h of s)le.appendChild(Wn(h,n,()=>{G(h)}))},Q=()=>{i.sourcePanelOpen=!1,i.sourcePanelTitle=null,we.classList.remove("open")};ae(z,t.initialSuggestions,async s=>{await H(s,z)}),ae(S,t.initialSuggestions,async s=>{await H(s,S)}),_(),Le(),p&&(U(),t.rag.loadHistoryOnOpen&&Z(S,i.chatId));function Ne(){if(p){i.fullPageOpen=!0,I.classList.add("open");return}i.open||(i.open=!0,i.fullPageOpen=!1,N(),I.classList.remove("open"),u.classList.add("hidden"),m.classList.add("visible"),f.classList.add("open"),t.onOpen?.(),t.rag.loadHistoryOnOpen&&Be.loadHistory(),queueMicrotask(()=>$.focus()))}function W(){if(p){Q();return}i.open&&(M(),N(),i.open=!1,u.classList.remove("hidden"),m.classList.remove("visible"),f.classList.remove("open"),t.onClose?.())}async function H(s,l){let h=s.trim();if(!h)return;l.input.value="";try{await dn(h)}catch(b){let x=X(t,b);fe(l.body,"bot",`${n.unableToCreateChat}: ${x.message}`,{strings:n,view:l,userName:null,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:()=>{},onDislike:()=>{}});return}Fe(l);let w=await gt();fe(l.body,"user",h,{strings:n,view:l,userName:w.displayName,userAvatarUrl:w.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:()=>{},onDislike:()=>{}}),l.body.scrollTop=l.body.scrollHeight;let L=o("div","kp-loading",n.thinking);l.body.appendChild(L),l.body.scrollTop=l.body.scrollHeight;try{let b=await Pn(t),x=await Pt(j(),{message:h,chatId:i.chatId,knowledgeNames:b,...t.rag.enableReferences!==void 0?{enableReferences:t.rag.enableReferences}:{}});L.isConnected&&L.remove(),fe(l.body,"bot",x.answer,{strings:n,view:l,userName:w.displayName,userAvatarUrl:w.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,citations:x.citations??[],onShowSources:de,onShowCitation:G,onLike:()=>{ue(t,i.chatId,x.answer,!0).catch(console.error)},onDislike:()=>{ue(t,i.chatId,x.answer,!1).catch(console.error)}}),i.historyLoadedChatId=null,await U(),x.suggestions?.length&&ae(l,x.suggestions,async ee=>{await H(ee,l)})}catch(b){let x=X(t,b);L.isConnected&&L.remove(),fe(l.body,"bot",`${n.requestFailed}: ${x.message}`,{strings:n,view:l,userName:w.displayName,userAvatarUrl:w.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:()=>{},onDislike:()=>{}})}}async function ft(s){let l=i.fullPageOpen?S:z;await H(s,l)}async function sn(){if(p){i.fullPageOpen=!0,I.classList.add("open"),await U(),await Z(S,i.chatId),queueMicrotask(()=>R.focus());return}i.fullPageOpen=!0,i.open=!1,M(),N(),f.classList.remove("open"),m.classList.remove("visible"),u.classList.add("hidden"),I.classList.add("open"),await U(),await Z(S,i.chatId),queueMicrotask(()=>R.focus())}function ht(){if(p){Q();return}i.fullPageOpen&&(i.fullPageOpen=!1,I.classList.remove("open"),u.classList.remove("hidden"),Q())}function rn(){i.menuOpen=!0,y.classList.add("open"),v.classList.add("open")}function M(){i.menuOpen=!1,y.classList.remove("open"),v.classList.remove("open")}function ln(){i.chatId=Pe(t),i.historyLoadedChatId=null,N(),ge(z),ae(z,t.initialSuggestions,async s=>{await H(s,z)}),M()}async function pn(){i.chatId=Pe(t),i.historyLoadedChatId=null,ge(S),Q(),ae(S,t.initialSuggestions,async s=>{await H(s,S)}),_()}async function U(){if(!t.endpoints.listChats)return _(),Le(),[];i.loadingChats=!0,_(),Le();try{let s=await Tt(j());return i.chats=s,s}catch(s){return X(t,s),i.chats}finally{i.loadingChats=!1,_(),Le()}}async function dn(s){!t.endpoints.listChats&&!t.endpoints.createChat||i.chats.some(l=>l.chatId===i.chatId)||await Et(j(),i.chatId,s?Rn(s,n.newChat):void 0)}async function cn(s){i.chatId=s,i.historyLoadedChatId=null,await Z(S,s),_()}async function un(s){i.chatId=s,i.historyLoadedChatId=null,N(),await Z(z,s)}async function gn(){M(),await U(),i.myChatsOpen=!0,f.classList.add("kp-sheet-open"),be.classList.add("open")}function N(){i.myChatsOpen=!1,f.classList.remove("kp-sheet-open"),be.classList.remove("open")}function fn(s,l){let h=o("div","kp-overlay visible"),w=o("div","kp-rename-dialog");w.style.cssText="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:320px; background:var(--kp-panel-background); box-shadow:var(--kp-shadow); padding:24px; border-radius:16px; opacity:1; pointer-events:auto; z-index: 10000; display:flex; flex-direction:column; height:min-content; box-sizing:border-box;";let L=o("h3","kp-source-preview-title");L.textContent=n.renamePrompt,L.style.marginBottom="16px",L.style.fontSize="16px";let b=o("input","kp-input");b.type="text",b.value=s.title,b.style.border="1px solid var(--kp-border-color)",b.style.padding="10px",b.style.borderRadius="8px",b.style.width="100%",b.style.marginBottom="20px",b.style.flex="none",b.style.height="40px";let x=o("div","kp-message-actions");x.style.justifyContent="flex-end",x.style.gap="8px";let ee=o("button","kp-message-action",n.close);ee.addEventListener("click",()=>h.remove());let te=o("button","kp-message-action active","Save");te.addEventListener("click",async()=>{te.disabled=!0,te.textContent="...",await l(b.value),h.remove()}),x.append(ee,te),w.append(L,b,x),h.appendChild(w),c.appendChild(h),b.focus()}async function mt(s){t.endpoints.updateChat&&fn(s,async l=>{let h=l.trim();if(!(!h||h===s.title))try{await We(j(),s.chatId,{title:h}),await U()}catch(w){X(t,w)}})}async function bt(s){if(t.endpoints.deleteChat)try{await It(j(),s.chatId),i.chatId===s.chatId&&(i.chatId=Pe(t),i.historyLoadedChatId=null,ge(z),ge(S)),await U()}catch(l){X(t,l)}}function _(){Ht(at,ot,i,n,async s=>{await cn(s.chatId),ie.classList.remove("open")},async s=>{await kt(s)},async s=>{await mt(s)},async s=>{await bt(s)})}function Le(){Ht(Ge,Qe,i,n,async s=>{await un(s.chatId)},async s=>{await kt(s)},async s=>{await mt(s)},async s=>{await bt(s)})}async function kt(s){if(t.endpoints.updateChat)try{await We(j(),s.chatId,{pinned:!s.pinned}),await U()}catch(l){X(t,l)}}async function Z(s,l){ge(s),ae(s,t.initialSuggestions,async L=>{await H(L,s)});let h=o("div","kp-message kp-message-ai");h.innerHTML='<div class="kp-message-bubble"><div class="kp-typing-indicator"><span></span><span></span><span></span></div></div>',Fe(s),s.body.appendChild(h);let w=await St(j(),l);if(h.remove(),w.length>0){Fe(s),Bt(s.body,s.hero,s.suggestions);let L=await gt();In(s.body,w,{strings:n,view:s,userName:L.displayName,userAvatarUrl:L.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:b=>{ue(t,l,b,!0).catch(console.error)},onDislike:b=>{ue(t,l,b,!1).catch(console.error)}})}return i.historyLoadedChatId=l,w}let Be={open:Ne,close:W,toggle(){if(p){Ne();return}if(i.open){W();return}Ne()},destroy(){if(document.removeEventListener("keydown",xt),d.remove(),p){let s=!1;document.querySelectorAll("[data-chat-widget-host]").forEach(l=>{let h=l.shadowRoot;h&&h.querySelector(".kp-chat-widget-embedded")&&(s=!0)}),s||Nt(!1)}},sendMessage:ft,setAccessTokenProvider(s){i.accessTokenProvider=s},getChatId(){return i.chatId},loadChats(){return U()},async loadHistory(){let s=i.fullPageOpen?S:z;return Z(s,i.chatId)}};u.addEventListener("click",()=>Be.toggle()),he.addEventListener("click",W),m.addEventListener("click",W),Ce.addEventListener("click",Q),ke.addEventListener("click",N),xe.addEventListener("click",N),y.addEventListener("click",s=>{if(s.stopPropagation(),!i.menuOpen){rn();return}M()}),A.addEventListener("click",ln),T.addEventListener("click",async()=>{await gn()}),E.addEventListener("click",()=>{if(M(),t.onOpenAssistantPage){W(),t.onOpenAssistantPage();return}if(t.assistantPageUrl){W(),window.location.href=t.assistantPageUrl;return}sn()}),ve.addEventListener("click",ht),ze.addEventListener("click",()=>{pn(),queueMicrotask(()=>R.focus())}),re.addEventListener("input",()=>{i.chatSearchTerm=re.value.trim().toLowerCase(),_()}),f.addEventListener("click",s=>{let l=s.target;if(!(l instanceof Element)||!l.closest(".kp-chat-actions")){for(let h of Array.from(g.querySelectorAll(".kp-chat-actions.open")))h.classList.remove("open");for(let h of Array.from(g.querySelectorAll(".kp-full-page-chat-item.menu-open")))h.classList.remove("menu-open")}i.menuOpen&&!v.contains(l)&&!y.contains(l)&&M(),s.stopPropagation()}),g.addEventListener("click",s=>{let l=s.target;if(i.menuOpen&&l instanceof Node&&!v.contains(l)&&!y.contains(l)&&M(),l instanceof Element&&!l.closest(".kp-chat-actions")){for(let h of Array.from(g.querySelectorAll(".kp-chat-actions.open")))h.classList.remove("open");for(let h of Array.from(g.querySelectorAll(".kp-full-page-chat-item.menu-open")))h.classList.remove("menu-open")}}),Ee.addEventListener("submit",async s=>{s.preventDefault(),await ft($.value)}),He.addEventListener("submit",async s=>{s.preventDefault(),await H(R.value,S)});function xt(s){if(s.key==="Escape"){if(i.sourcePanelOpen){Q();return}if(i.myChatsOpen){N();return}if(i.fullPageOpen){if(p)return;ht();return}i.open&&W()}}return document.addEventListener("keydown",xt),Be}async function Pn(e){if(e.rag.getKnowledgeNames){let t=await e.rag.getKnowledgeNames();return Array.isArray(t)?t.filter(Boolean):[]}return(e.rag.knowledgeNames??[]).filter(Boolean)}function Pe(e){return e.rag.chatId?.trim()?e.rag.chatId:e.rag.chatIdFactory?e.rag.chatIdFactory():typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`kp-chat-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function fe(e,t,a,n){let r=t==="bot"?Hn(a,n.citations??[]):{displayText:a,citations:n.citations??[]},p=o("div",`kp-message-row ${t}`),i=Tn(t==="bot"?n.strings.assistantAvatar:n.userName??n.strings.userAvatar,t,t==="bot"?n.assistantAvatarUrl:n.userAvatarUrl),d=o("div",`kp-bubble ${t}`),g=o("div","kp-bubble-content");Fn(g,r.displayText),d.appendChild(g);let c=r.citations;if(c.length){let m=o("div","kp-meta",n.strings.citationsAttached(c.length));d.appendChild(m);let u=o("div","kp-source-preview"),f=o("div","kp-source-preview-title",n.strings.sourcesUsed),k=o("div","kp-source-preview-list");for(let y of c.slice(0,2)){let v=Dn(y,n.strings);v.addEventListener("click",async()=>{n.onShowCitation(y)}),k.appendChild(v)}let C=jn(n.strings);C.addEventListener("click",async()=>{n.onShowSources(c,n.strings.allSourcesUsed)}),k.appendChild(C),u.append(f,k),d.appendChild(u)}return t==="bot"&&d.appendChild(Sn(r.displayText,n.strings,n.onLike,n.onDislike,n.initialFeedback)),t==="user"?p.append(d,i):p.append(i,d),e.appendChild(p),e.scrollTop=e.scrollHeight,p}function Sn(e,t,a,n,r){let p=o("div","kp-message-actions"),i='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',d='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',g='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',c='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>',m=o("button","kp-message-action");m.innerHTML=i,m.type="button",m.setAttribute("title",t.copy),m.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),m.innerHTML=d,window.setTimeout(()=>{m.innerHTML=i},1200)}catch{m.innerHTML=i}});let u=o("button","kp-message-action");u.innerHTML=g,u.type="button",u.setAttribute("aria-label",t.helpful),r===!0&&u.classList.add("active"),u.addEventListener("click",()=>{u.classList.toggle("active"),f.classList.remove("active"),u.classList.contains("active")&&a&&a()});let f=o("button","kp-message-action");return f.innerHTML=c,f.type="button",f.setAttribute("aria-label",t.notHelpful),r===!1&&f.classList.add("active"),f.addEventListener("click",()=>{f.classList.toggle("active"),u.classList.remove("active"),f.classList.contains("active")&&n&&n()}),p.append(m,u,f),p}function Tn(e,t,a){let n=o("div",`kp-avatar ${t}`);if(a){let r=o("img","kp-avatar-img");r.src=a,r.alt=e,r.style.width="100%",r.style.height="100%",r.style.objectFit="cover",r.style.borderRadius="50%",n.appendChild(r)}else{let r=t==="bot"?"\u2726":$n(e);n.textContent=r}return n.setAttribute("aria-hidden","true"),n}function En(e,t,a){e.textContent="";for(let n of t){let r=o("button","kp-suggestion",n);r.type="button",r.addEventListener("click",async()=>{await a(n)}),e.appendChild(r)}}function ae(e,t,a){En(e.suggestions,t,async n=>{e.input.value=n,await a(n)})}function Bt(e,t,a){let n=new Set([t,a]);for(let r of Array.from(e.children))n.has(r)||r.remove()}function Fe(e){e.body.classList.add("kp-conversation-active"),e.hero.remove(),e.suggestions.remove()}function ge(e){e.body.classList.remove("kp-conversation-active"),e.hero.isConnected||e.body.prepend(e.hero),e.suggestions.isConnected||e.body.appendChild(e.suggestions),Bt(e.body,e.hero,e.suggestions),e.input.value=""}function In(e,t,a){for(let n of t)fe(e,n.role==="assistant"?"bot":"user",n.text,{...a,...n.citations!==void 0?{citations:n.citations}:{},...n.isLike!==void 0?{initialFeedback:n.isLike}:{},onLike:()=>{a.onLike&&a.onLike(n.text)},onDislike:()=>{a.onDislike&&a.onDislike(n.text)}})}function Ht(e,t,a,n,r,p,i,d){if(e.textContent="",t.textContent="",a.loadingChats){e.appendChild(o("div","kp-full-page-empty",n.loadingChats));return}let g=a.chats.filter(c=>a.chatSearchTerm?c.title.toLowerCase().includes(a.chatSearchTerm):!0);if(g.length>0){let c=g.filter(u=>u.pinned),m=g.filter(u=>!u.pinned).slice(0,8);Mt(e,m,a.chatId,n,r,p,i,d),Mt(t,c,a.chatId,n,r,p,i,d),m.length===0&&e.appendChild(o("div","kp-full-page-empty",n.noRecentChats)),c.length===0&&t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats));return}e.appendChild(o("div","kp-full-page-empty",n.noChats)),t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats))}function Mt(e,t,a,n,r,p,i,d){for(let g of t){let c=o("div",`kp-full-page-item kp-full-page-chat-item${g.chatId===a?" active":""}`),m=o("span","kp-full-page-item-title",g.title),u=o("div","kp-chat-actions"),f=o("button","kp-chat-actions-trigger","\u22EF");f.type="button",f.setAttribute("aria-label",n.chatActions);let k=o("div","kp-chat-actions-menu"),C=o("button","kp-chat-actions-item",g.pinned?n.unpinChat:n.pinChat);C.type="button",C.addEventListener("click",async A=>{A.stopPropagation(),await p(g)});let y=o("button","kp-chat-actions-item",n.renameChat);y.type="button",y.addEventListener("click",async A=>{A.stopPropagation(),await i(g)});let v=o("button","kp-chat-actions-item",n.deleteChat);v.type="button",v.addEventListener("click",async A=>{A.stopPropagation(),await d(g)}),k.append(C,y,v),u.append(f,k),f.addEventListener("click",A=>{A.stopPropagation();let T=u.classList.contains("open");for(let E of Array.from(e.querySelectorAll(".kp-chat-actions.open")))E.classList.remove("open");for(let E of Array.from(e.querySelectorAll(".kp-full-page-chat-item.menu-open")))E.classList.remove("menu-open");T||(u.classList.add("open"),c.classList.add("menu-open"))}),c.append(m,u),c.setAttribute("role","button"),c.tabIndex=0,c.addEventListener("click",async()=>{await r(g)}),c.addEventListener("keydown",async A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),await r(g))}),c.addEventListener("blur",()=>{u.classList.remove("open"),c.classList.remove("menu-open")}),e.appendChild(c)}}function Rn(e,t){return e.trim().slice(0,60)||t}function qe(e){return e.toLowerCase().split("-")[0]||"en"}function zn(e){let t=$t.en;return $t[qe(e)]??t}function Un(e){return["ar","fa","he","ur"].includes(qe(e))}function $n(e){let t=e.split(/\s+/).filter(Boolean).slice(0,2);return t.length===0?"U":t.map(a=>a[0]?.toUpperCase()??"").join("")}function Ve(e){if(e.knowledgeName?.trim())return e.knowledgeName.trim();if(e.text){let t=e.text.split(`
// `)[0]?.trim();if(t){let a=t.replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();if(a)return a}}if(e.sourceDocument&&/^https?:\/\//i.test(e.sourceDocument)){try{let t=new URL(e.sourceDocument),a=decodeURIComponent(t.pathname),n=a.substring(a.lastIndexOf("/")+1);if(n)return n}catch{}return e.sourceDocument}return e.sourceDocument?.trim()&&!/^c\d+$/i.test(e.sourceDocument)?e.sourceDocument.trim():null}function Hn(e,t){let a=Mn(e);return{displayText:a.displayText,citations:t.length>0?On(t,a.citations):a.citations}}function Mn(e){let a=Ot(e).split(`
// `),n=-1;for(let g=0;g<a.length;g+=1)/^#{0,6}\s*References\s*$/i.test(a[g]?.trim()??"")&&(n=g);if(n===-1)return{displayText:e,citations:[]};let r=a.slice(0,n).join(`
// `).trimEnd(),p=a.slice(n+1).join(`
// `).trim(),d=Nn(p).map(g=>Bn(g)).filter(g=>!!g);return{displayText:r,citations:d}}function Nn(e){let t=[],a="";for(let n of e.split(`
// `)){let r=n.trim();if(r){if(/^\d+\.\s+/.test(r)){a&&t.push(a.trim()),a=r.replace(/^\d+\.\s+/,"");continue}a&&(a=`${a} ${r}`)}}return a&&t.push(a.trim()),t}function Bn(e){let t=e.match(/https?:\/\/\S+/i);if(!t)return null;let a=t[0],n=e.slice(0,t.index).replace(/[.\s]+$/,"").trim();return{sourceDocument:a,knowledgeName:n||a}}function On(e,t){let a=[],n=new Set;for(let r of[...e,...t]){let p=`${r.knowledgeName??""}::${r.sourceDocument??""}`;n.has(p)||(n.add(p),a.push(r))}return a}function Dn(e,t){let a=o("button","kp-source-chip");a.type="button",a.setAttribute("aria-label",t.openSource);let n=o("span","kp-source-thumb");n.textContent="\u2726";let r=o("span","kp-source-chip-label",Ve(e)??t.untitledSource);return a.append(n,r),a}function jn(e){let t=o("button","kp-source-chip kp-source-chip-more");t.type="button";let a=o("span","kp-source-thumb-stack");for(let r=0;r<3;r+=1){let p=o("span","kp-source-thumb stacked");p.textContent="\u2726",a.appendChild(p)}let n=o("span","kp-source-chip-label",e.showAll);return t.append(a,n),t}function Wn(e,t,a){let n=o("button","kp-source-card");n.type="button",n.setAttribute("aria-label",t.openSource),n.addEventListener("click",a);let r=o("div","kp-source-card-media"),p=o("span","kp-source-thumb kp-source-thumb-large");p.textContent="\u2726";let i=o("div","kp-source-card-title",Ve(e)??t.untitledSource),d=o("div","kp-source-card-meta"),g=[];return typeof e.score=="number"&&g.push(`${t.sourceScore}: ${e.score.toFixed(2)}`),typeof e.pageNumber=="number"&&g.push(`${t.sourcePage}: ${e.pageNumber}`),e.sheetName&&g.push(`${t.sourceSheet}: ${e.sheetName}`),typeof e.rowNumber=="number"&&g.push(`${t.sourceRow}: ${e.rowNumber}`),e.knowledgeName&&g.push(`${t.sourceKnowledge}: ${e.knowledgeName}`),d.textContent=g.join(" \u2022 "),r.appendChild(p),n.append(r,i,d),n}function _n(e){return e&&e.trim()||null}function Fn(e,t){e.innerHTML=qn(Ot(t))}function Ot(e){return e.replace(/\r\n/g,`
// `)}function qn(e){return e.split(/\n{2,}/).map(a=>a.trim()).filter(Boolean).map(Vn).join("")}function Vn(e){let t=e.split(`
// `).map(n=>n.trimEnd());if(t.every(n=>/^\s*\|.*\|\s*$/.test(n))&&t.length>=2)return Kn(t);if(t.every(n=>/^\d+\.\s+/.test(n)))return`<ol>${t.map(n=>`<li>${oe(n.replace(/^\d+\.\s+/,""))}</li>`).join("")}</ol>`;if(t.every(n=>/^[-*]\s+/.test(n)))return`<ul>${t.map(n=>`<li>${oe(n.replace(/^[-*]\s+/,""))}</li>`).join("")}</ul>`;let a=t[0]?.match(/^(#{1,6})\s+(.*)$/);if(a){let n=a[1]??"#",r=a[2]??"",p=n.length;return`<h${p}>${oe(r)}</h${p}>`}return`<p>${t.map(n=>oe(n)).join("<br>")}</p>`}function Kn(e){let t=e.filter((i,d)=>!(d===1&&/^\s*\|?(\s*:?-{3,}:?\s*\|)+\s*$/.test(i))).map(i=>Yn(i));if(t.length===0)return"";let a=t[0]??[],n=t.slice(1),r=`<thead><tr>${a.map(i=>`<th>${oe(i)}</th>`).join("")}</tr></thead>`,p=n.length?`<tbody>${n.map(i=>`<tr>${i.map(d=>`<td>${oe(d)}</td>`).join("")}</tr>`).join("")}</tbody>`:"";return`<div class="kp-table-wrap"><table>${r}${p}</table></div>`}function Yn(e){return e.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(t=>t.trim())}function oe(e){let t=O(e);return t=t.replace(/&lt;br\s*\/?&gt;/gi,"<br>"),t=t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>'),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*([^*]+)\*/g,"<em>$1</em>"),t}function O(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Nt(e){typeof document>"u"||document.querySelectorAll("[data-chat-widget-host]").forEach(t=>{let a=t.shadowRoot;if(a){let n=a.querySelector(".kp-chat-widget");n&&!n.classList.contains("kp-chat-widget-embedded")&&(t.style.display=e?"none":"")}})}var Dt="0.1.0",jt=Se,Wt={init:jt,createChatWidget:Se,version:Dt};typeof window<"u"&&(window.ChatWidget=Wt);return Ln(Xn);})();
// //# sourceMappingURL=browser.iife.js.map

"use strict";var ChatWidget=(()=>{var De=Object.defineProperty;var xn=Object.getOwnPropertyDescriptor;var yn=Object.getOwnPropertyNames;var vn=Object.prototype.hasOwnProperty;var wn=(e,t)=>{for(var a in t)De(e,a,{get:t[a],enumerable:!0})},Cn=(e,t,a,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of yn(t))!vn.call(e,r)&&r!==a&&De(e,r,{get:()=>t[r],enumerable:!(n=xn(t,r))||n.enumerable});return e};var Ln=e=>Cn(De({},"__esModule",{value:!0}),e);var Xn={};wn(Xn,{browserGlobal:()=>Wt,createChatWidget:()=>Se,init:()=>jt,version:()=>Dt});function Lt(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function je(e,t){let a={...e};for(let n of Object.keys(t)){let r=t[n],p=a[n];if(Lt(p)&&Lt(r)){a[n]=je(p,r);continue}r!==void 0&&(a[n]=r)}return a}function At(e){return e instanceof Error?e:typeof e=="string"?new Error(e):new Error("Unexpected widget error")}function q(e,t){return`${e.replace(/\/$/,"")}/${t.replace(/^\//,"")}`}function V(e,t,a){return{"Content-Type":"application/json",...e.customHeaders,...a?{"X-Chat-User-Context":a}:{},...t?{Authorization:`Bearer ${t}`}:{}}}async function K(e){if(!e.getUserContext)return null;let t=await e.getUserContext();return t?JSON.stringify(t):null}function ce(e,t,a={}){let n=t.replace(/\{chatId\}/g,encodeURIComponent(a.chatId??"")).replace(/:chatId\b/g,encodeURIComponent(a.chatId??""));return q(e.apiBaseUrl,n)}async function Y(e,t){let a=`Failed to ${t}. Please try again.`;e.status===400?a="Invalid request. Please check your input and try again.":e.status===401?a="Authentication failed. Please log in again.":e.status===403?a="You do not have permission to perform this action.":e.status===404?a="The requested resource was not found.":e.status===429?a="Too many requests. Please wait a moment and try again.":e.status>=500&&(a="The server is currently experiencing issues. Please try again later.");try{let n=await e.json();n&&typeof n=="object"&&(typeof n.message=="string"?a=n.message:typeof n.error=="string"&&(a=n.error))}catch{}throw new Error(a)}async function Pt(e,t){let a=e.getAccessToken?await e.getAccessToken():null,n=await K(e),r=ce(e,e.endpoints.ask,{chatId:t.chatId}),p={message:t.message,query:t.message,chat_id:t.chatId,knowledgeNames:t.knowledgeNames,knowledge_names:t.knowledgeNames,editLastQa:t.editLastQa??!1,edit_last_qa:t.editLastQa??!1,enableReferences:t.enableReferences??!0,enable_references:t.enableReferences??!0},i=await fetch(r,{method:"POST",headers:V(e,a,n),body:JSON.stringify(p)});i.ok||await Y(i,"send message");let d=i.body?.getReader(),g="";if(d)for(;;){let{done:u,value:f}=await d.read();if(u)break;f&&(g+=new TextDecoder("utf-8").decode(f,{stream:!0}))}else g=await i.text();let c;try{c=JSON.parse(g)}catch{return{chatId:t.chatId,answer:g,suggestions:[],citations:[]}}if(!Array.isArray(c)){if(!c.answer||typeof c.answer!="string")throw new Error("Chat backend response is missing a valid answer.");return{chatId:c.chatId??t.chatId,answer:c.answer,suggestions:c.suggestions??[],citations:c.citations??[]}}if(c.some(u=>u&&typeof u=="object"&&u.type==="answer")){let u="",f=[];for(let k of c)!k||typeof k!="object"||(k.type==="answer"&&typeof k.content=="string"?u=k.content:k.type==="references"&&k.content&&Array.isArray(k.content.citations)&&(f=k.content.citations.map(v=>{let C=v.id,L=v.text||"",x=v.page??null,T="",E=L.split(`
`)[0];E&&(T=E.split("|")[0].trim());let J=T?q(e.apiBaseUrl,`/my-chats/docs/${encodeURIComponent(T)}`):null;return{knowledgeName:T,text:L,pageNumber:x,sourceDocument:J,score:null,sheetName:null,rowNumber:null}})));if(!u)throw new Error("Chat backend response is missing a valid answer.");return{chatId:t.chatId,answer:u,suggestions:[],citations:f}}else{let u=c[0];if(!u?.answer||typeof u.answer!="string")throw new Error("Chat backend response is missing a valid answer.");let f=u.content,k=f?.source_documents??[],v=f?.scores??[],C=f?.page_numbers??[],L=f?.sheet_names??[],x=f?.row_numbers??[],T=f?.knowledge_names??[],E=k.map((J,D)=>({sourceDocument:J,score:v[D]??null,pageNumber:C[D]??null,sheetName:L[D]??null,rowNumber:x[D]??null,knowledgeName:T[D]??null}));return{chatId:t.chatId,answer:u.answer,suggestions:[],citations:E}}}async function St(e,t){if(!e.endpoints.history)return[];let a=e.getAccessToken?await e.getAccessToken():null,n=await K(e),p=/(\{chatId\}|:chatId\b)/.test(e.endpoints.history)?ce(e,e.endpoints.history,{chatId:t}):(()=>{let c=new URL(q(e.apiBaseUrl,e.endpoints.history));return c.searchParams.set("chat_id",t),c.toString()})(),i=await fetch(p,{method:"GET",headers:V(e,a,n)});i.ok||await Y(i,"fetch chat history");let d=await i.json(),g=Array.isArray(d)?d:d&&typeof d=="object"?d.history??d.messages??d.data??[]:[];return Array.isArray(g)?g.map(c=>{if(!c||typeof c!="object")return null;let m=c;if(typeof m.question=="string"&&typeof m.answer=="string")return[{role:"user",text:m.question},{role:"assistant",text:m.answer}];let u=m.role??m.type??m.sender??m.author,f=m.text??m.message??m.content??m.answer;if(typeof f!="string")return null;let k=typeof u=="string"?u.toLowerCase():"assistant";return[{role:k==="user"||k==="human"?"user":"assistant",text:f,...Array.isArray(m.citations)?{citations:m.citations.map(v=>{let C=/^c\d+$/i.test(v.sourceDocument||"");if((!v.sourceDocument||C)&&v.text){let L=v.text.split(`
`)[0],x=L?L.split("|")[0].trim():"";return{...v,knowledgeName:x,sourceDocument:x?q(e.apiBaseUrl,`/my-chats/docs/${encodeURIComponent(x)}`):null}}return v})}:{},...typeof m.isLike=="boolean"?{isLike:m.isLike}:{}}]}).flat().filter(c=>!!c):[]}async function Tt(e){if(!e.endpoints.listChats)return[];let t=e.getAccessToken?await e.getAccessToken():null,a=await K(e),n=await fetch(q(e.apiBaseUrl,e.endpoints.listChats),{method:"GET",headers:V(e,t,a)});n.ok||await Y(n,"fetch chats");let r=await n.json(),p=Array.isArray(r)?r:r&&typeof r=="object"?r.chats??r.data??r.items??[]:[];return Array.isArray(p)?p.map(i=>{if(!i||typeof i!="object")return null;let d=i,g=d.chatId??d.chat_id??d.id,c=d.title??d.name??d.chatId;if(typeof g!="string"||typeof c!="string")return null;let m=typeof d.createdAt=="string"?d.createdAt:typeof d.created_at=="string"?d.created_at:null,u=typeof d.updatedAt=="string"?d.updatedAt:typeof d.updated_at=="string"?d.updated_at:null,f={chatId:g,title:c,pinned:typeof d.pinned=="boolean"?d.pinned:!1};return m&&(f.createdAt=m),u&&(f.updatedAt=u),f}).filter(i=>!!i):[]}async function Et(e,t,a){let n=e.endpoints.createChat??e.endpoints.listChats;if(!n)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await K(e),i=await fetch(q(e.apiBaseUrl,n),{method:"POST",headers:V(e,r,p),body:JSON.stringify({chatId:t,chat_id:t,...a?{title:a}:{}})});i.ok||await Y(i,"create chat")}async function We(e,t,a){if(!e.endpoints.updateChat)return;let n=e.getAccessToken?await e.getAccessToken():null,r=await K(e),p=ce(e,e.endpoints.updateChat,{chatId:t}),i=await fetch(p,{method:"PUT",headers:V(e,n,r),body:JSON.stringify(a)});i.ok||await Y(i,"update chat")}async function It(e,t){if(!e.endpoints.deleteChat)return;let a=e.getAccessToken?await e.getAccessToken():null,n=await K(e),r=ce(e,e.endpoints.deleteChat,{chatId:t}),p=await fetch(r,{method:"DELETE",headers:V(e,a,n)});p.ok||await Y(p,"delete chat")}function X(e,t){let a=At(t);return e.onError?.(a),a}async function ue(e,t,a,n){if(!e.endpoints.feedback)return;let r=e.getAccessToken?await e.getAccessToken():null,p=await K(e),i=ce(e,e.endpoints.feedback,{chatId:t}),d=await fetch(i,{method:"POST",headers:V(e,r,p),body:JSON.stringify({message:a,isLike:n})});d.ok||await Y(d,"submit feedback")}var _e={accent:"#0f766e",accentSoft:"#ecfeff",panelBackground:"#ffffff",surfaceBackground:"#f8fafc",text:"#1f2937",mutedText:"#64748b",borderColor:"#dbe4ee",shadow:"0 24px 64px rgba(15, 23, 42, 0.20)",zIndex:2147483e3,fontFamily:'"Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif'},P={displayMode:"widget",position:"bottom-right",title:"Knowledge Assistant",subtitle:"Answers are generated based on your access permissions",welcomeMessage:"How can I assist you today?",inputPlaceholder:"Ask your question...",launcherAriaLabel:"Open chat assistant",closeAriaLabel:"Close chat assistant",initialSuggestions:["Which indicators reflect the achievements of Vision KSA goals?","Case studies of real estate initiatives for economic growth","Study of UX for the ministry external portal"],sourceApp:"knowledge-platform",locale:"en",customHeaders:{},assistantPageUrl:"/knowledge-assistant",embedded:{showHeader:!1},rag:{knowledgeNames:[],enableReferences:!0,loadHistoryOnOpen:!1},theme:_e,getAccessToken:void 0,getUserContext:void 0,onOpen:void 0,onClose:void 0,onError:void 0,onOpenAssistantPage:void 0,assistantAvatarUrl:""};function Rt(e){if(!e.apiBaseUrl?.trim())throw new Error("Chat widget config requires a non-empty apiBaseUrl.");if(!e.endpoints?.ask?.trim())throw new Error("Chat widget config requires endpoints.ask to be provided.");let t=e.mount??document.body,a=je(_e,e.theme??{});return{apiBaseUrl:e.apiBaseUrl,endpoints:{...e.endpoints},mount:t,assistantAvatarUrl:e.assistantAvatarUrl??P.assistantAvatarUrl,displayMode:e.displayMode??P.displayMode,position:e.position??P.position,title:e.title??P.title,subtitle:e.subtitle??P.subtitle,welcomeMessage:e.welcomeMessage??P.welcomeMessage,inputPlaceholder:e.inputPlaceholder??P.inputPlaceholder,launcherAriaLabel:e.launcherAriaLabel??P.launcherAriaLabel,closeAriaLabel:e.closeAriaLabel??P.closeAriaLabel,initialSuggestions:e.initialSuggestions??P.initialSuggestions,sourceApp:e.sourceApp??P.sourceApp,locale:e.locale??P.locale,customHeaders:e.customHeaders??P.customHeaders,embedded:{...P.embedded,...e.embedded??{}},rag:{...P.rag,...e.rag??{}},assistantPageUrl:e.assistantPageUrl??P.assistantPageUrl,theme:a,getAccessToken:e.getAccessToken,getUserContext:e.getUserContext,userInfo:e.userInfo,onOpen:e.onOpen,onClose:e.onClose,onError:e.onError,onOpenAssistantPage:e.onOpenAssistantPage}}function o(e,t,a){let n=document.createElement(e);return t&&(n.className=t),a!==void 0&&(n.textContent=a),n}var zt="kp-chat-widget-styles";function $t(e,t){if(e.getElementById(zt))return;let a=document.createElement("style");a.id=zt,a.textContent=An(t),e.appendChild(a)}function An(e){return`
    :host {
      all: initial;
    }

    .kp-chat-widget {
      --kp-accent: ${e.accent};
      --kp-accent-soft: ${e.accentSoft};
      --kp-panel-background: ${e.panelBackground};
      --kp-surface-background: ${e.surfaceBackground};
      --kp-text: ${e.text};
      --kp-muted-text: ${e.mutedText};
      --kp-border-color: ${e.borderColor};
      --kp-shadow: ${e.shadow};
      --kp-z-index: ${e.zIndex};
      --kp-font-family: ${e.fontFamily};
      --kp-card-background: rgba(255, 255, 255, 0.92);
      --kp-soft-highlight: rgba(236, 254, 255, 0.82);
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: var(--kp-z-index);
      font-family: var(--kp-font-family);
      color: var(--kp-text);
      box-sizing: border-box;
    }

    .kp-chat-widget.kp-chat-widget-embedded {
      position: relative;
      inset: auto;
      width: 100%;
      height: 100%;
      min-height: 640px;
      display: block;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
      font-family: inherit;
    }

    .kp-chat-widget.bottom-left {
      left: 24px;
      right: auto;
    }

    .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
      left: auto;
      right: auto;
    }

    .kp-rtl .kp-dropdown-item,
    .kp-rtl .kp-suggestion,
    .kp-rtl .kp-input,
    .kp-rtl .kp-full-page-search-input,
    .kp-rtl .kp-bubble-content,
    .kp-rtl .kp-source-card,
    .kp-rtl .kp-source-panel {
      text-align: right;
    }

    .kp-launcher {
      width: 72px;
      height: 72px;
      border: none;
      border-radius: 999px;
      cursor: pointer;
      background: radial-gradient(circle at 30% 30%, #f8fffe 0%, #ecfdf5 52%, #d6f4ef 100%);
      box-shadow: 0 16px 32px rgba(15, 118, 110, 0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease;
      color: var(--kp-accent);
      position: relative;
      overflow: hidden;
    }

    .kp-launcher:hover {
      transform: translateY(-1px);
      box-shadow: 0 20px 36px rgba(15, 118, 110, 0.22);
    }

    .kp-launcher:focus-visible,
    .kp-close:focus-visible,
    .kp-send:focus-visible,
    .kp-suggestion:focus-visible,
    .kp-input:focus-visible,
    .kp-full-page-new-chat:focus-visible,
    .kp-full-page-close:focus-visible,
    .kp-full-page-chat-item:focus-visible,
    .kp-chat-pin:focus-visible,
    .kp-message-action:focus-visible,
    .kp-source-chip:focus-visible,
    .kp-source-panel-close:focus-visible {
      outline: 2px solid var(--kp-accent);
      outline-offset: 2px;
    }

    .kp-launcher.hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(8px) scale(0.96);
    }

    .kp-star-cluster {
      position: relative;
      width: 50px;
      height: 50px;
      animation: kp-cluster-rotate 8.5s linear infinite;
    }

    .kp-star {
      position: absolute;
      color: #08384c;
      line-height: 1;
      transform-origin: center;
    }

    .kp-star.main {
      top: 50%;
      left: 50%;
      font-size: 30px;
      transform: translate(-50%, -50%) scale(0.96);
      animation: kp-main-pulse 3s ease-in-out infinite;
    }

    .kp-star.orbit-a {
      top: -3px;
      left: 50%;
      font-size: 18px;
      transform: translateX(-50%);
      animation: kp-orbit-a 3s ease-in-out infinite;
    }

    .kp-star.orbit-b {
      right: -3px;
      bottom: 5px;
      font-size: 18px;
      animation: kp-orbit-b 3s ease-in-out infinite;
    }

    .kp-star.orbit-c {
      left: -1px;
      bottom: 5px;
      font-size: 18px;
      animation: kp-orbit-c 3s ease-in-out infinite;
    }

    .kp-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.18);
      opacity: 0;
      pointer-events: none;
      transition: opacity 220ms ease;
    }

    .kp-overlay.visible {
      opacity: 1;
      pointer-events: auto;
    }

    .kp-panel {
      position: fixed;
      bottom: 88px;
      right: 24px;
      width: min(480px, calc(100vw - 48px));
      height: min(730px, calc(100vh - 118px));
      background: var(--kp-panel-background);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 24px;
      box-shadow: var(--kp-shadow);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateX(112px) scale(0.97);
      transform-origin: bottom right;
      pointer-events: none;
      transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .kp-chat-widget.bottom-left .kp-panel {
      left: 24px;
      right: auto;
      transform: translateX(-112px) scale(0.97);
      transform-origin: bottom left;
    }

    .kp-chat-widget .kp-panel.open,
    .kp-chat-widget.bottom-left .kp-panel.open {
      opacity: 1;
      transform: translateX(0) scale(1);
      pointer-events: auto;
    }

    .kp-full-page {
      position: fixed;
      inset: 0;
      background: #ffffff;
      opacity: 0;
      pointer-events: none;
      transform: translateY(18px);
      transition: opacity 260ms ease, transform 320ms ease;
      z-index: calc(var(--kp-z-index) + 2);
      overflow: hidden;
    }

    .kp-full-page.kp-full-page-embedded {
      position: relative;
      inset: auto;
      opacity: 1;
      pointer-events: auto;
      transform: none;
      min-height: 100%;
      height: 100%;
      z-index: auto;
      background: transparent;
    }

    .kp-full-page.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }

    .kp-full-page-shell {
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 22px 28px 26px;
      gap: 16px;
      overflow: hidden;
    }

    .kp-full-page-embedded .kp-full-page-shell {
      height: 100%;
      min-height: 100%;
      padding: 0;
      gap: 12px;
    }

    .kp-full-page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 8px 4px 0;
      flex: none;
    }

    .kp-hidden {
      display: none !important;
    }

    .kp-full-page-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #08384c;
    }

    .kp-full-page-brand-mark {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(37, 181, 192, 0.14), rgba(15, 118, 110, 0.08));
      font-size: 26px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .kp-full-page-brand-text {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #16394b;
    }

    .kp-full-page-header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .kp-full-page-badge {
      padding: 10px 14px;
      border-radius: 999px;
      font-size: 13px;
      line-height: 1;
      color: #0b556c;
      background: rgba(255, 255, 255, 0.82);
      border: 1px solid rgba(15, 118, 110, 0.12);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    }

    .kp-full-page-close,
    .kp-source-panel-close {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.82);
      color: #61788a;
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    }

    .kp-full-page-content {
      display: grid;
      grid-template-columns: 290px minmax(0, 1fr) minmax(0, 0);
      gap: 16px;
      flex: 1;
      min-height: 0;
      overflow: hidden;
      align-items: stretch;
    }

    .kp-full-page-embedded .kp-full-page-content {
      height: 100%;
    }

    .kp-full-page-sidebar,
    .kp-full-page-panel,
    .kp-source-panel {
      border-radius: 24px;
      border: 1px solid rgba(219, 228, 238, 0.9);
      background: rgba(255, 255, 255, 0.88);
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
      backdrop-filter: blur(12px);
    }

    .kp-full-page-sidebar {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 0;
      overflow: auto;
    }

    .kp-full-page-new-chat {
      width: 100%;
      height: 48px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #0a465d 0%, #0f6a75 100%);
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 14px 30px rgba(10, 70, 93, 0.18);
    }

    .kp-full-page-search {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 44px;
      border-radius: 12px;
      border: 1px solid rgba(203, 213, 225, 0.95);
      background: #ffffff;
      padding: 0 12px;
    }

    .kp-full-page-search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      color: #334155;
      font-size: 14px;
      min-width: 0;
      box-shadow: none;
    }

    .kp-full-page-search-input:focus,
    .kp-full-page-search-input:focus-visible,
    .kp-full-page-search-input:active {
      outline: none;
      box-shadow: none;
      border: none;
    }

    .kp-full-page-search-icon {
      color: #607082;
      font-size: 20px;
      line-height: 1;
    }

    .kp-full-page-section-label {
      font-size: 12px;
      line-height: 1.4;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8a98a6;
      margin-top: 4px;
    }

    .kp-full-page-recent-list,
    .kp-full-page-pinned-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .kp-full-page-item {
      padding: 12px 12px 13px;
      border-radius: 14px;
      color: #293845;
      font-size: 15px;
      line-height: 1.5;
      background: rgba(247, 250, 252, 0.9);
      border: 1px solid rgba(219, 228, 238, 0.88);
    }

    .kp-full-page-chat-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      cursor: pointer;
      transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;
      overflow: visible;
    }

    .kp-full-page-chat-item:hover {
      border-color: rgba(15, 118, 110, 0.34);
      background: rgba(240, 253, 250, 0.95);
      transform: translateY(-1px);
    }

    .kp-full-page-chat-item.active {
      border-color: rgba(15, 118, 110, 0.5);
      background: rgba(220, 252, 231, 0.72);
    }

    .kp-full-page-chat-item.menu-open {
      z-index: 4;
    }

    .kp-full-page-item-title {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }

    .kp-chat-pin {
      flex: none;
      border: none;
      background: transparent;
      color: #0f6a75;
      font-size: 16px;
      line-height: 1;
      padding: 0;
      cursor: pointer;
    }

    .kp-full-page-empty {
      padding: 8px 4px 0;
      color: #7a8a99;
      font-size: 14px;
      line-height: 1.5;
    }

    .kp-full-page-main {
      min-width: 0;
      min-height: 0;
      display: flex;
    }

    .kp-full-page-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }

    .kp-source-panel {
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      display: none;
      flex-direction: column;
    }

    .kp-source-panel.open {
      display: flex;
    }

    .kp-full-page-content:has(.kp-source-panel.open) {
      grid-template-columns: 290px minmax(0, 1fr) 320px;
    }

    .kp-source-panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 18px 18px 12px;
      border-bottom: 1px solid rgba(219, 228, 238, 0.7);
    }

    .kp-source-panel-title {
      font-size: 17px;
      font-weight: 700;
      color: #16394b;
    }

    .kp-source-panel-subtitle {
      margin-top: 4px;
      font-size: 12px;
      color: #7a8a99;
    }

    .kp-source-panel-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      overflow: auto;
    }

    .kp-source-panel-empty {
      color: #7a8a99;
      font-size: 14px;
      line-height: 1.5;
    }

    .kp-source-card {
      width: 100%;
      text-align: left;
      cursor: pointer;
      appearance: none;
      border: 1px solid rgba(219, 228, 238, 0.9);
      border-radius: 16px;
      background: #ffffff;
      padding: 14px;
    }

    .kp-source-card-media {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .kp-source-thumb,
    .kp-source-thumb-large {
      flex: none;
      width: 32px;
      height: 32px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #eefcf8 0%, #dff7f2 100%);
      border: 1px solid rgba(15, 118, 110, 0.18);
      color: #0f6a75;
      font-size: 14px;
      line-height: 1;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
    }

    .kp-source-thumb-large {
      width: 42px;
      height: 42px;
      font-size: 18px;
    }

    .kp-source-card-title {
      font-size: 14px;
      font-weight: 700;
      color: #16394b;
      word-break: break-word;
    }

    .kp-source-card-meta {
      margin-top: 8px;
      font-size: 12px;
      line-height: 1.5;
      color: #667a8d;
      word-break: break-word;
    }

    .kp-full-page-body {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 42px 28px 18px;
      background: #ffffff;
      scroll-behavior: smooth;
    }

    .kp-full-page-body.kp-conversation-active {
      padding-top: 24px;
    }

    .kp-full-page-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 22px;
      padding: 18px 18px 12px;
      max-width: 880px;
      width: 100%;
      margin: 0 auto;
    }

    .kp-full-page-hero-badge {
      width: 140px;
      height: 140px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 30% 30%, #f8fdff 0%, #edf8ff 50%, #e4eef8 100%);
      box-shadow:
        inset 0 2px 0 rgba(255, 255, 255, 0.9),
        0 22px 40px rgba(15, 23, 42, 0.08);
    }

    .kp-star-cluster-static {
      animation: none;
    }

    .kp-full-page-hero-text {
      max-width: 760px;
      font-size: 26px;
      line-height: 1.5;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #374151;
    }

    .kp-full-page-suggestions {
      width: min(520px, 100%);
      margin: auto auto 0;
    }

    .kp-full-page-footer {
      flex: none;
      padding: 0 16px 18px;
      background: rgba(255, 255, 255, 0.72);
      border-top: 1px solid rgba(219, 228, 238, 0.75);
    }

    .kp-full-page-form {
      max-width: none;
      min-height: 56px;
      border-radius: 16px;
    }

    .kp-full-page-note {
      font-size: 13px;
      margin-top: 10px;
    }

    .kp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 18px 18px 8px;
      background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    }

    .kp-toolbar {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .kp-tool-button {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 12px;
      background: transparent;
      color: #0f4f68;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 140ms ease;
    }

    .kp-tool-button:hover {
      background: rgba(15, 118, 110, 0.08);
    }

    .kp-pencil-icon {
      width: 22px;
      height: 22px;
      position: relative;
      display: inline-block;
    }

    .kp-pencil-icon::before {
      content: "";
      position: absolute;
      width: 14px;
      height: 2.5px;
      background: currentColor;
      border-radius: 999px;
      transform: rotate(-45deg);
      top: 3px;
      right: 1px;
    }

    .kp-pencil-icon::after {
      content: "";
      position: absolute;
      left: 2px;
      bottom: 2px;
      width: 11px;
      height: 11px;
      border: 2px solid currentColor;
      border-radius: 4px;
    }

    .kp-chevron {
      font-size: 13px;
      color: #66839a;
      transition: transform 160ms ease;
      margin-left: -2px;
    }

    .kp-menu-trigger.open .kp-chevron {
      transform: rotate(180deg);
    }

    .kp-dropdown {
      position: absolute;
      top: 44px;
      left: 0;
      width: 184px;
      background: #ffffff;
      border: 1px solid rgba(15, 79, 104, 0.12);
      border-radius: 10px;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
      padding: 8px;
      opacity: 0;
      transform: translateY(-6px);
      pointer-events: none;
      transition: opacity 180ms ease, transform 180ms ease;
      z-index: 2;
    }

    .kp-rtl .kp-dropdown {
      left: auto;
      right: 0;
    }

    .kp-dropdown.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .kp-dropdown-item {
      width: 100%;
      border: none;
      background: transparent;
      text-align: left;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 14px;
      color: var(--kp-text);
      cursor: pointer;
    }

    .kp-dropdown-item:hover {
      background: rgba(15, 118, 110, 0.08);
    }

    .kp-title-wrap {
      display: none;
    }

    .kp-close {
      border: none;
      background: transparent;
      font-size: 24px;
      line-height: 1;
      color: var(--kp-muted-text);
      cursor: pointer;
      padding: 0;
    }

    .kp-body {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 10px 16px 16px;
      background: linear-gradient(180deg, #ffffff 0%, var(--kp-surface-background) 100%);
      scroll-behavior: smooth;
    }

    .kp-body.kp-conversation-active {
      padding-top: 16px;
    }

    .kp-panel.kp-sheet-open .kp-body,
    .kp-panel.kp-sheet-open .kp-footer,
    .kp-panel.kp-sheet-open .kp-header {
      opacity: 0;
      pointer-events: none;
    }

    .kp-my-chats-sheet {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      border: none;
      background: #ffffff;
      box-shadow: none;
      display: none;
      flex-direction: column;
      z-index: 3;
      overflow: hidden;
    }

    .kp-my-chats-sheet.open {
      display: flex;
    }

    .kp-my-chats-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 18px 10px;
      flex: none;
      background: #ffffff;
    }

    .kp-my-chats-nav {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 999px;
      background: transparent;
      color: #61788a;
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
    }

    .kp-my-chats-body {
      flex: 1;
      overflow: auto;
      padding: 8px 18px 18px;
      background: #ffffff;
    }

    .kp-my-chats-section-label {
      font-size: 14px;
      line-height: 1.5;
      color: #7a8a99;
      margin: 14px 0 10px;
    }

    .kp-my-chats-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .kp-chat-actions {
      position: relative;
      flex: none;
    }

    .kp-chat-actions-trigger {
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 999px;
      background: transparent;
      color: #526678;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .kp-chat-actions-menu {
      position: absolute;
      top: 30px;
      inset-inline-end: 0;
      width: 120px;
      padding: 8px;
      border-radius: 10px;
      border: 1px solid rgba(219, 228, 238, 0.95);
      background: #ffffff;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.14);
      display: none;
      flex-direction: column;
      gap: 2px;
      z-index: 20;
    }

    .kp-chat-actions.open .kp-chat-actions-menu {
      display: flex;
    }

    .kp-chat-actions-item {
      width: 100%;
      border: none;
      background: transparent;
      color: #1f2937;
      text-align: left;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
    }

    .kp-chat-actions-item:hover {
      background: rgba(241, 245, 249, 0.95);
    }

    .kp-hero {
      display: flex;
      gap: 10px;
      padding: 4px 2px 8px;
      align-items: flex-start;
    }

    .kp-hero-icon {
      color: #0ea5b7;
      font-size: 28px;
      line-height: 1;
      margin-top: 2px;
    }

    .kp-hero-text {
      font-size: 20px;
      line-height: 1.45;
      font-weight: 700;
      color: #374151;
    }

    .kp-message-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      width: 100%;
    }

    .kp-message-row.user {
      justify-content: flex-end;
    }

    .kp-avatar {
      flex: none;
      width: 36px;
      height: 36px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }

    .kp-avatar.bot {
      background: linear-gradient(180deg, #e8fbff 0%, #dff7f2 100%);
      color: #0f6a75;
      border: 1px solid rgba(15, 118, 110, 0.16);
    }

    .kp-avatar.user {
      background: linear-gradient(180deg, #fff4ee 0%, #fbe3d5 100%);
      color: #8c4b1f;
      border: 1px solid rgba(180, 102, 43, 0.16);
    }

    .kp-bubble {
      max-width: min(85%, 720px);
      padding: 14px 16px;
      border-radius: 20px;
      font-size: 14px;
      line-height: 1.65;
      border: 1px solid var(--kp-border-color);
      background: #ffffff;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
    }

    .kp-bubble.user {
      background: linear-gradient(180deg, #fff8f3 0%, #fdf1e8 100%);
      border-color: rgba(222, 184, 135, 0.34);
    }

    .kp-bubble.bot {
      background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    }

    .kp-bubble-content {
      color: var(--kp-text);
      white-space: normal;
      word-break: break-word;
    }

    .kp-bubble-content p,
    .kp-bubble-content ul,
    .kp-bubble-content ol,
    .kp-bubble-content table,
    .kp-bubble-content blockquote {
      margin: 0;
    }

    .kp-bubble-content p + p,
    .kp-bubble-content p + ul,
    .kp-bubble-content p + ol,
    .kp-bubble-content ul + p,
    .kp-bubble-content ol + p,
    .kp-bubble-content .kp-table-wrap + p,
    .kp-bubble-content p + .kp-table-wrap,
    .kp-bubble-content h1 + p,
    .kp-bubble-content h2 + p,
    .kp-bubble-content h3 + p {
      margin-top: 12px;
    }

    .kp-bubble-content h1,
    .kp-bubble-content h2,
    .kp-bubble-content h3,
    .kp-bubble-content h4,
    .kp-bubble-content h5,
    .kp-bubble-content h6 {
      margin: 0 0 10px;
      font-size: 16px;
      line-height: 1.4;
      color: #16394b;
    }

    .kp-bubble-content ul,
    .kp-bubble-content ol {
      padding-inline-start: 20px;
    }

    .kp-bubble-content code {
      padding: 2px 6px;
      border-radius: 8px;
      background: rgba(226, 232, 240, 0.66);
      font-size: 0.92em;
    }

    .kp-bubble-content a {
      color: #0f6a75;
      text-decoration: underline;
    }

    .kp-table-wrap {
      overflow-x: auto;
      margin-top: 8px;
    }

    .kp-bubble-content table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid rgba(203, 213, 225, 0.95);
      border-radius: 14px;
      overflow: hidden;
      background: #ffffff;
    }

    .kp-bubble-content th,
    .kp-bubble-content td {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(226, 232, 240, 0.95);
      border-inline-end: 1px solid rgba(226, 232, 240, 0.95);
      vertical-align: top;
      text-align: start;
    }

    .kp-bubble-content tr:last-child td {
      border-bottom: none;
    }

    .kp-bubble-content th:last-child,
    .kp-bubble-content td:last-child {
      border-inline-end: none;
    }

    .kp-bubble-content th {
      background: #f4fbfc;
      color: #16394b;
      font-weight: 700;
    }

    .kp-meta {
      font-size: 11px;
      line-height: 1.4;
      color: var(--kp-muted-text);
      margin-top: 10px;
    }

    .kp-source-preview {
      margin-top: 10px;
      padding: 12px;
      border-radius: 16px;
      border: 1px solid rgba(219, 228, 238, 0.88);
      background: #ffffff;
    }

    .kp-source-preview-title {
      font-size: 12px;
      font-weight: 700;
      color: #16394b;
      margin-bottom: 8px;
    }

    .kp-source-preview-list {
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
      overflow-x: auto;
    }

    .kp-source-chip {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      border: 1px solid rgba(15, 118, 110, 0.16);
      background: #ffffff;
      color: #0f4f68;
      border-radius: 999px;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 12px;
      line-height: 1.3;
      max-width: 100%;
      min-width: 0;
    }

    .kp-source-chip-more {
      background: rgba(236, 254, 255, 0.9);
    }

    .kp-source-chip-label {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .kp-source-thumb-stack {
      display: inline-flex;
      align-items: center;
      margin-inline-end: 2px;
    }

    .kp-source-thumb.stacked {
      margin-inline-end: -10px;
      background: #ffffff;
    }

    .kp-message-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
    }

    .kp-message-action {
      border: 1px solid rgba(219, 228, 238, 0.9);
      background: #ffffff;
      color: #4b6478;
      border-radius: 999px;
      padding: 7px 10px;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
    }

    .kp-message-action.active {
      color: #0f6a75;
      border-color: rgba(15, 118, 110, 0.3);
      background: rgba(236, 254, 255, 0.92);
    }

    .kp-suggestions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: auto;
    }

    .kp-suggestion {
      border: 1px solid rgba(15, 118, 110, 0.18);
      background: rgba(247, 251, 255, 0.92);
      color: var(--kp-text);
      border-radius: 999px;
      padding: 11px 14px;
      cursor: pointer;
      text-align: left;
      font-size: 14px;
      line-height: 1.35;
    }

    .kp-footer {
      padding: 10px 16px 12px;
      border-top: 1px solid rgba(219, 228, 238, 0.85);
      background: #ffffff;
    }

    .kp-form {
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid var(--kp-border-color);
      border-radius: 16px;
      padding: 10px 12px;
      background: #ffffff;
    }


    .kp-input {
      flex: 1;
      border: none;
      outline: none;
      box-shadow: none;
      background: transparent;
      color: var(--kp-text);
      font-size: 14px;
      line-height: 1.5;
      min-width: 0;
      appearance: none;
    }

    .kp-input:focus,
    .kp-input:focus-visible,
    .kp-input:active {
      border: none;
      outline: none;
      box-shadow: none;
    }

    .kp-send {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 999px;
      background: #e4f1f8;
      color: var(--kp-accent);
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .kp-rtl .kp-send {
      transform: none; /* remove mirroring for RTL, keep button orientation */
    }

    .kp-attach {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 999px;
      background: transparent;
      color: var(--kp-accent);
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      transition: background 140ms ease;
    }

    .kp-attach:hover {
      background: rgba(15, 118, 110, 0.08);
    }

    .kp-attachment-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      margin-bottom: 8px;
      border-radius: 12px;
      background: rgba(228, 241, 248, 0.8);
      color: var(--kp-accent);
      font-size: 12px;
      font-weight: 500;
      border: 1px solid rgba(15, 118, 110, 0.2);
    }


    .kp-note {
      margin-top: 8px;
      text-align: center;
      font-size: 11px;
      line-height: 1.4;
      color: var(--kp-muted-text);
    }

    .kp-loading {
      font-size: 13px;
      line-height: 1.4;
      color: var(--kp-muted-text);
      padding: 4px 2px;
    }

    @media (max-width: 1100px) {
      .kp-full-page-content:has(.kp-source-panel.open) {
        grid-template-columns: 260px minmax(0, 1fr);
      }

      .kp-source-panel.open {
        position: absolute;
        inset-inline-end: 28px;
        top: 92px;
        bottom: 26px;
        width: min(320px, calc(100vw - 56px));
        z-index: 3;
      }
    }

    .kp-full-page-menu-btn {
      display: none;
      background: none;
      border: none;
      font-size: 24px;
      color: #374151;
      cursor: pointer;
      margin-inline-end: 12px;
      padding: 4px;
      line-height: 1;
    }

    @media (max-width: 860px) {
      .kp-full-page-menu-btn {
        display: block;
      }

      .kp-full-page-content {
        display: flex;
        flex-direction: column;
      }

      .kp-full-page-content:has(.kp-source-panel.open) {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr auto;
      }

      .kp-full-page-sidebar {
        position: fixed;
        top: 0;
        left: -100%;
        width: 280px;
        height: 100%;
        max-height: 100vh !important;
        z-index: 1000;
        background: #ffffff;
        box-shadow: 4px 0 24px rgba(0,0,0,0.1);
        transition: left 0.3s ease;
        flex: none;
      }

      .kp-full-page-sidebar.open {
        left: 0;
      }

      .kp-rtl .kp-full-page-sidebar {
        left: auto;
        right: -100%;
        transition: right 0.3s ease;
        box-shadow: -4px 0 24px rgba(0,0,0,0.1);
      }

      .kp-rtl .kp-full-page-sidebar.open {
        right: 0;
      }

      .kp-full-page-embedded .kp-full-page-sidebar {
        /* max-height: none; handled by !important above */
      }

      .kp-source-panel.open {
        position: static;
        inset: auto;
        width: auto;
        max-height: 280px;
      }
    }

    @media (max-width: 640px) {
      .kp-chat-widget,
      .kp-chat-widget.bottom-left {
        left: auto;
        right: 16px;
        bottom: 16px;
      }

      .kp-chat-widget.kp-chat-widget-embedded,
      .kp-chat-widget.kp-chat-widget-embedded.bottom-left {
        left: auto;
        right: auto;
        bottom: auto;
      }

      .kp-panel,
      .kp-chat-widget.bottom-left .kp-panel {
        inset: 0;
        width: 100vw;
        height: 100vh;
        border-radius: 0;
        transform: translateX(72px) scale(0.985);
        transform-origin: center right;
      }

      .kp-panel.open {
        transform: translateX(0) scale(1);
      }

      .kp-full-page-shell {
        padding: 14px;
      }

      .kp-full-page-embedded .kp-full-page-shell {
        padding: 0;
      }

      .kp-full-page-header {
        padding: 0;
      }

      .kp-full-page-body {
        padding: 24px 16px 16px;
      }

      .kp-full-page-hero-badge {
        width: 112px;
        height: 112px;
      }

      .kp-full-page-hero-text {
        font-size: 22px;
      }

      .kp-message-row {
        gap: 8px;
      }

      .kp-avatar {
        width: 32px;
        height: 32px;
      }

      .kp-bubble {
        max-width: calc(100% - 40px);
      }
    }

    @keyframes kp-cluster-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes kp-main-pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(0.82); opacity: 0.45; }
      38% { transform: translate(-50%, -50%) scale(1.04); opacity: 1; }
      60% { transform: translate(-50%, -50%) scale(0.94); opacity: 0.88; }
    }

    @keyframes kp-orbit-a {
      0%, 100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
      40% { transform: translate(-50%, 17px) scale(0.92); opacity: 0.96; }
      62% { transform: translate(-50%, 2px) scale(1); opacity: 0.98; }
    }

    @keyframes kp-orbit-b {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
      40% { transform: translate(-16px, -13px) scale(0.92); opacity: 0.96; }
      62% { transform: translate(-2px, -2px) scale(1); opacity: 0.98; }
    }

    @keyframes kp-orbit-c {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
      40% { transform: translate(16px, -13px) scale(0.92); opacity: 0.96; }
      62% { transform: translate(2px, -2px) scale(1); opacity: 0.98; }
    }

    /* In-Widget Premium Document Preview Overlay Styles */
    .kp-citation-overlay {
      position: fixed;
      inset: 0;
      background: #f8fafc;
      color: #1f2937;
      display: flex;
      flex-direction: column;
      opacity: 0;
      pointer-events: none;
      transform: translateY(18px);
      transition: opacity 260ms ease, transform 320ms ease;
      z-index: 100000;
      overflow: hidden;
      box-sizing: border-box;
    }

    .kp-chat-widget-embedded .kp-citation-overlay {
      position: absolute;
      inset: 0;
      z-index: 100000;
    }

    .kp-citation-overlay.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }

    .kp-citation-overlay-header {
      background: #ffffff;
      border-bottom: 1px solid rgba(226, 232, 240, 0.8);
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 24px;
      justify-content: space-between;
      flex: none;
      box-sizing: border-box;
    }

    .kp-citation-overlay-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 16px;
      color: #0f766e;
    }

    .kp-citation-overlay-brand-logo {
      font-size: 20px;
    }

    .kp-citation-overlay-close {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.82);
      color: #61788a;
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 140ms ease;
    }

    .kp-citation-overlay-close:hover {
      background: rgba(15, 118, 110, 0.08);
    }

    .kp-citation-overlay-content {
      display: grid;
      grid-template-columns: 380px minmax(0, 1fr);
      flex: 1;
      overflow: hidden;
      align-items: stretch;
      box-sizing: border-box;
    }

    .kp-citation-overlay-metadata-panel {
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      padding: 32px 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
      box-sizing: border-box;
    }

    .kp-citation-overlay-viewer-panel {
      flex: 1;
      background: #f1f5f9;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
    }

    .doc-badge-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .doc-icon {
      background: #ecfeff;
      color: #0f766e;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
    }

    .doc-badge-info h2 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      font-weight: 600;
      margin: 0;
    }

    .doc-title-section h1 {
      font-size: 18px;
      font-weight: 700;
      line-height: 1.4;
      color: #0f172a;
      margin: 8px 0 0;
    }

    .doc-source-type {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }

    .section-divider {
      height: 1px;
      background: #e2e8f0;
    }

    .meta-section-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f766e;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .summary-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      font-size: 13.5px;
      line-height: 1.6;
      color: #374151;
      white-space: pre-wrap;
    }

    .meta-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .meta-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      line-height: 1.5;
      border-bottom: 1px dashed #f1f5f9;
      padding-bottom: 8px;
    }

    .meta-label {
      color: #64748b;
      font-weight: 500;
    }

    .meta-value {
      color: #1f2937;
      font-weight: 600;
      text-align: right;
      max-width: 200px;
      word-wrap: break-word;
    }

    .viewer-toolbar {
      background: #0f172a;
      color: #ffffff;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      font-size: 13px;
      flex: none;
      box-sizing: border-box;
    }

    .toolbar-left {
      font-weight: 500;
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .toolbar-center {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .page-indicator {
      background: rgba(255, 255, 255, 0.15);
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 500;
    }

    .toolbar-btn {
      background: transparent;
      border: none;
      color: #e2e8f0;
      cursor: pointer;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-weight: 500;
    }

    .toolbar-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .viewer-body {
      flex: 1;
      overflow: auto;
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      box-sizing: border-box;
    }

    .document-sheet {
      background: #ffffff;
      width: 100%;
      max-width: 800px;
      min-height: 1000px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 60px 50px;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: transform 0.2s ease;
      transform-origin: top center;
      box-sizing: border-box;
    }

    .sheet-header {
      border-bottom: 2px solid #0f766e;
      padding-bottom: 15px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
    }

    .sheet-content {
      font-size: 14.5px;
      line-height: 1.8;
      color: #27272a;
      white-space: pre-wrap;
      flex: 1;
      font-family: 'Inter', sans-serif;
      text-align: left;
    }

    .sheet-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
    }

    .kp-citation-overlay iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    @media (max-width: 860px) {
      .kp-citation-overlay-content {
        grid-template-columns: 1fr;
        overflow-y: auto;
      }
      
      .kp-citation-overlay-metadata-panel {
        border-right: none;
        border-bottom: 1px solid #e2e8f0;
        padding: 20px 16px;
      }

      .viewer-body {
        padding: 20px;
      }

      .document-sheet {
        padding: 30px 20px;
        min-height: auto;
      }
    }
    
    .kp-floating-menu-wrap {
      display: none;
    }
    .kp-floating-menu-btn {
      background: none;
      border: none;
      color: #374151;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }
    .kp-floating-menu-btn:hover {
      background: rgba(0,0,0,0.05);
    }
    @media (max-width: 860px) {
      .kp-floating-menu-wrap {
        display: flex;
        padding: 12px 16px 0;
        flex: none;
        background: #ffffff;
      }
      .kp-full-page-embedded .kp-full-page-shell {
        gap: 0;
      }
      .kp-full-page-body {
        padding-top: 12px;
      }
    }
  `}var Ut={en:{openChatActions:"Open chat actions",newChat:"New Chat",myChats:"My Chats",openAssistant:"Open Knowledge Assistant",back:"Back",close:"Close",assistantBadge:"Knowledge Assistant",closeAssistantPage:"Close knowledge assistant page",searchChat:"Search Chat",recentActivity:"Recent Activity",pinnedCollections:"Pinned Collections",answersBasedOnPermissions:"Answers are generated based on your access permissions",authTokenForwarded:"Auth token is forwarded from the host app when configured.",thinking:"Thinking...",unableToCreateChat:"Unable to create chat",requestFailed:"Request failed",noRecentChats:"No recent chats yet.",noPinnedChats:"No pinned chats yet.",noChats:"No chats yet.",loadingChats:"Loading chats...",pinChat:"Pin chat",unpinChat:"Unpin chat",renameChat:"Rename",deleteChat:"Delete",chatActions:"Chat actions",renamePrompt:"Enter a new chat name",citationsAttached:e=>`${e} citation${e>1?"s":""} attached`,sourcesUsed:"Sources Used",allSourcesUsed:"All Sources Used",documentsAndReferences:"AI documents and references",showAll:"Show All",noSources:"No sources were returned for this answer.",closeSourcesPanel:"Close sources panel",openSource:"Open source",sourceScore:"Score",sourcePage:"Page",sourceSheet:"Sheet",sourceRow:"Row",sourceKnowledge:"Knowledge Base",untitledSource:"Untitled Source",copy:"Copy",copied:"Copied",helpful:"Helpful",notHelpful:"Needs work",send:"Send message",assistantAvatar:"Assistant",userAvatar:"User"},ar:{openChatActions:"\u0641\u062A\u062D \u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",newChat:"\u0645\u062D\u0627\u062F\u062B\u0629 \u062C\u062F\u064A\u062F\u0629",myChats:"\u0645\u062D\u0627\u062F\u062B\u0627\u062A\u064A",openAssistant:"\u0641\u062A\u062D \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",back:"\u0631\u062C\u0648\u0639",close:"\u0625\u063A\u0644\u0627\u0642",assistantBadge:"\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",closeAssistantPage:"\u0625\u063A\u0644\u0627\u0642 \u0635\u0641\u062D\u0629 \u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0645\u0639\u0631\u0641\u0629",searchChat:"\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A",recentActivity:"\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0623\u062E\u064A\u0631",pinnedCollections:"\u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0627\u0644\u0645\u062B\u0628\u062A\u0629",answersBasedOnPermissions:"\u064A\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0625\u062C\u0627\u0628\u0627\u062A \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643",authTokenForwarded:"\u064A\u062A\u0645 \u062A\u0645\u0631\u064A\u0631 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0645\u0636\u064A\u0641 \u0639\u0646\u062F \u0627\u0644\u0625\u0639\u062F\u0627\u062F.",thinking:"\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u0641\u0643\u064A\u0631...",unableToCreateChat:"\u062A\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",requestFailed:"\u0641\u0634\u0644 \u0627\u0644\u0637\u0644\u0628",noRecentChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u062D\u062F\u064A\u062B\u0629 \u0628\u0639\u062F.",noPinnedChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0645\u062B\u0628\u062A\u0629 \u0628\u0639\u062F.",noChats:"\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0627\u062F\u062B\u0627\u062A \u0628\u0639\u062F.",loadingChats:"\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A...",pinChat:"\u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",unpinChat:"\u0625\u0644\u063A\u0627\u0621 \u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renameChat:"\u0625\u0639\u0627\u062F\u0629 \u062A\u0633\u0645\u064A\u0629",deleteChat:"\u062D\u0630\u0641",chatActions:"\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629",renamePrompt:"\u0623\u062F\u062E\u0644 \u0627\u0633\u0645\u064B\u0627 \u062C\u062F\u064A\u062F\u064B\u0627 \u0644\u0644\u0645\u062D\u0627\u062F\u062B\u0629",citationsAttached:e=>`\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 ${e} \u0645\u0631\u062C\u0639${e>1?"\u0627\u062A":""}`,sourcesUsed:"\u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",allSourcesUsed:"\u0643\u0644 \u0627\u0644\u0645\u0635\u0627\u062F\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629",documentsAndReferences:"\u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0648\u0645\u0631\u0627\u062C\u0639 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A",showAll:"\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",noSources:"\u0644\u0645 \u064A\u062A\u0645 \u0625\u0631\u062C\u0627\u0639 \u0645\u0635\u0627\u062F\u0631 \u0644\u0647\u0630\u0647 \u0627\u0644\u0625\u062C\u0627\u0628\u0629.",closeSourcesPanel:"\u0625\u063A\u0644\u0627\u0642 \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0635\u0627\u062F\u0631",openSource:"\u0641\u062A\u062D \u0627\u0644\u0645\u0635\u062F\u0631",sourceScore:"\u0627\u0644\u062F\u0631\u062C\u0629",sourcePage:"\u0627\u0644\u0635\u0641\u062D\u0629",sourceSheet:"\u0627\u0644\u0648\u0631\u0642\u0629",sourceRow:"\u0627\u0644\u0635\u0641",sourceKnowledge:"\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0645\u0639\u0631\u0641\u0629",untitledSource:"\u0645\u0635\u062F\u0631 \u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646",copy:"\u0646\u0633\u062E",copied:"\u062A\u0645 \u0627\u0644\u0646\u0633\u062E",helpful:"\u0645\u0641\u064A\u062F",notHelpful:"\u064A\u062D\u062A\u0627\u062C \u062A\u062D\u0633\u064A\u0646",send:"\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629",assistantAvatar:"\u0627\u0644\u0645\u0633\u0627\u0639\u062F",userAvatar:"\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645"}};function Se(e){if(typeof document>"u")throw new Error("Chat widget can only be initialized in a browser.");let t=Rt(e),a=qe(t.locale),n=zn(t.locale),r=$n(a),p=t.displayMode==="embedded",i={chatId:Pe(t),open:!1,fullPageOpen:p,myChatsOpen:!1,accessTokenProvider:t.getAccessToken,historyLoadedChatId:null,menuOpen:!1,chats:[],chatSearchTerm:"",loadingChats:!1,sourcePanelOpen:!1,sourcePanelTitle:null},d=document.createElement("div");d.dataset.chatWidgetHost="true",t.mount.appendChild(d);let g=d.attachShadow({mode:"open"});$t(g,t.theme);let c=o("div",`kp-chat-widget ${t.position}`);c.lang=a,c.dir=r?"rtl":"ltr",p&&(c.classList.add("kp-chat-widget-embedded"),Nt(!0)),r&&c.classList.add("kp-rtl");let m=o("div","kp-overlay"),u=o("button","kp-launcher");u.type="button",u.setAttribute("aria-label",t.launcherAriaLabel),u.innerHTML=['<span class="kp-star-cluster" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let f=o("section","kp-panel");f.setAttribute("role","dialog"),f.setAttribute("aria-modal","true"),f.setAttribute("aria-label",t.title);let k=o("div","kp-header"),v=o("div","kp-toolbar"),C=o("button","kp-tool-button kp-menu-trigger");C.type="button",C.setAttribute("aria-label",n.openChatActions),C.innerHTML=['<span class="kp-pencil-icon" aria-hidden="true"></span>','<span class="kp-chevron" aria-hidden="true">\u2304</span>'].join("");let L=o("div","kp-dropdown"),x=o("button","kp-dropdown-item",n.newChat);x.type="button";let T=o("button","kp-dropdown-item",n.myChats);T.type="button";let E=o("button","kp-dropdown-item",n.openAssistant);E.type="button",L.append(x,T,E),v.append(C,L);let J=o("div","kp-title-wrap"),D=o("h2","kp-title",t.title),_t=o("div","kp-subtitle",t.subtitle);J.append(D,_t);let he=o("button","kp-close","\xD7");he.type="button",he.setAttribute("aria-label",t.closeAriaLabel),k.append(v,J,he);let me=o("div","kp-body"),Te=o("div","kp-hero"),Ft=o("div","kp-hero-icon","\u2726"),qt=o("div","kp-hero-text",t.welcomeMessage);Te.append(Ft,qt);let Ke=o("div","kp-footer"),Ee=o("form","kp-form"),U=o("input","kp-input");U.type="text",U.autocomplete="off",U.placeholder=t.inputPlaceholder,U.setAttribute("aria-label",t.inputPlaceholder);let Ie=o("button","kp-send","\u279C");Ie.type="submit",Ie.setAttribute("aria-label",n.send);let Vt=o("div","kp-note",n.authTokenForwarded);Ee.append(U,Ie),Ke.append(Ee,Vt),f.append(k,me,Ke),p||c.append(m,u,f),g.appendChild(c),me.appendChild(Te);let Ye=o("div","kp-suggestions");me.appendChild(Ye);let be=o("section","kp-my-chats-sheet"),Xe=o("div","kp-my-chats-header"),ke=o("button","kp-my-chats-nav","\u2190");ke.type="button",ke.setAttribute("aria-label",n.back);let xe=o("button","kp-my-chats-nav kp-my-chats-close","\xD7");xe.type="button",xe.setAttribute("aria-label",n.close),Xe.append(ke,xe);let Je=o("div","kp-my-chats-body"),Kt=o("div","kp-my-chats-section-label",n.recentActivity),Ge=o("div","kp-my-chats-list"),Yt=o("div","kp-my-chats-section-label",n.pinnedCollections),Qe=o("div","kp-my-chats-list");Je.append(Kt,Ge,Yt,Qe),be.append(Xe,Je),f.appendChild(be);let z={body:me,input:U,suggestions:Ye,hero:Te,kind:"panel"},I=o("section","kp-full-page");p&&I.classList.add("kp-full-page-embedded","open"),I.setAttribute("role","dialog"),p||I.setAttribute("aria-modal","true"),I.setAttribute("aria-label",`${t.title} page`);let Re=o("div","kp-full-page-shell"),ye=o("div","kp-full-page-header"),Ze=o("div","kp-full-page-brand"),Xt=o("div","kp-full-page-brand-mark","\u2726"),Jt=o("div","kp-full-page-brand-text",t.title),se=o("button","kp-full-page-menu-btn");se.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',se.type="button",se.setAttribute("aria-label","Toggle sidebar"),se.addEventListener("click",()=>{ie.classList.toggle("open")}),Ze.append(se,Xt,Jt);let et=o("div","kp-full-page-header-actions"),Gt=o("div","kp-full-page-badge",n.assistantBadge),ve=o("button","kp-full-page-close","\xD7");if(ve.type="button",ve.setAttribute("aria-label",n.closeAssistantPage),et.append(Gt,ve),ye.append(Ze,et),!t.embedded.showHeader){ye.classList.add("kp-hidden");let s=o("div","kp-floating-menu-wrap"),l=o("button","kp-floating-menu-btn");l.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',l.type="button",l.setAttribute("aria-label","Toggle sidebar"),l.addEventListener("click",()=>{ie.classList.toggle("open")}),s.append(l),Re.insertBefore(s,ye.nextSibling)}let tt=o("div","kp-full-page-content"),ie=o("aside","kp-full-page-sidebar"),ze=o("button","kp-full-page-new-chat",`+ ${n.newChat}`);ze.type="button";let nt=o("div","kp-full-page-search"),re=o("input","kp-full-page-search-input");re.type="search",re.placeholder=n.searchChat;let Qt=o("span","kp-full-page-search-icon","\u2315");nt.append(re,Qt);let Zt=o("div","kp-full-page-section-label",n.recentActivity),at=o("div","kp-full-page-recent-list"),en=o("div","kp-full-page-section-label",n.pinnedCollections),ot=o("div","kp-full-page-pinned-list");ie.append(ze,nt,Zt,at,en,ot);let st=o("main","kp-full-page-main"),it=o("section","kp-full-page-panel"),$e=o("div","kp-full-page-body"),Ue=o("div","kp-full-page-hero"),rt=o("div","kp-full-page-hero-badge");rt.innerHTML=['<span class="kp-star-cluster kp-star-cluster-static" aria-hidden="true">','<span class="kp-star orbit-a">\u2726</span>','<span class="kp-star orbit-b">\u2726</span>','<span class="kp-star orbit-c">\u2726</span>','<span class="kp-star main">\u2726</span>',"</span>"].join("");let tn=o("div","kp-full-page-hero-text",t.welcomeMessage);Ue.append(rt,tn);let lt=o("div","kp-suggestions kp-full-page-suggestions");$e.append(Ue,lt);let pt=o("div","kp-full-page-footer"),He=o("form","kp-form kp-full-page-form"),R=o("input","kp-input kp-full-page-input");R.type="text",R.autocomplete="off",R.placeholder=t.inputPlaceholder,R.setAttribute("aria-label",t.inputPlaceholder);let Me=o("button","kp-send kp-full-page-send","\u279C");Me.type="submit",Me.setAttribute("aria-label",n.send);let nn=o("div","kp-note kp-full-page-note",n.answersBasedOnPermissions);He.append(R,Me),pt.append(He,nn),it.append($e,pt),st.appendChild(it);let we=o("aside","kp-source-panel"),dt=o("div","kp-source-panel-header"),ct=o("div","kp-source-panel-title-wrap"),ut=o("div","kp-source-panel-title",n.allSourcesUsed),an=o("div","kp-source-panel-subtitle",n.documentsAndReferences);ct.append(ut,an);let Ce=o("button","kp-source-panel-close","\xD7");Ce.type="button",Ce.setAttribute("aria-label",n.closeSourcesPanel),dt.append(ct,Ce);let le=o("div","kp-source-panel-list"),on=o("div","kp-source-panel-empty",n.noSources);le.appendChild(on),we.append(dt,le),tt.append(ie,st,we),Re.append(ye,tt),I.appendChild(Re),c.appendChild(I);let pe=o("div","kp-citation-overlay");c.appendChild(pe);let S={body:$e,input:R,suggestions:lt,hero:Ue,kind:"full-page"},j=()=>({...t,getAccessToken:i.accessTokenProvider}),gt=async()=>{let s=null,l=null;if(t.userInfo)try{let h=await t.userInfo();h&&(s=[h.firstName,h.lastName].filter(Boolean).join(" ")||null,l=h.avatar??null)}catch{}if((!s||!l)&&t.getUserContext)try{let h=await t.getUserContext();h&&(s||(s=[h.firstName,h.lastName].filter(Boolean).join(" ")||h.displayName?.trim()||h.email?.trim()||h.userId?.trim()||null),l||(l=h.avatarUrl??null))}catch{}return{displayName:s,avatarUrl:l}},G=s=>{let l=Ve(s)??n.untitledSource,h=(s.text||"").trim(),w=h,A=h.split(`
`);if(A.length>1&&A[0]){let B=A[0].trim().replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();B&&(B===l||l.indexOf(B)!==-1||B.indexOf(l)!==-1)&&(w=A.slice(1).join(`
`).trim())}let b=_n(s.sourceDocument),y=[];(s.pageNumber||s.pageNumber===0)&&y.push(`
        <div class="meta-item">
          <span class="meta-label">Page Number</span>
          <span class="meta-value">${s.pageNumber}</span>
        </div>
      `),typeof s.score=="number"&&y.push(`
        <div class="meta-item">
          <span class="meta-label">Relevance Score</span>
          <span class="meta-value">${s.score.toFixed(2)}</span>
        </div>
      `),s.sheetName&&y.push(`
        <div class="meta-item">
          <span class="meta-label">Sheet Name</span>
          <span class="meta-value">${O(s.sheetName)}</span>
        </div>
      `),(s.rowNumber||s.rowNumber===0)&&y.push(`
        <div class="meta-item">
          <span class="meta-label">Row Number</span>
          <span class="meta-value">${s.rowNumber}</span>
        </div>
      `),s.knowledgeName&&y.push(`
        <div class="meta-item">
          <span class="meta-label">Database Source</span>
          <span class="meta-value">${O(s.knowledgeName)}</span>
        </div>
      `),y.push(`
      <div class="meta-item">
        <span class="meta-label">Classification</span>
        <span class="meta-value">Uploaded Knowledge</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Confidentiality</span>
        <span class="meta-value" style="color: #0f766e;">Public</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Language</span>
        <span class="meta-value">English</span>
      </div>
    `);let ee=y.join(""),te=w?O(w):"No text snippet available for this citation.",hn=`
      <div class="doc-badge-wrapper">
        <div class="doc-icon">\u{1F4C4}</div>
        <div class="doc-badge-info">
          <h2>Document Citation</h2>
        </div>
      </div>
      
      <div class="doc-title-section">
        <h1>${O(l)}</h1>
        <div class="doc-source-type">Uploaded Knowledge Resource</div>
      </div>
      
      <div class="section-divider"></div>
      
      <div>
        <h3 class="meta-section-title">Retrieved Passage Snippet</h3>
        <div class="summary-box">${te}</div>
      </div>
      
      <div class="section-divider"></div>
      
      <div>
        <h3 class="meta-section-title">Metadata & Classification</h3>
        <div class="meta-list">
          ${ee}
        </div>
      </div>
    `,Oe="";b?Oe=`<iframe src="${b}" title="Document Viewer"></iframe>`:Oe=`
        <div class="viewer-toolbar">
          <div class="toolbar-left">${O(l)}</div>
          <div class="toolbar-center">
            <button class="toolbar-btn zoom-out-btn">\u2212</button>
            <span class="page-indicator">Page ${s.pageNumber||1}</span>
            <button class="toolbar-btn zoom-in-btn">+</button>
          </div>
          <div class="toolbar-right">
            <button class="toolbar-btn print-btn">\u{1F5A8}\uFE0F Print</button>
          </div>
        </div>
        <div class="viewer-body">
          <div class="document-sheet">
            <div class="sheet-header">
              <span>${O(l)}</span>
              <span>Page ${s.pageNumber||1}</span>
            </div>
            <div class="sheet-content">${O(h||"No document content retrieved.")}</div>
            <div class="sheet-footer">
              <span>Confidentiality: Public</span>
              <span>Knowledge Platform CB</span>
            </div>
          </div>
        </div>
      `,pe.textContent="";let yt=o("header","kp-citation-overlay-header"),vt=o("div","kp-citation-overlay-brand");vt.innerHTML=`
      <span class="kp-citation-overlay-brand-logo">\u2726</span>
      <span>Knowledge Assistant Document Viewer</span>
    `;let Ae=o("button","kp-citation-overlay-close","\xD7");Ae.type="button",Ae.setAttribute("aria-label","Close document preview"),Ae.addEventListener("click",()=>{pe.classList.remove("open")}),yt.append(vt,Ae);let wt=o("div","kp-citation-overlay-content"),Ct=o("aside","kp-citation-overlay-metadata-panel");Ct.innerHTML=hn;let ne=o("main","kp-citation-overlay-viewer-panel");if(ne.innerHTML=Oe,wt.append(Ct,ne),pe.append(yt,wt),!b){let F=1,B=ne.querySelector(".document-sheet"),mn=ne.querySelector(".zoom-in-btn"),bn=ne.querySelector(".zoom-out-btn"),kn=ne.querySelector(".print-btn");B&&(mn?.addEventListener("click",()=>{F<1.5&&(F+=.1,B.style.transform=`scale(${F})`)}),bn?.addEventListener("click",()=>{F>.6&&(F-=.1,B.style.transform=`scale(${F})`)}),kn?.addEventListener("click",()=>{window.print()}))}pe.classList.add("open")},de=(s,l)=>{if(i.sourcePanelOpen=!0,i.sourcePanelTitle=l??n.allSourcesUsed,ut.textContent=i.sourcePanelTitle,we.classList.add("open"),le.textContent="",s.length===0){le.appendChild(o("div","kp-source-panel-empty",n.noSources));return}for(let h of s)le.appendChild(Wn(h,n,()=>{G(h)}))},Q=()=>{i.sourcePanelOpen=!1,i.sourcePanelTitle=null,we.classList.remove("open")};ae(z,t.initialSuggestions,async s=>{await H(s,z)}),ae(S,t.initialSuggestions,async s=>{await H(s,S)}),_(),Le(),p&&($(),t.rag.loadHistoryOnOpen&&Z(S,i.chatId));function Ne(){if(p){i.fullPageOpen=!0,I.classList.add("open");return}i.open||(i.open=!0,i.fullPageOpen=!1,N(),I.classList.remove("open"),u.classList.add("hidden"),m.classList.add("visible"),f.classList.add("open"),t.onOpen?.(),t.rag.loadHistoryOnOpen&&Be.loadHistory(),queueMicrotask(()=>U.focus()))}function W(){if(p){Q();return}i.open&&(M(),N(),i.open=!1,u.classList.remove("hidden"),m.classList.remove("visible"),f.classList.remove("open"),t.onClose?.())}async function H(s,l){let h=s.trim();if(!h)return;l.input.value="";try{await dn(h)}catch(b){let y=X(t,b);fe(l.body,"bot",`${n.unableToCreateChat}: ${y.message}`,{strings:n,view:l,userName:null,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:()=>{},onDislike:()=>{}});return}Fe(l);let w=await gt();fe(l.body,"user",h,{strings:n,view:l,userName:w.displayName,userAvatarUrl:w.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:()=>{},onDislike:()=>{}}),l.body.scrollTop=l.body.scrollHeight;let A=o("div","kp-loading",n.thinking);l.body.appendChild(A),l.body.scrollTop=l.body.scrollHeight;try{let b=await Pn(t),y=await Pt(j(),{message:h,chatId:i.chatId,knowledgeNames:b,...t.rag.enableReferences!==void 0?{enableReferences:t.rag.enableReferences}:{}});A.isConnected&&A.remove(),fe(l.body,"bot",y.answer,{strings:n,view:l,userName:w.displayName,userAvatarUrl:w.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,citations:y.citations??[],onShowSources:de,onShowCitation:G,onLike:()=>{ue(t,i.chatId,y.answer,!0).catch(console.error)},onDislike:()=>{ue(t,i.chatId,y.answer,!1).catch(console.error)}}),i.historyLoadedChatId=null,await $(),y.suggestions?.length&&ae(l,y.suggestions,async ee=>{await H(ee,l)})}catch(b){let y=X(t,b);A.isConnected&&A.remove(),fe(l.body,"bot",`${n.requestFailed}: ${y.message}`,{strings:n,view:l,userName:w.displayName,userAvatarUrl:w.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:()=>{},onDislike:()=>{}})}}async function ft(s){let l=i.fullPageOpen?S:z;await H(s,l)}async function sn(){if(p){i.fullPageOpen=!0,I.classList.add("open"),await $(),await Z(S,i.chatId),queueMicrotask(()=>R.focus());return}i.fullPageOpen=!0,i.open=!1,M(),N(),f.classList.remove("open"),m.classList.remove("visible"),u.classList.add("hidden"),I.classList.add("open"),await $(),await Z(S,i.chatId),queueMicrotask(()=>R.focus())}function ht(){if(p){Q();return}i.fullPageOpen&&(i.fullPageOpen=!1,I.classList.remove("open"),u.classList.remove("hidden"),Q())}function rn(){i.menuOpen=!0,C.classList.add("open"),L.classList.add("open")}function M(){i.menuOpen=!1,C.classList.remove("open"),L.classList.remove("open")}function ln(){i.chatId=Pe(t),i.historyLoadedChatId=null,N(),ge(z),ae(z,t.initialSuggestions,async s=>{await H(s,z)}),M()}async function pn(){i.chatId=Pe(t),i.historyLoadedChatId=null,ge(S),Q(),ae(S,t.initialSuggestions,async s=>{await H(s,S)}),_()}async function $(){if(!t.endpoints.listChats)return _(),Le(),[];i.loadingChats=!0,_(),Le();try{let s=await Tt(j());return i.chats=s,s}catch(s){return X(t,s),i.chats}finally{i.loadingChats=!1,_(),Le()}}async function dn(s){!t.endpoints.listChats&&!t.endpoints.createChat||i.chats.some(l=>l.chatId===i.chatId)||await Et(j(),i.chatId,s?Rn(s,n.newChat):void 0)}async function cn(s){i.chatId=s,i.historyLoadedChatId=null,await Z(S,s),_()}async function un(s){i.chatId=s,i.historyLoadedChatId=null,N(),await Z(z,s)}async function gn(){M(),await $(),i.myChatsOpen=!0,f.classList.add("kp-sheet-open"),be.classList.add("open")}function N(){i.myChatsOpen=!1,f.classList.remove("kp-sheet-open"),be.classList.remove("open")}function fn(s,l){let h=o("div","kp-overlay visible"),w=o("div","kp-rename-dialog");w.style.cssText="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:320px; background:var(--kp-panel-background); box-shadow:var(--kp-shadow); padding:24px; border-radius:16px; opacity:1; pointer-events:auto; z-index: 10000; display:flex; flex-direction:column; height:min-content; box-sizing:border-box;";let A=o("h3","kp-source-preview-title");A.textContent=n.renamePrompt,A.style.marginBottom="16px",A.style.fontSize="16px";let b=o("input","kp-input");b.type="text",b.value=s.title,b.style.border="1px solid var(--kp-border-color)",b.style.padding="10px",b.style.borderRadius="8px",b.style.width="100%",b.style.marginBottom="20px",b.style.flex="none",b.style.height="40px";let y=o("div","kp-message-actions");y.style.justifyContent="flex-end",y.style.gap="8px";let ee=o("button","kp-message-action",n.close);ee.addEventListener("click",()=>h.remove());let te=o("button","kp-message-action active","Save");te.addEventListener("click",async()=>{te.disabled=!0,te.textContent="...",await l(b.value),h.remove()}),y.append(ee,te),w.append(A,b,y),h.appendChild(w),c.appendChild(h),b.focus()}async function mt(s){t.endpoints.updateChat&&fn(s,async l=>{let h=l.trim();if(!(!h||h===s.title))try{await We(j(),s.chatId,{title:h}),await $()}catch(w){X(t,w)}})}async function bt(s){if(t.endpoints.deleteChat)try{await It(j(),s.chatId),i.chatId===s.chatId&&(i.chatId=Pe(t),i.historyLoadedChatId=null,ge(z),ge(S)),await $()}catch(l){X(t,l)}}function _(){Ht(at,ot,i,n,async s=>{await cn(s.chatId),ie.classList.remove("open")},async s=>{await kt(s)},async s=>{await mt(s)},async s=>{await bt(s)})}function Le(){Ht(Ge,Qe,i,n,async s=>{await un(s.chatId)},async s=>{await kt(s)},async s=>{await mt(s)},async s=>{await bt(s)})}async function kt(s){if(t.endpoints.updateChat)try{await We(j(),s.chatId,{pinned:!s.pinned}),await $()}catch(l){X(t,l)}}async function Z(s,l){ge(s),ae(s,t.initialSuggestions,async A=>{await H(A,s)});let h=o("div","kp-message kp-message-ai");h.innerHTML='<div class="kp-message-bubble"><div class="kp-typing-indicator"><span></span><span></span><span></span></div></div>',Fe(s),s.body.appendChild(h);let w=await St(j(),l);if(h.remove(),w.length>0){Fe(s),Bt(s.body,s.hero,s.suggestions);let A=await gt();In(s.body,w,{strings:n,view:s,userName:A.displayName,userAvatarUrl:A.avatarUrl,assistantAvatarUrl:t.assistantAvatarUrl,onShowSources:de,onShowCitation:G,onLike:b=>{ue(t,l,b,!0).catch(console.error)},onDislike:b=>{ue(t,l,b,!1).catch(console.error)}})}return i.historyLoadedChatId=l,w}let Be={open:Ne,close:W,toggle(){if(p){Ne();return}if(i.open){W();return}Ne()},destroy(){if(document.removeEventListener("keydown",xt),d.remove(),p){let s=!1;document.querySelectorAll("[data-chat-widget-host]").forEach(l=>{let h=l.shadowRoot;h&&h.querySelector(".kp-chat-widget-embedded")&&(s=!0)}),s||Nt(!1)}},sendMessage:ft,setAccessTokenProvider(s){i.accessTokenProvider=s},getChatId(){return i.chatId},loadChats(){return $()},async loadHistory(){let s=i.fullPageOpen?S:z;return Z(s,i.chatId)}};u.addEventListener("click",()=>Be.toggle()),he.addEventListener("click",W),m.addEventListener("click",W),Ce.addEventListener("click",Q),ke.addEventListener("click",N),xe.addEventListener("click",N),C.addEventListener("click",s=>{if(s.stopPropagation(),!i.menuOpen){rn();return}M()}),x.addEventListener("click",ln),T.addEventListener("click",async()=>{await gn()}),E.addEventListener("click",()=>{if(M(),t.onOpenAssistantPage){W(),t.onOpenAssistantPage();return}if(t.assistantPageUrl){W(),window.location.href=t.assistantPageUrl;return}sn()}),ve.addEventListener("click",ht),ze.addEventListener("click",()=>{pn(),queueMicrotask(()=>R.focus())}),re.addEventListener("input",()=>{i.chatSearchTerm=re.value.trim().toLowerCase(),_()}),f.addEventListener("click",s=>{let l=s.target;if(!(l instanceof Element)||!l.closest(".kp-chat-actions")){for(let h of Array.from(g.querySelectorAll(".kp-chat-actions.open")))h.classList.remove("open");for(let h of Array.from(g.querySelectorAll(".kp-full-page-chat-item.menu-open")))h.classList.remove("menu-open")}i.menuOpen&&!L.contains(l)&&!C.contains(l)&&M(),s.stopPropagation()}),g.addEventListener("click",s=>{let l=s.target;if(i.menuOpen&&l instanceof Node&&!L.contains(l)&&!C.contains(l)&&M(),l instanceof Element&&!l.closest(".kp-chat-actions")){for(let h of Array.from(g.querySelectorAll(".kp-chat-actions.open")))h.classList.remove("open");for(let h of Array.from(g.querySelectorAll(".kp-full-page-chat-item.menu-open")))h.classList.remove("menu-open")}}),Ee.addEventListener("submit",async s=>{s.preventDefault(),await ft(U.value)}),He.addEventListener("submit",async s=>{s.preventDefault(),await H(R.value,S)});function xt(s){if(s.key==="Escape"){if(i.sourcePanelOpen){Q();return}if(i.myChatsOpen){N();return}if(i.fullPageOpen){if(p)return;ht();return}i.open&&W()}}return document.addEventListener("keydown",xt),Be}async function Pn(e){if(e.rag.getKnowledgeNames){let t=await e.rag.getKnowledgeNames();return Array.isArray(t)?t.filter(Boolean):[]}return(e.rag.knowledgeNames??[]).filter(Boolean)}function Pe(e){return e.rag.chatId?.trim()?e.rag.chatId:e.rag.chatIdFactory?e.rag.chatIdFactory():typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`kp-chat-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}function fe(e,t,a,n){let r=t==="bot"?Hn(a,n.citations??[]):{displayText:a,citations:n.citations??[]},p=o("div",`kp-message-row ${t}`),i=Tn(t==="bot"?n.strings.assistantAvatar:n.userName??n.strings.userAvatar,t,t==="bot"?n.assistantAvatarUrl:n.userAvatarUrl),d=o("div",`kp-bubble ${t}`),g=o("div","kp-bubble-content");Fn(g,r.displayText),d.appendChild(g);let c=r.citations;if(c.length){let m=o("div","kp-meta",n.strings.citationsAttached(c.length));d.appendChild(m);let u=o("div","kp-source-preview"),f=o("div","kp-source-preview-title",n.strings.sourcesUsed),k=o("div","kp-source-preview-list");for(let C of c.slice(0,2)){let L=Dn(C,n.strings);L.addEventListener("click",async()=>{n.onShowCitation(C)}),k.appendChild(L)}let v=jn(n.strings);v.addEventListener("click",async()=>{n.onShowSources(c,n.strings.allSourcesUsed)}),k.appendChild(v),u.append(f,k),d.appendChild(u)}return t==="bot"&&d.appendChild(Sn(r.displayText,n.strings,n.onLike,n.onDislike,n.initialFeedback)),t==="user"?p.append(d,i):p.append(i,d),e.appendChild(p),e.scrollTop=e.scrollHeight,p}function Sn(e,t,a,n,r){let p=o("div","kp-message-actions"),i='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',d='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',g='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',c='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>',m=o("button","kp-message-action");m.innerHTML=i,m.type="button",m.setAttribute("title",t.copy),m.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e),m.innerHTML=d,window.setTimeout(()=>{m.innerHTML=i},1200)}catch{m.innerHTML=i}});let u=o("button","kp-message-action");u.innerHTML=g,u.type="button",u.setAttribute("aria-label",t.helpful),r===!0&&u.classList.add("active"),u.addEventListener("click",()=>{u.classList.toggle("active"),f.classList.remove("active"),u.classList.contains("active")&&a&&a()});let f=o("button","kp-message-action");return f.innerHTML=c,f.type="button",f.setAttribute("aria-label",t.notHelpful),r===!1&&f.classList.add("active"),f.addEventListener("click",()=>{f.classList.toggle("active"),u.classList.remove("active"),f.classList.contains("active")&&n&&n()}),p.append(m,u,f),p}function Tn(e,t,a){let n=o("div",`kp-avatar ${t}`);if(a){let r=o("img","kp-avatar-img");r.src=a,r.alt=e,r.style.width="100%",r.style.height="100%",r.style.objectFit="cover",r.style.borderRadius="50%",n.appendChild(r)}else{let r=t==="bot"?"\u2726":Un(e);n.textContent=r}return n.setAttribute("aria-hidden","true"),n}function En(e,t,a){e.textContent="";for(let n of t){let r=o("button","kp-suggestion",n);r.type="button",r.addEventListener("click",async()=>{await a(n)}),e.appendChild(r)}}function ae(e,t,a){En(e.suggestions,t,async n=>{e.input.value=n,await a(n)})}function Bt(e,t,a){let n=new Set([t,a]);for(let r of Array.from(e.children))n.has(r)||r.remove()}function Fe(e){e.body.classList.add("kp-conversation-active"),e.hero.remove(),e.suggestions.remove()}function ge(e){e.body.classList.remove("kp-conversation-active"),e.hero.isConnected||e.body.prepend(e.hero),e.suggestions.isConnected||e.body.appendChild(e.suggestions),Bt(e.body,e.hero,e.suggestions),e.input.value=""}function In(e,t,a){for(let n of t)fe(e,n.role==="assistant"?"bot":"user",n.text,{...a,...n.citations!==void 0?{citations:n.citations}:{},...n.isLike!==void 0?{initialFeedback:n.isLike}:{},onLike:()=>{a.onLike&&a.onLike(n.text)},onDislike:()=>{a.onDislike&&a.onDislike(n.text)}})}function Ht(e,t,a,n,r,p,i,d){if(e.textContent="",t.textContent="",a.loadingChats){e.appendChild(o("div","kp-full-page-empty",n.loadingChats));return}let g=a.chats.filter(c=>a.chatSearchTerm?c.title.toLowerCase().includes(a.chatSearchTerm):!0);if(g.length>0){let c=g.filter(u=>u.pinned),m=g.filter(u=>!u.pinned).slice(0,8);Mt(e,m,a.chatId,n,r,p,i,d),Mt(t,c,a.chatId,n,r,p,i,d),m.length===0&&e.appendChild(o("div","kp-full-page-empty",n.noRecentChats)),c.length===0&&t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats));return}e.appendChild(o("div","kp-full-page-empty",n.noChats)),t.appendChild(o("div","kp-full-page-empty",n.noPinnedChats))}function Mt(e,t,a,n,r,p,i,d){for(let g of t){let c=o("div",`kp-full-page-item kp-full-page-chat-item${g.chatId===a?" active":""}`),m=o("span","kp-full-page-item-title",g.title),u=o("div","kp-chat-actions"),f=o("button","kp-chat-actions-trigger","\u22EF");f.type="button",f.setAttribute("aria-label",n.chatActions);let k=o("div","kp-chat-actions-menu"),v=o("button","kp-chat-actions-item",g.pinned?n.unpinChat:n.pinChat);v.type="button",v.addEventListener("click",async x=>{x.stopPropagation(),await p(g)});let C=o("button","kp-chat-actions-item",n.renameChat);C.type="button",C.addEventListener("click",async x=>{x.stopPropagation(),await i(g)});let L=o("button","kp-chat-actions-item",n.deleteChat);L.type="button",L.addEventListener("click",async x=>{x.stopPropagation(),await d(g)}),k.append(v,C,L),u.append(f,k),f.addEventListener("click",x=>{x.stopPropagation();let T=u.classList.contains("open");for(let E of Array.from(e.querySelectorAll(".kp-chat-actions.open")))E.classList.remove("open");for(let E of Array.from(e.querySelectorAll(".kp-full-page-chat-item.menu-open")))E.classList.remove("menu-open");T||(u.classList.add("open"),c.classList.add("menu-open"))}),c.append(m,u),c.setAttribute("role","button"),c.tabIndex=0,c.addEventListener("click",async()=>{await r(g)}),c.addEventListener("keydown",async x=>{(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),await r(g))}),c.addEventListener("blur",()=>{u.classList.remove("open"),c.classList.remove("menu-open")}),e.appendChild(c)}}function Rn(e,t){return e.trim().slice(0,60)||t}function qe(e){return e.toLowerCase().split("-")[0]||"en"}function zn(e){let t=Ut.en;return Ut[qe(e)]??t}function $n(e){return["ar","fa","he","ur"].includes(qe(e))}function Un(e){let t=e.split(/\s+/).filter(Boolean).slice(0,2);return t.length===0?"U":t.map(a=>a[0]?.toUpperCase()??"").join("")}function Ve(e){if(e.knowledgeName?.trim())return e.knowledgeName.trim();if(e.text){let t=e.text.split(`
`)[0]?.trim();if(t){let a=t.replace(/\s*\|\s*Page\s*\d+\s*$/i,"").trim();if(a)return a}}if(e.sourceDocument&&/^https?:\/\//i.test(e.sourceDocument)){try{let t=new URL(e.sourceDocument),a=decodeURIComponent(t.pathname),n=a.substring(a.lastIndexOf("/")+1);if(n)return n}catch{}return e.sourceDocument}return e.sourceDocument?.trim()&&!/^c\d+$/i.test(e.sourceDocument)?e.sourceDocument.trim():null}function Hn(e,t){let a=Mn(e);return{displayText:a.displayText,citations:t.length>0?On(t,a.citations):a.citations}}function Mn(e){let a=Ot(e).split(`
`),n=-1;for(let g=0;g<a.length;g+=1)/^#{0,6}\s*References\s*$/i.test(a[g]?.trim()??"")&&(n=g);if(n===-1)return{displayText:e,citations:[]};let r=a.slice(0,n).join(`
`).trimEnd(),p=a.slice(n+1).join(`
`).trim(),d=Nn(p).map(g=>Bn(g)).filter(g=>!!g);return{displayText:r,citations:d}}function Nn(e){let t=[],a="";for(let n of e.split(`
`)){let r=n.trim();if(r){if(/^\d+\.\s+/.test(r)){a&&t.push(a.trim()),a=r.replace(/^\d+\.\s+/,"");continue}a&&(a=`${a} ${r}`)}}return a&&t.push(a.trim()),t}function Bn(e){let t=e.match(/https?:\/\/\S+/i);if(!t)return null;let a=t[0],n=e.slice(0,t.index).replace(/[.\s]+$/,"").trim();return{sourceDocument:a,knowledgeName:n||a}}function On(e,t){let a=[],n=new Set;for(let r of[...e,...t]){let p=`${r.knowledgeName??""}::${r.sourceDocument??""}`;n.has(p)||(n.add(p),a.push(r))}return a}function Dn(e,t){let a=o("button","kp-source-chip");a.type="button",a.setAttribute("aria-label",t.openSource);let n=o("span","kp-source-thumb");n.textContent="\u2726";let r=o("span","kp-source-chip-label",Ve(e)??t.untitledSource);return a.append(n,r),a}function jn(e){let t=o("button","kp-source-chip kp-source-chip-more");t.type="button";let a=o("span","kp-source-thumb-stack");for(let r=0;r<3;r+=1){let p=o("span","kp-source-thumb stacked");p.textContent="\u2726",a.appendChild(p)}let n=o("span","kp-source-chip-label",e.showAll);return t.append(a,n),t}function Wn(e,t,a){let n=o("button","kp-source-card");n.type="button",n.setAttribute("aria-label",t.openSource),n.addEventListener("click",a);let r=o("div","kp-source-card-media"),p=o("span","kp-source-thumb kp-source-thumb-large");p.textContent="\u2726";let i=o("div","kp-source-card-title",Ve(e)??t.untitledSource),d=o("div","kp-source-card-meta"),g=[];return typeof e.score=="number"&&g.push(`${t.sourceScore}: ${e.score.toFixed(2)}`),typeof e.pageNumber=="number"&&g.push(`${t.sourcePage}: ${e.pageNumber}`),e.sheetName&&g.push(`${t.sourceSheet}: ${e.sheetName}`),typeof e.rowNumber=="number"&&g.push(`${t.sourceRow}: ${e.rowNumber}`),e.knowledgeName&&g.push(`${t.sourceKnowledge}: ${e.knowledgeName}`),d.textContent=g.join(" \u2022 "),r.appendChild(p),n.append(r,i,d),n}function _n(e){return e&&e.trim()||null}function Fn(e,t){e.innerHTML=qn(Ot(t))}function Ot(e){return e.replace(/\r\n/g,`
`)}function qn(e){return e.split(/\n{2,}/).map(a=>a.trim()).filter(Boolean).map(Vn).join("")}function Vn(e){let t=e.split(`
`).map(n=>n.trimEnd());if(t.every(n=>/^\s*\|.*\|\s*$/.test(n))&&t.length>=2)return Kn(t);if(t.every(n=>/^\d+\.\s+/.test(n)))return`<ol>${t.map(n=>`<li>${oe(n.replace(/^\d+\.\s+/,""))}</li>`).join("")}</ol>`;if(t.every(n=>/^[-*]\s+/.test(n)))return`<ul>${t.map(n=>`<li>${oe(n.replace(/^[-*]\s+/,""))}</li>`).join("")}</ul>`;let a=t[0]?.match(/^(#{1,6})\s+(.*)$/);if(a){let n=a[1]??"#",r=a[2]??"",p=n.length;return`<h${p}>${oe(r)}</h${p}>`}return`<p>${t.map(n=>oe(n)).join("<br>")}</p>`}function Kn(e){let t=e.filter((i,d)=>!(d===1&&/^\s*\|?(\s*:?-{3,}:?\s*\|)+\s*$/.test(i))).map(i=>Yn(i));if(t.length===0)return"";let a=t[0]??[],n=t.slice(1),r=`<thead><tr>${a.map(i=>`<th>${oe(i)}</th>`).join("")}</tr></thead>`,p=n.length?`<tbody>${n.map(i=>`<tr>${i.map(d=>`<td>${oe(d)}</td>`).join("")}</tr>`).join("")}</tbody>`:"";return`<div class="kp-table-wrap"><table>${r}${p}</table></div>`}function Yn(e){return e.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(t=>t.trim())}function oe(e){let t=O(e);return t=t.replace(/&lt;br\s*\/?&gt;/gi,"<br>"),t=t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>'),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t=t.replace(/\*([^*]+)\*/g,"<em>$1</em>"),t}function O(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Nt(e){typeof document>"u"||document.querySelectorAll("[data-chat-widget-host]").forEach(t=>{let a=t.shadowRoot;if(a){let n=a.querySelector(".kp-chat-widget");n&&!n.classList.contains("kp-chat-widget-embedded")&&(t.style.display=e?"none":"")}})}var Dt="0.1.0",jt=Se,Wt={init:jt,createChatWidget:Se,version:Dt};typeof window<"u"&&(window.ChatWidget=Wt);return Ln(Xn);})();
//# sourceMappingURL=browser.iife.js.map