var Oe=Object.defineProperty;var Ne=(o,e,t)=>e in o?Oe(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var O=(o,e,t)=>Ne(o,typeof e!="symbol"?e+"":e,t);var j=globalThis,F=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),ae=new WeakMap,N=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(F&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=ae.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ae.set(t,e))}return e}toString(){return this.cssText}},le=o=>new N(typeof o=="string"?o:o+"",void 0,G),V=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new N(t,o,G)},ce=(o,e)=>{if(F)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=j.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,o.appendChild(s)}},q=F?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return le(t)})(o):o;var{is:Pe,defineProperty:Re,getOwnPropertyDescriptor:Te,getOwnPropertyNames:Ue,getOwnPropertySymbols:Ke,getPrototypeOf:Le}=Object,y=globalThis,de=y.trustedTypes,Me=de?de.emptyScript:"",He=y.reactiveElementPolyfillSupport,P=(o,e)=>o,Y={toAttribute(o,e){switch(e){case Boolean:o=o?Me:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},pe=(o,e)=>!Pe(o,e),he={attribute:!0,type:String,converter:Y,reflect:!1,useDefault:!1,hasChanged:pe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),y.litPropertyMetadata??(y.litPropertyMetadata=new WeakMap);var m=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=he){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Re(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:r}=Te(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:i,set(n){let d=i?.call(this);r?.call(this,n),this.requestUpdate(e,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??he}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;let e=Le(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){let t=this.properties,s=[...Ue(t),...Ke(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(q(i))}else e!==void 0&&t.push(q(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ce(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:Y).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Y;this._$Em=i;let d=n.fromAttribute(t,r.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(e!==void 0){let n=this.constructor;if(i===!1&&(r=this[e]),s??(s=n.getPropertyOptions(e)),!((s.hasChanged??pe)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??t??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:n}=r,d=this[i];n!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,r,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};m.elementStyles=[],m.shadowRootOptions={mode:"open"},m[P("elementProperties")]=new Map,m[P("finalized")]=new Map,He?.({ReactiveElement:m}),(y.reactiveElementVersions??(y.reactiveElementVersions=[])).push("2.1.2");var T=globalThis,_e=o=>o,W=T.trustedTypes,ue=W?W.createPolicy("lit-html",{createHTML:o=>o}):void 0,$e="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,xe="?"+$,Ie=`<${xe}>`,A=document,U=()=>A.createComment(""),K=o=>o===null||typeof o!="object"&&typeof o!="function",se=Array.isArray,De=o=>se(o)||typeof o?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fe=/-->/g,ge=/>/g,w=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),me=/'/g,be=/"/g,we=/^(?:script|style|textarea|title)$/i,ie=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),l=ie(1),Ye=ie(2),Je=ie(3),S=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),ye=new WeakMap,v=A.createTreeWalker(A,129);function ve(o,e){if(!se(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ue!==void 0?ue.createHTML(e):e}var ze=(o,e)=>{let t=o.length-1,s=[],i,r=e===2?"<svg>":e===3?"<math>":"",n=R;for(let d=0;d<t;d++){let a=o[d],p,h,c=-1,f=0;for(;f<a.length&&(n.lastIndex=f,h=n.exec(a),h!==null);)f=n.lastIndex,n===R?h[1]==="!--"?n=fe:h[1]!==void 0?n=ge:h[2]!==void 0?(we.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=w):h[3]!==void 0&&(n=w):n===w?h[0]===">"?(n=i??R,c=-1):h[1]===void 0?c=-2:(c=n.lastIndex-h[2].length,p=h[1],n=h[3]===void 0?w:h[3]==='"'?be:me):n===be||n===me?n=w:n===fe||n===ge?n=R:(n=w,i=void 0);let g=n===w&&o[d+1].startsWith("/>")?" ":"";r+=n===R?a+Ie:c>=0?(s.push(p),a.slice(0,c)+$e+a.slice(c)+$+g):a+$+(c===-2?d:g)}return[ve(o,r+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},L=class o{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,n=0,d=e.length-1,a=this.parts,[p,h]=ze(e,t);if(this.el=o.createElement(p,s),v.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=v.nextNode())!==null&&a.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith($e)){let f=h[n++],g=i.getAttribute(c).split($),x=/([.?@])?(.*)/.exec(f);a.push({type:1,index:r,name:x[2],strings:g,ctor:x[1]==="."?X:x[1]==="?"?Z:x[1]==="@"?ee:C}),i.removeAttribute(c)}else c.startsWith($)&&(a.push({type:6,index:r}),i.removeAttribute(c));if(we.test(i.tagName)){let c=i.textContent.split($),f=c.length-1;if(f>0){i.textContent=W?W.emptyScript:"";for(let g=0;g<f;g++)i.append(c[g],U()),v.nextNode(),a.push({type:2,index:++r});i.append(c[f],U())}}}else if(i.nodeType===8)if(i.data===xe)a.push({type:2,index:r});else{let c=-1;for(;(c=i.data.indexOf($,c+1))!==-1;)a.push({type:7,index:r}),c+=$.length-1}r++}}static createElement(e,t){let s=A.createElement("template");return s.innerHTML=e,s}};function E(o,e,t=o,s){if(e===S)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,r=K(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(o),i._$AT(o,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=i:t._$Cl=i),i!==void 0&&(e=E(o,i._$AS(o,e.values),i,s)),e}var Q=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??A).importNode(t,!0);v.currentNode=i;let r=v.nextNode(),n=0,d=0,a=s[0];for(;a!==void 0;){if(n===a.index){let p;a.type===2?p=new M(r,r.nextSibling,this,e):a.type===1?p=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(p=new te(r,this,e)),this._$AV.push(p),a=s[++d]}n!==a?.index&&(r=v.nextNode(),n++)}return v.currentNode=A,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},M=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),K(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==S&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):De(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&K(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=L.createElement(ve(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new Q(i,this),n=r.u(this.options);r.p(t),this.T(n),this._$AH=r}}_$AC(e){let t=ye.get(e.strings);return t===void 0&&ye.set(e.strings,t=new L(e)),t}k(e){se(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let r of e)i===t.length?t.push(s=new o(this.O(U()),this.O(U()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=_e(e).nextSibling;_e(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(e,t=this,s,i){let r=this.strings,n=!1;if(r===void 0)e=E(this,e,t,0),n=!K(e)||e!==this._$AH&&e!==S,n&&(this._$AH=e);else{let d=e,a,p;for(e=r[0],a=0;a<r.length-1;a++)p=E(this,d[s+a],t,a),p===S&&(p=this._$AH[a]),n||(n=!K(p)||p!==this._$AH[a]),p===_?e=_:e!==_&&(e+=(p??"")+r[a+1]),this._$AH[a]=p}n&&!i&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},X=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}},Z=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}},ee=class extends C{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=E(this,e,t,0)??_)===S)return;let s=this._$AH,i=e===_&&s!==_||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},te=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var Be=T.litHtmlPolyfillSupport;Be?.(L,M),(T.litHtmlVersions??(T.litHtmlVersions=[])).push("3.3.2");var Ae=(o,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let r=t?.renderBefore??null;s._$litPart$=i=new M(e.insertBefore(U(),r),r,void 0,t??{})}return i._$AI(o),i};var H=globalThis,b=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;let e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ae(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};b._$litElement$=!0,b.finalized=!0,H.litElementHydrateSupport?.({LitElement:b});var je=H.litElementPolyfillSupport;je?.({LitElement:b});(H.litElementVersions??(H.litElementVersions=[])).push("4.2.2");var k={en:{controls:"CONTROLS",sensors_section:"SENSORS",door:"Door",door_open:"\u26A0 Open",door_closed:"Closed",salt:"Salt",salt_low:"\u26A0 Low",ok:"OK",rinse_aid:"Rinse aid",remote:"Remote",connected:"Connected",progress:"Progress",on:"ON",off:"OFF",yes:"Yes",no:"No",power:"Power",turbo:"TURBO",silence:"SILENCE",extra_dry:"EXTRA DRY",half_load:"HALF LOAD",child_lock:"CHILD LOCK",stop:"\u23F9 STOP",stopped:"Stopped",running:"\u25CF RUNNING",finished:"\u2713 FINISHED",aborted:"\u26A0 ABORTED",idle:"IDLE",sensors_title:"Sensors",controls_title:"Controls",show_all:"Show all"},es:{controls:"CONTROLES",sensors_section:"SENSORES",door:"Puerta",door_open:"\u26A0 Abierta",door_closed:"Cerrada",salt:"Sal",salt_low:"\u26A0 Baja",ok:"OK",rinse_aid:"Abrillantador",remote:"Remoto",connected:"Conectado",progress:"Progreso",on:"ON",off:"OFF",yes:"S\xED",no:"No",power:"Encendido",turbo:"TURBO",silence:"SILENCIO",extra_dry:"EXTRA SECO",half_load:"MEDIA CARGA",child_lock:"BLOQUEO",stop:"\u23F9 DETENER",stopped:"Detenido",running:"\u25CF EN MARCHA",finished:"\u2713 FINALIZADO",aborted:"\u26A0 CANCELADO",idle:"INACTIVO",sensors_title:"Sensores",controls_title:"Controles",show_all:"Mostrar todo"}},oe=[{key:"door",icon:"\u{1F6AA}",labelKey:"door"},{key:"salt_warning",icon:"\u{1F9C2}",labelKey:"salt"},{key:"rinse_warning",icon:"\u{1F4A7}",labelKey:"rinse_aid"},{key:"remote_control",icon:"\u{1F4E1}",labelKey:"remote"},{key:"connected",icon:"\u{1F517}",labelKey:"connected"}],ke=[{key:"power",type:"toggle",icon:"\u23FB",labelKey:"power"},{key:"selected_program",type:"select",icon:"",labelKey:null},{key:"stop_program",type:"button",icon:"",labelKey:"stop"},{key:"vario_speed",type:"toggle",icon:"\u26A1",labelKey:"turbo"},{key:"silence_on_demand",type:"toggle",icon:"\u{1F507}",labelKey:"silence"},{key:"extra_dry",type:"toggle",icon:"\u{1F321}",labelKey:"extra_dry"},{key:"half_load",type:"toggle",icon:"\xBD",labelKey:"half_load"},{key:"child_lock",type:"toggle",icon:"\u{1F512}",labelKey:"child_lock"}],z=oe.map(o=>o.key),B=["power","selected_program","stop_program","vario_speed","silence_on_demand","extra_dry","half_load"],Se={dishcare_dishwasher_program_intensiv_70:"Intensive 70\xB0C",dishcare_dishwasher_program_auto_2:"Auto 2",dishcare_dishwasher_program_eco_50:"Eco 50\xB0C",dishcare_dishwasher_program_pre_rinse:"Pre-rinse",dishcare_dishwasher_program_night_wash:"Night wash",dishcare_dishwasher_program_kurz_60:"Speed 60\xB0C",dishcare_dishwasher_program_machine_care:"Machine care",dishcare_dishwasher_program_quick_45:"Quick 45\xB0C",dishcare_dishwasher_program_intensiv_power:"Intensive power",dishcare_dishwasher_program_super_60:"Super 60\xB0C",dishcare_dishwasher_program_mixed_load:"Mixed load",dishcare_dishwasher_program_glas_40:"Glass 40\xB0C"};function Ee(o){return!o||o==="unavailable"||o==="unknown"?o:Se[o]?Se[o]:o.replace(/^.*_program_/,"").replace(/_(\d+)$/," $1\xB0C").replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase())}var Ce={power:{domain:"switch",translationKey:"power",prefixSuffix:"power"},child_lock:{domain:"switch",translationKey:"child_lock",prefixSuffix:"child_lock"},vario_speed:{domain:"switch",translationKey:"vario_speed_plus",prefixSuffix:"vario_speed_plus"},silence_on_demand:{domain:"switch",translationKey:"silence_on_demand",prefixSuffix:"silence_on_demand"},extra_dry:{domain:"switch",translationKey:"extra_dry",prefixSuffix:"extra_dry"},half_load:{domain:"switch",translationKey:"half_load",prefixSuffix:"half_load"},active_program:{domain:"select",translationKey:"active_program",prefixSuffix:"active_program"},selected_program:{domain:"select",translationKey:"selected_program",prefixSuffix:"selected_program"},door:{domain:"sensor",translationKey:"door_state",prefixSuffix:"door"},operation_state:{domain:"sensor",translationKey:"operation_state",prefixSuffix:"operation_state"},program_progress:{domain:"sensor",translationKey:"program_progress",prefixSuffix:"program_progress"},program_finish_time:{domain:"sensor",translationKey:"remaining_program_time",prefixSuffix:"program_finish_time"},salt_warning:{domain:"binary_sensor",translationKey:"salt_nearly_empty",prefixSuffix:"salt_nearly_empty"},rinse_warning:{domain:"binary_sensor",translationKey:"rinse_aid_nearly_empty",prefixSuffix:"rinse_aid_nearly_empty"},remote_control:{domain:"binary_sensor",translationKey:"remote_control",prefixSuffix:"remote_control"},connected:{domain:"binary_sensor",translationKey:"connected",prefixSuffix:"connected"},stop_program:{domain:"button",translationKey:"stop_program",prefixSuffix:"stop_program"}},I=class extends b{setConfig(e){if(!e.device&&!e.entity_prefix)throw new Error("A `device` (Bosch dishwasher) is required.");this.config={sensors:z,controls:B,...e},e.entity_prefix&&!e.device&&console.warn("[bosch-dishwasher-card] `entity_prefix` is deprecated; switch to the `device` selector. Support will be removed in v1.0.0.")}static getStubConfig(){return{type:"custom:bosch-dishwasher-card",device:"",sensors:z,controls:B}}static getConfigElement(){return document.createElement("bosch-dishwasher-card-editor")}getCardSize(){return 4}_t(e){let t=(this.hass?.locale?.language??"en").split("-")[0];return(k[t]??k.en)[e]??k.en[e]??e}_entityId(e){let t=Ce[e];if(t){if(this.config.device&&this.hass?.entities){for(let s of Object.values(this.hass.entities))if(s.device_id===this.config.device&&s.entity_id?.startsWith(`${t.domain}.`)&&s.translation_key===t.translationKey)return s.entity_id;return}if(this.config.entity_prefix)return`${t.domain}.${this.config.entity_prefix}_${t.prefixSuffix}`}}_entity(e){let t=this._entityId(e);return t?this.hass?.states?.[t]:void 0}_state(e){return this._entity(e)?.state??"unavailable"}_attr(e,t){return this._entity(e)?.attributes?.[t]}_call(e,t,s={}){let i=this._entityId(e);!i||!this.hass||this.hass.callService(i.split(".")[0],t,{entity_id:i,...s})}_watchedEntities(){return Object.keys(Ce).map(e=>this._entityId(e)).filter(Boolean)}shouldUpdate(e){if(e.has("config"))return!0;if(!e.has("hass"))return!1;let t=e.get("hass");if(!t)return!0;for(let s of this._watchedEntities())if(t.states[s]!==this.hass.states[s])return!0;return!1}_operationState(){return this._state("operation_state").toLowerCase()}_isRunning(){let e=this._operationState();return e==="run"||e==="running"}_badge(){let e=this._operationState();return e==="run"||e==="running"?{text:this._t("running"),cls:"badge-running"}:e==="finished"||e==="finish"?{text:this._t("finished"),cls:"badge-finished"}:e==="aborting"||e==="aborted"?{text:this._t("aborted"),cls:"badge-aborted"}:{text:e?e.toUpperCase():this._t("idle"),cls:"badge-idle"}}_isWarning(e){let t=this._state(e).toLowerCase();return t==="on"||t==="true"||t==="present"||t==="confirmed"}_progress(){let e=parseInt(this._state("program_progress"),10);return Number.isNaN(e)?0:Math.min(100,Math.max(0,e))}_finishTime(){let e=this._state("program_finish_time");if(!e||e==="unavailable"||e==="unknown"||e==="0")return null;if(/^\d{4}-\d{2}-\d{2}T/.test(e)){let t=new Date(e);if(!Number.isNaN(t.getTime()))return t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}return e}_renderDishwasher(e){return l`
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
            ${i.length===0?l`<option disabled>—</option>`:i.map(r=>l`<option value="${r}">${Ee(r)}</option>`)}
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
          </button>`}default:return l``}}render(){if(!this.hass||!this.config)return l``;let e=(this.config.device&&this.hass.devices?.[this.config.device]?.name_by_user)??(this.config.device&&this.hass.devices?.[this.config.device]?.name)??this.config.entity_prefix??"Bosch Dishwasher",t=this.config.name??e,s=this._isRunning(),i=this._badge(),r=s?"running":i.cls==="badge-finished"?"finished":i.cls==="badge-aborted"?"aborted":"idle",n=this._progress(),d=this._finishTime(),a=this._state("active_program"),p=this._state("selected_program"),h=a&&a!=="unavailable"&&a!=="unknown"?a:p,c=!h||h==="unavailable"||h==="unknown"?this._t("stopped"):Ee(h),f=oe.filter(u=>(this.config.sensors??z).includes(u.key)),g=ke.filter(u=>(this.config.controls??B).includes(u.key)),x=["power","selected_program","stop_program"],re=g.filter(u=>x.includes(u.key)),ne=g.filter(u=>!x.includes(u.key));return l`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="dw-illustration">${this._renderDishwasher(r)}</div>
            <div class="header-info">
              <div class="header-top">
                <span class="card-name">${t}</span>
                <span class="badge ${i.cls}">${i.text}</span>
              </div>
              <div class="program-line">
                ${c}${d?l` · ${d}`:""}
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${n}%"></div>
              </div>
              <div class="progress-label">${n}%</div>
            </div>
          </div>

          ${f.length>0?l`
            <div class="sensors">
              ${f.map(u=>this._renderSensor(u))}
            </div>
          `:""}

          ${g.length>0?l`
            <div class="controls">
              <div class="controls-label">${this._t("controls")}</div>
              ${re.length>0?l`
                <div class="controls-row">
                  ${re.map(u=>this._renderControl(u,s))}
                </div>
              `:""}
              ${ne.length>0?l`
                <div class="controls-grid">
                  ${ne.map(u=>this._renderControl(u,s))}
                </div>
              `:""}
            </div>
          `:""}
        </div>
      </ha-card>
    `}};O(I,"properties",{hass:{attribute:!1},config:{attribute:!1}}),O(I,"styles",V`
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
  `);var D=class extends b{setConfig(e){this._config={sensors:z,controls:B,...e}}_valueChanged(e){if(!this._config)return;let t=e.target,s=t.configValue;if(!s)return;let i=e.detail?.value??t.value,r={...this._config,[s]:i};s==="name"&&!i&&delete r.name,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))}_toggleItem(e,t){let s=[...this._config[e]??[]],i=s.indexOf(t);i>=0?s.splice(i,1):s.push(t);let r={...this._config,[e]:s};this._config=r,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))}_lang(){let e=(this.hass?.locale?.language??"en").split("-")[0];return k[e]??k.en}_t(e){return this._lang()[e]??k.en[e]??e}_sensorLabel(e){return this._t(e.labelKey)??e.key}_controlLabel(e){return e.key==="selected_program"?"Programa / Program":`${e.icon} ${this._t(e.labelKey)}`.trim()}render(){if(!this.hass||!this._config)return l``;let e=this._config.sensors??z,t=this._config.controls??B;return l`
      <div class="form">
        <ha-device-picker
          .hass=${this.hass}
          .value=${this._config.device??""}
          .configValue=${"device"}
          .includeDomains=${["bosch_dishwasher"]}
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
          ${oe.map(s=>l`
            <label class="check-row">
              <input type="checkbox"
                     .checked=${e.includes(s.key)}
                     @change=${()=>this._toggleItem("sensors",s.key)}>
              <span>${s.icon} ${this._sensorLabel(s)}</span>
            </label>
          `)}
        </div>

        <div class="section-title">${this._t("controls_title")}</div>
        <div class="check-grid">
          ${ke.map(s=>l`
            <label class="check-row">
              <input type="checkbox"
                     .checked=${t.includes(s.key)}
                     @change=${()=>this._toggleItem("controls",s.key)}>
              <span>${this._controlLabel(s)}</span>
            </label>
          `)}
        </div>
      </div>
    `}};O(D,"properties",{hass:{attribute:!1},_config:{state:!0}}),O(D,"styles",V`
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
  `);customElements.define("bosch-dishwasher-card",I);customElements.define("bosch-dishwasher-card-editor",D);window.customCards=window.customCards||[];window.customCards.push({type:"bosch-dishwasher-card",name:"Bosch Dishwasher Card",description:"Control and monitor a Bosch / Siemens / Neff / Balay dishwasher.",preview:!1,documentationURL:"https://github.com/iskael/bosch-dishwasher"});
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
