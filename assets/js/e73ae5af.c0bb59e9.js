"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[25062],{19882:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>r,default:()=>p,frontMatter:()=>i,metadata:()=>l,toc:()=>c});n(67294);var a=n(85893),s=n(11151);const i={title:"Selling NFTs",description:"Learn about the selling process",sidebar_label:"Selling NFTs",sidebar_position:5,sidebar_custom_props:{icon:"\ud83d\uded2"}},r=void 0,l={unversionedId:"guides/nft-marketplace/selling-nfts",id:"guides/nft-marketplace/selling-nfts",title:"Selling NFTs",description:"Learn about the selling process",source:"@site/docs/guides/nft-marketplace/selling-nfts.md",sourceDirName:"guides/nft-marketplace",slug:"/guides/nft-marketplace/selling-nfts",permalink:"/docs/next/guides/nft-marketplace/selling-nfts",draft:!1,editUrl:"https://github.com/onflow/docs/tree/main/docs/guides/nft-marketplace/selling-nfts.md",tags:[],version:"current",lastUpdatedBy:"Alex",lastUpdatedAt:1695082523,formattedLastUpdatedAt:"Sep 19, 2023",sidebarPosition:5,frontMatter:{title:"Selling NFTs",description:"Learn about the selling process",sidebar_label:"Selling NFTs",sidebar_position:5,sidebar_custom_props:{icon:"\ud83d\uded2"}},sidebar:"guides",previous:{title:"Minting NFTs",permalink:"/docs/next/guides/nft-marketplace/minting-nfts"},next:{title:"In App Payments",permalink:"/docs/next/guides/nft-marketplace/in-dapp-payments"}},o={},c=[{value:"Listing NFTs for sales",id:"listing-nfts-for-sales",level:2},{value:"Purchasing NFTs",id:"purchasing-nfts",level:2},{value:"Setting up accounts to receive NFTs",id:"setting-up-accounts-to-receive-nfts",level:3},{value:"Payment options",id:"payment-options",level:2},{value:"Fiat payments",id:"fiat-payments",level:3},{value:"Royalty payments",id:"royalty-payments",level:2}];function h(e){const t=Object.assign({p:"p",a:"a",ul:"ul",li:"li",h2:"h2",h3:"h3",em:"em"},(0,s.ah)(),e.components);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(t.p,{children:["Most NFT marketplaces performing on-chain sales use the ",(0,a.jsx)(t.a,{href:"https://github.com/onflow/nft-storefront",children:"NFT Storefront Smart Contract"}),". The contract allows NFT sellers to list their NFT for sale in any fungible token. NFT buyers send the fungible token amount equal to the listed price and receive the listed NFT in return."]}),"\n",(0,a.jsxs)(t.p,{children:["A few important points to note regarding listing NFTs for sale through the ",(0,a.jsx)(t.a,{href:"../../build/core-contracts/nft-storefront",children:"NFT Storefront docs"}),":"]}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsx)(t.li,{children:"Same NFT can have multiple sale listings created. The NFT owner can create multiple listings on the same marketplace or different marketplaces."}),"\n",(0,a.jsx)(t.li,{children:"NFT owners can create different sale listings for the same NFT with different fungible tokens as payment methods. For example, the NFT owner can list the same NFT for sale in both FLOW and USDC tokens."}),"\n",(0,a.jsxs)(t.li,{children:["NFT listed for sale using the ",(0,a.jsx)(t.a,{href:"../../build/core-contracts/nft-storefront",children:"NFT Storefront docs"})," is not locked. It remains in complete control of the NFT owner before the sale, and the NFT owner can transfer it before the sale."]}),"\n",(0,a.jsx)(t.li,{children:"Any sale listing created allows for multiple sale cuts. That can enable royalty payments to multiple entities for sale."}),"\n",(0,a.jsx)(t.li,{children:"For an NFT, the NFT owner can create different listings with different sale cuts. That allows each listing to have unique royalty payment schemes."}),"\n",(0,a.jsx)(t.li,{children:"An NFT marketplace platform can create sale listings for NFTs minted by it and NFTs minted by third-party projects."}),"\n",(0,a.jsxs)(t.li,{children:["NFT Storefront Contract allows for only simple sale schemes of individual NFTs. You will need to write your version of the contract if","\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsx)(t.li,{children:"NFT has to be sold through an auction"}),"\n",(0,a.jsx)(t.li,{children:"Instead of NFTs, packs of NFTs need to be sold on-chain"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(t.h2,{id:"listing-nfts-for-sales",children:"Listing NFTs for sales"}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.a,{href:"../../build/core-contracts/nft-storefront#selling-nfts",children:"Sell Item"})," is an example of a transaction creating an NFT sale listing. The listing creator provides sale cuts (royalties, platform fees). The NFT Storefront docs does not determine the sale cuts by itself. The listing creator (NFT marketplace) should figure out the royalties to be paid and populate the sale cuts fields of the transaction."]}),"\n",(0,a.jsx)(t.p,{children:"The sale listing specifies the fungible token the NFT is sold in. Typical fungible tokens used are FLOW and USDC."}),"\n",(0,a.jsx)(t.h2,{id:"purchasing-nfts",children:"Purchasing NFTs"}),"\n",(0,a.jsxs)(t.p,{children:[(0,a.jsx)(t.a,{href:"../../build/core-contracts/nft-storefront#purchasing-nfts",children:"Buy Item"})," is an example of a transaction purchasing an NFT from an NFT Storefront Contract listing. The buyer needs to use the same fungible token specified in the listing."]}),"\n",(0,a.jsx)(t.h3,{id:"setting-up-accounts-to-receive-nfts",children:"Setting up accounts to receive NFTs"}),"\n",(0,a.jsx)(t.p,{children:"Flow blockchain has a feature that unless an account is setup to receive a particular NFT type, they can not receive NFTs of that type. That is why users need to authorize a transaction through their account to receive a specific NFT type."}),"\n",(0,a.jsxs)(t.p,{children:["An NFT marketplace should enable users to set up their accounts to receive an NFT before purchasing that NFT. ",(0,a.jsx)(t.a,{href:"/docs/next/tools/nft-catalog/overview",children:"Flow NFT Catalog"})," can provide the storage path information to let platforms craft such account set up transactions."]}),"\n",(0,a.jsx)(t.p,{children:"After the NFT purchase operation is complete on the blockchain, the NFT marketplace platform should explicitly clean up the sale listings. Leaving dangling sale listings is not a good practice."}),"\n",(0,a.jsx)(t.h2,{id:"payment-options",children:"Payment options"}),"\n",(0,a.jsx)(t.p,{children:"Currently, for the on-chain sale of NFTs, the most common option is to let sellers list NFTs for sale in fungible tokens like USDC or FLOW."}),"\n",(0,a.jsx)(t.p,{children:"The marketplace will have the NFT owner sign a sell item transaction to create the sale listing. The sell item transaction is a type of fungible token the NFT seller will accept."}),"\n",(0,a.jsx)(t.h3,{id:"fiat-payments",children:"Fiat payments"}),"\n",(0,a.jsx)(t.p,{children:"NFT marketplaces can reduce UX friction for the crypto-uninitiated NFT buyers by accepting payments in fiat (credit/debit cards and bank payments)."}),"\n",(0,a.jsx)(t.p,{children:"But enabling fiat payments invariably requires the NFT marketplace platform to take custody of users' funds and/or NFTs. And in doing so, the platforms will have to handle regulatory and payment-fraud/chargeback/AML issues."}),"\n",(0,a.jsx)(t.p,{children:"Following are typical ways NFT marketplaces can enable fiat payments for P2P sales:"}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsx)(t.li,{children:"Using payment providers like Stripe: NFT marketplaces can enable fiat P2P sales by onboarding the sellers on a payment provider like Stripe, taking custody of the NFTs from the sellers, and accepting payments from the buyers using credit cards. NFT sale is completed through a transfer of NFT. Sellers may have to go through KYC with Stripe to get onboarded. Sellers will get paid in their bank accounts by Stripe. The downside is that seller onboarding can take time, and the platform can be hostage to the capricious rules of the payment providers."}),"\n",(0,a.jsx)(t.li,{children:"Using crypto on-ramps like Moonpay: With this approach, the NFT marketplace facilitates NFT sales on-chain but leverages crypto on-ramps such as Moonpay/Wyre to help NFT buyers obtain crypto to make the purchase. The downside is that the crypto on-ramps charge hefty fees, and NFT sellers still need to find off-ramps for the proceeds of the crypto sale."}),"\n",(0,a.jsx)(t.li,{children:"Using a payment gateway to maintain user fund balances: This is the approach that NBA Topshot/Dapper wallet follows. The marketplace uses a payment gateway like Circle where users use fiat payment methods to maintain fund balances. The marketplace also maintains a app-custody wallet for each user. It makes the on-chain NFT purchase on behalf of users if sufficient fund balance is maintained with the payment gateway. Fund balances with the payment gateway are updated based on sale/purchase activity on the blockchain. The downside of this approach is that it requires the marketplace to maintain a app-custody wallet service. Additionally, the marketplace must incorporate multiple operational checks and balances to comply with the payment/AML regulations and protect against chargeback/fraud risks."}),"\n"]}),"\n",(0,a.jsxs)(t.p,{children:["See this ",(0,a.jsx)(t.a,{href:"./in-dapp-payments",children:"In app payment"})," section to get more information."]}),"\n",(0,a.jsx)(t.h2,{id:"royalty-payments",children:"Royalty payments"}),"\n",(0,a.jsx)(t.p,{children:"A marketplace can gather the royalty information for an NFT listed for sale through the following ways:"}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsx)(t.li,{children:"Offline methods: The project behind the NFT can inform the marketplace of the royalty percentage it expects from the NFT sale."}),"\n",(0,a.jsxs)(t.li,{children:["NFT metadata: NFT projects can specify the \u201cRoyalty\u201d view per the ",(0,a.jsx)(t.a,{href:"../../build/core-contracts/nft-storefront#enabling-creator-royalties-for-nfts",children:"NFT Metadata Standard"})," . Marketplaces can use that information to enforce royalty payments when creating the NFT sale listings. [",(0,a.jsx)(t.em,{children:"Currently, \u201cRoyalty\u201d view specification is unspecified. Proposals from NFT Marketplace projects are welcome."}),"]"]}),"\n"]})]})}const p=function(e){void 0===e&&(e={});const{wrapper:t}=Object.assign({},(0,s.ah)(),e.components);return t?(0,a.jsx)(t,Object.assign({},e,{children:(0,a.jsx)(h,e)})):h(e)}}}]);