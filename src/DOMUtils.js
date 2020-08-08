/* global fbq */

export function updateTag(tagName, keyName, keyValue, attrName, attrValue) {
  const node = document.head.querySelector(
    `${tagName}[${keyName}="${keyValue}"]`,
  );
  if (node && node.getAttribute(attrName) === attrValue) return;

  // Remove and create a new tag in order to make it work with bookmarks in Safari
  if (node) {
    node.parentNode.removeChild(node);
  }
  if (typeof attrValue === 'string') {
    const nextNode = document.createElement(tagName);
    nextNode.setAttribute(keyName, keyValue);
    nextNode.setAttribute(attrName, attrValue);
    document.head.appendChild(nextNode);
  }
}

export function updateMeta(name, content) {
  updateTag('meta', 'name', name, 'content', content);
}

export function updateCustomMeta(property, content) {
  updateTag('meta', 'property', property, 'content', content);
}

export function updateLink(rel, href) {
  updateTag('link', 'rel', rel, 'href', href);
}

const fbPixelScriptBody = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2107538052850424');
fbq('track', 'PageView');
`;

const fbPageViewBody = `
fbq('track', 'PageView');
`;

const fbScriptBody = `
fbq('track', 'Lead');
`;

const googleSiteTagBody = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'AW-802186908');
`;

const gTagBody = `
gtag('event', 'conversion', {'send_to': 'AW-802186908/mPPzCJmr8ogBEJzNwf4C'});
`;

export function createScriptElement(scriptSrc, scriptBody, isAsync) {
  const script = document.createElement('script');
  if (scriptSrc) {
    script.src = scriptSrc;
  }

  if (scriptBody) {
    script.innerHTML = scriptBody;
  }

  if (isAsync) {
    script.async = true;
  }

  return script;
}

function insertFbPixel() {
  const fbPixelScript = createScriptElement(null, fbPixelScriptBody);
  document.head.appendChild(fbPixelScript);

  const fbPixel = document.createElement('noscript');
  const fbPixelImg = document.createElement('img');
  fbPixelImg.height = '1';
  fbPixelImg.width = '1';
  fbPixelImg.style = 'display:none';
  fbPixelImg.src =
    'https://www.facebook.com/tr?id=2107538052850424&ev=PageView&noscript=1';
  fbPixel.appendChild(fbPixelImg);
  document.head.appendChild(fbPixel);
}

export function insertTrackingScripts() {
  insertFbPixel();

  const fbPageViewScript = createScriptElement(null, fbPageViewBody);
  document.head.appendChild(fbPageViewScript);

  const gTagScript = createScriptElement(
    'https://www.googletagmanager.com/gtag/js?id=AW-802186908',
    null,
    true,
  );
  document.head.appendChild(gTagScript);

  const gSiteTagScript = createScriptElement(null, googleSiteTagBody);
  document.head.appendChild(gSiteTagScript);

  const gTagExecutionScript = createScriptElement(null, gTagBody);
  document.head.appendChild(gTagExecutionScript);
}

export function insertLeadTrackingScript() {
  if (typeof fbq === 'undefined') {
    insertFbPixel();
  }

  const fbExecutionScript = createScriptElement(null, fbScriptBody);
  document.head.appendChild(fbExecutionScript);
}

export function insertFrontAppScript() {
  const frontAppScript = createScriptElement(
    'https://dl.frontapp.com/libs/frontjs.min.js',
  );
  document.head.appendChild(frontAppScript);
}
