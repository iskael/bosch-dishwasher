var Pt=Object.defineProperty;var Tt=(o,t,e)=>t in o?Pt(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var O=(o,t,e)=>Tt(o,typeof t!="symbol"?t+"":t,e);var j=globalThis,F=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,q=Symbol(),ct=new WeakMap,N=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(F&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=ct.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ct.set(e,t))}return t}toString(){return this.cssText}},dt=o=>new N(typeof o=="string"?o:o+"",void 0,q),V=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new N(e,o,q)},ht=(o,t)=>{if(F)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=j.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,o.appendChild(s)}},Y=F?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return dt(e)})(o):o;var{is:Rt,defineProperty:Ut,getOwnPropertyDescriptor:Kt,getOwnPropertyNames:Lt,getOwnPropertySymbols:Mt,getPrototypeOf:It}=Object,y=globalThis,pt=y.trustedTypes,Dt=pt?pt.emptyScript:"",Ht=y.reactiveElementPolyfillSupport,P=(o,t)=>o,J={toAttribute(o,t){switch(t){case Boolean:o=o?Dt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},ut=(o,t)=>!Rt(o,t),_t={attribute:!0,type:String,converter:J,reflect:!1,useDefault:!1,hasChanged:ut};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),y.litPropertyMetadata??(y.litPropertyMetadata=new WeakMap);var m=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_t){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Ut(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:r}=Kt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let d=i?.call(this);r?.call(this,n),this.requestUpdate(t,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_t}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;let t=It(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){let e=this.properties,s=[...Lt(e),...Mt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(Y(i))}else t!==void 0&&e.push(Y(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ht(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:J).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:J;this._$Em=i;let d=n.fromAttribute(e,r.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(t!==void 0){let n=this.constructor;if(i===!1&&(r=this[t]),s??(s=n.getPropertyOptions(t)),!((s.hasChanged??ut)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),r!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:n}=r,d=this[i];n!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,r,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};m.elementStyles=[],m.shadowRootOptions={mode:"open"},m[P("elementProperties")]=new Map,m[P("finalized")]=new Map,Ht?.({ReactiveElement:m}),(y.reactiveElementVersions??(y.reactiveElementVersions=[])).push("2.1.2");var R=globalThis,gt=o=>o,W=R.trustedTypes,ft=W?W.createPolicy("lit-html",{createHTML:o=>o}):void 0,vt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,xt="?"+$,zt=`<${xt}>`,A=document,U=()=>A.createComment(""),K=o=>o===null||typeof o!="object"&&typeof o!="function",it=Array.isArray,Bt=o=>it(o)||typeof o?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mt=/-->/g,bt=/>/g,v=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),yt=/'/g,$t=/"/g,At=/^(?:script|style|textarea|title)$/i,ot=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),l=ot(1),Qt=ot(2),Xt=ot(3),S=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),wt=new WeakMap,x=A.createTreeWalker(A,129);function St(o,t){if(!it(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ft!==void 0?ft.createHTML(t):t}var jt=(o,t)=>{let e=o.length-1,s=[],i,r=t===2?"<svg>":t===3?"<math>":"",n=T;for(let d=0;d<e;d++){let a=o[d],h,p,c=-1,u=0;for(;u<a.length&&(n.lastIndex=u,p=n.exec(a),p!==null);)u=n.lastIndex,n===T?p[1]==="!--"?n=mt:p[1]!==void 0?n=bt:p[2]!==void 0?(At.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=v):p[3]!==void 0&&(n=v):n===v?p[0]===">"?(n=i??T,c=-1):p[1]===void 0?c=-2:(c=n.lastIndex-p[2].length,h=p[1],n=p[3]===void 0?v:p[3]==='"'?$t:yt):n===$t||n===yt?n=v:n===mt||n===bt?n=T:(n=v,i=void 0);let f=n===v&&o[d+1].startsWith("/>")?" ":"";r+=n===T?a+zt:c>=0?(s.push(h),a.slice(0,c)+vt+a.slice(c)+$+f):a+$+(c===-2?d:f)}return[St(o,r+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},L=class o{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0,d=t.length-1,a=this.parts,[h,p]=jt(t,e);if(this.el=o.createElement(h,s),x.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=x.nextNode())!==null&&a.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(vt)){let u=p[n++],f=i.getAttribute(c).split($),w=/([.?@])?(.*)/.exec(u);a.push({type:1,index:r,name:w[2],strings:f,ctor:w[1]==="."?Z:w[1]==="?"?tt:w[1]==="@"?et:k}),i.removeAttribute(c)}else c.startsWith($)&&(a.push({type:6,index:r}),i.removeAttribute(c));if(At.test(i.tagName)){let c=i.textContent.split($),u=c.length-1;if(u>0){i.textContent=W?W.emptyScript:"";for(let f=0;f<u;f++)i.append(c[f],U()),x.nextNode(),a.push({type:2,index:++r});i.append(c[u],U())}}}else if(i.nodeType===8)if(i.data===xt)a.push({type:2,index:r});else{let c=-1;for(;(c=i.data.indexOf($,c+1))!==-1;)a.push({type:7,index:r}),c+=$.length-1}r++}}static createElement(t,e){let s=A.createElement("template");return s.innerHTML=t,s}};function E(o,t,e=o,s){if(t===S)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,r=K(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(o),i._$AT(o,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=E(o,i._$AS(o,t.values),i,s)),t}var X=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??A).importNode(e,!0);x.currentNode=i;let r=x.nextNode(),n=0,d=0,a=s[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new M(r,r.nextSibling,this,t):a.type===1?h=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(h=new st(r,this,t)),this._$AV.push(h),a=s[++d]}n!==a?.index&&(r=x.nextNode(),n++)}return x.currentNode=A,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},M=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),K(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==S&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Bt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&K(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=L.createElement(St(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new X(i,this),n=r.u(this.options);r.p(e),this.T(n),this._$AH=r}}_$AC(t){let e=wt.get(t.strings);return e===void 0&&wt.set(t.strings,e=new L(t)),e}k(t){it(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let r of t)i===e.length?e.push(s=new o(this.O(U()),this.O(U()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=gt(t).nextSibling;gt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},k=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,i){let r=this.strings,n=!1;if(r===void 0)t=E(this,t,e,0),n=!K(t)||t!==this._$AH&&t!==S,n&&(this._$AH=t);else{let d=t,a,h;for(t=r[0],a=0;a<r.length-1;a++)h=E(this,d[s+a],e,a),h===S&&(h=this._$AH[a]),n||(n=!K(h)||h!==this._$AH[a]),h===_?t=_:t!==_&&(t+=(h??"")+r[a+1]),this._$AH[a]=h}n&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Z=class extends k{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},tt=class extends k{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},et=class extends k{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??_)===S)return;let s=this._$AH,i=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},st=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var Ft=R.litHtmlPolyfillSupport;Ft?.(L,M),(R.litHtmlVersions??(R.litHtmlVersions=[])).push("3.3.2");var Et=(o,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let r=e?.renderBefore??null;s._$litPart$=i=new M(t.insertBefore(U(),r),r,void 0,e??{})}return i._$AI(o),i};var I=globalThis,b=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Et(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};b._$litElement$=!0,b.finalized=!0,I.litElementHydrateSupport?.({LitElement:b});var Vt=I.litElementPolyfillSupport;Vt?.({LitElement:b});(I.litElementVersions??(I.litElementVersions=[])).push("4.2.2");var C={en:{controls:"CONTROLS",sensors_section:"SENSORS",door:"Door",door_open:"\u26A0 Open",door_closed:"Closed",salt:"Salt",salt_low:"\u26A0 Low",ok:"OK",rinse_aid:"Rinse aid",remote:"Remote",connected:"Connected",progress:"Progress",on:"ON",off:"OFF",yes:"Yes",no:"No",power:"Power",turbo:"TURBO",silence:"SILENCE",extra_dry:"EXTRA DRY",half_load:"HALF LOAD",child_lock:"CHILD LOCK",stop:"\u23F9 STOP",stopped:"Stopped",running:"\u25CF RUNNING",finished:"\u2713 FINISHED",aborted:"\u26A0 ABORTED",idle:"IDLE",delayed_start:"DELAYED",starts_at:"Starts at",sensors_title:"Sensors",controls_title:"Controls",show_all:"Show all"},es:{controls:"CONTROLES",sensors_section:"SENSORES",door:"Puerta",door_open:"\u26A0 Abierta",door_closed:"Cerrada",salt:"Sal",salt_low:"\u26A0 Baja",ok:"OK",rinse_aid:"Abrillantador",remote:"Remoto",connected:"Conectado",progress:"Progreso",on:"ON",off:"OFF",yes:"S\xED",no:"No",power:"Encendido",turbo:"TURBO",silence:"SILENCIO",extra_dry:"EXTRA SECO",half_load:"MEDIA CARGA",child_lock:"BLOQUEO",stop:"\u23F9 DETENER",stopped:"Detenido",running:"\u25CF EN MARCHA",finished:"\u2713 FINALIZADO",aborted:"\u26A0 CANCELADO",idle:"INACTIVO",delayed_start:"DIFERIDO",starts_at:"Inicia a las",sensors_title:"Sensores",controls_title:"Controles",show_all:"Mostrar todo"}},rt=[{key:"door",icon:"\u{1F6AA}",labelKey:"door"},{key:"salt_warning",icon:"\u{1F9C2}",labelKey:"salt"},{key:"rinse_warning",icon:"\u{1F4A7}",labelKey:"rinse_aid"},{key:"remote_control",icon:"\u{1F4E1}",labelKey:"remote"},{key:"connected",icon:"\u{1F517}",labelKey:"connected"}],Nt=[{key:"power",type:"toggle",icon:"\u23FB",labelKey:"power"},{key:"selected_program",type:"select",icon:"",labelKey:null},{key:"stop_program",type:"button",icon:"",labelKey:"stop"},{key:"vario_speed",type:"toggle",icon:"\u26A1",labelKey:"turbo"},{key:"silence_on_demand",type:"toggle",icon:"\u{1F507}",labelKey:"silence"},{key:"extra_dry",type:"toggle",icon:"\u{1F321}",labelKey:"extra_dry"},{key:"half_load",type:"toggle",icon:"\xBD",labelKey:"half_load"},{key:"child_lock",type:"toggle",icon:"\u{1F512}",labelKey:"child_lock"}],z=rt.map(o=>o.key),B=["power","selected_program","stop_program","vario_speed","silence_on_demand","extra_dry","half_load"],kt={dishcare_dishwasher_program_intensiv_70:"Intensive 70\xB0C",dishcare_dishwasher_program_auto_2:"Auto 2",dishcare_dishwasher_program_eco_50:"Eco 50\xB0C",dishcare_dishwasher_program_pre_rinse:"Pre-rinse",dishcare_dishwasher_program_night_wash:"Night wash",dishcare_dishwasher_program_kurz_60:"Speed 60\xB0C",dishcare_dishwasher_program_machine_care:"Machine care",dishcare_dishwasher_program_quick_45:"Quick 45\xB0C",dishcare_dishwasher_program_intensiv_power:"Intensive power",dishcare_dishwasher_program_super_60:"Super 60\xB0C",dishcare_dishwasher_program_mixed_load:"Mixed load",dishcare_dishwasher_program_glas_40:"Glass 40\xB0C"};function Ct(o){return!o||o==="unavailable"||o==="unknown"?o:kt[o]?kt[o]:o.replace(/^.*_program_/,"").replace(/_(\d+)$/," $1\xB0C").replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}var Ot={power:{domain:"switch",translationKey:"power"},child_lock:{domain:"switch",translationKey:"child_lock"},vario_speed:{domain:"switch",translationKey:"vario_speed_plus"},silence_on_demand:{domain:"switch",translationKey:"silence_on_demand"},extra_dry:{domain:"switch",translationKey:"extra_dry"},half_load:{domain:"switch",translationKey:"half_load"},active_program:{domain:"select",translationKey:"active_program"},selected_program:{domain:"select",translationKey:"selected_program"},door:{domain:"sensor",translationKey:"door_state"},operation_state:{domain:"sensor",translationKey:"operation_state"},program_progress:{domain:"sensor",translationKey:"program_progress"},program_finish_time:{domain:"sensor",translationKey:"remaining_program_time"},salt_warning:{domain:"binary_sensor",translationKey:"salt_nearly_empty"},rinse_warning:{domain:"binary_sensor",translationKey:"rinse_aid_nearly_empty"},remote_control:{domain:"binary_sensor",translationKey:"remote_control"},connected:{domain:"binary_sensor",translationKey:"connected"},start_in_relative:{domain:"sensor",translationKey:"start_in_relative"},stop_program:{domain:"button",translationKey:"stop_program"}},D=class extends b{setConfig(t){if(!t.device)throw new Error("A `device` (Bosch dishwasher) is required. Remove any `entity_prefix` and use the device picker in the card editor.");this.config={sensors:z,controls:B,...t}}static getStubConfig(){return{type:"custom:bosch-dishwasher-card",device:"",sensors:z,controls:B}}static getConfigElement(){return document.createElement("bosch-dishwasher-card-editor")}getCardSize(){return 4}_t(t){let e=(this.hass?.locale?.language??"en").split("-")[0];return(C[e]??C.en)[t]??C.en[t]??t}_entityId(t){let e=Ot[t];if(!(!e||!this.config.device||!this.hass?.entities)){for(let s of Object.values(this.hass.entities))if(s.device_id===this.config.device&&s.entity_id?.startsWith(`${e.domain}.`)&&s.translation_key===e.translationKey)return s.entity_id}}_entity(t){let e=this._entityId(t);return e?this.hass?.states?.[e]:void 0}_state(t){return this._entity(t)?.state??"unavailable"}_attr(t,e){return this._entity(t)?.attributes?.[e]}_call(t,e,s={}){let i=this._entityId(t);!i||!this.hass||this.hass.callService(i.split(".")[0],e,{entity_id:i,...s})}_watchedEntities(){return Object.keys(Ot).map(t=>this._entityId(t)).filter(Boolean)}shouldUpdate(t){if(t.has("config"))return!0;if(!t.has("hass"))return!1;let e=t.get("hass");if(!e)return!0;for(let s of this._watchedEntities())if(e.states[s]!==this.hass.states[s])return!0;return!1}_operationState(){return this._state("operation_state").toLowerCase()}_isRunning(){let t=this._operationState();return t==="run"||t==="running"}_badge(){let t=this._operationState();return t==="run"||t==="running"?{text:this._t("running"),cls:"badge-running"}:t==="finished"||t==="finish"?{text:this._t("finished"),cls:"badge-finished"}:t==="aborting"||t==="aborted"?{text:this._t("aborted"),cls:"badge-aborted"}:t==="delayed_start"||t==="delayedstart"?{text:this._t("delayed_start"),cls:"badge-delayed"}:{text:t?t.toUpperCase():this._t("idle"),cls:"badge-idle"}}_startTime(){let t=this._state("start_in_relative");if(!t||t==="unavailable"||t==="unknown")return null;if(/^\d{4}-\d{2}-\d{2}T/.test(t)){let e=new Date(t);if(!Number.isNaN(e.getTime()))return e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}return null}_isWarning(t){let e=this._state(t).toLowerCase();return e==="on"||e==="true"||e==="present"||e==="confirmed"}_progress(){let t=parseInt(this._state("program_progress"),10);return Number.isNaN(t)?0:Math.min(100,Math.max(0,t))}_finishTime(){let t=this._state("program_finish_time");if(!t||t==="unavailable"||t==="unknown"||t==="0")return null;if(/^\d{4}-\d{2}-\d{2}T/.test(t)){let e=new Date(t);if(!Number.isNaN(e.getTime()))return e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}return t}_renderDishwasher(t){return l`
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
    `}_renderSensor(t){switch(t.key){case"door":{let e=this._state("door").toLowerCase()==="open";return l`
          <div class="sensor ${e?"warn":""}">
            <span class="sensor-icon">${t.icon}</span>
            <span class="sensor-label">${this._t(t.labelKey)}</span>
            <span class="sensor-value">${e?this._t("door_open"):this._t("door_closed")}</span>
          </div>`}case"salt_warning":{let e=this._isWarning("salt_warning");return l`
          <div class="sensor ${e?"warn":""}">
            <span class="sensor-icon">${t.icon}</span>
            <span class="sensor-label">${this._t(t.labelKey)}</span>
            <span class="sensor-value">${e?this._t("salt_low"):this._t("ok")}</span>
          </div>`}case"rinse_warning":{let e=this._isWarning("rinse_warning");return l`
          <div class="sensor ${e?"warn":""}">
            <span class="sensor-icon">${t.icon}</span>
            <span class="sensor-label">${this._t(t.labelKey)}</span>
            <span class="sensor-value">${e?this._t("salt_low"):this._t("ok")}</span>
          </div>`}case"remote_control":{let e=this._state("remote_control")==="on";return l`
          <div class="sensor">
            <span class="sensor-icon">${t.icon}</span>
            <span class="sensor-label">${this._t(t.labelKey)}</span>
            <span class="sensor-value">${e?this._t("on"):this._t("off")}</span>
          </div>`}case"connected":{let e=this._state("connected")==="on";return l`
          <div class="sensor ${e?"":"warn"}">
            <span class="sensor-icon">${t.icon}</span>
            <span class="sensor-label">${this._t(t.labelKey)}</span>
            <span class="sensor-value">${e?this._t("yes"):this._t("no")}</span>
          </div>`}default:return l``}}_renderControl(t,e){switch(t.key){case"power":{let s=this._state("power")==="on";return l`
          <button class="ctrl-btn ${s?"active":""}" @click=${()=>this._call("power","toggle")}>
            ${t.icon} ${s?this._t("on"):this._t("off")}
          </button>`}case"selected_program":{let s=this._state("selected_program"),i=this._attr("selected_program","options")??[];return l`
          <select class="ctrl-select"
                  .value=${s}
                  @change=${r=>this._call("selected_program","select_option",{option:r.target.value})}>
            ${i.length===0?l`<option disabled>—</option>`:i.map(r=>l`<option value="${r}">${Ct(r)}</option>`)}
          </select>`}case"stop_program":return l`
          <button class="ctrl-btn danger" ?disabled=${!e}
                  @click=${()=>this._call("stop_program","press")}>
            ${this._t("stop")}
          </button>`;case"vario_speed":{let s=this._state("vario_speed")==="on";return l`
          <button class="ctrl-btn ${s?"active":""}" @click=${()=>this._call("vario_speed","toggle")}>
            ${t.icon} ${this._t(t.labelKey)}
          </button>`}case"silence_on_demand":{let s=this._state("silence_on_demand");return l`
          <button class="ctrl-btn ${s==="on"?"active":""}" ?disabled=${!(s!=="unavailable")}
                  @click=${()=>this._call("silence_on_demand","toggle")}>
            ${t.icon} ${this._t(t.labelKey)}
          </button>`}case"extra_dry":{let s=this._state("extra_dry")==="on";return l`
          <button class="ctrl-btn ${s?"active":""}" @click=${()=>this._call("extra_dry","toggle")}>
            ${t.icon} ${this._t(t.labelKey)}
          </button>`}case"half_load":{let s=this._state("half_load")==="on";return l`
          <button class="ctrl-btn ${s?"active":""}" @click=${()=>this._call("half_load","toggle")}>
            ${t.icon} ${this._t(t.labelKey)}
          </button>`}case"child_lock":{let s=this._state("child_lock")==="on";return l`
          <button class="ctrl-btn ${s?"active":""}" @click=${()=>this._call("child_lock","toggle")}>
            ${t.icon} ${this._t(t.labelKey)}
          </button>`}default:return l``}}render(){if(!this.hass||!this.config)return l``;let t=this.hass.devices?.[this.config.device]?.name_by_user??this.hass.devices?.[this.config.device]?.name??"Bosch Dishwasher",e=this.config.name??t,s=this._isRunning(),i=this._badge(),r=i.cls==="badge-delayed",n=s?"running":i.cls==="badge-finished"?"finished":i.cls==="badge-aborted"?"aborted":"idle",d=this._progress(),a=this._finishTime(),h=r?this._startTime():null,p=this._state("active_program"),c=this._state("selected_program"),u=p&&p!=="unavailable"&&p!=="unknown"?p:c,f=!u||u==="unavailable"||u==="unknown"?this._t("stopped"):Ct(u),w=rt.filter(g=>(this.config.sensors??z).includes(g.key)),G=Nt.filter(g=>(this.config.controls??B).includes(g.key)),nt=["power","selected_program","stop_program"],at=G.filter(g=>nt.includes(g.key)),lt=G.filter(g=>!nt.includes(g.key));return l`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="dw-illustration">${this._renderDishwasher(n)}</div>
            <div class="header-info">
              <div class="header-top">
                <span class="card-name">${e}</span>
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

          ${w.length>0?l`
            <div class="sensors">
              ${w.map(g=>this._renderSensor(g))}
            </div>
          `:""}

          ${G.length>0?l`
            <div class="controls">
              <div class="controls-label">${this._t("controls")}</div>
              ${at.length>0?l`
                <div class="controls-row">
                  ${at.map(g=>this._renderControl(g,s))}
                </div>
              `:""}
              ${lt.length>0?l`
                <div class="controls-grid">
                  ${lt.map(g=>this._renderControl(g,s))}
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
  `);var H=class extends b{setConfig(t){this._config={sensors:z,controls:B,...t}}_valueChanged(t){if(!this._config)return;let e=t.target,s=e.configValue;if(!s)return;let i=t.detail?.value??e.value,r={...this._config,[s]:i};s==="name"&&!i&&delete r.name,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))}_toggleItem(t,e){let s=[...this._config[t]??[]],i=s.indexOf(e);i>=0?s.splice(i,1):s.push(e);let r={...this._config,[t]:s};this._config=r,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))}_lang(){let t=(this.hass?.locale?.language??"en").split("-")[0];return C[t]??C.en}_t(t){return this._lang()[t]??C.en[t]??t}_sensorLabel(t){return this._t(t.labelKey)??t.key}_controlLabel(t){return t.key==="selected_program"?"Programa / Program":`${t.icon} ${this._t(t.labelKey)}`.trim()}render(){if(!this.hass||!this._config)return l``;let t=this._config.sensors??z,e=this._config.controls??B;return l`
      <div class="form">
        <ha-device-picker
          .hass=${this.hass}
          .value=${this._config.device??""}
          .configValue=${"device"}
          .integrations=${["bosch_dishwasher"]}
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
          ${rt.map(s=>l`
            <label class="check-row">
              <input type="checkbox"
                     .checked=${t.includes(s.key)}
                     @change=${()=>this._toggleItem("sensors",s.key)}>
              <span>${s.icon} ${this._sensorLabel(s)}</span>
            </label>
          `)}
        </div>

        <div class="section-title">${this._t("controls_title")}</div>
        <div class="check-grid">
          ${Nt.map(s=>l`
            <label class="check-row">
              <input type="checkbox"
                     .checked=${e.includes(s.key)}
                     @change=${()=>this._toggleItem("controls",s.key)}>
              <span>${this._controlLabel(s)}</span>
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
  `);customElements.define("bosch-dishwasher-card",D);customElements.define("bosch-dishwasher-card-editor",H);window.customCards=window.customCards||[];window.customCards.push({type:"bosch-dishwasher-card",name:"Bosch Dishwasher Card",description:"Control and monitor a Bosch / Siemens / Neff / Balay dishwasher.",preview:!1,documentationURL:"https://github.com/iskael/bosch-dishwasher"});
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
