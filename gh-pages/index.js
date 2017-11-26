!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e():"function"==typeof define&&define.amd?define(e):e()}(0,function(){"use strict";function t(t,e){function n(){this.constructor=t}for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}function e(t,n,i){if(t){for(var o=t[0],r=t[1],s=r&&r.constructor===Object,a=s?2:1,c=0,u=a;u<t.length;u++)t[u]&&t[u].constructor!==Function&&c++;var l,h=o.split("~"),p=h[1],d=h[0].split("."),f=d[0].split("#"),m=f[0]||"div",g=f[1],_=d.slice(1);l=s?r:{},g&&(l._id=g),_.length&&(l._classes=_),p&&(l._ref=p);if(!n.open(m,l,c,i))for(var u=a,y=t.length;u<y;u++){var v=t[u];if(void 0!==v)switch(v.constructor){case Array:e(v,n,i);break;case Function:n.fnc(v,i);break;case String:n.text(v,i);break;default:n.obj(v,i)}}n.close(m,c,i)}}function n(t,n){e(t,new s,n)}function i(t,e){for(var i=0,o=t;i<o.length;i++){var r=o[i];if(r.constructor===String)IncrementalDOM.text(r);else if("toJsonML"in r){var s=r;n(s.toJsonML(),s)}else n(r,e)}}function o(t,e,n){IncrementalDOM.patch(t,function(t){return i(t,n)},e)}function r(t,e){self.Notification?(console.log("Notification supported"),Notification.requestPermission(function(n){"granted"===n?(console.log("Notification permission granted"),navigator.serviceWorker.ready.then(function(n){console.log("Notification SW ready"),n.showNotification(t,e)})):console.warn("Notification permission:",n)})):console.warn("Notification not supported")}var s=function(){function t(){}return t.prototype.open=function(t,e,n,i){var o=[],r=e._id,s=e._classes?e._classes:[],a=e._ref;for(var c in e)if(e.hasOwnProperty(c))switch(c){case"_id":case"_classes":case"_ref":case"_key":case"_skip":break;case"id":r=e[c];break;case"classes":s=s.concat(e[c]);break;case"class":s=s.concat(e[c].split(" "));break;case"data":for(var u in e[c])e[c].hasOwnProperty(u)&&(e[c][u].constructor===String?o.push("data-"+u,e[c][u]):o.push("data-"+u,JSON.stringify(e[c][u])));break;case"styles":o.push("style",e[c]);break;default:"function"==typeof e[c]?o.push("on"+c,e[c]):o.push(c,e[c])}return s.length&&o.unshift("class",s.join(" ")),r&&o.unshift("id",r),IncrementalDOM.elementOpen.apply(IncrementalDOM,[t,e._key||null,null].concat(o)),e._skip&&IncrementalDOM.skip(),i&&a&&(i.refs[a]=IncrementalDOM.currentElement()),!!e._skip},t.prototype.close=function(t,e,n){IncrementalDOM.elementClose(t)},t.prototype.text=function(t,e){IncrementalDOM.text(t)},t.prototype.fnc=function(t,e){t(IncrementalDOM.currentElement())},t.prototype.obj=function(t,n){"toJsonML"in t?e(t.toJsonML(),this,t):this.text(""+t,n)},t}(),a=function(){function t(e){void 0===e&&(e=""),this.type="Widget",this.id=this.type+"-"+t.__count++,this.refs={},e&&(this.type=e)}return t.prototype.mount=function(t){if(void 0===t&&(t=document.body),!this.dom){this.dom=t;o(t,this.render(),this),t.setAttribute("widget",this.type),this.onMount&&this.onMount()}return this},t.prototype.umount=function(){return this.dom&&(this.onUmount&&this.onUmount(),this.dom.hasAttribute("widget")&&this.dom.removeAttribute("widget"),this.dom.parentElement.removeChild(this.dom),this.dom=void 0),this},t.prototype.update=function(){var t=this;return this.dom&&!this._updateSched&&(this._updateSched=setTimeout(function(){t.dom&&o(t.dom,t.render(),t),t._updateSched=null},0)),this},t.prototype.toJsonML=function(){var t=this;if(this.dom){if(!this._updateSched)return["div",{_skip:!0,_id:this.id,_key:this.id,widget:this.type}];clearTimeout(this._updateSched),this._updateSched=null}var e=this.render();return["div",{_id:this.id,_key:this.id,widget:this.type}].concat(e,[function(e){t.dom||(t.dom=e,t.onMount&&t.onMount())}])},t}();a.__count=0;var c=function(){function t(){this._slots=[],this._emit=!0}return t.prototype.onConnect=function(t){this._onConnect=t},t.prototype.onDisconnect=function(t){this._onDisconnect=t},t.prototype.connNo=function(){return this._slots.length},t.prototype.connect=function(t,e){"function"==typeof t&&(e?this._slots.push({callback:t,object:e}):this._slots.push({callback:t}),this._onConnect&&this._onConnect(this._slots.length))},t.prototype.disconnect=function(t,e){"function"==typeof t&&(this._slots=this._slots.filter(function(n){return void 0===e?n.callback!==t:n.callback!==t&&n.object!==e}),this._onDisconnect&&this._onDisconnect(this._slots.length))},t.prototype.disconnectAll=function(){this._slots=[],this._onDisconnect&&this._onDisconnect(this._slots.length)},t.prototype.freeze=function(){this._emit=!1},t.prototype.unfreeze=function(){this._emit=!0},t.prototype.emit=function(t){return this._emit&&this._slots.length?this._slots.map(function(e){var n=e.object;return n?e.callback.call(n,t):e.callback(t)}):[]},t}(),u=function(e){function n(t){var n=e.call(this,"HelloWidget")||this;return n._onTextInput=function(t){var e=t.target;n._name=e.value,n.update()},n._name=t,n}return t(n,e),n.prototype.setName=function(t){return this._name=t,this.update(),this},n.prototype.onMount=function(){console.log("onMount",this.type,this.id)},n.prototype.onUmount=function(){console.log("onUmount",this.type,this.id)},n.prototype.render=function(){return[["h2.ui.header",this.type],["div.ui.input.left.icon",["input~i",{type:"text",value:this._name,input:this._onTextInput}],["i.icon.users"]],["div.ui.divider"],["p","Hello ",["strong",this._name]," !"]]},n}(a),l=function(e){function n(){return e.call(this,"TimerWidget")||this}return t(n,e),n.prototype.toggle=function(t){var e=this;switch(t){case!0:this._interval||(this._interval=setInterval(function(){return e.update()},1e3));break;case!1:this._interval&&(clearInterval(this._interval),this._interval=void 0);break;default:this.toggle(!this._interval)}this.update()},n.prototype.onMount=function(){console.log("onMount",this.type,this.id),this.toggle(!0)},n.prototype.onUmount=function(){console.log("onUmount",this.type,this.id),this.toggle(!1)},n.prototype.render=function(){var t=this;return[["h2.ui.header",this.type],["p",{style:this._interval?"":"color: lightgray;"},"Time: ",(new Date).toLocaleTimeString()],["button.ui.button.icon.labeled.tiny",{click:function(e){return t.toggle()}},["i.icon",{classes:this._interval?"pause":"play"}],this._interval?"Stop":"Start"]]},n}(a),h=function(e){function n(){var t=e.call(this,"FormWidget")||this;return t._title="Form",t._data={name:void 0,age:void 0},t._errors={name:"",age:""},t.sigData=new c,t._onFormSubmit=function(e){e.preventDefault(),console.log("submit",t._data),t._validateName(t.refs.name.value),t._validateAge(t.refs.age.value),t._errors.name||t._errors.age?t.update():(t.sigData.emit(t._data),t.refs.data.innerText=JSON.stringify(t._data,null,4))},t._onNameInput=function(e){var n=e.target;console.log("name",n.value),t._validateName(n.value),t.update()},t._onAgeInput=function(e){var n=e.target;console.log("age",n.value),t._validateAge(n.value),t.update()},t}return t(n,e),n.prototype.getTitle=function(){return this._title},n.prototype.setTitle=function(t){return this._title=t,this.update(),this},n.prototype.getData=function(){return this._data},n.prototype.setData=function(t){return this._data=t,this.update(),this},n.prototype.onMount=function(){console.log("onMount",this.type,this.id)},n.prototype.onUmount=function(){console.log("onUmount",this.type,this.id)},n.prototype.render=function(){return[["h2.ui.header",this.type,["div.sub.header",this._title]],["form.ui.form.error",{submit:this._onFormSubmit},["div.field.inline",{class:this._errors.name?"error":""},["label","Name ",["input~name",{type:"text",size:10,maxlength:10,placeholder:"Name",input:this._onNameInput}]],["div.error",this._errors.name]],["div.field.inline",{class:this._errors.age?"error":""},["label","Age ",["input~age",{type:"number",min:"1",max:"120",input:this._onAgeInput}]],["div.error",this._errors.age]],["div.field",["button.ui.button~submit",{type:"submit"},"Submit"]]],["pre~data"]]},n.prototype._validateName=function(t){t?(this._data.name=t,this._errors.name=""):(this._data.name=void 0,this._errors.name="Name required")},n.prototype._validateAge=function(t){t?isNaN(Number(t))?(this._data.age=void 0,this._errors.age="Invalid age number"):(this._data.age=Number(t),this._errors.age=""):(this._data.age=void 0,this._errors.age="Age required")},n}(a),p=function(e){function n(){var t=e.call(this,"AppWidget")||this;return t._title="App",t.helloWidget=new u("peter"),t.timerWidget=new l,t.formWidget=new h,t.formWidget.sigData.connect(function(t){return console.log("sig data",t)}),t}return t(n,e),n.prototype.setTitle=function(t){return this._title=t,this.update(),this},n.prototype.onMount=function(){console.log("onMount",this.type,this.id)},n.prototype.onUmount=function(){console.log("onUmount",this.type,this.id)},n.prototype.render=function(){return[["h2.ui.header",this.type,["div.sub.header",this._title]],["div.ui.segment",this.helloWidget],["div.ui.segment",this.timerWidget],["div.ui.segment",this.formWidget]]},n}(a);!function(){"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").then(function(t){t.installing?console.log("Service worker installing"):t.waiting?console.log("Service worker installed"):t.active&&console.log("Service worker active"),console.log("Registration succeeded. Scope is "+t.scope)}).catch(function(t){console.error("Registration failed with "+t)})}();var d=new p;d.setTitle("MyApp"),d.helloWidget.setName("Peter"),d.formWidget.setTitle("MyForm"),d.mount(document.getElementById("app")),setTimeout(function(){r("Notif title",{body:"Notif body",icon:"assets/icons/ic-face.png",tag:"notif-tag"})},3e3),self.app=d,self.VERSION="0.0.0"});
//# sourceMappingURL=index.js.map
