"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[47041],{46525:(e,t,r)=>{r.d(t,{Z:()=>v});var i=r(67294),n=r(86010),o=r(52802),c=r(39960),s=r(13919),a=r(95999);const l={cardContainer:"cardContainer_S8oU",cardTitle:"cardTitle_HoSo",cardDescription:"cardDescription_c27F",preWrap:"preWrap_myZA"};function d(e){let{href:t,children:r}=e;return i.createElement(c.Z,{href:t,className:(0,n.Z)("card padding--lg",l.cardContainer)},r)}function m(e){let{href:t,icon:r,title:o,description:c}=e;return i.createElement(d,{href:t},i.createElement("h2",{className:(0,n.Z)("text--truncate",l.cardTitle),title:o},r," ",o),c&&i.createElement("p",{className:(0,n.Z)(l.preWrap,l.cardDescription),title:c},c))}function u(e){let{item:t}=e;const r=(0,o.Wl)(t);return r?i.createElement(m,{href:r,icon:t.customProps?.icon||"\ud83d\uddc3\ufe0f",title:t.label,description:t.description??t.customProps?.description??(0,a.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function p(e){let{item:t}=e;const r=Boolean(t?.customProps?.icon)&&t?.customProps?.icon||((0,s.Z)(t.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17"),n=(0,o.xz)(t.docId??void 0);return i.createElement(m,{href:t.href,icon:r,title:t.label,description:t.description??n?.description})}function f(e){let{item:t}=e;switch(t.type){case"link":return i.createElement(p,{item:t});case"category":return i.createElement(u,{item:t});default:throw new Error(`unknown item type ${JSON.stringify(t)}`)}}function h(e){let{className:t}=e;const r=(0,o.jA)();return i.createElement(v,{items:r.items,className:t})}function v(e){const{items:t,className:r}=e;if(!t)return i.createElement(h,e);const c=(0,o.MN)(t);return i.createElement("section",{className:(0,n.Z)("row",r)},c.map(((e,t)=>i.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},i.createElement(f,{item:e})))))}},19883:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>d,default:()=>h,frontMatter:()=>l,metadata:()=>m,toc:()=>p});r(67294);var i=r(85893),n=r(11151),o=r(46525),c=r(1116),s=r(48596),a=r(16550);const l={sidebar_position:1},d=void 0,m={unversionedId:"overview/index",id:"version-stable/overview/index",title:"index",description:"!isSamePath(item.href, useLocation().pathname))}/>",source:"@site/versioned_docs/version-stable/overview/index.mdx",sourceDirName:"overview",slug:"/overview/",permalink:"/docs/overview/",draft:!1,editUrl:"https://github.com/onflow/docs/tree/main/docs/overview/index.mdx",tags:[],version:"stable",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"overview",next:{title:"About Flow",permalink:"/docs/overview/about/flow"}},u={},p=[];function f(e){return(0,i.jsx)(o.Z,{items:(0,c.V)().items.filter((e=>!(0,s.Mg)(e.href,(0,a.TH)().pathname)))})}const h=function(e){void 0===e&&(e={});const{wrapper:t}=Object.assign({},(0,n.ah)(),e.components);return t?(0,i.jsx)(t,Object.assign({},e,{children:(0,i.jsx)(f,e)})):f()}}}]);