"use strict";

var utriangle = "\u25BC",
    dtriangle = "\u25B2";

var data = {
    'coll_keys': null,
    'coll_years': null
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

  function array_comp(a, b) {
    var min = d3.min(a.length, b.length);
    for (var i = 0; i < min; ++i) {
      if (a[i] > b[i]) return -1;else if (a[i] < b[i]) return 1;
    }
    if (a.length > b.length) return -1;else if (a.length === b.length) return 0;else return 1;
  }

  function compute_mean(keys) {

    function expectation(array) {
      var norm = d3.sum(array);
      var summ = 0;
      for (var i = array.length; i--;) {
        summ += i * array[i];
      }return summ / (array.length * norm);
    }

    return keys.map(function (d) {
      return expectation(d[3]);
    });
  }

  function initialize(keys) {

    function makegraph(item) {
      var td = item.append("td").attr("class", "overtime");

      var height = 3,
          width = 10,
          colwidth = width / 104,
          // there are 104 years
      svg = td.append("svg").attr("class", "overtime").style("width", width + "vw").style("height", height + "em").style("text-align", "center").selectAll("rect").data(function (d) {
        return d[3];
      }).enter();

      svg.append("rect").attr("width", colwidth + "em") // width / number of columns
      .attr("height", function (d) {
        return height * d + "em";
      }).attr("x", function (d, i) {
        return i * colwidth + "vw";
      }).attr("y", function (d) {
        return height - height * d + "em";
      }).attr("fill", "#aaa");
    }

    // add a topic line to a div with data already entered
    function makelines(table, keys) {
      var maxprop = d3.max(keys.map(function (i) {
        return i[1];
      })),
          percent = function percent(i) {
        return Math.round(i * 100000) / 1000 + "%";
      };

      var lines = table.data(keys).enter().append("tr");

      lines.append("td").attr("class", "id").style("text-align", "center").text(function (i) {
        return i[0];
      });

      makegraph(lines);

      lines.append("td").attr("class", "words").style("text-align", "left").text(function (i) {
        return i[2].join(" ");
      });

      var svg = lines.append("td").attr("class", "freqblock").style("text-align", "right").style("width", "15vw").append("svg").attr("class", "freqblock").style("width", "15vw").style("height", "1em").append("rect").style("text-align", "left").attr("height", "1em").attr("width", function (d) {
        return 15 * d[1] / maxprop + "vw";
      }).attr("x", function (d) {
        return 15 - 15 * d[1] / maxprop + "vw";
      }).attr("fill", "#aaa");

      lines.append("td").attr("class", "percentage").text(function (i) {
        return percent(i[1]);
      }).style("width", "5vw").style("text-align", "left");
    }

    function maketable() {
      var data = [{ "text": "ID", "width": "4vw" }, { "text": "over time", "width": "11vw" }, { "text": "base words", "width": "60vw" }, { "text": "proportion", "width": "20vw" }];

      var table = d3.select("div.wrapper").append("table").attr("class", "topic-content").selectAll("div");

      var toclass = function toclass(s) {
        return "topic-top-row-" + s.split(" ").join("-");
      };
      var toelem = function toelem(s) {
        return "." + toclass(s);
      };
      var annotate = function annotate(text, asc) {
        return text + " " + (asc ? "\u25BC" : "\u25B2");
      };
      var sorter = new Sorter();
      var header = table.append('tr').attr("class", "top-row").data(data).enter().append("th").text(function (d) {
        return d["text"] === "ID" ? d["text"] + " \u25BC" : d["text"];
      }).attr("class", function (d) {
        return "topic-top-row " + toclass(d["text"]);
      }).attr("colspan", function (d) {
        return d["text"] === "proportion" ? "2" : "1";
      }).style("cursor", "pointer").style("width", function (d) {
        return d["width"];
      }).on("click", function (d) {
        var _sorter$sort = sorter.sort(d["text"]),
            _sorter$sort2 = _slicedToArray(_sorter$sort, 2),
            oldtext = _sorter$sort2[0],
            ascend = _sorter$sort2[1],
            newtext = annotate(d["text"], ascend);

        d3.select(toelem(oldtext)).text(oldtext);
        d3.select(toelem(d['text'])).text(newtext);
      });

      return table;
    }

    function main(keys) {
      var table = maketable(),
          lines = makelines(table, keys);
    }

    return main(keys);
  }

  function update(keys) {

    function makegraph(item) {
      var svg = item.select("td.overtime").select("svg.overtime");

      var height = 3,
          width = 10,
          colwidth = width / 104; // there are 104 years

      svg.selectAll("rect").data(function (d) {
        return d[3];
      }).attr("height", function (d) {
        return height * d + "em";
      }).attr("y", function (d) {
        return height - height * d + "em";
      });
    }

    function updatelines(table, keys) {
      var maxprob = d3.max(keys.map(function (i) {
        return i[1];
      })),
          percent = function percent(i) {
        return Math.round(i * 100000) / 1000 + "%";
      };

      var lines = table.selectAll("tr").data(keys);

      lines.select("td.id").text(function (i) {
        return i[0];
      });

      makegraph(lines);

      lines.select("td.words").text(function (i) {
        return i[2].join(" ");
      });

      var svg = lines.select("td.freqblock").select("svg.freqblock").select("rect").attr("width", function (d) {
        return 15 * d[1] / maxprob + "vw";
      }).attr("x", function (d) {
        return 15 - 15 * d[1] / maxprob + "vw";
      });

      lines.select("td.percentage").text(function (i) {
        return percent(i[1]);
      });
    }

    function main(keys) {
      var table = d3.select("table.topic-content");
      var lines = updatelines(table, keys);
    }

    return main(keys);
  }

  var Sorter = function () {
    function Sorter() {
      _classCallCheck(this, Sorter);

      this.sort_last = "ID";
      this.ascending = true;
    }

    _createClass(Sorter, [{
      key: "sort",
      value: function sort(name) {

        function sorter(name, ascending) {
          var means = data['means'];
          var comparison = ascending ? {
            "ID": function ID(a, b) {
              return a[0] - b[0];
            },
            "over time": function overTime(a, b) {
              return means[a[0]] - means[b[0]];
            },
            "base words": function baseWords(a, b) {
              return array_comp(a[2], b[2]);
            },
            "proportion": function proportion(a, b) {
              return a[1] - b[1];
            }
          } : {
            "ID": function ID(a, b) {
              return -(a[0] - b[0]);
            },
            "over time": function overTime(a, b) {
              return -(means[a[0]] - means[b[0]]);
            },
            "base words": function baseWords(a, b) {
              return -array_comp(a[2], b[2]);
            },
            "proportion": function proportion(a, b) {
              return -(a[1] - b[1]);
            }
          };

          return update(data['coll_keys'].sort(comparison[name]));
        }

        function main(object, name) {
          var oldtext = object.sort_last;
          if (object.sort_last === name) object.ascending = !object.ascending;else object.sort_last = name, object.ascending = false;
          sorter(object.sort_last, object.ascending);
          return [oldtext, object.ascending];
        }

        return main(this, name);
      }
    }]);

    return Sorter;
  }();

  function callback(error, keys) {
    data['coll_keys'] = keys;
    data['means'] = compute_mean(keys);
    //data['coll_years'] = years

    initialize(keys);

    d3.select("section.background").style("transition", "1.5s").style("opacity", "0");

    d3.select("div.wrapper").transition().delay(500).style("transition", "1.5s").style("opacity", "1");
  }

  d3.queue().defer(d3.json, "https://eight1911.github.io/hansard/data/coll/keys.json")
  //.defer(d3.json, "https://eight1911.github.io/page/data/coll/years.json")
  .await(callback);
})();
