(function(r){var w=new WeakMap();var t=window.msSetImmediate;if(!t){var j=[];var o=String(Math.random());window.addEventListener("message",function(z){if(z.data===o){var y=j;j=[];y.forEach(function(A){A()})}});t=function(y){j.push(y);window.postMessage(o,"*")}}var g=false;var i=[];function d(y){i.push(y);if(!g){g=true;t(k)}}function x(y){return window.ShadowDOMPolyfill&&window.ShadowDOMPolyfill.wrapIfNeeded(y)||y}function k(){g=false;var z=i;i=[];z.sort(function(B,A){return B.uid_-A.uid_});var y=false;z.forEach(function(B){var A=B.takeRecords();q(B);if(A.length){B.callback_(A,B);y=true}});if(y){k()}}function q(y){y.nodes_.forEach(function(z){var A=w.get(z);if(!A){return}A.forEach(function(B){if(B.observer===y){B.removeTransientObservers()}})})}function f(E,F){for(var C=E;C;C=C.parentNode){var D=w.get(C);if(D){for(var B=0;B<D.length;B++){var A=D[B];var z=A.options;if(C!==E&&!z.subtree){continue}var y=F(z);if(y){A.enqueue(y)}}}}}var s=0;function n(y){this.callback_=y;this.nodes_=[];this.records_=[];this.uid_=++s}n.prototype={observe:function(C,z){C=x(C);if(!z.childList&&!z.attributes&&!z.characterData||z.attributeOldValue&&!z.attributes||z.attributeFilter&&z.attributeFilter.length&&!z.attributes||z.characterDataOldValue&&!z.characterData){throw new SyntaxError()}var B=w.get(C);if(!B){w.set(C,B=[])}var y;for(var A=0;A<B.length;A++){if(B[A].observer===this){y=B[A];y.removeListeners();y.options=z;break}}if(!y){y=new u(this,C,z);B.push(y);this.nodes_.push(C)}y.addListeners()},disconnect:function(){this.nodes_.forEach(function(A){var B=w.get(A);for(var z=0;z<B.length;z++){var y=B[z];if(y.observer===this){y.removeListeners();B.splice(z,1);break}}},this);this.records_=[]},takeRecords:function(){var y=this.records_;this.records_=[];return y}};function h(y,z){this.type=y;this.target=z;this.addedNodes=[];this.removedNodes=[];this.previousSibling=null;this.nextSibling=null;this.attributeName=null;this.attributeNamespace=null;this.oldValue=null}function p(z){var y=new h(z.type,z.target);y.addedNodes=z.addedNodes.slice();y.removedNodes=z.removedNodes.slice();y.previousSibling=z.previousSibling;y.nextSibling=z.nextSibling;y.attributeName=z.attributeName;y.attributeNamespace=z.attributeNamespace;y.oldValue=z.oldValue;return y}var c,e;function a(y,z){return c=new h(y,z)}function b(y){if(e){return e}e=p(c);e.oldValue=y;return e}function m(){c=e=undefined}function v(y){return y===e||y===c}function l(z,y){if(z===y){return z}if(e&&v(z)){return e}return null}function u(y,A,z){this.observer=y;this.target=A;this.options=z;this.transientObservedNodes=[]}u.prototype={enqueue:function(y){var z=this.observer.records_;var A=z.length;if(z.length>0){var B=z[A-1];var C=l(B,y);if(C){z[A-1]=C;return}}else{d(this.observer)}z[A]=y},addListeners:function(){this.addListeners_(this.target)},addListeners_:function(z){var y=this.options;if(y.attributes){z.addEventListener("DOMAttrModified",this,true)}if(y.characterData){z.addEventListener("DOMCharacterDataModified",this,true)}if(y.childList){z.addEventListener("DOMNodeInserted",this,true)}if(y.childList||y.subtree){z.addEventListener("DOMNodeRemoved",this,true)}},removeListeners:function(){this.removeListeners_(this.target)},removeListeners_:function(z){var y=this.options;if(y.attributes){z.removeEventListener("DOMAttrModified",this,true)}if(y.characterData){z.removeEventListener("DOMCharacterDataModified",this,true)}if(y.childList){z.removeEventListener("DOMNodeInserted",this,true)}if(y.childList||y.subtree){z.removeEventListener("DOMNodeRemoved",this,true)}},addTransientObserver:function(y){if(y===this.target){return}this.addListeners_(y);this.transientObservedNodes.push(y);var z=w.get(y);if(!z){w.set(y,z=[])}z.push(this)},removeTransientObservers:function(){var y=this.transientObservedNodes;this.transientObservedNodes=[];y.forEach(function(A){this.removeListeners_(A);var B=w.get(A);for(var z=0;z<B.length;z++){if(B[z]===this){B.splice(z,1);break}}},this)},handleEvent:function(G){G.stopImmediatePropagation();switch(G.type){case"DOMAttrModified":var A=G.attrName;var B=G.relatedNode.namespaceURI;var H=G.target;var E=new a("attributes",H);E.attributeName=A;E.attributeNamespace=B;var z=G.attrChange===MutationEvent.ADDITION?null:G.prevValue;f(H,function(J){if(!J.attributes){return}if(J.attributeFilter&&J.attributeFilter.length&&J.attributeFilter.indexOf(A)===-1&&J.attributeFilter.indexOf(B)===-1){return}if(J.attributeOldValue){return b(z)}return E});break;case"DOMCharacterDataModified":var H=G.target;var E=a("characterData",H);var z=G.prevValue;f(H,function(J){if(!J.characterData){return}if(J.characterDataOldValue){return b(z)}return E});break;case"DOMNodeRemoved":this.addTransientObserver(G.target);case"DOMNodeInserted":var H=G.relatedNode;var I=G.target;var F,C;if(G.type==="DOMNodeInserted"){F=[I];C=[]}else{F=[];C=[I]}var y=I.previousSibling;var D=I.nextSibling;var E=a("childList",H);E.addedNodes=F;E.removedNodes=C;E.previousSibling=y;E.nextSibling=D;f(H,function(J){if(!J.childList){return}return E})}m()}};r.JsMutationObserver=n;if(!r.MutationObserver){r.MutationObserver=n}})(this);