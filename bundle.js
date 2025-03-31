"use strict";(()=>{var et=function(t){let e=[],r=0;for(let n=0;n<t.length;n++){let o=t.charCodeAt(n);o<128?e[r++]=o:o<2048?(e[r++]=o>>6|192,e[r++]=o&63|128):(o&64512)===55296&&n+1<t.length&&(t.charCodeAt(n+1)&64512)===56320?(o=65536+((o&1023)<<10)+(t.charCodeAt(++n)&1023),e[r++]=o>>18|240,e[r++]=o>>12&63|128,e[r++]=o>>6&63|128,e[r++]=o&63|128):(e[r++]=o>>12|224,e[r++]=o>>6&63|128,e[r++]=o&63|128)}return e},kt=function(t){let e=[],r=0,n=0;for(;r<t.length;){let o=t[r++];if(o<128)e[n++]=String.fromCharCode(o);else if(o>191&&o<224){let s=t[r++];e[n++]=String.fromCharCode((o&31)<<6|s&63)}else if(o>239&&o<365){let s=t[r++],i=t[r++],a=t[r++],c=((o&7)<<18|(s&63)<<12|(i&63)<<6|a&63)-65536;e[n++]=String.fromCharCode(55296+(c>>10)),e[n++]=String.fromCharCode(56320+(c&1023))}else{let s=t[r++],i=t[r++];e[n++]=String.fromCharCode((o&15)<<12|(s&63)<<6|i&63)}}return e.join("")},tt={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();let r=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let o=0;o<t.length;o+=3){let s=t[o],i=o+1<t.length,a=i?t[o+1]:0,c=o+2<t.length,l=c?t[o+2]:0,d=s>>2,u=(s&3)<<4|a>>4,h=(a&15)<<2|l>>6,E=l&63;c||(E=64,i||(h=64)),n.push(r[d],r[u],r[h],r[E])}return n.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(et(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):kt(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();let r=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let o=0;o<t.length;){let s=r[t.charAt(o++)],a=o<t.length?r[t.charAt(o)]:0;++o;let l=o<t.length?r[t.charAt(o)]:64;++o;let u=o<t.length?r[t.charAt(o)]:64;if(++o,s==null||a==null||l==null||u==null)throw new ue;let h=s<<2|a>>4;if(n.push(h),l!==64){let E=a<<4&240|l>>2;if(n.push(E),u!==64){let S=l<<6&192|u;n.push(S)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}},ue=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},Ft=function(t){let e=et(t);return tt.encodeByteArray(e,!0)},fe=function(t){return Ft(t).replace(/\./g,"")},Ut=function(t){try{return tt.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function zt(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var jt=()=>zt().__FIREBASE_DEFAULTS__,Vt=()=>{if(typeof process>"u"||typeof process.env>"u")return;let t=process.env.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Wt=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=t&&Ut(t[1]);return e&&JSON.parse(e)},rt=()=>{try{return jt()||Vt()||Wt()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Gt=t=>{var e,r;return(r=(e=rt())===null||e===void 0?void 0:e.emulatorHosts)===null||r===void 0?void 0:r[t]},nt=t=>{let e=Gt(t);if(!e)return;let r=e.lastIndexOf(":");if(r<=0||r+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);let n=parseInt(e.substring(r+1),10);return e[0]==="["?[e.substring(1,r-1),n]:[e.substring(0,r),n]},he=()=>{var t;return(t=rt())===null||t===void 0?void 0:t.config};var V=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,r)=>{this.resolve=e,this.reject=r})}wrapCallback(e){return(r,n)=>{r?this.reject(r):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(r):e(r,n))}}};function ot(){try{return typeof indexedDB=="object"}catch{return!1}}function st(){return new Promise((t,e)=>{try{let r=!0,n="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(n);o.onsuccess=()=>{o.result.close(),r||self.indexedDB.deleteDatabase(n),t(!0)},o.onupgradeneeded=()=>{r=!1},o.onerror=()=>{var s;e(((s=o.error)===null||s===void 0?void 0:s.message)||"")}}catch(r){e(r)}})}var Kt="FirebaseError",y=class t extends Error{constructor(e,r,n){super(r),this.code=e,this.customData=n,this.name=Kt,Object.setPrototypeOf(this,t.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,M.prototype.create)}},M=class{constructor(e,r,n){this.service=e,this.serviceName=r,this.errors=n}create(e,...r){let n=r[0]||{},o=`${this.service}/${e}`,s=this.errors[e],i=s?Jt(s,n):"Error",a=`${this.serviceName}: ${i} (${o}).`;return new y(o,a,n)}};function Jt(t,e){return t.replace(qt,(r,n)=>{let o=e[n];return o!=null?String(o):`<${n}?>`})}var qt=/\{\$([^}]+)}/g;function W(t,e){if(t===e)return!0;let r=Object.keys(t),n=Object.keys(e);for(let o of r){if(!n.includes(o))return!1;let s=t[o],i=e[o];if(Qe(s)&&Qe(i)){if(!W(s,i))return!1}else if(s!==i)return!1}for(let o of n)if(!r.includes(o))return!1;return!0}function Qe(t){return t!==null&&typeof t=="object"}var xn=4*60*60*1e3;function G(t){return t&&t._delegate?t._delegate:t}var C=class{constructor(e,r,n){this.name=e,this.instanceFactory=r,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};var P="[DEFAULT]";var pe=class{constructor(e,r){this.name=e,this.container=r,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let r=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(r)){let n=new V;if(this.instancesDeferred.set(r,n),this.isInitialized(r)||this.shouldAutoInitialize())try{let o=this.getOrInitializeService({instanceIdentifier:r});o&&n.resolve(o)}catch{}}return this.instancesDeferred.get(r).promise}getImmediate(e){var r;let n=this.normalizeInstanceIdentifier(e?.identifier),o=(r=e?.optional)!==null&&r!==void 0?r:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(o)return null;throw s}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Xt(e))try{this.getOrInitializeService({instanceIdentifier:P})}catch{}for(let[r,n]of this.instancesDeferred.entries()){let o=this.normalizeInstanceIdentifier(r);try{let s=this.getOrInitializeService({instanceIdentifier:o});n.resolve(s)}catch{}}}}clearInstance(e=P){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(r=>"INTERNAL"in r).map(r=>r.INTERNAL.delete()),...e.filter(r=>"_delete"in r).map(r=>r._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=P){return this.instances.has(e)}getOptions(e=P){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:r={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let o=this.getOrInitializeService({instanceIdentifier:n,options:r});for(let[s,i]of this.instancesDeferred.entries()){let a=this.normalizeInstanceIdentifier(s);n===a&&i.resolve(o)}return o}onInit(e,r){var n;let o=this.normalizeInstanceIdentifier(r),s=(n=this.onInitCallbacks.get(o))!==null&&n!==void 0?n:new Set;s.add(e),this.onInitCallbacks.set(o,s);let i=this.instances.get(o);return i&&e(i,o),()=>{s.delete(e)}}invokeOnInitCallbacks(e,r){let n=this.onInitCallbacks.get(r);if(n)for(let o of n)try{o(e,r)}catch{}}getOrInitializeService({instanceIdentifier:e,options:r={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:Yt(e),options:r}),this.instances.set(e,n),this.instancesOptions.set(e,r),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=P){return this.component?this.component.multipleInstances?e:P:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function Yt(t){return t===P?void 0:t}function Xt(t){return t.instantiationMode==="EAGER"}var K=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let r=this.getProvider(e.name);if(r.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);r.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let r=new pe(e,this);return this.providers.set(e,r),r}getProviders(){return Array.from(this.providers.values())}};var Zt=[],f;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(f||(f={}));var Qt={debug:f.DEBUG,verbose:f.VERBOSE,info:f.INFO,warn:f.WARN,error:f.ERROR,silent:f.SILENT},er=f.INFO,tr={[f.DEBUG]:"log",[f.VERBOSE]:"log",[f.INFO]:"info",[f.WARN]:"warn",[f.ERROR]:"error"},rr=(t,e,...r)=>{if(e<t.logLevel)return;let n=new Date().toISOString(),o=tr[e];if(o)console[o](`[${n}]  ${t.name}:`,...r);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},J=class{constructor(e){this.name=e,this._logLevel=er,this._logHandler=rr,this._userLogHandler=null,Zt.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in f))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Qt[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,f.DEBUG,...e),this._logHandler(this,f.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,f.VERBOSE,...e),this._logHandler(this,f.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,f.INFO,...e),this._logHandler(this,f.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,f.WARN,...e),this._logHandler(this,f.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,f.ERROR,...e),this._logHandler(this,f.ERROR,...e)}};var nr=(t,e)=>e.some(r=>t instanceof r),it,at;function or(){return it||(it=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function sr(){return at||(at=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var ct=new WeakMap,ge=new WeakMap,lt=new WeakMap,me=new WeakMap,Ee=new WeakMap;function ir(t){let e=new Promise((r,n)=>{let o=()=>{t.removeEventListener("success",s),t.removeEventListener("error",i)},s=()=>{r(m(t.result)),o()},i=()=>{n(t.error),o()};t.addEventListener("success",s),t.addEventListener("error",i)});return e.then(r=>{r instanceof IDBCursor&&ct.set(r,t)}).catch(()=>{}),Ee.set(e,t),e}function ar(t){if(ge.has(t))return;let e=new Promise((r,n)=>{let o=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",i),t.removeEventListener("abort",i)},s=()=>{r(),o()},i=()=>{n(t.error||new DOMException("AbortError","AbortError")),o()};t.addEventListener("complete",s),t.addEventListener("error",i),t.addEventListener("abort",i)});ge.set(t,e)}var be={get(t,e,r){if(t instanceof IDBTransaction){if(e==="done")return ge.get(t);if(e==="objectStoreNames")return t.objectStoreNames||lt.get(t);if(e==="store")return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return m(t[e])},set(t,e,r){return t[e]=r,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function dt(t){be=t(be)}function cr(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...r){let n=t.call(q(this),e,...r);return lt.set(n,e.sort?e.sort():[e]),m(n)}:sr().includes(t)?function(...e){return t.apply(q(this),e),m(ct.get(this))}:function(...e){return m(t.apply(q(this),e))}}function lr(t){return typeof t=="function"?cr(t):(t instanceof IDBTransaction&&ar(t),nr(t,or())?new Proxy(t,be):t)}function m(t){if(t instanceof IDBRequest)return ir(t);if(me.has(t))return me.get(t);let e=lr(t);return e!==t&&(me.set(t,e),Ee.set(e,t)),e}var q=t=>Ee.get(t);function ft(t,e,{blocked:r,upgrade:n,blocking:o,terminated:s}={}){let i=indexedDB.open(t,e),a=m(i);return n&&i.addEventListener("upgradeneeded",c=>{n(m(i.result),c.oldVersion,c.newVersion,m(i.transaction),c)}),r&&i.addEventListener("blocked",c=>r(c.oldVersion,c.newVersion,c)),a.then(c=>{s&&c.addEventListener("close",()=>s()),o&&c.addEventListener("versionchange",l=>o(l.oldVersion,l.newVersion,l))}).catch(()=>{}),a}var dr=["get","getKey","getAll","getAllKeys","count"],ur=["put","add","delete","clear"],ye=new Map;function ut(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(ye.get(e))return ye.get(e);let r=e.replace(/FromIndex$/,""),n=e!==r,o=ur.includes(r);if(!(r in(n?IDBIndex:IDBObjectStore).prototype)||!(o||dr.includes(r)))return;let s=async function(i,...a){let c=this.transaction(i,o?"readwrite":"readonly"),l=c.store;return n&&(l=l.index(a.shift())),(await Promise.all([l[r](...a),o&&c.done]))[0]};return ye.set(e,s),s}dt(t=>({...t,get:(e,r,n)=>ut(e,r)||t.get(e,r,n),has:(e,r)=>!!ut(e,r)||t.has(e,r)}));var _e=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(r=>{if(fr(r)){let n=r.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(r=>r).join(" ")}};function fr(t){let e=t.getComponent();return e?.type==="VERSION"}var Te="@firebase/app",ht="0.10.13";var _=new J("@firebase/app"),hr="@firebase/app-compat",pr="@firebase/analytics-compat",mr="@firebase/analytics",gr="@firebase/app-check-compat",br="@firebase/app-check",Er="@firebase/auth",yr="@firebase/auth-compat",Cr="@firebase/database",_r="@firebase/data-connect",Tr="@firebase/database-compat",Sr="@firebase/functions",vr="@firebase/functions-compat",wr="@firebase/installations",xr="@firebase/installations-compat",Dr="@firebase/messaging",Ir="@firebase/messaging-compat",Ar="@firebase/performance",Pr="@firebase/performance-compat",Nr="@firebase/remote-config",Or="@firebase/remote-config-compat",Br="@firebase/storage",Lr="@firebase/storage-compat",Hr="@firebase/firestore",Mr="@firebase/vertexai-preview",$r="@firebase/firestore-compat",Rr="firebase";var Se="[DEFAULT]",kr={[Te]:"fire-core",[hr]:"fire-core-compat",[mr]:"fire-analytics",[pr]:"fire-analytics-compat",[br]:"fire-app-check",[gr]:"fire-app-check-compat",[Er]:"fire-auth",[yr]:"fire-auth-compat",[Cr]:"fire-rtdb",[_r]:"fire-data-connect",[Tr]:"fire-rtdb-compat",[Sr]:"fire-fn",[vr]:"fire-fn-compat",[wr]:"fire-iid",[xr]:"fire-iid-compat",[Dr]:"fire-fcm",[Ir]:"fire-fcm-compat",[Ar]:"fire-perf",[Pr]:"fire-perf-compat",[Nr]:"fire-rc",[Or]:"fire-rc-compat",[Br]:"fire-gcs",[Lr]:"fire-gcs-compat",[Hr]:"fire-fst",[$r]:"fire-fst-compat",[Mr]:"fire-vertex","fire-js":"fire-js",[Rr]:"fire-js-all"};var Y=new Map,Fr=new Map,ve=new Map;function pt(t,e){try{t.container.addComponent(e)}catch(r){_.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,r)}}function $(t){let e=t.name;if(ve.has(e))return _.debug(`There were multiple attempts to register component ${e}.`),!1;ve.set(e,t);for(let r of Y.values())pt(r,t);for(let r of Fr.values())pt(r,t);return!0}function Et(t,e){let r=t.container.getProvider("heartbeat").getImmediate({optional:!0});return r&&r.triggerHeartbeat(),t.container.getProvider(e)}var Ur={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},w=new M("app","Firebase",Ur);var we=class{constructor(e,r,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},r),this._name=r.name,this._automaticDataCollectionEnabled=r.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new C("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw w.create("app-deleted",{appName:this._name})}};function Ie(t,e={}){let r=t;typeof e!="object"&&(e={name:e});let n=Object.assign({name:Se,automaticDataCollectionEnabled:!1},e),o=n.name;if(typeof o!="string"||!o)throw w.create("bad-app-name",{appName:String(o)});if(r||(r=he()),!r)throw w.create("no-options");let s=Y.get(o);if(s){if(W(r,s.options)&&W(n,s.config))return s;throw w.create("duplicate-app",{appName:o})}let i=new K(o);for(let c of ve.values())i.addComponent(c);let a=new we(r,n,i);return Y.set(o,a),a}function X(t=Se){let e=Y.get(t);if(!e&&t===Se&&he())return Ie();if(!e)throw w.create("no-app",{appName:t});return e}function x(t,e,r){var n;let o=(n=kr[t])!==null&&n!==void 0?n:t;r&&(o+=`-${r}`);let s=o.match(/\s|\//),i=e.match(/\s|\//);if(s||i){let a=[`Unable to register library "${o}" with version "${e}":`];s&&a.push(`library name "${o}" contains illegal characters (whitespace or "/")`),s&&i&&a.push("and"),i&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),_.warn(a.join(" "));return}$(new C(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}var zr="firebase-heartbeat-database",jr=1,R="firebase-heartbeat-store",Ce=null;function yt(){return Ce||(Ce=ft(zr,jr,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(R)}catch(r){console.warn(r)}}}}).catch(t=>{throw w.create("idb-open",{originalErrorMessage:t.message})})),Ce}async function Vr(t){try{let r=(await yt()).transaction(R),n=await r.objectStore(R).get(Ct(t));return await r.done,n}catch(e){if(e instanceof y)_.warn(e.message);else{let r=w.create("idb-get",{originalErrorMessage:e?.message});_.warn(r.message)}}}async function mt(t,e){try{let n=(await yt()).transaction(R,"readwrite");await n.objectStore(R).put(e,Ct(t)),await n.done}catch(r){if(r instanceof y)_.warn(r.message);else{let n=w.create("idb-set",{originalErrorMessage:r?.message});_.warn(n.message)}}}function Ct(t){return`${t.name}!${t.options.appId}`}var Wr=1024,Gr=30*24*60*60*1e3,xe=class{constructor(e){this.container=e,this._heartbeatsCache=null;let r=this.container.getProvider("app").getImmediate();this._storage=new De(r),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,r;try{let o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=gt();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((r=this._heartbeatsCache)===null||r===void 0?void 0:r.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(i=>i.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:o}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(i=>{let a=new Date(i.date).valueOf();return Date.now()-a<=Gr}),this._storage.overwrite(this._heartbeatsCache))}catch(n){_.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";let r=gt(),{heartbeatsToSend:n,unsentEntries:o}=Kr(this._heartbeatsCache.heartbeats),s=fe(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=r,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(r){return _.warn(r),""}}};function gt(){return new Date().toISOString().substring(0,10)}function Kr(t,e=Wr){let r=[],n=t.slice();for(let o of t){let s=r.find(i=>i.agent===o.agent);if(s){if(s.dates.push(o.date),bt(r)>e){s.dates.pop();break}}else if(r.push({agent:o.agent,dates:[o.date]}),bt(r)>e){r.pop();break}n=n.slice(1)}return{heartbeatsToSend:r,unsentEntries:n}}var De=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ot()?st().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let r=await Vr(this.app);return r?.heartbeats?r:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var r;if(await this._canUseIndexedDBPromise){let o=await this.read();return mt(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!==null&&r!==void 0?r:o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var r;if(await this._canUseIndexedDBPromise){let o=await this.read();return mt(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!==null&&r!==void 0?r:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}};function bt(t){return fe(JSON.stringify({version:2,heartbeats:t})).length}function Jr(t){$(new C("platform-logger",e=>new _e(e),"PRIVATE")),$(new C("heartbeat",e=>new xe(e),"PRIVATE")),x(Te,ht,t),x(Te,ht,"esm2017"),x("fire-js","")}Jr("");var qr="firebase",Yr="10.14.1";x(qr,Yr,"app");var Xr="type.googleapis.com/google.protobuf.Int64Value",Zr="type.googleapis.com/google.protobuf.UInt64Value";function vt(t,e){let r={};for(let n in t)t.hasOwnProperty(n)&&(r[n]=e(t[n]));return r}function Ae(t){if(t==null)return null;if(t instanceof Number&&(t=t.valueOf()),typeof t=="number"&&isFinite(t)||t===!0||t===!1||Object.prototype.toString.call(t)==="[object String]")return t;if(t instanceof Date)return t.toISOString();if(Array.isArray(t))return t.map(e=>Ae(e));if(typeof t=="function"||typeof t=="object")return vt(t,e=>Ae(e));throw new Error("Data cannot be encoded in JSON: "+t)}function Z(t){if(t==null)return t;if(t["@type"])switch(t["@type"]){case Xr:case Zr:{let e=Number(t.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+t);return e}default:throw new Error("Data cannot be decoded from JSON: "+t)}return Array.isArray(t)?t.map(e=>Z(e)):typeof t=="function"||typeof t=="object"?vt(t,e=>Z(e)):t}var Be="functions";var _t={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"},D=class extends y{constructor(e,r,n){super(`${Be}/${e}`,r||""),this.details=n}};function Qr(t){if(t>=200&&t<300)return"ok";switch(t){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function en(t,e){let r=Qr(t),n=r,o;try{let s=e&&e.error;if(s){let i=s.status;if(typeof i=="string"){if(!_t[i])return new D("internal","internal");r=_t[i],n=i}let a=s.message;typeof a=="string"&&(n=a),o=s.details,o!==void 0&&(o=Z(o))}}catch{}return r==="ok"?null:new D(r,n,o)}var Pe=class{constructor(e,r,n){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=e.getImmediate({optional:!0}),this.messaging=r.getImmediate({optional:!0}),this.auth||e.get().then(o=>this.auth=o,()=>{}),this.messaging||r.get().then(o=>this.messaging=o,()=>{}),this.appCheck||n.get().then(o=>this.appCheck=o,()=>{})}async getAuthToken(){if(this.auth)try{let e=await this.auth.getToken();return e?.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(e){if(this.appCheck){let r=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return r.error?null:r.token}return null}async getContext(e){let r=await this.getAuthToken(),n=await this.getMessagingToken(),o=await this.getAppCheckToken(e);return{authToken:r,messagingToken:n,appCheckToken:o}}};var Ne="us-central1";function tn(t){let e=null;return{promise:new Promise((r,n)=>{e=setTimeout(()=>{n(new D("deadline-exceeded","deadline-exceeded"))},t)}),cancel:()=>{e&&clearTimeout(e)}}}var Oe=class{constructor(e,r,n,o,s=Ne,i){this.app=e,this.fetchImpl=i,this.emulatorOrigin=null,this.contextProvider=new Pe(r,n,o),this.cancelAllRequests=new Promise(a=>{this.deleteService=()=>Promise.resolve(a())});try{let a=new URL(s);this.customDomain=a.origin+(a.pathname==="/"?"":a.pathname),this.region=Ne}catch{this.customDomain=null,this.region=s}}_delete(){return this.deleteService()}_url(e){let r=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${r}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${r}.cloudfunctions.net/${e}`}};function rn(t,e,r){t.emulatorOrigin=`http://${e}:${r}`}function nn(t,e,r){return n=>sn(t,e,n,r||{})}async function on(t,e,r,n){r["Content-Type"]="application/json";let o;try{o=await n(t,{method:"POST",body:JSON.stringify(e),headers:r})}catch{return{status:0,json:null}}let s=null;try{s=await o.json()}catch{}return{status:o.status,json:s}}function sn(t,e,r,n){let o=t._url(e);return an(t,o,r,n)}async function an(t,e,r,n){r=Ae(r);let o={data:r},s={},i=await t.contextProvider.getContext(n.limitedUseAppCheckTokens);i.authToken&&(s.Authorization="Bearer "+i.authToken),i.messagingToken&&(s["Firebase-Instance-ID-Token"]=i.messagingToken),i.appCheckToken!==null&&(s["X-Firebase-AppCheck"]=i.appCheckToken);let a=n.timeout||7e4,c=tn(a),l=await Promise.race([on(e,o,s,t.fetchImpl),c.promise,t.cancelAllRequests]);if(c.cancel(),!l)throw new D("cancelled","Firebase Functions instance was deleted.");let d=en(l.status,l.json);if(d)throw d;if(!l.json)throw new D("internal","Response is not valid JSON object.");let u=l.json.data;if(typeof u>"u"&&(u=l.json.result),typeof u>"u")throw new D("internal","Response is missing data field.");return{data:Z(u)}}var Tt="@firebase/functions",St="0.11.8";var cn="auth-internal",ln="app-check-internal",dn="messaging-internal";function un(t,e){let r=(n,{instanceIdentifier:o})=>{let s=n.getProvider("app").getImmediate(),i=n.getProvider(cn),a=n.getProvider(dn),c=n.getProvider(ln);return new Oe(s,i,a,c,o,t)};$(new C(Be,r,"PUBLIC").setMultipleInstances(!0)),x(Tt,St,e),x(Tt,St,"esm2017")}function Q(t=X(),e=Ne){let n=Et(G(t),Be).getImmediate({identifier:e}),o=nt("functions");return o&&Le(n,...o),n}function Le(t,e,r){rn(G(t),e,r)}function wt(t,e,r){return nn(G(t),e,r)}un(fetch.bind(self));var fn={apiKey:"AIzaSyDyCk6zn1OEGNt4_8OTu99vDQKX2hl6bqg",authDomain:"trello-dashboard-visualizer.firebaseapp.com",projectId:"trello-dashboard-visualizer",storageBucket:"trello-dashboard-visualizer.firebasestorage.app",messagingSenderId:"352103218030",appId:"1:352103218030:web:552840592ee2921297df7f"},hn=Ie(fn),pn=Q(hn);(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&Le(pn,"localhost",5001);var mn="I7Ejr7YZ";async function He(t=mn){if(!t)throw new Error("No Trello board ID provided and no default set in environment variables");try{let e=Q(X());return(await wt(e,"fetchTrelloBoard")({boardId:t})).data}catch(e){throw e}}var gn=["done","complete","finished"],bn=["progress","doing","review"];function Me(t){let e=t.toLowerCase();return gn.some(r=>e.includes(r))?"complete":bn.some(r=>e.includes(r))?"in-progress":"not-started"}function ee(t,e){let r=e.lists.find(n=>n.id===t.listId);return r?Me(r.name)==="in-progress":!1}function te(t,e){let r=e.lists.find(n=>n.id===t.listId);return r?Me(r.name)==="complete":!1}function T(t,e){let r=t.length,n=t.filter(d=>te(d,e)).length,o=t.filter(d=>ee(d,e)).length,s=0,i=0,a=0;t.forEach(d=>{let u=d.customFields.estimatedHours??0,h=Number(u);isFinite(h)&&h>=0&&h<=1e4&&(s=Number(s)+Number(h),te(d,e)?i=Number(i)+Number(h):ee(d,e)&&(a=Number(a)+Number(h)))});let c=r>0?Math.round(n/r*100):0,l=r>0?Math.round(o/r*100):0;return{totalCards:r,completedCards:n,inProgressCards:o,totalHours:s,completedHours:i,inProgressHours:a,completionPercentage:c,inProgressPercentage:l}}function xt(t,e,r){return t.filter(n=>{let o=e==="all"||n.labels.some(i=>i.name===e),s=r==="all"||n.customFields.system===r;return o&&s})}function $e(t){return{cards:t.cards.map(r=>{let n=r.labels.map((s,i)=>{let a=t.labels.find(c=>c.name===s)||{id:`unknown-${i}`,name:s,color:"gray"};return{id:a.id,name:a.name,color:a.color}}),o=r.estimatedHours!==void 0?isFinite(r.estimatedHours)&&r.estimatedHours>=0&&r.estimatedHours<=1e4?r.estimatedHours:0:void 0;return{id:r.id,listId:r.listId,labels:n,customFields:{estimatedHours:o,system:r.system}}}),lists:t.lists,labels:t.labels}}function g(t,e,r,n){return{type:t,message:e,details:r,originalError:n}}function Re(t){if(t?.code?.startsWith("functions/"))switch(t.code.replace("functions/","")){case"unauthenticated":return g("AUTHENTICATION","Authentication with Trello failed","Please check your Trello API key and token",t);case"invalid-argument":return g("API_FETCH","Invalid data provided to Trello API",t.message||"Check board ID and parameters",t);case"permission-denied":return g("AUTHORIZATION","You don't have permission to access this Trello board","Make sure you have the right permissions on Trello",t);case"resource-exhausted":return g("API_FETCH","Too many requests to Trello API","Please try again later",t);case"unavailable":return g("NETWORK","Trello service is currently unavailable","Please try again later or check Trello status",t);default:return g("API_FETCH","Failed to fetch data from Trello",t.message||"Unknown Firebase function error",t)}return t?.message?.includes("network")||t?.name==="NetworkError"?g("NETWORK","Network connection issue","Please check your internet connection and try again",t):g("UNKNOWN","An unexpected error occurred",t?.message||"No additional details available",t instanceof Error?t:new Error(String(t)))}function ke(t){if(t.type){let e=t;return`${e.message}${e.details?`

Details: ${e.details}`:""}`}return t instanceof Error?`Error: ${t.message}`:`Error: ${String(t)}`}var Dt="trello_dashboard_section_states";function It(){let t=document.querySelectorAll(".section-toggle"),e=At();t.forEach(r=>{let n=r.getAttribute("aria-controls");if(!n)return;let o=document.getElementById(n);if(!o)return;let s=e.find(i=>i.sectionId===n);s&&(s.isExpanded||(o.classList.add("hidden"),r.setAttribute("aria-expanded","false"),r.querySelector(".chevron-up")?.classList.add("hidden"),r.querySelector(".chevron-down")?.classList.remove("hidden"))),r.addEventListener("click",()=>{let i=r.getAttribute("aria-expanded")==="true";i?(o.classList.add("hidden"),r.setAttribute("aria-expanded","false"),r.querySelector(".chevron-up")?.classList.add("hidden"),r.querySelector(".chevron-down")?.classList.remove("hidden")):(o.classList.remove("hidden"),r.setAttribute("aria-expanded","true"),r.querySelector(".chevron-up")?.classList.remove("hidden"),r.querySelector(".chevron-down")?.classList.add("hidden")),En(n,!i)})})}function En(t,e){try{let r=At(),n=r.findIndex(o=>o.sectionId===t);n>=0?r[n].isExpanded=e:r.push({sectionId:t,isExpanded:e}),localStorage.setItem(Dt,JSON.stringify(r))}catch(r){console.error("Failed to save section state:",r)}}function At(){try{let t=localStorage.getItem(Dt);if(!t)return[];let e=JSON.parse(t);return Array.isArray(e)?e:[]}catch(t){return console.error("Failed to load section states:",t),[]}}function re(t,e,r){let n=new Set;t.labels.forEach(s=>{s.name&&n.add(s.name)}),n.forEach(s=>{let i=document.createElement("option");i.value=s,i.textContent=s,e.appendChild(i)});let o=new Set;if(t.cards.forEach(s=>{s.customFields&&s.customFields.system&&o.add(s.customFields.system)}),o.forEach(s=>{let i=document.createElement("option");i.value=s,i.textContent=s,r.appendChild(i)}),o.size===0){console.warn("No systems found in board data");let s=document.createElement("option");s.value="no-systems",s.textContent="No systems found",s.disabled=!0,r.appendChild(s)}}function p(t){return!isFinite(t)||t<0||t>1e4?0:Math.round(t*10)/10}function B(t){return t.includes("_")?`${t}-faded`:`${t}-faded`}function L(t,e,r){return`${p(t)}/${p(t+e)}/${p(r)} hrs`}function I(t,e="No data available"){t.innerHTML=`<div class="text-sm text-gray-500 italic">${e}</div>`}function k(t){let{completedPercentage:e,inProgressPercentage:r,completedColorClass:n,inProgressColorClass:o,height:s="2"}=t,i=document.createElement("div");i.className=`w-full bg-gray-700 rounded-full h-${s} overflow-hidden`;let a=document.createElement("div");a.className=`${n} h-${s}`,a.style.width=`${Math.round(e)}%`,a.style.float="left";let c=document.createElement("div");return c.className=`${o} h-${s}`,c.style.width=`${Math.round(r)}%`,c.style.float="left",e>0&&a.classList.add("rounded-l-full"),r>0?c.classList.add("rounded-r-full"):e>0&&a.classList.add("rounded-r-full"),i.appendChild(a),i.appendChild(c),i}function H(t){let{title:e,subtitle:r,progressBar:n,details:o,classes:s="mb-3",titleTooltip:i}=t,a=document.createElement("div");a.className=s;let c=document.createElement("div");c.className="flex justify-between mb-1";let l=document.createElement("span");l.className="font-medium text-gray-100",l.textContent=e;let d=document.createElement("span");d.className="text-sm font-medium text-gray-100",d.textContent=r,i&&d.setAttribute("title",i),c.appendChild(l),c.appendChild(d);let u=k(n);if(a.appendChild(c),a.appendChild(u),o){let h=document.createElement("div");h.className="flex justify-between text-xs text-gray-500 mt-1";let E=document.createElement("span");E.textContent=o.leftText;let S=document.createElement("span");S.textContent=o.rightText,h.appendChild(E),h.appendChild(S),a.appendChild(h)}return a}var F=document.getElementById("department-hours-container"),ne=document.getElementById("department-progress-container");function Fe(t,e){if(console.log("Updating department hours"),!F)return;F.innerHTML="";let r=Pt(t,e);if(r.length===0){I(F);return}if(r.slice(0,3).forEach(n=>{let o=H({title:n.department,subtitle:L(n.completedHours,n.inProgressHours,n.totalHours),progressBar:{completedPercentage:n.completionPercentage,inProgressPercentage:n.inProgressPercentage,completedColorClass:`label-${n.color}`,inProgressColorClass:`label-${B(n.color)}`,height:"2"},titleTooltip:`${Math.round(n.completionPercentage)}% complete, ${Math.round(n.inProgressPercentage)}% in progress`});F.appendChild(o)}),r.length>3){let n=document.createElement("div");n.className="text-xs text-gray-300 italic mt-2",n.textContent=`Showing top 3 of ${r.length} departments`,F.appendChild(n)}}function Ue(t,e){if(!ne)return;ne.innerHTML="";let r=Pt(t,e);if(r.length===0){I(ne);return}r.forEach(n=>{let o=Math.round(n.completionPercentage),s=H({title:n.department,subtitle:`${o}% complete`,progressBar:{completedPercentage:n.completionPercentage,inProgressPercentage:n.inProgressPercentage,completedColorClass:`label-${n.color}`,inProgressColorClass:`label-${B(n.color)}`,height:"2.5"},details:{leftText:`${n.completedCards}/${n.totalCards} tasks (${n.inProgressCards} in progress)`,rightText:L(n.completedHours,n.inProgressHours,n.totalHours)},classes:"mb-4",titleTooltip:`${Math.round(n.completionPercentage)}% complete, ${Math.round(n.inProgressPercentage)}% in progress`});ne.appendChild(s)})}function Pt(t,e){let r=new Map;e.labels.forEach(o=>{o.name&&r.set(o.name,{color:o.color,totalHours:0,completedHours:0,inProgressHours:0,cards:[]})}),t.forEach(o=>{let s=o.customFields.estimatedHours||0,i=Number(s),a=isFinite(i)&&i>=0&&i<=1e4?i:0,c=te(o,e),l=!c&&ee(o,e);o.labels.forEach(d=>{if(d.name&&r.has(d.name)){let u=r.get(d.name);u.totalHours=Number(u.totalHours)+Number(a),u.cards.push(o),c?u.completedHours=Number(u.completedHours)+Number(a):l&&(u.inProgressHours=Number(u.inProgressHours)+Number(a))}})});let n=[];return r.forEach((o,s)=>{if(o.cards.length===0)return;let i=T(o.cards,e);n.push({department:s,color:o.color,...i})}),n.sort((o,s)=>s.totalHours-o.totalHours)}var U=document.getElementById("system-hours-container"),oe=document.getElementById("system-progress-container");function ze(t,e){if(console.log("Updating system hours"),!U)return;U.innerHTML="";let r=Nt(t,e);if(r.length===0){I(U);return}if(r.slice(0,3).forEach(n=>{let o=H({title:n.system,subtitle:L(n.completedHours,n.inProgressHours,n.totalHours),progressBar:{completedPercentage:n.completionPercentage,inProgressPercentage:n.inProgressPercentage,completedColorClass:"bg-blue-600",inProgressColorClass:"bg-blue-faded",height:"2"},titleTooltip:`${Math.round(n.completionPercentage)}% complete, ${Math.round(n.inProgressPercentage)}% in progress`});U.appendChild(o)}),r.length>3){let n=document.createElement("div");n.className="text-xs text-gray-300 italic mt-2",n.textContent=`Showing top 3 of ${r.length} systems`,U.appendChild(n)}}function je(t,e){if(!oe)return;oe.innerHTML="";let r=Nt(t,e);if(r.length===0){I(oe);return}r.forEach(n=>{let o=Math.round(n.completionPercentage),s=H({title:n.system,subtitle:`${o}% complete`,progressBar:{completedPercentage:n.completionPercentage,inProgressPercentage:n.inProgressPercentage,completedColorClass:"bg-blue-600",inProgressColorClass:"bg-blue-faded",height:"2.5"},details:{leftText:`${n.completedCards}/${n.totalCards} tasks (${n.inProgressCards} in progress)`,rightText:L(n.completedHours,n.inProgressHours,n.totalHours)},classes:"mb-4",titleTooltip:`${Math.round(n.completionPercentage)}% complete, ${Math.round(n.inProgressPercentage)}% in progress`});oe.appendChild(s)})}function Nt(t,e){let r=new Map;t.forEach(o=>{let s=o.customFields.system;s&&(r.has(s)||r.set(s,[]),r.get(s).push(o))});let n=[];return r.forEach((o,s)=>{let i=T(o,e);n.push({system:s,...i})}),n.sort((o,s)=>s.totalHours-o.totalHours)}var se=document.getElementById("overall-completion-percent"),Ve=document.getElementById("overall-progress-bar"),We=document.getElementById("overall-hours");function Ge(t,e){let r=T(t,e);if(se){let n=Math.round(r.completionPercentage);se.textContent=`${n}%`,se.className="text-gray-100";let o=Math.round(r.inProgressPercentage);se.setAttribute("title",`${n}% complete, ${o}% in progress`)}if(Ve&&(Ve.style.width=`${Math.round(r.completionPercentage)}%`,Ve.className="bg-blue-500 h-2.5 rounded-full"),We){let n=p(r.completedHours+r.inProgressHours);We.textContent=`${p(r.completedHours)}/${n}/${p(r.totalHours)} hrs`,We.setAttribute("title",`${p(r.completedHours)} completed, ${p(r.inProgressHours)} in progress, ${p(r.totalHours)} total`)}Fe(t,e),ze(t,e)}var ie=document.getElementById("detailed-breakdown-container");function Ke(t,e){if(!ie)return;ie.innerHTML="";let r=new Set;e.labels.forEach(o=>{o.name&&r.add(o.name)});let n=new Set;if(t.forEach(o=>{o.customFields.system&&n.add(o.customFields.system)}),r.size===0||n.size===0){I(ie);return}r.forEach(o=>{let s=t.filter(v=>v.labels.some(j=>j.name===o));if(s.length===0)return;let i=T(s,e),a=e.labels.find(v=>v.name===o),c=a?a.color:"gray",l=document.createElement("div");l.className="mb-6";let d=i.completedCards,u=i.inProgressCards,h=i.totalCards-d-u;l.innerHTML=`
      <div class="flex flex-wrap justify-between items-center mb-3">
        <h3 class="text-lg font-medium">${o}</h3>
        <div class="text-sm text-gray-400 flex flex-wrap gap-1 mt-1 sm:mt-0">
          <span class="px-2 py-1 bg-green-900 bg-opacity-30 rounded-md" title="Completed tasks">
            ${d} done
          </span>
          <span class="px-2 py-1 bg-yellow-700 bg-opacity-30 rounded-md" title="Tasks in progress">
            ${u} in progress
          </span>
          <span class="px-2 py-1 bg-gray-700 bg-opacity-30 rounded-md" title="Tasks not started">
            ${h} not started
          </span>
        </div>
      </div>
    `;let E=k({completedPercentage:i.completionPercentage,inProgressPercentage:i.inProgressPercentage,completedColorClass:`label-${c}`,inProgressColorClass:`label-${B(c)}`,height:"3"}),S=document.createElement("div");S.className="flex justify-between text-xs text-gray-400 mb-4",S.innerHTML=`
      <span>${p(i.completedHours)}/${p(i.totalHours)} hrs (${Math.round(i.completionPercentage)}% complete)</span>
    `,l.appendChild(E),l.appendChild(S);let Ze=Array.from(n).filter(v=>s.filter(de=>de.customFields.system===v).length>0);Ze.forEach((v,j)=>{let de=s.filter(Rt=>Rt.customFields.system===v),Ht=T(de,e),Mt=j===Ze.length-1,$t=yn(v,Ht,c,Mt);l.appendChild($t)}),ie.appendChild(l)})}function yn(t,e,r,n=!1){let o=document.createElement("div");o.className=n?"ml-4 mb-2":"ml-4 mb-4 pb-2 border-b border-gray-800";let s=Math.round(e.completionPercentage);o.innerHTML=`
    <div class="flex justify-between mb-1">
      <span class="font-medium text-gray-100">${t}</span>
      <span class="text-sm font-medium text-gray-100" title="${Math.round(e.completionPercentage)}% complete, ${Math.round(e.inProgressPercentage)}% in progress">
        ${s}% complete
      </span>
    </div>
  `;let i=k({completedPercentage:e.completionPercentage,inProgressPercentage:e.inProgressPercentage,completedColorClass:`label-${r}`,inProgressColorClass:`label-${B(r)}`,height:"2"}),a=document.createElement("div");return a.className="flex justify-between text-xs text-gray-500 mb-2",a.innerHTML=`
    <span>${e.completedCards}/${e.totalCards} tasks (${e.inProgressCards} in progress)</span>
    <span>${p(e.completedHours)}/${p(e.completedHours+e.inProgressHours)}/${p(e.totalHours)} hrs</span>
  `,o.appendChild(i),o.appendChild(a),o}function z(t,e=`Element not found: ${t}`){let r=document.querySelector(t);if(!r)throw g("UI_RENDERING","UI Element Missing",e);return r}var Ot=z("#error-modal"),Cn=z("#error-message"),_n=z("#close-error"),Tn=z("#loading-spinner"),Sn=z("#last-updated");function A(t){Tn.style.display=t?"flex":"none"}function ae(t){Cn.textContent=t,Ot.style.display="flex"}function Je(){_n.addEventListener("click",()=>{Ot.style.display="none"})}function ce(){let t=new Date;Sn.textContent=t.toLocaleString()}var O=null,b=null,Bt="all",Lt="all";function Xe(t){let e=document.getElementById(t);if(!e)throw new Error(`Element not found: ${t}`);return e}var qe=Xe("department-filter"),Ye=Xe("system-filter"),N=Xe("refresh-data");async function vn(){try{A(!0),O=await He(),O&&(b=$e(O),re(b,qe,Ye),le(),ce()),A(!1)}catch(t){let e=Re(t);ae(ke(e)),console.error("Dashboard initialization error:",e),A(!1)}}function le(){if(!O||!b)return;let t=xt(b.cards,Bt,Lt);Ge(t,b),Ue(t,b),je(t,b),Ke(t,b)}function wn(){qe.addEventListener("change",t=>{Bt=t.target.value,le()}),Ye.addEventListener("change",t=>{Lt=t.target.value,le()}),N.addEventListener("click",async()=>{try{A(!0),N.disabled=!0,N.classList.add("opacity-50"),O=await He(),O&&(b=$e(O),re(b,qe,Ye),le(),ce()),A(!1),N.disabled=!1,N.classList.remove("opacity-50")}catch(t){let e=Re(t);ae(ke(e)),console.error("Dashboard refresh error:",e),A(!1),N.disabled=!1,N.classList.remove("opacity-50")}}),Je(),It()}document.addEventListener("DOMContentLoaded",()=>{wn(),vn()});})();
/*! Bundled license information:

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/functions/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/functions/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=bundle.js.map
