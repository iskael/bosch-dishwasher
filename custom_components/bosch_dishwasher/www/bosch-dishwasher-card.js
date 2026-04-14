var Tt=Object.defineProperty;var Rt=(r,t,e)=>t in r?Tt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var C=(r,t,e)=>Rt(r,typeof t!="symbol"?t+"":t,e);var z=globalThis,K=z.ShadowRoot&&(z.ShadyCSS===void 0||z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),ot=new WeakMap,O=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(K&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=ot.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ot.set(e,t))}return t}toString(){return this.cssText}},nt=r=>new O(typeof r=="string"?r:r+"",void 0,W),j=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new O(e,r,W)},at=(r,t)=>{if(K)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=z.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},V=K?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return nt(e)})(r):r;var{is:Ut,defineProperty:Mt,getOwnPropertyDescriptor:Ht,getOwnPropertyNames:Lt,getOwnPropertySymbols:It,getPrototypeOf:Dt}=Object,b=globalThis,lt=b.trustedTypes,zt=lt?lt.emptyScript:"",Kt=b.reactiveElementPolyfillSupport,k=(r,t)=>r,G={toAttribute(r,t){switch(t){case Boolean:r=r?zt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ct=(r,t)=>!Ut(r,t),dt={attribute:!0,type:String,converter:G,reflect:!1,useDefault:!1,hasChanged:ct};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),b.litPropertyMetadata??(b.litPropertyMetadata=new WeakMap);var _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=dt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Mt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=Ht(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let d=i?.call(this);o?.call(this,n),this.requestUpdate(t,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??dt}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;let t=Dt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){let e=this.properties,s=[...Lt(e),...It(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(V(i))}else t!==void 0&&e.push(V(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return at(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:G).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:G;this._$Em=i;let d=n.fromAttribute(e,o.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),s??(s=n.getPropertyOptions(t)),!((s.hasChanged??ct)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:n}=o,d=this[i];n!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,o,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[k("elementProperties")]=new Map,_[k("finalized")]=new Map,Kt?.({ReactiveElement:_}),(b.reactiveElementVersions??(b.reactiveElementVersions=[])).push("2.1.2");var P=globalThis,ht=r=>r,B=P.trustedTypes,pt=B?B.createPolicy("lit-html",{createHTML:r=>r}):void 0,bt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,$t="?"+$,jt=`<${$t}>`,w=document,T=()=>w.createComment(""),R=r=>r===null||typeof r!="object"&&typeof r!="function",Q=Array.isArray,Bt=r=>Q(r)||typeof r?.[Symbol.iterator]=="function",q=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ft=/-->/g,ut=/>/g,x=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_t=/'/g,gt=/"/g,yt=/^(?:script|style|textarea|title)$/i,tt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),g=tt(1),Zt=tt(2),Qt=tt(3),A=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),mt=new WeakMap,v=w.createTreeWalker(w,129);function xt(r,t){if(!Q(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return pt!==void 0?pt.createHTML(t):t}var Wt=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=N;for(let d=0;d<e;d++){let a=r[d],c,h,l=-1,f=0;for(;f<a.length&&(n.lastIndex=f,h=n.exec(a),h!==null);)f=n.lastIndex,n===N?h[1]==="!--"?n=ft:h[1]!==void 0?n=ut:h[2]!==void 0?(yt.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=x):h[3]!==void 0&&(n=x):n===x?h[0]===">"?(n=i??N,l=-1):h[1]===void 0?l=-2:(l=n.lastIndex-h[2].length,c=h[1],n=h[3]===void 0?x:h[3]==='"'?gt:_t):n===gt||n===_t?n=x:n===ft||n===ut?n=N:(n=x,i=void 0);let u=n===x&&r[d+1].startsWith("/>")?" ":"";o+=n===N?a+jt:l>=0?(s.push(c),a.slice(0,l)+bt+a.slice(l)+$+u):a+$+(l===-2?d:u)}return[xt(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},U=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,d=t.length-1,a=this.parts,[c,h]=Wt(t,e);if(this.el=r.createElement(c,s),v.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(i=v.nextNode())!==null&&a.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let l of i.getAttributeNames())if(l.endsWith(bt)){let f=h[n++],u=i.getAttribute(l).split($),y=/([.?@])?(.*)/.exec(f);a.push({type:1,index:o,name:y[2],strings:u,ctor:y[1]==="."?Y:y[1]==="?"?J:y[1]==="@"?X:E}),i.removeAttribute(l)}else l.startsWith($)&&(a.push({type:6,index:o}),i.removeAttribute(l));if(yt.test(i.tagName)){let l=i.textContent.split($),f=l.length-1;if(f>0){i.textContent=B?B.emptyScript:"";for(let u=0;u<f;u++)i.append(l[u],T()),v.nextNode(),a.push({type:2,index:++o});i.append(l[f],T())}}}else if(i.nodeType===8)if(i.data===$t)a.push({type:2,index:o});else{let l=-1;for(;(l=i.data.indexOf($,l+1))!==-1;)a.push({type:7,index:o}),l+=$.length-1}o++}}static createElement(t,e){let s=w.createElement("template");return s.innerHTML=t,s}};function S(r,t,e=r,s){if(t===A)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=R(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=S(r,i._$AS(r,t.values),i,s)),t}var F=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??w).importNode(e,!0);v.currentNode=i;let o=v.nextNode(),n=0,d=0,a=s[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new M(o,o.nextSibling,this,t):a.type===1?c=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(c=new Z(o,this,t)),this._$AV.push(c),a=s[++d]}n!==a?.index&&(o=v.nextNode(),n++)}return v.currentNode=w,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},M=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=S(this,t,e),R(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Bt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=U.createElement(xt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new F(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=mt.get(t.strings);return e===void 0&&mt.set(t.strings,e=new U(t)),e}k(t){Q(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ht(t).nextSibling;ht(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=S(this,t,e,0),n=!R(t)||t!==this._$AH&&t!==A,n&&(this._$AH=t);else{let d=t,a,c;for(t=o[0],a=0;a<o.length-1;a++)c=S(this,d[s+a],e,a),c===A&&(c=this._$AH[a]),n||(n=!R(c)||c!==this._$AH[a]),c===p?t=p:t!==p&&(t+=(c??"")+o[a+1]),this._$AH[a]=c}n&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Y=class extends E{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},J=class extends E{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},X=class extends E{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=S(this,t,e,0)??p)===A)return;let s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Z=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t)}};var Vt=P.litHtmlPolyfillSupport;Vt?.(U,M),(P.litHtmlVersions??(P.litHtmlVersions=[])).push("3.3.2");var vt=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new M(t.insertBefore(T(),o),o,void 0,e??{})}return i._$AI(r),i};var H=globalThis,m=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=vt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};m._$litElement$=!0,m.finalized=!0,H.litElementHydrateSupport?.({LitElement:m});var Gt=H.litElementPolyfillSupport;Gt?.({LitElement:m});(H.litElementVersions??(H.litElementVersions=[])).push("4.2.2");var et={en:{controls:"CONTROLS",door:"Door",door_open:"\u26A0 Open",door_closed:"Closed",salt:"Salt",salt_low:"\u26A0 Low",ok:"OK",rinse_aid:"Rinse aid",remote:"Remote",on:"ON",off:"OFF",turbo:"TURBO",silence:"SILENCE",extra_dry:"EXTRA DRY",half_load:"HALF LOAD",stop:"STOP",stopped:"Stopped",running:"\u25CF RUNNING",finished:"\u2713 FINISHED",aborted:"\u26A0 ABORTED",idle:"IDLE"},es:{controls:"CONTROLES",door:"Puerta",door_open:"\u26A0 Abierta",door_closed:"Cerrada",salt:"Sal",salt_low:"\u26A0 Baja",ok:"OK",rinse_aid:"Abrillantador",remote:"Remoto",on:"ON",off:"OFF",turbo:"TURBO",silence:"SILENCIO",extra_dry:"EXTRA SECO",half_load:"MEDIA CARGA",stop:"DETENER",stopped:"Detenido",running:"\u25CF EN MARCHA",finished:"\u2713 FINALIZADO",aborted:"\u26A0 CANCELADO",idle:"INACTIVO"}},wt={dishcare_dishwasher_program_intensiv_70:"Intensive 70\xB0C",dishcare_dishwasher_program_auto_2:"Auto 2",dishcare_dishwasher_program_eco_50:"Eco 50\xB0C",dishcare_dishwasher_program_pre_rinse:"Pre-rinse",dishcare_dishwasher_program_night_wash:"Night wash",dishcare_dishwasher_program_kurz_60:"Speed 60\xB0C",dishcare_dishwasher_program_machine_care:"Machine care",dishcare_dishwasher_program_quick_45:"Quick 45\xB0C",dishcare_dishwasher_program_intensiv_power:"Intensive power",dishcare_dishwasher_program_super_60:"Super 60\xB0C",dishcare_dishwasher_program_mixed_load:"Mixed load",dishcare_dishwasher_program_glas_40:"Glass 40\xB0C"};function At(r){return!r||r==="unavailable"||r==="unknown"?r:wt[r]?wt[r]:r.replace(/^.*_program_/,"").replace(/_(\d+)$/," $1\xB0C").replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}var St={power:{domain:"switch",translationKey:"power",prefixSuffix:"power"},child_lock:{domain:"switch",translationKey:"child_lock",prefixSuffix:"child_lock"},vario_speed:{domain:"switch",translationKey:"vario_speed_plus",prefixSuffix:"vario_speed_plus"},silence_on_demand:{domain:"switch",translationKey:"silence_on_demand",prefixSuffix:"silence_on_demand"},extra_dry:{domain:"switch",translationKey:"extra_dry",prefixSuffix:"extra_dry"},half_load:{domain:"switch",translationKey:"half_load",prefixSuffix:"half_load"},active_program:{domain:"select",translationKey:"active_program",prefixSuffix:"active_program"},selected_program:{domain:"select",translationKey:"selected_program",prefixSuffix:"selected_program"},door:{domain:"sensor",translationKey:"door_state",prefixSuffix:"door"},operation_state:{domain:"sensor",translationKey:"operation_state",prefixSuffix:"operation_state"},program_progress:{domain:"sensor",translationKey:"program_progress",prefixSuffix:"program_progress"},program_finish_time:{domain:"sensor",translationKey:"remaining_program_time",prefixSuffix:"program_finish_time"},salt_warning:{domain:"binary_sensor",translationKey:"salt_nearly_empty",prefixSuffix:"salt_nearly_empty"},rinse_warning:{domain:"binary_sensor",translationKey:"rinse_aid_nearly_empty",prefixSuffix:"rinse_aid_nearly_empty"},remote_control:{domain:"binary_sensor",translationKey:"remote_control",prefixSuffix:"remote_control"},stop_program:{domain:"button",translationKey:"stop_program",prefixSuffix:"stop_program"}},L=class extends m{setConfig(t){if(!t.device&&!t.entity_prefix)throw new Error("A `device` (Bosch dishwasher) is required.");this.config=t,t.entity_prefix&&!t.device&&console.warn("[bosch-dishwasher-card] `entity_prefix` is deprecated; switch to the `device` selector. Support will be removed in v1.0.0.")}static getStubConfig(){return{type:"custom:bosch-dishwasher-card",device:""}}static getConfigElement(){return document.createElement("bosch-dishwasher-card-editor")}getCardSize(){return 4}_t(t){let e=(this.hass?.locale?.language??"en").split("-")[0];return(et[e]??et.en)[t]??et.en[t]??t}_entityId(t){let e=St[t];if(e){if(this.config.device&&this.hass?.entities){for(let s of Object.values(this.hass.entities))if(s.device_id===this.config.device&&s.entity_id?.startsWith(`${e.domain}.`)&&s.translation_key===e.translationKey)return s.entity_id;return}if(this.config.entity_prefix)return`${e.domain}.${this.config.entity_prefix}_${e.prefixSuffix}`}}_entity(t){let e=this._entityId(t);return e?this.hass?.states?.[e]:void 0}_state(t){return this._entity(t)?.state??"unavailable"}_attr(t,e){return this._entity(t)?.attributes?.[e]}_call(t,e,s={}){let i=this._entityId(t);if(!i||!this.hass)return;let o=i.split(".")[0];this.hass.callService(o,e,{entity_id:i,...s})}_watchedEntities(){let t=[];for(let e of Object.keys(St)){let s=this._entityId(e);s&&t.push(s)}return t}shouldUpdate(t){if(t.has("config"))return!0;if(!t.has("hass"))return!1;let e=t.get("hass");if(!e)return!0;for(let s of this._watchedEntities())if(e.states[s]!==this.hass.states[s])return!0;return!1}_operationState(){return this._state("operation_state").toLowerCase()}_isRunning(){let t=this._operationState();return t==="run"||t==="running"}_badge(){let t=this._operationState();return t==="run"||t==="running"?{text:this._t("running"),cls:"badge-running"}:t==="finished"||t==="finish"?{text:this._t("finished"),cls:"badge-finished"}:t==="aborting"||t==="aborted"?{text:this._t("aborted"),cls:"badge-aborted"}:{text:t?t.toUpperCase():this._t("idle"),cls:"badge-idle"}}_isDoorOpen(){return this._state("door").toLowerCase()==="open"}_isWarning(t){let e=this._state(t).toLowerCase();return e==="on"||e==="true"||e==="present"||e==="confirmed"}_progress(){let t=parseInt(this._state("program_progress"),10);return Number.isNaN(t)?0:Math.min(100,Math.max(0,t))}_finishTime(){let t=this._state("program_finish_time");if(!t||t==="unavailable"||t==="unknown"||t==="0")return null;if(/^\d{4}-\d{2}-\d{2}T/.test(t)){let e=new Date(t);if(!Number.isNaN(e.getTime()))return e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}return t}_renderDishwasher(t){return g`
      <svg class="bosch-dw ${t}" viewBox="0 0 80 110" width="72" height="100" aria-hidden="true">
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
        <text x="40" y="16" text-anchor="middle" font-size="5" font-family="monospace" font-weight="bold" fill="#00b4d8" class="display-text">${t==="running"?"\u2022\u2022\u2022\u2022":t==="finished"?"DONE":t==="aborted"?"STOP":"----"}</text>
        <circle cx="60" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="64" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="68" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="60" cy="16" r="0.8" fill="#30363d"/>
        <circle cx="64" cy="16" r="0.8" fill="#30363d"/>
        <circle cx="68" cy="16" r="0.8" fill="#30363d"/>
        <rect x="14" y="29" width="52" height="4" rx="2" fill="url(#dw-handle)"/>
      </svg>
    `}render(){if(!this.hass||!this.config)return g``;let t=(this.config.device&&this.hass.devices?.[this.config.device]?.name_by_user)??(this.config.device&&this.hass.devices?.[this.config.device]?.name)??this.config.entity_prefix??"Bosch Dishwasher",e=this.config.name??t,s=this._isRunning(),i=this._badge(),o=s?"running":i.cls==="badge-finished"?"finished":i.cls==="badge-aborted"?"aborted":"idle",n=this._progress(),d=this._finishTime(),a=this._state("active_program"),c=this._state("selected_program"),h=a&&a!=="unavailable"&&a!=="unknown"?a:c,l=!h||h==="unavailable"||h==="unknown"?this._t("stopped"):At(h),f=this._isDoorOpen(),u=this._isWarning("salt_warning"),y=this._isWarning("rinse_warning"),Et=this._state("remote_control")==="on",st=this._state("power")==="on",Ct=this._state("vario_speed")==="on",it=this._state("silence_on_demand"),Ot=it==="on",kt=it!=="unavailable",Nt=this._state("extra_dry")==="on",Pt=this._state("half_load")==="on",rt=this._attr("selected_program","options")??[];return g`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="dw-illustration">${this._renderDishwasher(o)}</div>
            <div class="header-info">
              <div class="header-top">
                <span class="card-name">${e}</span>
                <span class="badge ${i.cls}">${i.text}</span>
              </div>
              <div class="program-line">
                ${l}${d?g` · ${d}`:""}
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${n}%"></div>
              </div>
              <div class="progress-label">${n}%</div>
            </div>
          </div>

          <div class="sensors">
            <div class="sensor ${f?"warn":""}">
              <span class="sensor-icon">🚪</span>
              <span class="sensor-label">${this._t("door")}</span>
              <span class="sensor-value">${f?this._t("door_open"):this._t("door_closed")}</span>
            </div>
            <div class="sensor ${u?"warn":""}">
              <span class="sensor-icon">🧂</span>
              <span class="sensor-label">${this._t("salt")}</span>
              <span class="sensor-value">${u?this._t("salt_low"):this._t("ok")}</span>
            </div>
            <div class="sensor ${y?"warn":""}">
              <span class="sensor-icon">💧</span>
              <span class="sensor-label">${this._t("rinse_aid")}</span>
              <span class="sensor-value">${y?this._t("salt_low"):this._t("ok")}</span>
            </div>
            <div class="sensor">
              <span class="sensor-icon">📡</span>
              <span class="sensor-label">${this._t("remote")}</span>
              <span class="sensor-value">${Et?this._t("on"):this._t("off")}</span>
            </div>
          </div>

          <div class="controls">
            <div class="controls-label">${this._t("controls")}</div>
            <div class="controls-row">
              <button class="ctrl-btn ${st?"active":""}"
                      @click=${()=>this._call("power","toggle")}>
                ⏻ ${st?this._t("on"):this._t("off")}
              </button>
              <select class="ctrl-select"
                      .value=${c}
                      @change=${D=>this._call("selected_program","select_option",{option:D.target.value})}>
                ${rt.length===0?g`<option disabled>—</option>`:rt.map(D=>g`<option value="${D}">${At(D)}</option>`)}
              </select>
              <button class="ctrl-btn danger" ?disabled=${!s}
                      @click=${()=>this._call("stop_program","press")}>
                ⏹ ${this._t("stop")}
              </button>
            </div>
            <div class="controls-grid">
              <button class="ctrl-btn ${Ct?"active":""}"
                      @click=${()=>this._call("vario_speed","toggle")}>
                ⚡ ${this._t("turbo")}
              </button>
              <button class="ctrl-btn ${Ot?"active":""}" ?disabled=${!kt}
                      @click=${()=>this._call("silence_on_demand","toggle")}>
                🔇 ${this._t("silence")}
              </button>
              <button class="ctrl-btn ${Nt?"active":""}"
                      @click=${()=>this._call("extra_dry","toggle")}>
                🌡 ${this._t("extra_dry")}
              </button>
              <button class="ctrl-btn ${Pt?"active":""}"
                      @click=${()=>this._call("half_load","toggle")}>
                ½ ${this._t("half_load")}
              </button>
            </div>
          </div>
        </div>
      </ha-card>
    `}};C(L,"properties",{hass:{attribute:!1},config:{attribute:!1}}),C(L,"styles",j`
    ha-card {
      background: #0d1117;
      color: #e6edf3;
      border-radius: 12px;
      overflow: hidden;
      content-visibility: auto;
      contain-intrinsic-size: 0 260px;
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
    .progress-fill { height: 100%; background: linear-gradient(90deg, #00b4d8, #0077b6); border-radius: 2px; transition: width .5s ease; }
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
    @keyframes drop-fall {
      0%   { transform: translateY(-4px); opacity: 0; }
      12%  { opacity: 0.85; }
      88%  { opacity: 0.85; }
      100% { transform: translateY(70px); opacity: 0; }
    }
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
  `);var I=class extends m{setConfig(t){this._config=t}_valueChanged(t){if(!this._config)return;let e=t.target,s=e.configValue;if(!s)return;let i=t.detail?.value??e.value,o={...this._config,[s]:i};s==="name"&&!i&&delete o.name,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o}}))}render(){return!this.hass||!this._config?g``:g`
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
      </div>
    `}};C(I,"properties",{hass:{attribute:!1},_config:{state:!0}}),C(I,"styles",j`
    .form { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
    ha-device-picker, ha-textfield { display: block; width: 100%; }
  `);customElements.define("bosch-dishwasher-card",L);customElements.define("bosch-dishwasher-card-editor",I);window.customCards=window.customCards||[];window.customCards.push({type:"bosch-dishwasher-card",name:"Bosch Dishwasher Card",description:"Control and monitor a Bosch / Siemens / Neff / Balay dishwasher.",preview:!1,documentationURL:"https://github.com/iskael/bosch-dishwasher"});
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
