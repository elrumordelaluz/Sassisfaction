// Font Smoothie copyright 2013,14,15 Torben Haase <http://pixelsvsbytes.com>
// Source-URL <https://gist.github.com/letorbi/5177771>
//
// Font Smoothie is free software: you can redistribute it and/or modify it under
// the terms of the GNU Lesser General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option) any
// later version.
//
// Font Smoothie is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
// details.  You should have received a copy of the GNU Lesser General Public
// License along with Font Smoothie.  If not, see <http://www.gnu.org/licenses/>.
 
(function() { 'use strict';
 
function apply() {
  // NOTE Circles through all CSS rules of a sheet and fix them if
  //      necassary.
  function traverseSheet(sheet) {
    if (sheet.cssRules === null)
      return console.warn("Fontsmoothie warning: Browser blocks access to CSS rules in "+sheet.href);
    var href = sheet.href||location.href;
    href = new RegExp(href.substring(0, href.lastIndexOf("/"))
      .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "g");
    for (var rule, j = 0; rule = sheet.cssRules[j]; j++) {
      // NOTE Only affect rules that have a src value (AFAIK
      //      this is only true for CSSFontFaceRule objects).
      if (rule.style && rule.style.src) {
        // NOTE Create a new rule where SVG is the preferred
        //      source format and delete the old rule.
        rule.style.src = rule.style.src.replace(href, ".")
          .replace(/([^;]*?),\s*(url\(\S*? format\(["']?svg["']?\))([\s,]*[^;]+|)/, '$2, $1$3');
        // NOTE Opera needs the rule to be deleted and inserted again
        //      (in that order) to apply it to the document.
        if (window.opera) {
          var text = rule.cssText;
          sheet.deleteRule(j);
          sheet.insertRule(text, j);
        }
      }
      rule.styleSheet && traverseSheet(rule.styleSheet);
    }
  }
  
  try {
    // NOTE Safari needs the canvas to be part of the DOM tree to
    //      return correct alpha values.
    var head = document.getElementsByTagName('HEAD')[0];
    var canvas = head.appendChild(document.createElement('CANVAS'));
    var context = canvas.getContext('2d');
    context.textBaseline = 'top';
    context.font = '32px Arial';
    context.fillText('O', 0, 0);
    // NOTE We won't check the alpha values of all canvas pixels,
    //      but only the one at position (5,8). If font-smoothing is
    //      off we loop through all CSS rules and fix them.
    for (var sheet, i = 0; (context.getImageData(5, 8, 1, 1).data[3] == 255) && (sheet = document.styleSheets[i]); i++)
      sheet && traverseSheet(sheet);
    head.removeChild(canvas);
  }
  catch (e) {
    // NOTE Ignore any errors that might occur.
    throw e; // DEBUG
  }
}

// NOTE Run Font Smoothie only if the system is Windows XP
if (navigator.userAgent.toLowerCase().indexOf('windows nt 5.1') > -1) { 
  if (document.readyState == 'complete') {
    apply();
  }
  else {
    var f = window.onload;
    window.onload = window.onload ? function(evt){f(evt);apply();} : apply;
  }
}
 
})();