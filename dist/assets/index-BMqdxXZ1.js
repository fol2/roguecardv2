var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n={"phone-portrait":{w:390,h:844},"pad-portrait":{w:820,h:1180},"pad-landscape":{w:1180,h:820},"desktop-landscape":{w:1458,h:820},"phone-landscape":{w:844,h:390}},r=Math.sqrt(390/844*(820/1180)),i=Math.sqrt(1180/820*(844/390)),a=Math.sqrt(1180/820*(1458/820)),o=new URLSearchParams(location.search),s=o.get(`shape`),c=o.get(`input`)?o.get(`input`)===`touch`:matchMedia(`(pointer: coarse)`).matches,l=`pad-landscape`,u=1,d=0,f=0,p=null;function m(){if(s&&n[s])return s;let e=innerWidth/Math.max(1,innerHeight);return c?e<r?`phone-portrait`:e>i?`phone-landscape`:e<1?`pad-portrait`:`pad-landscape`:e<1?`pad-portrait`:e>a?`desktop-landscape`:`pad-landscape`}function h(){l=m();let{w:e,h:t}=n[l];u=Math.min(innerWidth/e,innerHeight/t),d=(innerWidth-e*u)/2,f=(innerHeight-t*u)/2,p.style.width=`${e}px`,p.style.height=`${t}px`,p.style.left=`${d}px`,p.style.top=`${f}px`,p.style.transform=`scale(${u})`,document.documentElement.dataset.vp=l}function g(){p=document.getElementById(`stage`),h(),addEventListener(`resize`,h)}var _=()=>n[l].w,v=()=>n[l].h,y=()=>u,b=()=>p,x=()=>({shape:l,w:n[l].w,h:n[l].h,scale:u}),S=(e,t)=>({x:(e-d)/u,y:(t-f)/u});function C(e){let t=e.getBoundingClientRect();return{left:(t.left-d)/u,top:(t.top-f)/u,right:(t.right-d)/u,bottom:(t.bottom-f)/u,width:t.width/u,height:t.height/u}}var w=1e3,T=1001,E=1002,D=1003,O=1004,ee=1005,k=1006,te=1007,ne=1008,re=1009,ie=1010,A=1011,ae=1012,oe=1013,se=1014,ce=1015,le=1016,ue=1017,de=1018,fe=1020,pe=35902,me=35899,he=1021,ge=1022,_e=1023,ve=1026,ye=1027,be=1028,xe=1029,Se=1030,Ce=1031,we=1033,Te=33776,Ee=33777,De=33778,Oe=33779,ke=35840,Ae=35841,je=35842,Me=35843,Ne=36196,Pe=37492,Fe=37496,Ie=37488,Le=37489,j=37490,Re=37491,ze=37808,Be=37809,M=37810,Ve=37811,N=37812,P=37813,He=37814,Ue=37815,We=37816,Ge=37817,Ke=37818,qe=37819,Je=37820,Ye=37821,Xe=36492,Ze=36494,Qe=36495,$e=36283,et=36284,tt=36285,nt=36286,rt=2300,it=2301,at=2302,ot=2303,st=2400,ct=2401,lt=2402,ut=3200,dt=`srgb`,ft=`srgb-linear`,pt=`linear`,mt=`srgb`,ht=7680,gt=35044,_t=2e3;function vt(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function yt(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function bt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function xt(){let e=bt(`canvas`);return e.style.display=`block`,e}var St={};function Ct(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function wt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function F(...e){e=wt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function I(...e){e=wt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Tt(...e){let t=e.join(` `);t in St||(St[t]=!0,F(...e))}function Et(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Dt={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},Ot=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},kt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),At=1234567,jt=Math.PI/180,Mt=180/Math.PI;function Nt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(kt[e&255]+kt[e>>8&255]+kt[e>>16&255]+kt[e>>24&255]+`-`+kt[t&255]+kt[t>>8&255]+`-`+kt[t>>16&15|64]+kt[t>>24&255]+`-`+kt[n&63|128]+kt[n>>8&255]+`-`+kt[n>>16&255]+kt[n>>24&255]+kt[r&255]+kt[r>>8&255]+kt[r>>16&255]+kt[r>>24&255]).toLowerCase()}function L(e,t,n){return Math.max(t,Math.min(n,e))}function Pt(e,t){return(e%t+t)%t}function Ft(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function It(e,t,n){return e===t?0:(n-e)/(t-e)}function Lt(e,t,n){return(1-n)*e+n*t}function Rt(e,t,n,r){return Lt(e,t,1-Math.exp(-n*r))}function zt(e,t=1){return t-Math.abs(Pt(e,t*2)-t)}function Bt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function Vt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function Ht(e,t){return e+Math.floor(Math.random()*(t-e+1))}function Ut(e,t){return e+Math.random()*(t-e)}function Wt(e){return e*(.5-Math.random())}function Gt(e){e!==void 0&&(At=e);let t=At+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Kt(e){return e*jt}function qt(e){return e*Mt}function Jt(e){return(e&e-1)==0&&e!==0}function Yt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Xt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Zt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:F(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Qt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function $t(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var en={DEG2RAD:jt,RAD2DEG:Mt,generateUUID:Nt,clamp:L,euclideanModulo:Pt,mapLinear:Ft,inverseLerp:It,lerp:Lt,damp:Rt,pingpong:zt,smoothstep:Bt,smootherstep:Vt,randInt:Ht,randFloat:Ut,randFloatSpread:Wt,seededRandom:Gt,degToRad:Kt,radToDeg:qt,isPowerOfTwo:Jt,ceilPowerOfTwo:Yt,floorPowerOfTwo:Xt,setQuaternionFromProperEuler:Zt,normalize:$t,denormalize:Qt},R=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=L(this.x,e.x,t.x),this.y=L(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=L(this.x,e,t),this.y=L(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(L(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(L(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},tn=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:F(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(L(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},z=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(rn.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(rn.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=L(this.x,e.x,t.x),this.y=L(this.y,e.y,t.y),this.z=L(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=L(this.x,e,t),this.y=L(this.y,e,t),this.z=L(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(L(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return nn.copy(this).projectOnVector(e),this.sub(nn)}reflect(e){return this.sub(nn.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(L(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},nn=new z,rn=new tn,B=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Tt(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(an.makeScale(e,t)),this}rotate(e){return Tt(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(an.makeRotation(-e)),this}translate(e,t){return Tt(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(an.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},an=new B,on=new B().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sn=new B().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function cn(){let e={enabled:!0,workingColorSpace:ft,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=ln(e.r),e.g=ln(e.g),e.b=ln(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=un(e.r),e.g=un(e.g),e.b=un(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?pt:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Tt(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Tt(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[ft]:{primaries:t,whitePoint:r,transfer:pt,toXYZ:on,fromXYZ:sn,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:dt},outputColorSpaceConfig:{drawingBufferColorSpace:dt}},[dt]:{primaries:t,whitePoint:r,transfer:mt,toXYZ:on,fromXYZ:sn,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:dt}}}),e}var V=cn();function ln(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function un(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var dn,fn=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{dn===void 0&&(dn=bt(`canvas`)),dn.width=e.width,dn.height=e.height;let t=dn.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=dn}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=bt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=ln(i[e]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(ln(t[e]/255)*255):t[e]=ln(t[e]);return{data:t,width:e.width,height:e.height}}else return F(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},pn=0,mn=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:pn++}),this.uuid=Nt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(hn(r[t].image)):e.push(hn(r[t]))}else e=hn(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function hn(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?fn.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(F(`Texture: Unable to serialize Texture.`),{})}var gn=0,_n=new z,vn=class e extends Ot{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=T,i=T,a=k,o=ne,s=_e,c=re,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:gn++}),this.uuid=Nt(),this.name=``,this.source=new mn(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new R(0,0),this.repeat=new R(1,1),this.center=new R(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new B,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(_n).x}get height(){return this.source.getSize(_n).y}get depth(){return this.source.getSize(_n).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){F(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){F(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case w:e.x-=Math.floor(e.x);break;case T:e.x=e.x<0?0:1;break;case E:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case w:e.y-=Math.floor(e.y);break;case T:e.y=e.y<0?0:1;break;case E:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};vn.DEFAULT_IMAGE=null,vn.DEFAULT_MAPPING=300,vn.DEFAULT_ANISOTROPY=1;var yn=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=L(this.x,e.x,t.x),this.y=L(this.y,e.y,t.y),this.z=L(this.z,e.z,t.z),this.w=L(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=L(this.x,e,t),this.y=L(this.y,e,t),this.z=L(this.z,e,t),this.w=L(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(L(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},bn=class extends Ot{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:k,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new yn(0,0,e,t),this.scissorTest=!1,this.viewport=new yn(0,0,e,t),this.textures=[];let r=new vn({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:k,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new mn(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},xn=class extends bn{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Sn=class extends vn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=D,this.minFilter=D,this.wrapR=T,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Cn=class extends vn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=D,this.minFilter=D,this.wrapR=T,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},wn=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Tn.setFromMatrixColumn(e,0).length(),i=1/Tn.setFromMatrixColumn(e,1).length(),a=1/Tn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Dn,e,On)}lookAt(e,t,n){let r=this.elements;return jn.subVectors(e,t),jn.lengthSq()===0&&(jn.z=1),jn.normalize(),kn.crossVectors(n,jn),kn.lengthSq()===0&&(Math.abs(n.z)===1?jn.x+=1e-4:jn.z+=1e-4,jn.normalize(),kn.crossVectors(n,jn)),kn.normalize(),An.crossVectors(jn,kn),r[0]=kn.x,r[4]=An.x,r[8]=jn.x,r[1]=kn.y,r[5]=An.y,r[9]=jn.y,r[2]=kn.z,r[6]=An.z,r[10]=jn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],ee=r[2],k=r[6],te=r[10],ne=r[14],re=r[3],ie=r[7],A=r[11],ae=r[15];return i[0]=a*x+o*T+s*ee+c*re,i[4]=a*S+o*E+s*k+c*ie,i[8]=a*C+o*D+s*te+c*A,i[12]=a*w+o*O+s*ne+c*ae,i[1]=l*x+u*T+d*ee+f*re,i[5]=l*S+u*E+d*k+f*ie,i[9]=l*C+u*D+d*te+f*A,i[13]=l*w+u*O+d*ne+f*ae,i[2]=p*x+m*T+h*ee+g*re,i[6]=p*S+m*E+h*k+g*ie,i[10]=p*C+m*D+h*te+g*A,i[14]=p*w+m*O+h*ne+g*ae,i[3]=_*x+v*T+y*ee+b*re,i[7]=_*S+v*E+y*k+b*ie,i[11]=_*C+v*D+y*te+b*A,i[15]=_*w+v*O+y*ne+b*ae,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,ee=_*O-v*D+y*E+b*T-x*w+S*C;if(ee===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/ee;return e[0]=(o*O-s*D+c*E)*k,e[1]=(r*D-n*O-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*O-c*w)*k,e[5]=(t*O-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Tn.set(r[0],r[1],r[2]).length(),o=Tn.set(r[4],r[5],r[6]).length(),s=Tn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),En.copy(this);let c=1/a,l=1/o,u=1/s;return En.elements[0]*=c,En.elements[1]*=c,En.elements[2]*=c,En.elements[4]*=l,En.elements[5]*=l,En.elements[6]*=l,En.elements[8]*=u,En.elements[9]*=u,En.elements[10]*=u,t.setFromRotationMatrix(En),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=_t,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=_t,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Tn=new z,En=new wn,Dn=new z(0,0,0),On=new z(1,1,1),kn=new z,An=new z,jn=new z,Mn=new wn,Nn=new tn,Pn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(L(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-L(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(L(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-L(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(L(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-L(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:F(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Mn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Mn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Nn.setFromEuler(this),this.setFromQuaternion(Nn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Pn.DEFAULT_ORDER=`XYZ`;var Fn=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!=0}},In=0,Ln=new z,Rn=new tn,zn=new wn,Bn=new z,Vn=new z,Hn=new z,Un=new tn,Wn=new z(1,0,0),Gn=new z(0,1,0),Kn=new z(0,0,1),qn={type:`added`},Jn={type:`removed`},Yn={type:`childadded`,child:null},Xn={type:`childremoved`,child:null},Zn=class e extends Ot{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:In++}),this.uuid=Nt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new z,n=new Pn,r=new tn,i=new z(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new wn},normalMatrix:{value:new B}}),this.matrix=new wn,this.matrixWorld=new wn,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Fn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Rn.setFromAxisAngle(e,t),this.quaternion.multiply(Rn),this}rotateOnWorldAxis(e,t){return Rn.setFromAxisAngle(e,t),this.quaternion.premultiply(Rn),this}rotateX(e){return this.rotateOnAxis(Wn,e)}rotateY(e){return this.rotateOnAxis(Gn,e)}rotateZ(e){return this.rotateOnAxis(Kn,e)}translateOnAxis(e,t){return Ln.copy(e).applyQuaternion(this.quaternion),this.position.add(Ln.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Wn,e)}translateY(e){return this.translateOnAxis(Gn,e)}translateZ(e){return this.translateOnAxis(Kn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(zn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Bn.copy(e):Bn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Vn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?zn.lookAt(Vn,Bn,this.up):zn.lookAt(Bn,Vn,this.up),this.quaternion.setFromRotationMatrix(zn),r&&(zn.extractRotation(r.matrixWorld),Rn.setFromRotationMatrix(zn),this.quaternion.premultiply(Rn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(I(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(qn),Yn.child=e,this.dispatchEvent(Yn),Yn.child=null):I(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Jn),Xn.child=e,this.dispatchEvent(Xn),Xn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),zn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),zn.multiply(e.parent.matrixWorld)),e.applyMatrix4(zn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(qn),Yn.child=e,this.dispatchEvent(Yn),Yn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vn,e,Hn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vn,Un,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material);if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};Zn.DEFAULT_UP=new z(0,1,0),Zn.DEFAULT_MATRIX_AUTO_UPDATE=!0,Zn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Qn=class extends Zn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},$n={type:`move`},er=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent($n)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Qn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},tr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},nr={h:0,s:0,l:0},rr={h:0,s:0,l:0};function ir(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var H=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=dt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,V.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=V.workingColorSpace){return this.r=e,this.g=t,this.b=n,V.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=V.workingColorSpace){if(e=Pt(e,1),t=L(t,0,1),n=L(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=ir(i,r,e+1/3),this.g=ir(i,r,e),this.b=ir(i,r,e-1/3)}return V.colorSpaceToWorking(this,r),this}setStyle(e,t=dt){function n(t){t!==void 0&&parseFloat(t)<1&&F(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:F(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);F(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=dt){let n=tr[e.toLowerCase()];return n===void 0?F(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ln(e.r),this.g=ln(e.g),this.b=ln(e.b),this}copyLinearToSRGB(e){return this.r=un(e.r),this.g=un(e.g),this.b=un(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=dt){return V.workingToColorSpace(ar.copy(this),e),Math.round(L(ar.r*255,0,255))*65536+Math.round(L(ar.g*255,0,255))*256+Math.round(L(ar.b*255,0,255))}getHexString(e=dt){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=V.workingColorSpace){V.workingToColorSpace(ar.copy(this),t);let n=ar.r,r=ar.g,i=ar.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4;break}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=V.workingColorSpace){return V.workingToColorSpace(ar.copy(this),t),e.r=ar.r,e.g=ar.g,e.b=ar.b,e}getStyle(e=dt){V.workingToColorSpace(ar.copy(this),e);let t=ar.r,n=ar.g,r=ar.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(nr),this.setHSL(nr.h+e,nr.s+t,nr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(nr),e.getHSL(rr);let n=Lt(nr.h,rr.h,t),r=Lt(nr.s,rr.s,t),i=Lt(nr.l,rr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ar=new H;H.NAMES=tr;var or=class e{constructor(e,t=25e-5){this.isFogExp2=!0,this.name=``,this.color=new H(e),this.density=t}clone(){return new e(this.color,this.density)}toJSON(){return{type:`FogExp2`,name:this.name,color:this.color.getHex(),density:this.density}}},sr=class extends Zn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Pn,this.environmentIntensity=1,this.environmentRotation=new Pn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},cr=new z,lr=new z,ur=new z,dr=new z,fr=new z,pr=new z,mr=new z,hr=new z,gr=new z,_r=new z,vr=new yn,yr=new yn,br=new yn,xr=class e{constructor(e=new z,t=new z,n=new z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),cr.subVectors(e,t),r.cross(cr);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){cr.subVectors(r,t),lr.subVectors(n,t),ur.subVectors(e,t);let a=cr.dot(cr),o=cr.dot(lr),s=cr.dot(ur),c=lr.dot(lr),l=lr.dot(ur),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,dr)===null?!1:dr.x>=0&&dr.y>=0&&dr.x+dr.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,dr)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,dr.x),s.addScaledVector(a,dr.y),s.addScaledVector(o,dr.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return vr.setScalar(0),yr.setScalar(0),br.setScalar(0),vr.fromBufferAttribute(e,t),yr.fromBufferAttribute(e,n),br.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(vr,i.x),a.addScaledVector(yr,i.y),a.addScaledVector(br,i.z),a}static isFrontFacing(e,t,n,r){return cr.subVectors(n,t),lr.subVectors(e,t),cr.cross(lr).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return cr.subVectors(this.c,this.b),lr.subVectors(this.a,this.b),cr.cross(lr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;fr.subVectors(r,n),pr.subVectors(i,n),hr.subVectors(e,n);let s=fr.dot(hr),c=pr.dot(hr);if(s<=0&&c<=0)return t.copy(n);gr.subVectors(e,r);let l=fr.dot(gr),u=pr.dot(gr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(fr,a);_r.subVectors(e,i);let f=fr.dot(_r),p=pr.dot(_r);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(pr,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return mr.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(mr,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(fr,a).addScaledVector(pr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Sr=class{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(wr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(wr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=wr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,wr):wr.fromBufferAttribute(r,t),wr.applyMatrix4(e.matrixWorld),this.expandByPoint(wr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Tr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Tr.copy(e.boundingBox)),Tr.applyMatrix4(e.matrixWorld),this.union(Tr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,wr),wr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Mr),Nr.subVectors(this.max,Mr),Er.subVectors(e.a,Mr),Dr.subVectors(e.b,Mr),Or.subVectors(e.c,Mr),kr.subVectors(Dr,Er),Ar.subVectors(Or,Dr),jr.subVectors(Er,Or);let t=[0,-kr.z,kr.y,0,-Ar.z,Ar.y,0,-jr.z,jr.y,kr.z,0,-kr.x,Ar.z,0,-Ar.x,jr.z,0,-jr.x,-kr.y,kr.x,0,-Ar.y,Ar.x,0,-jr.y,jr.x,0];return!Ir(t,Er,Dr,Or,Nr)||(t=[1,0,0,0,1,0,0,0,1],!Ir(t,Er,Dr,Or,Nr))?!1:(Pr.crossVectors(kr,Ar),t=[Pr.x,Pr.y,Pr.z],Ir(t,Er,Dr,Or,Nr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,wr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(wr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Cr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Cr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Cr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Cr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Cr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Cr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Cr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Cr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Cr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Cr=[new z,new z,new z,new z,new z,new z,new z,new z],wr=new z,Tr=new Sr,Er=new z,Dr=new z,Or=new z,kr=new z,Ar=new z,jr=new z,Mr=new z,Nr=new z,Pr=new z,Fr=new z;function Ir(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Fr.fromArray(e,a);let o=i.x*Math.abs(Fr.x)+i.y*Math.abs(Fr.y)+i.z*Math.abs(Fr.z),s=t.dot(Fr),c=n.dot(Fr),l=r.dot(Fr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Lr=new z,Rr=new R,zr=0,Br=class extends Ot{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:zr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=gt,this.updateRanges=[],this.gpuType=ce,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Rr.fromBufferAttribute(this,t),Rr.applyMatrix3(e),this.setXY(t,Rr.x,Rr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Lr.fromBufferAttribute(this,t),Lr.applyMatrix3(e),this.setXYZ(t,Lr.x,Lr.y,Lr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Lr.fromBufferAttribute(this,t),Lr.applyMatrix4(e),this.setXYZ(t,Lr.x,Lr.y,Lr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Lr.fromBufferAttribute(this,t),Lr.applyNormalMatrix(e),this.setXYZ(t,Lr.x,Lr.y,Lr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Lr.fromBufferAttribute(this,t),Lr.transformDirection(e),this.setXYZ(t,Lr.x,Lr.y,Lr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Qt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=$t(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Qt(t,this.array)),t}setX(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Qt(t,this.array)),t}setY(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Qt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Qt(t,this.array)),t}setW(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array),r=$t(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array),r=$t(r,this.array),i=$t(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:`dispose`})}},Vr=class extends Br{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Hr=class extends Br{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Ur=class extends Br{constructor(e,t,n){super(new Float32Array(e),t,n)}},Wr=new Sr,Gr=new z,Kr=new z,qr=class{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Wr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Gr.subVectors(e,this.center);let t=Gr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Gr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Kr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Gr.copy(e.center).add(Kr)),this.expandByPoint(Gr.copy(e.center).sub(Kr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Jr=0,Yr=new wn,Xr=new Zn,Zr=new z,Qr=new Sr,$r=new Sr,ei=new z,ti=class e extends Ot{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Jr++}),this.uuid=Nt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(vt(e)?Hr:Vr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new B().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Yr.makeRotationFromQuaternion(e),this.applyMatrix4(Yr),this}rotateX(e){return Yr.makeRotationX(e),this.applyMatrix4(Yr),this}rotateY(e){return Yr.makeRotationY(e),this.applyMatrix4(Yr),this}rotateZ(e){return Yr.makeRotationZ(e),this.applyMatrix4(Yr),this}translate(e,t,n){return Yr.makeTranslation(e,t,n),this.applyMatrix4(Yr),this}scale(e,t,n){return Yr.makeScale(e,t,n),this.applyMatrix4(Yr),this}lookAt(e){return Xr.lookAt(e),Xr.updateMatrix(),this.applyMatrix4(Xr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Zr).negate(),this.translate(Zr.x,Zr.y,Zr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Ur(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&F(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){I(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Qr.setFromBufferAttribute(n),this.morphTargetsRelative?(ei.addVectors(this.boundingBox.min,Qr.min),this.boundingBox.expandByPoint(ei),ei.addVectors(this.boundingBox.max,Qr.max),this.boundingBox.expandByPoint(ei)):(this.boundingBox.expandByPoint(Qr.min),this.boundingBox.expandByPoint(Qr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&I(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){I(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new z,1/0);return}if(e){let n=this.boundingSphere.center;if(Qr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];$r.setFromBufferAttribute(n),this.morphTargetsRelative?(ei.addVectors(Qr.min,$r.min),Qr.expandByPoint(ei),ei.addVectors(Qr.max,$r.max),Qr.expandByPoint(ei)):(Qr.expandByPoint($r.min),Qr.expandByPoint($r.max))}Qr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)ei.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(ei));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)ei.fromBufferAttribute(a,t),o&&(Zr.fromBufferAttribute(e,t),ei.add(Zr)),r=Math.max(r,n.distanceToSquared(ei))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&I(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){I(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Br(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new z,s[e]=new z;let c=new z,l=new z,u=new z,d=new R,f=new R,p=new R,m=new z,h=new z;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new z,y=new z,b=new z,x=new z;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Br(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new z,i=new z,a=new z,o=new z,s=new z,c=new z,l=new z,u=new z;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ei.fromBufferAttribute(e,t),ei.normalize(),e.setXYZ(t,ei.x,ei.y,ei.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Br(a,r,i)}if(this.index===null)return F(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},ni=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=gt,this.updateRanges=[],this.version=0,this.uuid=Nt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Nt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Nt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},ri=new z,ii=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)ri.fromBufferAttribute(this,t),ri.applyMatrix4(e),this.setXYZ(t,ri.x,ri.y,ri.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ri.fromBufferAttribute(this,t),ri.applyNormalMatrix(e),this.setXYZ(t,ri.x,ri.y,ri.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ri.fromBufferAttribute(this,t),ri.transformDirection(e),this.setXYZ(t,ri.x,ri.y,ri.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Qt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=$t(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=$t(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=$t(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=$t(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=$t(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Qt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Qt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Qt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Qt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array),r=$t(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=$t(t,this.array),n=$t(n,this.array),r=$t(r,this.array),i=$t(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){Ct(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new Br(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ct(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ai=0,oi=class extends Ot{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ai++}),this.uuid=Nt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new H(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ht,this.stencilZFail=ht,this.stencilZPass=ht,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){F(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){F(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new H().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors==`number`?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new R().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new R().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},si=class extends oi{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new H(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ci,li=new z,ui=new z,di=new z,fi=new R,pi=new R,mi=new wn,hi=new z,gi=new z,_i=new z,vi=new R,yi=new R,bi=new R,xi=class extends Zn{constructor(e=new si){if(super(),this.isSprite=!0,this.type=`Sprite`,ci===void 0){ci=new ti;let e=new ni(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);ci.setIndex([0,1,2,0,2,3]),ci.setAttribute(`position`,new ii(e,3,0,!1)),ci.setAttribute(`uv`,new ii(e,2,3,!1))}this.geometry=ci,this.material=e,this.center=new R(.5,.5),this.count=1}raycast(e,t){e.camera===null&&I(`Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),ui.setFromMatrixScale(this.matrixWorld),mi.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),di.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ui.multiplyScalar(-di.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;Si(hi.set(-.5,-.5,0),di,a,ui,r,i),Si(gi.set(.5,-.5,0),di,a,ui,r,i),Si(_i.set(.5,.5,0),di,a,ui,r,i),vi.set(0,0),yi.set(1,0),bi.set(1,1);let o=e.ray.intersectTriangle(hi,gi,_i,!1,li);if(o===null&&(Si(gi.set(-.5,.5,0),di,a,ui,r,i),yi.set(0,1),o=e.ray.intersectTriangle(hi,_i,gi,!1,li),o===null))return;let s=e.ray.origin.distanceTo(li);s<e.near||s>e.far||t.push({distance:s,point:li.clone(),uv:xr.getInterpolation(li,hi,gi,_i,vi,yi,bi,new R),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Si(e,t,n,r,i,a){fi.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?pi.copy(fi):(pi.x=a*fi.x-i*fi.y,pi.y=i*fi.x+a*fi.y),e.copy(t),e.x+=pi.x,e.y+=pi.y,e.applyMatrix4(mi)}var Ci=new z,wi=new z,Ti=new z,Ei=new z,Di=new z,Oi=new z,ki=new z,Ai=class{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ci)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ci.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ci.copy(this.origin).addScaledVector(this.direction,t),Ci.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){wi.copy(e).add(t).multiplyScalar(.5),Ti.copy(t).sub(e).normalize(),Ei.copy(this.origin).sub(wi);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Ti),o=Ei.dot(this.direction),s=-Ei.dot(Ti),c=Ei.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0)if(u=a*s-o,d=a*o-s,p=i*l,u>=0)if(d>=-p)if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c);else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(wi).addScaledVector(Ti,d),f}intersectSphere(e,t){Ci.subVectors(e.center,this.origin);let n=Ci.dot(this.direction),r=Ci.dot(Ci)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Ci)!==null}intersectTriangle(e,t,n,r,i){Di.subVectors(t,e),Oi.subVectors(n,e),ki.crossVectors(Di,Oi);let a=this.direction.dot(ki),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ei.subVectors(this.origin,e);let s=o*this.direction.dot(Oi.crossVectors(Ei,Oi));if(s<0)return null;let c=o*this.direction.dot(Di.cross(Ei));if(c<0||s+c>a)return null;let l=-o*Ei.dot(ki);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ji=class extends oi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new H(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Mi=new wn,Ni=new Ai,Pi=new qr,Fi=new z,Ii=new z,Li=new z,Ri=new z,zi=new z,Bi=new z,Vi=new z,Hi=new z,Ui=class extends Zn{constructor(e=new ti,t=new ji){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Bi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(zi.fromBufferAttribute(s,e),a?Bi.addScaledVector(zi,r):Bi.addScaledVector(zi.sub(t),r))}t.add(Bi)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Pi.copy(n.boundingSphere),Pi.applyMatrix4(i),Ni.copy(e.ray).recast(e.near),!(Pi.containsPoint(Ni.origin)===!1&&(Ni.intersectSphere(Pi,Fi)===null||Ni.origin.distanceToSquared(Fi)>(e.far-e.near)**2))&&(Mi.copy(i).invert(),Ni.copy(e.ray).applyMatrix4(Mi),!(n.boundingBox!==null&&Ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ni)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null)if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Gi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Gi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}else if(s!==void 0)if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Gi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Gi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}};function Wi(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Hi.copy(s),Hi.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Hi);return l<n.near||l>n.far?null:{distance:l,point:Hi.clone(),object:e}}function Gi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Ii),e.getVertexPosition(c,Li),e.getVertexPosition(l,Ri);let u=Wi(e,t,n,r,Ii,Li,Ri,Vi);if(u){let e=new z;xr.getBarycoord(Vi,Ii,Li,Ri,e),i&&(u.uv=xr.getInterpolatedAttribute(i,s,c,l,e,new R)),a&&(u.uv1=xr.getInterpolatedAttribute(a,s,c,l,e,new R)),o&&(u.normal=xr.getInterpolatedAttribute(o,s,c,l,e,new z),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new z,materialIndex:0};xr.getNormal(Ii,Li,Ri,t.normal),u.face=t,u.barycoord=e}return u}var Ki=class extends vn{constructor(e=null,t=1,n=1,r,i,a,o,s,c=D,l=D,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},qi=class extends Br{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ji=new wn,Yi=new wn,Xi=[],Zi=new Sr,Qi=new wn,$i=new Ui,ea=new qr,ta=class extends Ui{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new qi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Qi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Sr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ji),Zi.copy(e.boundingBox).applyMatrix4(Ji),this.boundingBox.union(Zi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new qr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ji),ea.copy(e.boundingSphere).applyMatrix4(Ji),this.boundingSphere.union(ea)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if($i.geometry=this.geometry,$i.material=this.material,$i.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ea.copy(this.boundingSphere),ea.applyMatrix4(n),e.ray.intersectsSphere(ea)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Ji),Yi.multiplyMatrices(n,Ji),$i.matrixWorld=Yi,$i.raycast(e,Xi);for(let e=0,n=Xi.length;e<n;e++){let n=Xi[e];n.instanceId=i,n.object=this,t.push(n)}Xi.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new qi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ki(new Float32Array(r*this.count),r,this.count,be,ce));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:`dispose`}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},na=new z,ra=new z,ia=new B,aa=class{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=na.subVectors(n,t).cross(ra.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(na),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ia.getNormalMatrix(e),r=this.coplanarPoint(na).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},oa=new qr,sa=new R(.5,.5),ca=new z,la=class{constructor(e=new aa,t=new aa,n=new aa,r=new aa,i=new aa,a=new aa){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=_t,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),oa.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),oa.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(oa)}intersectsSprite(e){return oa.center.set(0,0,0),oa.radius=.7071067811865476+sa.distanceTo(e.center),oa.applyMatrix4(e.matrixWorld),this.intersectsSphere(oa)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(ca.x=r.normal.x>0?e.max.x:e.min.x,ca.y=r.normal.y>0?e.max.y:e.min.y,ca.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ca)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},ua=class extends oi{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new H(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},da=new wn,fa=new Ai,pa=new qr,ma=new z,ha=class extends Zn{constructor(e=new ti,t=new ua){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),pa.copy(n.boundingSphere),pa.applyMatrix4(r),pa.radius+=i,e.ray.intersectsSphere(pa)===!1)return;da.copy(r).invert(),fa.copy(e.ray).applyMatrix4(da);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);ma.fromBufferAttribute(l,n),ga(ma,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)ma.fromBufferAttribute(l,a),ga(ma,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function ga(e,t,n,r,i,a,o){let s=fa.distanceSqToPoint(e);if(s<n){let n=new z;fa.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var _a=class extends vn{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},va=class extends vn{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},ya=class extends vn{constructor(e,t,n=se,r,i,a,o=D,s=D,c,l=ve,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new mn(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ba=class extends ya{constructor(e,t=se,n=301,r,i,a=D,o=D,s,c=ve){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},xa=class extends vn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Sa=class e extends ti{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Ur(c,3)),this.setAttribute(`normal`,new Ur(l,3)),this.setAttribute(`uv`,new Ur(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new z;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Ca=class e extends ti{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new z,l=new R;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new Ur(a,3)),this.setAttribute(`normal`,new Ur(o,3)),this.setAttribute(`uv`,new Ur(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},wa=class e extends ti{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Ur(u,3)),this.setAttribute(`normal`,new Ur(d,3)),this.setAttribute(`uv`,new Ur(f,2));function _(){let a=new z,_=new z,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new R,m=new z,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ta=class e extends wa{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ea=class e extends ti{constructor(e=[new R(0,-.5),new R(.5,0),new R(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=L(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new z,d=new R,f=new z,p=new z,m=new z,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new Ur(a,3)),this.setAttribute(`uv`,new Ur(o,2)),this.setAttribute(`normal`,new Ur(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},Da=class e extends ti{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Ur(p,3)),this.setAttribute(`normal`,new Ur(m,3)),this.setAttribute(`uv`,new Ur(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Oa=class e extends ti{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new z,d=new z,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Ur(p,3)),this.setAttribute(`normal`,new Ur(m,3)),this.setAttribute(`uv`,new Ur(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function ka(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(ja(i))i.isRenderTargetTexture?(F(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i))if(ja(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice();else t[n][r]=i}}return t}function Aa(e){let t={};for(let n=0;n<e.length;n++){let r=ka(e[n]);for(let e in r)t[e]=r[e]}return t}function ja(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Ma(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Na(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:V.workingColorSpace}var Pa={clone:ka,merge:Aa},Fa=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ia=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,La=class extends oi{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Fa,this.fragmentShader=Ia,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ka(e.uniforms),this.uniformsGroups=Ma(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new H().setHex(r.value);break;case`v2`:this.uniforms[n].value=new R().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new z().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new yn().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new B().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new wn().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Ra=class extends La{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},za=class extends oi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new H(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new H(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new R(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ba=class extends za{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new R(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return L(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new H(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new H(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new H(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},Va=class extends oi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new H(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new H(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new R(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ha=class extends oi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=ut,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ua=class extends oi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Wa(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}var Ga=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Ka=class extends Ga{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:st,endingEnd:st}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case ct:i=e,o=2*t-n;break;case lt:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case ct:a=e,s=2*n-t;break;case lt:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},qa=class extends Ga{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Ja=class extends Ga{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Ya=class extends Ga{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=(n-t)/(r-t),S,C,w,T,E;for(let e=0;e<8;e++){S=x*x,C=S*x,w=1-x,T=w*w,E=T*w;let e=E*t+3*T*x*g+3*w*S*y+C*r-n;if(Math.abs(e)<1e-10)break;let i=3*T*(g-t)+6*w*x*(y-g)+3*S*(r-y);if(Math.abs(i)<1e-10)break;x-=e/i,x=Math.max(0,Math.min(1,x))}i[p]=E*o+3*T*x*_+3*w*S*b+C*m}return i}},Xa=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Wa(t,this.TimeBufferType),this.values=Wa(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Wa(e.times,Array),values:Wa(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ja(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new qa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ka(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Ya(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case rt:t=this.InterpolantFactoryMethodDiscrete;break;case it:t=this.InterpolantFactoryMethodLinear;break;case at:t=this.InterpolantFactoryMethodSmooth;break;case ot:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t);return F(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return rt;case this.InterpolantFactoryMethodLinear:return it;case this.InterpolantFactoryMethodSmooth:return at;case this.InterpolantFactoryMethodBezier:return ot}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(I(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(I(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){I(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){I(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&yt(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){I(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===at,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0]))if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Xa.prototype.ValueTypeName=``,Xa.prototype.TimeBufferType=Float32Array,Xa.prototype.ValueBufferType=Float32Array,Xa.prototype.DefaultInterpolation=it;var Za=class extends Xa{constructor(e,t,n){super(e,t,n)}};Za.prototype.ValueTypeName=`bool`,Za.prototype.ValueBufferType=Array,Za.prototype.DefaultInterpolation=rt,Za.prototype.InterpolantFactoryMethodLinear=void 0,Za.prototype.InterpolantFactoryMethodSmooth=void 0;var Qa=class extends Xa{constructor(e,t,n,r){super(e,t,n,r)}};Qa.prototype.ValueTypeName=`color`;var $a=class extends Xa{constructor(e,t,n,r){super(e,t,n,r)}};$a.prototype.ValueTypeName=`number`;var eo=class extends Ga{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)tn.slerpFlat(i,0,a,c-o,a,c,s);return i}},to=class extends Xa{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new eo(this.times,this.values,this.getValueSize(),e)}};to.prototype.ValueTypeName=`quaternion`,to.prototype.InterpolantFactoryMethodSmooth=void 0;var no=class extends Xa{constructor(e,t,n){super(e,t,n)}};no.prototype.ValueTypeName=`string`,no.prototype.ValueBufferType=Array,no.prototype.DefaultInterpolation=rt,no.prototype.InterpolantFactoryMethodLinear=void 0,no.prototype.InterpolantFactoryMethodSmooth=void 0;var ro=class extends Xa{constructor(e,t,n,r){super(e,t,n,r)}};ro.prototype.ValueTypeName=`vector`;var io={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(ao(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!ao(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function ao(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var oo=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},so=class{constructor(e){this.manager=e===void 0?oo:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};so.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var co=new WeakMap,lo=class extends so{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=io.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=co.get(a);e===void 0&&(e=[],co.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=bt(`img`);function s(){l(),t&&t(this);let n=co.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}co.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),io.remove(`image:${e}`);let n=co.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}co.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),io.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},uo=class extends so{constructor(e){super(e)}load(e,t,n,r){let i=new vn,a=new lo(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},fo=class extends Zn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new H(e),this.intensity=t}dispose(){this.dispatchEvent({type:`dispose`})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},po=new wn,mo=new z,ho=new z,go=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new R(512,512),this.mapType=re,this.map=null,this.mapPass=null,this.matrix=new wn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new la,this._frameExtents=new R(1,1),this._viewportCount=1,this._viewports=[new yn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;mo.setFromMatrixPosition(e.matrixWorld),t.position.copy(mo),ho.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ho),t.updateMatrixWorld(),po.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(po,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===2001||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(po)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},_o=new z,vo=new tn,yo=new z,bo=class extends Zn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new wn,this.projectionMatrix=new wn,this.projectionMatrixInverse=new wn,this.coordinateSystem=_t,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(_o,vo,yo),yo.x===1&&yo.y===1&&yo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_o,vo,yo.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(_o,vo,yo),yo.x===1&&yo.y===1&&yo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_o,vo,yo.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},xo=new z,So=new R,Co=new R,wo=class extends bo{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Mt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(jt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Mt*2*Math.atan(Math.tan(jt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){xo.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(xo.x,xo.y).multiplyScalar(-e/xo.z),xo.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(xo.x,xo.y).multiplyScalar(-e/xo.z)}getViewSize(e,t){return this.getViewBounds(e,So,Co),t.subVectors(Co,So)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(jt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},To=class extends go{constructor(){super(new wo(90,1,.5,500)),this.isPointLightShadow=!0}},Eo=class extends fo{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new To}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Do=class extends bo{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Oo=class extends go{constructor(){super(new Do(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ko=class extends fo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Zn.DEFAULT_UP),this.updateMatrix(),this.target=new Zn,this.shadow=new Oo}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Ao=class extends fo{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type=`AmbientLight`}},jo=-90,Mo=1,No=class extends Zn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new wo(jo,Mo,e,t);r.layers=this.layers,this.add(r);let i=new wo(jo,Mo,e,t);i.layers=this.layers,this.add(i);let a=new wo(jo,Mo,e,t);a.layers=this.layers,this.add(a);let o=new wo(jo,Mo,e,t);o.layers=this.layers,this.add(o);let s=new wo(jo,Mo,e,t);s.layers=this.layers,this.add(s);let c=new wo(jo,Mo,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Po=class extends wo{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Fo=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Io.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Io(){this._document.hidden===!1&&this.reset()}var Lo=`\\[\\]\\.:\\/`,Ro=RegExp(`[\\[\\]\\.:\\/]`,`g`),zo=`[^\\[\\]\\.:\\/]`,Bo=`[^`+Lo.replace(`\\.`,``)+`]`,Vo=`((?:WC+[\\/:])*)`.replace(`WC`,zo),Ho=`(WCOD+)?`.replace(`WCOD`,Bo),Uo=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,zo),Wo=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,zo),Go=RegExp(`^`+Vo+Ho+Uo+Wo+`$`),Ko=[`material`,`materials`,`bones`,`map`],qo=class{constructor(e,t,n){let r=n||Jo.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Jo=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Ro,``)}static parseTrackName(e){let t=Go.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Ko.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){F(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){I(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){I(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){I(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){I(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){I(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){I(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){I(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;I(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){I(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){I(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Jo.Composite=qo,Jo.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Jo.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Jo.prototype.GetterByBindingType=[Jo.prototype._getValue_direct,Jo.prototype._getValue_array,Jo.prototype._getValue_arrayElement,Jo.prototype._getValue_toArray],Jo.prototype.SetterByBindingTypeAndVersioning=[[Jo.prototype._setValue_direct,Jo.prototype._setValue_direct_setNeedsUpdate,Jo.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Jo.prototype._setValue_array,Jo.prototype._setValue_array_setNeedsUpdate,Jo.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Jo.prototype._setValue_arrayElement,Jo.prototype._setValue_arrayElement_setNeedsUpdate,Jo.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Jo.prototype._setValue_fromArray,Jo.prototype._setValue_fromArray_setNeedsUpdate,Jo.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function Yo(e,t,n,r){let i=Xo(r);switch(n){case he:return e*t;case be:return e*t/i.components*i.byteLength;case xe:return e*t/i.components*i.byteLength;case Se:return e*t*2/i.components*i.byteLength;case Ce:return e*t*2/i.components*i.byteLength;case ge:return e*t*3/i.components*i.byteLength;case _e:return e*t*4/i.components*i.byteLength;case we:return e*t*4/i.components*i.byteLength;case Te:case Ee:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case De:case Oe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ae:case Me:return Math.max(e,16)*Math.max(t,8)/4;case ke:case je:return Math.max(e,8)*Math.max(t,8)/2;case Ne:case Pe:case Ie:case Le:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Fe:case j:case Re:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ze:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Be:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case M:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Ve:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case N:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case P:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case He:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Ue:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case We:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Ge:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Ke:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case qe:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Je:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ye:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Xe:case Ze:case Qe:return Math.ceil(e/4)*Math.ceil(t/4)*16;case $e:case et:return Math.ceil(e/4)*Math.ceil(t/4)*8;case tt:case nt:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Xo(e){switch(e){case re:case ie:return{byteLength:1,components:1};case ae:case A:case le:return{byteLength:2,components:1};case ue:case de:return{byteLength:2,components:4};case se:case oe:case ce:return{byteLength:4,components:1};case pe:case me:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`185`}})),typeof window<`u`&&(window.__THREE__?F(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`185`);function Zo(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Qo(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var U={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},W={common:{diffuse:{value:new H(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new B},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new B}},envmap:{envMap:{value:null},envMapRotation:{value:new B},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new B}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new B}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new B},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new B},normalScale:{value:new R(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new B},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new B}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new B}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new B}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new H(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new z},probesMax:{value:new z},probesResolution:{value:new z}},points:{diffuse:{value:new H(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0},uvTransform:{value:new B}},sprite:{diffuse:{value:new H(16777215)},opacity:{value:1},center:{value:new R(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new B},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0}}},$o={basic:{uniforms:Aa([W.common,W.specularmap,W.envmap,W.aomap,W.lightmap,W.fog]),vertexShader:U.meshbasic_vert,fragmentShader:U.meshbasic_frag},lambert:{uniforms:Aa([W.common,W.specularmap,W.envmap,W.aomap,W.lightmap,W.emissivemap,W.bumpmap,W.normalmap,W.displacementmap,W.fog,W.lights,{emissive:{value:new H(0)},envMapIntensity:{value:1}}]),vertexShader:U.meshlambert_vert,fragmentShader:U.meshlambert_frag},phong:{uniforms:Aa([W.common,W.specularmap,W.envmap,W.aomap,W.lightmap,W.emissivemap,W.bumpmap,W.normalmap,W.displacementmap,W.fog,W.lights,{emissive:{value:new H(0)},specular:{value:new H(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:U.meshphong_vert,fragmentShader:U.meshphong_frag},standard:{uniforms:Aa([W.common,W.envmap,W.aomap,W.lightmap,W.emissivemap,W.bumpmap,W.normalmap,W.displacementmap,W.roughnessmap,W.metalnessmap,W.fog,W.lights,{emissive:{value:new H(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:U.meshphysical_vert,fragmentShader:U.meshphysical_frag},toon:{uniforms:Aa([W.common,W.aomap,W.lightmap,W.emissivemap,W.bumpmap,W.normalmap,W.displacementmap,W.gradientmap,W.fog,W.lights,{emissive:{value:new H(0)}}]),vertexShader:U.meshtoon_vert,fragmentShader:U.meshtoon_frag},matcap:{uniforms:Aa([W.common,W.bumpmap,W.normalmap,W.displacementmap,W.fog,{matcap:{value:null}}]),vertexShader:U.meshmatcap_vert,fragmentShader:U.meshmatcap_frag},points:{uniforms:Aa([W.points,W.fog]),vertexShader:U.points_vert,fragmentShader:U.points_frag},dashed:{uniforms:Aa([W.common,W.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:U.linedashed_vert,fragmentShader:U.linedashed_frag},depth:{uniforms:Aa([W.common,W.displacementmap]),vertexShader:U.depth_vert,fragmentShader:U.depth_frag},normal:{uniforms:Aa([W.common,W.bumpmap,W.normalmap,W.displacementmap,{opacity:{value:1}}]),vertexShader:U.meshnormal_vert,fragmentShader:U.meshnormal_frag},sprite:{uniforms:Aa([W.sprite,W.fog]),vertexShader:U.sprite_vert,fragmentShader:U.sprite_frag},background:{uniforms:{uvTransform:{value:new B},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:U.background_vert,fragmentShader:U.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new B}},vertexShader:U.backgroundCube_vert,fragmentShader:U.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:U.cube_vert,fragmentShader:U.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:U.equirect_vert,fragmentShader:U.equirect_frag},distance:{uniforms:Aa([W.common,W.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:U.distance_vert,fragmentShader:U.distance_frag},shadow:{uniforms:Aa([W.lights,W.fog,{color:{value:new H(0)},opacity:{value:1}}]),vertexShader:U.shadow_vert,fragmentShader:U.shadow_frag}};$o.physical={uniforms:Aa([$o.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new B},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new B},clearcoatNormalScale:{value:new R(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new B},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new B},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new B},sheen:{value:0},sheenColor:{value:new H(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new B},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new B},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new B},transmissionSamplerSize:{value:new R},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new B},attenuationDistance:{value:0},attenuationColor:{value:new H(0)},specularColor:{value:new H(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new B},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new B},anisotropyVector:{value:new R},anisotropyMap:{value:null},anisotropyMapTransform:{value:new B}}]),vertexShader:U.meshphysical_vert,fragmentShader:U.meshphysical_frag};var es={r:0,b:0,g:0},ts=new wn,ns=new B;ns.set(-1,0,0,0,1,0,0,0,1);function rs(e,t,n,r,i,a){let o=new H(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new Ui(new Sa(1,1,1),new La({name:`BackgroundCubeMaterial`,uniforms:ka($o.backgroundCube.uniforms),vertexShader:$o.backgroundCube.vertexShader,fragmentShader:$o.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(ts.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(ns),l.material.toneMapped=V.getTransfer(i.colorSpace)!==mt,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Ui(new Da(2,2),new La({name:`BackgroundMaterial`,uniforms:ka($o.background.uniforms),vertexShader:$o.background.vertexShader,fragmentShader:$o.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=V.getTransfer(i.colorSpace)!==mt,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(es,Na(e)),n.buffers.color.setClear(es.r,es.g,es.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function is(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function as(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function os(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return!(t!==1023&&r.convert(t)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(F(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&F(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function ss(e){let t=this,n=null,r=0,i=!1,a=!1,o=new aa,s=new B,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var cs=4,ls=[.125,.215,.35,.446,.526,.582],us=20,ds=256,fs=new Do,ps=new H,ms=null,hs=0,gs=0,_s=!1,vs=new z,ys=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=vs}=i;ms=this._renderer.getRenderTarget(),hs=this._renderer.getActiveCubeFace(),gs=this._renderer.getActiveMipmapLevel(),_s=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Es(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ts(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ms,hs,gs),this._renderer.xr.enabled=_s,e.scissorTest=!1,Ss(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ms=this._renderer.getRenderTarget(),hs=this._renderer.getActiveCubeFace(),gs=this._renderer.getActiveMipmapLevel(),_s=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:k,minFilter:k,generateMipmaps:!1,type:le,format:_e,colorSpace:ft,depthBuffer:!1},r=xs(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xs(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=bs(r)),this._blurMaterial=ws(r,e,t),this._ggxMaterial=Cs(r,e,t)}return r}_compileMaterial(e){let t=new Ui(new ti,e);this._renderer.compile(t,fs)}_sceneToCubeUV(e,t,n,r,i){let a=new wo(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(ps),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ui(new Sa,new ji({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(ps),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Ss(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Es()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ts());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Ss(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,fs)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-cs?n-d+cs:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Ss(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,fs),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Ss(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,fs)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&I(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/(2*us-1),p=i/f,m=isFinite(i)?1+Math.floor(3*p):us;m>us&&F(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${us}`);let h=[],g=0;for(let e=0;e<us;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];Ss(t,3*v*(r>_-cs?r-_+cs:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,fs)}};function bs(e){let t=[],n=[],r=[],i=e,a=e-cs+1+ls.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-cs?s=ls[o-e+cs-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new ti;h.setAttribute(`position`,new Br(f,3)),h.setAttribute(`uv`,new Br(p,2)),h.setAttribute(`faceIndex`,new Br(m,1)),r.push(new Ui(h,null)),i>cs&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function xs(e,t,n){let r=new xn(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Ss(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Cs(e,t,n){return new La({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:ds,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ds(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ws(e,t,n){let r=new Float32Array(us),i=new z(0,1,0);return new La({name:`SphericalGaussianBlur`,defines:{n:us,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ds(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ts(){return new La({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Ds(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Es(){return new La({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ds(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ds(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Os=class extends xn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new _a(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Sa(5,5,5),i=new La({name:`CubemapFromEquirect`,uniforms:ka(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Ui(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=k),new No(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function ks(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304)if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}else{let r=n.image;if(r&&r.height>0){let i=new Os(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}else return null}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new ys(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new ys(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function As(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Tt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function js(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Hr:Vr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Ms(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Ns(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:I(`WebGLInfo: Unknown draw mode:`,r);break}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Ps(e,t,n){let r=new WeakMap,i=new yn;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Sn(h,p,m,u);g.type=ce,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new R(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Fs(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Is={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Ls(e,t,n,r,i,a){let o=new xn(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new ya(t,n):void 0}),s=new xn(t,n,{type:le,depthBuffer:!1,stencilBuffer:!1}),c=new ti;c.setAttribute(`position`,new Ur([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute(`uv`,new Ur([0,2,0,0,2,0],2));let l=new Ra({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new Ui(c,l),d=new Do(-1,1,1,-1,0,1),f=null,p=null,m=!1,h,g=null,_=[],v=!1;this.setSize=function(e,t){o.setSize(e,t),s.setSize(e,t);for(let n=0;n<_.length;n++){let r=_[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){_=e,v=_.length>0&&_[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<_.length;e++){let r=_[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(m||e.toneMapping===0&&_.length===0)return!1;if(g=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return v===!1&&e.setRenderTarget(o),h=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return v},this.end=function(e,t){e.toneMapping=h,m=!0;let n=o,r=s;for(let i=0;i<_.length;i++){let a=_[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,l.defines={},V.getTransfer(f)===`srgb`&&(l.defines.SRGB_TRANSFER=``);let t=Is[p];t&&(l.defines[t]=``),l.needsUpdate=!0}l.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(g),e.render(u,d),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose()}}var Rs=new vn,zs=new ya(1,1),Bs=new Sn,Vs=new Cn,Hs=new _a,Us=[],Ws=[],Gs=new Float32Array(16),Ks=new Float32Array(9),qs=new Float32Array(4);function Js(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Us[i];if(a===void 0&&(a=new Float32Array(i),Us[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Ys(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Xs(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Zs(e,t){let n=Ws[t];n===void 0&&(n=new Int32Array(t),Ws[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Qs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function $s(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ys(n,t))return;e.uniform2fv(this.addr,t),Xs(n,t)}}function ec(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Ys(n,t))return;e.uniform3fv(this.addr,t),Xs(n,t)}}function tc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ys(n,t))return;e.uniform4fv(this.addr,t),Xs(n,t)}}function nc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ys(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Xs(n,t)}else{if(Ys(n,r))return;qs.set(r),e.uniformMatrix2fv(this.addr,!1,qs),Xs(n,r)}}function rc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ys(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Xs(n,t)}else{if(Ys(n,r))return;Ks.set(r),e.uniformMatrix3fv(this.addr,!1,Ks),Xs(n,r)}}function ic(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ys(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Xs(n,t)}else{if(Ys(n,r))return;Gs.set(r),e.uniformMatrix4fv(this.addr,!1,Gs),Xs(n,r)}}function ac(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function oc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ys(n,t))return;e.uniform2iv(this.addr,t),Xs(n,t)}}function sc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ys(n,t))return;e.uniform3iv(this.addr,t),Xs(n,t)}}function cc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ys(n,t))return;e.uniform4iv(this.addr,t),Xs(n,t)}}function lc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function uc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ys(n,t))return;e.uniform2uiv(this.addr,t),Xs(n,t)}}function dc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ys(n,t))return;e.uniform3uiv(this.addr,t),Xs(n,t)}}function fc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ys(n,t))return;e.uniform4uiv(this.addr,t),Xs(n,t)}}function pc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(zs.compareFunction=n.isReversedDepthBuffer()?518:515,a=zs):a=Rs,n.setTexture2D(t||a,i)}function mc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Vs,i)}function hc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Hs,i)}function gc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Bs,i)}function _c(e){switch(e){case 5126:return Qs;case 35664:return $s;case 35665:return ec;case 35666:return tc;case 35674:return nc;case 35675:return rc;case 35676:return ic;case 5124:case 35670:return ac;case 35667:case 35671:return oc;case 35668:case 35672:return sc;case 35669:case 35673:return cc;case 5125:return lc;case 36294:return uc;case 36295:return dc;case 36296:return fc;case 35678:case 36198:case 36298:case 36306:case 35682:return pc;case 35679:case 36299:case 36307:return mc;case 35680:case 36300:case 36308:case 36293:return hc;case 36289:case 36303:case 36311:case 36292:return gc}}function vc(e,t){e.uniform1fv(this.addr,t)}function yc(e,t){let n=Js(t,this.size,2);e.uniform2fv(this.addr,n)}function bc(e,t){let n=Js(t,this.size,3);e.uniform3fv(this.addr,n)}function xc(e,t){let n=Js(t,this.size,4);e.uniform4fv(this.addr,n)}function Sc(e,t){let n=Js(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Cc(e,t){let n=Js(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function wc(e,t){let n=Js(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Tc(e,t){e.uniform1iv(this.addr,t)}function Ec(e,t){e.uniform2iv(this.addr,t)}function Dc(e,t){e.uniform3iv(this.addr,t)}function Oc(e,t){e.uniform4iv(this.addr,t)}function kc(e,t){e.uniform1uiv(this.addr,t)}function Ac(e,t){e.uniform2uiv(this.addr,t)}function jc(e,t){e.uniform3uiv(this.addr,t)}function Mc(e,t){e.uniform4uiv(this.addr,t)}function Nc(e,t,n){let r=this.cache,i=t.length,a=Zs(n,i);Ys(r,a)||(e.uniform1iv(this.addr,a),Xs(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?zs:Rs;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Pc(e,t,n){let r=this.cache,i=t.length,a=Zs(n,i);Ys(r,a)||(e.uniform1iv(this.addr,a),Xs(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Vs,a[e])}function Fc(e,t,n){let r=this.cache,i=t.length,a=Zs(n,i);Ys(r,a)||(e.uniform1iv(this.addr,a),Xs(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Hs,a[e])}function Ic(e,t,n){let r=this.cache,i=t.length,a=Zs(n,i);Ys(r,a)||(e.uniform1iv(this.addr,a),Xs(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Bs,a[e])}function Lc(e){switch(e){case 5126:return vc;case 35664:return yc;case 35665:return bc;case 35666:return xc;case 35674:return Sc;case 35675:return Cc;case 35676:return wc;case 5124:case 35670:return Tc;case 35667:case 35671:return Ec;case 35668:case 35672:return Dc;case 35669:case 35673:return Oc;case 5125:return kc;case 36294:return Ac;case 36295:return jc;case 36296:return Mc;case 35678:case 36198:case 36298:case 36306:case 35682:return Nc;case 35679:case 36299:case 36307:return Pc;case 35680:case 36300:case 36308:case 36293:return Fc;case 36289:case 36303:case 36311:case 36292:return Ic}}var Rc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=_c(t.type)}},zc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Lc(t.type)}},Bc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Vc=/(\w+)(\])?(\[|\.)?/g;function Hc(e,t){e.seq.push(t),e.map[t.id]=t}function Uc(e,t,n){let r=e.name,i=r.length;for(Vc.lastIndex=0;;){let a=Vc.exec(r),o=Vc.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Hc(n,l===void 0?new Rc(s,e,t):new zc(s,e,t));break}else{let e=n.map[s];e===void 0&&(e=new Bc(s),Hc(n,e)),n=e}}}var Wc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Uc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Gc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Kc=37297,qc=0;function Jc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Yc=new B;function Xc(e){V._getMatrix(Yc,V.workingColorSpace,e);let t=`mat3( ${Yc.elements.map(e=>e.toFixed(4))} )`;switch(V.getTransfer(e)){case pt:return[t,`LinearTransferOETF`];case mt:return[t,`sRGBTransferOETF`];default:return F(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Zc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Jc(e.getShaderSource(t),r)}else return i}function Qc(e,t){let n=Xc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var $c={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function el(e,t){let n=$c[t];return n===void 0?(F(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var tl=new z;function nl(){return V.getLuminanceCoefficients(tl),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${tl.x.toFixed(4)}, ${tl.y.toFixed(4)}, ${tl.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function rl(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(ol).join(`
`)}function il(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function al(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function ol(e){return e!==``}function sl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function cl(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var ll=/^[ \t]*#include +<([\w\d./]+)>/gm;function ul(e){return e.replace(ll,fl)}var dl=new Map;function fl(e,t){let n=U[t];if(n===void 0){let e=dl.get(t);if(e!==void 0)n=U[e],F(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return ul(n)}var pl=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ml(e){return e.replace(pl,hl)}function hl(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function gl(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var _l={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function vl(e){return _l[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var yl={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function bl(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:yl[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var xl={302:`ENVMAP_MODE_REFRACTION`};function Sl(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:xl[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Cl={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function wl(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Cl[e.combine]||`ENVMAP_BLENDING_NONE`}function Tl(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function El(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=vl(n),l=bl(n),u=Sl(n),d=wl(n),f=Tl(n),p=rl(n),m=il(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(ol).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(ol).join(`
`),_.length>0&&(_+=`
`)):(g=[gl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(ol).join(`
`),_=[gl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:U.tonemapping_pars_fragment,n.toneMapping===0?``:el(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,U.colorspace_pars_fragment,Qc(`linearToOutputTexel`,n.outputColorSpace),nl(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(ol).join(`
`)),o=ul(o),o=sl(o,n),o=cl(o,n),s=ul(s),s=sl(s,n),s=cl(s,n),o=ml(o),s=ml(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Gc(i,i.VERTEX_SHADER,y),S=Gc(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1)if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Zc(i,x,`vertex`),n=Zc(i,S,`fragment`);I(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}else o===``?(s===``||c===``)&&(u=!1):F(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Wc(i,h),T=al(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Kc)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=qc++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Dl=0,Ol=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new kl(e),t.set(e,n)),n}},kl=class{constructor(e){this.id=Dl++,this.code=e,this.usedTimes=0}};function Al(e){return e===1030||e===37490||e===36285}function jl(e,t,n,r,i,a){let o=new Fn,s=new Ol,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&F(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,ee,k;if(C){let e=$o[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),ee=e.id,k=t.id}let te=e.getRenderTarget(),ne=e.state.buffers.depth.getReversed(),re=h.isInstancedMesh===!0,ie=h.isBatchedMesh===!0,A=!!i.map,ae=!!i.matcap,oe=!!x,se=!!i.aoMap,ce=!!i.lightMap,le=!!i.bumpMap&&i.wireframe===!1,ue=!!i.normalMap,de=!!i.displacementMap,fe=!!i.emissiveMap,pe=!!i.metalnessMap,me=!!i.roughnessMap,he=i.anisotropy>0,ge=i.clearcoat>0,_e=i.dispersion>0,ve=i.iridescence>0,ye=i.sheen>0,be=i.transmission>0,xe=he&&!!i.anisotropyMap,Se=ge&&!!i.clearcoatMap,Ce=ge&&!!i.clearcoatNormalMap,we=ge&&!!i.clearcoatRoughnessMap,Te=ve&&!!i.iridescenceMap,Ee=ve&&!!i.iridescenceThicknessMap,De=ye&&!!i.sheenColorMap,Oe=ye&&!!i.sheenRoughnessMap,ke=!!i.specularMap,Ae=!!i.specularColorMap,je=!!i.specularIntensityMap,Me=be&&!!i.transmissionMap,Ne=be&&!!i.thicknessMap,Pe=!!i.gradientMap,Fe=!!i.alphaMap,Ie=i.alphaTest>0,Le=!!i.alphaHash,j=!!i.extensions,Re=0;i.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Re=e.toneMapping);let ze={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:ee,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:ie,batchingColor:ie&&h._colorsTexture!==null,instancing:re,instancingColor:re&&h.instanceColor!==null,instancingMorph:re&&h.morphTexture!==null,outputColorSpace:te===null?e.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:V.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:A,matcap:ae,envMap:oe,envMapMode:oe&&x.mapping,envMapCubeUVHeight:S,aoMap:se,lightMap:ce,bumpMap:le,normalMap:ue,displacementMap:de,emissiveMap:fe,normalMapObjectSpace:ue&&i.normalMapType===1,normalMapTangentSpace:ue&&i.normalMapType===0,packedNormalMap:ue&&i.normalMapType===0&&Al(i.normalMap.format),metalnessMap:pe,roughnessMap:me,anisotropy:he,anisotropyMap:xe,clearcoat:ge,clearcoatMap:Se,clearcoatNormalMap:Ce,clearcoatRoughnessMap:we,dispersion:_e,iridescence:ve,iridescenceMap:Te,iridescenceThicknessMap:Ee,sheen:ye,sheenColorMap:De,sheenRoughnessMap:Oe,specularMap:ke,specularColorMap:Ae,specularIntensityMap:je,transmission:be,transmissionMap:Me,thicknessMap:Ne,gradientMap:Pe,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Fe,alphaTest:Ie,alphaHash:Le,combine:i.combine,mapUv:A&&m(i.map.channel),aoMapUv:se&&m(i.aoMap.channel),lightMapUv:ce&&m(i.lightMap.channel),bumpMapUv:le&&m(i.bumpMap.channel),normalMapUv:ue&&m(i.normalMap.channel),displacementMapUv:de&&m(i.displacementMap.channel),emissiveMapUv:fe&&m(i.emissiveMap.channel),metalnessMapUv:pe&&m(i.metalnessMap.channel),roughnessMapUv:me&&m(i.roughnessMap.channel),anisotropyMapUv:xe&&m(i.anisotropyMap.channel),clearcoatMapUv:Se&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:Ce&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:we&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Te&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:Ee&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:De&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Oe&&m(i.sheenRoughnessMap.channel),specularMapUv:ke&&m(i.specularMap.channel),specularColorMapUv:Ae&&m(i.specularColorMap.channel),specularIntensityMapUv:je&&m(i.specularIntensityMap.channel),transmissionMapUv:Me&&m(i.transmissionMap.channel),thicknessMapUv:Ne&&m(i.thicknessMap.channel),alphaMapUv:Fe&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(ue||he),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(A||Fe),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&ue===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ne,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Re,decodeVideoTexture:A&&i.map.isVideoTexture===!0&&V.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:fe&&i.emissiveMap.isVideoTexture===!0&&V.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:j&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(j&&i.extensions.multiDraw===!0||ie)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return ze.vertexUv1s=c.has(1),ze.vertexUv2s=c.has(2),ze.vertexUv3s=c.has(3),c.clear(),ze}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=$o[t];n=Pa.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new El(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Ml(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Nl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Pl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Fl(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||Nl),r.length>1&&r.sort(t||Pl),i.length>1&&i.sort(t||Pl),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Il(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Fl,e.set(t,[i])):n>=r.length?(i=new Fl,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Ll(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new z,color:new H};break;case`SpotLight`:n={position:new z,direction:new z,color:new H,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new z,color:new H,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new z,skyColor:new H,groundColor:new H};break;case`RectAreaLight`:n={color:new H,position:new z,halfWidth:new z,halfHeight:new z};break}return e[t.id]=n,n}}}function Rl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}var zl=0;function Bl(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Vl(e){let t=new Ll,n=Rl(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new z);let i=new z,a=new wn,o=new wn;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(Bl);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=W.LTC_FLOAT_1,r.rectAreaLTC2=W.LTC_FLOAT_2):(r.rectAreaLTC1=W.LTC_HALF_1,r.rectAreaLTC2=W.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=zl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function Hl(e){let t=new Vl(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Ul(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Hl(e),t.set(n,[a])):r>=i.length?(a=new Hl(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Wl=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gl=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Kl=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],ql=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],Jl=new wn,Yl=new z,Xl=new z;function Zl(e,t,n){let r=new la,i=new R,a=new R,o=new yn,s=new Ha,c=new Ua,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new La({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new R},radius:{value:4}},vertexShader:Wl,fragmentShader:Gl}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new ti;m.setAttribute(`position`,new Br(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new Ui(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(F(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){F(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){F(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new xn(i.x,i.y,{format:Se,type:le,minFilter:k,magFilter:k,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new ya(i.x,i.y,ce),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=ve,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=D,d.map.depthTexture.magFilter=D}else l.isPointLight?(d.map=new Os(i.x),d.map.depthTexture=new ba(i.x,se)):(d.map=new xn(i.x,i.y),d.map.depthTexture=new ya(i.x,i.y,se)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=ve,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=k,d.map.depthTexture.magFilter=k):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=D,d.map.depthTexture.magFilter=D);d.camera.updateProjectionMatrix()}let g=d.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<g;t++){if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Yl.setFromMatrixPosition(l.matrixWorld),e.position.copy(Yl),Xl.copy(e.position),Xl.add(Kl[t]),e.up.copy(ql[t]),e.lookAt(Xl),e.updateMatrixWorld(),n.makeTranslation(-Yl.x,-Yl.y,-Yl.z),Jl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Jl,e.coordinateSystem,e.reversedDepth)}else d.updateMatrices(l);r=d.getFrustum(),b(n,s,d.camera,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new xn(i.x,i.y,{format:Se,type:le})),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value=n.mapSize,f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Ql(e,t){function n(){let t=!1,n=new yn,r=null,i=new yn(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?pe(e.DEPTH_TEST):me(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Dt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?pe(e.STENCIL_TEST):me(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new H(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,te=null,ne=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),re=!1,ie=0,A=e.getParameter(e.VERSION);A.indexOf(`WebGL`)===-1?A.indexOf(`OpenGL ES`)!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(A)[1]),re=ie>=2):(ie=parseFloat(/^WebGL (\d)/.exec(A)[1]),re=ie>=1);let ae=null,oe={},se=e.getParameter(e.SCISSOR_BOX),ce=e.getParameter(e.VIEWPORT),le=new yn().fromArray(se),ue=new yn().fromArray(ce);function de(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let fe={};fe[e.TEXTURE_2D]=de(e.TEXTURE_2D,e.TEXTURE_2D,1),fe[e.TEXTURE_CUBE_MAP]=de(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),fe[e.TEXTURE_2D_ARRAY]=de(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),fe[e.TEXTURE_3D]=de(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),pe(e.DEPTH_TEST),o.setFunc(3),Se(!1),Ce(1),pe(e.CULL_FACE),be(0);function pe(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function me(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function he(t,n){return f[t]===n?!1:(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ge(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function _e(t){return h===t?!1:(e.useProgram(t),h=t,!0)}let ve={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ve[103]=e.MIN,ve[104]=e.MAX;let ye={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function be(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(me(e.BLEND),g=!1);return}if(g===!1&&(pe(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:I(`WebGLState: Invalid blending: `,t);break}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:I(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:I(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:I(`WebGLState: Invalid blending: `,t);break}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ve[n],ve[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(ye[r],ye[i],ye[o],ye[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function xe(t,n){t.side===2?me(e.CULL_FACE):pe(e.CULL_FACE);let r=t.side===1;n&&(r=!r),Se(r),t.blending===1&&t.transparent===!1?be(0):be(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Te(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?pe(e.SAMPLE_ALPHA_TO_COVERAGE):me(e.SAMPLE_ALPHA_TO_COVERAGE)}function Se(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function Ce(t){t===0?me(e.CULL_FACE):(pe(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function we(t){t!==ee&&(re&&e.lineWidth(t),ee=t)}function Te(t,n,r){t?(pe(e.POLYGON_OFFSET_FILL),(k!==n||te!==r)&&(k=n,te=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):me(e.POLYGON_OFFSET_FILL)}function Ee(t){t?pe(e.SCISSOR_TEST):me(e.SCISSOR_TEST)}function De(t){t===void 0&&(t=e.TEXTURE0+ne-1),ae!==t&&(e.activeTexture(t),ae=t)}function Oe(t,n,r){r===void 0&&(r=ae===null?e.TEXTURE0+ne-1:ae);let i=oe[r];i===void 0&&(i={type:void 0,texture:void 0},oe[r]=i),(i.type!==t||i.texture!==n)&&(ae!==r&&(e.activeTexture(r),ae=r),e.bindTexture(t,n||fe[t]),i.type=t,i.texture=n)}function ke(){let t=oe[ae];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ae(){try{e.compressedTexImage2D(...arguments)}catch(e){I(`WebGLState:`,e)}}function je(){try{e.compressedTexImage3D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Me(){try{e.texSubImage2D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Ne(){try{e.texSubImage3D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Pe(){try{e.compressedTexSubImage2D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Fe(){try{e.compressedTexSubImage3D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Ie(){try{e.texStorage2D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Le(){try{e.texStorage3D(...arguments)}catch(e){I(`WebGLState:`,e)}}function j(){try{e.texImage2D(...arguments)}catch(e){I(`WebGLState:`,e)}}function Re(){try{e.texImage3D(...arguments)}catch(e){I(`WebGLState:`,e)}}function ze(t){return d[t]===void 0?e.getParameter(t):d[t]}function Be(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function M(t){le.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),le.copy(t))}function Ve(t){ue.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ue.copy(t))}function N(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function P(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function He(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},ae=null,oe={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new H(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,te=null,le.set(0,0,e.canvas.width,e.canvas.height),ue.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:pe,disable:me,bindFramebuffer:he,drawBuffers:ge,useProgram:_e,setBlending:be,setMaterial:xe,setFlipSided:Se,setCullFace:Ce,setLineWidth:we,setPolygonOffset:Te,setScissorTest:Ee,activeTexture:De,bindTexture:Oe,unbindTexture:ke,compressedTexImage2D:Ae,compressedTexImage3D:je,texImage2D:j,texImage3D:Re,pixelStorei:Be,getParameter:ze,updateUBOMapping:N,uniformBlockBinding:P,texStorage2D:Ie,texStorage3D:Le,texSubImage2D:Me,texSubImage3D:Ne,compressedTexSubImage2D:Pe,compressedTexSubImage3D:Fe,scissor:M,viewport:Ve,reset:He}}function $l(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new R,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):bt(`canvas`)}function g(e,t,n){let r=1,i=ze(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1)if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),F(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}else return`data`in e&&F(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e;return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];F(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||F(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?pt:V.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,F(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),ie(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function re(e){let t=e.target;t.removeEventListener(`dispose`,re),ae(t)}function ie(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&A(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function A(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function ae(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let oe=0;function se(){oe=0}function ce(){return oe}function le(e){oe=e}function ue(){let e=oe;return e>=i.maxTextures&&F(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+i.maxTextures),oe+=1,e}function de(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function fe(t,i){let a=r.get(t);if(t.isVideoTexture&&j(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)F(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)F(`WebGLRenderer: Texture marked for update but image is incomplete`);else{we(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function pe(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){we(a,t,i);return}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function me(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){we(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function he(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){Te(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ge={[w]:e.REPEAT,[T]:e.CLAMP_TO_EDGE,[E]:e.MIRRORED_REPEAT},_e={[D]:e.NEAREST,[O]:e.NEAREST_MIPMAP_NEAREST,[ee]:e.NEAREST_MIPMAP_LINEAR,[k]:e.LINEAR,[te]:e.LINEAR_MIPMAP_NEAREST,[ne]:e.LINEAR_MIPMAP_LINEAR},ve={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function be(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&F(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ge[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ge[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ge[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,_e[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,_e[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,ve[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function xe(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=de(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&A(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function Se(e,t,n){return Math.floor(Math.floor(e/n)/t)}function Ce(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=Se(n.start,r.width,4),c=Se(t.start,r.width,4);n.start<=i+1&&a===c&&Se(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function we(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=xe(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=V.getPrimaries(V.workingColorSpace),r=o.colorSpace===``?null:V.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Re(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);be(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===ye,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture)if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&Ce(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data);else if(o.isCompressedTexture)if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023)if(r!==null)if(C){if(T)if(o.layerUpdates.size>0){let t=Yo(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}o.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0);else F(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`);else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data)}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?F(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}else if(o.isDataArrayTexture)if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T)if(o.layerUpdates.size>0){let i=Yo(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w)if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=ze(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=ze(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function Te(t,o,s){if(o.image.length!==6)return;let c=xe(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=V.getPrimaries(V.workingColorSpace),r=o.colorSpace===``?null:V.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Re(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);be(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?F(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=ze(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function Ee(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Le(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Ie(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function De(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Le(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ie(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ie(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);Le(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ie(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ie(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Oe(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),be(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else fe(i.depthTexture,0);let u=l.__webglTexture,d=Ie(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Le(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Le(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ke(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer)if(a)for(let e=0;e<6;e++)Oe(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?Oe(i.__webglFramebuffer[0],t,0):Oe(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),De(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),De(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ae(t,n,i){let a=r.get(t);n!==void 0&&Ee(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ke(t)}function je(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,re);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Le(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ie(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),De(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),be(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)Ee(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else Ee(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),be(c,a),Ee(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),be(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)Ee(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else Ee(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&ke(t)}function Me(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let Ne=[],Pe=[];function Fe(t){if(t.samples>0){if(Le(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Ne.length=0,Pe.length=0,Ne.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(Ne.push(l),Pe.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Pe)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ne))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ie(e){return Math.min(i.maxSamples,e.samples)}function Le(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function j(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Re(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(V.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&F(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):I(`WebGLTextures: Unsupported texture color space:`,n)),t}function ze(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ue,this.resetTextureUnits=se,this.getTextureUnits=ce,this.setTextureUnits=le,this.setTexture2D=fe,this.setTexture2DArray=pe,this.setTexture3D=me,this.setTextureCube=he,this.rebindTextures=Ae,this.setupRenderTarget=je,this.updateRenderTargetMipmap=Me,this.updateMultisampleRenderTarget=Fe,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=Le,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function eu(e,t){function n(n,r=``){let i,a=V.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===`srgb`)if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491)if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var tu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,nu=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ru=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new xa(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new La({vertexShader:tu,fragmentShader:nu,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ui(new Da(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},iu=class extends Ot{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new ru,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new R,C=null,w=new wo;w.viewport=new yn;let T=new wo;T.viewport=new yn;let E=[w,T],D=new Po,O=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new er,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new er,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new er,b[e]=t),t.getHandSpace()};function k(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function te(){r.removeEventListener(`select`,k),r.removeEventListener(`selectstart`,k),r.removeEventListener(`selectend`,k),r.removeEventListener(`squeeze`,k),r.removeEventListener(`squeezestart`,k),r.removeEventListener(`squeezeend`,k),r.removeEventListener(`end`,te),r.removeEventListener(`inputsourceschange`,ne);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}O=null,ee=null,h.reset();for(let e in g)delete g[e];e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,de.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&F(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&F(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,k),r.addEventListener(`selectstart`,k),r.addEventListener(`selectend`,k),r.addEventListener(`squeeze`,k),r.addEventListener(`squeezestart`,k),r.addEventListener(`squeezeend`,k),r.addEventListener(`end`,te),r.addEventListener(`inputsourceschange`,ne),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?ye:ve,a=_.stencil?fe:se);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new xn(d.textureWidth,d.textureHeight,{format:_e,type:re,depthTexture:new ya(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new xn(f.framebufferWidth,f.framebufferHeight,{format:_e,type:re,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),de.setContext(r),de.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function ne(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let ie=new z,A=new z;function ae(e,t,n){ie.setFromMatrixPosition(t.matrixWorld),A.setFromMatrixPosition(n.matrixWorld);let r=ie.distanceTo(A),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function oe(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),D.near=T.near=w.near=t,D.far=T.far=w.far=n,(O!==D.near||ee!==D.far)&&(r.updateRenderState({depthNear:D.near,depthFar:D.far}),O=D.near,ee=D.far),D.layers.mask=e.layers.mask|6,w.layers.mask=D.layers.mask&-5,T.layers.mask=D.layers.mask&-3;let i=e.parent,a=D.cameras;oe(D,i);for(let e=0;e<a.length;e++)oe(a[e],i);a.length===2?ae(D,w,T):D.projectionMatrix.copy(w.projectionMatrix),ce(e,D,i)};function ce(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Mt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(d===null&&f===null))return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(D)},this.getCameraTexture=function(e){return g[e]};let le=null;function ue(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==D.cameras.length&&(D.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=E[n];o===void 0&&(o=new wo,o.layers.enable(n),o.viewport=new yn,E[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(D.matrix.copy(o.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),i===!0&&D.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new xa,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}le&&le(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let de=new Zo;de.setAnimationLoop(ue),this.setAnimationLoop=function(e){le=e},this.dispose=function(){}}},au=new wn,ou=new B;ou.set(-1,0,0,0,1,0,0,0,1);function su(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Na(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(au.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(ou),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function cu(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return I(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return typeof i==`number`||typeof i==`boolean`?r[a]=i:ArrayBuffer.isView(i)?r[a]=i.slice():r[a]=i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?F(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):F(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var lu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),uu=null;function du(){return uu===null&&(uu=new Ki(lu,16,16,Se,le),uu.name=`DFG_LUT`,uu.minFilter=k,uu.magFilter=k,uu.wrapS=T,uu.wrapT=T,uu.generateMipmaps=!1,uu.needsUpdate=!0),uu}var fu=class{constructor(e={}){let{canvas:t=xt(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=re}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([we,Ce,xe]),g=new Set([re,se,ae,fe,ue,de]),_=new Uint32Array(4),v=new Int32Array(4),y=new z,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,ee=null,k=null;this._outputColorSpace=dt;let te=0,ie=0,A=null,oe=-1,ce=null,pe=new yn,me=new yn,he=null,ge=new H(0),_e=0,ve=t.width,ye=t.height,be=1,Se=null,Te=null,Ee=new yn(0,0,ve,ye),De=new yn(0,0,ve,ye),Oe=!1,ke=new la,Ae=!1,je=!1,Me=new wn,Ne=new z,Pe=new yn,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ie=!1;function Le(){return A===null?be:1}let j=n;function Re(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r185`),t.addEventListener(`webglcontextlost`,st,!1),t.addEventListener(`webglcontextrestored`,ct,!1),t.addEventListener(`webglcontextcreationerror`,lt,!1),j===null){let t=`webgl2`;if(j=Re(t,e),j===null)throw Re(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw I(`WebGLRenderer: `+e.message),e}let ze,Be,M,Ve,N,P,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt,nt,rt,it;function at(){ze=new As(j),ze.init(),nt=new eu(j,ze),Be=new os(j,ze,e,nt),M=new Ql(j,ze),Be.reversedDepthBuffer&&d&&M.buffers.depth.setReversed(!0),O=j.createFramebuffer(),ee=j.createFramebuffer(),k=j.createFramebuffer(),Ve=new Ns(j),N=new Ml,P=new $l(j,ze,M,N,Be,nt,Ve),He=new ks(T),Ue=new Qo(j),rt=new is(j,Ue),We=new js(j,Ue,Ve,rt),Ge=new Fs(j,We,Ue,rt,Ve),$e=new Ps(j,Be,P),Xe=new ss(N),Ke=new jl(T,He,ze,Be,rt,Xe),qe=new su(T,N),Je=new Il,Ye=new Ul(ze),Qe=new rs(T,He,M,Ge,p,s),Ze=new Zl(T,Ge,Be),it=new cu(j,Ve,Be,M),et=new as(j,ze,Ve),tt=new Ms(j,ze,Ve),Ve.programs=Ke.programs,T.capabilities=Be,T.extensions=ze,T.properties=N,T.renderLists=Je,T.shadowMap=Ze,T.state=M,T.info=Ve}at(),m!==1009&&(w=new Ls(m,t.width,t.height,o,r,i));let ot=new iu(T,j);this.xr=ot,this.getContext=function(){return j},this.getContextAttributes=function(){return j.getContextAttributes()},this.forceContextLoss=function(){let e=ze.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=ze.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return be},this.setPixelRatio=function(e){e!==void 0&&(be=e,this.setSize(ve,ye,!1))},this.getSize=function(e){return e.set(ve,ye)},this.setSize=function(e,n,r=!0){if(ot.isPresenting){F(`WebGLRenderer: Can't change size while VR device is presenting.`);return}ve=e,ye=n,t.width=Math.floor(e*be),t.height=Math.floor(n*be),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(ve*be,ye*be).floor()},this.setDrawingBufferSize=function(e,n,r){ve=e,ye=n,be=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009){I(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){F(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(pe)},this.getViewport=function(e){return e.copy(Ee)},this.setViewport=function(e,t,n,r){e.isVector4?Ee.set(e.x,e.y,e.z,e.w):Ee.set(e,t,n,r),M.viewport(pe.copy(Ee).multiplyScalar(be).round())},this.getScissor=function(e){return e.copy(De)},this.setScissor=function(e,t,n,r){e.isVector4?De.set(e.x,e.y,e.z,e.w):De.set(e,t,n,r),M.scissor(me.copy(De).multiplyScalar(be).round())},this.getScissorTest=function(){return Oe},this.setScissorTest=function(e){M.setScissorTest(Oe=e)},this.setOpaqueSort=function(e){Se=e},this.setTransparentSort=function(e){Te=e},this.getClearColor=function(e){return e.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor(...arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(A!==null){let t=A.texture.format;e=h.has(t)}if(e){let e=A.texture.type,t=g.has(e),n=Qe.getClearColor(),r=Qe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,j.clearBufferuiv(j.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,j.clearBufferiv(j.COLOR,0,v))}else r|=j.COLOR_BUFFER_BIT}t&&(r|=j.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=j.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&j.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,st,!1),t.removeEventListener(`webglcontextrestored`,ct,!1),t.removeEventListener(`webglcontextcreationerror`,lt,!1),Qe.dispose(),Je.dispose(),Ye.dispose(),N.dispose(),He.dispose(),Ge.dispose(),rt.dispose(),it.dispose(),Ke.dispose(),ot.dispose(),ot.removeEventListener(`sessionstart`,vt),ot.removeEventListener(`sessionend`,yt),bt.stop()};function st(e){e.preventDefault(),Ct(`WebGLRenderer: Context Lost.`),E=!0}function ct(){Ct(`WebGLRenderer: Context Restored.`),E=!1;let e=Ve.autoReset,t=Ze.enabled,n=Ze.autoUpdate,r=Ze.needsUpdate,i=Ze.type;at(),Ve.autoReset=e,Ze.enabled=t,Ze.autoUpdate=n,Ze.needsUpdate=r,Ze.type=i}function lt(e){I(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ut(e){let t=e.target;t.removeEventListener(`dispose`,ut),ft(t)}function ft(e){pt(e),N.remove(e)}function pt(e){let t=N.get(e).programs;t!==void 0&&(t.forEach(function(e){Ke.releaseProgram(e)}),e.isShaderMaterial&&Ke.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Fe);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Nt(e,t,n,r,i);M.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=We.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;rt.setup(i,r,s,n,c);let h,g=et;if(c!==null&&(h=Ue.get(c),g=tt,g.setIndex(h)),i.isMesh)r.wireframe===!0?(M.setLineWidth(r.wireframeLinewidth*Le()),g.setMode(j.LINES)):g.setMode(j.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),M.setLineWidth(e*Le()),i.isLineSegments?g.setMode(j.LINES):i.isLineLoop?g.setMode(j.LINE_LOOP):g.setMode(j.LINE_STRIP)}else i.isPoints?g.setMode(j.POINTS):i.isSprite&&g.setMode(j.TRIANGLES);if(i.isBatchedMesh)if(ze.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ue.get(c).bytesPerElement:1,o=N.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(j,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function mt(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,kt(e,t,n),e.side=0,e.needsUpdate=!0,kt(e,t,n),e.side=2):kt(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),x=Ye.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t)if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];mt(a,n,e),r.add(a)}else mt(t,n,e),r.add(t)}),x=C.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){N.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}ze.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let ht=null;function gt(e){ht&&ht(e)}function vt(){bt.stop()}function yt(){bt.start()}let bt=new Zo;bt.setAnimationLoop(gt),typeof self<`u`&&bt.setContext(self),this.setAnimationLoop=function(e){ht=e,ot.setAnimationLoop(e),e===null?bt.stop():bt.start()},ot.addEventListener(`sessionstart`,vt),ot.addEventListener(`sessionend`,yt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){I(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=ot.enabled===!0&&ot.isPresenting===!0,r=w!==null&&(A===null||n)&&w.begin(T,A);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ot.enabled===!0&&ot.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(ot.cameraAutoUpdate===!0&&ot.updateCamera(t),t=ot.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,A),x=Ye.get(e,C.length),x.init(t),x.state.textureUnits=P.getTextureUnits(),C.push(x),Me.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ke.setFromProjectionMatrix(Me,_t,t.reversedDepth),je=this.localClippingEnabled,Ae=Xe.init(this.clippingPlanes,je),b=Je.get(e,S.length),b.init(),S.push(b),ot.enabled===!0&&ot.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&St(e,t,-1/0,T.sortObjects)}St(e,t,0,T.sortObjects),b.finish(),T.sortObjects===!0&&b.sort(Se,Te,t.reversedDepth),Ie=ot.enabled===!1||ot.isPresenting===!1||ot.hasDepthSensing()===!1,Ie&&Qe.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ae===!0&&Xe.beginShadows();let i=x.state.shadowsArray;if(Ze.render(i,e,t),Ae===!0&&Xe.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Tt(n,r,e,a)}Ie&&Qe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];wt(b,e,n,n.viewport)}}else r.length>0&&Tt(n,r,e,t),Ie&&Qe.render(e),wt(b,e,t)}A!==null&&ie===0&&(P.updateMultisampleRenderTarget(A),P.updateRenderTargetMipmap(A)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),rt.resetDefaultState(),oe=-1,ce=null,C.pop(),C.length>0?(x=C[C.length-1],P.setTextureUnits(x.state.textureUnits),Ae===!0&&Xe.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function St(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||ke.intersectsSprite(e)){r&&Pe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Me);let t=Ge.update(e),i=e.material;i.visible&&b.push(e,t,i,n,Pe.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||ke.intersectsObject(e))){let t=Ge.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),Pe.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Pe.copy(e.boundingSphere.center)),Pe.applyMatrix4(e.matrixWorld).applyMatrix4(Me)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&b.push(e,t,s,n,Pe.z,o)}}else i.visible&&b.push(e,t,i,n,Pe.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)St(i[e],t,n,r)}function wt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),Ae===!0&&Xe.setGlobalState(T.clippingPlanes,n),r&&M.viewport(pe.copy(r)),i.length>0&&Dt(i,t,n),a.length>0&&Dt(a,t,n),o.length>0&&Dt(o,t,n),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function Tt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=ze.has(`EXT_color_buffer_half_float`)||ze.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new xn(1,1,{generateMipmaps:!0,type:e?le:re,minFilter:ne,samples:Math.max(4,Be.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:V.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||pe;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(ge),_e=T.getClearAlpha(),_e<1&&T.setClearColor(16777215,.5),T.clear(),Ie&&Qe.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),Ae===!0&&Xe.setGlobalState(T.clippingPlanes,r),Dt(e,n,r),P.updateMultisampleRenderTarget(a),P.updateRenderTargetMipmap(a),ze.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Ot(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(P.updateMultisampleRenderTarget(a),P.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(ge,_e),d!==void 0&&(r.viewport=d),T.toneMapping=u}function Dt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Ot(o,t,n,s,l,c)}}function Ot(e,t,n,r,i,a){e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function kt(e,t,n){t.isScene!==!0&&(t=Fe);let r=N.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Ke.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Ke.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=He.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ut),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return jt(e,s),d}else s.uniforms=Ke.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Ke.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Xe.uniform),jt(e,s),r.needsLights=Pt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function At(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Wc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function jt(e,t){let n=N.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Mt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function Nt(e,t,n,r,i){t.isScene!==!0&&(t=Fe),P.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=A===null?T.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:V.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=He.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=N.get(r),y=x.state.lights;if(Ae===!0&&(je===!0||e!==ce)){let t=e===ce&&r.id===oe;Xe.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Xe.numPlanes||v.numIntersection!==Xe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=kt(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),ee=v.uniforms;if(M.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==oe&&(oe=r.id,w=!0),v.needsLights){let e=Mt(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||ce!==e){M.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(j,`projectionMatrix`,e.projectionMatrix),O.setValue(j,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(j,Ne.setFromMatrixPosition(e.matrixWorld)),Be.logarithmicDepthBuffer&&O.setValue(j,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(j,`isOrthographic`,e.isOrthographicCamera===!0),ce!==e&&(ce=e,w=!0,E=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&O.setValue(j,`directionalShadowMap`,y.state.directionalShadowMap,P),y.state.spotShadowMap.length>0&&O.setValue(j,`spotShadowMap`,y.state.spotShadowMap,P),y.state.pointShadowMap.length>0&&O.setValue(j,`pointShadowMap`,y.state.pointShadowMap,P)),i.isSkinnedMesh){O.setOptional(j,i,`bindMatrix`),O.setOptional(j,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(j,`boneTexture`,e.boneTexture,P))}i.isBatchedMesh&&(O.setOptional(j,i,`batchingTexture`),O.setValue(j,`batchingTexture`,i._matricesTexture,P),O.setOptional(j,i,`batchingIdTexture`),O.setValue(j,`batchingIdTexture`,i._indirectTexture,P),O.setOptional(j,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(j,`batchingColorTexture`,i._colorsTexture,P));let k=n.morphAttributes;if((k.position!==void 0||k.normal!==void 0||k.color!==void 0)&&$e.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(j,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(ee.envMapIntensity.value=t.environmentIntensity),ee.dfgLUT!==void 0&&(ee.dfgLUT.value=du()),w){if(O.setValue(j,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&L(ee,E),a&&r.fog===!0&&qe.refreshFogUniforms(ee,a),qe.refreshMaterialUniforms(ee,r,be,ye,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;ee.probesSH.value=e.texture,ee.probesMin.value.copy(e.boundingBox.min),ee.probesMax.value.copy(e.boundingBox.max),ee.probesResolution.value.copy(e.resolution)}Wc.upload(j,At(v),ee,P)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Wc.upload(j,At(v),ee,P),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(j,`center`,i.center),O.setValue(j,`modelViewMatrix`,i.modelViewMatrix),O.setValue(j,`normalMatrix`,i.normalMatrix),O.setValue(j,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];it.update(n,S),it.bind(n,S)}}return S}function L(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Pt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return te},this.getActiveMipmapLevel=function(){return ie},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(e,t,n){let r=N.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),N.get(e.texture).__webglTexture=t,N.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=N.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){A=e,te=t,ie=n;let r=null,i=!1,a=!1;if(e){let o=N.get(e);if(o.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(j.FRAMEBUFFER,o.__webglFramebuffer),pe.copy(e.viewport),me.copy(e.scissor),he=e.scissorTest,M.viewport(pe),M.scissor(me),M.setScissorTest(he),oe=-1;return}else if(o.__webglFramebuffer===void 0)P.setupRenderTarget(e);else if(o.__hasExternalTextures)P.rebindTextures(e,N.get(e.texture).__webglTexture,N.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&N.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);P.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=N.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&P.useMultisampledRTT(e)===!1?N.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,pe.copy(e.viewport),me.copy(e.scissor),he=e.scissorTest}else pe.copy(Ee).multiplyScalar(be).floor(),me.copy(De).multiplyScalar(be).floor(),he=Oe;if(n!==0&&(r=O),M.bindFramebuffer(j.FRAMEBUFFER,r)&&M.drawBuffers(e,r),M.viewport(pe),M.scissor(me),M.setScissorTest(he),i){let r=N.get(e.texture);j.framebufferTexture2D(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=N.get(e.textures[t]);j.framebufferTextureLayer(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=N.get(e.texture);j.framebufferTexture2D(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,t.__webglTexture,n)}oe=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){I(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=N.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){M.bindFramebuffer(j.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&j.readBuffer(j.COLOR_ATTACHMENT0+s),!Be.textureFormatReadable(c)){I(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!Be.textureTypeReadable(l)){I(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&j.readPixels(t,n,r,i,nt.convert(c),nt.convert(l),a)}finally{let e=A===null?null:N.get(A).__webglFramebuffer;M.bindFramebuffer(j.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=N.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c)if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){M.bindFramebuffer(j.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&j.readBuffer(j.COLOR_ATTACHMENT0+s),!Be.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!Be.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=j.createBuffer();j.bindBuffer(j.PIXEL_PACK_BUFFER,d),j.bufferData(j.PIXEL_PACK_BUFFER,a.byteLength,j.STREAM_READ),j.readPixels(t,n,r,i,nt.convert(l),nt.convert(u),0);let f=A===null?null:N.get(A).__webglFramebuffer;M.bindFramebuffer(j.FRAMEBUFFER,f);let p=j.fenceSync(j.SYNC_GPU_COMMANDS_COMPLETE,0);return j.flush(),await Et(j,p,4),j.bindBuffer(j.PIXEL_PACK_BUFFER,d),j.getBufferSubData(j.PIXEL_PACK_BUFFER,0,a),j.deleteBuffer(d),j.deleteSync(p),a}else throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;P.setTexture2D(e,0),j.copyTexSubImage2D(j.TEXTURE_2D,n,0,0,o,s,i,a),M.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=nt.convert(t.format),_=nt.convert(t.type),v;t.isData3DTexture?(P.setTexture3D(t,0),v=j.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(P.setTexture2DArray(t,0),v=j.TEXTURE_2D_ARRAY):(P.setTexture2D(t,0),v=j.TEXTURE_2D),M.activeTexture(j.TEXTURE0),M.pixelStorei(j.UNPACK_FLIP_Y_WEBGL,t.flipY),M.pixelStorei(j.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),M.pixelStorei(j.UNPACK_ALIGNMENT,t.unpackAlignment);let y=M.getParameter(j.UNPACK_ROW_LENGTH),b=M.getParameter(j.UNPACK_IMAGE_HEIGHT),x=M.getParameter(j.UNPACK_SKIP_PIXELS),S=M.getParameter(j.UNPACK_SKIP_ROWS),C=M.getParameter(j.UNPACK_SKIP_IMAGES);M.pixelStorei(j.UNPACK_ROW_LENGTH,h.width),M.pixelStorei(j.UNPACK_IMAGE_HEIGHT,h.height),M.pixelStorei(j.UNPACK_SKIP_PIXELS,l),M.pixelStorei(j.UNPACK_SKIP_ROWS,u),M.pixelStorei(j.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=N.get(e),r=N.get(t),h=N.get(n.__renderTarget),g=N.get(r.__renderTarget);M.bindFramebuffer(j.READ_FRAMEBUFFER,h.__webglFramebuffer),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(j.framebufferTextureLayer(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,N.get(e).__webglTexture,i,d+n),j.framebufferTextureLayer(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,N.get(t).__webglTexture,a,m+n)),j.blitFramebuffer(l,u,o,s,f,p,o,s,j.DEPTH_BUFFER_BIT,j.NEAREST);M.bindFramebuffer(j.READ_FRAMEBUFFER,null),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||N.has(e)){let n=N.get(e),r=N.get(t);M.bindFramebuffer(j.READ_FRAMEBUFFER,ee),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,k);for(let e=0;e<c;e++)w?j.framebufferTextureLayer(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):j.framebufferTexture2D(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,n.__webglTexture,i),T?j.framebufferTextureLayer(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):j.framebufferTexture2D(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,r.__webglTexture,a),i===0?T?j.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):j.copyTexSubImage2D(v,a,f,p,l,u,o,s):j.blitFramebuffer(l,u,o,s,f,p,o,s,j.COLOR_BUFFER_BIT,j.NEAREST);M.bindFramebuffer(j.READ_FRAMEBUFFER,null),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?j.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?j.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):j.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?j.texSubImage2D(j.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?j.compressedTexSubImage2D(j.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):j.texSubImage2D(j.TEXTURE_2D,a,f,p,o,s,g,_,h);M.pixelStorei(j.UNPACK_ROW_LENGTH,y),M.pixelStorei(j.UNPACK_IMAGE_HEIGHT,b),M.pixelStorei(j.UNPACK_SKIP_PIXELS,x),M.pixelStorei(j.UNPACK_SKIP_ROWS,S),M.pixelStorei(j.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&j.generateMipmap(v),M.unbindTexture()},this.initRenderTarget=function(e){N.get(e).__webglFramebuffer===void 0&&P.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?P.setTextureCube(e,0):e.isData3DTexture?P.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?P.setTexture2DArray(e,0):P.setTexture2D(e,0),M.unbindTexture()},this.resetState=function(){te=0,ie=0,A=null,M.reset(),rt.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return _t}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=V._getDrawingBufferColorSpace(e),t.unpackColorSpace=V._getUnpackColorSpace()}},pu={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},mu=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},hu=new Do(-1,1,1,-1,0,1),gu=new class extends ti{constructor(){super(),this.setAttribute(`position`,new Ur([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new Ur([0,2,0,0,2,0],2))}},_u=class{constructor(e){this._mesh=new Ui(gu,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,hu)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},vu=class extends mu{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof La?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Pa.clone(e.uniforms),this.material=new La({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new _u(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},yu=class extends mu{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},bu=class extends mu{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},xu=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new R);this._width=n.width,this._height=n.height,t=new xn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:le}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new vu(pu),this.copyPass.material.blending=0,this.timer=new Fo}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}yu!==void 0&&(r instanceof yu?n=!0:r instanceof bu&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new R);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Su=class extends mu{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new H}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},Cu={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new H(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},wu=class e extends mu{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new R(256,256):new R(e.x,e.y),this.clearColor=new H(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new xn(i,a,{type:le}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new xn(i,a,{type:le});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new xn(i,a,{type:le});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=Cu;this.highPassUniforms=Pa.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new La({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new R(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new z(1,1,1),new z(1,1,1),new z(1,1,1),new z(1,1,1),new z(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Pa.clone(pu.uniforms),this.blendMaterial=new La({uniforms:this.copyUniforms,vertexShader:pu.vertexShader,fragmentShader:pu.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new H,this._oldClearAlpha=1,this._basic=new ji,this._fsQuad=new _u(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new R(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new La({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new R(.5,.5)},direction:{value:new R(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new La({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};wu.BlurDirectionX=new R(1,0),wu.BlurDirectionY=new R(0,1);var Tu={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Eu=class extends mu{constructor(){super(),this.isOutputPass=!0,this.uniforms=Pa.clone(Tu.uniforms),this.material=new Ra({name:Tu.name,uniforms:this.uniforms,vertexShader:Tu.vertexShader,fragmentShader:Tu.fragmentShader}),this._fsQuad=new _u(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},V.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Du={id:`duskblade`,name:`The Duskblade`,blurb:`Glass honed to a killing edge. Strikes, shatters, and turns broken facets into fuel — a versatile climber for any night.`,hue:225,art:`flare`,maxHp:72,energy:3,handSize:5,potionSlots:3,startDeck:[`strike`,`strike`,`strike`,`strike`,`defend`,`defend`,`defend`,`eclipseSlash`,`chisel`,`firstSpark`],startRelic:`emberHeart`,startGold:99},Ou=[{name:`The Ashen Woods`,boss:`rootheart`,bossName:`The Rootheart`,theme:{sky:791568,fog:1254426,particles:16752717,glow:6750110,accent:`#7ddb8f`,ember:`#ff9a4d`}},{name:`The Sunken City`,boss:`leviathan`,bossName:`Leviathan's Maw`,theme:{sky:529440,fog:860723,particles:5499135,glow:3127551,accent:`#5fd6e8`,ember:`#53e8ff`}},{name:`The Obsidian Spire`,boss:`sovereign`,bossName:`The Eternal Sovereign`,theme:{sky:1182238,fog:1970736,particles:12745727,glow:16732120,accent:`#c99aff`,ember:`#ff6fe0`}}],ku={strike:{name:`Edge`,type:`attack`,rarity:`starter`,cost:1,target:`enemy`,vfx:`slash`,text:`Deal @6@ damage.`,effects:[{kind:`dmg`,n:6}],up:{text:`Deal @9@ damage.`,effects:[{kind:`dmg`,n:9}]}},defend:{name:`Ward`,type:`skill`,rarity:`starter`,cost:1,target:`self`,vfx:`ward`,text:`Gain #5# Ward.`,effects:[{kind:`block`,n:5}],up:{text:`Gain #8# Ward.`,effects:[{kind:`block`,n:8}]}},eclipseSlash:{name:`Eclipse Slash`,type:`attack`,rarity:`starter`,cost:1,target:`enemy`,vfx:`slash`,text:`Deal @7@ damage. Apply 1 Cracked.`,effects:[{kind:`dmg`,n:7},{kind:`status`,who:`target`,id:`vulnerable`,n:1}],up:{text:`Deal @9@ damage. Apply 2 Cracked.`,effects:[{kind:`dmg`,n:9},{kind:`status`,who:`target`,id:`vulnerable`,n:2}]}},chisel:{name:`Chisel`,type:`attack`,rarity:`starter`,cost:1,target:`enemy`,chip:1,vfx:`pierce`,text:`Deal @4@ damage. Chip 1 extra Facet.`,effects:[{kind:`dmg`,n:4}],up:{text:`Deal @7@ damage. Chip 1 extra Facet.`,effects:[{kind:`dmg`,n:7}]}},firstSpark:{name:`First Spark`,type:`skill`,rarity:`starter`,cost:0,target:`self`,vfx:`fire`,text:`Draw 1 card. Kindle.`,exhaust:!0,effects:[{kind:`draw`,n:1}],up:{text:`Draw 2 cards. Kindle.`,effects:[{kind:`draw`,n:2}]}},ashBite:{name:`Ashbite`,type:`attack`,rarity:`starter`,cost:1,target:`enemy`,vfx:`fire`,text:`Deal @5@ damage. Apply 2 Smolder.`,effects:[{kind:`dmg`,n:5},{kind:`status`,who:`target`,id:`poison`,n:2}],up:{text:`Deal @7@ damage. Apply 3 Smolder.`,effects:[{kind:`dmg`,n:7},{kind:`status`,who:`target`,id:`poison`,n:3}]}},smother:{name:`Smother`,type:`skill`,rarity:`starter`,cost:1,target:`enemy`,vfx:`fire`,text:`Gain #5# Ward. Apply 2 Smolder.`,effects:[{kind:`block`,n:5},{kind:`status`,who:`target`,id:`poison`,n:2}],up:{text:`Gain #8# Ward. Apply 3 Smolder.`,effects:[{kind:`block`,n:8},{kind:`status`,who:`target`,id:`poison`,n:3}]}},twinFangs:{name:`Twin Shards`,type:`attack`,rarity:`common`,cost:1,target:`enemy`,vfx:`pierce`,text:`Deal @4@ damage twice.`,effects:[{kind:`dmg`,n:4,times:2}],up:{text:`Deal @6@ damage twice.`,effects:[{kind:`dmg`,n:6,times:2}]}},quickSlash:{name:`Flicker`,type:`attack`,rarity:`common`,cost:0,target:`enemy`,vfx:`slash`,text:`Deal @4@ damage. Draw 1 card.`,effects:[{kind:`dmg`,n:4},{kind:`draw`,n:1}],up:{text:`Deal @6@ damage. Draw 1 card.`,effects:[{kind:`dmg`,n:6},{kind:`draw`,n:1}]}},heavyBlow:{name:`Quarry Maul`,type:`attack`,rarity:`common`,cost:2,target:`enemy`,chip:1,vfx:`blunt`,text:`Deal @12@ damage. Chip 1 extra Facet.`,effects:[{kind:`dmg`,n:12}],up:{text:`Deal @16@ damage. Chip 2 extra Facets.`,chip:2,effects:[{kind:`dmg`,n:16}]}},cleave:{name:`Fan of Glass`,type:`attack`,rarity:`common`,cost:1,target:`allEnemies`,vfx:`slash`,text:`Deal @6@ damage to ALL enemies.`,effects:[{kind:`dmg`,n:6}],up:{text:`Deal @9@ damage to ALL enemies.`,effects:[{kind:`dmg`,n:9}]}},venomStrike:{name:`Emberbite`,type:`attack`,rarity:`common`,cost:1,target:`enemy`,vfx:`fire`,text:`Deal @4@ damage. Apply 3 Smolder.`,effects:[{kind:`dmg`,n:4},{kind:`status`,who:`target`,id:`poison`,n:3}],up:{text:`Deal @6@ damage. Apply 4 Smolder.`,effects:[{kind:`dmg`,n:6},{kind:`status`,who:`target`,id:`poison`,n:4}]}},lunge:{name:`Dimming Cut`,type:`attack`,rarity:`common`,cost:1,target:`enemy`,vfx:`slash`,text:`Deal @6@ damage. Apply 1 Dimmed.`,effects:[{kind:`dmg`,n:6},{kind:`status`,who:`target`,id:`weak`,n:1}],up:{text:`Deal @9@ damage. Apply 2 Dimmed.`,effects:[{kind:`dmg`,n:9},{kind:`status`,who:`target`,id:`weak`,n:2}]}},guardedStrike:{name:`Warden's Edge`,type:`attack`,rarity:`common`,cost:1,target:`enemy`,vfx:`slash`,text:`Deal @5@ damage. Gain #4# Ward.`,effects:[{kind:`dmg`,n:5},{kind:`block`,n:4}],up:{text:`Deal @7@ damage. Gain #6# Ward.`,effects:[{kind:`dmg`,n:7},{kind:`block`,n:6}]}},brace:{name:`Held Light`,type:`skill`,rarity:`common`,cost:1,target:`self`,vfx:`ward`,text:`Gain #8# Ward.`,effects:[{kind:`block`,n:8}],up:{text:`Gain #11# Ward.`,effects:[{kind:`block`,n:11}]}},sidestep:{name:`Glasstep`,type:`skill`,rarity:`common`,cost:0,target:`self`,vfx:`ward`,text:`Gain #3# Ward. Draw 1 card.`,effects:[{kind:`block`,n:3},{kind:`draw`,n:1}],up:{text:`Gain #5# Ward. Draw 1 card.`,effects:[{kind:`block`,n:5},{kind:`draw`,n:1}]}},preparation:{name:`Tinder`,type:`skill`,rarity:`common`,cost:0,target:`self`,vfx:`fire`,text:`Draw 2 cards. Kindle.`,exhaust:!0,effects:[{kind:`draw`,n:2}],up:{text:`Draw 2 cards.`,exhaust:!1,effects:[{kind:`draw`,n:2}]}},deflect:{name:`Refract`,type:`skill`,rarity:`common`,cost:1,target:`self`,vfx:`ward`,text:`Gain #6# Ward. Draw 1 card.`,effects:[{kind:`block`,n:6},{kind:`draw`,n:1}],up:{text:`Gain #9# Ward. Draw 1 card.`,effects:[{kind:`block`,n:9},{kind:`draw`,n:1}]}},leechBlade:{name:`Thirsting Shard`,type:`attack`,rarity:`uncommon`,cost:2,target:`enemy`,vfx:`void`,text:`Deal @9@ damage. Heal for half the unblocked damage.`,effects:[{kind:`special`,id:`leech`,n:9}],up:{text:`Deal @13@ damage. Heal for half the unblocked damage.`,effects:[{kind:`special`,id:`leech`,n:13}]}},tempest:{name:`Hailglass`,type:`attack`,rarity:`uncommon`,cost:2,target:`allEnemies`,vfx:`pierce`,text:`Deal @4@ damage to ALL enemies twice.`,effects:[{kind:`dmg`,n:4,times:2}],up:{text:`Deal @6@ damage to ALL enemies twice.`,effects:[{kind:`dmg`,n:6,times:2}]}},uppercut:{name:`Ringing Blow`,type:`attack`,rarity:`uncommon`,cost:2,target:`enemy`,chip:1,vfx:`blunt`,text:`Deal @10@ damage. Chip 1 extra Facet. Apply 1 Dimmed.`,effects:[{kind:`dmg`,n:10},{kind:`status`,who:`target`,id:`weak`,n:1}],up:{text:`Deal @13@ damage. Chip 2 extra Facets. Apply 2 Dimmed.`,chip:2,effects:[{kind:`dmg`,n:13},{kind:`status`,who:`target`,id:`weak`,n:2}]}},flurry:{name:`Splinterstorm`,type:`attack`,rarity:`uncommon`,cost:1,target:`enemy`,vfx:`pierce`,text:`Deal @2@ damage 3 times.`,effects:[{kind:`dmg`,n:2,times:3}],up:{text:`Deal @3@ damage 3 times.`,effects:[{kind:`dmg`,n:3,times:3}]}},executioner:{name:`Faultline`,type:`attack`,rarity:`uncommon`,cost:1,target:`enemy`,vfx:`blunt`,text:`Deal @8@ damage. Cracked enemies take 6 more.`,effects:[{kind:`special`,id:`execute`,n:8,bonus:6}],up:{text:`Deal @11@ damage. Cracked enemies take 8 more.`,effects:[{kind:`special`,id:`execute`,n:11,bonus:8}]}},momentum:{name:`Honing Edge`,type:`attack`,rarity:`uncommon`,cost:1,target:`enemy`,vfx:`slash`,text:`Deal @6@ damage. Each play, this card gains +4 damage this combat.`,effects:[{kind:`special`,id:`momentum`,n:6,grow:4}],up:{text:`Deal @8@ damage. Each play, this card gains +6 damage this combat.`,effects:[{kind:`special`,id:`momentum`,n:8,grow:6}]}},bulwark:{name:`Glasswall`,type:`skill`,rarity:`uncommon`,cost:2,target:`self`,vfx:`ward`,text:`Gain #13# Ward.`,effects:[{kind:`block`,n:13}],up:{text:`Gain #18# Ward.`,effects:[{kind:`block`,n:18}]}},surge:{name:`Struck Match`,type:`skill`,rarity:`uncommon`,cost:0,target:`self`,vfx:`fire`,text:`Gain 1 Energy. Draw 1 card. Kindle.`,exhaust:!0,effects:[{kind:`energy`,n:1},{kind:`draw`,n:1}],up:{text:`Gain 2 Energy. Draw 1 card. Kindle.`,effects:[{kind:`energy`,n:2},{kind:`draw`,n:1}]}},toxicMist:{name:`Ashcloud`,type:`skill`,rarity:`uncommon`,cost:1,target:`allEnemies`,vfx:`poison`,text:`Apply 3 Smolder to ALL enemies.`,effects:[{kind:`status`,who:`allEnemies`,id:`poison`,n:3}],up:{text:`Apply 5 Smolder to ALL enemies.`,effects:[{kind:`status`,who:`allEnemies`,id:`poison`,n:5}]}},cripple:{name:`Gutter`,type:`skill`,rarity:`uncommon`,cost:1,target:`enemy`,vfx:`void`,text:`Snuff an enemy's fire: it loses 2 Fervor. Kindle.`,exhaust:!0,effects:[{kind:`status`,who:`target`,id:`str`,n:-2}],up:{text:`Snuff an enemy's fire: it loses 3 Fervor. Kindle.`,effects:[{kind:`status`,who:`target`,id:`str`,n:-3}]}},warCry:{name:`Shatterhymn`,type:`skill`,rarity:`uncommon`,cost:1,target:`allEnemies`,vfx:`void`,text:`Apply 1 Dimmed and 1 Cracked to ALL enemies.`,effects:[{kind:`status`,who:`allEnemies`,id:`weak`,n:1},{kind:`status`,who:`allEnemies`,id:`vulnerable`,n:1}],up:{text:`Apply 2 Dimmed and 2 Cracked to ALL enemies.`,effects:[{kind:`status`,who:`allEnemies`,id:`weak`,n:2},{kind:`status`,who:`allEnemies`,id:`vulnerable`,n:2}]}},fortify:{name:`Mirrorlight`,type:`skill`,rarity:`uncommon`,cost:2,target:`self`,vfx:`ward`,text:`Double your Ward.`,effects:[{kind:`special`,id:`doubleBlock`}],up:{cost:1,text:`Double your Ward.`}},bloodRite:{name:`Blood for Oil`,type:`skill`,rarity:`uncommon`,cost:0,target:`self`,vfx:`void`,text:`Lose 3 HP. Gain 2 Energy.`,effects:[{kind:`loseHp`,n:3},{kind:`energy`,n:2}],up:{text:`Lose 3 HP. Gain 3 Energy.`,effects:[{kind:`loseHp`,n:3},{kind:`energy`,n:3}]}},empower:{name:`Inner Blaze`,type:`power`,rarity:`uncommon`,cost:1,target:`self`,vfx:`fire`,text:`Gain 2 Fervor.`,effects:[{kind:`status`,who:`self`,id:`str`,n:2}],up:{text:`Gain 3 Fervor.`,effects:[{kind:`status`,who:`self`,id:`str`,n:3}]}},agility:{name:`Glazier's Poise`,type:`power`,rarity:`uncommon`,cost:1,target:`self`,vfx:`ward`,text:`Gain 2 Poise.`,effects:[{kind:`status`,who:`self`,id:`dex`,n:2}],up:{text:`Gain 3 Poise.`,effects:[{kind:`status`,who:`self`,id:`dex`,n:3}]}},ironSkin:{name:`Vitrify`,type:`power`,rarity:`uncommon`,cost:1,target:`self`,vfx:`ward`,text:`At the end of your turn, gain 3 Ward.`,effects:[{kind:`status`,who:`self`,id:`metallicize`,n:3}],up:{text:`At the end of your turn, gain 4 Ward.`,effects:[{kind:`status`,who:`self`,id:`metallicize`,n:4}]}},regrowth:{name:`Hearthglow`,type:`power`,rarity:`uncommon`,cost:1,target:`self`,vfx:`fire`,text:`At the end of your turn, heal 2 HP.`,effects:[{kind:`status`,who:`self`,id:`regen`,n:2}],up:{text:`At the end of your turn, heal 3 HP.`,effects:[{kind:`status`,who:`self`,id:`regen`,n:3}]}},oblivionStrike:{name:`Bellstrike`,type:`attack`,rarity:`rare`,cost:3,target:`enemy`,chip:2,vfx:`blunt`,text:`Deal @30@ damage. Chip 2 extra Facets.`,effects:[{kind:`dmg`,n:30}],up:{text:`Deal @40@ damage. Chip 3 extra Facets.`,chip:3,effects:[{kind:`dmg`,n:40}]}},phantomBlades:{name:`Phantom Blades`,type:`attack`,rarity:`rare`,cost:1,target:`enemy`,vfx:`pierce`,text:`Deal @3@ damage for each card in your hand.`,effects:[{kind:`special`,id:`phantom`,n:3}],up:{text:`Deal @4@ damage for each card in your hand.`,effects:[{kind:`special`,id:`phantom`,n:4}]}},devour:{name:`Eat the Flame`,type:`attack`,rarity:`rare`,cost:1,target:`enemy`,vfx:`void`,text:`Deal @10@ damage. If this kills, swallow its fire: gain 3 Embers and heal 4. Kindle.`,exhaust:!0,effects:[{kind:`special`,id:`devour`,n:10,embers:3,heal:4}],up:{text:`Deal @13@ damage. If this kills, swallow its fire: gain 4 Embers and heal 6. Kindle.`,effects:[{kind:`special`,id:`devour`,n:13,embers:4,heal:6}]}},annihilate:{name:`Requiem`,type:`attack`,rarity:`rare`,cost:2,target:`allEnemies`,vfx:`fire`,text:`Deal @9@ damage and apply 3 Smolder to ALL enemies.`,effects:[{kind:`dmg`,n:9},{kind:`status`,who:`allEnemies`,id:`poison`,n:3}],up:{text:`Deal @12@ damage and apply 4 Smolder to ALL enemies.`,effects:[{kind:`dmg`,n:12},{kind:`status`,who:`allEnemies`,id:`poison`,n:4}]}},aegis:{name:`Cathedral Glass`,type:`skill`,rarity:`rare`,cost:2,target:`self`,vfx:`ward`,text:`Gain #30# Ward. Kindle.`,exhaust:!0,effects:[{kind:`block`,n:30}],up:{text:`Gain #40# Ward. Kindle.`,effects:[{kind:`block`,n:40}]}},offering:{name:`Pyre Tithe`,type:`skill`,rarity:`rare`,cost:1,target:`self`,vfx:`fire`,text:`Burn every other card in your hand — each feeds the lantern. Draw 3 cards. Kindle.`,exhaust:!0,effects:[{kind:`special`,id:`pyreTithe`,draw:3}],up:{text:`Burn every other card in your hand — each feeds the lantern. Draw 4 cards. Kindle.`,effects:[{kind:`special`,id:`pyreTithe`,draw:4}]}},limitBreak:{name:`Annealing Rite`,type:`skill`,rarity:`rare`,cost:1,target:`allEnemies`,vfx:`blunt`,text:`Chip 2 Facets of every enemy. Kindle.`,exhaust:!0,effects:[{kind:`chip`,n:2}],up:{text:`Chip 3 Facets of every enemy. Kindle.`,effects:[{kind:`chip`,n:3}]}},catalyst:{name:`Bellows`,type:`skill`,rarity:`rare`,cost:1,target:`enemy`,vfx:`poison`,text:`Double an enemy's Smolder. Kindle.`,exhaust:!0,effects:[{kind:`special`,id:`catalyst`,n:2}],up:{text:`Triple an enemy's Smolder. Kindle.`,effects:[{kind:`special`,id:`catalyst`,n:3}]}},ascension:{name:`Rising Litany`,type:`power`,rarity:`rare`,cost:3,target:`self`,vfx:`fire`,text:`At the start of each turn, gain 2 Fervor.`,effects:[{kind:`status`,who:`self`,id:`ritual`,n:2}],up:{text:`At the start of each turn, gain 3 Fervor.`,effects:[{kind:`status`,who:`self`,id:`ritual`,n:3}]}},bastion:{name:`Anneal`,type:`power`,rarity:`rare`,cost:3,target:`self`,vfx:`ward`,text:`Ward no longer expires at the start of your turn.`,effects:[{kind:`status`,who:`self`,id:`barricade`,n:1}],up:{cost:2}},frenzy:{name:`Overglow`,type:`power`,rarity:`rare`,cost:2,target:`self`,vfx:`fire`,text:`Your glass runs too hot: gain 2 Cracked. At the start of each turn, gain 1 Energy.`,effects:[{kind:`status`,who:`self`,id:`vulnerable`,n:2},{kind:`status`,who:`self`,id:`energized`,n:1}],up:{text:`Your glass runs too hot: gain 1 Cracked. At the start of each turn, gain 1 Energy.`,effects:[{kind:`status`,who:`self`,id:`vulnerable`,n:1},{kind:`status`,who:`self`,id:`energized`,n:1}]}},virulence:{name:`Emberfang`,type:`power`,rarity:`rare`,cost:2,target:`self`,vfx:`poison`,text:`Whenever you play an Attack, apply 1 Smolder to the enemy.`,effects:[{kind:`status`,who:`self`,id:`venomous`,n:1}],up:{cost:1}},quakeblow:{name:`Quakeblow`,type:`attack`,rarity:`uncommon`,cost:2,target:`enemy`,chip:2,locked:`paneBreaker`,vfx:`blunt`,text:`Deal @8@ damage. Chip 2 extra Facets.`,effects:[{kind:`dmg`,n:8}],up:{text:`Deal @11@ damage. Chip 3 extra Facets.`,chip:3,effects:[{kind:`dmg`,n:11}]}},resonantLance:{name:`Resonant Lance`,type:`attack`,rarity:`rare`,cost:1,target:`enemy`,locked:`paneBreaker`,vfx:`pierce`,text:`Deal @7@ damage. Deals double to Staggered or Cracked glass.`,effects:[{kind:`special`,id:`shatterEcho`,n:7}],up:{text:`Deal @10@ damage. Deals double to Staggered or Cracked glass.`,effects:[{kind:`special`,id:`shatterEcho`,n:10}]}},tithe:{name:`Tithe of Panes`,type:`skill`,rarity:`uncommon`,cost:1,target:`self`,locked:`lanternFed`,vfx:`fire`,text:`Gain 2 Embers. Draw 1 card.`,effects:[{kind:`ember`,n:2},{kind:`draw`,n:1}],up:{text:`Gain 3 Embers. Draw 1 card.`,effects:[{kind:`ember`,n:3},{kind:`draw`,n:1}]}},pyreheart:{name:`Pyreheart`,type:`power`,rarity:`rare`,cost:2,target:`self`,locked:`lanternFed`,vfx:`fire`,text:`At the start of each turn, gain 1 Ember.`,effects:[{kind:`status`,who:`self`,id:`emberflow`,n:1}],up:{cost:1}},ashenChoir:{name:`Ashen Choir`,type:`skill`,rarity:`uncommon`,cost:1,target:`enemy`,locked:`ashSermon`,vfx:`poison`,text:`Apply 4 Smolder. When smoldering glass dies, its fire leaps on.`,effects:[{kind:`status`,who:`target`,id:`poison`,n:4}],up:{text:`Apply 6 Smolder. When smoldering glass dies, its fire leaps on.`,effects:[{kind:`status`,who:`target`,id:`poison`,n:6}]}},flawlessForm:{name:`Flawless Form`,type:`skill`,rarity:`rare`,cost:1,target:`self`,locked:`untouched`,vfx:`ward`,text:`Gain #8# Ward. If your glass is untouched this combat, gain #8# more.`,effects:[{kind:`special`,id:`flawless`,n:8}],up:{text:`Gain #11# Ward. If your glass is untouched this combat, gain #11# more.`,effects:[{kind:`special`,id:`flawless`,n:11}]}},nightSight:{name:`Night Sight`,type:`power`,rarity:`uncommon`,cost:1,target:`self`,locked:`darkWalker`,vfx:`void`,text:`At the start of each turn, draw 1 extra card.`,effects:[{kind:`status`,who:`self`,id:`nightsight`,n:1}],up:{cost:0}},novaflare:{name:`Novaflare`,type:`attack`,rarity:`rare`,cost:2,target:`enemy`,locked:`spendthrift`,vfx:`fire`,text:`Deal @3@ damage for every Ember in your lantern.`,effects:[{kind:`special`,id:`emberNova`,n:3}],up:{text:`Deal @4@ damage for every Ember in your lantern.`,effects:[{kind:`special`,id:`emberNova`,n:4}]}},emberdance:{name:`Emberdance`,type:`skill`,rarity:`uncommon`,cost:0,target:`self`,locked:`spendthrift`,vfx:`fire`,text:`Spill your lantern: gain 3 Ward for each Ember spent. Kindle.`,exhaust:!0,effects:[{kind:`special`,id:`emberdance`,n:3}],up:{text:`Spill your lantern: gain 4 Ward for each Ember spent. Kindle.`,effects:[{kind:`special`,id:`emberdance`,n:4}]}},shardstorm:{name:`Shardstorm`,type:`attack`,rarity:`rare`,cost:3,target:`allEnemies`,vfx:`pierce`,locked:`hundredShards`,text:`Deal @5@ damage to ALL enemies twice.`,effects:[{kind:`dmg`,n:5,times:2}],up:{text:`Deal @7@ damage to ALL enemies twice.`,effects:[{kind:`dmg`,n:7,times:2}]}},wound:{name:`Shard`,type:`status`,rarity:`special`,cost:null,target:`none`,vfx:`pierce`,text:`Unplayable. Broken glass rattling in your deck.`,unplayable:!0,effects:[]},burn:{name:`Cinder`,type:`status`,rarity:`special`,cost:null,target:`none`,vfx:`fire`,text:`Unplayable. At the end of your turn, take 2 damage if this is in your hand.`,unplayable:!0,endTurnDmg:2,effects:[]},hex:{name:`Hex`,type:`curse`,rarity:`special`,cost:null,target:`none`,vfx:`void`,text:`Unplayable. At the end of your turn, lose 1 HP if this is in your hand. Refuses the fire.`,unplayable:!0,endTurnLoseHp:1,effects:[]}},Au=(()=>{let e={common:[],uncommon:[],rare:[]};for(let[t,n]of Object.entries(ku))e[n.rarity]&&!n.locked&&e[n.rarity].push(t);return e})(),ju={str:{name:`Fervor`,icon:`⚔`,kind:`buff`,desc:`The inner fire stoked: attacks deal +N damage.`},dex:{name:`Poise`,icon:`🛡`,kind:`buff`,desc:`Ward cards grant +N Ward.`},vulnerable:{name:`Cracked`,icon:`◎`,kind:`debuff`,desc:`The glass is scored: takes 50% more attack damage. Wears off each turn.`},weak:{name:`Dimmed`,icon:`↓`,kind:`debuff`,desc:`The fire gutters: deals 25% less attack damage. Wears off each turn.`},frail:{name:`Brittle`,icon:`✖`,kind:`debuff`,desc:`Ward gained reduced 25%. Wears off each turn.`},poison:{name:`Smolder`,icon:`☠`,kind:`debuff`,desc:`Burns from within: loses N HP at the start of its turn, then Smolder falls by 1. When smoldering glass shatters or dies, the Smolder leaps to another enemy.`},thorns:{name:`Splinters`,icon:`❈`,kind:`buff`,desc:`Attackers take N damage back.`},ritual:{name:`Litany`,icon:`☽`,kind:`buff`,desc:`Gains N Fervor at the start of each turn.`},metallicize:{name:`Vitrified`,icon:`⬡`,kind:`buff`,desc:`Gains N Ward at the end of each turn.`},regen:{name:`Warmth`,icon:`❋`,kind:`buff`,desc:`Heals N HP at the end of each turn.`},barricade:{name:`Annealed`,icon:`☗`,kind:`buff`,desc:`Ward no longer expires.`},energized:{name:`Alight`,icon:`✦`,kind:`buff`,desc:`Gain N extra Energy at the start of each turn.`},venomous:{name:`Emberfang`,icon:`☠`,kind:`buff`,desc:`Attacks apply N Smolder.`},rampage:{name:`Crescendo`,icon:`⤴`,kind:`buff`,desc:`Attack grows stronger with each use.`},beacon:{name:`Beacon`,icon:`☀`,kind:`buff`,desc:`Attacks chip N extra Facet(s). Fades at end of turn.`},emberflow:{name:`Pyreheart`,icon:`♥`,kind:`buff`,desc:`Gain N Ember(s) at the start of each turn.`},nightsight:{name:`Night Sight`,icon:`☾`,kind:`buff`,desc:`Draw N extra card(s) at the start of each turn.`}},Mu={emberHeart:{name:`Emberheart`,rarity:`starter`,glyph:`♥`,tone:`#ff5964`,text:`At the end of combat, heal 6 HP.`},ashenCore:{name:`Ashen Core`,rarity:`starter`,glyph:`☁`,tone:`#d3a15a`,text:`Enemies begin each combat with 3 Smolder.`},basaltIdol:{name:`Basalt Idol`,rarity:`common`,glyph:`☗`,tone:`#9aa7b8`,text:`Begin each combat with 10 Ward.`},warFetish:{name:`War Fetish`,rarity:`common`,glyph:`⚔`,tone:`#ff8c5a`,text:`Begin each combat with 1 Fervor.`},riverPearl:{name:`River Pearl`,rarity:`common`,glyph:`◉`,tone:`#6fd6e8`,text:`Begin each combat with 1 Poise.`},travelersPack:{name:`Traveler's Pack`,rarity:`common`,glyph:`⌘`,tone:`#c9a86a`,text:`Draw 2 extra cards on your first turn.`},emberLantern:{name:`Ember Lantern`,rarity:`common`,glyph:`☀`,tone:`#ffd166`,text:`Gain 1 extra Energy on your first turn.`},vialOfLife:{name:`Vial of Life`,rarity:`common`,glyph:`♣`,tone:`#7ddb8f`,text:`Heal 2 HP at the start of each combat.`},thornBand:{name:`Thorn Band`,rarity:`common`,glyph:`❈`,tone:`#a3e06c`,text:`Begin each combat with 2 Splinters.`},sweetRoot:{name:`Sweet Root`,rarity:`common`,glyph:`✿`,tone:`#ff9ecb`,text:`On pickup: gain 8 Max HP.`,instant:!0},gravebloom:{name:`Gravebloom`,rarity:`uncommon`,glyph:`❀`,tone:`#b18cff`,text:`After combat, if at or below 50% HP, heal 10.`},silkFan:{name:`Silk Fan`,rarity:`uncommon`,glyph:`⛉`,tone:`#8fd0ff`,text:`Every 3rd card you play each combat grants 3 Ward.`},reapersBell:{name:`Reaper's Bell`,rarity:`uncommon`,glyph:`♫`,tone:`#d8c27a`,text:`When an enemy dies, gain 1 Energy and draw 1 card.`},executionersSeal:{name:`Executioner's Seal`,rarity:`uncommon`,glyph:`✠`,tone:`#ff6b6b`,text:`Every 10th Attack you play deals double damage.`},ironTalisman:{name:`Iron Talisman`,rarity:`uncommon`,glyph:`◈`,tone:`#c0c8d4`,text:`Every 3rd Attack you play grants 1 Fervor.`},merchantsMark:{name:`Merchant's Mark`,rarity:`uncommon`,glyph:`¤`,tone:`#f2c14e`,text:`Shop prices are 25% lower.`},seersOrb:{name:`Seer's Orb`,rarity:`uncommon`,glyph:`☉`,tone:`#9be8d8`,text:`Card rewards offer 1 additional choice.`},frozenCore:{name:`Frozen Core`,rarity:`rare`,glyph:`❆`,tone:`#a8e6ff`,text:`Unspent Energy carries over between turns.`},verdantBranch:{name:`Verdant Branch`,rarity:`rare`,glyph:`⚕`,tone:`#7ddb8f`,text:`Whenever a card is Kindled or burned away, draw 1 card.`},sunBlossom:{name:`Sun Blossom`,rarity:`rare`,glyph:`❂`,tone:`#ffd166`,text:`All healing is increased by 50%.`},wardingCharm:{name:`Warding Charm`,rarity:`rare`,glyph:`⛨`,tone:`#8fa8ff`,text:`Enemy attacks that would deal 5 or less damage deal 1.`},duskmirror:{name:`Duskmirror`,rarity:`rare`,glyph:`◐`,tone:`#c99aff`,text:`The first card you play each turn costs 0.`},smolderingCoal:{name:`Smoldering Coal`,rarity:`uncommon`,glyph:`♨`,tone:`#ff9a4d`,locked:`ashSermon`,text:`Enemies begin each combat with 2 Smolder.`},thiefOfWicks:{name:`Thief of Wicks`,rarity:`uncommon`,glyph:`☄`,tone:`#c9a86a`,locked:`darkWalker`,text:`Unlit lanterns pay double bounty.`},prismCharm:{name:`Prism Charm`,rarity:`rare`,glyph:`◬`,tone:`#9be8d8`,locked:`untouched`,text:`Your first Shatter each combat spills 2 extra Embers.`},bellOfEndings:{name:`Bell of Endings`,rarity:`rare`,glyph:`♪`,tone:`#dfeaff`,locked:`hundredShards`,text:`Whenever glass Shatters, every other enemy takes 4 damage.`},crownOfCinders:{name:`Crown of Cinders`,rarity:`boss`,glyph:`♛`,tone:`#ff9a4d`,text:`Your lantern holds 12 Embers and begins each combat holding 2.`},hollowCrown:{name:`Hollow Crown`,rarity:`boss`,glyph:`♕`,tone:`#b18cff`,text:`Gain 1 Energy each turn. The glass dims: on pickup, lose 10 Max HP.`,instant:!0},crownOfTithes:{name:`Crown of Tithes`,rarity:`boss`,glyph:`♜`,tone:`#d8c27a`,text:`You may kindle twice each turn, and each kindling grants 3 Ward.`},shatterersCrown:{name:`Shatterer's Crown`,rarity:`boss`,glyph:`♚`,tone:`#8fd0ff`,text:`Enemy glass runs thin: all facet gauges are 1 smaller. Enemies begin with 1 Fervor.`},crownOfTheHearth:{name:`Crown of the Hearth`,rarity:`boss`,glyph:`♥`,tone:`#ff5964`,text:`At the end of combat, heal 3 HP for every Ember still in your lantern.`}},Nu=(()=>{let e={common:[],uncommon:[],rare:[],boss:[]};for(let[t,n]of Object.entries(Mu))e[n.rarity]&&!n.locked&&e[n.rarity].push(t);return e})(),Pu={healing:{name:`Phial of Dawn`,tone:`#ff6b81`,glyph:`♥`,text:`Heal 20 HP.`,combatOnly:!1},strength:{name:`Phial of Fervor`,tone:`#ff8c5a`,glyph:`⚔`,text:`Gain 2 Fervor.`,combatOnly:!0},swift:{name:`Inkdraught`,tone:`#8fd0ff`,glyph:`»`,text:`Draw 3 cards.`,combatOnly:!0},block:{name:`Phial of Held Light`,tone:`#9aa7b8`,glyph:`☗`,text:`Gain 12 Ward.`,combatOnly:!0},fire:{name:`Stormglass Phial`,tone:`#ffd166`,glyph:`✹`,text:`Deal 20 damage to an enemy.`,combatOnly:!0,needsTarget:!0},venom:{name:`Smolderphial`,tone:`#a3e06c`,glyph:`☠`,text:`Apply 7 Smolder to an enemy.`,combatOnly:!0,needsTarget:!0},energy:{name:`Emberphial`,tone:`#ff9a4d`,glyph:`✦`,text:`Gain 3 Embers.`,combatOnly:!0}},Fu={sporeling:{name:`Sporeling`,hp:[13,17],facets:3,art:{kind:`wisp`,hue:95,size:.72},moves:{spit:{name:`Spore Spit`,intent:`attack`,dmg:4},grow:{name:`Bloom`,intent:`buff`,fx:[{who:`self`,id:`str`,n:1}]}},ai:({turn:e})=>e%3==2?`grow`:`spit`},duskfang:{name:`Duskfang`,hp:[26,30],art:{kind:`beast`,hue:22,size:1},moves:{howl:{name:`Howl`,intent:`buff`,fx:[{who:`self`,id:`str`,n:2}]},bite:{name:`Bite`,intent:`attack`,dmg:7},rend:{name:`Rend`,intent:`attack`,dmg:4,times:2}},ai:({turn:e,last:t,rng:n})=>e===1||t!==`howl`&&n()<.18?`howl`:t===`bite`?`rend`:`bite`},gloomslime:{name:`Gloomslime`,hp:[30,34],art:{kind:`slime`,hue:150,size:1},moves:{slam:{name:`Slam`,intent:`attack`,dmg:8},ooze:{name:`Corrosive Ooze`,intent:`attack_debuff`,dmg:3,fx:[{who:`player`,id:`weak`,n:2}]},harden:{name:`Congeal`,intent:`attack_block`,dmg:4,block:6}},ai:({turn:e})=>[`ooze`,`slam`,`harden`][(e-1)%3]},waylayer:{name:`Waylayer`,hp:[28,32],art:{kind:`rogue`,hue:0,size:.95},moves:{stab:{name:`Stab`,intent:`attack`,dmg:9},smoke:{name:`Smokescreen`,intent:`block`,block:8},trick:{name:`Dirty Trick`,intent:`attack_debuff`,dmg:4,fx:[{who:`player`,id:`frail`,n:2}]}},ai:({turn:e,rng:t})=>e===1?`trick`:t()<.55?`stab`:t()<.5?`smoke`:`trick`},thornling:{name:`Thornling`,hp:[18,22],facets:3,art:{kind:`plant`,hue:80,size:.85},startStatus:{thorns:2},moves:{prick:{name:`Prick`,intent:`attack`,dmg:6},bristle:{name:`Bristle`,intent:`buff`,fx:[{who:`self`,id:`thorns`,n:2}]},burst:{name:`Spike Burst`,intent:`attack`,dmg:10}},ai:({turn:e})=>e%4==0?`burst`:e%2==1?`prick`:`bristle`},ashAcolyte:{name:`Ash Acolyte`,hp:[34,38],art:{kind:`cultist`,hue:28,size:1},moves:{ritual:{name:`Dark Ritual`,intent:`buff`,fx:[{who:`self`,id:`ritual`,n:2}]},scorch:{name:`Scorch`,intent:`attack`,dmg:6}},ai:({turn:e})=>e===1?`ritual`:`scorch`},gravewarden:{name:`Gravewarden`,hp:[70,76],elite:!0,art:{kind:`golem`,hue:210,size:1.25},moves:{crush:{name:`Crush`,intent:`attack`,dmg:12},entomb:{name:`Entomb`,intent:`debuff`,fx:[{who:`player`,id:`frail`,n:2},{who:`player`,id:`vulnerable`,n:2}]},bulwark:{name:`Bulwark`,intent:`attack_block`,dmg:6,block:12}},ai:({turn:e})=>[`entomb`,`crush`,`bulwark`,`crush`][(e-1)%4]},alphaFang:{name:`Alpha Duskfang`,hp:[64,70],elite:!0,art:{kind:`beast`,hue:350,size:1.3},moves:{howl:{name:`Alpha Howl`,intent:`buff`,fx:[{who:`self`,id:`str`,n:3}]},savage:{name:`Savage`,intent:`attack`,dmg:5,times:2},throat:{name:`Throat Rip`,intent:`attack`,dmg:13}},ai:({turn:e,last:t})=>e===1||e%4==0?`howl`:t===`savage`?`throat`:`savage`},rootheart:{name:`The Rootheart`,hp:[150,150],boss:!0,art:{kind:`treeboss`,hue:100,size:1.6},moves:{awaken:{name:`Awaken`,intent:`buff`,block:10,fx:[{who:`self`,id:`str`,n:2}]},lash:{name:`Root Lash`,intent:`attack`,dmg:12},spores:{name:`Choking Spores`,intent:`attack_debuff`,dmg:5,fx:[{who:`player`,id:`poison`,n:4},{who:`player`,id:`weak`,n:2}]},entangle:{name:`Entangle`,intent:`attack_debuff`,dmg:7,addCards:{id:`wound`,n:2}},slam:{name:`Colossal Slam`,intent:`attack`,dmg:22}},ai:({turn:e})=>e===1?`awaken`:e%4==0?`slam`:[`lash`,`spores`,`entangle`][(e-2)%3]},drownedOne:{name:`Drowned One`,hp:[38,44],art:{kind:`zombie`,hue:185,size:1},moves:{claw:{name:`Claw`,intent:`attack`,dmg:11},frenzy:{name:`Frenzy`,intent:`attack`,dmg:4,times:3},gurgle:{name:`Gurgle`,intent:`attack_debuff`,dmg:5,fx:[{who:`player`,id:`weak`,n:2}]}},ai:({hpFrac:e,last:t,rng:n})=>e<.5&&t!==`frenzy`?`frenzy`:n()<.6?`claw`:`gurgle`},voltEel:{name:`Voltaic Eel`,hp:[30,36],art:{kind:`serpent`,hue:190,size:.9},moves:{shock:{name:`Shock`,intent:`attack_block`,dmg:7,block:5},discharge:{name:`Discharge`,intent:`attack`,dmg:12},coil:{name:`Coil`,intent:`buff`,block:8,fx:[{who:`self`,id:`str`,n:1}]}},ai:({turn:e})=>[`shock`,`coil`,`discharge`][(e-1)%3]},mirelurker:{name:`Mirelurker`,hp:[34,40],art:{kind:`crawler`,hue:160,size:.95},moves:{sting:{name:`Venom Sting`,intent:`attack_debuff`,dmg:6,fx:[{who:`player`,id:`poison`,n:3}]},burrow:{name:`Burrow`,intent:`block`,block:10},barb:{name:`Barb`,intent:`attack`,dmg:9}},ai:({turn:e,rng:t})=>e%3==0?`burrow`:t()<.55?`sting`:`barb`},tidecaller:{name:`Tidecaller`,hp:[42,48],art:{kind:`cultist`,hue:195,size:1.05},moves:{surge:{name:`Tidal Blessing`,intent:`buff`,fx:[{who:`allies`,id:`str`,n:2}]},bolt:{name:`Water Bolt`,intent:`attack`,dmg:9},undertow:{name:`Undertow`,intent:`attack_debuff`,dmg:4,fx:[{who:`player`,id:`frail`,n:2}]}},ai:({turn:e})=>e===1?`surge`:e%3==0?`undertow`:`bolt`},shellback:{name:`Shellback`,hp:[50,56],art:{kind:`crab`,hue:15,size:1.15},moves:{snap:{name:`Snap`,intent:`attack`,dmg:10},shell:{name:`Shell Up`,intent:`block`,block:13,fx:[{who:`self`,id:`thorns`,n:1}]},jet:{name:`Water Jet`,intent:`attack`,dmg:6,times:2}},ai:({turn:e})=>[`snap`,`shell`,`jet`,`shell`][(e-1)%4]},deepmaw:{name:`Deepmaw`,hp:[54,60],art:{kind:`maw`,hue:200,size:1.2},moves:{bite:{name:`Bite`,intent:`attack`,dmg:14},lure:{name:`Luminous Lure`,intent:`debuff`,fx:[{who:`player`,id:`vulnerable`,n:2}]},swallow:{name:`Swallow`,intent:`attack_buff`,dmg:8,heal:8}},ai:({turn:e})=>[`lure`,`bite`,`swallow`][(e-1)%3]},abyssalKnight:{name:`Abyssal Knight`,hp:[108,116],elite:!0,art:{kind:`knight`,hue:215,size:1.3},moves:{blade:{name:`Voidblade`,intent:`attack`,dmg:15},oath:{name:`Dark Oath`,intent:`buff`,block:14,fx:[{who:`self`,id:`str`,n:2}]},condemn:{name:`Condemn`,intent:`debuff`,fx:[{who:`player`,id:`vulnerable`,n:2},{who:`player`,id:`weak`,n:2}]},execute:{name:`Execute`,intent:`attack`,dmg:9,times:2}},ai:({turn:e})=>[`condemn`,`blade`,`oath`,`execute`][(e-1)%4]},siren:{name:`Siren`,hp:[92,100],elite:!0,art:{kind:`siren`,hue:280,size:1.15},moves:{song:{name:`Dirge`,intent:`debuff`,fx:[{who:`player`,id:`weak`,n:2},{who:`player`,id:`frail`,n:2}]},rend:{name:`Talon Rend`,intent:`attack`,dmg:12},mend:{name:`Mend`,intent:`heal`,heal:12,block:6},shriek:{name:`Shriek`,intent:`attack`,dmg:7,times:2}},ai:({turn:e,hpFrac:t,last:n})=>t<.55&&n!==`mend`?`mend`:[`song`,`rend`,`shriek`][(e-1)%3]},leviathan:{name:`Leviathan's Maw`,hp:[260,260],boss:!0,art:{kind:`leviathan`,hue:195,size:1.7},moves:{tide:{name:`Rising Tide`,intent:`buff`,block:15,fx:[{who:`self`,id:`str`,n:1}]},crush:{name:`Crushing Jaws`,intent:`attack`,dmg:17},brine:{name:`Black Brine`,intent:`attack_debuff`,dmg:6,fx:[{who:`player`,id:`poison`,n:5},{who:`player`,id:`weak`,n:2}]},consume:{name:`Consume the Deep`,intent:`heal`,heal:20,block:10},cataclysm:{name:`Cataclysm`,intent:`attack`,dmg:30}},ai:({turn:e})=>e===1?`tide`:e%4==0?`cataclysm`:[`crush`,`brine`,`consume`][(e-2)%3]},voidWisp:{name:`Void Wisp`,hp:[26,30],facets:3,art:{kind:`wisp`,hue:275,size:.78},moves:{zap:{name:`Void Zap`,intent:`attack`,dmg:7},siphon:{name:`Siphon`,intent:`attack_buff`,dmg:5,heal:5}},ai:({rng:e})=>e()<.6?`zap`:`siphon`},obsidianGolem:{name:`Obsidian Golem`,hp:[64,72],art:{kind:`golem`,hue:270,size:1.3},moves:{pound:{name:`Pound`,intent:`attack`,dmg:14},harden:{name:`Harden`,intent:`block`,block:14},quake:{name:`Quake`,intent:`attack_debuff`,dmg:10,fx:[{who:`player`,id:`frail`,n:2}]}},ai:({turn:e})=>[`pound`,`harden`,`quake`][(e-1)%3]},starCultist:{name:`Star Cultist`,hp:[46,52],art:{kind:`cultist`,hue:290,size:1.05},moves:{ritual:{name:`Star Ritual`,intent:`buff`,fx:[{who:`self`,id:`ritual`,n:3}]},scorch:{name:`Starfire`,intent:`attack`,dmg:9}},ai:({turn:e})=>e===1?`ritual`:`scorch`},shade:{name:`Shade`,hp:[42,48],art:{kind:`shade`,hue:260,size:1},moves:{slash:{name:`Dual Slash`,intent:`attack`,dmg:6,times:2},gloom:{name:`Gloom`,intent:`attack_debuff`,dmg:6,fx:[{who:`player`,id:`weak`,n:2}]},vanish:{name:`Vanish`,intent:`block`,block:12}},ai:({turn:e,rng:t})=>e%3==0?`vanish`:t()<.5?`slash`:`gloom`},chaosHound:{name:`Chaos Hound`,hp:[56,64],art:{kind:`beast`,hue:315,size:1.1},startStatus:{rampage:1},moves:{bite:{name:`Chaos Bite`,intent:`attack`,dmg:9,ramp:3},howl:{name:`Warp Howl`,intent:`buff`,fx:[{who:`self`,id:`str`,n:2}]}},ai:({turn:e})=>e%4==0?`howl`:`bite`},watcherEye:{name:`Watcher Eye`,hp:[48,56],art:{kind:`eye`,hue:250,size:1.05},moves:{gaze:{name:`Piercing Gaze`,intent:`attack_debuff`,dmg:8,fx:[{who:`player`,id:`vulnerable`,n:2}]},beam:{name:`Ruin Beam`,intent:`attack`,dmg:15},blink:{name:`Blink`,intent:`attack_block`,dmg:5,block:10}},ai:({turn:e})=>[`gaze`,`beam`,`blink`][(e-1)%3]},voidColossus:{name:`Voidforged Colossus`,hp:[155,168],elite:!0,art:{kind:`golem`,hue:305,size:1.5},moves:{slam:{name:`Void Slam`,intent:`attack`,dmg:20},fortify:{name:`Fortify`,intent:`buff`,block:18,fx:[{who:`self`,id:`str`,n:2}]},shatter:{name:`Shatter`,intent:`attack_debuff`,dmg:8,fx:[{who:`player`,id:`frail`,n:3}]}},ai:({turn:e})=>[`shatter`,`slam`,`fortify`,`slam`][(e-1)%4]},heraldOfEnd:{name:`Herald of the End`,hp:[128,142],elite:!0,art:{kind:`shade`,hue:335,size:1.4},moves:{doom:{name:`Doomsong`,intent:`debuff`,fx:[{who:`player`,id:`poison`,n:7}]},reave:{name:`Reave`,intent:`attack`,dmg:16},flame:{name:`Black Flame`,intent:`attack`,dmg:8,times:2},rise:{name:`Apotheosis`,intent:`buff`,fx:[{who:`self`,id:`str`,n:3}]}},ai:({turn:e})=>e%4==0?`rise`:[`doom`,`reave`,`flame`][(e-1)%3]},sovereign:{name:`The Eternal Sovereign`,hp:[330,330],boss:!0,art:{kind:`sovereign`,hue:285,size:1.8},moves:{scepter:{name:`Scepter Strike`,intent:`attack`,dmg:18},gravitas:{name:`Gravitas`,intent:`buff`,block:20,fx:[{who:`self`,id:`str`,n:2}]},starfall:{name:`Starfall`,intent:`attack`,dmg:11,times:2},ruin:{name:`Word of Ruin`,intent:`attack_debuff`,dmg:4,fx:[{who:`player`,id:`poison`,n:4},{who:`player`,id:`weak`,n:2},{who:`player`,id:`frail`,n:2}]},ascend:{name:`Ascend`,intent:`buff`,block:30,fx:[{who:`self`,id:`str`,n:4}]},annihilation:{name:`Annihilation`,intent:`attack`,dmg:34}},ai:e=>{let t=e.self;return e.hpFrac<=.5&&!t.flags.ascended?(t.flags.ascended=!0,`ascend`):t.flags.ascended?(t.flags.p2=(t.flags.p2||0)+1,t.flags.p2%3==0?`annihilation`:[`scepter`,`starfall`,`ruin`,`gravitas`][t.flags.p2%4]):[`scepter`,`gravitas`,`starfall`,`ruin`][(e.turn-1)%4]}}},Iu=[{weak:[[`sporeling`,`sporeling`],[`duskfang`],[`gloomslime`],[`sporeling`,`sporeling`,`sporeling`]],normal:[[`duskfang`,`sporeling`],[`ashAcolyte`],[`waylayer`],[`thornling`,`thornling`],[`gloomslime`,`sporeling`],[`duskfang`,`duskfang`],[`waylayer`,`sporeling`]],elite:[[`gravewarden`],[`alphaFang`]],boss:[[`rootheart`]]},{weak:[[`voltEel`],[`mirelurker`],[`drownedOne`]],normal:[[`drownedOne`,`voltEel`],[`tidecaller`,`mirelurker`],[`shellback`],[`deepmaw`],[`drownedOne`,`drownedOne`],[`tidecaller`,`voltEel`],[`mirelurker`,`mirelurker`]],elite:[[`abyssalKnight`],[`siren`]],boss:[[`leviathan`]]},{weak:[[`voidWisp`,`voidWisp`],[`shade`],[`starCultist`]],normal:[[`obsidianGolem`],[`shade`,`voidWisp`],[`chaosHound`],[`watcherEye`],[`starCultist`,`voidWisp`],[`shade`,`shade`],[`chaosHound`,`voidWisp`],[`watcherEye`,`starCultist`]],elite:[[`voidColossus`],[`heraldOfEnd`]],boss:[[`sovereign`]]}],Lu={forgottenShrine:{name:`Forgotten Shrine`,glyph:`⛩`,hue:45,text:`A moss-eaten shrine hums with old power. Offerings of bone and silver litter its base. Something watches from inside the stone.`,choices:[{label:`Pray`,sub:`Remove a card from your deck.`,ops:[{pickRemove:!0}]},{label:`Desecrate`,sub:`Gain 90 gold. Gain a Hex.`,ops:[{gold:90},{addCard:`hex`}]},{label:`Leave`,sub:``,ops:[]}]},woundedKnight:{name:`The Wounded Knight`,glyph:`⚔`,hue:210,text:`A knight slumps against a shattered pillar, breath rattling behind a crushed visor. One gauntlet clutches a relic; the other beckons you closer.`,choices:[{label:`Aid him`,sub:`Lose 8 HP. He rewards you with a relic.`,ops:[{hp:-8},{addRelic:`random`}]},{label:`Loot him`,sub:`Gain 65 gold. Gain a Hex.`,ops:[{gold:65},{addCard:`hex`}]},{label:`Leave`,sub:``,ops:[]}]},voidChest:{name:`Humming Chest`,glyph:`▣`,hue:280,text:`A black iron chest sits alone in the gloom, humming a note you feel in your teeth. Its lock is already broken.`,choices:[{label:`Open it`,sub:`It might hold a relic... or teeth.`,ops:[{roll:[{p:.55,ops:[{addRelic:`random`}],text:`Inside: a relic, warm as a heartbeat.`},{p:.45,ops:[{hp:-12}],text:`Teeth. You pull back a mangled hand. (-12 HP)`}]}]},{label:`Leave`,sub:``,ops:[]}]},emberFountain:{name:`Fountain of Embers`,glyph:`❂`,hue:30,text:`Liquid light pools in a cracked basin, throwing sparks that do not burn. It smells of summer and old victories.`,choices:[{label:`Bathe`,sub:`Heal 35% of your Max HP.`,ops:[{heal:.35}]},{label:`Bottle it`,sub:`Gain a Phial of Dawn.`,ops:[{potion:`healing`}]},{label:`Leave`,sub:``,ops:[]}]},forge:{name:`The Forgotten Forge`,glyph:`⚒`,hue:15,text:`An anvil of black star-metal, still warm. Hammers hang in racks, waiting for hands that died an age ago.`,choices:[{label:`Temper`,sub:`Upgrade a card.`,ops:[{pickUpgrade:!0}]},{label:`Leave`,sub:``,ops:[]}]},gambler:{name:`The Bone Gambler`,glyph:`⚄`,hue:50,text:`A grinning figure rattles a cup of knuckle-bones. "One throw, stranger. Fortune loves the reckless."`,choices:[{label:`Bet 40 gold`,sub:`45% chance to win 110 gold.`,needGold:40,ops:[{gold:-40},{roll:[{p:.45,ops:[{gold:110}],text:`The bones land your way. +110 gold.`},{p:.55,ops:[],text:`The bones betray you. The gambler grins wider.`}]}]},{label:`Walk away`,sub:``,ops:[]}]},mirror:{name:`The Silvered Mirror`,glyph:`◐`,hue:220,text:`A tall mirror stands in the rubble, unbroken. Your reflection moves half a breath behind you — and it is smiling.`,choices:[{label:`Reflect`,sub:`Duplicate a card in your deck.`,ops:[{pickDuplicate:!0}]},{label:`Shatter it`,sub:`Lose 6 HP. Remove a card from your deck.`,ops:[{hp:-6},{pickRemove:!0}]},{label:`Leave`,sub:``,ops:[]}]},library:{name:`The Drowned Library`,glyph:`❦`,hue:190,text:`Shelves of waterlogged grimoires stretch into the dark. Most are pulp — but a few pages still glow faintly.`,choices:[{label:`Study`,sub:`Choose 1 of 5 cards to add to your deck.`,ops:[{pickCard:5}]},{label:`Rest among the stacks`,sub:`Heal 20% of your Max HP.`,ops:[{heal:.2}]}]},fleshTrader:{name:`The Flesh Trader`,glyph:`♠`,hue:320,text:`"Vitality is a currency," purrs a thing wearing a merchant's coat. "And you look flush with it." Long fingers open to reveal a relic.`,choices:[{label:`Trade`,sub:`Lose 8 Max HP. Gain a relic.`,ops:[{maxHp:-8},{addRelic:`random`}]},{label:`Refuse`,sub:``,ops:[]}]},cursedIdol:{name:`The Cursed Idol`,glyph:`☿`,hue:100,text:`A jade idol sits on a plinth of skulls, radiating a soft warmth. It has clearly been left here for a reason.`,choices:[{label:`Take it`,sub:`Gain a relic. Gain a Hex.`,ops:[{addRelic:`random`},{addCard:`hex`}]},{label:`Leave it`,sub:``,ops:[]}]},ruinedCamp:{name:`Ruined Camp`,glyph:`⛺`,hue:35,text:`A campfire, still smoldering. Bedrolls, torn. Whoever slept here left in a hurry — and left their packs behind.`,choices:[{label:`Rest`,sub:`Heal 15% of your Max HP.`,ops:[{heal:.15}]},{label:`Scavenge`,sub:`Gain 45 gold and a random potion.`,ops:[{gold:45},{potion:`random`}]}]}},Ru=[{normal:[12,20],elite:[28,38],boss:[70,80]},{normal:[18,28],elite:[35,48],boss:[85,100]},{normal:[24,36],elite:[45,60],boss:[100,120]}],zu={removeCost:75,cardPrice:{common:[45,55],uncommon:[68,82],rare:[135,160]},relicPrice:{common:[140,160],uncommon:[220,250],rare:[270,300]},potionPrice:[48,62]},Bu={ashfall:{name:`Ashfall`,glyph:`☁`,tone:`#d3f2a1`,text:`Ash chokes every fire: enemies begin combat with 2 Smolder, but their blows leave 1 Smolder on you.`,mods:{enemyStartStatus:{poison:2},playerHitApplies:{poison:1}}},heavyAir:{name:`Heavy Air`,glyph:`☗`,tone:`#8fd0ff`,text:`The air holds light like water: all Ward gained is increased by a quarter — yours and theirs.`,mods:{wardMult:1.25}},thinGlass:{name:`Thin Glass`,glyph:`◬`,tone:`#dfeaff`,text:`Tonight all glass runs thin: every facet gauge is 1 smaller, but enemy blows strike 2 harder.`,mods:{facetDelta:-1,enemyDmgBonus:2}},hungryDark:{name:`The Hungry Dark`,glyph:`☾`,tone:`#c99aff`,text:`The dark eats coin but sharpens choice: shop prices are a quarter higher, and card rewards offer 1 more choice.`,mods:{shopMult:1.25,rewardChoiceBonus:1}},emberWind:{name:`Ember Wind`,glyph:`✦`,tone:`#ff9a4d`,text:`Sparks ride the wind into your lantern: begin each combat with 2 Embers, but draw 4 cards instead of 5.`,mods:{startEmbers:2,drawDelta:-1}},longNight:{name:`The Long Night`,glyph:`★`,tone:`#b18cff`,text:`The climb stretches on: enemies carry 12% more life, but every victory pays 40% more gold.`,mods:{hpMult:1.12,goldMult:1.4}},waningMoon:{name:`Waning Moon`,glyph:`◐`,tone:`#ffe9ac`,text:`The moon spends her last light on you: your first card each turn costs 1 less, but rest sites heal only 20%.`,mods:{firstCardDiscount:1,restHealFrac:.2}}},Vu={vitrified:{name:`Vitrified`,tone:`#8fd0ff`,text:`Thicker glass: +2 facets and +15% HP.`,mods:{facetDelta:2,hpMult:1.15}},cinderVeined:{name:`Cinder-Veined`,tone:`#ff9a4d`,text:`Its blows leave 1 Smolder on you.`,mods:{attackApplies:{poison:1}}},adamant:{name:`Adamant`,tone:`#d8c27a`,text:`The first time its glass would shatter, it holds.`,mods:{adamant:!0}},emberFat:{name:`Ember-Fat`,tone:`#ffe9ac`,text:`Slaying it pays double gold.`,mods:{goldMult:2}},veiled:{name:`Veiled`,tone:`#9aa7b8`,text:`Begins the fight behind 15 Ward.`,mods:{startBlock:15}},fervent:{name:`Fervent`,tone:`#ff8d8d`,text:`Begins the fight with 2 Fervor.`,mods:{startStatus:{str:2}}}},Hu={flare:{name:`Flare`,glyph:`✹`,tone:`#ff9a4d`,cost:3,text:`The lantern vents. Deal 7 damage to ALL enemies and apply 2 Smolder.`,effects:[{kind:`dmg`,n:7},{kind:`status`,who:`allEnemies`,id:`poison`,n:2}]},mendglass:{name:`Mendglass`,glyph:`❋`,tone:`#8fe8a0`,cost:4,text:`Warm light knits the cracks. Heal 8 HP.`,effects:[{kind:`heal`,n:8}]},beacon:{name:`Beacon`,glyph:`☀`,tone:`#ffe9ac`,cost:2,text:`Raise the light. Your attacks chip 1 extra facet this turn.`,effects:[{kind:`status`,who:`self`,id:`beacon`,n:1}]},emberveil:{name:`Emberveil`,glyph:`⛨`,tone:`#8fd0ff`,cost:3,text:`A curtain of held fire. Gain 12 Ward.`,effects:[{kind:`block`,n:12}]},stoke:{name:`Stoke`,glyph:`✦`,tone:`#c99aff`,cost:4,text:`Feed the flame to the hand that carries it. Gain 1 Energy and draw 2 cards.`,effects:[{kind:`energy`,n:1},{kind:`draw`,n:2}]},ashfall:{name:`Ashfall`,glyph:`☁`,tone:`#d3f2a1`,cost:3,text:`The Ashwarden's breath. Apply 3 Smolder to ALL enemies and gain 5 Ward.`,effects:[{kind:`status`,who:`allEnemies`,id:`poison`,n:3},{kind:`block`,n:5}]}},Uu={paneBreaker:{name:`Breaker of Panes`,desc:`Shatter 15 facets`,stat:`shatters`,n:15,unlocks:[`card:quakeblow`,`card:resonantLance`]},lanternFed:{name:`The Lantern Fed`,desc:`Kindle 20 cards by hand`,stat:`kindles`,n:20,unlocks:[`card:tithe`,`card:pyreheart`]},ashSermon:{name:`Sermon of Ash`,desc:`Let Smolder claim 10 lives`,stat:`smolderKills`,n:10,unlocks:[`card:ashenChoir`,`relic:smolderingCoal`]},untouched:{name:`The Glass Untouched`,desc:`Win 3 fights without a scratch`,stat:`perfects`,n:3,unlocks:[`card:flawlessForm`,`relic:prismCharm`]},darkWalker:{name:`Walker of Unlit Ways`,desc:`Enter 6 unlit lanterns`,stat:`unlitVisited`,n:6,unlocks:[`card:nightSight`,`relic:thiefOfWicks`]},spendthrift:{name:`Fire Given Freely`,desc:`Spend 30 embers on Lantern Arts`,stat:`embersSpent`,n:30,unlocks:[`card:novaflare`,`card:emberdance`]},hundredShards:{name:`A Hundred Shards`,desc:`Slay 100 creatures`,stat:`slain`,n:100,unlocks:[`card:shardstorm`,`relic:bellOfEndings`]},firstDawn:{name:`The First Dawn`,desc:`Reach the sunrise once`,stat:`wins`,n:1,unlocks:[`aspect2`]}},Wu=[Du,{id:`ashwarden`,name:`The Ashwarden`,blurb:`Smoke given a shape. Lets the Smolder do the killing and kindles its own hand to feed the lantern. Slower, but it endures — and everything it touches burns.`,hue:26,art:`ashfall`,unlock:`aspect2`,maxHp:80,energy:3,handSize:5,potionSlots:3,startDeck:[`ashBite`,`ashBite`,`ashBite`,`ashBite`,`defend`,`defend`,`defend`,`smother`,`smother`,`firstSpark`],startRelic:`ashenCore`,startGold:99}],Gu=[{name:`Vow of Iron`,desc:`Every creature is harder to break — enemy HP +12%.`,mods:{hpMult:1.12}},{name:`Vow of Malice`,desc:`Their blows land heavier — enemy attacks deal +1.`,mods:{enemyDmgBonus:1}},{name:`Vow of the Deep`,desc:`Bosses armor their cores — boss Facets +1.`,mods:{bossFacetDelta:1}},{name:`Vow of the Mark`,desc:`You climb already cursed — begin every run with a Hex.`,mods:{startHex:!0}},{name:`Vow of the Waning`,desc:`The dark drinks your rest — campfires heal 20%, not 30%.`,mods:{restHealFrac:.2}}],Ku={fullPurse:{name:`A Full Purse`,text:`Set out with 120 extra gold.`,ops:[{gold:120}]},temperedGlass:{name:`Tempered Glass`,text:`Raise your Max HP by 14.`,ops:[{maxHp:14}]},keenEye:{name:`A Keeper's Eye`,text:`Begin with a random relic.`,ops:[{addRelic:`random`}]},warmHearth:{name:`A Warm Hearth`,text:`Mend to full and gain 6 Max HP.`,ops:[{maxHp:6},{heal:1}]},emberFlask:{name:`Ember Flask`,text:`Pack a Fire Phial and a Draught of Vigor.`,ops:[{potion:`fire`},{potion:`healing`}]},twinPhials:{name:`Twin Phials`,text:`Pack a Swift Phial and an Energy Phial.`,ops:[{potion:`swift`},{potion:`energy`}]},pilgrimsCache:{name:`Pilgrim's Cache`,text:`Gain 60 gold and a Ward Phial.`,ops:[{gold:60},{potion:`block`}]},venomPouch:{name:`A Pouch of Ash`,text:`Gain 40 gold and a Venom Phial.`,ops:[{gold:40},{potion:`venom`}]}},qu,Ju,Yu,Xu,Zu,Qu,$u,ed=[],td,nd,rd,id,ad,od,sd,cd=[],ld,ud=0,dd=.5,fd=0,pd,md,hd=[],gd=matchMedia(`(prefers-reduced-motion: reduce)`).matches,_d={sky:new H(724506),fog:new H(1317422),particles:new H(16752717),glow:new H(6750110)},vd={sky:_d.sky.clone(),fog:_d.fog.clone(),particles:_d.particles.clone(),glow:_d.glow.clone()},yd={x:0,y:0},bd=0,xd=1,Sd={x:7,z:-20,bottom:-16,top:54,baseY:-6,rowH:1.06,actGap:4.2,azBase:Math.atan2(30,-7),colSpread:.34},Cd=15,wd=e=>Sd.baseY+e*((Cd-1)*Sd.rowH+Sd.actGap);function Td(e){let t=en.clamp((e-Sd.bottom)/(Sd.top-Sd.bottom),0,1),n=1+Math.sin(t*21)*.07+Math.sin(t*57)*.05+Math.sin(t*9+1.7)*.06;return(1-t)**1.15*6.2*n+.85}function Ed(e,t){let n=wd(e)+t.row*Sd.rowH+t.jy*.5,r=Sd.azBase+(t.col-3+t.jx)*Sd.colSpread,i=Math.max(Td(n)+.5,3.6);return new z(Sd.x+Math.cos(r)*i,n,Sd.z+Math.sin(r)*i)}var Dd=`ambient`,Od=wd(0),kd=wd(0),Ad=0,jd=0,Md=0,Nd=new z(0,wd(0),-6),Pd=new z,Fd=new z,Id=new z,Ld=new H(16777215),Rd=new H,zd=new H(12571903);function Bd(e,t){kd=wd(e)+Math.max(0,t)*Sd.rowH}function Vd(e,t){Dd=`map`,Ad=e,jd=Math.max(0,t),Md=0}function Hd(){Dd=`ambient`}function Ud(e){Md=en.clamp(Md+e,-jd-1,15.5-jd)}var Wd=null,Gd=null;function Kd(e,t){Wd=e,Gd=t}function qd(){Wd=null,Gd=null}function Jd(e){let t=document.createElement(`canvas`);t.width=t.height=128;let n=t.getContext(`2d`),r=n.createRadialGradient(64,64,0,64,64,64);for(let[t,n]of e)r.addColorStop(t,n);return n.fillStyle=r,n.fillRect(0,0,128,128),new va(t)}function Yd(e,t,n,r,i,a){let o=new ti,s=new Float32Array(e*3),c=new Float32Array(e);for(let t=0;t<e;t++)s[t*3]=(Math.random()-.5)*n,s[t*3+1]=(Math.random()-.5)*r,s[t*3+2]=-Math.random()*i,c[t]=Math.random()*Math.PI*2;return o.setAttribute(`position`,new Br(s,3)),o.userData.seeds=c,new ha(o,new ua({size:t,map:Jd([[0,`rgba(255,255,255,1)`],[.35,`rgba(255,255,255,.6)`],[1,`rgba(255,255,255,0)`]]),transparent:!0,opacity:a,depthWrite:!1,blending:2,sizeAttenuation:!0}))}var Xd=new URLSearchParams(location.search).get(`input`)===`touch`||matchMedia(`(pointer: coarse)`).matches;function Zd(){qu=new fu({canvas:document.getElementById(`bg3d`),antialias:!Xd,alpha:!1}),Ju=new sr,Ju.fog=new or(_d.fog.getHex(),.055),Yu=new wo(58,1,.1,120),Yu.position.set(0,Od,10),Qu=Yd(Xd?320:900,.16,46,26,40,.75),$u=Yd(Xd?90:240,.32,46,26,34,.5),Ju.add(Qu,$u),td=new Qn,Ju.add(td);let e=Jd([[0,`rgba(255,255,255,.75)`],[.4,`rgba(255,255,255,.25)`],[1,`rgba(255,255,255,0)`]]);for(let t=0;t<(Xd?5:7);t++){let t=new xi(new si({map:e,transparent:!0,opacity:.1+Math.random()*.1,depthWrite:!1,blending:2})),n=14+Math.random()*22;t.scale.set(n,n*.7,1),t.position.set((Math.random()-.5)*40,(Math.random()-.5)*18-3,-12-Math.random()*22),t.userData.wob=Math.random()*Math.PI*2,td.add(t),ed.push(t)}let t=[];for(let e=0;e<=56;e++){let n=e/56,r=Sd.bottom+n*(Sd.top-Sd.bottom);t.push(new R(Td(r),r))}nd=new ji({color:263435,fog:!1});let n=new Ui(new Ea(t,9),nd);n.position.set(Sd.x,0,Sd.z),n.rotation.y=.35,Ju.add(n);let r=new Ui(new Ea(t.map(e=>new R(e.x*.5,e.y*.5-10)),6),nd);r.position.set(-15,0,-30),Ju.add(r);{let e=Xd?70:120;ad=new si({map:Jd([[0,`rgba(255,255,255,.95)`],[.4,`rgba(255,255,255,.35)`],[1,`rgba(255,255,255,0)`]]),transparent:!0,opacity:.55,depthWrite:!1,blending:2});for(let t=0;t<e;t++){let e=Sd.bottom+6+Math.random()*(Sd.top-Sd.bottom-10),t=Sd.azBase+(Math.random()-.5)*2.4,n=Td(e)+.12,r=new xi(ad),i=.16+Math.random()*.26;r.scale.set(i,i,1),r.position.set(Sd.x+Math.cos(t)*n,e,Sd.z+Math.sin(t)*n),Ju.add(r)}}rd=new Ui(new Oa(.32,12,12),new ji({color:16777215,fog:!1})),rd.position.set(Sd.x,Sd.top+.9,Sd.z),Ju.add(rd),id=new xi(new si({map:Jd([[0,`rgba(255,255,255,.9)`],[.3,`rgba(255,255,255,.3)`],[1,`rgba(255,255,255,0)`]]),transparent:!0,opacity:.8,depthWrite:!1,blending:2,fog:!1})),id.scale.set(4,4,1),id.position.copy(rd.position),Ju.add(id),sd=new ji({color:329485});let i=new Ui(new Ca(70,24),sd);i.rotation.x=-Math.PI/2,i.position.y=-9.6,Ju.add(i),od=new ji({color:395792});let a=new Ta(1,1,6);for(let e=0;e<(Xd?32:52);e++){let e=new Ui(a,od),t,n,r;do t=Math.random()*Math.PI*2,n=7+Math.random()*28,r=Math.sin(t)*n-8;while(r>4);let i=2+Math.random()*3.4;e.scale.set(.5+Math.random()*.9,i,.5+Math.random()*.9),e.position.set(Math.cos(t)*n,-9.6+i/2,r),Ju.add(e)}{let e=Jd([[0,`rgba(255,255,255,.55)`],[.5,`rgba(255,255,255,.22)`],[1,`rgba(255,255,255,0)`]]);for(let t of[wd(1)-2.2,wd(2)-2.2]){let n=new si({map:e,transparent:!0,opacity:.34,depthWrite:!1});cd.push(n);for(let e=0;e<(Xd?10:16);e++){let e=new xi(n),r=10+Math.random()*14;e.scale.set(r,r*.32,1);let i,a,o;do i=Math.random()*Math.PI*2,a=5+Math.random()*22,o=Sd.z+Math.sin(i)*a;while(o>-7);e.position.set(Sd.x+Math.cos(i)*a,t+(Math.random()-.5)*1.6,o),e.userData.wob=Math.random()*Math.PI*2,e.userData.cloud=!0,Ju.add(e),ed.push(e)}}}ld=Yd(Xd?170:300,.13,44,26,34,.5),Ju.add(ld),pd=new Qn,pd.position.y=Od,md=new ji({color:131848,transparent:!0,opacity:.96,fog:!1});let o=(e,t,n,r,i)=>{let a=new Ui(e,md);return a.position.set(t,n,r),a.rotation.z=i,pd.add(a),a},s=new Ta(.55,7.5,5);o(s,-4.5,-3.1,5.3,.42),o(s,-5.3,-2.6,4.5,.78),o(s,4.7,-3.3,5.1,-.4),o(s,5.5,-2.4,4.3,-.82);let c=new wa(.032,.032,8,5);hd=[o(c,-4.1,5.9,5.7,.05),o(c,4.7,6.1,5.5,-.07)],Ju.add(pd),Xu=new xu(qu),Xu.addPass(new Su(Ju,Yu)),Zu=new wu(new R(_(),v()),.85,.55,.16),Xu.addPass(Zu),Xu.addPass(new Eu);let l=()=>{qu.setPixelRatio(Math.min(devicePixelRatio*y(),Xd?1:1.75)),qu.setSize(_(),v()),Xu.setSize(_(),v()),Xd&&Zu.setSize(_()/2,v()/2),Yu.aspect=_()/v(),Yu.updateProjectionMatrix()};l(),addEventListener(`resize`,l),addEventListener(`pointermove`,e=>{let t=S(e.clientX,e.clientY);yd.x=(t.x/_()-.5)*2,yd.y=(t.y/v()-.5)*2}),$d(0,!0),requestAnimationFrame(of)}var Qd=.85;function $d(e,t=!1){let n=Ou[Math.min(e,Ou.length-1)].theme;if(vd.sky.setHex(n.sky),vd.fog.setHex(n.fog),vd.particles.setHex(n.particles),vd.glow.setHex(n.glow),Qd=.85,ud=Math.min(e,2),dd=[.5,.42,.62][ud],t)for(let e of Object.keys(_d))_d[e].copy(vd[e])}function ef(){vd.sky.setHex(5911634),vd.fog.setHex(9062997),vd.particles.setHex(16767392),vd.glow.setHex(16761976),Qd=1.2,dd=.12}function tf(e=1){bd=Math.min(2.2,bd+e),xd=Math.min(7,xd+e*2.4)}var nf=!1;function rf(){nf=!0,sf(9e6)}var af=0;function of(e){nf||(requestAnimationFrame(of),sf(e))}function sf(e){let t=Math.min(.05,(e-af)/1e3||.016);af=e;let n=e/1e3;for(let e of Object.keys(_d))_d[e].lerp(vd[e],Math.min(1,t*1.4));ud===2&&!gd&&Math.random()<t/11&&(fd=.7+Math.random()*.5),fd*=.008**t,Ju.background=Rd.copy(_d.sky).lerp(zd,Math.min(.6,fd*.5)),Ju.fog.color.copy(_d.fog).lerp(zd,Math.min(.4,fd*.3)),Qu.material.color.copy(_d.particles),$u.material.color.copy(_d.glow);for(let e of ed)e.userData.cloud||e.material.color.copy(_d.fog).lerp(_d.particles,.5),e.position.x+=Math.sin(n*.08+e.userData.wob)*.004;nd.color.copy(_d.sky).multiplyScalar(.42),sd.color.copy(_d.sky).multiplyScalar(.3),od.color.copy(_d.sky).multiplyScalar(.38),ad.color.copy(_d.glow);for(let e of cd)e.color.copy(_d.fog).lerp(Ld,.42);rd.material.color.copy(_d.glow),id.material.color.copy(_d.glow);let r=.65+Math.sin(n*1.7)*.25;id.material.opacity=r,id.scale.setScalar(3.2+r*1.6),$u.material.opacity=.42+Math.sin(n*.9)*.12,xd+=(1-xd)*Math.min(1,t*2.5);let i=Yu.position.y;for(let[e,r]of[[Qu,1],[$u,.55]]){let a=e.geometry.attributes.position,o=e.geometry.userData.seeds;for(let e=0;e<a.count;e++){let s=a.getY(e)+t*r*xd*(.35+o[e]%1*.5),c=a.getX(e)+Math.sin(n*.5+o[e])*t*.18;s>i+14&&(s=i-14,c=(Math.random()-.5)*46),s<i-15&&(s=i-14),a.setY(e,s),a.setX(e,c)}a.needsUpdate=!0}bd*=.02**t;{ld.material.opacity+=(dd-ld.material.opacity)*Math.min(1,t*1.2),ud===0?ld.material.color.copy(_d.particles).lerp(Ld,.55):ud===1?ld.material.color.copy(_d.glow).lerp(Ld,.25):ld.material.color.copy(_d.particles);let e=ld.geometry.attributes.position,r=ld.geometry.userData.seeds;for(let a=0;a<e.count;a++){let o=e.getX(a),s=e.getY(a),c=r[a]%1;ud===0?(s-=t*(.45+c*.55),o+=Math.sin(n*.7+r[a])*t*.5):ud===1?(s-=t*(.14+c*.2),o+=Math.sin(n*.35+r[a])*t*.9):(o-=t*(3.4+c*2.8),s-=t*(.5+c*.5)),s<i-14&&(s+=28),s>i+14&&(s-=28),o<-23&&(o+=46),o>23&&(o-=46),e.setX(a,o),e.setY(a,s)}e.needsUpdate=!0}Od+=(kd-Od)*Math.min(1,t*1.6),td.position.y=i*.93+Math.sin(n*.3)*.2;let a=Math.max(1,1.05/Yu.aspect);if(Dd===`map`){let e=en.clamp(jd+1.6+Md,1.2,15.4),t=wd(Ad)+e*Sd.rowH,n=(Math.max(Td(t),3.1)+8.2)*a-bd*.4,r=Sd.azBase+yd.x*.06;Pd.set(Sd.x+Math.cos(r)*n,t+1.1-yd.y*.5,Sd.z+Math.sin(r)*n),Fd.set(Sd.x,t+1.9,Sd.z)}else Pd.set(yd.x*.9,Od-yd.y*.55+Math.sin(n*.22)*.25,10+Math.sin(n*.1)*.3-bd*.9),Fd.set(0,Od,-6);if(pd.position.y+=(i-pd.position.y)*Math.min(1,t*2.2),md.opacity+=((Dd===`map`?0:.96)-md.opacity)*Math.min(1,t*3),hd[0].rotation.z=.05+Math.sin(n*.5)*.028,hd[1].rotation.z=-.07+Math.sin(n*.42+2)*.024,Yu.position.lerp(Pd,Math.min(1,t*2.2)),Nd.lerp(Fd,Math.min(1,t*2.2)),Yu.lookAt(Nd),Yu.rotation.z+=Math.sin(n*.13)*.012+bd*(Math.random()-.5)*.012,Gd&&Wd){let e=[];for(let t of Wd){Id.copy(t.pos).project(Yu);let n=Yu.position.distanceTo(t.pos);e.push({id:t.id,x:(Id.x*.5+.5)*_(),y:(-Id.y*.5+.5)*v(),s:en.clamp(9*a/n,.4,1.3),fade:Id.z>1?0:en.clamp(1.3-Math.abs(t.pos.y-Nd.y)/(7.5*a),.1,1)})}Gd(e)}Xd||(Zu.strength=Qd+bd*.55+fd*.45),Xd?qu.render(Ju,Yu):Xu.render()}var cf=matchMedia(`(prefers-reduced-motion: reduce)`).matches,lf,G,uf,df,ff=[],pf=[],mf=0,hf=0,gf=0,_f=0,vf=[{rate:1,colors:[`#b8b0a0`,`#8a8378`],vx:[-6,6],vy:[10,26],size:[1.4,2.6],drift:.4,emberRate:.5},{rate:.75,colors:[`#9fd4ff`,`#cfe6ff`],vx:[-4,4],vy:[8,18],size:[1.6,3],drift:.7,emberRate:.25},{rate:1.25,colors:[`#ff9a4d`,`#ffd166`],vx:[24,60],vy:[-18,-4],size:[1.4,2.4],drift:1.1,emberRate:.9}],yf=null,bf=0,xf=matchMedia(`(pointer: coarse)`).matches,Sf=()=>Math.min(devicePixelRatio*y(),xf?1:2),Cf=e=>xf?Math.max(2,Math.round(e*.4)):e;function wf(){lf=document.getElementById(`vfx`),G=lf.getContext(`2d`),uf=document.getElementById(`floaties`),df=document.getElementById(`shake`);let e=()=>{lf.width=_()*Sf(),lf.height=v()*Sf()};e(),addEventListener(`resize`,e),requestAnimationFrame(kf)}var Tf=!1;function Ef(){Tf=!0,ff=[],pf=[],G&&G.clearRect(0,0,lf.width,lf.height)}function Df(e,{boss:t=!1,mult:n=1}={}){ff=ff.filter(e=>!e.weather),yf=e==null?null:{act:Math.min(e,2),boss:t,mult:n},bf=0}var Of=0;function kf(e){if(Tf)return;requestAnimationFrame(kf);let t=Math.min(.05,(e-Of)/1e3||.016);if(Of=e,e<_f)return;if(yf&&!cf){let e=vf[yf.act];for(bf+=t*e.rate*(yf.boss?1.4:1)*yf.mult*(xf?.6:1);bf>=1;){--bf;let t=Math.random()<e.emberRate*.1,n=e=>e[0]+Math.random()*(e[1]-e[0]);ff.push({kind:`dot`,weather:!0,x:Math.random()*_(),y:t?v()+6:-6,vx:n(e.vx),vy:t?-n([14,34]):n(e.vy),size:n(e.size)*(t?1.3:1),color:t?`#ffd166`:e.colors[Math.random()*e.colors.length|0],grav:0,drag:e.drift*.1,life:9,fade:3,add:t,alpha:t?.9:.35})}}let n=Sf();G.clearRect(0,0,lf.width,lf.height),G.save(),G.scale(n,n),ff=ff.filter(e=>(e.life-=t)>0);for(let e of ff){e.x+=e.vx*t,e.y+=e.vy*t,e.vy+=(e.grav||0)*t,e.vx*=1-(e.drag||0)*t,e.vy*=1-(e.drag||0)*t;let n=Math.min(1,e.life/(e.fade||.3));if(G.globalAlpha=n*(e.alpha??1),G.globalCompositeOperation=e.add?`lighter`:`source-over`,e.kind===`spark`){let t=Math.hypot(e.vx,e.vy)*.045+2,r=Math.atan2(e.vy,e.vx);G.strokeStyle=e.color,G.lineWidth=e.size*n,G.beginPath(),G.moveTo(e.x,e.y),G.lineTo(e.x-Math.cos(r)*t,e.y-Math.sin(r)*t),G.stroke()}else if(e.kind===`ring`)e.r+=e.vr*t,G.strokeStyle=e.color,G.lineWidth=Math.max(.5,e.size*n),G.beginPath(),G.arc(e.x,e.y,e.r,0,Math.PI*2),G.stroke();else if(e.kind===`slash`){e.prog=Math.min(1,(e.prog||0)+t/e.dur);let r=e.arc*e.prog;G.strokeStyle=e.color,G.lineCap=`round`;for(let t=0;t<3;t++)G.globalAlpha=n*(.9-t*.3),G.lineWidth=(e.size-t*3)*(1-e.prog*.6),G.beginPath(),G.arc(e.x,e.y,e.r+t*7,e.a0,e.a0+r),G.stroke()}else G.fillStyle=e.color,G.beginPath(),G.arc(e.x,e.y,e.size*n,0,Math.PI*2),G.fill()}G.globalCompositeOperation=`source-over`,G.globalAlpha=1,pf=pf.filter(e=>(e.life-=t)>0);for(let e of pf)G.globalAlpha=e.life/e.dur*e.alpha,G.fillStyle=e.color,G.fillRect(0,0,_(),v());G.restore(),mf>.1||Math.abs(hf)>.1?(hf=(Math.random()-.5)*mf,gf=(Math.random()-.5)*mf,mf*=.001**t,df.style.transform=`translate(${hf.toFixed(1)}px,${gf.toFixed(1)}px)`):df.style.transform&&(df.style.transform=``,mf=0)}function Af(e=8){cf||(mf=Math.max(mf,e))}function jf(e=60){cf||(_f=performance.now()+e)}function Mf(e=`#fff`,t=.18,n=.25){cf||pf.push({color:e,alpha:t,dur:n,life:n})}function Nf(e,t,{color:n=`#ffd166`,n:r=18,speed:i=260,spread:a=Math.PI*2,angle:o=0,size:s=3,grav:c=300,kind:l=`spark`,add:u=!0,life:d=.5}={}){if(!cf)for(let f=0;f<Cf(r);f++){let r=o+(Math.random()-.5)*a,f=i*(.35+Math.random()*.75);ff.push({kind:l,x:e,y:t,vx:Math.cos(r)*f,vy:Math.sin(r)*f,size:s*(.6+Math.random()*.8),color:n,grav:c,drag:1.6,life:d*(.6+Math.random()*.8),fade:.25,add:u})}}function Pf(e,t,n,r=8,i=420,a=4){cf||ff.push({kind:`ring`,x:e,y:t,r,vr:i,size:a,color:n,life:.45,fade:.45,add:!0})}function Ff(e,t,n=`#fff`){if(cf)return;let r=-Math.PI*.85+(Math.random()-.5)*.6;ff.push({kind:`slash`,x:e,y:t,r:46+Math.random()*18,a0:r,arc:Math.PI*.8,prog:0,dur:.14,size:13,color:n,life:.3,fade:.18,add:!0})}function If(e,t,n,r=10){if(!cf)for(let i=0;i<Cf(r);i++)ff.push({kind:`dot`,x:e+(Math.random()-.5)*60,y:t+(Math.random()-.5)*40,vx:(Math.random()-.5)*30,vy:-40-Math.random()*60,size:2.5+Math.random()*2.5,color:n,grav:-20,life:.9+Math.random()*.5,fade:.5,add:!0,alpha:.9})}function Lf(e,t,n,r=``,{tint:i=``,dx:a=0}={}){let o=document.createElement(`div`);o.className=`floaty ${r}`,o.innerHTML=n,o.style.left=`${e+a}px`,o.style.top=`${t}px`,i&&(o.style.color=i),uf.appendChild(o);let s=(Math.random()-.5)*40,c=r.includes(`crit`),l=c?(Math.random()-.5)*16:r.includes(`dmg`)?(Math.random()-.5)*8:0,u,d=1100;c?(d=1250,u=[{transform:`translate(-50%,-50%) scale(0.5)`,opacity:0,filter:`brightness(3)`},{transform:`translate(-50%,-92%) scale(1.45) rotate(${l}deg)`,opacity:1,filter:`brightness(1.9)`,offset:.13},{transform:`translate(-50%,-110%) scale(1.05) rotate(${l}deg)`,opacity:1,filter:`brightness(1)`,offset:.34},{transform:`translate(calc(-50% + ${s}px),-230%) scale(0.98) rotate(${l}deg)`,opacity:0,filter:`brightness(1)`}]):u=r.includes(`poisonf`)?[{transform:`translate(-50%,-50%) scale(0.7)`,opacity:0},{transform:`translate(-50%,-26%) scale(1.05)`,opacity:1,offset:.2},{transform:`translate(calc(-50% + ${s*.4}px),80%) scale(0.88)`,opacity:0}]:[{transform:`translate(-50%,-50%) scale(0.6)`,opacity:0},{transform:`translate(-50%,-90%) scale(1.15) rotate(${l}deg)`,opacity:1,offset:.18},{transform:`translate(calc(-50% + ${s}px),-230%) scale(0.95) rotate(${l}deg)`,opacity:0}],o.animate(u,{duration:d,easing:`cubic-bezier(.2,.7,.3,1)`}).onfinish=()=>o.remove()}var Rf=[[0,0],[100,0],[100,100],[0,100]],zf=e=>[e.u*100,(1-e.v)*100];function Bf(e,t,n){let r=e=>(e[0]-t[0])**2+(e[1]-t[1])**2-(e[0]-n[0])**2-(e[1]-n[1])**2,i=[];for(let t=0;t<e.length;t++){let n=e[t],a=e[(t+1)%e.length],o=r(n),s=r(a),c=()=>{let e=o/(o-s);return[n[0]+(a[0]-n[0])*e,n[1]+(a[1]-n[1])*e]};o<=0&&s<=0?i.push(a):o<=0?i.push(c()):s<=0&&(i.push(c()),i.push(a))}return i}function Vf(e){let t=[];for(let n of e||[])t.some(e=>Math.hypot(e.u-n.u,e.v-n.v)<.02)||t.push({u:n.u,v:n.v});if(t.length<3)return null;let n=t.slice();for(let e=.1;e<1;e+=.21)for(let t=.09;t<1;t+=.21){let r=e+(Math.random()-.5)*.12,i=t+(Math.random()-.5)*.12;n.some(e=>Math.hypot(e.u-r,e.v-i)<.13)||n.push({u:r,v:i})}let r=n.map(zf),i=[];for(let e=0;e<r.length;e++){let t=Rf.map(e=>[...e]);for(let n=0;n<r.length&&t.length>=3;n++)n!==e&&(t=Bf(t,r[e],r[n]));if(t.length<3)continue;let n=0,a=0,o=0;for(let e=0;e<t.length;e++){let[r,i]=t[e],[s,c]=t[(e+1)%t.length];n+=r*c-s*i,a+=r,o+=i}Math.abs(n)*.5<.3||i.push({poly:t,cx:a/t.length,cy:o/t.length})}return i.length<3?null:{parts:i,ix:t.reduce((e,t)=>e+t.u,0)/t.length*100,iy:t.reduce((e,t)=>e+(1-t.v),0)/t.length*100}}function Hf(){let e=50+(Math.random()-.5)*14,t=52+(Math.random()-.5)*14,n=[];for(let r=0;r<11;r++){let i=r/11*Math.PI*2+(Math.random()-.5)*.34,a=(r+1)/11*Math.PI*2+(Math.random()-.5)*.34,o=88+Math.random()*12;n.push({poly:[[e,t],[e+Math.cos(i)*o,t+Math.sin(i)*o*.85],[e+Math.cos(a)*o,t+Math.sin(a)*o*.85]],cx:e+Math.cos((i+a)*.5)*o*.45,cy:t+Math.sin((i+a)*.5)*o*.38})}return{parts:n,ix:e,iy:t}}function Uf(e,t={}){let n=e.querySelector(`svg:not(.cracks-overlay)`)||e.querySelector(`img.raster-art`),r=t.rect||C(e);if(!n&&!t.capture||!r.width)return;if(cf){e.style.visibility=`hidden`;return}let i=t.capture?`<img src="${t.capture}" alt="" style="width:100%;height:100%;object-fit:contain;display:block">`:n.tagName===`svg`?n.outerHTML:`<img src="${n.src}" alt="" style="width:100%;height:100%;object-fit:contain;display:block">`,{parts:a,ix:o,iy:s}=Vf(t.sites)||Hf(),c=[];for(let e of a){let t=e.poly.map(e=>`${e[0].toFixed(2)}% ${e[1].toFixed(2)}%`).join(`,`),n=document.createElement(`div`);n.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;pointer-events:none;z-index:57;clip-path:polygon(${t});will-change:transform,opacity;`,n.innerHTML=i,uf.appendChild(n);let a=e.cx-o,l=e.cy-s,u=Math.hypot(a,l)||1,d=Math.max(0,1-u/75),f=(120+Math.random()*240)*(.85+d*.75);c.push({el:n,x:0,y:0,rot:0,bounced:0,vx:a/u*f,vy:l/u*f*.65-(60+Math.random()*150),vr:(Math.random()-.5)*260,maxY:Math.max(...e.poly.map(e=>e[1]))})}let l=performance.now(),u=l,d=e=>{let t=Math.min(.032,(e-l)/1e3);l=e;let n=e-u,i=0;for(let e of c){if(!e.el)continue;e.vy+=2400*t,e.x+=e.vx*t,e.y+=e.vy*t,e.rot+=e.vr*t;let a=r.height*(1-e.maxY/100)+2;e.y>a&&e.vy>0&&e.bounced<2&&(e.y=a,e.vy*=-(.34-e.bounced*.12),e.vx*=.6,e.vr*=.5,e.bounced++);let o=n<650?1:Math.max(0,1-(n-650)/380);e.el.style.transform=`translate3d(${e.x.toFixed(1)}px,${e.y.toFixed(1)}px,0) rotate(${e.rot.toFixed(1)}deg)`,e.el.style.opacity=o.toFixed(3),o<=0||e.y>r.height*1.5?(e.el.remove(),e.el=null):i++}i&&requestAnimationFrame(d)};requestAnimationFrame(d),e.style.visibility=`hidden`}var Wf=e=>{let t=C(e);return{x:t.left+t.width/2,y:t.top+t.height/2}},Gf={slash:`#ffffff`,pierce:`#cfe6ff`,blunt:`#ffd8a0`,fire:`#ff9a4d`,poison:`#d3a15a`,void:`#c99aff`,ward:`#9fd4ff`};function Kf(e,t,n,r,i=`#ff9a4d`){if(cf)return;let a=Cf(14);for(let o=0;o<a;o++){let s=o/a,c=(Math.random()-.5)*26,l=(Math.random()-.5)*26;ff.push({kind:`dot`,x:e+(n-e)*s+c,y:t+(r-t)*s+l,vx:(Math.random()-.5)*40,vy:-30-Math.random()*50,size:2+Math.random()*2.4,color:i,grav:-30,life:.5+s*.4,fade:.3,add:!0,alpha:.9})}}function qf(e,t,n=`#d3a15a`,r=12){if(!cf)for(let i=0;i<Cf(r);i++)ff.push({kind:`dot`,x:e+(Math.random()-.5)*54,y:t-10+(Math.random()-.5)*30,vx:(Math.random()-.5)*26,vy:60+Math.random()*120,size:2+Math.random()*2,color:n,grav:420,drag:.4,life:.6+Math.random()*.3,fade:.35,add:!0})}function Jf(e,t,n=`#c99aff`){if(!cf){ff.push({kind:`ring`,x:e,y:t,r:64,vr:-160,size:3.5,color:n,life:.4,fade:.4,add:!0});for(let r=0;r<Cf(16);r++){let r=Math.random()*Math.PI*2,i=46+Math.random()*30;ff.push({kind:`spark`,x:e+Math.cos(r)*i,y:t+Math.sin(r)*i,vx:-Math.cos(r)*(220+Math.random()*120),vy:-Math.sin(r)*(220+Math.random()*120),size:2.2,color:n,grav:0,drag:2.4,life:.34,fade:.2,add:!0})}}}function Yf(e,t,n=`#dfeaff`,r=12){if(!cf)for(let i=0;i<Cf(r);i++){let r=-Math.PI/2+(Math.random()-.5)*1.8;ff.push({kind:`spark`,x:e,y:t,vx:Math.cos(r)*(200+Math.random()*260),vy:Math.sin(r)*(200+Math.random()*260),size:2.6+Math.random()*1.6,color:n,grav:520,drag:.6,life:.5+Math.random()*.3,fade:.22,add:!0})}}function Xf(e,t,n=`slash`,r=.3){if(cf)return;let i=Gf[n]||`#ffffff`,a=r>.55;switch(n){case`slash`:Ff(e,t,a?`#ffd8a0`:`#ffffff`),Nf(e,t,{color:`#ff9a6a`,n:a?26:12,speed:a?420:260});break;case`pierce`:{let n=-Math.PI*.78;for(let r=0;r<(a?3:2);r++)ff.push({kind:`spark`,x:e-Math.cos(n)*70,y:t-Math.sin(n)*70,vx:Math.cos(n)*900,vy:Math.sin(n)*900,size:3.4,color:i,grav:0,drag:0,life:.16+r*.03,fade:.1,add:!0});Nf(e,t,{color:i,n:a?18:9,speed:300,spread:1.4,angle:n+Math.PI});break}case`blunt`:Pf(e,t,i,6,a?720:520,6),Nf(e,t+6,{color:`#e8d8b8`,n:a?24:12,speed:a?380:240,spread:Math.PI,angle:-Math.PI/2,grav:620,kind:`dot`}),Af(a?14:8);break;case`fire`:Nf(e,t,{color:`#ffd166`,n:a?22:12,speed:240,grav:-120,life:.7}),Nf(e,t,{color:`#ff6a3a`,n:a?14:8,speed:160,grav:-60,size:3.6,kind:`dot`,life:.8});break;case`poison`:qf(e,t,`#d3a15a`,a?18:10),If(e,t,`#b8b0a0`,8);break;case`void`:Jf(e,t,i),a&&Mf(`#c99aff`,.08,.25);break;case`ward`:Pf(e,t,i,12,460,4),If(e,t,i,8);break}}var Zf=()=>{!cf&&!xf&&(Mf(`#ffffff`,.28,.09),jf(90))},Qf={annihilate:(e,t)=>{Zf(),Mf(`#ff6a3a`,.16,.5);for(let n of[-140,0,140])Nf(e+n,t,{color:`#ffd166`,n:18,speed:300,grav:-100,life:.8});Af(16)},oblivionStrike:(e,t)=>{Zf(),jf(140),Pf(e,t,`#ffd8a0`,8,900,7),Pf(e,t,`#ffffff`,4,1200,4),Yf(e,t,`#dfeaff`,22),Af(20)},tempest:(e,t)=>{for(let n=0;n<3;n++)setTimeout(()=>Yf(e+(Math.random()-.5)*160,t-60,`#cfe6ff`,12),n*90)},executioner:(e,t)=>{Zf(),Ff(e,t,`#ffffff`),Pf(e,t,`#ff6b6b`,10,700,5),Af(14)},novaflare:(e,t)=>{Zf(),Mf(`#ffd166`,.2,.45),Pf(e,t,`#ffd166`,6,1e3,6),Nf(e,t,{color:`#fff3d6`,n:30,speed:520,grav:-40,life:.9})},shardstorm:(e,t)=>{for(let n=0;n<4;n++)setTimeout(()=>Yf(e+(Math.random()-.5)*200,t-40,`#dfeaff`,10),n*70)},ascension:(e,t)=>{Kf(e,t+120,e,t-120,`#ffd166`),If(e,t-40,`#ffe9ac`,16)},limitBreak:(e,t)=>{Zf(),Pf(e,t,`#8fd0ff`,10,800,6),Yf(e,t,`#cfe6ff`,18),Af(12)},phantomBlades:(e,t)=>{for(let n=0;n<4;n++)setTimeout(()=>Ff(e+(Math.random()-.5)*60,t+(Math.random()-.5)*40,`#c9b0ff`),n*70)},pyreheart:(e,t)=>{Nf(e,t,{color:`#ff5964`,n:14,speed:180,grav:-80,kind:`dot`,life:.9}),If(e,t,`#ffd166`,10)},emberdance:(e,t)=>{for(let n=0;n<3;n++)setTimeout(()=>Kf(e-80+n*80,t+60,e+80-n*80,t-60,`#ff9a4d`),n*100)},devour:(e,t)=>{Jf(e,t,`#c99aff`),setTimeout(()=>Nf(e,t,{color:`#ff9a4d`,n:16,speed:260,grav:-120}),180)},"art:flare":(e,t)=>{Mf(`#ff9a4d`,.18,.4),Nf(e,t,{color:`#ffd166`,n:26,speed:420,grav:-60}),Af(10)},"art:mendglass":(e,t)=>{Pf(e,t,`#7ddb8f`,14,420,4),If(e,t,`#d9fbe7`,14)},"art:beacon":(e,t)=>{Mf(`#ffe9ac`,.14,.5),Kf(e,t+100,e,t-140,`#ffe9ac`)},"art:emberveil":(e,t)=>{Pf(e,t,`#9fd4ff`,10,520,5),Pf(e,t,`#ffd166`,20,380,3)},"art:stoke":(e,t)=>{Nf(e,t,{color:`#ff6a3a`,n:18,speed:220,grav:-140,life:.8})},"art:ashfall":(e,t)=>{for(let n=0;n<3;n++)setTimeout(()=>qf(e+(Math.random()-.5)*220,t-80,`#b8b0a0`,12),n*120)}},$f=class extends sr{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new Sa;e.deleteAttribute(`uv`);let t=new za({side:1}),n=new za,r=new Eo(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new Ui(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new ta(e,n,6),o=new Zn;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new Ui(e,ep(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new Ui(e,ep(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new Ui(e,ep(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new Ui(e,ep(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new Ui(e,ep(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new Ui(e,ep(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function ep(e){return new Va({color:0,emissive:16777215,emissiveIntensity:e})}var tp=24,np=36,rp=.45,ip=matchMedia(`(prefers-reduced-motion: reduce)`).matches,ap=new URLSearchParams(location.search).get(`input`)===`touch`,op=ap||matchMedia(`(pointer: coarse)`).matches,sp=()=>{let e=new URLSearchParams(location.search);return e.get(`mesh`)===`0`?!1:e.get(`mesh`)===`1`?!0:!ip&&!ap},cp=.45,lp=1,up=1,dp=2.5,fp=1.1,pp=1.55,mp=1.6,hp=192,gp=(e,t,n)=>Math.exp(-((e-t)**2)/(2*n*n)),_p={wisp:{sway:.55,bob:1.85,breathe:.95,head:.4,cloth:0,pin:1.05,float:1.35},beast:{sway:1.15,bob:.85,breathe:.65,head:.55,cloth:.2,float:0},slime:{sway:.55,bob:.55,breathe:1.35,head:0,cloth:.55,pin:1.2,float:.25},rogue:{sway:1,bob:1,breathe:1,head:1,cloth:.8,float:0},plant:{sway:.7,bob:.75,breathe:.85,head:.25,cloth:1.15,pin:1.1,float:.55},cultist:{sway:.95,bob:.95,breathe:1,head:.85,cloth:.7,float:0},golem:{sway:.28,bob:.25,breathe:.35,head:.15,cloth:0,float:0},treeboss:{sway:.4,bob:.3,breathe:.5,head:.2,cloth:.6,float:0},zombie:{sway:.7,bob:.5,breathe:.6,head:.4,cloth:.3,float:0},serpent:{sway:.95,bob:.65,breathe:.45,head:.35,cloth:.15,float:.15},crawler:{sway:.9,bob:.6,breathe:.55,head:.45,cloth:.1,float:0},crab:{sway:.5,bob:.35,breathe:.4,head:.2,cloth:0,float:0},maw:{sway:.65,bob:.45,breathe:.7,head:.5,cloth:0,float:.1},knight:{sway:.85,bob:.7,breathe:.75,head:.7,cloth:.5,float:0},siren:{sway:1.05,bob:1.25,breathe:.8,head:.6,cloth:.9,pin:1.1,float:.85},leviathan:{sway:.35,bob:.25,breathe:.45,head:.3,cloth:.2,float:0},shade:{sway:.9,bob:1.05,breathe:.7,head:.5,cloth:.6,pin:1.1,float:.7},eye:{sway:.35,bob:1.45,breathe:1,head:0,cloth:0,pin:.95,float:1.2},sovereign:{sway:.45,bob:.35,breathe:.55,head:.45,cloth:.35,float:0},humanoid:{sway:1,bob:1,breathe:1,head:1,cloth:.85,float:0}},vp,yp,bp,xp=[],Sp=0,Cp=1,wp=1,Tp=!1,Ep=new Map,Dp=new uo;function Op(e,t){if(Ep.has(e)){let n=Ep.get(e);return n.image?.width&&t?.(n),n}let n=Dp.load(e,e=>{e.colorSpace=dt,t?.(e)});return Ep.set(e,n),n}function kp(e,t){if(e?.naturalWidth>0)return e.naturalWidth/e.naturalHeight;let n=t?.image;return n?.width>0?n.width/n.height:1}function Ap(e,t,n){return!n||n<=0?{w:e,h:t}:n>=e/t?{w:e,h:e/n}:{w:t*n,h:t}}var jp=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,Mp=`
  varying vec2 vUv;
  uniform sampler2D map;
  uniform float uFlash;  // white hit beat
  uniform float uCut;    // 0 = soft transparent edges; >0 = opaque with alpha discard
  void main() {
    vec4 base = texture2D(map, vUv);
    if (uCut > 0.0 && base.a < uCut) discard;
    gl_FragColor = vec4(base.rgb + uFlash * base.a, uCut > 0.0 ? 1.0 : base.a);
    // sRGB texture decodes to linear on sample — convert back on output or the
    // body renders darker than the raster it replaces (no tone mapping either:
    // ACES is for the PBR glass, the body must stay UI-accurate)
    #include <colorspace_fragment>
  }
`;function Np(e,t,n,r){let i=new Da(2,2,tp,np),a={geo:i,base:i.attributes.position.array.slice(),profile:t,seed:n,el:null,aspect:kp(r,null)||2/3,sites:[],death:0,glass:null,fire:null,beams:null,bodyPx:null},o=Op(e,e=>{a.aspect=kp(r,e)});a.tex=o;let s=new La({uniforms:{map:{value:o},uFlash:{value:0},uCut:{value:0}},vertexShader:jp,fragmentShader:Mp,transparent:!0,depthTest:!1,depthWrite:!1});a.mat=s;let c=new Ui(i,s);return c.renderOrder=1,yp.add(c),a.mesh=c,r&&!r.complete&&r.addEventListener(`load`,()=>{a.aspect=kp(r,o)},{once:!0}),a}function Pp(e){if(e.bodyPx)return e.bodyPx;let t=e.tex?.image;if(!t?.width)return null;let n=Object.assign(document.createElement(`canvas`),{width:hp,height:hp}).getContext(`2d`);return n.drawImage(t,0,0,hp,hp),e.bodyPx=n.getImageData(0,0,hp,hp).data,e.bodyPx}var Fp=e=>e.sites.map(e=>({x:e.u*hp,y:(1-e.v)*hp}));function Ip(e){let t=hp,n=Pp(e),r=Object.assign(document.createElement(`canvas`),{width:t,height:t}),i=r.getContext(`2d`),a=i.createImageData(t,t),o=Fp(e),s=cp*t,c=s*(1-.9*lp);for(let e=0;e<t;e++)for(let r=0;r<t;r++){let i=(e*t+r)*4,l=0;if(n[i+3]>90){let t=0xe8d4a51000;for(let n of o){let i=r-n.x,a=e-n.y,o=i*i+a*a;o<t&&(t=o)}let n=Math.sqrt(t);l=n<=c?1:n>=s?0:1-(n-c)/(s-c),l=l*l*(3-2*l)}let u=Math.round(255*l);a.data[i]=a.data[i+1]=a.data[i+2]=u,a.data[i+3]=255}return i.putImageData(a,0,0),r}function Lp(e){let t=hp,n=Object.assign(document.createElement(`canvas`),{width:t,height:t}),r=n.getContext(`2d`),i=r.createImageData(t,t),a=Fp(e);for(let e=0;e<t;e++)for(let n=0;n<t;n++){let r=0xe8d4a51000,o=0xe8d4a51000,s=null,c=null;for(let t of a){let i=n-t.x,a=e-t.y,l=i*i+a*a;l<r?(o=r,c=s,r=l,s=t):l<o&&(o=l,c=t)}let l=0,u=0,d=Math.sqrt(o)-Math.sqrt(r),f=t*.0137;if(c&&d<f){let e=s.x-c.x,t=s.y-c.y,n=Math.hypot(e,t)||1,r=(1-d/f)*.95;l=e/n*r,u=-(t/n)*r}let p=Math.sqrt(Math.max(.05,1-l*l-u*u)),m=(e*t+n)*4;i.data[m]=(l*.5+.5)*255,i.data[m+1]=(u*.5+.5)*255,i.data[m+2]=(p*.5+.5)*255,i.data[m+3]=255}return r.putImageData(i,0,0),n}function Rp(e){let t=hp,n=Pp(e),r=Object.assign(document.createElement(`canvas`),{width:t,height:t}),i=r.getContext(`2d`),a=i.createImageData(t,t),o=Fp(e);if(o.length>=2){let e=cp*t,r=e*(1-.9*lp),i=t*.0102,s=t*.0215;for(let c=0;c<t;c++)for(let l=0;l<t;l++){let u=(c*t+l)*4;if(n[u+3]<=90)continue;let d=0xe8d4a51000,f=0xe8d4a51000;for(let e of o){let t=l-e.x,n=c-e.y,r=t*t+n*n;r<d?(f=d,d=r):r<f&&(f=r)}let p=Math.sqrt(d),m=p<=r?1:p>=e?0:1-(p-r)/(e-r);if(m=m*m*(3-2*m),m<=0)continue;let h=Math.sqrt(f)-p,g=Math.max(0,1-h/i),_=Math.max(0,1-h/s)*.2,v=Math.min(1,g+_)*m;v<=.02||(a.data[u]=Math.round(255*v),a.data[u+1]=Math.round(158*v),a.data[u+2]=Math.round(56*v),a.data[u+3]=255)}}return i.putImageData(a,0,0),r}function zp(e){let t=Rp(e),n=Math.round(hp*mp),r=(n-hp)/2,i=Object.assign(document.createElement(`canvas`),{width:n,height:n}),a=i.getContext(`2d`),o=.5,s=.5;e.sites.length&&(o=e.sites.reduce((e,t)=>e+t.u,0)/e.sites.length,s=1-e.sites.reduce((e,t)=>e+t.v,0)/e.sites.length);let c=r+o*hp,l=r+s*hp;a.globalCompositeOperation=`lighter`;for(let e=1;e<=26;e++){let n=e/26,i=1+n*fp;a.globalAlpha=Math.min(1,.06*dp*(1-n)**pp),a.setTransform(i,0,0,i,c-c*i,l-l*i),a.drawImage(t,r,r)}return a.setTransform(1,0,0,1,0,0),a.globalAlpha=1,i}function Bp(){if(Tp||!vp)return;Tp=!0;let e=new ys(vp);yp.environment=e.fromScene(new $f,.04).texture,yp.environmentIntensity=.45;let t=new ko(14674687,1.8);t.position.set(-1.4,1.8,2),yp.add(t),yp.add(new Ao(2765894,.6))}var Vp=(e,t=!1)=>{let n=new va(e);return t&&(n.colorSpace=dt),n};function Hp(e,t){let n=e[t];if(n){yp.remove(n);for(let e of[`map`,`alphaMap`,`normalMap`])n.material[e]?.dispose?.();n.material.dispose(),e[t]=null}}function Up(e){Bp(),Hp(e,`glass`);let t=new Ba({transmission:1,ior:1.4,thickness:.12,roughness:.03,metalness:0,normalMap:Vp(Lp(e)),normalScale:new R(1.3,1.3),alphaMap:Vp(Ip(e)),transparent:!0,alphaTest:.01,opacity:up,clearcoat:.3,clearcoatRoughness:.2,envMapIntensity:.4,depthTest:!1,depthWrite:!1}),n=new Ui(e.geo,t);n.renderOrder=3,yp.add(n),e.glass=n}function Wp(e){Hp(e,`fire`);let t=new ji({map:Vp(Rp(e),!0),transparent:!1,blending:2,depthTest:!1,depthWrite:!1});t.color.setScalar(0);let n=new Ui(e.geo,t);n.renderOrder=2,yp.add(n),e.fire=n}function Gp(e){Hp(e,`beams`);let t=new ji({map:Vp(zp(e),!0),transparent:!0,blending:2,depthTest:!1,depthWrite:!1,opacity:0}),n=new Ui(new Da(2,2),t);n.renderOrder=4,yp.add(n),e.beams=n}function Kp(e,t){let n=e.geo.attributes.position,r=e.profile;for(let i=0;i<n.count;i++){let a=e.base[i*3],o=e.base[i*3+1],s=(o+1)/2,c=s**+(r.pin??1.6),l=0,u=0;l+=.028*c*r.sway*Math.sin(t*.9+e.seed),l+=.01*c*c*r.sway*Math.sin(t*1.7+1+e.seed*.3);let d=gp(s,.62,.12);l+=a*.02*d*r.breathe*Math.sin(t*2.2+e.seed*.5),u+=.012*d*r.breathe*Math.sin(t*2.2+e.seed*.5),u+=.014*c*r.bob*Math.sin(t*1.1+.4+e.seed),l+=.012*Math.max(0,(s-.8)/.2)*r.head*Math.sin(t*.7+e.seed),l+=.01*Math.max(0,(.45-s)/.45)*c*r.cloth*Math.sin(s*12-t*2.5+e.seed),n.array[i*3]=a+l*rp,n.array[i*3+1]=o+u*rp}n.needsUpdate=!0}function qp(e){return[e.mesh,e.fire,e.glass,e.beams].filter(Boolean)}var Jp=()=>{let e=vp?C(vp.domElement):{left:0,top:0};return{left:e.left,top:e.top}};function Yp(e,t=0,n={left:0,top:0}){let r=t=>{for(let n of qp(e))n.visible=t};if(!e.el.isConnected||!(e.el.checkVisibility?.({visibilityProperty:!0})??!0)){r(!1);return}let i=C(e.el);if(i.width<2||i.height<2){r(!1);return}e.aspect=kp(e.el.querySelector(`.raster-art`),e.tex)||e.aspect||1;let{w:a,h:o}=Ap(i.width,i.height,e.aspect),s=(e.profile.float||0)*Math.sin(t*1.15+e.seed*.7)*12*rp,c=i.left-n.left+i.width/2-Cp/2,l=-(i.top-n.top+i.height/2-wp/2)+s,u=(e.flip?-1:1)*a/2,d=o/2;r(!0);let f=Math.round(i.bottom);[e.mesh,e.fire,e.glass,e.beams].filter(Boolean).forEach((e,t)=>{e.renderOrder=f*4+t});let p=0;for(let t of qp(e)){t.position.set(c,l,p);let n=t===e.beams?mp:1;t.scale.set(u*n,d*n,1),p+=.01}}function Xp(){Cp=_(),wp=v(),vp.setPixelRatio(Math.min(devicePixelRatio*y(),2)),vp.setSize(Cp,wp,!1),bp.left=-Cp/2,bp.right=Cp/2,bp.top=wp/2,bp.bottom=-wp/2,bp.updateProjectionMatrix()}function Zp(e){if(!xp.length)return;let t=e*.001,n=Jp();for(let e of xp)Kp(e,t),Yp(e,t,n);vp.render(yp,bp)}function Qp(){let e=document.getElementById(`mesh`);!e||vp||(vp=new fu({canvas:e,alpha:!0,antialias:!0,powerPreference:`high-performance`}),vp.setClearColor(0,0),vp.toneMapping=4,vp.toneMappingExposure=1.1,yp=new sr,bp=new Do(-1,1,1,-1,.1,100),bp.position.z=10,Xp(),addEventListener(`resize`,Xp))}function $p(e){e.el?.classList.remove(`mesh-live`),Hp(e,`glass`),Hp(e,`fire`),Hp(e,`beams`),yp.remove(e.mesh),e.geo.dispose(),e.mesh.material.dispose()}function em(){cancelAnimationFrame(Sp),Sp=0;for(let e of xp)$p(e);xp=[],document.documentElement.classList.remove(`mesh-on`),vp?.render(yp,bp)}function tm(e){let t=xp.findIndex(t=>t.el===e||t.el&&e.contains&&e.contains(t.el));t<0||($p(xp[t]),xp.splice(t,1),xp.length||document.documentElement.classList.remove(`mesh-on`),vp?.render(yp,bp))}function nm(e,t=160){let n=am(e);n&&(n.mat.uniforms.uFlash.value=.9,setTimeout(()=>{n.mat&&(n.mat.uniforms.uFlash.value=0)},t))}var rm=56,im=e=>Math.max(.05,Math.min(.95,e));function am(e){return xp.find(t=>t.el===e||e.contains&&e.contains(t.el))}function om(e,t=.32+Math.random()*.36,n=.3+Math.random()*.4){if(op)return!1;let r=am(e);if(!r||!Pp(r))return!1;let i=5+(Math.random()*3|0);for(let e=0;e<i;e++){let e=Math.random()*Math.PI*2,i=Math.random()*.052;if(r.sites.length>=rm)break;r.sites.push({u:im(t+Math.cos(e)*i),v:im(n+Math.sin(e)*i)})}return r.mat.uniforms.uCut.value===0&&(r.mat.uniforms.uCut.value=.35,r.mat.transparent=!1,r.mat.needsUpdate=!0),Up(r),r.death>0&&Wp(r),!0}function sm(e,t){if(op)return!1;let n=am(e);return n?(t>0&&!n.fire&&(Wp(n),Gp(n)),n.death=t,n.fire&&n.fire.material.color.setScalar(t),n.beams&&(n.beams.material.opacity=Math.min(1,Math.max(0,t*1.35-.35))),!0):!1}function cm(e){let t=am(e);return t?t.sites.map(e=>({u:e.u,v:e.v})):[]}function lm(e){let t=am(e);if(!t||!vp||op)return null;let n=performance.now()*.001,r=Jp(),i=new Set(qp(t)),a=[];yp.traverse(e=>{e.isMesh&&(a.push([e,e.visible]),e.visible=i.has(e)&&e!==t.beams)}),Kp(t,n),Yp(t,n,r),t.beams&&(t.beams.visible=!1),vp.render(yp,bp);for(let[e,t]of a)e.visible=t;let o=C(t.el),{w:s,h:c}=Ap(o.width,o.height,t.aspect),l=vp.getPixelRatio(),u=(o.left-r.left+o.width/2-s/2)*l,d=(o.top-r.top+o.height/2-c/2)*l,f=Math.max(1,Math.round(s*l)),p=Math.max(1,Math.round(c*l)),m=document.createElement(`canvas`);m.width=f,m.height=p,m.getContext(`2d`).drawImage(vp.domElement,u,d,f,p,0,0,f,p);let h=cm(e),g={left:o.left,top:o.top,width:o.width,height:o.height},_=t.beams;if(_){t.beams=null;let e=performance.now(),n=_.material.opacity,r=t=>{let i=Math.min(1,(t-e)/200);_.material.opacity=n*(1-i),i<1?(xp.length||vp?.render(yp,bp),requestAnimationFrame(r)):(yp.remove(_),_.material.map?.dispose(),_.material.dispose(),vp?.render(yp,bp))};requestAnimationFrame(r)}return tm(e),{capture:m.toDataURL(`image/png`),sites:h,rect:g}}function um(e){if(em(),!sp()||(vp||Qp(),!vp))return;for(let{el:t,url:n,kind:r,flip:i}of e){if(!n||!t)continue;let e=t.querySelector(`.raster-art`);if(!e)continue;t.classList.add(`mesh-live`);let a=_p[r]||_p.humanoid,o=Np(n,a,Math.random()*10,e);o.el=t,o.flip=!!i,o.profile=a,xp.push(o)}if(!xp.length)return;document.documentElement.classList.add(`mesh-on`);let t=e=>{Sp=requestAnimationFrame(t),Zp(e)};Sp=requestAnimationFrame(t)}function dm(e){let t=am(e);if(!t)return 0;let n=performance.now()*.001;return Math.max(0,(t.profile.float||0)*Math.sin(n*1.15+t.seed*.7)*12*rp)}var fm=()=>({enabled:sp(),planes:xp.length,renderer:!!vp,looping:!!Sp,intensity:rp,sites:xp.reduce((e,t)=>Math.max(e,t.sites.length),0),death:xp.reduce((e,t)=>Math.max(e,t.death),0),glass:xp.filter(e=>e.glass).length}),pm=t({MAP_COLS:()=>7,MAP_ROWS:()=>15,addCardToDeck:()=>Eh,addStatus:()=>qm,applyEventOps:()=>Lh,availableNodes:()=>Dm,canKindle:()=>rh,canPlay:()=>mh,canUseArt:()=>eh,cardData:()=>wm,cardPool:()=>jm,claimMonument:()=>km,clamp:()=>_m,clearSave:()=>Ph,drawCards:()=>uh,duplicateCardInDeck:()=>kh,effCost:()=>ph,endTurn:()=>yh,enemyMove:()=>Ym,gainEmbers:()=>Xm,gainPotion:()=>Im,gainRelic:()=>Pm,genCombatRewards:()=>zm,genMap:()=>Em,genShop:()=>Vm,hasRelic:()=>Am,healPlayer:()=>Nm,kindleFromHand:()=>ah,loadRun:()=>Nh,loadStats:()=>Fh,makeCard:()=>Cm,makeRng:()=>mm,newRun:()=>vm,omenMods:()=>xm,playCard:()=>hh,previewAttack:()=>Sh,previewBlock:()=>Ch,previewEnemyDmg:()=>wh,previewPlay:()=>Th,randomRelic:()=>Fm,recordRunEnd:()=>Ih,relicPool:()=>Mm,removeCardFromDeck:()=>Dh,restHealFrac:()=>Sm,rollBossRelics:()=>Bm,rollCardReward:()=>Lm,rollEncounter:()=>Um,rollEvent:()=>Hm,rollEventCards:()=>Rm,rollOmen:()=>bm,runRng:()=>Tm,saveRun:()=>Mh,startCombat:()=>Wm,upgradeCardInDeck:()=>Oh,useArt:()=>th,usePotion:()=>vh,visitNode:()=>Om,vowMods:()=>ym});function mm(e){let t=()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296};return t.getState=()=>e,t}var hm=(e,t)=>t[Math.floor(e()*t.length)],gm=(e,[t,n])=>t+Math.floor(e()*(n-t+1)),_m=(e,t,n)=>Math.max(t,Math.min(n,e));function vm(e=Math.random()*2**31|0,t={}){let n=_m(t.aspect||0,0,Wu.length-1),r=Wu[n],i={v:2,seed:e,rngState:e,uid:1,act:0,nodeId:null,floorsClimbed:0,aspect:n,vow:_m(t.vow||0,0,Gu.length),art:t.art||r.art||`flare`,omens:[],boon:t.boon||null,unlocks:[...t.unlocks||[]],monument:t.monument?{...t.monument,claimed:!1}:null,player:{hp:r.maxHp,maxHp:r.maxHp,gold:r.startGold,energyMax:r.energy,relics:[r.startRelic],potions:Array(r.potionSlots||3).fill(null),deck:[]},stats:{slain:0,elites:0,bosses:0,dmgDealt:0,dmgTaken:0,cardsPlayed:0,goldEarned:0,shatters:0,kindles:0,perfects:0,smolderKills:0,unlitVisited:0,embersSpent:0,start:Date.now()},map:null};t.lamplighter&&(i.pendingLamplighter=!0);for(let e of r.startDeck)i.player.deck.push(Cm(i,e));return ym(i).startHex&&i.player.deck.push(Cm(i,`hex`)),i.omens.push(bm(i)),i.map=Em(i),i}function ym(e){let t={hpMult:1,enemyDmgBonus:0,bossFacetDelta:0,startHex:!1},n=_m(e.vow||0,0,Gu.length);for(let e=0;e<n;e++){let n=Gu[e].mods;n.hpMult&&(t.hpMult*=n.hpMult),n.enemyDmgBonus&&(t.enemyDmgBonus+=n.enemyDmgBonus),n.bossFacetDelta&&(t.bossFacetDelta+=n.bossFacetDelta),n.startHex&&(t.startHex=!0),n.restHealFrac!=null&&(t.restHealFrac=Math.min(t.restHealFrac??1,n.restHealFrac))}return t}function bm(e){return hm(Tm(e),Object.keys(Bu))}function xm(e){return Bu[e.omens?.[e.act]]?.mods||{}}function Sm(e){return Math.min(.3,xm(e).restHealFrac??.3,ym(e).restHealFrac??.3)}function Cm(e,t,n=!1){return{uid:e.uid++,id:t,up:n,bonus:0}}function wm(e){let t=ku[e.id];return e.up&&t.up?{...t,...t.up,name:t.name+`+`}:t}function Tm(e){let t=mm(e.rngState);return()=>{let n=t();return e.rngState=t.getState(),n}}function Em(e){let t=Tm(e),n={},r=(e,t)=>`${e},${t}`,i=(e,i)=>(n[r(e,i)]||(n[r(e,i)]={id:r(e,i),row:e,col:i,type:`monster`,next:[],jx:(t()-.5)*.5,jy:(t()-.5)*.4}),n[r(e,i)]),a=new Set;for(let e=0;e<6;e++){let n;do n=Math.floor(t()*7);while(e<2&&a.has(n));a.add(n);let r=i(0,n);for(let e=1;e<14;e++){let n=_m(r.col+(Math.floor(t()*3)-1),0,6),a=i(e,n);r.next.includes(a.id)||r.next.push(a.id),r=a}let o=i(14,3);r.next.includes(o.id)||r.next.push(o.id)}let o=Object.values(n),s=!1;for(let e of o){if(e.row===0)e.type=`monster`;else if(e.row===14)e.type=`boss`;else if(e.row===13)e.type=`rest`;else if(e.row===8)e.type=`treasure`;else{let n=t();n<.46?e.type=`monster`:n<.68?e.type=`event`:n<.81&&e.row>=5?e.type=`elite`:n<.91&&e.row>=4&&e.row<12?e.type=`rest`:e.row>=4?e.type=`shop`:e.type=`monster`}e.type===`shop`&&(s=!0)}if(!s){let e=o.filter(e=>e.type===`monster`&&e.row>=5&&e.row<=11);e.length&&(hm(t,e).type=`shop`)}for(let n of o)n.row===0||n.row===8||n.row>=13||t()<.15&&(n.unlit=!0,n.bounty=gm(t,[12,22])+e.act*6);if(e.monument&&!e.monument.claimed&&e.monument.act===e.act){let t=_m(e.monument.row||5,1,12),n=o.filter(e=>e.type===`shop`).length===1,r=o.filter(e=>e.row>0&&e.row<13&&e.row!==8&&e.type!==`boss`&&!(n&&e.type===`shop`));if(r.length){let e=r.reduce((e,n)=>Math.abs(n.row-t)<Math.abs(e.row-t)?n:e);e.type=`monument`,delete e.unlit,delete e.bounty}}return{nodes:o,visited:[]}}function Dm(e){let{nodes:t,visited:n}=e.map;if(!e.nodeId)return t.filter(e=>e.row===0);let r=t.find(t=>t.id===e.nodeId);return t.filter(e=>r.next.includes(e.id))}function Om(e,t){e.nodeId=t.id,e.floorsClimbed=t.row+1,e.map.visited.includes(t.id)||e.map.visited.push(t.id);let n=0;return t.unlit&&(delete t.unlit,n=(t.bounty||0)*(Am(e,`thiefOfWicks`)?2:1),delete t.bounty,e.player.gold+=n,e.stats.goldEarned+=n,e.stats.unlitVisited++),{type:t.type,bounty:n}}function km(e){let t=e.monument;if(!t||t.claimed||!t.bequest)return null;t.claimed=!0;let n=t.bequest;return n.kind===`card`?Eh(e,n.id,n.up):n.kind===`relic`?Pm(e,n.id):n.kind===`gold`&&(e.player.gold+=n.amount,e.stats.goldEarned+=n.amount),n}var Am=(e,t)=>e.player.relics.includes(t);function jm(e,t){let n=(e.unlocks||[]).filter(e=>e.startsWith(`card:`)).map(e=>e.slice(5)).filter(e=>ku[e]&&ku[e].rarity===t);return n.length?[...Au[t],...n]:Au[t]}function Mm(e,t){let n=(e.unlocks||[]).filter(e=>e.startsWith(`relic:`)).map(e=>e.slice(6)).filter(e=>Mu[e]&&Mu[e].rarity===t);return n.length?[...Nu[t],...n]:Nu[t]}function Nm(e,t,n=null){Am(e,`sunBlossom`)&&(t=Math.round(t*1.5));let r=n?n.player:e.player,i=r.hp;r.hp=_m(r.hp+t,0,r.maxHp);let a=r.hp-i;return n&&a>0&&n.queue.push({t:`heal`,who:`player`,n:a}),a}function Pm(e,t,n=null){let r=Mu[t];if(r){if(r.replaces){let t=e.player.relics.indexOf(r.replaces);t>=0&&e.player.relics.splice(t,1)}e.player.relics.push(t),t===`sweetRoot`&&(e.player.maxHp+=8,e.player.hp+=8),t===`hollowCrown`&&(e.player.energyMax+=1,e.player.maxHp=Math.max(1,e.player.maxHp-10),e.player.hp=Math.min(e.player.hp,e.player.maxHp))}}function Fm(e,t={common:.5,uncommon:.35,rare:.15}){let n=Tm(e),r=new Set(e.player.relics),i=[`common`,`uncommon`,`rare`],a=n(),o=`common`,s=0;for(let e of i)if(s+=t[e]||0,a<s){o=e;break}let c=i.indexOf(o);for(let t=0;t<i.length;t++){let a=i[(c+t)%i.length],o=Mm(e,a).filter(e=>!r.has(e));if(o.length)return hm(n,o)}return null}function Im(e,t){t===`random`&&(t=hm(Tm(e),Object.keys(Pu)));let n=e.player.potions.indexOf(null);return n<0?!1:(e.player.potions[n]=t,!0)}function Lm(e,t=`normal`){let n=Tm(e),r=3+ +!!Am(e,`seersOrb`)+(xm(e).rewardChoiceBonus||0),i=[],a=new Set;for(;i.length<r&&a.size<40;){let r;if(t===`boss`)r=`rare`;else{let e=n();r=t===`elite`?e<.45?`common`:e<.85?`uncommon`:`rare`:e<.6?`common`:e<.92?`uncommon`:`rare`}let o=hm(n,jm(e,r));a.add(o+Math.floor(n()*4)),i.includes(o)||i.push(o)}return i}function Rm(e,t){let n=Tm(e),r=[...jm(e,`common`),...jm(e,`common`),...jm(e,`uncommon`),...jm(e,`uncommon`),...jm(e,`rare`)],i=[],a=0;for(;i.length<t&&a++<60;){let e=r[Math.floor(n()*r.length)];i.includes(e)||i.push(e)}return i}function zm(e,t,n=null){let r=Tm(e),i=gm(r,Ru[e.act][t===`boss`?`boss`:t===`elite`?`elite`:`normal`]);i=Math.round(i*(xm(e).goldMult||1)*(Vu[n]?.mods.goldMult||1));let a={gold:i,cards:Lm(e,t),potion:null,relic:null};return t!==`boss`&&r()<.4&&(a.potion=hm(r,Object.keys(Pu))),t===`elite`&&(a.relic=Fm(e)),a}function Bm(e){let t=Tm(e),n=new Set(e.player.relics),r=Mm(e,`boss`).filter(e=>!n.has(e)),i=[];for(;i.length<Math.min(3,r.length);){let e=hm(t,r);i.includes(e)||i.push(e)}return i}function Vm(e){let t=Tm(e),n=([e,n],r)=>Math.round(gm(t,[e,n])*r),r=(Am(e,`merchantsMark`)?.75:1)*(xm(e).shopMult||1),i=[];for(let a of[`common`,`common`,`uncommon`,`uncommon`,`rare`]){let o,s=0;do o=hm(t,jm(e,a));while(i.some(e=>e.id===o)&&++s<20);i.push({id:o,price:n(zu.cardPrice[a],r),sold:!1})}let a=new Set(e.player.relics),o=[];for(let i of[`common`,`uncommon`]){let s=Mm(e,i).filter(e=>!a.has(e)&&!o.some(t=>t.id===e));s.length&&o.push({id:hm(t,s),price:n(zu.relicPrice[i],r),sold:!1})}let s=[];for(let e=0;e<2;e++)s.push({id:hm(t,Object.keys(Pu)),price:n(zu.potionPrice,r),sold:!1});return{cards:i,relics:o,potions:s,removeCost:Math.round(zu.removeCost*r),removed:!1}}function Hm(e){let t=Tm(e),n=e.seenEvents||=[],r=Object.keys(Lu).filter(e=>!n.includes(e));r.length||(e.seenEvents=[],r=Object.keys(Lu));let i=hm(t,r);return n.push(i),i}function Um(e,t,n){let r=Tm(e),i=Iu[e.act],a=t===`boss`?i.boss:t===`elite`?i.elite:n<3?i.weak:i.normal,o=e.lastEnc,s,c=0;do s=hm(r,a);while(a.length>1&&s.join()===o&&++c<8);return e.lastEnc=s.join(),s}function Wm(e,t,n=`normal`,r={}){let i=Tm(e),a=xm(e),o=ym(e),s=n===`elite`?r.affix||hm(i,Object.keys(Vu)):null,c=s?Vu[s].mods:{},l={kind:n,affix:s,turn:0,over:!1,result:null,queue:[],player:{hp:e.player.hp,maxHp:e.player.maxHp,block:0,energy:0,energyMax:e.player.energyMax,statuses:{}},enemies:t.map((e,t)=>{let n=Fu[e];return{key:e,idx:t,name:n.name,maxHp:Math.round(gm(i,n.hp)*(a.hpMult||1)*(c.hpMult||1)*(o.hpMult||1)),block:c.startBlock||0,statuses:{...n.startStatus||{}},flags:c.adamant?{adamant:!0}:{},lastMoves:[],moveKey:null,elite:!!n.elite,boss:!!n.boss,facetMax:Math.max(2,(n.facets??(n.boss?6:n.elite?5:4))+(a.facetDelta||0)+(c.facetDelta||0)+(n.boss&&o.bossFacetDelta||0)),chips:0}}),draw:[],hand:[],discard:[],exhaust:[],embers:0,emberCap:9,artUsedTurn:0,kindledTurn:0,kindlesThisTurn:0,pendingChips:null,counters:{played:0,attacks:0,firstCardPlayed:!1,hpLost:0}};l.enemies.forEach(e=>e.hp=e.maxHp);for(let e of l.enemies)for(let[t,n]of Object.entries({...a.enemyStartStatus||{},...c.startStatus||{}}))e.statuses[t]=(e.statuses[t]||0)+n;a.startEmbers&&(l.embers=_m(a.startEmbers,0,l.emberCap)),l.draw=e.player.deck.map(e=>({...e,bonus:0})),Gm(i,l.draw);let u=l.player;return Am(e,`basaltIdol`)&&(u.block+=10,Km(l,`basaltIdol`)),Am(e,`warFetish`)&&(qm(l,u,`str`,1),Km(l,`warFetish`)),Am(e,`riverPearl`)&&(qm(l,u,`dex`,1),Km(l,`riverPearl`)),Am(e,`thornBand`)&&(qm(l,u,`thorns`,2),Km(l,`thornBand`)),Am(e,`vialOfLife`)&&(Nm(e,2,l),Km(l,`vialOfLife`)),Am(e,`crownOfCinders`)&&(l.emberCap=12,l.embers=_m(l.embers+2,0,l.emberCap),Km(l,`crownOfCinders`)),Am(e,`shatterersCrown`)&&(l.enemies.forEach(e=>{e.facetMax=Math.max(2,e.facetMax-1),e.statuses.str=(e.statuses.str||0)+1}),Km(l,`shatterersCrown`)),Am(e,`smolderingCoal`)&&(l.enemies.forEach(e=>e.statuses.poison=(e.statuses.poison||0)+2),Km(l,`smolderingCoal`)),Am(e,`ashenCore`)&&(l.enemies.forEach(e=>e.statuses.poison=(e.statuses.poison||0)+3),Km(l,`ashenCore`)),Jm(e,l),fh(e,l),l}function Gm(e,t){for(let n=t.length-1;n>0;n--){let r=Math.floor(e()*(n+1));[t[n],t[r]]=[t[r],t[n]]}}function Km(e,t){e.queue.push({t:`relicProc`,id:t})}function qm(e,t,n,r){t.statuses[n]=(t.statuses[n]||0)+r,t.statuses[n]===0&&delete t.statuses[n],e.queue.push({t:`status`,who:t===e.player?`player`:t.idx,id:n,n:r})}function Jm(e,t){let n=Tm(e);for(let e of t.enemies)e.hp<=0||(e.moveKey=Fu[e.key].ai({turn:t.turn+1,last:e.lastMoves[e.lastMoves.length-1],prev:e.lastMoves[e.lastMoves.length-2],rng:n,hpFrac:e.hp/e.maxHp,self:e}),t.queue.push({t:`intent`,idx:e.idx,move:e.moveKey}))}function Ym(e){return Fu[e.key].moves[e.moveKey]}function Xm(e,t,n){let r=_m(t.embers+n,0,t.emberCap),i=r-t.embers;return i?(t.embers=r,t.queue.push({t:`ember`,n:i,total:t.embers}),i):0}function Zm(e,t,n,r){if(!(t.over||n.hp<=0||r<=0))for(n.chips+=r,t.queue.push({t:`chip`,idx:n.idx,n:r,chips:Math.min(n.chips,n.facetMax),facetMax:n.facetMax});n.chips>=n.facetMax&&n.hp>0;)n.chips-=n.facetMax,Qm(e,t,n)}function Qm(e,t,n){if(n.facetMax+=1,n.flags.adamant&&!n.flags.adamantSpent){n.flags.adamantSpent=!0,t.queue.push({t:`adamantHold`,idx:n.idx});return}e.stats.shatters++,n.flags.staggered=!0,t.queue.push({t:`shatter`,idx:n.idx,facetMax:n.facetMax}),qm(t,n,`vulnerable`,2),Xm(e,t,2),Am(e,`prismCharm`)&&!t.prismProcd&&(t.prismProcd=!0,Xm(e,t,2),Km(t,`prismCharm`));let r=n.statuses.poison||0;if(r&&t.enemies.some(e=>e!==n&&e.hp>0)&&(delete n.statuses.poison,$m(e,t,n,r)),Am(e,`bellOfEndings`)){Km(t,`bellOfEndings`);for(let r of t.enemies.filter(e=>e!==n&&e.hp>0)){if(t.over)break;oh(e,t,r,4,{isAttack:!1})}}}function $m(e,t,n,r){if(!r)return;let i=t.enemies.filter(e=>e!==n&&e.hp>0);if(!i.length)return;let a=hm(Tm(e),i);qm(t,a,`poison`,r),t.queue.push({t:`smolderJump`,from:n.idx,to:a.idx,n:r})}function eh(e,t){let n=Hu[e.art];return!!n&&!t.over&&t.artUsedTurn!==t.turn&&t.embers>=n.cost}function th(e,t){if(!eh(e,t))return!1;let n=Hu[e.art];t.artUsedTurn=t.turn,e.stats.embersSpent+=n.cost,Xm(e,t,-n.cost),t.queue.push({t:`art`,id:e.art});for(let r of n.effects){if(t.over)break;nh(e,t,r)}return!0}function nh(e,t,n){let r=t.player,i=()=>t.enemies.filter(e=>e.hp>0);switch(n.kind){case`dmg`:for(let r of i())t.over||oh(e,t,r,n.n,{isAttack:!1});break;case`status`:if(n.who===`self`)qm(t,r,n.id,n.n);else for(let e of i())qm(t,e,n.id,n.n);break;case`block`:lh(e,t,r,n.n,!1);break;case`heal`:Nm(e,n.n,t);break;case`energy`:r.energy+=n.n,t.queue.push({t:`energy`,n:r.energy});break;case`draw`:uh(e,t,n.n);break;case`chip`:for(let r of i())Zm(e,t,r,n.n);break;case`ember`:Xm(e,t,n.n);break}}function rh(e,t,n){return!n||t.over||wm(n).type===`curse`?!1:!(t.kindledTurn===t.turn&&t.kindlesThisTurn>=ih(e))}function ih(e){return Am(e,`crownOfTithes`)?2:1}function ah(e,t,n){let r=t.hand.findIndex(e=>e.uid===n);if(r<0)return!1;let i=t.hand[r];return rh(e,t,i)?(t.kindledTurn!==t.turn&&(t.kindledTurn=t.turn,t.kindlesThisTurn=0),t.kindlesThisTurn++,t.hand.splice(r,1),e.stats.kindles++,t.queue.push({t:`kindle`,uid:i.uid,id:i.id}),dh(e,t,i),Am(e,`crownOfTithes`)&&(lh(e,t,t.player,3,!1),Km(t,`crownOfTithes`)),!0):!1}function oh(e,t,n,r,{isAttack:i=!0,mult:a=1}={}){if(n.hp<=0||t.over)return 0;let o=t.player,s=r;i&&(s+=o.statuses.str||0,o.statuses.weak&&(s=Math.floor(s*.75)),n.statuses.vulnerable&&(s=Math.floor(s*1.5))),s=Math.max(0,Math.floor(s*a));let c=Math.min(n.block,s);n.block-=c;let l=s-c;if(n.hp-=l,e.stats.dmgDealt+=l,t.queue.push({t:`hitEnemy`,idx:n.idx,amount:l,blocked:c,hpAfter:Math.max(0,n.hp),dead:n.hp<=0,killingBlow:n.hp<=0&&l>0,overkill:Math.max(0,-n.hp)}),t.pendingChips&&i&&l>0){let e=t.pendingChips.get(n.idx)||{hit:!1,extra:0};e.hit=!0,t.pendingChips.set(n.idx,e)}return i&&n.statuses.thorns&&n.hp>0&&ch(e,t,n.statuses.thorns,{source:`thorns`,isAttack:!1}),n.hp<=0&&sh(e,t,n),l}function sh(e,t,n){n.hp=0;let r=n.statuses.poison||0;if(n.statuses={},n.flags.staggered=!1,t.queue.push({t:`die`,idx:n.idx}),e.stats.slain++,n.elite&&e.stats.elites++,n.boss&&e.stats.bosses++,t.enemies.every(e=>e.hp<=0)){bh(e,t);return}Xm(e,t,1),$m(e,t,n,r),Am(e,`reapersBell`)&&(t.player.energy+=1,uh(e,t,1),Km(t,`reapersBell`),t.queue.push({t:`energy`,n:t.player.energy}))}function ch(e,t,n,{source:r=`self`,isAttack:i=!1,attacker:a=null}={}){if(t.over)return 0;let o=t.player,s=n;i&&a&&(s+=(a.statuses.str||0)+(a.flags.rampBonus||0)+(xm(e).enemyDmgBonus||0)+(ym(e).enemyDmgBonus||0),a.statuses.weak&&(s=Math.floor(s*.75)),o.statuses.vulnerable&&(s=Math.floor(s*1.5)),Am(e,`wardingCharm`)&&s<=5&&s>0&&(s=1,Km(t,`wardingCharm`))),s=Math.max(0,s);let c=0;(i||r===`thorns`)&&(c=Math.min(o.block,s),o.block-=c);let l=s-c;if(o.hp-=l,e.stats.dmgTaken+=Math.max(0,l),t.counters.hpLost+=Math.max(0,l),t.queue.push({t:`hitPlayer`,amount:l,blocked:c,hpAfter:Math.max(0,o.hp),source:r}),o.hp<=0)return xh(e,t),l;if(i&&a){let n={...xm(e).playerHitApplies||{},...t.affix&&Vu[t.affix].mods.attackApplies||{}};for(let[e,r]of Object.entries(n))qm(t,o,e,r);o.statuses.thorns&&a.hp>0&&oh(e,t,a,o.statuses.thorns,{isAttack:!1})}return l}function lh(e,t,n,r,i=!0){let a=r;return n===t.player&&i&&(a+=n.statuses.dex||0,n.statuses.frail&&(a=Math.floor(a*.75))),a=Math.round(Math.max(0,a)*(xm(e).wardMult||1)),n.block+=a,t.queue.push({t:`blockGain`,who:n===t.player?`player`:n.idx,n:a,total:n.block}),a}function uh(e,t,n){let r=Tm(e);for(let e=0;e<n&&!(t.hand.length>=10);e++){if(!t.draw.length){if(!t.discard.length)break;t.draw=t.discard,t.discard=[],Gm(r,t.draw),t.queue.push({t:`reshuffle`})}let e=t.draw.pop();t.hand.push(e),t.queue.push({t:`draw`,uid:e.uid,id:e.id})}}function dh(e,t,n){t.exhaust.push(n),t.queue.push({t:`exhaust`,uid:n.uid}),Xm(e,t,1),Am(e,`verdantBranch`)&&(uh(e,t,1),Km(t,`verdantBranch`))}function fh(e,t){if(t.over)return;t.turn++;let n=t.player;if(t.queue.push({t:`turn`,n:t.turn}),n.statuses.poison&&(ch(e,t,n.statuses.poison,{source:`poison`}),n.statuses.poison--,n.statuses.poison||delete n.statuses.poison,t.over))return;n.statuses.barricade||(n.block=0),n.statuses.ritual&&qm(t,n,`str`,n.statuses.ritual),n.statuses.emberflow&&Xm(e,t,n.statuses.emberflow);let r=n.energyMax+(n.statuses.energized||0);t.turn===1&&Am(e,`emberLantern`)&&(r+=1,Km(t,`emberLantern`)),n.energy=(Am(e,`frozenCore`)?n.energy:0)+r,t.counters.firstCardPlayed=!1,t.queue.push({t:`energy`,n:n.energy});let i=5+(n.statuses.nightsight||0)+(xm(e).drawDelta||0);t.turn===1&&Am(e,`travelersPack`)&&(i+=2,Km(t,`travelersPack`)),uh(e,t,Math.max(1,i))}function ph(e,t,n){let r=wm(n);return r.cost==null?null:Am(e,`duskmirror`)&&!t.counters.firstCardPlayed?0:xm(e).firstCardDiscount&&!t.counters.firstCardPlayed?Math.max(0,r.cost-xm(e).firstCardDiscount):r.cost}function mh(e,t,n,r){if(t.over)return!1;let i=wm(n);return!(i.unplayable||ph(e,t,n)>t.player.energy||i.target===`enemy`&&(r==null||!t.enemies[r]||t.enemies[r].hp<=0))}function hh(e,t,n,r=null){let i=t.hand.findIndex(e=>e.uid===n);if(i<0)return!1;let a=t.hand[i],o=wm(a);if(!mh(e,t,a,r))return!1;let s=t.player,c=ph(e,t,a);s.energy-=c,Am(e,`duskmirror`)&&!t.counters.firstCardPlayed&&o.cost>0&&Km(t,`duskmirror`),t.counters.firstCardPlayed=!0,t.hand.splice(i,1),t.counters.played++,e.stats.cardsPlayed++,t.queue.push({t:`play`,uid:a.uid,id:a.id,targetIdx:r}),t.queue.push({t:`energy`,n:s.energy});let l=1;o.type===`attack`&&(t.counters.attacks++,Am(e,`ironTalisman`)&&t.counters.attacks%3==0&&(qm(t,s,`str`,1),Km(t,`ironTalisman`)),Am(e,`executionersSeal`)&&t.counters.attacks%10==0&&(l=2,Km(t,`executionersSeal`)));let u=r==null?null:t.enemies[r],d=()=>t.enemies.filter(e=>e.hp>0);t.pendingChips=new Map;for(let n of o.effects){if(t.over)break;gh(e,t,a,o,n,u,l)}if(t.pendingChips&&!t.over){let n=o.type===`attack`?1+(o.chip||0)+(s.statuses.beacon||0):0;for(let[r,i]of t.pendingChips){let a=t.enemies[r];if(!a||a.hp<=0||t.over)continue;let o=(i.hit?n:0)+i.extra;o>0&&Zm(e,t,a,o)}}if(t.pendingChips=null,!t.over&&o.type===`attack`&&s.statuses.venomous){let e=o.target===`allEnemies`?d():u&&u.hp>0?[u]:[];for(let n of e)qm(t,n,`poison`,s.statuses.venomous)}return!t.over&&Am(e,`silkFan`)&&t.counters.played%3==0&&(lh(e,t,s,3,!1),Km(t,`silkFan`)),o.type===`power`?t.queue.push({t:`powerConsumed`,uid:a.uid}):o.exhaust?dh(e,t,a):t.discard.push(a),!0}function gh(e,t,n,r,i,a,o){let s=t.player,c=r.target===`allEnemies`?t.enemies.filter(e=>e.hp>0):a?[a]:[];switch(i.kind){case`dmg`:{let n=i.times||1;for(let a=0;a<n;a++)for(let n of r.target===`allEnemies`?t.enemies.filter(e=>e.hp>0):c){if(t.over)return;oh(e,t,n,i.n,{mult:o})}break}case`block`:lh(e,t,s,i.n);break;case`draw`:uh(e,t,i.n);break;case`energy`:s.energy+=i.n,t.queue.push({t:`energy`,n:s.energy});break;case`heal`:Nm(e,i.n,t);break;case`loseHp`:ch(e,t,i.n,{source:`self`});break;case`status`:if(i.who===`self`)qm(t,s,i.id,i.n);else if(i.who===`allEnemies`)for(let e of t.enemies.filter(e=>e.hp>0))qm(t,e,i.id,i.n);else a&&a.hp>0&&qm(t,a,i.id,i.n);break;case`addCard`:for(let n=0;n<(i.n||1);n++){let n={uid:e.uid++,id:i.id,up:!1,bonus:0};(i.where===`hand`&&t.hand.length<10?t.hand:t.discard).push(n),t.queue.push({t:`addCard`,id:i.id,where:i.where||`discard`})}break;case`chip`:for(let n of c)if(!(n.hp<=0))if(t.pendingChips){let e=t.pendingChips.get(n.idx)||{hit:!1,extra:0};e.extra+=i.n,t.pendingChips.set(n.idx,e)}else Zm(e,t,n,i.n);break;case`ember`:Xm(e,t,i.n);break;case`special`:_h(e,t,n,r,i,a,o)}}function _h(e,t,n,r,i,a,o){let s=t.player;switch(i.id){case`leech`:{let n=oh(e,t,a,i.n,{mult:o});n>0&&Nm(e,Math.floor(n/2),t);break}case`execute`:{let n=a.statuses.vulnerable?i.bonus:0;oh(e,t,a,i.n+n,{mult:o});break}case`momentum`:oh(e,t,a,i.n+n.bonus,{mult:o}),n.bonus+=i.grow;break;case`phantom`:oh(e,t,a,i.n*t.hand.length,{mult:o});break;case`devour`:oh(e,t,a,i.n,{mult:o}),a.hp<=0&&(t.over?Nm(e,i.heal):(Xm(e,t,i.embers),Nm(e,i.heal,t)));break;case`doubleBlock`:lh(e,t,s,s.block,!1);break;case`catalyst`:a.statuses.poison&&qm(t,a,`poison`,a.statuses.poison*(i.n-1));break;case`shatterEcho`:{let n=a.flags.staggered||a.statuses.vulnerable?2:1;oh(e,t,a,i.n*n,{mult:o});break}case`emberNova`:oh(e,t,a,i.n*t.embers,{mult:o});break;case`pyreTithe`:for(let r of[...t.hand]){if(r===n)continue;let i=t.hand.indexOf(r);t.hand.splice(i,1),t.queue.push({t:`kindle`,uid:r.uid,id:r.id}),dh(e,t,r)}uh(e,t,i.draw);break;case`flawless`:lh(e,t,s,i.n),t.counters.hpLost===0&&lh(e,t,s,i.n);break;case`emberdance`:{let n=t.embers;n>0&&(e.stats.embersSpent+=n,Xm(e,t,-n),lh(e,t,s,i.n*n,!1));break}}}function vh(e,t,n,r=null){let i=e.player.potions[n];if(!i)return!1;let a=Pu[i];if(a.combatOnly&&(!t||t.over)||a.needsTarget&&(r==null||!t.enemies[r]||t.enemies[r].hp<=0))return!1;switch(e.player.potions[n]=null,t&&t.queue.push({t:`potion`,id:i}),i){case`healing`:Nm(e,20,t),t||(e.player.hp=_m(e.player.hp,0,e.player.maxHp));break;case`strength`:qm(t,t.player,`str`,2);break;case`swift`:uh(e,t,3);break;case`block`:lh(e,t,t.player,12,!1);break;case`fire`:oh(e,t,t.enemies[r],20,{isAttack:!1});break;case`venom`:qm(t,t.enemies[r],`poison`,7);break;case`energy`:Xm(e,t,3);break}return!0}function yh(e,t){if(t.over)return;let n=t.player;t.queue.push({t:`endTurn`});for(let n of[...t.hand]){let r=wm(n);if(r.endTurnDmg&&ch(e,t,r.endTurnDmg,{source:`burn`}),r.endTurnLoseHp&&ch(e,t,r.endTurnLoseHp,{source:`burn`}),t.over)return}n.statuses.metallicize&&lh(e,t,n,n.statuses.metallicize,!1),n.statuses.regen&&Nm(e,n.statuses.regen,t),t.discard.push(...t.hand),t.hand=[],t.queue.push({t:`discardHand`});for(let e of[`vulnerable`,`weak`,`frail`,`beacon`])n.statuses[e]&&(n.statuses[e]--,n.statuses[e]||delete n.statuses[e]);for(let r of t.enemies)if(!(r.hp<=0||t.over)){if(r.statuses.poison){let n=r.statuses.poison;if(r.hp-=n,e.stats.dmgDealt+=n,t.queue.push({t:`hitEnemy`,idx:r.idx,amount:n,blocked:0,hpAfter:Math.max(0,r.hp),dead:r.hp<=0,poison:!0}),r.statuses.poison--,r.statuses.poison||delete r.statuses.poison,r.hp<=0){e.stats.smolderKills++,sh(e,t,r);continue}}if(r.block=0,r.flags.staggered)r.flags.staggered=!1,r.lastMoves.push(r.moveKey),t.queue.push({t:`staggered`,idx:r.idx});else{let i=Ym(r);if(t.queue.push({t:`enemyAct`,idx:r.idx,move:r.moveKey,name:i.name}),r.lastMoves.push(r.moveKey),i.dmg!=null){for(let n=0;n<(i.times||1)&&!t.over;n++)ch(e,t,i.dmg,{source:r.idx,isAttack:!0,attacker:r});i.ramp&&(r.flags.rampBonus=(r.flags.rampBonus||0)+i.ramp)}if(t.over)return;if(i.block&&lh(e,t,r,i.block,!1),i.heal&&(r.hp=Math.min(r.maxHp,r.hp+i.heal),t.queue.push({t:`heal`,who:r.idx,n:i.heal})),i.fx){for(let e of i.fx)if(e.who===`player`)qm(t,n,e.id,e.n);else if(e.who===`self`)qm(t,r,e.id,e.n);else if(e.who===`allies`)for(let n of t.enemies.filter(e=>e.hp>0))qm(t,n,e.id,e.n)}if(i.addCards)for(let n=0;n<i.addCards.n;n++)t.discard.push({uid:e.uid++,id:i.addCards.id,up:!1,bonus:0}),t.queue.push({t:`addCard`,id:i.addCards.id,where:`discard`})}r.statuses.ritual&&qm(t,r,`str`,r.statuses.ritual);for(let e of[`vulnerable`,`weak`])r.statuses[e]&&(r.statuses[e]--,r.statuses[e]||delete r.statuses[e])}t.over||(Jm(e,t),fh(e,t))}function bh(e,t){t.over=!0,t.result=`win`,e.player.hp=_m(t.player.hp,1,e.player.maxHp),Am(e,`emberHeart`)&&(Nm(e,6),Km(t,`emberHeart`)),Am(e,`crownOfTheHearth`)&&t.embers>0&&(Nm(e,t.embers*3),Km(t,`crownOfTheHearth`)),Am(e,`gravebloom`)&&e.player.hp<=e.player.maxHp*.5&&(Nm(e,10),Km(t,`gravebloom`)),e.player.hp=_m(e.player.hp,1,e.player.maxHp),t.queue.push({t:`victory`,perfect:t.counters.hpLost===0})}function xh(e,t){t.over=!0,t.result=`loss`,t.player.hp=0,e.player.hp=0,t.queue.push({t:`defeat`})}function Sh(e,t,n=null){let r=e.player,i=t+(r.statuses.str||0);r.statuses.weak&&(i=Math.floor(i*.75));let a=n==null?null:e.enemies[n];return a&&a.statuses.vulnerable&&(i=Math.floor(i*1.5)),Math.max(0,i)}function Ch(e,t,n){let r=t.player,i=n+(r.statuses.dex||0);return r.statuses.frail&&(i=Math.floor(i*.75)),Math.round(Math.max(0,i)*(xm(e).wardMult||1))}function wh(e,t,n){let r=Ym(n);if(r.dmg==null)return null;let i=r.dmg+(n.statuses.str||0)+(n.flags.rampBonus||0)+(xm(e).enemyDmgBonus||0)+(ym(e).enemyDmgBonus||0);return n.statuses.weak&&(i=Math.floor(i*.75)),t.player.statuses.vulnerable&&(i=Math.floor(i*1.5)),{dmg:Math.max(0,i),times:r.times||1}}function Th(e,t,n,r=null){let i=wm(n),a=t.player,o=r==null?null:t.enemies[r],s=Am(e,`executionersSeal`)&&i.type===`attack`&&(t.counters.attacks+1)%10==0?2:1,c=e=>{let t=e+(a.statuses.str||0);return a.statuses.weak&&(t=Math.floor(t*.75)),o&&o.statuses.vulnerable&&(t=Math.floor(t*1.5)),Math.max(0,Math.floor(t*s))},l=[],u=0;for(let r of i.effects)r.kind===`dmg`?l.push({dmg:c(r.n),times:r.times||1}):r.kind===`block`?u+=Ch(e,t,r.n):r.kind===`special`&&(r.id===`leech`||r.id===`devour`?l.push({dmg:c(r.n),times:1}):r.id===`execute`?l.push({dmg:c(r.n+(o?.statuses.vulnerable?r.bonus:0)),times:1}):r.id===`momentum`?l.push({dmg:c(r.n+(n.bonus||0)),times:1}):r.id===`phantom`?l.push({dmg:c(r.n*Math.max(0,t.hand.length-+!!t.hand.includes(n))),times:1}):r.id===`shatterEcho`?l.push({dmg:c(r.n*(o&&(o.flags.staggered||o.statuses.vulnerable)?2:1)),times:1}):r.id===`emberNova`?l.push({dmg:c(r.n*t.embers),times:1}):r.id===`doubleBlock`?u+=a.block:r.id===`flawless`?u+=Ch(e,t,r.n)*(t.counters.hpLost===0?2:1):r.id===`emberdance`&&(u+=r.n*t.embers));let d=0;for(let e of i.effects)e.kind===`chip`&&(d+=e.n);if(!l.length&&!u&&!d)return null;let f=l.reduce((e,t)=>e+t.dmg*t.times,0),p=f,m=!1,h=0,g=!1;if(o){let e=o.block;p=0;for(let t of l)for(let n=0;n<t.times;n++){let n=Math.min(e,t.dmg);e-=n,p+=t.dmg-n}m=p>=o.hp;let t=i.type===`attack`?1+(i.chip||0)+(a.statuses.beacon||0):0;h=(l.length&&p>0?t:0)+d,g=h>0&&o.chips+h>=o.facetMax&&!m}return{hits:l,total:f,loss:p,lethal:m,block:u,chips:h,willShatter:g}}function Eh(e,t,n=!1){let r=Cm(e,t,n);return e.player.deck.push(r),r}function Dh(e,t){let n=e.player.deck.findIndex(e=>e.uid===t);n>=0&&e.player.deck.splice(n,1)}function Oh(e,t){let n=e.player.deck.find(e=>e.uid===t);n&&(n.up=!0)}function kh(e,t){let n=e.player.deck.find(e=>e.uid===t);n&&e.player.deck.push(Cm(e,n.id,n.up))}var Ah=`spirebound_save_v2`,jh=`spirebound_stats_v1`;function Mh(e){try{localStorage.setItem(Ah,JSON.stringify(e))}catch{}}function Nh(){try{let e=localStorage.getItem(Ah);if(!e)return null;let t=JSON.parse(e);if(!t||t.v!==2||!t.player||!t.map||!t.player.deck.every(e=>ku[e.id])||!t.player.relics.every(e=>Mu[e])||!t.player.potions.every(e=>e==null||Pu[e])||t.art!=null&&!Hu[t.art]||!(t.omens||[]).every(e=>Bu[e]))return null;for(t.art??=`flare`,t.aspect=_m(t.aspect??0,0,Wu.length-1),t.vow=_m(t.vow??0,0,Gu.length),t.unlocks??=[],t.omens??=[],t.boon??=null;t.omens.length<=t.act;)t.omens.push(bm(t));for(let e of[`shatters`,`kindles`,`perfects`,`smolderKills`,`unlitVisited`,`embersSpent`])t.stats[e]??=0;return t}catch{return null}}function Ph(){try{localStorage.removeItem(Ah),localStorage.removeItem(`spirebound_save_v1`)}catch{}}function Fh(){try{return JSON.parse(localStorage.getItem(jh))||{runs:0,wins:0,best:0}}catch{return{runs:0,wins:0,best:0}}}function Ih(e,t){let n=Fh();n.runs++,t&&n.wins++,n.best=Math.max(n.best,e.act*15+e.floorsClimbed);try{localStorage.setItem(jh,JSON.stringify(n))}catch{}Ph()}function Lh(e,t,n=Tm(e)){let r=[],i=[];for(let a of t){if(a.gold&&(e.player.gold=Math.max(0,e.player.gold+a.gold),a.gold>0&&(e.stats.goldEarned+=a.gold)),a.hp&&(e.player.hp=_m(e.player.hp+a.hp,1,e.player.maxHp)),a.maxHp&&(e.player.maxHp=Math.max(1,e.player.maxHp+a.maxHp),e.player.hp=_m(e.player.hp+Math.max(0,a.maxHp),1,e.player.maxHp)),a.heal&&Nm(e,Math.round(e.player.maxHp*a.heal)),a.addCard&&Eh(e,a.addCard),a.addRelic){let t=a.addRelic===`random`?Fm(e):a.addRelic;t?(Pm(e,t),i.push({relic:t})):(e.player.gold+=50,i.push({text:`You find 50 gold instead.`}))}if(a.potion&&Im(e,a.potion),a.pickRemove&&r.push(`remove`),a.pickUpgrade&&r.push(`upgrade`),a.pickDuplicate&&r.push(`duplicate`),a.pickCard&&r.push({pickCard:a.pickCard}),a.roll){let t=n(),o=0;for(let s of a.roll)if(o+=s.p,t<o){i.push({text:s.text});let t=Lh(e,s.ops,n);r.push(...t.pending),i.push(...t.log);break}}}return{pending:r,log:i}}var Rh=Object.assign({"./assets/arts/ashfall.png":`/assets/ashfall-C0Z9oihA.png`,"./assets/arts/beacon.png":`/assets/beacon-CfpI4NvN.png`,"./assets/arts/emberveil.png":`/assets/emberveil-DRPFSPHg.png`,"./assets/arts/flare.png":`/assets/flare-Ca-5NBfJ.png`,"./assets/arts/mendglass.png":`/assets/mendglass-MxKA-x9I.png`,"./assets/arts/stoke.png":`/assets/stoke-D5pz9eOt.png`,"./assets/boons/emberFlask.png":`/assets/emberFlask-BlP1krpU.png`,"./assets/boons/fullPurse.png":`/assets/fullPurse-DcTqZ-nz.png`,"./assets/boons/keenEye.png":`/assets/keenEye-DPefaPGL.png`,"./assets/boons/pilgrimsCache.png":`/assets/pilgrimsCache-CsIcQUYT.png`,"./assets/boons/temperedGlass.png":`/assets/temperedGlass-BVjobJFG.png`,"./assets/boons/twinPhials.png":`/assets/twinPhials-D5-9T5W2.png`,"./assets/boons/venomPouch.png":`/assets/venomPouch-9GhvdgzC.png`,"./assets/boons/warmHearth.png":`/assets/warmHearth-DTnVpfFw.png`,"./assets/cards/aegis.jpg":`/assets/aegis-D665L0sd.jpg`,"./assets/cards/agility.jpg":`/assets/agility-CUG3xKOo.jpg`,"./assets/cards/annihilate.jpg":`/assets/annihilate-CXlkbExQ.jpg`,"./assets/cards/ascension.jpg":`/assets/ascension-S4GAfpbx.jpg`,"./assets/cards/ashBite.jpg":`/assets/ashBite-BYzdJfb7.jpg`,"./assets/cards/ashenChoir.jpg":`/assets/ashenChoir-DTfq4XXZ.jpg`,"./assets/cards/bastion.jpg":`/assets/bastion-CM0wK4Yy.jpg`,"./assets/cards/bloodRite.jpg":`/assets/bloodRite-ou1XgXoc.jpg`,"./assets/cards/brace.jpg":`/assets/brace-Dc4SYgdF.jpg`,"./assets/cards/bulwark.jpg":`/assets/bulwark-CjEcWZ-i.jpg`,"./assets/cards/burn.jpg":`/assets/burn-DJ4EegTp.jpg`,"./assets/cards/catalyst.jpg":`/assets/catalyst-ClagfpN0.jpg`,"./assets/cards/chisel.jpg":`/assets/chisel-DGrQWYAc.jpg`,"./assets/cards/cleave.jpg":`/assets/cleave-CvexqRxg.jpg`,"./assets/cards/cripple.jpg":`/assets/cripple-CRxGKuS4.jpg`,"./assets/cards/defend.jpg":`/assets/defend-mmYA7HKX.jpg`,"./assets/cards/deflect.jpg":`/assets/deflect-BKgfxyAn.jpg`,"./assets/cards/devour.jpg":`/assets/devour-CST2E0aP.jpg`,"./assets/cards/eclipseSlash.jpg":`/assets/eclipseSlash-DEA5FgEC.jpg`,"./assets/cards/emberdance.jpg":`/assets/emberdance-B_CKT6sd.jpg`,"./assets/cards/empower.jpg":`/assets/empower-D4P9cm_V.jpg`,"./assets/cards/executioner.jpg":`/assets/executioner-BOy4ovki.jpg`,"./assets/cards/firstSpark.jpg":`/assets/firstSpark-BpDCHsPu.jpg`,"./assets/cards/flawlessForm.jpg":`/assets/flawlessForm-Di6668jF.jpg`,"./assets/cards/flurry.jpg":`/assets/flurry-BgnBaWD-.jpg`,"./assets/cards/fortify.jpg":`/assets/fortify-BzU364vJ.jpg`,"./assets/cards/frenzy.jpg":`/assets/frenzy-qaLdgJOP.jpg`,"./assets/cards/guardedStrike.jpg":`/assets/guardedStrike-CesH5DLC.jpg`,"./assets/cards/heavyBlow.jpg":`/assets/heavyBlow-XGOXUeSq.jpg`,"./assets/cards/hex.jpg":`/assets/hex-CzQLIJW1.jpg`,"./assets/cards/ironSkin.jpg":`/assets/ironSkin-BOE1a1BZ.jpg`,"./assets/cards/leechBlade.jpg":`/assets/leechBlade-CFp6z-JI.jpg`,"./assets/cards/limitBreak.jpg":`/assets/limitBreak-BU_PNCuK.jpg`,"./assets/cards/lunge.jpg":`/assets/lunge-D9lgqjTD.jpg`,"./assets/cards/momentum.jpg":`/assets/momentum-Clbqs0on.jpg`,"./assets/cards/nightSight.jpg":`/assets/nightSight-DuZK4KbA.jpg`,"./assets/cards/novaflare.jpg":`/assets/novaflare-Dwvtjr_D.jpg`,"./assets/cards/oblivionStrike.jpg":`/assets/oblivionStrike-CXq1522m.jpg`,"./assets/cards/offering.jpg":`/assets/offering-BaVvule_.jpg`,"./assets/cards/phantomBlades.jpg":`/assets/phantomBlades-Bck63olt.jpg`,"./assets/cards/preparation.jpg":`/assets/preparation-BkmwWzr3.jpg`,"./assets/cards/pyreheart.jpg":`/assets/pyreheart-Cf86Pj1Y.jpg`,"./assets/cards/quakeblow.jpg":`/assets/quakeblow-DZPTH_O8.jpg`,"./assets/cards/quickSlash.jpg":`/assets/quickSlash-DMRFz6rj.jpg`,"./assets/cards/regrowth.jpg":`/assets/regrowth-C0gMpqIX.jpg`,"./assets/cards/resonantLance.jpg":`/assets/resonantLance-CCStaA3R.jpg`,"./assets/cards/shardstorm.jpg":`/assets/shardstorm-DIKHFs35.jpg`,"./assets/cards/sidestep.jpg":`/assets/sidestep-CeDzy6bs.jpg`,"./assets/cards/smother.jpg":`/assets/smother-DFWDS6kH.jpg`,"./assets/cards/strike.jpg":`/assets/strike-DfYIx_7x.jpg`,"./assets/cards/surge.jpg":`/assets/surge-Ci44wXor.jpg`,"./assets/cards/tempest.jpg":`/assets/tempest-K9Ub9Fd7.jpg`,"./assets/cards/tithe.jpg":`/assets/tithe-DvZ_GGtQ.jpg`,"./assets/cards/toxicMist.jpg":`/assets/toxicMist-DMOH0JOL.jpg`,"./assets/cards/twinFangs.jpg":`/assets/twinFangs-C0lavWO6.jpg`,"./assets/cards/uppercut.jpg":`/assets/uppercut-CY7mUqmx.jpg`,"./assets/cards/venomStrike.jpg":`/assets/venomStrike-DGTk3cTA.jpg`,"./assets/cards/virulence.jpg":`/assets/virulence-vlHxYWHm.jpg`,"./assets/cards/warCry.jpg":`/assets/warCry-BO21yVwc.jpg`,"./assets/cards/wound.jpg":`/assets/wound-B5mKVM4_.jpg`,"./assets/enemies/abyssalKnight.png":`/assets/abyssalKnight-BA9qPzL_.png`,"./assets/enemies/alphaFang.png":`/assets/alphaFang-CYs2MfQS.png`,"./assets/enemies/ashAcolyte.png":`/assets/ashAcolyte-W7Bx9eY3.png`,"./assets/enemies/chaosHound.png":`/assets/chaosHound-Cu1tbGXO.png`,"./assets/enemies/deepmaw.png":`/assets/deepmaw-BuZMfyUW.png`,"./assets/enemies/drownedOne.png":`/assets/drownedOne-762yKbrK.png`,"./assets/enemies/duskfang.png":`/assets/duskfang-kVQE2Vbx.png`,"./assets/enemies/gloomslime.png":`/assets/gloomslime-BYNIQKkd.png`,"./assets/enemies/gravewarden.png":`/assets/gravewarden-CYbqq2Uz.png`,"./assets/enemies/heraldOfEnd.png":`/assets/heraldOfEnd-B5j76nBL.png`,"./assets/enemies/leviathan.png":`/assets/leviathan-DUX2Oy2k.png`,"./assets/enemies/mirelurker.png":`/assets/mirelurker-Cs0-ryPe.png`,"./assets/enemies/obsidianGolem.png":`/assets/obsidianGolem-B2_vm835.png`,"./assets/enemies/rootheart.png":`/assets/rootheart-CoZqsgKs.png`,"./assets/enemies/shade.png":`/assets/shade-cFzxMAwm.png`,"./assets/enemies/shellback.png":`/assets/shellback-9j9gwuRI.png`,"./assets/enemies/siren.png":`/assets/siren-Boj63opF.png`,"./assets/enemies/sovereign.png":`/assets/sovereign-DlFMbPOe.png`,"./assets/enemies/sporeling.png":`/assets/sporeling-B8wAP_1e.png`,"./assets/enemies/starCultist.png":`/assets/starCultist-DrQ9SosS.png`,"./assets/enemies/thornling.png":`/assets/thornling-BJhkzjJz.png`,"./assets/enemies/tidecaller.png":`/assets/tidecaller-C3FvvD8d.png`,"./assets/enemies/voidColossus.png":`/assets/voidColossus-D1BBPiCC.png`,"./assets/enemies/voidWisp.png":`/assets/voidWisp-DqB4mImW.png`,"./assets/enemies/voltEel.png":`/assets/voltEel-BxcD87LR.png`,"./assets/enemies/watcherEye.png":`/assets/watcherEye-Cx0FZXO4.png`,"./assets/enemies/waylayer.png":`/assets/waylayer-DkHd5xp-.png`,"./assets/events/cursedIdol.png":`/assets/cursedIdol--s0qHWso.png`,"./assets/events/emberFountain.png":`/assets/emberFountain-D_Q0157p.png`,"./assets/events/fleshTrader.png":`/assets/fleshTrader-q8lAx2oa.png`,"./assets/events/forge.png":`/assets/forge-i5xE2DIv.png`,"./assets/events/forgottenShrine.png":`/assets/forgottenShrine-CYFo9R9B.png`,"./assets/events/gambler.png":`/assets/gambler-D4lmA3Yw.png`,"./assets/events/library.png":`/assets/library-CstvhNks.png`,"./assets/events/mirror.png":`/assets/mirror-Hp5O4ZPJ.png`,"./assets/events/ruinedCamp.png":`/assets/ruinedCamp-BvAZgrK0.png`,"./assets/events/voidChest.png":`/assets/voidChest-B34oBTge.png`,"./assets/events/woundedKnight.png":`/assets/woundedKnight-JN7kYI1u.png`,"./assets/heroes/ashwarden.png":`/assets/ashwarden-D21mg7QM.png`,"./assets/heroes/duskblade.png":`/assets/duskblade-DupP5i2p.png`,"./assets/omens/ashfall.png":`/assets/ashfall-T4uYvK8I.png`,"./assets/omens/emberWind.png":`/assets/emberWind-Cw83yf4v.png`,"./assets/omens/heavyAir.png":`/assets/heavyAir-CjAuZn0d.png`,"./assets/omens/hungryDark.png":`/assets/hungryDark-JCDxnDj4.png`,"./assets/omens/longNight.png":`/assets/longNight-C2g4JuMB.png`,"./assets/omens/thinGlass.png":`/assets/thinGlass-CCNgzO1U.png`,"./assets/omens/waningMoon.png":`/assets/waningMoon-DyGgMjmd.png`,"./assets/potions/block.png":`/assets/block-DybnuP3a.png`,"./assets/potions/energy.png":`/assets/energy-CWJoumcv.png`,"./assets/potions/fire.png":`/assets/fire-Bc2Edgqg.png`,"./assets/potions/healing.png":`/assets/healing-Bf7MtUhk.png`,"./assets/potions/strength.png":`/assets/strength-Bp64zOFp.png`,"./assets/potions/swift.png":`/assets/swift-Da4aGqnZ.png`,"./assets/potions/venom.png":`/assets/venom-DzAfe6ZB.png`,"./assets/props/campfire.png":`/assets/campfire-C5hpDY2a.png`,"./assets/props/chest-open.png":`/assets/chest-open-D2mfQAex.png`,"./assets/props/chest.png":`/assets/chest-Dz-t7vgq.png`,"./assets/props/merchant.png":`/assets/merchant-CRCPVNlm.png`,"./assets/relics/ashenCore.png":`/assets/ashenCore-BHw_xmlT.png`,"./assets/relics/basaltIdol.png":`/assets/basaltIdol-BLUsj7rE.png`,"./assets/relics/bellOfEndings.png":`/assets/bellOfEndings-CMuMud-J.png`,"./assets/relics/crownOfCinders.png":`/assets/crownOfCinders-B4iyR0zw.png`,"./assets/relics/crownOfTheHearth.png":`/assets/crownOfTheHearth-Cz96lab0.png`,"./assets/relics/crownOfTithes.png":`/assets/crownOfTithes-BCSNj05m.png`,"./assets/relics/duskmirror.png":`/assets/duskmirror-ChDahFDy.png`,"./assets/relics/emberHeart.png":`/assets/emberHeart-D8pWC_qd.png`,"./assets/relics/emberLantern.png":`/assets/emberLantern-CzFc-ESn.png`,"./assets/relics/executionersSeal.png":`/assets/executionersSeal-B-n0EUgT.png`,"./assets/relics/frozenCore.png":`/assets/frozenCore-JuT4c4Zg.png`,"./assets/relics/gravebloom.png":`/assets/gravebloom-CR3cDZz9.png`,"./assets/relics/hollowCrown.png":`/assets/hollowCrown-CHl2KxBg.png`,"./assets/relics/ironTalisman.png":`/assets/ironTalisman-CLgSHgbT.png`,"./assets/relics/merchantsMark.png":`/assets/merchantsMark-YaAPSe2m.png`,"./assets/relics/prismCharm.png":`/assets/prismCharm-CWUUYnXM.png`,"./assets/relics/reapersBell.png":`/assets/reapersBell-DK7zj2uj.png`,"./assets/relics/riverPearl.png":`/assets/riverPearl-1k1ZwvLB.png`,"./assets/relics/seersOrb.png":`/assets/seersOrb--o7V7uP4.png`,"./assets/relics/shatterersCrown.png":`/assets/shatterersCrown-VlDF7CT4.png`,"./assets/relics/silkFan.png":`/assets/silkFan-Co6ZNxqb.png`,"./assets/relics/smolderingCoal.png":`/assets/smolderingCoal-ESDuOXE3.png`,"./assets/relics/sunBlossom.png":`/assets/sunBlossom-GItTIWOb.png`,"./assets/relics/sweetRoot.png":`/assets/sweetRoot-DVIYyMAo.png`,"./assets/relics/thiefOfWicks.png":`/assets/thiefOfWicks-WD5HQJ9E.png`,"./assets/relics/thornBand.png":`/assets/thornBand-1rbgbbpR.png`,"./assets/relics/travelersPack.png":`/assets/travelersPack-Ctq6FXOL.png`,"./assets/relics/verdantBranch.png":`/assets/verdantBranch-BpapOPVN.png`,"./assets/relics/vialOfLife.png":`/assets/vialOfLife-CqH_Yzkc.png`,"./assets/relics/warFetish.png":`/assets/warFetish-BphYE_UB.png`,"./assets/relics/wardingCharm.png":`/assets/wardingCharm-DcyucUO6.png`,"./assets/stage/act1-backdrop.png":`/assets/act1-backdrop-CC5kcu8K.png`,"./assets/stage/act1-ledge.png":`/assets/act1-ledge-Xknu1EDQ.png`,"./assets/stage/act1-mid.png":`/assets/act1-mid-B4s3OZuq.png`,"./assets/stage/act2-backdrop.png":`/assets/act2-backdrop-BtpNIaTG.png`,"./assets/stage/act2-ledge.png":`/assets/act2-ledge-CVAyrxfF.png`,"./assets/stage/act2-mid.png":`/assets/act2-mid-BAevK0Pb.png`,"./assets/stage/act3-backdrop.png":`/assets/act3-backdrop-DFsKREnY.png`,"./assets/stage/act3-ledge.png":`/assets/act3-ledge-DuyDX66N.png`,"./assets/stage/act3-mid.png":`/assets/act3-mid-CukJ38oi.png`,"./assets/title/title.png":`/assets/title-BZbtHJmc.png`,"./assets/title-background/background.png":`/assets/background-cEVCcaPg.png`,"./assets-legacy/cards/aegis.png":`/assets/aegis-BbAK7DRy.png`,"./assets-legacy/cards/agility.png":`/assets/agility-D28Eu8MG.png`,"./assets-legacy/cards/annihilate.png":`/assets/annihilate-M3mspBDm.png`,"./assets-legacy/cards/ascension.png":`/assets/ascension-C2Pll28_.png`,"./assets-legacy/cards/ashBite.png":`/assets/ashBite-BBZrYNBt.png`,"./assets-legacy/cards/ashenChoir.png":`/assets/ashenChoir-Cjfn-BY1.png`,"./assets-legacy/cards/bastion.png":`/assets/bastion-D4uvW6Yu.png`,"./assets-legacy/cards/bloodRite.png":`/assets/bloodRite-xNaIV6FC.png`,"./assets-legacy/cards/brace.png":`/assets/brace-CDbc3WSx.png`,"./assets-legacy/cards/bulwark.png":`/assets/bulwark-DvQ82Xby.png`,"./assets-legacy/cards/burn.png":`/assets/burn-BVJa4vLy.png`,"./assets-legacy/cards/catalyst.png":`/assets/catalyst-C9UJqVfa.png`,"./assets-legacy/cards/chisel.png":`/assets/chisel-BHUdyvP2.png`,"./assets-legacy/cards/cleave.png":`/assets/cleave-Cs444Dst.png`,"./assets-legacy/cards/cripple.png":`/assets/cripple-CtSZS_Jx.png`,"./assets-legacy/cards/defend.png":`/assets/defend-BT8TAbMa.png`,"./assets-legacy/cards/deflect.png":`/assets/deflect-C25gbOwx.png`,"./assets-legacy/cards/devour.png":`/assets/devour-CXvHmKvA.png`,"./assets-legacy/cards/eclipseSlash.png":`/assets/eclipseSlash-B5W8xu8L.png`,"./assets-legacy/cards/emberdance.png":`/assets/emberdance-CBOqWIEl.png`,"./assets-legacy/cards/empower.png":`/assets/empower-DauCte29.png`,"./assets-legacy/cards/executioner.png":`/assets/executioner-DI8vj7EW.png`,"./assets-legacy/cards/firstSpark.png":`/assets/firstSpark-CaQ5-JAc.png`,"./assets-legacy/cards/flawlessForm.png":`/assets/flawlessForm-C34QTET6.png`,"./assets-legacy/cards/flurry.png":`/assets/flurry-D8kOQQ9x.png`,"./assets-legacy/cards/fortify.png":`/assets/fortify-DEACu-Zo.png`,"./assets-legacy/cards/frenzy.png":`/assets/frenzy-BgGGtYpf.png`,"./assets-legacy/cards/guardedStrike.png":`/assets/guardedStrike-BBAeWagI.png`,"./assets-legacy/cards/heavyBlow.png":`/assets/heavyBlow-Btb1hEmS.png`,"./assets-legacy/cards/hex.png":`/assets/hex-D3QIN_GY.png`,"./assets-legacy/cards/ironSkin.png":`/assets/ironSkin-DIcLMutG.png`,"./assets-legacy/cards/leechBlade.png":`/assets/leechBlade-BgoitLbP.png`,"./assets-legacy/cards/limitBreak.png":`/assets/limitBreak-D3VHagIC.png`,"./assets-legacy/cards/lunge.png":`/assets/lunge-BKNULJcP.png`,"./assets-legacy/cards/momentum.png":`/assets/momentum-D0hGLm2N.png`,"./assets-legacy/cards/nightSight.png":`/assets/nightSight-1ggiNsUe.png`,"./assets-legacy/cards/novaflare.png":`/assets/novaflare-BtAOF5B2.png`,"./assets-legacy/cards/oblivionStrike.png":`/assets/oblivionStrike-Ck8D7viT.png`,"./assets-legacy/cards/offering.png":`/assets/offering-BDnzVcbS.png`,"./assets-legacy/cards/phantomBlades.png":`/assets/phantomBlades-CZgzKQZJ.png`,"./assets-legacy/cards/preparation.png":`/assets/preparation-B0_lrDKo.png`,"./assets-legacy/cards/pyreheart.png":`/assets/pyreheart-BzRCI95J.png`,"./assets-legacy/cards/quakeblow.png":`/assets/quakeblow-DZuM_zei.png`,"./assets-legacy/cards/quickSlash.png":`/assets/quickSlash-BHIEN7hF.png`,"./assets-legacy/cards/regrowth.png":`/assets/regrowth-DCr6zV9b.png`,"./assets-legacy/cards/resonantLance.png":`/assets/resonantLance-DFyDlcY4.png`,"./assets-legacy/cards/shardstorm.png":`/assets/shardstorm-CtSThqM0.png`,"./assets-legacy/cards/sidestep.png":`/assets/sidestep-D-t2UoHV.png`,"./assets-legacy/cards/smother.png":`/assets/smother-Boa7xrCA.png`,"./assets-legacy/cards/strike.png":`/assets/strike-CmEr2qad.png`,"./assets-legacy/cards/surge.png":`/assets/surge-D5JDOylt.png`,"./assets-legacy/cards/tempest.png":`/assets/tempest-DosF7X1A.png`,"./assets-legacy/cards/tithe.png":`/assets/tithe-BNvDlR3N.png`,"./assets-legacy/cards/toxicMist.png":`/assets/toxicMist-BUGxQeK0.png`,"./assets-legacy/cards/twinFangs.png":`/assets/twinFangs-BUW2V2Kq.png`,"./assets-legacy/cards/uppercut.png":`/assets/uppercut-C0A2yndn.png`,"./assets-legacy/cards/venomStrike.png":`/assets/venomStrike-CXIglW-b.png`,"./assets-legacy/cards/virulence.png":`/assets/virulence-pwX1yrdH.png`,"./assets-legacy/cards/warCry.png":`/assets/warCry-C7Rsrd4u.png`,"./assets-legacy/cards/wound.png":`/assets/wound-BTcmqSFC.png`,"./assets-legacy/enemies/abyssalKnight.png":`/assets/abyssalKnight-C-E-itbM.png`,"./assets-legacy/enemies/alphaFang.png":`/assets/alphaFang-DdGpQqF8.png`,"./assets-legacy/enemies/ashAcolyte.png":`/assets/ashAcolyte-BBrUUe1I.png`,"./assets-legacy/enemies/chaosHound.png":`/assets/chaosHound-D1R2CoW1.png`,"./assets-legacy/enemies/deepmaw.png":`/assets/deepmaw-la4seO5f.png`,"./assets-legacy/enemies/drownedOne.png":`/assets/drownedOne-BUBzJWlu.png`,"./assets-legacy/enemies/duskfang.png":`/assets/duskfang-CHUmjhPP.png`,"./assets-legacy/enemies/gloomslime.png":`/assets/gloomslime-BNhQuFFa.png`,"./assets-legacy/enemies/gravewarden.png":`/assets/gravewarden-BC9T04oe.png`,"./assets-legacy/enemies/heraldOfEnd.png":`/assets/heraldOfEnd-DZZiCKi_.png`,"./assets-legacy/enemies/leviathan.png":`/assets/leviathan-BhXEnJxl.png`,"./assets-legacy/enemies/mirelurker.png":`/assets/mirelurker-DidtJkek.png`,"./assets-legacy/enemies/obsidianGolem.png":`/assets/obsidianGolem-DkurqVoj.png`,"./assets-legacy/enemies/rootheart.png":`/assets/rootheart-B4o9Bf9P.png`,"./assets-legacy/enemies/shade.png":`/assets/shade-C2XrmBs-.png`,"./assets-legacy/enemies/shellback.png":`/assets/shellback-DCHXMl3u.png`,"./assets-legacy/enemies/siren.png":`/assets/siren-GVK3WWGi.png`,"./assets-legacy/enemies/sovereign.png":`/assets/sovereign-0p3wfa6T.png`,"./assets-legacy/enemies/sporeling.png":`/assets/sporeling-BeOaEEL0.png`,"./assets-legacy/enemies/starCultist.png":`/assets/starCultist-DQHXdHm5.png`,"./assets-legacy/enemies/thornling.png":`/assets/thornling-CqSviePj.png`,"./assets-legacy/enemies/tidecaller.png":`/assets/tidecaller-tGjufTlQ.png`,"./assets-legacy/enemies/voidColossus.png":`/assets/voidColossus-yr_eofA0.png`,"./assets-legacy/enemies/voidWisp.png":`/assets/voidWisp-D_7XlB9X.png`,"./assets-legacy/enemies/voltEel.png":`/assets/voltEel-CJeHty9B.png`,"./assets-legacy/enemies/watcherEye.png":`/assets/watcherEye---WypZip.png`,"./assets-legacy/enemies/waylayer.png":`/assets/waylayer-qynHTjuH.png`,"./assets-legacy/events/cursedIdol.png":`/assets/cursedIdol--s0qHWso.png`,"./assets-legacy/events/emberFountain.png":`/assets/emberFountain-D_Q0157p.png`,"./assets-legacy/events/fleshTrader.png":`/assets/fleshTrader-q8lAx2oa.png`,"./assets-legacy/events/forge.png":`/assets/forge-i5xE2DIv.png`,"./assets-legacy/events/forgottenShrine.png":`/assets/forgottenShrine-CYFo9R9B.png`,"./assets-legacy/events/gambler.png":`/assets/gambler-D4lmA3Yw.png`,"./assets-legacy/events/library.png":`/assets/library-CstvhNks.png`,"./assets-legacy/events/mirror.png":`/assets/mirror-Hp5O4ZPJ.png`,"./assets-legacy/events/ruinedCamp.png":`/assets/ruinedCamp-BvAZgrK0.png`,"./assets-legacy/events/voidChest.png":`/assets/voidChest-B34oBTge.png`,"./assets-legacy/events/woundedKnight.png":`/assets/woundedKnight-JN7kYI1u.png`,"./assets-legacy/heroes/ashwarden.png":`/assets/ashwarden-BjFdmgoK.png`,"./assets-legacy/heroes/duskblade.png":`/assets/duskblade-DBhvpfoa.png`,"./assets-legacy/potions/block.png":`/assets/block-CkTqIuTb.png`,"./assets-legacy/potions/energy.png":`/assets/energy-BNM23nR-.png`,"./assets-legacy/potions/fire.png":`/assets/fire-CAaEe0xi.png`,"./assets-legacy/potions/healing.png":`/assets/healing-KDHGTVtG.png`,"./assets-legacy/potions/strength.png":`/assets/strength-CIdQsSW6.png`,"./assets-legacy/potions/swift.png":`/assets/swift-xz-qROFX.png`,"./assets-legacy/potions/venom.png":`/assets/venom-D3l_eMKx.png`,"./assets-legacy/props/campfire.png":`/assets/campfire-B-OrO4zT.png`,"./assets-legacy/props/chest-open.png":`/assets/chest-open-B5Uzt-_6.png`,"./assets-legacy/props/chest.png":`/assets/chest-b-PO08AA.png`,"./assets-legacy/props/merchant.png":`/assets/merchant-COlFp5u3.png`,"./assets-legacy/title-background/background.png":`/assets/background-CqhrXvXS.png`}),zh=[`png`,`jpg`,`jpeg`,`webp`],Bh={live:{label:`Live`,root:`assets`},legacy:{label:`Legacy`,root:`assets-legacy`}},Vh=`live`,Hh=(e=Vh)=>Bh[e]??Bh[Vh],Uh=()=>Object.keys(Bh),Wh=(e=Vh)=>Hh(e).label,Gh=(e,t,n=Vh)=>{let{root:r}=Hh(n);for(let n of zh){let i=Rh[`./${r}/${e}/${t}.${n}`];if(i)return i}return null},Kh=(e,t=Vh)=>{let{root:n}=Hh(t);return Object.entries(Rh).filter(([t])=>t.startsWith(`./${n}/${e}/`)).map(([,e])=>e)},qh=0,Jh=()=>`g${++qh}`,K=(e,t,n,r=1)=>`hsla(${e},${t}%,${n}%,${r})`;function Yh(e,t,n){return`<defs>
    <linearGradient id="${e}b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${K(t,55,38)}"/><stop offset="0.55" stop-color="${K(t,50,20)}"/><stop offset="1" stop-color="${K(t,55,9)}"/>
    </linearGradient>
    <linearGradient id="${e}d" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${K(t,45,24)}"/><stop offset="1" stop-color="${K(t,50,5)}"/>
    </linearGradient>
    <radialGradient id="${e}g"><stop offset="0" stop-color="${n}" stop-opacity="1"/><stop offset="1" stop-color="${n}" stop-opacity="0"/></radialGradient>
    <filter id="${e}f" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`}var Xh=`stroke="#070a12" stroke-width="3.6" paint-order="stroke" stroke-linejoin="round"`;function Zh(e){return e.replace(/<path(?![^>]*stroke=)(?![^>]*fill="none")([^>]*?)\/>/g,`<path$1 ${Xh}/>`).replace(/<(circle|ellipse)([^>]*fill="url\(#[^"]+[bd]\)"[^>]*?)\/>/g,(e,t,n)=>n.includes(`stroke=`)?e:`<${t}${n} ${Xh}/>`)}function Qh(e=!1){let t=62+Math.random()*76,n=60+Math.random()*74,r=e?6:4,i=e?50:33,a=Math.random()*Math.PI*2,o=[],s=[],c=``;for(let e=0;e<r;e++){let l=a+e/r*Math.PI*2+(Math.random()-.5)*.45,u=l,d=t,f=n,p=3+Math.floor(Math.random()*3),m=Math.max(1,Math.round(p*.55)),h=i/p;c+=`M${d.toFixed(1)} ${f.toFixed(1)}`;for(let e=0;e<p;e++){u=l+(Math.random()-.5)*.6;let t=h*(.7+Math.random()*.6);d+=Math.cos(u)*t,f+=Math.sin(u)*t,c+=`L${d.toFixed(1)} ${f.toFixed(1)}`,e===m&&o.push([d,f]),e===p-1&&s.push([d,f])}if(Math.random()<.45){let e=u+(Math.random()<.5?1:-1)*(.55+Math.random()*.4),t=h*(.9+Math.random());c+=`M${d.toFixed(1)} ${f.toFixed(1)}L${(d+Math.cos(e)*t).toFixed(1)} ${(f+Math.sin(e)*t).toFixed(1)}`}}let l=(e,r)=>e.map(([i,a],o)=>{let[s,c]=e[(o+1)%e.length],l=(i+s)/2+(t-(i+s)/2)*r,u=(a+c)/2+(n-(a+c)/2)*r;return`M${i.toFixed(1)} ${a.toFixed(1)}Q${l.toFixed(1)} ${u.toFixed(1)} ${s.toFixed(1)} ${c.toFixed(1)}`}).join(``),u=c+l(o,.16)+(e?l(s,.1):``),d=(e?2.6:1.9).toFixed(1);return`<g class="crack" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="${u}" stroke="#080b16" stroke-width="2.9" opacity=".72"/><path d="${u}" stroke="#cfe4ff" stroke-width="1.35" opacity=".9"/><path d="${c}" stroke="#f8fcff" stroke-width="0.7" opacity=".95"/><circle cx="${t.toFixed(1)}" cy="${n.toFixed(1)}" r="${d}" fill="#f0f6ff" opacity=".9"/></g>`}var q=(e,t,n,r)=>`<circle class="eye" cx="${e}" cy="${t}" r="${n}" fill="${r}"/><circle cx="${e}" cy="${t}" r="${n*2.2}" fill="${r}" opacity="0.18"/>`,$h={wisp(e,t,n){return`<g class="breathe">
      <path d="M100 78 q-26 44 -14 74 q6 16 14 26 q8-10 14-26 q12-30 -14-74Z" fill="url(#${e}d)" opacity=".7"/>
      <path d="M78 96 q-20 30 -8 52 M122 96 q20 30 8 52" stroke="${K(t,40,24)}" stroke-width="7" fill="none" opacity=".6"/>
      <circle cx="100" cy="78" r="34" fill="url(#${e}b)" filter="url(#${e}f)"/>
      <circle cx="100" cy="78" r="46" fill="url(#${e}g)" opacity=".35"/>
      ${q(100,76,9,n)}
    </g>`},beast(e,t,n){return`<g class="breathe">
      <path d="M30 150 q-6-38 26-54 q20-44 62-40 q16 2 22 14 l26-10 q-4 22 -18 28 q10 18 6 34 q-4 20 -24 28 l4 20 -18 0 -6-14 q-22 8 -44 2 l-4 12 -18 0 2-20 q-14-4 -16 0Z" fill="url(#${e}b)"/>
      <path d="M118 56 l24-10 q-4 20 -18 26Z" fill="url(#${e}d)"/>
      <path d="M36 148 q-10-34 22-50" stroke="${K(t,35,22)}" stroke-width="6" fill="none"/>
      <path d="M64 108 q20 14 48 6" stroke="${K(t,30,8)}" stroke-width="5" fill="none" opacity=".7"/>
      ${q(128,74,5.5,n)}${q(112,70,5,n)}
      <path d="M138 92 l16 6 -14 8Z" fill="${K(t,20,80)}"/>
    </g>`},slime(e,t,n){return`<g class="breathe">
      <path d="M40 168 q-12-70 60-96 q72 26 60 96 q-30 12 -60 12 q-30 0 -60-12Z" fill="url(#${e}b)" opacity=".92"/>
      <path d="M52 166 q-6-52 48-74 q54 22 48 74" fill="url(#${e}d)" opacity=".6"/>
      <circle cx="100" cy="124" r="22" fill="url(#${e}g)" opacity=".5"/>
      <circle cx="100" cy="124" r="12" fill="${n}" opacity=".85" class="eye"/>
      ${q(74,106,6,n)}${q(128,108,7,n)}
      <path d="M60 170 q4 14 -4 18 M140 170 q-2 16 6 18 M100 178 q0 12 -6 16" stroke="${K(t,36,22)}" stroke-width="7" fill="none" opacity=".8"/>
    </g>`},rogue(e,t,n){return`<g class="breathe">
      <path d="M64 184 q-10-70 10-104 q10-20 26-24 q16 4 26 24 q20 34 10 104 q-18 8 -36 8 q-18 0 -36-8Z" fill="url(#${e}b)"/>
      <path d="M72 74 q28-18 56 0 q-6-26 -28-30 q-22 4 -28 30Z" fill="url(#${e}d)"/>
      <path d="M76 80 q24 12 48 0 q-2 26 -24 30 q-22-4 -24-30Z" fill="${K(t,30,4)}"/>
      ${q(88,88,4.5,n)}${q(112,88,4.5,n)}
      <path d="M142 108 l26-38 6 6 -22 40Z" fill="${K(t,8,70)}" filter="url(#${e}f)"/>
      <path d="M58 110 q-16 20 -8 42" stroke="${K(t,26,18)}" stroke-width="10" fill="none"/>
    </g>`},plant(e,t,n){let r=``;for(let e=0;e<9;e++){let n=-90+(e-4)*24,i=100+Math.cos(n*Math.PI/180)*62,a=118+Math.sin(n*Math.PI/180)*62;r+=`<path d="M${100+(i-100)*.55} ${118+(a-118)*.55} L${i} ${a} L${100+(i-100)*.62+8} ${118+(a-118)*.62}Z" fill="${K(t,45,30)}"/>`}return`<g class="breathe">${r}
      <path d="M56 178 q-14-64 44-86 q58 22 44 86 q-22 10 -44 10 q-22 0 -44-10Z" fill="url(#${e}b)"/>
      <path d="M100 96 q30 14 34 52" stroke="${K(t,40,18)}" stroke-width="6" fill="none" opacity=".7"/>
      <path d="M78 128 q22-12 44 0 q-8 18 -22 18 q-14 0 -22-18Z" fill="${K(t,30,6)}"/>
      ${q(100,132,7,n)}
    </g>`},cultist(e,t,n){return`<g class="breathe">
      <path d="M60 188 q-8-78 14-112 q12-18 26-22 q14 4 26 22 q22 34 14 112 q-20 6 -40 6 q-20 0 -40-6Z" fill="url(#${e}b)"/>
      <path d="M74 70 q26-16 52 0 q-4-24 -26-28 q-22 4 -26 28Z" fill="url(#${e}d)"/>
      <ellipse cx="100" cy="84" rx="22" ry="18" fill="${K(t,30,4)}"/>
      ${q(91,84,4,n)}${q(109,84,4,n)}
      <path d="M48 128 q14-24 30-20 M152 128 q-14-24 -30-20" stroke="${K(t,32,20)}" stroke-width="12" fill="none"/>
      <g class="hover-float"><path d="M100 30 l10 14 -10 14 -10-14Z" fill="${n}" filter="url(#${e}f)" opacity=".9"/></g>
    </g>`},golem(e,t,n){return`<g class="breathe">
      <path d="M42 190 l8-38 q-18-16 -12-44 q8-40 62-44 q54 4 62 44 q6 28 -12 44 l8 38 -30 0 -6-26 q-22 6 -44 0 l-6 26Z" fill="url(#${e}b)"/>
      <path d="M64 96 l20 10 -14 16Z M138 96 l-20 10 14 16Z" fill="url(#${e}d)"/>
      <path d="M70 140 q30 12 60 0 M84 70 l10 22 M118 68 l-6 24" stroke="${n}" stroke-width="3.5" fill="none" opacity=".7" class="eye"/>
      ${q(84,88,6,n)}${q(118,88,6,n)}
      <path d="M30 150 q10-30 26-32 M170 150 q-10-30 -26-32" stroke="${K(t,26,16)}" stroke-width="16" fill="none"/>
    </g>`},treeboss(e,t,n){return`<g class="breathe">
      <path d="M52 192 q-6-30 10-44 q-30-10 -34-44 q30 8 44 0 q-24-22 -16-56 q26 16 44 12 q18 4 44-12 q8 34 -16 56 q14 8 44 0 q-4 34 -34 44 q16 14 10 44 q-24 8 -48 8 q-24 0 -48-8Z" fill="url(#${e}b)"/>
      <path d="M78 120 q22-14 44 0 q-4 34 -22 40 q-18-6 -22-40Z" fill="${K(t,30,5)}"/>
      <circle cx="100" cy="138" r="16" fill="url(#${e}g)" opacity=".8" class="eye"/>
      ${q(88,108,5,n)}${q(112,108,5,n)}
      <path d="M60 190 q-2-18 8-28 M140 190 q2-18 -8-28" stroke="${K(t,32,14)}" stroke-width="9" fill="none"/>
    </g>`},zombie(e,t,n){return`<g class="breathe">
      <path d="M62 190 q-16-60 6-96 q-14-2 -10-16 q12-24 34-26 q30 2 40 30 q16 40 4 108 q-18 6 -37 6 q-19 0 -37-6Z" fill="url(#${e}b)"/>
      <path d="M70 62 q26-18 50 4 q-4-28 -26-30 q-20 2 -24 26Z" fill="url(#${e}d)"/>
      ${q(86,74,5,n)}${q(112,78,4,n)}
      <path d="M84 96 q14 8 30 2" stroke="${K(t,22,8)}" stroke-width="4" fill="none"/>
      <path d="M58 116 q-18 26 -10 54 M144 112 q16 28 8 56" stroke="${K(t,28,18)}" stroke-width="11" fill="none"/>
      <path d="M92 130 l16 4 M88 148 l20 4" stroke="${K(t,30,26)}" stroke-width="3" opacity=".8"/>
    </g>`},serpent(e,t,n){return`<g class="breathe">
      <path d="M36 178 q-16-30 12-42 q30-12 58-2 q24 8 22-14 q-2-20 -28-18 q-32 2 -40-20 q-6-18 14-30 q26-14 56 0 l-8 18 q-20-8 -34-2 q-8 4 -2 10 q6 8 26 8 q40 0 44 34 q4 38 -36 42 q-30 4 -52 0 q-20-4 -18 8 q0 8 12 10 l-6 16 q-18-4 -20-18Z" fill="url(#${e}b)"/>
      <path d="M120 30 l24-14 4 18 -14 10Z" fill="url(#${e}d)"/>
      ${q(138,32,5,n)}
      <path d="M60 128 l8-12 8 12 M92 124 l8-12 8 12" fill="none" stroke="${K(t,40,34)}" stroke-width="4"/>
    </g>`},crawler(e,t,n){let r=``;for(let e=0;e<3;e++){let n=56+e*40;r+=`<path d="M${n} 148 q-18 14 -22 40 M${n+16} 148 q18 14 22 40" stroke="${K(t,30,20)}" stroke-width="7" fill="none"/>`}return`<g class="breathe">${r}
      <path d="M34 138 q-8-42 66-46 q74 4 66 46 q-24 24 -66 24 q-42 0 -66-24Z" fill="url(#${e}b)"/>
      <path d="M52 116 q48-22 96 0" stroke="url(#${e}d)" stroke-width="14" fill="none"/>
      ${q(78,118,5,n)}${q(100,112,6.5,n)}${q(122,118,5,n)}
      <path d="M62 148 l-18 18 M138 148 l18 18" stroke="${K(t,36,30)}" stroke-width="6"/>
    </g>`},crab(e,t,n){return`<g class="breathe">
      <path d="M48 160 q-10-56 52-62 q62 6 52 62 q-24 18 -52 18 q-28 0 -52-18Z" fill="url(#${e}b)"/>
      <path d="M60 122 q40-24 80 0" stroke="url(#${e}d)" stroke-width="12" fill="none"/>
      <path d="M40 132 q-26-8 -28-36 q20-4 32 10 l8 12 M160 132 q26-8 28-36 q-20-4 -32 10 l-8 12" fill="url(#${e}b)"/>
      <path d="M22 98 l-10-16 14 2 6 12Z M178 98 l10-16 -14 2 -6 12Z" fill="${K(t,40,34)}"/>
      ${q(86,112,5.5,n)}${q(114,112,5.5,n)}
      <path d="M76 152 q24 10 48 0" stroke="${K(t,30,8)}" stroke-width="4" fill="none"/>
    </g>`},maw(e,t,n){let r=``;for(let e=0;e<6;e++)r+=`<path d="M${56+e*18} 118 l7 16 7-16Z" fill="${K(t,12,85)}"/>`;for(let e=0;e<5;e++)r+=`<path d="M${66+e*18} 156 l7-14 7 14Z" fill="${K(t,12,80)}"/>`;return`<g class="breathe">
      <path d="M40 120 q-8-58 60-62 q70 4 62 62 q4 10 -6 12 q10 30 -18 44 q-38 18 -76 0 q-28-14 -18-44 q-10-2 -4-12Z" fill="url(#${e}b)"/>
      <path d="M52 118 q48 14 96 0 q2 26 -14 36 q-34 14 -68 0 q-16-10 -14-36Z" fill="${K(t,45,5)}"/>
      ${r}
      ${q(76,90,6,n)}${q(126,90,6,n)}
      <g class="hover-float"><path d="M100 58 q-4-26 18-30" stroke="${K(t,30,26)}" stroke-width="4" fill="none"/><circle cx="121" cy="26" r="7" fill="${n}" filter="url(#${e}f)"/></g>
    </g>`},knight(e,t,n){return`<g class="breathe">
      <path d="M62 190 q-8-64 6-96 q-12-26 12-42 q10-8 20-8 q10 0 20 8 q24 16 12 42 q14 32 6 96 q-19 6 -38 6 q-19 0 -38-6Z" fill="url(#${e}b)"/>
      <path d="M78 58 q22-14 44 0 l-4 22 q-18 10 -36 0Z" fill="url(#${e}d)"/>
      <path d="M82 74 q18 8 36 0" stroke="${n}" stroke-width="4" fill="none" class="eye"/>
      <path d="M100 22 q16 6 14 24 l-28 0 q-2-18 14-24Z" fill="${K(t,36,28)}"/>
      <path d="M148 60 l6 96 -12 4 -6-98Z" fill="${K(t,10,72)}" filter="url(#${e}f)"/>
      <path d="M136 60 l30 0 -15 -14Z" fill="${K(t,16,50)}"/>
      <path d="M54 112 q-14 18 -8 44" stroke="${K(t,26,18)}" stroke-width="13" fill="none"/>
    </g>`},siren(e,t,n){return`<g class="breathe">
      <path d="M84 190 q-30-24 -18-64 q8-28 24-40 q-10-16 2-30 q8-8 16-8 q20 8 14 32 q22 16 26 48 q4 36 -30 62 q-16 6 -34 0Z" fill="url(#${e}b)"/>
      <path d="M96 50 q-26-4 -34 22 q-10 30 6 44 q-14-40 28-66Z" fill="url(#${e}d)" opacity=".9"/>
      <path d="M120 52 q28 0 34 30 q6 28 -10 42 q10-44 -24-72Z" fill="url(#${e}d)" opacity=".9"/>
      ${q(96,66,4.5,n)}${q(114,66,4.5,n)}
      <path d="M92 84 q10 6 20 0" stroke="${n}" stroke-width="2.5" fill="none" opacity=".8"/>
      <path d="M66 132 q-22 8 -28 30 M136 128 q22 10 26 32" stroke="${K(t,30,24)}" stroke-width="9" fill="none"/>
    </g>`},leviathan(e,t,n){let r=``;for(let e=0;e<8;e++)r+=`<path d="M${34+e*17} 108 l8 22 8-22Z" fill="${K(t,14,88)}"/>`;for(let e=0;e<7;e++)r+=`<path d="M${44+e*17} 168 l8-20 8 20Z" fill="${K(t,14,82)}"/>`;return`<g class="breathe">
      <path d="M22 108 q-10-72 78-76 q88 4 78 76 l8 10 -12 8 q12 38 -22 54 q-52 26 -104 0 q-34-16 -22-54 l-12-8Z" fill="url(#${e}b)"/>
      <path d="M34 106 q66 18 132 0 q4 34 -18 46 q-48 20 -96 0 q-22-12 -18-46Z" fill="${K(t,50,4)}"/>
      ${r}
      ${q(62,74,8,n)}${q(138,74,8,n)}${q(100,56,5,n)}
      <path d="M10 130 q-8 24 8 40 M190 130 q8 24 -8 40" stroke="${K(t,34,20)}" stroke-width="10" fill="none"/>
      <path d="M56 34 l10-22 12 18 M122 30 l12-20 10 20" fill="none" stroke="${K(t,30,26)}" stroke-width="7"/>
    </g>`},shade(e,t,n){return`<g class="breathe">
      <path d="M58 186 q-4-16 8-22 q-16-60 8-92 q10-16 26-20 q16 4 26 20 q24 32 8 92 q12 6 8 22 q-10-8 -16 2 q-8-10 -14 2 q-6-10 -12-2 q-6-12 -14-2 q-6-10 -18 0Z" fill="url(#${e}b)" opacity=".9"/>
      <path d="M74 66 q26-14 52 2 q0-26 -26-30 q-24 4 -26 28Z" fill="url(#${e}d)"/>
      ${q(88,76,5,n)}${q(114,78,5,n)}
      <path d="M56 108 q-22 16 -26 44 q14-4 22-16 M146 104 q22 18 24 46 q-14-4 -22-16" fill="url(#${e}d)" opacity=".85"/>
      <path d="M40 148 l-8 14 M164 148 l8 14" stroke="${K(t,34,40)}" stroke-width="4"/>
    </g>`},eye(e,t,n){let r=``;for(let e=0;e<7;e++){let n=-150+e*20,i=100+Math.cos(n*Math.PI/180)*62,a=100+Math.sin(n*Math.PI/180)*62,o=100+Math.cos(n*Math.PI/180)*84,s=100+Math.sin(n*Math.PI/180)*84;r+=`<path d="M${i} ${a} Q${o} ${s} ${o+6} ${s+10}" stroke="${K(t,34,24)}" stroke-width="6" fill="none"/>`}return`<g class="breathe">${r}
      <circle cx="100" cy="100" r="58" fill="url(#${e}b)"/>
      <circle cx="100" cy="100" r="44" fill="${K(t,20,88)}"/>
      <circle cx="100" cy="100" r="26" fill="${K(t,60,30)}"/>
      <circle cx="100" cy="100" r="13" fill="#0a0a12" class="eye"/>
      <circle cx="100" cy="100" r="30" fill="url(#${e}g)" opacity=".4"/>
      <circle cx="90" cy="88" r="7" fill="#fff" opacity=".7"/>
      <path d="M78 156 q22 14 44 0 l-6 26 q-16 8 -32 0Z" fill="url(#${e}d)"/>
    </g>`},sovereign(e,t,n){return`<g class="breathe">
      <g class="hover-float">
        <path d="M40 100 l-18 44 12 4Z M160 100 l18 44 -12 4Z M52 76 l-26 20 8 8Z M148 76 l26 20 -8 8Z" fill="url(#${e}d)" opacity=".85"/>
      </g>
      <path d="M64 192 q-12-84 10-124 q10-18 26-22 q16 4 26 22 q22 40 10 124 q-18 6 -36 6 q-18 0 -36-6Z" fill="url(#${e}b)"/>
      <path d="M76 62 q24-14 48 0 q-2-24 -24-28 q-22 4 -24 28Z" fill="url(#${e}d)"/>
      <path d="M74 40 l10-22 8 14 8-20 8 20 8-14 10 22Z" fill="${K(45,70,55)}" filter="url(#${e}f)"/>
      ${q(90,70,4.5,n)}${q(110,70,4.5,n)}
      <circle cx="100" cy="52" r="4" fill="${n}" class="eye"/>
      <path d="M146 78 l4 100 -10 2 -4-100Z" fill="${K(t,20,60)}"/>
      <circle cx="148" cy="72" r="9" fill="${n}" filter="url(#${e}f)" class="eye"/>
      <path d="M56 110 q-16 22 -10 52" stroke="${K(t,26,18)}" stroke-width="12" fill="none"/>
    </g>`}};function eg(e){let t=Jh(),n=K(e.hue,90,66),r=Zh(($h[e.kind]||$h.slime)(t,e.hue,n));return`<svg class="enemy-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    ${Yh(t,e.hue,n)}
    <ellipse cx="100" cy="192" rx="62" ry="9" fill="#000" opacity=".45"/>
    <ellipse class="innerfire" cx="100" cy="112" rx="64" ry="70" fill="url(#${t}g)" opacity=".14"/>
    ${r}
    <g class="cracks"></g>
  </svg>`}var tg=[{hue:225,glow:`#7fd4ff`},{hue:26,glow:`#ffb15a`}];function ng(e=0){let t=Jh(),n=tg[e]||tg[0],r=n.hue,i=n.glow;return`<svg class="hero-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    ${Yh(t,r,i)}
    <ellipse cx="100" cy="192" rx="56" ry="9" fill="#000" opacity=".45"/>
    <ellipse class="innerfire" cx="100" cy="118" rx="58" ry="66" fill="url(#${t}g)" opacity=".12"/>
    ${Zh(`<g class="breathe">
      <path d="M66 188 q-10-70 8-104 q10-20 26-24 q16 4 26 24 q18 34 8 104 q-17 7 -34 7 q-17 0 -34-7Z" fill="url(#${t}b)"/>
      <path d="M74 72 q26-16 52 0 q-4-24 -26-28 q-22 4 -26 28Z" fill="url(#${t}d)"/>
      <path d="M78 78 q22 10 44 0 q-2 24 -22 28 q-20-4 -22-28Z" fill="#0b0e18"/>
      ${q(90,86,4,i)}${q(110,86,4,i)}
      <path d="M144 118 l34-52 7 5 -30 54Z" fill="#cfe6ff" filter="url(#${t}f)"/>
      <path d="M141 124 l14-8 4 8 -12 8Z" fill="${K(45,60,50)}"/>
      <path d="M56 112 q-14 20 -8 46" stroke="${K(r,26,20)}" stroke-width="11" fill="none"/>
      <path d="M64 120 q36 18 72 0" stroke="${K(r,40,30)}" stroke-width="5" fill="none" opacity=".6"/>
    </g>`)}
    <g class="cracks"></g>
  </svg>`}var rg={strike:`⚔`,defend:`⛨`,eclipseSlash:`☾`,twinFangs:`⑂`,quickSlash:`≫`,heavyBlow:`⬇`,cleave:`⋔`,venomStrike:`☠`,lunge:`➹`,guardedStrike:`⛊`,brace:`⛨`,sidestep:`↯`,preparation:`♻`,deflect:`⛉`,leechBlade:`♆`,tempest:`≋`,uppercut:`⇑`,flurry:`⁂`,executioner:`✠`,momentum:`⤴`,bulwark:`☗`,surge:`✦`,toxicMist:`☁`,cripple:`⛓`,warCry:`♯`,fortify:`⧉`,bloodRite:`♥`,empower:`⚔`,agility:`❥`,ironSkin:`⬡`,regrowth:`❋`,oblivionStrike:`✸`,phantomBlades:`⚚`,devour:`♅`,annihilate:`✹`,aegis:`⛨`,offering:`♱`,limitBreak:`⚡`,catalyst:`⚗`,ascension:`☽`,bastion:`♜`,frenzy:`※`,virulence:`☣`,wound:`✂`,burn:`✹`,hex:`♄`,chisel:`◬`,firstSpark:`✧`,ashBite:`☄`,smother:`☁`,quakeblow:`⬲`,resonantLance:`↟`,tithe:`⚖`,pyreheart:`♥`,ashenChoir:`♬`,flawlessForm:`❖`,nightSight:`☾`,novaflare:`✺`,emberdance:`❂`,shardstorm:`❉`},ig=e=>{let t=9;for(let n of e)t=Math.imul(t^n.charCodeAt(0),387420489);return(t^t>>>9)>>>0};function ag(e,t){let n=Jh(),r=ig(e),i={attack:356,skill:205,power:268,status:160,curse:300}[t]??205,a=(i+30+r%40)%360,o=K(i,85,66),s=K(a,80,60),c=r%360,l=``;if(t===`attack`)l=`<path d="M30 120 Q75 40 150 28" stroke="${o}" stroke-width="7" fill="none" opacity=".9"/>
      <path d="M22 96 Q80 60 158 62" stroke="${s}" stroke-width="4" fill="none" opacity=".65"/>
      <path d="M52 132 Q95 78 148 88" stroke="${o}" stroke-width="3" fill="none" opacity=".4"/>`;else if(t===`skill`)l=`<path d="M90 22 q52 10 52 52 q0 44 -52 62 q-52-18 -52-62 q0-42 52-52Z" fill="none" stroke="${o}" stroke-width="6" opacity=".85"/>
      <path d="M90 42 q34 8 34 36 q0 30 -34 44" fill="none" stroke="${s}" stroke-width="3.5" opacity=".6"/>`;else if(t===`power`){let e=``;for(let t=0;t<8;t++){let n=(t*45+c)*(Math.PI/180);e+=`<path d="M${90+Math.cos(n)*24} ${78+Math.sin(n)*24} L${90+Math.cos(n)*52} ${78+Math.sin(n)*52}" stroke="${t%2?s:o}" stroke-width="${t%2?3:5}" opacity=".8"/>`}l=`${e}<circle cx="90" cy="78" r="18" fill="none" stroke="${o}" stroke-width="5"/>`}else l=`<circle cx="90" cy="78" r="40" fill="none" stroke="${o}" stroke-width="5" stroke-dasharray="16 10" opacity=".8"/>
      <path d="M62 106 L118 50" stroke="${s}" stroke-width="5" opacity=".7"/>`;let u=rg[e]||`✦`;return`<svg viewBox="0 0 180 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${n}v" cx="0.5" cy="0.42"><stop offset="0" stop-color="${K(i,45,22)}"/><stop offset="1" stop-color="${K(i,50,7)}"/></radialGradient>
      <filter id="${n}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="180" height="150" fill="url(#${n}v)"/>
    <g filter="url(#${n}f)" transform="rotate(${r%17-8} 90 75)">${l}</g>
    <text x="90" y="97" text-anchor="middle" font-size="58" fill="${K(i,30,88)}" opacity=".92" filter="url(#${n}f)" font-family="serif">${u}</text>
  </svg>`}function og(e){let t=Jh();return`<svg viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="${t}l"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".25" stop-color="${e}"/><stop offset="1" stop-color="${e}" stop-opacity=".75"/></radialGradient>
    <filter id="${t}f" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <path d="M16 6 h8 v9 q10 5 10 17 a14 14 0 1 1 -28 0 q0-12 10-17Z" fill="#1a2030" stroke="#48546e" stroke-width="2"/>
    <path d="M14 20 q-6 5 -6 12 a12 12 0 0 0 24 0 q0-7 -6-12 q-6-4 -12 0Z" fill="url(#${t}l)" filter="url(#${t}f)"/>
    <rect x="15" y="2" width="10" height="6" rx="2" fill="#6b5637"/>
    <circle cx="16" cy="28" r="2.4" fill="#fff" opacity=".8"/>
  </svg>`}function sg(e=!1){let t=Jh();return`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="${t}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <ellipse cx="100" cy="148" rx="70" ry="8" fill="#000" opacity=".5"/>
    ${e?`<rect x="40" y="30" width="120" height="26" rx="10" fill="#4a3521" transform="rotate(-24 40 56)"/><ellipse cx="100" cy="86" rx="52" ry="16" fill="#ffd97a" filter="url(#${t}f)"/>`:`<path d="M40 66 q0-28 60-28 q60 0 60 28 l0 10 -120 0Z" fill="#54401f"/>`}
    <rect x="40" y="74" width="120" height="66" rx="8" fill="#6b4d26"/>
    <rect x="40" y="74" width="120" height="12" fill="#4a3521"/>
    <rect x="90" y="70" width="20" height="30" rx="4" fill="#c9a84c"/>
    <circle cx="100" cy="88" r="5" fill="#332512"/>
    <path d="M48 74 v62 M152 74 v62" stroke="#4a3521" stroke-width="6"/>
  </svg>`}function cg(){let e=Jh();return`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${e}g"><stop offset="0" stop-color="#ffd97a"/><stop offset="1" stop-color="#ff7847" stop-opacity="0"/></radialGradient>
      <filter id="${e}f" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <ellipse cx="100" cy="148" rx="66" ry="8" fill="#000" opacity=".5"/>
    <circle cx="100" cy="108" r="52" fill="url(#${e}g)" opacity=".55" class="fire-glow"/>
    <path d="M56 138 l88 -14 M60 124 l84 16" stroke="#5a4025" stroke-width="10" stroke-linecap="round"/>
    <g class="flame" filter="url(#${e}f)">
      <path d="M100 60 q16 20 10 38 q14-6 12 8 q-2 22 -22 24 q-20-2 -22-24 q-2-14 12-8 q-6-18 10-38Z" fill="#ff9a4d"/>
      <path d="M100 84 q8 12 5 22 q-2 12 -5 12 q-3 0 -5-12 q-3-10 5-22Z" fill="#ffe08a"/>
    </g>
  </svg>`}function lg(){let e=Jh();return`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    ${Yh(e,40,`#ffd166`)}
    <ellipse cx="100" cy="150" rx="64" ry="8" fill="#000" opacity=".5"/>
    <g class="breathe">
      <path d="M56 150 q-8-58 16-84 q12-14 28-16 q16 2 28 16 q24 26 16 84 q-22 6 -44 6 q-22 0 -44-6Z" fill="url(#${e}b)"/>
      <path d="M70 64 q30-18 60 0 l6-10 q-16-16 -36-16 q-20 0 -36 16Z" fill="url(#${e}d)"/>
      <ellipse cx="100" cy="76" rx="20" ry="16" fill="#120d06"/>
      ${q(92,76,3.5,`#ffd166`)}${q(108,76,3.5,`#ffd166`)}
      <path d="M100 96 q14 2 12 14" stroke="#3a2c14" stroke-width="4" fill="none"/>
      <circle cx="140" cy="120" r="14" fill="#c9a84c"/><text x="140" y="126" text-anchor="middle" font-size="16" fill="#3a2c14">¤</text>
    </g>
  </svg>`}function ug(e,t){let n=Jh(),r=K(t,80,66);return`<svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${n}v" cx="0.5" cy="0.4"><stop offset="0" stop-color="${K(t,40,24)}"/><stop offset="1" stop-color="${K(t,45,6)}"/></radialGradient>
      <filter id="${n}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="220" height="160" rx="10" fill="url(#${n}v)"/>
    <circle cx="110" cy="76" r="44" fill="none" stroke="${r}" stroke-width="2" opacity=".5"/>
    <circle cx="110" cy="76" r="56" fill="none" stroke="${r}" stroke-width="1" opacity=".25" stroke-dasharray="4 8"/>
    <text x="110" y="100" text-anchor="middle" font-size="64" fill="${r}" filter="url(#${n}f)" font-family="serif">${e}</text>
  </svg>`}var dg={sword:`<path d="M18.5 5 L10 13.5" stroke-width="3"/><path d="M6.8 11.6 L12.4 17.2" stroke-width="2.2"/><path d="M8.6 15.4 L4.8 19.2" stroke-width="2.6"/>`,skull:`<path d="M12 3.2 a6.8 6.8 0 0 1 6.8 6.8 c0 2.6-1.4 4.4-3 5.5 V18.5 h-7.6 V15.5 c-1.6-1.1-3-2.9-3-5.5 A6.8 6.8 0 0 1 12 3.2 Z" fill="currentColor" stroke="none"/><circle cx="9.4" cy="10" r="1.7" fill="rgba(0,0,0,.8)" stroke="none"/><circle cx="14.6" cy="10" r="1.7" fill="rgba(0,0,0,.8)" stroke="none"/><path d="M10.5 20.8 v-2 M13.5 20.8 v-2" stroke-width="1.8"/>`,crown:`<path d="M4.5 17.5 L5.2 8.5 L9 12 L12 6 L15 12 L18.8 8.5 L19.5 17.5 Z" fill="currentColor" stroke="none"/><path d="M4.5 20 h15" stroke-width="2.2"/>`,chest:`<rect x="4" y="6.5" width="16" height="13" rx="2.2" fill="none" stroke-width="2.2"/><path d="M4 12 h16" stroke-width="1.8"/><rect x="10.4" y="10.2" width="3.2" height="4.4" rx="1" fill="currentColor" stroke="none"/>`,flame:`<path d="M12 2.8 C9.4 7.4 6.8 9.8 6.8 13.6 a5.2 5.2 0 0 0 10.4 0 C17.2 9.8 14.6 7.4 12 2.8 Z" fill="currentColor" stroke="none"/><path d="M12 11.4 c-1.7 2.3-1.7 3.9 0 5.4 1.7-1.5 1.7-3.1 0-5.4 Z" fill="rgba(0,0,0,.5)" stroke="none"/>`,coin:`<circle cx="12" cy="12" r="5.6" fill="none" stroke-width="2.2"/><path d="M5.4 5.4 L8 8 M18.6 5.4 L16 8 M5.4 18.6 L8 16 M18.6 18.6 L16 16" stroke-width="2"/>`,shield:`<path d="M12 2.8 L19 5.8 v5.6 c0 4.6-3.1 7.6-7 9.8 -3.9-2.2-7-5.2-7-9.8 V5.8 Z" fill="none" stroke-width="2.3"/><path d="M12 6.4 v11" stroke-width="1.6" opacity=".55"/>`,cloud:`<path d="M7.2 16.5 a3.9 3.9 0 1 1 .7-7.7 A4.9 4.9 0 0 1 17.4 9.6 a3.4 3.4 0 0 1 -.6 6.9 Z" fill="currentColor" stroke="none"/>`,plus:`<path d="M12 5.2 v13.6 M5.2 12 h13.6" stroke-width="3.4"/>`,up:`<path d="M12 4 L19 12 h-4.1 v8 h-5.8 v-8 H5 Z" fill="currentColor" stroke="none"/>`,cards:`<rect x="4.4" y="5.6" width="9.4" height="13.4" rx="1.8" transform="rotate(-8 9 12.5)" fill="none" stroke-width="2"/><rect x="10.6" y="5" width="9.4" height="13.4" rx="1.8" transform="rotate(7 15.5 11.5)" fill="none" stroke-width="2"/>`,hammer:`<rect x="9.6" y="3.4" width="9.6" height="5.4" rx="1.2" transform="rotate(22 14.5 6)" fill="currentColor" stroke="none"/><path d="M11.6 10.2 L5.2 20" stroke-width="2.6"/>`,scissors:`<path d="M7.6 7.6 L17.5 17.8 M16.4 7.6 L6.5 17.8" stroke-width="2.2"/><circle cx="6" cy="19.2" r="2.2" fill="none" stroke-width="1.8"/><circle cx="18" cy="19.2" r="2.2" fill="none" stroke-width="1.8"/>`,question:`<path d="M8.6 8.6 a3.4 3.4 0 1 1 5 3 c-1.1 .7-1.6 1.4-1.6 2.8" fill="none" stroke-width="2.6"/><circle cx="12" cy="18.6" r="1.7" fill="currentColor" stroke="none"/>`,facet:`<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2.3"/><path d="M12 3.4 v17.2 M4 12 h16" stroke-width="1.2" opacity=".55"/>`,ember:`<path d="M12 3.4 C10 7 8.2 8.8 8.2 11.6 a3.8 3.8 0 0 0 7.6 0 C15.8 8.8 14 7 12 3.4 Z" fill="currentColor" stroke="none"/><circle cx="7" cy="18.4" r="1.4" fill="currentColor" stroke="none" opacity=".8"/><circle cx="12" cy="20" r="1.7" fill="currentColor" stroke="none"/><circle cx="17" cy="18.4" r="1.4" fill="currentColor" stroke="none" opacity=".8"/>`,lantern:`<path d="M9 6.2 h6 M8 6.2 L8 15.6 a4 3 0 0 0 8 0 V6.2" fill="none" stroke-width="2"/><path d="M12 8.4 c-1.5 2-1.5 3.4 0 4.7 1.5-1.3 1.5-2.7 0-4.7 Z" fill="currentColor" stroke="none"/><path d="M10.6 3.6 h2.8 v2.6 h-2.8 Z M10 19.8 h4" stroke-width="1.8"/>`,stagger:`<path d="M12 2.8 L13.8 8.6 L19.8 7 L15.6 11.6 L21 14.8 L14.6 14.9 L15.8 21 L11.9 16.2 L8 21 L9.2 14.9 L3 14.8 L8.4 11.6 L4.2 7 L10.2 8.6 Z" fill="currentColor" stroke="none"/>`,unlitLantern:`<path d="M9 6.2 h6 M8 6.2 L8 15.6 a4 3 0 0 0 8 0 V6.2" fill="none" stroke-width="2" opacity=".65"/><path d="M10.6 3.6 h2.8 v2.6 h-2.8 Z M10 19.8 h4" stroke-width="1.8" opacity=".65"/><path d="M10 10 L14 14 M14 10 L10 14" stroke-width="1.6" opacity=".8"/>`,monument:`<path d="M9.5 20 L10.2 6.5 L12 3.4 L13.8 6.5 L14.5 20 Z" fill="currentColor" stroke="none"/><path d="M6 20.6 h12" stroke-width="2.2"/><path d="M12 8.6 c-1.2 1.6-1.2 2.7 0 3.8 1.2-1.1 1.2-2.2 0-3.8 Z" fill="rgba(0,0,0,.55)" stroke="none"/>`,heart:`<path d="M12 6.4 C9.4 3.6 5.2 5.6 5.2 9.4 a4.8 4.8 0 0 0 7 4.2 4.8 4.8 0 0 0 7-4.2 C19.2 5.6 15 3.6 12 6.4 Z" fill="currentColor" stroke="none"/>`,"st-str":`<path d="M12 3 C9 8 7 10 7 13.6 a5 5 0 0 0 10 0 C17 10 15 8 12 3 Z" fill="currentColor" stroke="none"/><path d="M8.5 19.5 L15.5 15.5 M8.5 15.5 L15.5 19.5" stroke-width="2.4"/>`,"st-dex":`<path d="M12 3.4 L18.5 6.2 v5.2 c0 4.2-2.9 7-6.5 9 -3.6-2-6.5-4.8-6.5-9 V6.2 Z" fill="none" stroke-width="2.2"/><path d="M12 7.5 L14 11 L12 14.5 L10 11 Z" fill="currentColor" stroke="none"/>`,"st-vulnerable":`<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2.2"/><path d="M9 9 L15 15 M15 9 L9 15" stroke-width="1.8"/>`,"st-weak":`<path d="M12 4 v10 M12 20 L7.5 14.5 M12 20 L16.5 14.5" stroke-width="2.6"/>`,"st-frail":`<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2"/><path d="M12 3.4 L10 9 L14 13 L11 17 L12 20.6" fill="none" stroke-width="1.6"/>`,"st-poison":`<path d="M12 3.6 C9.5 8 7.6 10.4 7.6 13.4 a4.4 4.4 0 0 0 8.8 0 C16.4 10.4 14.5 8 12 3.6 Z" fill="currentColor" stroke="none"/><circle cx="8" cy="19.6" r="1.5" fill="currentColor" stroke="none"/><circle cx="13" cy="20.4" r="1.2" fill="currentColor" stroke="none" opacity=".8"/>`,"st-thorns":`<circle cx="12" cy="12" r="4.2" fill="none" stroke-width="2"/><path d="M12 7.8 V3.4 M12 16.2 V20.6 M7.8 12 H3.4 M16.2 12 H20.6 M9 9 L6 6 M15 15 L18 18 M15 9 L18 6 M9 15 L6 18" stroke-width="2"/>`,"st-ritual":`<path d="M15.5 3.8 a8.6 8.6 0 1 0 4.7 12 a7 7 0 1 1 -4.7 -12 Z" fill="currentColor" stroke="none"/>`,"st-metallicize":`<path d="M12 3.2 L19.4 7.5 v9 L12 20.8 L4.6 16.5 v-9 Z" fill="none" stroke-width="2.3"/><path d="M12 8 L15.5 10 v4 L12 16 L8.5 14 v-4 Z" fill="currentColor" stroke="none"/>`,"st-regen":`<path d="M12 4.2 C8 8.4 6.2 10.6 6.2 13.8 a5.8 5.8 0 0 0 11.6 0 C17.8 10.6 16 8.4 12 4.2 Z" fill="none" stroke-width="2.2"/><path d="M12 9 v6 M9 12 h6" stroke-width="2"/>`,"st-barricade":`<path d="M5 20 v-9 L12 4 l7 7 v9 h-4.6 v-5.4 h-4.8 V20 Z" fill="currentColor" stroke="none"/>`,"st-energized":`<path d="M13.4 3 L6 13.4 h4.4 L10 21 L18 10.6 h-4.4 Z" fill="currentColor" stroke="none"/>`,"st-venomous":`<path d="M7 5 q5 3 10 0 q-1 5 -3.4 7 L15 19 a3 3 0 1 1 -6 0 l1.4-7 Q8 10 7 5 Z" fill="currentColor" stroke="none"/><circle cx="12" cy="18" r="1.4" fill="rgba(0,0,0,.7)" stroke="none"/>`,"st-rampage":`<path d="M4 18 L10 12 L13 15 L20 7" fill="none" stroke-width="2.6"/><path d="M15.5 6.5 H20.5 V11.5" fill="none" stroke-width="2.4"/>`,"st-beacon":`<circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none"/><path d="M12 5.4 V2.8 M12 21.2 V18.6 M5.4 12 H2.8 M21.2 12 H18.6 M7.4 7.4 L5.6 5.6 M16.6 16.6 L18.4 18.4 M16.6 7.4 L18.4 5.6 M7.4 16.6 L5.6 18.4" stroke-width="2"/>`,"st-emberflow":`<path d="M12 4 C10 7.4 8.6 9.2 8.6 11.6 a3.4 3.4 0 0 0 6.8 0 C15.4 9.2 14 7.4 12 4 Z" fill="currentColor" stroke="none"/><path d="M7 17.5 q2.5 2 5 0 q2.5 -2 5 0 M7 20.5 q2.5 2 5 0 q2.5 -2 5 0" fill="none" stroke-width="1.7"/>`,"st-nightsight":`<path d="M16.8 4 a9 9 0 1 0 3.4 13 a7.4 7.4 0 1 1 -3.4 -13 Z" fill="currentColor" stroke="none"/><circle cx="15.6" cy="9" r="1.6" fill="currentColor" stroke="none"/>`,"art-flare":`<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/><path d="M12 6.6 L13.4 9.4 M12 6.6 L10.6 9.4 M12 6.6 V2.8 M17.4 12 h3.8 M12 17.4 v3.8 M2.8 12 h3.8 M15.8 8.2 L18.4 5.6 M15.8 15.8 L18.4 18.4 M8.2 15.8 L5.6 18.4 M8.2 8.2 L5.6 5.6" stroke-width="2"/>`,"art-mendglass":`<path d="M12 3.4 L19 12 L12 20.6 L5 12 Z" fill="none" stroke-width="2"/><path d="M12 8.4 v7.2 M8.4 12 h7.2" stroke-width="2.2"/>`,"art-beacon":`<path d="M9 6 h6 M8 6 v9.4 a4 3.2 0 0 0 8 0 V6" fill="none" stroke-width="2"/><path d="M12 8.2 c-1.6 2.1-1.6 3.6 0 5 1.6-1.4 1.6-2.9 0-5 Z" fill="currentColor" stroke="none"/><path d="M4.5 10 L2.5 9 M19.5 10 L21.5 9 M10 20 h4" stroke-width="1.8"/>`,"art-emberveil":`<path d="M12 3.2 L19 6 v5.6 c0 4.6-3.1 7.6-7 9.8 -3.9-2.2-7-5.2-7-9.8 V6 Z" fill="none" stroke-width="2.2"/><path d="M12 8 c-1.8 2.4-1.8 4 0 5.6 1.8-1.6 1.8-3.2 0-5.6 Z" fill="currentColor" stroke="none"/>`,"art-stoke":`<path d="M12 3.4 C9.2 8 7.4 10.2 7.4 13.4 a4.6 4.6 0 0 0 9.2 0 C16.6 10.2 14.8 8 12 3.4 Z" fill="currentColor" stroke="none"/><path d="M6 20.6 h12" stroke-width="2.4"/><path d="M9 17.8 L7 20.6 M15 17.8 L17 20.6" stroke-width="1.8"/>`,"art-ashfall":`<path d="M7.4 13.5 a3.9 3.9 0 1 1 .7-7.7 A4.9 4.9 0 0 1 17.6 6.6 a3.4 3.4 0 0 1 -.6 6.9 Z" fill="currentColor" stroke="none"/><path d="M8 16.5 v1.6 M12 16.5 v2.6 M16 16.5 v1.6 M10 20.2 v1 M14 20.2 v1" stroke-width="1.9"/>`,"boon-fullPurse":`<path d="M8 7 q4 -4 8 0 l2.4 8.6 a3 3 0 0 1 -2.9 3.8 H8.5 a3 3 0 0 1 -2.9 -3.8 Z" fill="currentColor" stroke="none"/><path d="M9.5 7 h5" stroke-width="2"/><circle cx="12" cy="13.5" r="2.2" fill="rgba(0,0,0,.6)" stroke="none"/>`,"boon-temperedGlass":`<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2.4"/><path d="M12 7 L16.5 12 L12 17 L7.5 12 Z" fill="currentColor" stroke="none"/>`,"boon-keenEye":`<path d="M2.8 12 q4.6 -6.4 9.2 -6.4 q4.6 0 9.2 6.4 q-4.6 6.4 -9.2 6.4 q-4.6 0 -9.2 -6.4 Z" fill="none" stroke-width="2"/><circle cx="12" cy="12" r="2.8" fill="currentColor" stroke="none"/>`,"boon-warmHearth":`<path d="M5 20 v-8.5 L12 5 l7 6.5 V20 h-5 v-5 h-4 v5 Z" fill="none" stroke-width="2.2"/><path d="M12 11.4 c-1.2 1.6-1.2 2.8 0 4 1.2-1.2 1.2-2.4 0-4 Z" fill="currentColor" stroke="none"/>`,"boon-emberFlask":`<path d="M10 3.4 h4 M11 3.4 v4.2 L6.8 15 a3.6 3.6 0 0 0 3.2 5.4 h4 A3.6 3.6 0 0 0 17.2 15 L13 7.6 V3.4" fill="none" stroke-width="2"/><path d="M12 11 c-1.4 1.8-1.4 3.2 0 4.6 1.4-1.4 1.4-2.8 0-4.6 Z" fill="currentColor" stroke="none"/>`,"boon-twinPhials":`<path d="M7.6 3.8 h3 M9.1 3.8 v3.4 L6.4 13 a2.8 2.8 0 0 0 2.5 4.1 h0.4 A2.8 2.8 0 0 0 11.8 13 L9.1 7.2" fill="none" stroke-width="1.8"/><path d="M13.4 6.8 h3 M14.9 6.8 v3.4 L12.2 16 a2.8 2.8 0 0 0 2.5 4.1 h0.4 A2.8 2.8 0 0 0 17.6 16 L14.9 10.2" fill="none" stroke-width="1.8"/>`,"boon-pilgrimsCache":`<rect x="4.5" y="8" width="15" height="11" rx="2" fill="none" stroke-width="2.2"/><path d="M4.5 12.5 h15 M9 8 q3 -5 6 0" fill="none" stroke-width="1.8"/><rect x="10.6" y="11" width="2.8" height="3.6" rx="0.8" fill="currentColor" stroke="none"/>`,"boon-venomPouch":`<path d="M7.5 6.5 q4.5 -3.4 9 0 l1.6 9.1 a3 3 0 0 1 -3 3.5 H8.9 a3 3 0 0 1 -3 -3.5 Z" fill="none" stroke-width="2.1"/><path d="M12 9.6 c-1.5 2-1.5 3.4 0 4.8 1.5-1.4 1.5-2.8 0-4.8 Z" fill="currentColor" stroke="none"/><circle cx="12" cy="17.4" r="1" fill="currentColor" stroke="none"/>`,"omen-ashfall":`<path d="M7.2 12.5 a3.9 3.9 0 1 1 .7-7.7 A4.9 4.9 0 0 1 17.4 5.6 a3.4 3.4 0 0 1 -.6 6.9 Z" fill="currentColor" stroke="none"/><circle cx="8" cy="16.4" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="18.8" r="1.3" fill="currentColor" stroke="none"/><circle cx="16" cy="16.4" r="1.1" fill="currentColor" stroke="none"/>`,"omen-heavyAir":`<path d="M4 6.5 h16 M6 10.5 h12 M8 14.5 h8" stroke-width="2.2"/><path d="M12 21 L8.5 16.8 h7 Z" fill="currentColor" stroke="none"/>`,"omen-thinGlass":`<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="1.4"/><path d="M12 3.4 L11 8.5 L13.5 11 L10.5 14 L12 20.6 M4 12 L8.5 11 M20 12 L15 13.5" fill="none" stroke-width="1.2"/>`,"omen-hungryDark":`<path d="M17 3.6 a9.4 9.4 0 1 0 3.6 14 a7.6 7.6 0 1 1 -3.6 -14 Z" fill="currentColor" stroke="none"/><circle cx="14.8" cy="8.4" r="1" fill="currentColor" stroke="none"/><circle cx="17.8" cy="12.8" r="0.8" fill="currentColor" stroke="none"/>`,"omen-emberWind":`<path d="M3.5 9 q6 -2.4 10 0 q3 1.8 7 0.4" fill="none" stroke-width="2"/><path d="M3.5 14 q6 -2.4 10 0 q3 1.8 7 0.4" fill="none" stroke-width="2" opacity=".7"/><circle cx="17.5" cy="6.4" r="1.3" fill="currentColor" stroke="none"/><circle cx="6.5" cy="17.6" r="1.1" fill="currentColor" stroke="none"/>`,"omen-longNight":`<path d="M12 2.8 L13.7 8 L19 8.1 L14.8 11.3 L16.3 16.5 L12 13.4 L7.7 16.5 L9.2 11.3 L5 8.1 L10.3 8 Z" fill="currentColor" stroke="none"/><path d="M5 20.6 h14" stroke-width="1.8" opacity=".7"/>`,"omen-waningMoon":`<circle cx="12" cy="12" r="8" fill="none" stroke-width="2"/><path d="M12 4 a8 8 0 0 1 0 16 a11 11 0 0 0 0 -16 Z" fill="currentColor" stroke="none"/>`},fg=e=>!!dg[e],pg=e=>`<g fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${dg[e]||``}</g>`;function J(e,t=18){return`<svg class="gicon" width="${t}" height="${t}" viewBox="0 0 24 24" aria-hidden="true">${pg(e)}</svg>`}function mg(e,t=18){let n=t/24;return`<g transform="translate(${-t/2},${-t/2}) scale(${n})">${pg(e)}</g>`}var hg=`spirebound_vigil_v1`,gg=`spirebound_stats_v1`,_g=null,vg=new Map;function yg(){if(_g)return _g;try{if(typeof localStorage<`u`)return _g=localStorage}catch{}return _g={getItem:e=>vg.has(e)?vg.get(e):null,setItem:(e,t)=>vg.set(e,t),removeItem:e=>vg.delete(e)}}var bg={runs:0,wins:0,slain:0,shatters:0,kindles:0,perfects:0,smolderKills:0,unlitVisited:0,embersSpent:0,bestVow:0,bestFloor:0};function xg(){let e=null;try{e=yg().getItem(hg)}catch{}let t=null;try{t=JSON.parse(e)}catch{}let n={v:1,deeds:{},unlocks:[],vowUnlocked:0,lastFall:null,...t||{}};if(n.deeds={...bg,...n.deeds||{}},Array.isArray(n.unlocks)||(n.unlocks=[]),e==null){try{let e=JSON.parse(yg().getItem(gg));e&&(n.deeds.runs=e.runs||0,n.deeds.wins=e.wins||0)}catch{}n.deeds.wins>0&&(n.vowUnlocked=1)}return n}function Sg(e){try{yg().setItem(hg,JSON.stringify(e))}catch{}}function Cg(e){let t=[];for(let n of Object.values(Uu))if((e.deeds[n.stat]||0)>=n.n)for(let r of n.unlocks)!e.unlocks.includes(r)&&!t.includes(r)&&t.push(r);return t}function wg(){let e=xg(),t=Cg(e);return t.length&&(e.unlocks.push(...t),Sg(e)),e}function Tg(e,t){if(e.vigilCommitted)return{vigil:xg(),newUnlocks:[]};e.vigilCommitted=!0;let n=xg();n.deeds.runs++,t&&(n.deeds.wins++,n.deeds.bestVow=Math.max(n.deeds.bestVow,e.vow||0),n.vowUnlocked=Math.max(n.vowUnlocked,Math.min(5,(e.vow||0)+1))),n.deeds.bestFloor=Math.max(n.deeds.bestFloor,e.act*15+e.floorsClimbed),n.deeds.slain+=e.stats.slain||0;for(let t of[`shatters`,`kindles`,`perfects`,`smolderKills`,`unlitVisited`,`embersSpent`])n.deeds[t]+=e.stats[t]||0;let r=Cg(n);return n.unlocks.push(...r),Sg(n),{vigil:n,newUnlocks:r}}function Eg(e,t,n){let r=xg();r.lastFall={act:e,row:t,bequest:n},Sg(r)}function Dg(){let e=xg();e.lastFall=null,Sg(e)}var Og={starter:0,special:0,common:1,uncommon:2,rare:3,boss:4};function kg(e){let t=[],n=e.player.relics.filter(e=>Mu[e]&&Mu[e].rarity!==`starter`);if(n.length){let e=[...n].sort((e,t)=>Og[Mu[t].rarity]-Og[Mu[e].rarity])[0];t.push({kind:`relic`,id:e})}let r=e.player.deck.filter(e=>{let t=ku[e.id];return t&&t.rarity!==`starter`&&t.rarity!==`special`});if(r.length){let e=[...r].sort((e,t)=>Og[ku[t.id].rarity]-Og[ku[e.id].rarity]||(t.up===e.up?0:t.up?1:-1))[0];t.push({kind:`card`,id:e.id,up:!!e.up})}return e.player.gold>=25&&t.push({kind:`gold`,amount:Math.min(e.player.gold,75)}),t}var Ag=null,jg=null,Mg=null,Ng=[],Pg=localStorage.getItem(`spirebound_mute`)===`1`;function Fg(){if(Ag)return!0;try{Ag=new(window.AudioContext||window.webkitAudioContext),jg=Ag.createGain(),jg.gain.value=Pg?0:.5,jg.connect(Ag.destination)}catch{return!1}return!0}function Ig(){Fg()&&Ag.state===`suspended`&&Ag.resume()}function Lg(){return Pg}function Rg(){return Pg=!Pg,localStorage.setItem(`spirebound_mute`,Pg?`1`:`0`),jg&&jg.gain.linearRampToValueAtTime(Pg?0:.5,Ag.currentTime+.1),Pg}function zg(e,t,n,r,i){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(r,t+n),e.gain.exponentialRampToValueAtTime(1e-4,t+n+i)}function Y(e,{type:t=`sine`,a:n=.005,d:r=.2,peak:i=.3,slide:a=0,delay:o=0}={}){if(!Fg())return;let s=Ag.currentTime+o,c=Ag.createOscillator(),l=Ag.createGain();c.type=t,c.frequency.setValueAtTime(e,s),a&&c.frequency.exponentialRampToValueAtTime(Math.max(20,e+a),s+n+r),zg(l,s,n,i,r),c.connect(l).connect(jg),c.start(s),c.stop(s+n+r+.05)}function Bg({a:e=.002,d:t=.15,peak:n=.25,f0:r=800,f1:i=300,q:a=1,type:o=`bandpass`,delay:s=0}={}){if(!Fg())return;let c=Ag.currentTime+s,l=Math.ceil(Ag.sampleRate*(e+t+.05)),u=Ag.createBuffer(1,l,Ag.sampleRate),d=u.getChannelData(0);for(let e=0;e<l;e++)d[e]=Math.random()*2-1;let f=Ag.createBufferSource();f.buffer=u;let p=Ag.createBiquadFilter();p.type=o,p.Q.value=a,p.frequency.setValueAtTime(r,c),p.frequency.exponentialRampToValueAtTime(Math.max(40,i),c+e+t);let m=Ag.createGain();zg(m,c,e,n,t),f.connect(p).connect(m).connect(jg),f.start(c),f.stop(c+e+t+.05)}var X={click:()=>{Y(660,{type:`triangle`,d:.05,peak:.12})},hover:()=>{Y(880,{type:`sine`,d:.03,peak:.05})},card:()=>{Bg({d:.12,f0:1800,f1:500,peak:.14})},draw:()=>{Bg({d:.08,f0:2400,f1:900,peak:.08})},slash:()=>{Bg({d:.18,f0:3200,f1:300,peak:.3,q:1.4}),Y(180,{type:`sine`,d:.12,peak:.25,slide:-120})},hit:()=>{Y(120,{type:`sine`,d:.22,peak:.4,slide:-70}),Bg({d:.1,f0:500,f1:120,peak:.2,type:`lowpass`})},blocked:()=>{Y(320,{type:`square`,d:.08,peak:.1}),Bg({d:.1,f0:4e3,f1:2e3,peak:.1,q:6})},block:()=>{Y(240,{type:`triangle`,d:.12,peak:.18}),Y(360,{type:`triangle`,d:.1,peak:.1,delay:.03})},poison:()=>{Y(300,{type:`sine`,d:.2,peak:.14,slide:-160}),Bg({d:.22,f0:900,f1:300,peak:.08,q:3})},debuff:()=>{Y(420,{type:`sawtooth`,d:.25,peak:.08,slide:-220})},buff:()=>{Y(392,{type:`triangle`,d:.14,peak:.14}),Y(523,{type:`triangle`,d:.16,peak:.14,delay:.07})},heal:()=>{Y(523,{type:`sine`,d:.2,peak:.14}),Y(659,{type:`sine`,d:.24,peak:.12,delay:.09}),Y(784,{type:`sine`,d:.3,peak:.1,delay:.18})},energy:()=>{Y(700,{type:`triangle`,d:.1,peak:.12,slide:300})},coin:()=>{Y(988,{type:`square`,d:.06,peak:.08}),Y(1319,{type:`square`,d:.12,peak:.08,delay:.06})},potion:()=>{Y(500,{type:`sine`,d:.12,peak:.14,slide:300}),Bg({d:.14,f0:1200,f1:2600,peak:.06})},death:()=>{Y(90,{type:`sawtooth`,d:.5,peak:.22,slide:-50}),Bg({d:.4,f0:600,f1:60,peak:.18,type:`lowpass`})},bigDeath:()=>{Y(60,{type:`sawtooth`,d:1.1,peak:.32,slide:-30}),Bg({d:.9,f0:900,f1:40,peak:.26,type:`lowpass`})},turn:()=>{Y(392,{type:`triangle`,d:.1,peak:.1}),Y(587,{type:`triangle`,d:.14,peak:.1,delay:.08})},victory:()=>{[523,659,784,1047].forEach((e,t)=>Y(e,{type:`triangle`,d:.35,peak:.16,delay:t*.13}))},defeat:()=>{[330,277,220,165].forEach((e,t)=>Y(e,{type:`sawtooth`,d:.5,peak:.12,delay:t*.22}))},relic:()=>{[659,831,988].forEach((e,t)=>Y(e,{type:`sine`,d:.3,peak:.12,delay:t*.09}))},upgrade:()=>{Y(440,{type:`triangle`,d:.15,peak:.14}),Y(880,{type:`triangle`,d:.3,peak:.12,delay:.1})},map:()=>{Bg({d:.25,f0:500,f1:1500,peak:.06}),Y(330,{type:`sine`,d:.2,peak:.08})},chip:()=>{Y(1420,{type:`triangle`,d:.05,peak:.14}),Bg({d:.06,f0:5200,f1:3200,peak:.1,q:5})},shatter:()=>{Bg({d:.42,f0:4200,f1:260,peak:.3,q:3.5}),Y(220,{type:`sine`,d:.3,peak:.24,slide:-140}),Y(1760,{type:`triangle`,d:.18,peak:.1,delay:.03})},ember:()=>{Y(520,{type:`sine`,d:.12,peak:.12,slide:220})},kindle:()=>{Bg({d:.3,f0:900,f1:2600,peak:.1}),Y(392,{type:`sine`,d:.22,peak:.1,slide:140})},stagger:()=>{Y(233,{type:`sawtooth`,d:.38,peak:.1}),Y(247,{type:`sawtooth`,d:.38,peak:.1,delay:.02})},art:()=>{[392,494,587].forEach((e,t)=>Y(e,{type:`triangle`,d:.28,peak:.13,delay:t*.07})),Bg({d:.35,f0:1400,f1:3200,peak:.07})},omen:()=>{Y(98,{type:`sine`,d:1.1,peak:.2}),Y(196,{type:`sine`,d:.9,peak:.1,delay:.12}),Y(147,{type:`triangle`,d:.8,peak:.06,delay:.3})}},Vg=[55,49,41.2];function Hg(e){if(!Fg())return;Ug(),Mg=Ag.createGain(),Mg.gain.value=0,Mg.connect(jg);let t=Vg[e]||55,n=Ag.createBiquadFilter();n.type=`lowpass`,n.frequency.value=320,n.Q.value=.6,n.connect(Mg);for(let[e,r,i]of[[1,0,.5],[1.5,3,.22],[2,-4,.3],[3,2,.1]]){let a=Ag.createOscillator(),o=Ag.createGain();a.type=`sawtooth`,a.frequency.value=t*e,a.detune.value=r,o.gain.value=i,a.connect(o).connect(n),a.start(),Ng.push(a,o)}let r=Ag.createOscillator(),i=Ag.createGain();r.frequency.value=.07,i.gain.value=90,r.connect(i).connect(n.frequency),r.start(),Ng.push(r,i,n),Mg.gain.linearRampToValueAtTime(.11,Ag.currentTime+3)}function Ug(){if(!Mg)return;let e=Mg,t=Ng;e.gain.linearRampToValueAtTime(0,Ag.currentTime+1.2),setTimeout(()=>{t.forEach(e=>{try{e.stop?.()}catch{}try{e.disconnect()}catch{}});try{e.disconnect()}catch{}},1500),Mg=null,Ng=[]}var Wg={shared:{sizes:{normal:185,elite:230,boss:280},heroes:{ashwarden:{scale:1,footY:0},duskblade:{scale:1,footY:-30}},enemies:{abyssalKnight:{scale:1.3,footY:-20},alphaFang:{scale:2,footX:-30,footY:-60},ashAcolyte:{scale:.95,footY:0},chaosHound:{scale:1.05,footY:0},deepmaw:{scale:1.14,footY:0},drownedOne:{scale:.8,footY:0},duskfang:{scale:.95,footY:0},gloomslime:{scale:.95,footY:0},gravewarden:{scale:2.5,footX:-40,footY:-50},heraldOfEnd:{scale:2.3,footX:-50,footY:0},leviathan:{scale:4,footX:-150,footY:-200},mirelurker:{scale:.9,footY:0},obsidianGolem:{scale:1.3,footY:0},rootheart:{scale:2.6,footX:-50,footY:-70},shade:{scale:1.1,footY:0},shellback:{scale:1.09,footY:0},siren:{scale:1.6,footX:-10,footY:-20},sovereign:{scale:1.45,footX:-100,footY:50},sporeling:{scale:.62,footY:0},starCultist:{scale:1,footY:0},thornling:{scale:.81,footY:0},tidecaller:{scale:1,footY:0},voidColossus:{scale:2.5,footX:-50,footY:0},voidWisp:{scale:.67,footY:0},voltEel:{scale:1.1,footY:0},watcherEye:{scale:1.1,footY:0},waylayer:{scale:.9,footY:0}}},base:{groundY:232,ledgeLip:14,hero:{x:179,w:190,h:285},slots:{1:[{x:980,s:1}],2:[{x:820,s:1},{x:1035,s:1}],3:[{x:698,y:42,s:1},{x:845,y:-18,s:1},{x:996,y:26,s:1}]},layers:{backdrop:{h:640,y:0,zoom:1,posX:50,opacity:.85},mid:{h:1e3,y:300,x:100,zoom:.4,posX:100,opacity:.95},ledge:{h:450,y:0,zoom:1,posX:100,opacity:1}}},shapes:{"phone-portrait":{groundY:250,hero:{x:42,w:80,h:130},slots:{1:[{x:300,s:.5,footX:0,footY:0}],2:[{x:248,s:.65},{x:349,s:.7}],3:[{x:218,s:.5},{x:298,y:32,s:.5},{x:357,s:.55}]},layers:{backdrop:{h:658,y:315,x:100,zoom:.9,posX:50,opacity:.6,drift:20},mid:{h:489,y:315,zoom:.5,posX:50,opacity:.95,drift:5},ledge:{h:600,y:0,zoom:.7,posX:50,opacity:1}},acts:{1:{slots:{1:[{x:300,s:.5,footX:0,footY:-30}]},layers:{backdrop:{x:0},ledge:{h:500,opacity:.6}}},2:{layers:{backdrop:{h:1e3},mid:{y:260,x:-50},ledge:{h:450,opacity:.8}}}}},"phone-landscape":{groundY:132,hero:{x:135,w:100,h:150},slots:{1:[{x:730,s:.5,footX:-150,footY:-40}],2:[{x:590,s:.62},{x:730,s:.62}],3:[{x:503,y:19,s:.55},{x:628,y:-2,s:.55},{x:740,y:19,s:.55}]},layers:{backdrop:{h:700,y:150,zoom:1,posX:100,opacity:.85,drift:20},mid:{h:600,y:170,zoom:.4,posX:100,opacity:.95,drift:10},ledge:{h:275,y:0,zoom:1,posX:50,opacity:1}},acts:{1:{groundY:132,layers:{backdrop:{h:1e3,y:180,zoom:.6,opacity:.6},mid:{zoom:.5},ledge:{h:220,opacity:.7}}},2:{groundY:160,layers:{backdrop:{zoom:.8},mid:{y:160,x:-200},ledge:{h:200}}}}},"pad-portrait":{groundY:359,hero:{x:102},slots:{1:[{x:655,s:1,footX:0}],2:[{x:505,s:.95},{x:710,s:1}],3:[{x:410,y:34,s:.85},{x:560,y:-87,s:.85},{x:730,y:2,s:.9}]},layers:{backdrop:{h:920,y:450,zoom:.8,posX:50,opacity:.85,drift:30},mid:{h:684,y:430,x:50,zoom:.6,posX:50,opacity:.95,drift:10},ledge:{h:400,y:0,zoom:1.5,posX:50,opacity:1}},acts:{1:{layers:{backdrop:{opacity:.55},mid:{y:460},ledge:{h:400,zoom:1.3,opacity:.6}}},2:{layers:{backdrop:{h:1600,opacity:.7},mid:{y:400,x:-150},ledge:{h:410,zoom:1.2,opacity:.6}}}}},"pad-landscape":{layers:{backdrop:{y:0,drift:30}},acts:{0:{layers:{backdrop:{y:280},mid:{y:300,drift:10}}},1:{groundY:220,layers:{backdrop:{h:800,y:280,x:-50,zoom:.9},mid:{zoom:.5,drift:10},ledge:{h:350,opacity:.7}}},2:{layers:{backdrop:{h:800,y:300},mid:{y:200,x:-300,zoom:.5,drift:10},ledge:{h:320,opacity:.9}}}}},"desktop-landscape":{groundY:216,hero:{x:212},slots:{1:[{x:1164,y:-16,s:1}],2:[{x:1066,y:5,s:1},{x:1197,y:-39,s:1}],3:[{x:940,y:17,s:1},{x:1095,y:-50,s:1},{x:1260,y:22,s:1}]},layers:{backdrop:{h:1527,y:273,x:-42,zoom:.6},mid:{h:1e3,y:308,x:189,zoom:.4,drift:0},ledge:{h:480,y:0,posY:0}},acts:{0:{layers:{backdrop:{h:1e3,y:280,x:-100,zoom:.9,posX:100,opacity:.7,drift:30},mid:{drift:10}}},1:{layers:{backdrop:{h:1200,y:250,x:-150,zoom:.8,posX:100,opacity:.5,drift:30},mid:{y:280,x:100,zoom:.6,opacity:.9,drift:10},ledge:{h:360,opacity:.4}}},2:{layers:{backdrop:{h:1100,y:270,zoom:1,drift:30},mid:{y:200,x:-300,zoom:.5,drift:15},ledge:{h:330,posX:100,opacity:.8}}}}}}},Gg=e=>e&&typeof e==`object`&&!Array.isArray(e);function Kg(e,t){if(t===void 0)return e;if(!Gg(e)||!Gg(t))return t;let n={...e};for(let r of Object.keys(t))n[r]=Kg(e[r],t[r]);return n}var qg={backdrop:{x:0,posY:100,drift:6},mid:{x:0,posY:100,drift:3},ledge:{x:0,posY:0,drift:0}};function Jg(e){if(!e||typeof e!=`object`)return e;let{acts:t,...n}=e;return n}function Yg(e,t){let n=String(t);return Wg.shapes?.[e]?.acts?.[n]??(e===`pad-landscape`?Wg.base?.acts?.[n]:void 0)??Wg.acts?.[n]}function Xg(e,t=0){let n=Jg(Wg.shapes?.[e]),r=Kg(Kg(Jg(Wg.base),n),Yg(e,t)),i={};for(let e of[`backdrop`,`mid`,`ledge`])i[e]={...qg[e],...r.layers?.[e]??{}};return{...r,layers:i,shared:Wg.shared}}function Zg(e){return e.hero?.y??0}function Qg(e,t){return{scale:1,footX:0,footY:0,...Wg.shared?.[e]?.[t]??{}}}function $g(e,t){let n=e.slots?.[t];if(n)return n;let r=Object.keys(e.slots??{}).map(Number).filter(Number.isFinite).sort((e,t)=>e-t);if(!r.length)return Array.from({length:t},(e,t)=>({x:200+t*200,s:1}));let i=e.slots[r[r.length-1]],a=i[0],o=i[i.length-1];return Array.from({length:t},(e,n)=>{let r=t===1?1:n/(t-1);return{x:Math.round(a.x+(o.x-a.x)*r),s:Math.min(a.s??1,o.s??1),y:Math.round((a.y??0)+((o.y??0)-(a.y??0))*r)}})}function e_(e,t){return e?.footX??Qg(`enemies`,t).footX}function t_(e,t){return e?.footY??Qg(`enemies`,t).footY}function n_(e,t){let n=e.map((e,n)=>({i:n,bottom:(e?.y??0)+t_(e,t[n])}));n.sort((e,t)=>t.bottom-e.bottom);let r=Array(e.length);return n.forEach((e,t)=>{r[e.i]=t+1}),r}function r_(e,t,n,r,i,a){let o=Qg(`enemies`,t),s=(e.shared.sizes?.[n]??185)*o.scale*(r?.s??1);return Math.round(Math.max(8,s))}var Z={run:null,cb:null,screen:`title`,targeting:null,busy:!1,hoveredCard:null,ce:null,drag:null},i_=new URLSearchParams(location.search).get(`input`),a_=i_?i_===`touch`:matchMedia(`(pointer: coarse)`).matches,o_=i_?i_===`mouse`:matchMedia(`(hover: hover) and (pointer: fine)`).matches,Q=(e,t=document)=>t.querySelector(e),s_=(e,t=document)=>[...t.querySelectorAll(e)],c_=e=>new Promise(t=>setTimeout(t,e)),l_=()=>Q(`#screen`);function $(e,t=``,n=``){let r=document.createElement(e);return t&&(r.className=t),n&&(r.innerHTML=n),r}var u_=e=>String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]),d_=(e,t,n)=>{let r=Gh(e,t);return r?`<img class="raster-art" src="${r}" alt="">`:n};function f_(){let e=Gh(`stage`,`act${(Z.run?.act??0)+1}-backdrop`);return e?`<div class="scene-bg" style="background-image:url('${e}')"></div>`:``}var p_=(e,t=22)=>{let n=Gh(`relics`,e);return n?`<img class="raster-art relic-art" src="${n}" alt="" style="width:${t}px;height:${t}px">`:Mu[e]?.glyph||`◈`},m_=e=>{let t=Gh(`relics`,e);return t?`<img class="relic-art hud-relic-art" src="${t}" alt="">`:`<span class="hud-relic-fallback">${Mu[e]?.glyph||`◈`}</span>`},h_=(e,t,n,r=22)=>{let i=Gh(`omens`,e);return i?`<img class="${t}" src="${i}" alt="">`:`<span class="${n}">${J(`omen-${e}`,r)}</span>`},g_=e=>Gh(`heroes`,Wu[e].id)?`<div class="hero-sprite">${d_(`heroes`,Wu[e].id,ng(e))}<svg class="cracks-overlay" viewBox="0 0 200 200"><g class="cracks"></g></svg></div>`:ng(e),__=!1;function v_(){if(!__){__=!0;for(let e of[...Kh(`enemies`),...Kh(`heroes`)])new Image().src=e}}var y_=`Every creature is glass with a Facet gauge. Fill it and the glass Shatters — the creature loses its next action, is Cracked, and spills Embers into your lantern.`,b_={Cracked:ju.vulnerable.desc,Dimmed:ju.weak.desc,Brittle:ju.frail.desc,Smolder:ju.poison.desc,Fervor:ju.str.desc,Poise:ju.dex.desc,Kindle:`Burned away for the rest of this combat — and the lantern gains 1 Ember.`,Ward:`Held light that prevents damage. Expires at the start of your turn.`,Energy:`Spent to play cards. Refreshes each turn.`,Ember:`Fuel for your Lantern Art. Spilled by shatters, deaths and kindling; held in the lantern.`,Embers:`Fuel for your Lantern Art. Spilled by shatters, deaths and kindling; held in the lantern.`,Chip:`Strike at the glass itself: adds toward a Shatter, no blood required.`,Facet:y_,Facets:y_,Shatter:y_,Shatters:y_,Staggered:`Shattered glass loses its next action while it reseams.`,Unplayable:`This card cannot be played.`,Shard:`Unplayable junk glass. It can still be kindled.`,Hex:`Curse: lose 1 HP at end of turn while in hand. Cannot be kindled.`,Cinder:`Take 2 damage at end of turn while in hand.`};function x_(){let e=Q(`#tooltip`),t=t=>{let n=t._tip;e.innerHTML=`${n.title?`<div class="tt-title">${n.title}</div>`:``}<div class="tt-body">${n.body||``}</div>${n.sub?`<div class="tt-sub">${n.sub}</div>`:``}`,e.style.display=`block`},n=e=>{let t=e;for(;t&&t!==document.body&&!t._tip;)t=t.parentElement;return t&&t._tip?t:null},r=(t,n,r)=>{if(e.style.display!==`block`)return;let{x:i,y:a}=S(t,n),o=e.offsetWidth,s=e.offsetHeight;r?(e.style.left=`${Math.max(8,Math.min(_()-o-8,i-o/2))}px`,e.style.top=`${Math.max(8,a-s-26)}px`):(e.style.left=`${Math.min(_()-o-12,i+16)}px`,e.style.top=`${Math.max(8,Math.min(v()-s-12,a-s/2))}px`)};document.addEventListener(`pointerover`,i=>{if(!o_||i.pointerType!==`mouse`)return;let a=n(i.target);a?(t(a),r(i.clientX,i.clientY,!1)):e.style.display=`none`}),document.addEventListener(`pointermove`,e=>{o_&&e.pointerType===`mouse`?r(e.clientX,e.clientY,!1):i&&Math.hypot(e.clientX-a,e.clientY-o)>12&&(clearTimeout(i),i=0)});let i=0,a=0,o=0,s=0;document.addEventListener(`pointerdown`,c=>{if(c.pointerType===`mouse`)return;e.style.display=`none`,clearTimeout(s);let l=n(c.target);l&&(a=c.clientX,o=c.clientY,clearTimeout(i),i=setTimeout(()=>{i=0,t(l),r(a,o,!0)},380))},!0);let c=t=>{t.pointerType!==`mouse`&&(i&&=(clearTimeout(i),0),clearTimeout(s),s=setTimeout(()=>e.style.display=`none`,1700))};document.addEventListener(`pointerup`,c),document.addEventListener(`pointercancel`,c)}function S_(e,t){let n=e.replace(/@(\d+)@/g,(e,n)=>{let r=+n,i=t&&Z.cb?Sh(Z.cb,r):r;return`<span class="val ${i>r?`boosted`:i<r?`reduced`:``}">${i}</span>`}).replace(/#(\d+)#/g,(e,n)=>{let r=+n,i=t&&Z.cb?Ch(Z.run,Z.cb,r):r;return`<span class="val ${i>r?`boosted`:i<r?`reduced`:``}">${i}</span>`});return n=n.replace(/\b(Cracked|Dimmed|Brittle|Smolder|Fervor|Poise|Kindle|Ward|Energy|Embers?|Chip|Facets?|Shatters?|Staggered|Unplayable|Shard|Hex|Cinder)\b/g,`<span class="kw">$1</span>`),n}function C_(e,{inCombat:t=!1,size:n=null}={}){let r=wm(e),i=$(`div`,`card t-${r.type} r-${r.rarity}${e.up?` upgraded`:``}`);n&&i.style.setProperty(`--cw`,`${n}px`),e.uid!=null&&(i.dataset.uid=e.uid);let a=``;if(r.cost!=null){let n=t&&Z.cb?ph(Z.run,Z.cb,e):r.cost;a=`<div class="card-cost ${n===0?`free`:``}">${n}</div>`}let o=S_(r.text,t);return e.bonus&&(o=o.replace(/<span class="val[^"]*">(\d+)<\/span>/,(t,n)=>t.replace(n,+n+e.bonus))),i.innerHTML=`<div class="card-lift">${a}<div class="card-inner">
    <div class="card-art">${d_(`cards`,e.id,ag(e.id,r.type))}</div>
    <div class="card-name">${r.name}</div>
    <div class="card-type">${r.type}</div>
    <div class="card-text"><span class="ct-inner">${o}</span></div>
    <div class="card-rarity"></div>
  </div></div>`,s_(`.kw`,i).forEach(e=>e._tip={title:e.textContent,body:b_[e.textContent]||``}),o_&&i.addEventListener(`mousemove`,e=>{let t=i.getBoundingClientRect(),n=(e.clientX-t.left)/t.width,r=(e.clientY-t.top)/t.height,a=Q(`.card-inner`,i);a.style.setProperty(`--ry`,`${(n-.5)*16}deg`),a.style.setProperty(`--rx`,`${(.5-r)*12}deg`),a.style.setProperty(`--mx`,`${n*100}%`),a.style.setProperty(`--my`,`${r*100}%`),a.style.setProperty(`--gx`,(n-.5)*60)}),i.addEventListener(`mouseleave`,()=>{let e=Q(`.card-inner`,i);e.style.setProperty(`--ry`,`0deg`),e.style.setProperty(`--rx`,`0deg`)}),i}function w_(){let e=Q(`#lantern`);if(!Z.run||Z.screen===`title`||Z.screen===`end`||Z.screen===`lamplighter`){e.style.setProperty(`--la`,0),e.classList.remove(`gutter`);return}let t=Z.run.player,n=Z.cb&&!Z.cb.over?Z.cb.player.hp:t.hp,r=Math.max(0,Math.min(1,(.68-n/t.maxHp)/.53));e.style.setProperty(`--la`,(r*.82).toFixed(3)),e.style.setProperty(`--lr`,`${Math.round(1500-r*1e3)}px`);let i=`50%`,a=`55%`;if(Z.screen===`combat`&&Z.ce?.hero){let e=Wf(Z.ce.hero);i=`${Math.round(e.x)}px`,a=`${Math.round(e.y)}px`}e.style.setProperty(`--lx`,i),e.style.setProperty(`--ly`,a),e.classList.toggle(`gutter`,r>.55)}function T_(){w_();let e=Q(`#hud`);if(!Z.run||Z.screen===`title`||Z.screen===`end`||Z.screen===`lamplighter`){e.classList.remove(`show`),document.body.classList.remove(`low-hp`);return}e.classList.add(`show`);let t=Z.run.player,n=Z.cb&&!Z.cb.over?Z.cb.player.hp:t.hp;document.body.classList.toggle(`low-hp`,n/t.maxHp<=.3);let r=Ou[Z.run.act];e.innerHTML=`<div class="hud-bar">
      <div class="hud-hp-wrap">
        <div class="hud-stat">${J(`heart`,14)} <span class="hp-num">${n} / ${t.maxHp}</span></div>
        <div class="hud-hpbar"><div style="width:${100*n/t.maxHp}%"></div></div>
      </div>
      <div class="hud-stat">${J(`coin`,14)} <span class="gold-num">${t.gold}</span></div>
      <div class="hud-mid"><b>${r.name.toUpperCase()}</b> &nbsp;·&nbsp; Act ${Z.run.act+1} &nbsp;·&nbsp; Floor ${Z.run.floorsClimbed} &nbsp;·&nbsp; ${r.bossName}</div>
      <div class="hud-right">
        ${t.potions.map((e,t)=>`<button class="potion-slot ${e?`full`:``}" data-slot="${t}">${e?d_(`potions`,e,og(Pu[e].tone)):``}</button>`).join(``)}
        <button class="icon-btn" data-act="deck">${J(`cards`,19)}<span style="font-size:11px">${t.deck.length}</span></button>
        <button class="icon-btn" data-act="menu">≡</button>
      </div>
    </div>
    <div id="relicbar"></div>`;let i=Q(`#relicbar`,e),a=Z.run.omens?.[Z.run.act],o=Bu[a];if(o){let e=$(`div`,`relic-chip omen-chip`,h_(a,`hud-omen-art`,`hud-omen-fallback`,24));e.style.setProperty(`--tone`,o.tone),e._tip={title:`Omen — ${o.name}`,body:o.text,sub:`hangs over Act ${Z.run.act+1}`},i.appendChild(e)}for(let e of t.relics){let t=Mu[e],n=$(`div`,`hud-relic`,m_(e));n.style.setProperty(`--tone`,t.tone),n.dataset.relic=e,n._tip={title:t.name,body:t.text,sub:t.rarity},i.appendChild(n)}t.potions.forEach((t,n)=>{if(!t)return;let r=Q(`.potion-slot[data-slot="${n}"]`,e);r._tip={title:Pu[t].name,body:Pu[t].text,sub:`Click to use or toss`}}),Q(`[data-act="deck"]`,e).onclick=()=>{X.click(),P_(`Your Deck`,Z.run.player.deck,{sub:`${Z.run.player.deck.length} cards`})},Q(`[data-act="menu"]`,e).onclick=e=>{X.click(),E_(e.clientX,e.clientY)},s_(`.potion-slot.full`,e).forEach(e=>e.onclick=t=>k_(+e.dataset.slot,t))}function E_(e,t){D_();let{x:n,y:r}=S(e,t),i=$(`div`,`pop-menu`);i.innerHTML=`<button data-m="help">How to Play</button><button data-m="mute">${Lg()?`Unmute`:`Mute`} Sound</button><button data-m="abandon" style="color:#ff8d8d">Abandon Run</button>`,b().appendChild(i),i.style.left=`${Math.min(n,_()-200)}px`,i.style.top=`${r+8}px`,i.onclick=e=>{let t=e.target.dataset.m;D_(),t===`help`&&F_(),t===`mute`&&Rg(),t===`abandon`&&j_()},setTimeout(()=>document.addEventListener(`pointerdown`,O_,{once:!0}),0)}var D_=()=>s_(`.pop-menu`).forEach(e=>e.remove()),O_=e=>{e.target.closest(`.pop-menu`)||D_()};function k_(e,t){if(Z.busy)return;D_();let n=Z.run.player.potions[e];if(!n)return;let r=Pu[n],i=Z.cb&&!Z.cb.over&&Z.screen===`combat`,a=!r.combatOnly||i,o=$(`div`,`pop-menu`);o.innerHTML=`<button data-m="use" ${a?``:`disabled style="opacity:.4"`}>Use ${r.name}</button><button data-m="toss">Toss it</button>`,b().appendChild(o);let s=S(t.clientX,t.clientY);o.style.left=`${Math.min(s.x-60,_()-220)}px`,o.style.top=`${s.y+10}px`,o.onclick=async t=>{let n=t.target.dataset.m;if(D_(),n===`toss`&&(Z.run.player.potions[e]=null,X.card(),T_(),Mh(Z.run)),n===`use`&&a)if(r.needsTarget&&i){let t=Z.cb.enemies.filter(e=>e.hp>0);if(t.length===1)return A_(e,t[0].idx);yv({kind:`potion`,slot:e})}else A_(e,null)},setTimeout(()=>document.addEventListener(`pointerdown`,O_,{once:!0}),0)}async function A_(e,t){bv(),X.potion(),Z.cb&&!Z.cb.over&&Z.screen===`combat`?(vh(Z.run,Z.cb,e,t),await Xv(),$v()):(vh(Z.run,null,e,null),T_(),Mh(Z.run))}function j_(){M_(`<div class="panel ov-panel" style="text-align:center">
    <div class="ov-title">Abandon Run?</div>
    <div class="ov-sub">Your climb will be lost to the void.</div>
    <div class="ov-actions"><button class="btn danger" data-a="yes">Abandon</button><button class="btn ghost" data-a="no">Keep Climbing</button></div>
  </div>`,e=>{e.onclick=e=>{let t=e.target.dataset.a;t===`yes`&&(Ih(Z.run,!1),Z.run=null,Z.cb=null,N_(),Ug(),z_(`title`)),t===`no`&&N_()}})}function M_(e,t=null,n=!1){let r=Q(`#overlay`);r.innerHTML=e,r.classList.add(`open`),r._closable=n,t&&t(r.firstElementChild)}function N_(){let e=Q(`#overlay`);e.classList.remove(`open`),e.innerHTML=``}function P_(e,t,{sub:n=``,pick:r=null,canSkip:i=!1,skipLabel:a=`Skip`,inCombat:o=!1}={}){let s=$(`div`,`panel ov-panel`);s.innerHTML=`<div class="ov-title">${e}</div>${n?`<div class="ov-sub">${n}</div>`:``}`;let c=$(`div`,`card-grid ${r?`choice-cards`:``}`),l=r?t:[...t].sort((e,t)=>wm(e).name.localeCompare(wm(t).name));for(let e of l){let t=C_(e,{inCombat:o});r&&(t.onclick=()=>{X.click(),t.classList.add(`picked`),setTimeout(()=>{N_(),r(e)},240)}),c.appendChild(t)}s.appendChild(c);let u=$(`div`,`ov-actions`);if(i&&r){let e=$(`button`,`btn ghost`,a);e.onclick=()=>{X.click(),N_(),r(null)},u.appendChild(e)}if(!r){let e=$(`button`,`btn ghost`,`Close`);e.onclick=()=>{X.click(),N_()},u.appendChild(e)}s.appendChild(u),M_(``,null,!r),Q(`#overlay`).appendChild(s)}function F_(){M_(`<div class="panel ov-panel howto">
    <div class="ov-title">How to Play</div>
    <h3>The Climb</h3>Choose a path of lanterns up the Spire. Fight monsters, gather cards, relics and phials, and defeat the boss of each of the <b>3 acts</b>. Unlit lanterns hide what they hold — but pay a bounty for the walking.
    <h3>Combat</h3>Each turn you draw <b>5 cards</b> and gain <b>3 Energy</b> (⬤). Play a card by clicking or dragging — attacks need a target when several enemies remain. Enemies telegraph their <b>intent</b> above their heads.
    <h3>The Glass</h3>Every creature is glass with a row of <b>Facets</b> under its lifebar. Attacks that draw unblocked blood chip a facet (heavy cards chip more). Fill the gauge and the glass <b>SHATTERS</b>: it loses its next action, is Cracked, and spills <b>Embers</b> into your lantern. Time a shatter to deny the blow you can't survive.
    <h3>The Lantern</h3>Embers fuel your <b>Lantern Art</b> — one signature power, always available, once a turn (press <b>A</b>). Drag any card onto the lantern to <b>kindle</b> it: the card burns away and feeds the lantern 1 ember. Once a turn; curses refuse the fire.
    <h3>Ward & Statuses</h3><b>Ward</b> is held light that absorbs damage but expires each turn. <b>Cracked</b> ×1.5 damage taken · <b>Dimmed</b> −25% damage dealt · <b>Brittle</b> −25% Ward · <b>Smolder</b> burns each turn, and leaps to another enemy when its host dies or shatters.
    <h3>The Fires & The Merchant</h3>Rest sites heal <b>30%</b> or upgrade a card. Shops sell cards, relics, phials — and can <b>remove</b> a card from your deck. Keep your deck lean; every reward is optional.
    <h3>The Vigil — What Death Leaves Behind</h3>Nothing is wasted. At the foot of each climb the <b>Lamplighter</b> offers a boon and lets you choose your Lantern Art. When you fall, carve one thing into the stone — a <b>monument</b> your next climb can recover in that same act. Every shatter, kindle and slaying feeds lifetime <b>Deeds</b> that unlock new cards, relics, and a second aspect, the <b>Ashwarden</b>. Reach the dawn once and the <b>Vows</b> open: an optional difficulty ladder for those who'd climb a crueler Spire.
    <div class="ov-actions"><button class="btn" data-a="ok">Fight On</button></div>
  </div>`,e=>{Q(`[data-a="ok"]`,e).onclick=()=>{X.click(),N_()}},!0)}function I_(){if(Ev)return;let e=Q(`#wipe`);e.classList.remove(`go`),e.offsetWidth,e.classList.add(`go`),setTimeout(()=>e.classList.remove(`go`),620)}var L_=0;async function R_(e,t={}){if(Ev)return;let n=Q(`#transit`);if(!n)return;let r=++L_,i=(e,t,i)=>(n.innerHTML=e,n.classList.add(`on`),n.firstElementChild.animate(t,{duration:i,easing:`cubic-bezier(0.4, 0, 0.2, 1)`}).finished.catch(()=>{}).finally(()=>{r===L_&&(n.classList.remove(`on`),n.innerHTML=``)}));if(e===`combat-in`){let e=t.x??_()/2,n=t.y??v()/2;return i(`<div class="tr-iris"></div>`,[{clipPath:`circle(150% at ${e}px ${n}px)`},{clipPath:`circle(0% at ${e}px ${n}px)`}],480)}if(e===`victory-out`)return i(`<div class="tr-bloom"></div>`,[{opacity:0},{opacity:1,offset:.4},{opacity:0}],900);if(e===`defeat`)return i(`<div class="tr-crack"></div>`,[{opacity:0},{opacity:1}],700);if(e===`act-change`){let e=Bu[Z.run.omens?.[Z.run.act]];return i(`<div class="tr-plate"><div class="tp-act">ACT ${Z.run.act+1} - ${Ou[Z.run.act].name.toUpperCase()}</div>
      ${e?`<div class="tp-omen" style="color:${e.tone}">${J(`omen-${Z.run.omens[Z.run.act]}`,16)} OMEN - ${e.name.toUpperCase()}</div>`:``}</div>`,[{opacity:0},{opacity:1,offset:.15},{opacity:1,offset:.8},{opacity:0}],2200)}}function z_(e,t){Z.screen!==e&&Z.run&&I_(),Z.screen=e,D_(),Q(`#tooltip`).style.display=`none`,e!==`map`&&(Hd(),qd()),Df(null);let n=l_();n.className=``,n.onclick=null,{title:V_,map:q_,combat:()=>{},reward:ny,rest:oy,shop:cy,event:ly,treasure:sy,bossRelic:ry,end:py}[e](t),e===`map`&&v_(),e!==`combat`&&e!==`title`&&em(),T_()}var B_=[`0`,`I`,`II`,`III`,`IV`,`V`];function V_(){Ug(),$d(0);let e=wg(),t=Nh(),n=Z.title||={aspect:0,vow:0};n.aspect>0&&Wu[n.aspect].unlock&&!e.unlocks.includes(Wu[n.aspect].unlock)&&(n.aspect=0),n.vow=Math.max(0,Math.min(n.vow|0,e.vowUnlocked));let r=e.deeds,i=Wu.map((t,r)=>{let i=r>0&&t.unlock&&!e.unlocks.includes(t.unlock);return`<button class="aspect-card${n.aspect===r?` on`:``}${i?` locked`:``}" data-a="asp" data-i="${r}"${i?` disabled`:``}>
      <div class="asp-hero">${g_(r)}</div>
      <div class="asp-name">${t.name}${i?` 🔒`:``}</div>
      <div class="asp-blurb">${i?`Reach the first dawn to walk as the Ashwarden.`:t.blurb}</div>
    </button>`}).join(``),a=n.vow===0?`The Spire as it is. No vows sworn.`:Gu.slice(0,n.vow).map(e=>`<b style="color:#ff9a4d">${e.name}</b> — ${e.desc}`).join(`<br>`),o=e.vowUnlocked>0?`<div class="vow-block">
      <div class="vow-stepper">
        <button class="vow-btn" data-a="vow-"${n.vow===0?` disabled`:``}>−</button>
        <div class="vow-level">VOW ${B_[n.vow]}<span class="vow-max"> / ${B_[e.vowUnlocked]||`0`}</span></div>
        <button class="vow-btn" data-a="vow+"${n.vow<e.vowUnlocked?``:` disabled`}>+</button>
      </div>
      <div class="vow-desc">${a}</div>
    </div>`:``,s=Gh(`title-background`,`background`),c=Gh(`title`,`title`),l=l_();l.innerHTML=`<div class="title-screen screen-enter">
    ${s?`<div class="title-banner"><div class="title-banner-frame"><img class="raster-art" src="${s}" alt=""></div></div>`:``}
    <div class="logo${c?` logo-raster`:``}">${c?`<img class="title-wordmark" src="${c}" alt="SPIREBOUND">`:`SPIREBOUND`}</div>
    <div class="tagline">A Roguelite Deckbuilder · The Vigil Remembers</div>
    <div class="aspect-row">${i}</div>
    ${o}
    <div class="title-btns">
      ${t?`<button class="btn" data-a="continue">Continue Climb</button>`:``}
      <button class="btn" data-a="new">${t?`Begin Anew`:`Begin the Climb`}</button>
      <button class="btn ghost" data-a="vigil">The Vigil</button>
      <button class="btn ghost" data-a="help">How to Play</button>
      <button class="btn ghost" data-a="mute">${Lg()?`Unmute`:`Mute`}</button>
    </div>
    <div class="title-stats">${r.runs} climbs · ${r.wins} dawns · ${r.slain} slain${e.unlocks.length?` · ${e.unlocks.length} secrets unearthed`:``}</div>
  </div>`,l.onclick=r=>{let i=r.target.closest(`[data-a]`);if(!i||i.disabled)return;let a=i.dataset.a;Ig(),X.click(),a===`asp`?(n.aspect=+i.dataset.i,V_()):a===`vow-`?(n.vow=Math.max(0,n.vow-1),V_()):a===`vow+`?(n.vow=Math.min(e.vowUnlocked,n.vow+1),V_()):a===`new`?(t&&Ph(),U_(vm(void 0,{aspect:n.aspect,vow:n.vow,lamplighter:!0,monument:e.lastFall}))):a===`continue`&&t?U_(t,!0):a===`vigil`?H_():a===`help`?F_():a===`mute`&&(Rg(),V_())},Pv()}function H_(){let e=xg(),t=Object.values(Uu).map(t=>{let n=e.deeds[t.stat]||0,r=n>=t.n,i=Math.min(100,Math.round(n/t.n*100)),a=t.unlocks.map(e=>{if(e===`aspect2`)return`The Ashwarden`;let[t,n]=e.split(`:`);return t===`card`?ku[n]?.name||n:Mu[n]?.name||n}).join(`, `);return`<div class="deed-row${r?` done`:``}">
      <div class="deed-head"><span class="deed-name">${r?`✦ `:``}${t.name}</span><span class="deed-count">${Math.min(n,t.n)}/${t.n}</span></div>
      <div class="deed-desc">${t.desc} → <i>${a}</i></div>
      <div class="deed-bar"><span style="width:${i}%"></span></div>
    </div>`}).join(``);M_(`<div class="panel ov-panel vigil-panel">
    <div class="ov-title">The Vigil</div>
    <div class="ov-sub">${e.deeds.runs} climbs · ${e.deeds.wins} dawns · deepest Vow: ${B_[e.deeds.bestVow]||`—`}</div>
    <div class="deed-list">${t}</div>
    <div class="ov-actions"><button class="btn" data-a="ok">Close</button></div>
  </div>`,e=>{Q(`[data-a="ok"]`,e).onclick=()=>{X.click(),N_()}},!0)}function U_(e,t=!1){Z.run=e,Z.cb=null,$d(e.act);let n=e.nodeId?e.map.nodes.find(t=>t.id===e.nodeId):null;if(Bd(e.act,n?n.row:0),Hg(e.act),t||Mh(e),t&&e.pendingCombat){let t=e.map.nodes.find(t=>t.id===e.nodeId);Z.screen=`combat`,X_(Um(e,e.pendingCombat,t?t.row:5),e.pendingCombat),T_();return}if(e.pendingLamplighter){W_();return}z_(`map`),t||setTimeout(()=>ay(e),900)}function W_(){let e=Z.run;if(Z.screen!==`lamplighter`&&I_(),Z.screen=`lamplighter`,D_(),qd(),$d(0),l_().className=``,!Z.lamp){let t=Tm(e),n=Object.keys(Ku),r=[];for(;r.length<3&&n.length;)r.push(n.splice(Math.floor(t()*n.length),1)[0]);Z.lamp={boons:r,boon:null,art:e.art},Mh(e)}let t=Z.lamp,n=Wu[e.aspect],r=t.boons.map(e=>{let n=Ku[e],r=Gh(`boons`,e);return`<button class="lamp-boon${t.boon===e?` on`:``}" data-a="boon" data-i="${e}">
      ${r?`<img class="lb-art-img" src="${r}" alt="">`:``}
      <div class="lb-name">${J(`boon-${e}`,20)} ${n.name}</div><div class="lb-text">${S_(n.text)}</div>
    </button>`}).join(``),i=Object.keys(Hu).map(e=>{let n=Hu[e],r=Gh(`arts`,e);return`<button class="lamp-art${t.art===e?` on`:``}" data-a="art" data-i="${e}">
      ${r?`<img class="la-art-img" src="${r}" alt="">`:`<span class="la-glyph" style="color:${n.tone}">${J(`art-${e}`,18)}</span>`}<span class="la-name">${n.name}</span>
    </button>`}).join(``),a=Hu[t.art],o=l_();o.innerHTML=`<div class="lamp-screen screen-enter">
    ${f_()}
    <div class="lamp-hero">${g_(e.aspect)}</div>
    <div class="lamp-title">THE LAMPLIGHTER</div>
    <div class="lamp-sub">${n.name} stands at the foot of the Spire. Take one parting gift — and choose the fire your lantern will carry.</div>
    <div class="lamp-label">A Boon for the Road</div>
    <div class="lamp-boons">${r}</div>
    <div class="lamp-label">Your Lantern Art <span class="lamp-hint">(press A in combat)</span></div>
    <div class="lamp-arts">${i}</div>
    <div class="lamp-art-desc">${a?`<b style="color:${a.tone}">${J(`art-${t.art}`,15)} ${a.name}</b> · ${S_(a.text)}`:``}</div>
    <div class="lamp-actions"><button class="btn btn-primary" data-a="begin"${t.boon?``:` disabled`}>${t.boon?`Light the Way`:`Choose a boon`}</button></div>
  </div>`,T_(),o.onclick=e=>{let n=e.target.closest(`[data-a]`);if(!n||n.disabled)return;let r=n.dataset.a;Ig(),X.click(),r===`boon`?(t.boon=n.dataset.i,W_()):r===`art`?(t.art=n.dataset.i,X.hover(),W_()):r===`begin`&&t.boon&&G_()}}function G_(){let e=Z.run,t=Z.lamp;e.art=t.art,e.boon=t.boon,Lh(e,Ku[t.boon].ops),delete e.pendingLamplighter,Z.lamp=null,X.relic(),Mh(e),z_(`map`),setTimeout(()=>ay(e),900)}var K_={monster:`sword`,elite:`skull`,event:`question`,rest:`flame`,shop:`coin`,treasure:`chest`,boss:`crown`,monument:`monument`};function q_(){let e=Z.run;if(e.pendingCombat){let t=e.map.nodes.find(t=>t.id===e.nodeId);Z.screen=`combat`,X_(Um(e,e.pendingCombat,t?t.row:5),e.pendingCombat);return}Mh(e),Z.cb=null;let{nodes:t}=e.map,n=new Set(Dm(e).map(e=>e.id)),r=new Set(e.map.visited),i=e.nodeId?t.find(t=>t.id===e.nodeId).row:-1,a=``,o=``;for(let e of t)for(let t of e.next){let n=r.has(e.id)&&r.has(t)?`walked`:``;a+=`<path class="medge ${n}" style="--d:${e.row*34}ms" data-a="${e.id}" data-b="${t}" d="M0 0"/>`}for(let i of t){let t=i.unlit&&!r.has(i.id),a=[`mnode`,`type-${i.type}`,t?`unlit`:``,r.has(i.id)?`visited`:``,i.id===e.nodeId?`current`:``,n.has(i.id)?`avail`:``].join(` `),s=a_?1.3:1,c=(i.type===`boss`?26:i.type===`elite`||i.type===`treasure`?19:16)*s,l=Math.round((i.type===`boss`?26:i.type===`elite`||i.type===`treasure`?20:17)*s);o+=`<g class="${a}" data-node="${i.id}" style="--d:${i.row*34}ms">
      <g class="nwrap"><circle class="bg" r="${t?16*s:c}"/><g class="icg">${mg(t?`unlitLantern`:K_[i.type],t?Math.round(17*s):l)}</g></g>
    </g>`}let s=Ou[e.act],c=e.omens?.[e.act],l=Bu[c];l_().innerHTML=`
    <div class="map-title">ACT ${e.act+1} — <b>${s.name.toUpperCase()}</b> — ${s.bossName} awaits${l?` &nbsp;·&nbsp; <span class="mt-omen" style="color:${l.tone}">${h_(c,`mt-omen-art`,`mt-omen-fallback`,18)}<span class="mt-omen-name">${l.name}</span></span>`:``}</div>
    <div class="map-screen screen-enter">
      <div class="map-haze" style="--haze:${[`#2a3a2e`,`#1f2e40`,`#3a2030`][e.act]??`#2a3a2e`}"></div>
      <svg class="map-svg" width="100%" height="100%">${a}${o}</svg>
      <div class="map-hint">${a_?`drag`:`scroll`} to survey the Spire</div>
    </div>`;let u=Q(`.map-svg`),d=!1;u.onclick=e=>{if(d)return;let n=e.target.closest(`.mnode.avail`);!n||Z.busy||(Ig(),J_(t.find(e=>e.id===n.dataset.node)))},s_(`.mnode`,u).forEach(i=>{let a=t.find(e=>e.id===i.dataset.node),o={monster:`Monster`,elite:`Elite — beware`,event:`Unknown event`,rest:`Rest site`,shop:`Merchant`,treasure:`Treasure`,boss:Ou[e.act].bossName};i._tip=a.unlit&&!r.has(a.id)?{title:`An unlit lantern`,body:`What waits here is unknown — but first light pays a bounty of gold.${n.has(a.id)?` ${a_?`Tap`:`Click`} to travel here.`:``}`}:{title:o[a.type],body:n.has(a.id)?`${a_?`Tap`:`Click`} to travel here.`:``,sub:{monster:`A fight. Embers and gold for the swift.`,elite:`A titled foe - greater risk, a relic-grade purse.`,event:`Fate unwritten. Could be anything.`,rest:`Heal, or forge a card into its + form.`,shop:`Gold for cards, relics, phials.`,treasure:`A chest with no fight attached.`,boss:`The act ends here. Ready your deck.`}[a.type]}});let f=t.map(t=>({id:t.id,pos:Ed(e.act,t)})),p=new Map(s_(`.mnode`,u).map(e=>[e.dataset.node,e])),m=new Set(t.filter(e=>!n.has(e.id)&&!r.has(e.id)).map(e=>e.id)),h=s_(`.medge`,u).map(e=>({p:e,a:e.dataset.a,b:e.dataset.b}));Vd(e.act,Math.max(0,i)),Kd(f,e=>{let t=new Map(e.map(e=>[e.id,e]));for(let[e,n]of p){let r=t.get(e);n.setAttribute(`transform`,`translate(${r.x.toFixed(1)},${r.y.toFixed(1)}) scale(${r.s.toFixed(3)})`);let i=n.classList.contains(`visited`)&&!n.classList.contains(`current`)?.55:1;n.style.opacity=(r.fade*(m.has(e)?.4:1)*i).toFixed(3)}for(let{p:e,a:n,b:r}of h){let i=t.get(n),a=t.get(r),o=9*(i.s+a.s)/2;e.setAttribute(`d`,`M${i.x.toFixed(1)} ${i.y.toFixed(1)} Q${((i.x+a.x)/2).toFixed(1)} ${((i.y+a.y)/2+o).toFixed(1)} ${a.x.toFixed(1)} ${a.y.toFixed(1)}`),e.style.opacity=(Math.min(i.fade,a.fade)*(e.classList.contains(`walked`)?.25:1)).toFixed(3)}}),Df(e.act,{mult:.3});let g=Q(`.map-screen`);g.addEventListener(`wheel`,e=>{e.preventDefault(),Ud(-e.deltaY*.006)},{passive:!1});let _=null,v=0,y=0,b=0;g.addEventListener(`pointerdown`,e=>{e.pointerType!==`mouse`&&(cancelAnimationFrame(y),_=e.clientY,v=0,b=0,d=!1)}),g.addEventListener(`pointermove`,e=>{if(_==null||e.pointerType===`mouse`)return;let t=e.clientY-_;_=e.clientY,b+=Math.abs(t),b>14&&(d=!0),v=t,Ud(t*.014)});let x=e=>{if(_==null||e.pointerType===`mouse`)return;_=null;let t=()=>{v*=.93,!(Math.abs(v)<.5||Z.screen!==`map`)&&(Ud(v*.014),y=requestAnimationFrame(t))};y=requestAnimationFrame(t),setTimeout(()=>d=!1,80)};g.addEventListener(`pointerup`,x),g.addEventListener(`pointercancel`,x)}function J_(e){let t=Z.run;X.map(),Bd(t.act,e.row);let{type:n,bounty:r}=Om(t,e);if(Mh(t),r){X.coin();let t=Q(`.mnode[data-node="${e.id}"]`),n=t?Wf(t):{x:_()/2,y:v()/2};Lf(n.x,n.y-34,`${J(`coin`,12)} +${r}`,`goldf`),Tv(n.x,n.y,120,30,{n:5,color:`#ffe9ac`,size:7,dur:620})}if(n===`monster`||n===`elite`||n===`boss`){t.pendingCombat=n,Mh(t);let r=Q(`.mnode[data-node="${e.id}"]`);R_(`combat-in`,r?Wf(r):{}),X_(Um(t,n,e.row),n)}else n===`rest`?z_(`rest`):n===`shop`?z_(`shop`):n===`treasure`?z_(`treasure`):n===`event`?z_(`event`,Hm(t)):n===`monument`&&Y_(e)}function Y_(e){let t=Z.run,n=km(t);if(n&&Dg(),Mh(t),n){X.relic();let t=n.kind===`relic`?Mu[n.id]?.name:n.kind===`card`?ku[n.id]?.name:`${n.amount} gold`,r=Q(`.mnode[data-node="${e.id}"]`),i=r?Wf(r):{x:_()/2,y:v()/2};Lf(i.x,i.y-34,`✦ ${t}`,`goldf`),Tv(i.x,i.y,_()/2,v()*.5,{n:8,color:`#ffe9ac`,size:8,dur:720}),wv(`THE STONE REMEMBERS`)}z_(`map`)}function X_(e,t){if(Hd(),qd(),Q(`#tooltip`).style.display=`none`,Z.screen!==`combat`&&I_(),Z.cb=Wm(Z.run,e,t),Z.screen=`combat`,Df(Z.run.act,{boss:t===`boss`}),Z_(),T_(),t===`boss`){let t=$(`div`,`rose-window`,`<div class="rw-rings"></div><div class="rw-spokes"></div><div class="boss-plate">${(Fu[e[0]]?.name??Z.cb.enemies[0].name).toUpperCase()}</div>`);l_().appendChild(t),setTimeout(()=>t.remove(),2300);let n=$(`div`,`turn-banner boss-banner`,Z.cb.enemies[0].name.toUpperCase());l_().appendChild(n),setTimeout(()=>n.remove(),2100),Mf(`#1a0a20`,.5,.9),tf(1.6),X.bigDeath()}Xv().then($v)}function Z_(){let e=Z.cb,t=l_();t.onclick=null,t.innerHTML=`<div class="combat-screen screen-enter intro" style="--ledge:${`#${Ou[Z.run.act].theme.glow.toString(16).padStart(6,`0`)}`}">
    ${[`backdrop`,`mid`,`ledge`].map(e=>{let t=Gh(`stage`,`act${Z.run.act+1}-${e}`);return t?`<img class="sl sl-${e}" src="${t}" alt="" aria-hidden="true">`:``}).join(``)}
    <div class="stage-ledge"></div>
    <div class="stage-breath b1"></div><div class="stage-breath b2"></div>
    <div class="battlefield">
      <div class="player-zone">
        <div class="hero-wrap">
          <div class="hero-name">${Wu[Z.run.aspect].name.toUpperCase()}</div>
          ${g_(Z.run.aspect)}
        </div>
        <div class="cplate">
          <div class="hpbar-wrap"><span class="block-chip zero p-block">${J(`shield`,13)} 0</span><div class="hpbar"><div class="ghost"></div><div class="fill"></div></div><span class="hp-label p-hp"></span></div>
          <div class="status-row p-status"></div>
        </div>
      </div>
      <div class="enemy-zone"></div>
    </div>
    <div class="energy-orb"><div class="num">0</div><div class="lbl">ENERGY</div><div class="candles"></div></div>
    <button class="lantern-btn"><span class="lb-ic">${J(`lantern`,26)}</span><span class="lb-count">0</span><div class="lb-pips"></div><span class="lb-art"></span></button>
    <button class="btn end-turn">End Turn</button>
    <button class="pile-btn pile-draw"><span class="cnt">0</span><span class="lbl">DRAW</span></button>
    <button class="pile-btn pile-discard"><span class="cnt">0</span><span class="lbl">DISCARD</span></button>
    <button class="pile-btn pile-exhaust"><span class="cnt">0</span><span class="lbl">ASHES</span></button>
    <div class="hand-zone"></div>
  </div>`;let n=Q(`.enemy-zone`,t),r={enemies:[],root:Q(`.combat-screen`,t)},i=e.affix?Vu[e.affix]:null,a=Xg(x().shape,Z.run.act),o=$g(a,e.enemies.length);e.enemies.forEach((e,t)=>{let s=Fu[e.key],c=r_(a,e.key,s.boss?`boss`:s.elite?`elite`:`normal`,o[t],_(),v()),l=$(`div`,`enemy${s.elite?` elite-e`:``}${s.boss?` boss-e`:``}${i?` affixed`:``}`);i&&l.style.setProperty(`--affix-tone`,i.tone),l.dataset.idx=t,l.style.animationDelay=`${160+t*130}ms`,l.innerHTML=`<div class="intent"></div>
      <div class="enemy-art" style="width:${c}px;height:${c}px"><div class="enemy-sprite">${d_(`enemies`,e.key,eg(s.art))}<div class="vessel-fire"></div>${Gh(`enemies`,e.key)?`<svg class="cracks-overlay" viewBox="0 0 200 200"><g class="cracks"></g></svg>`:``}</div><div class="dmg-preview"></div></div>
      <div class="cplate">
        <div class="name">${i?`<span class="affix-name" style="color:${i.tone}">${i.name.toUpperCase()}</span> `:``}${e.name.toUpperCase()}</div>
        <div class="hpbar-wrap"><span class="block-chip zero">${J(`shield`,13)} 0</span><div class="hpbar"><div class="ghost"></div><div class="fill"></div><div class="pv"></div></div><span class="hp-label"></span></div>
        <div class="facet-row"></div>
        <div class="status-row"></div>
      </div>`,n.appendChild(l),r.enemies.push({root:l,art:Q(`.enemy-art`,l),intent:Q(`.intent`,l),fill:Q(`.fill`,l),ghost:Q(`.ghost`,l),hp:Q(`.hp-label`,l),block:Q(`.block-chip`,l),statuses:Q(`.status-row`,l),pv:Q(`.pv`,l),prev:Q(`.dmg-preview`,l),facets:Q(`.facet-row`,l)}),r.enemies[t].facets._tip={title:`Facets`,body:`Every creature is glass. Attacks that draw unblocked blood chip a facet; fill the gauge and the glass <b>shatters</b> — it loses its next action, is Cracked, and spills Embers into your lantern.`},i&&(Q(`.name`,l)._tip={title:`${i.name} — an elite's title`,body:i.text}),l.onclick=()=>vv(t),l.addEventListener(`pointerenter`,e=>{e.pointerType===`mouse`&&Z.targeting&&(l.classList.add(`target-hover`),gv())}),l.addEventListener(`pointerleave`,()=>{l.classList.remove(`target-hover`),gv()})}),r.pHp=Q(`.p-hp`,t),r.pFill=Q(`.player-zone .fill`,t),r.pGhost=Q(`.player-zone .ghost`,t),r.pBlock=Q(`.p-block`,t),r.pStatus=Q(`.p-status`,t),r.hero=Q(`.hero-wrap`,t),r.energy=Q(`.energy-orb`,t),r.endTurn=Q(`.end-turn`,t),r.hand=Q(`.hand-zone`,t),r.draw=Q(`.pile-draw`,t),r.discard=Q(`.pile-discard`,t),r.exhaust=Q(`.pile-exhaust`,t),r.lantern=Q(`.lantern-btn`,t);let s=Hu[Z.run.art];s&&(Q(`.lb-art`,r.lantern).innerHTML=`<i>${J(`art-${Z.run.art}`,16)}</i>${s.cost}`,Q(`.lb-art`,r.lantern).style.color=s.tone),r.lantern._tip={title:s?`Lantern Art — ${s.name}`:`The Lantern`,body:`${s?`<b>${s.cost} Embers, once a turn:</b> ${s.text}<br><br>`:``}The lantern holds the <b>Embers</b> spilled by shattered and slain glass. Drag any card onto it to <b>kindle</b> — burn the card away for an ember, once a turn. Curses refuse the fire.`,sub:`A · use Art`},r.lantern.onclick=async()=>{if(!(Z.busy||!Z.cb||Z.cb.over)){if(Ig(),!eh(Z.run,Z.cb)){r.lantern.classList.add(`nope`),setTimeout(()=>r.lantern.classList.remove(`nope`),350),X.debuff();return}bv(),th(Z.run,Z.cb),await Xv(),$v()}},Z.ce=r,ev(a),jv(),Nv(),setTimeout(()=>r.root.classList.remove(`intro`),1300),r.endTurn.onclick=Cv,r.draw.onclick=()=>{X.click(),P_(`Draw Pile`,e.draw,{sub:`Order hidden — shown alphabetically`,inCombat:!0})},r.discard.onclick=()=>{X.click(),P_(`Discard Pile`,e.discard,{inCombat:!0})},r.exhaust.onclick=()=>{X.click(),P_(`The Ashes`,e.exhaust,{sub:`Burned away — each fed the lantern an ember`,inCombat:!0})},r.root.addEventListener(`pointerdown`,e=>{e.target.closest(`.enemy`)||e.target.closest(`.card`)||(Z.targeting?bv():Z.hoveredCard!=null&&(Z.hoveredCard=null,cv()))}),ov(),sv()}var Q_=e=>Wf(Z.ce.enemies[e].art),$_=()=>Wf(Z.ce.hero);function ev(e){let t=Z.cb,n=Z.ce;if(!t||!n||Z.screen!==`combat`)return;let r=e??Xg(x().shape,Z.run.act);n.root.style.setProperty(`--ground-y`,`${r.groundY}px`),n.root.style.setProperty(`--ledge-lip`,`${r.ledgeLip}px`);for(let e of[`backdrop`,`mid`,`ledge`]){let t=n.root.querySelector(`.sl-${e}`);if(!t)continue;let i=r.layers[e];t.style.height=`${i.h}px`,t.style.left=i.x?`calc(50% + ${i.x}px)`:``,t.style.bottom=e===`ledge`?`${Math.max(0,r.groundY+r.ledgeLip-i.h+i.y)}px`:`${i.y}px`,t.style.opacity=i.opacity,t.style.scale=i.zoom===1?``:String(i.zoom),t.style.objectPosition=`${i.posX}% ${i.posY}%`,t.style.setProperty(`--amp`,`${i.drift}px`)}let i=Qg(`heroes`,Wu[Z.run.aspect].id),a=Math.round(r.hero.w*i.scale),o=Math.round(r.hero.h*i.scale),s=n.root.querySelector(`.player-zone`);s.style.width=`${a}px`,s.style.height=`${o}px`,s.style.left=`${Math.round(r.hero.x-a/2)}px`,s.style.bottom=`${Zg(r)+i.footY}px`;let c=$g(r,t.enemies.length),l=n_(c,t.enemies.map(e=>e.key));t.enemies.forEach((e,t)=>{let i=Fu[e.key],a=i.boss?`boss`:i.elite?`elite`:`normal`,o=r_(r,e.key,a,c[t],_(),v()),s=n.enemies[t].root;s.style.left=`${Math.round(c[t].x-o/2+e_(c[t],e.key))}px`,s.style.bottom=`${(c[t].y??0)+t_(c[t],e.key)}px`,s.style.width=s.style.height=`${o}px`,s.style.zIndex=String(l[t]),n.enemies[t].art.style.width=n.enemies[t].art.style.height=`${o}px`})}function tv(){ev(),cv(),Nv()}var nv=0;addEventListener(`resize`,()=>{clearTimeout(nv),nv=setTimeout(()=>{Z.cb&&Z.ce&&Z.screen===`combat`&&tv()},120)});function rv(e,t,n){e.innerHTML=``;for(let[n,r]of Object.entries(t)){if(!r)continue;let t=ju[n]||{name:n,icon:`?`,kind:`buff`,desc:``},i=n===`str`&&r<0?`debuff`:t.kind,a=$(`span`,`schip ${i}`,`${fg(`st-${n}`)?J(`st-${n}`,13):t.icon} <span class="n">${r}</span>`);a._tip={title:t.name,body:t.desc.replace(/\bN\b/g,r),sub:i===`debuff`?`Debuff`:`Buff`},e.appendChild(a)}}function iv(e){let t=Z.cb,n=Ym(e),r=wh(Z.run,t,e),i={attack:J(`sword`,19),block:J(`shield`,19),buff:J(`up`,19),debuff:J(`cloud`,19),heal:J(`plus`,19)}[n.intent]||J(`sword`,19),a=``;n.intent.startsWith(`attack`)&&(i=J(`sword`,19),a=r.times>1?`${r.dmg}×${r.times}`:`${r.dmg}`,n.intent===`attack_debuff`&&(i+=J(`cloud`,14)),n.intent===`attack_block`&&(i+=J(`shield`,14)),n.intent===`attack_buff`&&(i+=J(`up`,14)));let o=[];return r&&o.push(`attack for <b>${r.dmg}${r.times>1?`×${r.times}`:``}</b>`),n.block&&o.push(`gain Ward`),n.heal&&o.push(`heal itself`),n.fx?.some(e=>e.who===`player`)&&o.push(`afflict you`),n.fx?.some(e=>e.who!==`player`)&&o.push(`empower`),n.addCards&&o.push(`add ${n.addCards.n} ${ku[n.addCards.id].name}s to your discard`),{icon:i,txt:a,tip:{title:n.name,body:`Intends to ${o.join(`, `)||`act`}.`}}}function av(e,t=0){if(e.facetMax>8)return`<span class="pipnum">${J(`facet`,11)} ${e.chips}${t?`<i>+${t}</i>`:``}/${e.facetMax}</span>`;let n=``;for(let r=0;r<e.facetMax;r++)n+=`<span class="pip${r<e.chips?` filled`:r<e.chips+t?` willchip`:``}"></span>`;return n}function ov(){let e=Z.cb,t=Z.ce;if(!t)return;e.enemies.forEach((e,n)=>{let r=t.enemies[n],i=`${100*Math.max(0,e.hp)/e.maxHp}%`;if(r.fill.style.width=i,r.ghost.style.width=i,r.hp.textContent=`${Math.max(0,e.hp)}/${e.maxHp}`,r.block.classList.toggle(`zero`,e.block<=0),r.block.innerHTML=`${J(`shield`,13)} ${e.block}`,r.art.classList.toggle(`warded`,e.block>0),r.root.classList.toggle(`lowhp`,e.hp>0&&e.hp/e.maxHp<=.3),rv(r.statuses,e.statuses,!1),e.hp>0?r.facets.innerHTML=av(e):r.facets.innerHTML=``,e.hp<=0&&r.reaped&&r.root.classList.add(`gone`),e.hp>0&&e.flags.staggered)r.intent.className=`intent i-staggered`,r.intent.innerHTML=`<span class="ic">${J(`stagger`,19)}</span>STAGGERED`,r.intent._tip={title:`Staggered`,body:`The glass has shattered — this creature loses its next action while it reseams.`};else if(e.hp>0&&e.moveKey){let t=iv(e);r.intent.className=`intent i-${Ym(e).intent}`,r.intent.innerHTML=`<span class="ic">${t.icon}</span>${t.txt}`,r.intent._tip=t.tip}else r.intent.innerHTML=``}),t.lantern&&(Q(`.lb-count`,t.lantern).textContent=e.embers,Q(`.lb-pips`,t.lantern).innerHTML=Array.from({length:e.emberCap},(t,n)=>`<span class="lbp${n<e.embers?` lit`:``}" style="--a:${Math.round(n/(e.emberCap-1)*280-140)}deg"></span>`).join(``),t.lantern.classList.toggle(`unlit`,e.embers===0),t.lantern.classList.toggle(`ready`,eh(Z.run,e)),t.lantern.classList.toggle(`art-spent`,e.artUsedTurn===e.turn&&!e.over));let n=e.player,r=`${100*Math.max(0,n.hp)/n.maxHp}%`;t.pFill.style.width=r,t.pGhost.style.width=r,t.pHp.textContent=`${Math.max(0,n.hp)}/${n.maxHp}`,t.pBlock.classList.toggle(`zero`,n.block<=0),t.pBlock.innerHTML=`${J(`shield`,13)} ${n.block}`,t.hero.classList.toggle(`warded`,n.block>0),t.hero.classList.toggle(`lowhp`,n.hp/n.maxHp<=.3),rv(t.pStatus,n.statuses,!0),Q(`.num`,t.energy).textContent=n.energy,t.energy.classList.toggle(`spent`,n.energy===0);let i=Q(`.candles`,t.energy),a=Math.max(n.energyMax,n.energy);i.children.length!==a&&(i.innerHTML=Array.from({length:a},()=>`<span class="candle"></span>`).join(``)),[...i.children].forEach((e,t)=>e.classList.toggle(`lit`,t<n.energy)),Q(`.cnt`,t.draw).textContent=e.draw.length,Q(`.cnt`,t.discard).textContent=e.discard.length,Q(`.cnt`,t.exhaust).textContent=e.exhaust.length}function sv(){let e=Z.cb,t=Z.ce;if(!t)return;let n=t.hand,r=new Map(s_(`.card`,n).map(e=>[e.dataset.uid,e])),i=new Set(e.hand.map(e=>String(e.uid)));for(let[e,t]of r)i.has(e)||t.remove();for(let t of e.hand)if(r.has(String(t.uid))){let e=C_(t,{inCombat:!0}),n=r.get(String(t.uid));n.replaceChildren(...e.childNodes),n.className=e.className+(n.classList.contains(`armed`)?` armed`:``),n.onclick=e=>{e.stopPropagation(),_v(t.uid)},o_&&(n.onmouseenter=()=>{Z.hoveredCard=t.uid,cv()},n.onmouseleave=()=>{Z.hoveredCard===t.uid&&(Z.hoveredCard=null),cv()})}else{let e=C_(t,{inCombat:!0});e.classList.add(`draw-in`),setTimeout(()=>e.classList.remove(`draw-in`),400),e.onclick=e=>{e.stopPropagation(),_v(t.uid)},o_&&(e.onmouseenter=()=>{Z.hoveredCard=t.uid,X.hover(),cv()},e.onmouseleave=()=>{Z.hoveredCard===t.uid&&(Z.hoveredCard=null),cv()}),uv(e,t.uid),n.appendChild(e)}cv()}function cv(){let e=Z.cb,t=Z.ce;if(!t)return;let n=e.hand.map(e=>String(e.uid)),r=new Map(s_(`.card`,t.hand).map(e=>[e.dataset.uid,e])),i=n.length,a=Math.min(112,640/Math.max(i,1),(_()-246)/Math.max(i-1,1));n.forEach((t,n)=>{let o=r.get(t);if(!o)return;let s=e.hand[n],c=!wm(s).unplayable&&(ph(Z.run,e,s)??99)<=e.player.energy;o.classList.toggle(`unplayable-now`,!c);let l=Z.targeting?.kind===`card`&&String(Z.targeting.uid)===t,u=Z.hoveredCard!=null&&String(Z.hoveredCard)===t,d=i>1?(n-(i-1)/2)*Math.min(5,42/i):0,f=(n-(i-1)/2)*a,p=Math.abs(d)*3.2;o.classList.toggle(`armed`,l),o.classList.toggle(`lifted`,u&&!Z.busy&&!l),o.style.transform=`translateX(calc(-50% + ${l?f*.4:f}px)) translateY(${p+26}px) rotate(${l?d*.5:d}deg)`,o.style.zIndex=u||l?40:20+n}),gv()}var lv=0;function uv(e,t){e.addEventListener(`pointerdown`,n=>{if(!(Z.busy||!Z.cb||Z.cb.over||!n.isPrimary||Z.drag)){Z.drag={uid:t,id:n.pointerId,x0:n.clientX,y0:n.clientY,live:!1,free:!1};try{e.setPointerCapture(n.pointerId)}catch{}}}),e.addEventListener(`pointermove`,n=>{let r=Z.drag;if(!(!r||r.uid!==t||n.pointerId!==r.id)){if(!r.live){r.y0-n.clientY>26&&pv(r,e);return}if(r.free){let t=S(n.clientX,n.clientY);e.style.transform=`translate(calc(-50% + ${t.x-_()/2}px), ${t.y-v()+130}px) scale(1.12)`;let i=!!fv(n.clientX,n.clientY)?.closest(`.lantern-btn`);e.classList.toggle(`will-burn`,i),e.classList.toggle(`will-cast`,!r.kindleOnly&&!i&&t.y<dv())}else xv(n),hv(n.clientX,n.clientY)}});let n=(n,r)=>{let i=Z.drag;if(!i||i.uid!==t||n.pointerId!==i.id||(Z.drag=null,!i.live))return;if(lv=performance.now(),e.classList.remove(`dragging`,`will-cast`,`will-burn`),Z.ce?.lantern?.classList.remove(`kindle-target`),r){bv(),cv();return}if(fv(n.clientX,n.clientY)?.closest(`.lantern-btn`)){let e=Z.cb.hand.find(e=>e.uid===t);if(e&&rh(Z.run,Z.cb,e)){bv(),mv(t);return}bv(),cv();return}if(i.kindleOnly){Z.hoveredCard=null,cv();return}if(i.free){S(n.clientX,n.clientY).y<dv()?Sv(t,null):(Z.hoveredCard=null,cv());return}let a=document.elementFromPoint(n.clientX,n.clientY)?.closest(`.enemy`),o=a?+a.dataset.idx:-1,s=Z.cb.enemies.filter(e=>e.hp>0);o>=0&&Z.cb.enemies[o].hp>0?Sv(t,o):s.length===1&&S(n.clientX,n.clientY).y<dv()?Sv(t,s[0].idx):(bv(),cv())};e.addEventListener(`pointerup`,e=>n(e,!1)),e.addEventListener(`pointercancel`,e=>n(e,!0))}var dv=()=>Z.ce?.hand?C(Z.ce.hand).top-24:v()-260,fv=(e,t)=>document.elementsFromPoint(e,t).find(e=>!e.closest(`.card`));function pv(e,t){let n=Z.cb,r=n.hand.find(t=>t.uid===e.uid);if(!r){Z.drag=null;return}let i=wm(r);if(i.unplayable||ph(Z.run,n,r)>n.player.energy){if(rh(Z.run,n,r)){e.live=!0,e.free=!0,e.kindleOnly=!0,Z.hoveredCard=null,X.hover(),t.classList.add(`dragging`),Z.ce?.lantern?.classList.add(`kindle-target`);return}Z.drag=null,t.classList.add(`nope`),setTimeout(()=>t.classList.remove(`nope`),350),X.debuff();return}e.live=!0,Z.hoveredCard=null,X.hover(),rh(Z.run,n,r)&&Z.ce?.lantern?.classList.add(`kindle-target`),i.target===`enemy`?yv({kind:`card`,uid:e.uid}):(e.free=!0,bv(),t.classList.add(`dragging`))}async function mv(e){if(Z.hoveredCard=null,!ah(Z.run,Z.cb,e)){cv();return}await Xv(),$v()}function hv(e,t){let n=document.elementFromPoint(e,t)?.closest(`.enemy`);Z.ce?.enemies.forEach(e=>e.root.classList.toggle(`target-hover`,e.root===n&&e.root.classList.contains(`targetable`))),gv()}function gv(){let e=Z.ce,t=Z.cb;if(!e||!t)return;let n=null;Z.targeting?.kind===`card`?n=t.hand.find(e=>e.uid===Z.targeting.uid):Z.drag?.live?n=t.hand.find(e=>e.uid===Z.drag.uid):Z.hoveredCard!=null&&!Z.busy&&(n=t.hand.find(e=>e.uid===Z.hoveredCard));let r=n?wm(n):null,i=Z.targeting?.kind===`card`||Z.drag?.live&&!Z.drag.free,a=t.enemies.filter(e=>e.hp>0).length;t.enemies.forEach((o,s)=>{let c=e.enemies[s],l=null,u=!1;if(n&&!t.over&&o.hp>0&&!r.unplayable&&(r.target===`allEnemies`?l=Th(Z.run,t,n,s):r.target===`enemy`&&(i||a===1)&&(l=Th(Z.run,t,n,s),u=i&&a>1&&!c.root.classList.contains(`target-hover`))),l&&(l.total>0||l.chips>0)){c.prev.classList.remove(`show`,`lethal`,`dim`),c.prev.innerHTML=``,c.root.classList.toggle(`marked`,l.lethal&&!u);let e=Math.min(o.hp,l.loss)/o.maxHp;c.pv.style.left=`${Math.max(0,o.hp-l.loss)/o.maxHp*100}%`,c.pv.style.width=`${e*100}%`,c.pv.classList.toggle(`show`,l.loss>0),c.facets.innerHTML=av(o,u?0:l.chips),c.facets.classList.toggle(`willshatter`,l.willShatter&&!u)}else c.prev.classList.remove(`show`,`lethal`,`dim`),c.root.classList.remove(`marked`),c.pv.classList.remove(`show`),o.hp>0&&(c.facets.innerHTML=av(o)),c.facets.classList.remove(`willshatter`)})}function _v(e){if(Z.busy||!Z.cb||Z.cb.over||performance.now()-lv<350)return;let t=Z.cb,n=t.hand.find(t=>t.uid===e);if(!n)return;if(a_&&Z.hoveredCard!==e&&!(Z.targeting?.kind===`card`&&Z.targeting.uid===e)){Z.hoveredCard=e,X.hover(),cv();return}let r=wm(n),i=ph(Z.run,t,n),a=Q(`.card[data-uid="${e}"]`,Z.ce.hand);if(r.unplayable||i>t.player.energy){a?.classList.add(`nope`),setTimeout(()=>a?.classList.remove(`nope`),350),X.debuff();return}if(Z.targeting?.kind===`card`&&Z.targeting.uid===e)return bv();if(r.target===`enemy`){let n=t.enemies.filter(e=>e.hp>0);if(n.length===1)return void Sv(e,n[0].idx);yv({kind:`card`,uid:e})}else Sv(e,null)}function vv(e){if(!Z.targeting||Z.busy)return;let t=Z.cb.enemies[e];if(!t||t.hp<=0)return;let n=Z.targeting;n.kind===`card`?Sv(n.uid,e):n.kind===`potion`&&A_(n.slot,e)}function yv(e){if(Z.targeting=e,Z.ce.root.classList.add(`targeting`),Z.cb.enemies.forEach((e,t)=>Z.ce.enemies[t].root.classList.toggle(`targetable`,e.hp>0)),cv(),document.addEventListener(`pointermove`,xv),xv._last)xv(xv._last);else{let e=Z.cb.enemies.findIndex(e=>e.hp>0);if(e>=0){let t=Q_(e);xv({clientX:t.x,clientY:t.y,synthetic:!0})}}}function bv(){Z.targeting=null,Q(`#aim`).innerHTML=``,document.removeEventListener(`pointermove`,xv),Z.ce&&(Z.ce.root.classList.remove(`targeting`),Z.ce.enemies.forEach(e=>e.root.classList.remove(`targetable`,`target-hover`)),cv()),w_()}function xv(e){if(e.synthetic||(xv._last=e),!Z.targeting)return;let t;if(Z.targeting.kind===`card`){let e=Q(`.card[data-uid="${Z.targeting.uid}"]`);t=e?Wf(e):{x:_()/2,y:v()-200}}else t={x:_()/2,y:60};let{x:n,y:r}=e.synthetic?{x:e.clientX,y:e.clientY}:S(e.clientX,e.clientY),i=(t.x+n)/2,a=Math.min(t.y,r)-120;if(Q(`#aim`).innerHTML=`<path d="M${t.x} ${t.y-80} Q${i} ${a} ${n} ${r}" fill="none" stroke="rgba(255,89,100,.85)" stroke-width="4" stroke-dasharray="4 10" stroke-linecap="round"/>
    <circle cx="${n}" cy="${r}" r="9" fill="none" stroke="rgba(255,89,100,.95)" stroke-width="3"/>`,Z.ce?.hero){let e=Wf(Z.ce.hero),t=Q(`#lantern`);t.style.setProperty(`--lx`,`${Math.round(e.x+(n-e.x)*.3)}px`),t.style.setProperty(`--ly`,`${Math.round(e.y+(r-e.y)*.3)}px`)}}async function Sv(e,t){bv(),Z.hoveredCard=null,hh(Z.run,Z.cb,e,t)&&(await Xv(t),$v())}async function Cv(){Z.busy||!Z.cb||Z.cb.over||(bv(),X.click(),yh(Z.run,Z.cb),await Xv(),$v())}function wv(e){let t=$(`div`,`turn-banner`,e);l_().appendChild(t),setTimeout(()=>t.remove(),1150)}function Tv(e,t,n,r,{n:i=6,color:a=`#ffe9ac`,size:o=8,dur:s=640,glyph:c=``,cls:l=`flymote`,done:u=null}={}){let d=Q(`#floaties`);for(let f=0;f<i;f++){let p=$(`div`,l,c);p.style.left=`${e}px`,p.style.top=`${t}px`,c?p.style.color=a:(p.style.width=`${o}px`,p.style.height=`${o}px`,p.style.background=`radial-gradient(circle at 35% 30%, #fff, ${a} 55%, transparent 85%)`),d.appendChild(p);let m=(e+n)/2+(Math.random()-.5)*140,h=Math.min(t,r)-50-Math.random()*80,g=p.animate([{transform:`translate(-50%,-50%) scale(0.5)`,opacity:0},{transform:`translate(calc(-50% + ${m-e}px), calc(-50% + ${h-t}px)) scale(1.05)`,opacity:1,offset:.45},{transform:`translate(calc(-50% + ${n-e}px), calc(-50% + ${r-t}px)) scale(0.55)`,opacity:.95}],{duration:s,delay:f*46,easing:`cubic-bezier(.32,.05,.35,1)`});g.onfinish=()=>{p.remove(),f===i-1&&u&&u()}}}var Ev=matchMedia(`(prefers-reduced-motion: reduce)`).matches;function Dv(e,t,n,r=640){if(t=Math.round(t),n=Math.round(n),Ev||t===n){e.textContent=n;return}let i=performance.now(),a=o=>{let s=Math.min(1,(o-i)/r),c=1-(1-s)**3;e.textContent=Math.round(t+(n-t)*c),s<1?requestAnimationFrame(a):(e.textContent=n,e.classList.remove(`tick`),e.offsetWidth,e.classList.add(`tick`))};requestAnimationFrame(a)}function Ov(e){let t=getComputedStyle(e).transform;if(!t||t===`none`)return 0;let n=t.match(/matrix(?:3d)?\(([^)]+)\)/);if(!n)return 0;let r=n[1].split(`,`).map(e=>parseFloat(e.trim())),i=r.length===16?r[13]:r[5];return Math.max(0,-i)}function kv(e,t,n){let r=$(`div`,`cast-shadow`);if(t){let e=document.createElement(`img`);e.src=t,e.alt=``,e.setAttribute(`aria-hidden`,`true`),r.appendChild(e)}else if(n){let e=n.cloneNode(!0);e.setAttribute(`aria-hidden`,`true`),r.appendChild(e)}else r.classList.add(`cast-shadow-blob`);return r}function Av(e,t){if(!e.shadow)return;let n=e.shadowMax||16,r=Math.min(1,t/n),i=1-r*.24,a=.34-r*.16,o=.54-r*.3;e.shadow.style.setProperty(`--sh-sx`,i.toFixed(3)),e.shadow.style.setProperty(`--sh-sy`,a.toFixed(3)),e.shadow.style.setProperty(`--sh-o`,o.toFixed(3)),e.shadow.style.setProperty(`--sh-blur`,`${(2+r*2.5).toFixed(1)}px`),e.shadow.style.setProperty(`--sh-skew`,`${(e.skew*(1-r*.35)).toFixed(2)}deg`)}function jv(){let e=Z.ce,t=Z.cb;e.rig=[];let n=(t,n,r,i,a,o,s=0,c=``)=>{let l=Q(`svg`,n),u=Q(`.enemy-sprite`,n)||n,d=Q(`.raster-art`,u);if(!l&&!d)return;let f=Math.random()*100;if(l){let e=Q(`.breathe`,l);e&&(e.style.animationDuration=`${(2.5+f%1.9).toFixed(2)}s`,e.style.animationDelay=`${(-(f%3.1)).toFixed(2)}s`,e.style.setProperty(`--brY`,(1.022+f%.024).toFixed(3)),e.style.setProperty(`--sw`,`${(f*7%1.7-.85).toFixed(2)}deg`)),s_(`.hover-float`,l).forEach(e=>e.style.animationDelay=`${(-(f%2.7)).toFixed(2)}s`)}else if(o&&(u.classList.add(`idle-${o}`),u.style.animationDelay=`${(-(f%2.8)).toFixed(2)}s`,o===`wisp`||o===`plant`)){let e=$(`div`,`idle-motes`);e.style.setProperty(`--mote`,`hsla(${s},85%,62%,0.6)`),u.appendChild(e)}let p=kv(u,c||d?.src||``,l);n.insertBefore(p,n.firstChild);let m=$(`div`,`lightpool`);m.style.background=`radial-gradient(ellipse at 50% 50%, ${r}, transparent 72%)`,n.appendChild(m),e.rig.push({root:t,art:n,sprite:u,svg:l,eyes:l?s_(`.eye`,l):[],fire:l?Q(`.innerfire`,l):null,pool:m,shadow:p,shadowMax:{wisp:20,eye:20,siren:14,shade:14,plant:10,slime:6}[o]||12,skew:i?5:-4,seed:f,isHero:i,idx:a,dx:0,dy:0}),Av(e.rig[e.rig.length-1],0)};t.enemies.forEach((t,r)=>{let i=Fu[t.key].art;n(e.enemies[r].root,e.enemies[r].art,`hsla(${i.hue},90%,66%,.72)`,!1,r,i.kind,i.hue,Gh(`enemies`,t.key))}),n(e.hero,e.hero,`rgba(127,212,255,.62)`,!0,0,`humanoid`,0,Gh(`heroes`,Wu[Z.run.aspect].id))}function Mv(){if(!sp())return;let e=Z.ce,t=Z.cb;if(!e||!t)return;let n=[],r=Gh(`heroes`,Wu[Z.run.aspect].id),i=e.hero&&(Q(`.hero-sprite`,e.hero)||e.hero);r&&i&&n.push({el:i,url:r,kind:`humanoid`}),t.enemies.forEach((t,r)=>{let i=Gh(`enemies`,t.key),a=e.enemies[r]?.art,o=a&&(Q(`.enemy-sprite`,a)||a);i&&o&&n.push({el:o,url:i,kind:Fu[t.key].art.kind})}),um(n)}function Nv(){requestAnimationFrame(()=>requestAnimationFrame(Mv))}function Pv(){em()}var Fv=!1;function Iv(e){if(Fv)return;requestAnimationFrame(Iv);let t=Z.ce,n=Z.cb;if(Ev||!n||Z.screen!==`combat`||!t?.rig)return;let r=null,i=n.enemies.findIndex(e=>e.hp>0);Z.targeting&&xv._last?r=S(xv._last.clientX,xv._last.clientY):i>=0&&(r=Q_(i));let a=$_();for(let i of t.rig){let t=i.isHero?n.player:n.enemies[i.idx];if(!i.isHero&&t.hp<=0){i.pool.style.opacity=0,i.shadow&&(i.shadow.style.opacity=0);continue}let o=Ov(i.sprite);i.sprite.classList.contains(`mesh-live`)&&(o+=dm(i.sprite)),Av(i,o);let s=i.isHero?r:a;if(s&&i.eyes.length){let e=Wf(i.art),t=Math.atan2(s.y-e.y,s.x-e.x);i.dx+=(Math.cos(t)*2.4-i.dx)*.08,i.dy+=(Math.sin(t)*1.6-i.dy)*.08;let n=`translate(${i.dx.toFixed(2)}px,${i.dy.toFixed(2)}px)`;for(let e of i.eyes)e.style.transform=n}let c=.45+.55*(Math.max(0,t.hp)/t.maxHp);i.root.dataset.choreo===`attack`&&(c+=1.1),(t.statuses?.str||0)>0&&(c+=.3);let l=.86+.14*Math.sin(e*.006+i.seed)*Math.sin(e*.0021+i.seed*3);i.fire&&(i.fire.style.opacity=Math.min(.55,(.05+.13*c)*l).toFixed(3)),i.pool.style.opacity=Math.min(.85,(.3+.4*c)*l).toFixed(3)}}var Lv=!1,Rv={archetype:`slash`,cardId:null,enemyIdx:null},zv=!1,Bv=!1,Vv=0,Hv={beast:`slash`,rogue:`slash`,knight:`slash`,sovereign:`slash`,golem:`blunt`,treeboss:`blunt`,crab:`blunt`,leviathan:`blunt`,zombie:`blunt`,serpent:`pierce`,crawler:`pierce`,maw:`pierce`,plant:`pierce`,wisp:`void`,shade:`void`,eye:`void`,siren:`void`,cultist:`void`,slime:`poison`},Uv=matchMedia(`(prefers-reduced-motion: reduce)`).matches,Wv=new Set([`golem`,`treeboss`,`leviathan`,`crab`]),Gv=new Set([`wisp`,`shade`,`siren`,`eye`,`cultist`]);function Kv(e,t=1,n=`humanoid`){if(Uv||!e)return Promise.resolve();let r=Wv.has(n),i=Gv.has(n),a=r?[{transform:`translateX(0) scale(1,1)`},{transform:`translateX(0) scale(1.08,0.86)`,offset:.35},{transform:`translateX(0) scale(1,1)`}]:i?[{transform:`translateX(0) translateY(0) scale(1,1)`},{transform:`translateX(${6*t}px) translateY(-5px) scale(0.98,1.02)`,offset:.4},{transform:`translateX(${10*t}px) translateY(-2px) scale(1,1)`,offset:.7},{transform:`translateX(0) translateY(0) scale(1,1)`}]:[{transform:`translateX(0) scale(1,1)`},{transform:`translateX(${-8*t}px) scale(0.97,1.02)`,offset:.3},{transform:`translateX(${34*t}px) scale(1.02,0.99)`,offset:.62},{transform:`translateX(0) scale(1,1)`}];return e.dataset.choreo=`attack`,e.animate(a,{duration:r?420:i?380:330,easing:`cubic-bezier(0.34, 1.56, 0.64, 1)`}).finished.finally(()=>{delete e.dataset.choreo}).catch(()=>{})}function qv(e,t=1){Uv||!e||(nm(e),e.animate([{transform:`translateX(0) scale(1,1)`,filter:`brightness(1)`},{transform:`translateX(${9*t}px) scale(0.97,1.03)`,filter:`brightness(1.9)`,offset:.25},{transform:`translateX(0) scale(1,1)`,filter:`brightness(1)`}],{duration:300,easing:`cubic-bezier(0.22, 1, 0.36, 1)`}))}function Jv(e){return Uv||!e?Promise.resolve():e.animate([{transform:`translateY(0) rotate(0deg)`,filter:`brightness(1)`},{transform:`translateY(5px) rotate(-2.5deg)`,filter:`brightness(0.6)`}],{duration:360,easing:`cubic-bezier(0.22, 1, 0.36, 1)`,fill:`forwards`}).finished.catch(()=>{})}function Yv(e,t=200){if(sp()&&sm(e.root,0)){for(let t=0;t<3;t++)om(e.art);let n=performance.now(),r=()=>{let i=Math.min(1,(performance.now()-n)/t),a=i*i*(3-2*i);sm(e.root,a)&&i<1&&requestAnimationFrame(r)};requestAnimationFrame(r);return}tm(e.root);let n=e.art&&Q(`.cracks`,e.art);n&&(n.insertAdjacentHTML(`beforeend`,Qh(!0)),n.children.length<9&&n.insertAdjacentHTML(`beforeend`,Qh(!0))),e.root.classList.add(`igniting`)}async function Xv(e=null){let t=Z.cb,n=Z.ce;Z.busy=!0,n.endTurn.classList.add(`enemy-phase`);let r=t.queue;for(;r.length;){let t=r.shift();try{await Qv(t,e)}catch(e){console.error(`vfx event error`,t,e)}}Z.busy=!1,t.over||n.endTurn.classList.remove(`enemy-phase`),ov(),sv(),T_()}var Zv=null;async function Qv(e,t){let n=Z.cb,r=Z.ce;switch(e.t){case`chip`:{let t=r.enemies[e.idx],{x:n,y:i}=Q_(e.idx);X.chip(),Nf(n,i,{color:`#e8f4ff`,n:5,speed:190,size:1.8,grav:240,kind:`spark`}),ov(),t.facets.classList.remove(`pop`),t.facets.offsetWidth,t.facets.classList.add(`pop`),await c_(110);break}case`shatter`:{let t=r.enemies[e.idx],{x:n,y:i}=Q_(e.idx);Zv={x:n,y:i},X.shatter(),jf(90),Pf(n,i,`#dfeaff`,10,700,5),Nf(n,i,{color:`#dfeaff`,n:26,speed:430,size:2.4,grav:300,kind:`spark`}),Lf(n,i-58,`${J(`stagger`,20)} SHATTER`,`shatterf`),Af(10),tf(.9),t.art,t.root.classList.add(`hurt`),setTimeout(()=>t.root.classList.remove(`hurt`),320),ov(),await c_(380);break}case`adamantHold`:{let{x:t,y:n}=Q_(e.idx);X.blocked(),Lf(t,n-52,`THE GLASS HOLDS`,`blockedf`),Pf(t,n,`#d8c27a`,8,480,4),ov(),await c_(260);break}case`ember`:if(e.n>0&&r.lantern){let t=Zv||$_(),n=Wf(r.lantern);Tv(t.x,t.y,n.x,n.y,{n:Math.min(e.n*2,5),color:`#ffb35a`,size:6,dur:460}),X.ember(),setTimeout(()=>{r.lantern.classList.remove(`pop`),r.lantern.offsetWidth,r.lantern.classList.add(`pop`),ov()},440),await c_(300)}else ov();Zv=null;break;case`kindle`:{let t=Q(`.card[data-uid="${e.uid}"]`,r.hand);t&&(Zv=Wf(t)),X.kindle(),await c_(60);break}case`art`:{Rv={archetype:`fire`,cardId:`art:${e.id}`,enemyIdx:null},zv=!1;{let{x:t,y:n}=Wf(r.lantern);Qf[`art:${e.id}`]?.(t,n),zv=!0}let t=Hu[e.id],{x:n,y:i}=$_(),a=r.lantern?Wf(r.lantern):{x:n,y:i};X.art(),Mf(t.tone,.12,.5),Pf(a.x,a.y,t.tone,10,620,5),If(n,i,t.tone,12),Lf(n,i-84,t.name.toUpperCase(),`artf`);let o=Gh(`arts`,e.id);if(o){let e=$(`img`,`art-cast`);e.src=o,Q(`#floaties`).appendChild(e),e.style.left=`${n}px`,e.style.top=`${i-30}px`,e.animate([{transform:`translate(-50%,-50%) scale(0.4)`,opacity:0},{transform:`translate(-50%,-58%) scale(1)`,opacity:1,offset:.3},{transform:`translate(-50%,-70%) scale(1.05)`,opacity:0}],{duration:900,easing:`cubic-bezier(.2,.7,.3,1)`}).onfinish=()=>e.remove()}tf(.7),ov(),await c_(420);break}case`staggered`:{let t=r.enemies[e.idx],{x:n,y:i}=Q_(e.idx);X.stagger(),Lf(n,i-76,`STAGGERED`,`staggerf`),t.root.classList.add(`reseaming`),setTimeout(()=>t.root.classList.remove(`reseaming`),720),ov(),await c_(520);break}case`smolderJump`:{let t=Q_(e.from),n=Q_(e.to);X.poison(),Tv(t.x,t.y,n.x,n.y,{n:5,color:`#d3a15a`,size:7,dur:460}),await c_(400);break}case`turn`:e.n>1&&(wv(`YOUR TURN`),X.turn()),ov(),await c_(e.n>1?500:120);break;case`endTurn`:Lv=!1,wv(`ENEMY TURN`),await c_(480);break;case`draw`:sv(),ov(),X.draw(),await c_(75);break;case`reshuffle`:{X.card();let e=Wf(r.discard),t=Wf(r.draw);Tv(e.x,e.y,t.x,t.y,{n:6,cls:`flycard`,dur:520}),Lf(t.x,t.y-46,`Reshuffle`,`notice`),await c_(420);break}case`play`:{let i=Q(`.card[data-uid="${e.uid}"]`,r.hand);if(X.card(),Lv=!0,Vv=0,Rv={archetype:ku[e.id]?.vfx||`slash`,cardId:e.id,enemyIdx:null},zv=!1,Bv=!1,!zv&&Qf[e.id]&&[`ascension`,`pyreheart`,`emberdance`,`limitBreak`].includes(e.id)){let t=n.enemies.findIndex(e=>e.hp>0),r=e.id===`limitBreak`&&t>=0?Q_(t):$_();Qf[e.id](r.x,r.y),zv=!0}if(i&&t!=null&&n.enemies[t]){let e=C(i),{x:n,y:r}=Q_(t),a=i.cloneNode(!0);Object.assign(a.style,{position:`fixed`,left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`,margin:0,transform:`none`,zIndex:56,pointerEvents:`none`}),document.getElementById(`floaties`).appendChild(a),i.remove(),a.animate([{transform:`none`,opacity:1},{transform:`translate(${n-e.left-e.width/2}px,${r-e.top-e.height/2}px) scale(0.22) rotate(14deg)`,opacity:0}],{duration:270,easing:`cubic-bezier(.45,0,.9,.5)`}).onfinish=()=>a.remove()}else i&&(i.classList.add(`played-up`),setTimeout(()=>i.remove(),320));ov(),await c_(200);break}case`hitEnemy`:{let t=r.enemies[e.idx],{x:i,y:a}=Q_(e.idx);if(e.poison)X.poison(),If(i,a,`#d3a15a`,14),Lf(i,a-20,`${e.amount}`,`poisonf`);else{let o=e.amount>=16;if(Lv&&Rv.cardId&&!String(Rv.cardId).startsWith(`art:`)&&(Bv||=(await Kv(r.hero,1,`humanoid`),!0)),X.slash(),e.amount>0&&X.hit(),!zv&&Rv.cardId&&Qf[Rv.cardId]&&(Qf[Rv.cardId](i,a),zv=!0),Xf(i,a,Rv.archetype,Math.min(1,e.amount/24)),qv(t.root,1),e.blocked>0&&(X.blocked(),Lf(i,a+26,`${J(`shield`,19)}${e.blocked}`,`blockedf`),Nf(i,a+8,{color:`#9fd4ff`,n:9,speed:210,size:2,grav:260,kind:`spark`}),n.enemies[e.idx].block===0&&e.amount===0&&(Lf(i,a-2,`GUARD SHATTERED`,`shatterf`),Yf(i,a,`#9fd4ff`,14))),e.amount>0){let t=e.killingBlow&&e.overkill>=8?`dmg-overkill`:e.killingBlow?`dmg-kill`:o?`dmg-big`:`dmg`;Lf(i,a-24,`${e.amount}`,t,{tint:Gf[Rv.archetype]||``,dx:(Vv++%3-1)*34})}else e.blocked||Lf(i,a-24,`0`,`blockedf`);Af(Math.min(4+e.amount*.5,15)),tf(Math.min(.2+e.amount/26,1)),o&&(jf(70),Pf(i,a,`#ffd8a0`,10,620,5)),e.killingBlow&&(jf(e.overkill>=8?130:90),tf(Math.min(1.6,.6+e.overkill*.06)),Pf(i,a,`#ffffff`,8,780,5),Pf(i,a,`#ffd8a0`,14,900,4),Mf(`#ffe6b0`,.09,.28),e.overkill>=8&&(Mf(`#ffffff`,.12,.24),Nf(i,a,{color:`#fff3d6`,n:26,speed:620,size:2.6,grav:200,kind:`spark`}),Nf(i,a,{color:`#ffd76e`,n:12,speed:300,size:3.4,grav:120,kind:`spark`}))),e.amount>0&&t.art}t.root.classList.add(`hurt`),setTimeout(()=>t.root.classList.remove(`hurt`),320),ov(),await c_(230);break}case`die`:{let t=r.enemies[e.idx],i=n.enemies[e.idx],{x:a,y:o}=Q_(e.idx);Zv={x:a,y:o},i.boss&&(document.body.classList.add(`worldstop`),t.root.classList.add(`doomed`),jf(110),await c_(820),document.body.classList.remove(`worldstop`),t.root.classList.remove(`doomed`)),await Jv(t.art);let s=i.boss?320:200;Ev||(Yv(t,s),await c_(s)),(i.boss||i.elite?X.bigDeath:X.death)(),Ev||sm(t.root,1);let c=sp()?lm(t.root):null;c||tm(t.root),Uf(t.art,c||{}),Nf(a,o,{color:`#dfeaff`,n:30,speed:480,size:2.6,grav:340,kind:`spark`}),Nf(a,o,{color:`#c9b0ff`,n:26,speed:380,size:3.2,grav:60}),Pf(a,o,`#e8dcff`,12,720,6),Mf(`#ffffff`,i.boss?.24:.1,.3),Af(i.boss?22:12),tf(i.boss?2:.9),t.root.classList.add(`dying`),setTimeout(()=>{t.root.classList.remove(`dying`),t.root.classList.add(`gone`),t.reaped=!0},830),await c_(i.boss?900:500);break}case`hitPlayer`:{let{x:t,y:i}=$_();if(e.source===`poison`?(X.poison(),If(t,i,`#d3a15a`,14)):e.source===`burn`||e.source===`self`?X.debuff():e.source===`thorns`?X.blocked():(X.slash(),e.amount>0&&(X.hit(),Mf(`#ff2233`,Math.min(.05+e.amount*.012,.3),.3)),Xf(t,i,Rv.archetype,Math.min(1,e.amount/24)),qv(r.hero,-1)),e.blocked>0&&(X.blocked(),Lf(t,i+30,`${J(`shield`,19)}${e.blocked}`,`blockedf`),Nf(t,i+8,{color:`#9fd4ff`,n:9,speed:210,size:2,grav:260,kind:`spark`}),n.player.block===0&&e.amount===0&&(Lf(t,i-2,`GUARD SHATTERED`,`shatterf`),Yf(t,i,`#9fd4ff`,14))),e.amount>0){let n=e.amount>=16;Lf(t,i-30,`${e.amount}`,n?`dmg-big`:`dmg`,{tint:Gf[Rv.archetype]||``,dx:(Vv++%3-1)*34}),Af(Math.min(5+e.amount*.6,18)),tf(Math.min(.3+e.amount/22,1.2))}else e.blocked||Lf(t,i-30,`0`,`blockedf`);ov(),T_(),await c_(240);break}case`blockGain`:{let t=e.who===`player`,{x:n,y:i}=t?$_():Q_(e.who);X.block(),Lf(n,i-10,`${J(`shield`,22)} ${e.n}`,`blockf`);let a=t?r.pBlock:r.enemies[e.who].block;a.classList.remove(`pulse`),a.offsetWidth,a.classList.add(`pulse`),ov(),await c_(140);break}case`status`:{let{x:t,y:n}=e.who===`player`?$_():Q_(e.who),r=ju[e.id]||{name:e.id,kind:`buff`},i=r.kind===`debuff`||e.id===`str`&&e.n<0;(e.id===`poison`?X.poison:i?X.debuff:X.buff)(),Lf(t,n-46,`${e.n>0?`+`:``}${e.n} ${r.name}`,i?`debufff`:`bufff`),i||If(t,n,`#9fc8ff`,6),ov(),await c_(170);break}case`heal`:{let{x:t,y:n}=e.who===`player`?$_():Q_(e.who);X.heal(),If(t,n,`#8fe8a0`,14),Lf(t,n-30,`+${e.n}`,`healf`),ov(),T_(),await c_(200);break}case`energy`:ov(),r.energy.classList.remove(`pop`),r.energy.offsetWidth,r.energy.classList.add(`pop`);break;case`exhaust`:{let t=Q(`.card[data-uid="${e.uid}"]`,r.hand);if(t){let e=C(t),n=t.cloneNode(!0);Object.assign(n.style,{position:`fixed`,left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`,margin:0,transform:`none`,zIndex:56,pointerEvents:`none`}),document.getElementById(`floaties`).appendChild(n),t.remove(),n.animate([{clipPath:`circle(80% at 50% 55%)`,filter:`brightness(1)`},{clipPath:`circle(44% at 50% 55%)`,filter:`brightness(1.8) saturate(1.6) sepia(0.45)`,offset:.45},{clipPath:`circle(0% at 50% 55%)`,filter:`brightness(2.6) saturate(2) sepia(0.85)`}],{duration:540,easing:`ease-in`}).onfinish=()=>n.remove(),Nf(e.left+e.width/2,e.top+e.height/2,{color:`#ffb066`,n:22,speed:190,grav:-150,size:2.4,life:.85}),await c_(260)}ov();break}case`discardHand`:{let e=s_(`.card`,r.hand);e.length&&(X.card(),e.forEach((e,t)=>{e.animate([{opacity:1},{transform:`${e.style.transform} translateX(340px) rotate(20deg)`,opacity:0}],{duration:260,delay:t*28,easing:`ease-in`}).onfinish=()=>e.remove()}),await c_(280+e.length*28)),ov();break}case`enemyAct`:{let t=r.enemies[e.idx],{x:i,y:a}=Q_(e.idx);Vv=0;let o=Fu[n.enemies[e.idx].key]?.moves?.[e.move],s=Hv[Fu[n.enemies[e.idx].key]?.art?.kind]||`slash`;Rv={archetype:o?.intent?.startsWith(`attack`)?s:o?.intent===`debuff`?`void`:o?.intent===`buff`||o?.intent===`block`?`ward`:s,cardId:null,enemyIdx:e.idx},zv=!1,Bv=!1,t.intent.classList.remove(`telegraph`),t.intent.offsetWidth,t.intent.classList.add(`telegraph`),Lf(i,a-90,e.name,`movef`),await c_(300),o?.intent?.startsWith(`attack`)?(await Kv(t.root,-1,Fu[n.enemies[e.idx].key]?.art?.kind),Bv=!0):await c_(320),t.intent.classList.remove(`telegraph`);break}case`intent`:ov();break;case`addCard`:Lf(_()/2,v()*.62,`${ku[e.id].name} added to ${e.where===`hand`?`hand`:`discard`}`,`notice`),X.debuff(),ov(),sv(),await c_(240);break;case`relicProc`:{let t=Q(`.hud-relic[data-relic="${e.id}"]`);t&&(t.classList.remove(`proc`),t.offsetWidth,t.classList.add(`proc`)),await c_(90);break}case`maxHp`:{let{x:t,y:n}=$_();Lf(t,n-60,`+${e.n} MAX HP`,`healf`),X.buff(),await c_(160);break}case`potion`:X.potion(),await c_(120);break;case`powerConsumed`:{let t=Q(`.card[data-uid="${e.uid}"]`,r.hand),n=t?Wf(t):{x:_()/2,y:v()-180},{x:i,y:a}=$_();Tv(n.x,n.y,i,a,{n:7,color:`#c9a8ff`,size:7,dur:560}),X.buff(),setTimeout(()=>{Pf(i,a,`#c9a8ff`,12,460,4),If(i,a,`#c9a8ff`,8)},560),await c_(300);break}case`victory`:if(Z.lastPerfect=!!e.perfect,await c_(320),X.victory(),Mf(`#ffe9ac`,.16,.6),e.perfect){let e=$(`div`,`turn-banner perfect-banner`,`PERFECT`);l_().appendChild(e),setTimeout(()=>e.remove(),1400),await c_(500)}break;case`defeat`:{await c_(400),X.defeat(),Mf(`#300`,.5,1.2);let e=Q(`#lantern`);e.classList.add(`gutter`),e.style.setProperty(`--la`,`1`),e.style.setProperty(`--lr`,`160px`),await c_(900);break}}}function $v(){let e=Z.cb;!e||!e.over||(e.result===`win`?ey():ty())}function ey(){R_(`victory-out`);let e=Z.run,t=Z.cb.kind,n=Z.cb.affix;if(Z.cb=null,e.pendingCombat=null,t===`boss`&&e.act>=2){let{newUnlocks:t}=Tg(e,!0);Ih(e,!0),z_(`end`,{won:!0,newUnlocks:t});return}z_(`reward`,{kind:t,rewards:zm(e,t,n)})}function ty(){R_(`defeat`);let e=Z.run,t=kg(e),n=e.map.nodes.find(t=>t.id===e.nodeId),r=n?n.row:Math.max(1,e.floorsClimbed-1),{newUnlocks:i}=Tg(e,!1);Ih(e,!1),z_(`end`,{won:!1,newUnlocks:i,offers:t,fallAct:e.act,fallRow:r})}function ny({kind:e,rewards:t}){let n=Z.run,r=l_(),i=e===`boss`?`BOSS VANQUISHED`:e===`elite`?`ELITE SLAIN`:`VICTORY`,a=Z.lastPerfect?`<div class="perfect-seal">✦ PERFECT — the glass untouched ✦</div>`:`<div class="ornament">✦ ✦ ✦</div>`;Z.lastPerfect=!1,r.innerHTML=`<div class="center-panel screen-enter">${f_()}<div class="panel">
    <div class="ov-title">${i}</div>
    ${a}
    <div class="reward-list"></div>
    <div class="ov-actions"><button class="btn btn-primary" data-a="continue">Continue</button></div>
  </div></div>`;let o=Q(`.reward-list`,r),s=(e,t,r,i=null)=>{let a=$(`button`,`reward-row`,`<span class="ric">${e}</span><span>${t}</span>`);return i&&(a._tip=i),a.onclick=()=>{r()!==!1&&(a.classList.add(`taken`),Mh(n),T_())},o.appendChild(a),a};if(s(J(`coin`,18),`<b class="gold-num">${t.gold}</b> gold`,()=>{n.player.gold+=t.gold,n.stats.goldEarned+=t.gold,X.coin(),requestAnimationFrame(()=>{let e=Q(`#hud .gold-num`),r={x:_()/2,y:v()/2-40},i=e?Wf(e):{x:120,y:24},a=n.player.gold-t.gold;e&&(e.textContent=a),Tv(r.x,r.y,i.x,i.y,{n:Math.min(9,4+Math.floor(t.gold/12)),color:`#ffd76e`,dur:600,done:()=>X.coin()}),e&&Dv(e,a,n.player.gold,640)})}),t.potion){let e=Pu[t.potion];s(d_(`potions`,t.potion,og(e.tone)),`${e.name}`,()=>{if(!Im(n,t.potion))return Lf(_()/2,v()/2,`Potion slots full!`,`notice`),!1;X.potion()},{title:e.name,body:e.text})}if(t.relic){let e=Mu[t.relic];s(`<span style="color:${e.tone};text-shadow:0 0 8px ${e.tone}">${p_(t.relic,24)}</span>`,`<b>${e.name}</b>`,()=>{Pm(n,t.relic),X.relic(),requestAnimationFrame(()=>{let n=Q(`.hud-relic[data-relic="${t.relic}"]`);if(!n)return;let r=Wf(n);Tv(_()/2,v()/2-40,r.x,r.y,{n:1,glyph:e.glyph,color:e.tone,dur:680,done:()=>{n.classList.remove(`proc`),n.offsetWidth,n.classList.add(`proc`)}})})},{title:e.name,body:e.text})}s(J(`cards`,26),`Add a card to your deck`,()=>(l(t.cards,()=>{}),!1));let c=o.lastElementChild;c.dataset.cardrow=`1`,Q(`[data-a="continue"]`,r).onclick=()=>{X.click(),Mh(n),z_(e===`boss`?`bossRelic`:`map`)};function l(e,t){P_(`Choose a Card`,e.map(e=>({id:e,up:!1,uid:null})),{sub:`Add one card to your deck — or skip to keep it lean.`,pick:e=>{e&&(Eh(n,e.id),X.upgrade(),Lf(_()/2,v()/2,`${wm(e).name} added`,`notice`)),c.classList.add(`taken`),Mh(n),t()},canSkip:!0})}}function ry(){let e=Z.run,t=Bm(e),n=l_();n.innerHTML=`<div class="center-panel screen-enter"><div class="panel" style="width:min(620px,94vw)">
    <div class="ov-title">A BOSS RELIC CALLS</div>
    <div class="ov-sub">Choose one — its power is permanent.</div>
    <div class="big-choices" style="flex-direction:column"></div>
  </div></div>`;let r=Q(`.big-choices`,n);for(let n of t){let t=Mu[n],i=$(`button`,`relic-pick`);i.innerHTML=`<span class="relic-chip" style="--tone:${t.tone}">${p_(n,26)}</span><span><b>${t.name}</b><span class="rd">${t.text}</span></span>`,i.onclick=()=>{X.relic(),Pm(e,n),iy()},r.appendChild(i)}let i=$(`button`,`btn ghost`,`Take none`);i.style.marginTop=`10px`,i.onclick=()=>{X.click(),iy()},r.appendChild(i)}function iy(){let e=Z.run;e.act++,e.omens.push(bm(e)),e.nodeId=null,e.map=Em(e),Nm(e,Math.round(e.player.maxHp*.35)),$d(e.act),Bd(e.act,0),Hg(e.act),Mh(e),R_(`act-change`),z_(`map`),X.victory()}function ay(e){let t=Bu[e.omens?.[e.act]];if(!t||Z.screen!==`map`)return;let n=e.omens[e.act],r=Gh(`omens`,n),i=$(`div`,`turn-banner omen-banner`,`${r?`<img class="ob-art" src="${r}" alt="">`:`<span class="ob-glyph" style="color:${t.tone}">${J(`omen-${n}`,22)}</span>`} OMEN — ${t.name.toUpperCase()}<div class="ob-sub">${t.text}</div>`);l_().appendChild(i),X.omen(),setTimeout(()=>i.remove(),4200)}function oy(){let e=Z.run,t=e.player.deck.some(e=>!e.up&&ku[e.id].up);l_().innerHTML=`<div class="center-panel screen-enter">${f_()}<div class="panel">
    <div class="ov-title">REST SITE</div>
    <div class="art-lg">${d_(`props`,`campfire`,cg())}</div>
    <div class="ov-sub">The fire crackles. For a moment, the Spire is quiet.</div>
    <div class="big-choices">
      <button class="btn btn-primary" data-a="rest">${J(`flame`,18)} Rest <span style="font-size:13px;opacity:.8">— heal ${Math.round(e.player.maxHp*Sm(e))} HP</span></button>
      <button class="btn" data-a="smith" ${t?``:`disabled`}>${J(`hammer`,18)} Smith <span style="font-size:13px;opacity:.8">— upgrade a card</span></button>
    </div>
  </div></div>`,Q(`[data-a="rest"]`).onclick=t=>{t.currentTarget.disabled=!0,Q(`[data-a="smith"]`).disabled=!0,X.heal();let n=Nm(e,Math.round(e.player.maxHp*Sm(e)));Mf(`#ff9a4d`,.12,.8),Lf(_()/2,v()/2-40,`+${n} HP`,`healf`),If(_()/2,v()/2,`#8fe8a0`,22),If(_()/2,v()/2+60,`#ffb066`,16),Mh(e),setTimeout(()=>{Z.screen===`rest`&&z_(`map`)},900)},Q(`[data-a="smith"]`).onclick=()=>{X.click(),P_(`Upgrade a Card`,e.player.deck.filter(e=>!e.up&&ku[e.id].up),{sub:`Forge one card into its + form.`,pick:t=>{t&&(Oh(e,t.uid),X.upgrade(),Mf(`#ffe9ac`,.12,.4),P_(`Upgraded!`,[e.player.deck.find(e=>e.uid===t.uid)],{sub:`It gleams with new power.`}),Mh(e),setTimeout(()=>{Z.screen===`rest`&&(N_(),z_(`map`))},1300))}})}}function sy(){let e=Z.run;l_().innerHTML=`<div class="center-panel screen-enter">${f_()}<div class="panel">
    <div class="ov-title">TREASURE</div>
    <div class="art-lg" style="cursor:pointer" data-a="open">${d_(`props`,`chest`,sg(!1))}</div>
    <div class="ov-sub">A heavy chest, banded in gold. Open it?</div>
    <div class="big-choices"><button class="btn btn-primary" data-a="open">Open the Chest</button></div>
  </div></div>`;let t=()=>{let t=Fm(e,{common:.55,uncommon:.35,rare:.1});Q(`.art-lg`).innerHTML=d_(`props`,`chest-open`,sg(!0)),X.relic(),Mf(`#ffe9ac`,.2,.5),Nf(_()/2,v()/2,{color:`#ffd97a`,n:36,speed:380,grav:160});let n=Q(`.big-choices`);if(t){Pm(e,t);let n=Mu[t];Q(`.ov-sub`).innerHTML=`You claim <b style="color:${n.tone}">${n.name}</b> — <i>${n.text}</i>`}else e.player.gold+=60,Q(`.ov-sub`).innerHTML=`Only coins remain — <b class="gold-num">+60 gold</b>.`,X.coin();T_(),Mh(e),n.innerHTML=``;let r=$(`button`,`btn btn-primary`,`Continue`);r.onclick=()=>{X.click(),z_(`map`)},n.appendChild(r)};s_(`[data-a="open"]`).forEach(e=>e.onclick=t)}function cy(){let e=Z.run,t=Z.shopData||={};(Z.screen!==`shop`||!t.stock||t.forNode!==e.nodeId)&&(t.stock=Vm(e),t.forNode=e.nodeId);let n=t.stock,r=l_();r.innerHTML=`<div class="center-panel screen-enter">${f_()}<div class="panel ov-panel" style="width:min(980px,96vw)">
    <div style="display:flex;align-items:center;justify-content:center;gap:18px">
      <div style="width:130px">${d_(`props`,`merchant`,lg())}</div>
      <div><div class="ov-title" style="text-align:left">THE MERCHANT</div>
      <div class="ov-sub" style="text-align:left;margin:0">"Gold for glory, stranger. Everything's fair-priced — for the doomed."</div></div>
    </div>
    <div class="shop-grid">
      <div class="shop-row cards-row"></div>
      <div class="shop-row misc-row"></div>
      <div class="ov-actions"><button class="btn btn-primary" data-a="leave">Leave the Shop</button></div>
    </div>
  </div></div>`;let i=Q(`.cards-row`,r),a=Q(`.misc-row`,r),o=Q(`.shop-grid`,r),s=!1,c=()=>e.player.gold,l=t=>{e.player.gold-=t,X.coin(),Mh(e),T_(),u()};function u(){o&&o.classList.toggle(`list-seq-done`,s),i.innerHTML=``,a.innerHTML=``;for(let t of n.cards){let n=$(`div`,`shop-item ${t.sold?`sold`:``} ${c()<t.price?`cant`:``}`),r=C_({id:t.id,up:!1,uid:null},{size:138});r.onclick=()=>{if(t.sold||c()<t.price)return X.debuff();t.sold=!0,Eh(e,t.id),l(t.price)},n.appendChild(r),n.appendChild($(`div`,`price`,`${J(`coin`,14)} ${t.price}`)),i.appendChild(n)}for(let t of n.relics){let n=Mu[t.id],r=$(`div`,`shop-item ${t.sold?`sold`:``} ${c()<t.price?`cant`:``}`),i=$(`button`,`shop-relic`,`<span class="relic-chip" style="--tone:${n.tone}">${p_(t.id,24)}</span><b>${n.name}</b>${n.text}`);i.onclick=()=>{if(t.sold||c()<t.price)return X.debuff();t.sold=!0,Pm(e,t.id),X.relic(),l(t.price)},r.appendChild(i),r.appendChild($(`div`,`price`,`${J(`coin`,14)} ${t.price}`)),a.appendChild(r)}for(let t of n.potions){let n=Pu[t.id],r=$(`div`,`shop-item ${t.sold?`sold`:``} ${c()<t.price?`cant`:``}`),i=$(`button`,`shop-relic`,`<span style="width:34px;height:44px">${d_(`potions`,t.id,og(n.tone))}</span><b>${n.name}</b>${n.text}`);i.onclick=()=>{if(t.sold||c()<t.price)return X.debuff();if(!Im(e,t.id)){Lf(_()/2,v()/2,`Potion slots full!`,`notice`);return}t.sold=!0,X.potion(),l(t.price)},r.appendChild(i),r.appendChild($(`div`,`price`,`${J(`coin`,14)} ${t.price}`)),a.appendChild(r)}let t=$(`div`,`shop-item ${n.removed?`sold`:``} ${c()<n.removeCost?`cant`:``}`),r=$(`button`,`shop-relic`,`<span style="width:34px;display:inline-flex;justify-content:center">${J(`scissors`,26)}</span><b>Card Removal</b>Remove a card from your deck forever.`);r.onclick=()=>{if(n.removed||c()<n.removeCost)return X.debuff();P_(`Remove a Card`,e.player.deck,{sub:`Cut the dead weight.`,pick:t=>{t&&(Dh(e,t.uid),n.removed=!0,e.player.gold-=n.removeCost,X.card(),Mh(e),T_(),u())},canSkip:!0,skipLabel:`Cancel`})},t.appendChild(r),t.appendChild($(`div`,`price`,`${J(`coin`,14)} ${n.removeCost}`)),a.appendChild(t),s=!0}u(),Q(`[data-a="leave"]`,r).onclick=()=>{X.click(),z_(`map`)}}function ly(e){let t=Z.run,n=Lu[e],r=l_();r.innerHTML=`<div class="center-panel screen-enter">${f_()}<div class="panel event-panel">
    <div class="ov-title">${n.name.toUpperCase()}</div>
    <div class="event-art">${d_(`events`,e,ug(n.glyph,n.hue))}</div>
    <div class="event-text">${n.text}</div>
    <div class="event-log"></div>
    <div class="event-choices"></div>
  </div></div>`;let i=Q(`.event-choices`,r);for(let[e,r]of n.choices.entries()){let n=$(`button`,`event-choice${e===0?` btn-primary`:``}`,`<b>${r.label}</b>${r.sub?`<div class="sub">${r.sub}</div>`:``}`);r.needGold&&t.player.gold<r.needGold&&(n.disabled=!0),n.onclick=()=>a(r),i.appendChild(n)}async function a(e){X.click();let{pending:n,log:a}=Lh(t,e.ops);T_();let s=Q(`.event-log`,r),c=[];for(let e of a)e.text&&c.push(e.text),e.relic&&c.push(`Gained <b style="color:${Mu[e.relic].tone}">${Mu[e.relic].name}</b> — <i>${Mu[e.relic].text}</i>`);c.length&&(s.innerHTML=c.join(`<br>`)),i.innerHTML=``;for(let e of n)await o(e);Mh(t),T_();let l=$(`button`,`btn btn-primary`,`Continue`);l.onclick=()=>{X.click(),z_(`map`)},i.appendChild(l),!c.length&&!n.length&&!e.ops.length&&z_(`map`)}function o(e){return new Promise(n=>{if(e===`remove`)P_(`Remove a Card`,t.player.deck,{sub:`Let it go.`,pick:e=>{e&&(Dh(t,e.uid),X.card()),n()},canSkip:!1});else if(e===`upgrade`){let e=t.player.deck.filter(e=>!e.up&&ku[e.id].up);if(!e.length)return n();P_(`Upgrade a Card`,e,{sub:`The forge hungers.`,pick:e=>{e&&(Oh(t,e.uid),X.upgrade()),n()}})}else e===`duplicate`?P_(`Duplicate a Card`,t.player.deck,{sub:`The mirror remembers.`,pick:e=>{e&&(kh(t,e.uid),X.upgrade()),n()}}):e.pickCard?P_(`Choose a Card`,Rm(t,e.pickCard).map(e=>({id:e,up:!1,uid:null})),{sub:`One page still glows.`,pick:e=>{e&&(Eh(t,e.id),X.upgrade()),n()},canSkip:!0}):n()})}}function uy(e){return e.kind===`relic`?{icon:p_(e.id,20),name:Mu[e.id]?.name||e.id,note:`your rarest relic`}:e.kind===`card`?{icon:`🂠`,name:(ku[e.id]?.name||e.id)+(e.up?`+`:``),note:`your finest card`}:{icon:J(`coin`,20),name:`${e.amount} gold`,note:`a cache of gold`}}function dy(e){if(e===`aspect2`)return{kind:`Aspect Unlocked`,name:`The Ashwarden`};let[t,n]=e.split(`:`);return t===`card`?{kind:`Card Unlocked`,name:ku[n]?.name||n}:{kind:`Relic Unlocked`,name:Mu[n]?.name||n}}function fy(e=[]){if(!e.length)return;let t=Q(`#toasts`);t||(t=$(`div`),t.id=`toasts`,b().appendChild(t)),e.forEach((e,n)=>{let r=dy(e);setTimeout(()=>{let e=$(`div`,`unlock-toast`,`<div class="ut-kind">✦ ${r.kind}</div><div class="ut-name">${r.name}</div>`);t.appendChild(e),requestAnimationFrame(()=>e.classList.add(`in`)),X.relic(),setTimeout(()=>{e.classList.remove(`in`),setTimeout(()=>e.remove(),500)},3800)},700+n*800)})}function py({won:e,newUnlocks:t=[],offers:n=[],fallAct:r=0,fallRow:i=1}){let a=Z.run;Ug();let o=a.stats,s=Math.max(1,Math.round((Date.now()-o.start)/6e4)),c=a.act*15+a.floorsClimbed,l=`<div class="stats-grid">
      <div class="stat-cell"><div class="v">${c}</div><div class="k">Floors</div></div>
      <div class="stat-cell"><div class="v">${o.slain}</div><div class="k">Slain</div></div>
      <div class="stat-cell"><div class="v">${o.elites+o.bosses}</div><div class="k">Elites & Bosses</div></div>
      <div class="stat-cell"><div class="v">${a.player.deck.length}</div><div class="k">Deck Size</div></div>
      <div class="stat-cell"><div class="v">${o.dmgDealt}</div><div class="k">Damage Dealt</div></div>
      <div class="stat-cell"><div class="v">${o.dmgTaken}</div><div class="k">Damage Taken</div></div>
      <div class="stat-cell"><div class="v">${o.cardsPlayed}</div><div class="k">Cards Played</div></div>
      <div class="stat-cell"><div class="v">${s}m</div><div class="k">Run Time</div></div>
    </div>`,u=`<div class="end-btns">
      <button class="btn" data-a="deck">View Final Deck</button>
      <button class="btn" data-a="title">Return to the Vigil</button>
    </div>`;if(e){l_().innerHTML=`<div class="end-screen screen-enter">
      <div class="end-title win">ASCENDED</div>
      <div class="ov-sub" style="font-size:17px">The Eternal Sovereign is dust. Dawn breaks over the Spire — the first in an age.</div>
      ${l}${u}
    </div>`,ef(),X.victory(),Mf(`#ffe9ac`,.25,1);let e=setInterval(()=>Nf(Math.random()*_(),v()*.2,{color:[`#ffd97a`,`#c9b0ff`,`#8fe8a0`][Math.random()*3|0],n:16,speed:300,grav:260,life:1.2}),400);setTimeout(()=>clearInterval(e),4200)}else{let e=n.length?`<div class="bequest" id="bequest">
        <div class="bequest-title">Carve one thing into the stone — the next climb may recover it in <b>${Ou[r].name}</b>.</div>
        <div class="bequest-opts">${n.map((e,t)=>{let n=uy(e);return`<button class="bequest-opt" data-a="bequest" data-i="${t}"><span class="bq-icon">${n.icon}</span><span class="bq-name">${n.name}</span><span class="bq-note">${n.note}</span></button>`}).join(``)}</div>
      </div>`:``,t=Array.from({length:14},()=>`<span class="ember" style="left:${(8+Math.random()*84).toFixed(1)}%;--ex:${((Math.random()-.5)*90).toFixed(0)}px;animation-delay:${(Math.random()*4).toFixed(2)}s;animation-duration:${(3+Math.random()*3).toFixed(2)}s"></span>`).join(``);l_().innerHTML=`<div class="end-screen grave">
      <div class="monument">
        <div class="mon-flame"></div>
        <div class="end-title lose">FALLEN</div>
        <div class="ov-sub" style="font-size:16px">Here ended a climb, on floor ${c}.<br>The Spire keeps what it takes — but the Vigil remembers.</div>
        ${l}${e}${u}
      </div>
      <div class="embers">${t}</div>
    </div>`}l_().onclick=e=>{let t=e.target.closest(`[data-a]`);if(!t)return;let o=t.dataset.a;if(o===`bequest`){X.relic();let e=n[+t.dataset.i];Eg(r,i,e);let a=uy(e);Q(`#bequest`).innerHTML=`<div class="bequest-done">✦ The stone keeps your <b>${a.name}</b>.<br>It will wait for you in ${Ou[r].name}.</div>`;return}X.click(),o===`deck`&&P_(`Final Deck`,a.player.deck,{}),o===`title`&&(Z.run=null,Z.lamp=null,z_(`title`))},fy(t)}var my=!1;function hy(){if(my)return;my=!0;let e=Q(`#overlay`);e.addEventListener(`pointerdown`,t=>{t.target===e&&e._closable&&N_()}),document.addEventListener(`keydown`,t=>{t.key===`Escape`&&e.classList.contains(`open`)&&e._closable&&N_()})}function gy(e,t){let n=e.dataset.cat||``,r=e.dataset.id||``,i=e.dataset.url||``,a=e.querySelector(`.g-art-stage`),o=`${r} / ${n}`,s=a?.querySelector(`svg`),c=s?`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s.outerHTML)}`:``,l=i?`<img class="gallery-lightbox-img" src="${u_(i)}" alt="${u_(r)}">`:c?`<img class="gallery-lightbox-img" src="${u_(c)}" alt="${u_(r)}">`:a?a.innerHTML:``;M_(`<div class="gallery-lightbox" role="dialog" aria-modal="true" aria-label="${u_(o)}">
    <button class="gallery-lightbox-close" type="button" data-a="close" aria-label="Close">&times;</button>
    <div class="gallery-lightbox-meta"><b>${u_(r)}</b><span>${u_(n)} - ${u_(Wh(t))}</span></div>
    <div class="gallery-lightbox-art">${l}</div>
  </div>`,e=>{Q(`[data-a="close"]`,e).onclick=()=>N_()},!0)}function _y(){hy();let e=new URLSearchParams(location.search),t=e.get(`set`)||e.get(`assetSet`)||`live`,n=Uh().includes(t)?t:`live`,r=Uh().map(e=>{let t=new URLSearchParams(location.search);return t.set(`gallery`,`1`),t.set(`set`,e),`<a class="${e===n?`active`:``}" href="?${t.toString()}">${Wh(e)}</a>`}).join(``),i={omens:Object.keys(Bu).map(e=>[e,()=>J(`omen-${e}`,64)]),boons:Object.keys(Ku).map(e=>[e,()=>J(`boon-${e}`,64)]),arts:Object.keys(Hu).map(e=>[e,()=>J(`art-${e}`,64)]),heroes:Wu.map((e,t)=>[e.id,()=>ng(t)]),enemies:Object.entries(Fu).map(([e,t])=>[e,()=>eg(t.art)]),cards:Object.entries(ku).map(([e,t])=>[e,()=>ag(e,t.type)]),potions:Object.entries(Pu).map(([e,t])=>[e,()=>og(t.tone)]),props:[[`campfire`,cg],[`chest`,()=>sg(!1)],[`chest-open`,()=>sg(!0)],[`merchant`,lg]],events:Object.entries(Lu).map(([e,t])=>[e,()=>ug(t.glyph,t.hue)]),title:[[`title`,()=>`<div class="title-banner-ph">title</div>`]],"title-background":[[`background`,()=>`<div class="title-banner-ph">background</div>`]],stage:[`act1`,`act2`,`act3`].flatMap(e=>[`backdrop`,`mid`,`ledge`].map(t=>[`${e}-${t}`,()=>`<div class="title-banner-ph">stage</div>`])),relics:Object.entries(Mu).map(([e,t])=>[e,()=>`<div class="title-banner-ph" style="color:${t.tone}">${t.glyph}</div>`])};l_().className=`gallery-mode`,l_().innerHTML=`<div class="g-toolbar">
    <div><b>Asset set:</b> ${Wh(n)}</div>
    <nav>${r}</nav>
  </div>`+Object.entries(i).map(([e,t])=>`<h2 class="g-head">${e} — ${t.filter(([t])=>Gh(e,t,n)).length}/${t.length} generated</h2>
      <div class="gallery">${t.map(([t,r])=>{let i=Gh(e,t,n);return`<div class="g-cell ${i?`g-png`:`g-svg`}"><button class="g-art g-open" type="button" data-cat="${u_(e)}" data-id="${u_(t)}" data-url="${i?u_(i):``}" aria-label="Enlarge ${u_(t)}"><span class="g-art-stage">${i?`<img class="raster-art" src="${u_(i)}" alt="">`:r()}</span></button>
          <div class="g-label">${u_(t)}<span class="g-badge">${i?`PNG`:`SVG`}</span></div></div>`}).join(``)}</div>`).join(``),l_().onclick=e=>{let t=e.target.closest(`.g-open`);t&&gy(t,n)}}function vy(){let e=e=>{let t=document.querySelector(e);return t?C(t):null};window.__probe={stage:()=>x(),geometry(){let t=e(`.battlefield`);return!t||!Z.cb||!Z.ce?null:{stage:x(),viewport:{w:_(),h:v()},groundY:t.bottom,heroArtBottom:e(`.hero-wrap`)?.bottom??null,enemyArtBottoms:Z.cb.enemies.map((e,t)=>e.hp>0&&Z.ce.enemies[t]?C(Z.ce.enemies[t].art).bottom:null),slLedgeTop:e(`.sl-ledge`)?.top??null,seamY:e(`.stage-ledge`)?.top??null}},invariants(){let e=[],t=(t,n,r=``)=>e.push({name:t,pass:n,detail:n?``:String(r)}),n=Z.cb,r=Z.ce;return n&&r&&Z.screen===`combat`&&(n.enemies.forEach((e,n)=>{let i=r.enemies[n];if(i)if(e.hp<=0){let e=i.root.classList;t(`enemy${n}: dead body leaves the field`,e.contains(`gone`)||e.contains(`dying`)||getComputedStyle(i.root).visibility===`hidden`,`classes="${i.root.className}"`),t(`enemy${n}: dead body releases its mesh plane`,!i.root.querySelector(`.mesh-live`),`a WebGL warp plane still renders this corpse`)}else t(`enemy${n}: HP label matches engine`,i.hp.textContent===`${Math.max(0,e.hp)}/${e.maxHp}`,`dom="${i.hp.textContent}" engine=${e.hp}/${e.maxHp}`)}),t(`player: HP label matches engine`,r.pHp.textContent===`${Math.max(0,n.player.hp)}/${n.player.maxHp}`,`dom="${r.pHp.textContent}" engine=${n.player.hp}/${n.player.maxHp}`),t(`hand: DOM count matches engine`,s_(`.card`,r.hand).length===n.hand.length,`dom=${s_(`.card`,r.hand).length} engine=${n.hand.length}`),t(`energy: orb matches engine`,Q(`.num`,r.energy).textContent===String(n.player.energy),`dom="${Q(`.num`,r.energy).textContent}" engine=${n.player.energy}`),t(`embers: lantern count matches engine`,Q(`.lb-count`,r.lantern).textContent===String(n.embers),`dom="${Q(`.lb-count`,r.lantern).textContent}" engine=${n.embers}`)),e},state(){let e=Z.cb;return{screen:Z.screen,busy:Z.busy,over:e?.over??null,result:e?.result??null,turn:e?.turn??null,player:e?{hp:e.player.hp,maxHp:e.player.maxHp,block:e.player.block,energy:e.player.energy}:null,embers:e?.embers??null,enemies:e?e.enemies.map(e=>({key:e.key,hp:e.hp,maxHp:e.maxHp,block:e.block})):null,hand:e?e.hand.map(e=>({uid:e.uid,id:e.id})):null}},settle:()=>new Promise(e=>{let t=()=>!Z.busy&&(!Z.cb||Z.cb.queue.length===0),n=()=>t()?e(!0):setTimeout(n,50);n()}),async play(e,t=null){return Z.busy||!Z.cb||Z.cb.over?!1:(await Sv(e,t),!Z.cb||Z.cb.over||!Z.cb.hand.some(t=>t.uid===e))},async endTurn(){await Cv()},async useArt(){return Z.busy||!Z.cb||Z.cb.over||!eh(Z.run,Z.cb)?!1:(th(Z.run,Z.cb),await Xv(),$v(),!0)},async usePotion(e,t=null){return Z.busy||!vh(Z.run,Z.cb,e,t)?!1:(Z.cb&&(await Xv(),$v()),T_(),!0)},forceHand(e){return Z.cb.hand=e.map(e=>Cm(Z.run,e)),sv(),Z.cb.hand.map(e=>e.uid)},setEnergy(e){Z.cb.player.energy=e,ov()},setEmbers(e){Z.cb.embers=e,ov()},setEnemyHp(e,t){Z.cb.enemies[e].hp=t,ov()},freeze(){document.documentElement.classList.add(`freeze`),Fv=!0,Ef(),rf()}}}function yy(){if(new URLSearchParams(location.search).has(`gallery`))return _y();x_(),document.addEventListener(`pointerdown`,()=>Ig(),{once:!0}),document.addEventListener(`contextmenu`,e=>{Z.targeting&&(e.preventDefault(),bv())}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&(Z.targeting?bv():Q(`#overlay`).classList.contains(`open`)&&Q(`#overlay`)._closable&&N_()),(e.key===`e`||e.key===`E`)&&Z.screen===`combat`&&!Z.busy&&Cv(),(e.key===`a`||e.key===`A`)&&Z.screen===`combat`&&!Z.busy&&Z.ce?.lantern?.click()}),Q(`#overlay`).addEventListener(`pointerdown`,e=>{e.target===Q(`#overlay`)&&Q(`#overlay`)._closable&&N_()}),window.spirebound={S:Z,E:pm,startCombatUI:X_,show:z_,meshEnabled:sp,meshDebug:fm,refitCombat:tv},vy(),requestAnimationFrame(Iv),z_(`title`)}g(),Zd(),wf(),Qp(),yy();