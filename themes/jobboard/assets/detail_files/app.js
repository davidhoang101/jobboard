(function() {
    "use strict";

    var doP = { version : '0.2.0' };

    var global = (function () { return this || (0 || eval)('this'); }());

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = doP;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return doP; });
    } else {
        global.doP = doP;
    }

    doP.templateSettings = {
        evaluate:    	  /\{([\s\S]+?)\}/g,
        interpolate: 	  /\{=([\s\S]+?)\}/g,
        encode:      	  /\{!([\s\S]+?)\}/g,
        use:         	  /\{\#([\s\S]+?)\}/g,
        define:      	  /\{\##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
        conditional:	  /\{\?(\?)?\s*([\s\S]*?)\}/g,
        varname: 'it',
        strip : true,
        append: true,
        selfcontained: false
    };

    function resolveDefs(c, block, def) {
        return ((typeof block === 'string') ? block : block.toString())
        .replace(c.define, function (m, code, assign, value) {
            if (code.indexOf('def.') === 0) {
                code = code.substring(4);
            }
            if (!(code in def)) {
                if (assign === ':') {
                    def[code]= value;
                } else {
                    eval("def['"+code+"']=" + value);
                }
            }
            return '';
        })
        .replace(c.use, function(m, code) {
            var v = eval(code);
            return v ? resolveDefs(c, v, def) : v;
        });
    }

    function unescape(code) {
        return  code.replace(/\\'/g, "'").replace(/\\\\/g,"\\").replace(/[\r\t\n]/g, ' ');
    }

    function encodeHTMLSource() {
        var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
            matchHTML = /&(?!\\w+;)|<|>|\"|'|\//g;
        return function(code) {
            return code ? code.toString().replace(matchHTML, function(m) { return encodeHTMLRules[m] || m; }) : code;
        };
    }
    global.encodeHTML = encodeHTMLSource();

    var startend = { // optimal choice depends on platform/size of templates
        append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
        split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML("}
    };

    doP.template = function(tmpl, c, def) {
        c = c || doP.templateSettings;
        var cse = c.append ? startend.append : startend.split, str, needhtmlencode;

        if (c.use || c.define) {
            var olddef = global.def; global.def = def || {}; // workaround minifiers
            str = resolveDefs(c, tmpl, global.def);
            global.def = olddef;
        } else str = tmpl;

        str = ("var out='" + ((c.strip) ? str.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]|(\/\*[\s\S]*?\*\/)/g, ''): str)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(c.interpolate, function(m, code) {
                return cse.start + unescape(code) + cse.end;
            })
            .replace(c.encode, function(m, code) {
                needhtmlencode = true;
                return cse.startencode + unescape(code) + cse.end;
            })
            .replace(c.conditional, function(m, elsecase, code) {
                return elsecase ?
                    (code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
                    (code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
            })
            .replace(c.evaluate, function(m, code) {
                return "';" + unescape(code) + "out+='";
            })
            + "';return out;")
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t')
            .replace(/\r/g, '\\r')
            .split("out+='';").join('')
            .split("var out='';out+=").join('var out=');

        if (needhtmlencode && c.selfcontained) {
            str = "var encodeHTML=("+ encodeHTMLSource.toString()+"());"+str;
        }
        try {
            return new Function(c.varname, str);
        } catch (e) {
            if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
            throw e;
        }
    };

    doP.compile = function(tmpl, def) {
        return doP.template(tmpl, null, def);
    };
}());
/*
selectivizr v1.0.3b - (c) Keith Clark, freely distributable under the terms
of the MIT license.

selectivizr.com
*/
/*

Notes about this source
-----------------------

 * The #DEBUG_START and #DEBUG_END comments are used to mark blocks of code
   that will be removed prior to building a final release version (using a
   pre-compression script)


References:
-----------

 * CSS Syntax          : http://www.w3.org/TR/2003/WD-css3-syntax-20030813/#style
 * Selectors           : http://www.w3.org/TR/css3-selectors/#selectors
 * IE Compatability    : http://msdn.microsoft.com/en-us/library/cc351024(VS.85).aspx
 * W3C Selector Tests  : http://www.w3.org/Style/CSS/Test/CSS3/Selectors/current/html/tests/

*/


(function(win) {

    // If browser isn't IE, then stop execution! This handles the script
    // being loaded by non IE browsers because the developer didn't use
    // conditional comments.
    if (/*@cc_on!@*/true) return;

    // =========================== Init Objects ============================

    var doc = document;
    var root = doc.documentElement;
    var xhr = getXHRObject();
    var ieVersion = /MSIE (\d+)/.exec(navigator.userAgent)[1];

    // If were not in standards mode, IE is too old / new or we can't create
    // an XMLHttpRequest object then we should get out now.
    if (doc.compatMode != 'CSS1Compat' || ieVersion<6 || ieVersion>8 || !xhr) {
        return;
    }


    // ========================= Common Objects ============================

    // Compatiable selector engines in order of CSS3 support. Note: '*' is
    // a placholder for the object key name. (basically, crude compression)
    var selectorEngines = {
        "NW"								: "*.Dom.select",
        "MooTools"							: "$$",
        "DOMAssistant"						: "*.$",
        "Prototype"							: "$$",
        "YAHOO"								: "*.util.Selector.query",
        "Sizzle"							: "*",
        "jQuery"							: "*",
        "dojo"								: "*.query"
    };

    var selectorMethod;
    var enabledWatchers 					= [];     // array of :enabled/:disabled elements to poll
    var domPatches							= [];
    var ie6PatchID 							= 0;      // used to solve ie6's multiple class bug
    var patchIE6MultipleClasses				= true;   // if true adds class bloat to ie6
    var namespace 							= "slvzr";

    // Stylesheet parsing regexp's
    var RE_COMMENT							= /(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)\s*?/g;
    var RE_IMPORT							= /@import\s*(?:(?:(?:url\(\s*(['"]?)(.*)\1)\s*\))|(?:(['"])(.*)\3))\s*([^;]*);/g;
    var RE_ASSET_URL 						= /(behavior\s*?:\s*)?\burl\(\s*(["']?)(?!data:)([^"')]+)\2\s*\)/g;
    var RE_PSEUDO_STRUCTURAL				= /^:(empty|(first|last|only|nth(-last)?)-(child|of-type))$/;
    var RE_PSEUDO_ELEMENTS					= /:(:first-(?:line|letter))/g;
    var RE_SELECTOR_GROUP					= /((?:^|(?:\s*})+)(?:\s*@media[^{]+{)?)\s*([^\{]*?[\[:][^{]+)/g;
    var RE_SELECTOR_PARSE					= /([ +~>])|(:[a-z-]+(?:\(.*?\)+)?)|(\[.*?\])/g;
    var RE_LIBRARY_INCOMPATIBLE_PSEUDOS		= /(:not\()?:(hover|enabled|disabled|focus|checked|target|active|visited|first-line|first-letter)\)?/g;
    var RE_PATCH_CLASS_NAME_REPLACE			= /[^\w-]/g;

    // HTML UI element regexp's
    var RE_INPUT_ELEMENTS					= /^(INPUT|SELECT|TEXTAREA|BUTTON)$/;
    var RE_INPUT_CHECKABLE_TYPES			= /^(checkbox|radio)$/;

    // Broken attribute selector implementations (IE7/8 native [^=""], [$=""] and [*=""])
    var BROKEN_ATTR_IMPLEMENTATIONS			= ieVersion>6 ? /[\$\^*]=(['"])\1/ : null;

    // Whitespace normalization regexp's
    var RE_TIDY_TRAILING_WHITESPACE			= /([(\[+~])\s+/g;
    var RE_TIDY_LEADING_WHITESPACE			= /\s+([)\]+~])/g;
    var RE_TIDY_CONSECUTIVE_WHITESPACE		= /\s+/g;
    var RE_TIDY_TRIM_WHITESPACE				= /^\s*((?:[\S\s]*\S)?)\s*$/;

    // String constants
    var EMPTY_STRING						= "";
    var SPACE_STRING						= " ";
    var PLACEHOLDER_STRING					= "$1";

    // =========================== Patching ================================

    // --[ patchStyleSheet() ]----------------------------------------------
    // Scans the passed cssText for selectors that require emulation and
    // creates one or more patches for each matched selector.
    function patchStyleSheet( cssText ) {
        return cssText.replace(RE_PSEUDO_ELEMENTS, PLACEHOLDER_STRING).
            replace(RE_SELECTOR_GROUP, function(m, prefix, selectorText) {
                var selectorGroups = selectorText.split(",");
                for (var c = 0, cs = selectorGroups.length; c < cs; c++) {
                    var selector = normalizeSelectorWhitespace(selectorGroups[c]) + SPACE_STRING;
                    var patches = [];
                    selectorGroups[c] = selector.replace(RE_SELECTOR_PARSE,
                        function(match, combinator, pseudo, attribute, index) {
                            if (combinator) {
                                if (patches.length>0) {
                                    domPatches.push( { selector: selector.substring(0, index), patches: patches } )
                                    patches = [];
                                }
                                return combinator;
                            }
                            else {
                                var patch = (pseudo) ? patchPseudoClass( pseudo ) : patchAttribute( attribute );
                                if (patch) {
                                    patches.push(patch);
                                    return "." + patch.className;
                                }
                                return match;
                            }
                        }
                    );
                }
                return prefix + selectorGroups.join(",");
            });
    };

    // --[ patchAttribute() ]-----------------------------------------------
    // returns a patch for an attribute selector.
    function patchAttribute( attr ) {
        return (!BROKEN_ATTR_IMPLEMENTATIONS || BROKEN_ATTR_IMPLEMENTATIONS.test(attr)) ?
            { className: createClassName(attr), applyClass: true } : null;
    };

    // --[ patchPseudoClass() ]---------------------------------------------
    // returns a patch for a pseudo-class
    function patchPseudoClass( pseudo ) {

        var applyClass = true;
        var className = createClassName(pseudo.slice(1));
        var isNegated = pseudo.substring(0, 5) == ":not(";
        var activateEventName;
        var deactivateEventName;

        // if negated, remove :not()
        if (isNegated) {
            pseudo = pseudo.slice(5, -1);
        }

        // bracket contents are irrelevant - remove them
        var bracketIndex = pseudo.indexOf("(")
        if (bracketIndex > -1) {
            pseudo = pseudo.substring(0, bracketIndex);
        }

        // check we're still dealing with a pseudo-class
        if (pseudo.charAt(0) == ":") {
            switch (pseudo.slice(1)) {

                case "root":
                    applyClass = function(e) {
                        return isNegated ? e != root : e == root;
                    }
                    break;

                case "target":
                    // :target is only supported in IE8
                    if (ieVersion == 8) {
                        applyClass = function(e) {
                            var handler = function() {
                                var hash = location.hash;
                                var hashID = hash.slice(1);
                                return isNegated ? (hash == EMPTY_STRING || e.id != hashID) : (hash != EMPTY_STRING && e.id == hashID);
                            };
                            addEvent( win, "hashchange", function() {
                                toggleElementClass(e, className, handler());
                            })
                            return handler();
                        }
                        break;
                    }
                    return false;

                case "checked":
                    applyClass = function(e) {
                        if (RE_INPUT_CHECKABLE_TYPES.test(e.type)) {
                            addEvent( e, "propertychange", function() {
                                if (event.propertyName == "checked") {
                                    toggleElementClass( e, className, e.checked !== isNegated );
                                }
                            })
                        }
                        return e.checked !== isNegated;
                    }
                    break;

                case "disabled":
                    isNegated = !isNegated;

                case "enabled":
                    applyClass = function(e) {
                        if (RE_INPUT_ELEMENTS.test(e.tagName)) {
                            addEvent( e, "propertychange", function() {
                                if (event.propertyName == "$disabled") {
                                    toggleElementClass( e, className, e.$disabled === isNegated );
                                }
                            });
                            enabledWatchers.push(e);
                            e.$disabled = e.disabled;
                            return e.disabled === isNegated;
                        }
                        return pseudo == ":enabled" ? isNegated : !isNegated;
                    }
                    break;

                case "focus":
                    activateEventName = "focus";
                    deactivateEventName = "blur";

                case "hover":
                    if (!activateEventName) {
                        activateEventName = "mouseenter";
                        deactivateEventName = "mouseleave";
                    }
                    applyClass = function(e) {
                        addEvent( e, isNegated ? deactivateEventName : activateEventName, function() {
                            toggleElementClass( e, className, true );
                        })
                        addEvent( e, isNegated ? activateEventName : deactivateEventName, function() {
                            toggleElementClass( e, className, false );
                        })
                        return isNegated;
                    }
                    break;

                // everything else
                default:
                    // If we don't support this pseudo-class don't create
                    // a patch for it
                    if (!RE_PSEUDO_STRUCTURAL.test(pseudo)) {
                        return false;
                    }
                    break;
            }
        }
        return { className: className, applyClass: applyClass };
    };

    // --[ applyPatches() ]-------------------------------------------------
    function applyPatches() {
        var elms, selectorText, patches, domSelectorText;

        for (var c=0; c<domPatches.length; c++) {
            selectorText = domPatches[c].selector;
            patches = domPatches[c].patches;

            // Although some selector libraries can find :checked :enabled etc.
            // we need to find all elements that could have that state because
            // it can be changed by the user.
            domSelectorText = selectorText.replace(RE_LIBRARY_INCOMPATIBLE_PSEUDOS, EMPTY_STRING);

            // If the dom selector equates to an empty string or ends with
            // whitespace then we need to append a universal selector (*) to it.
            if (domSelectorText == EMPTY_STRING || domSelectorText.charAt(domSelectorText.length - 1) == SPACE_STRING) {
                domSelectorText += "*";
            }

            // Ensure we catch errors from the selector library
            try {
                elms = selectorMethod( domSelectorText );
            } catch (ex) {
                // #DEBUG_START
                log( "Selector '" + selectorText + "' threw exception '" + ex + "'" );
                // #DEBUG_END
            }


            if (elms) {
                for (var d = 0, dl = elms.length; d < dl; d++) {
                    var elm = elms[d];
                    var cssClasses = elm.className;
                    for (var f = 0, fl = patches.length; f < fl; f++) {
                        var patch = patches[f];
                        if (!hasPatch(elm, patch)) {
                            if (patch.applyClass && (patch.applyClass === true || patch.applyClass(elm) === true)) {
                                cssClasses = toggleClass(cssClasses, patch.className, true );
                            }
                        }
                    }
                    elm.className = cssClasses;
                }
            }
        }
    };

    // --[ hasPatch() ]-----------------------------------------------------
    // checks for the exsistence of a patch on an element
    function hasPatch( elm, patch ) {
        return new RegExp("(^|\\s)" + patch.className + "(\\s|$)").test(elm.className);
    };


    // =========================== Utility =================================

    function createClassName( className ) {
        return namespace + "-" + ((ieVersion == 6 && patchIE6MultipleClasses) ?
            ie6PatchID++
        :
            className.replace(RE_PATCH_CLASS_NAME_REPLACE, function(a) { return a.charCodeAt(0) }));
    };

    // --[ log() ]----------------------------------------------------------
    // #DEBUG_START
    function log( message ) {
        if (win.console) {
            win.console.log(message);
        }
    };
    // #DEBUG_END

    // --[ trim() ]---------------------------------------------------------
    // removes leading, trailing whitespace from a string
    function trim( text ) {
        return text.replace(RE_TIDY_TRIM_WHITESPACE, PLACEHOLDER_STRING);
    };

    // --[ normalizeWhitespace() ]------------------------------------------
    // removes leading, trailing and consecutive whitespace from a string
    function normalizeWhitespace( text ) {
        return trim(text).replace(RE_TIDY_CONSECUTIVE_WHITESPACE, SPACE_STRING);
    };

    // --[ normalizeSelectorWhitespace() ]----------------------------------
    // tidies whitespace around selector brackets and combinators
    function normalizeSelectorWhitespace( selectorText ) {
        return normalizeWhitespace(selectorText.
            replace(RE_TIDY_TRAILING_WHITESPACE, PLACEHOLDER_STRING).
            replace(RE_TIDY_LEADING_WHITESPACE, PLACEHOLDER_STRING)
        );
    };

    // --[ toggleElementClass() ]-------------------------------------------
    // toggles a single className on an element
    function toggleElementClass( elm, className, on ) {
        var oldClassName = elm.className;
        var newClassName = toggleClass(oldClassName, className, on);
        if (newClassName != oldClassName) {
            elm.className = newClassName;
            elm.parentNode.className += EMPTY_STRING;
        }
    };

    // --[ toggleClass() ]--------------------------------------------------
    // adds / removes a className from a string of classNames. Used to
    // manage multiple class changes without forcing a DOM redraw
    function toggleClass( classList, className, on ) {
        var re = RegExp("(^|\\s)" + className + "(\\s|$)");
        var classExists = re.test(classList);
        if (on) {
            return classExists ? classList : classList + SPACE_STRING + className;
        } else {
            return classExists ? trim(classList.replace(re, PLACEHOLDER_STRING)) : classList;
        }
    };

    // --[ addEvent() ]-----------------------------------------------------
    function addEvent(elm, eventName, eventHandler) {
        elm.attachEvent("on" + eventName, eventHandler);
    };

    // --[ getXHRObject() ]-------------------------------------------------
    function getXHRObject() {
        if (win.XMLHttpRequest) {
            return new XMLHttpRequest;
        }
        try	{
            return new ActiveXObject('Microsoft.XMLHTTP');
        } catch(e) {
            return null;
        }
    };

    // --[ loadStyleSheet() ]-----------------------------------------------
    function loadStyleSheet( url ) {
        xhr.open("GET", url, false);
        xhr.send();
        return (xhr.status==200) ? xhr.responseText : EMPTY_STRING;
    };

    // --[ resolveUrl() ]---------------------------------------------------
    // Converts a URL fragment to a fully qualified URL using the specified
    // context URL. Returns null if same-origin policy is broken
    function resolveUrl( url, contextUrl, ignoreSameOriginPolicy ) {

        function getProtocol( url ) {
            return url.substring(0, url.indexOf("//"));
        };

        function getProtocolAndHost( url ) {
            return url.substring(0, url.indexOf("/", 8));
        };

        if (!contextUrl) {
            contextUrl = baseUrl;
        }

        // protocol-relative path
        if (url.substring(0,2)=="//") {
            url = getProtocol(contextUrl) + url;
        }

        // absolute path
        if (/^https?:\/\//i.test(url)) {
            return !ignoreSameOriginPolicy && getProtocolAndHost(contextUrl) != getProtocolAndHost(url) ? null : url ;
        }

        // root-relative path
        if (url.charAt(0)=="/")	{
            return getProtocolAndHost(contextUrl) + url;
        }

        // relative path
        var contextUrlPath = contextUrl.split(/[?#]/)[0]; // ignore query string in the contextUrl
        if (url.charAt(0) != "?" && contextUrlPath.charAt(contextUrlPath.length - 1) != "/") {
            contextUrlPath = contextUrlPath.substring(0, contextUrlPath.lastIndexOf("/") + 1);
        }

        return contextUrlPath + url;
    };

    // --[ parseStyleSheet() ]----------------------------------------------
    // Downloads the stylesheet specified by the URL, removes it's comments
    // and recursivly replaces @import rules with their contents, ultimately
    // returning the full cssText.
    function parseStyleSheet( url ) {
        if (url) {
            return loadStyleSheet(url).replace(RE_COMMENT, EMPTY_STRING).
            replace(RE_IMPORT, function( match, quoteChar, importUrl, quoteChar2, importUrl2, media ) {
                var cssText = parseStyleSheet(resolveUrl(importUrl || importUrl2, url));
                return (media) ? "@media " + media + " {" + cssText + "}" : cssText;
            }).
            replace(RE_ASSET_URL, function( match, isBehavior, quoteChar, assetUrl ) {
                quoteChar = quoteChar || EMPTY_STRING;
                return isBehavior ? match : " url(" + quoteChar + resolveUrl(assetUrl, url, true) + quoteChar + ") ";
            });
        }
        return EMPTY_STRING;
    };

    // --[ getStyleSheets() ]-----------------------------------------------
    function getStyleSheets() {
        var url, stylesheet;
        for (var c = 0; c < doc.styleSheets.length; c++) {
            stylesheet = doc.styleSheets[c];
            if (stylesheet.href != EMPTY_STRING) {
                url = resolveUrl(stylesheet.href);
                if (url) {
                    //stylesheet.cssText = stylesheet["rawCssText"] = patchStyleSheet( parseStyleSheet( url ) );
                }
            }
        }
    };

    // --[ init() ]---------------------------------------------------------
    function init() {
        applyPatches();

        // :enabled & :disabled polling script (since we can't hook
        // onpropertychange event when an element is disabled)
        if (enabledWatchers.length > 0) {
            setInterval( function() {
                for (var c = 0, cl = enabledWatchers.length; c < cl; c++) {
                    var e = enabledWatchers[c];
                    if (e.disabled !== e.$disabled) {
                        if (e.disabled) {
                            e.disabled = false;
                            e.$disabled = true;
                            e.disabled = true;
                        }
                        else {
                            e.$disabled = e.disabled;
                        }
                    }
                }
            }, 250)
        }
    };

    // Determine the baseUrl and download the stylesheets
    var baseTags = doc.getElementsByTagName("BASE");
    var baseUrl = (baseTags.length > 0) ? baseTags[0].href : doc.location.href;
    getStyleSheets();

    // Bind selectivizr to the ContentLoaded event.
    ContentLoaded(win, function() {
        // Determine the "best fit" selector engine
        for (var engine in selectorEngines) {
            var members, member, context = win;
            if (win[engine]) {
                members = selectorEngines[engine].replace("*", engine).split(".");
                while ((member = members.shift()) && (context = context[member])) {}
                if (typeof context == "function") {
                    selectorMethod = context;
                    init();
                    return;
                }
            }
        }
    });



    /*!
     * ContentLoaded.js by Diego Perini, modified for IE<9 only (to save space)
     *
     * Author: Diego Perini (diego.perini at gmail.com)
     * Summary: cross-browser wrapper for DOMContentLoaded
     * Updated: 20101020
     * License: MIT
     * Version: 1.2
     *
     * URL:
     * http://javascript.nwbox.com/ContentLoaded/
     * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
     *
     */

    // @w window reference
    // @f function reference
    function ContentLoaded(win, fn) {

        var done = false, top = true,
        init = function(e) {
            if (e.type == "readystatechange" && doc.readyState != "complete") return;
            (e.type == "load" ? win : doc).detachEvent("on" + e.type, init, false);
            if (!done && (done = true)) fn.call(win, e.type || e);
        },
        poll = function() {
            try { root.doScroll("left"); } catch(e) { setTimeout(poll, 50); return; }
            init('poll');
        };

        if (doc.readyState == "complete") fn.call(win, EMPTY_STRING);
        else {
            if (doc.createEventObject && root.doScroll) {
                try { top = !win.frameElement; } catch(e) { }
                if (top) poll();
            }
            addEvent(doc,"readystatechange", init);
            addEvent(win,"load", init);
        }
    };
})(this);
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
    def: 'easeOutQuad',
    swing: function (x, t, b, c, d) {
        //alert(jQuery.easing.default);
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    easeInOutQuad: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInCubic: function (x, t, b, c, d) {
        return c*(t/=d)*t*t + b;
    },
    easeOutCubic: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    },
    easeInOutCubic: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },
    easeInQuart: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    easeOutQuart: function (x, t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOutQuart: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    easeInQuint: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    },
    easeOutQuint: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOutQuint: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    easeInSine: function (x, t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine: function (x, t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine: function (x, t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },
    easeInExpo: function (x, t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },
    easeOutCirc: function (x, t, b, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    easeInOutCirc: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },
    easeInElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    easeOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    easeInOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    easeInBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    easeInOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    easeInBounce: function (x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
    },
    easeOutBounce: function (x, t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    },
    easeInOutBounce: function (x, t, b, c, d) {
        if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
;
/*!
 * jQuery UI @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */

(function( $, undefined ) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
    return;
}

$.extend( $.ui, {
    version: "@VERSION",

    keyCode: {
        ALT: 18,
        BACKSPACE: 8,
        CAPS_LOCK: 20,
        COMMA: 188,
        COMMAND: 91,
        COMMAND_LEFT: 91, // COMMAND
        COMMAND_RIGHT: 93,
        CONTROL: 17,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        INSERT: 45,
        LEFT: 37,
        MENU: 93, // COMMAND_RIGHT
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SHIFT: 16,
        SPACE: 32,
        TAB: 9,
        UP: 38,
        WINDOWS: 91 // COMMAND
    }
});

// plugins
$.fn.extend({
    _focus: $.fn.focus,
    focus: function( delay, fn ) {
        return typeof delay === "number" ?
            this.each(function() {
                var elem = this;
                setTimeout(function() {
                    $( elem ).focus();
                    if ( fn ) {
                        fn.call( elem );
                    }
                }, delay );
            }) :
            this._focus.apply( this, arguments );
    },

    scrollParent: function() {
        var scrollParent;
        if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
            scrollParent = this.parents().filter(function() {
                return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
            }).eq(0);
        } else {
            scrollParent = this.parents().filter(function() {
                return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
            }).eq(0);
        }

        return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
    },

    zIndex: function( zIndex ) {
        if ( zIndex !== undefined ) {
            return this.css( "zIndex", zIndex );
        }

        if ( this.length ) {
            var elem = $( this[ 0 ] ), position, value;
            while ( elem.length && elem[ 0 ] !== document ) {
                // Ignore z-index if position is set to a value where z-index is ignored by the browser
                // This makes behavior of this function consistent across browsers
                // WebKit always returns auto if the element is positioned
                position = elem.css( "position" );
                if ( position === "absolute" || position === "relative" || position === "fixed" ) {
                    // IE returns 0 when zIndex is not specified
                    // other browsers return a string
                    // we ignore the case of nested elements with an explicit value of 0
                    // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                    value = parseInt( elem.css( "zIndex" ), 10 );
                    if ( !isNaN( value ) && value !== 0 ) {
                        return value;
                    }
                }
                elem = elem.parent();
            }
        }

        return 0;
    },

    disableSelection: function() {
        return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
            ".ui-disableSelection", function( event ) {
                event.preventDefault();
            });
    },

    enableSelection: function() {
        return this.unbind( ".ui-disableSelection" );
    }
});

$.each( [ "Width", "Height" ], function( i, name ) {
    var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
        type = name.toLowerCase(),
        orig = {
            innerWidth: $.fn.innerWidth,
            innerHeight: $.fn.innerHeight,
            outerWidth: $.fn.outerWidth,
            outerHeight: $.fn.outerHeight
        };

    function reduce( elem, size, border, margin ) {
        $.each( side, function() {
            size -= parseFloat( $.curCSS( elem, "padding" + this, true ) ) || 0;
            if ( border ) {
                size -= parseFloat( $.curCSS( elem, "border" + this + "Width", true ) ) || 0;
            }
            if ( margin ) {
                size -= parseFloat( $.curCSS( elem, "margin" + this, true ) ) || 0;
            }
        });
        return size;
    }

    $.fn[ "inner" + name ] = function( size ) {
        if ( size === undefined ) {
            return orig[ "inner" + name ].call( this );
        }

        return this.each(function() {
            $( this ).css( type, reduce( this, size ) + "px" );
        });
    };

    $.fn[ "outer" + name] = function( size, margin ) {
        if ( typeof size !== "number" ) {
            return orig[ "outer" + name ].call( this, size );
        }

        return this.each(function() {
            $( this).css( type, reduce( this, size, true, margin ) + "px" );
        });
    };
});

// selectors
function visible( element ) {
    return !$( element ).parents().andSelf().filter(function() {
        return $.curCSS( this, "visibility" ) === "hidden" ||
            $.expr.filters.hidden( this );
    }).length;
}

$.extend( $.expr[ ":" ], {
    data: function( elem, i, match ) {
        return !!$.data( elem, match[ 3 ] );
    },

    focusable: function( element ) {
        var nodeName = element.nodeName.toLowerCase(),
            tabIndex = $.attr( element, "tabindex" );
        if ( "area" === nodeName ) {
            var map = element.parentNode,
                mapName = map.name,
                img;
            if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
                return false;
            }
            img = $( "img[usemap=#" + mapName + "]" )[0];
            return !!img && visible( img );
        }
        return ( /input|select|textarea|button|object/.test( nodeName )
            ? !element.disabled
            : "a" == nodeName
                ? element.href || !isNaN( tabIndex )
                : !isNaN( tabIndex ))
            // the element and all of its ancestors must be visible
            && visible( element );
    },

    tabbable: function( element ) {
        var tabIndex = $.attr( element, "tabindex" );
        return ( isNaN( tabIndex ) || tabIndex >= 0 ) && $( element ).is( ":focusable" );
    }
});

// support
$(function() {
    var body = document.body,
        div = body.appendChild( div = document.createElement( "div" ) );

    $.extend( div.style, {
        minHeight: "100px",
        height: "auto",
        padding: 0,
        borderWidth: 0
    });

    $.support.minHeight = div.offsetHeight === 100;
    $.support.selectstart = "onselectstart" in div;

    // set display to none to avoid a layout bug in IE
    // http://dev.jquery.com/ticket/4014
    body.removeChild( div ).style.display = "none";
});





// deprecated
$.extend( $.ui, {
    // $.ui.plugin is deprecated.  Use the proxy pattern instead.
    plugin: {
        add: function( module, option, set ) {
            var proto = $.ui[ module ].prototype;
            for ( var i in set ) {
                proto.plugins[ i ] = proto.plugins[ i ] || [];
                proto.plugins[ i ].push( [ option, set[ i ] ] );
            }
        },
        call: function( instance, name, args ) {
            var set = instance.plugins[ name ];
            if ( !set || !instance.element[ 0 ].parentNode ) {
                return;
            }

            for ( var i = 0; i < set.length; i++ ) {
                if ( instance.options[ set[ i ][ 0 ] ] ) {
                    set[ i ][ 1 ].apply( instance.element, args );
                }
            }
        }
    },

    contains: $.contains,

    // only used by resizable
    hasScroll: function( el, a ) {

        //If overflow is hidden, the element might have extra content, but the user wants to hide it
        if ( $( el ).css( "overflow" ) === "hidden") {
            return false;
        }

        var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
            has = false;

        if ( el[ scroll ] > 0 ) {
            return true;
        }

        // TODO: determine which cases actually cause this to happen
        // if the element doesn't have the scroll set, see if it's possible to
        // set the scroll
        el[ scroll ] = 1;
        has = ( el[ scroll ] > 0 );
        el[ scroll ] = 0;
        return has;
    },

    // these are odd functions, fix the API or move into individual plugins
    isOverAxis: function( x, reference, size ) {
        //Determines when x coordinate is over "b" element axis
        return ( x > reference ) && ( x < ( reference + size ) );
    },
    isOver: function( y, x, top, left, height, width ) {
        //Determines when x, y coordinates is over "b" element
        return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
    }
});

})( jQuery );
/*
 * jQuery UI Position @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */

(function( $, undefined ) {

$.ui = $.ui || {};

var rhorizontal = /left|center|right/,
    rvertical = /top|center|bottom/,
    roffset = /[+-]\d+%?/,
    rposition = /^\w+/,
    rpercent = /%$/,
    center = "center",
    _position = $.fn.position;

$.fn.position = function( options ) {
    if ( !options || !options.of ) {
        return _position.apply( this, arguments );
    }

    // make a copy, we don't want to modify arguments
    options = $.extend( {}, options );

    var target = $( options.of ),
        targetElem = target[0],
        collision = ( options.collision || "flip" ).split( " " ),
        offsets = {},
        atOffset,
        targetWidth,
        targetHeight,
        basePosition;

    if ( targetElem.nodeType === 9 ) {
        targetWidth = target.width();
        targetHeight = target.height();
        basePosition = { top: 0, left: 0 };
    } else if ( $.isWindow( targetElem ) ) {
        targetWidth = target.width();
        targetHeight = target.height();
        basePosition = { top: target.scrollTop(), left: target.scrollLeft() };
    } else if ( targetElem.preventDefault ) {
        // force left top to allow flipping
        options.at = "left top";
        targetWidth = targetHeight = 0;
        basePosition = { top: options.of.pageY, left: options.of.pageX };
    } else {
        targetWidth = target.outerWidth();
        targetHeight = target.outerHeight();
        basePosition = target.offset();
    }

    // force my and at to have valid horizontal and vertical positions
    // if a value is missing or invalid, it will be converted to center
    $.each( [ "my", "at" ], function() {
        var pos = ( options[ this ] || "" ).split( " " ),
            horizontalOffset,
            verticalOffset;

        if ( pos.length === 1) {
            pos = rhorizontal.test( pos[ 0 ] ) ?
                pos.concat( [ center ] ) :
                rvertical.test( pos[ 0 ] ) ?
                    [ center ].concat( pos ) :
                    [ center, center ];
        }
        pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : center;
        pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : center;

        // calculate offsets
        horizontalOffset = roffset.exec( pos[ 0 ] );
        verticalOffset = roffset.exec( pos[ 1 ] );
        offsets[ this ] = [
            horizontalOffset ? horizontalOffset[ 0 ] : 0,
            verticalOffset ? verticalOffset[ 0 ] : 0
        ];

        // reduce to just the positions without the offsets
        options[ this ] = [
            rposition.exec( pos[ 0 ] )[ 0 ],
            rposition.exec( pos[ 1 ] )[ 0 ]
        ];
    });

    // normalize collision option
    if ( collision.length === 1 ) {
        collision[ 1 ] = collision[ 0 ];
    }

    if ( options.at[ 0 ] === "right" ) {
        basePosition.left += targetWidth;
    } else if ( options.at[ 0 ] === center ) {
        basePosition.left += targetWidth / 2;
    }

    if ( options.at[ 1 ] === "bottom" ) {
        basePosition.top += targetHeight;
    } else if ( options.at[ 1 ] === center ) {
        basePosition.top += targetHeight / 2;
    }

    atOffset = [
        parseInt( offsets.at[ 0 ], 10 ) *
            ( rpercent.test( offsets.at[ 0 ] ) ? targetWidth / 100 : 1 ),
        parseInt( offsets.at[ 1 ], 10 ) *
            ( rpercent.test( offsets.at[ 1 ] ) ? targetHeight / 100 : 1 )
    ];
    basePosition.left += atOffset[ 0 ],
    basePosition.top += atOffset[ 1 ];

    return this.each(function() {
        var elem = $( this ),
            elemWidth = elem.outerWidth(),
            elemHeight = elem.outerHeight(),
            marginLeft = parseInt( $.curCSS( this, "marginLeft", true ) ) || 0,
            marginTop = parseInt( $.curCSS( this, "marginTop", true ) ) || 0,
            collisionWidth = elemWidth + marginLeft +
                ( parseInt( $.curCSS( this, "marginRight", true ) ) || 0 ),
            collisionHeight = elemHeight + marginTop +
                ( parseInt( $.curCSS( this, "marginBottom", true ) ) || 0 ),
            position = $.extend( {}, basePosition ),
            myOffset = [
                parseInt( offsets.my[ 0 ], 10 ) *
                    ( rpercent.test( offsets.my[ 0 ] ) ? elem.outerWidth() / 100 : 1 ),
                parseInt( offsets.my[ 1 ], 10 ) *
                    ( rpercent.test( offsets.my[ 1 ] ) ? elem.outerHeight() / 100 : 1 )
            ],
            collisionPosition;

        if ( options.my[ 0 ] === "right" ) {
            position.left -= elemWidth;
        } else if ( options.my[ 0 ] === center ) {
            position.left -= elemWidth / 2;
        }

        if ( options.my[ 1 ] === "bottom" ) {
            position.top -= elemHeight;
        } else if ( options.my[ 1 ] === center ) {
            position.top -= elemHeight / 2;
        }

        position.left += myOffset[ 0 ];
        position.top += myOffset[ 1 ];

        // prevent fractions (see #5280)
        position.left = Math.round( position.left );
        position.top = Math.round( position.top );

        collisionPosition = {
            left: position.left - marginLeft,
            top: position.top - marginTop
        };

        $.each( [ "left", "top" ], function( i, dir ) {
            if ( $.ui.position[ collision[ i ] ] ) {
                $.ui.position[ collision[ i ] ][ dir ]( position, {
                    targetWidth: targetWidth,
                    targetHeight: targetHeight,
                    elemWidth: elemWidth,
                    elemHeight: elemHeight,
                    collisionPosition: collisionPosition,
                    collisionWidth: collisionWidth,
                    collisionHeight: collisionHeight,
                    offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
                    my: options.my,
                    at: options.at
                });
            }
        });

        if ( $.fn.bgiframe ) {
            elem.bgiframe();
        }
        elem.offset( $.extend( position, { using: options.using } ) );
    });
};

$.ui.position = {
    fit: {
        left: function( position, data ) {
            var win = $( window ),
                over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft();
            position.left = over > 0 ?
                position.left - over :
                Math.max( position.left - data.collisionPosition.left, position.left );
        },
        top: function( position, data ) {
            var win = $( window ),
                over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop();
            position.top = over > 0 ?
                position.top - over :
                Math.max( position.top - data.collisionPosition.top, position.top );
        }
    },

    flip: {
        left: function( position, data ) {
            if ( data.at[ 0 ] === center ) {
                return;
            }
            var win = $( window ),
                over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft(),
                myOffset = data.my[ 0 ] === "left" ?
                    -data.elemWidth :
                    data.my[ 0 ] === "right" ?
                        data.elemWidth :
                        0,
                atOffset = data.at[ 0 ] === "left" ?
                    data.targetWidth :
                    -data.targetWidth,
                offset = -2 * data.offset[ 0 ];
            position.left += data.collisionPosition.left < 0 ?
                myOffset + atOffset + offset :
                over > 0 ?
                    myOffset + atOffset + offset :
                    0;
        },
        top: function( position, data ) {
            if ( data.at[ 1 ] === center ) {
                return;
            }
            var win = $( window ),
                over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop(),
                myOffset = data.my[ 1 ] === "top" ?
                    -data.elemHeight :
                    data.my[ 1 ] === "bottom" ?
                        data.elemHeight :
                        0,
                atOffset = data.at[ 1 ] === "top" ?
                    data.targetHeight :
                    -data.targetHeight,
                offset = -2 * data.offset[ 1 ];
            position.top += data.collisionPosition.top < 0 ?
                myOffset + atOffset + offset :
                over > 0 ?
                    myOffset + atOffset + offset :
                    0;
        }
    }
};

// DEPRECATED
if ( $.uiBackCompat !== false ) {
    // offset option
    (function( $ ) {
        var _position = $.fn.position;
        $.fn.position = function( options ) {
            if ( !options || !( "offset" in options ) ) {
                return _position.call( this, options );
            }
            var offset = options.offset.split( " " ),
                at = options.at.split( " " );
            if ( offset.length === 1 ) {
                offset[ 1 ] = offset[ 0 ];
            }
            if ( /^\d/.test( offset[ 0 ] ) ) {
                offset[ 0 ] = "+" + offset[ 0 ];
            }
            if ( /^\d/.test( offset[ 1 ] ) ) {
                offset[ 1 ] = "+" + offset[ 1 ];
            }
            if ( at.length === 1 ) {
                if ( /left|center|right/.test( at[ 0 ] ) ) {
                    at[ 1 ] = "center";
                } else {
                    at[ 1 ] = at[ 0 ];
                    at[ 0 ] = "center";
                }
            }
            return _position.call( this, $.extend( options, {
                at: at[ 0 ] + offset[ 0 ] + " " + at[ 1 ] + offset[ 1 ],
                offset: undefined
            } ) );
        }
    }( jQuery ) );
}

}( jQuery ) );
/*!
 * jQuery UI Widget @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */

(function( $, undefined ) {

var slice = Array.prototype.slice;

var _cleanData = $.cleanData;
$.cleanData = function( elems ) {
    for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
        $( elem ).triggerHandler( "remove" );
    }
    _cleanData( elems );
};

$.widget = function( name, base, prototype ) {
    var namespace = name.split( "." )[ 0 ],
        fullName;
    name = name.split( "." )[ 1 ];
    fullName = namespace + "-" + name;

    if ( !prototype ) {
        prototype = base;
        base = $.Widget;
    }

    // create selector for plugin
    $.expr[ ":" ][ fullName ] = function( elem ) {
        return !!$.data( elem, name );
    };

    $[ namespace ] = $[ namespace ] || {};
    // create the constructor using $.extend() so we can carry over any
    // static properties stored on the existing constructor (if there is one)
    $[ namespace ][ name ] = $.extend( function( options, element ) {
        // allow instantiation without "new" keyword
        if ( !this._createWidget ) {
            return new $[ namespace ][ name ]( options, element );
        }

        // allow instantiation without initializing for simple inheritance
        // must use "new" keyword (the code above always passes args)
        if ( arguments.length ) {
            this._createWidget( options, element );
        }
    }, $[ namespace ][ name ] );

    var basePrototype = new base();
    // we need to make the options hash a property directly on the new instance
    // otherwise we'll modify the options hash on the prototype that we're
    // inheriting from
    basePrototype.options = $.extend( true, {}, basePrototype.options );
    $.each( prototype, function( prop, value ) {
        if ( $.isFunction( value ) ) {
            prototype[ prop ] = (function() {
                var _super = function( method ) {
                    return base.prototype[ method ].apply( this, slice.call( arguments, 1 ) );
                };
                var _superApply = function( method, args ) {
                    return base.prototype[ method ].apply( this, args );
                };
                return function() {
                    var __super = this._super,
                        __superApply = this._superApply,
                        returnValue;

                    this._super = _super;
                    this._superApply = _superApply;

                    returnValue = value.apply( this, arguments );

                    this._super = __super;
                    this._superApply = __superApply;

                    return returnValue;
                };
            }());
        }
    });
    $[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
        namespace: namespace,
        widgetName: name,
        widgetEventPrefix: name,
        widgetBaseClass: fullName
    }, prototype );

    $.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.bridge = function( name, object ) {
    $.fn[ name ] = function( options ) {
        var isMethodCall = typeof options === "string",
            args = slice.call( arguments, 1 ),
            returnValue = this;

        // allow multiple hashes to be passed on init
        options = !isMethodCall && args.length ?
            $.extend.apply( null, [ true, options ].concat(args) ) :
            options;

        if ( isMethodCall ) {
            this.each(function() {
                var instance = $.data( this, name );
                if ( !instance ) {
                    return $.error( "cannot call methods on " + name + " prior to initialization; " +
                        "attempted to call method '" + options + "'" );
                }
                if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
                    return $.error( "no such method '" + options + "' for " + name + " widget instance" );
                }
                var methodValue = instance[ options ].apply( instance, args );
                if ( methodValue !== instance && methodValue !== undefined ) {
                    returnValue = methodValue.jquery ?
                        returnValue.pushStack( methodValue.get() ) :
                        methodValue;
                    return false;
                }
            });
        } else {
            this.each(function() {
                var instance = $.data( this, name );
                if ( instance ) {
                    instance.option( options || {} )._init();
                } else {
                    object( options, this );
                }
            });
        }

        return returnValue;
    };
};

$.Widget = function( options, element ) {
    // allow instantiation without "new" keyword
    if ( !this._createWidget ) {
        return new $[ namespace ][ name ]( options, element );
    }

    // allow instantiation without initializing for simple inheritance
    // must use "new" keyword (the code above always passes args)
    if ( arguments.length ) {
        this._createWidget( options, element );
    }
};

$.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: {
        disabled: false
    },
    _createWidget: function( options, element ) {
        element = $( element || this.defaultElement || this )[ 0 ];
        this.element = $( element );
        this.options = $.extend( true, {},
            this.options,
            this._getCreateOptions(),
            options );

        this.bindings = $();
        this.hoverable = $();
        this.focusable = $();

        if ( element !== this ) {
            $.data( element, this.widgetName, this );
            this._bind({ remove: "destroy" });
        }

        this._create();
        this._trigger( "create" );
        this._init();
    },
    _getCreateOptions: $.noop,
    _create: $.noop,
    _init: $.noop,

    destroy: function() {
        this._destroy();
        // we can probably remove the unbind calls in 2.0
        // all event bindings should go through this._bind()
        this.element
            .unbind( "." + this.widgetName )
            .removeData( this.widgetName );
        this.widget()
            .unbind( "." + this.widgetName )
            .removeAttr( "aria-disabled" )
            .removeClass(
                this.widgetBaseClass + "-disabled " +
                "ui-state-disabled" );

        // clean up events and states
        this.bindings.unbind( "." + this.widgetName );
        this.hoverable.removeClass( "ui-state-hover" );
        this.focusable.removeClass( "ui-state-focus" );
    },
    _destroy: $.noop,

    widget: function() {
        return this.element;
    },

    option: function( key, value ) {
        var options = key,
            parts,
            curOption,
            i;

        if ( arguments.length === 0 ) {
            // don't return a reference to the internal hash
            return $.extend( {}, this.options );
        }

        if ( typeof key === "string" ) {
            if ( value === undefined ) {
                return this.options[ key ];
            }
            // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
            options = {};
            parts = key.split( "." );
            key = parts.shift();
            if ( parts.length ) {
                curOption = options[ key ] = $.extend( true, {}, this.options[ key ] );
                for ( i = 0; i < parts.length - 1; i++ ) {
                    curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                    curOption = curOption[ parts[ i ] ];
                }
                curOption[ parts.pop() ] = value;
            } else {
                options[ key ] = value;
            }
        }

        this._setOptions( options );

        return this;
    },
    _setOptions: function( options ) {
        var self = this;
        $.each( options, function( key, value ) {
            self._setOption( key, value );
        });

        return this;
    },
    _setOption: function( key, value ) {
        this.options[ key ] = value;

        if ( key === "disabled" ) {
            this.widget()
                .toggleClass( this.widgetBaseClass + "-disabled ui-state-disabled", !!value )
                .attr( "aria-disabled", value );
            this.hoverable.removeClass( "ui-state-hover" );
            this.focusable.removeClass( "ui-state-focus" );
        }

        return this;
    },

    enable: function() {
        return this._setOption( "disabled", false );
    },
    disable: function() {
        return this._setOption( "disabled", true );
    },

    _bind: function( element, handlers ) {
        // no element argument, shuffle and use this.element
        if ( !handlers ) {
            handlers = element;
            element = this.element;
        } else {
            // accept selectors, DOM elements
            element = $( element );
            this.bindings = this.bindings.add( element );
        }
        var instance = this;
        $.each( handlers, function( event, handler ) {
            element.bind( event + "." + instance.widgetName, function() {
                // allow widgets to customize the disabled handling
                // - disabled as an array instead of boolean
                // - disabled class as method for disabling individual parts
                if ( instance.options.disabled === true ||
                        $( this ).hasClass( "ui-state-disabled" ) ) {
                    return;
                }
                return ( typeof handler === "string" ? instance[ handler ] : handler )
                    .apply( instance, arguments );
            });
        });
    },

    _hoverable: function( element ) {
        this.hoverable = this.hoverable.add( element );
        this._bind( element, {
            mouseenter: function( event ) {
                $( event.currentTarget ).addClass( "ui-state-hover" );
            },
            mouseleave: function( event ) {
                $( event.currentTarget ).removeClass( "ui-state-hover" );
            }
        });
    },

    _focusable: function( element ) {
        this.focusable = this.focusable.add( element );
        this._bind( element, {
            focusin: function( event ) {
                $( event.currentTarget ).addClass( "ui-state-focus" );
            },
            focusout: function( event ) {
                $( event.currentTarget ).removeClass( "ui-state-focus" );
            }
        });
    },

    _trigger: function( type, event, data ) {
        var callback = this.options[ type ],
            args;

        event = $.Event( event );
        event.type = ( type === this.widgetEventPrefix ?
            type :
            this.widgetEventPrefix + type ).toLowerCase();
        data = data || {};

        // copy original event properties over to the new event
        // this would happen if we could call $.event.fix instead of $.Event
        // but we don't have a way to force an event to be fixed multiple times
        if ( event.originalEvent ) {
            for ( var i = $.event.props.length, prop; i; ) {
                prop = $.event.props[ --i ];
                event[ prop ] = event.originalEvent[ prop ];
            }
        }

        this.element.trigger( event, data );

        args = $.isArray( data ) ?
            [ event ].concat( data ) :
            [ event, data ];

        return !( $.isFunction( callback ) &&
            callback.apply( this.element[0], args ) === false ||
            event.isDefaultPrevented() );
    }
};

// DEPRECATED
if ( $.uiBackCompat !== false ) {
    $.Widget.prototype._getCreateOptions = function() {
        return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
    }
}

})( jQuery );
/*
 * jQuery UI Tabs 1.8.13
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */

(function( $, undefined ) {

var tabId = 0,
    listId = 0;

function getNextTabId() {
    return ++tabId;
}

function getNextListId() {
    return ++listId;
}

$.widget( "ui.tabs", {
    options: {
        add: null,
        ajaxOptions: null,
        cache: false,
        cookie: null, // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
        collapsible: false,
        disable: null,
        disabled: [],
        enable: null,
        event: "click",
        fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }
        idPrefix: "ui-tabs-",
        load: null,
        panelTemplate: "<div></div>",
        remove: null,
        select: null,
        show: null,
        spinner: "<em>Loading&#8230;</em>",
        tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
    },

    _create: function() {
        this._tabify( true );
    },

    _setOption: function( key, value ) {
        if ( key == "selected" ) {
            if (this.options.collapsible && value == this.options.selected ) {
                return;
            }
            this.select( value );
        } else {
            this.options[ key ] = value;
            this._tabify();
        }
    },

    _tabId: function( a ) {
        return a.title && a.title.replace( /\s/g, "_" ).replace( /[^\w\u00c0-\uFFFF-]/g, "" ) ||
            this.options.idPrefix + getNextTabId();
    },

    _sanitizeSelector: function( hash ) {
        // we need this because an id may contain a ":"
        return hash.replace( /:/g, "\\:" );
    },

    _cookie: function() {
        var cookie = this.cookie ||
            ( this.cookie = this.options.cookie.name || "ui-tabs-" + getNextListId() );
        return $.cookie.apply( null, [ cookie ].concat( $.makeArray( arguments ) ) );
    },

    _ui: function( tab, panel ) {
        return {
            tab: tab,
            panel: panel,
            index: this.anchors.index( tab )
        };
    },

    _cleanup: function() {
        // restore all former loading tabs labels
        this.lis.filter( ".ui-state-processing" )
            .removeClass( "ui-state-processing" )
            .find( "span:data(label.tabs)" )
                .each(function() {
                    var el = $( this );
                    el.html( el.data( "label.tabs" ) ).removeData( "label.tabs" );
                });
    },

    _tabify: function( init ) {
        var self = this,
            o = this.options,
            fragmentId = /^#.+/; // Safari 2 reports '#' for an empty hash

        this.list = this.element.find( "ol,ul" ).eq( 0 );
        this.lis = $( " > li:has(a[href])", this.list );
        this.anchors = this.lis.map(function() {
            return $( "a", this )[ 0 ];
        });
        this.panels = $( [] );

        this.anchors.each(function( i, a ) {
            var href = $( a ).attr( "href" );
            // For dynamically created HTML that contains a hash as href IE < 8 expands
            // such href to the full page url with hash and then misinterprets tab as ajax.
            // Same consideration applies for an added tab with a fragment identifier
            // since a[href=#fragment-identifier] does unexpectedly not match.
            // Thus normalize href attribute...
            var hrefBase = href.split( "#" )[ 0 ],
                baseEl;
            if ( hrefBase && ( hrefBase === location.toString().split( "#" )[ 0 ] ||
                    ( baseEl = $( "base" )[ 0 ]) && hrefBase === baseEl.href ) ) {
                href = a.hash;
                a.href = href;
            }

            // inline tab
            if ( fragmentId.test( href ) ) {
                self.panels = self.panels.add( self.element.find( self._sanitizeSelector( href ) ) );
            // remote tab
            // prevent loading the page itself if href is just "#"
            } else if ( href && href !== "#" ) {
                // required for restore on destroy
                $.data( a, "href.tabs", href );

                // TODO until #3808 is fixed strip fragment identifier from url
                // (IE fails to load from such url)
                $.data( a, "load.tabs", href.replace( /#.*$/, "" ) );

                var id = self._tabId( a );
                a.href = "#" + id;
                var $panel = self.element.find( "#" + id );
                if ( !$panel.length ) {
                    $panel = $( o.panelTemplate )
                        .attr( "id", id )
                        .addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
                        .insertAfter( self.panels[ i - 1 ] || self.list );
                    $panel.data( "destroy.tabs", true );
                }
                self.panels = self.panels.add( $panel );
            // invalid tab href
            } else {
                o.disabled.push( i );
            }
        });

        // initialization from scratch
        if ( init ) {
            // attach necessary classes for styling
            this.element.addClass( "ui-tabs ui-widget ui-widget-content ui-corner-all" );
            this.list.addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" );
            this.lis.addClass( "ui-state-default ui-corner-top" );
            this.panels.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" );

            // Selected tab
            // use "selected" option or try to retrieve:
            // 1. from fragment identifier in url
            // 2. from cookie
            // 3. from selected class attribute on <li>
            if ( o.selected === undefined ) {
                if ( location.hash ) {
                    this.anchors.each(function( i, a ) {
                        if ( a.hash == location.hash ) {
                            o.selected = i;
                            return false;
                        }
                    });
                }
                if ( typeof o.selected !== "number" && o.cookie ) {
                    o.selected = parseInt( self._cookie(), 10 );
                }
                if ( typeof o.selected !== "number" && this.lis.filter( ".ui-tabs-selected" ).length ) {
                    o.selected = this.lis.index( this.lis.filter( ".ui-tabs-selected" ) );
                }
                o.selected = o.selected || ( this.lis.length ? 0 : -1 );
            } else if ( o.selected === null ) { // usage of null is deprecated, TODO remove in next release
                o.selected = -1;
            }

            // sanity check - default to first tab...
            o.selected = ( ( o.selected >= 0 && this.anchors[ o.selected ] ) || o.selected < 0 )
                ? o.selected
                : 0;

            // Take disabling tabs via class attribute from HTML
            // into account and update option properly.
            // A selected tab cannot become disabled.
            o.disabled = $.unique( o.disabled.concat(
                $.map( this.lis.filter( ".ui-state-disabled" ), function( n, i ) {
                    return self.lis.index( n );
                })
            ) ).sort();

            if ( $.inArray( o.selected, o.disabled ) != -1 ) {
                o.disabled.splice( $.inArray( o.selected, o.disabled ), 1 );
            }

            // highlight selected tab
            this.panels.addClass( "ui-tabs-hide" );
            this.lis.removeClass( "ui-tabs-selected ui-state-active" );
            // check for length avoids error when initializing empty list
            if ( o.selected >= 0 && this.anchors.length ) {
                self.element.find( self._sanitizeSelector( self.anchors[ o.selected ].hash ) ).removeClass( "ui-tabs-hide" );
                this.lis.eq( o.selected ).addClass( "ui-tabs-selected ui-state-active" );

                // seems to be expected behavior that the show callback is fired
                self.element.queue( "tabs", function() {
                    self._trigger( "show", null,
                        self._ui( self.anchors[ o.selected ], self.element.find( self._sanitizeSelector( self.anchors[ o.selected ].hash ) )[ 0 ] ) );
                });

                this.load( o.selected );
            }

            // clean up to avoid memory leaks in certain versions of IE 6
            // TODO: namespace this event
            $( window ).bind( "unload", function() {
                self.lis.add( self.anchors ).unbind( ".tabs" );
                self.lis = self.anchors = self.panels = null;
            });
        // update selected after add/remove
        } else {
            o.selected = this.lis.index( this.lis.filter( ".ui-tabs-selected" ) );
        }

        // update collapsible
        // TODO: use .toggleClass()
        this.element[ o.collapsible ? "addClass" : "removeClass" ]( "ui-tabs-collapsible" );

        // set or update cookie after init and add/remove respectively
        if ( o.cookie ) {
            this._cookie( o.selected, o.cookie );
        }

        // disable tabs
        for ( var i = 0, li; ( li = this.lis[ i ] ); i++ ) {
            $( li )[ $.inArray( i, o.disabled ) != -1 &&
                // TODO: use .toggleClass()
                !$( li ).hasClass( "ui-tabs-selected" ) ? "addClass" : "removeClass" ]( "ui-state-disabled" );
        }

        // reset cache if switching from cached to not cached
        if ( o.cache === false ) {
            this.anchors.removeData( "cache.tabs" );
        }

        // remove all handlers before, tabify may run on existing tabs after add or option change
        this.lis.add( this.anchors ).unbind( ".tabs" );

        if ( o.event !== "mouseover" ) {
            var addState = function( state, el ) {
                if ( el.is( ":not(.ui-state-disabled)" ) ) {
                    el.addClass( "ui-state-" + state );
                }
            };
            var removeState = function( state, el ) {
                el.removeClass( "ui-state-" + state );
            };
            this.lis.bind( "mouseover.tabs" , function() {
                addState( "hover", $( this ) );
            });
            this.lis.bind( "mouseout.tabs", function() {
                removeState( "hover", $( this ) );
            });
            this.anchors.bind( "focus.tabs", function() {
                addState( "focus", $( this ).closest( "li" ) );
            });
            this.anchors.bind( "blur.tabs", function() {
                removeState( "focus", $( this ).closest( "li" ) );
            });
        }

        // set up animations
        var hideFx, showFx;
        if ( o.fx ) {
            if ( $.isArray( o.fx ) ) {
                hideFx = o.fx[ 0 ];
                showFx = o.fx[ 1 ];
            } else {
                hideFx = showFx = o.fx;
            }
        }

        // Reset certain styles left over from animation
        // and prevent IE's ClearType bug...
        function resetStyle( $el, fx ) {
            $el.css( "display", "" );
            if ( !$.support.opacity && fx.opacity ) {
                $el[ 0 ].style.removeAttribute( "filter" );
            }
        }

        // Show a tab...
        var showTab = showFx
            ? function( clicked, $show ) {
                $( clicked ).closest( "li" ).addClass( "ui-tabs-selected ui-state-active" );
                $show.hide().removeClass( "ui-tabs-hide" ) // avoid flicker that way
                    .animate( showFx, showFx.duration || "normal", function() {
                        resetStyle( $show, showFx );
                        self._trigger( "show", null, self._ui( clicked, $show[ 0 ] ) );
                    });
            }
            : function( clicked, $show ) {
                $( clicked ).closest( "li" ).addClass( "ui-tabs-selected ui-state-active" );
                $show.removeClass( "ui-tabs-hide" );
                self._trigger( "show", null, self._ui( clicked, $show[ 0 ] ) );
            };

        // Hide a tab, $show is optional...
        var hideTab = hideFx
            ? function( clicked, $hide ) {
                $hide.animate( hideFx, hideFx.duration || "normal", function() {
                    self.lis.removeClass( "ui-tabs-selected ui-state-active" );
                    $hide.addClass( "ui-tabs-hide" );
                    resetStyle( $hide, hideFx );
                    self.element.dequeue( "tabs" );
                });
            }
            : function( clicked, $hide, $show ) {
                self.lis.removeClass( "ui-tabs-selected ui-state-active" );
                $hide.addClass( "ui-tabs-hide" );
                self.element.dequeue( "tabs" );
            };

        // attach tab event handler, unbind to avoid duplicates from former tabifying...
        this.anchors.bind( o.event + ".tabs", function() {
            var el = this,
                $li = $(el).closest( "li" ),
                $hide = self.panels.filter( ":not(.ui-tabs-hide)" ),
                $show = self.element.find( self._sanitizeSelector( el.hash ) );

            // If tab is already selected and not collapsible or tab disabled or
            // or is already loading or click callback returns false stop here.
            // Check if click handler returns false last so that it is not executed
            // for a disabled or loading tab!
            if ( ( $li.hasClass( "ui-tabs-selected" ) && !o.collapsible) ||
                $li.hasClass( "ui-state-disabled" ) ||
                $li.hasClass( "ui-state-processing" ) ||
                self.panels.filter( ":animated" ).length ||
                self._trigger( "select", null, self._ui( this, $show[ 0 ] ) ) === false ) {
                this.blur();
                return false;
            }

            o.selected = self.anchors.index( this );

            self.abort();

            // if tab may be closed
            if ( o.collapsible ) {
                if ( $li.hasClass( "ui-tabs-selected" ) ) {
                    o.selected = -1;

                    if ( o.cookie ) {
                        self._cookie( o.selected, o.cookie );
                    }

                    self.element.queue( "tabs", function() {
                        hideTab( el, $hide );
                    }).dequeue( "tabs" );

                    this.blur();
                    return false;
                } else if ( !$hide.length ) {
                    if ( o.cookie ) {
                        self._cookie( o.selected, o.cookie );
                    }

                    self.element.queue( "tabs", function() {
                        showTab( el, $show );
                    });

                    // TODO make passing in node possible, see also http://dev.jqueryui.com/ticket/3171
                    self.load( self.anchors.index( this ) );

                    this.blur();
                    return false;
                }
            }

            if ( o.cookie ) {
                self._cookie( o.selected, o.cookie );
            }

            // show new tab
            if ( $show.length ) {
                if ( $hide.length ) {
                    self.element.queue( "tabs", function() {
                        hideTab( el, $hide );
                    });
                }
                self.element.queue( "tabs", function() {
                    showTab( el, $show );
                });

                self.load( self.anchors.index( this ) );
            } else {
                throw "jQuery UI Tabs: Mismatching fragment identifier.";
            }

            // Prevent IE from keeping other link focussed when using the back button
            // and remove dotted border from clicked link. This is controlled via CSS
            // in modern browsers; blur() removes focus from address bar in Firefox
            // which can become a usability and annoying problem with tabs('rotate').
            if ( $.browser.msie ) {
                this.blur();
            }
        });

        // disable click in any case
        this.anchors.bind( "click.tabs", function(){
            return false;
        });
    },

    _getIndex: function( index ) {
        // meta-function to give users option to provide a href string instead of a numerical index.
        // also sanitizes numerical indexes to valid values.
        if ( typeof index == "string" ) {
            index = this.anchors.index( this.anchors.filter( "[href$=" + index + "]" ) );
        }

        return index;
    },

    destroy: function() {
        var o = this.options;

        this.abort();

        this.element
            .unbind( ".tabs" )
            .removeClass( "ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible" )
            .removeData( "tabs" );

        this.list.removeClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" );

        this.anchors.each(function() {
            var href = $.data( this, "href.tabs" );
            if ( href ) {
                this.href = href;
            }
            var $this = $( this ).unbind( ".tabs" );
            $.each( [ "href", "load", "cache" ], function( i, prefix ) {
                $this.removeData( prefix + ".tabs" );
            });
        });

        this.lis.unbind( ".tabs" ).add( this.panels ).each(function() {
            if ( $.data( this, "destroy.tabs" ) ) {
                $( this ).remove();
            } else {
                $( this ).removeClass([
                    "ui-state-default",
                    "ui-corner-top",
                    "ui-tabs-selected",
                    "ui-state-active",
                    "ui-state-hover",
                    "ui-state-focus",
                    "ui-state-disabled",
                    "ui-tabs-panel",
                    "ui-widget-content",
                    "ui-corner-bottom",
                    "ui-tabs-hide"
                ].join( " " ) );
            }
        });

        if ( o.cookie ) {
            this._cookie( null, o.cookie );
        }

        return this;
    },

    add: function( url, label, index ) {
        if ( index === undefined ) {
            index = this.anchors.length;
        }

        var self = this,
            o = this.options,
            $li = $( o.tabTemplate.replace( /#\{href\}/g, url ).replace( /#\{label\}/g, label ) ),
            id = !url.indexOf( "#" ) ? url.replace( "#", "" ) : this._tabId( $( "a", $li )[ 0 ] );

        $li.addClass( "ui-state-default ui-corner-top" ).data( "destroy.tabs", true );

        // try to find an existing element before creating a new one
        var $panel = self.element.find( "#" + id );
        if ( !$panel.length ) {
            $panel = $( o.panelTemplate )
                .attr( "id", id )
                .data( "destroy.tabs", true );
        }
        $panel.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" );

        if ( index >= this.lis.length ) {
            $li.appendTo( this.list );
            $panel.appendTo( this.list[ 0 ].parentNode );
        } else {
            $li.insertBefore( this.lis[ index ] );
            $panel.insertBefore( this.panels[ index ] );
        }

        o.disabled = $.map( o.disabled, function( n, i ) {
            return n >= index ? ++n : n;
        });

        this._tabify();

        if ( this.anchors.length == 1 ) {
            o.selected = 0;
            $li.addClass( "ui-tabs-selected ui-state-active" );
            $panel.removeClass( "ui-tabs-hide" );
            this.element.queue( "tabs", function() {
                self._trigger( "show", null, self._ui( self.anchors[ 0 ], self.panels[ 0 ] ) );
            });

            this.load( 0 );
        }

        this._trigger( "add", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
        return this;
    },

    remove: function( index ) {
        index = this._getIndex( index );
        var o = this.options,
            $li = this.lis.eq( index ).remove(),
            $panel = this.panels.eq( index ).remove();

        // If selected tab was removed focus tab to the right or
        // in case the last tab was removed the tab to the left.
        if ( $li.hasClass( "ui-tabs-selected" ) && this.anchors.length > 1) {
            this.select( index + ( index + 1 < this.anchors.length ? 1 : -1 ) );
        }

        o.disabled = $.map(
            $.grep( o.disabled, function(n, i) {
                return n != index;
            }),
            function( n, i ) {
                return n >= index ? --n : n;
            });

        this._tabify();

        this._trigger( "remove", null, this._ui( $li.find( "a" )[ 0 ], $panel[ 0 ] ) );
        return this;
    },

    enable: function( index ) {
        index = this._getIndex( index );
        var o = this.options;
        if ( $.inArray( index, o.disabled ) == -1 ) {
            return;
        }

        this.lis.eq( index ).removeClass( "ui-state-disabled" );
        o.disabled = $.grep( o.disabled, function( n, i ) {
            return n != index;
        });

        this._trigger( "enable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
        return this;
    },

    disable: function( index ) {
        index = this._getIndex( index );
        var self = this, o = this.options;
        // cannot disable already selected tab
        if ( index != o.selected ) {
            this.lis.eq( index ).addClass( "ui-state-disabled" );

            o.disabled.push( index );
            o.disabled.sort();

            this._trigger( "disable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
        }

        return this;
    },

    select: function( index ) {
        index = this._getIndex( index );
        if ( index == -1 ) {
            if ( this.options.collapsible && this.options.selected != -1 ) {
                index = this.options.selected;
            } else {
                return this;
            }
        }
        this.anchors.eq( index ).trigger( this.options.event + ".tabs" );
        return this;
    },

    load: function( index ) {
        index = this._getIndex( index );
        var self = this,
            o = this.options,
            a = this.anchors.eq( index )[ 0 ],
            url = $.data( a, "load.tabs" );

        this.abort();

        // not remote or from cache
        if ( !url || this.element.queue( "tabs" ).length !== 0 && $.data( a, "cache.tabs" ) ) {
            this.element.dequeue( "tabs" );
            return;
        }

        // load remote from here on
        this.lis.eq( index ).addClass( "ui-state-processing" );

        if ( o.spinner ) {
            var span = $( "span", a );
            span.data( "label.tabs", span.html() ).html( o.spinner );
        }

        this.xhr = $.ajax( $.extend( {}, o.ajaxOptions, {
            url: url,
            success: function( r, s ) {
                self.element.find( self._sanitizeSelector( a.hash ) ).html( r );

                // take care of tab labels
                self._cleanup();

                if ( o.cache ) {
                    $.data( a, "cache.tabs", true );
                }

                self._trigger( "load", null, self._ui( self.anchors[ index ], self.panels[ index ] ) );
                try {
                    o.ajaxOptions.success( r, s );
                }
                catch ( e ) {}
            },
            error: function( xhr, s, e ) {
                // take care of tab labels
                self._cleanup();

                self._trigger( "load", null, self._ui( self.anchors[ index ], self.panels[ index ] ) );
                try {
                    // Passing index avoid a race condition when this method is
                    // called after the user has selected another tab.
                    // Pass the anchor that initiated this request allows
                    // loadError to manipulate the tab content panel via $(a.hash)
                    o.ajaxOptions.error( xhr, s, index, a );
                }
                catch ( e ) {}
            }
        } ) );

        // last, so that load event is fired before show...
        self.element.dequeue( "tabs" );

        return this;
    },

    abort: function() {
        // stop possibly running animations
        this.element.queue( [] );
        this.panels.stop( false, true );

        // "tabs" queue must not contain more than two elements,
        // which are the callbacks for the latest clicked tab...
        this.element.queue( "tabs", this.element.queue( "tabs" ).splice( -2, 2 ) );

        // terminate pending requests from other tabs
        if ( this.xhr ) {
            this.xhr.abort();
            delete this.xhr;
        }

        // take care of tab labels
        this._cleanup();
        return this;
    },

    url: function( index, url ) {
        this.anchors.eq( index ).removeData( "cache.tabs" ).data( "load.tabs", url );
        return this;
    },

    length: function() {
        return this.anchors.length;
    }
});

$.extend( $.ui.tabs, {
    version: "1.8.13"
});

/*
 * Tabs Extensions
 */

/*
 * Rotate
 */
$.extend( $.ui.tabs.prototype, {
    rotation: null,
    rotate: function( ms, continuing ) {
        var self = this,
            o = this.options;

        var rotate = self._rotate || ( self._rotate = function( e ) {
            clearTimeout( self.rotation );
            self.rotation = setTimeout(function() {
                var t = o.selected;
                self.select( ++t < self.anchors.length ? t : 0 );
            }, ms );

            if ( e ) {
                e.stopPropagation();
            }
        });

        var stop = self._unrotate || ( self._unrotate = !continuing
            ? function(e) {
                if (e.clientX) { // in case of a true click
                    self.rotate(null);
                }
            }
            : function( e ) {
                t = o.selected;
                rotate();
            });

        // start rotation
        if ( ms ) {
            this.element.bind( "tabsshow", rotate );
            this.anchors.bind( o.event + ".tabs", stop );
            rotate();
        // stop rotation
        } else {
            clearTimeout( self.rotation );
            this.element.unbind( "tabsshow", rotate );
            this.anchors.unbind( o.event + ".tabs", stop );
            delete this._rotate;
            delete this._unrotate;
        }

        return this;
    }
});

})( jQuery );
(function( $, undefined ) {

var uiDialogClasses = "dialog",
    sizeRelatedOptions = {
        buttons: true,
        height: true,
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true,
        width: true
    },
    resizableRelatedOptions = {
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true
    };

$.widget("ui.dialog", {
    options: {
        autoOpen: true,
        buttons: {},
        closeOnEscape: true,
        closeText: "close",
        dialogClass: "",
        draggable: true,
        hide: null,
        height: "auto",
        maxHeight: false,
        maxWidth: false,
        minHeight: 150,
        minWidth: 150,
        modal: false,
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "fit",
            // ensure that the titlebar is never outside the document
            using: function( pos ) {
                var topOffset = $( this ).css( pos ).offset().top;
                if ( topOffset < 0 ) {
                    $( this ).css( "top", pos.top - topOffset );
                }
            }
        },
        resizable: true,
        show: null,
        stack: true,
        title: "",
        width: 300,
        zIndex: 1000
    },

    _create: function() {
        this.originalTitle = this.element.attr( "title" );
        // #5742 - .attr() might return a DOMElement
        if ( typeof this.originalTitle !== "string" ) {
            this.originalTitle = "";
        }

        this.options.title = this.options.title || this.originalTitle;
        var self = this,
            options = self.options,

            title = options.title || "&#160;",
            titleId = $.ui.dialog.getTitleId( self.element ),

            uiDialog = ( self.uiDialog = $( "<div>" ) )
                .appendTo( document.body )
                .hide()
                .addClass( uiDialogClasses + options.dialogClass )
                .css({
                    zIndex: options.zIndex
                })
                // setting tabIndex makes the div focusable
                .attr( "tabIndex", -1)
                // TODO: move to stylesheet
                .css( "outline", 0 )
                .keydown(function( event ) {
                    if ( options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
                            event.keyCode === $.ui.keyCode.ESCAPE ) {
                        self.close( event );
                        event.preventDefault();
                    }
                })
                .attr({
                    role: "dialog",
                    "aria-labelledby": titleId
                })
                .mousedown(function( event ) {
                    self.moveToTop( false, event );
                }),

            uiDialogContent = self.element
                .show()
                .removeAttr( "title" )
                .addClass( "dialog-contentcontent" )
                .appendTo( uiDialog ),

            uiDialogTitlebar = ( self.uiDialogTitlebar = $( "<div>" ) )
                .addClass( "dialog-titlebar header  " +
                    "corner-all  clearfix" )
                .prependTo( uiDialog ),

            uiDialogTitlebarClose = $( "<a href='#'></a>" )
                .addClass( "dialog-titlebar-close  corner-all" )
                .attr( "role", "button" )
                .click(function( event ) {
                    event.preventDefault();
                    self.close( event );
                })
                .appendTo( uiDialogTitlebar ),

            uiDialogTitlebarCloseText = ( self.uiDialogTitlebarCloseText = $( "<span>" ) )
                .addClass( "icon icon-closethick" )
                .text( options.closeText )
                .appendTo( uiDialogTitlebarClose ),

            uiDialogTitle = $( "<span>" )
                .addClass( "dialog-title" )
                .attr( "id", titleId )
                .html( title )
                .prependTo( uiDialogTitlebar );

        uiDialogTitlebar.find( "*" ).add( uiDialogTitlebar ).disableSelection();
        this._hoverable( uiDialogTitlebarClose );
        this._focusable( uiDialogTitlebarClose );

        if ( options.draggable && $.fn.draggable ) {
            self._makeDraggable();
        }
        if ( options.resizable && $.fn.resizable ) {
            self._makeResizable();
        }

        self._createButtons( options.buttons );
        self._isOpen = false;

        if ( $.fn.bgiframe ) {
            uiDialog.bgiframe();
        }
    },

    _init: function() {
        if ( this.options.autoOpen ) {
            this.open();
        }
    },

    _destroy: function() {
        var self = this;

        if ( self.overlay ) {
            self.overlay.destroy();
        }
        self.uiDialog.hide();
        self.element
            .removeClass( "dialog-contentcontent" )
            .hide()
            .appendTo( "body" );
        self.uiDialog.remove();

        if ( self.originalTitle ) {
            self.element.attr( "title", self.originalTitle );
        }
    },

    widget: function() {
        return this.uiDialog;
    },

    close: function( event ) {
        var self = this,
            maxZ, thisZ;

        if ( false === self._trigger( "beforeClose", event ) ) {
            return;
        }

        if ( self.overlay ) {
            self.overlay.destroy();
        }
        self.uiDialog.unbind( "keypress.dialog" );

        self._isOpen = false;

        if ( self.options.hide ) {
            self.uiDialog.hide( self.options.hide, function() {
                self._trigger( "close", event );
            });
        } else {
            self.uiDialog.hide();
            self._trigger( "close", event );
        }

        $.ui.dialog.overlay.resize();

        // adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
        if ( self.options.modal ) {
            maxZ = 0;
            $( ".dialog" ).each(function() {
                if ( this !== self.uiDialog[0] ) {
                    thisZ = $( this ).css( "z-index" );
                    if ( !isNaN( thisZ ) ) {
                        maxZ = Math.max( maxZ, thisZ );
                    }
                }
            });
            $.ui.dialog.maxZ = maxZ;
        }

        return self;
    },

    isOpen: function() {
        return this._isOpen;
    },

    // the force parameter allows us to move modal dialogs to their correct
    // position on open
    moveToTop: function( force, event ) {
        var self = this,
            options = self.options,
            saveScroll;

        if ( ( options.modal && !force ) ||
                ( !options.stack && !options.modal ) ) {
            return self._trigger( "focus", event );
        }

        if ( options.zIndex > $.ui.dialog.maxZ ) {
            $.ui.dialog.maxZ = options.zIndex;
        }
        if ( self.overlay ) {
            $.ui.dialog.maxZ += 1;
            $.ui.dialog.overlay.maxZ = $.ui.dialog.maxZ;
            self.overlay.$el.css( "z-index", $.ui.dialog.overlay.maxZ );
        }

        // Save and then restore scroll
        // Opera 9.5+ resets when parent z-index is changed.
        // http://bugs.jqueryui.com/ticket/3193
        saveScroll = {
            scrollTop: self.element.attr( "scrollTop" ),
            scrollLeft: self.element.attr( "scrollLeft" )
        };
        $.ui.dialog.maxZ += 1;
        self.uiDialog.css( "z-index", $.ui.dialog.maxZ );
        self.element.attr( saveScroll );
        self._trigger( "focus", event );

        return self;
    },

    open: function() {
        if ( this._isOpen ) {
            return;
        }

        var self = this,
            options = self.options,
            uiDialog = self.uiDialog;

        self.overlay = options.modal ? new $.ui.dialog.overlay( self) : null;
        self._size();
        self._position( options.position );
        uiDialog.animate( options.animate );
        self.moveToTop( true );

        // prevent tabbing out of modal dialogs
        if ( options.modal ) {
            uiDialog.bind( "keypress.dialog", function( event ) {
                if ( event.keyCode !== $.ui.keyCode.TAB ) {
                    return;
                }

                var tabbables = $( ":tabbable", this ),
                    first = tabbables.filter( ":first" ),
                    last  = tabbables.filter( ":last" );

                if ( event.target === last[0] && !event.shiftKey ) {
                    first.focus( 1 );
                    return false;
                } else if ( event.target === first[0] && event.shiftKey ) {
                    last.focus( 1 );
                    return false;
                }
            });
        }

        // set focus to the first tabbable element in the content area or the first button
        // if there are no tabbable elements, set focus on the dialog itself
        $( self.element.find( ":tabbable" ).get().concat(
            uiDialog.find( ".dialog-buttonpane :tabbable" ).get().concat(
                uiDialog.get() ) ) ).eq( 0 ).focus();

        self._isOpen = true;
        self._trigger( "open" );

        return self;
    },

    _createButtons: function( buttons ) {
        var self = this,
            hasButtons = false,
            uiDialogButtonPane = $( "<div>" )
                .addClass( "dialog-buttonpane content clearfix" ),
            uiButtonSet = $( "<div>" )
                .addClass( "dialog-buttonset" )
                .appendTo( uiDialogButtonPane );

        // if we already have a button pane, remove it
        self.uiDialog.find( ".dialog-buttonpane" ).remove();

        if ( typeof buttons === "object" && buttons !== null ) {
            $.each( buttons, function() {
                return !(hasButtons = true);
            });
        }
        if ( hasButtons ) {
            $.each( buttons, function( name, props ) {
                props = $.isFunction( props ) ?
                    { click: props, text: name } :
                    props;
                var button = $( "<button type='button'>" )
                    .attr( props, true )
                    .unbind( "click" )
                    .click(function() {
                        props.click.apply( self.element[0], arguments );
                    })
                    .appendTo( uiButtonSet );
                if ( $.fn.button ) {
                    button.button();
                }
            });
            self.uiDialog.addClass( "dialog-buttons" );
            uiDialogButtonPane.appendTo( self.uiDialog );
        } else {
            self.uiDialog.removeClass( "dialog-buttons" );
        }
    },

    _makeDraggable: function() {
        var self = this,
            options = self.options,
            doc = $( document ),
            heightBeforeDrag;

        function filteredUi( ui ) {
            return {
                position: ui.position,
                offset: ui.offset
            };
        }

        self.uiDialog.draggable({
            cancel: ".dialog-content, .dialog-titlebar-close",
            handle: ".dialog-titlebar",
            containment: "document",
            start: function( event, ui ) {
                heightBeforeDrag = options.height === "auto" ? "auto" : $( this ).height();
                $( this )
                    .height( $( this ).height() )
                    .addClass( "dialog-dragging" );
                self._trigger( "dragStart", event, filteredUi( ui ) );
            },
            drag: function( event, ui ) {
                self._trigger( "drag", event, filteredUi( ui ) );
            },
            stop: function( event, ui ) {
                options.position = [
                    ui.position.left - doc.scrollLeft(),
                    ui.position.top - doc.scrollTop()
                ];
                $( this )
                    .removeClass( "dialog-dragging" )
                    .height( heightBeforeDrag );
                self._trigger( "dragStop", event, filteredUi( ui ) );
                $.ui.dialog.overlay.resize();
            }
        });
    },

    _makeResizable: function( handles ) {
        handles = (handles === undefined ? this.options.resizable : handles);
        var self = this,
            options = self.options,
            // .resizable has position: relative defined in the stylesheet
            // but dialogs have to use absolute or fixed positioning
            position = self.uiDialog.css( "position" ),
            resizeHandles = typeof handles === 'string' ?
                handles	:
                "n,e,s,w,se,sw,ne,nw";

        function filteredUi( ui ) {
            return {
                originalPosition: ui.originalPosition,
                originalSize: ui.originalSize,
                position: ui.position,
                size: ui.size
            };
        }

        self.uiDialog.resizable({
            cancel: ".dialog-content",
            containment: "document",
            alsoResize: self.element,
            maxWidth: options.maxWidth,
            maxHeight: options.maxHeight,
            minWidth: options.minWidth,
            minHeight: self._minHeight(),
            handles: resizeHandles,
            start: function( event, ui ) {
                $( this ).addClass( "dialog-resizing" );
                self._trigger( "resizeStart", event, filteredUi( ui ) );
            },
            resize: function( event, ui ) {
                self._trigger( "resize", event, filteredUi( ui ) );
            },
            stop: function( event, ui ) {
                $( this ).removeClass( "dialog-resizing" );
                options.height = $( this ).height();
                options.width = $( this ).width();
                self._trigger( "resizeStop", event, filteredUi( ui ) );
                $.ui.dialog.overlay.resize();
            }
        })
        .css( "position", position )
        .find( ".resizable-se" )
            .addClass( "icon icon-grip-diagonal-se" );
    },

    _minHeight: function() {
        var options = this.options;

        if ( options.height === "auto" ) {
            return options.minHeight;
        } else {
            return Math.min( options.minHeight, options.height );
        }
    },

    _position: function( position ) {
        var myAt = [],
            offset = [ 0, 0 ],
            isVisible;

        if ( position ) {
            // deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
    //		if (typeof position == 'string' || $.isArray(position)) {
    //			myAt = $.isArray(position) ? position : position.split(' ');

            if ( typeof position === "string" || (typeof position === "object" && "0" in position ) ) {
                myAt = position.split ? position.split( " " ) : [ position[ 0 ], position[ 1 ] ];
                if ( myAt.length === 1 ) {
                    myAt[ 1 ] = myAt[ 0 ];
                }

                $.each( [ "left", "top" ], function( i, offsetPosition ) {
                    if ( +myAt[ i ] === myAt[ i ] ) {
                        offset[ i ] = myAt[ i ];
                        myAt[ i ] = offsetPosition;
                    }
                });

                position = {
                    my: myAt.join( " " ),
                    at: myAt.join( " " ),
                    offset: offset.join( " " )
                };
            }

            position = $.extend( {}, $.ui.dialog.prototype.options.position, position );
        } else {
            position = $.ui.dialog.prototype.options.position;
        }

        // need to show the dialog to get the actual offset in the position plugin
        isVisible = this.uiDialog.is( ":visible" );
        if ( !isVisible ) {
            this.uiDialog.show();
        }
        this.uiDialog.position( position );
        if ( !isVisible ) {
            this.uiDialog.hide();
        }
    },

    _setOptions: function( options ) {
        var self = this,
            resizableOptions = {},
            resize = false;

        $.each( options, function( key, value ) {
            self._setOption( key, value );

            if ( key in sizeRelatedOptions ) {
                resize = true;
            }
            if ( key in resizableRelatedOptions ) {
                resizableOptions[ key ] = value;
            }
        });

        if ( resize ) {
            this._size();
        }
        if ( this.uiDialog.is( ":data(resizable)" ) ) {
            this.uiDialog.resizable( "option", resizableOptions );
        }
    },

    _setOption: function( key, value ) {
        var self = this,
            uiDialog = self.uiDialog;

        switch ( key ) {
            case "buttons":
                self._createButtons( value );
                break;
            case "closeText":
                // ensure that we always pass a string
                self.uiDialogTitlebarCloseText.text( "" + value );
                break;
            case "dialogClass":
                uiDialog
                    .removeClass( self.options.dialogClass )
                    .addClass( uiDialogClasses + value );
                break;
            case "disabled":
                if ( value ) {
                    uiDialog.addClass( "dialog-disabled" );
                } else {
                    uiDialog.removeClass( "dialog-disabled" );
                }
                break;
            case "draggable":
                var isDraggable = uiDialog.is( ":data(draggable)" );
                if ( isDraggable && !value ) {
                    uiDialog.draggable( "destroy" );
                }

                if ( !isDraggable && value ) {
                    self._makeDraggable();
                }
                break;
            case "position":
                self._position( value );
                break;
            case "resizable":
                // currently resizable, becoming non-resizable
                var isResizable = uiDialog.is( ":data(resizable)" );
                if ( isResizable && !value ) {
                    uiDialog.resizable( "destroy" );
                }

                // currently resizable, changing handles
                if ( isResizable && typeof value === "string" ) {
                    uiDialog.resizable( "option", "handles", value );
                }

                // currently non-resizable, becoming resizable
                if ( !isResizable && value !== false ) {
                    self._makeResizable( value );
                }
                break;
            case "title":
                // convert whatever was passed in o a string, for html() to not throw up
                $( ".dialog-title", self.uiDialogTitlebar )
                    .html( "" + ( value || "&#160;" ) );
                break;
        }

        this._super( "_setOption", key, value );
    },

    _size: function() {
        /* If the user has resized the dialog, the .dialog and .dialog-content
         * divs will both have width and height set, so we need to reset them
         */
        var options = this.options,
            nonContentHeight,
            minContentHeight,
            isVisible = this.uiDialog.is( ":visible" );

        // reset content sizing
        this.element.show().css({
            width: "auto",
            minHeight: 0,
            height: 0
        });

        if ( options.minWidth > options.width ) {
            options.width = options.minWidth;
        }

        // reset wrapper sizing
        // determine the height of all the non-content elements
        nonContentHeight = this.uiDialog.css({
                height: "auto",
                width: options.width
            })
            .height();
        minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );

        if ( options.height === "auto" ) {
            // only needed for IE6 support
            if ( $.support.minHeight ) {
                this.element.css({
                    minHeight: minContentHeight,
                    height: "auto"
                });
            } else {
                this.uiDialog.show();
                var autoHeight = this.element.css( "height", "auto" ).height();
                if ( !isVisible ) {
                    this.uiDialog.hide();
                }
                this.element.height( Math.max( autoHeight, minContentHeight ) );
            }
        } else {
            this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
        }

        if (this.uiDialog.is( ":data(resizable)" ) ) {
            this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
        }
    }
});

$.extend($.ui.dialog, {
    version: "@VERSION",

    uuid: 0,
    maxZ: 0,

    getTitleId: function($el) {
        var id = $el.attr( "id" );
        if ( !id ) {
            this.uuid += 1;
            id = this.uuid;
        }
        return "dialog-title-" + id;
    },

    overlay: function( dialog ) {
        this.$el = $.ui.dialog.overlay.create( dialog );
    }
});

$.extend( $.ui.dialog.overlay, {
    instances: [],
    // reuse old instances due to IE memory leak with alpha transparency (see #5185)
    oldInstances: [],
    maxZ: 0,
    events: $.map(
        "focus,mousedown,mouseup,keydown,keypress,click".split( "," ),
        function( event ) {
            return event + ".dialog-overlay";
        }
    ).join( " " ),
    create: function( dialog ) {
        if ( this.instances.length === 0 ) {
            // prevent use of anchors and inputs
            // we use a setTimeout in case the overlay is created from an
            // event that we're going to be cancelling (see #2804)
            setTimeout(function() {
                // handle $(el).dialog().dialog('close') (see #4065)
                if ( $.ui.dialog.overlay.instances.length ) {
                    $( document ).bind( $.ui.dialog.overlay.events, function( event ) {
                        // stop events if the z-index of the target is < the z-index of the overlay
                        // we cannot return true when we don't want to cancel the event (#3523)
                        if ( $( event.target ).zIndex() < $.ui.dialog.overlay.maxZ ) {
                            return false;
                        }
                    });
                }
            }, 1 );

            // allow closing by pressing the escape key
            $( document ).bind( "keydown.dialog-overlay", function( event ) {
                if ( dialog.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
                    event.keyCode === $.ui.keyCode.ESCAPE ) {

                    dialog.close( event );
                    event.preventDefault();
                }
            });

            // handle window resize
            $( window ).bind( "resize.dialog-overlay", $.ui.dialog.overlay.resize );
        }

        var $el = ( this.oldInstances.pop() || $( "<div>" ).addClass( "overlay" ) )
            .appendTo( document.body )
            .css({
                width: this.width(),
                height: this.height()
            });

        if ( $.fn.bgiframe ) {
            $el.bgiframe();
        }

        this.instances.push( $el );
        return $el;
    },

    destroy: function( $el ) {
        var indexOf = $.inArray( $el, this.instances );
        if ( indexOf !== -1 ) {
            this.oldInstances.push( this.instances.splice( indexOf, 1 )[ 0 ] );
        }

        if ( this.instances.length === 0 ) {
            $( [ document, window ] ).unbind( ".dialog-overlay" );
        }

        $el.remove();

        // adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
        var maxZ = 0;
        $.each( this.instances, function() {
            maxZ = Math.max( maxZ, this.css( "z-index" ) );
        });
        this.maxZ = maxZ;
    },

    height: function() {
        var scrollHeight,
            offsetHeight;
        // handle IE 6
        if ( $.browser.msie && $.browser.version < 7 ) {
            scrollHeight = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight
            );
            offsetHeight = Math.max(
                document.documentElement.offsetHeight,
                document.body.offsetHeight
            );

            if ( scrollHeight < offsetHeight ) {
                return $( window ).height() + "px";
            } else {
                return scrollHeight + "px";
            }
        // handle "good" browsers
        } else {
            return $( document ).height() + "px";
        }
    },

    width: function() {
        var scrollWidth,
            offsetWidth;
        // handle IE 6
        if ( $.browser.msie && $.browser.version < 7 ) {
            scrollWidth = Math.max(
                document.documentElement.scrollWidth,
                document.body.scrollWidth
            );
            offsetWidth = Math.max(
                document.documentElement.offsetWidth,
                document.body.offsetWidth
            );

            if ( scrollWidth < offsetWidth ) {
                return $( window ).width() + "px";
            } else {
                return scrollWidth + "px";
            }
        // handle "good" browsers
        } else {
            return $( document ).width() + "px";
        }
    },

    resize: function() {
        /* If the dialog is draggable and the user drags it past the
         * right edge of the window, the document becomes wider so we
         * need to stretch the overlay. If the user then drags the
         * dialog back to the left, the document will become narrower,
         * so we need to shrink the overlay to the appropriate size.
         * This is handled by shrinking the overlay before setting it
         * to the full document size.
         */
        var $overlays = $( [] );
        $.each( $.ui.dialog.overlay.instances, function() {
            $overlays = $overlays.add( this );
        });

        $overlays.css({
            width: 0,
            height: 0
        }).css({
            width: $.ui.dialog.overlay.width(),
            height: $.ui.dialog.overlay.height()
        });
    }
});

$.extend( $.ui.dialog.overlay.prototype, {
    destroy: function() {
        $.ui.dialog.overlay.destroy( this.$el );
    }
});

}( jQuery ) );
$(document).ready(function() {
  $('.moresearch').toggle(function(){
    $('a',(this)).text("- Rút gọn tiêu chí tìm kiếm").addClass('showless');
    $('#right-more').show();
    $('#right-more').animate({ 'height': $('#right-more').data('maxheight') });
  }, function(){
    $('a',(this)).text("+ Mở rộng tiêu chí tìm kiếm").removeClass('showless');
    $('#right-more').hide();
    $('#right-more').animate({ 'height': $('#right-more').data('height') });
  });
  $('.buttonthongtinlienhe a').click(function(){
    $('.thongtinlienhe').show();
    $('.buttonthongtinlienhe').hide();
  })
  $('.morongtimkiem').toggle(function(){
    $(this).text("- Rút gọn tiêu chí tìm kiếm").addClass('showless');
    $('#search-more').show();
    $('#search-more').animate({ 'height': $('#search-more').data('maxheight') });
  }, function(){
    $(this).text("+ Mở rộng tiêu chí tìm kiếm").removeClass('showless');
    $('#search-more').hide();
    $('#search-more').animate({ 'height': $('#search-more').data('height') });
  });
  $(".multi-checklist").multiDrop();
  $('.multiselect').multiselect2side({
    selectedPosition: 'right',
    moveOptions: false,
    labelsx: '',
    labeldx: '',
    autoSort: false,
    autoSortAvailable: true
  });
});

/*
 * multiselect2side jQuery plugin
 *
 * Copyright (c) 2010 Giovanni Casassa (senamion.com - senamion.it)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://www.senamion.com
 *
 */


(function($)
{
    // SORT INTERNAL
    function internalSort(a, b) {
        var compA = $(a).text().toUpperCase();
        var compB = $(b).text().toUpperCase();
        return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    };

    var methods = {
        init : function(options) {
            var o = {
                selectedPosition: 'right',
                moveOptions: true,
                labelTop: 'Top',
                labelBottom: 'Bottom',
                labelUp: 'Up',
                labelDown: 'Down',
                labelSort: 'Sort',
                labelsx: 'Available',
                labeldx: 'Selected',
                maxSelected: -1,
                autoSort: false,
                autoSortAvailable: false,
                search: false,
                caseSensitive: false,
                delay: 200,
                optGroupSearch: false,
                minSize: 6
            };

            return this.each(function () {
                var	el = $(this);
                var data = el.data('multiselect2side');

                if (options)
                    $.extend(o, options);

                if (!data)
                    el.data('multiselect2side', o);

                var	originalName = $(this).attr("name");
                if (originalName.indexOf('[') != -1)
                    originalName = originalName.substring(0, originalName.indexOf('['));

                var	nameDx = originalName + "ms2side__dx";
                var	nameSx = originalName + "ms2side__sx";
                var size = $(this).attr("size");
                // SIZE MIN
                if (size < o.minSize) {
                    $(this).attr("size", "" + o.minSize);
                    size = o.minSize;
                }

                // UP AND DOWN
                var divUpDown =
                        "<div class='ms2side__updown'>" +
                            "<p class='SelSort' title='Sort'>" + o.labelSort + "</p>" +
                            "<p class='MoveTop' title='Move on top selected option'>" + o.labelTop + "</p>" +
                            "<p class='MoveUp' title='Move up selected option'>" + o.labelUp + "</p>" +
                            "<p class='MoveDown' title='Move down selected option'>" + o.labelDown + "</p>" +
                            "<p class='MoveBottom' title='Move on bottom selected option'>" + o.labelBottom + "</p>" +
                        "</div>";

                // INPUT TEXT FOR SEARCH OPTION
                var	leftSearch = false, rightSearch = false;
                // BOTH SEARCH AND OPTGROUP SEARCH
                if (o.search != false && o.optGroupSearch != false) {
                    var ss =
                        o.optGroupSearch + "<select class='small' ><option value=__null__> </option></select> " +
                        o.search + "<input class='small' type='text' /><a href='#'> </a>";

                    if (o.selectedPosition == 'right')
                        leftSearch = ss;
                    else
                        rightSearch = ss;
                }
                else if (o.search != false) {
                    var	ss = o.search + "<input type='text' /><a href='#'> </a>";

                    if (o.selectedPosition == 'right')
                        leftSearch = ss;
                    else
                        rightSearch = ss;
                }
                else if (o.optGroupSearch != false) {
                    var	ss = o.optGroupSearch + "<select><option value=__null__> </option></select>";

                    if (o.selectedPosition == 'right')
                        leftSearch = ss;
                    else
                        rightSearch = ss;
                }

                // CREATE NEW ELEMENT (AND HIDE IT) AFTER THE HIDDED ORGINAL SELECT
                var htmlToAdd =
                    "<div class='ms2side__div'>" +
                            ((o.selectedPosition != 'right' && o.moveOptions) ? divUpDown : "") +
                        "<div class='ms2side__select'>" +
                            ((o.labelsx || leftSearch != false) ? ("<div class='ms2side__header'>" + (leftSearch != false ? leftSearch : o.labelsx) + "</div>") : "") +
                            "<select title='" + o.labelsx + "' name='" + nameSx + "' id='" + nameSx + "' size='" + size + "' multiple='multiple' ></select>" +
                        "</div>" +
                        "<div class='ms2side__options'>" +
                            ((o.selectedPosition == 'right')
                            ?
                            ("<p class='AddOne' title='Add Selected'>&rsaquo;</p>" +
                            "<p class='RemoveOne' title='Remove Selected'>&lsaquo;</p>")
                            :
                            ("<p class='AddOne' title='Add Selected'>&lsaquo;</p>" +
                            "<p class='RemoveOne' title='Remove Selected'>&rsaquo;</p>" )
                            ) +
                        "</div>" +
                        "<div class='ms2side__select'>" +
                            ((o.labeldx || rightSearch != false) ? ("<div class='ms2side__header'>" + (rightSearch != false ? rightSearch : o.labeldx) + "</div>") : "") +
                            "<select title='" + o.labeldx + "' name='" + nameDx + "' id='" + nameDx + "' size='" + size + "' multiple='multiple' ></select>" +
                        "</div>" +
                        ((o.selectedPosition == 'right' && o.moveOptions) ? divUpDown : "") +
                    "</div>";
                el.after(htmlToAdd).hide();

                // ELEMENTS
                var allSel = el.next().children(".ms2side__select").children("select");
                var	leftSel = (o.selectedPosition == 'right') ? allSel.eq(0) : allSel.eq(1);
                var	rightSel = (o.selectedPosition == 'right') ? allSel.eq(1) : allSel.eq(0);
                // HEIGHT DIV
                var	heightDiv = $(".ms2side__select").eq(0).height();

                // SELECT optgroup
                var searchSelect = $();

                // SEARCH INPUT
                var searchInput = $(this).next().find("input:text");
                var	removeFilter = searchInput.next().hide();
                var	toid = false;
                var searchV = false;


                // SELECT optgroup - ADD ALL OPTGROUP AS OPTION
                if (o.optGroupSearch != false) {
                    var	lastOptGroupSearch = false;

                    searchSelect = $(this).next().find("select").eq(0);

                    el.children("optgroup").each(function() {
                        if (searchSelect.find("[value='" + $(this).attr("label") + "']").size() == 0)
                            searchSelect.append("<option value='" + $(this).attr("label") + "'>" + $(this).attr("label") + "</option>");
                    });
                    searchSelect.change(function() {
                        var	sEl = $(this);

                        if (sEl.val() != lastOptGroupSearch) {

                            // IF EXIST SET SEARCH TEXT TO VOID
                            if (searchInput.val() != "") {
                                clearTimeout(toid);
                                removeFilter.hide();
                                searchInput.val("");//.trigger('keyup');
                                searchV = "";
                                // fto();
                            }

                            setTimeout(function() {
                                if (sEl.val() == "__null__") {
                                    els = el.find("option:not(:selected)");
                                }
                                else
                                    els = el.find("optgroup[label='" + sEl.val() + "']").children("option:not(:selected)");

                                // REMOVE ORIGINAL ELEMENTS AND ADD OPTION OF OPTGROUP SELECTED
                                leftSel.find("option").remove();
                                els.each(function() {
                                    leftSel.append($(this).clone());
                                });
                                lastOptGroupSearch = sEl.val();
                                leftSel.trigger('change');
                            }, 100);
                        }
                    });
                }


                // SEARCH FUNCTION
                var	fto = function() {
                    var	els = leftSel.children();
                    var	toSearch = el.find("option:not(:selected)");

                    // RESET OptGroupSearch
                    lastOptGroupSearch = "__null__";
                    searchSelect.val("__null__");

                    if (searchV == searchInput.val())
                        return;

                    searchInput
                        .addClass("wait")
                        .removeAttr("style");

                    searchV = searchInput.val();

                    // A LITTLE TIMEOUT TO VIEW WAIT CLASS ON INPUT ON IE
                    setTimeout(function() {
                        leftSel.children().remove();
                        if (searchV == "") {
                            toSearch.clone().appendTo(leftSel).removeAttr("selected");
                            removeFilter.hide();
                        }
                        else {
                            toSearch.each(function() {
                                var	myText = $(this).text();

                                if (o.caseSensitive)
                                    find = myText.indexOf(searchV);
                                else
                                    find = myText.toUpperCase().indexOf(searchV.toUpperCase());

                                if (find != -1)
                                    $(this).clone().appendTo(leftSel).removeAttr("selected");
                            });

                            if (leftSel.children().length == 0)
                                searchInput.css({'border': '1px red solid'});

                            removeFilter.show();
                            leftSel.trigger('change');
                        }
                        leftSel.trigger('change');
                        searchInput.removeClass("wait");
                    }, 5);
                };


                // REMOVE FILTER ON SEARCH FUNCTION
                removeFilter.click(function() {
                    clearTimeout(toid);
                    searchInput.val("");
                    fto();
                    return false;
                });

                // ON CHANGE TEXT INPUT
                searchInput.keyup(function() {
                    clearTimeout(toid);
                    toid = setTimeout(fto, o.delay);
                });


                // CENTER MOVE OPTIONS AND UPDOWN OPTIONS
                $(this).next().find('.ms2side__options, .ms2side__updown').each(function(){
                    var	top = ((heightDiv/2) - ($(this).height()/2));
                    if (top > 0)
                        $(this).css('padding-top',  top + 'px' );
                })

                // MOVE SELECTED OPTION TO RIGHT, NOT SELECTED TO LEFT
                $(this).find("option:selected").clone().appendTo(rightSel); // .removeAttr("selected");
                $(this).find("option:not(:selected)").clone().appendTo(leftSel);

                // SELECT FIRST LEFT ITEM AND DESELECT IN RIGHT (NOT IN IE6)
                if (!($.browser.msie && $.browser.version == '6.0')) {
                    leftSel.find("option").eq(0).attr("selected", true);
                    rightSel.children().removeAttr("selected");
                }

                // ON CHANGE SORT SELECTED OPTIONS
                var	nLastAutosort = 0;
                if (o.autoSort)
                    allSel.change(function() {
                        var	selectDx = rightSel.find("option");

                        if (selectDx.length != nLastAutosort) {
                            // SORT SELECTED ELEMENT
                            selectDx.sort(internalSort);
                            // FIRST REMOVE FROM ORIGINAL SELECT
                            el.find("option:selected").remove();
                            // AFTER ADD ON ORIGINAL AND RIGHT SELECT
                            selectDx.each(function() {
                                rightSel.append($(this).clone());
                                $(this).appendTo(el).attr("selected", true);
                                //el.append($(this).attr("selected", true));		HACK IE6
                            });
                            nLastAutosort = selectDx.length;
                        }
                    });

                // ON CHANGE SORT AVAILABLE OPTIONS (NOT NECESSARY IN ORIGINAL SELECT)
                var	nLastAutosortAvailable = 0;
                if (o.autoSortAvailable)
                    allSel.change(function() {
                        var	selectSx = leftSel.find("option");

                        if (selectSx.length != nLastAutosortAvailable) {
                            // SORT SELECTED ELEMENT
                            selectSx.sort(internalSort);
                            // REMOVE ORIGINAL ELEMENTS AND ADD SORTED
                            leftSel.find("option").remove();
                            selectSx.each(function() {
                                leftSel.append($(this).clone());
                            });
                            nLastAutosortAvailable = selectSx.length;
                        }
                    });

                // ON CHANGE REFRESH ALL BUTTON STATUS
                allSel.change(function() {
                    // HACK FOR IE6 (SHOW AND HIDE ORIGINAL SELECT)
                    if ($.browser.msie && $.browser.version == '6.0')
                        el.show().hide();
                    var	div = $(this).parent().parent();
                    var	selectSx = leftSel.children();
                    var	selectDx = rightSel.children();
                    var	selectedSx = leftSel.find("option:selected");
                    var	selectedDx = rightSel.find("option:selected");

                    if (selectedSx.size() == 0 ||
                            (o.maxSelected >= 0 && (selectedSx.size() + selectDx.size()) > o.maxSelected))
                        div.find(".AddOne").addClass('ms2side__hide');
                    else
                        div.find(".AddOne").removeClass('ms2side__hide');

                    // FIRST HIDE ALL
                    div.find(".RemoveOne, .MoveUp, .MoveDown, .MoveTop, .MoveBottom, .SelSort").addClass('ms2side__hide');
                    if (selectDx.size() > 1)
                        div.find(".SelSort").removeClass('ms2side__hide');
                    if (selectedDx.size() > 0) {
                        div.find(".RemoveOne").removeClass('ms2side__hide');
                        // ALL SELECTED - NO MOVE
                        if (selectedDx.size() < selectDx.size()) {	// FOR NOW (JOE) && selectedDx.size() == 1
                            if (selectedDx.val() != selectDx.val())	// FIRST OPTION, NO UP AND TOP BUTTON
                                div.find(".MoveUp, .MoveTop").removeClass('ms2side__hide');
                            if (selectedDx.last().val() != selectDx.last().val())	// LAST OPTION, NO DOWN AND BOTTOM BUTTON
                                div.find(".MoveDown, .MoveBottom").removeClass('ms2side__hide');
                        }
                    }

                    if (selectSx.size() == 0 ||
                            (o.maxSelected >= 0 && selectSx.size() >= o.maxSelected))
                        div.find(".AddAll").addClass('ms2side__hide');
                    else
                        div.find(".AddAll").removeClass('ms2side__hide');

                    if (selectDx.size() == 0)
                        div.find(".RemoveAll").addClass('ms2side__hide');
                    else
                        div.find(".RemoveAll").removeClass('ms2side__hide');
                });

                // DOUBLE CLICK ON LEFT SELECT OPTION
                leftSel.dblclick(function () {
                    $(this).find("option:selected").each(function(i, selected){

                        if (o.maxSelected < 0 || rightSel.children().size() < o.maxSelected) {
                            $(this).remove().appendTo(rightSel);
                            el.find("[value='" + $(selected).val() + "']").remove().appendTo(el).attr("selected", true);
                        }
                    });
                    $(this).trigger('change');
                });

                // DOUBLE CLICK ON RIGHT SELECT OPTION
                rightSel.dblclick(function () {
                    $(this).find("option:selected").each(function(i, selected){
                        $(this).remove().appendTo(leftSel);
                        el.find("[value='" + $(selected).val() + "']").removeAttr("selected").remove().appendTo(el);
                    });
                    $(this).trigger('change');

                    // TRIGGER CHANGE AND VALUE NULL FORM OPTGROUP SEARCH (IF EXIST)
                    searchSelect.val("__null__").trigger("change");
                    // TRIGGER CLICK ON REMOVE FILTER (IF EXIST)
                    removeFilter.click();
                });

                // CLICK ON OPTION
                $(this).next().find('.ms2side__options').children().click(function () {
                    if (!$(this).hasClass("ms2side__hide")) {
                        if ($(this).hasClass("AddOne")) {
                            leftSel.find("option:selected").each(function(i, selected){
                                $(this).remove().appendTo(rightSel);
                                el.find("[value='" + $(selected).val() + "']").remove().appendTo(el).attr("selected", true);
                            });
                        }
                        else if ($(this).hasClass("AddAll")) {	// ALL SELECTED
                            // TEST IF HAVE A FILTER OR A SELECT OPTGROUP
                            if (removeFilter.is(":visible") || (searchSelect.length > 0 && searchSelect.val() != "__null__"))
                                leftSel.children().each(function(i, selected){
                                    $(this).remove().appendTo(rightSel);
                                    el.find("[value='" + $(selected).val() + "']").remove().appendTo(el).attr("selected", true);
                                });
                            else {
                                leftSel.children().remove().appendTo(rightSel);
                                el.find('option').attr("selected", true);
                                // el.children().attr("selected", true); -- PROBLEM WITH OPTGROUP
                            }
                        }
                        else if ($(this).hasClass("RemoveOne")) {
                            rightSel.find("option:selected").each(function(i, selected){
                                $(this).remove().appendTo(leftSel);
                                el.find("[value='" + $(selected).val() + "']").remove().appendTo(el).removeAttr("selected");
                            });
                            // TRIGGER CLICK ON REMOVE FILTER (IF EXIST)
                            removeFilter.click();
                            // TRIGGER CHANGE AND VALUE NULL FORM OPTGROUP SEARCH (IF EXIST)
                            searchSelect.val("__null__").trigger("change");
                        }
                        else if ($(this).hasClass("RemoveAll")) {	// ALL REMOVED
                            rightSel.children().appendTo(leftSel);
                            rightSel.children().remove();
                            el.find('option').removeAttr("selected");
                            //el.children().removeAttr("selected"); -- PROBLEM WITH OPTGROUP
                            // TRIGGER CLICK ON REMOVE FILTER (IF EXIST)
                            removeFilter.click();
                            // TRIGGER CHANGE AND VALUE NULL FORM OPTGROUP SEARCH (IF EXIST)
                            searchSelect.val("__null__").trigger("change");
                        }
                    }

                    leftSel.trigger('change');
                });

                // CLICK ON UP - DOWN
                $(this).next().find('.ms2side__updown').children().click(function () {
                    var	selectedDx = rightSel.find("option:selected");
                    var	selectDx = rightSel.find("option");

                    if (!$(this).hasClass("ms2side__hide")) {
                        if ($(this).hasClass("SelSort")) {
                            // SORT SELECTED ELEMENT
                            selectDx.sort(internalSort);
                            // FIRST REMOVE FROM ORIGINAL SELECT
                            el.find("option:selected").remove();
                            // AFTER ADD ON ORIGINAL AND RIGHT SELECT
                            selectDx.each(function() {
                                rightSel.append($(this).clone().attr("selected", true));
                                el.append($(this).attr("selected", true));
                            });
                        }
                        else if ($(this).hasClass("MoveUp")) {
                            var	prev = selectedDx.first().prev();
                            var	hPrev = el.find("[value='" + prev.val() + "']");

                            selectedDx.each(function() {
                                $(this).insertBefore(prev);
                                el.find("[value='" + $(this).val() + "']").insertBefore(hPrev);	// HIDDEN SELECT
                            });
                        }
                        else if ($(this).hasClass("MoveDown")) {
                            var	next = selectedDx.last().next();
                            var	hNext = el.find("[value='" + next.val() + "']");

                            selectedDx.each(function() {
                                $(this).insertAfter(next);
                                el.find("[value='" + $(this).val() + "']").insertAfter(hNext);	// HIDDEN SELECT
                            });
                        }
                        else if ($(this).hasClass("MoveTop")) {
                            var	first = selectDx.first();
                            var	hFirst = el.find("[value='" + first.val() + "']");

                            selectedDx.each(function() {
                                $(this).insertBefore(first);
                                el.find("[value='" + $(this).val() + "']").insertBefore(hFirst);	// HIDDEN SELECT
                            });
                        }
                        else if ($(this).hasClass("MoveBottom")) {
                            var	last = selectDx.last();
                            var	hLast = el.find("[value='" + last.val() + "']");

                            selectedDx.each(function() {
                                last = $(this).insertAfter(last);	// WITH last = SAME POSITION OF SELECTED OPTION AFTER MOVE
                                hLast = el.find("[value='" + $(this).val() + "']").insertAfter(hLast);	// HIDDEN SELECT
                            });
                        }
                    }

                    leftSel.trigger('change');
                });

                // HOVER ON OPTION
                $(this).next().find('.ms2side__options, .ms2side__updown').children().hover(
                    function () {
                        $(this).addClass('ms2side_hover');
                    },
                    function () {
                        $(this).removeClass('ms2side_hover');
                    }
                );

                // UPDATE BUTTON ON START
                leftSel.trigger('change');
                // SHOW WHEN ALL READY
                $(this).next().show();
            });
        },
        destroy : function( ) {
            return this.each(function () {
                var	el = $(this);
                var data = el.data('multiselect2side');

                if (!data)
                    return;

                el.show().next().remove();
            });
        },
        addOption : function(options) {
            var oAddOption = {
                name: false,
                value: false,
                selected: false
            };

            return this.each(function () {
                var	el = $(this);
                var data = el.data('multiselect2side');

                if (!data)
                    return;

                if (options)
                    $.extend(oAddOption, options);

                var	strEl = "<option value='" + oAddOption.value + "' " + (oAddOption.selected ? "selected" : "") + " >" + oAddOption.name + "</option>";

                el.append(strEl);

                // ELEMENTS
                var allSel = el.next().children(".ms2side__select").children("select");
                var	leftSel = (data.selectedPosition == 'right') ? allSel.eq(0) : allSel.eq(1);
                var	rightSel = (data.selectedPosition == 'right') ? allSel.eq(1) : allSel.eq(0);

                if (oAddOption.selected)
                    rightSel.append(strEl).trigger('change');
                else
                    leftSel.append(strEl).trigger('change');
            });
        }
    };

  $.fn.multiselect2side = function( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.multiselect2side' );
    }
  };

})(jQuery);
/*!
 * jQuery Form Plugin
 * version: 3.09 (16-APR-2012)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses:
 *    http://malsup.github.com/mit-license.txt
 *    http://malsup.github.com/gpl-license-v2.txt
 */
/*global ActiveXObject alert */

;(function($) {
"use strict";

/*
    Usage Note:
    -----------
    Do not use both ajaxSubmit and ajaxForm on the same form.  These
    functions are mutually exclusive.  Use ajaxSubmit if you want
    to bind your own submit handler to the form.  For example,

    $(document).ready(function() {
        $('#myForm').on('submit', function(e) {
            e.preventDefault(); // <-- important
            $(this).ajaxSubmit({
                target: '#output'
            });
        });
    });

    Use ajaxForm when you want the plugin to manage all the event binding
    for you.  For example,

    $(document).ready(function() {
        $('#myForm').ajaxForm({
            target: '#output'
        });
    });

    You can also use ajaxForm with delegation (requires jQuery v1.7+), so the
    form does not have to exist when you invoke ajaxForm:

    $('#myForm').ajaxForm({
        delegation: true,
        target: '#output'
    });

    When using ajaxForm, the ajaxSubmit function will be invoked for you
    at the appropriate time.
*/

/**
 * Feature detection
 */
var feature = {};
feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
feature.formdata = window.FormData !== undefined;

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
    /*jshint scripturl:true */

    // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
    if (!this.length) {
        log('ajaxSubmit: skipping submit process - no element selected');
        return this;
    }

    var method, action, url, $form = this;

    if (typeof options == 'function') {
        options = { success: options };
    }

    method = this.attr('method');
    action = this.attr('action');
    url = (typeof action === 'string') ? $.trim(action) : '';
    url = url || window.location.href || '';
    if (url) {
        // clean url (don't include hash vaue)
        url = (url.match(/^([^#]+)/)||[])[1];
    }

    options = $.extend(true, {
        url:  url,
        success: $.ajaxSettings.success,
        type: method || 'GET',
        iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
    }, options);

    // hook for manipulating the form data before it is extracted;
    // convenient for use with rich editors like tinyMCE or FCKEditor
    var veto = {};
    this.trigger('form-pre-serialize', [this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
        return this;
    }

    // provide opportunity to alter form data before it is serialized
    if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSerialize callback');
        return this;
    }

    var traditional = options.traditional;
    if ( traditional === undefined ) {
        traditional = $.ajaxSettings.traditional;
    }

    var elements = [];
    var qx, a = this.formToArray(options.semantic, elements);
    if (options.data) {
        options.extraData = options.data;
        qx = $.param(options.data, traditional);
    }

    // give pre-submit callback an opportunity to abort the submit
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSubmit callback');
        return this;
    }

    // fire vetoable 'validate' event
    this.trigger('form-submit-validate', [a, this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
        return this;
    }

    var q = $.param(a, traditional);
    if (qx) {
        q = ( q ? (q + '&' + qx) : qx );
    }
    if (options.type.toUpperCase() == 'GET') {
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
        options.data = null;  // data is null for 'get'
    }
    else {
        options.data = q; // data is the query string for 'post'
    }

    var callbacks = [];
    if (options.resetForm) {
        callbacks.push(function() { $form.resetForm(); });
    }
    if (options.clearForm) {
        callbacks.push(function() { $form.clearForm(options.includeHidden); });
    }

    // perform a load on the target only if dataType is not provided
    if (!options.dataType && options.target) {
        var oldSuccess = options.success || function(){};
        callbacks.push(function(data) {
            var fn = options.replaceTarget ? 'replaceWith' : 'html';
            $(options.target)[fn](data).each(oldSuccess, arguments);
        });
    }
    else if (options.success) {
        callbacks.push(options.success);
    }

    options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
        var context = options.context || options;    // jQuery 1.4+ supports scope context
        for (var i=0, max=callbacks.length; i < max; i++) {
            callbacks[i].apply(context, [data, status, xhr || $form, $form]);
        }
    };

    // are there files to upload?
    var fileInputs = $('input:file:enabled[value]', this); // [value] (issue #113)
    var hasFileInputs = fileInputs.length > 0;
    var mp = 'multipart/form-data';
    var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

    var fileAPI = feature.fileapi && feature.formdata;
    log("fileAPI :" + fileAPI);
    var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;

    // options.iframe allows user to force iframe mode
    // 06-NOV-09: now defaulting to iframe mode if file input is detected
    if (options.iframe !== false && (options.iframe || shouldUseFrame)) {
        // hack to fix Safari hang (thanks to Tim Molendijk for this)
        // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
        if (options.closeKeepAlive) {
            $.get(options.closeKeepAlive, function() {
                fileUploadIframe(a);
            });
        }
          else {
            fileUploadIframe(a);
          }
    }
    else if ((hasFileInputs || multipart) && fileAPI) {
        fileUploadXhr(a);
    }
    else {
        $.ajax(options);
    }

    // clear element array
    for (var k=0; k < elements.length; k++)
        elements[k] = null;

    // fire 'notify' event
    this.trigger('form-submit-notify', [this, options]);
    return this;

     // XMLHttpRequest Level 2 file uploads (big hat tip to francois2metz)
    function fileUploadXhr(a) {
        var formdata = new FormData();

        for (var i=0; i < a.length; i++) {
            formdata.append(a[i].name, a[i].value);
        }

        if (options.extraData) {
            for (var p in options.extraData)
                if (options.extraData.hasOwnProperty(p))
                    formdata.append(p, options.extraData[p]);
        }

        options.data = null;

        var s = $.extend(true, {}, $.ajaxSettings, options, {
            contentType: false,
            processData: false,
            cache: false,
            type: 'POST'
        });

        if (options.uploadProgress) {
            // workaround because jqXHR does not expose upload property
            s.xhr = function() {
                var xhr = jQuery.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.onprogress = function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position; /*event.position is deprecated*/
                        var total = event.total;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        options.uploadProgress(event, position, total, percent);
                    };
                }
                return xhr;
            };
        }

        s.data = null;
          var beforeSend = s.beforeSend;
          s.beforeSend = function(xhr, o) {
              o.data = formdata;
            if(beforeSend)
                beforeSend.call(o, xhr, options);
        };
        $.ajax(s);
    }

    // private function for handling file uploads (hat tip to YAHOO!)
    function fileUploadIframe(a) {
        var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
        var useProp = !!$.fn.prop;

        if ($(':input[name=submit],:input[id=submit]', form).length) {
            // if there is an input with a name or id of 'submit' then we won't be
            // able to invoke the submit fn on the form (at least not x-browser)
            alert('Error: Form elements must not have name or id of "submit".');
            return;
        }

        if (a) {
            // ensure that every serialized input is still enabled
            for (i=0; i < elements.length; i++) {
                el = $(elements[i]);
                if ( useProp )
                    el.prop('disabled', false);
                else
                    el.removeAttr('disabled');
            }
        }

        s = $.extend(true, {}, $.ajaxSettings, options);
        s.context = s.context || s;
        id = 'jqFormIO' + (new Date().getTime());
        if (s.iframeTarget) {
            $io = $(s.iframeTarget);
            n = $io.attr('name');
            if (!n)
                 $io.attr('name', id);
            else
                id = n;
        }
        else {
            $io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" />');
            $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
        }
        io = $io[0];


        xhr = { // mock object
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function() {},
            getResponseHeader: function() {},
            setRequestHeader: function() {},
            abort: function(status) {
                var e = (status === 'timeout' ? 'timeout' : 'aborted');
                log('aborting upload... ' + e);
                this.aborted = 1;
                $io.attr('src', s.iframeSrc); // abort op in progress
                xhr.error = e;
                if (s.error)
                    s.error.call(s.context, xhr, e, status);
                if (g)
                    $.event.trigger("ajaxError", [xhr, s, e]);
                if (s.complete)
                    s.complete.call(s.context, xhr, e);
            }
        };

        g = s.global;
        // trigger ajax global events so that activity/block indicators work like normal
        if (g && 0 === $.active++) {
            $.event.trigger("ajaxStart");
        }
        if (g) {
            $.event.trigger("ajaxSend", [xhr, s]);
        }

        if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
            if (s.global) {
                $.active--;
            }
            return;
        }
        if (xhr.aborted) {
            return;
        }

        // add submitting element to data if we know it
        sub = form.clk;
        if (sub) {
            n = sub.name;
            if (n && !sub.disabled) {
                s.extraData = s.extraData || {};
                s.extraData[n] = sub.value;
                if (sub.type == "image") {
                    s.extraData[n+'.x'] = form.clk_x;
                    s.extraData[n+'.y'] = form.clk_y;
                }
            }
        }

        var CLIENT_TIMEOUT_ABORT = 1;
        var SERVER_ABORT = 2;

        function getDoc(frame) {
            var doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
            return doc;
        }

        // Rails CSRF hack (thanks to Yvan Barthelemy)
        var csrf_token = $('meta[name=csrf-token]').attr('content');
        var csrf_param = $('meta[name=csrf-param]').attr('content');
        if (csrf_param && csrf_token) {
            s.extraData = s.extraData || {};
            s.extraData[csrf_param] = csrf_token;
        }

        // take a breath so that pending repaints get some cpu time before the upload starts
        function doSubmit() {
            // make sure form attrs are set
            var t = $form.attr('target'), a = $form.attr('action');

            // update form attrs in IE friendly way
            form.setAttribute('target',id);
            if (!method) {
                form.setAttribute('method', 'POST');
            }
            if (a != s.url) {
                form.setAttribute('action', s.url);
            }

            // ie borks in some cases when setting encoding
            if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
                $form.attr({
                    encoding: 'multipart/form-data',
                    enctype:  'multipart/form-data'
                });
            }

            // support timout
            if (s.timeout) {
                timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
            }

            // look for server aborts
            function checkState() {
                try {
                    var state = getDoc(io).readyState;
                    log('state = ' + state);
                    if (state && state.toLowerCase() == 'uninitialized')
                        setTimeout(checkState,50);
                }
                catch(e) {
                    log('Server abort: ' , e, ' (', e.name, ')');
                    cb(SERVER_ABORT);
                    if (timeoutHandle)
                        clearTimeout(timeoutHandle);
                    timeoutHandle = undefined;
                }
            }

            // add "extra" data to form if provided in options
            var extraInputs = [];
            try {
                if (s.extraData) {
                    for (var n in s.extraData) {
                        if (s.extraData.hasOwnProperty(n)) {
                            extraInputs.push(
                                $('<input type="hidden" name="'+n+'">').attr('value',s.extraData[n])
                                    .appendTo(form)[0]);
                        }
                    }
                }

                if (!s.iframeTarget) {
                    // add iframe to doc and submit the form
                    $io.appendTo('body');
                    if (io.attachEvent)
                        io.attachEvent('onload', cb);
                    else
                        io.addEventListener('load', cb, false);
                }
                setTimeout(checkState,15);
                form.submit();
            }
            finally {
                // reset attrs and remove "extra" input elements
                form.setAttribute('action',a);
                if(t) {
                    form.setAttribute('target', t);
                } else {
                    $form.removeAttr('target');
                }
                $(extraInputs).remove();
            }
        }

        if (s.forceSync) {
            doSubmit();
        }
        else {
            setTimeout(doSubmit, 10); // this lets dom updates render
        }

        var data, doc, domCheckCount = 50, callbackProcessed;

        function cb(e) {
            if (xhr.aborted || callbackProcessed) {
                return;
            }
            try {
                doc = getDoc(io);
            }
            catch(ex) {
                log('cannot access response document: ', ex);
                e = SERVER_ABORT;
            }
            if (e === CLIENT_TIMEOUT_ABORT && xhr) {
                xhr.abort('timeout');
                return;
            }
            else if (e == SERVER_ABORT && xhr) {
                xhr.abort('server abort');
                return;
            }

            if (!doc || doc.location.href == s.iframeSrc) {
                // response not received yet
                if (!timedOut)
                    return;
            }
            if (io.detachEvent)
                io.detachEvent('onload', cb);
            else
                io.removeEventListener('load', cb, false);

            var status = 'success', errMsg;
            try {
                if (timedOut) {
                    throw 'timeout';
                }

                var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                log('isXml='+isXml);
                if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML)) {
                    if (--domCheckCount) {
                        // in some browsers (Opera) the iframe DOM is not always traversable when
                        // the onload callback fires, so we loop a bit to accommodate
                        log('requeing onLoad callback, DOM not available');
                        setTimeout(cb, 250);
                        return;
                    }
                    // let this fall through because server response could be an empty document
                    //log('Could not access iframe DOM after mutiple tries.');
                    //throw 'DOMException: not available';
                }

                //log('response detected');
                var docRoot = doc.body ? doc.body : doc.documentElement;
                xhr.responseText = docRoot ? docRoot.innerHTML : null;
                xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                if (isXml)
                    s.dataType = 'xml';
                xhr.getResponseHeader = function(header){
                    var headers = {'content-type': s.dataType};
                    return headers[header];
                };
                // support for XHR 'status' & 'statusText' emulation :
                if (docRoot) {
                    xhr.status = Number( docRoot.getAttribute('status') ) || xhr.status;
                    xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
                }

                var dt = (s.dataType || '').toLowerCase();
                var scr = /(json|script|text)/.test(dt);
                if (scr || s.textarea) {
                    // see if user embedded response in textarea
                    var ta = doc.getElementsByTagName('textarea')[0];
                    if (ta) {
                        xhr.responseText = ta.value;
                        // support for XHR 'status' & 'statusText' emulation :
                        xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
                        xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
                    }
                    else if (scr) {
                        // account for browsers injecting pre around json response
                        var pre = doc.getElementsByTagName('pre')[0];
                        var b = doc.getElementsByTagName('body')[0];
                        if (pre) {
                            xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
                        }
                        else if (b) {
                            xhr.responseText = b.textContent ? b.textContent : b.innerText;
                        }
                    }
                }
                else if (dt == 'xml' && !xhr.responseXML && xhr.responseText) {
                    xhr.responseXML = toXml(xhr.responseText);
                }

                try {
                    data = httpData(xhr, dt, s);
                }
                catch (e) {
                    status = 'parsererror';
                    xhr.error = errMsg = (e || status);
                }
            }
            catch (e) {
                log('error caught: ',e);
                status = 'error';
                xhr.error = errMsg = (e || status);
            }

            if (xhr.aborted) {
                log('upload aborted');
                status = null;
            }

            if (xhr.status) { // we've set xhr.status
                status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (status === 'success') {
                if (s.success)
                    s.success.call(s.context, data, 'success', xhr);
                if (g)
                    $.event.trigger("ajaxSuccess", [xhr, s]);
            }
            else if (status) {
                if (errMsg === undefined)
                    errMsg = xhr.statusText;
                if (s.error)
                    s.error.call(s.context, xhr, status, errMsg);
                if (g)
                    $.event.trigger("ajaxError", [xhr, s, errMsg]);
            }

            if (g)
                $.event.trigger("ajaxComplete", [xhr, s]);

            if (g && ! --$.active) {
                $.event.trigger("ajaxStop");
            }

            if (s.complete)
                s.complete.call(s.context, xhr, status);

            callbackProcessed = true;
            if (s.timeout)
                clearTimeout(timeoutHandle);

            // clean up
            setTimeout(function() {
                if (!s.iframeTarget)
                    $io.remove();
                xhr.responseXML = null;
            }, 100);
        }

        var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(s);
            }
            else {
                doc = (new DOMParser()).parseFromString(s, 'text/xml');
            }
            return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
        };
        var parseJSON = $.parseJSON || function(s) {
            /*jslint evil:true */
            return window['eval']('(' + s + ')');
        };

        var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4

            var ct = xhr.getResponseHeader('content-type') || '',
                xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.nodeName === 'parsererror') {
                if ($.error)
                    $.error('parsererror');
            }
            if (s && s.dataFilter) {
                data = s.dataFilter(data, type);
            }
            if (typeof data === 'string') {
                if (type === 'json' || !type && ct.indexOf('json') >= 0) {
                    data = parseJSON(data);
                } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                    $.globalEval(data);
                }
            }
            return data;
        };
    }
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *    is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *    used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
    options = options || {};
    options.delegation = options.delegation && $.isFunction($.fn.on);

    // in jQuery 1.3+ we can fix mistakes with the ready state
    if (!options.delegation && this.length === 0) {
        var o = { s: this.selector, c: this.context };
        if (!$.isReady && o.s) {
            log('DOM not ready, queuing ajaxForm');
            $(function() {
                $(o.s,o.c).ajaxForm(options);
            });
            return this;
        }
        // is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
        log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
        return this;
    }

    if ( options.delegation ) {
        $(document)
            .off('submit.form-plugin', this.selector, doAjaxSubmit)
            .off('click.form-plugin', this.selector, captureSubmittingElement)
            .on('submit.form-plugin', this.selector, options, doAjaxSubmit)
            .on('click.form-plugin', this.selector, options, captureSubmittingElement);
        return this;
    }

    return this.ajaxFormUnbind()
        .bind('submit.form-plugin', options, doAjaxSubmit)
        .bind('click.form-plugin', options, captureSubmittingElement);
};

// private event handlers
function doAjaxSubmit(e) {
    /*jshint validthis:true */
    var options = e.data;
    if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
        e.preventDefault();
        $(this).ajaxSubmit(options);
    }
}

function captureSubmittingElement(e) {
    /*jshint validthis:true */
    var target = e.target;
    var $el = $(target);
    if (!($el.is(":submit,input:image"))) {
        // is this a child element of the submit el?  (ex: a span within a button)
        var t = $el.closest(':submit');
        if (t.length === 0) {
            return;
        }
        target = t[0];
    }
    var form = this;
    form.clk = target;
    if (target.type == 'image') {
        if (e.offsetX !== undefined) {
            form.clk_x = e.offsetX;
            form.clk_y = e.offsetY;
        } else if (typeof $.fn.offset == 'function') {
            var offset = $el.offset();
            form.clk_x = e.pageX - offset.left;
            form.clk_y = e.pageY - offset.top;
        } else {
            form.clk_x = e.pageX - target.offsetLeft;
            form.clk_y = e.pageY - target.offsetTop;
        }
    }
    // clear form vars
    setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
}


// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
    return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic, elements) {
    var a = [];
    if (this.length === 0) {
        return a;
    }

    var form = this[0];
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    if (!els) {
        return a;
    }

    var i,j,n,v,el,max,jmax;
    for(i=0, max=els.length; i < max; i++) {
        el = els[i];
        n = el.name;
        if (!n) {
            continue;
        }

        if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if(!el.disabled && form.clk == el) {
                a.push({name: n, value: $(el).val(), type: el.type });
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
            }
            continue;
        }

        v = $.fieldValue(el, true);
        if (v && v.constructor == Array) {
            if (elements)
                elements.push(el);
            for(j=0, jmax=v.length; j < jmax; j++) {
                a.push({name: n, value: v[j]});
            }
        }
        else if (feature.fileapi && el.type == 'file' && !el.disabled) {
            if (elements)
                elements.push(el);
            var files = el.files;
            if (files.length) {
                for (j=0; j < files.length; j++) {
                    a.push({name: n, value: files[j], type: el.type});
                }
            }
            else {
                // #180
                a.push({ name: n, value: '', type: el.type });
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            if (elements)
                elements.push(el);
            a.push({name: n, value: v, type: el.type, required: el.required});
        }
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle it here
        var $input = $(form.clk), input = $input[0];
        n = input.name;
        if (n && !input.disabled && input.type == 'image') {
            a.push({name: n, value: $input.val()});
            a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
        }
    }
    return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
        var n = this.name;
        if (!n) {
            return;
        }
        var v = $.fieldValue(this, successful);
        if (v && v.constructor == Array) {
            for (var i=0,max=v.length; i < max; i++) {
                a.push({name: n, value: v[i]});
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            a.push({name: this.name, value: v});
        }
    });
    //hand off to jQuery.param for proper encoding
    return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *      <input name="A" type="text" />
 *      <input name="A" type="text" />
 *      <input name="B" type="checkbox" value="B1" />
 *      <input name="B" type="checkbox" value="B2"/>
 *      <input name="C" type="radio" value="C1" />
 *      <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $(':text').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $(':checkbox').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $(':radio').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *    array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i];
        var v = $.fieldValue(el, successful);
        if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
            continue;
        }
        if (v.constructor == Array)
            $.merge(val, v);
        else
            val.push(v);
    }
    return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    if (successful === undefined) {
        successful = true;
    }

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1)) {
            return null;
    }

    if (tag == 'select') {
        var index = el.selectedIndex;
        if (index < 0) {
            return null;
        }
        var a = [], ops = el.options;
        var one = (t == 'select-one');
        var max = (one ? index+1 : ops.length);
        for(var i=(one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
                var v = op.value;
                if (!v) { // extra pain for IE...
                    v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
                }
                if (one) {
                    return v;
                }
                a.push(v);
            }
        }
        return a;
    }
    return $(el).val();
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function(includeHidden) {
    return this.each(function() {
        $('input,select,textarea', this).clearFields(includeHidden);
    });
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
    var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
    return this.each(function() {
        var t = this.type, tag = this.tagName.toLowerCase();
        if (re.test(t) || tag == 'textarea') {
            this.value = '';
        }
        else if (t == 'checkbox' || t == 'radio') {
            this.checked = false;
        }
        else if (tag == 'select') {
            this.selectedIndex = -1;
        }
        else if (includeHidden) {
            // includeHidden can be the valud true, or it can be a selector string
            // indicating a special test; for example:
            //  $('#myForm').clearForm('.special:hidden')
            // the above would clean hidden inputs that have the class of 'special'
            if ( (includeHidden === true && /hidden/.test(t)) ||
                 (typeof includeHidden == 'string' && $(this).is(includeHidden)) )
                this.value = '';
        }
    });
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
    return this.each(function() {
        // guard against an input with the name of 'reset'
        // note that IE reports the reset function as an 'object'
        if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
            this.reset();
        }
    });
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
    if (b === undefined) {
        b = true;
    }
    return this.each(function() {
        this.disabled = !b;
    });
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
    if (select === undefined) {
        select = true;
    }
    return this.each(function() {
        var t = this.type;
        if (t == 'checkbox' || t == 'radio') {
            this.checked = select;
        }
        else if (this.tagName.toLowerCase() == 'option') {
            var $sel = $(this).parent('select');
            if (select && $sel[0] && $sel[0].type == 'select-one') {
                // deselect all other options
                $sel.find('option').selected(false);
            }
            this.selected = select;
        }
    });
};

// expose debug var
$.fn.ajaxSubmit.debug = false;

// helper fn for console logging
function log() {
    if (!$.fn.ajaxSubmit.debug)
        return;
    var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
    if (window.console && window.console.log) {
        window.console.log(msg);
    }
    else if (window.opera && window.opera.postError) {
        window.opera.postError(msg);
    }
}

})(jQuery);
/*!
 * From J with love
 * Copyright (C) 2012 phongjalvn
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */


(function(jQuery) {
  jQuery.fn.p2acc = function(options) {

  var defaults = {
    slideNum: true,
    autoStart: false,
    slideInterval: 3000
  };

  this.each(function() {

    var settings = jQuery.extend(defaults, options);
    jQuery(this).find('dl').addClass('p2-acc');


    // -------- Set the variables ------------------------------------------------------------------------------

    jQuery.fn.setVariables = function() {
      dlWidth = jQuery(this).width();
      dlHeight = jQuery(this).height();
      dtWidth = jQuery(this).find('dt').outerHeight();
      if (jQuery.browser.msie){ dtWidth = $(this).find('dt').outerWidth();}
      dtHeight = dlHeight - (jQuery(this).find('dt').outerWidth()-jQuery(this).find('dt').width());
      slideTotal = jQuery(this).find('dt').size();
      ddWidth = dlWidth - (dtWidth*slideTotal) - (jQuery(this).find('dd').outerWidth(true)-jQuery(this).find('dd').width());
      ddHeight = dlHeight - (jQuery(this).find('dd').outerHeight(true)-jQuery(this).find('dd').height());
    };
    jQuery(this).setVariables();


    // -------- Fix some weird cross-browser issues due to the CSS rotation -------------------------------------

    if (jQuery.browser.safari){ var dtTop = (dlHeight-dtWidth)/2; var dtOffset = -dtTop;  /* Safari and Chrome */ }
    if (jQuery.browser.mozilla){ var dtTop = dlHeight - 20; var dtOffset = - 20; /* FF */ }
    if (jQuery.browser.msie){ var dtTop = 0; var dtOffset = 0; /* IE */ }


    // -------- Getting things ready ------------------------------------------------------------------------------

    var f = 1;
    jQuery(this).find('dt').each(function(){
      jQuery(this).css({'width':dtHeight,'top':dtTop,'margin-left':dtOffset});
      if(settings.slideNum == true){
        jQuery('<span class="slide-number">'+0+f+'</span>').appendTo(this);
        if(jQuery.browser.msie){
          var slideNumLeft = parseInt(jQuery(this).find('.slide-number').css('left')) - 14;
          jQuery(this).find('.slide-number').css({'left': slideNumLeft})
          if(jQuery.browser.version == 6.0 || jQuery.browser.version == 7.0){
            jQuery(this).find('.slide-number').css({'bottom':'auto'});
          }
          if(jQuery.browser.version == 8.0){
          var slideNumTop = jQuery(this).find('.slide-number').css('bottom');
          var slideNumTopVal = parseInt(slideNumTop) + parseInt(jQuery(this).css('padding-top'))  - 12;
          jQuery(this).find('.slide-number').css({'bottom': slideNumTopVal});
          }
        } else {
          var slideNumTop = jQuery(this).find('.slide-number').css('bottom');
          var slideNumTopVal = parseInt(slideNumTop) + parseInt(jQuery(this).css('padding-top'));
          jQuery(this).find('.slide-number').css({'bottom': slideNumTopVal});
        }
      }
      f = f + 1;
    });

    if(jQuery(this).find('.active').size()) {
      jQuery(this).find('.active').next('dd').addClass('active');
    } else {
      jQuery(this).find('dt:first').addClass('active').next('dd').addClass('active');
    }

    jQuery(this).find('dt:first').css({'left':'0'}).next().css({'left':'0'});
    // jQuery(this).find('dt:first').css({'left':'0'}).next().css({'left':dtWidth});
    jQuery(this).find('dd').css({'width':ddWidth,'height':ddHeight});


    // -------- Functions ------------------------------------------------------------------------------

    jQuery.fn.findActiveSlide = function() {
        var i = 1;
        this.find('dt').each(function(){
        if(jQuery(this).hasClass('active')){
          activeID = i; // Active slide
        } else if (jQuery(this).hasClass('no-more-active')){
          noMoreActiveID = i; // No more active slide
        }
        i = i + 1;
      });
    };

    jQuery.fn.calculateSlidePos = function() {
      var u = 2;
      jQuery(this).find('dt').not(':first').each(function(){
        var activeDtPos = dtWidth*activeID;
        if(u <= activeID){
          var leftDtPos = dtWidth*(u-1);
          jQuery(this).animate({'left': leftDtPos});
          if(u < activeID){ // If the item sits to the left of the active element
            jQuery(this).next().css({'left':leftDtPos});
            // jQuery(this).next().css({'left':leftDtPos+dtWidth});
          } else{ // If the item is the active one
            jQuery(this).next().animate({'left':activeDtPos-dtWidth});
            // jQuery(this).next().animate({'left':activeDtPos});
          }
        } else {
          var rightDtPos = dlWidth-(dtWidth*(slideTotal-u+1));
          jQuery(this).animate({'left': rightDtPos});
          var rightDdPos = rightDtPos+dtWidth;
          jQuery(this).next().animate({'left':rightDdPos});
        }
        u = u+ 1;
      });
      setTimeout( function() {
        jQuery('.p2-acc').find('dd').not('.active').each(function(){
          jQuery(this).css({'display':'none'});
        });
      }, 400);

    };

    jQuery.fn.activateSlide = function() {
      this.parent('dl').setVariables();
      this.parent('dl').find('dd').css({'display':'block'});
      this.parent('dl').find('dd.plus').removeClass('plus');
      this.parent('dl').find('.no-more-active').removeClass('no-more-active');
      this.parent('dl').find('.active').removeClass('active').addClass('no-more-active');
      this.addClass('active').next().addClass('active');
      this.parent('dl').findActiveSlide();
      if(activeID < noMoreActiveID){
        this.parent('dl').find('dd.no-more-active').addClass('plus');
      }
      this.parent('dl').calculateSlidePos();
    };

    jQuery.fn.rotateSlides = function(slideInterval, timerInstance) {
      var accordianInstance = jQuery(this);
      timerInstance.value = setTimeout(function(){accordianInstance.rotateSlides(slideInterval, timerInstance);}, slideInterval);
      jQuery(this).findActiveSlide();
      var totalSlides = jQuery(this).find('dt').size();
      var activeSlide = activeID;
      var newSlide = activeSlide + 1;
      if (newSlide > totalSlides) newSlide = 1;
      jQuery(this).find('dt:eq(' + (newSlide-1) + ')').activateSlide(); // activate the new slide
    }


    // -------- Let's do it! ------------------------------------------------------------------------------

    function trackerObject() {this.value = null}
    var timerInstance = new trackerObject();

    jQuery(this).findActiveSlide();
    jQuery(this).calculateSlidePos();

    if (settings.autoStart == true){
      var accordianInstance = jQuery(this);
      var interval = parseInt(settings.slideInterval);
      timerInstance.value = setTimeout(function(){
        accordianInstance.rotateSlides(interval, timerInstance);
        }, interval);
    }

    jQuery(this).find('dt').not('active').click(function(){
      jQuery(this).activateSlide();
      clearTimeout(timerInstance.value);
    });

    if (!(jQuery.browser.msie && jQuery.browser.version == 6.0)){
      jQuery('dt').hover(function(){
        jQuery(this).addClass('hover');
      }, function(){
        jQuery(this).removeClass('hover');
      });
    }
  });
  };
})(jQuery);
/*
* qTip2 - Pretty powerful tooltips
* http://craigsworks.com/projects/qtip2/
*
* Version: nightly
* Copyright 2009-2010 Craig Michael Thompson - http://craigsworks.com
*
* Dual licensed under MIT or GPLv2 licenses
*   http://en.wikipedia.org/wiki/MIT_License
*   http://en.wikipedia.org/wiki/GNU_General_Public_License
*
* Date: Tue Apr 10 11:58:19.0000000000 2012
*/

/*jslint browser: true, onevar: true, undef: true, nomen: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
/*global window: false, jQuery: false, console: false, define: false */

// Uses AMD or browser globals to create a jQuery plugin.
(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else {
        factory(jQuery);
    }
}
(function($) {

    "use strict"; // Enable ECMAScript "strict" operation for this function. See more: http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/

    // Munge the primitives - Paul Irish tip
    var TRUE = true,
        FALSE = false,
        NULL = null,
        undefined,

        // Shortcut vars
        QTIP, PLUGINS, MOUSE,
        usedIDs = {},
        uitooltip = 'ui-tooltip',
        widget = 'ui-widget',
        disabled = 'ui-state-disabled',
        selector = 'div.qtip.'+uitooltip,
        defaultClass = uitooltip + '-default',
        focusClass = uitooltip + '-focus',
        hoverClass = uitooltip + '-hover',
        fluidClass = uitooltip + '-fluid',
        hideOffset = '-31000px',
        replaceSuffix = '_replacedByqTip',
        oldtitle = 'oldtitle',
        trackingBound;

    /* Thanks to Paul Irish for this one: http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/ */
    function log() {
        log.history = log.history || [];
        log.history.push(arguments);

        // Make sure console is present
        if('object' === typeof console) {

            // Setup console and arguments
            var c = console[ console.warn ? 'warn' : 'log' ],
            args = Array.prototype.slice.call(arguments), a;

            // Add qTip2 marker to first argument if it's a string
            if(typeof arguments[0] === 'string') { args[0] = 'qTip2: ' + args[0]; }

            // Apply console.warn or .log if not supported
            a = c.apply ? c.apply(console, args) : c(args);
        }
    }

// Option object sanitizer
function sanitizeOptions(opts)
{
    var content;

    if(!opts || 'object' !== typeof opts) { return FALSE; }

    if(opts.metadata === NULL || 'object' !== typeof opts.metadata) {
        opts.metadata = {
            type: opts.metadata
        };
    }

    if('content' in opts) {
        if(opts.content === NULL || 'object' !== typeof opts.content || opts.content.jquery) {
            opts.content = {
                text: opts.content
            };
        }

        content = opts.content.text || FALSE;
        if(!$.isFunction(content) && ((!content && !content.attr) || content.length < 1 || ('object' === typeof content && !content.jquery))) {
            opts.content.text = FALSE;
        }

        if('title' in opts.content) {
            if(opts.content.title === NULL || 'object' !== typeof opts.content.title) {
                opts.content.title = {
                    text: opts.content.title
                };
            }

            content = opts.content.title.text || FALSE;
            if(!$.isFunction(content) && ((!content && !content.attr) || content.length < 1 || ('object' === typeof content && !content.jquery))) {
                opts.content.title.text = FALSE;
            }
        }
    }

    if('position' in opts) {
        if(opts.position === NULL || 'object' !== typeof opts.position) {
            opts.position = {
                my: opts.position,
                at: opts.position
            };
        }
    }

    if('show' in opts) {
        if(opts.show === NULL || 'object' !== typeof opts.show) {
            if(opts.show.jquery) {
                opts.show = { target: opts.show };
            }
            else {
                opts.show = { event: opts.show };
            }
        }
    }

    if('hide' in opts) {
        if(opts.hide === NULL || 'object' !== typeof opts.hide) {
            if(opts.hide.jquery) {
                opts.hide = { target: opts.hide };
            }
            else {
                opts.hide = { event: opts.hide };
            }
        }
    }

    if('style' in opts) {
        if(opts.style === NULL || 'object' !== typeof opts.style) {
            opts.style = {
                classes: opts.style
            };
        }
    }

    // Sanitize plugin options
    $.each(PLUGINS, function() {
        if(this.sanitize) { this.sanitize(opts); }
    });

    return opts;
}

/*
* Core plugin implementation
*/
function QTip(target, options, id, attr)
{
    // Declare this reference
    var self = this,
        docBody = document.body,
        tooltipID = uitooltip + '-' + id,
        isPositioning = 0,
        isDrawing = 0,
        tooltip = $(),
        namespace = '.qtip-' + id,
        elements, cache;

    // Setup class attributes
    self.id = id;
    self.rendered = FALSE;
    self.elements = elements = { target: target };
    self.timers = { img: {} };
    self.options = options;
    self.checks = {};
    self.plugins = {};
    self.cache = cache = {
        event: {},
        target: $(),
        disabled: FALSE,
        attr: attr,
        onTarget: FALSE
    };

    /*
    * Private core functions
    */
    function convertNotation(notation)
    {
        var i = 0, obj, option = options,

        // Split notation into array
        levels = notation.split('.');

        // Loop through
        while( option = option[ levels[i++] ] ) {
            if(i < levels.length) { obj = option; }
        }

        return [obj || options, levels.pop()];
    }

    function setWidget() {
        var on = options.style.widget;

        tooltip.toggleClass(widget, on).toggleClass(defaultClass, options.style.def && !on);
        elements.content.toggleClass(widget+'-content', on);

        if(elements.titlebar){
            elements.titlebar.toggleClass(widget+'-header', on);
        }
        if(elements.button){
            elements.button.toggleClass(uitooltip+'-icon', !on);
        }
    }

    function removeTitle(reposition)
    {
        if(elements.title) {
            elements.titlebar.remove();
            elements.titlebar = elements.title = elements.button = NULL;

            // Reposition if enabled
            if(reposition !== FALSE) { self.reposition(); }
        }
    }

    function createButton()
    {
        var button = options.content.title.button,
            isString = typeof button === 'string',
            close = isString ? button : 'Close tooltip';

        if(elements.button) { elements.button.remove(); }

        // Use custom button if one was supplied by user, else use default
        if(button.jquery) {
            elements.button = button;
        }
        else {
            elements.button = $('<a />', {
                'class': 'ui-state-default ui-tooltip-close ' + (options.style.widget ? '' : uitooltip+'-icon'),
                'title': close,
                'aria-label': close
            })
            .prepend(
                $('<span />', {
                    'class': 'ui-icon ui-icon-close',
                    'html': '&times;'
                })
            );
        }

        // Create button and setup attributes
        elements.button.appendTo(elements.titlebar)
            .attr('role', 'button')
            .click(function(event) {
                if(!tooltip.hasClass(disabled)) { self.hide(event); }
                return FALSE;
            });

        // Redraw the tooltip when we're done
        self.redraw();
    }

    function createTitle()
    {
        var id = tooltipID+'-title';

        // Destroy previous title element, if present
        if(elements.titlebar) { removeTitle(); }

        // Create title bar and title elements
        elements.titlebar = $('<div />', {
            'class': uitooltip + '-titlebar ' + (options.style.widget ? 'ui-widget-header' : '')
        })
        .append(
            elements.title = $('<div />', {
                'id': id,
                'class': uitooltip + '-title',
                'aria-atomic': TRUE
            })
        )
        .insertBefore(elements.content)

        // Button-specific events
        .delegate('.ui-tooltip-close', 'mousedown keydown mouseup keyup mouseout', function(event) {
            $(this).toggleClass('ui-state-active ui-state-focus', event.type.substr(-4) === 'down');
        })
        .delegate('.ui-tooltip-close', 'mouseover mouseout', function(event){
            $(this).toggleClass('ui-state-hover', event.type === 'mouseover');
        });

        // Create button if enabled
        if(options.content.title.button) { createButton(); }

        // Redraw the tooltip dimensions if it's rendered
        else if(self.rendered){ self.redraw(); }
    }

    function updateButton(button)
    {
        var elem = elements.button,
            title = elements.title;

        // Make sure tooltip is rendered and if not, return
        if(!self.rendered) { return FALSE; }

        if(!button) {
            elem.remove();
        }
        else {
            if(!title) {
                createTitle();
            }
            createButton();
        }
    }

    function updateTitle(content, reposition)
    {
        var elem = elements.title;

        // Make sure tooltip is rendered and if not, return
        if(!self.rendered || !content) { return FALSE; }

        // Use function to parse content
        if($.isFunction(content)) {
            content = content.call(target, cache.event, self);
        }

        // Remove title if callback returns false or null/undefined (but not '')
        if(content === FALSE || (!content && content !== '')) { return removeTitle(FALSE); }

        // Append new content if its a DOM array and show it if hidden
        else if(content.jquery && content.length > 0) {
            elem.empty().append(content.css({ display: 'block' }));
        }

        // Content is a regular string, insert the new content
        else { elem.html(content); }

        // Redraw and reposition
        self.redraw();
        if(reposition !== FALSE && self.rendered && tooltip[0].offsetWidth > 0) {
            self.reposition(cache.event);
        }
    }

    function updateContent(content, reposition)
    {
        var elem = elements.content;

        // Make sure tooltip is rendered and content is defined. If not return
        if(!self.rendered || !content) { return FALSE; }

        // Use function to parse content
        if($.isFunction(content)) {
            content = content.call(target, cache.event, self) || '';
        }

        // Append new content if its a DOM array and show it if hidden
        if(content.jquery && content.length > 0) {
            elem.empty().append(content.css({ display: 'block' }));
        }

        // Content is a regular string, insert the new content
        else { elem.html(content); }

        // Image detection
        function detectImages(next) {
            var images, srcs = {};

            function imageLoad(image) {
                // Clear src from object and any timers and events associated with the image
                if(image) {
                    delete srcs[image.src];
                    clearTimeout(self.timers.img[image.src]);
                    $(image).unbind(namespace);
                }

                // If queue is empty after image removal, update tooltip and continue the queue
                if($.isEmptyObject(srcs)) {
                    self.redraw();
                    if(reposition !== FALSE) {
                        self.reposition(cache.event);
                    }

                    next();
                }
            }

            // Find all content images without dimensions, and if no images were found, continue
            if((images = elem.find('img[src]:not([height]):not([width])')).length === 0) { return imageLoad(); }

            // Apply timer to each image to poll for dimensions
            images.each(function(i, elem) {
                // Skip if the src is already present
                if(srcs[elem.src] !== undefined) { return; }

                // Keep track of how many times we poll for image dimensions.
                // If it doesn't return in a reasonable amount of time, it's better
                // to display the tooltip, rather than hold up the queue.
                var iterations = 0, maxIterations = 3;

                (function timer(){
                    // When the dimensions are found, remove the image from the queue
                    if(elem.height || elem.width || (iterations > maxIterations)) { return imageLoad(elem); }

                    // Increase iterations and restart timer
                    iterations += 1;
                    self.timers.img[elem.src] = setTimeout(timer, 700);
                }());

                // Also apply regular load/error event handlers
                $(elem).bind('error'+namespace+' load'+namespace, function(){ imageLoad(this); });

                // Store the src and element in our object
                srcs[elem.src] = elem;
            });
        }

        /*
         * If we're still rendering... insert into 'fx' queue our image dimension
         * checker which will halt the showing of the tooltip until image dimensions
         * can be detected properly.
         */
        if(self.rendered < 0) { tooltip.queue('fx', detectImages); }

        // We're fully rendered, so reset isDrawing flag and proceed without queue delay
        else { isDrawing = 0; detectImages($.noop); }

        return self;
    }

    function assignEvents()
    {
        var posOptions = options.position,
            targets = {
                show: options.show.target,
                hide: options.hide.target,
                viewport: $(posOptions.viewport),
                document: $(document),
                body: $(document.body),
                window: $(window)
            },
            events = {
                show: $.trim('' + options.show.event).split(' '),
                hide: $.trim('' + options.hide.event).split(' ')
            },
            IE6 = $.browser.msie && parseInt($.browser.version, 10) === 6;

        // Define show event method
        function showMethod(event)
        {
            if(tooltip.hasClass(disabled)) { return FALSE; }

            // Clear hide timers
            clearTimeout(self.timers.show);
            clearTimeout(self.timers.hide);

            // Start show timer
            var callback = function(){ self.toggle(TRUE, event); };
            if(options.show.delay > 0) {
                self.timers.show = setTimeout(callback, options.show.delay);
            }
            else{ callback(); }
        }

        // Define hide method
        function hideMethod(event)
        {
            if(tooltip.hasClass(disabled) || isPositioning || isDrawing) { return FALSE; }

            // Check if new target was actually the tooltip element
            var relatedTarget = $(event.relatedTarget || event.target),
                ontoTooltip = relatedTarget.closest(selector)[0] === tooltip[0],
                ontoTarget = relatedTarget[0] === targets.show[0];

            // Clear timers and stop animation queue
            clearTimeout(self.timers.show);
            clearTimeout(self.timers.hide);

            // Prevent hiding if tooltip is fixed and event target is the tooltip. Or if mouse positioning is enabled and cursor momentarily overlaps
            if((posOptions.target === 'mouse' && ontoTooltip) || (options.hide.fixed && ((/mouse(out|leave|move)/).test(event.type) && (ontoTooltip || ontoTarget)))) {
                try { event.preventDefault(); event.stopImmediatePropagation(); } catch(e) {} return;
            }

            // If tooltip has displayed, start hide timer
            if(options.hide.delay > 0) {
                self.timers.hide = setTimeout(function(){ self.hide(event); }, options.hide.delay);
            }
            else{ self.hide(event); }
        }

        // Define inactive method
        function inactiveMethod(event)
        {
            if(tooltip.hasClass(disabled)) { return FALSE; }

            // Clear timer
            clearTimeout(self.timers.inactive);
            self.timers.inactive = setTimeout(function(){ self.hide(event); }, options.hide.inactive);
        }

        function repositionMethod(event) {
            if(self.rendered && tooltip[0].offsetWidth > 0) { self.reposition(event); }
        }

        // On mouseenter/mouseleave...
        tooltip.bind('mouseenter'+namespace+' mouseleave'+namespace, function(event) {
            var state = event.type === 'mouseenter';

            // Focus the tooltip on mouseenter (z-index stacking)
            if(state) { self.focus(event); }

            // Add hover class
            tooltip.toggleClass(hoverClass, state);
        });

        // Enable hide.fixed
        if(options.hide.fixed) {
            // Add tooltip as a hide target
            targets.hide = targets.hide.add(tooltip);

            // Clear hide timer on tooltip hover to prevent it from closing
            tooltip.bind('mouseover'+namespace, function() {
                if(!tooltip.hasClass(disabled)) { clearTimeout(self.timers.hide); }
            });
        }

        // If using mouseout/mouseleave as a hide event...
        if(/mouse(out|leave)/i.test(options.hide.event)) {
            // Hide tooltips when leaving current window/frame (but not select/option elements)
            if(options.hide.leave === 'window') {
                targets.window.bind('mouseout'+namespace+' blur'+namespace, function(event) {
                    if(/select|option/.test(event.target) && !event.relatedTarget) { self.hide(event); }
                });
            }
        }

        /*
         * Make sure hoverIntent functions properly by using mouseleave to clear show timer if
         * mouseenter/mouseout is used for show.event, even if it isn't in the users options.
         */
        else if(/mouse(over|enter)/i.test(options.show.event)) {
            targets.hide.bind('mouseleave'+namespace, function(event) {
                clearTimeout(self.timers.show);
            });
        }

        // Hide tooltip on document mousedown if unfocus events are enabled
        if(('' + options.hide.event).indexOf('unfocus') > -1) {
            posOptions.container.closest('html').bind('mousedown'+namespace, function(event) {
                var elem = $(event.target),
                    enabled = self.rendered && !tooltip.hasClass(disabled) && tooltip[0].offsetWidth > 0,
                    isAncestor = elem.parents(selector).filter(tooltip[0]).length > 0;

                if(elem[0] !== target[0] && elem[0] !== tooltip[0] && !isAncestor &&
                    !target.has(elem[0]).length && !elem.attr('disabled')
                ) {
                    self.hide(event);
                }
            });
        }

        // Check if the tooltip hides when inactive
        if('number' === typeof options.hide.inactive) {
            // Bind inactive method to target as a custom event
            targets.show.bind('qtip-'+id+'-inactive', inactiveMethod);

            // Define events which reset the 'inactive' event handler
            $.each(QTIP.inactiveEvents, function(index, type){
                targets.hide.add(elements.tooltip).bind(type+namespace+'-inactive', inactiveMethod);
            });
        }

        // Apply hide events
        $.each(events.hide, function(index, type) {
            var showIndex = $.inArray(type, events.show),
                    targetHide = $(targets.hide);

            // Both events and targets are identical, apply events using a toggle
            if((showIndex > -1 && targetHide.add(targets.show).length === targetHide.length) || type === 'unfocus')
            {
                targets.show.bind(type+namespace, function(event) {
                    if(tooltip[0].offsetWidth > 0) { hideMethod(event); }
                    else { showMethod(event); }
                });

                // Don't bind the event again
                delete events.show[ showIndex ];
            }

            // Events are not identical, bind normally
            else { targets.hide.bind(type+namespace, hideMethod); }
        });

        // Apply show events
        $.each(events.show, function(index, type) {
            targets.show.bind(type+namespace, showMethod);
        });

        // Check if the tooltip hides when mouse is moved a certain distance
        if('number' === typeof options.hide.distance) {
            // Bind mousemove to target to detect distance difference
            targets.show.add(tooltip).bind('mousemove'+namespace, function(event) {
                var origin = cache.origin || {},
                    limit = options.hide.distance,
                    abs = Math.abs;

                // Check if the movement has gone beyond the limit, and hide it if so
                if(abs(event.pageX - origin.pageX) >= limit || abs(event.pageY - origin.pageY) >= limit) {
                    self.hide(event);
                }
            });
        }

        // Mouse positioning events
        if(posOptions.target === 'mouse') {
            // Cache mousemove coords on show targets
            targets.show.bind('mousemove'+namespace, function(event) {
                MOUSE = { pageX: event.pageX, pageY: event.pageY, type: 'mousemove' };
            });

            // If mouse adjustment is on...
            if(posOptions.adjust.mouse) {
                // Apply a mouseleave event so we don't get problems with overlapping
                if(options.hide.event) {
                    // Hide when we leave the tooltip and not onto the show target
                    tooltip.bind('mouseleave'+namespace, function(event) {
                        if((event.relatedTarget || event.target) !== targets.show[0]) { self.hide(event); }
                    });

                    // Track if we're on the target or not
                    elements.target.bind('mouseenter'+namespace+' mouseleave'+namespace, function(event) {
                        cache.onTarget = event.type === 'mouseenter';
                    });
                }

                // Update tooltip position on mousemove
                targets.document.bind('mousemove'+namespace, function(event) {
                    // Update the tooltip position only if the tooltip is visible and adjustment is enabled
                    if(self.rendered && cache.onTarget && !tooltip.hasClass(disabled) && tooltip[0].offsetWidth > 0) {
                        self.reposition(event || MOUSE);
                    }
                });
            }
        }

        // Adjust positions of the tooltip on window resize if enabled
        if(posOptions.adjust.resize || targets.viewport.length) {
            ($.event.special.resize ? targets.viewport : targets.window).bind('resize'+namespace, repositionMethod);
        }

        // Adjust tooltip position on scroll if screen adjustment is enabled
        if(targets.viewport.length || (IE6 && tooltip.css('position') === 'fixed')) {
            targets.viewport.bind('scroll'+namespace, repositionMethod);
        }
    }

    function unassignEvents()
    {
        var targets = [
                options.show.target[0],
                options.hide.target[0],
                self.rendered && elements.tooltip[0],
                options.position.container[0],
                options.position.viewport[0],
                window,
                document
            ];

        // Check if tooltip is rendered
        if(self.rendered) {
            $([]).pushStack( $.grep(targets, function(i){ return typeof i === 'object'; }) ).unbind(namespace);
        }

        // Tooltip isn't yet rendered, remove render event
        else { options.show.target.unbind(namespace+'-create'); }
    }

    // Setup builtin .set() option checks
    self.checks.builtin = {
        // Core checks
        '^id$': function(obj, o, v) {
            var id = v === TRUE ? QTIP.nextid : v,
                tooltipID = uitooltip + '-' + id;

            if(id !== FALSE && id.length > 0 && !$('#'+tooltipID).length) {
                tooltip[0].id = tooltipID;
                elements.content[0].id = tooltipID + '-content';
                elements.title[0].id = tooltipID + '-title';
            }
        },

        // Content checks
        '^content.text$': function(obj, o, v){ updateContent(v); },
        '^content.title.text$': function(obj, o, v) {
            // Remove title if content is null
            if(!v) { return removeTitle(); }

            // If title isn't already created, create it now and update
            if(!elements.title && v) { createTitle(); }
            updateTitle(v);
        },
        '^content.title.button$': function(obj, o, v){ updateButton(v); },

        // Position checks
        '^position.(my|at)$': function(obj, o, v){
            // Parse new corner value into Corner objecct
            if('string' === typeof v) {
                obj[o] = new PLUGINS.Corner(v);
            }
        },
        '^position.container$': function(obj, o, v){
            if(self.rendered) { tooltip.appendTo(v); }
        },

        // Show checks
        '^show.ready$': function() {
            if(!self.rendered) { self.render(1); }
            else { self.toggle(TRUE); }
        },

        // Style checks
        '^style.classes$': function(obj, o, v) {
            tooltip.attr('class', uitooltip + ' qtip ui-helper-reset ' + v);
        },
        '^style.widget|content.title': setWidget,

        // Events check
        '^events.(render|show|move|hide|focus|blur)$': function(obj, o, v) {
            tooltip[($.isFunction(v) ? '' : 'un') + 'bind']('tooltip'+o, v);
        },

        // Properties which require event reassignment
        '^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)': function() {
            var posOptions = options.position;

            // Set tracking flag
            tooltip.attr('tracking', posOptions.target === 'mouse' && posOptions.adjust.mouse);

            // Reassign events
            unassignEvents(); assignEvents();
        }
    };

    /*
    * Public API methods
    */
    $.extend(self, {
        render: function(show)
        {
            if(self.rendered) { return self; } // If tooltip has already been rendered, exit

            var text = options.content.text,
                title = options.content.title.text,
                posOptions = options.position,
                callback = $.Event('tooltiprender');

            // Add ARIA attributes to target
            $.attr(target[0], 'aria-describedby', tooltipID);

            // Create tooltip element
            tooltip = elements.tooltip = $('<div/>', {
                    'id': tooltipID,
                    'class': uitooltip + ' qtip ui-helper-reset ' + defaultClass + ' ' + options.style.classes + ' '+ uitooltip + '-pos-' + options.position.my.abbrev(),
                    'width': options.style.width || '',
                    'height': options.style.height || '',
                    'tracking': posOptions.target === 'mouse' && posOptions.adjust.mouse,

                    /* ARIA specific attributes */
                    'role': 'alert',
                    'aria-live': 'polite',
                    'aria-atomic': FALSE,
                    'aria-describedby': tooltipID + '-content',
                    'aria-hidden': TRUE
                })
                .toggleClass(disabled, cache.disabled)
                .data('qtip', self)
                .appendTo(options.position.container)
                .append(
                    // Create content element
                    elements.content = $('<div />', {
                        'class': uitooltip + '-content',
                        'id': tooltipID + '-content',
                        'aria-atomic': TRUE
                    })
                );

            // Set rendered flag and prevent redundant redraw/reposition calls for now
            self.rendered = -1;
            isDrawing = 1; isPositioning = 1;

            // Create title...
            if(title) {
                createTitle();

                // Update title only if its not a callback (called in toggle if so)
                if(!$.isFunction(title)) { updateTitle(title, FALSE); }
            }

            // Set proper rendered flag and update content if not a callback function (called in toggle)
            if(!$.isFunction(text)) { updateContent(text, FALSE); }
            self.rendered = TRUE;

            // Setup widget classes
            setWidget();

            // Assign passed event callbacks (before plugins!)
            $.each(options.events, function(name, callback) {
                if($.isFunction(callback)) {
                    tooltip.bind(name === 'toggle' ? 'tooltipshow tooltiphide' : 'tooltip'+name, callback);
                }
            });

            // Initialize 'render' plugins
            $.each(PLUGINS, function() {
                if(this.initialize === 'render') { this(self); }
            });

            // Assign events
            assignEvents();

            /* Queue this part of the render process in our fx queue so we can
             * load images before the tooltip renders fully.
             *
             * See: updateContent method
            */
            tooltip.queue('fx', function(next) {
                // Trigger tooltiprender event and pass original triggering event as original
                callback.originalEvent = cache.event;
                tooltip.trigger(callback, [self]);

                // Reset flags
                isDrawing = 0; isPositioning = 0;

                // Redraw the tooltip manually now we're fully rendered
                self.redraw();

                // Show tooltip if needed
                if(options.show.ready || show) {
                    self.toggle(TRUE, cache.event, FALSE);
                }

                next(); // Move on to next method in queue
            });

            return self;
        },

        get: function(notation)
        {
            var result, o;

            switch(notation.toLowerCase())
            {
                case 'dimensions':
                    result = {
                        height: tooltip.outerHeight(), width: tooltip.outerWidth()
                    };
                break;

                case 'offset':
                    result = PLUGINS.offset(tooltip, options.position.container);
                break;

                default:
                    o = convertNotation(notation.toLowerCase());
                    result = o[0][ o[1] ];
                    result = result.precedance ? result.string() : result;
                break;
            }

            return result;
        },

        set: function(option, value)
        {
            var rmove = /^position\.(my|at|adjust|target|container)|style|content|show\.ready/i,
                rdraw = /^content\.(title|attr)|style/i,
                reposition = FALSE,
                redraw = FALSE,
                checks = self.checks,
                name;

            function callback(notation, args) {
                var category, rule, match;

                for(category in checks) {
                    for(rule in checks[category]) {
                        if(match = (new RegExp(rule, 'i')).exec(notation)) {
                            args.push(match);
                            checks[category][rule].apply(self, args);
                        }
                    }
                }
            }

            // Convert singular option/value pair into object form
            if('string' === typeof option) {
                name = option; option = {}; option[name] = value;
            }
            else { option = $.extend(TRUE, {}, option); }

            // Set all of the defined options to their new values
            $.each(option, function(notation, value) {
                var obj = convertNotation( notation.toLowerCase() ), previous;

                // Set new obj value
                previous = obj[0][ obj[1] ];
                obj[0][ obj[1] ] = 'object' === typeof value && value.nodeType ? $(value) : value;

                // Set the new params for the callback
                option[notation] = [obj[0], obj[1], value, previous];

                // Also check if we need to reposition / redraw
                reposition = rmove.test(notation) || reposition;
                redraw = rdraw.test(notation) || redraw;
            });

            // Re-sanitize options
            sanitizeOptions(options);

            /*
             * Execute any valid callbacks for the set options
             * Also set isPositioning/isDrawing so we don't get loads of redundant repositioning
             * and redraw calls.
             */
            isPositioning = isDrawing = 1; $.each(option, callback); isPositioning = isDrawing = 0;

            // Update position / redraw if needed
            if(self.rendered && tooltip[0].offsetWidth > 0) {
                if(reposition) {
                    self.reposition( options.position.target === 'mouse' ? NULL : cache.event );
                }
                if(redraw) { self.redraw(); }
            }

            return self;
        },

        toggle: function(state, event)
        {
            // Render the tooltip if showing and it isn't already
            if(!self.rendered) { return state ? self.render(1) : self; }

            var type = state ? 'show' : 'hide',
                opts = options[type],
                otherOpts = options[ !state ? 'show' : 'hide' ],
                posOptions = options.position,
                contentOptions = options.content,
                visible = tooltip[0].offsetWidth > 0,
                animate = state || opts.target.length === 1,
                sameTarget = !event || opts.target.length < 2 || cache.target[0] === event.target,
                delay, callback;

            // Detect state if valid one isn't provided
            if((typeof state).search('boolean|number')) { state = !visible; }

            // Return if element is already in correct state
            if(!tooltip.is(':animated') && visible === state && sameTarget) { return self; }

            // Try to prevent flickering when tooltip overlaps show element
            if(event) {
                if((/over|enter/).test(event.type) && (/out|leave/).test(cache.event.type) &&
                    options.show.target.add(event.target).length === options.show.target.length &&
                    tooltip.has(event.relatedTarget).length) {
                    return self;
                }

                // Cache event
                cache.event = $.extend({}, event);
            }

            // Call API methods
            callback = $.Event('tooltip'+type);
            callback.originalEvent = event ? cache.event : NULL;
            tooltip.trigger(callback, [self, 90]);
            if(callback.isDefaultPrevented()){ return self; }

            // Set ARIA hidden status attribute
            $.attr(tooltip[0], 'aria-hidden', !!!state);

            // Execute state specific properties
            if(state) {
                // Store show origin coordinates
                cache.origin = $.extend({}, MOUSE);

                // Focus the tooltip
                self.focus(event);

                // Update tooltip content & title if it's a dynamic function
                if($.isFunction(contentOptions.text)) { updateContent(contentOptions.text, FALSE); }
                if($.isFunction(contentOptions.title.text)) { updateTitle(contentOptions.title.text, FALSE); }

                // Cache mousemove events for positioning purposes (if not already tracking)
                if(!trackingBound && posOptions.target === 'mouse' && posOptions.adjust.mouse) {
                    $(document).bind('mousemove.qtip', function(event) {
                        MOUSE = { pageX: event.pageX, pageY: event.pageY, type: 'mousemove' };
                    });
                    trackingBound = TRUE;
                }

                // Update the tooltip position
                self.reposition(event, arguments[2]);

                // Hide other tooltips if tooltip is solo, using it as the context
                if((callback.solo = !!opts.solo)) { $(selector, opts.solo).not(tooltip).qtip('hide', callback); }
            }
            else {
                // Clear show timer if we're hiding
                clearTimeout(self.timers.show);

                // Remove cached origin on hide
                delete cache.origin;

                // Remove mouse tracking event if not needed (all tracking qTips are hidden)
                if(trackingBound && !$(selector+'[tracking="true"]:visible', opts.solo).not(tooltip).length) {
                    $(document).unbind('mousemove.qtip');
                    trackingBound = FALSE;
                }

                // Blur the tooltip
                self.blur(event);
            }

            // Define post-animation, state specific properties
            function after() {
                if(state) {
                    // Prevent antialias from disappearing in IE by removing filter
                    if($.browser.msie) { tooltip[0].style.removeAttribute('filter'); }

                    // Remove overflow setting to prevent tip bugs
                    tooltip.css('overflow', '');

                    // Autofocus elements if enabled
                    if('string' === typeof opts.autofocus) {
                        $(opts.autofocus, tooltip).focus();
                    }

                    // If set, hide tooltip when inactive for delay period
                    opts.target.trigger('qtip-'+id+'-inactive');
                }
                else {
                    // Reset CSS states
                    tooltip.css({
                        display: '',
                        visibility: '',
                        opacity: '',
                        left: '',
                        top: ''
                    });
                }

                // Call API method
                callback = $.Event('tooltip'+(state ? 'visible' : 'hidden'));
                callback.originalEvent = event ? cache.event : NULL;
                tooltip.trigger(callback, [self]);
            }

            // If no effect type is supplied, use a simple toggle
            if(opts.effect === FALSE || animate === FALSE) {
                tooltip[ type ]();
                after.call(tooltip);
            }

            // Use custom function if provided
            else if($.isFunction(opts.effect)) {
                tooltip.stop(1, 1);
                opts.effect.call(tooltip, self);
                tooltip.queue('fx', function(n){ after(); n(); });
            }

            // Use basic fade function by default
            else { tooltip.fadeTo(90, state ? 1 : 0, after); }

            // If inactive hide method is set, active it
            if(state) { opts.target.trigger('qtip-'+id+'-inactive'); }

            return self;
        },

        show: function(event){ return self.toggle(TRUE, event); },

        hide: function(event){ return self.toggle(FALSE, event); },

        focus: function(event)
        {
            if(!self.rendered) { return self; }

            var qtips = $(selector),
                curIndex = parseInt(tooltip[0].style.zIndex, 10),
                newIndex = QTIP.zindex + qtips.length,
                cachedEvent = $.extend({}, event),
                focusedElem, callback;

            // Only update the z-index if it has changed and tooltip is not already focused
            if(!tooltip.hasClass(focusClass))
            {
                // Call API method
                callback = $.Event('tooltipfocus');
                callback.originalEvent = cachedEvent;
                tooltip.trigger(callback, [self, newIndex]);

                // If default action wasn't prevented...
                if(!callback.isDefaultPrevented()) {
                    // Only update z-index's if they've changed
                    if(curIndex !== newIndex) {
                        // Reduce our z-index's and keep them properly ordered
                        qtips.each(function() {
                            if(this.style.zIndex > curIndex) {
                                this.style.zIndex = this.style.zIndex - 1;
                            }
                        });

                        // Fire blur event for focused tooltip
                        qtips.filter('.' + focusClass).qtip('blur', cachedEvent);
                    }

                    // Set the new z-index
                    tooltip.addClass(focusClass)[0].style.zIndex = newIndex;
                }
            }

            return self;
        },

        blur: function(event) {
            var cachedEvent = $.extend({}, event),
                callback;

            // Set focused status to FALSE
            tooltip.removeClass(focusClass);

            // Trigger blur event
            callback = $.Event('tooltipblur');
            callback.originalEvent = cachedEvent;
            tooltip.trigger(callback, [self]);

            return self;
        },

        reposition: function(event, effect)
        {
            if(!self.rendered || isPositioning) { return self; }

            // Set positioning flag
            isPositioning = 1;

            var target = options.position.target,
                posOptions = options.position,
                my = posOptions.my,
                at = posOptions.at,
                adjust = posOptions.adjust,
                method = adjust.method.split(' '),
                elemWidth = tooltip.outerWidth(),
                elemHeight = tooltip.outerHeight(),
                targetWidth = 0,
                targetHeight = 0,
                callback = $.Event('tooltipmove'),
                fixed = tooltip.css('position') === 'fixed',
                viewport = posOptions.viewport,
                position = { left: 0, top: 0 },
                container = posOptions.container,
                flipoffset = FALSE,
                tip = self.plugins.tip,
                visible = tooltip[0].offsetWidth > 0,
                readjust = {
                    // Axis detection and readjustment indicator
                    horizontal: method[0],
                    vertical: (method[1] = method[1] || method[0]),
                    enabled: viewport.jquery && target[0] !== window && target[0] !== docBody && adjust.method !== 'none',

                    // Reposition methods
                    left: function(posLeft) {
                        var isShift = readjust.horizontal === 'shift',
                            viewportScroll = -container.offset.left + viewport.offset.left + viewport.scrollLeft,
                            myWidth = my.x === 'left' ? elemWidth : my.x === 'right' ? -elemWidth : -elemWidth / 2,
                            atWidth = at.x === 'left' ? targetWidth : at.x === 'right' ? -targetWidth : -targetWidth / 2,
                            tipWidth = tip && tip.size ? tip.size.width || 0 : 0,
                            tipAdjust = tip && tip.corner && tip.corner.precedance === 'x' && !isShift ? tipWidth : 0,
                            overflowLeft = viewportScroll - posLeft + tipAdjust,
                            overflowRight = posLeft + elemWidth - viewport.width - viewportScroll + tipAdjust,
                            offset = myWidth - (my.precedance === 'x' || my.x === my.y ? atWidth : 0) - (at.x === 'center' ? targetWidth / 2 : 0),
                            isCenter = my.x === 'center';

                        // Optional 'shift' style repositioning
                        if(isShift) {
                            tipAdjust = tip && tip.corner && tip.corner.precedance === 'y' ? tipWidth : 0;
                            offset = (my.x === 'left' ? 1 : -1) * myWidth - tipAdjust;

                            // Adjust position but keep it within viewport dimensions
                            position.left += overflowLeft > 0 ? overflowLeft : overflowRight > 0 ? -overflowRight : 0;
                            position.left = Math.max(
                                -container.offset.left + viewport.offset.left + (tipAdjust && tip.corner.x === 'center' ? tip.offset : 0),
                                posLeft - offset,
                                Math.min(
                                    Math.max(-container.offset.left + viewport.offset.left + viewport.width, posLeft + offset),
                                    position.left
                                )
                            );
                        }

                        // Default 'flip' repositioning
                        else {
                            if(overflowLeft > 0 && (my.x !== 'left' || overflowRight > 0)) {
                                position.left -= offset;
                            }
                            else if(overflowRight > 0 && (my.x !== 'right' || overflowLeft > 0)  ) {
                                position.left -= isCenter ? -offset : offset;
                            }
                            if(position.left !== posLeft && isCenter) { position.left -= adjust.x; }

                            // Make sure we haven't made things worse with the adjustment and return the adjusted difference
                            if(position.left < viewportScroll && -position.left > overflowRight) { position.left = posLeft; }
                        }

                        return position.left - posLeft;
                    },
                    top: function(posTop) {
                        var isShift = readjust.vertical === 'shift',
                            viewportScroll = -container.offset.top + viewport.offset.top + viewport.scrollTop,
                            myHeight = my.y === 'top' ? elemHeight : my.y === 'bottom' ? -elemHeight : -elemHeight / 2,
                            atHeight = at.y === 'top' ? targetHeight : at.y === 'bottom' ? -targetHeight : -targetHeight / 2,
                            tipHeight = tip && tip.size ? tip.size.height || 0 : 0,
                            tipAdjust = tip && tip.corner && tip.corner.precedance === 'y' && !isShift ? tipHeight : 0,
                            overflowTop = viewportScroll - posTop + tipAdjust,
                            overflowBottom = posTop + elemHeight - viewport.height - viewportScroll + tipAdjust,
                            offset = myHeight - (my.precedance === 'y' || my.x === my.y ? atHeight : 0) - (at.y === 'center' ? targetHeight / 2 : 0),
                            isCenter = my.y === 'center';

                        // Optional 'shift' style repositioning
                        if(isShift) {
                            tipAdjust = tip && tip.corner && tip.corner.precedance === 'x' ? tipHeight : 0;
                            offset = (my.y === 'top' ? 1 : -1) * myHeight - tipAdjust;

                            // Adjust position but keep it within viewport dimensions
                            position.top += overflowTop > 0 ? overflowTop : overflowBottom > 0 ? -overflowBottom : 0;
                            position.top = Math.max(
                                -container.offset.top + viewport.offset.top + (tipAdjust && tip.corner.x === 'center' ? tip.offset : 0),
                                posTop - offset,
                                Math.min(
                                    Math.max(-container.offset.top + viewport.offset.top + viewport.height, posTop + offset),
                                    position.top
                                )
                            );
                        }

                        // Default 'flip' repositioning
                        else {
                            if(overflowTop > 0 && (my.y !== 'top' || overflowBottom > 0)) {
                                position.top -= offset;
                            }
                            else if(overflowBottom > 0 && (my.y !== 'bottom' || overflowTop > 0)  ) {
                                position.top -= isCenter ? -offset : offset;
                            }
                            if(position.top !== posTop && isCenter) { position.top -= adjust.y; }

                            // Make sure we haven't made things worse with the adjustment and return the adjusted difference
                            if(position.top < 0 && -position.top > overflowBottom) { position.top = posTop; }
                        }

                        return position.top - posTop;
                    }
                },
                win;

            // Check if absolute position was passed
            if($.isArray(target) && target.length === 2) {
                // Force left top and set position
                at = { x: 'left', y: 'top' };
                position = { left: target[0], top: target[1] };
            }

            // Check if mouse was the target
            else if(target === 'mouse' && ((event && event.pageX) || cache.event.pageX)) {
                // Force left top to allow flipping
                at = { x: 'left', y: 'top' };

                // Use cached event if one isn't available for positioning
                event = (event && (event.type === 'resize' || event.type === 'scroll') ? cache.event :
                    event && event.pageX && event.type === 'mousemove' ? event :
                    MOUSE && MOUSE.pageX && (adjust.mouse || !event || !event.pageX) ? { pageX: MOUSE.pageX, pageY: MOUSE.pageY } :
                    !adjust.mouse && cache.origin && cache.origin.pageX && options.show.distance ? cache.origin :
                    event) || event || cache.event || MOUSE || {};

                // Use event coordinates for position
                position = { top: event.pageY, left: event.pageX };
            }

            // Target wasn't mouse or absolute...
            else {
                // Check if event targetting is being used
                if(target === 'event') {
                    if(event && event.target && event.type !== 'scroll' && event.type !== 'resize') {
                        target = cache.target = $(event.target);
                    }
                    else {
                        target = cache.target;
                    }
                }
                else {
                    target = cache.target = $(target.jquery ? target : elements.target);
                }

                // Parse the target into a jQuery object and make sure there's an element present
                target = $(target).eq(0);
                if(target.length === 0) { return self; }

                // Check if window or document is the target
                else if(target[0] === document || target[0] === window) {
                    targetWidth = PLUGINS.iOS ? window.innerWidth : target.width();
                    targetHeight = PLUGINS.iOS ? window.innerHeight : target.height();

                    if(target[0] === window) {
                        position = {
                            top: (viewport || target).scrollTop(),
                            left: (viewport || target).scrollLeft()
                        };
                    }
                }

                // Use Imagemap/SVG plugins if needed
                else if(target.is('area') && PLUGINS.imagemap) {
                    position = PLUGINS.imagemap(target, at, readjust.enabled ? method : FALSE);
                }
                else if(target[0].namespaceURI === 'http://www.w3.org/2000/svg' && PLUGINS.svg) {
                    position = PLUGINS.svg(target, at);
                }

                else {
                    targetWidth = target.outerWidth();
                    targetHeight = target.outerHeight();

                    position = PLUGINS.offset(target, container);
                }

                // Parse returned plugin values into proper variables
                if(position.offset) {
                    targetWidth = position.width;
                    targetHeight = position.height;
                    flipoffset = position.flipoffset;
                    position = position.offset;
                }

                // Adjust for position.fixed tooltips (and also iOS scroll bug in v3.2 - v4.0)
                if((PLUGINS.iOS < 4.1 && PLUGINS.iOS > 3.1) || PLUGINS.iOS == 4.3 || (!PLUGINS.iOS && fixed)) {
                    win = $(window);
                    position.left -= win.scrollLeft();
                    position.top -= win.scrollTop();
                }

                // Adjust position relative to target
                position.left += at.x === 'right' ? targetWidth : at.x === 'center' ? targetWidth / 2 : 0;
                position.top += at.y === 'bottom' ? targetHeight : at.y === 'center' ? targetHeight / 2 : 0;
            }

            // Adjust position relative to tooltip
            position.left += adjust.x + (my.x === 'right' ? -elemWidth : my.x === 'center' ? -elemWidth / 2 : 0);
            position.top += adjust.y + (my.y === 'bottom' ? -elemHeight : my.y === 'center' ? -elemHeight / 2 : 0);

            // Calculate collision offset values if viewport positioning is enabled
            if(readjust.enabled) {
                // Cache our viewport details
                viewport = {
                    elem: viewport,
                    height: viewport[ (viewport[0] === window ? 'h' : 'outerH') + 'eight' ](),
                    width: viewport[ (viewport[0] === window ? 'w' : 'outerW') + 'idth' ](),
                    scrollLeft: fixed ? 0 : viewport.scrollLeft(),
                    scrollTop: fixed ? 0 : viewport.scrollTop(),
                    offset: viewport.offset() || { left: 0, top: 0 }
                };
                container = {
                    elem: container,
                    scrollLeft: container.scrollLeft(),
                    scrollTop: container.scrollTop(),
                    offset: container.offset() || { left: 0, top: 0 }
                };

                // Adjust position based onviewport and adjustment options
                position.adjusted = {
                    left: readjust.horizontal !== 'none' ? readjust.left(position.left) : 0,
                    top: readjust.vertical !== 'none' ? readjust.top(position.top) : 0
                };

                // Set tooltip position class
                if(position.adjusted.left + position.adjusted.top) {
                    tooltip.attr('class', tooltip[0].className.replace(/ui-tooltip-pos-\w+/i, uitooltip + '-pos-' + my.abbrev()));
                }

                // Apply flip offsets supplied by positioning plugins
                if(flipoffset && position.adjusted.left) { position.left += flipoffset.left; }
                if(flipoffset && position.adjusted.top) {  position.top += flipoffset.top; }
            }

            //Viewport adjustment is disabled, set values to zero
            else { position.adjusted = { left: 0, top: 0 }; }

            // Call API method
            callback.originalEvent = $.extend({}, event);
            tooltip.trigger(callback, [self, position, viewport.elem || viewport]);
            if(callback.isDefaultPrevented()){ return self; }
            delete position.adjusted;

            // If effect is disabled, target it mouse, no animation is defined or positioning gives NaN out, set CSS directly
            if(effect === FALSE || !visible || isNaN(position.left) || isNaN(position.top) || target === 'mouse' || !$.isFunction(posOptions.effect)) {
                tooltip.css(position);
            }

            // Use custom function if provided
            else if($.isFunction(posOptions.effect)) {
                posOptions.effect.call(tooltip, self, $.extend({}, position));
                tooltip.queue(function(next) {
                    // Reset attributes to avoid cross-browser rendering bugs
                    $(this).css({ opacity: '', height: '' });
                    if($.browser.msie) { this.style.removeAttribute('filter'); }

                    next();
                });
            }

            // Set positioning flag
            isPositioning = 0;

            return self;
        },

        // Max/min width simulator function for all browsers.. yeaaah!
        redraw: function()
        {
            if(self.rendered < 1 || isDrawing) { return self; }

            var container = options.position.container,
                perc, width, max, min;

            // Set drawing flag
            isDrawing = 1;

            // If tooltip has a set height, just set it... like a boss!
            if(options.style.height) { tooltip.css('height', options.style.height); }

            // If tooltip has a set width, just set it... like a boss!
            if(options.style.width) { tooltip.css('width', options.style.width); }

            // Otherwise simualte max/min width...
            else {
                // Reset width and add fluid class
                tooltip.css('width', '').addClass(fluidClass);

                // Grab our tooltip width (add 1 so we don't get wrapping problems.. huzzah!)
                width = tooltip.width() + 1;

                // Grab our max/min properties
                max = tooltip.css('max-width') || '';
                min = tooltip.css('min-width') || '';

                // Parse into proper pixel values
                perc = (max + min).indexOf('%') > -1 ? container.width() / 100 : 0;
                max = ((max.indexOf('%') > -1 ? perc : 1) * parseInt(max, 10)) || width;
                min = ((min.indexOf('%') > -1 ? perc : 1) * parseInt(min, 10)) || 0;

                // Determine new dimension size based on max/min/current values
                width = max + min ? Math.min(Math.max(width, min), max) : width;

                // Set the newly calculated width and remvoe fluid class
                tooltip.css('width', Math.round(width)).removeClass(fluidClass);
            }

            // Set drawing flag
            isDrawing = 0;

            return self;
        },

        disable: function(state)
        {
            if('boolean' !== typeof state) {
                state = !(tooltip.hasClass(disabled) || cache.disabled);
            }

            if(self.rendered) {
                tooltip.toggleClass(disabled, state);
                $.attr(tooltip[0], 'aria-disabled', state);
            }
            else {
                cache.disabled = !!state;
            }

            return self;
        },

        enable: function() { return self.disable(FALSE); },

        destroy: function()
        {
            var t = target[0],
                title = $.attr(t, oldtitle),
                elemAPI = target.data('qtip');

            // Destroy tooltip and  any associated plugins if rendered
            if(self.rendered) {
                tooltip.stop(1,0).remove();

                $.each(self.plugins, function() {
                    if(this.destroy) { this.destroy(); }
                });
            }

            // Clear timers and remove bound events
            clearTimeout(self.timers.show);
            clearTimeout(self.timers.hide);
            unassignEvents();

            // If the API if actually this qTip API...
            if(!elemAPI || self === elemAPI) {
                // Remove api object
                $.removeData(t, 'qtip');

                // Reset old title attribute if removed
                if(options.suppress && title) {
                    $.attr(t, 'title', title);
                    target.removeAttr(oldtitle);
                }

                // Remove ARIA attributes
                target.removeAttr('aria-describedby');
            }

            // Remove qTip events associated with this API
            target.unbind('.qtip-'+id);

            // Remove ID from sued id object
            delete usedIDs[self.id];

            return target;
        }
    });
}

// Initialization method
function init(id, opts)
{
    var obj, posOptions, attr, config, title,

    // Setup element references
    elem = $(this),
    docBody = $(document.body),

    // Use document body instead of document element if needed
    newTarget = this === document ? docBody : elem,

    // Grab metadata from element if plugin is present
    metadata = (elem.metadata) ? elem.metadata(opts.metadata) : NULL,

    // If metadata type if HTML5, grab 'name' from the object instead, or use the regular data object otherwise
    metadata5 = opts.metadata.type === 'html5' && metadata ? metadata[opts.metadata.name] : NULL,

    // Grab data from metadata.name (or data-qtipopts as fallback) using .data() method,
    html5 = elem.data(opts.metadata.name || 'qtipopts');

    // If we don't get an object returned attempt to parse it manualyl without parseJSON
    try { html5 = typeof html5 === 'string' ? (new Function("return " + html5))() : html5; }
    catch(e) { log('Unable to parse HTML5 attribute data: ' + html5); }

    // Merge in and sanitize metadata
    config = $.extend(TRUE, {}, QTIP.defaults, opts,
        typeof html5 === 'object' ? sanitizeOptions(html5) : NULL,
        sanitizeOptions(metadata5 || metadata));

    // Re-grab our positioning options now we've merged our metadata and set id to passed value
    posOptions = config.position;
    config.id = id;

    // Setup missing content if none is detected
    if('boolean' === typeof config.content.text) {
        attr = elem.attr(config.content.attr);

        // Grab from supplied attribute if available
        if(config.content.attr !== FALSE && attr) { config.content.text = attr; }

        // No valid content was found, abort render
        else {
            log('Unable to locate content for tooltip! Aborting render of tooltip on element: ', elem);
            return FALSE;
        }
    }

    // Setup target options
    if(!posOptions.container.length) { posOptions.container = docBody; }
    if(posOptions.target === FALSE) { posOptions.target = newTarget; }
    if(config.show.target === FALSE) { config.show.target = newTarget; }
    if(config.show.solo === TRUE) { config.show.solo = posOptions.container.closest('body'); }
    if(config.hide.target === FALSE) { config.hide.target = newTarget; }
    if(config.position.viewport === TRUE) { config.position.viewport = posOptions.container; }

    // Ensure we only use a single container
    posOptions.container = posOptions.container.eq(0);

    // Convert position corner values into x and y strings
    posOptions.at = new PLUGINS.Corner(posOptions.at);
    posOptions.my = new PLUGINS.Corner(posOptions.my);

    // Destroy previous tooltip if overwrite is enabled, or skip element if not
    if($.data(this, 'qtip')) {
        if(config.overwrite) {
            elem.qtip('destroy');
        }
        else if(config.overwrite === FALSE) {
            return FALSE;
        }
    }

    // Remove title attribute and store it if present
    if(config.suppress && (title = $.attr(this, 'title'))) {
        $(this).removeAttr('title').attr(oldtitle, title);
    }

    // Initialize the tooltip and add API reference
    obj = new QTip(elem, config, id, !!attr);
    $.data(this, 'qtip', obj);

    // Catch remove/removeqtip events on target element to destroy redundant tooltip
    elem.bind('remove.qtip-'+id+' removeqtip.qtip-'+id, function(){ obj.destroy(); });

    return obj;
}

// jQuery $.fn extension method
QTIP = $.fn.qtip = function(options, notation, newValue)
{
    var command = ('' + options).toLowerCase(), // Parse command
        returned = NULL,
        args = $.makeArray(arguments).slice(1),
        event = args[args.length - 1],
        opts = this[0] ? $.data(this[0], 'qtip') : NULL;

    // Check for API request
    if((!arguments.length && opts) || command === 'api') {
        return opts;
    }

    // Execute API command if present
    else if('string' === typeof options)
    {
        this.each(function()
        {
            var api = $.data(this, 'qtip');
            if(!api) { return TRUE; }

            // Cache the event if possible
            if(event && event.timeStamp) { api.cache.event = event; }

            // Check for specific API commands
            if((command === 'option' || command === 'options') && notation) {
                if($.isPlainObject(notation) || newValue !== undefined) {
                    api.set(notation, newValue);
                }
                else {
                    returned = api.get(notation);
                    return FALSE;
                }
            }

            // Execute API command
            else if(api[command]) {
                api[command].apply(api[command], args);
            }
        });

        return returned !== NULL ? returned : this;
    }

    // No API commands. validate provided options and setup qTips
    else if('object' === typeof options || !arguments.length)
    {
        opts = sanitizeOptions($.extend(TRUE, {}, options));

        // Bind the qTips
        return QTIP.bind.call(this, opts, event);
    }
};

// $.fn.qtip Bind method
QTIP.bind = function(opts, event)
{
    return this.each(function(i) {
        var options, targets, events, namespace, api, id;

        // Find next available ID, or use custom ID if provided
        id = $.isArray(opts.id) ? opts.id[i] : opts.id;
        id = !id || id === FALSE || id.length < 1 || usedIDs[id] ? QTIP.nextid++ : (usedIDs[id] = id);

        // Setup events namespace
        namespace = '.qtip-'+id+'-create';

        // Initialize the qTip and re-grab newly sanitized options
        api = init.call(this, id, opts);
        if(api === FALSE) { return TRUE; }
        options = api.options;

        // Initialize plugins
        $.each(PLUGINS, function() {
            if(this.initialize === 'initialize') { this(api); }
        });

        // Determine hide and show targets
        targets = { show: options.show.target, hide: options.hide.target };
        events = {
            show: $.trim('' + options.show.event).replace(/ /g, namespace+' ') + namespace,
            hide: $.trim('' + options.hide.event).replace(/ /g, namespace+' ') + namespace
        };

        /*
         * Make sure hoverIntent functions properly by using mouseleave as a hide event if
         * mouseenter/mouseout is used for show.event, even if it isn't in the users options.
         */
        if(/mouse(over|enter)/i.test(events.show) && !/mouse(out|leave)/i.test(events.hide)) {
            events.hide += ' mouseleave' + namespace;
        }

        /*
         * Also make sure initial mouse targetting works correctly by caching mousemove coords
         * on show targets before the tooltip has rendered.
         *
         * Also set onTarget when triggered to keep mouse tracking working
         */
        targets.show.bind('mousemove'+namespace, function(event) {
            MOUSE = { pageX: event.pageX, pageY: event.pageY, type: 'mousemove' };
            api.cache.onTarget = TRUE;
        });

        // Define hoverIntent function
        function hoverIntent(event) {
            function render() {
                // Cache mouse coords,render and render the tooltip
                api.render(typeof event === 'object' || options.show.ready);

                // Unbind show and hide events
                targets.show.add(targets.hide).unbind(namespace);
            }

            // Only continue if tooltip isn't disabled
            if(api.cache.disabled) { return FALSE; }

            // Cache the event data
            api.cache.event = $.extend({}, event);
            api.cache.target = event ? $(event.target) : [undefined];

            // Start the event sequence
            if(options.show.delay > 0) {
                clearTimeout(api.timers.show);
                api.timers.show = setTimeout(render, options.show.delay);
                if(events.show !== events.hide) {
                    targets.hide.bind(events.hide, function() { clearTimeout(api.timers.show); });
                }
            }
            else { render(); }
        }

        // Bind show events to target
        targets.show.bind(events.show, hoverIntent);

        // Prerendering is enabled, create tooltip now
        if(options.show.ready || options.prerender) { hoverIntent(event); }
    });
};

// Setup base plugins
PLUGINS = QTIP.plugins = {
    // Corner object parser
    Corner: function(corner) {
        corner = ('' + corner).replace(/([A-Z])/, ' $1').replace(/middle/gi, 'center').toLowerCase();
        this.x = (corner.match(/left|right/i) || corner.match(/center/) || ['inherit'])[0].toLowerCase();
        this.y = (corner.match(/top|bottom|center/i) || ['inherit'])[0].toLowerCase();

        var f = corner.charAt(0); this.precedance = (f === 't' || f === 'b' ? 'y' : 'x');

        this.string = function() { return this.precedance === 'y' ? this.y+this.x : this.x+this.y; };
        this.abbrev = function() {
            var x = this.x.substr(0,1), y = this.y.substr(0,1);
            return x === y ? x : (x === 'c' || (x !== 'c' && y !== 'c')) ? y + x : x + y;
        };

        this.clone = function() {
            return { x: this.x, y: this.y, precedance: this.precedance, string: this.string, abbrev: this.abbrev, clone: this.clone };
        };
    },

    // Custom (more correct for qTip!) offset calculator
    offset: function(elem, container) {
        var pos = elem.offset(),
            docBody = elem.closest('body')[0],
            parent = container, scrolled,
            coffset, overflow;

        function scroll(e, i) {
            pos.left += i * e.scrollLeft();
            pos.top += i * e.scrollTop();
        }

        if(parent) {
            // Compensate for non-static containers offset
            do {
                if(parent.css('position') !== 'static') {
                    coffset = parent.position();

                    // Account for element positioning, borders and margins
                    pos.left -= coffset.left + (parseInt(parent.css('borderLeftWidth'), 10) || 0) + (parseInt(parent.css('marginLeft'), 10) || 0);
                    pos.top -= coffset.top + (parseInt(parent.css('borderTopWidth'), 10) || 0) + (parseInt(parent.css('marginTop'), 10) || 0);

                    // If this is the first parent element with an overflow of "scroll" or "auto", store it
                    if(!scrolled && (overflow = parent.css('overflow')) !== 'hidden' && overflow !== 'visible') { scrolled = parent; }
                }
            }
            while((parent = $(parent[0].offsetParent)).length);

            // Compensate for containers scroll if it also has an offsetParent
            if(scrolled && scrolled[0] !== docBody) { scroll( scrolled, 1 ); }
        }

        return pos;
    },

    /*
     * iOS 3.2 - 4.0 scroll fix detection used in offset() function.
     */
    iOS: parseFloat(
        ('' + (/CPU.*OS ([0-9_]{1,3})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
            .replace('undefined', '3_2').replace('_','.')
    ) || FALSE,

    /*
     * jQuery-specific $.fn overrides
     */
    fn: {
        /* Allow other plugins to successfully retrieve the title of an element with a qTip applied */
        attr: function(attr, val) {
            if(this.length) {
                var self = this[0],
                    title = 'title',
                    api = $.data(self, 'qtip');

                if(attr === title && api && 'object' === typeof api && api.options.suppress) {
                    if(arguments.length < 2) {
                        return $.attr(self, oldtitle);
                    }
                    else {
                        // If qTip is rendered and title was originally used as content, update it
                        if(api && api.options.content.attr === title && api.cache.attr) {
                            api.set('content.text', val);
                        }

                        // Use the regular attr method to set, then cache the result
                        return this.attr(oldtitle, val);
                    }
                }
            }

            return $.fn['attr'+replaceSuffix].apply(this, arguments);
        },

        /* Allow clone to correctly retrieve cached title attributes */
        clone: function(keepData) {
            var titles = $([]), title = 'title',

            // Clone our element using the real clone method
            elems = $.fn['clone'+replaceSuffix].apply(this, arguments);

            // Grab all elements with an oldtitle set, and change it to regular title attribute, if keepData is false
            if(!keepData) {
                elems.filter('['+oldtitle+']').attr('title', function() {
                    return $.attr(this, oldtitle);
                })
                .removeAttr(oldtitle);
            }

            return elems;
        }
    }
};

// Apply the fn overrides above
$.each(PLUGINS.fn, function(name, func) {
    if(!func || $.fn[name+replaceSuffix]) { return TRUE; }

    var old = $.fn[name+replaceSuffix] = $.fn[name];
    $.fn[name] = function() {
        return func.apply(this, arguments) || old.apply(this, arguments);
    };
});

/* Fire off 'removeqtip' handler in $.cleanData if jQuery UI not present (it already does similar).
 * This snippet is taken directly from jQuery UI source code found here:
 *     http://code.jquery.com/ui/jquery-ui-git.js
 */
if(!$.ui) {
    $['cleanData'+replaceSuffix] = $.cleanData;
    $.cleanData = function( elems ) {
        for(var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
            try { $( elem ).triggerHandler('removeqtip'); }
            catch( e ) {}
        }
        $['cleanData'+replaceSuffix]( elems );
    };
}

// Set global qTip properties
QTIP.version = 'nightly';
QTIP.nextid = 0;
QTIP.inactiveEvents = 'click dblclick mousedown mouseup mousemove mouseleave mouseenter'.split(' ');
QTIP.zindex = 15000;

// Define configuration defaults
QTIP.defaults = {
    prerender: FALSE,
    id: FALSE,
    overwrite: TRUE,
    suppress: TRUE,
    content: {
        text: TRUE,
        attr: 'title',
        title: {
            text: FALSE,
            button: FALSE
        }
    },
    position: {
        my: 'top left',
        at: 'bottom right',
        target: FALSE,
        container: FALSE,
        viewport: FALSE,
        adjust: {
            x: 0, y: 0,
            mouse: TRUE,
            resize: TRUE,
            method: 'flip flip'
        },
        effect: function(api, pos, viewport) {
            $(this).animate(pos, {
                duration: 200,
                queue: FALSE
            });
        }
    },
    show: {
        target: FALSE,
        event: 'mouseenter',
        effect: TRUE,
        delay: 90,
        solo: FALSE,
        ready: FALSE,
        autofocus: FALSE
    },
    hide: {
        target: FALSE,
        event: 'mouseleave',
        effect: TRUE,
        delay: 0,
        fixed: FALSE,
        inactive: FALSE,
        leave: 'window',
        distance: FALSE
    },
    style: {
        classes: '',
        widget: FALSE,
        width: FALSE,
        height: FALSE,
        def: TRUE
    },
    events: {
        render: NULL,
        move: NULL,
        show: NULL,
        hide: NULL,
        toggle: NULL,
        visible: NULL,
        hidden: NULL,
        focus: NULL,
        blur: NULL
    }
};

function Ajax(api)
{
    var self = this,
        tooltip = api.elements.tooltip,
        opts = api.options.content.ajax,
        namespace = '.qtip-ajax',
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        first = TRUE,
        destroyed = FALSE,
        stop = FALSE,
        xhr;

    api.checks.ajax = {
        '^content.ajax': function(obj, name, v) {
            // If content.ajax object was reset, set our local var
            if(name === 'ajax') { opts = v; }

            if(name === 'once') {
                self.init();
            }
            else if(opts && opts.url) {
                self.load();
            }
            else {
                tooltip.unbind(namespace);
            }
        }
    };

    $.extend(self, {
        init: function() {
            // Make sure ajax options are enabled and bind event
            if(opts && opts.url) {
                tooltip.unbind(namespace)[ opts.once ? 'one' : 'bind' ]('tooltipshow'+namespace, self.load);
            }

            return self;
        },

        load: function(event) {
            if(stop) {stop = FALSE; return; }

            var hasSelector = opts.url.indexOf(' '),
                url = opts.url,
                selector,
                hideFirst = !opts.loading && first;

            // If loading option is disabled, prevent the tooltip showing until we've completed the request
            if(hideFirst) { try{ event.preventDefault(); } catch(e) {} }

            // Make sure default event hasn't been prevented
            else if(event && event.isDefaultPrevented()) { return self; }

            // Cancel old request
            if(xhr && xhr.abort) { xhr.abort(); }

            // Check if user delcared a content selector like in .load()
            if(hasSelector > -1) {
                selector = url.substr(hasSelector);
                url = url.substr(0, hasSelector);
            }

            // Define common after callback for both success/error handlers
            function after() {
                if(destroyed) { return; }

                // Set first flag to false
                first = FALSE;

                // Re-display tip if loading and first time, and reset first flag
                if(hideFirst) { stop = TRUE; api.show(event.originalEvent); }

                // Call users complete if it was defined
                if($.isFunction(opts.complete)) { opts.complete.apply(this, arguments); }
            }

            // Define success handler
            function successHandler(content) {
                if(destroyed) { return; }

                if(selector) {
                    // Create a dummy div to hold the results and grab the selector element
                    content = $('<div/>')
                        // inject the contents of the document in, removing the scripts
                        // to avoid any 'Permission Denied' errors in IE
                        .append(content.replace(rscript, ""))

                        // Locate the specified elements
                        .find(selector);
                }

                // Set the content
                api.set('content.text', content);
            }

            // Error handler
            function errorHandler(xhr, status, error) {
                if (destroyed || xhr.status === 0) { return; }
                api.set('content.text', status + ': ' + error);
            }

            // Setup $.ajax option object and process the request
            xhr = $.ajax( $.extend({ success: successHandler, error: errorHandler, context: api }, opts, { url: url, complete: after }) );
        },

        destroy: function() {
            // Cancel ajax request if possible
            if(xhr && xhr.abort) { xhr.abort(); }

            // Set destroyed flag
            destroyed = TRUE;
        }
    });

    self.init();
}


PLUGINS.ajax = function(api)
{
    var self = api.plugins.ajax;

    return 'object' === typeof self ? self : (api.plugins.ajax = new Ajax(api));
};

PLUGINS.ajax.initialize = 'render';

// Setup plugin sanitization
PLUGINS.ajax.sanitize = function(options)
{
    var content = options.content, opts;
    if(content && 'ajax' in content) {
        opts = content.ajax;
        if(typeof opts !== 'object') { opts = options.content.ajax = { url: opts }; }
        if('boolean' !== typeof opts.once && opts.once) { opts.once = !!opts.once; }
    }
};

// Extend original api defaults
$.extend(TRUE, QTIP.defaults, {
    content: {
        ajax: {
            loading: TRUE,
            once: TRUE
        }
    }
});

PLUGINS.imagemap = function(area, corner, flip)
{
    if(!area.jquery) { area = $(area); }

    var shape = (area[0].shape || area.attr('shape')).toLowerCase(),
        baseCoords = (area[0].coords || area.attr('coords')).split(','),
        coords = [],
        image = $('img[usemap="#'+area.parent('map').attr('name')+'"]'),
        imageOffset = image.offset(),
        result = {
            width: 0, height: 0,
            offset: { top: 1e10, right: 0, bottom: 0, left: 1e10 }
        },
        i = 0, next = 0, dimensions;

    // POLY area coordinate calculator
    //	Special thanks to Ed Cradock for helping out with this.
    //	Uses a binary search algorithm to find suitable coordinates.
    function polyCoordinates(result, coords, corner)
    {
        var i = 0,
            compareX = 1, compareY = 1,
            realX = 0, realY = 0,
            newWidth = result.width,
            newHeight = result.height;

        // Use a binary search algorithm to locate most suitable coordinate (hopefully)
        while(newWidth > 0 && newHeight > 0 && compareX > 0 && compareY > 0)
        {
            newWidth = Math.floor(newWidth / 2);
            newHeight = Math.floor(newHeight / 2);

            if(corner.x === 'left'){ compareX = newWidth; }
            else if(corner.x === 'right'){ compareX = result.width - newWidth; }
            else{ compareX += Math.floor(newWidth / 2); }

            if(corner.y === 'top'){ compareY = newHeight; }
            else if(corner.y === 'bottom'){ compareY = result.height - newHeight; }
            else{ compareY += Math.floor(newHeight / 2); }

            i = coords.length; while(i--)
            {
                if(coords.length < 2){ break; }

                realX = coords[i][0] - result.offset.left;
                realY = coords[i][1] - result.offset.top;

                if((corner.x === 'left' && realX >= compareX) ||
                (corner.x === 'right' && realX <= compareX) ||
                (corner.x === 'center' && (realX < compareX || realX > (result.width - compareX))) ||
                (corner.y === 'top' && realY >= compareY) ||
                (corner.y === 'bottom' && realY <= compareY) ||
                (corner.y === 'center' && (realY < compareY || realY > (result.height - compareY)))) {
                    coords.splice(i, 1);
                }
            }
        }

        return { left: coords[0][0], top: coords[0][1] };
    }

    // Make sure we account for padding and borders on the image
    imageOffset.left += Math.ceil((image.outerWidth() - image.width()) / 2);
    imageOffset.top += Math.ceil((image.outerHeight() - image.height()) / 2);

    // Parse coordinates into proper array
    if(shape === 'poly') {
        i = baseCoords.length; while(i--)
        {
            next = [ parseInt(baseCoords[--i], 10), parseInt(baseCoords[i+1], 10) ];

            if(next[0] > result.offset.right){ result.offset.right = next[0]; }
            if(next[0] < result.offset.left){ result.offset.left = next[0]; }
            if(next[1] > result.offset.bottom){ result.offset.bottom = next[1]; }
            if(next[1] < result.offset.top){ result.offset.top = next[1]; }

            coords.push(next);
        }
    }
    else {
        coords = $.map(baseCoords, function(coord){ return parseInt(coord, 10); });
    }

    // Calculate details
    switch(shape)
    {
        case 'rect':
            result = {
                width: Math.abs(coords[2] - coords[0]),
                height: Math.abs(coords[3] - coords[1]),
                offset: {
                    left: Math.min(coords[0], coords[2]),
                    top: Math.min(coords[1], coords[3])
                }
            };
        break;

        case 'circle':
            result = {
                width: coords[2] + 2,
                height: coords[2] + 2,
                offset: { left: coords[0], top: coords[1] }
            };
        break;

        case 'poly':
            $.extend(result, {
                width: Math.abs(result.offset.right - result.offset.left),
                height: Math.abs(result.offset.bottom - result.offset.top)
            });

            if(corner.string() === 'centercenter') {
                result.offset = {
                    left: result.offset.left + (result.width / 2),
                    top: result.offset.top + (result.height / 2)
                };
            }
            else {
                result.offset = polyCoordinates(result, coords.slice(), corner);

                // If flip adjustment is enabled, also calculate the closest opposite point
                if(flip && (flip[0] === 'flip' || flip[1] === 'flip')) {
                    result.flipoffset = polyCoordinates(result, coords.slice(), {
                        x: corner.x === 'left' ? 'right' : corner.x === 'right' ? 'left' : 'center',
                        y: corner.y === 'top' ? 'bottom' : corner.y === 'bottom' ? 'top' : 'center'
                    });

                    result.flipoffset.left -= result.offset.left;
                    result.flipoffset.top -= result.offset.top;
                }
            }

            result.width = result.height = 0;
        break;
    }

    // Add image position to offset coordinates
    result.offset.left += imageOffset.left;
    result.offset.top += imageOffset.top;

    return result;
};

// Tip coordinates calculator
function calculateTip(corner, width, height)
{
    var width2 = Math.ceil(width / 2), height2 = Math.ceil(height / 2),

    // Define tip coordinates in terms of height and width values
    tips = {
        bottomright:	[[0,0],				[width,height],		[width,0]],
        bottomleft:		[[0,0],				[width,0],				[0,height]],
        topright:		[[0,height],		[width,0],				[width,height]],
        topleft:			[[0,0],				[0,height],				[width,height]],
        topcenter:		[[0,height],		[width2,0],				[width,height]],
        bottomcenter:	[[0,0],				[width,0],				[width2,height]],
        rightcenter:	[[0,0],				[width,height2],		[0,height]],
        leftcenter:		[[width,0],			[width,height],		[0,height2]]
    };

    // Set common side shapes
    tips.lefttop = tips.bottomright; tips.righttop = tips.bottomleft;
    tips.leftbottom = tips.topright; tips.rightbottom = tips.topleft;

    return tips[ corner.string() ];
}


function Tip(qTip, command)
{
    var self = this,
        opts = qTip.options.style.tip,
        elems = qTip.elements,
        tooltip = elems.tooltip,
        cache = { top: 0, left: 0 },
        size = {
            width: opts.width,
            height: opts.height
        },
        color = { },
        border = opts.border || 0,
        namespace = '.qtip-tip',
        hasCanvas = !!($('<canvas />')[0] || {}).getContext;

    self.corner = NULL;
    self.mimic = NULL;
    self.border = border;
    self.offset = opts.offset;
    self.size = size;

    // Add new option checks for the plugin
    qTip.checks.tip = {
        '^position.my|style.tip.(corner|mimic|border)$': function() {
            // Make sure a tip can be drawn
            if(!self.init()) {
                self.destroy();
            }

            // Reposition the tooltip
            qTip.reposition();
        },
        '^style.tip.(height|width)$': function() {
            // Re-set dimensions and redraw the tip
            size = {
                width: opts.width,
                height: opts.height
            };
            self.create();
            self.update();

            // Reposition the tooltip
            qTip.reposition();
        },
        '^content.title.text|style.(classes|widget)$': function() {
            if(elems.tip) {
                self.update();
            }
        }
    };

    function reposition(event, api, pos, viewport) {
        if(!elems.tip) { return; }

        var newCorner = self.corner.clone(),
            adjust = pos.adjusted,
            method = qTip.options.position.adjust.method.split(' '),
            horizontal = method[0],
            vertical = method[1] || method[0],
            shift = { left: FALSE, top: FALSE, x: 0, y: 0 },
            offset, css = {}, props;

        // Make sure our tip position isn't fixed e.g. doesn't adjust with viewport
        if(self.corner.fixed !== TRUE) {
            // Horizontal - Shift or flip method
            if(horizontal === 'shift' && newCorner.precedance === 'x' && adjust.left && newCorner.y !== 'center') {
                newCorner.precedance = newCorner.precedance === 'x' ? 'y' : 'x';
            }
            else if(horizontal === 'flip' && adjust.left){
                newCorner.x = newCorner.x === 'center' ? (adjust.left > 0 ? 'left' : 'right') : (newCorner.x === 'left' ? 'right' : 'left');
            }

            // Vertical - Shift or flip method
            if(vertical === 'shift' && newCorner.precedance === 'y' && adjust.top && newCorner.x !== 'center') {
                newCorner.precedance = newCorner.precedance === 'y' ? 'x' : 'y';
            }
            else if(vertical === 'flip' && adjust.top) {
                newCorner.y = newCorner.y === 'center' ? (adjust.top > 0 ? 'top' : 'bottom') : (newCorner.y === 'top' ? 'bottom' : 'top');
            }

            // Update and redraw the tip if needed (check cached details of last drawn tip)
            if(newCorner.string() !== cache.corner.string() && (cache.top !== adjust.top || cache.left !== adjust.left)) {
                self.update(newCorner, FALSE);
            }
        }

        // Setup tip offset properties
        offset = self.position(newCorner, adjust);
        if(offset.right !== undefined) { offset.left = -offset.right; }
        if(offset.bottom !== undefined) { offset.top = -offset.bottom; }
        offset.user = Math.max(0, opts.offset);

        // Viewport "shift" specific adjustments
        if(shift.left = (horizontal === 'shift' && !!adjust.left)) {
            if(newCorner.x === 'center') {
                css['margin-left'] = shift.x = offset['margin-left'] - adjust.left;
            }
            else {
                props = offset.right !== undefined ?
                    [ adjust.left, -offset.left ] : [ -adjust.left, offset.left ];

                if( (shift.x = Math.max(props[0], props[1])) > props[0] ) {
                    pos.left -= adjust.left;
                    shift.left = FALSE;
                }

                css[ offset.right !== undefined ? 'right' : 'left' ] = shift.x;
            }
        }
        if(shift.top = (vertical === 'shift' && !!adjust.top)) {
            if(newCorner.y === 'center') {
                css['margin-top'] = shift.y = offset['margin-top'] - adjust.top;
            }
            else {
                props = offset.bottom !== undefined ?
                    [ adjust.top, -offset.top ] : [ -adjust.top, offset.top ];

                if( (shift.y = Math.max(props[0], props[1])) > props[0] ) {
                    pos.top -= adjust.top;
                    shift.top = FALSE;
                }

                css[ offset.bottom !== undefined ? 'bottom' : 'top' ] = shift.y;
            }
        }

        /*
         * If the tip is adjusted in both dimensions, or in a
         * direction that would cause it to be anywhere but the
         * outer border, hide it!
         */
        elems.tip.css(css).toggle(
            !((shift.x && shift.y) || (newCorner.x === 'center' && shift.y) || (newCorner.y === 'center' && shift.x))
        );

        // Adjust position to accomodate tip dimensions
        pos.left -= offset.left.charAt ? offset.user : horizontal !== 'shift' || shift.top || !shift.left && !shift.top ? offset.left : 0;
        pos.top -= offset.top.charAt ? offset.user : vertical !== 'shift' || shift.left || !shift.left && !shift.top ? offset.top : 0;

        // Cache details
        cache.left = adjust.left; cache.top = adjust.top;
        cache.corner = newCorner.clone();
    }

    /* border width calculator */
    function borderWidth(corner, side, backup) {
        side = !side ? corner[corner.precedance] : side;

        var isFluid = tooltip.hasClass(fluidClass),
            isTitleTop = elems.titlebar && corner.y === 'top',
            elem = isTitleTop ? elems.titlebar : elems.content,
            css = 'border-' + side + '-width',
            val;

        // Grab the border-width value (add fluid class if needed)
        tooltip.addClass(fluidClass);
        val = parseInt(elem.css(css), 10);
        val = (backup ? val || parseInt(tooltip.css(css), 10) : val) || 0;
        tooltip.toggleClass(fluidClass, isFluid);

        return val;
    }

    function borderRadius(corner) {
        var isTitleTop = elems.titlebar && corner.y === 'top',
            elem = isTitleTop ? elems.titlebar : elems.content,
            moz = $.browser.mozilla,
            prefix = moz ? '-moz-' : $.browser.webkit ? '-webkit-' : '',
            side = corner.y + (moz ? '' : '-') + corner.x,
            css = prefix + (moz ? 'border-radius-' + side : 'border-' + side + '-radius');

        return parseInt(elem.css(css), 10) || parseInt(tooltip.css(css), 10) || 0;
    }

    function calculateSize(corner) {
        var y = corner.precedance === 'y',
            width = size [ y ? 'width' : 'height' ],
            height = size [ y ? 'height' : 'width' ],
            isCenter = corner.string().indexOf('center') > -1,
            base = width * (isCenter ? 0.5 : 1),
            pow = Math.pow,
            round = Math.round,
            bigHyp, ratio, result,

        smallHyp = Math.sqrt( pow(base, 2) + pow(height, 2) ),

        hyp = [
            (border / base) * smallHyp, (border / height) * smallHyp
        ];
        hyp[2] = Math.sqrt( pow(hyp[0], 2) - pow(border, 2) );
        hyp[3] = Math.sqrt( pow(hyp[1], 2) - pow(border, 2) );

        bigHyp = smallHyp + hyp[2] + hyp[3] + (isCenter ? 0 : hyp[0]);
        ratio = bigHyp / smallHyp;

        result = [ round(ratio * height), round(ratio * width) ];
        return { height: result[ y ? 0 : 1 ], width: result[ y ? 1 : 0 ] };
    }

    $.extend(self, {
        init: function()
        {
            var enabled = self.detectCorner() && (hasCanvas || $.browser.msie);

            // Determine tip corner and type
            if(enabled) {
                // Create a new tip and draw it
                self.create();
                self.update();

                // Bind update events
                tooltip.unbind(namespace).bind('tooltipmove'+namespace, reposition);
            }

            return enabled;
        },

        detectCorner: function()
        {
            var corner = opts.corner,
                posOptions = qTip.options.position,
                at = posOptions.at,
                my = posOptions.my.string ? posOptions.my.string() : posOptions.my;

            // Detect corner and mimic properties
            if(corner === FALSE || (my === FALSE && at === FALSE)) {
                return FALSE;
            }
            else {
                if(corner === TRUE) {
                    self.corner = new PLUGINS.Corner(my);
                }
                else if(!corner.string) {
                    self.corner = new PLUGINS.Corner(corner);
                    self.corner.fixed = TRUE;
                }
            }

            // Cache it
            cache.corner = new PLUGINS.Corner( self.corner.string() );

            return self.corner.string() !== 'centercenter';
        },

        detectColours: function(actual) {
            var i, fill, border,
                tip = elems.tip.css('cssText', ''),
                corner = actual || self.corner,
                precedance = corner[ corner.precedance ],

                borderSide = 'border-' + precedance + '-color',
                borderSideCamel = 'border' + precedance.charAt(0) + precedance.substr(1) + 'Color',

                invalid = /rgba?\(0, 0, 0(, 0)?\)|transparent|#123456/i,
                backgroundColor = 'background-color',
                transparent = 'transparent',
                important = ' !important',

                bodyBorder = $(document.body).css('color'),
                contentColour = qTip.elements.content.css('color'),

                useTitle = elems.titlebar && (corner.y === 'top' || (corner.y === 'center' && tip.position().top + (size.height / 2) + opts.offset < elems.titlebar.outerHeight(1))),
                colorElem = useTitle ? elems.titlebar : elems.content;

            // Apply the fluid class so we can see our CSS values properly
            tooltip.addClass(fluidClass);

            // Detect tip colours from CSS styles
            color.fill = fill = tip.css(backgroundColor);
            color.border = border = tip[0].style[ borderSideCamel ] || tip.css(borderSide) || tooltip.css(borderSide);

            // Make sure colours are valid
            if(!fill || invalid.test(fill)) {
                color.fill = colorElem.css(backgroundColor) || transparent;
                if(invalid.test(color.fill)) {
                    color.fill = tooltip.css(backgroundColor) || fill;
                }
            }
            if(!border || invalid.test(border) || border === bodyBorder) {
                color.border = colorElem.css(borderSide) || transparent;
                if(invalid.test(color.border)) {
                    color.border = border;
                }
            }

            // Reset background and border colours
            $('*', tip).add(tip).css('cssText', backgroundColor+':'+transparent+important+';border:0'+important+';');

            // Remove fluid class
            tooltip.removeClass(fluidClass);
        },

        create: function()
        {
            var width = size.width,
                height = size.height,
                vml;

            // Remove previous tip element if present
            if(elems.tip) { elems.tip.remove(); }

            // Create tip element and prepend to the tooltip
            elems.tip = $('<div />', { 'class': 'ui-tooltip-tip' }).css({ width: width, height: height }).prependTo(tooltip);

            // Create tip drawing element(s)
            if(hasCanvas) {
                // save() as soon as we create the canvas element so FF2 doesn't bork on our first restore()!
                $('<canvas />').appendTo(elems.tip)[0].getContext('2d').save();
            }
            else {
                vml = '<vml:shape coordorigin="0,0" style="display:inline-block; position:absolute; behavior:url(#default#VML);"></vml:shape>';
                elems.tip.html(vml + vml);

                // Prevent mousing down on the tip since it causes problems with .live() handling in IE due to VML
                $('*', elems.tip).bind('click mousedown', function(event) { event.stopPropagation(); });
            }
        },

        update: function(corner, position)
        {
            var tip = elems.tip,
                inner = tip.children(),
                width = size.width,
                height = size.height,
                regular = 'px solid ',
                transparent = 'px dashed transparent', // Dashed IE6 border-transparency hack. Awesome!
                mimic = opts.mimic,
                round = Math.round,
                precedance, context, coords, translate, newSize;

            // Re-determine tip if not already set
            if(!corner) { corner = cache.corner || self.corner; }

            // Use corner property if we detect an invalid mimic value
            if(mimic === FALSE) { mimic = corner; }

            // Otherwise inherit mimic properties from the corner object as necessary
            else {
                mimic = new PLUGINS.Corner(mimic);
                mimic.precedance = corner.precedance;

                if(mimic.x === 'inherit') { mimic.x = corner.x; }
                else if(mimic.y === 'inherit') { mimic.y = corner.y; }
                else if(mimic.x === mimic.y) {
                    mimic[ corner.precedance ] = corner[ corner.precedance ];
                }
            }
            precedance = mimic.precedance;

            // Update our colours
            self.detectColours(corner);

            // Detect border width, taking into account colours
            if(color.border !== 'transparent' && color.border !== '#123456') {
                // Grab border width
                border = borderWidth(corner, NULL, TRUE);

                // If border width isn't zero, use border color as fill (1.0 style tips)
                if(opts.border === 0 && border > 0) { color.fill = color.border; }

                // Set border width (use detected border width if opts.border is true)
                self.border = border = opts.border !== TRUE ? opts.border : border;
            }

            // Border colour was invalid, set border to zero
            else { self.border = border = 0; }

            // Calculate coordinates
            coords = calculateTip(mimic, width , height);

            // Determine tip size
            self.size = newSize = calculateSize(corner);
            tip.css(newSize);

            // Calculate tip translation
            if(corner.precedance === 'y') {
                translate = [
                    round(mimic.x === 'left' ? border : mimic.x === 'right' ? newSize.width - width - border : (newSize.width - width) / 2),
                    round(mimic.y === 'top' ?  newSize.height - height : 0)
                ];
            }
            else {
                translate = [
                    round(mimic.x === 'left' ? newSize.width - width : 0),
                    round(mimic.y === 'top' ? border : mimic.y === 'bottom' ? newSize.height - height - border : (newSize.height - height) / 2)
                ];
            }

            // Canvas drawing implementation
            if(hasCanvas) {
                // Set the canvas size using calculated size
                inner.attr(newSize);

                // Grab canvas context and clear/save it
                context = inner[0].getContext('2d');
                context.restore(); context.save();
                context.clearRect(0,0,3000,3000);

                // Translate origin
                context.translate(translate[0], translate[1]);

                // Draw the tip
                context.beginPath();
                context.moveTo(coords[0][0], coords[0][1]);
                context.lineTo(coords[1][0], coords[1][1]);
                context.lineTo(coords[2][0], coords[2][1]);
                context.closePath();
                context.fillStyle = color.fill;
                context.strokeStyle = color.border;
                context.lineWidth = border * 2;
                context.lineJoin = 'miter';
                context.miterLimit = 100;
                if(border) { context.stroke(); }
                context.fill();
            }

            // VML (IE Proprietary implementation)
            else {
                // Setup coordinates string
                coords = 'm' + coords[0][0] + ',' + coords[0][1] + ' l' + coords[1][0] +
                    ',' + coords[1][1] + ' ' + coords[2][0] + ',' + coords[2][1] + ' xe';

                // Setup VML-specific offset for pixel-perfection
                translate[2] = border && /^(r|b)/i.test(corner.string()) ?
                    parseFloat($.browser.version, 10) === 8 ? 2 : 1 : 0;

                // Set initial CSS
                inner.css({
                    antialias: ''+(mimic.string().indexOf('center') > -1),
                    left: translate[0] - (translate[2] * Number(precedance === 'x')),
                    top: translate[1] - (translate[2] * Number(precedance === 'y')),
                    width: width + border,
                    height: height + border
                })
                .each(function(i) {
                    var $this = $(this);

                    // Set shape specific attributes
                    $this[ $this.prop ? 'prop' : 'attr' ]({
                        coordsize: (width+border) + ' ' + (height+border),
                        path: coords,
                        fillcolor: color.fill,
                        filled: !!i,
                        stroked: !!!i
                    })
                    .css({ display: border || i ? 'block' : 'none' });

                    // Check if border is enabled and add stroke element
                    if(!i && $this.html() === '') {
                        $this.html(
                            '<vml:stroke weight="'+(border*2)+'px" color="'+color.border+'" miterlimit="1000" joinstyle="miter" ' +
                            ' style="behavior:url(#default#VML); display:inline-block;" />'
                        );
                    }
                });
            }

            // Position if needed
            if(position !== FALSE) { self.position(corner); }
        },

        // Tip positioning method
        position: function(corner)
        {
            var tip = elems.tip,
                position = {},
                userOffset = Math.max(0, opts.offset),
                precedance, dimensions, corners;

            // Return if tips are disabled or tip is not yet rendered
            if(opts.corner === FALSE || !tip) { return FALSE; }

            // Inherit corner if not provided
            corner = corner || self.corner;
            precedance = corner.precedance;

            // Determine which tip dimension to use for adjustment
            dimensions = calculateSize(corner);

            // Setup corners and offset array
            corners = [ corner.x, corner.y ];
            if(precedance === 'x') { corners.reverse(); }

            // Calculate tip position
            $.each(corners, function(i, side) {
                var b, br;

                if(side === 'center') {
                    b = precedance === 'y' ? 'left' : 'top';
                    position[ b ] = '50%';
                    position['margin-' + b] = -Math.round(dimensions[ precedance === 'y' ? 'width' : 'height' ] / 2) + userOffset;
                }
                else {
                    b = borderWidth(corner, side, TRUE);
                    br = borderRadius(corner);

                    position[ side ] = i ?
                        border ? borderWidth(corner, side) : 0 :
                        userOffset + (br > b ? br : 0);
                }
            });

            // Adjust for tip dimensions
            position[ corner[precedance] ] -= dimensions[ precedance === 'x' ? 'width' : 'height' ];

            // Set and return new position
            tip.css({ top: '', bottom: '', left: '', right: '', margin: '' }).css(position);
            return position;
        },

        destroy: function()
        {
            // Remov tip and bound events
            if(elems.tip) { elems.tip.remove(); }
            tooltip.unbind(namespace);
        }
    });

    self.init();
}

PLUGINS.tip = function(api)
{
    var self = api.plugins.tip;

    return 'object' === typeof self ? self : (api.plugins.tip = new Tip(api));
};

// Initialize tip on render
PLUGINS.tip.initialize = 'render';

// Setup plugin sanitization options
PLUGINS.tip.sanitize = function(options)
{
    var style = options.style, opts;
    if(style && 'tip' in style) {
        opts = options.style.tip;
        if(typeof opts !== 'object'){ options.style.tip = { corner: opts }; }
        if(!(/string|boolean/i).test(typeof opts.corner)) { opts.corner = TRUE; }
        if(typeof opts.width !== 'number'){ delete opts.width; }
        if(typeof opts.height !== 'number'){ delete opts.height; }
        if(typeof opts.border !== 'number' && opts.border !== TRUE){ delete opts.border; }
        if(typeof opts.offset !== 'number'){ delete opts.offset; }
    }
};

// Extend original qTip defaults
$.extend(TRUE, QTIP.defaults, {
    style: {
        tip: {
            corner: TRUE,
            mimic: FALSE,
            width: 6,
            height: 6,
            border: TRUE,
            offset: 0
        }
    }
});

function Modal(api)
{
    var self = this,
        options = api.options.show.modal,
        elems = api.elements,
        tooltip = elems.tooltip,
        overlaySelector = '#qtip-overlay',
        globalNamespace = '.qtipmodal',
        namespace = globalNamespace + api.id,
        attr = 'is-modal-qtip',
        docBody = $(document.body),
        overlay;

    // Setup option set checks
    api.checks.modal = {
        '^show.modal.(on|blur)$': function() {
            // Initialise
            self.init();

            // Show the modal if not visible already and tooltip is visible
            elems.overlay.toggle( tooltip.is(':visible') );
        }
    };

    $.extend(self, {
        init: function()
        {
            // If modal is disabled... return
            if(!options.on) { return self; }

            // Create the overlay if needed
            overlay = self.create();

            // Add unique attribute so we can grab modal tooltips easily via a selector
            tooltip.attr(attr, TRUE)

            // Set z-index
            .css('z-index', PLUGINS.modal.zindex + $(selector+'['+attr+']').length)

            // Remove previous bound events in globalNamespace
            .unbind(globalNamespace).unbind(namespace)

            // Apply our show/hide/focus modal events
            .bind('tooltipshow'+globalNamespace+' tooltiphide'+globalNamespace, function(event, api, duration) {
                var oEvent = event.originalEvent;

                // Make sure mouseout doesn't trigger a hide when showing the modal and mousing onto backdrop
                if(event.target === tooltip[0]) {
                    if(oEvent && event.type === 'tooltiphide' && /mouse(leave|enter)/.test(oEvent.type) && $(oEvent.relatedTarget).closest(overlay[0]).length) {
                        try { event.preventDefault(); } catch(e) {}
                    }
                    else if(!oEvent || (oEvent && !oEvent.solo)) {
                        self[ event.type.replace('tooltip', '') ](event, duration);
                    }
                }
            })

            // Adjust modal z-index on tooltip focus
            .bind('tooltipfocus'+globalNamespace, function(event) {
                // If focus was cancelled before it reearch us, don't do anything
                if(event.isDefaultPrevented() || event.target !== tooltip[0]) { return; }

                var qtips = $(selector).filter('['+attr+']'),

                // Keep the modal's lower than other, regular qtips
                newIndex = PLUGINS.modal.zindex + qtips.length,
                curIndex = parseInt(tooltip[0].style.zIndex, 10);

                // Set overlay z-index
                overlay[0].style.zIndex = newIndex - 1;

                // Reduce modal z-index's and keep them properly ordered
                qtips.each(function() {
                    if(this.style.zIndex > curIndex) {
                        this.style.zIndex -= 1;
                    }
                });

                // Fire blur event for focused tooltip
                qtips.end().filter('.' + focusClass).qtip('blur', event.originalEvent);

                // Set the new z-index
                tooltip.addClass(focusClass)[0].style.zIndex = newIndex;

                // Prevent default handling
                try { event.preventDefault(); } catch(e) {}
            })

            // Focus any other visible modals when this one hides
            .bind('tooltiphide'+globalNamespace, function(event) {
                if(event.target === tooltip[0]) {
                    $('[' + attr + ']').filter(':visible').not(tooltip).last().qtip('focus', event);
                }
            });

            // Apply keyboard "Escape key" close handler
            if(options.escape) {
                $(window).unbind(namespace).bind('keydown'+namespace, function(event) {
                    if(event.keyCode === 27 && tooltip.hasClass(focusClass)) {
                        api.hide(event);
                    }
                });
            }

            // Apply click handler for blur option
            if(options.blur) {
                elems.overlay.unbind(namespace).bind('click'+namespace, function(event) {
                    if(tooltip.hasClass(focusClass)) { api.hide(event); }
                });
            }

            return self;
        },

        create: function()
        {
            var elem = $(overlaySelector);

            // Return if overlay is already rendered
            if(elem.length) {
                // Modal overlay should always be below all tooltips if possible
                return (elems.overlay = elem.insertAfter( $(selector).last() ));
            }

            // Create document overlay
            overlay = elems.overlay = $('<div />', {
                id: overlaySelector.substr(1),
                html: '<div></div>',
                mousedown: function() { return FALSE; }
            })
            .insertAfter( $(selector).last() );

            // Update position on window resize or scroll
            function resize() {
                overlay.css({
                    height: $(window).height(),
                    width: $(window).width()
                });
            }
            $(window).unbind(globalNamespace).bind('resize'+globalNamespace, resize);
            resize(); // Fire it initially too

            return overlay;
        },

        toggle: function(event, state, duration)
        {
            // Make sure default event hasn't been prevented
            if(event && event.isDefaultPrevented()) { return self; }

            var effect = options.effect,
                type = state ? 'show': 'hide',
                visible = overlay.is(':visible'),
                modals = $('[' + attr + ']').filter(':visible').not(tooltip),
                zindex;

            // Create our overlay if it isn't present already
            if(!overlay) { overlay = self.create(); }

            // Prevent modal from conflicting with show.solo, and don't hide backdrop is other modals are visible
            if((overlay.is(':animated') && visible === state) || (!state && modals.length)) { return self; }

            // State specific...
            if(state) {
                // Set position
                overlay.css({ left: 0, top: 0 });

                // Toggle backdrop cursor style on show
                overlay.toggleClass('blurs', options.blur);

                // Make sure we can't focus anything outside the tooltip
                docBody.bind('focusin'+namespace, function(event) {
                    var target = $(event.target),
                        container = target.closest('.qtip'),

                    // Determine if input container target is above this
                    targetOnTop = container.length < 1 ? FALSE :
                        (parseInt(container[0].style.zIndex, 10) > parseInt(tooltip[0].style.zIndex, 10));

                    // If we're showing a modal, but focus has landed on an input below
                    // this modal, divert focus to the first visible input in this modal
                    if(!targetOnTop && ($(event.target).closest(selector)[0] !== tooltip[0])) {
                        tooltip.find('input:visible').filter(':first').focus();
                    }
                });
            }
            else {
                // Undelegate focus handler
                docBody.undelegate('*', 'focusin'+namespace);
            }

            // Stop all animations
            overlay.stop(TRUE, FALSE);

            // Use custom function if provided
            if($.isFunction(effect)) {
                effect.call(overlay, state);
            }

            // If no effect type is supplied, use a simple toggle
            else if(effect === FALSE) {
                overlay[ type ]();
            }

            // Use basic fade function
            else {
                overlay.fadeTo( parseInt(duration, 10) || 90, state ? 1 : 0, function() {
                    if(!state) { $(this).hide(); }
                });
            }

            // Reset position on hide
            if(!state) {
                overlay.queue(function(next) {
                    overlay.css({ left: '', top: '' });
                    next();
                });
            }

            return self;
        },

        show: function(event, duration) { return self.toggle(event, TRUE, duration); },
        hide: function(event, duration) { return self.toggle(event, FALSE, duration); },

        destroy: function()
        {
            var delBlanket = overlay;

            if(delBlanket) {
                // Check if any other modal tooltips are present
                delBlanket = $('[' + attr + ']').not(tooltip).length < 1;

                // Remove overlay if needed
                if(delBlanket) {
                    elems.overlay.remove();
                    $(window).unbind(globalNamespace);
                }
                else {
                    elems.overlay.unbind(globalNamespace+api.id);
                }

                // Undelegate focus handler
                docBody.undelegate('*', 'focusin'+namespace);
            }

            // Remove bound events
            return tooltip.removeAttr(attr).unbind(globalNamespace);
        }
    });

    self.init();
}

PLUGINS.modal = function(api) {
    var self = api.plugins.modal;

    return 'object' === typeof self ? self : (api.plugins.modal = new Modal(api));
};

// Plugin needs to be initialized on render
PLUGINS.modal.initialize = 'render';

// Setup sanitiztion rules
PLUGINS.modal.sanitize = function(opts) {
    if(opts.show) {
        if(typeof opts.show.modal !== 'object') { opts.show.modal = { on: !!opts.show.modal }; }
        else if(typeof opts.show.modal.on === 'undefined') { opts.show.modal.on = TRUE; }
    }
};

// Base z-index for all modal tooltips (use qTip core z-index as a base)
PLUGINS.modal.zindex = QTIP.zindex + 1000;

// Extend original api defaults
$.extend(TRUE, QTIP.defaults, {
    show: {
        modal: {
            on: FALSE,
            effect: TRUE,
            blur: TRUE,
            escape: TRUE
        }
    }
});


}));
(function() {

  (function($, window, document, undefined_) {
    var multiDropID, prop, _ref;
    prop = function(n) {
      if (n && n.constructor === Number) {
        return n + "px";
      } else {
        return n;
      }
    };
    $.fn.bgiframe = ($.browser.msie && /msie 6\.0/i.test(navigator.userAgent) ? function(s) {
      var html;
      s = $.extend({
        top: "auto",
        left: "auto",
        width: "auto",
        height: "auto",
        opacity: true,
        src: "javascript:false;"
      }, s);
      html = "<iframe class=\"bgiframe\"frameborder=\"0\"tabindex=\"-1\"src=\"" + s.src + "\"" + "style=\"display:block;position:absolute;z-index:-1;" + (s.opacity !== false ? "filter:Alpha(Opacity='0');" : "") + "top:" + (s.top === "auto" ? "expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+'px')" : prop(s.top)) + ";" + "left:" + (s.left === "auto" ? "expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+'px')" : prop(s.left)) + ";" + "width:" + (s.width === "auto" ? "expression(this.parentNode.offsetWidth+'px')" : prop(s.width)) + ";" + "height:" + (s.height === "auto" ? "expression(this.parentNode.offsetHeight+'px')" : prop(s.height)) + ";" + "\"/>";
      return this.each(function() {
        if ($(this).children("iframe.bgiframe").length === 0) {
          return this.insertBefore(document.createElement(html), this.firstChild);
        }
      });
    } : function() {
      return this;
    });
    $.fn.bgIframe = $.fn.bgiframe;
    if ((_ref = $.P2) == null) {
      $.P2 = {};
    }
    multiDropID = 0;
    return $.widget("P2.multiDrop", {
      options: {
        header: true,
        footer: true,
        main: true,
        height: 10,
        minWidth: 225,
        classes: "six columns",
        checkAllText: "Chọn tất cả",
        uncheckAllText: "Bỏ chọn tất cả",
        noneSelectedText: "Select options",
        selectedText: "# được chọn",
        selectedList: 1,
        show: "",
        hide: "",
        autoOpen: false,
        multiple: true,
        position: {
          my: "top",
          at: "bottom",
          collision: "none none"
        }
      },
      _create: function() {
        var button, buttonlabel, checkboxContainer, drop, el, footer, footerLinkContainer, header, headerLinkContainer, main, o;
        el = this.element.hide();
        o = this.options;
        this.speed = $.fx.speeds._default;
        this._isOpen = false;
        drop = (this.drop = $("<div class=\"custom dropdown\"></div>")).insertAfter(el);
        button = (this.button = $("<div class=\"clear\" href=''></div>")).attr({
          title: el.attr("title"),
          "aria-haspopup": true,
          tabIndex: el.attr("tabIndex")
        }).appendTo(drop);
        buttonlabel = (this.buttonlabel = $("<a />").addClass("current")).html(o.noneSelectedText).appendTo(button).after('<a class="selector" href="#"></a>');
        main = (this.main = $("<ul />")).addClass("multiDropMain").appendTo(drop);
        header = (this.header = $("<div />")).addClass("multiDropHeader clearfix").appendTo(main);
        headerLinkContainer = (this.headerLinkContainer = $("<div />")).addClass("reset").html(function() {
          if (o.header === true) {
            return "<a class=\"multiDropAll\" href=\"#\"><span>" + o.checkAllText + "</span></a>";
          } else if (typeof o.header === "string") {
            return "<div>" + o.header + "</div>";
          } else {
            return "";
          }
        }).appendTo(header);
        checkboxContainer = (this.checkboxContainer = $("<div />")).addClass("multiDrop reset").appendTo(main);
        footer = (this.footer = $("<div />")).addClass("multiDropfooter").appendTo(main);
        footerLinkContainer = (this.footerLinkContainer = $("<div />")).addClass("multiDropFooter clearfix reset").html(function() {
          if (o.footer === true) {
            return "<a class=\"multiDropNone\" href=\"#\"><span>" + o.uncheckAllText + "</span></a>";
          } else if (typeof o.footer === "string") {
            return "<div>" + o.footer + "</div>";
          } else {
            return "";
          }
        }).append("<a href=\"#\" class=\"close multiDropClose\">[X]</a>").appendTo(footer);
        header = (this.header = header.add(footer));
        this._bindEvents();
        this.refresh(true);
        if (!o.multiple) {
          return main.addClass("multiDropSingle");
        }
      },
      _init: function() {
        if (this.options.header === false) {
          this.header.hide();
        }
        if (!this.options.multiple) {
          this.headerLinkContainer.find(".multiDropAll, .multiDropNone").hide();
        }
        if (this.options.autoOpen) {
          this.open();
        }
        if (this.element.is(":disabled")) {
          return this.disable();
        }
      },
      refresh: function(init) {
        var checkboxContainer, el, html, id, main, o, optgroups;
        el = this.element;
        o = this.options;
        main = this.main;
        checkboxContainer = this.checkboxContainer;
        optgroups = [];
        html = "";
        id = el.attr("id") || multiDropID++;
        el.find("option").each(function(i) {
          var $this, description, inputID, isDisabled, isSelected, labelClasses, optLabel, parent, title, value;
          $this = $(this);
          parent = this.parentNode;
          title = this.innerHTML;
          description = this.title;
          value = this.value;
          inputID = "multiDrop-" + (this.id || id + "-option-" + i);
          isDisabled = this.disabled;
          isSelected = this.selected;
          labelClasses = [""];
          optLabel = void 0;
          if (parent.tagName === "OPTGROUP") {
            optLabel = parent.getAttribute("label");
            if ($.inArray(optLabel, optgroups) === -1) {
              html += "<li class=\"multiDrop-optgroup-label\"><a href=\"#\">" + optLabel + "</a></li>";
              optgroups.push(optLabel);
            }
          }
          if (isDisabled) {
            labelClasses.push("disabled");
          }
          if (isSelected && !o.multiple) {
            labelClasses.push("active");
          }
          html += "<li class=\"" + (isDisabled ? "multiDropDisabled" : "") + "\">";
          html += "<label for=\"" + inputID + "\" title=\"" + description + "\" class=\"" + labelClasses.join(" ") + "\">";
          html += "<input id=\"" + inputID + "\" name=\"multiDrop_" + id + "\" type=\"" + (o.multiple ? "checkbox" : "radio") + "\" value=\"" + value + "\" title=\"" + title + "\"";
          if (isSelected) {
            html += " checked=\"checked\"";
            html += " aria-selected=\"true\"";
          }
          if (isDisabled) {
            html += " disabled=\"disabled\"";
            html += " ariaDisabled=\"true\"";
          }
          return html += " /><span>" + title + "</span></label></li>";
        });
        checkboxContainer.html(html);
        this.labels = main.find("label");
        this.inputs = this.labels.children("input");
        this._setButtonWidth();
        this._setmainWidth();
        this.button[0].defaultValue = this.update();
        if (!init) {
          return this._trigger("refresh");
        }
      },
      update: function() {
        var $checked, $inputs, numChecked, o, value;
        o = this.options;
        el = this.element;
        $inputs = this.inputs;
        $checked = $inputs.filter(":checked");
        numChecked = $checked.length;
        value = void 0;
        if (numChecked === 0) {
          value = el.data('empty_label') || o.noneSelectedText;
        } else {
          if ($.isFunction(o.selectedText)) {
            value = o.selectedText.call(this, numChecked, $inputs.length, $checked.get());
          } else if (/\d/.test(o.selectedList) && o.selectedList > 0 && numChecked <= o.selectedList) {
            value = $checked.map(function() {
              return $(this).next().html();
            }).get().join(", ");
          } else {
            value = o.selectedText.replace("#", numChecked).replace("#", $inputs.length);
          }
        }
        this.buttonlabel.html(value);
        return value;
      },
      _bindEvents: function() {
        var button, clickHandler, self;
        clickHandler = function() {
          self[(self._isOpen ? "close" : "open")]();
          return false;
        };
        self = this;
        button = this.button;
        button.find("span").bind("click.multiDrop", clickHandler);
        button.bind({
          click: clickHandler,
          keypress: function(e) {
            switch (e.which) {
              case 27:
              case 38:
              case 37:
                return self.close();
              case 39:
              case 40:
                return self.open();
            }
          },
          mouseenter: function() {
            if (!button.hasClass("disabled")) {
              return $(this).addClass("hover");
            }
          },
          mouseleave: function() {
            return $(this).removeClass("hover");
          },
          focus: function() {
            if (!button.hasClass("disabled")) {
              return $(this).addClass("focus");
            }
          },
          blur: function() {
            return $(this).removeClass("focus");
          }
        });
        this.header.delegate("a", "click.multiDrop", function(e) {
          if ($(this).hasClass("multiDropClose")) {
            self.close();
          } else {
            self[($(this).hasClass("multiDropAll") ? "checkAll" : "uncheckAll")]();
          }
          return e.preventDefault();
        });
        this.main.delegate("li.multiDrop-optgroup-label a", "click.multiDrop", function(e) {
          var $inputs, $this, label, nodes;
          e.preventDefault();
          $this = $(this);
          $inputs = $this.parent().nextUntil("li.multiDrop-optgroup-label").find("input:visible:not(:disabled)");
          nodes = $inputs.get();
          label = $this.parent().text();
          if (self._trigger("beforeoptgrouptoggle", e, {
            inputs: nodes,
            label: label
          }) === false) {
            return;
          }
          self._toggleChecked($inputs.filter(":checked").length !== $inputs.length, $inputs);
          return self._trigger("optgrouptoggle", e, {
            inputs: nodes,
            label: label,
            checked: nodes[0].checked
          });
        }).delegate("label", "mouseenter.multiDrop", function() {
          if (!$(this).hasClass("disabled")) {
            self.labels.removeClass("hover");
            return $(this).addClass("hover").find("input").focus();
          }
        }).delegate("label", "keydown.multiDrop", function(e) {
          e.preventDefault();
          switch (e.which) {
            case 9:
            case 27:
              return self.close();
            case 38:
            case 40:
            case 37:
            case 39:
              return self._traverse(e.which, this);
            case 13:
              return $(this).find("input")[0].click();
          }
        }).delegate("input[type=\"checkbox\"], input[type=\"radio\"]", "click.multiDrop", function(e) {
          var $this, checked, tags, val;
          $this = $(this);
          val = this.value;
          checked = this.checked;
          tags = self.element.find("option");
          if (this.disabled || self._trigger("click", e, {
            value: val,
            text: this.title,
            checked: checked
          }) === false) {
            e.preventDefault();
            return;
          }
          $this.focus();
          $this.attr("aria-selected", checked);
          tags.each(function() {
            if (this.value === val) {
              return this.selected = checked;
            } else {
              if (!self.options.multiple) {
                return this.selected = false;
              }
            }
          });
          if (!self.options.multiple) {
            self.labels.removeClass("active");
            $this.closest("label").toggleClass("active", checked);
            self.close();
          }
          self.element.trigger("change");
          return setTimeout($.proxy(self.update, self), 10);
        }).delegate("input[type=\"checkbox\"], input[type=\"radio\"]", "change.multiDrop", function(e) {});
        $(document).bind("mousedown.multiDrop", function(e) {
          if (self._isOpen && !$.contains(self.main[0], e.target) && !$.contains(self.button[0], e.target) && e.target !== self.button[0]) {
            return self.close();
          }
        });
        return $(this.element[0].form).bind("reset.multiDrop", function() {
          return setTimeout($.proxy(self.refresh, self), 10);
        });
      },
      _setButtonWidth: function() {
        var o, width;
        width = this.element.outerWidth();
        o = this.options;
        if (/\d/.test(o.minWidth) && width < o.minWidth) {
          width = o.minWidth;
        }
        return this.button.width(width);
      },
      _setmainWidth: function() {
        var m, o, width;
        o = this.options;
        m = this.drop.add(this.main);
        width = this.button.outerWidth() - parseInt(m.css("padding-left"), 10) - parseInt(m.css("padding-right"), 10) - parseInt(m.css("border-right-width"), 10) - parseInt(m.css("border-left-width"), 10);
        return m.width(width || this.button.outerWidth());
      },
      _traverse: function(which, start) {
        var $container, $next, $start, moveToLast;
        $start = $(start);
        moveToLast = which === 38 || which === 37;
        $next = $start.parent()[(moveToLast ? "prevAll" : "nextAll")]("li:not(.multiDropDisabled, .multiDrop-optgroup-label)")[(moveToLast ? "last" : "first")]();
        if (!$next.length) {
          $container = this.main.find("ul").last();
          this.main.find("label")[(moveToLast ? "last" : "first")]().trigger("mouseover");
          return $container.scrollTop((moveToLast ? $container.height() : 0));
        } else {
          return $next.find("label").trigger("mouseover");
        }
      },
      _toggleState: function(prop, flag) {
        return function() {
          if (!this.disabled) {
            this[prop] = flag;
          }
          if (flag) {
            return this.setAttribute("aria-selected", true);
          } else {
            return this.removeAttribute("aria-selected");
          }
        };
      },
      _toggleChecked: function(flag, group) {
        var $inputs, self, values;
        $inputs = (group && group.length ? group : this.inputs);
        self = this;
        $inputs.each(this._toggleState("checked", flag));
        $inputs.eq(0).focus();
        this.update();
        values = $inputs.map(function() {
          return this.value;
        }).get();
        this.element.find("option").each(function() {
          if (!this.disabled && $.inArray(this.value, values) > -1) {
            return self._toggleState("selected", flag).call(this);
          }
        });
        if ($inputs.length) {
          return this.element.trigger("change");
        }
      },
      _toggleDisabled: function(flag) {
        var inputs, key;
        this.button.attr({
          disabled: flag,
          "ariaDisabled": flag
        })[(flag ? "addClass" : "removeClass")]("disabled");
        inputs = this.main.find("input");
        key = "ech-multiDropDisabled";
        if (flag) {
          inputs = inputs.filter(":enabled").data(key, true);
        } else {
          inputs = inputs.filter(function() {
            return $.data(this, key) === true;
          }).removeData(key);
        }
        inputs.attr({
          disabled: flag,
          "arialDisabled": flag
        }).parent()[(flag ? "addClass" : "removeClass")]("disabled");
        return this.element.attr({
          disabled: flag,
          "ariaDisabled": flag
        });
      },
      open: function(e) {
        var $container, button, effect, height, m, main, o, pos, self, speed;
        self = this;
        button = this.button;
        m = main = this.main;
        speed = this.speed;
        o = this.options;
        if (this._trigger("beforeopen") === false || button.hasClass("disabled") || this._isOpen) {
          return;
        }
        $container = this.checkboxContainer;
        effect = o.show;
        pos = button.offset();
        if ($.isArray(o.show)) {
          effect = o.show[0];
          speed = o.show[1] || self.speed;
        }
        if ($.ui.position && !$.isEmptyObject(o.position)) {
          o.position.of = o.position.of || button;
          main.show().position(o.position).hide().show(effect, speed);
        } else {
          main.css({
            top: pos.top + button.outerHeight(),
            left: pos.left
          }).show(effect, speed);
        }
        height = o.height * m.find('li').first().outerHeight() + parseInt(m.css("padding-top"), 10) + parseInt(m.css("padding-bottom"), 10) + parseInt(m.css("border-bottom-width"), 10) + parseInt(m.css("border-top-width"), 10);
        $container.scrollTop(0).css('max-height', height);
        this.labels.eq(0).trigger("mouseover").trigger("mouseenter").find("input").trigger("focus");
        button.addClass("active");
        this._isOpen = true;
        return this._trigger("open");
      },
      close: function() {
        var effect, o, speed;
        if (this._trigger("beforeclose") === false) {
          return;
        }
        o = this.options;
        effect = o.hide;
        speed = this.speed;
        if ($.isArray(o.hide)) {
          effect = o.hide[0];
          speed = o.hide[1] || this.speed;
        }
        this.main.hide(effect, speed);
        this.button.removeClass("active").trigger("blur").trigger("mouseleave");
        this._isOpen = false;
        return this._trigger("close");
      },
      enable: function() {
        return this._toggleDisabled(false);
      },
      disable: function() {
        return this._toggleDisabled(true);
      },
      checkAll: function(e) {
        this._toggleChecked(true);
        return this._trigger("checkAll");
      },
      uncheckAll: function() {
        this._toggleChecked(false);
        return this._trigger("uncheckAll");
      },
      getChecked: function() {
        return this.main.find("input").filter(":checked");
      },
      destroy: function() {
        $.Widget.prototype.destroy.call(this);
        this.button.remove();
        this.main.remove();
        this.element.show();
        return this;
      },
      isOpen: function() {
        return this._isOpen;
      },
      widget: function() {
        return this.main;
      },
      getButton: function() {
        return this.button;
      },
      _setOption: function(key, value) {
        var main;
        main = this.main;
        switch (key) {
          case "header":
            main.find("div.multiDropHeader")[(value ? "show" : "hide")]();
            break;
          case "checkAllText":
            main.find("a.multiDropAll span").eq(-1).text(value);
            break;
          case "uncheckAllText":
            main.find("a.multiDropNone span").eq(-1).text(value);
            break;
          case "height":
            main.find("ul").last().height(parseInt(value, 10));
            break;
          case "minWidth":
            this.options[key] = parseInt(value, 10);
            this._setButtonWidth();
            this._setmainWidth();
            break;
          case "selectedText":
          case "selectedList":
          case "noneSelectedText":
            this.options[key] = value;
            this.update();
            break;
          case "classes":
            main.add(this.button).removeClass(this.options.classes).addClass(value);
            break;
          case "multiple":
            main.toggleClass("multiDropSingle", !value);
            this.options.multiple = value;
            this.element[0].multiple = value;
            this.refresh();
        }
        return $.Widget.prototype._setOption.apply(this, arguments);
      }
    });
  })(jQuery, window, document);

}).call(this);
/**
 * jQuery Masonry v2.1.04
 * A dynamic layout plugin for jQuery
 * The flip-side of CSS Floats
 * http://masonry.desandro.com
 *
 * Licensed under the MIT license.
 * Copyright 2012 David DeSandro
 */

/*jshint browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */


(function( window, $, undefined ){

  'use strict';

  /*
   * smartresize: debounced resize event for jQuery
   *
   * latest version and complete README available on Github:
   * https://github.com/louisremi/jquery.smartresize.js
   *
   * Copyright 2011 @louis_remi
   * Licensed under the MIT license.
   */

  var $event = $.event,
      resizeTimeout;

  $event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", $event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", $event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
      resizeTimeout = setTimeout(function() {
        $.event.handle.apply( context, args );
      }, execAsap === "execAsap"? 0 : 100 );
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };



// ========================= Masonry ===============================


  // our "Widget" object constructor
  $.Mason = function( options, element ){
    this.element = $( element );

    this._create( options );
    this._init();
  };

  $.Mason.settings = {
    isResizable: true,
    isAnimated: false,
    animationOptions: {
      queue: false,
      duration: 500
    },
    gutterWidth: 0,
    isRTL: false,
    isFitWidth: false,
    containerStyle: {
      position: 'relative'
    }
  };

  $.Mason.prototype = {

    _filterFindBricks: function( $elems ) {
      var selector = this.options.itemSelector;
      // if there is a selector
      // filter/find appropriate item elements
      return !selector ? $elems : $elems.filter( selector ).add( $elems.find( selector ) );
    },

    _getBricks: function( $elems ) {
      var $bricks = this._filterFindBricks( $elems )
        .css({ position: 'absolute' })
        .addClass('masonry-brick');
      return $bricks;
    },

    // sets up widget
    _create : function( options ) {

      this.options = $.extend( true, {}, $.Mason.settings, options );
      this.styleQueue = [];

      // get original styles in case we re-apply them in .destroy()
      var elemStyle = this.element[0].style;
      this.originalStyle = {
        // get height
        height: elemStyle.height || ''
      };
      // get other styles that will be overwritten
      var containerStyle = this.options.containerStyle;
      for ( var prop in containerStyle ) {
        this.originalStyle[ prop ] = elemStyle[ prop ] || '';
      }

      this.element.css( containerStyle );

      this.horizontalDirection = this.options.isRTL ? 'right' : 'left';

      this.offset = {
        x: parseInt( this.element.css( 'padding-' + this.horizontalDirection ), 10 ),
        y: parseInt( this.element.css( 'padding-top' ), 10 )
      };

      this.isFluid = this.options.columnWidth && typeof this.options.columnWidth === 'function';

      // add masonry class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass('masonry');
      }, 0 );

      // bind resize method
      if ( this.options.isResizable ) {
        $(window).bind( 'smartresize.masonry', function() {
          instance.resize();
        });
      }


      // need to get bricks
      this.reloadItems();

    },

    // _init fires when instance is first created
    // and when instance is triggered again -> $el.masonry();
    _init : function( callback ) {
      this._getColumns();
      this._reLayout( callback );
    },

    option: function( key, value ){
      // set options AFTER initialization:
      // signature: $('#foo').bar({ cool:false });
      if ( $.isPlainObject( key ) ){
        this.options = $.extend(true, this.options, key);
      }
    },

    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $bricks, callback ) {

      // place each brick
      for (var i=0, len = $bricks.length; i < len; i++) {
        this._placeBrick( $bricks[i] );
      }

      // set the size of the container
      var containerSize = {};
      containerSize.height = Math.max.apply( Math, this.colYs );
      if ( this.options.isFitWidth ) {
        var unusedCols = 0;
        i = this.cols;
        // count unused columns
        while ( --i ) {
          if ( this.colYs[i] !== 0 ) {
            break;
          }
          unusedCols++;
        }
        // fit container to columns that have been used;
        containerSize.width = (this.cols - unusedCols) * this.columnWidth - this.options.gutterWidth;
      }
      this.styleQueue.push({ $el: this.element, style: containerSize });

      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = !this.isLaidOut ? 'css' : (
            this.options.isAnimated ? 'animate' : 'css'
          ),
          animOpts = this.options.animationOptions;

      // process styleQueue
      var obj;
      for (i=0, len = this.styleQueue.length; i < len; i++) {
        obj = this.styleQueue[i];
        obj.$el[ styleFn ]( obj.style, animOpts );
      }

      // clear out queue for next time
      this.styleQueue = [];

      // provide $elems as context for the callback
      if ( callback ) {
        callback.call( $bricks );
      }

      this.isLaidOut = true;
    },

    // calculates number of columns
    // i.e. this.columnWidth = 200
    _getColumns : function() {
      var container = this.options.isFitWidth ? this.element.parent() : this.element,
          containerWidth = container.width();

                         // use fluid columnWidth function if there
      this.columnWidth = this.isFluid ? this.options.columnWidth( containerWidth ) :
                    // if not, how about the explicitly set option?
                    this.options.columnWidth ||
                    // or use the size of the first item
                    this.$bricks.outerWidth(true) ||
                    // if there's no items, use size of container
                    containerWidth;

      this.columnWidth += this.options.gutterWidth;

      this.cols = Math.floor( ( containerWidth + this.options.gutterWidth ) / this.columnWidth );
      this.cols = Math.max( this.cols, 1 );

    },

    // layout logic
    _placeBrick: function( brick ) {
      var $brick = $(brick),
          colSpan, groupCount, groupY, groupColY, j;

      //how many columns does this brick span
      colSpan = Math.ceil( $brick.outerWidth(true) /
        ( this.columnWidth + this.options.gutterWidth ) );
      colSpan = Math.min( colSpan, this.cols );

      if ( colSpan === 1 ) {
        // if brick spans only one column, just like singleMode
        groupY = this.colYs;
      } else {
        // brick spans more than one column
        // how many different places could this brick fit horizontally
        groupCount = this.cols + 1 - colSpan;
        groupY = [];

        // for each group potential horizontal position
        for ( j=0; j < groupCount; j++ ) {
          // make an array of colY values for that one group
          groupColY = this.colYs.slice( j, j+colSpan );
          // and get the max value of the array
          groupY[j] = Math.max.apply( Math, groupColY );
        }

      }

      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, groupY ),
          shortCol = 0;

      // Find index of short column, the first from the left
      for (var i=0, len = groupY.length; i < len; i++) {
        if ( groupY[i] === minimumY ) {
          shortCol = i;
          break;
        }
      }

      // position the brick
      var position = {
        top: minimumY + this.offset.y
      };
      // position.left or position.right
      position[ this.horizontalDirection ] = this.columnWidth * shortCol + this.offset.x;
      this.styleQueue.push({ $el: $brick, style: position });

      // apply setHeight to necessary columns
      var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = this.cols + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.colYs[ shortCol + i ] = setHeight;
      }

    },


    resize: function() {
      var prevColCount = this.cols;
      // get updated colCount
      this._getColumns();
      if ( this.isFluid || this.cols !== prevColCount ) {
        // if column count has changed, trigger new layout
        this._reLayout();
      }
    },


    _reLayout : function( callback ) {
      // reset columns
      var i = this.cols;
      this.colYs = [];
      while (i--) {
        this.colYs.push( 0 );
      }
      // apply layout logic to all bricks
      this.layout( this.$bricks, callback );
    },

    // ====================== Convenience methods ======================

    // goes through all children again and gets bricks in proper order
    reloadItems : function() {
      this.$bricks = this._getBricks( this.element.children() );
    },


    reload : function( callback ) {
      this.reloadItems();
      this._init( callback );
    },


    // convienence method for working with Infinite Scroll
    appended : function( $content, isAnimatedFromBottom, callback ) {
      if ( isAnimatedFromBottom ) {
        // set new stuff to the bottom
        this._filterFindBricks( $content ).css({ top: this.element.height() });
        var instance = this;
        setTimeout( function(){
          instance._appended( $content, callback );
        }, 1 );
      } else {
        this._appended( $content, callback );
      }
    },

    _appended : function( $content, callback ) {
      var $newBricks = this._getBricks( $content );
      // add new bricks to brick pool
      this.$bricks = this.$bricks.add( $newBricks );
      this.layout( $newBricks, callback );
    },

    // removes elements from Masonry widget
    remove : function( $content ) {
      this.$bricks = this.$bricks.not( $content );
      $content.remove();
    },

    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {

      this.$bricks
        .removeClass('masonry-brick')
        .each(function(){
          this.style.position = '';
          this.style.top = '';
          this.style.left = '';
        });

      // re-apply saved container styles
      var elemStyle = this.element[0].style;
      for ( var prop in this.originalStyle ) {
        elemStyle[ prop ] = this.originalStyle[ prop ];
      }

      this.element
        .unbind('.masonry')
        .removeClass('masonry')
        .removeData('masonry');

      $(window).unbind('.masonry');

    }

  };


  // ======================= imagesLoaded Plugin ===============================
  /*!
   * jQuery imagesLoaded plugin v1.1.0
   * http://github.com/desandro/imagesloaded
   *
   * MIT License. by Paul Irish et al.
   */


  // $('#my-container').imagesLoaded(myFunction)
  // or
  // $('img').imagesLoaded(myFunction)

  // execute a callback when all images have loaded.
  // needed because .load() doesn't work on cached images

  // callback function gets image collection as argument
  //  `this` is the container

  $.fn.imagesLoaded = function( callback ) {
    var $this = this,
        $images = $this.find('img').add( $this.filter('img') ),
        len = $images.length,
        blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        loaded = [];

    function triggerCallback() {
      callback.call( $this, $images );
    }

    function imgLoaded( event ) {
      var img = event.target;
      if ( img.src !== blank && $.inArray( img, loaded ) === -1 ){
        loaded.push( img );
        if ( --len <= 0 ){
          setTimeout( triggerCallback );
          $images.unbind( '.imagesLoaded', imgLoaded );
        }
      }
    }

    // if no images, trigger immediately
    if ( !len ) {
      triggerCallback();
    }

    $images.bind( 'load.imagesLoaded error.imagesLoaded',  imgLoaded ).each( function() {
      // cached images don't fire load sometimes, so we reset src.
      var src = this.src;
      // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
      // data uri bypasses webkit log warning (thx doug jones)
      this.src = blank;
      this.src = src;
    });

    return $this;
  };


  // helper function for logging errors
  // $.error breaks jQuery chaining
  var logError = function( message ) {
    if ( window.console ) {
      window.console.error( message );
    }
  };

  // =======================  Plugin bridge  ===============================
  // leverages data method to either create or return $.Mason constructor
  // A bit from jQuery UI
  //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
  // A bit from jcarousel
  //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

  $.fn.masonry = function( options ) {
    if ( typeof options === 'string' ) {
      // call method
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'masonry' );
        if ( !instance ) {
          logError( "cannot call methods on masonry prior to initialization; " +
            "attempted to call method '" + options + "'" );
          return;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          logError( "no such method '" + options + "' for masonry instance" );
          return;
        }
        // apply method
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'masonry' );
        if ( instance ) {
          // apply options & init
          instance.option( options || {} );
          instance._init();
        } else {
          // initialize new instance
          $.data( this, 'masonry', new $.Mason( options, this ) );
        }
      });
    }
    return this;
  };

})( window, jQuery );
(function() {

  $(document).ready(function() {
    var formtip,
      _this = this;
    //$('.effs').p2acc({
    //  autoStart: true,
    //  slideInterval: 5000,
    //  slideNum: false
    //});
    $('.effs dl.p2-acc dt').not('.active').click(function() {
      var href;
      if (href = $(this).next().find('.jump-to').attr('href'))
        window.location.href = href;
    });
    $('#header select').each(function(index, element) {
      var ele, title;
      ele = $(element);
      ele.parent().addClass('select');
      title = $('option:selected', ele).text();
      title || (title = $('option:first', ele).text());
      return ele.css({
        'z-index': 10,
        'opacity': 0
      }).after('<span>' + title + '</span>').change(function() {
        title = $('option:selected', ele).text();
        return ele.next().text(title);
      });
    });
    $('#search .container').tabs().bind('tabsselect', function (event, ui) {
      var tabCon, href;
      tabCon = $('#search-' + ui.index);
      if (href = tabCon.find('.jump-to').attr('href'))
        window.location.href = href;
    });
    $('#check_all').change(function() {
      var checked, _ref;
      checked = (_ref = $('#check_all:checked').length) != null ? _ref : {
        "true": false
      };
      if (checked) {
        return $(this).parents('table').find('td input').attr('checked', true);
      } else {
        return $(this).parents('table').find('td input').removeAttr('checked');
      }
    });
    $('#doitac li').each(function(index, element) {
      var ele, img, imgsrc;
      ele = $(element);
      img = $('img', ele);
      imgsrc = img.attr('src') + '&type=bw';
      ele.css({
        'background': 'url(' + imgsrc + ')'
      });
      return img.hover((function() {
        return $(this).addClass("hover");
      }, function() {
        return $(this).remove("hover");
      }));
    });
    $('.jslider').each(function() {
      var current, currentPos, filler, slider, step, tooltip, total;
      slider = $(this);
      filler = $('.filler', slider);
      tooltip = $('.tooltip', slider);
      tooltip.css({
        'margin-left': -tooltip.width() / 2
      });
      total = slider.attr('total');
      current = slider.attr('current');
      step = slider.width() / total;
      currentPos = step * current;
      return filler.width(currentPos);
    });
    formtip = $('.formtip');
    formtip.each(function(index, tip) {
      var $tip, text, title;
      $tip = $(tip);
      text = $tip.attr('placeholder');
      title = $tip.attr('title');
      $tip.attr('placeholder', '');
      $('<a />').addClass('questiontip right').insertAfter($tip).text('?').attr('title', title).attr('tipcontents', text);
      return $tip.next('a.questiontip').qtip({
        position: {
          my: 'bottom left',
          at: 'top center'
        },
        content: {
          text: function(api) {
            return $(this).attr('tipcontents');
          },
          title: {
            text: title
          }
        },
        style: {
          classes: 'ui-tooltip-blue'
        }
      });
    });
    $('cbSalary').change(function() {
      return changeSalary();
    });
    $('table').on('click', 'input:checkbox', function(e) {
      var etarget, otherInput, target;
      etarget = $(e.target);
      target = etarget.attr('class') + ' ' + etarget.attr('id') + ' ' + etarget.attr('rel');
      if ((target.indexOf('check_all') >= 0) && (etarget.parent('th').length > 0)) {
        otherInput = $(e.delegateTarget).find('td input:checkbox');
        if (etarget.is(':checked')) {
          return otherInput.attr('checked', 'checked');
        } else {
          return otherInput.removeAttr('checked');
        }
      }
    });

        $('#list-detail-resume').on('click', 'input:checkbox', function(e) {
      var etarget, otherInput, target;
      etarget = $(e.target);
      target = etarget.attr('class') + ' ' + etarget.attr('id') + ' ' + etarget.attr('rel');
      if ((target.indexOf('check_all') >= 0) && (etarget.parent('#list-header .ckbox').length > 0)) {
        otherInput = $(e.delegateTarget).find('.ckbox input:checkbox');
        if (etarget.is(':checked')) {
          return otherInput.attr('checked', 'checked');
        } else {
          return otherInput.removeAttr('checked');
        }
      }
    });
    $('#list-detail-job').on('click', 'input:checkbox', function(e) {
      var etarget, otherInput, target;
      etarget = $(e.target);
      target = etarget.attr('class') + ' ' + etarget.attr('id') + ' ' + etarget.attr('rel');
      if ((target.indexOf('check_all') >= 0) && (etarget.parent('#list-header .ckbox').length > 0)) {
        otherInput = $(e.delegateTarget).find('.ckbox input:checkbox');
        if (etarget.is(':checked')) {
          return otherInput.attr('checked', 'checked');
        } else {
          return otherInput.removeAttr('checked');
        }
      }
    });

    
    return $('.search-cate').masonry({
      itemSelector: '.cate'
    });
  });

}).call(this);
