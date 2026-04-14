var Ot=Object.defineProperty;var Pt=(r,t,e)=>t in r?Ot(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var j=(r,t,e)=>Pt(r,typeof t!="symbol"?t+"":t,e);var D=globalThis,z=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),it=new WeakMap,C=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(z&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=it.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&it.set(e,t))}return t}toString(){return this.cssText}},rt=r=>new C(typeof r=="string"?r:r+"",void 0,B),W=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new C(e,r,B)},ot=(r,t)=>{if(z)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=D.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},G=z?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return rt(e)})(r):r;var{is:kt,defineProperty:Ut,getOwnPropertyDescriptor:Nt,getOwnPropertyNames:Tt,getOwnPropertySymbols:Rt,getPrototypeOf:Mt}=Object,g=globalThis,nt=g.trustedTypes,Ht=nt?nt.emptyScript:"",Lt=g.reactiveElementPolyfillSupport,O=(r,t)=>r,V={toAttribute(r,t){switch(t){case Boolean:r=r?Ht:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},lt=(r,t)=>!kt(r,t),at={attribute:!0,type:String,converter:V,reflect:!1,useDefault:!1,hasChanged:lt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),g.litPropertyMetadata??(g.litPropertyMetadata=new WeakMap);var f=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=at){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Ut(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=Nt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let c=i?.call(this);o?.call(this,n),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??at}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=Mt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,s=[...Tt(e),...Rt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(G(i))}else t!==void 0&&e.push(G(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ot(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:V).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:V;this._$Em=i;let c=n.fromAttribute(e,o.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),s??(s=n.getPropertyOptions(t)),!((s.hasChanged??lt)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:n}=o,c=this[i];n!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,o,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[O("elementProperties")]=new Map,f[O("finalized")]=new Map,Lt?.({ReactiveElement:f}),(g.reactiveElementVersions??(g.reactiveElementVersions=[])).push("2.1.2");var k=globalThis,ct=r=>r,I=k.trustedTypes,dt=I?I.createPolicy("lit-html",{createHTML:r=>r}):void 0,gt="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,bt="?"+b,Dt=`<${bt}>`,w=document,U=()=>w.createComment(""),N=r=>r===null||typeof r!="object"&&typeof r!="function",X=Array.isArray,zt=r=>X(r)||typeof r?.[Symbol.iterator]=="function",q=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ht=/-->/g,pt=/>/g,m=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ut=/'/g,_t=/"/g,$t=/^(?:script|style|textarea|title)$/i,Z=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),v=Z(1),Ft=Z(2),Jt=Z(3),x=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),ft=new WeakMap,y=w.createTreeWalker(w,129);function mt(r,t){if(!X(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(t):t}var It=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=P;for(let c=0;c<e;c++){let a=r[c],d,h,l=-1,u=0;for(;u<a.length&&(n.lastIndex=u,h=n.exec(a),h!==null);)u=n.lastIndex,n===P?h[1]==="!--"?n=ht:h[1]!==void 0?n=pt:h[2]!==void 0?($t.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=m):h[3]!==void 0&&(n=m):n===m?h[0]===">"?(n=i??P,l=-1):h[1]===void 0?l=-2:(l=n.lastIndex-h[2].length,d=h[1],n=h[3]===void 0?m:h[3]==='"'?_t:ut):n===_t||n===ut?n=m:n===ht||n===pt?n=P:(n=m,i=void 0);let _=n===m&&r[c+1].startsWith("/>")?" ":"";o+=n===P?a+Dt:l>=0?(s.push(d),a.slice(0,l)+gt+a.slice(l)+b+_):a+b+(l===-2?c:_)}return[mt(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},T=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,c=t.length-1,a=this.parts,[d,h]=It(t,e);if(this.el=r.createElement(d,s),y.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(i=y.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let l of i.getAttributeNames())if(l.endsWith(gt)){let u=h[n++],_=i.getAttribute(l).split(b),A=/([.?@])?(.*)/.exec(u);a.push({type:1,index:o,name:A[2],strings:_,ctor:A[1]==="."?F:A[1]==="?"?J:A[1]==="@"?Y:E}),i.removeAttribute(l)}else l.startsWith(b)&&(a.push({type:6,index:o}),i.removeAttribute(l));if($t.test(i.tagName)){let l=i.textContent.split(b),u=l.length-1;if(u>0){i.textContent=I?I.emptyScript:"";for(let _=0;_<u;_++)i.append(l[_],U()),y.nextNode(),a.push({type:2,index:++o});i.append(l[u],U())}}}else if(i.nodeType===8)if(i.data===bt)a.push({type:2,index:o});else{let l=-1;for(;(l=i.data.indexOf(b,l+1))!==-1;)a.push({type:7,index:o}),l+=b.length-1}o++}}static createElement(t,e){let s=w.createElement("template");return s.innerHTML=t,s}};function S(r,t,e=r,s){if(t===x)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=N(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=S(r,i._$AS(r,t.values),i,s)),t}var K=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??w).importNode(e,!0);y.currentNode=i;let o=y.nextNode(),n=0,c=0,a=s[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new R(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new Q(o,this,t)),this._$AV.push(d),a=s[++c]}n!==a?.index&&(o=y.nextNode(),n++)}return y.currentNode=w,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},R=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=S(this,t,e),N(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==x&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):zt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=T.createElement(mt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new K(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=ft.get(t.strings);return e===void 0&&ft.set(t.strings,e=new T(t)),e}k(t){X(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(U()),this.O(U()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ct(t).nextSibling;ct(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=S(this,t,e,0),n=!N(t)||t!==this._$AH&&t!==x,n&&(this._$AH=t);else{let c=t,a,d;for(t=o[0],a=0;a<o.length-1;a++)d=S(this,c[s+a],e,a),d===x&&(d=this._$AH[a]),n||(n=!N(d)||d!==this._$AH[a]),d===p?t=p:t!==p&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}n&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},F=class extends E{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},J=class extends E{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},Y=class extends E{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=S(this,t,e,0)??p)===x)return;let s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Q=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t)}};var jt=k.litHtmlPolyfillSupport;jt?.(T,R),(k.litHtmlVersions??(k.litHtmlVersions=[])).push("3.3.2");var yt=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new R(t.insertBefore(U(),o),o,void 0,e??{})}return i._$AI(r),i};var M=globalThis,$=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=yt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};$._$litElement$=!0,$.finalized=!0,M.litElementHydrateSupport?.({LitElement:$});var Bt=M.litElementPolyfillSupport;Bt?.({LitElement:$});(M.litElementVersions??(M.litElementVersions=[])).push("4.2.2");var wt={dishcare_dishwasher_program_intensiv_70:"Intensive 70\xB0C",dishcare_dishwasher_program_auto_2:"Auto 2",dishcare_dishwasher_program_eco_50:"Eco 50\xB0C",dishcare_dishwasher_program_pre_rinse:"Pre-rinse",dishcare_dishwasher_program_night_wash:"Night wash",dishcare_dishwasher_program_kurz_60:"Speed 60\xB0C",dishcare_dishwasher_program_machine_care:"Machine care",dishcare_dishwasher_program_quick_45:"Quick 45\xB0C",dishcare_dishwasher_program_intensiv_power:"Intensive power",dishcare_dishwasher_program_super_60:"Super 60\xB0C",dishcare_dishwasher_program_mixed_load:"Mixed load",dishcare_dishwasher_program_glas_40:"Glass 40\xB0C"};function xt(r){return!r||r==="unavailable"||r==="unknown"?r:wt[r]?wt[r]:r.replace(/^.*_program_/,"").replace(/_(\d+)$/," $1\xB0C").replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}var H=class extends ${setConfig(t){if(!t.entity_prefix)throw new Error("entity_prefix is required");this.config=t}getCardSize(){return 4}_watchedEntities(){let t=this.config.entity_prefix;return[`switch.${t}_power`,`switch.${t}_vario_speed`,`switch.${t}_silence_on_demand`,`switch.${t}_extra_dry`,`switch.${t}_half_load`,`select.${t}_active_program`,`select.${t}_selected_program`,`sensor.${t}_door`,`sensor.${t}_operation_state`,`sensor.${t}_program_progress`,`sensor.${t}_program_finish_time`,`sensor.${t}_salt_nearly_empty`,`sensor.${t}_rinse_aid_nearly_empty`,`binary_sensor.${t}_remote_control`]}shouldUpdate(t){if(t.has("config"))return!0;if(!t.has("hass"))return!1;let e=t.get("hass");if(!e)return!0;for(let s of this._watchedEntities())if(e.states[s]!==this.hass.states[s])return!0;return!1}_entity(t,e){let s=`${t}.${this.config.entity_prefix}_${e}`;return this.hass?.states[s]}_state(t,e){return this._entity(t,e)?.state??"unavailable"}_attr(t,e,s){return this._entity(t,e)?.attributes?.[s]}_call(t,e,s,i={}){if(!this.hass)return;let o=`${t}.${this.config.entity_prefix}_${s}`;this.hass.callService(t,e,{entity_id:o,...i})}_finishTime(){let t=this._state("sensor","program_finish_time");return!t||t==="unavailable"||t==="0"?null:t}_isWarning(t,e){let s=this._state(t,e).toLowerCase();return s==="on"||s==="true"}_isDoorOpen(){return this._state("sensor","door").toLowerCase()==="open"}_operationState(){return this._state("sensor","operation_state").toLowerCase()}_isRunning(){let t=this._operationState();return t==="run"||t==="running"}_badge(){let t=this._operationState();return t==="run"||t==="running"?{text:"\u25CF RUNNING",cls:"badge-running"}:t==="finished"||t==="finish"?{text:"\u2713 FINISHED",cls:"badge-finished"}:t==="aborting"||t==="aborted"?{text:"\u26A0 ABORTED",cls:"badge-aborted"}:{text:t?t.toUpperCase():"IDLE",cls:"badge-idle"}}_progress(){let t=this._state("sensor","program_progress"),e=parseInt(t,10);return isNaN(e)?0:Math.min(100,Math.max(0,e))}_renderDishwasher(t){return v`
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

        <!-- ground shadow -->
        <ellipse cx="40" cy="106" rx="32" ry="1.8" fill="#000" opacity="0.35"/>

        <!-- feet -->
        <rect x="10" y="100" width="5" height="4" fill="#0d1117"/>
        <rect x="65" y="100" width="5" height="4" fill="#0d1117"/>

        <!-- main door -->
        <rect x="6" y="26" width="68" height="74" rx="2"
              fill="url(#dw-door)" stroke="#30363d" stroke-width="1"/>
        <rect x="6" y="26" width="68" height="74" rx="2" fill="url(#dw-gloss)"/>

        <!-- falling water drops (only rendered when running) -->
        <g clip-path="url(#dw-door-clip)" class="water-drops">
          <circle class="drop d1" cx="18" cy="30" r="1.2" fill="#48cae4"/>
          <circle class="drop d2" cx="32" cy="28" r="1.0" fill="#48cae4"/>
          <circle class="drop d3" cx="48" cy="31" r="1.3" fill="#48cae4"/>
          <circle class="drop d4" cx="62" cy="29" r="1.0" fill="#48cae4"/>
          <circle class="drop d5" cx="24" cy="32" r="1.1" fill="#48cae4"/>
          <circle class="drop d6" cx="56" cy="30" r="1.2" fill="#48cae4"/>
        </g>

        <!-- subtle brand accent strip -->
        <rect x="32" y="62" width="16" height="0.8" fill="#8b949e" opacity="0.25"/>

        <!-- control panel (top strip) -->
        <rect x="6" y="6" width="68" height="16" rx="1.5"
              fill="#0d1117" stroke="#30363d" stroke-width="1"/>

        <!-- status LED -->
        <circle cx="12" cy="14" r="1.8" class="led"/>
        <circle cx="12" cy="14" r="2.8" class="led-glow"/>

        <!-- digital display -->
        <rect x="28" y="10" width="24" height="8" rx="0.8" fill="#001015"
              stroke="#00b4d830" stroke-width="0.4"/>
        <text x="40" y="16" text-anchor="middle"
              font-size="5" font-family="monospace"
              font-weight="bold" fill="#00b4d8"
              class="display-text">${t==="running"?"\u2022\u2022\u2022\u2022":t==="finished"?"DONE":t==="aborted"?"STOP":"----"}</text>

        <!-- program indicator dots -->
        <circle cx="60" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="64" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="68" cy="12" r="0.8" fill="#30363d"/>
        <circle cx="60" cy="16" r="0.8" fill="#30363d"/>
        <circle cx="64" cy="16" r="0.8" fill="#30363d"/>
        <circle cx="68" cy="16" r="0.8" fill="#30363d"/>

        <!-- handle (below control panel) -->
        <rect x="14" y="29" width="52" height="4" rx="2" fill="url(#dw-handle)"/>
      </svg>
    `}render(){if(!this.hass||!this.config)return v``;let t=this.config.name??this.config.entity_prefix,e=this._isRunning(),s=this._badge(),i=e?"running":s.cls==="badge-finished"?"finished":s.cls==="badge-aborted"?"aborted":"idle",o=this._progress(),n=this._finishTime(),c=this._state("select","active_program"),a=this._state("select","selected_program"),d=c&&c!=="unavailable"&&c!=="unknown"?c:a,h=!d||d==="unavailable"||d==="unknown"?"Detenido":xt(d),l=this._isDoorOpen(),u=this._isWarning("sensor","salt_nearly_empty"),_=this._isWarning("sensor","rinse_aid_nearly_empty"),A=this._state("binary_sensor","remote_control")==="on",tt=this._state("switch","power")==="on",vt=this._state("switch","vario_speed")==="on",et=this._state("switch","silence_on_demand"),At=et==="on",St=et!=="unavailable",Et=this._state("switch","extra_dry")==="on",Ct=this._state("switch","half_load")==="on",st=this._attr("select","selected_program","options")??[];return v`
      <ha-card>
        <div class="card-content">

          <!-- Header zone -->
          <div class="header">
            <div class="dw-illustration">
              ${this._renderDishwasher(i)}
            </div>
            <div class="header-info">
              <div class="header-top">
                <span class="card-name">${t}</span>
                <span class="badge ${s.cls}">${s.text}</span>
              </div>
              <div class="program-line">
                ${h}${n?v` · ${n}`:""}
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${o}%"></div>
              </div>
              <div class="progress-label">${o}%</div>
            </div>
          </div>

          <!-- Sensors grid -->
          <div class="sensors">
            <div class="sensor ${l?"warn":""}">
              <span class="sensor-icon">🚪</span>
              <span class="sensor-label">Puerta</span>
              <span class="sensor-value">${l?"\u26A0 Abierta":"Cerrada"}</span>
            </div>
            <div class="sensor ${u?"warn":""}">
              <span class="sensor-icon">🧂</span>
              <span class="sensor-label">Sal</span>
              <span class="sensor-value">${u?"\u26A0 Baja":"OK"}</span>
            </div>
            <div class="sensor ${_?"warn":""}">
              <span class="sensor-icon">💧</span>
              <span class="sensor-label">Abrillantador</span>
              <span class="sensor-value">${_?"\u26A0 Bajo":"OK"}</span>
            </div>
            <div class="sensor">
              <span class="sensor-icon">📡</span>
              <span class="sensor-label">Remoto</span>
              <span class="sensor-value">${A?"ON":"OFF"}</span>
            </div>
          </div>

          <!-- Controls -->
          <div class="controls">
            <div class="controls-label">CONTROLES</div>
            <div class="controls-row">
              <button
                class="ctrl-btn ${tt?"active":""}"
                @click=${()=>this._call("switch","toggle","power")}>
                ⏻ ${tt?"ON":"OFF"}
              </button>
              <select
                class="ctrl-select"
                .value=${a}
                @change=${L=>this._call("select","select_option","selected_program",{option:L.target.value})}>
                ${st.length===0?v`<option disabled>—</option>`:st.map(L=>v`<option value="${L}">${xt(L)}</option>`)}
              </select>
              <button
                class="ctrl-btn danger"
                ?disabled=${!e}
                @click=${()=>this._call("button","press","stop_program")}>
                ⏹ STOP
              </button>
            </div>
            <div class="controls-grid">
              <button
                class="ctrl-btn ${vt?"active":""}"
                @click=${()=>this._call("switch","toggle","vario_speed")}>
                ⚡ TURBO
              </button>
              <button
                class="ctrl-btn ${At?"active":""}"
                ?disabled=${!St}
                @click=${()=>this._call("switch","toggle","silence_on_demand")}>
                🔇 SILENCIO
              </button>
              <button
                class="ctrl-btn ${Et?"active":""}"
                @click=${()=>this._call("switch","toggle","extra_dry")}>
                🌡 EXTRA SECO
              </button>
              <button
                class="ctrl-btn ${Ct?"active":""}"
                @click=${()=>this._call("switch","toggle","half_load")}>
                ½ MEDIA CARGA
              </button>
            </div>
          </div>

        </div>
      </ha-card>
    `}};j(H,"properties",{hass:{attribute:!1},config:{attribute:!1}}),j(H,"styles",W`
    ha-card {
      background: #0d1117;
      color: #e6edf3;
      border-radius: 12px;
      overflow: hidden;
      /* Pause rendering (and any CSS animations inside) when the card
         is scrolled out of the viewport — saves paint/composite cost. */
      content-visibility: auto;
      contain-intrinsic-size: 0 260px;
    }
    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── Header ── */
    .header { display: flex; align-items: flex-start; gap: 12px; }

    .dw-illustration {
      flex-shrink: 0;
      width: 72px; height: 100px;
      display: flex; align-items: center; justify-content: center;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
    }

    .header-info { flex: 1; min-width: 0; }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
    }
    .card-name { font-weight: 700; font-size: 15px; }

    /* Badges */
    .badge {
      font-size: 10px; padding: 2px 8px;
      border-radius: 10px; font-weight: 700; letter-spacing: .5px;
    }
    .badge-running  { background: #00b4d8; color: #000; animation: blink-badge 1s step-end infinite; }
    .badge-finished { background: #34d39920; color: #34d399; border: 1px solid #34d39940; }
    .badge-aborted  { background: #ef444420; color: #ef4444; border: 1px solid #ef444440; }
    .badge-idle     { background: #21262d; color: #8b949e; }

    .program-line { color: #8b949e; font-size: 12px; margin-bottom: 5px; }

    /* Progress bar */
    .progress-bar {
      background: #21262d; height: 4px; border-radius: 2px;
      overflow: hidden; margin-bottom: 3px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00b4d8, #0077b6);
      border-radius: 2px;
      transition: width .5s ease;
    }
    .progress-label { font-size: 11px; color: #8b949e; }

    /* ── Dishwasher SVG ── */
    .bosch-dw { display: block; transition: opacity .3s; }
    .bosch-dw.idle { opacity: 0.55; }

    /* Status LED */
    .bosch-dw .led      { transition: fill .3s; }
    .bosch-dw .led-glow { transition: fill .3s, opacity .3s; opacity: 0; filter: blur(1.5px); }
    .bosch-dw.idle     .led { fill: #444c56; }
    .bosch-dw.running  .led, .bosch-dw.running  .led-glow { fill: #00b4d8; }
    .bosch-dw.finished .led, .bosch-dw.finished .led-glow { fill: #34d399; }
    .bosch-dw.aborted  .led, .bosch-dw.aborted  .led-glow { fill: #ef4444; }
    .bosch-dw.running  .led-glow,
    .bosch-dw.finished .led-glow,
    .bosch-dw.aborted  .led-glow { opacity: 0.8; }
    .bosch-dw.running .led { animation: led-pulse 1.5s ease-in-out infinite; }

    /* Digital display */
    .bosch-dw .display-text { transition: fill .3s; }
    .bosch-dw.idle     .display-text { fill: #30363d; }
    .bosch-dw.finished .display-text { fill: #34d399; }
    .bosch-dw.aborted  .display-text { fill: #ef4444; }
    .bosch-dw.running  .display-text { animation: blink-text 1s step-end infinite; }

    /* Water drops — only visible when running */
    .water-drops .drop { opacity: 0; }
    .bosch-dw.running .water-drops .drop { animation: drop-fall 2.2s linear infinite; }
    .bosch-dw.running .water-drops .d1 { animation-delay: 0s;    }
    .bosch-dw.running .water-drops .d2 { animation-delay: 0.35s; }
    .bosch-dw.running .water-drops .d3 { animation-delay: 0.7s;  }
    .bosch-dw.running .water-drops .d4 { animation-delay: 1.05s; }
    .bosch-dw.running .water-drops .d5 { animation-delay: 1.4s;  }
    .bosch-dw.running .water-drops .d6 { animation-delay: 1.75s; }

    /* Keyframes */
    @keyframes drop-fall {
      0%   { transform: translateY(-4px); opacity: 0; }
      12%  { opacity: 0.85; }
      88%  { opacity: 0.85; }
      100% { transform: translateY(70px); opacity: 0; }
    }
    @keyframes led-pulse {
      0%, 100% { opacity: 1;    }
      50%      { opacity: 0.35; }
    }
    @keyframes blink-text {
      0%, 100% { opacity: 1;    }
      50%      { opacity: 0.45; }
    }
    @keyframes blink-badge {
      0%, 100% { opacity: 1;    }
      50%      { opacity: 0.65; }
    }

    /* ── Sensors ── */
    .sensors {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }
    .sensor {
      background: #161b22;
      border-radius: 6px;
      padding: 6px 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid #21262d;
    }
    .sensor.warn { border-color: #f59e0b; background: #f59e0b15; }
    .sensor-icon  { font-size: 14px; }
    .sensor-label { color: #8b949e; font-size: 11px; flex: 1; }
    .sensor-value { font-size: 11px; color: #e6edf3; }
    .sensor.warn .sensor-value { color: #f59e0b; }

    /* ── Controls ── */
    .controls { border-top: 1px solid #21262d; padding-top: 10px; }
    .controls-label {
      color: #444c56; font-size: 10px;
      letter-spacing: 1px; margin-bottom: 6px;
    }
    .controls-row { display: flex; gap: 6px; margin-bottom: 6px; }
    .controls-row:last-child { margin-bottom: 0; }
    .controls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

    .ctrl-btn {
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 6px;
      color: #8b949e;
      font-size: 11px;
      padding: 6px 10px;
      cursor: pointer;
      flex: 1;
      transition: border-color .15s, color .15s, background .15s;
    }
    .ctrl-btn:hover:not(:disabled) { border-color: #00b4d8; color: #00b4d8; }
    .ctrl-btn.active { background: #00b4d820; border-color: #00b4d850; color: #00b4d8; }
    .ctrl-btn.danger { color: #ef4444; border-color: #ef444440; }
    .ctrl-btn.danger:hover:not(:disabled) { background: #ef444420; border-color: #ef4444; }
    .ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    .ctrl-select {
      flex: 2;
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 6px;
      color: #00b4d8;
      font-size: 11px;
      padding: 6px 8px;
      cursor: pointer;
      outline: none;
    }
    .ctrl-select:focus { border-color: #00b4d8; }
  `);customElements.define("bosch-dishwasher-card",H);
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
