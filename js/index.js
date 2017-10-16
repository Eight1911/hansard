"use strict";

var utriangle = "\u25BC",
    dtriangle = "\u25B2";

var data = {
    'coll_keys': null,
    'coll_years': null
};
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

(function () {

  function compute_mean(keys) {

    function expectation(array) {
      var norm = d3.sum(array);
      var summ = 0;
      for (var i = array.length; i--;) {
        summ += i * array[i];
      }return summ / (array.length * norm);
    }

    return keys.forEach(function (d) {
      return d.push(expectation(d[3]));
    });
  }

  function initialize(keys) {

    function makegraph(item) {
      var td = item.append("td");

      var height = 3,
          width = 10,
          colwidth = width / 104,
          // there are 104 years
      svg = td.append("svg").attr("class", "topic-graph").style("width", width + "vw").style("height", height + "em").style("text-align", "center").selectAll("rect").attr("topic-num", function (d) {
        return d[0];
      }).data(function (d) {
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

      // generate_pngs(td)
    }

    function generate_pngs(td) {
      td.selectAll("svg.topic-graph").each(function (d, i) {
        context.drawImage(image, 0, 0);
        var a = document.createElement("a");
        a.download = i + ".png";
        a.href = canvas.toDataURL("image/png");
        a.click();
      });
    }

    // add a topic line to a div with data already entered
    function makelines(tbody, keys) {
      var maxprop = d3.max(keys.map(function (i) {
        return i[1];
      })),
          percent = function percent(i) {
        return Math.round(i * 100000) / 1000 + "%";
      };

      var lines = tbody.selectAll("tr").data(keys).enter().append("tr");

      lines.append("td").attr("class", "topic-id").style("text-align", "center").text(function (d) {
        return d[0];
      });

      makegraph(lines);
      // this is for sorting with list.js only
      lines.append("td").attr("class", "topic-overtime").text(function (d) {
        return percent(d[4]);
      }).style("display", "none");

      lines.append("td").attr("class", "topic-basewords").text(function (d) {
        return d[2].join(" ");
      }).style("text-align", "left");

      var svg = lines.append("td").attr("class", "freqblock").style("text-align", "right").style("width", "15vw").append("svg").attr("class", "freqblock").style("width", "15vw").style("height", "1em").append("rect").style("text-align", "left").attr("height", "1em").attr("width", function (d) {
        return 15 * d[1] / maxprop + "vw";
      }).attr("x", function (d) {
        return 15 - 15 * d[1] / maxprop + "vw";
      }).attr("fill", "#aaa");

      lines.append("td").attr("class", "topic-proportion").text(function (d) {
        return percent(d[1]);
      }).style("width", "5vw").style("text-align", "left").style("width");
    }

    function maketable() {
      var data = [{ "class": "topic-id", "text": "id", "width": "4vw" }, { "class": "topic-overtime", "text": "over time", "width": "11vw" }, { "class": "topic-basewords", "text": "base words", "width": "60vw" }, { "class": "topic-proportion", "text": "proportion", "width": "20vw" }];

      var table = d3.select("div.topic-wrapper").append("table").attr("class", "topic-content");

      table.selectAll("tr") // doesn't matter here
      .append('tr').data(data).enter().append("th").attr("class", "sort topic-header").attr("data-sort", function (d) {
        return d.class;
      }).attr("colspan", function (d) {
        return d.text === "proportion" ? "2" : "1";
      }).style("width", function (d) {
        return d.width;
      }).text(function (d) {
        return d.text;
      });

      var tbody = table.append("tbody").attr("class", "topic-content list");

      return [tbody, data.map(function (d) {
        return d.class;
      })];
    }

    function main(keys) {
      var _maketable = maketable(),
          _maketable2 = _slicedToArray(_maketable, 2),
          tbody = _maketable2[0],
          value_names = _maketable2[1],
          lines = makelines(tbody, keys);

      new List('outer-topic-wrapper', {
        valueNames: value_names
      });
    }

    return main(keys);
  }

  function callback(error, keys) {
    data.coll_keys = keys;
    compute_mean(keys);
    initialize(keys);

    d3.select("section.background").style("transition", "1.5s").style("opacity", "0");

    d3.select("div.topic-wrapper").transition().delay(500).style("transition", "1.5s").style("opacity", "1");
  }

  d3.queue().defer(d3.json, "https://eight1911.github.io/hansard/data/coll/keys.json")
  //.defer(d3.json, "https://eight1911.github.io/hansard/data/coll/years.json")
  .await(callback);
})();
