module.exports = function pylonChatPlugin() {
  return {
    name: 'pylon-chat',
    injectHtmlTags() {
      return {
        headTags: [],
        postBodyTags: [
          // Set Pylon configuration immediately (like the working test file)
          {
            tagName: 'script',
            innerHTML: `
console.log('🔧 Setting Pylon configuration...');
window.pylon = {
  chat_settings: {
    app_id: 'cc6b067b-cddb-4fd4-8043-030f95e703e4',
    email: 'anonymous@flow.docs',
    name: 'Flow Docs User'
  }
};
console.log('✅ Pylon config set:', window.pylon);
            `,
          },
          // Then add Pylon chat widget script
          {
            tagName: 'script',
            innerHTML: `
console.log('📦 Loading Pylon script...');
(function(){var e=window;var t=document;var n=function(){n.e(arguments)};n.q=[];n.e=function(e){n.q.push(e)};e.Pylon=n;var r=function(){var e=t.createElement("script");e.setAttribute("type","text/javascript");e.setAttribute("async","true");e.setAttribute("src","https://widget.usepylon.com/widget/cc6b067b-cddb-4fd4-8043-030f95e703e4");e.onload=function(){console.log('🎉 Pylon widget script fully loaded!');setTimeout(function(){console.log('🔍 Checking for chat elements:', document.querySelectorAll('[data-pylon]').length);if(window.Pylon){console.log('🚀 Chat bubble should now be visible!');}},1000);};e.onerror=function(){console.error('❌ Failed to load Pylon script');};var n=t.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};if(t.readyState==="complete"){r()}else if(e.addEventListener){e.addEventListener("load",r,false)}})();
console.log('✅ Pylon script loader initialized');
            `,
          },
        ],
      };
    },
  };
};
