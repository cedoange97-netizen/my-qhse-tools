/* ==========================================================
   My-QHSE Tools – lecteur-office.js
   Lecteur de documents Word (.docx) et Excel (.xlsx / .xlsm)
   sans bibliothèque externe, directement dans l'application.

   Utilisation :
     QHSEOffice.lire(arrayBuffer).then(function (doc) { ... })
       doc.type === "word"  -> doc.element (élément HTML), doc.liberer()
       doc.type === "excel" -> doc.feuilles [{ nom, rendre(conteneur) }]

   Limites : texte, titres, listes, tableaux, images, liens (Word) ;
   valeurs, dates, pourcentages, fusions, gras et couleurs (Excel).
   Pas de graphiques, de formules recalculées ni de macros.
   Tout le contenu est inséré avec textContent : aucun HTML venant du
   document n'est interprété.
   ========================================================== */
(function () {
  "use strict";

  /* ---------- Outils XML ---------- */
  function analyser(texte) {
    var d = new DOMParser().parseFromString(texte, "application/xml");
    if (d.getElementsByTagName("parsererror").length) throw new Error("Le contenu du document est illisible.");
    return d.documentElement;
  }
  function enfants(el, nom) {
    var r = [];
    if (!el) return r;
    for (var i = 0; i < el.children.length; i++) if (el.children[i].localName === nom) r.push(el.children[i]);
    return r;
  }
  function premier(el, nom) { return enfants(el, nom)[0] || null; }
  function attr(el, nom) {
    if (!el) return null;
    for (var i = 0; i < el.attributes.length; i++) if (el.attributes[i].localName === nom) return el.attributes[i].value;
    return null;
  }
  function descendants(el, nom, max) {
    var r = [], pile = [el];
    while (pile.length) {
      var e = pile.shift();
      for (var i = 0; i < e.children.length; i++) {
        var c = e.children[i];
        if (c.localName === nom) { r.push(c); if (max && r.length >= max) return r; }
        pile.push(c);
      }
    }
    return r;
  }
  function el(nom, classe) { var e = document.createElement(nom); if (classe) e.className = classe; return e; }
  function actif(noeud) {
    if (!noeud) return false;
    var v = attr(noeud, "val");
    return v === null || (v !== "0" && v !== "false" && v !== "off" && v !== "none");
  }
  function couleurValide(c) { return /^[0-9A-Fa-f]{6}$/.test(c || "") ? "#" + c : null; }

  /* ---------- Lecture du ZIP (format des fichiers Office) ---------- */
  async function lireZip(buf) {
    var u = new Uint8Array(buf), dv = new DataView(buf), dec = new TextDecoder("utf-8");
    if (u.length > 8 && dv.getUint32(0, true) === 0xE011CFD0) {
      throw new Error("Ancien format Word ou Excel (.doc / .xls). Enregistrez le document en .docx ou .xlsx, puis réessayez.");
    }
    var i = u.length - 22, min = Math.max(0, u.length - 65557);
    for (; i >= min; i--) if (dv.getUint32(i, true) === 0x06054b50) break;
    if (i < min) throw new Error("Fichier non reconnu : seuls les documents Word (.docx) et Excel (.xlsx) sont pris en charge.");
    var n = dv.getUint16(i + 10, true), off = dv.getUint32(i + 16, true), fichiers = {};
    for (var k = 0; k < n; k++) {
      if (dv.getUint32(off, true) !== 0x02014b50) break;
      var nl = dv.getUint16(off + 28, true), el2 = dv.getUint16(off + 30, true), cl = dv.getUint16(off + 32, true);
      fichiers[dec.decode(u.subarray(off + 46, off + 46 + nl))] = {
        meth: dv.getUint16(off + 10, true), flag: dv.getUint16(off + 8, true),
        cs: dv.getUint32(off + 20, true), lo: dv.getUint32(off + 42, true)
      };
      off += 46 + nl + el2 + cl;
    }
    async function octets(nom) {
      var f = fichiers[nom];
      if (!f) return null;
      if (f.flag & 1) throw new Error("Ce document est protégé par un mot de passe.");
      var ln = dv.getUint16(f.lo + 26, true), le = dv.getUint16(f.lo + 28, true), d = f.lo + 30 + ln + le;
      var data = u.subarray(d, d + f.cs);
      if (f.meth === 0) return data;
      if (f.meth !== 8) throw new Error("Compression non prise en charge.");
      if (typeof DecompressionStream === "undefined") throw new Error("Ce navigateur est trop ancien pour lire ce document. Mettez-le à jour.");
      var flux = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
      return new Uint8Array(await new Response(flux).arrayBuffer());
    }
    return {
      existe: function (nom) { return !!fichiers[nom]; },
      octets: octets,
      texte: async function (nom) { var b = await octets(nom); return b ? dec.decode(b) : null; }
    };
  }

  async function lireRels(zip, chemin, base) {
    var t = await zip.texte(chemin), r = {};
    if (!t) return r;
    enfants(analyser(t), "Relationship").forEach(function (x) {
      var cible = attr(x, "Target") || "", externe = attr(x, "TargetMode") === "External";
      if (!externe) {
        if (cible.charAt(0) === "/") cible = cible.slice(1);
        else {
          var parts = (base + cible).split("/"), out = [];
          parts.forEach(function (p) { if (p === "..") out.pop(); else if (p && p !== ".") out.push(p); });
          cible = out.join("/");
        }
      }
      r[attr(x, "Id")] = { cible: cible, externe: externe };
    });
    return r;
  }

  /* =========================================================
     WORD (.docx)
     ========================================================= */
  var MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml", bmp: "image/bmp" };

  function formaterNumero(fmt, n) {
    switch (fmt) {
      case "lowerLetter": return String.fromCharCode(96 + ((n - 1) % 26) + 1);
      case "upperLetter": return String.fromCharCode(64 + ((n - 1) % 26) + 1);
      case "lowerRoman": return romain(n).toLowerCase();
      case "upperRoman": return romain(n);
      default: return String(n);
    }
  }
  function romain(n) {
    var t = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]], s = "";
    t.forEach(function (p) { while (n >= p[0]) { s += p[1]; n -= p[0]; } });
    return s;
  }

  async function lireStylesWord(zip) {
    var t = await zip.texte("word/styles.xml"), r = { noms: {}, num: {} }, parents = {};
    if (!t) return r;
    enfants(analyser(t), "style").forEach(function (s) {
      var id = attr(s, "styleId");
      r.noms[id] = (attr(premier(s, "name"), "val") || "").toLowerCase();
      parents[id] = attr(premier(s, "basedOn"), "val");
      var ppr = premier(s, "pPr"), np = ppr ? premier(ppr, "numPr") : null;
      if (np) r.num[id] = { numId: attr(premier(np, "numId"), "val"), ilvl: attr(premier(np, "ilvl"), "val") };
    });
    /* Un style de liste peut hériter de la numérotation de son style parent */
    Object.keys(r.noms).forEach(function (id) {
      var cur = id, garde = 0;
      while (cur && !r.num[cur] && garde++ < 8) cur = parents[cur];
      if (cur && r.num[cur] && cur !== id) r.num[id] = r.num[cur];
    });
    return r;
  }

  async function lireNumerotation(zip) {
    var t = await zip.texte("word/numbering.xml"), abstraits = {}, nums = {};
    if (!t) return nums;
    var racine = analyser(t);
    enfants(racine, "abstractNum").forEach(function (a) {
      var niveaux = {};
      enfants(a, "lvl").forEach(function (l) {
        niveaux[attr(l, "ilvl")] = {
          fmt: attr(premier(l, "numFmt"), "val") || "decimal",
          texte: attr(premier(l, "lvlText"), "val") || "%1.",
          debut: parseInt(attr(premier(l, "start"), "val") || "1", 10)
        };
      });
      abstraits[attr(a, "abstractNumId")] = niveaux;
    });
    enfants(racine, "num").forEach(function (m) {
      nums[attr(m, "numId")] = abstraits[attr(premier(m, "abstractNumId"), "val")] || {};
    });
    return nums;
  }

  function marqueur(ctx, numId, ilvl) {
    var niveaux = ctx.num[numId];
    if (!niveaux || !niveaux[ilvl]) return "•";
    var def = niveaux[ilvl], compt = ctx.compteurs[numId] || (ctx.compteurs[numId] = []);
    if (def.fmt === "bullet") return ["•", "◦", "▪"][parseInt(ilvl, 10) % 3];
    var l = parseInt(ilvl, 10);
    for (var j = 0; j < l; j++) if (compt[j] === undefined) compt[j] = (niveaux[j] ? niveaux[j].debut : 1);
    compt[l] = compt[l] === undefined ? def.debut : compt[l] + 1;
    compt.length = l + 1;
    return def.texte.replace(/%(\d)/g, function (m, d) {
      var idx = parseInt(d, 10) - 1, nd = niveaux[idx] || def;
      return nd.fmt === "bullet" ? "•" : formaterNumero(nd.fmt, compt[idx] === undefined ? nd.debut : compt[idx]);
    });
  }

  async function imageDepuis(drawing, ctx) {
    var blip = descendants(drawing, "blip", 1)[0];
    var id = blip ? attr(blip, "embed") : null;
    var rel = id ? ctx.rels[id] : null;
    if (!rel || rel.externe) return null;
    var ext = (rel.cible.split(".").pop() || "").toLowerCase();
    if (!MIME[ext]) return document.createTextNode("[image non affichable]");
    var octets = await ctx.zip.octets(rel.cible);
    if (!octets) return null;
    var url = URL.createObjectURL(new Blob([octets], { type: MIME[ext] }));
    ctx.urls.push(url);
    var img = el("img", "doc-img");
    img.src = url; img.loading = "lazy";
    var docPr = descendants(drawing, "docPr", 1)[0];
    img.alt = (docPr && attr(docPr, "descr")) || "";
    var ext2 = descendants(drawing, "extent", 1)[0], cx = ext2 ? parseInt(attr(ext2, "cx"), 10) : 0;
    if (cx > 0) img.style.width = Math.round(cx / 9525) + "px";
    return img;
  }

  async function contenuRun(r, cible, ctx) {
    var rpr = premier(r, "rPr"), noeud = null, i, c;
    var enveloppe = [];
    if (rpr) {
      var rs = attr(premier(rpr, "rStyle"), "val"), nomStyle = (rs && ctx.styles[rs]) || "";
      var gras = nomStyle === "strong" || (!!premier(rpr, "b") && actif(premier(rpr, "b")));
      var ital = (nomStyle === "emphasis") || (!!premier(rpr, "i") && actif(premier(rpr, "i")));
      if (gras) enveloppe.push("strong");
      if (ital) enveloppe.push("em");
      var u = premier(rpr, "u"); if (u && actif(u)) enveloppe.push("u");
      if (premier(rpr, "strike") && actif(premier(rpr, "strike"))) enveloppe.push("s");
      var va = attr(premier(rpr, "vertAlign"), "val");
      if (va === "superscript") enveloppe.push("sup"); else if (va === "subscript") enveloppe.push("sub");
    }
    var style = "";
    if (rpr) {
      var col = couleurValide(attr(premier(rpr, "color"), "val")); if (col) style += "color:" + col + ";";
      var surl = attr(premier(rpr, "highlight"), "val");
      var SURL = { yellow: "#ffff00", green: "#00ff00", cyan: "#00ffff", magenta: "#ff00ff", red: "#ff0000", blue: "#9db8ff", lightGray: "#d3d3d3" };
      if (surl && SURL[surl]) style += "background:" + SURL[surl] + ";";
      if (premier(rpr, "caps") && actif(premier(rpr, "caps"))) style += "text-transform:uppercase;";
    }
    for (i = 0; i < r.children.length; i++) {
      c = r.children[i];
      var n = c.localName, frag = null;
      if (n === "t") frag = document.createTextNode(c.textContent);
      else if (n === "tab") frag = document.createTextNode("\u00A0\u00A0\u00A0\u00A0");
      else if (n === "br") frag = attr(c, "type") === "page" ? el("hr", "doc-saut") : el("br");
      else if (n === "noBreakHyphen") frag = document.createTextNode("-");
      else if (n === "drawing" || n === "pict") frag = await imageDepuis(c, ctx);
      else if (n === "AlternateContent") {
        var ch = premier(c, "Choice"); var dr = ch ? descendants(ch, "drawing", 1)[0] : null;
        if (dr) frag = await imageDepuis(dr, ctx);
      }
      if (frag) {
        if (!noeud) noeud = document.createDocumentFragment();
        noeud.appendChild(frag);
      }
    }
    if (!noeud) return;
    var racine = noeud;
    if (enveloppe.length || style) {
      var cur = el(enveloppe.length ? enveloppe[0] : "span");
      var top = cur;
      for (i = 1; i < enveloppe.length; i++) { var nx = el(enveloppe[i]); cur.appendChild(nx); cur = nx; }
      if (style) top.setAttribute("style", style);
      cur.appendChild(noeud);
      racine = top;
    }
    cible.appendChild(racine);
  }

  async function contenuInline(parent, cible, ctx) {
    for (var i = 0; i < parent.children.length; i++) {
      var c = parent.children[i], n = c.localName;
      if (n === "r") await contenuRun(c, cible, ctx);
      else if (n === "hyperlink") {
        var id = attr(c, "id"), rel = id ? ctx.rels[id] : null, a = el("span");
        var href = rel && rel.externe ? rel.cible : null;
        if (href && /^(https?:|mailto:)/i.test(href)) {
          a = el("a"); a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer";
        }
        await contenuInline(c, a, ctx);
        cible.appendChild(a);
      } else if (n === "ins" || n === "smartTag" || n === "fldSimple" || n === "customXml") await contenuInline(c, cible, ctx);
      else if (n === "sdt") { var sc = premier(c, "sdtContent"); if (sc) await contenuInline(sc, cible, ctx); }
    }
  }

  async function paragraphe(p, ctx) {
    var ppr = premier(p, "pPr"), style = ppr ? attr(premier(ppr, "pStyle"), "val") : null;
    var nomStyle = (style && ctx.styles.noms[style]) || "", tag = "p", classe = "";
    var m = /^(?:heading|titre)\s*(\d)/.exec(nomStyle);
    if (m) tag = "h" + Math.min(6, parseInt(m[1], 10) + 1);
    else if (nomStyle === "title" || nomStyle === "titre") tag = "h1";
    else if (nomStyle === "subtitle" || nomStyle === "sous-titre") classe = "doc-soustitre";
    var numPr = ppr ? premier(ppr, "numPr") : null;
    var numId = numPr ? attr(premier(numPr, "numId"), "val") : null;
    var ilvl = numPr ? (attr(premier(numPr, "ilvl"), "val") || "0") : "0";
    if (!numId && style && ctx.styles.num[style]) {
      numId = ctx.styles.num[style].numId; ilvl = ctx.styles.num[style].ilvl || "0";
    }
    var cible;
    if (numId && numId !== "0" && tag === "p") {
      cible = el("div", "doc-puce");
      cible.style.marginLeft = (1.4 + parseInt(ilvl, 10) * 1.4) + "em";
      var mk = el("span", "doc-puce-m"); mk.textContent = marqueur(ctx, numId, ilvl);
      cible.appendChild(mk);
      var corps = el("span", "doc-puce-t");
      await contenuInline(p, corps, ctx);
      cible.appendChild(corps);
    } else {
      cible = el(tag, classe);
      await contenuInline(p, cible, ctx);
    }
    var jc = ppr ? attr(premier(ppr, "jc"), "val") : null;
    if (jc === "center" || jc === "right") cible.style.textAlign = jc;
    else if (jc === "both") cible.style.textAlign = "justify";
    return cible;
  }

  async function tableau(tbl, ctx) {
    var t = el("table", "doc-tab"), colTd = [];
    var rows = enfants(tbl, "tr");
    for (var ri = 0; ri < rows.length; ri++) {
      var tr = el("tr"), col = 0, cells = enfants(rows[ri], "tc");
      for (var ci = 0; ci < cells.length; ci++) {
        var tc = cells[ci], tcpr = premier(tc, "tcPr");
        var span = parseInt(attr(premier(tcpr, "gridSpan"), "val") || "1", 10) || 1;
        var vm = premier(tcpr, "vMerge");
        if (vm && attr(vm, "val") !== "restart") {
          var o = colTd[col];
          if (o) o.rowSpan = (o.rowSpan || 1) + 1;
          col += span; continue;
        }
        var td = el("td");
        if (span > 1) td.colSpan = span;
        var fill = couleurValide(attr(premier(tcpr, "shd"), "fill"));
        if (fill) td.style.background = fill;
        await bloc(tc, td, ctx);
        tr.appendChild(td);
        for (var s = 0; s < span; s++) colTd[col + s] = vm ? td : null;
        col += span;
      }
      t.appendChild(tr);
    }
    var wrap = el("div", "doc-tab-wrap"); wrap.appendChild(t);
    return wrap;
  }

  async function bloc(parent, cible, ctx) {
    for (var i = 0; i < parent.children.length; i++) {
      var c = parent.children[i], n = c.localName;
      if (n === "p") cible.appendChild(await paragraphe(c, ctx));
      else if (n === "tbl") cible.appendChild(await tableau(c, ctx));
      else if (n === "sdt") { var sc = premier(c, "sdtContent"); if (sc) await bloc(sc, cible, ctx); }
    }
  }

  async function lireDocx(zip) {
    var texte = await zip.texte("word/document.xml");
    if (!texte) throw new Error("Document Word vide ou illisible.");
    var doc = analyser(texte);
    var ctx = {
      zip: zip, urls: [], compteurs: {},
      rels: await lireRels(zip, "word/_rels/document.xml.rels", "word/"),
      styles: await lireStylesWord(zip), num: await lireNumerotation(zip)
    };
    var racine = el("div", "doc-word");
    await bloc(premier(doc, "body"), racine, ctx);
    return { type: "word", element: racine, liberer: function () { ctx.urls.forEach(function (u) { URL.revokeObjectURL(u); }); } };
  }

  /* =========================================================
     EXCEL (.xlsx)
     ========================================================= */
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var FORMATS_BASE = { 1: "0", 2: "0.00", 3: "#,##0", 4: "#,##0.00", 9: "0%", 10: "0.00%", 14: "dd/mm/yyyy", 15: "d mmm yy", 16: "d mmm", 17: "mmm yy", 18: "h:mm AM/PM", 19: "h:mm:ss AM/PM", 20: "hh:mm", 21: "hh:mm:ss", 22: "dd/mm/yyyy hh:mm", 45: "mm:ss", 46: "[h]:mm:ss", 47: "mm:ss" };

  function colIndex(ref) {
    var l = /^[A-Z]+/i.exec(ref)[0].toUpperCase(), n = 0;
    for (var i = 0; i < l.length; i++) n = n * 26 + (l.charCodeAt(i) - 64);
    return n - 1;
  }
  function colLettre(i) {
    var s = ""; i++;
    while (i > 0) { var r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = Math.floor((i - 1) / 26); }
    return s;
  }
  function nettoyerFormat(code) {
    return code.replace(/"[^"]*"/g, "").replace(/\[[^\]]*\]/g, "").replace(/\\./g, "").replace(/_./g, "").replace(/\*./g, "");
  }
  function estDate(code) {
    return /[dmyhs]/i.test(nettoyerFormat(code).replace(/General/gi, ""));
  }
  function deuxChiffres(n) { return (n < 10 ? "0" : "") + n; }

  function formaterDate(v, code, date1904) {
    var jours = date1904 ? v + 1462 : v;
    var d = new Date(Math.round((jours - 25569) * 86400000));
    if (isNaN(d.getTime())) return String(v);
    var Y = d.getUTCFullYear(), M = d.getUTCMonth(), D = d.getUTCDate(), W = d.getUTCDay();
    var h = d.getUTCHours(), mi = d.getUTCMinutes(), se = d.getUTCSeconds();
    var sans = code.replace(/"([^"]*)"/g, "\u0001$1\u0002").replace(/\[(?![hms]\])[^\]]*\]/gi, "");
    var am = /AM\/PM|A\/P/i.test(sans), jetons = [], re = /\u0001[^\u0002]*\u0002|yyyy|yy|mmmmm|mmmm|mmm|mm|m|dddd|ddd|dd|d|hh|h|ss|s|AM\/PM|A\/P|\[h+\]|\\.|./gi, mt;
    while ((mt = re.exec(sans))) jetons.push(mt[0]);
    var sortie = "";
    for (var i = 0; i < jetons.length; i++) {
      var t = jetons[i], tl = t.toLowerCase(), prev = "", next = "", j;
      for (j = i - 1; j >= 0; j--) if (/^(h|hh|\[h+\])$/i.test(jetons[j])) { prev = "h"; break; } else if (/^(d|dd|m|mm|mmm|mmmm|yy|yyyy)$/i.test(jetons[j])) break;
      for (j = i + 1; j < jetons.length; j++) if (/^(s|ss)$/i.test(jetons[j])) { next = "s"; break; } else if (/^(d|dd|m|mm|mmm|mmmm|yy|yyyy)$/i.test(jetons[j])) break;
      var minute = (tl === "m" || tl === "mm") && (prev === "h" || next === "s");
      if (t.charAt(0) === "\u0001") sortie += t.slice(1, -1);
      else if (tl === "yyyy") sortie += Y;
      else if (tl === "yy") sortie += deuxChiffres(Y % 100);
      else if (tl === "mmmm") sortie += MOIS[M];
      else if (tl === "mmm") sortie += MOIS_COURTS[M];
      else if (tl === "mmmmm") sortie += MOIS[M].charAt(0);
      else if (tl === "mm" || tl === "m") sortie += minute ? (tl === "mm" ? deuxChiffres(mi) : mi) : (tl === "mm" ? deuxChiffres(M + 1) : M + 1);
      else if (tl === "dddd") sortie += JOURS[W];
      else if (tl === "ddd") sortie += JOURS[W].slice(0, 3) + ".";
      else if (tl === "dd") sortie += deuxChiffres(D);
      else if (tl === "d") sortie += D;
      else if (tl === "hh") sortie += deuxChiffres(am ? ((h % 12) || 12) : h);
      else if (tl === "h") sortie += am ? ((h % 12) || 12) : h;
      else if (/^\[h+\]$/.test(tl)) sortie += Math.floor(v * 24 + 1e-9);
      else if (tl === "ss") sortie += deuxChiffres(se);
      else if (tl === "s") sortie += se;
      else if (tl === "am/pm" || tl === "a/p") sortie += h < 12 ? "AM" : "PM";
      else if (t.charAt(0) === "\\") sortie += t.charAt(1);
      else sortie += t;
    }
    return sortie;
  }

  function formaterNombre(v, code) {
    if (!isFinite(v)) return String(v);
    var section = code.split(";")[0];
    var brut = nettoyerFormat(section);
    var dec = 0, pt = brut.indexOf(".");
    if (pt >= 0) { var m = /^[0#?]+/.exec(brut.slice(pt + 1)); dec = m ? m[0].length : 0; }
    var pct = brut.indexOf("%") >= 0, millier = /[0#?],[0#?]/.test(brut), val = pct ? v * 100 : v;
    var s = val.toLocaleString("fr-FR", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: millier });
    if (pct) s += " %";
    var lit = [], mm, re = /"([^"]*)"|\[\$([^\]\-]*)[^\]]*\]/g, premiere = section.search(/[0#?]/);
    while ((mm = re.exec(section))) lit.push({ txt: mm[1] !== undefined ? mm[1] : mm[2], pos: mm.index });
    lit.forEach(function (l) {
      if (!l.txt) return;
      if (l.pos > premiere) s = s + (/^\s/.test(l.txt) ? "" : "\u00A0") + l.txt.replace(/^\s/, "");
      else s = l.txt + s;
    });
    return s;
  }

  function valeurGenerale(v) {
    if (Number.isInteger(v)) return String(v);
    return String(parseFloat(v.toPrecision(12))).replace(".", ",");
  }

  function formater(v, fmtId, codes, date1904) {
    var code = codes[fmtId] !== undefined ? codes[fmtId] : FORMATS_BASE[fmtId];
    if (!code || /^general$/i.test(code) || code === "@") return { t: valeurGenerale(v), nombre: true };
    if (estDate(code)) return { t: formaterDate(v, code, date1904), nombre: false };
    return { t: formaterNombre(v, code), nombre: true };
  }

  async function lireStylesExcel(zip) {
    var t = await zip.texte("xl/styles.xml"), r = { codes: {}, xfs: [] };
    if (!t) return r;
    var racine = analyser(t);
    enfants(premier(racine, "numFmts"), "numFmt").forEach(function (f) { r.codes[attr(f, "numFmtId")] = attr(f, "formatCode"); });
    var polices = enfants(premier(racine, "fonts"), "font").map(function (f) {
      var c = premier(f, "color");
      return { gras: !!premier(f, "b") && actif(premier(f, "b")), ital: !!premier(f, "i"), couleur: couleurValide((attr(c, "rgb") || "").slice(-6)) };
    });
    var fonds = enfants(premier(racine, "fills"), "fill").map(function (f) {
      var pf = premier(f, "patternFill");
      if (!pf || attr(pf, "patternType") !== "solid") return null;
      var c = attr(premier(pf, "fgColor"), "rgb");
      return c ? couleurValide(c.slice(-6)) : null;
    });
    r.dxfs = enfants(premier(racine, "dxfs"), "dxf").map(function (d) {
      var f = premier(d, "fill"), pf = f ? premier(f, "patternFill") : null, fond = null;
      if (pf) { var bg = attr(premier(pf, "bgColor"), "rgb") || attr(premier(pf, "fgColor"), "rgb"); if (bg) fond = couleurValide(bg.slice(-6)); }
      var po = premier(d, "font"), co = po ? attr(premier(po, "color"), "rgb") : null;
      return { fond: fond, couleur: co ? couleurValide(co.slice(-6)) : null, gras: !!po && !!premier(po, "b") && actif(premier(po, "b")) };
    });
    enfants(premier(racine, "cellXfs"), "xf").forEach(function (x) {
      var al = premier(x, "alignment"), police = polices[parseInt(attr(x, "fontId") || "0", 10)] || {};
      r.xfs.push({
        fmt: parseInt(attr(x, "numFmtId") || "0", 10), gras: !!police.gras, ital: !!police.ital, couleur: police.couleur || null,
        fond: fonds[parseInt(attr(x, "fillId") || "0", 10)] || null,
        al: al ? attr(al, "horizontal") : null, retour: !!al && attr(al, "wrapText") === "1"
      });
    });
    return r;
  }

  async function lireChainesPartagees(zip) {
    var t = await zip.texte("xl/sharedStrings.xml");
    if (!t) return [];
    return enfants(analyser(t), "si").map(function (si) {
      return descendants(si, "t").filter(function (x) { return x.parentNode.localName !== "rPh"; }).map(function (x) { return x.textContent; }).join("");
    });
  }


  function plage(ref) {
    var p = ref.split(":"), a = p[0], b = p[1] || p[0];
    return { r1: parseInt(a.replace(/\D/g, ""), 10) - 1, c1: colIndex(a), r2: parseInt(b.replace(/\D/g, ""), 10) - 1, c2: colIndex(b) };
  }
  function constante(f) {
    if (f === null || f === undefined) return undefined;
    f = String(f).trim();
    var m = /^"((?:[^"]|"")*)"$/.exec(f);
    if (m) return m[1].replace(/""/g, '"');
    if (/^-?\d+(\.\d+)?$/.test(f)) return parseFloat(f);
    return undefined;
  }
  function comparer(op, a, b, b2) {
    if (a === null || a === undefined || b === undefined) return false;
    var egal = (typeof a === "string" && typeof b === "string") ? a.toLowerCase() === b.toLowerCase() : a === b;
    var nums = typeof a === "number" && typeof b === "number";
    switch (op) {
      case "equal": case "=": return egal;
      case "notEqual": case "<>": return !egal;
      case "greaterThan": case ">": return nums && a > b;
      case "greaterThanOrEqual": case ">=": return nums && a >= b;
      case "lessThan": case "<": return nums && a < b;
      case "lessThanOrEqual": case "<=": return nums && a <= b;
      case "between": return nums && typeof b2 === "number" && a >= Math.min(b, b2) && a <= Math.max(b, b2);
      case "notBetween": return nums && typeof b2 === "number" && (a < Math.min(b, b2) || a > Math.max(b, b2));
    }
    return false;
  }
  function appliquerMiseEnFormeConditionnelle(racine, lignes, styles) {
    var parN = {};
    lignes.forEach(function (l) { parN[l.n] = l; });
    enfants(racine, "conditionalFormatting").forEach(function (bloc) {
      var plages = (attr(bloc, "sqref") || "").split(/\s+/).filter(Boolean).map(plage);
      var regles = enfants(bloc, "cfRule").sort(function (x, y) { return parseInt(attr(x, "priority") || "0", 10) - parseInt(attr(y, "priority") || "0", 10); });
      plages.forEach(function (pl) {
        for (var r = pl.r1; r <= Math.min(pl.r2, pl.r1 + 5000); r++) {
          var ligne = parN[r + 1];
          if (!ligne) continue;
          for (var c = pl.c1; c <= Math.min(pl.c2, 200); c++) {
            var cel = ligne.c[c];
            if (!cel) continue;
            for (var k = 0; k < regles.length; k++) {
              var rg = regles[k], type = attr(rg, "type"), dxf = styles.dxfs[parseInt(attr(rg, "dxfId") || "-1", 10)], ok = false;
              if (!dxf) continue;
              var f1 = premier(rg, "formula") ? premier(rg, "formula").textContent : null;
              var f2 = enfants(rg, "formula")[1] ? enfants(rg, "formula")[1].textContent : null;
              if (type === "cellIs") ok = comparer(attr(rg, "operator"), cel.v, constante(f1), constante(f2));
              else if (type === "expression" && f1) {
                var m = /^\s*(\$?)([A-Z]{1,3})(\$?)(\d+)\s*(<>|>=|<=|=|>|<)\s*("(?:[^"]|"")*"|-?\d+(?:\.\d+)?)\s*$/i.exec(f1);
                if (m) {
                  var cc = m[1] ? colIndex(m[2]) : colIndex(m[2]) + (c - pl.c1), rr = m[3] ? parseInt(m[4], 10) - 1 : parseInt(m[4], 10) - 1 + (r - pl.r1);
                  var cible = parN[rr + 1] && parN[rr + 1].c[cc];
                  ok = !!cible && comparer(m[5], cible.v, constante(m[6]));
                }
              }
              if (ok) {
                if (dxf.fond) cel.f = dxf.fond;
                if (dxf.couleur) cel.c = dxf.couleur;
                if (dxf.gras) cel.g = true;
                break;
              }
            }
          }
        }
      });
    });
  }

  async function lireFeuille(zip, chemin, ctx) {
    var t = await zip.texte(chemin);
    if (!t) throw new Error("Feuille introuvable.");
    var racine = analyser(t), lignes = [], maxCol = 0, fusion = {}, couvert = {}, colsCachees = {};
    enfants(premier(racine, "cols"), "col").forEach(function (c) {
      if (attr(c, "hidden") === "1") for (var k = parseInt(attr(c, "min"), 10); k <= Math.min(parseInt(attr(c, "max"), 10), 300); k++) colsCachees[k - 1] = true;
    });
    enfants(premier(racine, "mergeCells"), "mergeCell").forEach(function (m) {
      var p = (attr(m, "ref") || "").split(":");
      if (p.length !== 2) return;
      var r1 = parseInt(p[0].replace(/\D/g, ""), 10) - 1, c1 = colIndex(p[0]), r2 = parseInt(p[1].replace(/\D/g, ""), 10) - 1, c2 = colIndex(p[1]);
      fusion[r1 + "," + c1] = { rs: r2 - r1 + 1, cs: c2 - c1 + 1 };
      for (var a = r1; a <= r2; a++) for (var b = c1; b <= c2; b++) if (a !== r1 || b !== c1) couvert[a + "," + b] = true;
    });
    enfants(premier(racine, "sheetData"), "row").forEach(function (row, idx) {
      if (attr(row, "hidden") === "1") return;
      var n = parseInt(attr(row, "r") || String(idx + 1), 10), cellules = [], dernier = -1;
      enfants(row, "c").forEach(function (c) {
        var ref = attr(c, "r"), ci = ref ? colIndex(ref) : dernier + 1, tp = attr(c, "t"), v = premier(c, "v"), vt = v ? v.textContent : "";
        dernier = ci;
        if (colsCachees[ci]) return;
        var xf = ctx.styles.xfs[parseInt(attr(c, "s") || "0", 10)] || {}, texte = "", nombre = false, brut = null;
        if (tp === "s") { texte = ctx.chaines[parseInt(vt, 10)] || ""; brut = texte; }
        else if (tp === "inlineStr") texte = descendants(premier(c, "is") || c, "t").map(function (x) { return x.textContent; }).join("");
        else if (tp === "b") texte = vt === "1" ? "VRAI" : "FAUX";
        else if (tp === "str" || tp === "d") { texte = vt; brut = vt; }
        else if (tp === "e") texte = vt;
        else if (vt !== "") {
          var num = parseFloat(vt);
          if (isNaN(num)) texte = vt; else { brut = num; var f = formater(num, xf.fmt || 0, ctx.styles.codes, ctx.date1904); texte = f.t; nombre = f.nombre; }
        }
        if (texte === "" && !xf.fond) return;
        cellules[ci] = { v: brut, t: texte, nombre: nombre, bool: tp === "b", g: xf.gras, i: xf.ital, c: xf.couleur, f: xf.fond, al: xf.al, w: xf.retour };
        if (ci + 1 > maxCol) maxCol = ci + 1;
      });
      lignes.push({ n: n, c: cellules });
    });
    appliquerMiseEnFormeConditionnelle(racine, lignes, ctx.styles);
    return { lignes: lignes, nbCols: Math.min(maxCol, 200), fusion: fusion, couvert: couvert };
  }

  function rendreFeuille(donnees, cont, limite) {
    cont.textContent = "";
    if (!donnees.lignes.length || !donnees.nbCols) {
      var vide = el("p", "xl-vide"); vide.textContent = "Cette feuille est vide."; cont.appendChild(vide); return;
    }
    var haut = el("div", "xl-defil"), table = el("table", "xl-table"), thead = el("thead"), tr = el("tr");
    var coin = el("th", "xl-coin"); tr.appendChild(coin);
    for (var c = 0; c < donnees.nbCols; c++) { var th = el("th", "xl-col"); th.textContent = colLettre(c); tr.appendChild(th); }
    thead.appendChild(tr); table.appendChild(thead);
    var tbody = el("tbody"); table.appendChild(tbody); haut.appendChild(table); cont.appendChild(haut);
    var affiches = 0, btn = null;
    function plus() {
      var fin = Math.min(donnees.lignes.length, affiches + limite);
      for (; affiches < fin; affiches++) {
        var ligne = donnees.lignes[affiches], r = el("tr"), nth = el("th", "xl-num");
        nth.textContent = ligne.n; r.appendChild(nth);
        for (var k = 0; k < donnees.nbCols; k++) {
          var cle = (ligne.n - 1) + "," + k;
          if (donnees.couvert[cle]) continue;
          var cel = ligne.c[k], td = el("td");
          if (donnees.fusion[cle]) { var fu = donnees.fusion[cle]; if (fu.rs > 1) td.rowSpan = fu.rs; if (fu.cs > 1) td.colSpan = fu.cs; }
          if (cel) {
            td.textContent = cel.t;
            if (cel.g) td.style.fontWeight = "700";
            if (cel.i) td.style.fontStyle = "italic";
            if (cel.c) td.style.color = cel.c;
            if (cel.f) td.style.background = cel.f;
            var al = cel.al === "center" || cel.al === "right" || cel.al === "left" ? cel.al : (cel.nombre ? "right" : (cel.bool ? "center" : null));
            if (al) td.style.textAlign = al;
            if (cel.w || cel.t.length > 40) td.className = "xl-long";
          }
          r.appendChild(td);
        }
        tbody.appendChild(r);
      }
      if (btn) btn.remove();
      if (affiches < donnees.lignes.length) {
        btn = el("button", "xl-plus"); btn.type = "button";
        btn.textContent = "Afficher " + Math.min(limite, donnees.lignes.length - affiches) + " lignes de plus (" + (donnees.lignes.length - affiches) + " restantes)";
        btn.addEventListener("click", plus);
        cont.appendChild(btn);
      }
    }
    plus();
  }

  async function lireXlsx(zip) {
    var wbTxt = await zip.texte("xl/workbook.xml");
    if (!wbTxt) throw new Error("Classeur Excel vide ou illisible.");
    var wb = analyser(wbTxt), rels = await lireRels(zip, "xl/_rels/workbook.xml.rels", "xl/");
    var ctx = {
      styles: await lireStylesExcel(zip), chaines: await lireChainesPartagees(zip),
      date1904: attr(premier(wb, "workbookPr"), "date1904") === "1"
    };
    var feuilles = enfants(premier(wb, "sheets"), "sheet").filter(function (s) { return !attr(s, "state") || attr(s, "state") === "visible"; }).map(function (s) {
      var rel = rels[attr(s, "id")], cache = null;
      return {
        nom: attr(s, "name") || "Feuille",
        rendre: async function (cont, limite) {
          if (!cache) cache = await lireFeuille(zip, rel.cible, ctx);
          rendreFeuille(cache, cont, limite || 300);
        }
      };
    });
    if (!feuilles.length) throw new Error("Ce classeur ne contient aucune feuille visible.");
    return { type: "excel", feuilles: feuilles, liberer: function () {} };
  }

  /* ---------- Point d'entrée ---------- */
  window.QHSEOffice = {
    lire: async function (buffer) {
      var zip = await lireZip(buffer);
      if (zip.existe("word/document.xml")) return lireDocx(zip);
      if (zip.existe("xl/workbook.xml")) return lireXlsx(zip);
      throw new Error("Fichier non reconnu : seuls les documents Word (.docx) et Excel (.xlsx) sont pris en charge.");
    }
  };
})();
