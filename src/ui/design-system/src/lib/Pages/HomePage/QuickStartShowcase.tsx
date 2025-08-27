import React, { useState } from 'react';
import { Icon, initializeIcons } from '@fluentui/react';

// Initialize Fluent UI icons
initializeIcons();
import { event } from '@site/src/utils/gtags.client';
import { useColorMode } from '@docusaurus/theme-common';
import clsx from 'clsx';

const ITEMS = [
  'Flow token account balance',
  'Account storage limit and usage',
  'Onchain counter current count',
  'Balance of custom token',
  'NBA Top Shot and NFL All Day',
];

const QuickStartShowcase: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');
  const { colorMode } = useColorMode();

  // Dynamically set colormode in iframe srcs
  const IFRAME_SRCS = [
    'https://run.dnz.dev/snippet/469ae98b6e5d1dea?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/71b994bc006b4283?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/c15155239735ad60?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/676ab2256fe87c8f?output=vertical&outputSize=100',
    'https://run.dnz.dev/snippet/3797f91e245b787b?output=vertical&outputSize=100',
  ].map(url => url + `&colormode=${colorMode}`);

  // Handle tab click
  const handleTabClick = (idx: number, item: string) => {
    setSelected(idx);
    
    // If iframe is loaded, change the source
    if (iframeLoaded) {
      setIframeSrc(IFRAME_SRCS[idx]);
    }

    // Track analytics
    event({
      action: 'action_card_click',
      category: 'action_card',
      label: item,
      location: true,
    });
  };

  // Handle mouse enter to start loading iframe
  const handleMouseEnter = () => {
    if (!iframeLoaded) {
      setIframeLoading(true);
      setIframeSrc(IFRAME_SRCS[selected]);
      setIframeLoaded(true);
    }
  };

  return (
    <section 
      className="container mx-auto pt-1 pb-8 hidden lg:block"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
           Try it live
        </h2>
      </div>
      <div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        onMouseEnter={handleMouseEnter}
      >
        {/* Left: Selector */}
        <div className="flex flex-col w-full items-center justify-center bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700">
          <div className="w-full p-4 flex flex-col gap-3 h-[400px] justify-center" style={{ maxWidth: 320 }}>
            {ITEMS.map((item, idx) => (
              <button
                key={item}
                type="button"
                onClick={() => handleTabClick(idx, item)}
                className={clsx(
                  "w-full text-left px-4 py-3 transition font-medium text-base cursor-pointer hover:bg-white/50 dark:hover:bg-gray-900/50",
                  selected === idx
                    ? "bg-white dark:bg-gray-900 rounded-xl shadow-sm text-primary-green-600 font-bold"
                    : "text-gray-900 dark:text-gray-100 bg-transparent"
                )}
                style={{ outline: 'none', border: 'none' }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {/* Right: Iframe or Screenshot (spans 2 columns) */}
        <div className="lg:col-span-2 flex items-center justify-end w-full">
          {iframeLoaded ? (
            <div className="w-full h-[400px] relative">
              {iframeLoading && (
                <div className="absolute inset-0 bg-gray-900 dark:bg-gray-800 flex items-center justify-center z-10">
                  <div className="text-center text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                    <p className="text-sm">Loading interactive examples...</p>
                  </div>
                </div>
              )}
              <iframe
                key="single-iframe"
                sandbox="allow-scripts allow-same-origin"
                className="flow-runner-iframe w-full h-[400px]"
                src={iframeSrc}
                title="Flow Runner Quickstart"
                onLoad={() => setIframeLoading(false)}
              />
            </div>
          ) : (
            // Show realistic Flow Runner interface until iframe loads
            <div className="w-full h-[400px] bg-white dark:bg-gray-900 flex flex-col group cursor-pointer transition-all duration-200 hover:shadow-xl">
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  {/* Flow icon */}
                  <div className="w-6 h-6 mr-2">
                    <img src="/images/logos/flow-runner-flow-icon.svg" alt="Flow" className="w-full h-full" />
                  </div>
                                      <div className="flex items-center space-x-2">
                      <Icon iconName="OpenFile" className="text-blue-600" />
                      <span className="text-sm text-black font-medium font-mono">Open</span>
                      <Icon iconName="ChevronDown" className="text-blue-600" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon iconName="Play" className="text-blue-600" />
                      <span className="text-sm text-black font-medium font-mono">Run</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon iconName="Share" className="text-blue-600" />
                      <span className="text-sm text-black font-medium font-mono">Share</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon iconName="Download" className="text-blue-600" />
                      <span className="text-sm text-black font-medium font-mono">Download</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon iconName="Settings" className="text-blue-600" />
                      <span className="text-sm text-black font-medium font-mono">Settings</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon iconName="ClearNight" className="text-blue-600" />
                  </div>
              </div>

              {/* Main Content */}
              <div className="flex flex-1">
                {/* Code Editor */}
                <div className="flex-1 bg-white relative">
                  {/* Example Label */}
                  <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    Flow token account balance
                  </div>
                  <div className="flex">
                    {/* Line Numbers */}
                    <div className="w-12 bg-gray-50 text-right pr-3 pt-3 text-xs text-gray-500 font-mono">
                      {Array.from({length: 13}, (_, i) => (
                        <div key={i} className="h-6 leading-6">{i + 1}</div>
                      ))}
                    </div>
                    {/* Code */}
                    <div className="flex-1 pt-3 pl-3 font-mono text-sm relative overflow-hidden">
                      {/* Scrollbar */}
                      <div className="absolute right-2 top-3 bottom-3 w-2 bg-gray-200 rounded-full"></div>
                      <div className="space-y-0">
                        <div className="h-6 leading-6 whitespace-nowrap"><span className="text-blue-600">import</span> <span className="text-cyan-600">FungibleToken</span> <span className="text-blue-600">from</span> <span className="text-orange-600">0xf233dcee88fe0abe</span></div>
                        <div className="h-6 leading-6"></div>
                        <div className="h-6 leading-6 text-green-600 whitespace-nowrap">// Returns the balance of the stored Vault at</div>
                        <div className="h-6 leading-6 text-green-600 whitespace-nowrap">// the given address if exists, otherwise nil</div>
                        <div className="h-6 leading-6"></div>
                        <div className="h-6 leading-6 text-green-600 whitespace-nowrap">// Run this with this address: <span className="text-orange-600">0xfeb88a0fcc175a3d</span></div>
                        <div className="h-6 leading-6"></div>
                        <div className="h-6 leading-6 whitespace-nowrap"><span className="text-purple-600">access</span>(<span className="text-purple-600">all</span>) <span className="text-purple-600">fun</span> <span className="text-gray-900">main</span>(<span className="text-gray-900">address</span>: <span className="text-cyan-600">Address</span>): <span className="text-cyan-600">UFix64</span>? &#123;</div>
                        <div className="h-6 leading-6 whitespace-nowrap">&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-600">let</span> <span className="text-gray-900">path</span> = <span className="text-cyan-600">StoragePath</span>(<span className="text-gray-900">identifier</span>: <span className="text-green-600">"flowTokenVault"</span>)</div>
                        <div className="h-6 leading-6 whitespace-nowrap">&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-600">return</span> <span className="text-cyan-600">getAuthAccount</span>&lt;<span className="text-purple-600">auth</span>(<span className="text-cyan-600">BorrowValue</span>) &<span className="text-cyan-600">Account</span>&gt;(<span className="text-gray-900">address</span>).<span className="text-gray-900">storage</span>.<span className="text-gray-900">borrow</span>&lt;&#123;<span className="text-cyan-600">FungibleToken</span>.<span className="text-cyan-600">Vault</span>&#125;&gt;(</div>
                        <div className="h-6 leading-6 whitespace-nowrap">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-600">from</span>: <span className="text-gray-900">path</span>!</div>
                        <div className="h-6 leading-6 whitespace-nowrap">&nbsp;&nbsp;&nbsp;&nbsp;)?.<span className="text-gray-900">balance</span> ?? <span className="text-purple-600">nil</span></div>
                        <div className="h-6 leading-6 whitespace-nowrap">&nbsp;&nbsp;&nbsp;&nbsp;&#125;</div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>



              {/* Bottom Bar */}
              <div className="bg-blue-600 dark:bg-blue-700 px-3 py-2 flex items-center justify-between text-white text-sm relative">
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">Hover to load interactive examples</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon iconName="Error" className="text-red-400" />
                  <span>0 Errors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon iconName="Code" className="text-white" />
                  <span>Environment: Flow Mainnet</span>
                  <Icon iconName="Contact" className="text-white" />
                  <Icon iconName="GitGraph" className="text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuickStartShowcase; 