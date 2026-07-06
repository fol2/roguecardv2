var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n=1e3,r=1001,i=1002,a=1003,o=1004,s=1005,c=1006,l=1007,u=1008,d=1009,f=1010,p=1011,m=1012,h=1013,g=1014,_=1015,v=1016,y=1017,b=1018,x=1020,S=35902,C=35899,w=1021,T=1022,E=1023,D=1026,ee=1027,O=1028,k=1029,te=1030,ne=1031,A=1033,re=33776,ie=33777,j=33778,ae=33779,oe=35840,se=35841,ce=35842,le=35843,ue=36196,de=37492,M=37496,fe=37488,pe=37489,me=37490,he=37491,ge=37808,_e=37809,ve=37810,ye=37811,be=37812,xe=37813,Se=37814,Ce=37815,we=37816,Te=37817,Ee=37818,De=37819,Oe=37820,ke=37821,Ae=36492,je=36494,Me=36495,Ne=36283,Pe=36284,Fe=36285,N=36286,Ie=2300,Le=2301,Re=2302,P=2303,ze=2400,F=2401,I=2402,Be=3200,Ve=`srgb`,He=`srgb-linear`,Ue=`linear`,We=`srgb`,Ge=7680,Ke=35044,qe=2e3;function Je(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Ye(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Xe(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Ze(){let e=Xe(`canvas`);return e.style.display=`block`,e}var Qe={};function $e(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function et(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function L(...e){e=et(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function R(...e){e=et(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function tt(...e){let t=e.join(` `);t in Qe||(Qe[t]=!0,L(...e))}function nt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var rt={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},it=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},at=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),ot=1234567,st=Math.PI/180,ct=180/Math.PI;function lt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(at[e&255]+at[e>>8&255]+at[e>>16&255]+at[e>>24&255]+`-`+at[t&255]+at[t>>8&255]+`-`+at[t>>16&15|64]+at[t>>24&255]+`-`+at[n&63|128]+at[n>>8&255]+`-`+at[n>>16&255]+at[n>>24&255]+at[r&255]+at[r>>8&255]+at[r>>16&255]+at[r>>24&255]).toLowerCase()}function z(e,t,n){return Math.max(t,Math.min(n,e))}function ut(e,t){return(e%t+t)%t}function dt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ft(e,t,n){return e===t?0:(n-e)/(t-e)}function pt(e,t,n){return(1-n)*e+n*t}function mt(e,t,n,r){return pt(e,t,1-Math.exp(-n*r))}function ht(e,t=1){return t-Math.abs(ut(e,t*2)-t)}function gt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function _t(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function vt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function yt(e,t){return e+Math.random()*(t-e)}function bt(e){return e*(.5-Math.random())}function xt(e){e!==void 0&&(ot=e);let t=ot+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function St(e){return e*st}function Ct(e){return e*ct}function wt(e){return(e&e-1)==0&&e!==0}function Tt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Et(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Dt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:L(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Ot(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function kt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var At={DEG2RAD:st,RAD2DEG:ct,generateUUID:lt,clamp:z,euclideanModulo:ut,mapLinear:dt,inverseLerp:ft,lerp:pt,damp:mt,pingpong:ht,smoothstep:gt,smootherstep:_t,randInt:vt,randFloat:yt,randFloatSpread:bt,seededRandom:xt,degToRad:St,radToDeg:Ct,isPowerOfTwo:wt,ceilPowerOfTwo:Tt,floorPowerOfTwo:Et,setQuaternionFromProperEuler:Dt,normalize:kt,denormalize:Ot},B=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(z(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},jt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:L(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(z(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Nt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Nt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this.z=z(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this.z=z(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Mt.copy(this).projectOnVector(e),this.sub(Mt)}reflect(e){return this.sub(Mt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(z(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Mt=new V,Nt=new jt,H=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return tt(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Pt.makeScale(e,t)),this}rotate(e){return tt(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Pt.makeRotation(-e)),this}translate(e,t){return tt(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Pt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Pt=new H,Ft=new H().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),It=new H().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Lt(){let e={enabled:!0,workingColorSpace:He,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Rt(e.r),e.g=Rt(e.g),e.b=Rt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=zt(e.r),e.g=zt(e.g),e.b=zt(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Ue:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return tt(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return tt(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[He]:{primaries:t,whitePoint:r,transfer:Ue,toXYZ:Ft,fromXYZ:It,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ve},outputColorSpaceConfig:{drawingBufferColorSpace:Ve}},[Ve]:{primaries:t,whitePoint:r,transfer:We,toXYZ:Ft,fromXYZ:It,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ve}}}),e}var U=Lt();function Rt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function zt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Bt,Vt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Bt===void 0&&(Bt=Xe(`canvas`)),Bt.width=e.width,Bt.height=e.height;let t=Bt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Bt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Xe(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Rt(i[e]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Rt(t[e]/255)*255):t[e]=Rt(t[e]);return{data:t,width:e.width,height:e.height}}else return L(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Ht=0,Ut=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ht++}),this.uuid=lt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Wt(r[t].image)):e.push(Wt(r[t]))}else e=Wt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Wt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Vt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(L(`Texture: Unable to serialize Texture.`),{})}var Gt=0,Kt=new V,qt=class e extends it{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,i=r,a=r,o=c,s=u,l=E,f=d,p=e.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gt++}),this.uuid=lt(),this.name=``,this.source=new Ut(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=o,this.minFilter=s,this.anisotropy=p,this.format=l,this.internalFormat=null,this.type=f,this.offset=new B(0,0),this.repeat=new B(1,1),this.center=new B(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new H,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Kt).x}get height(){return this.source.getSize(Kt).y}get depth(){return this.source.getSize(Kt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){L(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){L(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case n:e.x-=Math.floor(e.x);break;case r:e.x=e.x<0?0:1;break;case i:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case n:e.y-=Math.floor(e.y);break;case r:e.y=e.y<0?0:1;break;case i:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};qt.DEFAULT_IMAGE=null,qt.DEFAULT_MAPPING=300,qt.DEFAULT_ANISOTROPY=1;var Jt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this.z=z(this.z,e.z,t.z),this.w=z(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this.z=z(this.z,e,t),this.w=z(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Yt=class extends it{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:c,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Jt(0,0,e,t),this.scissorTest=!1,this.viewport=new Jt(0,0,e,t),this.textures=[];let r=new qt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:c,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Ut(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Xt=class extends Yt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Zt=class extends qt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=a,this.minFilter=a,this.wrapR=r,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Qt=class extends qt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=a,this.minFilter=a,this.wrapR=r,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},$t=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/en.setFromMatrixColumn(e,0).length(),i=1/en.setFromMatrixColumn(e,1).length(),a=1/en.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(nn,e,rn)}lookAt(e,t,n){let r=this.elements;return sn.subVectors(e,t),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),an.crossVectors(n,sn),an.lengthSq()===0&&(Math.abs(n.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),an.crossVectors(n,sn)),an.normalize(),on.crossVectors(sn,an),r[0]=an.x,r[4]=on.x,r[8]=sn.x,r[1]=an.y,r[5]=on.y,r[9]=sn.y,r[2]=an.z,r[6]=on.z,r[10]=sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],ee=r[13],O=r[2],k=r[6],te=r[10],ne=r[14],A=r[3],re=r[7],ie=r[11],j=r[15];return i[0]=a*x+o*T+s*O+c*A,i[4]=a*S+o*E+s*k+c*re,i[8]=a*C+o*D+s*te+c*ie,i[12]=a*w+o*ee+s*ne+c*j,i[1]=l*x+u*T+d*O+f*A,i[5]=l*S+u*E+d*k+f*re,i[9]=l*C+u*D+d*te+f*ie,i[13]=l*w+u*ee+d*ne+f*j,i[2]=p*x+m*T+h*O+g*A,i[6]=p*S+m*E+h*k+g*re,i[10]=p*C+m*D+h*te+g*ie,i[14]=p*w+m*ee+h*ne+g*j,i[3]=_*x+v*T+y*O+b*A,i[7]=_*S+v*E+y*k+b*re,i[11]=_*C+v*D+y*te+b*ie,i[15]=_*w+v*ee+y*ne+b*j,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,ee=d*g-f*h,O=_*ee-v*D+y*E+b*T-x*w+S*C;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/O;return e[0]=(o*ee-s*D+c*E)*k,e[1]=(r*D-n*ee-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*ee-c*w)*k,e[5]=(t*ee-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=en.set(r[0],r[1],r[2]).length(),o=en.set(r[4],r[5],r[6]).length(),s=en.set(r[8],r[9],r[10]).length();i<0&&(a=-a),tn.copy(this);let c=1/a,l=1/o,u=1/s;return tn.elements[0]*=c,tn.elements[1]*=c,tn.elements[2]*=c,tn.elements[4]*=l,tn.elements[5]*=l,tn.elements[6]*=l,tn.elements[8]*=u,tn.elements[9]*=u,tn.elements[10]*=u,t.setFromRotationMatrix(tn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=qe,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=qe,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},en=new V,tn=new $t,nn=new V(0,0,0),rn=new V(1,1,1),an=new V,on=new V,sn=new V,cn=new $t,ln=new jt,un=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(z(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-z(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(z(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-z(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(z(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-z(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:L(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return cn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(cn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ln.setFromEuler(this),this.setFromQuaternion(ln,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};un.DEFAULT_ORDER=`XYZ`;var dn=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!=0}},fn=0,pn=new V,mn=new jt,hn=new $t,gn=new V,_n=new V,vn=new V,yn=new jt,bn=new V(1,0,0),xn=new V(0,1,0),Sn=new V(0,0,1),Cn={type:`added`},wn={type:`removed`},Tn={type:`childadded`,child:null},En={type:`childremoved`,child:null},Dn=class e extends it{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fn++}),this.uuid=lt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new V,n=new un,r=new jt,i=new V(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new $t},normalMatrix:{value:new H}}),this.matrix=new $t,this.matrixWorld=new $t,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return mn.setFromAxisAngle(e,t),this.quaternion.multiply(mn),this}rotateOnWorldAxis(e,t){return mn.setFromAxisAngle(e,t),this.quaternion.premultiply(mn),this}rotateX(e){return this.rotateOnAxis(bn,e)}rotateY(e){return this.rotateOnAxis(xn,e)}rotateZ(e){return this.rotateOnAxis(Sn,e)}translateOnAxis(e,t){return pn.copy(e).applyQuaternion(this.quaternion),this.position.add(pn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(bn,e)}translateY(e){return this.translateOnAxis(xn,e)}translateZ(e){return this.translateOnAxis(Sn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(hn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?gn.copy(e):gn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),_n.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hn.lookAt(_n,gn,this.up):hn.lookAt(gn,_n,this.up),this.quaternion.setFromRotationMatrix(hn),r&&(hn.extractRotation(r.matrixWorld),mn.setFromRotationMatrix(hn),this.quaternion.premultiply(mn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(R(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Cn),Tn.child=e,this.dispatchEvent(Tn),Tn.child=null):R(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(wn),En.child=e,this.dispatchEvent(En),En.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),hn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),hn.multiply(e.parent.matrixWorld)),e.applyMatrix4(hn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Cn),Tn.child=e,this.dispatchEvent(Tn),Tn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_n,e,vn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_n,yn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material);if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};Dn.DEFAULT_UP=new V(0,1,0),Dn.DEFAULT_MATRIX_AUTO_UPDATE=!0,Dn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var On=class extends Dn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},kn={type:`move`},An=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new On,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new On,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new On,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(kn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new On;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},jn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mn={h:0,s:0,l:0},Nn={h:0,s:0,l:0};function Pn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var W=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ve){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,U.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=U.workingColorSpace){return this.r=e,this.g=t,this.b=n,U.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=U.workingColorSpace){if(e=ut(e,1),t=z(t,0,1),n=z(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Pn(i,r,e+1/3),this.g=Pn(i,r,e),this.b=Pn(i,r,e-1/3)}return U.colorSpaceToWorking(this,r),this}setStyle(e,t=Ve){function n(t){t!==void 0&&parseFloat(t)<1&&L(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:L(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);L(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ve){let n=jn[e.toLowerCase()];return n===void 0?L(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Rt(e.r),this.g=Rt(e.g),this.b=Rt(e.b),this}copyLinearToSRGB(e){return this.r=zt(e.r),this.g=zt(e.g),this.b=zt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ve){return U.workingToColorSpace(Fn.copy(this),e),Math.round(z(Fn.r*255,0,255))*65536+Math.round(z(Fn.g*255,0,255))*256+Math.round(z(Fn.b*255,0,255))}getHexString(e=Ve){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=U.workingColorSpace){U.workingToColorSpace(Fn.copy(this),t);let n=Fn.r,r=Fn.g,i=Fn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4;break}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=U.workingColorSpace){return U.workingToColorSpace(Fn.copy(this),t),e.r=Fn.r,e.g=Fn.g,e.b=Fn.b,e}getStyle(e=Ve){U.workingToColorSpace(Fn.copy(this),e);let t=Fn.r,n=Fn.g,r=Fn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Mn),this.setHSL(Mn.h+e,Mn.s+t,Mn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Mn),e.getHSL(Nn);let n=pt(Mn.h,Nn.h,t),r=pt(Mn.s,Nn.s,t),i=pt(Mn.l,Nn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Fn=new W;W.NAMES=jn;var In=class e{constructor(e,t=25e-5){this.isFogExp2=!0,this.name=``,this.color=new W(e),this.density=t}clone(){return new e(this.color,this.density)}toJSON(){return{type:`FogExp2`,name:this.name,color:this.color.getHex(),density:this.density}}},Ln=class extends Dn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new un,this.environmentIntensity=1,this.environmentRotation=new un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Rn=new V,zn=new V,Bn=new V,Vn=new V,Hn=new V,Un=new V,Wn=new V,Gn=new V,Kn=new V,qn=new V,Jn=new Jt,Yn=new Jt,Xn=new Jt,Zn=class e{constructor(e=new V,t=new V,n=new V){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Rn.subVectors(e,t),r.cross(Rn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Rn.subVectors(r,t),zn.subVectors(n,t),Bn.subVectors(e,t);let a=Rn.dot(Rn),o=Rn.dot(zn),s=Rn.dot(Bn),c=zn.dot(zn),l=zn.dot(Bn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Vn)===null?!1:Vn.x>=0&&Vn.y>=0&&Vn.x+Vn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Vn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Vn.x),s.addScaledVector(a,Vn.y),s.addScaledVector(o,Vn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Jn.setScalar(0),Yn.setScalar(0),Xn.setScalar(0),Jn.fromBufferAttribute(e,t),Yn.fromBufferAttribute(e,n),Xn.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Jn,i.x),a.addScaledVector(Yn,i.y),a.addScaledVector(Xn,i.z),a}static isFrontFacing(e,t,n,r){return Rn.subVectors(n,t),zn.subVectors(e,t),Rn.cross(zn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Rn.subVectors(this.c,this.b),zn.subVectors(this.a,this.b),Rn.cross(zn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Hn.subVectors(r,n),Un.subVectors(i,n),Gn.subVectors(e,n);let s=Hn.dot(Gn),c=Un.dot(Gn);if(s<=0&&c<=0)return t.copy(n);Kn.subVectors(e,r);let l=Hn.dot(Kn),u=Un.dot(Kn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Hn,a);qn.subVectors(e,i);let f=Hn.dot(qn),p=Un.dot(qn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Un,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Wn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Wn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Hn,a).addScaledVector(Un,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Qn=class{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(er.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(er.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=er.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,er):er.fromBufferAttribute(r,t),er.applyMatrix4(e.matrixWorld),this.expandByPoint(er);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),tr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),tr.copy(e.boundingBox)),tr.applyMatrix4(e.matrixWorld),this.union(tr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,er),er.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(cr),lr.subVectors(this.max,cr),nr.subVectors(e.a,cr),rr.subVectors(e.b,cr),ir.subVectors(e.c,cr),ar.subVectors(rr,nr),or.subVectors(ir,rr),sr.subVectors(nr,ir);let t=[0,-ar.z,ar.y,0,-or.z,or.y,0,-sr.z,sr.y,ar.z,0,-ar.x,or.z,0,-or.x,sr.z,0,-sr.x,-ar.y,ar.x,0,-or.y,or.x,0,-sr.y,sr.x,0];return!fr(t,nr,rr,ir,lr)||(t=[1,0,0,0,1,0,0,0,1],!fr(t,nr,rr,ir,lr))?!1:(ur.crossVectors(ar,or),t=[ur.x,ur.y,ur.z],fr(t,nr,rr,ir,lr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,er).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(er).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},$n=[new V,new V,new V,new V,new V,new V,new V,new V],er=new V,tr=new Qn,nr=new V,rr=new V,ir=new V,ar=new V,or=new V,sr=new V,cr=new V,lr=new V,ur=new V,dr=new V;function fr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){dr.fromArray(e,a);let o=i.x*Math.abs(dr.x)+i.y*Math.abs(dr.y)+i.z*Math.abs(dr.z),s=t.dot(dr),c=n.dot(dr),l=r.dot(dr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var pr=new V,mr=new B,hr=0,gr=class extends it{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:hr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Ke,this.updateRanges=[],this.gpuType=_,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)mr.fromBufferAttribute(this,t),mr.applyMatrix3(e),this.setXY(t,mr.x,mr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)pr.fromBufferAttribute(this,t),pr.applyMatrix3(e),this.setXYZ(t,pr.x,pr.y,pr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)pr.fromBufferAttribute(this,t),pr.applyMatrix4(e),this.setXYZ(t,pr.x,pr.y,pr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)pr.fromBufferAttribute(this,t),pr.applyNormalMatrix(e),this.setXYZ(t,pr.x,pr.y,pr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)pr.fromBufferAttribute(this,t),pr.transformDirection(e),this.setXYZ(t,pr.x,pr.y,pr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ot(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=kt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ot(t,this.array)),t}setX(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ot(t,this.array)),t}setY(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ot(t,this.array)),t}setZ(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ot(t,this.array)),t}setW(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array),r=kt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array),r=kt(r,this.array),i=kt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:`dispose`})}},_r=class extends gr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},vr=class extends gr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},yr=class extends gr{constructor(e,t,n){super(new Float32Array(e),t,n)}},br=new Qn,xr=new V,Sr=new V,Cr=class{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?br.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xr.subVectors(e,this.center);let t=xr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(xr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Sr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xr.copy(e.center).add(Sr)),this.expandByPoint(xr.copy(e.center).sub(Sr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},wr=0,Tr=new $t,Er=new Dn,Dr=new V,Or=new Qn,kr=new Qn,Ar=new V,jr=class e extends it{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wr++}),this.uuid=lt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Je(e)?vr:_r)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new H().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Tr.makeRotationFromQuaternion(e),this.applyMatrix4(Tr),this}rotateX(e){return Tr.makeRotationX(e),this.applyMatrix4(Tr),this}rotateY(e){return Tr.makeRotationY(e),this.applyMatrix4(Tr),this}rotateZ(e){return Tr.makeRotationZ(e),this.applyMatrix4(Tr),this}translate(e,t,n){return Tr.makeTranslation(e,t,n),this.applyMatrix4(Tr),this}scale(e,t,n){return Tr.makeScale(e,t,n),this.applyMatrix4(Tr),this}lookAt(e){return Er.lookAt(e),Er.updateMatrix(),this.applyMatrix4(Er.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Dr).negate(),this.translate(Dr.x,Dr.y,Dr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new yr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&L(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){R(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Or.setFromBufferAttribute(n),this.morphTargetsRelative?(Ar.addVectors(this.boundingBox.min,Or.min),this.boundingBox.expandByPoint(Ar),Ar.addVectors(this.boundingBox.max,Or.max),this.boundingBox.expandByPoint(Ar)):(this.boundingBox.expandByPoint(Or.min),this.boundingBox.expandByPoint(Or.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&R(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Cr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){R(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new V,1/0);return}if(e){let n=this.boundingSphere.center;if(Or.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];kr.setFromBufferAttribute(n),this.morphTargetsRelative?(Ar.addVectors(Or.min,kr.min),Or.expandByPoint(Ar),Ar.addVectors(Or.max,kr.max),Or.expandByPoint(Ar)):(Or.expandByPoint(kr.min),Or.expandByPoint(kr.max))}Or.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Ar.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Ar));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Ar.fromBufferAttribute(a,t),o&&(Dr.fromBufferAttribute(e,t),Ar.add(Dr)),r=Math.max(r,n.distanceToSquared(Ar))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&R(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){R(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new gr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new V,s[e]=new V;let c=new V,l=new V,u=new V,d=new B,f=new B,p=new B,m=new V,h=new V;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new V,y=new V,b=new V,x=new V;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new gr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new V,i=new V,a=new V,o=new V,s=new V,c=new V,l=new V,u=new V;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ar.fromBufferAttribute(e,t),Ar.normalize(),e.setXYZ(t,Ar.x,Ar.y,Ar.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new gr(a,r,i)}if(this.index===null)return L(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Mr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=Ke,this.updateRanges=[],this.version=0,this.uuid=lt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=lt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=lt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Nr=new V,Pr=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Nr.fromBufferAttribute(this,t),Nr.applyMatrix4(e),this.setXYZ(t,Nr.x,Nr.y,Nr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Nr.fromBufferAttribute(this,t),Nr.applyNormalMatrix(e),this.setXYZ(t,Nr.x,Nr.y,Nr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Nr.fromBufferAttribute(this,t),Nr.transformDirection(e),this.setXYZ(t,Nr.x,Nr.y,Nr.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Ot(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=kt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ot(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ot(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ot(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ot(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array),r=kt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array),r=kt(r,this.array),i=kt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){$e(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new gr(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){$e(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Fr=0,Ir=class extends it{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fr++}),this.uuid=lt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new W(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ge,this.stencilZFail=Ge,this.stencilZPass=Ge,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){L(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){L(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new W().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors==`number`?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new B().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new B().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Lr=class extends Ir{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new W(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Rr,zr=new V,Br=new V,Vr=new V,Hr=new B,Ur=new B,Wr=new $t,Gr=new V,Kr=new V,qr=new V,Jr=new B,Yr=new B,Xr=new B,Zr=class extends Dn{constructor(e=new Lr){if(super(),this.isSprite=!0,this.type=`Sprite`,Rr===void 0){Rr=new jr;let e=new Mr(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);Rr.setIndex([0,1,2,0,2,3]),Rr.setAttribute(`position`,new Pr(e,3,0,!1)),Rr.setAttribute(`uv`,new Pr(e,2,3,!1))}this.geometry=Rr,this.material=e,this.center=new B(.5,.5),this.count=1}raycast(e,t){e.camera===null&&R(`Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),Br.setFromMatrixScale(this.matrixWorld),Wr.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Vr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Br.multiplyScalar(-Vr.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;Qr(Gr.set(-.5,-.5,0),Vr,a,Br,r,i),Qr(Kr.set(.5,-.5,0),Vr,a,Br,r,i),Qr(qr.set(.5,.5,0),Vr,a,Br,r,i),Jr.set(0,0),Yr.set(1,0),Xr.set(1,1);let o=e.ray.intersectTriangle(Gr,Kr,qr,!1,zr);if(o===null&&(Qr(Kr.set(-.5,.5,0),Vr,a,Br,r,i),Yr.set(0,1),o=e.ray.intersectTriangle(Gr,qr,Kr,!1,zr),o===null))return;let s=e.ray.origin.distanceTo(zr);s<e.near||s>e.far||t.push({distance:s,point:zr.clone(),uv:Zn.getInterpolation(zr,Gr,Kr,qr,Jr,Yr,Xr,new B),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Qr(e,t,n,r,i,a){Hr.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?Ur.copy(Hr):(Ur.x=a*Hr.x-i*Hr.y,Ur.y=i*Hr.x+a*Hr.y),e.copy(t),e.x+=Ur.x,e.y+=Ur.y,e.applyMatrix4(Wr)}var $r=new V,ei=new V,ti=new V,ni=new V,ri=new V,ii=new V,ai=new V,oi=class{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$r)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=$r.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($r.copy(this.origin).addScaledVector(this.direction,t),$r.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){ei.copy(e).add(t).multiplyScalar(.5),ti.copy(t).sub(e).normalize(),ni.copy(this.origin).sub(ei);let i=e.distanceTo(t)*.5,a=-this.direction.dot(ti),o=ni.dot(this.direction),s=-ni.dot(ti),c=ni.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0)if(u=a*s-o,d=a*o-s,p=i*l,u>=0)if(d>=-p)if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c);else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(ei).addScaledVector(ti,d),f}intersectSphere(e,t){$r.subVectors(e.center,this.origin);let n=$r.dot(this.direction),r=$r.dot($r)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,$r)!==null}intersectTriangle(e,t,n,r,i){ri.subVectors(t,e),ii.subVectors(n,e),ai.crossVectors(ri,ii);let a=this.direction.dot(ai),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ni.subVectors(this.origin,e);let s=o*this.direction.dot(ii.crossVectors(ni,ii));if(s<0)return null;let c=o*this.direction.dot(ri.cross(ni));if(c<0||s+c>a)return null;let l=-o*ni.dot(ai);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},si=class extends Ir{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new W(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new un,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ci=new $t,li=new oi,ui=new Cr,di=new V,fi=new V,pi=new V,mi=new V,hi=new V,gi=new V,_i=new V,vi=new V,yi=class extends Dn{constructor(e=new jr,t=new si){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){gi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(hi.fromBufferAttribute(s,e),a?gi.addScaledVector(hi,r):gi.addScaledVector(hi.sub(t),r))}t.add(gi)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ui.copy(n.boundingSphere),ui.applyMatrix4(i),li.copy(e.ray).recast(e.near),!(ui.containsPoint(li.origin)===!1&&(li.intersectSphere(ui,di)===null||li.origin.distanceToSquared(di)>(e.far-e.near)**2))&&(ci.copy(i).invert(),li.copy(e.ray).applyMatrix4(ci),!(n.boundingBox!==null&&li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,li)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null)if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=xi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=xi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}else if(s!==void 0)if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=xi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=xi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}};function bi(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;vi.copy(s),vi.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(vi);return l<n.near||l>n.far?null:{distance:l,point:vi.clone(),object:e}}function xi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,fi),e.getVertexPosition(c,pi),e.getVertexPosition(l,mi);let u=bi(e,t,n,r,fi,pi,mi,_i);if(u){let e=new V;Zn.getBarycoord(_i,fi,pi,mi,e),i&&(u.uv=Zn.getInterpolatedAttribute(i,s,c,l,e,new B)),a&&(u.uv1=Zn.getInterpolatedAttribute(a,s,c,l,e,new B)),o&&(u.normal=Zn.getInterpolatedAttribute(o,s,c,l,e,new V),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new V,materialIndex:0};Zn.getNormal(fi,pi,mi,t.normal),u.face=t,u.barycoord=e}return u}var Si=class extends qt{constructor(e=null,t=1,n=1,r,i,o,s,c,l=a,u=a,d,f){super(null,o,s,c,l,u,r,i,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ci=new V,wi=new V,Ti=new H,Ei=class{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Ci.subVectors(n,t).cross(wi.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Ci),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ti.getNormalMatrix(e),r=this.coplanarPoint(Ci).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Di=new Cr,Oi=new B(.5,.5),ki=new V,Ai=class{constructor(e=new Ei,t=new Ei,n=new Ei,r=new Ei,i=new Ei,a=new Ei){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=qe,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Di.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Di.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Di)}intersectsSprite(e){return Di.center.set(0,0,0),Di.radius=.7071067811865476+Oi.distanceTo(e.center),Di.applyMatrix4(e.matrixWorld),this.intersectsSphere(Di)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(ki.x=r.normal.x>0?e.max.x:e.min.x,ki.y=r.normal.y>0?e.max.y:e.min.y,ki.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ki)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},ji=class extends Ir{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new W(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Mi=new $t,Ni=new oi,Pi=new Cr,Fi=new V,Ii=class extends Dn{constructor(e=new jr,t=new ji){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Pi.copy(n.boundingSphere),Pi.applyMatrix4(r),Pi.radius+=i,e.ray.intersectsSphere(Pi)===!1)return;Mi.copy(r).invert(),Ni.copy(e.ray).applyMatrix4(Mi);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Fi.fromBufferAttribute(l,n),Li(Fi,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Fi.fromBufferAttribute(l,a),Li(Fi,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Li(e,t,n,r,i,a,o){let s=Ni.distanceSqToPoint(e);if(s<n){let n=new V;Ni.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Ri=class extends qt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},zi=class extends qt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Bi=class extends qt{constructor(e,t,n=g,r,i,o,s=a,c=a,l,u=D,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},r,i,o,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ut(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Vi=class extends Bi{constructor(e,t=g,n=301,r,i,o=a,s=a,c,l=D){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,r,i,o,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Hi=class extends qt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Ui=class e extends jr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new yr(c,3)),this.setAttribute(`normal`,new yr(l,3)),this.setAttribute(`uv`,new yr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new V;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Wi=class e extends jr{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new V,l=new B;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new yr(a,3)),this.setAttribute(`normal`,new yr(o,3)),this.setAttribute(`uv`,new yr(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Gi=class e extends jr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new yr(u,3)),this.setAttribute(`normal`,new yr(d,3)),this.setAttribute(`uv`,new yr(f,2));function _(){let a=new V,_=new V,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new B,m=new V,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ki=class e extends Gi{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},qi=class e extends jr{constructor(e=[new B(0,-.5),new B(.5,0),new B(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=z(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new V,d=new B,f=new V,p=new V,m=new V,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new yr(a,3)),this.setAttribute(`uv`,new yr(o,2)),this.setAttribute(`normal`,new yr(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},Ji=class e extends jr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new yr(p,3)),this.setAttribute(`normal`,new yr(m,3)),this.setAttribute(`uv`,new yr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Yi=class e extends jr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new V,d=new V,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new yr(p,3)),this.setAttribute(`normal`,new yr(m,3)),this.setAttribute(`uv`,new yr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function Xi(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Qi(i))i.isRenderTargetTexture?(L(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i))if(Qi(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice();else t[n][r]=i}}return t}function Zi(e){let t={};for(let n=0;n<e.length;n++){let r=Xi(e[n]);for(let e in r)t[e]=r[e]}return t}function Qi(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function $i(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function ea(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:U.workingColorSpace}var ta={clone:Xi,merge:Zi},na=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ra=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ia=class extends Ir{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=na,this.fragmentShader=ra,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Xi(e.uniforms),this.uniformsGroups=$i(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new W().setHex(r.value);break;case`v2`:this.uniforms[n].value=new B().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new V().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Jt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new H().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new $t().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},aa=class extends ia{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},oa=class extends Ir{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Be,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},sa=class extends Ir{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ca(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}var la=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},ua=class extends la{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ze,endingEnd:ze}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case F:i=e,o=2*t-n;break;case I:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case F:a=e,s=2*n-t;break;case I:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},da=class extends la{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},fa=class extends la{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},pa=class extends la{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=(n-t)/(r-t),S,C,w,T,E;for(let e=0;e<8;e++){S=x*x,C=S*x,w=1-x,T=w*w,E=T*w;let e=E*t+3*T*x*g+3*w*S*y+C*r-n;if(Math.abs(e)<1e-10)break;let i=3*T*(g-t)+6*w*x*(y-g)+3*S*(r-y);if(Math.abs(i)<1e-10)break;x-=e/i,x=Math.max(0,Math.min(1,x))}i[p]=E*o+3*T*x*_+3*w*S*b+C*m}return i}},ma=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=ca(t,this.TimeBufferType),this.values=ca(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ca(e.times,Array),values:ca(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new fa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new da(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ua(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new pa(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ie:t=this.InterpolantFactoryMethodDiscrete;break;case Le:t=this.InterpolantFactoryMethodLinear;break;case Re:t=this.InterpolantFactoryMethodSmooth;break;case P:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t);return L(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ie;case this.InterpolantFactoryMethodLinear:return Le;case this.InterpolantFactoryMethodSmooth:return Re;case this.InterpolantFactoryMethodBezier:return P}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(R(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(R(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){R(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){R(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Ye(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){R(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Re,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0]))if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};ma.prototype.ValueTypeName=``,ma.prototype.TimeBufferType=Float32Array,ma.prototype.ValueBufferType=Float32Array,ma.prototype.DefaultInterpolation=Le;var ha=class extends ma{constructor(e,t,n){super(e,t,n)}};ha.prototype.ValueTypeName=`bool`,ha.prototype.ValueBufferType=Array,ha.prototype.DefaultInterpolation=Ie,ha.prototype.InterpolantFactoryMethodLinear=void 0,ha.prototype.InterpolantFactoryMethodSmooth=void 0;var ga=class extends ma{constructor(e,t,n,r){super(e,t,n,r)}};ga.prototype.ValueTypeName=`color`;var _a=class extends ma{constructor(e,t,n,r){super(e,t,n,r)}};_a.prototype.ValueTypeName=`number`;var va=class extends la{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)jt.slerpFlat(i,0,a,c-o,a,c,s);return i}},ya=class extends ma{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new va(this.times,this.values,this.getValueSize(),e)}};ya.prototype.ValueTypeName=`quaternion`,ya.prototype.InterpolantFactoryMethodSmooth=void 0;var ba=class extends ma{constructor(e,t,n){super(e,t,n)}};ba.prototype.ValueTypeName=`string`,ba.prototype.ValueBufferType=Array,ba.prototype.DefaultInterpolation=Ie,ba.prototype.InterpolantFactoryMethodLinear=void 0,ba.prototype.InterpolantFactoryMethodSmooth=void 0;var xa=class extends ma{constructor(e,t,n,r){super(e,t,n,r)}};xa.prototype.ValueTypeName=`vector`;var Sa={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(Ca(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!Ca(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function Ca(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var wa=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},Ta=class{constructor(e){this.manager=e===void 0?wa:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Ta.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var Ea=new WeakMap,Da=class extends Ta{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Sa.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=Ea.get(a);e===void 0&&(e=[],Ea.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=Xe(`img`);function s(){l(),t&&t(this);let n=Ea.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}Ea.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),Sa.remove(`image:${e}`);let n=Ea.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}Ea.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Sa.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},Oa=class extends Ta{constructor(e){super(e)}load(e,t,n,r){let i=new qt,a=new Da(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},ka=new V,Aa=new jt,ja=new V,Ma=class extends Dn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new $t,this.projectionMatrix=new $t,this.projectionMatrixInverse=new $t,this.coordinateSystem=qe,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ka,Aa,ja),ja.x===1&&ja.y===1&&ja.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ka,Aa,ja.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ka,Aa,ja),ja.x===1&&ja.y===1&&ja.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ka,Aa,ja.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Na=new V,Pa=new B,Fa=new B,Ia=class extends Ma{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ct*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(st*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ct*2*Math.atan(Math.tan(st*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Na.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Na.x,Na.y).multiplyScalar(-e/Na.z),Na.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Na.x,Na.y).multiplyScalar(-e/Na.z)}getViewSize(e,t){return this.getViewBounds(e,Pa,Fa),t.subVectors(Fa,Pa)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(st*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},La=class extends Ma{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ra=-90,za=1,Ba=class extends Dn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Ia(Ra,za,e,t);r.layers=this.layers,this.add(r);let i=new Ia(Ra,za,e,t);i.layers=this.layers,this.add(i);let a=new Ia(Ra,za,e,t);a.layers=this.layers,this.add(a);let o=new Ia(Ra,za,e,t);o.layers=this.layers,this.add(o);let s=new Ia(Ra,za,e,t);s.layers=this.layers,this.add(s);let c=new Ia(Ra,za,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Va=class extends Ia{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Ha=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Ua.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Ua(){this._document.hidden===!1&&this.reset()}var Wa=`\\[\\]\\.:\\/`,Ga=RegExp(`[\\[\\]\\.:\\/]`,`g`),Ka=`[^\\[\\]\\.:\\/]`,qa=`[^`+Wa.replace(`\\.`,``)+`]`,Ja=`((?:WC+[\\/:])*)`.replace(`WC`,Ka),Ya=`(WCOD+)?`.replace(`WCOD`,qa),Xa=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Ka),Za=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Ka),Qa=RegExp(`^`+Ja+Ya+Xa+Za+`$`),$a=[`material`,`materials`,`bones`,`map`],eo=class{constructor(e,t,n){let r=n||to.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},to=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Ga,``)}static parseTrackName(e){let t=Qa.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);$a.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){L(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){R(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){R(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){R(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){R(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){R(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){R(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;R(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){R(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};to.Composite=eo,to.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},to.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},to.prototype.GetterByBindingType=[to.prototype._getValue_direct,to.prototype._getValue_array,to.prototype._getValue_arrayElement,to.prototype._getValue_toArray],to.prototype.SetterByBindingTypeAndVersioning=[[to.prototype._setValue_direct,to.prototype._setValue_direct_setNeedsUpdate,to.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[to.prototype._setValue_array,to.prototype._setValue_array_setNeedsUpdate,to.prototype._setValue_array_setMatrixWorldNeedsUpdate],[to.prototype._setValue_arrayElement,to.prototype._setValue_arrayElement_setNeedsUpdate,to.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[to.prototype._setValue_fromArray,to.prototype._setValue_fromArray_setNeedsUpdate,to.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function no(e,t,n,r){let i=ro(r);switch(n){case w:return e*t;case O:return e*t/i.components*i.byteLength;case k:return e*t/i.components*i.byteLength;case te:return e*t*2/i.components*i.byteLength;case ne:return e*t*2/i.components*i.byteLength;case T:return e*t*3/i.components*i.byteLength;case E:return e*t*4/i.components*i.byteLength;case A:return e*t*4/i.components*i.byteLength;case re:case ie:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case j:case ae:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case se:case le:return Math.max(e,16)*Math.max(t,8)/4;case oe:case ce:return Math.max(e,8)*Math.max(t,8)/2;case ue:case de:case fe:case pe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case M:case me:case he:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ge:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case _e:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case ve:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ye:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case be:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case xe:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Se:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Ce:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case we:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Te:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Ee:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case De:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Oe:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case ke:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ae:case je:case Me:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Ne:case Pe:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Fe:case N:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function ro(e){switch(e){case d:case f:return{byteLength:1,components:1};case m:case p:case v:return{byteLength:2,components:1};case y:case b:return{byteLength:2,components:4};case g:case h:case _:return{byteLength:4,components:1};case S:case C:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`185`}})),typeof window<`u`&&(window.__THREE__?L(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`185`);function io(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function ao(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var G={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
}`},K={common:{diffuse:{value:new W(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new H},alphaMap:{value:null},alphaMapTransform:{value:new H},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new H}},envmap:{envMap:{value:null},envMapRotation:{value:new H},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new H}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new H}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new H},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new H},normalScale:{value:new B(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new H},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new H}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new H}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new H}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new W(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new W(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new H},alphaTest:{value:0},uvTransform:{value:new H}},sprite:{diffuse:{value:new W(16777215)},opacity:{value:1},center:{value:new B(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new H},alphaMap:{value:null},alphaMapTransform:{value:new H},alphaTest:{value:0}}},oo={basic:{uniforms:Zi([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.fog]),vertexShader:G.meshbasic_vert,fragmentShader:G.meshbasic_frag},lambert:{uniforms:Zi([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new W(0)},envMapIntensity:{value:1}}]),vertexShader:G.meshlambert_vert,fragmentShader:G.meshlambert_frag},phong:{uniforms:Zi([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new W(0)},specular:{value:new W(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:G.meshphong_vert,fragmentShader:G.meshphong_frag},standard:{uniforms:Zi([K.common,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.roughnessmap,K.metalnessmap,K.fog,K.lights,{emissive:{value:new W(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:G.meshphysical_vert,fragmentShader:G.meshphysical_frag},toon:{uniforms:Zi([K.common,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.gradientmap,K.fog,K.lights,{emissive:{value:new W(0)}}]),vertexShader:G.meshtoon_vert,fragmentShader:G.meshtoon_frag},matcap:{uniforms:Zi([K.common,K.bumpmap,K.normalmap,K.displacementmap,K.fog,{matcap:{value:null}}]),vertexShader:G.meshmatcap_vert,fragmentShader:G.meshmatcap_frag},points:{uniforms:Zi([K.points,K.fog]),vertexShader:G.points_vert,fragmentShader:G.points_frag},dashed:{uniforms:Zi([K.common,K.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:G.linedashed_vert,fragmentShader:G.linedashed_frag},depth:{uniforms:Zi([K.common,K.displacementmap]),vertexShader:G.depth_vert,fragmentShader:G.depth_frag},normal:{uniforms:Zi([K.common,K.bumpmap,K.normalmap,K.displacementmap,{opacity:{value:1}}]),vertexShader:G.meshnormal_vert,fragmentShader:G.meshnormal_frag},sprite:{uniforms:Zi([K.sprite,K.fog]),vertexShader:G.sprite_vert,fragmentShader:G.sprite_frag},background:{uniforms:{uvTransform:{value:new H},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:G.background_vert,fragmentShader:G.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new H}},vertexShader:G.backgroundCube_vert,fragmentShader:G.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:G.cube_vert,fragmentShader:G.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:G.equirect_vert,fragmentShader:G.equirect_frag},distance:{uniforms:Zi([K.common,K.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:G.distance_vert,fragmentShader:G.distance_frag},shadow:{uniforms:Zi([K.lights,K.fog,{color:{value:new W(0)},opacity:{value:1}}]),vertexShader:G.shadow_vert,fragmentShader:G.shadow_frag}};oo.physical={uniforms:Zi([oo.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new H},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new H},clearcoatNormalScale:{value:new B(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new H},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new H},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new H},sheen:{value:0},sheenColor:{value:new W(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new H},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new H},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new H},transmissionSamplerSize:{value:new B},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new H},attenuationDistance:{value:0},attenuationColor:{value:new W(0)},specularColor:{value:new W(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new H},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new H},anisotropyVector:{value:new B},anisotropyMap:{value:null},anisotropyMapTransform:{value:new H}}]),vertexShader:G.meshphysical_vert,fragmentShader:G.meshphysical_frag};var so={r:0,b:0,g:0},co=new $t,lo=new H;lo.set(-1,0,0,0,1,0,0,0,1);function uo(e,t,n,r,i,a){let o=new W(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new yi(new Ui(1,1,1),new ia({name:`BackgroundCubeMaterial`,uniforms:Xi(oo.backgroundCube.uniforms),vertexShader:oo.backgroundCube.vertexShader,fragmentShader:oo.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(co.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(lo),l.material.toneMapped=U.getTransfer(i.colorSpace)!==We,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new yi(new Ji(2,2),new ia({name:`BackgroundMaterial`,uniforms:Xi(oo.background.uniforms),vertexShader:oo.background.vertexShader,fragmentShader:oo.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=U.getTransfer(i.colorSpace)!==We,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(so,ea(e)),n.buffers.color.setClear(so.r,so.g,so.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function fo(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function po(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function mo(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return!(t!==1023&&r.convert(t)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(L(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&L(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function ho(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Ei,s=new H,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var go=4,_o=[.125,.215,.35,.446,.526,.582],vo=20,yo=256,bo=new La,xo=new W,So=null,Co=0,wo=0,To=!1,Eo=new V,Do=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Eo}=i;So=this._renderer.getRenderTarget(),Co=this._renderer.getActiveCubeFace(),wo=this._renderer.getActiveMipmapLevel(),To=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Po(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=No(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(So,Co,wo),this._renderer.xr.enabled=To,e.scissorTest=!1,Ao(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),So=this._renderer.getRenderTarget(),Co=this._renderer.getActiveCubeFace(),wo=this._renderer.getActiveMipmapLevel(),To=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:c,minFilter:c,generateMipmaps:!1,type:v,format:E,colorSpace:He,depthBuffer:!1},r=ko(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ko(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Oo(r)),this._blurMaterial=Mo(r,e,t),this._ggxMaterial=jo(r,e,t)}return r}_compileMaterial(e){let t=new yi(new jr,e);this._renderer.compile(t,bo)}_sceneToCubeUV(e,t,n,r,i){let a=new Ia(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(xo),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new yi(new Ui,new si({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(xo),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Ao(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Po()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=No());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Ao(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,bo)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-go?n-d+go:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Ao(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,bo),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Ao(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,bo)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&R(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/(2*vo-1),p=i/f,m=isFinite(i)?1+Math.floor(3*p):vo;m>vo&&L(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${vo}`);let h=[],g=0;for(let e=0;e<vo;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];Ao(t,3*v*(r>_-go?r-_+go:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,bo)}};function Oo(e){let t=[],n=[],r=[],i=e,a=e-go+1+_o.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-go?s=_o[o-e+go-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new jr;h.setAttribute(`position`,new gr(f,3)),h.setAttribute(`uv`,new gr(p,2)),h.setAttribute(`faceIndex`,new gr(m,1)),r.push(new yi(h,null)),i>go&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function ko(e,t,n){let r=new Xt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Ao(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function jo(e,t,n){return new ia({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:yo,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Fo(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Mo(e,t,n){let r=new Float32Array(vo),i=new V(0,1,0);return new ia({name:`SphericalGaussianBlur`,defines:{n:vo,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Fo(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function No(){return new ia({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Fo(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Po(){return new ia({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Fo(){return`

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
	`}var Io=class extends Xt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ri(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Ui(5,5,5),i=new ia({name:`CubemapFromEquirect`,uniforms:Xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new yi(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=c),new Ba(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Lo(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304)if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}else{let r=n.image;if(r&&r.height>0){let i=new Io(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}else return null}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Do(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Do(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Ro(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&tt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function zo(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?vr:_r)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Bo(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Vo(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:R(`WebGLInfo: Unknown draw mode:`,r);break}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Ho(e,t,n){let r=new WeakMap,i=new Jt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Zt(h,p,m,u);g.type=_,g.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new B(p,m)},r.set(o,d);function y(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Uo(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Wo={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Go(e,t,n,r,i,a){let o=new Xt(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new Bi(t,n):void 0}),s=new Xt(t,n,{type:v,depthBuffer:!1,stencilBuffer:!1}),c=new jr;c.setAttribute(`position`,new yr([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute(`uv`,new yr([0,2,0,0,2,0],2));let l=new aa({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new yi(c,l),d=new La(-1,1,1,-1,0,1),f=null,p=null,m=!1,h,g=null,_=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s.setSize(e,t);for(let n=0;n<_.length;n++){let r=_[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){_=e,y=_.length>0&&_[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<_.length;e++){let r=_[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(m||e.toneMapping===0&&_.length===0)return!1;if(g=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),h=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=h,m=!0;let n=o,r=s;for(let i=0;i<_.length;i++){let a=_[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,l.defines={},U.getTransfer(f)===`srgb`&&(l.defines.SRGB_TRANSFER=``);let t=Wo[p];t&&(l.defines[t]=``),l.needsUpdate=!0}l.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(g),e.render(u,d),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose()}}var Ko=new qt,qo=new Bi(1,1),Jo=new Zt,Yo=new Qt,Xo=new Ri,Zo=[],Qo=[],$o=new Float32Array(16),es=new Float32Array(9),ts=new Float32Array(4);function ns(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Zo[i];if(a===void 0&&(a=new Float32Array(i),Zo[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function rs(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function is(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function as(e,t){let n=Qo[t];n===void 0&&(n=new Int32Array(t),Qo[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function os(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function ss(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(rs(n,t))return;e.uniform2fv(this.addr,t),is(n,t)}}function cs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(rs(n,t))return;e.uniform3fv(this.addr,t),is(n,t)}}function ls(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(rs(n,t))return;e.uniform4fv(this.addr,t),is(n,t)}}function us(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(rs(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),is(n,t)}else{if(rs(n,r))return;ts.set(r),e.uniformMatrix2fv(this.addr,!1,ts),is(n,r)}}function ds(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(rs(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),is(n,t)}else{if(rs(n,r))return;es.set(r),e.uniformMatrix3fv(this.addr,!1,es),is(n,r)}}function fs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(rs(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),is(n,t)}else{if(rs(n,r))return;$o.set(r),e.uniformMatrix4fv(this.addr,!1,$o),is(n,r)}}function ps(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function ms(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(rs(n,t))return;e.uniform2iv(this.addr,t),is(n,t)}}function hs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(rs(n,t))return;e.uniform3iv(this.addr,t),is(n,t)}}function gs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(rs(n,t))return;e.uniform4iv(this.addr,t),is(n,t)}}function _s(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function vs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(rs(n,t))return;e.uniform2uiv(this.addr,t),is(n,t)}}function ys(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(rs(n,t))return;e.uniform3uiv(this.addr,t),is(n,t)}}function bs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(rs(n,t))return;e.uniform4uiv(this.addr,t),is(n,t)}}function xs(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(qo.compareFunction=n.isReversedDepthBuffer()?518:515,a=qo):a=Ko,n.setTexture2D(t||a,i)}function Ss(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Yo,i)}function Cs(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Xo,i)}function ws(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Jo,i)}function Ts(e){switch(e){case 5126:return os;case 35664:return ss;case 35665:return cs;case 35666:return ls;case 35674:return us;case 35675:return ds;case 35676:return fs;case 5124:case 35670:return ps;case 35667:case 35671:return ms;case 35668:case 35672:return hs;case 35669:case 35673:return gs;case 5125:return _s;case 36294:return vs;case 36295:return ys;case 36296:return bs;case 35678:case 36198:case 36298:case 36306:case 35682:return xs;case 35679:case 36299:case 36307:return Ss;case 35680:case 36300:case 36308:case 36293:return Cs;case 36289:case 36303:case 36311:case 36292:return ws}}function Es(e,t){e.uniform1fv(this.addr,t)}function Ds(e,t){let n=ns(t,this.size,2);e.uniform2fv(this.addr,n)}function Os(e,t){let n=ns(t,this.size,3);e.uniform3fv(this.addr,n)}function ks(e,t){let n=ns(t,this.size,4);e.uniform4fv(this.addr,n)}function As(e,t){let n=ns(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function js(e,t){let n=ns(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Ms(e,t){let n=ns(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Ns(e,t){e.uniform1iv(this.addr,t)}function Ps(e,t){e.uniform2iv(this.addr,t)}function Fs(e,t){e.uniform3iv(this.addr,t)}function Is(e,t){e.uniform4iv(this.addr,t)}function Ls(e,t){e.uniform1uiv(this.addr,t)}function Rs(e,t){e.uniform2uiv(this.addr,t)}function zs(e,t){e.uniform3uiv(this.addr,t)}function Bs(e,t){e.uniform4uiv(this.addr,t)}function Vs(e,t,n){let r=this.cache,i=t.length,a=as(n,i);rs(r,a)||(e.uniform1iv(this.addr,a),is(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?qo:Ko;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Hs(e,t,n){let r=this.cache,i=t.length,a=as(n,i);rs(r,a)||(e.uniform1iv(this.addr,a),is(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Yo,a[e])}function Us(e,t,n){let r=this.cache,i=t.length,a=as(n,i);rs(r,a)||(e.uniform1iv(this.addr,a),is(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Xo,a[e])}function Ws(e,t,n){let r=this.cache,i=t.length,a=as(n,i);rs(r,a)||(e.uniform1iv(this.addr,a),is(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Jo,a[e])}function Gs(e){switch(e){case 5126:return Es;case 35664:return Ds;case 35665:return Os;case 35666:return ks;case 35674:return As;case 35675:return js;case 35676:return Ms;case 5124:case 35670:return Ns;case 35667:case 35671:return Ps;case 35668:case 35672:return Fs;case 35669:case 35673:return Is;case 5125:return Ls;case 36294:return Rs;case 36295:return zs;case 36296:return Bs;case 35678:case 36198:case 36298:case 36306:case 35682:return Vs;case 35679:case 36299:case 36307:return Hs;case 35680:case 36300:case 36308:case 36293:return Us;case 36289:case 36303:case 36311:case 36292:return Ws}}var Ks=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ts(t.type)}},qs=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Gs(t.type)}},Js=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Ys=/(\w+)(\])?(\[|\.)?/g;function Xs(e,t){e.seq.push(t),e.map[t.id]=t}function Zs(e,t,n){let r=e.name,i=r.length;for(Ys.lastIndex=0;;){let a=Ys.exec(r),o=Ys.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Xs(n,l===void 0?new Ks(s,e,t):new qs(s,e,t));break}else{let e=n.map[s];e===void 0&&(e=new Js(s),Xs(n,e)),n=e}}}var Qs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Zs(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function $s(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var ec=37297,tc=0;function nc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var rc=new H;function ic(e){U._getMatrix(rc,U.workingColorSpace,e);let t=`mat3( ${rc.elements.map(e=>e.toFixed(4))} )`;switch(U.getTransfer(e)){case Ue:return[t,`LinearTransferOETF`];case We:return[t,`sRGBTransferOETF`];default:return L(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function ac(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+nc(e.getShaderSource(t),r)}else return i}function oc(e,t){let n=ic(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var sc={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function cc(e,t){let n=sc[t];return n===void 0?(L(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var lc=new V;function uc(){return U.getLuminanceCoefficients(lc),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${lc.x.toFixed(4)}, ${lc.y.toFixed(4)}, ${lc.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function dc(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(mc).join(`
`)}function fc(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function pc(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function mc(e){return e!==``}function hc(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function gc(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var _c=/^[ \t]*#include +<([\w\d./]+)>/gm;function vc(e){return e.replace(_c,bc)}var yc=new Map;function bc(e,t){let n=G[t];if(n===void 0){let e=yc.get(t);if(e!==void 0)n=G[e],L(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return vc(n)}var xc=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sc(e){return e.replace(xc,Cc)}function Cc(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function wc(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}var Tc={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Ec(e){return Tc[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Dc={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Oc(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Dc[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var kc={302:`ENVMAP_MODE_REFRACTION`};function Ac(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:kc[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var jc={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Mc(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:jc[e.combine]||`ENVMAP_BLENDING_NONE`}function Nc(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Pc(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Ec(n),l=Oc(n),u=Ac(n),d=Mc(n),f=Nc(n),p=dc(n),m=fc(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(mc).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(mc).join(`
`),_.length>0&&(_+=`
`)):(g=[wc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(mc).join(`
`),_=[wc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:G.tonemapping_pars_fragment,n.toneMapping===0?``:cc(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,G.colorspace_pars_fragment,oc(`linearToOutputTexel`,n.outputColorSpace),uc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(mc).join(`
`)),o=vc(o),o=hc(o,n),o=gc(o,n),s=vc(s),s=hc(s,n),s=gc(s,n),o=Sc(o),s=Sc(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=$s(i,i.VERTEX_SHADER,y),S=$s(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1)if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=ac(i,x,`vertex`),n=ac(i,S,`fragment`);R(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}else o===``?(s===``||c===``)&&(u=!1):L(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Qs(i,h),T=pc(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,ec)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=tc++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Fc=0,Ic=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Lc(e),t.set(e,n)),n}},Lc=class{constructor(e){this.id=Fc++,this.code=e,this.usedTimes=0}};function Rc(e){return e===1030||e===37490||e===36285}function zc(e,t,n,r,i,a){let o=new dn,s=new Ic,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&L(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,ee,O,k;if(C){let e=oo[C];D=e.vertexShader,ee=e.fragmentShader}else{D=i.vertexShader,ee=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let te=e.getRenderTarget(),ne=e.state.buffers.depth.getReversed(),A=h.isInstancedMesh===!0,re=h.isBatchedMesh===!0,ie=!!i.map,j=!!i.matcap,ae=!!x,oe=!!i.aoMap,se=!!i.lightMap,ce=!!i.bumpMap&&i.wireframe===!1,le=!!i.normalMap,ue=!!i.displacementMap,de=!!i.emissiveMap,M=!!i.metalnessMap,fe=!!i.roughnessMap,pe=i.anisotropy>0,me=i.clearcoat>0,he=i.dispersion>0,ge=i.iridescence>0,_e=i.sheen>0,ve=i.transmission>0,ye=pe&&!!i.anisotropyMap,be=me&&!!i.clearcoatMap,xe=me&&!!i.clearcoatNormalMap,Se=me&&!!i.clearcoatRoughnessMap,Ce=ge&&!!i.iridescenceMap,we=ge&&!!i.iridescenceThicknessMap,Te=_e&&!!i.sheenColorMap,Ee=_e&&!!i.sheenRoughnessMap,De=!!i.specularMap,Oe=!!i.specularColorMap,ke=!!i.specularIntensityMap,Ae=ve&&!!i.transmissionMap,je=ve&&!!i.thicknessMap,Me=!!i.gradientMap,Ne=!!i.alphaMap,Pe=i.alphaTest>0,Fe=!!i.alphaHash,N=!!i.extensions,Ie=0;i.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Ie=e.toneMapping);let Le={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:ee,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:re,batchingColor:re&&h._colorsTexture!==null,instancing:A,instancingColor:A&&h.instanceColor!==null,instancingMorph:A&&h.morphTexture!==null,outputColorSpace:te===null?e.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:U.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ie,matcap:j,envMap:ae,envMapMode:ae&&x.mapping,envMapCubeUVHeight:S,aoMap:oe,lightMap:se,bumpMap:ce,normalMap:le,displacementMap:ue,emissiveMap:de,normalMapObjectSpace:le&&i.normalMapType===1,normalMapTangentSpace:le&&i.normalMapType===0,packedNormalMap:le&&i.normalMapType===0&&Rc(i.normalMap.format),metalnessMap:M,roughnessMap:fe,anisotropy:pe,anisotropyMap:ye,clearcoat:me,clearcoatMap:be,clearcoatNormalMap:xe,clearcoatRoughnessMap:Se,dispersion:he,iridescence:ge,iridescenceMap:Ce,iridescenceThicknessMap:we,sheen:_e,sheenColorMap:Te,sheenRoughnessMap:Ee,specularMap:De,specularColorMap:Oe,specularIntensityMap:ke,transmission:ve,transmissionMap:Ae,thicknessMap:je,gradientMap:Me,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ne,alphaTest:Pe,alphaHash:Fe,combine:i.combine,mapUv:ie&&m(i.map.channel),aoMapUv:oe&&m(i.aoMap.channel),lightMapUv:se&&m(i.lightMap.channel),bumpMapUv:ce&&m(i.bumpMap.channel),normalMapUv:le&&m(i.normalMap.channel),displacementMapUv:ue&&m(i.displacementMap.channel),emissiveMapUv:de&&m(i.emissiveMap.channel),metalnessMapUv:M&&m(i.metalnessMap.channel),roughnessMapUv:fe&&m(i.roughnessMap.channel),anisotropyMapUv:ye&&m(i.anisotropyMap.channel),clearcoatMapUv:be&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:xe&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:we&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&m(i.sheenRoughnessMap.channel),specularMapUv:De&&m(i.specularMap.channel),specularColorMapUv:Oe&&m(i.specularColorMap.channel),specularIntensityMapUv:ke&&m(i.specularIntensityMap.channel),transmissionMapUv:Ae&&m(i.transmissionMap.channel),thicknessMapUv:je&&m(i.thicknessMap.channel),alphaMapUv:Ne&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(le||pe),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ie||Ne),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&le===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ne,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ie,decodeVideoTexture:ie&&i.map.isVideoTexture===!0&&U.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:de&&i.emissiveMap.isVideoTexture===!0&&U.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:N&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(N&&i.extensions.multiDraw===!0||re)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Le.vertexUv1s=c.has(1),Le.vertexUv2s=c.has(2),Le.vertexUv3s=c.has(3),c.clear(),Le}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=oo[t];n=ta.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Pc(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Bc(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Vc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Hc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Uc(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||Vc),r.length>1&&r.sort(t||Hc),i.length>1&&i.sort(t||Hc),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Wc(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Uc,e.set(t,[i])):n>=r.length?(i=new Uc,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Gc(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new V,color:new W};break;case`SpotLight`:n={position:new V,direction:new V,color:new W,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new V,color:new W,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new V,skyColor:new W,groundColor:new W};break;case`RectAreaLight`:n={color:new W,position:new V,halfWidth:new V,halfHeight:new V};break}return e[t.id]=n,n}}}function Kc(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}var qc=0;function Jc(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Yc(e){let t=new Gc,n=Kc(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new V);let i=new V,a=new $t,o=new $t;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(Jc);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=K.LTC_FLOAT_1,r.rectAreaLTC2=K.LTC_FLOAT_2):(r.rectAreaLTC1=K.LTC_HALF_1,r.rectAreaLTC2=K.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=qc++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function Xc(e){let t=new Yc(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Zc(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Xc(e),t.set(n,[a])):r>=i.length?(a=new Xc(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Qc=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$c=`uniform sampler2D shadow_pass;
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
}`,el=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],tl=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],nl=new $t,rl=new V,il=new V;function al(e,t,n){let r=new Ai,i=new B,o=new B,s=new Jt,l=new oa,u=new sa,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},m=new ia({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new B},radius:{value:4}},vertexShader:Qc,fragmentShader:$c}),h=m.clone();h.defines.HORIZONTAL_PASS=1;let y=new jr;y.setAttribute(`position`,new gr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new yi(y,m),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,l){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(L(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.state;m.setBlending(0),m.buffers.depth.getReversed()===!0?m.buffers.color.setClear(0,0,0,0):m.buffers.color.setClear(1,1,1,1),m.buffers.depth.setTest(!0),m.setScissorTest(!1);let h=S!==this.type;h&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){L(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;i.copy(p.mapSize);let y=p.getFrameExtents();i.multiply(y),o.copy(p.mapSize),(i.x>f||i.y>f)&&(i.x>f&&(o.x=Math.floor(f/y.x),i.x=o.x*y.x,p.mapSize.x=o.x),i.y>f&&(o.y=Math.floor(f/y.y),i.y=o.y*y.y,p.mapSize.y=o.y));let b=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=b,p.map===null||h===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){L(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new Xt(i.x,i.y,{format:te,type:v,minFilter:c,magFilter:c,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new Bi(i.x,i.y,_),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=D,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=a,p.map.depthTexture.magFilter=a}else d.isPointLight?(p.map=new Io(i.x),p.map.depthTexture=new Vi(i.x,g)):(p.map=new Xt(i.x,i.y),p.map.depthTexture=new Bi(i.x,i.y,g)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=D,this.type===1?(p.map.depthTexture.compareFunction=b?518:515,p.map.depthTexture.minFilter=c,p.map.depthTexture.magFilter=c):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=a,p.map.depthTexture.magFilter=a);p.camera.updateProjectionMatrix()}let x=p.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<x;t++){if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);s.set(o.x*n.x,o.y*n.y,o.x*n.z,o.y*n.w),m.viewport(s)}if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),rl.setFromMatrixPosition(d.matrixWorld),e.position.copy(rl),il.copy(e.position),il.add(el[t]),e.up.copy(tl[t]),e.lookAt(il),e.updateMatrixWorld(),n.makeTranslation(-rl.x,-rl.y,-rl.z),nl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(nl,e.coordinateSystem,e.reversedDepth)}else p.updateMatrices(d);r=p.getFrustum(),T(n,l,p.camera,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,l),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let a=t.update(b);m.defines.VSM_SAMPLES!==n.blurSamples&&(m.defines.VSM_SAMPLES=n.blurSamples,h.defines.VSM_SAMPLES=n.blurSamples,m.needsUpdate=!0,h.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new Xt(i.x,i.y,{format:te,type:v})),m.uniforms.shadow_pass.value=n.map.depthTexture,m.uniforms.resolution.value=n.mapSize,m.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,m,b,null),h.uniforms.shadow_pass.value=n.mapPass.texture,h.uniforms.resolution.value=n.mapSize,h.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,h,b,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:l,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,E)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function T(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)T(c[e],i,a,o,s)}function E(e){e.target.removeEventListener(`dispose`,E);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function ol(e,t){function n(){let t=!1,n=new Jt,r=null,i=new Jt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?M(e.DEPTH_TEST):fe(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=rt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?M(e.STENCIL_TEST):fe(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new W(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,te=null,ne=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),A=!1,re=0,ie=e.getParameter(e.VERSION);ie.indexOf(`WebGL`)===-1?ie.indexOf(`OpenGL ES`)!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),A=re>=2):(re=parseFloat(/^WebGL (\d)/.exec(ie)[1]),A=re>=1);let j=null,ae={},oe=e.getParameter(e.SCISSOR_BOX),se=e.getParameter(e.VIEWPORT),ce=new Jt().fromArray(oe),le=new Jt().fromArray(se);function ue(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let de={};de[e.TEXTURE_2D]=ue(e.TEXTURE_2D,e.TEXTURE_2D,1),de[e.TEXTURE_CUBE_MAP]=ue(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),de[e.TEXTURE_2D_ARRAY]=ue(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),de[e.TEXTURE_3D]=ue(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),M(e.DEPTH_TEST),o.setFunc(3),be(!1),xe(1),M(e.CULL_FACE),ve(0);function M(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function fe(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function pe(t,n){return f[t]===n?!1:(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function me(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function he(t){return h===t?!1:(e.useProgram(t),h=t,!0)}let ge={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ge[103]=e.MIN,ge[104]=e.MAX;let _e={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ve(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(fe(e.BLEND),g=!1);return}if(g===!1&&(M(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:R(`WebGLState: Invalid blending: `,t);break}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:R(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:R(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:R(`WebGLState: Invalid blending: `,t);break}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ge[n],ge[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(_e[r],_e[i],_e[o],_e[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ye(t,n){t.side===2?fe(e.CULL_FACE):M(e.CULL_FACE);let r=t.side===1;n&&(r=!r),be(r),t.blending===1&&t.transparent===!1?ve(0):ve(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Ce(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?M(e.SAMPLE_ALPHA_TO_COVERAGE):fe(e.SAMPLE_ALPHA_TO_COVERAGE)}function be(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function xe(t){t===0?fe(e.CULL_FACE):(M(e.CULL_FACE),t!==ee&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),ee=t}function Se(t){t!==O&&(A&&e.lineWidth(t),O=t)}function Ce(t,n,r){t?(M(e.POLYGON_OFFSET_FILL),(k!==n||te!==r)&&(k=n,te=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):fe(e.POLYGON_OFFSET_FILL)}function we(t){t?M(e.SCISSOR_TEST):fe(e.SCISSOR_TEST)}function Te(t){t===void 0&&(t=e.TEXTURE0+ne-1),j!==t&&(e.activeTexture(t),j=t)}function Ee(t,n,r){r===void 0&&(r=j===null?e.TEXTURE0+ne-1:j);let i=ae[r];i===void 0&&(i={type:void 0,texture:void 0},ae[r]=i),(i.type!==t||i.texture!==n)&&(j!==r&&(e.activeTexture(r),j=r),e.bindTexture(t,n||de[t]),i.type=t,i.texture=n)}function De(){let t=ae[j];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Oe(){try{e.compressedTexImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function ke(){try{e.compressedTexImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ae(){try{e.texSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function je(){try{e.texSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Me(){try{e.compressedTexSubImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ne(){try{e.compressedTexSubImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Pe(){try{e.texStorage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Fe(){try{e.texStorage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function N(){try{e.texImage2D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Ie(){try{e.texImage3D(...arguments)}catch(e){R(`WebGLState:`,e)}}function Le(t){return d[t]===void 0?e.getParameter(t):d[t]}function Re(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function P(t){ce.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ce.copy(t))}function ze(t){le.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),le.copy(t))}function F(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function I(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Be(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},j=null,ae={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new W(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,te=null,ce.set(0,0,e.canvas.width,e.canvas.height),le.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:M,disable:fe,bindFramebuffer:pe,drawBuffers:me,useProgram:he,setBlending:ve,setMaterial:ye,setFlipSided:be,setCullFace:xe,setLineWidth:Se,setPolygonOffset:Ce,setScissorTest:we,activeTexture:Te,bindTexture:Ee,unbindTexture:De,compressedTexImage2D:Oe,compressedTexImage3D:ke,texImage2D:N,texImage3D:Ie,pixelStorei:Re,getParameter:Le,updateUBOMapping:F,uniformBlockBinding:I,texStorage2D:Pe,texStorage3D:Fe,texSubImage2D:Ae,texSubImage3D:je,compressedTexSubImage2D:Me,compressedTexSubImage3D:Ne,scissor:P,viewport:ze,reset:Be}}function sl(e,t,d,f,p,m,h){let g=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new B,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):Xe(`canvas`)}function T(e,t,n){let r=1,i=Le(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1)if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),L(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}else return`data`in e&&L(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e;return e}function E(e){return e.generateMipmaps}function D(t){e.generateMipmap(t)}function O(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function k(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];L(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||L(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Ue:U.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function te(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,L(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function ne(e,t){return E(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function A(e){let t=e.target;t.removeEventListener(`dispose`,A),ie(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function re(e){let t=e.target;t.removeEventListener(`dispose`,re),ae(t)}function ie(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&j(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function j(t){let n=f.get(t);e.deleteTexture(n.__webglTexture);let r=t.source,i=S.get(r);delete i[n.__cacheKey],h.memory.textures--}function ae(t){let n=f.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),f.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let r=t.textures;for(let t=0,n=r.length;t<n;t++){let n=f.get(r[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),h.memory.textures--),f.remove(r[t])}f.remove(t)}let oe=0;function se(){oe=0}function ce(){return oe}function le(e){oe=e}function ue(){let e=oe;return e>=p.maxTextures&&L(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+p.maxTextures),oe+=1,e}function de(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function M(t,n){let r=f.get(t);if(t.isVideoTexture&&N(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&r.__version!==t.version){let e=t.image;if(e===null)L(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)L(`WebGLRenderer: Texture marked for update but image is incomplete`);else{Se(r,t,n);return}}else t.isExternalTexture&&(r.__webglTexture=t.sourceTexture?t.sourceTexture:null);d.bindTexture(e.TEXTURE_2D,r.__webglTexture,e.TEXTURE0+n)}function fe(t,n){let r=f.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&r.__version!==t.version){Se(r,t,n);return}else t.isExternalTexture&&(r.__webglTexture=t.sourceTexture?t.sourceTexture:null);d.bindTexture(e.TEXTURE_2D_ARRAY,r.__webglTexture,e.TEXTURE0+n)}function pe(t,n){let r=f.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&r.__version!==t.version){Se(r,t,n);return}d.bindTexture(e.TEXTURE_3D,r.__webglTexture,e.TEXTURE0+n)}function me(t,n){let r=f.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&r.__version!==t.version){Ce(r,t,n);return}d.bindTexture(e.TEXTURE_CUBE_MAP,r.__webglTexture,e.TEXTURE0+n)}let he={[n]:e.REPEAT,[r]:e.CLAMP_TO_EDGE,[i]:e.MIRRORED_REPEAT},ge={[a]:e.NEAREST,[o]:e.NEAREST_MIPMAP_NEAREST,[s]:e.NEAREST_MIPMAP_LINEAR,[c]:e.LINEAR,[l]:e.LINEAR_MIPMAP_NEAREST,[u]:e.LINEAR_MIPMAP_LINEAR},_e={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function ve(n,r){if(r.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(r.magFilter===1006||r.magFilter===1007||r.magFilter===1005||r.magFilter===1008||r.minFilter===1006||r.minFilter===1007||r.minFilter===1005||r.minFilter===1008)&&L(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,he[r.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,he[r.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,he[r.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ge[r.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ge[r.minFilter]),r.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,_e[r.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(r.magFilter===1003||r.minFilter!==1005&&r.minFilter!==1008||r.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(r.anisotropy>1||f.get(r).__currentAnisotropy){let i=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,i.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(r.anisotropy,p.getMaxAnisotropy())),f.get(r).__currentAnisotropy=r.anisotropy}}}function ye(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,A));let i=n.source,a=S.get(i);a===void 0&&(a={},S.set(i,a));let o=de(n);if(o!==t.__cacheKey){a[o]===void 0&&(a[o]={texture:e.createTexture(),usedTimes:0},h.memory.textures++,r=!0),a[o].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&j(n)),t.__cacheKey=o,t.__webglTexture=a[o].texture}return r}function be(e,t,n){return Math.floor(Math.floor(e/n)/t)}function xe(t,n,r,i){let a=t.updateRanges;if(a.length===0)d.texSubImage2D(e.TEXTURE_2D,0,0,0,n.width,n.height,r,i,n.data);else{a.sort((e,t)=>e.start-t.start);let o=0;for(let e=1;e<a.length;e++){let t=a[o],r=a[e],i=t.start+t.count,s=be(r.start,n.width,4),c=be(t.start,n.width,4);r.start<=i+1&&s===c&&be(r.start+r.count-1,n.width,4)===s?t.count=Math.max(t.count,r.start+r.count-t.start):(++o,a[o]=r)}a.length=o+1;let s=d.getParameter(e.UNPACK_ROW_LENGTH),c=d.getParameter(e.UNPACK_SKIP_PIXELS),l=d.getParameter(e.UNPACK_SKIP_ROWS);d.pixelStorei(e.UNPACK_ROW_LENGTH,n.width);for(let t=0,o=a.length;t<o;t++){let o=a[t],s=Math.floor(o.start/4),c=Math.ceil(o.count/4),l=s%n.width,u=Math.floor(s/n.width),f=c;d.pixelStorei(e.UNPACK_SKIP_PIXELS,l),d.pixelStorei(e.UNPACK_SKIP_ROWS,u),d.texSubImage2D(e.TEXTURE_2D,0,l,u,f,1,r,i,n.data)}t.clearUpdateRanges(),d.pixelStorei(e.UNPACK_ROW_LENGTH,s),d.pixelStorei(e.UNPACK_SKIP_PIXELS,c),d.pixelStorei(e.UNPACK_SKIP_ROWS,l)}}function Se(t,n,r){let i=e.TEXTURE_2D;(n.isDataArrayTexture||n.isCompressedArrayTexture)&&(i=e.TEXTURE_2D_ARRAY),n.isData3DTexture&&(i=e.TEXTURE_3D);let a=ye(t,n),o=n.source;d.bindTexture(i,t.__webglTexture,e.TEXTURE0+r);let s=f.get(o);if(o.version!==s.__version||a===!0){if(d.activeTexture(e.TEXTURE0+r),!(typeof ImageBitmap<`u`&&n.image instanceof ImageBitmap)){let t=U.getPrimaries(U.workingColorSpace),r=n.colorSpace===``?null:U.getPrimaries(n.colorSpace),i=n.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;d.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,n.flipY),d.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),d.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}d.pixelStorei(e.UNPACK_ALIGNMENT,n.unpackAlignment);let t=T(n.image,!1,p.maxTextureSize);t=Ie(n,t);let c=m.convert(n.format,n.colorSpace),l=m.convert(n.type),u=k(n.internalFormat,c,l,n.normalized,n.colorSpace,n.isVideoTexture);ve(i,n);let f,h=n.mipmaps,g=n.isVideoTexture!==!0,_=s.__version===void 0||a===!0,v=o.dataReady,y=ne(n,t);if(n.isDepthTexture)u=te(n.format===ee,n.type),_&&(g?d.texStorage2D(e.TEXTURE_2D,1,u,t.width,t.height):d.texImage2D(e.TEXTURE_2D,0,u,t.width,t.height,0,c,l,null));else if(n.isDataTexture)if(h.length>0){g&&_&&d.texStorage2D(e.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let t=0,n=h.length;t<n;t++)f=h[t],g?v&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,c,l,f.data):d.texImage2D(e.TEXTURE_2D,t,u,f.width,f.height,0,c,l,f.data);n.generateMipmaps=!1}else g?(_&&d.texStorage2D(e.TEXTURE_2D,y,u,t.width,t.height),v&&xe(n,t,c,l)):d.texImage2D(e.TEXTURE_2D,0,u,t.width,t.height,0,c,l,t.data);else if(n.isCompressedTexture)if(n.isCompressedArrayTexture){g&&_&&d.texStorage3D(e.TEXTURE_2D_ARRAY,y,u,h[0].width,h[0].height,t.depth);for(let r=0,i=h.length;r<i;r++)if(f=h[r],n.format!==1023)if(c!==null)if(g){if(v)if(n.layerUpdates.size>0){let t=no(f.width,f.height,n.format,n.type);for(let i of n.layerUpdates){let n=f.data.subarray(i*t/f.data.BYTES_PER_ELEMENT,(i+1)*t/f.data.BYTES_PER_ELEMENT);d.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,r,0,0,i,f.width,f.height,1,c,n)}n.clearLayerUpdates()}else d.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,r,0,0,0,f.width,f.height,t.depth,c,f.data)}else d.compressedTexImage3D(e.TEXTURE_2D_ARRAY,r,u,f.width,f.height,t.depth,0,f.data,0,0);else L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`);else g?v&&d.texSubImage3D(e.TEXTURE_2D_ARRAY,r,0,0,0,f.width,f.height,t.depth,c,l,f.data):d.texImage3D(e.TEXTURE_2D_ARRAY,r,u,f.width,f.height,t.depth,0,c,l,f.data)}else{g&&_&&d.texStorage2D(e.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let t=0,r=h.length;t<r;t++)f=h[t],n.format===1023?g?v&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,c,l,f.data):d.texImage2D(e.TEXTURE_2D,t,u,f.width,f.height,0,c,l,f.data):c===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&d.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,c,f.data):d.compressedTexImage2D(e.TEXTURE_2D,t,u,f.width,f.height,0,f.data)}else if(n.isDataArrayTexture)if(g){if(_&&d.texStorage3D(e.TEXTURE_2D_ARRAY,y,u,t.width,t.height,t.depth),v)if(n.layerUpdates.size>0){let r=no(t.width,t.height,n.format,n.type);for(let i of n.layerUpdates){let n=t.data.subarray(i*r/t.data.BYTES_PER_ELEMENT,(i+1)*r/t.data.BYTES_PER_ELEMENT);d.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,i,t.width,t.height,1,c,l,n)}n.clearLayerUpdates()}else d.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,c,l,t.data)}else d.texImage3D(e.TEXTURE_2D_ARRAY,0,u,t.width,t.height,t.depth,0,c,l,t.data);else if(n.isData3DTexture)g?(_&&d.texStorage3D(e.TEXTURE_3D,y,u,t.width,t.height,t.depth),v&&d.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,c,l,t.data)):d.texImage3D(e.TEXTURE_3D,0,u,t.width,t.height,t.depth,0,c,l,t.data);else if(n.isFramebufferTexture){if(_)if(g)d.texStorage2D(e.TEXTURE_2D,y,u,t.width,t.height);else{let n=t.width,r=t.height;for(let t=0;t<y;t++)d.texImage2D(e.TEXTURE_2D,t,u,n,r,0,c,l,null),n>>=1,r>>=1}}else if(n.isHTMLTexture){if(`texElementImage2D`in e){let r=e.canvas;if(r.hasAttribute(`layoutsubtree`)||r.setAttribute(`layoutsubtree`,`true`),t.parentNode!==r){r.appendChild(t),b.add(n),r.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},r.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let t=Le(h[0]);d.texStorage2D(e.TEXTURE_2D,y,u,t.width,t.height)}for(let t=0,n=h.length;t<n;t++)f=h[t],g?v&&d.texSubImage2D(e.TEXTURE_2D,t,0,0,c,l,f):d.texImage2D(e.TEXTURE_2D,t,u,c,l,f);n.generateMipmaps=!1}else if(g){if(_){let n=Le(t);d.texStorage2D(e.TEXTURE_2D,y,u,n.width,n.height)}v&&d.texSubImage2D(e.TEXTURE_2D,0,0,0,c,l,t)}else d.texImage2D(e.TEXTURE_2D,0,u,c,l,t);E(n)&&D(i),s.__version=o.version,n.onUpdate&&n.onUpdate(n)}t.__version=n.version}function Ce(t,n,r){if(n.image.length!==6)return;let i=ye(t,n),a=n.source;d.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+r);let o=f.get(a);if(a.version!==o.__version||i===!0){d.activeTexture(e.TEXTURE0+r);let t=U.getPrimaries(U.workingColorSpace),s=n.colorSpace===``?null:U.getPrimaries(n.colorSpace),c=n.colorSpace===``||t===s?e.NONE:e.BROWSER_DEFAULT_WEBGL;d.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,n.flipY),d.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),d.pixelStorei(e.UNPACK_ALIGNMENT,n.unpackAlignment),d.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,c);let l=n.isCompressedTexture||n.image[0].isCompressedTexture,u=n.image[0]&&n.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!l&&!u?f[e]=T(n.image[e],!0,p.maxCubemapSize):f[e]=u?n.image[e].image:n.image[e],f[e]=Ie(n,f[e]);let h=f[0],g=m.convert(n.format,n.colorSpace),_=m.convert(n.type),v=k(n.internalFormat,g,_,n.normalized,n.colorSpace),y=n.isVideoTexture!==!0,b=o.__version===void 0||i===!0,x=a.dataReady,S=ne(n,h);ve(e.TEXTURE_CUBE_MAP,n);let C;if(l){y&&b&&d.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=f[t].mipmaps;for(let r=0;r<C.length;r++){let i=C[r];n.format===1023?y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,g,_,i.data):g===null?L(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&d.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):d.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,i.data)}}}else{if(C=n.mipmaps,y&&b){C.length>0&&S++;let t=Le(f[0]);d.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(u){y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,f[t].width,f[t].height,g,_,f[t].data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,f[t].width,f[t].height,0,g,_,f[t].data);for(let n=0;n<C.length;n++){let r=C[n].image[t].image;y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,0,0,r.width,r.height,g,_,r.data):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,v,r.width,r.height,0,g,_,r.data)}}else{y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,f[t]):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,f[t]);for(let n=0;n<C.length;n++){let r=C[n];y?x&&d.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,0,0,g,_,r.image[t]):d.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,n+1,v,g,_,r.image[t])}}}E(n)&&D(e.TEXTURE_CUBE_MAP),o.__version=a.version,n.onUpdate&&n.onUpdate(n)}t.__version=n.version}function we(t,n,r,i,a,o){let s=m.convert(r.format,r.colorSpace),c=m.convert(r.type),l=k(r.internalFormat,s,c,r.normalized,r.colorSpace),u=f.get(n),p=f.get(r);if(p.__renderTarget=n,!u.__hasExternalTextures){let t=Math.max(1,n.width>>o),r=Math.max(1,n.height>>o);a===e.TEXTURE_3D||a===e.TEXTURE_2D_ARRAY?d.texImage3D(a,o,l,t,r,n.depth,0,s,c,null):d.texImage2D(a,o,l,t,r,0,s,c,null)}d.bindFramebuffer(e.FRAMEBUFFER,t),Fe(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,i,a,p.__webglTexture,0,Pe(n)):(a===e.TEXTURE_2D||a>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&a<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,i,a,p.__webglTexture,o),d.bindFramebuffer(e.FRAMEBUFFER,null)}function Te(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=te(n.stencilBuffer,a),s=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Fe(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Pe(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Pe(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let a=t[i],o=m.convert(a.format,a.colorSpace),s=m.convert(a.type),c=k(a.internalFormat,o,s,a.normalized,a.colorSpace);Fe(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Pe(n),c,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Pe(n),c,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,c,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Ee(t,n,r){let i=n.isWebGLCubeRenderTarget===!0;if(d.bindFramebuffer(e.FRAMEBUFFER,t),!(n.depthTexture&&n.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let a=f.get(n.depthTexture);if(a.__renderTarget=n,(!a.__webglTexture||n.depthTexture.image.width!==n.width||n.depthTexture.image.height!==n.height)&&(n.depthTexture.image.width=n.width,n.depthTexture.image.height=n.height,n.depthTexture.needsUpdate=!0),i){if(a.__webglInit===void 0&&(a.__webglInit=!0,n.depthTexture.addEventListener(`dispose`,A)),a.__webglTexture===void 0){a.__webglTexture=e.createTexture(),d.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture),ve(e.TEXTURE_CUBE_MAP,n.depthTexture);let t=m.convert(n.depthTexture.format),r=m.convert(n.depthTexture.type),i;n.depthTexture.format===1026?i=e.DEPTH_COMPONENT24:n.depthTexture.format===1027&&(i=e.DEPTH24_STENCIL8);for(let a=0;a<6;a++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+a,0,i,n.width,n.height,0,t,r,null)}}else M(n.depthTexture,0);let o=a.__webglTexture,s=Pe(n),c=i?e.TEXTURE_CUBE_MAP_POSITIVE_X+r:e.TEXTURE_2D,l=n.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(n.depthTexture.format===1026)Fe(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,l,c,o,0,s):e.framebufferTexture2D(e.FRAMEBUFFER,l,c,o,0);else if(n.depthTexture.format===1027)Fe(n)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,l,c,o,0,s):e.framebufferTexture2D(e.FRAMEBUFFER,l,c,o,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function De(t){let n=f.get(t),r=t.isWebGLCubeRenderTarget===!0;if(n.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(n.__depthDisposeCallback&&n.__depthDisposeCallback(),e){let t=()=>{delete n.__boundDepthTexture,delete n.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),n.__depthDisposeCallback=t}n.__boundDepthTexture=e}if(t.depthTexture&&!n.__autoAllocateDepthBuffer)if(r)for(let e=0;e<6;e++)Ee(n.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?Ee(n.__webglFramebuffer[0],t,0):Ee(n.__webglFramebuffer,t,0)}else if(r){n.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer[r]),n.__webglDepthbuffer[r]===void 0)n.__webglDepthbuffer[r]=e.createRenderbuffer(),Te(n.__webglDepthbuffer[r],t,!1);else{let i=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=n.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,i,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer[0]):d.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer),n.__webglDepthbuffer===void 0)n.__webglDepthbuffer=e.createRenderbuffer(),Te(n.__webglDepthbuffer,t,!1);else{let r=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,i=n.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,r,e.RENDERBUFFER,i)}}d.bindFramebuffer(e.FRAMEBUFFER,null)}function Oe(t,n,r){let i=f.get(t);n!==void 0&&we(i.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),r!==void 0&&De(t)}function ke(t){let n=t.texture,r=f.get(t),i=f.get(n);t.addEventListener(`dispose`,re);let a=t.textures,o=t.isWebGLCubeRenderTarget===!0,s=a.length>1;if(s||(i.__webglTexture===void 0&&(i.__webglTexture=e.createTexture()),i.__version=n.version,h.memory.textures++),o){r.__webglFramebuffer=[];for(let t=0;t<6;t++)if(n.mipmaps&&n.mipmaps.length>0){r.__webglFramebuffer[t]=[];for(let i=0;i<n.mipmaps.length;i++)r.__webglFramebuffer[t][i]=e.createFramebuffer()}else r.__webglFramebuffer[t]=e.createFramebuffer()}else{if(n.mipmaps&&n.mipmaps.length>0){r.__webglFramebuffer=[];for(let t=0;t<n.mipmaps.length;t++)r.__webglFramebuffer[t]=e.createFramebuffer()}else r.__webglFramebuffer=e.createFramebuffer();if(s)for(let t=0,n=a.length;t<n;t++){let n=f.get(a[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),h.memory.textures++)}if(t.samples>0&&Fe(t)===!1){r.__webglMultisampledFramebuffer=e.createFramebuffer(),r.__webglColorRenderbuffer=[],d.bindFramebuffer(e.FRAMEBUFFER,r.__webglMultisampledFramebuffer);for(let n=0;n<a.length;n++){let i=a[n];r.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,r.__webglColorRenderbuffer[n]);let o=m.convert(i.format,i.colorSpace),s=m.convert(i.type),c=k(i.internalFormat,o,s,i.normalized,i.colorSpace,t.isXRRenderTarget===!0),l=Pe(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,r.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(r.__webglDepthRenderbuffer=e.createRenderbuffer(),Te(r.__webglDepthRenderbuffer,t,!0)),d.bindFramebuffer(e.FRAMEBUFFER,null)}}if(o){d.bindTexture(e.TEXTURE_CUBE_MAP,i.__webglTexture),ve(e.TEXTURE_CUBE_MAP,n);for(let i=0;i<6;i++)if(n.mipmaps&&n.mipmaps.length>0)for(let a=0;a<n.mipmaps.length;a++)we(r.__webglFramebuffer[i][a],t,n,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+i,a);else we(r.__webglFramebuffer[i],t,n,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+i,0);E(n)&&D(e.TEXTURE_CUBE_MAP),d.unbindTexture()}else if(s){for(let n=0,i=a.length;n<i;n++){let i=a[n],o=f.get(i),s=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(s=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),d.bindTexture(s,o.__webglTexture),ve(s,i),we(r.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0+n,s,0),E(i)&&D(s)}d.unbindTexture()}else{let a=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(a=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),d.bindTexture(a,i.__webglTexture),ve(a,n),n.mipmaps&&n.mipmaps.length>0)for(let i=0;i<n.mipmaps.length;i++)we(r.__webglFramebuffer[i],t,n,e.COLOR_ATTACHMENT0,a,i);else we(r.__webglFramebuffer,t,n,e.COLOR_ATTACHMENT0,a,0);E(n)&&D(a),d.unbindTexture()}t.depthBuffer&&De(t)}function Ae(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(E(r)){let t=O(e),n=f.get(r).__webglTexture;d.bindTexture(t,n),D(t),d.unbindTexture()}}}let je=[],Me=[];function Ne(t){if(t.samples>0){if(Fe(t)===!1){let n=t.textures,r=t.width,i=t.height,a=e.COLOR_BUFFER_BIT,o=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,s=f.get(t),c=n.length>1;if(c)for(let t=0;t<n.length;t++)d.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),d.bindFramebuffer(e.FRAMEBUFFER,s.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);d.bindFramebuffer(e.READ_FRAMEBUFFER,s.__webglMultisampledFramebuffer);let l=t.texture.mipmaps;l&&l.length>0?d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglFramebuffer[0]):d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglFramebuffer);for(let l=0;l<n.length;l++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(a|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(a|=e.STENCIL_BUFFER_BIT)),c){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,s.__webglColorRenderbuffer[l]);let t=f.get(n[l]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,r,i,0,0,r,i,a,e.NEAREST),_===!0&&(je.length=0,Me.length=0,je.push(e.COLOR_ATTACHMENT0+l),t.depthBuffer&&t.resolveDepthBuffer===!1&&(je.push(o),Me.push(o),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Me)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,je))}if(d.bindFramebuffer(e.READ_FRAMEBUFFER,null),d.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),c)for(let t=0;t<n.length;t++){d.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,s.__webglColorRenderbuffer[t]);let r=f.get(n[t]).__webglTexture;d.bindFramebuffer(e.FRAMEBUFFER,s.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,r,0)}d.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&_){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Pe(e){return Math.min(p.maxSamples,e.samples)}function Fe(e){let n=f.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function N(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Ie(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(U.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&L(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):R(`WebGLTextures: Unsupported texture color space:`,n)),t}function Le(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=ue,this.resetTextureUnits=se,this.getTextureUnits=ce,this.setTextureUnits=le,this.setTexture2D=M,this.setTexture2DArray=fe,this.setTexture3D=pe,this.setTextureCube=me,this.rebindTextures=Oe,this.setupRenderTarget=ke,this.updateRenderTargetMipmap=Ae,this.updateMultisampleRenderTarget=Ne,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=we,this.useMultisampledRTT=Fe,this.isReversedDepthBuffer=function(){return d.buffers.depth.getReversed()}}function cl(e,t){function n(n,r=``){let i,a=U.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===`srgb`)if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491)if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var ll=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ul=`
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

}`,dl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Hi(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ia({vertexShader:ll,fragmentShader:ul,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new yi(new Ji(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},fl=class extends it{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,f=null,p=null,m=null,h=typeof XRWebGLBinding<`u`,_=new dl,v={},y=t.getContextAttributes(),b=null,S=null,C=[],w=[],T=new B,O=null,k=new Ia;k.viewport=new Jt;let te=new Ia;te.viewport=new Jt;let ne=[k,te],A=new Va,re=null,ie=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new An,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new An,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new An,C[e]=t),t.getHandSpace()};function j(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ae(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,ae),r.removeEventListener(`inputsourceschange`,oe);for(let e=0;e<C.length;e++){let t=w[e];t!==null&&(w[e]=null,C[e].disconnect(t))}re=null,ie=null,_.reset();for(let e in v)delete v[e];e.setRenderTarget(b),p=null,f=null,u=null,r=null,S=null,pe.stop(),n.isPresenting=!1,e.setPixelRatio(O),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&L(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return u===null&&h&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(b=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,ae),r.addEventListener(`inputsourceschange`,oe),y.xrCompatible!==!0&&await t.makeXRCompatible(),O=e.getPixelRatio(),e.getSize(T),h&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;y.depth&&(o=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=y.stencil?ee:D,a=y.stencil?x:g);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),f=u.createProjectionLayer(s),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Xt(f.textureWidth,f.textureHeight,{format:E,type:d,depthTexture:new Bi(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new Xt(p.framebufferWidth,p.framebufferHeight,{format:E,type:d,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),pe.setContext(r),pe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function oe(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let se=new V,ce=new V;function le(e,t,n){se.setFromMatrixPosition(t.matrixWorld),ce.setFromMatrixPosition(n.matrixWorld);let r=se.distanceTo(ce),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ue(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),A.near=te.near=k.near=t,A.far=te.far=k.far=n,(re!==A.near||ie!==A.far)&&(r.updateRenderState({depthNear:A.near,depthFar:A.far}),re=A.near,ie=A.far),A.layers.mask=e.layers.mask|6,k.layers.mask=A.layers.mask&-5,te.layers.mask=A.layers.mask&-3;let i=e.parent,a=A.cameras;ue(A,i);for(let e=0;e<a.length;e++)ue(a[e],i);a.length===2?le(A,k,te):A.projectionMatrix.copy(k.projectionMatrix),de(e,A,i)};function de(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=ct*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(!(f===null&&p===null))return s},this.setFoveation=function(e){s=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(A)},this.getCameraTexture=function(e){return v[e]};let M=null;function fe(t,i){if(l=i.getViewerPose(c||a),m=i,l!==null){let t=l.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==A.cameras.length&&(A.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=u.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=ne[n];o===void 0&&(o=new Ia,o.layers.enable(n),o.viewport=new Jt,ne[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(A.matrix.copy(o.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),i===!0&&A.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&h){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&h){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new Hi,v[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=w[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}M&&M(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),m=null}let pe=new io;pe.setAnimationLoop(fe),this.setAnimationLoop=function(e){M=e},this.dispose=function(){}}},pl=new $t,ml=new H;ml.set(-1,0,0,0,1,0,0,0,1);function hl(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,ea(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(pl.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(ml),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function gl(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return R(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return typeof i==`number`||typeof i==`boolean`?r[a]=i:ArrayBuffer.isView(i)?r[a]=i.slice():r[a]=i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?L(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):L(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var _l=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),vl=null;function yl(){return vl===null&&(vl=new Si(_l,16,16,te,v),vl.name=`DFG_LUT`,vl.minFilter=c,vl.magFilter=c,vl.wrapS=r,vl.wrapT=r,vl.generateMipmaps=!1,vl.needsUpdate=!0),vl}var bl=class{constructor(e={}){let{canvas:t=Ze(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:p=!1,outputBufferType:h=d}=e;this.isWebGLRenderer=!0;let _;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);_=n.getContextAttributes().alpha}else _=a;let S=h,C=new Set([A,ne,k]),w=new Set([d,g,m,x,y,b]),T=new Uint32Array(4),E=new Int32Array(4),D=new V,ee=null,O=null,te=[],re=[],ie=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let j=this,ae=!1,oe=null,se=null,ce=null,le=null;this._outputColorSpace=Ve;let ue=0,de=0,M=null,fe=-1,pe=null,me=new Jt,he=new Jt,ge=null,_e=new W(0),ve=0,ye=t.width,be=t.height,xe=1,Se=null,Ce=null,we=new Jt(0,0,ye,be),Te=new Jt(0,0,ye,be),Ee=!1,De=new Ai,Oe=!1,ke=!1,Ae=new $t,je=new V,Me=new Jt,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Pe=!1;function Fe(){return M===null?xe:1}let N=n;function Ie(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:f};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r185`),t.addEventListener(`webglcontextlost`,z,!1),t.addEventListener(`webglcontextrestored`,ut,!1),t.addEventListener(`webglcontextcreationerror`,dt,!1),N===null){let t=`webgl2`;if(N=Ie(t,e),N===null)throw Ie(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw R(`WebGLRenderer: `+e.message),e}let Le,Re,P,ze,F,I,Be,He,Ue,We,Ge,Ke,Je,Ye,Xe,Qe,et,tt,rt,it,at,ot,st;function ct(){Le=new Ro(N),Le.init(),at=new cl(N,Le),Re=new mo(N,Le,e,at),P=new ol(N,Le),Re.reversedDepthBuffer&&p&&P.buffers.depth.setReversed(!0),se=N.createFramebuffer(),ce=N.createFramebuffer(),le=N.createFramebuffer(),ze=new Vo(N),F=new Bc,I=new sl(N,Le,P,F,Re,at,ze),Be=new Lo(j),He=new ao(N),ot=new fo(N,He),Ue=new zo(N,He,ze,ot),We=new Uo(N,Ue,He,ot,ze),tt=new Ho(N,Re,I),Xe=new ho(F),Ge=new zc(j,Be,Le,Re,ot,Xe),Ke=new hl(j,F),Je=new Wc,Ye=new Zc(Le),et=new uo(j,Be,P,We,_,s),Qe=new al(j,We,Re),st=new gl(N,ze,Re,P),rt=new po(N,Le,ze),it=new Bo(N,Le,ze),ze.programs=Ge.programs,j.capabilities=Re,j.extensions=Le,j.properties=F,j.renderLists=Je,j.shadowMap=Qe,j.state=P,j.info=ze}ct(),S!==1009&&(ie=new Go(S,t.width,t.height,o,r,i));let lt=new fl(j,N);this.xr=lt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let e=Le.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Le.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return xe},this.setPixelRatio=function(e){e!==void 0&&(xe=e,this.setSize(ye,be,!1))},this.getSize=function(e){return e.set(ye,be)},this.setSize=function(e,n,r=!0){if(lt.isPresenting){L(`WebGLRenderer: Can't change size while VR device is presenting.`);return}ye=e,be=n,t.width=Math.floor(e*xe),t.height=Math.floor(n*xe),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),ie!==null&&ie.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(ye*xe,be*xe).floor()},this.setDrawingBufferSize=function(e,n,r){ye=e,be=n,xe=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(S===1009){R(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){L(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}ie.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(me)},this.getViewport=function(e){return e.copy(we)},this.setViewport=function(e,t,n,r){e.isVector4?we.set(e.x,e.y,e.z,e.w):we.set(e,t,n,r),P.viewport(me.copy(we).multiplyScalar(xe).round())},this.getScissor=function(e){return e.copy(Te)},this.setScissor=function(e,t,n,r){e.isVector4?Te.set(e.x,e.y,e.z,e.w):Te.set(e,t,n,r),P.scissor(he.copy(Te).multiplyScalar(xe).round())},this.getScissorTest=function(){return Ee},this.setScissorTest=function(e){P.setScissorTest(Ee=e)},this.setOpaqueSort=function(e){Se=e},this.setTransparentSort=function(e){Ce=e},this.getClearColor=function(e){return e.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor(...arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(M!==null){let t=M.texture.format;e=C.has(t)}if(e){let e=M.texture.type,t=w.has(e),n=et.getClearColor(),r=et.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,N.clearBufferuiv(N.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,N.clearBufferiv(N.COLOR,0,E))}else r|=N.COLOR_BUFFER_BIT}t&&(r|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&N.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),oe=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,z,!1),t.removeEventListener(`webglcontextrestored`,ut,!1),t.removeEventListener(`webglcontextcreationerror`,dt,!1),et.dispose(),Je.dispose(),Ye.dispose(),F.dispose(),Be.dispose(),We.dispose(),ot.dispose(),st.dispose(),Ge.dispose(),lt.dispose(),lt.removeEventListener(`sessionstart`,vt),lt.removeEventListener(`sessionend`,yt),bt.stop()};function z(e){e.preventDefault(),$e(`WebGLRenderer: Context Lost.`),ae=!0}function ut(){$e(`WebGLRenderer: Context Restored.`),ae=!1;let e=ze.autoReset,t=Qe.enabled,n=Qe.autoUpdate,r=Qe.needsUpdate,i=Qe.type;ct(),ze.autoReset=e,Qe.enabled=t,Qe.autoUpdate=n,Qe.needsUpdate=r,Qe.type=i}function dt(e){R(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ft(e){let t=e.target;t.removeEventListener(`dispose`,ft),pt(t)}function pt(e){mt(e),F.remove(e)}function mt(e){let t=F.get(e).programs;t!==void 0&&(t.forEach(function(e){Ge.releaseProgram(e)}),e.isShaderMaterial&&Ge.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Ne);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=At(e,t,n,r,i);P.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ue.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;ot.setup(i,r,s,n,c);let h,g=rt;if(c!==null&&(h=He.get(c),g=it,g.setIndex(h)),i.isMesh)r.wireframe===!0?(P.setLineWidth(r.wireframeLinewidth*Fe()),g.setMode(N.LINES)):g.setMode(N.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),P.setLineWidth(e*Fe()),i.isLineSegments?g.setMode(N.LINES):i.isLineLoop?g.setMode(N.LINE_LOOP):g.setMode(N.LINE_STRIP)}else i.isPoints?g.setMode(N.POINTS):i.isSprite&&g.setMode(N.TRIANGLES);if(i.isBatchedMesh)if(Le.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?He.get(c).bytesPerElement:1,o=F.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(N,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ht(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Et(e,t,n),e.side=0,e.needsUpdate=!0,Et(e,t,n),e.side=2):Et(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),O=Ye.get(n),O.init(t),re.push(O),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(O.pushLight(e),e.castShadow&&O.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(O.pushLight(e),e.castShadow&&O.pushShadow(e))}),O.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t)if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];ht(a,n,e),r.add(a)}else ht(t,n,e),r.add(t)}),O=re.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){F.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Le.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let gt=null;function _t(e){gt&&gt(e)}function vt(){bt.stop()}function yt(){bt.start()}let bt=new io;bt.setAnimationLoop(_t),typeof self<`u`&&bt.setContext(self),this.setAnimationLoop=function(e){gt=e,lt.setAnimationLoop(e),e===null?bt.stop():bt.start()},lt.addEventListener(`sessionstart`,vt),lt.addEventListener(`sessionend`,yt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){R(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(ae===!0)return;oe!==null&&oe.renderStart(e,t);let n=lt.enabled===!0&&lt.isPresenting===!0,r=ie!==null&&(M===null||n)&&ie.begin(j,M);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),lt.enabled===!0&&lt.isPresenting===!0&&(ie===null||ie.isCompositing()===!1)&&(lt.cameraAutoUpdate===!0&&lt.updateCamera(t),t=lt.getCamera()),e.isScene===!0&&e.onBeforeRender(j,e,t,M),O=Ye.get(e,re.length),O.init(t),O.state.textureUnits=I.getTextureUnits(),re.push(O),Ae.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),De.setFromProjectionMatrix(Ae,qe,t.reversedDepth),ke=this.localClippingEnabled,Oe=Xe.init(this.clippingPlanes,ke),ee=Je.get(e,te.length),ee.init(),te.push(ee),lt.enabled===!0&&lt.isPresenting===!0){let e=j.xr.getDepthSensingMesh();e!==null&&xt(e,t,-1/0,j.sortObjects)}xt(e,t,0,j.sortObjects),ee.finish(),j.sortObjects===!0&&ee.sort(Se,Ce,t.reversedDepth),Pe=lt.enabled===!1||lt.isPresenting===!1||lt.hasDepthSensing()===!1,Pe&&et.addToRenderList(ee,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Oe===!0&&Xe.beginShadows();let i=O.state.shadowsArray;if(Qe.render(i,e,t),Oe===!0&&Xe.endShadows(),(r&&ie.hasRenderPass())===!1){let n=ee.opaque,r=ee.transmissive;if(O.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Ct(n,r,e,a)}Pe&&et.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];St(ee,e,n,n.viewport)}}else r.length>0&&Ct(n,r,e,t),Pe&&et.render(e),St(ee,e,t)}M!==null&&de===0&&(I.updateMultisampleRenderTarget(M),I.updateRenderTargetMipmap(M)),r&&ie.end(j),e.isScene===!0&&e.onAfterRender(j,e,t),ot.resetDefaultState(),fe=-1,pe=null,re.pop(),re.length>0?(O=re[re.length-1],I.setTextureUnits(O.state.textureUnits),Oe===!0&&Xe.setGlobalState(j.clippingPlanes,O.state.camera)):O=null,te.pop(),ee=te.length>0?te[te.length-1]:null,oe!==null&&oe.renderEnd()};function xt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)O.pushLightProbeGrid(e);else if(e.isLight)O.pushLight(e),e.castShadow&&O.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||De.intersectsSprite(e)){r&&Me.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Ae);let t=We.update(e),i=e.material;i.visible&&ee.push(e,t,i,n,Me.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||De.intersectsObject(e))){let t=We.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),Me.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Me.copy(e.boundingSphere.center)),Me.applyMatrix4(e.matrixWorld).applyMatrix4(Ae)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&ee.push(e,t,s,n,Me.z,o)}}else i.visible&&ee.push(e,t,i,n,Me.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)xt(i[e],t,n,r)}function St(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;O.setupLightsView(n),Oe===!0&&Xe.setGlobalState(j.clippingPlanes,n),r&&P.viewport(me.copy(r)),i.length>0&&wt(i,t,n),a.length>0&&wt(a,t,n),o.length>0&&wt(o,t,n),P.buffers.depth.setTest(!0),P.buffers.depth.setMask(!0),P.buffers.color.setMask(!0),P.setPolygonOffset(!1)}function Ct(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(O.state.transmissionRenderTarget[r.id]===void 0){let e=Le.has(`EXT_color_buffer_half_float`)||Le.has(`EXT_color_buffer_float`);O.state.transmissionRenderTarget[r.id]=new Xt(1,1,{generateMipmaps:!0,type:e?v:d,minFilter:u,samples:Math.max(4,Re.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:U.workingColorSpace})}let a=O.state.transmissionRenderTarget[r.id],o=r.viewport||me;a.setSize(o.z*j.transmissionResolutionScale,o.w*j.transmissionResolutionScale);let s=j.getRenderTarget(),c=j.getActiveCubeFace(),l=j.getActiveMipmapLevel();j.setRenderTarget(a),j.getClearColor(_e),ve=j.getClearAlpha(),ve<1&&j.setClearColor(16777215,.5),j.clear(),Pe&&et.render(n);let f=j.toneMapping;j.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),O.setupLightsView(r),Oe===!0&&Xe.setGlobalState(j.clippingPlanes,r),wt(e,n,r),I.updateMultisampleRenderTarget(a),I.updateRenderTargetMipmap(a),Le.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Tt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(I.updateMultisampleRenderTarget(a),I.updateRenderTargetMipmap(a))}j.setRenderTarget(s,c,l),j.setClearColor(_e,ve),p!==void 0&&(r.viewport=p),j.toneMapping=f}function wt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Tt(o,t,n,s,l,c)}}function Tt(e,t,n,r,i,a){e.onBeforeRender(j,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(j,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,j.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,j.renderBufferDirect(n,t,r,i,e,a),i.side=2):j.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(j,t,n,r,i,a)}function Et(e,t,n){t.isScene!==!0&&(t=Ne);let r=F.get(e),i=O.state.lights,a=O.state.shadowsArray,o=i.state.version,s=Ge.getParameters(e,i.state,a,t,n,O.state.lightProbeGridArray),c=Ge.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Be.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ft),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Ot(e,s),d}else s.uniforms=Ge.getUniforms(e),oe!==null&&e.isNodeMaterial&&oe.build(e,n,s),e.onBeforeCompile(s,j),d=Ge.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Xe.uniform),Ot(e,s),r.needsLights=jt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=O.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Dt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Qs.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Ot(e,t){let n=F.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function kt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function At(e,t,n,r,i){t.isScene!==!0&&(t=Ne),I.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=M===null?j.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:U.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Be.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(h=j.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=F.get(r),y=O.state.lights;if(Oe===!0&&(ke===!0||e!==pe)){let t=e===pe&&r.id===fe;Xe.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Xe.numPlanes||v.numIntersection!==Xe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=O.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Et(r,t,i),oe&&r.isNodeMaterial&&oe.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(P.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==fe&&(fe=r.id,C=!0),v.needsLights){let e=kt(O.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||pe!==e){P.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(N,`projectionMatrix`,e.projectionMatrix),T.setValue(N,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(N,je.setFromMatrixPosition(e.matrixWorld)),Re.logarithmicDepthBuffer&&T.setValue(N,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(N,`isOrthographic`,e.isOrthographicCamera===!0),pe!==e&&(pe=e,C=!0,w=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&T.setValue(N,`directionalShadowMap`,y.state.directionalShadowMap,I),y.state.spotShadowMap.length>0&&T.setValue(N,`spotShadowMap`,y.state.spotShadowMap,I),y.state.pointShadowMap.length>0&&T.setValue(N,`pointShadowMap`,y.state.pointShadowMap,I)),i.isSkinnedMesh){T.setOptional(N,i,`bindMatrix`),T.setOptional(N,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(N,`boneTexture`,e.boneTexture,I))}i.isBatchedMesh&&(T.setOptional(N,i,`batchingTexture`),T.setValue(N,`batchingTexture`,i._matricesTexture,I),T.setOptional(N,i,`batchingIdTexture`),T.setValue(N,`batchingIdTexture`,i._indirectTexture,I),T.setOptional(N,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(N,`batchingColorTexture`,i._colorsTexture,I));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&tt.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(N,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=yl()),C){if(T.setValue(N,`toneMappingExposure`,j.toneMappingExposure),v.needsLights&&B(E,w),a&&r.fog===!0&&Ke.refreshFogUniforms(E,a),Ke.refreshMaterialUniforms(E,r,xe,be,O.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}Qs.upload(N,Dt(v),E,I)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Qs.upload(N,Dt(v),E,I),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(N,`center`,i.center),T.setValue(N,`modelViewMatrix`,i.modelViewMatrix),T.setValue(N,`normalMatrix`,i.normalMatrix),T.setValue(N,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];st.update(n,x),st.bind(n,x)}}return x}function B(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function jt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ue},this.getActiveMipmapLevel=function(){return de},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(e,t,n){let r=F.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),F.get(e.texture).__webglTexture=t,F.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=F.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){M=e,ue=t,de=n;let r=null,i=!1,a=!1;if(e){let o=F.get(e);if(o.__useDefaultFramebuffer!==void 0){P.bindFramebuffer(N.FRAMEBUFFER,o.__webglFramebuffer),me.copy(e.viewport),he.copy(e.scissor),ge=e.scissorTest,P.viewport(me),P.scissor(he),P.setScissorTest(ge),fe=-1;return}else if(o.__webglFramebuffer===void 0)I.setupRenderTarget(e);else if(o.__hasExternalTextures)I.rebindTextures(e,F.get(e.texture).__webglTexture,F.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&F.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);I.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=F.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&I.useMultisampledRTT(e)===!1?F.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,me.copy(e.viewport),he.copy(e.scissor),ge=e.scissorTest}else me.copy(we).multiplyScalar(xe).floor(),he.copy(Te).multiplyScalar(xe).floor(),ge=Ee;if(n!==0&&(r=se),P.bindFramebuffer(N.FRAMEBUFFER,r)&&P.drawBuffers(e,r),P.viewport(me),P.scissor(he),P.setScissorTest(ge),i){let r=F.get(e.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=F.get(e.textures[t]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=F.get(e.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,t.__webglTexture,n)}fe=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=F.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){P.bindFramebuffer(N.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+s),!Re.textureFormatReadable(c)){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!Re.textureTypeReadable(l)){R(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&N.readPixels(t,n,r,i,at.convert(c),at.convert(l),a)}finally{let e=M===null?null:F.get(M).__webglFramebuffer;P.bindFramebuffer(N.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=F.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c)if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){P.bindFramebuffer(N.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+s),!Re.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!Re.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,d),N.bufferData(N.PIXEL_PACK_BUFFER,a.byteLength,N.STREAM_READ),N.readPixels(t,n,r,i,at.convert(l),at.convert(u),0);let f=M===null?null:F.get(M).__webglFramebuffer;P.bindFramebuffer(N.FRAMEBUFFER,f);let p=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await nt(N,p,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,d),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,a),N.deleteBuffer(d),N.deleteSync(p),a}else throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;I.setTexture2D(e,0),N.copyTexSubImage2D(N.TEXTURE_2D,n,0,0,o,s,i,a),P.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=at.convert(t.format),_=at.convert(t.type),v;t.isData3DTexture?(I.setTexture3D(t,0),v=N.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(I.setTexture2DArray(t,0),v=N.TEXTURE_2D_ARRAY):(I.setTexture2D(t,0),v=N.TEXTURE_2D),P.activeTexture(N.TEXTURE0),P.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,t.flipY),P.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),P.pixelStorei(N.UNPACK_ALIGNMENT,t.unpackAlignment);let y=P.getParameter(N.UNPACK_ROW_LENGTH),b=P.getParameter(N.UNPACK_IMAGE_HEIGHT),x=P.getParameter(N.UNPACK_SKIP_PIXELS),S=P.getParameter(N.UNPACK_SKIP_ROWS),C=P.getParameter(N.UNPACK_SKIP_IMAGES);P.pixelStorei(N.UNPACK_ROW_LENGTH,h.width),P.pixelStorei(N.UNPACK_IMAGE_HEIGHT,h.height),P.pixelStorei(N.UNPACK_SKIP_PIXELS,l),P.pixelStorei(N.UNPACK_SKIP_ROWS,u),P.pixelStorei(N.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=F.get(e),r=F.get(t),h=F.get(n.__renderTarget),g=F.get(r.__renderTarget);P.bindFramebuffer(N.READ_FRAMEBUFFER,h.__webglFramebuffer),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,F.get(e).__webglTexture,i,d+n),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,F.get(t).__webglTexture,a,m+n)),N.blitFramebuffer(l,u,o,s,f,p,o,s,N.DEPTH_BUFFER_BIT,N.NEAREST);P.bindFramebuffer(N.READ_FRAMEBUFFER,null),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||F.has(e)){let n=F.get(e),r=F.get(t);P.bindFramebuffer(N.READ_FRAMEBUFFER,ce),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,le);for(let e=0;e<c;e++)w?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,n.__webglTexture,i),T?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,r.__webglTexture,a),i===0?T?N.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):N.copyTexSubImage2D(v,a,f,p,l,u,o,s):N.blitFramebuffer(l,u,o,s,f,p,o,s,N.COLOR_BUFFER_BIT,N.NEAREST);P.bindFramebuffer(N.READ_FRAMEBUFFER,null),P.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?N.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?N.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):N.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):N.texSubImage2D(N.TEXTURE_2D,a,f,p,o,s,g,_,h);P.pixelStorei(N.UNPACK_ROW_LENGTH,y),P.pixelStorei(N.UNPACK_IMAGE_HEIGHT,b),P.pixelStorei(N.UNPACK_SKIP_PIXELS,x),P.pixelStorei(N.UNPACK_SKIP_ROWS,S),P.pixelStorei(N.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&N.generateMipmap(v),P.unbindTexture()},this.initRenderTarget=function(e){F.get(e).__webglFramebuffer===void 0&&I.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?I.setTextureCube(e,0):e.isData3DTexture?I.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?I.setTexture2DArray(e,0):I.setTexture2D(e,0),P.unbindTexture()},this.resetState=function(){ue=0,de=0,M=null,P.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return qe}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=U._getDrawingBufferColorSpace(e),t.unpackColorSpace=U._getUnpackColorSpace()}},xl={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`},Sl=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},Cl=new La(-1,1,1,-1,0,1),wl=new class extends jr{constructor(){super(),this.setAttribute(`position`,new yr([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new yr([0,2,0,0,2,0],2))}},Tl=class{constructor(e){this._mesh=new yi(wl,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Cl)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},El=class extends Sl{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof ia?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ta.clone(e.uniforms),this.material=new ia({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Tl(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Dl=class extends Sl{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},Ol=class extends Sl{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},kl=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new B);this._width=n.width,this._height=n.height,t=new Xt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:v}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new El(xl),this.copyPass.material.blending=0,this.timer=new Ha}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Dl!==void 0&&(r instanceof Dl?n=!0:r instanceof Ol&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new B);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Al=class extends Sl{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new W}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},jl={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new W(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`},Ml=class e extends Sl{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new B(256,256):new B(e.x,e.y),this.clearColor=new W(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Xt(i,a,{type:v}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new Xt(i,a,{type:v});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new Xt(i,a,{type:v});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=jl;this.highPassUniforms=ta.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ia({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new B(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new V(1,1,1),new V(1,1,1),new V(1,1,1),new V(1,1,1),new V(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ta.clone(xl.uniforms),this.blendMaterial=new ia({uniforms:this.copyUniforms,vertexShader:xl.vertexShader,fragmentShader:xl.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new W,this._oldClearAlpha=1,this._basic=new si,this._fsQuad=new Tl(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new B(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new ia({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new B(.5,.5)},direction:{value:new B(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new ia({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};Ml.BlurDirectionX=new B(1,0),Ml.BlurDirectionY=new B(0,1);var Nl={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`},Pl=class extends Sl{constructor(){super(),this.isOutputPass=!0,this.uniforms=ta.clone(Nl.uniforms),this.material=new aa({name:Nl.name,uniforms:this.uniforms,vertexShader:Nl.vertexShader,fragmentShader:Nl.fragmentShader}),this._fsQuad=new Tl(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},U.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Fl={id:`duskblade`,name:`The Duskblade`,blurb:`Glass honed to a killing edge. Strikes, shatters, and turns broken facets into fuel — a versatile climber for any night.`,hue:225,art:`flare`,maxHp:72,energy:3,handSize:5,potionSlots:3,startDeck:[`strike`,`strike`,`strike`,`strike`,`defend`,`defend`,`defend`,`eclipseSlash`,`chisel`,`firstSpark`],startRelic:`emberHeart`,startGold:99},Il=[{name:`The Ashen Woods`,boss:`rootheart`,bossName:`The Rootheart`,theme:{sky:791568,fog:1254426,particles:16752717,glow:6750110,accent:`#7ddb8f`,ember:`#ff9a4d`}},{name:`The Sunken City`,boss:`leviathan`,bossName:`Leviathan's Maw`,theme:{sky:529440,fog:860723,particles:5499135,glow:3127551,accent:`#5fd6e8`,ember:`#53e8ff`}},{name:`The Obsidian Spire`,boss:`sovereign`,bossName:`The Eternal Sovereign`,theme:{sky:1182238,fog:1970736,particles:12745727,glow:16732120,accent:`#c99aff`,ember:`#ff6fe0`}}],Ll={strike:{name:`Edge`,type:`attack`,rarity:`starter`,cost:1,target:`enemy`,text:`Deal @6@ damage.`,effects:[{kind:`dmg`,n:6}],up:{text:`Deal @9@ damage.`,effects:[{kind:`dmg`,n:9}]}},defend:{name:`Ward`,type:`skill`,rarity:`starter`,cost:1,target:`self`,text:`Gain #5# Ward.`,effects:[{kind:`block`,n:5}],up:{text:`Gain #8# Ward.`,effects:[{kind:`block`,n:8}]}},eclipseSlash:{name:`Eclipse Slash`,type:`attack`,rarity:`starter`,cost:1,target:`enemy`,text:`Deal @7@ damage. Apply 1 Cracked.`,effects:[{kind:`dmg`,n:7},{kind:`status`,who:`target`,id:`vulnerable`,n:1}],up:{text:`Deal @9@ damage. Apply 2 Cracked.`,effects:[{kind:`dmg`,n:9},{kind:`status`,who:`target`,id:`vulnerable`,n:2}]}},chisel:{name:`Chisel`,type:`attack`,rarity:`starter`,cost:1,target:`enemy`,chip:1,text:`Deal @4@ damage. Chip 1 extra Facet.`,effects:[{kind:`dmg`,n:4}],up:{text:`Deal @7@ damage. Chip 1 extra Facet.`,effects:[{kind:`dmg`,n:7}]}},firstSpark:{name:`First Spark`,type:`skill`,rarity:`starter`,cost:0,target:`self`,text:`Draw 1 card. Kindle.`,exhaust:!0,effects:[{kind:`draw`,n:1}],up:{text:`Draw 2 cards. Kindle.`,effects:[{kind:`draw`,n:2}]}},ashBite:{name:`Ashbite`,type:`attack`,rarity:`starter`,cost:1,target:`enemy`,text:`Deal @5@ damage. Apply 2 Smolder.`,effects:[{kind:`dmg`,n:5},{kind:`status`,who:`target`,id:`poison`,n:2}],up:{text:`Deal @7@ damage. Apply 3 Smolder.`,effects:[{kind:`dmg`,n:7},{kind:`status`,who:`target`,id:`poison`,n:3}]}},smother:{name:`Smother`,type:`skill`,rarity:`starter`,cost:1,target:`enemy`,text:`Gain #5# Ward. Apply 2 Smolder.`,effects:[{kind:`block`,n:5},{kind:`status`,who:`target`,id:`poison`,n:2}],up:{text:`Gain #8# Ward. Apply 3 Smolder.`,effects:[{kind:`block`,n:8},{kind:`status`,who:`target`,id:`poison`,n:3}]}},twinFangs:{name:`Twin Shards`,type:`attack`,rarity:`common`,cost:1,target:`enemy`,text:`Deal @4@ damage twice.`,effects:[{kind:`dmg`,n:4,times:2}],up:{text:`Deal @6@ damage twice.`,effects:[{kind:`dmg`,n:6,times:2}]}},quickSlash:{name:`Flicker`,type:`attack`,rarity:`common`,cost:0,target:`enemy`,text:`Deal @4@ damage. Draw 1 card.`,effects:[{kind:`dmg`,n:4},{kind:`draw`,n:1}],up:{text:`Deal @6@ damage. Draw 1 card.`,effects:[{kind:`dmg`,n:6},{kind:`draw`,n:1}]}},heavyBlow:{name:`Quarry Maul`,type:`attack`,rarity:`common`,cost:2,target:`enemy`,chip:1,text:`Deal @12@ damage. Chip 1 extra Facet.`,effects:[{kind:`dmg`,n:12}],up:{text:`Deal @16@ damage. Chip 2 extra Facets.`,chip:2,effects:[{kind:`dmg`,n:16}]}},cleave:{name:`Fan of Glass`,type:`attack`,rarity:`common`,cost:1,target:`allEnemies`,text:`Deal @6@ damage to ALL enemies.`,effects:[{kind:`dmg`,n:6}],up:{text:`Deal @9@ damage to ALL enemies.`,effects:[{kind:`dmg`,n:9}]}},venomStrike:{name:`Emberbite`,type:`attack`,rarity:`common`,cost:1,target:`enemy`,text:`Deal @4@ damage. Apply 3 Smolder.`,effects:[{kind:`dmg`,n:4},{kind:`status`,who:`target`,id:`poison`,n:3}],up:{text:`Deal @6@ damage. Apply 4 Smolder.`,effects:[{kind:`dmg`,n:6},{kind:`status`,who:`target`,id:`poison`,n:4}]}},lunge:{name:`Dimming Cut`,type:`attack`,rarity:`common`,cost:1,target:`enemy`,text:`Deal @6@ damage. Apply 1 Dimmed.`,effects:[{kind:`dmg`,n:6},{kind:`status`,who:`target`,id:`weak`,n:1}],up:{text:`Deal @9@ damage. Apply 2 Dimmed.`,effects:[{kind:`dmg`,n:9},{kind:`status`,who:`target`,id:`weak`,n:2}]}},guardedStrike:{name:`Warden's Edge`,type:`attack`,rarity:`common`,cost:1,target:`enemy`,text:`Deal @5@ damage. Gain #4# Ward.`,effects:[{kind:`dmg`,n:5},{kind:`block`,n:4}],up:{text:`Deal @7@ damage. Gain #6# Ward.`,effects:[{kind:`dmg`,n:7},{kind:`block`,n:6}]}},brace:{name:`Held Light`,type:`skill`,rarity:`common`,cost:1,target:`self`,text:`Gain #8# Ward.`,effects:[{kind:`block`,n:8}],up:{text:`Gain #11# Ward.`,effects:[{kind:`block`,n:11}]}},sidestep:{name:`Glasstep`,type:`skill`,rarity:`common`,cost:0,target:`self`,text:`Gain #3# Ward. Draw 1 card.`,effects:[{kind:`block`,n:3},{kind:`draw`,n:1}],up:{text:`Gain #5# Ward. Draw 1 card.`,effects:[{kind:`block`,n:5},{kind:`draw`,n:1}]}},preparation:{name:`Tinder`,type:`skill`,rarity:`common`,cost:0,target:`self`,text:`Draw 2 cards. Kindle.`,exhaust:!0,effects:[{kind:`draw`,n:2}],up:{text:`Draw 2 cards.`,exhaust:!1,effects:[{kind:`draw`,n:2}]}},deflect:{name:`Refract`,type:`skill`,rarity:`common`,cost:1,target:`self`,text:`Gain #6# Ward. Draw 1 card.`,effects:[{kind:`block`,n:6},{kind:`draw`,n:1}],up:{text:`Gain #9# Ward. Draw 1 card.`,effects:[{kind:`block`,n:9},{kind:`draw`,n:1}]}},leechBlade:{name:`Thirsting Shard`,type:`attack`,rarity:`uncommon`,cost:2,target:`enemy`,text:`Deal @9@ damage. Heal for half the unblocked damage.`,effects:[{kind:`special`,id:`leech`,n:9}],up:{text:`Deal @13@ damage. Heal for half the unblocked damage.`,effects:[{kind:`special`,id:`leech`,n:13}]}},tempest:{name:`Hailglass`,type:`attack`,rarity:`uncommon`,cost:2,target:`allEnemies`,text:`Deal @4@ damage to ALL enemies twice.`,effects:[{kind:`dmg`,n:4,times:2}],up:{text:`Deal @6@ damage to ALL enemies twice.`,effects:[{kind:`dmg`,n:6,times:2}]}},uppercut:{name:`Ringing Blow`,type:`attack`,rarity:`uncommon`,cost:2,target:`enemy`,chip:1,text:`Deal @10@ damage. Chip 1 extra Facet. Apply 1 Dimmed.`,effects:[{kind:`dmg`,n:10},{kind:`status`,who:`target`,id:`weak`,n:1}],up:{text:`Deal @13@ damage. Chip 2 extra Facets. Apply 2 Dimmed.`,chip:2,effects:[{kind:`dmg`,n:13},{kind:`status`,who:`target`,id:`weak`,n:2}]}},flurry:{name:`Splinterstorm`,type:`attack`,rarity:`uncommon`,cost:1,target:`enemy`,text:`Deal @2@ damage 3 times.`,effects:[{kind:`dmg`,n:2,times:3}],up:{text:`Deal @3@ damage 3 times.`,effects:[{kind:`dmg`,n:3,times:3}]}},executioner:{name:`Faultline`,type:`attack`,rarity:`uncommon`,cost:1,target:`enemy`,text:`Deal @8@ damage. Cracked enemies take 6 more.`,effects:[{kind:`special`,id:`execute`,n:8,bonus:6}],up:{text:`Deal @11@ damage. Cracked enemies take 8 more.`,effects:[{kind:`special`,id:`execute`,n:11,bonus:8}]}},momentum:{name:`Honing Edge`,type:`attack`,rarity:`uncommon`,cost:1,target:`enemy`,text:`Deal @6@ damage. Each play, this card gains +4 damage this combat.`,effects:[{kind:`special`,id:`momentum`,n:6,grow:4}],up:{text:`Deal @8@ damage. Each play, this card gains +6 damage this combat.`,effects:[{kind:`special`,id:`momentum`,n:8,grow:6}]}},bulwark:{name:`Glasswall`,type:`skill`,rarity:`uncommon`,cost:2,target:`self`,text:`Gain #13# Ward.`,effects:[{kind:`block`,n:13}],up:{text:`Gain #18# Ward.`,effects:[{kind:`block`,n:18}]}},surge:{name:`Struck Match`,type:`skill`,rarity:`uncommon`,cost:0,target:`self`,text:`Gain 1 Energy. Draw 1 card. Kindle.`,exhaust:!0,effects:[{kind:`energy`,n:1},{kind:`draw`,n:1}],up:{text:`Gain 2 Energy. Draw 1 card. Kindle.`,effects:[{kind:`energy`,n:2},{kind:`draw`,n:1}]}},toxicMist:{name:`Ashcloud`,type:`skill`,rarity:`uncommon`,cost:1,target:`allEnemies`,text:`Apply 3 Smolder to ALL enemies.`,effects:[{kind:`status`,who:`allEnemies`,id:`poison`,n:3}],up:{text:`Apply 5 Smolder to ALL enemies.`,effects:[{kind:`status`,who:`allEnemies`,id:`poison`,n:5}]}},cripple:{name:`Gutter`,type:`skill`,rarity:`uncommon`,cost:1,target:`enemy`,text:`Snuff an enemy's fire: it loses 2 Fervor. Kindle.`,exhaust:!0,effects:[{kind:`status`,who:`target`,id:`str`,n:-2}],up:{text:`Snuff an enemy's fire: it loses 3 Fervor. Kindle.`,effects:[{kind:`status`,who:`target`,id:`str`,n:-3}]}},warCry:{name:`Shatterhymn`,type:`skill`,rarity:`uncommon`,cost:1,target:`allEnemies`,text:`Apply 1 Dimmed and 1 Cracked to ALL enemies.`,effects:[{kind:`status`,who:`allEnemies`,id:`weak`,n:1},{kind:`status`,who:`allEnemies`,id:`vulnerable`,n:1}],up:{text:`Apply 2 Dimmed and 2 Cracked to ALL enemies.`,effects:[{kind:`status`,who:`allEnemies`,id:`weak`,n:2},{kind:`status`,who:`allEnemies`,id:`vulnerable`,n:2}]}},fortify:{name:`Mirrorlight`,type:`skill`,rarity:`uncommon`,cost:2,target:`self`,text:`Double your Ward.`,effects:[{kind:`special`,id:`doubleBlock`}],up:{cost:1,text:`Double your Ward.`}},bloodRite:{name:`Blood for Oil`,type:`skill`,rarity:`uncommon`,cost:0,target:`self`,text:`Lose 3 HP. Gain 2 Energy.`,effects:[{kind:`loseHp`,n:3},{kind:`energy`,n:2}],up:{text:`Lose 3 HP. Gain 3 Energy.`,effects:[{kind:`loseHp`,n:3},{kind:`energy`,n:3}]}},empower:{name:`Inner Blaze`,type:`power`,rarity:`uncommon`,cost:1,target:`self`,text:`Gain 2 Fervor.`,effects:[{kind:`status`,who:`self`,id:`str`,n:2}],up:{text:`Gain 3 Fervor.`,effects:[{kind:`status`,who:`self`,id:`str`,n:3}]}},agility:{name:`Glazier's Poise`,type:`power`,rarity:`uncommon`,cost:1,target:`self`,text:`Gain 2 Poise.`,effects:[{kind:`status`,who:`self`,id:`dex`,n:2}],up:{text:`Gain 3 Poise.`,effects:[{kind:`status`,who:`self`,id:`dex`,n:3}]}},ironSkin:{name:`Vitrify`,type:`power`,rarity:`uncommon`,cost:1,target:`self`,text:`At the end of your turn, gain 3 Ward.`,effects:[{kind:`status`,who:`self`,id:`metallicize`,n:3}],up:{text:`At the end of your turn, gain 4 Ward.`,effects:[{kind:`status`,who:`self`,id:`metallicize`,n:4}]}},regrowth:{name:`Hearthglow`,type:`power`,rarity:`uncommon`,cost:1,target:`self`,text:`At the end of your turn, heal 2 HP.`,effects:[{kind:`status`,who:`self`,id:`regen`,n:2}],up:{text:`At the end of your turn, heal 3 HP.`,effects:[{kind:`status`,who:`self`,id:`regen`,n:3}]}},oblivionStrike:{name:`Bellstrike`,type:`attack`,rarity:`rare`,cost:3,target:`enemy`,chip:2,text:`Deal @30@ damage. Chip 2 extra Facets.`,effects:[{kind:`dmg`,n:30}],up:{text:`Deal @40@ damage. Chip 3 extra Facets.`,chip:3,effects:[{kind:`dmg`,n:40}]}},phantomBlades:{name:`Phantom Blades`,type:`attack`,rarity:`rare`,cost:1,target:`enemy`,text:`Deal @3@ damage for each card in your hand.`,effects:[{kind:`special`,id:`phantom`,n:3}],up:{text:`Deal @4@ damage for each card in your hand.`,effects:[{kind:`special`,id:`phantom`,n:4}]}},devour:{name:`Eat the Flame`,type:`attack`,rarity:`rare`,cost:1,target:`enemy`,text:`Deal @10@ damage. If this kills, swallow its fire: gain 3 Embers and heal 4. Kindle.`,exhaust:!0,effects:[{kind:`special`,id:`devour`,n:10,embers:3,heal:4}],up:{text:`Deal @13@ damage. If this kills, swallow its fire: gain 4 Embers and heal 6. Kindle.`,effects:[{kind:`special`,id:`devour`,n:13,embers:4,heal:6}]}},annihilate:{name:`Requiem`,type:`attack`,rarity:`rare`,cost:2,target:`allEnemies`,text:`Deal @9@ damage and apply 3 Smolder to ALL enemies.`,effects:[{kind:`dmg`,n:9},{kind:`status`,who:`allEnemies`,id:`poison`,n:3}],up:{text:`Deal @12@ damage and apply 4 Smolder to ALL enemies.`,effects:[{kind:`dmg`,n:12},{kind:`status`,who:`allEnemies`,id:`poison`,n:4}]}},aegis:{name:`Cathedral Glass`,type:`skill`,rarity:`rare`,cost:2,target:`self`,text:`Gain #30# Ward. Kindle.`,exhaust:!0,effects:[{kind:`block`,n:30}],up:{text:`Gain #40# Ward. Kindle.`,effects:[{kind:`block`,n:40}]}},offering:{name:`Pyre Tithe`,type:`skill`,rarity:`rare`,cost:1,target:`self`,text:`Burn every other card in your hand — each feeds the lantern. Draw 3 cards. Kindle.`,exhaust:!0,effects:[{kind:`special`,id:`pyreTithe`,draw:3}],up:{text:`Burn every other card in your hand — each feeds the lantern. Draw 4 cards. Kindle.`,effects:[{kind:`special`,id:`pyreTithe`,draw:4}]}},limitBreak:{name:`Annealing Rite`,type:`skill`,rarity:`rare`,cost:1,target:`allEnemies`,text:`Chip 2 Facets of every enemy. Kindle.`,exhaust:!0,effects:[{kind:`chip`,n:2}],up:{text:`Chip 3 Facets of every enemy. Kindle.`,effects:[{kind:`chip`,n:3}]}},catalyst:{name:`Bellows`,type:`skill`,rarity:`rare`,cost:1,target:`enemy`,text:`Double an enemy's Smolder. Kindle.`,exhaust:!0,effects:[{kind:`special`,id:`catalyst`,n:2}],up:{text:`Triple an enemy's Smolder. Kindle.`,effects:[{kind:`special`,id:`catalyst`,n:3}]}},ascension:{name:`Rising Litany`,type:`power`,rarity:`rare`,cost:3,target:`self`,text:`At the start of each turn, gain 2 Fervor.`,effects:[{kind:`status`,who:`self`,id:`ritual`,n:2}],up:{text:`At the start of each turn, gain 3 Fervor.`,effects:[{kind:`status`,who:`self`,id:`ritual`,n:3}]}},bastion:{name:`Anneal`,type:`power`,rarity:`rare`,cost:3,target:`self`,text:`Ward no longer expires at the start of your turn.`,effects:[{kind:`status`,who:`self`,id:`barricade`,n:1}],up:{cost:2}},frenzy:{name:`Overglow`,type:`power`,rarity:`rare`,cost:2,target:`self`,text:`Your glass runs too hot: gain 2 Cracked. At the start of each turn, gain 1 Energy.`,effects:[{kind:`status`,who:`self`,id:`vulnerable`,n:2},{kind:`status`,who:`self`,id:`energized`,n:1}],up:{text:`Your glass runs too hot: gain 1 Cracked. At the start of each turn, gain 1 Energy.`,effects:[{kind:`status`,who:`self`,id:`vulnerable`,n:1},{kind:`status`,who:`self`,id:`energized`,n:1}]}},virulence:{name:`Emberfang`,type:`power`,rarity:`rare`,cost:2,target:`self`,text:`Whenever you play an Attack, apply 1 Smolder to the enemy.`,effects:[{kind:`status`,who:`self`,id:`venomous`,n:1}],up:{cost:1}},quakeblow:{name:`Quakeblow`,type:`attack`,rarity:`uncommon`,cost:2,target:`enemy`,chip:2,locked:`paneBreaker`,text:`Deal @8@ damage. Chip 2 extra Facets.`,effects:[{kind:`dmg`,n:8}],up:{text:`Deal @11@ damage. Chip 3 extra Facets.`,chip:3,effects:[{kind:`dmg`,n:11}]}},resonantLance:{name:`Resonant Lance`,type:`attack`,rarity:`rare`,cost:1,target:`enemy`,locked:`paneBreaker`,text:`Deal @7@ damage. Deals double to Staggered or Cracked glass.`,effects:[{kind:`special`,id:`shatterEcho`,n:7}],up:{text:`Deal @10@ damage. Deals double to Staggered or Cracked glass.`,effects:[{kind:`special`,id:`shatterEcho`,n:10}]}},tithe:{name:`Tithe of Panes`,type:`skill`,rarity:`uncommon`,cost:1,target:`self`,locked:`lanternFed`,text:`Gain 2 Embers. Draw 1 card.`,effects:[{kind:`ember`,n:2},{kind:`draw`,n:1}],up:{text:`Gain 3 Embers. Draw 1 card.`,effects:[{kind:`ember`,n:3},{kind:`draw`,n:1}]}},pyreheart:{name:`Pyreheart`,type:`power`,rarity:`rare`,cost:2,target:`self`,locked:`lanternFed`,text:`At the start of each turn, gain 1 Ember.`,effects:[{kind:`status`,who:`self`,id:`emberflow`,n:1}],up:{cost:1}},ashenChoir:{name:`Ashen Choir`,type:`skill`,rarity:`uncommon`,cost:1,target:`enemy`,locked:`ashSermon`,text:`Apply 4 Smolder. When smoldering glass dies, its fire leaps on.`,effects:[{kind:`status`,who:`target`,id:`poison`,n:4}],up:{text:`Apply 6 Smolder. When smoldering glass dies, its fire leaps on.`,effects:[{kind:`status`,who:`target`,id:`poison`,n:6}]}},flawlessForm:{name:`Flawless Form`,type:`skill`,rarity:`rare`,cost:1,target:`self`,locked:`untouched`,text:`Gain #8# Ward. If your glass is untouched this combat, gain #8# more.`,effects:[{kind:`special`,id:`flawless`,n:8}],up:{text:`Gain #11# Ward. If your glass is untouched this combat, gain #11# more.`,effects:[{kind:`special`,id:`flawless`,n:11}]}},nightSight:{name:`Night Sight`,type:`power`,rarity:`uncommon`,cost:1,target:`self`,locked:`darkWalker`,text:`At the start of each turn, draw 1 extra card.`,effects:[{kind:`status`,who:`self`,id:`nightsight`,n:1}],up:{cost:0}},novaflare:{name:`Novaflare`,type:`attack`,rarity:`rare`,cost:2,target:`enemy`,locked:`spendthrift`,text:`Deal @3@ damage for every Ember in your lantern.`,effects:[{kind:`special`,id:`emberNova`,n:3}],up:{text:`Deal @4@ damage for every Ember in your lantern.`,effects:[{kind:`special`,id:`emberNova`,n:4}]}},emberdance:{name:`Emberdance`,type:`skill`,rarity:`uncommon`,cost:0,target:`self`,locked:`spendthrift`,text:`Spill your lantern: gain 3 Ward for each Ember spent. Kindle.`,exhaust:!0,effects:[{kind:`special`,id:`emberdance`,n:3}],up:{text:`Spill your lantern: gain 4 Ward for each Ember spent. Kindle.`,effects:[{kind:`special`,id:`emberdance`,n:4}]}},shardstorm:{name:`Shardstorm`,type:`attack`,rarity:`rare`,cost:3,target:`allEnemies`,locked:`hundredShards`,text:`Deal @5@ damage to ALL enemies twice.`,effects:[{kind:`dmg`,n:5,times:2}],up:{text:`Deal @7@ damage to ALL enemies twice.`,effects:[{kind:`dmg`,n:7,times:2}]}},wound:{name:`Shard`,type:`status`,rarity:`special`,cost:null,target:`none`,text:`Unplayable. Broken glass rattling in your deck.`,unplayable:!0,effects:[]},burn:{name:`Cinder`,type:`status`,rarity:`special`,cost:null,target:`none`,text:`Unplayable. At the end of your turn, take 2 damage if this is in your hand.`,unplayable:!0,endTurnDmg:2,effects:[]},hex:{name:`Hex`,type:`curse`,rarity:`special`,cost:null,target:`none`,text:`Unplayable. At the end of your turn, lose 1 HP if this is in your hand. Refuses the fire.`,unplayable:!0,endTurnLoseHp:1,effects:[]}},Rl=(()=>{let e={common:[],uncommon:[],rare:[]};for(let[t,n]of Object.entries(Ll))e[n.rarity]&&!n.locked&&e[n.rarity].push(t);return e})(),zl={str:{name:`Fervor`,icon:`⚔`,kind:`buff`,desc:`The inner fire stoked: attacks deal +N damage.`},dex:{name:`Poise`,icon:`🛡`,kind:`buff`,desc:`Ward cards grant +N Ward.`},vulnerable:{name:`Cracked`,icon:`◎`,kind:`debuff`,desc:`The glass is scored: takes 50% more attack damage. Wears off each turn.`},weak:{name:`Dimmed`,icon:`↓`,kind:`debuff`,desc:`The fire gutters: deals 25% less attack damage. Wears off each turn.`},frail:{name:`Brittle`,icon:`✖`,kind:`debuff`,desc:`Ward gained reduced 25%. Wears off each turn.`},poison:{name:`Smolder`,icon:`☠`,kind:`debuff`,desc:`Burns from within: loses N HP at the start of its turn, then Smolder falls by 1. When smoldering glass shatters or dies, the Smolder leaps to another enemy.`},thorns:{name:`Splinters`,icon:`❈`,kind:`buff`,desc:`Attackers take N damage back.`},ritual:{name:`Litany`,icon:`☽`,kind:`buff`,desc:`Gains N Fervor at the start of each turn.`},metallicize:{name:`Vitrified`,icon:`⬡`,kind:`buff`,desc:`Gains N Ward at the end of each turn.`},regen:{name:`Warmth`,icon:`❋`,kind:`buff`,desc:`Heals N HP at the end of each turn.`},barricade:{name:`Annealed`,icon:`☗`,kind:`buff`,desc:`Ward no longer expires.`},energized:{name:`Alight`,icon:`✦`,kind:`buff`,desc:`Gain N extra Energy at the start of each turn.`},venomous:{name:`Emberfang`,icon:`☠`,kind:`buff`,desc:`Attacks apply N Smolder.`},rampage:{name:`Crescendo`,icon:`⤴`,kind:`buff`,desc:`Attack grows stronger with each use.`},beacon:{name:`Beacon`,icon:`☀`,kind:`buff`,desc:`Attacks chip N extra Facet(s). Fades at end of turn.`},emberflow:{name:`Pyreheart`,icon:`♥`,kind:`buff`,desc:`Gain N Ember(s) at the start of each turn.`},nightsight:{name:`Night Sight`,icon:`☾`,kind:`buff`,desc:`Draw N extra card(s) at the start of each turn.`}},Bl={emberHeart:{name:`Emberheart`,rarity:`starter`,glyph:`♥`,tone:`#ff5964`,text:`At the end of combat, heal 6 HP.`},ashenCore:{name:`Ashen Core`,rarity:`starter`,glyph:`☁`,tone:`#d3a15a`,text:`Enemies begin each combat with 3 Smolder.`},basaltIdol:{name:`Basalt Idol`,rarity:`common`,glyph:`☗`,tone:`#9aa7b8`,text:`Begin each combat with 10 Ward.`},warFetish:{name:`War Fetish`,rarity:`common`,glyph:`⚔`,tone:`#ff8c5a`,text:`Begin each combat with 1 Fervor.`},riverPearl:{name:`River Pearl`,rarity:`common`,glyph:`◉`,tone:`#6fd6e8`,text:`Begin each combat with 1 Poise.`},travelersPack:{name:`Traveler's Pack`,rarity:`common`,glyph:`⌘`,tone:`#c9a86a`,text:`Draw 2 extra cards on your first turn.`},emberLantern:{name:`Ember Lantern`,rarity:`common`,glyph:`☀`,tone:`#ffd166`,text:`Gain 1 extra Energy on your first turn.`},vialOfLife:{name:`Vial of Life`,rarity:`common`,glyph:`♣`,tone:`#7ddb8f`,text:`Heal 2 HP at the start of each combat.`},thornBand:{name:`Thorn Band`,rarity:`common`,glyph:`❈`,tone:`#a3e06c`,text:`Begin each combat with 2 Splinters.`},sweetRoot:{name:`Sweet Root`,rarity:`common`,glyph:`✿`,tone:`#ff9ecb`,text:`On pickup: gain 8 Max HP.`,instant:!0},gravebloom:{name:`Gravebloom`,rarity:`uncommon`,glyph:`❀`,tone:`#b18cff`,text:`After combat, if at or below 50% HP, heal 10.`},silkFan:{name:`Silk Fan`,rarity:`uncommon`,glyph:`⛉`,tone:`#8fd0ff`,text:`Every 3rd card you play each combat grants 3 Ward.`},reapersBell:{name:`Reaper's Bell`,rarity:`uncommon`,glyph:`♫`,tone:`#d8c27a`,text:`When an enemy dies, gain 1 Energy and draw 1 card.`},executionersSeal:{name:`Executioner's Seal`,rarity:`uncommon`,glyph:`✠`,tone:`#ff6b6b`,text:`Every 10th Attack you play deals double damage.`},ironTalisman:{name:`Iron Talisman`,rarity:`uncommon`,glyph:`◈`,tone:`#c0c8d4`,text:`Every 3rd Attack you play grants 1 Fervor.`},merchantsMark:{name:`Merchant's Mark`,rarity:`uncommon`,glyph:`¤`,tone:`#f2c14e`,text:`Shop prices are 25% lower.`},seersOrb:{name:`Seer's Orb`,rarity:`uncommon`,glyph:`☉`,tone:`#9be8d8`,text:`Card rewards offer 1 additional choice.`},frozenCore:{name:`Frozen Core`,rarity:`rare`,glyph:`❆`,tone:`#a8e6ff`,text:`Unspent Energy carries over between turns.`},verdantBranch:{name:`Verdant Branch`,rarity:`rare`,glyph:`⚕`,tone:`#7ddb8f`,text:`Whenever a card is Kindled or burned away, draw 1 card.`},sunBlossom:{name:`Sun Blossom`,rarity:`rare`,glyph:`❂`,tone:`#ffd166`,text:`All healing is increased by 50%.`},wardingCharm:{name:`Warding Charm`,rarity:`rare`,glyph:`⛨`,tone:`#8fa8ff`,text:`Enemy attacks that would deal 5 or less damage deal 1.`},duskmirror:{name:`Duskmirror`,rarity:`rare`,glyph:`◐`,tone:`#c99aff`,text:`The first card you play each turn costs 0.`},smolderingCoal:{name:`Smoldering Coal`,rarity:`uncommon`,glyph:`♨`,tone:`#ff9a4d`,locked:`ashSermon`,text:`Enemies begin each combat with 2 Smolder.`},thiefOfWicks:{name:`Thief of Wicks`,rarity:`uncommon`,glyph:`☄`,tone:`#c9a86a`,locked:`darkWalker`,text:`Unlit lanterns pay double bounty.`},prismCharm:{name:`Prism Charm`,rarity:`rare`,glyph:`◬`,tone:`#9be8d8`,locked:`untouched`,text:`Your first Shatter each combat spills 2 extra Embers.`},bellOfEndings:{name:`Bell of Endings`,rarity:`rare`,glyph:`♪`,tone:`#dfeaff`,locked:`hundredShards`,text:`Whenever glass Shatters, every other enemy takes 4 damage.`},crownOfCinders:{name:`Crown of Cinders`,rarity:`boss`,glyph:`♛`,tone:`#ff9a4d`,text:`Your lantern holds 12 Embers and begins each combat holding 2.`},hollowCrown:{name:`Hollow Crown`,rarity:`boss`,glyph:`♕`,tone:`#b18cff`,text:`Gain 1 Energy each turn. The glass dims: on pickup, lose 10 Max HP.`,instant:!0},crownOfTithes:{name:`Crown of Tithes`,rarity:`boss`,glyph:`♜`,tone:`#d8c27a`,text:`You may kindle twice each turn, and each kindling grants 3 Ward.`},shatterersCrown:{name:`Shatterer's Crown`,rarity:`boss`,glyph:`♚`,tone:`#8fd0ff`,text:`Enemy glass runs thin: all facet gauges are 1 smaller. Enemies begin with 1 Fervor.`},crownOfTheHearth:{name:`Crown of the Hearth`,rarity:`boss`,glyph:`♥`,tone:`#ff5964`,text:`At the end of combat, heal 3 HP for every Ember still in your lantern.`}},Vl=(()=>{let e={common:[],uncommon:[],rare:[],boss:[]};for(let[t,n]of Object.entries(Bl))e[n.rarity]&&!n.locked&&e[n.rarity].push(t);return e})(),Hl={healing:{name:`Phial of Dawn`,tone:`#ff6b81`,glyph:`♥`,text:`Heal 20 HP.`,combatOnly:!1},strength:{name:`Phial of Fervor`,tone:`#ff8c5a`,glyph:`⚔`,text:`Gain 2 Fervor.`,combatOnly:!0},swift:{name:`Inkdraught`,tone:`#8fd0ff`,glyph:`»`,text:`Draw 3 cards.`,combatOnly:!0},block:{name:`Phial of Held Light`,tone:`#9aa7b8`,glyph:`☗`,text:`Gain 12 Ward.`,combatOnly:!0},fire:{name:`Stormglass Phial`,tone:`#ffd166`,glyph:`✹`,text:`Deal 20 damage to an enemy.`,combatOnly:!0,needsTarget:!0},venom:{name:`Smolderphial`,tone:`#a3e06c`,glyph:`☠`,text:`Apply 7 Smolder to an enemy.`,combatOnly:!0,needsTarget:!0},energy:{name:`Emberphial`,tone:`#ff9a4d`,glyph:`✦`,text:`Gain 3 Embers.`,combatOnly:!0}},Ul={sporeling:{name:`Sporeling`,hp:[13,17],facets:3,art:{kind:`wisp`,hue:95,size:.72},moves:{spit:{name:`Spore Spit`,intent:`attack`,dmg:4},grow:{name:`Bloom`,intent:`buff`,fx:[{who:`self`,id:`str`,n:1}]}},ai:({turn:e})=>e%3==2?`grow`:`spit`},duskfang:{name:`Duskfang`,hp:[26,30],art:{kind:`beast`,hue:22,size:1},moves:{howl:{name:`Howl`,intent:`buff`,fx:[{who:`self`,id:`str`,n:2}]},bite:{name:`Bite`,intent:`attack`,dmg:7},rend:{name:`Rend`,intent:`attack`,dmg:4,times:2}},ai:({turn:e,last:t,rng:n})=>e===1||t!==`howl`&&n()<.18?`howl`:t===`bite`?`rend`:`bite`},gloomslime:{name:`Gloomslime`,hp:[30,34],art:{kind:`slime`,hue:150,size:1},moves:{slam:{name:`Slam`,intent:`attack`,dmg:8},ooze:{name:`Corrosive Ooze`,intent:`attack_debuff`,dmg:3,fx:[{who:`player`,id:`weak`,n:2}]},harden:{name:`Congeal`,intent:`attack_block`,dmg:4,block:6}},ai:({turn:e})=>[`ooze`,`slam`,`harden`][(e-1)%3]},waylayer:{name:`Waylayer`,hp:[28,32],art:{kind:`rogue`,hue:0,size:.95},moves:{stab:{name:`Stab`,intent:`attack`,dmg:9},smoke:{name:`Smokescreen`,intent:`block`,block:8},trick:{name:`Dirty Trick`,intent:`attack_debuff`,dmg:4,fx:[{who:`player`,id:`frail`,n:2}]}},ai:({turn:e,rng:t})=>e===1?`trick`:t()<.55?`stab`:t()<.5?`smoke`:`trick`},thornling:{name:`Thornling`,hp:[18,22],facets:3,art:{kind:`plant`,hue:80,size:.85},startStatus:{thorns:2},moves:{prick:{name:`Prick`,intent:`attack`,dmg:6},bristle:{name:`Bristle`,intent:`buff`,fx:[{who:`self`,id:`thorns`,n:2}]},burst:{name:`Spike Burst`,intent:`attack`,dmg:10}},ai:({turn:e})=>e%4==0?`burst`:e%2==1?`prick`:`bristle`},ashAcolyte:{name:`Ash Acolyte`,hp:[34,38],art:{kind:`cultist`,hue:28,size:1},moves:{ritual:{name:`Dark Ritual`,intent:`buff`,fx:[{who:`self`,id:`ritual`,n:2}]},scorch:{name:`Scorch`,intent:`attack`,dmg:6}},ai:({turn:e})=>e===1?`ritual`:`scorch`},gravewarden:{name:`Gravewarden`,hp:[70,76],elite:!0,art:{kind:`golem`,hue:210,size:1.25},moves:{crush:{name:`Crush`,intent:`attack`,dmg:12},entomb:{name:`Entomb`,intent:`debuff`,fx:[{who:`player`,id:`frail`,n:2},{who:`player`,id:`vulnerable`,n:2}]},bulwark:{name:`Bulwark`,intent:`attack_block`,dmg:6,block:12}},ai:({turn:e})=>[`entomb`,`crush`,`bulwark`,`crush`][(e-1)%4]},alphaFang:{name:`Alpha Duskfang`,hp:[64,70],elite:!0,art:{kind:`beast`,hue:350,size:1.3},moves:{howl:{name:`Alpha Howl`,intent:`buff`,fx:[{who:`self`,id:`str`,n:3}]},savage:{name:`Savage`,intent:`attack`,dmg:5,times:2},throat:{name:`Throat Rip`,intent:`attack`,dmg:13}},ai:({turn:e,last:t})=>e===1||e%4==0?`howl`:t===`savage`?`throat`:`savage`},rootheart:{name:`The Rootheart`,hp:[150,150],boss:!0,art:{kind:`treeboss`,hue:100,size:1.6},moves:{awaken:{name:`Awaken`,intent:`buff`,block:10,fx:[{who:`self`,id:`str`,n:2}]},lash:{name:`Root Lash`,intent:`attack`,dmg:12},spores:{name:`Choking Spores`,intent:`attack_debuff`,dmg:5,fx:[{who:`player`,id:`poison`,n:4},{who:`player`,id:`weak`,n:2}]},entangle:{name:`Entangle`,intent:`attack_debuff`,dmg:7,addCards:{id:`wound`,n:2}},slam:{name:`Colossal Slam`,intent:`attack`,dmg:22}},ai:({turn:e})=>e===1?`awaken`:e%4==0?`slam`:[`lash`,`spores`,`entangle`][(e-2)%3]},drownedOne:{name:`Drowned One`,hp:[38,44],art:{kind:`zombie`,hue:185,size:1},moves:{claw:{name:`Claw`,intent:`attack`,dmg:11},frenzy:{name:`Frenzy`,intent:`attack`,dmg:4,times:3},gurgle:{name:`Gurgle`,intent:`attack_debuff`,dmg:5,fx:[{who:`player`,id:`weak`,n:2}]}},ai:({hpFrac:e,last:t,rng:n})=>e<.5&&t!==`frenzy`?`frenzy`:n()<.6?`claw`:`gurgle`},voltEel:{name:`Voltaic Eel`,hp:[30,36],art:{kind:`serpent`,hue:190,size:.9},moves:{shock:{name:`Shock`,intent:`attack_block`,dmg:7,block:5},discharge:{name:`Discharge`,intent:`attack`,dmg:12},coil:{name:`Coil`,intent:`buff`,block:8,fx:[{who:`self`,id:`str`,n:1}]}},ai:({turn:e})=>[`shock`,`coil`,`discharge`][(e-1)%3]},mirelurker:{name:`Mirelurker`,hp:[34,40],art:{kind:`crawler`,hue:160,size:.95},moves:{sting:{name:`Venom Sting`,intent:`attack_debuff`,dmg:6,fx:[{who:`player`,id:`poison`,n:3}]},burrow:{name:`Burrow`,intent:`block`,block:10},barb:{name:`Barb`,intent:`attack`,dmg:9}},ai:({turn:e,rng:t})=>e%3==0?`burrow`:t()<.55?`sting`:`barb`},tidecaller:{name:`Tidecaller`,hp:[42,48],art:{kind:`cultist`,hue:195,size:1.05},moves:{surge:{name:`Tidal Blessing`,intent:`buff`,fx:[{who:`allies`,id:`str`,n:2}]},bolt:{name:`Water Bolt`,intent:`attack`,dmg:9},undertow:{name:`Undertow`,intent:`attack_debuff`,dmg:4,fx:[{who:`player`,id:`frail`,n:2}]}},ai:({turn:e})=>e===1?`surge`:e%3==0?`undertow`:`bolt`},shellback:{name:`Shellback`,hp:[50,56],art:{kind:`crab`,hue:15,size:1.15},moves:{snap:{name:`Snap`,intent:`attack`,dmg:10},shell:{name:`Shell Up`,intent:`block`,block:13,fx:[{who:`self`,id:`thorns`,n:1}]},jet:{name:`Water Jet`,intent:`attack`,dmg:6,times:2}},ai:({turn:e})=>[`snap`,`shell`,`jet`,`shell`][(e-1)%4]},deepmaw:{name:`Deepmaw`,hp:[54,60],art:{kind:`maw`,hue:200,size:1.2},moves:{bite:{name:`Bite`,intent:`attack`,dmg:14},lure:{name:`Luminous Lure`,intent:`debuff`,fx:[{who:`player`,id:`vulnerable`,n:2}]},swallow:{name:`Swallow`,intent:`attack_buff`,dmg:8,heal:8}},ai:({turn:e})=>[`lure`,`bite`,`swallow`][(e-1)%3]},abyssalKnight:{name:`Abyssal Knight`,hp:[108,116],elite:!0,art:{kind:`knight`,hue:215,size:1.3},moves:{blade:{name:`Voidblade`,intent:`attack`,dmg:15},oath:{name:`Dark Oath`,intent:`buff`,block:14,fx:[{who:`self`,id:`str`,n:2}]},condemn:{name:`Condemn`,intent:`debuff`,fx:[{who:`player`,id:`vulnerable`,n:2},{who:`player`,id:`weak`,n:2}]},execute:{name:`Execute`,intent:`attack`,dmg:9,times:2}},ai:({turn:e})=>[`condemn`,`blade`,`oath`,`execute`][(e-1)%4]},siren:{name:`Siren`,hp:[92,100],elite:!0,art:{kind:`siren`,hue:280,size:1.15},moves:{song:{name:`Dirge`,intent:`debuff`,fx:[{who:`player`,id:`weak`,n:2},{who:`player`,id:`frail`,n:2}]},rend:{name:`Talon Rend`,intent:`attack`,dmg:12},mend:{name:`Mend`,intent:`heal`,heal:12,block:6},shriek:{name:`Shriek`,intent:`attack`,dmg:7,times:2}},ai:({turn:e,hpFrac:t,last:n})=>t<.55&&n!==`mend`?`mend`:[`song`,`rend`,`shriek`][(e-1)%3]},leviathan:{name:`Leviathan's Maw`,hp:[260,260],boss:!0,art:{kind:`leviathan`,hue:195,size:1.7},moves:{tide:{name:`Rising Tide`,intent:`buff`,block:15,fx:[{who:`self`,id:`str`,n:1}]},crush:{name:`Crushing Jaws`,intent:`attack`,dmg:17},brine:{name:`Black Brine`,intent:`attack_debuff`,dmg:6,fx:[{who:`player`,id:`poison`,n:5},{who:`player`,id:`weak`,n:2}]},consume:{name:`Consume the Deep`,intent:`heal`,heal:20,block:10},cataclysm:{name:`Cataclysm`,intent:`attack`,dmg:30}},ai:({turn:e})=>e===1?`tide`:e%4==0?`cataclysm`:[`crush`,`brine`,`consume`][(e-2)%3]},voidWisp:{name:`Void Wisp`,hp:[26,30],facets:3,art:{kind:`wisp`,hue:275,size:.78},moves:{zap:{name:`Void Zap`,intent:`attack`,dmg:7},siphon:{name:`Siphon`,intent:`attack_buff`,dmg:5,heal:5}},ai:({rng:e})=>e()<.6?`zap`:`siphon`},obsidianGolem:{name:`Obsidian Golem`,hp:[64,72],art:{kind:`golem`,hue:270,size:1.3},moves:{pound:{name:`Pound`,intent:`attack`,dmg:14},harden:{name:`Harden`,intent:`block`,block:14},quake:{name:`Quake`,intent:`attack_debuff`,dmg:10,fx:[{who:`player`,id:`frail`,n:2}]}},ai:({turn:e})=>[`pound`,`harden`,`quake`][(e-1)%3]},starCultist:{name:`Star Cultist`,hp:[46,52],art:{kind:`cultist`,hue:290,size:1.05},moves:{ritual:{name:`Star Ritual`,intent:`buff`,fx:[{who:`self`,id:`ritual`,n:3}]},scorch:{name:`Starfire`,intent:`attack`,dmg:9}},ai:({turn:e})=>e===1?`ritual`:`scorch`},shade:{name:`Shade`,hp:[42,48],art:{kind:`shade`,hue:260,size:1},moves:{slash:{name:`Dual Slash`,intent:`attack`,dmg:6,times:2},gloom:{name:`Gloom`,intent:`attack_debuff`,dmg:6,fx:[{who:`player`,id:`weak`,n:2}]},vanish:{name:`Vanish`,intent:`block`,block:12}},ai:({turn:e,rng:t})=>e%3==0?`vanish`:t()<.5?`slash`:`gloom`},chaosHound:{name:`Chaos Hound`,hp:[56,64],art:{kind:`beast`,hue:315,size:1.1},startStatus:{rampage:1},moves:{bite:{name:`Chaos Bite`,intent:`attack`,dmg:9,ramp:3},howl:{name:`Warp Howl`,intent:`buff`,fx:[{who:`self`,id:`str`,n:2}]}},ai:({turn:e})=>e%4==0?`howl`:`bite`},watcherEye:{name:`Watcher Eye`,hp:[48,56],art:{kind:`eye`,hue:250,size:1.05},moves:{gaze:{name:`Piercing Gaze`,intent:`attack_debuff`,dmg:8,fx:[{who:`player`,id:`vulnerable`,n:2}]},beam:{name:`Ruin Beam`,intent:`attack`,dmg:15},blink:{name:`Blink`,intent:`attack_block`,dmg:5,block:10}},ai:({turn:e})=>[`gaze`,`beam`,`blink`][(e-1)%3]},voidColossus:{name:`Voidforged Colossus`,hp:[155,168],elite:!0,art:{kind:`golem`,hue:305,size:1.5},moves:{slam:{name:`Void Slam`,intent:`attack`,dmg:20},fortify:{name:`Fortify`,intent:`buff`,block:18,fx:[{who:`self`,id:`str`,n:2}]},shatter:{name:`Shatter`,intent:`attack_debuff`,dmg:8,fx:[{who:`player`,id:`frail`,n:3}]}},ai:({turn:e})=>[`shatter`,`slam`,`fortify`,`slam`][(e-1)%4]},heraldOfEnd:{name:`Herald of the End`,hp:[128,142],elite:!0,art:{kind:`shade`,hue:335,size:1.4},moves:{doom:{name:`Doomsong`,intent:`debuff`,fx:[{who:`player`,id:`poison`,n:7}]},reave:{name:`Reave`,intent:`attack`,dmg:16},flame:{name:`Black Flame`,intent:`attack`,dmg:8,times:2},rise:{name:`Apotheosis`,intent:`buff`,fx:[{who:`self`,id:`str`,n:3}]}},ai:({turn:e})=>e%4==0?`rise`:[`doom`,`reave`,`flame`][(e-1)%3]},sovereign:{name:`The Eternal Sovereign`,hp:[330,330],boss:!0,art:{kind:`sovereign`,hue:285,size:1.8},moves:{scepter:{name:`Scepter Strike`,intent:`attack`,dmg:18},gravitas:{name:`Gravitas`,intent:`buff`,block:20,fx:[{who:`self`,id:`str`,n:2}]},starfall:{name:`Starfall`,intent:`attack`,dmg:11,times:2},ruin:{name:`Word of Ruin`,intent:`attack_debuff`,dmg:4,fx:[{who:`player`,id:`poison`,n:4},{who:`player`,id:`weak`,n:2},{who:`player`,id:`frail`,n:2}]},ascend:{name:`Ascend`,intent:`buff`,block:30,fx:[{who:`self`,id:`str`,n:4}]},annihilation:{name:`Annihilation`,intent:`attack`,dmg:34}},ai:e=>{let t=e.self;return e.hpFrac<=.5&&!t.flags.ascended?(t.flags.ascended=!0,`ascend`):t.flags.ascended?(t.flags.p2=(t.flags.p2||0)+1,t.flags.p2%3==0?`annihilation`:[`scepter`,`starfall`,`ruin`,`gravitas`][t.flags.p2%4]):[`scepter`,`gravitas`,`starfall`,`ruin`][(e.turn-1)%4]}}},Wl=[{weak:[[`sporeling`,`sporeling`],[`duskfang`],[`gloomslime`],[`sporeling`,`sporeling`,`sporeling`]],normal:[[`duskfang`,`sporeling`],[`ashAcolyte`],[`waylayer`],[`thornling`,`thornling`],[`gloomslime`,`sporeling`],[`duskfang`,`duskfang`],[`waylayer`,`sporeling`]],elite:[[`gravewarden`],[`alphaFang`]],boss:[[`rootheart`]]},{weak:[[`voltEel`],[`mirelurker`],[`drownedOne`]],normal:[[`drownedOne`,`voltEel`],[`tidecaller`,`mirelurker`],[`shellback`],[`deepmaw`],[`drownedOne`,`drownedOne`],[`tidecaller`,`voltEel`],[`mirelurker`,`mirelurker`]],elite:[[`abyssalKnight`],[`siren`]],boss:[[`leviathan`]]},{weak:[[`voidWisp`,`voidWisp`],[`shade`],[`starCultist`]],normal:[[`obsidianGolem`],[`shade`,`voidWisp`],[`chaosHound`],[`watcherEye`],[`starCultist`,`voidWisp`],[`shade`,`shade`],[`chaosHound`,`voidWisp`],[`watcherEye`,`starCultist`]],elite:[[`voidColossus`],[`heraldOfEnd`]],boss:[[`sovereign`]]}],Gl={forgottenShrine:{name:`Forgotten Shrine`,glyph:`⛩`,hue:45,text:`A moss-eaten shrine hums with old power. Offerings of bone and silver litter its base. Something watches from inside the stone.`,choices:[{label:`Pray`,sub:`Remove a card from your deck.`,ops:[{pickRemove:!0}]},{label:`Desecrate`,sub:`Gain 90 gold. Gain a Hex.`,ops:[{gold:90},{addCard:`hex`}]},{label:`Leave`,sub:``,ops:[]}]},woundedKnight:{name:`The Wounded Knight`,glyph:`⚔`,hue:210,text:`A knight slumps against a shattered pillar, breath rattling behind a crushed visor. One gauntlet clutches a relic; the other beckons you closer.`,choices:[{label:`Aid him`,sub:`Lose 8 HP. He rewards you with a relic.`,ops:[{hp:-8},{addRelic:`random`}]},{label:`Loot him`,sub:`Gain 65 gold. Gain a Hex.`,ops:[{gold:65},{addCard:`hex`}]},{label:`Leave`,sub:``,ops:[]}]},voidChest:{name:`Humming Chest`,glyph:`▣`,hue:280,text:`A black iron chest sits alone in the gloom, humming a note you feel in your teeth. Its lock is already broken.`,choices:[{label:`Open it`,sub:`It might hold a relic... or teeth.`,ops:[{roll:[{p:.55,ops:[{addRelic:`random`}],text:`Inside: a relic, warm as a heartbeat.`},{p:.45,ops:[{hp:-12}],text:`Teeth. You pull back a mangled hand. (-12 HP)`}]}]},{label:`Leave`,sub:``,ops:[]}]},emberFountain:{name:`Fountain of Embers`,glyph:`❂`,hue:30,text:`Liquid light pools in a cracked basin, throwing sparks that do not burn. It smells of summer and old victories.`,choices:[{label:`Bathe`,sub:`Heal 35% of your Max HP.`,ops:[{heal:.35}]},{label:`Bottle it`,sub:`Gain a Phial of Dawn.`,ops:[{potion:`healing`}]},{label:`Leave`,sub:``,ops:[]}]},forge:{name:`The Forgotten Forge`,glyph:`⚒`,hue:15,text:`An anvil of black star-metal, still warm. Hammers hang in racks, waiting for hands that died an age ago.`,choices:[{label:`Temper`,sub:`Upgrade a card.`,ops:[{pickUpgrade:!0}]},{label:`Leave`,sub:``,ops:[]}]},gambler:{name:`The Bone Gambler`,glyph:`⚄`,hue:50,text:`A grinning figure rattles a cup of knuckle-bones. "One throw, stranger. Fortune loves the reckless."`,choices:[{label:`Bet 40 gold`,sub:`45% chance to win 110 gold.`,needGold:40,ops:[{gold:-40},{roll:[{p:.45,ops:[{gold:110}],text:`The bones land your way. +110 gold.`},{p:.55,ops:[],text:`The bones betray you. The gambler grins wider.`}]}]},{label:`Walk away`,sub:``,ops:[]}]},mirror:{name:`The Silvered Mirror`,glyph:`◐`,hue:220,text:`A tall mirror stands in the rubble, unbroken. Your reflection moves half a breath behind you — and it is smiling.`,choices:[{label:`Reflect`,sub:`Duplicate a card in your deck.`,ops:[{pickDuplicate:!0}]},{label:`Shatter it`,sub:`Lose 6 HP. Remove a card from your deck.`,ops:[{hp:-6},{pickRemove:!0}]},{label:`Leave`,sub:``,ops:[]}]},library:{name:`The Drowned Library`,glyph:`❦`,hue:190,text:`Shelves of waterlogged grimoires stretch into the dark. Most are pulp — but a few pages still glow faintly.`,choices:[{label:`Study`,sub:`Choose 1 of 5 cards to add to your deck.`,ops:[{pickCard:5}]},{label:`Rest among the stacks`,sub:`Heal 20% of your Max HP.`,ops:[{heal:.2}]}]},fleshTrader:{name:`The Flesh Trader`,glyph:`♠`,hue:320,text:`"Vitality is a currency," purrs a thing wearing a merchant's coat. "And you look flush with it." Long fingers open to reveal a relic.`,choices:[{label:`Trade`,sub:`Lose 8 Max HP. Gain a relic.`,ops:[{maxHp:-8},{addRelic:`random`}]},{label:`Refuse`,sub:``,ops:[]}]},cursedIdol:{name:`The Cursed Idol`,glyph:`☿`,hue:100,text:`A jade idol sits on a plinth of skulls, radiating a soft warmth. It has clearly been left here for a reason.`,choices:[{label:`Take it`,sub:`Gain a relic. Gain a Hex.`,ops:[{addRelic:`random`},{addCard:`hex`}]},{label:`Leave it`,sub:``,ops:[]}]},ruinedCamp:{name:`Ruined Camp`,glyph:`⛺`,hue:35,text:`A campfire, still smoldering. Bedrolls, torn. Whoever slept here left in a hurry — and left their packs behind.`,choices:[{label:`Rest`,sub:`Heal 15% of your Max HP.`,ops:[{heal:.15}]},{label:`Scavenge`,sub:`Gain 45 gold and a random potion.`,ops:[{gold:45},{potion:`random`}]}]}},Kl=[{normal:[12,20],elite:[28,38],boss:[70,80]},{normal:[18,28],elite:[35,48],boss:[85,100]},{normal:[24,36],elite:[45,60],boss:[100,120]}],ql={removeCost:75,cardPrice:{common:[45,55],uncommon:[68,82],rare:[135,160]},relicPrice:{common:[140,160],uncommon:[220,250],rare:[270,300]},potionPrice:[48,62]},Jl={ashfall:{name:`Ashfall`,glyph:`☁`,tone:`#d3f2a1`,text:`Ash chokes every fire: enemies begin combat with 2 Smolder, but their blows leave 1 Smolder on you.`,mods:{enemyStartStatus:{poison:2},playerHitApplies:{poison:1}}},heavyAir:{name:`Heavy Air`,glyph:`☗`,tone:`#8fd0ff`,text:`The air holds light like water: all Ward gained is increased by a quarter — yours and theirs.`,mods:{wardMult:1.25}},thinGlass:{name:`Thin Glass`,glyph:`◬`,tone:`#dfeaff`,text:`Tonight all glass runs thin: every facet gauge is 1 smaller, but enemy blows strike 2 harder.`,mods:{facetDelta:-1,enemyDmgBonus:2}},hungryDark:{name:`The Hungry Dark`,glyph:`☾`,tone:`#c99aff`,text:`The dark eats coin but sharpens choice: shop prices are a quarter higher, and card rewards offer 1 more choice.`,mods:{shopMult:1.25,rewardChoiceBonus:1}},emberWind:{name:`Ember Wind`,glyph:`✦`,tone:`#ff9a4d`,text:`Sparks ride the wind into your lantern: begin each combat with 2 Embers, but draw 4 cards instead of 5.`,mods:{startEmbers:2,drawDelta:-1}},longNight:{name:`The Long Night`,glyph:`★`,tone:`#b18cff`,text:`The climb stretches on: enemies carry 12% more life, but every victory pays 40% more gold.`,mods:{hpMult:1.12,goldMult:1.4}},waningMoon:{name:`Waning Moon`,glyph:`◐`,tone:`#ffe9ac`,text:`The moon spends her last light on you: your first card each turn costs 1 less, but rest sites heal only 20%.`,mods:{firstCardDiscount:1,restHealFrac:.2}}},Yl={vitrified:{name:`Vitrified`,tone:`#8fd0ff`,text:`Thicker glass: +2 facets and +15% HP.`,mods:{facetDelta:2,hpMult:1.15}},cinderVeined:{name:`Cinder-Veined`,tone:`#ff9a4d`,text:`Its blows leave 1 Smolder on you.`,mods:{attackApplies:{poison:1}}},adamant:{name:`Adamant`,tone:`#d8c27a`,text:`The first time its glass would shatter, it holds.`,mods:{adamant:!0}},emberFat:{name:`Ember-Fat`,tone:`#ffe9ac`,text:`Slaying it pays double gold.`,mods:{goldMult:2}},veiled:{name:`Veiled`,tone:`#9aa7b8`,text:`Begins the fight behind 15 Ward.`,mods:{startBlock:15}},fervent:{name:`Fervent`,tone:`#ff8d8d`,text:`Begins the fight with 2 Fervor.`,mods:{startStatus:{str:2}}}},Xl={flare:{name:`Flare`,glyph:`✹`,tone:`#ff9a4d`,cost:3,text:`The lantern vents. Deal 7 damage to ALL enemies and apply 2 Smolder.`,effects:[{kind:`dmg`,n:7},{kind:`status`,who:`allEnemies`,id:`poison`,n:2}]},mendglass:{name:`Mendglass`,glyph:`❋`,tone:`#8fe8a0`,cost:4,text:`Warm light knits the cracks. Heal 8 HP.`,effects:[{kind:`heal`,n:8}]},beacon:{name:`Beacon`,glyph:`☀`,tone:`#ffe9ac`,cost:2,text:`Raise the light. Your attacks chip 1 extra facet this turn.`,effects:[{kind:`status`,who:`self`,id:`beacon`,n:1}]},emberveil:{name:`Emberveil`,glyph:`⛨`,tone:`#8fd0ff`,cost:3,text:`A curtain of held fire. Gain 12 Ward.`,effects:[{kind:`block`,n:12}]},stoke:{name:`Stoke`,glyph:`✦`,tone:`#c99aff`,cost:4,text:`Feed the flame to the hand that carries it. Gain 1 Energy and draw 2 cards.`,effects:[{kind:`energy`,n:1},{kind:`draw`,n:2}]},ashfall:{name:`Ashfall`,glyph:`☁`,tone:`#d3f2a1`,cost:3,text:`The Ashwarden's breath. Apply 3 Smolder to ALL enemies and gain 5 Ward.`,effects:[{kind:`status`,who:`allEnemies`,id:`poison`,n:3},{kind:`block`,n:5}]}},Zl={paneBreaker:{name:`Breaker of Panes`,desc:`Shatter 15 facets`,stat:`shatters`,n:15,unlocks:[`card:quakeblow`,`card:resonantLance`]},lanternFed:{name:`The Lantern Fed`,desc:`Kindle 20 cards by hand`,stat:`kindles`,n:20,unlocks:[`card:tithe`,`card:pyreheart`]},ashSermon:{name:`Sermon of Ash`,desc:`Let Smolder claim 10 lives`,stat:`smolderKills`,n:10,unlocks:[`card:ashenChoir`,`relic:smolderingCoal`]},untouched:{name:`The Glass Untouched`,desc:`Win 3 fights without a scratch`,stat:`perfects`,n:3,unlocks:[`card:flawlessForm`,`relic:prismCharm`]},darkWalker:{name:`Walker of Unlit Ways`,desc:`Enter 6 unlit lanterns`,stat:`unlitVisited`,n:6,unlocks:[`card:nightSight`,`relic:thiefOfWicks`]},spendthrift:{name:`Fire Given Freely`,desc:`Spend 30 embers on Lantern Arts`,stat:`embersSpent`,n:30,unlocks:[`card:novaflare`,`card:emberdance`]},hundredShards:{name:`A Hundred Shards`,desc:`Slay 100 creatures`,stat:`slain`,n:100,unlocks:[`card:shardstorm`,`relic:bellOfEndings`]},firstDawn:{name:`The First Dawn`,desc:`Reach the sunrise once`,stat:`wins`,n:1,unlocks:[`aspect2`]}},Ql=[Fl,{id:`ashwarden`,name:`The Ashwarden`,blurb:`Smoke given a shape. Lets the Smolder do the killing and kindles its own hand to feed the lantern. Slower, but it endures — and everything it touches burns.`,hue:26,art:`ashfall`,unlock:`aspect2`,maxHp:80,energy:3,handSize:5,potionSlots:3,startDeck:[`ashBite`,`ashBite`,`ashBite`,`ashBite`,`defend`,`defend`,`defend`,`smother`,`smother`,`firstSpark`],startRelic:`ashenCore`,startGold:99}],$l=[{name:`Vow of Iron`,desc:`Every creature is harder to break — enemy HP +12%.`,mods:{hpMult:1.12}},{name:`Vow of Malice`,desc:`Their blows land heavier — enemy attacks deal +1.`,mods:{enemyDmgBonus:1}},{name:`Vow of the Deep`,desc:`Bosses armor their cores — boss Facets +1.`,mods:{bossFacetDelta:1}},{name:`Vow of the Mark`,desc:`You climb already cursed — begin every run with a Hex.`,mods:{startHex:!0}},{name:`Vow of the Waning`,desc:`The dark drinks your rest — campfires heal 20%, not 30%.`,mods:{restHealFrac:.2}}],eu={fullPurse:{name:`A Full Purse`,text:`Set out with 120 extra gold.`,ops:[{gold:120}]},temperedGlass:{name:`Tempered Glass`,text:`Raise your Max HP by 14.`,ops:[{maxHp:14}]},keenEye:{name:`A Keeper's Eye`,text:`Begin with a random relic.`,ops:[{addRelic:`random`}]},warmHearth:{name:`A Warm Hearth`,text:`Mend to full and gain 6 Max HP.`,ops:[{maxHp:6},{heal:1}]},emberFlask:{name:`Ember Flask`,text:`Pack a Fire Phial and a Draught of Vigor.`,ops:[{potion:`fire`},{potion:`healing`}]},twinPhials:{name:`Twin Phials`,text:`Pack a Swift Phial and an Energy Phial.`,ops:[{potion:`swift`},{potion:`energy`}]},pilgrimsCache:{name:`Pilgrim's Cache`,text:`Gain 60 gold and a Ward Phial.`,ops:[{gold:60},{potion:`block`}]},venomPouch:{name:`A Pouch of Ash`,text:`Gain 40 gold and a Venom Phial.`,ops:[{gold:40},{potion:`venom`}]}},tu,nu,ru,iu,au,ou,su,cu=[],lu,uu,du,fu,pu,mu,hu,gu=[],_u,vu=0,yu=.5,bu=0,xu,Su,Cu=[],wu=matchMedia(`(prefers-reduced-motion: reduce)`).matches,Tu={sky:new W(724506),fog:new W(1317422),particles:new W(16752717),glow:new W(6750110)},Eu={sky:Tu.sky.clone(),fog:Tu.fog.clone(),particles:Tu.particles.clone(),glow:Tu.glow.clone()},Du={x:0,y:0},Ou=0,ku=1,Au={x:7,z:-20,bottom:-16,top:54,baseY:-6,rowH:1.06,actGap:4.2,azBase:Math.atan2(30,-7),colSpread:.34},ju=15,Mu=e=>Au.baseY+e*((ju-1)*Au.rowH+Au.actGap);function Nu(e){let t=At.clamp((e-Au.bottom)/(Au.top-Au.bottom),0,1),n=1+Math.sin(t*21)*.07+Math.sin(t*57)*.05+Math.sin(t*9+1.7)*.06;return(1-t)**1.15*6.2*n+.85}function Pu(e,t){let n=Mu(e)+t.row*Au.rowH+t.jy*.5,r=Au.azBase+(t.col-3+t.jx)*Au.colSpread,i=Math.max(Nu(n)+.5,3.6);return new V(Au.x+Math.cos(r)*i,n,Au.z+Math.sin(r)*i)}var Fu=`ambient`,Iu=Mu(0),Lu=Mu(0),Ru=0,zu=0,Bu=0,Vu=new V(0,Mu(0),-6),Hu=new V,Uu=new V,Wu=new V,Gu=new W(16777215),Ku=new W,qu=new W(12571903);function Ju(e,t){Lu=Mu(e)+Math.max(0,t)*Au.rowH}function Yu(e,t){Fu=`map`,Ru=e,zu=Math.max(0,t),Bu=0}function Xu(){Fu=`ambient`}function Zu(e){Bu=At.clamp(Bu+e,-zu-1,15.5-zu)}var Qu=null,$u=null;function ed(e,t){Qu=e,$u=t}function td(){Qu=null,$u=null}function nd(e){let t=document.createElement(`canvas`);t.width=t.height=128;let n=t.getContext(`2d`),r=n.createRadialGradient(64,64,0,64,64,64);for(let[t,n]of e)r.addColorStop(t,n);return n.fillStyle=r,n.fillRect(0,0,128,128),new zi(t)}function rd(e,t,n,r,i,a){let o=new jr,s=new Float32Array(e*3),c=new Float32Array(e);for(let t=0;t<e;t++)s[t*3]=(Math.random()-.5)*n,s[t*3+1]=(Math.random()-.5)*r,s[t*3+2]=-Math.random()*i,c[t]=Math.random()*Math.PI*2;return o.setAttribute(`position`,new gr(s,3)),o.userData.seeds=c,new Ii(o,new ji({size:t,map:nd([[0,`rgba(255,255,255,1)`],[.35,`rgba(255,255,255,.6)`],[1,`rgba(255,255,255,0)`]]),transparent:!0,opacity:a,depthWrite:!1,blending:2,sizeAttenuation:!0}))}var id=new URLSearchParams(location.search).get(`input`)===`touch`||matchMedia(`(pointer: coarse)`).matches;function ad(){tu=new bl({canvas:document.getElementById(`bg3d`),antialias:!id,alpha:!1}),tu.setPixelRatio(Math.min(devicePixelRatio,id?1.35:1.75)),nu=new Ln,nu.fog=new In(Tu.fog.getHex(),.055),ru=new Ia(58,1,.1,120),ru.position.set(0,Iu,10),ou=rd(id?480:900,.16,46,26,40,.75),su=rd(id?130:240,.32,46,26,34,.5),nu.add(ou,su),lu=new On,nu.add(lu);let e=nd([[0,`rgba(255,255,255,.75)`],[.4,`rgba(255,255,255,.25)`],[1,`rgba(255,255,255,0)`]]);for(let t=0;t<(id?5:7);t++){let t=new Zr(new Lr({map:e,transparent:!0,opacity:.1+Math.random()*.1,depthWrite:!1,blending:2})),n=14+Math.random()*22;t.scale.set(n,n*.7,1),t.position.set((Math.random()-.5)*40,(Math.random()-.5)*18-3,-12-Math.random()*22),t.userData.wob=Math.random()*Math.PI*2,lu.add(t),cu.push(t)}let t=[];for(let e=0;e<=56;e++){let n=e/56,r=Au.bottom+n*(Au.top-Au.bottom);t.push(new B(Nu(r),r))}uu=new si({color:263435,fog:!1});let n=new yi(new qi(t,9),uu);n.position.set(Au.x,0,Au.z),n.rotation.y=.35,nu.add(n);let r=new yi(new qi(t.map(e=>new B(e.x*.5,e.y*.5-10)),6),uu);r.position.set(-15,0,-30),nu.add(r);{let e=id?70:120;pu=new Lr({map:nd([[0,`rgba(255,255,255,.95)`],[.4,`rgba(255,255,255,.35)`],[1,`rgba(255,255,255,0)`]]),transparent:!0,opacity:.55,depthWrite:!1,blending:2});for(let t=0;t<e;t++){let e=Au.bottom+6+Math.random()*(Au.top-Au.bottom-10),t=Au.azBase+(Math.random()-.5)*2.4,n=Nu(e)+.12,r=new Zr(pu),i=.16+Math.random()*.26;r.scale.set(i,i,1),r.position.set(Au.x+Math.cos(t)*n,e,Au.z+Math.sin(t)*n),nu.add(r)}}du=new yi(new Yi(.32,12,12),new si({color:16777215,fog:!1})),du.position.set(Au.x,Au.top+.9,Au.z),nu.add(du),fu=new Zr(new Lr({map:nd([[0,`rgba(255,255,255,.9)`],[.3,`rgba(255,255,255,.3)`],[1,`rgba(255,255,255,0)`]]),transparent:!0,opacity:.8,depthWrite:!1,blending:2,fog:!1})),fu.scale.set(4,4,1),fu.position.copy(du.position),nu.add(fu),hu=new si({color:329485});let i=new yi(new Wi(70,24),hu);i.rotation.x=-Math.PI/2,i.position.y=-9.6,nu.add(i),mu=new si({color:395792});let a=new Ki(1,1,6);for(let e=0;e<(id?32:52);e++){let e=new yi(a,mu),t,n,r;do t=Math.random()*Math.PI*2,n=7+Math.random()*28,r=Math.sin(t)*n-8;while(r>4);let i=2+Math.random()*3.4;e.scale.set(.5+Math.random()*.9,i,.5+Math.random()*.9),e.position.set(Math.cos(t)*n,-9.6+i/2,r),nu.add(e)}{let e=nd([[0,`rgba(255,255,255,.55)`],[.5,`rgba(255,255,255,.22)`],[1,`rgba(255,255,255,0)`]]);for(let t of[Mu(1)-2.2,Mu(2)-2.2]){let n=new Lr({map:e,transparent:!0,opacity:.34,depthWrite:!1});gu.push(n);for(let e=0;e<(id?10:16);e++){let e=new Zr(n),r=10+Math.random()*14;e.scale.set(r,r*.32,1);let i,a,o;do i=Math.random()*Math.PI*2,a=5+Math.random()*22,o=Au.z+Math.sin(i)*a;while(o>-7);e.position.set(Au.x+Math.cos(i)*a,t+(Math.random()-.5)*1.6,o),e.userData.wob=Math.random()*Math.PI*2,e.userData.cloud=!0,nu.add(e),cu.push(e)}}}_u=rd(id?170:300,.13,44,26,34,.5),nu.add(_u),xu=new On,xu.position.y=Iu,Su=new si({color:131848,transparent:!0,opacity:.96,fog:!1});let o=(e,t,n,r,i)=>{let a=new yi(e,Su);return a.position.set(t,n,r),a.rotation.z=i,xu.add(a),a},s=new Ki(.55,7.5,5);o(s,-4.5,-3.1,5.3,.42),o(s,-5.3,-2.6,4.5,.78),o(s,4.7,-3.3,5.1,-.4),o(s,5.5,-2.4,4.3,-.82);let c=new Gi(.032,.032,8,5);Cu=[o(c,-4.1,5.9,5.7,.05),o(c,4.7,6.1,5.5,-.07)],nu.add(xu),iu=new kl(tu),iu.addPass(new Al(nu,ru)),au=new Ml(new B(innerWidth,innerHeight),.85,.55,.16),iu.addPass(au),iu.addPass(new Pl);let l=()=>{tu.setSize(innerWidth,innerHeight),iu.setSize(innerWidth,innerHeight),id&&au.setSize(innerWidth/2,innerHeight/2),ru.aspect=innerWidth/innerHeight,ru.updateProjectionMatrix()};l(),addEventListener(`resize`,l),addEventListener(`pointermove`,e=>{Du.x=(e.clientX/innerWidth-.5)*2,Du.y=(e.clientY/innerHeight-.5)*2}),sd(0,!0),requestAnimationFrame(dd)}var od=.85;function sd(e,t=!1){let n=Il[Math.min(e,Il.length-1)].theme;if(Eu.sky.setHex(n.sky),Eu.fog.setHex(n.fog),Eu.particles.setHex(n.particles),Eu.glow.setHex(n.glow),od=.85,vu=Math.min(e,2),yu=[.5,.42,.62][vu],t)for(let e of Object.keys(Tu))Tu[e].copy(Eu[e])}function cd(){Eu.sky.setHex(5911634),Eu.fog.setHex(9062997),Eu.particles.setHex(16767392),Eu.glow.setHex(16761976),od=1.2,yu=.12}function ld(e=1){Ou=Math.min(2.2,Ou+e),ku=Math.min(7,ku+e*2.4)}var ud=0;function dd(e){requestAnimationFrame(dd);let t=Math.min(.05,(e-ud)/1e3||.016);ud=e;let n=e/1e3;for(let e of Object.keys(Tu))Tu[e].lerp(Eu[e],Math.min(1,t*1.4));vu===2&&!wu&&Math.random()<t/11&&(bu=.7+Math.random()*.5),bu*=.008**t,nu.background=Ku.copy(Tu.sky).lerp(qu,Math.min(.6,bu*.5)),nu.fog.color.copy(Tu.fog).lerp(qu,Math.min(.4,bu*.3)),ou.material.color.copy(Tu.particles),su.material.color.copy(Tu.glow);for(let e of cu)e.userData.cloud||e.material.color.copy(Tu.fog).lerp(Tu.particles,.5),e.position.x+=Math.sin(n*.08+e.userData.wob)*.004;uu.color.copy(Tu.sky).multiplyScalar(.42),hu.color.copy(Tu.sky).multiplyScalar(.3),mu.color.copy(Tu.sky).multiplyScalar(.38),pu.color.copy(Tu.glow);for(let e of gu)e.color.copy(Tu.fog).lerp(Gu,.42);du.material.color.copy(Tu.glow),fu.material.color.copy(Tu.glow);let r=.65+Math.sin(n*1.7)*.25;fu.material.opacity=r,fu.scale.setScalar(3.2+r*1.6),su.material.opacity=.42+Math.sin(n*.9)*.12,ku+=(1-ku)*Math.min(1,t*2.5);let i=ru.position.y;for(let[e,r]of[[ou,1],[su,.55]]){let a=e.geometry.attributes.position,o=e.geometry.userData.seeds;for(let e=0;e<a.count;e++){let s=a.getY(e)+t*r*ku*(.35+o[e]%1*.5),c=a.getX(e)+Math.sin(n*.5+o[e])*t*.18;s>i+14&&(s=i-14,c=(Math.random()-.5)*46),s<i-15&&(s=i-14),a.setY(e,s),a.setX(e,c)}a.needsUpdate=!0}Ou*=.02**t;{_u.material.opacity+=(yu-_u.material.opacity)*Math.min(1,t*1.2),vu===0?_u.material.color.copy(Tu.particles).lerp(Gu,.55):vu===1?_u.material.color.copy(Tu.glow).lerp(Gu,.25):_u.material.color.copy(Tu.particles);let e=_u.geometry.attributes.position,r=_u.geometry.userData.seeds;for(let a=0;a<e.count;a++){let o=e.getX(a),s=e.getY(a),c=r[a]%1;vu===0?(s-=t*(.45+c*.55),o+=Math.sin(n*.7+r[a])*t*.5):vu===1?(s-=t*(.14+c*.2),o+=Math.sin(n*.35+r[a])*t*.9):(o-=t*(3.4+c*2.8),s-=t*(.5+c*.5)),s<i-14&&(s+=28),s>i+14&&(s-=28),o<-23&&(o+=46),o>23&&(o-=46),e.setX(a,o),e.setY(a,s)}e.needsUpdate=!0}Iu+=(Lu-Iu)*Math.min(1,t*1.6),lu.position.y=i*.93+Math.sin(n*.3)*.2;let a=Math.max(1,1.05/ru.aspect);if(Fu===`map`){let e=At.clamp(zu+1.6+Bu,1.2,15.4),t=Mu(Ru)+e*Au.rowH,n=(Math.max(Nu(t),3.1)+8.2)*a-Ou*.4,r=Au.azBase+Du.x*.06;Hu.set(Au.x+Math.cos(r)*n,t+1.1-Du.y*.5,Au.z+Math.sin(r)*n),Uu.set(Au.x,t+1.9,Au.z)}else Hu.set(Du.x*.9,Iu-Du.y*.55+Math.sin(n*.22)*.25,10+Math.sin(n*.1)*.3-Ou*.9),Uu.set(0,Iu,-6);if(xu.position.y+=(i-xu.position.y)*Math.min(1,t*2.2),Su.opacity+=((Fu===`map`?0:.96)-Su.opacity)*Math.min(1,t*3),Cu[0].rotation.z=.05+Math.sin(n*.5)*.028,Cu[1].rotation.z=-.07+Math.sin(n*.42+2)*.024,ru.position.lerp(Hu,Math.min(1,t*2.2)),Vu.lerp(Uu,Math.min(1,t*2.2)),ru.lookAt(Vu),ru.rotation.z+=Math.sin(n*.13)*.012+Ou*(Math.random()-.5)*.012,$u&&Qu){let e=[];for(let t of Qu){Wu.copy(t.pos).project(ru);let n=ru.position.distanceTo(t.pos);e.push({id:t.id,x:(Wu.x*.5+.5)*innerWidth,y:(-Wu.y*.5+.5)*innerHeight,s:At.clamp(9*a/n,.4,1.3),fade:Wu.z>1?0:At.clamp(1.3-Math.abs(t.pos.y-Vu.y)/(7.5*a),.1,1)})}$u(e)}au.strength=od+Ou*.55+bu*.45,iu.render()}var fd=matchMedia(`(prefers-reduced-motion: reduce)`).matches,pd,md,hd,gd,_d=[],vd=[],yd=0,bd=0,xd=0,Sd=0,Cd=()=>Math.min(devicePixelRatio,2);function wd(){pd=document.getElementById(`vfx`),md=pd.getContext(`2d`),hd=document.getElementById(`floaties`),gd=document.getElementById(`shake`);let e=()=>{pd.width=innerWidth*Cd(),pd.height=innerHeight*Cd()};e(),addEventListener(`resize`,e),requestAnimationFrame(Ed)}var Td=0;function Ed(e){requestAnimationFrame(Ed);let t=Math.min(.05,(e-Td)/1e3||.016);if(Td=e,e<Sd)return;let n=Cd();md.clearRect(0,0,pd.width,pd.height),md.save(),md.scale(n,n),_d=_d.filter(e=>(e.life-=t)>0);for(let e of _d){e.x+=e.vx*t,e.y+=e.vy*t,e.vy+=(e.grav||0)*t,e.vx*=1-(e.drag||0)*t,e.vy*=1-(e.drag||0)*t;let n=Math.min(1,e.life/(e.fade||.3));if(md.globalAlpha=n*(e.alpha??1),md.globalCompositeOperation=e.add?`lighter`:`source-over`,e.kind===`spark`){let t=Math.hypot(e.vx,e.vy)*.045+2,r=Math.atan2(e.vy,e.vx);md.strokeStyle=e.color,md.lineWidth=e.size*n,md.beginPath(),md.moveTo(e.x,e.y),md.lineTo(e.x-Math.cos(r)*t,e.y-Math.sin(r)*t),md.stroke()}else if(e.kind===`ring`)e.r+=e.vr*t,md.strokeStyle=e.color,md.lineWidth=Math.max(.5,e.size*n),md.beginPath(),md.arc(e.x,e.y,e.r,0,Math.PI*2),md.stroke();else if(e.kind===`slash`){e.prog=Math.min(1,(e.prog||0)+t/e.dur);let r=e.arc*e.prog;md.strokeStyle=e.color,md.lineCap=`round`;for(let t=0;t<3;t++)md.globalAlpha=n*(.9-t*.3),md.lineWidth=(e.size-t*3)*(1-e.prog*.6),md.beginPath(),md.arc(e.x,e.y,e.r+t*7,e.a0,e.a0+r),md.stroke()}else md.fillStyle=e.color,md.beginPath(),md.arc(e.x,e.y,e.size*n,0,Math.PI*2),md.fill()}md.globalCompositeOperation=`source-over`,md.globalAlpha=1,vd=vd.filter(e=>(e.life-=t)>0);for(let e of vd)md.globalAlpha=e.life/e.dur*e.alpha,md.fillStyle=e.color,md.fillRect(0,0,innerWidth,innerHeight);md.restore(),yd>.1||Math.abs(bd)>.1?(bd=(Math.random()-.5)*yd,xd=(Math.random()-.5)*yd,yd*=.001**t,gd.style.transform=`translate(${bd.toFixed(1)}px,${xd.toFixed(1)}px)`):gd.style.transform&&(gd.style.transform=``,yd=0)}function Dd(e=8){fd||(yd=Math.max(yd,e))}function Od(e=60){fd||(Sd=performance.now()+e)}function kd(e=`#fff`,t=.18,n=.25){fd||vd.push({color:e,alpha:t,dur:n,life:n})}function Ad(e,t,{color:n=`#ffd166`,n:r=18,speed:i=260,spread:a=Math.PI*2,angle:o=0,size:s=3,grav:c=300,kind:l=`spark`,add:u=!0,life:d=.5}={}){if(!fd)for(let f=0;f<r;f++){let r=o+(Math.random()-.5)*a,f=i*(.35+Math.random()*.75);_d.push({kind:l,x:e,y:t,vx:Math.cos(r)*f,vy:Math.sin(r)*f,size:s*(.6+Math.random()*.8),color:n,grav:c,drag:1.6,life:d*(.6+Math.random()*.8),fade:.25,add:u})}}function jd(e,t,n,r=8,i=420,a=4){fd||_d.push({kind:`ring`,x:e,y:t,r,vr:i,size:a,color:n,life:.45,fade:.45,add:!0})}function Md(e,t,n=`#fff`){if(fd)return;let r=-Math.PI*.85+(Math.random()-.5)*.6;_d.push({kind:`slash`,x:e,y:t,r:46+Math.random()*18,a0:r,arc:Math.PI*.8,prog:0,dur:.14,size:13,color:n,life:.3,fade:.18,add:!0})}function Nd(e,t,n,r=10){if(!fd)for(let i=0;i<r;i++)_d.push({kind:`dot`,x:e+(Math.random()-.5)*60,y:t+(Math.random()-.5)*40,vx:(Math.random()-.5)*30,vy:-40-Math.random()*60,size:2.5+Math.random()*2.5,color:n,grav:-20,life:.9+Math.random()*.5,fade:.5,add:!0,alpha:.9})}function Pd(e,t,n,r=``){let i=document.createElement(`div`);i.className=`floaty ${r}`,i.innerHTML=n,i.style.left=`${e}px`,i.style.top=`${t}px`,hd.appendChild(i);let a=(Math.random()-.5)*40,o=r.includes(`crit`),s=o?(Math.random()-.5)*16:r.includes(`dmg`)?(Math.random()-.5)*8:0,c,l=1100;o?(l=1250,c=[{transform:`translate(-50%,-50%) scale(0.5)`,opacity:0,filter:`brightness(3)`},{transform:`translate(-50%,-92%) scale(1.45) rotate(${s}deg)`,opacity:1,filter:`brightness(1.9)`,offset:.13},{transform:`translate(-50%,-110%) scale(1.05) rotate(${s}deg)`,opacity:1,filter:`brightness(1)`,offset:.34},{transform:`translate(calc(-50% + ${a}px),-230%) scale(0.98) rotate(${s}deg)`,opacity:0,filter:`brightness(1)`}]):c=r.includes(`poisonf`)?[{transform:`translate(-50%,-50%) scale(0.7)`,opacity:0},{transform:`translate(-50%,-26%) scale(1.05)`,opacity:1,offset:.2},{transform:`translate(calc(-50% + ${a*.4}px),80%) scale(0.88)`,opacity:0}]:[{transform:`translate(-50%,-50%) scale(0.6)`,opacity:0},{transform:`translate(-50%,-90%) scale(1.15) rotate(${s}deg)`,opacity:1,offset:.18},{transform:`translate(calc(-50% + ${a}px),-230%) scale(0.95) rotate(${s}deg)`,opacity:0}],i.animate(c,{duration:l,easing:`cubic-bezier(.2,.7,.3,1)`}).onfinish=()=>i.remove()}function Fd(e){let t=e.querySelector(`svg`)||e.querySelector(`img.raster-art`),n=e.getBoundingClientRect();if(!t||!n.width)return;if(fd){e.style.visibility=`hidden`;return}let r=t.tagName===`svg`?t.outerHTML:`<img src="${t.src}" alt="" style="width:100%;height:100%;object-fit:contain;display:block">`,i=50+(Math.random()-.5)*14,a=52+(Math.random()-.5)*14,o=[];for(let e=0;e<11;e++){let t=e/11*Math.PI*2+(Math.random()-.5)*.34,n=78+Math.random()*22;o.push([i+Math.cos(t)*n,a+Math.sin(t)*n,t])}for(let e=0;e<11;e++){let[t,s]=o[e],[c,l]=o[(e+1)%11],u=document.createElement(`div`);u.style.cssText=`position:fixed;left:${n.left}px;top:${n.top}px;width:${n.width}px;height:${n.height}px;pointer-events:none;z-index:57;clip-path:polygon(${i}% ${a}%,${t.toFixed(1)}% ${s.toFixed(1)}%,${c.toFixed(1)}% ${l.toFixed(1)}%);`,u.innerHTML=r,hd.appendChild(u);let d=o[e][2]+Math.PI/11,f=55+Math.random()*120,p=Math.cos(d)*f,m=Math.sin(d)*f*.7,h=(Math.random()-.5)*110;u.animate([{transform:`translate(0,0) rotate(0deg)`,opacity:1},{transform:`translate(${(p*.55).toFixed(0)}px,${(m*.55-16).toFixed(0)}px) rotate(${(h*.5).toFixed(0)}deg)`,opacity:.95,offset:.4},{transform:`translate(${p.toFixed(0)}px,${(m+110).toFixed(0)}px) rotate(${h.toFixed(0)}deg)`,opacity:0}],{duration:780+Math.random()*300,easing:`cubic-bezier(.3,.3,.6,1)`}).onfinish=()=>u.remove()}e.style.visibility=`hidden`}var Id=e=>{let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:t.top+t.height/2}},Ld=24,Rd=36,zd=.45,Bd=matchMedia(`(prefers-reduced-motion: reduce)`).matches,Vd=new URLSearchParams(location.search).get(`input`)===`touch`,Hd=()=>{let e=new URLSearchParams(location.search);return e.get(`mesh`)===`0`?!1:e.get(`mesh`)===`1`?!0:!Bd&&!Vd},Ud=(e,t,n)=>Math.exp(-((e-t)**2)/(2*n*n)),Wd={wisp:{sway:.55,bob:1.85,breathe:.95,head:.4,cloth:0,pin:1.05,float:1.35},beast:{sway:1.15,bob:.85,breathe:.65,head:.55,cloth:.2,float:0},slime:{sway:.55,bob:.55,breathe:1.35,head:0,cloth:.55,pin:1.2,float:.25},rogue:{sway:1,bob:1,breathe:1,head:1,cloth:.8,float:0},plant:{sway:.7,bob:.75,breathe:.85,head:.25,cloth:1.15,pin:1.1,float:.55},cultist:{sway:.95,bob:.95,breathe:1,head:.85,cloth:.7,float:0},golem:{sway:.28,bob:.25,breathe:.35,head:.15,cloth:0,float:0},treeboss:{sway:.4,bob:.3,breathe:.5,head:.2,cloth:.6,float:0},zombie:{sway:.7,bob:.5,breathe:.6,head:.4,cloth:.3,float:0},serpent:{sway:.95,bob:.65,breathe:.45,head:.35,cloth:.15,float:.15},crawler:{sway:.9,bob:.6,breathe:.55,head:.45,cloth:.1,float:0},crab:{sway:.5,bob:.35,breathe:.4,head:.2,cloth:0,float:0},maw:{sway:.65,bob:.45,breathe:.7,head:.5,cloth:0,float:.1},knight:{sway:.85,bob:.7,breathe:.75,head:.7,cloth:.5,float:0},siren:{sway:1.05,bob:1.25,breathe:.8,head:.6,cloth:.9,pin:1.1,float:.85},leviathan:{sway:.35,bob:.25,breathe:.45,head:.3,cloth:.2,float:0},shade:{sway:.9,bob:1.05,breathe:.7,head:.5,cloth:.6,pin:1.1,float:.7},eye:{sway:.35,bob:1.45,breathe:1,head:0,cloth:0,pin:.95,float:1.2},sovereign:{sway:.45,bob:.35,breathe:.55,head:.45,cloth:.35,float:0},humanoid:{sway:1,bob:1,breathe:1,head:1,cloth:.85,float:0}},Gd,Kd,qd,Jd=[],Yd=0,Xd=1,Zd=1,Qd=new Map,$d=new Oa;function ef(e,t){if(Qd.has(e)){let n=Qd.get(e);return n.image?.width&&t?.(n),n}let n=$d.load(e,e=>{e.colorSpace=Ve,t?.(e)});return Qd.set(e,n),n}function tf(e,t){if(e?.naturalWidth>0)return e.naturalWidth/e.naturalHeight;let n=t?.image;return n?.width>0?n.width/n.height:1}function nf(e,t,n){return!n||n<=0?{w:e,h:t}:n>=e/t?{w:e,h:e/n}:{w:t*n,h:t}}function rf(e,t,n,r){let i=new Ji(2,2,Ld,Rd),a={geo:i,base:i.attributes.position.array.slice(),profile:t,seed:n,el:null,aspect:tf(r,null)||2/3},o=ef(e,e=>{a.aspect=tf(r,e)}),s=new yi(i,new si({map:o,transparent:!0,depthTest:!1}));return s.renderOrder=1,Kd.add(s),a.mesh=s,r&&!r.complete&&r.addEventListener(`load`,()=>{a.aspect=tf(r,o)},{once:!0}),a}function af(e,t){let n=e.geo.attributes.position,r=e.profile;for(let i=0;i<n.count;i++){let a=e.base[i*3],o=e.base[i*3+1],s=(o+1)/2,c=s**+(r.pin??1.6),l=0,u=0;l+=.028*c*r.sway*Math.sin(t*.9+e.seed),l+=.01*c*c*r.sway*Math.sin(t*1.7+1+e.seed*.3);let d=Ud(s,.62,.12);l+=a*.02*d*r.breathe*Math.sin(t*2.2+e.seed*.5),u+=.012*d*r.breathe*Math.sin(t*2.2+e.seed*.5),u+=.014*c*r.bob*Math.sin(t*1.1+.4+e.seed),l+=.012*Math.max(0,(s-.8)/.2)*r.head*Math.sin(t*.7+e.seed),l+=.01*Math.max(0,(.45-s)/.45)*c*r.cloth*Math.sin(s*12-t*2.5+e.seed),n.array[i*3]=a+l*zd,n.array[i*3+1]=o+u*zd}n.needsUpdate=!0}function of(e,t=0){let n=e.el.getBoundingClientRect();if(n.width<2||n.height<2){e.mesh.visible=!1;return}e.aspect=tf(e.el.querySelector(`.raster-art`),e.mesh.material.map)||e.aspect||1;let{w:r,h:i}=nf(n.width,n.height,e.aspect),a=(e.profile.float||0)*Math.sin(t*1.15+e.seed*.7)*12*zd;e.mesh.visible=!0,e.mesh.position.set(n.left+n.width/2-Xd/2,-(n.top+n.height/2-Zd/2)+a,0),e.mesh.scale.set((e.flip?-1:1)*r/2,i/2,1)}function sf(){Xd=innerWidth,Zd=innerHeight,Gd.setSize(Xd,Zd,!1),qd.left=-Xd/2,qd.right=Xd/2,qd.top=Zd/2,qd.bottom=-Zd/2,qd.updateProjectionMatrix()}function cf(e){if(!Jd.length)return;let t=e*.001;for(let e of Jd)af(e,t),of(e,t);Gd.render(Kd,qd)}function lf(){let e=document.getElementById(`mesh`);!e||Gd||(Gd=new bl({canvas:e,alpha:!0,antialias:!0,powerPreference:`high-performance`}),Gd.setClearColor(0,0),Gd.setPixelRatio(Math.min(devicePixelRatio,2)),Kd=new Ln,qd=new La(-1,1,1,-1,.1,100),qd.position.z=10,sf(),addEventListener(`resize`,sf))}function uf(){cancelAnimationFrame(Yd),Yd=0;for(let e of Jd)e.el?.classList.remove(`mesh-live`),Kd.remove(e.mesh),e.geo.dispose(),e.mesh.material.dispose();Jd=[],document.documentElement.classList.remove(`mesh-on`),Gd?.render(Kd,qd)}function df(e){if(uf(),!Hd()||(Gd||lf(),!Gd))return;for(let{el:t,url:n,kind:r,flip:i}of e){if(!n||!t)continue;let e=t.querySelector(`.raster-art`);if(!e)continue;t.classList.add(`mesh-live`);let a=Wd[r]||Wd.humanoid,o=rf(n,a,Math.random()*10,e);o.el=t,o.flip=!!i,o.profile=a,Jd.push(o)}if(!Jd.length)return;document.documentElement.classList.add(`mesh-on`);let t=e=>{Yd=requestAnimationFrame(t),cf(e)};Yd=requestAnimationFrame(t)}var ff=()=>({enabled:Hd(),planes:Jd.length,renderer:!!Gd,looping:!!Yd,intensity:zd}),pf=t({MAP_COLS:()=>7,MAP_ROWS:()=>15,addCardToDeck:()=>Ep,addStatus:()=>qf,applyEventOps:()=>Lp,availableNodes:()=>Df,canKindle:()=>rp,canPlay:()=>mp,canUseArt:()=>ep,cardData:()=>wf,cardPool:()=>jf,claimMonument:()=>kf,clamp:()=>_f,clearSave:()=>Pp,drawCards:()=>up,duplicateCardInDeck:()=>kp,effCost:()=>pp,endTurn:()=>yp,enemyMove:()=>Yf,gainEmbers:()=>Xf,gainPotion:()=>If,gainRelic:()=>Pf,genCombatRewards:()=>zf,genMap:()=>Ef,genShop:()=>Vf,hasRelic:()=>Af,healPlayer:()=>Nf,kindleFromHand:()=>ap,loadRun:()=>Np,loadStats:()=>Fp,makeCard:()=>Cf,makeRng:()=>mf,newRun:()=>vf,omenMods:()=>xf,playCard:()=>hp,previewAttack:()=>Sp,previewBlock:()=>Cp,previewEnemyDmg:()=>wp,previewPlay:()=>Tp,randomRelic:()=>Ff,recordRunEnd:()=>Ip,relicPool:()=>Mf,removeCardFromDeck:()=>Dp,restHealFrac:()=>Sf,rollBossRelics:()=>Bf,rollCardReward:()=>Lf,rollEncounter:()=>Uf,rollEvent:()=>Hf,rollEventCards:()=>Rf,rollOmen:()=>bf,runRng:()=>Tf,saveRun:()=>Mp,startCombat:()=>Wf,upgradeCardInDeck:()=>Op,useArt:()=>tp,usePotion:()=>vp,visitNode:()=>Of,vowMods:()=>yf});function mf(e){let t=()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296};return t.getState=()=>e,t}var hf=(e,t)=>t[Math.floor(e()*t.length)],gf=(e,[t,n])=>t+Math.floor(e()*(n-t+1)),_f=(e,t,n)=>Math.max(t,Math.min(n,e));function vf(e=Math.random()*2**31|0,t={}){let n=_f(t.aspect||0,0,Ql.length-1),r=Ql[n],i={v:2,seed:e,rngState:e,uid:1,act:0,nodeId:null,floorsClimbed:0,aspect:n,vow:_f(t.vow||0,0,$l.length),art:t.art||r.art||`flare`,omens:[],boon:t.boon||null,unlocks:[...t.unlocks||[]],monument:t.monument?{...t.monument,claimed:!1}:null,player:{hp:r.maxHp,maxHp:r.maxHp,gold:r.startGold,energyMax:r.energy,relics:[r.startRelic],potions:Array(r.potionSlots||3).fill(null),deck:[]},stats:{slain:0,elites:0,bosses:0,dmgDealt:0,dmgTaken:0,cardsPlayed:0,goldEarned:0,shatters:0,kindles:0,perfects:0,smolderKills:0,unlitVisited:0,embersSpent:0,start:Date.now()},map:null};t.lamplighter&&(i.pendingLamplighter=!0);for(let e of r.startDeck)i.player.deck.push(Cf(i,e));return yf(i).startHex&&i.player.deck.push(Cf(i,`hex`)),i.omens.push(bf(i)),i.map=Ef(i),i}function yf(e){let t={hpMult:1,enemyDmgBonus:0,bossFacetDelta:0,startHex:!1},n=_f(e.vow||0,0,$l.length);for(let e=0;e<n;e++){let n=$l[e].mods;n.hpMult&&(t.hpMult*=n.hpMult),n.enemyDmgBonus&&(t.enemyDmgBonus+=n.enemyDmgBonus),n.bossFacetDelta&&(t.bossFacetDelta+=n.bossFacetDelta),n.startHex&&(t.startHex=!0),n.restHealFrac!=null&&(t.restHealFrac=Math.min(t.restHealFrac??1,n.restHealFrac))}return t}function bf(e){return hf(Tf(e),Object.keys(Jl))}function xf(e){return Jl[e.omens?.[e.act]]?.mods||{}}function Sf(e){return Math.min(.3,xf(e).restHealFrac??.3,yf(e).restHealFrac??.3)}function Cf(e,t,n=!1){return{uid:e.uid++,id:t,up:n,bonus:0}}function wf(e){let t=Ll[e.id];return e.up&&t.up?{...t,...t.up,name:t.name+`+`}:t}function Tf(e){let t=mf(e.rngState);return()=>{let n=t();return e.rngState=t.getState(),n}}function Ef(e){let t=Tf(e),n={},r=(e,t)=>`${e},${t}`,i=(e,i)=>(n[r(e,i)]||(n[r(e,i)]={id:r(e,i),row:e,col:i,type:`monster`,next:[],jx:(t()-.5)*.5,jy:(t()-.5)*.4}),n[r(e,i)]),a=new Set;for(let e=0;e<6;e++){let n;do n=Math.floor(t()*7);while(e<2&&a.has(n));a.add(n);let r=i(0,n);for(let e=1;e<14;e++){let n=_f(r.col+(Math.floor(t()*3)-1),0,6),a=i(e,n);r.next.includes(a.id)||r.next.push(a.id),r=a}let o=i(14,3);r.next.includes(o.id)||r.next.push(o.id)}let o=Object.values(n),s=!1;for(let e of o){if(e.row===0)e.type=`monster`;else if(e.row===14)e.type=`boss`;else if(e.row===13)e.type=`rest`;else if(e.row===8)e.type=`treasure`;else{let n=t();n<.46?e.type=`monster`:n<.68?e.type=`event`:n<.81&&e.row>=5?e.type=`elite`:n<.91&&e.row>=4&&e.row<12?e.type=`rest`:e.row>=4?e.type=`shop`:e.type=`monster`}e.type===`shop`&&(s=!0)}if(!s){let e=o.filter(e=>e.type===`monster`&&e.row>=5&&e.row<=11);e.length&&(hf(t,e).type=`shop`)}for(let n of o)n.row===0||n.row===8||n.row>=13||t()<.15&&(n.unlit=!0,n.bounty=gf(t,[12,22])+e.act*6);if(e.monument&&!e.monument.claimed&&e.monument.act===e.act){let t=_f(e.monument.row||5,1,12),n=o.filter(e=>e.type===`shop`).length===1,r=o.filter(e=>e.row>0&&e.row<13&&e.row!==8&&e.type!==`boss`&&!(n&&e.type===`shop`));if(r.length){let e=r.reduce((e,n)=>Math.abs(n.row-t)<Math.abs(e.row-t)?n:e);e.type=`monument`,delete e.unlit,delete e.bounty}}return{nodes:o,visited:[]}}function Df(e){let{nodes:t,visited:n}=e.map;if(!e.nodeId)return t.filter(e=>e.row===0);let r=t.find(t=>t.id===e.nodeId);return t.filter(e=>r.next.includes(e.id))}function Of(e,t){e.nodeId=t.id,e.floorsClimbed=t.row+1,e.map.visited.includes(t.id)||e.map.visited.push(t.id);let n=0;return t.unlit&&(delete t.unlit,n=(t.bounty||0)*(Af(e,`thiefOfWicks`)?2:1),delete t.bounty,e.player.gold+=n,e.stats.goldEarned+=n,e.stats.unlitVisited++),{type:t.type,bounty:n}}function kf(e){let t=e.monument;if(!t||t.claimed||!t.bequest)return null;t.claimed=!0;let n=t.bequest;return n.kind===`card`?Ep(e,n.id,n.up):n.kind===`relic`?Pf(e,n.id):n.kind===`gold`&&(e.player.gold+=n.amount,e.stats.goldEarned+=n.amount),n}var Af=(e,t)=>e.player.relics.includes(t);function jf(e,t){let n=(e.unlocks||[]).filter(e=>e.startsWith(`card:`)).map(e=>e.slice(5)).filter(e=>Ll[e]&&Ll[e].rarity===t);return n.length?[...Rl[t],...n]:Rl[t]}function Mf(e,t){let n=(e.unlocks||[]).filter(e=>e.startsWith(`relic:`)).map(e=>e.slice(6)).filter(e=>Bl[e]&&Bl[e].rarity===t);return n.length?[...Vl[t],...n]:Vl[t]}function Nf(e,t,n=null){Af(e,`sunBlossom`)&&(t=Math.round(t*1.5));let r=n?n.player:e.player,i=r.hp;r.hp=_f(r.hp+t,0,r.maxHp);let a=r.hp-i;return n&&a>0&&n.queue.push({t:`heal`,who:`player`,n:a}),a}function Pf(e,t,n=null){let r=Bl[t];if(r){if(r.replaces){let t=e.player.relics.indexOf(r.replaces);t>=0&&e.player.relics.splice(t,1)}e.player.relics.push(t),t===`sweetRoot`&&(e.player.maxHp+=8,e.player.hp+=8),t===`hollowCrown`&&(e.player.energyMax+=1,e.player.maxHp=Math.max(1,e.player.maxHp-10),e.player.hp=Math.min(e.player.hp,e.player.maxHp))}}function Ff(e,t={common:.5,uncommon:.35,rare:.15}){let n=Tf(e),r=new Set(e.player.relics),i=[`common`,`uncommon`,`rare`],a=n(),o=`common`,s=0;for(let e of i)if(s+=t[e]||0,a<s){o=e;break}let c=i.indexOf(o);for(let t=0;t<i.length;t++){let a=i[(c+t)%i.length],o=Mf(e,a).filter(e=>!r.has(e));if(o.length)return hf(n,o)}return null}function If(e,t){t===`random`&&(t=hf(Tf(e),Object.keys(Hl)));let n=e.player.potions.indexOf(null);return n<0?!1:(e.player.potions[n]=t,!0)}function Lf(e,t=`normal`){let n=Tf(e),r=3+ +!!Af(e,`seersOrb`)+(xf(e).rewardChoiceBonus||0),i=[],a=new Set;for(;i.length<r&&a.size<40;){let r;if(t===`boss`)r=`rare`;else{let e=n();r=t===`elite`?e<.45?`common`:e<.85?`uncommon`:`rare`:e<.6?`common`:e<.92?`uncommon`:`rare`}let o=hf(n,jf(e,r));a.add(o+Math.floor(n()*4)),i.includes(o)||i.push(o)}return i}function Rf(e,t){let n=Tf(e),r=[...jf(e,`common`),...jf(e,`common`),...jf(e,`uncommon`),...jf(e,`uncommon`),...jf(e,`rare`)],i=[],a=0;for(;i.length<t&&a++<60;){let e=r[Math.floor(n()*r.length)];i.includes(e)||i.push(e)}return i}function zf(e,t,n=null){let r=Tf(e),i=gf(r,Kl[e.act][t===`boss`?`boss`:t===`elite`?`elite`:`normal`]);i=Math.round(i*(xf(e).goldMult||1)*(Yl[n]?.mods.goldMult||1));let a={gold:i,cards:Lf(e,t),potion:null,relic:null};return t!==`boss`&&r()<.4&&(a.potion=hf(r,Object.keys(Hl))),t===`elite`&&(a.relic=Ff(e)),a}function Bf(e){let t=Tf(e),n=new Set(e.player.relics),r=Mf(e,`boss`).filter(e=>!n.has(e)),i=[];for(;i.length<Math.min(3,r.length);){let e=hf(t,r);i.includes(e)||i.push(e)}return i}function Vf(e){let t=Tf(e),n=([e,n],r)=>Math.round(gf(t,[e,n])*r),r=(Af(e,`merchantsMark`)?.75:1)*(xf(e).shopMult||1),i=[];for(let a of[`common`,`common`,`uncommon`,`uncommon`,`rare`]){let o,s=0;do o=hf(t,jf(e,a));while(i.some(e=>e.id===o)&&++s<20);i.push({id:o,price:n(ql.cardPrice[a],r),sold:!1})}let a=new Set(e.player.relics),o=[];for(let i of[`common`,`uncommon`]){let s=Mf(e,i).filter(e=>!a.has(e)&&!o.some(t=>t.id===e));s.length&&o.push({id:hf(t,s),price:n(ql.relicPrice[i],r),sold:!1})}let s=[];for(let e=0;e<2;e++)s.push({id:hf(t,Object.keys(Hl)),price:n(ql.potionPrice,r),sold:!1});return{cards:i,relics:o,potions:s,removeCost:Math.round(ql.removeCost*r),removed:!1}}function Hf(e){let t=Tf(e),n=e.seenEvents||=[],r=Object.keys(Gl).filter(e=>!n.includes(e));r.length||(e.seenEvents=[],r=Object.keys(Gl));let i=hf(t,r);return n.push(i),i}function Uf(e,t,n){let r=Tf(e),i=Wl[e.act],a=t===`boss`?i.boss:t===`elite`?i.elite:n<3?i.weak:i.normal,o=e.lastEnc,s,c=0;do s=hf(r,a);while(a.length>1&&s.join()===o&&++c<8);return e.lastEnc=s.join(),s}function Wf(e,t,n=`normal`,r={}){let i=Tf(e),a=xf(e),o=yf(e),s=n===`elite`?r.affix||hf(i,Object.keys(Yl)):null,c=s?Yl[s].mods:{},l={kind:n,affix:s,turn:0,over:!1,result:null,queue:[],player:{hp:e.player.hp,maxHp:e.player.maxHp,block:0,energy:0,energyMax:e.player.energyMax,statuses:{}},enemies:t.map((e,t)=>{let n=Ul[e];return{key:e,idx:t,name:n.name,maxHp:Math.round(gf(i,n.hp)*(a.hpMult||1)*(c.hpMult||1)*(o.hpMult||1)),block:c.startBlock||0,statuses:{...n.startStatus||{}},flags:c.adamant?{adamant:!0}:{},lastMoves:[],moveKey:null,elite:!!n.elite,boss:!!n.boss,facetMax:Math.max(2,(n.facets??(n.boss?6:n.elite?5:4))+(a.facetDelta||0)+(c.facetDelta||0)+(n.boss&&o.bossFacetDelta||0)),chips:0}}),draw:[],hand:[],discard:[],exhaust:[],embers:0,emberCap:9,artUsedTurn:0,kindledTurn:0,kindlesThisTurn:0,pendingChips:null,counters:{played:0,attacks:0,firstCardPlayed:!1,hpLost:0}};l.enemies.forEach(e=>e.hp=e.maxHp);for(let e of l.enemies)for(let[t,n]of Object.entries({...a.enemyStartStatus||{},...c.startStatus||{}}))e.statuses[t]=(e.statuses[t]||0)+n;a.startEmbers&&(l.embers=_f(a.startEmbers,0,l.emberCap)),l.draw=e.player.deck.map(e=>({...e,bonus:0})),Gf(i,l.draw);let u=l.player;return Af(e,`basaltIdol`)&&(u.block+=10,Kf(l,`basaltIdol`)),Af(e,`warFetish`)&&(qf(l,u,`str`,1),Kf(l,`warFetish`)),Af(e,`riverPearl`)&&(qf(l,u,`dex`,1),Kf(l,`riverPearl`)),Af(e,`thornBand`)&&(qf(l,u,`thorns`,2),Kf(l,`thornBand`)),Af(e,`vialOfLife`)&&(Nf(e,2,l),Kf(l,`vialOfLife`)),Af(e,`crownOfCinders`)&&(l.emberCap=12,l.embers=_f(l.embers+2,0,l.emberCap),Kf(l,`crownOfCinders`)),Af(e,`shatterersCrown`)&&(l.enemies.forEach(e=>{e.facetMax=Math.max(2,e.facetMax-1),e.statuses.str=(e.statuses.str||0)+1}),Kf(l,`shatterersCrown`)),Af(e,`smolderingCoal`)&&(l.enemies.forEach(e=>e.statuses.poison=(e.statuses.poison||0)+2),Kf(l,`smolderingCoal`)),Af(e,`ashenCore`)&&(l.enemies.forEach(e=>e.statuses.poison=(e.statuses.poison||0)+3),Kf(l,`ashenCore`)),Jf(e,l),fp(e,l),l}function Gf(e,t){for(let n=t.length-1;n>0;n--){let r=Math.floor(e()*(n+1));[t[n],t[r]]=[t[r],t[n]]}}function Kf(e,t){e.queue.push({t:`relicProc`,id:t})}function qf(e,t,n,r){t.statuses[n]=(t.statuses[n]||0)+r,t.statuses[n]===0&&delete t.statuses[n],e.queue.push({t:`status`,who:t===e.player?`player`:t.idx,id:n,n:r})}function Jf(e,t){let n=Tf(e);for(let e of t.enemies)e.hp<=0||(e.moveKey=Ul[e.key].ai({turn:t.turn+1,last:e.lastMoves[e.lastMoves.length-1],prev:e.lastMoves[e.lastMoves.length-2],rng:n,hpFrac:e.hp/e.maxHp,self:e}),t.queue.push({t:`intent`,idx:e.idx,move:e.moveKey}))}function Yf(e){return Ul[e.key].moves[e.moveKey]}function Xf(e,t,n){let r=_f(t.embers+n,0,t.emberCap),i=r-t.embers;return i?(t.embers=r,t.queue.push({t:`ember`,n:i,total:t.embers}),i):0}function Zf(e,t,n,r){if(!(t.over||n.hp<=0||r<=0))for(n.chips+=r,t.queue.push({t:`chip`,idx:n.idx,n:r,chips:Math.min(n.chips,n.facetMax),facetMax:n.facetMax});n.chips>=n.facetMax&&n.hp>0;)n.chips-=n.facetMax,Qf(e,t,n)}function Qf(e,t,n){if(n.facetMax+=1,n.flags.adamant&&!n.flags.adamantSpent){n.flags.adamantSpent=!0,t.queue.push({t:`adamantHold`,idx:n.idx});return}e.stats.shatters++,n.flags.staggered=!0,t.queue.push({t:`shatter`,idx:n.idx,facetMax:n.facetMax}),qf(t,n,`vulnerable`,2),Xf(e,t,2),Af(e,`prismCharm`)&&!t.prismProcd&&(t.prismProcd=!0,Xf(e,t,2),Kf(t,`prismCharm`));let r=n.statuses.poison||0;if(r&&t.enemies.some(e=>e!==n&&e.hp>0)&&(delete n.statuses.poison,$f(e,t,n,r)),Af(e,`bellOfEndings`)){Kf(t,`bellOfEndings`);for(let r of t.enemies.filter(e=>e!==n&&e.hp>0)){if(t.over)break;op(e,t,r,4,{isAttack:!1})}}}function $f(e,t,n,r){if(!r)return;let i=t.enemies.filter(e=>e!==n&&e.hp>0);if(!i.length)return;let a=hf(Tf(e),i);qf(t,a,`poison`,r),t.queue.push({t:`smolderJump`,from:n.idx,to:a.idx,n:r})}function ep(e,t){let n=Xl[e.art];return!!n&&!t.over&&t.artUsedTurn!==t.turn&&t.embers>=n.cost}function tp(e,t){if(!ep(e,t))return!1;let n=Xl[e.art];t.artUsedTurn=t.turn,e.stats.embersSpent+=n.cost,Xf(e,t,-n.cost),t.queue.push({t:`art`,id:e.art});for(let r of n.effects){if(t.over)break;np(e,t,r)}return!0}function np(e,t,n){let r=t.player,i=()=>t.enemies.filter(e=>e.hp>0);switch(n.kind){case`dmg`:for(let r of i())t.over||op(e,t,r,n.n,{isAttack:!1});break;case`status`:if(n.who===`self`)qf(t,r,n.id,n.n);else for(let e of i())qf(t,e,n.id,n.n);break;case`block`:lp(e,t,r,n.n,!1);break;case`heal`:Nf(e,n.n,t);break;case`energy`:r.energy+=n.n,t.queue.push({t:`energy`,n:r.energy});break;case`draw`:up(e,t,n.n);break;case`chip`:for(let r of i())Zf(e,t,r,n.n);break;case`ember`:Xf(e,t,n.n);break}}function rp(e,t,n){return!n||t.over||wf(n).type===`curse`?!1:!(t.kindledTurn===t.turn&&t.kindlesThisTurn>=ip(e))}function ip(e){return Af(e,`crownOfTithes`)?2:1}function ap(e,t,n){let r=t.hand.findIndex(e=>e.uid===n);if(r<0)return!1;let i=t.hand[r];return rp(e,t,i)?(t.kindledTurn!==t.turn&&(t.kindledTurn=t.turn,t.kindlesThisTurn=0),t.kindlesThisTurn++,t.hand.splice(r,1),e.stats.kindles++,t.queue.push({t:`kindle`,uid:i.uid,id:i.id}),dp(e,t,i),Af(e,`crownOfTithes`)&&(lp(e,t,t.player,3,!1),Kf(t,`crownOfTithes`)),!0):!1}function op(e,t,n,r,{isAttack:i=!0,mult:a=1}={}){if(n.hp<=0||t.over)return 0;let o=t.player,s=r;i&&(s+=o.statuses.str||0,o.statuses.weak&&(s=Math.floor(s*.75)),n.statuses.vulnerable&&(s=Math.floor(s*1.5))),s=Math.max(0,Math.floor(s*a));let c=Math.min(n.block,s);n.block-=c;let l=s-c;if(n.hp-=l,e.stats.dmgDealt+=l,t.queue.push({t:`hitEnemy`,idx:n.idx,amount:l,blocked:c,hpAfter:Math.max(0,n.hp),dead:n.hp<=0,killingBlow:n.hp<=0&&l>0,overkill:Math.max(0,-n.hp)}),t.pendingChips&&i&&l>0){let e=t.pendingChips.get(n.idx)||{hit:!1,extra:0};e.hit=!0,t.pendingChips.set(n.idx,e)}return i&&n.statuses.thorns&&n.hp>0&&cp(e,t,n.statuses.thorns,{source:`thorns`,isAttack:!1}),n.hp<=0&&sp(e,t,n),l}function sp(e,t,n){n.hp=0;let r=n.statuses.poison||0;if(n.statuses={},n.flags.staggered=!1,t.queue.push({t:`die`,idx:n.idx}),e.stats.slain++,n.elite&&e.stats.elites++,n.boss&&e.stats.bosses++,t.enemies.every(e=>e.hp<=0)){bp(e,t);return}Xf(e,t,1),$f(e,t,n,r),Af(e,`reapersBell`)&&(t.player.energy+=1,up(e,t,1),Kf(t,`reapersBell`),t.queue.push({t:`energy`,n:t.player.energy}))}function cp(e,t,n,{source:r=`self`,isAttack:i=!1,attacker:a=null}={}){if(t.over)return 0;let o=t.player,s=n;i&&a&&(s+=(a.statuses.str||0)+(a.flags.rampBonus||0)+(xf(e).enemyDmgBonus||0)+(yf(e).enemyDmgBonus||0),a.statuses.weak&&(s=Math.floor(s*.75)),o.statuses.vulnerable&&(s=Math.floor(s*1.5)),Af(e,`wardingCharm`)&&s<=5&&s>0&&(s=1,Kf(t,`wardingCharm`))),s=Math.max(0,s);let c=0;(i||r===`thorns`)&&(c=Math.min(o.block,s),o.block-=c);let l=s-c;if(o.hp-=l,e.stats.dmgTaken+=Math.max(0,l),t.counters.hpLost+=Math.max(0,l),t.queue.push({t:`hitPlayer`,amount:l,blocked:c,hpAfter:Math.max(0,o.hp),source:r}),o.hp<=0)return xp(e,t),l;if(i&&a){let n={...xf(e).playerHitApplies||{},...t.affix&&Yl[t.affix].mods.attackApplies||{}};for(let[e,r]of Object.entries(n))qf(t,o,e,r);o.statuses.thorns&&a.hp>0&&op(e,t,a,o.statuses.thorns,{isAttack:!1})}return l}function lp(e,t,n,r,i=!0){let a=r;return n===t.player&&i&&(a+=n.statuses.dex||0,n.statuses.frail&&(a=Math.floor(a*.75))),a=Math.round(Math.max(0,a)*(xf(e).wardMult||1)),n.block+=a,t.queue.push({t:`blockGain`,who:n===t.player?`player`:n.idx,n:a,total:n.block}),a}function up(e,t,n){let r=Tf(e);for(let e=0;e<n&&!(t.hand.length>=10);e++){if(!t.draw.length){if(!t.discard.length)break;t.draw=t.discard,t.discard=[],Gf(r,t.draw),t.queue.push({t:`reshuffle`})}let e=t.draw.pop();t.hand.push(e),t.queue.push({t:`draw`,uid:e.uid,id:e.id})}}function dp(e,t,n){t.exhaust.push(n),t.queue.push({t:`exhaust`,uid:n.uid}),Xf(e,t,1),Af(e,`verdantBranch`)&&(up(e,t,1),Kf(t,`verdantBranch`))}function fp(e,t){if(t.over)return;t.turn++;let n=t.player;if(t.queue.push({t:`turn`,n:t.turn}),n.statuses.poison&&(cp(e,t,n.statuses.poison,{source:`poison`}),n.statuses.poison--,n.statuses.poison||delete n.statuses.poison,t.over))return;n.statuses.barricade||(n.block=0),n.statuses.ritual&&qf(t,n,`str`,n.statuses.ritual),n.statuses.emberflow&&Xf(e,t,n.statuses.emberflow);let r=n.energyMax+(n.statuses.energized||0);t.turn===1&&Af(e,`emberLantern`)&&(r+=1,Kf(t,`emberLantern`)),n.energy=(Af(e,`frozenCore`)?n.energy:0)+r,t.counters.firstCardPlayed=!1,t.queue.push({t:`energy`,n:n.energy});let i=5+(n.statuses.nightsight||0)+(xf(e).drawDelta||0);t.turn===1&&Af(e,`travelersPack`)&&(i+=2,Kf(t,`travelersPack`)),up(e,t,Math.max(1,i))}function pp(e,t,n){let r=wf(n);return r.cost==null?null:Af(e,`duskmirror`)&&!t.counters.firstCardPlayed?0:xf(e).firstCardDiscount&&!t.counters.firstCardPlayed?Math.max(0,r.cost-xf(e).firstCardDiscount):r.cost}function mp(e,t,n,r){if(t.over)return!1;let i=wf(n);return!(i.unplayable||pp(e,t,n)>t.player.energy||i.target===`enemy`&&(r==null||!t.enemies[r]||t.enemies[r].hp<=0))}function hp(e,t,n,r=null){let i=t.hand.findIndex(e=>e.uid===n);if(i<0)return!1;let a=t.hand[i],o=wf(a);if(!mp(e,t,a,r))return!1;let s=t.player,c=pp(e,t,a);s.energy-=c,Af(e,`duskmirror`)&&!t.counters.firstCardPlayed&&o.cost>0&&Kf(t,`duskmirror`),t.counters.firstCardPlayed=!0,t.hand.splice(i,1),t.counters.played++,e.stats.cardsPlayed++,t.queue.push({t:`play`,uid:a.uid,id:a.id,targetIdx:r}),t.queue.push({t:`energy`,n:s.energy});let l=1;o.type===`attack`&&(t.counters.attacks++,Af(e,`ironTalisman`)&&t.counters.attacks%3==0&&(qf(t,s,`str`,1),Kf(t,`ironTalisman`)),Af(e,`executionersSeal`)&&t.counters.attacks%10==0&&(l=2,Kf(t,`executionersSeal`)));let u=r==null?null:t.enemies[r],d=()=>t.enemies.filter(e=>e.hp>0);t.pendingChips=new Map;for(let n of o.effects){if(t.over)break;gp(e,t,a,o,n,u,l)}if(t.pendingChips&&!t.over){let n=o.type===`attack`?1+(o.chip||0)+(s.statuses.beacon||0):0;for(let[r,i]of t.pendingChips){let a=t.enemies[r];if(!a||a.hp<=0||t.over)continue;let o=(i.hit?n:0)+i.extra;o>0&&Zf(e,t,a,o)}}if(t.pendingChips=null,!t.over&&o.type===`attack`&&s.statuses.venomous){let e=o.target===`allEnemies`?d():u&&u.hp>0?[u]:[];for(let n of e)qf(t,n,`poison`,s.statuses.venomous)}return!t.over&&Af(e,`silkFan`)&&t.counters.played%3==0&&(lp(e,t,s,3,!1),Kf(t,`silkFan`)),o.type===`power`?t.queue.push({t:`powerConsumed`,uid:a.uid}):o.exhaust?dp(e,t,a):t.discard.push(a),!0}function gp(e,t,n,r,i,a,o){let s=t.player,c=r.target===`allEnemies`?t.enemies.filter(e=>e.hp>0):a?[a]:[];switch(i.kind){case`dmg`:{let n=i.times||1;for(let a=0;a<n;a++)for(let n of r.target===`allEnemies`?t.enemies.filter(e=>e.hp>0):c){if(t.over)return;op(e,t,n,i.n,{mult:o})}break}case`block`:lp(e,t,s,i.n);break;case`draw`:up(e,t,i.n);break;case`energy`:s.energy+=i.n,t.queue.push({t:`energy`,n:s.energy});break;case`heal`:Nf(e,i.n,t);break;case`loseHp`:cp(e,t,i.n,{source:`self`});break;case`status`:if(i.who===`self`)qf(t,s,i.id,i.n);else if(i.who===`allEnemies`)for(let e of t.enemies.filter(e=>e.hp>0))qf(t,e,i.id,i.n);else a&&a.hp>0&&qf(t,a,i.id,i.n);break;case`addCard`:for(let n=0;n<(i.n||1);n++){let n={uid:e.uid++,id:i.id,up:!1,bonus:0};(i.where===`hand`&&t.hand.length<10?t.hand:t.discard).push(n),t.queue.push({t:`addCard`,id:i.id,where:i.where||`discard`})}break;case`chip`:for(let n of c)if(!(n.hp<=0))if(t.pendingChips){let e=t.pendingChips.get(n.idx)||{hit:!1,extra:0};e.extra+=i.n,t.pendingChips.set(n.idx,e)}else Zf(e,t,n,i.n);break;case`ember`:Xf(e,t,i.n);break;case`special`:_p(e,t,n,r,i,a,o)}}function _p(e,t,n,r,i,a,o){let s=t.player;switch(i.id){case`leech`:{let n=op(e,t,a,i.n,{mult:o});n>0&&Nf(e,Math.floor(n/2),t);break}case`execute`:{let n=a.statuses.vulnerable?i.bonus:0;op(e,t,a,i.n+n,{mult:o});break}case`momentum`:op(e,t,a,i.n+n.bonus,{mult:o}),n.bonus+=i.grow;break;case`phantom`:op(e,t,a,i.n*t.hand.length,{mult:o});break;case`devour`:op(e,t,a,i.n,{mult:o}),a.hp<=0&&(t.over?Nf(e,i.heal):(Xf(e,t,i.embers),Nf(e,i.heal,t)));break;case`doubleBlock`:lp(e,t,s,s.block,!1);break;case`catalyst`:a.statuses.poison&&qf(t,a,`poison`,a.statuses.poison*(i.n-1));break;case`shatterEcho`:{let n=a.flags.staggered||a.statuses.vulnerable?2:1;op(e,t,a,i.n*n,{mult:o});break}case`emberNova`:op(e,t,a,i.n*t.embers,{mult:o});break;case`pyreTithe`:for(let r of[...t.hand]){if(r===n)continue;let i=t.hand.indexOf(r);t.hand.splice(i,1),t.queue.push({t:`kindle`,uid:r.uid,id:r.id}),dp(e,t,r)}up(e,t,i.draw);break;case`flawless`:lp(e,t,s,i.n),t.counters.hpLost===0&&lp(e,t,s,i.n);break;case`emberdance`:{let n=t.embers;n>0&&(e.stats.embersSpent+=n,Xf(e,t,-n),lp(e,t,s,i.n*n,!1));break}}}function vp(e,t,n,r=null){let i=e.player.potions[n];if(!i)return!1;let a=Hl[i];if(a.combatOnly&&(!t||t.over)||a.needsTarget&&(r==null||!t.enemies[r]||t.enemies[r].hp<=0))return!1;switch(e.player.potions[n]=null,t&&t.queue.push({t:`potion`,id:i}),i){case`healing`:Nf(e,20,t),t||(e.player.hp=_f(e.player.hp,0,e.player.maxHp));break;case`strength`:qf(t,t.player,`str`,2);break;case`swift`:up(e,t,3);break;case`block`:lp(e,t,t.player,12,!1);break;case`fire`:op(e,t,t.enemies[r],20,{isAttack:!1});break;case`venom`:qf(t,t.enemies[r],`poison`,7);break;case`energy`:Xf(e,t,3);break}return!0}function yp(e,t){if(t.over)return;let n=t.player;t.queue.push({t:`endTurn`});for(let n of[...t.hand]){let r=wf(n);if(r.endTurnDmg&&cp(e,t,r.endTurnDmg,{source:`burn`}),r.endTurnLoseHp&&cp(e,t,r.endTurnLoseHp,{source:`burn`}),t.over)return}n.statuses.metallicize&&lp(e,t,n,n.statuses.metallicize,!1),n.statuses.regen&&Nf(e,n.statuses.regen,t),t.discard.push(...t.hand),t.hand=[],t.queue.push({t:`discardHand`});for(let e of[`vulnerable`,`weak`,`frail`,`beacon`])n.statuses[e]&&(n.statuses[e]--,n.statuses[e]||delete n.statuses[e]);for(let r of t.enemies)if(!(r.hp<=0||t.over)){if(r.statuses.poison){let n=r.statuses.poison;if(r.hp-=n,e.stats.dmgDealt+=n,t.queue.push({t:`hitEnemy`,idx:r.idx,amount:n,blocked:0,hpAfter:Math.max(0,r.hp),dead:r.hp<=0,poison:!0}),r.statuses.poison--,r.statuses.poison||delete r.statuses.poison,r.hp<=0){e.stats.smolderKills++,sp(e,t,r);continue}}if(r.block=0,r.flags.staggered)r.flags.staggered=!1,r.lastMoves.push(r.moveKey),t.queue.push({t:`staggered`,idx:r.idx});else{let i=Yf(r);if(t.queue.push({t:`enemyAct`,idx:r.idx,move:r.moveKey,name:i.name}),r.lastMoves.push(r.moveKey),i.dmg!=null){for(let n=0;n<(i.times||1)&&!t.over;n++)cp(e,t,i.dmg,{source:r.idx,isAttack:!0,attacker:r});i.ramp&&(r.flags.rampBonus=(r.flags.rampBonus||0)+i.ramp)}if(t.over)return;if(i.block&&lp(e,t,r,i.block,!1),i.heal&&(r.hp=Math.min(r.maxHp,r.hp+i.heal),t.queue.push({t:`heal`,who:r.idx,n:i.heal})),i.fx){for(let e of i.fx)if(e.who===`player`)qf(t,n,e.id,e.n);else if(e.who===`self`)qf(t,r,e.id,e.n);else if(e.who===`allies`)for(let n of t.enemies.filter(e=>e.hp>0))qf(t,n,e.id,e.n)}if(i.addCards)for(let n=0;n<i.addCards.n;n++)t.discard.push({uid:e.uid++,id:i.addCards.id,up:!1,bonus:0}),t.queue.push({t:`addCard`,id:i.addCards.id,where:`discard`})}r.statuses.ritual&&qf(t,r,`str`,r.statuses.ritual);for(let e of[`vulnerable`,`weak`])r.statuses[e]&&(r.statuses[e]--,r.statuses[e]||delete r.statuses[e])}t.over||(Jf(e,t),fp(e,t))}function bp(e,t){t.over=!0,t.result=`win`,e.player.hp=_f(t.player.hp,1,e.player.maxHp),Af(e,`emberHeart`)&&(Nf(e,6),Kf(t,`emberHeart`)),Af(e,`crownOfTheHearth`)&&t.embers>0&&(Nf(e,t.embers*3),Kf(t,`crownOfTheHearth`)),Af(e,`gravebloom`)&&e.player.hp<=e.player.maxHp*.5&&(Nf(e,10),Kf(t,`gravebloom`)),e.player.hp=_f(e.player.hp,1,e.player.maxHp),t.queue.push({t:`victory`,perfect:t.counters.hpLost===0})}function xp(e,t){t.over=!0,t.result=`loss`,t.player.hp=0,e.player.hp=0,t.queue.push({t:`defeat`})}function Sp(e,t,n=null){let r=e.player,i=t+(r.statuses.str||0);r.statuses.weak&&(i=Math.floor(i*.75));let a=n==null?null:e.enemies[n];return a&&a.statuses.vulnerable&&(i=Math.floor(i*1.5)),Math.max(0,i)}function Cp(e,t,n){let r=t.player,i=n+(r.statuses.dex||0);return r.statuses.frail&&(i=Math.floor(i*.75)),Math.round(Math.max(0,i)*(xf(e).wardMult||1))}function wp(e,t,n){let r=Yf(n);if(r.dmg==null)return null;let i=r.dmg+(n.statuses.str||0)+(n.flags.rampBonus||0)+(xf(e).enemyDmgBonus||0)+(yf(e).enemyDmgBonus||0);return n.statuses.weak&&(i=Math.floor(i*.75)),t.player.statuses.vulnerable&&(i=Math.floor(i*1.5)),{dmg:Math.max(0,i),times:r.times||1}}function Tp(e,t,n,r=null){let i=wf(n),a=t.player,o=r==null?null:t.enemies[r],s=Af(e,`executionersSeal`)&&i.type===`attack`&&(t.counters.attacks+1)%10==0?2:1,c=e=>{let t=e+(a.statuses.str||0);return a.statuses.weak&&(t=Math.floor(t*.75)),o&&o.statuses.vulnerable&&(t=Math.floor(t*1.5)),Math.max(0,Math.floor(t*s))},l=[],u=0;for(let r of i.effects)r.kind===`dmg`?l.push({dmg:c(r.n),times:r.times||1}):r.kind===`block`?u+=Cp(e,t,r.n):r.kind===`special`&&(r.id===`leech`||r.id===`devour`?l.push({dmg:c(r.n),times:1}):r.id===`execute`?l.push({dmg:c(r.n+(o?.statuses.vulnerable?r.bonus:0)),times:1}):r.id===`momentum`?l.push({dmg:c(r.n+(n.bonus||0)),times:1}):r.id===`phantom`?l.push({dmg:c(r.n*Math.max(0,t.hand.length-+!!t.hand.includes(n))),times:1}):r.id===`shatterEcho`?l.push({dmg:c(r.n*(o&&(o.flags.staggered||o.statuses.vulnerable)?2:1)),times:1}):r.id===`emberNova`?l.push({dmg:c(r.n*t.embers),times:1}):r.id===`doubleBlock`?u+=a.block:r.id===`flawless`?u+=Cp(e,t,r.n)*(t.counters.hpLost===0?2:1):r.id===`emberdance`&&(u+=r.n*t.embers));let d=0;for(let e of i.effects)e.kind===`chip`&&(d+=e.n);if(!l.length&&!u&&!d)return null;let f=l.reduce((e,t)=>e+t.dmg*t.times,0),p=f,m=!1,h=0,g=!1;if(o){let e=o.block;p=0;for(let t of l)for(let n=0;n<t.times;n++){let n=Math.min(e,t.dmg);e-=n,p+=t.dmg-n}m=p>=o.hp;let t=i.type===`attack`?1+(i.chip||0)+(a.statuses.beacon||0):0;h=(l.length&&p>0?t:0)+d,g=h>0&&o.chips+h>=o.facetMax&&!m}return{hits:l,total:f,loss:p,lethal:m,block:u,chips:h,willShatter:g}}function Ep(e,t,n=!1){let r=Cf(e,t,n);return e.player.deck.push(r),r}function Dp(e,t){let n=e.player.deck.findIndex(e=>e.uid===t);n>=0&&e.player.deck.splice(n,1)}function Op(e,t){let n=e.player.deck.find(e=>e.uid===t);n&&(n.up=!0)}function kp(e,t){let n=e.player.deck.find(e=>e.uid===t);n&&e.player.deck.push(Cf(e,n.id,n.up))}var Ap=`spirebound_save_v2`,jp=`spirebound_stats_v1`;function Mp(e){try{localStorage.setItem(Ap,JSON.stringify(e))}catch{}}function Np(){try{let e=localStorage.getItem(Ap);if(!e)return null;let t=JSON.parse(e);if(!t||t.v!==2||!t.player||!t.map||!t.player.deck.every(e=>Ll[e.id])||!t.player.relics.every(e=>Bl[e])||!t.player.potions.every(e=>e==null||Hl[e])||t.art!=null&&!Xl[t.art]||!(t.omens||[]).every(e=>Jl[e]))return null;for(t.art??=`flare`,t.aspect=_f(t.aspect??0,0,Ql.length-1),t.vow=_f(t.vow??0,0,$l.length),t.unlocks??=[],t.omens??=[],t.boon??=null;t.omens.length<=t.act;)t.omens.push(bf(t));for(let e of[`shatters`,`kindles`,`perfects`,`smolderKills`,`unlitVisited`,`embersSpent`])t.stats[e]??=0;return t}catch{return null}}function Pp(){try{localStorage.removeItem(Ap),localStorage.removeItem(`spirebound_save_v1`)}catch{}}function Fp(){try{return JSON.parse(localStorage.getItem(jp))||{runs:0,wins:0,best:0}}catch{return{runs:0,wins:0,best:0}}}function Ip(e,t){let n=Fp();n.runs++,t&&n.wins++,n.best=Math.max(n.best,e.act*15+e.floorsClimbed);try{localStorage.setItem(jp,JSON.stringify(n))}catch{}Pp()}function Lp(e,t,n=Tf(e)){let r=[],i=[];for(let a of t){if(a.gold&&(e.player.gold=Math.max(0,e.player.gold+a.gold),a.gold>0&&(e.stats.goldEarned+=a.gold)),a.hp&&(e.player.hp=_f(e.player.hp+a.hp,1,e.player.maxHp)),a.maxHp&&(e.player.maxHp=Math.max(1,e.player.maxHp+a.maxHp),e.player.hp=_f(e.player.hp+Math.max(0,a.maxHp),1,e.player.maxHp)),a.heal&&Nf(e,Math.round(e.player.maxHp*a.heal)),a.addCard&&Ep(e,a.addCard),a.addRelic){let t=a.addRelic===`random`?Ff(e):a.addRelic;t?(Pf(e,t),i.push({relic:t})):(e.player.gold+=50,i.push({text:`You find 50 gold instead.`}))}if(a.potion&&If(e,a.potion),a.pickRemove&&r.push(`remove`),a.pickUpgrade&&r.push(`upgrade`),a.pickDuplicate&&r.push(`duplicate`),a.pickCard&&r.push({pickCard:a.pickCard}),a.roll){let t=n(),o=0;for(let s of a.roll)if(o+=s.p,t<o){i.push({text:s.text});let t=Lp(e,s.ops,n);r.push(...t.pending),i.push(...t.log);break}}}return{pending:r,log:i}}var Rp=Object.assign({"./assets/cards/aegis.png":`/assets/aegis-C4yW72TQ.png`,"./assets/cards/agility.png":`/assets/agility-CI5YF-GX.png`,"./assets/cards/annihilate.png":`/assets/annihilate-BJ7gRR18.png`,"./assets/cards/ascension.png":`/assets/ascension-YSvo3EHU.png`,"./assets/cards/ashBite.png":`/assets/ashBite-GiUs8mSx.png`,"./assets/cards/ashenChoir.png":`/assets/ashenChoir-DPJ2hVdE.png`,"./assets/cards/bastion.png":`/assets/bastion-C4-IEju2.png`,"./assets/cards/bloodRite.png":`/assets/bloodRite-Dngc9iLG.png`,"./assets/cards/brace.png":`/assets/brace-C5luuyT6.png`,"./assets/cards/bulwark.png":`/assets/bulwark-Cg16G72s.png`,"./assets/cards/burn.png":`/assets/burn-DITCRtNT.png`,"./assets/cards/catalyst.png":`/assets/catalyst-BDxUOd5K.png`,"./assets/cards/chisel.png":`/assets/chisel-ByP6TOAs.png`,"./assets/cards/cleave.png":`/assets/cleave-0AOOs4ja.png`,"./assets/cards/cripple.png":`/assets/cripple-DWnayR1G.png`,"./assets/cards/defend.png":`/assets/defend-CBCl5jff.png`,"./assets/cards/deflect.png":`/assets/deflect-woHgEHmS.png`,"./assets/cards/devour.png":`/assets/devour-DXcXwBMk.png`,"./assets/cards/eclipseSlash.png":`/assets/eclipseSlash-D2SP8-Ya.png`,"./assets/cards/emberdance.png":`/assets/emberdance-BEz1L0x3.png`,"./assets/cards/empower.png":`/assets/empower-DWMunI0q.png`,"./assets/cards/executioner.png":`/assets/executioner-BBjpcz8R.png`,"./assets/cards/firstSpark.png":`/assets/firstSpark-s24i_29F.png`,"./assets/cards/flawlessForm.png":`/assets/flawlessForm-BbJ3dkp3.png`,"./assets/cards/flurry.png":`/assets/flurry-OF83ComZ.png`,"./assets/cards/fortify.png":`/assets/fortify-BkRfbJX2.png`,"./assets/cards/frenzy.png":`/assets/frenzy-CGalx6yi.png`,"./assets/cards/guardedStrike.png":`/assets/guardedStrike-BdR_uaIb.png`,"./assets/cards/heavyBlow.png":`/assets/heavyBlow-CYt4fsXe.png`,"./assets/cards/hex.png":`/assets/hex-DQOXXUM_.png`,"./assets/cards/ironSkin.png":`/assets/ironSkin-VaZo9AQM.png`,"./assets/cards/leechBlade.png":`/assets/leechBlade-BmS-D7fO.png`,"./assets/cards/limitBreak.png":`/assets/limitBreak-DN26OCuR.png`,"./assets/cards/lunge.png":`/assets/lunge-DmHAi-Ii.png`,"./assets/cards/momentum.png":`/assets/momentum-C6FA72BV.png`,"./assets/cards/nightSight.png":`/assets/nightSight-BMWfdlPA.png`,"./assets/cards/novaflare.png":`/assets/novaflare-BdlOFFUl.png`,"./assets/cards/oblivionStrike.png":`/assets/oblivionStrike-C7F5F5Eb.png`,"./assets/cards/offering.png":`/assets/offering-zAtpyRzi.png`,"./assets/cards/phantomBlades.png":`/assets/phantomBlades-DJiR4Y_z.png`,"./assets/cards/preparation.png":`/assets/preparation-Ds_IIj15.png`,"./assets/cards/pyreheart.png":`/assets/pyreheart-CnjhL-zh.png`,"./assets/cards/quakeblow.png":`/assets/quakeblow-C_eEICkm.png`,"./assets/cards/quickSlash.png":`/assets/quickSlash-CvlMKC0t.png`,"./assets/cards/regrowth.png":`/assets/regrowth-CBSeTuC1.png`,"./assets/cards/resonantLance.png":`/assets/resonantLance-Cfl2sj_6.png`,"./assets/cards/shardstorm.png":`/assets/shardstorm-CvTOZJ0-.png`,"./assets/cards/sidestep.png":`/assets/sidestep-Bj3qTCjM.png`,"./assets/cards/smother.png":`/assets/smother-bz2TFsma.png`,"./assets/cards/strike.png":`/assets/strike-dSCmD_GC.png`,"./assets/cards/surge.png":`/assets/surge-DzLcy2w-.png`,"./assets/cards/tempest.png":`/assets/tempest-CsyJhd10.png`,"./assets/cards/tithe.png":`/assets/tithe-DYMJcQLp.png`,"./assets/cards/toxicMist.png":`/assets/toxicMist-B8tOUwCR.png`,"./assets/cards/twinFangs.png":`/assets/twinFangs-CTQywNpA.png`,"./assets/cards/uppercut.png":`/assets/uppercut-CCTgShM_.png`,"./assets/cards/venomStrike.png":`/assets/venomStrike-C9IMQNTW.png`,"./assets/cards/virulence.png":`/assets/virulence-BEwD0i3o.png`,"./assets/cards/warCry.png":`/assets/warCry-DeiW2MRp.png`,"./assets/cards/wound.png":`/assets/wound-DAh7QhIS.png`,"./assets/enemies/abyssalKnight.png":`/assets/abyssalKnight-C-E-itbM.png`,"./assets/enemies/alphaFang.png":`/assets/alphaFang-DdGpQqF8.png`,"./assets/enemies/ashAcolyte.png":`/assets/ashAcolyte-BBrUUe1I.png`,"./assets/enemies/chaosHound.png":`/assets/chaosHound-D1R2CoW1.png`,"./assets/enemies/deepmaw.png":`/assets/deepmaw-la4seO5f.png`,"./assets/enemies/drownedOne.png":`/assets/drownedOne-BUBzJWlu.png`,"./assets/enemies/duskfang.png":`/assets/duskfang-CHUmjhPP.png`,"./assets/enemies/gloomslime.png":`/assets/gloomslime-BNhQuFFa.png`,"./assets/enemies/gravewarden.png":`/assets/gravewarden-BC9T04oe.png`,"./assets/enemies/heraldOfEnd.png":`/assets/heraldOfEnd-DZZiCKi_.png`,"./assets/enemies/leviathan.png":`/assets/leviathan-BhXEnJxl.png`,"./assets/enemies/mirelurker.png":`/assets/mirelurker-DidtJkek.png`,"./assets/enemies/obsidianGolem.png":`/assets/obsidianGolem-DkurqVoj.png`,"./assets/enemies/rootheart.png":`/assets/rootheart-B4o9Bf9P.png`,"./assets/enemies/shade.png":`/assets/shade-C2XrmBs-.png`,"./assets/enemies/shellback.png":`/assets/shellback-DCHXMl3u.png`,"./assets/enemies/siren.png":`/assets/siren-GVK3WWGi.png`,"./assets/enemies/sovereign.png":`/assets/sovereign-0p3wfa6T.png`,"./assets/enemies/sporeling.png":`/assets/sporeling-BeOaEEL0.png`,"./assets/enemies/starCultist.png":`/assets/starCultist-DQHXdHm5.png`,"./assets/enemies/thornling.png":`/assets/thornling-CqSviePj.png`,"./assets/enemies/tidecaller.png":`/assets/tidecaller-tGjufTlQ.png`,"./assets/enemies/voidColossus.png":`/assets/voidColossus-yr_eofA0.png`,"./assets/enemies/voidWisp.png":`/assets/voidWisp-D_7XlB9X.png`,"./assets/enemies/voltEel.png":`/assets/voltEel-CJeHty9B.png`,"./assets/enemies/watcherEye.png":`/assets/watcherEye---WypZip.png`,"./assets/enemies/waylayer.png":`/assets/waylayer-qynHTjuH.png`,"./assets/events/cursedIdol.png":`/assets/cursedIdol--s0qHWso.png`,"./assets/events/emberFountain.png":`/assets/emberFountain-D_Q0157p.png`,"./assets/events/fleshTrader.png":`/assets/fleshTrader-q8lAx2oa.png`,"./assets/events/forge.png":`/assets/forge-i5xE2DIv.png`,"./assets/events/forgottenShrine.png":`/assets/forgottenShrine-DYHFrAjc.png`,"./assets/events/gambler.png":`/assets/gambler-D4lmA3Yw.png`,"./assets/events/library.png":`/assets/library-CstvhNks.png`,"./assets/events/mirror.png":`/assets/mirror-Hp5O4ZPJ.png`,"./assets/events/ruinedCamp.png":`/assets/ruinedCamp-BvAZgrK0.png`,"./assets/events/voidChest.png":`/assets/voidChest-ReevFBww.png`,"./assets/events/woundedKnight.png":`/assets/woundedKnight-DIVTwuob.png`,"./assets/heroes/ashwarden.png":`/assets/ashwarden-D8NWTIka.png`,"./assets/heroes/duskblade.png":`/assets/duskblade-CpxCcOAP.png`,"./assets/potions/block.png":`/assets/block-CkTqIuTb.png`,"./assets/potions/energy.png":`/assets/energy-BNM23nR-.png`,"./assets/potions/fire.png":`/assets/fire-CAaEe0xi.png`,"./assets/potions/healing.png":`/assets/healing-KDHGTVtG.png`,"./assets/potions/strength.png":`/assets/strength-CIdQsSW6.png`,"./assets/potions/swift.png":`/assets/swift-xz-qROFX.png`,"./assets/potions/venom.png":`/assets/venom-D3l_eMKx.png`,"./assets/props/campfire.png":`/assets/campfire-B-OrO4zT.png`,"./assets/props/chest-open.png":`/assets/chest-open-B5Uzt-_6.png`,"./assets/props/chest.png":`/assets/chest-b-PO08AA.png`,"./assets/props/merchant.png":`/assets/merchant-COlFp5u3.png`,"./assets/title/banner.png":`/assets/banner-CqhrXvXS.png`,"./assets-readable-baseline/cards/ashBite.png":`/assets/ashBite-CouQGovW.png`,"./assets-readable-baseline/cards/chisel.png":`/assets/chisel-BHUdyvP2.png`,"./assets-readable-baseline/cards/defend.png":`/assets/defend-BT8TAbMa.png`,"./assets-readable-baseline/cards/eclipseSlash.png":`/assets/eclipseSlash-B5W8xu8L.png`,"./assets-readable-baseline/cards/empower.png":`/assets/empower-DauCte29.png`,"./assets-readable-baseline/cards/firstSpark.png":`/assets/firstSpark-CaQ5-JAc.png`,"./assets-readable-baseline/cards/smother.png":`/assets/smother-TWWAvyX6.png`,"./assets-readable-baseline/cards/strike.png":`/assets/strike-CmEr2qad.png`,"./assets-readable-baseline/cards/twinFangs.png":`/assets/twinFangs-DOiwjscF.png`,"./assets-readable-baseline/enemies/abyssalKnight.png":`/assets/abyssalKnight-BA9qPzL_.png`,"./assets-readable-baseline/enemies/alphaFang.png":`/assets/alphaFang-CYs2MfQS.png`,"./assets-readable-baseline/enemies/ashAcolyte.png":`/assets/ashAcolyte-W7Bx9eY3.png`,"./assets-readable-baseline/enemies/chaosHound.png":`/assets/chaosHound-Cu1tbGXO.png`,"./assets-readable-baseline/enemies/deepmaw.png":`/assets/deepmaw-BuZMfyUW.png`,"./assets-readable-baseline/enemies/drownedOne.png":`/assets/drownedOne-762yKbrK.png`,"./assets-readable-baseline/enemies/duskfang.png":`/assets/duskfang-kVQE2Vbx.png`,"./assets-readable-baseline/enemies/gloomslime.png":`/assets/gloomslime-BYNIQKkd.png`,"./assets-readable-baseline/enemies/gravewarden.png":`/assets/gravewarden-CYbqq2Uz.png`,"./assets-readable-baseline/enemies/heraldOfEnd.png":`/assets/heraldOfEnd-B5j76nBL.png`,"./assets-readable-baseline/enemies/leviathan.png":`/assets/leviathan-DUX2Oy2k.png`,"./assets-readable-baseline/enemies/mirelurker.png":`/assets/mirelurker-Cs0-ryPe.png`,"./assets-readable-baseline/enemies/obsidianGolem.png":`/assets/obsidianGolem-B2_vm835.png`,"./assets-readable-baseline/enemies/rootheart.png":`/assets/rootheart-CoZqsgKs.png`,"./assets-readable-baseline/enemies/shade.png":`/assets/shade-cFzxMAwm.png`,"./assets-readable-baseline/enemies/shellback.png":`/assets/shellback-9j9gwuRI.png`,"./assets-readable-baseline/enemies/siren.png":`/assets/siren-Boj63opF.png`,"./assets-readable-baseline/enemies/sovereign.png":`/assets/sovereign-DlFMbPOe.png`,"./assets-readable-baseline/enemies/sporeling.png":`/assets/sporeling-B8wAP_1e.png`,"./assets-readable-baseline/enemies/starCultist.png":`/assets/starCultist-DrQ9SosS.png`,"./assets-readable-baseline/enemies/thornling.png":`/assets/thornling-BJhkzjJz.png`,"./assets-readable-baseline/enemies/tidecaller.png":`/assets/tidecaller-C3FvvD8d.png`,"./assets-readable-baseline/enemies/voidColossus.png":`/assets/voidColossus-D1BBPiCC.png`,"./assets-readable-baseline/enemies/voidWisp.png":`/assets/voidWisp-DqB4mImW.png`,"./assets-readable-baseline/enemies/voltEel.png":`/assets/voltEel-BxcD87LR.png`,"./assets-readable-baseline/enemies/watcherEye.png":`/assets/watcherEye-Cx0FZXO4.png`,"./assets-readable-baseline/enemies/waylayer.png":`/assets/waylayer-DkHd5xp-.png`,"./assets-readable-baseline/heroes/ashwarden.png":`/assets/ashwarden-D21mg7QM.png`,"./assets-readable-baseline/heroes/duskblade.png":`/assets/duskblade-DupP5i2p.png`,"./assets-readable-baseline/potions/block.png":`/assets/block-DybnuP3a.png`,"./assets-readable-baseline/potions/energy.png":`/assets/energy-CWJoumcv.png`,"./assets-readable-baseline/potions/fire.png":`/assets/fire-Bc2Edgqg.png`,"./assets-readable-baseline/potions/healing.png":`/assets/healing-Bf7MtUhk.png`,"./assets-readable-baseline/potions/strength.png":`/assets/strength-Bp64zOFp.png`,"./assets-readable-baseline/potions/swift.png":`/assets/swift-Da4aGqnZ.png`,"./assets-readable-baseline/potions/venom.png":`/assets/venom-DzAfe6ZB.png`,"./assets-readable-baseline/props/campfire.png":`/assets/campfire-C5hpDY2a.png`,"./assets-readable-baseline/props/chest-open.png":`/assets/chest-open-CKTWCSJu.png`,"./assets-readable-baseline/props/chest.png":`/assets/chest-BVVwYI2Z.png`,"./assets-readable-baseline/props/merchant.png":`/assets/merchant-CRCPVNlm.png`}),zp={live:{label:`Live`,root:`assets`},"readable-baseline":{label:`Readable baseline`,root:`assets-readable-baseline`}},Bp=`live`,Vp=(e=Bp)=>zp[e]??zp[Bp],Hp=()=>Object.keys(zp),Up=(e=Bp)=>Vp(e).label,Wp=(e,t,n=Bp)=>{let{root:r}=Vp(n);return Rp[`./${r}/${e}/${t}.png`]??null},Gp=(e,t=Bp)=>{let{root:n}=Vp(t);return Object.entries(Rp).filter(([t])=>t.startsWith(`./${n}/${e}/`)).map(([,e])=>e)},Kp=0,qp=()=>`g${++Kp}`,q=(e,t,n,r=1)=>`hsla(${e},${t}%,${n}%,${r})`;function Jp(e,t,n){return`<defs>
    <linearGradient id="${e}b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${q(t,55,38)}"/><stop offset="0.55" stop-color="${q(t,50,20)}"/><stop offset="1" stop-color="${q(t,55,9)}"/>
    </linearGradient>
    <linearGradient id="${e}d" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${q(t,45,24)}"/><stop offset="1" stop-color="${q(t,50,5)}"/>
    </linearGradient>
    <radialGradient id="${e}g"><stop offset="0" stop-color="${n}" stop-opacity="1"/><stop offset="1" stop-color="${n}" stop-opacity="0"/></radialGradient>
    <filter id="${e}f" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`}var Yp=`stroke="#070a12" stroke-width="3.6" paint-order="stroke" stroke-linejoin="round"`;function Xp(e){return e.replace(/<path(?![^>]*stroke=)(?![^>]*fill="none")([^>]*?)\/>/g,`<path$1 ${Yp}/>`).replace(/<(circle|ellipse)([^>]*fill="url\(#[^"]+[bd]\)"[^>]*?)\/>/g,(e,t,n)=>n.includes(`stroke=`)?e:`<${t}${n} ${Yp}/>`)}function Zp(e=!1){let t=58+Math.random()*84,n=55+Math.random()*80,r=``,i=e?5:3;for(let a=0;a<i;a++){let i=Math.random()*Math.PI*2,a=t,o=n;r+=`M${a.toFixed(1)} ${o.toFixed(1)}`;let s=3+Math.floor(Math.random()*3);for(let t=0;t<s;t++){let t=(e?15:10)*(.6+Math.random());i+=(Math.random()-.5)*1.15,a+=Math.cos(i)*t,o+=Math.sin(i)*t,r+=`L${a.toFixed(1)} ${o.toFixed(1)}`}}return`<g class="crack"><path d="${r}" stroke="#0a0d18" stroke-width="3" fill="none" opacity=".75"/><path d="${r}" stroke="#dfeaff" stroke-width="1.3" fill="none" opacity=".8"/></g>`}var J=(e,t,n,r)=>`<circle class="eye" cx="${e}" cy="${t}" r="${n}" fill="${r}"/><circle cx="${e}" cy="${t}" r="${n*2.2}" fill="${r}" opacity="0.18"/>`,Qp={wisp(e,t,n){return`<g class="breathe">
      <path d="M100 78 q-26 44 -14 74 q6 16 14 26 q8-10 14-26 q12-30 -14-74Z" fill="url(#${e}d)" opacity=".7"/>
      <path d="M78 96 q-20 30 -8 52 M122 96 q20 30 8 52" stroke="${q(t,40,24)}" stroke-width="7" fill="none" opacity=".6"/>
      <circle cx="100" cy="78" r="34" fill="url(#${e}b)" filter="url(#${e}f)"/>
      <circle cx="100" cy="78" r="46" fill="url(#${e}g)" opacity=".35"/>
      ${J(100,76,9,n)}
    </g>`},beast(e,t,n){return`<g class="breathe">
      <path d="M30 150 q-6-38 26-54 q20-44 62-40 q16 2 22 14 l26-10 q-4 22 -18 28 q10 18 6 34 q-4 20 -24 28 l4 20 -18 0 -6-14 q-22 8 -44 2 l-4 12 -18 0 2-20 q-14-4 -16 0Z" fill="url(#${e}b)"/>
      <path d="M118 56 l24-10 q-4 20 -18 26Z" fill="url(#${e}d)"/>
      <path d="M36 148 q-10-34 22-50" stroke="${q(t,35,22)}" stroke-width="6" fill="none"/>
      <path d="M64 108 q20 14 48 6" stroke="${q(t,30,8)}" stroke-width="5" fill="none" opacity=".7"/>
      ${J(128,74,5.5,n)}${J(112,70,5,n)}
      <path d="M138 92 l16 6 -14 8Z" fill="${q(t,20,80)}"/>
    </g>`},slime(e,t,n){return`<g class="breathe">
      <path d="M40 168 q-12-70 60-96 q72 26 60 96 q-30 12 -60 12 q-30 0 -60-12Z" fill="url(#${e}b)" opacity=".92"/>
      <path d="M52 166 q-6-52 48-74 q54 22 48 74" fill="url(#${e}d)" opacity=".6"/>
      <circle cx="100" cy="124" r="22" fill="url(#${e}g)" opacity=".5"/>
      <circle cx="100" cy="124" r="12" fill="${n}" opacity=".85" class="eye"/>
      ${J(74,106,6,n)}${J(128,108,7,n)}
      <path d="M60 170 q4 14 -4 18 M140 170 q-2 16 6 18 M100 178 q0 12 -6 16" stroke="${q(t,36,22)}" stroke-width="7" fill="none" opacity=".8"/>
    </g>`},rogue(e,t,n){return`<g class="breathe">
      <path d="M64 184 q-10-70 10-104 q10-20 26-24 q16 4 26 24 q20 34 10 104 q-18 8 -36 8 q-18 0 -36-8Z" fill="url(#${e}b)"/>
      <path d="M72 74 q28-18 56 0 q-6-26 -28-30 q-22 4 -28 30Z" fill="url(#${e}d)"/>
      <path d="M76 80 q24 12 48 0 q-2 26 -24 30 q-22-4 -24-30Z" fill="${q(t,30,4)}"/>
      ${J(88,88,4.5,n)}${J(112,88,4.5,n)}
      <path d="M142 108 l26-38 6 6 -22 40Z" fill="${q(t,8,70)}" filter="url(#${e}f)"/>
      <path d="M58 110 q-16 20 -8 42" stroke="${q(t,26,18)}" stroke-width="10" fill="none"/>
    </g>`},plant(e,t,n){let r=``;for(let e=0;e<9;e++){let n=-90+(e-4)*24,i=100+Math.cos(n*Math.PI/180)*62,a=118+Math.sin(n*Math.PI/180)*62;r+=`<path d="M${100+(i-100)*.55} ${118+(a-118)*.55} L${i} ${a} L${100+(i-100)*.62+8} ${118+(a-118)*.62}Z" fill="${q(t,45,30)}"/>`}return`<g class="breathe">${r}
      <path d="M56 178 q-14-64 44-86 q58 22 44 86 q-22 10 -44 10 q-22 0 -44-10Z" fill="url(#${e}b)"/>
      <path d="M100 96 q30 14 34 52" stroke="${q(t,40,18)}" stroke-width="6" fill="none" opacity=".7"/>
      <path d="M78 128 q22-12 44 0 q-8 18 -22 18 q-14 0 -22-18Z" fill="${q(t,30,6)}"/>
      ${J(100,132,7,n)}
    </g>`},cultist(e,t,n){return`<g class="breathe">
      <path d="M60 188 q-8-78 14-112 q12-18 26-22 q14 4 26 22 q22 34 14 112 q-20 6 -40 6 q-20 0 -40-6Z" fill="url(#${e}b)"/>
      <path d="M74 70 q26-16 52 0 q-4-24 -26-28 q-22 4 -26 28Z" fill="url(#${e}d)"/>
      <ellipse cx="100" cy="84" rx="22" ry="18" fill="${q(t,30,4)}"/>
      ${J(91,84,4,n)}${J(109,84,4,n)}
      <path d="M48 128 q14-24 30-20 M152 128 q-14-24 -30-20" stroke="${q(t,32,20)}" stroke-width="12" fill="none"/>
      <g class="hover-float"><path d="M100 30 l10 14 -10 14 -10-14Z" fill="${n}" filter="url(#${e}f)" opacity=".9"/></g>
    </g>`},golem(e,t,n){return`<g class="breathe">
      <path d="M42 190 l8-38 q-18-16 -12-44 q8-40 62-44 q54 4 62 44 q6 28 -12 44 l8 38 -30 0 -6-26 q-22 6 -44 0 l-6 26Z" fill="url(#${e}b)"/>
      <path d="M64 96 l20 10 -14 16Z M138 96 l-20 10 14 16Z" fill="url(#${e}d)"/>
      <path d="M70 140 q30 12 60 0 M84 70 l10 22 M118 68 l-6 24" stroke="${n}" stroke-width="3.5" fill="none" opacity=".7" class="eye"/>
      ${J(84,88,6,n)}${J(118,88,6,n)}
      <path d="M30 150 q10-30 26-32 M170 150 q-10-30 -26-32" stroke="${q(t,26,16)}" stroke-width="16" fill="none"/>
    </g>`},treeboss(e,t,n){return`<g class="breathe">
      <path d="M52 192 q-6-30 10-44 q-30-10 -34-44 q30 8 44 0 q-24-22 -16-56 q26 16 44 12 q18 4 44-12 q8 34 -16 56 q14 8 44 0 q-4 34 -34 44 q16 14 10 44 q-24 8 -48 8 q-24 0 -48-8Z" fill="url(#${e}b)"/>
      <path d="M78 120 q22-14 44 0 q-4 34 -22 40 q-18-6 -22-40Z" fill="${q(t,30,5)}"/>
      <circle cx="100" cy="138" r="16" fill="url(#${e}g)" opacity=".8" class="eye"/>
      ${J(88,108,5,n)}${J(112,108,5,n)}
      <path d="M60 190 q-2-18 8-28 M140 190 q2-18 -8-28" stroke="${q(t,32,14)}" stroke-width="9" fill="none"/>
    </g>`},zombie(e,t,n){return`<g class="breathe">
      <path d="M62 190 q-16-60 6-96 q-14-2 -10-16 q12-24 34-26 q30 2 40 30 q16 40 4 108 q-18 6 -37 6 q-19 0 -37-6Z" fill="url(#${e}b)"/>
      <path d="M70 62 q26-18 50 4 q-4-28 -26-30 q-20 2 -24 26Z" fill="url(#${e}d)"/>
      ${J(86,74,5,n)}${J(112,78,4,n)}
      <path d="M84 96 q14 8 30 2" stroke="${q(t,22,8)}" stroke-width="4" fill="none"/>
      <path d="M58 116 q-18 26 -10 54 M144 112 q16 28 8 56" stroke="${q(t,28,18)}" stroke-width="11" fill="none"/>
      <path d="M92 130 l16 4 M88 148 l20 4" stroke="${q(t,30,26)}" stroke-width="3" opacity=".8"/>
    </g>`},serpent(e,t,n){return`<g class="breathe">
      <path d="M36 178 q-16-30 12-42 q30-12 58-2 q24 8 22-14 q-2-20 -28-18 q-32 2 -40-20 q-6-18 14-30 q26-14 56 0 l-8 18 q-20-8 -34-2 q-8 4 -2 10 q6 8 26 8 q40 0 44 34 q4 38 -36 42 q-30 4 -52 0 q-20-4 -18 8 q0 8 12 10 l-6 16 q-18-4 -20-18Z" fill="url(#${e}b)"/>
      <path d="M120 30 l24-14 4 18 -14 10Z" fill="url(#${e}d)"/>
      ${J(138,32,5,n)}
      <path d="M60 128 l8-12 8 12 M92 124 l8-12 8 12" fill="none" stroke="${q(t,40,34)}" stroke-width="4"/>
    </g>`},crawler(e,t,n){let r=``;for(let e=0;e<3;e++){let n=56+e*40;r+=`<path d="M${n} 148 q-18 14 -22 40 M${n+16} 148 q18 14 22 40" stroke="${q(t,30,20)}" stroke-width="7" fill="none"/>`}return`<g class="breathe">${r}
      <path d="M34 138 q-8-42 66-46 q74 4 66 46 q-24 24 -66 24 q-42 0 -66-24Z" fill="url(#${e}b)"/>
      <path d="M52 116 q48-22 96 0" stroke="url(#${e}d)" stroke-width="14" fill="none"/>
      ${J(78,118,5,n)}${J(100,112,6.5,n)}${J(122,118,5,n)}
      <path d="M62 148 l-18 18 M138 148 l18 18" stroke="${q(t,36,30)}" stroke-width="6"/>
    </g>`},crab(e,t,n){return`<g class="breathe">
      <path d="M48 160 q-10-56 52-62 q62 6 52 62 q-24 18 -52 18 q-28 0 -52-18Z" fill="url(#${e}b)"/>
      <path d="M60 122 q40-24 80 0" stroke="url(#${e}d)" stroke-width="12" fill="none"/>
      <path d="M40 132 q-26-8 -28-36 q20-4 32 10 l8 12 M160 132 q26-8 28-36 q-20-4 -32 10 l-8 12" fill="url(#${e}b)"/>
      <path d="M22 98 l-10-16 14 2 6 12Z M178 98 l10-16 -14 2 -6 12Z" fill="${q(t,40,34)}"/>
      ${J(86,112,5.5,n)}${J(114,112,5.5,n)}
      <path d="M76 152 q24 10 48 0" stroke="${q(t,30,8)}" stroke-width="4" fill="none"/>
    </g>`},maw(e,t,n){let r=``;for(let e=0;e<6;e++)r+=`<path d="M${56+e*18} 118 l7 16 7-16Z" fill="${q(t,12,85)}"/>`;for(let e=0;e<5;e++)r+=`<path d="M${66+e*18} 156 l7-14 7 14Z" fill="${q(t,12,80)}"/>`;return`<g class="breathe">
      <path d="M40 120 q-8-58 60-62 q70 4 62 62 q4 10 -6 12 q10 30 -18 44 q-38 18 -76 0 q-28-14 -18-44 q-10-2 -4-12Z" fill="url(#${e}b)"/>
      <path d="M52 118 q48 14 96 0 q2 26 -14 36 q-34 14 -68 0 q-16-10 -14-36Z" fill="${q(t,45,5)}"/>
      ${r}
      ${J(76,90,6,n)}${J(126,90,6,n)}
      <g class="hover-float"><path d="M100 58 q-4-26 18-30" stroke="${q(t,30,26)}" stroke-width="4" fill="none"/><circle cx="121" cy="26" r="7" fill="${n}" filter="url(#${e}f)"/></g>
    </g>`},knight(e,t,n){return`<g class="breathe">
      <path d="M62 190 q-8-64 6-96 q-12-26 12-42 q10-8 20-8 q10 0 20 8 q24 16 12 42 q14 32 6 96 q-19 6 -38 6 q-19 0 -38-6Z" fill="url(#${e}b)"/>
      <path d="M78 58 q22-14 44 0 l-4 22 q-18 10 -36 0Z" fill="url(#${e}d)"/>
      <path d="M82 74 q18 8 36 0" stroke="${n}" stroke-width="4" fill="none" class="eye"/>
      <path d="M100 22 q16 6 14 24 l-28 0 q-2-18 14-24Z" fill="${q(t,36,28)}"/>
      <path d="M148 60 l6 96 -12 4 -6-98Z" fill="${q(t,10,72)}" filter="url(#${e}f)"/>
      <path d="M136 60 l30 0 -15 -14Z" fill="${q(t,16,50)}"/>
      <path d="M54 112 q-14 18 -8 44" stroke="${q(t,26,18)}" stroke-width="13" fill="none"/>
    </g>`},siren(e,t,n){return`<g class="breathe">
      <path d="M84 190 q-30-24 -18-64 q8-28 24-40 q-10-16 2-30 q8-8 16-8 q20 8 14 32 q22 16 26 48 q4 36 -30 62 q-16 6 -34 0Z" fill="url(#${e}b)"/>
      <path d="M96 50 q-26-4 -34 22 q-10 30 6 44 q-14-40 28-66Z" fill="url(#${e}d)" opacity=".9"/>
      <path d="M120 52 q28 0 34 30 q6 28 -10 42 q10-44 -24-72Z" fill="url(#${e}d)" opacity=".9"/>
      ${J(96,66,4.5,n)}${J(114,66,4.5,n)}
      <path d="M92 84 q10 6 20 0" stroke="${n}" stroke-width="2.5" fill="none" opacity=".8"/>
      <path d="M66 132 q-22 8 -28 30 M136 128 q22 10 26 32" stroke="${q(t,30,24)}" stroke-width="9" fill="none"/>
    </g>`},leviathan(e,t,n){let r=``;for(let e=0;e<8;e++)r+=`<path d="M${34+e*17} 108 l8 22 8-22Z" fill="${q(t,14,88)}"/>`;for(let e=0;e<7;e++)r+=`<path d="M${44+e*17} 168 l8-20 8 20Z" fill="${q(t,14,82)}"/>`;return`<g class="breathe">
      <path d="M22 108 q-10-72 78-76 q88 4 78 76 l8 10 -12 8 q12 38 -22 54 q-52 26 -104 0 q-34-16 -22-54 l-12-8Z" fill="url(#${e}b)"/>
      <path d="M34 106 q66 18 132 0 q4 34 -18 46 q-48 20 -96 0 q-22-12 -18-46Z" fill="${q(t,50,4)}"/>
      ${r}
      ${J(62,74,8,n)}${J(138,74,8,n)}${J(100,56,5,n)}
      <path d="M10 130 q-8 24 8 40 M190 130 q8 24 -8 40" stroke="${q(t,34,20)}" stroke-width="10" fill="none"/>
      <path d="M56 34 l10-22 12 18 M122 30 l12-20 10 20" fill="none" stroke="${q(t,30,26)}" stroke-width="7"/>
    </g>`},shade(e,t,n){return`<g class="breathe">
      <path d="M58 186 q-4-16 8-22 q-16-60 8-92 q10-16 26-20 q16 4 26 20 q24 32 8 92 q12 6 8 22 q-10-8 -16 2 q-8-10 -14 2 q-6-10 -12-2 q-6-12 -14-2 q-6-10 -18 0Z" fill="url(#${e}b)" opacity=".9"/>
      <path d="M74 66 q26-14 52 2 q0-26 -26-30 q-24 4 -26 28Z" fill="url(#${e}d)"/>
      ${J(88,76,5,n)}${J(114,78,5,n)}
      <path d="M56 108 q-22 16 -26 44 q14-4 22-16 M146 104 q22 18 24 46 q-14-4 -22-16" fill="url(#${e}d)" opacity=".85"/>
      <path d="M40 148 l-8 14 M164 148 l8 14" stroke="${q(t,34,40)}" stroke-width="4"/>
    </g>`},eye(e,t,n){let r=``;for(let e=0;e<7;e++){let n=-150+e*20,i=100+Math.cos(n*Math.PI/180)*62,a=100+Math.sin(n*Math.PI/180)*62,o=100+Math.cos(n*Math.PI/180)*84,s=100+Math.sin(n*Math.PI/180)*84;r+=`<path d="M${i} ${a} Q${o} ${s} ${o+6} ${s+10}" stroke="${q(t,34,24)}" stroke-width="6" fill="none"/>`}return`<g class="breathe">${r}
      <circle cx="100" cy="100" r="58" fill="url(#${e}b)"/>
      <circle cx="100" cy="100" r="44" fill="${q(t,20,88)}"/>
      <circle cx="100" cy="100" r="26" fill="${q(t,60,30)}"/>
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
      <path d="M74 40 l10-22 8 14 8-20 8 20 8-14 10 22Z" fill="${q(45,70,55)}" filter="url(#${e}f)"/>
      ${J(90,70,4.5,n)}${J(110,70,4.5,n)}
      <circle cx="100" cy="52" r="4" fill="${n}" class="eye"/>
      <path d="M146 78 l4 100 -10 2 -4-100Z" fill="${q(t,20,60)}"/>
      <circle cx="148" cy="72" r="9" fill="${n}" filter="url(#${e}f)" class="eye"/>
      <path d="M56 110 q-16 22 -10 52" stroke="${q(t,26,18)}" stroke-width="12" fill="none"/>
    </g>`}};function $p(e){let t=qp(),n=q(e.hue,90,66),r=Xp((Qp[e.kind]||Qp.slime)(t,e.hue,n));return`<svg class="enemy-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    ${Jp(t,e.hue,n)}
    <ellipse cx="100" cy="192" rx="62" ry="9" fill="#000" opacity=".45"/>
    <ellipse class="innerfire" cx="100" cy="112" rx="64" ry="70" fill="url(#${t}g)" opacity=".14"/>
    ${r}
    <g class="cracks"></g>
  </svg>`}var em=[{hue:225,glow:`#7fd4ff`},{hue:26,glow:`#ffb15a`}];function tm(e=0){let t=qp(),n=em[e]||em[0],r=n.hue,i=n.glow;return`<svg class="hero-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    ${Jp(t,r,i)}
    <ellipse cx="100" cy="192" rx="56" ry="9" fill="#000" opacity=".45"/>
    <ellipse class="innerfire" cx="100" cy="118" rx="58" ry="66" fill="url(#${t}g)" opacity=".12"/>
    ${Xp(`<g class="breathe">
      <path d="M66 188 q-10-70 8-104 q10-20 26-24 q16 4 26 24 q18 34 8 104 q-17 7 -34 7 q-17 0 -34-7Z" fill="url(#${t}b)"/>
      <path d="M74 72 q26-16 52 0 q-4-24 -26-28 q-22 4 -26 28Z" fill="url(#${t}d)"/>
      <path d="M78 78 q22 10 44 0 q-2 24 -22 28 q-20-4 -22-28Z" fill="#0b0e18"/>
      ${J(90,86,4,i)}${J(110,86,4,i)}
      <path d="M144 118 l34-52 7 5 -30 54Z" fill="#cfe6ff" filter="url(#${t}f)"/>
      <path d="M141 124 l14-8 4 8 -12 8Z" fill="${q(45,60,50)}"/>
      <path d="M56 112 q-14 20 -8 46" stroke="${q(r,26,20)}" stroke-width="11" fill="none"/>
      <path d="M64 120 q36 18 72 0" stroke="${q(r,40,30)}" stroke-width="5" fill="none" opacity=".6"/>
    </g>`)}
    <g class="cracks"></g>
  </svg>`}var nm={strike:`⚔`,defend:`⛨`,eclipseSlash:`☾`,twinFangs:`⑂`,quickSlash:`≫`,heavyBlow:`⬇`,cleave:`⋔`,venomStrike:`☠`,lunge:`➹`,guardedStrike:`⛊`,brace:`⛨`,sidestep:`↯`,preparation:`♻`,deflect:`⛉`,leechBlade:`♆`,tempest:`≋`,uppercut:`⇑`,flurry:`⁂`,executioner:`✠`,momentum:`⤴`,bulwark:`☗`,surge:`✦`,toxicMist:`☁`,cripple:`⛓`,warCry:`♯`,fortify:`⧉`,bloodRite:`♥`,empower:`⚔`,agility:`❥`,ironSkin:`⬡`,regrowth:`❋`,oblivionStrike:`✸`,phantomBlades:`⚚`,devour:`♅`,annihilate:`✹`,aegis:`⛨`,offering:`♱`,limitBreak:`⚡`,catalyst:`⚗`,ascension:`☽`,bastion:`♜`,frenzy:`※`,virulence:`☣`,wound:`✂`,burn:`✹`,hex:`♄`,chisel:`◬`,firstSpark:`✧`,ashBite:`☄`,smother:`☁`,quakeblow:`⬲`,resonantLance:`↟`,tithe:`⚖`,pyreheart:`♥`,ashenChoir:`♬`,flawlessForm:`❖`,nightSight:`☾`,novaflare:`✺`,emberdance:`❂`,shardstorm:`❉`},rm=e=>{let t=9;for(let n of e)t=Math.imul(t^n.charCodeAt(0),387420489);return(t^t>>>9)>>>0};function im(e,t){let n=qp(),r=rm(e),i={attack:356,skill:205,power:268,status:160,curse:300}[t]??205,a=(i+30+r%40)%360,o=q(i,85,66),s=q(a,80,60),c=r%360,l=``;if(t===`attack`)l=`<path d="M30 120 Q75 40 150 28" stroke="${o}" stroke-width="7" fill="none" opacity=".9"/>
      <path d="M22 96 Q80 60 158 62" stroke="${s}" stroke-width="4" fill="none" opacity=".65"/>
      <path d="M52 132 Q95 78 148 88" stroke="${o}" stroke-width="3" fill="none" opacity=".4"/>`;else if(t===`skill`)l=`<path d="M90 22 q52 10 52 52 q0 44 -52 62 q-52-18 -52-62 q0-42 52-52Z" fill="none" stroke="${o}" stroke-width="6" opacity=".85"/>
      <path d="M90 42 q34 8 34 36 q0 30 -34 44" fill="none" stroke="${s}" stroke-width="3.5" opacity=".6"/>`;else if(t===`power`){let e=``;for(let t=0;t<8;t++){let n=(t*45+c)*(Math.PI/180);e+=`<path d="M${90+Math.cos(n)*24} ${78+Math.sin(n)*24} L${90+Math.cos(n)*52} ${78+Math.sin(n)*52}" stroke="${t%2?s:o}" stroke-width="${t%2?3:5}" opacity=".8"/>`}l=`${e}<circle cx="90" cy="78" r="18" fill="none" stroke="${o}" stroke-width="5"/>`}else l=`<circle cx="90" cy="78" r="40" fill="none" stroke="${o}" stroke-width="5" stroke-dasharray="16 10" opacity=".8"/>
      <path d="M62 106 L118 50" stroke="${s}" stroke-width="5" opacity=".7"/>`;let u=nm[e]||`✦`;return`<svg viewBox="0 0 180 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${n}v" cx="0.5" cy="0.42"><stop offset="0" stop-color="${q(i,45,22)}"/><stop offset="1" stop-color="${q(i,50,7)}"/></radialGradient>
      <filter id="${n}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="180" height="150" fill="url(#${n}v)"/>
    <g filter="url(#${n}f)" transform="rotate(${r%17-8} 90 75)">${l}</g>
    <text x="90" y="97" text-anchor="middle" font-size="58" fill="${q(i,30,88)}" opacity=".92" filter="url(#${n}f)" font-family="serif">${u}</text>
  </svg>`}function am(e){let t=qp();return`<svg viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="${t}l"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".25" stop-color="${e}"/><stop offset="1" stop-color="${e}" stop-opacity=".75"/></radialGradient>
    <filter id="${t}f" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <path d="M16 6 h8 v9 q10 5 10 17 a14 14 0 1 1 -28 0 q0-12 10-17Z" fill="#1a2030" stroke="#48546e" stroke-width="2"/>
    <path d="M14 20 q-6 5 -6 12 a12 12 0 0 0 24 0 q0-7 -6-12 q-6-4 -12 0Z" fill="url(#${t}l)" filter="url(#${t}f)"/>
    <rect x="15" y="2" width="10" height="6" rx="2" fill="#6b5637"/>
    <circle cx="16" cy="28" r="2.4" fill="#fff" opacity=".8"/>
  </svg>`}function om(e=!1){let t=qp();return`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="${t}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <ellipse cx="100" cy="148" rx="70" ry="8" fill="#000" opacity=".5"/>
    ${e?`<rect x="40" y="30" width="120" height="26" rx="10" fill="#4a3521" transform="rotate(-24 40 56)"/><ellipse cx="100" cy="86" rx="52" ry="16" fill="#ffd97a" filter="url(#${t}f)"/>`:`<path d="M40 66 q0-28 60-28 q60 0 60 28 l0 10 -120 0Z" fill="#54401f"/>`}
    <rect x="40" y="74" width="120" height="66" rx="8" fill="#6b4d26"/>
    <rect x="40" y="74" width="120" height="12" fill="#4a3521"/>
    <rect x="90" y="70" width="20" height="30" rx="4" fill="#c9a84c"/>
    <circle cx="100" cy="88" r="5" fill="#332512"/>
    <path d="M48 74 v62 M152 74 v62" stroke="#4a3521" stroke-width="6"/>
  </svg>`}function sm(){let e=qp();return`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
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
  </svg>`}function cm(){let e=qp();return`<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    ${Jp(e,40,`#ffd166`)}
    <ellipse cx="100" cy="150" rx="64" ry="8" fill="#000" opacity=".5"/>
    <g class="breathe">
      <path d="M56 150 q-8-58 16-84 q12-14 28-16 q16 2 28 16 q24 26 16 84 q-22 6 -44 6 q-22 0 -44-6Z" fill="url(#${e}b)"/>
      <path d="M70 64 q30-18 60 0 l6-10 q-16-16 -36-16 q-20 0 -36 16Z" fill="url(#${e}d)"/>
      <ellipse cx="100" cy="76" rx="20" ry="16" fill="#120d06"/>
      ${J(92,76,3.5,`#ffd166`)}${J(108,76,3.5,`#ffd166`)}
      <path d="M100 96 q14 2 12 14" stroke="#3a2c14" stroke-width="4" fill="none"/>
      <circle cx="140" cy="120" r="14" fill="#c9a84c"/><text x="140" y="126" text-anchor="middle" font-size="16" fill="#3a2c14">¤</text>
    </g>
  </svg>`}function lm(e,t){let n=qp(),r=q(t,80,66);return`<svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${n}v" cx="0.5" cy="0.4"><stop offset="0" stop-color="${q(t,40,24)}"/><stop offset="1" stop-color="${q(t,45,6)}"/></radialGradient>
      <filter id="${n}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="220" height="160" rx="10" fill="url(#${n}v)"/>
    <circle cx="110" cy="76" r="44" fill="none" stroke="${r}" stroke-width="2" opacity=".5"/>
    <circle cx="110" cy="76" r="56" fill="none" stroke="${r}" stroke-width="1" opacity=".25" stroke-dasharray="4 8"/>
    <text x="110" y="100" text-anchor="middle" font-size="64" fill="${r}" filter="url(#${n}f)" font-family="serif">${e}</text>
  </svg>`}var um={sword:`<path d="M18.5 5 L10 13.5" stroke-width="3"/><path d="M6.8 11.6 L12.4 17.2" stroke-width="2.2"/><path d="M8.6 15.4 L4.8 19.2" stroke-width="2.6"/>`,skull:`<path d="M12 3.2 a6.8 6.8 0 0 1 6.8 6.8 c0 2.6-1.4 4.4-3 5.5 V18.5 h-7.6 V15.5 c-1.6-1.1-3-2.9-3-5.5 A6.8 6.8 0 0 1 12 3.2 Z" fill="currentColor" stroke="none"/><circle cx="9.4" cy="10" r="1.7" fill="rgba(0,0,0,.8)" stroke="none"/><circle cx="14.6" cy="10" r="1.7" fill="rgba(0,0,0,.8)" stroke="none"/><path d="M10.5 20.8 v-2 M13.5 20.8 v-2" stroke-width="1.8"/>`,crown:`<path d="M4.5 17.5 L5.2 8.5 L9 12 L12 6 L15 12 L18.8 8.5 L19.5 17.5 Z" fill="currentColor" stroke="none"/><path d="M4.5 20 h15" stroke-width="2.2"/>`,chest:`<rect x="4" y="6.5" width="16" height="13" rx="2.2" fill="none" stroke-width="2.2"/><path d="M4 12 h16" stroke-width="1.8"/><rect x="10.4" y="10.2" width="3.2" height="4.4" rx="1" fill="currentColor" stroke="none"/>`,flame:`<path d="M12 2.8 C9.4 7.4 6.8 9.8 6.8 13.6 a5.2 5.2 0 0 0 10.4 0 C17.2 9.8 14.6 7.4 12 2.8 Z" fill="currentColor" stroke="none"/><path d="M12 11.4 c-1.7 2.3-1.7 3.9 0 5.4 1.7-1.5 1.7-3.1 0-5.4 Z" fill="rgba(0,0,0,.5)" stroke="none"/>`,coin:`<circle cx="12" cy="12" r="5.6" fill="none" stroke-width="2.2"/><path d="M5.4 5.4 L8 8 M18.6 5.4 L16 8 M5.4 18.6 L8 16 M18.6 18.6 L16 16" stroke-width="2"/>`,shield:`<path d="M12 2.8 L19 5.8 v5.6 c0 4.6-3.1 7.6-7 9.8 -3.9-2.2-7-5.2-7-9.8 V5.8 Z" fill="none" stroke-width="2.3"/><path d="M12 6.4 v11" stroke-width="1.6" opacity=".55"/>`,cloud:`<path d="M7.2 16.5 a3.9 3.9 0 1 1 .7-7.7 A4.9 4.9 0 0 1 17.4 9.6 a3.4 3.4 0 0 1 -.6 6.9 Z" fill="currentColor" stroke="none"/>`,plus:`<path d="M12 5.2 v13.6 M5.2 12 h13.6" stroke-width="3.4"/>`,up:`<path d="M12 4 L19 12 h-4.1 v8 h-5.8 v-8 H5 Z" fill="currentColor" stroke="none"/>`,cards:`<rect x="4.4" y="5.6" width="9.4" height="13.4" rx="1.8" transform="rotate(-8 9 12.5)" fill="none" stroke-width="2"/><rect x="10.6" y="5" width="9.4" height="13.4" rx="1.8" transform="rotate(7 15.5 11.5)" fill="none" stroke-width="2"/>`,hammer:`<rect x="9.6" y="3.4" width="9.6" height="5.4" rx="1.2" transform="rotate(22 14.5 6)" fill="currentColor" stroke="none"/><path d="M11.6 10.2 L5.2 20" stroke-width="2.6"/>`,scissors:`<path d="M7.6 7.6 L17.5 17.8 M16.4 7.6 L6.5 17.8" stroke-width="2.2"/><circle cx="6" cy="19.2" r="2.2" fill="none" stroke-width="1.8"/><circle cx="18" cy="19.2" r="2.2" fill="none" stroke-width="1.8"/>`,question:`<path d="M8.6 8.6 a3.4 3.4 0 1 1 5 3 c-1.1 .7-1.6 1.4-1.6 2.8" fill="none" stroke-width="2.6"/><circle cx="12" cy="18.6" r="1.7" fill="currentColor" stroke="none"/>`,facet:`<path d="M12 3.4 L20 12 L12 20.6 L4 12 Z" fill="none" stroke-width="2.3"/><path d="M12 3.4 v17.2 M4 12 h16" stroke-width="1.2" opacity=".55"/>`,ember:`<path d="M12 3.4 C10 7 8.2 8.8 8.2 11.6 a3.8 3.8 0 0 0 7.6 0 C15.8 8.8 14 7 12 3.4 Z" fill="currentColor" stroke="none"/><circle cx="7" cy="18.4" r="1.4" fill="currentColor" stroke="none" opacity=".8"/><circle cx="12" cy="20" r="1.7" fill="currentColor" stroke="none"/><circle cx="17" cy="18.4" r="1.4" fill="currentColor" stroke="none" opacity=".8"/>`,lantern:`<path d="M9 6.2 h6 M8 6.2 L8 15.6 a4 3 0 0 0 8 0 V6.2" fill="none" stroke-width="2"/><path d="M12 8.4 c-1.5 2-1.5 3.4 0 4.7 1.5-1.3 1.5-2.7 0-4.7 Z" fill="currentColor" stroke="none"/><path d="M10.6 3.6 h2.8 v2.6 h-2.8 Z M10 19.8 h4" stroke-width="1.8"/>`,stagger:`<path d="M12 2.8 L13.8 8.6 L19.8 7 L15.6 11.6 L21 14.8 L14.6 14.9 L15.8 21 L11.9 16.2 L8 21 L9.2 14.9 L3 14.8 L8.4 11.6 L4.2 7 L10.2 8.6 Z" fill="currentColor" stroke="none"/>`,unlitLantern:`<path d="M9 6.2 h6 M8 6.2 L8 15.6 a4 3 0 0 0 8 0 V6.2" fill="none" stroke-width="2" opacity=".65"/><path d="M10.6 3.6 h2.8 v2.6 h-2.8 Z M10 19.8 h4" stroke-width="1.8" opacity=".65"/><path d="M10 10 L14 14 M14 10 L10 14" stroke-width="1.6" opacity=".8"/>`,monument:`<path d="M9.5 20 L10.2 6.5 L12 3.4 L13.8 6.5 L14.5 20 Z" fill="currentColor" stroke="none"/><path d="M6 20.6 h12" stroke-width="2.2"/><path d="M12 8.6 c-1.2 1.6-1.2 2.7 0 3.8 1.2-1.1 1.2-2.2 0-3.8 Z" fill="rgba(0,0,0,.55)" stroke="none"/>`},dm=e=>`<g fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${um[e]||``}</g>`;function fm(e,t=18){return`<svg class="gicon" width="${t}" height="${t}" viewBox="0 0 24 24" aria-hidden="true">${dm(e)}</svg>`}function pm(e,t=18){let n=t/24;return`<g transform="translate(${-t/2},${-t/2}) scale(${n})">${dm(e)}</g>`}var mm=`spirebound_vigil_v1`,hm=`spirebound_stats_v1`,gm=null,_m=new Map;function vm(){if(gm)return gm;try{if(typeof localStorage<`u`)return gm=localStorage}catch{}return gm={getItem:e=>_m.has(e)?_m.get(e):null,setItem:(e,t)=>_m.set(e,t),removeItem:e=>_m.delete(e)}}var ym={runs:0,wins:0,slain:0,shatters:0,kindles:0,perfects:0,smolderKills:0,unlitVisited:0,embersSpent:0,bestVow:0,bestFloor:0};function bm(){let e=null;try{e=vm().getItem(mm)}catch{}let t=null;try{t=JSON.parse(e)}catch{}let n={v:1,deeds:{},unlocks:[],vowUnlocked:0,lastFall:null,...t||{}};if(n.deeds={...ym,...n.deeds||{}},Array.isArray(n.unlocks)||(n.unlocks=[]),e==null){try{let e=JSON.parse(vm().getItem(hm));e&&(n.deeds.runs=e.runs||0,n.deeds.wins=e.wins||0)}catch{}n.deeds.wins>0&&(n.vowUnlocked=1)}return n}function xm(e){try{vm().setItem(mm,JSON.stringify(e))}catch{}}function Sm(e){let t=[];for(let n of Object.values(Zl))if((e.deeds[n.stat]||0)>=n.n)for(let r of n.unlocks)!e.unlocks.includes(r)&&!t.includes(r)&&t.push(r);return t}function Cm(){let e=bm(),t=Sm(e);return t.length&&(e.unlocks.push(...t),xm(e)),e}function wm(e,t){if(e.vigilCommitted)return{vigil:bm(),newUnlocks:[]};e.vigilCommitted=!0;let n=bm();n.deeds.runs++,t&&(n.deeds.wins++,n.deeds.bestVow=Math.max(n.deeds.bestVow,e.vow||0),n.vowUnlocked=Math.max(n.vowUnlocked,Math.min(5,(e.vow||0)+1))),n.deeds.bestFloor=Math.max(n.deeds.bestFloor,e.act*15+e.floorsClimbed),n.deeds.slain+=e.stats.slain||0;for(let t of[`shatters`,`kindles`,`perfects`,`smolderKills`,`unlitVisited`,`embersSpent`])n.deeds[t]+=e.stats[t]||0;let r=Sm(n);return n.unlocks.push(...r),xm(n),{vigil:n,newUnlocks:r}}function Tm(e,t,n){let r=bm();r.lastFall={act:e,row:t,bequest:n},xm(r)}function Em(){let e=bm();e.lastFall=null,xm(e)}var Dm={starter:0,special:0,common:1,uncommon:2,rare:3,boss:4};function Om(e){let t=[],n=e.player.relics.filter(e=>Bl[e]&&Bl[e].rarity!==`starter`);if(n.length){let e=[...n].sort((e,t)=>Dm[Bl[t].rarity]-Dm[Bl[e].rarity])[0];t.push({kind:`relic`,id:e})}let r=e.player.deck.filter(e=>{let t=Ll[e.id];return t&&t.rarity!==`starter`&&t.rarity!==`special`});if(r.length){let e=[...r].sort((e,t)=>Dm[Ll[t.id].rarity]-Dm[Ll[e.id].rarity]||(t.up===e.up?0:t.up?1:-1))[0];t.push({kind:`card`,id:e.id,up:!!e.up})}return e.player.gold>=25&&t.push({kind:`gold`,amount:Math.min(e.player.gold,75)}),t}var km=null,Am=null,jm=null,Mm=[],Nm=localStorage.getItem(`spirebound_mute`)===`1`;function Pm(){if(km)return!0;try{km=new(window.AudioContext||window.webkitAudioContext),Am=km.createGain(),Am.gain.value=Nm?0:.5,Am.connect(km.destination)}catch{return!1}return!0}function Fm(){Pm()&&km.state===`suspended`&&km.resume()}function Im(){return Nm}function Lm(){return Nm=!Nm,localStorage.setItem(`spirebound_mute`,Nm?`1`:`0`),Am&&Am.gain.linearRampToValueAtTime(Nm?0:.5,km.currentTime+.1),Nm}function Rm(e,t,n,r,i){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(r,t+n),e.gain.exponentialRampToValueAtTime(1e-4,t+n+i)}function Y(e,{type:t=`sine`,a:n=.005,d:r=.2,peak:i=.3,slide:a=0,delay:o=0}={}){if(!Pm())return;let s=km.currentTime+o,c=km.createOscillator(),l=km.createGain();c.type=t,c.frequency.setValueAtTime(e,s),a&&c.frequency.exponentialRampToValueAtTime(Math.max(20,e+a),s+n+r),Rm(l,s,n,i,r),c.connect(l).connect(Am),c.start(s),c.stop(s+n+r+.05)}function zm({a:e=.002,d:t=.15,peak:n=.25,f0:r=800,f1:i=300,q:a=1,type:o=`bandpass`,delay:s=0}={}){if(!Pm())return;let c=km.currentTime+s,l=Math.ceil(km.sampleRate*(e+t+.05)),u=km.createBuffer(1,l,km.sampleRate),d=u.getChannelData(0);for(let e=0;e<l;e++)d[e]=Math.random()*2-1;let f=km.createBufferSource();f.buffer=u;let p=km.createBiquadFilter();p.type=o,p.Q.value=a,p.frequency.setValueAtTime(r,c),p.frequency.exponentialRampToValueAtTime(Math.max(40,i),c+e+t);let m=km.createGain();Rm(m,c,e,n,t),f.connect(p).connect(m).connect(Am),f.start(c),f.stop(c+e+t+.05)}var X={click:()=>{Y(660,{type:`triangle`,d:.05,peak:.12})},hover:()=>{Y(880,{type:`sine`,d:.03,peak:.05})},card:()=>{zm({d:.12,f0:1800,f1:500,peak:.14})},draw:()=>{zm({d:.08,f0:2400,f1:900,peak:.08})},slash:()=>{zm({d:.18,f0:3200,f1:300,peak:.3,q:1.4}),Y(180,{type:`sine`,d:.12,peak:.25,slide:-120})},hit:()=>{Y(120,{type:`sine`,d:.22,peak:.4,slide:-70}),zm({d:.1,f0:500,f1:120,peak:.2,type:`lowpass`})},blocked:()=>{Y(320,{type:`square`,d:.08,peak:.1}),zm({d:.1,f0:4e3,f1:2e3,peak:.1,q:6})},block:()=>{Y(240,{type:`triangle`,d:.12,peak:.18}),Y(360,{type:`triangle`,d:.1,peak:.1,delay:.03})},poison:()=>{Y(300,{type:`sine`,d:.2,peak:.14,slide:-160}),zm({d:.22,f0:900,f1:300,peak:.08,q:3})},debuff:()=>{Y(420,{type:`sawtooth`,d:.25,peak:.08,slide:-220})},buff:()=>{Y(392,{type:`triangle`,d:.14,peak:.14}),Y(523,{type:`triangle`,d:.16,peak:.14,delay:.07})},heal:()=>{Y(523,{type:`sine`,d:.2,peak:.14}),Y(659,{type:`sine`,d:.24,peak:.12,delay:.09}),Y(784,{type:`sine`,d:.3,peak:.1,delay:.18})},energy:()=>{Y(700,{type:`triangle`,d:.1,peak:.12,slide:300})},coin:()=>{Y(988,{type:`square`,d:.06,peak:.08}),Y(1319,{type:`square`,d:.12,peak:.08,delay:.06})},potion:()=>{Y(500,{type:`sine`,d:.12,peak:.14,slide:300}),zm({d:.14,f0:1200,f1:2600,peak:.06})},death:()=>{Y(90,{type:`sawtooth`,d:.5,peak:.22,slide:-50}),zm({d:.4,f0:600,f1:60,peak:.18,type:`lowpass`})},bigDeath:()=>{Y(60,{type:`sawtooth`,d:1.1,peak:.32,slide:-30}),zm({d:.9,f0:900,f1:40,peak:.26,type:`lowpass`})},turn:()=>{Y(392,{type:`triangle`,d:.1,peak:.1}),Y(587,{type:`triangle`,d:.14,peak:.1,delay:.08})},victory:()=>{[523,659,784,1047].forEach((e,t)=>Y(e,{type:`triangle`,d:.35,peak:.16,delay:t*.13}))},defeat:()=>{[330,277,220,165].forEach((e,t)=>Y(e,{type:`sawtooth`,d:.5,peak:.12,delay:t*.22}))},relic:()=>{[659,831,988].forEach((e,t)=>Y(e,{type:`sine`,d:.3,peak:.12,delay:t*.09}))},upgrade:()=>{Y(440,{type:`triangle`,d:.15,peak:.14}),Y(880,{type:`triangle`,d:.3,peak:.12,delay:.1})},map:()=>{zm({d:.25,f0:500,f1:1500,peak:.06}),Y(330,{type:`sine`,d:.2,peak:.08})},chip:()=>{Y(1420,{type:`triangle`,d:.05,peak:.14}),zm({d:.06,f0:5200,f1:3200,peak:.1,q:5})},shatter:()=>{zm({d:.42,f0:4200,f1:260,peak:.3,q:3.5}),Y(220,{type:`sine`,d:.3,peak:.24,slide:-140}),Y(1760,{type:`triangle`,d:.18,peak:.1,delay:.03})},ember:()=>{Y(520,{type:`sine`,d:.12,peak:.12,slide:220})},kindle:()=>{zm({d:.3,f0:900,f1:2600,peak:.1}),Y(392,{type:`sine`,d:.22,peak:.1,slide:140})},stagger:()=>{Y(233,{type:`sawtooth`,d:.38,peak:.1}),Y(247,{type:`sawtooth`,d:.38,peak:.1,delay:.02})},art:()=>{[392,494,587].forEach((e,t)=>Y(e,{type:`triangle`,d:.28,peak:.13,delay:t*.07})),zm({d:.35,f0:1400,f1:3200,peak:.07})},omen:()=>{Y(98,{type:`sine`,d:1.1,peak:.2}),Y(196,{type:`sine`,d:.9,peak:.1,delay:.12}),Y(147,{type:`triangle`,d:.8,peak:.06,delay:.3})}},Bm=[55,49,41.2];function Vm(e){if(!Pm())return;Hm(),jm=km.createGain(),jm.gain.value=0,jm.connect(Am);let t=Bm[e]||55,n=km.createBiquadFilter();n.type=`lowpass`,n.frequency.value=320,n.Q.value=.6,n.connect(jm);for(let[e,r,i]of[[1,0,.5],[1.5,3,.22],[2,-4,.3],[3,2,.1]]){let a=km.createOscillator(),o=km.createGain();a.type=`sawtooth`,a.frequency.value=t*e,a.detune.value=r,o.gain.value=i,a.connect(o).connect(n),a.start(),Mm.push(a,o)}let r=km.createOscillator(),i=km.createGain();r.frequency.value=.07,i.gain.value=90,r.connect(i).connect(n.frequency),r.start(),Mm.push(r,i,n),jm.gain.linearRampToValueAtTime(.11,km.currentTime+3)}function Hm(){if(!jm)return;let e=jm,t=Mm;e.gain.linearRampToValueAtTime(0,km.currentTime+1.2),setTimeout(()=>{t.forEach(e=>{try{e.stop?.()}catch{}try{e.disconnect()}catch{}});try{e.disconnect()}catch{}},1500),jm=null,Mm=[]}var Z={run:null,cb:null,screen:`title`,targeting:null,busy:!1,hoveredCard:null,ce:null,drag:null},Um=new URLSearchParams(location.search).get(`input`),Wm=Um?Um===`touch`:matchMedia(`(pointer: coarse)`).matches,Gm=Um?Um===`mouse`:matchMedia(`(hover: hover) and (pointer: fine)`).matches,Q=(e,t=document)=>t.querySelector(e),Km=(e,t=document)=>[...t.querySelectorAll(e)],qm=e=>new Promise(t=>setTimeout(t,e)),Jm=()=>Q(`#screen`);function $(e,t=``,n=``){let r=document.createElement(e);return t&&(r.className=t),n&&(r.innerHTML=n),r}var Ym=(e,t,n)=>{let r=Wp(e,t);return r?`<img class="raster-art" src="${r}" alt="">`:n},Xm=e=>{let t=Wp(`heroes`,Ql[e].id);return t?`<img class="raster-art hero-flip" src="${t}" alt="">`:tm(e)},Zm=!1;function Qm(){if(!Zm){Zm=!0;for(let e of[...Gp(`enemies`),...Gp(`heroes`)])new Image().src=e}}var $m=`Every creature is glass with a Facet gauge. Fill it and the glass Shatters — the creature loses its next action, is Cracked, and spills Embers into your lantern.`,eh={Cracked:zl.vulnerable.desc,Dimmed:zl.weak.desc,Brittle:zl.frail.desc,Smolder:zl.poison.desc,Fervor:zl.str.desc,Poise:zl.dex.desc,Kindle:`Burned away for the rest of this combat — and the lantern gains 1 Ember.`,Ward:`Held light that prevents damage. Expires at the start of your turn.`,Energy:`Spent to play cards. Refreshes each turn.`,Ember:`Fuel for your Lantern Art. Spilled by shatters, deaths and kindling; held in the lantern.`,Embers:`Fuel for your Lantern Art. Spilled by shatters, deaths and kindling; held in the lantern.`,Chip:`Strike at the glass itself: adds toward a Shatter, no blood required.`,Facet:$m,Facets:$m,Shatter:$m,Shatters:$m,Staggered:`Shattered glass loses its next action while it reseams.`,Unplayable:`This card cannot be played.`,Shard:`Unplayable junk glass. It can still be kindled.`,Hex:`Curse: lose 1 HP at end of turn while in hand. Cannot be kindled.`,Cinder:`Take 2 damage at end of turn while in hand.`};function th(){let e=Q(`#tooltip`),t=t=>{let n=t._tip;e.innerHTML=`${n.title?`<div class="tt-title">${n.title}</div>`:``}<div class="tt-body">${n.body||``}</div>${n.sub?`<div class="tt-sub">${n.sub}</div>`:``}`,e.style.display=`block`},n=e=>{let t=e;for(;t&&t!==document.body&&!t._tip;)t=t.parentElement;return t&&t._tip?t:null},r=(t,n,r)=>{if(e.style.display!==`block`)return;let i=e.offsetWidth,a=e.offsetHeight;r?(e.style.left=`${Math.max(8,Math.min(innerWidth-i-8,t-i/2))}px`,e.style.top=`${Math.max(8,n-a-26)}px`):(e.style.left=`${Math.min(innerWidth-i-12,t+16)}px`,e.style.top=`${Math.max(8,Math.min(innerHeight-a-12,n-a/2))}px`)};document.addEventListener(`pointerover`,i=>{if(!Gm||i.pointerType!==`mouse`)return;let a=n(i.target);a?(t(a),r(i.clientX,i.clientY,!1)):e.style.display=`none`}),document.addEventListener(`pointermove`,e=>{Gm&&e.pointerType===`mouse`?r(e.clientX,e.clientY,!1):i&&Math.hypot(e.clientX-a,e.clientY-o)>12&&(clearTimeout(i),i=0)});let i=0,a=0,o=0,s=0;document.addEventListener(`pointerdown`,c=>{if(c.pointerType===`mouse`)return;e.style.display=`none`,clearTimeout(s);let l=n(c.target);l&&(a=c.clientX,o=c.clientY,clearTimeout(i),i=setTimeout(()=>{i=0,t(l),r(a,o,!0)},380))},!0);let c=t=>{t.pointerType!==`mouse`&&(i&&=(clearTimeout(i),0),clearTimeout(s),s=setTimeout(()=>e.style.display=`none`,1700))};document.addEventListener(`pointerup`,c),document.addEventListener(`pointercancel`,c)}function nh(e,t){let n=e.replace(/@(\d+)@/g,(e,n)=>{let r=+n,i=t&&Z.cb?Sp(Z.cb,r):r;return`<span class="val ${i>r?`boosted`:i<r?`reduced`:``}">${i}</span>`}).replace(/#(\d+)#/g,(e,n)=>{let r=+n,i=t&&Z.cb?Cp(Z.run,Z.cb,r):r;return`<span class="val ${i>r?`boosted`:i<r?`reduced`:``}">${i}</span>`});return n=n.replace(/\b(Cracked|Dimmed|Brittle|Smolder|Fervor|Poise|Kindle|Ward|Energy|Embers?|Chip|Facets?|Shatters?|Staggered|Unplayable|Shard|Hex|Cinder)\b/g,`<span class="kw">$1</span>`),n}function rh(e,{inCombat:t=!1,size:n=null}={}){let r=wf(e),i=$(`div`,`card t-${r.type} r-${r.rarity}${e.up?` upgraded`:``}`);n&&i.style.setProperty(`--cw`,`${n}px`),e.uid!=null&&(i.dataset.uid=e.uid);let a=``;if(r.cost!=null){let n=t&&Z.cb?pp(Z.run,Z.cb,e):r.cost;a=`<div class="card-cost ${n===0?`free`:``}">${n}</div>`}let o=nh(r.text,t);return e.bonus&&(o=o.replace(/<span class="val[^"]*">(\d+)<\/span>/,(t,n)=>t.replace(n,+n+e.bonus))),i.innerHTML=`<div class="card-lift">${a}<div class="card-inner">
    <div class="card-art">${Ym(`cards`,e.id,im(e.id,r.type))}</div>
    <div class="card-name">${r.name}</div>
    <div class="card-type">${r.type}</div>
    <div class="card-text"><span class="ct-inner">${o}</span></div>
    <div class="card-rarity"></div>
  </div></div>`,Km(`.kw`,i).forEach(e=>e._tip={title:e.textContent,body:eh[e.textContent]||``}),Gm&&i.addEventListener(`mousemove`,e=>{let t=i.getBoundingClientRect(),n=(e.clientX-t.left)/t.width,r=(e.clientY-t.top)/t.height,a=Q(`.card-inner`,i);a.style.setProperty(`--ry`,`${(n-.5)*16}deg`),a.style.setProperty(`--rx`,`${(.5-r)*12}deg`),a.style.setProperty(`--mx`,`${n*100}%`),a.style.setProperty(`--my`,`${r*100}%`),a.style.setProperty(`--gx`,(n-.5)*60)}),i.addEventListener(`mouseleave`,()=>{let e=Q(`.card-inner`,i);e.style.setProperty(`--ry`,`0deg`),e.style.setProperty(`--rx`,`0deg`)}),i}function ih(){let e=Q(`#lantern`);if(!Z.run||Z.screen===`title`||Z.screen===`end`||Z.screen===`lamplighter`){e.style.setProperty(`--la`,0),e.classList.remove(`gutter`);return}let t=Z.run.player,n=Z.cb&&!Z.cb.over?Z.cb.player.hp:t.hp,r=Math.max(0,Math.min(1,(.68-n/t.maxHp)/.53));e.style.setProperty(`--la`,(r*.82).toFixed(3)),e.style.setProperty(`--lr`,`${Math.round(1500-r*1e3)}px`);let i=`50%`,a=`55%`;if(Z.screen===`combat`&&Z.ce?.hero){let e=Id(Z.ce.hero);i=`${Math.round(e.x)}px`,a=`${Math.round(e.y)}px`}e.style.setProperty(`--lx`,i),e.style.setProperty(`--ly`,a),e.classList.toggle(`gutter`,r>.55)}function ah(){ih();let e=Q(`#hud`);if(!Z.run||Z.screen===`title`||Z.screen===`end`||Z.screen===`lamplighter`){e.classList.remove(`show`),document.body.classList.remove(`low-hp`);return}e.classList.add(`show`);let t=Z.run.player,n=Z.cb&&!Z.cb.over?Z.cb.player.hp:t.hp;document.body.classList.toggle(`low-hp`,n/t.maxHp<=.3);let r=Il[Z.run.act];e.innerHTML=`<div class="hud-bar">
      <div class="hud-hp-wrap">
        <div class="hud-stat"><span style="color:var(--hp)">♥</span> <span class="hp-num">${n} / ${t.maxHp}</span></div>
        <div class="hud-hpbar"><div style="width:${100*n/t.maxHp}%"></div></div>
      </div>
      <div class="hud-stat"><span style="color:var(--gold)">¤</span> <span class="gold-num">${t.gold}</span></div>
      <div class="hud-mid"><b>${r.name.toUpperCase()}</b> &nbsp;·&nbsp; Act ${Z.run.act+1} &nbsp;·&nbsp; Floor ${Z.run.floorsClimbed} &nbsp;·&nbsp; ${r.bossName}</div>
      <div class="hud-right">
        ${t.potions.map((e,t)=>`<button class="potion-slot ${e?`full`:``}" data-slot="${t}">${e?Ym(`potions`,e,am(Hl[e].tone)):``}</button>`).join(``)}
        <button class="icon-btn" data-act="deck">${fm(`cards`,19)}<span style="font-size:11px">${t.deck.length}</span></button>
        <button class="icon-btn" data-act="menu">≡</button>
      </div>
    </div>
    <div id="relicbar"></div>`;let i=Q(`#relicbar`,e),a=Jl[Z.run.omens?.[Z.run.act]];if(a){let e=$(`div`,`relic-chip omen-chip`,a.glyph);e.style.setProperty(`--tone`,a.tone),e._tip={title:`Omen — ${a.name}`,body:a.text,sub:`hangs over Act ${Z.run.act+1}`},i.appendChild(e)}for(let e of t.relics){let t=Bl[e],n=$(`div`,`relic-chip`,t.glyph);n.style.setProperty(`--tone`,t.tone),n.dataset.relic=e,n._tip={title:t.name,body:t.text,sub:t.rarity},i.appendChild(n)}t.potions.forEach((t,n)=>{if(!t)return;let r=Q(`.potion-slot[data-slot="${n}"]`,e);r._tip={title:Hl[t].name,body:Hl[t].text,sub:`Click to use or toss`}}),Q(`[data-act="deck"]`,e).onclick=()=>{X.click(),mh(`Your Deck`,Z.run.player.deck,{sub:`${Z.run.player.deck.length} cards`})},Q(`[data-act="menu"]`,e).onclick=e=>{X.click(),oh(e.clientX,e.clientY)},Km(`.potion-slot.full`,e).forEach(e=>e.onclick=t=>lh(+e.dataset.slot,t))}function oh(e,t){sh();let n=$(`div`,`pop-menu`);n.innerHTML=`<button data-m="help">How to Play</button><button data-m="mute">${Im()?`Unmute`:`Mute`} Sound</button><button data-m="abandon" style="color:#ff8d8d">Abandon Run</button>`,document.body.appendChild(n),n.style.left=`${Math.min(e,innerWidth-200)}px`,n.style.top=`${t+8}px`,n.onclick=e=>{let t=e.target.dataset.m;sh(),t===`help`&&hh(),t===`mute`&&Lm(),t===`abandon`&&dh()},setTimeout(()=>document.addEventListener(`pointerdown`,ch,{once:!0}),0)}var sh=()=>Km(`.pop-menu`).forEach(e=>e.remove()),ch=e=>{e.target.closest(`.pop-menu`)||sh()};function lh(e,t){if(Z.busy)return;sh();let n=Z.run.player.potions[e];if(!n)return;let r=Hl[n],i=Z.cb&&!Z.cb.over&&Z.screen===`combat`,a=!r.combatOnly||i,o=$(`div`,`pop-menu`);o.innerHTML=`<button data-m="use" ${a?``:`disabled style="opacity:.4"`}>Use ${r.name}</button><button data-m="toss">Toss it</button>`,document.body.appendChild(o),o.style.left=`${Math.min(t.clientX-60,innerWidth-220)}px`,o.style.top=`${t.clientY+10}px`,o.onclick=async t=>{let n=t.target.dataset.m;if(sh(),n===`toss`&&(Z.run.player.potions[e]=null,X.card(),ah(),Mp(Z.run)),n===`use`&&a)if(r.needsTarget&&i){let t=Z.cb.enemies.filter(e=>e.hp>0);if(t.length===1)return uh(e,t[0].idx);Xh({kind:`potion`,slot:e})}else uh(e,null)},setTimeout(()=>document.addEventListener(`pointerdown`,ch,{once:!0}),0)}async function uh(e,t){Zh(),X.potion(),Z.cb&&!Z.cb.over&&Z.screen===`combat`?(vp(Z.run,Z.cb,e,t),await fg(),hg()):(vp(Z.run,null,e,null),ah(),Mp(Z.run))}function dh(){fh(`<div class="panel ov-panel" style="text-align:center">
    <div class="ov-title">Abandon Run?</div>
    <div class="ov-sub">Your climb will be lost to the void.</div>
    <div class="ov-actions"><button class="btn danger" data-a="yes">Abandon</button><button class="btn ghost" data-a="no">Keep Climbing</button></div>
  </div>`,e=>{e.onclick=e=>{let t=e.target.dataset.a;t===`yes`&&(Ip(Z.run,!1),Z.run=null,Z.cb=null,ph(),Hm(),_h(`title`)),t===`no`&&ph()}})}function fh(e,t=null,n=!1){let r=Q(`#overlay`);r.innerHTML=e,r.classList.add(`open`),r._closable=n,t&&t(r.firstElementChild)}function ph(){let e=Q(`#overlay`);e.classList.remove(`open`),e.innerHTML=``}function mh(e,t,{sub:n=``,pick:r=null,canSkip:i=!1,skipLabel:a=`Skip`,inCombat:o=!1}={}){let s=$(`div`,`panel ov-panel`);s.innerHTML=`<div class="ov-title">${e}</div>${n?`<div class="ov-sub">${n}</div>`:``}`;let c=$(`div`,`card-grid ${r?`choice-cards`:``}`),l=r?t:[...t].sort((e,t)=>wf(e).name.localeCompare(wf(t).name));for(let e of l){let t=rh(e,{inCombat:o});r&&(t.onclick=()=>{X.click(),t.classList.add(`picked`),setTimeout(()=>{ph(),r(e)},240)}),c.appendChild(t)}s.appendChild(c);let u=$(`div`,`ov-actions`);if(i&&r){let e=$(`button`,`btn ghost`,a);e.onclick=()=>{X.click(),ph(),r(null)},u.appendChild(e)}if(!r){let e=$(`button`,`btn ghost`,`Close`);e.onclick=()=>{X.click(),ph()},u.appendChild(e)}s.appendChild(u),fh(``,null,!r),Q(`#overlay`).appendChild(s)}function hh(){fh(`<div class="panel ov-panel howto">
    <div class="ov-title">How to Play</div>
    <h3>The Climb</h3>Choose a path of lanterns up the Spire. Fight monsters, gather cards, relics and phials, and defeat the boss of each of the <b>3 acts</b>. Unlit lanterns hide what they hold — but pay a bounty for the walking.
    <h3>Combat</h3>Each turn you draw <b>5 cards</b> and gain <b>3 Energy</b> (⬤). Play a card by clicking or dragging — attacks need a target when several enemies remain. Enemies telegraph their <b>intent</b> above their heads.
    <h3>The Glass</h3>Every creature is glass with a row of <b>Facets</b> under its lifebar. Attacks that draw unblocked blood chip a facet (heavy cards chip more). Fill the gauge and the glass <b>SHATTERS</b>: it loses its next action, is Cracked, and spills <b>Embers</b> into your lantern. Time a shatter to deny the blow you can't survive.
    <h3>The Lantern</h3>Embers fuel your <b>Lantern Art</b> — one signature power, always available, once a turn (press <b>A</b>). Drag any card onto the lantern to <b>kindle</b> it: the card burns away and feeds the lantern 1 ember. Once a turn; curses refuse the fire.
    <h3>Ward & Statuses</h3><b>Ward</b> is held light that absorbs damage but expires each turn. <b>Cracked</b> ×1.5 damage taken · <b>Dimmed</b> −25% damage dealt · <b>Brittle</b> −25% Ward · <b>Smolder</b> burns each turn, and leaps to another enemy when its host dies or shatters.
    <h3>The Fires & The Merchant</h3>Rest sites heal <b>30%</b> or upgrade a card. Shops sell cards, relics, phials — and can <b>remove</b> a card from your deck. Keep your deck lean; every reward is optional.
    <h3>The Vigil — What Death Leaves Behind</h3>Nothing is wasted. At the foot of each climb the <b>Lamplighter</b> offers a boon and lets you choose your Lantern Art. When you fall, carve one thing into the stone — a <b>monument</b> your next climb can recover in that same act. Every shatter, kindle and slaying feeds lifetime <b>Deeds</b> that unlock new cards, relics, and a second aspect, the <b>Ashwarden</b>. Reach the dawn once and the <b>Vows</b> open: an optional difficulty ladder for those who'd climb a crueler Spire.
    <div class="ov-actions"><button class="btn" data-a="ok">Fight On</button></div>
  </div>`,e=>{Q(`[data-a="ok"]`,e).onclick=()=>{X.click(),ph()}},!0)}function gh(){if(rg)return;let e=Q(`#wipe`);e.classList.remove(`go`),e.offsetWidth,e.classList.add(`go`),setTimeout(()=>e.classList.remove(`go`),620)}function _h(e,t){Z.screen!==e&&Z.run&&gh(),Z.screen=e,sh(),Q(`#tooltip`).style.display=`none`,e!==`map`&&(Xu(),td());let n=Jm();n.className=``,n.onclick=null,{title:yh,map:Th,combat:()=>{},reward:vg,rest:Sg,shop:wg,event:Tg,treasure:Cg,bossRelic:yg,end:kg}[e](t),e===`map`&&Qm(),e!==`combat`&&e!==`title`&&uf(),ah()}var vh=[`0`,`I`,`II`,`III`,`IV`,`V`];function yh(){Hm(),sd(0);let e=Cm(),t=Np(),n=Z.title||={aspect:0,vow:0};n.aspect>0&&Ql[n.aspect].unlock&&!e.unlocks.includes(Ql[n.aspect].unlock)&&(n.aspect=0),n.vow=Math.max(0,Math.min(n.vow|0,e.vowUnlocked));let r=e.deeds,i=Ql.map((t,r)=>{let i=r>0&&t.unlock&&!e.unlocks.includes(t.unlock);return`<button class="aspect-card${n.aspect===r?` on`:``}${i?` locked`:``}" data-a="asp" data-i="${r}"${i?` disabled`:``}>
      <div class="asp-hero">${Xm(r)}</div>
      <div class="asp-name">${t.name}${i?` 🔒`:``}</div>
      <div class="asp-blurb">${i?`Reach the first dawn to walk as the Ashwarden.`:t.blurb}</div>
    </button>`}).join(``),a=n.vow===0?`The Spire as it is. No vows sworn.`:$l.slice(0,n.vow).map(e=>`<b style="color:#ff9a4d">${e.name}</b> — ${e.desc}`).join(`<br>`),o=e.vowUnlocked>0?`<div class="vow-block">
      <div class="vow-stepper">
        <button class="vow-btn" data-a="vow-"${n.vow===0?` disabled`:``}>−</button>
        <div class="vow-level">VOW ${vh[n.vow]}<span class="vow-max"> / ${vh[e.vowUnlocked]||`0`}</span></div>
        <button class="vow-btn" data-a="vow+"${n.vow<e.vowUnlocked?``:` disabled`}>+</button>
      </div>
      <div class="vow-desc">${a}</div>
    </div>`:``,s=Wp(`title`,`banner`),c=Jm();c.innerHTML=`<div class="title-screen screen-enter">
    ${s?`<div class="title-banner"><div class="title-banner-frame"><img class="raster-art" src="${s}" alt=""></div></div>`:``}
    <div class="logo">SPIREBOUND</div>
    <div class="tagline">A Roguelite Deckbuilder · The Vigil Remembers</div>
    <div class="aspect-row">${i}</div>
    ${o}
    <div class="title-btns">
      ${t?`<button class="btn" data-a="continue">Continue Climb</button>`:``}
      <button class="btn" data-a="new">${t?`Begin Anew`:`Begin the Climb`}</button>
      <button class="btn ghost" data-a="vigil">The Vigil</button>
      <button class="btn ghost" data-a="help">How to Play</button>
      <button class="btn ghost" data-a="mute">${Im()?`Unmute`:`Mute`}</button>
    </div>
    <div class="title-stats">${r.runs} climbs · ${r.wins} dawns · ${r.slain} slain${e.unlocks.length?` · ${e.unlocks.length} secrets unearthed`:``}</div>
  </div>`,c.onclick=r=>{let i=r.target.closest(`[data-a]`);if(!i||i.disabled)return;let a=i.dataset.a;Fm(),X.click(),a===`asp`?(n.aspect=+i.dataset.i,yh()):a===`vow-`?(n.vow=Math.max(0,n.vow-1),yh()):a===`vow+`?(n.vow=Math.min(e.vowUnlocked,n.vow+1),yh()):a===`new`?(t&&Pp(),xh(vf(void 0,{aspect:n.aspect,vow:n.vow,lamplighter:!0,monument:e.lastFall}))):a===`continue`&&t?xh(t,!0):a===`vigil`?bh():a===`help`?hh():a===`mute`&&(Lm(),yh())},cg()}function bh(){let e=bm(),t=Object.values(Zl).map(t=>{let n=e.deeds[t.stat]||0,r=n>=t.n,i=Math.min(100,Math.round(n/t.n*100)),a=t.unlocks.map(e=>{if(e===`aspect2`)return`The Ashwarden`;let[t,n]=e.split(`:`);return t===`card`?Ll[n]?.name||n:Bl[n]?.name||n}).join(`, `);return`<div class="deed-row${r?` done`:``}">
      <div class="deed-head"><span class="deed-name">${r?`✦ `:``}${t.name}</span><span class="deed-count">${Math.min(n,t.n)}/${t.n}</span></div>
      <div class="deed-desc">${t.desc} → <i>${a}</i></div>
      <div class="deed-bar"><span style="width:${i}%"></span></div>
    </div>`}).join(``);fh(`<div class="panel ov-panel vigil-panel">
    <div class="ov-title">The Vigil</div>
    <div class="ov-sub">${e.deeds.runs} climbs · ${e.deeds.wins} dawns · deepest Vow: ${vh[e.deeds.bestVow]||`—`}</div>
    <div class="deed-list">${t}</div>
    <div class="ov-actions"><button class="btn" data-a="ok">Close</button></div>
  </div>`,e=>{Q(`[data-a="ok"]`,e).onclick=()=>{X.click(),ph()}},!0)}function xh(e,t=!1){Z.run=e,Z.cb=null,sd(e.act);let n=e.nodeId?e.map.nodes.find(t=>t.id===e.nodeId):null;if(Ju(e.act,n?n.row:0),Vm(e.act),t||Mp(e),t&&e.pendingCombat){let t=e.map.nodes.find(t=>t.id===e.nodeId);Z.screen=`combat`,Oh(Uf(e,e.pendingCombat,t?t.row:5),e.pendingCombat),ah();return}if(e.pendingLamplighter){Sh();return}_h(`map`),t||setTimeout(()=>xg(e),900)}function Sh(){let e=Z.run;if(Z.screen!==`lamplighter`&&gh(),Z.screen=`lamplighter`,sh(),td(),sd(0),Jm().className=``,!Z.lamp){let t=Tf(e),n=Object.keys(eu),r=[];for(;r.length<3&&n.length;)r.push(n.splice(Math.floor(t()*n.length),1)[0]);Z.lamp={boons:r,boon:null,art:e.art},Mp(e)}let t=Z.lamp,n=Ql[e.aspect],r=t.boons.map(e=>{let n=eu[e];return`<button class="lamp-boon${t.boon===e?` on`:``}" data-a="boon" data-i="${e}">
      <div class="lb-name">${n.name}</div><div class="lb-text">${nh(n.text)}</div>
    </button>`}).join(``),i=Object.keys(Xl).map(e=>{let n=Xl[e];return`<button class="lamp-art${t.art===e?` on`:``}" data-a="art" data-i="${e}">
      <span class="la-glyph" style="color:${n.tone}">${n.glyph}</span><span class="la-name">${n.name}</span>
    </button>`}).join(``),a=Xl[t.art],o=Jm();o.innerHTML=`<div class="lamp-screen screen-enter">
    <div class="lamp-hero">${Xm(e.aspect)}</div>
    <div class="lamp-title">THE LAMPLIGHTER</div>
    <div class="lamp-sub">${n.name} stands at the foot of the Spire. Take one parting gift — and choose the fire your lantern will carry.</div>
    <div class="lamp-label">A Boon for the Road</div>
    <div class="lamp-boons">${r}</div>
    <div class="lamp-label">Your Lantern Art <span class="lamp-hint">(press A in combat)</span></div>
    <div class="lamp-arts">${i}</div>
    <div class="lamp-art-desc">${a?`<b style="color:${a.tone}">${a.glyph} ${a.name}</b> · ${nh(a.text)}`:``}</div>
    <div class="lamp-actions"><button class="btn" data-a="begin"${t.boon?``:` disabled`}>${t.boon?`Light the Way`:`Choose a boon`}</button></div>
  </div>`,ah(),o.onclick=e=>{let n=e.target.closest(`[data-a]`);if(!n||n.disabled)return;let r=n.dataset.a;Fm(),X.click(),r===`boon`?(t.boon=n.dataset.i,Sh()):r===`art`?(t.art=n.dataset.i,X.hover(),Sh()):r===`begin`&&t.boon&&Ch()}}function Ch(){let e=Z.run,t=Z.lamp;e.art=t.art,e.boon=t.boon,Lp(e,eu[t.boon].ops),delete e.pendingLamplighter,Z.lamp=null,X.relic(),Mp(e),_h(`map`),setTimeout(()=>xg(e),900)}var wh={monster:`sword`,elite:`skull`,event:`question`,rest:`flame`,shop:`coin`,treasure:`chest`,boss:`crown`,monument:`monument`};function Th(){let e=Z.run;if(e.pendingCombat){let t=e.map.nodes.find(t=>t.id===e.nodeId);Z.screen=`combat`,Oh(Uf(e,e.pendingCombat,t?t.row:5),e.pendingCombat);return}Mp(e),Z.cb=null;let{nodes:t}=e.map,n=new Set(Df(e).map(e=>e.id)),r=new Set(e.map.visited),i=e.nodeId?t.find(t=>t.id===e.nodeId).row:-1,a=``,o=``;for(let e of t)for(let t of e.next){let n=r.has(e.id)&&r.has(t)?`walked`:``;a+=`<path class="medge ${n}" style="--d:${e.row*34}ms" data-a="${e.id}" data-b="${t}" d="M0 0"/>`}for(let i of t){let t=i.unlit&&!r.has(i.id),a=[`mnode`,`type-${i.type}`,t?`unlit`:``,r.has(i.id)?`visited`:``,i.id===e.nodeId?`current`:``,n.has(i.id)?`avail`:``].join(` `),s=Wm?1.3:1,c=(i.type===`boss`?26:i.type===`elite`||i.type===`treasure`?19:16)*s,l=Math.round((i.type===`boss`?26:i.type===`elite`||i.type===`treasure`?20:17)*s);o+=`<g class="${a}" data-node="${i.id}" style="--d:${i.row*34}ms">
      <g class="nwrap"><circle class="bg" r="${t?16*s:c}"/><g class="icg">${pm(t?`unlitLantern`:wh[i.type],t?Math.round(17*s):l)}</g></g>
    </g>`}let s=Il[e.act],c=Jl[e.omens?.[e.act]];Jm().innerHTML=`
    <div class="map-title">ACT ${e.act+1} — <b>${s.name.toUpperCase()}</b> — ${s.bossName} awaits${c?` &nbsp;·&nbsp; <span class="mt-omen" style="color:${c.tone}">${c.glyph} ${c.name}</span>`:``}</div>
    <div class="map-screen screen-enter">
      <svg class="map-svg" width="100%" height="100%">${a}${o}</svg>
      <div class="map-hint">${Wm?`drag`:`scroll`} to survey the Spire</div>
    </div>`;let l=Q(`.map-svg`),u=!1;l.onclick=e=>{if(u)return;let n=e.target.closest(`.mnode.avail`);!n||Z.busy||(Fm(),Eh(t.find(e=>e.id===n.dataset.node)))},Km(`.mnode`,l).forEach(i=>{let a=t.find(e=>e.id===i.dataset.node),o={monster:`Monster`,elite:`Elite — beware`,event:`Unknown event`,rest:`Rest site`,shop:`Merchant`,treasure:`Treasure`,boss:Il[e.act].bossName};i._tip=a.unlit&&!r.has(a.id)?{title:`An unlit lantern`,body:`What waits here is unknown — but first light pays a bounty of gold.${n.has(a.id)?` ${Wm?`Tap`:`Click`} to travel here.`:``}`}:{title:o[a.type],body:n.has(a.id)?`${Wm?`Tap`:`Click`} to travel here.`:``}});let d=t.map(t=>({id:t.id,pos:Pu(e.act,t)})),f=new Map(Km(`.mnode`,l).map(e=>[e.dataset.node,e])),p=new Set(t.filter(e=>!n.has(e.id)&&!r.has(e.id)).map(e=>e.id)),m=Km(`.medge`,l).map(e=>({p:e,a:e.dataset.a,b:e.dataset.b}));Yu(e.act,Math.max(0,i)),ed(d,e=>{let t=new Map(e.map(e=>[e.id,e]));for(let[e,n]of f){let r=t.get(e);n.setAttribute(`transform`,`translate(${r.x.toFixed(1)},${r.y.toFixed(1)}) scale(${r.s.toFixed(3)})`),n.style.opacity=(r.fade*(p.has(e)?.4:1)).toFixed(3)}for(let{p:e,a:n,b:r}of m){let i=t.get(n),a=t.get(r),o=9*(i.s+a.s)/2;e.setAttribute(`d`,`M${i.x.toFixed(1)} ${i.y.toFixed(1)} Q${((i.x+a.x)/2).toFixed(1)} ${((i.y+a.y)/2+o).toFixed(1)} ${a.x.toFixed(1)} ${a.y.toFixed(1)}`),e.style.opacity=Math.min(i.fade,a.fade).toFixed(3)}});let h=Q(`.map-screen`);h.addEventListener(`wheel`,e=>{e.preventDefault(),Zu(-e.deltaY*.006)},{passive:!1});let g=null,_=0,v=0,y=0;h.addEventListener(`pointerdown`,e=>{e.pointerType!==`mouse`&&(cancelAnimationFrame(v),g=e.clientY,_=0,y=0,u=!1)}),h.addEventListener(`pointermove`,e=>{if(g==null||e.pointerType===`mouse`)return;let t=e.clientY-g;g=e.clientY,y+=Math.abs(t),y>14&&(u=!0),_=t,Zu(t*.014)});let b=e=>{if(g==null||e.pointerType===`mouse`)return;g=null;let t=()=>{_*=.93,!(Math.abs(_)<.5||Z.screen!==`map`)&&(Zu(_*.014),v=requestAnimationFrame(t))};v=requestAnimationFrame(t),setTimeout(()=>u=!1,80)};h.addEventListener(`pointerup`,b),h.addEventListener(`pointercancel`,b)}function Eh(e){let t=Z.run;X.map(),Ju(t.act,e.row);let{type:n,bounty:r}=Of(t,e);if(Mp(t),r){X.coin();let t=Q(`.mnode[data-node="${e.id}"]`),n=t?(()=>{let e=t.getBoundingClientRect();return{x:e.left+e.width/2,y:e.top+e.height/2}})():{x:innerWidth/2,y:innerHeight/2};Pd(n.x,n.y-34,`+${r} ¤`,`goldf`),ng(n.x,n.y,120,30,{n:5,color:`#ffe9ac`,size:7,dur:620})}n===`monster`||n===`elite`||n===`boss`?(t.pendingCombat=n,Mp(t),Oh(Uf(t,n,e.row),n)):n===`rest`?_h(`rest`):n===`shop`?_h(`shop`):n===`treasure`?_h(`treasure`):n===`event`?_h(`event`,Hf(t)):n===`monument`&&Dh(e)}function Dh(e){let t=Z.run,n=kf(t);if(n&&Em(),Mp(t),n){X.relic();let t=n.kind===`relic`?Bl[n.id]?.name:n.kind===`card`?Ll[n.id]?.name:`${n.amount} gold`,r=Q(`.mnode[data-node="${e.id}"]`),i=r?(()=>{let e=r.getBoundingClientRect();return{x:e.left+e.width/2,y:e.top+e.height/2}})():{x:innerWidth/2,y:innerHeight/2};Pd(i.x,i.y-34,`✦ ${t}`,`goldf`),ng(i.x,i.y,innerWidth/2,innerHeight*.5,{n:8,color:`#ffe9ac`,size:8,dur:720}),tg(`THE STONE REMEMBERS`)}_h(`map`)}function Oh(e,t){if(Xu(),td(),Q(`#tooltip`).style.display=`none`,Z.screen!==`combat`&&gh(),Z.cb=Wf(Z.run,e,t),Z.screen=`combat`,kh(),ah(),t===`boss`){let e=$(`div`,`rose-window`,`<div class="rw-rings"></div><div class="rw-spokes"></div>`);Jm().appendChild(e),setTimeout(()=>e.remove(),2300);let t=$(`div`,`turn-banner boss-banner`,Z.cb.enemies[0].name.toUpperCase());Jm().appendChild(t),setTimeout(()=>t.remove(),2100),kd(`#1a0a20`,.5,.9),ld(1.6),X.bigDeath()}fg().then(hg)}function kh(){let e=Z.cb,t=Jm();t.onclick=null,t.innerHTML=`<div class="combat-screen screen-enter intro">
    <div class="stage-ledge" style="--ledge:${`#${Il[Z.run.act].theme.glow.toString(16).padStart(6,`0`)}`}"></div>
    <div class="battlefield">
      <div class="player-zone">
        <div class="hero-wrap">
          <div class="hero-name">${Ql[Z.run.aspect].name.toUpperCase()}</div>
          ${Xm(Z.run.aspect)}
        </div>
        <div class="hpbar-wrap"><span class="block-chip zero p-block">${fm(`shield`,13)} 0</span><div class="hpbar"><div class="ghost"></div><div class="fill"></div></div><span class="hp-label p-hp"></span></div>
        <div class="status-row p-status"></div>
      </div>
      <div class="enemy-zone"></div>
    </div>
    <div class="energy-orb"><div class="num">0</div><div class="lbl">ENERGY</div><div class="candles"></div></div>
    <button class="lantern-btn"><span class="lb-ic">${fm(`lantern`,26)}</span><span class="lb-count">0</span><div class="lb-pips"></div><span class="lb-art"></span></button>
    <button class="btn end-turn">End Turn</button>
    <button class="pile-btn pile-draw"><span class="cnt">0</span><span class="lbl">DRAW</span></button>
    <button class="pile-btn pile-discard"><span class="cnt">0</span><span class="lbl">DISCARD</span></button>
    <button class="pile-btn pile-exhaust"><span class="cnt">0</span><span class="lbl">ASHES</span></button>
    <div class="hand-zone"></div>
  </div>`;let n=Q(`.enemy-zone`,t),r={enemies:[],root:Q(`.combat-screen`,t)},i=e.affix?Yl[e.affix]:null;e.enemies.forEach((t,a)=>{let o=Ul[t.key],s=Mh(o,e.enemies.length),c=$(`div`,`enemy${o.elite?` elite-e`:``}${o.boss?` boss-e`:``}${i?` affixed`:``}`);i&&c.style.setProperty(`--affix-tone`,i.tone),c.dataset.idx=a,c.style.animationDelay=`${160+a*130}ms`,c.innerHTML=`<div class="intent"></div>
      <div class="enemy-art" style="width:${s}px;height:${s}px"><div class="enemy-sprite">${Ym(`enemies`,t.key,$p(o.art))}</div><div class="dmg-preview"></div></div>
      <div class="name">${i?`<span class="affix-name" style="color:${i.tone}">${i.name.toUpperCase()}</span> `:``}${t.name.toUpperCase()}</div>
      <div class="hpbar-wrap"><span class="block-chip zero">${fm(`shield`,13)} 0</span><div class="hpbar"><div class="ghost"></div><div class="fill"></div><div class="pv"></div></div><span class="hp-label"></span></div>
      <div class="facet-row"></div>
      <div class="status-row"></div>`,n.appendChild(c),r.enemies.push({root:c,art:Q(`.enemy-art`,c),intent:Q(`.intent`,c),fill:Q(`.fill`,c),ghost:Q(`.ghost`,c),hp:Q(`.hp-label`,c),block:Q(`.block-chip`,c),statuses:Q(`.status-row`,c),pv:Q(`.pv`,c),prev:Q(`.dmg-preview`,c),facets:Q(`.facet-row`,c)}),r.enemies[a].facets._tip={title:`Facets`,body:`Every creature is glass. Attacks that draw unblocked blood chip a facet; fill the gauge and the glass <b>shatters</b> — it loses its next action, is Cracked, and spills Embers into your lantern.`},i&&(Q(`.name`,c)._tip={title:`${i.name} — an elite's title`,body:i.text}),c.onclick=()=>Yh(a),c.addEventListener(`pointerenter`,e=>{e.pointerType===`mouse`&&Z.targeting&&(c.classList.add(`target-hover`),qh())}),c.addEventListener(`pointerleave`,()=>{c.classList.remove(`target-hover`),qh()})}),r.pHp=Q(`.p-hp`,t),r.pFill=Q(`.player-zone .fill`,t),r.pGhost=Q(`.player-zone .ghost`,t),r.pBlock=Q(`.p-block`,t),r.pStatus=Q(`.p-status`,t),r.hero=Q(`.hero-wrap`,t),r.energy=Q(`.energy-orb`,t),r.endTurn=Q(`.end-turn`,t),r.hand=Q(`.hand-zone`,t),r.draw=Q(`.pile-draw`,t),r.discard=Q(`.pile-discard`,t),r.exhaust=Q(`.pile-exhaust`,t),r.lantern=Q(`.lantern-btn`,t);let a=Xl[Z.run.art];a&&(Q(`.lb-art`,r.lantern).innerHTML=`<i>${a.glyph}</i>${a.cost}`,Q(`.lb-art`,r.lantern).style.color=a.tone),r.lantern._tip={title:a?`Lantern Art — ${a.name}`:`The Lantern`,body:`${a?`<b>${a.cost} Embers, once a turn:</b> ${a.text}<br><br>`:``}The lantern holds the <b>Embers</b> spilled by shattered and slain glass. Drag any card onto it to <b>kindle</b> — burn the card away for an ember, once a turn. Curses refuse the fire.`,sub:`A · use Art`},r.lantern.onclick=async()=>{if(!(Z.busy||!Z.cb||Z.cb.over)){if(Fm(),!ep(Z.run,Z.cb)){r.lantern.classList.add(`nope`),setTimeout(()=>r.lantern.classList.remove(`nope`),350),X.debuff();return}Zh(),tp(Z.run,Z.cb),await fg(),hg()}},Z.ce=r,ag(),sg(),setTimeout(()=>r.root.classList.remove(`intro`),1300),r.endTurn.onclick=eg,r.draw.onclick=()=>{X.click(),mh(`Draw Pile`,e.draw,{sub:`Order hidden — shown alphabetically`,inCombat:!0})},r.discard.onclick=()=>{X.click(),mh(`Discard Pile`,e.discard,{inCombat:!0})},r.exhaust.onclick=()=>{X.click(),mh(`The Ashes`,e.exhaust,{sub:`Burned away — each fed the lantern an ember`,inCombat:!0})},r.root.addEventListener(`pointerdown`,e=>{e.target.closest(`.enemy`)||e.target.closest(`.card`)||(Z.targeting?Zh():Z.hoveredCard!=null&&(Z.hoveredCard=null,zh()))}),Lh(),Rh()}var Ah=e=>Id(Z.ce.enemies[e].art),jh=()=>Id(Z.ce.hero);function Mh(e,t){let n=Math.min(innerWidth*.31,240),r=(innerWidth-n-innerWidth*.08)/t-12,i=(e.boss?280:e.elite?230:185)*(e.art.size>=1.4?1:e.art.size<.8?.86:.95)*Math.min(e.art.size,1.45);return Math.round(Math.min(i,innerHeight*(e.boss?.34:.3),Math.max(72,r*(e.boss?1.12:1))))}var Nh=0;addEventListener(`resize`,()=>{clearTimeout(Nh),Nh=setTimeout(()=>{let e=Z.cb,t=Z.ce;!e||!t||Z.screen!==`combat`||(e.enemies.forEach((n,r)=>{let i=Mh(Ul[n.key],e.enemies.length);t.enemies[r].art.style.width=t.enemies[r].art.style.height=`${i}px`}),zh(),sg())},120)});function Ph(e,t,n){e.innerHTML=``;for(let[n,r]of Object.entries(t)){if(!r)continue;let t=zl[n]||{name:n,icon:`?`,kind:`buff`,desc:``},i=n===`str`&&r<0?`debuff`:t.kind,a=$(`span`,`schip ${i}`,`${t.icon} <span class="n">${r}</span>`);a._tip={title:t.name,body:t.desc.replace(/\bN\b/g,r),sub:i===`debuff`?`Debuff`:`Buff`},e.appendChild(a)}}function Fh(e){let t=Z.cb,n=Yf(e),r=wp(Z.run,t,e),i={attack:fm(`sword`,19),block:fm(`shield`,19),buff:fm(`up`,19),debuff:fm(`cloud`,19),heal:fm(`plus`,19)}[n.intent]||fm(`sword`,19),a=``;n.intent.startsWith(`attack`)&&(i=fm(`sword`,19),a=r.times>1?`${r.dmg}×${r.times}`:`${r.dmg}`,n.intent===`attack_debuff`&&(i+=fm(`cloud`,14)),n.intent===`attack_block`&&(i+=fm(`shield`,14)),n.intent===`attack_buff`&&(i+=fm(`up`,14)));let o=[];return r&&o.push(`attack for <b>${r.dmg}${r.times>1?`×${r.times}`:``}</b>`),n.block&&o.push(`gain Ward`),n.heal&&o.push(`heal itself`),n.fx?.some(e=>e.who===`player`)&&o.push(`afflict you`),n.fx?.some(e=>e.who!==`player`)&&o.push(`empower`),n.addCards&&o.push(`add ${n.addCards.n} ${Ll[n.addCards.id].name}s to your discard`),{icon:i,txt:a,tip:{title:n.name,body:`Intends to ${o.join(`, `)||`act`}.`}}}function Ih(e,t=0){if(e.facetMax>8)return`<span class="pipnum">${fm(`facet`,11)} ${e.chips}${t?`<i>+${t}</i>`:``}/${e.facetMax}</span>`;let n=``;for(let r=0;r<e.facetMax;r++)n+=`<span class="pip${r<e.chips?` filled`:r<e.chips+t?` willchip`:``}"></span>`;return n}function Lh(){let e=Z.cb,t=Z.ce;if(!t)return;e.enemies.forEach((e,n)=>{let r=t.enemies[n],i=`${100*Math.max(0,e.hp)/e.maxHp}%`;if(r.fill.style.width=i,r.ghost.style.width=i,r.hp.textContent=`${Math.max(0,e.hp)}/${e.maxHp}`,r.block.classList.toggle(`zero`,e.block<=0),r.block.innerHTML=`${fm(`shield`,13)} ${e.block}`,r.art.classList.toggle(`warded`,e.block>0),r.root.classList.toggle(`lowhp`,e.hp>0&&e.hp/e.maxHp<=.3),Ph(r.statuses,e.statuses,!1),e.hp>0?r.facets.innerHTML=Ih(e):r.facets.innerHTML=``,e.hp<=0&&r.root.classList.add(`gone`),e.hp>0&&e.flags.staggered)r.intent.className=`intent i-staggered`,r.intent.innerHTML=`<span class="ic">${fm(`stagger`,19)}</span>STAGGERED`,r.intent._tip={title:`Staggered`,body:`The glass has shattered — this creature loses its next action while it reseams.`};else if(e.hp>0&&e.moveKey){let t=Fh(e);r.intent.className=`intent i-${Yf(e).intent}`,r.intent.innerHTML=`<span class="ic">${t.icon}</span>${t.txt}`,r.intent._tip=t.tip}else r.intent.innerHTML=``}),t.lantern&&(Q(`.lb-count`,t.lantern).textContent=e.embers,Q(`.lb-pips`,t.lantern).innerHTML=Array.from({length:e.emberCap},(t,n)=>`<span class="lbp${n<e.embers?` lit`:``}" style="--a:${Math.round(n/(e.emberCap-1)*280-140)}deg"></span>`).join(``),t.lantern.classList.toggle(`unlit`,e.embers===0),t.lantern.classList.toggle(`ready`,ep(Z.run,e)),t.lantern.classList.toggle(`art-spent`,e.artUsedTurn===e.turn&&!e.over));let n=e.player,r=`${100*Math.max(0,n.hp)/n.maxHp}%`;t.pFill.style.width=r,t.pGhost.style.width=r,t.pHp.textContent=`${Math.max(0,n.hp)}/${n.maxHp}`,t.pBlock.classList.toggle(`zero`,n.block<=0),t.pBlock.innerHTML=`${fm(`shield`,13)} ${n.block}`,t.hero.classList.toggle(`warded`,n.block>0),t.hero.classList.toggle(`lowhp`,n.hp/n.maxHp<=.3),Ph(t.pStatus,n.statuses,!0),Q(`.num`,t.energy).textContent=n.energy,t.energy.classList.toggle(`spent`,n.energy===0);let i=Q(`.candles`,t.energy),a=Math.max(n.energyMax,n.energy);i.children.length!==a&&(i.innerHTML=Array.from({length:a},()=>`<span class="candle"></span>`).join(``)),[...i.children].forEach((e,t)=>e.classList.toggle(`lit`,t<n.energy)),Q(`.cnt`,t.draw).textContent=e.draw.length,Q(`.cnt`,t.discard).textContent=e.discard.length,Q(`.cnt`,t.exhaust).textContent=e.exhaust.length}function Rh(){let e=Z.cb,t=Z.ce;if(!t)return;let n=t.hand,r=new Map(Km(`.card`,n).map(e=>[e.dataset.uid,e])),i=new Set(e.hand.map(e=>String(e.uid)));for(let[e,t]of r)i.has(e)||t.remove();for(let t of e.hand)if(r.has(String(t.uid))){let e=rh(t,{inCombat:!0}),n=r.get(String(t.uid));n.replaceChildren(...e.childNodes),n.className=e.className+(n.classList.contains(`armed`)?` armed`:``),n.onclick=e=>{e.stopPropagation(),Jh(t.uid)},Gm&&(n.onmouseenter=()=>{Z.hoveredCard=t.uid,zh()},n.onmouseleave=()=>{Z.hoveredCard===t.uid&&(Z.hoveredCard=null),zh()})}else{let e=rh(t,{inCombat:!0});e.classList.add(`draw-in`),setTimeout(()=>e.classList.remove(`draw-in`),400),e.onclick=e=>{e.stopPropagation(),Jh(t.uid)},Gm&&(e.onmouseenter=()=>{Z.hoveredCard=t.uid,X.hover(),zh()},e.onmouseleave=()=>{Z.hoveredCard===t.uid&&(Z.hoveredCard=null),zh()}),Vh(e,t.uid),n.appendChild(e)}zh()}function zh(){let e=Z.cb,t=Z.ce;if(!t)return;let n=e.hand.map(e=>String(e.uid)),r=new Map(Km(`.card`,t.hand).map(e=>[e.dataset.uid,e])),i=n.length,a=Math.min(112,640/Math.max(i,1),(innerWidth-246)/Math.max(i-1,1));n.forEach((t,n)=>{let o=r.get(t);if(!o)return;let s=e.hand[n],c=!wf(s).unplayable&&(pp(Z.run,e,s)??99)<=e.player.energy;o.classList.toggle(`unplayable-now`,!c);let l=Z.targeting?.kind===`card`&&String(Z.targeting.uid)===t,u=Z.hoveredCard!=null&&String(Z.hoveredCard)===t,d=i>1?(n-(i-1)/2)*Math.min(5,42/i):0,f=(n-(i-1)/2)*a,p=Math.abs(d)*3.2;o.classList.toggle(`armed`,l),o.classList.toggle(`lifted`,u&&!Z.busy&&!l),o.style.transform=`translateX(calc(-50% + ${l?f*.4:f}px)) translateY(${p+26}px) rotate(${l?d*.5:d}deg)`,o.style.zIndex=u||l?40:20+n}),qh()}var Bh=0;function Vh(e,t){e.addEventListener(`pointerdown`,n=>{if(!(Z.busy||!Z.cb||Z.cb.over||!n.isPrimary||Z.drag)){Z.drag={uid:t,id:n.pointerId,x0:n.clientX,y0:n.clientY,live:!1,free:!1};try{e.setPointerCapture(n.pointerId)}catch{}}}),e.addEventListener(`pointermove`,n=>{let r=Z.drag;if(!(!r||r.uid!==t||n.pointerId!==r.id)){if(!r.live){r.y0-n.clientY>26&&Wh(r,e);return}if(r.free){e.style.transform=`translate(calc(-50% + ${n.clientX-innerWidth/2}px), ${n.clientY-innerHeight+130}px) scale(1.12)`;let t=!!Uh(n.clientX,n.clientY)?.closest(`.lantern-btn`);e.classList.toggle(`will-burn`,t),e.classList.toggle(`will-cast`,!r.kindleOnly&&!t&&n.clientY<Hh())}else Qh(n),Kh(n.clientX,n.clientY)}});let n=(n,r)=>{let i=Z.drag;if(!i||i.uid!==t||n.pointerId!==i.id||(Z.drag=null,!i.live))return;if(Bh=performance.now(),e.classList.remove(`dragging`,`will-cast`,`will-burn`),Z.ce?.lantern?.classList.remove(`kindle-target`),r){Zh(),zh();return}if(Uh(n.clientX,n.clientY)?.closest(`.lantern-btn`)){let e=Z.cb.hand.find(e=>e.uid===t);if(e&&rp(Z.run,Z.cb,e)){Zh(),Gh(t);return}Zh(),zh();return}if(i.kindleOnly){Z.hoveredCard=null,zh();return}if(i.free){n.clientY<Hh()?$h(t,null):(Z.hoveredCard=null,zh());return}let a=document.elementFromPoint(n.clientX,n.clientY)?.closest(`.enemy`),o=a?+a.dataset.idx:-1,s=Z.cb.enemies.filter(e=>e.hp>0);o>=0&&Z.cb.enemies[o].hp>0?$h(t,o):s.length===1&&n.clientY<Hh()?$h(t,s[0].idx):(Zh(),zh())};e.addEventListener(`pointerup`,e=>n(e,!1)),e.addEventListener(`pointercancel`,e=>n(e,!0))}var Hh=()=>Z.ce?.hand?Z.ce.hand.getBoundingClientRect().top-24:innerHeight-260,Uh=(e,t)=>document.elementsFromPoint(e,t).find(e=>!e.closest(`.card`));function Wh(e,t){let n=Z.cb,r=n.hand.find(t=>t.uid===e.uid);if(!r){Z.drag=null;return}let i=wf(r);if(i.unplayable||pp(Z.run,n,r)>n.player.energy){if(rp(Z.run,n,r)){e.live=!0,e.free=!0,e.kindleOnly=!0,Z.hoveredCard=null,X.hover(),t.classList.add(`dragging`),Z.ce?.lantern?.classList.add(`kindle-target`);return}Z.drag=null,t.classList.add(`nope`),setTimeout(()=>t.classList.remove(`nope`),350),X.debuff();return}e.live=!0,Z.hoveredCard=null,X.hover(),rp(Z.run,n,r)&&Z.ce?.lantern?.classList.add(`kindle-target`),i.target===`enemy`?Xh({kind:`card`,uid:e.uid}):(e.free=!0,Zh(),t.classList.add(`dragging`))}async function Gh(e){if(Z.hoveredCard=null,!ap(Z.run,Z.cb,e)){zh();return}await fg(),hg()}function Kh(e,t){let n=document.elementFromPoint(e,t)?.closest(`.enemy`);Z.ce?.enemies.forEach(e=>e.root.classList.toggle(`target-hover`,e.root===n&&e.root.classList.contains(`targetable`))),qh()}function qh(){let e=Z.ce,t=Z.cb;if(!e||!t)return;let n=null;Z.targeting?.kind===`card`?n=t.hand.find(e=>e.uid===Z.targeting.uid):Z.drag?.live?n=t.hand.find(e=>e.uid===Z.drag.uid):Z.hoveredCard!=null&&!Z.busy&&(n=t.hand.find(e=>e.uid===Z.hoveredCard));let r=n?wf(n):null,i=Z.targeting?.kind===`card`||Z.drag?.live&&!Z.drag.free,a=t.enemies.filter(e=>e.hp>0).length;t.enemies.forEach((o,s)=>{let c=e.enemies[s],l=null,u=!1;if(n&&!t.over&&o.hp>0&&!r.unplayable&&(r.target===`allEnemies`?l=Tp(Z.run,t,n,s):r.target===`enemy`&&(i||a===1)&&(l=Tp(Z.run,t,n,s),u=i&&a>1&&!c.root.classList.contains(`target-hover`))),l&&(l.total>0||l.chips>0)){let e=l.hits[0],t=l.hits.length===1&&e&&e.times>1?`${e.dmg}×${e.times}`:`${l.total}`;c.prev.innerHTML=(l.lethal?`${fm(`skull`,15)} `:``)+(l.total>0?t:``)+(l.willShatter&&!u?` <span class="pv-shatter">${fm(`stagger`,14)}</span>`:``),c.prev.classList.add(`show`),c.prev.classList.toggle(`dim`,u),c.prev.classList.toggle(`lethal`,l.lethal),c.root.classList.toggle(`marked`,l.lethal&&!u);let n=Math.min(o.hp,l.loss)/o.maxHp;c.pv.style.left=`${Math.max(0,o.hp-l.loss)/o.maxHp*100}%`,c.pv.style.width=`${n*100}%`,c.pv.classList.toggle(`show`,l.loss>0),c.facets.innerHTML=Ih(o,u?0:l.chips),c.facets.classList.toggle(`willshatter`,l.willShatter&&!u)}else c.prev.classList.remove(`show`,`lethal`,`dim`),c.root.classList.remove(`marked`),c.pv.classList.remove(`show`),o.hp>0&&(c.facets.innerHTML=Ih(o)),c.facets.classList.remove(`willshatter`)})}function Jh(e){if(Z.busy||!Z.cb||Z.cb.over||performance.now()-Bh<350)return;let t=Z.cb,n=t.hand.find(t=>t.uid===e);if(!n)return;if(Wm&&Z.hoveredCard!==e&&!(Z.targeting?.kind===`card`&&Z.targeting.uid===e)){Z.hoveredCard=e,X.hover(),zh();return}let r=wf(n),i=pp(Z.run,t,n),a=Q(`.card[data-uid="${e}"]`,Z.ce.hand);if(r.unplayable||i>t.player.energy){a?.classList.add(`nope`),setTimeout(()=>a?.classList.remove(`nope`),350),X.debuff();return}if(Z.targeting?.kind===`card`&&Z.targeting.uid===e)return Zh();if(r.target===`enemy`){let n=t.enemies.filter(e=>e.hp>0);if(n.length===1)return void $h(e,n[0].idx);Xh({kind:`card`,uid:e})}else $h(e,null)}function Yh(e){if(!Z.targeting||Z.busy)return;let t=Z.cb.enemies[e];if(!t||t.hp<=0)return;let n=Z.targeting;n.kind===`card`?$h(n.uid,e):n.kind===`potion`&&uh(n.slot,e)}function Xh(e){if(Z.targeting=e,Z.ce.root.classList.add(`targeting`),Z.cb.enemies.forEach((e,t)=>Z.ce.enemies[t].root.classList.toggle(`targetable`,e.hp>0)),zh(),document.addEventListener(`pointermove`,Qh),Qh._last)Qh(Qh._last);else{let e=Z.cb.enemies.findIndex(e=>e.hp>0);if(e>=0){let t=Ah(e);Qh({clientX:t.x,clientY:t.y,synthetic:!0})}}}function Zh(){Z.targeting=null,Q(`#aim`).innerHTML=``,document.removeEventListener(`pointermove`,Qh),Z.ce&&(Z.ce.root.classList.remove(`targeting`),Z.ce.enemies.forEach(e=>e.root.classList.remove(`targetable`,`target-hover`)),zh()),ih()}function Qh(e){if(e.synthetic||(Qh._last=e),!Z.targeting)return;let t;if(Z.targeting.kind===`card`){let e=Q(`.card[data-uid="${Z.targeting.uid}"]`);t=e?Id(e):{x:innerWidth/2,y:innerHeight-200}}else t={x:innerWidth/2,y:60};let n=e.clientX,r=e.clientY,i=(t.x+n)/2,a=Math.min(t.y,r)-120;if(Q(`#aim`).innerHTML=`<path d="M${t.x} ${t.y-80} Q${i} ${a} ${n} ${r}" fill="none" stroke="rgba(255,89,100,.85)" stroke-width="4" stroke-dasharray="4 10" stroke-linecap="round"/>
    <circle cx="${n}" cy="${r}" r="9" fill="none" stroke="rgba(255,89,100,.95)" stroke-width="3"/>`,Z.ce?.hero){let e=Id(Z.ce.hero),t=Q(`#lantern`);t.style.setProperty(`--lx`,`${Math.round(e.x+(n-e.x)*.3)}px`),t.style.setProperty(`--ly`,`${Math.round(e.y+(r-e.y)*.3)}px`)}}async function $h(e,t){Zh(),Z.hoveredCard=null,hp(Z.run,Z.cb,e,t)&&(await fg(t),hg())}async function eg(){Z.busy||!Z.cb||Z.cb.over||(Zh(),X.click(),yp(Z.run,Z.cb),await fg(),hg())}function tg(e){let t=$(`div`,`turn-banner`,e);Jm().appendChild(t),setTimeout(()=>t.remove(),1150)}function ng(e,t,n,r,{n:i=6,color:a=`#ffe9ac`,size:o=8,dur:s=640,glyph:c=``,cls:l=`flymote`,done:u=null}={}){let d=Q(`#floaties`);for(let f=0;f<i;f++){let p=$(`div`,l,c);p.style.left=`${e}px`,p.style.top=`${t}px`,c?p.style.color=a:(p.style.width=`${o}px`,p.style.height=`${o}px`,p.style.background=`radial-gradient(circle at 35% 30%, #fff, ${a} 55%, transparent 85%)`),d.appendChild(p);let m=(e+n)/2+(Math.random()-.5)*140,h=Math.min(t,r)-50-Math.random()*80,g=p.animate([{transform:`translate(-50%,-50%) scale(0.5)`,opacity:0},{transform:`translate(calc(-50% + ${m-e}px), calc(-50% + ${h-t}px)) scale(1.05)`,opacity:1,offset:.45},{transform:`translate(calc(-50% + ${n-e}px), calc(-50% + ${r-t}px)) scale(0.55)`,opacity:.95}],{duration:s,delay:f*46,easing:`cubic-bezier(.32,.05,.35,1)`});g.onfinish=()=>{p.remove(),f===i-1&&u&&u()}}}var rg=matchMedia(`(prefers-reduced-motion: reduce)`).matches;function ig(e,t,n,r=640){if(t=Math.round(t),n=Math.round(n),rg||t===n){e.textContent=n;return}let i=performance.now(),a=o=>{let s=Math.min(1,(o-i)/r),c=1-(1-s)**3;e.textContent=Math.round(t+(n-t)*c),s<1?requestAnimationFrame(a):(e.textContent=n,e.classList.remove(`tick`),e.offsetWidth,e.classList.add(`tick`))};requestAnimationFrame(a)}function ag(){let e=Z.ce,t=Z.cb;e.rig=[];let n=(t,n,r,i,a,o,s=0)=>{let c=Q(`svg`,n),l=Q(`.enemy-sprite`,n)||n,u=Q(`.raster-art`,l);if(!c&&!u)return;let d=Math.random()*100;if(c){let e=Q(`.breathe`,c);e&&(e.style.animationDuration=`${(2.5+d%1.9).toFixed(2)}s`,e.style.animationDelay=`${(-(d%3.1)).toFixed(2)}s`,e.style.setProperty(`--brY`,(1.022+d%.024).toFixed(3)),e.style.setProperty(`--sw`,`${(d*7%1.7-.85).toFixed(2)}deg`)),Km(`.hover-float`,c).forEach(e=>e.style.animationDelay=`${(-(d%2.7)).toFixed(2)}s`)}else if(o&&(l.classList.add(`idle-${o}`),l.style.animationDelay=`${(-(d%2.8)).toFixed(2)}s`,o===`wisp`||o===`plant`)){let e=$(`div`,`idle-motes`);e.style.setProperty(`--mote`,`hsla(${s},85%,62%,0.6)`),l.appendChild(e)}let f=$(`div`,`lightpool`);f.style.background=`radial-gradient(ellipse at 50% 50%, ${r}, transparent 72%)`,n.appendChild(f),e.rig.push({root:t,art:n,sprite:l,svg:c,eyes:c?Km(`.eye`,c):[],fire:c?Q(`.innerfire`,c):null,pool:f,seed:d,isHero:i,idx:a,dx:0,dy:0})};t.enemies.forEach((t,r)=>{let i=Ul[t.key].art;n(e.enemies[r].root,e.enemies[r].art,`hsla(${i.hue},90%,66%,.72)`,!1,r,i.kind,i.hue)}),n(e.hero,e.hero,`rgba(127,212,255,.62)`,!0,0,`humanoid`,0)}function og(){if(!Hd())return;let e=Z.ce,t=Z.cb;if(!e||!t)return;let n=[],r=Wp(`heroes`,Ql[Z.run.aspect].id);r&&e.hero&&n.push({el:e.hero,url:r,kind:`humanoid`,flip:!0}),t.enemies.forEach((t,r)=>{let i=Wp(`enemies`,t.key),a=e.enemies[r]?.art,o=a&&(Q(`.enemy-sprite`,a)||a);i&&o&&n.push({el:o,url:i,kind:Ul[t.key].art.kind})}),df(n)}function sg(){requestAnimationFrame(()=>requestAnimationFrame(og))}function cg(){uf()}function lg(e){requestAnimationFrame(lg);let t=Z.ce,n=Z.cb;if(rg||!n||Z.screen!==`combat`||!t?.rig)return;let r=null,i=n.enemies.findIndex(e=>e.hp>0);Z.targeting&&Qh._last?r={x:Qh._last.clientX,y:Qh._last.clientY}:i>=0&&(r=Ah(i));let a=jh();for(let i of t.rig){let t=i.isHero?n.player:n.enemies[i.idx];if(!i.isHero&&t.hp<=0){i.pool.style.opacity=0;continue}let o=i.isHero?r:a;if(o&&i.eyes.length){let e=Id(i.art),t=Math.atan2(o.y-e.y,o.x-e.x);i.dx+=(Math.cos(t)*2.4-i.dx)*.08,i.dy+=(Math.sin(t)*1.6-i.dy)*.08;let n=`translate(${i.dx.toFixed(2)}px,${i.dy.toFixed(2)}px)`;for(let e of i.eyes)e.style.transform=n}let s=.45+.55*(Math.max(0,t.hp)/t.maxHp);i.root.classList.contains(i.isHero?`lunge`:`acting`)&&(s+=1.1),(t.statuses?.str||0)>0&&(s+=.3);let c=.86+.14*Math.sin(e*.006+i.seed)*Math.sin(e*.0021+i.seed*3);i.fire&&(i.fire.style.opacity=Math.min(.55,(.05+.13*s)*c).toFixed(3)),i.pool.style.opacity=Math.min(.85,(.3+.4*s)*c).toFixed(3)}}var ug=!1;function dg(e,t){let n=e&&Q(`.cracks`,e);n&&n.children.length<8&&n.insertAdjacentHTML(`beforeend`,Zp(t))}async function fg(e=null){let t=Z.cb,n=Z.ce;Z.busy=!0,n.endTurn.classList.add(`enemy-phase`);let r=t.queue;for(;r.length;){let t=r.shift();try{await mg(t,e)}catch(e){console.error(`vfx event error`,t,e)}}Z.busy=!1,t.over||n.endTurn.classList.remove(`enemy-phase`),Lh(),Rh(),ah()}var pg=null;async function mg(e,t){let n=Z.cb,r=Z.ce;switch(e.t){case`chip`:{let t=r.enemies[e.idx],{x:n,y:i}=Ah(e.idx);X.chip(),Ad(n,i,{color:`#e8f4ff`,n:5,speed:190,size:1.8,grav:240,kind:`spark`}),Lh(),t.facets.classList.remove(`pop`),t.facets.offsetWidth,t.facets.classList.add(`pop`),await qm(110);break}case`shatter`:{let t=r.enemies[e.idx],{x:n,y:i}=Ah(e.idx);pg={x:n,y:i},X.shatter(),Od(90),jd(n,i,`#dfeaff`,10,700,5),Ad(n,i,{color:`#dfeaff`,n:26,speed:430,size:2.4,grav:300,kind:`spark`}),Pd(n,i-58,`${fm(`stagger`,20)} SHATTER`,`shatterf`),Dd(10),ld(.9),dg(t.art,!0),t.root.classList.add(`hurt`),setTimeout(()=>t.root.classList.remove(`hurt`),320),Lh(),await qm(380);break}case`adamantHold`:{let{x:t,y:n}=Ah(e.idx);X.blocked(),Pd(t,n-52,`THE GLASS HOLDS`,`blockedf`),jd(t,n,`#d8c27a`,8,480,4),Lh(),await qm(260);break}case`ember`:if(e.n>0&&r.lantern){let t=pg||jh(),n=Id(r.lantern);ng(t.x,t.y,n.x,n.y,{n:Math.min(e.n*2,5),color:`#ffb35a`,size:6,dur:460}),X.ember(),setTimeout(()=>{r.lantern.classList.remove(`pop`),r.lantern.offsetWidth,r.lantern.classList.add(`pop`),Lh()},440),await qm(300)}else Lh();pg=null;break;case`kindle`:{let t=Q(`.card[data-uid="${e.uid}"]`,r.hand);t&&(pg=Id(t)),X.kindle(),await qm(60);break}case`art`:{let t=Xl[e.id],{x:n,y:i}=jh(),a=r.lantern?Id(r.lantern):{x:n,y:i};X.art(),kd(t.tone,.12,.5),jd(a.x,a.y,t.tone,10,620,5),Nd(n,i,t.tone,12),Pd(n,i-84,t.name.toUpperCase(),`artf`),ld(.7),Lh(),await qm(420);break}case`staggered`:{let t=r.enemies[e.idx],{x:n,y:i}=Ah(e.idx);X.stagger(),Pd(n,i-76,`STAGGERED`,`staggerf`),t.root.classList.add(`reseaming`),setTimeout(()=>t.root.classList.remove(`reseaming`),720),Lh(),await qm(520);break}case`smolderJump`:{let t=Ah(e.from),n=Ah(e.to);X.poison(),ng(t.x,t.y,n.x,n.y,{n:5,color:`#a3e06c`,size:7,dur:460}),await qm(400);break}case`turn`:e.n>1&&(tg(`YOUR TURN`),X.turn()),Lh(),await qm(e.n>1?500:120);break;case`endTurn`:ug=!1,tg(`ENEMY TURN`),await qm(480);break;case`draw`:Rh(),Lh(),X.draw(),await qm(75);break;case`reshuffle`:{X.card();let e=Id(r.discard),t=Id(r.draw);ng(e.x,e.y,t.x,t.y,{n:6,cls:`flycard`,dur:520}),Pd(t.x,t.y-46,`Reshuffle`,`notice`),await qm(420);break}case`play`:{let i=Q(`.card[data-uid="${e.uid}"]`,r.hand);if(X.card(),ug=!0,i&&t!=null&&n.enemies[t]){let e=i.getBoundingClientRect(),{x:n,y:r}=Ah(t),a=i.cloneNode(!0);Object.assign(a.style,{position:`fixed`,left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`,margin:0,transform:`none`,zIndex:56,pointerEvents:`none`}),document.getElementById(`floaties`).appendChild(a),i.remove(),a.animate([{transform:`none`,opacity:1},{transform:`translate(${n-e.left-e.width/2}px,${r-e.top-e.height/2}px) scale(0.22) rotate(14deg)`,opacity:0}],{duration:270,easing:`cubic-bezier(.45,0,.9,.5)`}).onfinish=()=>a.remove()}else i&&(i.classList.add(`played-up`),setTimeout(()=>i.remove(),320));Lh(),await qm(200);break}case`hitEnemy`:{let t=r.enemies[e.idx],{x:n,y:i}=Ah(e.idx);if(e.poison)X.poison(),Nd(n,i,`#a3e06c`,14),Pd(n,i-20,`${e.amount}`,`poisonf`);else{let a=e.amount>=16;ug&&(r.hero.classList.remove(`lunge`),r.hero.offsetWidth,r.hero.classList.add(`lunge`)),X.slash(),e.amount>0&&X.hit(),Md(n,i,a?`#ffd8a0`:`#ffffff`),Ad(n,i,{color:`#ff9a6a`,n:a?30:14,speed:a?420:260}),e.blocked>0&&(X.blocked(),Pd(n,i+26,`${fm(`shield`,19)}${e.blocked}`,`blockedf`),Ad(n,i+8,{color:`#9fd4ff`,n:9,speed:210,size:2,grav:260,kind:`spark`})),e.amount>0?Pd(n,i-24,`${e.amount}`,e.killingBlow||a?`crit`:`dmg`):e.blocked||Pd(n,i-24,`0`,`blockedf`),Dd(Math.min(4+e.amount*.5,15)),ld(Math.min(.2+e.amount/26,1)),a&&(Od(70),jd(n,i,`#ffd8a0`,10,620,5)),e.killingBlow&&(Od(e.overkill>=8?130:90),ld(Math.min(1.6,.6+e.overkill*.06)),jd(n,i,`#ffffff`,8,780,5),jd(n,i,`#ffd8a0`,14,900,4),kd(`#ffe6b0`,.09,.28),e.overkill>=8&&(kd(`#ffffff`,.12,.24),Ad(n,i,{color:`#fff3d6`,n:26,speed:620,size:2.6,grav:200,kind:`spark`}),Ad(n,i,{color:`#ffd76e`,n:12,speed:300,size:3.4,grav:120,kind:`spark`}))),e.amount>0&&dg(t.art,a)}t.root.classList.add(`hurt`),setTimeout(()=>t.root.classList.remove(`hurt`),320),Lh(),await qm(230);break}case`die`:{let t=r.enemies[e.idx],i=n.enemies[e.idx],{x:a,y:o}=Ah(e.idx);pg={x:a,y:o},i.boss&&(document.body.classList.add(`worldstop`),t.root.classList.add(`doomed`),Od(110),await qm(820),document.body.classList.remove(`worldstop`),t.root.classList.remove(`doomed`)),(i.boss||i.elite?X.bigDeath:X.death)(),Fd(t.art),Ad(a,o,{color:`#dfeaff`,n:30,speed:480,size:2.6,grav:340,kind:`spark`}),Ad(a,o,{color:`#c9b0ff`,n:26,speed:380,size:3.2,grav:60}),jd(a,o,`#e8dcff`,12,720,6),kd(`#ffffff`,i.boss?.24:.1,.3),Dd(i.boss?22:12),ld(i.boss?2:.9),t.root.classList.add(`dying`),setTimeout(()=>{t.root.classList.remove(`dying`),t.root.classList.add(`gone`)},830),await qm(i.boss?900:500);break}case`hitPlayer`:{let{x:t,y:n}=jh();e.source===`poison`?(X.poison(),Nd(t,n,`#a3e06c`,14)):e.source===`burn`||e.source===`self`?X.debuff():e.source===`thorns`?X.blocked():(X.slash(),e.amount>0&&(X.hit(),kd(`#ff2233`,Math.min(.05+e.amount*.012,.3),.3)),Md(t,n,`#ff8888`)),e.blocked>0&&(X.blocked(),Pd(t,n+30,`${fm(`shield`,19)}${e.blocked}`,`blockedf`),Ad(t,n+8,{color:`#9fd4ff`,n:9,speed:210,size:2,grav:260,kind:`spark`})),e.amount>0?(Pd(t,n-30,`${e.amount}`,e.amount>=16?`crit`:`dmg`),Dd(Math.min(5+e.amount*.6,18)),ld(Math.min(.3+e.amount/22,1.2)),dg(r.hero,e.amount>=16)):e.blocked||Pd(t,n-30,`0`,`blockedf`),Lh(),ah(),await qm(240);break}case`blockGain`:{let t=e.who===`player`,{x:n,y:i}=t?jh():Ah(e.who);X.block(),Pd(n,i-10,`${fm(`shield`,22)} ${e.n}`,`blockf`);let a=t?r.pBlock:r.enemies[e.who].block;a.classList.remove(`pulse`),a.offsetWidth,a.classList.add(`pulse`),Lh(),await qm(140);break}case`status`:{let{x:t,y:n}=e.who===`player`?jh():Ah(e.who),r=zl[e.id]||{name:e.id,kind:`buff`},i=r.kind===`debuff`||e.id===`str`&&e.n<0;(e.id===`poison`?X.poison:i?X.debuff:X.buff)(),Pd(t,n-46,`${e.n>0?`+`:``}${e.n} ${r.name}`,i?`debufff`:`bufff`),i||Nd(t,n,`#9fc8ff`,6),Lh(),await qm(170);break}case`heal`:{let{x:t,y:n}=e.who===`player`?jh():Ah(e.who);X.heal(),Nd(t,n,`#8fe8a0`,14),Pd(t,n-30,`+${e.n}`,`healf`),Lh(),ah(),await qm(200);break}case`energy`:Lh(),r.energy.classList.remove(`pop`),r.energy.offsetWidth,r.energy.classList.add(`pop`);break;case`exhaust`:{let t=Q(`.card[data-uid="${e.uid}"]`,r.hand);if(t){let e=t.getBoundingClientRect(),n=t.cloneNode(!0);Object.assign(n.style,{position:`fixed`,left:`${e.left}px`,top:`${e.top}px`,width:`${e.width}px`,height:`${e.height}px`,margin:0,transform:`none`,zIndex:56,pointerEvents:`none`}),document.getElementById(`floaties`).appendChild(n),t.remove(),n.animate([{clipPath:`circle(80% at 50% 55%)`,filter:`brightness(1)`},{clipPath:`circle(44% at 50% 55%)`,filter:`brightness(1.8) saturate(1.6) sepia(0.45)`,offset:.45},{clipPath:`circle(0% at 50% 55%)`,filter:`brightness(2.6) saturate(2) sepia(0.85)`}],{duration:540,easing:`ease-in`}).onfinish=()=>n.remove(),Ad(e.left+e.width/2,e.top+e.height/2,{color:`#ffb066`,n:22,speed:190,grav:-150,size:2.4,life:.85}),await qm(260)}Lh();break}case`discardHand`:{let e=Km(`.card`,r.hand);e.length&&(X.card(),e.forEach((e,t)=>{e.animate([{opacity:1},{transform:`${e.style.transform} translateX(340px) rotate(20deg)`,opacity:0}],{duration:260,delay:t*28,easing:`ease-in`}).onfinish=()=>e.remove()}),await qm(280+e.length*28)),Lh();break}case`enemyAct`:{let t=r.enemies[e.idx],{x:n,y:i}=Ah(e.idx);t.intent.classList.remove(`telegraph`),t.intent.offsetWidth,t.intent.classList.add(`telegraph`),t.root.classList.add(`acting`),setTimeout(()=>{t.root.classList.remove(`acting`),t.intent.classList.remove(`telegraph`)},650),Pd(n,i-90,e.name,`notice`),await qm(620);break}case`intent`:Lh();break;case`addCard`:Pd(innerWidth/2,innerHeight*.62,`${Ll[e.id].name} added to ${e.where===`hand`?`hand`:`discard`}`,`notice`),X.debuff(),Lh(),Rh(),await qm(240);break;case`relicProc`:{let t=Q(`.relic-chip[data-relic="${e.id}"]`);t&&(t.classList.remove(`proc`),t.offsetWidth,t.classList.add(`proc`)),await qm(90);break}case`maxHp`:{let{x:t,y:n}=jh();Pd(t,n-60,`+${e.n} MAX HP`,`healf`),X.buff(),await qm(160);break}case`potion`:X.potion(),await qm(120);break;case`powerConsumed`:{let t=Q(`.card[data-uid="${e.uid}"]`,r.hand),n=t?Id(t):{x:innerWidth/2,y:innerHeight-180},{x:i,y:a}=jh();ng(n.x,n.y,i,a,{n:7,color:`#c9a8ff`,size:7,dur:560}),X.buff(),setTimeout(()=>{jd(i,a,`#c9a8ff`,12,460,4),Nd(i,a,`#c9a8ff`,8)},560),await qm(300);break}case`victory`:if(Z.lastPerfect=!!e.perfect,await qm(320),X.victory(),kd(`#ffe9ac`,.16,.6),e.perfect){let e=$(`div`,`turn-banner perfect-banner`,`PERFECT`);Jm().appendChild(e),setTimeout(()=>e.remove(),1400),await qm(500)}break;case`defeat`:{await qm(400),X.defeat(),kd(`#300`,.5,1.2);let e=Q(`#lantern`);e.classList.add(`gutter`),e.style.setProperty(`--la`,`1`),e.style.setProperty(`--lr`,`160px`),await qm(900);break}}}function hg(){let e=Z.cb;!e||!e.over||(e.result===`win`?gg():_g())}function gg(){let e=Z.run,t=Z.cb.kind,n=Z.cb.affix;if(Z.cb=null,e.pendingCombat=null,t===`boss`&&e.act>=2){let{newUnlocks:t}=wm(e,!0);Ip(e,!0),_h(`end`,{won:!0,newUnlocks:t});return}_h(`reward`,{kind:t,rewards:zf(e,t,n)})}function _g(){let e=Z.run,t=Om(e),n=e.map.nodes.find(t=>t.id===e.nodeId),r=n?n.row:Math.max(1,e.floorsClimbed-1),{newUnlocks:i}=wm(e,!1);Ip(e,!1),_h(`end`,{won:!1,newUnlocks:i,offers:t,fallAct:e.act,fallRow:r})}function vg({kind:e,rewards:t}){let n=Z.run,r=Jm(),i=e===`boss`?`BOSS VANQUISHED`:e===`elite`?`ELITE SLAIN`:`VICTORY`,a=Z.lastPerfect?`<div class="perfect-seal">✦ PERFECT — the glass untouched ✦</div>`:`<div class="ornament">✦ ✦ ✦</div>`;Z.lastPerfect=!1,r.innerHTML=`<div class="center-panel screen-enter"><div class="panel">
    <div class="ov-title">${i}</div>
    ${a}
    <div class="reward-list"></div>
    <div class="ov-actions"><button class="btn" data-a="continue">Continue</button></div>
  </div></div>`;let o=Q(`.reward-list`,r),s=(e,t,r,i=null)=>{let a=$(`button`,`reward-row`,`<span class="ric">${e}</span><span>${t}</span>`);return i&&(a._tip=i),a.onclick=()=>{r()!==!1&&(a.classList.add(`taken`),Mp(n),ah())},o.appendChild(a),a};if(s(`¤`,`<b class="gold-num">${t.gold}</b> gold`,()=>{n.player.gold+=t.gold,n.stats.goldEarned+=t.gold,X.coin(),requestAnimationFrame(()=>{let e=Q(`#hud .gold-num`),r={x:innerWidth/2,y:innerHeight/2-40},i=e?Id(e):{x:120,y:24},a=n.player.gold-t.gold;e&&(e.textContent=a),ng(r.x,r.y,i.x,i.y,{n:Math.min(9,4+Math.floor(t.gold/12)),color:`#ffd76e`,dur:600,done:()=>X.coin()}),e&&ig(e,a,n.player.gold,640)})}),t.potion){let e=Hl[t.potion];s(Ym(`potions`,t.potion,am(e.tone)),`${e.name}`,()=>{if(!If(n,t.potion))return Pd(innerWidth/2,innerHeight/2,`Potion slots full!`,`notice`),!1;X.potion()},{title:e.name,body:e.text})}if(t.relic){let e=Bl[t.relic];s(`<span style="color:${e.tone};text-shadow:0 0 8px ${e.tone}">${e.glyph}</span>`,`<b>${e.name}</b>`,()=>{Pf(n,t.relic),X.relic(),requestAnimationFrame(()=>{let n=Q(`.relic-chip[data-relic="${t.relic}"]`);if(!n)return;let r=Id(n);ng(innerWidth/2,innerHeight/2-40,r.x,r.y,{n:1,glyph:e.glyph,color:e.tone,dur:680,done:()=>{n.classList.remove(`proc`),n.offsetWidth,n.classList.add(`proc`)}})})},{title:e.name,body:e.text})}s(fm(`cards`,26),`Add a card to your deck`,()=>(l(t.cards,()=>{}),!1));let c=o.lastElementChild;c.dataset.cardrow=`1`,Q(`[data-a="continue"]`,r).onclick=()=>{X.click(),Mp(n),_h(e===`boss`?`bossRelic`:`map`)};function l(e,t){mh(`Choose a Card`,e.map(e=>({id:e,up:!1,uid:null})),{sub:`Add one card to your deck — or skip to keep it lean.`,pick:e=>{e&&(Ep(n,e.id),X.upgrade(),Pd(innerWidth/2,innerHeight/2,`${wf(e).name} added`,`notice`)),c.classList.add(`taken`),Mp(n),t()},canSkip:!0})}}function yg(){let e=Z.run,t=Bf(e),n=Jm();n.innerHTML=`<div class="center-panel screen-enter"><div class="panel" style="width:min(620px,94vw)">
    <div class="ov-title">A BOSS RELIC CALLS</div>
    <div class="ov-sub">Choose one — its power is permanent.</div>
    <div class="big-choices" style="flex-direction:column"></div>
  </div></div>`;let r=Q(`.big-choices`,n);for(let n of t){let t=Bl[n],i=$(`button`,`relic-pick`);i.innerHTML=`<span class="relic-chip" style="--tone:${t.tone}">${t.glyph}</span><span><b>${t.name}</b><span class="rd">${t.text}</span></span>`,i.onclick=()=>{X.relic(),Pf(e,n),bg()},r.appendChild(i)}let i=$(`button`,`btn ghost`,`Take none`);i.style.marginTop=`10px`,i.onclick=()=>{X.click(),bg()},r.appendChild(i)}function bg(){let e=Z.run;e.act++,e.omens.push(bf(e)),e.nodeId=null,e.map=Ef(e),Nf(e,Math.round(e.player.maxHp*.35)),sd(e.act),Ju(e.act,0),Vm(e.act),Mp(e),_h(`map`),tg(`ACT ${e.act+1}`),X.victory(),setTimeout(()=>xg(e),1400)}function xg(e){let t=Jl[e.omens?.[e.act]];if(!t||Z.screen!==`map`)return;let n=$(`div`,`turn-banner omen-banner`,`<span class="ob-glyph" style="color:${t.tone}">${t.glyph}</span> OMEN — ${t.name.toUpperCase()}<div class="ob-sub">${t.text}</div>`);Jm().appendChild(n),X.omen(),setTimeout(()=>n.remove(),4200)}function Sg(){let e=Z.run,t=e.player.deck.some(e=>!e.up&&Ll[e.id].up);Jm().innerHTML=`<div class="center-panel screen-enter"><div class="panel">
    <div class="ov-title">REST SITE</div>
    <div class="art-lg">${Ym(`props`,`campfire`,sm())}</div>
    <div class="ov-sub">The fire crackles. For a moment, the Spire is quiet.</div>
    <div class="big-choices">
      <button class="btn" data-a="rest">${fm(`flame`,18)} Rest <span style="font-size:13px;opacity:.8">— heal ${Math.round(e.player.maxHp*Sf(e))} HP</span></button>
      <button class="btn" data-a="smith" ${t?``:`disabled`}>${fm(`hammer`,18)} Smith <span style="font-size:13px;opacity:.8">— upgrade a card</span></button>
    </div>
  </div></div>`,Q(`[data-a="rest"]`).onclick=t=>{t.currentTarget.disabled=!0,Q(`[data-a="smith"]`).disabled=!0,X.heal();let n=Nf(e,Math.round(e.player.maxHp*Sf(e)));kd(`#ff9a4d`,.12,.8),Pd(innerWidth/2,innerHeight/2-40,`+${n} HP`,`healf`),Nd(innerWidth/2,innerHeight/2,`#8fe8a0`,22),Nd(innerWidth/2,innerHeight/2+60,`#ffb066`,16),Mp(e),setTimeout(()=>{Z.screen===`rest`&&_h(`map`)},900)},Q(`[data-a="smith"]`).onclick=()=>{X.click(),mh(`Upgrade a Card`,e.player.deck.filter(e=>!e.up&&Ll[e.id].up),{sub:`Forge one card into its + form.`,pick:t=>{t&&(Op(e,t.uid),X.upgrade(),kd(`#ffe9ac`,.12,.4),mh(`Upgraded!`,[e.player.deck.find(e=>e.uid===t.uid)],{sub:`It gleams with new power.`}),Mp(e),setTimeout(()=>{Z.screen===`rest`&&(ph(),_h(`map`))},1300))}})}}function Cg(){let e=Z.run;Jm().innerHTML=`<div class="center-panel screen-enter"><div class="panel">
    <div class="ov-title">TREASURE</div>
    <div class="art-lg" style="cursor:pointer" data-a="open">${Ym(`props`,`chest`,om(!1))}</div>
    <div class="ov-sub">A heavy chest, banded in gold. Open it?</div>
    <div class="big-choices"><button class="btn" data-a="open">Open the Chest</button></div>
  </div></div>`;let t=()=>{let t=Ff(e,{common:.55,uncommon:.35,rare:.1});Q(`.art-lg`).innerHTML=Ym(`props`,`chest-open`,om(!0)),X.relic(),kd(`#ffe9ac`,.2,.5),Ad(innerWidth/2,innerHeight/2,{color:`#ffd97a`,n:36,speed:380,grav:160});let n=Q(`.big-choices`);if(t){Pf(e,t);let n=Bl[t];Q(`.ov-sub`).innerHTML=`You claim <b style="color:${n.tone}">${n.name}</b> — <i>${n.text}</i>`}else e.player.gold+=60,Q(`.ov-sub`).innerHTML=`Only coins remain — <b class="gold-num">+60 gold</b>.`,X.coin();ah(),Mp(e),n.innerHTML=``;let r=$(`button`,`btn`,`Continue`);r.onclick=()=>{X.click(),_h(`map`)},n.appendChild(r)};Km(`[data-a="open"]`).forEach(e=>e.onclick=t)}function wg(){let e=Z.run,t=Z.shopData||={};(Z.screen!==`shop`||!t.stock||t.forNode!==e.nodeId)&&(t.stock=Vf(e),t.forNode=e.nodeId);let n=t.stock,r=Jm();r.innerHTML=`<div class="center-panel screen-enter"><div class="panel ov-panel" style="width:min(980px,96vw)">
    <div style="display:flex;align-items:center;justify-content:center;gap:18px">
      <div style="width:130px">${Ym(`props`,`merchant`,cm())}</div>
      <div><div class="ov-title" style="text-align:left">THE MERCHANT</div>
      <div class="ov-sub" style="text-align:left;margin:0">"Gold for glory, stranger. Everything's fair-priced — for the doomed."</div></div>
    </div>
    <div class="shop-grid">
      <div class="shop-row cards-row"></div>
      <div class="shop-row misc-row"></div>
      <div class="ov-actions"><button class="btn ghost" data-a="leave">Leave the Shop</button></div>
    </div>
  </div></div>`;let i=Q(`.cards-row`,r),a=Q(`.misc-row`,r),o=Q(`.shop-grid`,r),s=!1,c=()=>e.player.gold,l=t=>{e.player.gold-=t,X.coin(),Mp(e),ah(),u()};function u(){o&&o.classList.toggle(`list-seq-done`,s),i.innerHTML=``,a.innerHTML=``;for(let t of n.cards){let n=$(`div`,`shop-item ${t.sold?`sold`:``} ${c()<t.price?`cant`:``}`),r=rh({id:t.id,up:!1,uid:null},{size:138});r.onclick=()=>{if(t.sold||c()<t.price)return X.debuff();t.sold=!0,Ep(e,t.id),l(t.price)},n.appendChild(r),n.appendChild($(`div`,`price`,`¤ ${t.price}`)),i.appendChild(n)}for(let t of n.relics){let n=Bl[t.id],r=$(`div`,`shop-item ${t.sold?`sold`:``} ${c()<t.price?`cant`:``}`),i=$(`button`,`shop-relic`,`<span class="relic-chip" style="--tone:${n.tone}">${n.glyph}</span><b>${n.name}</b>${n.text}`);i.onclick=()=>{if(t.sold||c()<t.price)return X.debuff();t.sold=!0,Pf(e,t.id),X.relic(),l(t.price)},r.appendChild(i),r.appendChild($(`div`,`price`,`¤ ${t.price}`)),a.appendChild(r)}for(let t of n.potions){let n=Hl[t.id],r=$(`div`,`shop-item ${t.sold?`sold`:``} ${c()<t.price?`cant`:``}`),i=$(`button`,`shop-relic`,`<span style="width:34px;height:44px">${Ym(`potions`,t.id,am(n.tone))}</span><b>${n.name}</b>${n.text}`);i.onclick=()=>{if(t.sold||c()<t.price)return X.debuff();if(!If(e,t.id)){Pd(innerWidth/2,innerHeight/2,`Potion slots full!`,`notice`);return}t.sold=!0,X.potion(),l(t.price)},r.appendChild(i),r.appendChild($(`div`,`price`,`¤ ${t.price}`)),a.appendChild(r)}let t=$(`div`,`shop-item ${n.removed?`sold`:``} ${c()<n.removeCost?`cant`:``}`),r=$(`button`,`shop-relic`,`<span style="width:34px;display:inline-flex;justify-content:center">${fm(`scissors`,26)}</span><b>Card Removal</b>Remove a card from your deck forever.`);r.onclick=()=>{if(n.removed||c()<n.removeCost)return X.debuff();mh(`Remove a Card`,e.player.deck,{sub:`Cut the dead weight.`,pick:t=>{t&&(Dp(e,t.uid),n.removed=!0,e.player.gold-=n.removeCost,X.card(),Mp(e),ah(),u())},canSkip:!0,skipLabel:`Cancel`})},t.appendChild(r),t.appendChild($(`div`,`price`,`¤ ${n.removeCost}`)),a.appendChild(t),s=!0}u(),Q(`[data-a="leave"]`,r).onclick=()=>{X.click(),_h(`map`)}}function Tg(e){let t=Z.run,n=Gl[e],r=Jm();r.innerHTML=`<div class="center-panel screen-enter"><div class="panel event-panel">
    <div class="ov-title">${n.name.toUpperCase()}</div>
    <div class="event-art">${Ym(`events`,e,lm(n.glyph,n.hue))}</div>
    <div class="event-text">${n.text}</div>
    <div class="event-log"></div>
    <div class="event-choices"></div>
  </div></div>`;let i=Q(`.event-choices`,r);for(let e of n.choices){let n=$(`button`,`event-choice`,`<b>${e.label}</b>${e.sub?`<div class="sub">${e.sub}</div>`:``}`);e.needGold&&t.player.gold<e.needGold&&(n.disabled=!0),n.onclick=()=>a(e),i.appendChild(n)}async function a(e){X.click();let{pending:n,log:a}=Lp(t,e.ops);ah();let s=Q(`.event-log`,r),c=[];for(let e of a)e.text&&c.push(e.text),e.relic&&c.push(`Gained <b style="color:${Bl[e.relic].tone}">${Bl[e.relic].name}</b> — <i>${Bl[e.relic].text}</i>`);c.length&&(s.innerHTML=c.join(`<br>`)),i.innerHTML=``;for(let e of n)await o(e);Mp(t),ah();let l=$(`button`,`btn`,`Continue`);l.onclick=()=>{X.click(),_h(`map`)},i.appendChild(l),!c.length&&!n.length&&!e.ops.length&&_h(`map`)}function o(e){return new Promise(n=>{if(e===`remove`)mh(`Remove a Card`,t.player.deck,{sub:`Let it go.`,pick:e=>{e&&(Dp(t,e.uid),X.card()),n()},canSkip:!1});else if(e===`upgrade`){let e=t.player.deck.filter(e=>!e.up&&Ll[e.id].up);if(!e.length)return n();mh(`Upgrade a Card`,e,{sub:`The forge hungers.`,pick:e=>{e&&(Op(t,e.uid),X.upgrade()),n()}})}else e===`duplicate`?mh(`Duplicate a Card`,t.player.deck,{sub:`The mirror remembers.`,pick:e=>{e&&(kp(t,e.uid),X.upgrade()),n()}}):e.pickCard?mh(`Choose a Card`,Rf(t,e.pickCard).map(e=>({id:e,up:!1,uid:null})),{sub:`One page still glows.`,pick:e=>{e&&(Ep(t,e.id),X.upgrade()),n()},canSkip:!0}):n()})}}function Eg(e){return e.kind===`relic`?{icon:Bl[e.id]?.glyph||`◈`,name:Bl[e.id]?.name||e.id,note:`your rarest relic`}:e.kind===`card`?{icon:`🂠`,name:(Ll[e.id]?.name||e.id)+(e.up?`+`:``),note:`your finest card`}:{icon:`¤`,name:`${e.amount} gold`,note:`a cache of gold`}}function Dg(e){if(e===`aspect2`)return{kind:`Aspect Unlocked`,name:`The Ashwarden`};let[t,n]=e.split(`:`);return t===`card`?{kind:`Card Unlocked`,name:Ll[n]?.name||n}:{kind:`Relic Unlocked`,name:Bl[n]?.name||n}}function Og(e=[]){if(!e.length)return;let t=Q(`#toasts`);t||(t=$(`div`),t.id=`toasts`,document.body.appendChild(t)),e.forEach((e,n)=>{let r=Dg(e);setTimeout(()=>{let e=$(`div`,`unlock-toast`,`<div class="ut-kind">✦ ${r.kind}</div><div class="ut-name">${r.name}</div>`);t.appendChild(e),requestAnimationFrame(()=>e.classList.add(`in`)),X.relic(),setTimeout(()=>{e.classList.remove(`in`),setTimeout(()=>e.remove(),500)},3800)},700+n*800)})}function kg({won:e,newUnlocks:t=[],offers:n=[],fallAct:r=0,fallRow:i=1}){let a=Z.run;Hm();let o=a.stats,s=Math.max(1,Math.round((Date.now()-o.start)/6e4)),c=a.act*15+a.floorsClimbed,l=`<div class="stats-grid">
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
    </div>`;if(e){Jm().innerHTML=`<div class="end-screen screen-enter">
      <div class="end-title win">ASCENDED</div>
      <div class="ov-sub" style="font-size:17px">The Eternal Sovereign is dust. Dawn breaks over the Spire — the first in an age.</div>
      ${l}${u}
    </div>`,cd(),X.victory(),kd(`#ffe9ac`,.25,1);let e=setInterval(()=>Ad(Math.random()*innerWidth,innerHeight*.2,{color:[`#ffd97a`,`#c9b0ff`,`#8fe8a0`][Math.random()*3|0],n:16,speed:300,grav:260,life:1.2}),400);setTimeout(()=>clearInterval(e),4200)}else{let e=n.length?`<div class="bequest" id="bequest">
        <div class="bequest-title">Carve one thing into the stone — the next climb may recover it in <b>${Il[r].name}</b>.</div>
        <div class="bequest-opts">${n.map((e,t)=>{let n=Eg(e);return`<button class="bequest-opt" data-a="bequest" data-i="${t}"><span class="bq-icon">${n.icon}</span><span class="bq-name">${n.name}</span><span class="bq-note">${n.note}</span></button>`}).join(``)}</div>
      </div>`:``,t=Array.from({length:14},()=>`<span class="ember" style="left:${(8+Math.random()*84).toFixed(1)}%;--ex:${((Math.random()-.5)*90).toFixed(0)}px;animation-delay:${(Math.random()*4).toFixed(2)}s;animation-duration:${(3+Math.random()*3).toFixed(2)}s"></span>`).join(``);Jm().innerHTML=`<div class="end-screen grave">
      <div class="monument">
        <div class="mon-flame"></div>
        <div class="end-title lose">FALLEN</div>
        <div class="ov-sub" style="font-size:16px">Here ended a climb, on floor ${c}.<br>The Spire keeps what it takes — but the Vigil remembers.</div>
        ${l}${e}${u}
      </div>
      <div class="embers">${t}</div>
    </div>`}Jm().onclick=e=>{let t=e.target.closest(`[data-a]`);if(!t)return;let o=t.dataset.a;if(o===`bequest`){X.relic();let e=n[+t.dataset.i];Tm(r,i,e);let a=Eg(e);Q(`#bequest`).innerHTML=`<div class="bequest-done">✦ The stone keeps your <b>${a.name}</b>.<br>It will wait for you in ${Il[r].name}.</div>`;return}X.click(),o===`deck`&&mh(`Final Deck`,a.player.deck,{}),o===`title`&&(Z.run=null,Z.lamp=null,_h(`title`))},Og(t)}function Ag(){let e=new URLSearchParams(location.search),t=e.get(`set`)||e.get(`assetSet`)||`live`,n=Hp().includes(t)?t:`live`,r=Hp().map(e=>{let t=new URLSearchParams(location.search);return t.set(`gallery`,`1`),t.set(`set`,e),`<a class="${e===n?`active`:``}" href="?${t.toString()}">${Up(e)}</a>`}).join(``),i={heroes:Ql.map((e,t)=>[e.id,()=>tm(t)]),enemies:Object.entries(Ul).map(([e,t])=>[e,()=>$p(t.art)]),cards:Object.entries(Ll).map(([e,t])=>[e,()=>im(e,t.type)]),potions:Object.entries(Hl).map(([e,t])=>[e,()=>am(t.tone)]),props:[[`campfire`,sm],[`chest`,()=>om(!1)],[`chest-open`,()=>om(!0)],[`merchant`,cm]],events:Object.entries(Gl).map(([e,t])=>[e,()=>lm(t.glyph,t.hue)]),title:[[`banner`,()=>`<div class="title-banner-ph">banner</div>`]]};Jm().className=`gallery-mode`,Jm().innerHTML=`<div class="g-toolbar">
    <div><b>Asset set:</b> ${Up(n)}</div>
    <nav>${r}</nav>
  </div>`+Object.entries(i).map(([e,t])=>`<h2 class="g-head">${e} — ${t.filter(([t])=>Wp(e,t,n)).length}/${t.length} generated</h2>
      <div class="gallery">${t.map(([t,r])=>{let i=Wp(e,t,n);return`<div class="g-cell ${i?`g-png`:`g-svg`}"><div class="g-art">${i?`<img class="raster-art" src="${i}" alt="">`:r()}</div>
          <div class="g-label">${t}<span class="g-badge">${i?`PNG`:`SVG`}</span></div></div>`}).join(``)}</div>`).join(``)}function jg(){if(new URLSearchParams(location.search).has(`gallery`))return Ag();th(),document.addEventListener(`pointerdown`,()=>Fm(),{once:!0}),document.addEventListener(`contextmenu`,e=>{Z.targeting&&(e.preventDefault(),Zh())}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&(Z.targeting?Zh():Q(`#overlay`).classList.contains(`open`)&&Q(`#overlay`)._closable&&ph()),(e.key===`e`||e.key===`E`)&&Z.screen===`combat`&&!Z.busy&&eg(),(e.key===`a`||e.key===`A`)&&Z.screen===`combat`&&!Z.busy&&Z.ce?.lantern?.click()}),Q(`#overlay`).addEventListener(`pointerdown`,e=>{e.target===Q(`#overlay`)&&Q(`#overlay`)._closable&&ph()}),window.spirebound={S:Z,E:pf,startCombatUI:Oh,show:_h,meshEnabled:Hd,meshDebug:ff},requestAnimationFrame(lg),_h(`title`)}ad(),wd(),lf(),jg();