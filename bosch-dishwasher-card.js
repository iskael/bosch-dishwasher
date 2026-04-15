var Pe=Object.defineProperty;var Te=(o,e,t)=>e in o?Pe(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var O=(o,e,t)=>Te(o,typeof e!="symbol"?e+"":e,t);var j=globalThis,F=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,q=Symbol(),ce=new WeakMap,N=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(F&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=ce.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ce.set(t,e))}return e}toString(){return this.cssText}},de=o=>new N(typeof o=="string"?o:o+"",void 0,q),V=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new N(t,o,q)},he=(o,e)=>{if(F)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=j.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,o.appendChild(s)}},Y=F?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return de(t)})(o):o;var{is:Re,defineProperty:Ue,getOwnPropertyDescriptor:Ke,getOwnPropertyNames:Le,getOwnPropertySymbols:Me,getPrototypeOf:Ie}=Object,y=globalThis,pe=y.trustedTypes,De=pe?pe.emptyScript:"",He=y.reactiveElementPolyfillSupport,P=(o,e)=>o,J={toAttribute(o,e){switch(e){case Boolean:o=o?De:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},ue=(o,e)=>!Re(o,e),_e={attribute:!0,type:String,converter:J,reflect:!1,useDefault:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),y.litPropertyMetadata??(y.litPropertyMetadata=new WeakMap);var m=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_e){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Ue(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:r}=Ke(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:i,set(n){let d=i?.call(this);r?.call(this,n),this.requestUpdate(e,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_e}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;let e=Ie(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){let t=this.properties,s=[...Le(t),...Me(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(Y(i))}else e!==void 0&&t.push(Y(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return he(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:J).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:J;this._$Em=i;let d=n.fromAttribute(t,r.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(e!==void 0){let n=this.constructor;if(i===!1&&(r=this[e]),s??(s=n.getPropertyOptions(e)),!((s.hasChanged??ue)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??t??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:n}=r,d=this[i];n!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,r,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};m.elementStyles=[],m.shadowRootOptions={mode:"open"},m[P("elementProperties")]=new Map,m[P("finalized")]=new Map,He?.({ReactiveElement:m}),(y.reactiveElementVersions??(y.reactiveElementVersions=[])).push("2.1.2");var R=globalThis,ge=o=>o,W=R.trustedTypes,fe=W?W.createPolicy("lit-html",{createHTML:o=>o}):void 0,we="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,xe="?"+$,ze=`<${xe}>`,A=document,U=()=>A.createComment(""),K=o=>o===null||typeof o!="object"&&typeof o!="function",ie=Array.isArray,Be=o=>ie(o)||typeof o?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,me=/-->/g,be=/>/g,w=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ye=/'/g,$e=/"/g,Ae=/^(?:script|style|textarea|title)$/i,oe=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),l=oe(1),Qe=oe(2),Xe=oe(3),S=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),ve=new WeakMap,x=A.createTreeWalker(A,129);function Se(o,e){if(!ie(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return fe!==void 0?fe.createHTML(e):e}var je=(o,e)=>{let t=o.length-1,s=[],i,r=e===2?"<svg>":e===3?"<math>":"",n=T;for(let d=0;d<t;d++){let a=o[d],h,p,c=-1,u=0;for(;u<a.length&&(n.lastIndex=u,p=n.exec(a),p!==null);)u=n.lastIndex,n===T?p[1]==="!--"?n=me:p[1]!==void 0?n=be:p[2]!==void 0?(Ae.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=w):p[3]!==void 0&&(n=w):n===w?p[0]===">"?(n=i??T,c=-1):p[1]===void 0?c=-2:(c=n.lastIndex-p[2].length,h=p[1],n=p[3]===void 0?w:p[3]==='"'?$e:ye):n===$e||n===ye?n=w:n===me||n===be?n=T:(n=w,i=void 0);let f=n===w&&o[d+1].startsWith("/>")?" ":"";r+=n===T?a+ze:c>=0?(s.push(h),a.slice(0,c)+we+a.slice(c)+$+f):a+$+(c===-2?d:f)}return[Se(o,r+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},L=class o{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,n=0,d=e.length-1,a=this.parts,[h,p]=je(e,t);if(this.el=o.createElement(h,s),x.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=x.nextNode())!==null&&a.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(we)){let u=p[n++],f=i.getAttribute(c).split($),v=/([.?@])?(.*)/.exec(u);a.push({type:1,index:r,name:v[2],strings:f,ctor:v[1]==="."?Z:v[1]==="?"?ee:v[1]==="@"?te:k}),i.removeAttribute(c)}else c.startsWith($)&&(a.push({type:6,index:r}),i.removeAttribute(c));if(Ae.test(i.tagName)){let c=i.textContent.split($),u=c.length-1;if(u>0){i.textContent=W?W.emptyScript:"";for(let f=0;f<u;f++)i.append(c[f],U()),x.nextNode(),a.push({type:2,index:++r});i.append(c[u],U())}}}else if(i.nodeType===8)if(i.data===xe)a.push({type:2,index:r});else{let c=-1;for(;(c=i.data.indexOf($,c+1))!==-1;)a.push({type:7,index:r}),c+=$.length-1}r++}}static createElement(e,t){let s=A.createElement("template");return s.innerHTML=e,s}};function E(o,e,t=o,s){if(e===S)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,r=K(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(o),i._$AT(o,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=i:t._$Cl=i),i!==void 0&&(e=E(o,i._$AS(o,e.values),i,s)),e}var X=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??A).importNode(t,!0);x.currentNode=i;let r=x.nextNode(),n=0,d=0,a=s[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new M(r,r.nextSibling,this,e):a.type===1?h=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(h=new se(r,this,e)),this._$AV.push(h),a=s[++d]}n!==a?.index&&(r=x.nextNode(),n++)}return x.currentNode=A,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},M=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),K(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==S&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Be(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&K(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=L.createElement(Se(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new X(i,this),n=r.u(this.options);r.p(t),this.T(n),this._$AH=r}}_$AC(e){let t=ve.get(e.strings);return t===void 0&&ve.set(e.strings,t=new L(e)),t}k(e){ie(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let r of e)i===t.length?t.push(s=new o(this.O(U()),this.O(U()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=ge(e).nextSibling;ge(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},k=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(e,t=this,s,i){let r=this.strings,n=!1;if(r===void 0)e=E(this,e,t,0),n=!K(e)||e!==this._$AH&&e!==S,n&&(this._$AH=e);else{let d=e,a,h;for(e=r[0],a=0;a<r.length-1;a++)h=E(this,d[s+a],t,a),h===S&&(h=this._$AH[a]),n||(n=!K(h)||h!==this._$AH[a]),h===_?e=_:e!==_&&(e+=(h??"")+r[a+1]),this._$AH[a]=h}n&&!i&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Z=class extends k{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}},ee=class extends k{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}},te=class extends k{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=E(this,e,t,0)??_)===S)return;let s=this._$AH,i=e===_&&s!==_||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},se=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var Fe=R.litHtmlPolyfillSupport;Fe?.(L,M),(R.litHtmlVersions??(R.litHtmlVersions=[])).push("3.3.2");var Ee=(o,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let r=t?.renderBefore??null;s._$litPart$=i=new M(e.insertBefore(U(),r),r,void 0,t??{})}return i._$AI(o),i};var I=globalThis,b=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;let e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ee(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};b._$litElement$=!0,b.finalized=!0,I.litElementHydrateSupport?.({LitElement:b});var Ve=I.litElementPolyfillSupport;Ve?.({LitElement:b});(I.litElementVersions??(I.litElementVersions=[])).push("4.2.2");var C={en:{controls:"CONTROLS",sensors_section:"SENSORS",door:"Door",door_open:"\u26A0 Open",door_closed:"Closed",salt:"Salt",salt_low:"\u26A0 Low",ok:"OK",rinse_aid:"Rinse aid",remote:"Remote",connected:"Connected",progress:"Progress",on:"ON",off:"OFF",yes:"Yes",no:"No",power:"Power",turbo:"TURBO",silence:"SILENCE",extra_dry:"EXTRA DRY",half_load:"HALF LOAD",child_lock:"CHILD LOCK",stop:"\u23F9 STOP",stopped:"Stopped",running:"\u25CF RUNNING",finished:"\u2713 FINISHED",aborted:"\u26A0 ABORTED",idle:"IDLE",delayed_start:"DELAYED",starts_at:"Starts at",sensors_title:"Sensors",controls_title:"Controls",show_all:"Show all",select_device_hint:"Open the editor and pick a Bosch dishwasher device to start."},es:{controls:"CONTROLES",sensors_section:"SENSORES",door:"Puerta",door_open:"\u26A0 Abierta",door_closed:"Cerrada",salt:"Sal",salt_low:"\u26A0 Baja",ok:"OK",rinse_aid:"Abrillantador",remote:"Remoto",connected:"Conectado",progress:"Progreso",on:"ON",off:"OFF",yes:"S\xED",no:"No",power:"Encendido",turbo:"TURBO",silence:"SILENCIO",extra_dry:"EXTRA SECO",half_load:"MEDIA CARGA",child_lock:"BLOQUEO",stop:"\u23F9 DETENER",stopped:"Detenido",running:"\u25CF EN MARCHA",finished:"\u2713 FINALIZADO",aborted:"\u26A0 CANCELADO",idle:"INACTIVO",delayed_start:"DIFERIDO",starts_at:"Inicia a las",sensors_title:"Sensores",controls_title:"Controles",show_all:"Mostrar todo",select_device_hint:"Abre el editor y elige un lavavajillas Bosch para empezar."}},re=[{key:"door",icon:"\u{1F6AA}",labelKey:"door"},{key:"salt_warning",icon:"\u{1F9C2}",labelKey:"salt"},{key:"rinse_warning",icon:"\u{1F4A7}",labelKey:"rinse_aid"},{key:"remote_control",icon:"\u{1F4E1}",labelKey:"remote"},{key:"connected",icon:"\u{1F517}",labelKey:"connected"}],Ne=[{key:"power",type:"toggle",icon:"\u23FB",labelKey:"power"},{key:"selected_program",type:"select",icon:"",labelKey:null},{key:"stop_program",type:"button",icon:"",labelKey:"stop"},{key:"vario_speed",type:"toggle",icon:"\u26A1",labelKey:"turbo"},{key:"silence_on_demand",type:"toggle",icon:"\u{1F507}",labelKey:"silence"},{key:"extra_dry",type:"toggle",icon:"\u{1F321}",labelKey:"extra_dry"},{key:"half_load",type:"toggle",icon:"\xBD",labelKey:"half_load"},{key:"child_lock",type:"toggle",icon:"\u{1F512}",labelKey:"child_lock"}],z=re.map(o=>o.key),B=["power","selected_program","stop_program","vario_speed","silence_on_demand","extra_dry","half_load"],ke={dishcare_dishwasher_program_intensiv_70:"Intensive 70\xB0C",dishcare_dishwasher_program_auto_2:"Auto 2",dishcare_dishwasher_program_eco_50:"Eco 50\xB0C",dishcare_dishwasher_program_pre_rinse:"Pre-rinse",dishcare_dishwasher_program_night_wash:"Night wash",dishcare_dishwasher_program_kurz_60:"Speed 60\xB0C",dishcare_dishwasher_program_machine_care:"Machine care",dishcare_dishwasher_program_quick_45:"Quick 45\xB0C",dishcare_dishwasher_program_intensiv_power:"Intensive power",dishcare_dishwasher_program_super_60:"Super 60\xB0C",dishcare_dishwasher_program_mixed_load:"Mixed load",dishcare_dishwasher_program_glas_40:"Glass 40\xB0C"};function Ce(o){return!o||o==="unavailable"||o==="unknown"?o:ke[o]?ke[o]:o.replace(/^.*_program_/,"").replace(/_(\d+)$/," $1\xB0C").replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase())}var Oe={power:{domain:"switch",translationKey:"power"},child_lock:{domain:"switch",translationKey:"child_lock"},vario_speed:{domain:"switch",translationKey:"vario_speed_plus"},silence_on_demand:{domain:"switch",translationKey:"silence_on_demand"},extra_dry:{domain:"switch",translationKey:"extra_dry"},half_load:{domain:"switch",translationKey:"half_load"},active_program:{domain:"select",translationKey:"active_program"},selected_program:{domain:"select",translationKey:"selected_program"},door:{domain:"sensor",translationKey:"door_state"},operation_state:{domain:"sensor",translationKey:"operation_state"},program_progress:{domain:"sensor",translationKey:"program_progress"},program_finish_time:{domain:"sensor",translationKey:"remaining_program_time"},salt_warning:{domain:"binary_sensor",translationKey:"salt_nearly_empty"},rinse_warning:{domain:"binary_sensor",translationKey:"rinse_aid_nearly_empty"},remote_control:{domain:"binary_sensor",translationKey:"remote_control"},connected:{domain:"binary_sensor",translationKey:"connected"},start_in_relative:{domain:"sensor",translationKey:"start_in_relative"},stop_program:{domain:"button",translationKey:"stop_program"}},D=class extends b{setConfig(e){this.config={sensors:z,controls:B,...e}}static getStubConfig(e){let t="";if(e?.entities){for(let s of Object.values(e.entities))if(s.platform==="bosch_dishwasher"&&s.device_id){t=s.device_id;break}}return{type:"custom:bosch-dishwasher-card",device:t,sensors:z,controls:B}}static getConfigElement(){return document.createElement("bosch-dishwasher-card-editor")}getCardSize(){return 4}_t(e){let t=(this.hass?.locale?.language??"en").split("-")[0];return(C[t]??C.en)[e]??C.en[e]??e}_entityId(e){let t=Oe[e];if(!(!t||!this.config.device||!this.hass?.entities)){for(let s of Object.values(this.hass.entities))if(s.device_id===this.config.device&&s.entity_id?.startsWith(`${t.domain}.`)&&s.translation_key===t.translationKey)return s.entity_id}}_entity(e){let t=this._entityId(e);return t?this.hass?.states?.[t]:void 0}_state(e){return this._entity(e)?.state??"unavailable"}_attr(e,t){return this._entity(e)?.attributes?.[t]}_call(e,t,s={}){let i=this._entityId(e);!i||!this.hass||this.hass.callService(i.split(".")[0],t,{entity_id:i,...s})}_watchedEntities(){return Object.keys(Oe).map(e=>this._entityId(e)).filter(Boolean)}shouldUpdate(e){if(e.has("config"))return!0;if(!e.has("hass"))return!1;let t=e.get("hass");if(!t)return!0;for(let s of this._watchedEntities())if(t.states[s]!==this.hass.states[s])return!0;return!1}_operationState(){return this._state("operation_state").toLowerCase()}_isRunning(){let e=this._operationState();return e==="run"||e==="running"}_badge(){let e=this._operationState();return e==="run"||e==="running"?{text:this._t("running"),cls:"badge-running"}:e==="finished"||e==="finish"?{text:this._t("finished"),cls:"badge-finished"}:e==="aborting"||e==="aborted"?{text:this._t("aborted"),cls:"badge-aborted"}:e==="delayed_start"||e==="delayedstart"?{text:this._t("delayed_start"),cls:"badge-delayed"}:{text:e?e.toUpperCase():this._t("idle"),cls:"badge-idle"}}_startTime(){let e=this._state("start_in_relative");if(!e||e==="unavailable"||e==="unknown")return null;if(/^\d{4}-\d{2}-\d{2}T/.test(e)){let t=new Date(e);if(!Number.isNaN(t.getTime()))return t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}return null}_isWarning(e){let t=this._state(e).toLowerCase();return t==="on"||t==="true"||t==="present"||t==="confirmed"}_progress(){let e=parseInt(this._state("program_progress"),10);return Number.isNaN(e)?0:Math.min(100,Math.max(0,e))}_finishTime(){let e=this._state("program_finish_time");if(!e||e==="unavailable"||e==="unknown"||e==="0")return null;if(/^\d{4}-\d{2}-\d{2}T/.test(e)){let t=new Date(e);if(!Number.isNaN(t.getTime()))return t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}return e}_renderDishwasher(e){return l`
      <svg class="bosch-dw ${e}" viewBox="0 0 80 110" width="72" height="100" aria-hidden="true">
        <defs>
          <linearGradient id="dw-door" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#2a3441"/>
            <stop offset="50%"  stop-color="#1f2833"/>
            <stop offset="100%" stop-color="#161b22"/>
          </linearGradient>
          <linearGradient id="dw-gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.1"/>
            <stop offset="40%"  stop-color="#ffffff" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="dw-handle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#555d66"/>
            <stop offset="50%"  stop-color="#8b949e"/>
            <stop offset="100%" stop-color="#30363d"/>
          </linearGradient>
          <clipPath id="dw-door-clip">
            <rect x="6" y="26" width="68" height="74" rx="2"/>
          </clipPath>
        </defs>
        <ellipse cx="40" cy="106" rx="32" ry="1.8" fill="#000" opacity="0.35"/>
        <rect x="10" y="100" width="5" height="4" fill="#0d1117"/>
        <rect x="65" y="100" width="5" height="4" fill="#0d1117"/>
        <rect x="6" y="26" width="68" height="74" rx="2" fill="url(#dw-door)" stroke="#30363d" stroke-width="1"/>
        <rect x="6" y="26" width="68" height="74" rx="2" fill="url(#dw-gloss)"/>
        <g clip-path="url(#dw-door-clip)" class="water-drops">
          <circle class="drop d1" cx="18" cy="30" r="1.2" fill="#48cae4"/>
          <circle class="drop d2" cx="32" cy="28" r="1.0" fill="#48cae4"/>
          <circle class="drop d3" cx="48" cy="31" r="1.3" fill="#48cae4"/>
          <circle class="drop d4" cx="62" cy="29" r="1.0" fill="#48cae4"/>
          <circle class="drop d5" cx="24" cy="32" r="1.1" fill="#48cae4"/>
          <circle class="drop d6" cx="56" cy="30" r="1.2" fill="#48cae4"/>
        </g>
        <rect x="32" y="62" width="16" height="0.8" fill="#8b949e" opacity="0.25"/>
        <rect x="6" y="6" width="68" height="16" rx="1.5" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
        <circle cx="12" cy="14" r="1.8" class="led"/>
        <circle cx="12" cy="14" r="2.8" class="led-glow"/>
        <rect x="28" y="10" width="24" height="8" rx="0.8" fill="#001015" stroke="#00b4d830" stroke-width="0.4"/>
        <text x="40" y="16" text-anchor="middle" font-size="5" font-family="monospace" font-weight="bold" fill="#00b4d8" class="display-text">${e==="running"?"\u2022\u2022\u2022\u2022":e==="finished"?"DONE":e==="aborted"?"STOP":"----"}</text>
        <circle cx="60" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="64" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="68" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="60" cy="16" r="0.8" fill="#30363d"/>
        <circle cx="64" cy="16" r="0.8" fill="#30363d"/>
        <circle cx="68" cy="16" r="0.8" fill="#30363d"/>
        <rect x="14" y="29" width="52" height="4" rx="2" fill="url(#dw-handle)"/>
      </svg>
    `}_renderSensor(e){switch(e.key){case"door":{let t=this._state("door").toLowerCase()==="open";return l`
          <div class="sensor ${t?"warn":""}">
            <span class="sensor-icon">${e.icon}</span>
            <span class="sensor-label">${this._t(e.labelKey)}</span>
            <span class="sensor-value">${t?this._t("door_open"):this._t("door_closed")}</span>
          </div>`}case"salt_warning":{let t=this._isWarning("salt_warning");return l`
          <div class="sensor ${t?"warn":""}">
            <span class="sensor-icon">${e.icon}</span>
            <span class="sensor-label">${this._t(e.labelKey)}</span>
            <span class="sensor-value">${t?this._t("salt_low"):this._t("ok")}</span>
          </div>`}case"rinse_warning":{let t=this._isWarning("rinse_warning");return l`
          <div class="sensor ${t?"warn":""}">
            <span class="sensor-icon">${e.icon}</span>
            <span class="sensor-label">${this._t(e.labelKey)}</span>
            <span class="sensor-value">${t?this._t("salt_low"):this._t("ok")}</span>
          </div>`}case"remote_control":{let t=this._state("remote_control")==="on";return l`
          <div class="sensor">
            <span class="sensor-icon">${e.icon}</span>
            <span class="sensor-label">${this._t(e.labelKey)}</span>
            <span class="sensor-value">${t?this._t("on"):this._t("off")}</span>
          </div>`}case"connected":{let t=this._state("connected")==="on";return l`
          <div class="sensor ${t?"":"warn"}">
            <span class="sensor-icon">${e.icon}</span>
            <span class="sensor-label">${this._t(e.labelKey)}</span>
            <span class="sensor-value">${t?this._t("yes"):this._t("no")}</span>
          </div>`}default:return l``}}_renderControl(e,t){switch(e.key){case"power":{let s=this._state("power")==="on";return l`
          <button class="ctrl-btn ${s?"active":""}" @click=${()=>this._call("power","toggle")}>
            ${e.icon} ${s?this._t("on"):this._t("off")}
          </button>`}case"selected_program":{let s=this._state("selected_program"),i=this._attr("selected_program","options")??[];return l`
          <select class="ctrl-select"
                  .value=${s}
                  @change=${r=>this._call("selected_program","select_option",{option:r.target.value})}>
            ${i.length===0?l`<option disabled>—</option>`:i.map(r=>l`<option value="${r}">${Ce(r)}</option>`)}
          </select>`}case"stop_program":return l`
          <button class="ctrl-btn danger" ?disabled=${!t}
                  @click=${()=>this._call("stop_program","press")}>
            ${this._t("stop")}
          </button>`;case"vario_speed":{let s=this._state("vario_speed")==="on";return l`
          <button class="ctrl-btn ${s?"active":""}" @click=${()=>this._call("vario_speed","toggle")}>
            ${e.icon} ${this._t(e.labelKey)}
          </button>`}case"silence_on_demand":{let s=this._state("silence_on_demand");return l`
          <button class="ctrl-btn ${s==="on"?"active":""}" ?disabled=${!(s!=="unavailable")}
                  @click=${()=>this._call("silence_on_demand","toggle")}>
            ${e.icon} ${this._t(e.labelKey)}
          </button>`}case"extra_dry":{let s=this._state("extra_dry")==="on";return l`
          <button class="ctrl-btn ${s?"active":""}" @click=${()=>this._call("extra_dry","toggle")}>
            ${e.icon} ${this._t(e.labelKey)}
          </button>`}case"half_load":{let s=this._state("half_load")==="on";return l`
          <button class="ctrl-btn ${s?"active":""}" @click=${()=>this._call("half_load","toggle")}>
            ${e.icon} ${this._t(e.labelKey)}
          </button>`}case"child_lock":{let s=this._state("child_lock")==="on";return l`
          <button class="ctrl-btn ${s?"active":""}" @click=${()=>this._call("child_lock","toggle")}>
            ${e.icon} ${this._t(e.labelKey)}
          </button>`}default:return l``}}render(){if(!this.hass||!this.config)return l``;if(!this.config.device)return l`
        <ha-card>
          <div class="empty-state">
            <div class="empty-icon">🫧</div>
            <div class="empty-title">Bosch Dishwasher</div>
            <div class="empty-hint">${this._t("select_device_hint")}</div>
          </div>
        </ha-card>
      `;let e=this.hass.devices?.[this.config.device]?.name_by_user??this.hass.devices?.[this.config.device]?.name??"Bosch Dishwasher",t=this.config.name??e,s=this._isRunning(),i=this._badge(),r=i.cls==="badge-delayed",n=s?"running":i.cls==="badge-finished"?"finished":i.cls==="badge-aborted"?"aborted":"idle",d=this._progress(),a=this._finishTime(),h=r?this._startTime():null,p=this._state("active_program"),c=this._state("selected_program"),u=p&&p!=="unavailable"&&p!=="unknown"?p:c,f=!u||u==="unavailable"||u==="unknown"?this._t("stopped"):Ce(u),v=re.filter(g=>(this.config.sensors??z).includes(g.key)),G=Ne.filter(g=>(this.config.controls??B).includes(g.key)),ne=["power","selected_program","stop_program"],ae=G.filter(g=>ne.includes(g.key)),le=G.filter(g=>!ne.includes(g.key));return l`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="dw-illustration">${this._renderDishwasher(n)}</div>
            <div class="header-info">
              <div class="header-top">
                <span class="card-name">${t}</span>
                <span class="badge ${i.cls}">${i.text}</span>
              </div>
              <div class="program-line">
                ${f}${a?l` · ${a}`:""}${h?l` · ${this._t("starts_at")} ${h}`:""}
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${d}%"></div>
              </div>
              <div class="progress-label">${d}%</div>
            </div>
          </div>

          ${v.length>0?l`
            <div class="sensors">
              ${v.map(g=>this._renderSensor(g))}
            </div>
          `:""}

          ${G.length>0?l`
            <div class="controls">
              <div class="controls-label">${this._t("controls")}</div>
              ${ae.length>0?l`
                <div class="controls-row">
                  ${ae.map(g=>this._renderControl(g,s))}
                </div>
              `:""}
              ${le.length>0?l`
                <div class="controls-grid">
                  ${le.map(g=>this._renderControl(g,s))}
                </div>
              `:""}
            </div>
          `:""}
        </div>
      </ha-card>
    `}};O(D,"properties",{hass:{attribute:!1},config:{attribute:!1}}),O(D,"styles",V`
    ha-card {
      background: #0d1117; color: #e6edf3; border-radius: 12px;
      overflow: hidden; content-visibility: auto; contain-intrinsic-size: 0 260px;
    }
    .card-content { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .header { display: flex; align-items: flex-start; gap: 12px; }
    .dw-illustration {
      flex-shrink: 0; width: 72px; height: 100px;
      display: flex; align-items: center; justify-content: center;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
    }
    .header-info { flex: 1; min-width: 0; }
    .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
    .card-name { font-weight: 700; font-size: 15px; }
    .badge { font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 700; letter-spacing: .5px; }
    .badge-running  { background: #00b4d8; color: #000; animation: blink-badge 1s step-end infinite; }
    .badge-finished { background: #34d39920; color: #34d399; border: 1px solid #34d39940; }
    .badge-aborted  { background: #ef444420; color: #ef4444; border: 1px solid #ef444440; }
    .badge-delayed  { background: #78350f20; color: #f59e0b; border: 1px solid #f59e0b40; }
    .badge-idle     { background: #21262d; color: #8b949e; }
    .program-line { color: #8b949e; font-size: 12px; margin-bottom: 5px; }
    .progress-bar { background: #21262d; height: 4px; border-radius: 2px; overflow: hidden; margin-bottom: 3px; }
    .progress-fill { height: 100%; background: linear-gradient(90deg,#00b4d8,#0077b6); border-radius: 2px; transition: width .5s ease; }
    .progress-label { font-size: 11px; color: #8b949e; }
    .bosch-dw { display: block; transition: opacity .3s; }
    .bosch-dw.idle { opacity: 0.55; }
    .bosch-dw .led { transition: fill .3s; }
    .bosch-dw .led-glow { transition: fill .3s, opacity .3s; opacity: 0; filter: blur(1.5px); }
    .bosch-dw.idle .led { fill: #444c56; }
    .bosch-dw.running .led, .bosch-dw.running .led-glow { fill: #00b4d8; }
    .bosch-dw.finished .led, .bosch-dw.finished .led-glow { fill: #34d399; }
    .bosch-dw.aborted .led, .bosch-dw.aborted .led-glow { fill: #ef4444; }
    .bosch-dw.running .led-glow, .bosch-dw.finished .led-glow, .bosch-dw.aborted .led-glow { opacity: 0.8; }
    .bosch-dw.running .led { animation: led-pulse 1.5s ease-in-out infinite; }
    .bosch-dw .display-text { transition: fill .3s; }
    .bosch-dw.idle .display-text { fill: #30363d; }
    .bosch-dw.finished .display-text { fill: #34d399; }
    .bosch-dw.aborted .display-text { fill: #ef4444; }
    .bosch-dw.running .display-text { animation: blink-text 1s step-end infinite; }
    .water-drops .drop { opacity: 0; }
    .bosch-dw.running .water-drops .drop { animation: drop-fall 2.2s linear infinite; }
    .bosch-dw.running .water-drops .d1 { animation-delay: 0s; }
    .bosch-dw.running .water-drops .d2 { animation-delay: 0.35s; }
    .bosch-dw.running .water-drops .d3 { animation-delay: 0.7s; }
    .bosch-dw.running .water-drops .d4 { animation-delay: 1.05s; }
    .bosch-dw.running .water-drops .d5 { animation-delay: 1.4s; }
    .bosch-dw.running .water-drops .d6 { animation-delay: 1.75s; }
    @keyframes drop-fall { 0% { transform: translateY(-4px); opacity: 0; } 12% { opacity: 0.85; } 88% { opacity: 0.85; } 100% { transform: translateY(70px); opacity: 0; } }
    @keyframes led-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
    @keyframes blink-text { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
    @keyframes blink-badge { 0%, 100% { opacity: 1; } 50% { opacity: 0.65; } }
    .sensors { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .sensor { background: #161b22; border-radius: 6px; padding: 6px 8px; display: flex; align-items: center; gap: 6px; border: 1px solid #21262d; }
    .sensor.warn { border-color: #f59e0b; background: #f59e0b15; }
    .sensor-icon { font-size: 14px; }
    .sensor-label { color: #8b949e; font-size: 11px; flex: 1; }
    .sensor-value { font-size: 11px; color: #e6edf3; }
    .sensor.warn .sensor-value { color: #f59e0b; }
    .controls { border-top: 1px solid #21262d; padding-top: 10px; }
    .controls-label { color: #444c56; font-size: 10px; letter-spacing: 1px; margin-bottom: 6px; }
    .controls-row { display: flex; gap: 6px; margin-bottom: 6px; }
    .controls-row:last-child { margin-bottom: 0; }
    .controls-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .ctrl-btn {
      background: #21262d; border: 1px solid #30363d; border-radius: 6px;
      color: #8b949e; font-size: 11px; padding: 6px 10px; cursor: pointer;
      flex: 1; transition: border-color .15s, color .15s, background .15s;
    }
    .ctrl-btn:hover:not(:disabled) { border-color: #00b4d8; color: #00b4d8; }
    .ctrl-btn.active { background: #00b4d820; border-color: #00b4d850; color: #00b4d8; }
    .ctrl-btn.danger { color: #ef4444; border-color: #ef444440; }
    .ctrl-btn.danger:hover:not(:disabled) { background: #ef444420; border-color: #ef4444; }
    .ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .ctrl-select {
      flex: 2; background: #21262d; border: 1px solid #30363d; border-radius: 6px;
      color: #00b4d8; font-size: 11px; padding: 6px 8px; cursor: pointer; outline: none;
    }
    .ctrl-select:focus { border-color: #00b4d8; }
    .empty-state {
      padding: 28px 20px; display: flex; flex-direction: column;
      align-items: center; gap: 8px; text-align: center;
    }
    .empty-icon { font-size: 38px; }
    .empty-title { font-weight: 700; font-size: 15px; color: #e6edf3; }
    .empty-hint { font-size: 12px; color: #8b949e; max-width: 260px; }
  `);var H=class extends b{setConfig(e){this._config={sensors:z,controls:B,...e}}_valueChanged(e){if(!this._config)return;let t=e.target,s=t.configValue;if(!s)return;let i=e.detail?.value??t.value,r={...this._config,[s]:i};s==="name"&&!i&&delete r.name,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))}_toggleItem(e,t){let s=[...this._config[e]??[]],i=s.indexOf(t);i>=0?s.splice(i,1):s.push(t);let r={...this._config,[e]:s};this._config=r,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))}_lang(){let e=(this.hass?.locale?.language??"en").split("-")[0];return C[e]??C.en}_t(e){return this._lang()[e]??C.en[e]??e}_sensorLabel(e){return this._t(e.labelKey)??e.key}_controlLabel(e){return e.key==="selected_program"?"Programa / Program":`${e.icon} ${this._t(e.labelKey)}`.trim()}render(){if(!this.hass||!this._config)return l``;let e=this._config.sensors??z,t=this._config.controls??B,s=new Set;for(let r of Object.values(this.hass.entities??{}))r.platform==="bosch_dishwasher"&&r.device_id&&s.add(r.device_id);let i=r=>s.has(r.id);return l`
      <div class="form">
        <ha-device-picker
          .hass=${this.hass}
          .value=${this._config.device??""}
          .configValue=${"device"}
          .deviceFilter=${i}
          label="Bosch dishwasher"
          @value-changed=${this._valueChanged}
        ></ha-device-picker>

        <ha-textfield
          .value=${this._config.name??""}
          .configValue=${"name"}
          label="Name (optional)"
          @input=${this._valueChanged}
        ></ha-textfield>

        <div class="section-title">${this._t("sensors_title")}</div>
        <div class="check-grid">
          ${re.map(r=>l`
            <label class="check-row">
              <input type="checkbox"
                     .checked=${e.includes(r.key)}
                     @change=${()=>this._toggleItem("sensors",r.key)}>
              <span>${r.icon} ${this._sensorLabel(r)}</span>
            </label>
          `)}
        </div>

        <div class="section-title">${this._t("controls_title")}</div>
        <div class="check-grid">
          ${Ne.map(r=>l`
            <label class="check-row">
              <input type="checkbox"
                     .checked=${t.includes(r.key)}
                     @change=${()=>this._toggleItem("controls",r.key)}>
              <span>${this._controlLabel(r)}</span>
            </label>
          `)}
        </div>
      </div>
    `}};O(H,"properties",{hass:{attribute:!1},_config:{state:!0}}),O(H,"styles",V`
    .form { display: flex; flex-direction: column; gap: 14px; padding: 8px 0; }
    ha-device-picker, ha-textfield { display: block; width: 100%; }
    .section-title {
      font-size: 11px; font-weight: 700; letter-spacing: 1px;
      color: var(--secondary-text-color, #8b949e);
      text-transform: uppercase; margin-top: 4px;
    }
    .check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .check-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; cursor: pointer;
      padding: 4px 6px; border-radius: 6px;
    }
    .check-row:hover { background: var(--secondary-background-color, #21262d); }
    .check-row input { accent-color: var(--primary-color, #00b4d8); width: 16px; height: 16px; cursor: pointer; }
  `);customElements.define("bosch-dishwasher-card",D);customElements.define("bosch-dishwasher-card-editor",H);window.customCards=window.customCards||[];window.customCards.push({type:"bosch-dishwasher-card",name:"Bosch Dishwasher",description:"Control and monitor a Bosch / Siemens / Neff / Balay dishwasher connected via Home Connect.",preview:!0,documentationURL:"https://github.com/iskael/bosch-dishwasher"});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
