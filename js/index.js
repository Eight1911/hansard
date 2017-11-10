"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var maindata = void 0;
var router = void 0;
var globs = {};
var cssnames = {
  "home": "./css/home.css",
  "word": "./css/word.css",
  "topic": "./css/topic.css"
};

var util = function () {

  function getid(id) {
    var element = document.getElementById(id);
    if (!element) throw "no element with id " + id;
    return element;
  }

  function topercent(s) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    s = "" + 100 * s;

    var _ref = s.includes(".") ? s.split(".") : [s, ""],
        _ref2 = _slicedToArray(_ref, 2),
        l = _ref2[0],
        r = _ref2[1];

    var decimal = r.slice(0, 2);
    return l + "." + decimal + "%";
  }

  function setcss(name) {
    if (!cssnames[name]) throw "css file not found for name " + name;

    d3.select('head').selectAll("link.changeable-css").attr("disabled", function (d) {
      return d.name === name ? undefined : "disabled";
    });
  }

  function clearbody() {
    return d3.select("section.body#body").html("");
  }

  function print(item) {
    return item;
  }

  function max(array) {
    if (!array.length) throw "finding maximum of an empty array";
    return array.reduce(function (a, b) {
      return a > b ? a : b;
    });
  }

  function range(start, end) {
    var array = [];
    if (end === undefined) {
      ;

      var _ref3 = [0, start];
      start = _ref3[0];
      end = _ref3[1];
    }for (var i = start; i < end; ++i) {
      array.push(i);
    }return array;
  }

  function mean(array) {
    var norm = array.reduce(function (a, b) {
      return a + b;
    });
    var summ = 0;
    for (var i = array.length; i--;) {
      summ += i * array[i];
    }return summ / (array.length * norm);
  }

  function scalemax(array) {
    var maximum = max(array);
    var rectify = maximum > 0 ? maximum : 1e-10;
    return array.map(function (d) {
      return d / maximum;
    });
  }

  function parseuri(str) {
    var args = str.split("&");
    var dict = {};
    args.forEach(function (arg) {
      var _arg$split$map = arg.split("=").map(decodeURIComponent),
          _arg$split$map2 = _slicedToArray(_arg$split$map, 2),
          key = _arg$split$map2[0],
          value = _arg$split$map2[1];

      if (key.slice(-2) === "[]" && (key = key.slice(0, -2))) key in dict ? dict[key].push(value) : dict[key] = [value];else dict[key] = value;
    });

    return dict;
  }

  return {
    getid: getid, setcss: setcss, clearbody: clearbody, topercent: topercent,
    max: max, print: print, mean: mean, range: range, scalemax: scalemax, parseuri: parseuri
  };
}();
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function home() {

  var graphpath = 'data/img/topic-graph-png';

  function initbody() {
    return d3.select("section.body#body").html("");
  }

  function inittable(body) {

    function maketable(body) {
      var table = body.append("section").attr("class", "table");
      initheader(table);
      var tbody = table.append("section").attr("class", "list tbody").selectAll("div").data(maindata.topic).enter();
      return [table, tbody];
    }

    function addid(row) {
      row.append("div").attr("class", "topic-id").text(function (d, i) {
        return i;
      });
    }

    function addfreq(row) {
      row.append("img").attr("class", "topic-freq").attr("src", function (d, i) {
        return graphpath + "/graph-" + i + ".png";
      });
    }

    function addword(row) {
      var data = row.append("div").attr("class", "topic-word").selectAll('a').data(function (d) {
        return d.words;
      }).enter().append('a').attr('href', function (d) {
        return "#/word/?word[]=" + d.word;
      }).text(function (d) {
        return d.word;
      });
    }

    function addprop(row) {
      row.append("div").attr("class", "topic-prop").text(function (d) {
        return util.topercent(d.prop);
      });
    }

    function addbar(row) {
      var props = maindata.topic.map(function (d) {
        return d.prop;
      });
      var max = util.max(props);
      row.append("div").attr("class", "topic-bar").append("div").attr("class", "topic-subbar").style("width", function (d) {
        return 100 * d.prop / max + "%";
      });
    }

    function addhidden(row) {
      var intmean = function intmean(x) {
        return Math.round(util.mean(x) * 100000);
      };
      row.append("div").attr("class", "topic-mean").text(function (d) {
        return intmean(d.wordprop);
      });
      row.append("div").attr("class", "topic-subprop").text(function (d) {
        return Math.round(d.prop * 100000);
      });
      row.append("div").attr("class", "topic-string").text(function (d) {
        return d.words.map(function (d) {
          return d.word;
        }).join(", ");
      });
    }

    function makerow(table) {
      var row = table.append("a").attr("href", function (d, i) {
        return "#/topic/" + i + "/";
      }).append("div").attr("class", "topic-row");
      return row;
    }

    function initheader(table) {
      var year = maindata.year;
      var head = table.append("div").attr("class", "row-head");
      head.append("div").attr("class", "sort row-head-id").attr("data-sort", "topic-id").text("id");
      head.append("div").attr("class", "sort row-head-freq").attr("data-sort", "topic-mean").text("frequencies");
      head.append("div").attr("class", "sort row-head-word").attr("data-sort", "topic-string").text("important words");
      head.append("div").attr("class", "sort row-head-prop").attr("data-sort", "topic-subprop").text("proportion of corpus");
    }

    function main(body) {
      var _maketable = maketable(body),
          _maketable2 = _slicedToArray(_maketable, 2),
          table = _maketable2[0],
          tbody = _maketable2[1];

      var row = makerow(tbody);
      // generate_svgs(row)
      addid(row);
      addfreq(row);
      addword(row);
      addprop(row);
      addbar(row);
      addhidden(row);
    }

    return main(body);
  }

  function setsearch(body) {
    var header = body.append("section").attr("class", "header");

    header.append("input").attr("type", "text").attr("class", "search").attr("placeholder", "search");

    header.append("input").attr("type", "text").attr("class", "fuzzy-search").attr("placeholder", "fuzzy");
  }

  function main() {
    var body = util.clearbody();
    util.setcss("home");
    setsearch(body);
    inittable(body);

    var valueNames = ['topic-id', 'topic-mean', 'topic-string', 'topic-subprop'];
    var list = new List('body', { valueNames: valueNames });
  }

  return main();
}

// this thing generates the svg 
// for filling the plot on the right
function generate_svgs(item) {

  function makegraph(item) {
    var div = item.append("div");
    var height = 30;
    var width = 100;
    var colwidth = width / maindata.year.length;
    var svg = div.append("svg").attr("class", "topic-graph").style("width", width + "em").style("height", height + "em").style("text-align", "center");

    var rects = svg.selectAll("rect").attr("topic-num", function (d, i) {
      return i;
    }).data(function (d) {
      return util.scalemax(d.wordprop);
    }).enter().append("rect").attr("width", colwidth + "em") // width / number of columns
    .attr("height", function (d) {
      return height * d + "em";
    }).attr("x", function (d, i) {
      return i * colwidth + "em";
    }).attr("y", function (d) {
      return height - height * d + "em";
    }).attr("fill", "#444");

    generate_pngs(svg);
  }

  // save files to pngs
  function generate_pngs(svgs) {
    svgs.each(function (d, i, item) {
      console.log(d, i, item[i]);
      var serializer = new XMLSerializer();
      var source = serializer.serializeToString(item[i]);
      //add name spaces.
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }
      //add xml declaration
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      setTimeout(function () {
        return saveAs(new Blob([source]), "graph-" + i + ".svg");
      }, 50 * i);
    });
  }

  return makegraph(item);
}
"use strict";

// to do add buttons links
// add filters for documents by year
// add color change on hover on list sorters

function topic(_ref, query) {
  var id = _ref.id;


  function initleft(body, topic) {

    function addwords(body, topic) {

      function push(divword, data) {
        var max = util.max(data.map(function (d) {
          return d.prop;
        }));
        divword.append("div").attr("class", "word-text").text(function (d) {
          return d.word;
        });
        divword.append("div").attr("class", "word-prop").text(function (d) {
          return util.topercent(d.prop);
        });
        divword.append("div").attr("class", "word-bar").append("div").attr("class", "word-subbar").style("width", function (d) {
          return util.topercent(d.prop / max);
        });
      }

      function main(body, topic) {
        var divword = body.append("div").attr("class", "left").selectAll("div").data(topic.words).enter().append("a").attr("href", function (d) {
          return "#/word/?word[]=" + d.word;
        }).append("div").attr("class", "word");

        push(divword, topic.words);
      }

      return main(body, topic);
    }

    function main(body, topic) {
      var left = body.append("div").attr("class", "left");
      addwords(body, topic);
    }
    return main(body, topic);
  }

  function initmidd(body, topic) {

    function initplot(midd, prop) {
      var datalen = prop.length;
      var onepart = 100 / datalen;
      var forewidth = 0.5 * onepart;
      var padding = (onepart - forewidth) / 2;

      var max = util.max(prop);
      prop = prop.map(function (x) {
        return 0.9 * x / max;
      });

      var plot = midd.append("svg").attr("class", "topic-plot").selectAll("rect").data(prop).enter();

      plot.append("rect").attr("class", "fore").attr("height", function (d) {
        return d * 100 + "%";
      }).attr("width", forewidth + "%").attr("x", function (d, i) {
        return i * onepart + padding + "%";
      }).attr("y", function (d) {
        return (1 - d) * 100 + "%";
      });

      plot.append("rect").attr("class", "back").attr("height", "100%").attr("width", onepart + 0.2 + "%").attr("x", function (d, i) {
        return i * onepart - 0.1 + "%";
      }).attr("y", "0");
    }

    function initdocs(midd, topic) {

      function addcount(docnode) {
        docnode.append("div").attr("class", "doc-count").text(function (d) {
          return d.doc.words;
        });
      }

      function addnames(docnode) {
        docnode.append("div").attr("class", "doc-name").text(function (d) {
          return d.doc.name;
        });
      }

      function addprop(docnode) {
        docnode.append("div").attr("class", "doc-prop").text(function (d) {
          return util.topercent(d.prop);
        });
      }

      function addyear(docnode) {
        docnode.append("div").attr("class", "doc-date").text(function (d) {
          return d.doc.date;
        });
      }

      function addbar(docnode, docs) {
        var max = util.max(docs.map(function (d) {
          return d.prop;
        }));
        docnode.append("div").attr("class", "doc-bar").append("div").attr("class", "doc-subbar").style("width", function (d) {
          return util.topercent(d.prop / max);
        });
      }

      function addhidden(docnode) {
        docnode.append("div").attr("class", "doc-year").text(function (d) {
          return d.doc.year;
        });
        docnode.append("div").attr("class", "doc-hidd-prop").text(function (d) {
          return Math.round(d.prop * 1000000);
        });
      }

      function addhead(midd) {
        var head = midd.append("div").attr("class", "head");

        head.append("div").attr("class", "sort head-date").attr("data-sort", "doc-date").text("date");
        head.append("div").attr("class", "sort head-name").attr("data-sort", "doc-name").text("name");
        head.append("div").attr("class", "sort head-count").attr("data-sort", "doc-count").text("tokens");
        head.append("div").attr("class", "sort head-prop").attr("data-sort", "doc-hidd-prop").text("proportion");
      }

      function putdata(docnode, data) {
        addyear(docnode);
        addnames(docnode);
        addcount(docnode);
        addprop(docnode);
        addbar(docnode, data);
        addhidden(docnode);

        var valueNames = ['doc-name', 'doc-year', 'doc-date', 'doc-count', 'doc-hidd-prop'];
        var list = new List('body', { valueNames: valueNames });
      }

      function maindoc(midd, topic) {
        var doc = maindata.doc;
        var data = topic.docs.map(function (_ref2) {
          var key = _ref2.key,
              prop = _ref2.prop;
          return { prop: prop, doc: doc[key] };
        });
        addhead(midd);
        var docnode = midd.append("div").attr("class", "topic-docs list").selectAll("p").data(data).enter().append("a").attr("href", function (d) {
          return d.doc.link;
        }).attr("target", "_blank").append("div").attr("class", "topic-doc");
        putdata(docnode, data);
      }

      return maindoc(midd, topic);
    }

    function main(topic) {
      var midd = body.append("div").attr("class", "middle");
      initplot(midd, topic.wordprop);
      initdocs(midd, topic);
    }

    return main(topic);
  }

  function initprop(body, topic) {
    var max = util.max(maindata.topic.map(function (d) {
      return d.prop;
    }));
    var topbar = body.append("div").attr("class", "proportion");
    topbar.append("h").attr("class", "topic-id").text("#" + id);
  }

  function main(id) {
    util.setcss('topic');
    var topic = maindata.topic[id];
    var body = util.clearbody();
    initprop(body, topic);
    initmidd(body, topic);
    initleft(body, topic);
  }

  return main(id);
}
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function word(_, querystr) {

  function buildgraph(body) {

    var graph = body.append("div").attr("class", "word-graph");
    var selword = body.append("div").attr("class", "right");
    return [graph, selword];

    return main(body);
  }

  function addwords(graph, words) {
    var _maindata$range = _slicedToArray(maindata.range, 2),
        start = _maindata$range[0],
        stop = _maindata$range[1];

    var range = util.range(start, stop);

    function zip_xy(a, b) {
      return a.map(function (item, ind) {
        return { x: item, y: b[ind] };
      });
    }

    function grapher(word) {
      return { label: word, values: zip_xy(range, maindata.word[word]) };
    }

    function main(graph, words) {
      var axis = d2b.chartAxis();
      var generators = [d2b.svgLine(), d2b.svgScatter()];
      var graphs = words.map(grapher);
      var sets = [{ generators: generators, graphs: graphs }];
      console.log(graphs);
      return graph.datum({ sets: sets }).call(axis);
    }

    return main(graph, words);
  }

  function main() {
    util.setcss('word');
    var body = util.clearbody();
    var query = util.parseuri(querystr);
    var words = query.word;

    var _buildgraph = buildgraph(body),
        _buildgraph2 = _slicedToArray(_buildgraph, 2),
        svg = _buildgraph2[0],
        selword = _buildgraph2[1];

    console.log("Word", words[0], query.word);

    setTimeout(function () {
      return addwords(svg, words);
    }, 100);
  }

  return main();
}
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var pathfunc = [["/topic/:id", topic], ["/word/", word], [home, undefined]];

function initcss(cssnames) {
  var data = Object.entries(cssnames).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        path = _ref2[1];

    return { name: name, path: path };
  });
  d3.select("head").selectAll("link.changeable-css").data(data).enter().append("link").attr("rel", "stylesheet").attr("id", function (d) {
    return d.name;
  }).attr("href", function (d) {
    return d.path;
  }).attr("class", function (d) {
    return "changeable-css";
  });
  // .attr("disabled", "true")
}

function inittopic(json) {
  var topic = json.topic;
  var year = json.year;
  var range = util.range(topic.length);
  var wordprop = range.map(function (i) {
    return year.map(function (row) {
      return row.wordvec[i];
    });
  });
  var docprop = range.map(function (i) {
    return year.map(function (row) {
      return row.docvec[i];
    });
  });

  topic.forEach(function (t, i) {
    t.wordprop = wordprop[i];
    t.docprop = docprop[i];
  });
}

function initialize(json) {
  console.log(json);
  maindata = json;
  inittopic(json);
  initcss(cssnames);
  router = new Navigo(null, true);
  var map = function map(_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        path = _ref4[0],
        func = _ref4[1];

    return router.on(path, func);
  };
  pathfunc.map(map);
  router.resolve();
}

d3.json("./data/data.json", initialize);
